<!-- Design Lounge Nº 587 · "Roadmap swimlanes" · www.designlounge.live -->

# Roadmap swimlanes

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A one-screen product roadmap for an invented logistics company ("Wayfare roadmap FY27"). Twelve months run left to right in four quarters; five team swimlanes run top to bottom, each with one or two rows of initiative bars. Bars are filled by status (shipped green, in progress amber, at risk coral, planned as an outlined dark bar), a chartreuse today line cuts through every lane, and a hatched "peak freeze" band marks weeks nobody should ship. Every bar can be dragged along time and snaps to whole weeks, with a date bubble that reads the new range as you drag. The detail worth copying is that every position is a percentage of the track, so the same data lays out at 1280 and inside a 1000px horizontal scroller on a phone.

## Structure

```
1280 × 800
┌───────────────────────────────────────────────────────────────────────────┐
│ WAYFARE ROADMAP FY27 (Bebas 64)          [All teams 21][Platform 5]…[Design 3]│
│ Jul 2026 to Jun 2027 · 21 initiatives · updated…                            │
│ ■ Shipped ■ In progress ■ At risk □ Planned          Drag a bar… (hint)     │
│ ┌────────────┬──────────────┬──────────────┬──────────────┬──────────────┐  │
│ │ TEAM       │ Q1 Jul to Sep│ Q2 Oct to Dec│ Q3 Jan to Mar│ Q4 Apr to Jun│  │ head 66
│ │            │ Jul Aug Sep  │ Oct Nov Dec  │ …            │              │  │
│ ├────────────┼──────────[TODAY OCT 28]─[PEAK FREEZE]─────────────────────┤  │
│ │ PLATFORM   │ [Event bus v2]  [Multi-region failover]        [SOC 2…]    │  │ lane: 2 rows × 46
│ │ Lead · …   │       [Rate limiter]            [Audit log export]         │  │
│ ├────────────┼────────────────┃──////────────────────────────────────────┤  │
│ │ MOBILE …   │ …              ┃  ////                                     │  │
│ └────────────┴────────────────┸──────────────────────────────────────────┘  │
│   184px          track = 12 equal months, bars at s/12 × 100%                │
└───────────────────────────────────────────────────────────────────────────┘
```

- `<header>`: `<h1>` (Bebas, with "FY27" in the today colour), a `.sub` meta line, and `.filters` (`role="group" aria-label="Filter by team"`) of `<button aria-pressed>` chips with a count.
- `.legend` (decorative, `aria-hidden`) with four swatches and the drag hint.
- `.scroll` (`overflow:auto`, 1px border, 10px radius) holds `.grid` (`min-width:1000px; position:relative`).
- `.head` sticky top: `.corner` + `.qs` (4 quarter columns, each 3 month labels). The today pill and freeze tag sit on the head's bottom edge.
- One `<section class="lane" aria-label="Platform">` per team: `.who` (sticky left: Bebas team name, lead, item count) + `.track` with `.row` children, each holding absolutely positioned `<button class="bar">`.
- `.overlay` (absolute, from `left: var(--lane-w)` to the right edge, below the bars): `.freeze` hatched band and the 2px `.today` line.
- `.tip` (`role="status"`) is the drag bubble.

Data shape, one array per team: `[title, startMonth, endMonth, status, ownerInitials]`, months as floats from 0 (Jul 1) to 12 (Jun 30).

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---:|---|---|
| `.bar` | hover | transform, box-shadow | 0 → −1px, none → `--sh-hover` | 140ms | `--ease` | 1ms |
| `.bar.drag` | pointer-down | transform, box-shadow | → −2px, `--sh-drag` | 0 (instant) | — | same |
| `.bar` position | drag / arrow keys | left | snaps per week | 0 | — | same |
| `.tip` | drag start / end | opacity | 0 ↔ 1 | 140ms | `--ease` | 1ms |
| `.chip` | hover, press | background, colour, border | | 140ms | `--ease` | 1ms |
| `.lane.in` | becomes visible via filter | opacity, translateY | 0, −6px → 1, 0 | 280ms | `--ease-out` | none |

No looping animation anywhere; the today line is static.

## States

- **Bar status:** Shipped fill `--shipped` / text `--shipped-ink`; In progress `--progress` / `--progress-ink`; At risk `--risk` / `--risk-ink`; Planned fill `--panel-2`, text `--ink`, 1px inset ring `--planned`.
- **Bar hover:** −1px, soft shadow. **Dragging:** −2px, 2px `--ink` ring and deep shadow, `cursor: grabbing`, `z-index:6`.
- **Bar focus-visible:** 2px `--today` outline, 2px offset.
- **Chip pressed:** fill `--ink`, text `--bg`, border `--ink`. Hover: border `--ink-3`, text `--ink`.
- **Filtered:** non-matching lanes get `hidden`; the today line and freeze band still span the visible lanes.
- **Truncation:** long titles ellipsise inside the bar; the owner disc never shrinks.

## Accessibility

- Bars are `<button>`s with `aria-label="Driver app 4.0, At risk, Oct 8 to Jan 16. Left and right arrows move by a week."`, refreshed after every move.
- ← / → move a focused bar one week and call `preventDefault` so the scroller does not also scroll.
- The drag bubble is `role="status" aria-live="polite"` so keyboard moves are announced.
- Filter chips are a `role="group"` of toggle buttons with `aria-pressed`; only one is pressed.
- Lanes are `<section aria-label>` so screen readers can jump by region.
- Contrast: `--ink-3` on `--panel` 5.8:1; bar text on fills 6.6–9.0:1; `--today-ink` on `--today` 14.8:1. Planned bar ring `#6e766f` on `--panel` 3.7:1 for the non-text edge.
- Hit targets: chips 36px tall; bars 34px tall and at least 140px wide in the data.

## Responsive rules

- ≥ 1280: as specified; the 1000px grid fills the panel.
- 1024–1279: same; the track narrows, bars shrink proportionally, titles ellipsise.
- 760–1023: chips scroll horizontally on one line if they don't fit; the grid keeps `min-width:1000px` and the panel scrolls sideways.
- < 760: 16px gutters, title 48px, `--lane-w` 120px, the drag hint is hidden, and on load `scrollLeft` is set so October is the first visible month. The team column stays sticky. The page itself never scrolls sideways at 390px; only `.scroll` and `.filters` do.

## Acceptance checklist

**Always**
- [ ] Bars are positioned with `left: s/12 × 100%` and `width: len/12 × 100%` of the track, never with pixel math tied to one width.
- [ ] Dragging snaps to whole weeks and clamps to the year; the bar never leaves the track.
- [ ] A date bubble shows the live range while dragging and on arrow-key moves.
- [ ] ← / → move a focused bar by one week; `aria-label` updates with the new range.
- [ ] Four statuses are distinguishable by fill and by the legend, not by colour alone (planned is outlined).
- [ ] The today line and freeze band sit under the bars, so bar text is never crossed.
- [ ] Filter chips are single-select toggles; the shown lane fades in over 280ms.
- [ ] Header row and team column stay sticky inside the scroller.
- [ ] At 390 wide nothing on the page scrolls sideways except the roadmap panel and chip row.

**This demo**
- [ ] Title "WAYFARE ROADMAP FY27", meta "Jul 2026 to Jun 2027 · 21 initiatives · updated Oct 28 by Priya Venkat".
- [ ] Chips read All teams 21, Platform 5, Mobile 5, Payments 4, Growth 4, Design systems 3.
- [ ] Today pill "TODAY OCT 28" at 3.87/12 of the track; freeze band 4.63 to 6.16.
- [ ] "Driver app 4.0" is the only At risk bar.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: "All teams 21" filter pressed; five lanes visible (Platform, Mobile, Payments, Growth, Design systems); today line at Oct 28 (month 3.87 of 12); freeze band from Nov 20 to Jan 6.
2. Hover a bar: it lifts 1px and gains a soft drop shadow (140ms).
3. Pointer-down on a bar: it gains a 2px light ring and a deep shadow, cursor becomes `grabbing`, and a dark-on-light bubble appears centred above it reading the range ("Feb 22 to Apr 30").
4. Drag horizontally: the bar follows the pointer, snapping to 0.25-month steps (one week); it cannot start before Jul 1 or end after Jun 30. The bubble text and position update on every snap.
5. Pointer-up: ring, shadow and bubble go away; the bar keeps its new position; its `aria-label` now states the new range.
6. Keyboard: focus a bar with Tab and press ← or → to move it one week; the bubble appears while it moves and disappears on blur.
7. Click a team chip: only that lane stays visible, and it fades in from 6px above (280ms). The chip turns solid light; "All teams" restores every lane.
8. Below 760px: the timeline sits in a horizontal scroller (min-width 1000px), the team column sticks to the left, and the scroller opens at October so the today line is in view.

## Tokens

```css
:root {
  /* surfaces */
  --bg: #121413;          /* page */
  --panel: #181b19;       /* roadmap panel, sticky columns */
  --panel-2: #202421;     /* planned bar fill */
  --line: #2a2e2b;        /* hairlines, month gridlines */
  --line-2: #3a3f3b;      /* chip border */
  /* text */
  --ink: #ecefea;  --ink-2: #b4bbb3;  --ink-3: #8f978f;
  /* accent: time */
  --today: #d8f25a;  --today-ink: #121413;
  /* status */
  --shipped: #6fc28b;  --shipped-ink: #0d1f14;
  --progress: #f0b44c; --progress-ink: #2a1b00;
  --risk: #f07a63;     --risk-ink: #2a0e08;
  --planned: #6e766f;  /* 1px inset ring on planned bars */
  /* type */
  --display: "Bebas Neue", Impact, sans-serif;
  --ui: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  /* layout */
  --lane-w: 184px;   /* 120px below 760 */
  --row-h: 46px;
  --bar-h: 34px;
  --r: 6px;          /* bars */
  --r-panel: 10px;
  --chip-h: 36px;
  /* depth */
  --sh-drag: 0 14px 30px -10px rgba(0,0,0,.7), 0 0 0 2px var(--ink);
  --sh-hover: 0 6px 14px -6px rgba(0,0,0,.6);
  /* motion */
  --t-micro: 140ms;
  --t-layout: 280ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --snap: .25;       /* months per snap step (one week) */
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Page title | Bebas Neue | 64px (48px < 760) | 400 | 0.84 | +0.01em | caps (font) |
| Quarter label | Bebas Neue | 28px | 400 | 1 | +0.02em | caps |
| Team name | Bebas Neue | 22px (18px < 760) | 400 | 1 | +0.03em | caps |
| Today pill | Bebas Neue | 15px | 400 | 1 | +0.06em | caps |
| Bar label | system UI | 12.5px | 600 | 1 | 0 | sentence |
| Owner initials | system UI | 9px | 700 | 20px | 0 | caps |
| Chip | system UI | 13px | 500 (count 600) | 1 | 0 | sentence |
| Meta, month, lead | system UI | 11–12px | 400–500 | 1.4 | 0 to +0.02em | sentence |
| Corner, freeze tag | system UI | 10–11px | 600 | 1 | +0.08em | UPPERCASE |

## Implementation notes

**Snap and clamp in months, then render as percentages.** Convert the pointer delta with the track's width per month at drag start:

```js
lanes.addEventListener('pointerdown', (e) => {
  const b = e.target.closest('.bar'); if (!b) return;
  drag = { b, x: e.clientX, s: +b.dataset.s, per: b.closest('.track').getBoundingClientRect().width / 12 };
  b.setPointerCapture(e.pointerId);
});
const move = (b, s) => {
  b.dataset.s = Math.max(0, Math.min(12 - +b.dataset.len, Math.round(s / .25) * .25));
  b.style.left = `calc(${b.dataset.s / 12 * 100}% + 2px)`;
};
```

**Month float to a date label.** Keep a days-per-month table for the fiscal year so the bubble reads real dates:

```js
const MON = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];
const DAYS = [31,31,30,31,30,31,31,28,31,30,31,30];
const fmt = (m) => { const i = Math.floor(m); return MON[i] + ' ' + (Math.floor((m - i) * DAYS[i]) + 1); };
```

**Layering.** The overlay (today line, freeze band) must sit under the rows and under the sticky team column, and the today pill belongs to the sticky head, or it disappears behind it when the panel scrolls:

```css
.overlay { position:absolute; inset:0 0 0 var(--lane-w); z-index:1; pointer-events:none; }
.row { position:relative; z-index:2; }
.who { position:sticky; left:0; z-index:3; background:var(--panel); }
.head { position:sticky; top:0; z-index:5; }
```

Common mistakes: drawing the today line above the bars (it slices through labels); forgetting `touch-action:none` on bars, so touch drags scroll the panel instead; snapping in pixels, which drifts when the window resizes.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
