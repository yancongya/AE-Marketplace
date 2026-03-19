import { useEffect, useState, useRef } from 'react';
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

  // 临时删除的卡片列表
  const [tempDeletedSlugs, setTempDeletedSlugs] = useState<Set<string>>(new Set());

  // FLIP 动画相关
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());
  const isAnimatingRef = useRef(false);

  // 处理临时删除，使用 FLIP 动画
  const handleTempDelete = (itemSlug: string) => {
    // 记录所有剩余卡片的初始位置（First）
    const positions = new Map<string, { x: number; y: number }>();
    cardRefs.current.forEach((element, slug) => {
      if (slug !== itemSlug) {
        const rect = element.getBoundingClientRect();
        positions.set(slug, { x: rect.left, y: rect.top });
      }
    });

    // 标记正在动画中
    isAnimatingRef.current = true;

    // 删除卡片
    setTempDeletedSlugs(prev => new Set(prev).add(itemSlug));

    // 等待 React 重新渲染，然后执行 FLIP 动画
    setTimeout(() => {
      // 获取所有卡片的新位置（Last）
      cardRefs.current.forEach((element, slug) => {
        if (positions.has(slug)) {
          const oldPos = positions.get(slug)!;
          const newPos = element.getBoundingClientRect();
          const deltaX = oldPos.x - newPos.left;
          const deltaY = oldPos.y - newPos.top;

          // 应用反向 transform（Invert）
          if (deltaX !== 0 || deltaY !== 0) {
            element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            element.style.transition = 'none';

            // 在下一帧移除 transform，让卡片平滑移动（Play）
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                element.style.transform = '';

                // 动画完成后清理
                setTimeout(() => {
                  element.style.transition = '';
                  isAnimatingRef.current = false;
                }, 300);
              });
            });
          }
        }
      });
    }, 50);
  };

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

      // 按收藏状态和更新日期排序
      allDocs.sort((a, b) => {
        // 首先按收藏状态排序（收藏的在前）
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;

        // 然后按更新时间降序排序（最新的在前）
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      });

      // 取前12篇，过滤掉临时删除的卡片
      const filteredDocs = allDocs.filter(doc => !tempDeletedSlugs.has(doc.slug));
      setRecentDocs(filteredDocs.slice(0, 12));
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [tempDeletedSlugs]); // 添加 tempDeletedSlugs 依赖

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
                  tags={doc.tags}
                  to={`/${doc.category}/${doc.slug}`}
                  category={doc.category}
                  filename={`${doc.slug}.md`}
                  onTempDelete={() => handleTempDelete(doc.slug)}
                  registerCardRef={(slug, element) => {
                    if (element) {
                      cardRefs.current.set(slug, element);
                    } else {
                      cardRefs.current.delete(slug);
                    }
                  }}
                  slug={doc.slug}
                  isFavorite={doc.isFavorite}
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
