<!-- Design Lounge Nº 595 · "Parallax cursor gallery" · www.designlounge.live -->

# Parallax cursor gallery

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The online room of a museum exhibition ("Weather Studies", Hall 4 of the fictional Varde Art Hall): eight small gouaches by an invented painter, Agnes Ruoho, hung salon style on a warm plaster wall. Each work is a framed, matted SVG made of three paint layers. Moving the pointer shifts the frames a few pixels at their own depth and shifts the paint layers inside each frame further, so every picture gains a little depth behind its glass, and the frame shadows lean away from the pointer as if the light moved. Scrolling adds a slow vertical drift at the same depths. Selecting a work opens a focus mode: the wall dims to 94% plaster, the work grows from its place on the wall to full height with a FLIP, and a wall-label panel gives the title, medium, size and a curator's line, with previous and next. The feeling is a quiet room; nothing moves faster than 900ms.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────┐
│ VARDE ART HALL                     Collection  Hall 4  Visit  Tickets │ 64
├──────────────────────────────────────────────────────────────────────┤
│ HALL 4 · UNTIL …    ┌────────────┐  ┌──────┐   ┌────┐                │
│ Weather            │ Low cloud  │  │Birch │   │Hern│ 144w            │
│ Studies  84px      │ 360w       │  │224w  │   └────┘                │
│ ¶ ¶ (max 300)      └────────────┘  │      │   label                 │
│ ─ credit line ─    label           └──────┘   ┌────┐                │
│ ⌖ hint               ┌─────────┐   ┌──────┐   │Loft│ 152w            │
│                      │Rapeseed │   │Harbr │   └────┘                │
│ 360 col · gap 32     │ 296w    │   │220w  │                         │
│                      └─────────┘   └──────┘       salon 792 × 620   │
└──────────────────────────────────────────────────────────────────────┘
```

Salon positions (left, top, width of the outer frame): Low cloud 0, 28, 360 · Three birches 392, 0, 224 · Night heron 648, 44, 144 · Rapeseed 44, 372, 296 · Harbour 380, 392, 220 · Net loft window 640, 330, 152.

- `<header class="top">` with a brand span and `<nav aria-label="Museum">`; current link has `aria-current="page"`.
- `<section class="hall">`: grid `360px 1fr`, gap 32, padding 56 48 64. `.intro` then `.salon` (relative, 620px tall).
- Each work: `.work` (absolute, carries `--d`) → `<button class="frame">` (frame colour `--fr`, padding `--b`) → `.mat` (padding `--m`, inset shadow) → `.art` (`aspect-ratio`, overflow hidden) → `<svg aria-hidden>` with three `<g style="--z:n">` layers; then a `.label` span (title + year bold line, medium and size).
- `<section class="room2">`: kicker, h2, `.row` grid, `.note`.
- `<div class="focus" role="dialog" aria-modal="true" aria-labelledby="ft">`: Close pill, `.stage` > `.big` (the work rebuilt at size), `.panel` (kicker, h3, meta, paragraph, prev/next and counter).

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
|---|---|---|---|---|---|
| `.work` | pointer, scroll | translate | `(mx·d, my·d − sy·d·0.004)` px | 900ms | `--ease-out` |
| `.art g` | pointer | translate | `(mx·z, my·z)` px (×2.2 in focus) | 900ms | `--ease-out` |
| `.frame` shadow | pointer | box-shadow offset | `(−8·mx, 16 − 6·my)` | 900ms | `--ease-out` |
| `.frame` | hover | translateY | 0 → −4px | 320ms | `--ease` |
| `.focus` | open / close | opacity, visibility | 0 ↔ 1 | 320ms | `--ease` |
| `.big` | open / close | transform (FLIP) | thumb rect → own rect (reverse on close) | 560ms | `cubic-bezier(.16,1,.3,1)` |

JS only writes three numbers (`--mx`, `--my`, `--sy`) in one rAF per frame; CSS does all the easing. Touch pointers are ignored so phones do not jitter while scrolling.

Reduced motion: all transitions off, `.work` and `.art g` transforms forced to none, FLIP skipped, focus mode opens and closes instantly. The wall is complete and every work is still openable.

## States

- **Rest:** all layers centred.
- **Hover frame:** lifted 4px; no colour change.
- **Focus-visible:** 2px `--red` outline, 4px offset, on frames, nav links, Close and the round buttons.
- **Focus mode open:** scrim, big work, panel; page behind is inert to pointer; `aria-hidden="false"` on the dialog.
- **Round button / pill hover:** outline darkens from `--ctl-line` to `--ink`.
- **Current nav item:** red text, `aria-current="page"`.

## Accessibility

- Every frame is a `<button>` labelled "Focus <title>, <year>"; the visible label below repeats the title for sighted readers.
- SVG paintings are `aria-hidden`; the label and the focus panel carry the description.
- Focus mode is `role="dialog" aria-modal="true"` labelled by its title; focus moves to Close on open, Tab and Shift+Tab cycle inside it, Esc closes, arrows step, and focus returns to the frame of the work last shown.
- Contrast: ink on plaster 11.6:1, dim on plaster 5.6:1 and on the second wall 5.1:1, red 6.2:1. Control outlines `#7f7467` are above 3:1 on plaster.
- Hit targets: frames are large; prev/next are 44px; Close is 40px tall.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: the salon keeps absolute positions; the right-most column sits closer to the edge (still clear at 1024 because the salon is 792px wide).
- 900–1023: reduce the intro column to 300px; positions unchanged.
- < 900: the top nav shows only the current item. The hall becomes one column (padding 40 16 48). The salon turns into a two-column grid (gap 40px 20px) with the first work spanning both columns; works become static. Room two stacks. Focus mode stacks the big work over the panel, scrolls inside itself, with padding 80 16 24.
- Pointer parallax is off on touch; the layout never scrolls sideways at 390px.

## Acceptance checklist

**Always**
- [ ] JS writes only `--mx`, `--my` (−1…1) and `--sy`, once per animation frame; all easing is a 900ms CSS transition.
- [ ] Each work has a frame depth `d` and each painting three layer depths `z`; front layers move most.
- [ ] Frame shadows move opposite to the pointer.
- [ ] Touch pointers do not drive the parallax.
- [ ] Focus mode FLIPs from the clicked frame's rect and back to the current work's rect on close.
- [ ] Focus mode traps Tab, closes on Esc and scrim click, steps with arrow keys and returns focus to the frame.
- [ ] Reduced motion removes all movement and the FLIP but keeps focus mode.
- [ ] Text contrast at least 4.5:1 on both walls and on the scrim; nothing scrolls sideways at 390px.

**This demo**
- [ ] Salon of six works at the positions listed under Structure; two more in "The harbour years, 1968 to 1971".
- [ ] Frames walnut `#2b2420` or oak `#b4966b`, mats `#f7f3ec`, wall `#ece6db`.
- [ ] Hall title "Weather Studies" at 84px; kicker "Hall 4 · Until 1 March 2027".
- [ ] Focus counter reads "N of 8"; panel kicker "Agnes Ruoho · <year>".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial frame (1280×800): a 64px top bar ("VARDE ART HALL" tracked caps left; Collection, Hall 4 (current, red), Visit, Tickets right) over a 1px rule. Below, a 360px intro column (kicker "Hall 4 · Until 1 March 2027", the 84px title "Weather Studies", two short paragraphs, a ruled credit line, and the hint "Move to look closer. Select a work to stand in front of it.") and a salon of six framed works with labels to its right.
2. Pointer moves (mouse or pen, not touch): `--mx` and `--my` are set from −1 to 1 across the viewport. Each `.work` translates by `(mx, my) × d` px with its own depth `d` (5–14); each paint layer `<g>` inside the art translates by `(mx, my) × z` px with `z` 2, 6–8 and 12–14 for back, middle and front. Both transitions run 900ms expo-out, so motion trails the pointer softly.
3. Frame shadows: `box-shadow: (mx × −8px) (16px + my × −6px) 28px rgba(46,32,20,.22)`, so the shadow falls opposite the pointer.
4. Pointer leaves the document: everything eases back to centre.
5. Scroll: each work also drifts `scrollY × d × −0.004px` vertically (capped at scrollY 1600), so deeper works rise slightly faster; it is barely perceptible and only adds weight.
6. Hover a frame: lifts 4px over 320ms; cursor is `zoom-in`.
7. Click or press Enter on a frame: focus mode opens. The scrim fades in over 320ms; the large frame animates from the clicked frame's rect to its own (translate + scale from top-left, 560ms `cubic-bezier(.16,1,.3,1)`). Focus moves to Close. In focus mode the paint layers move at 2.2× depth.
8. In focus mode: Right/Left arrows or the 44px round buttons step through all eight works (wrapping); the counter reads "2 of 8". Esc, the Close pill, or a click on the scrim closes; the big frame FLIPs back to the current work's place on the wall and focus returns to that frame. Tab is trapped inside the dialog.
9. Further down, a second band on a slightly darker wall ("The harbour years, 1968 to 1971") hangs two more works in a `1fr 1.25fr` row and a closing note.

## Tokens

```css
:root {
  /* colour */
  --wall: #ece6db;        /* plaster */
  --wall-2: #e3dccf;      /* second room */
  --rule: #d4ccbe;        /* top bar and room rules */
  --rule-2: #cfc6b7;      /* credit rule */
  --ink: #2e2924;         /* text */
  --dim: #62584e;         /* labels, kickers */
  --red: #9b2a23;         /* current hall, focus ring */
  --walnut: #2b2420;      /* dark frames */
  --oak: #b4966b;         /* light frames */
  --mat: #f7f3ec;         /* mats */
  --ctl-line: #7f7467;    /* round button and pill outlines */
  --scrim: rgba(236, 230, 219, .94);
  --shadow: rgba(46, 32, 20, .22);

  --font: "Tenor Sans", Optima, Candara, sans-serif;

  /* frames */
  --b: 9px;  --m: 18px;           /* frame and mat; small works 7px / 12px; focus 14px / 32px */
  --lift: 4px;

  /* pointer and scroll state, written by JS */
  --mx: 0; --my: 0; --sy: 0;

  /* motion */
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
  --t-follow: 900ms; --t-flip: 560ms; --t-scrim: 320ms; --t-lift: 320ms;
}
```

## Typography

| Role            | Family     | Size | Weight | Line-height | Tracking | Case      |
|-----------------|------------|-----:|-------:|------------:|---------:|-----------|
| Hall title      | Tenor Sans | 84px (56px < 900) | 400 | 0.98 | −0.02em | Title Case |
| Room title      | Tenor Sans | 44px (34px < 900) | 400 | 1.05 | 0 | sentence |
| Focus title     | Tenor Sans | 34px | 400    | 1.1         | 0        | sentence  |
| Body            | Tenor Sans | 15px | 400    | 1.55        | 0        | sentence  |
| Brand           | Tenor Sans | 15px | 400    | 1           | +0.24em  | UPPERCASE |
| Nav             | Tenor Sans | 13px | 400    | 1           | +0.08em  | Title Case |
| Kicker          | Tenor Sans | 11px | 400    | 1.4         | +0.22em  | UPPERCASE |
| Label title     | Tenor Sans | 13px | 400    | 1.45        | 0        | sentence, ink |
| Label medium    | Tenor Sans | 12px | 400    | 1.45        | 0        | sentence, dim |
| Counter, pill   | Tenor Sans | 12px | 400    | 1           | +0.14–0.16em | caps on pill |

Tenor Sans has one weight; hierarchy comes from size, tracking and the ink/dim split only.

## Implementation notes

**Depth in two places.** The frame moves a little; the paint inside moves more. Use CSS variables so one pointer value feeds both:

```css
.work { transform: translate3d(calc(var(--mx) * var(--d) * 1px),
          calc(var(--my) * var(--d) * 1px + var(--sy) * var(--d) * -.004px), 0);
        transition: transform 900ms var(--ease-out); }
.art { overflow: hidden; }                    /* layers must be clipped by the mat */
.art g { transform: translate(calc(var(--mx) * var(--z) * 1px), calc(var(--my) * var(--z) * 1px));
         transition: transform 900ms var(--ease-out); }
```

Draw each SVG layer about 20 units larger than the viewBox on every side, so a moving layer never shows a gap at the edge.

**FLIP from the wall:**

```js
const flip = (from, back) => {
  const a = from.getBoundingClientRect(), b = big.getBoundingClientRect();
  const k = `translate(${a.left - b.left}px,${a.top - b.top}px) scale(${a.width / b.width})`;
  return big.animate([{ transform: k, transformOrigin: '0 0' }, { transform: 'none', transformOrigin: '0 0' }],
    { duration: 560, easing: 'cubic-bezier(.16,1,.3,1)', direction: back ? 'reverse' : 'normal' }).finished;
};
```

**Pointer to numbers, once per frame:**

```js
addEventListener('pointermove', (e) => {
  if (e.pointerType === 'touch') return;
  mx = (e.clientX / innerWidth - .5) * 2; my = (e.clientY / innerHeight - .5) * 2;
  if (!raf) raf = requestAnimationFrame(paint);   // paint() sets --mx/--my/--sy on :root
}, { passive: true });
```

Common mistakes: moving the whole SVG instead of its layers (the picture slides inside the mat and shows its edge); a fast transition (under 400ms the wall feels nervous, not like a room); measuring the big frame before the dialog is visible (its rect is zero, so open first, then FLIP); forgetting to clip `.art`, so the front layer pokes over the mat.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
