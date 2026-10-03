<!-- Design Lounge Nº 221 · "Password field" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Password field

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the field and Show share `--control` and `--radius`. This is `text-field` plus the reveal. Do not invent a second input style.

## What it is

The password on the yard account. It starts as `type="password"` with the value gate-1842, so the glyphs are masked. Show sits to the right of the field, same 40px height, outline. Pressing Show sets the type to text, the button to Hide, and `aria-pressed` to true. Pressing Hide masks it again. The hint under the field says the yard issued it and it is not the badge number. There is no strength meter and no second rule about symbols.

## Reference behaviour

1. The field is masked. Show is not pressed. The hint is visible.
2. Show reveals gate-1842 and the button reads Hide.
3. Hide masks it again and the button reads Show.
4. The value does not change when you toggle. Only the type changes.
5. There is no animation and no submit.
6. Focus ring is 2px `--focus`, offset 2px, on the field and on the button.

## Structure

```
padding 48px 64px
Yard account                 12px
width 320
  Password                   label
  [ masked ] [ Show ]        both 40px
  The yard issued this. It is not the badge number.
```

- The label is tied to the input.
- Show has `aria-controls` pointing at the input and `aria-pressed`.
- The hint is a paragraph under the row.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --ink-3: #5c564e;
  --line-strong: #cfc6b8;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

Radius is 2px. The family replaces it on both controls. Show is outline. It is not a second primary. The screen's primary, if this sits on a sign-in, is the submit, which is not in this piece.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Label | sans | 12px | 500 | `--ink-2` |
| Value | sans | 14px | 400 | `--ink` |
| Show | sans | 13px | 500 | `--ink` |
| Hint | sans | 12px | 400 | `--ink-3` |

The where-line letter-spacing is 0.04em. The masked value uses the browser's password glyphs. Do not draw dots in a second font.

## Motion

None. The type swaps in one frame. Reduced motion has nothing to remove.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Show | click | type text, label Hide, pressed |
| Hide | click | type password, label Show, not pressed |

## States

- Field: height 40px, padding 0 12px, radius 2px, 1px `--line-strong`, surface, flex 1.
- Show resting: height 40px, padding 0 14px, outline, `aria-pressed="false"`.
- Show pressed: the same outline. The word changes to Hide. Do not fill it solid.
- Hint: 12px `--ink-3`.
- Focus-visible: 2px outline, offset 2px.
- Do not add an eye icon from outside Lounge Icons. This demo uses the word, which is the accessible name.

## Accessibility

- The label Password is visible.
- Show and Hide are the button names. `aria-pressed` matches the revealed state.
- The hint is in the field group, so it is read with the control.
- Autocomplete is `current-password`.
- Hit targets are 40px. On a phone, at least 44px.
- Contrast of the value and the hint on the paper clears 4.5.
- Revealing the password is a choice. Do not reveal it on focus alone.

## Responsive rules

- At 1280 the group is 320px, padding 48px 64px.
- Below 640 the group is full width inside 20px padding. Show stays on the right of the field. If the row is under 280px, Show may wrap under and stay 40px tall.
- Do not replace this with a native reveal that ignores the radius.

## Acceptance checklist

- [ ] The label is Password. The value is gate-1842. It starts masked.
- [ ] Show reveals the value and reads Hide.
- [ ] Hide masks it and reads Show.
- [ ] The hint says the yard issued it and it is not the badge number.
- [ ] Field and button are 40px tall, radius 2px.
- [ ] Show is outline, not a solid primary.
- [ ] `aria-pressed` is true only while the value is visible.
- [ ] Focus ring is 2px, offset 2px.
- [ ] There is no strength meter and no animation.
- [ ] The value is unchanged by the toggle.

## Implementation notes

Toggle the type. Do not copy the value into a second element.

```js
const on = pw.type === 'password';
pw.type = on ? 'text' : 'password';
show.textContent = on ? 'Hide' : 'Show';
```

Common mistakes:

- A text field with no reveal, so the person cannot check what they typed.
- An eye icon with no name.
- Show as a solid primary beside a sign-in button that is also solid.
- A strength meter with four colours. This piece does not score the password.
- Clearing the value when it is revealed.
- A different radius on Show than on the field.

Where it sits in a product:

1. It is the password control. `text-field` is the open text. `otp-code` is a code from a letter.
2. Show is outline. One primary per view, and it is not Show.
3. Height and radius come from the family.
4. The hint stays `--ink-3`. An error, if the password is wrong, replaces the hint in `--danger`, the same rule as `text-field`. This demo does not fail.
5. When a theme is locked, the paper and the ink come from the theme.
6. Do not log the value. Do not put it in the hint.
7. The where-line Yard account matches the text field. The badge number there is Y-1842. This password is gate-1842. They are different.
8. A sign-in page is `split-sign-in`. Use this control on it. Do not draw a third password style.
9. Keep the credit line on the token block.
10. One password field. A confirm field is a second one of the same control, with its own label.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place the label, the masked field, and Show.
3. Place the hint.
4. Wire the toggle.
5. Check the value survives Hide.
6. Map height and radius onto the family.

Copy you keep:

1. Yard account.
2. Password.
3. gate-1842.
4. Show. Hide.
5. The yard issued this. It is not the badge number.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
