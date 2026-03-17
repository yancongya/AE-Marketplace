import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface NavTranslations {
  home: string;
  expressions: string;
  scripts: string;
  presets: string;
  extensions: string;
}

interface HeroStatsTranslations {
  label: string;
  comment: string;
  suffix: string;
}

interface HeroDescriptionTranslations {
  line1: string;
  line2: string;
}

interface HeroTranslations {
  title: string;
  subtitle: string;
  stats: HeroStatsTranslations;
  description: HeroDescriptionTranslations;
  fileHeader: string;
  fileComment: string;
}

interface AboutLeftPanelTranslations {
  title: string;
  description: string;
  additional: string;
  readyToExplore: string;
}

interface AboutTabTranslations {
  title: string;
  icon: string;
  content: string;
}

interface AboutRightPanelTranslations {
  tabs: AboutTabTranslations[];
}

interface AboutTranslations {
  leftPanel: AboutLeftPanelTranslations;
  rightPanel: AboutRightPanelTranslations;
}

interface CommonTranslations {
  itemsCount: string;
  searchPlaceholder: string;
  loading: string;
  copyCode: string;
  copySuccess: string;
  copyFailed: string;
  back: string;
  author: string;
  updatedAt: string;
  tags: string;
  tableOfContents: string;
  fullScreen: string;
  zoomIn: string;
  zoomOut: string;
  reset: string;
  renderFailed: string;
  comment: string;
  pagination: string;
  oneClickRun: string;
  themeToggle: {
    light: string;
    dark: string;
  };
  fallback: {
    tagline: string;
    resources: string;
    docs: string;
    copyright: string;
  };
}

interface RadarTranslations {
  categories: {
    expressions: string;
    scripts: string;
    presets: string;
    extensions: string;
  };
}

interface FooterTranslations {
  tagline: string;
  resources: string;
  docs: string;
  online: string;
  version: string;
  copyright: string;
  resourcesList: {
    social: {
      bilibili: string;
      github: string;
      xiaohongshu: string;
      email: string;
    };
    docs: {
      aescripts: string;
      adobeDocs: string;
      motionscript: string;
      videoCopilot: string;
      extendscript: string;
    };
  };
}

interface Translations {
  nav: NavTranslations;
  hero: HeroTranslations;
  about: AboutTranslations;
  common: CommonTranslations;
  radar: RadarTranslations;
  footer: FooterTranslations;
  home: {
    recentDocs: string;
    recentDocsDesc: string;
  };
}

type Locale = 'zh' | 'en';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  translations: Translations | null;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('locale');
    if (saved === 'zh' || saved === 'en') {
      return saved;
    }
    return navigator.language.startsWith('zh') ? 'zh' : 'en';
  });
  const [translations, setTranslations] = useState<Translations | null>(null);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${locale}.json`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    };

    loadTranslations();
  }, [locale]);

  const t = (key: string): string => {
    if (!translations) return key;
    
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, translations }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}