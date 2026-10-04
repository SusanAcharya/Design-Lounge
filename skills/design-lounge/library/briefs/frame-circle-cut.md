<!-- Design Lounge Nº 210 · "Cut-shape image frames" · designlounge.vercel.app -->

# Cut-shape image frames

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A row of four image frames for a small object studio's portfolio, "Umber Atelier". Each frame is the same 4:5 rectangle, cut by a different CSS shape: two circle bites from opposite corners, an arch, a notched corner, and an organic blob. On hover or keyboard focus the cut morphs to a second shape over 620ms while the photograph inside scales to 1.06. Pressing a frame holds the second shape. The feeling is a printed catalogue: warm bone paper, a tall editorial serif, and photographs that look cut out with a knife rather than rounded with a preset. The detail worth copying is that the image never moves its box. Only the mask moves, driven by registered custom properties so `mask` and `clip-path` can tween.

## Reference behaviour

1. First frame: four frames in one row under the heading "Objects, cut to shape." Frame 03 (Notch lamp) starts held: its notch has already moved from the top-right to the bottom-left corner, and its chip is filled ink.
2. Frame 01, Lune vessel, "Circle cut": an 84px circle bites the top-right corner and a 44px circle bites the bottom-left. Hover: the top-right bite shrinks to 28px and the bottom-left grows to 132px.
3. Frame 02, Arch study, "Arch": top corners are a half-ellipse (`50% / 36%`), bottom corners square. Hover: the bottom corners round to the same ellipse, so the arch becomes a capsule.
4. Frame 03, Notch lamp, "Notch": a 72px 45° notch cuts the top-right corner. Hover: the top-right notch closes to 0 while a 72px notch opens on the bottom-left.
5. Frame 04, Pebble stool, "Blob": an 8-value border-radius blob. Hover: the radii swap to a second blob of the same structure, so the outline drifts.
6. Every morph takes 620ms on `cubic-bezier(.16,1,.3,1)`. At the same time the photograph scales from 1 to 1.06 over 900ms on the same curve.
7. Leaving the frame plays the morph back. A held frame does not play back.
8. Click, Enter or Space on a frame toggles `aria-pressed`. Pressed frames keep the second shape and their chip turns ink with bone text.
9. Keyboard focus on a frame (focus-visible only) also morphs it, so keyboard users see the same effect as hover.
10. The photographs are CSS drawings: a moon jar on a sand wall, a green bottle and stone ball with a diagonal sun shadow, a copper pendant lamp glowing in a dark room, a walnut three-leg stool on a sage wall. No image files.
11. With reduced motion the shape and scale change instantly. Nothing tweens.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────────┐
│ Umber Atelier (italic serif 28)        OBJECTS  INTERIORS  JOURNAL  CONTACT│ 64px, 1px rule
├──────────────────────────────────────────────────────────────────────────┤
│ padding 36px 48px                                                          │
│ Objects, cut                                   Selected work, 2026. Four… │ h1 80px / lede 320px
│ to shape.                                                                  │
│                                    32px                                    │
│ ┌──────────┐ ┌──────────┐ ┌────────╲ ┌──────────┐                         │
│ │[chip]  ◜ │ │  ╭────╮  │ │[chip]   ╲│  ╭─~~─╮  │ 4:5, gap 24px           │
│ │  jar     │ │ bottle   │ │  lamp    │ │ stool  │                          │
│ ◟          │ │[chip]    │ │          │ │ [chip] │                          │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘                        │
│ ───────────  ───────────  ───────────  ───────────  1px rule, 14px pad     │
│ 01 Lune vessel  Stoneware, 34 cm   02 Arch study  Glass, 2 parts   …       │
│                                    28px                                    │
│ Frames are CSS masks over the image…          [Tab] to a frame, [Enter] …  │
└──────────────────────────────────────────────────────────────────────────┘
```

- `header.top`: wordmark `span` and a `nav` labelled "Studio" with four links; Objects has `aria-current="page"` and a 1px ink underline.
- `main > .head`: a two-column grid (`minmax(0,1fr) 320px`, gap 48px, aligned to the bottom). `h1` on the left, `p.lede` on the right.
- `ul.grid`: four `li.work` items, `repeat(4, minmax(0,1fr))`, gap 24px.
- Each `li.work` holds:
  - `button.frame` (4:5, `aria-pressed`, `aria-label` with name and shape) containing `span.shape` (the cut, `overflow: hidden`) → `span.art` (the drawing, `aria-hidden`), and `span.chip` (shape icon and label, `aria-hidden`).
  - `div.cap`: a 3-column grid (`auto minmax(0,1fr) auto`, gap 12px): `span.no`, `h2.name`, `span.meta`. 1px top rule, 14px above and 14px padding.
- `div.foot`: one sentence on the left, a keyboard hint with two `kbd` on the right.

Frame copy:

| No. | Name | Meta | Shape class | Chip label | Chip position |
|-----|------|------|-------------|-----------|---------------|
| 01 | Lune vessel | Stoneware, 34 cm | `c-circle` | Circle cut | top-left |
| 02 | Arch study | Glass, 2 parts | `c-arch` | Arch | bottom-left |
| 03 | Notch lamp | Spun copper | `c-notch` | Notch | top-left |
| 04 | Pebble stool | Walnut, oiled | `c-blob` | Blob | bottom-centre, 18px up |

## Tokens

```css
@property --a { syntax: "<length>"; inherits: false; initial-value: 0px; }
@property --b { syntax: "<length>"; inherits: false; initial-value: 0px; }

:root {
  /* colour */
  --bone: #eee7dc;    /* page, chip fill */
  --ink: #231f1a;     /* text, held chip */
  --ink-2: #5a5148;   /* lede, meta, foot */
  --line: #d6cbb9;    /* rules, kbd border */
  --umber: #8a4b2a;   /* accent: italic "cut", numbers, focus ring */

  /* type */
  --serif: "Instrument Serif", Georgia, serif;
  --sans: "Manrope", system-ui, sans-serif;

  /* space (4px base) */
  --s-3: 12px; --s-4: 16px; --s-6: 24px; --s-7: 28px; --s-8: 32px; --s-9: 36px; --s-12: 48px;

  /* shape values */
  --circle-a: 84px; --circle-b: 44px;          /* rest bites */
  --circle-a-on: 28px; --circle-b-on: 132px;   /* hover bites */
  --notch: 72px;
  --arch: 50% 50% 0 0 / 36% 36% 0 0;
  --blob: 62% 38% 54% 46% / 49% 58% 42% 51%;
  --blob-on: 38% 62% 40% 60% / 60% 40% 58% 42%;

  /* motion */
  --morph: cubic-bezier(.16, 1, .3, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
  --t-morph: 620ms;
  --t-art: 900ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Wordmark | Instrument Serif italic | 28px | 400 | 1 | -0.01em | as written |
| Nav | Manrope | 12px | 700 | 1 | 0.14em | UPPER |
| Heading | Instrument Serif | 80px | 400 | 0.92 | -0.025em | sentence, "cut" italic umber |
| Lede | Manrope | 14px | 400, lead-in 700 | 1.6 | 0 | sentence |
| Chip | Manrope | 11px | 700 | 1 | 0.1em | UPPER |
| Number | Manrope | 11px | 700 | 1 | 0.12em | numerals, umber |
| Work name | Instrument Serif | 24px | 400 | 1.1 | 0 | title |
| Meta, foot | Manrope | 12px | 400 | 1.5 | 0 | sentence |
| kbd | Manrope | 11px | 700 | 1 | 0 | as written |

The serif carries names and the heading only. Labels, chips and numbers are the grotesk. Do not set the chip in the serif.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| `.c-circle .shape` | `.on` | `--a`, `--b` (mask radii) | 84px, 44px → 28px, 132px | 620ms | `--morph` | instant |
| `.c-arch .shape` | `.on` | border-radius | arch → capsule | 620ms | `--morph` | instant |
| `.c-notch .shape` | `.on` | `--a`, `--b` (clip-path) | 72px, 0 → 0, 72px | 620ms | `--morph` | instant |
| `.c-blob .shape` | `.on` | border-radius | blob → blob-on | 620ms | `--morph` | instant |
| `.art` | `.on` | transform scale | 1 → 1.06 | 900ms | `--morph` | stays 1 |
| chip | `aria-pressed` | background, colour | bone/ink → ink/bone | none | — | — |

`.on` is set by pointer enter, focus-visible, or `aria-pressed="true"`, and removed when none of those hold. No stagger, no loop.

## States

- **Rest:** first shape, art at scale 1, chip bone at 92% opacity with ink text.
- **Hover / focus-visible (`.on`):** second shape, art at 1.06.
- **Pressed (`aria-pressed="true"`):** second shape held after the pointer leaves; chip ink with bone text.
- **Focus-visible:** 2px umber outline, 4px offset, drawn on the button's rectangle (outside the cut), so the ring is visible even where the cut removes the image.
- **Nav current:** ink text with a 1px ink underline. Other links `--ink-2`.
- **Loading / empty / error:** not shown. In a real gallery, show the cut shape filled with `--line` while the image loads, so the shape is visible before the photo.

## Accessibility

- Each frame is a real `button` with `aria-pressed`. Its `aria-label` names the work and the shape and ends with "Hold shape", for example "Lune vessel, circle cut-out frame. Hold shape".
- The drawing and the chip are `aria-hidden`. The name is an `h2` in the caption, outside the button.
- In a product where the frame opens a detail page, use a link for the image and drop `aria-pressed`. Keep the hover and focus morph.
- Tab order: nav links, then the four frames left to right. Enter and Space toggle the hold.
- Hover is never the only trigger: focus-visible morphs the frame too.
- Contrast: ink on bone 14.8:1, `--ink-2` on bone 6.6:1, umber on bone 5.9:1, ink on the 92% bone chip over any photo above 10:1.
- The button is the full 4:5 rectangle, so its hit area includes the cut-away corners.

## Responsive rules

- **≥ 1280:** four columns, gap 24px, padding 48px, heading 80px, lede column 320px.
- **1024 (≤ 1100):** heading 64px, lede column 260px.
- **768 (≤ 900):** two columns. The nav hides. The lede drops under the heading (one column, gap 16px).
- **< 640:** padding 20px, heading 48px, grid gap 16px, names 20px, meta hidden, foot stacks. Scale the pixel cuts down: circle 56/32 → 20/88px, notch 48px. Percent shapes (arch, blob) need no change.
- Never use fixed frame widths. Columns are `minmax(0,1fr)` so nothing scrolls sideways at 375px.

## Acceptance checklist

### Always

- [ ] Every frame is the same 4:5 box; only its cut differs.
- [ ] The image inside never changes its box; the morph is mask, clip-path or border-radius only.
- [ ] Mask lengths are registered with `@property` so they tween instead of jumping.
- [ ] Hover and focus-visible both morph; press toggles `aria-pressed` and holds the second shape.
- [ ] The focus ring sits on the button rectangle, outside the cut.
- [ ] Each morph is 620ms on `cubic-bezier(.16,1,.3,1)`; the art scale is 900ms to 1.06.
- [ ] Reduced motion removes every transition and the scale.
- [ ] No horizontal scroll at 375px; pixel cuts shrink below 640px.

### This demo

- [ ] Four frames: Lune vessel (circle bites 84/44 → 28/132px), Arch study (arch → capsule), Notch lamp (72px notch top-right → bottom-left), Pebble stool (blob → blob).
- [ ] Notch lamp starts held, with an ink chip.
- [ ] Page `#eee7dc`, ink `#231f1a`, accent `#8a4b2a` on the italic "cut" and the numbers.
- [ ] Heading "Objects, cut to shape." in Instrument Serif 80px/0.92.
- [ ] All four photographs are CSS gradients and shapes. No image files.

## Implementation notes

**Circle bites are two radial masks intersected.** Each gradient is transparent inside the circle and opaque outside; intersecting keeps only what both keep. The 0.5px step anti-aliases the edge.

```css
.c-circle .shape {
  --a: 84px; --b: 44px;
  transition: --a 620ms var(--morph), --b 620ms var(--morph);
  mask:
    radial-gradient(circle at 100% 0, transparent var(--a), #000 calc(var(--a) + .5px)),
    radial-gradient(circle at 0 100%, transparent var(--b), #000 calc(var(--b) + .5px));
  mask-composite: intersect;
  -webkit-mask-composite: source-in; /* older WebKit spelling */
}
.c-circle.on .shape { --a: 28px; --b: 132px; }
```

Without `@property`, `--a` is a string and the mask snaps. Register it as `<length>` with `inherits: false`.

**The notch is one polygon with both corners always present.** Keep the vertex count fixed so clip-path can interpolate; a zero-size notch is just two coincident points.

```css
.c-notch .shape {
  --a: 72px; --b: 0px;
  clip-path: polygon(0 0, calc(100% - var(--a)) 0, 100% var(--a),
                     100% 100%, var(--b) 100%, 0 calc(100% - var(--b)));
}
.c-notch.on .shape { --a: 0px; --b: 72px; }
```

**One `.on` class, three causes.** Pointer, focus-visible and the pressed state all feed the same class so CSS has one selector per shape:

```js
const sync = () => work.classList.toggle('on',
  work.matches(':hover') || btn.matches(':focus-visible') || btn.getAttribute('aria-pressed') === 'true');
work.addEventListener('pointerenter', () => work.classList.add('on'));
work.addEventListener('pointerleave', () => requestAnimationFrame(sync));
btn.addEventListener('focus', () => requestAnimationFrame(sync));
btn.addEventListener('blur', () => requestAnimationFrame(sync));
btn.addEventListener('click', () => {
  btn.setAttribute('aria-pressed', btn.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
  sync();
});
```

**Blob and arch morph with border-radius alone.** Both states must use the full 8-value syntax (`a b c d / e f g h`); mixing shorthand forms still interpolates but can pass through a rectangle.

Common mistakes:

- Morphing with `clip-path: path()`. It is in pixels, so it breaks at every other width. Use percentages or lengths that you scale at breakpoints.
- Putting `overflow: hidden` and the mask on the button. The focus ring is then clipped by the cut. Mask an inner span.
- Scaling the frame on hover. The grid shifts. Scale only the art inside the cut.
- Forgetting the bites remove part of the image: keep chips and captions away from the cut corners (this is why the circle and notch chips sit top-left).
- Using `ease` or `linear`. The morph needs the long expo tail to feel like a shape settling.
- Hover-only morphs. Keyboard users get the same `.on` from focus-visible.

Rebuild order:

1. Header, heading, lede and the 4-column grid.
2. One 4:5 button with an inner `.shape` span and a CSS-drawn `.art`.
3. Register `--a` and `--b`, then the four shape classes with their two states.
4. The `.on` sync script, `aria-pressed`, and the held chip.
5. Captions, foot, focus ring, reduced motion, breakpoints.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
