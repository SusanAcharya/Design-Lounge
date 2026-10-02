export interface Collection {
  slug: string;
  title: string;
  kicker: string;
  blurb: string;
  pieces: string[];
}

export const COLLECTIONS: Collection[] = [
  {
    slug: 'navigation-sorted',
    title: 'Navigation, sorted',
    kicker: 'Nº 01',
    blurb: 'Sidebars, rails, tab bars, drawers and palettes. Every way to get around a product, from a 64px icon rail to a floating glass capsule.',
    pieces: ['collapsing-sidebar-rail', 'command-palette', 'editorial-mega-menu', 'nested-dropdown-menu', 'ios-glass-tab-bar', 'm3-navigation-drawer', 'mobile-fullscreen-menu', 'tablet-sidebar-overlay-pin', 'tabs-morphing-underline', 'segmented-control-sliding'],
  },
  {
    slug: 'loading-states',
    title: 'Loading states that earn the wait',
    kicker: 'Nº 02',
    blurb: 'Skeletons that match their content, loaders with three elements, buttons that carry their own progress. Nothing spins for the sake of spinning.',
    pieces: ['skeleton-to-content-swap', 'orbit-dots-loader', 'ink-fill-progress', 'button-state-morph', 'pwa-app-shell', 'ios-pull-to-refresh', 'mobile-filter-chips-list'],
  },
  {
    slug: 'motion-with-a-reason',
    title: 'Motion with a reason',
    kicker: 'Nº 03',
    blurb: 'Transitions that explain where things went. Every duration and curve here is doing a job: continuity, hierarchy, or feedback.',
    pieces: ['shared-element-expand', 'm3-container-transform', 'page-transition-curtain', 'logo-draw-intro', 'ios-app-switcher-stack', 'ios-context-menu-lift', 'staggered-list-reveal', 'ios-large-title-collapse', 'm3-search-bar-morph', 'tabs-morphing-underline', 'segmented-control-sliding', 'lamp-theme-toggle', 'optimistic-like-button', 'card-flip-3d'],
  },
  {
    slug: 'typography-first',
    title: 'Typography does the work',
    kicker: 'Nº 04',
    blurb: 'Pieces where the type is the design: editorial heroes, kinetic marquees, reading pages with a proper measure, spreads that behave like print.',
    pieces: ['editorial-landing-hero', 'kinetic-type-marquee', 'text-scramble-reveal', 'paper-article-reader', 'magazine-editorial-grid', 'luxe-serif-style', 'tablet-two-column-reader', 'swiss-poster-style'],
  },
  {
    slug: 'sheets-and-overlays',
    title: 'Sheets, dialogs and things on top',
    kicker: 'Nº 05',
    blurb: 'Bottom sheets with detents, dialogs with real focus traps, toasts that stack, panels that anchor. Layering done with restraint.',
    pieces: ['ios-bottom-sheet-detents', 'modal-dialog-focus-trap', 'pwa-install-sheet', 'notification-center-panel', 'toast-stack', 'pwa-update-toast', 'm3-fab-menu'],
  },
  {
    slug: 'forms-people-finish',
    title: 'Forms people finish',
    kicker: 'Nº 06',
    blurb: 'Steppers, inline validation, one-page checkout, sign-in that respects the keyboard. The boring parts, made unboring by getting the details right.',
    pieces: ['multi-step-form-stepper', 'inline-form-validation', 'mobile-one-page-checkout', 'split-sign-in', 'date-range-picker', 'settings-page-sticky-nav', 'onboarding-checklist'],
  },
  {
    slug: 'native-feel',
    title: 'Native feel, web materials',
    kicker: 'Nº 07',
    blurb: 'iOS 26 glass, Material 3 Expressive shapes, and the PWA moments in between: install, offline, update.',
    pieces: ['ios-glass-tab-bar', 'ios-fintech-home', 'ios-swipe-row-actions', 'ios-now-playing', 'ios-grouped-settings', 'ios-onboarding-carousel', 'm3-expressive-home', 'm3-fab-menu', 'pwa-install-sheet', 'pwa-connectivity-banner', 'pwa-news-reader'],
  },
  {
    slug: 'design-languages',
    title: 'Whole design languages',
    kicker: 'Nº 08',
    blurb: 'Not a component, a dialect. Each of these is a complete visual grammar you can hand to an agent as the style guide for a product.',
    pieces: ['terminal-ui-style', 'swiss-poster-style', 'paper-ink-style', 'neo-brutalist-style', 'luxe-serif-style', 'brutalist-studio-home'],
  },
  {
    slug: 'dashboards-and-data',
    title: 'Dashboards and dense data',
    kicker: 'Nº 09',
    blurb: 'Tables you can live in, KPI rows, boards, bento grids and counters that roll. Density without noise.',
    pieces: ['analytics-dashboard-overview', 'dense-data-table', 'tablet-dashboard-grid', 'kanban-board', 'bento-feature-grid', 'odometer-counter', 'collapsing-sidebar-rail', 'tablet-split-view-mail'],
  },
  {
    slug: 'cursor-play',
    title: 'Cursor and hover play',
    kicker: 'Nº 11',
    blurb: 'Pieces that answer the pointer: magnetic buttons, image trails, letters that get heavier as you approach, cards that tilt and flip.',
    pieces: ['magnetic-buttons', 'hover-image-trail', 'variable-font-proximity', 'hover-tilt-cards', 'spotlight-hover-grid', 'card-flip-3d', 'kinetic-type-marquee'],
  },
  {
    slug: 'scroll-driven',
    title: 'Scroll as the timeline',
    kicker: 'Nº 12',
    blurb: 'Motion tied to scroll position, not the clock: stacking cards, clip reveals, sticky stories, collapsing titles, reading progress.',
    pieces: ['stacking-cards-scroll', 'scroll-clip-reveal', 'sticky-split-story', 'scroll-reading-progress', 'ios-large-title-collapse', 'accordion-grid-rows'],
  },
  {
    slug: 'first-impressions',
    title: 'First impressions',
    kicker: 'Nº 10',
    blurb: 'Landing pages, onboarding, empty states and the 404. The screens people meet before they trust you.',
    pieces: ['editorial-landing-hero', 'brutalist-studio-home', 'mobile-landing-sticky-cta', 'ios-onboarding-carousel', 'empty-state-line-illustration', 'terminal-404', 'luxe-product-detail', 'swiss-grid-pricing'],
  },
];
