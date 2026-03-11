import { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { stats } from '@/data/mockData';

export function StatsSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const drawChart = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const padding = 40;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;

      ctx.clearRect(0, 0, width, height);

      // Generate cumulative data
      const points: [number, number][] = [];
      const days = 30;
      let cumulative = 50000;
      for (let i = 0; i <= days; i++) {
        const x = padding + (i / days) * chartWidth;
        cumulative += Math.random() * 2000 + 500;
        const y = padding + chartHeight - ((cumulative - 50000) / 100000) * chartHeight;
        points.push([x, y]);
      }

      // Draw gradient area
      const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
      gradient.addColorStop(0, 'rgba(74, 222, 128, 0.3)');
      gradient.addColorStop(1, 'rgba(74, 222, 128, 0)');

      ctx.beginPath();
      ctx.moveTo(points[0][0], height - padding);
      points.forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.lineTo(points[points.length - 1][0], height - padding);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw line
      ctx.beginPath();
      points.forEach(([x, y], i) => {
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw axes
      ctx.strokeStyle = '#3a3a3a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px JetBrains Mono';
      ctx.textAlign = 'right';
      const yLabels = ['50000', '75000', '100000', '125000', '150000'];
      yLabels.forEach((label, i) => {
        const y = height - padding - (i / (yLabels.length - 1)) * chartHeight;
        ctx.fillText(label, padding - 10, y + 3);
      });
    };

    drawChart();

    return () => window.removeEventListener('resize', resize);
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  return (
    <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot terminal-dot-red" />
            <span className="terminal-dot terminal-dot-yellow" />
            <span className="terminal-dot terminal-dot-green" />
            <span className="ml-2 text-xs text-gray-500 font-mono">$ git log --oneline --graph</span>
          </div>
          <div className="p-6 sm:p-8 text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">脚本时间线</h1>
            </div>
            <p className="text-gray-400 font-mono text-sm sm:text-base">
              <span className="code-comment">// 可视化脚本活动随时间的变化。查看脚本发布时间，追踪社区增长趋势。</span>
            </p>
          </div>
        </div>

        {/* Info card */}
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="text-xs text-gray-500 font-mono">README.md</span>
          </div>
          <div className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-white mb-3">
              <span className="text-gray-500">###</span> 关于此时间线
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              <span className="text-blue-400">[INFO]</span> 此时间线展示了 GitHub 上脚本随时间推送的数量。
              数据基于每个脚本仓库的最后推送日期。使用粒度控制查看每日、每周或每月的活动模式。
            </p>
          </div>
        </div>

        {/* Controls and stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Granularity controls */}
          <div className="terminal-window p-3 sm:p-4">
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-mono">--granularity</span>
                <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-mono">daily</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-mono">--chart</span>
                <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-mono">area</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-mono">--cumulative</span>
                <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-mono">on</span>
              </div>
            </div>
          </div>

          {/* Stats cards */}
          <div className="terminal-window p-3 sm:p-4 text-center">
            <p className="text-xs text-gray-500 font-mono mb-2">总脚本数</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-400">{formatNumber(stats.totalScripts)}</p>
          </div>

          <div className="terminal-window p-3 sm:p-4 text-center">
            <p className="text-xs text-gray-500 font-mono mb-2">平均每个时间段</p>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-400">{stats.dailyGrowth}</p>
          </div>

          <div className="terminal-window p-3 sm:p-4 text-center">
            <p className="text-xs text-gray-500 font-mono mb-2">峰值时期</p>
            <p className="text-xl sm:text-2xl font-bold text-purple-400">{formatNumber(stats.peakCount)}</p>
            <p className="text-xs text-gray-500 mt-1">@ {stats.peakDay}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot terminal-dot-red" />
            <span className="terminal-dot terminal-dot-yellow" />
            <span className="terminal-dot terminal-dot-green" />
            <span className="ml-2 text-xs text-gray-500 font-mono">$ plot timeline.data --type=area --cumulative</span>
            <span className="ml-auto text-xs text-green-400 font-mono">115 points</span>
          </div>
          <div className="p-3 sm:p-4">
            <canvas
              ref={canvasRef}
              className="w-full h-60 sm:h-72 md:h-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
