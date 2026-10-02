import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const PLATFORMS = ['web', 'mobile-web', 'mobile-app', 'pwa', 'tablet'] as const;
export const TYPES = ['screen', 'section', 'component', 'animation', 'layout', 'pattern', 'style'] as const;
export const STYLES = [
  'editorial', 'swiss', 'brutalist', 'glass', 'material', 'minimal', 'playful', 'retro',
  'terminal', 'paper', 'luxe', 'dark', 'soft', 'industrial', 'kinetic',
  'bauhaus', 'y2k', 'cyber', 'organic', 'riso', 'deco', 'pixel', 'clay',
] as const;
export const CATEGORIES = [
  // page sections
  'hero', 'navbar', 'footer', 'features', 'pricing', 'testimonials', 'faq', 'cta', 'contact', 'logos', 'stats', 'team', 'newsletter', 'blog', 'gallery',
  // whole pages & screens
  'portfolio', 'landing', 'auth', 'ecommerce', 'dashboard', 'onboarding', 'settings', 'profile', 'messaging', 'media', 'reading', 'error', 'utility',
  // components
  'navigation', 'buttons', 'inputs', 'cards', 'overlays', 'feedback', 'data', 'pickers', 'charts',
  // motion
  'text-motion', 'scroll', 'cursor', 'transitions', 'loaders', 'micro', 'backgrounds',
  // kits
  'design-language',
] as const;

const pieces = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pieces' }),
  schema: z.object({
    title: z.string().max(48),
    summary: z.string().max(200),
    platform: z.enum(PLATFORMS),
    type: z.enum(TYPES),
    category: z.enum(CATEGORIES),
    tags: z.array(z.string()).min(1).max(8),
    styles: z.array(z.enum(STYLES)).min(1).max(3),
    motion: z.enum(['none', 'subtle', 'rich']),
    difficulty: z.number().int().min(1).max(3),
    featured: z.boolean().default(false),
    published: z.coerce.date(),
    palette: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/)).min(2).max(6),
    fonts: z.array(z.string()).min(1).max(4),
    related: z.array(z.string()).default([]),
    author: z.string().default('Susan Acharya'),
  }),
});

export const collections = { pieces };
