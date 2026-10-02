<!-- Design Lounge Nº 022 · "Ink-fill upload progress" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Ink-fill upload progress

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The blocking "uploading" screen of a media tool ("Anvil"). The product's wordmark is set at 168px in Unbounded Black as a 2px outline; a second, solid copy of the same word sits exactly on top and is revealed from the bottom with `clip-path: inset()` as the upload progresses, so the letters appear to fill with ink. A faint 2px horizontal rule marks the ink level across the whole stage. Left: the three files with checkboxes that tick as each finishes. Right: a 56px tabular percentage with a seconds-remaining line. Bottom: a 3px progress hairline and the transfer speed. At 100 % the status dot turns green, a pill toast rises ("All files uploaded") and the hairline turns green. Clicking anywhere (or pressing R) replays the 7.2s sequence. The mechanism worth copying is the two-layer wordmark with negative clip insets so the outline and fill never disagree.

## Reference behaviour

1. On load the upload starts at 0 %: hollow wordmark, no ink line visible above the baseline, percentage "0", ETA "calculating", speed "— MB/s", first file row marked live (dark checkbox border), status "Uploading" with a pulsing dot.
2. Progress runs for 7,200ms along an ease-in-out curve with a slight wobble in the first half (so speed reads as variable), reaching 100 exactly at the end. Every frame: `--p` on `<body>` is set to the integer percentage; the percentage text, `aria-valuenow`, ETA ("N s remaining"), speed (`total / duration × (0.7–1.3)` MB/s) and the bottom hairline width update.
3. The solid wordmark is clipped from the top by `(100 − p) %`, so the ink rises from the baseline; the ink-level rule follows at the same height with 25 % opacity.
4. File rows complete at thresholds 57 % and 92 % (file 1 and 2); the last completes at 100 %. A completed row shows a green filled checkbox with a white check; the current row shows a dark outline.
5. At 100 %: `<body>` gains `done`; the status dot turns green and stops pulsing; status reads "Complete"; ETA reads "done"; speed reads "230 MB sent"; hairline turns green; the ink-level rule fades; the toast slides up 12px and fades in over 600ms.
6. Click anywhere, press R, or activate the visually hidden "Replay upload" button: everything resets and the sequence starts again from 0 (the ink drains instantly, then fills).
7. Hover anywhere: the "Click anywhere to replay" hint brightens from `--ink-3` to `--ink`.

## Structure

```
1280 × 800
┌────────────────────────────────────────────────────────────────────────┐
│ ANVIL · UPLOADS                                        ● UPLOADING     │ top 28/40
│                                                                        │
│ ☑ site-footage-01.mov · 142 MB                                         │
│ ☐ site-footage-02.mov · 88 MB      ▄▄  ▄▄ ▄▄  ▄▄ ▄▄  ▄▄  ▄▄     51 %   │
│ ☐ captions-en.srt · 18 KB    ─────██──███──██──███──██───   4 S REM…   │ stage grid
│ 3 files · 230 MB · to eu-north-1  ████ ████ ████ ████ ████             │ 260 / 1fr / 180
│                                                                        │
│                                        (toast at bottom-centre)        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━───────────────────────────────────── │ 3px on 1px hairline
│ 36.9 MB/S                                     ↺ CLICK ANYWHERE TO REPLAY│ bottom 28/40
└────────────────────────────────────────────────────────────────────────┘
```

- `<body id="body">`: `grid-template-rows: auto 1fr auto`, `cursor: pointer`, `user-select: none`.
- `.top`: brand + section, `.status` (8px dot + `#state`).
- `<main class="stage" aria-label="Upload progress">`: grid `260px 1fr 180px`, 40px side padding, items centred vertically.
  - `.meta#files`: three `.row[data-at]` (checkbox `<i>` with an inline check SVG, filename `<b>`, size) and a summary line.
  - `.word` (`aria-hidden`): `display: grid`; `.hollow` and `.fill` spans both at `grid-area: 1 / 1`; `.line` absolutely positioned.
  - `.pct[role="progressbar"]`: `<b id="num">` and `<span id="eta">`.
  - `.toast` (pill) and a visually hidden `<button class="sr">Replay upload</button>`.
- `.bar` (1px hairline, `::after` is the 3px progress).
- `.bottom`: `#speed` and `.replay` hint with a 14px rotate-ccw icon.

## Tokens

```css
:root {
  /* colour — warm paper, navy ink, one green for completion */
  --paper: #f4efe6;
  --paper-2: #eae3d6;      /* reserved: hover surfaces */
  --ink: #101a2e;          /* wordmark, numerals, hairline fill */
  --ink-2: #4e5566;        /* labels */
  --ink-3: #8b8f99;        /* hint, unit sign, summary */
  --line: #d8d1c4;         /* hairline, empty checkbox */
  --done: #1f6f4a;         /* completed state */

  /* type */
  --display: "Unbounded", system-ui, sans-serif;   /* weight 900 only */
  --mono: "DM Mono", ui-monospace, monospace;
  --word-size: 168px; --fs-pct: 56px; --fs-unit: 22px; --fs-label: 12px; --fs-file: 12px;
  --word-tracking: -.04em; --word-stroke: 2px;

  /* layout */
  --gutter: 40px; --bar-pad: 28px 40px; --stage-cols: 260px 1fr 180px;
  --check: 14px; --dot: 8px; --hairline: 1px; --progress-h: 3px; --toast-bottom: 24px;
  --clip-bleed: -8px -4px -8px;   /* right / bottom / left negative insets on the fill clip */

  /* progress */
  --p: 0;                /* 0–100, integer, written by JS each frame */
  --upload-ms: 7200; --file-1-at: 57; --file-2-at: 92; --total-mb: 230;

  /* motion */
  --t-micro: 160ms; --t-fill: 120ms; --t-done: 600ms; --pulse: 1600ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role            | Family    | Size  | Weight | Line-height | Tracking | Case |
|-----------------|-----------|------:|-------:|------------:|---------:|------|
| Wordmark        | Unbounded | 168px | 900    | .95         | −0.04em  | UPPERCASE; hollow = transparent fill + 2px `--ink` stroke; fill = `--ink` + same stroke |
| Percentage      | DM Mono   | 56px  | 500    | 1           | −0.04em  | tabular; "%" via `::after` at 22px in `--ink-3` |
| ETA / status    | DM Mono   | 12px  | 400    | 1.5         | +0.06em  | UPPERCASE `--ink-2` |
| Top / bottom bars | DM Mono | 12px  | 400    | 1.5         | +0.06em  | UPPERCASE; brand 500 `--ink` |
| File rows       | DM Mono   | 12px  | 400    | 1.9         | +0.04em  | filename 500 `--ink`, size `--ink-2` |
| Summary line    | DM Mono   | 12px  | 400    | 1.9         | +0.04em  | `--ink-3` |
| Toast           | DM Mono   | 12px  | 400    | 1           | +0.06em  | UPPERCASE `--paper` on `--ink` |

## Motion

| Element           | Trigger         | Property            | From → To                                 | Duration | Easing |
|-------------------|-----------------|---------------------|-------------------------------------------|---------:|--------|
| `--p` (JS)        | play            | custom property     | 0 → 100 along `curve(t)` (ease-in-out quad with a damped 6 % sine wobble) | 7200ms | rAF |
| `.word .fill`     | `--p` change    | clip-path inset top | `100%` → `0%`                             | 120ms per step | linear |
| `.word .line`     | `--p` change    | top                 | `100%` → `0%`, opacity .25 → 0 on done    | 120ms    | linear |
| `.bar::after`     | `--p` change    | width               | 0 → 100 %                                 | 120ms    | linear |
| `.status i`       | while uploading | opacity             | 1 → .3 → 1                                | 1600ms   | `--ease`, infinite; removed on done |
| `.row i`          | threshold       | background, border  | transparent/`--line` → `--done`/`--done`  | 160ms    | linear |
| `.toast`          | done            | opacity, translateY | 0, 12px → 1, 0                            | 600ms    | `--ease-out` |
| `.replay` hint    | body hover      | color               | `--ink-3` → `--ink`                       | 160ms    | linear |

Reduced motion: the status dot does not pulse; clip, hairline and toast transitions are 1ms (the fill still rises, stepwise with `--p`). The 7.2s progression itself is content, not decoration, and keeps running.

## States

- **Uploading:** dark pulsing dot, "Uploading", ETA counting down, speed varying, hairline in `--ink`.
- **Row pending:** 14px box with 1.5px `--line` border, hidden check. **Row live:** border `--ink`. **Row done:** `--done` fill and border, white check visible.
- **Done (`body.done`):** green static dot, "Complete", "done", "230 MB sent", green hairline, ink-level rule hidden, toast visible.
- **Hover (anywhere):** hint text darkens; cursor is a pointer over the whole page.
- **Focus-visible (hidden replay button):** appears at bottom-left as an ink pill with paper text.
- No error state in this piece; add one by swapping `--done` for a red and the toast copy.

## Accessibility

- `.pct` is `role="progressbar"` with `aria-valuemin/max/now` updated every frame and `aria-label="Upload progress"`.
- The wordmark is `aria-hidden` (decorative duplicate of the brand); the percentage and file list carry the information.
- The status text changes "Uploading" → "Complete"; wrap `#state` in `aria-live="polite"` in production so completion is announced (the demo leaves `aria-live="off"` on the body to avoid announcing every frame).
- A visually hidden but focusable "Replay upload" button provides keyboard access to the click-anywhere behaviour; R also replays.
- Contrast: `--ink-2` on `--paper` 8.1:1; `--ink-3` on `--paper` 3.9:1 (used only for the unit sign, hint and summary at 12px); `--paper` on `--ink` 15:1; `--done` fill with white check 5.3:1.
- Text is not selectable (`user-select: none`) because the whole page is a click target; keep it that way only on this screen.

## Responsive rules

- > 1100: as drawn; wordmark 168px, stage columns 260 / 1fr / 180.
- 768–1100: wordmark 120px; stage columns 220 / 1fr / 140; percentage 40px (the 168px word needs ≈ 690px of free width, which 1024 does not have).
- < 768: stage stacks (files, wordmark at 72px, percentage) with 20px gaps; percentage left-aligned; toast full-width pill above the hairline.

## Acceptance checklist

- [ ] Wordmark is two identical spans stacked with CSS grid (`grid-area: 1/1`), not absolute positioning; both have the same 2px text stroke.
- [ ] The fill span uses `clip-path: inset(calc((100 - var(--p)) * 1%) -8px -4px -8px)` so the last glyph's overhang is not clipped.
- [ ] `--p` is an integer 0–100 set on `<body>` every animation frame; CSS derives the fill, the ink-level rule and the hairline from it alone.
- [ ] The run lasts 7,200ms and ends at exactly 100 with the `done` class applied.
- [ ] Percentage is 56px tabular mono with a 22px "%" in `--ink-3`; ETA shows whole seconds remaining.
- [ ] File rows tick at 57 %, 92 % and 100 % with a green filled checkbox and white check.
- [ ] The toast fades and rises over 600ms with `cubic-bezier(.16,1,.3,1)` only after completion.
- [ ] Clicking anywhere, pressing R, or activating the hidden Replay button restarts from 0 without stacking animation frames (`cancelAnimationFrame` first).
- [ ] The status dot pulses (1.6s) only while uploading and never under reduced motion.
- [ ] No `setInterval`; a single `requestAnimationFrame` loop drives the run.
- [ ] Page fits 1280 × 800 without scrolling; the wordmark never overlaps the file list or percentage.

## Implementation notes

**Two-layer wordmark that cannot drift.** Stack the layers with grid so they share one box, give both the same stroke so glyph rasterisation matches, and bleed the clip on three sides:

```css
.word { display: grid; font: 900 var(--word-size)/.95 var(--display); letter-spacing: -.04em; white-space: nowrap; }
.word > span { grid-area: 1 / 1; }
.hollow { color: transparent; -webkit-text-stroke: 2px var(--ink); }
.fill   { color: var(--ink); -webkit-text-stroke: 2px var(--ink);
          clip-path: inset(calc((100 - var(--p)) * 1%) -8px -4px -8px);
          transition: clip-path 120ms linear; }
```

**One rAF loop, one custom property.** Everything visual reads `--p`; the JS only writes numbers and text:

```js
const dur = 7200; let start = 0, raf = 0;
const curve = t => { const e = t < .5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2;
                     return Math.min(1, e * (1 - .06 * Math.sin(t * 9) * Math.max(0, 1 - t * 1.2))); };
function frame(now) {
  const t = Math.min(1, (now - start) / dur), p = Math.round(curve(t) * 100);
  body.style.setProperty('--p', p); num.textContent = p; pb.setAttribute('aria-valuenow', p);
  eta.textContent = t < 1 ? Math.max(0, Math.round((dur - (now - start)) / 1000)) + ' s remaining' : 'done';
  if (t < 1) raf = requestAnimationFrame(frame); else body.classList.add('done');
}
function play() { cancelAnimationFrame(raf); body.classList.remove('done'); start = performance.now(); raf = requestAnimationFrame(frame); }
```

**Ink-level rule and hairline from the same number:**

```css
.word .line { position: absolute; left: -6%; right: -6%; height: 2px; background: var(--ink); opacity: .25;
              top: calc((100 - var(--p)) * 1%); transition: top 120ms linear; }
.bar::after { content: ""; position: absolute; left: 0; top: -1px; height: 3px; background: var(--ink);
              width: calc(var(--p) * 1%); transition: width 120ms linear; }
```

Common mistakes: `clip-path: inset(... 0 0 0)` clips the trailing glyph when letter-spacing is negative (bleed the insets); positioning the fill layer with `position: absolute; inset: 0` (sub-pixel width differences show as a sliver at the last letter); animating `height` of a coloured overlay instead of clipping the text (the overlay covers counters and the ink level looks like a rectangle, not a fill); updating `--p` with a transition longer than the frame interval (the fill lags the number).

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
