<!-- Design Lounge Nº 297 · "Live checkout bento" · designlounge.vercel.app -->

# Live checkout bento

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Studied from stripe.com: the product section where each feature card holds a small, real piece of the product (a checkout form floating over a connected-accounts table, an issued card) instead of an icon and a paragraph. This version is for an invented billing platform for fitness studios, Courant, on cool mist with navy ink and one vermilion accent. Three small cells each prove one claim with a control you can press; the wide cell runs a whole payment, and the money visibly lands in the ledger behind it. That cause-and-effect between two overlapping UIs is the detail worth copying.

## Reference behaviour

1. The section opens with a two-tone `h2`: a navy lead sentence, then a slate continuation. "Explore products →" sits bottom-right of the heading row.
2. Cell 1, "Charge in 31 currencies.": a 34px mono amount "€48.00" over four pill chips EUR / GBP / USD / JPY. EUR starts pressed. Pressing another chip fades the amount down 6px (160ms), swaps the text (£41.30, $52.10, ¥7,820) and brings it back. The amount is a polite live region.
3. Cell 2, "Issue instructor cards.": a 168 × 92px navy card with a vermilion ring clipped off its top-right corner, "•••• 4417", cardholder "Ines Barroso", and a spend bar "€640 of €1,000 this month" at 64%. Hovering the card lifts it 3px and turns it −1.5°. The "Freeze card" button toggles a frost overlay (diagonal 2px stripes over a pale blue wash, a "Frozen" tag), desaturates the card to 20% and scales it to 0.97; the button reads "Unfreeze card" and has `aria-pressed="true"`.
4. Cell 3, "Recover failed renewals.": a three-step track, Day 0 Declined (vermilion ×), Day 3 Retried (slate ↻), Day 5 Paid (green ✓), with a green fill line between them, and "Recovered in September €1,240" under a dashed rule. Hovering the cell or pressing "Replay retries" resets it and replays: dots fill at 0, 450 and 900ms while the line grows over 900ms.
5. Wide cell, "Embed checkout in your booking flow": text column on the left (290px), a scene on the right. In the scene, a dashboard window ("dashboard.courant.test/payouts") shows a "Studio payouts" table with six studios and a "Today · €29,184.00" total. A checkout card for "Juniper Pilates" floats over the window's left edge with a shadow.
6. The checkout has a Monthly / Yearly segmented control (sliding white thumb, 280ms). Yearly shows "−20%" and changes "Due today" from €120.00 to €1,152.00 and the button label to match.
7. Payment method is two radio rows, Card •••• 0291 and Bank debit SEPA. The checked row gets a vermilion border and a 3px vermilion-tint ring.
8. Pressing "Pay €120.00" shows a spinner and "Processing" for 950ms, then the button turns green with a check and "Paid". At the same moment a "Juniper Pilates · Lisbon · +€120.00" row slides into the top of the ledger (8px drop, 700ms) with a vermilion-tint background that fades over 2.4s; the bottom row is removed so the table keeps six rows; the total rises by the amount. A "Run again" link appears in the checkout's top-right corner and resets the button.

## Structure

```
┌──────────────────────────────────── 1280 × 800 ─────────────────────────────────────┐
│  One ledger for every way you charge. Memberships, drop-in classes       Explore →  │ h2 28px, 2 lines
│  and instructor payouts settle in the same place, in the same minute.               │
├───────────────────────────┬───────────────────────────┬─────────────────────────────┤
│ Charge in 31 currencies.  │ Issue instructor cards.   │ Recover failed renewals.    │ cells 262px tall
│ ┌───────────────────────┐ │ ┌───────────────────────┐ │ ┌─────────────────────────┐ │ gap 16px
│ │       €48.00          │ │ │   [ navy card 4417 ]  │ │ │ ●────────●────────●     │ │
│ │ (EUR)(GBP)(USD)(JPY)  │ │ │   €640 of €1,000 ▬▬   │ │ │ Day0    Day3     Day5   │ │
│ └───────────────────────┘ │ └───────────────────────┘ │ │ Recovered  €1,240       │ │
│                           │ Card 4417   [Freeze card] │ #20418     [Replay]       │
├──────────────┬────────────┴───────────────────────────┴─────────────────────────────┤
│ Embed        │        ┌ ● ● ●  dashboard.courant.test/payouts ─────────────────────│ wide 332px
│ checkout in  │  ┌─────────────┐  Studio payouts                Today · €29,184.00  │
│ your booking │  │ J Juniper   │  Studio            City    Balance     Volume      │
│ flow         │  │ [Mon|Year]  │  H Harbour Barre   Porto   €2,348.00   €41,562.90  │
│              │  │ Due €120.00 │  … 6 rows, 33px                                    │
│ Read guide → │  │ (•) Card    │                                                    │
│   290px      │  │ [ Pay ]     │  checkout 272px wide, left 28px, top 44px          │
└──────────────┴──┴─────────────┴────────────────────────────────────────────────────┘
```

- `section[aria-labelledby]` → `.head` (`h2`, link) → `.grid` of four `article.cell`.
- Each small cell: a `p` with a bold lead (`b`) and a muted rest, a `.stage` (sunk panel), and optionally a `.cell-foot` row with a caption and a 30px button.
- The chip row is `role="group"` with `aria-pressed` buttons.
- The wide cell is `article.cell.wide` (row flex): `.text` (h3, p, link) and `.scene`. In the scene, `.window` is absolutely placed (left 150px, top 24px, bleeding off right and bottom) and the checkout `form` floats above it at `z-index: 2`.
- The ledger is a real `table` with `th scope="col"`; numbers are right-aligned mono.
- The checkout is a `form`: segmented control `role="radiogroup"` with two `role="radio"` buttons, a `fieldset` of two native radios, a submit button, a reset button, and an `sr-only` live status `p`.

## Tokens

```css
:root {
  --mist: #EEF1F5;        /* page */
  --card: #FFFFFF;        /* cells, window, checkout */
  --sunk: #F6F8FA;        /* stages, segmented track */
  --ink: #14213D;         /* text, pay button, issued card */
  --ink-2: #5B6782;       /* muted copy, h2 continuation */
  --ink-3: #8590A6;       /* table headers, hints */
  --line: #DDE2EA;        /* cell borders */
  --line-2: #E9ECF1;      /* inner rules */
  --accent: #E4572E;      /* checked ring, card ring, declined */
  --accent-ink: #B83E1B;  /* links, −20% (accessible on white) */
  --accent-tint: #FCEAE4; /* rings, new-row flash */
  --ok: #1F8A5B;          /* paid, recovered */

  --sans: "Geist", system-ui, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;

  --r-card: 10px; --r-ctl: 6px;
  --shadow: 0 1px 2px rgba(20,33,61,.06), 0 12px 32px -12px rgba(20,33,61,.22);
  --gap: 16px; --pad-cell: 18px;

  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## Typography

| Role | Family | Size / line | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Section heading | Geist | 28px / 1.22 | 500 | -0.025em | lead `--ink`, rest `--ink-2` |
| Wide cell title | Geist | 22px / 1.2 | 500 | -0.02em | `--ink` |
| Cell copy | Geist | 14px / 1.45 | 400, lead 600 | 0 | `--ink-2`, lead `--ink` |
| Currency amount | Geist Mono | 34px | 500 | -0.03em | `--ink` |
| Chips | Geist Mono | 12px | 500 | 0 | `--ink` / white |
| Table head | Geist | 11px | 500 | 0 | `--ink-3` |
| Table body | Geist (numbers Geist Mono) | 12px | 400–500 | 0 | `--ink` |
| Checkout total | Geist Mono | 15px | 500 | 0 | `--ink` |
| Buttons | Geist | 12px (cells), 14px (pay) | 500 | 0 | |

Every money figure is mono with tabular numerals, so swapping €120.00 for €1,152.00 never shifts the layout sideways.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Currency swap | chip click | opacity, translateY | 1,0 → 0,6px → 1,0 | 160 + 200ms | standard / expo | instant swap |
| Issued card | hover | translateY, rotate | 0 → −3px, −1.5° | 300ms | expo | none |
| Freeze | button | frost opacity, saturate, scale | 0, 1, 1 → 1, .2, .97 | 300ms | standard | instant |
| Retry dots | hover / replay | background | line → step colour | 200ms, delays 0/450/900ms | standard | instant |
| Retry line | hover / replay | width | 0 → 66.8% | 900ms | standard | instant |
| Segment thumb | click / arrows | translateX | 0 → 100% | 280ms | expo | instant |
| Pay | submit | spinner, then fill | ink → green | 950ms wait, 200ms fill | standard | 300ms wait, no spin |
| New ledger row | payment | opacity, translateY, background | 0, −8px, tint → 1, 0, clear | 700ms + 2400ms | expo / standard | instant, no flash |

## States

- Chip: rest white with `--line` border; hover border `--ink-3`; pressed navy fill, white text.
- Freeze button: `aria-pressed` false/true, label swaps between "Freeze card" and "Unfreeze card".
- Segmented control: unchecked label `--ink-2`, checked `--ink` on the white thumb.
- Method row: rest `--line` border; checked `--accent` border + 3px `--accent-tint` ring; keyboard focus adds a 2px outline on the row.
- Pay button: idle navy "Pay €120.00"; hover `#0B1630`; busy spinner + "Processing" + `aria-busy`; done green + check + "Paid" (further submits are ignored); reset by "Run again".
- Ledger: new row flashes tint then settles; table always shows six rows.
- Focus-visible everywhere: 2px `--accent` outline, offset 2px.

## Accessibility

- The `h2` names the section via `aria-labelledby`. Each cell is an `article`.
- Currency amount is `aria-live="polite"`, so the new price is read once after a chip press.
- Card state change is announced by a hidden polite region ("Card frozen" / "Card active"). The card graphic itself is `aria-hidden`.
- The billing control is a `radiogroup`; ← / → switch period and move focus, with roving `tabindex`.
- Payment method uses native radios inside a `fieldset` with a hidden legend.
- After payment, a hidden polite status reads "Paid €1,152.00 by card. Added to studio payouts." The visual row flash is not the only signal.
- `--accent-ink` (#B83E1B) is used for text on white (≈ 5.6:1); the brighter `--accent` is used only for borders, rings and the declined dot.
- Small-cell buttons are 30px tall on desktop; on touch layouts raise them to 40px.

## Responsive rules

- ≥ 1280: as drawn, max-width 1184px plus 24px padding.
- 1100: window left 120px, ledger padding-left 170px.
- < 860: one column; cells grow to their content (stage min-height 150px); the wide cell stacks text over a 420px scene; the checkout sits at the top-left of the scene and the window starts 180px down; the heading row stacks.
- < 480: the checkout becomes full width minus 32px; the window starts 330px down; scene height 560px. The ledger table clips inside its window rather than scrolling the page.
- At 375 nothing overflows the page horizontally.

## Acceptance checklist

### Always

- [ ] Every cell's illustration is working UI with at least one real control, not a picture.
- [ ] The wide cell shows two overlapping UIs, and acting in the front one changes the back one.
- [ ] Section heading is one `h2` with a strong lead and a muted continuation.
- [ ] All money figures are mono and tabular.
- [ ] One accent colour, used for rings, the declined step and links; success uses a separate green.
- [ ] Toggle buttons expose `aria-pressed`; the billing switch is a radiogroup with arrow keys.
- [ ] Payment success is announced in a live region.
- [ ] Reduced motion keeps every state change but removes travel and flashes.
- [ ] No horizontal overflow at 375px.

### This demo

- [ ] Brand Courant; heading "One ledger for every way you charge."
- [ ] Currency chips EUR/GBP/USD/JPY showing €48.00 / £41.30 / $52.10 / ¥7,820.
- [ ] Card ending 4417 for Ines Barroso, €640 of €1,000.
- [ ] Monthly €120.00, Yearly €1,152.00 (−20%).
- [ ] Paying adds a Juniper Pilates, Lisbon row and raises €29,184.00 by the amount.

## Implementation notes

**1. Make the front UI write into the back UI.** Keep the ledger as data you can prepend to, cap it at six rows, and update the total in the same tick as the button turns green. Run the row animation and the tint flash as two animations on the cells, so the slide is fast and the colour lingers.

```js
const tr = document.createElement('tr');
tr.className = 'new';
tr.innerHTML = `<td>…Juniper Pilates</td><td>Lisbon</td><td class="num">+${eur(amount)}</td><td class="num">${eur(amount + 860000)}</td>`;
rows.prepend(tr);
if (rows.children.length > 6) rows.lastElementChild.remove();
sum += amount; sumEl.textContent = eur(sum);
status.textContent = `Paid ${eur(amount)} by ${method}. Added to studio payouts.`;
```

```css
tr.new td { animation: rowin .7s var(--expo) both, rowtint 2.4s var(--ease) both; }
@keyframes rowin { from { opacity: 0; transform: translateY(-8px); } }
@keyframes rowtint { 0%, 40% { background: var(--accent-tint); } 100% { background: transparent; } }
```

**2. The overlap is layout, not decoration.** The window is absolutely positioned and bleeds off the scene's right and bottom edges; its table gets enough left padding (200px) to clear the floating checkout. If you centre the window inside the card, the scene looks like a screenshot and loses the "this is the product" feeling.

**3. Replaying CSS-driven steps.** The retry track is pure CSS keyed off a `.run` class with transition delays. To replay, remove the class, force a reflow, and add it back on the next frame.

```js
const replay = () => { rt.classList.remove('run'); void rt.offsetWidth; requestAnimationFrame(() => rt.classList.add('run')); };
```

Common mistakes:

- Static PNG-like mockups. If nothing in a cell responds, it is the wrong piece.
- A column flex child with `flex: 1` and only absolute children collapses to 0 height when stacked; give the scene `flex: none` and an explicit height on small screens.
- Using the bright accent for link text on white; it fails contrast.
- Letting the ledger grow forever, which pushes the card taller after each payment.
- Real card networks or bank logos on the card. Keep it a wordmark.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
