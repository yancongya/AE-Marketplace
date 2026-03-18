import { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';
import { TabList } from './TabList';
import { loadContent, type PresetItem } from '@/lib/content';
import { useI18n } from '@/contexts/I18nContext';

export function PresetsTab() {
  const { translations } = useI18n();
  const [data, setData] = useState<PresetItem[]>([]);

  useEffect(() => {
    loadContent().then(content => {
      setData(content.presets);
    });
  }, []);

  return (
    <TabList
      category="presets"
      title={translations?.nav.presets || '预设'}
      icon={<Layers className="w-6 h-6 text-primary" />}
      data={data}
    />
  );
}
