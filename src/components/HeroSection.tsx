import { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface StatsData {
  totalScripts: number;
  dailyGrowth: number;
  peakCount: number;
  peakDay: string;
  radarData: Array<{
    category: string;
    value: number;
    count: number;
  }>;
}

interface RadarPoint {
  x: number;
  y: number;
  value: number;
  count: number;
  category: string;
}

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animatedCount, setAnimatedCount] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState<RadarPoint | null>(null);
  const [statsData, setStatsData] = useState<StatsData | null>(null);

  useEffect(() => {
    fetch('/stats.json')
      .then(res => res.json())
      .then(data => setStatsData(data))
      .catch(() => {
        setStatsData({
          totalScripts: 12847,
          dailyGrowth: 42,
          peakCount: 847,
          peakDay: '2025-01-15',
          radarData: [
            { category: '表达式', value: 75, count: 3200 },
            { category: '脚本', value: 92, count: 4500 },
            { category: '预设', value: 68, count: 2800 },
            { category: '扩展', value: 54, count: 2347 }
          ]
        });
      });
  }, []);

  useEffect(() => {
    if (!statsData) return;

    // Animate number counting
    const duration = 1500;
    const start = 0;
    const end = statsData.totalScripts;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (end - start) * easeOutQuart);
      
      setAnimatedCount(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [statsData]);

  useEffect(() => {
    if (!statsData) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationProgress = 0;
    let animationId: number;
    let dataPoints: RadarPoint[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width / window.devicePixelRatio);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height / window.devicePixelRatio);

      let found: RadarPoint | null = null;
      for (const point of dataPoints) {
        const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
        if (distance < 10) {
          found = point;
          break;
        }
      }
      setHoveredPoint(found);
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Draw radar chart with animation
    const drawRadarChart = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 - 50;

      ctx.clearRect(0, 0, width, height);

      const maxValue = 100;
      const numPoints = statsData.radarData.length;

      // Draw grid circles with terminal style
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius / 4) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw axes with terminal style
      ctx.strokeStyle = '#3a3a3a';
      ctx.lineWidth = 1;
      dataPoints = [];
      
      statsData.radarData.forEach((item, index) => {
        const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Calculate data point position
        const value = item.value / maxValue;
        const pointX = centerX + Math.cos(angle) * radius * value;
        const pointY = centerY + Math.sin(angle) * radius * value;
        
        dataPoints.push({
          x: pointX,
          y: pointY,
          value: item.value,
          count: item.count,
          category: item.category
        });
      });

      // Draw animated data polygon
      const currentProgress = Math.min(animationProgress, 1);
      
      ctx.beginPath();
      statsData.radarData.forEach((item, index) => {
        const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
        const value = (item.value / maxValue) * currentProgress;
        const x = centerX + Math.cos(angle) * radius * value;
        const y = centerY + Math.sin(angle) * radius * value;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();
      
      // Fill with terminal gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(96, 165, 250, 0.3)');
      gradient.addColorStop(1, 'rgba(96, 165, 250, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Stroke with terminal style
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw data points with terminal style
      dataPoints.forEach((point) => {
        const isHovered = hoveredPoint && hoveredPoint.category === point.category;
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, isHovered ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? '#60a5fa' : '#4a5568';
        ctx.fill();
        ctx.strokeStyle = isHovered ? '#93c5fd' : '#2a2a2a';
        ctx.lineWidth = isHovered ? 3 : 2;
        ctx.stroke();

        // Draw value label when hovered
        if (isHovered) {
          ctx.fillStyle = '#93c5fd';
          ctx.font = '11px JetBrains Mono';
          ctx.textAlign = 'center';
          ctx.fillText(`${point.count}`, point.x, point.y - 12);
        }
      });

      // Draw category labels
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      statsData.radarData.forEach((item, index) => {
        const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
        const labelX = centerX + Math.cos(angle) * (radius + 25);
        const labelY = centerY + Math.sin(angle) * (radius + 25);
        
        const isHovered = hoveredPoint && hoveredPoint.category === item.category;
        ctx.fillStyle = isHovered ? '#93c5fd' : '#6b7280';
        ctx.fillText(item.category, labelX, labelY);
      });
    };

    const animate = () => {
      animationProgress += 0.02;
      drawRadarChart();
      
      if (animationProgress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        drawRadarChart();
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [hoveredPoint, statsData]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  return (
    <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left side - Main content */}
          <div className="space-y-8">
            {/* Terminal window */}
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="terminal-dot terminal-dot-red" />
                <span className="terminal-dot terminal-dot-yellow" />
                <span className="terminal-dot terminal-dot-green" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">ae_scripts.market</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-2">
                  <span className="text-primary font-mono">{'>'}</span>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                    AE Scripts
                    <br />
                    <span className="text-gradient">Marketplace</span>
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ChevronRight className="w-4 h-4 text-primary" />
                  <span className="font-mono text-sm">基于开放的 ExtendScript 生态系统</span>
                </div>
              </div>
            </div>

            {/* Stats card */}
            <div className="terminal-window">
              <div className="p-6">
                <div className="code-block">
                  <span className="code-keyword">const</span>
                  <span className="text-foreground"> scripts </span>
                  <span className="code-keyword">=</span>
                  <span className="code-number text-3xl font-bold ml-2"> {formatNumber(animatedCount)}</span>
                  <span className="text-muted-foreground">;</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground font-mono">
                  <span className="code-comment">// 一些自用或自制的ae表达式 脚本 预设 扩展等。</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Radar Chart */}
          <div className="terminal-window">
            <div className="terminal-header">
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-yellow" />
              <span className="terminal-dot terminal-dot-green" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">radar-analysis.tsx</span>
            </div>
            <div className="p-4">
              <canvas 
                ref={canvasRef}
                className="w-full h-64 cursor-crosshair"
              />
              <p className="mt-4 text-xs text-center text-muted-foreground font-mono">
                <span className="text-green-400">$</span> 悬停在点上查看详细数量
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
