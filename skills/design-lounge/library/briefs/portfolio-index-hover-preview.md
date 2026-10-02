<!-- Design Lounge Nº 139 · "Portfolio index with hover preview" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Portfolio index with hover preview

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The home page of a fictional Lisbon art director, Ines Varga. The whole site is an index: a giant serif "Index" headline, a one-sentence pitch, discipline filters, and a hairline table of twelve projects (number, project, client, discipline, year). Hovering a row dims every other row to 32% and floats a 300×380 "plate" (a CSS-gradient composition standing in for the project's key image) that chases the cursor with a lerp and tilts with its velocity. The detail worth copying is the lag: the plate eases toward the pointer at 11% of the remaining distance per frame and rotates up to ±6° in the direction of travel, so it feels like a print being slid across a table.

## Reference behaviour

1. Initial state: row 03 "Lumen No. 4" is active (hero state), its plate visible at ~62% of the row width, vertically centred on the row (clamped to at least 266px from the top). Other rows are at 32% opacity.
2. Move the pointer onto any row: that row becomes active (full opacity, project name slides 14px right over 420ms, number turns vermilion). All other rows drop to opacity .32 over 160ms.
3. The plate targets `pointerX + 165px, pointerY`, clamped so it never leaves the viewport (16px margin; top clamp 76px below the sticky header). Each animation frame moves `x += (tx − x) × 0.11`, same for y. Rotation is `clamp((tx − x) × 0.04, −6°, 6°)`. The rAF loop stops itself when the remaining distance is under 0.4px.
4. When the active row changes, the new plate reveals over the old one with a bottom-up clip-path wipe (`inset(100% 0 0 0)` → `inset(0)`, 420ms expo-out). Plates are stacked; the active one has `z-index:2`.
5. Leaving the list: plate fades to 0 over 240ms and scales to .92; all rows return to full opacity.
6. Keyboard focus on a row (Tab) activates it the same way and parks the plate at 68% of the row width, centred on the row.
7. Filter pills (All 12 / Identity 3 / Editorial 4 / Packaging 3 / Motion 2): click sets `aria-pressed` and hides non-matching rows (`display:none`).
8. Header clock shows Lisbon time (UTC+1 in October) as `LIS HH:MM`, refreshed every 30s.
9. The page scrolls: after row 12 comes a footer with an 88px serif sign-off "Have a slow thing to make? Write." (the last word underlined 3px vermilion) and contact meta. Scrolling while not hovering hides the plate.

## Structure

```
1280 × 800  (12-col grid, 40px side padding, 20px gutters)
┌────────────────────────────────────────────────────────────────────────┐
│ Ines Varga │ • Art direction & identity · Lisbon │ LIS 21:12 │ Index Info Journal Contact │ 60 sticky
├────────────────────────────────────────────────────────────────────────┤
│                                        │ Identities, books and packaging  │
│  Index⁽¹²⁾   (172px Gloock, cols 1–7)  │ for people… (22px serif, 30ch)   │
│                                        │ [All¹²][Identity³][Editorial⁴]…  │
├─NO.──PROJECT──────────────────────CLIENT──────────DISCIPLINE─────YEAR──┤ 34, 1px ink rule
│ 01   Salt & Ledger                Ferro Ceramics   Identity      2026  │ 50
│ 03     Lumen No. 4  ┌──────────┐  Oficina Lumen    Packaging     2025  │ ← active
│ 04   Rio Abaixo     │  plate   │  …                                    │
│ …                   │ 300×380  │                                       │
│                     └──────────┘                                       │
├────────────────────────────────────────────────────────────────────────┤
│ Have a slow thing to make? Write.  (88px)         │ email · address    │ footer
└────────────────────────────────────────────────────────────────────────┘
columns: No. 1/2 · Project 2/7 · Client 7/10 · Discipline 10/12 · Year 12/13 (right-aligned)
```

- `<header>` sticky, 12-column grid: `.name` (link), `.role` with a 7px green availability dot, `#clock`, `<nav aria-label="Primary">` with `aria-current="page"` on Index.
- `<main>` → `<section class="hero">` with `<h1>Index<sup>(12)</sup></h1>` and `.intro` (pitch `<p>` + `.filters` `role="group"`).
- `.thead` (aria-hidden column labels) then `<ol id="list" aria-label="Projects">`; each `<li>` holds one `<a class="row" data-a="N">` with five spans.
- `<footer>` sign-off and meta.
- `.pv` fixed-position preview, `aria-hidden="true"`, `pointer-events:none`, containing `.pv-in` (shadow + scale) and twelve stacked `.art` plates.

## Tokens

```css
:root {
  /* colour: bone paper, near-black ink, one vermilion accent */
  --bg: #ece9e2;        /* page */
  --ink: #141414;       /* text, active row, header rule */
  --ink-2: #5b574f;     /* client, discipline, meta (6.2:1 on bg) */
  --ink-3: #8a857b;     /* column labels only */
  --line: #cdc8bd;      /* row hairlines, pill borders */
  --accent: #d9411e;    /* active number, count sup, footer underline, focus */
  --ok: #3d9a5b;        /* availability dot */

  /* type */
  --serif: "Gloock", Georgia, serif;
  --mono: "DM Mono", ui-monospace, monospace;

  /* layout */
  --pad: 40px;
  --row-h: 50px;
  --pv-w: 300px;
  --pv-h: 380px;
  --pv-shadow: 0 30px 60px -20px rgba(20, 20, 20, .35);

  /* motion */
  --t-micro: 160ms;
  --t-swap: 420ms;
  --t-fade: 240ms;
  --lerp: .11;
  --tilt-max: 6deg;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role             | Family  | Size  | Weight | Line-height | Tracking | Case      |
|------------------|---------|------:|-------:|------------:|---------:|-----------|
| Display "Index"  | Gloock  | 172px | 400    | .82         | −0.045em | Title     |
| Count sup        | DM Mono | 15px  | 400    | 1           | 0        | (12)      |
| Pitch            | Gloock  | 22px  | 400    | 1.28        | −0.005em | sentence  |
| Project name     | Gloock  | 26px  | 400    | 1           | −0.015em | Title     |
| Body / cells     | DM Mono | 13px  | 400    | 1.5         | 0        | sentence  |
| Column labels    | DM Mono | 11px  | 400    | 1           | +0.1em   | UPPERCASE |
| Brand            | Gloock  | 20px  | 400    | 1           | −0.01em  | Title     |
| Plate caption    | DM Mono | 10px  | 400    | 1.5         | +0.08em  | UPPERCASE |
| Plate glyph      | Gloock  | 140px (92px for long words) | 400 | .8 | −0.05em | as set |
| Footer sign-off  | Gloock  | 88px  | 400    | .9          | −0.035em | sentence  |

## Motion

| Element            | Trigger             | Property             | From → To                     | Duration | Easing       |
|--------------------|---------------------|----------------------|-------------------------------|---------:|--------------|
| `.pv` position     | pointermove         | translate3d          | lerp 0.11 / frame             | until < .4px | —        |
| `.pv` tilt         | pointermove         | rotate               | `(tx−x)·0.04`, clamp ±6°      | per frame | —           |
| `.pv` visibility   | enter / leave list  | opacity              | 0 ↔ 1                         | 240ms    | `--ease`     |
| `.pv-in`           | enter / leave list  | scale                | .92 ↔ 1                       | 420ms    | `--ease-out` |
| `.art` swap        | active row change   | clip-path            | `inset(100% 0 0 0)` → `inset(0)` | 420ms | `--ease-out` |
| other rows         | hover any row       | opacity              | 1 → .32                       | 160ms    | `--ease`     |
| active name        | hover row           | translateX           | 0 → 14px                      | 420ms    | `--ease-out` |
| filter pill        | hover / press       | background, colour   | —                             | 160ms    | `--ease`     |

Reduced motion: lerp factor becomes 1 (plate snaps to the target, no tilt), every transition is 1ms. The plate still appears and swaps.

## States

- **Row hover / active:** `.on` class; opacity 1, number `--accent`, name +14px. List gets `.hovering` so siblings dim.
- **Row focus-visible:** 2px `--accent` outline, offset −2px (inside the row).
- **Filter pill:** rest 1px `--line` border, `--ink-2` text; hover border and text `--ink`; pressed `--ink` fill with `--bg` text.
- **Nav link:** current and hover show a 1px underline 2px above the baseline.
- **Filtered-out rows:** `display:none`; the table closes up, no animation.
- **Plate hidden:** opacity 0, scale .92; it keeps its last position so the next reveal starts from there.

## Accessibility

- Rows are real links inside an `<ol>`; the column header row is `aria-hidden` because each row reads naturally ("03 Lumen No. 4 Oficina Lumen Packaging 2025").
- The preview is decorative: `aria-hidden="true"`, `pointer-events:none`. Never put essential info only in the plate.
- Filters are `<button aria-pressed>` inside `role="group" aria-label="Filter by discipline"`.
- Tab order: brand, nav, filters, rows, footer link. Focus activates the preview so keyboard users get the same moment.
- `--ink-2` on `--bg` is 6.2:1; `--ink-3` (3.4:1) is used only for 11px column labels that are duplicated by row content.
- Dimmed rows at .32 opacity are a hover-only state; at rest everything meets 4.5:1.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: display drops to 140px; pitch 20px; preview 260×330.
- 768–1023: hide the Discipline column (Client spans 7/12); hero stacks (headline full width, intro below); preview 220×280.
- < 640 or `(hover: none)`: no floating preview. Each row expands on tap to show its plate inline at 100% width × 4:5 above the row text; the name drops to 22px and client/year sit on a second line.

## Acceptance checklist

- [ ] Display "Index" is 172px Gloock with line-height .82 and a vermilion mono "(12)" superscript.
- [ ] Rows are exactly 50px tall with 1px `#cdc8bd` hairlines; the header row has a 1px ink rule.
- [ ] Hovering a row dims all others to opacity .32 within 160ms.
- [ ] The plate trails the pointer with visible lag (lerp 0.11) and tilts no more than 6°.
- [ ] The rAF loop stops when the plate settles (no loop running while the pointer is still).
- [ ] The plate never leaves the viewport and never sits under the 60px sticky header.
- [ ] Switching rows wipes the new plate up from the bottom over 420ms.
- [ ] On first paint, row 03 is active and its plate is visible.
- [ ] Tabbing to a row shows its plate; leaving the list via Tab hides it.
- [ ] Filter pills toggle `aria-pressed` and hide non-matching rows.
- [ ] Reduced motion: no lag, no tilt, still fully functional.
- [ ] No raster images: every plate is CSS gradients plus type.

## Implementation notes

**Lerp loop that sleeps.** Only run rAF while there is distance to cover; restart it on pointermove.

```js
let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
function tick() {
  x += (tx - x) * 0.11; y += (ty - y) * 0.11;
  const tilt = Math.max(-6, Math.min(6, (tx - x) * 0.04));
  pv.style.transform = `translate3d(${x - 150}px, ${y - 190}px, 0) rotate(${tilt}deg)`;
  raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.4 ? requestAnimationFrame(tick) : 0;
}
list.addEventListener('pointermove', (e) => {
  tx = Math.min(innerWidth - 166, e.clientX + 165);
  ty = Math.min(innerHeight - 206, Math.max(266, e.clientY));
  if (!raf) raf = requestAnimationFrame(tick);
});
```

**Stacked plates with a clip wipe.** Keep all plates mounted so the swap is a pure CSS transition; the previous plate stays visible underneath until the new one covers it.

```css
.art { position: absolute; inset: 0; clip-path: inset(100% 0 0 0);
       transition: clip-path 420ms cubic-bezier(.16, 1, .3, 1); }
.art.on { clip-path: inset(0); z-index: 2; }
```

**Art-directed plates from gradients.** Each plate is one composition, not a random gradient. Example (sun over horizon line):

```css
.a1 { background:
  radial-gradient(circle at 50% 66%, #c2522d 0 31%, transparent 31.5%),
  linear-gradient(#e7dfcf 0 66%, #1a1a1a 66% 66.6%, #e7dfcf 66.6%); }
```

Common mistakes: positioning the plate with `left/top` (layout thrash; use transform), listening to `mousemove` on `window` so the plate follows into the footer, and forgetting `pointer-events:none` on the plate so it steals the hover from the row beneath it.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
