<!-- Design Lounge Nº 130 · "Motion designer showreel index" · designlounge.vercel.app -->

# Motion designer showreel index

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The showreel home of a fictional motion director, Asha V. The page is near-black with one acid pink. A 118px italic Syne wordmark sits above a vertical stack of four cases. Only one case is open at a time. Opening a case is a height morph from 88px to 328px over 420ms (`cubic-bezier(.32, .72, 0, 1)`), shared-element-ish: the header row does not jump, the body fades in 80ms late, and a 320×200 motion still plays on the right. The stills are CSS and SVG, not video. The first case starts open so the first frame already has motion.

## Reference behaviour

1. Initial state: case 01 "Pulse" is `aria-expanded="true"`, height 328px, panel fill `--panel`. Its still (three expanding rings around a 10px acid dot) is playing. Cases 02–04 are 88px, transparent, headers only.
2. Click any closed header: that case expands to 328px; the previously open case contracts to 88px on the same 420ms clock. Only one case may be open.
3. Clicking the already-open case does not collapse it to an empty reel. The open case stays open (always one expanded).
4. The plus icon in the header rotates 45° to a multiply over the same 420ms when that case is open.
5. The open case's index number is `--acid`; closed numbers are `--ink-2`.
6. Body copy and still are `opacity: 0` and `translateY(8px)` when closed. When open they go to 1 / 0 over 240ms with an 80ms delay, so type does not appear while the box is still short.
7. Keyboard: each header is a `<button>`. Tab moves 01→02→03→04. Enter / Space toggles via the button. Focus ring is 2px acid, 3px offset.
8. Reduced motion: height change is 1ms; all still animations stop and freeze on a readable frame (rings visible at scale 2, type unblurred, streaks static, orbit stopped).

## Structure

```
1280 × 800
┌────────────────────────────────────────────────────────────────────────┐
│ Asha V.                                      SHOWREEL  ABOUT  BOOK     │ 52
├────────────────────────────────────────────────────────────────────────┤
│ Asha V.   (118px italic 800, V. in acid)     Motion direction for…     │ ~160
├────────────────────────────────────────────────────────────────────────┤
│ 01  Pulse           Brand film · 0:32     2026    +                    │ 88
│     copy 42ch                                      ┌─────────────────┐ │
│     [Direction][Edit][Sound]                       │ pulse still 200 │ │ 328 open
│                                                    └─────────────────┘ │
│ 02  Afterimage      Type titles · 0:18    2025    +                    │ 88
│ 03  Night Bus       Main titles · 0:41    2025    +                    │ 88
│ 04  Kernel          Product loop · 0:08   2023    +                    │ 88
└────────────────────────────────────────────────────────────────────────┘
  pad 48px. Header row: 72 / 1fr / 180 / 120 / 40. Body: 72 / 1fr / 320.
```

- `<nav aria-label="Primary">` — 52px, wordmark 16px Syne 700, three uppercase links. Current route has a 2px acid underline (`box-shadow: inset 0 -2px 0`).
- `<header class="mast">` — flex, name left, 14px lede (28ch) right, aligned to the baseline of the wordmark.
- `<section class="reel" aria-label="Showreel">` — four `<article class="case">`.
  - `<button class="head">` 88px: number, title, meta, year, plus.
  - `.body` grid: spacer + copy/tags + `.still`.

## Tokens

```css
:root {
  --bg: #0b0b10;          /* page */
  --panel: #12121a;       /* open case fill */
  --ink: #f3f0ea;         /* primary text */
  --ink-2: #8b8896;       /* meta */
  --line: #23232e;        /* 1px rules */
  --acid: #ff4ec0;        /* the one accent — not amber, not lime */
  --acid-ink: #1a0012;    /* unused on text; reserved if a chip fills */

  --display: "Syne", system-ui, sans-serif;
  --sans: "Manrope", system-ui, sans-serif;

  --pad: 48px;
  --nav: 52px;
  --closed: 88px;
  --open: 328px;

  --t: 180ms;
  --t-morph: 420ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ios: cubic-bezier(.32, .72, 0, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Wordmark | Syne italic | 118px | 800 | 0.80 | −0.05em | title |
| Case title | Syne | 28px | 700 | 1 | −0.03em | title |
| Index number | Syne | 18px | 700 | 1 | 0 | tabular |
| Nav | Manrope | 12px | 500 | 1 | +0.08em | UPPERCASE |
| Body / lede | Manrope | 14px | 400 | 1.45 | 0 | sentence |
| Meta / year | Manrope | 12–13px | 400–600 | 1 | +0.04em | sentence |
| Tags | Manrope | 11px | 400 | 1 | +0.08em | UPPERCASE |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Notes |
|---------|---------|----------|-----------|---------:|--------|-------|
| `.case` | click | height | 88px ↔ 328px | 420ms | `--ios` | both cases on the same clock |
| `.chev svg` | expanded | rotate | 0 → 45° | 420ms | `--ios` | |
| `.body` | expanded | opacity, y | 0, 8px → 1, 0 | 240ms | `--ease` | delay 80ms |
| Pulse rings | loop | scale, opacity | 0.4, 0.9 → 5.2, 0 | 2400ms | `--ease` | 3 rings, 600ms stagger |
| Afterimage type | loop | x, blur | −12px, 0 → 12px, 1.2px | 2800ms | `--ios` | ping-pong via 0/50/100 |
| Night Bus streaks | loop | translateX | 0 → 220% | 1500–2400ms | linear | 4 bars, varied width |
| Kernel orbit | loop | rotate | 0 → 360° | 8000ms | linear | dots on a 120px ring |

Reduced motion: height 1ms; still keyframes `animation: none` and a frozen fallback frame.

## States

- **Closed case:** height 88px, transparent, number `--ink-2`, plus at 0°.
- **Open case:** height 328px, `--panel` fill, number `--acid`, plus at 45°, body visible.
- **Header hover:** no colour shift; the cursor is pointer. Do not invert the row.
- **Nav current:** acid 2px inset underline. Nav hover: `--ink`.
- **Focus-visible:** 2px `--acid`, 3px offset.
- **Tags:** 1px `--line` border, 4×8 padding, no fill.

## Accessibility

- Each case header is a `<button>` with `aria-expanded` and `aria-controls` pointing at the body id.
- The article also carries `aria-expanded` for CSS hooks; keep both in sync in JS.
- Stills are `aria-hidden="true"`; the paragraph describes the piece.
- Do not trap focus inside an open case. Tab continues to the next header.
- Contrast: `--ink` on `--bg` > 14:1; `--ink-2` `#8B8896` on `#0B0B10` ≈ 5.6:1; acid `#FF4EC0` on `#0B0B10` ≈ 6.4:1.
- Hit target: the entire 88px header row is the button.

## Responsive rules

- ≥ 1280: as specified.
- 900–1279: wordmark 88px if needed to stay one line; still stays 320px.
- < 900: `--open: 420px` so the still can stack. Header columns collapse to `48px 1fr 40px`; hide meta and year. Body becomes one column; still full width, 200px tall.
- < 640: wordmark 72px; side padding 20px.

## Acceptance checklist

- [ ] Wordmark is 118px Syne italic 800; the "V." is `#FF4EC0`.
- [ ] Exactly four cases; only one `aria-expanded="true"` at a time.
- [ ] Closed height 88px, open height 328px, morph 420ms `cubic-bezier(.32,.72,0,1)`.
- [ ] Case 01 is open on first paint (hero state).
- [ ] Open case fill is `#12121A`; closed cases stay transparent.
- [ ] Body fades in over 240ms after an 80ms delay; it is not visible while closed.
- [ ] Each open case shows a 320×200 still with a distinct CSS/SVG loop.
- [ ] Accent is `#FF4EC0` only — no amber, no lime, no second accent.
- [ ] Plus rotates 45° on the open row.
- [ ] Keyboard: Tab + Enter/Space opens a case; focus ring is visible.
- [ ] `prefers-reduced-motion: reduce` freezes stills and makes the height change instant.
- [ ] No `<video>`, no raster, no emoji, no placeholder copy.

## Implementation notes

**Animate `height` between two known values**, not `auto`. Known values let both the opening and closing cases share one easing curve:

```css
.case { height: 88px; overflow: hidden; transition: height 420ms cubic-bezier(.32,.72,0,1); }
.case[aria-expanded="true"] { height: 328px; background: var(--panel); }
```

**Keep one case open.** A fully collapsed reel reads as an empty dark slab in the screenshot.

```js
function open(el) {
  cases.forEach((c) => {
    const on = c === el;
    c.setAttribute('aria-expanded', String(on));
    c.querySelector('.head').setAttribute('aria-expanded', String(on));
  });
}
```

**Delay the body**, otherwise 14px copy flashes in a 88px slot during the first 100ms:

```css
.body { opacity: 0; transform: translateY(8px); pointer-events: none;
        transition: opacity 240ms var(--ease) 80ms, transform 240ms var(--ease) 80ms; }
.case[aria-expanded="true"] .body { opacity: 1; transform: none; pointer-events: auto; }
```

Common mistakes: using `max-height: 999px` (the ease feels late); allowing all four closed; putting video posters in the still; using amber `#E0A34B` or Kiln lime `#C8F65A`; making the name roman instead of italic.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
