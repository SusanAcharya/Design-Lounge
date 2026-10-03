// Notes for the sites listed in websites.txt. A new line in that file
// shows up on /sources even before it has a note here.

export type PieceLike = {
  id: string;
  data: { category: string; styles: readonly string[]; type: string };
};

export type Source = {
  id: string;
  url: string;
  host: string;
  name: string;
  line: string;
  take: string;
  studied: boolean;
  quiet: boolean;
};

type Note = {
  id: string;
  name: string;
  line: string;
  take: string;
  studied: boolean;
  quiet?: boolean;
  category: Record<string, number>;
  style: Record<string, number>;
  type: Record<string, number>;
};

const NOTES: Record<string, Note> = {
  'abelfragrance.com': {
    id: 'abel',
    name: 'Abel',
    line: 'A perfume shop. The range, the scent types, a quiz, a journal.',
    take: 'A catalogue. One product at a time.',
    studied: true,
    quiet: true,
    category: { ecommerce: 6, pricing: 4, newsletter: 3, gallery: 2, stats: 2 },
    style: { luxe: 4, soft: 2, organic: 3 },
    type: {},
  },
  'igloo.inc': {
    id: 'igloo',
    name: 'Igloo',
    line: 'An onchain community. The public HTML is a shell, so the lesson is the mission they publish, not a layout.',
    take: 'A product with one job. Do not invent a homepage they did not ship.',
    studied: true,
    category: { onboarding: 5, auth: 4, messaging: 3, landing: 1 },
    style: { cyber: 4, terminal: 2 },
    type: {},
  },
  'dontboardme.com': {
    id: 'dontboardme',
    name: "Don't Board Me",
    line: 'In-home pet care. A loud line, then the services, then book.',
    take: 'A service with a next step. The headline can shout. The booking stays plain.',
    studied: true,
    quiet: true,
    category: { contact: 6, cta: 5, features: 3, faq: 4, team: 3, pricing: 2 },
    style: { playful: 4, soft: 2, clay: 2 },
    type: {},
  },
  'noomoagency.com': {
    id: 'noomo',
    name: 'Noomo',
    line: 'A Los Angeles studio. 3D stories and sites that stop a scroll.',
    take: 'One scroll, one story. Motion carries the page.',
    studied: true,
    category: { scroll: 6, cursor: 5, portfolio: 4, hero: 3, transitions: 4, backgrounds: 3, loaders: 2, landing: 2 },
    style: { kinetic: 5, glass: 2, dark: 1 },
    type: { animation: 2 },
  },
  'synchronized.studio': {
    id: 'synchronized',
    name: 'Synchronized',
    line: 'A digital studio. The word archive repeats until the work is the page.',
    take: 'Lead with the work. Say the name until it holds.',
    studied: true,
    category: { portfolio: 5, gallery: 4, logos: 3, team: 2, hero: 2 },
    style: { swiss: 3, minimal: 3, bauhaus: 2 },
    type: {},
  },
  'mendo.nl': {
    id: 'mendo',
    name: 'Mendo',
    line: 'A bookshop in Amsterdam. Books as objects, and a journal beside the shop.',
    take: 'Paper, type, and the object. The shop stays quiet.',
    studied: true,
    quiet: true,
    category: { reading: 6, blog: 5, newsletter: 2 },
    style: { paper: 6, editorial: 6, deco: 2 },
    type: {},
  },
  'nixon.com': {
    id: 'nixon',
    name: 'Nixon',
    line: 'Watches. The page could not be read from here, so no screen claims it yet.',
    take: 'Open the site before a screen borrows from it.',
    studied: false,
    category: {},
    style: {},
    type: {},
  },
  'dragone.com': {
    id: 'dragone',
    name: 'Dragone',
    line: 'Live shows. A dark front, then the shows, the news, and a way to partner.',
    take: 'A show with a way in. Spectacle, then the ask.',
    studied: true,
    category: { media: 6, testimonials: 3, landing: 2, backgrounds: 2 },
    style: { dark: 4, luxe: 2, y2k: 2 },
    type: {},
  },
  'noth.in': {
    id: 'nothin',
    name: "Nothin'",
    line: 'A Paris studio. Ideas, not a pile of content. One line does the work.',
    take: 'A short sentence, large. The rest of the page waits.',
    studied: true,
    category: { 'text-motion': 6, hero: 2, cta: 2 },
    style: { brutalist: 4, editorial: 2, riso: 2 },
    type: {},
  },
};

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase();
  }
}

function idFromHost(host: string) {
  const first = host.split('.')[0] ?? host;
  return first.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'site';
}

export function sourcesFrom(raw: string): Source[] {
  const seen = new Set<string>();
  const out: Source[] = [];
  for (const line of raw.split('\n')) {
    const text = line.trim();
    if (!text || text.startsWith('#')) continue;
    const url = /^https?:\/\//i.test(text) ? text : `https://${text}`;
    const host = hostOf(url);
    if (!host || seen.has(host)) continue;
    seen.add(host);
    const note = NOTES[host];
    out.push({
      id: note?.id ?? idFromHost(host),
      url,
      host,
      name: note?.name ?? host,
      line: note?.line ?? 'Added. Open the site.',
      take: note?.take ?? 'Open the site before a screen borrows from it.',
      studied: note?.studied ?? false,
      quiet: note?.quiet ?? false,
    });
  }
  return out;
}

function hash(id: string) {
  let h = 0;
  for (const c of id) h = (h * 33 + c.charCodeAt(0)) >>> 0;
  return h;
}

function score(piece: PieceLike, host: string) {
  const note = NOTES[host];
  if (!note?.studied) return 0;
  const category = note.category[piece.data.category] ?? 0;
  if (!category) return 0;
  let n = category;
  for (const style of piece.data.styles ?? []) n += note.style[style] ?? 0;
  n += note.type[piece.data.type] ?? 0;
  return n;
}

export function studyPiece(piece: PieceLike, sources: Source[]) {
  const pool = sources.filter((s) => s.studied);
  let best = 0;
  for (const source of pool) best = Math.max(best, score(piece, source.host));
  const tied = best > 0 ? pool.filter((s) => score(piece, s.host) === best) : pool.filter((s) => s.quiet);
  const fallback = tied.length ? tied : pool;
  const source = fallback[hash(piece.id) % fallback.length];
  return { source, quiet: best === 0 };
}
