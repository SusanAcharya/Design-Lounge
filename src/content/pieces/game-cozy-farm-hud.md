---
title: "Cozy farm HUD"
summary: "A farming-sim HUD over a painterly SVG field: a stitched day clock with a moving sun, an energy bar, a wooden hotbar, and a quest note pinned like paper."
platform: web
type: screen
category: widgets
tags: [game, hud, farming, hotbar, quest, cozy]
styles: [soft, playful, organic]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-28
palette: ["#E9D3A6", "#FBF0D9", "#4A3324", "#8A5D3B", "#5F8F3E"]
fonts: ["Baloo 2"]
related: [game-quest-map, game-fantasy-inventory]
---

# Cozy farm HUD

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The in-game HUD of a cozy farming game, laid over a hand-made afternoon scene: rolling hills, a red barn, a sandy path, a fence and eight turnip beds, all drawn in SVG and pushed through a turbulence displacement filter so every edge wobbles like gouache. The HUD is four soft objects: a cream **day card** with a stitched inner border and a tiny dial where the sun travels an arc, an **energy** pill with a leaf, a **wooden hotbar** of ten tool slots, and a **quest note** on ruled paper, pinned with a red pin and torn along the bottom. You can actually play it: pick the watering can and click the dry beds. The detail worth copying is the stitched border (a dashed line 6px inside a 22px-radius card), which makes flat UI read as sewn and friendly without a single texture image.

## Reference behaviour

1. Initial state: Spring 14, Thursday, 2:40 pm. Slot 1 (watering can) is selected and raised 8px; the tag above the hotbar reads "Watering can" with a water gauge at 18 / 40. Energy 72 / 120. Five of eight beds are dark (watered), three are light (dry). The note's first task reads "Water the turnip beds (5 of 8)"; the second task is already ticked and struck through.
2. Click a slot or press 1 to 9, 0: that slot rises 8px with a springy 220ms ease and gains a 3px ink ring; the tag text changes (for seeds: "Turnip seeds · 24 left"). Slot 0 is empty and disabled.
3. With the watering can, click or press Enter on a dry bed: three drops fall into it (700ms), the soil darkens over 600ms, water −1, energy −2 (bar animates 400ms), and the task count goes up by one.
4. Watering the eighth bed ticks the task with a springy check and strikes it through; a paper hint pops above the hotbar: "All eight beds watered. Granny Odile will be pleased."
5. Clicking a bed with any other tool, a watered bed, or with an empty can shows a hint bubble that explains why, for 2.2s.
6. The clock advances 10 game minutes every 4 real seconds until 8:00 pm; the sun dot moves along the dial's arc (6 am on the left horizon, 8 pm on the right).
7. Ambient: two clouds drift 60px over 60s, two grass sprigs sway 3° over 5s. Nothing else loops.

## Structure

```
1280 × 800, scene full bleed (SVG 1280 × 800, xMidYMax slice)
┌──────────────────────────────────────────────────────────────────────────┐
│┌ day card 28,24 ───────────┐                        ● pin               │
││ (dial 78) Spring 14        │                  ┌ note 300 wide, 2.2° ──┐ │
││           Thursday · 2:40  │      sun          │ Granny Odile's list    │ │
││           [Clear 19°][1,286 g]                 │ ☐ Water beds (5 of 8)  │ │
│└────────────────────────────┘                  │ ☑ Feed the hens        │ │
│┌ energy 28,152 ────────────┐                   │ ☐ Take 3 honey jars    │ │
││ (leaf) ENERGY ▓▓▓▓░░ 72/120│                   │ Reward …               │ │
│└────────────────────────────┘                  └╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱┘ │
│   barn   tree   hay          fence ─────────              tree           │
│      path                    [bed][bed][bed][bed]   (row 1, y 508)        │
│                             [bed][bed][bed][bed]    (row 2, y 588)        │
│                   ( Watering can ▬▬▬ 18 / 40 )                           │
│          ┌ hotbar: 10 × 60px slots, gap 6, wood 8px padding ┐            │
└──────────────────────────────────────────────────────────────────────────┘
```

- `<svg class="scene">`: sky is the body gradient; the SVG holds sun glow, clouds, three hill bands, barn, trees, hay, path, fence, the light field, the `<g id="plots">` of 8 bed groups (`role="button"`, `tabindex="0"`), sprigs and flowers. One `filter#rough` (feTurbulence 0.035, 2 octaves, displacement 7) on the land and clouds; the beds are not filtered so they stay crisp and clickable.
- `<svg class="grain">`: full-size turbulence noise at 22% opacity, `mix-blend-mode:multiply`.
- `<section class="card clock">`, `<section class="card energy">`, `<section class="note">` plus a separate `.pin`.
- `.bar`: the `.tag` pill above a `role="toolbar"` of 10 `<button class="slot">`.
- `.hint` (`role="status"`) floats 150px above the bottom.

## Tokens

```css
:root {
  --sky-1: #a6d0dc;   /* sky top */
  --sky-2: #f4e4c4;   /* horizon haze; body ends at #e9d3a6 */
  --paper: #fff8ea;   /* note, hint bubble */
  --card: #fbf0d9;    /* HUD cards */
  --stitch: #d8bf93;  /* dashed inner border */
  --ink: #4a3324;     /* primary text, selected ring, tag fill */
  --ink-2: #6e5340;   /* secondary text, checkbox stroke */
  --ink-3: #7f6450;   /* labels, struck tasks */
  --wood: #8a5d3b;    /* hotbar */
  --wood-2: #a77650;  /* hotbar top highlight */
  --wood-dark: #5e3c24; /* hotbar bottom lip */
  --slot: #f6e7c8;    /* slot face */
  --leaf: #5f8f3e;    /* energy, ticks */
  --leaf-2: #86b35a;  /* energy highlight, turnip leaves */
  --water: #2c6a94;   /* task count, focus ring */
  --pin: #c9513a;
  --soil: #b98a5e;    /* dry bed */
  --soil-wet: #7b5638;/* watered bed */
  --font: "Baloo 2", ui-rounded, sans-serif;
  --r: 22px;          /* card radius; slots 14px, hotbar 20px, pills 99px */
  --card-shadow: 0 2px 0 #d9c29a, 0 10px 24px rgba(94,60,36,.18);
  --ease: cubic-bezier(.2,.7,.2,1);
  --spring: cubic-bezier(.34,1.56,.64,1);
}
```

## Typography

One family, Baloo 2, at four weights.

| Role | Size | Weight | Line-height | Tracking | Notes |
|---|---:|---:|---:|---:|---|
| Day ("Spring 14") | 30px | 800 | 1 | −.01em | |
| Note heading | 22px | 800 | 1.2 | 0 | |
| Time line | 17px | 600 | 1.2 | 0 | `--ink-2` |
| Task line | 16px | 600 | 30px | 0 | sits on the 30px ruling |
| Tag, hint, energy value | 15px | 700 | 1.3 to 1.4 | 0 | |
| Chips, from line, reward | 14px | 600 to 700 | 1.3 to 1.5 | 0 | |
| Energy label | 13px | 600 | 1 | .08em | upper |
| Slot key number / count | 12 / 13px | 700 / 800 | 1.3 | 0 | |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
|---|---|---|---|---:|---|
| Slot | selected | translateY | 0 → −8px | 220ms | `--spring` |
| Bed soil | watered | fill | `--soil` → `--soil-wet` | 600ms | `--ease` |
| Drops | watered | opacity, translateY | 0, −14 → 1 → 0, 8px | 700ms | `--ease` |
| Energy bar | spent | width | old → new | 400ms | `--ease` |
| Water gauge | spent | width | old → new | 300ms | `--ease` |
| Check mark | task done | scale, opacity | .4, 0 → 1, 1 | 300ms | `--spring` |
| Hint | shown | opacity, translateY | 0, 8 → 1, 0 | 200 / 300ms | `--ease` / `--spring` |
| Clouds | always | translateX | 0 → 60px | 60s alternate | linear (ambient only) |
| Sprigs | always | rotate | 0 → 3° | 5s alternate | ease-in-out |
| Sun dot | clock tick | cx, cy | along arc | instant, every 4s | |

Reduced motion: drop the clouds, sprigs and drops, make every transition 1ms. Watering, ticks and the clock still work.

## States

- **Slot hover:** face lightens to `#fff4dc`.
- **Slot selected:** `aria-pressed="true"`, raised 8px, face `#fffaf0`, 3px `--ink` ring.
- **Slot empty:** sunken `#d8bd92` with an inner top shadow, disabled.
- **Bed hover:** 3px `--paper` stroke. **Bed focus-visible:** 4px `--water` stroke.
- **Task done:** green tick in a slightly wonky 20px box (radii 5 7 4 6px), text struck with a 2px line in `--ink-3`.
- **Focus-visible (HTML):** 3px `--water` outline, 3px offset.

## Accessibility

- Hotbar is `role="toolbar"` with `aria-label="Hotbar, keys 1 to 0"`; each slot is a button with `aria-pressed` and a label that includes the stack count ("Turnip seeds, 24").
- Number keys 1 to 9 and 0 pick slots anywhere on the page.
- Beds are focusable SVG groups with `role="button"`; Enter and Space water them; their label flips "dry" to "watered".
- Energy is `role="meter"` with `aria-valuenow` kept in sync.
- The hint bubble is `role="status"`, so refusals and the completion line are announced.
- The clock text is not a live region (it would chatter every 4s).
- Contrast: `--ink` on `--card` 10.4:1, `--ink-2` 6.2:1, `--ink-3` 4.8:1, `--water` on `--paper` 5.5:1; `--paper` on `--ink` tag 11.1:1. Slot key numbers use `--ink-2`, because `--ink-3` falls to 4.5:1 on the slot face.

## Responsive rules

- ≥ 1280: as drawn. The scene uses `xMidYMax slice`, so wider screens add sky and side field, not stretch.
- 1024 to 1279: unchanged; the note's 300px width and the 640px hotbar still fit.
- 820 and below: the page may scroll vertically (min-height 844px). The scene shrinks to 640px tall and anchors right (`xMaxYMax slice`, set from JS on a media query) so the beds stay in view. The day card and energy pill sit at 12px insets; the note shrinks to its heading and first task at 1° tilt; the hotbar wraps into two rows of five with slots `calc((100vw - 64px) / 5)`, max 60px.

## Acceptance checklist

**Always**
- [ ] Every HUD card has a 22px radius, a two-part shadow and a 2px dashed stitch 6px inside.
- [ ] The scene is all SVG with one displacement filter on the land; interactive objects stay unfiltered.
- [ ] One hotbar slot is always selected, raised 8px with a spring curve; number keys select slots.
- [ ] The tool tag above the hotbar reflects the selected tool and its resource.
- [ ] Using the right tool on a valid target changes the world, the resource, energy and the quest count together.
- [ ] Every refusal explains itself in a hint bubble that is a live region.
- [ ] The note is ruled at 30px, tilted, pinned, and torn along the bottom with a polygon clip.
- [ ] Ambient loops are slow (5s and 60s) and stop under reduced motion.
- [ ] At 390 wide nothing scrolls sideways and the beds remain visible above the hotbar.

**This demo**
- [ ] Spring 14, Thursday, 2:40 pm; Clear, 19°; 1,286 g.
- [ ] Energy 72 / 120, water 18 / 40, beds 5 of 8 watered, 24 seeds, 5 apples.
- [ ] Note reads "Granny Odile's list" with the reward "rhubarb pie and 120 g".
- [ ] Baloo 2 is the only family.

## Implementation notes

**The stitch.** A pseudo-element 6px inside, radius 6px smaller, so the dash follows the corner:

```css
.card{background:var(--card);border-radius:var(--r);position:relative;
  box-shadow:0 2px 0 #d9c29a,0 10px 24px rgba(94,60,36,.18)}
.card::after{content:"";position:absolute;inset:6px;border:2px dashed var(--stitch);
  border-radius:calc(var(--r) - 6px);pointer-events:none}
```

**Painterly edges without images.** Displace the land with noise, and draw shapes past the viewBox so the wobble never pulls transparent pixels in at the frame edge. Give the filter a generous region, or soft shapes get a flat cut:

```html
<filter id="rough" x="-20%" y="-60%" width="140%" height="220%">
  <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4"/>
  <feDisplacementMap in="SourceGraphic" scale="7"/>
</filter>
<path d="M-40 452C200 400 … 1320 425V860H-40z" fill="#9cb67a" filter="url(#rough)"/>
```

**CSS transforms overwrite SVG transform attributes.** Put the position on an outer `<g transform>` and the animation on an inner `<g class="sway">` with `transform-box: fill-box; transform-origin: 50% 100%`, or the sprig jumps to the origin.

**The sun's arc.** Map 6 am to 8 pm onto π to 0 and place the dot on a 28px radius around the dial's horizon point (40, 46):

```js
const a = Math.PI * (1 - (mins - 360) / 840);
dot.setAttribute('cx', 40 + 28 * Math.cos(a));
dot.setAttribute('cy', 46 - 28 * Math.sin(a));
```

Common mistakes: an SVG without width and height inside `inset:0` (it renders at 300 by 150); filtering the clickable beds (hit areas wobble); a clock live region that speaks every tick.
