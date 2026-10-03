<!-- Design Lounge Nº 229 · "Receipt slip" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Receipt slip

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A slot and a slip. Print slip sets max-height from 0 to 280px over 700ms. The slip names Hollis Yard, 3 Oct 2026 18:40, Load 18 Gate 4, Held 6h, and says Not a tax bill. The button becomes Reprint. Reprint collapses the slip. This is not a checkout. That summary is `mobile-one-page-checkout`.

## Reference behaviour

1. The slip starts at max-height 0. The button reads Print slip.
2. Click sets data-out true. The slip grows to 280px.
3. The button reads Reprint.
4. Click again sets data-out false and the button reads Print slip.
5. The type on the slip is IBM Plex Mono, 14px, line-height 1.7.
6. The grow is 700ms. Reduced motion snaps.
7. The slot is a 28px dark bar and does not move.

## Structure

```
320px
[ slot ]
[ slip ]
Print slip
```

- The machine is 320px, text-align center.
- The slot is 28px tall, fill #1c1b19, radius 2px 2px 0 0.
- The slip is #fffdf8, border #e4dfd4, border-top 0, overflow hidden.
- The pre is padding 16px 18px 20px, text-align left.
- The button is 44px, fill #1f4d3a, text #fffdf8, margin-top 16px.

## Tokens

```css
:root { --bg:#f6f4ef; --slip:#fffdf8; --ink:#161513; --slot:#1c1b19; --primary:#1f4d3a; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Slip | IBM Plex Mono | 14px | 400 |
| Button | IBM Plex Sans | 14px | 500 |

## Motion

- Slip | Print or Reprint | max-height 0 | max-height 280px | 700ms cubic-bezier(0.16,1,0.3,1). Reduced motion snaps.

## States

- In: max-height 0, button Print slip.
- Out: max-height 280px, button Reprint.
- The slip text does not change.
- Reduced motion still toggles.

## Accessibility

- The button name changes between Print slip and Reprint.
- The slip text is in the page, clipped by max-height.
- Focus ring is 2px #1f4d3a, offset 3px.
- Reduced motion still shows the slip.
- Do not use a print dialog.
- The slot is decorative.

## Responsive rules

- The machine is 320px at 1280.
- Below 360 it is calc(100% - 32px).
- The slip text stays left aligned.

## Acceptance checklist

### Always

- [ ] Print and Reprint are one button.
- [ ] The slip names the load.
- [ ] It says Not a tax bill.
- [ ] The slot stays put.
- [ ] Nothing is sent to a printer.

### This demo

- [ ] The header is HOLLIS YARD.
- [ ] The time is 3 Oct 2026 18:40.
- [ ] The line is Load 18 Gate 4.
- [ ] Held is 6h.
- [ ] The last line is Not a tax bill.

## Implementation notes

Toggle data-out.

```js
slip.dataset.out = String(on);
go.textContent = on ? "Reprint" : "Print slip";
```

Use max-height so the slip can grow without a fixed height animation library.

## Measurements to keep

- Machine 320px. Slot height 28px.
- Slip max-height 0 or 280px. Duration 700ms.
- Pre padding 16px 18px 20px. Mono 14px, line-height 1.7.
- Button height 44px, margin-top 16px.
- Slip fill #fffdf8. Slot #1c1b19.

## Wrong turns

- Do not open a print dialog.
- Do not call it a tax invoice.
- Do not start with the slip out. The first frame is the slot.
- Do not fetch a receipt.
- Do not use a second button.
- Do not animate the slot.

## Fit with the rest of the library

- A checkout is `mobile-one-page-checkout`.
- A morph is `button-state-morph`.
- This is the slip.
- One machine.
- Slip type is IBM Plex Mono.
- The ground is #f6f4ef.

## Keyboard

- Enter prints or reprints.
- The button name changes.
- The slip is not a tab stop.
- Do not use a positive tabindex.
- Focus stays on the button.
- Reduced motion snaps.
- One button.
- The text is in a pre.
- Focus offset is 3px.
- It starts hidden.
- Mono is IBM Plex Mono.
- Button type is IBM Plex Sans.
- Escape does nothing.
- No print API.
- The slot does not move.
- Do not trap focus.

## Rebuild order

1. Build step: The slip starts at max-height 0. The button reads Print slip.
2. Build step: Click sets data-out true. The slip grows to 280px.
3. Build step: The button reads Reprint.
4. Build step: Click again sets data-out false and the button reads Print slip.
5. Build step: The type on the slip is IBM Plex Mono, 14px, line-height 1.7.
6. Build step: The grow is 700ms. Reduced motion snaps.
7. Build step: The slot is a 28px dark bar and does not move.

- Keep this measurement while rebuilding: Machine 320px. Slot height 28px.
- Keep this measurement while rebuilding: Slip max-height 0 or 280px. Duration 700ms.
- Keep this measurement while rebuilding: Pre padding 16px 18px 20px. Mono 14px, line-height 1.7.
- Keep this measurement while rebuilding: Button height 44px, margin-top 16px.
- Keep this measurement while rebuilding: Slip fill #fffdf8. Slot #1c1b19.

- While rebuilding, remember: Do not open a print dialog.
- While rebuilding, remember: Do not call it a tax invoice.
- While rebuilding, remember: Do not start with the slip out. The first frame is the slot.
- While rebuilding, remember: Do not fetch a receipt.
- While rebuilding, remember: Do not use a second button.
- While rebuilding, remember: Do not animate the slot.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
