<!-- Design Lounge Nº 578 · "Adventure quest map" · www.designlounge.live -->

# Adventure quest map

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The world map of an island adventure game, drawn flat like a modern indie board game: a teal sea with a tiled wave pattern, islands with a wide shallow-water ring, sand, two greens, a range of terracotta peaks with snow caps, forest dots, a river, villages and beacon markers. Eight quest nodes sit on the map in four states (done, active, available, locked). Choosing one draws a dotted trail from your camp to it and fills the right-hand quest panel with its objectives, progress, rewards and next step. The UI chrome is chunky: 2px ink outlines and 4px offset shadows, so it reads as cut-out cardboard over the painted map. The detail worth copying: the dotted trail is revealed through an SVG mask whose stroke animates, so dots stay round and evenly spaced while the trail "walks" out.

## Structure

```
1280 × 800
┌───────────────────────────── map 1fr (SVG 900 × 800, slice) ─────────┬── panel 380 ──┐
│ ┌ The Wayfarer Isles ┐                          (All|Main story|Side)│ [MAIN][ACTIVE]│
│ └ Day 23 · 5 of 8 ───┘                                               │ Beacons of    │
│  THE GLASS SEA     SALTMERE ✓     EMBERREACH  ▲▲ 🔒                   │ Thornvale 32px│
│           ✓   ⌂⌂   ~~~river~~~                  🔒                    │ meta · desc   │
│  (N)    ⛺ ·  ·  ·                ○        ▵ ▵ ▵                      │ ─ ─ ─ ─ ─ ─   │
│          MIRROWOOD ○  ·  ·  · (★) [Beacons of Thornvale]              │ OBJECTIVES    │
│                     THORNVALE                       ( 🔒 )            │ ☑ ☐ 1/3 ▬ ☐   │
│   ( isle ) · · · · · · · · · · · · · · · · · · · ·( isle )           │ REWARDS 3 up  │
│ [● Active ○ Available ● Done ● Locked]          HOLLOW ISLES          │ NEXT STEP     │
│                                                                       │ [Tracking] 3.1│
└───────────────────────────────────────────────────────────────────────┴───────────────┘
body: grid minmax(0,1fr) | 380px; the panel has a 3px ink left border
```

- `<section class="map">` holds one `<svg viewBox="0 0 900 800" preserveAspectRatio="xMidYMid slice">` and three HTML overlays: title card, filter group, legend.
- SVG layers in order: sea fill, wave `<pattern>` (60 × 34) at 60%, shallows (island paths with a 28px `--shallow` stroke), sand, grass, highland, forest, peaks, river and bridge, region `<text>`, villages, beacons, sea route, the trail `<path id="route" mask>`, camp tent, `<g id="nodes">`, the name tag group, compass.
- Each node is `<g class="node" role="button" tabindex="0" aria-label>` with an optional pulse circle, a selection ring, a 16px disc and a glyph (star for main, dot for side, tick for done, padlock for locked).
- `<aside aria-live="polite">` is re-rendered from data on selection.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
|---|---|---|---|---:|---|
| Trail mask | select | stroke-dashoffset | path length → 0 | 900ms | `--ease-out` |
| Active pulse | always | scale, opacity | .6, .9 → 1.9, 0 | 2.4s loop | `--ease-out` |
| Node disc | hover | r | 16 → 19 | 200ms | `--ease` |
| Buttons | hover / active | translate, shadow | 0, 3px → −1px, 4px / 2px, 1px | 120ms | `--ease` |
| Objective bar | render | width | 0 → value | 500ms | `--ease-out` |

Reduced motion: no pulse and the trail appears complete at once; selection and the panel still update.

## States

- **Node done:** `--done` disc, white tick. **Active:** `--active` disc, white star, pulse. **Available:** `--open` disc with ink glyph. **Locked:** `--locked` disc, dashed 2.5px outline (4 3), white padlock.
- **Node selected:** 24px ink ring at full opacity plus the name tag (cream pill, 1.5px ink stroke, 30px tall), placed right of the node or left when it would leave the map.
- **Node focus-visible:** the ring turns `--active` at 3px.
- **Filtered out:** opacity .25, `pointer-events:none`, `tabindex=-1`.
- **Filter pressed:** ink pill with paper text.
- **Primary button:** `--active` fill, white text, ink outline and 3px shadow; **disabled:** `--paper-2`, `--ink-3` text, `--locked` outline, no shadow.
- **Objective done:** green filled box with a white tick, text struck in `--ink-3`.

## Accessibility

- Nodes are focusable SVG groups with `role="button"` and labels like "Beacons of Thornvale, Active, main story"; Enter and Space select.
- Filters are a `role="group"` of buttons with `aria-pressed`.
- The panel is `aria-live="polite"`: the new quest title and objectives are read after a selection.
- The legend is decorative (`aria-hidden`); state is in each node's label and in the panel pill, so colour is never the only cue.
- Contrast on `--paper`: `--ink` 13.4:1, `--ink-2` 6.6:1, `--ink-3` 5.1:1, `--gold` 5.5:1; white on `--active` 5.0:1 (the brighter #d9481f only reaches 4.3:1, so it is not used under text).

## Responsive rules

- ≥ 1280: map and 380px panel side by side, no page scroll; the SVG slices so wider screens show more sea.
- 1024 to 1279: the panel stays 380px; the map crops at the sides.
- 900 and below: one column. The map is 480px tall (still `slice`, so it crops to the island centre), the panel follows under a 3px top border and the page scrolls. The title card and filters stack top-left at 12px; the legend spans the bottom. Labels and the compass that sit on the cropped edges (`.edge`) are hidden so no text is cut by the frame. Rewards become two columns with the item full width.

## Acceptance checklist

**Always**
- [ ] Four node states are distinct by fill, glyph and outline style, not colour alone.
- [ ] Exactly one node pulses: the active quest.
- [ ] Selecting a node draws a dotted trail from the camp over 900ms through a mask, with round, evenly spaced dots.
- [ ] The trail is a quadratic curve that bows to one side, never a straight line.
- [ ] The panel swaps in place and announces politely; locked quests show their requirement instead of objectives.
- [ ] Counted objectives show "n/m" and a progress bar.
- [ ] One filled primary button whose label matches the quest state; done and locked disable it.
- [ ] Filtering dims and de-focuses nodes without moving anything.
- [ ] At 390 wide nothing scrolls sideways and no map text is cut by the frame.

**This demo**
- [ ] Eight quests: 2 done, 1 active, 2 available, 3 locked; title card "Day 23 · 5 of 8 quests open".
- [ ] First frame: Beacons of Thornvale, Level 12, from Captain Rook Ashby, beacons 1/3, rewards 1,200 XP, 340 silver, Wayfarer's Compass.
- [ ] Distance reads 3.1 km from camp, about 37 min on foot.
- [ ] Fonts are Righteous and Nunito only.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: "Beacons of Thornvale" (main story, active) is selected. Its node has a 24px ink ring, a coral pulse ring (2.4s loop), and a cream name tag beside it. A dotted trail runs from the camp tent near Saltmere to the node.
2. Hover a node: its disc grows from r 16 to 19 over 200ms.
3. Click a node, or focus it and press Enter or Space: the ring and name tag move to it, the trail redraws from the camp over 900ms, and the panel swaps to that quest.
4. The panel shows: type pill and state pill, title, region · level · giver, description, objectives (done items ticked and struck through; counted items show "1/3" and a 6px coral bar), rewards (XP, silver, an item in gold), a dark Next step callout when there is one, then the primary button and distance ("3.1 km from camp, about 37 min on foot").
5. The primary button reads "Tracking" for the active quest, "Track quest" for available ones, "Completed" (disabled) for done, "Locked" (disabled) for locked. A locked quest replaces objectives with "Requires: Beacons of Thornvale" on a tinted strip, and the finale hides its rewards as "?".
6. The filter pill (All, Main story, Side) fades non-matching nodes to opacity .25 and removes them from the tab order and pointer hits; the map never re-lays out.
7. Only the active node pulses. Nothing else loops.

## Tokens

```css
:root {
  /* map */
  --sea: #1f5d66;  --shallow: #4b9aa0;  --wave: #2f7880;
  --sand: #f1d9a7; --grass: #8bb86f;    --grass-2: #6e9f58; --wood: #4f8a52;
  --rock: #c4805e; --rock-2: #9b5f45;   --snow: #fbf3e4;    --river: #7db0b6;
  /* UI */
  --paper: #fdf6e8;   /* cards, panel */
  --paper-2: #f4e9d2; /* progress track, lock strip, disabled */
  --ink: #1f2b33;     /* outlines, text, offset shadows */
  --ink-2: #4c5a63;
  --ink-3: #5e6b73;
  --line: #e2d4b8;    /* dashed section rules */
  /* quest states */
  --active: #c8401a; --done: #3f7d5a; --open: #fdf6e8; --locked: #7d8a90;
  --gold: #8a5a12;    /* item reward */
  /* type */
  --display: "Righteous", sans-serif;
  --text: "Nunito", sans-serif;
  /* shape */
  --outline: 2px solid var(--ink);
  --shadow: 4px 4px 0 var(--ink); /* buttons 3px */
  --r-card: 14px; --r-btn: 12px; --r-reward: 10px;
  /* motion */
  --t-trail: 900ms; --t-pulse: 2.4s; --t-hover: 200ms;
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Quest title | Righteous | clamp(26px, 2.6vw, 32px) | 400 | 1.05 | 0 | title |
| Map title | Righteous | 26px | 400 | 1 | .02em | title |
| Region label (SVG) | Righteous | 20px | 400 | 1 | .22em | upper, 75% opacity |
| Sea label (SVG) | Righteous | 16px | 400 | 1 | .4em | upper |
| Reward value | Righteous | 20px (item 15px) | 400 | 1.1 | 0 | |
| Body, objectives | Nunito | 15px | 600 | 1.45 to 1.55 | 0 | sentence |
| Meta, distance | Nunito | 13 to 14px | 600 to 700 | 1.3 | 0 | |
| Pills, section heads | Nunito | 11 to 12px | 800 | 1 | .14 to .16em | upper |
| Node tag (SVG) | Nunito | 13px | 800 | 1 | 0 | title |

## Implementation notes

**Shallows for free.** Draw each island twice: once with a wide stroke in the shallow colour, then the fill on top. The stroke becomes a coastline ring that follows every curve.

```html
<g stroke="var(--shallow)" stroke-width="28" stroke-linejoin="round" fill="var(--shallow)"><use href="#isle"/></g>
<g fill="var(--sand)"><use href="#isle"/></g>
```

**A dotted trail that draws.** Animating `stroke-dashoffset` on a dotted path slides the dots. Keep the dots static and reveal them through a mask whose solid stroke draws instead:

```css
#route{fill:none;stroke:var(--paper);stroke-width:4;stroke-linecap:round;stroke-dasharray:.1 11}
#routeMask{fill:none;stroke:#fff;stroke-width:12}
.drawing{animation:draw 900ms var(--ease-out) both}
@keyframes draw{from{stroke-dashoffset:var(--len)}to{stroke-dashoffset:0}}
```

```js
const d = `M${x0} ${y0}Q${mx - dy * .25} ${my + dx * .25} ${x1} ${y1}`;
route.setAttribute('d', d); mask.setAttribute('d', d);
const len = mask.getTotalLength();
mask.style.setProperty('--len', len); mask.style.strokeDasharray = len;
mask.classList.remove('drawing'); mask.getBoundingClientRect(); mask.classList.add('drawing');
```

**Never nest a bare `<svg>` icon inside the map.** An inner `<svg>` without width and height renders at 300 by 150 user units; inside a scaled map that is a giant glyph. Inline the `<path>` and position it with a transform.

Common mistakes: map text that runs off the cropped edge on phones; region labels placed over nodes; a drop shadow on map shapes (the offset ink shadow belongs only to UI chrome).

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
