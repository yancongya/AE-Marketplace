import { useEffect, useState } from 'react';
import { HeroSection, type StatsData } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { Footer } from '@/components/Footer';
import { TabCard } from '@/components/TabCard';
import { loadContent, type ContentItem } from '@/lib/content';
import { useI18n } from '@/contexts/I18nContext';

export function Home() {
  const [recentDocs, setRecentDocs] = useState<ContentItem[]>([]);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { translations } = useI18n();

  useEffect(() => {
    let isMounted = true;

    loadContent().then(data => {
      if (!isMounted) return;

      // 设置统计数据
      setStatsData({
        expressions: data.expressions.length,
        scripts: data.scripts.length,
        presets: data.presets.length,
        extensions: data.extensions.length,
      });

      // 合并所有类型的内容
      const allDocs: (ContentItem & { category: string })[] = [
        ...data.expressions.map(item => ({ ...item, category: 'expressions' })),
        ...data.scripts.map(item => ({ ...item, category: 'scripts' })),
        ...data.presets.map(item => ({ ...item, category: 'presets' })),
        ...data.extensions.map(item => ({ ...item, category: 'extensions' }))
      ];

      // 按更新日期降序排序
      allDocs.sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      });

      // 取前12篇
      setRecentDocs(allDocs.slice(0, 12));
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="animate-fade-in">
      <HeroSection statsData={statsData} />

      {/* Recent Documents Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="terminal-window mb-6">
            <div className="terminal-header">
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-yellow" />
              <span className="terminal-dot terminal-dot-green" />
              <span className="ml-auto text-xs text-muted-foreground font-mono">$ ls -lt --head=12</span>
            </div>
            <div className="p-4">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {translations?.home.recentDocs || '最近更新'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {translations?.home.recentDocsDesc || '最近更新的12篇文档'}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              {translations?.common.loading || '加载中...'}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recentDocs.map((doc) => (
                <TabCard
                  key={`${doc.category}-${doc.slug}`}
                  title={doc.title}
                  subtitle={`${doc.author}/${doc.slug}`}
                  description={doc.description}
                  iconEmoji={doc.iconEmoji}
                  author={doc.author}
                  updatedAt={doc.updatedAt}
                  to={`/${doc.category}/${doc.slug}`}
                  category={doc.category}
                  filename={`${doc.slug}.md`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <AboutSection />
      <Footer />
    </div>
  );
}
