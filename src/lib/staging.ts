import type { ContentItem } from './content';

/**
 * 暂存变更类型
 */
export type ChangeType = 'create' | 'update' | 'delete' | 'rename';

/**
 * 暂存的变更
 */
export interface StagedChange {
  id: string; // 唯一 ID
  type: ChangeType;
  category: string;
  slug: string;
  oldSlug?: string; // 仅 rename 类型使用
  data: ContentItem; // 完整的文档数据
  originalData?: ContentItem; // 原始数据（用于 diff）
  timestamp: number; // 创建时间
}

/**
 * 暂存区管理类
 */
export class StagingArea {
  private static readonly STORAGE_KEY = 'staging_area_changes';
  private changes: StagedChange[] = [];

  constructor() {
    this.loadFromStorage();
  }

  /**
   * 从 localStorage 加载暂存区数据
   */
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(StagingArea.STORAGE_KEY);
      if (data) {
        this.changes = JSON.parse(data);
      }
    } catch (error) {
      console.error('加载暂存区失败:', error);
      this.changes = [];
    }
  }

  /**
   * 保存暂存区数据到 localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(StagingArea.STORAGE_KEY, JSON.stringify(this.changes));
    } catch (error) {
      console.error('保存暂存区失败:', error);
    }
  }

  /**
   * 添加变更到暂存区
   */
  stageChange(change: Omit<StagedChange, 'id' | 'timestamp'>): string {
    const id = `${change.type}-${change.category}-${change.slug}-${Date.now()}`;
    const stagedChange: StagedChange = {
      ...change,
      id,
      timestamp: Date.now(),
    };

    // 检查是否已存在相同的变更
    const existingIndex = this.changes.findIndex(
      (c) => c.category === change.category && c.slug === change.slug
    );

    if (existingIndex !== -1) {
      // 更新现有变更
      this.changes[existingIndex] = stagedChange;
    } else {
      // 添加新变更
      this.changes.push(stagedChange);
    }

    this.saveToStorage();
    console.log(`[StagingArea] 已暂存变更: ${id}`);
    return id;
  }

  /**
   * 从暂存区移除变更
   */
  unstageChange(id: string): boolean {
    const index = this.changes.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.changes.splice(index, 1);
      this.saveToStorage();
      console.log(`[StagingArea] 已移除暂存变更: ${id}`);
      return true;
    }
    return false;
  }

  /**
   * 获取所有暂存的变更
   */
  getStagedChanges(): StagedChange[] {
    return [...this.changes];
  }

  /**
   * 获取指定分类的暂存变更
   */
  getStagedChangesByCategory(category: string): StagedChange[] {
    return this.changes.filter((c) => c.category === category);
  }

  /**
   * 获取暂存区中的变更数量
   */
  getStagedCount(): number {
    return this.changes.length;
  }

  /**
   * 检查是否有暂存的变更
   */
  hasStagedChanges(): boolean {
    return this.changes.length > 0;
  }

  /**
   * 清空暂存区
   */
  clear(): void {
    this.changes = [];
    this.saveToStorage();
    console.log('[StagingArea] 已清空暂存区');
  }

  /**
   * 提交选定的变更到 GitHub
   */
  async commitSelected(
    ids: string[],
    token: string
  ): Promise<{ success: boolean; errors: string[] }> {
    const selectedChanges = this.changes.filter((c) => ids.includes(c.id));
    const errors: string[] = [];

    console.log(`[StagingArea] 开始提交 ${selectedChanges.length} 个变更`);

    for (const change of selectedChanges) {
      try {
        await this.commitChange(change, token);
      } catch (error: any) {
        const errorMsg = `提交失败 [${change.type} ${change.category}/${change.slug}]: ${error.message}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    // 移除成功提交的变更
    const successfulIds = selectedChanges
      .filter((_, index) => !errors[index])
      .map((c) => c.id);

    successfulIds.forEach((id) => this.unstageChange(id));

    return {
      success: errors.length === 0,
      errors,
    };
  }

  /**
   * 提交所有变更到 GitHub
   */
  async commitAll(token: string): Promise<{ success: boolean; errors: string[] }> {
    const ids = this.changes.map((c) => c.id);
    return this.commitSelected(ids, token);
  }

  /**
   * 提交单个变更到 GitHub
   */
  private async commitChange(change: StagedChange, token: string): Promise<void> {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    switch (change.type) {
      case 'create':
        await this.apiCreate(change, headers);
        break;
      case 'update':
        await this.apiUpdate(change, headers);
        break;
      case 'delete':
        await this.apiDelete(change, headers);
        break;
      case 'rename':
        await this.apiRename(change, headers);
        break;
    }
  }

  /**
   * 创建文件 API
   */
  private async apiCreate(change: StagedChange, headers: HeadersInit): Promise<void> {
    const response = await fetch('/api/admin/create', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        category: change.category,
        slug: change.slug,
        data: change.data,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '创建失败');
    }
  }

  /**
   * 更新文件 API
   */
  private async apiUpdate(change: StagedChange, headers: HeadersInit): Promise<void> {
    const response = await fetch('/api/admin/update', {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        category: change.category,
        slug: change.slug,
        data: change.data,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '更新失败');
    }
  }

  /**
   * 删除文件 API
   */
  private async apiDelete(change: StagedChange, headers: HeadersInit): Promise<void> {
    const response = await fetch('/api/admin/delete', {
      method: 'DELETE',
      headers,
      body: JSON.stringify({
        category: change.category,
        filename: `${change.slug}.md`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '删除失败');
    }
  }

  /**
   * 重命名文件 API
   */
  private async apiRename(change: StagedChange, headers: HeadersInit): Promise<void> {
    if (!change.oldSlug) {
      throw new Error('重命名需要 oldSlug');
    }

    const response = await fetch('/api/admin/rename', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        category: change.category,
        oldSlug: change.oldSlug,
        newSlug: change.slug,
        data: change.data,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '重命名失败');
    }
  }

  /**
   * 获取变更摘要
   */
  getChangeSummary(change: StagedChange): string {
    const typeLabels = {
      create: '新建',
      update: '更新',
      delete: '删除',
      rename: '重命名',
    };

    const typeLabel = typeLabels[change.type];
    const filename = `${change.slug}.md`;

    if (change.type === 'rename' && change.oldSlug) {
      return `${typeLabel}: ${change.oldSlug}.md → ${filename}`;
    }

    return `${typeLabel}: ${filename}`;
  }

  /**
   * 检查是否有冲突（文件已被其他人修改）
   */
  async checkConflicts(_changes: StagedChange[]): Promise<StagedChange[]> {
    // TODO: 实现冲突检测
    // 需要获取文件最新 SHA 并与 originalData 比较
    return [];
  }
}

// 导出单例
export const stagingArea = new StagingArea();