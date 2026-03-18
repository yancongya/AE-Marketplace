import type { VercelRequest, VercelResponse } from '@vercel/node';

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

  const { code, code_verifier, client_id } = req.body;
  
  // 从环境变量获取 client_secret
  const client_secret = process.env.GITHUB_CLIENT_SECRET || process.env.VITE_GITHUB_CLIENT_SECRET;

  console.log('GitHub OAuth callback:', {
    code: code ? code.substring(0, 10) + '...' : 'missing',
    code_verifier: code_verifier ? code_verifier.substring(0, 10) + '...' : 'missing',
    client_id: client_id ? client_id.substring(0, 10) + '...' : 'missing',
    has_client_secret: !!client_secret,
  });

  try {
    const requestBody: any = {
      client_id,
      code,
      code_verifier,
    };
    
    // 如果有 client_secret，添加到请求中
    if (client_secret) {
      requestBody.client_secret = client_secret;
    }

    console.log('Sending to GitHub:', {
      url: 'https://github.com/login/oauth/access_token',
      body_keys: Object.keys(requestBody),
      with_secret: !!client_secret,
    });

    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    console.log('GitHub response:', {
      status: response.status,
      has_error: !!data.error,
      error: data.error || null,
      error_description: data.error_description || null,
      has_access_token: !!data.access_token,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error('Token exchange error:', error);
    return res.status(500).json({ error: 'Failed to exchange token' });
  }
}