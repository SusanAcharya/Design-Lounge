<!-- Design Lounge Nº 304 · "Magazine cover card" · www.designlounge.live -->

# Magazine cover card

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A back-issue shelf for a fictional coast-and-craft quarterly called Saltgrass. The left column has a big condensed heading and an issue picker with three rows. The right column has one magazine cover at 3:4, drawn completely in HTML, CSS and inline SVG: a full-bleed masthead, an issue strip, a flat poster illustration, a main cover line, three side lines and a printed barcode. Two other issues peek out behind it as rotated coloured sheets. The detail worth copying is the corner: the cover has a real cut corner made with `clip-path`, and a folded flap that grows from 18px to 68px on hover or focus while the whole card lifts 10px. Everything on the cover is sized in container query units, so the cover scales as one printed object.

## Structure

```
1280 × 800 stage, padding 40px 48px, content max 1040px, 2 columns gap 80px
┌───────────────────────────────────┬─────────────────────────────┐
│ SALTGRASS · COAST & CRAFT…  12px  │   ▞ sheet (other issue)     │
│ BACK                       88px   │  ┌──────── 440 × 587 ─────┐ │
│ ISSUES                            │  │ No.41   JUNE 2026   £9 │ │
│ lede 16px, 40ch                   │  │ SALTGRASS  (22.4cqw)   │ │
│ ┌──┬──────────────────┬───────┐   │  │  ( sun art )  ICE HOUSES│ │
│ │sw│ THE HEAT ISSUE   │ No.41 │   │  │  ~~~~~~~~~~~  SHADE    │ │
│ ├──┼──────────────────┼───────┤   │  │               COLD SOUP│ │
│ │sw│ NIGHT SWIMMING   │ No.42 │   │  │ SUMMER SPECIAL         │ │
│ ├──┼──────────────────┼───────┤   │  │ THE LONG HEAT  ┌─────┐ │ │
│ │sw│ HARVEST          │ No.43 │   │  │ italic sub     │|||||│◤│ │
│ └──┴──────────────────┴───────┘   │  └────────────────┴─────┘ │ │
│ hint 12px                         │   curl bottom-right         │
└───────────────────────────────────┴─────────────────────────────┘
```

- Left column: `section` with `p.eyebrow`, `h1`, `p.lede`, a `div[role=radiogroup]` of three `button[role=radio]`, and a hint.
- Right column: `.stack` (relative, max-width 440px) holding two absolutely positioned `.sheet` divs (`aria-hidden`), then `a.issue` containing `.cover` and a sibling `.fold` span.
- `.cover`: `aspect-ratio: 3/4`, `container-type: inline-size`, `overflow: hidden`, clipped corner.
- Inside `.cover > .content`: `.top` strip (issue no, month, price), `p.mast` (`aria-hidden`, the link has the accessible name), `svg.art` (viewBox 0 0 400 300), `.lines` with kicker, `h2.main`, `p.sub`, `.side` with three `p`, `.bar` barcode block.
- Z-order inside the cover: masthead 1, art 2 (so the sun or moon overlaps the masthead's lower edge), text 3.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Card lift | hover / focus-visible on `.issue` | transform | none → translateY(-10px) rotate(-.6deg) | 320ms | expo |
| Shadow | same | filter drop-shadow | 0 10px 14px .22 → 0 26px 30px .30 | 320ms | expo |
| Curl | same | `--c` (registered `<length>`) | 18px → 68px | 320ms | expo |
| Issue out | picker change | opacity, transform | 1 → 0, translateX(-4%) scale(.98) | 180ms | standard |
| Issue in | after out | opacity, transform | 0, translateX(5%) scale(1.02) → 1, none | 420ms | expo |
| Picker swatch | checked | transform | none → translateY(-4px) rotate(-4deg) | 320ms | expo |

Reduced motion: all durations become 1ms, the lift transform is removed, and the issue swaps instantly. The curl still appears on hover, without animating, so the paper cue survives.

## States

- Cover rest: curl 18px, shadow small.
- Cover hover / focus-visible: lifted, curl 68px, and on focus an inset 3px `--ink` ring inside the cover (the outline would be clipped by `clip-path`).
- Picker row hover: background `rgba(28,26,23,.05)`.
- Picker row checked: background `rgba(28,26,23,.08)`, number goes from `--ink-2` to `--ink`, swatch tilts.
- Picker row focus-visible: 2px `--ink` outline, offset 2px.
- During a swap, further clicks are ignored until the out phase finishes (a `busy` flag), so content can't double-render.

## Accessibility

- The picker is `role="radiogroup"` labelled "Choose an issue"; each row is `role="radio"` with `aria-checked`. Roving tabindex: the checked row is `tabindex=0`, the rest `-1`.
- Arrow keys move and select; focus follows.
- The cover link's `aria-label` is "Saltgrass number 41, The Heat Issue, June 2026". The masthead and the art are `aria-hidden`; the cover lines are real text and `h2` for the main line.
- A visually hidden `p[aria-live=polite]` announces the new issue. Don't put `aria-live` on the cover itself; it would read every cover line.
- Contrast: `#141210` on `#e84f2f` is 4.97:1; `#f2e9d8` on `#1e3bb3` is 7.5:1; `#1f2a1e` on `#e8a722` is 7.1:1; No.43 side heads `#6e2810` on `#e8a722` are 5.1:1. The cream `#f6ebd9` on red is only 3.4:1, so No.41 uses cream only for the masthead and the 4.6cqw side heads (large display text), and sets the small kicker in ink via `--kick`.
- Picker rows are at least 72px tall.

## Responsive rules

- ≥1280: as drawn, cover 440px wide.
- 1024: same two columns; the cover shrinks with its column, everything inside scales by `cqw`.
- ≤860: one column, heading 60px, padding 32px 20px, cover max-width 300px below the picker.
- 375: no horizontal scroll. The rotated sheets reach about 26px past the cover; the 300px cover leaves 37px on each side, so they fit.

## Acceptance checklist

### Always

- [ ] The cover is 3:4 and all cover text is sized in container query units.
- [ ] The corner is cut with `clip-path` on the cover, and the flap is a separate sibling so the clip doesn't hide it.
- [ ] The curl is visible at rest (small) and grows on hover and keyboard focus.
- [ ] Hover lifts the card 10px with a deeper shadow over 320ms expo-out.
- [ ] The issue switcher is a radiogroup with roving tabindex and arrow keys that wrap.
- [ ] Swapping issues uses a short out (180ms) and a longer in (420ms); clicks during the swap are ignored.
- [ ] The sheets behind the cover show the other issues' colours.
- [ ] A live region announces the new issue; the cover link has a full accessible name.
- [ ] Reduced motion removes the lift and makes swaps instant.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Masthead "SALTGRASS"; issues No. 41 "The Heat Issue" (June 2026, #e84f2f), No. 42 "Night Swimming" (August 2026, #1e3bb3), No. 43 "Harvest" (October 2026, #e8a722).
- [ ] No. 41 main line "The long heat"; side lines Ice houses / Shade / Cold soup.
- [ ] No. 42 mirrors the layout: lines right, barcode left.
- [ ] Barcode label `#fbf8f1` reads "9 772031 0451 41" for No. 41.
- [ ] Stage `#d8d1c3` with a 5px dot grain.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: issue No. 41, "The Heat Issue", June 2026, tomato red. The picker row for No. 41 is checked. A blue and a saffron sheet peek out behind the cover, rotated +3.5deg and -2.5deg.
2. The cover's bottom-right corner already shows an 18px curl at rest, so the viewer knows it's paper.
3. Hovering or keyboard-focusing the cover lifts it `translateY(-10px) rotate(-0.6deg)`, deepens its drop shadow, and grows the curl to 68px over 320ms with expo-out. Leaving reverses it.
4. Clicking a picker row switches the issue. The current cover content fades out and shifts left 4% over 180ms, then the new issue's content fades in from 5% right and 1.02 scale over 420ms. The cover colour changes at the swap point.
5. The two sheets behind always show the two issues that are not on top.
6. In the picker, Up/Left and Down/Right arrows move to the previous/next issue, wrapping, and move focus with it (roving tabindex). Only the checked row is in the tab order.
7. The checked row gets a darker tint and its swatch tilts -4deg and rises 4px.
8. A visually hidden live region announces "Showing number 42, Night Swimming".
9. Issue No. 42 uses the mirrored layout: cover lines right-aligned bottom-right, barcode bottom-left, no side lines.
10. Clicking the cover does nothing (it is a product link in a real shop; here default is prevented).

## Tokens

```css
:root {
  --stage: #d8d1c3;      /* warm concrete */
  --stage-2: #cbc3b2;
  --ink: #1c1a17;
  --ink-2: #4a453d;
  --line: rgba(28,26,23,.18);
  --paper: #fbf8f1;      /* barcode label, flap tip */
  --fold-1: #cfc5b1;     /* flap near the crease */
  --fold-2: #f3eee3;     /* flap mid */

  /* per issue, set on .cover */
  --bg: #e84f2f; --fg: #141210; --mast: #f6ebd9; --accent: #f6ebd9; --kick: #141210;   /* No.41 */
  /* No.42: bg #1e3bb3, fg #f2e9d8, mast #f2e9d8, accent #f2c14e */
  /* No.43: bg #e8a722, fg #1f2a1e, mast #1f2a1e, accent #6e2810 */

  --display: "Anton", Impact, sans-serif;
  --sans: "Rethink Sans", system-ui, sans-serif;

  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --t-lift: 320ms;
  --t-out: 180ms;
  --t-in: 420ms;
  --curl-rest: 18px;
  --curl-hover: 68px;

  --space: 4px 8px 16px 24px 32px 48px 80px;
}
```

The stage has a 5px dot grain: `radial-gradient(rgba(28,26,23,.05) 1px, transparent 1.2px)` at `5px 5px`.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Eyebrow | Rethink Sans | 12px | 600 | 1 | .16em | upper |
| Page heading | Anton | 88px | 400 | .9 | -.005em | upper |
| Lede | Rethink Sans | 16px | 400 | 1.55 | 0 | sentence |
| Picker title | Anton | 20px | 400 | 1.1 | .01em | upper |
| Picker meta | Rethink Sans | 13px / 12px | 400 / 600 | — | 0 / .12em | — |
| Cover strip | Rethink Sans | 2.7cqw | 600 | 1 | .14em | upper |
| Masthead | Anton | 22.4cqw | 400 | .84 | -.01em | upper |
| Kicker | Rethink Sans | 2.8cqw | 600 | 1 | .16em | upper, `--kick` (falls back to `--accent`) |
| Main cover line | Anton | 9.6cqw | 400 | .9 | 0 | upper |
| Sub line | Rethink Sans italic | 3.2cqw | 400 | 1.3 | 0 | sentence |
| Side line head | Anton | 4.6cqw | 400 | 1 | 0 | upper, `--accent` |
| Side line body | Rethink Sans | 3cqw | 600 | 1.2 | 0 | sentence |
| Barcode digits | Rethink Sans | 1.9cqw | 600 | 1 | .12em | — |

At 440px wide, 22.4cqw is ~98px: the masthead spans edge to edge with 4cqw side margins. Do not set the masthead in a fixed px size.

## Implementation notes

**1. The curl.** Register `--c` so it can transition, cut the cover's corner with it, and draw the flap as the top-left half of a `--c` square. The cover sits inside a wrapper that carries `filter: drop-shadow`, because `box-shadow` is clipped by `clip-path`.

```css
@property --c { syntax: "<length>"; inherits: true; initial-value: 18px; }
.issue { transition: transform 320ms var(--expo), filter 320ms var(--expo), --c 320ms var(--expo);
         filter: drop-shadow(0 10px 14px rgba(40,30,15,.22)); }
.issue:hover, .issue:focus-visible { --c: 68px; transform: translateY(-10px) rotate(-.6deg); }
.cover { clip-path: polygon(0 0, 100% 0, 100% calc(100% - var(--c)), calc(100% - var(--c)) 100%, 0 100%); }
.fold {
  position: absolute; right: 0; bottom: 0; width: var(--c); height: var(--c);
  background: linear-gradient(to top left, transparent 50%, var(--fold-1) 50%, var(--fold-2) 78%, var(--paper));
  filter: drop-shadow(-3px -3px 4px rgba(0,0,0,.22));
}
```

Common mistake: putting `.fold` inside `.cover`. The clip removes it.

**2. Scaling the cover as one object.** `container-type: inline-size` on `.cover`, then every size inside is `cqw`: masthead 22.4cqw, main line 9.6cqw, margins 5.5cqw. The art SVG is `width: 100%` at `top: 16cqw`, so its 400×300 viewBox spans 16cqw to 91cqw; cover lines start below 92cqw. Keep the right 30cqw of the art empty between art y 70 and 200 so the side lines sit on flat colour.

**3. The barcode.** Generate 28 slots from a seed string built from the issue number; even slots are bars 1–3 units wide, separated by 0.6. Every ninth bar is 40 tall instead of 36 (guard bars). Render it as an SVG with `preserveAspectRatio="none"` at 20cqw × 9cqw on a paper label.

```js
function barcode(no){
  let x = 0, s = "";
  const seed = String(977203141 + no * 7919);
  for (let i = 0; i < 28; i++) {
    const w = 1 + (+seed[i % seed.length] + i) % 3;
    if (i % 2 === 0) s += `<rect x="${x}" width="${w}" height="${i % 9 ? 36 : 40}"/>`;
    x += w + .6;
  }
  return `<svg viewBox="0 0 ${x.toFixed(1)} 40" preserveAspectRatio="none">${s}</svg>`;
}
```

Other mistakes to avoid:

- Using a photo. The illustration is flat SVG shapes in two or three of the issue's colours.
- Animating `clip-path` directly with keyframes instead of the registered property; the polygon interpolates fine, but then the flap and the cut drift apart.
- Putting a focus `outline` on the link. The clip hides part of it; use the inset ring on `.cover`.
- Letting the side lines fall over dark art. Move the art, not the text.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
