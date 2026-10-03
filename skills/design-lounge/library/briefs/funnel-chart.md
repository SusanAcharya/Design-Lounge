<!-- Design Lounge Nº 215 · "Funnel chart" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Funnel chart

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, use that kit's colour and radius. This demo uses the numbers below.

## What it is

A stage count for the yard week. The number on arrival is 71, the loads that were billed. Five rows narrow from Arrived 240 to Billed 71. One colour. Clicking a stage puts that count in the big number and names the stage. This is not a pie. This is not two series. A ranked money list is `chart-rank-spend`. A week of bars is `chart-bar-week`.

## Reference behaviour

1. The first frame number is 71. The caption is "Billed · of 240 that arrived". Billed is current.
2. Rows are Arrived 240, Checked 210, Held 96, Released 88, Billed 71.
3. Bar width is the count divided by 240.
4. Clicking a stage sets aria-current on that row and writes its count and name.
5. Only one row is current.
6. There is no legend and no second colour.
7. The bars do not animate.

## Structure

```
640px card
THIS WEEK
71
caption
label · bar · count
```

- Card 640px, padding 32px.
- The number is 64px.
- Each row is a grid: 120px label, 1fr bar, 48px count, min-height 44px.
- The bar track is 10px, fill #f0ebe3, the mark is #1f4d3a.
- The stage name is a button.

## Tokens

```css
:root {
  --bg:#f6f4ef; --surface:#fff; --ink:#161513; --ink-2:#5a554c;
  --line:#e4dfd4; --primary:#1f4d3a; --track:#f0ebe3;
}
```

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Kicker | IBM Plex Sans | 12px | 500 | 1 | 0.08em |
| Number | IBM Plex Sans | 64px | 600 | 1 | 0 |
| Stage | IBM Plex Sans | 14px | 400 | 1 | 0 |

## Motion

| Thing | Trigger | From | To | Duration | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Number | click stage | previous count | next count | none | instant |

## States

- Current row: aria-current true, label weight 600.
- Other rows: weight 400.
- Hover does not change the bar colour.
- There is no empty state. The five stages always render.

## Accessibility

- Each stage is a button.
- The big number is text, not a graphic of the digit.
- Counts are tabular numbers.
- Do not rely on bar length alone. The count is also a number.
- Focus ring is 2px #1f4d3a, offset 3px.
- There is no chart role required beyond the buttons and the text.

## Responsive rules

- The card is 640px at 1280.
- Below 700 the card is calc(100% - 32px). The label column may drop to 88px.
- Do not turn the rows into a vertical funnel drawing.

## Acceptance checklist

### Always

- [ ] One number at display size.
- [ ] One colour for every bar.
- [ ] Width is the count over the first stage.
- [ ] Clicking a stage replaces the number.
- [ ] No legend, no pie, no second series.

### This demo

- [ ] 71 is the first number.
- [ ] 240 is the arrived count.
- [ ] The five names are Arrived, Checked, Held, Released, Billed.
- [ ] The kicker is This week.
- [ ] Type is IBM Plex Sans.

## Implementation notes

Width percent is Math.round(n / 240 * 100). Set it as a custom property on the mark.

```js
row.innerHTML = '<button type="button">'+name+'</button>';
```

Build the button with createElement if the names ever come from outside the file. These names are fixed.

## Measurements to keep

- Card 640px, padding 32px, radius 2px.
- Number 64px, margin 8px 0 4px. Caption margin 0 0 28px.
- Row min-height 44px. Columns 120px 1fr 48px. Gap 12px.
- Track height 10px, radius 2px.
- Kicker 12px, tracking 0.08em, uppercase.

## Wrong turns

- Do not draw a cone.
- Do not add a legend.
- Do not colour Held in red and Billed in green.
- Do not animate the widths on load.
- Do not show a delta chip.
- Do not import a chart theme.

## Fit with the rest of the library

- Ranked amounts are `chart-rank-spend`.
- A week of bars is `chart-bar-week`.
- A single delta is `kpi-delta`.
- A line over a quarter is `chart-line-range`.
- This funnel is one series of stages.
- Do not place four equal numbers beside it.

## Keyboard

- Tab moves through the five stage buttons.
- Enter selects a stage.
- The current stage is aria-current true.
- Only one current stage.
- The number updates to that stage count.
- Arrow keys are not required.
- Do not use a positive tabindex.
- The bars are not focusable.
- The kicker is not a heading of the number. The number is a paragraph.
- Focus ring offset is 3px.
- There is no tooltip on the bar.
- Reduced motion changes nothing.
- 240 stays the denominator.
- Billed starts current.
- The type is IBM Plex Sans.
- Do not add a sixth stage in this demo.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
