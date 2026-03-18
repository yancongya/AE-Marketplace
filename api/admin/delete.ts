import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Octokit } from 'octokit';

/**
 * 删除文档 API
 * DELETE /api/admin/delete
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, filename } = req.body;

    // 验证必需参数
    if (!category || !filename) {
      return res.status(400).json({ error: '缺少必要参数: category, filename' });
    }

    // 验证 GitHub token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: '未授权' });
    }

    const octokit = new Octokit({ auth: token });
    const owner = 'yancongya';
    const repo = 'AE-Marketplace';
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

    // 删除文件
    const { data: commitData } = await octokit.rest.repos.deleteFile({
      owner,
      repo,
      path,
      message: `docs: delete ${category}/${filename}`,
      sha,
    });

    console.log(`[Delete API] 已删除文件: ${path}, commit: ${commitData.commit.sha}`);

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

      // 从 manifest 中移除文件
      const index = manifest.indexOf(filename);
      if (index > -1) {
        manifest.splice(index, 1);

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

        console.log(`[Delete API] 已更新 manifest: ${manifestPath}`);
      }
    } catch (manifestError) {
      console.error('[Delete API] 更新 manifest 失败:', manifestError);
      // manifest 更新失败不影响主功能，继续返回成功
    }

    return res.status(200).json({
      success: true,
      message: '删除成功',
      commit: commitData.commit.sha,
    });
  } catch (error: any) {
    console.error('删除文档失败:', error);
    return res.status(500).json({
      error: '删除失败',
      details: error.message,
    });
  }
}