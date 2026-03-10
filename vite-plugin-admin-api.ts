import fs from 'fs';
import path from 'path';
import { Plugin } from 'vite';

/**
 * Vite 插件：提供管理员 API（仅在开发模式）
 * 支持删除文件和更新 manifest
 */
export function adminApiPlugin(): Plugin {
  return {
    name: 'admin-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // 设置 CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // 处理 OPTIONS 请求
        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          return res.end();
        }

        // 删除文件 API
        if (req.url?.startsWith('/api/admin/delete') && req.method === 'DELETE') {
          try {
            const body = await getRequestBody(req);
            const { category, filename } = JSON.parse(body);

            if (!category || !filename) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: '缺少必要参数' }));
              return;
            }

            const contentPath = path.resolve(__dirname, 'public', 'content', category);
            const filePath = path.join(contentPath, filename);

            // 检查文件是否存在
            if (!fs.existsSync(filePath)) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: '文件不存在' }));
              return;
            }

            // 删除文件
            fs.unlinkSync(filePath);

            // 更新 manifest
            const manifestPath = path.join(contentPath, '_manifest.json');
            if (fs.existsSync(manifestPath)) {
              const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
              const index = manifest.indexOf(filename);
              if (index > -1) {
                manifest.splice(index, 1);
                fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
              }
            }

            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, message: '删除成功' }));
          } catch (error) {
            console.error('删除文件失败:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: '删除失败', details: error instanceof Error ? error.message : '未知错误' }));
          }
          return;
        }

        next();
      });
    },
  };
}

// 辅助函数：解析请求体
function getRequestBody(req: any): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: string) => body += chunk);
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}