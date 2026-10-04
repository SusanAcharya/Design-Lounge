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
  'mwdtinc.com': {
    id: 'mwdt',
    name: 'MWDT',
    line: 'A machine shop. A dark hero card, a steel part, and a button to ask for a quote.',
    take: 'Let the product break out of the box. One light line, one heavy line, one button.',
    studied: true,
    quiet: true,
    category: { hero: 5, cta: 4, features: 3, landing: 3 },
    style: { industrial: 6, dark: 4, swiss: 2, minimal: 2 },
    type: {},
  },
  'moremedia.at': {
    id: 'moremedia',
    name: 'Moremedia',
    line: 'An agency in Austria. Big tight type, real work, and services you open one at a time.',
    take: 'Set the services as tall labels. Open one, and keep the rest as type.',
    studied: true,
    quiet: true,
    category: { features: 5, logos: 5, hero: 3, landing: 3, portfolio: 3 },
    style: { swiss: 6, minimal: 4, editorial: 3, kinetic: 2 },
    type: {},
  },
  'usearticle.com': {
    id: 'usearticle',
    name: 'UseArticle',
    line: 'A tool that writes and posts articles on a schedule. The page shows the product running, not a picture of it.',
    take: 'Let the visitor press the controls and watch the card change. Thick black edges and hard shadows keep it friendly.',
    studied: true,
    quiet: true,
    category: { hero: 5, features: 6, landing: 4, cards: 3, buttons: 3, mockups: 3 },
    style: { brutalist: 5, playful: 4, soft: 3 },
    type: {},
  },
  'tailwindcss.com': {
    id: 'tailwind',
    name: 'Tailwind CSS docs',
    line: 'The install page for a CSS framework. Numbered steps, each with its own small code box.',
    take: 'Put each instruction next to its code. Draw the grid with thin lines and let the empty sides carry a faint hatch.',
    studied: true,
    quiet: true,
    category: { reading: 6, navigation: 4, footer: 3, utility: 2 },
    style: { minimal: 5, swiss: 4, terminal: 3, dark: 2 },
    type: {},
  },
  'bermawy.com': {
    id: 'bermawy',
    name: 'Bermawy',
    line: 'A personal site typed on graph paper. A torn photo, clipped cards, a notebook of articles. A toy console plays the talks.',
    take: 'Let one toy be the real control. Keep the rest plain and on paper.',
    studied: true,
    category: { portfolio: 6, media: 5, blog: 3, cards: 3, logos: 2, footer: 2 },
    style: { paper: 6, retro: 5, playful: 4, editorial: 2, minimal: 2 },
    type: {},
  },
  'hauntedbouldercity.com': {
    id: 'haunted',
    name: 'Haunted Boulder City',
    line: 'A ghost walking tour. Fog, night photos and huge narrow type. The story slides sideways as you scroll.',
    take: 'Pin the screen and let scroll turn the pages. Only the line you are on gets to shout.',
    studied: true,
    category: { scroll: 6, landing: 5, hero: 4, features: 4, faq: 2, cta: 2 },
    style: { dark: 6, kinetic: 4, editorial: 4, industrial: 2 },
    type: {},
  },
  'wickret.cuberto.com': {
    id: 'wickret',
    name: 'Wickret',
    line: 'A concept bank app page by a studio. One huge headline, toys floating around it, then a phone.',
    take: 'Let the big words move. Letters can break apart and come back as new words.',
    studied: true,
    category: { hero: 6, 'text-motion': 5, scroll: 4, landing: 4, features: 3, cursor: 2, buttons: 2 },
    style: { playful: 6, kinetic: 5, minimal: 3, soft: 2 },
    type: {},
  },
  'lamalama.com': {
    id: 'lamalama',
    name: 'Lama Lama',
    line: 'An Amsterdam agency. A dark page with a dot screen hero and a small bar that talks back.',
    take: 'A tiny nav bar can carry the voice. Change its one line for each section.',
    studied: true,
    category: { hero: 6, navbar: 6, portfolio: 4, backgrounds: 4, footer: 2, landing: 3 },
    style: { dark: 6, industrial: 4, kinetic: 4, swiss: 3, terminal: 2, editorial: 2 },
    type: {},
  },
  'gmxdigital.com': {
    id: 'gmx',
    name: 'GMX Digital',
    line: 'A film studio for buildings that are not built yet. Dark, slow, and it plays like a film.',
    take: 'Keep the headline still and let the scenes change behind it. A thin line counts down each one.',
    studied: true,
    category: { hero: 6, features: 4, landing: 4, scroll: 3, portfolio: 3, transitions: 2 },
    style: { dark: 6, luxe: 4, editorial: 3, minimal: 2, kinetic: 2 },
    type: {},
  },
  'sibaldesign.com': {
    id: 'sibal',
    name: 'Sibal Design',
    line: 'One designer, shown like a ship screen. You press Enter, it loads, then the work opens in frames.',
    take: 'Make the entrance a choice and keep it short. Then let each project show its steps, one at a time.',
    studied: true,
    category: { portfolio: 6, loaders: 5, hero: 4, navbar: 2, gallery: 2, transitions: 2 },
    style: { cyber: 6, dark: 5, terminal: 4, industrial: 2 },
    type: {},
  },
  'stripe.com': { id: 'stripe', name: 'Stripe', line: 'A payments company. One bright ribbon, a light headline, and the product shown working in every card.', take: 'Let one big moving thing carry the colour. Keep the words light and the cards real.', studied: true, quiet: true, category: { hero: 6, features: 5, landing: 5, logos: 3, stats: 2, cta: 2 }, style: { minimal: 5, editorial: 3, soft: 2, swiss: 2 }, type: {} },
  'linear.app': { id: 'linear', name: 'Linear', line: 'A tool for building software. A dark page where the real app is the picture.', take: 'Show the product doing the work. Fade it at the edges and keep one colour for what matters.', studied: true, quiet: true, category: { features: 6, hero: 5, landing: 5, testimonials: 2, footer: 2, logos: 2 }, style: { dark: 6, minimal: 5, industrial: 2, terminal: 1 }, type: {} },
  'mindmarket.com': { id: 'mindmarket', name: 'MindMarket', line: 'A research agency. Big friendly type on bright green, cartoon people, white cards along a winding path.', take: 'One path ties the page together. Cards sit beside it, and the numbers pile up as you scroll.', studied: true, quiet: true, category: { stats: 5, scroll: 5, hero: 4, landing: 4, cards: 3, footer: 2 }, style: { playful: 6, soft: 4, organic: 3, minimal: 2 }, type: {} },
  'f-list.cleancreatives.org': { id: 'flist', name: 'The F-List', line: 'A watchdog report on ad agencies. Black and yellow, tall narrow type, lines hidden under black bars.', take: 'Make the reveal the message. Bars lift off the text, and badges explain the list.', studied: true, category: { 'text-motion': 5, cards: 4, stats: 3, hero: 3, landing: 3, data: 2 }, style: { editorial: 5, brutalist: 4, dark: 4, industrial: 2 }, type: {} },
  'acharyasusan.com.np': { id: 'susan', name: 'Susan Acharya', line: "A product lead's portfolio. A night valley drawn by hand. Small people play in it while you read.", take: 'Draw one scene and let it move a little. The words stay calm on top.', studied: true, category: { hero: 6, footer: 5, portfolio: 5, 'text-motion': 4, scroll: 4, backgrounds: 3 }, style: { paper: 6, editorial: 5, dark: 4, playful: 3, organic: 2 }, type: {} },
  '60fps.design': { id: '60fps', name: '60fps', line: 'A big library of short clips. Small moments from phone apps, tagged by gesture, pattern and effect.', take: 'Show one small moment at a time, and let the tags do the sorting.', studied: true, category: { micro: 6, gallery: 5, feedback: 4, navigation: 3, data: 3, transitions: 3, loaders: 2, onboarding: 2 }, style: { minimal: 5, kinetic: 5, soft: 3, playful: 2, dark: 2 }, type: {} },
  'icon.museum': { id: 'icm', name: 'Icon Museum', line: 'A gallery of app icons. Each one sits on a glass shelf. Click one to see it big with its colours.', take: 'Let the icons be the only colour. Give each one a shelf, a lift on hover, and a quiet label.', studied: true, quiet: true, category: { gallery: 6, mockups: 3, utility: 2, cards: 2 }, style: { minimal: 5, soft: 4, glass: 3, editorial: 2 }, type: {} },
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
