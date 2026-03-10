import { Link, useLocation } from 'react-router-dom';
import { Globe, Moon, Sun, Code, FileCode, Layers, Box, Lock } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/contexts/I18nContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useEffect, useState } from 'react';
import { loadContent } from '@/lib/content';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();
  const { isAdmin, login, logout } = useAdmin();
  const location = useLocation();
  const [itemCounts, setItemCounts] = useState({
    expressions: 0,
    scripts: 0,
    presets: 0,
    extensions: 0,
  });
  const [readyClickCount, setReadyClickCount] = useState(0);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState('');

  const handleReadyBadgeClick = () => {
    if (import.meta.env.DEV) {
      if (isAdmin) {
        // 已登录时点击直接退出
        handleLogout();
      } else {
        // 未登录时连续5次点击触发登录
        const newCount = readyClickCount + 1;
        setReadyClickCount(newCount);

        if (newCount >= 5) {
          setReadyClickCount(0);
          setIsPasswordDialogOpen(true);
        }
      }
    }
  };

  const handlePasswordSubmit = () => {
    if (login(password)) {
      toast.success('管理员模式已启用');
      setIsPasswordDialogOpen(false);
      setPassword('');
    } else {
      toast.error('密码错误');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('已退出管理员模式');
  };

  useEffect(() => {
    loadContent().then(data => {
      setItemCounts({
        expressions: data.expressions.length,
        scripts: data.scripts.length,
        presets: data.presets.length,
        extensions: data.extensions.length,
      });
    });
  }, []);

  const navItems = [
    { id: 'expressions', icon: Code, href: '/expressions', count: itemCounts.expressions },
    { id: 'scripts', icon: FileCode, href: '/scripts', count: itemCounts.scripts },
    { id: 'presets', icon: Layers, href: '/presets', count: itemCounts.presets },
    { id: 'extensions', icon: Box, href: '/extensions', count: itemCounts.extensions },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl bg-background border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Left: Status badge and path */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/favicon.svg" alt="AE Scripts" className="w-8 h-8" />
              <span
                onClick={handleReadyBadgeClick}
                className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono bg-secondary text-muted-foreground cursor-pointer"
                title={isAdmin ? '点击退出管理员模式' : '连续点击5次进入管理员模式'}
              >
                <span className="w-2 h-2 rounded-full bg-success" />
                ready
              </span>
            </Link>
            <Link
              to="/"
              className="flex items-center gap-1 font-mono text-sm hover:opacity-80 transition-opacity"
            >
              <span className="text-muted-foreground">~</span>
              <span className="text-foreground">/AE-Marketplace</span>
            </Link>
          </div>

          {/* Center: Command-style navigation buttons */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded border font-mono text-xs transition-all duration-200 ${
                    isActive(item.href)
                      ? 'border-primary bg-secondary'
                      : 'border-border bg-secondary hover:border-primary/50 hover:bg-muted'
                  }`}
                >
                  <span className="text-success">$</span>
                  <span className="text-success">cd</span>
                  <span className="text-foreground">/{t(`nav.${item.id}`)}</span>
                  <Icon className={`w-3 h-3 ${isActive(item.href) ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`ml-1 text-xs ${isActive(item.href) ? 'text-primary' : 'text-muted-foreground'}`}>
                    {item.count}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right: Theme toggle, language, admin */}
          <div className="flex items-center gap-2">
            {import.meta.env.DEV && isAdmin && (
              <div
                className="p-2"
                title="管理员模式已启用"
              >
                <Lock className="w-4 h-4 text-primary" />
              </div>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded hover:bg-muted transition-colors"
              title={isDark ? t('common.themeToggle.light') : t('common.themeToggle.dark')}
            >
              {isDark ? (
                <Moon className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Sun className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <button
              onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
              className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-muted transition-colors font-mono text-xs text-muted-foreground"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{locale.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Login Dialog */}
      <Dialog.Root open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 bg-background border border-border rounded-lg shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">管理员登录</Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground mb-4">
              请输入管理员密码以访问管理模式
            </Dialog.Description>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePasswordSubmit();
              }}
              autoComplete="off"
            >
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入密码"
                className="mb-4"
                autoComplete="off"
              />
            </form>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handlePasswordSubmit}>
                登录
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </nav>
  );
}
