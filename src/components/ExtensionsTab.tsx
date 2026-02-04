import { useState, useEffect } from 'react';
import { Box } from 'lucide-react';
import { TabPanel } from './TabPanel';
import { TabCard } from './TabCard';
import { TabContent } from './TabContent';
import { loadContent, type ExtensionItem } from '@/lib/content';

export function ExtensionsTab() {
  const [list, setList] = useState<ExtensionItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ExtensionItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent().then(data => {
      setList(data.extensions);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <TabPanel title="扩展文档" count={0} icon={<Box className="w-6 h-6 text-primary" />} searchPlaceholder="加载中...">
        <div className="text-center py-8 text-muted-foreground">加载中...</div>
      </TabPanel>
    );
  }

  if (selectedItem) {
    return (
      <TabContent
        title={selectedItem.title}
        iconEmoji={selectedItem.iconEmoji}
        subtitle={selectedItem.slug}
        command={selectedItem.command}
        content={selectedItem.content}
        onBack={() => setSelectedItem(null)}
      />
    );
  }

  return (
    <TabPanel
      title="扩展文档"
      count={list.length}
      icon={<Box className="w-6 h-6 text-primary" />}
      searchPlaceholder="搜索文档..."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((item) => (
          <TabCard
            key={item.slug}
            title={item.title}
            description={item.description}
            iconEmoji={item.iconEmoji}
            command={item.command}
            onClick={() => setSelectedItem(item)}
          />
        ))}
      </div>
    </TabPanel>
  );
}
