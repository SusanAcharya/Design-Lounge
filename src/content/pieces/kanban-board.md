---
title: "Kanban board"
summary: "Four 292px columns with live counts, labelled cards with avatars, pointer-event drag-and-drop with a 3° tilted ghost and a dashed drop placeholder, plus [ ] keyboard moves."
platform: web
type: layout
tags: [kanban, board, drag-and-drop, project]
styles: [minimal, soft]
motion: subtle
difficulty: 3
featured: false
published: 2026-09-29
palette: ["#F3F4F6", "#E9EBEE", "#FFFFFF", "#161A1F", "#0E7C7B"]
fonts: ["Schibsted Grotesk"]
related: []
---

# Kanban board

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A sprint board for a product team ("Fjord Bank · Mobile 4.2"): four columns — Backlog, In progress, Review, Done — each with a coloured status dot, a live card count, a scrollable card list and an "Add card" button. Cards carry coloured label pills, a title, an issue ID, a due date and an initials avatar. Drag-and-drop is written with pointer events (no HTML5 DnD): after 4px of movement the card is replaced by a dashed placeholder and a tilted ghost copy follows the pointer; the column under the pointer tints teal; releasing drops the card where the placeholder is. Cards are focusable and `[` / `]` move them between columns for keyboard users. Below 1280 the board scrolls horizontally with snap points. Single family (Schibsted Grotesk) at four weights; one teal accent.

## Reference behaviour

1. Initial state: 60px white header (title, "Sprint 31 · 12 cards", a keyboard hint at right, "Filter" and a teal "New card" button). Board with four columns: counts 4 / 3 / 2 / 3. Cards at rest have a 1px `--line` border and a 1px shadow; cursor is `grab`.
2. Hover a card: border darkens to `--line-2`. No lift.
3. Press and move a card ≥ 4px: a **ghost** (a clone, `position: fixed`, rotated 3° and scaled 1.02, teal border, deep shadow) appears under the pointer offset by the original grab point; the original card is removed from flow (`display: none`) and a **placeholder** (dashed 1.5px `--line-2` border, 6 % teal fill, same height as the card) takes its place.
4. Move across columns: the column whose list is under the pointer gets class `over` (background `--accent-soft`). The placeholder moves to the position before the first card whose vertical midpoint is below the pointer, or to the end of the list.
5. Release: the placeholder is replaced by the card, the ghost is removed, tints clear, both column counts update, the card receives focus and a polite live region says "<title> moved to <column>".
6. Pointer cancel (e.g. window blur) behaves like release at the current placeholder position.
7. Keyboard: Tab to a card (2px teal outline), press `]` to move it to the top of the next column or `[` to the previous; counts update; focus stays on the card; the live region announces the move.
8. "Add card": appends a card titled "Untitled card" with a fresh ID (FB-4xx), no labels, and focuses it; the count increments.
9. At widths where four 292px columns don't fit, the board scrolls horizontally with `scroll-snap-type: x proximity`; column lists scroll vertically on their own.

## Structure

```
1280 × 800
┌────────────────────────────────────────────────────────────────────────────┐
│ Fjord Bank · Mobile 4.2  Sprint 31 · 12 cards      Drag… [ ]  [Filter] [New]│ 60
├────────────────────────────────────────────────────────────────────────────┤
│ 28 ┌ Backlog ─── 4 ┐ ┌ In progress 3 ┐ ┌ Review ──── 2 ┐ ┌ Done ────── 3 ┐ │ 24
│    │ ┌───────────┐ │ │ ┌───────────┐ │ │ ┌───────────┐ │ │ ┌───────────┐ │ │
│    │ │ Feature   │ │ │ │ Feature   │ │ │ │ Feature   │ │ │ │ Bug       │ │ │
│    │ │ Scheduled…│ │ │ │ Card free…│ │ │ │ Split a p…│ │ │ │ Biometric…│ │ │
│    │ │ FB-412 ▭14│ │ │ │ FB-397   AL│ │ │ FB-388  SV│ │ │ │ FB-380  JR│ │ │
│    │ └───────────┘ │ │ └───────────┘ │ │ └───────────┘ │ │ └───────────┘ │ │
│    │ ┌───────────┐ │ │ ┌───────────┐ │ │ ┌───────────┐ │ │ ┌───────────┐ │ │
│    │ │ …         │ │ │ │ …         │ │ │ │ …         │ │ │ │ …         │ │ │
│    │ (list scrolls)│ │               │ │               │ │               │ │
│    │ [+ Add card]  │ │ [+ Add card]  │ │ [+ Add card]  │ │ [+ Add card]  │ │
│    └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
columns 292px wide, 16px gap, 28px board padding; 4 × 292 + 3 × 16 + 56 = 1272 ≤ 1280
```

- `<header>`: `<h1>`, `.crumb`, `.hint` (with `<kbd>`), two `.btn`s.
- `<div class="board">`: flex row, `overflow-x: auto; overflow-y: hidden; scroll-snap-type: x proximity`.
  - `<section class="col" style="--c: <dot colour>">`: `<h2>` (dot, name, `.n` count), `<div class="list" data-col="Name">` (flex column, `overflow-y: auto`, 8px gap), `<button class="add">`.
  - `<article class="card" tabindex="0">`: `.labels` (0–2 `.lab` pills), `<p>` title, `.meta` (`.id`, 14px calendar or check icon, date, `.av` avatar with `--a` colour).
- Drag artefacts created at runtime: `.card.ghost` appended to `<body>`, `.ph` placeholder inserted into a list.
- `<p class="sr" aria-live="polite">` visually hidden status line.

## Tokens

```css
:root {
  /* colour — cool light greys, white cards, teal accent, four label hues */
  --bg: #f3f4f6;          /* page */
  --col: #e9ebee;         /* column surface */
  --card: #ffffff;        /* card, header */
  --line: #d9dce2;        /* card border, header rule */
  --line-2: #c3c8d0;      /* hover border, placeholder dash, button border */
  --ink: #161a1f;
  --ink-2: #5b6470;       /* ids, counts */
  --ink-3: #8a929e;       /* dates, hint, Backlog dot */
  --accent: #0e7c7b;      /* primary button, focus, ghost border, Done dot */
  --accent-soft: #d7efec; /* column "over" tint */
  --accent-ink: #f2fbfa;
  --ph-fill: rgba(14, 124, 123, .06);
  --l-bug: #b42318;    --l-bug-bg: #fde8e6;
  --l-feat: #175cd3;   --l-feat-bg: #e3ecfb;     /* also the In progress dot */
  --l-design: #8a3ffc; --l-design-bg: #efe6ff;
  --l-infra: #b54708;  --l-infra-bg: #fdefd9;    /* also the Review dot */
  --av-1: #0e7c7b; --av-2: #8a3ffc; --av-3: #b54708; --av-4: #175cd3;

  /* type */
  --font: "Schibsted Grotesk", system-ui, sans-serif;
  --fs-h1: 17px; --fs-col: 13px; --fs-card: 14px; --fs-meta: 12px; --fs-label: 11px; --fs-av: 10px;

  /* layout */
  --col-w: 292px; --gap: 16px; --board-pad: 24px 28px; --header-h: 60px;
  --r: 10px;        /* column */
  --r-card: 8px; --r-btn: 8px; --r-s: 6px;
  --card-pad: 12px 12px 10px; --list-gap: 8px; --av: 24px; --dot: 8px;
  --drag-threshold: 4px; --ghost-tilt: 3deg; --ghost-scale: 1.02;

  /* elevation */
  --shadow-card: 0 1px 2px rgba(22, 26, 31, .06);
  --shadow-ghost: 0 18px 40px -12px rgba(22, 26, 31, .35), 0 2px 6px rgba(22, 26, 31, .12);

  /* motion */
  --t-micro: 140ms; --t-layout: 240ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role          | Family            | Size | Weight | Line-height | Tracking | Case / notes |
|---------------|-------------------|-----:|-------:|------------:|---------:|--------------|
| Board title   | Schibsted Grotesk | 17px | 600    | 1.2         | −0.01em  | sentence |
| Crumb / hint  | Schibsted Grotesk | 13px / 12px | 400 | 1.4      | 0        | `--ink-3`; `<kbd>` 1px `--line-2` border, 4px radius |
| Buttons       | Schibsted Grotesk | 13px | 500    | 1           | 0        | 34px tall, 14px side padding |
| Column name   | Schibsted Grotesk | 13px | 600    | 1.2         | +0.01em  | sentence; 8px dot before |
| Count pill    | Schibsted Grotesk | 12px | 500    | 1.4         | 0        | tabular; white pill, 1px `--line` border, min-width 22px |
| Card title    | Schibsted Grotesk | 14px | 500    | 1.35        | 0        | sentence, wraps to 2 lines |
| Label pill    | Schibsted Grotesk | 11px | 600    | 1.4         | +0.01em  | sentence; padding `2px 7px`, radius 999px |
| Meta (id/date)| Schibsted Grotesk | 12px | 500 / 400 | 1.4      | 0        | tabular; id `--ink-2`, date `--ink-3` |
| Avatar        | Schibsted Grotesk | 10px | 700    | 1           | 0        | UPPERCASE initials on 24px circle |

## Motion

| Element        | Trigger              | Property                | From → To                                | Duration | Easing   |
|----------------|----------------------|-------------------------|------------------------------------------|---------:|----------|
| `.card`        | hover                | border-color            | `--line` → `--line-2`                    | 140ms    | `--ease` |
| `.card.ghost`  | drag start           | transform (static)      | `rotate(3deg) scale(1.02)`, follows pointer via `left/top` each `pointermove`; no transition | — | — |
| `.col`         | pointer enters list  | background              | `--col` → `--accent-soft`                | 140ms    | `--ease` |
| `.ph`          | pointer moves        | DOM position            | re-inserted before the card whose midpoint is below the pointer | instant | — |
| `.card`        | drop                 | DOM position            | replaces `.ph`; no animation (the placeholder already showed the slot) | — | — |
| `.btn`, `.add` | hover                | background / colour     | transparent → `--card`; `--ink-2` → `--ink` | 140ms | `--ease` |

Reduced motion: transitions 1ms; the ghost is not rotated or scaled (`transform: none`), still follows the pointer.

## States

- **Card rest:** white, 1px `--line` border, `--shadow-card`, cursor `grab`, `user-select: none`, `touch-action: none`.
- **Card hover:** border `--line-2`.
- **Card focus-visible:** `outline: 2px solid --accent; outline-offset: 2px`.
- **Card lifted (`.lift`):** `display: none` for the duration of the drag (the placeholder holds the slot).
- **Ghost (`.ghost`):** fixed, `pointer-events: none`, z-index 10, width `calc(292px − 20px)`, height copied from the source card, teal border, `--shadow-ghost`, cursor `grabbing`.
- **Placeholder (`.ph`):** dashed 1.5px `--line-2` border, `--ph-fill`, radius 8px, height = card height, `flex: none`.
- **Column over (`.over`):** background `--accent-soft`.
- **Count pill:** updates on drop, keyboard move and add.
- **Add button:** dashed 1px `--line-2` border, transparent; hover white fill.
- **Empty column:** list keeps `min-height: 60px` so it remains a drop target.

## Accessibility

- Columns are `<section>`s with an `<h2>` each; the count is inside the heading so it is announced ("Backlog 4").
- Cards are `<article tabindex="0">`; the whole card is the focus stop. Keyboard move: `[` previous column, `]` next column (prepends to the target list, keeps focus). Document the keys in the header hint.
- A visually hidden `aria-live="polite"` paragraph announces every move ("Split a payment between two accounts moved to Done").
- Pointer drag uses `setPointerCapture` so the drag survives the pointer leaving the card; `pointercancel` ends the drag safely.
- Label pills have ≥ 4.5:1 text contrast on their tints (`#B42318` on `#FDE8E6` 6.3:1, `#175CD3` on `#E3ECFB` 5.6:1, `#8A3FFC` on `#EFE6FF` 4.9:1, `#B54708` on `#FDEFD9` 5.4:1). Dates in `--ink-3` on white are 3.9:1 — meta only; raise to `--ink-2` if they must pass AA.
- Hit targets: cards ≥ 96px tall; buttons 34px (raise to 40px on touch layouts); avatars are decorative (initials repeat the assignee, add a `title` in production).
- Icons are inline SVG on a 24 grid, 1.75px stroke, `currentColor`.

## Responsive rules

- ≥ 1280: four columns visible, no horizontal scroll.
- 1024–1279: board scrolls horizontally; columns stay 292px; snap to column starts. Header hint hidden below 1100.
- 768–1023: board padding 16px; header buttons collapse to icons.
- < 640: columns 84vw wide, one column per snap; card labels wrap; keyboard hint hidden. Drag still works with touch because `touch-action: none` is set on cards.

## Acceptance checklist

- [ ] Columns are 292px wide with a 16px gap and 28px board padding; header is 60px.
- [ ] Each column heading shows a coloured 8px dot and a count pill that equals the number of cards in that column at all times.
- [ ] Drag starts only after the pointer moves ≥ 4px from pointerdown; a plain click does not lift the card.
- [ ] While dragging, a ghost clone (rotated 3°, scaled 1.02, teal border, deep shadow) follows the pointer at the original grab offset.
- [ ] The source card leaves the flow and a dashed placeholder of identical height marks the drop slot; the placeholder moves as the pointer crosses card midpoints.
- [ ] The column under the pointer tints `#D7EFEC`; the tint clears on drop or cancel.
- [ ] Dropping places the card where the placeholder was, updates both counts, focuses the card and announces the move in a live region.
- [ ] `pointercancel` ends the drag without leaving a ghost or placeholder behind.
- [ ] Focused cards move with `[` and `]`; moves are announced; focus is retained.
- [ ] "Add card" appends a focused "Untitled card" with a new FB-4xx id and increments the count.
- [ ] Below 1272px the board scrolls horizontally with `scroll-snap-type: x proximity`; lists scroll vertically independently.
- [ ] Cards use `user-select: none` and `touch-action: none` so text selection and page panning do not fight the drag.
- [ ] No HTML5 `draggable` attribute is used; behaviour is identical with mouse, pen and touch.

## Implementation notes

**Threshold, ghost and placeholder in one `pointermove` handler.** Capture the pointer on down, but do nothing visible until 4px of travel:

```js
board.addEventListener('pointerdown', e => {
  const card = e.target.closest('.card'); if (!card || e.button !== 0) return;
  drag = { card, x0: e.clientX, y0: e.clientY, r: card.getBoundingClientRect(), on: false };
  card.setPointerCapture(e.pointerId);
});
board.addEventListener('pointermove', e => {
  if (!drag) return; const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
  if (!drag.on) { if (Math.hypot(dx, dy) < 4) return; drag.on = true;
    drag.ghost = drag.card.cloneNode(true); drag.ghost.classList.add('ghost');
    drag.ghost.style.height = drag.r.height + 'px'; document.body.appendChild(drag.ghost);
    drag.ph = Object.assign(document.createElement('div'), { className: 'ph' });
    drag.ph.style.height = drag.r.height + 'px'; drag.card.after(drag.ph); drag.card.classList.add('lift'); }
  drag.ghost.style.left = drag.r.left + dx + 'px'; drag.ghost.style.top = drag.r.top + dy + 'px';
  const list = document.elementFromPoint(e.clientX, e.clientY)?.closest('.list'); if (!list) return;
  const next = [...list.querySelectorAll('.card:not(.lift)')]
    .find(c => { const r = c.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
  next ? list.insertBefore(drag.ph, next) : list.appendChild(drag.ph);
});
```

**Ghost styling** — fixed, non-interactive, and sized like a column card so `elementFromPoint` never hits it:

```css
.card.ghost { position: fixed; z-index: 10; pointer-events: none; width: calc(var(--col-w) - 20px);
              transform: rotate(3deg) scale(1.02); box-shadow: var(--shadow-ghost);
              border-color: var(--accent); transition: none; }
.ph { border: 1.5px dashed var(--line-2); border-radius: 8px; background: var(--ph-fill); flex: none; }
```

**Drop and announce** — replace the placeholder, recount, then speak:

```js
function end() {
  if (!drag) return; const d = drag; drag = null; if (!d.on) return;
  d.ph.replaceWith(d.card); d.card.classList.remove('lift'); d.ghost.remove();
  document.querySelectorAll('.col.over').forEach(c => c.classList.remove('over'));
  counts(); d.card.focus();
  live.textContent = `${d.card.querySelector('p').textContent} moved to ${d.card.closest('.list').dataset.col}`;
}
board.addEventListener('pointerup', end); board.addEventListener('pointercancel', end);
```

Common mistakes: forgetting `pointer-events: none` on the ghost (every `elementFromPoint` then returns the ghost); leaving the source card visible at opacity 0 (it keeps its slot, so you get two gaps); using `overflow-y: auto` on the board instead of on each list (the ghost then scrolls the board); omitting `touch-action: none` (touch drags pan the page instead).
