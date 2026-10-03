<!-- Design Lounge Nº 191 · "Focus dim" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Focus dim

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A 2 by 2 board. Gate 4, Night book, Month close, Yard map. Pressing a card sets aria-pressed and dims the others to .35. Pressing the same card clears the press and the dim. This is not a spotlight that follows the pointer. That grid is `spotlight-hover-grid`. The dim is a choice.

## Reference behaviour

1. No card starts pressed. Opacity is 1.
2. Click sets aria-pressed true on that card and data-focus true on the grid.
3. Other cards go to opacity .35.
4. The pressed card stays at opacity 1.
5. Clicking the pressed card clears every aria-pressed and sets data-focus false.
6. Only one card is pressed.
7. There is no transition.

## Structure

```
640px
[ Gate 4 ] [ Night book ]
[ Month close ] [ Yard map ]
```

- The grid is 640px, two columns, gap 12px.
- Each card is a button, min-height 140px, padding 20px, radius 2px.
- The name is 20px, weight 600. The line under it is 14px, #5a554c.
- data-focus true sets button opacity .35, except the pressed button.
- The ground is #f6f4ef. Cards are white.

## Tokens

```css
:root { --bg:#f6f4ef; --surface:#fff; --ink:#161513; --ink-2:#5a554c; --line:#e4dfd4; --primary:#1f4d3a; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Name | IBM Plex Sans | 20px | 600 |
| Line | IBM Plex Sans | 14px | 500 |

## Motion

- Dim | click | opacity 1 | opacity .35 | none | the others dim

## States

- Even: no press, data-focus false.
- One pressed: that card full, others .35.
- Press again: even.
- Hover does not dim.

## Accessibility

- Each card is a button with aria-pressed.
- The name is in the button, not only in colour.
- Opacity .35 is not the only state. aria-pressed marks the choice.
- Focus ring is 2px #1f4d3a, offset 3px.
- Do not remove the dimmed cards from the tab order.
- The lines stay readable enough to identify the card. If a product needs the dimmed text above 4.5, raise .35 toward .6. This demo uses .35.

## Responsive rules

- The grid is 640px at 1280.
- Below 700 it is one column, calc(100% - 32px). Cards stay min-height 140px.
- The dim rule does not change.

## Acceptance checklist

### Always

- [ ] Press dims the others.
- [ ] Press again clears.
- [ ] One pressed card at most.
- [ ] Names stay in the buttons.
- [ ] No pointer spotlight.

### This demo

- [ ] Cards are Gate 4, Night book, Month close, Yard map.
- [ ] Lines mention twelve loads, 22:00, totals, and a map.
- [ ] Dim is opacity .35.
- [ ] None start pressed.
- [ ] Type is IBM Plex Sans.

## Implementation notes

Clear every press, then set the clicked card if it was off.

```js
if (!on) b.setAttribute("aria-pressed", "true");
grid.dataset.focus = String(buttons.some((x) => x.getAttribute("aria-pressed") === "true"));
```

Set aria-pressed false on all buttons first.

## Measurements to keep

- Grid 640px, gap 12px, two columns.
- Card min-height 140px, padding 20px, radius 2px.
- Name 20px, margin-bottom 6px. Line 14px.
- Dim opacity .35. Pressed opacity 1.
- Focus offset 3px.

## Wrong turns

- Do not dim on hover.
- Do not start with a card pressed.
- Do not hide the dimmed cards.
- Do not follow the pointer.
- Do not select more than one.
- Do not animate a glow.

## Fit with the rest of the library

- A feature bento is `bento-feature-grid`.
- A pointer spotlight is `spotlight-hover-grid`.
- This is a press.
- Four cards.
- Type is IBM Plex Sans.
- The ground is #f6f4ef.

## Keyboard

- Enter presses the focused card.
- aria-pressed toggles that card and clears the others.
- Tab order is the four buttons.
- Dimmed cards stay tabbable.
- Do not use a positive tabindex.
- None start pressed.
- Focus offset is 3px.
- data-focus follows whether any card is pressed.
- Four cards.
- No hover dim.
- Type is IBM Plex Sans.
- Escape does nothing.
- The second Enter on the same card clears.
- Opacity .35 is the dim.
- Names are strong elements inside the button.
- Do not trap focus.

## Rebuild order

1. Build step: No card starts pressed. Opacity is 1.
2. Build step: Click sets aria-pressed true on that card and data-focus true on the grid.
3. Build step: Other cards go to opacity .35.
4. Build step: The pressed card stays at opacity 1.
5. Build step: Clicking the pressed card clears every aria-pressed and sets data-focus false.
6. Build step: Only one card is pressed.
7. Build step: There is no transition.

- Keep this measurement while rebuilding: Grid 640px, gap 12px, two columns.
- Keep this measurement while rebuilding: Card min-height 140px, padding 20px, radius 2px.
- Keep this measurement while rebuilding: Name 20px, margin-bottom 6px. Line 14px.
- Keep this measurement while rebuilding: Dim opacity .35. Pressed opacity 1.
- Keep this measurement while rebuilding: Focus offset 3px.

- While rebuilding, remember: Do not dim on hover.
- While rebuilding, remember: Do not start with a card pressed.
- While rebuilding, remember: Do not hide the dimmed cards.
- While rebuilding, remember: Do not follow the pointer.
- While rebuilding, remember: Do not select more than one.
- While rebuilding, remember: Do not animate a glow.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
