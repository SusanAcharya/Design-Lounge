<!-- Design Lounge Nº 150 · "Topographic lines background" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Topographic lines background

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A full-bleed `<canvas>` topographic map for a print-survey publisher ("Ridgeline Atlas"). Contour lines are drawn with marching squares over six drifting Gaussian hills, so the field reads as a real 1:25 000 sheet that is slowly breathing. Every fifth contour is heavier (an index line). Copy and a survey card sit in a pale elliptical scrim so the lines never fight the 112px headline. The detail worth copying: changing the contour interval (10 / 20 / 40 m) only changes the number of isolevels — the same height field is re-stroked instantly, like swapping the interval on a printed sheet.

## Reference behaviour

1. Initial state: the map is already drifting. Thin olive contours fill the frame; index contours (every 5th) are thicker and darker. A radial paper scrim sits under the left-hand copy. The 20 m interval chip is pressed.
2. Hills wander slowly (tens of pixels) so ridges slide rather than pulse. A faint sine ripple is added to the field so flats are never empty.
3. The bottom-right card ("Survey sheet 14 · Cairn Valley, north face") lists contour interval, highest point **2,814 m**, and relief **1,560 – 2,814 m**.
4. Clicking **10 m / 20 m / 40 m** sets `aria-pressed` on that chip only and redraws with 44 / 22 / 11 levels. Default is 22 (20 m).
5. **Pause drift** stops the animation loop and swaps the icon to a play triangle; label becomes "Resume drift". Click again to continue from the same phase.
6. A 14px amber ring at `right:226px; top:360px` is labelled "Cairn 2,814".
7. While the tab is hidden the loop is cancelled; it resumes on visibility without a jump.
8. Rendering is capped at 60fps. Phase `t` starts at 20 so the first frame is an interesting ridge, not a blank field.
9. With `prefers-reduced-motion: reduce`, drift starts paused (`playing = false`). Interval chips still retile. Colour transitions drop to 1ms.

## Structure

```
1280 × 800
canvas (fixed, inset 0) + radial scrim + 20px neatline with map ticks
┌────────────────────────────────────────────────────────────────────────┐
│ nav 72  [glyph] Ridgeline Atlas     Sheets  Field notes  Surveyors  Print shop │
│ padding 0 44, gap 32                                                   │
│                                                                        │
│  ALPINE SURVEY · AUTUMN 2026 EDITION          (amber, 11/600 +0.16em)  │
│  Every map begins with a                                               │
│  patient line.                         112px / .94 Newsreader          │
│  sub 17px, max 440px                                                   │
│  [Browse the sheets] [How we survey]   44px buttons                    │
│                                                                        │
│                         ○ Cairn 2,814                                  │
│                                          ┌ sheet 320px ──────────────┐ │
│                                          │ SURVEY SHEET 14           │ │
│                                          │ Cairn Valley, north face  │ │
│                                          │ Contour  [10m][20m][40m]  │ │
│                                          │ Highest  2,814 m          │ │
│                                          │ Relief   1,560 – 2,814 m  │ │
│                                          │ [ Pause drift ]           │ │
│                                          └ right 64, bottom 64 ──────┘ │
└────────────────────────────────────────────────────────────────────────┘
  neatline inset 20px; ticks sit on the rule: 46°34′N / 8°11′E / 46°29′N /
  SHEET 14 · 1:25 000 / rotated 8°02′E on the left edge
```

- `<canvas id="c" aria-hidden="true">` — fixed, full viewport, backing store `min(devicePixelRatio, 2)`.
- `.scrim` — fixed, `pointer-events:none`, radial ellipse 620×380 at 34% 50%, paper at 92% opacity in the core to 0 at the edge.
- `.neat` — 20px inset hairline (`--line-2`) with five `.tick` labels on paper chips.
- `.page` — relative flex column, padding 20px, height 100%.
- `<nav aria-label="Main">` — 72px: 26px ridge SVG + "Ridgeline Atlas" (Newsreader 20/500), four links.
- `<main class="hero">` — padding 76px 44px 0, max-width 780px: eyebrow, `<h1>` with italic `<em>patient</em>`, sub, two `.btn`.
- `.mark` — decorative cairn pip, `aria-hidden`.
- `<aside class="sheet" aria-label="Survey sheet">` — interval `role="group"`, three `<button aria-pressed>`, play `<button id="play">`.

## Tokens

```css
:root {
  /* colour — warm map paper, forest ink, one ochre accent */
  --paper: #e8e9dd;       /* page + tick chips */
  --paper-2: #f3f3ea;     /* sheet, secondary button, cairn fill */
  --ink: #1f3326;         /* headline, primary button, contours source */
  --ink-2: #4a5b4e;       /* sub, nav links, ticks, row labels */
  --ink-3: #6c7a6e;       /* sheet kicker */
  --line: rgba(31, 51, 38, .18);   /* sheet row rules */
  --line-2: rgba(31, 51, 38, .32); /* neatline, buttons, sheet border */
  --accent: #b8661a;      /* eyebrow, cairn, brand inner ridge */
  --accent-ink: #fff8ee;  /* unused on type; keep for SVG fills if needed */
  --contour-thin: rgba(31, 51, 38, .26);
  --contour-index: rgba(31, 51, 38, .5);

  /* type */
  --serif: "Newsreader", Georgia, serif;
  --sans: "Hanken Grotesk", system-ui, sans-serif;

  /* layout */
  --inset: 20px;
  --r: 4px;
  --nav-h: 72px;
  --sheet-w: 320px;
  --cell: 10px;           /* marching-squares cell */

  /* field */
  --levels-default: 22;   /* 20 m */
  --iso-span: 1.15;       /* isolevel range / levels */
  --index-every: 5;       /* heavier stroke */

  /* motion */
  --t-fast: 160ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --drift: 3.5;           /* phase units per second */
}
```

## Typography

| Role            | Family         | Size | Weight | Line-height | Tracking | Case      |
|-----------------|----------------|-----:|-------:|------------:|---------:|-----------|
| Body            | Hanken Grotesk | 15px | 400    | 1.5         | 0        | sentence  |
| Wordmark        | Newsreader     | 20px | 500    | 1           | −0.01em  | sentence  |
| Nav links       | Hanken Grotesk | 14px | 400    | 1.5         | 0        | sentence  |
| Eyebrow / sheet kicker | Hanken Grotesk | 11px / 10px | 600 | 1 | +0.16em | UPPERCASE |
| Headline        | Newsreader     | 112px| 400    | 0.94        | −0.035em | sentence  |
| Headline em     | Newsreader     | 112px| 400 italic | 0.94    | −0.035em | sentence  |
| Sub-copy        | Hanken Grotesk | 17px | 400    | 1.55        | 0        | sentence  |
| Buttons         | Hanken Grotesk | 14px | 600    | 44px h      | 0        | sentence  |
| Sheet title     | Newsreader     | 26px | 400    | 1.1         | −0.01em  | sentence  |
| Sheet rows      | Hanken Grotesk | 13px | 400/500| 1           | 0        | sentence  |
| Interval chips  | Hanken Grotesk | 12px | 500    | 28px h      | 0        | sentence  |
| Play control    | Hanken Grotesk | 12px | 500    | 36px h      | 0        | sentence  |
| Map ticks       | Hanken Grotesk | 10px | 500    | 1           | +0.08em  | mixed     |
| Cairn label     | Hanken Grotesk | 11px | 600    | 1           | +0.04em  | sentence  |

## Motion

| Element            | Trigger     | Property              | From → To                    | Duration     | Easing     | Notes |
|--------------------|-------------|-----------------------|------------------------------|--------------|------------|-------|
| Height field       | load, loop  | hill centres + sine   | continuous                   | 60fps cap    | —          | `t` += dt/1000 × 3.5, dt clamped 50ms |
| Hill centres       | per frame   | x, y                  | ±70px sin / ±50px cos        | tied to `t`  | —          | see field formula |
| Interval redraw    | chip click  | isolevel count        | 44 ↔ 22 ↔ 11                 | instant      | —          | same `v` buffer, new `step` |
| Nav / buttons      | hover       | color, border, bg     | `--ink-2` → `--ink`          | 160ms        | `--ease`   | primary hover bg `#2d4636` |
| Pause icon / label | click       | playing flag          | drift ↔ freeze               | instant      | —          | phase kept |
| All CSS            | reduced     | transition-duration   | → 1ms                        | —            | —          | loop never starts |

Height at grid node (x, y), time t (seconds × 3.5 from start offset 20):

```
hills = [
  [.80, .36, 170, 1,   .9, 0],
  [.62, .78, 210, .85, .6, 2],
  [.18, .22, 190, .7,  .7, 4],
  [.97, .92, 150, .6, 1.1, 1],
  [.36, .62, 240, .55, .5, 3],
  [.08, .88, 140, .5,  .8, 5],
]
/* each: [xFrac, yFrac, sigma, amp, w, phase] */
cx = xFrac*W + 70*sin(t*.05*w + phase)
cy = yFrac*H + 50*cos(t*.04*w + phase*1.3)
k  = 1 / (2 * sigma * sigma)
f  = 0.06 * sin(x*.004 + y*.003 + t*.03)
   + Σ amp * exp( −((x-cx)² + (y-cy)²) * k )
```

Isolevels: `step = 1.15 / levels`. Skip L ≤ 0. Stroke thin at 0.9px `--contour-thin`; every 5th at 1.5px `--contour-index`. `lineCap = round`. Grid pitch 10px.

Reduced motion: `playing` starts false; still call `resize()` + `draw()` once. Interval chips keep working.

## States

- **20 m (default):** second chip `aria-pressed="true"`, 22 levels.
- **10 m / 40 m:** 44 / 11 levels; previous chip `aria-pressed="false"`.
- **Drifting:** play button label "Pause drift", pause-bars icon, `aria-pressed="false"` (pressed means paused).
- **Paused:** "Resume drift", play-triangle path `M7 5l12 7-12 7z`, `aria-pressed="true"`.
- **Nav hover:** colour `--ink`.
- **Secondary button hover:** border `--ink`.
- **Primary hover:** background `#2d4636`.
- **Interval chip hover:** colour `--ink`. Pressed chip: background `--ink`, colour `--paper-2`.
- **Play hover:** border and colour `--ink`.
- **Focus-visible:** `outline: 2px solid var(--accent); outline-offset: 3px` on links and buttons; chips use `outline-offset: -2px`.

## Accessibility

- Canvas, neatline ticks and cairn mark are `aria-hidden="true"`.
- Nav is `<nav aria-label="Main">`. Sheet is `<aside aria-label="Survey sheet">`.
- Interval control is `role="group" aria-label="Contour interval"` with three real buttons and `aria-pressed`.
- Play is a real `<button>` with `aria-pressed` mirroring the paused state. It satisfies pause/stop/hide for the looping field.
- Tab order: brand → 4 nav links → Browse the sheets → How we survey → 10 m → 20 m → 40 m → Pause drift.
- Contrast: `--ink` on `--paper` is well above 7:1; `--ink-2` on `--paper` is ~5.5:1. Contours sit under a 92% paper scrim behind type.
- Hit targets: buttons 44px, chips 28px tall × ≥40px wide, play 36px full-width of the 320px card.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: keep the sheet at `right:32px; bottom:32px`; headline 88px.
- 768–1023: headline 64px; sheet width 280px; hide the cairn mark if it collides with type.
- < 640: stack the sheet under the hero (static, not absolute); headline 44px; nav links wrap or hide behind the brand. Recompute the height field on resize; cell size stays 10px.
- Cap backing store at DPR 2 on every size.

## Acceptance checklist

- [ ] Contours are marching-squares polylines on a 10px grid, not SVG decoration or a bitmap.
- [ ] Default interval is 20 m (22 levels); 10 m draws 44 levels and 40 m draws 11, instantly.
- [ ] Every 5th contour is 1.5px at 50% ink; others 0.9px at 26% ink.
- [ ] Drift is visible on the first frame (phase starts at 20, not 0).
- [ ] Pause freeze the field in place and relabels to "Resume drift"; Resume continues from the same phase.
- [ ] Hidden tabs cancel `requestAnimationFrame`; returning does not jump.
- [ ] Frame rate never exceeds 60fps; dt is clamped to 50ms.
- [ ] Reduced motion loads paused, with a fully drawn static map.
- [ ] Card copy matches: Cairn Valley, 2,814 m, relief 1,560 – 2,814 m, Sheet 14.
- [ ] Focus rings are 2px ochre on every control.
- [ ] Canvas stays sharp on retina (transform scaled by DPR, max 2).
- [ ] Neatline ticks read 46°34′N, 8°11′E, 46°29′N, SHEET 14 · 1:25 000, 8°02′E.

## Implementation notes

**Marching squares lookup** — 16 cases as two-letter edge pairs (`T` top, `R` right, `B` bottom, `L` left). Interpolate along the edge by `(L − va) / (vb − va)`:

```js
const SEG = ['','LB','BR','LR','TR','TRLB','TB','TL','TL','TB','TLBR','TR','LR','RB','LB',''];
const code = (a>L)<<3 | (b>L)<<2 | (c>L)<<1 | (d>L);
const s = SEG[code]; if (!s) continue;
```

**One Path2D for thin, one for index**, stroke once per frame — do not `stroke()` per cell:

```js
const thin = new Path2D(), idx = new Path2D();
// path = (k % 5 === 0) ? idx : thin
ctx.strokeStyle = 'rgba(31,51,38,.26)'; ctx.lineWidth = .9; ctx.stroke(thin);
ctx.strokeStyle = 'rgba(31,51,38,.5)';  ctx.lineWidth = 1.5; ctx.stroke(idx);
```

**Frame cap, visibility, start offset:**

```js
let t = 20, last = 0, raf = 0, playing = !reduce;
function frame(now) {
  raf = requestAnimationFrame(frame);
  const dt = now - last; if (dt < 1000/60 - 1) return;
  last = now; t += Math.min(dt, 50) / 1000 * 3.5; draw();
}
document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
```

Common mistakes: drawing contours as concentric CSS circles (they will not branch or saddle); rebuilding the canvas CSS size without `setTransform(d,0,0,d,0,0)` (blurry lines); starting `t` at 0 (a nearly empty first frame); filling the canvas instead of stroking (the piece is lines on paper, not shaded relief); putting pointer-events on the canvas so the interval chips never receive clicks (canvas is behind `.page`).

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
