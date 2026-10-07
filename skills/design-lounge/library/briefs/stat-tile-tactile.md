<!-- Design Lounge Nº 539 · "Tactile stat tiles" · www.designlounge.live -->

# Tactile stat tiles

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them. When a kit is locked, map the surface and inks onto the theme tokens and keep the two shadow tokens and the 1px edge.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The morning summary of Hush, a fictional sleep app, as three neumorphic tiles. One is the answer: "Asleep 7h 42min" at 72px, a delta pill pressed into the tile ("38 min more than your average"), and a seven-bar chart sitting in a well, each bar a small raised block with the latest night filled ink. The other two tiles are smaller (36px figures) and carry one sentence each. A segmented control at the top right swaps Night for Week and rewrites every figure, delta and sentence. The detail worth copying is the hierarchy under a style that flattens everything: one display size, pills pressed in rather than coloured, and bars that are raised objects in a pressed tray, so the chart reads without a single hue.

## Structure

```
1280 × 800, surface #E6E3DF; a 1040 set centred
Last night 22/800                                           ( Night | Week )  well, pressed raised
┌ tile 1.6fr, r24, raised ─────────────────┐ ┌ tile 1fr ─────────────┐ ┌ tile 1fr ──────────────┐
│ ASLEEP                                   │ │ DEEP SLEEP            │ │ RESTING HEART          │
│ 7h 42min   72/800                        │ │ 1h 51min  36/800      │ │ 54 bpm                 │
│ (↑ 38 min more than your average) well   │ │ (↑ 24%) well          │ │ (↓ 2 below last week)  │
│ ┌ well tray ─────────────────────────┐   │ │ Mostly before 02:00…  │ │ Lowest at 04:10…       │
│ │ ▮ ▮ ▮ ▮ ▮ ▮ █   raised bars, 7    │   │ └───────────────────────┘ └────────────────────────┘
│ └────────────────────────────────────┘   │
│  Wed Thu Fri Sat Sun Mon Tue  11/600     │
└──────────────────────────────────────────┘
```

- `main.set` → `div.head` (`h1`, `div.seg[role=group]` of two `aria-pressed` buttons), `div.tiles`.
- Each `section.tile[aria-labelledby]` → `span.label`, `div.num` (spans for the figures, `small` for the units), `span.delta` (an arrow SVG and text), then either `div.bars[role=img][aria-label]` of seven `i` plus `div.bars-l` labels, or a `p`.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
|---|---|---|---|---:|---|
| `.bars i` | load | transform (scaleY, origin bottom) | 0.2 → 1, delay 0 to 240ms in 40ms steps | 600ms | `--expo` |
| `.seg button` | press | box-shadow, color | none, `--ink-2` → `--raise-sm`, `--ink` | 200ms | `--ease` |
| figures, deltas, sentences | range change | text | swapped at once | 0 | – |

Reduced motion: no bar growth, 1ms transitions.

## States

- **Tile:** raised, 1px edge, no hover.
- **Delta pill:** a well with an arrow; up and down are different arrows, not colours.
- **Bar:** raised block with an edge; the latest period is filled `--ink`.
- **Segment pressed / unpressed:** raised ink / flat `--ink-2`.
- **Focus-visible:** 2px ink outline at 4px offset on the segments.

## Accessibility

- Each tile is a `<section>` labelled by its own label; the figures are real text ("7", "h", "42", "min"), so a screen reader hears "7 h 42 min".
- The bar tray is `role="img"` with an `aria-label` ("Hours asleep, the last seven nights"), since a label on a plain `div` is prohibited; the labels under it are visual (`aria-hidden`) because the sentence and figure carry the data. Add a visually hidden list of the seven values if the chart is the only place they appear in your product.
- Up and down deltas use different arrow glyphs and words ("more than", "below"); nothing depends on colour.
- The segmented control is a `role="group"` of `aria-pressed` buttons; the title changes with it.
- Contrast: `--ink` 11.7:1, `--ink-2` 6.1:1, `--ink-3` 4.9:1 on the surface; `--edge` 3.5:1 around tiles, pills, bars and the tray.
- Hit targets: segments 34px tall in a 42px well.

## Responsive rules

- ≥ 1280: three tiles, 1.6fr 1fr 1fr, gap 22.
- 1024–1279: the same at 1.4fr 1fr 1fr; the answer 60px.
- 768–1023: the big tile full width, the two small tiles in a row beneath.
- < 640: one column; the answer 56px; bar tray 72px; the head stacks title then segments.
- Dark pair: dark putty surface, shade `rgba(0,0,0,.45)`, light `rgba(255,255,255,.06)`, light ink, edge `#4a453f`; the latest bar fills with the light ink.

## Acceptance checklist

**Always**
- [ ] One display-size figure on the view; the other tiles' figures are at most half its size.
- [ ] One surface colour; tiles raised, pills and the bar tray pressed in, bars raised inside the tray; no third shadow colour and no hue for emphasis.
- [ ] Every tile, pill, bar and the tray has a 1px edge of at least 3:1 against the surface.
- [ ] Deltas show direction with an arrow and a word, never colour alone.
- [ ] The segmented control is `aria-pressed` buttons; switching rewrites the title, every figure, delta and sentence.
- [ ] The bars grow in on load, staggered, and are still under reduced motion.
- [ ] Radii 20 to 24px on tiles, 16px on the tray, 999px on pills; bars 6px on top.

**This demo**
- [ ] Night: 7h 42min, +38 min, 1h 51min (+24%), 54 bpm (2 below); Week: 7h 04min avg, 1h 38min (23%), 56 bpm; bars 62 / 70 / 48 / 80 / 66 / 58 / 90 with Tue filled.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: "Last night", segments Night (pressed) | Week. Tiles: Asleep 7h 42min, delta up "38 min more than your average", bars Wed to Tue at 62 / 70 / 48 / 80 / 66 / 58 / 90% with Tue filled ink; Deep sleep 1h 51min, delta up "24%", a sentence; Resting heart 54 bpm, delta down "2 below last week", a sentence.
2. On load the bars grow from 20% to full height over 600ms, 40ms apart (reduced motion: drawn at once).
3. Click Week: the title becomes "This week"; the figures become 7h 04min (avg), 1h 38min, 56 bpm; the deltas and sentences change; the bars stay (they already show the week).
4. Click Night: back to the first frame's values.
5. The pressed segment is raised and ink; the other is flat and `--ink-2`.
6. Nothing else is interactive; the tiles have no hover.

## Tokens

```css
:root {
  --surface: #e6e3df;
  --ink: #2a2622;  --ink-2: #56514b;  --ink-3: #625c56;
  --edge: #7d7770;                         /* 1px, 3.5:1 on the surface */
  --light: rgba(255,255,255,.85);  --shade: rgba(74,66,58,.22);
  --raise:    10px 10px 24px var(--shade), -10px -10px 24px var(--light);  /* tiles */
  --raise-sm:  5px  5px 12px var(--shade),  -5px  -5px 12px var(--light);  /* bars, pressed segment */
  --well:     inset 6px 6px 14px var(--shade), inset -6px -6px 14px var(--light);  /* the bar tray */
  --well-sm:  inset 3px 3px 7px var(--shade),  inset -3px -3px 7px var(--light);   /* delta pills, the segment well */

  --sans: "Sora", system-ui, sans-serif;
  --r: 20px;  --r-card: 24px;  --r-tray: 16px;
  --tray-h: 88px;  --gap: 22px;
  --t-micro: 200ms;  --t-bar: 600ms;
  --ease: cubic-bezier(.2, .7, .2, 1);  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| The answer | Sora | 72px | 800 | 0.95 | −0.045em | tabular numerals; units 28px/600 `--ink-2` |
| Small tile figure | Sora | 36px | 800 | 0.95 | −0.045em | units 18px/600 |
| Title | Sora | 22px | 800 | 1 | −0.025em | sentence |
| Delta | Sora | 13px | 600 | 1 | 0 | sentence, in a well pill |
| Sentence | Sora | 13px | 400 | 1.45 | 0 | sentence, `--ink-2` |
| Segment | Sora | 13px | 600 | 1 | 0 | sentence |
| Label | Sora | 12px | 600 | 1 | +0.06em | UPPERCASE, `--ink-3` |
| Bar labels | Sora | 11px | 600 | 1 | 0 | Wed…Tue, `--ink-3` |

## Implementation notes

**Raised bars in a pressed tray:**

```css
.bars { height: 88px; padding: 10px 12px; border-radius: 16px; box-shadow: var(--well); border: 1px solid var(--edge);
  display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; align-items: end; }
.bars i { height: var(--h); border-radius: 6px 6px 3px 3px; background: var(--surface); border: 1px solid var(--edge); box-shadow: var(--raise-sm);
  transform-origin: bottom; animation: grow var(--t-bar) var(--expo) both; animation-delay: var(--d); }
.bars i.now { background: var(--ink); border-color: var(--ink); }
@keyframes grow { from { transform: scaleY(.2) } }
```

**Figures as spans**, so units stay in the text face at a smaller size and the number stays readable:

```html
<div class="num"><span>7</span><small>h</small><span>42</span><small>min</small></div>
```

**The range swap** is a data object and `innerHTML` on known ids; no framework needed:

```js
const d = D[b.dataset.r];
n1.innerHTML = d.n1; d1.innerHTML = arrow(true) + d.d1; p2.textContent = d.p2; // and so on
```

**Variants.** A tile with no chart drops the tray and keeps the sentence; a tile with a target shows it as a second pill ("goal 8h") in the same well style, never as a coloured ring. For a dark pair, keep the latest bar in the light ink.

Common mistakes: four equal tiles in a row (the answer gets lost); a green or red delta instead of an arrow and a word; a coloured fill on the bars; shadows without the hairline, so the bars merge into the tray on a dim screen.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
