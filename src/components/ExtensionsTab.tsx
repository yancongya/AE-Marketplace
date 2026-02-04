import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box } from 'lucide-react';
import { TabPanel } from './TabPanel';
import { TabCard } from './TabCard';
import { TabContent } from './TabContent';
import { loadContent, type ExtensionItem } from '@/lib/content';

export function ExtensionsTab() {
  const [list, setList] = useState<ExtensionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadContent().then(data => {
      setList(data.extensions);
      setLoading(false);
    });
  }, []);

  const selectedItem = list.find(item => item.slug === slug);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    list.forEach(item => {
      item.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [list]);

  const filteredList = useMemo(() => {
    return list.filter(item => {
      const matchesTag = selectedTags.length === 0 || selectedTags.some(tag => item.tags?.includes(tag));
      const matchesSearch = !searchTerm || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTag && matchesSearch;
    });
  }, [list, selectedTags, searchTerm]);

  if (loading) {
    return (
      <TabPanel title="扩展文档" count={0} icon={<Box className="w-6 h-6 text-primary" />}>
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
        author={selectedItem.author}
        updatedAt={selectedItem.updatedAt}
        tags={selectedItem.tags}
        filename={`${selectedItem.slug}.md`}
        onBack={() => navigate('/extensions')}
      />
    );
  }

  return (
    <TabPanel
      title="扩展文档"
      count={filteredList.length}
      icon={<Box className="w-6 h-6 text-primary" />}
      tags={allTags}
      selectedTags={selectedTags}
      onTagsChange={setSelectedTags}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredList.map((item) => (
          <TabCard
            key={item.slug}
            title={item.title}
            description={item.description}
            iconEmoji={item.iconEmoji}
            author={item.author}
            updatedAt={item.updatedAt}
            to={`/extensions/${item.slug}`}
          />
        ))}
      </div>
    </TabPanel>
  );
}
