<!-- Design Lounge Nº 398 · "Silk ribbon hero with live ticker" · designlounge.vercel.app -->

# Silk ribbon hero with live ticker

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Studied from stripe.com: the first screen where a fibrous gradient ribbon bleeds in from the top-right corner behind a light-weight, two-tone headline, with a live counter above it and a customer logo strip pinned to the bottom edge. This version is for an invented marketplace-payments company, Tallyfold, in teal → pistachio → saffron → coral on warm paper. It should feel calm, expensive and engineered: one big moving object, everything else still and exact. The detail worth copying is the ribbon: about 150 one-pixel fibres drawn along a twisting band on a 2D canvas, over a soft filled body, so it reads as silk instead of a blurry blob.

## Reference behaviour

1. On load the ribbon is already drawn. The ticker, headline and buttons rise 14px and fade in over 700ms, staggered 80ms.
2. The ribbon twists slowly and forever: its phase advances 0.00022 rad per ms, so one full twist takes about 28 seconds. Nothing else loops except the ticker dot pulse.
3. Moving the pointer over the hero parts the fibres near it: points within 180px are pushed away by up to 34px with a squared falloff. The pointer position is eased (12% per frame), so the parting trails the cursor softly. Leaving the hero lets the fibres close again.
4. The ticker reads "Seller payouts settled today €4,812,906.37" and adds €0.80 to €24.80 every 120ms. The figure is in a monospaced face with tabular numerals so the line never jitters.
5. The headline has two tones in one `h1`: the first sentence in full ink, the continuation in a muted ink. They wrap together as one paragraph.
6. Hovering or focusing any button grows the chevron into an arrow: a 7px stem scales in from the left and the chevron head slides 3px right, 150–200ms.
7. Hovering or focusing the logo strip blurs the six logos by 5px at 45% opacity and fades in a dark pill in the centre, "Read 6 marketplace stories →". The whole strip is one link.
8. Two hairline guides frame the 1120px content column from the nav down, with a dashed guide at its midline. They are structure you can see, not decoration.
9. With reduced motion, the ribbon is drawn once and stays still, there is no pointer parting, the entrance is instant and the ticker updates once a second with bigger steps.

## Structure

```
┌──────────────────────────────── 1280 × 800 ───────────────────────────────┐
│ [≡ Tallyfold]  Products Marketplaces Developers Resources Pricing  [Sign in][Talk to us ›] │ 64px, 1px rule
├──────┬──────────────────────────────┬──────────────────────────────┬──────┤
│      │                              ╎                ////////////  │      │
│      │  • Seller payouts settled today  €4,812,906.37  ////////     │      │  top padding 118px
│      │                              ╎          ribbon //////        │      │
│      │  Payment rails for marketplaces          (canvas, z -1)      │      │
│      │  that pay out daily. Collect from ╎     //////////////       │      │  h1 46/52, max 740px
│      │  buyers, split to sellers and settle        //////////////   │      │
│      │  in 46 currencies, from your  ╎                ////////////// │      │
│      │  first order to your ten-millionth.                   ///////│      │
│      │  [Start building ›] [Read the payout docs ›]                 │      │  34px above
│      │                              ╎                              │      │
├──────┴──────────────────────────────┴──────────────────────────────┴──────┤
│   M Northloom   PARCELHAUS   ◐ Mosswell   brightyard_   ∿ tidewren   Calloway Market │ 84px strip
└───────────────────────────────────────────────────────────────────────────┘
          guides: 1120px column, 1px solid sides, 1px dashed midline
```

- `.hero` is a flex column, `min-height: 100%`, `isolation: isolate`, `overflow: hidden`.
- `canvas` is absolutely positioned over the whole hero at `z-index: -1`, `pointer-events: none`, `aria-hidden`.
- `.guides` sits under the canvas (`z-index: -2`) from the bottom of the nav to the bottom of the hero.
- `header` holds the brand link, a `nav` with five links, and two action links. Its background is the paper at 70% so the ribbon tip shows faintly through it.
- `main` holds `.copy` (ticker `p`, `h1`, CTA row) and, pushed to the bottom with `margin-top: auto`, the logo strip `a`.
- The ticker number is an `output` element.

## Tokens

```css
:root {
  /* surfaces and ink */
  --paper: #FBFAF7;         /* page */
  --ink: #0F2421;           /* headline lead, nav */
  --ink-2: #55645F;         /* headline continuation */
  --ink-3: #7C8984;         /* ticker figure */
  --line: #E4E6E0;          /* guides, rules */
  --line-strong: #D3D7D0;   /* ghost button border */

  /* action */
  --accent: #0B5D5E;        /* primary button, ghost text */
  --accent-hover: #08494A;
  --accent-tint: #E3EFEE;   /* ghost hover ring */

  /* ribbon stops, in order along the length */
  --r1: #0F8B8D; --r2: #3FA98A; --r3: #8CCB5E;
  --r4: #F2C14E; --r5: #F07856; --r6: #E0533D;

  --sans: "Hanken Grotesk", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;

  --col: 1120px;
  --nav: 64px;
  --radius: 6px;
  --space-1: 8px; --space-2: 12px; --space-3: 24px; --space-4: 34px; --space-5: 72px;

  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --t-micro: 150ms; --t-layout: 300ms; --t-hero: 700ms;
}
```

## Typography

| Role | Family | Size / line | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Brand | Hanken Grotesk | 19px | 600 | -0.02em | `--ink` |
| Nav link | Hanken Grotesk | 14px | 500 | 0 | `--ink` |
| Ticker label | Hanken Grotesk | 13px | 500 | 0 | `--ink` |
| Ticker figure | IBM Plex Mono | 13px | 400, tabular | -0.01em | `--ink-3` |
| Headline | Hanken Grotesk | 46px / 1.13 | 300 | -0.022em | lead `--ink`, rest `--ink-2` |
| Button | Hanken Grotesk | 15px (14px in nav) | 500 | 0 | white / `--accent` |
| Logos | Hanken Grotesk or Plex Mono | 14–20px | 300–600 | varied | `#2B3B37` |

The headline is weight 300. That lightness is the voice of the page; at 500 it turns into a generic SaaS header. Use `text-wrap: balance` on it.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Ribbon twist | rAF loop | per-fibre offsets | phase += dt × 0.00022 | infinite | n/a | drawn once, static |
| Fibre parting | pointermove | point displacement | 0 → 34px within 180px | eased 12%/frame | lerp | off |
| Entrance | load | opacity, translateY | 0, 14px → 1, 0 | 700ms, +80ms stagger | expo | none |
| Ticker | 120ms interval | text | +€0.80…€24.80 | instant | n/a | 1000ms interval, ×8 step |
| Ticker dot | loop | box-shadow ring | 0 → 7px, fade | 2400ms | standard | static dot |
| Arrow stem | hover/focus | opacity, scaleX | 0 → 1 | 150 / 200ms | standard | instant |
| Arrow head | hover/focus | translateX | 0 → 3px | 200ms | standard | instant |
| Logo strip | hover/focus | filter blur, opacity | 0, 1 → 5px, .45 | 300ms | standard | instant |
| Stories pill | hover/focus | opacity, translateY | 0, +10% → 1, 0 | 250 / 300ms | expo | instant |

Pause the rAF loop when `document.hidden`; restart on `visibilitychange`.

## States

- Primary button: `--accent` fill, white text; hover `--accent-hover`; focus-visible 2px `--accent` outline, offset 3px; the arrow grows on both hover and focus.
- Ghost button: paper fill, 1px `--line-strong` border, `--accent` text; hover border turns `--accent` and gains a 3px `--accent-tint` ring.
- Nav link: transparent; hover 5% ink wash, radius 4px.
- Logo strip: rest shows logos crisp; hover/focus blurs them and shows the pill. Focus ring is inset (`outline-offset: -3px`) so it stays inside the strip.
- Ticker: no empty or error state on a marketing page. If the live source fails, freeze on the last value. Do not show a spinner.

## Accessibility

- One `h1`. The two tones are two `span`s inside it, so it is read as one sentence pair.
- The canvas and guides are `aria-hidden="true"`.
- The ticker `output` has `aria-label="Seller payouts settled today, updating live"` and no `aria-live`. A value that changes eight times a second must never be announced.
- The logo strip is a single link whose `aria-label` names the destination and the six customers; the inner row and the pill are `aria-hidden`.
- Tab order: brand, five nav links, Sign in, Talk to us, Start building, Read the payout docs, logo strip.
- Contrast: `#0F2421` on `#FBFAF7` ≈ 15:1, `#55645F` ≈ 6:1, white on `#0B5D5E` ≈ 7.6:1. The ribbon is kept to the right of the 740px headline measure so text never sits on saturated colour.
- Buttons are 40px tall on desktop and 46px on phones.

## Responsive rules

- ≥ 1280: as drawn. Copy column starts 72px inside the left guide.
- 1024: same layout; ribbon recomputes from the canvas size on resize.
- < 980: hide the nav links, copy padding-left 24px, headline 40px.
- < 640: hide the Sign in button; copy padding-top 72px; headline 31px / 1.16; CTAs stack full width at 46px; the logo strip becomes a 3 × 2 grid with 22px row gap; the dashed midline guide is hidden. The ribbon switches to a flatter path that crosses only the top-right corner (from 30% across at the top to the right edge at 15% height) so it never covers the headline.
- At 375 wide nothing overflows horizontally.

## Acceptance checklist

### Always

- [ ] The ribbon is drawn with many 1px strokes (≥ 120) over a filled body at ~50% alpha, not a CSS gradient or a blur.
- [ ] Fibres twist on a slow loop (≥ 20 s per cycle) and part around the pointer within ~180px.
- [ ] The headline is light weight (300) with a full-ink lead sentence and a muted continuation in the same `h1`.
- [ ] A live figure sits above the headline in a mono face with tabular numerals, and it is not announced by screen readers.
- [ ] Every arrow link grows a stem on hover and on keyboard focus.
- [ ] The logo strip is one link; hover/focus blurs the logos and reveals a pill.
- [ ] Visible hairline guides frame the content column.
- [ ] Reduced motion leaves a complete, still page.
- [ ] No horizontal overflow at 375px.

### This demo

- [ ] Brand is Tallyfold; the headline lead is "Payment rails for marketplaces that pay out daily."
- [ ] Ticker starts at €4,812,906.37 and climbs every 120ms.
- [ ] Ribbon runs teal `#0F8B8D` → coral `#E0533D` along its length through six stops.
- [ ] Logos are Northloom, Parcelhaus, Mosswell, brightyard_, tidewren, Calloway Market.
- [ ] Primary button fill is `#0B5D5E`; paper is `#FBFAF7`.

## Implementation notes

**1. The ribbon is one spine plus offsets.** Evaluate a cubic Bézier for the spine and its unit normal once per frame (65 samples), then place every fibre at a normal offset `s ∈ [-1, 1]`. The width swells in the middle and the twist narrows it periodically, which is what gives the folded-silk look. Keep the twist factor above ~0.25: if it reaches zero, all 150 strokes collapse onto one line and read as a dark scar.

```js
const point = (s, j) => {
  const t = j / SEG, [x, y, nx, ny] = spine[j];
  const twist = 0.62 + 0.38 * Math.cos(t * 3.4 + phase + s * 0.5);
  const w = half * (0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, t * 1.1)));
  const off = s * w * twist + Math.sin(t * 8 + phase * 2 + s * 3) * 6;
  let px = x + nx * off, py = y + ny * off;
  const dx = px - ptr.x, dy = py - ptr.y, d = Math.hypot(dx, dy);
  if (d < 180) { const k = (1 - d / 180) ** 2 * 34; px += dx / (d || 1) * k; py += dy / (d || 1) * k; }
  return [px, py];
};
```

**2. Colour runs along the length, not across.** Give each fibre a three-stop linear gradient from its first point to its last, starting at `u = (s+1)/2 × 0.3` and ending at `u + 0.7` on the six-stop ramp. Vary alpha per fibre between 0.45 and 0.95 with `|sin(i × 0.37 + phase)|`; that shimmer is the sheen. Draw with normal compositing; `multiply` on paper turns overlaps muddy.

**3. Canvas hygiene.** Size the backing store to `clientWidth × min(2, devicePixelRatio)` and `setTransform(dpr…)`; redraw on resize. Stop the loop when the tab is hidden. Under reduced motion call `draw()` once and never start the loop.

```css
.arrow .stem { opacity: 0; transform: scaleX(0); transform-origin: left center;
  transition: opacity .15s var(--ease), transform .2s var(--ease); }
.btn:hover .arrow .stem, .btn:focus-visible .arrow .stem { opacity: 1; transform: scaleX(1); }
.btn:hover .arrow .head, .btn:focus-visible .arrow .head { transform: translateX(3px); }
```

Common mistakes:

- Replacing the fibres with a blurred CSS conic gradient. It loses the thread texture that makes this hero.
- Letting the ribbon cross the headline on phones.
- Announcing the ticker with `aria-live`.
- Setting the headline at 600 weight, or splitting the two tones into an `h1` and a `p`.
- Copying a real company's purple-pink-orange ribbon. Pick the product's own ramp.
- Real customer logos. Use invented wordmarks.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
