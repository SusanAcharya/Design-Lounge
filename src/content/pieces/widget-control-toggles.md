---
title: "Control centre toggles"
summary: "A near-black control centre: radio cluster, tall brightness and volume sliders with rubber-band overdrag, and springy amber toggles that change the screen."
platform: mobile-app
type: component
category: widgets
tags: [controls, toggles, sliders, settings, phone]
styles: [dark, minimal]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-03
palette: ["#0C0D0F", "#1A1B1F", "#ECEBE6", "#FFB547", "#8F8D89"]
fonts: ["Geist", "Geist Mono"]
related: [widget-device-battery, widget-compass, widget-weather-glance]
---

# Control centre toggles

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The quick-settings panel of a phone called Umbra One, in a dark minimal language of its own (neither iOS glass nor Material): near-black tiles, one amber accent for "on", bone-white slider fills, and a mono status line. A 2×2 radio cluster, two tall sliders, a do-not-disturb tile, six square toggles and an audio-output tile. Every control has a visible consequence: the brightness slider really dims the screen, Torch throws a warm beam from the top edge, Warm screen tints everything, Airplane mode switches the radios off. What makes it worth copying is the press feel: 90ms squash to 0.9, then a 420ms overshooting spring back, and sliders that stretch like rubber when you drag past the end.

## Reference behaviour

1. First frame: status line "Wi-Fi · Larchmont 5G". On: Mobile data, Wi-Fi, Bluetooth, Rotation lock, Pebblepod Pro (connected, "L 64 · R 61"). Off: Airplane, Do not disturb ("Off"), Torch, Saver, Warm, Hotspot, Silent. Brightness 72%, volume 45%.
2. Pressing any toggle squashes it to scale 0.9 in 90ms; releasing springs back over 420ms with overshoot. The same happens on Space/Enter key-down.
3. A click flips `aria-pressed`. On = amber `#ffb547` fill with dark ink `#1c1407`; off = tile grey with light ink.
4. Every change writes to the status line, e.g. "Bluetooth on · Pebblepod Pro", "Torch off", "Brightness 38%". The amber dot pings (scale 1 → 1.8 → 1).
5. Wi-Fi and signal icons: when off, the arcs/bars drop to 35% opacity and a slash draws in over 260ms. When on, arcs return with 0/60/120ms stagger.
6. Airplane mode on turns Mobile data, Wi-Fi, Bluetooth and Hotspot off, and the status adds "· radios off". Turning Hotspot on cancels Airplane mode.
7. Bluetooth off disconnects Pebblepod Pro ("Not connected"). Tapping Pebblepod Pro while Bluetooth is off turns Bluetooth on (and Airplane off) and connects.
8. Do not disturb on: tile goes amber, subtitle "Until 7:00", the moon rights itself from −14° and 0.82 scale with a spring.
9. Torch on: a radial warm beam fades in from the top centre of the screen over 260ms. Warm screen on: an orange multiply overlay at 22% fades in over 600ms.
10. Brightness slider: drag vertically anywhere on it; the value moves by the drag distance (relative, not jump-to-finger). Screen dimming overlay opacity = (100 − value) / 100 × 0.6. The sun's eight rays lengthen from 1 to 4.2 units with value.
11. Volume slider: same drag. Icon shows one wave above 0, two above 50, and a cross at 0.
12. Dragging past 0 or 100 stretches the slider: scaleY up to 1.06 (anchored at the opposite end) and scaleX down by half that amount. Release springs it back over 420ms.
13. While dragging or focused, the slider shows its value ("72%") at the top in mono.

## Structure

```
390×844 phone. padding-top max(54px, safe-area), sides 20px
┌──────────────────────────────────────────┐
│ Controls                       UMBRA ONE │  28px / 11px mono
│ ( ● Wi-Fi · Larchmont 5G               ) │  status pill, 40px
│ ┌───────────────┐ ┌──────┐ ┌──────┐      │
│ │ (air)     (▮▮▮) │ │      │ │      │      │  4 columns, gap 12
│ │ (wifi)  (bt)  │ │ fill │ │ fill │      │  row = col width + 8px
│ └───────────────┘ │      │ │      │      │
│ ┌───────────────┐ │ sun  │ │ spkr │      │  sliders span 3 rows
│ │ o Do not dist.│ └──────┘ └──────┘      │
│ └───────────────┘                        │
│ [Torch] [Lock] [Saver] [Warm]            │
│ [Hotspot] [Silent] [ o Pebblepod Pro  ] │
│                                          │
│   HOLD A TILE FOR MORE · SWIPE UP TO CLOSE│
└──────────────────────────────────────────┘
```

- Page: `main` with a flex column; footer hint pinned with `margin-top: auto` and 34px bottom clearance.
- Status: `div role="status"` (polite live region) with a 6px amber dot and the message.
- Grid: `display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: calc((100vw − 76px) / 4 + 8px)`. Auto-placement does the rest.
- Radio cluster: `div role="group"` labelled "Connectivity", 2×2 cells holding four 58px round `button`s with `aria-pressed`.
- Sliders: `div role="slider"` with `tabindex="0"`, a bottom-anchored fill `div`, a value label, and an icon drawn with `mix-blend-mode: difference` so it inverts over the fill.
- Tiles: `button`s with `aria-pressed`; square ones show icon top-left and a 10.5px mono label bottom-left. Wide ones (span 2) show a 34px icon disc, a 13.5px title, and a mono subtitle referenced by `aria-describedby`.
- Overlays: three fixed, `pointer-events: none`, `aria-hidden` layers: beam (z 3), warm (z 4), dim (z 5).

## Tokens

```css
:root {
  --bg: #0c0d0f;        /* page */
  --tile: #1a1b1f;      /* tiles, sliders, cluster */
  --tile-2: #24252a;    /* round buttons off, icon discs */
  --edge: rgba(255,255,255,.06);  /* 1px tile border */
  --text: #edebe6;
  --muted: #8f8d89;     /* labels, status */
  --bone: #ecebe6;      /* slider fill */
  --accent: #ffb547;    /* every "on" */
  --on-accent: #1c1407; /* ink on amber */

  --sans: "Geist", system-ui, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;

  --gap: 12px;
  --r: 24px;            /* tiles and sliders */
  --r-round: 50%;       /* 58px radio buttons */

  --press: 90ms;
  --release: 420ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --spring: cubic-bezier(.34, 1.56, .64, 1);

  --dim-max: .6;        /* overlay opacity at 0% brightness */
  --warm-opacity: .22;
}
```

## Typography

| Role | Family | Size | Weight | Tracking | Case / colour |
| --- | --- | --- | --- | --- | --- |
| Page title "Controls" | Geist | 28px / 1 | 600 | -0.02em | `--text` |
| Device name | Geist Mono | 11px | 500 | 0.08em | upper, `--muted` |
| Status message | Geist Mono | 12px | 500 | 0.02em | `--muted`, name in `--text` |
| Wide tile title | Geist | 13.5px / 1.2 | 600 | -0.01em | nowrap, ellipsis |
| Tile label / subtitle | Geist Mono | 10.5px / 1.2 | 500 | 0.04em | `--muted`, on amber `rgba(28,20,7,.7)` |
| Slider value | Geist Mono | 11px | 500 | — | `--muted` |
| Footer hint | Geist Mono | 10.5px | 500 | 0.06em | upper, `--muted` |

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Press | `:active` / key-down | scale | 1 → 0.9 | 90ms `--ease` | no scale |
| Release | pointer-up / key-up | scale | 0.9 → 1 | 420ms `--spring` | 1ms |
| Toggle fill | click | background, colour | grey ↔ amber | 200ms `--ease` | 1ms |
| Wi-Fi / signal arcs | toggle | opacity | 0.35 ↔ 1, stagger 0/60/120ms | 220ms `--ease` | 1ms |
| Slash | toggle off | stroke-dashoffset | 28 → 0 | 260ms `--ease` | 1ms |
| DND moon | toggle | rotate, scale, opacity | −14°, 0.82, 0.75 → 0, 1, 1 | 520ms `--spring` | 1ms |
| Status dot | any change | scale | 1 → 1.8 → 1 | 300ms `--spring` | 1ms |
| Torch beam | toggle | opacity | 0 ↔ 1 | 260ms `--ease` | 1ms |
| Warm overlay | toggle | opacity | 0 ↔ 0.22 | 600ms `--ease` | 1ms |
| Slider overdrag | drag past end | scale(x, y) | up to (0.97, 1.06) | live, then 420ms `--spring` back | no stretch |
| Slider value label | drag / focus | opacity | 0 → 1 | 200ms | 1ms |

## States

- Toggle off: `--tile` (square) or `--tile-2` (round), light icon, muted label.
- Toggle on: `--accent`, `--on-accent` icon and title, label at 70% dark ink, border transparent.
- Pressed: scale 0.9. Focus-visible: 2px amber outline, 3px offset (round buttons get a ring).
- Wi-Fi and Bluetooth off: slash drawn across the glyph, arcs dimmed.
- Pebblepod Pro disconnected: grey tile, subtitle "Not connected".
- Sliders: dragging shows value and removes the transition; at rest the value hides.
- Disabled: not used. Dependent controls change state instead of greying out (Airplane switches radios off, Bluetooth off disconnects audio).

## Accessibility

- Every toggle is a `button` with `aria-pressed`. Icon-only tiles carry `aria-label` ("Torch", "Low power", "Warm screen"); their visible mono label is `aria-hidden` to avoid double reading.
- Wide tiles use visible text as the name and `aria-describedby` for the subtitle ("Until 7:00", "L 64 · R 61").
- Sliders: `role="slider"`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow`, `aria-valuetext="72 percent"`. Keys: ↑/→ +5, ↓/← −5, PageUp/PageDown ±20, Home 0, End 100.
- The status pill is `role="status"`, so each change is announced once ("Airplane mode on · radios off").
- Hit targets: round buttons 58px, tiles at least 78px, sliders 78 × 258px.
- Contrast: `#edebe6` on `#1a1b1f` is about 14:1; `#8f8d89` on `#1a1b1f` is about 5.2:1; `#1c1407` on `#ffb547` is about 11:1.
- The dim overlay darkens the UI as the user asks; at 0% brightness the overlay is 0.6, so text stays readable.

## Responsive rules

- 390 wide: columns ≈ 78.5px, rows ≈ 86.5px.
- 360 wide: rows recompute from `100vw`; wide-tile icon discs hide under 370px so "Pebblepod Pro" and "Do not disturb" stay on one line (with ellipsis as a backstop).
- ≥430 wide: rows fixed at 90px.
- On a tablet, show this panel as a 390px-wide sheet anchored to the top-right corner; do not stretch the grid.
- Do not draw a status bar; the 54px top padding is the clearance.

## Acceptance checklist

### Always

- [ ] One accent colour means "on" everywhere; nothing else uses it except the status dot and focus ring.
- [ ] Press squash 0.9 in 90ms and spring release in 420ms on pointer and keyboard.
- [ ] Each toggle has a visible effect or a dependency rule, and writes one status message.
- [ ] Sliders change by drag distance, not by jumping to the touch point.
- [ ] Overdrag stretches the slider and springs back on release.
- [ ] Slider icon inverts over the fill (`mix-blend-mode: difference`).
- [ ] Sliders are keyboard operable with valuetext.
- [ ] No horizontal overflow at 360.
- [ ] Reduced motion keeps the state changes and drops the squash and stretch.

### This demo

- [ ] Status starts "Wi-Fi · Larchmont 5G"; brightness 72%, volume 45%.
- [ ] Amber `#ffb547` on `#1a1b1f` tiles over `#0c0d0f`.
- [ ] Airplane on switches off Mobile data, Wi-Fi, Bluetooth, Hotspot.
- [ ] Torch shows a warm top beam; Warm screen tints the page at 22%.
- [ ] Brightness 0% dims the screen with a 0.6 black overlay.
- [ ] Pebblepod Pro tile reads "L 64 · R 61" when connected.

## Implementation notes

**Squash and spring with two transitions.** Put the slow overshoot on the resting state and a fast plain ease on the pressed state, so press is snappy and release bounces:

```css
.tg { transition: transform 420ms cubic-bezier(.34,1.56,.64,1), background-color 200ms; }
.tg:active, .tg.down { transform: scale(.9); transition: transform 90ms cubic-bezier(.2,.7,.2,1); }
```

```js
b.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') b.classList.add('down'); });
b.addEventListener('keyup', () => b.classList.remove('down'));
```

**Relative drag with rubber band.** Store the value and the pointer Y at pointer-down. The overshoot past the clamp becomes the stretch:

```js
el.onpointermove = (e) => {
  if (!drag) return;
  const raw = drag.v + (drag.y - e.clientY) / drag.h * 100;
  v = Math.max(0, Math.min(100, raw));
  const over = raw - v;
  const s = 1 + Math.min(0.06, Math.abs(over) / 900);
  el.style.transformOrigin = over > 0 ? '50% 100%' : '50% 0%';
  el.style.transform = over ? `scale(${1 - (s - 1) / 2}, ${s})` : '';
  render();
};
```

Add `.drag { transition: none }` while dragging and clear the inline transform on release so the CSS spring returns it.

**Dependencies live in one setter.** Route every change through `set(key, value)` so cross-effects (Airplane → radios, Bluetooth → audio, Torch → beam) stay in one place and the status message is written once per click.

Common mistakes:

- Blue for "on". This family's only accent is amber.
- Glass blur on the tiles. This is dark minimal: flat tiles, 1px 6% edge.
- Sliders that jump to the finger; a control centre slider moves relative to the drag.
- Animating `width`/`height` for the press; use `transform: scale`.
- Forgetting the keyboard press state, so keyboard users get no squash.
- Drawing the clock and battery; the device chrome does that.

Where it sits: a phone's pull-down panel. The audio tile names the same "Pebblepod Pro" earbuds as `widget-device-battery`.
