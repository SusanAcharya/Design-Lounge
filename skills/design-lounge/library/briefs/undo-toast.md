<!-- Design Lounge Nº 322 · "Undo toast" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Undo toast

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, use that kit's colour and radius. This demo uses the numbers below.

## What it is

A short list of yard notes. Archive hides one note and shows a toast: what was archived, an Undo button, and a 3px bar that shrinks over 6 seconds. Undo puts the note back and dismisses the toast. When the six seconds end, the toast leaves and the note stays archived. This is not a stack of several toasts. That stack is `toast-stack`. This is not a banner that stays on the page. A staying confirmation is `saved-banner`. One toast, one undo, one clock.

## Reference behaviour

1. The first frame has already archived "Gate 4 still holds twelve loads". The toast is visible. The note row is hidden.
2. The toast text is "Archived · Gate 4 still holds twelve loads".
3. The bar scales from full width to zero over 6 seconds.
4. Undo restores that row, hides the toast, and clears the timer.
5. Archiving a second note first undoes the current toast, then archives the new note, so only one toast exists.
6. After 6 seconds the toast hides and Undo is no longer available. The row stays hidden.
7. Reduced motion does not run the bar animation. The toast still dismisses at 6 seconds.

## Structure

```
520px list, centered
Yard notes
row · Archive
fixed toast, 420px, bottom 28px, centered
[ sentence            Undo ]
[ bar 3px                    ]
```

- The list is 520px.
- Each row is a flex line with a 36px Archive button.
- The toast is position fixed, left 50%, translateX -50%, bottom 28px, width 420px.
- The bar is 3px, transform-origin left.
- The toast has role status.

## Tokens

```css
:root {
  --bg:#f6f4ef; --surface:#fff; --ink:#161513; --ink-2:#5a554c;
  --line:#e4dfd4; --primary:#1f4d3a; --primary-ink:#fffdf8;
}
```

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Title | IBM Plex Sans | 28px | 600 | 1.1 | 0 |
| Row | IBM Plex Sans | 16px | 400 | 1.45 | 0 |
| Toast | IBM Plex Sans | 14px | 400 | 1.4 | 0 |

## Motion

| Thing | Trigger | From | To | Duration | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Bar | toast shown | scaleX 1 | scaleX 0 | 6s linear | bar stays full, toast still times out |

## States

- Toast hidden: no current archive.
- Toast shown: one note hidden, Undo available.
- Hover does not pause the clock in this demo. A product may pause on hover if it says so.
- Archive buttons stay on the rows that are still visible.

## Accessibility

- The toast is role status so the archive is announced.
- Undo is a button inside the toast.
- Hidden rows use the hidden attribute.
- Do not use aria-hidden on the toast while it is on screen.
- Archive buttons are 36px. On a phone raise them to 44px.
- The bar is decorative.

## Responsive rules

- The list is 520px and the toast is 420px at 1280.
- Below 480 both become calc(100% - 32px). The toast stays 16px from the bottom.
- Do not cover the last row with the toast. Bottom 28px clears a short list.

## Acceptance checklist

### Always

- [ ] Only one undo toast at a time.
- [ ] Undo restores the exact row.
- [ ] The clock is 6 seconds.
- [ ] A new archive replaces the previous undo.
- [ ] The toast is dark ink on the paper page, not a second banner in the list.

### This demo

- [ ] Three notes: Gate 4, Night book, Rupee totals.
- [ ] The first frame archives the Gate 4 note.
- [ ] Toast copy starts with "Archived ·".
- [ ] Undo label is Undo.
- [ ] The bar is #1f4d3a on #161513.

## Implementation notes

Restart the CSS animation by setting it to none, reading offsetWidth, then clearing the inline style.

```js
bar.style.animation = "none";
void bar.offsetWidth;
bar.style.animation = "";
```

Clear the previous timeout before starting another. Do not stack timers.

## Measurements to keep

- Toast width 420px, bottom 28px, row padding 12px 14px.
- Undo button height 32px.
- Bar height 3px. Duration 6s linear.
- List width 520px. Row padding 14px 0.
- Archive button height 36px, radius 2px.

## Wrong turns

- Do not archive without a way back during the 6 seconds.
- Do not show two toasts.
- Do not use a green banner in the list. The toast is the feedback.
- Do not persist the archive. This page only hides a row.
- Do not pause forever on hover unless the product asked for that.
- Do not animate the row height. Hide it.

## Fit with the rest of the library

- Several toasts are `toast-stack`.
- A confirmation that stays is `saved-banner`.
- A bulk archive of table rows is `selection-bar`.
- A destructive action with no undo is `drag-to-confirm`.
- Do not also show a modal.
- The list is not `spend-list`.

## Keyboard

- Tab reaches Archive buttons, then Undo while the toast is visible.
- Enter on Archive archives that row.
- Enter on Undo restores it.
- Escape does not dismiss the toast. The clock or Undo does.
- The toast is not a dialog and does not trap focus.
- Focus may remain on an Archive button after the row hides. Move focus to Undo when you hide the row if the focused button disappears.
- Do not use a positive tabindex.
- The bar is not focusable.
- Reduced motion keeps the timeout.
- Six seconds is one timeout, not a chain of short timers.
- Do not use requestAnimationFrame for the clock.
- The live region is the toast, not each row.
- Hidden rows are not tabbable.
- Only one current id is stored.
- A second archive calls undo on the first before showing the next.
- The type is IBM Plex Sans.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
