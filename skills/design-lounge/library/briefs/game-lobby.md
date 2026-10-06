<!-- Design Lounge Nº 481 · "Bramble parlour lobby" · www.designlounge.live -->

# Bramble parlour lobby

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The waiting room for Bramble, a fictional Sunday tile parlour. The host is already in seat 01. Three seats are open. A room code can be copied. Each local player has a Ready control. In this demo there is one local player, Mira Cole, the host. Start stays disabled until at least two players are ready. About 1.2 seconds after load, a scripted guest sits in seat 02 and is already ready, so the room feels occupied without a network call. Start then deals. The deal is one sentence that resolves. It is not a spinner and it does not loop.

The feeling is a plaster room with a walnut host card: Fraunces for the names, Outfit for the labels, one brick accent. The detail worth copying is the Start gate. A single ready player, including the guest alone, cannot open the hand.

## Structure

```
1280 x 800
┌ Walnut 440px ──────────────────┬ Plaster 840px ─────────────────────────┐
│ Bramble                        │ SEATS                    1 of 4 seated │
│ SUNDAY TABLE                   │ ┌──────────────┐ ┌──────────────┐      │
│                                │ │ 01           │ │ 02           │      │
│ Parlour 4                      │ │ MC           │ │ Open seat    │      │
│ Tiles go out when two          │ │ Mira Cole    │ │ Waiting      │      │
│ players are ready.             │ │ Host, you    │ │              │      │
│                                │ │ [ READY ]    │ │              │      │
│ ROOM CODE                      │ └──────────────┘ └──────────────┘      │
│ BRAM-4821        [ Copy ]      │ ┌──────────────┐ ┌──────────────┐      │
│                                │ │ 03 Open seat │ │ 04 Open seat │      │
│ You are the host. You deal.    │ └──────────────┘ └──────────────┘      │
│                                │                                        │
│ Need two ready players.        │                                        │
│ [ START ]                      │                                        │
└────────────────────────────────┴────────────────────────────────────────┘
```

After Start, the plaster side keeps the Seats header and replaces the grid with one centred line, then a return button:

```
│ SEATS                    2 of 4 seated │
│                                        │
│         Dealing eight tiles.           │
│         (800ms later)                  │
│         Dealt. Eight tiles each.       │
│         [ RETURN TO SEATS ]            │
```

- `main.room` is a 440px + 1fr grid, height 100%.
- Left `section.side`: brand `p`, kicker `p`, `h1` "Parlour 4", lede, label, code row (`p#code` plus `#copy`), host line, then `.foot` with `#status` and `#start`.
- Right `section.stage`: header with `h2` "Seats" and `#count`, then `#seats` (four `article.seat`) and `#deal` (hidden at rest).
- `#deal` holds `#deal-line` and `#back` (hidden until the deal resolves).
- One visually hidden `p#live` with `aria-live="polite"`. Do not put a second live region on the visible status.

## Motion

| Thing | Trigger | Property | From | To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Guest seat | 1200ms after load, class `in` | transform | translateY(10px) | none | 360ms | cubic-bezier(0.16, 1, 0.3, 1) | animation none, guest still visible |
| Copy label | click, then timer | text | Copy | Copied, back to Copy | 0ms swap, hold 1600ms | n/a | same timers |
| Ready fill | click | background, color | outline | brick fill | 0ms | n/a | same |
| Deal line | Start, then 800ms | text | Dealing eight tiles. | Dealt. Eight tiles each. | hold 800ms | n/a | same timer, no spinner |
| Return | after the 800ms | visibility | hidden | shown | 0ms | n/a | same |

No looping animation. The guest slide plays once. Do not pulse a dot. Do not rotate a ring.

## States

- Copy, rest: transparent, 1px `--side-muted` border, cream type, height 44px, min-width 112px. Hover is not a separate colour. Focus-visible: 2px cream outline, offset 3px, because the control sits on walnut.
- Copy, copied: same chrome, label "Copied", for 1600ms.
- Ready, off: transparent, 1px `--brick` border, brick type, height 44px, min-width 120px. The 16px check is in the layout at opacity 0 so the label does not jump.
- Ready, on (`aria-pressed="true"`): background `--brick`, type `--cream`, check opacity 1.
- Guest flag: same box as Ready on, but a `span`, not a button. It never toggles.
- Open seat: dashed 1px `--line`, transparent ground, name in `--muted` at 28px, content centred as a group.
- Filled seat: solid 1px `--line`, `--cream` ground, content top-aligned, control pinned with `margin-top: auto`.
- Start, disabled: full width, height 52px, 1px `--side-muted` border, transparent, cream type, `cursor: not-allowed`. Still readable on walnut.
- Start, enabled: background and border `--brick`, cream type.
- Start, during and after the deal until return: disabled even if two players are ready.
- Deal region: hidden at rest (`hidden` attribute plus `[hidden] { display: none !important }` so a grid display cannot override it).
- Focus on plaster: 2px `--brick` outline, offset 3px. Remove the default outline on `:focus` and show it on `:focus-visible` only.

## Accessibility

- Regions: left section labelled by the `h1`. Right section labelled by the `h2`.
- Copy button accessible name is "Copy room code" at rest and "Copied" for 1600ms. The visible word is still Copy or Copied.
- Start has `aria-describedby="status"` so the disabled reason is the visible status sentence.
- Ready is a toggle button, not a checkbox. `aria-pressed` is the state. Space and Enter activate it because it is a `button`.
- Seat articles expose a full `aria-label`: "Seat 1, Mira Cole, host, not ready", updated when Ready toggles. Seat 2 changes from "Seat 2, open" to "Seat 2, Jonas Hale, guest, ready". Seats 3 and 4 stay "Seat 3, open" and "Seat 4, open".
- Monograms are `aria-hidden="true"`. Icons are inline SVG on a 24 grid, 1.75px stroke, round caps, `currentColor`, `aria-hidden="true"`.
- One polite live region announces: ready on, ready off, code copied, guest arrival, dealing, dealt, and the return.
- The visible status is not itself a live region. Update it for sighted readers and mirror the moments that matter into `#live`.
- Hit targets: Copy 44px, Ready 44px, Start 52px, Return 44px. All wider than 40px.
- Contrast: cream `#F7F1E4` on walnut `#3A2E22` is about 11:1. `#CDBFA8` on walnut is about 7:1. Brick `#7A2E24` with cream type is about 8:1. Muted `#6B5E4A` on plaster `#E8DCC8` is about 5.6:1. Do not fade the disabled Start with opacity.
- Tab order: Copy, Start (skipped while disabled), Ready, then Return when the deal has resolved. Open seats are not in the tab order.

## Responsive rules

- At 1280 and above: two columns, side 440px, seats a 2 by 2 grid that fills the stage. `body` is `overflow: hidden`. No page scrollbar.
- 801px to 1100px: side narrows to 340px, room title 40px, code 28px, seat names 26px. Still one screen, no page scroll.
- 641px to 800px: stack the side above the stage. `body` may scroll. Stage min-height 720px so four seats remain usable.
- Below 640px: seats become one column, each min-height 180px. Deal line drops to 32px.
- The piece is authored at 1280 by 800. Smaller widths reflow. They do not introduce a new screen.

## Acceptance checklist

### Always

- [ ] The frame is a host panel plus a 2 by 2 seat grid. Exactly four seats.
- [ ] Exactly one local Ready toggle. Remote guests do not get a toggle.
- [ ] Start is disabled when fewer than two players are ready, and enabled when two or more are ready.
- [ ] A scripted guest occupies one empty seat about 1200ms after load and is ready in that same update.
- [ ] Copy changes its label for 1600ms and attempts a clipboard write without throwing if the write fails.
- [ ] Start replaces the seats with one line of dealing copy, then a finished line. No spinner, no infinite animation.
- [ ] The finished line offers a way back to the seats. Ready state survives that return.
- [ ] Focus-visible rings are present on walnut and on plaster. Hit targets are at least 44px tall.
- [ ] `prefers-reduced-motion: reduce` removes the guest animation. The guest still appears.
- [ ] No localStorage, cookies, alert, console.log, document.write, or timers faster than 16ms.

### This demo

- [ ] Product is Bramble. Title is "Parlour 4". Kicker is "Sunday table". Lede is "Tiles go out when two players are ready."
- [ ] Code is `BRAM-4821`. Host copy is "You are the host. You deal."
- [ ] Seat 01 is Mira Cole, MC, "Host, you", Ready off at the first frame. Count is "1 of 4 seated".
- [ ] At 1200ms seat 02 becomes Jonas Hale, JH, "Guest", with a Ready flag. Live text is "Jonas Hale sat down and is ready."
- [ ] Seats 03 and 04 stay "Open seat" / "Waiting".
- [ ] Status is "Need two ready players." or "Two players are ready."
- [ ] Deal line is "Dealing eight tiles." for 800ms, then "Dealt. Eight tiles each." Return label is "Return to seats".
- [ ] Palette is plaster `#E8DCC8`, walnut `#3A2E22`, cream `#F7F1E4`, brick `#7A2E24`. Type is Fraunces and Outfit.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame, 1280 by 800, before any timer: left walnut panel, right plaster. Wordmark "Bramble", kicker "Sunday table", title "Parlour 4", lede "Tiles go out when two players are ready." Room code "BRAM-4821" with a Copy button. Host line "You are the host. You deal." Status "Need two ready players." Start is disabled. Seats heading "Seats" and count "1 of 4 seated".
2. Seat 01 is Mira Cole, monogram MC, role "Host, you", Ready button with `aria-pressed="false"`. Seats 02, 03, and 04 read "Open seat" and "Waiting". Seat numbers are 01, 02, 03, 04.
3. Copy click writes `BRAM-4821` with `navigator.clipboard.writeText` inside try/catch. The button label becomes "Copied" and its accessible name becomes "Copied". A polite live region says "Room code copied." After 1600ms the label returns to "Copy" and the accessible name returns to "Copy room code". A clipboard failure still shows Copied.
4. Ready click toggles `aria-pressed`. On becomes filled brick with a check. Off returns to a brick outline and hides the check. Live region: "You are ready." or "You are not ready." Seat 01 accessible name updates to include "ready" or "not ready".
5. Start's disabled state is derived, never stored as a separate flag except while a deal is on screen. Ready count = 1 if Mira's `aria-pressed` is true, else 0, plus 1 if the guest has arrived. If the count is below 2, Start is disabled and the status is "Need two ready players." If the count is 2 or more, Start is enabled and the status is "Two players are ready."
6. At 1200ms, seat 02 stops being an open seat. It becomes Jonas Hale, monogram JH, role "Guest", with a static Ready flag (not a button). Accessible name: "Seat 2, Jonas Hale, guest, ready". Count becomes "2 of 4 seated". Live region: "Jonas Hale sat down and is ready." Then the Start gate runs again. If Mira is already ready, Start enables in that same turn. If she is not, Start stays disabled.
7. Seats 03 and 04 never fill.
8. Start click, only when enabled: hide the four seats, show the deal region, disable Start, set the line and the status and the live region to "Dealing eight tiles." Hide the return button. There is no spinner, no progress ring, and no looping mark.
9. 800ms later the line, status, and live region become "Dealt. Eight tiles each." The return button "Return to seats" is shown. The line stays. It does not animate forever.
10. Return to seats clears the 800ms timer if it is still pending, hides the deal region, shows the seats, and runs the Start gate again. Live region: "Back in the parlour." Ready states are kept. Jonas stays seated.
11. Do not read or write localStorage, sessionStorage, or cookies. Do not call alert, console.log, or document.write.

## Tokens

```css
:root {
  --plaster: #E8DCC8;     /* stage ground */
  --walnut: #3A2E22;      /* host panel */
  --walnut-2: #2A2118;    /* unused depth, keep for the seam if you add one */
  --cream: #F7F1E4;       /* filled seat, type on walnut */
  --cream-2: #E7D8C0;     /* monogram tile */
  --ink: #2C2416;         /* plaster type */
  --muted: #6B5E4A;       /* seat meta on plaster */
  --line: #C9B89A;        /* seat border */
  --brick: #7A2E24;       /* ready on, start on, focus on plaster */
  --side-muted: #CDBFA8;  /* secondary type on walnut */
  --side-text: #F3EADF;   /* primary type on walnut */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --sit: cubic-bezier(0.16, 1, 0.3, 1);
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 28px;
  --space-7: 36px;
  --side-w: 440px;
  --seat-gap: 16px;
  --radius: 0px;
  --dur-sit: 360ms;
  --dur-guest: 1200ms;
  --dur-deal: 800ms;
  --dur-copy: 1600ms;
}
```

Every colour in the screen comes from this list. Do not add a purple, a glow, or a gradient.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Wordmark | Fraunces | 28px | 600 | 1 | -0.02em | Sentence |
| Kicker | Outfit | 12px | 500 | 1.2 | 0.18em | Uppercase |
| Room title | Fraunces | 48px | 600 | 1.02 | -0.03em | Sentence |
| Lede, host | Outfit | 16px / 15px | 400 | 1.45 | 0 | Sentence |
| Label | Outfit | 12px | 500 | 1.2 | 0.16em | Uppercase |
| Room code | Fraunces | 34px | 600 | 1 | 0.03em | Uppercase, tabular nums |
| Copy, return | Outfit | 14px | 500 / 600 | 1 | 0.04em / 0.08em | Sentence / uppercase |
| Status | Outfit | 14px | 400 | 1.3 | 0 | Sentence |
| Start | Outfit | 15px | 600 | 1 | 0.12em | Uppercase |
| Seats heading | Outfit | 13px | 600 | 1 | 0.16em | Uppercase |
| Count | Outfit | 14px | 400 | 1 | 0 | Sentence, tabular nums |
| Seat index | Outfit | 12px | 600 | 1 | 0.16em | Digits |
| Monogram | Fraunces | 18px | 600 | 1 | 0 | Uppercase |
| Seat name | Fraunces | 32px (28px if open) | 600 | 1.1 | -0.02em | Sentence |
| Role | Outfit | 14px | 400 | 1.3 | 0 | Sentence |
| Ready, flag | Outfit | 13px | 600 | 1 | 0.1em | Uppercase |
| Deal line | Fraunces | 44px | 600 | 1.15 | -0.03em | Sentence |

Fraunces optical size: set `font-variation-settings: "opsz" 72` on the room title. Fallback stack: Fraunces, Georgia, serif. Outfit, "Avenir Next", sans-serif.

## Implementation notes

**Gate Start off the ready count, and keep the deal from re-enabling it.** One function owns the button. The `dealing` flag returns early so the 1200ms guest cannot flip Start back on while the line is up.

```js
function sync() {
  var n = (readyBtn.getAttribute('aria-pressed') === 'true' ? 1 : 0) + (guestIn ? 1 : 0);
  count.textContent = (1 + (guestIn ? 1 : 0)) + ' of 4 seated';
  if (dealing) return;
  var open = n >= 2;
  startBtn.disabled = !open;
  status.textContent = open ? 'Two players are ready.' : 'Need two ready players.';
}
```

Common mistake: enabling Start as soon as the guest arrives, even though the local player is not ready. The guest counts as one. Mira counts only while `aria-pressed` is true.

**The deal is a sentence with an end.** Hide the grid, show the line, and resolve it. Cancel the timer on return so a late callback cannot write "Dealt" over the seats.

```js
startBtn.addEventListener('click', function () {
  if (startBtn.disabled) return;
  dealing = true;
  startBtn.disabled = true;
  seats.hidden = true;
  deal.hidden = false;
  back.hidden = true;
  line.textContent = 'Dealing eight tiles.';
  dealTimer = setTimeout(function () {
    line.textContent = 'Dealt. Eight tiles each.';
    back.hidden = false;
  }, 800);
});
```

Common mistake: a CSS spinner with `animation: spin 1s linear infinite` that never reaches a dealt state. Do not add one.

**Seat the guest in one timer.** Replace the open-seat markup, then call `sync()` before the live message so the count and Start are already true when the announcement fires.

```js
setTimeout(function () {
  guestIn = true;
  guest.classList.remove('open');
  guest.classList.add('guest', 'in');
  guest.setAttribute('aria-label', 'Seat 2, Jonas Hale, guest, ready');
  guest.innerHTML = '<!-- num, monogram, name, role, span.flag -->';
  sync();
  live.textContent = 'Jonas Hale sat down and is ready.';
}, 1200);
```

Common mistake: starting the guest at opacity 0 and only revealing them with a transition. If the transition never finishes, the seat stays invisible. Keep the guest painted, and only translate them.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
