import { getCollection, type CollectionEntry } from 'astro:content';

export type Piece = CollectionEntry<'pieces'>;
export type Platform = Piece['data']['platform'];
export type PieceType = Piece['data']['type'];
export type Style = Piece['data']['styles'][number];
export type Category = Piece['data']['category'];

export const AUTHOR = {
  name: 'Susan Acharya',
  short: 'S. Acharya',
  role: 'Product lead, designer and builder',
  city: 'Kathmandu',
  site: 'https://acharyasusan.com.np',
  siteLabel: 'acharyasusan.com.np',
  email: 'iamsusanacharya@gmail.com',
  links: [
    { label: 'Portfolio', href: 'https://acharyasusan.com.np' },
    { label: 'Dribbble', href: 'https://dribbble.com/SusanAcharya' },
    { label: 'GitHub', href: 'https://github.com/SusanAcharya' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/AcharyaSusan' },
    { label: 'X', href: 'https://x.com/n00dlehead' },
  ],
} as const;

export const CREDIT_LINE = `Designed by ${AUTHOR.name} · Design Lounge · ${AUTHOR.siteLabel}`;

const demoFiles = import.meta.glob('/src/demos/*.html', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export function demoSource(slug: string): string {
  return demoFiles[`/src/demos/${slug}.html`] ?? '';
}

/** Demo source with the credit comment and author meta, as shown in the Source tab and copied. */
export function creditedSource(slug: string): string {
  const html = demoSource(slug);
  if (!html) return html;
  const note = `<!-- ${CREDIT_LINE}\n     Free to use in your own products. A credit link back is appreciated: ${AUTHOR.site} -->`;
  const withNote = html.replace(/^(<!--[^\n]*-->\n?)/, `$1${note}\n`);
  return withNote.replace(/<head>/i, `<head>\n<meta name="author" content="${AUTHOR.name}" />`);
}

/** What /demo/<slug>.html serves: credited source plus a signature that only shows when the demo is opened on its own. */
export function servedDemo(slug: string): string {
  const html = creditedSource(slug);
  const sig = `<script>(function(){try{if(window.top!==window.self)return;}catch(e){return;}var h=document.createElement('lounge-signature');h.style.cssText='position:fixed;right:14px;bottom:14px;z-index:2147483647';var r=h.attachShadow({mode:'closed'});r.innerHTML='<style>a{display:flex;align-items:center;gap:8px;height:30px;padding:0 12px 0 6px;border-radius:999px;background:rgba(18,17,15,.78);color:#f3efe6;font:500 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.06em;text-decoration:none;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 6px 20px -8px rgba(0,0,0,.5);opacity:.82;transition:opacity .16s}a:hover,a:focus-visible{opacity:1}i{display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:#e0a34b;color:#1b1300;font-style:normal;font-weight:700;font-size:9px;letter-spacing:0}span{white-space:nowrap}@media print{a{display:none}}</style><a href="${AUTHOR.site}" target="_blank" rel="noopener" title="${CREDIT_LINE}"><i>SA</i><span>${AUTHOR.name} \\u00b7 Design Lounge</span></a>';document.body.appendChild(h);})();</script>`;
  return html.includes('</body>') ? html.replace(/<\/body>(?![\s\S]*<\/body>)/i, `${sig}\n</body>`) : html + sig;
}

/** Brief markdown with attribution, as copied, downloaded and served at /p/<slug>.md. */
export function creditedBrief(piece: { id: string; body?: string; data: { title: string } }, n?: string): string {
  const head = `<!-- Design Lounge${n ? ` Nº ${n}` : ''} · "${piece.data.title}" · designed by ${AUTHOR.name} (${AUTHOR.site}) -->\n\n`;
  const foot = `\n\n---\n\n*From Design Lounge, the design library of ${AUTHOR.name} (${AUTHOR.site}). Live demo and source: /p/${piece.id}. Free to use in your products; a credit link is appreciated.*\n`;
  return head + (piece.body ?? '').trim() + foot;
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
  section:   { label: 'Sections',   singular: 'Section',   blurb: 'Heroes, footers, pricing, contact, testimonials. The blocks a website is assembled from.' },
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
  bauhaus:    { label: 'Bauhaus',     blurb: 'Primary colours, circles, squares, triangles. Form follows function.' },
  y2k:        { label: 'Y2K',         blurb: 'Chrome, bevels, bubble type and millennium optimism.' },
  cyber:      { label: 'Cyber',       blurb: 'HUD overlays, scanlines, signal colours on black.' },
  organic:    { label: 'Organic',     blurb: 'Earth tones, soft irregular shapes, botanical calm.' },
  riso:       { label: 'Risograph',   blurb: 'Two-ink overprints, grain, misregistration on purpose.' },
  deco:       { label: 'Art Deco',    blurb: 'Gold hairlines, symmetry, stepped geometry, 1920s glamour.' },
  pixel:      { label: 'Pixel',       blurb: 'Bitmap type, hard pixels, arcade palettes.' },
  clay:       { label: 'Clay',        blurb: 'Puffy, tactile surfaces with soft inner light.' },
};

/** Short names for the section rail and search. Same order as a site is built. */
export const SECTION_NAV: { id: Category; label: string }[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'navbar', label: 'Nav' },
  { id: 'features', label: 'Features' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'cta', label: 'CTA' },
  { id: 'logos', label: 'Logos' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'faq', label: 'FAQ' },
  { id: 'stats', label: 'Stats' },
  { id: 'team', label: 'Team' },
  { id: 'newsletter', label: 'Newsletter' },
  { id: 'blog', label: 'Blog' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'footer', label: 'Footer' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'landing', label: 'Landing' },
  { id: 'auth', label: 'Sign in' },
  { id: 'ecommerce', label: 'Shop' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'reading', label: 'Docs' },
  { id: 'error', label: '404' },
  { id: 'inputs', label: 'Fields' },
  { id: 'overlays', label: 'Overlays' },
  { id: 'cursor', label: 'Cursor' },
  { id: 'scroll', label: 'Scroll' },
];

export const CATEGORY_GROUPS: { key: string; label: string; items: Category[] }[] = [
  { key: 'sections', label: 'Website sections', items: ['hero', 'navbar', 'features', 'pricing', 'testimonials', 'faq', 'cta', 'contact', 'logos', 'stats', 'team', 'newsletter', 'blog', 'gallery', 'footer'] },
  { key: 'pages', label: 'Pages & screens', items: ['portfolio', 'landing', 'auth', 'ecommerce', 'dashboard', 'onboarding', 'settings', 'profile', 'messaging', 'media', 'reading', 'error', 'utility'] },
  { key: 'components', label: 'Components', items: ['navigation', 'buttons', 'inputs', 'cards', 'overlays', 'feedback', 'data', 'pickers', 'charts'] },
  { key: 'motion', label: 'Motion', items: ['text-motion', 'scroll', 'cursor', 'transitions', 'loaders', 'micro', 'backgrounds'] },
  { key: 'kits', label: 'Kits', items: ['design-language'] },
];

export const CATEGORY_META: Record<Category, { label: string; blurb: string }> = {
  hero: { label: 'Hero sections', blurb: 'The first 800 pixels. Headlines, entrances, the promise.' },
  navbar: { label: 'Nav bars & menus', blurb: 'Top bars, mega menus, full-screen mobile menus.' },
  footer: { label: 'Footers', blurb: 'Where the page signs off: sitemaps, wordmarks, last calls.' },
  features: { label: 'Feature sections', blurb: 'Grids, tabs, sticky steps. How a product explains itself.' },
  pricing: { label: 'Pricing', blurb: 'Plans, toggles, comparison tables, usage sliders.' },
  testimonials: { label: 'Testimonials', blurb: 'Quotes, walls of love, proof that people use it.' },
  faq: { label: 'FAQ', blurb: 'Accordions and answer pages people actually read.' },
  cta: { label: 'Calls to action', blurb: 'Banners and closers that ask once, clearly.' },
  contact: { label: 'Contact', blurb: 'Forms, booking, studio cards, the big email address.' },
  logos: { label: 'Logo clouds', blurb: 'Customer walls and marquees that stay quiet.' },
  stats: { label: 'Stats & numbers', blurb: 'Counters, bands and figures that roll into place.' },
  team: { label: 'Team', blurb: 'People grids, bios, hover reveals.' },
  newsletter: { label: 'Newsletter', blurb: 'Sign-ups with a reason to subscribe.' },
  blog: { label: 'Blog & editorial', blurb: 'Indexes, magazine grids, changelogs.' },
  gallery: { label: 'Galleries', blurb: 'Masonry, horizontal rails, lightboxes.' },
  portfolio: { label: 'Portfolio sites', blurb: 'Personal sites for designers, developers, photographers and studios.' },
  landing: { label: 'Landing pages', blurb: 'Full pages, top to bottom, for products and launches.' },
  auth: { label: 'Sign in & auth', blurb: 'Sign-in, magic links, passkeys, verification.' },
  ecommerce: { label: 'Commerce', blurb: 'Product pages, carts, checkout, filters.' },
  dashboard: { label: 'Dashboards', blurb: 'Overviews, KPIs, boards, home screens.' },
  onboarding: { label: 'Onboarding', blurb: 'First-run carousels, checklists, permission asks.' },
  settings: { label: 'Settings', blurb: 'Preferences and account pages done properly.' },
  profile: { label: 'Profiles', blurb: 'Accounts, cards, people.' },
  messaging: { label: 'Messaging & mail', blurb: 'Chat threads, inboxes, comments.' },
  media: { label: 'Media & players', blurb: 'Music, video, stories, podcasts.' },
  reading: { label: 'Reading & docs', blurb: 'Articles, readers, documentation.' },
  error: { label: 'Errors & 404s', blurb: 'The pages nobody plans for, planned.' },
  utility: { label: 'Tools & utilities', blurb: 'Editors, palettes, calculators, trackers.' },
  navigation: { label: 'Navigation', blurb: 'Sidebars, tabs, rails, palettes, breadcrumbs.' },
  buttons: { label: 'Buttons & toggles', blurb: 'Every way to press something.' },
  inputs: { label: 'Inputs & forms', blurb: 'Fields, validation, steppers, uploads.' },
  cards: { label: 'Cards', blurb: 'Tilting, flipping, stacking, expanding.' },
  overlays: { label: 'Overlays', blurb: 'Sheets, dialogs, popovers, context menus.' },
  feedback: { label: 'Feedback & status', blurb: 'Toasts, banners, empty states, alerts.' },
  data: { label: 'Data display', blurb: 'Tables, lists, timelines.' },
  pickers: { label: 'Pickers', blurb: 'Dates, colours, ranges, options.' },
  charts: { label: 'Charts', blurb: 'Lines, bars, donuts, heatmaps with real interaction.' },
  'text-motion': { label: 'Text animation', blurb: 'Reveals, scrambles, marquees, variable type.' },
  scroll: { label: 'Scroll effects', blurb: 'Scroll as the timeline: stacks, pins, reveals.' },
  cursor: { label: 'Cursor & hover', blurb: 'Things that answer the pointer.' },
  transitions: { label: 'Transitions', blurb: 'Page, view and shared-element moves.' },
  loaders: { label: 'Loaders & skeletons', blurb: 'Waiting, made honest.' },
  micro: { label: 'Micro-interactions', blurb: 'Likes, toggles, swipes. One small moment each.' },
  backgrounds: { label: 'Backgrounds', blurb: 'Generative grids, lines and textures behind content.' },
  'design-language': { label: 'Design languages', blurb: 'Complete visual dialects shown as a kit.' },
};

export const MOTION_LABEL = { none: 'Static', subtle: 'Subtle motion', rich: 'Rich motion' } as const;
export const DIFFICULTY_LABEL = { 1: 'Quick build', 2: 'One session', 3: 'Multi-step' } as const;

let cache: Piece[] | null = null;

/** All pieces that have a demo, in catalogue order (oldest first, then title) with a stable index number. */
export async function getPieces(): Promise<Piece[]> {
  if (cache?.length) return cache;
  const all = await getCollection('pieces');
  const next = all
    .filter((p) => demoSource(p.id))
    .sort((a, b) => a.data.published.getTime() - b.data.published.getTime() || a.data.title.localeCompare(b.data.title));
  if (next.length) cache = next;
  return next;
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
