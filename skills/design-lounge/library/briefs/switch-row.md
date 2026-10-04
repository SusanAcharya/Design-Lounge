<!-- Design Lounge Nº 436 · "Switch row" · designlounge.vercel.app -->

# Switch row

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the track colour follows the theme. One setting that is on or off is this row. Six switch costumes are `toggle-switch-set`. Do not ship all six.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

One setting for Gate 4. The label is Hold the gate. The switch starts off. The status reads "The gate is open." Turning it on sets `aria-checked` true, fills the track with the yard green, moves the thumb, and rewrites the status to "The gate is held." Turning it off restores the open sentence. The track is 44 by 24 with a 20px thumb. The row is at least 40px and 420px wide. There is one switch, not a set of temperaments, and it does not change the page theme.

## Structure

```
padding 48px 64px
Gate 4                       12px
width 420, min-height 40
  Hold the gate              label
  switch 44 × 24             thumb 20
status
```

- The label and the switch are one row. The button is labelled by the label's id.
- The thumb is `aria-hidden` by being inside the button with no text of its own.
- The status is `role="status"`.

## Motion

The thumb moves. Nothing else moves.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Thumb | toggle | translate 0 or 20px, 160ms |
| Track | on | fill `--primary` |
| Status | toggle | the sentence |

```css
@media (prefers-reduced-motion: reduce) {
  .thumb { transition: none; }
}
```

Do not bounce the thumb. Do not fade the whole page.

## States

- Off: track `#cfc6b8`, thumb white, at the left.
- On: track `#1f4d3a`, thumb `#fffdf8`, translated 20px.
- Focus-visible: 2px outline, offset 3px.
- Row: min-height 40px, space-between.
- Do not add a disabled state. The gate can always be held or released.
- Hover does not invent a third colour. The track is off or on.

## Accessibility

- The control is a `button` with `role="switch"` and `aria-checked`.
- `aria-labelledby` points at Hold the gate. Do not put "On" inside the button.
- The status is a live region, so the sentence is announced with the toggle.
- Hit target: the track is 24px tall inside a row of at least 40px. On a phone, make the row at least 44px. Do not shrink the track to 16px.
- Contrast: the label `#161513` on `#f6f4ef` clears 4.5. The on state is not colour alone. The status sentence changes.
- Keyboard: the button handles Space and Enter. Do not add a second key handler that fights the button.

## Responsive rules

- At 1280 the row is 420px, padding 48px 64px.
- Below 640 the row is full width inside 20px padding and at least 44px tall. The track stays 44 by 24.
- Do not stack a second switch under it to explain the first.
- A theme control that pulls a lamp cord is `lamp-theme-toggle`. This switch does not restyle the page.

## Acceptance checklist

- [ ] The label is Hold the gate. The switch starts off.
- [ ] The first status is "The gate is open."
- [ ] Turning it on sets aria-checked true and the status becomes "The gate is held."
- [ ] Turning it off restores "The gate is open."
- [ ] The track is 44 by 24. The thumb is 20px and moves 20px.
- [ ] On fill is `#1f4d3a`. Off fill is `#cfc6b8`.
- [ ] Focus ring is 2px, offset 3px.
- [ ] Reduced motion removes the thumb transition.
- [ ] There is one switch, no ON/OFF lettering, and no theme change.
- [ ] The where-line is Gate 4.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The first frame is off. `aria-checked` is false. The status is "The gate is open."
2. Click or Space or Enter toggles the switch. It is a button, so those keys come free.
3. On: the track is `--primary`, the thumb sits at the right, the status is "The gate is held."
4. Off: the track is `--line-strong`, the thumb sits at the left, the status is "The gate is open."
5. The thumb moves 20px. With reduced motion the move is instant. Otherwise it takes 160ms.
6. Focus-visible is a 2px outline, offset 3px.
7. There is no second switch and no submit.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --ink-3: #5c564e;
  --line-strong: #cfc6b8;
  --primary: #1f4d3a;
  --primary-ink: #fffdf8;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

The track is a pill because a thumb travels inside it. That pill is the switch, not the family's button radius. Do not square the track into a checkbox.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Label | sans | 14px | 500 | `--ink` |
| Status | sans | 12px | 400 | `--ink` |

The where-line letter-spacing is 0.04em. The switch has no text inside it. On and off are the status sentence, not the words ON and OFF printed on the track.

## Implementation notes

Toggle `aria-checked`. Paint from that attribute. Do not keep a second boolean in a class that can drift.

```js
const on = hold.getAttribute('aria-checked') !== 'true';
hold.setAttribute('aria-checked', on ? 'true' : 'false');
```

Common mistakes:

- Six switch styles on one card. That specimen is `toggle-switch-set`. A product ships one.
- Two radios named On and Off. A pair of named states such as Morning and Night is `radio-group`. This is a single setting.
- A checkbox with a long label for a form list. Several loads are `checkbox-group`.
- A lamp that changes the theme. That is `lamp-theme-toggle`.
- Printing ON inside the track and also changing the status, so the state is said twice in different words.
- A square track on the theory that the family button is square. The thumb needs a track.
- Forgetting `role="switch"`, so it is only a button that moves a circle.

Where it sits in a product:

1. Use it for one setting the person can turn on or off without leaving the page.
2. The label is the setting. The status is the result, in a sentence.
3. One switch on a screen. A settings page of many rows uses this same track, repeated, not six drawings.
4. Colour comes from the theme. The track pill stays a pill.
5. Do not make this the page's primary button. It is a setting. The solid button, if the page has one, is elsewhere.
6. The where-line Gate 4 matches the time field and the property list.
7. Off means the gate is open. On means it is held. Do not invert that in the sentence.
8. 160ms is the thumb. Do not add a second animation on the label.
9. Phone rows are at least 44px. The track size stays.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place the label and the switch, off.
3. Write the open sentence.
4. Toggle aria-checked and the sentence together.
5. Honour reduced motion on the thumb.
6. Map the on colour onto the theme.

Copy you keep:

1. Gate 4.
2. Hold the gate.
3. The gate is open.
4. The gate is held.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
