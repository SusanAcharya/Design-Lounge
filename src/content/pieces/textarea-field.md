---
title: "Textarea field"
summary: "A dock note with the hint under it and a count of 160. Past 160 the hint yields to the error and the border turns danger."
platform: web
type: component
category: inputs
tags: [textarea, field, note, count]
styles: [minimal, industrial]
motion: none
difficulty: 1
featured: false
published: 2026-10-03
palette: ["#F6F4EF", "#FFFFFF", "#161513", "#9B2C2C"]
fonts: ["IBM Plex Sans"]
related: [text-field, password-field, token-field]
---

# Textarea field

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the radius and the focus ring follow the family. A single line is `text-field`. This is the note.

## What it is

One note for the dock. The label is Note. The area starts with "Leave the rice at Gate 4 before 18:00." The hint under it says the driver reads it at the gate. A count at the right reads the length of 160. The area is at least 96px tall and 420px wide, padding 12px, radius 2px. Past 160 characters the hint hides, the border becomes danger, and the line "Keep the note under 160 characters." shows. The person can still type. The count tells the truth. This is not a comment thread and not a chat composer.

## Reference behaviour

1. The first frame is under the limit. The hint is visible. The error is hidden. The count matches the text length.
2. Each key updates the count as "n of 160".
3. When the length passes 160, `aria-invalid` is true, the hint hides, and the error shows. Dropping back to 160 or under reverses that.
4. The area can grow vertically. The width stays 420px on this frame.
5. There is no submit button and no animation.
6. Focus ring is 2px `--focus`, offset 2px.

## Structure

```
padding 48px 64px
Dock                         12px
width 420
  Note                       label
  [ the sentence ]           min-height 96, padding 12
  hint or error              count, right aligned
```

- The label is tied to the textarea with `for` and `id`.
- Hint and error share the left side. Only one is visible.
- The count is always visible.

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

Radius is 2px in this yard. The family replaces it. Do not pill a note.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Label | sans | 12px | 500 | `--ink-2` |
| Note | sans | 14px | 400 | `--ink` |
| Hint | sans | 12px | 400 | `--ink-3` |
| Error | sans | 12px | 400 | `--danger` |
| Count | sans | 12px | 400 | `--ink-2` |

The note line-height is 1.45. The count uses tabular numbers. The where-line letter-spacing is 0.04em.

## Motion

None. The error replaces the hint in one frame. Reduced motion has nothing to remove. Do not shake the area.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Input | each key | the count |
| Over 160 | length | error, danger border, hint hides |
| Back under | length | hint returns, error hides |

## States

- Resting: min-height 96px, padding 12px, radius 2px, 1px `--line-strong`, surface fill. `resize: vertical`.
- Hint: 12px `--ink-3`.
- Error: 12px `--danger`. It replaces the hint. Both do not show.
- Invalid border: `--danger`.
- Count: always on the right, `--ink-2`.
- Focus-visible: 2px outline, offset 2px.
- Do not disable typing at 160. The error is the signal. A hard maxlength that silently drops keys hides the error this piece is here to show. The demo allows up to 400 so the error can appear.

## Accessibility

- The label is visible and tied to the control.
- `aria-invalid` follows the limit.
- The error is next to the control, not a toast.
- The count is text, so the limit is not only a red border.
- Hit target: the area is at least 96px tall.
- Contrast: `#9b2c2c` on `#f6f4ef` and `#5c564e` on the paper clear 4.5.
- Do not use a placeholder instead of the label.

## Responsive rules

- At 1280 the area is 420px, padding 48px 64px.
- Below 640 it is full width inside 20px padding. The min-height stays 96px.
- The count wraps under the hint if the row is tight. It does not cover the error.
- A phone composer for a conversation is `chat-thread`. This note is a field on a form.

## Acceptance checklist

- [ ] The label is Note. The opening sentence is the rice at Gate 4.
- [ ] The hint is "The driver reads this at the gate."
- [ ] The count reads the real length of 160.
- [ ] Past 160 the error is "Keep the note under 160 characters." and the hint is hidden.
- [ ] The border is `#9b2c2c` only while over the limit.
- [ ] Returning to 160 or under restores the hint.
- [ ] The area is 420px wide, at least 96px tall, radius 2px, padding 12px.
- [ ] Typing is not blocked at 160.
- [ ] Focus ring is 2px, offset 2px.
- [ ] There is no submit button and no animation.

## Implementation notes

Derive the count from the value. Do not store a second number.

```js
const over = note.value.length > 160;
err.hidden = !over;
hint.hidden = over;
```

Common mistakes:

- A single-line input for a note. That is `text-field`.
- A chat composer. That is `chat-thread`.
- Blocking keys at the limit so the error never appears.
- Showing the hint and the error together.
- A toast for the limit.
- A pill radius on a square family.
- A character count in a second face.

Where it sits in a product:

1. Use it for a note, a reason, a message on a form.
2. One line with a hint and an error is `text-field`.
3. The label is above. The hint is `--ink-3`. The error replaces the hint.
4. Radius follows the family.
5. 160 is this dock note. A product sets its own limit and writes that number in the count and the error.
6. When a theme is locked, danger and ink come from the theme.
7. One note. Do not stack three empty areas.
8. The where-line Dock is the screen name.
9. The sentence matches the yard's Gate 4. Do not rename the gate in the note and not in the tree.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place the label, the area, the hint, and the count.
3. Count the value on input.
4. Swap hint and error at 160.
5. Check a shorter value restores the hint.
6. Map the radius onto the family.

Copy you keep:

1. Dock.
2. Note.
3. Leave the rice at Gate 4 before 18:00.
4. The driver reads this at the gate.
5. Keep the note under 160 characters.
6. n of 160.
