---
title: "Liquid glass hero layers"
summary: "A dawn-lake hero with three frosted panels whose edge highlights turn toward a sun you move with the pointer, with solid fallbacks and 4.5:1 text on the blur."
platform: web
type: section
category: hero
tags: [hero, glass, landing, pointer, landscape]
styles: [glass, soft, organic]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-28
palette: ["#26393F", "#F3D9BD", "#FFFBF5", "#14232A", "#B8431D"]
fonts: ["Hanken Grotesk"]
related: [hero-flashlight-reveal, hero-product-window-tilt]
---

# Liquid glass hero layers

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The top of a marketing site for Aubade, an invented light-forecast app for landscape photographers. One scene layer (a dawn sky, three SVG ridge lines, a lake with sun glitter) sits behind exactly three frosted panels: the nav pill, the headline panel and a forecast card. Glass is used only where something floats over the scene; everything else is solid. The detail worth copying is the edge: each panel has a 1.5px conic-gradient rim whose bright arc rotates to face the sun, plus warm and cool 2px inner edges that read as refraction. Move the pointer and the sun moves, the glow follows, and every rim turns toward it.

## Reference behaviour

1. Initial state at 1280×800: sun centred at 68% / 50% of the stage, half-risen behind the far ridge. Nav pill at top, headline panel bottom-left, forecast card top-right, a small dark hint pill bottom-right reading "Move the pointer to move the sun".
2. Pointer move anywhere on the stage: the sun target is the pointer, clamped to x 6–94% and y 18–62% (y 8–62% under 860px). The sun disc and the radial glow ease to it over 600ms with `cubic-bezier(.16,1,.3,1)`.
3. On the same frame, each glass panel recomputes `--a` (the conic start angle) as the angle from the panel centre to the sun, minus 25°, so the brightest arc of its rim faces the light. It also moves its inner specular `--hx/--hy` to the sun's position relative to the panel.
4. The lake glitter (horizontal 1px lines every 6px) is masked to a 60px-wide column under the sun's x, so the reflection walks with the sun.
5. Pointer leaves the stage: sun returns to its default spot.
6. Hover a nav link: a 7% ink wash pill appears behind it in 160ms. Hover the primary button: it darkens to `#0A171C`; press scales it to 0.97.
7. Without `backdrop-filter` support, or with `prefers-reduced-transparency: reduce`, every panel becomes solid `#F7F1E8`. Nothing else changes, and all text still passes.
8. Under 860px the page scrolls vertically, the nav keeps only logo and "Get the app", and the panels stack: headline panel, then forecast card, then the hint pill. The sun defaults to 72% / 14% so it shows above the headline panel.

## Structure

```
1280 × 800  (scene fills the stage, panels float)
┌───────────────────────────────────────────────────────────────────────┐
│  ╭ nav pill 1120×56, glass ───────────────────────────────────────╮  │ top 22
│  │ ☼ Aubade              Forecasts Spots Field notes Pricing Sign in [Get the app] │
│  ╰────────────────────────────────────────────────────────────────╯  │
│                                                   ╭ forecast 300w ─╮ │ top 150
│  ╭ headline panel 600w, glass ────────╮           │ Tomorrow ...   │ │
│  │ • Forecasts for 41,000 ...         │     ( sun )│ 06:41 to 07:19│ │
│  │ Know the                           │           │ arc chart 84h  │ │
│  │ minute the light   76/0.96         │  /\  /\   │ LIGHT CLOUD FOG│ │
│  │ turns.                             │ /  \/  \  ╰────────────────╯ │
│  │ lede 17/1.55, max 470              │~~~ridges~~~~~~~~~~~~~~~~~~~~~│
│  │ [Plan a morning →] [See a sample]  │   lake + glitter column       │
│  │ 4.8 from 9,120 · Free for 3 spots  │             [hint pill]       │
│  ╰────────────────────────────────────╯ bottom 64                     │
└───────────────────────────────────────────────────────────────────────┘
content edges: max(16px, 50% − 560px) left and right
```

- `.stage` (div, `position:relative`, `isolation:isolate`, full height, min 640px).
  - `.scene[aria-hidden]` at `z-index:-1`: sky gradient, `.glow` (radial at `--lx --ly`), `.sunwrap > .sundisc` (84px), an inline SVG of ridges (`viewBox 0 0 1280 460`, `preserveAspectRatio="none"`, bottom 58% of the stage), `.glitter`.
  - `<nav class="glass" aria-label="Primary">`: logo link, `<ul>` of four links, "Sign in", solid "Get the app" button.
  - `<section class="glass card" aria-labelledby>`: `h2` (place + "Saturday 29 Oct"), `.when` time range, `.sub`, arc SVG, a `<dl class="stats">` with three `dt/dd` pairs.
  - `<section class="glass hero" aria-labelledby>`: kicker with accent dot, `h1`, `.lede`, two buttons, `.proof`.
  - `.tag` hint pill (`aria-hidden`, it repeats an instruction that is not needed for use).

## Tokens

```css
:root {
  /* scene */
  --sky-top: #c9dde0;      /* pale teal zenith */
  --sky-mid: #f3d9bd;      /* peach mid-sky */
  --horizon: #f0a577;      /* warm horizon band */
  --sun: #fff6e2;          /* sun disc */
  --ridge-far: #9fb4b6;
  --ridge-mid: #5f7e85;
  --ridge-near: #26393f;   /* also page background */
  --lake: #3a5a62;
  /* ink */
  --ink: #14232a;          /* headings, buttons */
  --ink-2: #33434a;        /* body and labels on glass */
  --accent: #b8431d;       /* kicker dot, golden-hour arc only */
  --on-ink: #fbf6ee;       /* text on dark buttons */
  /* glass */
  --frost: rgba(255, 251, 245, .70);
  --frost-solid: #f7f1e8;  /* fallback */
  --edge: rgba(255, 255, 255, .95);
  --blur: 22px;            /* plus saturate(1.7) */
  /* type */
  --font: "Hanken Grotesk", system-ui, sans-serif;
  --fs-display: 76px; --fs-when: 32px; --fs-lede: 17px; --fs-body: 14px; --fs-small: 13px; --fs-label: 11px;
  /* space and shape */
  --space: 4px 8px 12px 16px 22px 26px 36px 40px 64px;
  --r-panel: 28px; --r-card: 24px; --r-pill: 999px;
  --shadow: 0 30px 70px -28px rgba(20, 35, 42, .55), 0 2px 6px rgba(20, 35, 42, .08);
  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-micro: 160ms;
  --t-light: 600ms;
  /* light position, written by JS */
  --lx: 68%; --ly: 50%;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|
| h1 | Hanken Grotesk | 76px (64px under 1100, clamp(40px, 11vw, 64px) under 860) | 600 | 0.96 | -0.035em | sentence |
| Forecast time | Hanken Grotesk | 32px | 600 | 1.2 | -0.02em | tabular nums |
| Lede | Hanken Grotesk | 17px (16 on phone) | 400 | 1.55 | 0 | sentence |
| Logo | Hanken Grotesk | 18px | 700 | 1 | -0.01em | |
| Nav links, buttons | Hanken Grotesk | 14px (buttons 15px large) | 500 / 600 | 1 | 0 | |
| Kicker, card heading, proof | Hanken Grotesk | 13px | 600 / 400 | 1.4 | 0.02em kicker | |
| Stat labels | Hanken Grotesk | 11px | 600 | 1.3 | 0.06em | uppercase |
| Stat values | Hanken Grotesk | 17px | 600 | 1.3 | 0 | tabular nums |

One family at four weights. The headline carries the page; nothing else goes above 32px.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
|---|---|---|---|---|---|
| Sun disc | pointermove / leave | `left`, `top` of `.sunwrap` | previous → pointer (clamped) | 600ms | expo out |
| Glow | same | radial-gradient centre | previous → pointer | 600ms | expo out |
| Rim highlight | same, per rAF | `--a` on each panel | instant (follows the eased sun visually) | per frame | none |
| Specular sheen | same | `--hx`, `--hy` | instant | per frame | none |
| Nav link hover | hover | background | transparent → rgba(20,35,42,.07) | 160ms | standard |
| Button press | :active | transform | scale 1 → .97 | 160ms | standard |

Pointer work is batched in one `requestAnimationFrame`. Reduced motion: sun and glow jump without transition; buttons lose their transition. The light still follows the pointer because the user is driving it.

## States

- **Default:** sun at 68% / 50%, rims angled toward it.
- **Pointer on stage:** sun follows; rims turn.
- **Pointer left:** sun eases home.
- **Nav link hover:** 7% ink wash pill. **Focus-visible:** 2px `--ink` outline, 3px offset, on every link and button.
- **Primary button hover:** `#0A171C`. **Ghost button:** transparent with a 1.5px inset `--ink` ring (well over 3:1 on the frost); hover adds the 7% wash.
- **No backdrop-filter / reduced transparency:** panels solid `#F7F1E8`, rims and inner edges stay.

## Accessibility

- Landmarks: `nav[aria-label="Primary"]`; the two panels are `section`s labelled by their headings.
- The scene is `aria-hidden`. The arc chart SVG is `aria-hidden`; its numbers are repeated as text above and in the `dl`.
- Contrast: `--ink` on worst-case frost (70% cream over `--ridge-near`) is above 7:1; `--ink-2` stays above 5:1. Never put text directly on the sky.
- The hint pill is white on rgba(20,35,42,.72), above 9:1 on any part of the scene.
- Keyboard: tab order is logo, four nav links, Sign in, Get the app, Plan a morning, See a sample forecast. The sun is decoration and needs no keyboard control.
- Hit targets: nav links 36px tall inside a 56px pill; hero buttons 48px.

## Responsive rules

- **≥1280:** as drawn; content edges at `max(16px, 50% − 560px)`.
- **1100–1280:** same layout; under 1100 the headline drops to 64px, panel to 560px, card moves to top 110px.
- **860–1100:** still layered; the card may touch the ridge line, which is fine.
- **<860 (phone at 390):** body scrolls; `.stage` becomes a flex column with 96px top padding and 16px gutters; nav links and Sign in hide; headline panel gets 150px top margin so the sun shows above it; card and hint stack below. On phone the forecast card is solid `#F7F1E8` (it sits over the darkest ridge), and the date is spelled "Saturday 29 Oct" so it never shrinks into a narrow column. Nothing scrolls sideways.

## Acceptance checklist

**Always**
- [ ] Exactly three glass surfaces; buttons, hint pill and scene are solid.
- [ ] Every glass surface has a 1.5px conic rim cut out with a mask so the middle is empty.
- [ ] The rim's bright arc points at the light source and updates within one frame of pointer movement.
- [ ] Without `backdrop-filter`, and with `prefers-reduced-transparency: reduce`, panels are opaque and text contrast still passes.
- [ ] Body text on glass is at least 4.5:1 against the darkest scene colour behind it.
- [ ] Ghost button ring is at least 3:1 against the frost.
- [ ] Specular sheen sits under the text (z-index -1 inside an isolated panel), never over it.
- [ ] At 390 wide there is no horizontal scroll and panels stack in reading order.
- [ ] Focus rings visible on every link and button.

**This demo**
- [ ] Headline reads "Know the minute the light turns." at 76px/600.
- [ ] Forecast card shows "Tomorrow, Lake Brava", "06:41 to 07:19" and Light 86, Cloud 12%, Fog 40%.
- [ ] Sun is 84px, defaults to 68% / 50%, moves over 600ms expo out, clamped to 6–94% by 18–62%.
- [ ] Panel blur is 22px with saturate(1.7); frost is rgba(255,251,245,.70).

## Implementation notes

**The rim.** A padded pseudo-element filled with a conic gradient, with its content box masked out. Rotating `--a` turns the highlight without repainting the panel:

```css
.glass { position: relative; isolation: isolate; background: var(--frost);
  backdrop-filter: blur(22px) saturate(1.7);
  box-shadow: var(--shadow), inset 0 1px 0 var(--edge), inset 0 -1px 0 rgba(255,255,255,.35),
    inset 2px 0 0 rgba(255,196,160,.28), inset -2px 0 0 rgba(160,205,220,.3), inset 0 0 22px rgba(255,255,255,.4); }
.glass::before { content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1.5px; pointer-events: none;
  background: conic-gradient(from var(--a,135deg), #fff, rgba(255,255,255,.15) 18%, rgba(255,255,255,.05) 45%,
    rgba(255,255,255,.55) 62%, rgba(255,255,255,.1) 80%, #fff);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0); }
.glass::after { content: ""; position: absolute; inset: 0; z-index: -1; border-radius: inherit; pointer-events: none;
  background: radial-gradient(120% 80% at var(--hx,30%) var(--hy,0%), rgba(255,255,255,.42), transparent 55%); }
```

**Aim each rim at the light.** Conic gradients start at 12 o'clock, so add 90° to `atan2`:

```js
const ang = Math.atan2(sunY - cy, sunX - cx) * 180 / Math.PI + 90;
panel.style.setProperty('--a', (ang - 25) + 'deg'); // centre the bright arc on the sun
```

**Fallbacks are one rule each:**

```css
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) { .glass { background: var(--frost-solid); } }
@media (prefers-reduced-transparency: reduce) { .glass { background: var(--frost-solid); backdrop-filter: none; } }
```

Common mistakes: letting the sheen pseudo-element paint over text (it greys the headline); styling `nav` with a type selector so `.glass { position: relative }` beats it; putting body copy straight on the sky; adding glass to buttons and chips until nothing floats.
