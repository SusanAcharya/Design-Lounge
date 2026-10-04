<!-- Design Lounge Nº 476 · "Whiteboard tool dock" · designlounge.vercel.app -->

# Whiteboard tool dock

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The bottom-centre tool dock of an invented whiteboard app, Scrawl, floating over a dotted paper canvas that already holds a dashed frame, three sticky notes, a hand-drawn arrow and a circled "Launch Nov 12". The dock is cream with a 2px ink border and a hard 4px/5px offset shadow, so it reads as a printed object, not a glass panel. Tools are exclusive. The active tool fills tomato red with its own small hard shadow. Shapes open a nested flyout above the dock. Every tool really works on the canvas, so undo and redo have real history. The detail worth copying is how it collapses on phones: secondary tools wrap onto a second row above the primary row via `flex-wrap: wrap-reverse`, without moving any DOM.

## Reference behaviour

1. First frame: the Shapes tool is active showing the Ellipse icon. Its flyout is open above it with Ellipse pressed. A dark hint chip at top centre reads "Ellipse — drag to draw, click for a default size". Undo and Redo are disabled. The file chip reads "Offsite map — Q4 · Edited 2 min ago".
2. The dock, left to right: Select, Hand, divider, Pen, Shapes (with a corner triangle), Text, Sticky note, Eraser, divider, Colour swatch, divider, Undo, Redo.
3. Clicking a tool sets it active (`aria-pressed="true"`), closes any open menu, deselects any picked object, and shows its hint for 2.6s.
4. Clicking Shapes activates it and toggles the flyout. The flyout holds Rectangle, Ellipse, Triangle, Arrow. Picking one closes the flyout, swaps the Shapes button's icon, and returns focus to the Shapes button.
5. Clicking the Colour swatch opens a six-dot palette: Ink `#1d1b18`, Tomato `#ff5a36`, Cobalt `#2e5bff`, Moss `#1e9e6a`, Ochre `#d99a00`, Plum `#8e3b8a`. Picking one updates the swatch. New strokes, shapes and text use it; new stickies use its pastel (`#ffe27a`, `#ffb4a0`, `#b9c8ff`, `#a8e6c6`, `#ffe27a`, `#e7b9e4`).
6. Pointer down anywhere outside a menu closes it.
7. Tools on the canvas:
   - Pen: drag draws a 3px round-capped stroke.
   - Shapes: drag draws the current shape. A click without moving more than 6px drops a 140×90 default.
   - Text: click places an editable "Label" in Caveat 30px, text selected.
   - Sticky: click drops a 156px note reading "New idea", rotated −2° to 2°, text selected.
   - Eraser: click or drag across objects removes them.
   - Select: click picks an object (dashed cobalt outline), drag moves it, Delete or Backspace removes it, double-click a note or label to edit.
   - Hand: drag pans the board. The dot grid pans with it.
8. Every add, remove and move is pushed onto an undo stack. Undo (⌘Z or Ctrl+Z) and Redo (⇧⌘Z, Ctrl+Shift+Z or Ctrl+Y) walk it. A new action clears the redo stack. The buttons disable when their stack is empty. The file chip switches to "Saved just now" once anything is in history.
9. Letter shortcuts when not typing: V, H, P, T, N, E for tools; R, O, Y, A for Rectangle, Ellipse, Triangle, Arrow; Escape closes menus and deselects.
10. Below 640px wide, Hand, Text, Eraser, Undo and Redo hide and a "More tools" (•••) button appears. Pressing it shows them as a second row above the main row.

## Structure

```
┌─────────────────────────────────────────────────────────── 1280 ──┐
│ [~ Offsite map — Q4  Edited 2 min ago]   (hint chip)  [100% Share]│ chips: 44px, top 16px
│                                                                   │
│    Friday — onboarding                                            │
│   ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐                                         │
│   │ [yellow]  [pink]    │ ──────→ [mint]                          │
│   └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘                                         │
│    Fewer screens, same data          ( Launch Nov 12 )            │
│                                                                   │
│                  ┌ ▭ ◯ △ ↗ ┐  flyout, 14px above                  │
│        ┌────────────────────────────────────────────┐             │
│        │ ↖ ✋ │ ✎ [◯] T ▱ ⌫ │ ● │ ↶ ↷ │  44px buttons, 6px pad    │
│        └────────────────────────────────────────────┘ bottom 20px │
└───────────────────────────────────────────────────────────────────┘
```

- Board: a fixed `div role="application" aria-label="Whiteboard canvas"` with the dot grid as a background, containing a `.world` layer translated by the pan offset. The world holds one large `svg` for strokes and shapes, and absolutely positioned `div`s for notes and labels. Every object carries `data-el`.
- Top chips: two `div.chip` with the logo, file name, save status, zoom readout and a Share button.
- Dock: `div role="toolbar" aria-label="Tools"`. Tool buttons carry `aria-pressed`. Shapes and Colour each sit in a `span.wrap` (position relative) with their menu as the next sibling.
- Flyout: `div role="group" aria-label="Shapes"` of four `aria-pressed` buttons.
- Palette: `div role="radiogroup" aria-label="Colour"` of six `role="radio"` buttons.
- Hint: `p aria-live="polite"`.

## Tokens

```css
:root {
  --paper: #f3eee4;     /* canvas */
  --dots: #cfc6b5;      /* 1.2px dots on a 22px grid */
  --surface: #fffdf8;   /* dock, chips, menus */
  --ink: #1d1b18;       /* borders, text, hard shadows */
  --ink-2: #5e574c;     /* secondary text */
  --line: #d9d0bf;      /* dividers */
  --hover: #efe8da;     /* button hover */
  --accent: #ff5a36;    /* active tool */
  --sel: #2e5bff;       /* focus ring, selection outline */
  --ui: "Bricolage Grotesque", system-ui, sans-serif;
  --hand: "Caveat", cursive;
  --btn: 44px;          /* 40px inside the flyout */
  --r-dock: 16px; --r-btn: 10px; --r-menu: 14px; --r-chip: 12px;
  --hard: 4px 5px 0 var(--ink);
  --hard-sm: 2px 2px 0 var(--ink);
  --space: 4px;         /* dock gap; padding 6px */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --pop: cubic-bezier(.16, 1, .3, 1);
  --t: 140ms;
}
```

## Typography

| Role | Family | Size | Weight | Notes |
| --- | --- | --- | --- | --- |
| File name | Bricolage Grotesque | 14px | 700 | letter-spacing −0.01em, ellipsis |
| Save status | Bricolage Grotesque | 12.5px | 400 | `--ink-2` |
| Share button | Bricolage Grotesque | 14px | 700 | cream on ink, 32px tall |
| Tooltip | Bricolage Grotesque | 12px | 500 | "Pen   P", tool name then key |
| Hint chip | Bricolage Grotesque | 12.5px | 400 | cream on `rgba(29,27,24,.86)` |
| Frame label | Bricolage Grotesque | 13px | 500 | `--ink-2` |
| Sticky note | Caveat | 25px | 500 | line-height 1.05 |
| Canvas text | Caveat | 30px | 700 | |

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Tool button | hover / press | background, translateY | transparent → `--hover`; 0 → 1px | 140ms `--ease` | instant |
| Tooltip | hover / focus-visible | opacity, translateY | 0, 4px → 1, 0 | 140ms `--ease` | instant |
| Flyout / palette | open | opacity, translateY, scale | 0, 8px, .96 → 1, 0, 1 | 220ms `--pop` | no animation |
| Hint chip | tool change | opacity | 1 → 0 after 2.6s | 200ms `--ease` | instant |

Drawing is direct manipulation and has no easing.

## States

- Tool resting: transparent, 2px transparent border so the size doesn't jump.
- Hover: `--hover` fill.
- Pressed (mouse down): moves down 1px.
- Active tool: `--accent` fill, 2px ink border, 2px/2px ink shadow.
- Disabled (Undo/Redo with empty stack): opacity .32, no hover, default cursor.
- Menu open: the owning button's tooltip is suppressed (`aria-expanded="true"`).
- Focus-visible: 2px `--sel` outline, 2px offset.
- Picked object: 2px dashed `--sel` outline offset 4px on notes; SVG objects switch to a 6/5 dash.
- Editing note: 2px `--sel` ring, text cursor.
- Colour palette: the chosen dot has a 2px cream gap and a 4px ink ring; others a 3px `--line` ring.

## Accessibility

- The dock is a `toolbar` with roving tabindex: one tab stop, Left/Right/Home/End move and wrap. Hidden buttons (on phones) are skipped.
- On Shapes or Colour, ArrowUp opens the menu and focuses the current choice. Enter or Space from the keyboard also opens it with focus inside.
- In a menu, Left/Right move, Enter/Space choose, Escape closes and returns focus to the owner.
- Shapes button label includes the current shape: "Shapes: Ellipse". The swatch label is "Colour: Tomato".
- Tool buttons use `aria-pressed`. Palette dots use `role="radio"` with `aria-checked` and their own roving tabindex.
- The hint chip is a polite live region, so tool changes are announced.
- Letter shortcuts are ignored while typing in a note or label; Escape leaves edit mode.
- Ink on cream is above 16:1. Ink on tomato is above 6:1, so the active icon stays legible.
- Buttons are 44px; flyout buttons 40px.

## Responsive rules

- ≥1280: as drawn. The dock is about 640px wide.
- 1024 / 768: unchanged; the dock still fits.
- <640: hide the save status and zoom. Hide Hand, Text, Eraser, Undo, Redo and their dividers; show "More tools". The dock becomes `flex-wrap: wrap-reverse`, and opening More shows the hidden buttons on a row above the primary row. The board starts panned −200px, +40px so the sticky notes are on screen. The hint chip moves to 72px from the top, under the chips.
- Touch: the board uses `touch-action: none` so drawing doesn't scroll the page.

## Acceptance checklist

### Always

- [ ] Exactly one tool is active at a time, shown by fill plus `aria-pressed`.
- [ ] The nested flyout opens above its button, closes on choice, outside click and Escape.
- [ ] The grouped button shows the last chosen sub-tool's icon and a corner marker.
- [ ] Undo and redo walk real history and disable when empty; a new action clears redo.
- [ ] ⌘Z / Ctrl+Z and ⇧⌘Z / Ctrl+Y work; shortcuts are ignored while typing.
- [ ] Roving tabindex in the toolbar; ArrowUp opens the flyout and palette.
- [ ] Every button has a tooltip with its shortcut and a 2px focus ring.
- [ ] Below 640px the dock collapses to a primary row plus a "More" button that reveals a second row above.
- [ ] No horizontal overflow at 375px.
- [ ] Reduced motion removes menu and tooltip animation.

### This demo

- [ ] 2px ink border, 16px radius, 4px/5px hard ink shadow on cream `#fffdf8`.
- [ ] Active tool fill is `#ff5a36`.
- [ ] Six colours, Ink to Plum, with pastel sticky backgrounds.
- [ ] Canvas starts with three notes, a dashed frame, an arrow, a squiggle and "Launch Nov 12" circled in tomato.
- [ ] Shapes is active with the flyout open on the first frame.

## Implementation notes

The collapse is pure CSS. Secondary buttons get `.ov`; a zero-height breaker forces a new flex line, and `wrap-reverse` stacks that line above:

```css
@media (max-width: 640px) {
  .dock { flex-wrap: wrap-reverse; justify-content: center; width: max-content;
          max-width: calc(100vw - 24px); row-gap: 4px; }
  .ov  { display: none; order: 2; }
  .brk { display: none; order: 1; flex-basis: 100%; height: 0; }
  .dock.open .ov:not(.div) { display: grid; }
  .dock.open .brk { display: block; }
  .more { display: grid; }
}
```

Keep history as plain records and apply them in either direction. Store the next sibling for removals so undo puts an object back in the same stacking order:

```js
function apply(a, back) {
  if (a.type === 'add')    back ? a.el.remove() : a.parent.append(a.el);
  if (a.type === 'remove') back ? a.parent.insertBefore(a.el, a.next?.parentNode === a.parent ? a.next : null)
                                : a.el.remove();
  if (a.type === 'move')   place(a.el, back ? a.from : a.to);
}
function commit(a) { past.push(a); future.length = 0; sync(); }
function undo() { const a = past.pop(); if (a) { apply(a, true);  future.push(a); sync(); } }
function redo() { const a = future.pop(); if (a) { apply(a, false); past.push(a);  sync(); } }
```

Unfilled SVG shapes and thin strokes are hard to hit with the eraser and select. Give closed shapes `pointer-events: visible` and give open paths an invisible 16px-wide twin:

```css
.ink .solid { pointer-events: visible; }
.ink .hit { stroke: transparent; stroke-width: 16; fill: none; pointer-events: stroke; }
```

Common mistakes:

- A frosted, rounded-everything dock. This one is flat cream with a hard ink shadow; the canvas is the colourful part.
- Opening the flyout on hover. It opens on click or ArrowUp and stays until a choice or Escape.
- Toggling the whole dock into a hamburger on phones. Keep the primary tools visible; only the secondary row folds.
- Undo buttons that are always enabled.
- Firing letter shortcuts while the user is typing in a sticky.
- Re-rendering the dock on every tool change, which loses focus.
- Using `click` for drawing; use pointer events with pointer capture so a drag that leaves the board still ends.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
