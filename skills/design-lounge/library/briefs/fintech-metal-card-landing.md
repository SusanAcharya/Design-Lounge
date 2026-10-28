<!-- Design Lounge Nº 585 · "Metal card landing" · www.designlounge.live -->

# Metal card landing

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The marketing page for Orrin Reserve, an invented premium card cut from 18 grams of grade 5 titanium. The page is graphite black with warm ivory type: a high-contrast Bodoni Moda headline ("Cut from titanium. *Priced in plain numbers.*") beside the card itself, drawn entirely in CSS with a brushed grain and a bright anisotropic streak that slides across the metal as the pointer moves, while the card tilts up to 7° toward it. Under the hero, the fee and perks are four large numerals ($395, $300, 3×, 0%) on a hairline grid, then a full fee table and an application block. The luxury comes from restraint and honesty: a single verdigris accent, no gold, no glow, and every fee printed before the button.

## Structure

```
1280 × 800 (page scrolls)
┌──────────────────────────────────────────────────────────────────────────────┐
│ O R R I N   Cards Rewards Travel Help                     Sign in  [APPLY]   │ 76
├──────────────────────────────────────────────────────────────────────────────┤
│ pad 56                                                                        │
│ ORRIN RESERVE (eyebrow, verdigris)        ┌─────────────────────────────┐     │
│ Cut from                                   │ ORRIN               Reserve │     │
│ titanium.          80px Bodoni             │ [chip]                  ◯◯  │ 540w│
│ Priced in plain    (italic, --ink-2)       │                    TITANIUM │ −6° │
│ numbers.                                   │ ELENA VASQUEZ-ROW      18 G │     │
│ lede 18px, max 480                         └─────────────────────────────┘     │
│ [APPLY FOR RESERVE →]  See every fee           floor shadow ellipse            │
├──────────┬──────────┬──────────┬──────────────────────────────────────────────┤
│ $395     │ $300     │ 3×       │ 0%           numerals 64px, labels 15px       │
└──────────┴──────────┴──────────┴──────────────────────────────────────────────┘
  Every fee, before you apply. │ table: 6 rows, th 46%                          
  [ Apply in about six minutes.                      [START APPLICATION →] ]     
  footer legal 13px
hero grid: minmax(0,1fr) minmax(0,1.05fr), gap 24, padding 40 56 32; stage 460 tall
```

- `<header class="nav">`: letter-spaced wordmark link, `<nav aria-label="Primary">` list, spacer, Sign in link, outlined Apply link.
- `<section class="hero">`: copy column (eyebrow `<p>`, `<h1>` with an `<em>` on its own line, lede, CTA row) and `.stage` (`role="button" tabindex="0"`) holding `.card`.
- `.card`: wordmark, italic tier, `.chip` (two pseudo-elements draw the contact lines), interlocking-circles network mark SVG, cardholder name, "TITANIUM / 18 G".
- `.nums` section of four `<div>`s (`<b>` numeral, `<span>` label); `.fine` section with `<h2>`, paragraph and a `<table>` with `<th scope="row">`; `.apply` block; `<footer>`.

## Motion

| Element         | Trigger                 | Property                  | From → To                          | Duration | Easing       |
|-----------------|-------------------------|---------------------------|------------------------------------|---------:|--------------|
| Streak `--x`    | load, card click        | registered `--x` (percentage) | −30% → 32%                     | 1400ms   | `--ease-out` |
| Streak `--x`    | pointermove             | `--x`                     | follows pointer, −20% … 120%       | live     | —            |
| Card tilt       | pointermove / leave     | rotateX, rotateY          | ±5°, ±7° ↔ 0                       | 600ms    | `--ease-out` |
| Filled button   | hover / press           | background, translateY    | → `--accent-hi`, 1px               | 180ms    | `--ease`     |
| Outlined button | hover                   | border-color              | `--ink-3` → `--ink`                | 180ms    | `--ease`     |

Reduced motion: no load sweep and no transitions; the streak rests at 32% and still jumps to the pointer, the card does not ease.

## States

- **Card idle:** streak at 32%, no tilt, resting −6° roll.
- **Card tracking:** streak and tilt follow the pointer (fine pointers and touch drags; a coarse mouse is ignored).
- **Card focus-visible:** 2px verdigris outline, 3px offset on the stage.
- **Buttons:** hover and press as in Motion; focus-visible 2px verdigris outline, 3px offset.
- **Nav link hover:** `--ink`. **Current page:** not marked (this is the product's landing).

## Accessibility

- The stage is `role="button"` labelled "Orrin Reserve titanium card. Press to replay the light."; Enter and Space replay.
- The card's print is decorative duplication of real text elsewhere, but stays real text, so it reads in order.
- Fee table rows use `<th scope="row">` so each value is announced with its label.
- One `<h1>`; section `<h2>`s; landmarks: header, nav, main, footer.
- Contrast: lede 8.4:1, legal 6.1:1, verdigris text 8.9:1, card print on the darkest metal 5.8:1.
- Targets: buttons 54px (hero) and 42px (nav); links have 6px vertical padding.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: same grid; headline scales by `clamp()`.
- < 1024: hero stacks (copy, then a 420px stage), nav links hide (keep Sign in and Apply), numerals become a 2 × 2 grid, fee section stacks.
- < 640: page padding 16px, Sign in hides, stage 300px with the card at 90% width and 14px radius, card print shrinks (wordmark 15px, name 11px), both filled buttons go full width, table label column 52%. Nothing scrolls sideways at 390.

## Acceptance checklist

**Always**
- [ ] The card is pure CSS: three-layer background (streak, brushed grain, metal gradient) and a 3px stacked edge shadow for thickness.
- [ ] The streak position and the tilt both follow the pointer; leaving resets them.
- [ ] The load sweep animates a registered `--x` property and replays on click and keyboard.
- [ ] Every fee in the table is a number, and the four headline numerals sit above the fold's bottom edge at 1280 × 800.
- [ ] One filled accent button per view; the nav Apply is outlined.
- [ ] No gradient on the page itself, only on the metal.
- [ ] Headline is the largest type; body text is never set in Bodoni.
- [ ] At 390 nothing scrolls sideways and the card stays inside the viewport.
- [ ] Reduced motion removes the sweep and easing.

**This demo**
- [ ] Orrin Reserve, 18 g grade 5 titanium, cardholder ELENA VASQUEZ-ROW.
- [ ] Numerals $395, $300, 3×, 0% with their labels.
- [ ] Fee table: $395; $75 each per year; 21.24% to 28.99%; up to $40; 1,340 lounges, 2 guests free; free courier replacement in 2 days.
- [ ] Apply block reads "Apply in about six minutes." with "Start application".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. On load the light sweeps once across the card: the streak travels from −30% to rest at 32% over 1400ms (expo out).
2. With a fine pointer, moving anywhere over the hero moves the streak to `px × 140% − 20%` of the card width and tilts the card `rotateY((px − .5) × 14deg)` and `rotateX((.5 − py) × 10deg)`, where px/py are the pointer's position across the card stage. The card's resting `rotateZ(-6deg)` stays. Transforms ease over 600ms so the card trails the hand slightly.
3. Leaving the hero returns the tilt to 0 and the streak to 32%.
4. Clicking the card (or Enter/Space on it) replays the load sweep. Touch: a drag across the hero moves the light the same way.
5. "Apply for Reserve" (verdigris, the one filled button above the fold) and the nav's outlined "Apply" both go to the application block; "See every fee" jumps to the fee table.
6. Hover: the filled button lightens to `--accent-hi`; outlined button border goes from `--ink-3` to `--ink`; nav links go from `--ink-2` to `--ink`.
7. Below the fold: numerals row, "Every fee, before you apply." with six rows, the application block, and a two-paragraph legal footer.

## Tokens

```css
:root {
  /* ground */
  --bg: #0F1012;          /* page */
  --bg-2: #16171A;        /* apply block */
  --line: #2A2B2F;        /* hairlines */
  --ink: #EDE8DF;         /* warm ivory */
  --ink-2: #B3ADA3;       /* lede, labels (8.4:1) */
  --ink-3: #99938A;       /* legal, outlined border (6.1:1) */

  /* the one accent: verdigris */
  --accent: #7FB8A4;
  --accent-hi: #97CBB8;   /* hover */
  --accent-ink: #0C1A15;  /* text on accent (8.9:1) */

  /* titanium */
  --ti-1: #8E9296;        /* mid */
  --ti-2: #C9CCCE;        /* top-left highlight */
  --ti-3: #5E6266;        /* bottom-right falloff */
  --ti-ink: #1C1E21;      /* engraved print (≥ 5.8:1 on the darkest metal) */
  --edge-1: #3B3E41;      /* 3px card thickness */
  --edge-2: #24262A;

  /* type */
  --display: "Bodoni Moda", Didot, serif;   /* opsz axis 6..96 */
  --sans: "Josefin Sans", system-ui, sans-serif;
  --fs-h1: clamp(44px, 6.4vw, 80px);
  --fs-num: clamp(40px, 4.6vw, 64px);
  --fs-h2: clamp(34px, 4vw, 52px);

  /* space and shape */
  --pad: 56px;            /* 16px under 640 */
  --r: 4px;               /* buttons */
  --r-card: 22px;         /* 14px under 640 */
  --card-w: 540px;

  /* motion */
  --t-fast: 180ms;
  --t-tilt: 600ms;
  --t-sweep: 1400ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role             | Family       | Size        | Weight | Line-height | Tracking | Case      |
|------------------|--------------|------------:|-------:|------------:|---------:|-----------|
| Headline         | Bodoni Moda  | 80px        | 400 (second sentence italic) | .98 | −0.025em | sentence |
| Numerals         | Bodoni Moda  | 64px (× at .62em) | 400 | 1        | −0.02em  | figures   |
| Section heads    | Bodoni Moda  | 52px        | 400    | 1.05        | −0.02em  | sentence  |
| Table values     | Bodoni Moda  | 19px        | 500    | 1.35        | 0        | sentence  |
| Card tier        | Bodoni Moda  | 22px italic | 400    | 1           | 0        | Title     |
| Body, lede       | Josefin Sans | 17px / 18px | 400    | 1.55        | 0        | sentence  |
| Eyebrow          | Josefin Sans | 13px        | 600    | 1           | +0.32em  | UPPERCASE |
| Wordmark         | Josefin Sans | 15px (card 22px) | 700 | 1          | +0.42em / +0.46em | UPPERCASE |
| Buttons          | Josefin Sans | 14–15px     | 600–700 | 1          | +0.12–0.14em | UPPERCASE |
| Card name        | Josefin Sans | 14px        | 600    | 1           | +0.24em  | UPPERCASE |
| Legal            | Josefin Sans | 13px        | 400    | 1.6         | 0        | sentence  |

Josefin's caps sit low; add 2–3px top padding to every uppercase button so the label centres optically. All figures use `lining-nums tabular-nums`.

## Implementation notes

**Brushed metal in three layers.** The streak is a soft linear band whose centre is a custom property; under it a 3px repeating line gives the grain; under that the titanium falloff:

```css
.card {
  background:
    linear-gradient(100deg, transparent calc(var(--x) - 22%), rgba(255,255,255,.12) calc(var(--x) - 8%),
      rgba(255,255,255,.55) var(--x), rgba(255,255,255,.12) calc(var(--x) + 8%), transparent calc(var(--x) + 22%)),
    repeating-linear-gradient(0deg, rgba(255,255,255,.07) 0 1px, rgba(0,0,0,.05) 1px 2px, transparent 2px 3px),
    linear-gradient(160deg, var(--ti-2) 0%, var(--ti-1) 46%, #A9ACAF 70%, var(--ti-3) 100%);
  box-shadow: 0 1px 0 rgba(255,255,255,.6) inset, 0 3px 0 var(--edge-1), 0 4px 0 var(--edge-2),
              0 40px 60px -30px rgba(0,0,0,.9);
}
```

**Animate the streak by registering the property,** otherwise a custom property cannot interpolate:

```css
@property --x { syntax: "<percentage>"; inherits: true; initial-value: 32%; }
.card.sweep { animation: sweep var(--t-sweep) var(--ease-out); }
@keyframes sweep { from { --x: -30%; } }
```

**Map the pointer once, on the hero, not the card,** so the light keeps moving as the hand approaches:

```js
hero.addEventListener('pointermove', e => {
  const r = stage.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
  card.style.setProperty('--x', (px * 140 - 20).toFixed(1) + '%');
  card.style.setProperty('--ry', ((px - .5) * 14).toFixed(2) + 'deg');
  card.style.setProperty('--rx', ((.5 - py) * 10).toFixed(2) + 'deg');
});
```

Common mistakes: a gold or champagne accent (it turns into every other premium card page); putting the glare on a pseudo-element with `mix-blend-mode` (it bleeds onto the page behind rounded corners); white `#FFF` type on the black, which vibrates against Bodoni's hairlines.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
