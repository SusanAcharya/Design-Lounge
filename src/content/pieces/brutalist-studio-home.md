---
title: "Brutalist studio home"
summary: "Black-on-white studio homepage: 1px column grid, 96px uppercase Archivo Black statement, project rows that invert on hover and a 36-second marquee footer."
platform: web
type: screen
category: portfolio
tags: [homepage, studio, portfolio, list, marquee]
styles: [brutalist, swiss]
motion: subtle
difficulty: 1
featured: false
published: 2026-09-29
palette: ["#FFFFFF", "#000000", "#555555"]
fonts: ["Archivo Black", "Archivo"]
related: []
---

# Brutalist studio home

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The homepage of *Halden*, a six-person design studio. Pure `#000` on pure `#fff` (this piece is about that contrast, so no off-whites). Four 320px columns are drawn as 1px vertical hairlines at 18% opacity across the whole page. A 48px header bar, a three-line 96px Archivo Black statement with the last line outlined, a six-row project list where each row inverts to solid black on hover or focus, and a black marquee footer that scrolls at a calm 36-second period. There are no shadows, no radii, no colour. The detail worth copying is the row inversion: the whole row flips instantly and an arrow slides in from the left, which is all the feedback the page needs.

## Reference behaviour

1. Initial state: header shows studio name, location, a live clock (HH:MM:SS CEST, ticking each second) and four nav links. The statement reads "DESIGN FOR / THINGS THAT / HAVE TO WORK." with the third line as a 2px outlined stroke. Row 01 ("Nord Post wayfinding") is pre-selected (`aria-current="true"`) so the first frame already shows one inverted row.
2. Hover a nav link: 2px underline, 4px offset. No colour change.
3. Hover any project row: background becomes `#000`, all text becomes `#fff` (including the grey client/year columns), and the "Open" arrow moves from `translateX(-8px)`/opacity 0 to rest/opacity 1 in 100ms. Leaving the row reverses instantly.
4. Keyboard-focus a row: same as hover, plus a 3px inset black outline.
5. Click a row: it becomes the selected row (`aria-current="true"`), stays inverted after the pointer leaves, and gains an 8px black square before its number. The previously selected row returns to white. Navigation is prevented in the demo.
6. The footer marquee scrolls left continuously; the content is duplicated once so the loop has no visible join at `translateX(-50%)`. Hovering the footer pauses it.
7. The clock updates every 1000ms with tabular numerals so the header never shifts.
8. With `prefers-reduced-motion: reduce` the marquee is static (first copy visible) and the arrow appears without transition.

## Structure

```
1280 × 800   (vertical hairlines at x = 0, 320, 640, 960 — 1px, 18 % opacity)
┌────────────────┬────────────────┬────────────────┬────────────────┐
│ HALDEN         │ OSLO/ROTTERDAM │ 14:32:07 CEST  │   WORK STUDIO JOURNAL CONTACT │ 48
├────────────────┴────────────────┴────────────────┼────────────────┤
│ DESIGN FOR                                        │ ■ AVAILABLE  Q1 2027 │
│ THINGS THAT                        96px / 0.9     │ Halden is a six-   │ ~300
│ HAVE TO WORK.  (outlined)                         │ person studio ...  │
│                                                   │ EST. 2014   44 PROJECTS │
├───────┬──────────────────────────┬───────────┬────┴────┬──────────┤
│ ■ 01  │ NORD POST WAYFINDING     │ NORD POST │ 2026    │ OPEN →   │ 56  (inverted: selected)
│   02  │ FJORD BANK APP           │ FJORD BANK│ 2026    │          │ 56
│   03  │ TESSEL GRID IDENTITY     │ TESSEL EN.│ 2025    │          │ 56
│   04  │ LOAM SEED CATALOGUE      │ LOAM      │ 2025    │          │ 56
│   05  │ FERRY TIMETABLE SYSTEM   │ KYSTLINJE │ 2024    │          │ 56
│   06  │ MARROW QUARTERLY         │ MARROW PR.│ 2024    │          │ 56
├───────┴──────────────────────────┴───────────┴─────────┴──────────┤
│ AVAILABLE Q1 2027 ■ IDENTITY ■ INTERFACE ■ SIGNAGE ■ ...  (marquee, black) │ 52
└───────────────────────────────────────────────────────────────────┘
```

- `body::before` — absolutely positioned, `repeating-linear-gradient(to right, #000 0 1px, transparent 1px 320px)`, `opacity: .18`, `pointer-events: none`.
- `<header>` — 4-column grid, 48px, `border-bottom: 1px solid #000`. Cells: `<a class="name">`, `<span class="loc">`, `<span class="clock">`, `<nav aria-label="Primary">`.
- `<section class="hero">` — grid `3fr 1fr`. Left `<h1>` with three `<span>` lines; right `.intro` column with 1px left border holding two `.tag` rows and a paragraph.
- `<section class="work" aria-label="Selected work">` — `<ol>` of `<li><a>` rows. Each row is a grid `320px 2fr 1fr 1fr 160px`: number, title, client, year, "Open" + arrow.
- `<footer aria-label="Ticker">` — black, 52px, `overflow: hidden`, containing `.track` with two identical runs of seven `<span>`s.

## Tokens

```css
:root {
  /* colour — pure black and white by design */
  --bg:    #ffffff;   /* page, inverted-row text */
  --ink:   #000000;   /* text, rules, grid lines, inverted-row fill, marquee */
  --ink-2: #555555;   /* client and year columns at rest (7.5:1 on white) */
  --line:  #000000;   /* every hairline is full black; the grid is faded via opacity .18 */

  /* type */
  --display: "Archivo Black", Impact, sans-serif;
  --sans:    "Archivo", Helvetica, Arial, sans-serif;
  --display-size: 96px;    /* 80 ≤1100, 64 ≤820 */

  /* layout */
  --col: 320px;            /* grid column; 25% ≤1100 */
  --bar-h: 48px;
  --row-h: 56px;
  --marquee-h: 52px;
  --cell-pad: 16px;
  --radius: 0;

  /* motion */
  --t-micro: 100ms;        /* arrow slide only */
  --t-marquee: 36s;        /* one full loop of the doubled track */
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role             | Family        | Size  | Weight | Line-height | Tracking | Case      |
|------------------|---------------|------:|-------:|------------:|---------:|-----------|
| Statement        | Archivo Black | 96px  | 400    | 0.9         | −0.02em, word-spacing −0.05em | UPPERCASE |
| Statement line 3 | Archivo Black | 96px  | 400    | 0.9         | same     | UPPERCASE, `-webkit-text-stroke: 2px #000; color: transparent` |
| Studio name      | Archivo Black | 16px  | 400    | 1           | +0.04em  | UPPERCASE |
| Header cells     | Archivo       | 12px  | 500    | 1           | +0.08em  | UPPERCASE |
| Row title        | Archivo Black | 22px  | 400    | 1           | 0        | UPPERCASE |
| Row number       | Archivo       | 12px  | 400    | 1           | +0.10em  | tabular numerals |
| Row client/year  | Archivo       | 12px  | 400    | 1           | +0.10em  | UPPERCASE, `--ink-2` |
| Row "Open"       | Archivo       | 12px  | 400    | 1           | +0.10em  | UPPERCASE |
| Intro paragraph  | Archivo       | 14px  | 400    | 1.45        | 0        | sentence, max 26ch |
| Intro tags       | Archivo       | 11px  | 400 (label 500) | 1  | +0.12em  | UPPERCASE |
| Marquee          | Archivo Black | 20px  | 400    | 1           | +0.02em  | UPPERCASE |

## Motion

| Element        | Trigger        | Property             | From → To                 | Duration | Easing  | Notes |
|----------------|----------------|----------------------|---------------------------|---------:|---------|-------|
| `.work a`      | hover / focus / selected | background, color | `#fff`/`#000` → `#000`/`#fff` | 0ms | — | deliberately instant |
| `.go svg`      | hover / focus / selected | transform, opacity | `translateX(-8px)`, 0 → `0`, 1 | 100ms | `--ease` | the only eased thing on the page |
| `.track`       | always         | transform            | `0` → `translateX(-50%)`  | 36s      | linear  | linear is correct for a ticker |
| `.track`       | footer hover   | animation-play-state | running → paused          | —        | —       | |
| `#clock`       | every 1000ms   | textContent          | —                         | —        | —       | `setInterval`, tabular nums |

Reduced motion: `.track { animation: none }` (the first run of items stays visible), transitions 1ms.

## States

- **Row rest:** white, number and title black, client/year `#555`, arrow hidden.
- **Row hover / focus-visible:** background `#000`, every child `#fff`, arrow visible at rest position. Focus adds `outline: 3px solid #000; outline-offset: -3px` (visible against the white neighbours).
- **Row selected (`aria-current="true"`):** identical to hover but persistent; an 8px × 8px black square precedes the number (`currentColor`, so it is white on the inverted row).
- **Nav link hover:** `text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 4px`.
- **Footer hover:** marquee paused.
- **No disabled, loading or empty states** — the list is static content.

## Accessibility

- Each project row is one `<a>` wrapping all five cells, so the accessible name is the concatenation "01 Nord Post wayfinding Nord Post 2026 Open". If that is too long for your screen-reader users, add `aria-label="Nord Post wayfinding, 2026"` to the link.
- Selection uses `aria-current="true"` on the link; only one row carries it at a time.
- The marquee `.track` is `aria-hidden="true"` (its content duplicates the header's contact info) and the `<footer>` has `aria-label="Ticker"`. Pausing on hover satisfies WCAG 2.2.2 for pointer users; add a visible pause button if the marquee will carry unique information.
- Keyboard: Tab order is name → nav links → six rows. Enter on a row selects it. No custom key handling.
- The clock has `aria-label="Studio time"`; it is not a live region (a per-second announcement would be hostile).
- Contrast: black on white 21:1; `#555` on white 7.5:1; white on black rows 21:1. The 18% grid lines are decorative and exempt.
- Focus outline is 3px black, inset, so it does not get clipped by `overflow: hidden` on cells.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: `--display-size: 80px`; grid column becomes `25%` so the four hairlines still align with the header cells.
- 768–1023: `--display-size: 64px`; hero stacks (intro moves below the statement with a 1px top border); rows collapse to `64px 1fr 100px` (number, title, year); client and "Open" columns hidden; header shows only name and nav.
- < 640: `--display-size: 48px`; row title 16px; marquee 16px; grid lines reduced to two columns (`--col: 50%`).
- Height < 760: allow `.work` to scroll internally (`overflow: auto`) rather than pushing the marquee off-screen.

## Acceptance checklist

- [ ] Background is exactly `#ffffff` and text exactly `#000000`; no other hue anywhere except `#555555` on the client/year cells.
- [ ] Four vertical 1px hairlines at x = 0, 320, 640, 960 run the full page height at 18% opacity.
- [ ] Header is 48px, four equal columns, 1px black bottom rule; clock ticks every second with tabular numerals.
- [ ] Statement is Archivo Black 96px, line-height 0.9, uppercase; third line is a 2px outline with transparent fill.
- [ ] Six project rows, each 56px with a 1px bottom rule; columns `320px 2fr 1fr 1fr 160px`.
- [ ] Hovering a row inverts it instantly (no transition on background/colour) and slides the arrow in over 100ms.
- [ ] Row 01 is selected on load and stays inverted; clicking another row moves the selection.
- [ ] Selected row shows an 8px square before its number.
- [ ] Marquee is 52px, black, loops without a visible join using a doubled track and `translateX(-50%)` over 36s linear.
- [ ] Marquee pauses on hover and is static under reduced motion.
- [ ] Focus is visible on every link (3px inset outline on rows, default outline on nav).
- [ ] No border-radius, no box-shadow, no gradient other than the grid lines.

## Implementation notes

**Column grid as a background, not DOM.** One pseudo-element covers the page; align it so the first line sits on x = 0 rather than x = −1:

```css
body { position: relative; }
body::before { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .18;
  background: repeating-linear-gradient(to right, var(--line) 0 1px, transparent 1px var(--col)); }
header, .hero, .work, footer { position: relative; z-index: 1; }  /* content sits above the grid */
```

**Marquee with no visible join.** Duplicate the run exactly once and translate by half the track width; the track must be `flex: none` so it is as wide as its content:

```css
footer { overflow: hidden; display: flex; align-items: center; }
.track { display: flex; flex: none; animation: slide var(--t-marquee) linear infinite; }
footer:hover .track { animation-play-state: paused; }
@keyframes slide { to { transform: translateX(-50%); } }
```

If the two runs are not byte-identical (including the trailing separator square), the loop will visibly jump.

**Single-select rows.** Keep selection on `aria-current` so styling and state share one source:

```js
rows.addEventListener('click', (e) => {
  const a = e.target.closest('a'); if (!a) return; e.preventDefault();
  rows.querySelectorAll('a[aria-current]').forEach(x => x.removeAttribute('aria-current'));
  a.setAttribute('aria-current', 'true');
});
```

Common mistakes: easing the row inversion (it should snap); using `#111` or `#fafafa` "for softness"; forgetting to recolour the grey client/year cells on inversion, leaving grey-on-black at 3.6:1; letting the marquee `<span>`s wrap (`flex: none; white-space: nowrap`).
