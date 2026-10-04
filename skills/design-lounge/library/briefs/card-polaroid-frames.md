<!-- Design Lounge Nº 361 · "Polaroid frames, three ways" · designlounge.vercel.app -->

# Polaroid frames, three ways

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

A contact sheet with one instant-photo frame shown three ways, side by side on a dotted off-white board. A: a black-bordered frame with a solid 10px hard shadow that always falls away from the cursor, as if the pointer were the lamp. B: a softer frame held up by a strip of tomato washi tape, with a yellow sticky note slapped on its corner that you click to peel up, showing a date written underneath. C: a print still developing. It starts milky and blurred at 35%, and you drag it side to side to shake it. As you shake, the haze lifts and the colour comes back, and at 100% the caption writes itself on in marker. Each frame is a 300px card with 16px borders and a 68px marker caption strip. The detail worth copying is that the three treatments share one frame component and differ only in a modifier class.

## Structure

```
1280 × 800, body padding 36px 48px 40px, dotted board (22px grid of 1px dots)
CONTACT SHEET 03 — POLAROID FRAMES          Three treatments for one 300px frame. Move, peel, shake.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 2px rule
     ┌───────────┐▌        ▒▒tape▒▒         ┌───────────┐
     │  desert   │▌      ┌───────────┐      │  milky    │
     │  road     │▌      │ lake +    │      │  tomato   │
     │  268×268  │▌      │ red coat  │      │  vines    │
     │           │▌      │       ┌────────┐ │           │
     │Route 9,   │▌      │Juno at│ sticky │ │ (caption  │
     └───────────┘▌      └───────│ 152px  │ └───────────┘
      ▀▀▀▀▀▀▀▀▀▀▀▀              └────────┘
   [A] Hard shadow       [B] Tape + note       [C] Developing
                                               ▬▬▬▬▬▬  35%  [EJECT NEW]
   rotate −3°            rotate 2.5°           rotate −1.5°
```

- `header` with an `h1` (mono caps) and a one-line `p`, 2px ink bottom rule.
- `main.sheet`: grid `repeat(3, minmax(0, 300px))`, gap 72px, centred both ways.
- Each `.cell`: grid, gap 34px. A `figure.pol` and a `p.label` with a 24px boxed letter.
- `.pol`: `background: --paper`, 2px ink border, `padding: 16px 16px 0`. Inside: `.img` (aspect 1, 2px ink border, an inline SVG scene) and `figcaption.cap` (68px tall).
- A: `.pol.hard`, `tabindex="0"`, `role="group"`.
- B: `.pol.taped` with `span.tape` (absolute, top −17px, 116 × 34, centred, rotate −5°), `span.under` (the date, bottom right of the frame), and `button.sticky` (absolute, right −42px, bottom −34px, 152px wide, min-height 132px).
- C: `.pol.dev`, `tabindex="0"`, `role="group"`, `--p` custom property. `.meter` sits absolutely 14px under the label, so the three labels align on one baseline.

Image scenes (inline SVG, `viewBox="0 0 100 100"`, `preserveAspectRatio="xMidYMid slice"`): A is a desert road at sunrise (peach sky, cream sun, rust mesas, dark road with a yellow dashed line). B is a person in a tomato coat seen from behind at a blue lake. C is tomato vines (greens with five red tomatoes and highlights). No photos.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| A shadow | pointer move (rAF) | `box-shadow` offset | current → away from pointer, 6–14px | 140ms | `--ease` | instant |
| A frame | `:active` | translate, shadow | → 60% toward shadow, shadow 40% | 160ms | `--ease` | instant |
| Sticky | hover | transform | rotate 7° → 4°, −3px | 380ms | `--spring` | instant |
| Sticky | click | transform, shadow | → rotate −10°, (8px, −150px), shadow 9px 12px | 380ms | `--spring` | instant |
| C frame | drag | translate, rotate | follows hand, ±20px, 0.12°/px | none | — | stays still |
| C frame | release | transform | → rotate −1.5° | 420ms | `--spring` | instant |
| C frame | Space / Enter | keyframes | −8px/−4° → +7px/1.5° → rest | 360ms | `--ease` | none |
| C image | `--p` changes | blur, saturate, contrast, haze opacity | see formula | live | — | same |
| C caption | `--p` reaches 1 | `clip-path: inset(0 100% 0 0 → 0)` | hidden → shown | 900ms | `--ease` | instant |

Development formula, all from one custom property `--p` (0–1):

```css
.dev .img svg { filter: blur(calc((1 - var(--p)) * 7px)) saturate(calc(var(--p) * 1.1)) contrast(calc(.55 + var(--p) * .45)); }
.dev .img::after { background: var(--film); opacity: calc((1 - var(--p)) * .94); }
```

## States

- **A resting:** shadow 10px, 10px; frame rotate −3°; cursor `crosshair`.
- **A focus-visible:** 2px tomato outline, 4px offset.
- **Sticky resting:** yellow, 2px ink border, 5px 5px hard shadow, folded corner (22px triangle, darker yellow `#e6bf1f`). `aria-pressed="false"`.
- **Sticky peeled:** `aria-pressed="true"`, label "stick back", larger shadow.
- **C developing:** cursor `grab`; while dragging `.shaking`, cursor `grabbing`, transition off.
- **C done (`.done`):** caption visible; the haze is gone.
- **Meter:** 10px tall, 2px ink border, black fill to `--p × 100%`. "Eject new" button: 40px tall, 3px hard shadow, presses flat on `:active`.
- No disabled, loading, or error states.

## Accessibility

- A: `figure` with `role="group"` and `aria-label="Hard shadow polaroid. Arrow keys move the light."`; arrows call `preventDefault()`.
- B: the sticky note is a real `button` with `aria-pressed` and a label that contains its text: "Sticky note: the water was freezing, she went in twice. Press to peel it up."
- C: `role="group"`, label updated with the percentage: "Developing polaroid, 35 percent developed. Drag it side to side, or press Space, to shake it." The label text under it is linked with `aria-describedby`. The percentage is an `output` element.
- One polite live region announces: each 25% step, "Developed: Gran's tomatoes, again.", the peel state, and "New shot ejected. Blank film."
- Image SVGs are `aria-hidden`; captions are real `figcaption` text.
- Contrast: `--ink` on `--paper` 18:1; `--ink-2` on `--bg` 8:1; tomato caption on paper is large display text (24px) at 3.2:1, used decoratively next to the same words as the label.
- Hit targets: frames 300px, sticky 152 × 132, button 40px tall.

## Responsive rules

- **≥ 1280:** three 300px columns, 72px gaps.
- **1024 (861–1100):** columns `minmax(0, 260px)`, gap 48px, captions 20px.
- **768 and < 860:** one column of 300px frames, 72px row gap, header stacks (title over line), body padding 28px 20px. The sticky moves in to `right: -12px` so it stays on screen.
- **375:** same single column; nothing overflows. The page scrolls vertically.
- Pointer-light on A is mouse only; on touch, the shadow stays at its last value. Shaking works with touch because C has `touch-action: none`.

## Acceptance checklist

### Always

- [ ] One frame component (16px borders, square image, 68px caption strip, 2px ink border) used three times with modifier classes.
- [ ] Hard shadow is a zero-blur `box-shadow` whose offset points away from the cursor, length 6–14px, updated once per frame.
- [ ] Arrow keys move the hard shadow; Home resets it.
- [ ] Tape is a semi-transparent striped strip with zig-zag ends from `clip-path`, using `mix-blend-mode: multiply`.
- [ ] Sticky note is a button with `aria-pressed`; peeling reveals something underneath.
- [ ] Development is a single `--p` custom property driving blur, saturation, contrast and haze opacity.
- [ ] Shaking by drag and by Space both develop the print; the caption reveals at 100%.
- [ ] Labels under all three cells share one baseline.
- [ ] Reduced motion keeps every interaction but removes movement.

### This demo

- [ ] Board `#f1eee4` with a 22px dot grid; frames `#fffdf6`; ink `#141414`.
- [ ] Captions "Route 9, 6:40am" (tomato), "Juno at Kettle Pond", "Gran's tomatoes, again".
- [ ] Sticky reads "the water was freezing. she went in twice." and the date under it is "08 · 07 · 26".
- [ ] C starts at 35%; a drag of about 3600px of travel takes it to 100%.
- [ ] Frames rotate −3°, 2.5°, −1.5°.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: three cells in a row, 300px each, 72px gaps, vertically centred under a header rule. Labels under each: "A Hard shadow / light follows you", "B Tape + note / click to peel", "C Developing / drag to shake". C shows a 35% meter and an "Eject new" button below its label.
2. A, pointer anywhere on the page (mouse only): the shadow direction is the vector from the pointer to the frame centre. Its length is `min(14, 6 + distance / 60)` px. Updates run once per animation frame; the box-shadow eases over 140ms.
3. A, keyboard: focus the frame, Arrow keys move the shadow 2px per press (Left moves it left, as if the light moved right), clamped to ±14px. Home resets it to 10px, 10px.
4. A, pressed (`:active`): the frame moves 60% of the shadow offset toward the shadow and the shadow shrinks to 40%, so it reads as pressed into the board.
5. B, hover the sticky note: it straightens from 7° to 4° and rises 3px.
6. B, click or Enter/Space on the note: it peels up to `rotate(-10deg) translate(8px, -150px)` with a springy 380ms ease, the shadow grows from 5px to 9px 12px, the small label changes "peel me" → "stick back", and the date "08 · 07 · 26" written on the frame is now visible. Click again to stick it back.
7. C, drag: the frame follows the hand by half the accumulated x travel (clamped ±40px, so ±20px of movement), tilts 0.12° per px, and every pixel of movement adds `(|dx| + |dy| × 0.5) / 3600` to the development. Release springs it back over 420ms.
8. C, keyboard: Space or Enter adds 0.10 and plays a 360ms side-to-side nudge.
9. C at 100%: the caption "Gran's tomatoes, again" reveals left to right over 900ms by `clip-path`. The meter fills black. "Eject new" resets development to 0.
10. Reduced motion: no transitions, no nudge keyframes, C does not move while shaken but still develops.

## Tokens

```css
:root {
  --bg: #f1eee4;        /* board */
  --paper: #fffdf6;     /* frame */
  --ink: #141414;       /* borders, hard shadows, text */
  --ink-2: #4a4740;     /* secondary text */
  --line: #d8d3c4;
  --tomato: #ff4f2e;    /* accent: focus ring, tape, A caption */
  --sticky: #ffd93b;    /* sticky note */
  --film: #d9dccf;      /* undeveloped haze */

  --marker: "Permanent Marker", "Marker Felt", cursive;
  --mono: "Sometype Mono", ui-monospace, monospace;

  --frame-w: 300px; --frame-pad: 16px; --cap-h: 68px; --border: 2px;
  --shadow-hard: 10px;       /* default offset, both axes */
  --shadow-max: 14px;
  --dots: radial-gradient(rgba(20,20,20,.13) 1px, transparent 1.2px) 0 0 / 22px 22px;

  --ease: cubic-bezier(.2, .7, .2, 1);
  --spring: cubic-bezier(.34, 1.56, .64, 1);
  --t-shadow: 140ms; --t-peel: 380ms; --t-return: 420ms; --t-caption: 900ms; --t-nudge: 360ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Header title | Sometype Mono | 13px | 600 | 1 | 0.16em | UPPER |
| Header line | Sometype Mono | 12px | 400 | 1.5 | 0.04em | sentence, `--ink-2` |
| Caption | Permanent Marker | 24px | 400 | 1.1 | 0 | as written, rotate −1.5° |
| A caption colour | — | — | — | — | — | `--tomato` |
| Sticky note | Permanent Marker | 17px | 400 | 1.2 | 0 | as written |
| Sticky label | Sometype Mono | 10px | 600 | 1 | 0.12em | UPPER |
| Under-note date | Permanent Marker | 14px | 400 | 1 | 0 | `--ink-2`, rotate −3° |
| Cell label | Sometype Mono | 12px | 400/600 | 1.5 | 0.08em | UPPER, tail `--ink-2` |
| Meter value | Sometype Mono | 13px | 600 | 1.5 | 0 | — |
| Button | Sometype Mono | 11px | 400 | 1 | 0.1em | UPPER |

Marker is for handwriting on the objects only. Every UI label is mono.

## Implementation notes

**Light from the cursor.** The shadow is the unit vector from pointer to frame centre, scaled:

```js
addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse') return;
  px = e.clientX; py = e.clientY;
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    const r = hard.getBoundingClientRect();
    const dx = r.left + r.width / 2 - px, dy = r.top + r.height / 2 - py;
    const d = Math.hypot(dx, dy) || 1, len = Math.min(14, 6 + d / 60);
    hard.style.setProperty('--sx', (dx / d * len).toFixed(1) + 'px');
    hard.style.setProperty('--sy', (dy / d * len).toFixed(1) + 'px');
  });
});
```

**Shake to develop.** Distance travelled, not speed, drives progress, so a slow wobble still works:

```js
dev.addEventListener('pointermove', e => {
  if (!down) return;
  const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
  ox = clamp(ox + dx, 40);
  if (!reduce) dev.style.transform = `translate(${ox * .5}px, ${clamp(dy, 6)}px) rotate(${-1.5 + ox * .12}deg)`;
  setP(p + (Math.abs(dx) + Math.abs(dy) * .5) / 3600);
});
```

**Washi tape ends.**

```css
.tape { background: repeating-linear-gradient(135deg, rgba(255,79,46,.62) 0 7px, rgba(255,79,46,.42) 7px 14px);
  clip-path: polygon(0 8%,4% 0,8% 10%,12% 2%,88% 2%,92% 10%,96% 0,100% 8%,100% 92%,96% 100%,92% 90%,88% 98%,12% 98%,8% 90%,4% 100%,0 92%);
  mix-blend-mode: multiply; }
```

Common mistakes:

- A blurred drop shadow on A. The point is a hard, zero-blur offset.
- Animating `filter` per frame with JS. Set `--p` and let CSS compute every filter value.
- Putting the meter in the label's grid row, which pushes C's label below A and B. Position it absolutely.
- Sticky note as a `div` with a click handler. It must be a button.
- Starting C at 0%. The first frame should hint at the picture, so start at 35%.
- Real photos. Every image is a few flat SVG shapes.

Rebuild order:

1. Board, header, three-cell grid.
2. One frame component with an SVG scene and caption.
3. A: hard shadow variables, pointer and keys.
4. B: tape, sticky button, peel state, the date under it.
5. C: `--p` filters and haze, drag to shake, Space nudge, caption reveal, meter, reset.
6. Live region, labels, reduced motion, single-column layout.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
