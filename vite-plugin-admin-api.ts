import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

/**
 * Vite 插件：提供管理员 API（仅在开发模式）
 * 支持删除、更新文件
 */
export function adminApiPlugin(): Plugin {
  return {
    name: 'admin-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // 设置 CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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

        // 改名文件 API
        if (req.url?.startsWith('/api/admin/rename') && req.method === 'POST') {
          try {
            const body = await getRequestBody(req);
            const { category, oldSlug, newSlug, data } = JSON.parse(body);

            if (!category || !oldSlug || !newSlug || !data) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: '缺少必要参数' }));
              return;
            }

            const contentPath = path.resolve(__dirname, 'public', 'content', category);
            const oldFilename = `${oldSlug}.md`;
            const newFilename = `${newSlug}.md`;
            const oldFilePath = path.join(contentPath, oldFilename);
            const newFilePath = path.join(contentPath, newFilename);

            // 检查旧文件是否存在
            if (!fs.existsSync(oldFilePath)) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: '文件不存在' }));
              return;
            }

            // 检查新文件名是否已存在
            if (fs.existsSync(newFilePath)) {
              res.statusCode = 409;
              res.end(JSON.stringify({ error: '目标文件名已存在' }));
              return;
            }

            // 生成新的 markdown 内容
            const markdown = generateMarkdown(data);

            // 写入新文件
            fs.writeFileSync(newFilePath, markdown, 'utf-8');
            console.log(`[Rename API] 已创建新文件: ${newFilePath}`);

            // 删除旧文件
            try {
              fs.unlinkSync(oldFilePath);
              console.log(`[Rename API] 已删除旧文件: ${oldFilePath}`);
            } catch (deleteError) {
              console.error(`[Rename API] 删除旧文件失败: ${oldFilePath}`, deleteError);
              // 即使删除失败也继续执行，因为新文件已经创建
            }

            // 更新 manifest
            const manifestPath = path.join(contentPath, '_manifest.json');
            if (fs.existsSync(manifestPath)) {
              const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
              const oldIndex = manifest.indexOf(oldFilename);
              if (oldIndex > -1) {
                manifest.splice(oldIndex, 1);
              }
              manifest.push(newFilename);
              fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
              console.log(`[Rename API] 已更新 manifest: ${manifestPath}`);
            }

            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, newSlug, message: '改名成功' }));
          } catch (error) {
            console.error('改名文件失败:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: '改名失败', details: error instanceof Error ? error.message : '未知错误' }));
          }
          return;
        }

        // 创建新文档 API
        if (req.url?.startsWith('/api/admin/create') && req.method === 'POST') {
          try {
            const body = await getRequestBody(req);
            const { category, slug, data } = JSON.parse(body);

            if (!category || !data) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: '缺少必要参数' }));
              return;
            }

            // 如果没有提供 slug，自动生成临时 slug
            let finalSlug = slug;
            if (!finalSlug) {
              finalSlug = `temp-${Date.now()}`;
            }

            // 验证 slug（仅限英文）
            const slugRegex = /^[a-z0-9-]+$/;
            if (!slugRegex.test(finalSlug)) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: '文档名只能包含英文小写字母、数字和连字符' }));
              return;
            }

            const contentPath = path.resolve(__dirname, 'public', 'content', category);
            const filename = `${finalSlug}.md`;
            const filePath = path.join(contentPath, filename);

            // 检查文件是否已存在
            if (fs.existsSync(filePath)) {
              res.statusCode = 409;
              res.end(JSON.stringify({ error: '文件已存在' }));
              return;
            }

            // 生成 markdown 内容
            const markdown = generateMarkdown(data);

            // 写入新文件
            fs.writeFileSync(filePath, markdown, 'utf-8');
            console.log(`[Create API] 已创建新文件: ${filePath}`);

            // 更新 manifest
            const manifestPath = path.join(contentPath, '_manifest.json');
            if (fs.existsSync(manifestPath)) {
              const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
              manifest.push(filename);
              fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
              console.log(`[Create API] 已更新 manifest: ${manifestPath}`);
            }

            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, slug: finalSlug, message: '创建成功' }));
          } catch (error) {
            console.error('创建文档失败:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: '创建失败', details: error instanceof Error ? error.message : '未知错误' }));
          }
          return;
        }

        // 更新文件 API
        if (req.url?.startsWith('/api/admin/update') && req.method === 'PUT') {
          try {
            const body = await getRequestBody(req);
            const { category, slug, data } = JSON.parse(body);

            if (!category || !slug || !data) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: '缺少必要参数' }));
              return;
            }

            const contentPath = path.resolve(__dirname, 'public', 'content', category);
            const filename = `${slug}.md`;
            const filePath = path.join(contentPath, filename);

            // 检查文件是否存在
            if (!fs.existsSync(filePath)) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: '文件不存在' }));
              return;
            }

            // 生成 markdown 内容
            const markdown = generateMarkdown(data);

            // 写入文件
            fs.writeFileSync(filePath, markdown, 'utf-8');

            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, message: '更新成功' }));
          } catch (error) {
            console.error('更新文件失败:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: '更新失败', details: error instanceof Error ? error.message : '未知错误' }));
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

// 辅助函数：生成 markdown 内容
function generateMarkdown(data: any): string {
  const frontmatter = [
    '---',
    `title: ${data.title || ''}`,
    data.iconEmoji ? `iconEmoji: ${data.iconEmoji}` : '',
    data.author ? `author: ${data.author}` : '',
    data.tags && data.tags.length > 0 ? `tags: [${data.tags.map((t: string) => `"${t}"`).join(', ')}]` : '',
    data.description ? `description: ${data.description}` : '',
    data.updatedAt ? `updatedAt: ${data.updatedAt}` : '',
    data.isFavorite !== undefined ? `isFavorite: ${data.isFavorite}` : '',
    '---',
    '',
    data.content || ''
  ].filter(line => line !== '');

  return frontmatter.join('\n');
}