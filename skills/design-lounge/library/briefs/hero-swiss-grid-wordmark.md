<!-- Design Lounge Nº 152 · "Swiss grid wordmark hero" · www.designlounge.live -->

# Swiss grid wordmark hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The top of a website for Raster, a fictional wayfinding and identity office in Zürich and Rotterdam. The 12-column layout grid is drawn on the page as 1px hairlines, and every element sits on it. The wordmark "RASTER" is set at 304px. Each of its six letters fills exactly two columns, and on load each letter slides up out of its own clipped cell with a 70ms stagger. Hovering any column tints it ultramarine, numbers it in blue and recolours the letter inside it. The detail worth copying: the grid is the interaction. Your pointer finds a column, and the column answers.

## Structure

```
1280 × 800, margins 40, 12 cols, gutter 16  (col ≈ 85.3px)
┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐
│■ Raster  │        │ Work Studio Index Journal │[Start a project →]│  nav 56, 1px rule
├──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┤
│OFFICE   SINCE           PRACTICE           COORDINATES│  meta, mono 11
│                                                        │
│ R    │ A    │ S    │ T    │ E    │ R    │  wordmark 304px, each letter = 2 cols
│══════════════════════════════════════════│  2px ink rule (draws)
│ lede 26px (cols 1–5)  │ 01 services (7–9)│ CURRENT plate (10–12)│
│                                          │ See all 148 projects →│
│                                                     [Replay]     │
│RECENT │ Kunsthaus │ Port of │ Stadtwerk │ Grotesk │ Rheinufer │  index, bottom 44
│01  02  03  04  05  06  07  08  09  10  11  12│  column numbers
└──────────────────────────────────────────────┘
rotated side label at x=12, vertically centred
```

- `.cols` is `position:absolute; inset:0 40px`, a 12-column grid with 12 `.col` divs, `aria-hidden`, `pointer-events:none`.
- `<header><nav class="g">` is the same grid template. Mark spans columns 1–2, the `<ul>` spans 7–10, the CTA spans 11–12.
- `.meta` is four `<div>`s with a bold mono caption, at columns 1–2, 3–4, 7–8 and 11–12 (right-aligned).
- `<h1 class="g word" aria-label="Raster">` contains six `aria-hidden` `.cell` spans, each `grid-column: span 2`, each wrapping one `<b>` letter.
- `.rule` is a zero-height div whose `::after` is the 2px line.
- `.lower` holds a `<p class="lede">` (columns 1–5), an `<ol class="svc">` (7–9) and `.now` (10–12) with the project plate.
- `.idx` is an absolutely positioned grid row at `bottom:44px`: a label plus five `<a>`s.
- `<button class="replay">` is absolute at `right:40px; bottom:118px`.

## Motion

| Element          | Trigger           | Property     | From → To          | Duration | Easing  | Delay |
|------------------|-------------------|--------------|--------------------|---------:|---------|-------|
| Wordmark letter  | load / replay     | translateY   | 105% → 0           | 820ms    | `--expo`| 120ms + i × 70ms |
| Rule `::after`   | load / replay     | scaleX       | 0 → 1 (origin left)| 900ms    | `--expo`| 80ms  |
| Column           | pointer enters    | background   | transparent → `--blue-tint` | 200ms | `--ease` | 0 |
| Letter colour    | its column hovered| color        | `--ink` → `--blue` | 200ms    | `--ease`| 0     |
| Column number    | column hovered    | color        | `--ink-3` → `--blue` | 200ms  | `--ease`| 0     |
| Nav / index links| hover             | color, border| → ink / blue       | 160ms    | `--ease`| 0     |

Replay works by removing the `.play` class from `<body>`, forcing a reflow (`void body.offsetWidth`) and adding it back. Reduced motion: no animations. Letters and the rule render in their final position, and transitions drop to 1ms. Column tinting still works.

## States

- **Column hover:** tint fill, blue number, blue letter. Gutters are dead zones.
- **Nav link hover:** colour `--ink`, 1px ink bottom border. **Current route** ("Work"): `aria-current="page"`, colour `--ink`.
- **CTA hover:** background `--blue`, text `--blue-ink`.
- **Index link hover:** text and top rule `--blue`.
- **Replay hover:** border and text go to `--ink`.
- **Focus-visible (all links, buttons):** 2px `--blue` outline, 3px offset. Square, no radius anywhere.

## Accessibility

- The `<h1>` carries `aria-label="Raster"`. The letter cells are `aria-hidden`, so screen readers hear one word.
- The column overlay and the rotated side label are `aria-hidden`. They are decoration.
- Tab order: brand, the four nav links, the CTA, the "See all" link, the five index links, Replay.
- Hovering adds no information, so it needs no keyboard equivalent. Replay is a real `<button>`.
- Contrast: `--ink-2` on paper is 8.2:1, and `--ink-3` (3.4:1) is used only for 10–11px mono captions and column numbers that repeat other information. If the design system demands 4.5:1 throughout, darken it to `#6b6a64`.
- The CTA is 34px tall. Pad it to 40px on touch devices.

## Responsive rules

- ≥ 1280: as specified. `--word` stays 304px.
- 1024–1279: set `--word: 23.75vw`, which keeps each letter inside its two columns. Drop the side label.
- 768–1023: go to 6 columns, so each letter is 1 column. Keep `--word: 23.75vw` (letters get narrower than 2 columns of 12). The lede takes the full width. Services and the "now" plate sit side by side, 3 columns each. The bottom index shows 3 items.
- < 640: 4 columns. Set the wordmark on two lines, RAS / TER, with each letter in a 1.33-column cell. Nav collapses to the mark plus a "Menu" button. Hide the index and column numbers but keep the hairlines.

## Acceptance checklist

- [ ] Exactly 12 hairline columns, 40px margins, 16px gutters, running the full viewport height.
- [ ] Each wordmark letter spans exactly 2 columns and is clipped by its own cell.
- [ ] Letters rise 105% → 0 over 820ms on `cubic-bezier(.16,1,.3,1)` with a 70ms stagger, R first.
- [ ] The 2px rule under the wordmark draws left to right over 900ms.
- [ ] Hovering a column tints only that column, and the letter above it turns `#1d33f0`.
- [ ] Gutters and leaving the window clear the tint.
- [ ] Clicking blank space or the Replay button restarts both animations from zero. Clicking a link does not replay.
- [ ] The `<h1>` is announced as "Raster", not as six letters.
- [ ] Focus rings are 2px blue with a 3px offset on every link and button.
- [ ] Reduced motion shows the final frame with no movement, and tinting still works.
- [ ] Nothing overlaps at 1280×800: the bottom index sits clear of the column numbers and the Replay button.
- [ ] Only two font families load, and no radius appears anywhere.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: warm paper page (`#eeede7`) with 12 full-height column bands, each with 1px hairlines on both edges and a mono column number (`01`–`12`) 14px from the bottom.
2. On load, a 2px ink rule under the wordmark draws left to right (scaleX 0 → 1, 900ms, expo-out, 80ms delay).
3. At the same time, letters R-A-S-T-E-R rise from `translateY(105%)` to 0 inside cells with `overflow:hidden`. The cells are 2 columns wide and 237px tall. Each letter lasts 820ms on expo-out, with a 120ms base delay plus 70ms per letter. The last letter lands at about 1290ms.
4. Moving the pointer over any column (hit-tested against the column rect, gutters excluded) gives that column a `rgba(29,51,240,.07)` fill, turns its number `--blue`, and turns the wordmark letter that occupies it `--blue`. Columns 1–2 map to letter 0, columns 3–4 to letter 1, and so on. The tint changes over 200ms. Only one column is ever active.
5. When the pointer leaves the document or sits in a gutter, the tint clears.
6. Clicking anywhere except a link replays the full entrance (rule plus letters). The bottom-right "Replay" button does the same. Links `preventDefault` in the demo.
7. Nav links get a 1px ink underline and full-ink colour on hover. The black "Start a project" button turns `--blue` on hover.
8. The bottom "Recent" index has 5 projects, each spanning 2 columns with a 1px ink top rule that turns blue on hover.

## Tokens

```css
:root {
  /* colour */
  --paper: #eeede7;              /* page */
  --paper-2: #e4e3dc;            /* reserved surface */
  --ink: #111110;                /* type, rules, CTA */
  --ink-2: #4a4a46;              /* meta + nav text */
  --ink-3: #85847d;              /* mono captions, column numbers */
  --hair: rgba(17,17,16,.14);    /* column hairlines */
  --hair-strong: rgba(17,17,16,.32); /* nav rule, replay border */
  --blue: #1d33f0;               /* the one accent */
  --blue-tint: rgba(29,51,240,.07); /* hovered column fill */
  --blue-ink: #f3f4ff;           /* text on blue/ink */

  /* type */
  --sans: "Familjen Grotesk", Helvetica, Arial, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;
  --word: 304px;                 /* wordmark size */

  /* layout */
  --m: 40px;                     /* page margin */
  --gap: 16px;                   /* gutter */
  --nav-h: 56px;

  /* motion */
  --t-micro: 160ms;
  --t-tint: 200ms;
  --t-letter: 820ms;
  --t-rule: 900ms;
  --stagger: 70ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role             | Family           | Size  | Weight | Line-height | Tracking | Case      |
|------------------|------------------|------:|-------:|------------:|---------:|-----------|
| Wordmark letter  | Familjen Grotesk | 304px | 700    | 0.78        | −0.06em  | UPPERCASE |
| Lede             | Familjen Grotesk | 26px  | 500    | 1.18        | −0.018em | sentence  |
| Nav links        | Familjen Grotesk | 14px  | 400    | 1.45        | 0        | Title     |
| Brand / CTA      | Familjen Grotesk | 15/13px | 700/500 | 1       | −0.01em  | Title     |
| Services, index  | Familjen Grotesk | 14/13px | 400  | 1.3         | 0        | sentence  |
| Meta caption     | JetBrains Mono   | 10px  | 500    | 1.5         | +0.08em  | UPPERCASE |
| Meta value       | JetBrains Mono   | 11px  | 400    | 1.5         | +0.02em  | sentence  |
| Column numbers   | JetBrains Mono   | 10px  | 500    | 1           | +0.04em  | numerals  |
| Side label       | JetBrains Mono   | 10px  | 500    | 1           | +0.14em  | UPPERCASE |

Give each letter `margin-left:-.035em` so the R's stem sits on the column's left hairline.

## Implementation notes

**Build the hit-test from the column rects, not from maths.** That way gutters and margins are handled for free:

```js
addEventListener('pointermove', (e) => {
  let hit = -1;
  cols.forEach((c, i) => {
    const r = c.getBoundingClientRect();
    if (e.clientX >= r.left && e.clientX <= r.right) hit = i;
  });
  setCol(hit); // toggles .on on cols[hit] and cells[hit >> 1]
});
```

**The overlay and the content share one grid template**, so they can never drift:

```css
.g, .cols { display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 16px; }
.g { padding: 0 40px; position: relative; z-index: 2; }
.cols { position: absolute; inset: 0 40px; z-index: 1; pointer-events: none; }
.cell { grid-column: span 2; overflow: hidden; height: calc(var(--word) * .78); }
```

**Replayable keyframes:**

```css
.cell b { transform: translateY(105%); }
.play .cell b { animation: rise 820ms cubic-bezier(.16,1,.3,1) both;
                animation-delay: calc(var(--i) * 70ms + 120ms); }
@keyframes rise { to { transform: translateY(0); } }
```

Common mistakes: using `line-height:1`, which makes the cell too tall so the letter floats above the rule. Putting `pointer-events` on the column layer, which blocks the links. Forgetting `aria-hidden` on the letter spans.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
