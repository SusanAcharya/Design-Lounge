---
title: "Anime cel design language kit"
summary: "A cel-shaded kit for a run-streak app: 3px ink outlines, two-tone hard shading, speed-line and halftone grounds, impact bursts, stickers, buttons that squash."
platform: web
type: style
category: design-language
tags: [anime, cel-shading, kit, stickers, illustration]
styles: [playful, retro]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-28
palette: ["#FFF7E8", "#1B1530", "#FFD23F", "#FF4D5E", "#4FC3EE"]
fonts: ["Bungee", "Chakra Petch"]
related: [hero-manga-panels, cartoon-sticker-landing, pixel-arcade-style]
---

# Anime cel design language kit

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A kit sheet for "Comet Club", an invented daily-run streak app, drawn in the visual language of Saturday-morning cel animation. Every shape has a 3px ink outline (`#1B1530`, never pure black), every colour comes as a pair (base and one shadow tone) applied as a hard-edged inset with zero blur, and the grounds are speed lines and halftone dots built from CSS gradients. The mascot "Pip" is an original comet made of a circle, three tail paths, two oval eyes and a smile: simple shapes, no borrowed character. The detail worth copying: cel shading is one `box-shadow: inset -14px -12px 0 <shadow>` on a circle, and the same rule (inset bottom shadow, hard offset drop) shades the buttons, so illustration and UI read as one drawing.

## Reference behaviour

1. Initial state at 1280 × 800: a 56px white header with a 3px ink bottom border; the sheet is a 12-column grid with 16px gaps. Row one: the composition (7 columns, 440px tall, sky blue) and the type specimen (5 columns).
2. Composition: a conic speed-line burst radiates from 72% / 48%, cleared to flat sky in a 22% circle behind Pip. Pip bobs 4% up and rotates -8° → -5° over 2.4s, alternating, and blinks (eyes `scaleY(.1)`) at 97% of a 4.2s cycle. A yellow 16-point burst reads "47!". A sticker "Best: 61 days" sits bottom right of the stage.
3. Copy column: a pill eyebrow "Episode 47 · Tuesday run", the H1 "Don't break the tail!" (ink fill, 10px white stroke painted behind, 5px ink drop shadow), a speech-bubble paragraph with its tail pointing up toward Pip, and two buttons.
4. Click START RUN: the button squashes (`scale(1.14, .82)` at 30%, `scale(.94, 1.08)` at 60%, back to 1 at 320ms, overshoot spring) and its label toggles to "RUNNING 00:01". Click again to toggle back.
5. Hover any button: it lifts `translate(-2px, -2px)` and its hard shadow grows from 4px to 6px. Press (`:active`): it drops `translate(3px, 3px) scale(1.04, .9)`, the shadow shrinks to 1px and the inner shade to 4px, in 90ms.
6. The controls panel: four buttons (LOG RUN red, +1 DAY yellow, Share white, Locked disabled with a dashed border), two fields, a toggle, three stickers. Clicking LOG RUN, +1 DAY or Share plays the same squash.
7. Click the toggle: the knob springs 28px over 260ms and the track turns mint; `aria-checked` flips.
8. Focus a field: a 4px sky hard shadow appears bottom right of the 3px ink border.
9. Row three: cel shading (four shaded balls and four base/shadow swatches); row four: three background tiles; row five: four grammar cards (two filled yellow and mint).

## Structure

```
1280 wide (sheet scrolls; first 800px = header + row 1 + top of row 2)
+--------------------------------------------------------------------------------+
| (o) COMET CLUB  CEL KIT 2.0                Type Cel Backgrounds Controls (3px ink · 2 tones) | 56
+------------------------------------------------+-------------------------------+
| (episode pill)              speed lines  [47!] | [TYPE]                        |
| DON'T                         ~~~~( Pip )      | AA!  (88px Bungee)            |
| BREAK                                          | Bungee 40   DAY 47            |
| THE TAIL!   (68px Bungee)                      | Bungee 18   START RUN         |
| +- bubble paragraph ---^--+                    | Chakra 700/20 ...             |
| [START RUN] [Snooze 1h]      (Best: 61 days)   | (bubble specimen)             |
+-----------------------------+------------------+-------------------------------+
| [CEL SHADING] 4 balls       | [CONTROLS AND STICKERS] buttons / fields / toggle + stickers |
| 4 swatch pairs              |                                                  |
+-----------------------------+--------------------------------------------------+
| [BACKGROUNDS] speed burst | halftone | speed lines                             |
+--------------------------------------------------------------------------------+
| Ink 3px | Two tones | Squash | Invent it                                       |
+--------------------------------------------------------------------------------+
spans: hero 7 / type 5 / cel 5 / controls 7 / backgrounds 12 / rules 12 (4 cards)
```

- `<header class="top">`: `.mark` (28px cel-shaded circle), brand (Bungee 18) with kit name (Chakra 600 13), `<nav>`, `.ver` pill.
- `<main class="sheet">`: grid `repeat(12, minmax(0,1fr))`, gap 16px, padding 16px.
- Every `<section class="cell">`: white, 3px ink border, 14px radius, `4px 4px 0` ink shadow, 20px padding. Labels are `<h2 class="lbl">`: Bungee 13 on an ink tab, 6px radius, rotated -1.5°.
- Hero: `.speed` (absolute, conic gradient), `.copy` (flex column, justify end), `.stage` holding an SVG burst and the Pip SVG (viewBox 240 × 200), `.sticker.streak`.
- Controls: `<button class="btn">` variants, `<label class="fld">` with `<input>`, `<button class="tog" role="switch">`, `.sticker` spans.

## Tokens

```css
:root {
  /* ground and ink */
  --paper: #fff7e8;     /* sheet ground */
  --white: #ffffff;     /* cells, bubbles, stroke behind display type */
  --ink: #1b1530;       /* every outline, text, hard shadow */
  --ink-2: #4a4160;     /* captions, scale labels */
  --off: #ece6d8;       /* disabled fill, toggle off */
  --field-shade: #f1ead9; /* 4px inset top shade inside fields */

  /* cel pairs: base / shadow */
  --sun: #ffd23f;  --sun-sh: #e3a600;
  --red: #ff4d5e;  --red-sh: #c42a44;
  --sky: #4fc3ee;  --sky-sh: #2385b8;
  --mint: #5fe0a8; --mint-sh: #22a874;
  --blush: #ff8fa0;

  /* type */
  --disp: "Bungee", Impact, sans-serif;
  --body: "Chakra Petch", system-ui, sans-serif;
  --fs-h1: clamp(40px, 5.2vw, 68px); --fs-aa: 88px; --fs-d40: 34px;
  --fs-btn: 16px; --fs-body: 15px; --fs-label: 13px; --fs-cap: 12px;

  /* line and shape */
  --o: 3px;                          /* outline */
  --hard: 4px 4px 0 var(--ink);      /* resting drop */
  --hard-lift: 6px 6px 0 var(--ink); /* hover drop */
  --shade-btn: inset 0 -7px 0;       /* + shadow tone */
  --shade-ball: inset -14px -12px 0; /* + shadow tone */
  --r: 14px; --r-btn: 12px; --r-field: 10px; --r-pill: 99px;
  --btn-h: 52px; --field-h: 46px; --tog: 64px 36px;
  --sheet-gap: 16px;

  /* motion */
  --t-press: 90ms;
  --t-pop: 320ms;
  --t-tog: 260ms;
  --bob: 2.4s; --blink: 4.2s;
  --spring: cubic-bezier(.34, 1.56, .64, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role | Family | Size / line | Weight | Treatment |
|---|---|---|---|---|
| H1 on art | Bungee | clamp(40px, 5.2vw, 68px) / 0.92 | 400 | ink fill, `-webkit-text-stroke: 10px #fff` with `paint-order: stroke fill`, `drop-shadow(5px 5px 0 ink)` |
| Specimen "Aa!" | Bungee | 88 / 1 | 400 | ink fill, 10px `--sun` stroke behind, `7px 7px 0 --red` text shadow |
| Display numeral | Bungee | 34 / 1 | 400 | ink |
| Buttons, section tabs | Bungee | 16 / 1 (tabs 13) | 400 | 0.02em tracking |
| Big body | Chakra Petch | 20 | 700 | |
| Body, bubbles | Chakra Petch | 15 / 1.45 (bubbles 17 / 1.3) | 500 / 700 | |
| Eyebrow, labels | Chakra Petch | 12–13 | 700 | uppercase, 0.08em |

Never put white or yellow text straight on sky or red: the fill stays ink and the colour lives in the stroke behind it.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
|---|---|---|---|---|---|
| Pip bob | load, infinite alternate | transform | translate(-50%,-50%) rotate(-8°) → translate(-50%,-54%) rotate(-5°) | 2.4s `--ease` | static |
| Pip blink | infinite | eyes `scaleY` | 1 → 0.1 → 1 at 94–100% | 4.2s | static |
| Button hover | pointer | transform, shadow | 0 → (-2px, -2px), 4px → 6px drop | 90ms `--ease` | 1ms |
| Button press | `:active` | transform, shadow | → translate(3px,3px) scale(1.04,.9), drop 1px, inner shade 4px | 90ms | 1ms |
| Squash pop | click | transform keyframes | 1 → (1.14,.82) → (.94,1.08) → 1 | 320ms `--spring` | none |
| Toggle knob | click | translateX | 0 → 28px | 260ms `--spring` | 1ms |

## States

- **Button rest:** base fill, 3px ink border, 12px radius, `inset 0 -7px 0 <shadow tone>` plus `4px 4px 0 ink`. **Hover:** lifted 2px with a 6px drop. **Active:** pressed into the page (drop 1px, shade 4px, squashed). **Disabled:** `--off` fill, `--ink-2` text, dashed ink border, no shadow, `cursor: not-allowed`.
- **Focus-visible:** 3px ink outline at 3px offset plus a 6px `--sun` ring (`box-shadow: 0 0 0 6px`).
- **Field rest:** white, 3px ink border, 10px radius, 4px inset top shade. **Focus:** adds `4px 4px 0 --sky`.
- **Toggle off:** `--off` track, knob left. **On:** `--mint` track, knob 28px right.
- **Sticker:** pill fill (sun, mint or sky), 3px ink border, then a 4px white ring, a 3px ink ring and a `5px 6px` ink drop, all one `box-shadow`; rotated -4°, 3° or -2°.
- **START RUN:** label toggles between "START RUN" and "RUNNING 00:01".
- **Nav link hover:** 3px `--red` underline.

## Accessibility

- The stage (Pip, burst) is `aria-hidden`; the hero section has an `aria-label` that names the composition. The H1 and paragraph carry the meaning.
- Every section label is an `<h2>`; cells use `aria-labelledby`.
- The toggle is `<button role="switch" aria-checked aria-label="Morning reminder">`; Space and Enter toggle.
- Fields have visible labels and `aria-label`s; the placeholder `e.g. TAIL-88` is `--ink-2`-level grey on white.
- Contrast: ink on white 17.6:1, on paper 16.5:1, on sun 12.2:1, on red 5.4:1, on sky 8.7:1, on mint 10.6:1; `--ink-2` on white 9.5:1, on `--off` 7.6:1. All button text is ink, so every fill passes AA.
- Controls keep 3:1 edges through the 3px ink border on every input and the toggle.
- Hit targets: buttons 52px tall, fields 46px, toggle 64 × 36.

## Responsive rules

- ≥ 1280: spans as drawn.
- 1000–1279: same spans; H1 shrinks with its clamp.
- < 1000: every cell spans 12; grammar cards 2 × 2.
- < 640: header nav and version pill hide; sheet padding 12px, gap 14px; the hero becomes two rows (stage 300px on top, copy below) and the speed-line focus moves to 50% / 26%; H1 36px with an 8px stroke; the streak sticker moves under Pip (top 244px, left 4%); background tiles stack; swatches 2 × 2; grammar cards stack; scale rows wrap. At 390 nothing scrolls sideways.

## Acceptance checklist

**Always**
- [ ] Every shape, cell, button, field and sticker has a 3px ink outline in `#1B1530`; no pure black anywhere.
- [ ] Shading uses one shadow tone per colour as a zero-blur inset; no gradients on any shaded object.
- [ ] Display type on art is ink filled with a light stroke painted behind it (`paint-order: stroke fill`); no light text sits directly on a saturated fill.
- [ ] Buttons lift on hover, press on active within 90ms, and play the 320ms squash on click.
- [ ] Speed lines and halftone are CSS gradients (conic, radial dot, repeating linear), no images.
- [ ] The mascot is an original character built from basic SVG shapes, and it is `aria-hidden`.
- [ ] Focus shows a 3px ink outline plus a 6px yellow ring.
- [ ] Reduced motion stops the bob, blink and squash and keeps every state.
- [ ] At 390 wide the hero stacks and nothing scrolls sideways.

**This demo**
- [ ] H1 reads "Don't break the tail!"; the burst reads "47!"; the sticker reads "Best: 61 days".
- [ ] START RUN toggles to "RUNNING 00:01".
- [ ] Four cel pairs: `#FFD23F/#E3A600`, `#FF4D5E/#C42A44`, `#4FC3EE/#2385B8`, `#5FE0A8/#22A874`.
- [ ] Grammar cards read Ink 3px, Two tones, Squash, Invent it.

## Implementation notes

**Cel shading on any round thing** is one inset shadow and a highlight pseudo-element:

```css
.ball { width: 64px; height: 64px; border-radius: 50%; border: 3px solid var(--ink);
        background: var(--sun); box-shadow: inset -14px -12px 0 var(--sun-sh); position: relative; }
.ball::after { content: ""; position: absolute; width: 12px; height: 8px; border-radius: 50%;
               background: #fff; left: 14px; top: 12px; transform: rotate(-30deg); }
```

**The squash.** Restart the animation on every click by removing the class and forcing a reflow; remove it on `animationend` so `:hover` and `:active` transforms work again.

```css
.btn.pop { animation: pop 320ms cubic-bezier(.34, 1.56, .64, 1); }
@keyframes pop { 0% { transform: scale(1) } 30% { transform: scale(1.14, .82) }
                 60% { transform: scale(.94, 1.08) } 100% { transform: scale(1) } }
```

```js
btn.addEventListener('click', () => { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); });
btn.addEventListener('animationend', () => btn.classList.remove('pop'));
```

**Speed lines with a calm centre** and a **sticker in one box-shadow**:

```css
.speed { position: absolute; inset: 0;
  background: repeating-conic-gradient(from 0deg at 72% 48%, rgba(255,255,255,.55) 0 2deg, transparent 2deg 7deg); }
.speed::after { content: ""; position: absolute; inset: 0;
  background: radial-gradient(circle at 72% 48%, var(--sky) 0 22%, transparent 23%); }
.sticker { border: 3px solid var(--ink); border-radius: 99px;
  box-shadow: 0 0 0 4px #fff, 0 0 0 7px var(--ink), 5px 6px 0 7px var(--ink); transform: rotate(-4deg); }
```

Common mistakes: white headline text with `-webkit-text-stroke` and no `paint-order` (the stroke eats half the glyph and the white fill fails contrast on sky); a `text-shadow` in a third colour behind stroked type (anti-aliasing between three inks reads as low contrast in pixel checks; use `filter: drop-shadow` in ink); bouncing everything (only presses squash; the mascot only bobs).
