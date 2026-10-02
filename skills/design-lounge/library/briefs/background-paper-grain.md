<!-- Design Lounge Nº 129 · "Paper grain and ink blots" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Paper grain and ink blots

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A single plate: ivory paper, two translucent ink blots (sienna `#6b2e1f` on the left, Prussian `#1a3352` on the right) with an SVG displacement filter so their edges look pressed, not CSS-rounded, and a full-viewport fractal-noise grain layered on top with `mix-blend-mode: multiply`. In the centre, a three-line poem in italic 42px Literata. A Grain range input at the bottom changes `--grain` (overlay opacity) and the turbulence `baseFrequency`. The slider is the interaction; the composition is the piece. No nav, no CTA.

## Reference behaviour

1. Initial state: paper `#f3ebd8`. Header row "Plate 07" — hairline — "Two inks on laid stock", 11px uppercase Public Sans `--ink-3`. Poem centred. Slider at **45**.
2. Left blot: 540×420px, `left: 8%; top: 18%`, sienna, organic `border-radius: 58% 42% 48% 52% / 46% 54% 46% 54%`, rotate −12deg, `filter: url(#spread)`, `mix-blend-mode: multiply`, opacity 0.82.
3. Right blot: 480×380px, `right: 6%; bottom: 10%`, Prussian, complementary radii, rotate 8deg, same filter and blend.
4. `#spread` filter: `feTurbulence` fractalNoise baseFrequency 0.018, 3 octaves, seed 4, then `feDisplacementMap` scale 42 (R→X, G→Y). This chews the ellipse into a blot.
5. Grain layer: full-size SVG `<rect>` with filter `#grainF` — fractalNoise baseFrequency **0.8**, 4 octaves, seed 2, saturate 0, alpha table `0 / 0.55`. The SVG itself has `opacity: var(--grain)` (initial 0.45) and `mix-blend-mode: multiply`.
6. Slider `min=0 max=100 value=45`, `aria-valuenow` kept in sync. On `input`: set `--grain` to `value/100`, write the numeric label, set turbulence `baseFrequency` to `(0.45 + value/100 * 0.7).toFixed(3)` so 0 → 0.45 (fine, quiet) and 100 → 1.15 (coarse, heavy).
7. Poem does not move. Blots do not animate. Only the grain overlay changes with the slider.
8. Reduced motion: no extra animation to disable (the piece is static besides the slider). Keep the slider working.

## Structure

```
1280 × 800
┌────────────────────────────────────────────────────────────┐
│ PLATE 07 ────────────── TWO INKS ON LAID STOCK             │ 11px
│                                                          · │
│          (sienna blot, back left)                          │
│                    The grain remembers                     │  italic 42
│                    every press of the plate.               │
│                    Two inks, one afternoon.                │
│                    — FROM THE BINDERY NOTES, 2026          │
│                                    (prussian blot, right)  │
│ Grain  ────●──────────────  45                             │  range
└────────────────────────────────────────────────────────────┘
```

- Two SVG `<filter>`s in a 0×0 SVG: `#spread` (displacement) and `#grainF` (noise).
- `.bg` absolute inset 0, `pointer-events: none`: `.blot.b1`, `.blot.b2`, `svg.grain`.
- `.page` relative z-index 1, column flex, padding 40/64/36: `.top`, `<main>` (flex 1, centres the `<blockquote>`), `.ctl`.
- `<blockquote>`: three `<p>` lines + `<footer>`.
- `.ctl`: `<label for="g">Grain</label>`, `<input id="g" type="range">`, `<span id="gv">45</span>`.

Poem lines, exact:

1. The grain remembers
2. every press of the plate.
3. Two inks, one afternoon.

Attribution: `— from the bindery notes, 2026`

## Tokens

```css
:root {
  --paper: #f3ebd8;            /* page */
  --ink: #2b1f18;              /* poem */
  --ink-2: #5e4e42;            /* attribution */
  --ink-3: #8a7666;            /* plate caption, label */
  --sienna: #6b2e1f;           /* left blot */
  --prussian: #1a3352;         /* right blot */
  --line: rgba(43, 31, 24, .16);
  --serif: "Literata", Georgia, serif;
  --sans: "Public Sans", system-ui, sans-serif;
  --grain: .45;                /* overlay opacity, 0–1 */
  --t-micro: 160ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role         | Family      | Size | Weight | Line-height | Tracking | Case      |
|--------------|-------------|-----:|-------:|------------:|---------:|-----------|
| Poem line    | Literata    | 42px | italic 400 | 1.25    | −0.02em  | sentence  |
| Attribution  | Public Sans | 12px | 500    | 1           | +0.14em  | UPPERCASE |
| Plate label  | Public Sans | 11px | 500    | 1           | +0.16em  | UPPERCASE |
| Slider label | Public Sans | 11px | 500    | 1           | +0.12em  | UPPERCASE |
| Slider value | Public Sans | 12px | 500    | 1           | 0        | tabular   |

Poem `max-width: 22ch`, `text-align: center`, `font-optical-sizing: auto`. Line margin-bottom 0.35em.

## Motion

There is no looping motion. The slider is the only changing property:

| Element        | Trigger | Property                  | From → To                          |
|----------------|---------|---------------------------|------------------------------------|
| Grain SVG      | input   | opacity `--grain`         | 0 → 1 (slider 0–100)               |
| `#grainF` turb.| input   | baseFrequency             | 0.45 → 1.15                        |

Do not animate the blots. Reduced motion: no change required.

## States

- **Slider thumb:** 14px circle, paper fill, 2px ink stroke. Track is 2px ink, no radius.
- **Slider focus-visible:** 2px Prussian outline, 3px offset, on the input.
- **Grain at 0:** blots and poem remain; the paper reads as smooth stock.
- **Grain at 100:** heavy multiply noise, frequency 1.15. Poem must stay readable (ink on paper still exceeds 8:1; grain is overlay, not type).

## Accessibility

- Label is a real `<label for="g">`. `aria-valuemin/max/now` on the range. Visible numeric value in `#gv` (not `sr-only`).
- Background blots and grain are `aria-hidden`. The poem is a `<blockquote>` with a `<footer>` for the attribution.
- Contrast: poem ink `#2b1f18` on `#f3ebd8` is about 11:1. Do not lighten the poem to sit "on" the blot; the multiply blots sit behind the type and the type is a solid ink colour.
- Keyboard: Tab to the slider, arrow keys change the value (native).

## Responsive rules

- ≥ 1280: blots 540/480 as specified, poem 42px.
- 1024–1279: scale blots with `width: 42vw` and `max-width: 540px`. Poem 36px.
- 768–1023: poem 32px, 28ch measure. Slider full width minus 48px padding. Blots 50vw and may overlap the poem more — that is acceptable.
- < 640: poem 26px/1.3. Stack the plate labels without the hairline. Slider still full width. Keep both blots; do not hide them.

## Acceptance checklist

- [ ] Two multiply blots: sienna left (`#6b2e1f`), Prussian right (`#1a3352`), displaced by SVG turbulence, not plain ellipses.
- [ ] Full-viewport grain overlay, multiply, opacity tied to `--grain`.
- [ ] Slider default 45; at 0 the grain disappears; at 100 opacity is 1 and baseFrequency is 1.15.
- [ ] Poem is exactly the three lines above, 42px italic Literata, centred, 22ch.
- [ ] No nav, no button, no looping animation.
- [ ] Plate caption "Plate 07" / "Two inks on laid stock" in 11px uppercase Public Sans.
- [ ] Focus ring on the slider is 2px `#1a3352`.
- [ ] Only Literata and Public Sans load.
- [ ] Palette is ivory / sienna / Prussian, not purple-blue blobs and not the site's Fraunces paper.

## Implementation notes

**Displacement for the blot edge** — a CSS `border-radius` blob is too smooth; chew it:

```xml
<filter id="spread" x="-20%" y="-20%" width="140%" height="140%">
  <feTurbulence type="fractalNoise" baseFrequency=".018" numOctaves="3" seed="4" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="42"
    xChannelSelector="R" yChannelSelector="G"/>
</filter>
```

Give the filter extra region (`x="-20%"`) or the displacement clips.

**Grain as a filtered rect**, not a canvas loop:

```xml
<filter id="grainF">
  <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="4" seed="2"/>
  <feColorMatrix type="saturate" values="0"/>
  <feComponentTransfer><feFuncA type="table" values="0 .55"/></feComponentTransfer>
</filter>
```

**Slider writes two things**, opacity and frequency:

```js
inp.addEventListener('input', () => {
  const v = +inp.value;
  root.style.setProperty('--grain', String(v / 100));
  gv.textContent = v;
  turb.setAttribute('baseFrequency', (0.45 + v / 100 * 0.7).toFixed(3));
});
```

Keep `feColorMatrix saturate 0` so the grain stays ink-neutral and does not tint the Prussian blot green. Do not regenerate the filter node on every input — only mutate `baseFrequency` and `--grain`.

Common mistakes: `mix-blend-mode: overlay` (washes the type). Animating blot position (the plate should sit still). Using canvas `getImageData` at 1280×800 on every input (too heavy; SVG turbulence is the grain).

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
