---
title: "Sunset grid hero"
summary: "A synthwave hero: a canvas sun with cut stripes over a cyan perspective grid rolling toward the viewer, a tube-letter magenta title; capped at 1.5 DPR, paused off-screen, still under reduced motion."
platform: web
type: section
category: hero
tags: [synthwave, grid, sun, canvas, hero, neon]
styles: [cyber, retro, dark]
motion: rich
difficulty: 2
featured: false
published: 2026-10-07
palette: ["#120B2E", "#F4ECFF", "#FF3FA4", "#2FE2F0", "#FFB347"]
fonts: ["Monoton", "Josefin Sans"]
related: [webgl-shader-hero, glitch-text, card-holo-foil]
---

# Sunset grid hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. This is the one effect piece for a synthwave, outrun, retrowave or vaporwave look. The gradient, the glow and the neon are the scene; the interface on top stays flat and readable.

## What it is

The first screen of Night Drive, a fictional rooftop synth night. One canvas draws the whole scene: an indigo-to-plum sky with ninety slow-blinking stars, a sun that fades from amber through coral to magenta with six dark stripes cut across its lower half, a magenta horizon line with a soft glow, and a cyan grid on a near-black ground. The grid's vertical lines converge on a vanishing point behind the sun; its horizontal lines roll toward the viewer, spaced by `z²` so they bunch at the horizon and spread at the bottom, looping every 2.9 seconds. On top: a nav with a cyan tube-letter wordmark, a kicker in a cyan hairline box, a two-line Monoton headline in magenta with a neon glow, one lede and two buttons. The detail worth copying is the budget: the canvas runs at most 45 frames a second at a device pixel ratio capped at 1.5, stops when it leaves the viewport or the tab hides, and under reduced motion (or the "Grid: still" button) draws one frame and stops, so the page stays cheap on a slow phone.

## Reference behaviour

1. First frame: the scene already drawn, the grid rolling; the kicker, headline, lede and buttons fade up 14px in sequence (0 / 80 / 160 / 240ms) over 900ms. Copy: "Saturday 18 October · Doors 22:00", "NIGHT DRIVE / VOL. 7", the lede, buttons "Get a ticket, 1,200" (magenta) and "See the line-up" (ghost).
2. The horizontal grid lines move down and apart; a new line appears at the horizon every 2.9 seconds. Stars blink slowly (opacity 0.35 to 0.75 on a sine). Nothing else in the scene moves.
3. Hover the magenta button: it lifts 2px and its glow widens (22px to 34px blur). The ghost button's border brightens.
4. "Grid: still" (bottom left, `aria-pressed`): stops the loop and leaves the last frame. "Grid: moving" starts it again.
5. When the canvas scrolls out of view, or the tab is hidden, the loop stops; it resumes when visible, unless still was chosen or reduced motion is on.
6. Resizing redraws at the new size; the sun is 20% of the shorter side.
7. Reduced motion: the entry animation is removed and the grid is drawn once; the button starts as "Grid: still".

## Structure

```
1280 × 800, one canvas behind everything (z 0), content at z 2
nav 22/40        NIGHT DRIVE (cyan tube)                      LINE-UP  TICKETS  THE ROOM
copy, padding 40/40, max 760
[ SATURDAY 18 OCTOBER · DOORS 22:00 ]  kicker, cyan hairline box
NIGHT DRIVE          86px Monoton, magenta, glow
VOL. 7               second line, ink
lede 18px/400, 46ch
[GET A TICKET, 1,200] [SEE THE LINE-UP]
                                                       (sun, 20% of min(W,H), centred at 60% W, 55% of its radius above the horizon at 64% H)
───────────────────────────────── horizon, magenta, glow ─────────────────────────────────
  \  \  \  |  /  /  /   cyan grid: 25 verticals to the vanishing point, 14 horizontals at z²
[GRID: MOVING]
```

- `main.hero` → `canvas#c[aria-hidden]`, `header.nav` (`a.brand`, `nav.links`), `div.copy` (`span.kicker`, `h1` with a `span` second line, `p.lede`, `div.ctas` with two `a.btn`), `button.motion[aria-pressed]`.

## Tokens

```css
:root {
  --bg: #120b2e;  --surface: #1a1140;
  --ink: #f4ecff;  --ink-2: #c3b6e6;  --ink-3: #9a8cc4;  --line: #2f2466;
  --magenta: #ff3fa4;   /* primary: the headline, the button, the horizon */
  --cyan: #2fe2f0;      /* secondary: the wordmark, the kicker, the grid, focus */
  --sun: #ffb347;  --sun-2: #ff5c8a;   /* the sun's gradient stops, with --magenta at the bottom */
  --display: "Monoton", cursive;
  --sans: "Josefin Sans", system-ui, sans-serif;
  --r: 6px;
  --glow-m: 0 0 18px rgba(255,63,164,.55), 0 0 48px rgba(255,63,164,.3);   /* headline */
  --glow-btn: 0 0 22px rgba(255,63,164,.45);
  --t-micro: 200ms;  --t-in: 900ms;
  --ease: cubic-bezier(.2,.7,.2,1);  --expo: cubic-bezier(.16,1,.3,1);
}
/* scene constants, in the script */
/* horizon 0.64 H · vanishing point 0.60 W · sun radius 0.20 min(W,H), centre 0.55 r above the horizon · 25 verticals at 0.06 W · 14 horizontals · loop 2.86 s · fps cap 45 · DPR cap 1.5 */
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Headline | Monoton | clamp(52px, 6.8vw, 86px) | 400 | 1 | +0.02em | UPPERCASE, line 1 magenta with glow, line 2 ink |
| Wordmark | Monoton | 20px | 400 | 1 | +0.06em | UPPERCASE, cyan with glow |
| Lede | Josefin Sans | 18px | 400 | 1.5 | 0 | sentence, `--ink-2`; names in 600 `--ink` |
| Button | Josefin Sans | 14px | 600 | 1 | +0.04em | UPPERCASE |
| Nav link | Josefin Sans | 14px | 600 | 1 | +0.08em | UPPERCASE, `--ink-2` |
| Kicker | Josefin Sans | 13px | 600 | 1 | +0.14em | UPPERCASE, cyan |
| Motion button | Josefin Sans | 13px | 600 | 1 | +0.06em | UPPERCASE |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
|---|---|---|---|---:|---|
| horizontal grid lines | loop | y position | horizon → bottom, spaced by `((i + phase) / 14)²` | 2.86s per line | linear |
| stars | loop | alpha | 0.35 ↔ 0.75 | ~4s sine | – |
| `.in` | load | opacity, transform | 0, 14px → 1, 0 | 900ms, delays 0 / 80 / 160 / 240 | `--expo` |
| `.btn` | hover | transform, box-shadow | 0, 22px glow → −2px, 34px glow | 200ms | `--ease` |

Budget: `requestAnimationFrame` throttled to 45fps; canvas at `min(devicePixelRatio, 1.5)`; an `IntersectionObserver` and `visibilitychange` stop the loop when unseen. Reduced motion: no entry animation; one frame, then stopped; the Grid button reads "still".

## States

- **Grid moving / still:** `aria-pressed` on the bottom-right button; the label says which.
- **Button default / hover / focus-visible:** magenta fill with a 22px glow; lifted with a 34px glow; 2px cyan outline at 4px offset.
- **Ghost button:** 55% indigo with an 8px blur and a 40% ink border; hover brightens the border.
- **Offscreen or hidden tab:** the loop is stopped; the last frame stays.

## Accessibility

- The canvas is `aria-hidden`; everything it says is in the copy. The headline, kicker and buttons are real text.
- Contrast is measured on the actual ground: the copy sits over the sky gradient (`#120b2e` to `#3a1458`). `--ink` on `#3a1458` 12.9:1; `--ink-2` 7.9:1; the magenta headline is 86px and passes the large-text rule at 5.8:1 on the darkest sky and 4.6:1 on the lightest, so the glow is decoration and the fill does the work; cyan kicker on the sky 9.3:1 or better; `#1a0a20` on the magenta button 5.9:1. Keep the copy block over the sky, never over the sun.
- The Grid button is a real control for people who prefer less motion but did not set the OS flag; it also follows the media query live.
- Focus rings are cyan, 2px at 4px offset, visible on the dark ground.
- Hit targets: buttons 50px, the Grid button 40px, nav links 14px type with 26px gaps (make them 44px tall on touch).

## Responsive rules

- ≥ 1280: as drawn; headline 86px; the copy ends above the horizon.
- 1024–1279: headline 6.8vw; the sun stays at 60% W.
- 768–1023: copy max 600px; horizon 0.68 H; the vanishing point moves to 50% W so the sun sits behind the copy's right edge.
- < 640: padding 20px; headline 56px; buttons full width stacked; 15 verticals instead of 25; the canvas DPR cap stays 1.5 and the fps cap drops to 30. The Grid button stays reachable above the fold's bottom edge.

## Acceptance checklist

**Always**
- [ ] One canvas draws sky, stars, a striped sun, a glowing horizon and a cyan perspective grid; nothing in the scene is a DOM element.
- [ ] Horizontal lines are spaced by `z²` from the horizon and loop every 2.86s; vertical lines converge on one vanishing point.
- [ ] The loop runs at most 45fps, at a DPR of at most 1.5, and stops when the canvas is off-screen or the tab is hidden.
- [ ] Reduced motion, or the Grid button, leaves a single still frame; the button's `aria-pressed` and label match the state.
- [ ] The headline is the display face in `--primary` with a glow; the second line is `--ink`; body and buttons are the text face, flat.
- [ ] The copy sits over the sky and passes 4.5:1 (body) and 3:1 (the 86px headline) on the darkest and lightest sky stops.
- [ ] Two buttons at most; one filled. No stats, no pill row, no scroll cue.
- [ ] Focus rings visible on every control.

**This demo**
- [ ] Night Drive Vol. 7, Saturday 18 October, doors 22:00, Maitighar rooftop, ticket 1,200; nav Line-up, Tickets, The room.

## Implementation notes

**The grid**, spaced by z² so it reads as a floor:

```js
const hz = H * .64, vx = W * .6;
for (let i = -12; i <= 12; i++) { const x0 = vx + i * W * .06; g.moveTo(vx + (x0 - vx) * .02, hz); g.lineTo(vx + (x0 - vx) * 4.2, H); }
const ph = (t * .00035) % 1;                       // 2.86 s loop
for (let i = 0; i < 14; i++) { const z = (i + ph) / 14; const y = hz + (H - hz) * z * z; g.moveTo(0, y); g.lineTo(W, y); }
```

**The sun** is a clipped gradient with stripes painted over it in the ground colour:

```js
g.save(); g.beginPath(); g.arc(sx, sy, sr, 0, Math.PI * 2); g.clip();
g.fillStyle = sunGradient; g.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
g.fillStyle = '#2a0f45';
for (let i = 0; i < 6; i++) g.fillRect(sx - sr, sy + sr * (.08 + i * .09), sr * 2, 2 + i * 1.4);
g.restore();
```

**The budget**, in one place:

```js
dpr = Math.min(devicePixelRatio || 1, 1.5);
function frame(now) { if (now - last < 1000 / 45) return (raf = requestAnimationFrame(frame)); t += now - last; last = now; draw(t); raf = requestAnimationFrame(frame); }
function update() { cancelAnimationFrame(raf); if (want && seen && !document.hidden) raf = requestAnimationFrame(frame); }
new IntersectionObserver(([e]) => { seen = e.isIntersecting; update(); }).observe(canvas);
document.addEventListener('visibilitychange', update);
```

Common mistakes: `shadowBlur` on the grid lines (it costs more than everything else combined; use a gradient band for the horizon glow instead); an uncapped DPR on a 3× phone; a loop that keeps running under a modal or in a background tab; putting the copy over the sun, where magenta text fails; a second effect (a scanline overlay, a glitch) on the same hero.
