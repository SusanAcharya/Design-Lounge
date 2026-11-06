---
title: "Saltmere tide chart"
summary: "A full-bleed tide chart where the sea is the chart: scrub with a finger, a glass readout follows, and the sky behind turns to the scrubbed hour."
platform: mobile-app
type: screen
category: charts
tags: [tide, chart, scrub, drag, weather, select]
styles: [glass, minimal, organic]
motion: subtle
difficulty: 2
featured: false
published: 2026-11-06
palette: ["#7BA6D2", "#E9D9C6", "#2C6A88", "#0B2C41", "#0E2233"]
fonts: ["Schibsted Grotesk", "DM Mono"]
related: [ios-weather-hourly-scrub, premium-manual-camera, slider-range-histogram]
---

# Saltmere tide chart

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The tides screen of a fictional harbour app for Saltmere Harbour. The whole screen is the chart: 24 hours run edge to edge, and the area under the tide curve is filled as sea, deep navy at the bottom and translucent teal at the surface, so the water literally rises and falls across the day. Drag anywhere and a glass readout rides the curve with the time, height, rising or falling rate and the next turn, while the sky gradient behind the water changes to that hour: navy before dawn, rose at sunrise, pale blue at noon, amber at sunset. Sunrise and sunset are dotted marigold lines with dark tags; a glass header lists the day's highs and lows; a dark glass day switcher picks one of seven days and the curve morphs. iOS 26-style glass, one calm material, one primary interaction. The detail worth copying: the sky is not decoration, it is a second readout of the scrubbed time, so you can read "it's dark at the 06:00 high" without a label.

## Reference behaviour

1. First frame: Thursday 6 November, scrubbed to now (14:20). The handle (22px navy disc, 3px white ring) sits on the curve at 1.73 m; the readout above it reads "14:20 · THU / 1.73 m / Rising 0.99 m/h / High 18:13 in 3h 53m". The sky is the 14:20 mix of `#7FB2DE → #DCEBF4` and `#7BA6D2 → #E9D9C6`. Header: "▲ 05:48 5.0  ▼ 12:05 0.5  ▲ 18:13 4.7". A pulsing "now" dot (2.4s, scale 1 → 3.2, fade) marks 14:20 on the curve.
2. Pointer down anywhere below the sun tags (y > top − 70): pointer capture; time = x / width × 24h. Move scrubs continuously; the hairline, handle, readout, sky and `aria-valuetext` follow every move.
3. Readout placement: 176px wide, centred on the handle, clamped 12px from each edge, 22px above the handle; if that would rise above the chart top, it flips to 24px below.
4. Trend: rate = central difference over ±3 minutes. |rate| < 0.08 m/h reads "Slack water" with the arrow turned 90°; otherwise "Rising 0.42 m/h" (arrow up) or "Falling 0.79 m/h" (arrow rotated 180°, 240ms).
5. Next turn: the next high or low after the scrubbed time, rolling into tomorrow's first turn after the last one ("Low 02:52 in 3h 28m").
6. Sky: ten keyframes by hour (below), smoothstepped between neighbours, written to `--sky-a` and `--sky-b` on `body`, painted as `linear-gradient(180deg, a, b 62%)`.
7. Release: the scrub stays where it is and the live region reads the value. A "Now" pill appears in the header's top-right whenever the scrub is not at 14:20 on Thursday; it returns to Thursday 14:20 and focuses the handle.
8. Day switcher: seven buttons Thu 6 … Wed 12. Choosing a day morphs every curve point from the old day to the new (520ms, quartic out), moves the extremes, sunrise and sunset, rewrites the header (four extremes on most days), and keeps the scrubbed time of day. The now dot shows only on Thursday.
9. Keyboard on the handle: ← → (and ↓ ↑) move 10 minutes, Shift 60 minutes, snapped to 10-minute marks; Home 00:00, End 23:59; PageDown / PageUp next or previous day.
10. Tide model: h(d, t) = 2.66 + A·cos(2π(t − tH)/12.42) + 0.16·cos(2π(t − tH)/24.84), with tH = 5.8 + 0.84·d hours and A = 1.9 + 0.32·cos(2π(d + 1)/14.77). Extremes are found where the rate changes sign (0.05h scan, 20-step bisection).
11. Sunrise 07:11 + 2 min/day; sunset 16:26 − 1.5 min/day.

## Structure

```
390 × 844, full-bleed SVG chart behind three glass layers
┌──────────────────────────────────────┐
│ 54px clear                           │
│ ┌──────────────────────────────────┐ │ header card: top 62, inset 16, r 22
│ │ SALTMERE HARBOUR · TIDES  (Now)  │ │ 11px mono caps; Now pill 32h
│ │ Thursday 6 November              │ │ 24px / 600
│ │ ──────────────────────────────── │ │
│ │ ▲05:48 5.0   ▼12:05 0.5  ▲18:13 4.7│ 11px mono, space-between
│ └──────────────────────────────────┘ │
│   (◠ Rise 07:11)      (◠ Set 16:26)  │ tags: 106 × 24, at top − 58
│         ┊       ╭─╮   ┊       ╭╮    │ chart top = max(250, 30% H)
│  ╭─╮    ┊      ╱   ╲  ┊      ╱  ╲   │ 4 m ┐ grid every 1 m, labels
│ ╱   ╲   ┊ ┌readout┐   ╲┊    ╱    ╲  │ 3 m │ in 34 × 20 dark pills
│╱     ╲  ┊ │14:20  │    ╲   ╱      ╲ │ 2 m │ at right − 46
│       ╲ ┊ │1.73 m │     ╲ ●       ╲│ 1 m ┘
│  sea   ╲┊ └───────┘      ╲╱         │ chart bottom = H − 150 (0 m)
│  03   06   09   12   15   18   21    │ axis labels at H − 122
│ ┌──────────────────────────────────┐ │ day switcher: bottom 34, pad 6
│ │[THU 6] FRI 7  SAT 8 … WED 12     │ │ 7 × 48h buttons, gap 2
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

- `svg.chart` (fixed, `aria-hidden`): `g#sunm` (sun lines and tags), `path#fill` (sea), `g#grid` (height lines and pills, drawn over the sea), `path#sheenP`, `path#line` (2px crest), `g#exts`, `g#axis`, `g#nowm`, `line.hair`.
- `div.handle[role=slider]`: the focusable scrub handle, positioned with a transform.
- `header.card.head`: kicker, `h1#date`, `ul.ext` (one `li` per extreme with an `aria-label`), `button.now`.
- `div.read` (aria-hidden; values reach screen readers through the slider and live region).
- `nav.card.days` with seven `button.day[aria-pressed]`.

## Tokens

```css
:root {
  /* sky, rewritten per scrubbed hour */
  --sky-a: #7BA6D2;  --sky-b: #E9D9C6;
  /* sea */
  --sea-top: #2C6A88;   /* 90% at the surface */
  --sea-mid: #14435E;
  --sea-deep: #0B2C41;
  --crest: #F4FAFC;     /* curve stroke, handle ring */
  /* glass */
  --glass: rgba(250,252,253,.8);
  --glass-line: rgba(255,255,255,.7);
  --glass-dark: rgba(7,25,37,.72);  /* day switcher, chart pills */
  --blur: saturate(1.4) blur(18px);
  --shadow: 0 10px 30px -12px rgba(7,25,37,.35);
  /* ink */
  --ink: #0E2233; --ink-2: #3A5163; --ink-inv: #EEF5F8; --ink-inv-2: #C3D5DF;
  --sun: #F2A55C;       /* sunrise and sunset lines and icons */
  /* type */
  --sans: "Schibsted Grotesk", system-ui, sans-serif;
  --mono: "DM Mono", ui-monospace, monospace;
  --fs-height: 34px; --fs-date: 24px; --fs-day: 17px; --fs-trend: 13px; --fs-mono: 11–12px;
  /* shape */
  --r-card: 22px; --r-read: 18px; --r-day: 16px; --r-pill: 999px;
  --handle: 22px; --read-w: 176px;
  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --t-morph: 520ms; --t-ui: 200ms; --t-arrow: 240ms; --t-pulse: 2.4s;
}
```

Sky keyframes `[hour, top, bottom]`: 0 `#0B1426 #1C2A44` · 5.2 `#101C36 #2B3656` · 6.6 `#2D3E6A #D9937E` · 8.2 `#6F9CCB #F1D2B6` · 12 `#7FB2DE #DCEBF4` · 15 `#7BA6D2 #E9D9C6` · 16.4 `#3E5584 #F0A779` · 17.6 `#1A2648 #5B4D6E` · 20 `#0E1830 #1F2B48` · 24 = 0.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking |
|---|---|---|---|---|---|
| Readout height | Schibsted Grotesk | 34px (unit 16px/500) | 600 | 1 | −0.03em, tabular |
| Date | Schibsted Grotesk | 24px | 600 | 1.1 | −0.02em |
| Day number | Schibsted Grotesk | 17px | 600 | 1.1 | 0 |
| Trend, Now | Schibsted Grotesk | 13px | 500–600 | 1.35 | 0 |
| Readout time, extremes | DM Mono | 12px / 11px | 500 / 400 | 1.2 | 0.04em |
| Kicker, day name | DM Mono | 11px / 10px | 500 | 1 | 0.14em / 0.08em, upper |
| Chart labels (03, 4 m, Rise 07:11) | DM Mono | 11px | 500 | 1 | 0 |

## Motion

| What | Trigger | From → to | Duration / easing | Reduced motion |
|---|---|---|---|---|
| Scrub (hairline, handle, readout, sky) | pointer move, keys | follows input | none (1:1) | same |
| Curve morph | day change | old points → new points | 520ms quartic out | instant |
| Trend arrow | trend change | rotate 0 / 90 / 180° | 240ms `--ease` | instant |
| Now dot pulse | always on Thursday | scale 1 → 3.2, opacity .6 → 0 | 2.4s `--ease`, infinite | hidden |
| Now pill | scrub leaves now | opacity 0 → 1 | 200ms `--ease` | instant |
| Day button | select | background, colour | 200ms `--ease` | instant |

## States

- **At now:** Now pill hidden (`visibility:hidden`), pulse visible.
- **Scrubbed away:** Now pill visible in the header.
- **Day selected:** button filled `--ink-inv` with `--ink` text, day name `--ink-2`.
- **Slack water:** trend reads "Slack water", arrow horizontal.
- **Readout flipped:** below the handle when it would cross the chart top.
- **Night hours:** sky goes navy; glass cards keep dark ink because they are 80% white.
- **Focus-visible:** handle gets a 2px white outline with a 7px navy halo; buttons a 2px `--ink` outline, 3px offset.

## Accessibility

- The handle is `role="slider"` with values in minutes (0–1439) and `aria-valuetext` like "14:20, 1.73 metres, rising"; it lists its shortcuts in `aria-keyshortcuts`.
- The chart SVG and the floating readout are `aria-hidden`; the slider, header list and live region carry the meaning.
- Each extreme `li` has an `aria-label` such as "High 4.70 metres at 18:13".
- Day buttons are `aria-pressed` with full labels ("Sunday 9 November"); day changes announce the date and the reading.
- Contrast: every text over the sky or sea sits on glass (80% white) or a dark pill (`rgba(7,25,37,.72)`), above 4.5:1 at every hour.
- Hit targets: the whole chart is the scrub surface; day buttons ~46 × 48; Now 32px tall inside a 22px-radius card.

## Responsive rules

- The chart reads `innerWidth` and `innerHeight` on load and on resize: chart top = max(250, 30% of height), chart bottom = height − 150, so 360 wide and 1280 wide both keep the full 24 hours edge to edge.
- Header and day switcher are inset 16px with a 420px max width, centred on wide screens.
- At 360 wide the header extremes stay on one line at 11px with `space-between`.

## Acceptance checklist

### Always

- [ ] The area under the curve is the sea, filled to the bottom of the screen.
- [ ] Scrubbing moves the hairline, handle, readout and sky together, 1:1 with the finger.
- [ ] The sky is interpolated from hour keyframes with smoothstep.
- [ ] Readout clamps 12px from the edges and flips below near the top.
- [ ] Trend wording covers rising, falling and slack; the next turn rolls into tomorrow.
- [ ] Sunrise and sunset lines and tags move with the day.
- [ ] Day change morphs the curve and keeps the scrubbed time.
- [ ] Keyboard: arrows, Shift, Home, End, PageUp, PageDown.
- [ ] All chart text sits on glass or a dark pill; scroll width is 390.
- [ ] Reduced motion: no morph, no pulse; scrubbing unchanged.

### This demo

- [ ] Saltmere Harbour, Thursday 6 November to Wednesday 12 November.
- [ ] Now is 14:20 Thursday: 1.73 m, rising 0.99 m/h, high 18:13 in 3h 53m.
- [ ] Thursday extremes 05:48 5.0 m, 12:05 0.5 m, 18:13 4.7 m; sunrise 07:11, sunset 16:26.

## Implementation notes

**One sample array drives the line, the sea and the readout.** Sample every 15 minutes, draw from it, and read heights back by linear interpolation so the handle sits exactly on the drawn line, even mid-morph:

```js
const curve = (d) => { const a = []; for (let h = 0; h <= 24; h += 0.25) a.push(tide(d, h)); return a; };
function draw(vals) {
  shown = vals;
  const d = vals.map((v, i) => (i ? 'L' : 'M') + X(i * 0.25) + ' ' + Y(v)).join('');
  line.setAttribute('d', d);
  sea.setAttribute('d', d + `L${W} ${H}L0 ${H}Z`);
}
const at = (h) => { const i = Math.min(shown.length - 2, Math.floor(h / 0.25)), k = h / 0.25 - i;
  return shown[i] + (shown[i + 1] - shown[i]) * k; };
```

**Sky from keyframes.** Find the two neighbours, smoothstep, mix hex channels:

```js
function sky(h) {
  let i = 0; while (SKY[i + 1][0] < h) i++;
  const [h0, a0, b0] = SKY[i], [h1, a1, b1] = SKY[i + 1];
  const k = (h - h0) / (h1 - h0), e = k * k * (3 - 2 * k);
  body.style.setProperty('--sky-a', mix(a0, a1, e));
  body.style.setProperty('--sky-b', mix(b0, b1, e));
}
```

**Keep the slider an HTML element.** Making the whole SVG the slider gives it no visible edge and a focus ring around the screen. Use a small HTML handle positioned on the curve (`pointer-events: none` so drags fall through to the chart) and put `role="slider"` on it.

Common mistakes: drawing grid labels under the sea fill (they vanish at high water), letting the readout run off the right edge after 21:00, and recolouring header text with the sky instead of keeping it on glass.
