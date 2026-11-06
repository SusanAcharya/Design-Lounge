<!-- Design Lounge Nº 677 · "Lantern alarm wheel time picker" · www.designlounge.live -->

# Lantern alarm wheel time picker

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The edit screen of a fictional bedside alarm app, Lantern, built around a wheel time picker done properly. Three wheels (hour 1–12, minute 00–59, AM/PM) are true 3D cylinders: each row is rotated 18° per step around a 139px radius under a 900px perspective, so rows lean away and foreshorten instead of just fading. You can drag them, fling them and they glide to a stop exactly on a detent; every detent crossed flashes the two small marks at the ends of the selection band in tomato, a visual stand-in for a haptic tick. Below the picker: "Rings tomorrow in 8 h 22 min", seven repeat-day toggles with a "Weekdays" summary, a label field, sound and snooze rows, and Delete. Warm paper, a book serif for the numerals and a condensed grotesk for labels. The detail worth copying: momentum and snapping are one curve, a cubic ease-out from the release point to the projected detent, so the wheel never coasts and then visibly corrects.

## Structure

```
390 × 844
┌──────────────────────────────────────┐
│ 54px clear                           │
│ Cancel      EDIT ALARM       (SAVE)  │ top 56h: 88 / 1fr / 88
│ ┌──────────────────────────────────┐ │ picker card 284h, r24, #FBF7F0
│ │          3      37               │ │ wheels 264h: hour 96, minute 96,
│ │          4      38               │ │ period 80; colon 14
│ │          5      39               │ │
│ │ ▌        6  :   40     AM      ▐ │ │ band: inset 12, 44h, r14, #E6DCCB
│ │          7      41     PM        │ │ end marks 3px at 8px from edges
│ │          8      42               │ │
│ └──────────────────────────────────┘ │
│ Rings tomorrow in 8 h 22 min         │ 15px, value 600
│ REPEAT                     Weekdays  │ 12px Oswald, 0.16em
│ (S)(M)(T)(W)(T)(F)(S)                │ 44px circles, space-between
│ LABEL                                │
│ [ Ferry to Ilha Verde            ]   │ input 52h r16
│ ┌ Sound            Harbour bell › ┐  │ list rows 56h, r20 card
│ └ Snooze, 9 min            (●══)  ┘  │ switch 52 × 32
│ [          Delete alarm          ]   │ 48h, margin-top auto
└──────────────────────────────────────┘
```

- `div.pick[role=group][aria-label="Alarm time"]` with `div.band[aria-hidden]`, three `div.wheel[role=spinbutton][tabindex=0]` and an `aria-hidden` colon.
- Each wheel holds a pool of 11 `div.it[aria-hidden]` rows that are re-labelled and re-transformed every frame (slot −5…+5 around the rounded position).
- `p.rings[aria-live=polite]`, `h2` labels, `div.days[role=group]` of seven `button[aria-pressed]`, a labelled `input`, `div.list` with a `button.row` and a `button.sw[role=switch]`, `button.del`.

## Motion

| What | Trigger | From → to | Duration / easing | Reduced motion |
|---|---|---|---|---|
| Wheel drag | pointer move | 1 row per 44px, 18° per row | 1:1 | same |
| Fling + snap | release | position → round(pos + v × 320) | clamp(Δ × 70 + 200, 240, 1400)ms, cubic out | jumps to the nearest row, no fling |
| Key / wheel step | keys, mouse wheel | ±1 or ±5 rows | 170ms / 160ms cubic out | instant |
| Detent tick | each row crossed | band scaleY .94, end marks tomato | 120ms `--ease` | none |
| Day toggle | press | scale .88 → 1, fill 160ms | 260ms `--expo` | fill only |
| Switch | press | knob translateX 0 → 20px | 240ms `--expo` | instant |

## States

- **Resting:** band marks `--band-tick`; centre row bold.
- **Moving:** marks flash per detent; the bold row changes as each row crosses centre.
- **AM/PM edge:** dragging past AM or PM resists at one third and glides back.
- **Repeat on / off:** `--ink` fill with `--bg` letter / 1.5px `--edge` outline.
- **Snooze on / off:** `--ink` track, knob right / `#CFC4B4` track, knob left.
- **Focus-visible:** 3px `--tom` outline (inset 2px on wheels so it stays inside the card).

## Accessibility

- Each wheel is `role="spinbutton"` with `aria-label` (Hour, Minute, AM or PM), `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and `aria-valuetext` ("40", "AM"). Rows are `aria-hidden`.
- Keys as in Reference behaviour 6; ←/→ hop between wheels so the whole time can be set without Tab.
- The live region says "Minute 52" after each settle, the sound change and the save; "Rings…" is its own polite region.
- Days have full names as labels ("Monday") and `aria-pressed`; the group is labelled by "Repeat".
- The snooze switch is labelled by its row text.
- Contrast: off-centre rows use a solid colour, not opacity, so every visible row is at least 5:1; white on `--tom` 5.6:1; borders 3.4:1.
- Hit targets: wheels 96 × 264, days 44px, switch 52 × 32 inside a 56px row, Save 40px tall, Delete 48px.

## Responsive rules

- The column caps at 440px; the picker card fills it and the wheels stay 96 / 96 / 80 centred.
- At 360 wide the days stay 44px and the gaps shrink; the wheels keep their widths (total 288px).
- If height is short (under 740px), drop the list card above Delete, not the picker.
- For a 24-hour locale, render 00–23 in the hour wheel and remove the period wheel.

## Acceptance checklist

### Always

- [ ] Rows are placed with `translateZ(−R) rotateX(a) translateZ(R)` at 18° per row under a 900px perspective, R = 22 / tan 9°.
- [ ] A pool of 11 row nodes per wheel is reused; hour and minute wrap.
- [ ] Release projects velocity (last 100ms) to a target detent and glides there in one cubic-out curve.
- [ ] Every detent crossed triggers a visible tick on the band.
- [ ] The period wheel rubber-bands at its ends and clamps.
- [ ] Off-centre rows are dimmed with colour, never opacity, and hidden past 66°.
- [ ] ↑ ↓ PageUp PageDown Home End and ← → work; wheel events step one row per 40px.
- [ ] Each wheel exposes spinbutton value and text.
- [ ] Repeat summary covers Weekdays, Weekends, Every day, Never and lists.
- [ ] Reduced motion: no glide, no tick; values still change.
- [ ] Scroll width is 390 and nothing fixed sits in the top 54px.

### This demo

- [ ] Opens at 6:40 AM, "Rings tomorrow in 8 h 22 min" with now Thursday 22:18.
- [ ] Repeat Monday to Friday, label "Ferry to Ilha Verde", sound "Harbour bell", snooze 9 min on.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: 6 : 40 AM in the band; three rows above and below each wheel visible on the curve. "Rings tomorrow in 8 h 22 min" (now is Thursday 22:18). Repeat M T W T F filled, S S outlined, summary "Weekdays". Label "Ferry to Ilha Verde". Sound "Harbour bell". Snooze on.
2. Drag a wheel: pointer capture; position = start − dy / 44 (one row per 44px), drawn every move. Hour and minute wrap; AM/PM rubber-bands past its ends at one-third of the drag.
3. Release: velocity is measured over the last 100ms of moves (rows per ms). Target = round(position + v × 320). Duration = clamp(|target − position| × 70 + 200, 240, 1400)ms, eased `1 − (1 − k)³`. AM/PM targets clamp to 0–1. If the finger was still for more than 80ms before release, it just settles to the nearest row in 220ms.
4. Each time the rounded position changes (while dragging or gliding), the band plays a 120ms tick: it squashes to scaleY 0.94 and both end marks turn `#B83D27` for 130ms.
5. The centre row is weight 600 in `--ink`; others are 400 in `--dim`. Rows past ±66° are hidden.
6. Keyboard on a focused wheel: ↑/↓ one row (170ms), PageUp/PageDown 5 minutes on the minute wheel (one row elsewhere), Home/End first/last value, ←/→ move focus to the neighbouring wheel. Mouse wheel / trackpad: every 40px of deltaY moves one row (160ms).
7. After each settle, the "rings" line recomputes: the next enabled day at the chosen time, phrased "later today", "tomorrow" or "on Monday", with hours and minutes. No repeat days means the next occurrence of that time.
8. Repeat toggles flip `aria-pressed`, press-squash to 0.88 over 260ms, and update the summary: Weekdays, Weekends, Every day, Never, or "Mon Wed Fri".
9. Sound row cycles Harbour bell → Low reed → Morning gull → Paper chime. Snooze is a switch. Save announces "Alarm saved for 6:40 AM, Weekdays".

## Tokens

```css
:root {
  --bg: #F4EEE4;        /* page */
  --card: #FBF7F0;      /* picker card, list, input */
  --band: #E6DCCB;      /* selection band */
  --band-tick: #D3C3A8; /* band end marks at rest */
  --line: #DDD2C1;      /* card borders, row dividers */
  --ink: #2A2320;       /* centre row, filled days, switch on */
  --ink-2: #5E534A;     /* labels, secondary */
  --dim: #6A5F55;       /* off-centre rows, 5.0:1 on the card */
  --tom: #B83D27;       /* Save, Cancel, ticks, focus */
  --tom-ink: #FFFFFF;
  --edge: #8C7F70;      /* input, day and switch borders, 3.4:1 */
  --serif: "Literata", Georgia, serif;
  --cond: "Oswald", "Arial Narrow", sans-serif;
  --fs-wheel: 27px; --fs-period: 20px; --fs-colon: 28px; --fs-body: 16px; --fs-input: 17px; --fs-rings: 15px; --fs-label: 12px;
  --item: 44px; --step: 18deg; --radius: 139px;   /* 22 / tan(9deg) */
  --perspective: 900px; --wheel-h: 264px; --hide-beyond: 66deg;
  --r-card: 24px; --r-band: 14px; --r-input: 16px; --r-list: 20px; --r-pill: 999px;
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --glide: cubic(1 - (1-k)^3); --t-tick: 120ms; --t-key: 170ms; --t-settle: 220ms;
  --fling-gain: 320; --ms-per-row: 70;
}
```

## Typography

| Role | Family | Size | Weight | Notes |
|---|---|---|---|---|
| Wheel numerals | Literata, opsz 40 | 27px | 400; centre 600 | lining tabular figures |
| Colon | Literata | 28px | 600 | nudged up 2px |
| AM / PM | Oswald | 20px | 500 | 0.08em |
| Title EDIT ALARM, SAVE | Oswald | 15px | 500 / 600 | 0.16em / 0.08em, upper |
| Section labels | Oswald | 12px | 500 | 0.16em, upper; summary 13px 0.06em |
| Day letters | Oswald | 15px | 500 | 0.04em |
| Body, rows, input | Literata | 16–17px | 400–500 | 1.35 |

## Implementation notes

**Draw a wheel from a fractional position.** Slots −5…+5 around the rounded position, each placed on the cylinder by its angle from the true position:

```js
const R = 22 / Math.tan(9 * Math.PI / 180);   // 138.9px for 44px rows at 18deg
function draw(w) {
  const base = Math.round(w.pos), n = w.vals.length;
  w.nodes.forEach((d, s) => {
    const i = base + s - 5, a = (i - w.pos) * 18, ok = w.loop || (i >= 0 && i < n);
    if (!ok || Math.abs(a) > 66) { d.style.visibility = 'hidden'; return; }
    d.style.visibility = ''; d.textContent = w.vals[((i % n) + n) % n];
    d.style.transform = `translateZ(${-R}px) rotateX(${-a}deg) translateZ(${R}px)`;
  });
  if (base !== w.last) { w.last = base; tick(); }
}
```

**Momentum and snap as one curve.**

```js
const v = (last.pos - first.pos) / Math.max(16, last.t - first.t);   // rows per ms over 100ms
const to = Math.round(w.pos + v * 320);
const ms = Math.max(240, Math.min(1400, Math.abs(to - w.pos) * 70 + 200));
glide(w, to, ms);   // rAF, pos = from + (to - from) * (1 - (1 - k) ** 3)
```

**The tick needs a restart.** Remove the class, force a reflow, add it again, or fast flings only flash once:

```js
band.classList.remove('tk'); void band.offsetWidth; band.classList.add('tk');
```

Common mistakes: a CSS `scroll-snap` list with a gradient mask (no real curvature, and the masked rows fail contrast), simulating friction and then snapping separately (a visible correction at the end), creating 60 DOM rows per wheel, and forgetting `user-select: none` so a drag selects the numbers.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
