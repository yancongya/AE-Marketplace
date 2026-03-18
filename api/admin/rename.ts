import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Octokit } from 'octokit';

/**
 * 重命名文档 API
 * POST /api/admin/rename
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
    const { category, oldSlug, newSlug, data } = req.body;

    // 验证必需参数
    if (!category || !oldSlug || !newSlug || !data) {
      return res.status(400).json({ error: '缺少必要参数: category, oldSlug, newSlug, data' });
    }

    // 验证 GitHub token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: '未授权' });
    }

    const octokit = new Octokit({ auth: token });
    const owner = 'yancongya';
    const repo = 'AE-Marketplace';

    const oldFilename = `${oldSlug}.md`;
    const newFilename = `${newSlug}.md`;
    const oldPath = `public/content/${category}/${oldFilename}`;
    const newPath = `public/content/${category}/${newFilename}`;

    // 验证 newSlug（仅限英文）
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(newSlug)) {
      return res.status(400).json({ error: '文档名只能包含英文小写字母、数字和连字符' });
    }

    // 检查旧文件是否存在
    let oldSha: string;
    try {
      const { data: oldFileData } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: oldPath,
      });
      oldSha = (oldFileData as any).sha;
    } catch (error: any) {
      if (error.status === 404) {
        return res.status(404).json({ error: '源文件不存在' });
      }
      throw error;
    }

    // 检查新文件名是否已存在
    try {
      await octokit.rest.repos.getContent({
        owner,
        repo,
        path: newPath,
      });
      return res.status(409).json({ error: '目标文件名已存在' });
    } catch (error: any) {
      if (error.status !== 404) {
        throw error;
      }
      // 目标文件不存在，继续创建
    }

    // 生成新文件内容
    const content = generateMarkdown(data);

    // 创建新文件
    const { data: createCommitData } = await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: newPath,
      message: `docs: rename ${category}/${oldSlug} to ${newSlug}`,
      content: Buffer.from(content).toString('base64'),
    });

    console.log(`[Rename API] 已创建新文件: ${newPath}, commit: ${createCommitData.commit.sha}`);

    // 删除旧文件
    try {
      const { data: deleteCommitData } = await octokit.rest.repos.deleteFile({
        owner,
        repo,
        path: oldPath,
        message: `docs: remove old file ${category}/${oldSlug}`,
        sha: oldSha,
      });

      console.log(`[Rename API] 已删除旧文件: ${oldPath}, commit: ${deleteCommitData.commit.sha}`);
    } catch (deleteError: any) {
      console.error(`[Rename API] 删除旧文件失败: ${oldPath}`, deleteError);
      // 即使删除失败也继续执行，因为新文件已经创建
    }

    // 更新 manifest
    try {
      const manifestPath = `public/content/${category}/_manifest.json`;
      let manifest: string[] = [];
      let manifestSha: string | undefined = undefined;

      // 获取现有的 manifest
      try {
        const { data: manifestData } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: manifestPath,
        });
        const manifestContent = Buffer.from((manifestData as any).content, 'base64').toString('utf-8');
        manifest = JSON.parse(manifestContent);
        manifestSha = (manifestData as any).sha;
      } catch (error: any) {
        if (error.status !== 404) {
          throw error;
        }
        // manifest 不存在，创建新的
      }

      // 替换旧文件名为新文件名
      const oldIndex = manifest.indexOf(oldFilename);
      if (oldIndex > -1) {
        manifest.splice(oldIndex, 1);
      }
      if (!manifest.includes(newFilename)) {
        manifest.push(newFilename);
      }

      // 提交更新的 manifest
      if (manifestSha) {
        // 文件已存在，需要提供 SHA
        await octokit.rest.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: manifestPath,
          message: `docs: update manifest for ${category}`,
          content: Buffer.from(JSON.stringify(manifest, null, 2)).toString('base64'),
          sha: manifestSha,
        });
      } else {
        // 文件不存在，创建新文件
        await octokit.rest.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: manifestPath,
          message: `docs: create manifest for ${category}`,
          content: Buffer.from(JSON.stringify(manifest, null, 2)).toString('base64'),
        });
      }

      console.log(`[Rename API] 已更新 manifest: ${manifestPath}`);
    } catch (manifestError) {
      console.error('[Rename API] 更新 manifest 失败:', manifestError);
      // manifest 更新失败不影响主功能，继续返回成功
    }

    return res.status(200).json({
      success: true,
      newSlug,
      message: '重命名成功',
      commit: createCommitData.commit.sha,
    });
  } catch (error: any) {
    console.error('重命名文档失败:', error);
    return res.status(500).json({
      error: '重命名失败',
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