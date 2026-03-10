import { ChevronRight } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useI18n } from '@/contexts/I18nContext';

interface TabPanelProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  count?: number;
  tags?: string[];
  selectedTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  children: ReactNode;
}

export function TabPanel({ 
  title, 
  subtitle, 
  icon, 
  count, 
  tags,
  selectedTags = [],
  onTagsChange,
  searchValue,
  onSearchChange,
  children 
}: TabPanelProps) {
  const { translations } = useI18n();
  const [localSearch, setLocalSearch] = useState('');
  
  const currentSearch = searchValue !== undefined ? searchValue : localSearch;
  const setSearch = onSearchChange || setLocalSearch;

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  const handleTagClick = (tag: string) => {
    if (onTagsChange) {
      const newTags = selectedTags.includes(tag)
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag];
      onTagsChange(newTags);
    }
  };

  return (
    <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot terminal-dot-red" />
            <span className="terminal-dot terminal-dot-yellow" />
            <span className="terminal-dot terminal-dot-green" />
            <span className="ml-auto text-xs text-muted-foreground font-mono">ready</span>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2">
              {icon || <ChevronRight className="w-6 h-6 text-primary" />}
              <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            </div>
            
            {count !== undefined && (
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <span className="text-sm text-muted-foreground font-mono">
                  $ count: <span className="text-primary">{formatNumber(count)}</span>
                  {subtitle || translations?.common.itemsCount}
                </span>
                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <button
                        key={`${tag}-${index}`}
                        onClick={() => handleTagClick(tag)}
                        className={`px-2 py-0.5 rounded text-xs font-mono border transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-primary/20 text-primary border-primary/50'
                            : 'bg-transparent text-muted-foreground border-border hover:border-primary/50'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot terminal-dot-red" />
            <span className="terminal-dot terminal-dot-yellow" />
            <span className="terminal-dot terminal-dot-green" />
            <span className="ml-2 text-xs text-muted-foreground font-mono">search</span>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <span className="text-success font-mono">$</span>
              <span className="text-muted-foreground font-mono">find</span>
              <input
                type="text"
                value={currentSearch}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={translations?.common.searchPlaceholder}
                className="flex-1 bg-transparent text-foreground font-mono text-sm placeholder:text-muted-foreground/50 focus:outline-none"
              />
              {currentSearch && (
                <button
                  onClick={() => setSearch('')}
                  className="px-3 py-1 rounded-md bg-secondary/50 text-muted-foreground text-xs font-mono hover:bg-secondary transition-colors"
                >
                  clear
                </button>
              )}
            </div>
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}
