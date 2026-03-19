import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { clearContentCache } from '@/lib/content';
import { X, Maximize2 } from 'lucide-react';

interface TabCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  iconEmoji?: string;
  author?: string;
  updatedAt?: string;
  tags?: string[];
  onClick?: () => void;
  to?: string;
  category?: string;
  filename?: string;
}

export function TabCard({
  title,
  subtitle,
  description,
  iconEmoji,
  author,
  updatedAt,
  tags,
  onClick,
  to,
  category,
  filename
}: TabCardProps) {
  const { isAdmin } = useAdmin();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTempDeleted, setIsTempDeleted] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const shouldBlockClickRef = useRef(false);

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
      // 获取 GitHub token
      const accessToken = localStorage.getItem('github_access_token');
      if (!accessToken) {
        toast.error('请先登录 GitHub');
        return;
      }

      const response = await fetch('/api/admin/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ category, filename }),
      });

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
      style={isTempDeleted ? { display: 'none' } : {}}
    >
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

      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col">
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {iconEmoji && (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center text-base sm:text-lg flex-shrink-0">
              {iconEmoji}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base text-foreground font-medium truncate">{title}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground font-mono truncate">{subtitle}</p>
            )}
          </div>
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
            <div className="flex-1 overflow-hidden">
              {to && (
                <iframe
                  src={to}
                  className="w-full h-full border-0"
                  title={title}
                />
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