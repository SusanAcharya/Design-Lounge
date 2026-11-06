<!-- Design Lounge Nº 669 · "Kids colouring canvas" · www.designlounge.live -->

# Kids colouring canvas

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The colouring screen of a fictional kids app, "Doodle Den", for ages 4 to 8. A white sheet of paper lies on a green felt table; on it, an original line drawing ("Snail day": a snail with an orange shell, a five-petal flower, a cloud, the sun and rolling ground). Below it, four big tool buttons (Fill, Brush, Stickers, Save) and a wooden tray of eleven chunky crayons; the chosen crayon stands up 22px taller. Fill mode needs one tap anywhere inside a shape, and the colour spreads out from the finger as a growing circle clipped to the shape. Brush mode draws a 10-unit waxy crayon line. Stickers stamp in with a spring. Save shrinks the picture into the gallery button and the badge counts up. The detail worth copying: the outlines stay on top of everything and still hide correctly behind shapes in front of them, because every outline is masked by the shapes drawn above it.

No precise gestures anywhere: the smallest region (the leaf) is 40 × 16 units and the rest are 28 units or larger, there is no eyedropper, no zoom, no long press. Language: iOS 26-ish (64px round buttons, 20–24px radii, spring lifts), skinned as a physical desk.

## Structure

```
390 × 844, felt #2E5E4E, column padding 54 / 16 / 34
┌──────────────────────────────────────┐
│ 54px clear                           │
│ (⌂) [  Snail day  ] (↶) (▣²)         │ header 64: round 64, title pill 52h
│ ┌──────────────────────────────────┐ │
│ │ cloud            ☀               │ │ paper 358 × 440, radius 24
│ │        ~~ scribble ~~            │ │ viewBox 0 0 300 369, stretched
│ │  flower     (  shell  )  snail   │ │ layers: fills svg, canvas, lines svg,
│ │ ~~~~~~~~ ground ~~~~~~ ladybird  │ │ stickers svg
│ └──────────────────────────────────┘ │
│ [Fill] [Brush] [Stickers] [ Save ]   │ 4 × 82 × 68, gap 8
│                                      │
│  ▮  ▮  ▮  █  ▮  ▮  →scroll           │ tray: crayons 64 × 112 (art 40 × 104)
│▓▓▓▓▓▓▓▓▓▓ wooden shelf 86h ▓▓▓▓▓▓▓▓▓▓│ selected lifts −12px, others +10px
└──────────────────────────────────────┘
Gallery sheet: fixed bottom, 390 × 430, radius 28 top, 3-col thumbs gap 12
```

- `header`: Home, `div.title`, Undo, `button#galBtn[aria-haspopup=dialog]` with a `span.badge`.
- `div.paper`: `svg#fills` (one `use` per region, `data-r`), `canvas#ink`, `svg#lines` (masked outlines and loose lines, `pointer-events:none`), `svg#stk` (stickers, hint ring, `pointer-events:none`).
- `div.modes[role=group]`: three `button.mode[aria-pressed]` and `button.save`.
- `div.tray#crayons[role=group]` of `button.cray[aria-pressed]` (labels "Red" … "Black"), horizontally scrollable; `div.tray#stamps` of `button.stamp`, `hidden` unless Stickers.
- `div.toast[role=status]`, `div.scrim`, `section.sheet[role=dialog][aria-modal]` with `div.thumbs`.
- One polite live region for "Undone", "heart sticker added", "Saved to your gallery".

## Motion

| What | Trigger | Property | From → to | Duration / easing | Reduced motion |
|---|---|---|---|---|---|
| Fill spread | tap region | clip circle `r` | 0 → farthest corner | 420ms cubic out (rAF) | instant fill |
| Crayon lift | choose | translateY | +10px → −12px | 320ms `--spring` | instant |
| Sticker stamp | tap paper | scale, rotate, opacity | 1.6 / −12° / 0 → 1 / 0 / 1 | 460ms `--spring` | appears |
| Hint ring | load | scale, opacity | .7 / .9 → 1.5 / 0 | 1.4s loop until first touch | static |
| Save flight | Save | transform, radius, opacity | paper rect → 44px at gallery | 700ms `--expo`, fade at 700ms | skipped, badge updates |
| Badge pop | after save | scale | .5 → 1 | 520ms `--spring` | none |
| Toast | after save | translateY, opacity | −12px / 0 → 0 / 1 | 320ms `--spring`, 1600ms hold | fade |
| Gallery sheet | gallery | translateY | 104% → 0 | 420ms `--sheet` | opacity 200ms |
| Button press | active | scale | 1 → .92 | 160ms `--spring` | none |

## States

- **Tool idle:** felt-2 fill, 2px `--tool-edge` inset, cream text.
- **Tool selected:** plate fill, ink text, 3px `--sel` inset.
- **Save:** sun-yellow fill, ink text, lip shadow.
- **Crayon selected:** lifted 22px above its neighbours with a 6px drop shadow; `aria-pressed=true`.
- **Sticker selected:** plate tile behind it, lifted 8px.
- **Undo disabled:** `--disabled` fill, `#4F5A55` icon.
- **Brush mode:** canvas receives pointer events; fills ignore them.
- **Focus-visible:** 4px `--sel` outline, 3px offset.

## Accessibility

- The paper has a label ("Colouring picture of a snail in a garden"); the tools, crayons and stickers are real buttons with names and `aria-pressed`.
- Tab order: Home, Undo, Gallery, tools, crayons, stickers. The regions are not focusable; colouring is pointer-first. Ctrl/Cmd+Z undoes; Escape closes the gallery.
- Speech says colour and tool names on tap, wrapped in `try/catch`, silent if unsupported. The live region covers the same events for screen readers.
- The gallery is `role=dialog` with focus on Close; focus returns to the gallery button.
- Contrast: cream on felt-2 8.7:1; ink on sun-yellow 9.5:1; white on the badge 5.6:1; the toast is ink on a solid plate.
- Hit targets: header 64px, tools 82 × 68, crayons 64 × 112, stickers 76 × 96, regions 28 units (≈ 33px) or larger except the 40 × 16 leaf.

## Responsive rules

- At 360 wide: paper 328 × 404 (viewBox unchanged, pointer maths uses the live rect), tools shrink to 74px wide, the crayon tray scrolls a little further.
- Taller than 844: the paper grows to keep 0.81 aspect up to 520px tall; the tray stays at the bottom.
- At tablet width: paper becomes 560 × 690 centred, tools sit in a vertical column on the left, the tray runs along the bottom with all eleven crayons visible.

## Acceptance checklist

### Always

- [ ] Each region fills with one tap anywhere inside it; no precise gesture is needed anywhere.
- [ ] The fill spreads from the tap point as a clipped circle and uses the colour picked at tap time.
- [ ] Outlines sit above fills, brush and paper, and each outline is masked by the regions in front of it.
- [ ] Brush strokes are stored as point lists so undo can redraw the canvas.
- [ ] Undo covers fills, strokes and stickers in one history; disabled when empty.
- [ ] Save snapshots SVG and canvas into an in-memory gallery and counts the badge up.
- [ ] Crayon and tool names are spoken on tap through a guarded `speechSynthesis` call.
- [ ] Every control is 64px or more on its short side; the crayon tray scrolls inside the column.
- [ ] Closed gallery sheet and toast are `visibility:hidden`; `document.documentElement.scrollWidth` is 390.
- [ ] Reduced motion: fills are instant, no flight, no stamp spin, no hint pulse.

### This demo

- [ ] Picture "Snail day": sky, ground, sun, cloud, leaf, five petals, flower centre, snail body, shell.
- [ ] Eleven crayons Red to Black, Green chosen; stickers star, heart, ladybird, flower.
- [ ] First frame has a blue scribble, a ladybird and badge "2".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: sky filled `#CFE9F7`, sun `#FFC531`, shell `#F28C38`, two petals pink `#F36C9B`; everything else white. A blue zig-zag crayon scribble sits mid-sky and a ladybird sticker on the ground. Fill is selected (plate fill, 3px sun-yellow inset ring). Green is the chosen crayon. A pulsing ring (26-unit circle, 1.4s) sits on the empty ground as the only hint. Gallery badge "2". Undo is disabled.
2. Fill mode, tap inside a region: a copy of the region in the new colour is clipped by a circle centred on the tap point whose radius grows from 0 to the distance to the region's farthest bounding-box corner over 420ms (cubic out). Then the base region takes the colour and the copy is removed. Tapping a region that already has that colour does nothing. The hint ring hides on the first touch.
3. The colour used is the one chosen at the moment of the tap, even if the child picks another crayon mid-animation.
4. Brush mode: the canvas takes pointer events. Pointer down starts a stroke (a dot if the finger does not move), moves add points 1.5+ units apart, line width 10 units, round caps and joins. The canvas has the wax filter so strokes look like crayon on paper.
5. Stickers mode: the tray swaps to four 76 × 96 sticker buttons (star, heart, ladybird, flower). A tap on the paper stamps the chosen sticker centred on the tap, entering from scale 1.6 and −12° to rest (460ms spring).
6. Undo pops the last action of any kind: a fill returns its region to the previous colour, a stroke is removed and the canvas is redrawn from the stroke list, a sticker is removed. Ctrl/Cmd+Z also undoes. Undo is disabled when the history is empty.
7. Tapping a crayon lifts it (320ms spring) and says its name ("Green", "Sky") with `speechSynthesis`; tapping a tool says the tool's name.
8. Save: a snapshot (cloned SVG layers plus a copy of the canvas) is taken; a copy of the paper flies from its place to the gallery button, scaling to 44px and rounding off (700ms expo out), then fades. The badge counts up with a 520ms spring pop, a "Saved to your gallery" pill drops in under the header for 1600ms, and the device says "Saved".
9. Gallery button: a 430px bottom sheet "My pictures" with a 3-column grid of thumbnails, newest first (the new one pops in). Two earlier pictures are seeded with different sky, ground and shell colours. Close, the scrim or Escape closes it.

## Tokens

```css
:root {
  /* desk */
  --felt: #2E5E4E;        /* page */
  --felt-2: #244C3F;      /* title pill, idle tool buttons */
  --tool-edge: #5E8A7B;   /* 2px inset edge on idle tools */
  --tray: #C98E55;        /* wooden shelf */
  --tray-d: #9E6B3B;      /* shelf lip */
  --paper: #FFFFFF;
  --plate: #F7F3EA;       /* round buttons, selected tool, sheet */
  --disabled: #DCD6C8;    /* undo disabled fill, icon #4F5A55 */
  /* ink */
  --line: #22302B;        /* outlines, sticker strokes */
  --ink: #22302B;
  --ink-2: #4A5751;
  --sel: #FFD23F;         /* selected ring, Save, focus */
  --badge: #C0341C;       /* white text 5.6:1 */
  /* crayons */
  --c-red: #E2452A; --c-orange: #F28C38; --c-yellow: #FFC531; --c-green: #4CB05E; --c-leaf: #2F7D4A;
  --c-sky: #8FD0F2; --c-blue: #3466D1; --c-violet: #8E62D9; --c-pink: #F36C9B; --c-brown: #8A5A3B; --c-black: #22302B;
  /* type */
  --slab: "Zilla Slab", Rockwell, serif;
  --fs-title: 22px; --fs-sheet: 30px; --fs-tool: 15px; --fs-toast: 18px; --fs-badge: 14px;
  /* shape */
  --r-paper: 24px; --r-btn: 20px; --r-thumb: 14px; --r-sheet: 28px; --r-pill: 999px;
  --hit: 64px; --crayon-w: 64px; --stamp-w: 76px;
  --outline: 3.4;          /* viewBox units */
  --brush: 10;             /* viewBox units */
  --paper-sh: 0 14px 30px rgba(10,24,19,.35);
  --lip: 0 4px 0 rgba(10,24,19,.25);
  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --spring: cubic-bezier(.34,1.56,.64,1);
  --sheet: cubic-bezier(.32,.72,0,1);
  --t-micro: 160ms; --t-layout: 320ms; --t-fill: 420ms; --t-save: 700ms;
}
```

## Typography

One slab family; its sturdy, low-contrast letters read like a picture-book label.

| Role | Size | Weight | Line-height | Notes |
|---|---|---|---|---|
| Picture title | 22px | 700 | 1 | on the felt-2 pill, `#F7F3EA` (8.7:1) |
| Tool labels | 15px | 700 | 1 | under a 26px icon |
| Toast | 18px | 700 | 1 | nowrap |
| Sheet title | 30px | 700 | 1 | |
| Badge | 14px | 700 | 26px | tabular |

Keep words to one per control; the picture and colours carry the screen.

## Implementation notes

**Spread the fill from the finger.** Draw a second copy of the region on top, clipped by a circle that grows, then commit:

```js
const cp = el('clipPath', { id: 'cp' + Date.now() }, fills);
const c = el('circle', { cx: x, cy: y, r: 0 }, cp);
const top = el('use', { href: '#r-' + id, fill: c0, 'clip-path': `url(#${cp.id})` }, fills);
const b = use.getBBox();
const R = Math.max(...[[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]]
  .map(([px, py]) => Math.hypot(x - px, y - py)));
let t0 = 0;
requestAnimationFrame(function step(ts) {
  t0 = t0 || ts; const k = Math.min(1, (ts - t0) / 420);
  c.setAttribute('r', R * (1 - Math.pow(1 - k, 3)));
  if (k < 1) requestAnimationFrame(step); else { use.setAttribute('fill', c0); top.remove(); cp.remove(); }
});
```

**Mask each outline by what is in front of it.** The line layer has to sit above the brush canvas, so it cannot rely on paint order. Give each region's outline a mask: white everywhere, black where later regions are:

```js
IDS.forEach((id, i) => {
  if (!i) return;                                   // the sky has no outline
  const m = el('mask', { id: 'm-' + id, maskUnits: 'userSpaceOnUse', x: -20, y: -20, width: 340, height: 409 }, defs);
  el('rect', { x: -20, y: -20, width: 340, height: 409, fill: '#fff' }, m);
  IDS.slice(i + 1).forEach(j => el('use', { href: '#r-' + j, fill: '#000' }, m));
  el('use', { href: '#r-' + id, mask: `url(#m-${id})` }, lines);
});
```

Watch for a broad `.lines * { fill:none }` rule: it also reaches the mask's rect and hides every outline. Scope the mask contents explicitly.

**Size the canvas to the paper, draw in viewBox units.** Set `canvas.width = rect.width * devicePixelRatio`, then `ctx.setTransform(cv.width / 300, 0, 0, cv.height / 369, 0, 0)` so strokes, hit points and the SVG share one coordinate system. Common mistakes: a real flood fill on pixels (slow, leaks through gaps in the line art), reading `col` when the fill animation ends instead of when it starts, and leaving a closed sheet only translated off-screen.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
