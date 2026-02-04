import type { AEScript, Category, FAQItem } from '@/types';

export const aeScripts: AEScript[] = [
  {
    id: '1',
    name: 'Auto-Keyframe',
    description: 'Automatically create smooth keyframe animations with easing curves. Perfect for motion graphics workflows.',
    author: 'motion-cafe',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=motion',
    repository: 'motion-cafe/auto-keyframe',
    stars: 2847,
    forks: 156,
    downloads: 45200,
    version: '2.1.0',
    updatedAt: '2026-01-28',
    category: 'animation',
    tags: ['keyframes', 'easing', 'automation'],
    compatibility: ['AE 2024', 'AE 2025', 'AE 2026'],
    code: `// Auto-Keyframe Expression
const autoKeyframe = {
  name: "auto-keyframe",
  version: "2.1.0",
  apply: (layer) => {
    return layer.property("Position")
      .setValueAtTime(time, value);
  }
};`
  },
  {
    id: '2',
    name: 'Text-Animator-Pro',
    description: 'Advanced text animation toolkit with 50+ presets. Type-on effects, kinetic typography, and more.',
    author: 'type-foundry',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=type',
    repository: 'type-foundry/text-animator',
    stars: 3421,
    forks: 289,
    downloads: 67800,
    version: '3.5.2',
    updatedAt: '2026-01-25',
    category: 'text',
    tags: ['text', 'typography', 'animation'],
    compatibility: ['AE 2024', 'AE 2025', 'AE 2026'],
    code: `// Text Animator Expression
const textAnim = {
  name: "text-animator-pro",
  animate: (text) => {
    return text.split('').map((char, i) => ({
      char,
      delay: i * 0.05
    }));
  }
};`
  },
  {
    id: '3',
    name: 'Shape-Morpher',
    description: 'Morph between any shapes seamlessly. Includes path interpolation and vertex matching algorithms.',
    author: 'vector-labs',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vector',
    repository: 'vector-labs/shape-morpher',
    stars: 2156,
    forks: 134,
    downloads: 32100,
    version: '1.8.0',
    updatedAt: '2026-01-20',
    category: 'shapes',
    tags: ['shapes', 'morph', 'path'],
    compatibility: ['AE 2024', 'AE 2025', 'AE 2026'],
    code: `// Shape Morph Expression
const morph = {
  name: "shape-morpher",
  morph: (fromPath, toPath) => {
    return interpolate(fromPath, toPath, time);
  }
};`
  },
  {
    id: '4',
    name: 'Color-Grading-Kit',
    description: 'Professional color grading tools for After Effects. LUTs, color wheels, and film emulation.',
    author: 'color-science',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=color',
    repository: 'color-science/grading-kit',
    stars: 1892,
    forks: 98,
    downloads: 28400,
    version: '2.0.1',
    updatedAt: '2026-01-18',
    category: 'color',
    tags: ['color', 'grading', 'lut'],
    compatibility: ['AE 2024', 'AE 2025', 'AE 2026'],
    code: `// Color Grading Expression
const grade = {
  name: "color-grading-kit",
  apply: (layer, lut) => {
    return layer.applyLUT(lut);
  }
};`
  },
  {
    id: '5',
    name: 'Motion-Tracker-Plus',
    description: 'Enhanced motion tracking with AI-powered stabilization and corner pin automation.',
    author: 'track-masters',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=track',
    repository: 'track-masters/motion-tracker',
    stars: 4521,
    forks: 367,
    downloads: 89300,
    version: '4.2.0',
    updatedAt: '2026-02-01',
    category: 'tracking',
    tags: ['tracking', 'stabilization', 'ai'],
    compatibility: ['AE 2024', 'AE 2025', 'AE 2026'],
    code: `// Motion Tracker Expression
const tracker = {
  name: "motion-tracker-plus",
  track: (feature) => {
    return aiTrack(feature, {stable: true});
  }
};`
  },
  {
    id: '6',
    name: 'Expression-Builder',
    description: 'Visual expression builder for non-coders. Drag and drop nodes to create complex expressions.',
    author: 'code-visual',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=code',
    repository: 'code-visual/expr-builder',
    stars: 5634,
    forks: 445,
    downloads: 102000,
    version: '1.5.0',
    updatedAt: '2026-01-30',
    category: 'expressions',
    tags: ['expressions', 'visual', 'nodes'],
    compatibility: ['AE 2024', 'AE 2025', 'AE 2026'],
    code: `// Expression Builder
const builder = {
  name: "expression-builder",
  build: (nodes) => {
    return nodes.compile();
  }
};`
  },
  {
    id: '7',
    name: '3D-Camera-Rig',
    description: 'Advanced 3D camera rigging system with orbit controls, dolly zoom, and crane movements.',
    author: 'camera-works',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=camera',
    repository: 'camera-works/3d-rig',
    stars: 1789,
    forks: 123,
    downloads: 24500,
    version: '2.3.1',
    updatedAt: '2026-01-22',
    category: 'camera',
    tags: ['3d', 'camera', 'rigging'],
    compatibility: ['AE 2024', 'AE 2025', 'AE 2026'],
    code: `// 3D Camera Rig
const rig = {
  name: "3d-camera-rig",
  orbit: (center, radius) => {
    return [center[0] + radius * Math.cos(time),
            center[1] + radius * Math.sin(time)];
  }
};`
  },
  {
    id: '8',
    name: 'Particle-Engine',
    description: 'High-performance particle system with physics simulation and GPU acceleration.',
    author: 'fx-studio',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fx',
    repository: 'fx-studio/particles',
    stars: 3210,
    forks: 234,
    downloads: 56700,
    version: '3.0.0',
    updatedAt: '2026-01-15',
    category: 'effects',
    tags: ['particles', 'physics', 'gpu'],
    compatibility: ['AE 2024', 'AE 2025', 'AE 2026'],
    code: `// Particle Engine
const particles = {
  name: "particle-engine",
  emit: (count, velocity) => {
    return new ParticleSystem(count, velocity);
  }
};`
  },
  {
    id: '9',
    name: 'Audio-Visualizer',
    description: 'Create stunning audio reactive visuals with spectrum analysis and beat detection.',
    author: 'sound-motion',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sound',
    repository: 'sound-motion/visualizer',
    stars: 2890,
    forks: 198,
    downloads: 42300,
    version: '2.5.0',
    updatedAt: '2026-01-12',
    category: 'audio',
    tags: ['audio', 'visualizer', 'reactive'],
    compatibility: ['AE 2024', 'AE 2025', 'AE 2026'],
    code: `// Audio Visualizer
const visualizer = {
  name: "audio-visualizer",
  spectrum: (audio, bands) => {
    return audio.fft(bands);
  }
};`
  }
];

export const categories: Category[] = [
  {
    id: 'animation',
    name: '动画',
    nameEn: 'animation',
    icon: 'Play',
    count: 12450,
    subcategories: [
      { id: 'keyframes', name: '关键帧工具', count: 3420 },
      { id: 'easing', name: '缓动曲线', count: 2150 },
      { id: 'presets', name: '动画预设', count: 6890 }
    ]
  },
  {
    id: 'expressions',
    name: '表达式',
    nameEn: 'expressions',
    icon: 'Code',
    count: 8930,
    subcategories: [
      { id: 'math', name: '数学函数', count: 2340 },
      { id: 'time', name: '时间控制', count: 1890 },
      { id: 'random', name: '随机生成', count: 1560 },
      { id: 'utility', name: '实用工具', count: 3140 }
    ]
  },
  {
    id: 'text',
    name: '文字',
    nameEn: 'text',
    icon: 'Type',
    count: 6780,
    subcategories: [
      { id: 'type-on', name: '打字效果', count: 2340 },
      { id: 'kinetic', name: '动态排版', count: 1890 },
      { id: 'counter', name: '数字计数器', count: 1560 },
      { id: 'formatter', name: '文本格式化', count: 990 }
    ]
  },
  {
    id: 'shapes',
    name: '形状',
    nameEn: 'shapes',
    icon: 'Square',
    count: 5420,
    subcategories: [
      { id: 'morph', name: '形状变形', count: 1890 },
      { id: 'path', name: '路径工具', count: 1560 },
      { id: 'stroke', name: '描边动画', count: 1970 }
    ]
  },
  {
    id: 'effects',
    name: '特效',
    nameEn: 'effects',
    icon: 'Sparkles',
    count: 9870,
    subcategories: [
      { id: 'particles', name: '粒子系统', count: 3450 },
      { id: 'glitch', name: '故障效果', count: 2340 },
      { id: 'light', name: '光效', count: 2780 },
      { id: 'transition', name: '转场', count: 1300 }
    ]
  },
  {
    id: 'color',
    name: '调色',
    nameEn: 'color',
    icon: 'Palette',
    count: 4230,
    subcategories: [
      { id: 'grading', name: '色彩分级', count: 1890 },
      { id: 'lut', name: 'LUT管理', count: 1230 },
      { id: 'correction', name: '色彩校正', count: 1110 }
    ]
  },
  {
    id: 'tracking',
    name: '跟踪',
    nameEn: 'tracking',
    icon: 'Target',
    count: 3560,
    subcategories: [
      { id: 'motion', name: '运动跟踪', count: 1890 },
      { id: 'mask', name: '遮罩跟踪', count: 890 },
      { id: 'stabilize', name: '稳定', count: 780 }
    ]
  },
  {
    id: 'camera',
    name: '相机',
    nameEn: 'camera',
    icon: 'Camera',
    count: 2890,
    subcategories: [
      { id: 'rig', name: '相机绑定', count: 1230 },
      { id: 'projection', name: '投影', count: 890 },
      { id: 'depth', name: '景深', count: 770 }
    ]
  },
  {
    id: 'audio',
    name: '音频',
    nameEn: 'audio',
    icon: 'Music',
    count: 2340,
    subcategories: [
      { id: 'visualizer', name: '可视化', count: 1230 },
      { id: 'sync', name: '同步', count: 670 },
      { id: 'spectrum', name: '频谱', count: 440 }
    ]
  },
  {
    id: 'ui',
    name: '界面',
    nameEn: 'ui',
    icon: 'Layout',
    count: 1890,
    subcategories: [
      { id: 'panels', name: '面板扩展', count: 890 },
      { id: 'shortcuts', name: '快捷键', count: 560 },
      { id: 'workflow', name: '工作流', count: 440 }
    ]
  },
  {
    id: '3d',
    name: '三维',
    nameEn: '3d',
    icon: 'Box',
    count: 3120,
    subcategories: [
      { id: 'import', name: '模型导入', count: 1230 },
      { id: 'material', name: '材质', count: 890 },
      { id: 'lighting', name: '灯光', count: 1000 }
    ]
  },
  {
    id: 'export',
    name: '导出',
    nameEn: 'export',
    icon: 'Download',
    count: 1560,
    subcategories: [
      { id: 'gif', name: 'GIF导出', count: 670 },
      { id: 'svg', name: 'SVG序列', count: 440 },
      { id: 'json', name: '数据导出', count: 450 }
    ]
  }
];

export const faqItems: FAQItem[] = [
  {
    question: '什么是 AE 扩展脚本？',
    answer: 'AE扩展脚本是为Adobe After Effects开发的插件和工具，可以自动化复杂任务、添加新功能、提高工作效率。它们使用JavaScript或ExtendScript编写，可以访问AE的完整API。'
  },
  {
    question: '如何安装 AE 扩展脚本？',
    answer: '大多数扩展脚本可以通过以下方式安装：1) 使用ZXP Installer安装.zxp文件；2) 将.jsx或.jsxbin文件复制到AE的Scripts文件夹；3) 使用AE的Extensions菜单直接加载。详细安装指南请参考每个脚本的文档。'
  },
  {
    question: '这些脚本使用安全吗？',
    answer: '我们市场上的所有脚本都经过安全审核。建议从官方渠道下载，避免使用破解版本。开源脚本可以查看源代码，确保没有恶意代码。安装前请备份您的项目文件。'
  },
  {
    question: '我可以同时使用多个脚本吗？',
    answer: '是的，大多数脚本可以同时使用。但某些功能相似的脚本可能会冲突。建议在使用新脚本前，先在一个测试项目中验证兼容性。'
  },
  {
    question: '我可以创建并分享自己的脚本吗？',
    answer: '当然可以！我们鼓励社区贡献。您可以提交自己的脚本到市场，经过审核后就会上架。我们提供完整的开发者文档和API参考。'
  },
  {
    question: '脚本与表达式有何不同？',
    answer: '脚本是独立的程序文件，可以执行复杂的自动化任务和创建UI界面。表达式是嵌入在属性中的代码片段，用于动态计算属性值。脚本可以批量处理，表达式适合实时动画。'
  },
  {
    question: '脚本多久更新一次？',
    answer: '更新频率取决于开发者。热门脚本通常每月更新，修复bug并添加新功能。您可以关注脚本的GitHub仓库获取最新动态。'
  },
  {
    question: '本网站与 Adobe 有关联吗？',
    answer: '本网站是独立的第三方平台，与Adobe没有官方关联。我们是一个社区驱动的AE脚本市场，致力于为AE用户提供优质的扩展工具。'
  }
];

export const stats = {
  totalScripts: 58742,
  totalDownloads: 2345678,
  activeUsers: 45600,
  dailyGrowth: 128.5,
  peakDay: '2026年2月3日',
  peakCount: 3240
};

export const testimonials = [
  {
    quote: 'This marketplace has transformed my After Effects workflow. The scripts here are top quality.',
    author: 'Motion Design Weekly',
    role: 'Industry Publication'
  },
  {
    quote: 'We\'ve added extensions to our pipeline, making it possible to use the large and growing collection of community scripts.',
    author: 'Frame.io',
    role: 'Video Collaboration Platform'
  }
];
