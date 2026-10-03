<!-- Design Lounge Nº 241 · "Popover panel" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Popover panel

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the panel uses `--surface`, `--line`, and `--radius-card`. A sentence with no button inside it is `tooltip`. A dialog that traps focus is `modal-dialog-focus-trap`.

## What it is

A button, Note, with a panel anchored under it. The panel starts open so the piece can be read. It says Gate 2 closes at 18:00 and the rice moves to Gate 4. Close is an outline button inside the panel. Close hides the panel and returns focus to Note. Escape does the same. Clicking Note toggles the panel. There is no scrim, no focus trap, and no page dimming. The rest of the page stays usable. The panel is 280px wide, padding 12px, radius 2px, on the surface, with a hairline.

## Reference behaviour

1. Note is `aria-expanded="true"`. The panel is visible under the button.
2. Close hides the panel, sets expanded to false, and focuses Note.
3. Escape hides the panel.
4. Clicking Note while it is closed opens the panel. Clicking it while open closes the panel.
5. There is no animation.
6. Focus ring is 2px `--focus`, offset 2px, on Note and on Close.

## Structure

```
padding 80px 64px
wrap, position relative
  [ Note ]                     40px
  panel, top 48px, width 280
    Gate 2 closes at 18:00. The rice moves to Gate 4.
    [ Close ]                  40px outline
```

- Note has `aria-controls` pointing at the panel and `aria-expanded`.
- The panel is hidden with the `hidden` attribute.
- Close is a button, not a gesture the person must guess.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --line: #e4dfd4;
  --line-strong: #cfc6b8;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

Radius is 2px. The family's card radius replaces the panel. The button radius replaces Note and Close. Do not add a shadow if the family's shadow is none.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Note | sans | 13px | 500 | `--ink` |
| Body | sans | 14px | 400 | `--ink` |
| Close | sans | 13px | 500 | `--ink` |

The sentence wraps inside 280px minus the padding. It is not a tooltip's one short line only, because the panel can hold a second sentence and a button.

## Motion

None. The panel appears in one frame. Reduced motion has nothing to remove. Do not scale it from 0.96. That motion belongs to the modal.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Note | click | panel toggles, aria-expanded |
| Close | click | panel hides, focus returns |
| Escape | key | panel hides |

## States

- Note: height 40px, padding 0 14px, radius 2px, 1px `--line-strong`, surface.
- Panel open: absolute, left 0, top 48px, width 280px, padding 12px, surface, 1px `--line`, radius 2px.
- Panel closed: `hidden`.
- Close: height 40px, outline, not primary.
- Focus-visible: 2px outline, offset 2px.
- Do not dim the page. Do not put a scrim behind a panel this small.

## Accessibility

- `aria-expanded` matches the panel.
- `aria-controls` names the panel.
- Close has a visible name.
- Escape closes from anywhere in the page in this demo, because the panel does not trap focus. If a product only listens while the panel is open, that is enough.
- Focus returns to Note when Close is used.
- Hit targets are 40px.
- Contrast of the sentence on the surface clears 4.5.
- This is not `role="dialog"`. A dialog traps focus and uses a scrim. Calling this a dialog without the trap is a lie.

## Responsive rules

- At 1280 the panel hangs under the button, with 80px of padding so it is not against the frame.
- Below 640 the panel may be width 100% up to 280px. If the button is near the right edge, align the panel to the right of the button so it stays on screen.
- On a phone, a panel that covers the thumb and has no Close is a sheet. Use `ios-bottom-sheet-detents` for that. This popover is a web control.

## Acceptance checklist

- [ ] The panel starts open under Note.
- [ ] The sentence names Gate 2, 18:00, and Gate 4.
- [ ] The panel is 280px wide, padding 12px, radius 2px, on white, with a hairline.
- [ ] Close hides it and returns focus to Note.
- [ ] Escape hides it.
- [ ] Note toggles `aria-expanded`.
- [ ] There is no scrim and no focus trap.
- [ ] Note and Close are 40px and outline.
- [ ] Focus ring is 2px, offset 2px.
- [ ] There is no animation.

## Implementation notes

Hide with the attribute so the panel leaves the tree.

```js
function open(on){
  panel.hidden = !on;
  note.setAttribute('aria-expanded', on ? 'true' : 'false');
}
```

Common mistakes:

- A tooltip that contains a button. Tooltips have no buttons. This panel does.
- A modal scrim for two sentences.
- `role="dialog"` without a trap.
- A shadow on a family whose shadow is none.
- Leaving the panel open with `display` only, so it stays in the accessibility tree.
- A second Note somewhere else on the page with a different sentence.

Where it sits in a product:

1. Use it for a short extra that includes an action, anchored to the control that asked for it.
2. A description with no action is `tooltip`.
3. A decision that must be confirmed is `modal-dialog-focus-trap`.
4. A message the whole page must see is `inline-alert`.
5. Radius follows the family. The panel uses the card radius.
6. When a theme is locked, the surface and the line come from the theme.
7. One panel. Do not open a stack of them.
8. The sentence matches the yard. Gate 2 closes at 18:00 in the alert as well. Do not invent a second closing time.
9. Close is outline. It is not the page's primary.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place Note and the open panel under it.
3. Wire the toggle, Close, and Escape.
4. Return focus on Close.
5. Check the page behind is not dimmed.
6. Map the surface and the radius onto the kit.

Copy you keep:

1. Note.
2. Gate 2 closes at 18:00. The rice moves to Gate 4.
3. Close.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
