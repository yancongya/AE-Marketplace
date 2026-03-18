import { useState, useEffect } from 'react';
import { Box } from 'lucide-react';
import { TabList } from './TabList';
import { loadContent, type ExtensionItem } from '@/lib/content';
import { useI18n } from '@/contexts/I18nContext';

export function ExtensionsTab() {
  const { translations } = useI18n();
  const [data, setData] = useState<ExtensionItem[]>([]);

  useEffect(() => {
    loadContent().then(content => {
      setData(content.extensions);
    });
  }, []);

  return (
    <TabList
      category="extensions"
      title={translations?.nav.extensions || '扩展'}
      icon={<Box className="w-6 h-6 text-primary" />}
      data={data}
    />
  );
}
