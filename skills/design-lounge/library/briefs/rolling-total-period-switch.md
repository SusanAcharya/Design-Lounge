<!-- Design Lounge Nº 388 · "Rolling total with a jelly period switch" · designlounge.vercel.app -->

# Rolling total with a jelly period switch

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Studied from 60fps.design, a gallery of mobile micro-interaction clips: this piece takes the "number of transactions" idea from its finance shots (a numeric segmented control whose pill springs between options while the account preview reveals or hides rows) and the "ticker" effect tag, and rebuilds them as one working screen. It is the spending view of a fictional money app called Lekha. A dark five-option switch (Day, Week, Month, Quarter, Year) sits above the home clearance. Choosing a period slides a lime pill with a jelly squash proportional to the distance travelled; the big total rolls every digit in its own column, right to left; digit columns open or collapse when the number gets longer or shorter (8,915 → 1,36,480); the transaction count rolls the same way in mono; seven bars spring to new heights with a stagger; and the "Top places" list grows from two to five rows. The detail worth copying is the roller: it keys columns from the right, so the ones digit is always the same element and only the leading columns are added or removed.

The language is calm finance: cool grey page, one deep teal card, ink switch, lime as the single accent, Indian digit grouping.

## Reference behaviour

1. First frame: "Lekha" and an "SA" avatar; "Spent this week"; "Rs 8,915" at 56px; a green chip "↓ 12% less" and "23 transactions"; a teal card "Mon to Sun / avg Rs 1,274" with seven bars M–S, Friday lime; "TOP PLACES" with three rows; the switch with Week selected.
2. Nothing animates on load. Transitions are disabled until 120ms after first paint.
3. Tapping an option scales it to 0.94 while pressed and `navigator.vibrate(6)` fires where available.
4. Selecting moves the lime pill with `translateX` over 500ms on `cubic-bezier(.34,1.56,.64,1)`. At the same time its inner layer plays a 500ms jelly: at 30% it is `scaleX(1 + 0.12 × distance)` (capped at 1.45) and `scaleY(.84)`; at 65% `scaleX(.96) scaleY(1.04)`; then rest.
5. The selected label turns ink on lime; others are `#aeb8c2` on ink.
6. The period label changes immediately: today, this week, in October, Aug to Oct, in 2026.
7. The total rolls: each digit column translates to its new digit over 700ms on `cubic-bezier(.3,1.3,.6,1)`, with a 35ms delay per column counted from the right. New leading columns grow from width 0 and fade in over 450ms; removed columns collapse to 0 and are deleted after 460ms. Commas are fixed-width separators that also grow in or collapse.
8. The transaction count rolls with the same component at 13px mono: 4, 23, 126, 371, 1,488.
9. The delta chip flips between green "↓ 12% less" and rust "↑ 6% more"; its arrow rotates 180° on a 400ms spring.
10. Bars spring to new heights over 600ms, staggered 30ms left to right. The highest-spend bar is lime. Periods with fewer buckets hide unused bars (Quarter shows Aug, Sep, Oct; Month shows W1–W5).
11. The list's visible height animates over 500ms (expo-out) to show 2, 3, 4, 5, 5 rows for Day → Year. Rows beyond the count fade out and lift 6px; rows coming in fade down into place, staggered 40ms.
12. A polite live region announces "Quarter: Rs 1,36,480 spent Aug to Oct, 371 transactions".
13. Keyboard: the switch is a radiogroup with roving tabindex; arrows move and select (wrapping), Home/End jump.

## Structure

```
390 × 844, padding 54 / 20 / 0
┌──────────────────────────────────────┐
│ Lekha                          (SA)  │ 44px
│ Spent this week                      │ 13px, 18px top
│ Rs 8,915                             │ 26px + 56px/800 roller, 60px tall
│ (↓ 12% less)  23 transactions        │ 26px chip, mono count
│ ╭──────────────────────────────────╮ │ teal card r24, padding 18
│ │ Mon to Sun          avg Rs 1,274 │ │
│ │ ▅  ▃  ▆  ▃  █  ▇  ▄             │ │ bars 96px, gap 8
│ │ M  T  W  T  F  S  S              │ │ 10px mono
│ ╰──────────────────────────────────╯ │
│ TOP PLACES                           │ 12px caps
│ [BK] Bhojan Kitchen    34×  Rs 2,140 │ rows 52px, hairline
│ [TM] Thamel Mart       12×  Rs 1,860 │
│ [SR] Sajha Rides       19×  Rs 1,320 │ (2–5 rows visible)
│                                      │
│ ╭──────────────────────────────────╮ │ switch 52px, padding 4
│ │ Day (Week) Month Quarter  Year   │ │ lime pill = 1/5 width
│ ╰──────────────────────────────────╯ │
│ 34px home clearance                  │
└──────────────────────────────────────┘
```

- `main.app` is a flex column; the switch wrapper uses `margin-top: auto` so it sits at the bottom with a fade-to-page gradient above it.
- The total is a `div role="img"` with `aria-label="Rs 8,915"`; the roller inside is not read.
- Each roller slot is a `span.slot` (`data-t="d"` digit or `"s"` separator) with a `span.strip` inside. Digit strips hold ten spans 0–9, each 1.08em tall.
- The count roller is `aria-hidden` with a visually hidden text twin.
- The chart is a `section` labelled "Spending by day" with seven `div.bar` (an `i` for the bar, a `small` for the label).
- The list is a `section` labelled "Top places", a one-row CSS grid whose row height is set in px, with an inner `div` (overflow hidden) holding `h3` and `ul`.
- The switch is a `div role="radiogroup"` labelled "Period" with five `button role="radio"` and an `aria-hidden` pill span holding an inner `i` for the jelly.

## Tokens

```css
:root {
  --bg: #eef1f4;      /* page */
  --card: #0f3b3a;    /* chart card */
  --card-2: #175150;  /* resting bars */
  --ink: #0e1a26;     /* text, switch track */
  --ink-2: #3d4a57;
  --ink-3: #5f6b77;   /* labels, units */
  --line: #d6dce2;    /* row hairlines */
  --white: #fbfcfd;   /* row badges */
  --lime: #c8f25a;    /* accent: pill, top bar, avatar initials */
  --teal-ink: #d7ece9;
  --teal-3: #8fb8b4;  /* card labels */
  --down: #1f7a52;    /* spend fell: chip text on #dcefe4 */
  --up: #9a3d16;      /* spend rose: chip text on #f6e3d8 */
  --sans: "Schibsted Grotesk", system-ui, sans-serif;
  --mono: "DM Mono", ui-monospace, monospace;
  --total: 56px; --cell: 1.08em; --digit-w: .57em; --sep-w: .31em;
  --seg-h: 52px; --row-h: 52px; --bars-h: 96px;
  --r-card: 24px; --r-bar: 8px 8px 4px 4px; --r-pill: 999px;
  --s-2: 8px; --s-3: 12px; --s-4: 14px; --s-5: 18px; --s-6: 20px;
  --spring: cubic-bezier(.34, 1.56, .64, 1);  /* pill slide, arrow */
  --soft: cubic-bezier(.3, 1.3, .6, 1);       /* digit roll, bars */
  --out: cubic-bezier(.16, 1, .3, 1);         /* list height, slot width */
  --std: cubic-bezier(.2, .7, .2, 1);
  --t-pill: 500ms; --t-roll: 700ms; --t-col-stagger: 35ms;
  --t-bars: 600ms; --t-bar-stagger: 30ms; --t-list: 500ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Total digits | Schibsted Grotesk | 56px | 800 | 1.08em cells | 0 in roller, tabular |
| Currency | Schibsted Grotesk | 26px | 700 | 1 | -0.02em |
| Brand | Schibsted Grotesk | 17px | 800 | 1 | -0.02em |
| Period label | Schibsted Grotesk | 13px | 400 / 500 | 1.4 | 0 |
| Delta chip | Schibsted Grotesk | 13px | 500 | 1 | 0 |
| Count | DM Mono | 13px | 500 number / 400 word | 1 | 0 |
| Card labels | Schibsted Grotesk | 13px | 500 | 1.4 | 0 |
| Bar labels, badges, row counts | DM Mono | 10–12px | 400–500 | 1 | 0 |
| Row name | Schibsted Grotesk | 15px | 500 | 1.4 | 0 |
| Row amount | Schibsted Grotesk | 15px | 700 | 1.4 | tabular |
| Switch | Schibsted Grotesk | 13px | 500 | 1 | 0 |

Set letter-spacing to 0 inside the roller. Negative tracking on fixed-width cells pushes glyphs left and makes commas look misplaced.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Delay | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Option press | :active | transform | 1 → 0.94 | 150ms | `--std` | 0 | none |
| Pill slide | select | translateX | old slot → new slot | 500ms | `--spring` | 0 | instant |
| Pill jelly | select | scaleX / scaleY keyframes | 1 → 1+0.12d, .84 → .96, 1.04 → 1 | 500ms | `--std` | 0 | none |
| Digit roll | value change | translateY | -old×1.08em → -new×1.08em | 700ms | `--soft` | 35ms × column from right | instant |
| Column in | longer number | width, opacity | 0 → .57em, 0 → 1 | 450ms / 300ms | `--out` | 0 | instant |
| Column out | shorter number | width, opacity | → 0, then removed | 450ms | `--out` | 0 | removed at once |
| Delta arrow | sign change | rotate | 0 ↔ 180° | 400ms | `--spring` | 0 | instant |
| Bars | value change | height | old% → new% | 600ms | `--soft` | 30ms × index | instant |
| List height | row count change | grid-template-rows (px) | old → new | 500ms | `--out` | 0 | instant |
| Row fade | row shown/hidden | opacity, translateY | 0,-6px ↔ 1,0 | 300ms / 400ms | `--std` / `--out` | 40ms × (index-1) | instant |

## States

- Option resting: `#aeb8c2` on ink. Selected: ink on lime, `aria-checked="true"`. Pressed: 0.94.
- Focus-visible on options: 2px lime outline inset 2px (an ink outline would vanish on the ink track). Elsewhere a 2px ink outline, 3px offset.
- Delta down: `#1f7a52` on `#dcefe4`, arrow down. Delta up: `#9a3d16` on `#f6e3d8`, arrow up.
- Bar resting `--card-2`; highest bar lime.
- Hidden rows: opacity 0, `aria-hidden="true"`.
- Loading (not in demo): keep the previous numbers, dim the roller to 40% and pulse the lime pill opacity 1 → .6; roll when data lands.
- Empty period (not in demo): total "Rs 0", bars at 8% height, list hidden, line "No spending today" in `--ink-3`.

## Accessibility

- `role="radiogroup"` labelled "Period"; each option `role="radio"` with `aria-checked`; roving tabindex; arrows wrap; Home/End jump.
- The total is announced through `role="img"` + `aria-label`, updated on every change; the count has a hidden text twin. Do not expose the digit strips: a reader would say "zero one two three…".
- A polite live region summarises each change in one sentence.
- Row badges ("BK") are `aria-hidden`; the name is the label.
- Contrast: ink on lime ≈ 14:1; `#aeb8c2` on `#0e1a26` ≈ 9:1; `#d7ece9` on `#0f3b3a` ≈ 9.5:1; `#5f6b77` on `#eef1f4` ≈ 5:1; `#1f7a52` on `#dcefe4` ≈ 4.8:1.
- Hit targets: options 44px tall (52 minus padding) × 70px; rows are not interactive in this demo.

## Responsive rules

- At 360 wide the switch keeps five equal options (about 64px each; labels at 13px still fit, "Quarter" is the longest).
- The total at 56px fits "Rs 5,62,905" in 320px. If a product can exceed seven digits, drop to 44px above 9,99,999.
- Below 740px tall, bars drop to 70px and rows to 46px so five rows still clear the switch.
- At tablet width, centre a 420px column; do not stretch the switch.
- Do not draw a status bar.

## Acceptance checklist

### Always

- [ ] Each digit is its own rolling column; columns are keyed from the right.
- [ ] Longer and shorter numbers add or remove leading columns by animating width, never by re-rendering the whole number.
- [ ] Separators follow the locale (Indian grouping here) and animate in or out like digits.
- [ ] The pill slides on a spring and squashes more for longer jumps.
- [ ] Bars and list height change together with the number, staggered, in one gesture.
- [ ] Nothing animates on first paint.
- [ ] Radiogroup semantics, roving tabindex, arrows wrap.
- [ ] Screen readers hear the formatted total, not the digit strips.
- [ ] Reduced motion: every value updates instantly.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Periods Day, Week, Month, Quarter, Year with totals 1,240 / 8,915 / 48,260 / 1,36,480 / 5,62,905.
- [ ] Counts 4 / 23 / 126 / 371 / 1,488 transactions.
- [ ] Places Bhojan Kitchen, Thamel Mart, Sajha Rides, Nanglo Bakery, Kapan Chiya; 2/3/4/5/5 rows shown.
- [ ] Lime `#c8f25a` pill on an ink `#0e1a26` track; teal card `#0f3b3a`.
- [ ] Week selected on load with Friday's bar lime.

## Implementation notes

**1. The roller, keyed from the right.** Reverse the characters and the existing slots and walk them together. Reuse a slot when its type matches; otherwise replace it. Extra slots on the left collapse and are removed.

```js
function roller(el) {
  return str => {
    const chars = [...str].reverse(); const slots = [...el.children].reverse();
    chars.forEach((ch, i) => {
      const isD = /\d/.test(ch); let s = slots[i];
      if (!s || s.dataset.t !== (isD ? 'd' : 's')) {
        const n = makeSlot(isD, ch);           // width 0 via .in
        s ? s.replaceWith(n) : el.prepend(n); s = n;
        requestAnimationFrame(() => requestAnimationFrame(() => n.classList.remove('in')));
      }
      if (isD) { const strip = s.firstElementChild;
        strip.style.transitionDelay = i * 35 + 'ms';
        strip.style.transform = `translateY(${-ch * 1.08}em)`; }
    });
    slots.slice(chars.length).forEach(s => { s.classList.add('in'); setTimeout(() => s.remove(), 460); });
  };
}
```

```css
.roll  { display: flex; overflow: hidden; height: 1.08em; line-height: 1.08em; letter-spacing: 0;
         font-variant-numeric: tabular-nums; }
.slot  { width: .57em; overflow: hidden; transition: width .45s var(--out), opacity .3s var(--std); }
.slot.sep { width: .31em; overflow: visible; }
.slot.in  { width: 0; opacity: 0; }
.strip { display: flex; flex-direction: column; transition: transform .7s var(--soft); }
```

Common mistakes: using `em` cell heights but a `px` translate (they drift at other sizes); keying from the left (every digit rolls when the length changes); forgetting the double rAF, so new columns appear at full width without growing.

**2. Jelly pill.** Slide the outer element; squash the inner one with a keyframe whose stretch depends on distance.

```css
.pill   { position: absolute; top: 4px; left: 4px; bottom: 4px; width: calc((100% - 8px) / 5);
          transition: transform .5s var(--spring); }
.pill i { display: block; height: 100%; border-radius: 999px; background: var(--lime); }
.pill i.jelly { animation: jelly .5s var(--std); }
@keyframes jelly { 30% { transform: scaleX(var(--sx, 1.25)) scaleY(.84); }
                   65% { transform: scaleX(.96) scaleY(1.04); } }
```

```js
const w = (seg.clientWidth - 8) / 5;
pill.style.transform = `translateX(${i * w}px)`;
jelly.style.setProperty('--sx', (1 + Math.min(.45, .12 * Math.abs(i - cur))).toFixed(2));
jelly.classList.remove('jelly'); void jelly.offsetWidth; jelly.classList.add('jelly');
```

**3. List height without `height: auto`.** Use a one-row grid and set the row in px from measured row height × count. Rows past the count fade but stay in the DOM so they can come back.

```js
const h = rows[0].offsetHeight, head = heading.offsetHeight + 8;
list.style.gridTemplateRows = (head + count * h) + 'px';
rows.forEach((li, j) => { li.classList.toggle('off', j >= count); li.setAttribute('aria-hidden', j >= count); });
```

Common mistakes overall:

- Counting up through every intermediate number (1,240 → 1,241 → …). Each column rolls straight to its digit.
- Animating the total with a JS tween and `toLocaleString` every frame; separators jump around.
- A second accent colour for the selected bar or the pill. Lime only.
- Letting the switch float over the list without the fade; rows read under the track.
- Putting the switch at the top; this piece is thumb-reach at the bottom.

Where it sits: the summary tab of a money or analytics app. The roller alone also suits balances, follower counts and order totals.

Rebuild order:

1. Lay out header, period label, total row, meta row, chart card, list and the bottom switch.
2. Build the roller component and test it alone: 8,915 → 1,36,480 → 1,240 → 5,62,905.
3. Tune digit and separator widths at the real font weight until commas sit tight to the left digit.
4. Reuse the roller for the transaction count at 13px.
5. Build the switch with equal options and the sliding pill; add the jelly keyframe.
6. Wire the radiogroup keys and the live-region summary.
7. Drive the bars from data with the stagger; hide unused buckets.
8. Add the list height grid and row fades.
9. Disable transitions until after first paint.
10. Add the reduced-motion override and test at 360 wide and below 740 tall.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
