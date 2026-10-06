<!-- Design Lounge Nº 364 · "Preloader counter intro" · www.designlounge.live -->

# Preloader counter intro

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The first two seconds of a site for a fictional print and zine fair, Grainroom, in Leeds. A black screen counts from 0 to 100 in huge condensed numerals while four small print swatches (riso, letterpress, screen, zines) pop in one by one. At 100 the number turns acid green, holds for 150ms, and the whole loader splits along its middle: the top half slides up, the bottom half slides down, cutting the number in two. Behind it, the cream hero is already laid out, and the headline "Ink on everything" rises letter by letter. The detail worth copying is that the loader is drawn twice, once in each half, so the split cuts straight through the number instead of sliding two empty panels.

This is not `logo-draw-intro`. That piece draws an SVG mark. This one is a counter with image blocks, and its rules about honesty matter more than its looks.

### Rules for a real product

1. Never run a loader longer than the real load. The counter shows real progress. It may lag behind real progress; it must never run ahead of it or keep going after the page is ready.
2. Cap it at 2000ms. At 2s, reveal the hero whatever is still loading. Slow images can fade in later.
3. If everything is ready in under 300ms, skip the loader. Show the hero with its letter entrance only.
4. Skip it on repeat visits. In production, set `sessionStorage.setItem('intro-seen', '1')` after the first run and check it before showing the loader. The demo does not do this: it runs in a sandbox where storage throws, and it must replay for viewers.
5. Reduced motion: no count, no pop, no split. Show 100 for 300ms, fade the loader out over 200ms.

## Structure

```
1280 × 800, loader on top (z 10)
┌──────────────────────────────────────────────────────────────────────┐
│ GRAINROOM / FAIR GUIDE 2026                               14—16.11.26 │ labels, mono 12, 28px in
│    ┌──┐                                                               │
│    │b1│      ┌──┐                                    ┌──────────┐ %   │ blocks left, tilted
│    └──┘      │b2│                                    │  8   0   │     │ counter right, 420px
│- - - - - - - - - - - - - - - - seam at 50% - - - - - │          │- - -│ ← halves split here
│     ┌──┐         ┌──┐                                └──────────┘     │
│     │b3│         │b4│                                                 │
│ ════════════════════════════════════════════════════════════════════ │ progress 2px, 64 from bottom
│ LEEDS CORN EXCHANGE                                    LOADING TABLES │
└──────────────────────────────────────────────────────────────────────┘

hero underneath (cream)
┌──────────────────────────────────────────────────────────────────────┐
│ GRAINROOM                     EXHIBITORS  PROGRAMME  VISIT [DAY PASS £12]│ header 64, 2px rule
│ INDEPENDENT PRINT & ZINE FAIR · NO. 07              120 TABLES · 3 DAYS │ mono 13
│ INK [ON]                     ← 236px Anton, "ON" on an acid block       │
│ EVERYTHING                                                              │
│ ──────────────── ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                   │ row 3fr + 4 × 2fr
│ 14—16 NOV 2026   │ riso │ │  A   │ │screen│ │zines │                   │ art 128 tall
│ LEEDS CORN EXCH. └──────┘ └──────┘ └──────┘ └──────┘                   │
│                  RISO 32 TABLES  LETTERPRESS 18  SCREEN 24  ZINES 46    │
│[↻ REPLAY INTRO]                                                         │ fixed, 20 from corner
└──────────────────────────────────────────────────────────────────────┘
```

- `.loader` is `position: fixed; inset: 0` with `role="progressbar"`, `aria-label="Loading the fair guide"`, `aria-valuemin="0"`, `aria-valuemax="100"`. It holds `.half.top` and `.half.bot` (the second is `aria-hidden`).
- Each half is 50% tall with `overflow: hidden`. Inside each is a `.stage` 200% tall: anchored to the top in the top half, to the bottom in the bottom half. Both stages hold the same content, cloned from one `<template>`.
- Stage content: four `.lbl` labels, four `.pop` blocks, `.num` (three `.d` digit slots plus a `%` superscript), `.bar` with an inner `<i>`.
- `.site` holds `<header>` (logo, nav, pass link) and `<main>`: kicker, `<h1 aria-label="Ink on everything">` with one `.w` per word and one `.ch` per letter (`aria-hidden`), and `.row` with the date block and four `<figure>` swatches.
- The Replay `<button>` sits outside `.site` so it is not made inert.
- The four swatch arts are CSS only, used both in the loader (as `.pop`) and in the hero row. Riso: a black circle and an acid circle overlapping with multiply. Letterpress: a 112px Anton "A" on `--cream-2`. Screen: a 12px black halftone grid on acid. Zines: 135 degree black stripes on cream with a tilted acid card.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Delay |
| --- | --- | --- | --- | --- | --- | --- |
| Counter value | load | text | 0 → 100 | 1800ms | ease-in-out cubic, per frame | 0 |
| Progress line | load | scaleX | 0 → 1 | follows the value | same | 0 |
| Block 1 to 4 | value ≥ 18, 42, 66, 88 | opacity / scale | 0, .6 → 1, 1 | 200ms / 360ms | `--ease` / `--ease-pop` | at threshold |
| Counter colour | value = 100 | color | cream → acid | instant | — | 1800ms |
| Top half | split | translateY | 0 → -100% | 700ms | `--ease-split` | 1950ms |
| Bottom half | split | translateY | 0 → 100% | 700ms | `--ease-split` | 1950ms |
| Headline letter | split | translateY | 105% → 0 | 650ms | `--ease-out` | 150ms + i × 30ms after split |
| Kicker, row | split | opacity, translateY | 0, 12px → 1, 0 | 400ms / 500ms | `--ease` / `--ease-out` | 500ms after split |
| Loader | 2650ms | hidden | shown → gone | instant | — | — |
| Pass, Replay | hover | background | ink or cream → acid | 160ms | `--ease` | 0 |

Absolute timeline:

| t (ms) | Event |
| ---: | --- |
| 0 | counter 0 |
| ≈ 640 | value 18, riso block pops |
| ≈ 850 | value 42, letterpress block pops |
| ≈ 1010 | value 66, screen block pops |
| ≈ 1240 | value 88, zines block pops |
| 1800 | 100, counter turns acid |
| 1950 | split starts, hero `.in` |
| 2100 | first letter "I" starts rising |
| 2450 | kicker and row start |
| 2520 | last letter "G" starts |
| 2650 | loader hidden, Replay shown |
| 3170 | last letter lands |

Reduced motion: value 100 at t = 0, blocks visible, loader fades out from 300ms to 500ms, no split, no letter motion.

## States

- Loading: `body.loading`, `main[inert]`, Replay hidden, `aria-valuenow` updated in steps of 25.
- Full: `.loader.full`, counter acid.
- Split: `.loader.split`, halves moving.
- Done: loader `hidden`, hero `.site.in`, Replay visible.
- Pass button hover: background `--acid`, text `--ink`.
- Replay hover: background `--acid`.
- Nav hover: 2px underline at 4px offset.
- Focus-visible: `outline: 2px solid --ink; outline-offset: 3px` plus a 5px acid ring (`box-shadow: 0 0 0 5px --acid`), so focus shows on cream and on acid.
- Error: if the real load fails, reveal at the 2s cap anyway. Never leave the counter stuck at 99.

## Accessibility

- The loader is a `progressbar` with a label. `aria-valuenow` changes only at 0, 25, 50, 75, 100, not 60 times a second.
- The bottom half and the number are `aria-hidden`; screen readers get one progress bar, not two.
- `<main>` is `inert` while the loader is up, so Tab cannot reach links hidden behind it.
- The headline `<h1>` has `aria-label="Ink on everything"`; the letter spans are `aria-hidden`. Screen readers hear the words, not single letters.
- A `role="status"` line says "Fair guide loaded" when the hero is ready.
- Replay is a `<button>`, 40px tall, with an `aria-hidden` icon and the visible text "Replay intro". Focus returns to it after a replay.
- Contrast: ink on cream 15.5:1. `--ink-2` on cream 7.4:1. Ink on acid 14.5:1. Cream on ink 15.5:1. Acid on ink 14.5:1. Acid is never text on cream.
- Reduced motion: no counting, no pop, no split. A 200ms fade.

## Responsive rules

- ≥ 1280: as specified. Counter 420px. Headline 236px.
- 1024 to 1279: the counter follows 34vw and the headline 18.4vw. Blocks keep their percent positions.
- 768 to 1023: the bottom row becomes four swatch columns, with the date block above them as three columns across.
- Under 768: `--pad: 20px`. Nav hidden, pass link stays. The page scrolls. Kicker stacks into two lines. Headline clamp(56px, 19vw, 120px), so "EVERYTHING" fits 350px. Swatches in two columns, 112px tall. `<main>` gets 88px bottom padding so Replay never covers a caption. Counter clamp(150px, 42vw, 220px). Blocks move to the corners around the number.
- The counter is right-aligned at every size, so the empty hundreds slot sits on the left edge where it does not show.
- Never overflow sideways. Long words get a smaller headline, not a scrollbar.

## Acceptance checklist

### Always

- [ ] Count plus hold is never longer than 2000ms. Production never runs longer than the real load.
- [ ] Production skips the loader on repeat visits with a `sessionStorage` flag, and skips it when the page is ready in under 300ms. The sandbox demo uses no storage.
- [ ] Digits sit in fixed-width slots; the number never jumps sideways.
- [ ] The loader content exists in both halves, so the split cuts through the number.
- [ ] The halves move with `transform` only, top up and bottom down, 700ms.
- [ ] The hero is laid out under the loader before the split; nothing reflows on reveal.
- [ ] Headline letters rise inside word clips with a fixed stagger.
- [ ] `<main>` is inert during the intro and focusable after.
- [ ] Replay cancels every timer and frame before restarting.
- [ ] Reduced motion shows 100 and fades out in 500ms total.

### This demo

- [ ] Counter runs 0 to 100 over 1800ms in Anton, cream, turning `#c6f432` at 100.
- [ ] Blocks pop at 18, 42, 66 and 88.
- [ ] Split at 1950ms; loader gone at 2650ms.
- [ ] Headline reads "INK ON EVERYTHING" with "ON" on an acid block.
- [ ] Date "14—16 Nov 2026", venue "Leeds Corn Exchange", pass "Day pass £12".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. t = 0 (load): the loader covers the viewport. Both halves are `#141310`. Counter reads "0" at the right edge. The progress line is empty. The four blocks are hidden. Labels sit in the corners: "Grainroom / Fair guide 2026" top-left, "14—16.11.26" top-right, "Leeds Corn Exchange" bottom-left, "Loading tables" bottom-right in acid.
2. 0 to 1800ms: the value goes from 0 to 100 with ease-in-out cubic, read every animation frame and rounded. The digits sit in three fixed-width slots, so the number never shifts sideways. The progress line's `scaleX` follows value / 100.
3. Blocks pop as the value crosses 18, 42, 66 and 88: opacity 0 → 1 over 200ms, `scale(.6)` → `scale(1)` over 360ms with a small overshoot, each keeping its own tilt (-4, 5, 3, -6 degrees).
4. 1800ms: the value is 100. The counter turns `--acid`.
5. 1950ms: the halves split. Top half `translateY(-100%)`, bottom half `translateY(100%)`, 700ms, `cubic-bezier(.76,0,.24,1)`. The same moment, the hero gets `.in`.
6. Hero letters: 15 letters across three words, each rising from `translateY(105%)` inside its word's clip, 650ms, `cubic-bezier(.16,1,.3,1)`, delay `150ms + i × 30ms`. The last letter starts 570ms after the split and lands at 1220ms after the split.
7. Kicker line and bottom row: opacity 0 → 1 over 400ms, `translateY(12px)` → 0 over 500ms, delay 500ms after the split.
8. 2650ms: the loader is set to `hidden`. `<main>` loses `inert`. "Replay intro" appears at bottom-left, 20px from both edges. Bottom-left keeps it clear of host overlays and chat widgets that live bottom-right. A status line says "Fair guide loaded".
9. Replay: click "Replay intro". Every timer and frame is cancelled, the counter resets to 0, the hero letters snap back down with no transition, and the sequence runs again from step 1. When it ends, focus returns to the Replay button.
10. During the intro, the page under the loader is `inert`, and the Replay button is `visibility: hidden`.
11. Reduced motion: value set to 100 at once, all four blocks shown, counter acid. After 300ms the loader fades to 0 over 200ms. No split. Hero text is in place with no movement.

## Tokens

```css
:root {
  /* colour: warm cream, near-black, one acid green */
  --cream: #f1eadb;     /* hero ground, loader type, block borders */
  --cream-2: #e6dcc8;   /* letterpress swatch */
  --ink: #141310;       /* loader ground, all hero type, rules */
  --ink-2: #4f4a40;     /* small meta on cream */
  --acid: #c6f432;      /* counter at 100, %, progress, "ON" block, swatches, hover */
  --track: #3a3730;     /* empty progress line */

  /* type */
  --display: "Anton", Impact, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;

  /* layout */
  --pad: 40px;          /* 20px under 768 */
  --head-h: 64px;
  --rule: 2px;

  /* timing */
  --count-dur: 1800ms;
  --hold: 150ms;
  --t-split: 700ms;
  --cap: 2000ms;        /* count + hold never passes this */
  --t-letter: 650ms;
  --letter-step: 30ms;
  --letter-delay: 150ms;
  --block-delay: 500ms;

  /* easing */
  --ease-split: cubic-bezier(.76, 0, .24, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease-pop: cubic-bezier(.34, 1.56, .64, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Counter | Anton | clamp(160px, 34vw, 420px) | 400 | 1 | 0, slots 0.47em wide | numerals |
| Percent | JetBrains Mono | clamp(18px, 2.6vw, 32px) | 700 | 1 | 0 | symbol |
| Loader label | JetBrains Mono | 12px | 400 | 1.5 | +0.08em | UPPERCASE |
| Logo | Anton | 30px | 400 | 1 | +0.01em | UPPERCASE |
| Nav link | JetBrains Mono | 13px | 400 | 1.5 | +0.06em | UPPERCASE |
| Pass button | JetBrains Mono | 13px | 700 | 40px box | +0.04em | UPPERCASE |
| Kicker | JetBrains Mono | 13px | 400 | 1.5 | +0.06em | UPPERCASE |
| Headline | Anton | clamp(72px, 18.4vw, 236px) | 400 | 0.86 | -0.005em | UPPERCASE |
| Date, venue | Anton | 34px | 400 | 1 | 0 | UPPERCASE |
| Meta, caption | JetBrains Mono | 12px | 400 / 500 | 1.5 | +0.04em | UPPERCASE |
| Replay | JetBrains Mono | 12px | 700 | 40px box | +0.06em | UPPERCASE |

Anton has no true tabular figures, so give every digit its own fixed-width box. Keep `font-variant-numeric: tabular-nums` on as well, for fonts that do.

## Implementation notes

**1. One stage, drawn twice.** Each half clips a stage twice its height. The top half shows the stage's top; the bottom half shows its bottom. Together they look like one screen.

```css
.half { position: absolute; left: 0; right: 0; height: 50%; overflow: hidden; background: var(--ink);
  transition: transform var(--t-split) var(--ease-split); }
.half.top { top: 0; } .half.bot { bottom: 0; }
.half .stage { position: absolute; left: 0; right: 0; height: 200%; }
.half.top .stage { top: 0; } .half.bot .stage { bottom: 0; }
.split .half.top { transform: translateY(-100%); }
.split .half.bot { transform: translateY(100%); }
```

```js
loader.querySelectorAll('.stage').forEach(s => s.appendChild(tpl.content.cloneNode(true)));
```

Update both copies every frame. Cache the digit nodes once.

**2. The counter, honest version.** The demo runs on time only. In production, cap the shown value by real progress and by the 2s limit.

```js
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
function tick(start, now) {
  const t = Math.min(1, (now - start) / 1800);
  const shown = Math.round(100 * Math.min(ease(t), realProgress()));   // demo: realProgress = () => 1
  set(shown);
  if (shown < 100 && now - start < 2000) raf = requestAnimationFrame(n => tick(start, n));
  else { set(100); loader.classList.add('full'); later(reveal, 150); }
}
function set(v) {
  const s = String(v).padStart(3, ' ');
  digits.forEach(d => d.forEach((el, k) => { el.textContent = s[k] === ' ' ? '' : s[k]; }));
}
```

`realProgress()` can count loaded images and fonts (`document.fonts.ready`, `img.decode()`) out of the total. If it stays at 0.4 when the 2s cap hits, reveal anyway.

**3. Skip on repeat visits (production only).**

```js
let seen = false;
try { seen = sessionStorage.getItem('intro-seen') === '1'; } catch (_) {}
if (seen || rm.matches) showHeroNow(); else play();
try { sessionStorage.setItem('intro-seen', '1'); } catch (_) {}
```

Wrap storage in `try`: private modes and sandboxed frames throw. The Lounge demo leaves this out on purpose so it replays every time.

Common mistakes:

- A loader that runs a fixed 3 or 4 seconds on a page that was ready in 200ms.
- Splitting two empty black panels while the number fades out separately. The number must be cut by the seam.
- Proportional digits. "111" is narrower than "888" and the counter wobbles.
- Leaving the page under the loader focusable. Keyboard users tab into links they cannot see.
- Announcing every value to screen readers.
- Forgetting to cancel the rAF on Replay, so two counters fight over the same digits.
- Showing the loader on every internal page change. It is a first-visit intro only.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
