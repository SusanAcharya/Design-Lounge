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
    when: 'A designer, photographer, architect, or studio needs a site that shows the work, including a scroll, a hover preview, or a cursor.',
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
    when: 'A launch, a waitlist, or one product page, including a tilt, a sticky scroll, or a hover on the product.',
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
    when: 'A phone product that should feel shipped, not like a website squeezed into 390px. Motion on a phone is a native piece, not a cursor.',
    theme: 'alpine-clinic',
    pairing: 'geometric-modern',
    shelf: 'native-feel',
    categories: ['navigation', 'overlays', 'media', 'onboarding', 'settings'],
    pieces: ['ios-weather-hourly-scrub', 'ios-glass-tab-bar', 'mobile-inbox-list', 'mobile-run-detail', 'mobile-list-empty', 'mobile-load-failed', 'm3-expressive-home', 'ios-onboarding-carousel', 'pwa-install-sheet'],
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
    blurb: 'Dense tables, one metric, a collapsing rail, a board. A finance palette with a dashboard face, not a docs face.',
    when: 'An internal tool, analytics home, or ops screen people will live in all day.',
    theme: 'harbour-ledger',
    pairing: 'swiss-precision',
    shelf: 'dashboards-and-data',
    categories: ['dashboard', 'data', 'charts', 'navigation'],
    pieces: ['analytics-dashboard-overview', 'dense-data-table', 'charts-kpi-spark-row', 'chart-bar-week', 'chart-line-range', 'chart-rank-spend', 'kpi-delta', 'collapsing-sidebar-rail', 'audit-activity-log', 'upload-file-queue', 'account-menu-panel', 'record-detail-header', 'people-role-list', 'billing-plan-summary', 'list-empty-plain', 'load-failed-retry', 'saved-banner', 'kanban-board'],
  },
  {
    id: 'commerce',
    title: 'A shop',
    kicker: 'Commerce',
    blurb: 'Collection, one product, the bag, then checkout. The name is the largest type. The total is the largest type on the bag.',
    when: 'A product, a bowl, a kit — something people buy without a carnival.',
    theme: 'kiln',
    pairing: 'atelier',
    shelf: 'first-impressions',
    categories: ['ecommerce', 'pricing', 'cta'],
    pieces: ['shop-collection', 'shop-product', 'shop-cart', 'qty-stepper', 'mobile-one-page-checkout', 'order-confirmed', 'luxe-product-detail', 'select-field'],
  },
  {
    id: 'tablet',
    title: 'A tablet',
    kicker: 'Tablet',
    blurb: 'Landscape. A split, a sidebar, a reader, a tool palette, an ops grid. Not a phone layout pulled wide.',
    when: 'Someone holds the product in two hands. The frame is 1180 wide, and a phone list does not belong there.',
    theme: 'press-room',
    pairing: 'newsroom',
    shelf: 'navigation-sorted',
    categories: ['reading', 'messaging', 'navigation', 'dashboard'],
    pieces: ['tablet-two-column-reader', 'tablet-split-view-mail', 'tablet-sidebar-overlay-pin', 'tablet-floating-tool-palette', 'tablet-dashboard-grid'],
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
    pieces: ['editorial-landing-hero', 'paper-article-reader', 'magazine-editorial-grid', 'blog-issue-index', 'kinetic-type-marquee', 'text-scramble-reveal', 'hero-editorial-name-rotator'],
  },
  {
    id: 'personal',
    title: 'A personal app',
    kicker: 'Personal',
    blurb: 'One person and their number. Lokta and Devanagari when the product is Nepali. Not a staff dashboard.',
    when: 'Money, health, or home for the person using it. A Nepali finance app starts here.',
    theme: 'lokta',
    pairing: 'devanagari',
    shelf: 'dashboards-and-data',
    categories: ['dashboard', 'charts', 'feedback', 'navigation'],
    pieces: ['spend-list', 'chart-rank-spend', 'budget-meter', 'saved-banner', 'phone-tab-plain', 'mobile-list-empty', 'mobile-load-failed'],
  },
];

export const MAP = [
  { href: '/kit', kicker: 'Kit', title: 'Compose', blurb: 'Pick a kind, a palette, a pairing, a family. Get a brief.' },
  { href: '/system', kicker: 'System', title: 'Ingredients', blurb: 'Type, themes, icons, motion. Pick these first.' },
  { href: '/c', kicker: 'Index', title: 'By name', blurb: 'Hero, footer, portfolio, loader — what a designer would call it.' },
  { href: '/collections', kicker: 'Shelves', title: 'By problem', blurb: 'Curated reading lists: navigation, first impressions, languages.' },
] as const;
