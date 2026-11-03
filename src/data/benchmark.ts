// /benchmark and the homepage proof band: what the Design Lounge MCP costs in tokens and what it changes.
// Every number here was measured, never estimated by hand. RUNS come from Claude Code's own usage report for each
// subagent run; CALLS are the hosted endpoint's response sizes, in characters, measured on the date below.

export const BENCH_META = {
  date: '2026-11-03',
  model: 'Claude Opus 5.5 (claude-opus-5-5)',
  harness: 'Claude Code subagents, one fresh session per run, plain index.html + styles.css + main.js',
  without: 'No Design Lounge skill or MCP tools and no other design skill; the repository was not read; built in an empty folder.',
  with: 'The Design Lounge MCP tools as an outside user gets them: start_design first, then recipe, theme, pairing and pieces, and review_page before finishing.',
  tokensNote: 'Tokens are Claude Code\'s reported total for the whole run: every prompt, file read, tool result and reply.',
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
export interface Run { subject: string; arm: Arm; tokens: number; tools: number; ms: number }

export const SUBJECTS = [
  { id: 'ledgerly', title: 'Ledgerly', prompt: "Build a landing page for Ledgerly, invoicing software for small accounting firms. It should make people trust it with their clients' money." },
  { id: 'crumb', title: 'Crumb & Co', prompt: "Make a mobile-first website for Crumb & Co, a neighbourhood bakery in Lisbon, where people can see today's bakes and pre-order for pickup." },
  { id: 'fleet', title: 'Fleet board', prompt: "Build a dashboard for a small courier company to watch its 12 delivery vans today: where they are, what's late, and who needs help." },
];

export const RUNS: Run[] = [
  { subject: 'ledgerly', arm: 'without', tokens: 57913, tools: 11, ms: 186532 },
  { subject: 'ledgerly', arm: 'with', tokens: 133103, tools: 41, ms: 488413 },
  { subject: 'crumb', arm: 'without', tokens: 62684, tools: 13, ms: 218513 },
  { subject: 'crumb', arm: 'with', tokens: 143543, tools: 39, ms: 468070 },
  { subject: 'fleet', arm: 'without', tokens: 81596, tools: 19, ms: 496766 },
  { subject: 'fleet', arm: 'with', tokens: 134711, tools: 39, ms: 443791 },
];

export interface Score { fit: number; craft: number; distinct: number; phone: number; ship: number }
export interface Judged { subject: string; winner: Arm | 'tie'; with: Score; without: Score; why: string }
/** The Lounge's own demo gate (scripts/gates/demos.mjs, Linux, the CI container) run on every build afterwards. */
export interface Checked { subject: string; arm: Arm; contrast: boolean; lines: boolean; first: string }

export const JUDGE_META = 'A separate agent saw only screenshots (desktop and phone, first screen and full page), labelled A and B at random, and scored each from 1 to 10. It was not told what the two setups were.';

/** The blind verdicts, with the A/B labels mapped back to the arms after judging. Its words, lightly trimmed. */
export const JUDGED: Judged[] = [
  {
    subject: 'ledgerly', winner: 'without',
    without: { fit: 9, craft: 9, distinct: 8, phone: 8, ship: 8 },
    with: { fit: 7, craft: 7, distinct: 5, phone: 7, ship: 6 },
    why: "The winner builds trust from the money itself: a real invoice with an audit trail, a dark safeguards section, pricing with pass-through fees and a partner FAQ. The other uses the generic SaaS hero (blue button, faked app window, two-tone headline), its sticky steps leave large gaps on desktop, and it has no pricing.",
  },
  {
    subject: 'crumb', winner: 'with',
    with: { fit: 9, craft: 7, distinct: 9, phone: 8, ship: 7 },
    without: { fit: 7, craft: 9, distinct: 7, phone: 8, ship: 8 },
    why: "The winner does the whole job: timed trays with live counts, a pickup slip, a grid of 15-minute slots and a phone tab bar, and its 'Dear neighbour' letter is truly ownable, though handwriting everywhere hurts reading. The other is the cleaner build but shows no slip or time picker.",
  },
  {
    subject: 'fleet', winner: 'without',
    without: { fit: 9, craft: 9, distinct: 7, phone: 9, ship: 8 },
    with: { fit: 8, craft: 8, distinct: 9, phone: 7, ship: 7 },
    why: "The winner answers all three questions at once: a map with problems pinned on the vans, a help queue with Call buttons and wait times, and a table of all 12 vans, with the queue above the map on a phone. The other has more character but on a phone the help detail falls below a cropped map.",
  },
];

export const CHECKED_RUNS: Checked[] = [
  { subject: 'ledgerly', arm: 'without', contrast: false, lines: true, first: 'Eyebrow and stat text at 4.07 to 4.17:1' },
  { subject: 'ledgerly', arm: 'with', contrast: true, lines: true, first: '' },
  { subject: 'crumb', arm: 'without', contrast: false, lines: true, first: 'Bake names and prices at 3.57:1, glosses at 2.33:1' },
  { subject: 'crumb', arm: 'with', contrast: false, lines: false, first: 'A blue pen mark behind one line of text; the name field border at 2.5:1' },
  { subject: 'fleet', arm: 'without', contrast: false, lines: true, first: 'Stat notes at 3.32:1' },
  { subject: 'fleet', arm: 'with', contrast: true, lines: true, first: '' },
];

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

export function benchSummary() {
  const paired = SUBJECTS.filter((s) => RUNS.some((r) => r.subject === s.id && r.arm === 'with') && RUNS.some((r) => r.subject === s.id && r.arm === 'without'));
  const of = (arm: Arm) => RUNS.filter((r) => r.arm === arm && paired.some((s) => s.id === r.subject));
  const withTokens = Math.round(avg(of('with').map((r) => r.tokens)));
  const withoutTokens = Math.round(avg(of('without').map((r) => r.tokens)));
  const passes = (arm: Arm) => CHECKED_RUNS.filter((r) => r.arm === arm && r.contrast).length;
  return {
    pairs: paired.length,
    withTokens,
    withoutTokens,
    tokenDelta: withoutTokens ? Math.round(((withTokens - withoutTokens) / withoutTokens) * 100) : 0,
    withTools: Math.round(avg(of('with').map((r) => r.tools))),
    withoutTools: Math.round(avg(of('without').map((r) => r.tools))),
    withMs: Math.round(avg(of('with').map((r) => r.ms))),
    withoutMs: Math.round(avg(of('without').map((r) => r.ms))),
    judged: JUDGED.length,
    judgeWith: JUDGED.filter((j) => j.winner === 'with').length,
    checked: CHECKED_RUNS.length / 2,
    contrastWith: passes('with'),
    contrastWithout: passes('without'),
  };
}
