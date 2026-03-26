import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { clearContentCache } from '@/lib/content';
import { X, Maximize2, Star } from 'lucide-react';

interface TabCardProps {
  title: string;
  description?: string;
  author?: string;
  updatedAt?: string;
  tags?: string[];
  onClick?: () => void;
  to?: string;
  category?: string;
  filename?: string;
  onTempDelete?: () => void; // 添加临时删除回调
  isFavorite?: boolean; // 添加收藏标记
  coverImage?: string; // 添加封面图片
}

export function TabCard({
  title,
  description,
  author,
  updatedAt,
  tags,
  onClick,
  to,
  category,
  filename,
  onTempDelete,
  isFavorite,
  coverImage
}: TabCardProps) {
  const { isAdmin } = useAdmin();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTempDeleted, setIsTempDeleted] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const shouldBlockClickRef = useRef(false);

  // 生成默认封面
  const generateDefaultCover = (title: string, description?: string) => {
    // 使用 Canvas 生成封面（高清尺寸 640x360，720p 的一半）
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 640;
    canvas.height = 360;

    if (!ctx) return null;

    // 绘制背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e3a5f');
    gradient.addColorStop(1, '#0d1b2a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制网格线
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // 绘制边框
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 4;  // 边框也加粗
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // 绘制标题（字体大小也相应增大）
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px monospace';  // 从 18px 增加到 36px
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 截断标题
    const maxTitleLength = 25;
    const displayTitle = title.length > maxTitleLength
      ? title.substring(0, maxTitleLength) + '...'
      : title;

    // 绘制标题（稍微向上）
    ctx.fillText(displayTitle, canvas.width / 2, canvas.height / 2 - 30);

    // 绘制描述（标题下方，字体大小也相应增大）
    if (description && description.length > 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '24px monospace';  // 从 12px 增加到 24px
      const maxDescLength = 40;
      const displayDesc = description.length > maxDescLength
        ? description.substring(0, maxDescLength) + '...'
        : description;
      ctx.fillText(displayDesc, canvas.width / 2, canvas.height / 2 + 30);
    }

    return canvas.toDataURL();
  };

  const [defaultCover, setDefaultCover] = useState<string | null>(null);

  useEffect(() => {
    if (!coverImage) {
      const generatedCover = generateDefaultCover(title, description);
      setDefaultCover(generatedCover);
    }
  }, [title, description, coverImage]);

  // 检测是否是电脑环境
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const handleDelete = async () => {
    if (!isAdmin) {
      toast.error('需要管理员权限');
      return;
    }

    if (!category || !filename) {
      toast.error('缺少必要参数');
      return;
    }

    try {
      // 开发模式下不需要 GitHub token
      const isDev = import.meta.env.DEV;
      const accessToken = localStorage.getItem('github_access_token');

      const fetchOptions: RequestInit = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, filename }),
      };

      // 生产模式下需要 GitHub token
      if (!isDev) {
        if (!accessToken) {
          toast.error('请先登录 GitHub');
          return;
        }
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Authorization': `Bearer ${accessToken}`,
        };
      }

      const response = await fetch('/api/admin/delete', fetchOptions);

      const result = await response.json();

      if (result.success) {
        toast.success('删除成功');
        setIsDeleteDialogOpen(false);
        // 清除缓存
        clearContentCache();
        // 通过回调刷新列表
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else if (result.error === '文件不存在') {
        // 文件不存在，视为删除成功
        toast.success('文件已不存在');
        setIsDeleteDialogOpen(false);
        // 清除缓存
        clearContentCache();
        // 通过回调刷新列表
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast.error(result.error || '删除失败');
      }
    } catch (error: any) {
      console.error('删除失败:', error);
      toast.error('删除失败: ' + (error.message || '未知错误'));
    }
  };

  const handleRedDotRightClick = (e: React.MouseEvent) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      shouldBlockClickRef.current = true;  // 阻止点击
      if (isAdmin) {
        setIsDeleteDialogOpen(true);
      }
    } catch (error) {
      console.error('右键菜单错误:', error);
      // 即使出现错误，也阻止默认行为
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleRedDotClick = (e: React.MouseEvent) => {
    if (!isDesktop) return;  // 只有电脑环境才有功能

    try {
      e.preventDefault();
      e.stopPropagation();
      shouldBlockClickRef.current = true;  // 阻止点击

      // 临时删除 - 粉碎消失效果
      setIsTempDeleted(true);
      toast.success('文章已临时隐藏，刷新页面后恢复');

      // 动画进行到一半时（0.3秒）通知父组件移除卡片，开始补位
      setTimeout(() => {
        if (onTempDelete) {
          onTempDelete();
        }
      }, 300);
    } catch (error) {
      console.error('红色圆点点击错误:', error);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleYellowDotClick = (e: React.MouseEvent) => {
    if (!isDesktop) return;  // 只有电脑环境才有功能

    try {
      e.preventDefault();
      e.stopPropagation();
      shouldBlockClickRef.current = true;  // 阻止点击

      // 打开模态窗口查看文章
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('黄色圆点点击错误:', error);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleGreenDotClick = (e: React.MouseEvent) => {
    if (!isDesktop) return;  // 只有电脑环境才有功能

    try {
      e.preventDefault();
      e.stopPropagation();
      shouldBlockClickRef.current = true;  // 阻止点击

      // 绿色圆点不做任何操作，让卡片默认行为生效（全屏打开）
    } catch (error) {
      console.error('绿色圆点点击错误:', error);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    try {
      if (shouldBlockClickRef.current) {
        e.preventDefault();
        e.stopPropagation();
        shouldBlockClickRef.current = false;  // 重置标志
      }
    } catch (error) {
      console.error('链接点击错误:', error);
      shouldBlockClickRef.current = false;  // 重置标志
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      shouldBlockClickRef.current = false;  // 对话框关闭时重置
    }
    setIsDeleteDialogOpen(open);
  };

  const cardContent = (
    <div
      className={`terminal-window card-hover cursor-pointer group flex flex-col min-h-[200px] ${
        isTempDeleted ? 'shrink-disappear' : ''
      }`}
      title={description}
    >
      {/* 收藏星星图标 - 绝对定位在右上角 */}
      {isFavorite && (
        <div className="absolute top-2 right-2 z-10 animate-scale-in" style={{ animationDelay: '0ms' }}>
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        </div>
      )}

      <div className="terminal-header flex-shrink-0">
        <div className="flex items-center gap-2 group-hover:gap-2.5 transition-all duration-300">
          <span
            className={`terminal-dot terminal-dot-red ${isDesktop ? 'cursor-pointer hover:scale-125' : ''}`}
            onClick={handleRedDotClick}
            onContextMenu={handleRedDotRightClick}
            title={isDesktop ? '点击临时隐藏文章' : isAdmin ? '右键删除此文件' : ''}
            style={isAdmin ? { cursor: 'context-menu' } : {}}
          />
          <span
            className={`terminal-dot terminal-dot-yellow ${isDesktop ? 'cursor-pointer hover:scale-125' : ''}`}
            onClick={handleYellowDotClick}
            title={isDesktop ? '点击在模态窗口中查看' : ''}
          />
          <span
            className={`terminal-dot terminal-dot-green ${isDesktop ? 'cursor-pointer hover:scale-125' : ''}`}
            onClick={handleGreenDotClick}
            title={isDesktop ? '点击全屏打开' : ''}
          />
        </div>
      </div>

      {/* 封面图片区域 */}
      {(coverImage || defaultCover) ? (
        <div className="terminal-cover w-full flex-shrink-0">
          <img
            src={coverImage || defaultCover || ''}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="terminal-cover placeholder w-full flex-shrink-0" />
      )}

      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base text-foreground font-medium truncate">{title}</h3>
        </div>

        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2 sm:line-clamp-1">
            {description}
          </p>
        )}

        <div className="mt-auto pt-2 border-t border-border flex-shrink-0">
          <p className="text-xs text-muted-font-foreground font-mono truncate mb-2">
            <span className="text-green-400">$</span>
            {updatedAt && <span> {updatedAt}</span>}
            {(author || updatedAt) && <span className="text-green-400 ml-2">$</span>}
            {author && <span> {author}</span>}
          </p>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-xs font-mono bg-primary/10 text-primary border border-primary/20"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-xs font-mono bg-secondary/50 text-muted-foreground">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // 删除确认弹窗
  const deleteDialog = isAdmin ? (
    <Dialog.Root open={isDeleteDialogOpen} onOpenChange={handleDialogClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 bg-background border border-border rounded-lg shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-4">确认删除</Dialog.Title>
          <Dialog.Description className="text-sm text-muted-foreground mb-4">
            确定要删除 <strong>{title}</strong> 吗？此操作将删除文件并更新 manifest，无法撤销。
          </Dialog.Description>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              确认删除
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ) : null;

  // 模态窗口预览 - 使用 iframe 加载完整文档页面
  const previewDialog = (
    <Dialog.Root open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] h-[85vh] max-w-6xl bg-background border border-border rounded-lg shadow-2xl overflow-hidden">
          <VisuallyHidden.Root>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Description>文档预览</Dialog.Description>
          </VisuallyHidden.Root>
          <div className="flex flex-col h-full">
            {/* 模态窗口头部 */}
            <div className="terminal-header flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="terminal-dot terminal-dot-red" />
                <span className="terminal-dot terminal-dot-yellow" />
                <span className="terminal-dot terminal-dot-green" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">{title}.md</span>
              </div>
              <div className="flex items-center gap-2">
                {to && (
                  <Link
                    to={to}
                    onClick={() => setIsPreviewOpen(false)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-primary/10 hover:bg-primary/20 border border-primary/30 transition-colors"
                    title="全屏打开"
                  >
                    <Maximize2 className="w-4 h-4 text-primary" />
                  </Link>
                )}
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1.5 rounded hover:bg-secondary transition-colors"
                  title="关闭"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* 模态窗口内容 - 使用 iframe 加载完整文档 */}
            <div className="flex-1 overflow-hidden bg-background">
              {to && (
                <>
                  <iframe
                    ref={(el) => {
                      if (el) {
                        el.onload = () => {
                          // 注入自定义滚动条样式到 iframe
                          try {
                            if (el.contentDocument) {
                              const style = document.createElement('style');
                              style.textContent = `
                                html {
                                  scrollbar-width: thin;
                                  scrollbar-color: hsl(217 91% 60%) transparent;
                                }
                                html::-webkit-scrollbar {
                                  width: 10px;
                                  height: 10px;
                                }
                                html::-webkit-scrollbar-track {
                                  background: transparent;
                                  border-radius: 10px;
                                }
                                html::-webkit-scrollbar-thumb {
                                  background: linear-gradient(180deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%);
                                  border-radius: 10px;
                                  border: 2px solid transparent;
                                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                                  transition: all 0.3s ease;
                                }
                                html::-webkit-scrollbar-thumb:hover {
                                  background: linear-gradient(180deg, hsl(217 91% 65%) 0%, hsl(217 91% 55%) 100%);
                                  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
                                }
                                html::-webkit-scrollbar-thumb:active {
                                  background: linear-gradient(180deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%);
                                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                                }
                                html::-webkit-scrollbar-corner {
                                  background: transparent;
                                }
                                html::-webkit-scrollbar-button {
                                  background: transparent;
                                }
                                html::-webkit-scrollbar-button:hover {
                                  background: transparent;
                                }
                              `;
                              el.contentDocument.head.appendChild(style);
                            }
                          } catch (e) {
                            console.error('无法注入 iframe 样式:', e);
                          }
                        };
                      }
                    }}
                    src={to}
                    className="w-full h-full border-0 custom-scrollbar"
                    title={title}
                  />
                </>
              )}
              {!to && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">无法加载文档</p>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

  const wrappedContent = (
    <>
      {cardContent}
      {deleteDialog}
      {previewDialog}
    </>
  );

  if (to) {
    return <Link to={to} onClick={handleLinkClick}>{wrappedContent}</Link>;
  }

  return <div onClick={onClick}>{wrappedContent}</div>;
}