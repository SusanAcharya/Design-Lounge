<!-- Design Lounge Nº 583 · "Invoice builder with live PDF" · www.designlounge.live -->

# Invoice builder with live PDF

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The draft screen of an invoicing tool for a freelance letterer, Wren Okafor of Okafor Letterworks. A 600px form on deep ink-slate sits on the left; on the right a darker slate "desk" holds the invoice as it will arrive, an A4 sheet of warm paper set in Gloock and Crimson Pro, updating on every keystroke. The pairing is the point: the tool is dark and quiet so the paper is the brightest object on screen, and the paper's type is a real invoice's type, not UI. Sending stamps the sheet with a rotated vermilion "Sent" mark, so the confirmation lives on the document itself.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────────────┐
│ Invoices / Draft 2026-041   ✓ Saved 2:41 pm        [Download PDF] [Send to …] │ 60
├──────────────── form 600 ────────────────┬──────────── desk 1fr ─────────────┤
│ New invoice (Gloock 34)                   │                                   │
│ BILL TO   [MP  Marlow & Pike Books   ⌄]   │   ┌──── A4 sheet 492 × 696 ────┐   │
│ DATES     [Oct 28, 2026] [N15][N30][N45]  │   │ (O) Okafor Letterworks  Invoice│ │
│ LINE ITEMS                                │   │ ───────────── coral rule ──── │ │
│ Description      Qty   Rate    Amount  ×  │   │ BILL TO  ISSUED  DUE           │ │
│ [............]  [ 1] [2400.00] $2,400  ×  │   │ table: desc qty rate amount    │ │
│ … 4 rows, gap 8                           │   │            Subtotal  $4,420.00 │ │
│ [+ Add line] (dashed)                     │   │            Total due $4,461.44 │ │
│ ADJUSTMENTS [5][%][$]   [6.25]            │   │ ── Pay by bank transfer · Note │ │
│ NOTE TO CLIENT [textarea 64]              │   └────────────────────────────────┘ │
│ (scrolls)                                 │   padding 28, sheet centred           │
└───────────────────────────────────────────┴───────────────────────────────────┘
item grid: minmax(0,1fr) 62 96 98 32, gap 8
```

- `<header class="top">`: breadcrumb, saved status, spacer, outline button, primary button with an inner `<span>` for its label.
- `<form class="form">` scrolls on its own; each block is a `<fieldset>` with a `<legend>` in tracked caps.
- Client: `<button aria-haspopup="listbox" aria-expanded aria-controls>` plus `<ul role="listbox">` of `<li role="option" aria-selected tabindex="-1">`.
- Terms: `role="group"` of three `aria-pressed` buttons. Discount: input plus two `aria-pressed` unit buttons.
- Items: `.item` rows of three inputs, an `<output>` and a remove button; every input has an `aria-label` with its line number.
- Desk: `<section aria-label="PDF preview">` holding `<article class="sheet">` (`container-type: inline-size`, `aspect-ratio: 1/1.414`) and an inner `.pg` whose sizes are all in `cqw`, so the page scales as one object.

## Motion

| Element          | Trigger          | Property            | From → To                             | Duration | Easing       |
|------------------|------------------|---------------------|---------------------------------------|---------:|--------------|
| New line row     | Add line         | opacity, translateY | 0, −6px → 1, 0                        | 280ms    | `--ease-out` |
| Preview total    | total changes    | background          | `--flash` → transparent               | 700ms    | `--ease-out` |
| Listbox          | open / close     | opacity, translateY | 0, −4px ↔ 1, 0                        | 160ms    | `--ease`     |
| Picker chevron   | open             | rotate              | 0 → 180°                              | 160ms    | `--ease`     |
| Stamp            | send             | transform, opacity  | `rotate(-9deg) scale(1.6)`, 0 → `scale(1)`, 1 | 420ms / 200ms | `--ease-out` / `--ease` |
| Send button      | press            | scale               | 1 → .97                               | 160ms    | `--ease`     |
| Inputs           | focus            | border, ring        | `--edge` → `--accent` + 3px 22% ring  | 160ms    | `--ease`     |

Reduced motion: no row entrance, no flash, transitions 1ms; the stamp simply appears.

## States

- **Input hover:** border `--text-3`. **Focus:** border `--accent`, `0 0 0 3px rgba(255,138,107,.22)`, no outline.
- **Pressed (terms, units):** fill `--text`, text `--ink-bg`.
- **Option selected:** `inset 2px 0 0 var(--accent)` bar; hover/focus `--field` fill.
- **Sent:** button `data-state="sent"`, fill `--accent-dim`, text `--accent`, label "Sent, Oct 28 at 2:41 pm"; sheet `.sent` shows the stamp. Editing totals or client returns to draft.
- **Empty line:** shown in the form, hidden from the preview until it has a description or a rate; a rate-only line prints "Untitled line".
- **Focus-visible:** 2px `--accent` outline, 2px offset, on all buttons and options.

## Accessibility

- Every input has a visible label or an `aria-label` that includes its line number ("Rate, line 2").
- Picker follows the listbox pattern: focus moves to the selected option on open, arrows wrap, Escape returns focus to the button.
- Terms and units are toggle buttons with `aria-pressed`, grouped and labelled.
- A visually hidden `aria-live="polite"` paragraph announces total changes, removed lines and the sent confirmation ("Invoice 2026-041 sent to ada@marlowpike.co.uk").
- The preview is a labelled region; its text is real text, so a screen reader can read the invoice.
- Controls are 40px tall; remove buttons 32px inside a 40px row.
- Contrast: tool text ≥ 6.4:1 on slate; paper text ≥ 6.8:1; control borders 3.6:1.

## Responsive rules

- ≥ 1280: as specified; form and desk scroll independently.
- 1100–1279: the desk narrows; the sheet keeps 492px or shrinks to the desk width minus 56px.
- < 1100: one column; the form flows first, the preview follows; the page scrolls as one.
- < 640: top bar keeps only the send button; date and adjustment pairs stack; the item header hides and each line becomes a bordered card: description and × on row one, quantity and rate on row two, amount on row three. The sheet scales with `cqw` to 358px wide. Inside it, Bill to takes a full row above Issued and Due, and the totals block widens to 72%. Below 640 the sheet also drops its fixed A4 ratio and sets body text at a fixed 12px (captions 10px, meta values 13px) so nothing on the page shrinks under 10px; the payment footer flows after the totals instead of being pinned to the bottom. Nothing scrolls sideways at 390.

## Acceptance checklist

**Always**
- [ ] Every keystroke in the form updates the preview with no submit.
- [ ] The preview is one scalable object (container units), A4 ratio 1 : 1.414.
- [ ] Line items can be added, edited and removed; amounts use tabular figures.
- [ ] Discount supports percent and fixed amounts and never exceeds the subtotal.
- [ ] Payment terms rewrite the due date in both places.
- [ ] Client picker is a keyboard-operable listbox.
- [ ] Exactly one filled button (send); sending stamps the page and any later edit returns to draft.
- [ ] The total change is announced through a polite live region.
- [ ] At 390 the item rows become cards and nothing scrolls sideways.

**This demo**
- [ ] Okafor Letterworks, invoice No. 2026-041, issued Oct 28, 2026, Net 30 due Nov 27, 2026.
- [ ] Four lines totalling $4,420.00, 5% discount −$221.00, 6.25% tax $262.44, total $4,461.44.
- [ ] Clients: Marlow & Pike Books, Fieldhouse Coffee Co., Saltmarsh Records, Thimble Theatre Trust.
- [ ] Stamp reads "Sent / OCT 28, 2:41 PM" at −9°.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: draft 2026-041, "Saved 2:41 pm". Client Marlow & Pike Books (Ada Brennan). Issued Oct 28, 2026; Net 30 pressed; due reads Nov 27, 2026. Four lines: Cover lettering, "The Lantern Year" 1 × 2,400.00; Revisions, hourly 6 × 95.00; Spine and back-cover titles 1 × 650.00; Print licence, up to 20,000 copies 1 × 800.00. Discount 5 %, sales tax 6.25 %. Preview: Subtotal $4,420.00, Discount, 5% −$221.00, Sales tax, 6.25% $262.44, Total due $4,461.44.
2. Typing in any description, quantity or rate updates that line's amount in the form and the whole preview at once. When the total changes, the preview total flashes a pale coral background (`#FFE1D6` fading out over 700ms) and a polite live region announces "Total due $…".
3. "Add line" appends an empty row (fades in 6px from above, 280ms) and focuses its description. Each row's × removes it; empty lines (no description and no rate) are left off the preview.
4. Net 15 / 30 / 45 is a three-button pressed group; it rewrites the due date (Nov 12 / Nov 27 / Dec 12, 2026) in the label and the preview ("Nov 27, 2026 (net 30)").
5. Discount has a % / $ segmented switch. Percent shows "Discount, 5%" on the preview; dollars shows "Discount". A discount never exceeds the subtotal.
6. The client picker is a button showing initials disc, company and contact. Clicking opens a listbox (fade and 4px drop, 160ms) of four clients; Up/Down move, Enter/Space choose, Escape closes, a click outside closes. Choosing a client updates the preview's Bill to block and the send button label ("Send to Fieldhouse").
7. "Send to Marlow & Pike" (the only filled button): the button turns into a muted coral-on-dark "Sent, Oct 28 at 2:41 pm" and the stamp lands on the sheet, `scale(1.6) → 1` at −9° over 420ms. Any later edit to totals or client clears the sent state and the stamp lifts off.
8. The note textarea mirrors into the preview's Note column.

## Tokens

```css
:root {
  /* tool chrome: ink slate */
  --ink-bg: #18202B;     /* form, top bar */
  --panel: #1F2935;      /* listbox */
  --field: #243040;      /* inputs, hover */
  --line: #2F3B4A;       /* hairlines */
  --edge: #6B7A8C;       /* control borders, 3.6:1 on --ink-bg */
  --desk: #2B3542;       /* preview ground */
  --text: #EEF1F4;
  --text-2: #B4BECA;     /* labels (9.2:1) */
  --text-3: #94A0AE;     /* legends, meta (6.4:1) */

  /* one accent */
  --accent: #FF8A6B;     /* send, focus, selected option bar */
  --accent-ink: #1E120D; /* text on accent (8.8:1) */
  --accent-dim: #3A2A27; /* sent button */

  /* paper */
  --paper: #FBFAF6;
  --p-ink: #1D2026;
  --p-ink-2: #555B66;    /* 6.8:1 on paper */
  --p-rule: #E3E0D8;
  --p-accent: #C2462B;   /* header rule, stamp */
  --flash: #FFE1D6;

  /* type */
  --display: "Gloock", Georgia, serif;
  --serif: "Crimson Pro", Georgia, serif;

  /* shape */
  --r: 8px; --r-sm: 6px; --h-ctl: 40px;
  --form-w: 600px;
  --sheet-w: 492px;      /* A4 at 1 : 1.414 */
  --sheet-shadow: 0 1px 2px rgba(0,0,0,.3), 0 24px 50px -20px rgba(0,0,0,.6);

  /* motion */
  --t-fast: 160ms; --t-mid: 280ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

Crimson Pro carries every word of the tool and the invoice body; Gloock is display only (page title, "Invoice", monogram, total due, stamp). Numerals are `tabular-nums lining-nums` everywhere.

| Role              | Family      | Size              | Weight | Line-height | Tracking | Case      |
|-------------------|-------------|-------------------|-------:|------------:|---------:|-----------|
| Page title        | Gloock      | 34px              | 400    | 1.1         | −0.01em  | sentence  |
| Body, inputs      | Crimson Pro | 17px              | 400    | 1.35        | 0        | sentence  |
| Field label       | Crimson Pro | 15px              | 400    | 1.35        | 0        | sentence  |
| Legend            | Crimson Pro | 13px              | 600    | 1.35        | +0.1em   | UPPERCASE |
| Buttons           | Crimson Pro | 16px              | 600    | 1           | 0        | sentence  |
| Sheet "Invoice"   | Gloock      | 8.4cqw (41px)     | 400    | 1           | −0.01em  | Title     |
| Sheet body        | Crimson Pro | 2.44cqw (12px)    | 400    | 1.4         | 0        | sentence  |
| Sheet captions    | Crimson Pro | 2cqw (9.8px)      | 600    | 1.4         | +0.12em  | UPPERCASE |
| Sheet total due   | Gloock      | 6.4cqw (31px)     | 400    | 1           | 0        | numerals  |
| Stamp             | Gloock      | 6cqw + 1.9cqw caption | 400 / 600 | 1   | caption +0.1em | — |

## Implementation notes

**Scale the page with container units.** Put `container-type` on the sheet and every size on a child, so the whole invoice scales with its width (a container cannot use its own `cqw`):

```css
.sheet { container-type: inline-size; width: min(100%, 492px); aspect-ratio: 1 / 1.414; background: var(--paper); }
.pg { height: 100%; padding: 7.3cqw 7.3cqw 6cqw; font-size: 2.44cqw; line-height: 1.4; position: relative; }
.sheet h2 { font: 400 8.4cqw/1 var(--display); }
.tot .due b { font: 400 6.4cqw/1 var(--display); }
```

**One calculation, run on every input.** Keep line items in an array, parse loosely, round tax to cents once:

```js
const sub = items.reduce((s, [, q, r]) => s + q * r, 0);
const disc = Math.min(sub, unit === '%' ? sub * dv / 100 : dv);
const tax = Math.round((sub - disc) * taxRate) / 100;
const total = sub - disc + tax;
```

**Restart the flash on every change.** Remove the class, force a reflow, add it back:

```js
t.classList.remove('flash'); void t.offsetWidth; t.classList.add('flash');
```

Common mistakes: rendering the preview with UI type (it must look like the document); re-rendering the form rows on each keystroke (focus jumps; re-render only on add/remove); a `<select>` for the client that cannot show the contact line; leaving the sent state on after the amount changed.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
