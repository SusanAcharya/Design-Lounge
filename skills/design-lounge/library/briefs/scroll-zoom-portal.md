<!-- Design Lounge Nº 396 · "Scroll zoom portal" · www.designlounge.live -->

# Scroll zoom portal

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The opening of a fictional architecture festival site, Open House Kreis. The hero is the word OPEN drawn from flat shapes: a red ring O with a small yellow centre, and P, E, N in blue. Scrolling scales the whole hero around the centre of the O. The yellow centre grows until it covers the screen, about 25–30 times its size. That yellow is the background of the next section, so you have gone through the O into the programme. A headline fades up on the yellow, the pin ends, and the venue list scrolls in as normal content.

The detail worth copying: the scale target is worked out from the real geometry. On resize, measure the centre of the hole and its radius, then compute the scale that makes the circle reach the farthest corner of the screen. It always ends exactly full, at any size.

## Structure

```
1280 × 800, section 300vh, stage sticky 100vh
┌──────────────────────────────────────────────────────────────┐
│ ● KREIS          Programme  Map  Volunteer       [FREE PASS] │ nav 64px, 3px rule
│                                                          ▲   │ yellow triangle
│   ┌────────┐  ┌──┐   ┌────┐  ┌─┐  ┌─┐                        │
│  /  ring   \  │P ●)  │E── │  │N\  │ │   word svg             │
│ │   ( ● )  │  │  /   │E─  │  │ \\ │ │   1100 × 380 viewBox   │
│  \  red    /  │ │    │E── │  │  \\│ │   hole centre 190,190  │
│   └────────┘  └─┘    └────┘  └─┘  └─┘   hole radius 46       │
│ ──────────────────────────────────────────────────────────── │ 3px blue rule
│ House Weekend      17–18 October 2026   42 buildings · free  │ meta 22px/800
│◣                                                        ■    │
│                    ● SCROLL TO STEP INSIDE                   │
└──────────────────────────────────────────────────────────────┘
.after (absolute, yellow, opacity 0 → 1): kicker + h2 bottom-left, padding 0 72px 72px
then: programme (yellow), footer (blue)
```

- `section.pin` (300vh) holds `div.stage` (`position: sticky; top: 0; height: 100vh; overflow: hidden`).
- `div.zoom` is the scaled layer: the word SVG, the meta row and the three shapes. It gets `transform-origin` in px at the hole centre.
- The word is one inline SVG. The O is one path with `fill-rule="evenodd"` (outer r 180, inner r 46) and a yellow circle r 46 behind the hole. P, E and N are one path each, so no seams appear between pieces.
- The hint is outside `.zoom`, so it never scales.
- `div.after` sits above `.zoom`, `position: absolute; inset: 0`, yellow, with the kicker and `h2` inside a `.lift` wrapper.
- The `h1` "Open House Kreis" is visually hidden. The SVG is `aria-hidden`.
- The programme is a `section` with an `ol` of six `li`. Each row has a 5-column grid: 56px number, 40px shape, name, 160px place, 220px times.

## Motion

| Thing | Trigger | Property | From → to | Timing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Hero layer | progress 0.04 → 0.70 | scale (origin: hole centre) | 1 → S (≈27) | `S^smoothstep(t)` | scale 1 |
| Yellow cover | progress 0.62 → 0.72 | opacity | 0 → 1 | smoothstep | static block |
| Headline block | progress 0.72 → 0.90 | opacity | 0 → 1 | smoothstep | visible |
| Headline block | progress 0.72 → 0.90 | translateY | 32px → 0 | smoothstep | 0 |
| Hint | progress 0 → 0.05 | opacity | 1 → 0 | linear | visible |
| Hint dot | loop | translateY | 0 → 6px → 0 | 1600ms `--ease` | still |
| Buttons, links | hover | background, underline | see States | instant | instant |

No easing curve on the scroll itself. Scroll is already the user's own speed. Shape the zoom only with the geometric scale and smoothstep.

## States

- Nav link hover: 3px underline, offset 6px.
- "Free pass" button: blue fill, cream text, 40px tall. Hover: red fill.
- "See all 42 buildings": blue fill, yellow text, 3px blue border, 52px tall. Hover: red fill, red border, cream text.
- "Get the paper map": 3px blue border on yellow. Hover: cream fill.
- Focus-visible everywhere: 3px solid red outline, offset 3px. On yellow, red on `#f2b630` still reads as a clear ring.
- Venue rows have no hover. They are information, not links.
- Loading: the word is SVG, so it is there before the font. After fonts load, measure again, because the meta row height moves the word.

## Accessibility

- One `h1`, visually hidden: "Open House Kreis". The SVG word is `aria-hidden`. The meta row is real text.
- The portal headline is an `h2`. It is in the DOM from the start, so a screen reader reads it in order even before it fades in.
- The hint is `aria-hidden`.
- Nav is labelled "Main". Tab order: logo, links, Free pass, then the programme buttons.
- Contrast: blue `#1d3b8c` on cream `#f2ebdd` is about 9:1. Blue on yellow `#f2b630` is about 5.6:1. Red `#d9402b` on cream is about 3.9:1, so red is used only for 15px+ bold caps and for large text.
- The shapes in the venue list are `aria-hidden`. The footer says what each shape means, so the shapes are not the only signal and the list still makes sense without them.
- Hit targets: buttons 40–52px tall. Nav links get 8px vertical padding.
- Reduced motion removes the pin, the zoom and the hint loop. Everything shows in normal flow.

## Responsive rules

- ≥ 1280: as specified. The word is capped at 1136px wide. Stage padding 96px 72px 48px.
- 1024: the word scales with its container. S goes up because the hole gets smaller. The measuring code handles it.
- ≤ 900: nav links hide. Venue rows go to three columns: number, shape, then name with place and times stacked under it.
- < 640: shorter pin, 250vh, so the zoom takes about 1.6 screens of scroll. Stage padding 88px 20px 40px. The meta row stacks in three lines at 18px. The triangle shrinks to 36×32 and the square hides. The buttons stack. The headline clamps to 44px.
- Very wide screens: the word stays at 1136px and centred. S is computed from the farthest corner, so the zoom still fills the full width.
- Never let the page scroll sideways. `overflow-x: clip` on the body and `overflow: hidden` on the stage. At 27x the hero is far larger than the screen.

## Acceptance checklist

### Always

- [ ] One section is pinned with sticky positioning. The zoom runs inside it and normal content follows.
- [ ] The zoom is a `transform: scale()` on one layer, with `transform-origin` at the portal centre in px.
- [ ] The final scale is computed from the hole radius and the distance to the farthest corner. It is not a magic number.
- [ ] Measurement happens on load, on resize and after fonts load. It never happens in the scroll handler.
- [ ] The portal colour equals the next section's background. No seam when the pin ends.
- [ ] Scale is geometric (`S^t`), so the zoom speed feels even.
- [ ] Only `transform` and `opacity` change per frame. The scroll listener is passive and paints in rAF.
- [ ] Each letter is a single path, so no hairline seams show between rectangles.
- [ ] Reduced motion shows the hero, the headline and the list with no pin and no zoom.
- [ ] Visible focus rings. No horizontal scroll at any width.

### This demo

- [ ] The word is OPEN: red O ring (outer r 180, hole r 46, centre 190,190 in a 1100×380 viewBox), P, E, N in `#1d3b8c`.
- [ ] Palette is only `#f2ebdd`, `#1d3b8c`, `#d9402b`, `#f2b630`.
- [ ] The meta row reads "House Weekend", "17–18 October 2026", "42 buildings · free entry".
- [ ] The portal headline is "Forty-two rooms you are never let into." with the kicker "Two days · every door unlocked".
- [ ] Six venues are listed, starting with Tannenhof Water Tower (1928, Altstadt).

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame (progress 0): fixed 64px cream nav with a 3px blue bottom rule: red dot + "KREIS", three links, a blue "Free pass" button. In the middle of the screen, OPEN spans up to 1136px wide and about 390px tall. Under it a 3px blue rule and a meta row: "House Weekend", "17–18 October 2026" in red, "42 buildings · free entry". A yellow triangle sits top-right, a blue quarter circle bottom-left, a red square bottom-right. "Scroll to step inside" with a bobbing red dot sits 28px from the bottom.
2. The section is 300vh with a 100vh sticky stage. Progress = (scrollY − section top) / (section height − viewport height), clamped 0–1. At 1280×800 that is 1600px of scroll.
3. 0 → 0.05: the hint fades out.
4. 0.04 → 0.70: the hero layer scales from 1 to S around the centre of the O. The scale is geometric: `scale = S ^ t`, with t = smoothstep of that range. Geometric scale makes the zoom feel steady instead of slow then sudden.
5. S = 1.12 × (distance from hole centre to the farthest stage corner) / (hole radius). At 1280×800 this is about 27. On a 390-wide phone it is about 40.
6. 0.62 → 0.72: a yellow panel above the hero fades from 0 to 1. By then the hole already fills the screen, so you see no change. It hides any soft edge left from scaling.
7. 0.72 → 0.90: the headline block fades in and rises 32px → 0. Kicker "Two days · every door unlocked" in red, headline "Forty-two rooms you are never let into." in blue, bottom-left.
8. 0.90 → 1.00: hold. Then the pin ends and the sticky stage scrolls up. The programme section below is the same yellow, so there is no seam.
9. Programme: a 3px blue rule, a label "Saturday and Sunday highlights" and a short paragraph, then six venues, each with a number, a shape (circle tower, square house, triangle hall), name, year and district, and opening times. Then two buttons and a blue footer.
10. Scrolling back up runs the zoom out in reverse.
11. Reduced motion: no pin and no zoom. The hero shows at rest, then a yellow block with the kicker and headline, then the programme.

## Tokens

```css
:root {
  --cream: #f2ebdd;   /* page, nav */
  --blue: #1d3b8c;    /* ink, P E N, rules, buttons */
  --red: #d9402b;     /* O ring, date, kicker, focus */
  --yellow: #f2b630;  /* hole, next section */
  --ink: var(--blue);

  --sans: "League Spartan", system-ui, sans-serif;

  --text-h2: clamp(44px, 7.2vw, 104px);
  --text-h3: 28px;
  --text-meta: 22px;
  --text-body: 18px;
  --text-small: 15px;
  --text-label: 13px;

  --space-2: 16px; --space-3: 24px; --space-5: 40px; --space-9: 72px;
  --rule: 3px;
  --radius: 0;

  --ease: cubic-bezier(.2, .7, .2, 1);
  --hint-loop: 1600ms;

  --pin: 300vh;
  --zoom-start: .04; --zoom-end: .70;
  --cover-start: .62; --cover-end: .72;
  --lift-start: .72; --lift-end: .90;
  --hole-cx: 190; --hole-cy: 190; --hole-r: 46;   /* in SVG units */
}
```

Three colours and cream. No black, no grey. Text is the blue.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Word OPEN | drawn in SVG | 380 units tall | — | — | — | Upper |
| Portal headline | League Spartan | 104px (clamp 44–104) | 800 | 0.92 | -0.02em | Sentence, max 13ch |
| Kicker | League Spartan | 15px | 800 | 1.2 | 0.16em | Upper, red |
| Meta row | League Spartan | 22px | 800 | 1.1 | 0 | Title |
| Venue name | League Spartan | 28px | 800 | 1.05 | 0 | Title |
| Venue place | League Spartan | 15px | 600 | 1.3 | 0 | Title |
| Venue times | League Spartan | 16px | 400 | 1.3 | 0 | Title, right-aligned |
| Body | League Spartan | 18–19px | 400 | 1.45 | 0 | Sentence, max 44ch |
| Nav link | League Spartan | 16px | 600 | 1 | 0 | Title |
| Button | League Spartan | 15–16px | 800 | 1 | 0.06em | Upper |
| Hint | League Spartan | 13px | 600 | 1 | 0.16em | Upper |

League Spartan sits low in its box. Add 4px top padding to buttons so caps look centred.

## Implementation notes

**1. Measure the portal, then compute the cover scale.** Remove the transform before you measure, or the rects come back scaled.

```js
const measure = () => {
  zoom.style.transform = 'none';
  top = pin.offsetTop;
  len = Math.max(1, pin.offsetHeight - innerHeight);
  const z = zoom.getBoundingClientRect();
  const w = word.getBoundingClientRect();
  const f = w.width / 1100;                     // SVG units to px
  const cx = w.left - z.left + 190 * f;
  const cy = w.top - z.top + 190 * f;
  const r = 46 * f;
  zoom.style.transformOrigin = `${cx}px ${cy}px`;
  const D = Math.hypot(Math.max(cx, z.width - cx), Math.max(cy, z.height - cy));
  S = 1.12 * D / r;                             // 12% margin past the corner
};
```

**2. The frame.** Geometric scale with smoothstep. Then the cover and the headline.

```js
const smooth = t => t * t * (3 - 2 * t);
const seg = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
function paint() {
  const p = seg(sy - top, 0, len);
  const t = smooth(seg(p, .04, .70));
  zoom.style.transform = `scale(${Math.pow(S, t)})`;
  after.style.opacity = smooth(seg(p, .62, .72));
  const l = smooth(seg(p, .72, .90));
  lift.style.opacity = l;
  lift.style.transform = `translateY(${(1 - l) * 32}px)`;
  hint.style.opacity = 1 - seg(p, 0, .05);
}
```

**3. Keep it sharp.** Do not put `will-change: transform` on the zoom layer. With it, the browser draws the layer once at scale 1 and stretches the bitmap, so the ring edge goes soft at 10x. Without it, the browser redraws the vector shapes at each scale and edges stay crisp. The scene is a few flat paths, so redraws are cheap.

Common mistakes:

- Using the letter O from a font as the portal. You cannot know the hole centre without measuring glyph outlines. Draw it.
- Building P, E and N from separate rectangles. Anti-aliasing shows thin lines where they touch. Use one path per letter.
- Linear scale from 1 to 27. The first half of the scroll barely moves and the end rushes. Use `S^t`.
- Animating `clip-path` or `width` to grow the hole. It triggers paint or layout per frame. Scale one layer.
- Scaling the nav or the hint with the hero. Keep them outside the zoom layer.
- A rainbow of colours for the letters. Three colours and cream: red O, blue letters, yellow hole.
- Forgetting to re-measure after fonts load. The meta row height changes and the word moves a few px, so the zoom drifts off the hole.

Rebuild order:

1. Draw the OPEN SVG and the static hero. Check the first frame.
2. Add the 300vh section with a sticky 100vh stage.
3. Add measure and set `transform-origin` at the hole centre.
4. Add the geometric zoom and check the hole fills the screen at progress 0.70.
5. Add the yellow cover and the headline block.
6. Add the yellow programme section and confirm there is no seam when the pin ends.
7. Add the phone rules and the 250vh pin.
8. Add the reduced-motion layout.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
