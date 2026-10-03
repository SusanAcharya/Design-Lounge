<!-- Design Lounge Nº 360 · "Scroll split" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Scroll split

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A sticky stage. Three panels share one width and start with no gap, so they read as one board. Scroll opens the gap up to 16px across the first 240px of scroll. The copy under the stage is the thing you scroll. Reduced motion shows the 16px gap immediately. This is not a two-column story. That story is `sticky-split-story`. This is not a step list. Those steps are `features-sticky-scroll-steps`.

## Reference behaviour

1. The stage is sticky, 100vh.
2. Three panels sit in a flex row. --gap starts at 0.
3. ScrollY divided by 240, times 16, capped at 16, sets the gap.
4. The listener is passive. It is not an animation frame loop.
5. Panel one is Gate 4 on #1f4d3a. Panel two is Night book on #3a342c. Panel three is Month close on #1c1b19.
6. The names are Fraunces 28px. The lines are Public Sans.
7. Reduced motion forces gap 16px and the script returns.

## Structure

```
sticky 100vh
[ Gate 4 | Night book | Month close ]
then a 62ch column
```

- The row is min(960px, 100% - 48px), height 360px.
- Each panel is flex 1, padding 24px, content at the end.
- The column is max-width 62ch, padding 8vh 32px 50vh.
- Body is Public Sans 18px.
- The stage background is the page ground, #f4f1ea.

## Tokens

```css
:root { --bg:#f4f1ea; --ink:#1a1814; --a:#1f4d3a; --b:#3a342c; --c:#1c1b19; --on:#fffdf8; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Panel name | Fraunces | 28px | 560 |
| Body | Public Sans | 18px | 400 |

## Motion

- Gap | scroll | 0 | 16px | tied to scroll position, full by 240px. Reduced motion is 16px with no travel.

## States

- Top: gap 0, one board.
- Mid scroll: gap between 0 and 16.
- Past 240px: gap 16px.
- Reduced: gap 16px from the start.

## Accessibility

- Each panel name is text.
- The body is real paragraphs.
- Reduced motion shows the split, so the three names are not crushed together.
- There is no control.
- Do not rely on the gap alone. The three fills differ.
- The sticky stage does not cover the column once you have scrolled. The column has 50vh of padding so the scroll exists.

## Responsive rules

- The row is up to 960px.
- Below 700 the panels stack and the gap becomes a row gap. Scroll can still open it from 0 to 12px.
- The names drop to 22px under 700.

## Acceptance checklist

### Always

- [ ] Three panels.
- [ ] Gap follows scroll, cap 16px.
- [ ] Reduced motion shows the gap.
- [ ] The copy does not split.
- [ ] No loop.

### This demo

- [ ] Names are Gate 4, Night book, Month close.
- [ ] Lines mention twelve loads, 22:00, and one face for the totals.
- [ ] Full gap is 16px at 240px of scroll.
- [ ] Fills are #1f4d3a, #3a342c, #1c1b19.
- [ ] Display is Fraunces. Body is Public Sans.

## Implementation notes

Set a custom property from scrollY.

```js
const gap = Math.min(16, (y / 240) * 16);
```

Use a passive listener. Do not request animation frames in a loop.

## Measurements to keep

- Stage 100vh. Row height 360px. Max width 960px.
- Gap 0 to 16px. Full at 240px of scroll.
- Name 28px Fraunces. Padding 24px.
- Column 62ch. Bottom padding 50vh.
- Text on panels is #fffdf8.

## Wrong turns

- Do not split the paragraphs.
- Do not loop an animation frame.
- Do not use a photograph.
- Do not exceed 16px.
- Do not hide a panel.
- Do not pin a second sticky on top.

## Fit with the rest of the library

- A split story is `sticky-split-story`.
- Feature steps are `features-sticky-scroll-steps`.
- This is one board opening into three.
- Three panels.
- Display is Fraunces.
- The ground is paper.

## Keyboard

- There is no button.
- Arrow keys and Space scroll the page, which opens the gap.
- Reduced motion shows 16px.
- The listener is passive.
- Do not use a positive tabindex.
- Cap is 16px.
- Full travel is 240px of scroll.
- Three names stay visible.
- Display type is Fraunces.
- Body type is Public Sans.
- No live region.
- Escape does nothing.
- The stage is sticky.
- Do not trap scroll.
- Panel text is #fffdf8.
- The column is 62ch.

## Pass

- Measure the first frame before changing a number.
- Keep the names in this brief.
- Keep the duration written above.
- Honour reduced motion.
- Do not add a second accent.
- Do not add a second type family.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
