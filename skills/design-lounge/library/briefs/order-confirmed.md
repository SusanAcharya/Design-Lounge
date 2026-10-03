<!-- Design Lounge Nº 225 · "Order confirmed" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Order confirmed

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the column stays the pass column, the amount uses the pairing's number face, and Paid uses the success wash with the on-soft ink.

## What it is

The page after checkout. A small flag says Paid, on the success wash. The kicker is Order 1842. The amount is रु 4,200 at 56px. The sentence says it leaves today from Koteshwor. Three lines and a total sit in a 720px column: Rice रु 2,400, Oil रु 1,200, Tea रु 600, total रु 4,200. One button, Track this order. Clicking it writes "Tracking opened for order 1842." and disables the button. The receipt does not become a toast. A save that is only a banner is `saved-banner`. The cart before this page is `shop-cart`.

## Reference behaviour

1. The first frame shows Paid, the amount, the three lines, the total, and the enabled button.
2. The lines sum to the total: 2400 + 1200 + 600 = 4200.
3. Clicking the button sets the status, changes the label to Tracking opened, and disables the button.
4. A second click does nothing.
5. There is no animation and no confetti.
6. Focus ring is 2px `--focus`, offset 3px.
7. Amounts that contain रु are one string in one face. This demo uses Noto Sans because that face has the glyph. When a pairing is locked, use the face that contains रु. Do not set the amount in a mono face that drops the glyph.

## Structure

```
padding 48px 64px
column, max-width 720
Paid                         flag, success wash
Order 1842                   12px
रु 4,200                     56px
Leaves today from Koteshwor.
list
  Rice, 2 kg        रु 2,400
  Oil, 1 tin        रु 1,200
  Tea, 200 g        रु 600
  Total             रु 4,200
[ Track this order ]         40px primary
status                       empty until click
```

- The column is the pass column, 720px.
- Amounts are text, tabular numbers.
- The flag is a paragraph, not a badge component on a row. A row badge is `status-badge`.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --line: #e4dfd4;
  --primary: #1f4d3a;
  --primary-ink: #fffdf8;
  --success-soft: #d6e8dc;
  --success-on-soft: #1b5e3d;
  --focus: #1f4d3a;
  --sans: "Noto Sans", system-ui, sans-serif;
}
```

Radius is 2px on the flag, the list, and the button in this demo. The family replaces it. The list is a card radius. The button is the control radius. They match in this yard. They can differ when the family says so: `--radius` on the button, `--radius-card` on the list.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Flag | sans | 14px | 500 | `--success-on-soft` |
| Kicker | sans | 12px | 500 | `--ink-2` |
| Amount | sans | 56px | 600 | `--ink` |
| Lead | sans | 16px | 400 | `--ink` |
| Line | sans | 16px | 400 | `--ink` |
| Total | sans | 16px | 500 | `--ink` |
| Button | sans | 13px | 500 | `--primary-ink` |

The amount letter-spacing is -0.02em in this demo. When a pairing is locked, use that pairing's display tracking only. Do not keep -0.02em as a second rule. The kicker letter-spacing is 0.04em.

Grouping: 4,200 and 2,400 and 1,200. Under 1000, Tea is रु 600 with no comma. Do not write 4.200. Nepal and India group by lakh only once the number reaches a lakh. 4,200 is still thousands.

## Motion

None. The status replaces the idle line in one frame. Reduced motion has nothing to remove. Do not animate the amount.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Track | click | status sentence, label, disabled |
| Focus | keyboard | ring, offset 3px |

## States

- Flag: inline-block, padding 8px 12px, radius 2px, background `--success-soft`, text `--success-on-soft`.
- Amount: 56px, weight 600, the largest type on the view.
- List: surface, 1px `--line`, radius 2px. Rows min-height 56px, padding 0 16px.
- Total row: weight 500. It is the last row, not a second heading.
- Button: height 40px, padding 0 14px, fill `--primary`, text `--primary-ink`. The only solid.
- Button disabled: opacity 0.4, label Tracking opened.
- Status: 14px, `role="status"`.
- Do not add a second button such as Continue shopping in solid. If you need it, it is outline.

## Accessibility

- The amount is the h1. Paid is a flag, not a second h1.
- The button has a visible name.
- The status line is `role="status"`.
- Amounts are in the row text, not only in a graphic.
- Hit target: the button is 40px. On a phone it is at least 44px.
- Contrast: `#1b5e3d` on `#d6e8dc` and `#fffdf8` on `#1f4d3a` clear 4.5.
- रु stays in the same face as the digits of that amount.

## Responsive rules

- At 1280 the column is 720px, left aligned, padding 48px 64px.
- Below 640 the column is the full width inside 20px padding. The amount may step down to 40px. It stays the largest type.
- The lines do not become a two-column shop grid. A grid of products is `shop-collection`. This is one receipt.
- Another screen in the same pass uses the same 720px column.

## Acceptance checklist

- [ ] The flag says Paid on `#d6e8dc` with `#1b5e3d` text.
- [ ] The kicker is Order 1842. The h1 is रु 4,200 at 56px.
- [ ] The lead says it leaves today from Koteshwor.
- [ ] The lines are Rice रु 2,400, Oil रु 1,200, Tea रु 600, total रु 4,200.
- [ ] The column max-width is 720px.
- [ ] Track this order is the only solid button.
- [ ] The click writes "Tracking opened for order 1842." and disables the button.
- [ ] The receipt stays on the page.
- [ ] Amounts that include रु use one face.
- [ ] Focus ring is 2px, offset 3px.
- [ ] There is no animation and no second solid button.

## Implementation notes

Disable after the click so tracking is not opened twice.

```js
status.textContent = 'Tracking opened for order 1842.';
track.disabled = true;
track.textContent = 'Tracking opened';
```

Common mistakes:

- A toast that replaces the receipt.
- Two solids, Track and Continue.
- The amount in a mono face that has no रु, so the glyph falls back to another face.
- Western grouping on a lakh-scale amount, or a comma inside 600.
- A 560px receipt beside a 720px cart.
- Confetti, a check animation, or a gradient flag.
- Paid in brand red on a dark page. The flag text is `--success-on-soft`.
- Hiding the lines and showing only the total.

Where it sits in a product:

1. It follows `shop-cart` and `mobile-one-page-checkout`. The total matches the cart the person just paid.
2. It stays on the page, the way `saved-banner` stays. It is the whole screen, not a banner above a dashboard.
3. One primary, Track this order.
4. The column is the pass column, 720px in this demo. A brief that says 640 does not win.
5. The number face comes from the pairing. If the pairing sets numbers to display, the amount uses the display face.
6. Letter-spacing comes from the pairing once a kit is locked.
7. When a theme is locked, Paid uses that theme's success pair.
8. Do not add a recommended-products grid under the total. That is a different page.
9. Koteshwor and Order 1842 are this demo. A product uses its own place and id.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and Noto Sans.
2. Place the 720px column, the flag, the kicker, and the amount.
3. Place the three lines and the total. Check the sum.
4. Place the one button.
5. Wire the status and the disabled label.
6. Check रु does not change face mid-amount.
7. Map colour, radius, and the number face onto the kit.

Copy you keep:

1. Paid.
2. Order 1842.
3. रु 4,200.
4. Leaves today from Koteshwor.
5. Rice, 2 kg. Oil, 1 tin. Tea, 200 g.
6. रु 2,400. रु 1,200. रु 600.
7. Total.
8. Track this order.
9. Tracking opened for order 1842.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
