<!-- Design Lounge Nº 092 · "Architect index with plan drawings" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Architect index with plan drawings

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The home index of a fictional Kathmandu architect, N. Rimal. The first frame is a 120px condensed wordmark, an eight-row numbered list on a 12-column grid, and a sticky right-hand plate that always shows a geometric floor-plan drawing. Hovering or focusing a row crossfades the plan (320ms) and turns that row's index number vermilion. The page is paper-gray with one red. It is a drawing board, not a photography site: imagery is SVG linework only.

## Reference behaviour

1. Initial state: row 01 "Court House" is pressed (`aria-pressed="true"`, class `on`). Its plan is visible at full opacity. The caption reads `01 · Court House · Patan Durbar square edge`. Other rows are at full opacity until the list is dimmed.
2. Pointer enters any row: that row becomes active. Its number turns `--red`. Its project name translates 6px right over 320ms (`--expo`). All other rows drop to opacity 0.34. The matching SVG in `.stage` fades to 1; the previous fades to 0 over 320ms. Caption and `aria-live` region update.
3. Keyboard focus on a row (Tab) does the same as hover. ArrowDown / ArrowUp move the active row, call `preventDefault`, and move focus.
4. Clicking a row sets it pressed and keeps it active after the pointer leaves if that row still has focus. If the pointer leaves the list and focus is outside the list, dimming clears and row 01 is restored (hero state).
5. The plan plate stays 456px tall and sticky at `top: 64px`. It never follows the cursor.
6. A north arrow (1px stem, 4×6 triangle, "N") sits at the top-right of the plate. A 48px caption bar is locked to the bottom edge with `1 : 200` in red on the right.
7. Nav "Index" is the current page (1px red underline). Other links have no underline until hover, when text turns `--red`.

## Structure

```
1280 × 800  (12-col, 40px side pad, 16px gutters)
┌────────────────────────────────────────────────────────────────────────┐
│ N. RIMAL / PRACTICE │ KATHMANDU · 27.7172° N │ INDEX DRAWINGS OFFICE WRITE │ 48
├────────────────────────────────────────────────────────────────────────┤
│ N.RIMAL   (120px / 700, cols 1–8)   │ Rooms, courts and the air…       │
│ RIMAL in red                        │ INDEX 08 · CIVIC / CULTURE…      │ ~166
├─────────────────────────────────────┬──────────────────────────────────┤
│ NO PROJECT        TYPE     YR       │ ┌──────────────────────────────┐ │
│ 01 Court House    Civic    24  ←on  │ │  SVG plan (ink lines, 1 red  │ │
│ 02 Ridge Library  Culture  23       │ │  figure)  + N arrow          │ │ 456
│ 03 Grain Silo Hall Adaptive 22      │ │                              │ │
│ 04 Tea Pavilion   Garden   21       │ ├──────────────────────────────┤ │
│ 05 River Steps    Public   20       │ │ 01 · Court House…    1 : 200 │ │ 48
│ 06 Night Market   Market   19       │ └──────────────────────────────┘ │
│ 07 Hill Clinic    Health   18       │ cols 8–12, sticky               │
│ 08 Courtyard School School 17       │                                  │
│ cols 1–7, row 52                    │                                  │
└─────────────────────────────────────┴──────────────────────────────────┘
```

- `<nav class="g" aria-label="Primary">` — 48px, 12-col. Mark, coordinates, four uppercase links.
- `<header class="hero g">` — `h1` 120px spanning cols 1–8 (`N.` ink, `RIMAL` red). `.meta` cols 9–12: 15px sentence + 11px mono kicker.
- `<section class="board g" aria-label="Selected works">`
  - `.list` cols 1–7: `.thead` (28px) + eight `<button class="row">` (52px). Columns inside a row: 48px / 1fr / 110px / 48px.
  - `<aside class="plan" aria-live="polite">` cols 8–12: stacked SVGs, north arrow, caption.

## Tokens

```css
:root {
  --bg: #e6e2d8;          /* paper-gray page */
  --ink: #161412;         /* primary text + plan stroke */
  --ink-2: #6a655c;       /* secondary / coordinates */
  --ink-3: #9a9488;       /* thead */
  --line: #c8c2b4;        /* hairlines */
  --red: #c8102e;         /* wordmark, active number, scale, focus */

  --sans: "Schibsted Grotesk", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;

  --pad: 40px;
  --g: 16px;
  --nav: 48px;
  --row: 52px;
  --plan-h: 456px;

  --t: 180ms;
  --t-swap: 320ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Wordmark | Schibsted Grotesk | 120px | 700 | 0.78 | −0.055em | as written |
| Nav / thead / caption | IBM Plex Mono | 10–11px | 400–500 | 1 | +0.10–0.12em | UPPERCASE |
| Intro sentence | Schibsted Grotesk | 15px | 400 | 1.35 | 0 | sentence |
| Project name | Schibsted Grotesk | 20px | 500 | 1 | −0.02em | title |
| Row number | IBM Plex Mono | 12px | 500 | 1 | 0 | tabular |
| Type / year | IBM Plex Mono | 11px | 400 | 1 | +0.04em | sentence / 2-digit |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Notes |
|---------|---------|----------|-----------|---------:|--------|-------|
| `.stage svg` | row change | opacity | 0 ↔ 1 | 320ms | `--ease` | only one `.on` |
| `.row .nm` | hover / focus / on | translateX | 0 → 6px | 320ms | `--expo` | |
| Sibling rows | list dimmed | opacity | 1 → 0.34 | 180ms | `--ease` | via `.list.dim` |
| Nav current | — | underline | 1px `--red` | 0 | — | static |

Reduced motion: all `transition-duration` 1ms. Name offset removed (`transform: none`). Plan still swaps.

## States

- **Default row:** ink name, `--ink-2` number / type / year, 1px `--line` under.
- **Active / pressed:** number `--red`, 2px red inset bar on the left, name stays `--ink`, `aria-pressed="true"`.
- **Dimmed siblings:** opacity 0.34 while `.list.dim` is on.
- **Nav hover:** colour `--red`.
- **Nav current:** 1px red rule 4px under the label.
- **Focus-visible:** 2px `--red` outline, 3px offset, on every link and row button.
- **Plan plate:** 1px `--ink` border, fill `#efece4`. Active SVG opacity 1; others 0.

## Accessibility

- Rows are `<button>` with `aria-pressed`. Do not use `<div onclick>`.
- Plan caption lives in `aria-live="polite"` so a screen reader hears the new project.
- SVG drawings are `aria-hidden="true"`; the caption is the accessible name of the drawing.
- Tab order: mark → four nav links → eight rows. ArrowUp / ArrowDown cycle rows and move focus.
- Contrast: `--ink` on `--bg` > 12:1; `--ink-2` on `--bg` ≈ 5.4:1; `--red` on `--bg` ≈ 5.6:1.
- Hit targets: rows 52px tall, full width of cols 1–7. Nav links have implicit 48px row height.

## Responsive rules

- ≥ 1280: as specified. Wordmark 120px. Plan 456px sticky.
- 1024–1279: wordmark 88px; plan height 380px.
- 768–1023: wordmark 72px, still one line if possible; plan stays in cols 8–12 if width allows, otherwise stacks.
- < 768: wordmark and meta stack (meta `grid-column: 1 / -1`). List full width. Plan drops below the list, `position: relative`, height 320px. Hide the coordinates span in nav.

## Acceptance checklist

- [ ] Wordmark is exactly 120px / 700 Schibsted Grotesk at 1280, with `RIMAL` in `#C8102E`.
- [ ] Page uses a 12-column grid, 40px side padding, 16px gutters.
- [ ] Eight rows, 52px tall, columns 48 / 1fr / 110 / 48.
- [ ] Plan plate is cols 8–12, 456px tall, 1px ink border, sticky at 64px.
- [ ] Hover, focus, click, ArrowUp and ArrowDown all change the active plan.
- [ ] Plan swap is a 320ms opacity crossfade, not a cursor-following card.
- [ ] Inactive rows dim to 0.34 while the list is hovered or a row is focused.
- [ ] Caption updates and is announced via `aria-live`.
- [ ] Each plan has one red figure (`stroke-width: 2.2`) and ink walls at 1.4.
- [ ] Focus rings are 2px `#C8102E` on every interactive control.
- [ ] `prefers-reduced-motion: reduce` makes swaps instant and removes the 6px name shift.
- [ ] No photographs, no emoji, no placeholder copy, no real practices.

## Implementation notes

**Keep the plan on the right, not under the pointer.** The other common index pattern floats a plate at the cursor. This piece is a drawing: the plate is a column.

```css
.plan { grid-column: 8 / 13; position: sticky; top: 64px; height: 456px; }
.stage svg { position: absolute; opacity: 0; transition: opacity 320ms var(--ease); }
.stage svg.on { opacity: 1; }
```

**Dim the list only while it is in use**, then restore the hero row so the screenshot state returns:

```js
function set(i) {
  rows.forEach((r, n) => {
    r.classList.toggle('on', n === i);
    r.setAttribute('aria-pressed', String(n === i));
  });
  svgs.forEach((s, n) => s.classList.toggle('on', n === i));
  cap.textContent = caps[i];
  list.classList.add('dim');
}
list.addEventListener('pointerleave', () => {
  if (!list.contains(document.activeElement)) { list.classList.remove('dim'); set(0); }
});
```

**Plans are line drawings.** Use `fill: none`, square caps, one `.hl` path in `--red`. Do not fill rooms with colour blocks. Eight short SVGs in a shared `viewBox="0 0 200 160"` keep the file under 20 KB.

Common mistakes: following the cursor with the plan; using a serif wordmark; setting the wordmark below 100px; hiding inactive SVGs with `display: none` (kills the crossfade); putting the year in four digits (the index uses two).

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
