import { createContext, useContext, useState, type ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const ADMIN_STORAGE_KEY = 'ae-market-admin';

const AdminContext = createContext<AdminContextType | null>(null);

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

  const logout = () => {
    setIsAdmin(false);
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
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
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