<!-- Design Lounge Nº 293 · "Lens card scroll ticker" · designlounge.vercel.app -->

# Lens card scroll ticker

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Studied from wickret.cuberto.com: the benefits strip where one line of big text slides sideways behind a fixed rounded card in the middle of the screen, and the card shows a new picture for each line. This rebuild is for **Fernly**, a fictional houseplant care membership, on a charcoal page. Vertical scroll drives four benefit lines across the viewport, one at a time. The centre card works like a lens. Text outside it is bone, and the same text seen through it is ink on the card's colour. As each line settles in the card, the card recolours (sage, clay, sky, mustard), crossfades its line icon, and updates a counter and two small facts. The detail worth copying is the second, clipped copy of the track inside the card, offset by the card's position, so the colour change lines up exactly at the card edge without any blend modes.

## Reference behaviour

1. First frame: a charcoal stage `#161514` pinned to the viewport. Fernly mark top-left and an outlined "Start a membership" pill top-right. Eyebrow "THE MEMBERSHIP" at top-left, with the italic serif line "Four things you will never have to think about." under it. In the centre, a 280×360 sage card with radius 28. "Watered on your schedule" is centred on it at 64px, bone outside the card and ink inside. A four-option rail sits at the bottom centre, with "Watering" current. A small "SCROLL" cue with a dripping line sits bottom-right.
2. The page is 520vh tall. The stage is `position: sticky; top: 0; height: 100vh`, so the stage stays and scroll progress `p` (0 → 1) drives the track.
3. The track's x is chosen so the centre of a phrase sits at the viewport centre. Between phrase i and i+1, the centre is interpolated with smoothstep `t*t*(3-2t)`, so each phrase lingers in the card and then moves on.
4. The displayed x eases toward the target each frame (`cur += (target - cur) * 0.14`) for inertia. It stops when within 0.3px.
5. The active index is `round(p × 3)`. On change: card background crossfades over 500ms, the icon swaps (old fades out, new scales 0.92 → 1 and rotates −4° → 0 over 600ms expo-out), the counter reads "02 / 04", the bottom facts update, the rail moves `aria-current="step"`, and the live region announces the phrase.
6. The four phrases and facts are: "Watered on your schedule" (Weekly visit · Included, sage `#B9CBA4`); "Repotted when it outgrows" (Soil + pot · Included, clay `#E79B72`); "Swap any plant, any month" (1 swap / month · Free, sky `#A9C8DE`); "A botanist on call" (Reply in 2 h · 7 days, mustard `#E8C35A`).
7. Clicking a rail option scrolls to that phrase's progress (`maxScroll × i / 3`) with smooth scroll. Left and right arrow keys on a focused rail option move to the neighbour and focus it.
8. Resizing re-measures phrase centres and the inner track offset.
9. Reduced motion: no inertia (x snaps to target), no card or icon transitions, no drip. Rail clicks jump.

## Structure

```
1280 × 800 viewport; document 520vh; stage sticky 100vh
┌──────────────────────────────────────────────────────────────────────┐
│ ⚘ Fernly                                        ( Start a membership )│ 28px / 48px
│ THE MEMBERSHIP                                                        │ top 120
│ Four things you will                                                  │
│ never have to think about.        ┌──────────┐                        │
│                                   │01 / 04   │ 280×360 r28            │
│ Watered on your ░░░░░░░░░░░░░░░░░░│ on your  │ schedule        Re…    │ 64px track, y = 50%
│ (bone)                            │ (ink)    │ (bone)                 │
│                                   │WEEKLY  INCL│                      │
│                                   └──────────┘                        │
│             [ Watering | Repotting | Swaps | Botanist ]        | SCROLL│ bottom 40
└──────────────────────────────────────────────────────────────────────┘
```

- `div.stage` (sticky) holds `header.top`, `div.head` (`p` + `h2`), `div.track.out`, `div.card`, `nav.rail`, `div.cue`, and `p.sr[aria-live]`.
- `div.track.out` is `aria-hidden`, absolute, `top: 50%`, `display: flex`, `white-space: nowrap`. Each phrase is a `span` with `margin-right: 220px`.
- `div.card` is `aria-hidden`, absolutely centred, `overflow: hidden`. It contains `span.num`, four `div.art` (one inline SVG each), `div.track.in` (the same phrases), and `div.tag` with two spans.
- `nav.rail` holds four `button`s whose visible label is the short name and whose `aria-label` is the full phrase.

## Tokens

```css
:root {
  --bg: #161514;        /* stage, card ink text */
  --bone: #EDE6D8;      /* outside text, active rail fill */
  --bone-2: #A8A194;    /* eyebrow, inactive rail, cue */
  --line: #2C2A27;      /* rail border, cue track */
  --ink: #161514;       /* text inside the card */
  --sage: #B9CBA4;      /* benefit 1 */
  --clay: #E79B72;      /* benefit 2 */
  --sky: #A9C8DE;       /* benefit 3 */
  --mustard: #E8C35A;   /* benefit 4, focus ring */
  --sans: "Bricolage Grotesque", system-ui, sans-serif;
  --serif: "Instrument Serif", Georgia, serif;
  --card-w: 280px; --card-h: 360px; --r-card: 28px;
  --phrase: 64px; --gap: 220px;
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
}
```

Spacing follows 4/8: 6px rail padding, 16px rail button padding, 20px card insets, 28px and 48px page insets.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Track phrase | Bricolage Grotesque | 64px | 600 | 1 | −0.035em | Sentence |
| Section line | Instrument Serif italic | 34px | 400 | 1.1 | −0.01em | Sentence |
| Card counter | Instrument Serif italic | 22px | 400 | 1 | 0 | "01 / 04" |
| Brand | Bricolage Grotesque | 22px | 700 | 1 | −0.03em | Title |
| Eyebrow / cue | Bricolage Grotesque | 13px | 400 | 1 | 0.12–0.14em | Upper |
| Card facts | Bricolage Grotesque | 12px | 600 | 1 | 0.1em | Upper |
| Rail / pill | Bricolage Grotesque | 14px / 15px | 600 | 1 | 0 | Title |

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Track (both copies) | scroll | translateX | phrase i centre → phrase i+1 centre, smoothstep | rAF lerp 0.14 per frame | snap |
| Card colour | active change | background-color | old → new benefit colour | 500ms `--ease` | instant |
| Icon out | active change | opacity, transform | 1 → 0 | 360ms `--ease` | instant |
| Icon in | active change | opacity; scale + rotate | 0 → 1; 0.92 / −4° → 1 / 0 | 360ms; 600ms expo | instant |
| Rail current | active change | background, colour | transparent → bone | 240ms `--ease` | instant |
| Scroll cue | loop | translateY of 12px tick | −12 → 40px | 1.8s `--ease` infinite | static |
| Rail click | click | window scroll | current → phrase position | smooth | jump |

## States

- Rail option resting: `--bone-2` text. Hover: `--bone`. Current: bone pill with ink text and `aria-current="step"`.
- "Start a membership" resting: 1px `--bone-2` outline. Hover: bone fill, ink text.
- Focus-visible: 2px mustard outline, 3px offset, 8px radius on everything.
- Between phrases, the card shows the gap, so only part of a word or none sits inside it. This is expected and is the point of the lens.
- No loading or empty states. With fewer than two items, drop the piece and use a static feature block.

## Accessibility

- Both tracks and the card are `aria-hidden`. The phrases are decorative motion. The rail buttons carry the full phrase in `aria-label`, and a polite live region announces the active phrase.
- The rail is a `nav` labelled "Membership benefits". Tab reaches the pill, then the four rail options. Arrow keys move between rail options and scroll the page to match.
- Keyboard users who never scroll can still read all four benefits through the rail.
- Contrast: bone `#EDE6D8` on `#161514` is about 15:1. Ink on each card colour is above 7:1 (sage about 10:1, clay about 7.6:1, sky about 10:1, mustard about 10.5:1).
- Rail buttons are 40px tall, and the pill is 44px.
- The page needs real scroll height. Do not hijack the wheel. Native scroll drives everything, so trackpads, keyboards (Space, Page Down), and screen readers all work.

## Responsive rules

- ≥1280: as specified.
- 1024: the same. The card stays 280×360. Phrases still run past both edges.
- ≤900: phrase 44px, gap 140px, card 220×290, page insets 20px, section line 26px, scroll cue hidden, rail buttons 10px padding.
- <480: phrase 36px, gap 110px, card 190×250, icon 150px, card facts 10px and no wrap, rail bottom 24px, rail buttons 9px padding and 12px text.
- The stage is `overflow: hidden`, so the long track never causes horizontal page scroll. Verify `scrollWidth === innerWidth` at 375.

## Acceptance checklist

### Always

- [ ] The stage is sticky for the full section height, and native vertical scroll drives the horizontal track.
- [ ] There are two copies of the track: one outside, one inside the card. The inside copy is offset by the card's left and top so the copies line up to the pixel.
- [ ] Each phrase dwells in the card (smoothstep between centres), not a constant linear slide.
- [ ] The card colour, icon, counter, and facts change when the active index changes, and only then.
- [ ] The rail shows the current step with `aria-current="step"`. Click and arrow keys scroll to a step.
- [ ] Decorative tracks are `aria-hidden`, and a live region announces the active phrase.
- [ ] Reduced motion snaps x and removes the card and icon transitions.
- [ ] No horizontal page overflow at 375px.

### This demo

- [ ] The page is `#161514`, outside text bone `#EDE6D8`, inside text ink.
- [ ] Phrases are 64px Bricolage Grotesque 600, with a 220px gap.
- [ ] The card is 280×360, radius 28, centred, colours sage → clay → sky → mustard.
- [ ] The counter reads "01 / 04" in Instrument Serif italic.
- [ ] The rail reads Watering, Repotting, Swaps, Botanist.
- [ ] The document is 520vh, and the lerp factor is 0.14.

## Implementation notes

**1. Align the inner copy once, then move both with the same transform.** The inner track lives inside the card's `overflow: hidden`. Shift it by the card's offset so its coordinate system matches the stage.

```js
function measure() {
  centers = [...out.children].map(s => s.offsetLeft + s.offsetWidth / 2);
  inn.style.left = -card.offsetLeft + 'px';                    // card has margin-left:-w/2
  inn.style.top  = stage.offsetHeight / 2 - card.offsetTop + 'px';
}
function paint(x) {
  const t = `translate3d(${x}px,-50%,0)`;
  out.style.transform = t;
  inn.style.transform = t;                                      // identical, not offset
}
```

**2. Map progress to x with a dwell.** Linear interpolation makes the text never rest. Smoothstep the fraction between neighbouring phrase centres.

```js
const smooth = t => t * t * (3 - 2 * t);
function xFor(p) {
  const f = p * (n - 1), i = Math.min(n - 2, Math.floor(f));
  const k = smooth(Math.min(1, Math.max(0, f - i)));
  return innerWidth / 2 - (centers[i] + (centers[i + 1] - centers[i]) * k);
}
```

**3. Re-measure after fonts load.** Phrase widths change when Bricolage swaps in. Call `measure()` inside `document.fonts.ready.then(...)` and on resize.

Common mistakes:

- Using `mix-blend-mode: difference` for the colour change. It gives the wrong colour on four different card backgrounds and breaks on Safari compositing.
- Adding half the card width to the inner offset. `offsetLeft` already includes the negative margin.
- Hijacking the wheel with `preventDefault` instead of using a tall document and a sticky stage.
- Updating the card on every scroll frame instead of only when the rounded index changes.
- Forgetting `white-space: nowrap`, so long phrases wrap and the centres are wrong.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
