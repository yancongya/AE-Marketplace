import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useAdmin } from '@/contexts/AdminContext';
import { stagingArea, type StagedChange } from '@/lib/staging';
import { toast } from 'sonner';
import { GitCommit, X, Check, Trash2, FilePlus, FileEdit, FileMinus, GitCompare } from 'lucide-react';

/**
 * 暂存区面板组件
 * 显示所有暂存的变更，支持选择、预览和提交
 */
export function StagingPanel() {
  const { isAdmin, githubAuth } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [changes, setChanges] = useState<StagedChange[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCommitting, setIsCommitting] = useState(false);

  // 加载暂存区数据
  useEffect(() => {
    setChanges(stagingArea.getStagedChanges());
  }, [isOpen]);

  // 选择所有变更
  const handleSelectAll = () => {
    if (selectedIds.length === changes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(changes.map((c) => c.id));
    }
  };

  // 选择单个变更
  const handleSelectChange = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 移除单个变更
  const handleUnstage = (id: string) => {
    stagingArea.unstageChange(id);
    setChanges(stagingArea.getStagedChanges());
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    toast.success('已移除暂存变更');
  };

  // 提交选定的变更
  const handleCommit = async () => {
    if (selectedIds.length === 0) {
      toast.warning('请先选择要提交的变更');
      return;
    }

    const token = githubAuth.getAccessToken();
    if (!token) {
      toast.error('未登录，无法提交');
      return;
    }

    setIsCommitting(true);
    try {
      const result = await stagingArea.commitSelected(selectedIds, token);

      if (result.success) {
        toast.success(`成功提交 ${selectedIds.length} 个变更`);
        setChanges(stagingArea.getStagedChanges());
        setSelectedIds([]);
      } else {
        toast.error(`提交失败：${result.errors.length} 个错误`);
        result.errors.forEach((error) => {
          console.error(error);
        });
      }
    } catch (error) {
      console.error('提交失败:', error);
      toast.error('提交失败，请重试');
    } finally {
      setIsCommitting(false);
    }
  };

  // 提交所有变更
  const handleCommitAll = async () => {
    if (changes.length === 0) {
      toast.warning('暂存区没有变更');
      return;
    }

    const token = githubAuth.getAccessToken();
    if (!token) {
      toast.error('未登录，无法提交');
      return;
    }

    setIsCommitting(true);
    try {
      const result = await stagingArea.commitAll(token);

      if (result.success) {
        toast.success(`成功提交所有 ${changes.length} 个变更`);
        setChanges(stagingArea.getStagedChanges());
        setSelectedIds([]);
      } else {
        toast.error(`提交失败：${result.errors.length} 个错误`);
        result.errors.forEach((error) => {
          console.error(error);
        });
      }
    } catch (error) {
      console.error('提交失败:', error);
      toast.error('提交失败，请重试');
    } finally {
      setIsCommitting(false);
    }
  };

  // 获取变更图标
  const getChangeIcon = (type: StagedChange['type']) => {
    switch (type) {
      case 'create':
        return <FilePlus className="w-4 h-4 text-green-400" />;
      case 'update':
        return <FileEdit className="w-4 h-4 text-blue-400" />;
      case 'delete':
        return <FileMinus className="w-4 h-4 text-red-400" />;
      case 'rename':
        return <GitCompare className="w-4 h-4 text-yellow-400" />;
    }
  };

  // 获取变更类型标签
  const getChangeTypeLabel = (type: StagedChange['type']) => {
    switch (type) {
      case 'create':
        return '新建';
      case 'update':
        return '更新';
      case 'delete':
        return '删除';
      case 'rename':
        return '重命名';
    }
  };

  // 获取变更类型样式
  const getChangeTypeStyle = (type: StagedChange['type']) => {
    switch (type) {
      case 'create':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'update':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'delete':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'rename':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  // 如果不是管理员或没有暂存变更，不显示按钮
  if (!isAdmin || !stagingArea.hasStagedChanges()) {
    return null;
  }

  const stagedCount = stagingArea.getStagedCount();

  return (
    <>
      {/* 浮动按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2 group"
        title="暂存区"
      >
        <GitCommit className="w-5 h-5" />
        <span className="text-sm font-medium">{stagedCount} 个待提交变更</span>
      </button>

      {/* 暂存区对话框 */}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 bg-card rounded-t-2xl md:rounded-2xl p-6 max-h-[80vh] w-full md:w-[600px] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-xl font-bold flex items-center gap-2">
                <GitCommit className="w-5 h-5 text-primary" />
                暂存区
              </Dialog.Title>
              <Dialog.Close className="p-2 rounded hover:bg-secondary transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </Dialog.Close>
            </div>

            {/* 变更列表 */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-6">
              {changes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  暂存区为空
                </div>
              ) : (
                <>
                  {/* 全选复选框 */}
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border">
                    <input
                      type="checkbox"
                      id="select-all"
                      checked={selectedIds.length === changes.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-border"
                    />
                    <label htmlFor="select-all" className="text-sm font-medium">
                      全选 ({selectedIds.length}/{changes.length})
                    </label>
                  </div>

                  {/* 变更项列表 */}
                  {changes.map((change) => (
                    <div
                      key={change.id}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedIds.includes(change.id)
                          ? 'bg-primary/10 border-primary/50'
                          : 'bg-muted/30 border-border'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* 复选框 */}
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(change.id)}
                          onChange={() => handleSelectChange(change.id)}
                          className="w-4 h-4 mt-1 rounded border-border"
                        />

                        {/* 变更图标和摘要 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getChangeIcon(change.type)}
                            <span className={`text-xs font-medium px-2 py-0.5 rounded border ${getChangeTypeStyle(change.type)}`}>
                              {getChangeTypeLabel(change.type)}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-foreground truncate">
                            {stagingArea.getChangeSummary(change)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {change.data.title}
                          </div>
                        </div>

                        {/* 移除按钮 */}
                        <button
                          onClick={() => handleUnstage(change.id)}
                          className="p-1.5 rounded hover:bg-secondary transition-colors"
                          title="移除暂存"
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* 操作按钮 */}
            {changes.length > 0 && (
              <div className="flex gap-2 pt-4 border-t border-border">
                <button
                  onClick={handleCommitAll}
                  disabled={isCommitting}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  提交所有
                </button>
                <button
                  onClick={handleCommit}
                  disabled={selectedIds.length === 0 || isCommitting}
                  className="flex-1 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <GitCommit className="w-4 h-4" />
                  提交选中 ({selectedIds.length})
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}