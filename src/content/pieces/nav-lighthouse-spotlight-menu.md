---
title: "Lighthouse spotlight menu"
summary: "A full-screen menu for an invented writer where a hand-drawn lighthouse swings its beam onto whichever link you hover, focus or tap."
platform: web
type: component
category: navigation
tags: [menu, navigation, illustration, hover, portfolio]
styles: [paper, riso, playful]
motion: rich
difficulty: 2
featured: false
published: 2026-10-29
palette: ["#1C4547", "#F4E8CB", "#C8643B", "#17302F", "#143638"]
fonts: ["Alegreya", "Gaegu"]
related: [hero-flashlight-reveal, footer-constellation-links]
---

# Lighthouse spotlight menu

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The open state of the main menu on the personal site of Wren Halloway, an invented writer and illustrator from a fictional stretch of coast. Six big serif links sit on the left of a dusk-teal screen; on the right, an inline-SVG lighthouse on a rocky islet throws a soft cone of light from its lamp room. The beam swings, with a small overshoot, onto whichever link is hovered, focused or tapped, and that link gets a pale hand-drawn lozenge behind it, an italic turn and a small handwritten note. The detail worth copying: the beam is one SVG cone rotated around the lamp's real on-screen position and scaled so it ends exactly on the link, so it always lands, at any viewport size.

## Reference behaviour

1. On load the menu is open. The current page, "iii Sketchbook" (`aria-current="page"`), is lit: cream lozenge behind it, text turns ink and italic, numeral turns rust, note "drawn on the 7.40 ferry" appears. The beam already points at it.
2. Hover any other link: the beam rotates around the lamp to point at that link's text (aim point 55% across, 55% down the label) over 760ms with a slight overshoot, and grows or shrinks so it ends 70px past the aim point. The lozenge moves to that link (old one scales down to `scale(.82,.5)` and fades in 180ms; new one grows to `scale(1)` over 420ms). The lens inside the lamp room slides up to 4px toward the beam side.
3. Move the pointer off the list: if focus is not inside the menu, the beam swings back to the current page link.
4. Tab or Shift+Tab onto a link: identical to hover. ArrowDown and ArrowUp move focus to the next or previous link, wrapping.
5. Click or tap a link: it becomes the current page (`aria-current` moves) and stays lit. On touch, the tap itself aims the beam. The demo prevents navigation; a real site navigates after the beam lands.
6. Click "Close" (or press Escape): the list hides, an intro paragraph takes its place, the button becomes "Menu" with a three-line hand-drawn icon, and the beam stretches to 1.6× and idly sweeps the sky between 196° and 238° over 11s, alternating.
7. Click "Menu": the list returns and the beam swings back onto the current link.
8. Ambient loops, all calm: chimney smoke drifts 6s, waves at the islet's foot slide 6px over 5.5s, gulls glide 8px over 7s, a small rust sailing boat rocks ±3° over 4.2s.
9. At 390 wide the lighthouse shrinks to 318px tall in the bottom-right corner and the beam aims up and left at the tapped link.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────────┐
│ header: Wren Halloway · stories and drawings…                (✕ Close)  │ 28px top, 72px gutters
│                                                                          │
│   i   Stories                               Skerry Light, lit 1871 ─╮    │ note: right 390, top 118
│   ii  Picture books                         it looks where you look  ↓   │
│ ( iii Sketchbook  drawn on the 7.40 ferry )≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡[lamp]   │ lamp ≈ (1015, 295)
│   iv  The Almanac                                                 ▓▓     │
│   v   Commissions                                                 ░░     │ lighthouse svg
│   vi  About & letters                                             ▓▓     │ 411 × 640, right 56
│                                                         boat  hut ░░     │
│ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ sea, 128px ~~~~~~~~~~~~~~~ ▄▄rock▄▄▄▄     │
│ post             now drawing            elsewhere                        │ bottom 34px
│ wren@…           The Salt Almanac…      Print shop · RSS                 │
└──────────────────────────────────────────────────────────────────────────┘
 nav starts 34px under the header · items 60px type, 2px gap, ≈82px pitch
```

- `body`: dusk gradient, `overflow: hidden`, holds every layer as absolute siblings.
- `.sea` (`aria-hidden`): full-width band, height `calc(var(--house-h) * .2)`, with an inline SVG of a hand-drawn horizon line and short double-crest wave strokes.
- `svg.sky` (`aria-hidden`): full-viewport SVG, no viewBox (1 unit = 1px). Six star dots and `<g id="beam"><g id="reach">` with two cone paths.
- `svg.house` (`aria-hidden`): viewBox `0 0 360 560`, height `--house-h`, `aspect-ratio: 360/560`, `overflow: visible`. Islet, lighthouse, cottage with washing line, smoke, waterline, waves, gulls, boat. All drawing sits inside one `<g filter="url(#rough)">`.
- `.grain` (`aria-hidden`): full-screen noise overlay below the text layers.
- `<header>`: home link (name + hand subtitle) and `<button class="close" aria-expanded aria-controls="menu">`.
- `<nav id="menu" aria-label="Main"><ol>`: six `<li><a>`, each `<span class="k" aria-hidden>` numeral, `<span class="t">` label, `<span class="n">` note.
- `.intro` (hidden while open), `.note` annotation with a drawn arrow (`aria-hidden`), `.foot` with three small `<p>` groups.

## Tokens

```css
:root {
  /* colour */
  --dusk: #1C4547;      /* sky, top 52% */
  --dusk-2: #23504F;    /* sky near the horizon (80%) */
  --sea: #143638;       /* sea band and waterline fill */
  --sea-line: #3E6D68;  /* wave strokes, link underlines */
  --cream: #F4E8CB;     /* text, lozenge, tower paint */
  --cream-2: #D9CFB4;   /* numerals, subtitles, labels */
  --ink: #17302F;       /* text on the lozenge, drawing outlines */
  --rust: #C8643B;      /* tower bands, cap, cottage roof, boat (drawing only) */
  --rust-ink: #8E3B1E;  /* lit numeral, note, lozenge pencil line */
  --glow: #FFE2A3;      /* lamp-room glass */
  --beam: #FFEBB8;      /* beam colour, alpha from the gradient */

  /* type */
  --serif: "Alegreya", Georgia, serif;
  --hand: "Gaegu", "Comic Sans MS", cursive;
  --fs-item: 60px;
  --fs-num: 24px;
  --fs-note: 21px;
  --fs-body: 15px;

  /* layout */
  --gutter: 72px;
  --house-h: 640px;     /* lighthouse svg height; sea = 20% of it */
  --beam-core: 60;      /* half-width at 1000 units: ≈3.4° */
  --beam-outer: 112;    /* half-width at 1000 units: ≈6.4°, at 40% opacity */
  --beam-tail: 70px;    /* how far past the aim point the cone ends */

  /* motion */
  --t-micro: 180ms;
  --t-aim: 760ms;
  --t-lozenge: 420ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --swing: cubic-bezier(.34, 1.18, .5, 1); /* slight overshoot, like a heavy lens settling */
}
```

## Typography

| Role               | Family   | Size | Weight | Line-height | Tracking | Case / style |
|--------------------|----------|-----:|-------:|------------:|---------:|--------------|
| Menu item          | Alegreya | 60px | 500    | 1.02        | −0.015em | sentence; italic when lit |
| Roman numeral      | Gaegu    | 24px | 700    | 1           | 0        | lowercase, right-aligned in 34px |
| Lit note           | Gaegu    | 21px | 400    | 1           | 0        | lowercase, `--rust-ink` |
| Name               | Alegreya | 24px | 700    | 1           | −0.01em  | title |
| Subtitle           | Gaegu    | 20px | 400    | 1           | 0        | lowercase |
| Close / Menu       | Gaegu    | 20px | 700    | 1           | 0        | title |
| Annotation         | Gaegu    | 21px / 17px | 400 | 1.1   | 0        | sentence |
| Foot label         | Gaegu    | 19px | 400    | 1           | 0        | lowercase |
| Foot text          | Alegreya | 15px | 500    | 1.45        | 0        | sentence |
| Intro (closed)     | Alegreya | 54px | 500 italic | 1.05    | −0.015em | sentence |

## Motion

| Element            | Trigger                    | Property             | From → To                                  | Duration | Easing    |
|--------------------|----------------------------|----------------------|--------------------------------------------|---------:|-----------|
| Beam `#beam`       | hover / focus / tap        | transform            | `translate(lamp) rotate(prev)` → `rotate(atan2)` | 760ms | `--swing` |
| Beam `#reach`      | same                       | transform            | `scale(prev)` → `scale((d + 70) / 1000)`   | 760ms    | `--swing` |
| Lozenge `::before` | link becomes lit           | transform, opacity   | `scale(.82,.5) rotate(−1.4deg)`, 0 → `none`, 1 | 420ms / 180ms | `--swing` / `--ease` |
| Label, numeral     | lit                        | color, italic        | cream → ink, cream-2 → rust-ink            | 180ms    | default   |
| Note `.n`          | lit                        | opacity, translateX, visibility | 0, −6px, hidden → 1, 0, visible | 180ms / 300ms | `--ease` |
| Lens               | aim                        | translateX           | → `cos(angle) × 4px`                       | 760ms    | `--swing` |
| Beam (closed)      | Close                      | rotate, scale        | 196° ↔ 238°, scale 1.6                     | 11s alternate, infinite | `--ease` |
| Intro              | Close / Menu               | opacity, visibility  | 0 ↔ 1                                      | 300ms    | `--ease` |
| Smoke / waves / gulls / boat | ambient          | transform            | drift 5px / slide 6px / glide 8px / rock ±3° | 6s / 5.5s / 7s / 4.2s alternate | ease-in-out |
| Close button       | hover                      | background, color    | transparent, cream → cream, ink            | 180ms    | `--ease`  |

Reduced motion: every transition is cut to 1ms and every animation removed, so the beam and lozenge snap to the lit link and the closed-state sweep is replaced by a still beam.

## States

- **Lit (hover, focus, tap, current):** cream lozenge with a 1.4px `--rust-ink` pencil line offset inside it, label ink italic, numeral rust-ink, note visible. Even rows mirror the lozenge (`scaleX(-1)`) and tilt it +0.8° instead of −1.4° so two lit rows never look stamped.
- **Unlit:** cream label, cream-2 numeral, note hidden with `visibility: hidden`.
- **Current page:** `aria-current="page"`; it is the resting target of the beam whenever the pointer and focus leave the list.
- **Focus-visible:** 2px dashed cream outline, 5px offset, pill radius, on top of the lit lozenge.
- **Closed:** nav and every note `visibility: hidden`, intro visible, button label "Menu" with a three-stroke icon, `aria-expanded="false"`, beam sweeping.
- **Close hover:** button fills cream with ink text.

## Accessibility

- `<nav aria-label="Main">` with an ordered list; numerals are `aria-hidden` so links read "Stories", not "i Stories". The notes are part of the link name, which gives each a short description.
- The toggle is a `<button>` with `aria-expanded` and `aria-controls="menu"`; Escape closes the open menu.
- ArrowUp and ArrowDown move between links; Tab order is header link, Close, six links, footer links.
- Every drawing layer is `aria-hidden`; no information lives only in the beam.
- Contrast: cream on dusk 8.7:1, cream-2 numerals on dusk 6.8:1, cream on the beam at its brightest over text (≈ #4A6B66) 4.8:1, ink on lozenge 11.5:1, rust-ink note on lozenge 6.2:1, cream on sea 10.7:1. Keep beam alpha at text distance at or below 0.13 + 0.05 (core + outer), or unlit items under it fail 4.5:1.
- The Close button's 1.5px cream border is 8.7:1 against dusk; links are at least 74px tall on desktop and 52px on phone.

## Responsive rules

- ≥ 1280: as specified.
- 1101–1279: same; the lighthouse stays at 640px.
- 641–1100: `--house-h` 540px, items 52px, gutters 48px, the annotation hides.
- ≤ 640: `--house-h` 318px pinned bottom-right at `right: 0`, items 38px with 20px right padding, numerals 19px in 24px, header name and subtitle stack. The lit note drops into a small cream pill under the lozenge (15px, 10px radius) so it never widens the row. Footer keeps two groups in one column, 200px max. The beam recomputes on resize from the lens's `getBoundingClientRect`, so it still lands on the tapped link. Nothing scrolls sideways at 390.

## Acceptance checklist

**Always**

- [ ] The beam is one SVG cone rotated around the lamp's measured screen position and scaled so it ends 70px past the target; it lands on the link at 1280, 1024 and 390.
- [ ] Hover, keyboard focus and tap all aim the beam and light the same link; pointer-leave returns it to the current page.
- [ ] Exactly one link is lit at a time; unlit notes are `visibility: hidden`.
- [ ] Unlit link text keeps at least 4.5:1 where the beam crosses it; lit text on the lozenge at least 4.5:1.
- [ ] The toggle updates `aria-expanded`, its label and icon; Escape closes the menu.
- [ ] Reduced motion snaps the beam and lozenge with no tween and stops the ambient loops.
- [ ] The drawing stays visible on phones and nothing scrolls sideways at 390.
- [ ] No text sits on a filter; the rough displacement filter is applied to the drawing only.

**This demo**

- [ ] Six links: Stories, Picture books, Sketchbook (current), The Almanac, Commissions, About & letters, with numerals i to vi.
- [ ] Lighthouse 640px tall, lamp at viewBox (180, 118), three rust bands, cottage with washing line, rust boat.
- [ ] Beam turn 760ms on `cubic-bezier(.34, 1.18, .5, 1)`; lozenge grows over 420ms.
- [ ] Palette dusk `#1C4547`, cream `#F4E8CB`, rust `#C8643B`, ink `#17302F`.

## Implementation notes

**Aim from measured positions, then let CSS tween.** Normalise the angle to 0–360 so a swing between two links on the left never takes the long way through 0°.

```js
function aim(a) {
  const l = lens.getBoundingClientRect(), lx = l.left + l.width / 2, ly = l.top + l.height / 2;
  const t = a.querySelector('.t').getBoundingClientRect();
  const tx = t.left + t.width * .55, ty = t.top + t.height * .55;
  const ang = (Math.atan2(ty - ly, tx - lx) * 180 / Math.PI + 360) % 360;
  const s = document.documentElement.style;
  s.setProperty('--lx', lx + 'px'); s.setProperty('--ly', ly + 'px');
  s.setProperty('--a', ang + 'deg');
  s.setProperty('--s', ((Math.hypot(tx - lx, ty - ly) + 70) / 1000).toFixed(3));
}
```

**The cone lives in a 1000-unit local space.** Rotation sits on the outer group and scale on the inner one, so the two transitions don't fight. The gradient is `userSpaceOnUse` along the local x axis, so it scales with the cone.

```css
#beam  { transform: translate(var(--lx), var(--ly)) rotate(var(--a));
         transition: transform var(--t-aim) var(--swing); }
#reach { transform: scale(var(--s, .8));
         transition: transform var(--t-aim) var(--swing); }
/* <path d="M0-4L1000-60Q1010 0 1000 60L0 4Z" fill="url(#bg)"/>  core
   <path d="M0-7L1000-112Q1016 0 1000 112L0 7Z" opacity=".4"/>   halo
   stops: 0 → .62, .14 → .22, .8 → .13, 1 → .10; blur stdDeviation 4 */
```

**Hand-made line without a hand.** One displacement filter over the whole drawing wobbles every straight edge by a couple of pixels; it must never wrap text.

```html
<filter id="rough">
  <feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="4"/>
  <feDisplacementMap in="SourceGraphic" scale="4"/>
</filter>
```

The lozenge is an inline SVG data URI stretched with `background-size: 100% 100%`: a filled irregular loop plus a second, offset loop stroked with `vector-effect: non-scaling-stroke`, so the pencil line stays 1.4px however wide the label is.

Common mistakes: measuring the lamp from the SVG's viewBox instead of the screen (breaks at every other size); letting the beam run past the link, so it washes over the rows above and below and drops them under 4.5:1; animating with JS frames instead of a CSS transition (reduced motion is then a second code path); hiding notes with opacity only, which leaves invisible text for the contrast check and screen readers.
