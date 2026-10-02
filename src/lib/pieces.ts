import { getCollection, type CollectionEntry } from 'astro:content';

export type Piece = CollectionEntry<'pieces'>;
export type Platform = Piece['data']['platform'];
export type PieceType = Piece['data']['type'];
export type Style = Piece['data']['styles'][number];

const demoFiles = import.meta.glob('/src/demos/*.html', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export function demoSource(slug: string): string {
  return demoFiles[`/src/demos/${slug}.html`] ?? '';
}

export const PLATFORM_META: Record<Platform, { label: string; short: string; w: number; h: number; blurb: string; frame: 'web' | 'phone' | 'tablet' }> = {
  'web':        { label: 'Web',        short: 'Web',    w: 1280, h: 800, frame: 'web',    blurb: 'Desktop-first sites and web apps. Viewed in a browser at 1280 × 800.' },
  'mobile-web': { label: 'Mobile web', short: 'M·Web',  w: 390,  h: 844, frame: 'phone',  blurb: 'Responsive web pages on a phone, browser chrome and all. 390 × 844.' },
  'mobile-app': { label: 'Mobile app', short: 'App',    w: 390,  h: 844, frame: 'phone',  blurb: 'Native-feel app screens in iOS 26 or Material 3 Expressive languages. 390 × 844.' },
  'pwa':        { label: 'PWA',        short: 'PWA',    w: 390,  h: 844, frame: 'phone',  blurb: 'Installed web apps: standalone, cache-first shells, offline states. 390 × 844.' },
  'tablet':     { label: 'Tablet',     short: 'Tablet', w: 1180, h: 820, frame: 'tablet', blurb: 'Landscape tablet layouts: split views, palettes, spreads. 1180 × 820.' },
};

export const TYPE_META: Record<PieceType, { label: string; singular: string; blurb: string }> = {
  screen:    { label: 'Screens',    singular: 'Screen',    blurb: 'Whole pages and app screens, composed end to end.' },
  component: { label: 'Components', singular: 'Component', blurb: 'Sidebars, menus, tables, pickers, sheets. The parts you bolt on.' },
  animation: { label: 'Animations', singular: 'Animation', blurb: 'Loaders, transitions, reveals, morphs. Motion with a reason.' },
  layout:    { label: 'Layouts',    singular: 'Layout',    blurb: 'Grids, splits, shells, boards. How a page is carved up.' },
  pattern:   { label: 'Patterns',   singular: 'Pattern',   blurb: 'Empty states, validation, install prompts, checklists. Product behaviour done right.' },
  style:     { label: 'Styles',     singular: 'Style',     blurb: 'Whole design languages shown as a kit: type, colour, surfaces, controls.' },
};

export const STYLE_META: Record<Style, { label: string; blurb: string }> = {
  editorial:  { label: 'Editorial',   blurb: 'Serif headlines, generous measure, magazine rhythm.' },
  swiss:      { label: 'Swiss',       blurb: 'Grids you can see, grotesk type, one red.' },
  brutalist:  { label: 'Brutalist',   blurb: 'Raw structure, hard edges, no decoration.' },
  glass:      { label: 'Glass',       blurb: 'Translucent, blurred surfaces that float over content.' },
  material:   { label: 'Material',    blurb: 'Tonal surfaces, bold shapes, emphasized motion.' },
  minimal:    { label: 'Minimal',     blurb: 'Only what is needed, spaced deliberately.' },
  playful:    { label: 'Playful',     blurb: 'Bounce, colour, character. Still disciplined.' },
  retro:      { label: 'Retro',       blurb: 'Borrowed from another decade, executed cleanly.' },
  terminal:   { label: 'Terminal',    blurb: 'Monospace, character grids, the command line as UI.' },
  paper:      { label: 'Paper',       blurb: 'Warm off-whites, ink, texture, print references.' },
  luxe:       { label: 'Luxe',        blurb: 'High-contrast serifs, hairlines, restraint as luxury.' },
  dark:       { label: 'Dark',        blurb: 'Near-black surfaces with careful contrast.' },
  soft:       { label: 'Soft',        blurb: 'Rounded, low-contrast, tonal and gentle.' },
  industrial: { label: 'Industrial',  blurb: 'Utility-first, dense, engineered.' },
  kinetic:    { label: 'Kinetic',     blurb: 'Type and layout in motion.' },
};

export const MOTION_LABEL = { none: 'Static', subtle: 'Subtle motion', rich: 'Rich motion' } as const;
export const DIFFICULTY_LABEL = { 1: 'Quick build', 2: 'One session', 3: 'Multi-step' } as const;

let cache: Piece[] | null = null;

/** All pieces that have a demo, in catalogue order (oldest first, then title) with a stable index number. */
export async function getPieces(): Promise<Piece[]> {
  if (cache) return cache;
  const all = await getCollection('pieces');
  cache = all
    .filter((p) => demoSource(p.id))
    .sort((a, b) => a.data.published.getTime() - b.data.published.getTime() || a.data.title.localeCompare(b.data.title));
  return cache;
}

/** Newest first for listings. */
export async function getPiecesNewest(): Promise<Piece[]> {
  return [...(await getPieces())].reverse();
}

export async function pieceNumber(slug: string): Promise<string> {
  const list = await getPieces();
  const i = list.findIndex((p) => p.id === slug);
  return String(i + 1).padStart(3, '0');
}

export function numberMap(list: Piece[]): Map<string, string> {
  const m = new Map<string, string>();
  list.forEach((p, i) => m.set(p.id, String(i + 1).padStart(3, '0')));
  return m;
}

export function demoUrl(slug: string) { return `/demo/${slug}.html`; }
export function pieceUrl(slug: string) { return `/p/${slug}`; }
export function briefUrl(slug: string) { return `/p/${slug}.md`; }

export function bytes(n: number) { return n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`; }
