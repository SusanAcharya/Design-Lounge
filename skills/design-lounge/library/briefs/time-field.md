<!-- Design Lounge Nº 349 · "Time field" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Time field

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the radius and the 40px height follow the family. A day is `calendar-month`. This is a clock time.

## What it is

When Gate 4 closes. The label is Closes. Two fields sit with a colon between them: hour 18 and minute 00. The status reads "Gate 4 closes at 18:00." The hint says this is the same closing time as the dock note. An hour outside 0–23 or a minute outside 0–59 hides the hint and the status, marks both fields invalid, and shows "Use an hour from 0 to 23 and a minute from 0 to 59." A valid pair brings the status back, padded to two digits. This is not a slider, not a day on a month, and not a second closing time.

## Reference behaviour

1. The first frame is 18 and 00. The hint is visible. The error is hidden. The status is "Gate 4 closes at 18:00."
2. Editing either field rewrites the status when both values are in range, padded to two digits.
3. A value that is empty, not digits, hour above 23, or minute above 59 is invalid.
4. While invalid, both fields have `aria-invalid`, the hint hides, the status hides, and the error shows.
5. Returning to a real time restores the hint and the status.
6. Each field is 64px wide and 40px tall, radius 2px. The digit is 20px and tabular.
7. There is no submit button, no clock face, and no animation.
8. Focus-visible is a 2px outline, offset 2px.

## Structure

```
padding 48px 64px
Gate 4                       12px
width 420
  Closes                     label
  [ 18 ] : [ 00 ]            height 40
  hint or error
  status
```

- The visible label is Closes. Each field has its own accessible name, Hour and Minute.
- The colon is decorative.
- Hint and error do not show together. The status shows only while the time is valid.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --ink-3: #5c564e;
  --line-strong: #cfc6b8;
  --danger: #9b2c2c;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

Radius is 2px in this yard. The family replaces it. Do not draw a round clock.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Label | sans | 12px | 500 | `--ink-2` |
| Digit | sans | 20px | 400 | `--ink` |
| Colon | sans | 20px | 400 | `--ink` |
| Hint | sans | 12px | 400 | `--ink-3` |
| Error | sans | 12px | 400 | `--danger` |
| Status | sans | 12px | 400 | `--ink` |

Digits are tabular. The where-line letter-spacing is 0.04em. The locked pairing's number face replaces the digit face when that pairing sets numbers to display.

## Motion

None. Valid and invalid swap in one frame. Reduced motion has nothing to remove. Do not spin a hand.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Input | each key | range check |
| Valid | hour 0–23 and minute 0–59 | status, padded |
| Invalid | anything else | error, danger borders, hint and status hide |

## States

- Resting field: 64 by 40, padding 0 8px, radius 2px, 1px `--line-strong`, surface fill, centred digits.
- Hint: 12px `--ink-3`, only while valid.
- Error: 12px `--danger`. It replaces the hint.
- Invalid border: `--danger` on both fields.
- Status: only while valid.
- Focus-visible: 2px outline, offset 2px.
- `maxlength` is 2. `inputmode` is numeric.

## Accessibility

- Hour and Minute are the accessible names. Closes is the visible group label.
- `aria-invalid` is set on both fields together. A half-valid pair is still invalid.
- The error is next to the fields, not a toast.
- The status is `role="status"`.
- Hit target: each field is 40px tall.
- Contrast: `#9b2c2c` on `#f6f4ef` and `#161513` on white clear 4.5.
- Do not use a placeholder of 18:00 instead of the value.

## Responsive rules

- At 1280 the group is 420px, padding 48px 64px.
- Below 640 it is full width inside 20px padding. The two fields stay 64 by 40. They do not stretch.
- Do not replace the pair with a native time popup unless the platform cannot show two fields. If you must, keep the label, the status sentence, and the same 18:00 start.
- A day is still `calendar-month`. Do not put a month grid beside this pair on the same control.

## Acceptance checklist

- [ ] The label is Closes. The first values are 18 and 00.
- [ ] The status is "Gate 4 closes at 18:00."
- [ ] The hint is "The same closing time as the dock note."
- [ ] A minute of 60, or an hour of 24, shows the error and hides the hint and the status.
- [ ] The error is "Use an hour from 0 to 23 and a minute from 0 to 59."
- [ ] A valid pair pads to two digits in the status.
- [ ] Each field is 64 by 40, radius 2px, digit 20px tabular.
- [ ] Focus ring is 2px, offset 2px.
- [ ] There is no clock face, no slider, and no submit.
- [ ] 18:00 matches the dock note. Do not start at a second time.

## Implementation notes

Parse each field. Reject anything that is not one or two digits inside the range.

```js
function part(el, max){
  if (!/^\d{1,2}$/.test(el.value)) return null;
  const n = Number(el.value);
  return n <= max ? n : null;
}
```

Common mistakes:

- A slider from 0 to 24. A stepped amount is `slider-field`. A closing time is two fields.
- A month grid. A day is `calendar-month`.
- A second closing time, such as 17:30, while the note says 18:00.
- Showing the hint and the error together.
- A toast for a bad minute.
- A round clock face on a square family.
- Letting 24:00 through as midnight. Midnight here is 00:00. 24 is invalid.
- One field with a free sentence. The hour and the minute are separate so each can be checked.

Where it sits in a product:

1. Use it for a clock time: a close, a slot, a start.
2. A date beside it is `calendar-month` or `date-range-picker`, not a third field inside this control.
3. The status sentence is the confirmation. Do not add a Save on this piece. The page has one primary, outside it.
4. Radius and height follow the family.
5. When a theme is locked, danger, ink, and surface come from the theme.
6. 18:00 is this gate. A product writes its own time and says that time in the status.
7. The where-line Gate 4 matches the note, the tree, and the property list.
8. Pad in the status. The fields may show 8 while the person is typing. The sentence shows 08.
9. Do not mix this 24-hour clock with an AM/PM select unless the product asked for 12-hour time. This yard is 24-hour.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place the label, the two fields, and the colon.
3. Seed 18 and 00 and write the status.
4. Reject an hour or minute outside range.
5. Restore the status on a valid pair.
6. Map the radius and the height onto the family.

Copy you keep:

1. Gate 4.
2. Closes.
3. 18 and 00.
4. The same closing time as the dock note.
5. Gate 4 closes at 18:00.
6. Use an hour from 0 to 23 and a minute from 0 to 59.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
