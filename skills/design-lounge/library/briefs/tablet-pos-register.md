<!-- Design Lounge Nº 437 · "Tablet cafe register" · www.designlounge.live -->

# Tablet cafe register

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The counter screen of a small cafe ("Chautari Coffee, Jhamsikhel") on a landscape tablet. A barista taps big tiles to build an order, sees it on a ticket on the right, and takes payment without leaving the screen. Three columns: an espresso-brown category rail, a grid of item tiles, and the order ticket. The look is soft and warm: oat paper, espresso ink, 16px corners, one teal for money actions. Every number uses tabular figures so prices line up. The detail worth copying is the two-speed tile: a tap adds the default item at once, a hold (or the small round button) opens a sheet for size, milk and extra shot.

## Structure

```
1180 × 820, 24px top clearance (the Lounge draws the frame)
┌────────┬───────────────────────────────────────┬───────────────────────────┐
│Chautari│ Coffee  8 items · tap to add, hold…   │ Order 0418         Clear  │ 64
│JHAMSIK.│ ┌──────────┐┌──────────┐┌──────────┐ │ Table 6 · Dine in         │
│────────│ │▀▀▀▀▀▀▀▀▀▀││▀▀▀▀▀▀▀▀▀▀││▀▀▀▀▀▀ (1)│ │───────────────────────────│
│[Coffee]│ │Espresso  ││Americano ││Flat white│ │Flat white          Rs 370 │
│  Tea   │ │Double…   ││Long…     ││Velvet…   │ │Regular·Oat  [bin] 1 [+]   │
│ Bakery │ │Rs 180 (o)││Rs 220 (o)││Rs 280 (o)│ │Masala chai         Rs 360 │
│  Cold  │ └──────────┘└──────────┘└──────────┘ │Regular·Whole [−] 2 [+]    │
│        │  … 150px rows, 12px gaps            │ …                         │
│        │                                     │ [pencil] note       56px  │
│        │                                     │ Subtotal          Rs 1,097│
│ Till 2 │                                     │ VAT 13% (incl.)     Rs 143│
│ Anu R. │                                     │ Total             Rs 1,240│
│        │                                     │ [  Charge Rs 1,240  ] 72  │
└────────┴───────────────────────────────────────┴───────────────────────────┘
  112          minmax(0,1fr) ≈ 620                         384
  gap 16, outer padding 0 16 16
```

- `.app` is a grid: `112px minmax(0,1fr) 384px`, gap 16px, padding `0 16px 16px`, height 100% under a 24px body padding.
- `<nav class="rail" aria-label="Menu categories">`: brand mark, four `<button aria-pressed>` categories, the till and cashier at the bottom.
- `<main class="menu">`: an `h1` with the category name, a hint `p`, then a grid of `.tile` containers. Each tile holds a full-size `<button class="add">` (name, one-line description, price), a badge `span`, and a 56px `<button class="opt" aria-label="Options for …">`.
- `<aside class="ticket" aria-label="Order ticket" data-view="order|tender|done">` holds three `section` views. Only the one matching `data-view` is shown.
- Order view: header, `<ul class="lines" aria-live="polite">`, note `input`, a `dl` of sums, the charge `button`.
- Tender view: Back button, amount due, a `role="group"` of three method buttons with `aria-pressed`, a pane that changes by method, the take button.
- Done view: tick circle, `h2` "Paid", two lines, New order button.
- The sheet is `<div role="dialog" aria-modal="true" aria-labelledby>` fixed to the bottom, with a scrim behind it. The options are real radio inputs inside `fieldset`s.

### Content

| Category | Items (name, description, price) |
| --- | --- |
| Coffee | Espresso (Double, 60ml) 180, Americano 220, Flat white 280, Cappuccino 260, Cafe latte 280, Mocha 320, Cortado 240, Honey latte 310 |
| Tea | Masala chai 180, Ilam green 160, Butter tea 200, Ginger lemon 190, Rooibos 170, Chiya 120 |
| Bakery | Cardamom bun 220, Banana bread 190, Croissant 210, Sel roti 140, Biscotti 150, Carrot cake 260 |
| Cold | Cold brew 290, Iced latte 300, Lemon soda 150, Lassi 200, Affogato 340, Iced mocha 340 |

Prices are in rupees and formatted with `toLocaleString('en-IN')`, so Rs 1,240 and Rs 1,00,000.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Tile press | `:active` | transform | scale 1 → 0.97 | 140ms | `--ease` | instant |
| New line | added to ticket | opacity, translateY | 0, -8px → 1, 0 | 260ms | `--ease-out` | instant |
| Line flash | quantity goes up | background | `--teal-soft` → transparent | 600ms | `--ease` | instant |
| Category, ticket hover | hover | background | none → tint | 140ms | `--ease` | instant |
| Ticket view swap | `data-view` change | opacity, translateX | 0, 12px → 1, 0 | 260ms | `--ease-out` | instant |
| Sheet | open / close | translateY | 104% → 0 | 340ms | `--ease-sheet` | instant |
| Scrim | open / close | opacity | 0 → 1 | 340ms | `--ease` | instant |
| Menu dim | tender, done | opacity | 1 → 0.45 | 260ms | `--ease` | instant |
| Paid tick | done view | stroke-dashoffset | 30 → 0 | 420ms, delay 120ms | `--ease-out` | drawn at once |

Reduced motion: set every animation and transition to 1ms and show the tick fully drawn. Nothing loops.

## States

- Category resting: `rgba(246,238,226,.78)` text on espresso. Hover: 8% oat tint. Selected: `--bg` fill, `--ink` text, `aria-pressed="true"`.
- Tile resting: `--tile`, 1px `--line` border, shadow. Pressed: scale 0.97. Badge hidden when the count is 0.
- Options button: 56px circle, `--bg`. Hover `--oat-2`.
- Ticket line normal, line just added (drop), line just increased (flash).
- Stepper minus at quantity 1: bin icon, label "Remove Flat white".
- Ticket empty: centred message, charge disabled (`--oat-2` fill, `--ink-3` text, `cursor: not-allowed`).
- Note: dashed `#cdbba2` border. Focus-within: solid teal border plus a 2px `--teal-soft` ring.
- Method tile selected: teal 1.5px border, `--teal-soft` fill, text `#14524d`.
- Quick cash selected: espresso fill, oat text.
- Rail and menu while in tender or done: `inert`, rail at 70% opacity, menu at 45% with saturate 0.6.
- Focus-visible everywhere: 3px teal outline, offset 2px. On the rail, the outline is oat. On teal buttons, the outline is espresso.

## Accessibility

- Category buttons use `aria-pressed`. The grid title is the only `h1`.
- Each tile's main button reads as name, description, price. The options button has its own label, "Options for Cappuccino". Hold is a shortcut, never the only way.
- Long-press must not open the browser's context menu. Prevent `contextmenu` on the grid.
- The ticket list is `aria-live="polite"`, so adding an item is announced.
- Stepper buttons are labelled "One more Masala chai", "One less Masala chai", "Remove Cardamom bun". The quantity is an `output`.
- The sheet is a modal dialog. Focus moves to the first checked option on open. Tab and Shift+Tab loop inside the sheet. Escape closes it. Focus returns to the tile or button that opened it.
- Options are radio inputs, so arrow keys move inside a group.
- Charge moves focus to Back. Take moves focus to New order. New order moves focus to the first tile.
- The done view is `aria-live="polite"`.
- The QR svg has `role="img"` and a label with the amount.
- Every touch target is at least 56px on its short side, except the stepper buttons at 56×48. Do not go below 48px anywhere.
- Contrast: `#3b2a20` on `#efe6d8` is above 10:1. `#6b5444` on `#fffdf8` is above 6:1. `#f3fbf9` on `#1f6f68` is above 5.5:1.

## Responsive rules

- 1180×820 landscape is the reference. It should still look right from about 1024 to 1366 wide. The grid takes the slack. The rail stays 112px and the ticket stays 384px.
- Tablet portrait, 820×1180: the rail becomes a full-width row across the top (brand, four categories in a row at 56px tall, till on the right). Below it, two columns: the menu grid at `minmax(0,1fr)` with 2 tile columns, and the ticket at 340px. Rows stay 150px. The extra height shows more lines.
- Phone, under 600 wide: one column. Categories become a horizontal row of 48px chips under a 56px top bar. Tiles go to 2 columns, 120px tall, with the options button at 48px. The ticket leaves the screen and becomes a sticky bottom bar, "4 items · Rs 1,240 · View order", 64px tall. Tapping it opens the ticket as a full-height sheet with the charge button pinned at the bottom. Tender and done replace the sheet content in place.
- Never let the grid overflow sideways. Use `minmax(0,1fr)` in every grid track that holds text.
- Do not draw a status bar. Leave 24px at the top.

## Acceptance checklist

### Always

- [ ] Three regions on landscape: a category rail, a tile grid, an order ticket. One `h1`.
- [ ] A tap on a tile adds the default item. A 480ms hold or the round button opens the options sheet. A hold never adds twice.
- [ ] Same item with the same options increases quantity. Different options make a new line.
- [ ] The stepper minus becomes a remove button at quantity 1.
- [ ] Totals recompute on every change. The charge button shows the total and is disabled when the ticket is empty.
- [ ] Charge leads to a tender view with exactly three methods, then to a done view with a New order button.
- [ ] The menu is `inert` while tendering.
- [ ] The sheet traps focus, closes on Escape and returns focus.
- [ ] Every target is at least 48px. Primary targets are 56px or more. The charge button is 72px tall.
- [ ] One accent colour, used only for money actions, badges and selected options.
- [ ] Tabular figures on every price.
- [ ] Reduced motion removes all movement and leaves every state reachable.

### This demo

- [ ] The first frame shows Coffee, eight tiles, Order 0418 with four lines, and "Charge Rs 1,240".
- [ ] Subtotal Rs 1,097, VAT 13% (included) Rs 143, Total Rs 1,240.
- [ ] Cash for Rs 1,240 offers Exact, Rs 1,500, Rs 2,000, with Rs 1,500 selected and Rs 260 change.
- [ ] The rail is `#3b2a20`. The charge button is `#1f6f68`. Corners are 16px.
- [ ] New order moves to Order 0419.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: Coffee is the selected category. Eight coffee tiles show in a 3-column grid. The ticket is "Order 0418 · Table 6 · Dine in" with four lines: Flat white (Regular · Oat · +1 shot) Rs 370, Masala chai ×2 Rs 360, Cardamom bun (Warmed) Rs 220, Cold brew Rs 290. Total is Rs 1,240. The big button reads "Charge Rs 1,240". The Flat white tile shows a teal badge "1".
2. Tap a category in the rail: it turns oat with espresso text. The grid title and the tiles change at once. The hint reads "6 items · tap to add, hold for options".
3. Tap a tile: the item is added with its default options (Coffee and Tea: "Regular · Whole", Bakery: "As is", Cold: "Regular"). If the same item with the same options is already on the ticket, its quantity goes up by one and that line flashes teal-soft. If not, a new line drops in at the bottom. The tile badge shows the total count of that item on the ticket.
4. Press and hold a tile for 480ms, or tap its round options button: the modifier sheet slides up from the bottom. The tap that ends a hold does not also add the item.
5. In the sheet, pick Size (Small −Rs 20, Regular, Large +Rs 40), Milk (Whole, Oat +Rs 40, Almond +Rs 50, None), Extra shot (No, +1 shot +Rs 50, +2 shots +Rs 100) and Quantity (1 to 4). Bakery items show only Serve (As is, Warmed) and Quantity. Tea shows Size and Milk. The Add button shows the live price, for example "Add Rs 370". Add puts the line on the ticket and closes the sheet. Cancel, the scrim, or Escape closes it without adding.
6. On a ticket line, + adds one. − removes one. When the quantity is 1, the − button becomes a bin icon and removes the line. Totals update on every change.
7. Prices include 13% VAT. The ticket shows Subtotal (total ÷ 1.13, rounded), "VAT 13% (included)" (total minus subtotal) and Total. With the first-frame order: Rs 1,097, Rs 143, Rs 1,240.
8. Clear empties the ticket. The empty ticket says "Nothing on the ticket. Tap a tile to start an order." The charge button reads "Charge" and is disabled.
9. Tap Charge: the ticket panel switches to the tender view. The rail and the menu dim to 45% and stop taking input. The view shows "Amount due Rs 1,240" in large type, three method tiles (Cash, Card, QR) with Cash selected, and a Back button.
10. Cash shows three quick amounts: Exact, the next Rs 500 note step, and the next Rs 1,000 step above that (for Rs 1,240: Exact, Rs 1,500, Rs 2,000). The middle one starts selected. "Change due" updates (Rs 260). The button reads "Take Rs 1,240 cash".
11. Card shows a reader hint and the button reads "Card approved". QR shows a 21×21 code drawn as SVG squares and the button reads "Payment received".
12. Take the payment: the panel shows the done view. A teal circle draws a tick, "Paid", "Rs 1,240 by cash", "Change Rs 260 · receipt printed". New order empties the ticket, moves to Order 0419, clears the note and gives input back to the menu.
13. Back in the tender view returns to the order view with the ticket unchanged.

## Tokens

```css
:root {
  /* surfaces */
  --bg: #efe6d8;          /* oat page */
  --surface: #faf5ec;     /* ticket, sheet */
  --tile: #fffdf8;        /* item tiles, method tiles */
  --oat-2: #e6dac7;       /* hover on oat controls, disabled button */
  --line: #e0d2bd;        /* hairlines and tile borders */
  /* ink */
  --ink: #3b2a20;         /* espresso: text and the rail */
  --ink-2: #6b5444;       /* secondary text */
  --ink-3: #7d6656;       /* labels, "each" prices */
  --on-dark: #f6eee2;     /* text on the rail */
  /* the one accent */
  --teal: #1f6f68;        /* charge, take, badges, selected options */
  --teal-ink: #f3fbf9;
  --teal-soft: #d5e9e5;   /* selected option fill, line flash */
  /* category bands, muted on purpose */
  --band-coffee: #8a5a3b;
  --band-tea: #b4822c;
  --band-bakery: #c0663a;
  --band-cold: #5c8592;
  /* type */
  --display: "Fraunces", Georgia, serif;
  --sans: "Source Sans 3", system-ui, sans-serif;
  /* shape */
  --r: 16px;
  --r-sm: 12px;
  --tap: 56px;
  --shadow: 0 1px 0 rgba(59,42,32,.06), 0 6px 18px -10px rgba(59,42,32,.35);
  /* motion */
  --t-fast: 140ms;
  --t-mid: 260ms;
  --t-sheet: 340ms;
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-sheet: cubic-bezier(.32,.72,0,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
}
```

Spacing runs on 4: 4, 8, 12, 16, 20, 24, 32.

## Typography

Set `font-variant-numeric: tabular-nums` on `body`. Prices must not jitter when a quantity changes.

| Role | Family | Size | Weight | Line-height | Notes |
| --- | --- | --- | --- | --- | --- |
| Category title | Fraunces | 34px | 600 | 1 | letter-spacing -0.01em |
| Brand mark | Fraunces | 15px | 600 | 1.1 | sub-label 11px Source Sans 600, uppercase, 0.08em |
| Rail label | Source Sans 3 | 14px | 600 | 1.35 | |
| Tile name | Source Sans 3 | 19px | 700 | 1.15 | |
| Tile description | Source Sans 3 | 13.5px | 400 | 1.35 | `--ink-2` |
| Tile price | Source Sans 3 | 19px | 700 | 1.35 | |
| Ticket title | Fraunces | 20px | 600 | 1.2 | |
| Line name, line price | Source Sans 3 | 17px | 700 | 1.35 | |
| Line options | Source Sans 3 | 13.5px | 400 | 1.35 | "each" price in `--ink-3` |
| Sums | Source Sans 3 | 15px | 400 | 1.35 | Total row 20px 700 `--ink` |
| Charge button | Source Sans 3 | 22px | 700 | 1 | |
| Amount due | Fraunces | 52px | 600 | 1.05 | letter-spacing -0.02em |
| Section labels | Source Sans 3 | 13px | 700 | 1.2 | uppercase, 0.06em, `--ink-3` |
| Paid | Fraunces | 40px | 600 | 1.1 | |

Fraunces is only for titles and the amount due. Never set prices on tiles or lines in Fraunces.

## Implementation notes

Always: keep the ticket as the single source of truth for money. Store unit price and quantity per line. Compute every total from the lines. Never store a running total.

**Tap versus hold.** Start a timer on `pointerdown`. Clear it on `pointerup`, `pointerleave` and `pointercancel`. If the timer fired, swallow the next click.

```js
let pressT, longed = false;
grid.addEventListener('pointerdown', e => {
  const b = e.target.closest('.add'); if (!b) return;
  longed = false;
  pressT = setTimeout(() => { longed = true; openSheet(b.dataset.n); }, 480);
});
['pointerup', 'pointerleave', 'pointercancel']
  .forEach(t => grid.addEventListener(t, () => clearTimeout(pressT), true));
grid.addEventListener('contextmenu', e => e.preventDefault());
grid.addEventListener('click', e => {
  const b = e.target.closest('.add'); if (!b) return;
  if (longed) { longed = false; return; }
  addLine(b.dataset.n, defaultMods(b.dataset.n), price(b.dataset.n));
});
```

**VAT included.** Cafe prices are shown with VAT in. Split it out for the receipt, not the other way round.

```js
const total = order.reduce((a, l) => a + l.u * l.q, 0);
const net = Math.round(total / 1.13);
const vat = total - net;          // always adds back to total exactly
```

**Cash quick amounts.** Round up to note steps and drop duplicates.

```js
const quick = [t, ...[500, 1000, 5000].map(n => Math.floor(t / n) * n + n)]
  .filter((v, i, a) => a.indexOf(v) === i).slice(0, 3);
```

**The line flash.** Add the class with no transition, then remove it two frames later so the 600ms fade runs.

```css
.line { transition: background 600ms var(--ease); }
.line.flash { background: var(--teal-soft); transition: none; }
```

Common mistakes:

- Making hold the only way into options. Touch users and keyboard users need the round button.
- A tap that fires after a long-press and adds the item a second time.
- Proportional figures, so "Rs 1,240" shifts when it becomes "Rs 1,110".
- Teal on everything. The rail is espresso, tiles are cream, only money and selection are teal.
- Bright category colours. The bands are muted and only 10px tall.
- Letting the barista add items while the tender view is open. Make the menu `inert`.
- Computing VAT on top of tile prices, so the charged total does not match the tiles.
- Small stepper buttons. 56×48 is the floor on a counter.
- Drawing a status bar or a fake tablet bezel.

Rebuild order:

1. Lay out the three columns with the 24px top clearance.
2. Render the rail and the tile grid from data.
3. Build the ticket from an array of lines and compute totals.
4. Wire tap to add, then hold and the round button to the sheet.
5. Build the sheet with radio groups and the live Add price.
6. Add the tender view, the three methods and the cash change.
7. Add the done view and New order.
8. Add motion last, then check reduced motion.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
