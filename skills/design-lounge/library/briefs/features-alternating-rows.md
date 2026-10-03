<!-- Design Lounge Nº 165 · "Alternating feature rows" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Alternating feature rows

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The features section of a marketing site for Ferrous, a fictional monitoring tool for CNC machine shops. A heavy condensed headline sits over a 2px black rule. Below it come three rows. Each row pairs a block of copy with a large product panel, and the panels swap sides: right, left, right. The panels are drawn in HTML and SVG like instrument screens: a vibration chart, a shift board of 12 machines, a tool-wear list. Safety orange appears only where a machine needs attention. Each panel slides 24px toward the centre and fades in the first time it enters the view. The detail worth copying: the orange is data, not decoration. The alert line, the machine in alarm and the worn tool are the only orange things on the page, apart from the small marks.

## Reference behaviour

1. Initial state at 1280 x 800: the header and all of row 1 are visible. The row 1 panel slides in from 24px to the right as the page loads.
2. Header: a mono eyebrow "Ferrous platform / 03 modules" with a 10px orange square, a 72px two-line uppercase headline "Your machines already know. / Now you will.", and a right-aligned mono note "Fig. 01–03 / Live data, Plant 4, Floor B". A 2px black rule closes the header.
3. Row 1, Spindle health: copy on the left (5 of 12 parts), panel on the right (7 of 12). The panel shows a 30-day vibration line that rises toward a dashed orange alert line at 4.5 mm/s, with one spike that crosses it, ringed in orange and tagged "+21 days warning". A 3-cell readout sits underneath: RMS now 2.8, Peak 24 h 4.9 (orange-brown), Bearing temp 41 °C.
4. Row 2, Shift board: panel on the left, copy on the right. A 4 x 3 grid of machine tiles: 8 running (white, black bar), 3 idle (grey), 1 in alarm (M-05, solid orange). The readout shows OEE 78.4%, Running 9 / 12, Alarms 1.
5. Row 3, Tool life: copy on the left, panel on the right. Eight tool rows (T01 to T08) with a wear bar, a thin black limit tick at 85%, and a percent. T07 at 92% has an orange bar and bold text. A white side readout says "T07 92%" in 76px type with "Ø10 drill. Swap at the end of this cycle, 6 min."
6. Scrolling down: when at least 25% of a panel is in view (with the bottom 40px of the viewport ignored), it slides from 24px to 0 and fades from 0 to 1 over 700ms on expo-out. Panels on the right come from the right. Panels on the left come from the left. Each plays once.
7. Each row has a text link in mono caps with a 2px orange underline. Hovering moves its arrow 4px right over 160ms.
8. Nothing else moves. There is no loop and no scroll-linked motion.
9. With reduced motion, every panel is fully visible from the start.
10. Without JavaScript, the panels are visible. The hidden start state applies only once a `js` class is on `<html>`.

## Structure

```
1280 wide, page scrolls, section padding 56 80 24
+--------------------------------------------------------------------------+
| [#] FERROUS PLATFORM / 03 MODULES                                         |
| YOUR MACHINES ALREADY KNOW.                                  FIG. 01–03  |  h2 72/.92
| NOW YOU WILL.                                  LIVE DATA, PLANT 4, FLOOR B |
|==========================================================================|  2px rule
| [01] SPINDLE HEALTH          | +-- SP-04 · VMC-2 ... ---- LAST 30 DAYS -+ |
| HEAR A BEARING FAIL          | | grid, dashed alert, line, spike, tag   | |  row 1
| THREE WEEKS EARLY.   44/.98  | +----------+-------------+---------------+ |  5fr / 7fr, gap 72
| copy 20px, 34ch              | | RMS 2.8  | PEAK 4.9    | TEMP 41 °C    | |  padding 56 0
| [v] [v] [v] checks           | +----------+-------------+---------------+ |
| READ THE SENSOR SPEC ->      |                                            |
|--------------------------------------------------------------------------|  1px rule
| +-- FLOOR B · SHIFT 2 ------ 14:20:06 -+ | [02] SHIFT BOARD               |
| | M-01 M-02 M-03 M-04                  | | ONE BOARD FOR EVERY ...        |  row 2 (flipped)
| | M-05 M-06 M-07 M-08   (M-05 orange)  | | copy, checks, link             |
| | M-09 M-10 M-11 M-12                  | |                                |
| | OEE 78.4% | RUNNING 9/12 | ALARMS 1  | |                                |
|--------------------------------------------------------------------------|
| [03] TOOL LIFE               | +-- MAGAZINE · HMC-1 ------ LIMIT 85% -+   |
| CHANGE TOOLS ON DATA ...     | | T01..T08 wear bars       | CHANGE NEXT|   |  row 3
| copy, checks, link           | | T07 orange               | T07 92%    |   |
+--------------------------------------------------------------------------+
```

- `<main class="sec">` holds one `header` and three `section`s.
- Header: a two-column grid, `minmax(0,1fr) auto`. Left is the eyebrow `p` and the `h2`. Right is the mono note `p`.
- Each row is a `section` with `aria-labelledby` pointing at its `h3`. It is a grid, `minmax(0,5fr) minmax(0,7fr)`, gap 72px, padding 56px 0, with a 1px `--line` rule under it (none under the last).
- Flipped row: the same markup order (copy, then panel). Set `order: 2` on the copy so the panel shows first. Keep the copy first in the DOM so reading order stays heading first.
- Copy block: eyebrow `div` (a boxed number and a label), `h3`, `p`, `ul.checks` with 3 `li`, `a.more`.
- Panel: a `figure` with an `aria-label` describing what it shows. Inside: a black title bar (live label with an orange square, then a muted right label), the body (SVG chart, tile grid, or tool list), and a readout strip of 3 cells where it applies.

## Tokens

```css
:root {
  /* colour */
  --bg: #e8e8e5;          /* light grey page */
  --panel: #f5f5f2;       /* panel body, number boxes */
  --ink: #111111;         /* text, rules, panel borders, title bars */
  --ink-2: #45453f;       /* body copy, eyebrow labels */
  --ink-3: #6b6b64;       /* readout labels, idle tiles */
  --line: #bdbdb6;        /* row rules, dashed tool dividers */
  --rule: #111111;        /* 2px header rule */
  --signal: #ff5b1a;      /* safety orange: alerts, marks, underlines */
  --signal-ink: #a83300;  /* orange used as text on light grounds */
  --focus: #ff5b1a;

  /* type */
  --cond: "Barlow Condensed", "Arial Narrow", sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;
  --fs-h2: 72px;
  --fs-h3: 44px;
  --fs-body: 20px;
  --fs-check: 18px;
  --fs-mono: 12px;
  --fs-readout: 20px;

  /* space (8px base) */
  --s-1: 8px; --s-2: 16px; --s-3: 24px; --s-4: 32px; --s-5: 48px; --s-6: 56px; --s-7: 72px; --s-8: 80px;

  /* shape */
  --r: 2px;  /* everything: panels, tiles, number boxes, check squares */

  /* motion */
  --expo: cubic-bezier(.16,1,.3,1);
  --ease: cubic-bezier(.2,.7,.2,1);
  --t-reveal: 700ms;
  --t-micro: 160ms;
  --reveal-shift: 24px;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Eyebrow, labels, notes | JetBrains Mono | 12px | 500 | 1.4 | 0.06em | upper |
| Section headline `h2` | Barlow Condensed | 72px | 700 | 0.92 | -0.01em | upper |
| Row number box | JetBrains Mono | 12px | 700 | 1 | 0.06em | 01 02 03 |
| Row heading `h3` | Barlow Condensed | 44px | 700 | 0.98 | -0.005em | upper |
| Body | Barlow Condensed | 20px | 500 | 1.4 | 0 | sentence |
| Check item | Barlow Condensed | 18px | 600 | 1.4 | 0 | sentence |
| Text link | JetBrains Mono | 13px | 700 | 1 | 0.06em | upper |
| Panel bar | JetBrains Mono | 12px | 500 | 1 | 0.06em | upper |
| Readout label | JetBrains Mono | 11px | 500 | 1.4 | 0.06em | upper |
| Readout value | JetBrains Mono | 20px | 700 | 1.2 | -0.02em | numerals |
| Tile and tool text | JetBrains Mono | 11-12px | 500, 700 for ids | 1.3 | 0 | as typed |
| Tool readout | Barlow Condensed | 76px, % at 32px | 700 | 0.85 | -0.02em | upper |

- Cap body copy at 34ch so it runs to 2 or 3 lines.
- Headings are uppercase condensed. Mono is for anything a machine would print: ids, labels, units, links.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Right-side panel | 25% in view, once | opacity, translateX | 0, 24px → 1, 0 | 700ms | expo-out |
| Left-side panel | 25% in view, once | opacity, translateX | 0, -24px → 1, 0 | 700ms | expo-out |
| Panel, stacked layout | 25% in view, once | opacity, translateY | 0, 24px → 1, 0 | 700ms | expo-out |
| Link arrow | hover | translateX | 0 → 4px | 160ms | standard |

- IntersectionObserver options: `threshold: 0.25`, `rootMargin: "0px 0px -40px 0px"`. Unobserve after the first reveal.
- No stagger between rows. Each row reveals on its own when it arrives.
- The copy does not animate. Only the panel moves, so the text is readable the moment it scrolls in.
- Reduced motion: panels at opacity 1, no transform, no transition. The arrow does not move.
- If IntersectionObserver is missing, add the visible class to every panel at once.

## States

- Link rest: ink text, 2px `--signal` bottom border, min-height 40px. Hover: arrow moves 4px right.
- Focus-visible: 2px `--focus` outline, 3px offset, on links and any focusable element.
- Machine tile run: white fill, 1px ink border, black usage bar.
- Machine tile idle: `--panel` fill, `--line` border, `--ink-3` text and bar.
- Machine tile alarm: `--signal` fill and border, ink text, a 20% ink track.
- Tool row over limit (above 85%): bold text, `--signal` bar.
- Hot readout cell (Peak 24 h, Alarms): value in `--signal-ink`.
- Loading, empty and error do not apply. These panels are illustrations with fixed data.

## Accessibility

- One `h2` for the section and one `h3` per row. Each row `section` has `aria-labelledby` set to its `h3`.
- Each panel is a `figure` with an `aria-label` that says what the picture shows, for example "Shift board with 12 machines, one in alarm". The SVG inside is `aria-hidden`.
- Check marks are drawn with CSS pseudo-elements, so they are not read. The list item text carries the meaning.
- The orange square marks and number boxes are decorative.
- Contrast: `#45453f` on `#e8e8e5` is about 8:1. `#111111` on `#ff5b1a` is about 6.6:1, so alarm tile text stays black. Do not set small text in `#ff5b1a` on grey. Use `#a83300` for orange text.
- Links have a 40px minimum height.
- Reading order matches the DOM in flipped rows: heading, copy, panel. Only the visual order flips.

## Responsive rules

- ≥1280: as drawn. Section padding 56px 80px. Rows split 5 to 7 with a 72px gap.
- 1024: section padding 48px. Row gap 48px. Headline 60px, row headings 38px.
- 768: rows go to one column with a 32px gap and 48px padding. Copy is always on top and the panel always below, including the flipped row. Panels slide up 24px instead of sideways. The header goes to one column with the note left-aligned.
- <640: section padding 32px 20px. Headline 44px, row headings 34px, body 18px. Hide the header note. The shift board becomes 3 columns and shows 9 tiles. The tool readout moves under the tool list. The panel bar hides its right label. Readout values drop to 16px.
- At every size the page never scrolls sideways. All grids use `minmax(0, …)` tracks, and SVGs are `width: 100%; height: auto`.

## Acceptance checklist

### Always

- [ ] Exactly three rows. Each has a boxed number, an uppercase heading, a short paragraph, three checks and one text link.
- [ ] Panels alternate: right, left, right. In the DOM the copy comes first in every row.
- [ ] Each panel is a drawn product screen with a black title bar, not an image.
- [ ] Panels reveal once at 25% visibility: 24px slide toward the centre plus a fade, 700ms expo-out.
- [ ] The copy never animates.
- [ ] One accent colour, used only for alerts, marks and link underlines.
- [ ] Every radius is 2px.
- [ ] Reduced motion and no-JS both show every panel.
- [ ] Focus rings are visible on the links.
- [ ] Below 820px, rows stack with the panel under the copy. No horizontal scroll at 390px.

### This demo

- [ ] The brand is Ferrous. The headline reads "Your machines already know. Now you will."
- [ ] Row headings: "Hear a bearing fail three weeks early.", "One board for every machine on the floor.", "Change tools on data, not on a calendar."
- [ ] The vibration chart has a dashed alert at 4.5 mm/s and a spike tagged "+21 days warning".
- [ ] The shift board shows M-01 to M-12 with M-05 in alarm, OEE 78.4%, Running 9 / 12.
- [ ] The tool list shows T01 to T08 with a limit tick at 85%, and T07 at 92% in `#ff5b1a`.
- [ ] Page `#e8e8e5`, ink `#111111`, accent `#ff5b1a`.

## Implementation notes

**Reveal with a no-JS guard.** Hide panels only once JS has run, then let one observer add `.in`.

```html
<script>document.documentElement.classList.add('js')</script>
```

```css
.js .ill { opacity: 0; transform: translateX(24px);
           transition: opacity 700ms var(--expo), transform 700ms var(--expo); }
.js .flip .ill { transform: translateX(-24px); }
.js .ill.in { opacity: 1; transform: none; }
@media (max-width: 820px) { .js .ill, .js .flip .ill { transform: translateY(24px); } }
@media (prefers-reduced-motion: reduce) {
  .js .ill, .js .flip .ill { opacity: 1; transform: none; transition: none; }
}
```

```js
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .25, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.ill').forEach(el => io.observe(el));
```

**Flip without reordering the DOM.**

```css
.row { display: grid; grid-template-columns: minmax(0,5fr) minmax(0,7fr); gap: 72px; align-items: center; }
.row.flip { grid-template-columns: minmax(0,7fr) minmax(0,5fr); }
.row.flip .txt { order: 2; }
@media (max-width: 820px) {
  .row, .row.flip { grid-template-columns: minmax(0,1fr); }
  .row.flip .txt { order: 0; }
}
```

The demo keeps 5fr / 7fr on the flipped row too, so the panel sits in the narrower column there. Either works. Pick one and keep it for all flipped rows.

**Check marks with no image.** A black 18px square and a rotated L-shaped border.

```css
.checks li { position: relative; padding-left: 30px; }
.checks li::before { content: ""; position: absolute; left: 0; top: 50%; width: 18px; height: 18px;
  margin-top: -9px; background: var(--ink); border-radius: 2px; }
.checks li::after { content: ""; position: absolute; left: 6px; top: 50%; width: 5px; height: 9px;
  margin-top: -7px; border: solid var(--signal); border-width: 0 2px 2px 0; transform: rotate(45deg); }
```

Common mistakes:

- Swapping DOM order for flipped rows. Screen readers then hit the picture before the heading.
- Animating the text. Readers scroll to read, and moving text delays that.
- Orange headings, orange buttons or an orange background band. Orange marks trouble. If everything is orange, nothing is.
- Rounded cards with soft shadows. This is a 2px, hairline, black-border language.
- Re-triggering the reveal every time a panel leaves and comes back. Unobserve after the first run.
- Revealing at `threshold: 0`, which fires while the panel is still a sliver under the fold, so the motion is never seen.
- Real machine-maker names in panel copy. Keep ids generic: SP-04, VMC-2, HMC-1, M-05, T07.
- A chart that already sits above the alert line everywhere. Only the spike crosses it, so the warning reads.

Rebuild order:

1. Section padding, header grid, eyebrow, headline and the 2px rule.
2. Row grid with the flip rule. Fill in copy, checks and links for all three rows.
3. Panel frame: border, black title bar, readout strip.
4. Panel 1: SVG grid, dashed alert, waveform path, spike ring and tag.
5. Panel 2: 12 machine tiles with run, idle and alarm states.
6. Panel 3: tool list with limit ticks and the side readout.
7. The `js` class, the hidden start state, and the observer.
8. Breakpoints at 1100, 820 and 640.
9. The reduced-motion block. Then scroll the page once at 1280 and once at 390.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
