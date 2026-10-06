<!-- Design Lounge Nº 176 · "Boarding pass with fold-out details" · www.designlounge.live -->

# Boarding pass with fold-out details

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The boarding pass screen of a fictional airline, Cirrus Air, for flight CA 417 from Kathmandu (KTM) to Bangkok (BKK). The pass is an 800px paper card on a pale sky ground. The left part shows the route in 64px codes with a dotted arc between them and an orange plane that glides halfway along it. Below sit gate, boarding time, group and seat. A dashed tear line with two round notches separates a 240px stub holding the passenger name and a QR code. Under the card, "Unfold details" folds a second sheet down from the card's bottom edge like folded paper, and "Add to Wallet" saves the pass with a short confirmation. The detail worth copying is the fold: the sheet rotates down from `rotateX(-88deg)` while its row grows from `0fr` to `1fr`, so it looks hinged rather than slid.

## Structure

```
1280 × 800, body grid centred, padding 32px 20px
.wrap width min(800px, 100%)
┌──────────────────────────── 560 ────────────────────────────┬●──── 240 ─────┐
│ ⟋ Cirrus Air   BOARDING PASS · CA 417 · SUN 18 OCT [On time]┆ PASSENGER     │
│                                                              ┆ ANJALI RAI    │
│ KTM            ╭ ─ ─ ✈ ─ ─ ╮               BKK               ┆ ┌──────────┐  │
│ Kathmandu 08:10   3h 15m · nonstop   Bangkok 12:55           ┆ │ QR 136px │  │
│ ──────────────────────────────────────────────────────────── ┆ └──────────┘  │
│ GATE 14B │ BOARDS 07:35 │ GROUP 3 │ SEAT 23A                 ┆ Zone 3 · …    │
└──────────────────────────────────────────────────────────────┴●──────────────┘
   ╰ details sheet, inset 14px each side, folds down: 4 × 2 grid ╯
[ ⌄ Unfold details ]                                   [ ▭ Add to Wallet ]
```

- The pass is an `article` labelled "Boarding pass, Cirrus Air flight CA 417, Kathmandu to Bangkok". Grid `1fr 240px`, radius 18px.
- `section.main`: top row (brand, mono label, status chip), `.route` grid `auto 1fr auto`, then `dl.facts` with four pairs.
- `section.stub` labelled "Scan at the gate": passenger label and name, `.qr` (`role="img"`, `aria-label="Boarding QR code"`), sequence text.
- Notches: `::before` and `::after` on the pass, 28px circles in `--bg`, centred on the dashed line at top and bottom.
- `.fold` wrapper (`id="fold-panel"`) holds a `dl.sheet` of eight pairs.
- `.actions`: two buttons, space-between.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing |
| --- | --- | --- | --- | --- |
| Plane | load, pointerenter | position on path, rotation | t 0 → 0.5 | 1600ms (1200ms replay), `1 − (1 − k)^4` |
| Arc fill | with plane | stroke-dashoffset | L → L × 0.5 | same |
| Status dot | always | opacity | 1 → .25 → 1 | 2.4s, standard, infinite |
| Fold row | toggle | grid-template-rows | 0fr ↔ 1fr | 420ms expo out |
| Fold sheet | toggle | transform | rotateX(−88deg) ↔ none | 520ms expo out |
| Chevron | toggle | rotate | 0 ↔ 180deg | 320ms expo out |
| Wallet busy | click | spinner rotate | 0 → 1 turn | 700ms linear, loop until done |
| Pass dip | added | transform | 0 → translateY(10px) scale(.985) → 0 | 620ms expo out |
| Button press | active | scale | 1 → .97 | 120ms standard |

Reduced motion: no plane flight (placed at 0.5), no blink, no dip, no fold transitions, no wait on the wallet.

## States

- Fold button: resting is a 1px inset ring at 22% ink; hover adds `rgba(255,255,255,.55)`; `aria-expanded="true"` flips the chevron and the label.
- Wallet resting: `--ink` fill, white text, 208px min width. Hover `#1c3448`. Busy: spinner replaces the icon, label "Adding…", clicks ignored. Added: `--ok` fill, check icon, "In Wallet · Remove", `aria-pressed="true"`.
- Focus-visible: 2px `--accent` outline, offset 3px, on both buttons.
- Status chip: "On time" in `--ok` on `#e3f1ea`. A delayed flight would swap to the accent on a pale orange; not shown here.
- The QR is decorative data. There is no loading or error state for it in this demo.

## Accessibility

- The pass is an `article` with a full sentence label. The stub section is labelled "Scan at the gate".
- Facts and details are `dl` lists, so screen readers pair label and value.
- The QR container is `role="img"` with a label; the arc and plane are `aria-hidden`.
- Fold button: `aria-expanded` and `aria-controls="fold-panel"`.
- Wallet button: `aria-pressed`. A polite live region confirms "Boarding pass added to Wallet. It will surface at Kathmandu airport." and "Removed from Wallet."
- Tab order: fold, then wallet. The pass itself is not focusable; it has no action.
- Contrast: `--ink` on `--paper` 16:1; `--ink-2` labels 6:1; `--accent` on paper is about 3:1, so it is used only for 28px+ values and the plane, never body text.
- Buttons are 44px tall.

## Responsive rules

- ≥1024: as specified, 800px wide.
- 768: the pass still fits at 728px; columns shrink, codes stay 64px.
- ≤720: the pass stacks. Main on top, stub below (254px tall), dashed line becomes horizontal and the notches move to the left and right ends of it. Codes drop to 40px, city text 13px, arc height 56px, duration hidden. Facts become a 2 × 2 grid. The stub becomes `1fr auto` with the QR on the right. The details sheet becomes two columns. The wallet button grows to fill the row.
- 375: no horizontal scroll; the mono label in the top row is hidden and the chip moves right.

## Acceptance checklist

### Always

- [ ] Main part and stub are separated by a dashed line with two round notches that sit exactly on it, in both layouts.
- [ ] The plane moves along the arc and rotates to its tangent; the travelled part of the arc is solid, the rest dotted.
- [ ] Unfold grows the space and rotates the sheet from its top edge; fold reverses it.
- [ ] Fold button exposes `aria-expanded` and `aria-controls`.
- [ ] Wallet has resting, busy, added states and can be undone; `aria-pressed` reflects it.
- [ ] A live region confirms wallet changes.
- [ ] Codes and identifiers are monospaced; values are at least 28px in the facts row.
- [ ] Stacks to one column at ≤720px with no horizontal scroll at 375px.
- [ ] Reduced motion removes the flight, blink, dip and fold animation.

### This demo

- [ ] Cirrus Air, CA 417, Sun 18 Oct, KTM 08:10 → BKK 12:55, 3h 15m nonstop.
- [ ] Gate 14B, Boards 07:35, Group 3 (orange), Seat 23A. Passenger Anjali Rai, Zone 3 · Economy Light, SEQ 087 · QX7RLM.
- [ ] Details: Terminal 1 International, Gate closes 07:55, 1 × 23 kg checked, Vegetarian, ticket 217 4402 938156, booking QX7RLM, A321neo, Stratus Silver.
- [ ] Pass 800px wide, stub 240px, radius 18px, notches 28px.
- [ ] Wallet busy for 700ms then green `#1f7a55`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: pass centred, details folded away, button reads "Unfold details", wallet button reads "Add to Wallet". The plane starts at KTM and glides to the middle of the arc over 1600ms (quartic ease out). The solid part of the arc follows behind it.
2. Pointer enters the pass: the plane replays from the start to the middle over 1200ms.
3. The "On time" chip has a 6px dot that fades to 25% and back every 2.4s.
4. Click "Unfold details": `aria-expanded` becomes true, label "Fold details", chevron turns 180°. The details row grows from `0fr` to `1fr` over 420ms and the sheet rotates from `rotateX(-88deg)` to `none` over 520ms, both expo out, hinge at the top edge, perspective 1100px.
5. Click "Fold details": the reverse.
6. Click "Add to Wallet": the button shows a spinner and "Adding…" for 700ms, then turns green (`--ok`), shows a check and reads "In Wallet · Remove", `aria-pressed="true"`. The pass dips 10px and back over 620ms. The live region says the pass was added.
7. Click again while added: it returns to "Add to Wallet", `aria-pressed="false"`, live region "Removed from Wallet." Clicks during the 700ms busy state are ignored.
8. Reduced motion: plane is placed at the middle at once, no blink, no dip, no fold animation (the sheet appears and disappears instantly), wallet confirms immediately.

## Tokens

```css
:root {
  --bg: #dce5ea;          /* sky ground; notch fill */
  --paper: #fbfbf8;       /* pass */
  --paper-2: #f2f3ef;     /* details sheet */
  --ink: #0f2130;
  --ink-2: #4f6170;       /* labels */
  --line: #d3dadf;        /* hairlines, dashed tear line, arc track */
  --accent: #ff5a1f;      /* plane, group, brand mark, focus */
  --ok: #1f7a55;          /* on-time chip text, wallet added */
  --sans: "Familjen Grotesk", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --r: 18px;
  --shadow: 0 1px 0 rgba(15,33,48,.06), 0 24px 48px -24px rgba(15,33,48,.35);
  --std: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --t-fold-row: 420ms;
  --t-fold-sheet: 520ms;
  --t-fly: 1600ms;
}
```

Spacing: main padding 24px 30px 26px, gap 22px. Stub padding 24px 26px, gap 14px. Sheet padding 20px 26px 22px, gap 16px 20px.

## Typography

| Role | Family | Size | Weight | Tracking | Notes |
| --- | --- | --- | --- | --- | --- |
| Brand | Familjen Grotesk | 17px | 700 | −.01em | |
| Labels (GATE, PASSENGER) | IBM Plex Mono | 11px | 500 | .12em | upper, `--ink-2` |
| Airport code | Familjen Grotesk | 64px / 0.9 | 700 | −.04em | |
| City + time | Familjen 14px + Plex Mono 14px 500 | | | | time in `--ink` |
| Duration | IBM Plex Mono | 12px | 500 | 0 | `--ink-2` |
| Fact value | Familjen Grotesk | 28px | 600 | −.02em | group in `--accent` |
| Passenger | Familjen Grotesk | 18px | 700 | .02em | upper |
| Sequence | IBM Plex Mono | 12px / 1.5 | 500 | 0 | |
| Sheet value | Familjen Grotesk | 15px | 500 | 0 | sub-line 13px `--ink-2` |
| Buttons | Familjen Grotesk | 15px | 600 | 0 | |

Codes, times and identifiers are mono. Words are grotesk.

## Implementation notes

The fold is two transitions on two elements. The wrapper animates its row; the sheet rotates from its top edge:

```css
.fold { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 420ms var(--expo); perspective: 1100px; margin: 0 14px; }
.fold.open { grid-template-rows: 1fr; }
.fold > div { overflow: hidden; }
.sheet { transform-origin: 50% 0; transform: rotateX(-88deg); transition: transform 520ms var(--expo); }
.open .sheet { transform: none; }
```

Do not animate `height: auto` with JS measurements, and do not use `max-height` hacks; `grid-template-rows` interpolates cleanly.

The plane follows the SVG path with `getPointAtLength`, scaled because the SVG uses `preserveAspectRatio="none"`:

```js
function place(t) {
  const p = track.getPointAtLength(L * t), q = track.getPointAtLength(Math.min(L, L * t + 1));
  const r = arc.getBoundingClientRect(), sx = r.width / 300, sy = r.height / 78;
  const a = Math.atan2((q.y - p.y) * sy, (q.x - p.x) * sx) * 180 / Math.PI;
  plane.style.transform = `translate(${p.x * sx}px, ${p.y * sy}px) rotate(${a + 90}deg)`;
  done.style.strokeDashoffset = L * (1 - t);
}
```

The plane is an HTML-positioned SVG on top of the arc SVG, not inside it, so it does not stretch with the arc. Make sure your generic `.arc svg { inset: 0; width: 100% }` rule does not also hit the plane.

The QR is a 25 × 25 module grid drawn as a single `path` (`M x y h1 v1 h-1z` per module) with three 7 × 7 finder squares at three corners and `shape-rendering: crispEdges`. In a product, render the real payload with a QR library instead.

Common mistakes:

- Notches drawn on only one part, or not centred on the dashed line after the layout stacks.
- Making the whole pass a giant button. It has no single action.
- Putting the airport codes in the mono face. Codes are the display; mono is for small identifiers.
- A wallet button with no undo.
- Using the accent orange for body text.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
