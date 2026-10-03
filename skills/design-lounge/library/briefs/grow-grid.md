<!-- Design Lounge Nº 255 · "Grow grid" · designlounge.vercel.app -->

# Grow grid

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Six rooms: Gate 4, Night book, Month close, Yard map, Hold list, Biratnagar. They share a 840 by 460 grid. Pointer or focus on a cell grows that column to 1.7fr and that row to 1.7fr. The other tracks become 0.65fr. Leaving the grid evens the tracks. This is not a feature bento with fixed spans. That grid is `bento-feature-grid`. This is not a lens. That lens is `lens-bento`.

## Reference behaviour

1. The grid starts even: three columns, two rows.
2. Pointer enter on a cell sets data-c and data-r.
3. Focus does the same.
4. The matching column becomes 1.7fr. The other columns become 0.65fr.
5. The matching row becomes 1.7fr. The other row becomes 0.65fr.
6. The change is 280ms.
7. Leaving the grid deletes both data attributes. Reduced motion snaps.

## Structure

```
840×460
Gate 4 | Night book | Month close
Yard map | Hold list | Biratnagar
```

- The grid is 840 by 460, gap 8px.
- Each cell is a button, padding 16px, radius 2px.
- The name is 18px. The line is 13px, #5a554c.
- Column index is data-c. Row index is data-r.
- Even tracks are 1fr.

## Tokens

```css
:root { --bg:#f6f4ef; --surface:#fff; --ink:#161513; --ink-2:#5a554c; --line:#e4dfd4; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Name | IBM Plex Sans | 18px | 600 |
| Line | IBM Plex Sans | 13px | 500 |

## Motion

- Tracks | pointer or focus | 1fr 1fr 1fr | 1.7fr and 0.65fr | 280ms cubic-bezier(0.16,1,0.3,1). Reduced motion snaps.

## States

- Even: no data-c, no data-r.
- One cell: its row and column are large.
- Leave: even again.
- Focus stays large until focus leaves the cell. Pointer leave of the grid clears it.

## Accessibility

- Each room is a button.
- Names are text, not only size.
- Focus grows the same tracks as the pointer.
- Focus ring is 2px #1f4d3a, offset 3px.
- Reduced motion still changes the tracks. It skips the transition.
- Do not remove the small cells from the tab order.

## Responsive rules

- The grid is 840 by 460 at 1280.
- Below 900 it is calc(100% - 32px) and the height can drop to 70vh.
- Below 640 use one column. Growing a row is enough. Do not keep three tiny columns.

## Acceptance checklist

### Always

- [ ] One cell grows its row and its column.
- [ ] Leave returns to even tracks.
- [ ] Six rooms, named.
- [ ] 280ms or none.
- [ ] Focus matches the pointer.

### This demo

- [ ] Rooms are Gate 4, Night book, Month close, Yard map, Hold list, Biratnagar.
- [ ] Large track is 1.7fr. Small track is 0.65fr.
- [ ] Gap is 8px.
- [ ] The grid starts even.
- [ ] Type is IBM Plex Sans.

## Implementation notes

Set the indexes from the cell.

```js
grid.dataset.c = b.dataset.c;
grid.dataset.r = b.dataset.r;
```

Delete the attributes on pointerleave of the grid, not of the cell, or the tracks flicker between cells.

## Measurements to keep

- Grid 840×460. Gap 8px.
- Large 1.7fr. Small 0.65fr. Even 1fr.
- Transition 280ms.
- Name 18px. Line 13px. Padding 16px.
- Radius 2px.

## Wrong turns

- Do not grow only the cell with a scale.
- Do not start with a cell already large.
- Do not use a lens on top.
- Do not hide the small names.
- Do not animate each cell separately.
- Do not add a seventh room in this demo.

## Fit with the rest of the library

- A fixed bento is `bento-feature-grid`.
- A lens is `lens-bento`.
- This is the row and the column.
- Six cells.
- Type is IBM Plex Sans.
- The ground is #f6f4ef.

## Keyboard

- Focus grows that cell’s row and column.
- Tab order is the six buttons.
- Do not use a positive tabindex.
- Pointer leave of the grid clears the grow.
- Focus offset is 3px.
- Reduced motion snaps.
- Names stay in the buttons.
- The grid starts even.
- Large is 1.7fr.
- Small is 0.65fr.
- Type is IBM Plex Sans.
- Escape does nothing.
- There is no selection state.
- Gap is 8px.
- Do not trap focus.
- The line under the name stays 13px.

## Pass

- Measure the first frame before changing a number.
- Keep the names in this brief.
- Keep the duration written above.
- Honour reduced motion.
- Do not add a second accent.
- Do not add a second type family.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
