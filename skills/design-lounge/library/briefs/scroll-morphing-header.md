<!-- Design Lounge Nº 594 · "Scroll-morphing playlist header" · www.designlounge.live -->

# Scroll-morphing playlist header

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The top of a playlist page in a web music player ("Slow Burn, Vol. 3" by Lowfield Radio). The header is a 500px burnt-sienna block with a 260px drawn cover, a 104px Syne ExtraBold title, a description and meta line. As the page scrolls the first 428px, the cover and title travel and shrink into a 72px sticky bar (44px cover, 22px title) while the ground darkens from rust to near-black, the copy fades out and a compact "Now playing" chip with a 44px play button fades in on the right. The sticky track-list column header docks directly under the bar. One registered custom property, `--p` (0 → 1), drives every part of the morph; a CSS scroll timeline animates it, and a few lines of JS write the same `--p` where scroll timelines are missing. The detail worth copying: the header is `position: sticky` with `top: calc(72px - 500px)`, so it never leaves the flow, and its bottom 72px simply become the bar.

## Structure

```
1280 × 800, document scrolls
┌───────────────────────────────────────────────────────────────────────┐ y 0
│ (‹)(›) [ Search songs, people, radio      ]                     (NF)  │ 24
│ ┌──────────┐  Public playlist                                        │ 184
│ │  COVER   │  Slow Burn                                 104/800      │ 212
│ │  260²    │  description 15px, max 560                              │ 336
│ │ (48,160) │  Lowfield Radio · 4,812 saves · 20 songs, 1 h 30 min    │
│ └──────────┘                                                         │
├────────────── bar region (bottom 72px of the header) ────────────────┤ 428
│ [44] Slow Burn 22px                         Now: Ashfall …  ( ▮▮ 44) │
└───────────────────────────────────────────────────────────────────────┘ 500
  ( ▮▮ 60 )  ⤨  ♥  •••  ( Follow Lowfield )                  padding 28 48 20
  #   TITLE                          ALBUM          DATE ADDED      TIME   sticky top 72
  ▮▮  [art] Ashfall Lullaby          Low Sun Sessions  2 Oct 2026   4:12   56px rows
```

- `<header class="hero">`: `position: sticky; top: calc(var(--bar) - var(--hero)); height: 500px; overflow: hidden`. Children are absolutely positioned: `.top` row, `.cover`, `.kick`, `<h1 class="title">`, `.desc`, `.mini`.
- `<main>`: `.acts` row of buttons, then `<section class="list" aria-label="Tracks">` with `.thead` (aria-hidden, sticky) and `#rows` (`role="list"`) of `.tr` (`role="listitem"`, `tabindex="0"`).
- Track grid: `40px minmax(0,1.4fr) minmax(0,1fr) 140px 64px`, gap 16px, padding 0 16px inside a list padded 0 32px.
- Each row's 40px art is CSS only: a radial-gradient disc over a band stripe over a pale ground, coloured per row from a hue.

## Motion

| Element | Trigger | Property | From → To | Duration / range | Easing |
|---|---|---|---|---|---|
| `.hero` | scroll | `--p` | 0 → 1 | `scroll(root)`, range 0 → 428px | linear (scroll-linked) |
| `.cover` | `--p` | transform, radius, shadow | see behaviour 3 | follows `--p` | n/a |
| `.title` | `--p` | translate, scale | (0,0) 1 → (−232, 241) 0.2115 | follows `--p` | n/a |
| `.kick`, `.desc` | `--p` | opacity, translateY | 1 → 0 by p 0.25 | follows `--p` | n/a |
| `.hero` ground | `--p` | background | `#8f3a1c` → `#1f1513` (oklab mix) | follows `--p` | n/a |
| `.mini` | `--p` | opacity | 0 until p 0.8 → 1 at p 1 | follows `--p` | n/a |
| `.play` | hover / active | scale | 1 → 1.05 / 0.96 | 160ms | `--ease` |
| `.eq i` | playing | scaleY | 0.25 ↔ 1, alternate, 3 bars offset −300ms | 900ms loop | `--ease` |

Reduced motion: the timeline animation keeps running but with `animation-timing-function: steps(1, jump-end)`, so the header is fully expanded until 428px and fully compact after: two still states, no tween. The JS fallback rounds `--p` the same way. Equaliser bars stop at 70% height; the press scale is removed.

## States

- **Expanded (p = 0):** every header element visible; compact chip invisible and not clickable.
- **Compact (p = 1):** `.hero.compact` class added by JS; chip clickable and its button focusable.
- **Playing / paused:** pause icon `M7 5h3.5v14H7zM13.5 5H17v14h-3.5z` vs play `M8 5.5v13l11-6.5z`; `aria-label` "Pause"/"Play"; eq bars run or freeze.
- **Current row:** orange title, eq in place of the number, `aria-current="true"`.
- **Row hover / focus-visible:** `--row` background, 6px radius.
- **Ghost icon pressed:** full ink; save also fills orange.
- **Focus-visible:** 2px `--acc` outline, 3px offset, on every button, row and the search field.
- **Search field:** the `<input>` itself carries the pill: 40px tall, 20px radius, 1px `#e2c8b4` border (5:1 on the rust ground), transparent fill, 44px left padding for the absolutely placed magnifier.

## Accessibility

- The title is the page's only `<h1>`; it stays real text throughout (scaled with `transform`, never swapped for a second copy), so screen readers read one title.
- The cover is decorative (`aria-hidden`); the meta line carries the facts.
- Back, forward, shuffle, save and more are `<button>`s with `aria-label`; shuffle and save carry `aria-pressed`.
- Rows are focusable list items with an `aria-label` of "Title by Artist, m:ss"; Enter and Space play/pause.
- Contrast: ink on rust 6.4:1, description 5.8:1, meta 5.4:1; dim on page 7.2:1 and on row hover 6.7:1; icon on accent 6.8:1; the Follow outline is 4.6:1 against the page.
- Hit targets: 40px round buttons, 60px and 44px play buttons, 56px rows.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: same geometry; the title still fits (it ends near x 1000).
- 768–1023: same; the Album column shrinks first (`minmax(0, 1fr)` with ellipsis).
- < 760: hero 468px, bar 64px. Cover 196px at (16, 76), ends 40px at (16, 416): `--cy: 340px; --ck: .2041`. Title 46px at (16, 292), ends 18px at (68, 427): `--tx: 52px; --ty: 135px; --tk: .3913`. Search and kicker hide; description sits under the title. Grid becomes `28px 1fr 48px` (album and date hide). The chip hides its "Now" text and keeps the 44px button.
- Nothing scrolls sideways at 390px.

## Acceptance checklist

**Always**
- [ ] The header is sticky with `top: bar − hero`; nothing is cloned or swapped between the big and compact states.
- [ ] One registered `--p` (0 → 1 over `hero − bar` px of scroll) drives cover, title, fades, ground and chip.
- [ ] Cover and title transform from their top-left corners and land exactly inside the bar, vertically centred.
- [ ] Copy is fully transparent by p 0.25, so it never collides with the travelling title.
- [ ] The compact play button is not focusable or clickable until p = 1.
- [ ] The column header sticks directly under the bar.
- [ ] Without scroll-timeline support, JS writes `--p` from `scrollY` and the result is identical.
- [ ] Reduced motion gives two still states with no tween.
- [ ] Focus rings visible on all controls; nothing scrolls sideways at 390px.

**This demo**
- [ ] Desktop: 500px header, 72px bar, 260 → 44px cover, 104 → 22px title, rust `#8f3a1c` → `#1f1513`.
- [ ] Title "Slow Burn", meta "Lowfield Radio · 4,812 saves · 20 songs, 1 h 30 min".
- [ ] 20 rows; "Ashfall Lullaby" by Moro Quartet is playing on load.
- [ ] Play buttons are `#f07a3a` with a `#1a0d06` icon.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial frame (scrollY 0, 1280×800): rust header fills y 0–500. Top row at y 24: two 40px round back/forward buttons, a 300×40 search field ("Search songs, people, radio"), and a 40px "NF" avatar at the right. Cover 260×260 at (48, 160) with a 4px radius and a soft drop shadow. To its right at x 340: "Public playlist" (13px/600) at y 184, the title "Slow Burn" (104px/800) at y 212, a 15px two-line description, and the meta line "Lowfield Radio · 4,812 saves · 20 songs, 1 h 30 min".
2. Below the header (dark ground): an action row with a 60px orange pause/play button, shuffle, save (pressed, filled orange), more, and a 36px outlined "Follow Lowfield" pill. Then a sticky column header (#, Title, Album, Date added, Time) and 20 track rows, 56px each. Row 1 "Ashfall Lullaby" is playing: orange title and a three-bar equaliser in the number column.
3. Scroll 0 → 428px: `--p` goes 0 → 1 linearly with scroll.
   - Cover: `translateY(p × 282px) scale(1 − p × 0.8308)` from its top-left corner; it lands as a 44px square at (48, 442). Radius 4 → 22px, shadow 24/60px → 4/10px.
   - Title: `translate(p × −232px, p × 241px) scale(1 − p × 0.7885)`; it lands at 22px visual size at (108, 453), vertically centred in the bar.
   - Kicker and description: opacity `1 − 4p` (gone by p = 0.25); description also lifts 24px.
   - Ground: `color-mix(in oklab, #8f3a1c, #1f1513 p×100%)`; a 1px bottom hairline fades in to 14% cream.
   - Compact chip ("Now: Ashfall Lullaby" + 44px play button): opacity `5p − 4` (appears over the last 20%).
4. From 428px on the header is stuck: only its bottom 72px show. The track-list column header sticks at `top: 72px` beneath it.
5. Scrolling back reverses the morph exactly.
6. The big play button, the compact play button and clicking or pressing Enter/Space on a row all share one player state: clicking the current row toggles pause; clicking another row makes it current and playing. Paused pauses the equaliser bars; icons swap between pause and play and labels between "Pause" and "Play". The compact chip's text follows the current track.
7. Shuffle and Save toggle `aria-pressed`; pressed icons turn full ink (save fills orange).
8. The compact play button is unfocusable (`tabindex=-1`) until the bar is fully compact.

## Tokens

```css
@property --p { syntax: '<number>'; inherits: true; initial-value: 0; }
:root {
  /* colour */
  --bg: #141011;         /* page */
  --row: #1d1718;        /* row hover */
  --line: #2c2324;       /* column header rule */
  --ink: #f6ebdd;        /* primary text */
  --dim: #ad9d90;        /* secondary text, idle icons */
  --acc: #f07a3a;        /* play buttons, playing title, eq */
  --acc-ink: #1a0d06;    /* icon on accent */
  --rust: #8f3a1c;       /* header ground at p = 0 */
  --rust-deep: #1f1513;  /* header ground at p = 1 */
  --desc: #f3dfcf;  --meta: #f0d6c2;
  --cream: #efe3cf; --sun: #e2582b; --band: #1b1512;   /* cover art */
  --pill-line: #8a7a6f;  /* Follow outline */

  --syne: "Syne", system-ui, sans-serif;

  /* geometry: desktop */
  --hero: 500px; --bar: 72px;
  --cl: 48px; --ct: 160px; --cs: 260px; --cy: 282px; --ck: .1692;      /* cover: left, top, size, travel, end scale */
  --tl: 340px; --tt: 212px; --tf: 104px; --tx: -232px; --ty: 241px; --tk: .2115; /* title */
  --row-h: 56px; --thead-h: 40px; --play: 60px; --play-mini: 44px;
  --r-cover: 4px; --r-cover-end: 22px; --r-row: 6px;

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --t-press: 160ms; --t-eq: 900ms;
}
```

## Typography

| Role             | Family | Size        | Weight | Line-height | Tracking | Case      |
|------------------|--------|-------------|-------:|------------:|---------:|-----------|
| Title            | Syne   | 104px (46px < 760) | 800 | 1     | −0.04em  | sentence  |
| Title, compact   | Syne   | 22px visual (18px < 760), via scale | 800 | 1 | −0.04em | sentence |
| Kicker           | Syne   | 13px        | 600    | 1.4         | +0.04em  | sentence  |
| Description      | Syne   | 15px        | 500    | 1.4         | 0        | sentence  |
| Meta             | Syne   | 14px        | 600 / 500 | 1.4      | 0        | sentence  |
| Column header    | Syne   | 12px        | 600    | 1.4         | +0.06em  | UPPERCASE |
| Track title      | Syne   | 15px        | 600    | 1.4         | 0        | sentence, ellipsis |
| Artist, album, date, time | Syne | 13–14px | 500 | 1.4       | 0        | tabular numbers in # |
| Pill             | Syne   | 13px        | 600    | 1           | 0        | sentence  |

## Implementation notes

**One number, many properties.** Register `--p` so the keyframe can animate it, then let every element read it in `calc()`:

```css
@property --p { syntax: '<number>'; inherits: true; initial-value: 0; }
.hero { position: sticky; top: calc(var(--bar) - var(--hero)); height: var(--hero);
  background: color-mix(in oklab, var(--rust), var(--rust-deep) calc(var(--p) * 100%));
  animation: morph linear both; animation-timeline: scroll(root);
  animation-range: 0 calc(var(--hero) - var(--bar)); }
@keyframes morph { from { --p: 0 } to { --p: 1 } }
.cover { transform-origin: 0 0;
  transform: translateY(calc(var(--p) * var(--cy))) scale(calc(1 - var(--p) * (1 - var(--ck)))); }
```

**Work out the end positions from the bar, not by eye.** For a top-left origin: `travel = end − start`, `scale = endSize / startSize`. Cover: 442 − 160 = 282px, 44 / 260 = 0.1692. Title: bar centre 464 − 11 = 453; 453 − 212 = 241px down, 108 − 340 = −232px across, 22 / 104 = 0.2115. Put each set in custom properties per breakpoint so the CSS never changes.

**Fallback and reduced motion share one function:**

```js
const span = -parseFloat(getComputedStyle(hero).top);     // 428
let p = Math.min(1, Math.max(0, scrollY / span));
if (reduce) p = p >= 1 ? 1 : 0;
if (!CSS.supports('animation-timeline: scroll()')) hero.style.setProperty('--p', p);
hero.classList.toggle('compact', scrollY >= span - 1);
```

Common mistakes: animating `font-size`, `width` or `top` (layout on every frame; transform the element instead); forgetting `white-space: nowrap` on the title, so it rewraps mid-scale; using `position: fixed` for the bar, which needs a spacer and breaks anchor offsets; and leaving the compact button clickable while it is still transparent.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
