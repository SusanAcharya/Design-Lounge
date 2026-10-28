---
title: "Scroll mask reveal sequence"
summary: "Four drawn landscapes on a pinned stage; each next scene opens through a circle that grows out of the current scene's sun or moon as you scroll."
platform: web
type: animation
category: scroll
tags: [scroll, mask, clip-path, travel, sequence]
styles: [retro, kinetic, dark]
motion: rich
difficulty: 3
featured: false
published: 2026-10-28
palette: ["#0F1B25", "#F4E9D8", "#E8553F", "#E88B6F", "#1B4A5B"]
fonts: ["Monoton", "Lora"]
related: [text-mask-scroll-reveal, scroll-zoom-portal]
---

# Scroll mask reveal sequence

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The route page of a fictional sleeper train, the Meridian Night Line: four stops in one night, each a full-screen drawn landscape (desert dunes at dusk, sea cliffs at night, a pine pass at dawn, a snowfield at noon). The stage is pinned for 420vh of scroll. As you scroll, the current scene's sun or moon swells by 35%, then the next scene opens through a circle `clip-path` centred exactly on that sun and growing to 150vmax, so the light in one landscape becomes the window into the next. A fixed top bar carries the route: four stops on a line that fills in signal red as you travel. Each scene has a dark station card with the stop name set in Monoton. The detail worth copying: one registered `--t` (0 → 1) on the pinned section, from a CSS view timeline, drives every circle radius, every sun swell and the route fill through `clamp()` arithmetic, with no per-scene timelines.

## Reference behaviour

1. Initial frame (scrollY 0, 1280×800): 64px navy bar with "Meridian" (Monoton 24px) left, the route (Qasr Amel, Port Ivanne, Hallen Pass, Vael; first dot filled red) centred, and a red "Book a cabin" pill right. Below, the dune scene: rose-to-amber sky, three dune bands, a rail line with a small train, and a 150px pale sun at (72%, 40%) with a halo. A 440px station card sits bottom-left: "Departs 19:40 · Platform 2", "Qasr Amel" at 64px Monoton, an italic Lora paragraph, and "Day one · 1,180 km to Vael".
2. Scrolling through the 420vh section maps to `--t` 0 → 1 (`view()` timeline, range `contain 0%` → `contain 100%`), while the stage stays pinned (`position: sticky; top: 0; height: 100vh`).
3. Transitions sit at `t` 0.08–0.32 (scene two), 0.40–0.64 (scene three), 0.72–0.96 (scene four). Inside each, local `k = clamp(0, (t − a) / 0.24, 1)` and the incoming scene's clip is `circle(k² × 150vmax at ox oy)`, where (ox, oy) is the outgoing scene's sun position. `k²` makes the circle start slowly, like a light swelling, then sweep.
4. The outgoing sun scales from 1 to 1.35 over the 0.10 of `t` around its transition (scene one: 0.02–0.12, two: 0.34–0.44, three: 0.66–0.76), so the circle seems to come out of it.
5. The incoming scene's card is part of the scene, so it is revealed by the same circle; cards alternate left and right (left 48 / right 48, bottom 48).
6. The route line's red fill is `scaleX(t)` from the left; a stop dot turns red and its label goes full cream when `t` reaches 0, 0.2, 0.52 and 0.84.
7. Scene two (Port Ivanne): night sea, a moon at (26%, 30%) with a striped glint on the water below it, a cliff and lighthouse with a faint beam. Scene three (Hallen Pass): three rows of patterned pines in fading greens and a 220px dawn sun at (58%, 52%). Scene four (Vael): snow mountains, a white plain and a red train, a pale sun at (80%, 26%).
8. After the section, the stage unpins and a Fares block follows (Monoton 56px "Fares", copy, and a four-row table: Reclining seat €89, Couchette €139, Private cabin €189 pp, Cabin with shower €264 pp). "Book a cabin" jumps there.
9. Scrolling back closes each circle back into its sun.
10. Without scroll-driven animation support, JS computes `t = −rect.top / (rect.height − innerHeight)` on scroll (rAF-throttled) and writes `--t` on the section; the result is the same.

## Structure

```
1280 × 800, document ~4,500px
┌───────────────────────────────────────────────────────────────────────┐
│ Meridian      ●━━━━━○──────○──────○                    (Book a cabin) │ 64 fixed
│               Qasr   Port   Hallen  Vael                              │
├───────────────────────────────────────────────────────────────────────┤
│ SECTION .seq  height 420vh                                            │
│ ┌ .stage sticky 100vh ───────────────────────────────────────────────┐│
│ │ .scene.s1  svg landscape + .sun (72%,40%)                          ││
│ │ .scene.s2  clip circle at (72%,40%)  sun (26%,30%) + .glint        ││
│ │ .scene.s3  clip circle at (26%,30%)  sun (58%,52%)                 ││
│ │ .scene.s4  clip circle at (58%,52%)  sun (80%,26%)                 ││
│ │ ┌ .card 440w ─────────┐                                            ││
│ │ │ when · h2 64 · p · meta │ bottom 48, left or right 48            ││
│ └────────────────────────────────────────────────────────────────────┘│
├───────────────────────────────────────────────────────────────────────┤
│ FARES  grid 1fr 1.4fr, gap 64, padding 96 48 112                      │
└───────────────────────────────────────────────────────────────────────┘
```

- `<header class="bar">` fixed: `<a class="brand">`, `<ol class="route" aria-label="Route">` of four `<li data-at>` (dot via `::before`, label `<span>`; line via `.route::before/::after` from 12.5% to 87.5%), `<a class="book">`.
- `<section class="seq" aria-label="The route, stop by stop">` → `.stage` → four `.scene` blocks, each `position:absolute; inset:0; overflow:hidden` with an inline `<svg aria-hidden>` (viewBox 1600×1000, `preserveAspectRatio="xMidYMax slice"`, scene two `xMaxYMax` so the cliff stays on narrow screens), an `<i class="sun">`, and a `.card` with `.when`, `<h2>`, `<p>`, `.meta`.
- Sun and clip centre are set per scene as custom properties: `--sx --sy` (own sun), `--ox --oy` (previous sun), `--sr` sun size, `--sc` sun colour, `--halo`.
- The sun is HTML, not part of the SVG, so its percentage position matches the clip-path's percentage centre at any aspect ratio.
- `<section class="fares">` with a heading block and a `<table>`.

## Tokens

```css
@property --t { syntax: '<number>'; inherits: true; initial-value: 0; }
:root {
  /* chrome */
  --night: #0f1b25;      /* bar, cards, fares */
  --night-2: #172837;
  --rule: #263746;       /* bar bottom rule */
  --track: #33475a;      /* route line */
  --dot-line: #5d7286;   /* unvisited stop ring */
  --cream: #f4e9d8;      /* text */
  --dim: #c2b6a4;        /* secondary text */
  --signal: #e8553f;     /* route fill, card edge, CTA */
  --signal-hover: #f06a54;
  --signal-ink: #1d0b07;

  /* scenes */
  --dune-sky: #e88b6f; --dune-glow: #f4c08f; --dune-1: #d68456; --dune-2: #bb6440; --dune-3: #8d432b;
  --sea-sky: #0d2c3a;  --sea-glow: #1b4a5b;  --sea: #0a2532;   --cliff: #06171f;  --lamp: #f3c46b;
  --pass-sky: #d4dfcc; --pass-glow: #f1e5c4; --pine-1: #9fb39a; --pine-2: #5f7d61; --pine-3: #2c4433;
  --snow-sky: #b9d0dd; --snow: #f6f8f9;      --range: #a8bccb; --train: #c63a2d;
  --sun-1: #fbe3b8; --moon: #eef1e6; --sun-3: #fff1d2; --sun-4: #f7e7b2;

  /* type */
  --mono: "Monoton", system-ui, sans-serif;
  --serif: "Lora", Georgia, serif;

  /* layout */
  --bar: 64px; --card-w: 440px; --card-inset: 48px; --seq-h: 420vh;
  --circle-max: 150vmax; --swell: .35;

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --t-in-2: .08; --t-in-3: .40; --t-in-4: .72; --t-span: .24;
}
```

## Typography

| Role            | Family | Size | Weight | Line-height | Tracking | Case      |
|-----------------|--------|-----:|-------:|------------:|---------:|-----------|
| Brand           | Monoton | 24px (18px < 820) | 400 | 1 | +0.02em | as set (Monoton is caps-only) |
| Stop name       | Monoton | 64px (40px < 820) | 400 | 1 | +0.01em | as set |
| Fares heading   | Monoton | 56px (38px < 820) | 400 | 1.05 | 0 | as set |
| Card paragraph  | Lora italic | 18px (16px) | 400 | 1.45 | 0 | sentence |
| Card kicker     | Lora   | 12px | 400 | 1.55 | +0.16em | UPPERCASE |
| Route labels    | Lora   | 12px | 400 | 1.55 | +0.06em | Title Case |
| Meta, table head| Lora   | 12–13px | 400 | 1.55 | 0 / +0.14em | sentence / UPPERCASE |
| Table berth     | Lora   | 20px | 500 | 1.55 | 0 | sentence |
| CTA             | Lora   | 14px | 500 | 1 | 0 | sentence |

Monoton only above 24px; everything that must be read quickly is Lora.

## Motion

| Element | Driver | Property | From → To | Window of `t` | Notes |
|---|---|---|---|---|---|
| `.seq` | `view()` contain 0–100% | `--t` | 0 → 1 | whole section | linear, fill both |
| `.s2` | `--t` | clip-path radius | 0 → 150vmax (`k²`) at (72%, 40%) | 0.08 → 0.32 | |
| `.s3` | `--t` | clip-path radius | 0 → 150vmax at (26%, 30%) | 0.40 → 0.64 | |
| `.s4` | `--t` | clip-path radius | 0 → 150vmax at (58%, 52%) | 0.72 → 0.96 | |
| `.s1 .sun` | `--t` | scale | 1 → 1.35 | 0.02 → 0.12 | |
| `.s2 .sun` | `--t` | scale | 1 → 1.35 | 0.34 → 0.44 | |
| `.s3 .sun` | `--t` | scale | 1 → 1.35 | 0.66 → 0.76 | |
| `.route::after` | `--t` | scaleX | 0 → 1 | whole section | origin left |
| Stop dots | JS from `t` | fill, label colour | ring → red | at 0, 0.2, 0.52, 0.84 | class `.on` |

Reduced motion: the section is no longer pinned or animated. Scenes become four normal 100vh blocks stacked in order with no clip, suns at rest, so every landscape and card is fully visible. The route still marks the stop whose scene is at the middle of the screen (JS), and its fill jumps to that stop.

## States

- **Stop reached:** dot filled `--signal`, label `--cream`; unreached: navy dot with a 2px `#5d7286` ring, label `--dim`.
- **CTA hover:** `#f06a54`.
- **Focus-visible:** 2px `--signal` outline, 3px offset, on the brand, CTA and any link.
- **Mid-reveal:** both scenes visible, divided by the circle edge; text on either side sits on its own solid card.

## Accessibility

- The section has an `aria-label`; each scene's card holds an `<h2>` stop name, so the sequence reads as four headed blocks even though they are visually stacked.
- Landscapes are decorative SVG (`aria-hidden`); the sun and glint are empty `<i>` elements.
- The route is an ordered list labelled "Route"; stop labels are text. Hidden scenes are still in the DOM in reading order.
- Contrast: cream on navy 14.5:1, dim on navy 8.7:1, CTA text on red 5.3:1. Card text never sits directly on a landscape.
- Stop rings `#5d7286` are 3.5:1 on the bar.
- Keyboard: brand and CTA are links; nothing in the stage needs focus.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: same; suns use `clamp()` sizes (`clamp(90px, 11vw, 150px)` and so on).
- 820–1023: same; route labels stay.
- < 820: bar padding 16px, brand 18px, route labels hidden (dots and line remain), CTA 13px. Cards span the width with 16px insets at bottom 24, padding 18px; stop name 40px; paragraph 16px. Fares stack, padding 72 16 88.
- `min-height: 560px` on the stage keeps short windows from crushing the card into the sun.
- Nothing scrolls sideways at 390px.

## Acceptance checklist

**Always**
- [ ] One registered `--t` on the pinned section, driven by `view()` with range `contain 0% → contain 100%`, drives every reveal.
- [ ] Each incoming scene's `clip-path: circle()` is centred on the outgoing scene's sun, in the same percentage units.
- [ ] Radius uses `k²` and reaches 150vmax so the corners are covered at any aspect.
- [ ] The outgoing sun swells to 1.35x just before its circle opens.
- [ ] Cards travel with their scenes and keep text on a solid ground.
- [ ] Route fill and stop states follow `t`.
- [ ] JS fallback writes the same `--t` when `animation-timeline` is unsupported.
- [ ] Reduced motion shows four static full scenes with no pinning.
- [ ] Nothing scrolls sideways at 390px; text contrast passes everywhere.

**This demo**
- [ ] Stops: Qasr Amel 19:40, Port Ivanne 23:15, Hallen Pass 04:50, Vael 11:30.
- [ ] Sun positions (72%, 40%), (26%, 30%), (58%, 52%), (80%, 26%).
- [ ] Section height 420vh; transitions at t 0.08, 0.40, 0.72, each 0.24 long.
- [ ] Fares table with four rows from €89 to €264 pp.

## Implementation notes

**Clamp arithmetic instead of four timelines.** One number on the parent; each scene derives its own progress:

```css
.seq { height: 420vh; animation: run linear both;
       animation-timeline: view(); animation-range: contain 0% contain 100%; }
@keyframes run { from { --t: 0 } to { --t: 1 } }
.stage { position: sticky; top: 0; height: 100vh; overflow: hidden; }
.s2 { --a: .08 } .s3 { --a: .40 } .s4 { --a: .72 }
.s2, .s3, .s4 {
  --k: clamp(0, calc((var(--t) - var(--a)) / .24), 1);
  clip-path: circle(calc(var(--k) * var(--k) * 150vmax) at var(--ox) var(--oy));
}
```

**Keep the sun out of the SVG.** With `preserveAspectRatio="... slice"` the SVG's coordinates shift with the viewport's aspect, so a sun drawn inside it will drift away from a clip centre given in percent. An absolutely positioned element at `left: var(--sx); top: var(--sy); transform: translate(-50%, -50%)` lines up with `circle(... at var(--sx) var(--sy))` everywhere.

**Fallback writes the same variable:**

```js
const r = seq.getBoundingClientRect();
const t = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
if (!CSS.supports('animation-timeline: view()')) seq.style.setProperty('--t', t);
route.style.setProperty('--t', t);              // the bar is outside .seq, so feed it too
lis.forEach((l) => l.classList.toggle('on', t >= +l.dataset.at));
```

Common mistakes: forgetting that the fixed bar is outside the section, so `--t` does not inherit into it; a linear radius (the circle snaps open with no sense of the light swelling); a radius in `%` (it is relative to the box diagonal and never quite covers the corners); `overflow: hidden` missing on the stage, which lets the 150vmax circle create scrollbars.
