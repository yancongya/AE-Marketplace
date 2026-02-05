import { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface CommentSectionProps {
  title: string;
  path: string;
}

export function CommentSection({ title, path }: CommentSectionProps) {
  const { theme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 清除之前的 giscus 实例
    if (ref.current) {
      ref.current.innerHTML = '';
    }

    // 创建 giscus 脚本
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'yancongya/ae-market-discussions');
    script.setAttribute('data-repo-id', 'R_kgDORJMGTA');
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute('data-category-id', 'DIC_kwDORJMGTM4C16gO');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('data-loading', 'lazy');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    if (ref.current) {
      ref.current.appendChild(script);
    }

    return () => {
      if (ref.current) {
        ref.current.innerHTML = '';
      }
    };
  }, [theme, path]);

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="text-primary">💬</span>
        评论
      </h3>
      <div ref={ref} className="giscus-container" />
      <p className="text-xs text-muted-foreground mt-4 text-center">
        评论由 <a href="https://giscus.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Giscus</a> 驱动，使用 GitHub 登录
      </p>
    </div>
  );
}