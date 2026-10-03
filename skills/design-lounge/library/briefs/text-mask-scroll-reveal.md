<!-- Design Lounge Nº 304 · "Text mask scroll reveal" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Text mask scroll reveal

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The opening of a site for Kiln, a motion studio in Lisbon. The page is black. The studio name KILN fills the middle at 26vw in Archivo Black Expanded, and the letters are windows onto a looping CSS-drawn sunset: an orange sky, an amber striped sun, a crimson ridge, a black ridge and dashed light on black water, all drifting. As you scroll, the word scales up around the centre of its I. The I grows until it covers the screen, so the scene fills the frame. Then the next headline, "Title sequences and brand films for things that need to move first.", rises over the scene in black. The detail worth copying is the knockout: a black layer with white text, set to `mix-blend-mode: multiply` over the scene, so the mask is a normal text element you can scale with `transform`.

This is not `footer-giant-wordmark-reveal`, where letters rise out of an edge. It is not `hero-flashlight-reveal`, where a cursor spotlight reveals a layer. Here the word is the mask, and scale is the reveal.

## Reference behaviour

1. Initial state, scroll 0, 1280×800: black page. Fixed top bar: "KILN" logo on the left, "Work Studio Contact" in 12px mono on the right, bone colour. KILN at 26vw (333px) is centred, the scene moving inside the letters. The sun sits behind the I and L. Bottom row: "Motion & title design / Lisbon, since 2014" left, a down arrow and "Scroll" centre, "212 films / 9 people, one kiln" right.
2. The scene loops all the time: the sun rises 4vmin and back every 18s, the crimson ridge drifts one tile left every 64s, the black ridge every 30s, and three dashed light bands every 7s, 4.5s and 3s.
3. The section is a 420vh runway. The stage inside is `position: sticky; top: 0; height: 100vh; overflow: hidden`.
4. Progress `t` runs 0 to 1 over the runway's 320vh of travel.
5. t 0 to 0.06: the bottom row fades out.
6. t 0.04 to 0.60: the knockout scales from 1 to `maxScale` with a cubic ease-in on the exponent. It grows slowly at first, then rushes. The transform origin is the centre of the I, so the I stays under the viewer's eye and swallows the screen.
7. By t 0.58 the I covers the whole viewport, so the frame shows the full scene. t 0.58 to 0.64: the knockout fades to opacity 0, then gets `visibility: hidden`. This step is invisible, because white over the scene in multiply already shows the scene.
8. t > 0.5: the top bar text turns black so it reads on the orange sky.
9. t 0.64 to 0.82: the next headline block fades in and rises 48px, with a cubic ease-out. It holds from 0.82 to 1.
10. After the runway, a black "Selected work" section scrolls up over the end of the scene: four numbered rows with title and type, then a big email link with a 4px orange underline. The top bar turns back to bone.
11. Scrolling back up runs everything in reverse.
12. With reduced motion: no pinning, no scaling. The word shows as solid amber on black for one screen. The scene follows below it as a still picture, with the headline already on it.

## Structure

```
1280 × 800, sticky stage, runway 420vh
┌──────────────────────────────────────────────────────────────┐
│ KILN                                  WORK  STUDIO  CONTACT   │ fixed bar, 22px 48px
│                                                              │
│                                                              │
│          ██╗ ██ ██  ██     ██╗   ██                          │
│          K       I        L       N      26vw, scene inside  │
│                                                              │
│                                                              │
│ MOTION & TITLE DESIGN        ↓ SCROLL          212 FILMS     │ hero meta, 32px from bottom
└──────────────────────────────────────────────────────────────┘

layers inside .stage (bottom to top):
  .scene   sky, sun, 2 ridges, ground, .over headline (z 1 inside)
  .knock   #000 background, #fff word, mix-blend-mode: multiply (z 2)
  .hero-meta (z 3)
then: section.work (black), list + email
```

- The bar is a `header` with a logo link and a `nav` labelled "Main". It is fixed, z-index 5, above everything.
- `section.runway` has `aria-label="Kiln intro"`. The stage is a `div` with `isolation: isolate`, so the blend only mixes with the scene.
- The scene is decorative and `aria-hidden`, except `.over`, which holds real copy: a mono eyebrow, an `h2`, and a `ul` of four services.
- The knockout is `aria-hidden`. A visually hidden `h1` reads "Kiln, a motion studio in Lisbon".
- The I is wrapped in `span#stem` so JS can measure it.
- The ridges are inline SVGs, 200% wide, each path holding two identical periods so a −50% translate loops.

## Tokens

```css
:root {
  /* colour */
  --black: #000;        /* page and knockout. Must be pure black for multiply */
  --bone: #f4ede4;      /* text on black */
  --bone-2: #a89f94;    /* secondary text on black */
  --line: #2a2522;      /* row rules */
  --flame: #ff5b14;     /* sky */
  --sun: #ffb21e;       /* sun, light bands, reduced-motion word */
  --ember: #b3122e;     /* far ridge, light bands */
  --focus: #ffb21e;

  /* type */
  --grot: "Archivo", system-ui, sans-serif;   /* wdth 100 and 125 */
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --size-word: 26vw;
  --size-over: clamp(30px, 4.6vw, 64px);
  --size-work: clamp(22px, 3vw, 40px);
  --size-mail: clamp(24px, 4vw, 52px);
  --size-label: 12px;

  /* space */
  --pad-x: clamp(20px, 4vw, 48px);
  --space-1: 8px; --space-2: 16px; --space-3: 24px; --space-4: 56px; --space-5: 96px;

  /* scroll */
  --runway: 420vh;

  /* motion */
  --ease: cubic-bezier(.16, 1, .3, 1);
  --std: cubic-bezier(.2, .7, .2, 1);
  --sun-cycle: 9s;      /* one way, alternate */
  --ridge-far: 64s;
  --ridge-near: 30s;
  --band-1: 7s; --band-2: 4.5s; --band-3: 3s;
}
```

## Typography

| Role | Family | Size | Weight / width | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Mask word | Archivo | 26vw (28vw under 640px) | 900, `font-stretch: 125%` | 0.74 | -0.045em | Upper |
| Logo | Archivo | 18px | 900, 125% | 1 | -0.02em | Upper |
| Next headline | Archivo | clamp(30px, 4.6vw, 64px) | 900, 125% | 0.98 | -0.03em | Sentence, max 15em |
| Service chip | Archivo | 13px | 700, 100% | 1.2 | 0.04em | Upper, 2px border |
| Work title | Archivo | clamp(22px, 3vw, 40px) | 800, 125% | 1.05 | -0.02em | Sentence |
| Email | Archivo | clamp(24px, 4vw, 52px) | 900, 125% | 1.1 | -0.03em | Lower, 4px flame underline |
| Labels, nav, meta | IBM Plex Mono | 12px | 500 | 1.5 | 0.08em | Upper |

Load Archivo with the width axis: `family=Archivo:wdth,wght@100,500;100,700;125,800;125,900`. Without the expanded cut the I is too thin to fill the screen at a sane scale.

## Motion

| Thing | Trigger | Property | From → to | Timing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Knockout scale | scroll t 0.04–0.60 | transform scale | 1 → maxScale | `maxScale ^ (x³)`, scrubbed | None, static |
| Knockout fade | scroll t 0.58–0.64 | opacity, then visibility | 1 → 0, hidden | Linear in t | Always visible |
| Hero meta | scroll t 0–0.06 | opacity | 1 → 0 | Linear in t | Visible |
| Next headline | scroll t 0.64–0.82 | opacity, translateY | 0, 48px → 1, 0 | Cubic ease-out in t | Visible, still |
| Top bar colour | t > 0.5 inside runway | color | bone → black | 300ms standard | No transition |
| Sun | always | translateY | 0 → −4vmin | 9s ease-in-out, alternate | Still |
| Far ridge | always | translateX | 0 → −50% | 64s linear loop | Still |
| Near ridge | always | translateX | 0 → −50% | 30s linear loop | Still |
| Light bands | always | translateX | 0 → −50% | 7s, 4.5s, 3s linear loops | Still |
| Scroll arrow | always | translateY | 0 → 4px → 0 | 1.6s standard | Hidden |
| Work row hover | hover | color | bone → sun | 160ms standard | Same |

Linear easing is used only for the endless drifts. Every scrubbed value is eased in JS.

## States

- Hero (t = 0): word at scale 1, meta visible, headline hidden, bar bone.
- Zooming (0.04 < t < 0.6): word growing, meta gone.
- Revealed (t > 0.64): knockout hidden, scene full frame, headline in, bar black.
- Past the runway: work section over the scene, bar back to bone.
- Hover on a work row: title and meta turn `--sun`. Hover on the email: text turns `--flame`.
- Hover on nav links: underline, 4px offset.
- Focus-visible: 2px amber outline, 3px offset, on logo, nav links, rows and email.
- No loading or error state. The scene is pure CSS and SVG.

## Accessibility

- The big word is decoration, so the knockout is `aria-hidden`. The page `h1` is a hidden "Kiln, a motion studio in Lisbon".
- The next headline is a real `h2`, in the DOM from the start, read in order even while it is at opacity 0.
- Services are a `ul` labelled "Services". The work list is an `ol`.
- Nav is labelled "Main". Every link has a visible name.
- Keyboard scroll works as normal. Nothing intercepts wheel or key events.
- Contrast: `#f4ede4` on `#000` is about 18:1. Black on `#ff5b14` is about 7:1. `#a89f94` on black is about 8:1.
- The moving scene stays inside the letters and calm loops. Reduced motion stops every loop.
- Do not autoplay sound. There is none.

## Responsive rules

- ≥1280: word 26vw, about 333px. maxScale is computed, about 30.
- 1024: word about 266px. Same timings. The headline wraps to 3 lines.
- 768: word about 200px. Bar keeps all three links.
- <640: word 28vw. Nav shows only Contact. The left hero meta hides. Work rows drop the year column (36px number column). The headline is 30px and wraps to 4 lines. The chips wrap to two rows.
- Tall phones: maxScale grows because the I must cover more height. The formula handles it. Do not hard-code 30.
- Recompute the origin and maxScale on `resize` and after `document.fonts.ready`. The I moves when the font arrives.
- Never overflow sideways: the stage has `overflow: hidden`, the ridges and bands are inside it.

## Acceptance checklist

### Always

- [ ] The mask is real text in a black layer with `mix-blend-mode: multiply` over the scene, inside a parent with `isolation: isolate`.
- [ ] The knockout black is pure `#000`. No ghost of the scene shows through the black.
- [ ] The word scales with `transform` only, around a point inside one solid stroke, until that stroke covers the viewport.
- [ ] The scale curve is exponential with an ease-in, so the first half feels slow and the end rushes.
- [ ] The knockout fades and hides after the screen is covered, before the next headline appears.
- [ ] The next headline is in the DOM, readable, and fades in over the scene.
- [ ] The stage is sticky inside a runway about 4 times the viewport height.
- [ ] One passive scroll listener, one rAF per frame, one rect read per frame.
- [ ] Reduced motion: static word, still scene below it, headline visible, no pinning.
- [ ] Focus ring visible on every link.

### This demo

- [ ] The word is KILN in Archivo 900 at 125% width, 26vw, line-height 0.74.
- [ ] The zoom origin is the centre of the I.
- [ ] Scene colours: sky `#ff5b14`, sun `#ffb21e`, far ridge `#b3122e`, near ridge and water `#000`.
- [ ] The headline reads "Title sequences and brand films for things that need to move first."
- [ ] The work list shows Salt Year, Tramline 28, Orla Ferries and The Long Kitchen, then fire@kiln.studio.

## Implementation notes

**1. The knockout layer.** White text multiplied over the scene shows the scene. Black multiplied over anything stays black. So you never need `background-clip: text` on a moving DOM scene, and you never need an SVG mask with a font that the SVG cannot load.

```css
.stage { position: sticky; top: 0; height: 100vh; overflow: hidden; isolation: isolate; }
.scene { position: absolute; inset: 0; background: var(--flame); }
.knock {
  position: absolute; inset: 0; z-index: 2;
  background: #000; color: #fff; mix-blend-mode: multiply;
  display: grid; place-items: center;
}
.word { margin: 0; font: 900 26vw/.74 var(--grot); font-stretch: 125%; letter-spacing: -.045em; }
```

`background-clip: text` only clips a background image, so the scene would have to be gradients on the text itself. That rules out SVG ridges and separate animated layers. Use multiply.

**2. Origin and max scale.** Measure the I with no transform, then set the origin to its centre. The span's box includes side bearings, so the solid stem is about 30% of its width and 50% of its line box height.

```js
function measure() {
  knock.style.transform = 'none';
  const k = knock.getBoundingClientRect();
  const s = stem.getBoundingClientRect();
  knock.style.transformOrigin = `${s.left + s.width * .47 - k.left}px ${s.top + s.height * .5 - k.top}px`;
  maxScale = Math.max(innerWidth / (s.width * .3), innerHeight / (s.height * .5)) * 1.3;
}
document.fonts.ready.then(measure);
addEventListener('resize', measure);
```

**3. The scroll mapping.** One normalised `t`, then small sub-ranges.

```js
const span = (t, a, b) => clamp((t - a) / (b - a));
const t = clamp(-runway.getBoundingClientRect().top / (runway.offsetHeight - innerHeight));
const grow = Math.pow(span(t, .04, .6), 3);
knock.style.transform = `scale(${Math.exp(Math.log(maxScale) * grow)})`;
knock.style.opacity = 1 - span(t, .58, .64);
knock.style.visibility = t > .64 ? 'hidden' : '';
meta.style.opacity = 1 - span(t, 0, .06);
const o = 1 - Math.pow(1 - span(t, .64, .82), 3);
over.style.opacity = o;
over.style.transform = `translateY(${(1 - o) * 48}px)`;
```

A linear scale from 1 to 30 looks like nothing happens, then a jump. The exponent makes each scroll step feel like the same zoom.

**4. Looping ridges.** Draw two identical periods in one path, make the SVG 200% wide, and translate it by −50%.

```html
<svg class="ridge far" viewBox="0 0 2400 200" preserveAspectRatio="none">
  <path fill="currentColor" d="M0 120c150-60 300-60 450-20s300 60 450 10 200-40 300 10
    c150-60 300-60 450-20s300 60 450 10 200-40 300 10V200H0z"/>
</svg>
```

Common mistakes:

- A near-black like `#0d0b0a` for the knockout. Multiply then lets the sun show through as a brown ghost.
- Forgetting `isolation: isolate`. The blend then mixes with the page behind the stage.
- Zooming around the centre of the screen. The origin lands between letters and the screen goes black, not orange.
- Setting `will-change: transform` on the knockout. The browser rasterises the word at scale 1 and the edges go soft as it grows.
- Measuring the I before the web font loads. The origin ends up in the K.
- Fading the headline in before the knockout is gone. The headline is under the black layer and reads as a dark smudge.
- A 2-colour sky gradient with a purple top. The scene is three warm tones on black. Nothing else.
- Pinning without a reduced-motion path. Reduced motion must still show the word and the scene.

Where it sits:

1. It is the first screen of a studio, venue or city site. Use it once.
2. The word must have one solid vertical stroke: I, L, H, T, E, N, M all work. A word of only round letters (OCO) needs the origin inside a stroke of the O, which does not cover a wide screen.
3. Keep the word to 3 to 6 letters so 26vw fits the width.
4. The section after it should be black, so the end of the scene meets the page colour.

Rebuild order:

1. Build the still scene: sky, sun, ridges, ground. Check it at full frame.
2. Add the loops.
3. Add the knockout layer with multiply and check the letters show the scene.
4. Add the runway and sticky stage.
5. Measure the I and wire the scale.
6. Add the fade, the headline and the bar colour switch.
7. Add the work section.
8. Add reduced motion and check 390px wide.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
