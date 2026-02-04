import { HelpCircle, Zap, Code, Lightbulb, Rocket, MessageCircle, Box } from 'lucide-react';
import type { ElementType } from 'react';
import { TabPanel } from './TabPanel';

interface ExtensionsTabProps {
  onViewChange?: (view: string) => void;
}

const docItems = [
  { 
    id: 'what', 
    label: '什么是 Scripts?', 
    icon: HelpCircle,
    description: '了解 AE 脚本的基本概念和工作原理'
  },
  { 
    id: 'advantages', 
    label: '核心优势', 
    icon: Zap,
    description: '发现使用脚本提升工作效率的方法'
  },
  { 
    id: 'vs-expressions', 
    label: 'Scripts vs Expressions', 
    icon: Code,
    description: '了解脚本和表达式的区别与适用场景'
  },
  { 
    id: 'when', 
    label: '何时使用 Scripts', 
    icon: Lightbulb,
    description: '学习在什么情况下使用脚本最合适'
  },
  { 
    id: 'start', 
    label: '如何开始使用', 
    icon: Rocket,
    description: '快速上手使用 AE 脚本的指南'
  },
  { 
    id: 'faq', 
    label: '查看 FAQ', 
    icon: MessageCircle,
    description: '常见问题解答'
  },
];

const iconMap: Record<string, ElementType> = {
  HelpCircle, Zap, Code, Lightbulb, Rocket, MessageCircle
};

export function ExtensionsTab({ onViewChange }: ExtensionsTabProps) {
  return (
    <TabPanel
      title="扩展文档"
      count={docItems.length}
      icon={<Box className="w-6 h-6 text-primary" />}
      searchPlaceholder="搜索文档..."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docItems.map((item) => {
          const Icon = iconMap[item.icon.name] || HelpCircle;
          return (
            <div 
              key={item.id}
              onClick={() => item.id === 'faq' && onViewChange?.('faq')}
              className="terminal-window card-hover cursor-pointer group"
            >
              <div className="terminal-header">
                <span className="terminal-dot terminal-dot-red" />
                <span className="terminal-dot terminal-dot-yellow" />
                <span className="terminal-dot terminal-dot-green" />
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-medium">{item.label}</h3>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </TabPanel>
  );
}
