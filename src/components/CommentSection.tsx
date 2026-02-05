import { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface CommentSectionProps {
  path: string;
}

export function CommentSection({ path }: CommentSectionProps) {
  const { isDark } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    // 如果 giscus 还未加载，创建脚本
    if (!isLoadedRef.current) {
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
      script.setAttribute('data-theme', isDark ? 'dark' : 'light');
      script.setAttribute('data-lang', 'zh-CN');
      script.setAttribute('data-loading', 'lazy');
      script.setAttribute('crossorigin', 'anonymous');
      script.async = true;

      if (ref.current) {
        ref.current.appendChild(script);
        isLoadedRef.current = true;
      }
    } else {
      // 如果已经加载，发送消息更新主题
      const iframe = ref.current?.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          { giscus: { setConfig: { theme: isDark ? 'dark' : 'light' } } },
          'https://giscus.app'
        );
      }
    }
  }, [isDark, path]);

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