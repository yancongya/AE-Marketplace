import { Link } from 'react-router-dom';
import { BookOpen, FileText, Folder, BookMarked, FileCheck, Youtube, Github, Mail, Camera } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ResourceLink {
  title: string;
  href: string;
}

interface ResourcesData {
  social: ResourceLink[];
  docs: ResourceLink[];
}

export function Footer() {
  const [resources, setResources] = useState<ResourcesData>({ social: [], docs: [] });

  useEffect(() => {
    fetch('/resources.json')
      .then(res => res.json())
      .then(data => setResources(data))
      .catch(() => {
        setResources({
          social: [
            { title: 'B站', href: 'https://space.bilibili.com/100881808' },
            { title: 'GitHub', href: 'https://github.com/yancongya' },
            { title: '小红书', href: 'https://xhslink.com/m/4Lx1IVQhPYX' },
            { title: '邮箱', href: 'mailto:2655283737@qq.com' },
          ],
          docs: [
            { title: 'Scripts 文档', href: '/expressions' },
            { title: 'Script 文档', href: '/scripts' },
            { title: '官方 Scripts', href: '/presets' },
            { title: 'Codex Scripts 文档', href: '/extensions' },
            { title: 'AE Scripts 规范', href: '/faq' },
          ],
        });
      });
  }, []);

  const getIcon = (title: string) => {
    switch (title) {
      case 'B站':
        return Youtube;
      case 'GitHub':
        return Github;
      case '小红书':
        return Camera;
      case '邮箱':
        return Mail;
      case 'AE Scripts 官网':
        return BookOpen;
      case 'Adobe AE 官方文档':
        return FileText;
      case 'MotionScript 教程':
        return Folder;
      case 'Video Copilot':
        return BookMarked;
      case 'AE 脚本开发指南':
        return FileCheck;
      default:
        return BookOpen;
    }
  };

  return (
    <footer className="border-t mt-16 animate-fade-in-up" style={{ borderColor: '#2a2a2a', animationDelay: '800ms' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
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

          <div className="animate-fade-in-up" style={{ animationDelay: '900ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-400 font-mono text-sm">$</span>
              <span className="text-gray-500 font-mono text-sm">ls ./资源/</span>
            </div>
            <ul className="space-y-2">
              {resources.social.map((link, index) => {
                const Icon = getIcon(link.title);
                return (
                  <li key={index}>
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      {link.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-400 font-mono text-sm">$</span>
              <span className="text-gray-500 font-mono text-sm">ls ./文档/</span>
            </div>
            <ul className="space-y-2">
              {resources.docs.map((link, index) => {
                const Icon = getIcon(link.title);
                const isExternal = link.href.startsWith('http');
                return (
                  <li key={index}>
                    {isExternal ? (
                      <a 
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                        {link.title}
                      </a>
                    ) : (
                      <Link 
                        to={link.href}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                        {link.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in-up" style={{ borderColor: '#2a2a2a', animationDelay: '1100ms' }}>
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
