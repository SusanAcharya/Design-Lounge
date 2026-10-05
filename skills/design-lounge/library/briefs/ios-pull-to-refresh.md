<!-- Design Lounge Nº 052 · "Pull to refresh with drawn ring" · www.designlounge.live -->

# Pull to refresh with drawn ring

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The deployments feed of "Orbital", an infrastructure console, with a custom pull-to-refresh. Pulling the list down (pointer drag from `scrollTop === 0`, or a mouse drag on desktop) moves the list with 55% of the finger's travel and reveals a 28px ring above it; the ring's arc is drawn in step with the pull and reaches a full circle at the 80px threshold. Release past the threshold and the list holds at 64px while the ring becomes a 75% arc spinning at 800ms per turn; after 1.2s a new row is inserted at the top, entering with an 8px drop and a mint highlight that fades out over 1.2s, and the list springs back to 0. A circular refresh button in the header triggers the same sequence for replay.

## Structure

```
390 × 844
┌────────────────────────────────────────┐
│ (54 status)                            │
│ 58  ORBITAL · EU-1              (⟳)    │  header, 1px bottom hairline
│     Deployments (24/600)               │
│────────────────────────────────────────│
│                ◠ ring 28 (hidden, in   │  .ptr, 64px tall, absolute
│                  a 64px band)          │
│ 16 ┌──────────────────────────────┐ 16 │  row: r14, #1C1F25, 1px #2B3039
│    │ ● api-gateway v2.14.1  2m ago│    │
│    │   Healthy · 12 pods · p95 …  38s │
│    └──────────────────────────────┘    │
│    ┌──────────────────────────────┐    │  8px gap
│    │ ● billing v1.9.0      26m ago│    │
│    └──────────────────────────────┘    │
│    …                                   │
│                                        │
│  while loading: list translated 64px,  │
│  ring spinning in the revealed band    │
└────────────────────────────────────────┘
```

- `<body>` flex column: `<header>` (flex none) then `.stage` (`flex:1; min-height:0; position:relative; overflow:hidden`).
- `.ptr` (aria-hidden): absolute, `top:0; height:64px`, centred `<svg class="ring">` with a track circle and a progress circle, r=10.
- `<main id="feed" aria-live="polite" aria-busy>`: `height:100%; overflow-y:auto; padding:0 16px 40px; overscroll-behavior:contain; touch-action:pan-y`; transformed by the pull.
- `<ul class="list">` of `<li class="row">`: grid `auto 1fr auto`; `.dot` (col 1, rows 1–2), `.svc` name + version (col 2, row 1), `.meta` (col 2, row 2), `.when` (col 3, rows 1–2).

## Motion

| Element        | Trigger            | Property               | From → To                        | Duration | Easing     | Notes |
|----------------|--------------------|------------------------|----------------------------------|---------:|------------|-------|
| `main`         | drag               | transform              | `translateY(min(120, dy·.55))`   | 0        | —          | `.snap` absent |
| `main`         | release / finish   | transform              | current → 64px or 0              | 420ms    | `--spring` | `.snap` present |
| `.ring`        | drag               | opacity, scale         | 0,.6 → `--p`, .6+.4·`--p`        | 160ms (opacity) | `--ease` | driven by `--p = pull/80` |
| `.ring circle` | drag               | stroke-dashoffset      | 62.83 → 0                        | 0        | —          | `calc(62.83 × (1 − var(--p)))` |
| `.ring`        | `.loading`         | rotate (keyframe)      | −90° → 270°                      | 800ms    | linear, infinite | |
| `.ring circle` | `.loading`         | stroke-dashoffset      | current → 16                     | 160ms    | `--ease`   | |
| `.row.new`     | insert             | opacity, translateY    | 0,−8px → 1,0                     | 360ms    | `--spring` | |
| `.row.new`     | insert             | background, border     | mint → surface                   | 1200ms   | `--ease`   | holds until 25% |
| `.dot.live::after` | always         | scale, opacity         | .6,.9 → 1.4,0                    | 1600ms   | `--ease`, infinite | calm; one row only |
| `.btn`         | hover              | color, border-color    | `--ink-2` → `--accent`           | 160ms    | `--ease`   | |

Reduced motion: snaps are 1ms, the spin slows to 2s per turn (still communicates loading), the new row skips the drop and keeps only the highlight fade, and the live pulse is removed.

## States

- **Idle:** `--p: 0`, ring hidden, `aria-busy="false"`.
- **Pulling:** `--p` in (0, 1], ring drawn proportionally; list offset.
- **Armed:** `--p = 1` (pull ≥ 80px): ring is a full circle; nothing else changes until release.
- **Loading:** `.stage.loading`, `aria-busy="true"`, list held at 64px, ring spinning; further pulls ignored.
- **New row:** `.row.new` for 1200ms then class removed on `animationend`.
- **Status dots:** `.ok` mint, `.warn` amber, `.bad` coral; `.live` adds the pulse ring.
- **Refresh button focus-visible:** 2px `--accent` outline, 2px offset. Hover: accent text and border.

## Accessibility

- The feed is `aria-live="polite"` with `aria-busy` toggled during loading; the inserted row is announced once loading ends.
- The header refresh `<button aria-label="Refresh">` is the keyboard and switch-access path to the same behaviour; the gesture is never the only way.
- The ring is `aria-hidden` (decorative); the state is conveyed by `aria-busy`.
- `touch-action: pan-y` keeps native vertical scrolling; the pull only starts when `scrollTop === 0`. Use `setPointerCapture` so a drag that leaves the list still ends cleanly.
- Contrast: `--ink-2` on `--surface` 7.1:1; `--ink-3` only for 12px secondary numerals (4.5:1 on `--surface`); `--accent` on `--bg` 12:1.
- Hit target: refresh button 40×40.

## Responsive rules

- 360 wide: unchanged (rows are fluid); meta text wraps to a second line inside the row.
- ≥ 430 wide: constrain the list to 430px centred.
- Tablet: two-column row grid (service | meta | time in one line) and the pull threshold rises to 96px; keep the ring size.
- Very tall lists: the pull only arms at `scrollTop 0`, so scrolled-down users never trigger it by accident.

## Acceptance checklist

- [ ] A downward drag starting at `scrollTop 0` translates the list by 55% of pointer travel, capped at 120px, with no transition.
- [ ] The ring's `stroke-dashoffset` equals `62.83 × (1 − pull/80)` during the pull and the ring scales from 0.6 to 1.
- [ ] Release below 80px springs the list back over 420ms `cubic-bezier(.32,.72,0,1)`; release at ≥ 80px holds at 64px and starts the spin.
- [ ] While loading the ring shows a ~75% arc rotating once per 800ms, linear; `aria-busy` is true; extra pulls are ignored.
- [ ] After 1200ms a new row is prepended with an 8px drop-in and a mint highlight that fades to the surface colour over 1200ms.
- [ ] The list returns to 0 when the row is inserted, not before.
- [ ] The header refresh button runs the same sequence.
- [ ] Rows use the 3-column grid: status dot, name + version over meta, time over duration; the dot and time span both rows.
- [ ] Row surface `#1c1f25`, border `#2b3039`, radius 14px, 8px gap, 16px gutters.
- [ ] Reduced motion: no drop-in, slow spin, no live pulse; the highlight still fades.
- [ ] No timers under 16ms and no scroll-jacking outside the pull.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: header "ORBITAL · EU-1 / Deployments" with a 40px round refresh button; nine deployment rows, the first with a pulsing live ring around its status dot. The ring indicator is invisible (opacity 0).
2. Press on the list at `scrollTop 0` and drag down: the list translates by `min(120, dy × .55)` px with no transition. The ring fades in over 160ms and its `stroke-dashoffset` goes from the full circumference (62.83) to 0 as pull goes 0 → 80px; it also scales from 0.6 to 1.
3. Drag back up above 0: the list returns to 0 and the ring hides.
4. Release under 80px: the list springs back to 0 over 420ms `cubic-bezier(.32,.72,0,1)`.
5. Release at or beyond 80px: the list snaps to 64px (same spring); the stage gets `loading`; the ring's arc jumps to `stroke-dashoffset 16` (about 75%) and rotates continuously, 800ms per revolution, linear. `aria-busy="true"` is set on the feed.
6. After 1200ms a new row ("checkout v3.2.0 · Deploying · 3 of 6 pods") is prepended. It animates in (`translateY(-8px)`, opacity 0 → 1, 360ms spring) and its background/border flash mint (`rgba(94,234,212,.18)` / `#5eead4`) holding for the first 25% then fading to the row surface by 1200ms. The list springs back to 0 and `aria-busy` returns to false.
7. Pulling again while loading does nothing. Each refresh cycles through three prepared rows so repeated pulls keep adding.
8. Tap the header refresh button: identical to step 5 onward.
9. The feed scrolls normally otherwise; a drag that starts with `scrollTop > 0` is a scroll, not a pull.

## Tokens

```css
:root {
  /* colour — charcoal surfaces, mint accent, three status hues */
  --bg: #14161a;
  --surface: #1c1f25;       /* rows */
  --surface-2: #23272f;
  --line: #2b3039;          /* row border, ring track, header hairline */
  --ink: #ecebe6;
  --ink-2: #a3a59e;         /* meta, relative time */
  --ink-3: #6c6f6a;         /* eyebrow, durations */
  --accent: #5eead4;        /* ring, refresh hover, highlight border */
  --accent-ink: #062a24;
  --ok: #5eead4;  --warn: #f2c14e;  --bad: #f0665b;
  --highlight: rgba(94,234,212,.18);

  /* type */
  --font: "Sora", system-ui, -apple-system, sans-serif;

  /* gesture geometry */
  --threshold: 80px;        /* pull needed to trigger */
  --hold: 64px;             /* list offset while loading */
  --max-pull: 120px;        /* cap on translate */
  --pull-ratio: .55;        /* list travel per finger px */
  --ring: 28px;  --ring-r: 10;  --ring-c: 62.83;  --ring-stroke: 2.5px;
  --ring-spin-offset: 16;   /* ≈ 75 % arc while loading */

  /* layout */
  --r-row: 14px;  --row-gap: 8px;  --row-pad: 12px 14px;  --gutter: 16px;
  --dot: 10px;

  /* motion */
  --t-micro: 160ms;
  --t-enter: 360ms;
  --t-snap: 420ms;
  --t-spin: 800ms;
  --t-highlight: 1200ms;
  --t-load: 1200ms;         /* simulated network */
  --spring: cubic-bezier(.32, .72, 0, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role          | Family | Size | Weight | Line-height | Tracking | Case |
|---------------|--------|-----:|-------:|------------:|---------:|------|
| Body / meta   | Sora   | 12px | 400    | 1.45        | 0        | sentence |
| Eyebrow       | Sora   | 12px | 500    | 1.2         | +0.08em  | UPPERCASE |
| Page title    | Sora   | 24px | 600    | 1.1         | −0.02em  | sentence |
| Service name  | Sora   | 14px | 600    | 1.45        | −0.01em  | as written (kebab-case) |
| Version       | Sora   | 14px | 400    | 1.45        | 0        | `tabular-nums`, `--ink-3` |
| Relative time | Sora   | 12px | 500    | 1.3         | 0        | `--ink-2`, right-aligned |
| Duration      | Sora   | 12px | 400    | 1.3         | 0        | `--ink-3`, `tabular-nums` |

## Implementation notes

**Drive the ring from one custom property.** The JS writes `--p`; the SVG reads it:

```css
.ring circle { fill: none; stroke: var(--accent); stroke-width: 2.5; stroke-linecap: round;
  stroke-dasharray: 62.83; stroke-dashoffset: calc(62.83 * (1 - var(--p, 0))); }
.ring { transform: rotate(-90deg) scale(calc(.6 + .4 * var(--p, 0))); opacity: var(--p, 0); }
.stage.loading .ring { animation: spin 800ms linear infinite; opacity: 1; }
.stage.loading .ring circle { stroke-dashoffset: 16; }
@keyframes spin { to { transform: rotate(270deg) scale(1); } }
```

**Pull only from the top, snap only on release:**

```js
function setPull(v, snap) {
  pull = v; stage.classList.toggle('snap', !!snap);
  stage.style.setProperty('--p', Math.min(1, v / 80).toFixed(3));
  feed.style.transform = `translateY(${v}px)`;
}
feed.addEventListener('pointerdown', e => { if (busy || feed.scrollTop > 0) return; drag = true; startY = e.clientY; feed.setPointerCapture(e.pointerId); });
feed.addEventListener('pointermove', e => { if (!drag) return; const dy = e.clientY - startY; setPull(dy <= 0 ? 0 : Math.min(120, dy * .55), false); });
feed.addEventListener('pointerup', () => { if (!drag) return; drag = false; pull >= 80 ? refresh() : setPull(0, true); });
```

**Highlight as a keyframe, not a transition**, so the hold-then-fade shape is explicit and replays on every insert:

```css
.row.new { animation: enter 360ms var(--spring), highlight 1200ms var(--ease); }
@keyframes highlight { 0%, 25% { background: var(--highlight); border-color: var(--accent); } 100% { background: var(--surface); border-color: var(--line); } }
```

Common mistakes: translating the `<ul>` instead of the scroll container (the scrollbar and hit-testing drift); starting a pull when `scrollTop > 0`; leaving the transition on during the drag; using `touch-action: none` (kills scrolling); relying on `transitionend` for the highlight (a keyframe with `animationend` is deterministic).

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
