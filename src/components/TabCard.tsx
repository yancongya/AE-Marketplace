import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TabCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  iconEmoji?: string;
  author?: string;
  updatedAt?: string;
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
  onClick,
  to,
  category,
  filename
}: TabCardProps) {
  const { isAdmin } = useAdmin();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const shouldBlockClickRef = useRef(false);

  const handleDelete = async () => {
    if (!import.meta.env.DEV) {
      toast.error('删除功能仅在开发模式下可用');
      return;
    }

    if (!category || !filename) {
      toast.error('缺少必要参数');
      return;
    }

    try {
      const response = await fetch('/api/admin/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, filename }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('删除成功');
        setIsDeleteDialogOpen(false);
        // 刷新页面
        window.location.reload();
      } else {
        toast.error(result.error || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      toast.error('删除失败');
    }
  };

  const handleRedDotRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    shouldBlockClickRef.current = true;  // 阻止点击
    if (isAdmin && import.meta.env.DEV) {
      setIsDeleteDialogOpen(true);
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (shouldBlockClickRef.current) {
      e.preventDefault();
      e.stopPropagation();
      shouldBlockClickRef.current = false;  // 重置标志
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      shouldBlockClickRef.current = false;  // 对话框关闭时重置
    }
    setIsDeleteDialogOpen(open);
  };

  const content = (
    <div 
      className="terminal-window card-hover cursor-pointer group h-full flex flex-col"
      title={description}
    >
      <div className="terminal-header flex-shrink-0">
        <div className="flex items-center gap-2 group-hover:gap-2.5 transition-all duration-300">
          <span
            className="terminal-dot terminal-dot-red"
            onContextMenu={handleRedDotRightClick}
            title={isAdmin && import.meta.env.DEV ? '右键删除此文件' : ''}
            style={isAdmin && import.meta.env.DEV ? { cursor: 'context-menu' } : {}}
          />
          <span className="terminal-dot terminal-dot-yellow" />
          <span className="terminal-dot terminal-dot-green" />
        </div>
      </div>
      
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <div className="flex items-center gap-3 flex-shrink-0">
          {iconEmoji && (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg flex-shrink-0">
              {iconEmoji}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-foreground font-medium truncate">{title}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground font-mono truncate">{subtitle}</p>
            )}
          </div>
        </div>
 
        {description && (
          <p className="text-xs text-muted-foreground truncate">
            {description}
          </p>
        )}
 
        <div className="mt-auto pt-2 border-t border-border flex-shrink-0">
          <p className="text-xs text-muted-font-foreground font-mono truncate">
            <span className="text-green-400">$</span>
            {updatedAt && <span> 更新日期: {updatedAt}</span>}
            {(author || updatedAt) && <span className="text-green-400 ml-2">$</span>}
            {author && <span> 作者: {author}</span>}
          </p>
        </div>
      </div>
    </div>
  );

  // 删除确认弹窗
  const deleteDialog = isAdmin && import.meta.env.DEV ? (
    <Dialog.Root open={isDeleteDialogOpen} onOpenChange={handleDialogClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 bg-background border border-border rounded-lg shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-4">确认删除</Dialog.Title>
          <Dialog.Description className="text-sm text-muted-foreground mb-4">
            确定要删除 <strong>{title}</strong> 吗？此操作将删除本地文件并更新 manifest，无法撤销。
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

  const wrappedContent = (
    <>
      {content}
      {deleteDialog}
    </>
  );

  if (to) {
    return <Link to={to} onClick={handleLinkClick}>{wrappedContent}</Link>;
  }

  return <div onClick={onClick}>{wrappedContent}</div>;
}
