<!-- Design Lounge Nº 430 · "Terminal crypto trading screen" · designlounge.vercel.app -->

# Terminal crypto trading screen

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The main trade screen of a spot crypto exchange called Tessel. The pair is ARKN/USD (Arkon, a made-up coin). It fills one 1280x800 window with no page scroll. A pair header sits on top. Below it are three columns: a candlestick chart, an order book with recent trades, and an order panel. Everything is set in one mono family at 11-13px, on a near-black ground. Green and red mean up and down and nothing else. Every up or down value also carries an arrow, so the screen still reads for colour-blind users. One amber accent marks the current nav item, the selected range, the last-price line, the slider, and focus. The detail worth copying: up candles are hollow and down candles are filled, so shape carries direction as well as colour.

## Reference behaviour

1. On load the 1H range is selected. The chart shows 64 candles. The last close equals the last price, 41.62.
2. The legend row above the chart shows the last candle: time, O, H, L, C, change % with an arrow, and volume.
3. Moving the pointer over the chart draws a dashed crosshair. The vertical line snaps to the candle centre. The horizontal line follows the pointer. A grey price tag on the right axis shows the price at the pointer.
4. A tooltip box shows Time, Open, High, Low, Close, Vol for the candle under the pointer. It sits 16px right of the candle, or 16px left when it would hit the axis.
5. The legend row updates to the same candle. Leaving the chart hides the crosshair and the tooltip and resets the legend to the last candle.
6. The chart is focusable. Left and Right arrows move the crosshair one candle. Home and End jump to the first and last candle. Escape or blur clears it. The legend is the readout, so no data is hover-only.
7. Clicking 15m, 1H, 4H or 1D swaps the data set: 72, 64, 56 or 48 candles. Each range uses its own seeded data, so it looks the same every time. The last close is scaled to the live price.
8. Every 800ms the market ticks. The price moves by up to 0.025 either way, rounded to 0.01.
9. On each tick: the last candle's close, high and low update; the header price and arrow update; the 24h change updates against an open of 40.24; the mid price updates; about one third of order book sizes change; one new trade is added to the top of Recent trades and the oldest drops off. The list keeps 10 rows.
10. Book rows whose size changed flash an amber wash for 500ms. The new trade row flashes the same way.
11. Each book row has a depth bar behind it. Its width is the running total divided by the larger side's total. Asks fill red from the right. Bids fill green from the right.
12. Asks show 11 rows, lowest price at the bottom, next to the mid. Bids show 11 rows, highest price at the top. Price step is 0.01. Spread is 0.02.
13. The order panel opens on Buy, Market, 25%. Amount is filled from 25% of 12,480.00 USD.
14. Clicking Sell turns the side toggle red, changes Available to 304.150 ARKN, and changes the button to SELL ARKN. The amount is recomputed from the same percent.
15. Limit enables the price field and fills it with the last price minus 0.05. Market disables it and shows the word Market.
16. Dragging the slider or clicking 25%, 50%, 75%, 100% sets the amount. Typing an amount moves the slider to match. The matching quick button gets an amber border.
17. Total is amount times price. The fee line reads "Fee 0.10% taker" for Market and "Fee 0.08% maker" for Limit.
18. An amount above the available balance shows a red border and the message "More than available. Max X ARKN." The submit button is disabled. Zero amount also disables it.
19. Submitting writes a status line, for example "Market buy 74.889 ARKN sent at 41.62." There is no modal.
20. Ticks pause while the tab is hidden.

## Structure

```
1280 x 800, no page scroll
+--------------------------------------------------------------------------------------+
| TESSEL  Trade  Markets  Wallet  Orders                 * Feed live . 41ms  acct 4471-K | 44px
+--------------------------------------------------------------------------------------+
| ARKN/USD  ^ 41.62   24h change  24h high  24h low  24h vol ARKN  24h vol USD          | ~56px
+---------------------------------------------+------------------+---------------------+
| PRICE                     15m [1H] 4H 1D    | ORDER BOOK  0.01 | PLACE ORDER    spot | 36px
| 14:00  O  H  L  C  ^+0.36%  Vol             | Price Size Total | [ BUY ][ SELL ]     |
|                                     42.00   | 11 ask rows 18px | Market  Limit       |
|   candles, hollow up / filled down  [41.62] | ---- mid 41.62 --| Available           |
|   - - - amber last-price line - - - -       | 11 bid rows 18px | [Price      USD]    |
|                                     39.13   +------------------+ [Amount    ARKN]    |
|   volume bars 46px                          | RECENT TRADES    | ====o-----------    |
|   09:00   19:00   05:00   15:00             | 10 rows 18px     | 25% 50% 75% 100%    |
|                                             |                  | Total / Fee         |
|                                             |                  | [ BUY ARKN ]        |
|                                             |                  | BALANCES table      |
+---------------------------------------------+------------------+---------------------+
   minmax(0,1fr)                                 272px              292px
```

- `header.top`: brand, `nav aria-label="Main"` with four links, the current one has `aria-current="page"`.
- `.pair`: a `div` with the pair name, the last price, and a `dl` of five stats.
- `main`: CSS grid `minmax(0,1fr) 272px 292px`, gap 1px on a `--line` background. The gap is the hairline. No borders between columns.
- Chart: `section` with a heading, a `role="group"` of four `aria-pressed` buttons, a legend `div`, and an `svg` with `tabindex="0"` and `role="img"`. The tooltip is an HTML `div` over the SVG, `aria-hidden="true"`.
- Book: `aside aria-label="Order book and trades"`. Column header row, `.asks`, `.mid`, `.bids`, then Recent trades as a `ul`.
- Order panel: `section` with a `form`. Side toggle is a `role="group"` of two `aria-pressed` buttons. Order type is a `role="tablist"` with two tabs. Inputs have `label for`. The slider is `input type="range"`. The quick buttons are a `role="group"`. The submit is a real `button type="submit"`. Balances is a `table` with `th scope="col"`.

## Tokens

```css
:root {
  /* ground */
  --bg: #0a0b0a;        /* page, near-black, faint green bias */
  --panel: #0f1110;     /* column surface */
  --raise: #171a18;     /* inputs, mid row, tooltip, selected range */
  --line: #222624;      /* hairlines and grid gap */
  --line-2: #323833;    /* input borders, tooltip border */

  /* ink */
  --ink: #d9dcd6;       /* values */
  --ink-2: #a3aaa4;     /* section titles, nav */
  --ink-3: #7d867f;     /* labels, axis, timestamps */

  /* direction only */
  --up: #36c27f;
  --down: #f0616d;
  --up-bg: rgba(54, 194, 127, .13);    /* bid depth */
  --down-bg: rgba(240, 97, 109, .13);  /* ask depth */

  /* single accent */
  --amber: #f5a524;
  --on-amber: #160f02;

  --mono: "JetBrains Mono", ui-monospace, Menlo, monospace;

  /* type scale */
  --t-11: 11px; --t-12: 12px; --t-13: 13px; --t-15: 15px; --t-22: 22px;

  /* spacing, 4px base */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-6: 24px; --s-8: 32px;

  /* shape */
  --radius: 0;
  --row: 18px;          /* book and trade row height */
  --bar: 36px;          /* panel header height */

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --flash: 500ms;
  --tick: 800ms;
}
```

No shadows. No radius anywhere. No gradients except the depth bars and the slider fill, which are hard stops.

## Typography

One family. Turn on `font-variant-numeric: tabular-nums` on `body` so columns of prices line up.

| Role | Size | Weight | Line-height | Tracking | Case | Colour |
| --- | --- | --- | --- | --- | --- | --- |
| Body, rows, inputs | 12px | 400 | 1.5 | 0 | as is | `--ink` |
| Labels, axis, col heads | 11px | 400 | 1.35 | 0 | as is | `--ink-3` |
| Panel titles | 12px | 500 | 1.5 | 0.06em | upper | `--ink-2` |
| Brand | 12px | 700 | 1 | 0.14em | upper | `--ink` |
| Pair name | 15px | 700 | 1.25 | 0.04em | upper | `--ink` |
| Last price | 22px | 700 | 1 | -0.01em | - | up or down |
| Stat values | 13px | 400 | 1.35 | 0 | - | `--ink` |
| Mid price | 15px | 700 | 1.2 | 0 | - | up or down |
| Buttons | 12px | 700 | 1 | 0.06em | upper | per state |
| Axis text in SVG | 10.5px | 400 | - | 0 | - | `--ink-3` |

Arrows are the text glyphs ▲ and ▼ at 10px, in a 1.1em wide inline box so numbers do not shift when the arrow changes.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Market tick | every 800ms | numbers, candle, depth width | old → new | instant | - | numbers still update |
| Book row flash | size changed on tick | inset box-shadow amber .16 → 0 | 0.16 → 0 alpha | 500ms | `--ease` | no flash, numbers only |
| New trade row | prepended on tick | same flash | 0.16 → 0 | 500ms | `--ease` | no flash, row still appears |
| Crosshair | pointer move or arrow key | redraw | - | instant | - | same |
| Range switch | click | redraw | - | instant | - | same |
| Submit button | hover | filter brightness | 1 → 1.08 | 150ms | `--ease` | no transition |

The flash restarts by removing the class, reading `offsetWidth`, and adding it back. Check `matchMedia('(prefers-reduced-motion: reduce)')` in JS before adding the class, and also disable the animation in CSS. Rows never slide or reorder with motion. Do not tween the price digits.

## States

- Nav link: rest `--ink-2`. Hover `--ink`. Current `--ink` with a 2px amber bottom border.
- Range button: rest `--ink-3`. Hover `--ink`. Pressed amber text on `--raise`.
- Side toggle: rest `--ink-2` on panel. Buy pressed: `--up` fill, `#04140b` text. Sell pressed: `--down` fill, `#1d0306` text.
- Order type tab: rest `--ink-3`. Selected `--ink` with a 2px amber bottom border.
- Field: rest `--raise` with `--line-2` border. Focus-within: amber border. Error: `--down` border plus a red message line below.
- Disabled price field (Market): text `--ink-3`, value "Market".
- Quick percent: rest `--line-2` border. Hover `--ink-3` border. Pressed amber border and text.
- Submit: Buy is `--up`, Sell is `--down`. Disabled is `--raise` with `--ink-3` text and `cursor: not-allowed`.
- Book row: depth bar behind. Flash on change. Ask price `--down`, bid price `--up`.
- Mid row: `--raise` band, hairlines above and below, arrow plus price in the tick direction.
- Focus-visible: 2px amber outline, offset 2px, on every control including the chart.
- Loading and empty are not shown in this frame. If the feed drops, change the header dot to `--ink-3` and the text to "Feed paused", and stop ticks.

## Accessibility

- Up and down are never colour only. Prices carry ▲ or ▼. Candles are hollow (up) or filled (down).
- The chart `svg` has `role="img"` and a label that names the arrow keys. It has `tabindex="0"`.
- The legend row is the text readout for the chart. Keyboard users get the same OHLC values as pointer users.
- The tooltip is `aria-hidden="true"` because the legend repeats it.
- Do not put `aria-live` on the order book or the trades. They change every 800ms and would flood a screen reader.
- The status line under the submit is `role="status"`. The amount error is `aria-live="polite"` and linked by `aria-describedby`. The amount input gets `aria-invalid="true"` when over balance.
- The range slider has `aria-label="Share of available balance"` and `aria-valuetext="25 percent"`.
- Order type tabs: Left and Right arrows move and select. Only the selected tab is in the tab order.
- Toggle buttons use `aria-pressed`. Tabs use `aria-selected`. Do not mix.
- Contrast: `#d9dcd6` on `#0f1110` is about 13:1. `#7d867f` on `#0f1110` is about 4.8:1. `#36c27f` and `#f0616d` both clear 4.5:1 on `#0f1110`.
- Focus order: nav, range buttons, chart, side toggle, order type, price, amount, slider, quick buttons, submit.

## Responsive rules

- 1280 and up: three columns, `minmax(0,1fr) 272px 292px`. `body` is `overflow: hidden`, height 100%.
- 1024 (and anything up to 1100): the page scrolls. The grid becomes two equal columns. The chart spans both columns at 440px tall. The book sits left and the order panel sits right.
- 768: same two-column grid. The pair stats wrap to a second line.
- Under 640 (and up to 767): one column. Order is chart (340px tall), book, trades, order panel, balances. The nav links and the feed status hide; brand and account stay. The five stats become a 2-column grid. The chart shows 4 time labels instead of 7.
- At 390 wide nothing overflows sideways. Every grid track is `minmax(0,1fr)`.
- Redraw the chart on `resize` from the SVG's own `clientWidth` and `clientHeight`. Do not hard-code a 1280 viewBox.

## Acceptance checklist

### Always

- [ ] One mono family for the whole screen, with tabular numbers.
- [ ] Green and red appear only for up and down. Every coloured value also has ▲ or ▼.
- [ ] Up candles are hollow with a green stroke. Down candles are filled red.
- [ ] One accent colour. It marks current nav, selected range, last-price line and tag, slider, and focus.
- [ ] Columns are separated by a 1px grid gap, not borders or shadows. Radius is 0.
- [ ] The crosshair works with pointer and with arrow keys. The legend row shows the same values.
- [ ] The order book ticks on a fixed interval. Changed rows flash once. Reduced motion keeps the numbers and drops the flash.
- [ ] Depth bars are proportional to the running total.
- [ ] The amount over balance shows an error and disables submit.
- [ ] No horizontal scroll at 390px.

### This demo

- [ ] Brand TESSEL, pair ARKN/USD, last price starts at 41.62, 24h open 40.24.
- [ ] Ranges 15m, 1H, 4H, 1D with 72, 64, 56, 48 candles. 1H starts selected.
- [ ] Tick every 800ms. 11 asks, 11 bids, step 0.01, spread 0.02, 10 recent trades.
- [ ] Available 12,480.00 USD on Buy and 304.150 ARKN on Sell. Starts at 25%.
- [ ] Fee 0.10% taker on Market, 0.08% maker on Limit.
- [ ] Columns 272px and 292px. Header 44px. Panel headers 36px. Rows 18px.

## Implementation notes

**1. Seeded data, scaled to the live price.** Use a tiny PRNG so each range looks identical every load. Generate from any start, then scale every OHLC by `price / lastClose`.

```js
const rng = seed => () => {
  seed = seed + 0x6D2B79F5 | 0;
  let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
function gen(n, vol, r) {
  const out = []; let p = 30;
  for (let i = 0; i < n; i++) {
    const o = p, c = o * (1 + (r() - .46) * vol * 2);
    const h = Math.max(o, c) * (1 + r() * vol * .8);
    const l = Math.min(o, c) * (1 - r() * vol * .8);
    out.push({ o, h, l, c, v: 300 + r() * 1500 }); p = c;
  }
  const f = price / p;
  out.forEach(d => { d.o *= f; d.h *= f; d.l *= f; d.c *= f; });
  return out;
}
```

Volatility per range: 15m 0.004, 1H 0.008, 4H 0.016, 1D 0.034.

**2. Chart geometry.** Left pad 10px, right axis 62px, bottom labels 20px, volume band 46px, top 12px. Candle width is `cw = (W - 72) / n`, body is 62% of `cw`, minimum 1px tall. Pad the price range by 6% above and below. Draw 5 grid lines with labels. Map the pointer back with `Math.floor((x - 10) / cw)`. Ignore pointer moves over the axis.

**3. Depth bars without extra elements.** One custom property per row, one gradient.

```css
.row { height: 18px; --d: 0%; display: grid; grid-template-columns: 1fr 1fr 1fr; }
.asks .row { background: linear-gradient(to left, var(--down-bg) var(--d), transparent var(--d)); }
.bids .row { background: linear-gradient(to left, var(--up-bg) var(--d), transparent var(--d)); }
.row.f { animation: flash .5s var(--ease); }
@keyframes flash {
  from { box-shadow: inset 0 0 0 99px rgba(245,165,36,.16); }
  to   { box-shadow: inset 0 0 0 99px rgba(245,165,36,0); }
}
@media (prefers-reduced-motion: reduce) { .row.f { animation: none; } }
```

The flash uses an inset shadow so it does not fight the depth gradient on `background`.

**4. Build rows once.** Create 11 ask and 11 bid row elements at start. On each tick set `textContent` and `--d`. Do not rebuild the list with `innerHTML` every 800ms; that kills focus and costs layout.

**5. Slider and amount stay in sync both ways.**

```js
function setPct(v) {
  pct.value = v;
  const p = otype === 'limit' ? +px.value || price : price;
  amt.value = (side === 'buy' ? AV.buy * v / 100 / p * .999 : AV.sell * v / 100).toFixed(3);
  recalc();
}
// typing an amount: pct.value = Math.round(min(100, amount / cap * 100))
pct.style.setProperty('--p', pct.value + '%'); // fill: linear-gradient(to right, amber var(--p), line-2 var(--p))
```

The `.999` leaves room for the fee so a 100% buy never exceeds the balance.

Common mistakes:

- Colour-only up and down. Add the arrows and the hollow and filled candles.
- A second accent (blue links, purple buttons). Amber is the only accent.
- Putting `aria-live` on the book.
- Letting the chart SVG set a fixed pixel width so the middle column overflows at 1024.
- Animating row positions so the book jumps. Prices shift in place.
- Using `setInterval` faster than 800ms, or not pausing when `document.hidden`.
- Proportional digits. Prices jitter sideways without `tabular-nums`.
- Rounded corners or soft shadows on the panels.

Rebuild order:

1. Tokens, mono family, tabular numbers.
2. Top bar and pair header.
3. Three-column grid with the 1px gap.
4. Chart: data, candles, axis, last-price line, then crosshair and keyboard.
5. Order book rows, mid row, depth bars.
6. Recent trades list.
7. Order form: side, type tabs, fields, slider, quick buttons, total, fee, error, submit.
8. Tick loop, then reduced motion.
9. Breakpoints at 1100 and 767.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
