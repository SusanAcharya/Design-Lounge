<!-- Design Lounge Nº 261 · "Phone ride request" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Phone ride request

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Keep the three states: plan, finding, found.

## What it is

The ride screen of a city app called Kerb, used at night. A near-black map fills the phone. A dashed acid-yellow route runs from a white ring pin at 14 Corran Street to a yellow square at Harbour Terminal B. A flat dark panel sits at the bottom with the two places, a swap button, three ride types, the card on file, and one acid button that says "Request Car".

Pressing it turns the panel into "Finding your driver" with radar rings spreading from the pickup pin. After 3.4 seconds a driver card appears with the plate number set large in mono, white on black like a real plate.

The look is industrial night: near-black greys, white type, one acid yellow `#d7ff2e`, condensed Barlow in caps for names, IBM Plex Mono for every number, 8px corners, 1px hairlines, no shadows. The panel behaves like an iOS sheet (slides with the sheet curve) but stays flat. No glass.

The detail worth copying: the button label names the ride you picked. "Request Car" becomes "Request XL" the moment you pick XL. Nobody has to guess what they are about to pay for.

## Reference behaviour

1. First frame, plan state: map with route and both pins, panel with Pickup "14 Corran Street", Destination "Harbour Terminal B", options Moto, Car, XL with Car selected, payment row, and the "Request Car" button.
2. A small panel on the drop pin reads "18 MIN" in mono. It is the trip time, not the wait time.
3. Tapping a ride option selects it. The selected row gets a 1px acid border, a dark olive wash `#1d2110`, and an acid icon. The button text changes to "Request" plus the option name.
4. Arrow keys move the selection inside the option group, wrapping from XL to Moto. Only the selected row is in the tab order.
5. Tapping swap exchanges the pickup and destination text and turns the swap icon 180 degrees in 300ms. A live region says "Pickup is now Harbour Terminal B".
6. Tapping "Request Car" switches to the finding state. The panel content slides up 12px and fades in over 360ms. Focus moves to "Cancel request".
7. Finding state: eyebrow "Request sent · Car · $11.80" in acid mono, heading "Finding your driver" in 36px caps, line "3 drivers nearby · usually under 1 min", a 3px progress track with a sliding acid segment, two notes, and a Cancel button.
8. On the map in finding state, three acid rings grow from the pickup pin, radius 10 to 110, fading out, 2.4 seconds each, 0.8 seconds apart. The route dims to 35%.
9. Cancel request returns to plan state and moves focus to the Request button. A live region says "Request cancelled".
10. After 3.4 seconds without cancel, the found state appears. Focus moves to "Cancel ride". The live region reads the driver, car, plate, and wait.
11. Found state: eyebrow "Driver found · arrives in 4 min", a 52px white tile "MO", name "Mara Okafor", "4.92 rating · 2,140 trips", a plate block with "Grey · Toyota / Corolla Hybrid" and "KRB 4471", Message and Call buttons, and a "Cancel ride" text button.
12. On the map in found state, a white car marker fades in and slides 98px along Corran Street toward the pickup in 1.2 seconds.
13. Cancel ride returns to plan state.
14. With reduced motion, rings show as three still circles at radius 30, 60, 90 at 50% opacity, the car appears in place, and panel changes are instant.

## Structure

```
390 × 844, map fills the frame, panel pinned to the bottom

  [≡]           [ KERB ]            [◷]     top 54px, 44px squares
       ┌───────────────────── ■ (18 MIN)
       │
  ─────┼──────── CORRAN ST ─────
       ◎ pickup
┌──────────────────────────────────────┐  panel, radius 8px 8px 0 0
│               ────                   │  grab 36 × 4
│ ┌──────────────────────────────────┐ │
│ │ ○ PICKUP                         │ │  54px rows
│ │   14 Corran Street          [⇅]  │ │  swap 44px, right 8px
│ │ ■ DESTINATION                    │ │
│ │   Harbour Terminal B             │ │
│ └──────────────────────────────────┘ │
│ [moto]  MOTO   3 MIN · 1 SEAT  $6.40 │  58px rows, gap 6px
│ [car]   CAR    5 MIN · 4 SEATS $11.80│  selected
│ [xl]    XL     9 MIN · 6 SEATS $17.20│
│ [card] VISA ···· 4417 · PERSONAL  CHANGE │ 48px
│ [        REQUEST CAR               ] │  56px acid
└──────────────────────────────────────┘  padding-bottom 34px
```

- Map: an `aria-hidden` `div` holding one SVG with `viewBox="0 0 390 844"` and `preserveAspectRatio="xMidYMin slice"`. It fills the whole frame and never resizes between states, so the route never jumps.
- Draw the route in the band from y 100 to y 330 of the view box. The plan panel covers everything under about y 360.
- Top bar: a `header` with two 44px square buttons and the wordmark between them. It sits over the map.
- Panel: a `section` labelled "Ride request" with three views. Only one view shows, chosen by `data-state` on `body`: `plan`, `finding`, `found`.
- Places: a bordered box with two `button` rows and an absolutely placed swap `button`.
- Options: a `div role="radiogroup"` with three `button role="radio"`.
- Payment: one `button` with a full label.
- Finding: `p` eyebrow, `h2`, `p`, a `div role="progressbar"`, a `ul`, a Cancel `button`.
- Found: eyebrow, driver row, plate block, a two-column grid of buttons, a text button.
- One visually hidden `p aria-live="polite"` for state changes.

## Tokens

```css
:root {
  /* colour */
  --map: #0d0e0f;        /* map ground, page */
  --block: #141517;      /* city blocks */
  --road: #202225;       /* main roads */
  --road-2: #18191b;     /* side streets */
  --panel: #121314;      /* bottom panel, top buttons */
  --raise: #1a1b1d;      /* places box, plate block */
  --line: #2b2d30;       /* 1px hairlines */
  --ink: #f2f2ee;        /* primary text, pickup pin, plate */
  --ink-2: #b4b6b8;      /* secondary text */
  --ink-3: #8b8e92;      /* field keys, option meta */
  --acid: #d7ff2e;       /* the one accent */
  --on-acid: #0d0e0f;    /* text on acid */
  --acid-wash: #1d2110;  /* selected option fill */

  /* type */
  --cond: "Barlow Condensed", "Arial Narrow", sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;

  /* space: 4px base */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px;

  /* shape */
  --r: 8px;

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --sheet: cubic-bezier(.32, .72, 0, 1);
  --view-in: 360ms;
  --ring: 2400ms;
  --find-wait: 3400ms;
  --car-in: 1200ms;
}
```

Acid appears on: the route, the drop pin, the selected option border and icon, the Request button, the eyebrows, the progress segment, and the radar rings. Never on body text. Never as a large fill except the one button.

## Typography

| Role | Family | Size | Weight | Tracking | Case |
| --- | --- | --- | --- | --- | --- |
| Wordmark | Barlow Condensed | 20px | 700 | 0.2em | upper |
| Field key | IBM Plex Mono | 10px | 500 | 0.14em | upper |
| Field value | Barlow Condensed | 19px | 600 | 0 | sentence |
| Option name | Barlow Condensed | 22px | 700 | 0.04em | upper |
| Option meta | IBM Plex Mono | 11px | 400 | 0.06em | upper |
| Price | IBM Plex Mono | 16px | 600 | 0 | tabular |
| Payment | IBM Plex Mono | 13px | 500 | 0.06em | upper |
| Change link | Barlow Condensed | 16px | 600 | 0.04em | upper |
| Request button | Barlow Condensed | 22px | 700 | 0.12em | upper |
| Eyebrow | IBM Plex Mono | 11px | 500 | 0.16em | upper |
| State heading | Barlow Condensed | 36px | 700 | 0.01em | upper, line-height 1 |
| Driver name | Barlow Condensed | 24px | 700 | 0 | upper |
| Plate | IBM Plex Mono | 24px | 600 | 0.12em | upper |
| Map labels | IBM Plex Mono | 8px | 500 | 0.14em | upper, `#5a5d61` |

Rule: words in Barlow, numbers in Plex Mono. Prices, times, seats, card digits, trips, and the plate are all mono.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Panel view | state change | opacity, translateY | 0, 12px → 1, 0 | 360ms | `--sheet` | instant |
| Option select | tap or arrow | border, background | `--line` → `--acid` | 160ms | `--ease` | instant |
| Swap icon | tap | rotate | 0 ↔ 180deg | 300ms | `--ease` | instant |
| Radar rings ×3 | finding | circle `r`, opacity | 10 → 110, 0.9 → 0 | 2400ms, delays 0 / 800 / 1600ms, loop | `--ease` | still rings r 30/60/90 at 0.5 |
| Route dim | finding | opacity | 1 → 0.35 | 300ms | `--ease` | instant |
| Search track | finding | translateX of 30% segment | -100% → 340% | 1400ms loop | `--ease` | segment rests at the left |
| Car marker | found | opacity, translate | x -20 → 78 on y 226 | 1200ms | `--ease` | appears in place |
| Request press | press | scale | 1 → 0.98 | 120ms | `--ease` | instant |

The radar is the one moment of drama. Everything else is a cut or a short fade.

## States

- Option resting: 1px `--line` border, transparent fill, grey icon.
- Option selected: 1px `--acid` border, `--acid-wash` fill, acid icon, meta text lifts to `--ink-2`, `aria-checked="true"`, `tabindex="0"`.
- Request button: acid fill, near-black text. Pressed: scale 0.98.
- Request disabled (not drawn): when a field is empty, fill `--raise`, text `--ink-3`, label "Add a destination".
- Finding: panel shows the search view, rings on the map, route at 35%.
- Found: panel shows the driver view, car marker on the map, route at full strength.
- Swap: icon turns; field labels "Pickup" and "Destination" stay put, only the values move.
- Focus-visible: 2px acid outline, 2px offset, on every control including the map top buttons.
- No drivers (not drawn): after 60 seconds, heading "No cars right now", a "Try Moto" button, and Cancel.
- Surge (not drawn): price gets a mono "×1.4" tag in acid next to it. Do not turn the price red.

## Accessibility

- The map is decorative and `aria-hidden`. The places and the live region carry the meaning.
- The page has a visually hidden `h1` "Request a ride". State views use `h2`.
- Place rows are buttons named "Pickup: 14 Corran Street". After swap, the names update.
- Ride options use the radio pattern: `role="radiogroup"` with a label, `role="radio"` and `aria-checked` on each, roving `tabindex`, arrow keys move and select.
- The payment row is one button named "Payment: Visa ending 4417. Change".
- The search bar is `role="progressbar"` with the label "Searching for a driver" and no value.
- The plate has `aria-label="Plate number K R B 4 4 7 1"` so it is read letter by letter.
- On each state change, focus moves to the main control of the new view: Cancel request, Cancel ride, or Request.
- Live region text: "Finding your car driver", "Request cancelled", "Driver found. Mara Okafor, grey Toyota Corolla, plate K R B 4 4 7 1, arrives in 4 minutes", "Ride cancelled".
- Hit targets: top buttons 44px, swap 44px, option rows 58px (52px under 800px tall), payment 48px, Request 56px, Cancel 52px, found buttons 52px, Cancel ride 44px.
- Contrast: `#f2f2ee` on `#121314` is about 17:1. `#8b8e92` on `#121314` is about 5.6:1. `#0d0e0f` on `#d7ff2e` is about 17:1.

## Responsive rules

- 390 × 844: the route band (y 100 to 330) shows fully above the panel.
- 360 × 780: the map scales by 0.92 and the route still clears the panel. Under 800px tall, option rows drop to 52px, place rows to 50px, and the state heading to 32px.
- Option meta stays on one line. If a product has longer meta, cut the seat count before wrapping.
- Long place names truncate with an ellipsis. The swap button keeps 60px of space on the right.
- Never scroll sideways. Never let the panel scroll in plan state at 844px.
- Tablet: dock the panel as a 380px column on the left, full height, and let the map fill the rest.
- Do not draw a status bar. The map runs under the top 54px. The top buttons start at 54px.

## Acceptance checklist

### Always

- [ ] The map fills the frame and does not rescale between states.
- [ ] Pickup and destination are two rows in one box with one swap button between them.
- [ ] Ride options are a radio group with arrow keys and one tab stop.
- [ ] The primary button names the selected option.
- [ ] Three states: plan, finding, found. Each moves focus to its main control.
- [ ] Finding has a Cancel. Found has a Cancel ride.
- [ ] The plate is mono, high contrast, and read letter by letter.
- [ ] One accent colour, used on the route, selection, and primary button.
- [ ] Every number is in the mono face.
- [ ] Hit targets are 44px or more. No horizontal scroll at 360px.
- [ ] Reduced motion freezes the radar and the car.

### This demo

- [ ] Brand Kerb. Pickup 14 Corran Street. Destination Harbour Terminal B. Trip tag "18 MIN".
- [ ] Moto 3 min, 1 seat, $6.40. Car 5 min, 4 seats, $11.80, selected. XL 9 min, 6 seats, $17.20.
- [ ] Payment "VISA ···· 4417 · PERSONAL".
- [ ] Accent `#d7ff2e`, map `#0d0e0f`, panel `#121314`, radius 8px.
- [ ] Driver appears after 3.4 seconds: Mara Okafor, 4.92, grey Toyota Corolla Hybrid, plate KRB 4471, 4 min.

## Implementation notes

**1. One map, three states.** Put the state on `body` and let CSS pick the view and the map extras. Do not resize the map per state. If the SVG is sized to the space above the panel, it rescales each time the panel height changes and the route jumps.

```css
.map { position: absolute; inset: 0; }
.view { display: none; }
body[data-state="plan"] .v-plan,
body[data-state="finding"] .v-finding,
body[data-state="found"] .v-found { display: block; animation: in .36s var(--sheet); }
@keyframes in { from { opacity: 0; transform: translateY(12px); } }
body[data-state="finding"] #routeLine { opacity: .35; }
body[data-state="finding"] .rings circle { animation: ring 2.4s var(--ease) infinite; }
.rings circle:nth-child(2) { animation-delay: .8s; }
.rings circle:nth-child(3) { animation-delay: 1.6s; }
@keyframes ring { 0% { r: 10; opacity: .9; } 100% { r: 110; opacity: 0; } }
```

Animating the SVG `r` property from CSS works in current Chrome, Safari, and Firefox. If you need older Safari, scale a `g` instead.

**2. The radio group with roving tabindex.**

```js
const opts = [...document.querySelectorAll('.opt')];
function pick(o, focus) {
  opts.forEach(x => { x.setAttribute('aria-checked', x === o); x.tabIndex = x === o ? 0 : -1; });
  reqName.textContent = o.dataset.name;           // "Request Car"
  if (focus) o.focus();
}
opts.forEach((o, i) => {
  o.onclick = () => pick(o);
  o.onkeydown = e => {
    const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    pick(opts[(i + d + opts.length) % opts.length], true);
  };
});
```

**3. The finding timer must be cancellable.** Keep the timeout id. Clear it on Cancel, or a cancelled request turns into a found driver 3 seconds later.

```js
let timer;
request.onclick = () => { setState('finding', '#cancel'); timer = setTimeout(() => setState('found', '#cancelRide'), 3400); };
cancel.onclick = () => { clearTimeout(timer); setState('plan', '#request'); };
```

Common mistakes:

- Drawing the map in mid grey. It must be near-black so the acid route is the brightest line on the screen.
- A second accent for the selected option, like blue. One acid only.
- Glowing pins or blurred halos. Pins are flat: a white 4px ring and an acid square with a dark 3px stroke.
- Prices in the condensed face. They jitter as they change. Use mono with tabular numbers.
- Rounded 20px cards. This family is 8px.
- Leaving the old button text "Request a ride". Say the option.
- A radar that keeps running after the driver is found.
- Drawing a status bar or a home indicator glyph.

Rebuild order:

1. Full-frame map SVG: ground, water corner, blocks, side streets, main roads, labels.
2. Route, pickup ring, drop square with the trip tag, three empty ring circles, car marker.
3. Top bar with two square buttons and the wordmark.
4. Panel with the places box and swap.
5. Option radio group and payment row.
6. Request button with the live option name.
7. Finding view, rings, and the cancellable timer.
8. Found view with the plate block and car marker.
9. Live region text and focus moves.
10. Reduced-motion block, then check 360 × 780.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
