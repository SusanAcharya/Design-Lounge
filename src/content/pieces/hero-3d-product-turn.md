---
title: "3D product turn hero"
summary: "A shop hero for an invented field recorder built from six CSS 3D faces that turns toward the pointer on a spring, shades each face from one light, and pins four spec callouts."
platform: web
type: section
category: hero
tags: [hero, 3d, product, ecommerce, pointer]
styles: [dark, industrial, luxe]
motion: rich
difficulty: 3
featured: false
published: 2026-10-28
palette: ["#121314", "#F0EEE9", "#CFC8B8", "#F2C230", "#D8452B"]
fonts: ["Unbounded", "Inter"]
related: [hero-product-window-tilt, hero-machined-part-breakout]
---

# 3D product turn hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The top of a product page for Kessel One, an invented four-track field recorder. The device is a real CSS 3D box (six faces, 220 × 320 × 72px) on a dark studio sweep. It turns toward the pointer on a damped spring and settles back to a three-quarter view, and every face is shaded from one fixed light by computing its rotated normal, so the side really does fall into shadow as it turns. Four spec callouts with hairline leaders fade in around it; the left column carries the name, a finish picker that recolours the device, the price and the order button. The detail worth copying is the per-face lighting: it is what separates a turning object from a turning diagram.

## Reference behaviour

1. Load: the device starts at rotateY −118°, rotateX −6° and springs to its rest pose (rotateY −30°, rotateX −20°) in about 900ms, overshooting slightly. 700ms after load the four callouts fade and rise 6px into place, staggered 0 / 120 / 240 / 360ms.
2. Pointer over the stage: target rotateY = rest + (pointer x offset from centre ÷ stage width) × 80° (±40°); target rotateX = rest − (y offset ÷ height) × 24° (±12°). A spring (stiffness 0.075, damping 0.8 per frame) chases the target.
3. On every frame, each face's normal is rotated by the current angles and dotted with the light vector (−0.38, −0.74, 0.56). The face overlay opacity is 0.55 − 0.55 × max(0, dot), so the face toward the light is almost bare and faces turned away are dimmed by 55%.
4. A diagonal specular band on the front face slides with rotateY (background-position 50% − angle × 0.9). The floor shadow widens 0.85× → 1.1× as the device turns side-on.
5. Pointer leaves: the device springs back to rest (keeping any whole turns already made).
6. Click the stage, or press Enter / Space when it is focused: the device spins a full +360° on the spring and the callouts hide and replay 500ms later. Left / Right arrows turn it 20° per press.
7. Finish picker (radio group, three 40px swatches): Bone (default), Graphite, Signal. Choosing one sets `--body` and `--body-hi` on the device and updates the "Finish:" label.
8. The front screen shows two level meters that breathe (scaleX 0.42 ↔ 0.78, 1.2s and 0.9s, alternate).
9. Reduced motion: no intro turn, no spring (targets are applied instantly), no meter animation, callouts appear without transition.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────┐
│ KESSEL                      Kessel One  Capsules  Field journal  Support  ⌂ Bag (0) │ nav 64
├───────────────────────────┬──────────────────────────────────────────┤
│                           │        X/Y capsules ──○  ╭──────╮         │
│ FOUR-TRACK FIELD RECORDER │                         ╱ top  ╱│ ○── Two XLR inputs │
│ Kessel                    │                        ┌──────┐ │        │
│ One        80/0.95        │   Sunlight screen ──○  │front │r│        │
│ lede 16/1.6, max 380      │                        │220×320│ │ ○── 21 hour battery │
│ Finish: Bone  ◯ ◉ ◯       │                        └──────┘╱         │
│ $449   [Order Kessel One →]│                    ░░ floor shadow ░░    │
│ Ships 14 November         │                     Move to turn, [Enter] to spin │
└───────────────────────────┴──────────────────────────────────────────┘
grid: 440px | 1fr, gap 24, padding 0 48; stage perspective 1400px, origin 50% 22%
```

- `<nav aria-label="Primary">`: wordmark, four links, bag link with count.
- `<section class="hero" aria-labelledby="h">`
  - `.copy`: eyebrow `p`, `h1`, lede, `<fieldset>` + `<legend>` with three radio `label`s, `.buy` row (price `p` with `small`, `button`).
  - `.stage[tabindex=0][role=img][aria-label]`: `.floor`, `.dev` with six `.f` faces (front holds grille, screen, keys; right holds knob and ports; left holds two ports; top holds two capsules), four `p.call` callouts, `.hint`.

## Tokens

```css
:root {
  --bg: #121314;        /* studio */
  --bg-2: #1b1c1f;
  --line: #2c2e32;      /* nav hairline */
  --ink: #f0eee9;
  --ink-2: #a3a29c;     /* lede, callout body, leaders */
  --accent: #f2c230;    /* order button, focus */
  --accent-ink: #1d1600;
  --rec: #d8452b;       /* record key */
  --body: #cfc8b8;      /* device finish, set per swatch */
  --body-hi: #e2dccf;   /* front gradient start */
  --trim: #18191b;      /* grille dots, keys, ports */
  --display: "Unbounded", system-ui, sans-serif;
  --sans: "Inter", system-ui, sans-serif;
  --W: 220px; --H: 320px; --D: 72px;      /* device box */
  --perspective: 1400px;
  --fs-h1: 80px; --fs-price: 30px; --fs-lede: 16px; --fs-nav: 14px; --fs-call-title: 13px; --fs-small: 12px;
  --r-face: 10px; --r-side: 8px; --r-pill: 999px;
  --light: -.38, -.74, .56;               /* light vector, x y z (y down) */
  --spring-k: .075; --spring-damp: .8;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-micro: 160ms; --t-call: 500ms;
}
```

Finishes: Graphite `#2C2D30` / `#3A3B3F`, Bone `#CFC8B8` / `#E2DCCF`, Signal `#B9472A` / `#CF5A3A`.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|
| h1 | Unbounded | 80px (64 under 1120; clamp(44px,13vw,64px) phone) | 700 | 0.95 | -0.03em | title |
| Wordmark | Unbounded | 17px | 700 | 1 | 0.02em | upper |
| Price | Unbounded | 30px | 600 | 1 | -0.02em | |
| Callout title | Unbounded | 13px | 600 | 1.3 | -0.01em | |
| Lede | Inter | 16px | 400, lead clause 500 | 1.6 | 0 | |
| Button | Inter | 15px | 600 | 1 | 0 | |
| Nav, bag | Inter | 14px | 400 | 1 | 0 | |
| Eyebrow | Inter | 12px | 600 | 1.4 | 0.14em | upper |
| Callout body, hint, legend | Inter | 12px | 400 / 500 | 1.4 | 0 | |
| Screen text | Inter | 9px | 500 | 1 | 0.06em | upper (decorative) |

## Motion

| Thing | Trigger | Property | From → to | Timing | Reduced motion |
|---|---|---|---|---|---|
| Intro turn | load | rotateY / rotateX | −118° / −6° → −30° / −20° | spring k .075, damp .8 (~900ms) | starts at rest |
| Pointer turn | pointermove | same | rest ± 40° / ± 12° | spring | instant |
| Spin | click / Enter / Space | rotateY | +360° | spring (~1.1s) | instant |
| Face light | every spring frame | overlay opacity | 0 → .55 | per frame | per change |
| Specular band | every frame | background-position | follows rotateY | per frame | per change |
| Callouts | 700ms after load; 500ms after spin | opacity, translateY | 0, 6px → 1, 0 | 500ms expo out, 120ms stagger | no transition |
| Meters | always | scaleX | .42 ↔ .78 | 1.2s / .9s alternate, standard | static |
| Swatch, button | hover / active | brightness, scale | 1 → 1.06, 1 → .97 | 160ms standard | none |

The spring runs in rAF only while moving and stops when velocity < 0.01°/frame and the error < 0.05°.

## States

- **Rest:** three-quarter view, top and right faces visible, callouts shown.
- **Turning:** spring follows pointer; faces brighten or dim live.
- **Spinning:** callouts hidden until 500ms after the spin starts.
- **Swatch:** the native radio is the ring: `appearance: none`, absolutely covering the 40px label, transparent fill, 1.5px solid `#6D6C67` border (3.6:1 on `--bg`); checked is a 2px `--ink` border; focus-visible adds a 2px accent outline. The 28px colour disc sits under it.
- **Stage focus-visible:** 2px accent inset ring, 12px radius.
- **Button hover:** brightness 1.06; **active:** scale .97.

## Accessibility

- The stage is `role="img"` with an `aria-label` that names the product and the keys; it is focusable (`tabindex=0`) so the arrow keys and Enter work.
- Callouts are real text (`p`), readable in order after the stage; the device faces carry no text except the decorative 9px screen, which sits on near-black (#0B0C0D) at 12:1.
- Finish picker is a `fieldset` with `legend`; each radio has an `aria-label` and a 40px hit area.
- Contrast: `--ink` on `--bg` 16:1, `--ink-2` 7.6:1, `--accent-ink` on accent 12:1.
- Tab order: wordmark, four nav links, bag, three swatches (one tab stop, arrows move), Order button, stage.

## Responsive rules

- **≥1280:** as drawn.
- **1120–1280:** copy column 380px, h1 64px, left callouts pulled in to 50% − 300px and 150px wide.
- **900–1120:** same structure; callouts may sit closer to the device.
- **<900 (phone at 390):** body scrolls; the stage (540px tall) comes first, the device is nudged down 14px and scaled to 0.72 so the corner callouts never overlap it; callouts lose their leaders and sit in the four corners of the stage at 130px wide, 11px; the copy follows below. No horizontal scroll (the stage glow is inset 0 horizontally and body has `overflow-x:hidden`).

## Acceptance checklist

**Always**
- [ ] The object is six real 3D faces under `transform-style: preserve-3d` and a 1400px perspective, not a flat image with a skew.
- [ ] Each face is shaded from one light vector using its rotated normal; turning makes the side faces visibly darker.
- [ ] Rotation is a spring that settles; it stops requesting frames when settled.
- [ ] Pointer leave returns to the rest pose; whole turns from spins are kept.
- [ ] Stage is keyboard operable: Left/Right turn 20°, Enter/Space spin.
- [ ] Callouts are text, fade in staggered, and replay after a spin.
- [ ] Unchecked swatch ring at least 3:1 against the page.
- [ ] Reduced motion applies poses instantly and stops the meters.
- [ ] No horizontal scroll at 390 wide.

**This demo**
- [ ] Device box is 220 × 320 × 72px, rest pose rotateY −30°, rotateX −20°.
- [ ] Bone finish `#CFC8B8` is the default; Graphite and Signal recolour it.
- [ ] Callouts read "X/Y capsules", "Two XLR inputs", "Sunlight screen", "21 hour battery".
- [ ] Price "$449" with "Ships 14 November", button "Order Kessel One".

## Implementation notes

**Box faces.** Every face starts centred in the device box, then rotates and pushes out by half the matching dimension:

```css
.dev    { position: relative; width: 220px; height: 320px; transform-style: preserve-3d;
          transform: rotateX(var(--rx)) rotateY(var(--ry)); }
.f      { position: absolute; backface-visibility: hidden; background: var(--body); }
.front  { transform: translateZ(36px); }
.back   { transform: rotateY(180deg) translateZ(36px); }
.right  { width: 72px; left: calc(50% - 36px); transform: rotateY(90deg)  translateZ(110px); }
.left   { width: 72px; left: calc(50% - 36px); transform: rotateY(-90deg) translateZ(110px); }
.top    { height: 72px; top: calc(50% - 36px); transform: rotateX(90deg)  translateZ(160px); }
.f::after { content: ""; position: absolute; inset: 0; background: #000; opacity: var(--sh); }
```

**Lighting from normals.** Rotate each face normal by Y then X (the reverse of the CSS order) and dot it with the light:

```js
const x1 = n[0] * cy + n[2] * sy, z1 = -n[0] * sy + n[2] * cy;
const y2 = n[1] * cx - z1 * sx,   z2 = n[1] * sx + z1 * cx;
const d = Math.max(0, x1 * L[0] + y2 * L[1] + z2 * L[2]);
face.style.setProperty('--sh', (.55 - .55 * d).toFixed(3));
```

**The spring.** One integrator per axis; stop when settled:

```js
vel[a] = (vel[a] + (tgt[a] - cur[a]) * .075) * .8;
cur[a] += vel[a];
if (Math.abs(vel[a]) > .01 || Math.abs(tgt[a] - cur[a]) > .05) moving = true;
```

Common mistakes: leaving `backface-visibility` visible so the back face shows through the front; using `transition` on the transform (it cannot follow a moving target smoothly); text on the device faces that fails contrast once the face is shaded; forgetting that the perspective origin should sit above centre so the top face reads.
