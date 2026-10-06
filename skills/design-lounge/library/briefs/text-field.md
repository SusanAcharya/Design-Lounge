<!-- Design Lounge Nº 448 · "Text field" · www.designlounge.live -->

# Text field

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens and the family's radius and control height. This is the field in the component sheet, not a second control.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Three fields on a yard account, stacked in a 320px column on warm paper. Name is filled with Mira Shrestha and a hint under it. Gate code starts empty, with a danger border and the sentence "Enter the four-digit code." Badge number shows Y-1842 and is disabled, with a hint that the yard issued it. The label sits above each field at 12px. The input is 40px tall with a 2px radius. The error replaces the hint. It is not a toast.

## Structure

```
padding 48px 64px
Yard account                 12px
column, width 320, gap 16
  Name                       label 12px
  [ Mira Shrestha ]          40px
  As it appears on the gate pass.
  Gate code
  [ empty ]                  danger border
  Enter the four-digit code.
  Badge number
  [ Y-1842 ]                 disabled
  Issued by the yard. You cannot edit it.
```

- One `form`. Each control is a `.field` with a `label`, an `input`, and either a hint or an error.
- The error uses `id="code-err"`. The gate input points at it with `aria-describedby` while the error is showing.
- The badge input has the `disabled` attribute.

## Motion

None. The error appears and disappears in one frame. Reduced motion has nothing to remove. Do not shake the field.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Input | each key | error hides only at four digits |
| Focus | keyboard | 2px ring, offset 2px |
| Disabled | always | no focus, no typing |

## States

- Resting input: height 40px, padding 0 12px, radius 2px, 1px `--line-strong`, surface fill, 14px `--ink`.
- Hint: 12px `--ink-3`, under the input, gap 6px from the label group.
- Error: 12px `--danger`. The input border becomes `--danger`. `aria-invalid` is true.
- When the error shows, do not also show the hint. One line under the field.
- Disabled: background `--surface-2`, text `--ink-2`, no opacity fade. The value must stay readable. Disabled buttons in `button-roles` may fade. A disabled value that the person must read does not.
- Focus-visible: 2px outline, offset 2px. Do not add a second glow.
- Do not put a green check icon in the valid field. The missing error is the valid state.

## Accessibility

- Every input has a visible label, tied with `for` and `id`.
- Gate code uses `inputmode="numeric"` and `aria-invalid`.
- The error is in the field, so it is read with the control. It is not a live toast.
- The disabled badge is out of the tab order because of the `disabled` attribute. Do not use `aria-disabled` on an input that still accepts keys.
- Hit target: each input is 40px tall.
- Contrast: `#161513` on white, `#5c564e` on `#f6f4ef`, and `#9b2c2c` on `#f6f4ef` clear 4.5. The disabled value `#5a554c` on `#f0ebe3` stays above 4.5. Do not drop it with opacity.
- Autocomplete is `name` on the name field and `off` on the code.

## Responsive rules

- At 1280 the column is 320px, left aligned, padding 48px 64px. The rest of the frame stays empty. This is the control, not a settings page.
- At 768 the column may grow to the content width, max 420px.
- Below 640 the column is full width inside 20px padding. Inputs stay at least 40px tall. On a phone the control height becomes the family's phone height, at least 44px.

## Acceptance checklist

- [ ] Three fields: Name, Gate code, Badge number.
- [ ] Name shows Mira Shrestha and the gate-pass hint.
- [ ] Gate code starts empty with the error "Enter the four-digit code."
- [ ] The error hides only when the code is four digits, and returns if a digit is deleted.
- [ ] Badge number is Y-1842 and cannot be edited.
- [ ] Inputs are 40px tall, 320px wide, radius 2px.
- [ ] Labels are 12px above the inputs.
- [ ] The error is 12px `#9b2c2c` under the field, not a toast.
- [ ] The disabled field is not faded below a readable value.
- [ ] Focus ring is 2px, offset 2px.
- [ ] There is no submit button and no animation.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The first frame shows all three fields. Gate code is empty, `aria-invalid` is true, and the error is visible.
2. Typing in Gate code hides the error only when the value is exactly four digits. Any other length keeps the error and `aria-invalid="true"`.
3. Name keeps its hint. Nothing validates Name in this piece.
4. Badge number does not accept input. It stays Y-1842.
5. There is no submit button. The error is the field's own state, the way it looks after a failed check.
6. Focus ring is 2px `--focus`, offset 2px, on the inputs that can be focused. The disabled input is not in the tab order.
7. There is no animation.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --surface-2: #f0ebe3;
  --ink: #161513;
  --ink-2: #5a554c;
  --ink-3: #5c564e;
  --line: #e4dfd4;
  --line-strong: #cfc6b8;
  --primary: #1f4d3a;
  --danger: #9b2c2c;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

Radius is 2px because this demo sits with the industrial yard controls, including `select-field`. A locked family replaces the radius and the 40px height. Quiet is 6px and 40px. Soft is 14px and 44px. Do not keep 2px after the family is locked.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Label | sans | 12px | 500 | `--ink-2` |
| Value | sans | 14px | 400 | `--ink` |
| Hint | sans | 12px | 400 | `--ink-3` |
| Error | sans | 12px | 400 | `--danger` |
| Disabled value | sans | 14px | 400 | `--ink-2` |

The where-line letter-spacing is 0.04em. Values are left aligned, vertically centered in the 40px input.

## Implementation notes

The check is the pattern, not a library. Four digits is this demo's rule. A product replaces it with the real rule and keeps the label, the hint, and the error under the field.

```js
const ok = /^\d{4}$/.test(code.value);
code.setAttribute('aria-invalid', ok ? 'false' : 'true');
err.hidden = ok;
```

Hide the error with the `hidden` attribute so it leaves the accessibility tree.

Common mistakes:

- A floating label that covers the value.
- An error toast, or a red border with no sentence.
- Hint and error showing at the same time.
- Opacity on a disabled value the person must read.
- A 32px input. The height matches the button.
- A pill radius when the locked family is not a pill.
- Placeholder text instead of a label.
- A green check icon beside a valid field.
- Validating on first paint for a field the person has not touched, except this demo, which starts in the error so the state is visible. A product shows the error after submit or after blur, not on an untouched field.
- One field style on this screen and another on the select beside it.

Where it sits in a product:

1. It is the text control. `select-field` is the short list. `radio-group` is two to five visible choices. `slider-field` is a number on a track.
2. The label is above. The hint is `--ink-3`. The error is `--danger` and replaces the hint.
3. Height and radius come from the family. This demo's 40px and 2px are the yard, not the law.
4. One column of fields. Do not lay three fields in a row on a phone.
5. A password uses this field plus a show button of height `--control`. Do not invent a second input style for it.
6. The where-line "Yard account" is the screen name. It is not a second heading inside the field.
7. When a theme is locked, the paper, the green, and the red become that theme's tokens. The danger text stays `--danger`, not the brand red.
8. Keep the credit line on the token block.
9. Do not wrap one field in a card.
10. Empty and error are different. Empty with no rule is a blank field. Error is a failed rule.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place the where-line and the 320px column.
3. Place Name, filled, with the hint.
4. Place Gate code, empty, invalid, with the error.
5. Place Badge number, disabled, with its hint.
6. Wire the input listener so four digits clears the error.
7. Check a fifth digit, or a deleted digit, brings the error back.
8. Check the badge cannot be focused.
9. Replace radius and height with the locked family when a kit is on.
10. Map the hexes onto the theme tokens.

Copy you keep:

1. Yard account.
2. Name. Mira Shrestha. As it appears on the gate pass.
3. Gate code. Enter the four-digit code.
4. Badge number. Y-1842. Issued by the yard. You cannot edit it.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
