<!-- Design Lounge Nº 582 · "Budget envelopes" · www.designlounge.live -->

# Budget envelopes

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The month screen of an envelope-budgeting app in a Material 3 Expressive language: tonal surfaces from an ochre seed, a dark inverse summary card, a 64px extended FAB, emphasized easing, and one family, Zilla Slab, whose heavy slab numerals make the amounts feel like stamped tickets. Each budget category is an envelope: a tonal card with a drawn flap whose fill rises from the bottom as money is spent, with a scalloped top edge like a liquid line. One envelope (Dining out) has gone over, so its fill turns coral and it carries an "Over" badge. You move money by dragging one envelope onto another, or through a bottom sheet. The detail worth copying is that every envelope is a gauge without a single progress bar on screen.

## Structure

```
390 × 844
┌──────────────────────────────────────┐
│ 54 safe area                         │
│ (‹)      October 2026          (›)   │ 64  48px icon buttons
│          4 days left                 │
│ ┌──────────────────────────────────┐ │ inverse card, r28
│ │ Left in envelopes      ($146     │ │
│ │ $557.73 (44px)          to assign)│ │
│ └──────────────────────────────────┘ │
│ ┌ envelope 171×150 ┐ ┌ envelope ────┐ │ gap 10, r20
│ │ \   flap 44   /  │ │ \          / │ │ alternate cards get a 44px
│ │ Rent             │ │ Groceries    │ │ bottom-left corner
│ │ ▒▒▒▒ fill ▒▒▒▒▒▒ │ │ ~~~~~~~~~~~~ │ │
│ │ Paid             │ │ $201.54      │ │
│ └──────────────────┘ └──────────────┘ │
│   … 4 rows …                         │
│                       ┌────────────┐ │
│                       │ ⇄ Move money│ │ FAB 64 tall, r20, bottom 34
└──────────────────────────────────────┘
sheet: r28 top, handle 32×4, From/To selects 56 tall, amount 52px, chips 40, pill 56
```

- `<header class="bar">`: two icon `<button>`s and a centred month label in an `aria-live="polite"` block.
- `<section class="sum">`: label, `.big` amount, `.un` pill.
- `<ul class="grid">` of `<li class="env" role="button" tabindex="0">`: `.fl` fill (with `::before` scallops), `.flap` SVG, `.tag` badge, `.in` text block.
- `<button class="fab">` fixed bottom-right.
- `.snack` `role="status"` with an Undo button.
- `.scrim` + `<section class="sheet" role="dialog" aria-modal="true">` with labelled `<select>`s, stepper buttons, `<output>`, chip buttons with `aria-pressed`, and the action pill.

## Motion

| Element        | Trigger            | Property              | From → To                       | Duration | Easing     |
|----------------|--------------------|-----------------------|---------------------------------|---------:|------------|
| `.fl`          | move, undo, month  | height                | old % → new %                   | 640ms    | `--emph`   |
| Dragged card   | lift               | transform, shadow     | none → follows pointer, scale 1.04, rotate dx/40 | live | — |
| Other cards    | drag               | transform             | 1 → .98 (target .95)            | 300ms    | `--emph`   |
| Card on drop   | release            | transform             | back to slot                    | 300ms    | `--emph`   |
| Sheet          | open               | translateY            | 105% → 0                        | 500ms    | `--emph-ac`|
| Sheet          | close              | translateY            | 0 → 105%                        | 360ms    | `--emph-de`|
| Scrim          | open/close         | opacity               | 0 ↔ .42 black-brown             | 500ms    | `--emph`   |
| FAB, pill      | press              | border-radius, scale  | 20 → 32px (pill 56 → 16px), .97 | 200ms    | `--emph`   |
| Snackbar       | after move         | translateY, opacity   | 20px, 0 → 0, 1                  | 300ms    | `--emph`   |

Reduced motion: every transition 1ms; fills jump to their new height; dragging still works because it is driven by the pointer.

## States

- **Empty / on track / paid / over:** fill height 0 / partial marigold / 100% green with "Paid" and "all $1,650 spent" / coral with the amount and meta in `--err`, plus the "Over" badge at top 42, right 12.
- **Dragging:** `.drag` on the lifted card (z 10), `.dragging` on the grid, `.target` on the hovered envelope.
- **Chip pressed:** `--primary-c` fill and border, `aria-pressed="true"`.
- **Pill disabled:** same envelope in both fields, label "Pick two envelopes".
- **Month not current:** FAB hidden, tap and drag do nothing, edge chevron `disabled`.
- **Focus-visible:** 3px `--primary` outline, 2px offset on every control and envelope.
- **Hover (pointer):** icon buttons get a `--sch` circle.

## Accessibility

- Envelopes are `role="button"` with an `aria-label` such as "Dining out: −$38.20 over a $180 budget", and `aria-describedby` the hint "Drag one envelope onto another to move money." Enter/Space opens the sheet, so dragging is never the only way.
- The sheet is `role="dialog" aria-modal="true"`, labelled by its title; focus moves to From on open; Escape or the scrim closes it.
- The amount `<output>` is `aria-live="polite"`; the snackbar is `role="status"`.
- Selects have visible `<label>`s and a 1.5px `--outline` border (4.4:1 on the surface).
- Touch targets: icon buttons 48, steppers 56, chips 40, FAB 64, pill 56.
- Contrast: `--on` on `--fill` 12:1, `--err` on `--err-fill` 5.6:1, `--on-inverse` on `--inverse` 12:1.

## Responsive rules

- 390: as specified; the page scrolls under a fixed FAB; leave 120px bottom padding so the last row clears it.
- 360: envelopes become 156px wide; amounts drop to 24px; chips may wrap to two lines.
- Tablet: three columns of envelopes in a 720px column; the sheet becomes a 480px centred dialog with a 28px radius on all corners.
- Never scroll sideways; the dragged card may leave the grid visually but is clipped by nothing except the viewport.

## Acceptance checklist

**Always**
- [ ] Each envelope's fill height equals spent ÷ budget (capped at 100%) and animates over 640ms on change.
- [ ] An overspent envelope switches to the coral fill, shows a badge and states the overage in `--err`.
- [ ] Dragging one envelope onto another opens the sheet prefilled with both.
- [ ] Touch drag needs a 280ms hold; a quick swipe scrolls the page.
- [ ] Tap and keyboard (Enter/Space) open the same sheet.
- [ ] The sheet disables its action when From and To match.
- [ ] Moving shows a snackbar with Undo that restores both budgets.
- [ ] One family; all amounts tabular and lining.
- [ ] Reduced motion keeps every state, without transitions.

**This demo**
- [ ] October 2026, "4 days left", $557.73 left, $146 to assign.
- [ ] Dining out shows −$38.20 over a $180 budget; moving $40 from Groceries leaves $1.80 of $220.
- [ ] Eight envelopes: Rent, Groceries, Dining out, Transit, Utilities, Fun money, Gifts, Car repair.
- [ ] September and November are reachable with the chevrons; the FAB is only shown in October.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: October 2026, "4 days left". Summary card reads "Left in envelopes $557.73" with a marigold pill "$146 to assign". Eight envelopes in a 2-column grid: Rent (Paid, green fill full), Groceries $201.54 left of $520, Dining out −$38.20 over a $180 budget (coral, "Over" badge), Transit $34.50 of $96, Utilities $66.88 of $210, Fun money $76 of $120, Gifts $67.01 of $80, Car repair $150 of $150 (empty).
2. Fill height = spent ÷ budget, capped at 100%. Paid envelopes fill pale green; overspent fill coral; everything else marigold.
3. Mouse: press an envelope and move more than 8px; it lifts (scale 1.04, 28px shadow, rotates `dx/40` degrees) and follows the pointer. Other envelopes shrink to 0.98; the one under the pointer shrinks to 0.95 with a 3px primary ring. Release on it: the Move money sheet opens with From = dragged, To = target.
4. Touch: hold 280ms to lift (a quick swipe still scrolls the page), then drag as above.
5. Tap (or Enter/Space on a focused envelope): the sheet opens with From = that envelope and To = Dining out (or Groceries when you tap Dining out itself).
6. The FAB "Move money" opens the sheet with Groceries → Dining out and $40.
7. Sheet: From and To selects with each envelope's remaining amount under them, a 52px amount with 56px − / + steppers (±$5, minimum $5), quick chips $10 $25 $40 $80 (the matching one is pressed), and a full-width pill "Move $40 to Dining out". Same envelope twice disables the pill and it reads "Pick two envelopes".
8. Moving: the sheet slides away, both envelopes' budgets change and their fills animate over 640ms; Dining out at +$40 becomes $1.80 left of $220, loses the badge and turns marigold. A snackbar "Moved $40 from Groceries" with Undo appears for 5s above the FAB. Undo reverses the move.
9. The month chevrons switch to September 2026 ("Closed, $42.18 rolled over", every envelope nearly full) and November 2026 ("Starts in 4 days", all empty). The FAB hides outside the current month and the far chevrons disable.

## Tokens

```css
:root {
  /* Material 3 tonal set, ochre seed */
  --surface: #FFF8F1;      /* page */
  --sc: #F6ECDF;           /* surface container: empty envelope */
  --sch: #EFE3D3;          /* surface container high: steppers, hover */
  --on: #1F1B14;           /* on-surface */
  --on-v: #4E4639;         /* on-surface-variant (7.9:1 on --sc) */
  --outline: #807567;      /* field and chip borders, 3:1+ */
  --outline-v: #D6C9B8;    /* flap lines */
  --primary: #775A0B;      /* FAB, pill, focus, target ring */
  --on-primary: #FFFFFF;
  --primary-c: #FFDEA1;    /* pressed chip */
  --on-primary-c: #261900;
  --fill: #F6C863;         /* spent fill */
  --paid: #C9E3C0;         /* fully spent as planned */
  --err: #8C1D18;          /* over text and badge */
  --err-fill: #FFB4AB;     /* overspent fill */
  --inverse: #352F27;      /* summary card, snackbar */
  --on-inverse: #F9EFE4;
  --inverse-p: #F2C25A;    /* to-assign pill, Undo */

  /* type */
  --font: "Zilla Slab", Rockwell, serif;

  /* shape */
  --gutter: 16px;
  --r-xl: 28px;            /* summary, sheet */
  --r-lg: 20px;            /* envelopes, FAB */
  --r-odd: 44px;           /* the expressive corner */
  --r-pill: 999px;
  --env-h: 150px;
  --flap-h: 44px;

  /* motion: M3 emphasized */
  --emph: cubic-bezier(.2, 0, 0, 1);
  --emph-de: cubic-bezier(.3, 0, .8, .15);   /* exits */
  --emph-ac: cubic-bezier(.05, .7, .1, 1);   /* entrances */
  --t-fast: 200ms;
  --t-fill: 640ms;
  --t-sheet: 500ms;
}
```

## Typography

Zilla Slab only, `font-variant-numeric: tabular-nums lining-nums`.

| Role             | Size | Weight | Line-height | Tracking |
|------------------|-----:|-------:|------------:|---------:|
| Summary amount   | 44px (sign 24px raised .55em) | 700 | 1 | −0.02em |
| Sheet amount     | 52px | 700    | 1           | −0.03em  |
| Envelope amount  | 26px | 700    | 1           | −0.02em  |
| Sheet title      | 24px | 700    | 1.3         | 0        |
| Month            | 22px | 600    | 1.3         | −0.01em  |
| Envelope name    | 17px | 600    | 1.3         | 0        |
| FAB, pill        | 17–18px | 600 | 1          | 0        |
| Field value      | 17px | 600    | 1           | 0        |
| Meta, labels     | 13–14px | 500 | 1.3        | 0 / +0.02em |
| Badge            | 12px | 600    | 1.3         | 0        |

## Implementation notes

**Scalloped liquid edge with one gradient.** A 6px strip above the fill, painted with a repeating circle, reads as a soft wave without SVG:

```css
.env .fl { position: absolute; left: 0; right: 0; bottom: 0; height: var(--h);
  background: var(--fill); transition: height var(--t-fill) var(--emph); }
.env .fl::before { content: ""; position: absolute; left: 0; right: 0; top: -6px; height: 6px;
  background: radial-gradient(6px 6px at 6px 6px, var(--fill) 5.5px, transparent 6px) 0 0 / 12px 12px repeat-x; }
.env.over .fl { background: var(--err-fill); }
```

**Find the drop target under a captured pointer.** With pointer capture on the dragged card, hide it from hit-testing for one call:

```js
c.style.pointerEvents = 'none';
const under = document.elementFromPoint(e.clientX, e.clientY);
c.style.pointerEvents = '';
const target = under && under.closest('.env');
cards.forEach(k => k.classList.toggle('target', k === target && k !== c));
```

**Let the page scroll on touch.** Use `touch-action: manipulation` (not `none`) on envelopes, lift after a 280ms hold, and only then block scrolling:

```js
grid.addEventListener('touchmove', e => { if (drag && drag.on) e.preventDefault(); }, { passive: false });
```

Common mistakes: `touch-action: none` on a grid that fills the screen (the page can no longer scroll); a progress bar inside each card on top of the fill; letting the summary total change when money moves between envelopes (it must stay the same).

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
