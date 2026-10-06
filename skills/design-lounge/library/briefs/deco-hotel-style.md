<!-- Design Lounge Nº 107 · "Deco hotel design language kit" · www.designlounge.live -->

# Deco hotel design language kit

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A kit sheet for "The Vesper", a fictional 1926 harbour hotel, that teaches an Art Deco dialect: ivory `#F6EFE0` cells on a lacquer `#0F1C18` field, **1px gold hairlines** as the only divider, centred symmetry, and stepped ziggurat bars. The first row is a hotel-identity + reservation fragment: three shrinking gold steps, a 220×90 gold sunburst fan, a 56px Italiana "VESPER", and Suite / Chamber / Salon tabs that rewrite the stay copy above a "Reserve the night" control. Below: type specimen, five chips, three button treatments, harbour chips, an arrival field, a late-dining switch, three surface plates, four grammar cards. The detail worth copying: **everything is centred and hairline**. No drop shadows. No radii. Burgundy `#8B2A32` is a selected-chip colour, not a second gold.

## Structure

```
1280 × 800 first frame
┌──────────────────────────────────────────────────────────────────────────────┐
│ TYPE  COLOUR              VESPER / EST. 1926              CONTROLS  SURFACE  │ 64
├───────────────────────────────────────────────┬──────────────────────────────┤
│ ═══ stepped gold (420 / 360 / 300) ═══        │ 01 TYPE SPECIMEN             │
│           (fan 220×90)                        │ Aa (92px Italiana)           │
│ THE VESPER · HARBOUR ROOMS                    │ Display 56 / H2 24 / Body 14 │
│          VESPER (56px, +0.12em)               │                              │
│ [Suite | Chamber | Salon]                     │                              │
│      [Reserve the night]          cols 1–7    │ cols 8–12 · 420h             │
├───────────┬───────────┬───────────┬──────────────────────────────────────────┤
│02 PALETTE │03 BUTTONS │04 INPUTS  │05 SURFACE                                │
│ 5 chips   │ 3 btns    │ arrival   │ Stepped gold / Lacquer / Burgundy        │
│           │ 3 chips   │ link + sw │                                          │
├───────────┴───────────┴───────────┴──────────────────────────────────────────┤
│ Hairline · Step · Fan · Symmetry                                             │
└──────────────────────────────────────────────────────────────────────────────┘
```

- Header: `grid-template-columns: 1fr auto 1fr`. Left nav Type + Colour; right nav Controls + Surface.
- Grid `gap: 1px; background: var(--gold)` so every cell boundary is a gold hairline.
- Labels use a gold hairline on both sides of the title (flex + `::before` / `::after`).
- Footer is lacquer with gold 10px/600 Josefin, tracking +0.16em.
- Tabs sit in `.tabs` as `inline-flex` (not a full-width bar) so the Suite / Chamber / Salon lockup is a centred jewel, not a stretched track.
- Copy block is `top: 148px` so it clears the 90px fan. The reservation button sits in `.reserve` with `justify-content: center; gap: 10px`.
- Josefin Sans sits low in its em; add `padding-top: 2px` on the brand subtitle and on any Josefin string vertically centred against Italiana.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
|---------|---------|----------|-----------|---------:|--------|
| `.btn` | hover | background, color, border | lacquer/ivory → gold/lacquer | 180ms | `--ease` |
| switch knob | toggle | translateX | 0 → 22px | 240ms | `--ease` |
| input focus | focus | border-color, box-shadow | gold-line → gold + 1px follow | 180ms | `--ease` |
| tab selected | click | background, color | transparent/ink-2 → lacquer/ivory | instant | — |

No looping motion. The fan and steps are static. Reduced motion: 1ms transitions.

## States

- **Button rest:** 44px, 1px lacquer, 0 radius, uppercase Josefin 12px / +0.14em. Solid lacquer/ivory. Ghost transparent/lacquer. Gold: gold hairline, gold text.
- **Hover:** gold fill, lacquer text (solid and gold); ghost becomes lacquer/ivory.
- **Tab selected:** lacquer fill, ivory text, inside a 1px gold bar. Unselected: transparent, `--ink-2`.
- **Chip pressed:** burgundy, ivory text. Unpressed: gold hairline, `--ink-2`.
- **Input:** no box, 1px gold-line bottom. Focus: gold + 1px follow.
- **Switch on:** lacquer track, gold knob at right.
- **Focus-visible:** 1px gold, offset 4px (the extra offset is the "jewellery" of the language).

## Accessibility

- Two header navs: "Kit sections" (Type, Colour) and "Kit more" (Controls, Surface). Hero labelled "Composition: hotel identity and reservation". Room group is a `tablist`.
- Steps and fan are `aria-hidden="true"`.
- Switch labelled "Late dining". Chips `aria-pressed`.
- Contrast: lacquer on ivory 14.6:1; ivory on lacquer 14.6:1; gold on ivory 2.4:1 — **gold is lines and 11px/600 labels only**, never body. `--ink-2` on ivory 6.2:1. Ivory on burgundy 8.1:1.
- Hit targets: buttons 44px; tabs 36px tall, full bar; switch label is the hit area.

## Responsive rules

- ≥ 1280: as drawn.
- 700–1100: hero and specimen span 12; headline 42px; header side navs hide; components and grammar span 6.
- < 700: every cell spans 12; hero 480px.
- Applying the language: keep 0 radius. A 4px round "to soften" destroys Deco. Keep the name centred even in a sidebar product — lock a centred lockup, do not left-align Italiana headlines.

## Acceptance checklist

- [ ] Cells are ivory on a lacquer field; every region boundary is a 1px gold gap, not a cell border.
- [ ] No `border-radius` on any control. No drop shadows.
- [ ] Hero headline is Italiana 56px, uppercase, tracking +0.12em, centred.
- [ ] Three stepped gold bars (420, 360, 300 × 8px) sit at the top of the hero, centred.
- [ ] A stroke-only gold sunburst (220×90, 1.2px) sits above the name.
- [ ] Suite / Chamber / Salon tabs rewrite the stay paragraph and set `aria-selected`.
- [ ] Arrival input is Italiana 18px with a 1px gold underline that thickens on focus.
- [ ] Pressed chips are burgundy `#8B2A32`, not gold fills.
- [ ] Focus-visible is 1px gold, 4px offset.
- [ ] Late-dining switch slides 22px and sets `aria-checked`.
- [ ] Only Italiana and Josefin Sans are loaded.
- [ ] Gold is never used as body text.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: 64px ivory header, three-column grid (nav | brand | nav). Brand is Italiana 22px, tracking +0.28em, with "EST. 1926 · KIT 05" in 9px gold Josefin. Sheet gap is 1px gold. First 800px shows the 420px hero + specimen.
2. Hero is text-align center. Three gold bars at the top: 420×8, 360×8, 300×8, stacked 12px apart, each `left: 50%; transform: translateX(-50%)`. A stroke-only sunburst SVG sits at `top: 48px`.
3. Hover a solid button: fill and border become gold, text becomes lacquer, 180ms. Ghost inverts to lacquer fill. Gold outline fills gold.
4. Click Suite / Chamber / Salon. `aria-selected` moves; the selected tab is lacquer fill, ivory text. Copy swaps: harbour suites; corner chambers on the sixth floor; salon for a night.
5. Click Harbour / Garden / Roof chips: pressed state is burgundy fill, ivory text.
6. Focus the arrival input: the 1px bottom rule becomes solid gold with a 1px gold follow-shadow (`box-shadow: 0 1px 0 var(--gold)`). Type is Italiana 18px.
7. Click Late dining: `aria-checked` flips; track fills lacquer; gold knob slides 22px over 240ms.
8. Header link hover: lacquer text + 1px gold underline.
9. Reduced motion: transitions 1ms.

## Tokens

```css
:root {
  --ivory: #f6efe0;          /* paper, 60 % */
  --ivory-2: #ebe1cc;        /* inner rules */
  --lacquer: #0f1c18;        /* ink / field, 25 % */
  --gold: #c4a35a;           /* hairline, 10 % */
  --gold-line: rgba(196,163,90,.45);
  --burgundy: #8b2a32;       /* selected chip only */
  --ink-2: #4a5648;
  --display: "Italiana", Didot, serif;
  --text: "Josefin Sans", system-ui, sans-serif;
  --fs-display: 56px; --fs-aa: 92px; --fs-h2: 24px; --fs-body: 14px; --fs-label: 11px;
  --hair: 1px; --pad: 20px; --ctl: 44px; --radius: 0;
  --t-micro: 180ms; --t-line: 320ms; --t-switch: 240ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Hero headline | Italiana | 56px | 400 | .95 | +0.12em | UPPERCASE |
| Specimen glyph | Italiana | 92px | 400 | .8 | +0.04em | "Aa" |
| Brand | Italiana | 22px | 400 | 1 | +0.28em | UPPERCASE |
| Grammar title | Italiana | 16px | 400 | 1 | +0.1em | UPPERCASE |
| Input value | Italiana | 18px | 400 | 1 | +0.08em | as typed |
| Button / tab | Josefin Sans | 11–12px | 600 | 1 | +0.14–0.18em | UPPERCASE |
| Body | Josefin Sans | 14px | 400 | 1.5 | 0 | sentence |
| Label / eyebrow | Josefin Sans | 10–11px | 600 | 1 | +0.2–0.22em | UPPERCASE, gold |

Italiana is 400 only and sits high in the em. Add 2–4px optical padding when vertically centering it (brand subtitle is Josefin, which sits low — they will not share a baseline).

## Implementation notes

**Hairlines from the grid gap**, same trick as a dark-rule sheet, but the gap colour is gold:

```css
.sheet { display: grid; grid-template-columns: repeat(12, 1fr); gap: 1px; background: var(--gold); }
.cell { background: var(--ivory); padding: 20px; }
```

**Stepped ziggurat** is three centred bars, not a clip-path:

```css
.step { position: absolute; left: 50%; transform: translateX(-50%); background: var(--gold); height: 8px; }
.step.s1 { width: 420px; top: 0; }
.step.s2 { width: 360px; top: 12px; }
.step.s3 { width: 300px; top: 24px; }
```

**Buttons invert through gold**, they do not lift:

```css
.btn {
  height: 44px; padding: 0 20px; border: 1px solid var(--lacquer);
  background: var(--lacquer); color: var(--ivory);
  font: 600 12px var(--text); letter-spacing: .14em; text-transform: uppercase;
}
.btn:hover { background: var(--gold); border-color: var(--gold); color: var(--lacquer); }
```

Common mistakes: using Cormorant or another text serif instead of Italiana (the wide tracking is the point); filling the sunburst; putting burgundy on the primary button; adding a soft gold gradient (the gold is a flat `#C4A35A` hairline, not champagne metal); left-aligning the hotel name.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
