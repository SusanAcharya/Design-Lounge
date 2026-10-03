<!-- Design Lounge Nº 199 · "Content card" · designlounge.vercel.app -->

# Content card

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the radius is `--radius-card` and the shadow is the family's shadow. This yard's shadow is none. A card that tilts toward the pointer is `hover-tilt-cards`. This one sits still.

## What it is

One load, as a card you can open. The kicker is Gate 4. The title is Rice. The weight is 2,400 kg. The meta is Mira Shrestha · 17 October. The card is 360px wide, padding 16px, radius 2px, a 1px line, white on the paper. It starts closed. Activating it sets `aria-pressed` true, fills it with the soft green, turns the border to the yard green, and shows "Load 1842 is open." Activating again closes it and hides that line. Hover uses the warm surface. There is no tilt, no flip, and no second card.

## Reference behaviour

1. The first frame is closed. `aria-pressed` is false. The status is hidden.
2. Click sets pressed true. The status becomes visible: "Load 1842 is open."
3. Click again sets pressed false and hides the status.
4. Hover, while not pressed, uses `--surface-2`. Pressed uses `--primary-soft` and a `--primary` border. Pressed and hovered uses `--surface-3`.
5. Focus-visible is a 2px outline, offset 2px.
6. There is no image, no badge, and no animation.

## Structure

```
padding 48px 64px
Loads                        12px
width 360, padding 16
  Gate 4                     12px kicker
  Rice                       20px title
  2,400 kg
  Mira Shrestha · 17 October
status, under the card
```

- The card is one button. The four lines are spans inside it.
- The status is outside the button so closing the card does not remove the live region.
- The status starts hidden.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --surface-2: #f0ebe3;
  --surface-3: #d7ebe1;
  --ink: #161513;
  --ink-2: #5a554c;
  --ink-3: #5c564e;
  --line: #e4dfd4;
  --primary: #1f4d3a;
  --primary-soft: #e7f2ec;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

Radius is 2px here. A locked family uses `--radius-card`. Do not also apply the button radius. Hover is `--surface-2`. Selected is `--primary-soft`.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Kicker | sans | 12px | 500 | `--ink-2` |
| Title | sans | 20px | 500 | `--ink` |
| Weight | sans | 14px | 400 | `--ink` |
| Meta | sans | 12px | 400 | `--ink-3` |
| Status | sans | 12px | 400 | `--ink` |

The kicker letter-spacing is 0.04em. The weight is tabular. The title is the largest type on the card. Do not set a second line at 20px.

## Motion

None. Pressed and closed swap in one frame. Reduced motion has nothing to remove. Do not tilt, flip, or lift a shadow.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Hover | pointer | `--surface-2` |
| Pressed | click | `--primary-soft`, primary border, status shows |
| Pressed hover | pointer on an open card | `--surface-3` |
| Closed | click again | surface, line border, status hides |

## States

- Resting: white, 1px `--line`, radius 2px, padding 16px, width 360px. Shadow none.
- Hover: `--surface-2`.
- Pressed: `--primary-soft`, border `--primary`.
- Pressed and hovered: `--surface-3`. The border stays `--primary`.
- Focus-visible: 2px outline, offset 2px.
- Status hidden until pressed.
- Do not add a second button inside the card. The card is the control.

## Accessibility

- The control is a button with `aria-pressed`.
- The accessible name is the text inside: Gate 4, Rice, 2,400 kg, Mira Shrestha, 17 October.
- The status is `role="status"` and is hidden while closed, so it is not announced as already open.
- Hit target: the card is far taller than 40px.
- Contrast: `#5c564e` on white and `#161513` on `#e7f2ec` clear 4.5. The green border is extra. The status sentence is the open state in words.
- Keyboard: the button handles Enter and Space.

## Responsive rules

- At 1280 the card is 360px, padding 48px 64px.
- Below 640 the card is full width inside 20px padding. Type sizes stay.
- A list of these cards is one column inside the pass width, or a grid whose cells are this card. The grid is structure. It is not a second page width.
- In a list, one card may be pressed. Do not paint every card as a solid primary button.
- Do not turn the card into a tilt on a small screen.

## Acceptance checklist

- [ ] The lines are Gate 4, Rice, 2,400 kg, and Mira Shrestha · 17 October.
- [ ] The card is 360px wide, padding 16px, radius 2px, on white, with a 1px line.
- [ ] It starts closed. The status is hidden.
- [ ] Opening it shows "Load 1842 is open." and fills `#e7f2ec` with a `#1f4d3a` border.
- [ ] Closing it hides the status and restores the white card.
- [ ] Hover is `#f0ebe3`.
- [ ] The title is 20px. The weight uses tabular numbers.
- [ ] There is no image, no badge, no tilt, and no shadow.
- [ ] Focus ring is 2px, offset 2px.
- [ ] Mira, Gate 4, 17 October, 2,400 kg, and 1842 match the property list.

## Implementation notes

Toggle `aria-pressed`. Show the status only while it is true.

```js
const on = card.getAttribute('aria-pressed') !== 'true';
card.setAttribute('aria-pressed', on ? 'true' : 'false');
status.hidden = !on;
```

Common mistakes:

- A card that tilts. That is `hover-tilt-cards`.
- A card that flips. That is `card-flip-3d`.
- A definition list of the same facts. That is `property-list`. Use the card when the load is one item in a list the person opens. Use the list when the facts are already on the open record.
- A solid primary button labelled Open inside the card, plus the card itself being clickable.
- A badge for Paid. State washes are `status-badge`. This card has no state wash.
- A shadow on a family whose shadow is none.
- A second title the same size as Rice.
- Recolouring the card to a brand gradient.

Where it sits in a product:

1. Use it for one record in a list: a load, a product, a note.
2. The radius is `--radius-card`. The page button radius is a different token.
3. Hover is `--surface-2`. The open card is `--primary-soft`.
4. One open card at a time if opening it shows a detail. This demo toggles a single card.
5. The facts match the property list. Do not give the card a different driver or a different weight.
6. When a theme is locked, surface, line, and the soft fill come from the theme.
7. The title is the name of the thing. The kicker is the place. Do not swap them.
8. Weight is 2,400 kg. Do not write it as a price.
9. The where-line Loads is the screen name. Load 1842 in the status is the record id.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place the four lines inside one button.
3. Leave the status hidden.
4. Toggle pressed, the fill, and the status together.
5. Check a closed hover, an open card, and an open card under the pointer.
6. Map the radius onto `--radius-card`.

Copy you keep:

1. Loads.
2. Gate 4.
3. Rice.
4. 2,400 kg.
5. Mira Shrestha · 17 October.
6. Load 1842 is open.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
