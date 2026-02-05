import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Moon, ChevronDown } from 'lucide-react';

interface NavbarProps {
  isDark: boolean;
  onThemeChange: (value: boolean) => void;
}

export function Navbar({ isDark, onThemeChange }: NavbarProps) {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const location = useLocation();

  const navItems = [
    { id: 'expressions', keyword: 'cd', arg: '/expressions', href: '/expressions' },
    { id: 'scripts', keyword: 'cd', arg: '/scripts', href: '/scripts' },
    { id: 'presets', keyword: 'cd', arg: '/presets', href: '/presets' },
    { id: 'extensions', keyword: 'cd', arg: '/extensions', href: '/extensions' },
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
            <span className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono bg-[#2D2D2D] text-[#CCCCCC]">
              <span className="w-2 h-2 rounded-full bg-[#00FF85]" />
              ready
            </span>
            <Link
              to="/"
              className="flex items-center gap-1 font-mono text-sm hover:opacity-80 transition-opacity"
            >
              <span className="text-[#CCCCCC]">~</span>
              <span className="text-[#FFFFFF]">/aescripts</span>
            </Link>
          </div>

          {/* Center: Command-style navigation buttons */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={`flex items-center gap-1 px-3 py-1.5 rounded border font-mono text-xs transition-all duration-200 ${
                  isActive(item.href)
                    ? 'border-[#00B4D8] bg-[#1E1E1E]'
                    : 'border-[#444444] bg-[#1E1E1E] hover:border-[#66CCFF] hover:bg-[#2A2A2A]'
                }`}
              >
                <span className="text-[#00FF85]">$</span>
                <span className="text-[#00FF85]">{item.keyword}</span>
                <span className="text-[#FFFFFF]">{item.arg}</span>
              </Link>
            ))}
          </div>

          {/* Right: Theme toggle, language, user menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onThemeChange(!isDark)}
              className="p-2 rounded hover:bg-[#2A2A2A] transition-colors"
            >
              <Moon className="w-4 h-4 text-[#CCCCCC]" />
            </button>
            <button
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-[#2A2A2A] transition-colors font-mono text-xs text-[#CCCCCC]"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang.toUpperCase()}</span>
            </button>
            <button className="flex items-center gap-1.5 p-1 rounded hover:bg-[#2A2A2A] transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#FFFFFF] flex items-center justify-center">
                <span className="text-[#000000] text-xs font-bold">X</span>
              </div>
              <ChevronDown className="w-3 h-3 text-[#CCCCCC]" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
