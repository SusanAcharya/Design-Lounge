<!-- Design Lounge Nº 511 · "Phone past orders" · www.designlounge.live -->

# Phone past orders

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. This is an iOS list of past orders. It is not a live map and it is not a tracker.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The orders screen of Sablecroft, an invented wool mill, on a phone. The language is iOS: a large title, separate inset cards, a back chevron in the mill green, 44px targets, and 54px of clearance under the status bar. The Lounge draws the status bar. Do not draw one, and do not draw a map, a route, or a courier dot.

The first frame is a list of past orders. Each card shows a status (delivered, on the way, or cancelled), the date, the item count, and a total. The total is computed in cents from the line items plus delivery. Tapping a card pushes a summary over the list in the same file: the items, one status sentence, and a receipt. A cancelled order says why in one sentence, on the list and again in the summary. There is no second document.

Besley carries the words. IBM Plex Mono carries order ids and money, so the figures read as a mill ledger.

## Structure

```
390 x 844, list view fills the body
+--------------------------------------+
| padding-top max(54px, safe-area)    |
| SABLECROFT         12px tracked moss |
| Orders             Besley 34px       |
| 3 orders from the Greyhaven mill.    |
|                                      |
| On the way                   $64.00  |
| SC-1904                              |
| 2 Oct 2026, 3 items                  |
|                                      |
| Delivered                    $48.00  |
| SC-1866                              |
| 18 Sep 2026, 1 item                  |
|                                      |
| Cancelled                    $91.50  |
|          SC-1791                     |
|          3 Sep 2026, 3 items         |
|          The indigo dye lot failed   |
|          its wash test.              |
|                                      |
| Cancelled orders are not charged.    |
| padding-bottom max(34px, safe-area) |
+--------------------------------------+
```

Detail, absolute, inset 0, translated off to the right until open:

```
| < Orders                     44px    |
| On the way                           |
| SC-1904            Plex Mono 26px    |
| 2 Oct 2026, 3 items                  |
| On the way. It left Greyhaven...     |  italic 18px
| Items                                |
| Field beanie                 $28.00  |
| Moss                                 |
| Wool socks                   $32.00  |
| Oat, one pair. $16.00 each, qty 2.   |
| Receipt                              |
| Subtotal                     $60.00  |
| Delivery                      $4.00  |
| Total                        $64.00  |
```

- The list is a `section.view` that scrolls. The detail is a second `section.view` positioned absolute, `hidden` and `inert` and `aria-hidden` on the first frame.
- Each order is a `button` inside an `li`. The whole card is the hit target. `data-status` is `way`, `delivered`, or `cancelled`.
- The detail back control is a `button`. The order id is the detail `h1` with `tabindex="-1"`.
- Items are a `ul`. The receipt is a `div` of three paragraphs. Section labels Items and Receipt are `h2` at 13px.
- The list note is the last child of the list view, with `margin-top: auto`, so it sits at the bottom when the list is short and scrolls after the cards when the list is long.
- Dates are `time` elements with `datetime` `2026-10-02`, `2026-09-18`, and `2026-09-03`.
- No images. The card has no side stripe and no box-shadow. The dot is an empty `i` with `aria-hidden`.

## Motion

| Thing | Trigger | Property | From | To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Open detail | card tap | transform | translateX(100%) | translateX(0) | 320ms | cubic-bezier(.32,.72,0,1) | instant, no wait |
| Close detail | Back or Escape | transform | translateX(0) | translateX(100%) | 320ms | same | instant, hide immediately |
| Card press | active | transform | scale(1) | scale(0.985) | browser active | n/a | no scale |
| Card hover | hover, fine pointer | background | `--surface` | #eaf0ea | instant | n/a | unchanged |

The detail is `display: none` via the `hidden` attribute until open, so the off-screen copy cannot widen the page. On open, clear `hidden`, then on the next two animation frames add `is-open` so the transform can run. On close, remove `is-open`, then after 320ms set `hidden`, `inert`, and `aria-hidden` again. Under reduced motion, skip the frames and the timeout.

Do not animate a map, a pulse, or a progress line. Nothing on this screen is live.

## States

- Card resting: surface `#f3f6f2`, radius 14px, padding 14px 16px. No border and no inset stripe.
- Card hover (fine pointer): background `#eaf0ea`.
- Card focus-visible: 2px outline `--focus`, offset 2px.
- On the way: status word and dot `--amber`.
- Delivered: status word and dot `--moss`.
- Cancelled: status word and dot `--brick`, plus the why sentence in `--brick` under the date. Other statuses do not show a why line on the list.
- Detail closed: `hidden`, `inert`, `aria-hidden="true"`, not in the tab order.
- Detail open: list view `inert`, back button focused, detail translated to 0.
- Receipt total row: 1px top rule, figure 18px mono, label weight 600.
- No loading state and no error state. The three orders are already known.
- No empty list in this demo. If a product has zero orders, replace the list with one sentence and do not invent a tracker. That state is not on this frame.

## Accessibility

- The list `h1` is Orders. The detail `h1` is the order id, for example SC-1904. Section labels Items and Receipt are `h2`.
- Each card is a `button`. Its accessible name is the text inside it: status, price, id, date, count, and, for the cancelled card, the why sentence. Do not add a second `aria-label` that drops the why.
- The status dot is `aria-hidden`. The word is the status.
- Back button accessible name is "Back to orders". The visible word is Orders, beside a chevron that is `aria-hidden`. Min-height 44px.
- Opening sets the list `inert` and removes `aria-hidden` from the detail. Closing reverses that and returns focus to the card.
- Escape closes the detail only while `is-open` is set. It does not do anything on the list.
- One polite live region, visually clipped. "Opened order SC-1904, On the way." and "Back to orders."
- Dates are real `time` elements.
- Hit targets: the card is the full row, well above 44px. Back is 44px tall.
- Contrast: `#17211c` on `#f3f6f2` is about 15.2:1. `#3e4a42` on `#f3f6f2` is about 8.5:1. `#1b4f3e` on `#f3f6f2` is about 8.6:1. `#7a4510` on `#f3f6f2` is about 7.2:1. `#7c332c` on `#f3f6f2` is about 8.1:1. Status text clears 4.5:1 on the card. The dot repeats the word. They are not the only signal.
- Focus ring is 2px `--moss`, offset 2px.
- The detail must not be reachable while it is closed. `hidden` plus `inert` does that.

## Responsive rules

- The frame is 390x844. List header padding-top and detail padding-top are `max(54px, env(safe-area-inset-top))`. The list note and the detail pad use `max(34px, env(safe-area-inset-bottom))` under the last content.
- At 360 wide, card padding stays. The status row wraps: the status is `flex: 1 1 8em` and the price has `margin-left: auto`. The why sentence wraps inside the card. The order id does not overflow.
- At the largest text size, cards grow. The status and the price stack. Item rows stack the name and the amount the same way (`flex: 1 1 8em` on the name, `margin-left: auto` on the amount, variant at `flex-basis: 100%`). Receipt rows stack the same way. The list scrolls. The detail scrolls inside its own view. Nothing scrolls sideways.
- At tablet width, stay one column of cards. Do not turn this into a split list and detail. The detail still covers the phone width. This screen is a phone.
- Do not draw a status bar, a map, or a home indicator glyph.

## Acceptance checklist

### Always

- [ ] The first frame is a list of past orders. Each shows status, date, item count, and a total computed in cents.
- [ ] Statuses used here are delivered, on the way, and cancelled. Each has a text label, not only a colour.
- [ ] A cancelled order states why in one sentence, on the list.
- [ ] Tapping a card opens a summary in the same file: items, one status sentence, and a receipt whose total equals the list total.
- [ ] The receipt is subtotal plus delivery, both in cents, including a $0.00 delivery when ship cents are 0.
- [ ] Back and Escape return to the list and restore focus to the card that was opened.
- [ ] There is no map, no route, and no live position.
- [ ] Cards and the back button are at least 44px tall. Top clearance 54px. Bottom clearance 34px.
- [ ] The closed detail is `hidden` and `inert`, so it cannot widen the page or take focus.
- [ ] Reduced motion shows the detail without the 320ms slide.

### This demo

- [ ] Brand Sablecroft. `h1` Orders. Lede "3 orders from the Greyhaven mill."
- [ ] SC-1904 is On the way, 2 Oct 2026, 3 items, $64.00. Receipt is $60.00 + $4.00.
- [ ] Wool socks are $16.00 each, quantity 2, line amount $32.00.
- [ ] SC-1866 is Delivered, 18 Sep 2026, 1 item, $48.00.
- [ ] SC-1791 is Cancelled, 3 Sep 2026, 3 items, $91.50, with the sentence "The indigo dye lot failed its wash test."
- [ ] The footnote reads "Cancelled orders are not charged."
- [ ] Detail heading for the first card is SC-1904 in IBM Plex Mono 26px.
- [ ] Page background is `#e3e8e2`. Cards are `#f3f6f2`. Delivered moss is `#1b4f3e`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame is the list. The lede is computed: "{n} orders from the Greyhaven mill." With the three orders below, it reads "3 orders from the Greyhaven mill."
2. Cards, newest first:
   - SC-1904, 2 Oct 2026, status On the way. Field beanie, Moss, 2800 cents, quantity 1. Wool socks, Oat, one pair, 1600 cents, quantity 2. Delivery 400 cents. Count 3. Total 6400 cents, shown as $64.00.
   - SC-1866, 18 Sep 2026, status Delivered. Merino crew, Oat, 4200 cents, quantity 1. Delivery 600 cents. Count 1. Total 4800 cents, shown as $48.00.
   - SC-1791, 3 Sep 2026, status Cancelled. Indigo chore coat, Indigo, 7200 cents. Wool cap, Charcoal, 1250 cents. Twill tape, 5 metres, 700 cents. Each quantity 1. Delivery 0. Count 3. Total 9150 cents, shown as $91.50. The card also shows the sentence "The indigo dye lot failed its wash test."
3. On the way uses amber `#7a4510` for the word and the 8px dot. Delivered uses moss `#1b4f3e`. Cancelled uses brick `#7c332c`. The word always sits next to the dot. There is no coloured edge on the card. Colour is not the only signal.
4. A note under the list reads "Cancelled orders are not charged." It is not a second total. The $91.50 is the order's goods total. The note says that order was not charged.
5. Tapping a card stores that button, fills the detail from the same order object, unhides the detail, marks the list `inert`, and slides the detail in from the right over 320ms with `cubic-bezier(.32, .72, 0, 1)`. Focus moves to the back button. The live region says "Opened order SC-1904, On the way."
6. The detail shows the status word, the order id as the `h1`, the date and the item count, then the status sentence, then an Items group, then a Receipt group.
7. Status sentences, one each, not a map:
   - On the way: "On the way. It left Greyhaven on Thursday and should arrive by Tuesday."
   - Delivered: "Delivered on 20 Sep 2026. It was left at the side door."
   - Cancelled: "The indigo dye lot failed its wash test." That is the same sentence as the list. Do not add a second reason.
8. Item rows show the name, the line amount (unit cents times quantity), and the variant. If quantity is greater than 1, the variant line also says the unit price and the quantity. Wool socks reads "Oat, one pair. $16.00 each, quantity 2." and the line amount is $32.00.
9. The receipt has three rows, all from cents: Subtotal (sum of line amounts), Delivery (the order's ship cents, including $0.00), Total (subtotal plus delivery). For SC-1904 that is $60.00, $4.00, $64.00. The list price and the receipt total are the same number.
10. Back, labelled "Back to orders" with the visible word Orders, slides the detail out, hides it, clears `inert` on the list, and focuses the card that was opened. Escape does the same while the detail is open.
11. Reduced motion: the detail appears and disappears with no slide and no 320ms wait. The content is the same.
12. There is no refresh, no map, no courier name, and no live position.

## Tokens

```css
:root {
  --bg: #e3e8e2;
  --surface: #f3f6f2;
  --ink: #17211c;
  --ink-2: #3e4a42;
  --line: #d3dbd4;
  --moss: #1b4f3e;
  --amber: #7a4510;
  --brick: #7c332c;
  --focus: #1b4f3e;
  --serif: "Besley", Georgia, serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --ease: cubic-bezier(.32, .72, 0, 1);
}
```

Card radius 14px. Gap between cards 10px. Page padding inline 16px. Hairline 1px `--line`. No drop shadow and no coloured side stripe. Moss is the brand and the delivered status. Amber is only "on the way". Brick is only "cancelled". The status colour is the word and the 8px dot only.

## Typography

| Role | Family | Size | Weight | Line height | Tracking | Colour |
| --- | --- | --- | --- | --- | --- | --- |
| Brand | Besley | 12px | 600 | 1.4 | 0.16em | `--moss`, uppercase |
| List title | Besley | 34px | 600 | 1 | -0.03em | `--ink` |
| Lede, date | Besley | 14px to 15px | 500 | 1.4 | 0 | `--ink-2` |
| Status | Besley | 14px | 600 | 1.4 | 0 | status colour |
| Price, line amount | IBM Plex Mono | 14px | 500 | 1.4 | 0 | `--ink` |
| Order id on the card | IBM Plex Mono | 13px | 400 | 1.4 | 0.02em | `--ink-2` |
| Cancelled why | Besley | 14px | 500 | 1.35 | 0 | `--brick` |
| Back | Besley | 17px | 600 | 1 | 0 | `--moss` |
| Detail id | IBM Plex Mono | 26px | 500 | 1.1 | -0.03em | `--ink` |
| Status sentence | Besley italic | 18px | 500 | 1.35 | 0 | `--ink` |
| Section label | Besley | 13px | 600 | 1.4 | 0 | `--ink-2` |
| Item name | Besley | 16px | 600 | 1.4 | 0 | `--ink` |
| Variant | Besley | 13px | 500 | 1.4 | 0 | `--ink-2` |
| Receipt total figure | IBM Plex Mono | 18px | 500 | 1.4 | 0 | `--ink` |
| Footnote | Besley | 13px | 500 | 1.4 | 0 | `--ink-2` |

Besley is the voice of the mill. Mono is only ids and amounts. Do not set the status word in mono.

## Implementation notes

One function feeds the list price and the receipt, so they cannot disagree:

```js
function tally(order) {
  let sub = 0, count = 0;
  for (const it of order.items) {
    sub += it.cents * it.qty;
    count += it.qty;
  }
  return { sub, ship: order.ship, total: sub + order.ship, count };
}
function money(cents) {
  const n = Math.max(0, Math.round(cents));
  const whole = Math.floor(n / 100);
  const frac = String(n % 100).padStart(2, '0');
  return '$' + whole + '.' + frac;
}
```

Write the list from the array on startup. Do not paste $64.00 into the HTML.

Keep the detail out of the scroll width until it is opened:

```css
.view.detail { position: absolute; inset: 0; transform: translateX(100%); }
.view.detail[hidden] { display: none; }
body.is-open .view.detail { transform: translateX(0); }
```

Open by clearing `hidden` and `inert`, setting the list `inert`, then adding `is-open` on a double `requestAnimationFrame` so the 320ms slide runs. Close by removing `is-open` and restoring `hidden` after 320ms. If `prefers-reduced-motion: reduce` matches, add `is-open` immediately and hide immediately on the way back.

Item copy when quantity is above 1:

```js
const variant = it.qty > 1
  ? it.variant + '. ' + money(it.cents) + ' each, quantity ' + it.qty + '.'
  : it.variant;
```

The line amount is `money(it.cents * it.qty)`, not the unit price repeated.

Common mistakes:

- Do not add a coloured side stripe to rounded cards. The status dot and the coloured status word already carry the status.
- Hardcoding the card total and a different receipt total.
- Putting the cancelled reason only in the detail. The list has to say it too, in one sentence.
- Adding a map because the status says "On the way". The sentence is the whole status. There is no map in this piece.
- Leaving the detail at `translateX(100%)` without `hidden`, which can make the page wider than 390px.
- Forgetting to return focus to the card. The back button is not the end of the task.
- Using a photo, an emoji status, or a trademarked carrier name.
- Drawing a status bar.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
