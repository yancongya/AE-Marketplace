import { 
  Play, Code, Type, Square, Sparkles, Palette, 
  Target, Camera, Music, Layout, Box, Download,
  Folder, Layers
} from 'lucide-react';
import type { ElementType } from 'react';
import { categories } from '@/data/mockData';
import { TabPanel } from './TabPanel';

const iconMap: Record<string, ElementType> = {
  Play, Code, Type, Square, Sparkles, Palette,
  Target, Camera, Music, Layout, Box, Download
};

const formatNumber = (num: number) => {
  return num.toLocaleString('en-US');
};

export function PresetsTab() {
  return (
    <TabPanel
      title="预设分类"
      count={categories.length}
      icon={<Layers className="w-6 h-6 text-primary" />}
      searchPlaceholder="搜索分类..."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Folder;
          return (
            <div 
              key={category.id}
              className="terminal-window card-hover cursor-pointer group"
            >
              <div className="terminal-header">
                <span className="terminal-dot terminal-dot-red" />
                <span className="terminal-dot terminal-dot-yellow" />
                <span className="terminal-dot terminal-dot-green" />
                <span className="ml-auto text-xs text-muted-foreground font-mono flex items-center gap-1">
                  <Folder className="w-3 h-3" />
                  {category.nameEn}
                </span>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-medium">{category.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      <span className="code-keyword">exports</span>
                      <span className="code-number">: {formatNumber(category.count)}</span>
                      <span className="code-comment"> // 个脚本</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground font-mono">
                    <span className="text-success">$</span> cd {category.nameEn} && ls
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </TabPanel>
  );
}
