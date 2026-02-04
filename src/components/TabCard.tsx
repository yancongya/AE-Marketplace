import { Link } from 'react-router-dom';
 
interface TabCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  iconEmoji?: string;
  count?: string | number;
  author?: string;
  updatedAt?: string;
  onClick?: () => void;
  to?: string;
}
 
export function TabCard({ 
  title, 
  subtitle, 
  description, 
  iconEmoji,
  count, 
  author,
  updatedAt,
  onClick,
  to 
}: TabCardProps) {
  const formatNumber = (num: string | number) => {
    if (typeof num === 'string') return num;
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };
 
  const content = (
    <div 
      className="terminal-window card-hover cursor-pointer group h-full flex flex-col"
      title={description}
    >
      <div className="terminal-header flex-shrink-0">
        <span className="terminal-dot terminal-dot-red" />
        <span className="terminal-dot terminal-dot-yellow" />
        <span className="terminal-dot terminal-dot-green" />
        {count !== undefined && (
          <span className="ml-auto text-xs text-muted-foreground font-mono">
            {formatNumber(count)}
          </span>
        )}
      </div>
      
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <div className="flex items-center gap-3 flex-shrink-0">
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
          <p className="text-xs text-muted-foreground truncate">
            {description}
          </p>
        )}
 
        <div className="mt-auto pt-2 border-t border-border flex-shrink-0">
          <p className="text-xs text-muted-font-foreground font-mono truncate">
            <span className="text-green-400">$</span>
            {updatedAt && <span> 更新日期: {updatedAt}</span>}
            {(author || updatedAt) && <span className="text-green-400 ml-2">$</span>}
            {author && <span> 作者: {author}</span>}
          </p>
        </div>
      </div>
    </div>
  );
 
  if (to) {
    return <Link to={to}>{content}</Link>;
  }
 
  return <div onClick={onClick}>{content}</div>;
}
