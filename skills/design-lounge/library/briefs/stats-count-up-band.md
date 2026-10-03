<!-- Design Lounge Nº 418 · "Stats count-up band" · designlounge.vercel.app -->

# Stats count-up band

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A stats section for **Halyard**, an edge hosting company that publishes the same four numbers every quarter. The band is deep green `#0F2A22`. Four figures in cream Fraunces at 96px sit in equal columns split by 1px hairlines: 2.4M deploys, 99.98% uptime, 38 ms median response, 140 edge cities. When the band scrolls into view, every figure counts up from zero once, over 1200ms, with a cubic ease-out and tabular numerals so nothing shifts. A small sparkline or bar chart under each figure draws in at the same time. One copper `#D08452` accent marks the units and the last point of each chart.

The feeling is an annual report, not a dashboard. The detail worth copying is the quiet split of roles: serif for the numbers, mono for every label, and copper only where the eye should land.

## Reference behaviour

1. First frame: kicker "HALYARD · EDGE HOSTING · YEAR TO DATE 2026" in 12px mono, "Halyard" in copper. Headline "Four numbers we / publish every quarter" in 56px Fraunces 300, "every quarter" in italic. On the right, a 14px mono intro and a "Replay count" pill button.
2. The band is in view on load, so the count starts at once. Each figure starts at 0 with the same decimals as its target: "0.0", "0.00", "0", "0".
3. Over 1200ms, all four figures rise on one shared clock with `1 - (1 - p)^3`. They land on "2.4", "99.98", "38", "140" at the same moment.
4. Numbers are formatted with `toLocaleString('en-US')` and a fixed number of decimals, so any value of 1,000 or more gets commas.
5. Units sit beside the number: "M" and "%" as 56px Fraunces in copper, "ms" as 15px mono in copper. "140" has no unit.
6. The charts draw on the same trigger. Lines (deploys rising, latency falling) draw with `stroke-dashoffset` over 900ms. Their copper end dot fades in after the line ends. Bars (uptime by month, cities by month) grow from the baseline over 600ms, staggered 40ms per bar.
7. Each column has its own start delay for the chart: 0, 90, 180, 270ms. The numbers do not use this delay.
8. The count runs once. Scrolling away and back does not run it again. The observer disconnects after the first hit.
9. Click "Replay count": the figures snap to zero, the charts reset, and the whole run plays again.
10. Reduced motion: the figures show their final values at once, the charts show fully drawn, Replay sets the final values again with no count.
11. Screen readers hear the final value of each figure in words ("2.4 million", "99.98 percent", "38 milliseconds", "140 cities"), never the counting digits.
12. Under the band, a source line in 11.5px mono: "* Source: Halyard status ledger, 1 Jan to 30 Sep 2026. Uptime is measured per region and averaged by traffic. Latency is p50 over 1,284,000,000 sampled requests. Figures checked by Morrow & Pike LLP on 2 Oct 2026." On the right: "Next reading: 6 Jan 2027".

## Structure

```
1280 x 800, padding 64 64 48, rows auto / 1fr / auto, gap 48
+----------------------------------------------------------------------+
| HALYARD · EDGE HOSTING · YEAR TO DATE 2026     We print the same four|
| Four numbers we                                readings each quarter |
| publish every quarter (56px serif)             ( Replay count )      |
|----------------------------------------------------------------------| 1px
| DEPLOYS SHIPPED 01 | UPTIME          02 | MEDIAN RESP.  03 | EDGE  04|
|                    |                    |                  |         |
| 2.4M   (96px)      | 99.98%             | 38ms             | 140     |
| Production deploys | Trailing 12 months | p50 time to ...  | Points..|
| ___/~~~~*          | | | | | ' | | | |  | ~~~\___*         | ...|||| |
|----------------------------------------------------------------------| 1px
| * Source: Halyard status ledger ...               Next reading: ...  |
+----------------------------------------------------------------------+
head columns 1.3fr / 1fr, gap 48. stats: repeat(4, minmax(0,1fr)).
column padding 32 28 30; first column no left pad, last no right pad.
```

- The band is a `section` named by the `h2`.
- The head is a 2-column grid. Left: kicker `p` and `h2`. Right: intro `p` and the Replay `button`.
- The stats are a `ul` with four `li.stat`. Each `li` has a 4-row grid: label, figure, description, chart.
- The label is a `span` with the name and a faint index ("01" to "04") pushed right.
- The figure is a `p.fig`. Inside: a visually hidden `span` with the final value in words, then an `aria-hidden` span with the counting `.num` and the unit `small`.
- The description is a `p`, max 26ch.
- The chart is an inline `svg` 200 by 36, `aria-hidden="true"`. Lines use one `path` with `pathLength="1"` and one end `circle`. Bars are `rect`s on a 1px baseline.
- The footnote is a `div` with two `p`s.

## Tokens

```css
:root {
  /* colour */
  --bg: #0f2a22;                    /* deep green band */
  --cream: #f2e8d5;                 /* figures, headline */
  --cream-2: #c9c2ae;               /* descriptions, chart strokes, intro */
  --cream-3: #93a395;               /* labels, footnote, kicker */
  --line: rgba(242, 232, 213, .16); /* hairlines */
  --copper: #d08452;                /* units, end dots, hot bars, kicker brand */
  --focus: #d08452;

  /* type */
  --serif: "Fraunces", Georgia, serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --fs-figure: clamp(60px, 7.3vw, 96px);
  --fs-unit-big: .58em;      /* of the figure */
  --fs-unit-small: 15px;
  --fs-h2: 56px;
  --fs-intro: 14px;
  --fs-desc: 13px;
  --fs-label: 11.5px;

  /* space */
  --pad: 64px;
  --gap: 48px;
  --col-pad: 32px 28px 30px;
  --chart-w: 200px;
  --chart-h: 36px;

  /* motion */
  --count: 1200ms;
  --draw: 900ms;
  --bar: 600ms;
  --col-stagger: 90ms;
  --bar-stagger: 40ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Kicker | IBM Plex Mono | 12px | 400 | 1.5 | 0.14em | upper, `--cream-3`, brand copper |
| Headline | Fraunces | 56px | 300 | 1.02 | -0.02em | opsz 144, italic phrase in `--cream-2` |
| Intro | IBM Plex Mono | 14px | 400 | 1.65 | 0 | `--cream-2`, max 42ch |
| Label | IBM Plex Mono | 11.5px | 400 | 1.5 | 0.12em | upper, `--cream-3` |
| Figure | Fraunces | clamp(60px, 7.3vw, 96px) | 300 | 1 | -0.035em | opsz 144, `tabular-nums lining-nums`, nowrap |
| Big unit (M, %) | Fraunces | 0.58em of the figure | 300 | 1 | -0.02em | copper, baseline |
| Small unit (ms) | IBM Plex Mono | 15px | 400 | 1 | 0.04em | copper, raised 0.25em |
| Description | IBM Plex Mono | 13px | 400 | 1.5 | 0 | `--cream-2`, max 26ch |
| Footnote | IBM Plex Mono | 11.5px | 400 | 1.6 | 0 | `--cream-3`, asterisk copper |
| Replay | IBM Plex Mono | 12px | 500 | 1 | 0.08em | upper |

Load Fraunces with the `opsz` axis (9..144) at 300 and 400, and IBM Plex Mono at 400 and 500, from one Google Fonts link.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Delay | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Figures | band 35% in view, once | text value | 0 → target | 1200ms | 1-(1-p)^3 in JS | none, shared clock | final value at once |
| Line chart | same | stroke-dashoffset | 1 → 0 (pathLength 1) | 900ms | --ease | 0/90/180/270ms per column | drawn |
| End dot | same | opacity | 0 → 1 | 200ms | --ease | column delay + 900ms | shown |
| Bars | same | scaleY from bottom | 0 → 1 | 600ms | --expo | column delay + 40ms per bar | full |
| Replay hover | hover | colour, border | cream-2 → cream | 160ms | --ease | 0 | 1ms |

Use `requestAnimationFrame` for the count. Do not use `setInterval`.

## States

- Before the run: figures show their final values in the HTML, so the page reads right with no script.
- Running: figures count, charts draw. The Replay button stays enabled; a click cancels the current frame loop and starts again from zero.
- Done: final values, charts fully drawn, copper end dots shown.
- Replay hover: text `--cream`, border `--cream-3`.
- Replay focus-visible: 2px copper outline, offset 3px.
- Hot bar: the bar that matters gets copper fill. In uptime it is June, the month with the dip. In cities it is September, the latest month.
- No error or empty state. If a value is missing, drop the column; do not show a zero.

## Accessibility

- The section is named by the `h2`.
- Each figure has a visually hidden final value in words, and the counting digits are `aria-hidden="true"`. A screen reader never hears "37, 38".
- Charts are `aria-hidden="true"`. The description line carries the meaning in words.
- The list is a `ul` so readers announce "list, 4 items".
- Replay is a real `button` with a visible label.
- Contrast: `#f2e8d5` on `#0f2a22` is about 13:1. `#c9c2ae` is about 9:1. `#93a395` is about 5.6:1. `#d08452` is about 5.2:1, used for units and dots, not body text.
- Tabular numerals keep each digit the same width, so the figure does not shake while it counts.
- Do not autoplay the count again on scroll. Once is enough.

## Responsive rules

- ≥1280: as drawn. Padding 64px 64px 48px. Four columns. Figures about 93px from the clamp, capped at 96px. Headline 56px.
- 1024: figures about 75px from the clamp, so "99.98%" fits a 196px column. Below 1024: padding 48px 40px 40px, headline 46px, column padding 28px 20px.
- 768: the head stacks, gap 20px. The stats become 2 by 2. The second row gets a 1px top hairline. Odd columns lose their left border and left padding. The footnote stacks.
- <640: padding 40px 20px 32px. Headline 38px. One column. Each stat is 24px top and bottom with a 1px hairline between. Figures 68px. Charts stay 200px wide, left-aligned.
- The figure never wraps (`white-space: nowrap`), so its size must fit the column. Do not set a fixed 96px. At 390 wide, "99.98%" at 68px fits inside 350px.
- All grid tracks use `minmax(0, 1fr)`. No horizontal scroll at any width.

## Acceptance checklist

### Always

- [ ] Four stats in equal columns separated by 1px hairlines, with hairlines above and below the row.
- [ ] Each stat has a mono label, a serif figure, a one-line description, and a small chart.
- [ ] Figures count up once when the band is at least 35% visible, over 1200ms, with a cubic ease-out.
- [ ] Figures use tabular numerals and keep their decimal count while counting.
- [ ] Values of 1,000 or more get commas.
- [ ] Charts draw on the same trigger, with a 90ms stagger between columns.
- [ ] Final values are in the HTML before the script runs.
- [ ] Screen readers get the final value in words, not the counting digits.
- [ ] A Replay control replays the count.
- [ ] Reduced motion shows final numbers and drawn charts at once.
- [ ] A source footnote under the band.
- [ ] No horizontal scroll at 390.

### This demo

- [ ] Background `#0F2A22`, figures `#F2E8D5`, accent `#D08452`.
- [ ] Figures 2.4M, 99.98%, 38 ms, 140, with labels Deploys shipped, Uptime, Median response, Edge cities.
- [ ] Headline "Four numbers we / publish every quarter" with the italic phrase.
- [ ] Footnote cites "Halyard status ledger, 1 Jan to 30 Sep 2026" and "Next reading: 6 Jan 2027".

## Implementation notes

**The count.** One clock for all four figures. Read the target and decimals from data attributes. Format every frame.

```js
const fmt = (v, d) => v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const ease = p => 1 - Math.pow(1 - p, 3);
function run() {
  cancelAnimationFrame(raf);
  if (reduce) return finish();
  band.classList.remove('run');
  nums.forEach(n => n.textContent = fmt(0, +n.dataset.dec));
  void band.offsetWidth;            // restart the CSS chart transitions
  band.classList.add('run');
  const t0 = performance.now();
  const tick = now => {
    const p = Math.min(1, (now - t0) / 1200);
    nums.forEach(n => n.textContent = fmt(+n.dataset.to * ease(p), +n.dataset.dec));
    if (p < 1) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
}
```

**Run once on view.**

```js
const io = new IntersectionObserver(entries => {
  if (entries.some(e => e.isIntersecting)) { io.disconnect(); run(); }
}, { threshold: .35 });
io.observe(band);
```

**Charts that draw.** Give the line `pathLength="1"` so the dash maths is the same for every path. Bars scale from their own bottom edge.

```css
.spark .ln  { stroke-dasharray: 1; stroke-dashoffset: 1;
              transition: stroke-dashoffset 900ms var(--ease) var(--d, 0ms); }
.spark .bar { transform: scaleY(0); transform-origin: center bottom; transform-box: fill-box;
              transition: transform 600ms var(--expo) calc(var(--d, 0ms) + var(--i, 0) * 40ms); }
.run .spark .ln  { stroke-dashoffset: 0; }
.run .spark .bar { transform: scaleY(1); }
```

Set `--d` on each `li` (0, 90, 180, 270ms) and `--i` on each bar.

**Bars that show a small change.** Uptime values sit between 99.86 and 100. Scale each bar from a floor, not from zero, or every bar looks the same height.

```js
const h = Math.max(2, (v - floor) / (max - floor) * 30);
```

Common mistakes:

- Proportional numerals. The figure shakes as digits change width.
- A fixed 96px figure with `nowrap`. At 1024 wide "99.98%" runs into the next column.
- Counting "2.4M" as an integer from 0 to 2,400,000 and then swapping to "2.4M". Count the shown value with one decimal.
- Running the count again on every scroll into view.
- Leaving the HTML at zero. With no script or reduced motion the page then shows zeros.
- Letting screen readers hear every counting frame. Hide the digits and give the final value in words.
- Copper on everything. It is for units, end dots, and one hot bar per chart.
- Sans-serif figures. The serif numerals are the editorial voice of this piece.
- Drop shadows or card boxes around each stat. Hairlines only.
- Charts with axes and tooltips. They are 36px marks, not data views.
- `transform-box` left off the bars, so they scale from the top of the SVG.

Where it sits:

1. It sits between the hero and the features on a company or trust page.
2. For a louder newsroom version with a condensed face, use `stats-ticker-band`.
3. For one big number that rolls digit by digit, use `odometer-counter`.
4. If a kit is locked, map `--bg` to the darkest kit surface and `--copper` to the kit accent.

Rebuild order:

1. Paint the green band and set the 3-row grid.
2. Set the head: kicker, headline, intro, Replay.
3. Build the four-column list with hairlines.
4. Write the final values in the HTML with the hidden word versions.
5. Add the charts with `pathLength="1"` and the bars with a floor.
6. Add the count and the observer.
7. Add Replay and reduced motion.
8. Add the footnote.
9. Add the 1024, 768, and phone steps and check 390 wide.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
