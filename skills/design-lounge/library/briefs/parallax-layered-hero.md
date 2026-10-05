<!-- Design Lounge Nº 291 · "Layered parallax landscape hero" · www.designlounge.live -->

# Layered parallax landscape hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The opening screen of an outdoor brand, Tarnwick Outfitters, at dusk. The hero is a full-viewport landscape made of six stacked layers: sky with sun and stars, a far ridge, a mid ridge, the title block, a tree line, and a dark foreground hill with a small lit tent. As you scroll, each layer moves at its own speed, from 0.1x for the sky to 1.0x for the foreground, so the scene gains depth. The title rises at 0.6x and fades out over the first 45vh. The foreground hill is the same colour as the next section, so the hero hands off to normal content with no edge. On desktop the layers also drift up to 12px against the pointer.

The detail worth copying: every colour is one of five tonal steps between slate blue and apricot, and the speed of each layer follows its tone. Light and far moves slow. Dark and near moves fast.

## Structure

```
1280 × 800 viewport, page scrolls
┌───────────────────────────────────────────────────────────────┐
│ Tarnwick        Shells  Packs  Field notes  Stores    [Bag 0] │ nav, absolute, top 28px
│                                                     · ·  ·    │ stars (26, top 34%)
│ TARNWICK · AUTUMN LINE 2026                                   │ title layer, padding-top 16vh
│ Stay out                                                      │ h1 116px
│ past the light.                       ( sun 132px )           │
│ Shells, packs and fleece built...      /\/\ far ridge /\      │
│ [Shop the Dusk Shell →] [Find a trail]                        │
│ /\/\/\/\/\/\/\/\/\  mid ridge  /\/\/\/\/\/\/\/\/\/\/\/\/\     │
│ ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲  trees  ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲      │
│ ████████ foreground hill ███████████ ▲ tent ███████████████   │
│                         SCROLL                                │
└───────────────────────────────────────────────────────────────┘
main, background #222a40, padding 24px 9vw 120px
  intro: h2 56px | paragraph 18px        grid 5fr 6fr
  gear: 3 columns, 1px rules between
  footer line
```

- The hero is a `header` with `height: 100vh; min-height: 560px; overflow: hidden`.
- Each layer is a `div.layer` with `position: absolute; inset: -16px -24px`. The negative inset hides the edges when the pointer drift moves them.
- Ridges, trees and foreground are inline SVG with `viewBox="0 0 1440 800"` and `preserveAspectRatio="xMidYMax slice"`, so they anchor to the bottom and crop at the sides.
- The title layer sits between the mid ridge and the trees in the stack. The trees overlap its lower edge as you scroll.
- Nav is a `nav` with a list of links and a button. Content is `main` with `section`, `ul`, `dl` and `footer`.
- Stars are 26 absolutely positioned 2px dots in the top 34% of the sky.

## Motion

| Thing | Trigger | Property | From → to | Timing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Sky + sun + stars | scroll | translateY | 0 → 0.9 × scrollY | per frame, no easing | static |
| Far ridge | scroll | translateY | 0 → 0.7 × scrollY | per frame | static |
| Mid ridge | scroll | translateY | 0 → 0.5 × scrollY | per frame | static |
| Title block | scroll | translateY | 0 → 0.4 × scrollY | per frame | static |
| Title block | scroll | opacity | 1 → 0 over 0–45vh | linear | stays 1 |
| Trees | scroll | translateY | 0 → 0.25 × scrollY | per frame | static |
| Foreground | scroll | none | moves with page | — | — |
| Scroll hint | scroll | opacity | 1 → 0 over 0–8vh | linear | stays 1 |
| Scroll hint line | load, loop | scaleY, opacity | 0 → 1 → fade | 1800ms `--ease`, infinite | no loop |
| All layers | pointer move | translateX/Y | 0 → ±12px × depth | lerp 0.1 per frame | off |
| Buttons | hover | background | ink → sun | 180ms `--ease` | instant |

The translate values are "how far the layer lags behind the page". Speed 0.1 means it lags 90% of the scroll.

On phones (width ≤ 640px) multiply every scroll offset by 0.6. The scene moves less, so it does not tear apart on a short screen.

## States

- Button solid: background `--ink`, text `--t5`. Hover: background `--sun`.
- Button outline: 1px border `rgba(246,231,212,.5)`. Hover: background `rgba(246,231,212,.12)`.
- Nav link: opacity 0.86. Hover: opacity 1 with a 5px offset underline.
- Bag button: 40px tall, 1px `--line` border, label "Bag 0". The accessible name is "Bag, 0 items".
- Focus-visible on everything: 2px solid `--t1` outline, offset 3px, radius 2px.
- Title faded: at opacity 0 the CTA still sits in the DOM and stays focusable. Tabbing to it scrolls it into view, and the opacity follows the new scrollY.
- No loading or empty state. Fonts load with `display=swap`. The scene is drawn in SVG, so the first frame does not depend on the font.

## Accessibility

- The hero is a `header` labelled "Autumn line". There is one `h1`, the headline.
- All landscape layers are decorative: SVGs have `aria-hidden="true"` and the stars container is hidden too.
- The scroll hint is `aria-hidden="true"`. It is a visual cue only.
- Nav is labelled "Main". Order: wordmark, four links, bag. Then the two CTAs, then content.
- Contrast: `#f6e7d4` on `#2f3a5a` is above 9:1. The lede sits on the upper sky, which stays darker than `#6e6f8e`, above 4.5:1. Do not let the far ridge rise behind the lede. Keep the left 40% of the ridge low (see Implementation notes).
- `#cdbfb4` on `#222a40` is above 8:1 for body copy below the hero.
- Hit targets: buttons 48px tall, bag 40px tall.
- `prefers-reduced-motion: reduce` removes every transform and the hint loop. The title stays at full opacity.

## Responsive rules

- ≥ 1280: as specified. The headline is 116px. The gutter is 9vw.
- 1024: the headline scales with `8.8vw` to about 90px. The layers keep all six levels and the pointer drift.
- 900 and below: nav links hide, wordmark and bag stay. The intro goes to one column and the gear list stacks with 1px top rules instead of side rules. Pointer drift turns off.
- < 640: lighter scene. Hide the stars and the sun. Scroll offsets are multiplied by 0.6. The title padding becomes 22vh top and 24px sides. The CTAs stack full width, max 300px. The section h2 drops to 40px.
- Very tall phones: the hero keeps `height: 100vh` with `min-height: 560px`. Because the SVGs use `xMidYMax slice`, the ridges stay pinned to the bottom and crop at the sides. They never stretch.
- Never let the page scroll sideways. Set `overflow-x: clip` on the body. The layers overhang by 24px on each side.

## Acceptance checklist

### Always

- [ ] The hero has five to six visual layers, each with its own scroll speed between 0.1 and 1.0.
- [ ] Speed follows depth: farther and lighter layers move slower.
- [ ] Only `transform` and `opacity` change during scroll. No `top`, `height` or `background-position`.
- [ ] The scroll handler is passive and writes styles inside one `requestAnimationFrame` per frame.
- [ ] No layout reads during scroll besides `scrollY`. The viewport height is cached on resize.
- [ ] The headline fades out by 45% of the viewport height.
- [ ] The foreground colour equals the next section's background, so there is no visible seam.
- [ ] Pointer drift is at most 12px and only runs for a fine pointer at ≥ 900px wide.
- [ ] Reduced motion shows a static scene with the title fully visible.
- [ ] No horizontal scroll at any width. Focus rings are visible on every link and button.

### This demo

- [ ] The brand is "Tarnwick" and the headline reads "Stay out past the light." with "light." in italic `#fbd9a8`.
- [ ] Speeds: sky 0.1, far 0.3, mid 0.5, title 0.6, trees 0.75, foreground 1.0.
- [ ] Palette: `#222a40`, `#434c6b`, `#6e6f8e`, `#a7899a`, `#e9a97a`, with ink `#f6e7d4`.
- [ ] A small tent with a lit `#e9a97a` door sits on the foreground hill at about x 1050 of 1440.
- [ ] The three gear items are Dusk Shell £210, Ridgeline 28 £145, and Lantern Fleece £95.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame (scrollY 0): the full scene fills 100vh. Top-left wordmark "Tarnwick", four nav links in the centre, a "Bag 0" button on the right. The kicker "Tarnwick · Autumn line 2026", the 116px serif headline "Stay out past the light." with "light." in italic apricot, a two-line lede, and two buttons sit in the sky on the left. The sun sits low on the right behind the far ridge. A "Scroll" label with a dripping 1px line sits 28px from the bottom.
2. Scroll down. Each layer gets `translateY = scrollY × (1 − speed)`. The hero itself scrolls at 1.0x, so a layer with speed 0.1 looks almost fixed and a layer with speed 1.0 moves with the page.
3. Speeds: sky 0.1, far ridge 0.3, mid ridge 0.5, title 0.6, trees 0.75, foreground 1.0.
4. The title opacity goes from 1 to 0 linearly over scrollY 0 → 0.45 × viewport height.
5. The scroll hint fades from 1 to 0 over the first 8% of the viewport height (64px at 800 tall).
6. The parallax input is capped at 1.1 × viewport height. Past that, the hero is off screen and transforms stop changing.
7. The foreground hill fills `#222a40` to the bottom of the hero. The content section below has the same background, so the hill becomes the page.
8. Pointer drift (desktop only, `pointer: fine` and width ≥ 900px): each layer moves opposite the pointer by up to 12px × its depth. Depths: sky 0.15, far 0.3, mid 0.5, title 0.4, trees 0.75, foreground 1.0. The drift eases toward the target at 10% per frame. When the pointer leaves the page, it returns to 0.
9. Pointer drift stops listening once scrollY passes one viewport height.
10. Below the hero: a two-column intro "Gear for the hour after." with a paragraph, then three gear columns (Dusk Shell, Ridgeline 28, Lantern Fleece) with weight, rating and price, then a footer line.
11. Reduced motion: every layer is static at its resting place, the title stays fully visible, and the hint line does not animate.

## Tokens

```css
:root {
  /* five tonal steps, near to far */
  --t5: #222a40;      /* foreground hill, page background */
  --t4: #434c6b;      /* tree line */
  --t3: #6e6f8e;      /* mid ridge */
  --t2: #a7899a;      /* far ridge */
  --t1: #e9a97a;      /* horizon glow, accent */
  --sky-top: #2f3a5a;
  --sun: #fbd9a8;     /* sun disc, kicker, italic word */
  --ink: #f6e7d4;     /* text on dark */
  --ink-2: #cdbfb4;   /* secondary text */
  --line: rgba(246, 231, 212, .16);

  --serif: "Fraunces", Georgia, serif;
  --sans: "Instrument Sans", system-ui, sans-serif;

  --text-hero: clamp(52px, 8.8vw, 116px);
  --text-h2: 56px;
  --text-h3: 28px;
  --text-lede: 18px;
  --text-body: 16px;
  --text-small: 13px;

  --space-1: 8px; --space-2: 16px; --space-3: 24px; --space-4: 32px; --space-6: 64px;
  --gutter: 9vw;
  --radius: 2px;

  --ease: cubic-bezier(.2, .7, .2, 1);
  --dur-micro: 180ms;
  --hint-loop: 1800ms;

  --speed-sky: .1; --speed-far: .3; --speed-mid: .5;
  --speed-title: .6; --speed-trees: .75; --speed-fore: 1;
  --pointer-max: 12px;
}
```

Sky gradient, top to bottom: `#2f3a5a 0%`, `#4b5578 34%`, `#6e6f8e 52%`, `#b98c8c 68%`, `#e9a97a 82%`, `#e9a97a 100%`.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Hero headline | Fraunces, opsz 144 | 116px (clamp 52–116) | 800 | 0.92 | -0.025em | Sentence |
| Italic word | Fraunces italic | inherits | 600 | inherits | inherits | colour `--sun` |
| Kicker | Instrument Sans | 13px | 600 | 1.2 | 0.18em | Upper |
| Lede | Instrument Sans | 18px | 400 | 1.55 | 0 | Sentence, max 40ch |
| Button | Instrument Sans | 15px | 600 | 1 | 0 | Sentence |
| Wordmark | Fraunces | 22px | 800 | 1 | -0.01em | Title |
| Nav link | Instrument Sans | 14px | 500 | 1 | 0 | Title |
| Section h2 | Fraunces | 56px | 600 | 1.0 | -0.02em | Sentence |
| Gear h3 | Fraunces | 28px | 600 | 1.2 | -0.01em | Title |
| Gear index | Instrument Sans | 12px | 600 | 1.2 | 0.16em | colour `--t1` |
| Scroll hint | Instrument Sans | 11px | 600 | 1 | 0.24em | Upper |

Use the serif only for the wordmark, headlines and product names. Everything else is the sans.

## Implementation notes

**1. One loop for scroll and pointer.** Keep scroll and pointer in one rAF writer. Read `scrollY` in the scroll event, store it, and request one frame. The pointer lerp asks for another frame only while it is still moving.

```js
const layers = [...document.querySelectorAll('[data-speed]')]
  .map(el => ({ el, s: +el.dataset.speed, d: +el.dataset.depth }));
let vh = innerHeight, sy = scrollY, px = 0, py = 0, tx = 0, ty = 0, queued = false;
const paint = () => {
  queued = false;
  const y = Math.min(sy, vh * 1.1);
  tx += (px - tx) * 0.1; ty += (py - ty) * 0.1;
  for (const l of layers) {
    l.el.style.transform =
      `translate3d(${tx * l.d}px, ${y * (1 - l.s) + ty * l.d}px, 0)`;
  }
  title.style.opacity = Math.max(0, 1 - y / (vh * 0.45));
  if (Math.abs(px - tx) > 0.05 || Math.abs(py - ty) > 0.05) queue();
};
const queue = () => { if (!queued) { queued = true; requestAnimationFrame(paint); } };
addEventListener('scroll', () => { sy = scrollY; queue(); }, { passive: true });
addEventListener('resize', () => { vh = innerHeight; queue(); }, { passive: true });
addEventListener('pointermove', e => {
  px = -(e.clientX / innerWidth - 0.5) * 24;   // ±12px at depth 1
  py = -(e.clientY / innerHeight - 0.5) * 24;
  queue();
}, { passive: true });
```

**2. Ridges that stay low behind the copy.** Generate each ridge as a polyline across a 1440-wide viewBox. Scale the height by x so the left side, where the text sits, stays low and the peaks rise toward the sun on the right. Use a seeded random so the scene is the same on every load.

```js
let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const ridge = (base, amp0, step, f, s) => {
  let d = `M0 840V${base}`;
  for (let x = 0; x <= 1440 + step; x += step) {
    const amp = amp0 * (0.4 + 0.8 * x / 1440);
    const y = base - amp * (0.55 + 0.3 * Math.sin(x * f + s)
      + 0.15 * Math.sin(x * f * 2.7 + s * 3)) + (rnd() - 0.5) * amp * 0.18;
    d += `L${x} ${y.toFixed(1)}`;
  }
  return d + `L${1440 + step} 840Z`;
};
far.setAttribute('d', ridge(610, 190, 30, 0.006, 1.2));
mid.setAttribute('d', ridge(690, 120, 48, 0.004, 4));
```

Trees are narrow triangles, 8–14px half-width and 40–95px tall, placed every 9–19px along a base line at y ≈ 730, plus a solid band from y 722 down.

**3. Why the slow layers move down.** The hero scrolls up at 1.0x with the page. To make a layer look slower, push it down by `scrollY × (1 − speed)`. The sky at 0.1 moves down 0.9 × scrollY, so on screen it barely moves. Clip the hero with `overflow: hidden` so the pushed layers never show below it.

Common mistakes:

- Using `background-attachment: fixed` for the sky. It repaints the whole layer on every frame and breaks on iOS.
- Setting `will-change` on the `main` content. Only the six layers need it.
- Moving the foreground at a speed below 1.0. Then a gap opens between the hill and the next section.
- Letting the far ridge rise behind the lede. The text drops below 4.5:1.
- Reading `getBoundingClientRect()` in the scroll handler. Here the hero always starts at y 0, so `scrollY` is enough.
- Pointer drift on touch screens. It fights the scroll. Gate it with `(pointer: fine)`.
- A purple gradient sky. The sky is slate blue to apricot, nothing else.
- Stars that twinkle. In a grid of twelve pieces they read as noise. Keep them still.

Rebuild order:

1. Draw the static scene first: sky gradient, sun, far ridge, mid ridge, trees, foreground with the tent.
2. Place the title block between the mid ridge and the trees in the stacking order.
3. Add the nav and scroll hint above all layers.
4. Add the content section in `#222a40` and confirm there is no seam at the hero bottom.
5. Add the scroll loop with the six speeds.
6. Add the title fade and hint fade.
7. Add the pointer drift behind the fine-pointer media query.
8. Add the phone rules: hide sun and stars, scale offsets by 0.6.
9. Add the reduced-motion block and test it in devtools.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
