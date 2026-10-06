<!-- Design Lounge Nº 042 · "Now playing" · www.designlounge.live -->

# Now playing

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The now-playing sheet of "Marrow", a music app. There is no image: the 326px album art is a layered CSS gradient (a warm orange-to-plum diagonal with a gold radial at the top-left) with an inline SVG `feTurbulence` grain blended in soft-light at 28%. The same gradient, blurred 48px and darkened, fills the screen behind everything so the UI sits in the record's colour. Below the art: title and artist, a scrubber whose 6px thumb grows to 18px while dragging and whose track thickens, a play/pause button whose SVG path morphs between the two glyphs over 280ms, a thumbless volume slider, and four lines of lyrics that highlight and scroll as playback time passes. Pausing shrinks the art to 86%; playing grows it back with a spring.

## Structure

```
390 × 844
┌────────────────────────────────────────┐
│ (54 status)  blurred art fills bg      │
│ 60         ▬ grabber 36×5              │
│    ┌────────────────────────────┐      │
│    │ art 326×326, r14      (◎)  │      │  gradient + grain
│    │                            │      │
│    │ MARROW                     │      │
│    └────────────────────────────┘      │
│  Copper Wire (22/600)            (…)   │
│  Marrow · Low Tide Radio (16, 66%)     │
│  ━━━━━━━━●───────────────────────      │  scrubber 36 tall, track 6
│  1:08                          −2:26   │
│        ◀◀     (  ▌▌  72  )    ▶▶       │
│  🔈 ━━━━━━━━━━━━━━━───────── 🔊        │  volume (icons are SVG)
│ ───────────────────────────────────────│ hairline
│  Salt on the window, the kettle… (past)│  lyrics, 90px window
│  Copper wire humming a song…    (on)   │
│  The tide keeps its hours…             │
│                                   44   │
└────────────────────────────────────────┘
```

- `.bgart` (aria-hidden): absolute, `inset:-40px`, the art gradient with `filter: blur(48px) saturate(140%)`, opacity .85, `scale(1.1)`; `::after` darkens top→bottom (15% → 70% of `--bg`).
- `.screen`: flex column, `padding: 60px 32px 44px`, class `playing` toggled.
- `.art[aria-label]`: `::before` gradient stack, an inline `<svg class="grain">` (feTurbulence rect, aria-hidden), a wordmark `<b>` bottom-left and a ring glyph top-right.
- `.meta`: `<h1>` + `<p>` and a 40px glass "More" `<button>`.
- `.scrub[role=slider tabindex=0]`: 36px tall hit area, `.bar` → `.fill` (width `--pct`) and `.thumb` (left `--pct`).
- `.times`, `.ctls` (Previous / Play / Next), `.vol` (`<input type=range>` between two SVGs), `.lyrics` (`<p data-t>` × 4).

## Motion

| Element        | Trigger          | Property            | From → To                       | Duration | Easing     | Notes |
|----------------|------------------|---------------------|---------------------------------|---------:|------------|-------|
| `.art`         | pause / play     | transform, box-shadow | scale 1 ↔ .86                 | 520ms    | `--spring` | |
| `#pp` path     | pause / play     | `d`                 | bars ↔ triangle halves          | 280ms    | `--spring` | CSS `d: path()`; same command count |
| `.bar`         | scrub press      | height              | 6px ↔ 10px                      | 160ms    | `--ease`   | |
| `.thumb`       | scrub press      | width, height, margin | 6px ↔ 18px                    | 160ms    | `--ease`   | shadow appears at 18px |
| `.fill`, `.thumb` | playback      | width / left        | follows `--pct`                 | 0        | —          | set per frame |
| `.lyrics p`    | line change      | color, transform    | dim ↔ ink; `translateY(−(i−1)·23px)` | 280ms | `--ease` | |
| `.ctl`         | :active          | transform           | 1 → scale(.9)                   | 160ms    | `--ease`   | |
| `.icon`        | hover            | background          | 10% → 18% ink                   | 160ms    | `--ease`   | |

Reduced motion: all transitions 1ms (the glyph swaps instantly, art snaps between sizes, lyrics jump). Playback timing is unaffected.

## States

- **Playing:** `.screen.playing`, art at scale 1, `#play[aria-pressed=true][aria-label=Pause]`.
- **Paused:** art at .86, play glyph, no rAF loop running.
- **Scrubbing:** `.scrub.drag`, fat thumb, thick track; time labels update but the rAF does not overwrite `t`.
- **Ended:** paused at 214 s; remaining reads "−0:00".
- **Lyric line:** `.on` (ink), `.past` (38% ink at 50% opacity), upcoming (38% ink at 70% opacity).
- **Focus-visible:** scrubber → 2px `--accent` ring on the track; controls → 2px ring with 4px offset; More → 2px ring, 2px offset; volume → 2px outline, 2px offset.

## Accessibility

- The scrubber is `role="slider"` with `aria-valuemin/max/now` in seconds and `aria-valuetext` like "1:08 of 3:34"; ArrowLeft/Right move 5 s. Its hit area is 36px tall although the track is 6px.
- Play/pause is one `<button>` whose `aria-label` flips between "Pause" and "Play" and whose `aria-pressed` reflects playing.
- Volume is a native `<input type="range" aria-label="Volume">`; the thumb is hidden visually but keyboard and touch still work because the input is 28px tall.
- The art has `aria-label` naming the album; the backdrop is `aria-hidden`.
- Lyrics are `aria-live="off"` (they change every few seconds; announcing them would be noise).
- Contrast: `--ink` on the darkest backdrop region ≥ 12:1; `--ink-2` ≥ 7:1; `--ink-3` is only used for 12px times and dimmed lyrics that are not the current line.
- Hit targets: play 72px, skips 34px icons inside 44px buttons, More 40px, scrubber 36px tall.

## Responsive rules

- 360 wide: art 296px (`min(326px, 100vw − 64px)`); everything else unchanged.
- ≥ 430 wide: keep the art at 326px and centre the column at 390px.
- Short viewports (< 760px): art 260px, lyrics window 66px (two lines).
- Tablet: art 420px on the left, controls and lyrics in a 360px column on the right; the blurred backdrop remains full-bleed.

## Acceptance checklist

- [ ] Album art is a 326px square with radius 14px, the two-layer gradient from the tokens, and an inline SVG `feTurbulence` grain at 28% soft-light; no raster image or external URL is loaded.
- [ ] The backdrop is the same gradient blurred 48px, saturated 140%, scaled 1.1 with a top-to-bottom darkening overlay.
- [ ] Playback time advances only while playing and the rAF loop stops when paused or ended.
- [ ] The scrubber thumb is 6px at rest and 18px while dragging; the track is 6px → 10px; both transition in 160ms.
- [ ] Dragging the scrubber sets the position to the pointer (clamped) and updates both time labels live; the remaining time uses U+2212.
- [ ] Play/pause morphs the SVG path via the CSS `d` property over 280ms; both paths have identical command sequences.
- [ ] Pausing scales the art to 0.86 over 520ms `cubic-bezier(.32,.72,0,1)`; playing restores it.
- [ ] Lyrics highlight the latest line whose timestamp ≤ current time and translate up by `(index − 1) × 23px` once the index is ≥ 2.
- [ ] Scrubber has `role="slider"` with live `aria-valuenow`/`aria-valuetext` and responds to arrow keys.
- [ ] Volume is a native range input, 28px tall hit area, thumb hidden, fill drawn from `--v`.
- [ ] Every control shows a visible focus ring; Reduced motion collapses all transitions to 1ms.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: playing. Art at scale 1 with a deep shadow; "Copper Wire / Marrow · Low Tide Radio"; scrubber at 1:08 of 3:34 (31.8%); remaining time "−2:26"; the second lyric line is highlighted, the first dimmed; volume at 62%.
2. Time advances in real time via `requestAnimationFrame` only while playing (no loop when paused). The scrubber, both time labels and `aria-valuenow` update every frame.
3. Lyric lines have timestamps (60, 66, 73, 80 s). The latest line whose time ≤ current is `on` (full ink); earlier lines are `past` (38% ink at 50% opacity); later lines are 38% ink at 70% opacity. When the current line index ≥ 2 the block translates up by `(index − 1) × 23px` so the current line stays second from the top. Colour and position transition over 280ms.
4. Tap play/pause: the glyph morphs (two bars ↔ two triangle halves) over 280ms `cubic-bezier(.32,.72,0,1)`; `aria-label` and `aria-pressed` flip; the art scales to 0.86 (paused) or 1 (playing) over 520ms with the same spring, and its shadow follows.
5. Press on the scrubber: the track grows from 6px to 10px and the thumb from 6px to 18px with a shadow, over 160ms; the position jumps to the pointer. Drag: position follows the pointer (clamped to 0–214 s); time labels update live; playback resumes from the released position. Release: track and thumb return to their rest sizes.
6. With the scrubber focused, ArrowLeft/ArrowRight nudge ±5 s.
7. Drag the volume slider: the filled portion follows (`--v`), no visible thumb.
8. At 3:34 playback stops and the button shows the play glyph; tapping it resumes from the end (the demo does not loop).
9. "Previous", "Next" and "More" are present with press states but do not change the track.

## Tokens

```css
:root {
  /* album art gradient */
  --art-a: #f2683b;  --art-b: #8e1f4a;  --art-c: #2a1230;  --art-d: #f7b955;
  --art-gradient: radial-gradient(120% 90% at 20% 15%, var(--art-d), transparent 45%),
                  linear-gradient(150deg, var(--art-a), var(--art-b) 58%, var(--art-c));
  --grain-opacity: .28;                    /* feTurbulence baseFrequency .9, 2 octaves, soft-light */

  /* surface + text (on the blurred art) */
  --bg: #1a0f16;
  --ink: #fff5ee;
  --ink-2: rgba(255,245,238,.66);          /* artist line */
  --ink-3: rgba(255,245,238,.38);          /* times, upcoming lyrics, volume icons */
  --track: rgba(255,245,238,.22);          /* scrubber + volume track, grabber */
  --accent: #ffb28a;                       /* focus rings only */
  --glass: rgba(255,245,238,.10);  --glass-line: rgba(255,245,238,.16);

  /* type */
  --font: "Familjen Grotesk", system-ui, -apple-system, sans-serif;

  /* geometry */
  --art: 326px;  --r-art: 14px;  --art-paused: .86;
  --art-shadow: 0 24px 60px rgba(0,0,0,.45), 0 2px 6px rgba(0,0,0,.3);
  --track-h: 6px;  --track-h-drag: 10px;  --thumb: 6px;  --thumb-drag: 18px;
  --play: 72px;  --skip-icon: 34px;  --play-icon: 40px;  --ctl-gap: 40px;
  --lyric-line: 23px;  --lyric-window: 90px;
  --duration: 214;                         /* seconds */

  /* motion */
  --t-micro: 160ms;
  --t-morph: 280ms;
  --t-art: 520ms;
  --spring: cubic-bezier(.32, .72, 0, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role          | Family           | Size | Weight | Line-height | Tracking | Case |
|---------------|------------------|-----:|-------:|------------:|---------:|------|
| Song title    | Familjen Grotesk | 22px | 600    | 1.2         | −0.015em | sentence |
| Artist line   | Familjen Grotesk | 16px | 400    | 1.4         | 0        | sentence, `--ink-2` |
| Wordmark      | Familjen Grotesk | 13px | 700    | 1           | +0.18em  | UPPERCASE, 85% ink |
| Times         | Familjen Grotesk | 12px | 500    | 1.4         | 0        | `tabular-nums`, U+2212 for remaining |
| Lyrics        | Familjen Grotesk | 17px | 500    | 1.35        | 0        | sentence |

## Implementation notes

**Path morph with the CSS `d` property.** Attribute changes do not transition; the CSS property does, provided both paths have the same commands in the same order. Use two subpaths of `M L L L Z` for both glyphs (the second triangle half repeats a point):

```js
const PAUSE = "M6 4L10 4L10 20L6 20ZM14 4L18 4L18 20L14 20Z";
const PLAY  = "M7 4L13 8L13 16L7 20ZM13 8L19 12L19 12L13 16Z";
function setPlaying(p) {
  playing = p; last = 0;
  pp.style.d = `path("${p ? PAUSE : PLAY}")`; pp.setAttribute('d', p ? PAUSE : PLAY);   // attribute is the fallback
  play.setAttribute('aria-label', p ? 'Pause' : 'Play'); play.setAttribute('aria-pressed', String(p));
  screen.classList.toggle('playing', p);
  if (p) requestAnimationFrame(tick);
}
```

```css
.ctl.play path { transition: d 280ms cubic-bezier(.32,.72,0,1); }
```

**Grain without an image**, as an inline SVG filter layered over the gradient (inline SVG needs no `xmlns`, and nothing is fetched):

```html
<div class="art">
  <svg class="grain" aria-hidden="true">
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/></filter>
    <rect width="100%" height="100%" filter="url(#grain)"/>
  </svg>
</div>
```

```css
.grain { position: absolute; inset: 0; width: 100%; height: 100%; opacity: .28; mix-blend-mode: soft-light; pointer-events: none; }
```

**Frame loop that stops itself** — advance by real elapsed time and return early when paused:

```js
function tick(now) {
  if (!playing) return;
  if (last) t = Math.min(DUR, t + (now - last) / 1000); last = now;
  if (!drag) render();
  if (t >= DUR) { setPlaying(false); return; }
  requestAnimationFrame(tick);
}
```

Common mistakes: morphing between paths with different command counts (the browser snaps); using `setInterval` for time; letting the rAF loop overwrite the scrub position mid-drag (guard with `drag`); a 0-height range thumb without giving the input height (unreachable by touch); `overflow:hidden` on the screen clipping the art's shadow.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
