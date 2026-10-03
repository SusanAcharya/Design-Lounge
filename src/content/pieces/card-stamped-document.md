---
title: "Stamped document"
summary: "An official permit on a desk blotter: a paperclipped receipt, a signature that draws itself, and an APPROVED rubber stamp that thumps down wherever you click."
platform: web
type: component
category: cards
tags: [cards, document, stamp, signature, approval]
styles: [paper, retro, editorial]
motion: rich
difficulty: 2
featured: false
published: 2026-10-03
palette: ["#2E3A33", "#F2EBD9", "#2A2723", "#C0262D", "#1F3A8A"]
fonts: ["Old Standard TT", "Special Elite"]
related: [card-postcard-stamp, receipt-slip, card-folder-tabs]
---

# Stamped document

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

An approval card for a back-office queue, drawn as a real paper form. A typed mooring permit from the "Port Ellery Harbour Authority" lies on a dark green leather blotter, tilted −1.2°, with a receipt slip paperclipped behind its top-left corner and two faint fold lines across it. The left column is the in-tray: four progress steps and three buttons. Sign draws a blue ballpoint signature along the line in 1.5s. Stamp thumps a red APPROVED rubber stamp onto the paper. Ink soaks into the fibres: the edges are rough and speckled, and a soft blur bleeds out over 1.3s. Clicking anywhere on the paper stamps it right there at a fresh angle. The detail worth copying is the ink: one SVG filter roughens and pits the stamp, and a second blurred copy bleeds under it.

## Reference behaviour

1. First frame: the permit is already signed and stamped, and the stamp plays its thump on load. All four steps are ticked. "Sign" is disabled because it is done.
2. "Next form" clears the signature, the stamp, the date, and steps 3 and 4. It enables "Sign".
3. "Sign": the signature path draws with `stroke-dashoffset 1 → 0` over 1500ms on `cubic-bezier(.45,.05,.4,1)`. The date field types in "4 October 2026". Step 3 ticks with "04 Oct". The button disables.
4. "Stamp approved", or Enter/Space on the focused permit: the stamp lands centred over the date field, at −7°.
5. Click anywhere on the permit: the stamp lands centred on the click, at a random angle from −10° to +4°. It is clamped 14px inside the paper on every side. There is one stamp; a new click moves it and replays the thump.
6. Thump: the stamp drops from 26px above at scale 1.55 and 0 opacity, overshoots to 0.96 at 42%, rebounds to 1.015 at 70%, and settles at scale 1 and 0.9 opacity in 520ms. 190ms in, the paper dips 3px and to 0.996 scale for 280ms. The bleed layer fades in and blurs from 0 to 1.3px over 1300ms, starting at 140ms.
7. While the pointer is over the paper the cursor is hidden and a dashed red outline the size of the stamp (230 × 92, rotate −4°) follows it, so you see where it will land.
8. Steps tick with a 220ms scale-in check. A polite live region says "Signed by the harbour master.", "Stamped approved.", or "Permit reset: unsigned and unstamped."
9. Reduced motion: the signature appears whole, the stamp appears in place with no drop, no dip, no bleed animation (the bleed is drawn static).

## Structure

```
1280 × 800, body grid centred, padding 32px 24px
blotter #2e3a33 with a lighter radial and fine circular grain
┌─────────────── 280px ───────────────┐   72px   ┌──────────── 560px, rotate −1.2° ────────────┐
│ IN TRAY · 3 OF 11                   │          │ [receipt slip, 210×120, −6°, behind]        │
│ Mooring permit                      │          │  ⊂ paperclip over top-left edge             │
│ for the Saltwren      (34px italic) │          │ (anchor) PORT ELLERY HARBOUR …   [Form HP-12]│
│ ─────────────────────────────────── │          │ ═══════════════════════════════ double 3px   │
│ ☑ Fee received              02 Oct  │          │ Mooring Permit          (40px italic)        │
│ ☑ Berth checked             03 Oct  │          │ Ref. HP-12 / 0884 · Issued under Bylaw 7(2)  │
│ ☐ Signed by the harbour master      │          │ VESSEL ........  BERTH ..........            │
│ ☐ Stamped approved                  │          │ OWNER .........  LENGTH OVERALL ...         │
│ [✎ SIGN] [■ STAMP APPROVED] NEXT FORM│          │ PERIOD ............................          │
│ Or click anywhere on the permit…    │          │ terms paragraph, 44ch                        │
└─────────────────────────────────────┘          │ ~signature~_________   4 October 2026 ____   │
                                                 │ HARBOUR MASTER          DATE   [APPROVED]    │
                                                 └──────────────────────────────────────────────┘
```

- `.desk`: grid `minmax(0,280px) minmax(0,560px)`, gap 72px.
- Left: `section.tray` labelled by its `h1`. Eyebrow, `h1`, `ul.steps` (each `li` has an 18px box with a check SVG and a date in `small`), `.actions` with three buttons, a hint `p`.
- Right: `.docwrap` (rotation) holding `.slip` (absolute, left −26px, top −22px), an SVG paperclip (absolute, left 28px, top −34px, 34 × 96, above everything), and `article.doc` (`tabindex="0"`, `position: relative`, `overflow: hidden`).
- Inside the doc: `header.head` (40px crest SVG, two-line organisation name, boxed form number), `h2`, a reference `p`, a `dl.fields` two-column grid, a terms `p`, `.foot` grid `1.1fr .9fr` with the signature line (74px tall, SVG signature) and the date field, then `.ghost` and `.stamp` absolutely positioned at 0,0 and moved by transform.

Copy:

| Field | Value |
|------|------|
| Vessel | Saltwren |
| Berth | Pontoon C, No. 14 |
| Owner | Wilhelmina Strand |
| Length overall | 9.4 m |
| Period | 1 November 2026 to 31 March 2027 |
| Receipt slip | Receipt / No. 0884 / Mooring fee, 5 months / 412.00 paid in full |
| Terms | The vessel shall be kept in a seaworthy state, display this permit number on the port quarter, and leave the berth within 48 hours of a gale notice from the harbour office. |
| Stamp | APPROVED, sub-line PORT ELLERY · 04 OCT 2026 |

## Tokens

```css
:root {
  --blotter: #2e3a33;   --blotter-2: #36443b;   /* desk, radial lift */
  --on-blotter: #e9e2cf; --on-blotter-2: #a9b3a3; /* tray text, secondary */
  --paper: #f2ebd9;     --paper-2: #e8dfc8;     /* form, fibre tint */
  --rule: #cdbf9f;
  --ink: #2a2723;       --ink-2: #5e574b;       /* typed and printed text */
  --stamp: #c0262d;     /* accent: stamp ink, primary button */
  --pen: #1f3a8a;       /* ballpoint */
  --brass: #c9a35b;     /* focus ring */

  --serif: "Old Standard TT", "Times New Roman", serif;   /* printed form */
  --type: "Special Elite", "Courier New", monospace;      /* typed entries */

  --doc-w: 560px; --doc-pad: 42px 46px 38px; --doc-tilt: -1.2deg;
  --stamp-w: 230px; --stamp-ratio: 230 / 92;
  --sig-w: 230px;

  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-stamp: 520ms; --t-bleed: 1300ms; --t-thud: 280ms; --t-sign: 1500ms;
  --shadow-doc: 0 1px 0 rgba(255,255,255,.4) inset, 0 28px 50px -26px rgba(0,0,0,.8), 0 4px 10px -4px rgba(0,0,0,.4);
}
```

Paper surface: two fold lines at 33.3% and 66.6% (a 1px darker band then a 0.3% highlight), a vignette `radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(120,95,50,.16))`, and a `::before` layer filled with `--paper-2` through a fibre filter (`feTurbulence baseFrequency=".9 .05"`, so the noise streaks horizontally) at 0.55 opacity, `multiply`.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Tray eyebrow | Special Elite | 11px | 400 | 1 | 0.16em | UPPER |
| Tray title | Old Standard TT | 34px | 400 italic | 1.05 | 0 | sentence |
| Step | Old Standard TT | 15px | 400 | 1.5 | 0 | sentence |
| Step date | Special Elite | 11px | 400 | 1 | 0.06em | — |
| Button | Special Elite | 13px | 400 | 1 | 0.08em | UPPER |
| Organisation | Old Standard TT | 11px | 700 / 400 | 1.35 | 0.2em / 0.12em | UPPER |
| Form number | Special Elite | 12px | 400 | 1 | 0.06em | — |
| Document title | Old Standard TT | 40px | 400 italic | 1 | −0.01em | Title |
| Field label | Old Standard TT | 9.5px | 700 | 1 | 0.2em | UPPER, `--ink-2` |
| Field value | Special Elite | 16px | 400 | 1.2 | 0 | as typed |
| Terms | Old Standard TT | 12.5px | 400 | 1.55 | 0 | sentence, 44ch |
| Stamp word | Old Standard TT | 40 (SVG units) | 700 | — | 5 | UPPER |
| Stamp sub-line | Special Elite | 10.5 (SVG units) | 400 | — | 2.5 | UPPER |

Printed parts of the form are the serif; anything filled in by a person or a typewriter is Special Elite. Never swap them.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| `.stamp` | click, button, Enter | transform, opacity | −26px, ×1.55, 0 → ×.96, 1 (42%) → ×1.015 (70%) → ×1, .9 | 520ms | `--expo` | appears at .9 |
| `.stamp .bleed` | same, +140ms | opacity, blur | 0, 0 → .35, 1.3px | 1300ms | ease-out | static .35, 1.3px |
| `.doc` | +190ms after stamp | translateY, scale | 0 → 3px, .996 (35%) → 0 | 280ms | `--ease` | none |
| `.sig` path | Sign | `stroke-dashoffset` | 1 → 0 (`pathLength="1"`) | 1500ms | `cubic-bezier(.45,.05,.4,1)` | instant |
| step check | step done | opacity, scale | 0, .4 → 1, 1 | 160ms / 220ms | `--ease` / `--expo` | instant |
| `.ghost` | pointer over paper | opacity; transform follows pointer | 0 → 1 | 140ms | `--ease` | instant fade |

The stamp's position and angle live in three custom properties (`--x`, `--y`, `--r`) that every keyframe repeats, so the drop never loses its rotation.

## States

- **Unsigned:** signature hidden (`dashoffset 1`), date field empty, step 3 open, Sign enabled.
- **Signed (`.signed` on the line):** blue signature, date "4 October 2026", step 3 ticked, Sign disabled at 40% opacity with `cursor: not-allowed`.
- **Unstamped:** stamp opacity 0.
- **Stamped (`.on`):** stamp at 0.9 opacity, `mix-blend-mode: multiply` so the typed text shows through.
- **Hover on paper:** cursor hidden, dashed ghost visible. Keyboard users never need the ghost.
- **Focus-visible:** 2px `--brass` outline; 3px offset on buttons, 6px around the paper.
- **Buttons:** outline (1px at 40% cream), red primary (`--stamp`, hover `#a81f26`), quiet text button with no border.
- **Step ticked:** box border goes from `--on-blotter-2` to `--on-blotter`, check scales in.

## Accessibility

- The permit is an `article` with `tabindex="0"`, labelled by its `h2`, described by a visually hidden "Press Enter to stamp approved at the foot of the permit."
- Enter and Space on the permit stamp the default spot. The buttons do the same work as pointer clicks, so nothing needs a mouse.
- The stamp, ghost, paperclip, and slip are `aria-hidden`. Approval is announced by the live region and shown in the step list as text, not only as red ink.
- The step list is a `ul` with `aria-label="Progress"`; each step is plain text with a date.
- Fields are a `dl` of `dt`/`dd` pairs.
- Contrast: `--ink` on `--paper` 12:1; `--ink-2` labels on `--paper` 6.0:1; `--on-blotter-2` on `--blotter` 5.5:1; cream on the red button 5.5:1.
- Buttons are 42px tall.

## Responsive rules

- **≥ 1280:** two columns, 280px tray and 560px permit, 72px gap.
- **1024:** same; the grid fits in 912px.
- **≤ 980:** one column, permit first, tray below (`order: 2`), 40px gap, centred at 560px.
- **< 640:** body padding 40px 14px, doc padding 34px 22px 28px, title 30px, fields one column, foot one column (signature above date), stamp and ghost 190px wide, slip 170px, organisation name 9.5px with 0.14em tracking.
- The default stamp spot reads the date field's position, so it lands on the date in both layouts.

## Acceptance checklist

### Always

- [ ] The stamp is an SVG with a displacement filter for rough edges and a noise-alpha composite for pitting; nothing is a bitmap.
- [ ] A second blurred copy of the stamp sits under it as ink bleed.
- [ ] The stamp thumps from above with overshoot, and the paper dips once under it.
- [ ] Clicking the paper stamps at the click, clamped inside the paper, at a new angle; there is only ever one stamp.
- [ ] Keyboard can sign and stamp with no pointer.
- [ ] The signature draws via `pathLength="1"` and `stroke-dashoffset`.
- [ ] The stamp uses `multiply`, so text under it stays visible.
- [ ] A paperclip and a clipped slip sit over and behind the top-left edge.
- [ ] Printed text is the serif; filled-in text is the typewriter face.
- [ ] Reduced motion shows final states with no movement.

### This demo

- [ ] Blotter `#2e3a33`, paper `#f2ebd9`, stamp `#c0262d`, ballpoint `#1f3a8a`.
- [ ] Permit "Mooring Permit", ref "HP-12 / 0884", vessel "Saltwren", owner "Wilhelmina Strand".
- [ ] Stamp reads "APPROVED" over "PORT ELLERY · 04 OCT 2026", 230 × 92, double border.
- [ ] Default stamp angle −7°; click angles between −10° and +4°.
- [ ] Permit rotated −1.2°; slip rotated −6°.

## Implementation notes

**Ink filter.** Roughen, then pit:

```html
<filter id="ink" x="-8%" y="-15%" width="116%" height="130%">
  <feTurbulence type="turbulence" baseFrequency=".035" numOctaves="2" seed="3" result="warp"/>
  <feDisplacementMap in="SourceGraphic" in2="warp" scale="3.4" result="rough"/>
  <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" result="grain"/>
  <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.4 1.9" result="holes"/>
  <feComposite in="rough" in2="holes" operator="in"/>
</filter>
```

**Stamp at a point, with the angle kept through the keyframes.**

```css
.stamp { position: absolute; left: 0; top: 0; width: 230px; mix-blend-mode: multiply; opacity: 0;
  transform: translate(var(--x), var(--y)) rotate(var(--r)); }
.stamp.on { opacity: .9; animation: stampin 520ms var(--expo) both; }
@keyframes stampin {
  0%   { opacity: 0; transform: translate(var(--x), var(--y)) rotate(var(--r)) translateY(-26px) scale(1.55); }
  42%  { opacity: 1; transform: translate(var(--x), var(--y)) rotate(var(--r)) scale(.96); }
  70%  { transform: translate(var(--x), var(--y)) rotate(var(--r)) scale(1.015); }
  100% { opacity: .9; transform: translate(var(--x), var(--y)) rotate(var(--r)) scale(1); }
}
```

```js
function thump(x, y, r = (Math.random() * 14 - 10).toFixed(1)) {
  const w = stamp.offsetWidth, h = w * 92 / 230;
  x = Math.max(14, Math.min(doc.clientWidth - w - 14, x - w / 2));
  y = Math.max(14, Math.min(doc.clientHeight - h - 14, y - h / 2));
  stamp.style.setProperty('--x', x + 'px'); stamp.style.setProperty('--y', y + 'px'); stamp.style.setProperty('--r', r + 'deg');
  stamp.classList.remove('on'); void stamp.offsetWidth; stamp.classList.add('on');
}
```

Convert the click to paper coordinates with `(e.clientX - rect.left) * (doc.offsetWidth / rect.width)`. The permit is rotated 1.2°, which shifts the result by a pixel or two; that is fine.

Common mistakes:

- A stamp made from a red bordered `div` with `font-weight: 900`. With no filter it reads as a badge, not ink.
- Opacity 1 and normal blending. The typed date under the stamp must show through.
- Letting the stamp hang off the paper edge. Clamp it, and keep `overflow: hidden` on the paper.
- Naming the cursor outline and a button with the same class. Keep component class names unique.
- A signature in a script font. Draw a path, so it can animate like a pen.
- Using the serif for the typed values. The two faces tell printed from filled in.

Rebuild order:

1. Blotter, two-column desk, tray copy and steps.
2. The paper: padding, fold lines, vignette, fibre layer, tilt.
3. Header, title, fields, terms, foot with signature line and date.
4. Slip and paperclip.
5. Signature path and the Sign button.
6. Stamp SVG, ink filter, bleed copy, `thump()`, click and keyboard.
7. Ghost cursor, paper dip, live region, reset.
8. Reduced motion and the single-column layout.
