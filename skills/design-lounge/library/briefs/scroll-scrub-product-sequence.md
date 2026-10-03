<!-- Design Lounge Nº 261 · "Scroll-scrubbed product teardown" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Scroll-scrubbed product teardown

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A product page opener for a fictional Geneva watchmaker, Orrery Instruments, and its Meridian 40. One section is 400vh tall with a 100vh sticky stage inside it. Scroll progress from 0 to 1 drives a wristwatch built only from CSS and inline SVG: it tilts into a three-quarter view, lifts apart into four labelled layers (case, movement, dial, crystal), shows the movement while its brass rotor turns, then closes and turns back to face-on. Four captions step in on the right, one per quarter of progress, and a four-part rail fills as you go. There is no video and no image sequence. It feels like a product page from a big phone maker, done in graphite with one brushed brass.

The detail worth copying: the part labels are flat 2D elements, but they follow the 3D layers exactly. Each frame they are placed with the same angle and perspective maths the browser uses, so there is no layout read and no drift.

## Reference behaviour

1. First frame (progress 0): fixed 64px nav (logo "ORRERY", three links, "Reserve" outline button). Left 7/12: the watch face-on with a slight 10° tilt back and a −6° turn. Strap runs top to bottom and fades out. Right 5/12: kicker "Orrery Instruments · Geneva", 58px headline "Meridian 40", price line "CHF 4,200 · Ships 12 November", caption 01 "Forty millimetres of graphite.", and a rail of four steps with 01 current. "Scroll" with a bobbing arrow sits 28px from the bottom of the stage.
2. Progress = (scrollY − section top) / (section height − viewport height), clamped 0–1. At 1280×800 the scrubbed distance is 2400px.
3. 0 → 0.20, Turn: the watch rotates from `rotateX(10deg) rotateZ(-6deg)` to `rotateX(60deg) rotateZ(-38deg)`. Ease in-out cubic.
4. 0.22 → 0.42, Open: the four layers separate along their own z axis. Case to −130px, movement to −45px, dial to +45px, crystal to +130px. The stack stays centred. Labels fade in one by one as the gap opens.
5. 0.48 → 0.60, Inside: dial and crystal lift a further 50px and the case drops 20px, so the movement is clearly visible. 0.66 → 0.76 they settle back.
6. 0.72 → 0.90, Close: the layers return to 0, 1, 2, 3px. The labels fade out.
7. 0.86 → 1.00: the watch turns back to the first-frame angle.
8. The rotor spins 540° across the whole scroll. The minute hand turns one full hour (48° → 408°). The hour hand moves 30°. Time passes as you scroll.
9. Captions: step = floor(progress × 4), max 3. The active caption fades in and rises 14px over 400ms. The others fade out.
10. Rail: each of four segments fills with brass by `scaleX(clamp(progress × 4 − i))`. The active step's label turns ink and gets `aria-current="step"`.
11. Clicking a rail step smooth-scrolls to the middle of that quarter (i × 0.25 + 0.13).
12. The scroll hint fades out over the first 4% of progress.
13. After the section: a specs block ("Specifications", seven rows in mono) with a brass "Reserve yours" button, then a footer.
14. Reduced motion: the section is not pinned. The watch shows the open state at rest, with all four labels. All four captions show as a stacked list. The rail and hint hide.

## Structure

```
1280 × 800, section height 400vh, stage sticky 100vh
┌──────────────────────────────────────────────────────────────────┐
│ ORRERY            MERIDIAN  CALIBRE  SERVICE          [RESERVE]  │ nav 64px fixed
├──────────────────────────────────────┬───────────────────────────┤
│        Crystal  ───•  ◯ crystal      │ ORRERY INSTRUMENTS·GENEVA │
│    Sapphire·2.1mm                    │ Meridian 40          58px │
│           Dial  ───•  ◉ dial         │ CHF 4,200 · Ships 12 Nov  │
│   Calibre OR-7  ───•  ◐ movement     │ ───────────────────────── │
│           Case  ───•  ◎ case+strap   │ 01 / TURN                 │
│                                      │ Forty millimetres of ...  │ captions 176px
│     stage centre at 56% x,           │ body 14px, 40ch           │
│     50% + 32px y                     │ ━━━━ ──── ──── ────       │ rail 4 × 1fr
│               ↓ SCROLL               │ 01 TURN 02 OPEN 03 ...    │
└──────────────────────────────────────┴───────────────────────────┘
then: specs (5fr / 7fr), footer
```

- The section is a `section` labelled "Meridian 40, taken apart". Inside: `div.sticky` with `position: sticky; top: 0; height: 100vh; display: grid; grid-template-columns: 7fr 5fr`.
- The stage is a 400×400 box with `perspective: 1600px`. Inside it `.watch` has `transform-style: preserve-3d`.
- Four `.part` children, each centred with negative margins, each with `transform-style: preserve-3d`: case 320px, movement 248px, dial 262px, crystal 276px.
- Case: two strap divs (150×260, fading via `mask-image`), a graphite conic ring, a brushed brass bezel at inset 22px, and a ribbed crown 20×38 on the right.
- Movement: an SVG with two toothed gears (dashed thick strokes), a balance wheel with a cross, jewel dots, and a brass half-disc rotor with "OR-7 · 28 JEWELS".
- Dial: sunray conic texture over a radial graphite, 60 SVG minute ticks (12 brass bars, a double bar at 12), "ORRERY" wordmark, "AUTOMATIC · 100 M", a date window "14", three hands and a brass cap.
- Crystal: a translucent disc with a 1px white inner ring and a diagonal glare.
- Labels: a flat `div.labels` at the same centre point as the stage, holding four `.lab` rows (name, mono spec, 56px brass line with a 5px dot).
- Copy column: `p.kick`, `h1`, `p.price`, a captions box with four `div.capt` (each an `h2` and `p`), and a `div.rail` group of four buttons.

## Tokens

```css
:root {
  --bg: #121214;          /* page */
  --surface: #1a1a1d;     /* raised blocks */
  --steel: #2c2c31;       /* case highlight */
  --line: rgba(236, 232, 225, .1);
  --ink: #ece8e1;         /* primary text */
  --ink-2: #a29d94;       /* secondary text, ticks */
  --brass: #b8955a;       /* accent */
  --brass-hi: #dcc08a;    /* brass highlight, kicker */
  --brass-lo: #8a6c3c;    /* brass shadow */
  --brushed: conic-gradient(from 20deg, #8a6c3c, #dcc08a 12%, #b8955a 25%,
    #8a6c3c 40%, #dcc08a 58%, #b8955a 72%, #8a6c3c 88%, #dcc08a);

  --wide: "Archivo", system-ui, sans-serif;     /* font-stretch 125% */
  --mono: "IBM Plex Mono", ui-monospace, monospace;

  --text-hero: 58px; --text-h2: 22px; --text-body: 14px;
  --text-mono: 11px; --text-spec: 14px;

  --space-1: 8px; --space-2: 16px; --space-3: 24px; --space-6: 48px; --space-8: 64px;

  --P: 1600px;            /* stage perspective */
  --pin: 400vh;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --dur-caption: 400ms;

  --z-case: -130px; --z-move: -45px; --z-dial: 45px; --z-crystal: 130px;
  --tilt-x: 60deg; --tilt-z: -38deg;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Headline | Archivo, wdth 125 | 58px | 700 | 0.95 | -0.02em | Title |
| Caption title | Archivo, wdth 125 | 22px | 700 | 1.15 | -0.005em | Sentence |
| Caption body | Archivo, wdth 100 | 14px | 500 | 1.55 | 0 | Sentence, max 40ch |
| Kicker, step number | IBM Plex Mono | 11px | 500 | 1.2 | 0.14–0.16em | Upper, brass-hi |
| Price | IBM Plex Mono | 13px | 400 | 1.4 | 0 | Sentence |
| Rail label | IBM Plex Mono | 11px | 500 | 1 | 0.1em | Upper |
| Part label name | Archivo | 13px | 500 | 1.3 | 0 | Title |
| Part label spec | IBM Plex Mono | 11px | 400 | 1.3 | 0.04em | Sentence |
| Logo | Archivo | 15px | 700 | 1 | 0.32em | Upper |
| Spec rows | IBM Plex Mono | 14px; keys 11px upper | 400 | 1.5 | keys 0.12em | — |

Body copy drops to normal width (`font-stretch: 100%`) so long lines stay readable. Wide is for names and headlines only.

## Motion

| Thing | Progress range | Property | From → to | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Watch | 0 → 0.20 | rotateX, rotateZ | 10°, −6° → 60°, −38° | in-out cubic | fixed at 60°, −38° |
| Watch | 0.86 → 1.00 | rotateX, rotateZ | back to 10°, −6° | in-out cubic | — |
| Layers | 0.22 → 0.42 | translateZ | 0–3px → −130 / −45 / +45 / +130px | in-out cubic | fixed open |
| Layers lift | 0.48 → 0.60, back 0.66 → 0.76 | translateZ | +50px dial and crystal, −20px case | in-out cubic | off |
| Layers | 0.72 → 0.90 | translateZ | back to 0–3px | in-out cubic | — |
| Labels | follow layers | translate, opacity | fade in from open ≥ 0.55, staggered 0.08 | linear | all shown |
| Rotor | 0 → 1 | rotate | 0 → 540° | linear | 270° |
| Minute hand | 0 → 1 | rotate | 48° → 408° | linear | static |
| Hour hand | 0 → 1 | rotate | 304° → 334° | linear | static |
| Caption | step change | opacity, translateY | 0, 14px → 1, 0 | 400ms `--ease` | all shown, no move |
| Rail fill | per quarter | scaleX | 0 → 1 | linear with scroll | hidden |
| Hint arrow | loop | translateY | 0 → 4px → 0 | 1600ms `--ease` | hidden |
| Hint | 0 → 0.04 | opacity | 1 → 0 | linear | hidden |

Use one in-out cubic: `t < .5 ? 4t³ : 1 − (−2t + 2)³ / 2`. Apply it per range with `seg(p, a, b) = ease(clamp((p − a) / (b − a)))`. Every pose comes from progress, so scrolling back up plays it in reverse.

Optional: in browsers with `animation-timeline: view()`, the captions can switch by view timeline. Keep the JS path anyway. The 3D maths for labels needs JS.

## States

- Rail step resting: 2px track `--line`, label `--ink-2`.
- Rail step filling: brass bar grows left to right inside the track.
- Rail step current: label `--ink`, `aria-current="step"`.
- Rail hover: label `--ink`.
- Nav "Reserve": 1px brass border, brass-hi text. Hover: brass fill, `--bg` text.
- "Reserve yours": linear brushed brass fill, `#1a140a` text, 48px tall.
- Focus-visible: 2px solid `--brass-hi`, offset 3px, on every link and button.
- Caption inactive: opacity 0, `aria-hidden="true"`. Active: opacity 1.
- Loading: fonts swap. The watch is pure CSS and SVG, so it is there in the first paint.

## Accessibility

- The watch is decorative: `.watch` and `.labels` are `aria-hidden="true"`. The captions carry the same facts in text.
- The section has `aria-label`. The page has one `h1` ("Meridian 40"). Each caption title is an `h2`.
- The rail is `role="group"` labelled "Steps". Each step is a real `button`. Enter or Space scrolls to that step. Tab order: nav, rail steps, specs link, footer.
- `aria-current="step"` moves with the active caption. Do not add a live region. Scrolling is user-driven, and announcing every step is noise.
- Contrast: `#ece8e1` on `#121214` is above 15:1. `#a29d94` on `#121214` is above 7:1. Brass-hi `#dcc08a` on `#121214` is above 10:1.
- Rail buttons are at least 44px tall. Nav buttons are 40px tall.
- Reduced motion turns off the pin. The open watch and all four captions are in normal flow.

## Responsive rules

- ≥ 1280: as specified. Stage centre at 56% of the left column, so labels have room on the left.
- 1024: same grid. The labels still fit, with the shortest label row about 180px wide.
- ≤ 900: one column. The stage takes the top 56% of the sticky viewport and the copy takes 44%. The stage scales by `min(0.66, width / 560)`. Hide the part labels and the scroll hint. Caption two already names the four parts. Headline 30px, caption title 18px, captions box 150px.
- < 640: shorter pin, 300vh instead of 400vh, so the teardown takes about 1.5 screens of thumb travel per step pair. Nav padding 20px.
- The specs list goes to one column with a 120px key column below 900.
- Never let the page scroll sideways. `overflow-x: clip` on the body. The sticky stage has `overflow: hidden`.

## Acceptance checklist

### Always

- [ ] One section is pinned with `position: sticky`. Its height is four times the viewport (three on phones).
- [ ] Progress 0–1 is computed from cached section top and length. The only per-frame read is `scrollY`.
- [ ] Every pose is a pure function of progress. Scrolling back reverses it exactly.
- [ ] The product is built from CSS and inline SVG. No video, no image frames.
- [ ] Four steps: turn, open, inside, close. Four captions, one per quarter.
- [ ] The rail shows four segments that fill with progress, and the current step has `aria-current="step"`.
- [ ] Part labels track their layers during the explode and are hidden on narrow screens.
- [ ] Only `transform` and `opacity` change per frame.
- [ ] Reduced motion: no pin, open state, all captions visible.
- [ ] Focus rings are visible on nav, rail and buttons. No horizontal scroll.

### This demo

- [ ] The product is "Meridian 40" by "Orrery Instruments", CHF 4,200.
- [ ] Layer offsets at full open: case −130, movement −45, dial +45, crystal +130px. Perspective 1600px.
- [ ] The tilted pose is `rotateX(60deg) rotateZ(-38deg)`. Rest is `rotateX(10deg) rotateZ(-6deg)`.
- [ ] Labels read Case, Calibre OR-7, Dial and Crystal, with mono specs under each.
- [ ] Captions: "Forty millimetres of graphite.", "Four parts. Nothing glued.", "Calibre OR-7, wound by your wrist.", "Sealed again to 100 metres."
- [ ] The rotor turns 540° over the full scroll and the minute hand moves one hour from 10:08.

## Implementation notes

**1. Labels that follow 3D layers with no layout reads.** The transform is `rotateX(ax) rotateZ(az)` and each part has `translateZ(z)`. A point at (0, 0, z) is not moved by rotateZ. rotateX moves it to y = −z·sin(ax) and depth z·cos(ax). Perspective then scales it by P / (P − depth). That is the screen offset from the stage centre.

```js
const P = 1600, R = Math.PI / 180;
function placeLabels(ax, zs, k) {        // k = stage scale on small screens
  const sin = Math.sin(ax * R), cos = Math.cos(ax * R);
  zs.forEach((z, i) => {
    const s = P / (P - z * cos);
    const y = -z * sin * s * k;
    labs[i].style.transform =
      `translate(calc(-100% - ${150 * k}px), calc(-50% + ${y}px))`;
  });
}
```

The label container must sit at the exact same point as the stage centre, and the stage must use `perspective-origin: 50% 50%` (the default).

**2. Pose from progress.** Keep timing in one place. Overlapping ranges are fine because each is subtracted back out.

```js
const io = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
const seg = (p, a, b) => io(Math.min(1, Math.max(0, (p - a) / (b - a))));
function pose(p) {
  const tilt = seg(p, 0, .2) - seg(p, .86, 1);
  const ex   = seg(p, .22, .42) - seg(p, .72, .9);
  const lift = seg(p, .48, .6) - seg(p, .66, .76);
  const ax = 10 + 50 * tilt, az = -6 - 32 * tilt;
  watch.style.transform = `rotateX(${ax}deg) rotateZ(${az}deg)`;
  const zs = parts.map(pt => pt.base + pt.spread * ex + (pt.spread > 0 ? 50 : -20) * lift);
  parts.forEach((pt, i) => pt.el.style.transform = `translateZ(${zs[i]}px)`);
  placeLabels(ax, zs, k);
  rotor.style.transform = `rotate(${p * 540}deg)`;
}
```

**3. Measure once.** Read `offsetTop` and `offsetHeight` of the section on load and on resize only. In the scroll handler, store `scrollY` and request one frame.

```js
const measure = () => {
  top = pin.offsetTop;
  len = Math.max(1, pin.offsetHeight - innerHeight);
};
addEventListener('scroll', () => { sy = scrollY; queue(); }, { passive: true });
// in the frame: const p = Math.min(1, Math.max(0, (sy - top) / len));
```

Common mistakes:

- Setting `opacity` below 1 on `.watch` or the stage. Opacity on a `preserve-3d` parent flattens the 3D, and the parts collapse into one plane.
- Resting the layers all at translateZ(0). They fight for depth and flicker. Use 0, 1, 2, 3px.
- Exploding from z 0 upward only. The stack drifts up out of the frame. Spread around 0: −130 to +130.
- Ticking the step on every frame. Only touch caption classes when the step number changes.
- Using a video or 120 PNG frames. The point of this piece is that it is light, sharp at any zoom and themeable.
- A second accent colour. Graphite and brass only. The date window is the one ink-on-light detail.
- Labels inside the 3D layers. They skew with the tilt and become hard to read.

Rebuild order:

1. Build the four parts flat, face-on, and check the assembled watch looks right.
2. Add perspective and preserve-3d. Pose the open state by hand and check depth order.
3. Add the sticky section and the progress maths.
4. Add the pose function with the four ranges.
5. Add the labels and the projection maths.
6. Add captions, rail and rail clicks.
7. Add the narrow layout and the 300vh pin on phones.
8. Add the reduced-motion layout.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
