---
title: "Odometer counter"
summary: "A 112px revenue figure whose digits roll vertically on 0–9 strips (700ms expo-out, 24ms cascade from the right), with comma grouping, four add/refund buttons and a 3s auto-tick."
platform: web
type: animation
tags: [counter, odometer, numbers, dashboard, revenue]
styles: [paper, editorial, minimal]
motion: subtle
difficulty: 2
featured: false
published: 2026-09-29
palette: ["#F6F1E8", "#2B241B", "#2E7D5B", "#E4DCCF"]
fonts: ["Fraunces", "Instrument Sans"]
related: []
---

# Odometer counter

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A live revenue headline for a finance dashboard ("Marrow"): a 112px serif figure — `$1,284,930` — where every digit is a column containing a vertical strip of 0–9. When the value changes, each column whose digit changed translates its strip to the new digit over 700ms with expo-out easing; columns cascade from the right with a 24ms delay per position, so a carry ripples leftward like a mechanical odometer. Commas are static cells placed by thousands grouping; when the number gains a digit a new column widens in from zero width. Four buttons add an invoice, a subscription, an annual plan, or apply a refund; a timer adds a random real-looking payment every 3s. The detail worth copying is the reconciliation: existing columns are kept and rolled, never rebuilt, so a `+$49` change only moves the two or three digits that actually changed.

## Reference behaviour

1. Initial state: header (64px) with the wordmark "Marrow", a "Revenue · September" tag and a pulsing green "Live · auto-tick every 3 s" indicator. Main shows a small uppercase label ("Gross revenue, month to date · updated just now"), the odometer `$1,284,930`, a four-stat meta row (Today +$4,120 · Transactions 14 · Avg. order $294 · Last event Subscription), four pill buttons and a caption with a roll counter.
2. Every 3000ms a random event is added: "Card payment" (19/29/49/89/120/240), "Invoice" (340/780/1,250) or "Subscription" (49/49/99). The figure rolls; Today, Transactions, Avg. order and Last event update instantly (no animation); the roll counter increments; the "updated" text shows the current time (`HH:MM:SS`).
3. Click "Add invoice $1,250" (or press `1`): value += 1,250. Columns whose digit changed roll: column *c* (0 = rightmost digit, commas do not count as columns but do count in the index) starts after `c × 24ms`. A strip moves `translateY(-d em)` where `d` is the new digit, over 700ms, `cubic-bezier(.16,1,.3,1)`.
4. Click "Add subscription $49" (`2`), "Add annual plan $8,900" (`3`): same. "Refund $120" (`4`, red text): value −= 120; digits roll upward instead (strip translates toward 0) — same duration.
5. When the formatted string gains characters (e.g. `999,999` → `1,000,000`), new cells are prepended: a digit cell starts at 0 and rolls to its target; a comma cell is static. New cells animate `width: 0 → natural` and opacity 0 → 1 over 400ms. When it loses characters (refund below a power of ten), leftmost cells are removed immediately.
6. Commas are recomputed from the right on every render (positions 3, 7, 11 from the right); if a cell's type changes (digit ↔ comma) it is replaced in place.
7. Avg. order = Today ÷ Transactions. Today can go negative after refunds and then reads "−$…".
8. Buttons: hover darkens the border; active scales to 0.97; focus-visible shows a 2px green outline. Keys 1–4 trigger the corresponding button unless a modifier is held.
9. A visually hidden `role="status" aria-live="polite"` span carries the formatted value for screen readers; the visible strips are `aria-hidden`.
10. With `prefers-reduced-motion: reduce`: strips jump to the new digit (no transition), new cells appear at full width, the live dot does not pulse.

## Structure

```
1280 × 800
┌────────────────────────────────────────────────────────────────────────┐
│ Marrow  Revenue · September                     ● LIVE · AUTO-TICK 3 S │ header 64
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  GROSS REVENUE, MONTH TO DATE   updated 14:02:31                       │ label
│  $ 1 , 2 8 4 , 9 3 0        ← 112px, each digit a clipped 0–9 strip    │ odo 118 tall
│  ─────────────────────────────────────────────────────                 │
│  Today        Transactions     Avg. order     Last event               │ meta
│  +$4,120      14               $294           Subscription             │
│                                                                        │
│  (+ Add invoice $1,250 1) (+ Add subscription $49 2) (+ Add annual…) (– Refund $120 4) │ actions 44
│                                                                        │
│  Each digit column is a 0–9 strip that translates vertically · 700 ms · 0 rolls │ log
└────────────────────────────────────────────────────────────────────────┘
pad 0 40px 48px; main content vertically centred
```

- `<header>` — flex, space-between, 40px side padding, 1px bottom hairline. `.brand` (serif 18px) with a `<span>` tag. `.live` with an 8px pulsing dot.
- `<main>` — flex column, `justify-content: center`.
  - `.label` — uppercase 13px with a `<b id="upd">` timestamp.
  - `.odo` — flex, `align-items: baseline`, height `1.05em`, `font-variant-numeric: tabular-nums`. Contains `.sr` (hidden live text), `.cur` (`$`, 0.55em, top-aligned), and `#cells` (`aria-hidden`).
    - `.cell.d` — `inline-block; width: .62em; height: 1em; overflow: hidden`, containing `.strip` (flex column of ten `<span>`s, each `height: 1em`).
    - `.cell.c` — comma, `width: .28em`, static text.
  - `.meta` — flex, gap 40px, 1px top hairline, four `<div>`s of label + `<b>` value.
  - `.actions` — four `<button class="btn" data-add data-kind>` with a 16px plus/minus SVG and a `<kbd>` hint.
  - `.log` — caption, `margin-top: auto`, includes `#rolls`.

## Tokens

```css
:root {
  /* colour — warm paper, dark brown ink, one green accent, brick for refunds */
  --bg: #f6f1e8;
  --surface: #fffdf9;     /* buttons */
  --line: #e4dccf;        /* hairlines, button borders */
  --line-2: #efe8dc;
  --ink: #2b241b;
  --ink-2: #7d7263;       /* labels, currency sign */
  --ink-3: #a89c8b;       /* tag, caption, hover border */
  --accent: #2e7d5b;      /* live dot, primary button, positive delta, focus */
  --accent-hover: #286f51;
  --accent-soft: #e2efe7;
  --neg: #b4462f;         /* refund button text */

  /* type */
  --serif: "Fraunces", Georgia, serif;        /* opsz 9–144 */
  --sans: "Instrument Sans", system-ui, sans-serif;
  --digit: 112px;         /* odometer font-size */
  --digit-w: .62em;       /* digit cell width */
  --comma-w: .28em;

  /* layout */
  --header-h: 64px;
  --pad-x: 40px;
  --btn-h: 44px;
  --r: 12px;
  --r-pill: 999px;

  /* motion */
  --t-roll: 700ms;
  --cascade: 24ms;        /* per column, from the right */
  --t-widen: 400ms;       /* new column */
  --t-micro: 160ms;
  --tick: 3s;             /* auto event interval */
  --t-pulse: 3s;
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role          | Family          | Size  | Weight | Line-height | Tracking | Case      | Notes |
|---------------|-----------------|------:|-------:|------------:|---------:|-----------|-------|
| Odometer      | Fraunces        | 112px | 600    | 1           | −0.03em  | numerals  | `"opsz" 144`, `tabular-nums` |
| Currency sign | Fraunces        | 61.6px (.55em) | 600 | 1     | —        | —         | colour `--ink-2` |
| Wordmark      | Fraunces        | 18px  | 600    | 1.5         | −0.01em  | sentence  | `"opsz" 18` |
| Meta value    | Fraunces        | 22px  | 500    | 1.3         | 0        | numerals  | `"opsz" 22`, `tabular-nums` |
| Label         | Instrument Sans | 13px  | 400 (b 500) | 1.5    | +0.08em  | UPPERCASE | |
| Live tag      | Instrument Sans | 12px  | 400    | 1.5         | +0.06em  | UPPERCASE | |
| Meta label    | Instrument Sans | 13px  | 400    | 1.5         | 0        | sentence  | |
| Button        | Instrument Sans | 14px  | 500    | 44px box    | 0        | sentence  | |
| kbd           | Instrument Sans | 11px  | 400    | 16px        | 0        | numerals  | 60% opacity |
| Caption       | Instrument Sans | 12px  | 400    | 1.5         | 0        | sentence  | |

## Motion

| Element      | Trigger              | Property        | From → To                      | Duration | Easing       | Delay |
|--------------|----------------------|-----------------|--------------------------------|---------:|--------------|-------|
| `.strip`     | digit changes        | translateY      | `-old em` → `-new em`          | 700ms    | `--ease-out` | `col × 24ms` (col 0 = rightmost character, commas included in the count) |
| `.cell.new`  | column added         | width, opacity  | 0, 0 → auto, 1                 | 400ms    | `--ease-out` | 0 |
| `.live i`    | always               | opacity         | 1 → .35 → 1                    | 3s       | `--ease`, infinite | 0 |
| `.btn`       | hover                | border-color    | `--line` → `--ink-3`           | 160ms    | linear       | 0 |
| `.btn`       | active               | scale           | 1 → .97                        | 160ms    | `--ease`     | 0 |
| meta values  | any change           | text            | —                              | 0        | —            | instant, deliberately |

Worked example — `$1,284,930` + `$1,250` = `$1,286,180`, characters from the right:

| col | char before → after | rolls? | delay |
|----:|---------------------|--------|------:|
| 0   | 0 → 0 | no  | — |
| 1   | 3 → 8 | yes | 24ms |
| 2   | 9 → 1 | yes | 48ms |
| 3   | , → , | no (comma) | — |
| 4   | 4 → 6 | yes | 96ms |
| 5   | 8 → 8 | no  | — |
| 6   | 2 → 2 | no  | — |
| 7   | , → , | no  | — |
| 8   | 1 → 1 | no  | — |

Three columns move; the last one starts 96ms after the click and settles at 796ms. Note the strip for column 2 travels 9 → 1 by moving *up* eight positions (`−9em` → `−1em`), not by wrapping past 0 — a deliberate simplification that keeps every strip a single 10-item column.

Only the headline rolls. If the meta numbers also animated, the eye would have nowhere to rest.

Reduced motion: `.strip { transition: none }`, `.cell.new { animation: none }`, `.live i { animation: none }`.

## States

- **Resting:** all strips at their digit, no transitions running.
- **Rolling:** one or more strips mid-transition; buttons remain enabled (changes queue naturally because each strip transitions from its current position).
- **Button hover:** border `--ink-3`. Primary hover: background `--accent-hover`.
- **Button active:** `scale(.97)`.
- **Button focus-visible:** `outline: 2px solid var(--accent); outline-offset: 2px`.
- **Refund button:** text `--neg`, minus icon.
- **Today negative:** value prefixed "−" and still green (it is a delta, colour signals "today", not sign); switch to `--neg` if your product treats negative days as alarms.
- **Loading / error / empty:** not part of this piece; a zero value renders as a single `0` column.

## Accessibility

- The visible odometer is `aria-hidden="true"`; a visually hidden `<span role="status" aria-live="polite" aria-atomic="true">` holds the formatted value (`$1,286,180`) and updates on every change. With auto-ticks every 3s this announces often — if that is too chatty, debounce the hidden text to once per 15s or announce only user-triggered changes.
- Buttons are real `<button type="button">` with visible text labels; the `<kbd>` hint is inside the label and reads as "1", which is acceptable, or wrap it in `aria-hidden="true"` and add `aria-keyshortcuts="1"`.
- Keyboard: Tab through the four buttons; Enter/Space activate; digit keys 1–4 activate without focus (ignored when Meta/Ctrl is held).
- Contrast: `--ink` on `--bg` 12.9:1; `--ink-2` 4.6:1; `--accent` on `--bg` 4.6:1; white on `--accent` 4.9:1; `--neg` on `--surface` 4.9:1; `--ink-3` (12px caption) 2.9:1 — decorative.
- Hit targets: buttons 44px tall.
- The live dot's pulse is 3s and subtle (opacity 1 → .35); it is the only looping motion.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: `--digit: 96px`; meta gap 32px.
- 768–1023: `--digit: 80px`; buttons wrap to two rows (`flex-wrap`); meta becomes a 2 × 2 grid.
- < 640: `--digit: 56px`; `$` becomes inline at the same size; buttons stack full-width; header tag hidden; keyboard hints hidden.
- The odometer must never wrap: keep `white-space: nowrap` and, if it would overflow, reduce `--digit` with a `clamp()` tied to viewport width.

## Acceptance checklist

- [ ] Each digit is a clipped 1em-tall cell containing a ten-item strip; the strip's `translateY` equals `−digit em`.
- [ ] A change rolls only the columns whose digit changed; unchanged columns do not move or re-render.
- [ ] Roll duration is 700ms with `cubic-bezier(.16,1,.3,1)`; column delay is `index-from-right × 24ms`.
- [ ] Refunds roll digits upward (strip moves toward 0), additions roll downward.
- [ ] Thousands commas appear at positions 3, 7, 11 from the right and never animate.
- [ ] Gaining a digit prepends a column that widens from 0 over 400ms and rolls from 0 to its target.
- [ ] Losing a digit removes the leftmost column immediately.
- [ ] Buttons 1–4 and keyboard keys 1–4 apply +1,250 / +49 / +8,900 / −120.
- [ ] An auto event fires every 3000ms with amounts drawn from the listed sets; "Last event" shows its kind.
- [ ] Meta row (Today, Transactions, Avg. order = Today ÷ Transactions, Last event) updates instantly without animation.
- [ ] A visually hidden live region announces the formatted value; visible digits are `aria-hidden`.
- [ ] Digits are tabular (`font-variant-numeric: tabular-nums`) and cells have fixed widths so nothing shifts horizontally during a roll.
- [ ] Reduced motion: no strip transitions, no widen, no pulse.

## Implementation notes

**Reconcile from the right.** Keep an array of cells indexed by distance from the right so digit positions are stable when the number grows. Only touch a strip when its digit changed:

```js
let list = [];                       // list[0] = rightmost cell
function render() {
  const chars = [...fmt(value)];     // e.g. "1,284,930"
  while (list.length < chars.length) {            // number grew: prepend
    const c = makeCell(chars[chars.length - 1 - list.length]);
    c.classList.add('new'); list.push(c); cells.prepend(c);
  }
  while (list.length > chars.length) list.pop().remove();   // number shrank
  chars.forEach((ch, i) => {
    const col = chars.length - 1 - i, cell = list[col];
    if (ch === ',') { if (!cell.classList.contains('c')) swap(col, makeCell(',')); return; }
    if (cell.classList.contains('c')) swap(col, makeCell(ch));
    const strip = list[col].firstChild;
    if (list[col].dataset.v !== ch) {
      list[col].dataset.v = ch;
      strip.style.setProperty('--d', col * 24 + 'ms');
      strip.style.transform = `translateY(-${ch}em)`;
    }
  });
}
```

**The strip** — ten stacked 1em spans inside a 1em clip; the transition delay comes from a custom property so the cascade is a CSS concern:

```css
.cell.d { display: inline-block; width: var(--digit-w); height: 1em; overflow: hidden; }
.strip  { display: flex; flex-direction: column; will-change: transform;
          transition: transform var(--t-roll) var(--ease-out); transition-delay: var(--d, 0ms); }
.strip span { display: block; height: 1em; text-align: center; }
```

**Auto-tick** — pick a kind, then an amount from its list; keep the sets small so the figures look like a real ledger, not noise:

```js
const kinds = [['Card payment', [19, 29, 49, 89, 120, 240]], ['Invoice', [340, 780, 1250]], ['Subscription', [49, 49, 99]]];
setInterval(() => {
  const k = kinds[Math.floor(Math.random() * kinds.length)];
  add(k[1][Math.floor(Math.random() * k[1].length)], k[0]);
}, 3000);
```

**Line-height must be exactly 1** on the odometer and `height: 1em` on every span; any other value makes the strip drift a few pixels per digit. Use `font-variant-numeric: tabular-nums` and a fixed cell width (`.62em` fits Fraunces at opsz 144; measure your font's widest digit).

Common mistakes: rebuilding the whole number on each change (every digit rolls, and it looks like a slot machine); animating `top` instead of `transform`; forgetting to clamp the value at 0 on refunds; using `toLocaleString` without a fixed locale so the grouping character differs by user.
