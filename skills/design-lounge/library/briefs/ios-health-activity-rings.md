<!-- Design Lounge Nº 089 · "Activity rings with weekly picker" · www.designlounge.live -->

# Activity rings with weekly picker

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The Summary screen of a fictional health app, written in an iOS 26 language: near-black surfaces, 20px-radius cards, SF-like grotesk (Geist) with a mono for units. The hero is three concentric activity rings (Move, Exercise, Stand) that sweep closed from 12 o'clock on load; when a goal is exceeded, a second "overflow lap" draws on top of the first with a dark drop shadow so the overlap reads. Below, a seven-day bar chart doubles as the day picker: tap a day and the rings, numerals and tiles animate from their current values to that day's values. The detail worth copying is that every number and every ring transitions *from where it is*, so switching days feels like one continuous instrument rather than a page reload.

## Structure

```
390 × 844 (status bar drawn by the Lounge; 54px clear at top)
┌──────────────────────────────────────┐ 0
│            (status bar)              │
├──────────────────────────────────────┤ 62
│ TODAY, 2 OCTOBER                (NH) │ eyebrow 12 mono / avatar 40
│ Summary                              │ 34/700
├──────────────────────────────────────┤ 130
│ ┌──────────────────────────────────┐ │
│ │ Activity               [↻ Replay]│ │ card r20, pad 18
│ │          ╭──────────╮            │ │
│ │        ╭─┤  ╭────╮  ├─╮          │ │ rings svg 232×232
│ │        │ │  │    │  │ │          │ │ r 105 / 77 / 49, stroke 22
│ │        ╰─┤  ╰────╯  ├─╯          │ │
│ │          ╰──────────╯            │ │
│ │ ─────────────────────────────── │ │ 1px --line
│ │ MOVE      EXERCISE    STAND      │ │ 3-col grid
│ │ 556/520   38/30       11/12      │ │ 30/600 tabular
│ │ KCAL      MIN         HRS        │ │
│ └──────────────────────────────────┘ │ ~545
│ This week               28 SEP – 4 OCT│ 20/600 + mono 12
│ ┌──────────────────────────────────┐ │
│ │ - - - - - - - - - - - - - GOAL - │ │ dashed line at 100%
│ │ ▌▌▌  ▌▌▌  ▌▌▌  ▌▌▌  ▌▌▌  ...  ...│ │ 7 columns, bars 110 tall area
│ │  M    T    W    T   (F)   S    S │ │ 30px discs
│ └──────────────────────────────────┘ │ ~780
│ ┌───────────────┐ ┌───────────────┐ │
│ │ STEPS 10,488  │ │ DISTANCE 7.8km│ │ below fold
└──────────────────────────────────────┘
```

- `<main>` scroll container, `padding: 62px 16px 48px`.
- `<header class="head">`: eyebrow `<p>` (live-updated date), `<h1>Summary</h1>`, avatar `<button aria-label="Profile, Noor Haddad">` with initials.
- `<section class="hero" aria-labelledby>`: title row (`<b>Activity</b>` + Replay `<button>`), the rings `<svg aria-hidden="true">`, and `.stats` (3-column grid, `aria-live="polite"`).
- Rings SVG: three `<g>` groups. Each has a track circle (colour at 16–18% alpha), an `.arc` circle and a `.lap` circle, all with `pathLength="100"`. The whole SVG is rotated −90° so 0 is at 12 o'clock.
- `<section class="week" aria-label="Choose a day">` holds `.chart`, a 7-column grid of `<button class="day" aria-pressed>`; each contains `.bars` (three `<i>` with `--h`) and `.lbl` (day letter).
- `.tiles`: 2-column grid of Steps and Distance cards.

## Motion

| Element          | Trigger               | Property          | From → To                       | Duration | Easing    | Delay / stagger |
|------------------|-----------------------|-------------------|---------------------------------|---------:|-----------|-----------------|
| `.arc` (×3)      | load, day pick, replay| stroke-dasharray  | current → `min(p,99.99) 100`    | 1200ms   | `--expo`  | 0 / 90 / 180ms by ring |
| `.lap` (×3)      | same                  | stroke-dasharray  | current → `(p−100) 100`         | 700ms    | `--expo`  | 1000ms + 90ms × ring when there is overflow, else 0 |
| Stat + tile numerals | same              | text (JS tween)   | current → target                | 900ms    | ease-out quart `1−(1−t)^4` | none |
| `.bars i`        | (static per day)      | height            | —                               | 320ms    | `--spring`| — |
| `.bars i`        | hover / select        | opacity           | .42 → .7 / 1                    | 160ms    | `--ease`  | — |
| `.lbl` disc      | select                | background, color | transparent → `--ink`           | 160ms    | `--ease`  | — |

Reduced motion: every `transition-duration` becomes 1ms and `transition-delay` 0; rings and bars jump to their final state. The numeral tween still runs (it is text, not movement) but you may shorten it to 1 frame.

## States

- **Selected day:** `aria-pressed="true"`, bars at opacity 1, letter in a 30px `--ink` disc with `--bg` text, weight 600.
- **Today:** letter has `box-shadow: inset 0 0 0 1.5px var(--move)`. Today + selected: disc fills `--move`, text `#fff`, no ring.
- **Hover (day with data):** bars to opacity .7. No layout change.
- **Disabled (future days):** `disabled` attribute, default cursor, 4px stub bars in `--surface-2` at full opacity.
- **Ring at 0:** arc opacity 0 (a round cap at 0 length would otherwise draw a dot).
- **Ring exactly at goal:** base arc draws to 99.99 so the round caps meet without a seam; lap opacity 0.
- **Overflow:** lap visible, drawn on top with `--lap-shadow`, so the leading cap casts a dark shadow on the first lap.
- **Focus-visible:** 2px `--ink` outline, 2px offset on day buttons, Replay and avatar.

## Accessibility

- The rings SVG is `aria-hidden`; the same numbers live in `.stats` as text, which is an `aria-live="polite"` region so day switches are announced.
- Each day button has a full `aria-label`, e.g. "Monday, 28 September: move 612 of 520 kilocalories, exercise 48 of 30 minutes, stand 12 of 12 hours". Disabled days read "Saturday, 3 October, no data yet".
- Day buttons use `aria-pressed` (they behave like a single-select toggle group). Tab order: avatar → Replay → Mon … Fri. Enter/Space selects.
- Contrast: `--ink-2` on `--surface` is 7.4:1; `--ink-3` (5.2:1) is used only for goals and units ≥ 11px.
- Hit targets: each day column is ~48 × 150px; Replay pill is 32px tall visually, pad it to 40px with a transparent `::after` if your system requires it.

## Responsive rules

- 390 wide: as specified.
- 360 wide: rings shrink to 208px (`width: min(232px, 60vw)`), stat value drops to 26px; stats stay 3 columns.
- 430 wide (Plus/Max): rings 248px, card padding 20px; everything else unchanged.
- Tablet / landscape: place the ring card and week card side by side in a 2-column grid, max width 820px, rings 260px.
- Never let the stat row wrap; use `font-variant-numeric: tabular-nums` so numerals don't jitter while ticking.

## Acceptance checklist

- [ ] Rings are 232px, stroke 22px, radii 105 / 77 / 49 in a 240 viewBox, starting at 12 o'clock.
- [ ] On load the rings sweep over 1200ms with `cubic-bezier(.16,1,.3,1)`, staggered 90ms per ring.
- [ ] Goals over 100% draw a second lap that starts after the first and has a visible dark shadow at its cap.
- [ ] A ring at exactly 100% shows a closed loop with no visible seam and no extra lap.
- [ ] A ring at 0 shows only the track, no dot.
- [ ] Numerals count up over 900ms and use tabular figures (no horizontal jitter).
- [ ] Tapping a day transitions rings and numerals from current values, not from zero.
- [ ] Replay restarts the sweep from zero for the selected day.
- [ ] Saturday and Sunday are disabled and cannot be selected.
- [ ] The dashed goal line aligns with the top of a bar at exactly 100%.
- [ ] Today's day letter has a red ring when unselected and a red fill when selected.
- [ ] The day change is announced through the live region.
- [ ] Focus rings are visible on every interactive element.
- [ ] With reduced motion, everything still updates but nothing sweeps.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: today (Friday 2 October) is selected. Eyebrow reads "TODAY, 2 OCTOBER". Rings start empty and sweep to Move 556/520 (107%), Exercise 38/30 (127%), Stand 11/12 (92%) over 1200ms, staggered 0 / 90 / 180ms.
2. The Move and Exercise overflow laps start after their base laps (delay 1000ms + 90ms × ring index) and draw the excess (7% and 27%) over 700ms.
3. At the same time the three stat numerals count up from 0 with an ease-out-quart over 900ms; Steps (10,488) and Distance (7.8 km) count up in the tiles below.
4. The week chart shows Mon–Sun (28 Sep – 4 Oct). Each day is a column of three 6px bars (Move, Exercise, Stand) whose height is `min(value/goal, 1.3) / 1.3` of the bar area. A dashed goal line sits at the 100% height. Days with data are buttons; Saturday and Sunday are disabled and show 4px stub bars in `--surface-2`.
5. Unselected days render bars at 42% opacity; hover lifts to 70%; the selected day is 100%. The selected day's letter sits in a 30px white disc with dark text. Today's letter has a 1.5px Move-red inner ring; when today is selected its disc fills Move red with white text.
6. Tap Monday: eyebrow becomes "Monday, 28 September"; rings transition from today's arcs to 612/520, 48/30, 12/12; numerals tween from current to new values over 900ms; Move's overflow lap redraws to 18%; Exercise's to 60%; Stand closes exactly.
7. Tapping the already-selected day does nothing.
8. "Replay" (top-right of the Activity card) empties all rings and numerals instantly, then after 60ms replays the selected day's sweep from zero.
9. The page scrolls; the first frame shows header, the full ring card and the week chart without scrolling. Steps/Distance tiles sit just below the fold.

## Tokens

```css
:root {
  /* surfaces — neutral near-black, no blue cast */
  --bg: #0b0b0c;          /* page */
  --surface: #161618;     /* cards */
  --surface-2: #1f1f22;   /* replay pill, disabled bars */
  --line: #2a2a2e;        /* hairline above stats */
  --goal-line: #3a3a40;   /* dashed goal rule */
  --ink: #f4f4f1;         /* primary text, selected day disc */
  --ink-2: #a4a4a9;       /* labels */
  --ink-3: #727278;       /* goals, units, meta */

  /* ring colours + tracks */
  --move: #ff3b5c;   --move-track: rgba(255, 59, 92, .18);
  --ex: #a8f53a;     --ex-track: rgba(168, 245, 58, .16);
  --stand: #34e3e0;  --stand-track: rgba(52, 227, 224, .16);

  /* type */
  --font: "Geist", system-ui, -apple-system, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;

  /* shape */
  --r-card: 20px;
  --r-bar: 4px;
  --ring-w: 22px;
  --rings-size: 232px;
  --bar-w: 6px;
  --bar-area: 110px;
  --day-disc: 30px;

  /* spacing (4-based) */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px;

  /* motion */
  --t-micro: 160ms;
  --t-layout: 320ms;
  --t-ring: 1200ms;
  --t-lap: 700ms;
  --t-count: 900ms;
  --spring: cubic-bezier(.32, .72, 0, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);

  /* elevation */
  --lap-shadow: drop-shadow(0 0 3px rgba(0, 0, 0, .9));
}
```

## Typography

| Role              | Family     | Size | Weight | Line-height | Tracking | Case      |
|-------------------|------------|-----:|-------:|------------:|---------:|-----------|
| Large title       | Geist      | 34px | 700    | 1.05        | −0.03em  | sentence  |
| Eyebrow date      | Geist Mono | 12px | 500    | 1           | +0.08em  | UPPERCASE |
| Card title        | Geist      | 17px | 600    | 1.4         | −0.01em  | sentence  |
| Section title     | Geist      | 20px | 600    | 1.4         | −0.02em  | sentence  |
| Stat label        | Geist Mono | 11px | 500    | 1           | +0.08em  | UPPERCASE |
| Stat value        | Geist      | 30px | 600    | 1           | −0.04em  | tabular numerals |
| Stat goal (/520)  | Geist      | 14px | 500    | 1           | −0.01em  | numerals  |
| Unit (KCAL)       | Geist Mono | 11px | 500    | 1.4         | +0.04em  | UPPERCASE |
| Day letter        | Geist      | 13px | 500 (600 selected) | 1 | 0 | UPPERCASE |
| Tile value        | Geist      | 26px | 600    | 1.2         | −0.035em | tabular numerals |
| Replay pill       | Geist      | 12px | 500    | 1           | 0        | sentence  |

Stat values take their ring colour; everything else is ink/ink-2/ink-3.

## Implementation notes

**Use `pathLength="100"` so dash values are percentages.** No circumference maths, and the same CSS works for all three radii. Clamp the base arc just under 100 so round caps meet:

```js
groups.forEach((g, k) => {
  const p = v ? v[k] / goals[k] * 100 : 0;
  const arc = g.querySelector('.arc'), lap = g.querySelector('.lap');
  arc.style.strokeDasharray = Math.min(p, 99.99) + ' 100';
  arc.style.opacity = p > 0 ? 1 : 0;
  const over = Math.max(0, Math.min(p - 100, 99));
  lap.style.transitionDelay = over ? (1000 + k * 90) + 'ms' : '0ms';
  lap.style.strokeDasharray = over + ' 100';
  lap.style.opacity = over ? 1 : 0;
});
```

**Rotate the SVG, not the circles.** `transform: rotate(-90deg)` on the `<svg>` puts 0 at 12 o'clock for every ring; keep `overflow: visible` so the lap's drop shadow is not clipped.

```css
.rings { width: 232px; height: 232px; transform: rotate(-90deg); overflow: visible; }
.rings circle { fill: none; stroke-width: var(--ring-w); stroke-linecap: round; }
.arc { stroke-dasharray: 0 100; transition: stroke-dasharray 1200ms var(--expo); }
.lap { stroke-dasharray: 0 100; transition: stroke-dasharray 700ms var(--expo);
       filter: drop-shadow(0 0 3px rgba(0,0,0,.9)); }
```

**Tween numerals from the displayed value**, and cancel the previous frame loop so quick taps don't fight:

```js
function tween(to) {
  cancelAnimationFrame(raf);
  const from = shown.slice(), t0 = performance.now();
  (function step(t) {
    const q = Math.min(1, (t - t0) / 900), e = 1 - Math.pow(1 - q, 4);
    shown = from.map((f, k) => f + (to[k] - f) * e);
    render(shown);
    if (q < 1) raf = requestAnimationFrame(step);
  })(t0);
}
```

Common mistakes: initialising the dasharray in the same frame as the target (no transition fires; wait two `requestAnimationFrame`s on load); drawing overflow by extending the base arc past 100 (it just overlaps itself with no shadow); letting the lap's delay apply when shrinking, which makes day switches feel laggy.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
