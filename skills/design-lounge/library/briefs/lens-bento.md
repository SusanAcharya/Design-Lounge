<!-- Design Lounge Nº 225 · "Lens bento" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Lens bento

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A white board of twelve yard chips. A 180px circle follows the pointer. Chips whose center is inside 90px scale to 1.35. Outside, they stay at 1. Reduced motion moves the lens and does not scale. This is not a bento of feature cards. That grid is `bento-feature-grid`. This is not a spotlight that lights a cell. That grid is `spotlight-hover-grid`. The lens is the piece.

## Reference behaviour

1. Twelve chips sit in a 4 by 3 grid.
2. The lens starts near the middle of the 720 by 420 board.
3. Pointer move sets the lens center to the pointer.
4. A chip scales to 1.35 when its center is within 90px of the lens.
5. Other chips stay at scale 1.
6. The lens does not capture clicks. It is pointer-events none.
7. Reduced motion skips the scale.

## Structure

```
720×420 board
chips
180px lens
```

- Board 720 by 420, radius 2px.
- Chips are 36px pills.
- Lens is 180px, border 2px #1f4d3a, margin -90px so the center is the pointer.
- A dim wash sits outside the lens via a huge box-shadow.
- Chips are positioned absolutely.

## Tokens

```css
:root { --bg:#f6f4ef; --surface:#fff; --ink:#161513; --line:#e4dfd4; --primary:#1f4d3a; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Chip | IBM Plex Sans | 13px | 500 |
| Board | IBM Plex Sans | 15px | 500 |

## Motion

- Chip scale | pointer near | scale 1 | scale 1.35 | 120ms linear. Reduced motion stays at 1.

## States

- Lens follows the pointer.
- Near chip: scale 1.35.
- Far chip: scale 1.
- No pressed chip. The lens is not a selection.

## Accessibility

- Chips are text, not buttons. The lens is decorative.
- Do not hide chip names inside the magnification only.
- Reduced motion keeps every name at the same size.
- The board is not a control.
- There is no keyboard lens in this demo. A product that needs one should move the lens with arrows.
- Contrast of chip text on #f0ebe3 stays above 4.5.

## Responsive rules

- The board is 720px at 1280.
- Below 760 the board is calc(100% - 32px) and the chip step shrinks.
- The lens stays 180px.

## Acceptance checklist

### Always

- [ ] The lens follows the pointer.
- [ ] Only nearby chips scale.
- [ ] Names stay readable without the lens.
- [ ] Reduced motion does not scale.
- [ ] The lens does not steal clicks.

### This demo

- [ ] Names include Gate 4, Night book, Month close, Yard map, Store tally, Desk chat.
- [ ] There are 12 chips.
- [ ] Lens diameter is 180px.
- [ ] Scale is 1.35 inside 90px.
- [ ] Type is IBM Plex Sans.

## Implementation notes

Measure distance from chip center to pointer in board coordinates.

```js
const s = d < 90 ? 1.35 : 1;
```

Do not use a canvas. The chips are DOM.

## Measurements to keep

- Board 720×420. Chip height 36px.
- Lens 180px, border 2px, margin -90px.
- Scale 1.35. Radius 90px.
- Transition 120ms linear.
- Chip fill #f0ebe3.

## Wrong turns

- Do not make the lens a magnifying screenshot of a second layer.
- Do not hide chips until the lens arrives.
- Do not follow the pointer with a trail.
- Do not scale every chip.
- Do not add click actions on the chips in this piece.
- Do not spin the lens.

## Fit with the rest of the library

- A feature bento is `bento-feature-grid`.
- A spotlight grid is `spotlight-hover-grid`.
- This is a lens over chips.
- Do not combine it with a coverflow.
- Ground is #f6f4ef.
- Type is IBM Plex Sans.

## Keyboard

- The lens is not a tab stop.
- Chips are not buttons.
- Arrow keys do not move the lens in this demo.
- Reduced motion keeps scale at 1.
- Pointer-events none is on the lens.
- Names are in the DOM.
- Do not use a positive tabindex.
- The board does not scroll.
- There are 12 names.
- The threshold is 90px.
- The scale is 1.35.
- No live region.
- Focus ring is unused unless a product adds buttons.
- Do not trap the pointer.
- Type is IBM Plex Sans.
- The wash outside the lens is a shadow, not a second element.

## Rebuild order

1. Build step: Twelve chips sit in a 4 by 3 grid.
2. Build step: The lens starts near the middle of the 720 by 420 board.
3. Build step: Pointer move sets the lens center to the pointer.
4. Build step: A chip scales to 1.35 when its center is within 90px of the lens.
5. Build step: Other chips stay at scale 1.
6. Build step: The lens does not capture clicks. It is pointer-events none.
7. Build step: Reduced motion skips the scale.

- Keep this measurement while rebuilding: Board 720×420. Chip height 36px.
- Keep this measurement while rebuilding: Lens 180px, border 2px, margin -90px.
- Keep this measurement while rebuilding: Scale 1.35. Radius 90px.
- Keep this measurement while rebuilding: Transition 120ms linear.
- Keep this measurement while rebuilding: Chip fill #f0ebe3.

- While rebuilding, remember: Do not make the lens a magnifying screenshot of a second layer.
- While rebuilding, remember: Do not hide chips until the lens arrives.
- While rebuilding, remember: Do not follow the pointer with a trail.
- While rebuilding, remember: Do not scale every chip.
- While rebuilding, remember: Do not add click actions on the chips in this piece.
- While rebuilding, remember: Do not spin the lens.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
