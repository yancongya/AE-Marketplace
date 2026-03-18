import { Octokit } from 'octokit';

export class GitHubAuth {
  private clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || 'Ov23ctbnN11TFhlROjMr';
  private redirectUri = `${window.location.origin}/callback`;
  private scope = 'public_repo user:email';
  
  // 生成 code_verifier
  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // 生成 code_challenge
  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  
  // 生成随机 state
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
  
  // 开始登录流程
  async login(): Promise<void> {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    const state = this.generateState();
    
    // 存储到 sessionStorage
    sessionStorage.setItem('code_verifier', codeVerifier);
    sessionStorage.setItem('oauth_state', state);
    
    // 构建授权 URL
    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.append('client_id', this.clientId);
    authUrl.searchParams.append('redirect_uri', this.redirectUri);
    authUrl.searchParams.append('scope', this.scope);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');
    
    // 重定向到 GitHub
    window.location.href = authUrl.toString();
  }
  
  // 处理回调
  async handleCallback(params: URLSearchParams): Promise<string | null> {
    const code = params.get('code');
    const state = params.get('state');

    // 验证 state
    const storedState = sessionStorage.getItem('oauth_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }

    const codeVerifier = sessionStorage.getItem('code_verifier');
    if (!codeVerifier) {
      throw new Error('Code verifier not found');
    }

    try {
      // 尝试通过 Vercel Serverless Function 代理调用
      const response = await fetch('/api/github-callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          code_verifier: codeVerifier,
          client_id: this.clientId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error_description || data.error);
      }

      // 存储 access token
      localStorage.setItem('github_access_token', data.access_token);

      // 清理 sessionStorage
      sessionStorage.removeItem('code_verifier');
      sessionStorage.removeItem('oauth_state');

      return data.access_token;
    } catch (error) {
      console.error('Token exchange failed:', error);
      throw new Error('Failed to exchange access token');
    }
  }
  
  // 获取 access token
  getAccessToken(): string | null {
    return localStorage.getItem('github_access_token');
  }
  
  // 登出
  logout(): void {
    localStorage.removeItem('github_access_token');
  }
  
  // 检查是否已登录
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
  
  // 获取 Octokit 实例
  getOctokit(): Octokit | null {
    const token = this.getAccessToken();
    if (!token) return null;
    
    return new Octokit({
      auth: token,
    });
  }
  
  // 获取用户信息
  async getUserInfo(): Promise<any> {
    const octokit = this.getOctokit();
    if (!octokit) throw new Error('Not authenticated');
    
    const { data } = await octokit.rest.users.getAuthenticated();
    return data;
  }
  
  // 检查用户是否有权限
  async hasRepoAccess(owner: string, repo: string): Promise<boolean> {
    const octokit = this.getOctokit();
    if (!octokit) return false;
    
    try {
      await octokit.rest.repos.get({
        owner,
        repo,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}