---
title: "Paper cutout steps"
summary: "Four picnic delivery steps beside a pop-up book whose stacked paper layers rise, bounce and parallax with the pointer as each step is chosen."
platform: web
type: section
category: features
tags: [features, steps, pop-up, paper, illustration, parallax]
styles: [paper, playful, organic]
motion: rich
difficulty: 3
featured: false
published: 2026-10-29
palette: ["#F3E8D3", "#2F2A24", "#C9472F", "#2F5D5B", "#74A058"]
fonts: ["Abril Fatface", "Playpen Sans"]
related: ["features-pencil-annotations"]
---

# Paper cutout steps

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A "how it works" section for "Hamper & Hill", an invented picnic delivery service. On the left, an open pop-up book: an upright backdrop page and three cut-paper layers (far hill, near hill, foreground props) stand on a flat floor page with a teal cover. On the right, four step cards on solid paper. Choosing a step folds the old scene flat and makes the new one rise from its hinges, back to front, with a small overshoot, like a page turned in a pop-up book. Each layer drifts against the pointer by its own depth. The detail worth copying is that every layer is a full-stage SVG with its own `transform-origin` at its baseline, so one `rotateX` per layer is the whole fold.

## Reference behaviour

1. First frame: step 1 "Drop a pin" is selected; its card is the solid `#FFFAF0` card with shadow and a tomato bookmark notch; scene 1 (morning sky, sun with dashed rays, hills, a dotted path and a red map pin) stands.
2. Hover, focus or click a card (desktop) selects it. The old scene's layers fold to `rotateX(-88deg)` and fade in 320ms; the new scene's four layers rise from `rotateX(-88deg)` to `none` in 760ms with `cubic-bezier(.34,1.42,.52,1)`, staggered 0, 90, 180, 270ms (back to front).
3. Pointer over the section (mouse only): `--mx` and `--my` run −1 to 1 from the active scene's centre, inverted. Each layer translates `mx × d` px and `my × d × 0.45` px with d = 1 (floor), 2, 5, 9, 14. Transition 380ms `--ease`. Leaving the section resets to 0.
4. Phone (≤ 860px): every step carries its own scene above its card. An IntersectionObserver (`threshold: [0, .4]`) raises a scene at 40% visible and folds it again once it fully leaves, so scrolling back replays it.
5. Reduced motion: no transitions. Desktop shows the selected scene standing; phone shows all four standing.
6. The CTA "Book a Saturday picnic" sits under the cards with "April to September, 11.00 to 15.00".

## Structure

```
1280 × 800, .how grid 572px | 1fr, column gap 72, padding 52 64 40
┌──────────────────────────────┬───────────────────────────────────┐
│ Hamper & Hill picnic delivery│ ▶(1) Drop a pin         [card on] │
│ Lunch on the grass,          │     Choose a park ...             │
│ and nothing to carry. 54px   │     34 parks and greens mapped    │
│ ┌ scene 572×534 @ 64,214 ──┐ │  (2) Fill the basket              │
│ │ page 38..398 backdrop    │ │  (3) We lay the blanket           │
│ │ far hill   base 420      │ │  (4) Leave it on the grass        │
│ │ near hill  base 442      │ │                                   │
│ │ props      base 474      │ │ (Book a Saturday picnic) Apr–Sep  │
│ │ floor page 398..530      │ │                                   │
│ └──────────────────────────┘ │                                   │
└──────────────────────────────┴───────────────────────────────────┘
 viewBox of every layer: 0 0 600 560
```

- `<section class="how">` grid: `.head` (kicker `<p>`, `<h2>`), `<ol class="steps">` spanning rows 1 to 2 of column 2, `.book` CTA in column 2.
- Each `<li>`: `<figure class="scene" aria-label="...">` then `<button class="card" aria-pressed>` holding `.num`, `<b>` title, `.d` sentence, `<small>` fact.
- Desktop: `li` is static, so every `.scene` is absolutely placed against `.how` at `left: 64px; top: 214px; 572 × 534`. Only the selected one stands.
- `.scene` children: `.floor` (never folds), four `.lay` (each `> svg` 0 0 600 560), `.grain` (multiply noise, masked to the book).
- A hidden `<svg>` holds shared defs: `#cut` displacement filter, `#gh` gingham, `#wv` wicker weave, `#cloud`, `#tuft`, `#floorArt`, `#page`.

## Tokens

```css
:root {
  /* colour */
  --bg: #f3e8d3;        /* section paper */
  --card: #fffaf0;      /* selected card, phone cards */
  --card-hover: #f8efdd;
  --ink: #2f2a24;       /* titles, numerals */
  --ink-2: #5c5245;     /* step sentences */
  --line: #dccbaa;
  --tomato: #c9472f;    /* bookmark notch, pin, apples */
  --tomato-d: #a3361f;  /* kicker, fact lines (5.6:1) */
  --teal: #2f5d5b;      /* CTA, book cover, rider */
  --sky-1: #b7d3d1; --sky-2: #c4dbd5; --sky-3: #bcd6dc; --dusk: #efbf9e;
  --hill-far: #a9c27f; --hill-near: #74a058; --grass: #4c7a45; --sun: #f2c45e;
  --page: #fbf4e4; --meadow-print: #d8e0b2; --wicker: #c88c40; --wicker-d: #93622a;

  /* type */
  --display: "Abril Fatface", Georgia, serif;
  --sans: "Playpen Sans", system-ui, sans-serif;
  --fs-h: 54px; --fs-step: 28px; --fs-num: 20px; --fs-body: 15px; --fs-fact: 13px; --fs-kicker: 13px;

  /* shape */
  --r: 6px; --r-pill: 999px; --num: 40px;
  --shadow: 0 1px 0 rgba(90, 60, 25, .08), 0 14px 24px -16px rgba(90, 60, 25, .45);
  --layer-shadow: drop-shadow(0 7px 6px rgba(80, 50, 20, .26));
  --perspective: 1100px; --perspective-origin: 50% -10%;

  /* motion */
  --t-rise: 760ms; --t-fold: 320ms; --stagger: 90ms; --t-parallax: 380ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --pop: cubic-bezier(.34, 1.42, .52, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Kicker | Playpen Sans | 13px | 600 | 1 | +0.08em | sentence |
| Headline | Abril Fatface | 54px (40 phone) | 400 | 1.02 | −0.005em | sentence |
| Step title | Abril Fatface | 28px (25 phone) | 400 | 1.1 | +0.005em | sentence |
| Numeral | Abril Fatface | 20px | 400 | 40px disc | 0 | figures |
| Step sentence | Playpen Sans | 15px | 400 | 1.6 | 0 | sentence |
| Fact line | Playpen Sans | 13px | 600 | 1.3 | 0 | sentence |
| CTA | Playpen Sans | 15px | 600 | 1 | 0 | sentence |
| CTA note | Playpen Sans | 14px | 400 | 1.6 | 0 | sentence |

Step titles are the step's verb, never "Step 1".

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Delay | Reduced motion |
|---|---|---|---|---:|---|---|---|
| Layer rise | step selected / 40% in view | transform, opacity | rotateX(−88°), 0 → none, 1 | 760 / 200ms | `--pop` / `--ease` | 0, 90, 180, 270ms | standing, no tween |
| Layer fold | step deselected / out of view | transform, opacity, visibility | none → rotateX(−88°), 0, hidden | 320ms | `--ease` | 0 | hidden at once |
| Parallax | pointermove (mouse) | translate3d | 0 → ±d px, ±0.45d px | 380ms | `--ease` | rAF throttled | off |
| Card | select | background, shadow | transparent → `--card`, `--shadow` | 220ms | `--ease` | 0 | none |
| Numeral | select | background, colour | paper, ink → ink, card | 220ms | linear colour | 0 | none |
| CTA | hover | background | `#2F5D5B` → `#244A48` | 180ms | `--ease` | 0 | none |

## States

- **Selected step:** `li.on`; card `--card` with `--shadow`; a 16 × 30px tomato notch at `left: -10px; top: 22px` (`clip-path: polygon(0 0,100% 8%,100% 92%,0 100%,22% 50%)`); numeral disc filled `--ink`; `aria-pressed="true"`.
- **Other steps:** transparent card, 1.5px ink ring numeral, hover `--card-hover`.
- **Focus-visible:** 2px `--tomato-d` outline, 3px offset on the card.
- **Scene not selected:** layers folded, `visibility: hidden`; its floor and grain hidden so only one book shows.
- **Phone:** every card is solid `--card` with shadow; the notch is hidden; `.on` follows the observer.

## Accessibility

- Steps are an `<ol>`; each card is one `<button>` with `aria-pressed`. The numeral is `aria-hidden` (the list gives the order).
- Each `<figure>` has an `aria-label` describing its scene; every SVG is `aria-hidden`.
- Text never sits on a scene; cards are solid paper. `--ink-2` on `--card` is 7.4:1, `--tomato-d` on `--bg` 5.6:1.
- Keyboard: Tab through the four cards; focus selects, same as hover. Enter or Space also selects.
- Parallax only responds to `pointerType === 'mouse'`, never to touch or pen.

## Responsive rules

- ≥ 1280: as specified.
- 1024 to 1279: keep the grid, scene keeps 572px; reduce column gap to 48px.
- ≤ 860: single column, padding 56 / 20, `overflow-x: clip`; each `li` is a flex column (scene with `aspect-ratio: 600 / 560`, then card, 12px gap, 34px between steps); CTA stacks below its note.
- < 360: headline 34px; cards keep 16px padding.

## Acceptance checklist

**Always**
- [ ] Every scene is four stacked SVG layers plus a non-folding floor, each layer with a drop shadow.
- [ ] Layers rise back to front with a 90ms stagger and a visible overshoot; old layers fold in 320ms.
- [ ] `transform-origin` of each layer is its own baseline (74.5%, 78.6%, 83.3%, 89% of the stage).
- [ ] Pointer parallax moves layers by depth 2, 5, 9, 14px and stops for touch.
- [ ] Step text lives on solid paper cards, never over a scene.
- [ ] Hover, focus and click select on desktop; scrolling into view raises scenes on phones.
- [ ] Reduced motion shows scenes already standing with no transition.
- [ ] At 390 there is no sideways scroll and each scene sits above its step.

**This demo**
- [ ] Headline "Lunch on the grass, and nothing to carry." in 54px Abril Fatface.
- [ ] Steps: Drop a pin, Fill the basket, We lay the blanket, Leave it on the grass.
- [ ] Facts: 34 parks and greens mapped, From £38 for two, On time on 96.4% of Saturdays, Collected in 41 minutes on average.
- [ ] Scenes: map pin on hills; wicker basket with loaf, bottle and apples under a tree; rider on a cargo bike beside a gingham blanket with two plates and a jar of flowers; dusk with a low sun, birds, fireflies, a closed basket and a lantern.
- [ ] CTA "Book a Saturday picnic" in teal pill.

## Implementation notes

**One fold per layer.** Draw every layer in the same 600 × 560 viewBox so they stack exactly, then hinge each at its own base line:

```css
.lay { position: absolute; inset: 0; perspective: 1100px; perspective-origin: 50% -10%;
  transform: translate3d(calc(var(--mx,0) * var(--d) * 1px), calc(var(--my,0) * var(--d) * .45px), 0);
  transition: transform 380ms var(--ease); }
.lay svg { transform: rotateX(-88deg); opacity: 0; visibility: hidden;
  transition: transform 320ms var(--ease), opacity 320ms var(--ease), visibility 0s 320ms; }
.on .lay svg { transform: none; opacity: 1; visibility: visible;
  transition: transform 760ms var(--pop) var(--w), opacity 200ms var(--ease) var(--w), visibility 0s; }
.lay:nth-of-type(3) { --d: 9 } .lay:nth-of-type(3) svg { transform-origin: 50% 83.3%; --w: 180ms }
```

Keep parallax on the wrapper and the fold on the child. Putting both on one element makes the 380ms parallax transition fight the 760ms rise.

**Hand-cut edges, clean page.** A low-frequency displacement gives each cutout a scissor wobble. Leave the backdrop's page border out of the filter or it tears:

```html
<filter id="cut"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="7"/>
  <feDisplacementMap in="SourceGraphic" scale="4"/></filter>
<use href="#page"/><g filter="url(#cut)"> ...sky, sun, clouds... </g>
```

**Phone replays on scroll.**

```js
io = new IntersectionObserver((es) => es.forEach((e) => {
  const li = e.target.parentElement;
  if (e.intersectionRatio >= .4) li.classList.add('on');
  else if (!e.isIntersecting) li.classList.remove('on');
}), { threshold: [0, .4] });
```

Common mistakes: folded layers still count toward scroll width on phones (clip the section); a single scene per step on desktop leaves four books on screen (hide inactive floors and grain); drop shadow on text cards instead of on the cut layers; drawing step text into the SVG.
