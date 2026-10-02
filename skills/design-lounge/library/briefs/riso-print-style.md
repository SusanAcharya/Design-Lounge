<!-- Design Lounge Nº 138 · "Riso print design language kit" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Riso print design language kit

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A kit sheet for "Ink Fair 26", a fictional one-night print fair in a canal warehouse, that teaches a risograph dialect: two drums only (fluoro pink `#FF3D8A` and indigo `#1E2A6E`), `mix-blend-mode: multiply` wherever they overlap, a 3px/2px misregistration between layers, and a fixed 18 % grain overlay. The first row is a zine-cover / festival-flyer fragment: "INK FAIR 26" set twice (pink offset + indigo offset), a circular "Zine 03" stamp, a halftone field, and Pink / Indigo / Both tabs that peel the cover down to one drum. Below: a misregistered 84px "Aa", five chips, blocky buttons, chips, a workshop field, a grain switch, three flood plates, four grammar cards. The detail worth copying: **the type is never in register**. Pink sits `translate(3px, 2px)`, indigo `translate(-2px, -1px)`.

## Reference behaviour

1. Initial state: 52px paper header, 18px two-square mark (pink over indigo, multiply), "INK FAIR / riso kit 04", four anchors, "Two inks · 11 Oct 2026". Sheet of paper cells with 2px indigo rules. First 800px shows the 432px hero + specimen. Grain overlay is on (opacity .18).
2. The hero draws the same composition twice: `.layer.pink` and `.layer.indigo`, both `mix-blend-mode: multiply`, `pointer-events: none`. Where they overlap, the mix reads as overprint `#9A1858`.
3. Hover a button: it shifts `translate(-2px, -2px)` over 140ms. No shadow. Press returns to 0.
4. Click Pink / Indigo / Both. `aria-selected` moves. Pink hides the indigo layer; Indigo hides the pink layer; Both shows both (the default).
5. Click Zine / Poster / Tote chips: `aria-pressed` toggles a pink multiply fill.
6. Focus the workshop input: a 3px pink offset block (`box-shadow: 3px 3px 0 var(--pink)`), no glow.
7. Click Show grain: `aria-checked` flips; overlay opacity goes .18 → 0.
8. Header link hover: pink. The "Sold out" button is pink multiply.
9. Reduced motion: transitions 1ms. Layer peeling is instant.

## Structure

```
1280 × 800 first frame
┌──────────────────────────────────────────────────────────────────────────────┐
│ (two squares) INK FAIR / riso kit 04   TYPE COLOUR CONTROLS SURFACE  11 Oct  │ 52
├───────────────────────────────────────────────┬──────────────────────────────┤
│ INK FAIR 26 (64px, two layers, misreg)  (stamp)│ 01 TYPE SPECIMEN             │
│ Canal warehouse, Bay 4…                 (dots) │ Aa overprinted               │
│ [Pink] [Indigo] [Both]                         │ Display 64 / H2 22 / Body 14 │
│ cols 1–7 · 432h                                │ cols 8–12 · 432h             │
├───────────┬───────────┬───────────┬──────────────────────────────────────────┤
│02 PALETTE │03 BUTTONS │04 INPUTS  │05 SURFACE                                │
│ 5 chips   │ 3 blocks  │ workshop  │ Fluoro / Indigo / Overprint floods       │
│           │ 3 chips   │ link + sw │                                          │
├───────────┴───────────┴───────────┴──────────────────────────────────────────┤
│ Two inks · Misreg · Grain · Block                                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

- Cells have 2px indigo right+bottom borders, 0 radius, 0 gap. The page is paper `#F6F1E4`.
- Hero layers are `position: absolute; inset: 0`. Interactive tabs sit in `.copy` with `pointer-events: auto; z-index: 2`.
- Stamp is 160px, 8px currentColor ring, −12deg rotate, centred "Zine 03".
- Halftone: `radial-gradient(circle, currentColor 1.4px, transparent 1.6px)` at 8px.
- The body paragraph under the title is live DOM (not inside a multiply layer) so it stays readable when a drum is hidden: `z-index: 2; color: var(--indigo)`.
- Footer spans 12 with 2px indigo rules like every other cell. Copy: "Pink / Indigo / Both tabs peel the cover".

## Tokens

```css
:root {
  --paper: #f6f1e4;    /* stock, 70 % */
  --paper-2: #efe6d0;  /* hover fill */
  --pink: #ff3d8a;     /* drum 1 */
  --indigo: #1e2a6e;   /* drum 2, type, rules */
  --over: #9a1858;     /* multiply mix, documented not mixed in CSS */
  --ink: #1a1420;      /* key — never a third drum */
  --display: "Rubik Mono One", Impact, sans-serif;
  --text: "Rubik", system-ui, sans-serif;
  --fs-display: 64px; --fs-aa: 84px; --fs-h2: 22px; --fs-body: 14px; --fs-label: 11px;
  --pad: 18px; --ctl: 44px; --rule: 2px;
  --mis-p: translate(3px, 2px);
  --mis-i: translate(-2px, -1px);
  --grain: .18;
  --t-micro: 140ms; --t-switch: 200ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Hero headline | Rubik Mono One | 64px | 400 | .85 | −0.04em | UPPERCASE |
| Specimen glyph | Rubik Mono One | 84px | 400 | .8 | 0 | "Aa", indigo with pink `::after` offset 3px/2px |
| Grammar title | Rubik Mono One | 13px | 400 | 1 | −0.02em | UPPERCASE |
| Brand | Rubik Mono One | 14px | 400 | 1 | −0.02em | as designed |
| H3 / button | Rubik | 13–18px | 700 | 1 | +0.04em | UPPERCASE on buttons |
| Body | Rubik | 14–16px | 400–500 | 1.4 | 0 | sentence |
| Label | Rubik | 10–11px | 700 | 1 | +0.12–0.14em | UPPERCASE |

Rubik Mono One has one weight and a large em. Keep display lines to two words. Do not italicise it.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
|---------|---------|----------|-----------|---------:|--------|
| `.btn` | hover | transform | 0 → −2px,−2px | 140ms | `--ease` |
| layers | ink tab | display | block ↔ none | instant | — |
| switch knob | toggle | translateX, background | 0 / indigo → 22px / white | 200ms | `--ease` |
| grain overlay | switch | opacity | .18 → 0 | instant | — |
| input focus | focus | box-shadow | none → 3px 3px 0 pink | 140ms | `--ease` |

Reduced motion: transitions 1ms. Misregistration stays; it is layout, not animation.

## States

- **Button rest:** 44px, 2px indigo border, 0 radius. Solid: indigo fill, paper text. Ghost: paper fill, indigo text. Pink: `#FF3D8A` fill, white text, `mix-blend-mode: multiply`.
- **Hover:** −2px/−2px. **No pressed shadow.**
- **Tab selected:** pink fill, white text, pink border, multiply. Unselected: paper, 2px indigo.
- **Chip pressed:** same as selected tab.
- **Input focus:** 3px pink offset block. **Switch on:** pink multiply track, white 16px knob +22px.
- **Focus-visible:** 3px solid pink, offset 3px.

## Accessibility

- Header nav labelled "Kit sections". Hero labelled "Composition: zine cover flyer". Ink group is a `tablist`.
- Both print layers, the mark, and the grain SVG are `aria-hidden="true"`. The live copy is the body paragraph, not the duplicated display type.
- Switch labelled "Show grain". Chips `aria-pressed`.
- Contrast: indigo on paper 11.2:1; white on indigo 11.4:1; white on pink 3.9:1 — **pink-on-white text is only used at 12px/700 uppercase on filled controls**, never as body. Body stays indigo.
- Hit targets: buttons 44px; tabs 32× ≥ 56px; whole switch label is clickable.

## Responsive rules

- ≥ 1280: as drawn.
- 700–1100: hero and specimen span 12, height auto; headline 48px; components and grammar span 6; header nav hides.
- < 700: every cell spans 12; stamp 110px.
- Applying the language: never add a third ink. Black `#1A1420` is documented as "key" and unused as a fill. If you need dark type, use indigo.

## Acceptance checklist

- [ ] Only two drums print: pink `#FF3D8A` and indigo `#1E2A6E`. Overprint is multiply, not a mixed fill on type.
- [ ] Pink layer is offset +3px +2px; indigo −2px −1px.
- [ ] A fixed SVG noise overlay sits at 18 % multiply over the whole page.
- [ ] Hero headline is Rubik Mono One 64px, uppercase, line-height .85.
- [ ] Buttons are 44px, 2px indigo, 0 radius, and shift −2px on hover with no drop shadow.
- [ ] Pink / Indigo / Both tabs show and hide the two layers and set `aria-selected`.
- [ ] Show-grain switch fades the overlay to 0 and sets `aria-checked`.
- [ ] Input focus is a 3px pink offset block, not a glow.
- [ ] Specimen "Aa" is indigo with a pink `::after` copy offset 3px/2px, multiply.
- [ ] Focus-visible is 3px pink, 3px offset.
- [ ] Only Rubik Mono One and Rubik are loaded.
- [ ] No photographs, no third colour flood, no border-radius on controls.

## Implementation notes

**Overprint is two DOM copies**, not a CSS colour. Keep the composition in one markup block and clone it into two layers:

```css
.layer { position: absolute; inset: 0; mix-blend-mode: multiply; pointer-events: none; }
.layer.pink { color: var(--pink); transform: translate(3px, 2px); }
.layer.indigo { color: var(--indigo); transform: translate(-2px, -1px); }
```

**Misregistered mark** in the header (two 18px squares):

```css
.mark { width: 18px; height: 18px; background: var(--pink); mix-blend-mode: multiply; transform: translate(2px, 1px); }
.mark::after { content: ""; position: absolute; inset: 0; background: var(--indigo); transform: translate(-3px, -2px); mix-blend-mode: multiply; }
```

**Grain is one SVG filter** (`feTurbulence` baseFrequency `.7`, opacity `.18`, multiply). The switch only changes opacity; do not rebuild the filter.

```html
<svg class="grain" aria-hidden="true">
  <filter id="g">
    <feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix values="0 0 0 0 .12 0 0 0 0 .08 0 0 0 0 .2 0 0 0 1 0"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#g)"/>
</svg>
```

The overlay is `position: fixed; inset: 0; pointer-events: none; z-index: 8`. Common mistakes: aligning the two layers (it stops being riso); adding a third ink for "text"; using `opacity` instead of `multiply` for overprint (you get pink-tinted indigo, not a dark drum mix); putting body copy in pink (fails contrast); animating the grain (it strobes in a gallery).

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
