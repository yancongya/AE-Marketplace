import { useState, useEffect } from 'react';
import { Code, FileCode, Layers, Box, Globe, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isDark: boolean;
  onThemeChange: (value: boolean) => void;
}

export function Navbar({ currentView, onViewChange, isDark, onThemeChange }: NavbarProps) {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');

  const navItems = [
    { id: 'expressions', label: '表达式', icon: Code, href: '#expressions' },
    { id: 'scripts', label: '脚本', icon: FileCode, href: '#scripts' },
    { id: 'presets', label: '预设', icon: Layers, href: '#presets' },
    { id: 'extensions', label: '扩展', icon: Box, href: '#extensions' },
  ];

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && navItems.some(item => item.id === hash)) {
        onViewChange(hash);
      } else if (!hash) {
        onViewChange('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [onViewChange]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left side - Logo and status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono bg-success/10 text-success">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                ready
              </span>
            </div>
            <button
              onClick={() => onViewChange('home')}
              className="flex items-center gap-2 font-mono text-sm hover:opacity-80 transition-opacity"
            >
              <span className="text-muted-foreground">~</span>
              <span className="text-primary">/</span>
              <span className="text-foreground font-semibold">aescripts</span>
            </button>
          </div>

          {/* Center - Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`nav-button flex items-center gap-2 font-mono text-xs ${
                  currentView === item.id ? 'border-blue-500/50 bg-blue-500/10' : ''
                }`}
              >
                <span className={currentView === item.id ? 'text-primary' : 'text-muted-foreground'}>
                  <item.icon className="w-3.5 h-3.5" />
                </span>
                <span className={currentView === item.id ? 'text-primary' : 'text-foreground'}>
                  {item.label}
                </span>
              </a>
            ))}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onThemeChange(!isDark)}
              className="p-2 rounded-md hover:bg-secondary transition-colors"
            >
              {isDark ? (
                <Moon className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Sun className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <button
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-secondary transition-colors font-mono text-xs text-muted-foreground"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang.toUpperCase()}</span>
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
}
