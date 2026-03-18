import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Octokit } from 'octokit';

/**
 * 创建新文档 API
 * POST /api/admin/create
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, slug, data } = req.body;

    // 验证必需参数
    if (!category || !data) {
      return res.status(400).json({ error: '缺少必要参数: category, data' });
    }

    // 验证 GitHub token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: '未授权' });
    }

    const octokit = new Octokit({ auth: token });
    const owner = 'yancongya';
    const repo = 'AE-Marketplace';

    // 如果没有提供 slug，自动生成
    let finalSlug = slug;
    if (!finalSlug) {
      finalSlug = `temp-${Date.now()}`;
    }

    // 验证 slug（仅限英文）
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(finalSlug)) {
      return res.status(400).json({ error: '文档名只能包含英文小写字母、数字和连字符' });
    }

    const filename = `${finalSlug}.md`;
    const path = `public/content/${category}/${filename}`;

    // 生成 markdown 内容
    const content = generateMarkdown(data);

    // 检查文件是否已存在
    try {
      await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
      });
      return res.status(409).json({ error: '文件已存在' });
    } catch (error: any) {
      if (error.status !== 404) {
        throw error;
      }
      // 文件不存在，继续创建
    }

    // 创建文件
    const { data: commitData } = await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `docs: create ${category}/${finalSlug}`,
      content: Buffer.from(content).toString('base64'),
    });

    console.log(`[Create API] 已创建文件: ${path}, commit: ${commitData.commit.sha}`);

    // 更新 manifest
    try {
      const manifestPath = `public/content/${category}/_manifest.json`;
      let manifest: string[] = [];

      // 获取现有的 manifest
      try {
        const { data: manifestData } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: manifestPath,
        });
        const manifestContent = Buffer.from((manifestData as any).content, 'base64').toString('utf-8');
        manifest = JSON.parse(manifestContent);
      } catch (error: any) {
        if (error.status !== 404) {
          throw error;
        }
        // manifest 不存在，创建新的
      }

      // 添加新文件到 manifest
      if (!manifest.includes(filename)) {
        manifest.push(filename);

        // 提交更新的 manifest
        await octokit.rest.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: manifestPath,
          message: `docs: update manifest for ${category}`,
          content: Buffer.from(JSON.stringify(manifest, null, 2)).toString('base64'),
        });

        console.log(`[Create API] 已更新 manifest: ${manifestPath}`);
      }
    } catch (manifestError) {
      console.error('[Create API] 更新 manifest 失败:', manifestError);
      // manifest 更新失败不影响主功能，继续返回成功
    }

    return res.status(200).json({
      success: true,
      slug: finalSlug,
      message: '创建成功',
      commit: commitData.commit.sha,
    });
  } catch (error: any) {
    console.error('创建文档失败:', error);
    return res.status(500).json({
      error: '创建失败',
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