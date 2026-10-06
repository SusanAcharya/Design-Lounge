<!-- Design Lounge Nº 160 · "Weather with an hourly scrubber" · www.designlounge.live -->

# Weather with an hourly scrubber

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The main screen of a weather app for Porto, in an iOS 26 language: a full-bleed sky gradient, a 168px hairline-weight temperature, and Liquid-glass cards (translucent white, 26px backdrop blur, inset top highlight). The hourly card holds a smooth 24-hour temperature curve with rain bars underneath. Drag anywhere along it and a playhead snaps hour by hour; the whole screen follows: the three-stop sky gradient cross-fades to that hour's palette, a sun (or moon at night) slides along an arc behind the type, clouds thicken or thin, and the big numeral, condition, time pill and three stat tiles update. The detail that makes it: the sky colours are registered `@property` colours, so the gradient itself transitions instead of snapping.

## Structure

```
390 × 844 (status bar drawn by the Lounge)
┌──────────────────────────────────────┐ 0
│ fixed .sky gradient + clouds + orb   │ behind everything
│            ➤ My location             │ 70   15/500 ink-2
│                Porto                 │ 30/400
│               21°            (sun)   │ 168/200, ° at .42em
│               Clear                  │ 21/400
│            H 21°  L 12°              │ 15 ink-2
│           (• Now · 17:00)            │ pill 28h
│ ┌──────────────────────────────────┐ │ ~425
│ │ TODAY · HOURLY       BACK TO NOW │ │ 12/500 caps, hairline below
│ │ ☰   ☼   ☼   ☁   ☼   ☾   ⛆   ⛆    │ │ icons every 3 h, 20px
│ │      ╭───●───╮                   │ │ curve 84h, knob 16
│ │ ────╯    │    ╰─────╮___ ▂▃▅▆▅▃ │ │ rain bars
│ │ 06  09  12 15 18  21  00  03     │ │ ticks 12px
│ └──────────────────────────────────┘ │ ~635
│ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│ │RAIN  0% │ │WIND 14  │ │FEELS 20°│  │ 3 tiles
│ └─────────┘ └─────────┘ └─────────┘  │ ~726
│ Sunrise 07:24 / Sunset 19:12 / Air 32│ 13px
└──────────────────────────────────────┘
```

- `.sky` is `position: fixed; inset: 0`, `aria-hidden`. It contains three blurred cloud ellipses (220×70, 180×56, 140×44, `filter: blur(18px)`, white at 55%) and the `.orb`.
- `<main>` scrolls over it, `padding: 70px 16px 48px`.
- `<p class="temp" aria-live="polite">` holds the numeral and a `<sup>°</sup>`.
- `<section class="card hourly" aria-label="Hourly forecast">`: `<header>` with label and a `<button>` "Back to now"; `.scrub` `role="slider"` containing `.icons` (absolutely positioned SVG `<use>`), an `<svg>` with rain `<rect>`s, an area path and a line path, a `.now-dot`, the `.head` playhead (1px line + 16px `<b>` knob) and `.ticks`.
- `.tiles` is a 3-column grid of glass cards.
- Weather icons are `<symbol>`s in one hidden SVG sprite: sun, partly cloudy, moon, rain, mist.

## Motion

| Element           | Trigger        | Property                     | From → To                         | Duration | Easing     |
|-------------------|----------------|------------------------------|-----------------------------------|---------:|------------|
| `:root` sky vars  | hour change    | `--sky-top/mid/bot`          | previous palette → hour palette   | 600ms    | `--ease`   |
| `.orb`            | hour change    | transform (translate)        | arc position → arc position       | 600ms    | `--spring` |
| `.orb` sun ↔ moon | crossing 07/20 | background swap              | instant (class change)            | —        | —          |
| `.cloud` ×3       | hour change    | opacity, translateX          | .12–.95; ±3–4px per hour from now | 600ms / 1200ms | `--ease` |
| `.head`           | hour change    | translateX                   | hour x → hour x                   | 160ms    | `--spring` |
| `.head b` (knob)  | hour change    | top                          | curve y → curve y                 | 160ms    | `--spring` |
| knob              | drag start/end | scale                        | 1 → 1.18 → 1                      | 160ms    | `--spring` |
| live dot          | at / away from now | opacity                  | 1 ↔ 0                             | 160ms    | `--ease`   |

Orb arc: day (07–19) `f = (h − 7) / 12`, night `f = ((h − 20 + 24) % 24) / 11`; `x = 30 + f × (vw − 60)`, `y = 180 − sin(fπ) × 136`.

Cloud opacity by condition: partly cloudy .9, mist .95, rain .75, sunny/clear .3, clear night .12.

Reduced motion: all transitions 1ms; the sky, orb and playhead jump to each hour.

## States

- **Live (index = now):** pill text "Now · 17:00", 6px white dot visible.
- **Scrubbed:** pill shows the hour only ("08:00"); after midnight prefix "Sat · ".
- **Dragging:** `.scrub.drag`, knob scale 1.18; cursor `ew-resize` throughout.
- **Focus-visible (slider):** `box-shadow: 0 0 0 2px #fff` around the 150px scrub area, radius 12px.
- **Focus-visible (Back to now):** 2px white outline, 2px offset, 4px radius.
- **Night:** orb uses the moon gradient (core 30% of the disc, cooler halo).
- **Rain hours:** rain bars appear under the curve, height `chance × 0.32px` in the 84px viewBox.

## Accessibility

- `.scrub` is `role="slider"`, `tabindex="0"`, `aria-label="Forecast hour"`, `aria-valuemin="0"`, `aria-valuemax="23"`, `aria-valuenow` = index, `aria-valuetext` = "02:00, 13 degrees, Light rain, 70 percent rain".
- Keys: ←/↓ −1 hour, →/↑ +1 hour, Home first hour, End last hour; `preventDefault` so the page doesn't scroll.
- The temperature is `aria-live="polite"`; the slider's `aria-valuetext` carries the full reading so screen readers don't need the visuals.
- The sky, clouds, orb and curve SVG are `aria-hidden`.
- Contrast: white on the lightest palette bottom (`#c4dcef`) is weak, so the 168px numeral and 21px condition carry a soft text shadow; secondary text is never under 13px. For the strictest audit, darken day bottoms to `#9cc3e6`.
- Hit target: the whole 326 × 150px scrub area; tiles are not interactive.

## Responsive rules

- 390 wide: as specified; curve viewBox 326 × 84 with `preserveAspectRatio="none"` and `vector-effect: non-scaling-stroke` on the line.
- 360 wide: temperature 148px, tiles stay 3 columns with 8px gap, tick labels keep 12px.
- 430 wide: temperature 180px; the curve simply stretches.
- Tablet: center a 420px column; sky stays full-bleed.
- Short heights (< 760px): drop the sunrise/sunset note first, then the high/low line.

## Acceptance checklist

- [ ] Temperature renders at 168px weight 200 with a raised 0.42em degree sign.
- [ ] Initial hour is 17:00 with the live dot visible and the dusk palette applied.
- [ ] Dragging moves the playhead in whole-hour steps and captures the pointer outside the card.
- [ ] Sky gradient transitions smoothly (600ms) between palettes rather than snapping.
- [ ] The sun travels a left-to-right arc during the day and becomes a moon from 20:00.
- [ ] Night rain hours read "Light rain" (≥ 40%) or "Showers nearby".
- [ ] Rain, Wind and Feels-like tiles update with the hour.
- [ ] The knob sits exactly on the curve at every hour.
- [ ] The curve is a smooth spline, not a polyline.
- [ ] "Back to now" returns to 17:00.
- [ ] Arrow keys, Home and End work on the focused slider; `aria-valuetext` updates.
- [ ] Glass cards use backdrop blur 26px, 1px `rgba(255,255,255,.28)` border and an inset top highlight.
- [ ] Reduced motion makes every change instant and nothing else breaks.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: the playhead sits on **Now · 17:00** (index 11 of a 06:00 → 05:00 strip). Temperature 21°, "Clear", dusk palette (indigo top, mauve middle, apricot bottom). The sun sits low on the right, beside the degree sign. The time pill shows a small white live dot.
2. Pointer down anywhere in the 150px scrub area: the playhead jumps to the nearest hour (`round(x / width × 23)`), the knob scales to 1.18, and the pointer is captured.
3. While dragging, every hour change updates: numeral, condition, time pill ("08:00", "Sat · 02:00" after midnight), Rain %, Wind km/h, Feels-like, the sky palette (600ms transition), the orb position (600ms spring) and cloud opacity/drift.
4. Leaving 17:00 hides the live dot; returning shows it and the pill reads "Now · 17:00".
5. Night hours (20:00–05:59) swap the sun for a smaller, cooler moon disc; rain hours (00:00–05:00, 20–70%) switch the condition to "Light rain" or "Showers nearby".
6. Release: knob returns to scale 1. The selected hour stays.
7. "Back to now" in the card header snaps back to 17:00.
8. Keyboard: the scrub area is a focusable slider. ←/↓ moves one hour earlier, →/↑ one hour later, Home jumps to 06:00, End to 05:00.
9. Resizing recomputes the playhead's pixel position.

## Tokens

```css
@property --sky-top { syntax: "<color>"; inherits: true; initial-value: #36508f; }
@property --sky-mid { syntax: "<color>"; inherits: true; initial-value: #9c7aa6; }
@property --sky-bot { syntax: "<color>"; inherits: true; initial-value: #f3a77f; }

:root {
  /* sky (driven by JS per hour) */
  --sky-top: #36508f; --sky-mid: #9c7aa6; --sky-bot: #f3a77f;

  /* ink on sky */
  --ink: #ffffff;
  --ink-2: rgba(255, 255, 255, .82);
  --ink-3: rgba(255, 255, 255, .72);

  /* glass */
  --glass: rgba(255, 255, 255, .14);
  --glass-2: rgba(255, 255, 255, .22);
  --glass-line: rgba(255, 255, 255, .28);
  --glass-blur: blur(26px) saturate(160%);
  --glass-shadow: inset 0 1px 0 rgba(255, 255, 255, .3), 0 10px 30px rgba(20, 30, 60, .12);

  /* data */
  --rain: #bfe3ff;   /* rain bars at 70% */
  --sun: #fff3d6;    /* orb core */
  --moon: #f4f1ea;

  /* type */
  --font: "Outfit", system-ui, -apple-system, sans-serif;

  /* shape + space */
  --r-card: 20px;
  --r-pill: 999px;
  --pad-x: 16px;
  --gap: 10px;
  --scrub-h: 150px;
  --curve-h: 84px;
  --knob: 16px;

  /* motion */
  --t-micro: 160ms;
  --t-sky: 600ms;
  --spring: cubic-bezier(.32, .72, 0, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

Sky palettes (top / middle / bottom), interpolated linearly in RGB between keyed hours:

| Hour | Top | Middle | Bottom |
|-----:|-----|--------|--------|
| 00 | `#0d1630` | `#1b2547` | `#2b3560` |
| 05 | `#1a2246` | `#3a3f6e` | `#6d5d85` |
| 07 | `#5b78b8` | `#c79bb0` | `#f6c4a3` |
| 10 | `#3f86cf` | `#78aee0` | `#b9d7ef` |
| 15 | `#3a7fca` | `#6fa6dc` | `#c4dcef` |
| 17 | `#36508f` | `#9c7aa6` | `#f3a77f` |
| 19 | `#28305f` | `#6b4f7f` | `#e0896d` |
| 20 | `#141c3c` | `#2c2f5c` | `#4e4673` |
| 24 | = 00 | | |

Gradient: `linear-gradient(180deg, top 0%, mid 55%, bot 100%)`.

## Typography

| Role            | Family | Size  | Weight | Line-height | Tracking | Notes |
|-----------------|--------|------:|-------:|------------:|---------:|-------|
| Temperature     | Outfit | 168px | 200    | 0.9         | −0.06em  | tabular; `<sup>` ° at .42em, raised .95em; soft text-shadow `0 2px 24px rgba(20,30,60,.18)` |
| City            | Outfit | 30px  | 400    | 1.2         | −0.01em  | |
| Condition       | Outfit | 21px  | 400    | 1.4         | 0        | min-height 29px so lines don't jump |
| Location label  | Outfit | 15px  | 500    | 1.4         | +0.01em  | ink-2, arrow glyph 14px |
| High / low      | Outfit | 15px  | 400    | 1.4         | 0        | ink-2, tabular |
| Time pill       | Outfit | 13px  | 500    | 1           | 0        | tabular |
| Card header     | Outfit | 12px  | 500    | 1.4         | +0.08em  | UPPERCASE, ink-3 |
| Tick labels     | Outfit | 12px  | 400    | 1.4         | 0        | ink-3, "06" "09" … |
| Tile label      | Outfit | 11px  | 500    | 1.4         | +0.08em  | UPPERCASE |
| Tile value      | Outfit | 24px  | 300    | 1.2         | −0.02em  | unit 12/400 ink-2 |

## Implementation notes

**Register the sky colours so the gradient can transition.** Plain custom properties are strings and snap; `@property` with `<color>` makes them interpolable:

```css
@property --sky-top { syntax: "<color>"; inherits: true; initial-value: #36508f; }
:root { transition: --sky-top 600ms var(--ease), --sky-mid 600ms var(--ease), --sky-bot 600ms var(--ease); }
.sky { position: fixed; inset: 0;
       background: linear-gradient(180deg, var(--sky-top), var(--sky-mid) 55%, var(--sky-bot)); }
```

**Smooth the curve with a Catmull-Rom → Bézier conversion**, clamping the end points. Integer temperatures with plateaus look stepped with a naïve midpoint Bézier:

```js
const pt = T.map((t, i) => [x(i), y(t)]), g = i => pt[Math.max(0, Math.min(23, i))];
let d = 'M0 ' + pt[0][1];
for (let i = 0; i < 23; i++) {
  const a = g(i - 1), b = g(i), c = g(i + 1), e = g(i + 2);
  d += ` C${b[0] + (c[0] - a[0]) / 6} ${b[1] + (c[1] - a[1]) / 6} ` +
       `${c[0] - (e[0] - b[0]) / 6} ${c[1] - (e[1] - b[1]) / 6} ${c[0]} ${c[1]}`;
}
```

**Scrub with pointer capture and integer snapping**, and early-out when the hour hasn't changed so drags don't re-trigger 600ms transitions every pixel:

```js
const at = e => { const r = scrub.getBoundingClientRect();
  return Math.round((e.clientX - r.left) / r.width * 23); };
scrub.addEventListener('pointerdown', e => { scrub.setPointerCapture(e.pointerId);
  scrub.classList.add('drag'); set(at(e)); });
scrub.addEventListener('pointermove', e => { if (scrub.classList.contains('drag')) set(at(e)); });
// set(i): clamp 0..23, return if i === cur, then update text, vars, orb, ARIA
```

Common mistakes: forgetting `touch-action: none` on the scrub area (the page scrolls instead of scrubbing); blurring the whole sky instead of the cards; using `preserveAspectRatio="none"` without `vector-effect: non-scaling-stroke`, which squashes the line width.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
