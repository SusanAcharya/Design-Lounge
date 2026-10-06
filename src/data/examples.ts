// Sites built by an agent with the Design Lounge skill installed.
// Builds live in public/built/<id>/ (copied from design-examples/<slug>/ by `pnpm examples`).
//
// mode 'one-shot': the agent got the prompt below, word for word, and chose everything itself.
// mode 'direction': the agent got the prompt plus one named direction from /start, then built in one pass.

export interface Example {
  /** URL id: /examples/<id>, build at /built/<id>/ */
  id: string;
  /** Folder in design-examples/ */
  slug: string;
  title: string;
  what: string;
  /** Shown large at the top of /examples, in array order */
  featured?: boolean;
  mode: 'one-shot' | 'direction';
  prompt: string;
  recipe: string;
  direction?: string;
  theme: string;
  pairing: string;
  family: string;
  effects: string[];
  phone?: boolean;
  /** Show mode, Free: colour and type chosen for this world instead of a library theme and pairing. */
  free?: { colours: string[]; fonts: string[]; why: string };
}

export const builtUrl = (e: Example) => `/built/${e.id}/index.html`;
export const exampleUrl = (e: Example) => `/examples/${e.id}`;

export const EXAMPLES: Example[] = [
  {
    id: 'meridian-no-7',
    slug: '08-luxury-product',
    title: 'Meridian No. 7',
    what: 'A watch you can turn by hand. Built in CSS 3D, and its hands read the clock on your device.',
    featured: true,
    mode: 'direction',
    prompt: 'A page for one mechanical watch, Meridian No. 7. Make it look expensive and let me turn it.',
    recipe: 'commerce',
    direction: 'noir-counter',
    theme: 'atelier-noir',
    pairing: 'gallery-wall',
    family: 'editorial',
    effects: ['object-3d-turntable', 'text-mask-line-reveal'],
  },
  {
    id: 'late-light',
    slug: '12-planetarium',
    title: 'Late Light',
    what: 'The late show at a planetarium. Shine a torch across the star chart, then scroll from the Moon out to the oldest light there is.',
    featured: true,
    mode: 'one-shot',
    prompt: "A site for a planetarium's late-night show. You scroll and you travel through space. Make it unforgettable.",
    recipe: 'event',
    direction: 'night-marquee',
    theme: 'neon-alley',
    pairing: 'neon-marquee',
    family: 'glass',
    effects: ['hero-flashlight-reveal', 'scroll-zoom-portal', 'event-ticket-checkout'],
  },
  {
    id: 'aadhi-raat',
    slug: '10-night-label',
    title: 'Aadhi Raat',
    what: 'A Kathmandu record label that only records after midnight. A live night sky, sleeves stamped with the minute the take began, and music synthesized in the corner player.',
    featured: true,
    mode: 'one-shot',
    prompt: 'Make a website for a record label that only releases music recorded after midnight in Kathmandu. Go wild, I want it to feel like an Awwwards site of the day.',
    recipe: 'music',
    direction: 'observatory',
    theme: 'observatory',
    pairing: 'cinema',
    family: 'editorial',
    effects: ['webgl-shader-hero', 'stacking-cards-scroll', 'sticky-split-story'],
  },
  {
    id: 'key-01',
    slug: '11-keyboard-launch',
    title: 'KEY-01',
    what: 'A keyboard launch you can play. Your real keys press their twins on the page, in the switch you pick, with sound made in the browser.',
    mode: 'one-shot',
    prompt: 'Build a launch page for a mechanical keyboard called KEY-01. I want people to be able to actually play with it on the page.',
    recipe: 'landing',
    direction: 'grid-launch',
    theme: 'ice-station',
    pairing: 'swiss-precision',
    family: 'sharp',
    effects: ['button-3d-press', 'features-sticky-scroll-steps', 'scroll-velocity-type'],
  },
  {
    id: 'volt-44',
    slug: '03-motion-studio',
    title: 'VOLT 44',
    what: 'A spin and HIIT studio. A counter preloader, type that leans with your scroll speed, prices that roll.',
    mode: 'direction',
    prompt: 'A site for a spin and HIIT studio called VOLT 44. Motion heavy: I want it to move.',
    recipe: 'gym',
    direction: 'volt-studio',
    theme: 'neon-alley',
    pairing: 'wide-tech',
    family: 'sharp',
    effects: ['preloader-counter-intro', 'scroll-velocity-type', 'pricing-annual-toggle-roll'],
  },
  {
    id: 'tracewire',
    slug: '06-devtool-webgl',
    title: 'Tracewire',
    what: 'An open-source tracing tool. A live shader behind the hero, a trace waterfall that points at the slow span.',
    mode: 'direction',
    prompt: 'A landing page for Tracewire, an open-source tracing CLI for backend developers. Dark, technical.',
    recipe: 'saas',
    direction: 'dev-night',
    theme: 'night-desk',
    pairing: 'developer-docs',
    family: 'sharp',
    effects: ['webgl-shader-hero', 'text-scramble-reveal'],
  },
  {
    id: 'thulo-dhunga',
    slug: '04-parallax-retreat',
    title: 'Thulo Dhunga',
    what: 'A silent retreat above Pokhara. Seven ridgelines at seven speeds, then a window you scroll through.',
    mode: 'direction',
    prompt: 'A site for a silent retreat in the hills above Pokhara. I want parallax.',
    recipe: 'wellness',
    direction: 'glacier',
    theme: 'glacier',
    pairing: 'academic',
    family: 'quiet',
    effects: ['parallax-layered-hero', 'scroll-zoom-portal'],
  },
  {
    id: 'loud-objects',
    slug: '02-creative-studio',
    title: 'Loud Objects',
    what: 'A brand and type studio. Uppercase, black on white, the work as loud printed studies.',
    mode: 'direction',
    prompt: 'A site for Loud Objects, a small brand and type studio. Opinionated, brutalist.',
    recipe: 'agency',
    direction: 'paper-brutal',
    theme: 'paper-ink',
    pairing: 'brutal-grotesk',
    family: 'sharp',
    effects: ['kinetic-type-marquee', 'text-mask-scroll-reveal'],
  },
  {
    id: 'pocketplan',
    slug: '05-animated-saas',
    title: 'Pocketplan',
    what: 'A weekly planner for small teams. The product window runs on the page, and the features stack as you scroll.',
    mode: 'direction',
    prompt: 'A landing page for Pocketplan, a weekly planner for small teams. Playful and animated.',
    recipe: 'saas',
    direction: 'butter-tool',
    theme: 'playroom',
    pairing: 'indie-maker',
    family: 'soft',
    effects: ['hero-product-window-tilt', 'stacking-cards-scroll', 'magnetic-buttons'],
  },
  {
    id: 'halden-chambers',
    slug: '01-professional',
    title: 'Halden Chambers',
    what: 'A commercial law firm. The hero is the first letter they send, and the manifesto lights up word by word.',
    mode: 'direction',
    prompt: 'A site for Halden Chambers, a small commercial and disputes law firm. Serious, trustworthy.',
    recipe: 'professional',
    direction: 'courtroom',
    theme: 'courtroom',
    pairing: 'maison',
    family: 'editorial',
    effects: ['scroll-word-highlight', 'text-mask-line-reveal'],
  },
  {
    id: 'bistro-oxblood',
    slug: '07-bistro',
    title: 'Bistro Oxblood',
    what: 'A 28-seat corner bistro. The printed menu is the page, and it knows if they are open right now.',
    mode: 'direction',
    prompt: 'A site for a 28-seat corner bistro. Phone first: the menu, the hours, a table.',
    recipe: 'restaurant',
    direction: 'bistro-riso',
    theme: 'velvet-club',
    pairing: 'riso-zine',
    family: 'editorial',
    effects: ['text-marker-highlight-draw'],
  },
  {
    id: 'harbour',
    slug: '09-mobile-bank-app',
    title: 'Harbour',
    what: 'Not a website. A phone banking app with tabs, cards, settings and a send flow, running in the browser.',
    mode: 'direction',
    prompt: 'A personal bank app called Harbour, in NPR. Balance first, cards, settings, send money.',
    recipe: 'bank',
    direction: 'harbour-bank',
    theme: 'harbour-ledger',
    pairing: 'friendly-saas',
    family: 'quiet',
    effects: ['ios-pull-to-refresh', 'shared-element-expand'],
    phone: true,
  },
  {
    id: 'late-light-a',
    slug: 'pair-late-light-a',
    title: 'Late Light',
    what: 'You start in your seat under red dome lamps and scroll out past the Moon, Saturn and the Pleiades to Andromeda. A readout says when the light you are seeing set off.',
    mode: 'one-shot',
    prompt: "A site for a planetarium's late-night show. You scroll and you travel through space. Make it unforgettable.",
    recipe: 'museum',
    direction: 'star-dome',
    theme: 'free',
    pairing: 'free',
    family: 'lit',
    effects: ['scroll-space-voyage', 'gallery-museum-placard', 'footer-giant-wordmark-reveal'],
    free: { colours: ['#07050b', '#f0e8e2', '#ff4b3e'], fonts: ['IM Fell English', 'Atkinson Hyperlegible Next'], why: 'The red of the lamps that keep your eyes used to the dark, and an inky letterpress serif for old light.' },
  },
  {
    id: 'aadhi-raat-a',
    slug: 'pair-aadhi-raat-a',
    title: 'Aadhi Raat Records',
    what: 'The Kathmandu valley drawn live under tonight\'s real moon, on Nepal time, with a countdown to midnight there and a drone you can play.',
    mode: 'one-shot',
    prompt: 'Make a website for a record label that only releases music recorded after midnight in Kathmandu. Go wild, I want it to feel like an Awwwards site of the day.',
    recipe: 'music',
    direction: 'after-midnight',
    theme: 'free',
    pairing: 'free',
    family: 'lit',
    effects: ['moonlit-ridge-hero', 'coverflow-strip', 'scroll-word-highlight', 'footer-newsletter-split'],
    free: { colours: ['#090c22', '#e9e5f4', '#ff5e2b'], fonts: ['Rozha One', 'Martian Mono'], why: 'The red recording lamp on blue-black, and one poster face that sets the name in Latin and Devanagari.' },
  },
  {
    id: 'aadhi-raat-b',
    slug: 'pair-aadhi-raat-b',
    title: 'Aadhi Raat Records',
    what: 'The same city at dawn. A marigold sleeve slides out its record, and a night ruler pins each take at the minute its tape rolled.',
    mode: 'one-shot',
    prompt: 'Make a website for a record label that only releases music recorded after midnight in Kathmandu. Go wild, I want it to feel like an Awwwards site of the day.',
    recipe: 'music',
    direction: 'first-bell',
    theme: 'temple-dawn',
    pairing: 'night-show',
    family: 'editorial',
    effects: ['hero-asymmetric-type-lockup', 'text-mask-line-reveal', 'stacking-cards-scroll', 'corner-player'],
  },
  {
    id: 'key-01-a',
    slug: 'pair-key-01-a',
    title: 'KEY-01',
    what: 'A lamp-lit keyboard on a felt mat. Type and the keys sink, click in the switch you pick, and count your own session.',
    mode: 'one-shot',
    prompt: 'Build a launch page for a mechanical keyboard called KEY-01. I want people to be able to actually play with it on the page.',
    recipe: 'landing',
    direction: 'playable',
    theme: 'free',
    pairing: 'free',
    family: 'lit',
    effects: ['playable-product-hero', 'stats-count-up-band', 'footer-giant-wordmark-reveal', 'button-3d-press'],
    free: { colours: ['#101716', '#f1eadf', '#ff6a3d'], fonts: ['Michroma', 'IBM Plex Sans'], why: 'One warm desk lamp on a felt mat at night, and the squared lettering of engraved keycap legends.' },
  },
  {
    id: 'key-01-b',
    slug: 'pair-key-01-b',
    title: 'KEY-01',
    what: 'The keyboard as a technical drawing on the page grid. Every key works, and the last six you press take over the giant name.',
    mode: 'one-shot',
    prompt: 'Build a launch page for a mechanical keyboard called KEY-01. I want people to be able to actually play with it on the page.',
    recipe: 'landing',
    direction: 'grid-launch',
    theme: 'ice-station',
    pairing: 'swiss-precision',
    family: 'sharp',
    effects: ['hero-swiss-grid-wordmark', 'stacking-cards-scroll', 'scroll-velocity-type', 'cta-giant-email-band'],
  },
];

/** Two builds of one product from the same prompt, each on its own direction. Shown on /examples/compare. */
export interface Pair {
  id: string;
  title: string;
  prompt: string;
  /** Example ids. Builds live in public/built/<id>/ like any example. */
  a: string;
  b: string;
  /** The model and date the builds were made with. */
  made: string;
}

export const PAIRS: Pair[] = [
  { id: 'late-light', title: 'Late Light', prompt: "A site for a planetarium's late-night show. You scroll and you travel through space. Make it unforgettable.", a: 'late-light-a', b: 'late-light', made: 'One shot each, by a coding agent with the skill, from the same prompt. Style A was built on 6 October 2026. Style B is the first Late Light, built on 4 October 2026 with an earlier version of the skill.' },
  { id: 'aadhi-raat', title: 'Aadhi Raat Records', prompt: 'Make a website for a record label that only releases music recorded after midnight in Kathmandu. Go wild, I want it to feel like an Awwwards site of the day.', a: 'aadhi-raat-a', b: 'aadhi-raat-b', made: 'One shot each, by a coding agent with the skill, 6 October 2026. The second build was told the product already had a site and to make a different look.' },
  { id: 'key-01', title: 'KEY-01', prompt: 'Build a launch page for a mechanical keyboard called KEY-01. I want people to be able to actually play with it on the page.', a: 'key-01-a', b: 'key-01-b', made: 'One shot each, by a coding agent with the skill, 6 October 2026. The second build was told the product already had a site and to make a different look.' },
];

/** Pair builds have their own page. The main list skips them. */
export const SOLO = EXAMPLES.filter((e) => !PAIRS.some((p) => p.a === e.id || p.b === e.id));
