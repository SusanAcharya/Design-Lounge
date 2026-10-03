<!-- Design Lounge Nº 190 · "Quantity stepper" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Quantity stepper

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the buttons are `--control` tall and use `--radius`. The bag that holds several of these is `shop-cart`. The cart's own 36px stepper loses to this height.

## What it is

One line in a bag. Rice, at रु 1,200 a bag, quantity 2, line रु 2,400. Minus and plus are 40px buttons. The number sits between them. Minus stops at 1. Plus stops at 8. The line amount is 28px and uses the same face as the unit price, because both contain रु. This is the control. It is not the whole cart, and it is not a guest counter on a booking page.

## Reference behaviour

1. The first frame is quantity 2 and the line रु 2,400. Both buttons are enabled.
2. Plus adds one bag. The number and the line update together: 3 is रु 3,600, 8 is रु 9,600.
3. At 8, plus is disabled. Further clicks do nothing.
4. Minus removes one bag. At 1, minus is disabled and the line is रु 1,200.
5. The quantity never reaches 0 in this piece. Removing the line from the bag is a different action, on the cart, and it is not this minus button.
6. There is no animation. Focus ring is 2px `--focus`, offset 2px.
7. Amounts use en-IN grouping: 1,200 and 2,400 and 9,600. Six hundred would have no comma. These prices are all above 999.

## Structure

```
padding 48px 64px
Bag                          12px
row, width 420, min-height 72, surface, radius 2
  Rice
  रु 1,200 a bag
  [ − ]  2  [ + ]            buttons 40px
रु 2,400                     28px
```

- Minus is `aria-label="Remove one bag"`. Plus is `aria-label="Add one bag"`.
- The number is text, not an input, in this demo. A product may make it an input. If it does, the same min and max apply on blur.
- The line amount is a paragraph under the row.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --line: #e4dfd4;
  --line-strong: #cfc6b8;
  --primary: #1f4d3a;
  --focus: #1f4d3a;
  --sans: "Noto Sans", system-ui, sans-serif;
}
```

Noto Sans is this demo because the amount contains रु. When a pairing is locked, use the face that contains the glyph. Do not set the amount in a mono face that drops it. Button radius is 2px. The family replaces it. The buttons are outline, not a solid primary. The page's one primary, on a cart, is the checkout button, which is not in this piece.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Name | sans | 16px | 500 | `--ink` |
| Unit | sans | 13px | 400 | `--ink-2` |
| Quantity | sans | 16px | 500 | `--ink` |
| Button | sans | 16px | 500 | `--ink` |
| Line | sans | 28px | 500 | `--ink` |

The quantity and the line use tabular numbers. The where-line letter-spacing is 0.04em. The line is the largest type on this view. It is not 56px, because this is one line in a bag, not the order total. The order total is `order-confirmed`.

## Motion

None. The number changes in one frame. Reduced motion has nothing to remove. Do not roll the digits.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Plus | click | quantity up, until 8 |
| Minus | click | quantity down, until 1 |
| Either end | limit | that button disabled |

## States

- Row: width 420px, min-height 72px, padding 0 16px, surface, 1px `--line`, radius 2px.
- Button resting: 40px square, 1px `--line-strong`, transparent fill, radius 2px.
- Button disabled: opacity 0.4 and the `disabled` attribute.
- Quantity: 32px wide, centered, tabular.
- Line: 28px, weight 500, margin-top 16px.
- Focus-visible: 2px outline, offset 2px.
- Do not fill plus with `--primary`. Both buttons are the same outline. The number is the value.

## Accessibility

- The visible glyphs are − and +. The accessible names are Remove one bag and Add one bag.
- Disabled buttons leave the tab order.
- The line amount is text, so the total is not only a visual change of the number between the buttons.
- Hit target: both buttons are 40px. On a phone, at least 44px.
- Contrast: `#161513` on white clears 4.5. Disabled is exempt.
- रु and the digits of one amount share one face.

## Responsive rules

- At 1280 the row is 420px, padding 48px 64px.
- Below 640 the row is full width inside 20px padding. The buttons stay 40px, or the family's phone height.
- Do not stack the stepper under the name unless the row is under 320px. If you stack it, keep the buttons in a row.
- `shop-cart` draws a stepper at 36px. When a kit is locked, or when this piece is the control, the height is `--control`. Do not keep 36px beside a 40px button.

## Acceptance checklist

- [ ] The row is Rice at रु 1,200 a bag, quantity 2, line रु 2,400.
- [ ] Plus steps one bag at a time. At 8 the line is रु 9,600 and plus is disabled.
- [ ] Minus steps down. At 1 the line is रु 1,200 and minus is disabled.
- [ ] The quantity never becomes 0.
- [ ] The buttons are 40px, outline, radius 2px. Plus is not a solid primary.
- [ ] The names are Remove one bag and Add one bag.
- [ ] Amounts that contain रु use one face.
- [ ] Grouping is 1,200 and 2,400 and 9,600.
- [ ] Focus ring is 2px, offset 2px.
- [ ] There is no animation and no second product in the row.

## Implementation notes

One quantity. Derive the line. Do not store the line as a separate source.

```js
line.textContent = 'रु ' + (qty * 1200).toLocaleString('en-IN');
minus.disabled = qty <= 1;
plus.disabled = qty >= 8;
```

Common mistakes:

- A text field for a quantity that only steps by one.
- Plus as a solid primary beside an outline minus.
- Allowing 0, which deletes the line without saying so.
- A 36px hit target copied from the cart demo after the family has set 40px.
- Splitting रु onto a fallback face and the digits onto mono.
- A guest stepper with nights and rooms. That belongs to the booking page that already has one. This control counts units of one product.
- Animating the number.
- Two steppers that can disagree with the line amount.

Where it sits in a product:

1. Put it on a bag line. `shop-cart` is the bag. `shop-product` does not carry a quantity. `order-confirmed` is after payment and has no stepper.
2. The unit price and the line use one face.
3. Min 1 and max 8 are this rice. A product sets its own max and writes it in the hint if the person can hit it.
4. The buttons match the family's control height and radius.
5. They stay outline. Checkout is the solid button, once, on the cart.
6. When a theme is locked, the row surface and the ink come from the theme. Do not recolour plus in the brand red.
7. The line is 28px here because the view is one row. On the cart the total is the largest number. Do not also make this line 56px.
8. The where-line Bag is the screen name.
9. Rice at रु 1,200 matches a line the receipt can show. Do not invent a second price for the same rice on the confirmation.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and Noto Sans.
2. Place the row: name, unit price, minus, 2, plus.
3. Place the line at रु 2,400.
4. Wire plus and minus with the limits.
5. Check 8 and 1 disable the matching button.
6. Check the glyph and the digits share a face.
7. Map height and radius onto the family.

Copy you keep:

1. Bag.
2. Rice.
3. रु 1,200 a bag.
4. 2 as the start.
5. Remove one bag. Add one bag.
6. The line pattern रु followed by the quantity times 1,200.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
