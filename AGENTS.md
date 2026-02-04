# AGENTS.md - AE脚本市场 Development Guide

This document provides guidelines for AI agents working on the AE Scripts Market codebase.

## Project Overview

A React + TypeScript + Vite application for an After Effects script marketplace. Uses Tailwind CSS for styling and Radix UI for accessible components.

## Build Commands

```bash
npm run dev          # Start development server with HMR
npm run build        # Type-check and build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint on all files
```

## Code Style Guidelines

### TypeScript

- Enable `strict: true` in all TypeScript configurations
- Use explicit types for function parameters and return values
- Prefer interfaces over types for object shapes, use types for unions/intersections
- Enable `noUnusedLocals: true` and `noUnusedParameters: true`
- Use the `erableSyntaxOnly: true` setting for cleaner TypeScript output
- Use absolute imports with `@/*` alias (configured in tsconfig.app.json and vite.config.ts)

```typescript
import { useState, useEffect } from 'react';
import { SomeType } from '@/types';

interface ComponentProps {
  title: string;
  onAction: () => void;
}

export function Component({ title, onAction }: ComponentProps) {
  return <div onClick={onAction}>{title}</div>;
}
```

### React Components

- Use function components with explicit props interfaces
- Use `.tsx` extension for all React components
- Use named exports for components: `export function ComponentName() {}`
- Define props interfaces in the same file or separate types file
- Use TypeScript for all component props, avoid propTypes

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children }: ButtonProps) {
  return <button className={cn('btn', variant)}>{children}</button>;
}
```

### Imports

- Use absolute imports with `@/` prefix for src directory imports
- Group imports in this order: React → external libraries → absolute imports → relative imports
- Use named imports for library exports

```typescript
import { useState } from 'react';
import { Code, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SomeComponent } from './SomeComponent';
```

### Tailwind CSS

- Use utility classes for all styling (Tailwind)
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Follow standard Tailwind class ordering: layout → spacing → sizing → typography → colors → effects → transitions
- Use `bg-`, `text-`, `border-`, `hover:` prefixes consistently
- Use `w-full`, `h-full`, `flex`, `grid` for layout utilities

```tsx
<div className="flex items-center justify-between p-4 bg-background text-foreground">
  <span className="text-sm font-medium text-muted-foreground">Label</span>
  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
    Action
  </button>
</div>
```

### Naming Conventions

- Components: PascalCase (`Navbar`, `ScriptDetail`)
- Hooks: camelCase with `use` prefix (`useMobile`, `useTheme`)
- Variables and functions: camelCase (`scriptList`, `handleSubmit`)
- Interfaces: PascalCase with optional `Props` suffix for component props (`AEScript`, `NavbarProps`)
- Constants: UPPER_SNAKE_CASE or camelCase for simple constants
- Files: kebab-case for non-component files (`mock-data.ts`, `utils.ts`)

### Error Handling

- Use try/catch for async operations with meaningful error messages
- Display errors to users via UI components (Toast/Sonner)
- Validate inputs with TypeScript types at compile time
- Use Zod for runtime validation if needed (already in dependencies)

```typescript
try {
  const data = await fetchData();
  return data;
} catch (error) {
  console.error('Failed to fetch data:', error);
  showToast('Failed to load data', 'error');
  return null;
}
```

### File Structure

```
src/
├── components/
│   ├── ui/           # Radix UI and shadcn-style components
│   ├── *.tsx         # Feature components
│   └── TabPanel.tsx  # Tab navigation components
├── hooks/
│   └── *.ts          # Custom React hooks
├── lib/
│   ├── utils.ts      # Utility functions (cn, format helpers)
│   └── content.ts    # Content/markdown processing
├── types/
│   └── index.ts      # TypeScript interfaces
├── data/
│   └── mockData.ts   # Mock data for development
├── App.tsx           # Main application component
├── main.tsx          # Entry point
└── index.css         # Global styles (Tailwind directives)
```

### Component Patterns

- Keep components focused and single-responsibility
- Extract reusable logic into custom hooks
- Use composition over inheritance
- Export components as named exports
- Define component types/interfaces before the component

### Accessibility

- Use Radix UI primitives for interactive components (Dialog, Dropdown, Tabs, etc.)
- Ensure keyboard navigation works on custom components
- Use semantic HTML elements (`<nav>`, `<main>`, `<article>`, etc.)
- Include appropriate ARIA attributes for custom components

### Git Workflow

- Commit messages should be descriptive and follow conventional commits
- Run `npm run lint` before committing
- No force pushes to main unless explicitly requested
- Create PRs for all changes using GitHub CLI or web interface

### Key Dependencies

- React 18 with TypeScript
- Vite 5 for build tooling
- Tailwind CSS 3 for styling
- Radix UI primitives for accessible components
- Lucide React for icons
- Zod for validation (when needed)
- React Hook Form with Zod resolver for forms
- Sonner for toast notifications
- Recharts for data visualization
