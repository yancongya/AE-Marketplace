import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TabPanel } from './TabPanel';
import { TabCard } from './TabCard';
import { TabContent } from './TabContent';
import { useI18n } from '@/contexts/I18nContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Plus } from 'lucide-react';
import { stagingArea } from '@/lib/staging';
import { toast } from 'sonner';
import type { ContentItem, PresetItem, ExtensionItem } from '@/lib/content';

export interface TabListProps<T extends ContentItem | PresetItem | ExtensionItem> {
  category: 'expressions' | 'scripts' | 'presets' | 'extensions';
  title: string;
  icon: React.ReactNode;
  data: T[];
}

export function TabList<T extends ContentItem | PresetItem | ExtensionItem>({
  category,
  title,
  icon,
  data
}: TabListProps<T>) {
  const { translations } = useI18n();
  const { isAdmin } = useAdmin();
  const [list, setList] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const { slug } = useParams();
  const navigate = useNavigate();

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
    setList(data);
    setLoading(false);
  }, [data]);

  const selectedItem = list.find(item => item.slug === slug);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    list.forEach(item => {
      item.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [list]);

  const filteredList = useMemo(() => {
    let result = list.filter(item => {
      const matchesTag = selectedTags.length === 0 || selectedTags.some(tag => item.tags?.includes(tag));
      const matchesSearch = !searchTerm ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author?.toLowerCase().includes(searchTerm.toLowerCase());
      // 过滤掉临时删除的卡片
      const notTempDeleted = !tempDeletedSlugs.has(item.slug);
      return matchesTag && matchesSearch && notTempDeleted;
    });

    // 新的排序逻辑：收藏优先，然后按更新时间降序排序（最新的在前）
    result.sort((a, b) => {
      // 首先按收藏状态排序（收藏的在前）
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;

      // 然后按更新时间降序排序（最新的在前）
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });

    return result;
  }, [list, selectedTags, searchTerm, tempDeletedSlugs]);

  // 分页逻辑
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedList = filteredList.slice(startIndex, endIndex);

  // 重置页码当筛选条件改变时
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTags, searchTerm]);

  if (loading) {
    return (
      <TabPanel title={title} count={0} icon={icon}>
        <div className="text-center py-8 text-muted-foreground">{translations?.common.loading || '加载中...'}</div>
      </TabPanel>
    );
  }

  // 检查是否是临时文档（新建文档）
  const isTempDoc = slug?.startsWith('temp-');

  // 如果是临时文档，渲染 TabContent（从暂存区加载数据）
  if (isTempDoc && category) {
    return (
      <TabContent
        title=""
        iconEmoji="📝"
        subtitle=""
        content=""
        onBack={() => navigate(`/${category}`)}
        category={category}
        slug={slug}
      />
    );
  }

  // 如果是已存在的文档，显示详情
  if (selectedItem) {
    return (
      <TabContent
        title={selectedItem.title}
        iconEmoji={selectedItem.iconEmoji}
        subtitle={selectedItem.description}
        content={selectedItem.content}
        onBack={() => navigate(`/${category}`)}
        author={selectedItem.author}
        updatedAt={selectedItem.updatedAt}
        tags={selectedItem.tags}
        filename={`${selectedItem.slug}.md`}
        category={category}
        slug={selectedItem.slug}
        isFavorite={selectedItem.isFavorite}
      />
    );
  }

  const getSubtitle = (item: T) => {
    if ('nameEn' in item && item.nameEn) {
      return item.nameEn;
    }
    if (item.author) {
      return `${item.author}/${item.slug}`;
    }
    return undefined;
  };

  return (
    <TabPanel
      title={title}
      count={filteredList.length}
      icon={icon}
      tags={allTags}
      selectedTags={selectedTags}
      onTagsChange={setSelectedTags}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginatedList.map((item) => (
          <TabCard
            key={item.slug}
            title={item.title}
            subtitle={getSubtitle(item)}
            description={item.description}
            iconEmoji={item.iconEmoji}
            author={item.author}
            updatedAt={item.updatedAt}
            tags={item.tags}
            to={`/${category}/${item.slug}`}
            category={category}
            filename={`${item.slug}.md`}
            onTempDelete={() => handleTempDelete(item.slug)}
            registerCardRef={(slug, element) => {
              if (element) {
                cardRefs.current.set(slug, element);
              } else {
                cardRefs.current.delete(slug);
              }
            }}
            slug={item.slug}
            isFavorite={item.isFavorite}
          />
        ))}
        {/* 新建文档卡片（管理员模式） */}
        {isAdmin && (
          <div
            onClick={async () => {
              try {
                const tempSlug = `temp-${Date.now()}`;
                const newDoc: ContentItem = {
                  title: '新建文档',
                  iconEmoji: '📝',
                  author: '',
                  tags: [],
                  description: '',
                  updatedAt: new Date().toISOString().split('T')[0],
                  content: '# 新建文档\n\n开始编写你的文档...',
                  slug: tempSlug,
                  category,
                  command: '' // 添加 command 属性
                };

                // 暂存变更
                stagingArea.stageChange({
                  type: 'create',
                  category,
                  slug: tempSlug,
                  data: newDoc,
                });

                toast.success('文档已添加到暂存区，请稍后提交');

                // 跳转到编辑页面
                navigate(`/${category}/${tempSlug}#edit`);
              } catch (error) {
                console.error('创建失败:', error);
                toast.error('创建失败');
              }
            }}
            className="terminal-window cursor-pointer hover:border-primary/50 transition-all min-h-[160px] sm:min-h-[180px] md:min-h-[200px] flex items-center justify-center group"
          >
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-primary/20 transition-colors">
                <Plus className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-mono">新建文档</p>
            </div>
          </div>
        )}
      </div>

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md bg-secondary/50 text-muted-foreground text-sm font-mono hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const showPage =
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1;

              if (!showPage) {
                if (Math.abs(page - currentPage) === 2) {
                  return <span key={page} className="px-2 text-muted-foreground">...</span>;
                }
                return null;
              }

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md text-sm font-mono transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md bg-secondary/50 text-muted-foreground text-sm font-mono hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </TabPanel>
  );
}