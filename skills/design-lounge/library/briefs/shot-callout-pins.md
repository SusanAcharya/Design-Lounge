<!-- Design Lounge Nº 482 · "Callouts on a review still" · www.designlounge.live -->

# Callouts on a review still

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A design review of one screen, not a tour of the whole product. The still is the checkout for Brine, a fictional salt shop in Margate. Four numbered pins sit in a column just outside the still's right edge, each lined up with the thing it marks: the wordmark, the total, the pay button, the shipping line. One note card sits to the right. A 1px clay line runs from the open pin to that card. Pin 2 starts open. The detail worth copying is that the pin never covers the word it is about.

## Structure

```
1280 × 800, items vertically centred
kicker
┌ still 640 ────────────────┐   (1)          ┌ note 360 ──────────────┐
│ Brine          2 in basket│   (2)──────────│ 02 · THE AMOUNT        │
│ Flake salt            £14 │   (3)          │ One total              │
│ Bay leaf jar          £22 │   (4)          │ Put £36 on the receipt │
│ TOTAL                 £36 │                └────────────────────────┘
│ [ Pay £36            ]    │
│ Ships from Margate, 2 days│
└───────────────────────────┘
```

- `.stage` is a flex row, `align-items: center`, padding `0 56px 0 64px`, gap 96px.
- The left column is the kicker (Figtree 12/500, tracking +0.14em, uppercase, `#5e584e`) plus the still.
- Still padding `32px 36px 28px`. Wordmark Literata 36/600. Basket Figtree 13/500. Two item rows, then a total row, then a 56px pay button, then a centred 13px shipping line.
- The note is 360px wide, same paper and ink border, padding `22px 22px 20px`. Kicker in the pin colour. Title Literata 28/600. Body Figtree 15/400, `#5e584e`, line-height 1.45. `aria-live="polite"`.
- Pins are `position: absolute` on the stage, 36×36, radius 50%, clay `#8f2d1c`, paper text. They are not inside the still, so they cannot cover prices.
- `.leader` is a 1px-tall absolutely positioned div. Its width is the distance from pin to note. `transform-origin: 0 0` and `rotate()` aim it.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Notes |
| --- | --- | --- | --- | ---: | --- | --- |
| Leader | pin change | width, rotate, top, left | old pin → new pin | 0 | — | redrawn from geometry, not tweened |
| Note copy | pin change | text | previous note → next note | 0 | — | swap, do not fade |
| Pressed pin | pin change | box-shadow | none → 4px stage gap + 2px clay ring | 0 | — | instant |

Reduced motion removes transitions. Nothing in this piece depends on a fade.

## States

- **Pin, idle:** clay disc, numeral in `--pin-ink`, no ring.
- **Pin, pressed:** `box-shadow: 0 0 0 4px var(--stage), 0 0 0 6px var(--pin)`. One pin only.
- **Pin, focus-visible:** `outline: 2px solid var(--ink); outline-offset: 3px`.
- **Pay, focus-visible:** `outline: 2px solid var(--pin); outline-offset: 3px`.
- **Note:** always visible. Its three text nodes change with the pin.

Copy for the four notes:

1. Kicker "01 · The name". Title "Set the word large". Body "The shop name is the title of the still. 36px serif, not a 14px logo in the corner."
2. Kicker "02 · The amount". Title "One total". Body "Put £36 on the receipt. Do not float a second total in a banner above the button."
3. Kicker "03 · The button". Title "One solid action". Body "Pay is the only filled control. Everything else stays type on the paper."
4. Kicker "04 · The promise". Title "Say when it leaves". Body "Two days, and the town. A trust line under the button, not a row of badges."

## Accessibility

- Each pin is a `<button>` with a numeral as its name. `aria-pressed` marks the open one.
- The note is an `aside` with `aria-live="polite"`, so the title and body are announced when they change.
- Arrow keys move both the note and DOM focus. Do not move focus without updating the note.
- The still is an `article` with `aria-label="Checkout still"`.
- Contrast: ink on sheet is above 12:1. Ink-2 `#5e584e` on sheet is about 6:1. Pin ink `#f8f1ea` on `#8f2d1c` is above 7:1. Pay ink on `#1c3a30` is above 10:1.
- Hit target: pins are 36×36. On a phone, grow them to 44×44 and stack the note under the still.

## Responsive rules

- ≥ 1280: still left, note right, pins in the gutter.
- 1024–1279: still 560px, note 300px, gap 48px. Pins stay on the still's right edge. If a pin would overlap the note, drop the gap before you move the pin onto the type.
- 768–1023: note goes under the still, full width of the still. Pins stay on the right edge. The leader runs downward to the note.
- < 768: one column. Pins become a horizontal row under the kicker, 44px each. The note sits under the still. No leader.

## Acceptance checklist

**Always**

- [ ] Pins sit outside the still, lined up with their targets, and do not cover type.
- [ ] Only one pin is pressed, and the note matches that pin.
- [ ] A 1px line runs from the pressed pin to the note.
- [ ] Arrow keys change the pin, the note, and focus, and they wrap.
- [ ] Positions are measured after fonts load, not only on the first parse.
- [ ] The pay control is not a pin and does not change the note.

**This demo**

- [ ] The still is Brine's checkout: Flake salt £14, Bay leaf jar £22, total £36.
- [ ] Pin 2 starts open, on the total.
- [ ] The four notes are the name, the amount, the button, and the promise, in that order.
- [ ] Pin colour is `#8f2d1c`. The pay button is `#1c3a30`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: kicker "Brine Goods · checkout review". The still is 640px wide on paper `#f6f3ee` with a 1px ink border. Pin 2 is pressed: a 36px clay disc with a 4px stage-coloured gap and a 2px clay ring. The note reads "02 · The amount", "One total", and the sentence about £36. The line connects pin 2 to the note.
2. Pins are placed in JavaScript from the still's right edge plus 18px, and from the vertical centre of each target, minus 18px so the disc is centred on that target.
3. Click a pin: it becomes the only `aria-pressed="true"` pin. The note's kicker, title, and body swap to that pin's copy. The line redraws from the pin's right-centre to a point 36px down the note's left edge.
4. ArrowDown or ArrowRight opens the next pin and moves focus to it. ArrowUp or ArrowLeft opens the previous pin, wrapping at both ends. The keys call `preventDefault`.
5. The pay button is a real button and does not change the note. It is part of the still.
6. There is no close control. One note is always open after load. The first open pin is 2.
7. Reduced motion: the note does not animate. Pins do not scale.
8. On font load, measure again. The first measure and `document.fonts.ready` both call the same place function, so the pins do not stay on a pre-font layout.

## Tokens

```css
:root {
  --stage: #d7d1c6;       /* page */
  --sheet: #f6f3ee;       /* still and note */
  --ink: #1a1814;
  --ink-2: #5e584e;       /* secondary copy */
  --line: #cfc6b8;        /* rules inside the still */
  --pin: #8f2d1c;         /* pins, leader, note kicker */
  --pin-ink: #f8f1ea;
  --pay: #1c3a30;         /* the one solid button */
  --pay-ink: #f3f7f4;
  --font: "Figtree", system-ui, sans-serif;
  --serif: "Literata", Georgia, serif;
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | ---: | ---: | ---: | --- | --- |
| Kicker | Figtree | 12px | 500 | 1 | +0.14em | uppercase |
| Wordmark | Literata | 36px | 600 | 1 | −0.03em | sentence |
| Item name | Literata | 18px | 600 | 1.2 | 0 | sentence |
| Item meta, basket, ship | Figtree | 13px | 500 | 1.4 | 0 | sentence |
| Price | Figtree | 18px | 600 | 1 | 0 | numerals |
| Total figure | Literata | 40px | 600 | 1 | −0.03em | numerals |
| Pay label | Figtree | 16px | 600 | 1 | +0.01em | sentence |
| Note kicker | Figtree | 12px | 600 | 1 | +0.14em | uppercase |
| Note title | Literata | 28px | 600 | 1.15 | −0.02em | sentence |
| Note body | Figtree | 15px | 400 | 1.45 | 0 | sentence |
| Pin numeral | Figtree | 14px | 600 | 36px | 0 | numerals |

## Implementation notes

Measure every pin from the same x, the still's right edge. Do not position a pin from the target's right edge, or a left-aligned word gets a pin in the middle of the card.

```js
function anchor() {
  var sr = stage.getBoundingClientRect();
  var x = still.getBoundingClientRect().right - sr.left + 18;
  pins.forEach(function (pin) {
    var tr = document.getElementById(pin.getAttribute('data-for')).getBoundingClientRect();
    pin.style.left = x + 'px';
    pin.style.top = (tr.top + tr.height / 2 - sr.top - 18) + 'px';
  });
}
```

The leader is one element, not an SVG. Set its length and its angle from the pin's right-centre to the note:

```js
var dx = x2 - x1, dy = y2 - y1;
leader.style.width = Math.sqrt(dx * dx + dy * dy) + 'px';
leader.style.transform = 'rotate(' + (Math.atan2(dy, dx) * 180 / Math.PI) + 'deg)';
```

`transform-origin` must be `0 0`, and the leader's `left` and `top` are the start point. Call `anchor()` before you read the pin's rect, or the line aims at the pin's old place.

Common mistakes: absolute pins inside the price row, so they cover £36; a tooltip on the pin instead of one persistent note; opening more than one note at a time.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
