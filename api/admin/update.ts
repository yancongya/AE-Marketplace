import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Octokit } from 'octokit';

/**
 * 更新文档 API
 * PUT /api/admin/update
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, slug, data } = req.body;

    // 验证必需参数
    if (!category || !slug || !data) {
      return res.status(400).json({ error: '缺少必要参数: category, slug, data' });
    }

    // 验证 GitHub token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: '未授权' });
    }

    const octokit = new Octokit({ auth: token });
    const owner = 'yancongya';
    const repo = 'AE-Marketplace';
    const filename = `${slug}.md`;
    const path = `public/content/${category}/${filename}`;

    // 获取文件 SHA
    let sha: string;
    try {
      const { data: fileData } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
      });
      sha = (fileData as any).sha;
    } catch (error: any) {
      if (error.status === 404) {
        return res.status(404).json({ error: '文件不存在' });
      }
      throw error;
    }

    // 生成 markdown 内容
    const content = generateMarkdown(data);

    // 更新文件
    const { data: commitData } = await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `docs: update ${category}/${slug}`,
      content: Buffer.from(content).toString('base64'),
      sha,
    });

    console.log(`[Update API] 已更新文件: ${path}, commit: ${commitData.commit.sha}`);

    return res.status(200).json({
      success: true,
      message: '更新成功',
      commit: commitData.commit.sha,
    });
  } catch (error: any) {
    console.error('更新文档失败:', error);
    return res.status(500).json({
      error: '更新失败',
      details: error.message,
    });
  }
}

// 辅助函数：生成 markdown 内容
function generateMarkdown(data: any): string {
  const frontmatter = [
    '---',
    `title: ${data.title || ''}`,
    data.iconEmoji ? `iconEmoji: ${data.iconEmoji}` : '',
    data.author ? `author: ${data.author}` : '',
    data.tags && data.tags.length > 0 ? `tags: [${data.tags.map((t: string) => `"${t}"`).join(', ')}]` : '',
    data.category ? `category: ${data.category}` : '',
    data.description ? `description: ${data.description}` : '',
    data.updatedAt ? `updatedAt: ${data.updatedAt}` : '',
    '---',
    '',
    data.content || '',
  ].filter((line) => line !== '');

  return frontmatter.join('\n');
}