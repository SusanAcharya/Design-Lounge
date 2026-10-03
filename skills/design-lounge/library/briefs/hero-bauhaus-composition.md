<!-- Design Lounge Nº 096 · "Bauhaus composition hero" · designlounge.vercel.app -->

# Bauhaus composition hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The top of a website for a fictional design summer school, Werkhalle. On the left is a 136px black Archivo headline ("Shape / is a / verb.", with the last word in red), a short lede, a blue CTA and a three-cell stat row. On the right is a 560px square "poster" holding seven flat shapes in red, blue, yellow and black, printed with `mix-blend-mode: multiply` so overlaps darken the way overprinted ink does. Clicking the poster, or one of three Roman-numeral buttons, rearranges the same seven shapes into a different composition. Every shape moves, resizes and rotates on a 900ms expo-out curve with a 60ms stagger. What makes it worth copying: one set of DOM nodes, three coordinate tables, and the motion does all the work.

## Reference behaviour

1. Initial state: composition I ("Weight") is shown. The big red circle sits top-left, a black half-disc and ring top-right, a blue square bottom-right, a yellow triangle under the circle, and a black bar along the bottom. The caption reads "I / III · Weight · The circle anchors the corner." and button I is pressed.
2. The grid behind the shapes (70px squares, 1px `--line`) shows through every shape because of `multiply`.
3. Click anywhere on the poster: the poster advances to the next composition (I → II → III → I).
4. During the change, each shape transitions `transform` (translate + rotate), `width` and `height` over 900ms with `cubic-bezier(.16,1,.3,1)`. Shape *n* starts `n × 60ms` late (0–360ms across seven shapes).
5. Composition II ("Tension"): one 18 × 512px vertical bar splits the poster; the square tilts 12°, the half-disc flips 180° into a bowl, the circle drops bottom-right.
6. Composition III ("Rotation"): the bar crosses the poster at −32°, the square turns 45° into a diamond, the triangle points down, the half-disc stands on its side (90°).
7. Buttons I / II / III jump straight to that composition. Their `aria-pressed` reflects the current composition.
8. The caption updates its number, title and one-line description as the shapes move. It is a polite live region.
9. Clicking during a transition simply retargets: the CSS transitions pick up from the current in-flight values.
10. Nav links underline on hover (2px, 5px offset). The CTA turns from blue to black on hover; "Apply" in the nav turns red.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────────────┐
│ ●■▲ Werkhalle                     Programme Faculty Archive Visit  [APPLY]   │ 64 nav, 1px ink rule
├──────────────────────────────────────────────────────────────────────────────┤
│ S │ [FORM][COLOUR][TYPE]                  ┌──────────────── 560 ─────────────┐│
│ U │ Shape                                 │ grid 70px                        ││
│ M │ is a              136px / .84         │   ●        ◗                     ││
│ M │ verb. (red)                           │       ○                          ││
│ E │ lede 16px, 430px measure              │   ▲     ■                        ││
│ R │ [Apply by 31 January →]  Read the…    │ ▬▬▬▬▬▬▬▬▬▬▬▬     CLICK TO RECOMP ││
│   │ ─────────────────────────             └──────────────────────────────────┘│
│   │ 06 weeks │ 60 places │ €1,480         I / III  Weight  desc   [I][II][III] │
└──────────────────────────────────────────────────────────────────────────────┘
 56px gutters · columns: 1fr | 560px · gap 72px · hero padding 40 56 36
```

- `<nav aria-label="Main">`: logo link (three 14px marks: red disc, blue square, yellow triangle; then "Werkhalle" 18/900), `<ul>` of four links, black "Apply" link.
- `<main class="hero">`: two-column grid.
  - `.copy`: vertical rotated label (`writing-mode: vertical-rl; rotate(180deg)`), a kicker of three outlined mono tags, `<h1>`, `.lede`, `.ctas` (blue button + underlined mono link), `.meta` (3-column stat grid pushed to the bottom with `margin-top: auto`).
  - `.side`: `<button class="canvas">` containing seven `<span class="shape">` children plus a hint label; then `.caption` with the live text and a `role="group"` of three `aria-pressed` buttons.

## Tokens

```css
:root {
  /* neutrals: cool-warm grey paper, near-black ink */
  --bg: #ecebe6;          /* page */
  --canvas-bg: #f4f3ef;   /* poster ground */
  --ink: #141414;         /* text, rules, black shapes */
  --ink-2: #4a4944;       /* lede, caption */
  --ink-3: #77756e;       /* meta labels (11px mono) */
  --line: #cfcdc5;        /* poster grid, stat dividers */

  /* primaries */
  --red: #e1341e;         /* circle, "verb.", nav Apply hover */
  --blue: #1f4fbf;        /* square, CTA, focus ring */
  --yellow: #f2b705;      /* triangle, dot */

  /* type */
  --sans: "Archivo", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --fs-display: 136px;
  --fs-stat: 30px;
  --fs-lede: 16px;
  --fs-nav: 14px;
  --fs-label: 11px;

  /* layout */
  --nav-h: 64px;
  --canvas: 560px;
  --grid-cell: 70px;
  --gutter: 56px;
  --ring-border: 16px;
  --radius: 0;            /* everything is square-cornered */

  /* motion */
  --t-micro: 160ms;
  --t-shape: 900ms;
  --stagger: 60ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role            | Family        | Size  | Weight | Line-height | Tracking | Case      |
|-----------------|---------------|------:|-------:|------------:|---------:|-----------|
| Headline        | Archivo       | 136px | 900    | 0.84        | −0.06em  | sentence  |
| Logo            | Archivo       | 18px  | 900    | 1           | −0.03em  | title     |
| Nav links       | Archivo       | 14px  | 500    | 1.5         | 0        | title     |
| Lede            | Archivo       | 16px  | 400    | 1.5         | 0        | sentence  |
| CTA             | Archivo       | 15px  | 800    | 1           | −0.01em  | sentence  |
| Stat value      | Archivo       | 30px  | 800    | 1           | −0.04em  | numerals  |
| Caption title   | Archivo       | 15px  | 800    | 1.3         | −0.01em  | title     |
| Kicker tags     | IBM Plex Mono | 12px  | 500    | 1           | +0.12em  | UPPERCASE |
| Vertical label  | IBM Plex Mono | 11px  | 500    | 1           | +0.18em  | UPPERCASE |
| Stat label      | IBM Plex Mono | 11px  | 400    | 1.4         | +0.10em  | UPPERCASE |
| Caption body    | IBM Plex Mono | 12px  | 400    | 1.4         | 0        | sentence  |

Pull the headline 6px left (`margin-left: -6px`) so the S optically aligns with the lede.

## Motion

| Element            | Trigger              | Property                      | From → To                      | Duration | Easing  | Delay              |
|--------------------|----------------------|-------------------------------|--------------------------------|---------:|---------|--------------------|
| each `.shape`      | composition change   | transform (translate, rotate) | previous coords → next coords  | 900ms    | `--expo`| `index × 60ms`     |
| each `.shape`      | composition change   | width, height                 | previous size → next size      | 900ms    | `--expo`| `index × 60ms`     |
| numeral buttons    | hover / pressed      | background                    | transparent → `#dcdad3` / ink  | 160ms    | `--ease`| 0                  |
| CTA                | hover                | background                    | `--blue` → `--ink`             | 160ms    | `--ease`| 0                  |

Composition tables, as `[x, y, w, h, rotate°]` on the 560px poster:

| Shape         | I · Weight            | II · Tension          | III · Rotation         |
|---------------|-----------------------|-----------------------|------------------------|
| circle (red)  | 42, 42, 310, 310, 0   | 270, 250, 250, 250, 0 | 180, 170, 210, 210, 0  |
| triangle      | 96, 280, 250, 230, 0  | 40, 300, 250, 220, 0  | 310, 40, 210, 190, 180 |
| square (blue) | 300, 250, 218, 218, 0 | 60, 60, 170, 170, 12  | 62, 370, 140, 140, 45  |
| half-disc     | 300, 42, 218, 109, 0  | 290, 70, 230, 115, 180| 24, 80, 260, 130, 90   |
| ring          | 392, 150, 96, 96, 0   | 110, 190, 60, 60, 0   | 380, 360, 140, 140, 0  |
| bar (black)   | 42, 500, 476, 18, 0   | 252, 24, 18, 512, 0   | 20, 272, 520, 18, −32  |
| dot (yellow)  | 230, 200, 44, 44, 0   | 430, 40, 70, 70, 0    | 120, 40, 40, 40, 0     |

Reduced motion: shape transitions drop to 1ms with no stagger; the composition still changes and the caption still updates.

## States

- **Poster hover:** cursor pointer; the hint "CLICK TO RECOMPOSE" stays in the bottom-right at all times (10px mono, on a `--canvas-bg` chip so it is legible over shapes).
- **Poster focus-visible:** 2px `--blue` outline, 3px offset.
- **Numeral button pressed:** ink background, `--bg` text. Unpressed hover: `#dcdad3`.
- **Nav link hover:** 2px underline at 5px offset.
- **CTA hover:** background ink. **Nav "Apply" hover:** background red.
- **Mid-transition:** no disabled state; clicks retarget.

## Accessibility

- The poster is a real `<button>` labelled "Rearrange composition" and `aria-describedby` the caption, so screen readers hear the current composition name.
- The caption is `aria-live="polite"`; it announces "II / III Tension One bar holds everything up." on change.
- Numeral buttons sit in `role="group" aria-label="Choose composition"` and use `aria-pressed`.
- Shapes are decorative spans inside the button; the vertical date label is `aria-hidden` because the dates are decorative here.
- Focus order: logo → four nav links → Apply → CTA → syllabus link → poster → I → II → III.
- Contrast: `--ink-2` on `--bg` is 8.4:1; `--ink-3` (used only for 11px uppercase mono labels) is 4.5:1; white on `--blue` is 7.2:1.
- Numeral buttons are 44 × 36px; CTA is 52px tall.

## Responsive rules

- ≥ 1280: as specified; the poster is a fixed 560px square.
- 1024–1279: keep two columns; scale the poster to `min(560px, 44vw)` by multiplying coordinates by `canvas / 560` (store coordinates in poster units, not px); headline 112px.
- 768–1023: stack: copy first, poster full-width below (max 560px), headline 112px, meta row stays 3 columns.
- < 640: headline 72px, poster `100vw − 48px` square, caption wraps under the numeral buttons, nav links collapse into a "Menu" button.

## Acceptance checklist

- [ ] The headline is 136px Archivo 900 at line-height 0.84 and −0.06em tracking; "verb." is `#E1341E`.
- [ ] The poster is exactly 560 × 560px with a 1px ink border and a 70px grid.
- [ ] Seven shapes render with `mix-blend-mode: multiply`; the grid is visible through them.
- [ ] Clicking the poster cycles I → II → III → I.
- [ ] Each shape animates transform, width and height over 900ms with `cubic-bezier(.16,1,.3,1)` and a 60ms per-shape stagger.
- [ ] The coordinates match the composition table.
- [ ] Numeral buttons jump to their composition and expose `aria-pressed`.
- [ ] The caption number, title and description update and are announced politely.
- [ ] No shape leaves the poster bounds in any composition (overflow hidden as a safety net).
- [ ] With reduced motion, compositions switch instantly.
- [ ] All interactive elements show a visible 2px blue focus ring.
- [ ] Nothing in the stat row collides with the CTA row at 1280 × 800.

## Implementation notes

**One set of nodes, many layouts.** Do not render three SVGs and cross-fade. Keep seven absolutely positioned spans at `left: 0; top: 0` and drive them only with inline `transform`, `width` and `height`:

```js
const C = [{ s: { c: [42, 42, 310, 310, 0], b: [42, 500, 476, 18, 0] /* … */ } }];
function apply(k) {
  shapes.forEach(el => {
    const [x, y, w, h, r] = C[k].s[el.dataset.k];
    el.style.width = w + 'px'; el.style.height = h + 'px';
    el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
  });
}
```

**Stagger with a custom property**, so the delay lives in CSS and reduced motion can zero it:

```css
.shape { position: absolute; left: 0; top: 0; mix-blend-mode: multiply;
  transition: transform var(--t-shape) var(--expo), width var(--t-shape) var(--expo),
              height var(--t-shape) var(--expo);
  transition-delay: calc(var(--i) * var(--stagger)); }
.t { background: var(--yellow); clip-path: polygon(50% 0, 100% 100%, 0 100%); }
.h { background: var(--ink); border-radius: 999px 999px 0 0; } /* height = width / 2 */
```

**Shapes that keep their identity while resizing:** the triangle uses `clip-path` (scales with the box), the half-disc uses a 999px top radius on a box whose height is half its width, and the ring is a transparent circle with a 16px border. Rotation happens around the box centre, so a 90° half-disc needs its `x` adjusted by `(w − h) / 2` if you want it flush to an edge.

Common mistakes: putting `isolation` on the shapes instead of the poster (blend modes then mix with the page), animating `left/top` instead of `transform` (janky), and running the first `apply()` after a paint (the shapes fly in from 0,0 on load).

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
