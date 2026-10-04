<!-- Design Lounge Nº 190 · "Checkbox group" · designlounge.vercel.app -->

# Checkbox group

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the radius and the control height follow the family. One choice among visible answers is `radio-group`. This is several choices that can all be on.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The loads on one truck. The legend is On this truck. Rice and Oil start checked. Tea starts clear. A line under the group names what is on: "Rice and Oil are on the truck." Clearing both leaves "Nothing is on the truck." Checking all three leaves "Rice, Oil, and Tea are on the truck." Each row is at least 40px. The box is a native checkbox, 18px, with the yard green as the accent. There is no strike-through, no drawn pencil, and no count of nine. The hint says a load can be on or off, and the shift stays one choice.

## Structure

```
padding 48px 64px
Loads                        12px
width 420
  legend On this truck
  row 40px   [box 18] Rice
  row 40px   [box 18] Oil
  row 40px   [box 18] Tea
  hint
  status
```

- The three boxes share one `name` so they are a group, and each has its own value.
- The row is the label. The box and the word are inside it.
- The status is `role="status"`.

## Motion

None. The status changes in one frame. Reduced motion has nothing to remove. Do not draw the check, and do not strike the word.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Box | change | checked, then the status sentence |
| Status | which boxes | the sentence, in Rice, Oil, Tea order |

## States

- Resting row: min-height 40px, gap 12px, native 18px box.
- Checked: the browser's check, tinted `--primary`.
- Unchecked: the empty box.
- Focus-visible: 2px outline, offset 3px.
- Hint stays. It does not turn into an error. Empty is a valid truck.
- Do not disable Tea. A third load is allowed.

## Accessibility

- The legend names the question. Each row is a label around a native checkbox.
- The status is a live region, so the sentence is not only a visual change.
- Hit target: the row is at least 40px. The box itself is 18px inside that row.
- Contrast: `#161513` on `#f6f4ef` clears 4.5. The green accent is the check, not the only signal. The word and the status carry the state.
- Do not use a div with a click handler in place of the checkbox.

## Responsive rules

- At 1280 the group is 420px, padding 48px 64px.
- Below 640 it is full width inside 20px padding. Rows stay at least 40px.
- Do not turn the three loads into a select. They stay visible.
- On a phone the same three rows stack. Do not collapse them into one "Loads" chip.

## Acceptance checklist

- [ ] The legend is On this truck. Rice and Oil start checked. Tea starts clear.
- [ ] The first status is "Rice and Oil are on the truck."
- [ ] Checking Tea rewrites the status to "Rice, Oil, and Tea are on the truck."
- [ ] Clearing every box rewrites the status to "Nothing is on the truck."
- [ ] One box on uses "is". Two or three use "are".
- [ ] Each row is at least 40px. The box is 18px.
- [ ] The hint stays visible. There is no error and no submit.
- [ ] There is no strike-through and no drawn check animation.
- [ ] Focus ring is 2px, offset 3px.
- [ ] The names are Rice, Oil, and Tea, the same loads as the token field.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The first frame has Rice and Oil checked and Tea clear. The status is "Rice and Oil are on the truck."
2. Checking or clearing a box rewrites the status from the boxes that are on, in the order Rice, Oil, Tea.
3. One box on reads "{name} is on the truck."
4. Two boxes on read "{first} and {second} are on the truck."
5. All three read "Rice, Oil, and Tea are on the truck."
6. None on reads "Nothing is on the truck."
7. There is no submit button and no animation.
8. Focus-visible is a 2px outline, offset 3px, on the box.

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
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

The box uses `accent-color: var(--primary)`. The family may restyle the box. Do not replace it with a drawn pencil.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Legend | sans | 12px | 500 | `--ink-2` |
| Row | sans | 14px | 400 | `--ink` |
| Hint | sans | 12px | 400 | `--ink-3` |
| Status | sans | 12px | 400 | `--ink` |

The where-line letter-spacing is 0.04em. The row is the body size. Do not set the load names in a display face.

## Implementation notes

Read the checked boxes in DOM order. Do not keep a second list.

```js
const on = boxes.filter(b => b.checked).map(b => b.value);
```

Common mistakes:

- A radio group with the same three names. One shift is `radio-group`. These loads can share the truck.
- The red-pencil to-do. That is `checkbox-draw-list`. It draws a check and strikes the line. This yard does not.
- A token field. Typed names are `token-field`. These three are known.
- Hiding the status and trusting the check colour alone.
- A select that closes. The person must see every load.
- Disabling the group when the truck is empty. Empty is a real state.
- Six different checkbox drawings. One box.

Where it sits in a product:

1. Use it when each option can be on at the same time.
2. One answer among a short visible list is `radio-group`.
3. Names the person types are `token-field`.
4. The legend is the question. The status repeats the answer in a sentence.
5. Radius of a custom box, if the platform cannot tint a native one, follows the family. The native box is enough here.
6. When a theme is locked, the paper, the ink, and the accent come from the theme.
7. Three loads is this truck. A product lists the loads it has. Do not add an empty fourth.
8. Rice, Oil, and Tea match the token field. Do not rename Tea to Leaf here.
9. The where-line Loads is the screen name.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place the legend and the three labelled boxes.
3. Check Rice and Oil.
4. Write the status from the checked values.
5. Clear all three and read the empty sentence.
6. Map the accent onto the theme.

Copy you keep:

1. Loads.
2. On this truck.
3. Rice. Oil. Tea.
4. A load can be on or off. The shift stays one choice.
5. Rice and Oil are on the truck.
6. Nothing is on the truck.
7. Rice, Oil, and Tea are on the truck.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
