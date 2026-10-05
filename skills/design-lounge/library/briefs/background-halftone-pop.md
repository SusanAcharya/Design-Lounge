<!-- Design Lounge Nº 263 · "Halftone pop background" · www.designlounge.live -->

# Halftone pop background

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A full-frame halftone screen drawn on one `<canvas>`, shown here behind the hero of "Inkpot Fest", a two-day zine and comics fair. Dots sit on a grid rotated 45° (the classic screen angle) and their radius encodes a tone that is the sum of a slow travelling band, a drifting radial bloom and a soft swell under the pointer, so the field looks like a printed gradient that is alive. Only two inks are ever on screen: a paper colour and a dot colour, with black for type. The copy sits in cream caption boxes with 2–3px black borders and hard offset shadows, which keeps it legible over any dot density. The detail worth copying is area-true dots: radius is `maxR × √tone`, so the printed coverage tracks the tone the way a real halftone does.

## Structure

```
1280 × 800   canvas fixed inset 0 · .page on top (pointer-events: none except links/buttons)
┌──────────────────────────────────────────────────────────────────────┐
│ [⚱ Inkpot Fest]  boxed wordmark          [Exhibitors][Workshops][Map] │
│  ·  ·  ·  ·  .  .  •  •  •  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●   │
│ ▌SAT 14 – SUN 15 NOV · OLD TRAM DEPOT▐  black tag, rotated −2°        │
│ ┌──────────────────────────┐                                          │
│ │ Print is loud            │  128px caption box, 3px border           │
│ ├──────────┐───────────────┘                                          │
│ │ again.   │                                                          │
│ └──────────┘                                     ●●●● bloom ●●●●       │
│ ┌ two days, 140 tables… ┐ mono 16px, 2px border, 4px shadow            │
│ ■ Get a weekend pass £18 ■  56px, 6px dot-colour shadow  ┌ Screen (II)┐│
│                                                          │ Pitch  14px ││
│                                                          │ Speed  1.0× ││
│                                                          │ Inks ◩ ◩ ◩  ││
└──────────────────────────────────────────────────────────┴────────────┘┘
padding 48px; panel 24px from right and bottom
```

- `<canvas aria-hidden="true">` fixed, backing store `innerWidth × innerHeight × min(dpr, 2)`.
- `.page` flex column, `pointer-events: none`; `a` and `button` re-enable it so the canvas sees every `pointermove`.
- `<nav aria-label="Main">`: boxed wordmark with a 22px ink-pot glyph, three boxed links.
- `<main class="hero">`: `p.tag`, `h1 > span` (caption boxes via `box-decoration-break: clone`) with one `<em>`, `p.sub`, `a.btn` with a `<small>` price.
- `<form class="ctl" aria-label="Halftone controls">`: header, two range rows, `<fieldset>` of three radio swatches with `aria-label`s, hint.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|---|
| Dot field | rAF (60fps cap) | per-dot radius | tone 0 → 1 | continuous, `t += dt·speed` | sine terms | one frame |
| Pointer swell | pointermove | swell centre, strength | eased toward pointer; 0 ↔ 1 | ~0.4s settle | exponential | jumps, single redraw |
| Links | hover | transform, box-shadow | 0 → (−2px, −2px) + 4px shadow | 160ms | `--ease` | 1ms |
| Button | hover / active | transform, shadow | lift to 8px shadow / press to 2px | 160ms | `--ease` | 1ms |
| Swatch | checked | transform, shadow | lifts 2px, 3px shadow | 160ms | `--ease` | 1ms |

Tone at a dot (x, y), time t, viewport W × H:

```
a  = 0.6 + 0.35·sin(0.07t)                        band direction
g  = 0.5 + 0.5·sin((x·cos a + y·sin a)·0.004 − 0.5t)
bx = W(0.7 + 0.18 sin 0.13t),  by = H(0.5 + 0.3 cos 0.11t),  R = 0.55·max(W,H)
g  = 0.55g + 0.6·exp(−((x−bx)² + (y−by)²)/R²)
g += s·0.9·exp(−((x−px)² + (y−py)²)/(2σ²)),  σ = 170 + 4·pitch
g *= 0.25 + 0.75·min(1, x / 0.55W)               lighter under the copy
r  = 0.51·pitch·√min(1, g)    skip if g < 0.04
```

## States

- **Playing:** pause bars, `aria-pressed="false"`, "Pause background".
- **Paused:** play triangle, `aria-pressed="true"`, "Play background"; pointer still repaints.
- **Swatch selected:** lifted 2px with a 3px ink shadow; radios are visually hidden over the swatch.
- **Link / button hover:** lift with hard shadow; **active:** button presses down 4px and its shadow shrinks to 2px.
- **Focus-visible:** `outline: 3px solid var(--ink); outline-offset: 3px` on links, buttons, ranges, and swatches.
- **Pointer outside window:** swell fades to 0.
- **Hidden tab:** loop cancelled.

## Accessibility

- Canvas is decorative (`aria-hidden="true"`).
- Copy never sits on bare dots: every text run is in a cream box with an ink border. Body text on `#FFFAF0` is 18:1; tag text `#FFE14A` on ink is 14:1; in cobalt, `#FFC9D2` on ink is 13:1.
- Inks are a radio group in a `<fieldset>` with legend "Inks"; each radio has an `aria-label` naming both colours ("Cherry on lemon"). Arrow keys switch.
- Sliders are native ranges with `<label for>` and an `<output>` readout.
- Pause button meets WCAG 2.2.2; pointer swell is decoration and needs no keyboard equivalent.
- Tab order: wordmark → 3 links → Get a weekend pass → pause → Pitch → Speed → inks.
- Hit targets: swatches 40px, pause 36px (raise to 40px on touch layouts), button 56px.

## Responsive rules

- ≥ 1280: as specified; pitch stays in CSS px at every size (do not scale dots with width).
- 1024–1279: headline 104px.
- 768–1023: headline 88px; nav links stay.
- < 760: links hide, padding 16px, headline 62px with 2px box borders and 8px inline padding, sub 14px; panel spans the bottom (12px insets) and the hint hides.
- Backing store capped at DPR 2. At pitch 10 on a 1920 × 1080 screen the field is ~20k dots in one path; that is the upper bound, keep pitch ≥ 10.

## Acceptance checklist

### Always

- [ ] One canvas, one `beginPath()` and one `fill()` per frame; every dot is a `moveTo + arc` sub-path.
- [ ] Dot grid is rotated 45°; dots just touch at full tone (r = 0.51 × pitch).
- [ ] Radius is `√tone`, not linear.
- [ ] Exactly two inks in the field; copy sits in bordered boxes, never on raw dots.
- [ ] Pointer swell eases in and fades out on leave.
- [ ] Loop capped at 60fps, `dt` clamped to 50ms, cancelled while hidden.
- [ ] Reduced motion: static frame, starts paused.
- [ ] Inks are a radio group with accessible names; sliders show their values.
- [ ] Every control has a 3px focus ring.

### This demo

- [ ] Opens in Cherry on lemon: `#FFE14A` paper, `#E8302A` dots.
- [ ] Presets Cobalt on blush (`#FFC9D2`/`#1F3FBF`) and Black on mint (`#8FF0C8`/`#141010`).
- [ ] Pitch default 14px (10–24), Speed default 1.0× (0–2).
- [ ] Headline "Print is *loud* again." at 128px Bricolage Grotesque 800 in caption boxes.
- [ ] Button "Get a weekend pass £18" with a 6px dot-colour shadow (cream in the mint preset).

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state (Cherry on lemon): paper `#FFE14A`, dots `#E8302A`. The left third has tiny dots; density rises to full coverage toward the right, with a darker bloom drifting around the right half.
2. The field animates continuously: the travelling band moves along a direction that itself rotates slowly (±0.35 rad around 0.6 rad), and the bloom centre drifts on a slow ellipse (x 52–88% of width, y 20–80% of height).
3. Moving the pointer anywhere swells dots in a soft circle (Gaussian, σ = 170 + 4 × pitch px). The swell centre eases toward the pointer (`k ≈ 1 − 0.001^dt`, ×1.6 for position) and fades out when the pointer leaves the window.
4. Panel (bottom-right, 256px): title "Screen", a 36px square pause button, Pitch slider (10–24px, default 14), Speed slider (0–2×, default 1.0×), three ink swatches (40px squares split diagonally), and the hint "Move the pointer to swell the dots."
5. Pitch changes the grid spacing live; maximum dot radius is always `pitch × 0.51`, so dots just touch at full tone.
6. Inks: Cherry on lemon (`#FFE14A` / `#E8302A`), Cobalt on blush (`#FFC9D2` / `#1F3FBF`), Black on mint (`#8FF0C8` / `#141010`). Switching repaints paper, dots, the accent word, the button shadow and slider thumbs immediately.
7. Pause stops the loop; the pointer still repaints a single frame with the swell under it.
8. Hidden tab cancels the loop; it resumes in phase.
9. `prefers-reduced-motion: reduce`: one static frame, loop never starts, button starts as "Play background". Pointer moves still redraw a single frame (user-driven, no easing).

## Tokens

```css
:root {
  --paper: #ffe14a;       /* canvas background, tag text, pause button fill */
  --dot: #e8302a;         /* halftone ink, accent word, button shadow, thumbs */
  --ink: #141010;         /* type, borders, hard shadows */
  --card: #fffaf0;        /* caption boxes, panel */
  --hint: #3a3330;
  --display: "Bricolage Grotesque", system-ui, sans-serif;
  --mono: "Courier Prime", ui-monospace, monospace;
  --fs-display: 128px;
  --fs-btn: 18px;
  --fs-body: 16px;
  --fs-tag: 13px;
  --pad: 48px;
  --border-heavy: 3px;    /* headline boxes */
  --border: 2px;          /* everything else */
  --shadow: 4px 4px 0 var(--ink);
  --shadow-btn: 6px 6px 0 var(--dot);
  --ease: cubic-bezier(.2,.7,.2,1);
  --t: 160ms;
  /* field */
  --pitch: 14px;          /* 10–24 */
  --screen-angle: 45deg;
  --max-r: calc(var(--pitch) * .51);
}
[data-palette="cobalt"] { --paper: #ffc9d2; --dot: #1f3fbf; }
[data-palette="mint"]   { --paper: #8ff0c8; --dot: #141010; --pop: #fffaf0; }  /* button shadow uses --pop */
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Headline | Bricolage Grotesque (opsz 96) | 128px | 800 | 0.9 | −0.045em | sentence |
| Wordmark | Bricolage Grotesque | 22px | 800 | 1 | −0.02em | Title |
| Button | Bricolage Grotesque | 18px | 800 | 1 | −0.01em | sentence |
| Panel title | Bricolage Grotesque | 16px | 800 | 1 | −0.01em | Title |
| Body / sub | Courier Prime | 16px | 400 | 1.5 | 0 | sentence |
| Tag | Courier Prime | 13px | 700 | 1 | +0.06em | UPPERCASE |
| Nav links | Courier Prime | 14px | 700 | 1 | 0 | Title |
| Readouts | Courier Prime | 13px | 700 | 1 | 0 | tabular |

## Implementation notes

**Rotated grid, single path.** Walk a square grid in rotated (u, v) space and project; cull off-screen points:

```js
ctx.clearRect(0, 0, W, H); ctx.fillStyle = dot; ctx.beginPath();
const c = Math.SQRT1_2, ext = Math.hypot(W, H);
for (let v = -ext; v < ext; v += P) for (let u = -ext; u < ext; u += P) {
  const x = W / 2 + (u - v) * c, y = H / 2 + (u + v) * c;
  if (x < -P || x > W + P || y < -P || y > H + P) continue;
  const g = tone(x, y);                 // formula above
  if (g < .04) continue;
  const r = P * .51 * Math.sqrt(Math.min(1, g));
  ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, 6.2832);
}
ctx.fill();
```

**Caption boxes that wrap.** One inline `span` gets the border and background; `box-decoration-break: clone` repeats them on every line:

```css
h1 span { background: var(--card); border: 3px solid var(--ink); padding: 0 14px; line-height: 1.04;
  -webkit-box-decoration-break: clone; box-decoration-break: clone; }
```

**Palette swap without hard-coding twice.** Keep the inks in CSS; read the dot colour back for the canvas:

```js
document.body.dataset.palette = value;
dot = getComputedStyle(document.body).getPropertyValue('--dot').trim();
if (!raf) draw();
```

Common mistakes:

- A `fillStyle` change or `fill()` per dot: 5,000 draw calls per frame.
- Linear radius: mid tones look far too dark.
- Axis-aligned grid: reads as a polka-dot wallpaper, not print.
- Forgetting `pointer-events: none` on the page layer, so the canvas never gets pointer moves over the copy area.
- A third colour sneaking in (gradient on dots, tinted shadows). Two inks plus black type.
- Blurry dots on retina because only the CSS size was set.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
