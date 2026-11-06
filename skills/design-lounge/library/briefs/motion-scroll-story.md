<!-- Design Lounge Nº 652 · "Scroll-driven trail guide" · www.designlounge.live -->

# Scroll-driven trail guide

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The "Route of the day" screen in "Cairnline", an invented hill-walking app. The top 470px is a dusk landscape drawn as five SVG plates (sun, far ridge, mid ridge, near ridge, pines); the route name "HOLLIN EDGE" sits between the sun and the far ridge, so as you scroll it sinks behind the mountains. A compact bar fades in with the name and a scroll progress line. Under the landscape a dark pine-green panel sticks below the bar: a big step counter ("01/05") on the left, a contour map on the right where the orange route draws itself as you read the five steps. Worth copying: the depth trick (text placed inside the parallax stack, not on top of it), CSS scroll timelines for the free parts, and one small JS frame that drives only what CSS cannot know (which step you are on).

## Structure

```
390 × 844, page scrolls (document)
┌──────────────────────────────────────┐ ◄ fixed .bar 0–106 (hidden at top)
│ (‹)                            (⇪)   │ 58
│ ROUTE OF THE DAY · SAT 7 NOV          │ 106  .htext (between sun and far plate)
│ HOLLIN                      ( sun )   │
│ EDGE                                  │
│ /\/\ far  ~~ mid ~~  ~~ near ~~       │ plates: 5 × <svg> 390×470, bottom-aligned
│ [11.4 km loop][640 m up][4h 10m][Mod] │ .meta, bottom 22
│ ▲▲  ▲   pines                    ▲▲   │ 470
├──────────────────────────────────────┤ ◄ .panel sticky top:106, 200 tall
│ STEP     │  contour map              │
│ 01 /05   │   ◯ route draws, ● dot    │
│ Thrushf… │                           │
├──────────────────────────────────────┤ 670
│ KM 0.0 · START                       │ .step × 5, min-height 390
│ THRUSHFOLD CAR PARK                  │
│ paragraph                            │
│ ─0.0── ─112── ─08:30─                │
│ [      Start route      ] [ ↓ ]      │ fixed .dock, 56 tall, 34 bottom pad
└──────────────────────────────────────┘
```

- `<header class="bar" aria-hidden="true">`: decorative duplicate of the title; its back button has `tabindex="-1"` (the hero's back button is the real one).
- `<section class="hero" aria-label="Route of the day">`: plates in paint order sun → `.htext` → far → mid → near → pines, then `.meta` and the two buttons.
- `<div class="panel" role="group" aria-label="Route progress">`: counter with `<p aria-live="polite">` step name, plus the map `<svg aria-hidden="true">`.
- `<main class="steps">`: five `<article class="step">` and a footnote.
- `.dock`: two `<button>`s.

## Motion

| Thing | Driver | Property | From → to | Range / timing | Reduced motion |
|---|---|---|---|---|---|
| Sun plate | `scroll(root)` | translateY | 0 → 340px | 0–470px, linear | static |
| Far ridge | `scroll(root)` | translateY | 0 → 220px | 0–470px | static |
| Mid ridge | `scroll(root)` | translateY | 0 → 140px | 0–470px | static |
| Near ridge | `scroll(root)` | translateY | 0 → 60px | 0–470px | static |
| Pines, chips | page | — | scroll with page | — | same |
| Title block | `scroll(root)` | translateY, opacity | 0, 1 → 290px, 0 | 0–340px | static |
| Compact bar | `scroll(root)` | opacity, visibility | 0, hidden → 1, visible | 250–350px | class at 300px, 200ms fade |
| Progress line | `scroll(root)` | scaleX | 0 → 1 | 364px → end | JS-written scaleX |
| Route draw | JS frame | stroke-dashoffset | L → 0 by step stops | per step, rAF on scroll | same |
| Route dot | JS frame | cx, cy | `getPointAtLength(f·L)` | rAF on scroll | same |
| Counter | step change | translateY, opacity | 22px, 0 → 0, 1 | 260ms `--out` | opacity only, 200ms |
| Step content | `view()` | translateY, opacity | 18px, 0 → 0, 1 | entry 0% → 30% | none |

## States

- **Top of page:** full hero, bar hidden (`visibility:hidden`), counter "01/05", route undrawn, dot on the start ring.
- **Collapsed:** bar visible, panel stuck under it, progress line growing.
- **Mid-story:** counter shows the step whose top crossed y 426; route drawn to between that step's stop and the next.
- **End:** "05/05", full loop, progress line full.
- **Focus-visible:** 3px `#A63E1A` outline, 3px offset, 12px radius on the hero buttons and dock buttons.
- **No scroll-timeline support:** identical look, written by the JS frame.

## Accessibility

- Every landscape plate and the map are `aria-hidden`; the facts and step text carry the content.
- The step name under the counter is `aria-live="polite"`, so screen-reader users hear "Climb to Hollin Edge" as they move through the steps.
- The compact bar duplicates the hero title; mark it `aria-hidden` and keep its button out of the tab order so focus does not land on an invisible control.
- Headings: the hero `<h1>` then five `<h2>` steps; Tab order is Back, Share, Start route, Save map offline.
- Contrast: hero ink `#1B2A26` on the lightest sky is 13:1 and on `#E9A877` 8.3:1; chips sit on solid paper; `#B9C7BE` on pine 7.4:1; `#A63E1A` km markers on paper 5.9:1.
- Dock buttons are 56px; hero buttons 44px; bar button 40px.

## Responsive rules

- At 360 wide the title stays 104px ("HOLLIN" is about 240px wide); the four chips may wrap to two rows; the counter column stays 128px and the map scales with `preserveAspectRatio="xMidYMid meet"`.
- Plates use `preserveAspectRatio="xMidYMax slice"` so the ridges stay bottom-anchored at any width.
- Above 430px the column centres at 430px; the fixed bar and dock use the same max width.
- On tall screens keep the scroll ranges in px tied to the 470px hero, not to viewport height, so the depth effect is identical.

## Acceptance checklist

**Always**
- [ ] Five separate SVG plates move at different speeds; the nearest moves almost with the page, the sun barely at all.
- [ ] The title sits inside the plate stack and visibly slides behind the far ridge between 0 and 340px.
- [ ] Compact bar appears between 250 and 350px and is `visibility:hidden` when not shown.
- [ ] The step panel is `position: sticky` directly under the bar and is opaque.
- [ ] Counter updates as each step crosses the line, with a short slide-in.
- [ ] Route drawing is proportional to reading progress and pauses on waypoints between steps; the dot rides the tip.
- [ ] Parallax, bar and progress use `animation-timeline: scroll()`; without support, the JS frame writes the same values.
- [ ] Scroll work is batched in one rAF per scroll event; no layout reads inside CSS-driven paths.
- [ ] Reduced motion: no parallax or drift; bar and counter use plain fades; route still follows position.
- [ ] `scrollWidth` stays 390; dock leaves 34px at the bottom.

**This demo**
- [ ] Route "HOLLIN EDGE", 11.4 km loop, 640 m up, 4h 10m, Moderate.
- [ ] Steps: Thrushfold car park, Over the packhorse bridge, Climb to Hollin Edge, Along the ridge to Cold Knott, Down by Seavy Tarn.
- [ ] Counter reads "05/05" at the end of the page.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame, 390 × 844 (the Lounge draws the status bar). Sky gradient `#F7E6C8 → #F2C89A (52%) → #E9A877`. A 46px cream sun at (300, 300); a terracotta far ridge, a sage mid ridge with a pale summit path, a green near ridge and a pine silhouette band at the bottom.
2. Over the sky, behind the far ridge: "ROUTE OF THE DAY · SAT 7 NOV" (Sora 12/600, 0.08em) and "HOLLIN / EDGE" in Big Shoulders Display 104px/800, line-height 0.84, uppercase, ink `#1B2A26`.
3. In front of everything, 22px from the hero's bottom: four paper chips (30px tall, radius 15) "11.4 km loop", "640 m up", "4h 10m", "Moderate". Round 44px paper buttons for Back (left) and Share (right) at top 58px.
4. The sticky panel starts at y 470: 200px tall, `#22392F`. Left column 128px: "STEP" (11/600, 0.12em, `#B9C7BE`), "01" (Big Shoulders 84/800, cream) with "/05" (22/600), and the step name "Thrushfold car park" (13/500). Right: contour ellipses `#3A5448`, a tarn, a dashed base route `#5E7A6D`, five waypoint rings and an orange dot `#F07A4A` at the start.
5. Below, on paper `#F1ECE2`: five step articles, each at least 390px tall: a kilometre marker ("KM 1.8", 12/600, `#A63E1A`), a heading (Big Shoulders 40/700 uppercase), a 15px paragraph capped at 34ch, and three facts (24px numerals over 12px labels, each with a 2px ink rule above).
6. A fixed dock at the bottom: "Start route" (56px, pine fill, cream text, radius 18) and a 56px outlined "Save map offline" icon button, on a paper fade, 34px bottom padding.
7. Scroll 0 → 470px: plates translate down by sun 340px, far 220px, mid 140px, near 60px (so they move at 28%, 53%, 70% and 87% of page speed); the title block translates down 290px over 0 → 340px and fades to 0. Because the title moves slower than the far ridge, it slides behind it.
8. Scroll 250 → 350px: the compact bar (fixed, 106px tall including the 54px status area, paper with a 1px `#E6DFD1` line) fades from 0 to 1: a 40px outlined back button, "HOLLIN EDGE" (Big Shoulders 26/700) and "11.4 km · loop".
9. At scroll 364px the panel meets the bar and sticks at top 106px. From there to the end of the page a 3px orange line at the bar's bottom edge grows from scaleX 0 to 1.
10. As each step's top passes 120px below the panel (y = 426), the counter changes ("02", "03" …) with a 22px slide-up and fade (260ms), and the step name updates.
11. The orange route draws with `stroke-dashoffset`: each step owns a slice of the path (stops at 0, 0.16, 0.37, 0.67, 1 of its length), and the draw interpolates within the slice by how far that step has scrolled past the line. The dot rides the tip of the drawn route; waypoint rings sit at the stops.
12. Each step's children rise 18px and fade in as they enter (view timeline, `entry 0%` → `entry 30%`).
13. At the end: "05/05 · Down by Seavy Tarn", the route is a closed loop, the progress line is full, and a footnote reads "Route checked by Cairnline rangers on 2 Nov 2026. Grid ref NY 412 087 for the car park."
14. Browsers without `animation-timeline`: the same frame function writes the plate transforms, title transform and opacity, the bar's `on` class and the progress `scaleX`.
15. Reduced motion: no parallax, no title drift, no rise-in. The bar fades in over 200ms when you pass 300px; the counter crossfades (200ms). The route still draws because it is position, not autonomous motion.

## Tokens

```css
:root {
  /* landscape */
  --sky-1: #f7e6c8; --sky-2: #f2c89a; --sky-3: #e9a877;
  --sun: #fbefd9;
  --far: #d79a7b;     /* terracotta ridge */
  --mid: #8e8d7c;     /* sage ridge */
  --near: #4a6556;
  --pine: #22392f;    /* pines, panel, primary button */
  /* page */
  --paper: #f1ece2;
  --paper-2: #e6dfd1; /* hairlines */
  --ink: #1b2a26;
  --ink-2: #4d5a55;   /* 6.6:1 on paper */
  --cream: #f1ece2;   /* text on pine */
  --cream-2: #b9c7be; /* 7.4:1 on pine */
  --contour: #3a5448;
  --base-route: #5e7a6d;
  --tarn: #5c87a0;
  --route: #f07a4a;   /* drawn route, dot, progress line */
  --route-ink: #a63e1a; /* km markers on paper, focus ring */
  --outline: #7b827c; /* 3.6:1 icon-button border */
  /* type */
  --display: "Big Shoulders Display", system-ui, sans-serif;
  --sans: "Sora", system-ui, sans-serif;
  --fs-hero: 104px; --fs-count: 84px; --fs-step: 40px; --fs-bar: 26px; --fs-fact: 24px;
  --fs-body: 15px; --fs-meta: 13px; --fs-chip: 12px; --fs-label: 11px;
  /* layout */
  --hero: 470px; --bar: 106px; --panel: 200px; --count-col: 128px;
  --gutter: 20px; --step-min: 390px; --measure: 34ch;
  --r-chip: 15px; --r-button: 18px; --r-round: 50%;
  /* scroll mapping (px of translateY over the hero's 470px) */
  --par-sun: 340px; --par-far: 220px; --par-mid: 140px; --par-near: 60px;
  --title-drift: 290px;  /* over 0–340px, opacity 1 → 0 */
  --bar-range: 250px 350px;
  --stick-at: 364px;     /* hero − bar */
  --route-stops: 0 .16 .37 .67 1;
  --step-line: 120px;    /* below panel bottom */
  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --out: cubic-bezier(.16,1,.3,1);
  --d-count: 260ms; --count-rise: 22px;
  --rise: 18px;          /* view timeline, entry 0% → 30% */
  --d-fade-rm: 200ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|
| Hero title | Big Shoulders Display | 104px | 800 | 0.84 | −0.01em | Upper |
| Step counter | Big Shoulders Display | 84px (+ 22px "/05") | 800 / 600 | 0.9 | 0 | tabular |
| Step heading | Big Shoulders Display | 40px | 700 | 0.95 | 0 | Upper |
| Bar title | Big Shoulders Display | 26px | 700 | 1 | 0.01em | Upper |
| Fact numeral | Big Shoulders Display | 24px | 700 | 1 | 0 | — |
| Body | Sora | 15px | 400 | 1.6 | 0 | Sentence |
| Step name, bar meta | Sora | 13px | 500–600 | 1.35 | 0 | Sentence |
| Eyebrow, km marker | Sora | 12px | 600 | 1.6 | 0.08–0.1em | Upper |
| Chips | Sora | 12px | 600 | 1 | 0 | Sentence |
| "STEP" label | Sora | 11px | 600 | 1 | 0.12em | Upper |

## Implementation notes

**1. Parallax with scroll timelines, gated twice.** Put every scroll-linked animation behind both `@supports` and the motion preference, so reduced motion never gets parallax and old browsers fall through to JS.

```css
@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    .plate, .htext, .bar, .prog { animation-timing-function: linear; animation-fill-mode: both;
                                  animation-timeline: scroll(root); }
    .p-far  { animation-name: pFar;  animation-range: 0 470px; }
    .htext  { animation-name: hText; animation-range: 0 340px; }
    .bar    { animation-name: barIn; animation-range: 250px 350px; }
  }
}
@keyframes pFar  { to { transform: translateY(220px) } }
@keyframes hText { to { transform: translateY(290px); opacity: 0 } }
@keyframes barIn { from { opacity: 0; visibility: hidden } 1% { visibility: visible } to { opacity: 1; visibility: visible } }
```

**2. Route draw by step, not by raw page progress.** Raw progress makes the line race through short steps and crawl through long ones. Give each step a slice of the path and interpolate within it.

```js
const STOPS = [0, .16, .37, .67, 1], L = route.getTotalLength();
route.style.strokeDasharray = L;
// i = last step whose top is above panelBottom + 120
const r = steps[i].getBoundingClientRect();
const inStep = i === 4 ? 1 : clamp((panelBottom + 120 - r.top) / r.height);
const f = i === 4 ? 1 : STOPS[i] + (STOPS[i + 1] - STOPS[i]) * inStep;
route.style.strokeDashoffset = L * (1 - f);
const pt = route.getPointAtLength(f * L); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
```

**3. Depth comes from paint order.** Place the title element after the sun plate and before the far ridge, and give it a larger translate than the far ridge. Text laid on top of all plates can only fade; text inside the stack disappears behind a mountain, which is the moment people remember. Keep the facts chips in front, on solid paper, so they stay readable over the ridges.

Common mistakes: one scroll listener per element (use one rAF frame), animating `top` on the plates (use transforms), letting the compact bar sit at opacity 0 but still focusable, and forgetting `animation-fill-mode: both`, which makes plates snap back at the ends of the range.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
