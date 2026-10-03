<!-- Design Lounge Nº 244 · "Scroll velocity type" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Scroll velocity type

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A sticky headline, Hold the line. While the page scrolls, letter-spacing grows by 0.03em per event, up to 0.2em. When scrolling stops, an interval multiplies the spacing by 0.75 every 48ms until it is under 0.008em, then it returns to 0. Reduced motion keeps the spacing at 0. This is not a chapter stack. That stack is `features-sticky-scroll-steps`. The tracking is the piece.

## Reference behaviour

1. The headline is sticky, 180px tall, Fraunces 64px.
2. Scroll adds 0.03 to the spacing, capped at 0.2.
3. The value is set as --ls in em.
4. A settle interval starts on each scroll and replaces the previous one.
5. Each tick multiplies spacing by 0.75. Under 0.008 it becomes 0 and the interval clears.
6. Reduced motion returns from the scroll handler. CSS also forces letter-spacing 0.
7. The body copy stays in a 62ch column and does not track out.

## Structure

```
sticky: Hold the line
62ch column of four paragraphs
```

- The sticky bar is top 0, height 180px, background #f4f1ea.
- The heading uses letter-spacing var(--ls, 0em).
- The section is max-width 62ch, padding 0 32px 40vh, so the page can scroll.
- Body is Public Sans 18px, line-height 1.5, colour #5c564c on the paragraphs.
- The interval is 48ms. It is not a perpetual animation frame.

## Tokens

```css
:root { --bg:#f4f1ea; --ink:#1a1814; --ink-2:#5c564c; --primary:#1f4d3a; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Headline | Fraunces | 64px | 560 |
| Body | Public Sans | 18px | 400 |

## Motion

- Tracking | scroll | current em | up to 0.2em, then decay by 0.75 | settle every 48ms. Reduced motion stays at 0.

## States

- Rest: spacing 0.
- Scrolling: spacing climbing, max 0.2em.
- Settling: spacing shrinking.
- Reduced: spacing 0.

## Accessibility

- The headline is a heading and stays readable.
- 0.2em is the cap so the words do not break apart.
- Reduced motion keeps spacing at 0.
- The body is the thing you scroll. It is not animated.
- Focus is unused. There is no control.
- Do not run a loop when the spacing is already 0.

## Responsive rules

- The headline is 64px at 1280.
- Below 700 it is 40px. The sticky height can drop to 120px.
- The column stays 62ch or the viewport minus 32px.

## Acceptance checklist

### Always

- [ ] Tracking follows scroll speed, then settles.
- [ ] The cap is 0.2em.
- [ ] The body does not track.
- [ ] Reduced motion stays at 0.
- [ ] The settle interval is cleared when spacing returns to 0.

### This demo

- [ ] The headline is Hold the line.
- [ ] The copy mentions Gate 4, the night book, and month close.
- [ ] The add per scroll is 0.03.
- [ ] The cap is 0.2em.
- [ ] Display is Fraunces. Body is Public Sans.

## Implementation notes

Replace the settle timer on every scroll event.

```js
space = Math.min(0.2, space + 0.03);
settle = setInterval(() => { space *= 0.75; }, 48);
```

Clear the previous interval first. Do not use requestAnimationFrame in a loop.

## Measurements to keep

- Sticky height 180px. Headline 64px, weight 560.
- Add 0.03em per scroll. Cap 0.2em. Decay 0.75. Floor 0.008em.
- Settle interval 48ms.
- Column max-width 62ch. Padding 0 32px 40vh.
- Body 18px, line-height 1.5. Paragraph colour #5c564c.

## Wrong turns

- Do not loop an animation frame forever.
- Do not track the body paragraphs.
- Do not exceed 0.2em.
- Do not run under reduced motion.
- Do not pin the headline over a second page.
- Do not scramble the letters.

## Fit with the rest of the library

- Chapter scroll is `features-sticky-scroll-steps`.
- A scramble is `text-scramble-reveal`.
- This is tracking.
- One headline.
- Display is Fraunces.
- The ground is paper.

## Keyboard

- There is no button.
- Scroll is the input.
- Arrow keys scroll the page and therefore open the tracking.
- Reduced motion returns early.
- The interval is 48ms and must be cleared.
- Do not use a positive tabindex.
- The headline is not a control.
- The cap is 0.2em.
- The decay is 0.75.
- The floor is 0.008em.
- Display type is Fraunces.
- Body type is Public Sans.
- No live region.
- The sticky bar does not cover the first paragraph at rest if the section starts below it.
- Escape does nothing.
- Do not trap focus.

## Rebuild order

1. Build step: The headline is sticky, 180px tall, Fraunces 64px.
2. Build step: Scroll adds 0.03 to the spacing, capped at 0.2.
3. Build step: The value is set as --ls in em.
4. Build step: A settle interval starts on each scroll and replaces the previous one.
5. Build step: Each tick multiplies spacing by 0.75. Under 0.008 it becomes 0 and the interval clears.
6. Build step: Reduced motion returns from the scroll handler. CSS also forces letter-spacing 0.
7. Build step: The body copy stays in a 62ch column and does not track out.

- Keep this measurement while rebuilding: Sticky height 180px. Headline 64px, weight 560.
- Keep this measurement while rebuilding: Add 0.03em per scroll. Cap 0.2em. Decay 0.75. Floor 0.008em.
- Keep this measurement while rebuilding: Settle interval 48ms.
- Keep this measurement while rebuilding: Column max-width 62ch. Padding 0 32px 40vh.
- Keep this measurement while rebuilding: Body 18px, line-height 1.5. Paragraph colour #5c564c.

- While rebuilding, remember: Do not loop an animation frame forever.
- While rebuilding, remember: Do not track the body paragraphs.
- While rebuilding, remember: Do not exceed 0.2em.
- While rebuilding, remember: Do not run under reduced motion.
- While rebuilding, remember: Do not pin the headline over a second page.
- While rebuilding, remember: Do not scramble the letters.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
