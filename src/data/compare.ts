// The homepage and /benchmark comparison. Facts come from each product's own pages or repository, checked on
// CHECKED; a fact that could not be confirmed there is left out rather than guessed. Each row says what the
// other product does better too, because a comparison that only flatters is not one.

export const CHECKED = '2026-11-03';

export type Mark = 'yes' | 'no' | 'part';

export interface Rival {
  name: string;
  href: string;
  kind: string;
  price: string;
  marks: { pieces: Mark; direction: Mark; review: Mark; search: Mark; mcp: Mark; skill: Mark };
  better: string;
}

export const ROWS: { key: keyof Rival['marks']; label: string }[] = [
  { key: 'pieces', label: 'Live, working designs with a build brief' },
  { key: 'direction', label: 'A whole direction: palette, type pairing, page recipe' },
  { key: 'review', label: 'Reviews the page your agent built' },
  { key: 'search', label: 'SEO, AEO and GEO checks' },
  { key: 'mcp', label: 'MCP server' },
  { key: 'skill', label: 'Agent skill' },
];

export const LOUNGE: Rival = {
  name: 'Design Lounge',
  href: '/',
  kind: 'Design library, direction and review',
  price: 'Free',
  marks: { pieces: 'yes', direction: 'yes', review: 'yes', search: 'yes', mcp: 'yes', skill: 'yes' },
  better: '',
};

export const RIVALS: Rival[] = [
  {
    name: 'Mobbin',
    href: 'https://mobbin.com/pricing',
    kind: 'Screenshots of real apps and sites',
    price: 'MCP on Pro, from $10 a month',
    marks: { pieces: 'no', direction: 'no', review: 'no', search: 'no', mcp: 'yes', skill: 'yes' },
    better: '600,000+ screens and whole flows from shipped products. Far bigger and more real than any invented library.',
  },
  {
    name: '21st.dev',
    href: 'https://21st.dev/mcp',
    kind: 'React component marketplace and generator',
    price: 'Code retrieval from $6 a month',
    marks: { pieces: 'part', direction: 'no', review: 'part', search: 'no', mcp: 'yes', skill: 'no' },
    better: '12,000+ drop-in React components and on-demand generation, when you want code to paste rather than a direction.',
  },
  {
    name: 'shadcn/ui',
    href: 'https://ui.shadcn.com/docs/mcp',
    kind: 'Open component system and registry',
    price: 'Free',
    marks: { pieces: 'part', direction: 'no', review: 'no', search: 'no', mcp: 'yes', skill: 'yes' },
    better: 'Real, accessible components installed into your codebase. The Lounge sits happily on top of it.',
  },
  {
    name: 'Impeccable',
    href: 'https://impeccable.style',
    kind: 'Design commands and a slop detector',
    price: 'Free',
    marks: { pieces: 'no', direction: 'part', review: 'yes', search: 'no', mcp: 'no', skill: 'yes' },
    better: 'A deeper review: 62 checks that run without a model, wired into hooks, CI and a browser extension.',
  },
  {
    name: 'taste-skill',
    href: 'https://github.com/Leonxlnx/taste-skill',
    kind: 'Anti-slop skill with art directions',
    price: 'Free',
    marks: { pieces: 'no', direction: 'yes', review: 'yes', search: 'no', mcp: 'no', skill: 'yes' },
    better: 'Twenty art directions dealt three at a time, openly licensed photos, and a browser slop check at three widths.',
  },
  {
    name: 'UI UX Pro Max',
    href: 'https://github.com/nextlevelbuilder/ui-ux-pro-max-skill',
    kind: 'Palettes, pairings and UX rules',
    price: 'Free',
    marks: { pieces: 'no', direction: 'yes', review: 'no', search: 'no', mcp: 'no', skill: 'yes' },
    better: 'More palettes (192) and font pairings (74), matched to product types.',
  },
  {
    name: 'Anthropic frontend-design',
    href: 'https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md',
    kind: 'One page of written guidance',
    price: 'Free',
    marks: { pieces: 'no', direction: 'part', review: 'no', search: 'no', mcp: 'no', skill: 'yes' },
    better: 'No setup and a tiny context cost. Often already there in Claude.',
  },
];
