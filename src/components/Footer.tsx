import { Link } from 'react-router-dom';
import { Twitter, Github, MessageCircle, BookOpen, FileText, Folder, ScrollText, Users, History, Lock, FileCheck } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    social: [
      { label: 'Twitter', icon: Twitter, href: '#' },
      { label: 'GitHub', icon: Github, href: '#' },
      { label: 'Reddit', icon: MessageCircle, href: '#' },
    ],
    resources: [
      { label: 'Scripts 文档', icon: BookOpen, href: '/expressions' },
      { label: 'Script 文档', icon: FileText, href: '/scripts' },
      { label: '官方 Scripts', icon: Folder, href: '/presets' },
      { label: 'Codex Scripts 文档', icon: BookOpen, href: '/extensions' },
      { label: 'AE Scripts 规范', icon: FileCheck, href: '/faq' },
    ],
    legal: [
      { label: '关于我们', icon: Users, href: '/' },
      { label: '更新日志', icon: History, href: '/' },
      { label: '隐私政策', icon: Lock, href: '/' },
      { label: '服务条款', icon: ScrollText, href: '/' },
    ],
  };

  return (
    <footer className="border-t mt-16" style={{ borderColor: '#2a2a2a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-green-400 font-mono text-sm">$</span>
              <span className="text-gray-500 font-mono text-sm">cat README.md</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              <span className="text-gray-500">#</span> AE Scripts Marketplace
            </h3>
            <p className="text-sm text-gray-500">
              发现并探索由社区构建的 AE 扩展脚本
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-400 font-mono text-sm">$</span>
              <span className="text-gray-500 font-mono text-sm">git remote -v</span>
            </div>
            <ul className="space-y-2">
              {footerLinks.social.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-400 font-mono text-sm">$</span>
              <span className="text-gray-500 font-mono text-sm">ls ./资源/</span>
            </div>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-400 font-mono text-sm">$</span>
              <span className="text-gray-500 font-mono text-sm">ls ./法律信息/</span>
            </div>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: '#2a2a2a' }}>
          <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              online
            </span>
            <span>v0.1.0</span>
            <span>AE Scripts Marketplace</span>
          </div>
          <p className="text-xs text-gray-600 font-mono">
            © 2026 不隶属于 Adobe
          </p>
        </div>
      </div>
    </footer>
  );
}
