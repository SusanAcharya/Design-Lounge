<!-- Design Lounge Nº 003 · "Bento feature grid" · designlounge.vercel.app -->

# Bento feature grid

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

A marketing "features" section for a developer platform ("Tessel"), laid out as a bento grid: six cells of different spans on a strict 4 × 3 grid, on a warm off-white page. Each cell carries a **small live illustration built from CSS only** — a 24-bar chart that grows in, a keycap row that lights up when you press the keys, a real toggle switch, a sparkline that draws itself, an avatar stack with a typing indicator, and a release timeline with one spinning step. Hovering a cell lifts it 2px and brightens its hairline border; nothing else moves. The detail worth copying is the restraint: one accent green, hairlines instead of shadows, and illustrations that behave like the product instead of decorating it.

## Structure

```
1280 × 800
┌────────────────────────────────────────────────────────────────────────┐
│ 48px gutter                                                            │
│ TESSEL · PLATFORM                                     lede (34ch,     │
│ Everything your team ships, in one grid.              right-aligned)  │
│                                                                        │
│ ┌──────────────────────────┐ ┌────────────────────────────────────────┐│
│ │ A  Throughput       LIVE │ │ B  Keyboard first   [⌘][K] then [G][I] ││
│ │    41,208 req/min        │ └────────────────────────────────────────┘│
│ │    ▁▂▃▂▄▅▄▆▇▆█▇ (24 bars)│ ┌─────────────────┐ ┌────────────────────┐│
│ │                          │ │ C Auto-scale  (o)│ │ D p95 142ms  ╱╲╱╲ ││
│ └──────────────────────────┘ └─────────────────┘ └────────────────────┘│
│ ┌──────────────────────────┐ ┌────────────────────────────────────────┐│
│ │ E  Presence  ●●●● Noor…  │ │ F  Release train  ●─●─◌─○              ││
│ └──────────────────────────┘ └────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────────┘
grid: 4 equal columns × 3 equal rows, 16px gap, 48px side padding, 40px bottom
A: col 1–2, row 1–2 · B: col 3–4, row 1 · C: col 3, row 2 · D: col 4, row 2 · E: col 1–2, row 3 · F: col 3–4, row 3
```

- `<header>`: `<p class="eyebrow">`, `<h1>` with `<em>` for the accent phrase, `<p class="lede">`. Flex row, items aligned to the bottom, padding `40px 48px 24px`.
- `<section class="grid" aria-label="Product features">`: CSS grid, `flex: 1`, `min-height: 0` so rows share the remaining height.
- Each `<article class="cell">`: `<h3>` (serif), `<p>` (description), then a `.art` box (`flex: 1`) holding the illustration. Cell A also has a `.tag` pill absolutely positioned top-right.
- Illustrations: A — `<div class="bars" role="img">` filled with 24 `<span class="bar">` by JS. B — `.keys` row of `.key` spans (`aria-hidden`). C — `<button role="switch">`. D — inline `<svg class="spark">` with a fill path and a stroke path. E — `.faces` avatar stack + `.typing` dots. F — `.steps` row of `.step` items separated by `.rail` hairlines.

## Motion

| Element        | Trigger        | Property                | From → To                  | Duration | Easing       | Delay / stagger |
|----------------|----------------|-------------------------|----------------------------|---------:|--------------|-----------------|
| `.cell`        | hover          | transform, border-color, box-shadow | 0 → −2px; `--line` → `--line-hover`; none → `--shadow-hover` | 160ms | `--ease` | — |
| `.bar`         | load           | transform scaleY        | 0 → 1 (origin bottom)      | 700ms    | `--ease-out` | 22ms × index |
| `.bar`         | hover          | background              | `--accent-soft` → `--accent` | 160ms  | `--ease`     | — |
| `.key.on`      | keydown / demo | transform, border-bottom-width, colours | 0 → 2px; 3px → 1px; face → accent | 160ms | `--ease` | demo: ⌘+K at t, G at t+520, I at t+1040, repeat every 3.2s |
| `.switch`      | click          | background              | `--line-hover` ↔ `--accent` | 160ms   | `--ease`     | — |
| `.switch::after` | click        | transform translateX    | 0 ↔ 22px                   | 160ms    | `--ease`     | — |
| `.spark path`  | load           | stroke-dashoffset       | 400 → 0                    | 1200ms   | `--ease-out` | 200ms |
| `.spark .fill` | load           | opacity                 | 0 → 1                      | 500ms    | `--ease`     | 1000ms |
| `.typing i`    | loop           | opacity                 | .3 → 1 → .3                | 1400ms   | `--ease`     | 0 / 200 / 400ms, infinite |
| `.step.live .dot` | loop        | rotate                  | 0 → 360°                   | 1100ms   | linear       | infinite (a spinner is the one place linear is right) |

Reduced motion: all animation and transition durations become 1ms and iteration counts 1; the sparkline is rendered fully drawn (`stroke-dashoffset: 0`, fill opacity 1); the canary spinner becomes a full static ring; the keycap demo loop does not start (check `matchMedia('(prefers-reduced-motion: reduce)')` before scheduling it).

## States

- **Cell hover:** lifted 2px, border `--line-hover`, soft shadow. Cursor stays default (cells are not links).
- **Cell focus-within:** border `--accent` (so keyboard users see which cell owns the focused switch).
- **Switch on:** track `--accent`, knob at +22px, `aria-checked="true"`, pods reads "6". **Off:** track `--line-hover`, knob at 3px, pods reads "3".
- **Switch focus-visible:** 2px `--accent` outline, 3px offset.
- **Keycap pressed (`.on` or `:active`):** translated 2px down, bottom border 3px → 1px (the cap "sinks"), face `--accent`, text `--accent-ink`.
- **Bar current-window:** bars 19–24 use `--accent` permanently.
- **Step done:** 22px dot filled `--accent` with a 12px check; the rail after it is `--accent`. **Live:** ring with transparent top segment, spinning. **Pending:** ring in `--line-hover`, label `--ink-2`.
- **Tag pill ("Live"):** `--accent` text on `--accent-soft`, 11px, radius 999px, top-right at 18px.

## Accessibility

- The grid is a `<section aria-label="Product features">` of `<article>`s; each has an `<h3>`. Heading order is h1 → h3 (no h2), acceptable for a single section; add an `<h2>` if the page has more sections.
- Bar chart: `role="img"` with an `aria-label` that states the trend and final value; the bars themselves are not focusable.
- Sparkline SVG: `role="img"` + `aria-label` describing the trend; the fill path is decorative.
- Keycap row: `aria-hidden="true"`; the paragraph above already states the chord in text.
- Switch: `<button role="switch" aria-checked aria-label="Auto-scale">`; Space and Enter toggle it natively. The pods figure is plain text updated in place (no live region needed — it sits next to the control).
- Typing dots: `aria-hidden`; the sentence "Noor is editing" carries the meaning.
- Release steps: the container has an `aria-label` summarising each step's state.
- Contrast: `--ink-2` on `--cell` 7.4:1; `--ink-3` on `--cell` 4.5:1 (used at ≥ 11px 500 only); `--accent-ink` on `--accent` 8.9:1.
- Only one focusable control exists (the switch); the whole section works without a pointer.

## Responsive rules

- ≥ 1280: 4 × 3 grid as drawn, page does not scroll.
- 1024–1279: same grid; reduce gutter to 32px and headline to 32px.
- 768–1023: grid becomes 2 columns with auto rows; A, B, E, F span both columns, C and D sit side by side; page scrolls; header stacks the lede under the headline (left-aligned).
- < 640: single column, gutter 20px, cells in DOM order; headline 28px; the keycap row wraps (it already has `flex-wrap: wrap`).

## Acceptance checklist

- [ ] Grid is `repeat(4, 1fr)` × `repeat(3, 1fr)` with a 16px gap and 48px side gutters at 1280 wide.
- [ ] Cell spans match: A 2×2, B 2×1, C 1×1, D 1×1, E 2×1, F 2×1.
- [ ] Cell hover moves the cell exactly −2px and changes the border to `#B8B2A4` in 160ms; no scale, no colour change on text.
- [ ] Bars grow from the bottom on load, 700ms each, staggered 22ms; the last six bars are `--accent`.
- [ ] The sparkline draws over 1.2s (stroke-dashoffset), then its fill fades in.
- [ ] The switch is a `role="switch"` button; clicking flips `aria-checked`, the knob travels 22px, and the pods figure changes 6 ↔ 3.
- [ ] Pressing K, G or I on a keyboard lights the matching keycap for ~220ms; holding ⌘ or Ctrl keeps the ⌘ cap pressed.
- [ ] The automatic chord demo runs every 3.2s and is skipped under `prefers-reduced-motion`.
- [ ] Keycaps sink 2px with the bottom border going 3px → 1px (no separate shadow).
- [ ] Focus is visible on the switch and its parent cell shows a green border via `:focus-within`.
- [ ] No image files; every illustration is DOM + CSS or inline SVG.
- [ ] Body text contrast ≥ 4.5:1 on cell surfaces.
- [ ] Under reduced motion the page is complete on first paint (bars full height, sparkline drawn, spinner static).

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: header (eyebrow, 36px serif headline with an italic accent phrase, right-aligned lede) above a 4-column × 3-row grid of six cells. The bar chart in cell A grows from the baseline over 700ms, each bar staggered 22ms; the sparkline in cell D draws its stroke over 1.2s then fades in its fill. Everything else is already in its final state.
2. Hover any cell: it translates up 2px, the border changes from `#E2DED4` to `#B8B2A4`, and a faint shadow (`0 8px 20px -14px rgba(28,27,24,.25)`) appears. 160ms.
3. Hover a bar in the chart: it fills with the accent green (the last six bars are already accent, marking the "current window").
4. Keycap row (cell B): every 3.2s the page animates the chord ⌘ K → G → I by pressing keycaps in sequence (each press lasts 220ms, the "then" steps are 520ms apart). Pressing those keys on a real keyboard lights the matching keycap; holding ⌘/Ctrl keeps the ⌘ cap pressed until key-up.
5. Toggle (cell C): a real `role="switch"` button. Clicking flips `aria-checked`, slides the knob 22px and turns the track green; the "pods" figure changes 6 ↔ 3.
6. Presence (cell E): three dots blink in sequence beside "Noor is editing" on a 1.4s loop.
7. Release train (cell F): steps Build and Test are done (filled green dot with check), Canary shows a spinning ring (1.1s linear), Sign-off is an empty ring.
8. Keyboard: Tab reaches the toggle; a cell containing a focused control shows a green border (`:focus-within`).

## Tokens

```css
:root {
  /* colour — warm paper neutrals, one green accent */
  --bg: #f5f3ee;            /* page */
  --cell: #fffdf9;          /* cell surface */
  --cell-2: #f0ede6;        /* keycap face, empty avatar */
  --line: #e2ded4;          /* hairlines, resting cell border */
  --line-hover: #b8b2a4;    /* hovered cell border, switch off track, step rings */
  --ink: #1c1b18;           /* headings, stats */
  --ink-2: #5f5b52;         /* body copy */
  --ink-3: #8f8a7e;         /* labels, meta */
  --accent: #2f6b4f;        /* green: bars, switch on, sparkline, done steps */
  --accent-soft: #dcebe1;   /* resting bars, sparkline fill, tag pill */
  --accent-ink: #f5fbf7;    /* text on accent */
  --shadow-hover: 0 8px 20px -14px rgba(28, 27, 24, .25);

  /* type */
  --serif: "Fraunces", Georgia, serif;          /* opsz 72 for the h1 */
  --sans: "Instrument Sans", system-ui, sans-serif;
  --fs-h1: 36px; --fs-h3: 17px; --fs-body: 14px; --fs-small: 13px; --fs-label: 11px;
  --fs-stat: 22px; --fs-stat-lg: 26px;

  /* spacing & shape */
  --gutter: 48px; --gap: 16px; --cell-pad: 20px 22px;
  --r: 16px;        /* cell */
  --r-s: 8px;
  --r-key: 7px;
  --key-h: 34px; --switch-w: 52px; --switch-h: 30px; --knob: 24px; --avatar: 32px;

  /* motion */
  --t-micro: 160ms; --t-layout: 320ms; --t-hero: 700ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role            | Family          | Size | Weight | Line-height | Tracking | Case      |
|-----------------|-----------------|-----:|-------:|------------:|---------:|-----------|
| Eyebrow         | Instrument Sans | 12px | 500    | 1           | +0.14em  | UPPERCASE |
| Headline        | Fraunces        | 36px | 500    | 1.1         | −0.02em  | sentence; `<em>` italic 600 in `--accent`, `font-variation-settings: "opsz" 72` |
| Lede            | Instrument Sans | 15px | 400    | 1.5         | 0        | sentence, `text-wrap: balance`, max 34ch |
| Cell title      | Fraunces        | 17px | 600    | 1.2         | −0.01em  | sentence  |
| Cell body       | Instrument Sans | 13px | 400    | 1.5         | 0        | sentence, max 40ch |
| Big stat (A)    | Fraunces        | 26px | 600    | 1           | −0.02em  | numerals with thousands separators |
| Stat (C, D)     | Fraunces        | 22px | 600    | 1           | −0.02em  | numerals + unit |
| Stat caption    | Instrument Sans | 11px | 500    | 1.4         | +0.06em  | UPPERCASE |
| Meta label      | Instrument Sans | 11px | 500    | 1           | +0.08em  | UPPERCASE |
| Keycap          | Instrument Sans | 12px | 500    | 1           | 0        | as typed  |
| "then" word     | Fraunces        | 13px | 500 italic | 1       | 0        | lowercase |
| Step label      | Instrument Sans | 12px | 500    | 1           | 0        | sentence  |

## Implementation notes

**Let the grid own the height.** The section is a flex child with `min-height: 0`, and each cell also has `min-height: 0` and `overflow: hidden`, otherwise the 2×2 cell's chart pushes the rows past 800px:

```css
body  { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
.grid { flex: 1; min-height: 0; display: grid; gap: var(--gap);
        grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(3, 1fr); }
.cell { min-height: 0; overflow: hidden; display: flex; flex-direction: column; }
.cell .art { flex: 1; min-height: 0; display: flex; align-items: flex-end; }
```

**Keycaps that sink instead of shading.** Use the bottom border as the "depth" so the pressed state is a border swap, not a shadow:

```css
.key { border: 1px solid var(--line); border-bottom-width: 3px; border-radius: 7px;
       transition: transform 160ms var(--ease), border-color 160ms, background 160ms; }
.key.on, .key:active { transform: translateY(2px); border-bottom-width: 1px;
       background: var(--accent); border-color: var(--accent); color: var(--accent-ink); }
```

**Self-drawing sparkline** — set the dash length to at least the path length and animate the offset; keep the fill as a separate path so it can fade in after the stroke finishes:

```css
.spark path { stroke-dasharray: 400; stroke-dashoffset: 400;
              animation: draw 1.2s var(--ease-out) .2s forwards; }
.spark .fill { stroke: none; opacity: 0; animation: fade .5s var(--ease) 1s forwards; }
@keyframes draw { to { stroke-dashoffset: 0; } }
```

Common mistakes: using `scale()` on hover (it blurs text and shifts neighbours; use `translateY`); animating `height` on bars instead of `transform: scaleY` (layout thrash); forgetting `preserveAspectRatio="none"` on the sparkline so it stretches to the cell; using `display: none` on the ⌘ key when the demo isn't running (keep the row static instead).

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
