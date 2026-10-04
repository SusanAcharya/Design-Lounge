<!-- Design Lounge Nº 295 · "Linen weave background" · designlounge.vercel.app -->

# Linen weave background

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A full-frame woven-textile background behind a product section for a fictional mill, "Hollin Linen Co.". The cloth is a real plain weave built from one 14px SVG `<pattern>`: two warp threads and two weft threads that pass over and under each other, each shaded round, with a darker dip where a thread dives under its neighbour. Slub streaks from two stretched `feTurbulence` layers make it read as linen, not as a checkerboard. The copy sits on a sewn-in label with a dashed stitch line. A broad, elongated sheen follows the pointer like light across cloth. The detail worth copying is that **thread colours are only two CSS custom properties**: swap `--warp` and `--weft` and the whole weave, the gap shadow between threads, and the spec line ("Rust warp × Oat weft") change together. A second surface, "Paper fold", replaces the cloth with a sheet folded 4 × 3 whose twelve facets brighten or darken as the light moves.

## Reference behaviour

1. First frame: Rust warp `#a4532e` × Oat weft `#d9cbb0`, a shot-cloth look. The sheen rests at (70%, 40%). The label is on the left, vertically centred; the panel is bottom-right.
2. Pointer move sets a target; the sheen eases toward it at 12% per frame and the loop stops once it is within 0.5px. An idle page has no running loop.
3. The sheen is three gradients blended with `overlay`: a 560 × 150px horizontal ellipse (light along the weft), a 150 × 480px vertical ellipse (light along the warp), and a 900px circle that darkens the far cloth.
4. Warp row and Weft row each have five swatches: Oat `#d9cbb0`, Sage `#8f9e83`, Rust `#a4532e`, Ink `#2f3540`, Chalk `#eee9df`. Clicking one sets `--warp` or `--weft` on `:root`; the gap colour is derived, so no other code changes.
5. The spec line on the label updates in a polite live region: "Ink warp × Sage weft · 185 gsm · plain weave". The two-colour chip beside it shows warp | weft.
6. "Linen" / "Paper fold" cross-fades the cloth and the paper in 360ms. The sheen drops to 45% strength on paper.
7. In Paper fold, the sheet is a 4 × 3 grid of facets. Columns alternate facing right/left, rows alternate facing down/up. Each facet's tint comes from the dot product of its tilt and the direction to the pointer: toward the light it gains up to 45% warm white, away from it up to 16% brown.
8. Creases: vertical at 25% (valley), 50% (mountain), 75% (valley); horizontal at 33.3% (mountain), 66.7% (valley). Valleys are a soft shadow line; mountains are a bright 1px ridge with shadow on the far side.
9. The paper stock is tinted from the weft colour (24% weft into `#f6f2ea`), so the swatches still matter, and the spec line reads "Sage stock · folded 4 × 3 · 120 gsm".
10. Reduced motion: the sheen and facet light stay fixed at (70%, 40%) and do not follow the pointer. Surface and colour changes are instant.

## Structure

```
1280 × 800   layers: svg.cloth | div.fold | div.sheen (overlay) | page | panel
┌──────────────────────────────────────────────────────────────────────┐
│ ▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓ │
│ ▒ ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐ label 560w, padding 40/44/36    ▓▒ │
│ ▓ ┆ HOLLIN LINEN CO.   SPRING CLOTH · NO. 14 ┆  stitch inset 10px   ░░ │
│ ▒ ┆ ─────────────────────────────────────── ┆              sheen ░░░░ │
│ ▓ ┆ Woven slowly, worn for                  ┆  56px serif         ░░ │
│ ▒ ┆ twenty summers.  (italic, accent)       ┆                     ▓▒ │
│ ▓ ┆ sub 16px, max 430                        ┆                       │
│ ▒ ┆ [▮▮] Rust warp × Oat weft · 185 gsm      ┆  live                  │
│ ▓ ┆ [Shop the spring cloth →] [Order free…]  ┆        ┌ panel 268 ─┐ │
│ ▒ └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘                │ WARP ●●●●● │ │
│ ▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒  │ WEFT ●●●●● │ │
│                                                 │[Linen|Paper fold]│ │
└──────────────────────────────────────────────────────────────────────┘
 page padding 56px 72px; panel right 40 bottom 40
```

- `svg.cloth` (fixed, `aria-hidden`): `<defs>` with four shading gradients, the `#weave` pattern, two slub filters; three full-size rects (weave, horizontal slubs at 60%, vertical slubs at 40%).
- `div.fold` (fixed, `aria-hidden`): CSS grid 4 × 3 of `<i>` facets, five absolutely positioned `.crease` strips, a paper-grain SVG on `multiply` at 50%.
- `div.sheen` (fixed, `pointer-events: none`, `mix-blend-mode: overlay`) reading `--mx`/`--my`.
- `<section class="label" aria-labelledby>` with mark row, `<h1>`, sub, spec `<p aria-live="polite">`, two links.
- `.panel role="group"`: two swatch groups labelled by their row titles, one segmented pair.

## Tokens

```css
:root {
  --warp: #a4532e;                 /* vertical threads */
  --weft: #d9cbb0;                 /* horizontal threads */
  --gap: color-mix(in srgb, color-mix(in srgb, var(--warp) 50%, var(--weft)) 62%, #1c140d);
  --paper: color-mix(in srgb, var(--weft) 24%, #f6f2ea);

  --label: #fbf8f2;                /* label, panel */
  --ink: #2a221b;                  /* headline, primary, pressed segment */
  --ink-2: #5a4e43;                /* sub, mark, panel text */
  --ink-3: #7a6d60;
  --line: #e2d9cb;                 /* label hairline */
  --stitch: #b9a68c;               /* dashed stitch */
  --accent: #8a3f1f;               /* italic words, primary hover, focus */

  --serif: "Gelasio", Georgia, serif;
  --sans: "Atkinson Hyperlegible", system-ui, sans-serif;

  --tile: 14px;                    /* one repeat = 2 warp + 2 weft */
  --thread: 6.5px;                 /* thread width; 0.5px gap shows --gap */
  --sheen-follow: .12;             /* per-frame approach */

  --ease: cubic-bezier(.2, .7, .2, 1);
  --t-fast: 160ms;
  --t-mode: 360ms;
}
```

Threads: Oat `#d9cbb0`, Sage `#8f9e83`, Rust `#a4532e`, Ink `#2f3540`, Chalk `#eee9df`.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Headline | Gelasio | 56px | 500 | 1.04 | −0.02em | sentence; last two words italic in `--accent` |
| Mark (brand) | Atkinson Hyperlegible | 11px | 700 | 1 | 0.16em | UPPER |
| Mark (issue) | Atkinson Hyperlegible | 11px | 400 | 1 | 0.08em | UPPER |
| Sub-copy | Atkinson Hyperlegible | 16px | 400 | 1.55 | 0 | sentence |
| Spec line | Atkinson Hyperlegible | 13px | 400/700 | 1.4 | 0 | thread names bold |
| Buttons | Atkinson Hyperlegible | 14px | 700 | 1 | 0 | sentence |
| Panel row label | Atkinson Hyperlegible | 10px | 700 | 1 | 0.12em | UPPER |
| Segments | Atkinson Hyperlegible | 12px | 700 | 1 | 0.04em | sentence |

## Motion

| Thing | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|---|
| Sheen | pointermove | `--mx`, `--my` | current → pointer | until within 0.5px | 12% per frame | fixed at 70%, 40% |
| Facet light (paper) | same tick | facet background | recomputed | same | — | fixed |
| Surface swap | Linen / Paper fold | opacity of cloth, paper, sheen | 1 ↔ 0, sheen 1 ↔ .45 | 360ms | `--ease` | instant |
| Thread colour | swatch click | `--warp` / `--weft` | swap | instant | — | instant |
| Swatch hover | hover | translateY | 0 → −1px | 160ms | `--ease` | 1ms |
| Buttons | hover | background, colour | — | 160ms | `--ease` | 1ms |

## States

- **Swatch pressed:** 2px label-coloured gap then a 1.5px ink ring; `aria-pressed="true"`. One per row.
- **Segment pressed:** ink fill, label-coloured text. Focus on the pressed segment uses a label-coloured outline inset 4px; on the resting one, the accent.
- **Primary:** ink fill → accent on hover. **Outline:** fills with ink on hover.
- **Focus-visible:** 2px `--accent`, offset 3px.
- **Linen:** cloth visible, sheen full. **Paper fold:** paper visible, sheen 45%, facets live.
- **Dark threads (Ink × Ink):** the label still carries all copy on `--label`, so nothing loses contrast.

## Accessibility

- Cloth, paper, creases and sheen are decorative (`aria-hidden="true"`, no pointer events on the sheen).
- The label is a `<section>` labelled by its `<h1>`. The spec line is `aria-live="polite"`, so colour and surface changes are announced in words ("Ink warp × Sage weft").
- Swatches are buttons named "Oat warp", "Rust weft" and so on, with `aria-pressed`; each row is a `role="group"` labelled by its visible title.
- The surface toggle is a labelled group of two `aria-pressed` buttons.
- Tab order: Shop → Swatches link → five warp → five weft → Linen → Paper fold.
- Contrast: all text sits on `#fbf8f2`. `#2a221b` is 15:1, `#5a4e43` is 7.6:1, accent `#8a3f1f` is 7:1.
- Swatches are 30px with 6px gaps inside a 268px panel; on touch layouts the panel spans the width and the targets stay 30px with the ring adding to 37px.

## Responsive rules

- ≥ 1280: as specified. The pattern tiles, so wider screens only show more cloth.
- < 1000: label 500px wide, headline 46px.
- < 640: page padding 24px 16px 200px, label full width with 28/26px padding, headline 36px, sub 15px, the issue number hides. The panel spans the bottom with 16px insets.
- Never scale the tile with the viewport. A 14px repeat reads as linen at every size; scaling it up turns it into gingham.

## Acceptance checklist

### Always

- [ ] The weave is one SVG `<pattern>`: warp drawn full, weft drawn full on top, then warp re-drawn only on its two over-cells.
- [ ] Each thread has a cross-section gradient (dark edges, light centre) and each over-segment a dip shadow at both ends.
- [ ] Thread colours are two custom properties; the gap colour is derived with `color-mix`.
- [ ] Two stretched `feTurbulence` layers add horizontal and vertical slubs.
- [ ] The sheen uses `mix-blend-mode: overlay` with an elongated ellipse along each thread direction.
- [ ] The sheen loop stops when it reaches the pointer.
- [ ] The copy sits on an opaque label, never directly on the weave.
- [ ] The paper variant has alternating facets, valley and mountain creases, and facet light from the pointer.
- [ ] Reduced motion: light fixed, swaps instant.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] First frame Rust `#a4532e` warp × Oat `#d9cbb0` weft.
- [ ] Headline "Woven slowly, worn for twenty summers." with "twenty summers." italic in `#8a3f1f`.
- [ ] Five threads: Oat, Sage, Rust, Ink, Chalk.
- [ ] Paper fold is 4 × 3 with creases at 25 / 50 / 75% and 33.3 / 66.7%.
- [ ] Spec line reads "185 gsm · plain weave" on cloth and "folded 4 × 3 · 120 gsm" on paper.

## Implementation notes

**The pattern.** Order matters; this is the whole over-under:

```html
<pattern id="weave" width="14" height="14" patternUnits="userSpaceOnUse">
  <rect class="gp" width="14" height="14"/>
  <rect class="wa" x=".25" width="6.5" height="14"/><rect class="wa" x="7.25" width="6.5" height="14"/>
  <rect class="we" y=".25" width="14" height="6.5"/><rect class="we" y="7.25" width="14" height="6.5"/>
  <rect fill="url(#rv)" y=".25" width="14" height="6.5"/><rect fill="url(#rv)" y="7.25" width="14" height="6.5"/>
  <rect fill="url(#dh)" x="7" y=".25" width="7" height="6.5"/><rect fill="url(#dh)" y="7.25" width="7" height="6.5"/>
  <!-- warp over at cells (0,0) and (1,1) -->
  <rect class="wa" x=".25" width="6.5" height="7"/><rect class="wa" x="7.25" y="7" width="6.5" height="7"/>
  <rect fill="url(#rh)" x=".25" width="6.5" height="7"/><rect fill="url(#rh)" x="7.25" y="7" width="6.5" height="7"/>
  <rect fill="url(#dv)" x=".25" width="6.5" height="7"/><rect fill="url(#dv)" x="7.25" y="7" width="6.5" height="7"/>
</pattern>
```

With `.wa { fill: var(--warp) } .we { fill: var(--weft) } .gp { fill: var(--gap) }`. Gradients: `rh`/`rv` go black 20% → white 14–16% → black 20% across the thread; `dv`/`dh` go black 24–26% at both ends to clear between 28% and 72%.

**Slubs** are noise stretched along one axis, turned into a black alpha mask:

```html
<filter id="slubx"><feTurbulence type="fractalNoise" baseFrequency=".003 .45" numOctaves="2" seed="3"/>
  <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.6 0 0 0 -.62"/></filter>
```

**Facet light** for the paper fold, run in the same tick as the sheen:

```js
for (const p of panels) {                       // nx = ±.38 by column, ny = ±.3 by row
  const cx = (p.c + .5) * W / 4, cy = (p.r + .5) * H / 3;
  const lx = x - cx, ly = y - cy, l = Math.hypot(lx, ly, 520);
  const s = Math.max(-1, Math.min(1, (p.nx * lx + p.ny * ly) / l * 2.6));
  p.el.style.background = s > 0 ? `rgba(255,253,247,${s * .45})` : `rgba(70,48,28,${-s * .16})`;
}
```

Common mistakes:

- Drawing the weave as two crossed stripe gradients. Without the over-under it reads as gingham.
- A circular sheen. Cloth reflects along its threads; keep the two elongated ellipses.
- Putting text straight on the weave. The label is part of the idea, with the stitch line inset 10px.
- Recomputing the turbulence on every pointer move by placing the sheen inside the same SVG. Keep the sheen a separate HTML layer.
- Hard-coding the gap colour, so dark threads end up with a pale gap.
- Animating the creases. The folds are fixed; only the light moves.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
