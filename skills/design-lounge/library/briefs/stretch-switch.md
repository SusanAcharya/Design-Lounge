<!-- Design Lounge Nº 269 · "Stretch switch" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Stretch switch

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

One checkbox. It starts checked. The label reads Hold is on. The thumb is 28px and, while the pointer is down, it grows to 36px. Checked, the thumb sits 28px to the right. Checked and pressed, it sits 20px to the right so the wider thumb stays in the track. This is not a settings row. That row is `switch-row`. A set of switches is `toggle-switch-set`.

## Reference behaviour

1. The box starts checked. The label is Hold is on.
2. The track is 64 by 36, radius 999px, fill #e4dfd4, and #1f4d3a when checked.
3. The thumb is 28 by 28, white, 4px from the top and left.
4. Checked translates the thumb 28px.
5. Active grows the thumb to 36px. Checked and active translates 20px.
6. Change sets the label to Hold is on or Hold is off.
7. Reduced motion removes the transitions. The thumb still moves.

## Structure

```
[thumb track]  Hold is on
```

- The label is a flex row, gap 14px.
- The input is 1 by 1 px and opacity 0, so it stays in the tree.
- The track is aria-hidden. The input carries the state.
- Focus-visible on the input draws the outline on the track.
- The label text is 16px, weight 500.

## Tokens

```css
:root { --bg:#f6f4ef; --ink:#161513; --line:#cfc6b8; --track:#e4dfd4; --primary:#1f4d3a; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Label | IBM Plex Sans | 16px | 500 |

## Motion

- Thumb | check or press | translate and width | next translate and width | 220ms cubic-bezier(0.16,1,0.3,1) for transform, 120ms for width. Reduced motion snaps.

## States

- On: checked, green track, label Hold is on.
- Off: grey track, label Hold is off.
- Pressed: thumb width 36px.
- Focus: outline on the track.

## Accessibility

- The control is a checkbox inside a label.
- The track is aria-hidden.
- The visible sentence matches checked.
- Focus ring is 2px #1f4d3a, offset 3px, drawn on the track.
- Space toggles the checkbox.
- Do not use a div as the switch.

## Responsive rules

- The row stays centered.
- The track stays 64 by 36.
- Below 360 the label wraps beside the track. The hit area stays the label.

## Acceptance checklist

### Always

- [ ] It starts on.
- [ ] The thumb widens while pressed.
- [ ] The label matches the box.
- [ ] The input is the control.
- [ ] Reduced motion still toggles.

### This demo

- [ ] The label starts as Hold is on.
- [ ] Off reads Hold is off.
- [ ] Track 64 by 36. Thumb 28, pressed 36.
- [ ] Checked travel is 28px. Pressed checked travel is 20px.
- [ ] Type is IBM Plex Sans.

## Implementation notes

Keep the wider thumb inside the track.

```css
input:checked:active + .track .thumb { transform: translateX(20px); }
```

28 + 36 would pass the end of a 64px track. 20 + 36 + 4 fits.

## Measurements to keep

- Track 64×36. Thumb 28×28, inset 4px. Pressed width 36px.
- Checked translateX 28px. Checked active translateX 20px.
- Gap 14px. Label 16px, weight 500.
- Transform 220ms. Width 120ms. Track colour 200ms.
- Focus offset 3px.

## Wrong turns

- Do not use a button instead of a checkbox.
- Do not hide the on or off sentence.
- Do not start off. The first frame is on.
- Do not let the thumb leave the track.
- Do not animate under reduced motion.
- Do not add a second switch.

## Fit with the rest of the library

- A settings row is `switch-row`.
- A set is `toggle-switch-set`.
- This is the stretch.
- One switch.
- Type is IBM Plex Sans.
- The ground is #f6f4ef.

## Keyboard

- Space toggles the checkbox.
- The label updates on change.
- The track is not a tab stop.
- Do not use a positive tabindex.
- Focus outline sits on the track.
- It starts checked.
- Reduced motion snaps.
- One control.
- Type is IBM Plex Sans.
- Escape does nothing.
- The thumb width is 36px only while active.
- Checked travel is 28px.
- Pressed checked travel is 20px.
- The input stays 1 by 1 px.
- The sentence is Hold is on or Hold is off.
- Do not trap focus.

## Rebuild order

1. Build step: The box starts checked. The label is Hold is on.
2. Build step: The track is 64 by 36, radius 999px, fill #e4dfd4, and #1f4d3a when checked.
3. Build step: The thumb is 28 by 28, white, 4px from the top and left.
4. Build step: Checked translates the thumb 28px.
5. Build step: Active grows the thumb to 36px. Checked and active translates 20px.
6. Build step: Change sets the label to Hold is on or Hold is off.
7. Build step: Reduced motion removes the transitions. The thumb still moves.

- Keep this measurement while rebuilding: Track 64×36. Thumb 28×28, inset 4px. Pressed width 36px.
- Keep this measurement while rebuilding: Checked translateX 28px. Checked active translateX 20px.
- Keep this measurement while rebuilding: Gap 14px. Label 16px, weight 500.
- Keep this measurement while rebuilding: Transform 220ms. Width 120ms. Track colour 200ms.
- Keep this measurement while rebuilding: Focus offset 3px.

- While rebuilding, remember: Do not use a button instead of a checkbox.
- While rebuilding, remember: Do not hide the on or off sentence.
- While rebuilding, remember: Do not start off. The first frame is on.
- While rebuilding, remember: Do not let the thumb leave the track.
- While rebuilding, remember: Do not animate under reduced motion.
- While rebuilding, remember: Do not add a second switch.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
