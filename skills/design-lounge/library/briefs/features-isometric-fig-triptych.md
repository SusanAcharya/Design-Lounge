<!-- Design Lounge Nº 282 · "Isometric figure triptych" · www.designlounge.live -->

# Isometric figure triptych

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Studied from linear.app: the "principles" band under the hero, where three line-only isometric objects sit in hairline-divided columns labelled like figures in a technical manual. This version is for an invented planning tool, Forgeline, in warm olive-black and bone with one amber signal. The drawings are generated from a tiny isometric projection function, so each one can move between a resting and an exploded state: slabs spread, a cap cube lifts off its base, a row of cycle panels re-forms into a wave. It should feel like an engineer's notebook: quiet, exact and slightly proud. The detail worth copying is that the illustrations are geometry, not images, so hover can take them apart.

## Structure

```
┌──────────────────────────────── 1280 × 800 ────────────────────────────────┐
│  ■ HOW FORGELINE IS BUILT                                    mono 11px      │ padding 64/40
│  A planning tool with opinions. Forgeline keeps roadmaps,                  │ h2 40/1.14, max 980
│  cycles and reviews on one quiet surface, so the hours go to               │
│  the work and not to the tracker.                                          │
│                                                                             │ 64px
├─────────────────────────┬─────────────────────────┬─────────────────────────┤ 1px rule
│ FIG 0.1          LAYERS │ FIG 0.2         MODULES │ FIG 0.3         CADENCE │ mono 10px
│                         │                         │                         │
│     [ slab stack ]      │     [ cube cluster ]    │    [ panel row ]        │ svg 236px tall
│                         │                         │                         │ viewBox 340×260
│ One source, many views  │ Teams as modules        │ Cycles in rhythm        │ 18px
│ Roadmap, board and …    │ Each team owns its …    │ Two-week cycles …       │ 14.5px, 32ch
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │ dashed
│ 07 LAYERS 1 RECORD …    │ 05 TEAMS OWN STATES …   │ 12 CYCLES 14 DAYS …     │ mono 10px
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
       first column has no left padding; last has no right padding; 28px otherwise
```

- `section[aria-labelledby]`, max-width 1200px, centred with `margin: auto` inside a flex body (do not use `align-items: center`, which clips the top on short screens).
- Kicker `p`, `h2` with a `span` for the muted continuation.
- `.figs` is a three-column grid; each column is an `a.fig` (it leads to a detail page) containing caption `div`, `svg[aria-hidden]`, `h3`, `p`, spec `div`.
- The SVG is rebuilt from code on every animation frame; it has no static children.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Drawing wipe | load | clip-path inset | 100% 0 0 0 → 0 | 900ms, +120ms stagger | expo | none |
| Drawing state | pointerenter / focus | p (geometry) | 0 → 1 | 650ms | 1 − (1 − t)^4 | instant |
| Stroke colour | with p | stroke | `--stroke` → `--stroke-on` | with p | with p | instant |
| Amber part | with p | stroke / fill | rest → amber | with p | with p | instant |
| Sibling dim | hover / focus | opacity | 1 → 0.42 | 350ms | standard | instant |
| Title arrow | active | opacity, translateX | 0, −4px → 1, 0 | 200 / 250ms | standard | instant |
| Caption number | active | colour | `--bone-2` → amber | 250ms | standard | instant |

Interpolate from the current p, not from 0, whenever the target changes, so fast sweeps across the row never snap.

## States

- Rest: all drawings dim, all columns at full opacity.
- Active (hover or focus-visible): that column's drawing exploded and lit, caption number amber, arrow visible; siblings at 42%.
- Focus-visible: a 1px amber frame 6px outside the column (inset to the rules), plus the active state. The default outline is removed only because this frame replaces it.
- Pressed: the link navigates; there is no separate pressed style.
- No loading, empty or error states: the drawings are generated locally.

## Accessibility

- Each column is a single link. Its accessible name is the title (the `h3` text); the description is attached with `aria-describedby`.
- Drawings are `aria-hidden="true"`; the caption and spec text carry the meaning in words.
- Tab moves through the three columns in reading order; focus triggers the same explosion as hover, and blur returns it.
- Contrast: `#ECE8DC` on `#0E100D` ≈ 15:1; `#A19D90` ≈ 7:1; `#6E6B61` ≈ 3.6:1, so use it only for 10–11px uppercase mono labels and the large 40px continuation, never for body copy.
- The dimming is cosmetic; dimmed columns stay focusable and readable at 42%.

## Responsive rules

- ≥ 1200: as drawn.
- 1024: columns narrow; drawings keep their 236px height and scale to fit the width (viewBox `meet`).
- < 900: one column; each figure gets a bottom rule instead of a side rule; drawing height 220px; heading 32px; sibling dimming on hover is turned off (no hover on touch).
- < 480: section padding 44px 20px; heading 26px.
- At 375 nothing overflows horizontally and the page scrolls from the kicker.

## Acceptance checklist

### Always

- [ ] Exactly three figures in hairline-divided columns, each with a mono "FIG 0.x" caption.
- [ ] Drawings are line-only isometric geometry with background-filled faces, generated in code.
- [ ] Each drawing has a rest state and an exploded state; hover and keyboard focus both trigger it.
- [ ] Exactly one amber element lights per drawing; the rest of the palette is neutrals.
- [ ] Siblings dim to ~42% while one column is active.
- [ ] Re-targeting mid-animation continues from the current position.
- [ ] Statement heading is two-tone in one `h2`.
- [ ] Reduced motion switches states instantly and skips the wipe.
- [ ] No horizontal overflow and no clipped top at 375px.

### This demo

- [ ] Brand Forgeline; kicker "HOW FORGELINE IS BUILT".
- [ ] Figures: "One source, many views" (7 slabs), "Teams as modules" (2×2 + cap cube), "Cycles in rhythm" (12 panels, ninth is amber).
- [ ] Spec rows: "07 LAYERS 1 RECORD 0 SYNC JOBS", "05 TEAMS OWN STATES SHARED CORE", "12 CYCLES 14 DAYS AUTO ROLL".
- [ ] Rest stroke `#4B4C43`, active `#D9D4C3`, signal `#F2B33D` on `#0E100D`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: a mono kicker with an amber 6px square ("HOW FORGELINE IS BUILT"), a 40px two-tone `h2`, then three columns under a 1px top rule, split by 1px vertical rules.
2. Each column has a mono caption row ("FIG 0.1" left, "LAYERS" right), a 236px-tall drawing, an 18px title, a 14.5px description, and a dashed-rule spec row in mono ("07 LAYERS · 1 RECORD · 0 SYNC JOBS").
3. On load, the three drawings wipe up from the bottom (clip-path inset 100% → 0, 900ms expo), staggered 120ms.
4. At rest every stroke is `#4B4C43` on the background: low-contrast, like a blueprint you have to lean into.
5. Hovering or focusing a column eases its drawing from p = 0 to p = 1 over 650ms (quartic out). Strokes brighten to `#D9D4C3`, the caption number turns amber, and an arrow slides in after the title (4px, 250ms). The other two columns fade to 42% opacity.
6. FIG 0.1 "One source, many views": seven 104×104 slabs, 6 high. Gaps grow from 9 to 19 units, the top slab lifts a further 12, dashed guides appear from the bottom corners to the top, and four of the 25 dots on the top face turn amber and grow.
7. FIG 0.2 "Teams as modules": a 2×2 base of 54-unit cubes with a cap cube on top. The base spreads (gap 6 → 36), the cap lifts 36 units with a dashed amber plumb line, and its outline and top face turn amber.
8. FIG 0.3 "Cycles in rhythm": twelve 92-wide, 3-deep panels in depth order, heights falling from 110 to 30 front to back. On hover they re-form into a sine wave (48 ± 50) and panel nine turns amber, the current cycle.
9. Leaving the row returns all drawings to rest from wherever they are; interrupting mid-animation never jumps.
10. With reduced motion, the wipe is skipped and the drawings switch states instantly; the dimming still happens.

## Tokens

```css
:root {
  --bg: #0E100D;         /* page, and fill of every face so it hides what's behind */
  --bg-2: #141611;
  --bone: #ECE8DC;       /* heading lead, titles */
  --bone-2: #A19D90;     /* descriptions, active caption number */
  --bone-3: #6E6B61;     /* heading continuation, captions, specs */
  --rule: #24261F;       /* column rules, dashed spec rule */
  --stroke: #4B4C43;     /* drawing at rest */
  --stroke-on: #D9D4C3;  /* drawing active */
  --amber: #F2B33D;      /* the one signal per drawing */
  --amber-fill: #3A2F14; /* lit top faces */

  --sans: "Familjen Grotesk", system-ui, sans-serif;
  --mono: "Martian Mono", ui-monospace, monospace;

  --col-pad: 28px; --gap-head: 64px;
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --t-fig: 650ms; --t-dim: 350ms; --t-wipe: 900ms;
}
```

## Typography

| Role | Family | Size / line | Weight | Tracking | Case / colour |
| --- | --- | --- | --- | --- | --- |
| Kicker | Martian Mono | 11px | 300 | 0.08em | upper, `--bone-3` |
| Statement | Familjen Grotesk | 40px / 1.14 | 500 | -0.025em | lead `--bone`, rest `--bone-3` |
| Caption | Martian Mono | 10px | 300 (number 400) | 0.1em | upper, `--bone-3` / `--bone-2` / amber |
| Title | Familjen Grotesk | 18px | 500 | -0.01em | `--bone` |
| Description | Familjen Grotesk | 14.5px / 1.5 | 400 | 0 | `--bone-2`, max 32ch |
| Spec row | Martian Mono | 10px / 1.4 | 300 | 0.06em | upper, `--bone-3`, tabular |

## Implementation notes

**1. One projection, one box.** Everything is built from a box drawn as three faces (front-left, front-right, top), each filled with the page background so nearer boxes hide farther ones. Draw in painter's order: back to front by `x + y`, and lower `z` first.

```js
const iso = (cx, cy) => (x, y, z) => [cx + (x - y) * 0.866, cy + (x + y) * 0.5 - z];
const poly = pts => 'M' + pts.map(p => p.join(' ')).join('L') + 'Z';
function box(P, x, y, z, w, d, h, stroke, top = BG) {
  const left  = [P(x, y+d, z), P(x+w, y+d, z), P(x+w, y+d, z+h), P(x, y+d, z+h)];
  const right = [P(x+w, y, z), P(x+w, y+d, z), P(x+w, y+d, z+h), P(x+w, y, z+h)];
  const lid   = [P(x, y, z+h), P(x+w, y, z+h), P(x+w, y+d, z+h), P(x, y+d, z+h)];
  return `<path d="${poly(left)}${poly(right)}" fill="${BG}" stroke="${stroke}"/>` +
         `<path d="${poly(lid)}" fill="${top}" stroke="${stroke}"/>`;
}
```

**2. Animate a single number.** Each figure is a pure function `draw(p)` that returns SVG markup for any p between 0 and 1. A small rAF loop eases p toward its target and only re-renders figures that are moving, then stops.

```js
function tick(now) {
  let busy = false;
  for (const f of figs) {
    if (f.p === f.target) continue;
    const k = reduce ? 1 : Math.min(1, (now - f.start) / 650);
    f.p = f.from + (f.target - f.from) * (1 - (1 - k) ** 4);
    if (k >= 1) f.p = f.target; else busy = true;
    f.svg.innerHTML = f.draw(f.p);
  }
  raf = busy ? requestAnimationFrame(tick) : 0;
}
```

**3. Fit the exploded state, not the rest state.** Size each drawing so its p = 1 pose fits the 340×260 viewBox; the rest pose then sits a little low, which reads as the object "settling". Don't rely on `overflow: visible` to rescue it: the load wipe uses `clip-path`, so run that animation with `animation-fill-mode: backwards` and the clip disappears when it ends.

Common mistakes:

- Mixing colours with a helper that only parses hex, then feeding it an `rgb()` result: the stroke becomes invalid and faces vanish. Interpolate from the hex tokens each time.
- Using CSS `scaleY` to grow the panels; it skews the isometric base edge. Recompute the geometry instead.
- Raster or Lottie illustrations, which can't be taken apart on hover.
- More than one accent colour per figure.
- Dimming on touch layouts, where there is no hover to undo it.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
