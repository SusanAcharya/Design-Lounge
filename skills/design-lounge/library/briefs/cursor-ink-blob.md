<!-- Design Lounge Nº 117 · "Ink blob cursor" · www.designlounge.live -->

# Ink blob cursor

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

An issue index for Field Notes, a fictional garden journal. Six editorial cards sit on warm paper. A 168px gooey ink blot — three dark-green SVG circles blurred together with an SVG `feColorMatrix` "goo" filter — follows the pointer with a 0.14 lerp lag. When the blot's centre sits inside a card (8px inset), that card fills with ink `#0f2e22`, type flips to paper, and the card lifts 8px. The system cursor is hidden. Replay recenters the blot and clears hits. The one idea is ink moving over paper, not a generic spotlight.

## Structure

```
1280 × 800
┌────────────────────────────────────────────────────────────┐
│ Field Notes          Essays  Garden  Archive     [Replay]  │ 64
├────────────────────────────────────────────────────────────┤
│ Letters from the plot                 ISSUE 09 · AUTUMN    │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                     │
│ │ 01 · Soil│ │ 02 · Seed│ │ 03 · Light│   cards, 16 gap    │
│ │ Clay     │ │ Saving   │ │ The short │                    │
│ │ after…   │ │ the beans│ │ afternoon │                    │
│ │ 12 Sep   │ │ 19 Sep   │ │ 26 Sep    │                    │
│ ├──────────┤ ├──────────┤ ├──────────┤                     │
│ │ 04 · Tool│ │ 05 · Kit.│ │ 06 · Note │                    │
│ │ A hoe…   │ │ First    │ │ Leave the │                    │
│ │ 1 Oct    │ │ quince…  │ │ seed heads│                    │
└────────────────────────────────────────────────────────────┘
  blob 168×168, centred on pointer, z-index 5, not in the grid
```

- Hidden SVG in the document with `<filter id="goo">`: `feGaussianBlur` stdDeviation 8, `feColorMatrix` alpha goo (`20 / −8`), `feBlend`.
- `<nav>` + `<main>` padding 28/48/32. `.grid` is 3 columns, rows `auto 1fr 1fr`, gap 16, height 100% of main (`calc(100% − 64px)`).
- Each card: `.idx`, `<h2>`, `<p>`, `<time>`.
- `#blob.blob` is `position: fixed; width/height: 168px; margin: -84px 0 0 -84px`. Inner SVG viewBox 0 0 120 120, three circles filled `#143d2c` / `#0f2e22`.

### Card copy

| Idx        | Title                | Body (short)                                                                 | Date    |
|------------|----------------------|------------------------------------------------------------------------------|---------|
| 01 · Soil  | Clay after rain      | The bed by the wall holds water a day longer than the rest. We stopped fighting it and planted what likes wet feet. | 12 Sep |
| 02 · Seed  | Saving the beans     | Hung in pairs from the rafter until they rattle. Next spring they will remember this roof. | 19 Sep |
| 03 · Light | The short afternoon  | Shade reaches the rosemary by four. We moved the bench, not the plant.       | 26 Sep |
| 04 · Tool  | A hoe with a name    | Ash handle, worn where Marta’s thumb sits. Oil it on Sundays; it will outlast the fence. | 1 Oct |
| 05 · Kitchen | First quince jelly | Four fruits, too hard to bite, cooked down to a rose slab that cuts like cheese. | 2 Oct |
| 06 · Note  | Leave the seed heads | Goldfinches found the fennel. The plot is not only ours, and the calendar can wait. | 2 Oct |

## Motion

| Element       | Trigger      | Property           | From → To          | Duration | Easing   | Notes |
|---------------|--------------|--------------------|--------------------|---------:|----------|-------|
| Blob position | pointermove  | transform translate| lerp 0.14 / frame  | rAF      | —        | factor 1 if reduced |
| Blob shape    | always       | r / cx / cy        | ±6px breathe       | 4.5–6s   | SMIL     | off if reduced |
| Card hit      | overlap      | bg, color, Y       | paper → ink, 0 → −8px | 280ms | `--expo` | |

Do not use mix-blend-mode difference (it turns the paper a strange complementary colour). Invert by swapping tokens on `.hit`.

## States

- **Card rest:** `--paper-2` fill, 1px `--line`, ink type.
- **Card hit:** `--ink` fill, paper type, −8px Y, ink border.
- **Nav current / hover:** `--ink`.
- **Replay hover:** paper type on ink fill.
- **Focus-visible:** 2px ink outline, 3px offset, `cursor: default` so the ring is findable.

## Accessibility

- `cursor: none` is visual only. Keyboard users never need the blob. Cards are not buttons; they do not need a keyboard equivalent of the overlap invert.
- Replay is a `<button>` and is in the tab order after the nav links.
- Goo filter SVG is `aria-hidden`. The blob is `aria-hidden`.
- Contrast on rest cards: ink on `--paper-2` exceeds 8:1. On hit: paper on ink exceeds 10:1. `--ink-3` is 11px meta.
- Hit target for Replay: padding 8/12, border; pad to 40px tall if the host is touch.

## Responsive rules

- ≥ 1280: 3×2 cards, blob 168px, lerp 0.14.
- 1024–1279: same grid, slightly smaller type (card title 22px). Blob 144px.
- 768–1023: 2 columns, 3 rows. Blob 128px.
- < 640: 1 column. Show the system cursor (`cursor: auto`) — a hidden cursor on a phone is unusable. Still invert a card on pointerdown if a stylus appears.

## Acceptance checklist

- [ ] Blob is 168px, goo-filtered, filled `#143d2c` / `#0f2e22`, and lags the pointer with lerp 0.14.
- [ ] System cursor is hidden on the page; the blob has `pointer-events: none`.
- [ ] A card inverts to ink and lifts 8px when the blob centre is inside it (8px inset).
- [ ] Leaving the card restores paper-2 and Y=0 over 280ms.
- [ ] Replay recenters the blob at 62%/48% and clears `.hit`.
- [ ] Reduced motion: blob tracks with no lag, no SMIL, 1ms card transitions; invert still happens.
- [ ] Six cards with the copy in the table, Instrument Serif titles, Inter body.
- [ ] No emoji, no purple, no glassmorphism.
- [ ] Only Instrument Serif and Inter load.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: paper `#efe8d8`, 64px nav with italic 26px "Field Notes", links Essays (current) / Garden / Archive, Replay on the right. Title "Letters from the plot" plus "Issue 09 · Autumn 2026". Six cards in two rows of three.
2. The blob starts at 62% × 48% of the viewport. `body { cursor: none }`. The blob is `pointer-events: none` and does not steal clicks.
3. `pointermove` writes target coordinates. A `requestAnimationFrame` loop lerps current x/y toward the target by **0.14** per frame (~14% of the remaining distance). The blob's `transform: translate(x px, y px)` uses a −84px margin so the 168px square is centred on that point.
4. Each frame, for every `[data-card]`, if the blob centre is inside the card rect inset by 8px, add class `hit`. Otherwise remove it. Multiple cards can theoretically hit if they overlap; they do not overlap here, so one at a time.
5. `.hit`: background `--ink`, colour `--paper`, border `--ink`, `translateY(-8px)` over 280ms expo-out. Index, paragraph and time go paper at 78% opacity.
6. The SVG circles keep a slow `animate` on r / cx / cy (5s, 6s, 4.5s) so the blot breathes while idle.
7. Replay sets current and target to the start position, applies the transform, and removes `.hit` from every card.
8. Reduced motion: lerp factor becomes **1** (blob sticks to the pointer), circle SMIL animation is off, card transition is 1ms. Hit-testing still runs.
9. Nav links `href="#"` preventDefault. Focus-visible restores a default cursor on the focused control so keyboard users can see it.

## Tokens

```css
:root {
  --paper: #efe8d8;            /* page */
  --paper-2: #e4dcc8;          /* card rest */
  --ink: #0f2e22;              /* type, hit fill */
  --ink-2: #3d5a45;            /* card body */
  --ink-3: #7a8f7e;            /* index, dates, replay */
  --line: rgba(15, 46, 34, .16);
  --blob: #143d2c;             /* circle fill */
  --serif: "Instrument Serif", Georgia, serif;
  --sans: "Inter", system-ui, sans-serif;
  --gutter: 48px;
  --t-micro: 160ms;
  --t-card: 280ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role       | Family           | Size | Weight | Line-height | Tracking | Case      |
|------------|------------------|-----:|-------:|------------:|---------:|-----------|
| Page title | Instrument Serif | 36px | italic 400 | 1.1     | −0.02em  | sentence  |
| Card title | Instrument Serif | 26px | italic 400 | 1.15    | −0.02em  | sentence  |
| Brand      | Instrument Serif | 26px | italic 400 | 1       | 0        | Title     |
| Card body  | Inter            | 13.5px | 400  | 1.5         | 0        | sentence  |
| Nav        | Inter            | 12px | 500    | 1           | +0.04em  | Title     |
| Index/date | Inter            | 11px | 500    | 1           | +0.06–.14em | UPPERCASE |
| Replay     | Inter            | 11px | 500    | 1           | +0.12em  | UPPERCASE |

## Implementation notes

**Goo from three circles**, not a morphing path, keeps the SVG tiny:

```xml
<filter id="goo">
  <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b"/>
  <feColorMatrix in="b" mode="matrix"
    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="g"/>
  <feBlend in="SourceGraphic" in2="g"/>
</filter>
```

**Lag and hit-test in one rAF** so they cannot drift:

```js
function tick() {
  const k = reduce ? 1 : 0.14;
  x += (tx - x) * k;
  y += (ty - y) * k;
  blob.style.transform = `translate(${x}px,${y}px)`;
  cards.forEach((c) => {
    const r = c.getBoundingClientRect();
    c.classList.toggle('hit',
      x > r.left + 8 && x < r.right - 8 && y > r.top + 8 && y < r.bottom - 8);
  });
  requestAnimationFrame(tick);
}
```

**Centre with negative margin**, not `translate(-50%,-50%)` stacked on the lerp translate — two translates on the same property overwrite each other.

Common mistakes: `mix-blend-mode: difference` on cream paper (the blot goes magenta). Putting `pointer-events` on the blob so cards never receive hover. Lerping at 0.4, which feels glued, or 0.04, which never catches up.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
