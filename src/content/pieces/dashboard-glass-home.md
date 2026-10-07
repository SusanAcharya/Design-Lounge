---
title: "Glass dashboard home"
summary: "A home-energy dashboard as frosted panels over one drawn sky: a glass bar, an 88px live number, an SVG generation curve, a battery ring and a device list, with a solid fallback."
platform: web
type: screen
category: dashboard
tags: [dashboard, glass, energy, chart, home]
styles: [glass, minimal]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-07
palette: ["#DFEAF6", "#F7FAFD", "#0F1B2D", "#1F5FD6", "#1A8A7A", "#FFD58A"]
fonts: ["Sora"]
related: [widget-weather-glance, analytics-dashboard-overview, ios-glass-tab-bar]
---

# Glass dashboard home

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. This is glassmorphism done as a system: one scene layer, frosted panels, a solid fallback, and contrast measured on the blurred ground. Do not add a second gradient or a blob.

## What it is

The home screen of Sunroof, a fictional rooftop-solar monitor. One fixed scene sits behind everything: a pale sky gradient, a sun disc with a soft glow, and two drawn hills along the bottom. Every piece of interface is a frosted panel: frost-white at 64% opacity, a 20px blur with 140% saturation, a 1px line at 72% white, a 16px radius, and a one-pixel inner highlight along the top. The answer is the biggest thing on the screen: 88px "3.8 kW" generating now, with a four-cell strip showing where it goes (roof, house, battery, grid). Beside it an SVG area chart draws the day's curve with a dot on the current hour; below, three cards: a battery ring at 62%, the house's four live loads, and today's export with a pause button. A Today / This week segmented control redraws the chart and the number. The detail worth copying is the contrast discipline: the muted ink is `#4a5870`, not a lighter grey, because it is measured against the glass *blended with the darkest hill under it*, where it still passes 4.5:1.

## Reference behaviour

1. First frame: the scene, then the bar and five panels fade up 12px in sequence (0, 60, 120, 180, 240, 300ms). Bar: Sunroof mark, "Tuesday 7 October · 13:42 · 21°C, clear", segmented Today (pressed) / This week, an account circle "MH". Now panel: "GENERATING NOW", 3.8 kW, one sentence, the four-cell flow strip with Roof highlighted in cobalt. Chart: "Generation", "Today, 06:00 to 20:00 · kW", a curve from 0 at 06 to a 4.6 peak near 13, the dot at 14:00, x labels 06 to 20, y labels 5 / 2.5 / 0. Cards: Battery 62% ring, House 1.1 kW with four loads, Exported today 9.4 kWh with "Pause export".
2. Click "This week": the chart redraws as seven daily bars-worth of points (Wed to Tue), the y axis becomes 30 / 15 / 0, the big number becomes 25.6 kWh, the sentence changes. Click "Today": back.
3. Click "Pause export": the button fills ink and reads "Resume export"; the export sentence changes to "Export paused…". Click again to resume.
4. Hover the pause button: its fill goes from 60% white to 90% white in 200ms. Pressed state hover: `--ink-2`.
5. The battery ring's arc animates from empty to 62% over 600ms on load (reduced motion: it is drawn at 62% at once).
6. When `backdrop-filter` is not supported, every panel is frost-white at 94% with no blur. Nothing else changes.

## Structure

```
1280 × 800   scene: fixed, sky gradient top → 70%, sun 150px at right 14% / top 9%, two hills in the bottom 34%
wrap max 1220, padding 22/30, grid rows gap 18
┌ bar 60 (glass) ─────────────────────────────────────────────────────────────────┐
│ ● Sunroof   Tuesday 7 October · 13:42 · 21°C, clear       (Today | This week) (MH) │
├ grid 420 | 1fr, gap 18 ──────────────────────────────────────────────────────────┤
│ ┌ now ──────────────────┐  ┌ chart ─────────────────────────────────────────────┐ │
│ │ GENERATING NOW        │  │ Generation            Today, 06:00 to 20:00 · kW   │ │
│ │ 3.8 kW   88/800       │  │ 5 ─────────────────────────────────────────────── │ │
│ │ one sentence          │  │ 2.5 ────────────╱──╲──────────────────────────── │ │
│ │ [3.8][1.1][1.2][1.5]  │  │ 0 ──────╱───────────────╲────────── area + line  │ │
│ │ Roof House Batt Grid  │  │ 06   08   10   12   14   16   18   20   (190 tall)│ │
│ └───────────────────────┘  └────────────────────────────────────────────────────┘ │
├ row 1fr | 1fr | 1.3fr, gap 18 ──────────────────────────────────────────────────┤
│ ┌ Battery  13.5 kWh ─┐ ┌ House, 1.1 kW  4 of 9 on ─┐ ┌ Exported today  at 0.11 ─┐ │
│ │ (ring 76) 62%      │ │ ● Heat pump          0.6  │ │ 9.4 kWh  30/800           │ │
│ │ Full by 15:10…     │ │ ● Fridge             0.1  │ │ About 1.03 earned…        │ │
│ └────────────────────┘ │ ● Workshop           0.3  │ │ [Pause export] 40 pill    │ │
│                        └───────────────────────────┘ └───────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────┘
```

- `div.scene[aria-hidden]` (fixed, z 0) → `span.sun`, an SVG with two hill paths.
- `main.wrap` (z 1) → `header.panel.bar`, `div.grid` (`section.panel.now`, `section.panel.chart`), `div.row3` (three `section.panel.card`).
- Every section is labelled by its own heading (`aria-labelledby`). The chart SVG is `role="img"` with a sentence label.

## Tokens

```css
:root {
  /* scene */
  --sky-1: #cfe2f6;  --sky-2: #e9f2fb;  --sun: #ffd58a;  --hill: #b9d4c3;  --hill-2: #a9c8b4;
  /* ink, chosen against the blurred ground */
  --ink: #0f1b2d;  --ink-2: #3b4a62;  --ink-3: #4a5870;
  --line: rgba(255,255,255,.72);        /* panel edge */
  --line-ink: rgba(15,27,45,.12);       /* grid lines, inner cells */
  /* glass */
  --glass: rgba(247,250,253,.64);       /* --surface at 64% */
  --glass-solid: rgba(247,250,253,.94); /* the fallback */
  --blur: 20px;
  /* roles */
  --primary: #1f5fd6;  --primary-ink: #ffffff;  --primary-soft: rgba(31,95,214,.14);
  --secondary: #1a8a7a;  --tertiary: #d9792a;

  --sans: "Sora", system-ui, sans-serif;
  --r: 16px;  --r-sm: 10px;
  --shadow: 0 16px 40px -20px rgba(15,27,45,.28);
  --t-micro: 200ms;  --t-in: 600ms;
  --ease: cubic-bezier(.2,.7,.2,1);  --expo: cubic-bezier(.16,1,.3,1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| The number | Sora | 88px | 800 | 0.95 | −0.045em | tabular numerals; unit 26px/600 |
| Card figure | Sora | 30px | 800 | 1 | −0.03em | numerals |
| Flow cell figure | Sora | 20px | 800 | 1 | −0.03em | numerals |
| Wordmark | Sora | 17px | 800 | 1 | −0.02em | sentence |
| Panel heading | Sora | 15–17px | 600 | 1.3 | −0.01em | sentence |
| Body, list row | Sora | 14–15px | 400 | 1.5 | 0 | sentence |
| Segment, button | Sora | 14px | 600 | 1 | 0 | sentence |
| Label | Sora | 12px | 600 | 1 | +0.06em | UPPERCASE, `--ink-3` |
| Axis | Sora | 11px | 400 | 1 | 0 | numerals, `--ink-3` |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
|---|---|---|---|---:|---|
| `.panel.in` | load | opacity, transform | 0, 12px → 1, 0; delays 0 / 60 / 120 / 180 / 240 / 300ms | 600ms | `--expo` |
| `.ring .val` | load | stroke-dashoffset | 201 → 76 (62% of a 201 circumference) | 600ms | `--expo` |
| `.seg button` | press | background, color | transparent → `--ink`, `--ink-2` → white | 200ms | `--ease` |
| `.btn` | hover / press | background, color | 60% white → 90% white; pressed → `--ink` | 200ms | `--ease` |
| chart paths | range change | `d` attribute | redrawn at once (no tween) | 0 | – |

Reduced motion: no entry animation, no ring sweep, 1ms transitions. The glass itself never moves; blur stays on elements that do not animate their position.

## States

- **Panel:** frosted (64% + 20px blur). **No `backdrop-filter`:** 94% solid, same border and shadow.
- **Segment:** pressed = ink fill, white text; unpressed = `--ink-2` text on 50% white.
- **Flow cell:** `.on` figure in `--primary`; the rest `--ink`.
- **Pause button:** default 60% white pill with an ink hairline; hover 90% white; pressed (`aria-pressed`) ink fill, white text, "Resume export"; pressed hover `--ink-2`.
- **Battery ring:** teal arc on a 12% ink track; the percentage and the sentence are real text.
- **List row:** teal dot when the load is on, `--ink-3` dot when off.

## Accessibility

- Contrast on the blurred ground: blend `--glass` (64%) with the darkest hill `#a9c8b4` → about `#dbe7df`. On that: `--ink` 13.4:1, `--ink-2` 7.3:1, `--ink-3` 5.6:1, `--primary` 4.9:1, the teal ring 3.4:1 (non-text). On the sky the numbers are higher. Keep `--ink-3` at least this dark; do not lighten it to "look softer".
- The segmented control and the pause button use `aria-pressed`; the account button has an `aria-label`. The chart SVG has a sentence label; the data is also in the number and the sentence beside it, so the chart is not the only source.
- Every panel is a `<section>` labelled by its heading. The scene is `aria-hidden` and `pointer-events: none`.
- Focus ring: 2px `--primary` at 3px offset on every control, visible over glass.
- Hit targets: segments 34px tall in a 40px pill, account 40px, pause 40px.

## Responsive rules

- ≥ 1280: grid 420 | 1fr; three cards 1fr 1fr 1.3fr; the number 88px.
- 1024–1279: grid 360 | 1fr; the number 72px; chart 170px tall.
- 768–1023: one column; the now panel first, then the chart, then the three cards in a row of three at 1fr each; the bar's date shortens to "Tue 7 Oct · 13:42".
- < 640: padding 16px; the number 64px; the flow strip 2×2; cards stack; the bar keeps the segmented control and drops the date to a second line. Blur stays; panels stay 64% (do not raise opacity on phones unless the scene is a photo with dark areas).

## Acceptance checklist

**Always**
- [ ] Exactly one scene layer, fixed, behind every panel. No blob, no second gradient on a panel, no glass panel sitting on another glass panel.
- [ ] Every panel is `--surface` at 60 to 75% with `backdrop-filter: blur(16 to 24px)`, a 1px light line, the family radius, and a solid 90%+ fallback under `@supports not (backdrop-filter: blur(1px))`.
- [ ] One number at display size (the answer); every other figure steps down to 30px or less.
- [ ] The chart is inline SVG from an array; switching the range redraws paths, axes, the big number and the sentence.
- [ ] Body text passes 4.5:1 and lines and icons 3:1 measured against the panel blended with the darkest scene colour under it; the brief's `--ink-3` or darker.
- [ ] Segments and the pause button are `aria-pressed` buttons; each section has a heading it is labelled by.
- [ ] Reduced motion: no entry animation, no ring sweep.
- [ ] The scene and the blur stay still; nothing with blur animates its position.

**This demo**
- [ ] Sunroof, 3.8 kW now, peak 4.6 at 12:50, flow 3.8 / 1.1 / 1.2 / 1.5, battery 62% of 13.5 kWh, four loads summing to 1.1, export 9.4 kWh; the week view shows 25.6 kWh and 147.6 kWh.

## Implementation notes

**The panel, with its fallback:**

```css
.panel { background: var(--glass); -webkit-backdrop-filter: blur(var(--blur)) saturate(140%); backdrop-filter: blur(var(--blur)) saturate(140%);
  border: 1px solid var(--line); border-radius: var(--r); box-shadow: var(--shadow), inset 0 1px 0 rgba(255,255,255,.9); }
@supports not (backdrop-filter: blur(1px)) { .panel { background: var(--glass-solid); } }
```

**Measure contrast on the blend, once, in code review:**

```js
const blend = (fg, a, bg) => fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));
// glass over the darkest hill: blend([247,250,253], .64, [169,200,180]) → [219,232,227]
// then check each ink against that with any WCAG contrast function
```

**The chart from an array**, so the range switch is one function:

```js
const xy = pts.map((v, i) => [i * (W / (pts.length - 1)), TOP + H - (v / max) * H]);
const d = xy.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' ');
line.setAttribute('d', d);  area.setAttribute('d', d + ` L${W} ${TOP + H} L0 ${TOP + H}Z`);
```

Common mistakes: a lighter grey for captions that passes on white but not on the blend; blur on a panel that slides in (it stutters); a gradient on the panel as well as the scene; forgetting `-webkit-backdrop-filter`; raising the panel opacity to 90% everywhere, which is no longer glass, instead of fixing the ink.
