import { Search, Star, Clock, ChevronRight } from 'lucide-react';
import { useState, type ReactNode } from 'react';

interface TabPanelProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  count?: number;
  sortOptions?: { id: string; label: string }[];
  sortValue?: string;
  onSortChange?: (value: string) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  children: ReactNode;
}

export function TabPanel({ 
  title, 
  subtitle, 
  icon, 
  count, 
  sortOptions = [
    { id: 'stars', label: 'stars' },
    { id: 'recent', label: 'recent' }
  ],
  sortValue,
  onSortChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = '搜索项目...',
  children 
}: TabPanelProps) {
  const [localSort, setLocalSort] = useState('stars');
  const [localSearch, setLocalSearch] = useState('');

  const currentSort = sortValue !== undefined ? sortValue : localSort;
  const setSort = onSortChange || setLocalSort;
  
  const currentSearch = searchValue !== undefined ? searchValue : localSearch;
  const setSearch = onSearchChange || setLocalSearch;

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot terminal-dot-red" />
            <span className="terminal-dot terminal-dot-yellow" />
            <span className="terminal-dot terminal-dot-green" />
            <span className="ml-auto text-xs text-muted-foreground font-mono">ready</span>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              {icon || <ChevronRight className="w-6 h-6 text-primary" />}
              <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              {count !== undefined && (
                <span className="text-sm text-muted-foreground font-mono">
                  $ count: <span className="text-primary">{formatNumber(count)}</span>
                  {subtitle || ' 个项目'}
                </span>
              )}
              <span className="text-sm text-muted-foreground font-mono">--sort</span>
              <div className="flex gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSort(option.id)}
                    className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-all ${
                      currentSort === option.id
                        ? 'bg-primary/20 text-primary border border-primary/50'
                        : 'bg-secondary text-muted-foreground border border-transparent hover:border-border'
                    }`}
                  >
                    {option.id === 'stars' ? <Star className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot terminal-dot-red" />
            <span className="terminal-dot terminal-dot-yellow" />
            <span className="terminal-dot terminal-dot-green" />
            <span className="ml-2 text-xs text-muted-foreground font-mono">search --ai</span>
            <span className="ml-auto text-xs text-muted-foreground font-mono">
              输入内容筛选，或按 ⌘ 进行 AI 搜索
            </span>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <span className="text-success font-mono">$</span>
              <span className="text-muted-foreground font-mono">find</span>
              <input
                type="text"
                value={currentSearch}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="flex-1 bg-transparent text-foreground font-mono text-sm placeholder:text-muted-foreground/50 focus:outline-none"
              />
              <button className="px-4 py-2 rounded-md bg-primary/20 text-primary text-xs font-mono flex items-center gap-2 hover:bg-primary/30 transition-colors">
                <Search className="w-3 h-3" />
                execute
              </button>
            </div>
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}
