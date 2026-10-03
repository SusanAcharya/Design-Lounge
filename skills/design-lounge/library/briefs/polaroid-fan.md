<!-- Design Lounge Nº 266 · "Polaroid fan" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Polaroid fan

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Five yard prints in a pile. The first frame is the open fan. Click stacks them. Click opens the arc again. Each print is a white card with a colour block and a name: Gate, Night, Month, Yard, Hold. This is not a folder of notes. That folder is `folder-reveal`. This is not a 3D flip. That flip is `card-flip-3d`.

## Reference behaviour

1. The fan starts open. aria-expanded is true.
2. Open offsets run from translate -150px rotate -16deg to translate 160px rotate 16deg.
3. Click sets data-open false and the prints share one stack.
4. Click again opens the fan.
5. The whole pile is one button.
6. The move is 480ms.
7. Reduced motion snaps between poses.

## Structure

```
520×420 pile
five 200×240 prints
```

- The pile button is 520 by 420.
- Each print is 200 by 240, padding 12px, with a 160px colour block.
- The name is Fraunces 16px at the bottom.
- Open class rules live on data-open true.
- The button label changes between fan open and stacked.

## Tokens

```css
:root { --bg:#f4f1ea; --ink:#1a1814; --primary:#1f4d3a; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Name | Fraunces | 16px | 560 |
| Button | Public Sans | 14px | 500 |

## Motion

- Prints | click | stacked | fanned | 480ms cubic-bezier(0.16,1,0.3,1). Reduced motion snaps.

## States

- Open: data-open true, aria-expanded true.
- Stacked: data-open false.
- Hover does not fan. Only the click does, because the first frame is already open.
- Focus ring sits on the pile button.

## Accessibility

- One button names the state: Yard prints, fan open, or stacked.
- Print names are text inside the button.
- aria-expanded matches the fan.
- Reduced motion still toggles the pose.
- Focus ring is 2px #1f4d3a, offset 3px.
- Colour blocks are empty elements, not the names.

## Responsive rules

- The pile is 520px at 1280.
- Below 560 the translations shrink so prints stay inside the viewport.
- Do not turn the fan into a horizontal scroller.

## Acceptance checklist

### Always

- [ ] Starts open.
- [ ] One control toggles the fan.
- [ ] Five prints, each named.
- [ ] 480ms or none.
- [ ] aria-expanded matches the pose.

### This demo

- [ ] Names are Gate, Night, Month, Yard, Hold.
- [ ] Swatches are green, brown, gold, grey, red.
- [ ] The label starts as Yard prints, fan open.
- [ ] Ground is #f4f1ea.
- [ ] Names are Fraunces.

## Implementation notes

Drive every print from data-open on the pile.

```css
.pile[data-open="true"] .s0 { transform: translate(-150px,20px) rotate(-16deg); }
```

Do not start closed. The fan is the picture.

## Measurements to keep

- Pile 520×420. Print 200×240. Colour block 160px tall.
- Fan rotations -16, -8, 0, 8, 16 degrees.
- Transition 480ms.
- Name 16px Fraunces.
- Padding 12px.

## Wrong turns

- Do not start closed.
- Do not use photographs of people.
- Do not drag individual prints in this piece.
- Do not flip them over.
- Do not add a sixth print.
- Do not autoplay the fan.

## Fit with the rest of the library

- A folder of notes is `folder-reveal`.
- A card flip is `card-flip-3d`.
- A coverflow is `coverflow-strip`.
- This is a stack that fans.
- Ground is paper.
- Names are Fraunces.

## Keyboard

- Enter toggles the fan.
- Space toggles the fan.
- There is one tab stop.
- aria-expanded flips.
- Escape does nothing.
- Do not use a positive tabindex.
- The prints are not separate buttons.
- Reduced motion snaps.
- The first frame is open.
- The accessible name includes the state.
- Focus offset is 3px.
- Five names stay in the button.
- No drag.
- No autoplay.
- Display type is Fraunces.
- The ground is #f4f1ea.

## Rebuild order

1. Build step: The fan starts open. aria-expanded is true.
2. Build step: Open offsets run from translate -150px rotate -16deg to translate 160px rotate 16deg.
3. Build step: Click sets data-open false and the prints share one stack.
4. Build step: Click again opens the fan.
5. Build step: The whole pile is one button.
6. Build step: The move is 480ms.
7. Build step: Reduced motion snaps between poses.

- Keep this measurement while rebuilding: Pile 520×420. Print 200×240. Colour block 160px tall.
- Keep this measurement while rebuilding: Fan rotations -16, -8, 0, 8, 16 degrees.
- Keep this measurement while rebuilding: Transition 480ms.
- Keep this measurement while rebuilding: Name 16px Fraunces.
- Keep this measurement while rebuilding: Padding 12px.

- While rebuilding, remember: Do not start closed.
- While rebuilding, remember: Do not use photographs of people.
- While rebuilding, remember: Do not drag individual prints in this piece.
- While rebuilding, remember: Do not flip them over.
- While rebuilding, remember: Do not add a sixth print.
- While rebuilding, remember: Do not autoplay the fan.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
