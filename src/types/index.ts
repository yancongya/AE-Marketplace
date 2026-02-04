export interface AEScript {
  id: string;
  name: string;
  description: string;
  author: string;
  authorAvatar?: string;
  repository?: string;
  stars: number;
  forks?: number;
  downloads: number;
  version: string;
  updatedAt: string;
  category: string;
  tags: string[];
  compatibility: string[];
  code?: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  count: number;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  count: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}
