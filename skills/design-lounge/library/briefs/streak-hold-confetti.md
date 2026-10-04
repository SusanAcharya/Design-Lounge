<!-- Design Lounge Nº 271 · "Hold to log, streak and confetti" · designlounge.vercel.app -->

# Hold to log, streak and confetti

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Studied from 60fps.design, a gallery of mobile micro-interaction clips: this piece takes the streak, reward and "complete confetti" ideas from its games and habit shots and rebuilds them as one working success state. It is the daily screen of a fictional reading app called Paath. The user presses and holds a 64px pill for one second; a gold fill sweeps across it and the label turns dark exactly where the gold has reached. On completion the two-digit streak rolls from 11 to 12 (tens and ones on separate spring timings), a "Longest yet" badge pops, Sunday's dashed ring fills gold with a check, and 26 confetti pieces burst from the number and fall away in 1.6 seconds. The detail worth copying is the restraint: one burst, three colours from the palette, no loop, and the hold gesture means the reward is earned, not tapped by accident.

The language is dark and bookish: deep forest ground, cream type, one gold accent, a chunky display serif for the number and a geometric grotesk for everything else.

## Reference behaviour

1. First frame: "Paath" and "Sunday, 4 October" in the header; a gold flame; "11" at 132px; "DAY READING STREAK"; a week row Mon–Sat filled cream with dark checks and Sun as a dashed gold ring; a card "TODAY · 10 PAGES / Seto Bagh, chapter 4 / Pages 41 to 50 · about 14 minutes"; and a pill "Hold to log today" with a book icon.
2. The number does not roll on load; it appears at 11.
3. Pointer down on the pill: it scales to 0.97 and gains a 6px gold halo at 14% alpha. `navigator.vibrate(10)` fires where available. The pointer is captured.
4. While held, a gold gradient (`#a8802a` → `#f2c14e`) reveals left to right over exactly 1000ms, driven by `requestAnimationFrame`. A dark copy of the label sits inside the gold layer, so text is cream over green and dark over gold, split at the fill edge.
5. Release before 1000ms: the fill drains back to 0 over 450ms with `cubic-bezier(.2,.7,.2,1)`. Nothing is logged. Holding again starts from 0.
6. At 1000ms the action completes without waiting for release:
   - the pill turns solid gold with the label "Logged · 09:46";
   - the tens and ones columns roll to 1 and 2 (700ms spring, ones delayed 60ms);
   - the flame plays a 700ms pop (scale 1.25, rotate -8°);
   - Sunday's ring fills gold and scales to 1.12 (200ms delay), its check appears (320ms delay), then it settles back to 1 (700ms);
   - "Longest yet" scales in from 0.4 (450ms delay);
   - 26 confetti pieces burst upward from the number in a 140° fan and fall under gravity, fading out over the last 40% of 1.6s;
   - a vibration pattern `[12, 40, 18]` fires;
   - a live region says "Logged. 12 day streak, your longest yet."
7. "Undo, I have not read yet" appears under the pill. It restores 11, removes all success states, and returns focus to the pill.
8. Keyboard: holding Space or Enter on the focused pill behaves like holding the pointer; keyup cancels. Key repeat does not restart the timer.
9. Right-click / long-press context menus are suppressed on the pill so a long touch does not open the system menu.

## Structure

```
390 × 844, padding 54 / 20 / 34
┌──────────────────────────────────────┐
│ Paath                Sunday, 4 Octob.│ 44px header
│                                      │ 34px
│                 🜂                   │ flame 44px (SVG)
│                11                    │ 132px serif, 2 rolling columns
│          DAY READING STREAK          │ 13px caps
│            [Longest yet]             │ 30px badge (after success)
│                                      │ 34px
│  ●    ●    ●    ●    ●    ●    ◌     │ 36px dots, 40px columns
│ Mon  Tue  Wed  Thu  Fri  Sat  Sun    │ 12px
│                                      │ (flex gap)
│ ╭──────────────────────────────────╮ │ card r22, padding 18
│ │ TODAY · 10 PAGES                 │ │
│ │ Seto Bagh, chapter 4             │ │ serif 22
│ │ Pages 41 to 50 · about 14 min    │ │
│ │ ╭──────────────────────────────╮ │ │
│ │ │ ▓▓▓▓▓▓▓ 📖 Hold to log today │ │ │ pill 64px
│ │ ╰──────────────────────────────╯ │ │
│ │     Undo, I have not read yet    │ │ 40px link (after success)
│ ╰──────────────────────────────────╯ │
└──────────────────────────────────────┘
Canvas overlay covers the whole app (pointer-events none).
```

- `main.app` is a flex column with `overflow: hidden`; the confetti `canvas` is absolutely positioned over it with `aria-hidden`.
- The hero is a `section` labelled by the "day reading streak" line, which contains a visually hidden "11 " so the label reads "11 day reading streak". The rolling digits are `aria-hidden`.
- Each digit is a `div.col` containing ten `span`s (0–9) stacked; the parent `.num` is 132px tall with `overflow: hidden`.
- The week is an `ol` labelled "This week"; Sunday has `aria-current="date"`.
- The goal card is a `section` labelled "Today's reading" with `small`, `h2`, `p`, the hold `button`, a hidden help line, and the undo `button`.
- Inside the hold button: the cream label, then an `aria-hidden` gold layer containing a dark copy of the label.

## Tokens

```css
:root {
  --bg: #10261f;         /* forest ground */
  --surface: #173229;    /* goal card */
  --surface-2: #1f3d33;  /* hold pill at rest */
  --line: #2a4a3f;       /* borders, empty dot ring */
  --cream: #f6efdf;      /* primary text, past dots */
  --cream-2: #c9c2b0;    /* secondary text */
  --cream-3: #9fae9f;    /* muted text */
  --gold: #f2c14e;       /* accent: flame, today, fill end, badge */
  --gold-deep: #a8802a;  /* fill start */
  --sage: #8fb59a;       /* third confetti colour */
  --serif: "Young Serif", Georgia, serif;
  --sans: "Space Grotesk", system-ui, sans-serif;
  --num: 132px;
  --dot: 36px;
  --hold-h: 64px;
  --r-card: 22px;
  --r-pill: 999px;
  --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 18px; --s-6: 20px; --s-8: 34px;
  --spring: cubic-bezier(.34, 1.56, .64, 1);
  --out: cubic-bezier(.16, 1, .3, 1);
  --std: cubic-bezier(.2, .7, .2, 1);
  --t-hold: 1000ms;
  --t-drain: 450ms;
  --t-roll: 700ms;
  --t-confetti: 1600ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Streak number | Young Serif | 132px | 400 | 1 (132px cells) | -0.04em | tabular |
| Brand | Young Serif | 15px | 400 | 1 | 0.01em | sentence |
| Book title (h2) | Young Serif | 22px | 400 | 1.2 | 0 | sentence |
| Streak unit | Space Grotesk | 13px | 500 | 1.45 | 0.16em | upper |
| Card label | Space Grotesk | 12px | 400 | 1.45 | 0.08em | upper |
| Card body | Space Grotesk | 13px | 400 | 1.45 | 0 | sentence |
| Hold label | Space Grotesk | 16px | 600 | 1 | 0 | sentence |
| Badge | Space Grotesk | 12px | 600 | 1 | 0.04em | sentence |
| Day labels | Space Grotesk | 12px | 400 | 1 | 0 | title |

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Delay | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Pill press | pointerdown / keydown | transform, box-shadow | 1 → 0.97, halo 0 → 6px | 300ms | `--spring` | 0 | no scale |
| Hold fill | while held | clip-path inset right | 100% → 0% | 1000ms | linear (rAF time) | 0 | same (it is the progress) |
| Drain | early release | clip-path | current → 100% | 450ms | `--std` | 0 | instant |
| Tens roll | complete | translateY | -1×cell → -1×cell (no change here) | 700ms | `--spring` | 0 | instant |
| Ones roll | complete | translateY | -1×cell → -2×cell | 700ms | `--spring` | 60ms | instant |
| Flame pop | complete | transform | 1 → 1.25 rotate(-8°) → 1 | 700ms | `--spring` | 0 | none |
| Today fill | complete | background, border, scale | dashed → gold, 1 → 1.12 | 300ms / 500ms | `--std` / `--spring` | 200ms | colour only |
| Today check | complete | opacity, scale | 0, 0.4 → 1, 1 | 400ms | `--spring` | 320ms | opacity only |
| Today settle | complete | transform | 1.12 → 1 | 500ms | `--spring` | 700ms | none |
| Badge | complete | transform, opacity | 0.4, 0 → 1, 1 | 500ms | `--spring` | 450ms | opacity only |
| Confetti | complete | canvas particles | burst, gravity 0.22/frame, drag 0.985 | 1600ms | physics | 0 | not drawn |

The number cells use the same height as the font size so `translateY(-digit × cellHeight)` lands exactly. Measure the cell height from the first span, not from the font size, so it survives font loading.

## States

- Pill resting: `--surface-2` with a 1px `--line` border, cream label.
- Pill held: scale 0.97, gold halo; fill revealing.
- Pill partially filled, released: drains.
- Pill logged: solid gold, dark label "Logged · 09:46", `aria-disabled="true"`, further holds ignored.
- Focus-visible: 2px gold outline, 3px offset, on pill and undo.
- Today ring: dashed gold before, solid gold with dark check after.
- Badge: hidden (scale 0.4, opacity 0) before, shown after.
- Undo: `visibility: hidden` before, shown after (so it is not focusable before).
- Streak broken (not in demo): number in `--cream-3`, flame outlined not filled, and the pill reads "Start again today".

## Accessibility

- The hold button has `aria-describedby` pointing to "Press and hold for one second. Holding Space or Enter also works."
- Keyboard hold is fully supported: keydown starts (ignoring `e.repeat`), keyup cancels.
- The streak number is announced through the hero label ("11 day reading streak"); the visual digits are `aria-hidden`.
- A polite live region announces the result and the undo.
- `aria-current="date"` marks Sunday in the week list.
- The confetti canvas is `aria-hidden` and `pointer-events: none`.
- Contrast: `#f6efdf` on `#10261f` ≈ 14:1; `#10261f` on `#f2c14e` ≈ 10:1; `#9fae9f` on `#10261f` ≈ 6.5:1.
- Hit targets: pill 64px tall full width; undo 40px tall.
- Long-press is a gesture some users cannot perform for a full second. In a product, add a setting to make it a single tap; keep the 1s default.

## Responsive rules

- At 360 wide the week columns stay 40px and the gaps shrink (space-between). The pill stays full width.
- Below 720px tall the number drops to 100px (cells 100px) and the vertical gaps shrink so the card still fits above the home clearance.
- At tablet width, centre a 420px column; do not enlarge the number beyond 132px.
- The canvas re-sizes to the app box at each burst using `devicePixelRatio` capped at 2.
- Do not draw a status bar.

## Acceptance checklist

### Always

- [ ] The action requires a press-and-hold of a fixed duration; early release drains the progress and logs nothing.
- [ ] Text inside the hold control stays readable at every fill level (two label layers split at the fill edge).
- [ ] Completion fires at the end of the hold, not on release.
- [ ] Each digit rolls in its own column; the ones digit lags the tens by about 60ms.
- [ ] The current day indicator fills and settles after a small overshoot.
- [ ] Confetti is one burst of 20–30 pieces in palette colours, lasting under 2s, never looping.
- [ ] Undo restores every state and returns focus to the control.
- [ ] Space/Enter hold works; key repeat is ignored.
- [ ] Reduced motion: no confetti, no roll, no pops; numbers and states still change.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Streak 11 → 12 at 132px Young Serif, "DAY READING STREAK" underneath.
- [ ] Week Mon–Sat done, Sun today.
- [ ] Card "Seto Bagh, chapter 4", "Pages 41 to 50 · about 14 minutes".
- [ ] Pill "Hold to log today" → "Logged · 09:46"; hold time 1000ms.
- [ ] Badge "Longest yet"; confetti colours `#f2c14e`, `#f6efdf`, `#8fb59a`.

## Implementation notes

**1. The hold timer.** Use `requestAnimationFrame` and elapsed time, not `setInterval`. Capture the pointer so moving a finger a few pixels does not cancel.

```js
const HOLD = 1000; let holding = false, t0 = 0, raf = 0;
function frame(t) {
  if (!holding) return;
  const p = Math.min(1, (t - t0) / HOLD);
  bar.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
  if (p >= 1) { holding = false; complete(); return; }
  raf = requestAnimationFrame(frame);
}
function start() { if (done || holding) return; holding = true; bar.style.transition = 'none';
  t0 = performance.now(); raf = requestAnimationFrame(frame); }
function cancel() { if (!holding) return; holding = false; cancelAnimationFrame(raf);
  bar.style.transition = 'clip-path .45s cubic-bezier(.2,.7,.2,1)';
  bar.style.clipPath = 'inset(0 100% 0 0)'; }
hold.onpointerdown = e => { hold.setPointerCapture(e.pointerId); start(); };
['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => hold.addEventListener(ev, cancel));
hold.onkeydown = e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!e.repeat) start(); } };
hold.onkeyup = e => { if (e.key === ' ' || e.key === 'Enter') cancel(); };
```

Common mistake: a `scaleX` fill under one label. The label is unreadable on half the pill. Use a clip-path layer that contains its own dark label.

**2. Rolling digits.** Ten stacked spans per column; move the column.

```js
function showNum(n) {
  const s = String(n).padStart(2, '0');
  const h = tens.firstElementChild.offsetHeight;
  tens.style.transform = `translateY(${-s[0] * h}px)`;
  ones.style.transform = `translateY(${-s[1] * h}px)`;
}
```

```css
.num { height: 132px; overflow: hidden; display: flex; }
.ready .col { transition: transform .7s var(--spring); }
.ready .col + .col { transition-delay: .06s; }
```

Add `.ready` two frames after load so the first paint is not a roll from 00.

**3. Restrained confetti.** One burst on a canvas, 26 particles, simple physics, alpha fade in the last 40%.

```js
const ps = Array.from({ length: 26 }, (_, i) => {
  const a = -Math.PI / 2 + (Math.random() - .5) * 2.4, v = 5 + Math.random() * 5;
  return { x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
           w: 5 + Math.random() * 5, h: 3 + Math.random() * 4,
           r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: colours[i % 4] };
});
const t1 = performance.now();
(function step(t) {
  const k = (t - t1) / 1600; ctx.clearRect(0, 0, W, H); if (k >= 1) return;
  for (const q of ps) { q.vy += .22; q.vx *= .985; q.vy *= .985; q.x += q.vx; q.y += q.vy; q.r += q.vr;
    ctx.save(); ctx.globalAlpha = k < .6 ? 1 : 1 - (k - .6) / .4;
    ctx.translate(q.x, q.y); ctx.rotate(q.r); ctx.fillStyle = q.c;
    ctx.fillRect(-q.w / 2, -q.h / 2, q.w, q.h * Math.abs(Math.cos(q.r * 2)) + 1); ctx.restore(); }
  requestAnimationFrame(step);
})(t1);
```

The `cos(r*2)` height fakes a paper flip. Every fifth piece is a dot for variety.

Common mistakes overall:

- Rainbow confetti or hundreds of pieces. Three palette colours, 26 pieces.
- Confetti that keeps raining. It ends at 1.6s and clears the canvas.
- Triggering the reward on tap. The hold is the point.
- Rolling the number on page load.
- Showing the badge before the number lands; it comes in at 450ms.
- Forgetting `touch-action: none` and the context-menu block, so a long touch selects text or opens a menu.
- A green success colour. Gold is the only accent.

Where it sits: the daily check-in of any habit product (reading, language, workouts). Pair it with a calendar elsewhere; this screen shows only the current week.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
