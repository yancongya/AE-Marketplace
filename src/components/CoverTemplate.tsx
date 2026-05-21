import { forwardRef } from 'react';

interface CoverTemplateProps {
  title: string;
  description?: string;
  category?: string;
}

export const CoverTemplate = forwardRef<HTMLDivElement, CoverTemplateProps>(
  ({ title, description, category }, ref) => {
    // 根据分类选择配色
    const getColors = (cat?: string) => {
      switch (cat) {
        case 'scripts':
          return { from: '#667eea', to: '#764ba2', accent: '#f093fb' };
        case 'expressions':
          return { from: '#f093fb', to: '#f5576c', accent: '#ffecd2' };
        case 'presets':
          return { from: '#4facfe', to: '#00f2fe', accent: '#43e97b' };
        case 'extensions':
          return { from: '#fa709a', to: '#fee140', accent: '#f5576c' };
        default:
          return { from: '#667eea', to: '#764ba2', accent: '#f093fb' };
      }
    };

    const colors = getColors(category);
    const displayTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;
    const displayDesc = description && description.length > 40
      ? description.substring(0, 40) + '...'
      : description;

    return (
      <div
        ref={ref}
        style={{
          width: '640px',
          height: '360px',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* 背景渐变 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
          }}
        />

        {/* 装饰圆形 */}
        <div
          style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.accent}40 0%, transparent 70%)`,
            top: '-100px',
            right: '-50px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.accent}30 0%, transparent 70%)`,
            bottom: '-80px',
            left: '-40px',
          }}
        />

        {/* 网格装饰 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* 边框装饰 */}
        <div
          style={{
            position: 'absolute',
            inset: '16px',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
          }}
        />

        {/* 内容区域 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          {/* 标题 */}
          <h1
            style={{
              fontSize: '42px',
              fontWeight: 700,
              color: '#ffffff',
              margin: 0,
              lineHeight: 1.2,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              letterSpacing: '-0.02em',
            }}
          >
            {displayTitle}
          </h1>

          {/* 描述 */}
          {displayDesc && (
            <p
              style={{
                fontSize: '18px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.85)',
                margin: '16px 0 0 0',
                lineHeight: 1.5,
                maxWidth: '500px',
              }}
            >
              {displayDesc}
            </p>
          )}
        </div>

        {/* 底部装饰 */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
          }}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
        </div>
      </div>
    );
  }
);

CoverTemplate.displayName = 'CoverTemplate';
