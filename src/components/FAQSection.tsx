import { useState } from 'react';
import { ChevronRight, Plus, Minus } from 'lucide-react';
import { faqItems } from '@/data/mockData';

interface FAQSectionProps {
  onViewChange?: (view: string) => void;
}

export function FAQSection({ onViewChange }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot terminal-dot-red" />
            <span className="terminal-dot terminal-dot-yellow" />
            <span className="terminal-dot terminal-dot-green" />
            <span className="ml-2 text-xs text-muted-foreground font-mono">FAQ.md</span>
            <span className="ml-auto text-xs text-muted-foreground font-mono">{faqItems.length} questions</span>
          </div>
          <div className="p-6">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              <span className="text-muted-foreground">#</span> 常见问题
            </h2>
              <p className="text-sm text-muted-foreground font-mono">
              关于 AE Scripts、After Effects 和 2025 年 AE 扩展的所有信息
            </p>
          </div>
        </div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div 
              key={index}
              className="terminal-window overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-mono">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-blue-400 font-mono text-sm">Q:</span>
                  <span className="text-foreground text-sm">{item.question}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">[+]</span>
                  {openIndex === index ? (
                    <Minus className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-4 pb-4 pl-16">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground text-sm">
            还有关于 AE Scripts 的问题？
          </p>
          <button 
            onClick={() => onViewChange?.('docs')}
            className="px-6 py-3 rounded-lg border border-gray-700 text-muted-foreground font-mono text-sm inline-flex items-center gap-2 hover:bg-secondary transition-colors"
          >
            <span className="text-green-400">$</span> open /docs && explore
            <ChevronRight className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      </div>
    </section>
  );
}
