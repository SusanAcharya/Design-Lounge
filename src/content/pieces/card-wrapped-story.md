---
title: "Year-in-review story cards"
summary: "Six tap-through year-in-review story cards for a reading app: segmented progress, giant Anton numbers, a top five, a reading-hours ring and a share card with replay."
platform: mobile-app
type: animation
category: cards
tags: [stories, year-in-review, stats, share, onboarding]
styles: [kinetic, playful, bauhaus]
motion: rich
difficulty: 2
featured: false
published: 2026-10-28
palette: ["#E8442E", "#0F5B3E", "#F5C518", "#141210", "#1D3FD8"]
fonts: ["Anton", "Poiret One"]
related: [card-music-playlist, ios-onboarding-carousel]
---

# Year-in-review story cards

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The end-of-year recap format, as full-screen story cards, for an invented reading app called Marginalia ("Year in pages"). Six cards play in order, each on its own flat colour field: the year, a giant page count with a monthly bar chart, a 41-day streak drawn as a calendar, the top five books, a "night owl" reading-hours ring, and a share card. A segmented progress bar at the top fills for 5.2s per card and advances automatically; tap the right 70% to skip, the left 30% to go back, hold to pause. The detail worth copying is how much it does with two typefaces and six colours: Anton at 124–200px for the one number per card, Poiret One for the sentence that makes the number personal. The chrome follows an iOS 26 language: round 40px glass-tinted icon buttons, 20px radii, spring-ish expo-out reveals.

## Reference behaviour

1. Initial state: card 1 (tomato) is on; segment 1 starts filling; "NOOR, THIS WAS YOUR" then "2026" then the sentence rise in with a 120ms stagger; twelve book spines (a 290px-tall band) grow from the bottom with a 60ms stagger.
2. When a segment finishes filling (5200ms, linear), the next card cross-fades in over 360ms and its own reveal plays.
3. Card 2: "14,382" counts up from 0 over 1400ms (quartic ease-out, starting 240ms after the card shows) and the twelve monthly bars grow; March, the peak, is full-strength lime, the rest at 50%.
4. Card 3: 41 of 56 calendar squares pop in with an 18ms stagger, starting on the fifth square, so the streak sits inside a real-looking month grid.
5. Card 4: five list rows rise in order; the number 1 is larger (64px) and tomato.
6. Card 5: "NIGHT OWL" rises, then a cream arc draws from 10pm to 1:45am on a 24-hour ring over 1200ms.
7. Card 6: the share poster (tilted −2°) and two buttons rise. The segment bar is full and auto-advance stops.
8. Tap the right 70% of the screen: next card. Tap the left 30%: previous card. ← / → keys do the same.
9. Press and hold anywhere on the tap zones for 220ms: the current segment pauses; release resumes, and the release does not count as a tap.
10. Pause button toggles the same paused state (`aria-pressed`). Replay (top-right) and "Watch again" (card 6) restart from card 1.
11. The top bar's colour, track shade and button tint switch with each card so they always read on the field.

## Structure

```
390 × 844 (status bar drawn by the Lounge, top 54px left clear)
┌──────────────────────────────────────┐
│                                      │ 0–54 safe area
│ ▬▬▬ ▬▬▬ ▬▬▬ ▬▬▬ ▬▬▬ ▬▬▬              │ 58: 6 segments, 3px, gap 4
│ [■] Marginalia            (Ⅱ) (↺)    │ 70: 32px mark, brand, 40px buttons
│                                      │
│ NOOR, THIS WAS YOUR      (Anton 15)  │ 138: card content starts
│ 2026                     (Anton 152) │
│ You turned a lot of pages…(Poiret 22)│
│                                      │
│ ▌▐ ▌▐ ▌▐ ▌▐ ▌▐ ▌▐   spines / chart / │ margin-top:auto pushes the
│ ▌▐ ▌▐ ▌▐ ▌▐ ▌▐ ▌▐   dots / ring      │ visual to the bottom
│                                      │ bottom padding 58
└──────────────────────────────────────┘
tap zones: left 0–30% = back, 30–100% = next (from y=110 down)
```

- `<main class="story" aria-roledescription="story">`.
- `.top` fixed: `.segs` (decorative) and `.bar` with the app mark, brand, `<button id="pause" aria-pressed>`, `<button id="replay">`.
- Six `<section class="card cN" aria-label="Card N of 6">`, absolutely stacked; only `.on` is visible. Each: `.k` kicker, one display element (`.big` or `.huge`), one `.p` sentence, and one bottom visual.
- Card 4 uses an `<ol class="list">`; card 6 has an `<article class="poster">` with a `<dl>` of four stats and two `.btn`s.
- Two transparent `<button class="tap">` overlays: `.prev` (left 30%) and `.next` (right 70%), both from `top:110px` so they never cover the top bar. Hidden on card 6 so its buttons work.

Card fields and content:

| # | Background | Text | Display | Visual |
|---|---|---|---|---|
| 1 | `#e8442e` tomato | `#1a0f0a` | "2026" | 12 spines, heights 46–100% |
| 2 | `#0f5b3e` moss | `#d9f99d` lime | "14,382" | 12 monthly bars + "47 books · 312 hours · 9 languages" |
| 3 | `#f5c518` sun | `#1b1400` | "41" | 7 × 8 calendar, squares 5–45 filled |
| 4 | `#141210` night | `#f4ebdd` cream | — | top five list |
| 5 | `#1d3fd8` cobalt | `#f4ebdd` | "NIGHT OWL" | 24h ring, arc 22:00–01:45 |
| 6 | `#f4ebdd` cream | `#141210` | poster | Share to story, Watch again |

## Tokens

```css
:root {
  /* card fields and their ink */
  --tomato: #e8442e;  --tomato-ink: #1a0f0a;
  --moss: #0f5b3e;    --lime: #d9f99d;
  --sun: #f5c518;     --sun-ink: #1b1400;
  --night: #141210;   --cream: #f4ebdd;  --cream-2: #b9afa0;  /* secondary on night */
  --cobalt: #1d3fd8;
  --rule: #3a342e;    /* list hairline on night */

  /* type */
  --display: "Anton", Impact, sans-serif;
  --body: "Poiret One", Futura, sans-serif;
  --fs-kicker: 15px;            /* Anton, +0.14em, uppercase */
  --fs-big: min(39vw, 200px);   /* "2026", "41" */
  --fs-huge: min(30vw, 124px);  /* "14,382", "NIGHT OWL" */
  --fs-sentence: 22px;

  /* layout */
  --pad: 24px;
  --content-top: 138px;
  --content-bottom: 58px;
  --seg-h: 3px; --seg-gap: 4px;
  --r: 20px;          /* poster */
  --btn-h: 52px;      /* share buttons, radius 26 */
  --icon: 40px;       /* round top-bar buttons */

  /* motion */
  --dur: 5200ms;      /* per card */
  --t-fade: 360ms;
  --t-rise: 700ms;  --stagger: 120ms;
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Kicker | Anton | 15px | 400 | 1 | +0.14em | UPPERCASE |
| Big number | Anton | min(39vw, 200px) | 400 | 0.82 | −0.01em | — |
| Huge number / word | Anton | min(30vw, 124px) | 400 | 0.86 | −0.005em | tabular, caps |
| Sentence | Poiret One | 22px | 400 | 1.28 | 0 | sentence, max 22ch |
| List title | Poiret One | 23px | 400 | 1.15 | 0 | Title |
| List author / stat label | Poiret One | 17–18px | 400 | 1.3 | 0 | sentence |
| List number | Anton | 44px (64px for #1) | 400 | 1 | 0 | — |
| Stat value | Anton | 44px | 400 | 1 | 0 | — |
| Poster headline | Anton | 56px | 400 | 0.9 | 0 | UPPERCASE |
| Button | Anton | 17px | 400 | 1 | +0.08em | UPPERCASE |
| Brand | Poiret One | 18px / 15px | 400 | 1.1 | +0.02em | Title |

Poiret One is never set below 15px; its hairline strokes vanish smaller.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Delay | Reduced motion |
|---|---|---|---|---:|---|---|---|
| `.seg.now i` | card shown | scaleX | 0 → 1 | 5200ms | linear (time) | — | no auto-advance; tap only |
| `.card` | show / hide | opacity (+ visibility) | 0 ↔ 1 | 360ms | `--ease` | — | instant |
| `.rise` | card shown | opacity, translateY | 0, 28px → 1, 0 | 700ms | `--ease-out` | 120ms + i × 120ms | shown, no move |
| `.spines i` | card 1 | scaleY | 0 → 1 | 900ms | `--ease-out` | 400ms + i × 60ms | full height |
| count-up | card 2 | text | 0 → 14,382 | 1400ms | quartic out | 240ms | final value |
| `.months i` | card 2 | scaleY | 0 → 1 | 800ms | `--ease-out` | 500ms + i × 50ms | full height |
| `.dots i.f` | card 3 | scale, opacity | .3, 0 → 1 | 380ms | `--ease-out` | 500ms + i × 18ms | shown |
| ring `.arc` | card 5 | stroke-dashoffset | 1 → 0 | 1200ms | `--ease-out` | 600ms | drawn |
| `.btn` | active | scale | 1 → .97 | 160ms | `--ease` | — | none |

## States

- **Playing:** current segment filling; previous segments full; later segments show only the track shade.
- **Paused (hold or button):** `.paused` on the story sets `animation-play-state: paused` on the current segment. The pause button reads "Resume story" while pressed.
- **Last card:** segment full, no auto-advance, tap zones hidden so the buttons are reachable.
- **Per-card chrome:** the top bar's text, segment track (`rgba` of the field's ink at 25–60%) and button tint (ink at 8–16%) change on every card.
- **Focus-visible:** 2px outline in the current text colour, 3px offset, on every button.
- **Button pressed:** scale .97.

## Accessibility

- Each card is a `<section>` with `aria-label="Card N of 6"`; hidden cards get `aria-hidden="true"` and `visibility:hidden`, so only the current card is read.
- Tap zones are real buttons labelled "Previous card" and "Next card"; ← / → work from anywhere.
- The pause control is a toggle button with `aria-pressed`; it is the WCAG 2.2.2 escape hatch for auto-advancing content.
- The progress segments, spines, bars, calendar and ring are decorative (`aria-hidden`); their facts are in the sentence beside them.
- Contrast on every field: tomato ink 4.7:1, lime on moss 7.0:1, sun ink 11.2:1, cream on night 15.8:1, cream on cobalt 6.5:1, `--cream-2` on night 8.6:1.
- Hit targets: icon buttons 40 × 40; share buttons 52px tall, full width.
- Reduced motion: nothing auto-advances; every visual is shown complete.

## Responsive rules

- 390 × 844: as specified.
- 360 wide: display sizes follow the `vw` clamps ("2026" at 140px, "14,382" at 108px); the sentence keeps 22px and wraps to four lines.
- Short phones (< 700px tall): drop `--content-top` to 120px and hide the card 2 stats row.
- Tablet or desktop: centre a 390 × 844 story column on a `#141210` ground with 20px radius; tap zones stay inside the column.

## Acceptance checklist

**Always**
- [ ] Six segments at the top, 3px tall, 4px gaps; the current one fills linearly over 5200ms and advances on `animationend`.
- [ ] Right 70% taps go forward, left 30% go back, ← / → mirror them.
- [ ] Holding for 220ms pauses; the release does not advance.
- [ ] A pause toggle and a replay control are always visible; the last card has a "Watch again" button.
- [ ] Each card shows one display number or word and one sentence, no more.
- [ ] Only the visible card is in the accessibility tree.
- [ ] Every text colour passes 4.5:1 on its card field.
- [ ] Reduced motion: no auto-advance, no rise, visuals complete.

**This demo**
- [ ] Card order: 2026 (tomato), 14,382 pages (moss), 41-day streak (sun), top five (night), NIGHT OWL (cobalt), share (cream).
- [ ] The monthly bars sum to 14,382 and March (2,104) is the peak.
- [ ] Calendar squares 5 to 45 of 56 are filled (Mar 3 to Apr 12).
- [ ] The ring arc runs from 22:00 to 01:45 with 12AM at the top.
- [ ] Top five: The Salt Orchard, A Field Guide to Leaving, Nine Small Fires, Winter Ferry, The Glass Cartographer.

## Implementation notes

**Let CSS own the clock.** The segment's own animation is the timer; JS only listens for its end, so pausing is a single class:

```css
.seg i { position:absolute; inset:0; background:currentColor; transform:scaleX(0); transform-origin:0 50%; }
.seg.done i { transform:scaleX(1); }
.seg.now i { animation: fill var(--dur) linear forwards; }
.paused .seg.now i { animation-play-state: paused; }
@keyframes fill { to { transform: scaleX(1); } }
```

```js
segs.addEventListener('animationend', () => { if (!story.classList.contains('paused')) show(idx + 1); });
// restart the same segment when replaying: kill, reflow, restore
const i = segs.children[idx].firstChild; i.style.animation = 'none'; void i.offsetWidth; i.style.animation = '';
```

**Hold without a phantom tap.** Swallow the click that follows a hold in the capture phase:

```js
let hold = 0, held = false;
story.addEventListener('pointerdown', (e) => { if (e.target.closest('.tap')) hold = setTimeout(() => { held = true; story.classList.add('paused'); }, 220); });
story.addEventListener('pointerup', () => { clearTimeout(hold); if (held) story.classList.remove('paused'); });
story.addEventListener('click', (e) => { if (held) { held = false; e.stopPropagation(); } }, true);
```

**Draw the clock arc as a path, not a dashed circle.** Compute both ends from the hour (θ = h / 24 × 360°, measured clockwise from the top) and animate `stroke-dashoffset` with `pathLength="1"`: 10pm is (12.05, 6.23) and 1:45am is (27.03, 5.74) on r = 15.9 around (20, 20).

Common mistakes: letting display numbers overflow at 390 (clamp them with `vw`); tap zones covering the top bar, which makes pause and replay unreachable; leaving all six cards in the accessibility tree; animating `width` on the segments instead of `scaleX`.
