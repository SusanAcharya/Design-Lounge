<!-- Design Lounge Nº 081 · "Hover image trail" · designlounge.vercel.app -->

# Hover image trail

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A studio portfolio's "Selected work" page on off-white paper: six full-width project rows set in 44px Instrument Serif with a number, a category, a year and an arrow. Moving the pointer across a row leaves a trail of small "images" (180×124px cards, each a CSS gradient standing in for a photo, with a tiny caption) that pop in under the cursor, drift 24px upward and fade out over 720ms. A new card is spawned every 48px of pointer travel and at most six exist at once, so the effect stays light. Keyboard focus and reduced-motion users get one static thumbnail pinned to the row's right edge instead. The detail worth copying is the spawn rule: distance-based, not time-based, so fast sweeps and slow drags both look right.

## Reference behaviour

1. Initial state: header (brand "Tessel *Studio*", 4 nav links), `<h1>` "Selected work *2021–2026*", six rows separated by 1px hairlines filling the remaining height, a 48px footer line. No trail cards.
2. Pointer enters a row: the row's text and arrow turn `--accent` (#2f4bd8) over 160ms; the arrow slides 4px right.
3. Pointer moves within a row: each time the pointer has travelled ≥ 48px (Euclidean) since the last spawn, a `.img` card is appended to a fixed, `pointer-events: none` layer at the pointer position (centred with `translate(-50%,-50%)`). It uses the row's gradient (`--g`) and caption (`data-cap`, e.g. "Fjord Bank · 01"), and a small alternating rotation of −3°, 0°, +3°.
4. The card animates in: opacity 0 → 1, scale .6 → 1 over 260ms expo-out; then out: opacity 1 → 0, moves 24px up, scale 1 → .94 over 720ms, starting at 260ms. On `animationend` of the "gone" animation it removes itself.
5. If a seventh card would exist, the oldest is removed immediately.
6. Pointer leaves the list: the distance anchor resets so the next entry spawns at once; existing cards finish their fade.
7. Tab to a row: 2px `--accent` inset outline, text turns `--accent`, and a static 140×96px `.thumb` with the same gradient fades in at `right: 56px`, vertically centred.
8. With `prefers-reduced-motion: reduce`, `<body>` gets `.static`: no pointer listeners, `.img` is `display: none`, and hovering a row shows the same static `.thumb` as focus.
9. Clicking a row is prevented in the demo (it is a link to `#`); in production it navigates to the project.

## Structure

```
1280 × 800
┌─────────────────────────────────────────────────────────────────────────┐
│ header 76   Tessel Studio                    Work  Studio  Journal  Contact │
│                                                                          │
│ h1 40px  Selected work 2021–2026                                         │
│ ──────────────────────────────────────────────────────────────────────── │
│ 01  Fjord Bank rebrand            Identity, signage, motion   2026   ↗   │ ← each row ≈ 96px
│ ──────────────────────────────────────────────────────────────────────── │
│ 02  Halden ferry wayfinding       Environmental, pictograms   2025   ↗   │
│ ──────────────────────────────────────────────────────────────────────── │
│ 03  Marrow editions   [img][img]  Book series, 14 volumes     2025   ↗   │ ← trail cards float over
│ ──────────────────────────────────────────────────────────────────────── │
│ 04  Orbital annual report         Print, 96 pages, data       2024   ↗   │
│ 05  Loam packaging                Range of 18 SKUs            2023   ↗   │
│ 06  Nord Post fleet livery        Vehicles, uniforms          2021   ↗   │
│ foot 48   Move across a row to preview it · 6 of 41   Tessel Studio, Gothenburg │
└─────────────────────────────────────────────────────────────────────────┘
row grid: 48px | 1fr | 220px | 120px | 40px, gap 24px, 64px page gutters
```

- `.wrap` — flex column, `padding: 0 64px`, full height, `overflow: hidden` on body.
- `<header>` — `.brand` (Instrument Serif 22px, italic word in `--accent`) + `<nav aria-label="Primary">`.
- `<h1>` — 40px serif; the date range in `<em>` (italic, `--ink-2`).
- `<ul class="list">` — `border-top` hairline, `flex: 1`; each `<li>` holds `<a class="row" style="--g: var(--gN)" data-cap="…">` with spans `.n` (number), `.t` (title, italic tail in `<i>`), `.m` (meta), `.y` (year), an inline 22px SVG arrow `.a`, and an empty `.thumb` span (`aria-hidden`).
- `.foot` — 12px helper line.
- `<div class="trail" aria-hidden="true">` — `position: fixed; inset: 0; pointer-events: none; z-index: 5`; JS appends `.img` divs here.

## Tokens

```css
:root {
  /* colour — off-white paper, near-black ink, one cobalt accent */
  --bg: #f6f4ef;       /* page */
  --ink: #17161a;      /* titles */
  --ink-2: #6f6c66;    /* meta, nav */
  --ink-3: #a5a199;    /* numbers, years, footer, arrow */
  --line: #dedad1;     /* hairlines */
  --accent: #2f4bd8;   /* hover/focus colour, brand italic */

  /* type */
  --serif: "Instrument Serif", Georgia, serif;
  --sans: "Hanken Grotesk", system-ui, sans-serif;

  /* trail cards */
  --card-w: 180px;
  --card-h: 124px;
  --r: 4px;
  --shadow: 0 12px 32px rgba(23, 22, 26, .18);
  --step: 48px;        /* pointer travel between spawns (JS constant) */
  --max-alive: 6;      /* JS constant */

  /* stand-in "photos": one gradient per project */
  --g1: linear-gradient(135deg, #d9c7b2, #8f6b4d 60%, #3d2a1e);
  --g2: linear-gradient(160deg, #c9d6e2, #5b7a94 55%, #1f2f3f);
  --g3: linear-gradient(120deg, #e6dcc3, #b7a26a 50%, #5a4a22);
  --g4: linear-gradient(150deg, #e2c9cf, #a86b7c 55%, #3f1f2b);
  --g5: linear-gradient(140deg, #cfd9cd, #6e8a6a 55%, #24331f);
  --g6: linear-gradient(130deg, #d6d6d8, #7d7f8a 55%, #26272e);

  /* layout */
  --gutter: 64px;
  --header-h: 76px;
  --foot-h: 48px;

  /* motion */
  --t-micro: 160ms;    /* colour, arrow nudge, thumb */
  --t-in: 260ms;       /* card pop */
  --t-out: 720ms;      /* card fade, starts after --t-in */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role         | Family           | Size | Weight | Line-height | Tracking | Case / style |
|--------------|------------------|-----:|-------:|------------:|---------:|--------------|
| Row title    | Instrument Serif | 44px | 400    | 1           | −0.02em  | sentence, tail word italic |
| Page title   | Instrument Serif | 40px | 400    | 1.05        | −0.015em | sentence, range italic `--ink-2` |
| Brand        | Instrument Serif | 22px | 400    | 1           | −0.01em  | "Studio" italic in `--accent` |
| Row meta     | Hanken Grotesk   | 14px | 400    | 1.5         | 0        | sentence, `--ink-2` |
| Row number / year | Hanken Grotesk | 13px / 14px | 400 | 1     | 0        | tabular numerals, `--ink-3` |
| Nav          | Hanken Grotesk   | 14px | 500    | 1.5         | 0        | sentence |
| Card caption | Hanken Grotesk   | 10px | 500    | 1           | +0.08em  | UPPERCASE, `rgba(255,255,255,.85)` |
| Footer       | Hanken Grotesk   | 12px | 400    | 1.5         | 0        | sentence, `--ink-3` |

## Motion

| Element      | Trigger                  | Property            | From → To                                   | Duration | Easing       | Delay |
|--------------|--------------------------|---------------------|---------------------------------------------|---------:|--------------|------:|
| `.img` (pop) | spawn                    | opacity, transform  | 0, scale(.6) → 1, scale(1)                  | 260ms    | `--ease-out` | 0 |
| `.img` (gone)| after pop                | opacity, transform  | 1, y 0 → 0, y −24px, scale(.94)             | 720ms    | `--ease`     | 260ms |
| `.row`       | hover / focus            | color               | `--ink` → `--accent`                        | 160ms    | `--ease`     | 0 |
| `.a` arrow   | hover / focus            | transform, color    | 0 → translateX(4px); `--ink-3` → `--accent` | 160ms    | `--ease`     | 0 |
| `.thumb`     | focus-visible (or hover in `.static`) | opacity, transform | 0, scale(.9) → 1, scale(1)     | 160ms    | `--ease`     | 0 |

Card rotation: `--rot` cycles −3°, 0°, +3° per spawn and is baked into both keyframes so it does not reset mid-animation. Total card life: 980ms. Spawn is distance-based (48px), so no timers exist.

Reduced motion: `.img { animation: none; display: none }`; JS returns early after adding `.static`; the arrow has no transition; the static `.thumb` still fades over 160ms (opacity only).

## States

- **Rest row:** title `--ink`, meta `--ink-2`, number/year/arrow `--ink-3`.
- **Hover row:** title, meta and arrow `--accent`; arrow +4px; trail spawns on movement.
- **Focus-visible row:** `outline: 2px solid var(--accent); outline-offset: −2px` (inset so it does not collide with hairlines); colour as hover; `.thumb` visible.
- **Reduced motion:** hover behaves like focus (static thumbnail), no trail.
- **Nav hover:** `--ink-2` → `--ink`.
- **Trail card:** always non-interactive (`pointer-events: none`), sits above rows (`z-index: 5`) and below nothing else.

## Accessibility

- Rows are `<a>` inside `<ul>/<li>`, so screen readers get "list, 6 items" and each link's name is the full row text ("01 Fjord Bank rebrand Identity, signage, motion 2026").
- The trail layer and every `.thumb` are `aria-hidden="true"`; captions on cards are decorative (`::after` from `data-cap`).
- Keyboard: Tab moves nav (4) → rows (6). Enter follows the link. No key spawns cards; the static thumbnail is the keyboard equivalent.
- Focus ring is inset 2px cobalt; visible against both paper and the hairlines.
- Contrast: `--ink` on `--bg` 15.3:1; `--ink-2` 5.2:1; `--accent` 6.6:1; `--ink-3` (a5a199) is 2.5:1 and is used only for 12–14px numerals and the footer helper — if the product needs AA on those, use `--ink-2`.
- Hit targets: rows are ≈ 96px tall × full width.
- `overflow: hidden` on body is for the 1280×800 frame; remove it in a real page so the list can scroll.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279 (demo `max-width: 1100px`): titles 36px; grid `40px 1fr 160px 90px 32px`.
- 768–1023: hide the meta column; grid `36px 1fr 72px 28px`; card 150×104px; step 40px.
- < 640: rows become two lines (title over meta), 28px titles; disable the trail entirely (touch has no hover) and show the static `.thumb` on `:active` instead; gutters 20px.

## Acceptance checklist

- [ ] Six rows in a `<ul>`, each an `<a>` with grid columns `48px 1fr 220px 120px 40px` and 24px gap, separated by 1px `#dedad1` hairlines.
- [ ] Row titles are Instrument Serif 44px with the last word italic.
- [ ] A trail card spawns only after ≥ 48px of pointer travel, at the pointer position, centred.
- [ ] Cards are 180×124px, 4px radius, `0 12px 32px rgba(23,22,26,.18)` shadow, gradient from the row's `--g`, caption from `data-cap`.
- [ ] Pop: 260ms `cubic-bezier(.16,1,.3,1)` from scale .6; fade: 720ms `cubic-bezier(.2,.7,.2,1)` moving 24px up, starting at 260ms.
- [ ] Never more than 6 cards in the DOM; the oldest is removed synchronously when a 7th spawns.
- [ ] Cards remove themselves on `animationend` of the fade — no `setTimeout`.
- [ ] Rotation alternates −3° / 0° / +3° and persists through both keyframes.
- [ ] Hovering or focusing a row turns its text `#2f4bd8` and nudges the arrow 4px right in 160ms.
- [ ] Focus shows an inset 2px cobalt outline and a static 140×96px thumbnail at `right: 56px`.
- [ ] With `prefers-reduced-motion: reduce` no cards ever appear and hover shows the static thumbnail.
- [ ] The trail layer is `position: fixed; inset: 0; pointer-events: none; aria-hidden`.

## Implementation notes

**Distance-based spawning** avoids timers and makes fast/slow pointer speeds look the same:

```js
const STEP = 48, MAX = 6, alive = []; let lastX = 0, lastY = 0, k = 0;
list.addEventListener('pointermove', (e) => {
  const row = e.target.closest('.row'); if (!row) return;
  const dx = e.clientX - lastX, dy = e.clientY - lastY;
  if (dx * dx + dy * dy < STEP * STEP) return;
  lastX = e.clientX; lastY = e.clientY; spawn(row, e.clientX, e.clientY);
});
list.addEventListener('pointerleave', () => { lastX = -9999; });   // next entry spawns immediately
```

**Two chained keyframes on one element**, with the rotation carried through both:

```css
.img { transform: translate(-50%,-50%) scale(.6) rotate(var(--rot, 0deg)); opacity: 0;
       animation: pop 260ms cubic-bezier(.16,1,.3,1) forwards,
                  gone 720ms cubic-bezier(.2,.7,.2,1) forwards 260ms; }
@keyframes pop  { to { opacity: 1; transform: translate(-50%,-50%) scale(1) rotate(var(--rot, 0deg)); } }
@keyframes gone { to { opacity: 0; transform: translate(-50%, calc(-50% - 24px)) scale(.94) rotate(var(--rot, 0deg)); } }
```

**Cap the population** and clean up on the right animation only:

```js
function spawn(row, x, y) {
  const el = document.createElement('div'); el.className = 'img';
  el.style.left = x + 'px'; el.style.top = y + 'px';
  el.style.setProperty('--g', getComputedStyle(row).getPropertyValue('--g'));
  el.style.setProperty('--rot', ((k++ % 3) - 1) * 3 + 'deg');
  el.dataset.cap = row.dataset.cap; trail.appendChild(el); alive.push(el);
  if (alive.length > MAX) alive.shift().remove();
  el.addEventListener('animationend', (e) => { if (e.animationName !== 'gone') return;
    alive.splice(alive.indexOf(el), 1); el.remove(); });
}
```

Common mistakes: spawning on every `pointermove` (hundreds of nodes per second); listening for `animationend` without checking `animationName` (the pop ends first and removes the card early); putting the trail layer inside a scrolling container instead of `position: fixed`; forgetting `pointer-events: none` so cards steal hover from the row beneath and flicker.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
