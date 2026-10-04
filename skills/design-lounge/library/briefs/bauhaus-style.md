<!-- Design Lounge Nº 097 · "Bauhaus design language kit" · designlounge.vercel.app -->

# Bauhaus design language kit

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

A kit sheet for "formhaus", a fictional Bauhaus-revival furniture brand, that doubles as a style guide you can apply to a whole product. The page is a 12-column grid of paper cells separated by 3px ink rules (the grid's `gap` shows the black body behind it). The first row is a live landing hero for "Regal 25" modular shelving, with a red circle, blue square, yellow triangle, ink bar and ink dot composed on the right, next to a type specimen with a 150px "Aa". The second row holds the palette with roles, buttons in four states, tags, inputs and a product card; the third row states the shape grammar (circle acts, square holds, triangle points, rule divides). The detail worth copying: **shape carries meaning**. Circles are only ever actions or status, squares are containers, triangles point; nothing is rounded unless it is a circle.

## Structure

```
1280 × 800 first frame (sheet continues to ≈ 1000px; body scrolls)
┌──────────────────────────────────────────────────────────────────────────────┐
│ ●■▲ formhaus / design language 01      TYPE COLOUR CONTROLS GRAMMAR  Kit v1.4│ 56 + 3px rule
├───────────────────────────────────────────────┬──────────────────────────────┤
│ formhaus möbel      Kollektion Werkstatt Journal [Cart 2] │ ● 01 TYPE SPECIMEN│
│ REGAL 25 · MODULAR SHELVING          ●    ( red circle 290 )  │ Aa (150px)  Josefin…│
│ build it                      ━━━━━━━━              │ ─────────────────────│
│ in squares.  (76px)       ■ (150)   ▲ (180×156)     │ Display 76 form follows│
│ body 15px                                        │ H2 26 / H3 18 / Body 15 │
│ [Configure Regal 25 →] [1925 drawings]     (↻) │ Label 11              │
│ From €640 · ships in 3 weeks             cols 1–7 · 424h │ cols 8–12 · 424h   │
├───────────┬───────────┬───────────┬──────────────────────────────────────────┤
│02 PALETTE │03 BUTTONS │04 INPUTS  │05 CARD                                   │
│ 5 swatches│ 3 buttons │ postcode  │ [blue art 118h, yellow circle, NEW tag]  │
│ 46px rows │ 4 states  │ email err │ Stuhl B3 · €1,180 [Add]                  │
│ ratio bar │ 5 tags    │ ☐ ◉ ○ sw  │                                          │
│ cols 1–3  │ cols 4–6  │ cols 7–9  │ cols 10–12                     ≈ 254h    │
├───────────┴───────────┴───────────┴──────────────────────────────────────────┤
│ ● Circle acts │ ■ Square holds │ ▲ Triangle points │ ━ Rule divides  (span 3 each)
│ footer strip: kit summary · "Click the round button to recompose"            │
└──────────────────────────────────────────────────────────────────────────────┘
```

- `<header class="top">`: `.mark` (three 16px shapes, 4px gap), `.brand`, `<nav aria-label="Kit sections">` with four anchors, `.ver`.
- `<main class="sheet">`: `display: grid; grid-template-columns: repeat(12, 1fr); gap: 3px; background: var(--ink)`. Every child is a `.cell` with paper background and 20px padding; the gap is the rule.
- `.hero` (`<section>`, cols 1–7, 424px, `overflow: hidden`, `data-comp="1|2|3"`): five absolutely positioned `.shape` divs, a `.mini` nav, a `.copy` block (eyebrow, `<h1>`, `<p>`, two buttons, meta line) and the round `.recomp` button.
- `.spec` (cols 8–12, 424px): `<h2 class="lbl">`, `.aa` row (glyph + two family notes), `<ul class="scale">` of five rows (`<em>` meta + sample).
- `.pal`, `.ctl`, `.inp`, `.crd`: span 3 columns each. `.gram` × 4 span 3 each. `.foot` spans 12.
- Section labels are `<h2 class="lbl">` with a 9px shape before them; the shape class (`c`, `s`, `t`) picks circle/red, square/blue or triangle/yellow.

## Motion

| Element        | Trigger        | Property                     | From → To                         | Duration | Easing  |
|----------------|----------------|------------------------------|-----------------------------------|---------:|---------|
| `.btn`         | hover          | transform, box-shadow        | 0,0 / none → −3px,−3px / 3px 3px 0 ink | 120ms | `--ease` |
| `.btn`         | active         | transform, box-shadow        | lifted → 0,0 / none               | 120ms    | `--ease` |
| `.card`        | hover          | transform, box-shadow        | → −4px,−4px / 4px 4px 0 ink       | 120ms    | `--ease` |
| `.shape` × 5   | Recompose click| transform                    | arrangement n → n+1 (values below)| 520ms    | `--expo` |
| checkbox/radio mark | change    | transform: scale             | 0 → 1                             | 120ms    | `--expo` |
| switch knob    | toggle         | translateX, border-radius, bg| 0 / 0 / ink → 24px / 50 % / red   | 240ms    | `--expo` |
| switch track   | toggle         | background                   | paper → yellow                    | 120ms    | linear  |
| input focus    | focus          | box-shadow                   | none → `--focus-block`            | 120ms    | `--ease` |

Arrangement 2: circle `translate(-230px,120px) scale(.62)`, square `translate(170px,-200px) rotate(90deg) scale(1.3)`, triangle `translate(-40px,-210px) rotate(180deg)`, bar `rotate(0) translate(40px,150px)`, dot `translate(200px,240px) scale(1.6)`. Arrangement 3: circle `translate(20px,-90px) scale(1.25)`, square `translate(-30px,-30px) rotate(45deg)`, triangle `translate(-200px,0) rotate(-90deg) scale(.8)`, bar `rotate(-90deg) translate(-40px,-40px)`, dot `translate(-40px,190px)`. Arrangement 1 is the untransformed layout.

Reduced motion: every transition 1ms. Recompose still swaps arrangements, instantly.

## States

- **Button rest:** 44px tall, 2px ink border, 0 radius. Primary red / on-color text; secondary blue / on-color; neutral paper / ink; round = 44px yellow circle with an ink arrow.
- **Hover:** lifted 3px up-left with a 3px hard ink shadow. **Pressed:** flat, no shadow. **Disabled:** `--paper-2` fill, `--ink-3` text and border, no lift, `cursor: not-allowed`.
- **Focus-visible (everything):** `outline: 3px solid var(--blue); outline-offset: 3px`. Inputs replace this with `--focus-block`.
- **Input error:** border `--red`, fill `--error-fill`, message 12px/500 red below, `aria-invalid` + `aria-describedby`.
- **Checkbox checked:** red 10px square inside the 20px box. **Radio checked:** blue 10px disc inside a 20px circle.
- **Switch on:** yellow track, red circular knob at the right. **Off:** paper track, ink square knob at the left.
- **Tags:** 26px, 2px ink border, 8px leading shape. Yellow "New" (square), red "Sale" (circle), blue "Info" (square), ink "Last 3" (triangle, paper text), plain "Birch".
- **Nav link hover:** 2px red bottom border.

## Accessibility

- Header `<nav aria-label="Kit sections">`; each kit cell is a `<section>` labelled by its `<h2>`; the hero is labelled "Composition: product landing hero".
- All decorative shapes (`.shape`, card art, grammar glyphs, the mark) are `aria-hidden="true"`.
- The static state specimens are `aria-hidden` with `tabindex="-1"` so they don't add four extra tab stops.
- Recompose is an icon button with `aria-label` that reports the arrangement ("arrangement 2 of 3").
- The switch is `<button role="switch" aria-checked>`; checkboxes and radios are native inputs visually hidden, with focus drawn on the replacement `<i>`.
- Contrast: ink on paper 16.4:1; ink-2 on paper 8.1:1; paper on red 5.7:1; paper on blue 6.6:1; ink on yellow 10.9:1. Red text on paper (eyebrow, error message) is 4.9:1 and only used at ≥ 11px/600.
- Hit targets: controls 44px; the switch is 52 × 28 but its whole label is clickable.

## Responsive rules

- ≥ 1280: as drawn; the sheet continues to ≈ 1000px and the body scrolls.
- 1024–1279: same grid; the hero shapes are pinned to the right edge so they crop instead of colliding with the copy.
- 700–1100: hero and specimen each span 12 columns; component cells and grammar cells span 6; header anchors hide.
- < 700: every cell spans 12; hero becomes 520px tall with a 56px headline and the circle pushed below the copy; specimen height becomes auto.
- Applying the language to a product: keep 3px region rules on any layout, 2px on controls, never introduce a radius between 0 and 50 %.

## Acceptance checklist

- [ ] Only five colours appear (paper, ink, red, yellow, blue) plus `--paper-2`, `--ink-2/3` and the error fill.
- [ ] Regions are separated by a 3px ink grid gap, not by borders on each cell.
- [ ] No border-radius anywhere except true circles (round button, radio, switch knob when on, red circle shapes).
- [ ] Hero headline is Josefin Sans 700, 76px, line-height .88, lowercase.
- [ ] Buttons are 44px tall with a 2px ink border and lift 3px with a hard 3px shadow on hover, flatten on press.
- [ ] The States strip shows rest, hover, pressed and disabled at once without interaction.
- [ ] Recompose cycles three shape arrangements over 520ms expo-out; the copy never moves.
- [ ] Input focus draws a 5px yellow offset block with a 2px ink edge; error state uses red border, pale fill and a described message.
- [ ] The switch knob is a square when off and a circle when on, and `aria-checked` flips.
- [ ] Section labels carry a 9px circle, square or triangle that matches their colour role.
- [ ] Focus is visible on every link, button and input (3px blue, 3px offset).
- [ ] With reduced motion, all state changes still happen instantly.
- [ ] No font other than Josefin Sans and Work Sans is loaded.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: header bar (56px) with a three-shape mark, "formhaus / design language 01", four section anchors and "Kit v1.4 · Weimar · Oct 2026". Below it the sheet; the first 800px show the hero, specimen and the whole component row.
2. Hover any rectangular button: it lifts `translate(-3px, -3px)` and gains a hard `3px 3px 0` ink shadow over 120ms. Press: it drops back to 0/0 with no shadow. The "States" strip shows Rest / Hover / Pressed / Disabled statically using forced classes, so the states are readable without interacting.
3. Click the yellow round button in the hero's bottom-right corner ("Recompose"): the five shapes move to arrangement 2 over 520ms with expo-out easing (circle shrinks to .62 and drops left, square rotates 90° and grows to 1.3, triangle flips 180°, bar goes horizontal, dot grows). Click again: arrangement 3. Again: back to 1. The copy column never moves.
4. Focus a text input or the select: a 5px yellow offset block appears behind it, outlined by a 2px ink edge (a "printed" focus shadow). No radius, no glow.
5. The email field ships in its error state: red 2px border, pale red fill `#F6DDD6`, 12px red message under it, `aria-invalid="true"`.
6. Click the checkbox: a 10px red square scales from 0 → 1 in 120ms. Click a radio: a 10px blue disc does the same.
7. Click the switch: the track fills yellow and the knob slides 24px right **and morphs from an ink square to a red circle** (240ms expo-out). Off again: back to an ink square.
8. Hover the product card: it lifts 4px with a 4px hard ink shadow.
9. Header anchors jump to sections; their hover state is a 2px red underline.

## Tokens

```css
:root {
  /* colour: paper + ink + three primaries */
  --paper: #f0ebe0;      /* surface, 60 % of any screen */
  --paper-2: #e4dccb;    /* inner list rules, disabled fill */
  --ink: #151412;        /* text, all borders, hard shadows, 20 % */
  --ink-2: #4a463f;      /* secondary text */
  --ink-3: #6e685d;      /* meta labels, disabled text */
  --red: #d52b1e;        /* primary action, circles, errors (8 %) */
  --yellow: #f3b61f;     /* highlight, focus fill, "new" (7 %) */
  --blue: #1d4f9c;       /* info, links, focus ring, secondary action (5 %) */
  --on-color: #f0ebe0;   /* text on red / blue */
  --error-fill: #f6ddd6;

  /* type */
  --display: "Josefin Sans", Futura, "Century Gothic", sans-serif;
  --text: "Work Sans", system-ui, sans-serif;
  --fs-display: 76px; --fs-aa: 150px; --fs-h2: 26px; --fs-h3: 18px; --fs-body: 15px; --fs-ui: 14px; --fs-label: 11px; --fs-meta: 10px;

  /* geometry */
  --rule: 3px;           /* between regions */
  --line: 2px;           /* around controls */
  --pad: 20px;           /* cell padding */
  --ctl: 44px;           /* control height */
  --radius: 0;           /* the only exception is a full circle (50 %) */
  --lift: 3px;           /* button hover lift; cards use 4px */
  --shadow-hard: 3px 3px 0 var(--ink);
  --focus-block: 5px 5px 0 var(--yellow), 5px 5px 0 2px var(--ink);
  --space: 4px 8px 12px 16px 20px 24px 32px;

  /* motion */
  --t-micro: 120ms;
  --t-switch: 240ms;
  --t-shape: 520ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role            | Family       | Size  | Weight | Line-height | Tracking | Case |
|-----------------|--------------|------:|-------:|------------:|---------:|------|
| Hero headline   | Josefin Sans | 76px  | 700    | .88         | −0.025em | **lowercase** (universal-lowercase nod) |
| Specimen glyph  | Josefin Sans | 150px | 700    | .8          | −0.04em  | "Aa" |
| H2              | Josefin Sans | 26px  | 700    | 1.1         | −0.01em  | sentence |
| H3 / card title | Josefin Sans | 18–22px | 600–700 | 1.1–1.3   | 0        | sentence |
| Brand           | Josefin Sans | 19px  | 700 + 400 | 1        | −0.01em  | lowercase |
| Body            | Work Sans    | 15px  | 400    | 1.5         | 0        | sentence, `--ink-2` |
| Button          | Work Sans    | 14px  | 600    | 1           | +0.01em  | sentence |
| Section label / eyebrow | Work Sans | 11px | 600 | 1          | +0.16em  | UPPERCASE |
| Meta / state captions | Work Sans | 10px | 500  | 1           | +0.08–0.1em | UPPERCASE |
| Tag             | Work Sans    | 10px  | 600    | 1           | +0.14em  | UPPERCASE |

Josefin Sans sits low in its em box; add `padding-top: 2–4px` to any Josefin text that is vertically centred against a box (brand, card title, price) so it looks optically centred.

## Implementation notes

**Rules from the grid gap.** Paint the grid container ink and let each paper cell sit on it; every region boundary is then exactly 3px and never doubles up:

```css
.sheet { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--rule); background: var(--ink); }
.cell  { background: var(--paper); padding: var(--pad); min-width: 0; }
.hero  { grid-column: 1 / 8; height: 424px; overflow: hidden; padding: 0; }
```

**Square-to-circle switch.** The knob morphs geometry as it travels, which is the language's whole argument in one control:

```css
.sw-t button { width: 52px; height: 28px; border: 2px solid var(--ink); background: var(--paper); position: relative; }
.sw-t button::after { content: ""; position: absolute; left: 3px; top: 3px; width: 18px; height: 18px; background: var(--ink);
  transition: transform var(--t-switch) var(--expo), border-radius var(--t-switch) var(--expo), background var(--t-switch); }
.sw-t button[aria-checked="true"] { background: var(--yellow); }
.sw-t button[aria-checked="true"]::after { transform: translateX(24px); border-radius: 50%; background: var(--red); }
```

**Recompose is data-attribute driven**; the shapes have one transition and three transform sets:

```js
let c = 1;
recomp.addEventListener('click', () => {
  c = c % 3 + 1; hero.dataset.comp = c;
  recomp.setAttribute('aria-label', `Recompose shapes, arrangement ${c} of 3`);
});
```

Triangles are `clip-path: polygon(50% 0, 100% 100%, 0 100%)` on a div, not SVG, so they share the same transition as the other shapes. Common mistakes: adding an 8px radius "for friendliness" (it destroys the grammar); using soft blurred shadows (only hard, zero-blur offsets exist here); putting red on body text; centring Josefin Sans by line-height alone (it rides high; add 2–4px top padding).

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
