<!-- Design Lounge Nº 337 · "Product cards with quick add" · designlounge.vercel.app -->

# Product cards with quick add

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A row of four product cards for a small streetwear label, "Halftone Supply Co.", under a 64px header with a bag counter. Each card shows product art, a tag, a name, a price, and colour swatches. On hover or keyboard focus a black "Quick add" bar slides up over the bottom of the art with size buttons. Picking a size flashes "Added" in tomato red and bumps the bag count from 2 to 3. The look is retro paper: off-white stock with a dot grain, black ink, one tomato red, a condensed grotesk in capitals, mono prices, and square corners everywhere. The detail worth copying is that the bar is never hover-only. A 40px "+" toggle in each card opens it for touch, and focus inside the card opens it for keyboard.

## Reference behaviour

1. First frame: four cards in one row. Card 2 (Ridge crew sweat) already has its quick-add bar open and its toggle shows "×". The bag shows 2.
2. Each card's art is drawn with CSS shapes. There are no images. A tee, a crew sweat, a cap, and a tote.
3. Hover a card (pointer devices): the art swaps to a second angle (the back) in 240ms. The front slides 8px left and fades out. The back slides in from 8px right and fades in.
4. Hover a card: the quick-add bar slides up from below the art in 280ms (expo out).
5. Tab into a card: the "+" toggle gets focus. Focus inside the card opens the bar, so the next Tab reaches the size buttons. Focus inside the art area also shows the back angle.
6. Tap the "+" toggle (touch, mouse, or Enter): the card gets the class `open`, the bar stays up, `aria-expanded` becomes `true`, and the "+" icon rotates 45° into "×". Tap again to close.
7. Click a swatch: the art recolours in 160ms. The colour name under the product name updates (for example "Ink" becomes "Tomato"). The pressed swatch gets a 2px paper gap and a 1px ink ring.
8. Click a size: the bar is covered by a tomato panel with a check icon and "Added" for 1600ms. The bar stays up during that time even if the pointer leaves. Then the panel fades out.
9. At the same moment the bag count goes up by 1. The count square scales to 1.35 and flashes tomato, then returns, in 420ms.
10. A polite live region says, for example: "Added Monsoon heavy tee, Ink, M. Bag has 3 items."
11. Sold-out sizes are disabled, shown in a muted grey with a line through, and cannot be clicked.
12. One-size products (the tote) show one wide button, "Add one size".
13. With reduced motion: no slide, no swap slide, no bump. The bar and the back angle still appear, instantly.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────────┐
│ HALFTONE supply co.        DROP 07  TEES  LAYERS  CARRY        BAG [] [2]│ 64px, 1px ink rule
├──────────────────────────────────────────────────────────────────────────┤
│ padding 28px 48px                                                         │
│ DROP 07 / MONSOON  (64px)                     4 pieces · 340 gsm cotton   │
│ ───────────────────────────────────────────── 1px line, 24px below ────── │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│ │NEW       [+]│ │-20%      [×]│ │NEW       [+]│ │-20%      [+]│ art 4:5  │
│ │             │ │             │ │             │ │             │ 1px ink  │
│ │   tee art   │ │  crew art   │ │   cap art   │ │  tote art   │ border   │
│ │             │ │▓QUICK ADD ▓▓│ │             │ │             │          │
│ │             │ │▓[S][M][L].. │ │             │ │             │          │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘          │
│ NAME      $48   NAME  $95 $76   NAME      $38   NAME  $34 $27            │
│ Ink    ■ ■ ■    Tomato ■ ■ ■    Stone  ■ ■ ■    Moss   ■ ■ ■             │
│     gap 20px, 4 × minmax(0,1fr)                                           │
│ ─────────────────────────────────── 1px ink, 40px below grid ──────────── │
│ (i) Free returns 30 days  (i) Printed in Lalitpur  (i) Drop 08 24 October │
└──────────────────────────────────────────────────────────────────────────┘
```

- `header.top`: a three-column grid (`minmax(0,1fr) auto minmax(0,1fr)`). Wordmark link on the left, `nav` labelled "Shop" in the middle, bag `button` on the right.
- `main` holds a `.head` (the `h1` and a `p.meta`), the `ul.grid` of cards, a `ul.strip` of three service notes, and a visually hidden `p[role=status][aria-live=polite]`.
- The strip is 3 × `minmax(0,1fr)`, 40px under the grid, with a 1px ink top rule and 16px top padding. Each note has a 20px stroke icon (a return arrow, a van, a calendar) and 12px mono text.
- Each card is an `li.card` with two parts:
  - `.media` (4:5, `overflow: hidden`, 1px ink border): `span.tag`, `button.qa-t` (the toggle), `div.art.f` (front), `div.art.b` (back), and `div.qa` (the bar).
  - `.info`: `h2.name`, `p.price`, `span.cname` (colour name), and `div.sws[role=group][aria-label=Colour]` with three swatch buttons.
- `.qa` holds a label row ("Quick add" plus a fit note in mono) and `.sizes`, a grid of size buttons. A `.done` panel sits absolutely over `.sizes`.
- The art is made of `<i>` shapes, positioned absolutely, each with `background: var(--c)`. Details such as a chest label or a back print use `var(--p)`.

Card copy:

| # | Tag | Name | Price | Colours (first is selected) | Sizes | Fit note | Back angle |
|---|-----|------|-------|-----------------------------|-------|----------|------------|
| 1 | New | Monsoon heavy tee | $48 | Ink, Tomato, Stone | S M L XL, XXL sold out | Boxy fit | big "07 / MONSOON" print |
| 2 | -20% | Ridge crew sweat | ~~$95~~ $76 | Tomato, Ink, Moss (Tomato selected) | S M L XXL, XL sold out | True to size | "RIDGE" chest band |
| 3 | New | Six-panel field cap | $38 | Stone, Ink, Tomato | S / M, L / XL | Strap back | strap opening, short rim |
| 4 | -20% | Market tote No. 2 | ~~$34~~ $27 | Moss, Ink, Stone | one size | One size, 18 L | handle and dashed pocket |

Page copy: header nav "Drop 07, Tees, Layers, Carry" with Drop 07 current. Heading "Drop 07 / Monsoon" with the slash in tomato. Meta "4 pieces · 340 gsm cotton / Ships from Lalitpur in 2 days". Strip: "Free returns within 30 days", "Printed and sewn in Lalitpur", "Drop 08 lands 24 October".

## Tokens

```css
:root {
  /* colour: warm paper, black ink, one tomato */
  --paper: #f1ede4;   /* page */
  --media: #e6e0d2;   /* art well behind each product */
  --ink: #151412;     /* text, borders, bar, tags */
  --ink-2: #4a463f;   /* meta, colour name, strip text */
  --ink-3: #6f6a60;   /* struck price, sold-out size */
  --line: #cfc7b6;    /* rule under the heading */
  --tomato: #c2321c;  /* sale tag, sale price, Added panel, current nav underline */
  --stone: #b6ae9d;   /* swatch and fit note on the bar */
  --moss: #5d5e3c;    /* swatch only */

  /* art colour, set per card by the selected swatch */
  --c: var(--ink);    /* garment */
  --p: var(--paper);  /* print on the garment */

  /* type */
  --cond: "Barlow Condensed", "Arial Narrow", sans-serif;
  --mono: "DM Mono", ui-monospace, monospace;

  /* space (4px base) */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px; --s-6: 24px; --s-7: 28px; --s-12: 48px;

  /* shape */
  --radius: 0;        /* every corner is square */
  --border: 1px solid var(--ink);

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-micro: 160ms;   /* swatch recolour, size hover, Added fade */
  --t-swap: 240ms;    /* art angle swap */
  --t-bar: 280ms;     /* quick-add slide */
  --t-bump: 420ms;    /* bag count */
  --t-added: 1600ms;  /* how long Added stays */
}
```

Page grain: `background-image: radial-gradient(rgba(21,20,18,.06) .6px, transparent .7px); background-size: 4px 4px` on the body. Art well halftone: `radial-gradient(rgba(21,20,18,.09) 1px, transparent 1.2px)` at `7px 7px` on `.media::before`.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Wordmark | Barlow Condensed | 26px | 800 | 1 | 0.02em | UPPER |
| Wordmark suffix | DM Mono | 11px | 500 | 1 | 0.08em | UPPER |
| Nav, bag label | Barlow Condensed | 16px | 600 | 1 | 0.06em | UPPER |
| Page heading | Barlow Condensed | 64px | 800 | 0.86 | -0.01em | UPPER |
| Meta, strip | DM Mono | 12px | 400 | 1.6 | 0.04em | sentence |
| Tag | Barlow Condensed | 14px | 600 | 1 | 0.08em | UPPER |
| Product name | Barlow Condensed | 22px | 600 | 1 | 0.01em | UPPER |
| Price | DM Mono | 14px | 500 | 1.2 | 0 | numerals |
| Struck price | DM Mono | 12px | 500 | 1.2 | 0 | numerals |
| Colour name | DM Mono | 12px | 400 | 1.4 | 0 | sentence |
| Bar label | Barlow Condensed | 14px | 600 | 1 | 0.08em | UPPER |
| Fit note | DM Mono | 11px | 400 | 1 | 0.04em | sentence |
| Size button | DM Mono | 12px | 500 | 1 | 0 | as written |
| Added | Barlow Condensed | 18px | 600 | 1 | 0.08em | UPPER |
| Bag count | DM Mono | 13px | 500 | 1 | 0 | numerals |

Prices are always mono. Names are always the condensed face. Do not set prices in the condensed face.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| `.art.f` | card hover, focus inside `.media` | opacity, translateX | 1, 0 → 0, -8px | 240ms | `--ease` | opacity only, instant |
| `.art.b` | same | opacity, translateX | 0, 8px → 1, 0 | 240ms | `--ease` | opacity only, instant |
| `.qa` | hover, focus-within, `.open`, `.added` | translateY | 101% → 0 | 280ms | `--expo` | instant |
| `.qa-t svg` | `.open` | rotate | 0 → 45deg | 160ms | `--ease` | instant |
| art shapes | swatch click | background | old → new colour | 160ms | `--ease` | instant |
| `.done` | size click | opacity | 0 → 1, holds 1600ms, → 0 | 160ms each way | linear | instant |
| `.count` | size click | scale, background | 1 → 1.35 (at 35%) → 1, ink → tomato → ink | 420ms | `--expo` | none |

Restart the bump each time: remove the class, read `offsetWidth`, add the class again.

## States

- **Card resting:** front angle, bar hidden below the art, toggle shows "+".
- **Card hover (pointer):** back angle, bar up. The toggle still says "+" and `aria-expanded="false"`, because hover is a preview, not a state.
- **Card open (`.open`):** bar up, toggle shows "×", `aria-expanded="true"`. It stays open until the toggle is pressed again.
- **Focus inside the card:** bar up, so size buttons are reachable. Focus ring is 2px ink with a 2px offset on paper, and 2px paper inside the black bar.
- **Swatch selected:** `aria-pressed="true"`, ring `box-shadow: 0 0 0 2px var(--paper), 0 0 0 3px var(--ink)`.
- **Size hover:** button fills with paper and the text turns ink.
- **Size disabled (sold out):** text `--ink-3`, line-through, `cursor: not-allowed`, no hover fill. Its accessible name is "XL, sold out".
- **Added (`.added`, 1600ms):** tomato panel with a check and "ADDED" covers the sizes. The bar is held up.
- **Sale:** tag is tomato with paper text; price shows a struck original in `--ink-3` then the sale price in tomato.
- **New:** tag is ink with paper text.
- **Nav current:** 2px tomato underline. Nav hover: 2px ink underline.
- **Empty or error:** not shown. If adding fails in a real product, keep the bar open and replace "Added" with a short message in the same panel, ink on paper, for example "Could not add. Try again".

## Accessibility

- The grid is a `ul` and each card is an `li`. The product name is an `h2`.
- The toggle is a `button` with `aria-label="Quick add <product name>"`, `aria-expanded`, and `aria-controls` pointing at its bar.
- The art is decorative. Both angles are `aria-hidden="true"`.
- Swatches are `button`s with `aria-pressed` inside `role="group"` and `aria-label="Colour"`. Each has a text name such as "Ink". Colour is never the only signal; the colour name text under the name changes too.
- Sale prices use `<del>` and `<ins>` with visually hidden "Was" and "Now" so a screen reader says "Was $95, Now $76".
- Size buttons are real `button`s. Sold-out sizes use `disabled` and a label that says "sold out".
- The bag button's `aria-label` reads "Bag, N items" and updates on every add.
- A `role="status"` live region announces each add.
- Keyboard order inside a card: toggle, sizes, swatches. Focus anywhere inside the card keeps the bar open.
- Hit targets: toggle 40 × 40, size buttons 40px tall, swatches 28 × 28 with a 16px chip. Under `(hover: none)` swatches grow to 40 × 40.
- Contrast: ink on paper 16:1. `--ink-2` on paper 7.9:1. Paper on tomato 4.7:1, and tomato on paper the same. `--ink-3` on paper 4.6:1. The muted grey on the black bar is only for disabled sizes. A brighter tomato such as `#d93a24` drops to 3.9:1 and fails for the 14px tag; keep `#c2321c`.

## Responsive rules

- **≥ 1280:** 4 columns, gap 20px, page padding 48px. Header nav visible.
- **1024 (901–1100):** 4 columns, gap 14px, page padding 28px, nav gap 18px. Cards shrink; the art keeps 4:5.
- **768 (641–900):** 2 columns. The header nav is hidden; keep the wordmark and the bag. The strip stays 3 columns.
- **< 640:** 2 columns, gap 10px, page padding 16px, heading 44px, meta moves under the heading and aligns left, product name 18px, the strip becomes one column.
- **< 400:** 1 column.
- Never let the row scroll sideways. Use `repeat(n, minmax(0, 1fr))`, never fixed card widths.
- On `(hover: none)` screens the back angle only shows while focus is inside the art. The bar opens from the toggle. Do not rely on hover for either.

## Acceptance checklist

### Always

- [ ] Every card has art, a tag slot, a name, a price, swatches, and a quick-add bar.
- [ ] The quick-add bar opens on hover, on focus inside the card, and from a visible 40px toggle. It is never hover-only.
- [ ] The toggle has `aria-expanded` and `aria-controls`, and its icon turns from "+" to "×".
- [ ] Picking a size raises the bag count by 1, updates the bag's accessible name, and announces the add in a polite live region.
- [ ] "Added" holds for 1600ms and keeps the bar up while it shows.
- [ ] Sold-out sizes are disabled, struck through, and labelled "sold out".
- [ ] Swatches use `aria-pressed`, and the colour name text changes with them.
- [ ] Sale prices use `<del>` and `<ins>` with hidden "Was" and "Now".
- [ ] All corners are square. Borders are 1px ink. No drop shadows on cards.
- [ ] The grid uses `minmax(0,1fr)` and never scrolls sideways at any width.
- [ ] With reduced motion nothing slides or scales, and every state still appears.

### This demo

- [ ] Four cards: Monsoon heavy tee $48, Ridge crew sweat $95 → $76, Six-panel field cap $38, Market tote No. 2 $34 → $27.
- [ ] Tags: New, -20%, New, -20%. Sale tags are `#c2321c`.
- [ ] Card 2 starts with its bar open. The bag starts at 2.
- [ ] Art is 4:5 on `#e6e0d2` with a 7px halftone, and the page is `#f1ede4` with a 4px grain.
- [ ] Names in Barlow Condensed 22px/600 capitals; prices in DM Mono 14px.
- [ ] The bar slides in 280ms on `cubic-bezier(.16,1,.3,1)`; the art swap is 240ms with an 8px slide.

## Implementation notes

**The bar has four ways up, one rule.** Put them all in one selector so no path is forgotten:

```css
.media { position: relative; overflow: hidden; aspect-ratio: 4 / 5; }
.qa {
  position: absolute; left: 0; right: 0; bottom: 0;
  background: var(--ink); color: var(--paper); padding: 10px 12px 12px;
  transform: translateY(101%);
  transition: transform var(--t-bar) var(--expo);
}
.card:hover .qa,
.card:focus-within .qa,
.card.open .qa,
.card.added .qa { transform: none; }
```

Use `101%`, not `100%`, so a hairline of the bar never shows under the border at fractional sizes.

**Art from shapes and two custom properties.** A swatch only sets `--c` and `--p` on the card. Every shape reads them. The tee is one clipped block:

```css
.s { position: absolute; background: var(--c); transition: background var(--t-micro) var(--ease); }
.tee {
  left: 12%; right: 12%; top: 14%; bottom: 12%;
  clip-path: polygon(32% 6%, 42% 2%, 58% 2%, 68% 6%, 96% 22%, 86% 40%, 76% 34%,
                     76% 98%, 24% 98%, 24% 34%, 14% 40%, 4% 22%);
}
.collar { left: 42%; width: 16%; top: 14%; height: 6%; border-radius: 0 0 50% 50%; background: var(--media); }
.shade { box-shadow: inset 0 -999px 0 rgba(0, 0, 0, .18); } /* darker brim without a second colour */
```

Light swatches (Stone) need a dark print, so each swatch carries both values: `data-c="#b6ae9d" data-p="#151412"`.

**Add, bump, announce, reset:**

```js
sizeButton.addEventListener('click', () => {
  count++;
  countEl.textContent = count;
  bag.setAttribute('aria-label', 'Bag, ' + count + ' items');
  bag.classList.remove('bump'); void bag.offsetWidth; bag.classList.add('bump');
  card.classList.add('added');
  live.textContent = 'Added ' + name + ', ' + colourName + ', ' + size + '. Bag has ' + count + ' items.';
  clearTimeout(card.t);
  card.t = setTimeout(() => card.classList.remove('added'), 1600);
});
```

Common mistakes:

- Showing size buttons only on `:hover`. Touch users and keyboard users never see them.
- Giving the whole card a link and then nesting buttons inside it. Here the card is not a link; the name can link to the product page in a real shop, but the buttons must sit outside that link.
- Swapping in a second `<img>` for colours. One shape set and two custom properties covers every colour.
- Rounding corners "to soften it". This look is square.
- Putting the price in the display face. Mono numbers are the retro tell.
- Letting the bar close while "Added" is still showing because the pointer left.
- Making the bag counter jump without any text change for screen readers.
- Using `repeat(4, 1fr)`. Long names can push a `1fr` track wider than its share. Use `minmax(0,1fr)`.
- A second accent colour for "New". New is ink. Only sale and success use tomato.

Rebuild order:

1. Header with wordmark, nav, and bag button with a count square.
2. Heading row and the 4-column grid.
3. One card with a 4:5 art well, tag, toggle, and info row.
4. Front art shapes, then the back angle and the hover swap.
5. The quick-add bar with its four open conditions.
6. Swatches that set `--c`, `--p`, and the colour name.
7. Size buttons, the Added panel, the bag bump, and the live region.
8. Sale prices, sold-out sizes, reduced motion, and the responsive steps.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
