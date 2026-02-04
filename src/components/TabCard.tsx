interface TabCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  iconEmoji?: string;
  count?: string | number;
  command?: string;
  onClick?: () => void;
}

export function TabCard({ 
  title, 
  subtitle, 
  description, 
  iconEmoji,
  count, 
  command,
  onClick 
}: TabCardProps) {
  const formatNumber = (num: string | number) => {
    if (typeof num === 'string') return num;
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div 
      onClick={onClick}
      className="terminal-window card-hover cursor-pointer group"
    >
      <div className="terminal-header">
        <span className="terminal-dot terminal-dot-red" />
        <span className="terminal-dot terminal-dot-yellow" />
        <span className="terminal-dot terminal-dot-green" />
        {count !== undefined && (
          <span className="ml-auto text-xs text-muted-foreground font-mono">
            {formatNumber(count)}
          </span>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          {iconEmoji && (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg flex-shrink-0">
              {iconEmoji}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-foreground font-medium truncate">{title}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground font-mono truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        {command && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground font-mono truncate">
              <span className="text-success">$</span> {command}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
