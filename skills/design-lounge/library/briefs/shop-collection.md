<!-- Design Lounge Nº 198 · "Shop collection" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Shop collection

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. The next screen is `shop-product`.

## What it is

The collection for a clay shop called Kiln. The page is fired-clay paper. "Kiln" is a 12px label. "This firing" is a 40px serif heading. Four shelf filters sit under it: All, Bowls, Cups, Lamps. Six pieces sit in a three-column grid. Each card is a clay colour field, a name, and a price. Ash bowl starts selected. The only primary button reads "Open ash bowl". Lamps is an empty shelf: the heading becomes the empty sentence, and the button becomes "Show everything". There is no hero photograph, no sale banner, and no second shop inside this page. Opening a piece goes to `shop-product`. It does not go to the fragrance detail unless the product they named is that fragrance.

## Reference behaviour

1. All is pressed. Six cards are visible. Ash bowl is pressed. The button reads "Open ash bowl".
2. Clicking a card selects it and rewrites the button as "Open {name}" in lower case. The previous card loses the ring.
3. Clicking the open button sets "Opening {name}" and disables it. It does not navigate inside this demo. In a product, it opens `shop-product` for that piece.
4. Bowls shows Ash bowl and Night plate. Cups shows Salt cup and Small lid. All also shows Clay jug and Fire vase.
5. Lamps shows no cards. The heading "This firing" hides. The empty heading reads "No lamps this firing." The open button hides. "Show everything" is the primary button.
6. "Show everything" returns to All and restores the heading, the grid, and the open button.
7. There is no animation.
8. Focus ring is 2px `--focus`, offset 2px.

## Structure

```
padding 36px 48px
Kiln                         12px label          [ Open ash bowl ]
This firing                  40px serif
[ All ] [ Bowls ] [ Cups ] [ Lamps ]
grid, 3 columns, gap 16, max-width 960
  card: colour field 112px, name, price
empty, hidden until Lamps
```

- The label and the open button share one row.
- Cards are buttons. The colour field is decorative and `aria` comes from the button name via its text.
- The empty block is hidden until the shelf has zero pieces.
- Do not draw product photography. The colour field is the stand-in.

## Tokens

```css
:root {
  --bg: #f3e6d4;
  --surface: #faefe0;
  --ink: #2a1b14;
  --ink-2: #6a4e3e;
  --ink-3: #9a7d68;
  --line: #d8c0a4;
  --primary: #c45c2a;
  --primary-ink: #fffdf8;
  --focus: #c45c2a;
  --serif: "Young Serif", Georgia, serif;
  --sans: "Hanken Grotesk", system-ui, sans-serif;
}
```

These are the Kiln theme colours. When a kit is locked, replace them. Keep the sizes.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 600 | `--ink-2` |
| Title | serif | 40px | 400 | `--ink` |
| Filter | sans | 15px | 400 | `--ink` or `--primary-ink` |
| Name | sans | 15px | 600 | `--ink` |
| Price | sans | 13px | 400 | `--ink-2` |
| Empty title | serif | 32px | 400 | `--ink` |
| Button | sans | 15px | 600 | `--primary-ink` |

Prices use tabular numerals. The title letter-spacing is -0.02em.

## Motion

None. Reduced motion has nothing to remove. Do not fade the grid when the shelf changes.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Card | click | ring moves, button label updates, button enables |
| Open | click | label "Opening …", disabled, opacity 0.55 |
| Shelf | click | grid filters, or the empty block replaces it |
| Show everything | click | shelf returns to All |

## States

- Filter resting: 32px tall, pill, 1px `--line`, transparent fill.
- Filter pressed: fill `--primary`, text `--primary-ink`, border transparent.
- Card resting: 1px `--line`, radius 8px, surface fill.
- Card pressed: inset ring 2px `--primary`. One card pressed.
- Open button: height 40px, radius 8px, fill `--primary`. Disabled opacity 0.55.
- Empty: grid and title `display: none`. The empty heading and "Show everything" show.
- Focus-visible: 2px outline, offset 2px.

## Accessibility

- The page heading is the `h1` "This firing". The empty state uses an `h2` while the `h1` is hidden.
- Shelf filters are a group labelled "Shelf". One `aria-pressed="true"`.
- Each card is a button. `aria-pressed` is true on the selected piece only.
- The open button's name includes the piece name.
- Hit targets: filters 32px, open button 40px, cards are the full tile.
- Contrast: `#2a1b14` on `#f3e6d4` and `#fffdf8` on `#c45c2a` clear 4.5.
- The colour field is not the only signal of which card is selected. The ring and the button name carry it.
- Lamps announces itself through the empty heading, not through a blank grid.

## Responsive rules

- At 1280 the grid is three columns, max-width 960px.
- At 1024 the grid stays three columns if the tiles stay at least 200px. Otherwise two columns.
- At 768, two columns. The title may drop to 32px. The open button stays on the top row.
- Below 640, one column. Filters wrap. Do not turn this into the phone checkout. The phone shop uses `mobile-filter-chips-list` and `mobile-one-page-checkout`.

## Acceptance checklist

- [ ] "Kiln" is 12px. "This firing" is 40px Young Serif.
- [ ] Six cards on All. Ash bowl starts pressed.
- [ ] The button reads "Open ash bowl".
- [ ] Bowls shows two cards. Cups shows two cards. Lamps shows none.
- [ ] Lamps hides the grid and shows "No lamps this firing."
- [ ] "Show everything" returns to the six cards.
- [ ] Clicking Night plate sets the button to "Open night plate".
- [ ] Clicking the open button disables it and sets "Opening …".
- [ ] Selected card has a 2px inset ring in `#c45c2a`.
- [ ] No photograph, no sale banner, no second primary button.
- [ ] Prices match the table in Implementation notes.

## Implementation notes

| Name | Price | Shelf | Field |
| --- | --- | --- | --- |
| Ash bowl | Rs 2,400 | bowls | `#c45c2a` |
| Salt cup | Rs 900 | cups | `#6a4e3e` |
| Night plate | Rs 3,200 | bowls | `#2a1b14` |
| Clay jug | Rs 4,600 | vessels | `#4f6b3a` |
| Small lid | Rs 700 | cups | `#d8c0a4` |
| Fire vase | Rs 5,800 | vessels | `#9a7d68` |

Vessels have no filter of their own. They appear on All. Lamps is the shelf with zero pieces. Do not add a lamp to remove the empty state.

```css
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 960px; }
.card[aria-pressed="true"] { box-shadow: inset 0 0 0 2px var(--primary); }
.swatch { height: 112px; }
```

The open button is hidden with the `hidden` attribute while Lamps is showing, so it leaves the accessibility tree. The empty button is the primary for that frame.

Common mistakes:

- A full-bleed photograph hero above the grid.
- A "Sale" badge on a card.
- Four equal promotional tiles instead of the pieces.
- Linking a card to `luxe-product-detail` when the shop is this clay firing.
- Leaving a blank grid on Lamps instead of the empty heading.
- A second button, "Filter", beside "Open".
- Stars, review counts, or a heart icon.
- Prices in a second colour that competes with the name.
- Animating the cards in on filter.
- Drawing a shopping bag icon as the only way to reach the cart. The cart is the next screen after the product, not a shortcut that skips the product.

Where it sits in a product:

1. It is the first shop screen. The next screen is `shop-product`.
2. The product page's back control returns here.
3. The cart is `shop-cart`, reached from the product, not from this grid.
4. Checkout is `mobile-one-page-checkout` after the cart.
5. Do not add a fifth screen such as a lookbook.
6. The empty shelf uses the empty pattern: a heading, one sentence, one button.
7. A failed load of the catalogue uses `load-failed-retry`, not this empty shelf. Empty means the shelf has zero pieces. Failure means the list did not arrive.
8. One selected piece. The button names it.
9. The colour fields are the only colour variation. They are not a second palette.
10. When a theme is locked, the clay orange becomes `--primary` and the paper becomes `--bg`.
11. The serif is the display face for the heading only. Names stay on the text face.
12. Keep the credit line on the token block.

Rebuild order:

1. Set the paper, the serif, and the grotesk.
2. Place the label and the open button on one row.
3. Place the 40px heading.
4. Place the four filters. All starts pressed.
5. Paint the six cards from the table. Ash bowl starts pressed.
6. Wire a card click to move the ring and rewrite the button.
7. Wire Lamps to the empty block.
8. Wire "Show everything" back to All.
9. Wire the open button to the disabled "Opening" label.
10. Check Bowls and Cups against the table before you add a piece.

Copy you keep:

1. Kiln.
2. This firing.
3. All, Bowls, Cups, Lamps.
4. No lamps this firing.
5. The lamp shelf is clear. Everything else is still on the table.
6. Show everything.
7. Open ash bowl. Opening ash bowl.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
