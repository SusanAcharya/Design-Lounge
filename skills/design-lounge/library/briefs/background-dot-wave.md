<!-- Design Lounge Nº 108 · "Dot wave background" · designlounge.vercel.app -->

# Dot wave background

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A full-bleed `<canvas>` background for a dark infrastructure-product hero ("Tidewater"). Dots sit on a strict 24px grid; a slow diagonal sine wave rolls across them, and each dot's radius, opacity and vertical offset follow the wave height, so the field reads like swell seen from above. The detail worth copying is the **quiet zone**: an elliptical mask centred on the headline drops dot opacity to 30% behind the copy, so the motion lives in the empty right half and never competes with the 96px headline. Clicking empty space sends a single ring-shaped ripple out from the pointer.

## Reference behaviour

1. Initial state: the page is already animating. A bright diagonal crest crosses the right half of the frame; dots at the very top of the crest are tinted mint `#8FE3B9`, the rest are pale `#CFE0D6`.
2. The wave travels continuously from lower-right to upper-left at a calm pace (one full crest passes any point every ~10.5s).
3. Behind the headline, sub-copy and buttons the dots are dimmed to 30% of their normal opacity, fading back to 100% by the edge of a 1040 × 480 ellipse centred at (400, 340).
4. Click (pointerdown) anywhere that isn't a link or button: a ring ripple expands from that point at 160px/s, decays over ~6s, and stacks with the base wave. At most 4 ripples are alive; the oldest is dropped.
5. The round 40px button at the top-right (next to the hint "Click the field to send a ripple") pauses and resumes the field. Its icon swaps between pause bars and a play triangle; `aria-pressed` and `aria-label` follow.
6. While the tab is hidden the animation loop is cancelled; it resumes from the same phase when visible (no jump).
7. Rendering is capped at 60fps even on 120Hz displays.
8. With `prefers-reduced-motion: reduce` the field draws a single static frame and the button starts in the "Play background" state. Ripples still draw one static ring if clicked.
9. Nav links, sign-in and buttons have hover colour shifts (160ms) and 2px mint focus rings.

## Structure

```
1280 × 800  (canvas: position fixed, inset 0, behind everything)
┌────────────────────────────────────────────────────────────────────────┐
│ nav 72  ~ Tidewater   Product Docs Pricing Changelog   Sign in [Book a demo] │
├────────────────────────────────────────────────────────────────────────┤
│                                            hint text  (⏸ 40px)  top 98 │
│  [4.2] Adaptive autoscaling…          pill 30px, top 96 padding        │
│                                                         · · ·  ·  ·    │
│  Infrastructure that                     96px / .98    ·  · crest · ·  │
│  listens before it                                    · · · · · ·      │
│  scales.                                            · · · · ·          │
│  sub 18px, max 500px                             · · · · ·             │
│  [Start free →] [Read the 4.2 notes]                                   │
├──────────────┬──────────────┬──────────────┬───────────────────────────┤
│ P50 COLD START│ REGIONS      │ UPTIME, 12 MO │ TEAMS ON TIDEWATER       │
│ 38 ms         │ 23           │ 99.995 %      │ 4,100 +                  │
└──────────────┴──────────────┴──────────────┴───────────────────────────┘
  side padding 64px; stats strip has a top hairline and a dark gradient backing
```

- `<canvas aria-hidden="true">` fixed full-viewport, sized to `innerWidth × innerHeight × min(devicePixelRatio, 2)`.
- `.page` is a flex column on top with `pointer-events:none`; only `a` and `button` re-enable pointer events, so clicks on empty space reach the window handler.
- `<nav aria-label="Main">`: brand (24px wave glyph + wordmark), four links, sign-in link, outlined button.
- `<main class="hero">`: pill, `<h1>` with one `<em>` word in accent, `<p class="sub">`, two buttons.
- `<dl class="stats">`: 4 equal columns, each `<div><dt><dd>`; units in a `<small>`.
- `.ctl`: hint `<span>` + `<button aria-pressed>`.

## Tokens

```css
:root {
  /* colour — near-black with a green bias, one mint accent */
  --bg: #0a0c0b;          /* page */
  --ink: #eef2ef;         /* headline, stat values */
  --ink-2: #9aa39e;       /* sub-copy, nav links, hint */
  --ink-3: #6b746f;       /* mono labels, units */
  --line: #1e2422;        /* hairlines */
  --line-2: #2b3330;      /* button borders */
  --dot: #cfe0d6;         /* base dot colour */
  --accent: #8fe3b9;      /* crest dots, em word, primary button, focus */
  --accent-ink: #06140d;  /* text on accent */
  --scrim: rgba(10, 12, 11, .7);  /* backing behind pill, hint, outline buttons */

  /* type */
  --font: "Geist", system-ui, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;
  --fs-display: 96px;
  --fs-stat: 26px;
  --fs-sub: 18px;
  --fs-body: 14px;
  --fs-label: 11px;

  /* layout */
  --grid: 24px;           /* dot pitch */
  --pad-x: 64px;
  --nav-h: 72px;
  --r: 10px;              /* buttons */
  --r-pill: 999px;

  /* field */
  --dot-r-min: .6px;
  --dot-r-max: 2.7px;
  --dot-lift: 8px;        /* max vertical displacement */
  --quiet-floor: .3;      /* opacity multiplier at the centre of the quiet zone */

  /* motion */
  --t-fast: 160ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --fps-cap: 60;
}
```

## Typography

| Role          | Family     | Size | Weight | Line-height | Tracking | Case      |
|---------------|------------|-----:|-------:|------------:|---------:|-----------|
| Headline      | Geist      | 96px | 500    | 0.98        | −0.045em | sentence  |
| Sub-copy      | Geist      | 18px | 400    | 1.55        | 0        | sentence  |
| Nav / buttons | Geist      | 14px | 400/500| 1.5         | 0        | sentence  |
| Wordmark      | Geist      | 16px | 600    | 1           | −0.01em  | sentence  |
| Stat value    | Geist      | 26px | 500    | 1.2         | −0.03em  | numerals  |
| Stat label    | Geist Mono | 11px | 500    | 1.3         | +0.1em   | UPPERCASE |
| Pill / hint   | Geist Mono | 12px | 500/400| 1           | 0        | sentence  |
| Units         | Geist Mono | 13px | 400    | 1           | 0        | lowercase |

## Motion

| Element         | Trigger        | Property                         | From → To                         | Duration      | Easing | Notes |
|-----------------|----------------|----------------------------------|-----------------------------------|---------------|--------|-------|
| Dot field       | load, loop     | radius, alpha, y offset per dot  | wave height h ∈ [−1.35, 1.35]     | continuous    | sine   | `t` advances in seconds, capped 50ms per frame |
| Ripple          | pointerdown    | added wave term                  | amplitude 1.4 → 0                 | ~6s lifetime  | exp decay `e^(−0.7·age)` | ring front moves 160px/s, width ~60px |
| Pause button    | click          | loop running                     | playing ↔ paused                  | instant       | —      | phase preserved |
| Links / buttons | hover          | color, border-color, background  | `--ink-2` → `--ink`               | 160ms         | `--ease` | |

Wave function per dot at grid position (x, y), time t:

```
h = sin(0.012x + 0.006y − 0.6t) · (0.7 + 0.3·cos(0.01y + 0.3t))
  + 0.35 · sin(0.005x − 0.009y + 0.4t)
n = clamp((h + 1.35) / 2.7, 0, 1)
alpha  = (0.08 + 0.82·n²) · mask
radius = 0.6 + 2.1·n
drawY  = y + 8·h
colour = n > 0.8 && mask > 0.9 ? accent : dot
```

Reduced motion: draw one frame at t = 1, never start the loop; buttons' colour transitions drop to 1ms.

## States

- **Playing (default):** pause icon (two 4 × 14 bars), `aria-pressed="false"`, label "Pause background".
- **Paused:** play triangle, `aria-pressed="true"`, label "Play background". Ripples still render as a single frame.
- **Hidden tab:** loop cancelled via `visibilitychange`; nothing draws.
- **Link hover:** `--ink-2` → `--ink`.
- **Outline button hover:** border `--line-2` → `--ink-3`.
- **Primary hover:** background `#8fe3b9` → `#a9ecc9`.
- **Focus-visible:** `outline: 2px solid var(--accent); outline-offset: 3px` on every link and button.

## Accessibility

- The canvas is decorative: `aria-hidden="true"`, no role.
- The pause button is a real `<button>` (40 × 40px), with `aria-pressed` and an `aria-label` that names the action. It satisfies WCAG 2.2.2 (pause, stop, hide) for the looping motion.
- Ripples are a pointer-only flourish; no keyboard equivalent is required because nothing depends on them.
- Tab order: brand → 4 links → Sign in → Book a demo → Start free → Read the notes → pause button.
- Contrast: `--ink-2` on `--bg` is 7.4:1; `--ink-3` (5.0:1) is used only for 11px+ mono labels. The quiet zone keeps dot alpha ≤ 0.27 behind text, so headline contrast never drops below 14:1.
- Respect `prefers-reduced-motion` as described above.

## Responsive rules

- ≥ 1280: as specified. The grid is recomputed on resize, so the dot pitch stays 24px at every width.
- 1024–1279: headline 80px; the quiet ellipse shifts to centre (x = 34% of width).
- 768–1023: headline 64px, stats become 2 × 2; the hint text hides, the pause button stays.
- < 640: headline 44px, nav links collapse behind a menu button; quiet zone becomes a full-width band from 20% to 75% of height with floor 0.25. Keep the grid at 24px; do not scale the dots up.
- Cap the backing store at `devicePixelRatio` 2 on every size.

## Acceptance checklist

- [ ] Dots sit on an exact 24px grid starting at 12px from the top-left.
- [ ] A crest is visible on the right half of the very first frame.
- [ ] Dots behind the headline render at ≤ 30% of their normal opacity.
- [ ] Crest dots (n > 0.8, outside the quiet zone) are mint `#8FE3B9`; all others `#CFE0D6`.
- [ ] Clicking empty space sends a ring ripple; clicking a link or button does not.
- [ ] No more than 4 ripples exist at once; each is gone after 6s.
- [ ] Frame rate never exceeds 60fps on a 120Hz display.
- [ ] Switching tabs cancels `requestAnimationFrame`; returning resumes without a visible jump.
- [ ] The pause button toggles `aria-pressed` and its label, and the field freezes in place.
- [ ] Reduced motion renders a still frame and starts in the paused state.
- [ ] Every interactive element shows a 2px mint focus ring.
- [ ] Canvas stays sharp on retina (backing store scaled by DPR, max 2).

## Implementation notes

**Frame cap and visibility pause.** Keep one rAF handle, skip frames that arrive early, and advance time by the real delta (clamped) so pausing never jumps:

```js
let t = 1, last = 0, raf = 0, playing = !reduce;
function frame(now) {
  raf = requestAnimationFrame(frame);
  const dt = now - last;
  if (dt < 1000 / 60 - 1) return;   // 60fps cap
  last = now;
  t += Math.min(dt, 50) / 1000;
  draw();
}
function start() { if (!raf && playing && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } }
function stop()  { cancelAnimationFrame(raf); raf = 0; }
document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
```

**Precompute the quiet-zone mask once per resize**, not per frame. Store dots as a flat array `[x, y, mask, …]`:

```js
for (let y = 12; y < H; y += 24) for (let x = 12; x < W; x += 24) {
  const qx = (x - 400) / 520, qy = (y - 340) / 240;
  const q = Math.min(1, Math.hypot(qx, qy));
  dots.push(x, y, 0.3 + 0.7 * q * q);
}
```

**Ripple term**, added to `h` for each live ripple (age `a` in seconds, distance `d` in px):

```js
h += 1.4 * Math.exp(-a * 0.7) * Math.exp(-Math.abs(d - a * 160) / 60) * Math.sin(d * 0.06 - a * 5);
```

Common mistakes: letting the page layer swallow clicks (set `pointer-events:none` on the wrapper and re-enable on controls); scaling the canvas with CSS but not the backing store (blurry dots); using `Date.now()` deltas without a clamp, so a long hidden period produces a huge phase jump; drawing 2,000 dots with a new `fillStyle` string built per dot (reuse two constant strings).

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
