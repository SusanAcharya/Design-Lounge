---
title: "Kinetic type marquee"
summary: "Three rows of 136px variable-font text scroll at different speeds and directions; hovering a row eases it to quarter speed; the middle row is outlined and the weight breathes 300–720."
platform: web
type: animation
category: text-motion
tags: [typography, marquee, variable-font, specimen, hero]
styles: [kinetic, editorial, paper]
motion: rich
difficulty: 2
featured: false
published: 2026-09-29
palette: ["#EFEBE3", "#15140F", "#D8432B", "#D4CEC2"]
fonts: ["Bricolage Grotesque"]
related: [text-scramble-reveal]
---

# Kinetic type marquee

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A full-width type specimen hero for a fictional foundry ("Tessel Type"). Three 176px-tall rows of uppercase 136px text scroll horizontally like a marquee: row one moves left at 80px/s, row two (outlined, not filled) moves right at 56px/s, row three moves left at 112px/s. Hovering or keyboard-focusing a row eases its velocity down to a quarter of its base speed, and eases back up on leave — no jump, no pause. Underneath all of that, the variable font's weight axis breathes between 300 and 720 on a 7s alternating cycle, so the text slowly thickens and thins while it moves. The detail worth copying is the velocity easing: speed is a JS-driven number that lerps toward a target each frame, which is what makes the slowdown feel physical instead of switching between two CSS animations.

## Reference behaviour

1. Initial state: header (72px) with brand and four spec facts; three rows stacked in the middle separated by 1px hairlines; footer (56px) with a hint and a caption. All three rows are already moving on first paint. Row 2 is outlined (transparent fill, 1.5px stroke).
2. Row 1 scrolls left at 80px/s. Row 2 scrolls right at 56px/s. Row 3 scrolls left at 112px/s. Each row's content repeats seamlessly: the track holds two identical copies and wraps when one copy's width has passed.
3. Weight breathes continuously: `font-variation-settings` `"wght"` goes 300 → 720 → 300 over 14s total (7s each way, `ease-in-out`, `alternate`). Each row starts at a different phase (delays 0, −2.3s, −4.6s) so they never pulse in unison.
4. Hover a row: cursor is `ew-resize`; velocity eases toward 25% of its base (80 → 20px/s) using a per-frame lerp factor of 0.06 (≈ 90% of the way in 600ms at 60fps). A small uppercase label at the row's top-right fades in over 160ms showing the base speed ("80 px/s").
5. Leave the row: velocity eases back to base with the same lerp. Nothing snaps.
6. Tab to a row (rows are `tabindex="0"`): a 2px accent rectangle inset 4px shows inside the row, the row slows exactly as on hover, and the speed label appears. Blur restores speed.
7. The separator glyphs ("·") between phrases are the only accent-coloured elements in the rows; in the outlined row they are filled accent, not stroked.
8. Resize the window: the `ResizeObserver` on each first copy updates the wrap width; because `x` is kept in `[−w, 0)` by the modulo, the track never jumps to a blank region.
9. Tab hidden then shown: `dt` is clamped to 48ms per frame, so the rows advance by at most ~5px on the first frame back instead of teleporting.
10. Web font arrives after first paint: the copy re-measures via the same `ResizeObserver`; there is no visible jump because the rows are already moving and the wrap width simply changes.
11. With `prefers-reduced-motion: reduce`: rows do not move (JS loop never starts), weight does not breathe, text sits at its resting weight (420). The layout is otherwise identical.

## Structure

```
1280 × 800
┌───────────────────────────────────────────────────────────────────┐
│ ● Tessel Type        Specimen No. 04 · Variable · wght · opsz     │ header 72
├───────────────────────────────────────────────────────────────────┤
│                                                                   │ 
│  TESSEL GROTESK · TWELVE STYLES · NOW SHIPPING · TESSEL GRO ───►  │ row 176 (filled, →left)
├───────────────────────────────────────────────────────────────────┤
│  ◄─── OPTICAL SIZES 12 & 96 · LATIN EXTENDED · CYRILLIC · OPTIC   │ row 176 (outlined, →right)
├───────────────────────────────────────────────────────────────────┤
│  WEB, APP & PRINT · FROM €48 · TRIAL FREE FOR 30 DAYS · WEB ───►  │ row 176 (filled, →left)
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│ → Hover or focus a row to slow it     Weight breathes 300 → 720   │ footer 56
└───────────────────────────────────────────────────────────────────┘
```

- `<header>` — flex row, `justify-content: space-between`, 32px side padding, 1px bottom hairline. `.brand` = 10px accent dot + name (15px/600). `.meta` = four `<span>`s, 12px, secondary colour, values in 500 weight primary colour.
- `<section class="stage" aria-label="Type specimen marquee">` — flex column, `justify-content: center`, fills remaining height.
  - Three `<div class="row" tabindex="0" data-dir data-speed aria-label>`; the second also has class `outline`.
  - Inside each: `<div class="track">` containing two `<div class="copy">` (the second `aria-hidden="true"`), and a `<span class="speed">` label absolutely positioned top-right.
  - Phrases inside `.copy` are separated by `<em>·</em>`.
- `<footer>` — flex row, space-between, 32px padding, 12px secondary text with a 16px inline SVG arrow.

Exact copy (each row's `.copy`, separators shown as `·`):

| Row | Direction | Speed   | Phrases |
|-----|-----------|--------:|---------|
| 1   | left      | 80px/s  | `Tessel Grotesk · Twelve styles · Now shipping ·` |
| 2   | right     | 56px/s  | `Optical sizes 12 & 96 · Latin Extended · Cyrillic ·` (outlined) |
| 3   | left      | 112px/s | `Web, app & print · From €48 · Trial free for 30 days ·` |

Header meta, left to right: `Specimen No. 04` · `Tessel Grotesk Variable` · `wght 200–800` · `opsz 12–96` (the bold part is the value). Footer left: "Hover or focus a row to slow it to a quarter speed"; footer right: "Weight breathes 300 → 720 every 7 s".

Each `.copy` is one flex item; two per track. The `em` separators carry `padding: 0 .22em` so the dot sits centred between phrases at every weight.

## Tokens

```css
:root {
  /* colour — warm paper, near-black ink, one red accent */
  --bg: #efebe3;        /* page */
  --bg-2: #e6e1d7;      /* reserved: pressed / secondary surface */
  --ink: #15140f;       /* text, stroke */
  --ink-2: #5f5b52;     /* meta text */
  --ink-3: #8f8a7f;     /* speed label */
  --line: #d4cec2;      /* hairlines */
  --accent: #d8432b;    /* dot, separators, focus ring */

  /* type */
  --font: "Bricolage Grotesque", system-ui, sans-serif;
  --type: 136px;        /* marquee glyph size */
  --stroke: 1.5px;      /* outline row stroke */
  --gap: .5em;          /* trailing gap after each copy */

  /* layout */
  --row-h: 176px;
  --header-h: 72px;
  --footer-h: 56px;
  --pad-x: 32px;

  /* motion */
  --t-micro: 160ms;     /* label fade */
  --t-breathe: 7s;      /* one direction of the weight cycle */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --lerp: 0.06;         /* JS: per-frame velocity easing factor */
  --slow: 0.25;         /* JS: hover speed multiplier */
}
```

## Typography

| Role          | Family              | Size  | Weight (wght axis) | Line-height | Tracking | Case      | Notes |
|---------------|---------------------|------:|-------------------:|------------:|---------:|-----------|-------|
| Marquee row   | Bricolage Grotesque | 136px | 300 ↔ 720 (animated), rest 420 | 1 | −0.03em | UPPERCASE | `"opsz" 96` |
| Outlined row  | same                | 136px | same               | 1           | −0.03em  | UPPERCASE | `color: transparent; -webkit-text-stroke: 1.5px var(--ink)` |
| Brand         | Bricolage Grotesque | 15px  | 600                | 1.4         | −0.01em  | sentence  | `"opsz" 14` |
| Header meta   | Bricolage Grotesque | 12px  | 400 / values 500   | 1.4         | +0.02em  | sentence  | |
| Speed label   | Bricolage Grotesque | 11px  | 400                | 1.4         | +0.06em  | UPPERCASE | |
| Footer        | Bricolage Grotesque | 12px  | 400                | 1.4         | 0        | sentence  | |

Load the font as a variable range: `family=Bricolage+Grotesque:opsz,wght@12..96,200..800`. Without the range syntax the weight animation will snap between static instances.

## Motion

| Element        | Trigger             | Property                       | From → To                 | Duration | Easing            | Notes |
|----------------|---------------------|--------------------------------|---------------------------|---------:|-------------------|-------|
| `.track`       | always (rAF)        | `transform: translate3d(x,0,0)`| continuous                | —        | linear per frame  | x −= dir·v·dt; wrap by copy width |
| velocity `v`   | hover/focus in/out  | JS number                      | base ↔ base×0.25          | ≈600ms to 90% | lerp 0.06/frame | never set directly; always eased |
| `.copy`        | always              | `font-variation-settings "wght"` | 300 → 720               | 7s       | `ease-in-out`, alternate, infinite | delays 0 / −2.3s / −4.6s per row |
| `.speed`       | row hover/focus     | opacity                        | 0 → 1                     | 160ms    | `--ease`          | |
| `.copy` (row 2)| always              | `-webkit-text-stroke` width | 1.5px constant        | —        | —                 | stroke width does not breathe; only the glyph outline shape changes with weight |
| `.row::after`  | focus-visible       | border                         | none → 2px accent, inset 4px | 0     | —                 | instant |

Worked timing: row 1 at 80px/s with a copy width of ~2,640px (three phrases at 136px uppercase) takes 33s for one full loop; row 3 at 112px/s loops its ~2,900px copy in ~26s; row 2 at 56px/s loops ~2,750px in ~49s. The weight breath at 7s per direction therefore never phase-locks with any loop.

Slowdown curve (lerp 0.06 at 60fps): after 10 frames velocity is 46% of the way to target, after 37 frames (≈600ms) 90%, after 75 frames 99%. Speeding back up follows the same curve.

Reduced motion: `.copy { animation: none }` and `.track { transform: none !important }`; the JS checks `matchMedia('(prefers-reduced-motion: reduce)')` and never starts the loop.

## States

- **Resting:** all rows moving, weight breathing, labels hidden.
- **Hover (row):** cursor `ew-resize`, speed eases to 25%, speed label visible.
- **Focus-visible (row):** 2px accent inset ring drawn with `::after` (so it doesn't affect layout), same slowdown and label as hover.
- **Outline row:** `color: transparent`, stroke 1.5px ink; separators keep a solid accent fill with `-webkit-text-stroke: 0`.
- **Reduced motion:** static; rows show their first copy from x = 0.

- **Touch / no hover:** rows still scroll; a tap focuses a row (via `tabindex`) and slows it until the next tap elsewhere. If that reads as sticky, gate the focus slowdown on `matchMedia('(hover: hover)')`.

There are no disabled, loading, empty or error states.

## Accessibility

- The stage is a `<section aria-label="Type specimen marquee">`. Each row has an `aria-label` describing its content and direction ("Row two, outlined, scrolling right") so screen readers get one sentence, not a repeated marquee.
- The second `.copy` in every track is `aria-hidden="true"`; the first is read normally.
- Rows are focusable (`tabindex="0"`) so keyboard users can slow them the same way pointer users do. Focus order: row 1 → row 2 → row 3. No other interactive elements.
- Motion respects `prefers-reduced-motion`. There is no pause button because reduced motion already halts everything; if your product policy requires one, add a 40px "Pause" button in the footer that toggles the rAF loop.
- Contrast: `--ink` on `--bg` is 15.6:1; `--ink-2` on `--bg` is 6.4:1; `--ink-3` (speed label, 11px) is 3.9:1 — acceptable as a non-essential decorative label; bump to `--ink-2` if it must meet AA.
- Outlined text at 1.5px stroke stays legible at 136px; do not use it below 64px.

## Responsive rules

- ≥ 1280: as specified (`--type: 136px`, `--row-h: 176px`).
- 1024–1279: `--type: 108px`, `--row-h: 144px`. Header meta drops the "opsz" fact.
- 768–1023: `--type: 84px`, `--row-h: 112px`, header padding 24px, footer shows only the hint.
- < 640: `--type: 56px`, `--row-h: 80px`, stroke 1px; base speeds halve (40 / 28 / 56 px/s) so the loop does not read as frantic on a narrow screen. Rows become non-focusable and the speed label is removed.
- Height < 640: drop the footer.

## Acceptance checklist

- [ ] Three rows, each 176px tall, separated by 1px `--line` hairlines, with 136px uppercase text at `letter-spacing: -0.03em`.
- [ ] Row directions and base speeds are left/80, right/56, left/112 px/s, measured over one second of wall-clock time.
- [ ] Each track contains exactly two copies of its phrase set; the loop wraps with no visible seam or flash.
- [ ] Hovering a row reduces its speed to 25% of base by easing (no instantaneous change); leaving restores it by easing.
- [ ] Keyboard focus on a row slows it identically and shows a 2px accent ring inset 4px.
- [ ] The middle row is outlined (`-webkit-text-stroke: 1.5px`, transparent fill) and its separators are solid accent.
- [ ] The weight axis animates between 300 and 720 over 7s per direction, with the three rows phase-offset (0, −2.3s, −4.6s).
- [ ] Font is loaded as a variable range (`wght@200..800`); the weight change is continuous, not stepped.
- [ ] The speed label ("80 px/s") fades in over 160ms on hover/focus only.
- [ ] With `prefers-reduced-motion: reduce` nothing moves and no rAF loop runs.
- [ ] No `console` errors; the piece uses a single `requestAnimationFrame` loop, not one per row.
- [ ] Second copy of every track has `aria-hidden="true"`.
- [ ] After the web font loads, the wrap width is re-measured (no visible seam at the first loop after font swap).
- [ ] Velocity reaches 90% of its target within ~600ms of hover in/out (lerp 0.06 per frame at 60fps).

## Implementation notes

**Velocity is a number you ease, not a CSS animation you swap.** Changing `animation-duration` on a running CSS animation jumps its progress; a rAF loop with a lerp does not. Clamp `dt` so a background tab doesn't teleport the track when it resumes:

```js
let last = performance.now();
function frame(now) {
  const dt = Math.min(48, now - last) / 1000; last = now;
  for (const r of rows) {
    const target = r.slow ? r.base * 0.25 : r.base;
    r.v += (target - r.v) * 0.06;            // ease toward target
    r.x -= r.dir * r.v * dt;                 // dir: 1 = left, -1 = right
    if (r.w > 0) r.x = ((r.x % r.w) + r.w) % r.w - r.w;   // keep x in [-w, 0)
    r.track.style.transform = `translate3d(${r.x.toFixed(2)}px,0,0)`;
  }
  requestAnimationFrame(frame);
}
```

**The copy width changes while the weight breathes**, so the wrap length must be re-measured. A `ResizeObserver` on the first `.copy` is cheaper than reading `offsetWidth` every frame:

```js
new ResizeObserver(() => { r.w = copy.offsetWidth; }).observe(copy);
```

Give each `.copy` `padding-right: .5em` so the seam between copies has the same gap as the separators inside a copy.

**Optional pause control.** If policy requires a visible pause in addition to reduced motion, one flag stops the loop and the breath together:

```js
let paused = false;
pauseBtn.addEventListener('click', () => {
  paused = !paused; pauseBtn.setAttribute('aria-pressed', String(paused));
  document.body.classList.toggle('paused', paused);      // .paused .copy { animation-play-state: paused }
  if (!paused) { last = performance.now(); requestAnimationFrame(frame); }
});
// in frame(): if (paused) return;   — before scheduling the next rAF
```

**Outlined row:** stroke the text, but un-stroke the accent separators, otherwise they become hollow too:

```css
.row.outline .copy { color: transparent; -webkit-text-stroke: 1.5px var(--ink); }
.row.outline .copy em { -webkit-text-stroke: 0; color: var(--accent); }
```

**Measure after the font is in.** `offsetWidth` before the web font arrives gives the fallback font's width; the `ResizeObserver` corrects it, but if you measure only once, wait for fonts:

```js
document.fonts.ready.then(() => rows.forEach(r => { r.w = r.copy.offsetWidth; }));
```

Common mistakes: using `animation-play-state: paused` on hover (a freeze, not a slowdown); wrapping with `x = x % w` without the second modulo (negative values leave a gap when direction is right); loading a static weight instead of the variable range; forgetting `white-space: nowrap` on the row so the copies stack.
