---
title: "Phone level map"
summary: "A saga-style level path climbing a tide-pool reef to a lighthouse: starred nodes, a pulsing current level, a level card sheet and a path that draws on clear."
platform: mobile-app
type: screen
category: games
tags: [game, map, levels, scroll, press, progression]
styles: [playful, organic]
motion: rich
difficulty: 3
featured: false
published: 2026-11-06
palette: ["#0A3442", "#E6C98F", "#FFF4DC", "#C8412C", "#F2A93B"]
fonts: ["Baloo 2"]
related: [game-phone-level-results, game-quest-map, game-cozy-farm-hud]
---

# Phone level map

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The world map of a casual puzzle game called Saltlight: one tall, vertically scrolling world that climbs from a deep kelp reef, through the shallows and a sandbar, up gull cliffs to a lighthouse at the top. Fourteen level nodes sit on a winding road. Cleared levels are cream discs with one to three stars fanned above them, the current level is a larger coral disc with a pulsing ring and a little crab token named Pip standing on it, and locked levels are a solid pale grey-green with a lock icon and their number (no opacity tricks, so they still pass contrast). On load the camera eases up from the reef to the current level. Tapping the current level opens a level card sheet; clearing it stamps the stars, draws the next stretch of road, hops Pip along it and moves the camera. The detail worth copying is the order of that reward: stars, then road, then hop, then the new node pops, each a separate beat.

The visual language is custom game UI: thick ink outlines (4px `#0B3440`), a 4–7px solid "under-lip" shadow for pressable discs, rounded Baloo 2 everywhere. The sheet follows iOS 26-ish conventions (28px top radius, grabber, iOS sheet curve).

## Reference behaviour

1. Initial state: levels 1–6 cleared with stars `3, 2, 3, 3, 1, 3`; level 7 current; 8–14 locked. The world starts scrolled to the very bottom (the reef) and on the first frame eases up over 1,400ms (quartic ease-out) until level 7 sits at 56% of the viewport height.
2. HUD, fixed: lives chip top-left (heart, "4", "+1 in 12:40" counting down once a second; at 0:00 it wraps to 30:00) and a coin chip top-right (shell coin, "2,480"). Both are solid `#0B2E38` plates, so text never sits directly on the map.
3. The current node pulses: a 3px cream ring scales 1 → 1.45 and fades over 1,800ms, forever. Pip bobs 4px every 2,400ms.
4. Tap a locked node: it wiggles ±5px for 320ms and a toast "Clear level 7 to unlock" rises at the bottom for 1,800ms.
5. Tap the current node: a scrim fades in (300ms) and the level card sheet slides up (420ms, `cubic-bezier(.32,.72,0,1)`). It shows zone eyebrow "SANDBAR", "Level 7" at 44px, a goal row ("Free 18 hermit crabs / in 24 moves · tide rises every 6"), three score tiers (1, 2, 3 stars: 9,000 / 14,000 / 19,500), "Your best: Not cleared yet", a coral Play button (60px) and a secondary outlined "Complete level" button (48px). Focus moves to Complete level.
6. Tap a cleared node: the same sheet with "Replay" as the primary label, the best score (level 6: "19,710"), tiers already earned filled with a gold tint, and no Complete control.
7. Close with the X, the scrim, Play, or Escape. Focus returns to the node that opened it.
8. Complete level: the sheet closes; at +320ms the node turns cream, its stars stamp in (scale 2.4 → 1, −20° → 0°, 140ms stagger), the coin count rises by 20 per star and a toast reads "Level 7 cleared · +60 coins"; at +760ms the next road segment draws itself (stroke-dashoffset, 700ms); at +900ms Pip hops along that segment in three small arcs (660ms); at +1,560ms the next node pops in as current (scale .6 → 1, overshoot) and the camera eases to it over 900ms.
9. Clearing level 14 skips the road and lights the lighthouse lamp (opacity .55 → 1 over 800ms).
10. Input is ignored while a clear sequence is running.

## Structure

```
390 × 844 viewport · world scrolls vertically, 2,500px tall
┌──────────────────────────────────┐
│ 54px clear (status bar)          │
│ [♥ 4  +1 in 12:40]   [◎ 2,480]   │ HUD plates at top:58, 44px tall, 16px gutters
│                                  │
│           (lock 9)               │ locked 56px disc
│          ╱                       │ road: 22px ink + 10px cream (lit) or dotted (locked)
│      (lock 8)                    │
│     ╱                            │
│  🦀                              │ Pip token 46×40, 78px above node centre
│ (●7●)  pulsing ring              │ current 66px coral disc
│   │                              │
│ [● SANDBAR · 7–10]               │ zone plate, pill, 12px caps
│ ★★★                              │ stars fan, 78px wide, 30px above disc
│ ( 6 )                            │ cleared 56px cream disc
│ ~~~~ shoreline ~~~~              │
│ ( 5 )                            │
│                [toast]           │ bottom:46px
└──────────────────────────────────┘
Sheet (when open): full width, bottom 0, padding 12 20 34, 28px top radius
```

World bands, top to bottom (y in a 2,500px world): dusk sky 0–700, cliffs from ~600 (two greens), sand from ~1,030, a pale wet-sand strip at ~1,550, shallows from ~1,590, deep reef from ~2,010. Each band edge is a wavy quadratic path.

Node positions: `x = 195 + 104·sin(i·0.9 + 0.35)`, `y = 2500 − 250 − i·150` for `i = 0…13`. Road segment `i → i+1` is the cubic `M x0 y0 C x0 (y0−80) x1 (y1+80) x1 y1`.

- `.world`: a fixed, full-viewport `div` with `overflow-y:auto`, scrollbar hidden.
- `.bands`: one SVG stretched to the world width (`preserveAspectRatio="none"`), so bands reach the edges on any width.
- `.lane`: a 390px column centred in the world; holds the decoration SVG (lighthouse, gulls, rocks, shells, kelp, coral, bubbles, road) and the node buttons.
- Nodes: `<button>` elements absolutely placed at their centre, with an `aria-label`.
- `header.hud`: two chips; the lives chip is `role="status"`.
- Sheet: `section role="dialog" aria-modal="true"` with a scrim `div` behind it.
- Toast: `div role="status" aria-live="polite"`.

## Tokens

```css
:root {
  /* ink and surfaces */
  --ink: #0B3440;          /* outlines, road edge, sheet text */
  --cream: #FFF4DC;        /* cleared node, lit road, sheet */
  --plate: #0B2E38;        /* HUD and zone plates, toast */
  --on-plate: #F4EBD8;
  --muted-plate: #BFD3D0;  /* "+1 in" timer on plate */
  /* accents */
  --coral: #C8412C;        /* current node, Play (white text 4.9:1) */
  --coral-hi: #E8674E;     /* Pip, coral decor, heart */
  --gold: #F2A93B;         /* earned stars, coin */
  --gold-ink: #7A4A07;
  --star-off: #8FA7A9;
  /* locked */
  --lock: #C6CFCC;         /* locked disc fill */
  --lock-ink: #2F4246;     /* lock icon and number, 6.6:1 on --lock */
  --road-locked: #6F8E92;  /* dotted road */
  /* world bands */
  --sky-top: #6F7FBF; --sky-mid: #E9A98F; --sky-low: #F6C98E;
  --cliff: #4F6B63; --cliff-2: #5C7A6F;
  --sand: #E6C98F; --wet-sand: #F4E2B6;
  --shallow: #2E9C9C; --shallow-2: #1B7480;
  --deep: #0F4C5C; --abyss: #0A3442;
  /* sheet */
  --sheet-goal: #F6E6C3; --sheet-x: #EFDFBF; --tier-edge: #D9C69C; --tier-got: #FFE8B5;
  --sheet-eyebrow: #6A4B12; --sheet-sub: #5B5236;
  /* type */
  --font: "Baloo 2", ui-rounded, system-ui, sans-serif;
  --fs-title: 44px; --fs-node-cur: 26px; --fs-node: 22px; --fs-chip: 20px;
  --fs-play: 22px; --fs-body: 16px; --fs-small: 13px; --fs-caps: 12px;
  /* sizes */
  --node: 56px; --node-cur: 66px; --hud-h: 44px; --play-h: 60px; --secondary-h: 48px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px;
  /* radii */
  --r-plate: 16px; --r-sheet: 28px; --r-play: 20px; --r-tier: 14px; --r-pill: 999px;
  /* shadows (solid under-lips, no blur) */
  --lip-node: 0 0 0 4px var(--ink), 0 6px 0 4px var(--ink);
  --lip-cur: 0 0 0 4px var(--ink), 0 7px 0 4px var(--ink);
  --lip-play: 0 5px 0 #7E2414;
  --scrim: rgba(5, 22, 28, .55);
  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --sheet-ease: cubic-bezier(.32, .72, 0, 1);
  --pop: cubic-bezier(.34, 1.56, .64, 1);
  --t-camera-load: 1400ms; --t-camera: 900ms; --t-sheet: 420ms; --t-road: 700ms;
  --t-hop: 660ms; --t-stamp: 420ms; --stagger-star: 140ms; --t-pulse: 1800ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|
| Sheet title "Level 7" | Baloo 2 | 44px | 800 | 1 | −0.01em | sentence |
| Current node number | Baloo 2 | 26px | 800 | 1 | 0 | — |
| Node number | Baloo 2 | 22px | 800 | 1 | 0 | — |
| Locked node number | Baloo 2 | 13px | 800 | 1 | 0 | — |
| HUD values | Baloo 2 | 20px | 800 | 1 | 0, tabular | — |
| HUD timer | Baloo 2 | 12px | 600 | 1.1 | 0 | sentence |
| Zone plate | Baloo 2 | 12px | 700 | 1 | 0.14em | upper |
| Sheet eyebrow | Baloo 2 | 12px | 700 | 1 | 0.16em | upper |
| Goal line / sub | Baloo 2 | 16px / 13px | 600 | 1.25 | 0 | sentence |
| Tier score | Baloo 2 | 15px | 700 | 1.3 | 0, tabular | — |
| Best score | Baloo 2 | 20px | 800 | 1 | 0, tabular | — |
| Play | Baloo 2 | 22px | 800 | 1 | 0 | sentence |
| Complete level / toast | Baloo 2 | 16px / 15px | 700 | 1 | 0 | sentence |

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Delay | Reduced motion |
|---|---|---|---|---|---|---|---|
| Camera on load | load | `scrollTop` | bottom → node at 56% | 1,400ms | `1−(1−t)^4` via rAF | 0 | jump |
| Current pulse ring | always | scale, opacity | 1, .95 → 1.45, 0 | 1,800ms loop | `--ease` | — | none (static ring) |
| Pip bob | always | translateY | 0 → −4px → 0 | 2,400ms loop | ease-in-out | — | none |
| Sheet | open/close | translateY | 104% → 0 | 420ms | `--sheet-ease` | — | 250ms crossfade |
| Scrim | open/close | opacity | 0 → 1 | 300ms | `--ease` | — | same |
| Star stamp | clear | scale, rotate, opacity | 2.4, −20°, 0 → 1, 0°, 1 | 420ms | `--pop` | 140ms stagger, +320ms | 300ms fade |
| Road draw | clear | stroke-dashoffset | length → 0 | 700ms | `--ease` | +760ms | instant |
| Pip hop | clear | translate along path | node i → node i+1, 3 arcs of 16px | 660ms | `cubic-bezier(.4,0,.2,1)` | +900ms | jump |
| New current node | clear | scale | .6 → 1 | 500ms | `--pop` | +1,560ms | fade |
| Camera follow | clear | `scrollTop` | → next node at 56% | 900ms | quartic out | +1,560ms | jump |
| Locked wiggle | tap locked | translateX | 0, −5, 5, 0 | 320ms | `--ease` | — | fade |
| Toast | events | opacity, translateY | 0, 12px → 1, 0 | 200ms | `--ease` | hold 1,800ms | same |

## States

- **Cleared node**: cream fill, ink ring and under-lip, star fan above (earned `#F2A93B`, unearned `#8FA7A9`, both ink-stroked). Press: translateY(3px).
- **Current node**: 66px, coral, white number, pulse ring, Pip on top. Press: translateY(3px).
- **Locked node**: `#C6CFCC` with a 4px ink ring, no lip (it does not look pressable), lock icon 18px above the number, both `#2F4246`. Press: wiggle and toast. The road into it is a dotted `#6F8E92` line on the ink track.
- **Focus-visible**: 3px white outline offset 3px plus a 6px ink halo, so it shows on sky, sand and water.
- **Sheet open**: scrim over map and HUD. Completed tiers get an ink border and `#FFE8B5` fill.
- **Busy**: during the clear sequence, taps on nodes are ignored.
- **All cleared**: the lighthouse lamp goes from .55 to full opacity.

## Accessibility

- Every node is a `<button>` with an `aria-label`: "Level 6, 3 of 3 stars", "Level 7, current level. Open level card", "Level 9, locked".
- The sheet is `role="dialog" aria-modal="true" aria-labelledby` its title; Escape, X (44px), scrim and Play close it, and focus returns to the opening node.
- Closed sheet and scrim are `visibility:hidden`, so their text is neither read nor counted off-screen.
- Toast is `role="status" aria-live="polite"`; the lives chip is `role="status"`.
- Contrast: cream on plate 13:1; `#2F4246` on `#C6CFCC` 6.6:1; white on `#C8412C` 4.9:1; sheet ink on cream 12:1. No text sits directly on the map art; zone names are on solid plates.
- Hit targets: nodes 56–66px; HUD chips 44px tall; Play 60px; Complete 48px; close 44px.

## Responsive rules

- At 360 wide the 390px lane is wider than the screen: scale node `x` around the centre by `vw/390` (or set the lane to `100vw` and compute `x = vw/2 + 104·(vw/390)·sin(…)`). Keep discs at full size.
- At tablet width the world bands stretch to the edges and the lane stays a 390px column in the centre; the sheet stays 390px wide, centred.
- The HUD chips stay pinned to the corners at 16px; the sheet is `min(390px, 100%)` wide.
- Short screens (≤700px tall): the camera target stays at 56%, and the sheet keeps its content height, scrolling inside if needed.

## Acceptance checklist

**Always**
- [ ] Three node states are visually distinct without colour alone: stars, pulse ring plus token, lock icon.
- [ ] Locked nodes use a solid muted fill, never `opacity` or `filter`, and their number passes 4.5:1.
- [ ] On load the camera eases from the bottom of the world to the current node in about 1.4s; reduced motion jumps there.
- [ ] Clearing a level plays stars, road draw, token hop, new node, camera, as separate beats.
- [ ] The closed sheet and scrim are `visibility:hidden`; focus returns to the opening node on close.
- [ ] Escape closes the sheet; input is ignored during the clear sequence.
- [ ] HUD text sits on solid plates; the top 54px and bottom 34px stay clear of fixed controls.
- [ ] `document.documentElement.scrollWidth` is 390 at a 390 viewport.
- [ ] Every interactive target is at least 44px.

**This demo**
- [ ] 14 levels across Kelp Hollow (1–4), Shallows (5–6), Sandbar (7–10), Gull Cliffs (11–13), Lamp Rock (14).
- [ ] Levels 1–6 start with stars 3, 2, 3, 3, 1, 3; level 7 is current.
- [ ] Lives "4", "+1 in 12:40" counting down; coins "2,480", +20 per star earned.
- [ ] Level 7 sheet: "Free 18 hermit crabs", "in 24 moves · tide rises every 6", tiers 9,000 / 14,000 / 19,500.
- [ ] Clearing level 14 lights the lighthouse lamp.

## Implementation notes

1. **Build the road from the node list.** Three paths per segment: a 22px ink track, a 10px dotted "locked" line, and a 10px cream "lit" line whose dash equals its own length. Unlocking only flips a class.

```js
const pts = [...Array(14)].map((_, i) => ({ x: Math.round(195 + 104 * Math.sin(i * .9 + .35)), y: 2250 - i * 150 }));
for (let i = 0; i < 13; i++) {
  const a = pts[i], b = pts[i + 1];
  const d = `M${a.x} ${a.y}C${a.x} ${a.y - 80} ${b.x} ${b.y + 80} ${b.x} ${b.y}`;
  track.append(path(d, 22, '#0B3440'), path(d, 10, '#6F8E92', '2 14'));
  const lit = path(d, 10, '#FFF4DC');
  lit.style.setProperty('--len', lit.getTotalLength());
  lit.classList.add('drawn'); if (i < current) lit.classList.add('go');
}
/* .drawn{stroke-dasharray:var(--len);stroke-dashoffset:var(--len)}
   .drawn.go{transition:stroke-dashoffset .7s cubic-bezier(.2,.7,.2,1);stroke-dashoffset:0} */
```

2. **Hop along the real road.** Sample the segment with `getPointAtLength` and lift each sample with a sine that repeats three times, so the token makes three small hops that follow the curve rather than flying straight.

```js
const L = seg.getTotalLength(), frames = [];
for (let k = 0; k <= 10; k++) {
  const q = seg.getPointAtLength(L * k / 10);
  const lift = Math.sin(Math.PI * ((k * 3 / 10) % 1)) * 16;
  frames.push({ transform: `translate(${q.x}px,${q.y - lift}px)` });
}
token.animate(frames, { duration: 660, easing: 'cubic-bezier(.4,0,.2,1)' }).onfinish = () => place(next);
```

3. **Camera is a scroll, not a transform.** Easing `scrollTop` with rAF keeps the map scrollable by the player and keeps fixed HUD chips fixed. Clamp the target to `[0, worldHeight − innerHeight]`. A common mistake is hiding the sheet with only `transform`: also set `visibility:hidden` with a delayed visibility transition so it animates out and then leaves the accessibility tree.

```css
.sheet{transform:translate(-50%,104%);visibility:hidden;
  transition:transform .42s cubic-bezier(.32,.72,0,1),visibility 0s .42s}
.open .sheet{transform:translate(-50%,0);visibility:visible;
  transition:transform .42s cubic-bezier(.32,.72,0,1)}
```
