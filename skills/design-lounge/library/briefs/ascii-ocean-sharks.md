<!-- Design Lounge Nº 605 · "ASCII ocean with sharks" · www.designlounge.live -->

# ASCII ocean with sharks

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A full-viewport hero background for "Driftline", an invented service that plots acoustically tagged sharks on a live map. The whole ocean is one `<canvas>` drawn as a grid of monospace cells: depth reads as five stepped colour bands plus character density, caustic `~` and `*` flicker in the top 20%, slow light shafts fall diagonally, marine snow drifts down, kelp sways on a sand floor. Three sharks and a school of 60 two-character fish swim through it with smooth steering. It follows the 2026 trend of ASCII sea creatures rendered live on canvas, but every shape here is built from geometry each frame, not pasted art: a shark is a spine of samples with a thickness profile, three triangles for fins and two for the tail lobes, and a neighbour rule turns the filled cells into `/ \ - _ ( )` outlines and `# = :` countershading. The detail worth copying is that rule: rasterise a silhouette into cells, then pick each cell's glyph from which of its four neighbours are empty, so any shape gets a hand-drawn ASCII edge for free.

## Structure

```
1280 × 800   canvas fixed inset 0, z 0, cell 8.4 × 18px (14px mono)
┌──────────────────────────────────────────────────────────────────────────┐
│ ^ Driftline  Receivers  Field notes  Pricing     [Deep sea|Reef|Night] [II]│ 22px pad
│ ~  *  ~~   caustics, top 20%   ~ *     ~~  *    <> {> <>  school   ~      │ band 0
│        KC-12 Oyster 18m                     {> <> {> <>                   │
│   /###\___======(((==o_\                                                  │ band 1
│                                      KC-07 Marlowe 32m                    │
├─48──────────────────────────────┐         /####\                           │ band 2
│ • LIVE FROM 214 RECEIVERS, ...  │  /----######----------\      /###_/      │
│ Every tagged                    │ /==o===)))=================######_/      │
│ shark, plotted live.  80px      │ \____::::::::____________/   \__::==     │ band 3
│ sub 15px, 50ch                  │      \_____::         \_-\    \\         │
│ [Open the live map ->] 1,286 .. │                         o    kelp  (()   │ band 4
└─ plate 620 wide, 48 from left/bottom ┘  sand ._.:._.:._   Move the pointer… │
└──────────────────────────────────────────────────────────────────────────┘
```

- `<canvas id="sea" aria-hidden="true">` fixed, 100% × 100%, backing store `innerWidth × innerHeight × min(devicePixelRatio, 2)`.
- `<header class="top">`: `<a class="brand">` (24px fin-over-wave SVG + wordmark), `<nav aria-label="Main">` with 3 links, `.ctl` with `<div role="group" aria-label="Water palette">` of 3 `<button aria-pressed>` and the pause `<button aria-pressed aria-label>`.
- `<main class="plate">`: `<p class="eyebrow">` with a pulsing 7px dot, `<h1>` with one `<em>`, `<p class="sub">`, `.row` of `<a class="cta">` and `<span class="stat">`.
- `<p class="hint">` fixed bottom right: "Move the pointer: the school parts".
- Every UI element carries `data-calm`: the canvas writes no glyph into cells under it (1 cell of padding left and right), so text always sits on a flat band colour.

## Motion

| Thing | Trigger | What moves | Numbers | Reduced motion |
|---|---|---|---|---|
| Loop | load, Play | whole canvas | ≤ 30fps, dt capped at 50ms | one still frame |
| Shark steering | always | velocity toward target | near 60px/s, far 40px/s (× scale), blend 0.9/s, vertical pull 0.35× | still |
| Shark turn | velocity sign flips (abs vx > 6) | facing f → ±1, length 30% to 100% | blend 1.6/s | still |
| Tail beat | always | spine sway, lobes, pectoral | phase rate 2.4 + 1.8 × speed ratio (× 0.8 far) rad/s | phase frozen |
| Pointer follow | pointer within 380px | nearest shark's target | 2.6s at 1.5× speed, 6s cooldown | off |
| School | always | 60 boids | speed 35 to 115px/s, flee radius 140px | pre-settled still |
| Caustics | always | top 20% glyphs | phase rates 0.6 to 1.1 rad/s | frozen |
| Light shafts | always | diagonal intensity | 0.12 rad/s drift | frozen |
| Marine snow | always | sparse `.` | falls 0.8 rows/s | frozen |
| Kelp | always | stalk offset | 0.7 rad/s, amplitude 0.09 cells per row of height | frozen |
| Bubbles | timers | rise, wobble, grow | 24 to 54px/s, ±18px/s, `.` `o` `O` at 1.4s / 3.5s | none |
| Eyebrow dot | always | opacity 1 → 0.35 → 1 | 2400ms, `--ease`, infinite | static |
| Button hover | hover | background, arrow x | 160ms `--ease`, arrow +3px | same |

## States

- **Segment buttons:** rest `--ink-2` on `--ctl`; hover text `--ink`; selected (`aria-pressed="true"`) `--ink` fill with `--ctl` text. The group has a 1px `--ctl-line` border and 2px inner padding.
- **Pause button:** 38 × 38, 1px `--ctl-line` border, `--ink` icon; hover inverts to `--ink` fill. Pressed state shows the play triangle and `aria-label="Play the ocean"`; otherwise pause bars and "Pause the ocean".
- **CTA:** accent fill, 48px; hover `--ink` fill and the arrow slides 3px; active `translateY(1px)`.
- **Nav links:** hover adds a 1px underline in `currentColor` (160ms).
- **Focus-visible:** 2px solid `--accent` outline, 3px offset, on every link and button.
- **Paused:** the canvas holds the exact last frame; palette changes still redraw it.
- **Shark curious:** no visual badge; it simply swims at 1.5× toward the pointer and its label keeps updating depth.

## Accessibility

- Canvas is `aria-hidden="true"`; all meaning lives in the DOM.
- Palette buttons sit in `role="group"` with `aria-label="Water palette"`, each with `aria-pressed`. The pause button toggles `aria-pressed` and its `aria-label`.
- Tab order: brand, three nav links, Deep sea, Reef, Night, pause, CTA.
- Contrast: the canvas never paints a glyph under `data-calm` elements, so nav text sits on band 0 (`#e8f1f3` on `#0f3b52` is 10.4:1; reef `#f2fbfa` on `#137485` 5.2:1). Plate text sits on a 92% opaque plate. Control borders are ≥ 3:1 on band 0 in all three palettes.
- Pointer play is decoration; nothing requires it. Reduced motion gets a still frame and starts paused.
- Hit targets: CTA 48px tall, pause 38px, segment buttons 32px inside a 38px group.

## Responsive rules

- **≥ 1280:** as described; shark length scale is `clamp(W / 1280, 0.5, 1.1)` columns.
- **1024:** same layout; headline scales by `6.2vw` (63px).
- **≤ 900:** nav links hide.
- **< 640 (checked at 390 × 844):** `--pad` 16px; cell font 12px, cell height 15px; controls drop to a second header row; the plate spans the width minus 16px each side with 22px 20px padding; ", Kestrel Coast" and the hint hide; 26 fish; odd kelp strands are skipped; the sharks' water ends at the plate top. Leave slack: on Linux the mono measures a little wider, so the cell width is always `measureText("M").width`, never a constant, and no UI row is sized to fill 390 exactly.
- Resize rebuilds the grid (debounced 120ms) and remeasures the calm cells.

## Acceptance checklist

**Always**
- [ ] One canvas, one `requestAnimationFrame` loop capped at 30fps; it is cancelled on `visibilitychange` when hidden and on Pause.
- [ ] Cell width comes from `measureText`, cell height is `round(fontSize × 1.25)`, and the grid is `ceil(W / cw) + 1` by `ceil(H / ch) + 1`.
- [ ] Depth shows as 5 stepped background bands plus 4 glyph colours, denser and brighter toward the surface.
- [ ] Sharks are rasterised from a spine, a thickness profile and 4 triangles every frame; the edge glyphs come from the neighbour rule.
- [ ] A shark that reverses foreshortens to 30% length before flipping.
- [ ] The school opens around the pointer within 140px; one shark follows the pointer for 2.6s, then waits 6s.
- [ ] No glyph is painted under any `data-calm` element; all DOM text passes 4.5:1.
- [ ] Reduced motion draws one composed frame and the toggle starts as Play.
- [ ] Palette switch updates canvas and page tokens together and redraws while paused.
- [ ] No horizontal scroll at 390 wide; the controls wrap to a second row.

**This demo**
- [ ] Brand "Driftline"; headline "Every tagged shark, plotted live." with "plotted live." in the accent.
- [ ] Sharks "KC-07 Marlowe" (44 cols) and "KC-12 Oyster" (30 cols) carry depth labels; a 25-column far shark carries none.
- [ ] Palettes are named Deep sea, Reef and Night with the hexes above.
- [ ] Stat reads "1,286 pings in the last hour"; eyebrow "Live from 214 receivers, Kestrel Coast".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state at 1280 × 800 (deep sea palette): nav at the top (brand, three links, palette switch, pause button); a solid plate at the bottom left holding eyebrow, a 80px serif headline, sub-copy, one button and a stat; the ocean fills everything behind.
2. The large shark "KC-07 Marlowe" (44 columns long) swims in open water right of the plate, a mid shark "KC-12 Oyster" (30 columns) near the top left, a far shark (25 columns, colours mixed 50% toward the water) at the lower right. The two tagged sharks carry a one-row amber label above the dorsal fin: tag, name, depth in metres (`KC-07 Marlowe 32m`). The label hides when the shark is side-on less than 75% (mid-turn) or when any of its cells would land under UI.
3. Sharks steer toward a wander target picked inside the water (x 6% to 94%, y from 22% of the height to the plate top or 86%), at 60px/s (near) and 40px/s (far), turning with a 0.9/s blend; each re-picks when within 70px of its target. They avoid the plate by a 70px margin.
4. When a shark turns round it foreshortens: its length scales from 100% down to 30% as it passes side-on, then flips and grows back, which reads as a turn in depth. Pitch is limited to ±0.16 rad so the body never stair-steps.
5. Tail beat: the body sways by 4.5% of its length times u² along the spine (u = 0 nose, 1 tail) with phase `ph − 4.2u`; the tail lobes swing in step; the pectoral fin flexes at half the rate; the dorsal apex breathes ±5%.
6. Fish: 60 boids (26 below 640px) with separation, alignment, cohesion and a slow lissajous goal in the upper water. Each fish is a head glyph (`>` or `<`) and a tail glyph that beats between `<`/`{` (right-facing) or `>`/`}` (left-facing).
7. Pointer: moving it makes fish within 140px flee, so the school opens a hole around the cursor; the nearest shark within 380px (not on cooldown) turns to follow the pointer at 1.5× speed for 2.6s, then loses interest for 6s. Only one shark follows at a time. The pointer counts as present for 1.6s after its last move.
8. Bubbles: each shark releases 3 bubbles from its gills every 2 to 5s; a vent at 80% width releases one every 0.5 to 1.1s. Bubbles rise at 24 to 54px/s, wobble ±18px/s and grow `.` → `o` → `O` at 1.4s and 3.5s; they vanish at the surface.
9. Palette switch (Deep sea / Reef / Night) swaps every canvas colour and the page tokens at once. Pause stops the loop and leaves the current frame; Play resumes from the same state.
10. The loop runs at most 30 frames a second, stops while the tab is hidden and restarts on return.
11. Under `prefers-reduced-motion: reduce` one composed still is drawn (school pre-settled for 1.5s of simulated time, sharks in their set poses), and the button starts as Play.

## Tokens

```css
:root {
  /* type */
  --mono: "JetBrains Mono", ui-monospace, Menlo, monospace;
  --serif: "Instrument Serif", Georgia, serif;
  --fs-display: clamp(44px, 6.2vw, 80px);
  --fs-body: 16px;
  --fs-sub: 15px;
  --fs-label: 12px;
  --fs-cell: 14px;              /* canvas cell font; 12px below 640 */
  --cell-h: 18px;               /* round(fs * 1.25); 15px below 640 */

  /* deep sea (default) page colours */
  --band-0: #0f3b52;            /* surface band, nav ground */
  --band-4: #061622;            /* deepest band, hint ground */
  --plate: rgba(5, 18, 28, .92);/* headline plate */
  --plate-line: #2b5468;
  --ctl: #071a26;               /* control fill */
  --ctl-line: #7fa6b8;          /* control border, >= 3:1 on band 0 */
  --ink: #e8f1f3;
  --ink-2: #a3bac3;
  --accent: #f2b45c;            /* button, em, tags, focus */
  --accent-ink: #1d1204;

  /* deep sea canvas colours */
  --sea-band: #0f3b52 #0c3146 #0a2739 #081e2d #061622;   /* 5 steps, top to bottom */
  --sea-water: #1d4d63 #2c6982 #4b90a9 #91cddd;          /* density glyphs, dim to bright */
  --sea-caustic: #d6f2f5;
  --sea-bubble: #a3d8e4;
  --shark-dorsal: #86a3b1;
  --shark-flank: #b3c7cf;
  --shark-belly: #e1ebee;
  --shark-eye: #f6fafb;
  --fish-tail: #8fb0bd;
  --fish-head: #e4eef1;
  --kelp: #3b8170;
  --sand: #4f6d75;
  --tag: #f2b45c;

  /* layout */
  --pad: 48px;                  /* 16px below 640 */
  --plate-w: 620px;
  --plate-pad: 28px 32px 30px;
  --r: 4px;
  --ctl-h: 32px;                /* segment buttons; pause 38 x 38 */
  --cta-h: 48px;

  /* motion */
  --t-micro: 160ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --frame: 32ms;                /* 30fps cap */
  --ping: 2400ms;               /* eyebrow dot pulse */
}
[data-theme="reef"] {
  --band-0: #137485; --band-4: #0b3e50; --plate: rgba(8, 44, 56, .92); --plate-line: #3d7f8f;
  --ctl: #082c38; --ctl-line: #d3eef0; --ink: #f2fbfa; --ink-2: #b2d3d6; --accent: #ff9a6b; --accent-ink: #2a0e04;
  --sea-band: #137485 #11677a #0f596c #0d4b5e #0b3e50; --sea-water: #2a8797 #47a4b1 #7cc8cf #d2f3f0;
  --sea-caustic: #f5fffd; --sea-bubble: #c6eef0; --shark-dorsal: #4c6670; --shark-flank: #7c97a0;
  --shark-belly: #c9d8dc; --shark-eye: #fdfdf8; --fish-tail: #ffb547; --fish-head: #ffe2a8;
  --kelp: #43a066; --sand: #cdbd8e; --tag: #ffd08a;
}
[data-theme="night"] {
  --band-0: #0d1828; --band-4: #04080e; --plate: rgba(4, 8, 14, .92); --plate-line: #22324a;
  --ctl: #060c16; --ctl-line: #6b86a6; --ink: #e6edf7; --ink-2: #9aa9c0; --accent: #7cf3d8; --accent-ink: #03120f;
  --sea-band: #0d1828 #0a1321 #080f1a #060b14 #04080e; --sea-water: #14263c #1d3753 #2c5777 #62abc6;
  --sea-caustic: #9cc3e6; --sea-bubble: #6fe0cf; --shark-dorsal: #3d536f; --shark-flank: #5d7797;
  --shark-belly: #9fb5cf; --shark-eye: #7cf3d8; --fish-tail: #46d6bb; --fish-head: #b8fff0;
  --kelp: #1f4d4c; --sand: #283850; --tag: #7cf3d8;
}
```

The `--sea-*` lists are read by the canvas code (mirror them in a JS object); far sharks use the three shark tones mixed 50% toward band 2.

## Typography

| Role | Family | Size | Weight | Line height | Tracking | Case |
|---|---|---|---|---|---|---|
| Headline | Instrument Serif | clamp(44px, 6.2vw, 80px) | 400, `em` italic in accent | 0.96 | −0.012em | sentence, `text-wrap: balance` |
| Brand | JetBrains Mono | 16px | 700 | 1 | −0.01em | title |
| Nav links | JetBrains Mono | 14px | 400 | 1.55 | 0 | title |
| Eyebrow | JetBrains Mono | 12px | 500 | 1.5 | 0.14em | uppercase |
| Sub-copy | JetBrains Mono | 15px (14px < 640) | 400 | 1.55 | 0 | sentence, max 50ch |
| Button | JetBrains Mono | 14px | 700 | 1 | 0 | sentence |
| Controls, stat, hint | JetBrains Mono | 12px | 500 / 400 | 1 / 1.55 | 0 | sentence |
| Canvas cells | JetBrains Mono | 14px (12px < 640) | 400 | cell 18px (15px) | 0 | glyphs |

Ligatures off everywhere (`font-variant-ligatures: none`, and `ctx.textRendering = "optimizeSpeed"` on the canvas) so `<>`, `=>` and `--` never merge.

## Implementation notes

**1. Draw the grid with few calls.** Fill two byte arrays per frame (glyph code, colour index). Then, row by row, copy each colour's glyphs into a space-filled row buffer and draw one string per colour per row. That is about 20 colours × 50 rows of `fillText`, not 8,000.

```js
for (let r = 0; r < rows; r++) {
  const o = r * cols; lo.fill(1e9); hi.fill(-1);
  for (let c = 0; c < cols; c++) {
    const k = col[o + c]; if (!k) continue;
    bufs[k][c] = chr[o + c]; if (c < lo[k]) lo[k] = c; hi[k] = c;
  }
  for (let k = 1; k < COLORS.length; k++) if (hi[k] >= 0) {
    ctx.fillStyle = COLORS[k];
    ctx.fillText(String.fromCharCode.apply(null, bufs[k].subarray(lo[k], hi[k] + 1)), lo[k] * cw, r * ch + ch / 2);
    bufs[k].fill(32, lo[k], hi[k] + 1);   // back to spaces
  }
}
```

Spaces keep the columns aligned because the font is monospace and `cw` was measured from it. Common mistake: hard-coding `cw = 0.6 × fontSize`; on Linux the glyphs drift off the grid.

**2. The shark body.** Sample the spine from nose (u = 0) to tail (u = 1) every 0.4 cell. Facing `f` in [−1, 1] sets direction and foreshortening; the sway grows with u².

```js
const sg = f >= 0 ? 1 : -1, k = .3 + .7 * Math.abs(f), Lp = L * cw;
const bx = -sg * k * Math.cos(pitch), by = -Math.sin(pitch), Hm = .22 * Lp;
const X = u => x + bx * Lp * u;
const Y = u => y + by * Lp * u + .045 * Lp * u * u * Math.sin(ph - u * 4.2);
const hh = u => Hm * (u < .22 ? .35 + .65 * Math.sin(u / .22 * Math.PI / 2)
             : u < .86 ? 1 - .8 * ((u - .22) / .64) ** 1.3 : .2 - .4 * (u - .86));
// body cells: rows whose centre lies in [Y(u) - .55 hh, Y(u) + .45 hh]; v = signed height for shading
// dorsal: tri(top(.29), top(.52), apex at X(.5), .12 Lp above the back)
// pectoral: tri(bot(.19), bot(.33), tip at X(.44), .13 Lp below)
// tail lobes: from top(.8) / bot(.84) to tips .24 Lp up / .13 Lp down, swung by sin(ph - 4.2)
```

**3. The neighbour rule.** After filling a local grid with region codes (1 body, 2 fins, 3 tail), pick each glyph from its empty neighbours: up+left `/`, up+right `\`, down+left `\`, down+right `/`, up and down `-`, up only `-`, down only `_`, the leading column of the body `)` or `(`. Interior body cells shade by height: `#` above 0.4 (dorsal tone), `=` above −0.2 (flank), `:` below (pale belly). Then stamp the eye `o` at u = 0.075 and three gill slits at u = 0.18, 0.205, 0.23. Common mistake: letting fins overwrite body cells; write fins only into empty cells so the countershading stays intact.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
