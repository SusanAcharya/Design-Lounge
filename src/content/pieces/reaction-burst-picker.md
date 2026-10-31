---
title: "Reaction burst picker"
summary: "Hold the react button, slide across six hand-drawn faces that swell under your finger, let go: the face flies home, bursts, and the count rolls."
platform: web
type: component
category: social
tags: [press, hover, drag, select, reactions]
styles: [soft, playful, minimal]
motion: rich
difficulty: 2
featured: false
published: 2026-10-31
palette: ["#F4F1EA", "#FFFDF8", "#1B2422", "#0D6E62", "#FFC53D"]
fonts: ["Gabarito", "Inclusive Sans"]
related: [optimistic-like-button]
---

# Reaction burst picker

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The reaction control under a message in "Lido", an invented chat app for an open-water swimming club (channel `# dawn-swims`). Long-press the React button on a phone, or rest the mouse on it, and a white pill tray of six hand-drawn faces springs open above the row. Slide your finger across it: the face under the finger swells to 1.45× and lifts 12px with a dark label above it, its neighbours lean in at 1.1×. Let go and the face flies on an arc back into the button, lands with a squash spring and throws nine drawn particles, while the matching chip's count rolls up a digit. The detail worth copying is that the whole gesture is one press: down, slide, release, never a second tap.

## Reference behaviour

1. Initial (hero) state: the thread shows four messages. Under Ines Okoro's message (stats strip `Water 9.4 °C · Distance 800 m · Swimmers 6`) the reaction row reads `Love 11 · Haha 3 · Brr 7 · [React]`. The tray is already open above the row with **Brr** highlighted and labelled, so the first frame shows the point.
2. Any pointerdown outside the row and tray closes the tray (no animation beyond the class change).
3. **Touch / pen:** pointerdown on React captures the pointer. If it lifts within 320ms, it is a tap (step 7). At 320ms the tray opens with a spring (scale 0.55 → 1 and translateY 14px → 0, stiffness 600, damping 24, origin at the React button's centre); the six faces pop in from scale 0.3 with a 28ms stagger.
4. While held, moving the finger highlights the face whose centre is nearest on x, as long as the finger is within the tray's box expanded by 70px above, 44px below and 20px either side. Highlighted face: `scale(1.45) translateY(-12px)` plus a label tip; the faces either side: `scale(1.1) translateY(-2px)`. Each change triggers a 5ms vibration where supported. Outside the box nothing is highlighted.
5. Release on a highlighted face picks it. Release with nothing highlighted after moving cancels and closes. Release without moving leaves the tray open so the user can tap a face.
6. **Mouse:** resting on the React button (or tray) for 380ms opens the tray; leaving both for 280ms closes it. Hover highlights by the same nearest-x rule; click picks.
7. **Tap / click the React button:** with no reaction, adds Love; with a reaction, removes it ("tap again to remove").
8. **Pick:** the tray closes. A 40px copy of the face starts at the tray item (scale 1.4), arcs up 36px above the higher of the two points and lands in the button's 20px icon slot (scale 0.5) over 380ms. Then the icon springs from 1.6 → 1 (stiffness 700, damping 14) and nine particles burst from its centre.
9. The button now shows the chosen face and its name (`Brr`) with a 1.5px ink inset ring. The chip for that reaction gets the tide-green "mine" style and its count rolls up: the old number slides up 16px and out while the new one slides in, 320ms. A reaction with no chip yet gets a new chip that springs in from scale 0.4.
10. Picking a different reaction moves your vote: the old chip rolls down by one (and disappears at zero), the new one rolls up. Picking the same reaction again removes it.
11. A polite live region announces "You reacted Brr. 8 total" or "Reaction removed".

## Structure

```
1280 × 800
┌ rail 248 ──────┬ main ──────────────────────────────────────────────────────┐
│ [≈] Lido Dawn  │ # dawn-swims   Pier 3, weekdays at 6:30        (IO)(MS)..  │ 64
│     Club       ├────────────────────────────────────────────────────────────┤
│ CHANNELS       │  thread, max 780, padding 20 40 0, messages pinned to end   │
│ # general      │        WEDNESDAY 28 OCTOBER                                 │
│ # dawn-swims 4 │  (AK) Ama Kwarteng 21:40 …           [♥ 6][swim 9]          │
│ # water-temps  │        THURSDAY 29 OCTOBER                                  │
│ # kit-swap     │  (TR) Tomas Reyes 6:12 …                                    │
│ # carpools     │  (IO) Ines Okoro 7:48 …                                     │
│                │      ╭ tray 6 × 44 + 5 × 4 + 12 ─────────╮  ← bottom: row+10 │
│                │      │ (♥)(haha)(wow)(BRR)(oof)(swim)    │                   │
│                │      ╰────────────────────────────────────╯                  │
│                │      [♥ 11][haha 3][brr 7][☺+ React]     row, chips 30 tall  │
│                │  (MS) Marta Silva 7:55 …                                    │
│ 22 in the water│  [ Message # dawn-swims                          (→) ]  48  │
└────────────────┴────────────────────────────────────────────────────────────┘
```

- `<nav class="rail">` club mark, `<h2>` CHANNELS, channel links with `aria-current="page"` on the active one.
- `<main>`: `<header class="top">`, `<section class="thread">`, a static composer.
- Each message is an `<article class="msg">`: 40px avatar disc + column with `.meta` (name, `<time>`), `<p>`, optional `<dl class="log">`, and `.rx` (the reaction row).
- `.rx` is `position: relative`; it holds chips, then `.wrap` containing the `<button class="react" aria-haspopup="menu">` and the `<div class="tray" role="menu">` absolutely placed at `left: -6px; bottom: calc(100% + 10px)`.
- Faces live in one hidden SVG sprite as `<symbol>`s (`#r-love`, `#r-haha`, `#r-wow`, `#r-brr`, `#r-oof`, `#r-swim`), each 40 × 40 viewBox, used at 40px in the tray and 20px in chips and the button.

## Tokens

```css
:root {
  /* ground and ink: warm sand with a sea-green accent */
  --bg: #f4f1ea;           /* page */
  --rail: #ebe6da;         /* sidebar */
  --card: #fffdf8;         /* tray, chips, composer, active channel */
  --line: #dcd5c6;         /* hairlines, chip ring */
  --line-2: #c9c1b0;       /* React button ring, composer ring */
  --ink: #1b2422;
  --ink-2: #47524f;        /* body-secondary, chip text */
  --ink-3: #5d6864;        /* meta, labels */
  --tide: #0d6e62;         /* accent: focus ring, mine chip, send */
  --tide-soft: #dcebe5;    /* mine chip fill */

  /* reaction art */
  --love: #e0464b;
  --sun: #ffc53d;          /* haha, wow, oof faces */
  --face-ink: #3a2608;     /* features on sun faces */
  --ice: #a9dbef;          /* brr face */
  --ice-ink: #1d3a4a;
  --sea: #13857a;          /* swim disc */
  --drop: #5fb9e0;         /* oof sweat drop, brr particles */

  /* type */
  --display: "Gabarito", system-ui, sans-serif;
  --text: "Inclusive Sans", system-ui, sans-serif;

  /* shape */
  --item: 44px;            /* tray cell; face art 40px */
  --r-chip: 15px;          /* 30px-tall pills */
  --r-tray: 32px;
  --shadow-tray: 0 0 0 1px var(--line), 0 14px 34px -10px rgba(27,36,34,.32);

  /* motion */
  --t-micro: 160ms;
  --t-longpress: 320ms;
  --t-hover-open: 380ms;
  --t-hover-close: 280ms;
  --t-fly: 380ms;
  --t-burst: 560ms;
  --t-roll: 320ms;
  --stagger: 28ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease-spring: cubic-bezier(.34, 1.56, .64, 1);
  /* springs (mass 1, sampled at 60fps): tray k600 c24, land k700 c14, chip k520 c20 */
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Club name | Gabarito | 17px | 700 | 1.1 | −0.01em | Title |
| Channel title | Gabarito | 20px | 700 | 1.2 | −0.01em | lower |
| Author name | Gabarito | 15.5px | 600 | 1.3 | 0 | Title |
| Message body | Inclusive Sans | 15px | 400 | 1.55 | 0 | Sentence |
| Meta / time | Inclusive Sans | 12.5px | 400 | 1.55 | 0 | |
| Day divider, rail heading, stat label | Gabarito | 11–12px | 600 | 1 | +0.06em | UPPER |
| Stat value | Gabarito | 17px | 600 | 1.3 | 0 | |
| Chip count, React label | Inclusive Sans | 13.5px | 500 | 1 | 0 | `tabular-nums` on counts |
| Tray label tip | Gabarito | 13px (drawn at 1/1.45 so it reads 13px on the scaled face) | 600 | 1 | 0 | Title |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|---|
| Tray | open | transform, opacity | `translateY(14px) scale(.55)`, 0 → none, 1 | ~600ms spring k600 c24 | spring keyframes via WAAPI | appears instantly |
| Tray faces | open | scale, opacity | .3, 0 → 1, 1 | 280ms, stagger 28ms | `--ease-spring` | none |
| Face under finger | highlight | transform | 1 → `scale(1.45) translateY(-12px)` | 240ms | `--ease-spring` | 1ms |
| Neighbours | highlight | transform | 1 → `scale(1.1) translateY(-2px)` | 240ms | `--ease-spring` | 1ms |
| Label tip | highlight | opacity | 0 → 1 | 160ms | `--ease` | 1ms |
| Flying face | pick | translate, scale | item centre, 1.4 → arc apex (−36px), 1.1 at 45% → icon centre, 0.5 | 380ms | `--ease` | skipped |
| Button icon | land | scale | 1.6 → 1 | ~700ms spring k700 c14 | WAAPI | skipped |
| Particles ×9 | land | translate, scale, opacity | 12px out, 1, 1 → 30/42px out, .2, 0 | 560ms | `--ease-out` | skipped |
| Chip count | change | translateY | 0 → −16px (up) or −16px → 0 (down) | 320ms | `--ease-out` | number swaps |
| New chip | first vote | scale | .4 → 1 | spring k520 c20 | WAAPI | appears |

Particles: nine, evenly spaced from 12 o'clock, odd ones nudged +0.2rad. Every third is a 3px-radius dot in the reaction's second colour; the rest are 9px round-capped strokes in its main colour, rotated to point outward. Pairs: love `#e0464b/#ffb4a8`, haha `#ffc53d/#e0464b`, wow `#ffc53d/#3a2608`, brr `#5fb9e0/#1d3a4a`, oof `#ffc53d/#5fb9e0`, swim `#13857a/#7fd3c4`.

## States

- **React, none:** outline smiley-plus icon + "React", 1px `--line-2` inset ring, transparent fill. Hover: `--card` fill, `--ink` text.
- **React, yours:** your face at 20px + its name, `--card` fill, 1.5px `--ink` inset ring.
- **Chip:** `--card` fill, 1px `--line` ring, `--ink-2`. **Mine:** `--tide-soft` fill, 1.5px `--tide` ring, `--tide` text.
- **Tray item checked** (your current reaction): a 4px ink dot under the face.
- **Focus-visible:** 2px `--tide` outline, 2px offset, on the React button, every tray face and channel link.
- **Tray closed:** `visibility: hidden; opacity: 0`, so hidden faces are out of the tab order and the accessibility tree.

## Accessibility

- React is a `<button aria-haspopup="menu" aria-expanded aria-controls="tray">`. Its label is "React to this message" or "Your reaction: Brr. Press to remove, hold or press Enter to change".
- Tray is `role="menu"` with six `role="menuitemradio"` buttons, `aria-checked` on your current one, roving `tabindex`.
- Keys on React: **Enter**, **Space** or **ArrowUp** open the tray and focus your current face (or Love); **Delete/Backspace** remove your reaction.
- Keys in the tray: **ArrowLeft/Right** (and Up/Down) move with wrap, **Home/End** jump, **Enter/Space** pick and return focus to React, **Escape** closes and returns focus, **Tab** closes.
- Each chip is `role="img"` labelled "Brr, 8, including you".
- A visually hidden `aria-live="polite"` paragraph announces picks and removals.
- Faces in the tray are 44px targets; chips and React are 30px tall at 1280 (desktop) and keep a 6px gap.
- Contrast: `--ink-3` on `--bg` 5.1:1; `--tide` on `--tide-soft` 5.0:1; tip text white on `--ink` 15.9:1.

## Responsive rules

- ≥ 1280: as drawn. The thread column stays 780px wide max, messages stick to the bottom.
- 1024–1279: unchanged, thread narrows.
- < 760: the rail and the channel description hide, header padding 14px 16px, thread padding 12px 16px, avatars 36px, body 15px, stat cells 7px 11px. The tray tightens to gap 2px, padding 5px (6 × 44 + 5 × 2 + 10 = 284px) and still anchors at the start of the reaction row, so it fits a 360px screen.
- Touch screens never rely on hover: long-press is the only way in besides the keyboard.

## Acceptance checklist

**Always**
- [ ] A press shorter than 320ms toggles the default reaction; a longer press opens the tray without releasing.
- [ ] While the pointer is held, the face nearest on x swells to 1.45× and lifts 12px, its neighbours scale to 1.1×.
- [ ] Releasing over a face picks it; releasing outside the tray's hit box after moving cancels.
- [ ] The page does not scroll while dragging on a phone (`touch-action: none` on the button and tray, pointer captured).
- [ ] The picked face flies 380ms on an arc into the button, then springs 1.6 → 1 and bursts nine particles.
- [ ] The chip count rolls by 16px in 320ms; a vote moved between reactions rolls one down and the other up.
- [ ] Tapping the button when you have a reaction removes it.
- [ ] Keyboard: Enter opens, arrows move, Enter picks, Escape closes; focus returns to the button.
- [ ] `aria-expanded`, `aria-checked` and the live region update on every change.
- [ ] Reduced motion: no tray spring, no fly, no burst, no roll; every state is still correct.

**This demo**
- [ ] Six reactions in order Love, Haha, Wow, Brr, Oof, Swim, drawn as SVG, no system emoji.
- [ ] The first frame shows the tray open over Ines Okoro's message with Brr highlighted.
- [ ] Starting counts are Love 11, Haha 3, Brr 7.

## Implementation notes

**A spring as WAAPI keyframes.** Integrate once, sample at 60fps, hand the array to `animate`. The duration is the sample count times 16.7ms, so the curve plays at its true speed.

```js
function spring(a, b, k = 520, c = 20) {
  const out = []; let x = a, v = 0;
  for (let i = 0; i < 90; i++) {
    v += (-k * (x - b) - c * v) / 60; x += v / 60; out.push(x);
    if (Math.abs(v) < .02 && Math.abs(x - b) < .002) break;
  }
  out.push(b); return out;
}
const s = spring(1.6, 1, 700, 14);
icon.animate(s.map(v => ({ transform: `scale(${v})` })), { duration: s.length * 16.7 });
```

**Hit-testing a captured drag.** Once `setPointerCapture` runs, `pointermove` keeps arriving on the button, so `event.target` is useless. Test rectangles instead, nearest centre on x, inside a forgiving box:

```js
function hit(x, y) {
  const r = tray.getBoundingClientRect();
  if (y < r.top - 70 || y > r.bottom + 44 || x < r.left - 20 || x > r.right + 20) return -1;
  let best = -1, bd = 1e9;
  items.forEach((el, i) => { const b = el.getBoundingClientRect(), d = Math.abs(b.left + b.width / 2 - x);
    if (d < bd) { bd = d; best = i; } });
  return best;
}
```

**Rolling a count.** Stack old and new numbers in a 16px-tall `overflow: hidden` span and slide both:

```js
ct.innerHTML = up ? `<span>${n - 1}</span><span>${n}</span>` : `<span>${n}</span><span>${n + 1}</span>`;
[...ct.children].forEach(s => s.animate(
  [{ transform: `translateY(${up ? 0 : -16}px)` }, { transform: `translateY(${up ? -16 : 0}px)` }],
  { duration: 320, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' }));
```

Common mistakes: opening the tray on `pointerup` (the gesture then needs two touches); hit-testing with `elementFromPoint` while scaled faces overlap; letting the browser's long-press menu or text selection fire (set `-webkit-touch-callout: none`, `user-select: none` and cancel `contextmenu`); drawing the label inside the scaled face without dividing its size by 1.45.
