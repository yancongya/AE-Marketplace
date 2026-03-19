import { useState, useEffect } from 'react';
import { Code2, Code, Layers, Box } from 'lucide-react';
import { TabList } from './TabList';
import { loadContent, type ContentItem, type PresetItem, type ExtensionItem } from '@/lib/content';
import { useI18n } from '@/contexts/I18nContext';

export type TabItem = ContentItem | PresetItem | ExtensionItem;

export interface CategoryTabProps {
  category: 'expressions' | 'scripts' | 'presets' | 'extensions';
  titleKey: 'expressions' | 'scripts' | 'presets' | 'extensions';
  icon: React.ReactNode;
  dataKey: 'expressions' | 'scripts' | 'presets' | 'extensions';
}

export function CategoryTab({ category, titleKey, icon, dataKey }: CategoryTabProps) {
  const { translations } = useI18n();
  const [data, setData] = useState<TabItem[]>([]);

  useEffect(() => {
    loadContent().then(content => {
      setData(content[dataKey]);
    });
  }, [dataKey]);

  return (
    <TabList
      category={category}
      title={translations?.nav[titleKey] || ''}
      icon={icon}
      data={data}
    />
  );
}

// 导出各个分类的预配置组件（可选，保持向后兼容）
export const ExpressionsTab = () => (
  <CategoryTab 
    category="expressions" 
    titleKey="expressions" 
    icon={<Code2 className="w-6 h-6 text-primary" />} 
    dataKey="expressions" 
  />
);

export const ScriptsTab = () => (
  <CategoryTab 
    category="scripts" 
    titleKey="scripts" 
    icon={<Code className="w-6 h-6 text-primary" />} 
    dataKey="scripts" 
  />
);

export const PresetsTab = () => (
  <CategoryTab 
    category="presets" 
    titleKey="presets" 
    icon={<Layers className="w-6 h-6 text-primary" />} 
    dataKey="presets" 
  />
);

export const ExtensionsTab = () => (
  <CategoryTab 
    category="extensions" 
    titleKey="extensions" 
    icon={<Box className="w-6 h-6 text-primary" />} 
    dataKey="extensions" 
  />
);