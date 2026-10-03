<!-- Design Lounge Nº 337 · "Wallet card stack" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Wallet card stack

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The home screen of "Carrow", a phone wallet. Four passes sit in a stack on a near-black page: a Meridian debit card, a Lune Transit pass, a Brasa Coffee loyalty card and a Halcyon Hall concert ticket. Each card shows only its top 56px, except the last, which shows in full. Each card has its own quiet colour: graphite, deep teal, oxblood and sand. Tap a card and it rises to the top while the other three slide down into a small pile at the bottom. The space between fills with that card's details. The payment cards end in a "Hold near reader" state with a pulsing ring, then a gold tick. The detail to copy: every card is readable from its 56px strip alone, because the brand and one key number sit in that strip.

The language is iOS 26-ish without glass: 18px card radii, a sheet-style spring for layout moves, no translucent bars. Type is a wide grotesk (Archivo at 125% width) with mono numbers (JetBrains Mono).

## Reference behaviour

1. First frame: the stack is closed. Eyebrow "CARROW", heading "Wallet", a 44px round add button. Cards top to bottom: Meridian (€4,218.60), Lune Transit (€23.40), Brasa Coffee (7/10), Halcyon Hall (17 OCT). The ticket shows in full.
2. Under the stack: two hairline rows, "Brasa Coffee / Last payment · Meridian · 08:41 / −€4.80" and "Night Shift Orchestra / Next event · Halcyon Hall / Sat 19:00". Then "Default card · Meridian ••4821" and a full-width gold button "Pay with Meridian".
3. Tap any card's visible strip: that card moves to y 0 over 420ms on the sheet spring. The other three move to the bottom of the stack area, scale to 0.94 and sit 12px apart, so only their top edges show. The heading becomes the card's first word (Meridian, Lune, Brasa, Halcyon). The add button becomes a "Done" pill.
4. The details fade in 120ms after the move starts, rising 16px over 320ms. What they show depends on the card:
   - Meridian: "Available / €4,218.60", then three transactions: Fenwick Market −€38.20, Brasa Coffee −€4.80, Odell & Pryce +€3,100.00 (green). Button "Pay with this card".
   - Lune Transit: "Pass balance / €23.40", trips Harbour St → Mill Lane −€2.10, Mill Lane → Harbour St −€2.10, Top-up +€20.00. Button "Tap to ride".
   - Brasa Coffee: a white tile with an SVG barcode and "0811 4402 7719". Under it: "7 of 10 stamps" and "3 to a free cortado".
   - Halcyon Hall: a white tile with a 25×25 SVG QR code. Under it: "Row F · Seat 14" and "Doors 19:00".
5. The bottom bar (recent rows and the gold button) fades out and drops 20px while a card is open.
6. Tap the open card again, tap "Done", or press Escape: everything returns to the closed stack. Focus goes back to the card that was open.
7. Tap "Pay with this card": the pile slides off the bottom and fades. The details fade out. The pay panel fades in: a 112px ring with a contactless glyph, two gold rings pulsing out from it, "Hold near reader", "Meridian ••4821" in mono, and a "Cancel" pill.
8. After 2600ms the reader "answers": the ring fills gold, the glyph swaps for a tick that draws itself over 420ms, the text reads "Paid €4.80 / Brasa Coffee · 22:51", and the pill becomes "Done" and takes focus. Lune Transit shows "Gate open / Harbour St · €2.10".
9. "Cancel" or "Done" returns to the open card with its details.
10. The gold "Pay with Meridian" button on the closed stack opens Meridian and goes straight to the pay state.
11. Taps on cards do nothing while the pay panel is showing. The pile cards leave the tab order.

## Structure

```
390 × 844, page #0A0A0B
┌──────────────────────────────────────┐
│ 54 clearance                         │
│ CARROW                         (+)   │  eyebrow 11px mono, button 44
│ Wallet                               │  30px, 125% width
├──── stack area: top 130, bottom 34 ──┤
│ ┌──────────────────────────────────┐ │
│ │ MERIDIAN              €4,218.60  │ │  56 strip
│ ├──────────────────────────────────┤ │
│ │ LUNE TRANSIT             €23.40  │ │  56 strip
│ ├──────────────────────────────────┤ │
│ │ BRASA COFFEE               7/10  │ │  56 strip
│ ├──────────────────────────────────┤ │
│ │ HALCYON HALL             17 OCT  │ │
│ │( - - - - - - - - - - - - - - - )│ │  perforation at 56
│ │ Night Shift Orchestra            │ │
│ │ Sat · Doors 19:00     ROW F · 14 │ │  full card 350 × 221
│ └──────────────────────────────────┘ │
│                                      │
│ Brasa Coffee                 −€4.80  │  46 rows, hairlines
│ Night Shift Orchestra     Sat 19:00  │
│     Default card · Meridian ••4821   │
│ [ ))  Pay with Meridian            ] │  52 gold pill
│ 34 clearance                         │
└──────────────────────────────────────┘

open state
│ [ card at y 0, full 350 × 221 ]      │
│ details: top = card height + 18      │
│          bottom = 60                 │
│ pile: y = H − 44, H − 32, H − 20     │
```

- The header is a `header` with the eyebrow `p`, the `h1` and the add/done button.
- The stack area is `main` with `aria-label="Cards and passes"`, `position: absolute`, `overflow: hidden`, inset 20px left and right.
- Each card is a `button` with `aria-expanded` and `aria-controls="detail"`, `position: absolute; top: 0`, moved only with `transform`.
- Card faces use `span` elements, because they sit inside a button.
- `#detail` is a `section` with `aria-live="polite"`. It is filled from data when a card opens.
- `#pay` is a `section` with `aria-live="assertive"` and a `data-s` of `idle`, `hold` or `done`.
- The bottom bar is a `div` outside the stack, absolutely placed 34px from the bottom.

## Tokens

```css
:root {
  /* page */
  --bg: #0a0a0b;          /* page, and the ticket notches */
  --surface: #151517;
  --surface-2: #1d1d20;
  --line: #2a2a2e;        /* hairlines and pill borders */
  --ink: #f2efe9;         /* primary text */
  --ink-2: #b9b5ad;       /* secondary text */
  --ink-3: #8a867f;       /* labels, meta */
  --gold: #d9c8a3;        /* the one accent: pay button, pay ring, focus */
  --gold-ink: #16130c;    /* text on gold */
  --pos: #9cc7a4;         /* incoming money */

  /* card bodies, one each */
  --bank: #2b2d31;        /* graphite, gold text */
  --transit: #163f3c;     /* deep teal, #cfe6dc text */
  --loyal: #4e1d1a;       /* oxblood, #f0e2cf text */
  --ticket: #d6c7a6;      /* sand, #1d1a14 text */

  /* type */
  --wide: "Archivo", system-ui, sans-serif;            /* font-stretch 112–125% */
  --mono: "JetBrains Mono", ui-monospace, monospace;

  /* layout */
  --peek: 56px;
  --r-card: 18px;
  --r-pill: 26px;
  --card-ratio: 1.586;    /* ID-1 card */
  --gap-pile: 12px;

  /* motion */
  --ease: cubic-bezier(.32, .72, 0, 1);   /* sheet spring, layout */
  --std: cubic-bezier(.2, .7, .2, 1);     /* fades */
  --t-layout: 420ms;
  --t-micro: 160ms;
}
```

Card shadow: `0 -1px 0 rgba(255,255,255,.08) inset, 0 -8px 24px rgba(0,0,0,.45)`. The upward shadow is what separates one strip from the next. Do not add borders between cards.

## Typography

| Role | Family | Size | Weight | Width | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Eyebrow | JetBrains Mono | 11px | 500 | — | 0.14em | upper |
| Heading | Archivo | 30px | 650 | 125% | -0.01em | sentence |
| Card brand | Archivo | 13px | 650 | 125% | 0.06em | upper |
| Card figure | JetBrains Mono | 14px | 500 | — | -0.01em | as set |
| Card label | JetBrains Mono | 10px | 500 | — | 0.12em | upper, 70% opacity |
| Card number | JetBrains Mono | 15px | 400 | — | 0.08em | — |
| Ticket show | Archivo | 22px | 650 | 118% | -0.01em | title |
| Transit line | Archivo | 30px | 600 | 125% | 0 | upper |
| Balance | JetBrains Mono | 30px | 500 | — | -0.02em | — |
| Row title | Archivo | 14px | 550 | 100% | 0 | sentence |
| Row meta | Archivo | 12px | 400 | 100% | 0 | sentence |
| Row amount | JetBrains Mono | 14px | 400 | — | -0.01em | — |
| Pay status | Archivo | 22px | 650 | 125% | 0 | sentence |
| Buttons | Archivo | 14–15px | 600–650 | 112% | 0 | sentence |

Every number is mono with `font-variant-numeric: tabular-nums`. Every word is the wide grotesk. Load Archivo with the width axis: `family=Archivo:wdth,wght@62..125,400..700`, then use `font-stretch`. Minus signs are U+2212, not hyphens.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Delay |
| --- | --- | --- | --- | --- | --- | --- |
| Selected card | open | translateY | i × 56 → 0 | 420ms | `--ease` | 0 |
| Other cards | open | translateY, scale | i × 56, 1 → H − 44 + k × 12, 0.94 | 420ms | `--ease` | 0 |
| Details | open | opacity, translateY | 0, 16px → 1, 0 | 240ms / 320ms | `--std` / `--ease` | 120ms |
| Bottom bar | open | opacity, translateY | 1, 0 → 0, 20px | 240ms / 320ms | `--std` / `--ease` | 0 |
| Pile | pay | translateY, opacity | pile → H + 24, 0 | 420ms | `--ease` | 0 |
| Pay panel | pay | opacity | 0 → 1 | 240ms | `--std` | 160ms |
| Pulse rings | hold | scale, opacity | 1, 0.6 → 1.9, 0 | 1800ms loop | `--std` | ring two at 600ms |
| Ring fill | done | background | none → gold | 240ms | `--std` | 0 |
| Tick | done | stroke-dashoffset | 30 → 0 | 420ms | `--ease` | 80ms |
| Pay button | press | scale | 1 → 0.97 | 160ms | `--std` | 0 |

`H` is the stack area height. `k` counts only the unselected cards, in their original order.

Reduced motion: layout and micro durations drop to 1ms, so cards jump into place. The pulse rings do not animate. The tick shows fully drawn. The pay state still changes after 2600ms, because that is the reader answering, not decoration.

## States

- Closed: all four cards at `i × 56`, z-index `i`, `aria-expanded="false"`.
- Open: one card at 0, z-index 10, `aria-expanded="true"`. Header button reads "Done" with `aria-label="Close card"`.
- Hold: `#pay[data-s="hold"]`. Ring border `--line`, glyph gold, pulses running, pill "Cancel".
- Done: `#pay[data-s="done"]`. Ring filled gold, glyph `--gold-ink` tick, pill "Done".
- Card focus-visible: 2px gold outline, offset −3px, so the ring sits inside the rounded card and is not clipped by the next card.
- Other focus-visible: 2px gold outline, offset 3px.
- Pay button active: scale 0.97.
- Incoming amount: `--pos` and a leading "+". Outgoing: `--ink` and a leading "−".
- No empty state on this frame. A wallet with no passes would show one dashed card outline with "Add a card" and nothing else.
- No error state is drawn. A failed read keeps the ring, stops the pulse and shows "Try again" in the pay status line.

## Accessibility

- Each card is a button with a full name: "Meridian Debit, ending 4821", "Lune Transit monthly pass", "Brasa Coffee loyalty card, 7 of 10 stamps", "Halcyon Hall ticket, Saturday 17 October".
- `aria-expanded` on each card reflects open or closed. `aria-controls` points at the details section.
- Escape closes an open card and returns focus to it.
- In pay mode the hidden pile cards get `tabindex="-1"`. Focus moves to "Done" when payment succeeds.
- The pay panel is `aria-live="assertive"`, so "Paid €4.80" is read at once. The details are `polite`.
- The QR and barcode SVGs have `role="img"` and an `aria-label`.
- Hit targets: each card strip is 56px tall and full width. Header button and pay pills are 44px minimum. Transaction rows are 46px.
- Contrast: `#f2efe9` on `#0a0a0b` is about 17:1. `#8a867f` on `#0a0a0b` is about 5.4:1. Gold `#d9c8a3` on graphite `#2b2d31` is about 8:1. Sand ticket text `#1d1a14` on `#d6c7a6` is about 11:1.

## Responsive rules

- The frame is 390×844. The header starts at max(54px, safe-area top). The stack and bottom bar stop at max(34px, safe-area bottom).
- Cards fill the width minus 20px each side and keep the 1.586 ratio. At 360 wide a card is 320 × 202. Measure the card height in JS and use it for the details top. Do not hard-code 221.
- At 360 × 780 the open details area is about 330px tall. That still fits the balance, three 46px rows and the 52px button. If a product needs more rows, scroll inside `#detail`, never the page.
- The peek stays 56px at every width. Do not scale it with the card.
- At tablet width, centre the stack at a max width of 390px. A wallet is a phone screen.
- No horizontal scroll at 360 to 390.

## Acceptance checklist

### Always

- [ ] The closed stack shows each card's top 56px and the last card in full.
- [ ] Every card's 56px strip holds its brand and one key figure.
- [ ] Opening a card moves it to the top and drops the rest into a pile, all with `transform` only.
- [ ] The details appear after the card starts moving, never before.
- [ ] The pay flow has two states, hold and done, with a pulse in hold and a drawn tick in done.
- [ ] Escape and a second tap both close the card, and focus returns to it.
- [ ] Cards are buttons with `aria-expanded`. Hit targets are at least 44px.
- [ ] Reduced motion removes the pulse and the slide but keeps every state.
- [ ] No status bar is drawn. 54px top and 34px bottom clearance.

### This demo

- [ ] Order: Meridian (graphite), Lune Transit (teal), Brasa Coffee (oxblood), Halcyon Hall (sand).
- [ ] Peek 56px, card radius 18px, pile gap 12px, pile scale 0.94.
- [ ] Meridian shows €4,218.60 and three transactions, the third +€3,100.00 in `#9cc7a4`.
- [ ] Halcyon Hall shows a 25×25 QR with three finder squares. Brasa Coffee shows a barcode and 7 of 10 stamps.
- [ ] "Hold near reader" turns into "Paid €4.80 / Brasa Coffee · 22:51" after 2600ms.
- [ ] Layout moves are 420ms on `cubic-bezier(.32,.72,0,1)`.
- [ ] The only accent is `#d9c8a3`.

## Implementation notes

**1. Position cards from one function.** Keep a single `layout()` that reads `sel` and `mode` and writes every card's transform. Do not toggle classes per card. It keeps the three states (closed, open, pay) from drifting apart.

```js
function layout() {
  const ch = cards[0].offsetHeight, H = stack.clientHeight;
  let k = 0;
  detail.style.top = pay.style.top = (ch + 18) + 'px';
  cards.forEach((c, i) => {
    let y, s = 1, o = 1;
    if (sel < 0) y = i * 56;
    else if (i === sel) y = 0;
    else { y = mode === 'pay' ? H + 24 : H - 44 + k * 12; s = .94; o = mode === 'pay' ? 0 : 1; k++; }
    c.style.transform = `translateY(${y}px) scale(${s})`;
    c.style.opacity = o;
    c.style.zIndex = i === sel ? 10 : i;
    c.setAttribute('aria-expanded', i === sel);
  });
}
```

Call it again on `resize` and after `document.fonts.ready`, because the card height depends on width.

**2. The chip, the notches and the pulse are CSS only.**

```css
.chip { width: 40px; height: 30px; border-radius: 6px;
  background: linear-gradient(135deg, #cdb98e, #9c8a62); position: absolute; }
.chip::before { content: ""; position: absolute; inset: 10px 0; border-block: 1px solid rgba(0,0,0,.28); }
.chip::after  { content: ""; position: absolute; inset: 0 15px; border-inline: 1px solid rgba(0,0,0,.28); }
.c-ticket::before, .c-ticket::after { content: ""; position: absolute; top: 46px;
  width: 20px; height: 20px; border-radius: 50%; background: var(--bg); }
.c-ticket::before { left: -10px; } .c-ticket::after { right: -10px; }
.ring::before, .ring::after { content: ""; position: absolute; inset: -1px;
  border-radius: 50%; border: 1px solid var(--gold); opacity: 0; }
[data-s="hold"] .ring::before { animation: pulse 1800ms var(--std) infinite; }
[data-s="hold"] .ring::after  { animation: pulse 1800ms var(--std) 600ms infinite; }
@keyframes pulse { from { transform: scale(1); opacity: .6; } to { transform: scale(1.9); opacity: 0; } }
```

The notches are filled with the page colour. That only works because the ticket never sits over another card's face. Keep it last in the closed stack.

**3. Draw codes from a seeded random, not from an image.** A small seeded generator gives the same QR every load. Skip the 8×8 corners and draw three finder squares on top.

```js
const rng = s => () => (s = s * 16807 % 2147483647) / 2147483647;
function qr(n = 25, m = 6) {
  const r = rng(91), finder = (x, y) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
  let d = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++)
    if (!finder(x, y) && r() > .52) d += `M${x*m} ${y*m}h${m}v${m}h-${m}z`;
  return d;   // one <path>, then add three 7×7 finder rects
}
```

A real product draws its real code. This is a stand-in that reads as a code at a glance.

Common mistakes:

- Animating `top` instead of `transform`. It drops frames on a phone.
- Letting the details render before the card moves. The text then sits under a card in flight.
- Showing the full face of every card in the closed stack. The 56px strip is the point.
- One accent colour per card on the page chrome. The page stays black and gold. Only the card bodies carry colour.
- A bright neon success green. The tick is gold on gold ink.
- A glowing blob behind the stack.
- Pulse rings that keep running after "Paid". Stop them in the done state.
- Setting the balance in the grotesk. All numbers are mono.

Rebuild order:

1. Page, header, empty stack area with the 130px top and 34px bottom.
2. Four card faces at the 1.586 ratio, each with its 56px strip.
3. `layout()` for the closed stack.
4. Open and close, with the header button swap and Escape.
5. Details per card from data.
6. Pay panel with hold, timer and done.
7. Bottom bar and its fade.
8. Reduced motion and focus rings.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
