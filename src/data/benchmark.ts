// /benchmark and the homepage proof band: what the Design Lounge MCP costs in tokens and what it changes.
// Every number here was measured, never estimated by hand. REVIEWS are review_page on each finished build;
// CALLS are the hosted endpoint's response sizes, in characters, measured on the date below.

export const BENCH_META = {
  date: '2026-11-03',
  model: 'Claude Opus 5.5 (claude-opus-5-5)',
  harness: 'Claude Code subagents, one fresh session per run, plain index.html + styles.css + main.js',
  without: 'No Design Lounge skill or MCP tools and no other design skill; the repository was not read; built in an empty folder.',
  with: 'The Design Lounge MCP tools as an outside user gets them: start_design first, then recipe, theme, pairing and pieces, and review_page before finishing.',
};

export interface Call { tool: string; what: string; chars: number }

/** One response per tool from https://www.designlounge.live/api/mcp, text only (get_piece also attaches a picture). */
export const CALLS: Call[] = [
  { tool: 'tools/list', what: 'The tool list your agent loads once', chars: 15678 },
  { tool: 'start_design', what: 'Reads the request, returns the plan, the rules and the next calls', chars: 13021 },
  { tool: 'get_recipe', what: 'One product kind with its directions and pieces to open first', chars: 3414 },
  { tool: 'get_theme', what: 'One palette as CSS tokens, light and dark', chars: 1902 },
  { tool: 'get_pairing', what: 'Display, text and mono fonts with sizes', chars: 1225 },
  { tool: 'get_piece', what: 'The build brief for one piece', chars: 9097 },
  { tool: 'search_pieces', what: 'Ranked pieces for a few words', chars: 6784 },
  { tool: 'get_icons', what: 'Three icons as SVG paths', chars: 1716 },
  { tool: 'review_page', what: 'The hosted review of a public page', chars: 3112 },
];

/** Rough tokens for a response: characters divided by four, rounded to the nearest hundred. */
export const tokensOf = (chars: number) => Math.max(100, Math.round(chars / 4 / 100) * 100);

/** A typical direction: plan, recipe, theme, pairing, three piece briefs and one review. */
export const TYPICAL = ['start_design', 'get_recipe', 'get_theme', 'get_pairing', 'get_piece', 'get_piece', 'get_piece', 'review_page'];
export const typicalTokens = () => TYPICAL.reduce((n, t) => n + tokensOf(CALLS.find((c) => c.tool === t)!.chars), 0);

export type Arm = 'without' | 'with';

export const SUBJECTS = [
  { id: 'ledgerly', title: 'Ledgerly', prompt: "Build a landing page for Ledgerly, invoicing software for small accounting firms. It should make people trust it with their clients' money." },
  { id: 'crumb', title: 'Crumb & Co', prompt: "Make a mobile-first website for Crumb & Co, a neighbourhood bakery in Lisbon, where people can see today's bakes and pre-order for pickup." },
  { id: 'fleet', title: 'Fleet board', prompt: "Build a dashboard for a small courier company to watch its 12 delivery vans today: where they are, what's late, and who needs help." },
];


/** review_page (local server, Chromium, axe) run on every finished build. Scores out of 100; fails across all areas; contrast = text elements below AA. */
export interface Review { subject: string; arm: Arm; design: number; a11y: number; seo: number; aeo: number; geo: number; fails: number; contrast: number }

export const REVIEWS: Review[] = [
  { subject: 'ledgerly', arm: 'without', design: 42, a11y: 86, seo: 56, aeo: 95, geo: 85, fails: 4, contrast: 41 },
  { subject: 'ledgerly', arm: 'with', design: 95, a11y: 100, seo: 100, aeo: 100, geo: 98, fails: 0, contrast: 0 },
  { subject: 'crumb', arm: 'without', design: 56, a11y: 86, seo: 60, aeo: 99, geo: 80, fails: 4, contrast: 11 },
  { subject: 'crumb', arm: 'with', design: 100, a11y: 100, seo: 100, aeo: 100, geo: 93, fails: 0, contrast: 0 },
  { subject: 'fleet', arm: 'without', design: 42, a11y: 72, seo: 37, aeo: 100, geo: 80, fails: 8, contrast: 40 },
  { subject: 'fleet', arm: 'with', design: 80, a11y: 100, seo: 84, aeo: 99, geo: 94, fails: 0, contrast: 0 },
];

export interface Verdict { subject: string; winner: Arm; with: number; without: number; why: string }

/** A separate model judged each pair from screenshots only, labelled A and B at random, scoring fit, craft,
 *  distinctiveness, phone and ship-readiness out of 10 each. It was told the companies are fictional, so any
 *  certification or customer claim on a page is invented. The Ledgerly and Fleet builds with the Lounge are from
 *  the library as of 2026-11-03 (design-lounge-mcp 0.2.6); Crumb & Co is from the first run. */
export const VERDICTS: Verdict[] = [
  { subject: 'ledgerly', winner: 'with', with: 38, without: 32, why: 'Builds trust honestly with a working invoice editor, client-account versus office-account routing and a change log, set in a confident italic serif with navy and gold. The other states invented facts as real: 2,500+ practices, FCA authorisation, SOC 2, 99.98% uptime and a named testimonial.' },
  { subject: 'crumb', winner: 'with', with: 40, without: 39, why: 'Does the whole job: timed trays with live counts, a pickup slip, a grid of 15-minute slots and a phone tab bar. Its "Dear neighbour" letter is truly ownable.' },
  { subject: 'fleet', winner: 'without', with: 40, without: 39, why: 'The more distinctive board, with pointed actions such as "Send Van 04, 2.4 km" and "Retry tracker". The other won narrowly because its map sits in the first screen.' },
];

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

export function benchSummary() {
  const of = (arm: Arm) => REVIEWS.filter((r) => r.arm === arm);
  const mean = (arm: Arm, key: keyof Review) => Math.round(avg(of(arm).map((r) => r[key] as number)));
  const sum = (arm: Arm, key: keyof Review) => of(arm).reduce((n, r) => n + (r[key] as number), 0);
  return {
    builds: of('with').length,
    judgeWins: VERDICTS.filter((v) => v.winner === 'with').length,
    judged: VERDICTS.length,
    failsWith: sum('with', 'fails'),
    failsWithout: sum('without', 'fails'),
    contrastWith: sum('with', 'contrast'),
    contrastWithout: sum('without', 'contrast'),
    a11yWith: mean('with', 'a11y'),
    a11yWithout: mean('without', 'a11y'),
    designWith: mean('with', 'design'),
    designWithout: mean('without', 'design'),
    seoWith: mean('with', 'seo'),
    seoWithout: mean('without', 'seo'),
  };
}
