<!-- Design Lounge Nº 334 · "Paper hydration tumbler" · designlounge.vercel.app -->

# Paper hydration tumbler

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A water-intake widget for a fictional habit app called Sipwell, set like a page from a notebook: warm paper, a single hairline-bordered card, a light serif numeral, and one ink button. On the left an outlined tumbler holds the day's water as a blue liquid with a two-layer wave. Tapping "+ 250 ml" logs a glass: the liquid rises toward the new level, and the surface sloshes (a damped tilt plus a bigger wave that settles back to a gentle idle ripple). Undo removes the last glass with a smaller slosh. The detail worth copying is that the slosh is physical, not decorative: the tilt oscillates and decays, so the water looks like it was just poured.

## Reference behaviour

1. Initial state: 1,250 ml logged from five glasses (7:40, 9:15, 11:02, 13:30, 15:10). Liquid at 62.5% of the tumbler. Text: "of 2,000 ml · 750 ml to go". Progress hairline at 62.5%.
2. The surface ripples gently all the time (amplitude 1.6, phase +0.035/frame). A paler back wave runs 2px higher, out of phase, for depth.
3. Click "+ 250 ml": a 250 ml entry is logged at the next simulated time (16:05, then +40 min each). The number updates immediately, the log's newest row slides in from −6px, the progress hairline grows over 600ms.
4. On the same click the liquid eases toward the new level (7% of the remaining distance per frame) and sloshes: wave amplitude jumps to 6.6 and decays back toward 1.6; a tilt of ±9px oscillates and decays with a ~70-frame time constant.
5. At 2,000 ml: text becomes "Goal met · right on 2 L", a cream check appears near the top of the liquid. Over 2 L: "Goal met · 250 ml over"; the liquid stays at the brim.
6. "+ 250 ml" disables at 3,500 ml.
7. Click "Undo": removes the newest entry (any entry, back to zero), steps the simulated clock back 40 min, slosh at 45% strength, liquid falls.
8. Undo is disabled when nothing is logged; the log shows "Nothing logged yet · 0 ml".
9. The log shows the four newest entries, newest first. The header counts all glasses ("5 glasses", "1 glass").
10. A polite live region says "Logged 250 ml. 1,500 of 2,000 ml." or "Removed 250 ml. …".

## Structure

```
1280 × 800, paper #eeeae0
        ┌──────────────── 620px card, 1px #dbd4c5, radius 6 ────────────────┐
        │  padding 36 40 32 28                                               │
        │   ┌──────────┐ ─ 2 L      SIPWELL                       SAT 3 OCT  │
        │   │          │            1,250 ml       76px Spectral 300         │
        │   │          │ ─ 1500     of 2,000 ml · 750 ml to go               │
        │   │~~~~~~~~~~│            ━━━━━━━━━━━━━━──────────  2px bar        │
        │   │██████████│ ─ 1000     [   +  250 ml      ] [ ↶ Undo ]  48px    │
        │   │██████████│ ─ 500      TODAY                        5 GLASSES   │
        │   └──────────┘            15:10                           250 ml   │
        │   200px column            13:30                           250 ml   │
        │   svg 200×270             11:02                           250 ml   │
        │                           9:15                            250 ml   │
        └────────────────────────────────────────────────────────────────────┘
```

- `main.card` grid `200px 1fr`, gap 36px, labelled by the amount.
- `.glass` contains an `svg viewBox="0 0 200 270"` (`aria-hidden`): a `clipPath` of the tumbler interior, a clipped group with the back wave, front wave and a 3px white reflection line, then the outline, rim, tick group and the goal check.
- Tumbler outline: top 20→160 at y=10, tapering to 36→144 at y≈254, 8px rounded base to y=262. Interior clip is inset ~4px.
- Ticks sit outside the right wall at 500 / 1000 / 1500 / 2 L, each a 6px line plus a 10px label.
- `.side`: `p.eyebrow` (brand left, date right), `p.amount`, `p.of`, `.bar`, `.actions` (two buttons), `p.log-h`, `ul.log`.

## Tokens

```css
:root {
  --bg: #eeeae0;         /* paper */
  --card: #f8f6f0;       /* sheet */
  --line: #dbd4c5;       /* hairlines */
  --line-2: #c9c0ae;     /* undo border */
  --ink: #22262a;        /* text, outline, primary button */
  --ink-2: #4f5459;
  --ink-3: #73787c;
  --water: #2f5fd0;      /* the one accent: liquid, progress, focus */
  --water-back: #a9c0ee; /* back wave */
  --serif: "Spectral", Georgia, serif;
  --sans: "Albert Sans", system-ui, sans-serif;
  --r: 6px; --r-btn: 4px;
  --space: 4px 8px 12px 18px 22px 28px 36px;
  --shadow-card: 0 1px 0 #fff inset, 0 24px 40px -32px rgba(34, 38, 42, .35);
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --t-micro: 140ms; --t-row: 320ms; --t-bar: 600ms;
  --goal-ml: 2000; --step-ml: 250; --max-ml: 3500;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Amount | Spectral | 76px | 300 | .9 | −0.03em | lining, tabular nums |
| Unit "ml" | Spectral italic | 24px | 300 | 1 | 0 | `--ink-2` |
| Goal line | Albert Sans | 15px | 400, strong 600 | 1.5 | 0 | — |
| Buttons | Albert Sans | 15px | 600 | 1 | 0 | — |
| Eyebrow / log header | Albert Sans | 11px | 600 | 1 | 0.16em | uppercase, `--ink-3` |
| Log rows | Albert Sans | 14px | 400 | 1.5 | 0 | tabular nums |
| Tick labels | Albert Sans | 10px | 500 | 1 | 0.04em | `--ink-3` |

The serif is used only for the amount and unit. Everything else is the grotesk.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Idle ripple | always (rAF) | wave path d | amplitude 1.6, phase +0.035/frame | continuous | sine | flat surface, no loop |
| Level | add / undo | surface y | old → new | ~0.6s (7%/frame approach) | exponential approach | jumps |
| Slosh wave | add (1.0), undo (0.45) | amplitude | 1.6 + 5×s → 1.6 | ~1.5s (2.5%/frame decay) | exponential | none |
| Slosh tilt | add / undo | linear tilt across width | 9×s × sin(0.16·t) × e^(−t/70) | ~1.2s | damped sine | none |
| Progress bar | add / undo | width | old% → new% | 600ms | expo out | instant |
| New log row | add | opacity, translateY | 0, −6px → 1, 0 | 320ms | expo out | none |
| Goal check | reach 2 L | opacity | 0 → 1 | 320ms | standard | instant |

The idle ripple is calm enough to sit in a grid of other pieces: under 2px of travel.

## States

- Primary hover: ink deepens to #000. Active: scale .98.
- Undo hover: border turns `--ink`. Disabled: `--ink-3` text, `--line` border, not-allowed cursor.
- Add disabled (≥3,500 ml): fill `--line-2`.
- Focus-visible on both buttons: 2px `--water` outline, 3px offset.
- Goal met: `.met` on the glass shows the check; goal line text changes.
- Empty: undo disabled, log placeholder row, liquid at the base.

## Accessibility

- Buttons are real `button`s with visible text ("250 ml" with a plus icon, "Undo" with an arrow icon). Icons are `aria-hidden`.
- The tumbler svg is decorative (`aria-hidden`); the amount and goal line carry the same information as text.
- Live region (polite) announces each add/undo with the running total.
- Undo uses the `disabled` attribute, not just styling.
- Contrast: ink on `#f8f6f0` ≈ 14:1; `#73787c` ≈ 4.5:1 for small caps labels; white button text on ink ≈ 14:1.
- Buttons are 48px tall; Undo is at least 96px wide.

## Responsive rules

- ≥1024: card 620px.
- 768: same.
- <560: single column; tumbler 150px wide centred on top; numeral 60px; buttons and log full width; body gets 24px vertical padding.
- At 375 wide there is no horizontal overflow; the card may scroll vertically in short frames.
- In a home-screen small widget, keep only the tumbler, amount and the add button; move the log to the app.

## Acceptance checklist

### Always

- [ ] Liquid is clipped to the vessel's interior and drawn as two out-of-phase waves.
- [ ] Adding sloshes (bigger wave + damped tilt) and the level eases up; undo sloshes less.
- [ ] Number, goal line, progress hairline and log update in the same click.
- [ ] Undo removes exactly the last entry and is disabled when the log is empty.
- [ ] The add button has a ceiling.
- [ ] Goal-met state changes the copy and shows a mark on the vessel; overflow says how much over.
- [ ] One accent (water blue) used for liquid, progress and focus only.
- [ ] Reduced motion: flat surface, level jumps, no row animation.
- [ ] Live region announces add/undo.

### This demo

- [ ] Brand "Sipwell", date "Sat 3 Oct".
- [ ] Starts at 1,250 ml from five 250 ml glasses at 7:40, 9:15, 11:02, 13:30, 15:10.
- [ ] Goal 2,000 ml, step 250 ml, ceiling 3,500 ml.
- [ ] First new glass is logged at 16:05, then every +40 min.
- [ ] Ticks at 500, 1000, 1500 and "2 L".

## Implementation notes

**The wave path.** Rebuild one path per frame from a sine plus a linear tilt about the vessel's centre, then close it below the base. Clip with the interior shape so the path can be wider than the glass.

```js
function surface(y0, a, ph, tilt) {
  let d = `M0 ${BOTTOM + 10}`;
  for (let x = 0; x <= 200; x += 8) {
    const y = y0 + a * Math.sin(x * 0.045 + ph) + tilt * (x - 90) / 90;
    d += ` L${x} ${y.toFixed(2)}`;
  }
  return d + ` L200 ${BOTTOM + 10} Z`;
}
function frame() {
  level += (target - level) * 0.07;           // ease toward new level
  amp += (1.6 - amp) * 0.025;                 // slosh settles to idle
  phase += 0.035 + amp * 0.004;               // agitated water moves faster
  t++;
  const tilt = tiltA * Math.sin(t * 0.16) * Math.exp(-t / 70);
  front.setAttribute('d', surface(level, amp, phase, tilt));
  back.setAttribute('d', surface(level - 2, amp * .8, phase + 2.2, -tilt * .7));
  requestAnimationFrame(frame);
}
```

**Slosh on input.** `slosh(s)` just kicks the state: `amp = 1.6 + 5*s; tiltA = 9*s; t = 0;`. Add uses 1, undo 0.45. Pause the loop on `visibilitychange`.

**Level mapping.** `levelFor(ml) = BOTTOM − min(1, ml / GOAL) × (BOTTOM − TOP)` with TOP 22 and BOTTOM 256 in svg units. The vessel is the goal; going over doesn't overflow the drawing.

Common mistakes:

- A rectangle progress bar dressed as a glass. The tapered outline and the clip are the point.
- CSS keyframe waves that loop the same way after a tap; the slosh must react to the tap.
- Glassmorphism, gradients in the water, bubbles. Paper-minimal means one flat blue and a white reflection line.
- Undo that only hides the row but keeps the total.
- Using the current wall clock for log times without sorting; simulate or sort.
- Rounding corners to 16px+; this card is 6px, buttons 4px.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
