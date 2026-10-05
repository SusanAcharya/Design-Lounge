<!-- Design Lounge Nº 475 · "Weekly bar chart" · www.designlounge.live -->

# Weekly bar chart

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. The bars stay one series.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A weekly bar chart for yard runs. The page is warm paper. A title and a date range sit above a white card, max width 880px. Inside, a quiet axis (60, 30, 0) and seven bars for Monday through Sunday. Resting bars are warm gray. The selected bar, and the bar under the pointer, is the primary green. A mono line under the chart reads the day and the count. Wednesday starts selected: 51 runs. There is no legend, no grid of colours, and no imported chart theme. This is the chart an ops home uses beside a KPI row. It is not a marketing graphic.

## Structure

```
padding 48px 64px
h1 + date line
card, max-width 880, radius 2
plot: 36px axis | seven buttons
readout
```

- Each day is a `button` inside a group labelled "Runs by day".
- The bar is an `i` with a percentage height. The scale is 60 runs = 100 percent of the plot.

## Motion

| Trigger | Property | From | To | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Load | transform scaleY | 0 | 1 | 420ms | cubic-bezier(0.2, 0.7, 0.2, 1) |

Reduced motion sets `animation: none`. Selection does not animate colour.

## States

- Bar resting: `#d9d3c7`.
- Bar hovered or pressed: `#1f4d3a`.
- One pressed day.
- Readout matches the pressed or hovered day.

## Accessibility

- Days are buttons, not a canvas.
- The group has an accessible name.
- The readout is text, so colour is not the only way to read the value.
- Contrast of `#161513` on `#ffffff` is above 4.5. `#1f4d3a` is a fill, not small text.
- Hit area is the full column, not only the painted bar.

## Responsive rules

- At 1280 the card is 880px and the plot is 280px tall.
- At 768 the page padding becomes 24px and the day gap becomes 8px.
- Below 640 the axis stays, and day labels remain one line. Do not rotate them.

## Acceptance checklist

- [ ] Seven days, Monday to Sunday.
- [ ] Counts are 42, 38, 51, 29, 46, 18, 12.
- [ ] Scale is 60 at the top.
- [ ] Wednesday starts selected.
- [ ] Readout is mono and names the day and the count.
- [ ] Resting bars are one gray. Selected is one green.
- [ ] Bars rise once. Reduced motion skips the rise.
- [ ] No legend, no second series, no pie.
- [ ] Card radius is 2px.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Wednesday starts with `aria-pressed="true"`. The readout is "Wednesday · 51 runs".
2. Pointer enter or click on a day selects it and rewrites the readout as "{Day} · {n} runs".
3. Only one day is pressed. The others return to gray.
4. Bars rise from the baseline on load, 420ms, `cubic-bezier(0.2, 0.7, 0.2, 1)`, `transform-origin: bottom`.
5. Reduced motion: the rise animation is removed. Bars render at full height. Selection still works.
6. The axis is `aria-hidden`. The buttons carry the day and the count.
7. Focus ring is 2px `--focus`, offset 2px.
8. Do not add a tooltip that floats over the bar. The readout is the value.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --ink-3: #8a847a;
  --line: #e4dfd4;
  --bar: #d9d3c7;
  --primary: #1f4d3a;
  --focus: #1f4d3a;
  --font-text: "IBM Plex Sans", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  --radius: 2px;
}
```

When a kit is locked, `--bar` is `--line` or `--surface-2`, and the selected bar is `--primary`. Do not keep `#1f4d3a` beside another theme.

## Typography

- Title: IBM Plex Sans 500, 28px, tracking -0.03em.
- Date line: 13px, `--ink-2`.
- Axis: IBM Plex Mono 11px, `--ink-3`.
- Day labels: 12px, weight 500. Selected day weight 600, `--ink`.
- Readout: IBM Plex Mono 13px.
- One text face, one mono. No display serif.

## Implementation notes

Heights are `n / 60 * 100` rounded: 70, 63, 85, 48, 77, 30, 20. Do not compute a different scale.

Rebuild order:

1. Page `#f6f4ef`, padding 48px 64px.
2. Title "Runs this week", 28px, weight 500.
3. Subtitle "Bay totals · 28 Sep – 4 Oct".
4. Card fill white, border `#e4dfd4`, radius 2, padding 24px 24px 16px, max-width 880.
5. Plot height 280px. Axis column 36px.
6. Seven buttons, gap 12px, aligned to the bottom border.
7. Bar max-width 48px, top radius 2px, bottom square.
8. Wednesday pressed on first paint.
9. Readout margin-top 16px.
10. Hover and click both call the same select function.

Copy you keep:

1. Monday 42, height 70%.
2. Tuesday 38, height 63%.
3. Wednesday 51, height 85%.
4. Thursday 29, height 48%.
5. Friday 46, height 77%.
6. Saturday 18, height 30%.
7. Sunday 12, height 20%.
8. Axis labels 60, 30, 0.
9. Selected fill `#1f4d3a`. Resting fill `#d9d3c7`.
10. Readout pattern is "Wednesday · 51 runs".

Common mistakes:

- A Chart.js or Recharts default palette.
- A blue series and an orange series.
- A legend under the card.
- Gridlines on every 10 runs.
- Rotated day labels.
- A floating tooltip that covers the bar.
- Animating the bars in a loop.
- Using the sparkline piece as a substitute. Sparks are the KPI row. This is the week.

Where it sits in a product:

1. Put it under the KPI spark row, not instead of the table.
2. The week is one question: which day was heavy.
3. Do not add a compare-to-last-week line on this piece.
4. Do not filter the bars from a date picker. The range is the subtitle.
5. The card does not scroll. Seven days fit.
6. If the product is a phone, keep seven bars and drop the axis labels to 0 and 60 only.
7. The readout stays under the plot, left aligned with the card padding.
8. Selection survives hover: leaving the plot keeps the last selected day.
9. Do not colour Saturday and Sunday in a second ink.
10. The title is the only heading. The card has no inner title.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
