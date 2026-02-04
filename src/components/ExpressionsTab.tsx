import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Code, Code2 } from 'lucide-react';
import { TabPanel } from './TabPanel';
import { TabCard } from './TabCard';
import { TabContent } from './TabContent';
import { loadContent, type ContentItem } from '@/lib/content';

export function ExpressionsTab() {
  const [list, setList] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadContent().then(data => {
      setList(data.expressions);
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
      <TabPanel title="表达式" count={0} icon={<Code2 className="w-6 h-6 text-primary" />}>
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
      count={filteredList.length}
      icon={<Code2 className="w-6 h-6 text-primary" />}
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadContent().then(data => {
      setList(data.scripts);
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
      <TabPanel title="脚本" count={0} icon={<Code className="w-6 h-6 text-primary" />}>
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
      count={filteredList.length}
      icon={<Code className="w-6 h-6 text-primary" />}
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
