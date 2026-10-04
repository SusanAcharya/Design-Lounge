<!-- Design Lounge Nº 100 · "Checkbox draw list" · designlounge.vercel.app -->

# Checkbox draw list

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

A pre-trip checklist in a fictional notes app, Margin. The list sits on a ruled sheet with a salmon margin line; each checkbox lives in the margin, and ticking it draws a red-pencil checkmark (280ms stroke) followed by a pencil line sweeping through the task text (360ms, 180ms later). A huge light-weight serif numeral on the left counts tasks done, with a row of nine tick segments underneath. It should feel like crossing things off a paper list: quiet, satisfying, slightly analogue. The detail worth copying is the sequencing: the check finishes before the strike starts, so the eye follows one stroke into the next.

## Structure

```
1280 × 800, padding 48 64 48 72, grid 400px | 1fr
┌───────────────────────────┬───────────────────────────────────────────────┐
│ MARGIN          Sat 3 Oct │ ┌─────┬─────────────────────────────────────┐ │
│                           │ │     │ Packing & errands      5 done · 4…  │ │ 72
│ Before Lisbon  (64 ital.) │ ├─────┼─────────────────────────────────────┤ │
│ sub, 300px max            │ │ [✓] │ ~~Scan passport and send…~~   Docs  │ │ 56 each
│                           │ │ [ ] │ Change €60 into coins…   (Wed) Money│ │
│                           │ │  …  │  nine rows                           │ │
│ 5                         │ │  +  │ Add a task and press Enter          │ │
│   of 9   (232px / 48px)   │ │     │ hint                    Untick all  │ │
│ ▬ ▬ ▬ ▬ ▬ ▬ ▬ ▬ ▬  ticks  │ └─────┴─────────────────────────────────────┘ │
│ 4 left. Flight…           │   margin line at x = 64px inside the sheet     │
└───────────────────────────┴───────────────────────────────────────────────┘
```

- `<aside class="side" aria-label="Progress">`: brand row, `<h1>`, `.sub`, `.big` (numeral + suffix, `aria-hidden`), `.ticks` (`aria-hidden`), `<p class="note" aria-live="polite">`.
- `<main class="sheet">`: header (`<h2>` + summary), `<ul>` of `<li>` rows, `<form class="add">`, footer.
- Each `<li>`: visually hidden `<input type="checkbox">` followed by a `<label>` containing `.box` (64px wide margin cell holding the SVG), `.t` (task text wrapped in `<s>` used only as the strike host), `.meta` (optional due pill + tag).

## Motion

| Element            | Trigger       | Property              | From → To            | Duration | Easing      | Delay |
|--------------------|---------------|-----------------------|----------------------|---------:|-------------|------:|
| Checkmark path     | check         | stroke-dashoffset     | 1 → 0 (pathLength 1) | 280ms    | `--ease`    | 0     |
| Checkmark path     | uncheck       | stroke-dashoffset     | 0 → 1                | 280ms    | `--ease`    | 0     |
| Strike line        | check         | transform scaleX      | 0 → 1, origin left   | 360ms    | `--ease`    | 180ms |
| Strike line        | uncheck       | transform scaleX      | 1 → 0                | 360ms    | `--ease`    | 0     |
| Task text          | toggle        | color                 | ink ↔ ink-3          | 360ms    | `--ease`    | 0     |
| Box square         | toggle/hover  | stroke                | ink → ink-3 / pencil | 160ms    | linear-free default | 0 |
| Numeral            | count change  | translateY, opacity   | 18px, .2 → 0, 1      | 420ms    | `--ease-out`| 0     |
| Tick segment       | count change  | background            | rule ↔ pencil        | 360ms    | `--ease`    | 0     |
| New row            | add           | translateY, opacity   | −8px, 0 → 0, 1       | 360ms    | `--ease-out`| 0     |

Reduced motion: durations 1ms, delays 0, keyframes removed. Ticks and strikes still appear, instantly.

## States

- **Unchecked:** ink square, no check, ink text.
- **Checked:** `--ink-3` square, red check, red strike, `--ink-3` text.
- **Hover (row):** square stroke turns `--pencil`.
- **Focus-visible:** 2px `--pencil` outline 6px outside the checkbox SVG (the input is visually hidden, so style `input:focus-visible + label .box svg`).
- **Add row focused:** row tints `rgba(194,65,45,.04)`.
- **All done:** note copy changes; every tick segment red.
- **Due soon:** `.meta em` pill (1px `--rule` border, 999px radius, 2px 9px padding) before the tag.

## Accessibility

- Real `<input type="checkbox">`, visually hidden with `opacity:0; width:1px; height:1px` (not `display:none`), labelled by the whole row `<label>`. Space toggles when focused.
- Tab order: tasks top to bottom, add input, "Untick all" button.
- The `<s>` element is presentational here (no native line-through); if you prefer semantics, add `aria-label="done"` state via the checkbox, not the text.
- The note is `aria-live="polite"`, so totals are announced after each change; the numeral and ticks are `aria-hidden` duplicates.
- Contrast: ink on paper 13:1; `--ink-3` done text 3.2:1 is intentionally reduced and paired with the strike; keep active tasks in full ink.
- Rows are 56px tall, the full row is clickable.

## Responsive rules

- ≥ 1280: as drawn.
- 1024: left column stays 400px, sheet narrows; tasks ellipsize (`white-space:nowrap; text-overflow:ellipsis`).
- < 1000: single column; numeral 140px; side panel stacks above the sheet; body scrolls.
- < 640: hide the tag text, keep due pills; margin column shrinks to 52px.

## Acceptance checklist

- [ ] Five of nine tasks are ticked on load; numeral reads 5 and five of nine segments are red.
- [ ] Checkmark draws via `stroke-dashoffset` with `pathLength="1"`, over 280ms.
- [ ] Strike starts 180ms after the check begins and sweeps left to right in 360ms.
- [ ] Unticking retracts the strike with no delay.
- [ ] The whole row toggles the checkbox; the checkbox is a native input.
- [ ] Numeral, suffix, segments, header summary and note all update on every change.
- [ ] Enter in the add row appends an unticked task with a slide-in; empty input does nothing.
- [ ] "Untick all" clears every row.
- [ ] Salmon margin line runs the full height of the sheet at x = 64px.
- [ ] Focus ring is visible on every checkbox and the footer button.
- [ ] Reduced motion keeps every state, without animation.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: nine tasks, five ticked (rows 1, 2, 3, 5, 7). Numeral reads "5", suffix "of 9", five red tick segments, note "4 left. Flight TP1351 leaves Thursday at 06:40." Header right reads "5 done · 4 to go".
2. Click anywhere on a task row (the whole row is the `<label>`): the native checkbox toggles.
3. Ticking: the 18px rounded square dims from ink to `--ink-3`; the checkmark path draws from 0 to full length in 280ms; after a 180ms delay a 1.5px red line scales from 0 to full width across the task text, origin left, over 360ms; the text colour fades to `--ink-3`.
4. Unticking: checkmark retracts over 280ms and the strike retracts immediately (no delay) over 360ms; text returns to ink.
5. Each change updates the numeral (it re-enters from 18px below at 20% opacity over 420ms), the "of N" suffix, the tick segments, the header summary and the note.
6. When all tasks are done the note becomes "All set. Boa viagem — see you on the 15th."
7. Type in the "Add a task and press Enter" row and press Enter: a new unticked row (tag "New") slides in from 8px above over 360ms; totals update. The list caps at 10 rows; the oldest-last row is dropped to keep the sheet in frame.
8. "Untick all" in the footer clears every box, replaying all retract animations together.
9. Hovering a row turns its checkbox square red.

## Tokens

```css
:root {
  --bg: #ece6d8;        /* desk */
  --paper: #f8f4ea;     /* sheet */
  --rule: #dcd3c0;      /* row rules, pills, inactive ticks */
  --margin: #d98b7a;    /* vertical margin line, 70% opacity */
  --ink: #1f2a26;       /* text, box stroke */
  --ink-2: #55605a;     /* secondary */
  --ink-3: #8a8f86;     /* done text, meta, placeholder */
  --pencil: #c2412d;    /* check, strike, ticks on, focus */

  --serif: "Newsreader", Georgia, serif;
  --sans: "Work Sans", system-ui, sans-serif;
  --fs-numeral: 232px; --fs-of: 48px; --fs-h1: 64px; --fs-h2: 26px;
  --fs-task: 19px; --fs-sub: 17px; --fs-body: 15px; --fs-meta: 12px;

  --row: 56px;          /* task row height */
  --gutter: 64px;       /* margin column */
  --r-sheet: 4px; --r-box: 3px; --r-pill: 999px;

  --shadow-sheet: 0 1px 0 #d6cdb9, 0 2px 0 #e9e2d2, 0 3px 0 #d6cdb9, 0 24px 40px -24px rgba(60,40,10,.3);

  --t-fast: 160ms; --t-draw: 280ms; --t-strike: 360ms; --strike-delay: 180ms;
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
}
```

## Typography

| Role          | Family     | Size  | Weight | Line-height | Tracking | Case / style |
|---------------|------------|------:|-------:|------------:|---------:|--------------|
| Numeral       | Newsreader (opsz 72) | 232px | 300 | 0.8 | −0.06em | lining figures |
| "of 9"        | Newsreader | 48px  | 400    | 0.8         | 0        | italic       |
| h1            | Newsreader | 64px  | 300    | 1.0         | −0.02em  | italic       |
| Sub           | Newsreader | 17px  | 400    | 1.45        | 0        | roman        |
| Sheet title   | Newsreader | 26px  | 400    | 1.1         | −0.01em  | roman        |
| Task          | Newsreader | 19px  | 400    | 1.2         | 0        | roman        |
| Add input     | Newsreader | 19px  | 400    | 1.2         | 0        | italic       |
| Brand         | Work Sans  | 12px  | 600    | 1           | +0.16em  | UPPERCASE    |
| Note / body   | Work Sans  | 14px  | 400 (600 lead) | 1.45 | 0     | sentence     |
| Meta, pills   | Work Sans  | 12px  | 400    | 1.2         | 0        | sentence     |

## Implementation notes

**Normalise the path length** so one dash value works for any checkmark shape:

```html
<svg viewBox="0 0 24 24">
  <rect class="sq" x="3" y="3" width="18" height="18" rx="3"/>
  <path class="ck" pathLength="1" d="M7 12.5l3.5 3.8L18.5 6"/>
</svg>
```

```css
.ck { stroke: var(--pencil); stroke-width: 2.4; stroke-dasharray: 1; stroke-dashoffset: 1;
      transition: stroke-dashoffset var(--t-draw) var(--ease); }
input:checked + label .ck { stroke-dashoffset: 0; }
```

**Asymmetric delay** lives on the checked selector only, so it applies going in but not coming out:

```css
.t s { position: relative; display: inline-block; text-decoration: none; }
.t s::after { content: ""; position: absolute; left: -3px; right: -3px; top: 56%; height: 1.5px;
  background: var(--pencil); transform: scaleX(0); transform-origin: left;
  transition: transform var(--t-strike) var(--ease); }
input:checked + label .t s::after { transform: scaleX(1); transition-delay: var(--strike-delay); }
```

**Restart the numeral animation** by removing the class and forcing reflow:

```js
num.classList.remove('bump'); void num.offsetWidth; num.classList.add('bump');
```

Common mistakes: using `text-decoration: line-through` (can't animate); wrapping long tasks onto two lines so the strike only covers the first; `display:none` on the checkbox, which removes it from keyboard order.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
