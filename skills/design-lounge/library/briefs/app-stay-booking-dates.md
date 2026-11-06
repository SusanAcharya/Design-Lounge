<!-- Design Lounge Nº 671 · "Stay booking with an honest total" · www.designlounge.live -->

# Stay booking with an honest total

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The date step of booking a holiday stay: Casa do Vale, a fictional stone cottage in Monsaraz, Alentejo. A compact listing card sits on top, then a check-in / check-out summary, then a phone-native month grid where every free date shows its nightly price and booked dates are struck through. Guests and a full price breakdown follow, and a glass bottom bar shows the all-in total from the first frame. The language is iOS 26: a 44px circular back button, a translucent bottom toolbar, 20px card radii, one olive action. Everything is set in Newsreader with optical sizing, so it reads like a guest house's printed rate card. The detail worth copying is honesty: the total includes cleaning and tourist tax before you tap anything, weekend nights are priced on the grid, and the first booked day after your check-in turns into a "check-out only" date instead of a dead end.

## Structure

```
390 × 844, page scrolls under a fixed glass bar
┌──────────────────────────────────────┐
│ 54 safe area                         │
│ (<)     Choose your dates       (^)  │  nav 44, round buttons 44
│ ╭──────────────────────────────────╮ │
│ │[pic] Casa do Vale          22px  │ │  listing, pic 84 r14, card r20
│ │      Stone cottage · Monsaraz    │ │
│ │      * 4.92 · 138 reviews · 4    │ │
│ ╰──────────────────────────────────╯ │
│ ╭──────────────────────────────────╮ │
│ │[CHECK-IN ] (4 nights) CHECK-OUT  │ │  1fr auto 1fr, fields 56 tall
│ │[Fri 11 Dec]           Tue 15 Dec │ │
│ ╰──────────────────────────────────╯ │
│ December 2026              (<) (>)   │  24px title, 44 arrows
│  M   T   W   T   F   S   S           │  12px, 24 tall
│      1̶   2̶   3̶   4   5   6           │  cells 54 tall, pill 46×50 r16
│         ...  [11]▓▓12▓▓▓13▓          │  sage band behind range
│ ▓14▓[15]  16  17  1̶8̶  1̶9̶  2̶0̶         │
│ note line (aria-live)                │
│ ╭ Adults        (−) 2 (+) ╮          │  rows 64, steppers 40
│ ╰ Children      (−) 0 (+) ╯          │
│ Price for your stay                  │
│ ╭ 4 nights … Cleaning … Tax … Total ╮│  rows 48, total row 60
│ fine print                           │
│ €661                     [ Reserve ] │  glass bar, padding 12 16 34
│ Total for 4 nights · all fees …      │  Reserve 52 tall, r14
└──────────────────────────────────────┘
```

- `<header class="nav">`: back `<button>`, `<h1>`, share `<button>`.
- `<article class="listing" aria-label="Casa do Vale">`: an `aria-hidden` CSS landscape (sky, sun, hill, whitewashed house with terracotta roof and olive door, cork oak) plus name and meta.
- `.when`: two `<button class="field">` and the nights pill.
- `<section class="cal" aria-labelledby>`: month header with arrows, weekday row (`aria-hidden`), a `role="group"` of day `<button>`s with `aria-pressed` and full `aria-label`s ("Fri 11 Dec, €158 a night, check-in"), then the `aria-live` note.
- `.card[role=group][aria-label=Guests]` with two stepper rows; outputs are `aria-live`.
- `.card.bd` breakdown rows, `.fine` paragraph.
- Fixed `.bar` with `.tot` and the Reserve `<button>`.

## Motion

| What | Trigger | Property | From → to | Duration | Easing | Delay | Reduced motion |
|---|---|---|---|---|---|---|---|
| Range band | range completes | `scaleX` (origin left) on each cell's `::before` | 0 → 1 | 360ms | `--expo` | index × 18ms | band shown at once |
| Total tick | total changes | `opacity`, `translateY` | .2, 6px → 1, 0 | 320ms | `--expo` | 0 | none |
| Pill select | tap | `background`, `color` | → ink / surface | 200ms | `--std` | 0 | instant |
| Field ring | next end changes | `box-shadow`, `background` | → 2px ink inset | 200ms | `--std` | 0 | instant |
| Reserve press | `:active` | `scale` | 1 → .97 | 120ms | `--std` | 0 | same |

Edits that don't finish a range (new check-in, month switch, field taps) redraw without the sweep.

## States

- **Free date**: number plus nightly price; hover fills `#E8E3D9`.
- **Booked**: struck number in `--off`, no price, `aria-disabled="true"`; still focusable so it can explain itself.
- **Check-out only**: the first booked date after check-in while choosing check-out; olive "out only" label, selectable.
- **Check-in / check-out**: 46×50 ink pill (r16) with surface-coloured number and price; band half-cells extend from it towards the range.
- **In range**: sage band across the full cell.
- **Next end**: the field it will set has a 2px ink inset ring on the ground colour.
- **Refusal**: note gets the warm plate (`--warn` on `--warn-bg`, r12, 8/12 padding).
- **No check-out**: nights pill "0 nights", breakdown shows one prompt row, bar shows the nightly rate, Reserve disabled (`#B9B3A8` with ink text).
- **Stepper at limit**: button ring `#C9C2B6`, icon `#9A948A`, `disabled`.
- **Focus-visible**: 2px olive outline, 2px offset.

## Accessibility

- Day buttons carry the whole story in `aria-label` ("Mon 14 Dec, €142 a night, check-in"; "Fri 18 Dec, check-out only"; "Sun 20 Dec, booked") and `aria-pressed` for the two ends; the visible number and price are `aria-hidden` inside.
- The note is `aria-live="polite"`; a hidden live region announces the full result after each change: "4 nights, Mon 14 Dec to Fri 18 Dec. Total €629 including cleaning and tax." It stays silent on first load.
- After a grid tap focus stays on the tapped date even though the grid re-renders.
- Field buttons say which end the next tap sets ("Check-out not set, next tap sets this").
- Guest steppers are real buttons with "More adults" / "Fewer children" labels; counts are `aria-live` outputs.
- Contrast: struck dates 4.7:1, nightly prices 5.7:1 on the ground; olive-ink on olive 7.3:1; text on the glass bar is measured against its 90% fill.
- Hit targets: day cells 50×54, arrows and round buttons 44, steppers 40, Reserve 52.

## Responsive rules

- At 360 wide: columns are `minmax(0,1fr)` so cells shrink to 46px; the pill stays 46 wide and the day number stays 18px; drop the field values to 16px.
- Taller phones: nothing stretches; the bar stays pinned and the page gains space below.
- Tablet: the column caps at 430px and centres; the bar caps at 430px too. At tablet width a two-month view side by side is a fair upgrade, but keep the single-column bar.
- `documentElement.scrollWidth` stays 390. Default button padding on the day cells is the usual overflow culprit: set it to 0.

## Acceptance checklist

**Always**
- [ ] The total in the bar includes every fee from the first frame; no "from" price once a range exists.
- [ ] Free dates show their own nightly price; booked dates are struck, not just greyed, and still pass 4.5:1.
- [ ] Two taps make a range; the band sweeps left to right only when a range completes.
- [ ] A range over a booked night is refused with a sentence that names the date and the alternative.
- [ ] The first booked date after check-in is offered as check-out only.
- [ ] Minimum stay is enforced with a message, not silently.
- [ ] Guests cap at the listing's capacity and the tax follows adults × nights.
- [ ] Reserve is disabled without a check-out.
- [ ] Hidden live region is at least 64px wide so it never reads as a collapsed column.
- [ ] Reduced motion: no sweep, no tick; selection still clear.

**This demo**
- [ ] Casa do Vale, Monsaraz, 4.92 from 138 reviews, sleeps 4.
- [ ] €142 a night, €158 Friday and Saturday; cleaning €45; tourist tax €2 per adult per night up to 7 nights; service fee €0.
- [ ] Starts on Fri 11 Dec to Tue 15 Dec, 2 adults: €600 + €45 + €16 = €661.
- [ ] Booked: 1–3, 18–21, 26, 27, 31 Dec; 1, 2, 9, 10, 23–25 Jan.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: Fri 11 Dec to Tue 15 Dec is selected, the pill reads "4 nights", December 2026 is shown (Monday-first). Booked and struck: 1–3, 18–21, 26, 27, 31 Dec. Each free date shows €142, or €158 on Friday and Saturday. The bar reads "€661 / Total for 4 nights · all fees included" and **Reserve** is enabled.
2. The check-in field carries a 2px ink ring: the next tap on the grid sets a new check-in.
3. Tap a free date: it becomes check-in (ink pill), check-out clears to "Add date", the ring moves to the check-out field, the pill reads "0 nights", the note reads "Now tap your check-out date." The bar shows that night's rate "€142 / a night · pick check-out for the total" and **Reserve** is disabled.
4. While choosing check-out, the first booked date after check-in shows "out only" in olive instead of a price and is tappable: the night before it is free, so you can leave that morning.
5. Tap a later free date (or the out-only date): the range fills with a sage band that sweeps in from the left one cell at a time (18ms stagger, 360ms each), both ends become ink pills, the breakdown and total update and the total ticks up 6px into place.
6. A range that would cover a booked night is refused with a warm note: "The night of Fri 18 Dec is booked, so check out on Fri 18 Dec at the latest." A one-night range is refused: "Casa do Vale has a 2-night minimum."
7. Tapping a struck date says "Sun 20 Dec is already booked." Tapping the check-in or check-out field moves the ring there and the next grid tap edits that end.
8. The month arrows switch between December 2026 and January 2027 (the only two bookable months); the selection carries across months.
9. Guests: Adults 1–4, Children 0–3, never more than 4 together (Sleeps 4); at the cap both + buttons disable. Adults change the tourist tax (€2 × adults × nights, at most 7 nights); children pay none.
10. Breakdown rows: nights with a split ("2 × €142 + 2 × €158"), Cleaning €45 once, Tourist tax with its formula, Service fee €0 "None on this stay", Total. A fine-print line covers VAT and the cancellation date.
11. **Reserve** reads "Requested" for 1.6s.

## Tokens

```css
:root {
  --bg: #F3F0EA;          /* page ground, limewash */
  --surface: #FFFDF8;     /* cards, round buttons */
  --ink: #1E1C18;         /* text, selected pills */
  --ink-2: #625D55;       /* secondary, 5.7:1 on --bg */
  --off: #6F6A62;         /* struck booked dates, 4.7:1 on --bg */
  --rule: #E1DBD0;        /* card borders, row hairlines */
  --edge: #8D867B;        /* stepper rings, 3.5:1 */
  --olive: #3E5A2B;       /* the one action colour, focus ring, out-only */
  --olive-ink: #FAF8F1;   /* text on olive, 7.3:1 */
  --band: #DFE6D2;        /* range band, nights pill */
  --warn: #7A3B12;        /* refusal note text */
  --warn-bg: #F6E7D8;     /* refusal note plate, 7.0:1 with --warn */
  --glass: rgba(251, 249, 244, .9);  /* bottom bar, blur 20px saturate 1.4 */
  --disabled: #B9B3A8;    /* Reserve disabled fill, ink text on it */

  --serif: "Newsreader", Georgia, serif;   /* opsz 6..72, font-optical-sizing auto */
  --fs-total: 26px; --fs-month: 24px; --fs-name: 22px; --fs-section: 20px;
  --fs-day: 18px; --fs-field: 18px; --fs-row: 17px; --fs-body: 16px;
  --fs-meta: 14px; --fs-small: 13px; --fs-label: 12px; --fs-price: 11px;

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-6: 24px;
  --r-card: 20px; --r-cell: 16px; --r-field: 14px; --r-btn: 14px; --r-pill: 999px;
  --glass-blur: blur(20px) saturate(1.4);

  --std: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --t-micro: 120ms; --t-state: 200ms; --t-tick: 320ms; --t-band: 360ms; --stagger: 18ms;
}
```

## Typography

One family, Newsreader, optical sizes on.

| Role | Size / line | Weight | Tracking | Notes |
|---|---|---|---|---|
| Total in bar | 26px / 1.05 | 600 | −0.01em | tabular |
| Month title | 24px | 500 | −0.01em | |
| Listing name | 22px / 1.1 | 500 | −0.01em | |
| Section heading | 20px | 500 | 0 | "Price for your stay" |
| Day number | 18px / 1 | 400 | 0 | tabular; struck with 1.5px line |
| Field value | 18px | 500 | 0 | nowrap |
| Row label / total row | 17px / 18px | 500 / 600 | 0 | |
| Nav title, Reserve | 17px | 600 | 0 | |
| Body, breakdown | 16px / 1.4 | 400 | 0 | amounts tabular |
| Meta, notes | 14px | 400 | 0 | |
| Field label | 12px | 500 | 0.06em | upper |
| Weekday | 12px | 600 | 0.04em | upper |
| Nightly price | 11px | 400 | 0.01em | "out only" 10px 600 olive |

## Implementation notes

1. **Dates as ISO strings.** Compare and walk days as `YYYY-MM-DD` at noon UTC; string comparison orders them and noon avoids DST rollovers.

```js
const iso = (d) => d.toISOString().slice(0, 10);
const D = (s) => new Date(s + 'T12:00:00Z');
const add = (s, n) => { const d = D(s); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
const firstBooked = (ci) => { for (let x = add(ci, 1), i = 0; i < 62; x = add(x, 1), i++) if (BOOKED.has(x)) return x; return null; };
// nights are ci .. co-1; a booked check-out day is fine, a booked night is not
for (let x = st.ci; x < co; x = add(x, 1)) if (BOOKED.has(x)) return refuse(x);
```

2. **The band is a pseudo-element, not the button.** Each range cell paints a full-width band; the ends paint half. The pill sits above with `z-index:1`. Only grids that have a check-out get the half-band on check-in, so a lone check-in doesn't trail a stub.

```css
.d.in::before, .rng .d.ci::before, .d.co::before {
  content: ""; position: absolute; inset: 2px 0; background: var(--band);
  transform-origin: left; animation: band 360ms cubic-bezier(0.16,1,0.3,1) backwards;
  animation-delay: calc(var(--i, 0) * 18ms);
}
.rng .d.ci::before { left: 50% } .d.co::before { right: 50% }
.still .d::before { animation: none !important }   /* redraws that aren't a new range */
```

3. **One price function feeds every surface.** Breakdown, bar, nights pill and the announcement read the same numbers, so they can't drift.

```js
const nn = nightsOf(), lo = nn.filter((s) => rate(s) === 142).length, hi = nn.length - lo;
const stay = lo * 142 + hi * 158, tax = 2 * st.a * Math.min(nn.length, 7);
const total = nn.length ? stay + 45 + tax : 0;
```

Common mistakes: hiding fees until the last screen, disabling every booked date (so a guest can't check out on the morning someone else arrives), and a 7-column grid of buttons that overflows 390px because of default button padding.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
