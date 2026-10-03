<!-- Design Lounge Nº 274 · "Inline edit" · designlounge.vercel.app -->

# Inline edit

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A load name that reads as a heading until it is clicked. Then it is an input on the same baseline. Enter or blur saves a non-empty trim. Escape restores the previous name and blur must not overwrite that restore. This is not a form field with a label above. That field is `text-field`. This is the name itself.

## Reference behaviour

1. The first frame reads Gate 4 hold. The hint says click to edit.
2. Click replaces the button with an input, focused and selected.
3. Enter saves the trimmed value and returns to the button.
4. Escape restores the previous name.
5. Blur saves, unless Escape just cancelled.
6. An empty trim does not replace the saved name.
7. The hint says Saved on this page after a save.

## Structure

```
480px
LOAD NAME
Gate 4 hold
hint
```

- The control is 480px.
- The name is 32px, weight 600.
- The input has a 1px bottom border in #1f4d3a.
- The button name has a transparent bottom border so the line does not jump.
- maxlength is 40.

## Tokens

```css
:root { --bg:#f6f4ef; --ink:#161513; --ink-2:#5a554c; --primary:#1f4d3a; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Kicker | IBM Plex Sans | 12px | 500 |
| Name | IBM Plex Sans | 32px | 600 |
| Hint | IBM Plex Sans | 14px | 400 |

## Motion

- Edit | click | button | input | none | instant

## States

- Reading: button visible, input hidden.
- Editing: input visible, button hidden.
- Saved: hint says Saved on this page.
- Cancelled: name unchanged.

## Accessibility

- The button is the name.
- The input has aria-label Load name.
- Enter and Escape are handled on keydown.
- Focus returns to the button after close.
- The hint is text under the name.
- Focus ring is 2px #1f4d3a, offset 3px.

## Responsive rules

- The block is 480px at 1280.
- Below 520 it is calc(100% - 32px).
- The name stays one line until it wraps at the width of the block.

## Acceptance checklist

### Always

- [ ] Click to edit, Enter to save, Escape to cancel.
- [ ] Empty trim does not save.
- [ ] Escape wins over the blur that follows it.
- [ ] The name and the input share size and weight.
- [ ] Nothing is sent off the page.

### This demo

- [ ] The starting name is Gate 4 hold.
- [ ] The kicker is Load name.
- [ ] The hint mentions Enter and Escape.
- [ ] Type is IBM Plex Sans.
- [ ] The underline on edit is #1f4d3a.

## Implementation notes

Set a cancel flag before blur runs.

```js
if (e.key === "Escape") { cancel = true; close(false); }
```

close() returns immediately if the input is already hidden, so blur after Enter does not double-save.

## Measurements to keep

- Block 480px. Name 32px. Kicker 12px, tracking 0.08em.
- Hint 14px, margin-top 10px, min-height 20px.
- maxlength 40.
- Input border-bottom 1px.
- No radius on the name.

## Wrong turns

- Do not save on Escape.
- Do not use a separate Save button in this piece.
- Do not clear the name when the field is emptied.
- Do not animate the swap.
- Do not send the name anywhere.
- Do not use a textarea.

## Fit with the rest of the library

- A labelled field is `text-field`.
- A long note is `textarea-field`.
- This is one name.
- Do not put a form card around it.
- The ground is #f6f4ef.
- Type is IBM Plex Sans.

## Keyboard

- Enter saves.
- Escape cancels.
- Click opens.
- Blur saves if not cancelled.
- Tab away blurs and saves.
- The input selects its text on open.
- Focus returns to the button.
- Do not use a positive tabindex.
- Empty trim is ignored.
- maxlength is 40.
- The hint is not a live region. It updates as text.
- There is one name.
- The kicker is not a label for a second control.
- Focus offset is 3px.
- No motion.
- Type is IBM Plex Sans.

## Rebuild order

1. Build step: The first frame reads Gate 4 hold. The hint says click to edit.
2. Build step: Click replaces the button with an input, focused and selected.
3. Build step: Enter saves the trimmed value and returns to the button.
4. Build step: Escape restores the previous name.
5. Build step: Blur saves, unless Escape just cancelled.
6. Build step: An empty trim does not replace the saved name.
7. Build step: The hint says Saved on this page after a save.

- Keep this measurement while rebuilding: Block 480px. Name 32px. Kicker 12px, tracking 0.08em.
- Keep this measurement while rebuilding: Hint 14px, margin-top 10px, min-height 20px.
- Keep this measurement while rebuilding: maxlength 40.
- Keep this measurement while rebuilding: Input border-bottom 1px.
- Keep this measurement while rebuilding: No radius on the name.

- While rebuilding, remember: Do not save on Escape.
- While rebuilding, remember: Do not use a separate Save button in this piece.
- While rebuilding, remember: Do not clear the name when the field is emptied.
- While rebuilding, remember: Do not animate the swap.
- While rebuilding, remember: Do not send the name anywhere.
- While rebuilding, remember: Do not use a textarea.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
