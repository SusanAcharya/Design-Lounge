/** Product-start recipes. Shared by /start, home, agents, llms.txt, and the future skill. */
export interface Start {
  id: string;
  title: string;
  kicker: string;
  blurb: string;
  when: string;
  theme: string;
  pairing: string;
  shelf: string;
  categories: string[];
  pieces: string[];
}

export const STARTS: Start[] = [
  {
    id: 'marketing-site',
    title: 'A marketing site',
    kicker: 'Website',
    blurb: 'Hero, nav, proof, pricing, FAQ, contact, footer. Assemble a public site from pieces that already agree.',
    when: 'A company, studio or product needs a public website with a point of view — not a template.',
    theme: 'paper-ink',
    pairing: 'the-lounge',
    shelf: 'website-in-parts',
    categories: ['hero', 'navbar', 'features', 'pricing', 'testimonials', 'faq', 'contact', 'footer'],
    pieces: ['hero-asymmetric-type-lockup', 'navbar-island-morph', 'features-tabbed-preview', 'testimonials-quote-carousel', 'pricing-annual-toggle-roll', 'faq-two-column-search', 'contact-giant-email-copy', 'footer-giant-wordmark-reveal'],
  },
  {
    id: 'portfolio',
    title: 'A portfolio',
    kicker: 'Personal',
    blurb: 'Index, case study, a horizontal rail, a masthead. Steal a structure, keep your personality.',
    when: 'A designer, photographer, architect or studio needs a site that shows the work.',
    theme: 'atelier-noir',
    pairing: 'gallery-wall',
    shelf: 'portfolio-sites',
    categories: ['portfolio', 'profile', 'gallery', 'hero'],
    pieces: ['portfolio-architect-index', 'portfolio-index-hover-preview', 'portfolio-photographer-horizontal', 'portfolio-case-study-long', 'portfolio-motion-showreel', 'profile-creator-masthead'],
  },
  {
    id: 'landing',
    title: 'A landing page',
    kicker: 'Launch',
    blurb: 'One argument, one sitting. Fashion, wellness, fintech, a tool, an agency — each a complete first page.',
    when: 'A launch, a waitlist, or a single product that has to land in one viewport.',
    theme: 'atelier-noir',
    pairing: 'maison',
    shelf: 'landing-pages',
    categories: ['landing', 'hero', 'cta'],
    pieces: ['landing-fashion-atelier', 'landing-wellness-retreat', 'landing-fintech-light', 'landing-devtool-dark', 'landing-agency-case-wall', 'editorial-landing-hero'],
  },
  {
    id: 'mobile-app',
    title: 'A mobile app',
    kicker: 'App',
    blurb: 'iOS 26 glass and Material 3 Expressive, plus the PWA moments in between. Native feel, web materials.',
    when: 'A phone product that should feel shipped, not like a website squeezed into 390px.',
    theme: 'alpine-clinic',
    pairing: 'geometric-modern',
    shelf: 'native-feel',
    categories: ['navigation', 'overlays', 'media', 'onboarding', 'settings'],
    pieces: ['ios-weather-hourly-scrub', 'ios-glass-tab-bar', 'm3-expressive-home', 'm3-music-player-expressive', 'ios-onboarding-carousel', 'pwa-install-sheet'],
  },
  {
    id: 'design-system',
    title: 'A design system',
    kicker: 'System',
    blurb: 'Start with a language kit, then lock type, colour, icons and motion before drawing a single screen.',
    when: 'A new product needs a grammar — tokens and taste — before components.',
    theme: 'paper-ink',
    pairing: 'the-lounge',
    shelf: 'design-languages',
    categories: ['design-language'],
    pieces: ['paper-ink-style', 'luxe-serif-style', 'terminal-ui-style', 'clay-soft-style', 'y2k-chrome-style', 'bauhaus-style'],
  },
  {
    id: 'dashboard',
    title: 'A dashboard',
    kicker: 'Product',
    blurb: 'Dense tables, KPI sparks, a collapsing rail, a board. Density without noise.',
    when: 'An internal tool, analytics home, or ops screen people will live in all day.',
    theme: 'harbour-ledger',
    pairing: 'developer-docs',
    shelf: 'dashboards-and-data',
    categories: ['dashboard', 'data', 'charts', 'navigation'],
    pieces: ['analytics-dashboard-overview', 'dense-data-table', 'charts-kpi-spark-row', 'collapsing-sidebar-rail', 'tablet-dashboard-grid', 'kanban-board'],
  },
  {
    id: 'commerce',
    title: 'A shop',
    kicker: 'Commerce',
    blurb: 'Product page, checkout, filters, a luxe detail. Commerce that does not shout.',
    when: 'A product, a fragrance, a kit — something people buy without a carnival.',
    theme: 'kiln',
    pairing: 'atelier',
    shelf: 'first-impressions',
    categories: ['ecommerce', 'pricing', 'cta'],
    pieces: ['luxe-product-detail', 'mobile-one-page-checkout', 'mobile-filter-chips-list', 'cta-sticky-mobile-bar', 'pricing-annual-toggle-roll'],
  },
  {
    id: 'editorial',
    title: 'An editorial product',
    kicker: 'Reading',
    blurb: 'Type does the work: magazine grids, kinetic headlines, a reader with a proper measure.',
    when: 'A magazine, a journal, a long-read product where the type is the design.',
    theme: 'press-room',
    pairing: 'newsroom',
    shelf: 'typography-first',
    categories: ['blog', 'reading', 'hero', 'text-motion'],
    pieces: ['editorial-landing-hero', 'paper-article-reader', 'magazine-editorial-grid', 'kinetic-type-marquee', 'text-scramble-reveal', 'hero-editorial-name-rotator'],
  },
];

export const MAP = [
  { href: '/kit', kicker: 'Kit', title: 'Compose', blurb: 'Pick a kind, a palette, a pairing, a family. Get a brief.' },
  { href: '/system', kicker: 'System', title: 'Ingredients', blurb: 'Type, themes, icons, motion. Pick these first.' },
  { href: '/c', kicker: 'Index', title: 'By name', blurb: 'Hero, footer, portfolio, loader — what a designer would call it.' },
  { href: '/collections', kicker: 'Shelves', title: 'By problem', blurb: 'Curated reading lists: navigation, first impressions, languages.' },
] as const;
