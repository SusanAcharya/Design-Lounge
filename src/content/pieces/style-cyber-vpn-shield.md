---
title: "Cyber VPN shield"
summary: "A neon-on-black VPN screen: a 48-tick dial charges and locks with a scanline sweep, a dot-matrix world map draws the route, and live counters tick."
platform: mobile-app
type: screen
category: utility
tags: [vpn, privacy, map, press, select]
styles: [cyber, dark, terminal]
motion: rich
difficulty: 2
featured: false
published: 2026-11-06
palette: ["#06080C", "#0B1017", "#D6E2EC", "#2FF3D6", "#FF5FA2"]
fonts: ["Major Mono Display", "IBM Plex Mono"]
related: [cyber-hud-style, hud-boot-gate, phone-privacy-data]
---

# Cyber VPN shield

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The main screen of a fictional privacy app, Hexgate. A dot-matrix world map shows the tunnel from Lisbon to the chosen exit, three chamfered counters tick live, four exit servers carry ping bars, and a 200px dial in the thumb zone is the one control. Tapping the dial when exposed charges its 48 ticks clockwise while a scanline sweeps the core, then the shackle drops, the core glows cyan, the route draws itself across the map and the public IP scrambles into the new one. The style is cyber on a custom language (not iOS or Material): neon cyan on near-black, chamfered 12px corners cut with `clip-path`, faint 3px scanlines over everything, one hot magenta used only for "you are exposed". The detail worth copying is that the neon is only on state: body text is a cool grey that passes 7:1, so the glow means something.

## Reference behaviour

1. Initial state: shield locked through Montréal. Chip "SHIELDED" in cyan. The map shows a magenta 6px square at Lisbon, a cyan arc to Montréal with a cyan exit dot, a pinging ring and a light packet dot travelling the arc every 2.2s. Legend: "LIS ▸ MTL · 5,231 km" and "WIREGUARD · AES-256". Counters: DOWN 1.284 GB, UP 96.4 MB, SESSION 00:42:17. Public IP "149.56.19.145 · Montréal" in cyan. All 48 ticks lit; the dial reads LOCKED / TAP TO DROP. Note: "Kill switch on · DNS in tunnel · no logs".
2. Counters advance every 1s while locked: down by 0.2–1.8 MB, up by 20–140 KB, session by one second. Values switch from MB to GB at 1,000 MB with three decimals.
3. **Tap the dial (drop)**: chip turns magenta "EXPOSED", route, ring and packet hide, ticks go dim, the core border turns grey, the shackle lifts 5px, the word reads EXPOSED / TAP TO SHIELD. IP becomes "94.63.112.8 · Lisbon, visible" in magenta. Note: "Traffic is not encrypted on this network". Counters freeze.
4. **Tap again (charge)**: chip "LINKING" in cyan. Ticks light one by one clockwise from 12 o'clock, 30ms apart (1.44s). A 2px cyan scanline with a 10px glow sweeps the core top to bottom every 520ms. The label counts "HANDSHAKE 000%" → "100%" over 1500ms. Note: "Handshake with Montréal · key rotated". The dial ignores taps while charging.
5. At 1560ms: LOCKED. One slower sweep (900ms), the shackle drops in 260ms with an overshoot, the core gains a cyan border and glow, the route draws from Lisbon in 700ms (expo out), the IP digits scramble for 450ms and land on the exit IP, and counters restart from 0.0 MB and 00:00:00.
6. **Pick a server** (tap a row or use arrow keys in the list): the row gets a cyan border, a 3px inset cyan bar on the left and a cyan code. While locked, the route redraws to the new exit and the IP scrambles to its address; while exposed, only the map and legend update.
7. Servers: IS·RKV Reykjavík "Geothermal · 31% load" 38 ms; CH·ZRH Zürich "Double hop · 54% load" 24 ms; CA·MTL Montréal "Streaming · 48% load" 96 ms; JP·TYO Tokyo "P2P allowed · 62% load" 212 ms. Bars: under 40ms 4, under 100ms 3, under 180ms 2, else 1.

## Structure

```
390 × 844 (54 safe top, 34 safe bottom, 20px gutters)
┌──────────────────────────────────────┐
│ ⬡ HEXGATE                [■ SHIELDED]│ header 44; chip 28 tall, chamfer 8
│ ╱──────────────────────────────────┐ │ map card, chamfer 12, padding 8/10
│ │ ⠿⠿⠿⠿⠿    ⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿      │ │ SVG viewBox 360×140, 5px dot pitch
│ │  ⠿●╭────╮■⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿          │ │ route: quadratic arc
│ │     ⠿⠿   ⠿⠿⠿⠿    ⠿⠿⠿             │ │
│ │ LIS ▸ MTL · 5,231 km   WIREGUARD… │ │ legend 11px
│ └──────────────────────────────────╱ │
│ ╱DOWN    ┐ ╱UP      ┐ ╱SESSION ┐    │ 3 stat cards, gap 8
│ │1.284 GB│ │96.4 MB │ │00:42:17│    │
│ PUBLIC IP        149.56.19.145 · Mon…│ 12px row
│ ┌──────────────────────────────────┐ │ 4 server rows, 42 tall, gap 6
│ │IS·RKV Reykjavík        ▂▄▆█ 38 ms│ │ grid 44 / 1fr / 40 / 52
│ ┃CA·MTL Montréal         ▂▄▆░ 96 ms┃ │ selected: cyan border + 3px bar
│ └──────────────────────────────────┘ │
│            ╭ ' ' ' ' ' ╮             │ dial 200×200, 48 ticks r87–95
│           '  ( lock )   '            │ core inset 26 (148px)
│           '   LOCKED    '            │
│            ╰ TAP TO DROP╯            │
│   Kill switch on · DNS in tunnel …   │ note 12px
└──────────────────────────────────────┘
```

- `<main class="app">` flex column, `padding:54px 20px 34px`; state classes `.locked`, `.off`, `.linking` on it.
- `<header>`: logo SVG, `<h1>hexgate</h1>`, `<span class="chip" role="status">`.
- `<section class="card map" aria-label="Route map">`: `<svg aria-hidden="true">` with a dots group, `path.route`, nodes group; a `.legend` row in HTML.
- `<section class="stats">`: three `.card.stat` with a label span and a `<b>` value.
- `<p class="ip">`.
- `<ul role="radiogroup" aria-label="Exit server">` with four `<button class="srv" role="radio">`.
- `<section class="zone">`: `<button class="dial" aria-pressed>` holding the ticks SVG and a `.core` (scanline, lock SVG, word, percent); then the `.note`.
- A visually hidden `aria-live="polite"` paragraph.

## Tokens

```css
:root {
  /* surfaces */
  --bg: #06080C;        /* near-black; overlaid with 1px cyan lines at 3.5% every 3px */
  --panel: #0B1017;     /* cards, rows */
  --line: #1B2632;      /* card border */
  --edge: #5A6E83;      /* server row border, core border when exposed (3.6:1 on panel) */
  --dim: #1C2834;       /* unlit ticks, unlit ping bars */
  --dot: #24384A;       /* map land dots */
  --selected: #0E1D21;  /* selected server fill */
  /* text */
  --ink: #D6E2EC;       /* values, names (14.8:1 on --bg) */
  --ink-2: #93A7B8;     /* labels, notes (7.9:1 on --bg) */
  /* state */
  --cyan: #2FF3D6;      /* shielded: chip, route, ticks, selected, IP */
  --mag: #FF5FA2;       /* exposed only: chip, home node, IP (6.4:1 on --bg) */
  --glow: rgba(47, 243, 214, .25);
  /* type */
  --display: "Major Mono Display", ui-monospace, monospace;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --fs-brand: 20px; --fs-word: 20px; --fs-stat: 16px; --fs-city: 14px; --fs-body: 13px;
  --fs-ip: 12px; --fs-label: 11px; --fs-micro: 10px;
  /* shape */
  --chamfer-card: 12px; --chamfer-chip: 8px; --row-h: 42px; --dial: 200px; --core-inset: 26px;
  --tick-count: 48; --tick-r1: 87px; --tick-r2: 95px; --tick-major: 99px;
  /* shadows */
  --core-lock: 0 0 0 4px rgba(47,243,214,.08), 0 0 28px rgba(47,243,214,.25);
  --scan-glow: 0 0 10px 2px rgba(47,243,214,.6);
  --route-glow: drop-shadow(0 0 3px rgba(47,243,214,.7));
  /* motion */
  --std: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --snap: cubic-bezier(0.5, 1.8, 0.5, 1);
  --t-charge: 1500ms; --tick-stagger: 30ms; --t-scan: 520ms; --t-scan-lock: 900ms;
  --t-route: 700ms; --t-shackle: 260ms; --t-ping: 2400ms; --t-packet: 2200ms; --t-scramble: 450ms;
}
```

## Typography

| Role | Family | Size / line | Weight | Tracking | Case |
|---|---|---|---|---|---|
| Brand | Major Mono Display | 20px / 1 | 400 | 0.02em | as the font draws it |
| Dial word | Major Mono Display | 20px / 1 | 400 | 0.04em | — |
| Stat value | IBM Plex Mono | 16px / 1, tabular | 500 | 0 | — |
| City | IBM Plex Mono | 14px / 1 | 500 | 0 | title |
| Ping | IBM Plex Mono | 13px / 1, tabular | 500 | 0 | — |
| Body, note | IBM Plex Mono | 12–13px / 1.4 | 400 | 0.04em | sentence |
| Chip | IBM Plex Mono | 11px / 1 | 600 | 0.14em | upper |
| Legend, server code, percent | IBM Plex Mono | 11px / 1 | 500–600 | 0.08–0.16em | upper |
| Stat label, server note | IBM Plex Mono | 10px / 1 | 400 | 0.06–0.16em | upper / sentence |

## Motion

| What | Trigger | Property | From → to | Duration | Easing | Delay | Reduced motion |
|---|---|---|---|---|---|---|---|
| Tick charge | connect | tick `stroke` | `--dim` → cyan | 60ms each | `--std` | i × 30ms | all at once |
| Scanline | charging | `top`, glow | −4% → 104% | 520ms loop | linear | 0 | none |
| Lock sweep | locked | `top` | −4% → 104% | 900ms once | `--std` | 0 | none |
| Percent | charging | text | 000% → 100% | 1500ms | rAF linear | 0 | 300ms |
| Shackle | locked / drop | `translateY` | −5px ↔ 0 | 260ms | `--snap` | 0 | same |
| Core glow | locked | border, shadow | grey → cyan | 200 / 300ms | `--std` | 0 | same |
| Route draw | locked, reroute | `stroke-dashoffset` | length → 0 | 700ms | `--expo` | 0 | drawn |
| Exit ping | locked | ring `scale`, `opacity` | 0.4, 1 → 2.4, 0 | 2400ms loop | `--std` | 0 | none |
| Packet | locked | SMIL `animateMotion` | along route | 2200ms loop | linear | 0 | not created |
| IP scramble | locked, reroute | digits | random → final | 9 × 50ms | — | 0 | final at once |
| Row select | tap | border, fill | grey → cyan | 160ms | `--std` | 0 | same |

## States

- **Locked**: cyan chip, cyan ticks, cyan core border with glow, closed shackle, LOCKED, route visible, counters running.
- **Linking**: cyan LINKING chip, ticks filling, scanline looping, percent counting; route still hidden; the IP stays magenta until the lock lands.
- **Exposed**: magenta chip and IP, dim ticks, grey core, open shackle, EXPOSED / TAP TO SHIELD, route hidden, counters frozen.
- **Server row**: default grey 1px border; hover `#8CA0B3`; selected cyan border, `#0E1D21` fill, 3px inset cyan bar, cyan code.
- **Focus-visible**: 2px cyan outline, 3px offset, on the dial (round) and on rows.
- **Busy**: taps on the dial do nothing while linking.

## Accessibility

- The dial is a `<button aria-pressed>` whose `aria-label` reads "Shield on. Tap to turn off", "Connecting" or "Shield off. Tap to connect".
- The chip is `role="status"`; a hidden `aria-live="polite"` line announces "Shield locked. Exit Montréal, 96 milliseconds.", "Shield off. Your IP is visible.", "Rerouted through Tokyo."
- Servers are a `role="radiogroup"` of `role="radio"` buttons with `aria-checked` and a roving `tabindex`; Arrow keys move and select, Tab leaves the group. Each has `aria-label="Montréal, 96 milliseconds"` so the bars are not the only signal.
- The map SVG is `aria-hidden`; the legend repeats the route in text.
- Contrast: `--ink` 14.8:1 and `--ink-2` 7.9:1 on `--bg`; cyan 13.9:1, magenta 6.4:1. Row borders are 3.6:1 against the panel so the radios meet 3:1.
- Hit targets: dial 200px, rows 350 × 42.

## Responsive rules

- At 360 wide: stats keep three columns (values 16px fit "1.284 GB" in 98px); the server note may truncate; the map scales with the SVG `viewBox`.
- Short screens (under 800px tall): the dial shrinks to 168px and its core inset to 22px; the zone keeps `margin-top:auto`.
- Tablet: cap the column at 430px; the map card can grow to 600px wide beside the dial in landscape.

## Acceptance checklist

**Always**
- [ ] One control changes the shield: the dial, in the lower third.
- [ ] Charging lights 48 ticks clockwise from 12 o'clock with a 30ms stagger while a scanline sweeps the core.
- [ ] Locking drops the shackle, glows the core, draws the route and scrambles the IP, in that order within 700ms.
- [ ] Neon is only on state; body and label text use `--ink` / `--ink-2` and pass 4.5:1.
- [ ] Magenta appears only while exposed (and on the home node).
- [ ] Hidden route, ring and packet are `visibility:hidden`, not just transparent.
- [ ] Server rows are radios with arrow-key movement and a 3:1 border.
- [ ] Counters only tick while locked and reset on a new connection.
- [ ] Reduced motion: no scan, no ping, no packet; ticks and route appear at once.
- [ ] `document.documentElement.scrollWidth` is 390.

**This demo**
- [ ] Brand "hexgate"; home Lisbon 94.63.112.8; default exit Montréal 149.56.19.145.
- [ ] Four servers with pings 38, 24, 96 and 212 ms and the bar thresholds 40 / 100 / 180.
- [ ] Starting counters 1.284 GB, 96.4 MB, 00:42:17.

## Implementation notes

1. **A world map from row ranges.** Encode land at 10° per cell as `[start, end]` column ranges per row (14 rows from 80°N), then upsample each cell to 2 × 2 dots at a 5px pitch and drop the outer corner dot when both neighbours on that side are sea. Project nodes with `x = lon + 180`, `y = 80 − lat` in a `0 0 360 140` viewBox.

```js
G.forEach((g, y) => g.forEach((v, x) => { if (!v) return;
  for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) {
    if (!on(y + (dy ? 1 : -1), x) && !on(y, x + (dx ? 1 : -1))) continue;
    d += `<circle class="dot" cx="${x*10 + dx*5 + 2.5}" cy="${y*10 + dy*5 + 2.5}" r="1.25"/>`;
  } }));
```

2. **Ticks that charge with CSS alone.** Give each tick its index and let the transition delay do the sequence; a `.now` class skips the delay for the first frame.

```css
.tick { stroke: var(--dim); stroke-width: 2.4; transition: stroke 0s; }
.lit .tick { stroke: var(--cyan); transition: stroke 60ms var(--std) calc(var(--i) * 30ms); }
.lit.now .tick { transition: none; }
.charging .scan { animation: sweep 520ms linear infinite; }
@keyframes sweep { 0% { top: -4%; opacity: 1 } 100% { top: 104%; opacity: 1 } }
```

3. **Redraw the route from its real length.** Measure after setting `d`, store it as `--len`, and restart the animation by toggling the class after a reflow.

```js
route.setAttribute('d', `M${x0} ${y0}Q${mx} ${my} ${x1} ${y1}`);
route.style.setProperty('--len', Math.ceil(route.getTotalLength()));
route.classList.remove('draw'); void route.getBBox(); route.classList.add('draw');
```

Common mistakes: making every label neon (it stops meaning anything and the small text blurs), a glow behind body text, and letting a second tap during the handshake flip the state mid-charge. Clear every pending timeout on drop.
