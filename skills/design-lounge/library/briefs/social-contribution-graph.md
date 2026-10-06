<!-- Design Lounge Nº 332 · "Paper contribution heatmap" · www.designlounge.live -->

# Paper contribution heatmap

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The contribution calendar on a developer's profile at "Mossgrid", an invented code host. It is set like a printed almanac rather than a dashboard: a warm paper sheet, a serif headline ("1,312 contributions *in 2025*"), monospaced labels, and 53 × 7 squares in five steps of one ink. A year switcher (2024 / 2025 / 2026) rebuilds the grid with a left-to-right wave. Three theme swatches (Meadow green, Clay terracotta, Tide blue) recolour every cell, staggered 4ms per week, so the change sweeps across the year instead of snapping. Below the grid sit four stats: current streak, longest streak, busiest day and active days. The detail worth copying is that the grid is one tab stop: focus it, then move day by day with arrow keys while the same tooltip used for hover follows the focused day.

## Structure

```
page 1280 × 800, #F3EFE3 + 4px paper grain; sheet 968 max, radius 3, padding 36/40/30
┌──────────────────────────────────────────────────────────────────────────────┐
│ ottoline · Mossgrid · Lisbon                     ( 2024 [2025] 2026 ) (◐)(◐)(◐)│
│ 1,312 contributions in 2025          Spectral 40                             │
│ ──────────────────────────────────────────────────────────────────────────── │ margin 24/20
│      Jan     Feb     Mar     Apr  …                                   Dec    │ 11px mono
│ Mon  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■             │ 13px cells
│ Wed  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■             │ 3px gap
│ Fri  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■             │ 7 rows
│ Hover a day, or focus the grid and use the arrow keys.      Less ■■■■■ More │
│ ──────────────────────────────────────────────────────────────────────────── │
│ STREAK AT YEAR END │ LONGEST STREAK │ BUSIEST DAY    │ ACTIVE DAYS           │
│ 3 days             │ 13 days        │ 18 20 Feb      │ 213 of 365            │
└──────────────────────────────────────────────────────────────────────────────┘
```

- `section.sheet` labelled by the `h1`.
- Year switcher: `div role="radiogroup" aria-label="Year"` of three `button role="radio"`, roving tabindex.
- Theme switcher: `div role="radiogroup" aria-label="Colour theme"` of three 34px round buttons, each with a half/half conic swatch (mid and darkest step).
- Grid: `.scroll` (overflow-x auto) > `.graph` (2-column grid: 30px day labels, cells). Cells are `i` elements in a CSS grid with `grid-template-rows: repeat(7, 13px); grid-auto-flow: column`. The cell container is `tabindex="0"`, `role="group"`, `aria-roledescription="calendar heatmap"`.
- Leading blank cells (`.pad`, `visibility: hidden`) push 1 January onto its weekday row.
- Month labels are absolutely positioned at `week × 16px` above the first week containing the 1st.
- Stats: `dl` with four groups split by 1px rules.
- Tooltip: one absolutely positioned `div` in the sheet, `aria-hidden`. The live region carries the text.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing / delay | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Cell rise | render (load, year) | opacity, translateY, scale | 0, 4px, .6 → 1, 0, 1 | 500ms | expo, `week × 7ms` | none |
| Theme ripple | theme change | background-color | old → new ink | 300ms | ease, `week × 4ms` | instant |
| Headline italic, streak | theme change | color | old → new | 300ms | ease | instant |
| Counters | render | number | previous → new | 700ms | cubic out | instant |
| Tooltip | hover/focus | opacity, translateY | 0, 4px → 1, 0 | 120ms / 150ms | ease | instant |
| Active cell | keyboard | scale | 1 → 1.35 | 150ms | ease | instant |
| Year pill | select | background, color | → ink / paper | 200ms | ease | instant |

## States

- Cell hover: 1.5px ink ring.
- Cell active (keyboard): scale 1.35, `box-shadow: 0 0 0 1.5px paper, 0 0 0 3px ink`, z-index 1.
- Future day: transparent with a 1px inset `--line` outline. No tooltip, not reachable by keys.
- Year selected: ink fill, paper text. Others ink-3, hover ink.
- Theme selected: 1px ink border plus 1px inset ink ring.
- Grid focus-visible: 2px `--c4` outline, offset 4px, around the whole cell block.
- Empty year (all zero): the grid shows all c0 cells, the headline reads "No contributions in 2024", and the stats show 0.

## Accessibility

- One tab stop for 365 cells. Arrow keys move the active day. Do not make each cell a button.
- `aria-label` on the grid explains the keys. The visible hint repeats it (`aria-describedby`).
- The live region announces "14 contributions · Tue 12 Aug 2025" on each keyboard move. Hover does not announce.
- Year and theme groups are radiogroups with roving tabindex. Arrow keys move and select, and wrap around.
- Theme swatches have names (Meadow, Clay, Tide) as `aria-label`.
- Colour is not the only carrier. Every value is reachable as text via the tooltip and live region.
- Contrast: `#6b7770` on `#faf7ee` ≈ 4.6:1. Paper on ink tooltip ≈ 12:1.
- Year and theme targets are 34px. Use 40px on touch-first layouts.

## Responsive rules

- ≥1024: sheet 968px. The grid (30 + 53 × 16 = 878px) fits without scrolling.
- 768: the sheet shrinks and the grid scrolls horizontally inside `.scroll`. The page never scrolls sideways.
- <720: padding 24/20, headline 30px, controls wrap under the headline, stats become a 2 × 2 grid.
- When the current year is shown, set `scrollLeft` to the end so recent weeks are visible first.
- Keep cells at 13px. Do not shrink them to fit, because they become unreadable below 10px.

## Acceptance checklist

### Always

- [ ] 7 rows (Sun–Sat) by up to 53 columns, 13px cells, 3px gaps, 2px radius.
- [ ] Five levels of one hue plus a neutral zero. Legend "Less … More" shows all five.
- [ ] Tooltip shows count and full date, sits 10px above the cell, and is clamped inside the sheet.
- [ ] Grid is a single tab stop with ↑↓ (day), ←→ (week), Home/End.
- [ ] Keyboard moves announce through a polite live region.
- [ ] Future days are outlined, not filled, and cannot be focused.
- [ ] Year switch rebuilds the grid with a per-week wave, and stats recount.
- [ ] Theme switch ripples colour across weeks (4ms per week, 300ms each).
- [ ] Streak label says "Current streak" for the current year and "Streak at year end" otherwise.
- [ ] No page-level horizontal scroll at 375px. The grid scrolls in its own container.
- [ ] Reduced motion removes the rise, ripple and count-up.

### This demo

- [ ] Owner line "ottoline · Mossgrid · Lisbon". Today is fixed at 3 Oct 2026.
- [ ] Years 2024, 2025, 2026, and 2025 starts selected.
- [ ] Themes Meadow, Clay, Tide with the hexes in Tokens.
- [ ] Stats: streak, longest streak, busiest day (value + date), active days "of N".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: year 2025, theme Meadow. Cells rise in (opacity 0 → 1, translateY 4px → 0, scale .6 → 1, 500ms expo out) staggered 7ms per week column. The headline total and the stats count up over 700ms (cubic out).
2. Hover a day. A dark tooltip appears 10px above the cell, centred, with "**14 contributions** · Tue 12 Aug 2025" (or "No contributions · …"). The hovered cell gets a 1.5px ink ring. The tooltip is clamped 8px inside the sheet edges.
3. Leave the grid and the tooltip fades out in 120ms.
4. Tab to the grid. The last past day becomes active: it scales to 1.35 with a paper gap and an ink ring, and the tooltip shows. ↑/↓ move one day, ←/→ move one week, Home/End jump to the first and last past day. A polite live region reads the tooltip text. On narrow screens the scroller follows the active day.
5. Click 2026 (or use arrows inside the year radiogroup). The grid rebuilds with the wave. Days after today (3 Oct 2026) render as empty 1px-outlined squares and cannot be focused. The scroller jumps to the end so today is visible. The first stat label reads "Current streak". For 2024 and 2025 it reads "Streak at year end".
6. Click the Clay swatch. Cell colours, the italic year in the headline, and the streak number crossfade over 300ms, each cell delayed by `week × 4ms`.
7. Reduced motion: no rise-in, no ripple, no count-up. Values and colours apply at once.

## Tokens

```css
:root {
  --bg: #f3efe3;        /* page */
  --paper: #faf7ee;     /* sheet */
  --ink: #22302a;       /* text, tooltip, active year */
  --ink-2: #46544c;
  --ink-3: #6b7770;     /* labels */
  --line: #ddd6c3;      /* rules, future-day outline */
  --c0: #e6e1d0;        /* zero */
  --c1: #c5d9a6; --c2: #8fbf6a; --c3: #4f9a45; --c4: #24642f;   /* Meadow */
  --serif: "Spectral", Georgia, serif;
  --mono: "DM Mono", ui-monospace, monospace;
  --cell: 13px; --gap: 3px;            /* column pitch 16px */
  --r-sheet: 3px; --r-cell: 2px; --r-pill: 999px;
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
}
body[data-theme="clay"] { --c1: #efc9a8; --c2: #e09a6b; --c3: #c0603a; --c4: #7f3420; }
body[data-theme="tide"] { --c1: #bcd6dc; --c2: #7fb2c0; --c3: #3f8399; --c4: #1d4f63; }
```

Level thresholds: 0 → c0, 1–2 → c1, 3–5 → c2, 6–10 → c3, 11+ → c4.

## Typography

| Role | Family | Size / line | Weight | Tracking | Notes |
| --- | --- | --- | --- | --- | --- |
| Owner line | DM Mono | 12px | 400, handle 500 | 0.06em | ink-3 |
| Headline | Spectral | 40 / 1.05 | 400, number 600 | −0.015em | "in 2025" italic in `--c4` |
| Year pill | DM Mono | 13px | 400 | 0 | 34px tall |
| Month / day labels | DM Mono | 11px / 10px | 400 | 0 | ink-3 |
| Hint, legend | DM Mono | 11px | 400 | 0 | ink-3 |
| Stat label | DM Mono | 11px | 400 | 0.08em | uppercase |
| Stat value | Spectral | 30 / 1 | 400 | 0 | lining tabular nums. Unit in 12px mono |
| Tooltip | DM Mono | 12 / 1.3 | 400, count 500 | 0 | paper on ink |

## Implementation notes

Column-major layout with no JS positioning. Let CSS grid flow the days down each week:

```css
.cells {
  display: grid;
  grid-template-rows: repeat(7, var(--cell));
  grid-auto-flow: column;
  grid-auto-columns: var(--cell);
  gap: var(--gap);
}
.cells i { transition: background-color .3s var(--ease) var(--d, 0ms);
  animation: in .5s var(--expo) both; animation-delay: calc(var(--w) * 7ms); }
```

Prepend `new Date(year, 0, 1).getDay()` invisible pad cells so 1 January lands on its weekday row. Set `--w` (week index) and `--d` (`week × 4ms`) inline on each cell. Then a theme change is just swapping `data-theme` on `body`, and the ripple comes from the per-cell transition-delay.

Streaks, where future days (`v = -1`) neither break nor extend a run:

```js
let long = 0, run = 0;
days.forEach(x => { if (x.v > 0) long = Math.max(long, ++run); else if (x.v === 0) run = 0; });
let cur = 0;
const past = days.filter(x => x.v >= 0);
for (let i = past.length - 1; i >= 0 && past[i].v > 0; i--) cur++;
```

Arrow keys map to index offsets: up −1, down +1, left −7, right +7. Clamp to `[0, lastPastIndex]` and ignore moves that would leave the range, rather than wrapping across years.

Common mistakes:

- Making 365 focusable buttons. Tabbing becomes impossible.
- A tooltip that follows the mouse instead of anchoring to the cell.
- Different hues per level. It is one hue in five steps.
- Shrinking cells on mobile instead of letting the grid scroll.
- Letting the body grow to the grid's max-content width. Give the page grid `grid-template-columns: minmax(0, 1fr)`.
- Data that looks random. Weight weekdays (≈85%) above weekends (≈35%), add a seasonal swell and two or three gaps of 6–12 days for holidays.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
