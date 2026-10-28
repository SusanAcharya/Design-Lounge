---
title: "Scroll ring carousel"
summary: "Ten film posters on a 3D ring that turns 36 degrees per card with scroll, drag or arrow keys, snaps to the front card and swaps the 76px title below."
platform: web
type: animation
category: scroll
tags: [carousel, 3d, scroll, drag, film]
styles: [dark, kinetic, retro]
motion: rich
difficulty: 3
featured: false
published: 2026-10-28
palette: ["#0D0C0B", "#F2EBE0", "#F2A33A", "#B23A24", "#1F4D45"]
fonts: ["Big Shoulders Display"]
related: [scroll-lens-card-ticker, case-file-horizontal-scroll]
---

# Scroll ring carousel

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The competition page of a fictional festival, Northlight Film Week (6 to 15 November 2026, Harbour Cinema, Kessel). Ten posters stand on a 3D ring, each rotated 36° around a vertical axis 470px from its face. The page section is pinned and 46vh of scroll turns the ring by one card; you can also drag the ring sideways, flick it, press Left/Right/Home/End, use the round step buttons or click a side poster. However it moves, the ring settles on a card, the front card is lit at full brightness while its neighbours fall off with the cosine of their angle, and a details row under the ring swaps to the front film's title (76px Big Shoulders ExtraBold), director, runtime and screenings. The detail worth copying: scroll position is the only state. Drag, keys and snapping all write `scrollTo`, and one paint function turns the scroll position into the ring angle, card lighting and the details row, so the inputs can never disagree.

## Reference behaviour

1. Initial frame (1280×800, scrollY 0): fixed 60px top bar ("NORTHLIGHT" in ink and "FILM WEEK" in amber, 22px/900 caps; the dates in dim 16px; Competition (current, amber), Shorts, Passes). A dim hint at (40, 84): "Competition · Scroll, drag or use arrow keys". The ring centred in the space above the details row: front poster "The Salt Year" (280×400, red ground, sun-and-stripes motif) at full brightness, "Last Bus to Ostra" and "Glasshouse" either side at 81% facing, two more cards at the edges at 31%. A faint amber floor glow under the ring. Details row: kicker "Competition · Hungary", title "THE SALT YEAR", a three-row fact list (Director Ilse Varga, Runtime 104 min, Screens Fri 7 Nov 19:30 · Sun 9 Nov 16:00), and on the right an amber "Book seats" pill, step buttons and the counter "01 / 10".
2. Scroll: the section is `100vh + 9 × 46vh` tall with a sticky stage. Fractional index `f = progress × 9`; ring angle `−f × 36°`. Cards light continuously as they pass the front.
3. Snap: 160ms after the last scroll event, if the stage is fully pinned and `f` is more than 0.02 from a whole card, the page smooth-scrolls to the nearest card.
4. Drag (mouse, pen or touch, horizontal): every 220px of pointer travel is one card; the page scrolls instantly to match while dragging. On release it smooth-scrolls to `round(f − vx × 1.2)` where `vx` is the last pointer velocity in px/ms, so a flick carries one or two extra cards. A drag of more than 6px suppresses the click that follows.
5. Keys while the stage has focus: Right = next, Left = previous, Home = first, End = last. Each smooth-scrolls to that card's scroll position.
6. Click a side poster: the ring turns to it. Step buttons do the same as the arrow keys. Ends clamp (no wrap), counter shows "NN / 10".
7. When the front card changes, the details row, the counter, the Book seats label and a polite live region ("Film 6 of 10: Night Shift at Kessel, Mirek Dvorak") update, and the front card gets a 1px 40%-ink ring.
8. Poster type (country · runtime, and the title) is shown only on the front card; every other poster shows its art only, so dimmed type is never rendered as text.
9. "Book seats" changes to "Seats held" for 1.6s on click.
10. After the pin, a "Festival pass, 22 screenings" band follows.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────┐
│ NORTHLIGHT FILM WEEK  6 to 15 November …     COMPETITION SHORTS PASSES│ 60 fixed
├──────────────────────────────────────────────────────────────────────┤
│ COMPETITION · SCROLL, DRAG OR USE ARROW KEYS                          │ stage sticky 100vh
│          ▕▏┌──────┐ ┌──────────┐ ┌──────┐▕▏                           │ grid rows 1fr / 200px
│          ▕▏│ −1   │ │  FRONT   │ │ +1   │▕▏   ring: 280 × 400        │
│          ▕▏│ 81%  │ │ 280×400  │ │ 81%  │▕▏   radius 470, 36°/card   │
│          ▕▏└──────┘ └──────────┘ └──────┘▕▏   perspective 1700px     │
│                 ░░░░ floor glow ░░░░                                  │
│ COMPETITION · HUNGARY        DIRECTOR  Ilse Varga        (BOOK SEATS) │
│ THE SALT YEAR  76px          RUNTIME   104 min          (‹) 01/10 (›) │
│                              SCREENS   Fri 7 Nov 19:30 · …            │
└──────────────────────────────────────────────────────────────────────┘
```

- `<header class="top">` fixed with brand link, date span and `<nav aria-label="Festival">`.
- `<section class="reel">` (tall) with a visually hidden `<h1>`; `.stage` is `position: sticky; top: 0; height: 100vh; padding-top: 60px; display: grid; grid-template-rows: 1fr auto`, `tabindex="0"`, `role="region"`, `aria-roledescription="carousel"`, `aria-label`, `touch-action: pan-y`.
- `.scene` (`perspective: 1700px; perspective-origin: 50% 45%`) → `.ring` (`transform-style: preserve-3d`) → ten `.card` (`aria-hidden`) → `.poster` with an SVG motif in the middle 50% and HTML type (`<small>`, `<h3>`).
- `.info` 3-column grid `1.3fr 1fr auto`, 200px tall: kicker + `<h2>`; `<dl class="facts">`; `.ctl` with the Book link, prev/next buttons and counter.
- `<p class="sr" aria-live="polite">` for announcements.

## Tokens

```css
:root {
  /* colour */
  --bg: #0d0c0b;        /* page */
  --panel: #171513;
  --line: #2b2825;      /* bar rule, section rule */
  --ink: #f2ebe0;       /* text */
  --dim: #a59d90;       /* labels, dates, hint */
  --acc: #f2a33a;       /* sodium amber: brand half, current nav, CTA, kicker */
  --acc-hover: #f7b55a;
  --acc-ink: #1b1206;
  --step-line: #6f685e; /* round step buttons */
  /* poster grounds / inks */
  --p1: #b23a24 / #f4e6cf;  --p2: #1f4d45 / #e8efe0;  --p3: #e3b341 / #1b1712;
  --p4: #22303f / #f1e3c8;  --p5: #ede3d0 / #a92f1c;  --p6: #141619 / #f0a33a;
  --p7: #5f6b33 / #f3efdc;  --p8: #3b1f2b / #f0d8c8;  --p9: #d9774a / #1d140f;
  --p10: #2e5b8a / #f2ece0;  /* write these as two tokens each in real code */

  --font: "Big Shoulders Display", system-ui, sans-serif;

  /* ring */
  --cw: 280px; --ch: 400px; --r: 470px; --step: 36deg;   /* 360 / 10 */
  --perspective: 1700px;
  --scroll-per-card: 46vh;
  --px-per-card: 220px;     /* drag */
  --flick: 1.2;             /* cards per px/ms of release velocity */
  --dim-floor: .32;         /* brightness of a card facing sideways */

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --t-settle: 160ms;        /* idle time before snapping */
  --t-held: 1600ms;
}
```

## Typography

| Role            | Family | Size | Weight | Line-height | Tracking | Case      |
|-----------------|--------|-----:|-------:|------------:|---------:|-----------|
| Front title     | Big Shoulders Display | 76px (54px < 820) | 800 | 0.9 | −0.01em | UPPERCASE, balanced wrap |
| Poster title    | Big Shoulders Display | 52px (36px) | 900 | 0.86 | −0.01em | UPPERCASE |
| Poster meta     | Big Shoulders Display | 13px (11px) | 700 | 1.4 | +0.14em | UPPERCASE |
| Brand           | Big Shoulders Display | 22px | 900 | 1 | +0.06em | UPPERCASE |
| Nav             | Big Shoulders Display | 16px | 700 | 1 | +0.08em | UPPERCASE |
| Kicker          | Big Shoulders Display | 14px | 700 | 1.4 | +0.16em | UPPERCASE |
| Fact label      | Big Shoulders Display | 14px | 500 | 1.4 | +0.1em  | UPPERCASE |
| Fact value, body| Big Shoulders Display | 17–18px | 500 | 1.4 | 0 | sentence |
| CTA             | Big Shoulders Display | 18px | 800 | 1 | +0.08em | UPPERCASE |

One condensed family, nine weights: the hierarchy is weight and size, not a second face.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
|---|---|---|---|---|---|
| `.ring` | scroll position | `rotateY` | `−f × 36°` | scroll-linked | n/a |
| `.card` | scroll position | `filter: brightness, saturate` | `0.32 + 0.68·max(0, cos(d·36°))`; saturate `0.4 + 0.6·…` | scroll-linked | n/a |
| page | idle 160ms, drag release, key, step, click | scroll position | to nearest / target card | browser smooth scroll | browser |
| Poster type | card is not the front card | visibility | visible → hidden | instant | n/a |
| Details row | front index changes | text | swap | instant | n/a |
| Book seats | click | label | "Book seats" → "Seats held" → back | 1600ms | n/a |

`d` is the signed card distance from the front, wrapped into −5…5.

Reduced motion: the ring only paints whole cards (`round(f)`), so it steps 36° at a time instead of sweeping, and every programmatic scroll is instant (`behavior: 'auto'`). Scroll, drag and keys still work; nothing glides.

## States

- **Front card:** brightness 1, 1px `rgba(242,235,224,.4)` ring, type visible.
- **Neighbour (±1):** brightness ≈ 0.87, art only.
- **Far (±2):** brightness ≈ 0.53, art only. Cards facing away are hidden by `backface-visibility: hidden`.
- **Dragging:** cursor `grabbing`; no snapping until release.
- **Step button hover:** ring from `#6f685e` to ink. **CTA hover:** `#f7b55a`.
- **Focus-visible:** 2px amber outline, 3px offset; the stage itself shows a 2px inset amber ring.
- **Ends:** at card 1 Left does nothing; at card 10 Right does nothing.

## Accessibility

- The stage is a focusable `region` with `aria-roledescription="carousel"` and a label that names the keys. Posters are `aria-hidden` because the details row holds the same information as real text, read in a sensible order.
- Visually hidden text (the `<h1>` and the live region) uses 1px, `clip-path: inset(50%)` and `opacity: 0`; it stays in the accessibility tree.
- The live region announces "Film N of 10: Title, Director" when the front card changes.
- Step buttons have `aria-label` "Previous film" / "Next film"; the Book link's `aria-label` names the film.
- `touch-action: pan-y` lets phones scroll vertically through the pin while horizontal drags turn the ring.
- Contrast: ink on page 16.5:1; dim 7.3:1; CTA text 8.9:1; every poster ink on its ground is at least 4.8:1 (lowest: `#f4e6cf` on `#b23a24`; olive `#f3efdc` on `#5f6b33` is 5.0:1). Step rings `#6f685e` are 3.5:1.
- Hit targets: step buttons 44px, CTA 48px tall (44px on phones).

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: same ring; the details grid columns shrink and the title wraps to two balanced lines inside the fixed 200px row.
- 820–1023: same; perspective unchanged.
- < 820: cards 190×272, radius 310px, perspective 1100px. Top bar keeps only the brand. Details stack: kicker, 54px title, facts, then a row with the step buttons and counter on the left and Book seats on the right. Side cards are cut by the screen edge and show art only.
- Nothing scrolls sideways at 390px; the stage clips the ring.

## Acceptance checklist

**Always**
- [ ] Scroll position is the single source of truth; drag, keys, buttons and clicks all call `scrollTo`.
- [ ] Ring step is `360 / n` degrees and radius at least `(w / 2) / tan(180° / n)` plus a gap.
- [ ] Card lighting follows `cos` of the angular distance, floored at 0.32 brightness.
- [ ] The ring snaps to a whole card 160ms after scrolling stops, only while pinned.
- [ ] Drag maps a fixed px per card and a flick adds cards from release velocity; a drag never triggers a click.
- [ ] Left, Right, Home and End work when the stage has focus; ends clamp.
- [ ] The details row and a polite live region update when the front card changes.
- [ ] Poster text is rendered only on the front card (dimmed cards carry no text).
- [ ] Reduced motion steps whole cards with instant scrolling.
- [ ] Nothing scrolls sideways at 390px.

**This demo**
- [ ] Ten films from "The Salt Year" (Ilse Varga, Hungary, 104 min) to "Last Bus to Ostra" (Jonas Kiel, Denmark, 85 min).
- [ ] Cards 280×400, radius 470px, perspective 1700px, 46vh of scroll per card.
- [ ] Amber `#f2a33a` used only for the brand half, current nav item, kicker, CTA and focus.

## Implementation notes

**Build the ring once; rotate one element.**

```css
.ring { position: absolute; left: 50%; top: 50%; width: var(--cw); height: var(--ch);
  margin: calc(var(--ch) / -2) 0 0 calc(var(--cw) / -2); transform-style: preserve-3d;
  transform: translateZ(calc(var(--r) * -1)) rotateY(var(--a)); }
.card { position: absolute; inset: 0; backface-visibility: hidden;
  transform: rotateY(calc(var(--i) * 36deg)) translateZ(var(--r));
  filter: brightness(calc(.32 + var(--f, 0) * .68)) saturate(calc(.4 + var(--f, 0) * .6)); }
```

The `translateZ(-r)` on the ring puts the front card back at z = 0, so it renders at exactly 280×400.

**One paint from scroll:**

```js
const fNow = () => clamp(0, (scrollY - top0()) / span() * (N - 1), N - 1);
const paint = (f) => {
  const v = reduce ? Math.round(f) : f;
  ring.style.setProperty('--a', -v * 36 + 'deg');
  cards.forEach((c, k) => { let d = k - v; d -= N * Math.round(d / N);
    c.style.setProperty('--f', Math.max(0, Math.cos(d * Math.PI / 5))); });
  show(Math.round(f));                    // details row, counter, live region
};
```

**Drag writes scroll, release snaps with momentum:**

```js
const f = clamp(0, sf - (e.clientX - sx) / 220, N - 1);
scrollTo({ top: top0() + span() * f / (N - 1), behavior: 'auto' });
// on pointerup
go(Math.round(fNow() - vx * 1.2));   // vx in px/ms, sign flips because dragging left moves forward
```

Common mistakes: keeping a separate "current index" that drag and scroll update independently (they drift); snapping while the user is still scrolling (wait 160ms of quiet); dimming with `opacity` (it shows the backs of other cards through the front one, and the far cards' text fails contrast); and forgetting `touch-action: pan-y`, which makes phones either refuse to scroll or refuse to drag.
