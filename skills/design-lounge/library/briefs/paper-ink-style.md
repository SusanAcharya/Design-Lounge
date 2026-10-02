<!-- Design Lounge Nº 050 · "Paper and ink design style" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Paper and ink design style

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A style sheet for a notes product ("Quire") that looks like it was set on laid paper and corrected with one red pen. The page is warm off-white with a fixed full-screen SVG `feTurbulence` grain at 9 % multiply; type is ink-black Newsreader for headings, labels and table body (with true italics for emphasis) and Inter for UI chrome. Separation comes from hairlines and slightly darker paper, never from drop shadows. Tags look like rubber stamps: red double border, uppercase tracked type, each rotated 1–2°. The card carries an "Approved" stamp that slams in at 160 % → 100 % when you press the button. The one detail worth copying is the hand-drawn underline under the page title: a single wobbly SVG path, drawn over 600ms with `pathLength="1"`.

## Reference behaviour

1. Initial state: title "Quire *style sheet*" at 40px with the red underline drawing itself (200ms delay, 600ms); three columns: Buttons + Inputs + Tags (340px), Card (360px), Table (rest).
2. Hover the primary button: ink fill lightens to `--ink-2`. Hover the ghost button: paper darkens to `--paper-3`. Hover the text button: a 10 % red wash behind it. Active: any button drops 1px.
3. Click "Pin to desk": it toggles `aria-pressed`; pressed = solid ink fill with paper text.
4. Inputs are underline-only. Focus: the 1.5px underline turns ink and doubles to 3px via a box-shadow. Placeholders are italic serif.
5. Tags toggle `aria-pressed` on click; pressed or hovered = solid red with paper text. Each tag keeps its own rotation (−2°, 1°, −1°, 2°).
6. Click "Approve entry" on the card: the "APPROVED" stamp appears at the card's top-right, rotating −8° and scaling from 1.6 to 1 while fading to 90 % over 360ms with an overshoot curve. Clicking again replays it. "Reset" removes it.
7. Hover a table row: the row's cells take `--paper-2`; nothing else changes.
8. Nothing loops; the underline draws once per load.

## Structure

```
1280 × 800   (padding 36 56 / 28 56)
┌──────────────────────────────────────────────────────────────────────────┐
│ Quire style sheet (40px)   Paper, ink, one red pen.     rev. 14 · 29 Sept │
│ ~~~~~~~~~~~~~~ red underline 230×8                                        │
├──── 340 ────────────┬──── 360 ─────────────────┬──── 1fr ───────────────┤
│ BUTTONS ─────────── │ CARD ──────────────────── │ TABLE ───────────────── │
│ [Save note] [Pin]   │ ┌ paper-2 ─────────────┐ │ Ink and paper orders…   │
│   Discard           │ │ FIELD NOTES · No.112 │ │ ITEM  SUPPLIER  QTY TOTAL│
│ INPUTS ──────────── │ │ On keeping a         │ │ ──────────────────────  │
│ Title               │ │ commonplace book     │ │ Iron-gall ink…  6  €84  │
│ ______________      │ │ Copy the sentence…   │ │ Laid paper…  4 reams …  │
│ Notebook            │ │ Anselm Frey · 412 w… │ │ Red correction pen …    │
│ ______________      │ │ [Approve entry][Reset]│ │ Bookcloth, ochre …      │
│ Date                │ └──────────────────────┘ │ ─────────────────────── │
│ ______________      │        (APPROVED stamp)  │ Total          € 283.00 │
│ TAGS ────────────── │                          │ Hover a row; nothing…   │
│ [DRAFT][READING]…   │                          │                         │
└─────────────────────┴──────────────────────────┴─────────────────────────┘
```

- `<svg class="grain">` fixed, full-screen, `pointer-events:none`, `mix-blend-mode:multiply`, opacity `--grain`; contains a `<filter>` (feTurbulence + feColorMatrix) and one `<rect>` using it.
- `<header class="top">` → `<h1>` with `<em>`, the underline `<svg class="ul">`, a tagline `<p>`, right-aligned italic revision.
- `.grid` three columns; each `<section>` starts with an `<h6>` label that ends in a hairline (`::after`).
- Buttons: `.btn` (ink), `.btn.ghost[aria-pressed]`, `.btn.text`. Inputs: `.fld` → italic serif `<label>`, underline `<input>`/`<select>`, optional `<small>`. Tags: `<button class="tag" aria-pressed style="--rot">`.
- Card: `<article class="card">` → `.stamp` (absolute), `.k` kicker, `<h3>` with `<em>`, `<p>`, `.meta`, `.act`.
- Table: `<table>` with `<caption>`, `<thead>`, `<tbody>`, `<tfoot>`; numeric cells `.n`.

## Tokens

```css
:root {
  /* colour — warm paper, ink, one red */
  --paper: #f4efe4;         /* page */
  --paper-2: #ede6d8;       /* card, row hover */
  --paper-3: #e4dcc9;       /* ghost button hover */
  --line: #d9d0bf;          /* hairlines */
  --line-2: #b9ae98;        /* input underline, card bottom edge */
  --ink: #1a1814;
  --ink-2: #55504a;         /* body copy, labels */
  --ink-3: #8a8378;         /* kickers, meta, placeholders */
  --red: #a63a2b;           /* underline, tags, stamp, text button */
  --red-soft: rgba(166, 58, 43, .1);

  /* type */
  --serif: "Newsreader", Georgia, serif;   /* opsz 6..72, italic */
  --sans: "Inter", system-ui, sans-serif;

  /* surface */
  --grain: .09;             /* opacity of the noise layer */
  --grain-freq: .9;         /* feTurbulence baseFrequency */
  --r: 2px;                 /* near-square corners */
  --bw: 1.5px;              /* border weight */
  --btn-h: 38px;
  --input-h: 36px;

  /* motion */
  --t-micro: 140ms;
  --t-draw: 600ms;
  --t-stamp: 360ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease-stamp: cubic-bezier(.34, 1.4, .64, 1);
}
```

## Typography

| Role             | Family     | Size  | Weight | Line-height | Tracking | Case / style |
|------------------|------------|------:|-------:|------------:|---------:|--------------|
| Page title       | Newsreader | 40px  | 400    | 1           | −0.02em  | sentence; second half italic; `opsz` 72 |
| Section label    | Inter      | 11px  | 500    | 1           | +0.14em  | UPPERCASE `--ink-3` |
| Body / UI        | Inter      | 15px  | 400    | 1.55        | 0        | sentence |
| Button           | Inter      | 14px  | 500    | 1           | 0        | sentence |
| Field label      | Newsreader | 15px  | 400    | 1.4         | 0        | italic `--ink-2` |
| Input value      | Newsreader | 16px  | 400    | 1           | 0        | roman; placeholder italic `--ink-3` |
| Tag / stamp      | Inter      | 11px / 13px | 500 | 1         | +0.16em / +0.2em | UPPERCASE red |
| Card kicker      | Inter      | 11px  | 500    | 1           | +0.14em  | UPPERCASE |
| Card title       | Newsreader | 26px  | 500    | 1.15        | −0.01em  | one italic word at 400; `opsz` 36 |
| Card body        | Newsreader | 16px  | 400    | 1.5         | 0        | `--ink-2` |
| Table body       | Newsreader | 15px  | 400    | 1.45        | 0        | supplier italic; numerals tabular |
| Table header     | Inter      | 11px  | 500    | 1           | +0.14em  | UPPERCASE, 1.5px ink rule below |
| Caption / notes  | Newsreader | 14–15px | 400  | 1.45        | 0        | italic `--ink-3` |

## Motion

| Element          | Trigger        | Property            | From → To                          | Duration | Easing         | Delay |
|------------------|----------------|---------------------|------------------------------------|---------:|----------------|-------|
| `.ul path`       | load           | stroke-dashoffset   | 1 → 0                              | 600ms    | `--ease-out`   | 200ms |
| `.stamp`         | Approve        | transform, opacity  | `rotate(-8deg) scale(1.6)`, 0 → `rotate(-8deg) scale(1)`, .9 | 360ms | `--ease-stamp` | 0 |
| `.btn`           | hover / active | background / translateY | — / 0 → 1px                    | 140ms    | `--ease`       | 0 |
| `.tag`           | hover / press  | background, color   | transparent/red → red/paper        | 140ms    | `--ease`       | 0 |
| input underline  | focus          | border-color, box-shadow | `--line-2` → `--ink`, +1.5px  | 140ms    | `--ease`       | 0 |
| table row        | hover          | background          | transparent → `--paper-2`          | 0        | —              | instant |

Reduced motion: underline appears drawn; stamp appears at rest in 1ms; transitions 1ms.

## States

- **Primary button:** ink fill, paper text; hover `--ink-2`; active down 1px; focus-visible 2px red outline, 2px offset.
- **Ghost button:** transparent, ink border; hover `--paper-3`; pressed (`aria-pressed="true"`) ink fill.
- **Text button:** red, underlined 1px at 4px offset; hover red wash.
- **Input:** underline `--line-2`; focus underline ink + 1.5px shadow (3px total). No box, no radius.
- **Tag:** red 1.5px outer border + 1px inner border (`::after` inset 2px, 60 % opacity); hover/pressed solid red; focus-visible 2px ink outline at 3px offset.
- **Card:** `--paper-2` with a 1px `--line` border and a 1px `--line-2` bottom edge (`box-shadow: 0 1px 0`), no blur.
- **Stamp:** hidden (opacity 0) until `.stamped` on the card.
- **Table row hover:** `--paper-2`. **Footer row:** 1.5px ink top rule, weight 500.

## Accessibility

- Toggling buttons use `aria-pressed`; tags are buttons, not spans.
- Inputs have visible `<label for>`; the italic serif label is still ≥ 15px and `--ink-2` (6.3:1 on paper).
- The stamp is `aria-hidden`; if approval matters to assistive tech, also update a status line ("Entry approved").
- Focus rings: red 2px for ink buttons and inputs (underline thickening also signals focus), ink 2px for red tags. Never rely on the paper darkening alone.
- The grain layer is `aria-hidden` and `pointer-events:none`; keep its opacity ≤ 0.1 so it never reduces text contrast below 4.5:1 (`--ink-2` on `--paper` is 7.6:1 before grain).
- Table: `<caption>` present; numeric columns right-aligned with tabular numerals.
- Hit targets: buttons 38px, tags 23px tall (fine for desktop; use 32px on touch), inputs 36px.

## Responsive rules

- ≥ 1280: three columns 340 / 360 / 1fr.
- 1024–1279: columns 300 / 320 / 1fr; table font 14px.
- 768–1023: two columns (buttons+inputs+tags | card), table below spanning both.
- < 640: one column, padding 20px; title 30px, underline scaled with the title width; table becomes a stacked list (item on one line, supplier/qty/total on the next).

## Acceptance checklist

- [ ] Grain is an inline SVG `feTurbulence` (`fractalNoise`, baseFrequency .9, 2 octaves) fixed over the page at 9 % opacity with `mix-blend-mode: multiply`.
- [ ] No blurred drop shadows anywhere; separation uses hairlines and `--paper-2`/`--paper-3`.
- [ ] Headings and table body are Newsreader; UI labels and buttons are Inter.
- [ ] The title underline is one SVG path with `pathLength="1"` drawn 1 → 0 over 600ms after a 200ms delay.
- [ ] Tags have a double red border (1.5px + inner 1px) and per-tag rotations of −2°, 1°, −1°, 2°.
- [ ] "Approve entry" plays the stamp (scale 1.6 → 1, −8°, 360ms, overshoot) and replays on every click.
- [ ] Inputs are underline-only; focus thickens the underline to 3px in ink.
- [ ] `aria-pressed` toggles on Pin and every tag.
- [ ] Table row hover only changes background to `--paper-2`.
- [ ] Body text contrast ≥ 4.5:1 with the grain layer on.
- [ ] Reduced motion removes the draw and the stamp motion.

## Implementation notes

**Grain without an image.** One SVG, fixed, blended:

```html
<svg class="grain" aria-hidden="true">
  <filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix values="0 0 0 0 .2  0 0 0 0 .17  0 0 0 0 .12  0 0 0 .9 0"/></filter>
  <rect width="100%" height="100%" filter="url(#g)"/>
</svg>
```
```css
.grain { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; opacity: var(--grain); mix-blend-mode: multiply; z-index: 9; }
```

**Stamp overshoot.** Scale down *into* place with a curve that overshoots slightly, and re-trigger by removing the class, reflowing, and adding it:

```css
.stamp { transform: rotate(-8deg) scale(1.6); opacity: 0; }
.card.stamped .stamp { animation: stamp var(--t-stamp) var(--ease-stamp) forwards; }
@keyframes stamp { to { transform: rotate(-8deg) scale(1); opacity: .9; } }
```

**Stamp-like tags** get their second ring from a pseudo-element: `.tag::after { content:""; position:absolute; inset:2px; border:1px solid var(--red); opacity:.6; }` and their tilt from `transform: rotate(var(--rot))` set inline per tag.

Common mistakes: omitting `width:100%; height:100%` on the grain SVG (a replaced element ignores `inset:0` and renders at 300×150); using a PNG noise texture (breaks the one-file rule and pixelates on scale); adding radius or shadows to inputs; tinting the grain layer white (it should darken, so multiply with a dark colour matrix); forgetting `stitchTiles` so the noise seams at the edges.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
