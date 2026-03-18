import { useState, useEffect } from 'react';
import { Code2, Code } from 'lucide-react';
import { TabList } from './TabList';
import { loadContent, type ContentItem } from '@/lib/content';
import { useI18n } from '@/contexts/I18nContext';

export function ExpressionsTab() {
  const { translations } = useI18n();
  const [data, setData] = useState<ContentItem[]>([]);

  useEffect(() => {
    loadContent().then(content => {
      setData(content.expressions);
    });
  }, []);

  return (
    <TabList
      category="expressions"
      title={translations?.nav.expressions || '表达式'}
      icon={<Code2 className="w-6 h-6 text-primary" />}
      data={data}
    />
  );
}

export function ScriptsTab() {
  const { translations } = useI18n();
  const [data, setData] = useState<ContentItem[]>([]);

  useEffect(() => {
    loadContent().then(content => {
      setData(content.scripts);
    });
  }, []);

  return (
    <TabList
      category="scripts"
      title={translations?.nav.scripts || '脚本'}
      icon={<Code className="w-6 h-6 text-primary" />}
      data={data}
    />
  );
}
