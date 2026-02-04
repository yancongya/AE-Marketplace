import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Code, Code2 } from 'lucide-react';
import { TabPanel } from './TabPanel';
import { TabCard } from './TabCard';
import { TabContent } from './TabContent';
import { loadContent, type ContentItem } from '@/lib/content';

export function ExpressionsTab() {
  const [list, setList] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadContent().then(data => {
      setList(data.expressions);
      setLoading(false);
    });
  }, []);

  const selectedItem = list.find(item => item.slug === slug);

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
        subtitle={selectedItem.description}
        author={selectedItem.author}
        updatedAt={selectedItem.updatedAt}
        tags={selectedItem.tags}
        content={selectedItem.content}
        onBack={() => navigate('/expressions')}
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
            author={item.author}
            updatedAt={item.updatedAt}
            to={`/expressions/${item.slug}`}
          />
        ))}
      </div>
    </TabPanel>
  );
}

export function ScriptsTab() {
  const [list, setList] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadContent().then(data => {
      setList(data.scripts);
      setLoading(false);
    });
  }, []);

  const selectedItem = list.find(item => item.slug === slug);

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
        subtitle={selectedItem.description}
        author={selectedItem.author}
        updatedAt={selectedItem.updatedAt}
        tags={selectedItem.tags}
        content={selectedItem.content}
        onBack={() => navigate('/scripts')}
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
            author={item.author}
            updatedAt={item.updatedAt}
            to={`/scripts/${item.slug}`}
          />
        ))}
      </div>
    </TabPanel>
  );
}
