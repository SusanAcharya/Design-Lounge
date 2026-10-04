<!-- Design Lounge Nº 406 · "Shop product" · designlounge.vercel.app -->

# Shop product

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. This page opens from `shop-collection` and its button opens `shop-cart`.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The product page for the ash bowl from the Kiln collection. The frame is a two-column page on fired-clay paper. The left column is a 420px colour field in the bowl's clay, 480px tall, radius 8px. The right column is the decision. A quiet control reads "This firing" and returns to the collection. The name "Ash bowl" is 56px serif, the largest type on the view. The price is Rs 2,400 at 20px. One sentence says what it is. One primary button, "Add to bag", is 44px. There is no size picker, no review stack, and no second product. The fragrance detail is a different shop. Use this page when the collection is the clay firing.

## Structure

```
padding 48px 64px
grid: 420px | 1fr, gap 48px, vertically centered
left: colour field 480px tall, radius 8, #c45c2a
right:
  This firing          text button, 32px, ink-2
  Ash bowl             56px serif
  Rs 2,400             20px
  Thrown last week. It holds a portion for two.
  [ Add to bag ]       44px
```

- The page is one product. Do not add a related-products row.
- The back control is a button with no border and no fill.
- The sentence max-width is 36ch.

## Motion

None. The button changes its label in place. Reduced motion has nothing to remove. Do not morph the button into a check the way the fragrance page does. This shop confirms with the words "In the bag".

| Thing | Trigger | What changes |
| --- | --- | --- |
| Add to bag | click | label "In the bag", disabled, opacity 0.55 |
| This firing | click | label "Collection opened" |

## States

- Add button resting: height 44px, padding 0 18px, radius 8px, fill `--primary`.
- Add button disabled: opacity 0.55, label "In the bag".
- Back control: no border, transparent background, height 32px.
- Focus-visible on both buttons: 2px outline, offset 2px.
- There is no selected size, because there is one size.
- There is no sold-out state on this frame. If the bowl cannot be bought, replace the button with a sentence. Do not leave a dead primary.

## Accessibility

- The name is the `h1`.
- The back control's name starts as "This firing" and becomes "Collection opened".
- The add button's name starts as "Add to bag" and becomes "In the bag".
- Hit target of the add button is 44px. The back control is 32px tall and is not the primary action.
- The colour field is hidden from assistive tech.
- Contrast: `#2a1b14` on `#f3e6d4`, and `#fffdf8` on `#c45c2a`, clear 4.5.
- The price is text, not only a colour.

## Responsive rules

- At 1280 the columns are 420px and the rest, gap 48px, vertically centered.
- At 1024 the field may shrink to 320px wide and 400px tall. The name stays 56px if it fits, else 44px.
- At 768 the page becomes one column. The field is 240px tall and full width. The text follows it. Padding becomes 24px.
- Below 640, the name is 40px and the button is full width, still 44px tall. Do not swap in the phone checkout. Checkout comes after the cart.

## Acceptance checklist

- [ ] The name "Ash bowl" is 56px Young Serif and is the only heading.
- [ ] The price is Rs 2,400 at 20px.
- [ ] The sentence is "Thrown last week. It holds a portion for two."
- [ ] The colour field is 420 by 480, radius 8px, fill `#c45c2a`.
- [ ] "Add to bag" is 44px tall, radius 8px, fill `#c45c2a`.
- [ ] Clicking it sets "In the bag" and disables it at opacity 0.55.
- [ ] "This firing" is not a filled button.
- [ ] Clicking it sets "Collection opened".
- [ ] There is no second product, no review list, and no size picker.
- [ ] Focus ring is 2px, offset 2px.
- [ ] The colour field is `aria-hidden`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The first frame shows the clay field, "This firing", "Ash bowl", "Rs 2,400", the sentence, and "Add to bag".
2. Clicking "Add to bag" sets the label to "In the bag" and disables the button at opacity 0.55.
3. The click does not change the price and does not add a second button.
4. Clicking "This firing" sets that control's label to "Collection opened". In a product it returns to `shop-collection`. It is not a primary button.
5. There is no animation.
6. Focus ring is 2px `--focus`, offset 2px.
7. The colour field is `aria-hidden`. The name carries the product.

## Tokens

```css
:root {
  --bg: #f3e6d4;
  --ink: #2a1b14;
  --ink-2: #6a4e3e;
  --primary: #c45c2a;
  --primary-ink: #fffdf8;
  --focus: #c45c2a;
  --clay: #c45c2a;
  --serif: "Young Serif", Georgia, serif;
  --sans: "Hanken Grotesk", system-ui, sans-serif;
}
```

The clay field uses the same orange as the primary. That is one accent, used for the object and the button. Do not add a gold.

## Typography

| Role | Family | Size | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Back | sans | 16px | 600 | 0 | `--ink-2` |
| Name | serif | 56px | 400 | -0.03em | `--ink` |
| Price | sans | 20px | 400 | 0 | `--ink` |
| Sentence | sans | 16px | 400 | 0 | `--ink-2` |
| Button | sans | 16px | 600 | 0 | `--primary-ink` |

The name line-height is 1.2. The sentence line-height is 1.45. The price uses tabular numerals.

## Implementation notes

This page is the middle of the shop. The collection chooses the bowl. This page names it at display size and takes the one action that fills the bag. The bag is `shop-cart`, which already contains this bowl at Rs 2,400.

```css
body {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 48px;
  align-items: center;
  padding: 48px 64px;
}
h1 { font-family: var(--serif); font-size: 56px; font-weight: 400; letter-spacing: -0.03em; }
.add { height: 44px; border-radius: 8px; background: var(--primary); }
```

Do not rebuild the fragrance page's bottle, swatches, or sliding size indicator here. Those belong to `luxe-product-detail`.

Common mistakes:

- A 56px price and a 20px name. The name is the answer.
- Three size pills copied from the fragrance page.
- A row of "you may also like" under the sentence.
- A gold button on this clay page.
- A heart icon as a second primary.
- Star ratings.
- Opening the checkout from this button. The button opens the cart.
- Hiding the price inside the button label only. The price is its own line.
- A breadcrumb of four links. The single back control is enough.
- An image tag. The field is a colour block.

Where it sits in a product:

1. It opens from `shop-collection` when the chosen card is the ash bowl.
2. "This firing" returns to that collection.
3. "Add to bag" opens `shop-cart`.
4. The cart line for this bowl is Rs 2,400, quantity 1, until the person changes it.
5. Checkout is the screen after the cart, not this one.
6. One product per view. A second bowl is a second visit to this template, not a second column.
7. The sentence is one line of fact. It is not a brand manifesto.
8. If they asked for the fragrance, use `luxe-product-detail` instead, and say so.
9. The clay field and the button share `--primary` once a theme is locked.
10. The serif is the name only. The price and the sentence stay on the text face.
11. Do not add a quantity stepper here. Quantity lives on the cart.
12. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and the two faces.
2. Place the 420 by 480 clay field.
3. Place the back control, the 56px name, the price, and the sentence.
4. Place the 44px button.
5. Wire the button to "In the bag" and disabled.
6. Wire the back control to "Collection opened".
7. Check the name is larger than the price.
8. Check there is one primary button.
9. Point the button at the cart in the product, not at checkout.
10. Map the orange onto `--primary` when a kit is locked.

Copy you keep:

1. This firing.
2. Ash bowl.
3. Rs 2,400.
4. Thrown last week. It holds a portion for two.
5. Add to bag.
6. In the bag.
7. Collection opened.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
