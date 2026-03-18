import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { GitHubAuth } from '@/lib/github-auth';
import { GitHubAPI } from '@/lib/github-api';
import { toast } from 'sonner';

interface AdminContextType {
  isAdmin: boolean;
  user: any;
  login: (password: string) => boolean;
  loginWithGitHub: () => void;
  logout: () => void;
  githubAuth: GitHubAuth;
  githubAPI: GitHubAPI | null;
}

const ADMIN_STORAGE_KEY = 'ae-market-admin';

const AdminContext = createContext<AdminContextType | null>(null);

// GitHub 仓库配置
const GITHUB_REPO_OWNER = 'yancongya';
const GITHUB_REPO_NAME = 'AE-Marketplace';

export function AdminProvider({ children }: { children: ReactNode }) {
  // 从 localStorage 读取初始状态（仅在开发模式）
  const getInitialAdminState = () => {
    if (import.meta.env.DEV) {
      try {
        return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
      } catch {
        return false;
      }
    }
    return false;
  };

  const [isAdmin, setIsAdmin] = useState(getInitialAdminState);
  const [user, setUser] = useState<any>(null);
  const [githubAuth] = useState(() => new GitHubAuth());
  const [githubAPI, setGithubAPI] = useState<GitHubAPI | null>(null);

  // 检查 GitHub 认证状态
  useEffect(() => {
    checkGitHubAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 只在组件挂载时执行一次
  
  // 监听 URL 变化（处理 OAuth 回调后的重新检查）
  useEffect(() => {
    const handleRouteChange = () => {
      console.log('Route changed, checking auth...');
      if (githubAuth.isAuthenticated() && !isAdmin) {
        checkGitHubAuth();
      }
    };
    
    handleRouteChange();
  }, []); // 只执行一次

  const checkGitHubAuth = async () => {
    console.log('Checking GitHub authentication...');
    const isAuthenticated = githubAuth.isAuthenticated();
    console.log('Authentication status:', isAuthenticated);
    
    if (isAuthenticated) {
      try {
        const userInfo = await githubAuth.getUserInfo();
        console.log('GitHub user info:', { login: userInfo.login, id: userInfo.id });
        setUser(userInfo);
        
        // 诊断权限
        console.log('Starting permission diagnosis...');
        const diagnosis = await githubAuth.diagnosePermissions(GITHUB_REPO_OWNER, GITHUB_REPO_NAME);
        console.log('Permission diagnosis result:', diagnosis);
        
        if (diagnosis.hasAccess) {
          console.log('✅ User has admin access, setting isAdmin to true');
          setIsAdmin(true);
          const token = githubAuth.getAccessToken();
          if (token) {
            setGithubAPI(new GitHubAPI(token, GITHUB_REPO_OWNER, GITHUB_REPO_NAME));
            console.log('✅ GitHub API initialized successfully');
          }
        } else {
          console.warn('❌ User does not have admin access');
          console.warn('Reason:', diagnosis.reason);
          console.warn('Permissions:', diagnosis.permissions);
          
          // 只显示一次提示
          if (!diagnosis.hasAccess && diagnosis.permissions) {
            toast.error(`没有管理员权限: ${diagnosis.reason}`);
          }
        }
      } catch (error) {
        console.error('GitHub auth check failed:', error);
        toast.error('GitHub 认证检查失败');
      }
    } else {
      console.log('User not authenticated');
    }
  };

  const login = (password: string): boolean => {
    if (password === 'adminadmin') {
      setIsAdmin(true);
      // 保存到 localStorage（仅在开发模式）
      if (import.meta.env.DEV) {
        try {
          localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
        } catch (e) {
          console.warn('Failed to save admin state to localStorage:', e);
        }
      }
      return true;
    }
    return false;
  };

  const loginWithGitHub = () => {
    githubAuth.login();
  };

  const logout = () => {
    setIsAdmin(false);
    setUser(null);
    setGithubAPI(null);
    githubAuth.logout();
    
    // 从 localStorage 移除（仅在开发模式）
    if (import.meta.env.DEV) {
      try {
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      } catch (e) {
        console.warn('Failed to remove admin state from localStorage:', e);
      }
    }
  };

  return (
    <AdminContext.Provider value={{ isAdmin, user, login, loginWithGitHub, logout, githubAuth, githubAPI }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}