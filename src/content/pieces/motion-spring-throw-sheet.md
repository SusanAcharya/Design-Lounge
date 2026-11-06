---
title: "Throwable sheet with spring detents"
summary: "A map app's bottom sheet you fling between three detents: release velocity picks the stop and a hand-rolled spring overshoots and settles. Filter chips flick away."
platform: mobile-app
type: component
category: overlays
tags: [drag, swipe, sheet, spring, map, physics]
styles: [minimal, soft]
motion: rich
difficulty: 3
featured: false
published: 2026-11-06
palette: ["#ECE6DA", "#FBFAF7", "#1D1B18", "#C23E26", "#9FC3CC"]
fonts: ["Plus Jakarta Sans"]
related: [ios-bottom-sheet-detents, m3-modal-bottom-sheet, spring-deck]
---

# Throwable sheet with spring detents

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The home screen of "Nightjar", an invented late-night food map for the fictional harbour town of Portmore. A drawn SVG street map fills the screen; a warm off-white bottom sheet lists "14 kitchens open past 11". The sheet has three detents (full, half, peek) and you throw it: the speed of your finger at release decides where it lands, and a spring you integrate yourself, not a CSS curve, carries that speed into a small overshoot and a settle. The filter chips in the sheet are throwable too: flick one up and it flies off spinning, the row closes the gap, and Undo springs it back in. iOS 26-ish language: glass search pill, 22px sheet radius, spring motion. Worth copying: velocity projection to pick the detent, and handing the release velocity to the spring so the motion is continuous with the hand.

## Reference behaviour

1. First frame, 390 × 844 (the Lounge draws the status bar). Full-bleed SVG map: beige land `#ECE6DA`, blocks `#E2DACB`, a river `#9FC3CC` crossing at y ≈ 270–380, a park, white roads with `#D3C9B7` casing, two district labels ("OLD QUAY", "ROPEWORKS", 10px/700, 2px tracking, `#4F493F`), five coral pins numbered 1–5 and a blue "you" dot with a 22px halo.
2. Top, at 58px: a 48px glass search pill "Search Portmore" and a 48px ink avatar "IV". A 48px round locate button floats 64px above the sheet's top edge on the right.
3. The sheet rests at the **half** detent (top = 48% of viewport height, 404px at 844). Contents: 24px handle zone with a 40 × 5 grabber; heading "14 kitchens open past 11" (22/800) with "Fri 22:48" at right; sub-line "Within 15 minutes on foot of Harbour Street"; a horizontally scrolling chip row ("Open now" and "Noodles" selected, ink fill; "Under £15", "Takeaway", "Vegetarian", "Seats 4+" outlined); a hint "Flick a filter up to drop it" with an up arrow; then seven place rows.
4. Press anywhere on the sheet (outside chips) and drag: the sheet top follows the finger 1:1. Past the full or peek detent it rubber-bands: `limit ± (1 − 1/(d·0.55/200 + 1))·200`.
5. Release: compute velocity from the last 80ms of pointer samples. Project the resting point `y + v · 0.2s`, pick the nearest detent to that projection. If `|v| > 900 px/s` and the nearest is the current detent, move one detent in the throw's direction anyway.
6. The sheet then runs a spring from its current top to the chosen detent, starting with the release velocity: stiffness 420, damping 28, mass 1 (damping ratio 0.68). A firm upward throw from half overshoots full by about 10px (top reaches ≈ 54px), then settles at 64px in roughly 450ms.
7. The map scrim (`#1D1B18`) fades from 0 at half to 0.32 at full, driven by the live sheet position, not a separate animation. The locate button rides 64px above the sheet and hides above the half detent.
8. At **full** (top 64px) the list becomes scrollable; dragging the header still moves the sheet. At half and peek the list does not scroll; the whole sheet is the drag handle.
9. Tap the grabber (movement under 6px): half goes to full; full or peek go to half.
10. Chips: tap toggles selection and the heading count updates (e.g. deselecting "Noodles" reads "16 kitchens open past 11").
11. Drag a chip vertically (more than 8px, mostly vertical): it follows the finger and tilts `dx · 0.08°`. Release beyond 70px or faster than 700 px/s: it keeps flying at max(1600, |v|) px/s in that direction, spins 260°/s and fades over ~310ms. Its slot then collapses to 0 width in 280ms on the iOS curve; the hint fades away for good.
12. Release a chip short of that: it springs home (k 600, c 24, m 1) from where it is, with the release velocity.
13. A toast slides in at top 118px: ink pill, "Removed “Noodles”" and an "Undo" button. It stays 4s.
14. Undo: the slot reopens, the chip appears 56px above its place and springs down into it with 900 px/s of initial velocity, so it lands with one small bounce; the count restores.
15. Keyboard: the grabber is a button; ArrowUp and ArrowDown move one detent (with a synthetic 1400 px/s so the spring feels the same), Enter toggles half/full. On a chip, Delete or Backspace throws it upward and moves focus to Undo.
16. Reduced motion: no springs, no overshoot. The sheet moves with a 200ms standard-ease transition; chips disappear with no flight and the slot closes at once.

## Structure

```
390 × 844
┌───────────────────────────────────────┐
│ 54 status (Lounge)                    │
│ [ ⌕ Search Portmore          ] (IV)   │ 58–106  .top, fixed
│                                       │
│      SVG map · pins 1–5 · you dot     │ full-bleed, preserveAspectRatio slice
│  ~~~~~~~~ river ~~~~~~~~~~      (⌖)   │ locate: top = sheetTop − 64
├───────────────────────────────────────┤ ◄ sheet top: 64 | 405 | 668
│               ▬▬▬▬ (40×5)             │ handle 24
│ 14 kitchens open past 11   Fri 22:48  │ h1 22/800
│ Within 15 minutes on foot of …        │
│ (Open now)(Under £15)(Noodles)(Take…→ │ chips 40 tall, x-scroll
│ ↑ Flick a filter up to drop it        │
│ ─────────────────────────────────────  │
│ [tile] Salt Lamp Ramen        4.7     │ rows 52 tile, 12 pad
│        Tonkotsu, gyoza …  till 01:00  │
│ …                                     │
└───────────────────────────────────────┘
```

- `<svg class="map" aria-hidden="true">`: fixed, inset 0, viewBox 390 × 844.
- `.scrim`: fixed, ink, opacity bound to sheet position.
- `<header class="top">`: search pill (`role="search"`) and avatar `<button>`.
- `<button class="locate">`: fixed, its `top` follows the sheet.
- `<div class="toast" role="status" aria-live="polite">` with an Undo `<button>`; `visibility:hidden` when closed.
- `<section class="sheet" aria-label="Kitchens near you">`: fixed, `left/right/bottom: 0`, `top` driven by JS, max-width 430px centred.
  - `.grab`: `<button class="handle">` + heading row + sub-line.
  - `.chips role="group"`: each chip is a `.cw` wrapper (so its width can collapse) holding `<button class="chip" aria-pressed>`.
  - `.list` `<ul>` of rows: tile, name and detail, rating and closing time.

Drive the sheet with `top` (bottom stays 0) so the list's scroll box is always exactly the visible part; nothing sits below the screen edge.

## Tokens

```css
:root {
  /* map */
  --land: #ece6da;
  --block: #e2dacb;
  --water: #9fc3cc;
  --water-2: #8ab4bf;     /* ferry route dashes */
  --park: #c9d9b4;
  --road: #fbfaf7;
  --road-edge: #d3c9b7;
  /* surfaces and ink */
  --sheet: #fbfaf7;
  --line: #e4ddd0;        /* row hairlines */
  --chip-line: #8c8577;   /* 3.6:1 on sheet */
  --grabber: #a39b8c;
  --ink: #1d1b18;
  --ink-2: #595349;       /* 7.0:1 on sheet */
  --accent: #c23e26;      /* pins, closing times (5.0:1 on sheet) */
  --you: #2a64c8;         /* location dot, focus ring */
  --toast-action: #ffd7cc;
  /* tiles */
  --tile-coral: #f6ddd5; --tile-sage: #dfe8d2; --tile-sky: #d9e6ea; --tile-sand: #efe2c8; --tile-lilac: #e7dcef;
  /* type */
  --sans: "Plus Jakarta Sans", system-ui, sans-serif;
  --fs-title: 22px; --fs-name: 16px; --fs-body: 15px; --fs-chip: 14px; --fs-meta: 13px; --fs-hint: 12px;
  /* space and shape */
  --gutter: 20px; --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --r-sheet: 22px; --r-chip: 20px; --r-tile: 14px; --r-toast: 16px; --r-pill: 24px;
  --chip-h: 40px; --tile: 52px; --control: 48px;
  /* shadows */
  --sh-sheet: 0 -1px 0 rgba(29,27,24,.08), 0 -12px 40px rgba(29,27,24,.16);
  --sh-float: 0 8px 24px rgba(29,27,24,.12);
  --sh-toast: 0 12px 30px rgba(29,27,24,.28);
  /* detents (top of sheet) */
  --detent-full: 64px;
  --detent-half: 48vh;
  --detent-peek: calc(100vh - 176px);
  /* sheet spring */
  --spring-k: 420;        /* stiffness, N/m */
  --spring-c: 28;         /* damping, N·s/m → ζ = 28 / (2√420) = 0.68 */
  --spring-m: 1;          /* mass, kg */
  --spring-substep: 4.17ms; /* 1/240 s */
  --spring-rest-v: 4;     /* px/s */
  --spring-rest-x: 0.4px;
  --projection: 0.2s;     /* y + v·0.2 picks the detent */
  --fling-skip: 900;      /* px/s forces one detent of travel */
  --rubber: 0.55;         /* rubber-band coefficient, 200px dimension */
  /* chip spring and throw */
  --chip-k: 600; --chip-c: 24; --chip-m: 1;
  --chip-throw-dist: 70px; --chip-throw-v: 700; /* px/s */
  --chip-fly-min: 1600;   /* px/s */
  --chip-spin: 260deg;    /* per second */
  --chip-fade: 3.2;       /* opacity per second */
  /* motion */
  --ios: cubic-bezier(.32,.72,0,1);
  --ease: cubic-bezier(.2,.7,.2,1);
  --d-collapse: 280ms; --d-toast: 320ms; --d-toast-fade: 200ms; --d-rm: 200ms;
  --toast-hold: 4000ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|
| Sheet title | Plus Jakarta Sans | 22px | 800 | 1.15 | −0.02em | Sentence |
| Place name | Plus Jakarta Sans | 16px | 700 | 1.4 | −0.01em | Title |
| Search, body | Plus Jakarta Sans | 15px | 500 | 1.4 | 0 | Sentence |
| Chip | Plus Jakarta Sans | 14px | 600 | 1 | 0 | Sentence, nowrap |
| Meta, time, rating | Plus Jakarta Sans | 13px | 600–700 | 1.4 | 0 | Sentence |
| Hint | Plus Jakarta Sans | 12px | 600 | 1.4 | 0 | Sentence |
| Map district | Plus Jakarta Sans | 10px | 700 | 1 | 2px | Upper |
| Pin numeral | Plus Jakarta Sans | 12px | 800 | 1 | 0 | — |

## Motion

| Thing | Trigger | Property | From → to | Physics / duration | Reduced motion |
|---|---|---|---|---|---|
| Sheet drag | pointer move | `top` | finger, rubber-band past ends | 1:1 | same |
| Sheet settle | release, key, tap | `top` | current → detent | spring k 420, c 28, m 1, v0 = release velocity | 200ms `--ease` transition |
| Scrim | sheet `top` | opacity | 0 (half) → 0.32 (full) | bound, no own timing | same |
| Locate button | sheet `top` | `top`, opacity | sheetTop − 64; 0 above half − 40 | bound | same |
| Chip drag | vertical pointer move | translateY, rotate | finger; tilt dx·0.08° | 1:1 | same |
| Chip throw | release > 70px or > 700px/s | translateY, rotate, opacity | keeps going at ≥ 1600px/s, +260°/s, −3.2/s opacity | rAF, ~310ms | hidden at once |
| Chip slot | after throw / undo | width, margin-right | measured → 0 / 0 → measured | 280ms `--ios` | 1ms |
| Chip return | short release / undo | translateY | dy → 0 (undo: −56 → 0, v0 900) | spring k 600, c 24, m 1 | jump |
| Toast | throw | translateY, opacity | −12px, 0 → 0, 1 | 320ms `--ios` / 200ms | 1ms |
| Hint | first throw | opacity | 1 → 0, then hidden | 240ms `--ease` | 1ms |

## States

- **Sheet detents:** full (64px, list scrolls, scrim 0.32), half (48vh, default), peek (viewport − 176px, header and chips only).
- **Dragging:** cursor `grabbing` on the header; springs cancelled the moment a finger lands, so you can catch a moving sheet.
- **Chip selected:** ink fill `#1D1B18`, text `#FBFAF7`, border ink. Unselected: sheet fill, 1.5px `#8C8577` border.
- **Chip in flight:** follows finger; after throw it is invisible and its slot `visibility:hidden`.
- **Toast open:** visible for 4s; closed it is `visibility:hidden` after its 320ms exit.
- **Focus-visible:** 3px `#2A64C8` outline, 2px offset, 12px radius, on the grabber, chips, avatar, locate and Undo.
- **Empty:** not reachable here; if every chip is thrown, the row is empty and the hint stays gone.

## Accessibility

- The grabber `<button>` is labelled "Resize list. Now half height. Arrow keys change height." and the label updates per detent; a polite visually hidden region says "List full", "List half" or "List peek".
- ArrowUp / ArrowDown on the grabber move one detent; Enter or Space toggles half/full. These run the same spring as a throw.
- Chips are toggle buttons with `aria-pressed`; the group label tells screen-reader users that Delete drops a filter. Delete or Backspace throws the focused chip and moves focus to Undo; Undo returns focus to the restored chip.
- The toast is `role="status"` and `aria-live="polite"`.
- Map is decorative (`aria-hidden`); the list carries the same places.
- Hit targets: chips 40px tall, grabber zone full width × 24px plus the 70px header, controls 48px.
- Contrast: body `#595349` on `#FBFAF7` is 7.0:1, closing times `#C23E26` 5.0:1, toast text `#FBFAF7` on `#1D1B18` 16:1.

## Responsive rules

- Detents are expressed against viewport height (64px, 48%, H − 176px) and recomputed on resize; the sheet keeps its current detent.
- At 360 wide the chip row simply scrolls further; names in rows truncate before the rating column (the rating column never wraps).
- Above 430px wide (tablet, desktop preview), the sheet, top bar and toast centre at max 430px while the map stays full-bleed.
- Keep 54px clear at the top: the search row starts at 58px.

## Acceptance checklist

**Always**
- [ ] Three detents; on release the detent is chosen from `y + v·0.2s`, not from the release position alone.
- [ ] A throw faster than 900px/s always travels at least one detent in its direction.
- [ ] The settle is a hand-integrated spring (k 420, c 28, m 1) seeded with the release velocity; a hard upward throw visibly overshoots full by 6–12px.
- [ ] Grabbing the sheet mid-spring stops it under the finger with no jump.
- [ ] Rubber-banding beyond full and peek; never a hard stop.
- [ ] Scrim opacity and the floating button are bound to the live sheet position.
- [ ] Chips: vertical flick past 70px or 700px/s throws; shorter springs back; tap toggles.
- [ ] Undo restores the chip with a spring landing, and focus returns to it.
- [ ] Keyboard can reach every detent and remove a chip.
- [ ] Reduced motion: no overshoot, no flight; 200ms transitions only.
- [ ] Closed toast is `visibility:hidden`; `scrollWidth` stays 390.

**This demo**
- [ ] Heading reads "14 kitchens open past 11", time "Fri 22:48", seven rows starting "Salt Lamp Ramen".
- [ ] Toast copy "Removed “Noodles”" with "Undo".
- [ ] Detents at 64 / 405 / 668px on an 844px screen.

## Implementation notes

**1. The spring.** Semi-implicit Euler in fixed 1/240s substeps is stable at these constants and frame-rate independent. Cap `dt` at 32ms so a backgrounded tab does not explode it.

```js
const step = (s, dt) => {              // s = { x, v, to, k, c, m }
  for (let n = Math.ceil(dt / (1/240)), h = dt / n; n--;) {
    s.v += ((-s.k * (s.x - s.to) - s.c * s.v) / s.m) * h;
    s.x += s.v * h;
  }
  return Math.abs(s.v) < 4 && Math.abs(s.x - s.to) < 0.4;   // at rest
};
```

**2. Velocity and projection.** Keep only samples from the last 80ms so a pause before release reads as zero velocity. Then project and pick.

```js
const pick = (vel) => {
  const proj = y + vel * 0.2;
  let best = 0;
  det.forEach((d, i) => { if (Math.abs(d - proj) < Math.abs(det[best] - proj)) best = i; });
  if (Math.abs(vel) > 900 && best === idx) best = clamp(idx + Math.sign(vel), 0, 2);
  return best;
};
// on release: target = det[pick(v)]; spring.v = v;  ← carry the hand's speed in
```

**3. Throwable chips inside a horizontal scroller.** Give chips `touch-action: pan-x` so the browser keeps horizontal scrolling, and only capture the pointer once the gesture is clearly vertical (`|dy| > 8 && |dy| > |dx|`). Swallow the click that follows a drag, or every throw also toggles the filter. Collapse the chip's wrapper, not the chip, so the flying chip keeps its size:

```js
w.style.width = w.offsetWidth + 'px'; w.offsetWidth;    // lock, then reflow
w.style.width = '0px'; w.style.marginRight = '-8px';    // eat the 8px gap
w.style.visibility = 'hidden';
```

Common mistakes: animating the sheet with a CSS transition (it drops the release velocity, so every throw lands the same), choosing the detent by nearest position (a fast short flick goes nowhere), and translating the sheet off-screen so its list text sits below the viewport.
