<!-- Design Lounge Nº 435 · "Terrazzo background" · designlounge.vercel.app -->

# Terrazzo background

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A generated terrazzo floor as a full-frame background, shown behind the hero of "Casa Brecce", a small studio that hand-casts terrazzo tiles. One inline `<svg>` holds three `<g>` layers of irregular polygon chips (fine flecks, medium chips, a few large shards) generated from a seeded PRNG, so batch 4182 always looks the same and "Reshuffle chips" pours a new batch. Chips reference five colour classes, not hex values, so switching between the Verona, Nero and Palma stones is a pure CSS variable swap that cross-fades in 420ms. Moving the pointer shifts the three layers by 3, 8 and 16px, so the floor gains a little depth. The copy sits on a cream "sample label" card with a hairline border, which is how a stone sample is actually labelled.

## Reference behaviour

1. Initial state: Verona stone (cream `#EFE6D8` with rust, ochre, sage, charcoal and white chips), batch 4182, label "Sample 012 · Verona".
2. The floor is static until the pointer moves. Pointer position maps to `(-1…1, -1…1)` from the viewport centre; each layer eases toward `offset × depth` (depths 3, 8, 16px) with factor 0.08 per frame, and the loop stops itself once the remaining distance is under 0.002.
3. "Reshuffle chips" picks a new seed in 1000–9999, updates the readout ("Batch 1806"), the label code ("Sample 061 · …", code = seed mod 97 + 1, three digits) and regenerates all chips. The new layers fade in from 0 with stagger 0 / 90 / 180ms over 420ms. Its icon rotates −120° while pressed.
4. Stone radios: Verona, Nero (charcoal `#2A2826` base with white, salmon, brass, slate chips), Palma (plaster pink `#F2C9B8` with bottle green, terracotta, cream, marigold). Background, chip fills, button colour and label name update; colours cross-fade 420ms. Chip geometry does not change.
5. "Pointer parallax" switch (`aria-pressed`, default on) disables the effect; turning it off eases layers back to 0.
6. Resizing regenerates the same seed for the new size after a 150ms debounce.
7. Hidden tab cancels any running parallax frame; it resumes on the next pointer move.
8. `prefers-reduced-motion: reduce`: parallax starts off (switch shows off and can be turned on), reshuffle swaps instantly with no fade, transitions drop to 1ms.

## Structure

```
1280 × 800   svg.floor fixed, inset −24px (bleed for parallax) · .sheen · .page
┌──────────────────────────────────────────────────────────────────────┐
│ ┌ Casa Brecce ──────────────────────── Tiles  Worktops  The studio  Trade ┐ │ nav card 56px, 24px/40px margins
│ └─────────────────────────────────────────────────────────────────────┘ │
│ ┌ label card 600px ───────────────┐   ▲  ◆ ▪  ·  ▰  ·  ◣ ·  ▪  ·      │
│ │ SAMPLE 012 · VERONA   PORTO, PT │  ·  ▪   ◆   ·  ▲ ·   ·  ◢   ▪      │
│ │─────────────────────────────────│   ▪  ·  ▲   ▪   ·  ◆  ·   ·      │
│ │ Floors poured                   │  · ◣  ·   ▪  ·    ▰ ·  ▪  ·      │
│ │ by hand, chipped                │                                    │
│ │ by chance.        64px serif    │                ┌ Mix   Batch 4182 ┐ │
│ │ sub 17px, max 460px             │                │ [↻ Reshuffle chips]│ │
│ │ [Order a sample box →]          │                │ STONE [V][N][P]   │ │
│ └─────────────────────────────────┘                │ Pointer parallax ●│ │
└────────────────────────────────────────────────────┴───────────────────┘─┘
page padding 40px; panel 264px, 40px from right and bottom
```

- `<svg class="floor" aria-hidden="true">` with `g#L0` (flecks), `g#L1` (chips), `g#L2` (shards), `viewBox` = viewport + 48px.
- Inside each `<g>`, chips are merged into one `<path>` per colour class (`.k0`–`.k4`): at most 15 path elements total.
- `.sheen`: fixed radial highlight (white 22% → 0) suggesting a polished surface.
- `.page`: `<nav aria-label="Main">` card; `<main class="hero">` with `.label` card (`p.code`, `h1`, `p.sub`, `a.btn`).
- `<form class="ctl" aria-label="Terrazzo controls">`: title + `<output aria-live="polite">`, reshuffle `<button>`, `<fieldset>` "Stone" of three radio cards each with a CSS-drawn mini swatch, parallax switch button labelled by its text.

## Tokens

```css
:root {
  /* Verona (default) */
  --base: #efe6d8;        /* binder */
  --c0: #b4532a;          /* rust */
  --c1: #d9a441;          /* ochre */
  --c2: #8a9a7b;          /* sage */
  --c3: #2e2a26;          /* charcoal */
  --c4: #fbf6ee;          /* white marble */
  --card: #fbf6ee;        /* nav, label, panel */
  --ink: #2a2420;
  --ink-2: #5f554c;
  --line: #d8ccba;        /* hairlines */
  --accent: #b4532a;      /* primary button */
  --accent-ink: #fffaf2;
  --serif: "Young Serif", Georgia, serif;
  --sans: "Figtree", system-ui, sans-serif;
  --fs-display: 64px;
  --fs-sub: 17px;
  --fs-body: 15px;
  --fs-code: 11px;
  --pad: 40px;
  --r: 2px;               /* everything: cut-stone corners */
  --bleed: 24px;
  --depths: 3px 8px 16px;
  --ease: cubic-bezier(.2,.7,.2,1);
  --t: 180ms;
  --t-mix: 420ms;         /* palette cross-fade, reshuffle fade */
}
[data-stone="nero"]  { --base: #2a2826; --c0: #f1ece4; --c1: #e59b82; --c2: #b89b5e; --c3: #6f7a80; --c4: #46423e; --accent: #e59b82; --accent-ink: #2a1a14; }
[data-stone="palma"] { --base: #f2c9b8; --c0: #2f6b4f; --c1: #c4532e; --c2: #fbf3e6; --c3: #e8a33d; --c4: #b98b7a; --accent: #2f6b4f; --accent-ink: #f7f2e8; }
```

Chip layers (counts scale with area):

| Layer | One chip per | Size (radius) px | Size curve | Parallax depth |
|---|---:|---|---|---:|
| L0 flecks | 800 px² | 1.2 – 4 | `min + r^1.8 × range` | 3px |
| L1 chips | 2,800 px² | 5 – 15 | same | 8px |
| L2 shards | 13,000 px² | 16 – 42 | same | 16px |

Colour weights (index picked from `[0,0,0,1,1,2,2,3,4,4]`): c0 30%, c1 20%, c2 20%, c3 10%, c4 20%.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Headline | Young Serif | 64px | 400 | 1.02 | −0.02em | sentence |
| Wordmark | Young Serif | 20px | 400 | 1 | −0.01em | Title |
| Panel title | Young Serif | 18px | 400 | 1 | 0 | Title |
| Sample code | Figtree | 11px | 600 | 1.5 | +0.14em | UPPERCASE |
| Sub | Figtree | 17px | 400 | 1.55 | 0 | sentence |
| Nav links | Figtree | 14px | 500 | 1.5 | 0 | Title |
| Buttons | Figtree | 15px / 14px | 600 | 1 | 0 | sentence |
| Panel text | Figtree | 13px | 400/500 | 1.5 | 0 | sentence, tabular batch |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|---|
| Layers | pointermove | `transform: translate` | 0 → ±3 / 8 / 16px | ease 0.08 per frame until settled | exponential | off by default |
| Reshuffle | click | layer `opacity` | 0 → 1 | 420ms, stagger 0/90/180ms | `--ease` | instant |
| Stone swap | radio change | body bg, chip fill, button colours | old → new tokens | 420ms | `--ease` | 1ms |
| Reshuffle icon | :active | `rotate` | 0 → −120° | 420ms | `--ease` | 1ms |
| Switch knob | click | `translateX` | 0 → 18px | 180ms | `--ease` | 1ms |
| Button | hover | `translateY` | 0 → −2px | 180ms | `--ease` | 1ms |

There is no continuous loop. The parallax rAF only runs while layers are still moving.

## States

- **Default:** Verona, batch 4182, parallax on.
- **Stone selected:** radio card border goes `--ink` with a 1px inset ink ring.
- **Parallax off:** switch track transparent, knob left, `aria-pressed="false"`; layers return to 0.
- **Parallax on:** track ink-filled, knob card-coloured and right, `aria-pressed="true"`.
- **Reshuffle hover:** fills with ink, text goes card; **active:** icon spins.
- **Focus-visible:** `outline: 2px solid var(--ink); outline-offset: 3px` on links, buttons, and the radio card span.
- **Hidden tab:** parallax frame cancelled.

## Accessibility

- The floor and sheen are `aria-hidden="true"`; the floor has no pointer events.
- The batch readout is `aria-live="polite"`, so a reshuffle announces "Batch 1806".
- Stone is a radio group in a `<fieldset>` with visible legend "Stone"; each card's visible name ("Verona") is the label.
- The parallax switch is a `<button aria-pressed>` labelled by the "Pointer parallax" text.
- All copy sits on the opaque card, never on chips: `#2A2420` on `#FBF6EE` is 14.2:1, `#5F554C` is 6.8:1. Button text: `#FFFAF2` on `#B4532A` 4.8:1; `#2A1A14` on `#E59B82` 7.4:1; `#F7F2E8` on `#2F6B4F` 5.6:1.
- Tab order: wordmark → 4 nav links → Order a sample box → Reshuffle → stone radios → parallax switch.
- Hit targets: reshuffle 44px tall, radio cards ~60px, switch row 40px.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: label card 540px, headline 56px.
- 768–1023: label card 480px; panel stays bottom-right.
- < 760: nav and card go full width with 12px margins, nav links hide, card padding 24px, headline 40px, sub 15px; panel spans the bottom; the parallax switch hides (touch has no hover pointer). Hero bottom padding 280px keeps the card clear of the panel.
- Chip counts scale with area, so density is the same at every size; regenerate on resize with the same seed.

## Acceptance checklist

### Always

- [ ] Chips come from a seeded PRNG; the same seed and size give the same floor.
- [ ] Chips are irregular 4–7 vertex polygons with jittered radius and squash, never circles.
- [ ] Three layers with different chip sizes and parallax depths.
- [ ] Chips are grouped into one `<path>` per colour class; palette swap touches only CSS variables.
- [ ] The SVG bleeds 24px past each edge so parallax never shows a gap.
- [ ] No continuous animation loop; parallax rAF stops when settled and when hidden.
- [ ] Reduced motion: parallax off by default, reshuffle instant.
- [ ] Copy sits on an opaque card with ≥ 4.5:1 contrast.
- [ ] Batch readout is a polite live region.

### This demo

- [ ] Opens on Verona `#EFE6D8` with batch 4182 and "Sample 012 · Verona".
- [ ] Stones Verona, Nero (`#2A2826`), Palma (`#F2C9B8`) with the chip colours in Tokens.
- [ ] Parallax depths 3 / 8 / 16px; densities 800 / 2,800 / 13,000 px² per chip.
- [ ] Headline "Floors poured by hand, chipped by chance." at 64px Young Serif.
- [ ] Reshuffle fades layers in with 90ms stagger over 420ms.

## Implementation notes

**Seeded PRNG and chip shape.** mulberry32 is enough; draw vertices around a circle with angular and radial jitter, then squash Y a little:

```js
const rng = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0;
  let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296; };
function chip(r, x, y, s) {
  const n = 4 + Math.floor(r() * 4), rot = r() * 6.283, pts = [];
  for (let i = 0; i < n; i++) {
    const a = rot + i / n * 6.283 + (r() - .5) * .9, d = s * (.55 + r() * .45);
    pts.push(`${x + Math.cos(a) * d} ${y + Math.sin(a) * d * (.7 + r() * .3)}`);
  }
  return 'M' + pts.join('L') + 'Z';
}
```

**One path per colour.** Concatenate sub-paths so a layer is at most five DOM nodes:

```js
const byColour = [[], [], [], [], []];
for (let i = 0; i < n; i++) {
  const s = cfg.min + Math.pow(r(), 1.8) * (cfg.max - cfg.min);
  byColour[WEIGHT[Math.floor(r() * WEIGHT.length)]].push(chip(r, r() * W, r() * H, s));
}
g.innerHTML = byColour.map((d, k) => d.length ? `<path class="k${k}" d="${d.join('')}"/>` : '').join('');
```

**Self-stopping parallax.**

```js
function frame() {
  pos.x += (pos.tx - pos.x) * .08; pos.y += (pos.ty - pos.y) * .08; apply();
  raf = Math.abs(pos.tx - pos.x) + Math.abs(pos.ty - pos.y) > .002 && !document.hidden
    ? requestAnimationFrame(frame) : 0;
}
```

Common mistakes:

- 2,000 separate `<path>` or `<circle>` elements; palette swaps and parallax get slow.
- Circles or rounded blobs: that's confetti, not stone.
- Uniform chip size. Terrazzo needs many flecks, some chips and a few big shards.
- `Math.random()` in the generator: resize or palette swap then reshuffles the floor by accident.
- Baking hex colours into the paths, so changing stone means regenerating.
- Putting copy straight on the chips. Use the label card.
- No bleed: the 16px layer slides and shows the bare edge.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
