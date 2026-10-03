<!-- Design Lounge Nº 292 · "Node graph" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Node graph

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Five pills on a 760 by 460 stage: Yard, Gate mail, Night book, Hold list, Month close. Lines join Yard to the other four, and Gate mail to Hold list. Yard starts pressed. Its lines are #1f4d3a. Clicking another node presses that node and lights only the lines that touch it. This is not an orbit of links. That orbit is `link-orbit`.

## Reference behaviour

1. Yard starts aria-pressed true. Lines from Yard are class on.
2. A pressed node is fill #e7f2ec, border #1f4d3a, text #1f4d3a.
3. Other nodes are white, border #cfc6b8, text #161513.
4. Clicking a node presses only that node.
5. A line is on when either end is the pressed node.
6. The SVG is aria-hidden. The buttons carry the names.
7. There is no drag and no animation.

## Structure

```
760×460
Gate mail          Night book
        Yard
Hold list          Month close
```

- Stage 760 by 460, position relative.
- Nodes are 44px buttons, radius 999px.
- Positions: Yard 340,210. Gate mail 80,80. Night book 600,70. Hold list 90,360. Month close 600,350. Buttons offset by -50px and -22px.
- Lines are 1.5px #cfc6b8, and 2.5px #1f4d3a when on.
- Edges are 0-1, 0-2, 0-3, 0-4, 1-3.

## Tokens

```css
:root { --bg:#f6f4ef; --ink:#161513; --line:#cfc6b8; --primary:#1f4d3a; --soft:#e7f2ec; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Node | IBM Plex Sans | 14px | 500 |

## Motion

- Selection | click | old pressed node | new pressed node | none | lines change colour

## States

- Pressed: one node, soft fill.
- Linked line: class on.
- Other lines: #cfc6b8.
- Only one node is pressed.

## Accessibility

- Each node is a button with aria-pressed.
- The SVG is aria-hidden.
- Focus ring is 2px #1f4d3a, offset 3px.
- The names are the button text.
- Do not rely on colour alone. The pressed fill and the thicker line both change.
- Tab order follows creation: Yard, Gate mail, Night book, Hold list, Month close.

## Responsive rules

- The stage is 760 by 460 at 1280.
- Below 800 scale the stage with transform so the positions stay in one ratio.
- Do not reflow the nodes into a list in this piece. The links are the picture.

## Acceptance checklist

### Always

- [ ] One pressed node.
- [ ] Lines light only when they touch that node.
- [ ] Five names, five edges as listed.
- [ ] Yard starts pressed.
- [ ] No drag.

### This demo

- [ ] Names are Yard, Gate mail, Night book, Hold list, Month close.
- [ ] Yard starts pressed.
- [ ] On lines are #1f4d3a at 2.5px.
- [ ] Rest lines are #cfc6b8 at 1.5px.
- [ ] Type is IBM Plex Sans.

## Implementation notes

Store edge ends on the line.

```js
l.classList.toggle("on", l.dataset.a == i || l.dataset.b == i);
```

Create the SVG line with the SVG namespace.

## Measurements to keep

- Stage 760×460. Button height 44px, padding 0 14px.
- Pressed fill #e7f2ec.
- Line 1.5px rest, 2.5px on.
- Node coordinates as listed. Button origin offset -50px, -22px.
- Focus offset 3px.

## Wrong turns

- Do not drag nodes.
- Do not animate a dash loop.
- Do not add a sixth node.
- Do not hide the names.
- Do not use a canvas.
- Do not make every line green at once.

## Fit with the rest of the library

- An orbit is `link-orbit`.
- An activity list is `audit-activity-log`.
- This is a small graph.
- Do not add a zoom.
- Type is IBM Plex Sans.
- The ground is #f6f4ef.

## Keyboard

- Enter presses the focused node.
- aria-pressed moves to that node.
- Tab order is the five buttons.
- Lines are not tab stops.
- Do not use a positive tabindex.
- Yard starts pressed.
- Focus offset is 3px.
- There are five edges.
- No arrow-key move.
- Escape does nothing.
- Type is IBM Plex Sans.
- The SVG is hidden from the tree.
- One pressed node.
- No drag.
- Positions stay absolute.
- Do not trap focus.

## Rebuild order

1. Build step: Yard starts aria-pressed true. Lines from Yard are class on.
2. Build step: A pressed node is fill #e7f2ec, border #1f4d3a, text #1f4d3a.
3. Build step: Other nodes are white, border #cfc6b8, text #161513.
4. Build step: Clicking a node presses only that node.
5. Build step: A line is on when either end is the pressed node.
6. Build step: The SVG is aria-hidden. The buttons carry the names.
7. Build step: There is no drag and no animation.

- Keep this measurement while rebuilding: Stage 760×460. Button height 44px, padding 0 14px.
- Keep this measurement while rebuilding: Pressed fill #e7f2ec.
- Keep this measurement while rebuilding: Line 1.5px rest, 2.5px on.
- Keep this measurement while rebuilding: Node coordinates as listed. Button origin offset -50px, -22px.
- Keep this measurement while rebuilding: Focus offset 3px.

- While rebuilding, remember: Do not drag nodes.
- While rebuilding, remember: Do not animate a dash loop.
- While rebuilding, remember: Do not add a sixth node.
- While rebuilding, remember: Do not hide the names.
- While rebuilding, remember: Do not use a canvas.
- While rebuilding, remember: Do not make every line green at once.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
