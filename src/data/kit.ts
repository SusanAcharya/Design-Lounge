/** Interactive kit: pick a product kind, then a researched palette, pairing, and component family. */

export type KitKind = 'website' | 'product' | 'platform' | 'personal';

export interface Kind {
  id: KitKind;
  title: string;
  kicker: string;
  blurb: string;
  when: string;
  palettes: string[];
  pairings: string[];
  families: string[];
  copy: { brand: string; nav: string[]; headline: string; deck: string; cta: string; phoneTitle: string };
  pieces: string[];
}

export interface Family {
  id: string;
  name: string;
  mood: string;
  radius: string;
  button: 'solid' | 'outline' | 'soft';
  density: 'air' | 'regular' | 'dense';
  shadow: string;
  pieces: string[];
  rules: string[];
}

export const KINDS: Kind[] = [
  {
    id: 'website',
    title: 'A public website',
    kicker: 'Website',
    blurb: 'Marketing, studio, or company site. Heroes, proof, a footer that signs off.',
    when: 'People arrive from the outside. The first viewport has to hold them.',
    palettes: ['paper-ink', 'linen-shop', 'atelier-noir', 'kiln', 'press-room', 'sakura-desk', 'marble-hall', 'loam', 'night-desk', 'neon-alley', 'festival', 'alpine-clinic'],
    pairings: ['the-lounge', 'gallery-wall', 'maison', 'newsroom', 'lettera', 'garden-journal', 'brutal-grotesk', 'y2k-chrome', 'poster-condensed', 'indie-maker', 'studio-display', 'neo-grotesk-mono'],
    families: ['editorial', 'quiet', 'soft', 'sharp'],
    copy: {
      brand: 'Northroom',
      nav: ['Work', 'Studio', 'Journal'],
      headline: 'Spaces people stay in.',
      deck: 'A studio in Kathmandu making sites, interiors and the objects between them.',
      cta: 'See the work',
      phoneTitle: 'Northroom',
    },
    pieces: ['hero-asymmetric-type-lockup', 'navbar-island-morph', 'testimonials-quote-carousel', 'footer-giant-wordmark-reveal', 'contact-giant-email-copy'],
  },
  {
    id: 'product',
    title: 'A product or service',
    kicker: 'Product',
    blurb: 'SaaS, a tool, a service with a price. Data when it earns the screen.',
    when: 'Someone is deciding whether to use you. Clarity over theatre.',
    palettes: ['fog-city', 'alpine-clinic', 'glacier', 'harbour-ledger', 'night-desk', 'ice-station', 'circuit', 'playroom', 'kiln', 'neon-alley', 'press-room'],
    pairings: ['friendly-saas', 'geometric-modern', 'swiss-precision', 'developer-docs', 'signal-mono', 'indie-maker', 'atelier', 'y2k-chrome', 'newsroom'],
    families: ['quiet', 'soft', 'sharp', 'glass'],
    copy: {
      brand: 'Tally',
      nav: ['Product', 'Pricing', 'Docs'],
      headline: 'Payroll in four minutes.',
      deck: '₹ 18,42,000 across 46 people, paid Friday. Tax filed. Nobody chased.',
      cta: 'Start a run',
      phoneTitle: 'This Friday',
    },
    pieces: ['landing-fintech-light', 'pricing-annual-toggle-roll', 'features-tabbed-preview', 'charts-kpi-spark-row', 'faq-two-column-search'],
  },
  {
    id: 'platform',
    title: 'A company platform',
    kicker: 'Platform',
    blurb: 'The thing staff live in: ops, admin, a dense home. Density without noise.',
    when: 'People open this every morning. Taste has to survive eight hours.',
    palettes: ['harbour-ledger', 'fog-city', 'signal-green', 'circuit', 'cinder', 'hud-teal', 'courtroom', 'night-desk'],
    pairings: ['developer-docs', 'swiss-precision', 'slab-ledger', 'red-hat', 'neo-grotesk-mono', 'academic'],
    families: ['sharp', 'quiet', 'industrial', 'glass'],
    copy: {
      brand: 'Ledger',
      nav: ['Home', 'Inbox', 'Reports'],
      headline: 'Bay 14 is clear.',
      deck: '2,400 kg tagged. Inspection stays with the driver. Next slot 06:40.',
      cta: 'Open run',
      phoneTitle: 'Today’s runs',
    },
    pieces: ['analytics-dashboard-overview', 'dense-data-table', 'collapsing-sidebar-rail', 'charts-kpi-spark-row', 'chart-bar-week', 'chart-line-range', 'chart-rank-spend', 'kpi-delta', 'budget-meter', 'kanban-board', 'audit-activity-log', 'upload-file-queue', 'account-menu-panel', 'record-detail-header', 'people-role-list', 'billing-plan-summary', 'list-empty-plain', 'load-failed-retry', 'saved-banner'],
  },
  {
    id: 'personal',
    title: 'A personal app',
    kicker: 'Personal',
    blurb: 'One person’s money, health, or home. Not a staff tool, and not a marketing site.',
    when: 'The person using it is the customer. The number on the screen is theirs.',
    palettes: ['lokta', 'harbour-ledger', 'alpine-clinic', 'kiln', 'loam', 'fog-city'],
    pairings: ['devanagari', 'friendly-saas', 'bookish', 'garden-journal'],
    families: ['quiet', 'soft', 'editorial'],
    copy: {
      brand: 'Asar',
      nav: ['Spend', 'Budgets', 'You'],
      headline: 'रु 44,211 बाँकी',
      deck: 'Bhatbhateni took the largest share. NEA is the line that is over.',
      cta: 'See where it went',
      phoneTitle: 'Asar',
    },
    pieces: ['spend-list', 'chart-rank-spend', 'budget-meter', 'saved-banner', 'phone-tab-plain', 'mobile-list-empty', 'mobile-load-failed'],
  },
];

export const FAMILIES: Family[] = [
  {
    id: 'quiet',
    name: 'Quiet',
    mood: 'Hairlines, 6px corners, one solid button. The safe default for products that have to last.',
    radius: '6px',
    button: 'solid',
    density: 'regular',
    shadow: '0 10px 24px -16px rgba(0,0,0,.18)',
    pieces: ['collapsing-sidebar-rail', 'tabs-morphing-underline', 'modal-dialog-focus-trap', 'inline-form-validation'],
    rules: [
      'Radius 6px on controls, 8px on cards. Never more.',
      'One solid primary. Secondary is outline, same height (40px web / 44px phone).',
      'Hairline borders at 1px. No drop shadows on tables.',
      'Focus ring 2px accent, 3px offset.',
    ],
  },
  {
    id: 'soft',
    name: 'Soft',
    mood: 'Tonal fills, 14px corners, pills. Friendly without becoming a toy.',
    radius: '14px',
    button: 'soft',
    density: 'air',
    shadow: '0 12px 28px -16px rgba(0,0,0,.16)',
    pieces: ['toggle-switch-set', 'ios-onboarding-carousel', 'pwa-install-sheet', 'cta-sticky-mobile-bar'],
    rules: [
      'Radius 14px on cards, 999px on chips and the primary button.',
      'Primary is a soft accent wash, not a hard fill, unless contrast needs it.',
      'Plenty of air: 24px gaps, 20px card pad.',
      'Phone targets 44px. No hairlines thinner than 1px.',
    ],
  },
  {
    id: 'sharp',
    name: 'Sharp',
    mood: 'Zero radius, visible grid, type that does the work. Swiss without the poster shout.',
    radius: '0px',
    button: 'outline',
    density: 'dense',
    shadow: 'none',
    pieces: ['hero-swiss-grid-wordmark', 'swiss-grid-pricing', 'dense-data-table', 'magazine-editorial-grid'],
    rules: [
      'Radius 0 everywhere. If you round a button you have left the family.',
      '1px ink rules. No shadows. Alignment is the decoration.',
      'Primary can be a solid ink block; hover inverts.',
      'Uppercase 11px labels, 0.12em tracking, on data and nav.',
    ],
  },
  {
    id: 'editorial',
    name: 'Editorial',
    mood: 'Paper, measure, a serif that holds a room. Buttons stay quiet so the type can speak.',
    radius: '2px',
    button: 'outline',
    density: 'air',
    shadow: 'none',
    pieces: ['editorial-landing-hero', 'paper-article-reader', 'hero-editorial-name-rotator', 'footer-centered-colophon'],
    rules: [
      'Measure 58–66ch on reading. Headlines can break the grid.',
      'Buttons are outlined, 40px, no fill until hover.',
      'Paper grain or warm off-white is allowed; stock photos are not.',
      'Italic is a voice, used once per viewport.',
    ],
  },
  {
    id: 'glass',
    name: 'Glass',
    mood: 'Translucent bars, 16px corners, things that float. Native feel on the web.',
    radius: '16px',
    button: 'soft',
    density: 'regular',
    shadow: '0 16px 40px -20px rgba(0,0,0,.28)',
    pieces: ['ios-glass-tab-bar', 'ios-weather-hourly-scrub', 'm3-expressive-home', 'ios-bottom-sheet-detents'],
    rules: [
      'Bars use backdrop-filter: blur(16px) at ~72% opacity. Always give a solid fallback.',
      'Radius 16px on sheets, 999px on tab pills.',
      'Phone chrome: 44px tab bar, home indicator clearance 10px.',
      'Do not glass a whole page. One floating layer is enough.',
    ],
  },
  {
    id: 'industrial',
    name: 'Industrial',
    mood: 'Utility first. Tight type, 2px corners, labels that read like a yard sheet.',
    radius: '2px',
    button: 'solid',
    density: 'dense',
    shadow: 'none',
    pieces: ['analytics-dashboard-overview', 'dense-data-table', 'kanban-board', 'tablet-dashboard-grid'],
    rules: [
      'Radius 2px. Dense padding (12px). Tables are first-class.',
      'Primary is a committed fill (accent or ink). 36px on web, 44px on phone.',
      'Mono for numbers. Tabular nums. No ornament.',
      'Status colour is reserved for live state, never decoration.',
    ],
  },
];

export function kindById(id: string) {
  return KINDS.find((k) => k.id === id);
}
export function familyById(id: string) {
  return FAMILIES.find((f) => f.id === id);
}

export function kitBrief(input: {
  kind: Kind;
  theme: { name: string; mood: string; bestFor: string[]; css: string };
  pairing: { name: string; mood: string; display: string; text: string; css: string };
  family: Family;
  author: { name: string; site: string };
  credit: string;
}): string {
  const { kind, theme, pairing, family, author, credit } = input;
  const pieces = [...new Set([...kind.pieces, ...family.pieces])];
  return `<!-- Design Lounge kit · designlounge.vercel.app -->

# Design Lounge kit — ${kind.title}

You are building from a locked system. Do not invent a palette, a pairing, or a component language. Match the numbers.

## Product
**${kind.title}.** ${kind.when}
${kind.blurb}

## Palette — ${theme.name}
${theme.mood}
Best for: ${theme.bestFor.join(', ')}.

\`\`\`css
${theme.css}
\`\`\`

## Type — ${pairing.name}
${pairing.mood}
Display: ${pairing.display}. Text: ${pairing.text}.

\`\`\`css
${pairing.css}
\`\`\`

## Components — ${family.name}
${family.mood}
Radius: ${family.radius}. Buttons: ${family.button}. Density: ${family.density}.

${family.rules.map((r) => `- ${r}`).join('\n')}

## Open these pieces first
${pieces.map((id) => `- /p/${id}  (brief: /p/${id}.md)`).join('\n')}

## Motion
Use Lounge standard \`cubic-bezier(0.2, 0.7, 0.2, 1)\`. UI 200ms, layout 320ms, sheets 400ms. Honour \`prefers-reduced-motion\`. Icons: Lounge Icons, 24px stroke 1.75.

## Credit
${credit}
Free to use in products. Do not republish the catalogue as a catalogue.
`;
}
