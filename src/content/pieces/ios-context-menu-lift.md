---
title: "iOS context menu lift"
summary: "Press-and-hold a chat bubble for 350ms: it lifts to 1.04 with a shadow, the thread blurs, and a four-item menu springs in with a 40ms stagger."
platform: mobile-app
type: animation
category: overlays
tags: [context-menu, long-press, messaging, ios, haptics]
styles: [minimal, soft]
motion: rich
difficulty: 2
featured: false
published: 2026-09-30
palette: ["#F7F7F9", "#E9E9EE", "#0A7AFF", "#111114", "#E5352B"]
fonts: ["Schibsted Grotesk"]
related: [ios-swipe-row-actions, ios-bottom-sheet-detents]
---

# iOS context menu lift

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A messaging thread (fictional product "Halden") in an iOS 26-style light palette. Pressing and holding any message bubble for 350ms lifts a copy of the bubble out of the thread (scale 1.04, deep soft shadow), blurs and tints everything behind it, and springs a 250px context menu (Reply, Copy, Forward, Delete) into place next to the bubble. Menu rows arrive one after another, 40ms apart. Releasing anywhere outside the menu drops the bubble back and dismisses. The detail worth copying is the layering: the bubble is *cloned* into a fixed layer above the blur so the original list never has to escape its scroll container, and the hold is cancelled by a 6px finger move so scrolling never triggers it.

## Reference behaviour

1. Initial state: a chat header (back chevron, avatar "ML", name "Mira Lindqvist", video icon) pinned at the top under the status bar; a thread of seven bubbles (incoming grey on the left, outgoing blue on the right); a composer pinned at the bottom above the home indicator. A hint line "Press and hold a bubble for 350ms" sits above the composer.
2. Pointer down on a bubble: the bubble shrinks to `scale(.985)` over 160ms (`:active`). A 350ms timer starts.
3. If the pointer lifts, is cancelled, or moves more than 6px (summed |dx|+|dy| per `pointermove`) before 350ms: the timer is cancelled and nothing else happens. Scrolling the thread therefore never opens a menu.
4. At 350ms: the original bubble becomes `visibility:hidden`; a clone is placed at its exact viewport rect in a fixed layer (z-index 9) and animates `scale(1) → scale(1.04)` over 320ms with the spring curve, gaining `--shadow-lift`. A full-screen scrim (z-index 8, `rgba(232,232,238,.42)` + `backdrop-filter: blur(18px) saturate(1.1)`) fades in over 220ms. The hint fades out.
5. In the same frame, a `<ul role="menu">` (250px wide, radius 14px, translucent `rgba(250,250,252,.92)` with `blur(30px) saturate(1.6)`) animates `opacity 0, scale(.55) → 1, scale(1)` over 320ms with the spring curve. Its transform-origin is the corner nearest the bubble (`left top` for incoming below, `right top` for outgoing below; `bottom` variants when flipped).
6. The menu sits 8px below the bubble, aligned to the bubble's outer edge (left edge for incoming, right edge for outgoing). If `bubble.bottom + 8 + 178 > 844 − 34 − 8`, it flips to 8px above the bubble.
7. Each of the four rows (44px tall) fades from `opacity 0, translateY(−6px)` to `1, 0` over 240ms, delayed `60ms + index × 40ms`. "Delete" is red (`--danger`) with a trash icon; the others use the secondary ink for their trailing 20px icon.
8. Focus moves to the first menu row. ArrowDown/ArrowUp cycle rows, Escape dismisses, Tab is trapped.
9. Tapping a row: a black pill toast near the bottom ("Copied", or "Reply · Mira", "Forward · your message", etc.) slides up 8px and fades in over 160ms, stays 1400ms, then fades out. The menu dismisses at the same time.
10. Releasing (pointerup) on the scrim: the scrim fades out over 220ms; the clone animates back to `scale(1)` and loses its shadow over 180ms; the menu scales to `.9` and fades over 160ms. After 180ms the clone and menu are removed, the original bubble is made visible again and receives focus.
11. Keyboard: Enter or Space on a focused bubble opens the menu immediately (no hold), with the same animation.

## Structure

```
390 × 844
┌──────────────────────────────────────────┐
│ (54px status bar drawn by the Lounge)    │
│ ‹   [ML] Mira Lindqvist            ▭    │  header: 54px top pad + 48px row, blurred bar
├──────────────────────────────────────────┤
│              Today 09:41                 │
│ ┌──────────────────────┐                 │  .msg.in  max-width 76%, left
│ │ Morning. Did the …   │                 │
│ └──────────────────────┘                 │
│                 ┌──────────────────────┐ │  .msg.out max-width 76%, right, blue
│                 │ Sent at 08:52, PDF … │ │
│                 └──────────────────────┘ │
│                 ┌────────────────────┐   │
│                 │ Hold this one …    │   │ ← lifted clone (scale 1.04, shadow)
│                 └────────────────────┘   │
│                 ┌──────────── 250 ────┐   │  menu, 8px below, right-aligned
│                 │ Reply            ↩  │   │  4 rows × 44px, .5px separators
│                 │ Copy             ⧉  │   │
│                 │ Forward          ↪  │   │
│                 │ Delete (red)      x │   │  (icons are inline SVG, not glyphs)
│                 └─────────────────────┘   │
│  … remaining thread, blurred by scrim …  │
│      Press and hold a bubble for 350ms   │  hint, bottom 92px
├──────────────────────────────────────────┤
│  +   ( Message              )     ⏺     │  footer: 38px field, 34px bottom pad
└──────────────────────────────────────────┘
```

- `<header>` — fixed, `padding: 54px 12px 8px`, `backdrop-filter: blur(20px)`, 0.5px bottom hairline. Two 40×40 icon `<button>`s, centre column with 36px avatar and 12px/500 name.
- `<main id="thread">` — scrollable flex column, `padding: 128px 16px 100px`, `gap: 4px`. `.day` centred date label.
- `.msg.in` / `.msg.out` — flex column, `max-width: 76%`, aligned start/end. Consecutive same-side messages get 2px gap; side changes get 10px.
- `.bubble` — a real `<button aria-haspopup="menu">` so it is focusable and pressable by keyboard. Trailing `.meta` span ("Delivered", "Read 09:47") in 11px tertiary ink.
- `<footer>` — fixed, `padding: 8px 12px 34px`, blurred bar, 0.5px top hairline. 40px attach button, 38px pill text field, 40px mic button.
- `.scrim` — fixed inset 0, z-index 8.
- `.lift` (bubble clone) and `.menu` — appended to `<body>` at open, removed at close.
- `.toast` — fixed, `bottom: 112px`, centred, `role="status"`.

## Tokens

```css
:root {
  /* colour — cool off-white iOS surfaces, one blue, one red */
  --bg: #f7f7f9;                     /* thread background */
  --bar: rgba(247,247,249,.86);      /* header + composer translucent bars */
  --line: rgba(60,60,67,.18);        /* hairlines */
  --ink: #111114;                    /* primary text, toast bg */
  --ink-2: #6e6e78;                  /* menu icons */
  --ink-3: #9a9aa3;                  /* meta, hint, placeholder */
  --in: #e9e9ee;                     /* incoming bubble */
  --out: #0a7aff;                    /* outgoing bubble, tint, focus ring */
  --out-ink: #ffffff;                /* text on outgoing */
  --danger: #e5352b;                 /* Delete row */
  --menu: rgba(250,250,252,.92);     /* menu surface (over blur) */
  --menu-line: rgba(60,60,67,.14);   /* menu row separators */
  --scrim: rgba(232,232,238,.42);    /* tint over the blurred thread */

  /* type */
  --font: "Schibsted Grotesk", -apple-system, system-ui, sans-serif;

  /* shape */
  --r-bubble: 18px;                  /* tail corner is 6px */
  --r-menu: 14px;
  --menu-w: 250px;
  --row: 44px;

  /* elevation */
  --shadow-lift: 0 18px 40px rgba(17,17,20,.22), 0 2px 6px rgba(17,17,20,.10);
  --shadow-menu: 0 12px 32px rgba(17,17,20,.16);

  /* motion */
  --hold: 350ms;                     /* long-press threshold */
  --t-micro: 160ms;
  --t-menu: 320ms;
  --stagger: 40ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --spring: cubic-bezier(.34, 1.45, .64, 1);   /* overshoots ~4% */
  --sheet: cubic-bezier(.32, .72, 0, 1);
}
```

## Typography

| Role              | Family            | Size | Weight | Line-height | Tracking | Case     |
|-------------------|-------------------|-----:|-------:|------------:|---------:|----------|
| Bubble text       | Schibsted Grotesk | 16px | 400    | 1.32        | −0.005em | sentence |
| Menu row          | Schibsted Grotesk | 17px | 400    | 1           | −0.01em  | sentence |
| Header name       | Schibsted Grotesk | 12px | 500    | 1.2         | −0.01em  | sentence |
| Avatar initials   | Schibsted Grotesk | 14px | 600    | 1           | 0        | UPPER    |
| Day label / hint  | Schibsted Grotesk | 12px | 500    | 1.3         | 0        | sentence |
| Meta (Delivered)  | Schibsted Grotesk | 11px | 400    | 1.3         | 0        | sentence |
| Toast             | Schibsted Grotesk | 13px | 500    | 1.3         | 0        | sentence |
| Composer field    | Schibsted Grotesk | 16px | 400    | 1           | 0        | sentence |

## Motion

| Element        | Trigger            | Property                 | From → To                       | Duration | Easing     | Delay / notes |
|----------------|--------------------|--------------------------|----------------------------------|---------:|------------|---------------|
| `.bubble`      | pointerdown        | transform                | scale(1) → scale(.985)           | 160ms    | `--ease`   | `:active`; releases with the same clock |
| `.scrim`       | hold reaches 350ms | opacity                  | 0 → 1                            | 220ms    | `--ease`   | blur is constant; only opacity animates |
| `.lift` clone  | hold reaches 350ms | transform, box-shadow    | scale(1) → scale(1.04), shadow on| 320ms    | `--spring` | `transform-origin: <side> 50%` |
| `.menu`        | hold reaches 350ms | opacity, transform       | 0, scale(.55) → 1, scale(1)      | 320ms    | `--spring` | origin = corner nearest bubble |
| `.menu button` | menu opens         | opacity, translateY      | 0, −6px → 1, 0                   | 240ms    | `--spring` | delay `60ms + i × 40ms`, i = 0..3 |
| `.lift.away`   | dismiss            | transform, box-shadow    | scale(1.04) → scale(1), none     | 180ms    | `--ease`   | nodes removed after 180ms |
| `.menu.away`   | dismiss            | opacity, transform       | 1, scale(1) → 0, scale(.9)       | 160ms    | `--ease`   | |
| `.scrim`       | dismiss            | opacity                  | 1 → 0                            | 220ms    | `--ease`   | `pointer-events` off immediately |
| `.toast`       | row tapped         | opacity, translateY      | 0, 8px → 1, 0                    | 160ms    | `--ease`   | holds 1400ms then reverses |
| `.hint`        | menu opens/closes  | opacity                  | 1 ↔ 0                            | 160ms    | `--ease`   | |

Reduced motion (`prefers-reduced-motion: reduce`): every `animation-duration`, `animation-delay` and `transition-duration` becomes 1ms. The scrim still blurs, the clone still shows its shadow, the menu still appears; nothing moves.

## States

- **Bubble rest:** incoming `--in` with `--ink`; outgoing `--out` with `--out-ink`. 18px radius, 6px on the tail corner (bottom-left for incoming, bottom-right for outgoing).
- **Bubble active (pressed, < 350ms):** `scale(.985)`.
- **Bubble focus-visible:** 2px `--out` outline, 3px offset.
- **Bubble source while lifted:** `visibility: hidden` (keeps layout; the clone is what the user sees).
- **Lifted clone:** `scale(1.04)`, `--shadow-lift`, z-index 9, `pointer-events` default (taps on it do nothing).
- **Menu row hover / focus-visible:** background `rgba(60,60,67,.08)`, no outline (the row fill is the focus indicator). Delete row text and icon are `--danger` in all states.
- **Scrim on:** `opacity 1`, `pointer-events: auto`; off: `pointer-events: none`.
- **Toast on:** `opacity 1`, centred; `role="status"` announces the text.
- **Hint:** visible until the first open, hidden while a menu is open, restored on close.

## Accessibility

- Every bubble is a `<button aria-haspopup="menu">`; the clone is `tabIndex=-1` and has no `aria-haspopup`, so there is one focusable copy at a time.
- Menu is `<ul role="menu">` with `<li role="none">` and `<button role="menuitem">`. On open, focus moves to the first item; on close, focus returns to the originating bubble (`focus({ preventScroll: true })`).
- Keys while open: `ArrowDown` / `ArrowUp` wrap through the four items; `Escape` closes; `Tab` is prevented (focus stays in the menu); `Enter`/`Space` activate the focused item natively.
- Keys on a bubble: `Enter` / `Space` open the menu without the 350ms hold.
- Header and composer icon buttons are 40×40 with `aria-label`s ("Back", "Video call", "Add attachment", "Voice message"). Menu rows are 44px tall and 250px wide.
- The composer field is a `role="textbox" aria-readonly="true"` placeholder in the demo; use a real `<input>` in production.
- Contrast: `--ink` on `--in` 15.6:1; `--out-ink` on `--out` 4.6:1 (16px regular, meets AA); `--ink-3` is only used at ≤ 12px for non-essential meta; `--danger` on the menu surface 4.7:1.
- `user-select: none` and `-webkit-touch-callout: none` on `<body>` stop the browser's own text-selection callout from competing with the custom long-press.

## Responsive rules

- 390 × 844 (reference): as specified. The menu flip threshold uses the 844 frame height minus the 34px home-indicator inset and an 8px margin; replace the literal with `window.innerHeight` in production.
- 360 wide: bubbles keep `max-width: 76%` (≈ 250px of a 328px content column); the 250px menu is aligned to the bubble edge and never exceeds the 16px side gutters because the widest bubble edge is 16px from the frame.
- ≥ 600 wide (tablet / split view): cap the thread at 600px centred; keep the menu 250px and still anchor it to the bubble rect. Hover on the row highlight becomes meaningful; keep the long-press for touch and add right-click (`contextmenu` event) to open the same menu on pointer devices.
- Short viewports (< 700px): the flip-above rule fires more often; nothing else changes.

## Acceptance checklist

- [ ] Holding a bubble for less than 350ms, or moving more than 6px during the hold, never opens the menu.
- [ ] At 350ms the original bubble is hidden and a clone appears at the same viewport rect (no visible jump before the scale starts).
- [ ] The clone scales to exactly 1.04 over 320ms with `cubic-bezier(.34,1.45,.64,1)` and gains `0 18px 40px rgba(17,17,20,.22)`.
- [ ] The scrim uses `backdrop-filter: blur(18px)`; only its opacity animates (220ms).
- [ ] The menu is 250px wide, radius 14px, four 44px rows with 0.5px separators, and sits 8px from the bubble, aligned to the bubble's outer edge.
- [ ] Menu rows fade in 40ms apart (delays 60, 100, 140, 180ms).
- [ ] When the menu would overlap the bottom 42px (34px home inset + 8px), it flips above the bubble and its transform-origin flips to the bottom corner.
- [ ] Releasing on the scrim dismisses; the clone drops back to scale 1 over 180ms and nodes are removed afterwards.
- [ ] Focus lands on "Reply" when the menu opens and returns to the bubble on close.
- [ ] ArrowUp/ArrowDown wrap, Escape closes, Tab does not leave the menu.
- [ ] Enter/Space on a focused bubble opens the menu without a hold.
- [ ] "Delete" is rendered in `#e5352b` including its icon.
- [ ] Under `prefers-reduced-motion: reduce`, the whole sequence completes within a frame and no element scales.
- [ ] No console errors when dismissing during the open animation (guard with the `open` handle).

## Implementation notes

**Clone into a fixed layer instead of raising the original.** The thread scrolls and the header/footer are blurred bars; a bubble inside `<main>` cannot rise above them without breaking its stacking context. Measure, hide, clone:

```js
const r = src.getBoundingClientRect();
const clone = src.cloneNode(true);
clone.className = 'bubble lift'; clone.tabIndex = -1;
Object.assign(clone.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
src.classList.add('src');          /* visibility: hidden — keeps layout */
document.body.append(clone, menu);
```

**Cancel the hold on movement, not just on release.** A finger that scrolls always moves; use `movementX/Y` and a 6px budget so a slight tremor still counts as a hold:

```js
document.addEventListener('pointerdown', e => {
  const b = e.target.closest('.bubble:not(.lift)');
  if (!b || open) return;
  timer = setTimeout(() => { timer = null; lift(b); }, 350);
});
document.addEventListener('pointermove', e => {
  if (timer && Math.abs(e.movementX) + Math.abs(e.movementY) > 6) { clearTimeout(timer); timer = null; }
});
['pointerup', 'pointercancel'].forEach(t => document.addEventListener(t, () => { clearTimeout(timer); timer = null; }));
```

**Stagger through a custom property.** Give each row `--i` and let CSS compute the delay so the stagger lives in one token:

```css
.menu button { opacity: 0; animation: item 240ms var(--spring) forwards;
               animation-delay: calc(var(--i) * var(--stagger) + 60ms); }
@keyframes item { from { opacity: 0; transform: translateY(-6px) } to { opacity: 1; transform: none } }
```

Common mistakes: setting `touch-action: none` on bubbles (kills thread scrolling; use `pan-y`); animating `filter: blur()` on the thread itself instead of a scrim with `backdrop-filter` (repaints every frame and cannot be layered under the clone); forgetting `-webkit-touch-callout: none`, which lets Safari's native callout appear at ~500ms on top of yours; using `display: none` on the source bubble, which collapses the thread and shifts every rect you just measured.
