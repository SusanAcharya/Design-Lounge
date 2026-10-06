<!-- Design Lounge Nº 344 · "Phone order tracking" · www.designlounge.live -->

# Phone order tracking

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Keep the map, the ETA, the four steps, the courier card, and the folding summary.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The screen a hungry person opens after they pay. A food app called Tocco shows order TC-4821 from Nonna Vela. The top half is a flat cartoon map with a thick black frame. A tomato-red courier dot rides a black route from the restaurant to the house. Below the map the answer sits in 42px black type: "Arrives 19:42", then "12 min" in tomato on its own line. A four-part bar shows Confirmed, Preparing, On the way, Delivered, and the current part pulses. Then a courier card with call and message, a folding order summary, and a "Help with this order" link.

The look is loud food packaging: cream paper, tomato red, near-black ink, heavy rounded Rubik at weight 900, 20px corners. The language is iOS-ish in structure (one column, large type, 44px round buttons) with no glass and no blur.

The detail worth copying: the ETA is the biggest thing on the screen, bigger than the map labels and the brand. People open this screen to read one number.

## Structure

```
390 × 844, page scrolls only when the summary is open
padding-top 54px

[<] TOCCO                                   back 44px round
    Order TC-4821 · Nonna Vela

┌────────────────────────────────────┐  margin 0 12px
│ (●Live)                      ⌂     │  height clamp(220px, 34vh, 300px)
│        ┌·········┘                 │  2px ink border, radius 20px
│        ●  courier                  │
│  ┌─────┘                           │
│ [fork]                             │
└────────────────────────────────────┘

Arrives 19:42                           42px / 900
12 min                                  42px / 900 tomato
Ravi picked up your order at 19:24      14px

[████][████][██░░][░░░░]                8px bars, gap 6px
Confirmed Preparing •On the way Delivered

┌────────────────────────────────────┐  card, radius 20px
│ [RT] Ravi Thapa          (msg)(call)│  min-height 72px
│      ★ 4.9 · Scooter 7314           │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│ Order summary   3 items · Rs 1,400 v│  56px
└────────────────────────────────────┘
        Help with this order >          48px
padding-bottom 34px
```

- Header: a `header` with a back `button` and two lines of text. The brand line is 13px, weight 900, uppercase, tomato.
- Map: a `div role="img"` with an `aria-label` that says where the courier is. Inside, one inline SVG drawn with `preserveAspectRatio="xMidYMid slice"` so it crops and never stretches.
- ETA: a `section` whose `h1` holds both lines. The minutes sit in a `span` with `display: block`. A visually hidden " · " keeps the spoken text "Arrives 19:42 · 12 min".
- Progress: an `ol` with four `li`. Each holds an 8px bar and a label.
- Courier: a card `div` with the initials tile, a text block, and two `button` elements.
- Summary: a card with a `button aria-expanded aria-controls` and a region holding a `dl`.
- Help: an `a` element. It is a link because it goes somewhere.
- Toast: one fixed `div role="status" aria-live="polite"` near the bottom.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Courier dot | load, loops | position on route | 46% → 74% of path length | 16000ms, then 2000ms hold | linear in time (rAF) | fixed at 46% |
| Driven line | with courier | `stroke-dashoffset` | follows courier | same | same | fixed at 46% |
| Minutes | with courier | text | 12 → 7 | same | rounded | fixed at 12 |
| Courier halo | load, loops | circle `r`, opacity | 10 → 24, 0.5 → 0 | 1800ms | `--ease` | hidden |
| Live dot, step dot | load, loops | box-shadow ring | 0 → 7px, 0.55 → 0 | 1600ms | `--ease` | none |
| Current step fill | load, loops | width | 20% → 62%, holds 40% | 2400ms | `--ease` | none, bar shows 55% |
| Summary fold | tap | `grid-template-rows` | 0fr ↔ 1fr | 320ms | `--ease` | instant |
| Chevron | tap | rotate | 0 ↔ 180deg | 300ms | `--ease` | instant |
| Call, message | press | scale | 1 → 0.92 | 160ms | `--ease` | instant |
| Toast | tap | translateY, opacity | 16px, 0 → 0, 1 | 300ms / 200ms | `--ease-out` | instant |

The courier moves at a steady speed on purpose. A courier that eases in and out looks like a slide show, not a scooter.

Loops are slow. This screen sits open for minutes. Nothing flashes faster than once per 1.6 seconds.

## States

- Step done: bar `--ink`, label `--ink`.
- Step current: bar `--tomato-soft` with a moving `--tomato` fill, label `--tomato`, 7px dot, `aria-current="step"`.
- Step future: bar `--line`, label `--ink-3`.
- Summary closed: `aria-expanded="false"`, chevron down, list height 0.
- Summary open: `aria-expanded="true"`, chevron up, dashed 1.5px top rule over the list.
- Call button: ink circle, cream icon. Message button: cream circle, 1.5px ink ring.
- Pressed round button: scale 0.92.
- Focus-visible: 3px ink outline, 2px offset, 12px radius, on every button and the link.
- Delivered (not drawn here): all four bars black, the map pins the courier on the house, the ETA line becomes "Delivered 19:41", and the courier card swaps call for "Rate Ravi".
- Late (not drawn here): the minutes line turns to "Running 6 min late" in ink, not red. Red stays for the live minutes.
- Lost signal (not drawn here): the Live chip reads "Last seen 19:33" and the courier dot turns grey.

## Accessibility

- The map is one image with a sentence label: "Map: courier on Lakeside Road, heading to your address". The SVG inside is `aria-hidden`.
- The `h1` is the ETA. Screen readers hear "Arrives 19:42 · 12 min".
- The progress is an ordered list labelled "Order progress". The current item has `aria-current="step"`.
- A polite live region speaks once when the minutes reach 7. A product should speak on step changes (Preparing to On the way, On the way to Delivered), not on every minute.
- The call and message buttons have names: "Call Ravi", "Message Ravi". The icons are `aria-hidden`.
- The rating line contains a hidden "Rated " so it reads "Rated 4.9" instead of "star 4.9".
- The summary button has `aria-expanded` and `aria-controls`. The list region has a label.
- The toast is `role="status"`.
- Hit targets: back, call, message 44 × 44px. Summary row 56px tall. Help link 48px tall.
- Contrast: `#17120d` on `#f6eedf` is above 15:1. `#d6341f` on `#f6eedf` is about 4.6:1, fine for 42px and 15px bold. White on `#d6341f` is about 4.7:1. `#7a6b5a` on `#f6eedf` passes 4.5:1 for the 12px bold future label.
- Tab order follows the DOM: back, message, call, summary, help. The map is not focusable.

## Responsive rules

- 390 × 844: everything fits with the summary closed. Map height is `clamp(220px, 34vh, 300px)`, which gives 287px.
- 360 × 780: map is 265px. The ETA keeps 42px. The courier meta line truncates with an ellipsis before it wraps. The step labels fit at 12px; "On the way" is the longest.
- Never scroll sideways. The map SVG uses slice, so a narrower frame crops the left and right edges of the city, not the route. Keep the route inside the middle 80% of the drawing.
- Shorter than 700px: the page scrolls. The map does not shrink below 220px.
- Tablet: do not stretch this. Put the map on the left at 60% and the column on the right at 40%, with the same order of parts.
- Do not draw a status bar or home indicator. The 54px top and 34px bottom are the clearance.

## Acceptance checklist

### Always

- [ ] The ETA is the largest type on the screen, at least 2.5 times the body size.
- [ ] The map has one route, a start pin, an end pin, and one moving courier marker.
- [ ] The driven part of the route is solid and the rest is dotted.
- [ ] The progress has exactly four steps. Only one is current, and it has `aria-current="step"`.
- [ ] The courier card has initials, name, rating, and two 44px buttons with names.
- [ ] The summary folds with `aria-expanded` and shows every line and a total.
- [ ] One accent colour. The call button is not the accent.
- [ ] Reduced motion stops the courier, the pulses, and the fill.
- [ ] No horizontal scroll at 360px.
- [ ] Focus is visible on every control.

### This demo

- [ ] Brand Tocco, order TC-4821, restaurant Nonna Vela.
- [ ] ETA "Arrives 19:42" and "12 min" in `#d6341f`, Rubik 900 at 42px.
- [ ] Steps read Confirmed, Preparing, On the way, Delivered, with On the way current.
- [ ] Courier Ravi Thapa, tile "RT", "4.9 · Scooter 7314".
- [ ] Summary "3 items · Rs 1,400". Lines: Burrata pizza Rs 780, Garlic knots ×2 Rs 360, Blood orange soda Rs 180, Delivery Rs 80.
- [ ] Map frame is a 2px `#17120d` border with a 20px radius.
- [ ] Courier runs from 46% to 74% of the route in 16 seconds, holds 2 seconds, then repeats.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: the map shows the courier about halfway along the route. The part already driven is a solid 6px black line. The rest is a dotted 4px line.
2. The courier dot moves forward along the route path over 16 seconds, from 46% to 74% of the route length. It holds for 2 seconds at the end, then starts again from 46%.
3. While it moves, the minutes count down from 12 to 7. The clock time "19:42" never changes.
4. When the minutes reach 7, a hidden live region says "Arriving in 7 minutes". It does not announce every minute.
5. A small black "Live" chip sits top-left on the map. Its red dot pulses every 1.6 seconds.
6. The progress bar has four equal parts. Confirmed and Preparing are solid black. On the way is a pale tomato track with a tomato fill that grows from 20% to 62% every 2.4 seconds. Delivered is an empty beige track.
7. The On the way label is tomato with a 7px pulsing dot before it. It has `aria-current="step"`.
8. The courier card shows a 48px tomato tile with the initials "RT", the name "Ravi Thapa", a star, "4.9 · Scooter 7314", a message button, and a call button.
9. Tapping call shows a black toast "Calling Ravi through Tocco" for 2.4 seconds. Tapping message shows "Message sent: Gate code is 2210".
10. The order summary row reads "Order summary" and "3 items · Rs 1,400" with a chevron. Tapping it opens the list in 320ms and turns the chevron 180 degrees. Tapping again folds it.
11. The open list: 1 × Burrata pizza Rs 780, 2 × Garlic knots Rs 360, 1 × Blood orange soda Rs 180, Delivery Rs 80, Paid by card Rs 1,400.
12. "Help with this order" is a tomato underlined link. In the demo it shows the toast "Opening help for TC-4821". In a product it opens the help flow.
13. With reduced motion, the courier sits still at 46%, nothing pulses, and the summary opens without a slide.

## Tokens

```css
:root {
  /* colour */
  --bg: #f6eedf;          /* cream page */
  --surface: #fffaf1;     /* cards, roads, buttons */
  --map: #efe3cc;         /* map ground */
  --road: #fffaf1;        /* roads */
  --block: #e7d8bb;       /* city blocks */
  --ink: #17120d;         /* text, route, map frame */
  --ink-2: #4a3f33;       /* secondary text */
  --ink-3: #7a6b5a;       /* future step label */
  --line: #e3d4b9;        /* card borders, empty track */
  --tomato: #d6341f;      /* accent: courier, minutes, current step, link */
  --tomato-ink: #ffffff;  /* text on tomato */
  --tomato-soft: #fbe0d6; /* current step track */

  /* type */
  --font: "Rubik", system-ui, sans-serif;
  --fs-eta: 42px;
  --fs-name: 16px;
  --fs-body: 15px;
  --fs-meta: 13px;
  --fs-step: 12px;

  /* space: 4px base */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px;

  /* shape */
  --r: 20px;      /* map, cards */
  --r-sm: 14px;   /* toast */
  --r-tile: 16px; /* initials tile */

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --courier-run: 16000ms;
  --courier-hold: 2000ms;
  --pulse: 1600ms;
  --fill: 2400ms;
  --fold: 320ms;
}
```

The accent is used in five places only: brand word, courier dot and home pin, minutes, current step, help link. The call button is ink, not tomato, so the minutes stay the loudest red.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Brand | Rubik | 13px | 900 | 1.4 | 0.08em | upper |
| Order line | Rubik | 13px | 500 | 1.4 | 0 | sentence |
| ETA time | Rubik | 42px | 900 | 1.0 | -0.03em | sentence |
| ETA minutes | Rubik | 42px | 900 | 1.0 | -0.03em | lower |
| ETA note | Rubik | 14px | 500 | 1.4 | 0 | sentence |
| Step label | Rubik | 12px | 700 | 1.4 | 0 | sentence |
| Courier name | Rubik | 16px | 800 | 1.4 | 0 | sentence |
| Courier meta | Rubik | 13px | 400 | 1.4 | 0 | sentence |
| Initials | Rubik | 18px | 900 | 1 | 0 | upper |
| Summary title | Rubik | 15px | 800 | 1.4 | 0 | sentence |
| Summary list | Rubik | 14px | 400 / 700 | 1.4 | 0 | sentence, tabular numbers |
| Help link | Rubik | 15px | 700 | 1.4 | 0 | sentence |
| Toast | Rubik | 14px | 700 | 1.4 | 0 | sentence |

One family, five weights: 400, 500, 700, 800, 900. Do not add a second face. Prices use `font-variant-numeric: tabular-nums`.

## Implementation notes

**1. Move the courier along the real path.** Do not hand-animate x and y. Ask the path for its points, and drive the driven line with the same number so the line always ends under the dot.

```js
const route = document.getElementById('route');   // dotted full path
const done = document.getElementById('done');     // same d, solid
const L = route.getTotalLength();
done.style.strokeDasharray = `${L} ${L}`;
function place(p) {                               // p is 0..1
  const pt = route.getPointAtLength(L * p);
  courier.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
  done.style.strokeDashoffset = L * (1 - p);
}
let t0;
function frame(now) {
  t0 ??= now;
  const k = Math.min(((now - t0) % 18000) / 16000, 1);
  place(.46 + .28 * k);
  requestAnimationFrame(frame);
}
matchMedia('(prefers-reduced-motion: reduce)').matches
  ? place(.46) : requestAnimationFrame(frame);
```

In a real app, `p` comes from the courier's GPS snapped to the route. Ease toward each new value over 1 second. Do not jump.

**2. Fold the summary without measuring height.** Animate the grid row, not `height: auto`.

```css
.sum-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .32s var(--ease); }
.sum-body.open { grid-template-rows: 1fr; }
.sum-body > div { overflow: hidden; }
.sum-btn[aria-expanded="true"] svg { transform: rotate(180deg); }
```

**3. The pulsing current step.** The pulse is a box-shadow ring on a 7px dot, and the bar fill is a pseudo element. Both are CSS only.

```css
.now .bar { background: var(--tomato-soft); position: relative; overflow: hidden; }
.now .bar::after { content: ""; position: absolute; inset: 0; width: 55%;
  background: var(--tomato); border-radius: inherit; animation: fill 2.4s var(--ease) infinite; }
@keyframes fill { 0% { width: 20%; } 60%, 100% { width: 62%; } }
@keyframes beat { 0% { box-shadow: 0 0 0 0 rgba(214,52,31,.55); }
  70%, 100% { box-shadow: 0 0 0 7px rgba(214,52,31,0); } }
```

Common mistakes:

- A real map tile layer with labels everywhere. This is a drawn map: blocks, roads, one route. It must read at a glance.
- Putting the ETA inside the map as a floating card. The map shows where. The type shows when.
- Making the call button tomato. Then there are two loud reds and the minutes lose.
- Announcing the minutes every time they change. That is a screen reader shouting every 3 seconds.
- Easing the courier with `ease-in-out`. It should travel at a steady speed.
- Stretching the SVG with `preserveAspectRatio="none"`. Roads turn into ovals.
- Rounding everything to 999px. Cards and the map are 20px. Only the round buttons, dots, chip, and bars are pills.
- Drawing a status bar.

Rebuild order:

1. Page padding: 54px top, 34px bottom, cream background.
2. Header with back button, brand, and order line.
3. Map frame, then blocks and roads, then the two pins, then the route twice (dotted and solid), then the courier.
4. The ETA heading with the minutes on line two.
5. The four-step list with the current step styles.
6. Courier card and its two buttons.
7. Summary card with the fold.
8. Help link and toast.
9. Wire the courier loop, the minutes, and the live region.
10. Add the reduced-motion block and check 360 × 780.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
