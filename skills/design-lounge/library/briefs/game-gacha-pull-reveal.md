<!-- Design Lounge Nº 579 · "Gacha pull reveal" · www.designlounge.live -->

# Gacha pull reveal

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The summon screen of a mobile character-collection game, drawn like a manga page rather than a neon casino: cream screen-tone paper, heavy ink outlines, focus lines, halftone dots. Pressing Pull runs a 2.6s sequence in four beats: **charge** (manga focus lines jitter in, a summoning seal spins and shrinks, coloured rays gather), **burst** (a paper-white flash, rays explode outward, a ring of halftone dots blows past), **reveal** (the card flips in from 160° with a spring, a foil sheen sweeps, stars pop one by one, the rarity badge and NEW stamp slam down) and **rest** (rays keep turning slowly behind the card). The rarity sets the colour of every light in the sequence: gold for SSR, cyan for SR, silver for R, so a player knows what they got a beat before the badge lands. The character is invented and built from about fifteen SVG shapes: hair mass, bangs with spikes, a pointed-chin face, big two-tone eyes with highlights, blush, a hair ornament. The visual language is custom game UI; controls follow Material 3 Expressive (big pill button, 56px targets, emphasised spring).

## Structure

```
390 × 844 (Lounge draws the status bar; 54px top, 34px bottom clear)
┌──────────────────────────────┐
│ 54px safe area               │
│ STARFALL         [◆ 3,240]   │  header, 15px title, chip with 2px ink outline
│ SUMMONS                      │
│ RATE UP UNTIL 14 NOV         │
│   ╲  │  ╱  rays / focus      │
│ ┌──────── card 264×392 ─────┐│  3px ink, 5px rarity ring, 3px ink ring, 8 12 offset shadow
│ │[SSR]             [NEW]    ││  badge −6°, stamp 8°
│ │      character art        ││  art area height 296, conic rays in rarity tint
│ │───────────────────────────││  3px ink rule
│ │ MIREI ASAGIRI 17px        ││  plate 96px
│ │ DAWN LANCER · LIGHT       ││
│ │ ★ ★ ★ ★ ★                 ││
│ └───────────────────────────┘│
│   ADDED TO ROSTER · LV 1     │
│ SSR GUARANTEED IN 62 PULLS   │
│ (↻)  [ PULL X1   (◆ 160) ]   │  56px, gap 12
│ 34px home indicator          │
└──────────────────────────────┘
.app padding 54 18 34, flex column; stage is flex 1 with the card centred
```

- `.tone`: halftone dots (`radial-gradient` 7px tile) masked to the edges so the centre stays clean.
- `<header class="top">`: banner name, rate-up date, prism chip with `aria-label`.
- `<main class="stage" aria-live="polite">`: `.focus`, `.rays`, `.dots`, `svg.seal`, `<article class="card">` (art SVG, sheen, badge, NEW, plate with `<h1>`, title, stars), `.flash`, the roster line.
- `<footer class="bot">`: pity line, Replay `<button aria-label>`, Pull `<button>` with a cost chip.

## Motion

| Element | Phase | Property | From → To | Duration | Easing | Delay |
|---|---|---|---|---:|---|---|
| Focus lines | charge | opacity, rotate | 0 → .9, ±1.5° jitter | 900ms | steps(6) | 0 |
| Seal | charge | scale, rotate, opacity | 1.4, 0°, 0 → .55, 320°, 1 | 900ms | cubic-bezier(.5,0,.9,.4) | 0 |
| Rays | charge | scale, rotate, opacity | .3, 0°, 0 → .6, −40°, .6 | 900ms | ease-in | 0 |
| Flash | burst | opacity | 0 → 1 (25%) → 0 | 380ms | `--ease` | 900ms |
| Rays | burst | scale, rotate, opacity | .4, 1 → 1.15, 12°, .55 | 1400ms | `--ease-out` | 900ms |
| Dot ring | burst | scale, opacity | .3, 1 → 1.6, 0 | 900ms | `--ease-out` | 900ms |
| Card | reveal | rotateY, scale, opacity | 160°, .3, 0 → 0, 1, 1 (perspective 800px) | 620ms | `--spring` | 1180ms |
| Badge, NEW | reveal | scale, opacity | 2.2, 0 → 1, 1 | 360ms | `--spring` | +440ms |
| Sheen | reveal | translateX | −120% → 120% | 900ms | `--ease` | +520ms |
| Stars | reveal | scale, rotate, opacity | 0, −40°, 0 → 1, 0, 1 | 320ms | `--spring` | +560ms + i × 80ms |
| Roster line | reveal | translateY, opacity | 8px, 0 → 0, 1 | 400ms | `--ease-out` | +900ms |
| Rays | rest | rotate | +360° | 40s loop | linear | 2600ms |

Reduced motion: skip straight to the rest state (card, stars, badge and roster line visible, rays still at .55 and not turning). Pull and Replay still change the result.

## States

- **Rarity:** `--rc` drives the rays, dot ring, seal glow, card ring, art tint (55% and 25% mixes with white), badge text, stars and the Pull button's offset shadow.
- **Pull pressed:** translates 2px, 3px and loses its shadow. **Disabled:** `--ink-2` fill and border.
- **Replay pressed:** same press as Pull. **Focus-visible:** 3px ink outline, 3px offset on both.
- **Mid-sequence:** controls stay live; a new press cancels timers and restarts from charge.

## Accessibility

- The stage is `aria-live="polite"`; the card's `aria-label` reads "SSR, 5 stars: Mirei Asagiri, Dawn Lancer · Light" once it changes.
- Every decorative layer (`.tone`, focus lines, rays, dots, seal, flash, art SVG, star SVGs) is `aria-hidden`.
- Replay has `aria-label="Replay reveal"`; Pull has visible text and the cost inside.
- The flash is one 380ms peak, never repeated, so it stays well under three flashes per second; reduced motion removes it.
- Hit targets: 56 × 56px Replay, 56px tall Pull spanning the rest of the row.
- Contrast: `--ink` on `--paper` 15.5:1, `--ink-2` on `--paper` 7.4:1 (8.5:1 on the card), `--white` on `--ink` 17.8:1; badge text on ink: gold 9.0:1, cyan 7.4:1, silver 7.1:1.

## Responsive rules

- 390 × 844: as drawn.
- 360 wide: the card stays 264px (48px of air each side); header and footer keep 18px gutters.
- Height over 900px (tall phones, small tablets): the card scales to 1.1×.
- Tablet: centre the 390px column; do not stretch the card.
- The page never scrolls; the rays and focus lines are larger than the frame and clipped by `.app { overflow:hidden }`.

## Acceptance checklist

**Always**
- [ ] The sequence has four beats with the timings above and ends at rest, not blank.
- [ ] One custom property sets the rarity light everywhere; SSR, SR and R look different before the badge lands.
- [ ] The card flips in with a spring overshoot and a single foil sweep; stars pop in order.
- [ ] Replay restarts the current reveal; any press mid-sequence cancels pending timers.
- [ ] The flash fires once per pull and is removed under reduced motion.
- [ ] Reduced motion shows the finished card immediately.
- [ ] Controls are 56px and sit above the 34px home indicator; nothing sits in the top 54px.
- [ ] The character is invented, built from shapes, with ink outlines and cel colour.

**This demo**
- [ ] First result: SSR, Mirei Asagiri, Dawn Lancer · Light, 5 gold stars.
- [ ] Prisms 3,240, cost 160, pity 62; demo order SSR, R (Pip Mochizuki), SR (Touya Kiryu).
- [ ] Rubik Mono One is the only family.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. On load the sequence plays once for the first result: SSR "Mirei Asagiri, Dawn Lancer · Light", 5 stars, gold light. It rests on the revealed card.
2. Charge, 0 to 900ms: focus lines fade to 90% and jitter ±1.5° in 6 steps; the seal starts at 1.4× and spins 320° while shrinking to .55× on an accelerating curve; rays in the rarity colour rotate in to .6×.
3. Burst, 900 to 1,180ms: a full-screen `#fffdf8` flash peaks at 25% of 380ms; rays scale from .4 to 1.15 over 1,400ms; the dot ring scales .3 to 1.6 and fades over 900ms.
4. Reveal, from 1,180ms: the card goes from `rotateY(160deg) scale(.3)` to flat in 620ms on a spring; badge and NEW stamp scale from 2.2× at +440ms; stars pop at +560ms with an 80ms stagger; the sheen sweeps at +520ms for 900ms; "Added to roster · Lv 1" rises at +900ms.
5. Rest, from 2,600ms: rays sit at 55% opacity and turn one revolution every 40s.
6. Pull x1 (160 prisms): spends 160 (3,240 to 3,080), advances to the next result in a fixed demo order (SSR, R, SR) and plays the sequence. The pity line counts down by one, or resets to 90 on an SSR. The button disables below 160 prisms.
7. Replay (round button, left): plays the current result's sequence again at no cost. Calling either control mid-sequence cancels pending timers and starts clean.

## Tokens

```css
:root {
  --paper: #f3ede1;   /* page */
  --paper-2: #e7dfcf;
  --ink: #15161a;     /* outlines, text, button fill */
  --ink-2: #4a4b52;   /* secondary text */
  --white: #fffdf8;   /* card, flash, chips */
  --ssr: #f5a700;     /* gold light */
  --sr: #19b5d6;      /* cyan light */
  --r: #9aa3ad;       /* silver light */
  --rc: var(--ssr);   /* current rarity colour, set from JS */
  --skin: #ffe6d4;
  --blush: #ff8fa3;
  --font: "Rubik Mono One", system-ui, sans-serif;
  --card-w: 264px; --card-h: 392px; --card-r: 16px; --plate-h: 96px;
  --btn-h: 56px;
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
  --spring: cubic-bezier(.34,1.56,.64,1);
  --t-charge: 900ms; --t-flash: 380ms; --t-card: 620ms; --t-rest: 2600ms;
}
```

## Typography

One family, Rubik Mono One (a single heavy weight); hierarchy comes from size and tracking only.

| Role | Size | Line-height | Tracking | Case |
|---|---:|---:|---:|---|
| Rarity badge | 24px | 1 | 0 | upper |
| Character name | 17px | 1.1 | .01em | upper (the face is caps-only) |
| Banner title, Pull label | 15px | 1.1 | 0 | upper |
| Prism count | 12px | 1.3 | 0 | numerals |
| Cost chip, NEW stamp | 11px | 1 | 0 | |
| Character title, pity, roster line, rate-up | 9 to 10px | 1.3 | .06 to .08em | upper |

Keep anything under 10px to single short lines; this face gets dense quickly.

## Implementation notes

**A sequence as classes.** Drive every layer from one class on the stage and a handful of timeouts; CSS owns the motion:

```js
const run = () => {
  timers.forEach(clearTimeout); timers = [];
  draw(P[k]);
  if (reduce) { stage.className = 'stage s-done'; return; }
  stage.className = 'stage'; void stage.offsetWidth; stage.className = 'stage s-charge';
  const at = (ms, c) => timers.push(setTimeout(() => { stage.className = 'stage ' + c; }, ms));
  at(900, 's-burst'); at(1180, 's-burst s-reveal'); at(2600, 's-done');
};
```

The `void offsetWidth` between class changes forces a restyle, so the same animation can run again on Replay.

**Manga focus lines in one gradient.** A thin repeating conic stripe, masked out of the centre so the lines converge on the seal:

```css
.focus{position:absolute;inset:-40% -60%;
  background:repeating-conic-gradient(from 0deg,var(--ink) 0 .9deg,transparent .9deg 5deg);
  mask:radial-gradient(circle,transparent 22%,#000 60%)}
```

**Rarity art tint.** Mix the rarity colour with white for the card's ray background so gold, cyan and silver all stay light enough for ink line art:

```css
.art{background:repeating-conic-gradient(from 8deg at 50% 40%,
  color-mix(in srgb,var(--rc) 55%,#fff) 0 4deg, color-mix(in srgb,var(--rc) 25%,#fff) 4deg 12deg)}
```

Common mistakes: a dark neon background (it reads as a slot machine, not a manga page); a rarity shown only by the badge; letting the flash repeat; starting on an empty idle screen instead of a revealed card.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
