<!-- Design Lounge Nº 260 · "Shred button" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Shred button

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A note that says Gate 4 draft, and a button that shreds it. Twelve strips fall out of the note. The button becomes Restore draft. Restore puts the note back. The status says the draft was shredded on this page. This is not a drag-to-confirm. That track is `drag-to-confirm`. This is not a button that morphs to a check. That morph is `button-state-morph`. The strips are the confirmation.

## Reference behaviour

1. The note is whole. The button reads Shred draft. The status is empty.
2. Click sets data-shred and the strips animate down over 700ms with a small rotate.
3. The button reads Restore draft.
4. The status reads Draft shredded on this page.
5. Restore clears the shred and the note text returns.
6. Strip delays step by 30ms.
7. Reduced motion hides the note text immediately and skips the fall.

## Structure

```
420px
[ Gate 4 draft ]
Shred draft
status
```

- The note is 140px tall and 420px wide.
- Twelve strips fill the note, each translateY -100% until shred.
- The button is 44px, danger outline.
- The status is 14px, min-height 22px.
- Strips are decorative.

## Tokens

```css
:root { --bg:#f6f4ef; --surface:#fff; --ink:#161513; --danger:#9b2c2c; --primary:#1f4d3a; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Note | IBM Plex Sans | 22px | 600 |
| Button | IBM Plex Sans | 14px | 500 |
| Status | IBM Plex Sans | 14px | 400 |

## Motion

- Strips | shred | translateY -100% | translateY 110% | 700ms cubic-bezier(0.2,0.7,0.2,1), stagger 30ms. Reduced motion skips the fall.

## States

- Whole: note text visible, button Shred draft.
- Shredded: strips shown, text hidden, button Restore draft.
- Restored: same as whole.
- The button is always enabled.

## Accessibility

- The button name changes between Shred draft and Restore draft.
- The status is aria-live polite.
- Strips are aria-hidden by being empty italic tags inside a decorative layer. Mark the strip box aria-hidden.
- Reduced motion still changes the button name and the status.
- Focus ring is 2px #1f4d3a, offset 3px.
- The note text is real text before the shred.

## Responsive rules

- The card is 420px at 1280.
- Below 460 it is calc(100% - 32px).
- Strips stay twelve across the note width.

## Acceptance checklist

### Always

- [ ] Shred and restore are the same button.
- [ ] The status names the shred.
- [ ] Strips fall only when motion is allowed.
- [ ] The note can come back.
- [ ] Nothing is sent.

### This demo

- [ ] The note says Gate 4 draft.
- [ ] The button starts as Shred draft.
- [ ] The status sentence is Draft shredded on this page.
- [ ] There are 12 strips.
- [ ] The outline is #9b2c2c.

## Implementation notes

Toggle data-shred. The animation runs because the strips start offscreen.

```css
.note[data-shred="true"] .strip { animation: fall 700ms forwards; }
```

Restore removes the attribute so the note text shows again.

## Measurements to keep

- Note height 140px. Card width 420px.
- Button height 44px.
- Fall 700ms. Stagger 30ms. Twelve strips.
- Status min-height 22px, margin-top 12px.
- Danger #9b2c2c.

## Wrong turns

- Do not delete without a restore in this demo.
- Do not use a modal.
- Do not leave the strips on screen after restore.
- Do not shred on hover.
- Do not send the draft.
- Do not use a red fill on the whole page.

## Fit with the rest of the library

- A drag confirm is `drag-to-confirm`.
- A state morph is `button-state-morph`.
- An undo toast is `undo-toast`.
- This shred is the animation of the delete.
- Do not also ask in a dialog.
- Type is IBM Plex Sans.

## Keyboard

- Enter shreds or restores.
- The button name changes.
- The status is polite.
- Escape does not restore. The button does.
- Strips are not tab stops.
- Do not use a positive tabindex.
- Reduced motion skips the fall.
- Focus stays on the button.
- There are 12 strips.
- The note starts whole.
- Focus offset is 3px.
- No second confirm.
- The outline stays danger colour.
- Type is IBM Plex Sans.
- Nothing is fetched.
- Toggle is one click each way.

## Rebuild order

1. Build step: The note is whole. The button reads Shred draft. The status is empty.
2. Build step: Click sets data-shred and the strips animate down over 700ms with a small rotate.
3. Build step: The button reads Restore draft.
4. Build step: The status reads Draft shredded on this page.
5. Build step: Restore clears the shred and the note text returns.
6. Build step: Strip delays step by 30ms.
7. Build step: Reduced motion hides the note text immediately and skips the fall.

- Keep this measurement while rebuilding: Note height 140px. Card width 420px.
- Keep this measurement while rebuilding: Button height 44px.
- Keep this measurement while rebuilding: Fall 700ms. Stagger 30ms. Twelve strips.
- Keep this measurement while rebuilding: Status min-height 22px, margin-top 12px.
- Keep this measurement while rebuilding: Danger #9b2c2c.

- While rebuilding, remember: Do not delete without a restore in this demo.
- While rebuilding, remember: Do not use a modal.
- While rebuilding, remember: Do not leave the strips on screen after restore.
- While rebuilding, remember: Do not shred on hover.
- While rebuilding, remember: Do not send the draft.
- While rebuilding, remember: Do not use a red fill on the whole page.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
