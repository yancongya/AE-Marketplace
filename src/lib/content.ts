export interface ContentItem {
  slug: string;
  title: string;
  iconEmoji?: string;
  author?: string;
  stars?: number;
  downloads?: number;
  tags?: string[];
  category?: string;
  command: string;
  description: string;
  updatedAt?: string;
  content: string;
}

export interface PresetItem {
  slug: string;
  title: string;
  iconEmoji?: string;
  count: number;
  nameEn?: string;
  command: string;
  description: string;
  content: string;
}

export interface ExtensionItem {
  slug: string;
  title: string;
  iconEmoji?: string;
  command: string;
  description: string;
  content: string;
}

function parseFrontmatter(text: string): { frontmatter: Record<string, any>; content: string } {
  const lines = text.split(/\r?\n/);
  
  let openingDelim = -1;
  let closingDelim = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === '---') {
      if (openingDelim === -1) {
        openingDelim = i;
      } else if (closingDelim === -1) {
        closingDelim = i;
        break;
      }
    }
  }

  if (openingDelim === -1 || closingDelim === -1) {
    return { frontmatter: {}, content: text };
  }

  const frontmatterStr = lines.slice(openingDelim + 1, closingDelim).join('\n');
  const content = lines.slice(closingDelim + 1).join('\n');

  const frontmatter: Record<string, any> = {};
  frontmatterStr.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      if (key && value) {
        if (value.startsWith('[') && value.endsWith(']')) {
          frontmatter[key] = value.slice(1, -1).split(',').map((v: string) => v.trim().replace(/['"]/g, ''));
        } else if (value.startsWith('"') && value.endsWith('"')) {
          frontmatter[key] = value.slice(1, -1);
        } else {
          frontmatter[key] = value;
        }
      }
    }
  });

  return { frontmatter, content };
}

interface ContentData {
  expressions: ContentItem[];
  scripts: ContentItem[];
  presets: PresetItem[];
  extensions: ExtensionItem[];
}

let cachedContent: ContentData | null = null;
let loadingPromise: Promise<ContentData> | null = null;

async function loadFromFetch(): Promise<ContentData> {
  const [expressions, scripts, presets, extensions] = await Promise.all([
    fetch('/content/expressions/auto-keyframe.md').then(r => r.ok ? r.text() : ''),
    fetch('/content/scripts/shape-morpher.md').then(r => r.ok ? r.text() : ''),
    fetch('/content/presets/animation.md').then(r => r.ok ? r.text() : ''),
    fetch('/content/extensions/what-is-scripts.md').then(r => r.ok ? r.text() : '')
  ]);

  const data: ContentData = {
    expressions: [],
    scripts: [],
    presets: [],
    extensions: []
  };

  if (expressions) {
    const { frontmatter, content } = parseFrontmatter(expressions);
    data.expressions.push({
      slug: 'auto-keyframe',
      title: frontmatter.title || 'auto-keyframe',
      iconEmoji: frontmatter.iconEmoji,
      author: frontmatter.author,
      stars: parseInt(frontmatter.stars) || undefined,
      downloads: parseInt(frontmatter.downloads) || undefined,
      tags: frontmatter.tags,
      category: frontmatter.category,
      command: frontmatter.command || '',
      description: frontmatter.description || '',
      updatedAt: frontmatter.updatedAt,
      content: content.trim()
    });
  }

  if (scripts) {
    const { frontmatter, content } = parseFrontmatter(scripts);
    data.scripts.push({
      slug: 'shape-morpher',
      title: frontmatter.title || 'shape-morpher',
      iconEmoji: frontmatter.iconEmoji,
      author: frontmatter.author,
      stars: parseInt(frontmatter.stars) || undefined,
      downloads: parseInt(frontmatter.downloads) || undefined,
      tags: frontmatter.tags,
      category: frontmatter.category,
      command: frontmatter.command || '',
      description: frontmatter.description || '',
      updatedAt: frontmatter.updatedAt,
      content: content.trim()
    });
  }

  if (presets) {
    const { frontmatter, content } = parseFrontmatter(presets);
    data.presets.push({
      slug: 'animation',
      title: frontmatter.title || 'animation',
      iconEmoji: frontmatter.iconEmoji,
      count: parseInt(frontmatter.count) || 0,
      nameEn: frontmatter.nameEn,
      command: frontmatter.command || '',
      description: frontmatter.description || '',
      content: content.trim()
    });
  }

  if (extensions) {
    const { frontmatter, content } = parseFrontmatter(extensions);
    data.extensions.push({
      slug: 'what-is-scripts',
      title: frontmatter.title || 'what-is-scripts',
      iconEmoji: frontmatter.iconEmoji,
      command: frontmatter.command || '',
      description: frontmatter.description || '',
      content: content.trim()
    });
  }

  return data;
}

export async function loadContent(): Promise<ContentData> {
  if (cachedContent) return cachedContent;
  if (loadingPromise) return loadingPromise;
  
  loadingPromise = loadFromFetch().then(data => {
    cachedContent = data;
    return data;
  });
  
  return loadingPromise;
}

export function getExpressions(): ContentItem[] {
  return cachedContent?.expressions || [];
}

export function getScripts(): ContentItem[] {
  return cachedContent?.scripts || [];
}

export function getPresets(): PresetItem[] {
  return cachedContent?.presets || [];
}

export function getExtensions(): ExtensionItem[] {
  return cachedContent?.extensions || [];
}
