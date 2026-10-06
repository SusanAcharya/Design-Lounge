<!-- Design Lounge Nº 506 · "Manage subscription, honest cancel" · www.designlounge.live -->

# Manage subscription, honest cancel

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The subscription screen of Larkmoor, an invented podcast app, in an iOS 26-ish language: a glass nav bar, a deep navy plan card with a faint waveform, two plan tiles, grouped billing rows, and a bottom sheet for cancelling. The price is set in Gloock, a high-contrast display serif, so the number reads like a receipt headline. Everything else is Onest. What's worth copying is that it refuses dark patterns. All the arithmetic is computed and shown. Cancel is a normal row in the accent colour, not a grey whisper. The cancel sheet names the exact date access ends and the four concrete things that stop. "Keep Plus" and "Cancel plan" are the same size, side by side.

## Structure

```
390 x 844
+--------------------------------------------+  glass nav, padding-top 54
| < Account        Subscription              |  44px
+--------------------------------------------+
| +----------------------------------------+ |  plan card, navy, radius 24
| | LARKMOOR PLUS              (o Active)  | |  padding 18 20 20
| | $7.99  per month           ||| ||| ||  | |  52px Gloock, waveform 180x70
| | Renews 14 Nov                          | |
| | Billed to card ending 4417             | |
| | [        Resubscribe        ] (off)    | |  only when cancelled
| +----------------------------------------+ |
| CHANGE PLAN                                |
| +------------------+ +------------------+  |  radio tiles, radius 16
| | Monthly [Current]| | Yearly [Save 27%]|  |  min-height 116
| | $7.99 /mo        | | $69.99 /yr       |  |
| | $95.88 a year (o)| | $5.83 a month ( )|  |
| +------------------+ +------------------+  |
| [ change panel + Switch button ]           |  only when selection differs
| Plan changes start at your next renewal... |
| BILLING                                    |
| | [card] Card ending 4417  Expires 08/28 > |  rows 56px
| | [ccw]  Restore purchases               > |
| | Cancel subscription                      |  own group
| Cancel any time. You keep Plus until ...   |
+--------------------------------------------+
```

- `header.nav` with the back `button` and an `h1` "Subscription".
- The plan card is a `section` labelled by the brand line. The waveform is a decorative `svg` with `aria-hidden`.
- The tiles are `button role="radio"` inside `role="radiogroup"` labelled by the "Change plan" heading, with roving `tabindex`.
- The change panel is `aria-live="polite"`, so the new arithmetic is read out when it opens.
- The billing rows are `button`s in a `role="group"`. The cancel sheet is `role="dialog"` with `aria-modal`, `aria-labelledby`, and `aria-describedby` pointing at the date sentence.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Tile select | click / arrows | ring, radio fill | 1px line → 2px ink; radio inset 1.5 → 6px | 160ms | `--ease` | instant |
| Tile press | :active | scale | 1 → 0.98 | 160ms | `--ease` | instant |
| Change panel | selection differs | max-height, opacity | 0, 0 → 260px, 1 | 340ms / 160ms | `--ease` | instant |
| Plan card | switch, cancel, resubscribe | scale | 0.98 → 1 | 340ms | `--sheet` | none |
| Scrim | sheet open | opacity | 0 → 1 | 340ms | `--ease` | instant |
| Cancel sheet | open / close | translateY | 100% → 0 | 340ms | `--sheet` | instant |
| Restore spinner | tap | rotate | loop | 800ms | linear | static ring |
| Toast | message | translateY, opacity | 24px, 0 → 0, 1 | 340ms / 160ms | `--sheet` | instant, 2.6s |

## States

- **Active, no change pending:** green chip, "Renews 14 Nov".
- **Active, change pending:** "Renews 14 Nov as Yearly, $69.99". The Current tag sits on the pending plan. The other tile shows "Save 27%" (yearly) or no tag (monthly).
- **Cancelled:** persimmon chip, "Ends on 14 Nov 2026", Resubscribe inside the card, plan tiles and cancel row removed.
- **Restoring:** row `aria-busy="true"`, spinner, "Checking your purchases...". Repeat taps are ignored.
- **Tile hover:** ring darkens to `#aebcc3`. **Selected:** 2px `--ink` ring, filled radio.
- **Focus-visible:** 2px `--accent-ink` outline, offset 2px, radius 8px.
- **Error (not simulated):** a failed restore shows "Couldn't reach the store. Try again." in the row line. Keep the chevron and don't change plan state.
- **Empty (never subscribed):** replace the card with a plain "Larkmoor Free" card and show the tiles with a "Start Plus" button. There is no cancel row and no Restore spinner unless tapped.

## Accessibility

- Plan tiles are a radiogroup. Arrow keys move selection and focus. Only the selected tile is in the tab order.
- The change panel is `aria-live="polite"`. The arithmetic sentence is real text, not an image.
- The cancel sheet traps Tab between its two buttons, starts focus on "Keep Plus", closes on Escape, and returns focus to the cancel row. After a confirmed cancel, focus goes to Resubscribe, because the cancel row no longer exists.
- Toasts are `role="status"`. The waveform and icons are `aria-hidden`.
- Targets: back 44px, tiles 116px tall, rows 56px, buttons 50px, Resubscribe 50px.
- Contrast: `#0f2130` on `#f7fafa` is 15.6:1. `#5a6a76` on `#f7fafa` is 5.3:1 (4.7:1 on the `#e6ecee` page). `#b23f1c` on `#f7fafa` is 5.5:1 and 4.7:1 on `#fbe2d8` (Save tag). `#f3eee6` on `#12324a` is 11.5:1. `#b9c6cf` on `#12324a` is 7.6:1. White on `#c8461f` is 4.8:1. Do not use `#e8552d` behind white text.
- The status chip has a text label ("Active", "Cancelled"), not just a coloured dot.

## Responsive rules

- Designed at 390×844. The active state fits in one frame. Opening the change panel makes the page scroll.
- At 360 wide the two tiles stay side by side (each about 157px). The price in the card stays 52px.
- **Largest text size:** rows grow vertically. The tile grid is `repeat(auto-fit, minmax(150px, 1fr))`, so it stacks to one column when two tiles no longer fit. In production, set the minimum in `em` so it reacts to text size. Row title and value (`flex-wrap: wrap`) stack. In the sheet, the paired buttons stack with Keep Plus first. The card price may drop to 44px, and never truncates.
- Tablet: present as a form sheet, max 560px wide.
- Do not draw a status bar or home indicator.

## Acceptance checklist

### Always

- [ ] The plan card shows the price, the period, and the next renewal date in words.
- [ ] Every derived number (yearly total, per-month equivalent, saving, percent) is computed from cents and shown.
- [ ] Plan changes state when they take effect and that nothing is charged today.
- [ ] Payment method and Restore purchases are visible without opening the cancel flow.
- [ ] Cancel is a full-size row in the accent colour, not hidden or greyed.
- [ ] The cancel sheet states the exact end date, says "won't be charged again", lists concrete losses, and lists what stays.
- [ ] Keep and Cancel are the same size. No guilt copy, no countdown offers, no extra "are you sure" screens.
- [ ] The cancelled state shows "Ends on <date>" and a Resubscribe button.
- [ ] Tiles are a keyboard-operable radiogroup. The sheet traps and restores focus.
- [ ] Every target is at least 44px. Reduced motion removes the sheet slide and card settle.

### This demo

- [ ] $7.99 monthly, $69.99 yearly, $95.88 a year, $5.83 a month, $25.89 saving, "Save 27%".
- [ ] "Renews 14 Nov", "Ends on 14 Nov 2026", card ending 4417 expiring 08/28.
- [ ] Losses: 38 downloaded episodes, ads on free shows, transcripts and chapter search, Morning Queue.
- [ ] Navy `#12324a` card on mist `#e6ecee`, persimmon accent, Gloock prices with Onest text.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. **Initial state, active monthly.** The plan card shows "LARKMOOR PLUS", a green "Active" chip, "$7.99" at 52px with "per month", "Renews 14 Nov", and "Billed to card ending 4417".
2. **Plan tiles.** Two radio tiles in a 2-column grid, 10px gap, min 116px tall:
   - Monthly: "$7.99 /mo", "$95.88 a year", grey "Current" tag, selected (2px ink ring, filled radio).
   - Yearly: "$69.99 /yr", "$5.83 a month", persimmon "Save 27%" tag.
   - All derived values are computed from integer cents: `799 × 12 = 9588`; `9588 − 6999 = 2589`; `round(2589 / 9588 × 100) = 27`; `round(6999 / 12) = 583`.
3. **Selecting a different plan** opens a panel under the tiles (max-height 0 → 260px, 340ms):
   - Monthly to yearly: "You pay **$69.99 on 14 Nov**, then once a year. That is $25.89 less than 12 months at $7.99." plus an ink "Switch to yearly" button.
   - Yearly to monthly: "You pay **$7.99 on 14 Nov**, then every month. Over a year that is $95.88, $25.89 more than yearly." plus "Switch to monthly".
   - Selecting the current plan again closes the panel.
   - A permanent hint under the tiles: "Plan changes start at your next renewal. Nothing is charged today."
4. **Switch.** Tap "Switch to yearly". The card keeps "$7.99 per month" (that is still what you pay now) and the line becomes "Renews 14 Nov as Yearly, $69.99". The "Current" tag moves to Yearly. The card does a 340ms scale settle from 0.98. Toast: "Switches to yearly on 14 Nov." Switching back toasts "Change undone. You stay on monthly."
5. **Billing rows.** "Card ending 4417 / Expires 08/28" with a chevron (the demo toasts "Payment methods open in your device settings."). "Restore purchases / Use after reinstalling". Tap Restore: the chevron becomes an 18px spinner, the line reads "Checking your purchases..." for 1.3s, then "Checked just now", and a toast says "Up to date. Plus is already active here." (when cancelled: "No active plan found. Plus ends on 14 Nov 2026.").
6. **Cancel row.** Its own group, label "Cancel subscription" in `--accent-ink`, 56px tall. Under it: "Cancel any time. You keep Plus until the end of the period you paid for."
7. **Cancel sheet.** Rises from the bottom (340ms, iOS sheet curve) over a 38% navy scrim. Grabber 36×5. Title "Cancel Larkmoor Plus?" in Gloock 26px. Then "You keep everything until **14 Nov 2026** and won't be charged again. After that date:", followed by four losses, each with an icon:
   - "38 downloaded episodes are removed from this phone"
   - "Ads play again on free shows"
   - "Transcripts and chapter search are turned off"
   - "Morning Queue stops building each day"
   - Then "Your follows, listening history and playlists stay."
   - Two equal 50px buttons: "Keep Plus" (outlined) and "Cancel plan" (ink fill). Focus starts on Keep Plus. Escape or a scrim tap keeps the plan.
8. **Cancelled state.** The chip turns persimmon "Cancelled". The line reads "Ends on 14 Nov 2026" and "You won't be charged again". A full-width "Resubscribe" button appears inside the card. The Change plan block and the Cancel row are removed. The footer reads "Resubscribing keeps your downloads. Billing restarts on 14 Nov." Toast: "Cancelled. Plus stays on until 14 Nov 2026." Focus moves to Resubscribe.
9. **Resubscribe** restores the active state with whatever plan was scheduled, toasts "Welcome back. Plus renews 14 Nov.", and moves focus to the Cancel row.

## Tokens

```css
:root {
  --bg: #e6ecee;            /* cool mist page */
  --surface: #f7fafa;       /* tiles, rows, sheet */
  --fill: #dbe3e6;          /* row icon wells, Current tag */
  --ink: #0f2130;           /* text, selected ring, ink buttons */
  --ink-2: #3a4c59;
  --ink-3: #5a6a76;
  --line: #d0d9dd;
  --navy: #12324a;          /* plan card */
  --navy-2: #1b4462;        /* waveform */
  --on-navy: #f3eee6;
  --on-navy-2: #b9c6cf;
  --accent: #e8552d;        /* persimmon, decorative only */
  --accent-btn: #c8461f;    /* Resubscribe fill, white text */
  --accent-ink: #b23f1c;    /* back link, cancel row, Save tag text, focus */
  --accent-soft: #fbe2d8;
  --ok: #2d7a52;
  --glass: rgba(230,236,238,.8);
  --serif: "Gloock", Georgia, serif;
  --sans: "Onest", -apple-system, system-ui, sans-serif;
  --r-s: 12px; --r-m: 16px; --r-l: 24px; --r-sheet: 28px; --pill: 999px;
  --ease: cubic-bezier(.2,.7,.2,1);
  --sheet: cubic-bezier(.32,.72,0,1);
  --micro: 160ms; --layout: 340ms;
  --top: max(54px, env(safe-area-inset-top));
  --bottom: max(34px, env(safe-area-inset-bottom));
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Nav title | Onest | 17px | 600 | 1.45 | 0 | Sentence |
| Card brand | Onest | 12px | 600 | 1 | 0.12em | Upper |
| Card price | Gloock | 52px | 400 | 1 | -0.02em | lining nums |
| Card period, line | Onest | 16px / 15px | 400 | 1.45 | 0 | Sentence |
| Section heading | Onest | 13px | 600 | 1.45 | 0.06em | Upper |
| Tile name | Onest | 14px | 600 | 1.45 | 0 | Sentence |
| Tile price | Gloock | 26px | 400 | 1.1 | 0 | n/a |
| Tile sub, hints | Onest | 13px | 400 | 1.45 | 0 | tabular nums |
| Tag | Onest | 11px | 700 | 1 | 0.04em | Sentence |
| Row title | Onest | 16px | 500 | 1.45 | 0 | Sentence |
| Sheet title | Gloock | 26px | 400 | 1.15 | -0.01em | Sentence |
| Buttons | Onest | 16px, Resubscribe 17px | 600 | 1 | 0 | Sentence |

Gloock is only for prices and the sheet title. Never set body copy in it.

## Implementation notes

**1. Do the money in integer cents.** Floating point gives `$25.890000000000001`, and rounding per month before multiplying gives the wrong saving.

```js
const M = 799, Y = 6999;
const usd = c => '$' + (c / 100).toFixed(2);
const yearOfMonthly = M * 12;              // 9588
const saving = yearOfMonthly - Y;          // 2589
const pct = Math.round(saving / yearOfMonthly * 100); // 27
const perMonth = Math.round(Y / 12);       // 583
```

**2. Keep three plan variables apart.** `cur` is what you pay now, `next` is what renews, and `pick` is what the radio shows. Mixing them is how screens end up claiming you pay yearly before you do.

```js
let cur = 'm', next = 'm', pick = 'm', active = true;
function line() {
  if (!active) return `Ends on ${END}`;
  return next === cur ? `Renews ${RENEW}`
    : `Renews ${RENEW} as ${next === 'y' ? 'Yearly, ' + usd(Y) : 'Monthly, ' + usd(M)}`;
}
// change panel is open while pick !== next
```

**3. The equal-weight pair.** The two cancel-sheet buttons share one grid. Do not make Keep a filled hero and Cancel a text link.

```css
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.btn { min-height: 50px; border-radius: 999px; font-weight: 600; }
.btn.line { box-shadow: inset 0 0 0 1.5px var(--ink); color: var(--ink); }
.btn.ink { background: var(--ink); color: var(--surface); }
```

Common mistakes:

- "Are you sure you want to lose all your benefits?" copy, or a sad illustration. State facts and a date.
- Offering a discount inside the cancel flow before the user can confirm.
- Hiding Cancel in a grey footnote, or behind a "Manage" link that opens a web page.
- Charging or switching the plan immediately when the user picks yearly. It starts at renewal.
- Showing "Save 27%" without the dollar amounts it comes from.
- Rendering the cancelled state as "Inactive" with no date.
- Drawing a status bar or home indicator.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
