<!-- Design Lounge Nº 144 · "Split letter wave" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Split letter wave

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The hero of a fictional summer motion-design camp, "Sundae Club". The two-line headline "Make things / that wiggle." is split into one span per letter; on load each letter rises from 0.7em below its baseline, tilted 10°, and springs past its resting position before settling, with a 34ms stagger so the wave sweeps left to right across both lines. Hovering (or focusing) any single word replays a smaller "hop" on that word only. The feeling is a bouncy, confident toy: big soft letterforms on saturated cobalt. The detail worth copying is the two-layer letter span, which lets the entrance and the hover hop run on separate elements so they never cancel each other.

## Reference behaviour

1. Initial state: cobalt page, nav at top, eyebrow "Summer motion camp · Lisbon", headline animating in, lede and two CTAs below, an info bar along the bottom.
2. On load, 21 letters animate in sequence. Letter `n` starts at `120ms + n × 34ms`; each takes 820ms. The last letter lands at about 1.62s.
3. Each letter: opacity 0 → 1 over its first 35%, travels from `translateY(.7em) rotate(10deg) scale(.9)` up past rest to `translateY(-.1em) rotate(-3deg) scale(1.02)` at 70%, then settles at rest.
4. The word "wiggle." is pink (`--pink`); the other three words are cream.
5. Hovering any word (mouseenter) restarts a 520ms hop on that word's letters, 28ms stagger per letter within the word: up 0.22em with −6° tilt, down past rest by 0.04em with +2°, then rest.
6. Re-hovering mid-hop restarts the hop cleanly from the first letter.
7. Each word is focusable (`tabindex="0"`); focusing it triggers the same hop and shows a 3px pink ring.
8. Clicking "Replay" in the bottom bar restarts the full entrance wave.
9. A 140px cream starburst sticker reading "No. 04" sits top-right, rotated 12°, slowly spinning (one turn per 24s).
10. Pink "Get tickets" / "Apply by 30 May" buttons lift 2px and tilt −2° on hover.

## Structure

```
1280 × 800, 56px side padding
┌──────────────────────────────────────────────────────────────────────┐
│ (~) Sundae Club            Programme Mentors Venue FAQ [Get tickets] │ 76px nav, hairline below
├──────────────────────────────────────────────────────────────────────┤
│ ── SUMMER MOTION CAMP · LISBON                              ✷ No.04  │ sticker 140px, rot 12°
│ Make things                                                          │ 192px / .92
│ that wiggle.                                                         │ "wiggle." pink
│                                                                      │
│ Five days of animation, type…        [Apply by 30 May] [See schedule]│ lede 440px max
├──────────────────────────────────────────────────────────────────────┤
│ 14–18 July 2026  LX Factory  €640 early bird  Hover a word…  (Replay)│ 64px bar, hairline above
└──────────────────────────────────────────────────────────────────────┘
```

- `.wrap`: CSS grid, rows `76px 1fr 64px`.
- `<nav aria-label="Main">`: logo link (28px SVG disc + wordmark in the display face at 24px), `<ul>` of four links, pill CTA.
- `<section class="hero">`: flex column, vertically centred. Contains `.sticker` (absolute), `.eyebrow`, `<h1>`, `.foot` (lede + CTA row, space-between, aligned to bottom).
- `<h1 aria-label="Make things that wiggle.">`: two `.line` spans (`aria-hidden="true"`), each containing `.word` spans; each word contains `.ch` spans (entrance), each `.ch` contains one `.g` span (hover hop).
- `.bar`: date, venue, price, a hint ("Hover a word to wave it again") and a `<button>` Replay pushed right with `margin-left:auto`.

## Tokens

```css
:root {
  /* colour */
  --bg: #2336E6;          /* page, saturated cobalt */
  --bg-deep: #1726B8;     /* bottom-right radial shade */
  --cream: #FFF3D6;       /* headline + body text */
  --cream-2: #C9CDF7;     /* eyebrow, meta text */
  --pink: #FF9EC4;        /* accent word, primary buttons, focus */
  --pink-ink: #3A0A22;    /* text on pink and on the sticker */
  --line: rgba(255, 243, 214, .22); /* hairlines + ghost button border */

  /* type */
  --display: "Bagel Fat One", system-ui, sans-serif;
  --body: "Figtree", system-ui, sans-serif;
  --fs-display: 192px;
  --fs-lede: 20px;
  --fs-label: 13px;

  /* shape */
  --r-pill: 999px;

  /* motion */
  --rise: 820ms;
  --hop: 520ms;
  --stagger: 34ms;
  --ease-over: cubic-bezier(.34, 1.56, .64, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

Background: `--bg` plus two radial gradients, `900×520 at 88% 110%` of `--bg-deep` and `600×400 at 0 0` of `rgba(255,255,255,.07)`.

## Typography

| Role          | Family        | Size  | Weight | Line-height | Tracking | Case      |
|---------------|---------------|------:|-------:|------------:|---------:|-----------|
| Headline      | Bagel Fat One | 192px | 400    | .92         | −0.02em  | sentence  |
| Logo          | Bagel Fat One | 24px  | 400    | 1           | 0        | Title     |
| Sticker       | Bagel Fat One | 30px  | 400    | 1           | 0        | Title     |
| Eyebrow       | Figtree       | 13px  | 600    | 1           | +0.16em  | UPPERCASE |
| Lede          | Figtree       | 20px  | 400 / 600 bold | 1.45 | 0     | sentence  |
| Nav links     | Figtree       | 15px  | 500    | 1.5         | 0        | Title     |
| Buttons       | Figtree       | 15px  | 700    | 44px box    | 0        | sentence  |
| Bar meta      | Figtree       | 13px  | 500    | 1           | 0        | sentence  |

Headline lines use `white-space: nowrap`; the eyebrow is preceded by a 40 × 1.5px rule.

## Motion

| Element        | Trigger        | Property                     | From → To                                         | Duration | Easing         | Delay / stagger |
|----------------|----------------|------------------------------|---------------------------------------------------|---------:|----------------|-----------------|
| `.ch`          | load / Replay  | opacity, transform           | 0, `translateY(.7em) rotate(10deg) scale(.9)` → 1, none (overshoot at 70%) | 820ms | `--ease-over` | `120ms + i × 34ms`, `i` counted across both lines |
| `.g`           | word hover / focus | transform                | none → `translateY(-.22em) rotate(-6deg)` (35%) → `translateY(.04em) rotate(2deg)` (65%) → none | 520ms | `--ease` | `j × 28ms`, `j` = index within the word |
| `.sticker svg` | always         | rotate                       | 0 → 360°                                          | 24s      | linear (ambient) | — |
| `.btn`         | hover          | transform                    | none → `translateY(-2px) rotate(-2deg)`           | 160ms    | `--ease`       | — |

The entrance uses `animation-fill-mode: backwards` so letters are hidden during their delay and fall back to the un-animated state afterwards (no lingering transform).

Reduced motion: remove the entrance, the hop and the sticker spin entirely (`animation: none`). The headline is fully visible at rest from the first frame.

## States

- **Word hover / focus:** letters hop; focus-visible adds `box-shadow: 0 0 0 3px var(--pink)` with 16px radius on the word.
- **Primary button hover:** lift and tilt as above; colour unchanged.
- **Ghost button:** inset 1.5px `--line` border; hover changes it to `--cream`.
- **Replay hover:** border goes from `--line` to `--cream`.
- **Focus-visible (all controls):** 3px `--pink` outline, 3px offset, 12px radius.
- **Mid-animation replay:** removing and re-adding the class restarts all letters from hidden; there is no half-state.

## Accessibility

- The `<h1>` carries `aria-label` with the full sentence; the per-letter markup is `aria-hidden="true"` so screen readers announce one sentence, not 21 letters.
- Words are `tabindex="0"` so keyboard users can trigger the hop; they have no other action, so they are not buttons.
- Replay is a real `<button type="button">` with visible text.
- Contrast: cream `#FFF3D6` on cobalt `#2336E6` is 7.4:1; `--cream-2` meta text is 4.9:1; `--pink-ink` on pink is 9.8:1.
- Do not let the entrance block reading: the whole wave completes in under 1.7s.

## Responsive rules

- ≥ 1280: as specified; headline ~1070px wide.
- 1024–1279: `--fs-display: 150px`; sticker 112px.
- 768–1023: `--fs-display: 112px`; `.foot` stacks (lede above CTAs); hide the bar hint.
- < 640: `--fs-display: 64px`, letter stagger drops to 24ms, nav links collapse to a menu button, bar shows date and Replay only. Lines may wrap per word (keep each word `inline-block` so letters never split across lines).

## Acceptance checklist

- [ ] Headline is 192px Bagel Fat One, line-height .92, two lines, "wiggle." in `#FF9EC4`.
- [ ] Every letter is its own `inline-block` span; spaces stay as text nodes between words.
- [ ] Letter `n` starts at `120 + n × 34` ms and runs 820ms with `cubic-bezier(.34,1.56,.64,1)`.
- [ ] Letters visibly overshoot (rise above baseline and tilt −3°) before settling.
- [ ] The full wave finishes in under 1.7s.
- [ ] Hovering a word hops only that word, staggered 28ms per letter, 520ms each.
- [ ] Hovering a word does not restart or break the entrance on other words.
- [ ] Tab reaches each word; focus shows a pink ring and triggers the hop.
- [ ] Replay restarts the entrance from hidden letters.
- [ ] Screen readers announce "Make things that wiggle." once.
- [ ] With reduced motion, the headline is static and complete on first paint; the sticker does not spin.
- [ ] No console errors; JS under 40 lines.

## Implementation notes

**Two nested spans per letter.** If the entrance and the hover hop both set `animation` on the same element, removing the hover class re-applies the entrance and the letter replays its rise. Put them on different layers:

```css
.ch { display: inline-block; }
.g  { display: inline-block; }
h1.play .ch {
  animation: rise var(--rise) var(--ease-over) backwards;
  animation-delay: calc(var(--i) * var(--stagger) + 120ms);
}
.word.hop .g {
  animation: hop var(--hop) var(--ease) both;
  animation-delay: calc(var(--j) * 28ms);
}
```

**Overshoot lives in the keyframes, not just the curve.** A back-out curve alone gives a tiny bump; author the peak explicitly:

```css
@keyframes rise {
  0%   { opacity: 0; transform: translateY(.7em) rotate(10deg) scale(.9); }
  35%  { opacity: 1; }
  70%  { transform: translateY(-.1em) rotate(-3deg) scale(1.02); }
  100% { transform: none; }
}
```

**Restarting a CSS animation.** Remove the class, force a reflow, add it back. Clear the hop class on the last letter's `animationend` so the next hover starts clean:

```js
const hop = () => { word.classList.remove('hop'); void word.offsetWidth; word.classList.add('hop'); };
word.addEventListener('mouseenter', hop);
word.addEventListener('focus', hop);
word.addEventListener('animationend', (e) => {
  if (e.animationName === 'hop' && e.target === word.lastChild.firstChild) word.classList.remove('hop');
});
```

Common mistakes: splitting text with `innerHTML` and losing the spaces (keep a text node between words); using `display:inline` letters (transforms are ignored); forgetting `aria-hidden` on the split spans; counting `--i` per line instead of across the whole headline, which makes line two start at the same time as line one.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
