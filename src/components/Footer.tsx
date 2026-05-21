import { Link } from 'react-router-dom';
import { BookOpen, FileText, Folder, BookMarked, FileCheck, Youtube, Github, Mail, Camera } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { toast } from 'sonner';

interface ResourceLink {
  key: string;
  href: string;
}

interface ResourcesData {
  social: ResourceLink[];
  docs: ResourceLink[];
}

export function Footer() {
  const { translations } = useI18n();
  const [resources, setResources] = useState<ResourcesData>({ social: [], docs: [] });

  // 复制邮箱到剪切板
  const copyEmailToClipboard = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success(translations?.footer.emailCopied || '邮箱已复制到剪切板');
    } catch {
      toast.error('复制失败');
    }
  };

  useEffect(() => {
    fetch('/resources.json')
      .then(res => res.json())
      .then(data => setResources(data))
      .catch(() => {
        setResources({
          social: [
            { key: 'bilibili', href: 'https://space.bilibili.com/100881808' },
            { key: 'github', href: 'https://github.com/yancongya' },
            { key: 'xiaohongshu', href: 'https://xhslink.com/m/4Lx1IVQhPYX' },
            { key: 'email', href: 'mailto:2655283737@qq.com' },
          ],
          docs: [
            { key: 'aescripts', href: '/expressions' },
            { key: 'adobeDocs', href: '/scripts' },
            { key: 'motionscript', href: '/presets' },
            { key: 'videoCopilot', href: '/extensions' },
            { key: 'extendscript', href: '/faq' },
          ],
        });
      });
  }, []);

  const getIcon = (key: string) => {
    switch (key) {
      case 'bilibili':
        return Youtube;
      case 'github':
        return Github;
      case 'xiaohongshu':
        return Camera;
      case 'email':
        return Mail;
      case 'kkbar':
        return BookMarked;
      case 'aescripts':
        return BookOpen;
      case 'adobeDocs':
        return FileText;
      case 'motionscript':
        return Folder;
      case 'videoCopilot':
        return BookMarked;
      case 'extendscript':
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
              {translations?.footer.tagline || translations?.common.fallback.tagline || '发现并探索由社区构建的 AE 扩展脚本'}
            </p>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '900ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-400 font-mono text-sm">$</span>
              <span className="text-gray-500 font-mono text-sm">ls ./{translations?.footer.resources || translations?.common.fallback.resources || '资源'}/</span>
            </div>
            <ul className="space-y-2">
              {resources.social.map((link, index) => {
                const Icon = getIcon(link.key);
                const title = translations?.footer.resourcesList?.social?.[link.key as keyof typeof translations.footer.resourcesList.social] || link.key;
                
                // 邮箱链接特殊处理：点击复制到剪切板
                if (link.key === 'email') {
                  const email = link.href.replace('mailto:', '');
                  return (
                    <li key={index}>
                      <button 
                        onClick={() => copyEmailToClipboard(email)}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                        {title}
                      </button>
                    </li>
                  );
                }
                
                return (
                  <li key={index}>
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      {title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-400 font-mono text-sm">$</span>
              <span className="text-gray-500 font-mono text-sm">ls ./{translations?.footer.docs || translations?.common.fallback.docs || '文档'}/</span>
            </div>
            <ul className="space-y-2">
              {resources.docs.map((link, index) => {
                const Icon = getIcon(link.key);
                const title = translations?.footer.resourcesList?.docs?.[link.key as keyof typeof translations.footer.resourcesList.docs] || link.key;
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
                        {title}
                      </a>
                    ) : (
                      <Link 
                        to={link.href}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                        {title}
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
              {translations?.footer.online || 'online'}
            </span>
            <span>{translations?.footer.version || 'v0.1.0'}</span>
            <span>AE Scripts Marketplace</span>
          </div>
          <p className="text-xs text-gray-600 font-mono">
            {translations?.footer.copyright || translations?.common.fallback.copyright || '© 2026 不隶属于 Adobe'}
          </p>
        </div>
      </div>
    </footer>
  );
}
