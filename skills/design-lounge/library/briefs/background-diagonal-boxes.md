<!-- Design Lounge Nº 212 · "Diagonal boxes background" · designlounge.vercel.app -->

# Diagonal boxes background

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A full-frame isometric cube pattern drawn on one `<canvas>` behind a short hero for a fictional architecture practice, "Cubit Studio". Every tile is a three-face cube in one hue: a light top, a mid left face, a dark right face. Cubes within 230px of the pointer **rise**: the top face moves up by up to 24px while both side faces stretch to meet it, and the faces lighten in step. The field looks like a relief model pressed up from below. The detail worth copying is that nothing is faked with CSS 3D: each cube is three polygons, drawn back-to-front row by row, so a raised cube correctly overlaps the cube behind it and is overlapped by the cube in front. A floating panel switches Graphite and Chalk tones, the box size (S/M/L), and the lift height.

## Reference behaviour

1. First frame: graphite tone, medium boxes (side 30px), and a cluster already raised around (74%, 62%) of the viewport, so the effect is visible before the pointer arrives.
2. Moving the pointer re-targets every cube's lift from its distance to the pointer, with a smoothstep falloff over 230px. Each cube eases 16% of the way to its target per frame.
3. The animation loop runs only while any cube is still more than 0.05px from its target. When everything settles, `requestAnimationFrame` stops. An idle page uses no CPU.
4. Leaving the window drops every target to 0, and the field settles flat.
5. Tone: Graphite / Chalk swaps the three face ramps and the page tokens instantly. Exactly one is pressed.
6. Box size: S 20px, M 30px, L 44px side. The grid rebuilds and the current lift is applied without easing, so the change reads as a swap.
7. Lift slider: 0–48px in steps of 4, default 24. The value is shown as "24 px" next to the label. 0 makes the field a flat pattern.
8. Reduced motion: the pointer does not move the field. The initial raised cluster stays as a static composition, and the hint reads "Reduced motion: the field stays still." Tone, size and lift still redraw one static frame.
9. Links and buttons over the field have 160ms colour transitions and a 2px ink focus ring.

## Structure

```
1280 × 800  (canvas fixed, inset 0)
┌──────────────────────────────────────────────────────────────────────┐
│ ⬡ Cubit Studio                         WORK  STUDIO  JOURNAL  CONTACT │ nav 84
│                                                    ┌ panel 236 ────┐ │
│ [ARCHITECTURE & INTERIORS · PORTO]  scrim chip      │ TONE  [G][C]  │ │ top 112
│                                                    │ BOX SIZE [S M L]│ │ right 64
│ We build rooms                        88px          │ LIFT ───◆── 24 │ │
│ that hold still.                                    │ hint           │ │
│ [sub 18px on scrim, max 470]                        └────────────────┘ │
│ [See the 2026 projects →] [Book a site visit]      ▲▲▲ raised cluster │
│                                                   ▲▲▲▲▲              │
├───────────────────────┬───────────────────────┬──────────────────────┤
│ Casa Lumen, Gaia 2025 │ Reading room, Braga   │ Atelier Rua Nove     │ project strip
└───────────────────────┴───────────────────────┴──────────────────────┘
 side padding 64px; strip bottom margin 40px
```

- `<canvas aria-hidden="true">` fixed, full viewport, backing store × `min(devicePixelRatio, 2)`.
- `.page` is a flex column with `pointer-events: none`; links and buttons re-enable them so pointer moves always reach `window`.
- `<nav aria-label="Main">` with brand (inline cube glyph) and four links.
- `<main class="hero">`: kicker chip, `<h1>`, sub on a scrim, two links.
- `<ul class="work" aria-label="Recent projects">`: three items with name and mono meta.
- `.panel role="group"`: two segmented groups of `aria-pressed` buttons and a labelled range input with an `<output>`.

## Tokens

```css
:root {
  /* graphite — the three faces, flat */
  --face-top: #2b2d31;
  --face-left: #222428;
  --face-right: #1a1b1e;     /* also page background */
  /* raised ramp ends (top / left / right at full lift) */
  --face-top-hi: #686b72;
  --face-left-hi: #3d3f45;
  --face-right-hi: #2b2d31;

  --ink: #ecedef;            /* headline, active segment fill */
  --ink-2: #a3a6ac;          /* sub, links, labels */
  --ink-3: #7b7e85;          /* project meta, hint */
  --line: rgba(236, 237, 239, .14);
  --scrim: rgba(26, 27, 30, .78);   /* behind chip, sub, panel, buttons */

  --font: "Familjen Grotesk", system-ui, sans-serif;
  --mono: "Spline Sans Mono", ui-monospace, monospace;

  --box-s: 20px; --box-m: 30px; --box-l: 44px;
  --lift-default: 24px; --lift-max: 48px;
  --lift-radius: 230px;
  --ease-k: .16;             /* per-frame approach factor */

  --ease: cubic-bezier(.2, .7, .2, 1);
  --t-fast: 160ms;
  --r: 2px;
}

:root[data-tone="chalk"] {
  --face-top: #ecebe6; --face-left: #d6d3cc; --face-right: #bfbbb2;
  --face-top-hi: #ffffff; --face-left-hi: #e6e4de; --face-right-hi: #d0cdc5;
  --ink: #18191b; --ink-2: #45474c; --ink-3: #5d6066;
  --line: rgba(24, 25, 27, .16); --scrim: rgba(236, 235, 230, .82);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Headline | Familjen Grotesk | 88px | 500 | 0.95 | −0.045em | sentence, balanced |
| Sub | Familjen Grotesk | 18px | 400 | 1.55 | 0 | sentence |
| Brand | Familjen Grotesk | 19px | 600 | 1 | −0.02em | Title |
| Buttons | Familjen Grotesk | 15px | 500 | 1 | 0 | sentence |
| Project name | Familjen Grotesk | 15px | 500 | 1.5 | 0 | Title |
| Nav links, kicker | Spline Sans Mono | 12px | 500 | 1 | 0.08em | UPPER |
| Panel labels | Spline Sans Mono | 11px | 500 | 1 | 0.06em | UPPER |
| Project meta | Spline Sans Mono | 12px | 400 | 1 | 0 | as written |

## Motion

| Thing | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|---|
| Cube lift | pointermove | top face y, side face height, face colour step | current → target (0–lift) | until within 0.05px | exponential approach, 16% per frame | off; static cluster |
| Field settle | pointerleave | lift | current → 0 | until settled | same | off |
| Size change | click S/M/L | grid rebuild | — | instant | — | instant |
| Tone change | click | ramps, tokens | — | instant | — | instant |
| Buttons, links | hover | colour, background | — | 160ms | `--ease` | 1ms |

Falloff per cube, `d` = distance from pointer to the cube's top-face centre:

```
u = 1 − d / 230            (only when d < 230)
target = lift × u² × (3 − 2u)
colour step k = round(current / 48 × 16 × 1.6), clamped to 16
```

## States

- **Flat:** all cubes at their base colours.
- **Raised:** top face shifted up by `l`, side faces taller by `l`, all three faces using ramp step `k` (17 steps from base to hi).
- **Segment pressed:** filled `--ink`, text `--face-right`. Resting segments are transparent with `--ink-2` text; hover brings text to `--ink`.
- **Range:** 1px track `--ink-3`; 14px square thumb rotated 45° in `--ink`, so the thumb is itself a tiny box.
- **Focus-visible:** 2px `--ink` outline, offset 3px; inside segments, offset −2px.
- **Buttons:** outline button fills with `--ink` on hover; primary fades to `--ink-2`.

## Accessibility

- The canvas is decorative (`aria-hidden="true"`). No information lives only in the field.
- The motion is pointer-driven and stops when the pointer stops, so no pause control is required; reduced motion disables it entirely.
- Panel: `role="group"` labelled "Background controls"; each segmented set is a `role="group"` with its own label; buttons use `aria-pressed`. The lift slider has a real `<label for>` and an `<output for>` that reads "24 px".
- Tab order: brand → four nav links → two hero links → Graphite → Chalk → S → M → L → Lift.
- Text sits on `--scrim` backings (chip, sub-copy, buttons, project strip), so contrast does not depend on what the cubes are doing: `#a3a6ac` on the scrim over graphite is 7:1, `#45474c` on the chalk scrim is 8:1.
- Segment buttons are 32px tall; the slider has a 24px hit band.

## Responsive rules

- ≥ 1280: as specified. The grid is rebuilt on resize from the box size, so cubes never scale; the field only gains or loses tiles.
- 1024–1279: headline 68px, the third project hides.
- 768–1023: the project strip hides; the panel docks to bottom-right (24px insets).
- < 640: 24px page padding, nav links hide, headline 46px, sub 16px. The panel spans the bottom (24px insets) as a two-column grid: Tone and Box size side by side, Lift full width, the hint hidden.
- Cap the backing store at DPR 2. Cull cubes whose centre is more than two half-widths outside the viewport.

## Acceptance checklist

### Always

- [ ] Cubes are three polygons each (top rhombus, left face, right face) on a pointy-top hex lattice: column step `side × √3`, row step `side × 1.5`, odd rows offset by half a column.
- [ ] Rows are drawn top to bottom so raised cubes overlap correctly.
- [ ] A raised cube moves only its top face; the bottom vertex stays fixed and the sides stretch.
- [ ] Face colours come from precomputed ramps. No colour strings are built per cube per frame.
- [ ] The rAF loop stops when all cubes are within 0.05px of target.
- [ ] Pointer leaving the window flattens the field.
- [ ] Reduced motion: no pointer response, a static composition, controls still redraw.
- [ ] All copy sits on a scrim, readable in both tones.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] First frame: graphite, side 30px, a raised cluster centred at (74%, 62%).
- [ ] Headline "We build rooms that hold still." at 88px.
- [ ] Lift default 24px, range 0–48 step 4; sizes 20 / 30 / 44px.
- [ ] Chalk tone top face `#ecebe6`, raised to `#ffffff`.
- [ ] Projects: Casa Lumen, Gaia · Reading room, Braga · Atelier Rua Nove.

## Implementation notes

**Lattice and cube geometry.** Store cells flat as `[cx, cy, current, target]`:

```js
const h = S * Math.sqrt(3) / 2;           // half the hex width
const rows = Math.ceil((H + S * 2 + 60) / (S * 1.5)) + 1;
const cols = Math.ceil(W / (h * 2)) + 2;
for (let r = 0; r < rows; r++)
  for (let c = 0; c < cols; c++)
    cells.push(c * h * 2 - (r % 2 ? 0 : h), r * S * 1.5 - S, 0, 0);

// per cube, l = current lift
top:   (x, y-S-l) (x+h, y-S/2-l) (x, y-l)   (x-h, y-S/2-l)
left:  (x-h, y-S/2-l) (x, y-l) (x, y+S)     (x-h, y+S/2)
right: (x, y-l) (x+h, y-S/2-l) (x+h, y+S/2) (x, y+S)
```

**Self-stopping loop.** Only run frames while something is moving:

```js
function frame() {
  let moving = false;
  for (let i = 0; i < cells.length; i += 4) {
    const d = cells[i + 3] - cells[i + 2];
    if (Math.abs(d) > .05) { cells[i + 2] += d * .16; moving = true; }
    else cells[i + 2] = cells[i + 3];
  }
  draw();
  raf = moving ? requestAnimationFrame(frame) : 0;
}
function update() { targets(); if (!raf) raf = requestAnimationFrame(frame); }
```

**Colour ramps once per tone.** Interpolate 17 `rgb()` strings per face when the tone changes and index them with the lift step. Building strings inside the draw loop is the usual reason this effect drops frames.

Common mistakes:

- Drawing columns instead of rows. Raised cubes then poke through the cubes in front of them.
- Translating the whole cube up. It floats and leaves a hole; the base must stay put.
- Adding a drop shadow or a colour accent. The piece is monochrome on purpose; the lift and the lighter faces are the only signal.
- A loop that runs forever at 60fps on an idle page.
- Using CSS `transform: rotateX()` tiles, which breaks the overlap and costs a layer per tile.
- Leaving the first frame flat, so the viewer sees a wallpaper and does not know it reacts.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
