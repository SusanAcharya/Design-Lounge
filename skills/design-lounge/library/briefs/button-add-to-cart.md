<!-- Design Lounge Nº 164 · "Add to cart that becomes a stepper" · designlounge.vercel.app -->

# Add to cart that becomes a stepper

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The add-to-basket control on a product card for "Larder", a small-batch provisions shop. Three cards sit on a warm paper page under a header with a pill-shaped basket button. Each card shows one of the three states at first paint. Wildflower honey is idle with a terracotta "Add to basket" button. Smoked paprika is already a stepper reading "2 in basket". Stoneground rye is sold out and offers "Notify me". Clicking Add shows a short adding state. Then a round token with the product drawing flies in an arc to the basket icon, the badge bumps when it lands, and the button has already turned into a − / count / + stepper in the same 48px slot. The detail worth copying is that the control never changes size or position. The card does not reflow, the stepper owns the same box as the button, and focus moves to + so a keyboard user can keep adding.

This is not `qty-stepper` (a standalone stepper) and not `shop-cart` (the drawer). It is the moment between them.

## Reference behaviour

1. First frame: header with "Larder" wordmark, "Provisions · Week 40", and a basket pill on the right showing a badge "2" and "£12.40". Heading "This week's shelf", sub-line "Small batches, delivered Thursday." Three cards in a row.
2. Card 1, Wildflower honey, £9.50, "Ridge Farm, Powys · 340g jar": a filled terracotta button "+ Add to basket". Note under it: "6 jars this week".
3. Card 2, Smoked paprika, £6.20, "La Vera, oak-smoked · 75g tin": a stepper with − on the left, "2 in basket" centred, + on the right. Note: "9 tins this week".
4. Card 3, Stoneground rye, £4.80, "Harrow Lane Mill · 1.5kg bag": the tile is desaturated to 35 % with a "Back 15 Oct" stamp. Its control is an outlined button "Sold out · Notify me" with a bell icon. Note: "Next mill run is Tuesday".
5. Click Add on honey: the button enters **adding**. The label slides up 6px and fades, three 6px dots bounce in its place, the fill darkens to `--accent-press`, and `aria-busy="true"` is set. This lasts 450ms (fake request).
6. When adding resolves, on the same frame: quantity becomes 1, the button cross-fades into the stepper (opacity 200ms, scaleX .9 → 1 over 280ms), the − and + buttons slide 24px outward from the centre, focus moves to +, and a 40px round token launches from the button's centre.
7. The token carries a small copy of the product drawing on the card's tile colour, with a 2px surface ring and a soft shadow. It travels to the basket icon centre in 720ms on an arc. X and Y are animated on two nested elements with different easings. It rises 56px in the first 22 % while scaling .6 → 1.12, then falls into the icon while shrinking to .42. Then it is removed.
8. On landing: the badge number updates and pops (scale 1 → 1.45 → 1, 380ms, overshoot easing), the basket glyph tilts (−12° → 6° → 0, 420ms), and the subtotal updates to "£21.90". A polite live region says "Wildflower honey added. Basket has 3 items."
9. At quantity 1 the − button shows a trash icon and is labelled "Remove Wildflower honey from basket". Above 1 it shows a minus and is labelled "One fewer Wildflower honey".
10. + increments, the count rolls in from 8px below (240ms), the badge bumps, and the subtotal updates. At stock (6 jars) + is disabled at 35 % opacity, focus moves to −, and the note turns olive and bold: "That's every one of our 6 jars".
11. − at quantity 1 removes the item. The stepper fades back to the Add button, focus returns to Add, and the live region says "Wildflower honey removed. Basket has N items."
12. Notify on the sold-out card toggles `aria-pressed`. On, it reads "We'll email you on the 15th" with a check, on `--accent-soft` with an accent ring. Off, it returns to "Sold out · Notify me".
13. The badge hides when the basket total is 0.

## Structure

```
1280 × 800, content group 920px wide, centred both ways
┌──────────────────────────────────────────────────────────────┐
│ Larder  Provisions · Week 40           ( basket[2] £12.40 )   │ 48px pill
│──────────────────────────────────────────────────────────────│ 1px rule
│ This week's shelf (42px)            Small batches, deliv…    │
│ ┌ card ─────────┐ ┌ card ─────────┐ ┌ card (sold out) ─┐      │ gap 24
│ │ tile 196px    │ │ tile 196px    │ │ tile  [Back 15 Oct]│    │
│ │ Wildflower £9.50│ Smoked pap £6.20│ Stoneground £4.80 │     │
│ │ origin 13px   │ │ origin        │ │ origin            │     │
│ │[+ Add to basket]│[ −  2 in basket + ]│[bell Sold out · Notify]│ 48px
│ │ 6 jars this wk│ │ 9 tins this wk│ │ Next mill run…    │     │
│ └───────────────┘ └───────────────┘ └───────────────────┘     │
└──────────────────────────────────────────────────────────────┘
```

- `<main class="shop">` holds `<header>` (wordmark + `<button class="cart">`), the heading block, and `.grid` with three `<article class="card">`.
- `.tile` is decorative (`aria-hidden`). It is a coloured block with a 104px line drawing in inline SVG (jar, tin, bag). Each card sets `--t` to its tile colour, and the flying token reads the same variable.
- `.act` is a 48px-tall, `position: relative` slot. It holds `button.add` and `div.stepper[role=group]`, both `position: absolute; inset: 0`. Only one is interactive at a time. The other gets `inert`.
- `.stepper` is a 3-column grid `48px 1fr 48px`: `button.minus`, `.count` (number + "in basket"), `button.plus`.
- The sold-out card has only `button.notify[aria-pressed]` in its slot.
- `.note` is a 12.5px line under the slot, `min-height: 18px` so cards stay aligned.
- One visually hidden `<p aria-live="polite">` for announcements.

## Tokens

```css
:root {
  /* colour: warm paper, terracotta accent, olive for "you've got them all" */
  --bg: #f2e8d8;            /* page, with a 4px dot grain at 4.5% ink */
  --surface: #fbf6ec;       /* cards, cart pill */
  --line: #e2d4be;
  --tile-1: #ecc982;        /* honey */
  --tile-2: #dc8f67;        /* paprika */
  --tile-3: #dcd0b6;        /* rye */
  --ink: #2a1d14;
  --ink-2: #5e4b3c;
  --ink-3: #77624f;         /* origin, notes */
  --accent: #b4492a;        /* add button, badge, stepper ring */
  --accent-press: #943a20;  /* hover, adding, stepper glyphs */
  --accent-soft: #f4dccb;   /* stepper fill, notify-on fill */
  --on-accent: #fff7ee;
  --ok: #4f6b33;            /* max-stock note */

  --display: "Gloock", Georgia, serif;
  --sans: "Rethink Sans", system-ui, sans-serif;

  --r: 12px;                /* button, stepper */
  --r-card: 16px;
  --slot-h: 48px;

  --t-micro: 160ms;
  --t-morph: 280ms;
  --t-adding: 450ms;        /* fake request */
  --t-fly: 720ms;
  --t-bump: 380ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease-pop: cubic-bezier(.34, 1.56, .64, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Wordmark | Gloock | 30px | 400 | 1 | −0.01em | |
| Page heading | Gloock | 42px | 400 | 1.05 | −0.015em | 34px under 760px |
| Price | Gloock | 21px | 400 | 1 | 0 | right-aligned on the name row |
| Product name | Rethink Sans | 17px | 600 | 1.45 | −0.005em | |
| Origin | Rethink Sans | 13px | 400 | 1.45 | 0 | `--ink-3` |
| Button label | Rethink Sans | 15px | 600 | 1 | 0 | |
| Stepper count | Rethink Sans | 17px | 700 | 1 | 0 | `tabular-nums` |
| "in basket" | Rethink Sans | 13px | 400 | 1 | 0 | `--ink-2` |
| Cart subtotal | Rethink Sans | 15px | 600 | 1 | 0 | `tabular-nums` |
| Badge | Rethink Sans | 11.5px | 700 | 20px | 0 | |
| Note | Rethink Sans | 12.5px | 400 | 1.45 | 0 | max state 600 `--ok` |

The serif is only for the wordmark, heading and prices. Never set button labels in Gloock.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| `.add .lbl` | adding | opacity, translateY | 1, 0 → 0, −6px | 160ms | `--ease` | instant |
| `.busy i` ×3 | adding | translateY, opacity | 0, .35 → −4px, 1 → back | 900ms loop, 120ms stagger | `--ease` | 1 iteration, 1ms |
| `.add` | → stepper | opacity, scaleX | 1, 1 → 0, .9 | 200 / 280ms | `--ease` / `--ease-out` | 1ms |
| `.stepper` | → stepper | opacity, scaleX | 0, .9 → 1, 1 | 200 / 280ms | `--ease` / `--ease-out` | 1ms |
| `.minus` / `.plus` | → stepper | translateX | ±24px → 0 | 280ms | `--ease-out` | 1ms |
| flyer outer | land | translateX | 0 → dx | 720ms | `cubic-bezier(.3,.1,.6,1)` | not created |
| flyer inner | land | translateY, scale, opacity | 0, .6, 0 → −56px, 1.12, 1 (22 %) → dy, .42, 1 | 720ms | rise `--ease`, fall `cubic-bezier(.55,0,.85,.4)` | not created |
| `.badge` | flyer lands, ± | scale | 1 → 1.45 (40 %) → 1 | 380ms | `--ease-pop` | none |
| basket glyph | flyer lands, ± | rotate | 0 → −12° → 6° → 0 | 420ms | `--ease` | none |
| `.q` count | ± | translateY, opacity | 8px, 0 → 0, 1 | 240ms | `--ease-out` | none |

Badge and count animations restart on every change: remove the class, read `offsetWidth`, add it back. With reduced motion, the adding delay is 0ms and no token is created. The badge updates immediately.

## States

- **Idle:** accent fill, on-accent label with a plus icon. Hover `--accent-press`. Active scale .98.
- **Adding:** `--accent-press` fill, label hidden, three dots, `cursor: progress`, `aria-busy="true"`, label "Adding Wildflower honey". Further clicks are ignored.
- **Stepper:** `--accent-soft` fill, 1px inset accent ring, glyphs `--accent-press`. Glyph button hover `rgba(180,73,42,.12)`.
- **Stepper at 1:** − shows a trash can.
- **Stepper at stock:** + disabled (35 % opacity, `not-allowed`). Note in `--ok`, weight 600.
- **Sold out:** 1px inset `--ink-3` ring, ink label, bell icon. Pressed: accent-soft fill, accent ring, check icon, "We'll email you on the 15th".
- **Cart empty:** badge hidden, subtotal "£0.00".
- **Focus-visible:** 2px `--ink` outline, offset 3px. Inside the stepper the offset is −3px so the ring stays inside the pill.

## Accessibility

- The cart is a `<button>` whose `aria-label` carries count and total: "Basket, 3 items, £21.90". The visual badge and subtotal are `aria-hidden` so they aren't read twice.
- The Add button label names the product: "Add Wildflower honey to basket".
- The stepper is `role="group"` labelled "Wildflower honey quantity". − and + have full labels with the product name. The count is plain text inside the group.
- Hidden controls use `inert`, so Tab never reaches the invisible button or stepper.
- Focus management: after Add → focus +. After + reaches stock → focus −. After removing the last one → focus Add. Focus is never dropped on `<body>`.
- Announcements go to one polite live region: added, quantity changed, removed, notify on or off.
- Notify uses `aria-pressed`. Its text also changes, so the state is not colour-only.
- Contrast: on-accent `#fff7ee` on `#b4492a` is 5.0:1. `--ink-3` on `--surface` is 5.35:1. `--accent-press` glyphs on `--accent-soft` are 5.5:1. `--ok` on `--surface` is 5.6:1.
- Hit targets: every control is 48px tall. Stepper buttons are 48 × 48.

## Responsive rules

- ≥ 1280: three columns in a 920px group, as specified.
- 1024–1279: unchanged. 920px fits.
- 761–1023: three columns shrink with `minmax(0,1fr)`. Origin lines may wrap to two lines. The slot stays 48px.
- ≤ 760: one column, tiles 150px tall, heading 34px. The sub-line drops under the heading. The "Provisions · Week 40" tag is hidden. The flyer still targets the basket. It uses `position: fixed` and viewport rects, so it works when the page is scrolled.
- Never let the control change height between states. Never put the stepper outside the card.

## Acceptance checklist

### Always

- [ ] Add, adding, stepper and sold-out all live in the same 48px slot. The card does not reflow on any change.
- [ ] Adding shows a busy state with `aria-busy` and ignores repeat clicks.
- [ ] A token flies from the button to the cart icon, and the badge bumps only when it lands.
- [ ] − at quantity 1 is a remove (trash) action. Removing returns the Add button.
- [ ] + disables at stock and says so in words.
- [ ] Hidden controls are `inert`. Focus moves to a sensible control after every morph.
- [ ] The cart button label states item count and total.
- [ ] Reduced motion: no token, no bump, instant swap, same announcements.

### This demo

- [ ] Cards: Wildflower honey £9.50 (idle, stock 6), Smoked paprika £6.20 (2 in basket, stock 9), Stoneground rye £4.80 (sold out, back 15 Oct).
- [ ] First paint shows the badge 2 and "£12.40".
- [ ] Adding lasts 450ms. The flight lasts 720ms with a 56px rise.
- [ ] The badge pops to 1.45× over 380ms.
- [ ] The max note reads "That's every one of our 6 jars" in `#4f6b33`.
- [ ] Notify on reads "We'll email you on the 15th".

## Implementation notes

**Arc without a path.** Animate X and Y on two nested elements with different easings. X eases smoothly, while Y rises fast then accelerates down. Together they draw a throw curve, and you never compute a bezier path.

```js
const f = document.createElement('div'); f.className = 'flyer';
f.innerHTML = '<i>' + card.querySelector('.tile svg').outerHTML + '</i>';
f.style.left = x0 + 'px'; f.style.top = y0 + 'px'; document.body.append(f);
f.animate([{transform:'translateX(0)'},{transform:`translateX(${dx}px)`}],
  {duration:720, easing:'cubic-bezier(.3,.1,.6,1)', fill:'forwards'});
const a = f.firstChild.animate([
  {transform:'translateY(0) scale(.6)', opacity:0, easing:'cubic-bezier(.2,.7,.2,1)'},
  {transform:'translateY(-56px) scale(1.12)', opacity:1, offset:.22, easing:'cubic-bezier(.55,0,.85,.4)'},
  {transform:`translateY(${dy}px) scale(.42)`, opacity:1}
], {duration:720, fill:'forwards'});
a.onfinish = () => { f.remove(); paintCart(true); };
```

Measure `from` and `to` with `getBoundingClientRect()` at launch, and make the flyer `position: fixed`. Do not append it inside the card. The card's `overflow` or transforms would clip it.

**One slot, two controls, `inert` on the hidden one.**

```css
.act { position: relative; height: 48px; }
.add, .stepper { position: absolute; inset: 0; border-radius: 12px;
  transition: opacity 200ms var(--ease), transform 280ms var(--ease-out); }
.stepper { opacity: 0; transform: scaleX(.9); pointer-events: none; }
.act[data-state=stepper] .add { opacity: 0; transform: scaleX(.9); pointer-events: none; }
.act[data-state=stepper] .stepper { opacity: 1; transform: none; pointer-events: auto; }
.stepper .minus { transform: translateX(24px); } .stepper .plus { transform: translateX(-24px); }
.act[data-state=stepper] .stepper button { transform: none; }
```

```js
function setState(act, s) {
  act.dataset.state = s;
  act.querySelector('.add').inert = s === 'stepper';
  act.querySelector('.stepper').inert = s !== 'stepper';
}
```

**Order of truth.** Commit the quantity and morph the button when the request resolves. Update the badge when the token lands, about 720ms later. The badge is the receipt, so it should change when the eye arrives there. Announce on landing too.

Common mistakes:

- Swapping the button for a stepper of a different height, so the card jumps 4–8px.
- Leaving the invisible Add button focusable under the stepper.
- Animating the token with `top`/`left` (layout every frame). Use transforms.
- Bumping the badge on click instead of on landing.
- Letting + go past stock silently. Disable it and say why.
- Putting a trash icon on − at every quantity. It only appears at 1.
- Making the sold-out card's button look like a disabled Add. It is a different action, outlined, with its own verb.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
