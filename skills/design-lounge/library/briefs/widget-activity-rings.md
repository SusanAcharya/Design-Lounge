<!-- Design Lounge Nº 429 · "Sticker activity rings" · www.designlounge.live -->

# Sticker activity rings

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A daily activity widget for a fictional app called Hoopla, drawn like a sticker: cream card, 2.5px ink border, hard 8px offset shadow, on a sunflower dotted ground. Three concentric rings track Burn (kcal), Hustle (hard minutes) and Rise (hours with movement). They spring-fill on load with a slight overshoot, staggered outside-in. Tapping a ring, or one of three pill buttons, focuses it: the other rings fade to 32%, the chosen ring thickens from 26 to 30, and the panel swaps to its number, a one-line nudge, and 12 hourly bars. A black step-count chip hangs off the card's bottom edge, tilted −3°. The detail worth copying is the overshoot fill plus the thickening on focus; together they make the rings feel like rubber bands.

## Structure

```
1280 × 800, #ffd447 with 22px ink dot grid (12% alpha)
   ┌──────────────────── 760px card, 2.5px ink border, radius 32 ────────────────────┐
   │  ┌──────────────┐    HOOPLA · SATURDAY                         ( ↻ Replay )     │
   │  │   ◯ 126 r    │    ( ● Burn ) ( ● Hustle ) ( ● Rise )   40px pills          │
   │  │   ◯  94 r    │                                                             │
   │  │   ◯  62 r    │    520  / 600 kcal          76px display numeral            │
   │  │  stroke 26   │    80 kcal to close Burn. A brisk 15-minute walk does it.   │
   │  └──────────────┘    ▂▃▅▄▃▂▆█▄▃▂▂   12 bars, 64px tall                        │
   │     300 × 300        7 am          12 pm           6 pm                         │
   └──( ⋮⋮ 8,412 steps )─────────────────────────────────────────────────────────────┘
        chip: ink pill, −3°, overlapping the bottom border by 22px
   8px 8px 0 ink offset shadow
```

- `main.card` is a grid `300px 1fr`, gap 36px, padding 32/36/32/32.
- `.rings` holds one `svg viewBox="0 0 300 300"` (`aria-hidden`): three track circles, three progress circles, three glyph paths. Circles respond to clicks via `pointer-events: stroke`.
- `.side`: top row (`p.eyebrow`, `button.replay`), `div.picker` (`role="group"`, "Choose a ring") with three `button.pick[aria-pressed]`, and `div.detail` (`aria-live="polite"`) containing `.big`, `p.note`, `.hours`, `.hlabels`.
- `p.steps` is absolutely positioned at left 32px, bottom −22px.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Delay | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Ring fill | load, Replay | stroke-dashoffset | C → C × (1 − value/goal) | 1000ms | ease-pop | 0 / 140 / 280ms | instant, no delay |
| Ring focus | select | opacity, stroke-width | 1 → .32 (others); 26 → 30 (chosen) | 160ms / 320ms | standard / ease-pop | — | instant |
| Panel swap | select | opacity, translateY, rotate | 0, 10px, −1° → 1, 0, 0 | 320ms | ease-pop | — | none |
| Number | select, load | text | 0 → value | 900ms | 1 − (1 − t)^3 | — | final value |
| Hour bars | select | height | old → new | 320ms | ease-pop | — | instant |
| Pill press | aria-pressed | translateY, shadow | 0, 3px shadow → 3px, 0 | 160ms | standard | — | instant |

## States

- Pill resting: card fill, 2px ink border, `0 3px 0 ink` shadow. Hover: white fill. Pressed (`aria-pressed="true"`): ink fill, cream text, pushed down 3px, shadow gone, swatch border turns cream.
- Ring focus: `.dim` on the rings wrapper; `.prog.on` keeps opacity 1 and grows to 30.
- Replay: hover white; active nudges 1px down-right.
- Focus-visible on pills and Replay: 3px `--hustle` outline, 3px offset.
- Zero-hour bar: `.zero`, card fill, 8px tall.
- Goal met (value ≥ goal): keep the ring closed, and change the nudge to "Burn closed. Anything more is bonus." Not shown in this demo.

## Accessibility

- The svg is `aria-hidden`; the pills are the accessible controls (`role="group"`, "Choose a ring", `aria-pressed`). Ring clicks are a pointer shortcut for the same action.
- The detail panel is `aria-live="polite"`, so selecting announces the new number, goal and nudge.
- Tab order: Replay, Burn, Hustle, Rise.
- Contrast: ink on cream ≈ 16:1; `#4a463d` ≈ 9:1; `#6b6558` ≈ 5.3:1.
- Pills are 40px tall, Replay ~32px (desktop secondary control).

## Responsive rules

- ≥1024: card 760px, rings 300px.
- 768: card shrinks to `100vw − 40px`; still two columns down to 720px.
- <720: single column, rings `min(260px, 100%)` centred, panel full width, numeral 60px, steps chip centred on the bottom edge, body gets 32px top / 48px bottom padding so the chip and shadow don't clip.
- At 375 wide nothing overflows horizontally; the page may scroll vertically.

## Acceptance checklist

### Always

- [ ] Three concentric rings with round caps and tinted tracks, starting at 12 o'clock.
- [ ] Rings fill on load with an overshooting ease and an outside-in stagger.
- [ ] Each ring is selectable by tapping it and by an accessible toggle button.
- [ ] Selection dims the other rings and thickens the chosen one; selecting it again clears.
- [ ] Panel swaps number, goal, nudge and hourly bars for the chosen ring.
- [ ] A replay control refills the rings.
- [ ] Sticker treatment: 2.5px ink border, hard offset shadow, no blur shadows.
- [ ] Ring colours never used as text colour.
- [ ] Reduced motion removes fills, pops and count-ups.

### This demo

- [ ] Brand "Hoopla · Saturday".
- [ ] Burn 520 / 600 kcal, Hustle 27 / 45 min, Rise 10 / 12 hours.
- [ ] Ring radii 126 / 94 / 62 in a 300 viewBox, stroke 26 (30 when focused).
- [ ] Step chip "8,412 steps", tilted −3°, overlapping the bottom border.
- [ ] Nudge for Burn: "80 kcal to close Burn. A brisk 15-minute walk does it."

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: rings empty, Burn selected (pill pressed), panel shows Burn with the number counting up.
2. Two frames after load, rings fill: Burn → 87% (520/600), Hustle → 60% (27/45), Rise → 83% (10/12). Delays 0 / 140 / 280ms, each 1000ms on `cubic-bezier(.34,1.56,.64,1)` (overshoots then settles).
3. The panel number counts 0 → value over 900ms (cubic ease out) with thousands separators.
4. Click a pill (Burn / Hustle / Rise) or click on a ring's stroke or track: that ring is selected and focused. Non-selected progress strokes go to opacity .32; the selected one goes to stroke-width 30.
5. The panel replays a 320ms pop: from opacity 0, translateY 10px, rotate −1° to rest, on the springy easing. Number counts up again from 0.
6. Hourly bars (7 am → 6 pm, 12 bars) animate to the new heights (320ms, springy). Hours with zero activity show an empty outlined stub (8px tall, card fill).
7. Selecting the already-focused ring again clears focus: all rings back to full opacity and 26 stroke.
8. Replay (top-right of the panel) empties the rings with no transition, then refills with the stagger, and clears focus.
9. Each ring has a white glyph at 12 o'clock inside the stroke: flame (Burn), bolt (Hustle), up arrow (Rise).

## Tokens

```css
:root {
  --bg: #ffd447;        /* sunflower ground */
  --card: #fff7e4;      /* sticker */
  --ink: #1b1a17;       /* border, text, shadow */
  --ink-2: #4a463d;
  --ink-3: #6b6558;
  --burn: #ff5b3a;   --burn-t: #ffd9cd;
  --hustle: #2f5bff; --hustle-t: #d5ddff;
  --rise: #13b07a;   --rise-t: #c6eedc;
  --display: "Bowlby One", "Arial Black", sans-serif;
  --sans: "Outfit", system-ui, sans-serif;
  --r-card: 32px; --r-pill: 999px; --r-bar: 5px 5px 2px 2px;
  --border: 2.5px solid var(--ink);
  --shadow: 8px 8px 0 var(--ink);
  --ring-stroke: 26px; --ring-stroke-on: 30px;
  --ring-r: 126px 94px 62px;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease-pop: cubic-bezier(.34, 1.56, .64, 1);
  --t-micro: 160ms; --t-swap: 320ms; --t-fill: 1000ms; --stagger: 140ms;
}
```

Spacing runs 4 / 8 / 12 / 16 / 20 / 32 / 36. Ring colours appear only in strokes, swatches, bars and the highlighter under the nudge, never as text colour.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Panel number | Bowlby One | 76px | 400 | .95 | −0.01em | tabular nums |
| Goal "/ 600 kcal" | Outfit | 20px | 600 | 1 | 0 | — |
| Eyebrow | Outfit | 12px | 700 | 1 | 0.16em | uppercase |
| Pill label | Outfit | 15px | 600 | 1 | 0 | — |
| Nudge | Outfit | 16px | 400, strong 700 | 1.45 | 0 | max 34ch |
| Hour labels | Outfit | 12px | 500 | 1 | 0 | — |
| Steps number | Bowlby One | 16px | 400 | 1 | 0.02em | — |

## Implementation notes

**Dash maths.** Rotate each progress circle −90° around the centre so it starts at the top, set `stroke-dasharray` to its circumference, and animate `stroke-dashoffset`.

```js
const circ = r => 2 * Math.PI * r;
progs.forEach((p, i) => {
  const C = circ(RINGS[i].r);
  p.style.strokeDasharray = C;
  p.style.strokeDashoffset = C;               // empty
});
function fill() {
  progs.forEach((p, i) => {
    const R = RINGS[i], C = circ(R.r);
    p.style.transitionDelay = `${i * 140}ms`;
    p.style.strokeDashoffset = C * (1 - R.val / R.goal);
  });
}
requestAnimationFrame(() => requestAnimationFrame(fill)); // let the empty state paint
```

```css
.prog { stroke-linecap: round; transform: rotate(-90deg); transform-origin: 150px 150px;
  transition: stroke-dashoffset 1000ms cubic-bezier(.34,1.56,.64,1), opacity 160ms, stroke-width 320ms cubic-bezier(.34,1.56,.64,1); }
.dim .prog { opacity: .32; }
.dim .prog.on { opacity: 1; stroke-width: 30; }
```

**Replay without a flash.** To restart, set `transition: none`, reset offsets, force layout (`svg.getBoundingClientRect()`), clear the inline transition, then fill on the next frame.

**Click targets on rings.** `pointer-events: stroke` on both track and progress circles makes the 26px band clickable and the gaps between rings inert. Put `data-i` on each circle and read it in one delegated listener.

Common mistakes:

- Copying the red/green/blue of a famous watch. These are tomato, cobalt, mint on cream, and the names are Burn, Hustle, Rise.
- Using the overshoot easing on the pill press; that should be crisp.
- Soft blurred shadows; the sticker look needs a hard offset.
- Rendering ring colours as text (tomato on cream fails contrast).
- Forgetting that a ring above 100% needs a second lap; this demo stays under goal.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
