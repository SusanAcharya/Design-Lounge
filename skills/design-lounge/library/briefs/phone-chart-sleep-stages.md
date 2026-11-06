<!-- Design Lounge Nº 665 · "Nocturne sleep stages chart" · www.designlounge.live -->

# Nocturne sleep stages chart

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The morning screen of Nocturne, a fictional sleep tracker, for the night of Thursday 5 to Friday 6 November. It is dark first and calm: deep navy cards, one cool-to-warm stage scale (deep blue, light periwinkle, aqua REM, apricot awake) and every number set in Chivo Mono so times and durations line up. Four blocks: a hypnogram you can scrub with a finger, a stage ring with totals, seven nights as stacked bars, and one sentence that says what the night meant. The detail worth copying: the stage colours run from dark to light as sleep gets lighter, so the ring, the bars and the hypnogram rows all read the same way without a legend, and tapping a stage in the legend dims everything else in both the hypnogram and the ring.

## Structure

```
390 × 844, navy ground, cards inset 16
┌──────────────────────────────────────┐
│ 54px clear                           │
│ NOCTURNE · LAST NIGHT        7h25m   │ kicker 11px mono; total 34px mono
│ Thu 5 to Fri 6 November  in bed …    │ 15px / 600; 12px mono
│ ┌──────────────────────────────────┐ │ hypnogram card, r 20, pad 12
│ │ ■ 00:04 Deep sleep  23:46–00:21… │ │ readout 40h
│ │ Awake  ▬    ┊         ▮      ▮   │ │ plot 140h, labels in first 50px
│ │ REM       ▬ ┊   ▬    ▬▬   ▬▬  ▬▬ │ │ rows 37px apart, bars 14h
│ │ Light  ▬ ▬ ▬┊ ▬  ▬ ▬  ▬ ▬  ▬ ▬   │ │
│ │ Deep    (●)━━  ━━  ▬             │ │ handle on the active bar
│ │        00:00  02:00  04:00 06:00 │ │ axis 11px mono
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │ totals card: grid 112px 1fr
│ │ (ring)    ■ Deep   1h 48m  23%   │ │ legend rows 34h
│ │ 7h 25m    ■ Light  3h 23m  44%   │ │
│ │ asleep    ■ REM    2h 14m  29%   │ │
│ │           ■ Awake     20m   4%   │ │
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │ week card
│ │ Seven nights         Goal 7h 30m │ │
│ │ ┄┄┃┄┄┃┄┄┃┄┄┃┄┄┃┄┄┃┄┄┃┄┄┄┄┄┄┄┄┄┄ │ │ 7 × stacked bars 20w, 104 area
│ │ Sat31 Sun1 … Thu5 [Fri 6]        │ │ labels 22h
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │ insight card, 15px / 1.42
│ │ ☾ 1h 48m of deep sleep, 10m more │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

- `header`: kicker, `h1` with the night, total and in-bed range.
- `section.hyp[aria-label]`: `aria-hidden` readout, `div.plot` (pointer surface) with an `aria-hidden` SVG and `div.handle[role=slider][tabindex=0]`, axis.
- `section.tots[aria-label]`: ring SVG (`aria-hidden`) with an HTML centre, `ul.legend` of four `button[aria-pressed]`.
- `section.week`: heading, goal text, `div.bars` with seven `button.night[aria-pressed]`.
- `section.ins[aria-live=polite]` with an icon and one `p`.

## Motion

| What | Trigger | From → to | Duration / easing | Reduced motion |
|---|---|---|---|---|
| Scrub | pointer, keys | follows input | none | same |
| Stage focus (bars) | legend tap | opacity 1 → .22 | 260ms ease | instant |
| Stage focus (ring) | legend tap | opacity 1 → .25 | 260ms ease | instant |
| Ring arcs | night change | dasharray and offset | 600ms expo | instant |
| Insight | night change | opacity .2, y 4px → rest | 360ms ease | instant |
| Night bar hover | hover | scaleY 1.03 | 200ms ease | none |

No looping motion: this is a screen read half awake.

## States

- **Default:** all stages at full opacity, scrub on the first deep stretch.
- **Stage focused:** the legend row filled `--card-2`, `aria-pressed=true`; other stages dimmed in the plot and ring.
- **Active stretch:** 1.5px `--text` outline on the bar under the scrub.
- **Selected night:** day label on a `--text` pill with `--bg` text; others `--text-2`.
- **Not last night:** kicker reads "Nocturne · Mon night".
- **Focus-visible:** 2px `--text` outline, 3px offset; round on the handle.

## Accessibility

- The handle is `role="slider"` in minutes since bedtime with `aria-valuetext` like "00:04, Deep, 35 minute stretch from 23:46". Keys: ← → 5 minutes, ↑ ↓ 30 minutes, Shift × 6, PageDown / PageUp next or previous stretch, Home, End.
- The SVG and the visual readout are `aria-hidden`; the slider value text is the accessible readout.
- Legend buttons say the value and the action ("REM 2h 14m, 29 percent. Highlight in chart"); night buttons say the full date and time asleep.
- Stage changes and night changes are announced in polite live regions; the insight card is itself polite.
- Contrast: `--text-2` on cards is 7:1. Stage colours carry no text; every stage is also named in the readout and legend, so colour is never the only cue.
- Hit targets: legend rows full width × 34 inside a 14px-padded card; night buttons about 46 × 104; the whole plot is the scrub surface.

## Responsive rules

- Column max 430px, centred; the hypnogram reads its width on load and on resize, so bars stay proportional to minutes.
- At 360 wide the readout range ("23:46–00:21 · 35 min") stays on one line at 12px; axis labels stay every two hours.
- If the screen is shorter than 800px, let the page scroll; the hypnogram is first and fully visible.
- On tablet, put the hypnogram full width and the ring, week and insight in three columns below it.

## Acceptance checklist

### Always

- [ ] Four hypnogram rows in the order Awake, REM, Light, Deep, with connectors between stretches.
- [ ] Stage colours step from dark (deep) to light (awake) and match across hypnogram, ring, legend and bars.
- [ ] Scrubbing updates the readout, hairline, handle and active-stretch outline on every move.
- [ ] The ring shows four arcs with gaps and the time asleep plus efficiency in the centre.
- [ ] Legend tap dims other stages in both the plot and the ring; tapping again clears it.
- [ ] Seven stacked bars scaled to time in bed, a dashed goal line, the selected night marked.
- [ ] Choosing a night redraws every block from that night's data.
- [ ] The insight is one plain sentence computed from the data, not a canned line.
- [ ] Slider is keyboard operable with readable value text; scroll width 390.
- [ ] Reduced motion keeps everything except fades and arc tweens.

### This demo

- [ ] Nocturne, Thu 5 to Fri 6 November, in bed 23:08 to 06:53, 7h 25m asleep, 96%.
- [ ] Deep 1h 48m (23%), Light 3h 23m (44%), REM 2h 14m (29%), Awake 20m (4%).
- [ ] Nights Sat 31 to Fri 6, goal 7h 30m.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: last night, 7h 25m asleep, in bed 23:08 to 06:53. The scrub sits in the middle of the first deep stretch: the readout reads "00:04 · Deep sleep · 23:46–00:21 · 35 min" and that segment has a 1.5px light outline.
2. Hypnogram: four rows (Awake, REM, Light, Deep, top to bottom, 37px apart). Each stretch is a 14px-tall rounded bar on its row, coloured by stage; thin vertical connectors (`#3A4870`, 1.5px) join consecutive stretches. Hour grid lines every hour, axis labels every two hours.
3. Pointer down anywhere on the plot seeks there and captures the pointer; moving keeps scrubbing. A dashed hairline and a 14px handle (light disc with a 3px navy ring) sit on the active stretch. The readout above the plot updates every move: clock, stage, stretch range and length.
4. Ring: 112px donut, 13px stroke, arcs in the order Deep, Light, REM, Awake with 3px gaps, starting at 12 o'clock. The centre reads the time asleep (in-bed minus awake) and "asleep · 96%" (sleep efficiency).
5. Legend: four rows (Deep, Light, REM, Awake) with duration and share. Tapping one sets a focus: its row fills, other hypnogram bars fade to 22% opacity, other ring arcs to 25%. Tapping it again clears the focus.
6. Seven nights: Sat 31 to Fri 6, one stacked bar per night (20px wide, deep at the bottom, awake on top), height proportional to time in bed (9h = 72px). A dashed goal line marks 7h 30m. The selected night's day label sits on a light pill.
7. Tapping a night switches the whole screen to that night: header, hypnogram, ring, legend and insight; the kicker changes from "Last night" to "Mon night".
8. Insight: one sentence built from the data, for example "1h 48m of deep sleep, 10m more than your week. 74% of it came before 02:00, and you woke once in the night." It fades up (opacity .2 → 1, 4px, 360ms) each time it changes.

## Tokens

```css
:root {
  --bg: #0B1120;       /* screen */
  --card: #121A2E;     /* cards */
  --card-2: #18223A;   /* focused legend row */
  --line: #243150;     /* card border */
  --grid: #1C2741;     /* row and hour lines, ring track */
  --link: #3A4870;     /* hypnogram connectors */
  --goal: #5C6A8C;     /* dashed goal line */
  --text: #E8ECF6;
  --text-2: #9AA6C2;   /* 7:1 on --card */
  /* stage scale: dark = deep, light = awake */
  --deep: #4F6BD0;
  --light: #7E9BEA;
  --rem: #6FD3C1;
  --awake: #F3B27A;
  --sans: "Chivo", system-ui, sans-serif;
  --mono: "Chivo Mono", ui-monospace, monospace;
  --fs-total: 34px; --fs-ring: 18px; --fs-read: 15px; --fs-title: 15px; --fs-insight: 15px;
  --fs-body: 14px; --fs-mono-sm: 12px; --fs-label: 11px;
  --r-card: 20px; --r-row: 10px; --r-bar: 4px; --r-stack: 5px;
  --row-gap: 37px; --bar-h: 14px; --handle: 14px; --ring: 112px; --ring-stroke: 13px; --stack-w: 20px;
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --t-dim: 260ms; --t-ring: 600ms; --t-insight: 360ms; --t-hover: 200ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking |
|---|---|---|---|---|---|
| Total asleep | Chivo Mono | 34px, units 17px in `--text-2` | 500 | 1 | −0.03em |
| Ring centre | Chivo Mono | 18px | 500 | 1 | −0.02em |
| Readout clock | Chivo Mono | 15px | 500 | 1 | 0 |
| Night title | Chivo | 15px | 600 | 1.4 | 0.01em |
| Insight | Chivo | 15px (lead 600) | 400 | 1.42 | 0 |
| Stage name, card heading | Chivo | 14px | 500–600 | 1.4 | 0 |
| Durations | Chivo Mono | 13px | 500 | 1 | 0 |
| Ranges, shares, axis, days | Chivo Mono | 11–12px | 400 | 1 | 0 |
| Kicker | Chivo Mono | 11px | 500 | 1 | 0.12em, upper |

## Implementation notes

**Model the night as stretches, draw everything from them.** One array of `{ s, a, b }` (stage, start minute, end minute) feeds the hypnogram, the totals, the ring, the week bars and the insight:

```js
const tot = (n) => { const t = [0, 0, 0, 0]; n.segs.forEach(g => t[g.s] += g.b - g.a); return t; };
const X = (m, n, W) => L + (m - n.start) / (n.end - n.start) * (W - L - 4);
n.segs.forEach((s, i) => {
  const x = X(s.a, n, W), w = Math.max(2, X(s.b, n, W) - x);
  g += `<rect class="seg" data-i="${i}" x="${x}" y="${TOP + s.s * ROW - 7}" width="${w}"
          height="14" rx="${Math.min(4, w / 2)}" fill="${ST[s.s][1]}"/>`;
});
```

Clamp the radius to half the width: two-minute awakenings are 2px wide and a 4px radius would turn them into nothing.

**Ring arcs with gaps.** Use one circle per stage with `stroke-dasharray` and a running offset; subtract the gap from each arc, not from the circumference:

```js
const C = 2 * Math.PI * 54; let off = 0;
[3, 2, 1, 0].forEach(k => { const len = t[k] / all * C;
  g += `<circle r="54" cx="64" cy="64" stroke="${ST[k][1]}"
          stroke-dasharray="${Math.max(0, len - 3)} ${C}" stroke-dashoffset="${-off}"/>`;
  off += len; });
```

**The insight is arithmetic, not copy.** Compare the night's deep sleep to the seven-night mean, then measure how much of it fell before 02:00 (minute 1560 counting from the previous midnight) and count awakenings that are not the first or last stretch. Say "right on your weekly average" when the difference is under 4 minutes.

Put `role="slider"` on the small HTML handle with `pointer-events:none`, and let the plot take the pointer, so the control has a visible edge and drags start anywhere. Common mistakes: using a rainbow of unrelated stage colours, drawing the hypnogram as a smoothed line (stages are discrete), and placing labels on the coloured bars.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
