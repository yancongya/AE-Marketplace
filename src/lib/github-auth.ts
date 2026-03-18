import { Octokit } from 'octokit';

export class GitHubAuth {
  private clientId = import.meta.env.GITHUB_CLIENT_ID || import.meta.env.VITE_GITHUB_CLIENT_ID || import.meta.env.github_client_id || 'Ov23ctbnN11TFhlROjMr';
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
    console.log('handleCallback: Starting callback handling');
    
    const code = params.get('code');
    const state = params.get('state');
    
    console.log('handleCallback: Parameters:', {
      code: code ? `${code.substring(0, 10)}...` : 'missing',
      state: state ? `${state.substring(0, 10)}...` : 'missing',
    });
    
    // 验证 state
    const storedState = sessionStorage.getItem('oauth_state');
    console.log('handleCallback: State verification:', {
      provided: state ? `${state.substring(0, 10)}...` : 'missing',
      stored: storedState ? `${storedState.substring(0, 10)}...` : 'missing',
      match: state === storedState
    });
    
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }
    
    const codeVerifier = sessionStorage.getItem('code_verifier');
    if (!codeVerifier) {
      console.error('handleCallback: Code verifier not found in sessionStorage');
      throw new Error('Code verifier not found');
    }
    
    console.log('handleCallback: Calling GitHub API via proxy');
    try {
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

      console.log('handleCallback: Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('handleCallback: Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('handleCallback: GitHub response:', {
        hasError: !!data.error,
        error: data.error || null,
        hasAccessToken: !!data.access_token,
      });

      if (data.error) {
        console.error('OAuth error:', data);
        throw new Error(data.error_description || data.error);
      }

      // 存储 access token
      console.log('handleCallback: Storing access token to localStorage');
      localStorage.setItem('github_access_token', data.access_token);
      console.log('handleCallback: Access token stored successfully');
      
      // 触发自定义事件通知其他组件
      console.log('handleCallback: Dispatching github_auth_success event');
      const authEvent = new CustomEvent('github_auth_success', {
        detail: { accessToken: data.access_token }
      });
      console.log('handleCallback: Event created, dispatching...');
      window.dispatchEvent(authEvent);
      console.log('handleCallback: Event dispatched successfully');

      // 清理 sessionStorage
      sessionStorage.removeItem('code_verifier');
      sessionStorage.removeItem('oauth_state');

      return data.access_token;
    } catch (error) {
      console.error('handleCallback: Fetch error:', error);
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
    if (!octokit) {
      console.warn('No Octokit instance available');
      return false;
    }
    
    try {
      // 尝试获取仓库信息
      const { data: repoData } = await octokit.rest.repos.get({
        owner,
        repo,
      });
      
      console.log('Repository found:', {
        name: repoData.name,
        visibility: repoData.visibility,
        permissions: repoData.permissions,
        owner: repoData.owner.login,
      });
      
      // 检查用户是否有写入权限
      const hasWritePermission = repoData.permissions?.push === true || 
                                  repoData.permissions?.admin === true;
      
      console.log('Write permission check:', hasWritePermission);
      
      if (!hasWritePermission) {
        console.warn('User does not have write permission. Permissions:', repoData.permissions);
      }
      
      return hasWritePermission;
    } catch (error: any) {
      console.error('Repo access check failed:', {
        owner,
        repo,
        error: error.message,
        status: error.status,
      });
      return false;
    }
  }
  
  // 诊断权限问题
  async diagnosePermissions(owner: string, repo: string): Promise<{
    authenticated: boolean;
    user: any;
    repoExists: boolean;
    permissions: any;
    hasAccess: boolean;
    reason: string;
  }> {
    const octokit = this.getOctokit();
    if (!octokit) {
      return {
        authenticated: false,
        user: null,
        repoExists: false,
        permissions: null,
        hasAccess: false,
        reason: 'Not authenticated'
      };
    }
    
    try {
      // 获取用户信息
      const { data: user } = await octokit.rest.users.getAuthenticated();
      
      // 获取仓库信息
      const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
      
      return {
        authenticated: true,
        user: { login: user.login, id: user.id },
        repoExists: true,
        permissions: repoData.permissions,
        hasAccess: repoData.permissions?.push === true || 
                  repoData.permissions?.admin === true,
        reason: repoData.permissions?.push === true ? 
          'User has push permission' : 
          repoData.permissions?.admin === true ?
          'User is admin' :
          'User only has read permission'
      };
    } catch (error: any) {
      return {
        authenticated: true,
        user: null,
        repoExists: false,
        permissions: null,
        hasAccess: false,
        reason: `Error: ${error.message} (${error.status})`
      };
    }
  }
}