import { Link, useLocation } from 'react-router-dom';
import { Globe, Moon, Sun, Code, FileCode, Layers, Box } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/contexts/I18nContext';
import { useEffect, useState } from 'react';
import { loadContent } from '@/lib/content';

export function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();
  const location = useLocation();
  const [itemCounts, setItemCounts] = useState({
    expressions: 0,
    scripts: 0,
    presets: 0,
    extensions: 0,
  });

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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl bg-[#0D0D0D] border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Left: Status badge and path */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/logo.svg" alt="AE Scripts" className="w-8 h-8" />
              <span className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono bg-[#2D2D2D] text-[#CCCCCC]">
                <span className="w-2 h-2 rounded-full bg-[#00FF85]" />
                ready
              </span>
            </Link>
            <Link
              to="/"
              className="flex items-center gap-1 font-mono text-sm hover:opacity-80 transition-opacity"
            >
              <span className="text-[#CCCCCC]">~</span>
              <span className="text-[#FFFFFF]">/AE-Marketplace</span>
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
                      ? 'border-[#00B4D8] bg-[#1E1E1E]'
                      : 'border-[#444444] bg-[#1E1E1E] hover:border-[#66CCFF] hover:bg-[#2A2A2A]'
                  }`}
                >
                  <span className="text-[#00FF85]">$</span>
                  <span className="text-[#00FF85]">cd</span>
                  <span className="text-[#FFFFFF]">/{t(`nav.${item.id}`)}</span>
                  <Icon className={`w-3 h-3 ${isActive(item.href) ? 'text-[#00B4D8]' : 'text-[#666666]'}`} />
                  <span className={`ml-1 text-xs ${isActive(item.href) ? 'text-[#00B4D8]' : 'text-[#666666]'}`}>
                    {item.count}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right: Theme toggle, language */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded hover:bg-[#2A2A2A] transition-colors"
              title={isDark ? t('common.themeToggle.light') : t('common.themeToggle.dark')}
            >
              {isDark ? (
                <Moon className="w-4 h-4 text-[#CCCCCC]" />
              ) : (
                <Sun className="w-4 h-4 text-[#CCCCCC]" />
              )}
            </button>
            <button
              onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
              className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-[#2A2A2A] transition-colors font-mono text-xs text-[#CCCCCC]"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{locale.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
