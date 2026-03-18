import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Octokit } from 'octokit';

/**
 * 删除文档 API
 * DELETE /api/admin/delete
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    const path = `content/${category}/${filename}`;

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