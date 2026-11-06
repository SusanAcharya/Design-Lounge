<!-- Design Lounge Nº 657 · "Cinema seat map with tap-to-zoom" · www.designlounge.live -->

# Cinema seat map with tap-to-zoom

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The seat step of "Lumen", an invented independent cinema, for "The Lantern Keeper", Saturday 7 November, 20:15, Screen 3. The whole auditorium fits on screen first: ten rows (A–H standard at €12, J–K recliners at €17, no row I) of 14 seats in three blocks of 4 | 6 | 4 under a curved, softly lit screen. At that size seats are about 20px, too small to hit, so a tap on any block zooms the map 2.1× around that block (no pinch needed) and the seats become 43px buttons with their numbers in them. Tap to select: the seat pops brass. A bottom sheet keeps a chip per seat, a running total in euros and a "Best available for 2" shortcut that picks the best adjacent pair and zooms to it. Worth copying: the zoom is a real layout zoom (one `--p` pitch variable drives every dimension) inside a native scroller, so panning is the platform's own scroll, and every seat is a button with a label like "Row F, seat 7, €12".

The language is iOS 26-ish on a dark cinema ground: 44px round header buttons, a 22px-radius bottom sheet, pill buttons, motion that eases out.

## Structure

```
390 × 844
┌──────────────────────────────────────┐
│ 54 status (Lounge)                   │
│ (‹)          LUMEN             (i)   │ Monoton 30 brass
│        The Lantern Keeper            │
│     Sat 7 Nov · 20:15 · Screen 3     │
│ ▢ €12  ▣ Recliner €17  ▨ Taken  ■ Yours │ legend 11px
│  ╭──────────── SCREEN ───────────╮   │ 34 arc + glow
│                                      │
│ A ▢▢▨▨  ▢▢▢▢▢▢  ▢▢▢▢ A              │ map viewport (scroller)
│ …                                    │ 17.4p wide, rows 1.3p
│ H ▢▨▨▢  ▢▢▢▨▢▢  ▢▢▢▢ H              │
│ ───────── RECLINERS ─────────        │
│ J ▣▣▣▣  ▨▨▨▣▣▨  ▣▣▣▣ J              │
│ K ▨▨▣▣  ▣▣▨▨▣▣  ▣▣▨▨ K              │
│ Tap a block to zoom in   [⛶ All seats]│ 44 row
│╭────────────────────────────────────╮│ sheet r22
││ (✦ Best available for 2)           ││ 46
││ [Row F 7 €12.00] [Row F 8 €12.00]  ││ chips 32
││ €24.00               (Continue · 2) ││ 52
│╰────────────────────────────────────╯│ 34 bottom padding
└──────────────────────────────────────┘
```

- `<main class="app">`: flex column, `overflow: hidden`.
- `<header>`: two `<button>`s and `<h1>LUMEN</h1>` + `<p>`.
- Legend and screen: `aria-hidden` (the seat labels carry prices and states).
- `.view` (`overflow: auto`, grid, safe-centre) holding `.map` (`role="group"`, aria-label "Seat map, rows A to K. Front of the cinema at the top."): per row a label `<span aria-hidden>`, 14 `<button class="seat">` with aisle spacers `<i aria-hidden>` before seats 5 and 11, a closing label.
- `.under`: hint text and the "All seats" `<button>` (`visibility: hidden` until zoomed).
- `<section class="sheet" aria-label="Your seats">`: Best available `<button>`, chips, total, Continue `<button>`.
- `<p aria-live="polite">` for every change.

## Motion

| Thing | Trigger | Property | From → to | Timing | Reduced motion |
|---|---|---|---|---|---|
| Hint | load | border-color, ring on F7 | outline → brass + 0.12p ring → outline | 900ms × 2, 600ms delay, `--ease` | none |
| Zoom in | tap a block, Best available | `--p` and scrollLeft/Top | 20.5 → 43, anchor held | 420ms, 1 − (1 − t)⁴ | one frame |
| Zoom out | All seats | same | 43 → 20.5 about map centre | 420ms | one frame |
| All seats pill | zoom | opacity, visibility | 0 → 1 | 200ms `--ease` | instant |
| Select | tap / Enter | scale (seat shape) | 0.7 → 1.22 → 1 | 360ms `--pop` | none |
| Seat colour | select, hover | background, border | state → state | 140ms `--ease` | instant |
| Best available press | :active | scale | 1 → 0.97 | 160ms `--pop` | instant |

## States

- **Seat available:** outline; hover turns the outline cream.
- **Seat recliner:** rose outline on a rose-black fill; label adds ", recliner".
- **Seat taken:** solid grey with a diagonal stroke, `aria-disabled="true"`, cursor not-allowed, number hidden.
- **Seat selected:** brass fill, dark numerals, `aria-pressed="true"`.
- **Overview / zoomed:** numbers hidden / shown; hint text and All seats pill swap.
- **Sheet empty:** help line in the chips row; Continue disabled ("Choose seats", grey fill, 1px border).
- **Sheet filled:** chips, total, "Continue · N seats" in brass.
- **Limit reached:** further selections refused and announced.
- **Focus-visible:** 2px brass outline, 2px offset, on seats and buttons.

## Accessibility

- Every seat is a `<button>` with `aria-label` "Row F, seat 7, €12" (recliners "Row J, seat 4, €17, recliner"; taken "Row F, seat 5, taken"). Selected seats use `aria-pressed`.
- Roving tabindex on the map: one tab stop, arrow keys move by seat (they skip aisles naturally because aisles are not seats), Enter/Space select at any zoom.
- The zoom is for fingers only; keyboard and screen-reader users never need it.
- A polite live region announces "Row F, seat 7 added. Total €12.00.", zoom changes, the best-available result and the 8-seat limit.
- Legend and screen are `aria-hidden` because each seat's label already says its price and state.
- Contrast: cream on ground 16:1, `#B9ABA0` 8.6:1, brass-ink on brass 10:1, available outline 4.9:1, recliner outline 4.5:1; taken differs by shape and stroke as well as colour.
- Targets: zoomed seat cells 43 × 56px; header buttons 44px; sheet buttons 46px and 52px.

## Responsive rules

- p is computed from the viewport: `min(20.5, (width − 2) / 17.4)`, so at 360 wide p = 20.6 → 20.5 is kept and the map is 357px; zoom is always p × 2.1.
- Under 760px tall the map scrolls vertically in overview too; the sheet keeps its three rows.
- At tablet width the overview p grows to 28 and seats become directly tappable (≥ 40px with the 1.3 row height); skip the first-tap zoom when p ≥ 36.
- Above 430px the app column centres at 430px.

## Acceptance checklist

**Always**
- [ ] One pitch variable sizes seats, aisles, labels, radii and numbers, so the zoom is a true layout zoom.
- [ ] Zoom keeps the tapped block under the finger; panning is native scroll in the viewport.
- [ ] In overview the first tap zooms and does not select; when zoomed a tap toggles.
- [ ] A pan of more than 8px never selects a seat.
- [ ] Taken seats are distinguishable by shape and stroke, not colour alone, and cannot be selected.
- [ ] Every seat is a button with an aria-label of row, number and price; selected seats use `aria-pressed`.
- [ ] Arrow keys move between seats; Enter selects without zooming.
- [ ] The bottom sheet shows a chip per seat, a running total and a disabled Continue when empty.
- [ ] "Best available for 2" never picks a pair across an aisle.
- [ ] Hidden All seats pill is `visibility: hidden`; `scrollWidth` stays 390 at both zoom levels.

**This demo**
- [ ] Cinema "LUMEN", film "The Lantern Keeper", "Sat 7 Nov · 20:15 · Screen 3".
- [ ] Rows A–H €12, J–K recliners €17, 14 seats in 4 | 6 | 4, no row I.
- [ ] Best available for 2 selects F7 and F8, total "€24.00", "Continue · 2 seats".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame at 390 × 844 (Lounge status bar; content from 54px), ground `#120E10`. Header: 44px round back button, centre "LUMEN" in Monoton 30px brass `#E0B252` with a 14px brass glow, then "The Lantern Keeper" (13/500) and "Sat 7 Nov · 20:15 · Screen 3" (12px, `#B9ABA0`); 44px info button right.
2. Legend row 14px below, four items spread across: outline swatch "€12", rose swatch "Recliner €17", taken swatch (grey with a diagonal stroke) "Taken", brass swatch "Yours" (11px).
3. Screen: a 34px SVG, a 2.5px cream arc with a 22%→0% cream glow under it, "SCREEN" (10px, 0.3em) centred.
4. Map viewport fills the middle, a native scroller with hidden scrollbars and the map centred in it (`align-content / justify-content: safe center`). Grid columns: row label 0.9p, 4 seats, aisle 0.8p, 6 seats, aisle 0.8p, 4 seats, row label 0.9p (17.4p total); rows 1.3p tall; p = 20.5px at 390 wide. Between H and J a divider row reads "RECLINERS" (0.4p, 0.14em, `#F3BFD0`) between two hairlines.
5. Seats: a seat-shaped box inset in each cell, radius 0.3p on top and 0.12p at the bottom, 0.09p border. Available: `#8F8189` outline on the ground. Recliner: `#D0698A` outline on `#2C1A22`. Taken: solid `#2E272B` with a diagonal `#5E5358` stroke, no border (shape and stroke, not only colour). Selected: solid brass.
6. Under the map a 44px row: "Tap a block to zoom in" on the left. On load, seat F7 pulses a brass ring twice (900ms each, 600ms delay) to show where to start.
7. Tap any seat in overview: the map zooms from p = 20.5 to p = 43 over 420ms (quartic ease-out), anchored so the tapped block's centre (horizontally) and the tapped row (vertically) stay under the finger's region. Numbers appear in the seats (0.3p). The row text changes to "Drag to look around" and an "All seats" pill (36px) fades in at the right. The first tap only zooms; it does not select.
8. Zoomed: tap a seat to toggle it. Selecting pops the seat (scale 0.7 → 1.22 → 1 over 360ms, overshoot) and turns it brass with dark `#1A1206` numerals; tapping again removes it. Taken seats do nothing except announce "Row F, seat 5 is taken." A drag of more than 8px is a pan, never a tap.
9. "All seats" zooms back to the overview around the map centre.
10. Bottom sheet `#1C1619`, radius 22 on top, 1px `#3A3035` top border, 14px 16px 34px padding:
    - "Best available for 2": a 46px brass-outlined pill with a sparkle icon;
    - chips row (32px, scrolls sideways): one chip per seat "Row F **7** €12.00", or "Pick seats on the map, or let us choose." when empty;
    - total row: "€24.00" (24/700, tabular) over "2 seats · no booking fee" (11px), and a 52px brass "Continue · 2 seats" pill (disabled and grey "Choose seats" when empty).
11. "Best available for 2" scans rows C–H for two adjacent free seats inside one block (never across an aisle), scores each pair by distance from the sweet spot (row F/G boundary weighted ×1.3, centre column 7.5), replaces the current selection with the best pair (F7 and F8 in this data), and zooms to it if not zoomed.
12. Up to eight seats; a ninth announces "You can choose up to 8 seats."
13. Keyboard: the map is one tab stop (roving tabindex, starts on F7). Arrow keys move between seats across aisles; Enter or Space selects directly without zooming (a keyboard needs no bigger target). Tab continues to All seats, Best available, Continue.
14. Reduced motion: zoom jumps in one frame, no pop, no hint pulse; everything else is the same.

## Tokens

```css
:root {
  --bg: #120e10;            /* auditorium */
  --surface: #1c1619;       /* sheet, header buttons */
  --raise: #261e22;         /* chips, All seats, disabled Continue */
  --line: #3a3035;          /* hairlines */
  --ink: #f4ece2;           /* 16:1 on bg */
  --ink-2: #b9aba0;         /* labels, 8.6:1 on bg, 7.9:1 on surface */
  --brass: #e0b252;         /* wordmark, selected, Best available, Continue */
  --brass-ink: #1a1206;     /* text on brass, 10:1 */
  --rose: #d0698a;          /* recliner outline */
  --rose-fill: #2c1a22;
  --rose-ink: #f3bfd0;      /* recliner numerals, divider label */
  --avail: #8f8189;         /* available outline, 4.9:1 on bg */
  --taken: #2e272b; --taken-stroke: #5e5358;
  --neon: "Monoton", system-ui, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;
  --fs-mark: 30px; --fs-total: 24px; --fs-title: 13px; --fs-body: 13px; --fs-meta: 12px; --fs-legend: 11px; --fs-screen: 10px;
  /* map geometry: every size is a multiple of the pitch p */
  --p-overview: 20.5px;     /* min(20.5, (viewport − 2) / 17.4) */
  --p-zoom: 43px;           /* overview × 2.1 */
  --row-h: 1.3;  --label-w: .9; --aisle-w: .8; --divider-gap: .4;
  --seat-inset: .13 .1 .17; --seat-border: .09; --seat-radius-top: .3; --seat-radius-bottom: .12; --seat-num: .3;
  --max-seats: 8;
  --r-sheet: 22px; --r-pill: 999px; --tap: 44px;
  --out: cubic-bezier(.16,1,.3,1);
  --pop: cubic-bezier(.34,1.56,.64,1);
  --ease: cubic-bezier(.2,.7,.2,1);
  --d-zoom: 420ms;          /* rAF, ease-out quart */
  --d-pop: 360ms; --d-hint: 900ms; --hint-delay: 600ms; --d-fade: 200ms; --d-state: 140ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|
| Cinema mark | Monoton | 30px | 400 | 1 | 0.04em | upper |
| Total | JetBrains Mono | 24px | 700 | 1.2 | −0.02em | tabular |
| Film title | JetBrains Mono | 13px | 500 | 1.35 | 0 | title |
| Buttons | JetBrains Mono | 13–14px | 700 | 1 | 0 | sentence |
| Date line, chips, hint | JetBrains Mono | 12px | 400 | 1.35 | 0 | sentence |
| Legend, count | JetBrains Mono | 11px | 400 | 1.4 | 0 | sentence |
| Screen label | JetBrains Mono | 10px | 400 | 1 | 0.3em | upper |
| Row letters | JetBrains Mono | 0.46p | 500 | — | 0 | upper |
| Seat numbers (zoomed) | JetBrains Mono | 0.3p | 500 (700 selected) | — | 0 | numerals |

## Implementation notes

**1. One pitch drives everything.** Every length in the map is `calc(var(--p) * k)`, so content coordinates scale exactly by p_new / p_old and the anchor maths is one multiplication.

```css
.map { --p: 20.5px; display: grid; width: max-content;
  grid-template-columns: calc(var(--p)*.9) repeat(4, var(--p)) calc(var(--p)*.8)
    repeat(6, var(--p)) calc(var(--p)*.8) repeat(4, var(--p)) calc(var(--p)*.9);
  grid-auto-rows: calc(var(--p) * 1.3); }
.seat::before { inset: calc(var(--p)*.13) calc(var(--p)*.1) calc(var(--p)*.17);
  border: calc(var(--p)*.09) solid var(--avail);
  border-radius: calc(var(--p)*.3) calc(var(--p)*.3) calc(var(--p)*.12) calc(var(--p)*.12); }
.view { overflow: auto; display: grid; align-content: safe center; justify-content: safe center; }
```

**2. Zoom with the anchor held, frame by frame.** Animate p in rAF and set the scroll position each frame. Account for the centring margin while the map is still narrower than the viewport.

```js
const zoom = (to, ax, ay) => {        // ax, ay: anchor in map px at the current p
  const from = p, k0 = p, t0 = performance.now(), D = reduced ? 0 : 420;
  const step = (now) => {
    const t = D ? Math.min(1, (now - t0) / D) : 1, e = 1 - Math.pow(1 - t, 4);
    p = from + (to - from) * e; map.style.setProperty('--p', p + 'px');
    const k = p / k0, ml = Math.max(0, (vw - map.offsetWidth) / 2), mt = Math.max(0, (vh - map.offsetHeight) / 2);
    view.scrollLeft = ax * k + ml - vw / 2; view.scrollTop = ay * k + mt - vh / 2;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
```

**3. Best available, honestly scored.** Skip pairs that straddle an aisle, then take the lowest distance from the sweet spot.

```js
for (let r = 2; r < 8; r++) for (let n = 1; n < 14; n++) {
  if (n === 4 || n === 10) continue;               // 4|5 and 10|11 are aisles
  const a = ROWS[r] + n, b = ROWS[r] + (n + 1);
  if (taken.has(a) || taken.has(b)) continue;
  const s = Math.abs(r - 5.2) * 1.3 + Math.abs(n + .5 - 7.5);
  if (s < best) { best = s; pair = [a, b]; }
}
```

Common mistakes: zooming with `transform: scale` (the scroll area and hit targets stop matching what you see), using `pointer-events: none` on taken seats (screen readers then skip them, and users never learn a seat is taken), and counting a pan as a tap on release.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
