<!-- Design Lounge Nº 418 · "Spinner specimen set" · designlounge.vercel.app -->

# Spinner specimen set

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Keep the spinners pure CSS (plus two tiny inline SVGs); JS only drives the controls and the copy button.

## What it is

A specimen sheet for Whirl, a small spinner library. Eight spinners sit in a 4 × 2 grid of hairline tiles on warm near-black: arc, dots, bars, pulse, morph, segments, clock, infinity. A control strip above the grid sets size, colour and speed for all eight at once through three CSS custom properties. Each tile ends in a full-width copy row that puts a ready-to-paste rule on the clipboard, e.g. `.spin-morph { --size: 56px; --color: #C9E265; --speed: 1.25; }`. The detail worth copying is that every spinner is driven by the same three variables, so one dial retunes the whole set, and the copy line records the current settings rather than a fixed snippet.

## Reference behaviour

1. First frame: eight spinners running at 48px, signal orange `#FF5B2E`, speed 1×. Tiles are numbered 01–08 top left, named top right in the display face.
2. Dragging Size (16–72px, step 4) resizes every spinner live. The readout says `48px`.
3. Clicking a colour swatch (Signal orange, Chalk, Pear, Sky) recolours all eight. The swatch group is a radio group with a 1.5px ring around the checked swatch.
4. Dragging Speed (0.5×–2×, step 0.25) changes every animation duration. Durations are `base / speed`, so 2× halves them. The readout says `1.00×`.
5. "Pause all" pauses every animation in place (`animation-play-state: paused`). The button becomes "Play all" with a play icon and `aria-pressed="true"`.
6. Hovering a tile lifts its background one step (`#1A1814` → `#211F1A`).
7. Clicking a copy row writes the rule for that spinner with the current size, colour and speed. The row swaps its label and icon for an orange "Copied" for 1400ms. A polite live region says "Copied .spin-morph at 56px, 1.25× speed".
8. If the Clipboard API is blocked (sandboxed iframe), fall back to a hidden textarea and `execCommand('copy')`. The "Copied" feedback shows either way.
9. Reduced motion: every spinner stops moving and instead fades between 100% and 45% opacity over 2.4s. The arc shows a fixed 70-unit dash. The pulse and the motion still read as "busy".

## Structure

```
1280 x 800
+------------------------------------------------------------------------------+
| header, padding 28 40 20                                                     |
| (o) WHIRL                                           8 spinners · pure CSS    |
| Spinner specimen, vol. 1   (40px)                   one colour · one speed   |
+------------------------------------------------------------------------------+ 1px
| SIZE ──●──── 48px   COLOUR (●)(○)(○)(○)   SPEED ──●──── 1.00×   [|| Pause all]|
+-------------------+-------------------+-------------------+------------------+ 1px
| 01           arc  | 02          dots  | 03          bars  | 04        pulse  |
|                   |                   |                   |                  |
|        ( )        |       • • •       |      ||| ||       |       (◎)        |
|                   |                   |                   |                  |
| .spin-arc      [⧉]| .spin-dots     [⧉]| .spin-bars     [⧉]| .spin-pulse   [⧉]|  44px
+-------------------+-------------------+-------------------+------------------+
| 05         morph  | 06      segments  | 07         clock  | 08     infinity  |
|        ■          |        ✳          |        (⌚)        |        ∞         |
| .spin-morph    [⧉]| .spin-segments [⧉]| .spin-clock    [⧉]| .spin-infinity[⧉]|
+-------------------+-------------------+-------------------+------------------+
```

- `body` is a column flex: `header`, a `section` of controls labelled "Spinner controls", then `main.grid` labelled "Spinners". The grid takes the rest of the height.
- The grid is `repeat(4, minmax(0,1fr))`, rows `minmax(220px, 1fr)`. Tiles share hairlines: the grid has a left border, each tile has right and bottom borders.
- Each tile is an `article`: number `span`, name `h2`, a centred stage holding the spinner `span.sp.sp-<name>` with `role="img"` and `aria-label="<name> spinner"`, then the copy `button`.
- The colour swatches are four `button role="radio"` in a `role="radiogroup"` labelled "Colour".
- One visually hidden `p aria-live="polite"` for copy confirmations.

## Tokens

```css
:root {
  --bg: #13120f;        /* page */
  --tile: #1a1814;      /* tile resting */
  --tile-2: #211f1a;    /* tile hover */
  --line: #2d2a24;      /* hairlines */
  --line-2: #433f37;    /* control borders, slider track */
  --ink: #ece6d8;       /* chalk text */
  --ink-2: #b3ab9b;     /* copy row text, slider fill */
  --ink-3: #8a8374;     /* labels, numbers */
  --accent: #ff5b2e;    /* signal orange: default spinner colour, "Copied", h1 accent */
  --focus: #ff5b2e;

  --display: "Unbounded", system-ui, sans-serif;
  --mono: "Azeret Mono", ui-monospace, Menlo, monospace;

  /* the three dials every spinner reads */
  --size: 48px;
  --color: var(--accent);
  --speed: 1;

  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
  --ease-morph: cubic-bezier(.76,0,.24,1);

  --pad-x: 40px;
  --row-copy: 44px;
  --tile-min: 220px;
}
```

Swatch values: Signal orange `#FF5B2E`, Chalk `#ECE6D8`, Pear `#C9E265`, Sky `#7CB7FF`.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Page title | Unbounded | 40px | 500 | 1 | -0.03em | Sentence, "vol. 1" in accent |
| Wordmark | Unbounded | 13px | 700 | 1 | 0.04em | Upper |
| Tile name | Unbounded | 13px | 500 | 1 | -0.01em | Lower |
| Tile number | Azeret Mono | 11px | 400 | 1 | 0.06em | 01–08 |
| Control label | Azeret Mono | 11px | 400 | 1 | 0.08em | Upper |
| Readouts | Azeret Mono | 13px | 400 | 1.5 | 0 | tabular-nums |
| Copy row | Azeret Mono | 12px | 400 | 1.5 | 0 | `.spin-name` |
| Header meta | Azeret Mono | 12px | 400 | 1.7 | 0 | Sentence |

## Motion

Every spinner reads `--s: var(--size)`, `--c: var(--color)`, `--k: var(--speed)`. Every duration is `calc(<base> / var(--k))`.

| Spinner | Build | Property | Base duration | Easing | Stagger |
| --- | --- | --- | --- | --- | --- |
| arc | SVG circle r=20 in 50×50, 4px stroke, faint track at 16% | rotate 0→360° on the svg; dasharray `1 150` → `90 150`, dashoffset 0 → -35 → -124 on the circle | 1.4s | rotate linear, dash `--ease` | — |
| dots | 3 dots, 22% of size | translateY 0 → -70%, scale .7 → 1, opacity .35 → 1 at 35% | 1s | `--ease` | 0.14s |
| bars | 5 bars, 12% wide, 2px radius | scaleY .3 → 1 at 25%, opacity .4 → 1 | 1.1s | `--ease` | 0.1s |
| pulse | 3 rings (2px border) + 24% centre dot | scale .3 → 1, opacity 1 → 0 | 1.8s | `--ease-out` | 0.6s |
| morph | square inset 18% | rotate in 90° steps, scale 1 ↔ .6, radius 8% ↔ 50% | 1.6s | `--ease-morph` | — |
| segments | 8 capsules, 8% × 28%, rotated 45° apart | opacity 1 → .15 | 0.96s | linear | 0.12s (negative delays so it starts mid-cycle) |
| clock | 2px ring, hour hand 26%, minute hand 38% | rotate 0→360° | hour 6s, minute 0.75s | linear | — |
| infinity | SVG lemniscate in 90×50 (width = size × 1.8), `pathLength=200` | dashoffset 0 → -200 with dasharray `42 158` over a 16% track | 1.6s | linear | — |

| UI | Trigger | Property | Duration | Easing |
| --- | --- | --- | --- | --- |
| Tile | hover | background | 200ms | `--ease` |
| Copy row | hover | colour, background | 160ms | `--ease` |
| Pause button | hover | border-color | 160ms | `--ease` |

Reduced motion: replace every spinner animation with `fade 2.4s ease-in-out infinite` (opacity 1 → .45 → 1), drop all stagger delays, give the arc a static 70-unit dash and the segments 50% opacity. Remove UI transitions.

## States

- Tile resting `--tile`; hover `--tile-2`.
- Copy row resting: `.spin-<name>` in `--ink-2`, copy icon right. Hover: `--ink`, 3% chalk wash. Copied: label and icon hidden, "Copied" in `--accent` for 1400ms.
- Swatch checked: `aria-checked="true"`, ring 1.5px `--ink` at 4px outside.
- Pause: resting outline `--line-2`, hover `--ink-2`. Pressed: label "Play all", play triangle icon, all spinners frozen mid-frame.
- Slider: 2px track in `--line-2` with the filled part in `--ink-2` (set `--p` from JS), 14px chalk thumb with a 3px page-coloured border.
- Focus-visible everywhere: 2px `--focus` outline, offset 2px (4px on sliders).

## Accessibility

- Every spinner is `role="img"` with `aria-label="<name> spinner"`. In a product, the spinner that marks a real wait becomes `role="status"` with a label such as "Loading invoices".
- Sliders are native `input type="range"` with `label for`, and an `output for` that shows the value.
- Swatches: radio group. Only the checked swatch is in the tab order (`tabindex="0"`, others `-1`). Arrow keys move and select, wrapping.
- Copy buttons are labelled "Copy CSS for spin-<name>". The live region announces what was copied with size and speed.
- Pause is a toggle button with `aria-pressed`. It exists so people can stop eight moving things.
- Contrast: chalk `#ECE6D8` on `#13120F` is about 15:1; `#8A8374` labels about 5:1; orange on near-black about 6.4:1.

## Responsive rules

- ≥1280: 4 × 2 grid filling the remaining height.
- 1024 (≤1100px): same grid, title 32px.
- 768 (≤820px): 2 columns × 4 rows of 200px; the page scrolls; header meta hidden.
- <640: header padding 20px 16px, title 24px; controls wrap onto three lines with sliders 96px wide; Pause sits on its own line, left aligned; tiles 176px tall; copy row padding 12px, 11px text.
- Never scroll sideways at 375px.

## Acceptance checklist

### Always

- [ ] Eight distinct spinners, each pure CSS except the arc and infinity SVGs.
- [ ] Every spinner reads the same three variables: size, colour, speed.
- [ ] Changing a control updates all spinners live with no re-render.
- [ ] Durations divide by speed; 2× is twice as fast.
- [ ] Pause freezes every animation in place and toggles `aria-pressed`.
- [ ] Copy writes a rule with the current settings and shows "Copied" for 1400ms, with a clipboard fallback.
- [ ] Swatches behave as a radio group with arrow keys.
- [ ] Reduced motion swaps all motion for a slow opacity fade.
- [ ] Tiles separated by 1px hairlines, no shadows, no rounded tiles.
- [ ] No sideways scroll at 375px.

### This demo

- [ ] Wordmark "Whirl", title "Spinner specimen, vol. 1".
- [ ] Names in order: arc, dots, bars, pulse, morph, segments, clock, infinity.
- [ ] Defaults 48px, `#FF5B2E`, 1×; size range 16–72, speed 0.5–2.
- [ ] Page `#13120F`, tile `#1A1814`, ink `#ECE6D8`.

## Implementation notes

**1. One set of variables, divided durations.** Put the dials on `:root` (or on a wrapper) and let each spinner alias them. Pausing is one inherited custom property.

```css
.sp { --s: var(--size); --c: var(--color); --k: var(--speed);
  width: var(--s); height: var(--s); color: var(--c); position: relative; }
.sp, .sp * { animation-play-state: var(--play, running); }
body.paused { --play: paused; }
.sp-dots i { width: 22%; height: 22%; border-radius: 50%; background: currentColor;
  animation: dot calc(1s / var(--k)) var(--ease) infinite;
  animation-delay: calc(var(--i) * .14s / var(--k)); }
```

**2. The segments' transform-origin.** Each capsule is 28% of the box tall, pinned at the top centre. The rotation centre is the middle of the box, which is 50% / 28% = 178.5% of the capsule's own height. Get this wrong and the ring wobbles.

```css
.sp-seg i { position: absolute; left: 46%; top: 0; width: 8%; height: 28%;
  border-radius: 999px; background: currentColor;
  transform-origin: 50% 178.5%; transform: rotate(calc(var(--i) * 45deg));
  animation: seg calc(.96s / var(--k)) linear infinite;
  animation-delay: calc((var(--i) - 8) * .12s / var(--k)); }
@keyframes seg { from { opacity: 1 } to { opacity: .15 } }
```

**3. The arc is two animations.** Rotate the SVG linearly and breathe the dash on the circle; together they give the grow-and-chase arc.

```css
.sp-arc svg { animation: spin calc(1.4s / var(--k)) linear infinite; }
.sp-arc circle { fill: none; stroke: currentColor; stroke-width: 4; stroke-linecap: round;
  animation: arc calc(1.4s / var(--k)) var(--ease) infinite; }
@keyframes arc {
  0%   { stroke-dasharray: 1 150;  stroke-dashoffset: 0; }
  50%  { stroke-dasharray: 90 150; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 90 150; stroke-dashoffset: -124; } }
```

**4. Copy with a fallback.**

```js
function writeClip(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text).catch(() => legacy(text));
  return Promise.resolve(legacy(text));
}
function legacy(text) {
  const t = Object.assign(document.createElement('textarea'), { value: text });
  t.style.cssText = 'position:fixed;opacity:0'; document.body.append(t); t.select();
  try { document.execCommand('copy'); } catch {} t.remove();
}
```

Common mistakes:

- Hard-coding durations per spinner so the speed dial only affects some of them.
- Animating `width`/`height` for size. Size is a variable read once; animations use transforms and opacity only.
- Using a GIF or Lottie for any of the eight.
- Eight different colours. One colour, chosen by the user.
- Glow, blur or gradient on spinners. They are flat `currentColor`.
- Forgetting to scale the infinity width (1.8 × size) so it looks squashed.
- Copying a static snippet that ignores the current size and speed.
- Leaving stagger delays on under reduced motion, which makes the fade look broken.

Rebuild order:

1. Tokens, header and the control strip.
2. The 4 × 2 hairline grid and tile anatomy.
3. Spinners one by one, each reading `--s`, `--c`, `--k`.
4. Wire sliders and swatches to the three root variables.
5. Pause toggle.
6. Copy rows with fallback and the live region.
7. Reduced motion, then the 820px and 640px rules.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
