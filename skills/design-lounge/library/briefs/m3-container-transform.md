<!-- Design Lounge Nº 123 · "M3 container transform" · designlounge.vercel.app -->

# M3 container transform

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The Material 3 **container transform** pattern, shown in a trail-finder app called Wayfare. A list of hike cards sits on a warm olive-sand tonal surface. Tapping a card makes that card's container grow from its exact on-screen rectangle to the full 390×844 screen, its corner radius relaxing from 28px to 0, while the card's content fades out and the detail screen's content fades in (fade-through). Back runs the same morph in reverse, landing pixel-perfect on the card it came from. The language is **Material 3 Expressive**: tonal surfaces instead of shadows, a 57px/800 display headline, a squat 64px pill CTA, and thumbnails cut into different M3 shapes (arch, pill, leaf). The detail worth copying is the single shared container: nothing slides in from the side, the card *becomes* the screen.

## Reference behaviour

1. Load: the list screen is visible. After 700ms the featured card ("Australian Camp ridge") auto-opens once; at 2900ms it auto-closes. This replays the point without user input.
2. List screen, top to bottom: a 56px bar (search icon button left, 40px initials avatar right), an olive eyebrow "Annapurna foothills · 14 routes", the headline "Trails." (the full stop in primary), a row of four filter chips, then four cards and a fixed navigation bar.
3. Chips are single-select. The selected chip fills with `--secondary-c` and its radius morphs from 12px to a full pill over 160ms.
4. Tap any card (or press Enter/Space on it):
   - A clone ("ghost") of the card is placed inside an overlay container positioned at the card's `getBoundingClientRect()`. The original card is hidden with `visibility:hidden`.
   - The container animates `top/left/width/height` to `0/0/100vw/100vh` and `border-radius` 28px → 0 over 500ms `cubic-bezier(.2,0,0,1)`.
   - The ghost fades 1 → 0 across the first 30% of the duration; the detail content holds at 0 for 30%, then fades to 1 (linear opacity, the container carries the easing).
   - A scrim behind the container fades 0 → 1 (`rgba(28,28,18,.32)`).
   - The bottom action bar rises 24px and fades in, starting at 40%.
   - On finish, focus moves to the Back button (only when the user triggered it) and a polite live region announces "<trail> opened".
5. The detail screen: a 372px CSS/SVG landscape hero (same art as the card, sliced to fill), two 48px tonal icon buttons at y=62 (Back left, Save right), two difficulty pills at the hero's bottom-left, then a 28px-radius sheet overlapping the hero by 28px with title, subtitle, three stat tiles, an elevation profile and a paragraph.
6. Tap Back, or press Escape: the container animates from full screen back to the card's current rect over 400ms with the same easing. The detail content fades out by 45%; the ghost fades in from 55%. The action bar fades out by 25%. On finish the overlay is hidden, the original card reappears and receives focus.
7. Each card carries its own data (title, km, gain, moving time, difficulty, elevation samples, body copy, art). Opening a different card fills the detail screen from that data before the animation starts.
8. Download button (64×64, radius 22) toggles `aria-pressed`; pressed state morphs to a circle and inverts colours.
9. A second tap during an animation is ignored (a `busy` flag).

## Structure

```
390 × 844 — list                          390 × 844 — detail
┌──────────────────────────────────┐      ┌──────────────────────────────────┐
│ 54 safe area                     │      │ hero art 372 ───────────────────│
│ [search]                   (KT)  │ 56   │ (←) y=62                    (▢) │
│ Annapurna foothills · 14 routes  │      │                                  │
│ Trails.                 57/800   │      │ [Moderate] [Loop]   bottom 52    │
│ [Day hikes][Overnight][Lakes][F… │ 40   │╭────────────────────────────────╮│ sheet −28 overlap
│ ┌──────────────────────────────┐ │      ││ Australian Camp ridge   34/800 ││
│ │ art 176 · radius 20          │ │      ││ Starts at Kande trailhead…     ││
│ │ [• Sunrise pick]             │ │      ││ ┌─────────┐┌───────┐┌───────┐  ││
│ │ Australian Camp ridge  22/700│ │      ││ │11.4 km  ││640 m  ││5h10   │  ││ stats 1.1fr 1fr 1fr
│ │ 11.4 km · 640 m gain · 5h 10m│ │      ││ └─────────┘└───────┘└───────┘  ││
│ └──────────────────────────────┘ │      ││ ┌ Elevation · 1,770–2,410 m ─┐ ││
│ ┌(arch 92)  Begnas lake shore (>)│      ││ │ area chart 76px            │ ││
│ ┌(pill 92)  Raniban pine loop (>)│      ││ └────────────────────────────┘ ││
│ ┌(leaf 92)  Sarangkot night…  (>)│      ││ body copy 15/1.55              ││
├──────────────────────────────────┤      │├────────────────────────────────┤│
│ nav 114 (80 + 34 home)           │      ││ [▶ Start route        ] [↓]   ││ 64px, bottom 46
└──────────────────────────────────┘      └──────────────────────────────────┘
```

- `<main id="list">` scrolls (padding `54px 16px 130px`), contains the bar, `<p class="eyebrow">`, `<h1>`, `<div role="group" aria-label="Filter">` of chip buttons, `<ul class="list">`.
- Each card is a single `<button class="card" data-i aria-haspopup="dialog">` with spans inside: `.ph` (art wrapper), `.tx` with `<b>` title and `<small>` meta. Compact cards add `.row` and a 40px chevron disc.
- `<nav class="nav" aria-label="Primary">` is absolutely positioned, 114px tall including 34px bottom inset; three destinations with a 64×32 active-indicator pill.
- `<div class="scrim">` then `<section class="ct" role="dialog" aria-modal="true" aria-labelledby="dTitle" hidden>`, which contains the transient `.ghost`, the scrollable `.detail` (fixed 390px wide so it never reflows while the container grows) and the `.act` bar.
- Art is four inline SVG `<symbol>`s (390×300 viewBox, `preserveAspectRatio="xMidYMid slice"`) drawn with gradients and 3–4 polygon ridges, reused with `<use>` in both the card and the hero.

## Tokens

```css
:root {
  /* tonal surfaces (warm olive-sand) */
  --surface: #f8f6ec;
  --surface-c: #eeecdc;          /* cards, nav bar, stat tiles */
  --surface-high: #e7e4d1;       /* card hover */
  --surface-highest: #dfdcc6;
  --on-surface: #1c1c12;
  --on-surface-v: #4a4a38;       /* meta text, icons */
  --outline-v: #cbc8b0;          /* unselected chip border */
  /* roles */
  --primary: #4b6a14;
  --on-primary: #ffffff;
  --primary-c: #cdeb94;          /* first stat tile, download button, elevation fill */
  --on-primary-c: #132000;
  --secondary-c: #dfe6c2;        /* selected chip, nav indicator */
  --on-secondary-c: #1a1e06;
  --tertiary-c: #ffdcc2;         /* avatar */
  --on-tertiary-c: #2e1500;
  --scrim: rgba(28, 28, 18, .32);
  /* art */
  --art-sky-a: #f7dc9a; --art-sky-a2: #ee9560; --art-ridge: #6b7f2e; --art-near: #33461a;
  /* type */
  --font: "Figtree", system-ui, sans-serif;
  --fs-display: 57px; --fs-title: 34px; --fs-card: 22px; --fs-row: 18px;
  --fs-body: 15px; --fs-meta: 14px; --fs-label: 12px;
  /* spacing */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px; --s-6: 24px;
  /* shape */
  --r-card: 28px; --r-art: 20px; --r-tile: 20px; --r-chip: 12px; --r-pill: 999px;
  --r-arch: 46px 46px 16px 16px; --r-leaf: 30px 12px 30px 12px;
  --shadow-1: 0 1px 2px rgba(28,28,18,.12), 0 2px 6px rgba(28,28,18,.08);
  /* motion */
  --t-micro: 160ms; --t-enter: 500ms; --t-exit: 400ms;
  --ease-emph: cubic-bezier(.2, 0, 0, 1);
}
```

## Typography

Material 3 Expressive language, one family (Figtree) used from 400 to 800.

| Role            | Size | Weight | Line-height | Tracking | Notes |
|-----------------|-----:|-------:|------------:|---------:|-------|
| Display "Trails." | 57px | 800 | 1.02 | −0.035em | full stop in `--primary` |
| Eyebrow         | 13px | 600 | 1.45 | +0.04em | `--primary` |
| Detail title    | 34px | 800 | 1.08 | −0.03em | |
| Card title      | 22px | 700 | 1.2  | −0.01em | featured card |
| Row title       | 18px | 700 | 1.2  | −0.01em | compact cards |
| Stat value      | 30px | 800 | 1    | −0.03em | unit 14px/600 |
| Body            | 15px | 400 | 1.55 | 0 | `--on-surface-v` |
| Meta / chip     | 14px | 600 (chip) / 400 (meta) | 1.45 | 0 | |
| Labels, nav     | 12–13px | 600–700 | 1.3 | 0 | |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Notes |
|---|---|---|---|---:|---|---|
| `.ct` container | open | top, left, width, height, border-radius | card rect, 28px → 0,0,100vw,100vh, 0 | 500ms | `--ease-emph` | WAAPI, `fill:both` |
| `.ghost` | open | opacity | 1 → 0 by 30% | 500ms | linear | container carries the curve |
| `.detail` | open | opacity | 0 (hold to 30%) → 1 | 500ms | linear | |
| `.act` | open | opacity, translateY | 0, 24px → 1, 0 (starts 40%) | 500ms | `--ease-emph` | |
| `.scrim` | open / close | opacity | 0 ↔ 1 | 500 / 400ms | `--ease-emph` | |
| `.ct` container | close | same props | full → card rect | 400ms | `--ease-emph` | exit is 20% shorter |
| `.detail` | close | opacity | 1 → 0 by 45% | 400ms | linear | |
| `.ghost` | close | opacity | 0 (hold to 55%) → 1 | 400ms | linear | |
| Chip | select | border-radius, background | 12px → 999px | 160ms | `--ease-emph` | |
| Card | press | scale | 1 → .985 | 160ms | `--ease-emph` | |
| CTA | press | border-radius | 999px → 20px | 160ms | `--ease-emph` | expressive squish |

Reduced motion: every WAAPI duration becomes 1ms and CSS transitions are 1ms. The screen still swaps, the overlay still opens and closes, focus still moves.

## States

- **Card hover:** `--surface-c` → `--surface-high`. **Press:** scale .985.
- **Focus-visible:** 3px `--primary` outline, 2px offset, on cards, chips, icon buttons, CTA, download and nav.
- **Chip selected:** `aria-pressed="true"`, `--secondary-c` fill, no border, pill radius.
- **Nav current:** `aria-current="page"`, 64×32 `--secondary-c` indicator behind the icon, label `--on-surface`.
- **Card open:** source card `visibility:hidden` (keeps layout) until the close animation finishes.
- **Busy:** clicks and Escape are ignored while an open or close is running.
- **Download pressed:** circle radius, `--on-primary-c` fill, `--primary-c` icon.

## Accessibility

- Each card is one `<button>` with `aria-haspopup="dialog"`; its accessible name is the title plus meta text.
- The overlay is `role="dialog" aria-modal="true"` labelled by the detail title. Escape closes it.
- Focus moves to Back after a user-initiated open, and back to the source card after close. The auto-play on load never moves focus.
- A visually hidden `aria-live="polite"` paragraph announces "<trail> opened".
- Icon-only buttons have `aria-label` ("Back to trails", "Save trail", "Download for offline", "Search trails").
- Contrast: `--on-surface-v` #4a4a38 on `--surface-c` #eeecdc is 7.9:1; `--on-primary` on `--primary` is 6.4:1.
- Hit targets: icon buttons 48px, chips 40px tall, CTA 64px, nav items full 80px column.

## Responsive rules

- 390 wide: as specified.
- 360 wide: chips scroll horizontally (they already overflow at 390, revealing "Family" partially as an affordance); compact card thumbnails stay 92px; stat tiles drop value size to 26px.
- Taller phones: the hero stays 372px; extra height goes to the sheet.
- Tablet (≥ 600): do not full-screen the detail. Transform the card into a 560px-wide centred container with 28px radius kept, over the scrim. Same timings.
- Always measure the card rect at the moment of opening and closing; never cache it, because the list may have scrolled.

## Acceptance checklist

- [ ] The open animation starts exactly on the tapped card's bounding rect, including its 28px radius.
- [ ] Container grows to full screen in 500ms with `cubic-bezier(.2,0,0,1)`; close takes 400ms with the same curve.
- [ ] Card content and detail content never overlap at full opacity (fade-through crossover at 30%).
- [ ] The detail layout is a fixed 390px wide and does not reflow while the container grows.
- [ ] Back lands precisely on the source card, which is hidden during the overlay and reappears at the end.
- [ ] Escape closes the detail; focus returns to the source card.
- [ ] Each of the four cards opens its own title, stats, elevation path and art.
- [ ] Auto-play on load opens the featured card at 700ms and closes it at 2900ms without moving focus.
- [ ] Chips are single-select with a 12px → pill radius morph.
- [ ] Thumbnails use three different shapes: arch, pill, leaf.
- [ ] Bottom nav and action bar keep 34px clear at the bottom.
- [ ] Reduced motion: overlay opens and closes instantly with no errors.
- [ ] No console errors; demo under 28 KB.

## Implementation notes

**Animate the container, not the content.** Measure, clone, then animate the rectangle with WAAPI. The detail is fixed-width inside an `overflow:hidden` container so it is revealed, not squeezed:

```js
const rect = el => { const r = el.getBoundingClientRect();
  return { top: r.top+'px', left: r.left+'px', width: r.width+'px', height: r.height+'px' }; };
const o = { duration: 500, easing: 'cubic-bezier(.2,0,0,1)', fill: 'both' };
ct.animate([{ ...rect(card), borderRadius: '28px' },
            { top: '0px', left: '0px', width: innerWidth+'px', height: innerHeight+'px', borderRadius: '0px' }], o);
ghost.animate([{ opacity: 1 }, { opacity: 0, offset: .3 }, { opacity: 0 }], { ...o, easing: 'linear' });
detail.animate([{ opacity: 0 }, { opacity: 0, offset: .3 }, { opacity: 1 }], { ...o, easing: 'linear' });
```

**Clone with visibility reset.** On close the source card is still `visibility:hidden`; the clone inherits the inline style, so clear it or the ghost is invisible:

```js
const k = card.cloneNode(true); k.style.visibility = '';
ghost.style.width = card.offsetWidth + 'px'; ghost.appendChild(k); ct.prepend(ghost);
```

**Art that fills any box.** Put `preserveAspectRatio="xMidYMid slice"` on the `<symbol>` itself; on the outer `<svg>` it does nothing without a viewBox, and the art letterboxes:

```html
<symbol id="artA" viewBox="0 0 390 300" preserveAspectRatio="xMidYMid slice">…</symbol>
<svg class="art"><use href="#artA"/></svg>
```

Common mistakes: sliding the detail in from the right (that is a shared-axis transition, not a container transform); animating `transform: scale` on the container, which distorts text and radius; forgetting to cancel `fill:both` animations after close so the next open starts from a stale frame.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
