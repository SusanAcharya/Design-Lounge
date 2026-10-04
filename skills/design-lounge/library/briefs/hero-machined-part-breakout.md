<!-- Design Lounge Nº 303 · "Machined part breakout hero" · designlounge.vercel.app -->

# Machined part breakout hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

Studied from mwdtinc.com: the dark rounded hero card with a machined part that hangs out of the card's bottom edge, and the headline set as one light caps line over one heavy caps line. This rebuild is for **Kestrom**, a fictional precision machine shop. The part is an isometric steel manifold block drawn in inline SVG, and it carries three numbered hotspots; picking one draws an amber leader line to a callout with the real tolerance for that feature. The feeling is a spec sheet with a pulse: graphite, bone and one hi-vis amber. The detail worth copying is the breakout — the part's z-index sits above the card, so its lower third lands on the light page and casts a floor shadow there.

## Structure

```
1280 × 800, page padding 16
┌──────────────────────────────────────────────────────────────────────────┐
│ ┌──────────────────── card #1D1E20, r18, h620 ───────────────────────┐   │
│ │ [hex] KESTROM          CAPABILITIES▾ INDUSTRIES▾ MATERIALS▾ … CONTACT│ 76│
│ │  ╱hexagon linework╲                                                │   │
│ │ MACHINED TO THE                       (Archivo 300, 84px)          │   │
│ │ LAST MICRON                           (Archivo 900, 84px)          │   │
│ │      ┌─────block 440×440─────┐ ┌callout 196┐  lede 440w @ x760     │   │
│ │      │   ◉1 bore    ●───────────│ 01 · …   │  [REQUEST A QUOTE →]  │   │
│ │      │ ◎2 flange   ③ pocket  │ └──────────┘  ───────────────────── │   │
│ │      │                       │                ±0.003 | 48 h | AS9100│   │
│ └──────│───────────────────────│───────────────────────────────────────┘   │
│        │   (breaks out)        │          Parts in service with 140 …     │
│        └───────────────────────┘          SEMICONDUCTOR AEROSPACE …       │
│          ░░ floor shadow ░░                                               │
└──────────────────────────────────────────────────────────────────────────┘
```

- `main.hero` padding 16px. `section.card` holds the linework SVG, `nav`, `h1`, `.lede`, `dl.specs`.
- `.stage` is a sibling of the card, absolutely placed at left 72px, top 336px, 640×460, `z-index: 4` so it paints over the card and the page.
- Inside `.stage`, `.part` (the tilting layer) holds: `.floor` shadow, the block `svg[role=img]`, the `svg.leader` overlay, three `button.hot`, and `div.callout[role=status]`.
- `p.below` sits on the bone page at left 776px, top 668px.

## Motion

| Thing | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---:|---|---|
| Block tilt | pointermove | rotateY / rotateX | 0 → ±5° / ±3.5° | 500ms | expo out | off |
| Linework drift | pointermove | translate | 0 → ±9px / ±6px, opposite | 600ms | expo out | off |
| Leader line | hotspot select | stroke-dashoffset | 360 → 0 | 500ms | expo out | instant |
| Callout | hotspot select | opacity | 1 → 0 → 1 (swap at 140ms) | 200ms | standard | instant |
| Callout | hotspot select | top | old → new | 450ms | expo out | instant |
| Hotspot dot | hover | scale | 1 → 1.12 | 200ms | expo out | none |
| Button arrow | hover | translateX | 0 → 3px | 200ms | standard | none |

Pointer events are coalesced in `requestAnimationFrame`. Touch pointers do not tilt.

## States

- Hotspot rest: 22px graphite dot, 1.5px bone ring, number in 11px Barlow 600.
- Hotspot pressed: amber fill, graphite number, amber ring plus a 6px `rgba(242,169,0,.22)` halo. `aria-pressed="true"`. Exactly one is pressed.
- Hotspot hover: dot scales to 1.12 and selects (hover = preview, click = same result).
- Focus-visible: 2px amber outline, 3px offset everywhere; on hotspots offset 0 and round.
- Button hover: fill `#FFFFFF`. Active: translateY 1px.
- Text link hover: 1px bone underline.
- Nav link rest opacity 0.86, hover 1.

## Accessibility

- The block SVG is `role="img"` with a label naming the part and its three features.
- Each hotspot is a `<button>` with `aria-label` (Centre bore, Flange port, Milled pocket) and `aria-pressed`. Hit target 40×40px around the 22px dot.
- Arrow keys move focus between hotspots (Right/Down next, Left/Up previous, wrapping). Enter/Space selects.
- The callout is `role="status" aria-live="polite"`, so the new value is announced.
- Leader overlay, linework and floor shadow are `aria-hidden`.
- Contrast: `#F1EEE7` on `#1D1E20` ≈ 15:1; `#A9AAA6` on `#1D1E20` ≈ 7:1; `#55575B` on `#E9E6DF` ≈ 6:1. Amber is never used for body text.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1100: nav menu hides (a menu button belongs here in production), headline 64px, lede and specs pin to the right at 380px wide, the industry line hides.
- 768–1023: same as above; the block may overlap the lede's left edge slightly — keep the lede above it in z-order only if text would be covered; otherwise leave.
- < 760: the card becomes auto height with 300px bottom padding. Headline 42px, lede and specs flow in the card at 24px margins. The block centres at 300×300, bottom −40px so it still breaks out. Hotspots, leader and callout hide; the spec row carries the numbers.
- Check at 375px: no horizontal scroll.

## Acceptance checklist

### Always

- [ ] The hero is a dark rounded card inset from the page, not a full-bleed band.
- [ ] The headline is two caps lines at the same size: one light weight, one heavy weight.
- [ ] The product object paints above the card and visibly crosses its bottom edge onto the page, with a floor shadow on the page.
- [ ] Exactly one hotspot is pressed at load, and the callout already shows its value.
- [ ] Selecting a hotspot redraws the leader and swaps the callout; only one is pressed.
- [ ] Hotspots are buttons with names, 40px targets, arrow-key navigation.
- [ ] The callout is a polite live region.
- [ ] One accent colour only, used for the active hotspot, leader, logo detail and focus.
- [ ] Reduced motion removes tilt, drift and the line draw.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Brand "KESTROM"; headline "MACHINED TO THE / LAST MICRON" at 84px, Archivo 300 / 900, wdth 112.
- [ ] Card `#1D1E20`, 620px tall, 18px radius, 16px inset on `#E9E6DF`.
- [ ] Hotspot copy is Ø 24.000 / Ø 46.000 / Ra 0.4 as listed in Reference behaviour.
- [ ] Spec row reads ±0.003, 48 h, AS9100.
- [ ] Accent `#F2A900`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: bone page `#E9E6DF`, a graphite card inset 16px on all sides, 620px tall, 18px radius. Nav inside the card. Headline "MACHINED TO THE" (Archivo 300) over "LAST MICRON" (Archivo 900), both 84px caps.
2. The steel block sits bottom-left, 440×440px, starting 320px down the card. Its lower ~150px hangs below the card onto the bone page. A soft elliptical floor shadow sits under it on the page.
3. Hotspot 1 (centre bore) starts pressed: amber dot, amber leader line, callout "01 · CENTRE BORE / Ø 24.000 / H7 · +0.021 / −0.000 mm" to the right of the block.
4. Hover or click hotspot 2 or 3: the leader line redraws from the new dot (stroke-dashoffset 360 → 0, 500ms expo out), the callout fades out (200ms), its text swaps after 140ms, and it slides to the new `top` (450ms expo out) while fading back in.
5. Hotspot copy: 2 = "02 · Flange port / Ø 46.000 / 6 × M5 on a 60 mm PCD"; 3 = "03 · Milled pocket / Ra 0.4 / µm finish · flat to 0.004".
6. Moving the pointer anywhere tilts the block up to ±5° rotateY and ±3.5° rotateX (perspective 1400px), 500ms expo out. The faint hexagon linework behind the headline drifts the opposite way up to 9px. Leaving the window resets both.
7. Right column: a 19px lede, a bone "REQUEST A QUOTE →" button and a text link "OR UPLOAD A STEP FILE". The arrow nudges 3px right on hover.
8. Under the lede, a 3-column spec row with a hairline top: "±0.003 mm held on bores", "48 h first article", "AS9100 rev D certified".
9. On the bone page below the card, right side: "Parts in service with 140 teams in" then five industries in 12px tracked caps.
10. Reduced motion: no tilt, no drift, no line draw; a hotspot swaps the callout instantly.

## Tokens

```css
:root {
  --page: #e9e6df;      /* bone page outside the card */
  --card: #1d1e20;      /* graphite hero card */
  --bone: #f1eee7;      /* primary button fill, type on card */
  --ink: #1d1e20;       /* type on page */
  --ink-2: #55575b;     /* industry list */
  --on-card: #f1eee7;
  --on-card-2: #a9aaa6; /* spec captions, callout key */
  --line-card: rgba(241, 238, 231, 0.14);
  --amber: #f2a900;     /* the one accent: active hotspot, leader, logo chevrons, focus */

  --display: "Archivo", "Arial Narrow", sans-serif;  /* wdth 112 */
  --sans: "Barlow", system-ui, sans-serif;

  --r-card: 18px;
  --r-btn: 5px;
  --card-h: 620px;
  --inset: 16px;

  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --t-micro: 160ms;
  --t-line: 500ms;
  --t-slide: 450ms;
}
```

Steel gradients (SVG): top face `#F3F3F1 → #CFD1D2 → #B3B6B9` (diagonal), left face `#8D9196 → #B9BCBF → #9A9EA2`, right face `#4C5157 → #6C7176 → #3B3F44`. Holes use a radial `#15171A → #2B2E32 → #5D6166`.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Headline line 1 | Archivo wdth 112 | 84px | 300 | 0.94 | 0.01em | UPPER |
| Headline line 2 | Archivo wdth 112 | 84px | 900 | 0.94 | 0.01em | UPPER |
| Wordmark | Archivo | 22px | 900 | 1 | 0.02em | UPPER |
| Nav links | Barlow | 13px | 600 | 1 | 0.12em | UPPER |
| Lede | Barlow | 19px | 400 (name 600) | 1.38 | 0 | sentence |
| Button | Barlow | 15px | 600 | 1 | 0.06em | UPPER |
| Text link | Barlow | 13px | 600 | 1 | 0.10em | UPPER |
| Spec value | Archivo | 22px | 900 | 1 | 0, tabular | as written |
| Spec caption | Barlow | 13px | 400 | 1.45 | 0.02em | sentence |
| Callout key | Barlow | 11px | 600 | 1 | 0.14em | UPPER |
| Callout value | Archivo | 28px | 800 | 1 | −0.01em, tabular | as written |
| Callout tolerance | Barlow | 13px | 400 | 1.45 | tabular | as written |

The two headline lines are the same size. Only weight changes. Do not shrink the light line.

## Implementation notes

**Draw the block in face-local coordinates.** Each isometric face is a 200×200 square mapped by one matrix, so holes are plain circles. Use `vector-effect: non-scaling-stroke` so rims stay 1px.

```html
<!-- top face (x, y) -->
<g transform="matrix(.866 .5 -.866 .5 220 20)"> <circle cx="100" cy="100" r="34" fill="url(#hole)"/> </g>
<!-- left face (x, z) -->
<g transform="matrix(.866 .5 0 -1 46.8 320)">  <circle cx="100" cy="100" r="40" fill="url(#hole)"/> </g>
<!-- right face (y, z) -->
<g transform="matrix(-.866 .5 0 -1 393.2 320)"> <rect x="44" y="40" width="112" height="56" rx="20"/> </g>
```

The three outline polygons are `220,20 393.2,120 220,220 46.8,120` (top), `46.8,120 220,220 220,420 46.8,320` (left) and `393.2,120 220,220 220,420 393.2,320` (right). Finish with a 1.2px white 55% stroke along the three front edges for the chamfer highlight.

**Breakout without clipping.** The card has `overflow: hidden` for the linework, so the part must not live inside it. Make `.stage` a sibling, absolutely positioned over both card and page with a higher z-index.

**Redraw the leader.** Reset the dash with transitions off, force a reflow, then let it transition:

```js
leader.classList.add('draw');        // .draw polyline { stroke-dashoffset: 360; transition: none }
callout.classList.add('swap');       // opacity 0
leader.getBoundingClientRect();
leader.classList.remove('draw');
setTimeout(apply, 140);              // swap text + top, remove .swap
```

The polyline goes from the dot 12px right, 28px further right, then diagonally to (420, calloutTop + 30) and into the callout at x 452.

Common mistakes: a photo of a part (this piece is drawn, so it stays sharp and themable); putting the part inside the card and losing the breakout; tilting more than 5° so the isometric reads as broken; using amber for text; three callouts open at once; hotspots as `div`s with click handlers.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
