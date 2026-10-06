<!-- Design Lounge Nº 412 · "Sleep score with scrubbable hypnogram" · www.designlounge.live -->

# Sleep score with scrubbable hypnogram

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The morning card of a fictional sleep app called Lullow. A 168px ring shows last night's score, a serif headline says what the night was like in plain words, four stage totals sit under it, and a stepped hypnogram spans the card below. You drag across the hypnogram (or arrow through it) and a moon-cream cursor reads out the clock time and stage, outlines the segment under it, and dims the three stage totals that don't apply. It should feel quiet and bedside: low-contrast navy, one warm cream accent, an italic serif for numbers. The detail worth copying is the link between scrubbing and the totals: the legend becomes a live answer to "what was I doing at 3:20".

## Structure

```
1280 × 800, #0e141c with six 1px star dots
          ┌──────────────── 640px card, radius 28, padding 28 ───────────────┐
          │ ┌─────────┐   LULLOW · FRI INTO SAT                    11px caps │
          │ │  ◜84◝   │   Restful night, deep sleep held.   28px serif       │
          │ │  SCORE  │   7h 12m asleep · 11:18 pm to 6:51 am                │
          │ └─────────┘   ■AWAKE   ■REM     ■CORE    ■DEEP                   │
          │   168×168     21m      2h 00m   3h 38m   1h 34m   (19px serif)   │
          │               ───      ───      ───      ───      3px bars       │
          │ ─────────────────────────── 1px rule ─────────────────────────── │
          │ 3:20 am DEEP                       Drag or use arrow keys to scrub│
          │ Awake │ ▮        ▮            ▮          ▮                       │
          │ REM   │      ▬     ▬▬     ▬▬▬    ▬▬▬    ▬▬                      │  4 lanes × 26px
          │ Core  │ ▬  ▬▬ ▬▬  ▬ ▬▬  ▬▬  ▬▬▬   ▬▬   ▬                         │
          │ Deep  │  ▬▬▬    ▬▬▬    [▬]                                     │
          │       11:18 pm   1 am      3 am       5 am           6:51 am     │
          └──────────────────────────────────────────────────────────────────┘
```

- `main.card` labelled by the `h1`.
- `.head` is a grid `168px 1fr`, gap 28px: the ring (`role="img"`, "Sleep score 84 out of 100") and the text column with `p.eyebrow`, `h1`, `p.meta`, `ul.legend` (4 columns).
- `section.hyp` ("Hypnogram"): readout + hint row, then a grid `52px 1fr` with lane labels and the plot.
- `.plot` is `role="slider"`, 104px tall, with absolutely positioned `.seg` divs (left/width in %), `.link` hairlines between lanes, and a `.cursor`.
- `.axis` under the plot with five labels positioned in %.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Ring | load | stroke-dashoffset | 452.39 → 452.39 × 0.16 | 1100ms | expo out | final value, no transition |
| Score number | load | text | 0 → 84 | 1100ms | 1 − (1 − t)^4 | shows 84 |
| Legend dim | scrub start / end | opacity | 1 ↔ .4 | 160ms | standard | instant |
| Segment ring | cursor enters segment | box-shadow | none → 2px card + 1px ink | 160ms | standard | instant |
| Cursor | pointer / keys | left % | follows input | 0ms | — | same |

The cursor follows the finger with no easing. Smoothing it makes the readout lag the hand.

## States

- Plot hover: cursor `ew-resize`; the cursor line follows the pointer.
- Plot focus-visible: 2px card gap then 2px `--moon` ring around the plot (box-shadow), radius 8px.
- Scrubbing: legend `.scrub` class; matching `li.on` stays at 1, others .4.
- Active segment: `box-shadow: 0 0 0 2px var(--card), 0 0 0 3px var(--ink)` and `z-index:1`.
- Empty night (no data): replace the plot with one line "No sleep recorded" in `--ink-3` and hide the ring number behind an em dash. Not shown in this demo.
- Loading: ring track only, number "—".

## Accessibility

- The plot is `role="slider"`, `tabindex="0"`, `aria-label="Night timeline"`, `aria-valuemin="0"`, `aria-valuemax="453"`, `aria-valuenow` = minutes since sleep start, `aria-valuetext` like "3:20 am, Deep sleep" (Awake has no "sleep" suffix).
- The visual readout is `aria-hidden`; the slider's valuetext carries the same content.
- Ring is `role="img"` with "Sleep score 84 out of 100"; the counting number is `aria-hidden` so screen readers don't hear 0…84.
- Each legend item includes a visually hidden percent ("28 percent").
- Contrast: `#f1e9d6` on `#151d28` ≈ 14:1; `#aab5c5` ≈ 8:1; `#8190a6` ≈ 5:1.
- Hit target: the whole 104px-tall plot, full width.

## Responsive rules

- ≥1024: card 640px.
- 768: same card, centred.
- <560: card is `100vw − 32px`, padding 22/18. The head stacks: ring centred, text centred, legend becomes 2 × 2 and left-aligned. Lane label column shrinks to 40px. Axis keeps only start, 3 am and end. The hint hides (touch users drag).
- At 375 wide the plot is ~280px; segments stay at least 1px wide because width is `calc(% − 1px)` with a positive minimum duration.

## Acceptance checklist

### Always

- [ ] Ring fills on load and the number counts up, both in about one second, and both are instant with reduced motion.
- [ ] Stage totals and percentages are derived from the same segment data that draws the hypnogram.
- [ ] Hypnogram has four lanes, one per stage, with hairline links where the stage changes.
- [ ] Hover, drag (with pointer capture) and keyboard all move the cursor.
- [ ] Readout shows clock time and stage name; the active segment is outlined; non-matching totals dim while scrubbing.
- [ ] The plot is a slider with a meaningful `aria-valuetext`.
- [ ] One accent (cream) used for ring, cursor and focus only.
- [ ] No horizontal overflow at 375px.

### This demo

- [ ] Score 84, headline "Restful night, deep sleep held."
- [ ] 7h 12m asleep, 11:18 pm to 6:51 am (453 minutes in bed).
- [ ] Totals: Awake 21m, REM 2h 00m, Core 3h 38m, Deep 1h 34m.
- [ ] Cursor starts at 3:20 am on Deep.
- [ ] Arrow = 5 min, Shift+arrow = 30 min, PageUp/Down = 60 min.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: ring at 0 fills to 84/100 over 1100ms while the number counts up 0 → 84 with a quartic ease out.
2. The cursor is parked at 3:20 am (minute 242 of 453) on a Deep segment. Readout says "3:20 am · DEEP". The Deep segment carries a 1px ink ring. Legend is not dimmed yet.
3. Hovering the hypnogram moves the cursor with the pointer. Pressing and dragging captures the pointer so you can leave the plot and keep scrubbing.
4. While scrubbing: readout updates to the minute, the segment under the cursor gets the ring, the matching legend item stays at full opacity and the other three fall to 40%.
5. Pointer leaves (not dragging) or focus leaves: legend returns to full opacity. The cursor stays where it was.
6. Keyboard on the focused hypnogram: ArrowRight/ArrowUp +5 min, ArrowLeft/ArrowDown −5 min, Shift+arrow ±30 min, PageUp/PageDown ±60 min, Home = 11:18 pm, End = 6:51 am.
7. Cursor clamps to 0…453 minutes.
8. Totals are computed from the segment data, not typed: Awake 21m, REM 2h 00m, Core 3h 38m, Deep 1h 34m. Under each, a 3px bar shows its share (awake share of time in bed; the three sleep stages as share of time asleep: 28 / 50 / 22%).

## Tokens

```css
:root {
  --bg: #0e141c;       /* night */
  --card: #151d28;     /* card */
  --card-2: #1b2532;   /* ring track */
  --line: #243142;     /* rules, lane lines, legend tracks */
  --line-2: #2f3e52;   /* stage links */
  --ink: #f1e9d6;      /* headline, values (warm, not white) */
  --ink-2: #aab5c5;    /* meta */
  --ink-3: #8190a6;    /* labels */
  --moon: #ead9b0;     /* the accent: ring, cursor, focus, headline italic */
  --awake: #e7a37a;
  --rem: #a9c4ee;
  --core: #5e86c2;
  --deep: #3d63ab;
  --serif: "Petrona", Georgia, serif;
  --sans: "Mulish", system-ui, sans-serif;
  --r-card: 28px; --r-seg: 4px; --r-plot: 8px;
  --lane: 26px; --seg-h: 16px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 20px; --space-5: 28px;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --t-micro: 160ms; --t-ring: 1100ms;
}
```

Stage colours run warm (awake) → pale → deep blue, so depth of sleep reads as depth of colour. The accent cream is never a stage colour.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Score | Petrona italic | 58px | 500 | 1 | −0.02em | tabular nums |
| Headline | Petrona | 28px | 400 | 1.15 | −0.01em | second clause italic in `--moon` |
| Readout time | Petrona italic | 20px | 400 | 1 | 0 | — |
| Legend value | Petrona | 19px | 500 | 1.2 | 0 | nowrap |
| Eyebrow / legend label | Mulish | 11px | 700 | 1 | 0.10–0.16em | uppercase |
| Meta | Mulish | 14px | 400, bold 600 | 1.5 | 0 | — |
| Lane labels, axis | Mulish | 11px | 600 / 400 | 1 | 0 | tabular nums |
| Hint | Mulish | 12px | 400 | 1.5 | 0 | `--ink-3` |

## Implementation notes

**Data drives everything.** Keep the night as `[stage, minutes]` pairs and build segments, links and totals from it.

```js
const NIGHT = [['A',6],['C',18],['D',42],['C',20],['R',14],['C',26],['D',34],
  ['C',18],['A',4],['R',22],['C',30],['D',18],['C',24],['R',28],['A',6],
  ['C',36],['R',34],['C',26],['A',5],['R',22],['C',20]];
const LANE = { A: 0, R: 1, C: 2, D: 3 };
const TOTAL = NIGHT.reduce((s, [, m]) => s + m, 0); // 453
let t = 0, prev = null;
for (const [k, m] of NIGHT) {
  addSeg({ left: t / TOTAL * 100, width: m / TOTAL * 100, top: LANE[k] * 26 + 5, k });
  if (prev !== null && prev !== LANE[k]) addLink(t, prev, LANE[k]); // vertical hairline
  prev = LANE[k]; t += m;
}
```

**Clock maths.** Start is 23:18 = 1398 minutes. `(1398 + m) % 1440` gives the wall time across midnight.

```js
const clock = m => {
  const tot = (1398 + Math.round(m)) % 1440, h = Math.floor(tot / 60);
  return `${h % 12 || 12}:${String(tot % 60).padStart(2,'0')} ${h < 12 ? 'am' : 'pm'}`;
};
```

**Scrub input.** Use pointer events with `setPointerCapture` on `pointerdown`, `touch-action: none` on the plot, and convert `clientX` against `getBoundingClientRect()` every move (the card can resize).

Common mistakes:

- A smooth area chart instead of stepped lanes. Sleep stages are discrete.
- Purple. The night here is navy and slate; the warmth is the cream.
- Hard-coding the totals text so it drifts from the drawn data.
- Easing the cursor.
- Tooltips that float over the plot and hide the segments you're reading; the readout lives above, left-aligned.
- Making the whole card a slider. Only the plot scrubs.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
