<!-- Design Lounge Nº 231 · "Edge light button" · www.designlounge.live -->

# Edge light button

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A dark button, Open the gate, with a 2px gold edge that rotates. The light is one gold arc in a conic gradient, not a rainbow and not a glow on the page. Click writes Gate 4 opened on this page. Reduced motion stops the rotation. The ring can stay. This is not a button that morphs to a check. That morph is `button-state-morph`.

## Structure

```
[ Open the gate ]
status under the button
```

- The wrap is inline-grid, position relative.
- ::before is inset -2px, radius 4px, conic-gradient.
- The button is 52px tall, padding 0 22px, radius 2px.
- The status sits 72px below the top of the wrap, colour #a39b90, 14px.
- Focus outline is 2px #d7b15e, offset 6px.

## Motion

- Ring | always | rotate 0 | rotate 360deg | 2.8s linear infinite. Reduced motion stops the rotation.

## States

- Resting: ring turning, status empty.
- Clicked: status filled. The ring keeps turning unless motion is reduced.
- Focus: gold outline, offset 6px.
- Reduced: ring still, no spin.

## Accessibility

- The button name is Open the gate.
- The status is polite.
- The ring is a pseudo-element.
- Reduced motion stops the spin.
- Focus ring is 2px #d7b15e, offset 6px.
- The label contrast on #1c1b19 stays above 4.5.

## Responsive rules

- The button is content-sized and centered.
- Below 360 the status wraps inside the viewport padding.
- The ring stays 2px outside the button.

## Acceptance checklist

### Always

- [ ] One gold arc, not a rainbow.
- [ ] The label stays readable.
- [ ] Click writes one sentence.
- [ ] Reduced motion stops the spin.
- [ ] The ring is behind the button fill.

### This demo

- [ ] The label is Open the gate.
- [ ] The sentence is Gate 4 opened on this page.
- [ ] Gold is #d7b15e.
- [ ] The spin is 2.8s.
- [ ] The ground is #141311.

## Measurements to keep

- Button height 52px, padding 0 22px, radius 2px.
- Ring inset -2px, radius 4px, spin 2.8s.
- Status top 72px, 14px, colour #a39b90.
- Focus offset 6px.
- Fill #1c1b19. Gold #d7b15e.

## Wrong turns

- Do not use a rainbow gradient.
- Do not glow the whole page.
- Do not depend on @property.
- Do not hide the label.
- Do not spin the label.
- Do not add a second light colour.

## Fit with the rest of the library

- A morph is `button-state-morph`.
- A magnetic button is `magnetic-buttons`.
- This is one traveling edge.
- Do not put the ring on every control.
- Type is IBM Plex Sans.
- The ground is near-black.

## Keyboard

- Enter activates the button.
- The status is polite.
- The ring is not a tab stop.
- Do not use a positive tabindex.
- Focus offset is 6px.
- Reduced motion stops the spin.
- One button.
- The sentence does not change on a second click.
- Type is IBM Plex Sans.
- Escape does nothing.
- The label stays Open the gate.
- Gold is #d7b15e.
- The spin is linear because it is a loop, not a layout move.
- No fetch.
- The fill covers the center.
- Do not trap focus.

## Rebuild order

1. Build step: The button reads Open the gate. The status is empty.
2. Build step: A conic gradient of #d7b15e and transparent sits 2px outside the button and rotates 360deg in 2.8s, linear, infinite.
3. Build step: Click sets the status to Gate 4 opened on this page.
4. Build step: The status is aria-live polite.
5. Build step: The button fill stays #1c1b19. The label stays #f4f1ea.
6. Build step: Reduced motion sets animation none on the ring.
7. Build step: The ring does not cover the label. The button is position relative.

- Keep this measurement while rebuilding: Button height 52px, padding 0 22px, radius 2px.
- Keep this measurement while rebuilding: Ring inset -2px, radius 4px, spin 2.8s.
- Keep this measurement while rebuilding: Status top 72px, 14px, colour #a39b90.
- Keep this measurement while rebuilding: Focus offset 6px.
- Keep this measurement while rebuilding: Fill #1c1b19. Gold #d7b15e.

- While rebuilding, remember: Do not use a rainbow gradient.
- While rebuilding, remember: Do not glow the whole page.
- While rebuilding, remember: Do not depend on @property.
- While rebuilding, remember: Do not hide the label.
- While rebuilding, remember: Do not spin the label.
- While rebuilding, remember: Do not add a second light colour.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The button reads Open the gate. The status is empty.
2. A conic gradient of #d7b15e and transparent sits 2px outside the button and rotates 360deg in 2.8s, linear, infinite.
3. Click sets the status to Gate 4 opened on this page.
4. The status is aria-live polite.
5. The button fill stays #1c1b19. The label stays #f4f1ea.
6. Reduced motion sets animation none on the ring.
7. The ring does not cover the label. The button is position relative.

## Tokens

```css
:root { --bg:#141311; --fill:#1c1b19; --ink:#f4f1ea; --gold:#d7b15e; --muted:#a39b90; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Label | IBM Plex Sans | 15px | 600 |
| Status | IBM Plex Sans | 14px | 400 |

## Implementation notes

Rotate a conic gradient. Do not use @property.

```css
.wrap::before { background: conic-gradient(#d7b15e, transparent 40%, #d7b15e); animation: spin 2.8s linear infinite; }
```

The button background covers the middle so only the edge shows.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
