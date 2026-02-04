export interface ContentItem {
  slug: string;
  title: string;
  iconEmoji?: string;
  author?: string;
  tags?: string[];
  category?: string;
  command: string;
  description: string;
  updatedAt?: string;
  content: string;
  date?: string;
}

export interface PresetItem {
  slug: string;
  title: string;
  iconEmoji?: string;
  count: number;
  nameEn?: string;
  author?: string;
  tags?: string[];
  category?: string;
  command: string;
  description: string;
  updatedAt?: string;
  content: string;
}

export interface ExtensionItem {
  slug: string;
  title: string;
  iconEmoji?: string;
  author?: string;
  tags?: string[];
  category?: string;
  command: string;
  description: string;
  updatedAt?: string;
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

async function loadMarkdownFiles(basePath: string): Promise<{ frontmatter: Record<string, any>; content: string; slug: string }[]> {
  const manifestUrl = `${basePath}/_manifest.json`;
  try {
    const response = await fetch(manifestUrl);
    if (!response.ok) return [];
    const files: string[] = await response.json();
    const results: { frontmatter: Record<string, any>; content: string; slug: string }[] = [];
    await Promise.all(
      files
        .filter((f: string) => f.endsWith('.md'))
        .map(async (filename: string) => {
          const slug = filename.replace('.md', '');
          const res = await fetch(`${basePath}/${filename}`);
          if (res.ok) {
            const text = await res.text();
            const { frontmatter, content } = parseFrontmatter(text);
            results.push({ frontmatter, content, slug });
          }
        })
    );
    return results;
  } catch {
    return [];
  }
}

async function loadFromFetch(): Promise<ContentData> {
  const [expressionsFiles, scriptsFiles, presetsFiles, extensionsFiles] = await Promise.all([
    loadMarkdownFiles('/content/expressions'),
    loadMarkdownFiles('/content/scripts'),
    loadMarkdownFiles('/content/presets'),
    loadMarkdownFiles('/content/extensions')
  ]);

  const data: ContentData = {
    expressions: [],
    scripts: [],
    presets: [],
    extensions: []
  };

  expressionsFiles.forEach(({ frontmatter, content, slug }) => {
    data.expressions.push({
      slug,
      title: frontmatter.title || slug,
      iconEmoji: frontmatter.iconEmoji,
      author: frontmatter.author,
      tags: frontmatter.tags,
      category: frontmatter.category,
      command: frontmatter.command || '',
      description: frontmatter.description || '',
      updatedAt: frontmatter.updatedAt,
      date: frontmatter.date,
      content: content.trim()
    });
  });

  scriptsFiles.forEach(({ frontmatter, content, slug }) => {
    data.scripts.push({
      slug,
      title: frontmatter.title || slug,
      iconEmoji: frontmatter.iconEmoji,
      author: frontmatter.author,
      tags: frontmatter.tags,
      category: frontmatter.category,
      command: frontmatter.command || '',
      description: frontmatter.description || '',
      updatedAt: frontmatter.updatedAt,
      date: frontmatter.date,
      content: content.trim()
    });
  });

  presetsFiles.forEach(({ frontmatter, content, slug }) => {
    data.presets.push({
      slug,
      title: frontmatter.title || slug,
      iconEmoji: frontmatter.iconEmoji,
      count: parseInt(frontmatter.count) || 0,
      nameEn: frontmatter.nameEn,
      author: frontmatter.author,
      tags: frontmatter.tags,
      category: frontmatter.category,
      command: frontmatter.command || '',
      description: frontmatter.description || '',
      updatedAt: frontmatter.updatedAt,
      content: content.trim()
    });
  });

  extensionsFiles.forEach(({ frontmatter, content, slug }) => {
    data.extensions.push({
      slug,
      title: frontmatter.title || slug,
      iconEmoji: frontmatter.iconEmoji,
      author: frontmatter.author,
      tags: frontmatter.tags,
      category: frontmatter.category,
      command: frontmatter.command || '',
      description: frontmatter.description || '',
      updatedAt: frontmatter.updatedAt,
      content: content.trim()
    });
  });

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
