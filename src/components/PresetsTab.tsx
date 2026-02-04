import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { TabPanel } from './TabPanel';
import { TabCard } from './TabCard';
import { TabContent } from './TabContent';
import { loadContent, type PresetItem } from '@/lib/content';

export function PresetsTab() {
  const [list, setList] = useState<PresetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadContent().then(data => {
      setList(data.presets);
      setLoading(false);
    });
  }, []);

  const selectedItem = list.find(item => item.slug === slug);

  if (loading) {
    return (
      <TabPanel title="预设分类" count={0} icon={<Layers className="w-6 h-6 text-primary" />} searchPlaceholder="加载中...">
        <div className="text-center py-8 text-muted-foreground">加载中...</div>
      </TabPanel>
    );
  }

  if (selectedItem) {
    return (
      <TabContent
        title={selectedItem.title}
        iconEmoji={selectedItem.iconEmoji}
        subtitle={selectedItem.description}
        content={selectedItem.content}
        onBack={() => navigate('/presets')}
      />
    );
  }

  return (
    <TabPanel
      title="预设分类"
      count={list.length}
      icon={<Layers className="w-6 h-6 text-primary" />}
      searchPlaceholder="搜索分类..."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((item) => (
          <TabCard
            key={item.slug}
            title={item.title}
            subtitle={item.nameEn}
            description={item.description}
            iconEmoji={item.iconEmoji}
            count={item.count}
            to={`/presets/${item.slug}`}
          />
        ))}
      </div>
    </TabPanel>
  );
}
