<!-- Design Lounge Nº 218 · "Device battery widget" · www.designlounge.live -->

# Device battery widget

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A large home-screen widget for Merrow, a household of connected devices, showing every battery at once. Four squishy clay tiles hold progress rings around raised cream pucks: phone, earbuds (three small rings for left, right and case), watch and pen. Charging rings carry a moving highlight and a pulsing bolt badge, and the percentages really climb while you watch. Tapping a tile slides in a detail view with a chunky pill bar per battery, a 24-hour history and three fact chips. The thing worth copying is the clay material: two outer shadows (warm dark bottom-right, light top-left) plus two inset shadows, so every surface looks moulded, and pressing a tile flips it to an inset dent.

## Structure

```
1280×800, warm clay radial background
          ┌──────────── 452 × ≥438, radius 40, padding 22 ─────────────┐
          │ Batteries                              2 charging · 1 low   │  22px / 13px
          │ ┌──────── tile r28 ────────┐ ┌──────── tile ────────────┐ │
          │ │ ( ring 84 )+            │ │ (L56) (R56) (C56)+      │ │
          │ │ 82%                      │ │ 64%   61%   38%          │ │
          │ │ Phone                    │ │ 61%                      │ │
          │ │ Charging · 34 min to full│ │ Pebblepod Pro            │ │
          │ └──────────────────────────┘ └──────────────────────────┘ │
          │ ┌ Watch 23% (terracotta) ──┐ ┌ Pen 91% ─────────────────┐ │  gap 14
          │ └──────────────────────────┘ └──────────────────────────┘ │
          └─────────────────────────────────────────────────────────────┘

Detail (replaces grid in the same box):
  (<) Earbuds / Pebblepod Pro
  61%                                   [ Case charging ]
  Left  [██████████░░░░░]  64%
  Right [█████████░░░░░░]  61%
  Case  [█████░░░░░░░░░░]  38%
  ▁▂▂▃▃▃▃▃▃▃▃█   24 h ago … Now
  [ Full in 87 min ] [ Input 5 W ] [ Health 92% ]
```

- Widget: `section` labelled "Merrow device batteries".
- Tiles: four `button`s in a 2-column grid (`repeat(2, minmax(0, 1fr))`), each 170px min height, flex column with the label pushed to the bottom.
- Ring: an `svg` (viewBox 0 0 84 84, rotated −90°) with three circles r36: groove track, sage fill (dasharray = circumference, dashoffset = circ × (1 − p)), and a highlight dash. A cream puck sits in the middle with the device icon (or the letter L/R/C on small rings). A bolt badge sits top-right.
- Detail: `div role="region"` labelled by the device `h2` (`tabindex="-1"`), absolutely filling the widget's padding box.
- While the detail is open, the grid gets `inert` so tiles cannot be tabbed behind it.
- A visually hidden `aria-live="polite"` paragraph for "fully charged".

## Motion

| Thing | Trigger | Property | Values | Timing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Ring fill | charge tick | stroke-dashoffset | circ × (1 − p) | 600ms `--ease` | instant |
| Ring highlight | charging | stroke-dashoffset of a `10 circ` dash | 0 → −circ | 2.4s `--ease`, infinite | hidden |
| Bolt badge | charging | scale | 1 → 1.12 → 1 | 2.4s `--ease`, infinite | static |
| Bar sweep | charging, detail | translateX of a white band | −100% → 100% | 1.8s `--ease`, infinite | none |
| Tile hover | hover | translateY | 0 → −2px | 260ms `--spring` | none |
| Tile press | `:active` | scale, shadow | 0.96, outer → inset | 260ms `--spring` / 200ms | shadow swap only |
| Open detail | tile click | grid opacity/scale; detail opacity/translateX | 1 → 0, 1 → 0.96; 0 → 1, 28px → 0 | grid 220/320ms; detail 260ms (+80ms), 380ms (+60ms) | instant |
| Close | back / Esc | reverse | — | 220ms / 320ms, visibility flips after 320ms | instant |

The 6-second charge tick is data, not decoration; it keeps running under reduced motion.

## States

- Tile resting: raised (`--shadow-tile`). Hover: −2px. Pressed: `--shadow-pressed` at scale 0.96.
- Ring normal: sage. Low (≤ 25%): terracotta, note in `--low-ink`. Charging: sage + highlight + bolt badge. Full: no badge, note "Charged".
- Status pill: inset clay pill; text sage-dark `#2f6a3a` for charging, `--low-ink` for low.
- Focus-visible: 3px `--ink` outline, 3px offset, on tiles and the back button.
- Detail open: grid inert and faded; header hidden.
- Empty: not shown. In a product, a device that is not connected shows a dashed groove ring and "Not nearby", never 0%.

## Accessibility

- Each tile is a button whose name reads the whole state: "Earbuds, Pebblepod Pro: Left 64 percent, Right 61 percent, Case 38 percent charging. Open details". Recompute it on every tick.
- Rings, bars and icons are `aria-hidden`; numbers are in text.
- Opening moves focus to the device `h2` (`tabindex="-1"`). Escape and Back close and return focus to the opening tile.
- The grid is `inert` while the detail is open.
- History is `role="img"` with a label like "Last 24 hours: from 62 to 82 percent".
- Live region announces only completion ("Phone fully charged"), not every percent.
- Contrast: `#3a2c23` on `#f3e9dd` is about 12:1; `#6e5a4b` on `#f3e9dd` is about 5.6:1; `#9e4426` on `#f3e9dd` is about 5.5:1.
- Back button is 44×44. Tiles are at least 170px tall.

## Responsive rules

- ≥1024: widget 452px wide, centred.
- 768: unchanged.
- <640: widget width `min(452px, 100vw − 24px)`. Under 480px: padding 16px, gap 10px, big ring 70px, small rings 40px, tile radius 24px, detail percentage 52px. No horizontal overflow at 375.
- As a real home-screen widget this is the 4×4 size. A 2×2 version shows only the lowest-battery device's ring.

## Acceptance checklist

### Always

- [ ] Every surface uses the four-shadow clay recipe; pressed tiles flip to inset.
- [ ] Rings are SVG stroke-dashoffset on a −90° rotated circle with round caps.
- [ ] Charging is shown by three signals: moving highlight, bolt badge, and a rising number.
- [ ] Low threshold is ≤ 25% and switches both ring colour and note colour.
- [ ] Multi-battery devices show each battery plus a headline number = the lowest earpiece.
- [ ] Tile accessible names contain every percentage and update when they change.
- [ ] Opening a tile moves focus to the detail heading; closing restores focus to the tile; Escape closes.
- [ ] Reduced motion removes the highlight, pulse, sweep and slide.

### This demo

- [ ] Phone 82% charging at 18 W, Pebblepod Pro L 64 / R 61 / Case 38 charging at 5 W, Watch 23% low, Pen 91%.
- [ ] Header summary "2 charging · 1 low".
- [ ] Charging batteries gain 1% every 6000ms.
- [ ] Sage `#5f9468`, terracotta `#c8603c`, cocoa ink `#3a2c23` on clay `#ecdfd0`.
- [ ] Fredoka for numbers and headings, Nunito Sans for labels.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: header "Batteries", summary "2 charging · 1 low". Tiles in a 2×2 grid: Phone 82% "Charging · 34 min to full"; Pebblepod Pro 61% "Case charging" with L 64%, R 61%, C 38%; Watch 23% "Low · about 3 h left" in terracotta; Pen 91% "Attached to tablet".
2. Phone ring and Case ring show the charging highlight (a 10-unit dash travelling round the ring every 2.4s) and a sage bolt badge pulsing 1 → 1.12 → 1.
3. Every 6000ms each charging battery gains 1% (until 100). The ring's dash offset tweens over 600ms, the tile percentage and note update ("34 min" recalculates), and the tile's accessible name updates.
4. Reaching 100% stops the highlight and badge, and the live region says "Phone fully charged" or "Earbuds Case fully charged". The phone note becomes "Charged".
5. Earbuds tile shows min(left, right) as its big number, because that is the number that runs out first.
6. Hover lifts a tile 2px. Pressing squashes it to 0.96 and swaps the outer shadows for inset ones. Release springs back with an overshoot curve.
7. Clicking a tile: the grid fades and scales to 0.96, the header hides, and the detail view slides in from 28px right. Focus moves to the device name heading.
8. Detail view: back button (44px clay disc), name and model, big percentage, a status pill ("Charging", "Case charging", "Low battery", "On battery"), one bar per battery (one "Level" bar for single-battery devices), a 12-bar 24-hour history with the latest bar in sage, and three chips: Full in / Lasts, Input / Use, Health.
9. Charging bars carry a white sweep moving left to right every 1.8s. Low bars (≤ 25%) are terracotta.
10. Back button or Escape returns to the grid and puts focus back on the tile that was opened.

## Tokens

```css
:root {
  /* clay surfaces */
  --bg: #dfcfbd;       /* page */
  --body: #ecdfd0;     /* widget slab */
  --tile: #f3e9dd;     /* tiles, chips, back button */
  --puck: #fbf4ea;     /* ring centre */
  --groove: #e1d2c1;   /* ring track, bar track, history bars */

  /* ink */
  --ink: #3a2c23;      /* cocoa */
  --ink-2: #6e5a4b;    /* secondary */
  --low-ink: #9e4426;  /* low note text */

  /* charge colours */
  --sage: #5f9468;     /* fill, bolt badge */
  --sage-hi: #9fcaa2;  /* highlight dash, bar top, current history bar */
  --clay: #c8603c;     /* low fill */
  --clay-hi: #eaa284;

  /* light */
  --hi: rgba(255, 250, 243, .85);
  --lo: rgba(132, 96, 68, .28);
  --shadow-slab: 18px 22px 44px rgba(120,86,60,.32), -14px -14px 30px rgba(255,248,238,.6),
                 inset 3px 3px 6px var(--hi), inset -5px -6px 12px rgba(150,112,82,.2);
  --shadow-tile: 7px 9px 16px var(--lo), -5px -5px 12px var(--hi),
                 inset 2px 2px 3px var(--hi), inset -3px -4px 6px rgba(150,112,82,.16);
  --shadow-pressed: 3px 4px 8px var(--lo), -2px -2px 6px var(--hi),
                 inset 3px 3px 6px rgba(150,112,82,.22), inset -2px -2px 4px var(--hi);

  /* type */
  --display: "Fredoka", ui-rounded, system-ui, sans-serif;
  --sans: "Nunito Sans", system-ui, sans-serif;

  /* shape */
  --r-slab: 40px; --r-tile: 28px; --r-chip: 20px; --r-bar: 12px;
  --s-gap: 14px; --s-pad: 22px;

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --spring: cubic-bezier(.34, 1.56, .64, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Notes |
| --- | --- | --- | --- | --- | --- |
| Widget title | Fredoka | 22px | 600 | 1 | "Batteries" |
| Tile percentage | Fredoka | 30px, "%" at 16px | 600 | 1 | tabular |
| Detail percentage | Fredoka | 64px, "%" at 28px | 600 | 1 | 52px under 480px |
| Detail name | Fredoka | 22px | 600 | 1.1 | — |
| Bar value, chip value | Fredoka | 15px / 18px | 600 | 1.3 | tabular |
| Ring letter (L/R/C) | Fredoka | 12px | 600 | — | — |
| Device name | Nunito Sans | 14px | 700 | 1.45 | — |
| Note, summary | Nunito Sans | 12.5px / 13px | 600 | 1.45 | `--ink-2`, low = `--low-ink` |
| Small labels | Nunito Sans | 11–11.5px | 600–700 | — | `--ink-2` |

## Implementation notes

**Clay material.** The look is entirely shadows; no gradients on the tiles. Keep light top-left and warm shadow bottom-right on every element, including the back button and chips:

```css
.tile {
  background: #f3e9dd; border-radius: 28px;
  box-shadow: 7px 9px 16px rgba(132,96,68,.28), -5px -5px 12px rgba(255,250,243,.85),
              inset 2px 2px 3px rgba(255,250,243,.85), inset -3px -4px 6px rgba(150,112,82,.16);
  transition: transform 260ms cubic-bezier(.34,1.56,.64,1), box-shadow 200ms cubic-bezier(.2,.7,.2,1);
}
.tile:active { transform: scale(.96);
  box-shadow: 3px 4px 8px rgba(132,96,68,.28), -2px -2px 6px rgba(255,250,243,.85),
              inset 3px 3px 6px rgba(150,112,82,.22), inset -2px -2px 4px rgba(255,250,243,.85); }
```

**Ring with a travelling highlight.** Three circles share one radius. The highlight is a short dash whose offset animates by one circumference:

```html
<svg viewBox="0 0 84 84" style="transform:rotate(-90deg)">
  <circle class="tr" cx="42" cy="42" r="36"/>                       <!-- groove, stroke 9 -->
  <circle class="fl" cx="42" cy="42" r="36" stroke-dasharray="226.2" stroke-dashoffset="40.7"/>
  <circle class="sh" cx="42" cy="42" r="36" stroke-dasharray="10 226.2"/>
</svg>
<style>@keyframes sheen { to { stroke-dashoffset: -226.2 } }
.chg .sh { animation: sheen 2.4s cubic-bezier(.2,.7,.2,1) infinite }</style>
```

**Ticking without re-rendering the tile.** Update the dashoffset, classes, label text and `aria-label` in place, so the 600ms tween runs and keyboard focus stays on the tile. Re-creating the button with `innerHTML` drops focus and kills the transition.

Common mistakes:

- Neumorphism on a grey background with no colour; clay needs a warm base and one real accent.
- Showing the earbuds as a single average. Left, right and case drain differently.
- Animating the charge highlight on full batteries.
- Leaving tiles tabbable behind the detail view.
- Pure white highlights; use `rgba(255,250,243,.85)` so the light reads warm.

Where it sits: a device dashboard or home screen beside `widget-control-toggles`; the earbuds here are the same "Pebblepod Pro" that appear connected in that control centre.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
