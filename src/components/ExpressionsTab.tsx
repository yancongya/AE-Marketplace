import { useState, useEffect } from 'react';
import { Code, Code2 } from 'lucide-react';
import { TabPanel } from './TabPanel';
import { TabCard } from './TabCard';
import { TabContent } from './TabContent';
import { loadContent, type ContentItem } from '@/lib/content';

export function ExpressionsTab() {
  const [list, setList] = useState<ContentItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent().then(data => {
      setList(data.expressions);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <TabPanel title="表达式" count={0} icon={<Code2 className="w-6 h-6 text-primary" />} searchPlaceholder="加载中...">
        <div className="text-center py-8 text-muted-foreground">加载中...</div>
      </TabPanel>
    );
  }

  if (selectedItem) {
    return (
      <TabContent
        title={selectedItem.title}
        iconEmoji={selectedItem.iconEmoji}
        subtitle={`${selectedItem.author}/${selectedItem.slug}`}
        command={selectedItem.command}
        stars={selectedItem.stars}
        downloads={selectedItem.downloads}
        updatedAt={selectedItem.updatedAt}
        content={selectedItem.content}
        onBack={() => setSelectedItem(null)}
      />
    );
  }

  return (
    <TabPanel
      title="表达式"
      count={list.length}
      icon={<Code2 className="w-6 h-6 text-primary" />}
      searchPlaceholder="搜索表达式..."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((item) => (
          <TabCard
            key={item.slug}
            title={item.title}
            subtitle={`${item.author}/${item.slug}`}
            description={item.description}
            iconEmoji={item.iconEmoji}
            count={item.stars || 0}
            command={item.command}
            onClick={() => setSelectedItem(item)}
          />
        ))}
      </div>
    </TabPanel>
  );
}

export function ScriptsTab() {
  const [list, setList] = useState<ContentItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent().then(data => {
      setList(data.scripts);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <TabPanel title="脚本" count={0} icon={<Code className="w-6 h-6 text-primary" />} searchPlaceholder="加载中...">
        <div className="text-center py-8 text-muted-foreground">加载中...</div>
      </TabPanel>
    );
  }

  if (selectedItem) {
    return (
      <TabContent
        title={selectedItem.title}
        iconEmoji={selectedItem.iconEmoji}
        subtitle={`${selectedItem.author}/${selectedItem.slug}`}
        command={selectedItem.command}
        stars={selectedItem.stars}
        downloads={selectedItem.downloads}
        updatedAt={selectedItem.updatedAt}
        content={selectedItem.content}
        onBack={() => setSelectedItem(null)}
      />
    );
  }

  return (
    <TabPanel
      title="脚本"
      count={list.length}
      icon={<Code className="w-6 h-6 text-primary" />}
      searchPlaceholder="搜索脚本..."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((item) => (
          <TabCard
            key={item.slug}
            title={item.title}
            subtitle={`${item.author}/${item.slug}`}
            description={item.description}
            iconEmoji={item.iconEmoji}
            count={item.stars || 0}
            command={item.command}
            onClick={() => setSelectedItem(item)}
          />
        ))}
      </div>
    </TabPanel>
  );
}
