import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const PLATFORMS = ['web', 'mobile-web', 'mobile-app', 'pwa', 'tablet'] as const;
export const TYPES = ['screen', 'component', 'animation', 'layout', 'pattern', 'style'] as const;
export const STYLES = [
  'editorial', 'swiss', 'brutalist', 'glass', 'material', 'minimal', 'playful', 'retro',
  'terminal', 'paper', 'luxe', 'dark', 'soft', 'industrial', 'kinetic',
] as const;

const pieces = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pieces' }),
  schema: z.object({
    title: z.string().max(48),
    summary: z.string().max(200),
    platform: z.enum(PLATFORMS),
    type: z.enum(TYPES),
    tags: z.array(z.string()).min(1).max(8),
    styles: z.array(z.enum(STYLES)).min(1).max(3),
    motion: z.enum(['none', 'subtle', 'rich']),
    difficulty: z.number().int().min(1).max(3),
    featured: z.boolean().default(false),
    published: z.coerce.date(),
    palette: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/)).min(2).max(6),
    fonts: z.array(z.string()).min(1).max(4),
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { pieces };
