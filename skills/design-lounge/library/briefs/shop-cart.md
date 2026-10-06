<!-- Design Lounge Nº 403 · "Shop cart" · www.designlounge.live -->

# Shop cart

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. This screen opens from `shop-product`. Its button opens checkout.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The bag for the Kiln shop. The page is fired-clay paper. "Bag" is a 12px label. The answer is the total, Rs 5,600, at 56px. Two lines sit under it: Ash bowl at Rs 2,400, quantity 1, and Night plate at Rs 3,200, quantity 1. Each line has a minus and a plus. Minus at quantity 1 removes the line. Plus adds one. The total is the sum of price times quantity. One primary button, "Check out", sits under the lines. When both lines are gone, the total is replaced by "The bag is empty." and a sentence, and the checkout button hides. There is no promo code, no shipping estimator, and no second total. Checkout is `mobile-one-page-checkout` even on the web frame: use its structure, on this sheet.

## Structure

```
padding 48px 64px
Bag                          12px label
Rs 5,600                     56px
row, max-width 640, min-height 64, three columns
  name | stepper | line amount
[ Check out ]                44px
empty sentence, hidden until the bag is clear
```

- Rows are not cards. A 1px line separates them.
- The stepper is minus, the quantity, plus. Buttons are 36px.
- The empty sentence is hidden while any line remains.
- One family on this page: Hanken Grotesk. The total is the text face at display size, because the answer is a number and this screen does not load a second face.

## Motion

None. Quantity and the total update in the same frame. Reduced motion has nothing to remove. Do not slide a row out. Remove it.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Plus | click | quantity + 1, line amount, total |
| Minus | click | quantity − 1, or the line is removed |
| Check out | click | label "Checkout opened", disabled |
| Last line removed | click | heading becomes the empty sentence's title, checkout hides |

## States

- Stepper button: 36 by 36, radius 8px, 1px `--line`, surface fill.
- Checkout resting: height 44px, padding 0 18px, radius 8px, fill `--primary`.
- Checkout disabled: opacity 0.55.
- Checkout hidden: the `hidden` attribute when the bag is empty, so it is not in the tab order.
- Empty heading uses the class that sets 40px. The 56px total is the populated heading only.
- Row: min-height 64px, top border `--line`, three columns.
- Focus-visible: 2px outline, offset 2px.

## Accessibility

- The total, or the empty title, is the `h1`. There is one heading.
- Plus and minus names include the piece name.
- The quantity is text between the buttons, so it is read with the line.
- Hit targets: stepper 36px, checkout 44px.
- Contrast: `#2a1b14` on `#f3e6d4` and `#fffdf8` on `#c45c2a` clear 4.5.
- Do not convey quantity by colour.
- When the bag empties, the heading text changes. That is the announcement. Do not also fire a toast.

## Responsive rules

- At 1280 the rows are 640px max. The total is 56px.
- At 768 the rows fill the content width. Padding becomes 24px.
- Below 640 the total may drop to 40px. The stepper stays 36px. The checkout button becomes full width.
- Do not turn the rows into the phone checkout. The next screen is still checkout, built from `mobile-one-page-checkout` and restyled onto this sheet.

## Acceptance checklist

- [ ] The first frame heading is Rs 5,600 at 56px.
- [ ] Ash bowl is Rs 2,400 at quantity 1. Night plate is Rs 3,200 at quantity 1.
- [ ] Plus on the bowl makes the line Rs 4,800 and the total Rs 8,000.
- [ ] Minus on a quantity of 1 removes that line.
- [ ] Removing both lines sets the heading to "The bag is empty."
- [ ] The empty sentence is present only then.
- [ ] Checkout is hidden when the bag is empty.
- [ ] "Check out" becomes "Checkout opened" and disables.
- [ ] A quantity change after that restores "Check out" and enables the button.
- [ ] Stepper buttons are 36px. Checkout is 44px.
- [ ] There is no promo field and no second total.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The first frame shows Rs 5,600, both lines at quantity 1, and "Check out".
2. Plus on a line increases its quantity by 1 and rewrites that line's amount and the total.
3. Minus decreases quantity by 1. At quantity 1, minus removes the line.
4. The total is always the sum of the remaining lines. Ash bowl is 2400. Night plate is 3200.
5. Clicking "Check out" sets "Checkout opened" and disables the button. Changing a quantity after that re-enables it and restores "Check out", because the bag changed.
6. When no lines remain, the heading reads "The bag is empty." at 40px. The sentence is "Nothing in the bag. The firing is still on the table." The checkout button is `hidden`.
7. There is no animation.
8. Focus ring is 2px `--focus`, offset 2px.
9. Minus and plus have accessible names: "Fewer {name}" and "More {name}".

## Tokens

```css
:root {
  --bg: #f3e6d4;
  --surface: #faefe0;
  --ink: #2a1b14;
  --ink-2: #6a4e3e;
  --line: #d8c0a4;
  --primary: #c45c2a;
  --primary-ink: #fffdf8;
  --focus: #c45c2a;
  --sans: "Hanken Grotesk", system-ui, sans-serif;
}
```

Money uses tabular numerals. Format with a thousands separator: 5600 is "Rs 5,600".

## Typography

| Role | Family | Size | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Where | sans | 12px | 600 | 0.06em | `--ink-2` |
| Total | sans | 56px | 500 | -0.04em | `--ink` |
| Empty title | sans | 40px | 500 | -0.03em | `--ink` |
| Name | sans | 15px | 600 | 0 | `--ink` |
| Amount | sans | 15px | 400 | 0 | `--ink-2` |
| Sentence | sans | 16px | 400 | 0 | `--ink-2` |
| Button | sans | 15px | 600 | 0 | `--primary-ink` |

The total line-height is 1. The empty sentence max-width is 360px.

## Implementation notes

Keep the rows in an array. Re-render the list after every stepper click. Do not try to patch one cell and drift from the sum.

```js
const sum = rows.reduce((s, r) => s + r.price * r.qty, 0);
function money(n) {
  return 'Rs ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
```

Removing a line uses splice when quantity drops below 1. The heading and the checkout visibility both depend on `rows.length === 0`.

Common mistakes:

- A 16px total in the corner and a 40px "Your cart" heading. The money is the answer.
- A promo code field.
- A shipping line that invents a second number at the same size as the total.
- A heart, a gift wrap toggle, and a note field.
- Keeping a line at quantity 0.
- A toast that says the bag is empty while the total is still on screen.
- Linking "Check out" back to the collection.
- Using the fragrance palette on this bag.
- Animating the number as an odometer. The person is checking a sum, not watching a counter.
- Two primary buttons: "Check out" and "Continue shopping". The empty state's sentence points back to the firing. The populated screen has one action.

Where it sits in a product:

1. It opens from `shop-product` after "Add to bag".
2. The ash bowl arrives at Rs 2,400, quantity 1. The night plate is already in the bag in this demo so the total is a real sum, not a single line copied from the product page.
3. "Check out" opens `mobile-one-page-checkout`, restyled onto Kiln.
4. The collection is where an empty bag sends the person. Do not draw that collection inside this page.
5. Quantity lives here, not on the product page.
6. One total. Tax, if they asked for it, is a caption under the total, not a second 56px number.
7. The label "Bag" is the where. It stays 12px.
8. Line amounts are `--ink-2`. The total is `--ink`.
9. When a theme is locked, the clay orange is `--primary` only on the checkout button and the focus ring.
10. Do not add a serif on this screen. One face.
11. A failed payment is the next screen's error, not a red total.
12. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and the grotesk.
2. Place the label and the 56px total.
3. Place the two lines with steppers.
4. Place the checkout button.
5. Wire plus and minus, including removal at quantity 0.
6. Recompute the total from the array, do not hard-code it after the first paint.
7. Wire the empty heading and hide checkout.
8. Wire checkout to the disabled label, and re-enable it when the bag changes.
9. Check Rs 2,400 plus Rs 3,200 is Rs 5,600.
10. Check two minuses on each line reach the empty heading.

Copy you keep:

1. Bag.
2. Rs 5,600 on the first frame.
3. Ash bowl. Night plate.
4. Check out. Checkout opened.
5. The bag is empty.
6. Nothing in the bag. The firing is still on the table.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
