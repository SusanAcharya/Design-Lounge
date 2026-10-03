<!-- Design Lounge Nº 226 · "Event ticket checkout" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Event ticket checkout

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Keep the honest timer and the itemised fees whatever the look.

## What it is

Step one of buying tickets for Chrome Heart, an all-night club event at Halle Null in Berlin. Three columns: the event and ticket types on the left, a seat map in the middle, the order summary on the right. A 10:00 hold timer sits in the top bar. The look is a Y2K night club: near-black, wide extended capitals, mono numbers, one acid pink for "yours", and a chrome-silver gradient used in exactly three places (poster title, stage arc, VIP seat outline). The detail worth copying is honesty. Every fee is a line with its per-ticket rate, the total on the button matches the total in the summary, and when the timer hits 00:00 the seats really are released and the page says which ones.

## Reference behaviour

1. First frame: General quantity 2, VIP 0, Early bird sold out. Seats E7 and E8 are selected in pink. The timer reads 10:00 and starts counting down at once.
2. The summary shows 2 × General €56.00, Service fee €5.00 (€2.50 × 2), Venue levy €2.00 (€1.00 per ticket), Seats E7, E8, Total €63.00. The pink button reads "Continue · €63.00".
3. Each ticket type has a stepper: minus, a mono quantity, plus. General max 6. VIP max 4. The order max is 6 across all types. Plus is disabled at either limit. Minus is disabled at 0.
4. Early bird shows a SOLD OUT tag, a struck-through €20.00, and a disabled stepper. It stays in the list so buyers see the price they missed.
5. Each ticket line shows the price plus its fees before you pick it: "€28.00 + €3.50 fees".
6. The seat map has a stage arc at the top, then rows A–H with 16 seats each, split 4 / 8 / 4 by two aisles. Rows A–B are VIP and have a chrome outline. Rows C–H are stalls. Row letters sit at both ends.
7. Sold seats are dark with a diagonal stroke. They cannot be selected. About a quarter of seats are sold.
8. Clicking an available seat selects it if its tier has a ticket left to place. Clicking a selected seat frees it.
9. If the tier is full, the seat does not select. A pink line under the map says why: "All 2 General seats are placed. Remove one or add a ticket." or "Add a VIP ticket to pick row A."
10. The map header shows what is left: "Pick 1 VIP seat", "Pick 2 General + 1 VIP seats", or "All 3 seats placed".
11. Lowering a quantity below the seats placed frees the last seat of that tier and says "Seat E8 released."
12. Continue is enabled only when every ticket has a seat and the hold is live. Disabled, it reads "Continue" with no price.
13. The timer bar shrinks from full to empty over 600 seconds. At 2:00 the clock and bar turn pink.
14. At 00:00: every selected seat is freed, the map shows them as available, the summary shows "No seats held", Continue disables, and a pink-bordered box says "Your hold ran out. Seats E7, E8 were released and are back on sale. Your ticket choice is kept." with a "Start a new 10:00 hold" button.
15. Starting a new hold, or clicking any seat after expiry, resets the clock to 10:00. Ticket quantities are kept.
16. Below the map, three notes explain rows A–B, row E, and the aisle seats.

## Structure

```
1280 × 800
┌───────────────────────────────────────────────────────────────────────────────┐
│ HALLE/NULL  (1 Tickets & seats)(2 Details)(3 Pay)    Seats held for ━━━ 09:59 │ 56px
├───────────────────┬───────────────────────────────────────┬───────────────────┤
│ ┌───────────────┐ │ CHOOSE SEATS           All 2 seats placed│ ORDER SUMMARY  │
│ │ CHROME        │ │             ╭──── STAGE ────╮          │ 2 × General €56│
│ │ HEART   [ALL] │ │ A ▢▢▢▢  ▢▢▢▢▢▢▢▢  ▢▢▢▢ A   (VIP)       │ Service fee  €5│
│ │ MIRA OKON ◐   │ │ B ▢▢▢▢  ▢▢▢▢▢▢▢▢  ▢▢▢▢ B               │ Venue levy   €2│
│ └───────────────┘ │ C … H   stalls, E7 E8 pink             │ Seats E7, E8   │
│ Date | Doors      │ ▢ Stalls ▢ VIP ■ Yours ⟋ Sold          │ TOTAL   €63.00 │
│ Venue | Entry     │ [Rows A–B][Row E][Seats 1,16]          │ [CONTINUE·€63] │
│ TICKETS           │                                        │ fine print     │
│ General   [-2+]   │                                        │                │
│ Early bird SOLD   │                                        │                │
│ VIP       [-0+]   │                                        │                │
│     372px         │          minmax(0,1fr)                 │     328px      │
└───────────────────┴───────────────────────────────────────┴───────────────────┘
```

- Top bar: `header`, 56px, 1px bottom rule. Logo, an `ol` of three step pills (the first has `aria-current="step"`), then the hold group pushed right.
- Body: `main`, a grid `372px minmax(0,1fr) 328px`. Each column scrolls on its own. Columns split by 1px rules. Column padding 20px 24px.
- Left: a `section` with the poster (decorative, `aria-hidden`), a visually hidden `h1` with the event name, a `dl` of four facts in a 2 × 2 hairline grid, and a `ul` of ticket types.
- Middle: a `section` with an `h2`, a live "what is left" line, the `svg` map inside a horizontally scrollable wrapper, a legend, a `role="status"` message line, and a `dl` of three notes.
- Right: an `aside` with a `dl` of lines, the seat list, the total `output`, the fee promise, the Continue button, the expiry box, and fine print.
- The poster is CSS only: a radial gradient with thin repeating rings, a 150px conic-gradient chrome disc with a 26px pink centre, half off the bottom-right corner, the title in chrome gradient text, an ALL NIGHT tag rotated 4deg, and the line-up bottom-left.

## Tokens

```css
:root {
  /* colour */
  --bg: #070708;          /* page */
  --panel: #0e0e10;
  --raise: #161619;       /* disabled button fill */
  --line: #25252a;        /* hairlines */
  --line-2: #3a3a41;      /* stepper border */
  --ink: #f2f2f4;         /* text */
  --ink-2: #b4b5bb;       /* secondary text */
  --ink-3: #8a8b92;       /* labels, fees, fine print */
  --seat: #1b1b1f;        /* available seat fill */
  --seat-edge: #6e6f77;   /* available seat stroke */
  --sold: #1d1d21;        /* sold seat fill, no stroke */
  --pink: #ff2e93;        /* the accent: your seats, Continue, low timer, messages */
  --pink-ink: #140008;    /* text on pink */
  --focus: #ffffff;
  --chrome: linear-gradient(180deg, #fbfbfc 0%, #b9bbc2 38%, #f0f1f4 50%, #6c6e76 78%, #d9dade 100%);

  /* type */
  --wide: "Archivo", system-ui, sans-serif;   /* font-stretch 125% for display, 100% for body */
  --mono: "JetBrains Mono", ui-monospace, monospace;

  /* space (4px base) */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px; --s-6: 24px;

  /* shape */
  --r: 4px;
  --pill: 999px;

  /* motion */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --fast: 150ms;
}
```

Chrome is used three times only: the poster title, the stage arc, the VIP seat stroke (as an SVG `linearGradient`). Do not put chrome on buttons, borders, or text elsewhere.

## Typography

Load Archivo with the width axis: `family=Archivo:wdth,wght@100,400;100,500;100,600;125,700;125,800`.

| Role | Family | Size | Weight | Stretch | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Poster title | Archivo | 38px / 0.9 | 800 | 125% | -0.01em | Title, chrome fill |
| Logo | Archivo | 15px | 800 | 125% | 0.06em | Upper |
| Section label (h2) | Archivo | 12px | 700 | 125% | 0.12em | Upper |
| Ticket name | Archivo | 15px | 600 | 100% | 0 | Title |
| Fact value | Archivo | 14px | 600 | 100% | 0 | Sentence |
| Body, notes | Archivo | 13–14px | 400 | 100% | 0 | Sentence |
| Continue | Archivo | 14px | 800 | 125% | 0.06em | Upper |
| Clock | JetBrains Mono | 20px | 500 | — | 0.02em | — |
| Total | JetBrains Mono | 28px | 500 | — | -0.02em | — |
| Prices, fees, quantities | JetBrains Mono | 13–15px | 400–500 | — | 0 | — |
| Labels, legend, fine print | JetBrains Mono | 11–12px | 400 | — | 0.08em on labels | Upper on labels |
| Seat number (selected only) | JetBrains Mono | 9px | 600 | — | 0 | — |

Rule: wide capitals for names of things, mono for every number and every small label.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Seat | select / hover | fill, stroke | resting → pink / ink | 150ms | `--ease` | instant |
| Hold bar | every second | `transform: scaleX` | previous → `left/600` | 1000ms | linear (it is a clock) | instant |
| Clock and bar colour | at 2:00 | colour | ink → pink | none | — | same |
| Continue | hover | `filter: brightness` | 1 → 1.1 | 150ms | `--ease` | instant |

No pulsing timer, no shaking seats, no confetti. The pink at 2:00 is the only urgency signal.

## States

- Seat available: fill `#1b1b1f`, 1px `#6e6f77` stroke, 22 × 20px, radius 4px. VIP available: stroke is the chrome gradient.
- Seat hover: stroke `--ink`, fill `#222227`.
- Seat selected: pink fill and stroke, its seat number shown in `--pink-ink`.
- Seat sold: fill `--sold`, no stroke, a 1.2px diagonal stroke `#45454c`. Cursor not-allowed.
- Seat focus-visible: stroke white 2.5px.
- Stepper button disabled: icon colour `--line-2`, cursor not-allowed.
- Ticket sold out: name and price in `--ink-3`, price struck, SOLD OUT tag in a 1px `--line-2` box.
- Continue disabled: fill `--raise`, text `--ink-3`, no price.
- Continue ready: pink fill, `--pink-ink` text, "Continue · €63.00".
- Hold low (≤ 2:00): clock and bar pink.
- Hold expired: clock 00:00 pink, expiry box shown with pink 1px border, seats freed.
- Message line: pink mono 12px, empty when there is nothing to say.

## Accessibility

- The map is an `svg role="group"` with the label "Seat map. Stage at the top. Rows A to H. Use arrow keys to move between seats."
- Each seat is a `g role="button"` with `aria-label` such as "Row C seat 7, available", "Row E seat 8, selected", "Row A seat 2, sold, VIP". Available and selected seats have `aria-pressed`. Sold seats have `aria-disabled="true"` and stay focusable so the reader hears they are sold.
- Roving tabindex: only one seat has `tabindex="0"`. Arrow keys move one seat or one row. Home and End go to the row ends. Space and Enter toggle. Tab leaves the map.
- Steppers are `role="group"` labelled by the ticket name. Buttons are labelled "Add one VIP ticket" and "Remove one VIP ticket". The quantity is an `output` with `aria-live="polite"`. When a button disables after a click, focus moves to its partner so it is not lost.
- The clock has `role="timer"` and is not live. A separate `aria-live="assertive"` region speaks at 5:00, 2:00, 1:00, and at expiry. Do not announce every second.
- The expiry box is `role="alert"`.
- The map header line is `aria-live="polite"`. The message line is `role="status"`.
- Sold is shown by a stroke as well as colour. Selected is shown by the seat number as well as pink.
- Contrast: `#8a8b92` on `#070708` is 5.9:1. `#140008` on `#ff2e93` is 5.9:1. White focus on near-black is far above 3:1.
- Hit targets: steppers 40px. Continue 52px. Seats are 22 × 20px at 1280. This is a desktop piece; on touch, keep the map at full size and let it scroll sideways inside its box.

## Responsive rules

- ≥1280: three columns, 372 / fluid / 328px. The page does not scroll; columns do.
- 1180 down to 1025: columns 330 / fluid / 300px, padding 18px.
- 1024: the page scrolls. The seat map moves to a full-width first row, with the SVG capped at 720px wide and centred. Event and summary sit side by side under it, each `minmax(0,1fr)`.
- 768: same as 1024. The map fits at about 720px wide.
- <640: one column in this order: top bar (sticky), event and tickets, seat map, summary. Step pills and the timer bar hide; the clock stays. The map keeps a 500px minimum width and scrolls sideways inside its wrapper. A line "Swipe the map to see the full row." appears. Notes stack. The poster drops to 180px tall and the title to 32px.
- The page itself never scrolls sideways. Only the map wrapper may.

## Acceptance checklist

### Always

- [ ] Every fee is its own line with its per-ticket rate. The total in the summary equals the total on the button.
- [ ] Ticket lines show price plus fees before anything is picked.
- [ ] A sold-out type stays visible with a disabled stepper.
- [ ] Steppers respect a per-type max and an order max. Plus disables at the limit.
- [ ] Seats per tier cannot exceed tickets per tier. A refused click explains why.
- [ ] Lowering a quantity frees the extra seat and says which.
- [ ] Continue is enabled only when tickets = seats and the hold is live.
- [ ] At 00:00 seats are actually freed, named in a message, and a new hold can be started. Tickets are kept.
- [ ] The timer counts from a deadline, not by subtracting 1 each tick.
- [ ] Seats are buttons with row, number, and status in the label, plus `aria-pressed`, with roving arrow-key focus.
- [ ] Sold is shown by shape as well as colour.
- [ ] One accent. Chrome in three places at most.
- [ ] No horizontal page scroll at 390px.

### This demo

- [ ] Event "Chrome Heart", Mira Okon b2b Lux Vane, Halle Null, Sat 17 Oct 2026, 22:00 – 06:00.
- [ ] General €28 + €3.50 fees, max 6. Early bird €20 sold out. VIP €65 + €5 fees, max 4. Order max 6.
- [ ] First frame: 2 General, E7 and E8 selected, total €63.00, clock 10:00.
- [ ] Rows A–H, 16 seats each, aisles after seats 4 and 12, rows A–B VIP.
- [ ] Pink is `#ff2e93`. Page is `#070708`.

## Implementation notes

**1. An honest timer.** Count from a deadline so a slow tab or a sleeping laptop does not stretch the hold. Free the seats in the same function that shows 00:00.

```js
const HOLD = 600;
let deadline = Date.now() + HOLD * 1000, expired = false;
function tick() {
  if (expired) return;
  const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  clock.textContent = String(left / 60 | 0).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0');
  bar.style.transform = `scaleX(${left / HOLD})`;
  hold.classList.toggle('low', left <= 120);
  const say = { 300: '5 minutes left', 120: '2 minutes left', 60: '1 minute left' }[left];
  if (say) live.textContent = say + ' on your seat hold.';
  if (left === 0) expire();
}
function expire() {
  expired = true;
  const freed = seats.filter(s => s.selected);
  freed.forEach(s => (s.selected = false));
  expiryText.textContent = `Seats ${freed.map(s => s.id).join(', ')} were released and are back on sale.`;
  render();
}
setInterval(tick, 1000);
```

In a real product the server owns the hold. The client clock only mirrors it. Never show a timer that does nothing at zero.

**2. Seat geometry.** Compute x from the seat number with the aisles added, and y from the row with a gap after the VIP rows.

```js
const x = s => 28 + (s - 1) * 27 + (s > 4 ? 18 : 0) + (s > 12 ? 18 : 0);
const y = r => 62 + r * 30 + (r > 1 ? 16 : 0);   // viewBox 0 0 524 352
// <g class="seat" role="button" aria-label="Row C seat 7, available" aria-pressed="false" tabindex="-1">
//   <rect x y width="22" height="20" rx="4"/>
//   <path d="M x+6 y+14 L x+16 y+6"/>   sold only
//   <text x+11 y+13.5>7</text>          shown when selected
// </g>
```

**3. Roving focus in the map.** One seat in the tab order, arrows move it.

```js
map.addEventListener('keydown', e => {
  const i = +e.target.closest('.seat')?.dataset.i;
  if (Number.isNaN(i)) return;
  let r = i / 16 | 0, c = i % 16;
  if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(i); return; }
  if (e.key === 'ArrowRight') c = Math.min(15, c + 1);
  else if (e.key === 'ArrowLeft') c = Math.max(0, c - 1);
  else if (e.key === 'ArrowDown') r = Math.min(7, r + 1);
  else if (e.key === 'ArrowUp') r = Math.max(0, r - 1);
  else return;
  e.preventDefault();
  focusTo(r * 16 + c);   // set tabindex 0 on it, -1 on the rest, then .focus()
});
```

Common mistakes:

- A timer that reaches 00:00 and nothing happens. That is a dark pattern.
- Folding fees into the ticket price, or adding a "booking fee" only on the pay step.
- Averaging mixed fees into one "per ticket" rate. Itemise by tier: "€2.50 × 2 + €4.00 × 1".
- 128 tab stops in the map.
- Sold seats shown only by a darker grey.
- Auto-adding a ticket when a seat is clicked. The buyer picks quantity first.
- Chrome on everything. It is a spice: three places.
- A pulsing or shaking timer. Pink at 2:00 is enough.
- Purple neon gradients and glow. This club is black, silver, and one pink.
- Letting the seat map shrink to 12px seats on a phone. Keep it full size and scroll the box.

Rebuild order:

1. Lay out the top bar and the three columns.
2. Build the CSS poster and the fact grid.
3. Build the ticket list with steppers and limits.
4. Build the seat data and the SVG map from the geometry above.
5. Wire seat clicks to the per-tier rule and the message line.
6. Build the summary from the same state: lines, fees, total, button label.
7. Add the deadline timer, the low state, and the expiry release.
8. Add roving keyboard focus and the labels.
9. Add the 1024 and <640 layouts and check 390px for sideways scroll.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
