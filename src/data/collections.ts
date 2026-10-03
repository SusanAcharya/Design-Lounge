export interface Collection {
  slug: string;
  title: string;
  kicker: string;
  blurb: string;
  pieces: string[];
}

export const SHELF_GROUPS: { id: string; label: string; blurb: string; slugs: string[] }[] = [
  {
    id: 'site',
    label: 'Build a site',
    blurb: 'The pages a visitor meets first, then the blocks you assemble them from.',
    slugs: ['first-impressions', 'website-in-parts', 'portfolio-sites', 'landing-pages', 'proof-and-close'],
  },
  {
    id: 'product',
    label: 'Ship a product',
    blurb: 'Navigation, waiting, forms, native feel, and the screens people live in.',
    slugs: ['navigation-sorted', 'loading-states', 'sheets-and-overlays', 'forms-people-finish', 'control-set', 'native-feel', 'dashboards-and-data'],
  },
  {
    id: 'craft',
    label: 'Taste and craft',
    blurb: 'Motion, type, whole design languages, and the pointer as a material.',
    slugs: ['motion-with-a-reason', 'typography-first', 'design-languages', 'cursor-play', 'scroll-driven'],
  },
];

export const COLLECTIONS: Collection[] = [
  {
    slug: 'first-impressions',
    title: 'First impressions',
    kicker: 'Nº 01',
    blurb: 'Landing pages, onboarding, empty states and the 404. The screens people meet before they trust you.',
    pieces: ['editorial-landing-hero', 'brutalist-studio-home', 'mobile-landing-sticky-cta', 'ios-onboarding-carousel', 'empty-state-line-illustration', 'terminal-404', 'luxe-product-detail', 'shop-collection', 'shop-product', 'shop-cart', 'qty-stepper', 'order-confirmed', 'swiss-grid-pricing', 'landing-fashion-atelier', 'landing-wellness-retreat'],
  },
  {
    slug: 'website-in-parts',
    title: 'A website, in parts',
    kicker: 'Nº 02',
    blurb: 'Heroes, navs, features, pricing, proof, contact and the sign-off. Assemble a marketing site from pieces that already agree with each other.',
    pieces: ['hero-asymmetric-type-lockup', 'hero-swiss-grid-wordmark', 'hero-editorial-name-rotator', 'navbar-island-morph', 'features-tabbed-preview', 'bento-feature-grid', 'integrations-connect', 'link-orbit', 'gooey-nav', 'changelog-timeline', 'careers-role-list', 'testimonials-quote-carousel', 'logos-mono-marquee', 'pricing-annual-toggle-roll', 'faq-two-column-search', 'contact-giant-email-copy', 'footer-giant-wordmark-reveal', 'cta-split-dark-band', 'card-product-quick-add', 'card-article-mix', 'card-holo-foil', 'hero-split-ui-stack', 'hero-search-marketplace', 'features-alternating-rows', 'faq-category-accordion', 'footer-sitemap-columns'],
  },
  {
    slug: 'portfolio-sites',
    title: 'Sites that show the work',
    kicker: 'Nº 03',
    blurb: 'Personal and studio portfolios: the index, the case study, the photographer’s rail, the architect’s list. Steal a structure, not a personality.',
    pieces: ['portfolio-architect-index', 'portfolio-index-hover-preview', 'portfolio-photographer-horizontal', 'portfolio-case-study-long', 'portfolio-motion-showreel', 'gallery-contact-sheet', 'brutalist-studio-home', 'profile-creator-masthead'],
  },
  {
    slug: 'landing-pages',
    title: 'Landing pages with a point of view',
    kicker: 'Nº 04',
    blurb: 'Full first pages for fashion, wellness, fintech, a dev tool and an agency. Each one is a complete argument, not a template.',
    pieces: ['landing-fashion-atelier', 'landing-wellness-retreat', 'landing-fintech-light', 'landing-devtool-dark', 'landing-agency-case-wall', 'editorial-landing-hero', 'mobile-landing-sticky-cta'],
  },
  {
    slug: 'proof-and-close',
    title: 'Proof, and the close',
    kicker: 'Nº 05',
    blurb: 'Testimonials, logos, FAQs, stats and the last ask. The blocks that turn a visitor into a customer without raising their voice.',
    pieces: ['testimonials-quote-carousel', 'testimonials-wall-grid', 'logos-mono-marquee', 'faq-two-column-search', 'stats-ticker-band', 'cta-split-dark-band', 'cta-sticky-mobile-bar', 'newsletter-fold-inline', 'newsletter-close-band', 'team-hover-portrait-grid', 'testimonials-masonry-wall', 'testimonials-metric-tabs', 'logos-grid-case-hover', 'stats-count-up-band', 'cta-giant-email-band', 'pricing-usage-slider', 'contact-project-brief-steps'],
  },
  {
    slug: 'navigation-sorted',
    title: 'Navigation, sorted',
    kicker: 'Nº 06',
    blurb: 'Sidebars, rails, tab bars, drawers and palettes. Every way to get around a product, from a 64px icon rail to a floating glass capsule.',
    pieces: ['collapsing-sidebar-rail', 'command-palette', 'search-results-filters', 'breadcrumb', 'tree-nav', 'editorial-mega-menu', 'nested-dropdown-menu', 'ios-glass-tab-bar', 'm3-navigation-drawer', 'mobile-fullscreen-menu', 'tablet-sidebar-overlay-pin', 'tabs-morphing-underline', 'segmented-control-sliding', 'navbar-split-centered-logo', 'navbar-hide-on-scroll', 'navbar-vertical-rail', 'mega-menu-product-grid', 'sidebar-workspace-switcher', 'sidebar-docs-toc', 'hamburger-circle-reveal', 'hamburger-drawer-accordion', 'mobile-web-bottom-nav'],
  },
  {
    slug: 'loading-states',
    title: 'Loading states that earn the wait',
    kicker: 'Nº 07',
    blurb: 'Skeletons that match their content, loaders with three elements, buttons that carry their own progress. Nothing spins for the sake of spinning.',
    pieces: ['skeleton-to-content-swap', 'orbit-dots-loader', 'ink-fill-progress', 'button-state-morph', 'pwa-app-shell', 'ios-pull-to-refresh', 'load-failed-retry', 'mobile-load-failed', 'mobile-filter-chips-list', 'error-404-editorial'],
  },
  {
    slug: 'sheets-and-overlays',
    title: 'Sheets, dialogs and things on top',
    kicker: 'Nº 08',
    blurb: 'Bottom sheets with detents, dialogs with real focus traps, toasts that stack, panels that anchor. Layering done with restraint.',
    pieces: ['ios-bottom-sheet-detents', 'modal-dialog-focus-trap', 'tooltip', 'popover-panel', 'inline-alert', 'account-menu-panel', 'pwa-install-sheet', 'notification-center-panel', 'toast-stack', 'pwa-update-toast', 'm3-fab-menu'],
  },
  {
    slug: 'forms-people-finish',
    title: 'Forms people finish',
    kicker: 'Nº 09',
    blurb: 'Steppers, inline validation, one-page checkout, sign-in that respects the keyboard. The boring parts, made unboring by getting the details right.',
    pieces: ['multi-step-form-stepper', 'inline-form-validation', 'text-field', 'textarea-field', 'password-field', 'select-field', 'combobox', 'token-field', 'otp-code', 'rating-score', 'radio-group', 'checkbox-group', 'switch-row', 'slider-field', 'calendar-month', 'time-field', 'upload-file-queue', 'prompt-composer', 'mobile-one-page-checkout', 'split-sign-in', 'date-range-picker', 'settings-page-sticky-nav', 'billing-plan-summary', 'onboarding-checklist'],
  },
  {
    slug: 'control-set',
    title: 'The control set',
    kicker: 'Nº 17',
    blurb: 'The field, the button, the badge, the alert, the path, and the pages of a list. One control language, before any screen invents a second.',
    pieces: ['text-field', 'textarea-field', 'password-field', 'radio-group', 'checkbox-group', 'slider-field', 'select-field', 'combobox', 'token-field', 'otp-code', 'rating-score', 'calendar-month', 'time-field', 'switch-row', 'button-roles', 'breadcrumb', 'tree-nav', 'pagination', 'filter-toolbar', 'qty-stepper', 'progress-bar', 'property-list', 'content-card', 'status-badge', 'inline-alert', 'tooltip', 'popover-panel', 'consent-bar', 'chat-thread', 'order-confirmed', 'split-button', 'drag-to-confirm', 'dial-knob', 'undo-toast', 'code-snippet-tabs', 'selection-bar', 'shortcut-sheet', 'inline-edit', 'minute-wheel', 'stretch-switch', 'edge-light-button', 'shred-button', 'receipt-slip', 'focus-dim', 'analog-stick', 'chip-bucket', 'press-well', 'curve-drawer'],
  },
  {
    slug: 'native-feel',
    title: 'Native feel, web materials',
    kicker: 'Nº 10',
    blurb: 'iOS 26 glass, Material 3 Expressive shapes, and the PWA moments in between: install, offline, update.',
    pieces: ['ios-glass-tab-bar', 'phone-tab-plain', 'spend-list', 'mobile-inbox-list', 'chat-thread', 'mobile-run-detail', 'mobile-list-empty', 'mobile-load-failed', 'ios-fintech-home', 'ios-swipe-row-actions', 'ios-now-playing', 'ios-grouped-settings', 'ios-onboarding-carousel', 'm3-expressive-home', 'm3-fab-menu', 'pwa-install-sheet', 'pwa-connectivity-banner', 'pwa-news-reader', 'm3-navigation-bar', 'phone-splash-launch', 'phone-sign-in', 'phone-sign-up-steps', 'phone-paywall-plans', 'phone-profile-header', 'phone-comments-sheet', 'phone-product-detail', 'phone-notifications-list', 'phone-form-fields', 'phone-permission-prompt', 'phone-photo-picker', 'pwa-offline-library', 'pwa-outbox-sync', 'phone-search-results', 'phone-map-listings', 'phone-feed-posts', 'phone-wallet-cards', 'phone-video-player', 'phone-booking-slots', 'phone-order-tracking', 'phone-ride-request', 'phone-qr-scanner', 'phone-calendar-agenda', 'phone-workout-timer', 'phone-lesson-quiz'],
  },
  {
    slug: 'dashboards-and-data',
    title: 'Dashboards and dense data',
    kicker: 'Nº 11',
    blurb: 'Tables you can live in, KPI rows, boards, bento grids and counters that roll. Density without noise.',
    pieces: ['analytics-dashboard-overview', 'dense-data-table', 'audit-activity-log', 'record-detail-header', 'people-role-list', 'pagination', 'filter-toolbar', 'status-badge', 'chart-bar-week', 'chart-line-range', 'chart-rank-spend', 'budget-meter', 'spend-list', 'kpi-delta', 'saved-banner', 'list-empty-plain', 'tablet-dashboard-grid', 'kanban-board', 'bento-feature-grid', 'odometer-counter', 'funnel-chart', 'week-schedule', 'agent-step-trace', 'node-graph', 'cited-answer', 'collapsing-sidebar-rail', 'tablet-split-view-mail', 'ai-chat-workspace', 'settings-team-members', 'file-upload-manager', 'calendar-week-planner', 'onboarding-workspace-setup', 'tablet-pos-register', 'tablet-notes-three-pane', 'tablet-cook-mode', 'tablet-kiosk-checkin'],
  },
  {
    slug: 'motion-with-a-reason',
    title: 'Motion with a reason',
    kicker: 'Nº 12',
    blurb: 'Transitions that explain where things went. Every duration and curve here is doing a job: continuity, hierarchy, or feedback.',
    pieces: ['shared-element-expand', 'm3-container-transform', 'page-transition-curtain', 'logo-draw-intro', 'ios-app-switcher-stack', 'ios-context-menu-lift', 'staggered-list-reveal', 'ios-large-title-collapse', 'm3-search-bar-morph', 'tabs-morphing-underline', 'segmented-control-sliding', 'lamp-theme-toggle', 'optimistic-like-button', 'card-flip-3d', 'gooey-menu', 'folder-reveal', 'split-flap-board', 'book-page-flip', 'coverflow-strip', 'lens-bento', 'polaroid-fan', 'pan-canvas', 'scan-page', 'glitch-text', 'greeting-loader', 'corner-player', 'scroll-velocity-type', 'grow-grid', 'overlap-slider', 'scroll-split', 'trail-type', 'letter-sleeve', 'spring-deck', 'page-transition-tile-wipe', 'preloader-counter-intro', 'webgl-shader-hero', 'object-3d-turntable', 'hero-video-loop'],
  },
  {
    slug: 'typography-first',
    title: 'Typography does the work',
    kicker: 'Nº 13',
    blurb: 'Pieces where the type is the design: editorial heroes, kinetic marquees, reading pages with a proper measure, spreads that behave like print.',
    pieces: ['editorial-landing-hero', 'kinetic-type-marquee', 'text-scramble-reveal', 'paper-article-reader', 'book-page-flip', 'scroll-velocity-type', 'greeting-loader', 'trail-type', 'magazine-editorial-grid', 'blog-issue-index', 'luxe-serif-style', 'tablet-two-column-reader', 'swiss-poster-style'],
  },
  {
    slug: 'design-languages',
    title: 'Whole design languages',
    kicker: 'Nº 14',
    blurb: 'Not a component, a dialect. Each of these is a complete visual grammar you can hand to an agent as the style guide for a product.',
    pieces: ['terminal-ui-style', 'swiss-poster-style', 'paper-ink-style', 'neo-brutalist-style', 'luxe-serif-style', 'bauhaus-style', 'y2k-chrome-style', 'cyber-hud-style', 'organic-garden-style', 'riso-print-style', 'deco-hotel-style', 'pixel-arcade-style', 'clay-soft-style'],
  },
  {
    slug: 'cursor-play',
    title: 'Cursor and hover play',
    kicker: 'Nº 15',
    blurb: 'Pieces that answer the pointer: magnetic buttons, image trails, letters that get heavier as you approach, cards that tilt and flip.',
    pieces: ['magnetic-buttons', 'hover-image-trail', 'variable-font-proximity', 'hover-tilt-cards', 'spotlight-hover-grid', 'card-flip-3d', 'kinetic-type-marquee', 'cursor-ink-blob'],
  },
  {
    slug: 'scroll-driven',
    title: 'Scroll as the timeline',
    kicker: 'Nº 16',
    blurb: 'Motion tied to scroll position, not the clock: stacking cards, clip reveals, sticky stories, collapsing titles, reading progress.',
    pieces: ['stacking-cards-scroll', 'features-sticky-scroll-steps', 'sticky-split-story', 'scroll-reading-progress', 'ios-large-title-collapse', 'accordion-grid-rows', 'parallax-layered-hero', 'scroll-scrub-product-sequence', 'scroll-zoom-portal', 'smooth-scroll-inertia', 'scroll-word-highlight', 'text-mask-scroll-reveal', 'mobile-scroll-story'],
  },
];
