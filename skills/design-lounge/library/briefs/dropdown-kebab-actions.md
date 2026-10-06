<!-- Design Lounge Nº 286 · "Kebab row actions menu" · www.designlounge.live -->

# Kebab row actions menu

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map the colours onto the kit's surface, line, ink, primary and danger tokens.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The row-level actions menu of an invoice list in a billing app called Tallyroom. Every row ends in a 36px ⋯ button. It opens a 252px menu anchored to the button's right edge: a mono context line naming the invoice, five actions with 16px stroke icons and right-aligned mono shortcuts, a hairline divider, Archive, and a red Delete invoice…. Delete does not delete. It swaps the menu for a small confirm panel in the same popover, with Cancel focused. The detail worth copying is that the popover never jumps: it chooses above or below once when it opens and keeps that side when the confirm panel replaces the list.

## Structure

```
1280 × 800, page bg #f2f0eb
max-width 1080, padding 28 32
┌ top bar: brand · Invoices Clients Payouts Reports ··········· (MD) ┐  30px
│                                                                     │  28px gap
│ Invoices  (32/700)                                  [ New invoice ] │  38px
│ 7 this quarter · €21,803.50 outstanding                             │
├ card, radius 12, 1px line ──────────────────────────────────────────┤
│ Number  Client              Issued  Due   Amount  Status        ⋯  │  40px header
│ INV-2047 Halden & Moss …    Sep 28  Oct 12 €4,820.00 [Sent]     ⋯  │  58px rows
│ INV-2045 Okafor Studio      Oct 2   Oct 18 €9,400.00 [Draft]   [⋯] │
│                                      ┌ 252px menu ─────────────┐   │
│                                      │ INV-2045 · Okafor Studio│   │  mono context line
│                                      │ ↗ Open               ↵ │   │  34px items
│                                      │ ⧉ Duplicate         ⌘D │   │
│                                      │ ↓ Download PDF     ⇧⌘S │   │
│                                      │ ◔ Send reminder      ⌘R │   │  (disabled on draft)
│                                      │ ✓ Mark as paid      ⌘P │   │
│                                      │ ─────────────────────── │   │  1px divider
│                                      │ ▭ Archive            E │   │
│                                      │ × Delete invoice…     ⌫ │   │  danger
│                                      └─────────────────────────┘   │
└ footer: Showing all invoices ··· Press Shift+F10 on a row button ───┘
```

(The glyphs above stand in for 16px stroke SVGs. Do not use emoji.)

- Table: `role="table"` with `role="row"`, `role="columnheader"` and `role="cell"` on a CSS grid. Columns: `96px minmax(0,1fr) 96px 96px 120px 96px 44px`, gap 12px, padding `0 12px 0 20px`.
- Trigger: `<button aria-haspopup="menu" aria-expanded aria-controls="menu" aria-label="Actions for INV-2045, Okafor Studio">` with a three-dot SVG (dots r 1.7 at x 5, 12, 19).
- Popover: one `position: fixed` container reused for every row, appended once at body level, so no row's `overflow: hidden` clips it.
- Inside it: a context line (`aria-hidden`, the menu carries the same words in `aria-label`), a `role="menu"` list of `<button role="menuitem" tabindex="-1">`, `role="separator"` between groups, and a hidden `role="alertdialog"` confirm panel.
- Toast: `role="status" aria-live="polite"`, fixed bottom centre, 24px up.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Menu in | open | opacity, transform | 0, `scale(.97) translateY(-4px)` → 1, none | 140ms | `--ease` |
| Menu in (above) | open with `data-side="top"` | same, translateY(+4px), origin bottom | — | 140ms | `--ease` |
| Menu out | close | opacity | 1 → 0, then `hidden` | 100ms | `--ease` |
| ⋯ fill | hover / expanded | background | transparent → `--line-2` | 140ms | `--ease` |
| Row leave | delete, archive | opacity, translateX | 1, 0 → 0, 12px | 200ms | `--ease` |
| Row fresh | duplicate, undo | background | `--accent-soft` → transparent | 900ms | `--ease` |
| Toast | any action | opacity, translateY | 0, 16px → 1, 0 | 180ms | `--ease` |

Transform origin follows the anchor: right/top when the menu hangs below a right-aligned button, right/bottom when it opens above, left when it had to align left. Reduced motion: every duration becomes 1ms and the menu has no scale; it appears and disappears in place. The row removal still happens, just without the slide.

## States

- ⋯ resting: 36×36, radius 8, transparent, `--ink-2`. Hover and `aria-expanded="true"`: `--line-2` fill, `--ink`.
- Row with an open menu: background `#f6f9f8`. Row hover: `#fbfaf7`.
- Item resting: transparent. Hover and focus are the same state: `--sunk` fill. Focus-visible adds `inset 0 0 0 2px --focus`.
- Item disabled: `aria-disabled="true"`, colour `--ink-3`, no fill on hover, activation does nothing, still reachable by arrows.
- Danger item: text and icon `--danger`; hover/focus fill `--danger-soft`. Label ends in an ellipsis because it opens a step.
- Confirm panel: padding 10px; Cancel is 34px tall, 1px `--line`, surface; Delete is 34px, `--danger` fill, white text, 600.
- Pills: Sent `--accent` on `--accent-soft`; Draft `--ink-2` on `--line-2`; Overdue `--warn` on `--warn-soft`; Paid `#3d6320` on `#e9efe2`.
- Empty list after deleting everything: keep the header row and the footer; the footer reads the count.

## Accessibility

- Trigger: `aria-haspopup="menu"`, `aria-expanded` mirrors the popover, `aria-controls="menu"`, and an `aria-label` naming the invoice and client. "More" alone is not a name when there are seven of them.
- Menu: `role="menu"`, `aria-orientation="vertical"`, `aria-label="Actions for INV-2045"` updated per row. Items are `role="menuitem"` buttons with roving `tabindex` (focused item 0, others -1). Separator is `role="separator"`.
- Icons and shortcut glyphs are `aria-hidden="true"`. The visible label is the accessible name.
- Delete invoice… carries `aria-haspopup="dialog"`. The confirm is `role="alertdialog"` with `aria-labelledby` (heading) and `aria-describedby` (sentence). Initial focus is Cancel, never the destructive button.
- Keys on the trigger: Enter, Space, ArrowDown, Shift+F10 open on the first item; ArrowUp opens on the last.
- Keys in the menu: arrows (wrap), Home/End, PageUp/PageDown, typeahead (500ms buffer), Enter/Space, Escape (close and return focus), Tab (close and let focus move on).
- Keys in the confirm: Tab, Shift+Tab, ArrowLeft/Right cycle the two buttons; Escape goes back one level.
- After an item removes its own row, focus goes to the neighbouring row's ⋯, never to `body`.
- Toast text is announced via `role="status"`; Undo is a real button.
- Contrast: `--ink-3` `#71757e` on white is 4.6:1, `--danger` `#c0341b` on white is 5.6:1, `--danger` on `--danger-soft` is 4.8:1.
- Hit targets: ⋯ is 36px on desktop; the row is 58px tall so the target is easy to aim. Menu items are 34px tall and 240px wide.

## Responsive rules

- ≥1280: as drawn, 1080px column centred.
- 1024: same layout; the client column absorbs the loss.
- <900: drop Issued and Due columns; grid becomes `84px minmax(0,1fr) 110px 90px 44px`.
- <640: rows become a two-line card: client name and email on the left, amount top right, invoice number under the email, pill under the amount, ⋯ spanning both lines on the far right. Header row is hidden. Top nav links are hidden. Page padding 20px 14px.
- At 375 the 252px menu still fits; placement clamps it 8px from the edges and it keeps the right-edge alignment to the ⋯.
- Do not swap the menu for a bottom sheet on desktop widths. On a native phone app, a row action list is an action sheet, not this.

## Acceptance checklist

### Always

- [ ] One popover element for the whole list, `position: fixed`, outside any `overflow: hidden` ancestor.
- [ ] The trigger has `aria-haspopup="menu"`, a live `aria-expanded`, and an accessible name that includes the row's identifier.
- [ ] Items are `role="menuitem"` with roving tabindex; arrows wrap; Home/End jump; typeahead resets after 500ms.
- [ ] Escape closes and returns focus to the trigger; Tab closes without trapping; outside click closes.
- [ ] Disabled items are `aria-disabled`, reachable, muted, inert.
- [ ] The destructive item asks to confirm inside the popover, and the confirm opens with Cancel focused.
- [ ] The popover flips above when it would cross the bottom edge, and keeps that side when its content changes height.
- [ ] Left/top are clamped 8px inside the viewport; re-placed on scroll and resize.
- [ ] After a row is removed, focus lands on a neighbouring trigger.
- [ ] Reduced motion removes the scale and slide.

### This demo

- [ ] First frame: menu open on INV-2045 · Okafor Studio, Duplicate focused.
- [ ] Item order: Open ↵, Duplicate ⌘D, Download PDF ⇧⌘S, Send reminder ⌘R, Mark as paid ⌘P, divider, Archive E, Delete invoice… ⌫.
- [ ] Menu is 252px wide, 6px padding, radius 10, items 34px, icons 16px.
- [ ] Confirm reads "Delete INV-2045?" and "The PDF and payment link stop working. This can't be undone."
- [ ] Opening the INV-2041 row (last) places the menu above the button.
- [ ] Duplicate creates INV-2048 as a draft at the top.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: the menu is open on row 3, INV-2045 · Okafor Studio. Duplicate has focus. The row is tinted `#f6f9f8` and the ⋯ button shows its pressed fill.
2. Clicking a ⋯ button opens its menu and focuses the first item. Clicking the same button again closes it. Clicking another ⋯ closes the first menu and opens the new one.
3. With the ⋯ button focused, Enter, Space, ArrowDown and Shift+F10 open the menu on the first item. ArrowUp opens it on the last item.
4. Inside the menu: ArrowDown/ArrowUp move focus and wrap. Home/PageUp go to the first item, End/PageDown to the last. Hovering an item moves focus to it, so the mouse and keyboard highlight are one highlight.
5. Typeahead: printable keys build a buffer that resets 500ms after the last key. Focus moves to the next item whose label starts with the buffer, searching from the item after the current one and wrapping. Pressing D from Download PDF lands on Delete invoice….
6. Enter or Space activates the focused item. Escape closes and returns focus to the ⋯ button that opened it. Tab closes without trapping, and focus continues to the next element in the page.
7. Clicking anywhere outside the popover and outside the button closes it without moving focus.
8. Disabled items stay in the list and stay focusable, with `aria-disabled="true"`, muted ink, and no hover fill. On a paid invoice, Send reminder and Mark as paid are disabled. On a draft, Send reminder is disabled.
9. Actions: Open shows a toast "Opening INV-2045…". Duplicate inserts a draft copy at the top as INV-2048, tints it `--accent-soft` for 900ms, and focuses its ⋯ button. Download PDF and Send reminder show a toast. Mark as paid flips the pill to Paid. Archive slides the row out and offers Undo.
10. Delete invoice… swaps the item list for the confirm panel: heading "Delete INV-2045?", one sentence, Cancel (focused) and a red Delete. The popover keeps the side it opened on.
11. In the confirm panel, Tab and ArrowLeft/ArrowRight move between the two buttons only. Escape or Cancel returns to the list with Delete invoice… focused.
12. Delete removes the row (200ms fade and 12px slide right), moves focus to the next row's ⋯ (or the previous row's if it was last), and shows the toast "INV-2045 deleted" with Undo. Undo puts the row back at the same index.
13. Placement: the menu opens 6px below the button with its right edge aligned to the button's right edge. If it would cross the bottom of the viewport minus 8px and there is room above, it opens 6px above instead. If the left edge would leave the viewport, it aligns to the button's left edge. Final top and left are clamped to 8px inside the viewport. It re-places on resize and on any scroll.

## Tokens

```css
:root {
  --bg: #f2f0eb;          /* page */
  --surface: #ffffff;     /* card, menu */
  --sunk: #f7f5f1;        /* table header, item hover/focus */
  --ink: #16181d;
  --ink-2: #5b5f68;       /* secondary text */
  --ink-3: #71757e;       /* icons, shortcuts, disabled */
  --line: #e2ded5;        /* card and menu border */
  --line-2: #ece9e2;      /* row rules, divider */
  --accent: #0e6e63;      /* focus ring, Sent pill */
  --accent-soft: #e3f0ee;
  --danger: #c0341b;      /* delete item, delete button */
  --danger-soft: #fbeae6; /* delete item hover */
  --warn: #9a5b00; --warn-soft: #fbf0dc;
  --focus: #0e6e63;

  --sans: "Schibsted Grotesk", system-ui, sans-serif;
  --mono: "Spline Sans Mono", ui-monospace, monospace;

  --r-menu: 10px; --r-item: 6px; --r-card: 12px;
  --menu-w: 252px; --item-h: 34px; --menu-pad: 6px; --gap-anchor: 6px; --edge: 8px;
  --shadow: 0 1px 2px rgba(22,24,29,.06), 0 12px 32px -6px rgba(22,24,29,.18);

  --ease: cubic-bezier(.2,.7,.2,1);
  --t-in: 140ms; --t-out: 100ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Colour |
| --- | --- | --- | --- | --- | --- | --- |
| Page title | Schibsted Grotesk | 32px | 700 | 1.1 | -0.025em | `--ink` |
| Client name | Schibsted Grotesk | 14px | 600 | 1.45 | 0 | `--ink` |
| Client email, header | Schibsted Grotesk | 12px | 400/500 | 1.45 | 0.02em header | `--ink-3` |
| Invoice number, amount | Spline Sans Mono | 12.5px / 13px | 400 | 1.45 | 0 | `--ink-2` / `--ink`, tabular |
| Menu context line | Spline Sans Mono | 11.5px | 400 | 1.45 | 0 | `--ink-3` |
| Menu item | Schibsted Grotesk | 13.5px | 400 | 34px box | 0 | `--ink` |
| Shortcut | Spline Sans Mono | 11px | 400 | — | 0.02em | `--ink-3` |
| Confirm heading | Schibsted Grotesk | 14px | 700 | 1.3 | -0.01em | `--ink` |
| Confirm body | Schibsted Grotesk | 13px | 400 | 1.45 | 0 | `--ink-2` |

Shortcuts are display only. Write them with platform glyphs (↵ ⌘D ⇧⌘S ⌘R ⌘P E ⌫) and mark them `aria-hidden`.

## Implementation notes

**Placement with flip, clamp and a locked side.** Measure after un-hiding so the height is real. Pass `lock` when the content swaps (confirm) or on scroll, so the popover stays on the side it chose.

```js
function place(lock){
  const r = anchor.getBoundingClientRect(), m = pop.getBoundingClientRect();
  const gap = 6, pad = 8, vw = innerWidth, vh = innerHeight;
  let side = 'bottom', top = r.bottom + gap;
  const flip = lock ? pop.dataset.side === 'top'
                    : top + m.height > vh - pad && r.top - gap - m.height >= pad;
  if (flip) { side = 'top'; top = r.top - gap - m.height; }
  top = Math.max(pad, Math.min(top, vh - pad - m.height));
  let left = r.right - m.width, ox = 'right';
  if (left < pad) { left = r.left; ox = 'left'; }
  left = Math.max(pad, Math.min(left, vw - pad - m.width));
  Object.assign(pop.style, { top: top + 'px', left: left + 'px' });
  pop.dataset.side = side; pop.style.setProperty('--ox', ox);
}
```

**Typeahead that cycles.** Search from the item after the current one. If the buffer is longer than one character and the current item still matches, stay put, so typing "de" doesn't skip past Delete.

```js
clearTimeout(t); buf += e.key.toLowerCase(); t = setTimeout(() => buf = '', 500);
const its = items(), i = its.indexOf(document.activeElement);
const order = [...its.slice(i + 1), ...its.slice(0, i + 1)];
const starts = x => x.textContent.trim().toLowerCase().startsWith(buf);
const hit = buf.length > 1 && starts(its[i]) ? its[i] : order.find(starts);
if (hit) focusItem(its.indexOf(hit));
```

Use `textContent` of the label only. In this demo the `<kbd>` sits after the label, so `startsWith` is unaffected. If your shortcut comes first, read a `data-label` instead.

**Hover is focus.** One highlight, driven by focus, so the keyboard picks up where the mouse left off:

```js
menu.addEventListener('mousemove', e => {
  const it = e.target.closest('[role="menuitem"]');
  if (it && it !== document.activeElement) focusItem(items().indexOf(it));
});
```

Common mistakes:

- Rendering the menu inside the row. The card's `overflow: hidden` clips it and the last row's menu disappears off the bottom.
- A `confirm()` call for delete. It is blocked in sandboxes and it throws the user out of context.
- Focusing Delete in the confirm. One Enter too many deletes the invoice.
- Removing disabled items. The menu shape should not change between rows.
- Recomputing placement on the confirm swap without locking the side, so the popover jumps from above the row to below it.
- Leaving focus on `body` after the row is removed.
- Shortcuts in the accessible name ("Duplicate Command D").

Rebuild order:

1. Lay out the table grid and the 58px rows with real invoice data.
2. Add the ⋯ trigger with its ARIA attributes.
3. Build one fixed popover with the context line, items, divider and the hidden confirm.
4. Write `place()` with flip, clamp and lock.
5. Wire open/close, roving focus, arrows, Home/End, typeahead, Escape, Tab, outside click.
6. Wire each action, the confirm swap, row removal with focus handoff, and the Undo toast.
7. Check the last row opens upward and the confirm does not jump.
8. Check reduced motion and the 375px layout.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
