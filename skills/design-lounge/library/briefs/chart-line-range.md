<!-- Design Lounge Nº 278 · "Quarter line chart" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Quarter line chart

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. The line stays one series.

## What it is

A quarter line chart for yard tonnage. The page is warm paper. The answer is the number, set in mono at 56px: 186 t, the week of 28 Sep. A 12px label above it says what the number is. A 14px line under it names the week and the range. The chart sits in a white card under that number. One green stroke, twelve dots, an axis of 240 / 120 / 0. No area fill, no legend, no second series, no imported chart theme. The line is evidence for the number. It is not a second headline. This sits under a single metric on an ops home, or on its own when the question is how the quarter moved.

## Reference behaviour

1. The first frame shows 186 t. The subtitle is "Week of 28 Sep · 13 Jul – 28 Sep". The last dot is pressed.
2. Pointer enter or click on a dot selects that week. The number becomes "{n} t". The subtitle becomes "Week of {date} · 13 Jul – 28 Sep".
3. Only one dot is pressed. The others return to a hollow ring.
4. The matching date label under the plot turns ink and weight 600. The other labels stay muted.
5. The stroke draws once on load, 700ms, `cubic-bezier(0.2, 0.7, 0.2, 1)`, from empty to full.
6. Reduced motion: the draw is removed. The stroke is complete. Selection still works.
7. Leaving the plot keeps the last selected week. There is no mouseleave reset.
8. The axis and the date labels are `aria-hidden`. Each dot button has an accessible name: "Week of {date}, {n} tonnes".
9. There is no floating tooltip. The 56px number is the value.
10. Focus ring is 2px `--focus`, offset 2px.

## Structure

```
padding 48px 64px
label                          12px
186 t                          56px mono
Week of 28 Sep · 13 Jul – 28 Sep
card, max-width 880, radius 2, pad 20 16 12
  axis 40px | plot
    stage height 220, margin 0 12px
      svg line, viewBox 0 0 1100 220
      12 buttons, 32px, centered on each point
    12 date labels, 11px, under the stage
```

- Page background is the paper. The card is the only surface.
- The number is an `h1`. The label is a paragraph, not a second heading.
- The plot is a grid: 40px axis, then the stage.
- The svg is `preserveAspectRatio="none"` so the stroke stretches with the card. Dots are HTML buttons, not svg circles, so they stay round.
- Date labels are a flex row. Each label is `flex: 1` and centered.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --ink-3: #8a847a;
  --line: #e4dfd4;
  --primary: #1f4d3a;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
}
```

Map these onto the locked theme when a kit is on. The stroke uses `--primary`. Do not introduce a blue series.

## Typography

| Role | Family | Size | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Label | sans | 12px | 500 | 0.04em | `--ink-2` |
| Answer | mono | 56px | 500 | -0.04em | `--ink` |
| Subtitle | sans | 14px | 400 | 0 | `--ink-2` |
| Axis | mono | 11px | 400 | 0 | `--ink-3` |
| Date | sans | 11px | 400, 600 if selected | 0 | `--ink-3`, `--ink` if selected |

Line-height of the answer is 1. The subtitle line-height is 1.45.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Stroke | load | stroke-dashoffset | 1 → 0, pathLength 1 | 700ms | `--ease` | offset 0, no animation |
| Dot | select | size and fill | 8px hollow → 11px solid | none | — | same |

The stroke does not loop. Dots do not bounce.

## States

- Resting dot: 8px, surface fill, 1.5px `--primary` ring.
- Pressed dot: 11px, `--primary` fill. One pressed at a time.
- Hover selects, the same as click.
- Selected date label: `--ink`, weight 600.
- Focus-visible: 2px outline, 2px offset, on the 32px button.
- Disabled: none. Every week is selectable.
- Empty and error: this piece is the populated chart. A missing series uses the failed-load piece, not a blank card with this chart still drawn.

## Accessibility

- The number is the `h1`. Updating it on selection is enough. Do not add a second live region that repeats it.
- The group of buttons is `role="group"` with `aria-label="Weekly tonnage"`.
- Each button's name includes the week and the tonnes. `aria-pressed` is true on the selected week only.
- Axis and date labels are `aria-hidden` because the buttons already speak the date.
- Tab order is the twelve weeks, left to right.
- Contrast: `#161513` on `#f6f4ef` and `#1f4d3a` on `#ffffff` both clear 4.5.
- Hit target is 32px on this web chart. Do not shrink the dot's button to the 8px ring.

## Responsive rules

- At 1280 the card is 880px max. The page padding is 48px 64px.
- At 1024, keep the number at 56px. Let the card fill the content width. Date labels stay 11px and do not rotate.
- At 768, page padding becomes 24px. The number may drop to 44px. The chart height stays 220px.
- Below 640, this chart is the wrong piece. Use the weekly bar chart with seven days, or move the number to the phone metric. Do not squeeze twelve labels into 360px.

## Acceptance checklist

- [ ] First frame reads 186 t and "Week of 28 Sep · 13 Jul – 28 Sep".
- [ ] The number is 56px mono. The label above it is 12px.
- [ ] One stroke, colour `#1f4d3a`, width 2. No area fill.
- [ ] Twelve points match the table in Implementation notes.
- [ ] The last dot starts pressed and filled.
- [ ] Clicking 21 Sep sets the number to 201 t and the subtitle to "Week of 21 Sep · 13 Jul – 28 Sep".
- [ ] Only one `aria-pressed="true"`.
- [ ] Axis reads 240, 120, 0 and is hidden from assistive tech.
- [ ] No legend, no tooltip, no second series.
- [ ] The stroke draws once. Reduced motion shows the full stroke immediately.
- [ ] Dots stay circles when the card width changes.
- [ ] Card radius is 2px. Max width 880px.

## Implementation notes

Point table. x is the viewBox coordinate (0 to 1100). y is the viewBox coordinate in a 220-tall box, with 240 t at the top pad and 0 at the baseline. Top percent is y / 220. Left percent is x / 1100.

| Week | Tonnes | x | y | left | top |
| --- | --- | --- | --- | --- | --- |
| 13 Jul | 142 | 0 | 92 | 0% | 41.8% |
| 20 Jul | 156 | 100 | 80.6 | 9.09% | 36.6% |
| 27 Jul | 149 | 200 | 86.3 | 18.18% | 39.2% |
| 3 Aug | 168 | 300 | 70.8 | 27.27% | 32.2% |
| 10 Aug | 174 | 400 | 65.9 | 36.36% | 30% |
| 17 Aug | 161 | 500 | 76.5 | 45.45% | 34.8% |
| 24 Aug | 188 | 600 | 54.5 | 54.55% | 24.8% |
| 31 Aug | 176 | 700 | 64.3 | 63.64% | 29.2% |
| 7 Sep | 192 | 800 | 51.2 | 72.73% | 23.3% |
| 14 Sep | 184 | 900 | 57.7 | 81.82% | 26.2% |
| 21 Sep | 201 | 1000 | 43.9 | 90.91% | 20% |
| 28 Sep | 186 | 1100 | 56.1 | 100% | 25.5% |

Scale: y = 12 + (1 − tonnes / 240) × 196. Do not recompute a prettier scale. 240 is the axis top, not the max value. The peak is 201, and it does not touch the top.

```css
.line {
  fill: none;
  stroke: var(--primary);
  stroke-width: 2;
  path-length: 1;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw 700ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
}
.stage button {
  position: absolute;
  width: 32px;
  height: 32px;
  transform: translate(-50%, -50%);
}
```

Set `pathLength="1"` on the polyline as an attribute. `preserveAspectRatio="none"` on the svg. Buttons use the left and top percents above.

Common mistakes:

- A Chart.js or Recharts default palette.
- A filled area under the line.
- A second line for last quarter.
- A legend.
- A tooltip that floats over the stroke.
- Putting the dots inside the stretched svg, which turns them into ovals.
- Making the chart title larger than the number.
- Starting on the peak (201) instead of the latest week (186).
- Rotating the date labels.
- Drawing the stroke in a loop.
- Using the weekly bar chart as a substitute. Bars answer which day. This answers how the quarter moved, with the current week as the number.

Where it sits in a product:

1. The number is the answer. The line is the evidence. Do not give the chart its own display heading.
2. Place it under `kpi-delta` when the home leads with today's count, and this chart answers the quarter.
3. Do not put it beside a second chart of the same series.
4. The range in the subtitle is fixed. Do not add a date picker to this piece.
5. Selection survives hover. Leaving the plot keeps the last week.
6. The card does not scroll. Twelve weeks fit at 880px.
7. Gridlines are omitted. The three axis numbers are enough.
8. Saturday and Sunday are not in this chart. The unit is the week.
9. If the product is a phone, do not ship this twelve-week line. Ship the number and a shorter chart.
10. A failed fetch does not render an empty stroke. Use the failed-load piece.
11. The label, the number, and the subtitle are outside the card.
12. One accent. The stroke and the pressed dot share it.

Rebuild order:

1. Set the page paper and the type faces.
2. Place the label, the 56px number, and the subtitle.
3. Place the card and the axis.
4. Draw the polyline with the twelve points.
5. Position the twelve buttons with the percents in the table.
6. Add the date row and mark 28 Sep selected.
7. Wire click and mouseenter to rewrite the number and the subtitle.
8. Add the one-shot draw, and the reduced-motion override.
9. Name each button for assistive tech.
10. Check that dots stay circles at a narrower card.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
