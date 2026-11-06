---
title: "Lanternfield daily reward"
summary: "A seven-day login calendar: today's tile flips to reveal 250 coins, the coins arc into the wallet, the streak flame grows, and a come-back timer takes over."
platform: mobile-app
type: screen
category: games
tags: [daily-reward, streak, calendar, press, reward]
styles: [playful, dark]
motion: rich
difficulty: 2
featured: false
published: 2026-11-06
palette: ["#0F2B25", "#173A32", "#F4ECD8", "#F2A93B", "#F26B3A"]
fonts: ["Righteous", "Outfit"]
related: [game-cozy-farm-hud, game-gacha-pull-reveal, game-phone-level-results]
---

# Lanternfield daily reward

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The daily login screen of a fictional cozy phone game, Lanternfield. A pine-green sheet holds a streak flame, a 3×2 grid of day tiles and a full-width Day 7 prize tile. Days 1–3 are claimed, Day 4 is today and glows, Days 5–6 wait. One amber Claim button sits in the thumb zone. The language is Material 3 Expressive: tonal surfaces, a 58px pill button, a springy reveal. The detail worth copying is the reward pacing: the tile flips, then five coins arc into the header wallet one after another, then the wallet counts up, then the flame grows and the streak number drops in, and only then does the button turn into the come-back timer. Each beat is noticed because none of them overlap. The missed-day rule is written plainly above the button, not hidden behind an info icon.

## Reference behaviour

1. Initial state: wallet shows 1,240 coins and 36 gems. The streak reads 3 with three coral pips lit out of seven. Day 4 is a cream tile with an amber 2px ring, an amber TODAY tag straddling its top edge, a lantern with a question mark, and "Tap to open". An amber ring pulses outward from it every 1.6s. The button reads **Claim day 4**.
2. Tap the button or the Day 4 tile itself (both do the same thing).
3. 0ms: the tile turns 180° on its Y axis over 600ms (expo out, 700px perspective). The front face hides and the amber back face shows "250 coins" at the 300ms mark. The pulse stops. The button reads "Opening…" and is disabled.
4. 620ms: five coins (26px) leave the centre of the tile, staggered 70ms. Each pops up 24px at 1.15 scale, bends left of the wallet, and lands on the wallet's coin icon at 0.8 scale over 820ms.
5. When the first coin lands, the coin pill bumps to 1.16 scale and back (380ms spring).
6. 1380ms: the coin count rises 1,240 → 1,490 over 520ms with a cubic ease-out.
7. 1900ms: the streak becomes 4. The flame grows from scale 0.93 to 1.00 (640ms spring, origin at its base), the fourth pip lights, and the number 4 rises 14px into place over 520ms.
8. 2320ms: the button becomes a flat green tonal bar reading **Come back in 18:22:40**, counting down once per second. A Replay text button appears under it.
9. Replay cancels every pending timer, resets the wallet, streak and tile, restores **Claim day 4**, and moves focus to it.
10. The rule card reads: "**Miss a day and the week starts again at Day 1.** Anything you already claimed stays yours. A new day begins at 04:00 your time."

## Structure

```
390 × 844 (54 safe top, 34 safe bottom, 20px gutters)
┌──────────────────────────────────────┐
│ 54 safe area                         │
│ (×) Daily lantern   [o 1,240][◆ 36] │  header 44, close 40, pills 34
│                                      │
│  (flame)    3  day                   │  streak row: grid 96px / 1fr
│             streak                   │  number 64px Righteous
│   Best streak 11 days · Week 46      │
│   ▬▬▬▭▭▭▭  (7 pips 24×6)            │
│ ┌────────┐ ┌────────┐ ┌────────┐    │
│ │DAY 1 + │ │DAY 2 + │ │DAY 3 + │    │  tiles 110×124, gap 10, r16
│ │  ◎     │ │  ◎◎    │ │  ◆     │    │
│ │  100   │ │  150   │ │ 1 gem  │    │
│ └────────┘ └────────┘ └────────┘    │
│ ┌[TODAY]─┐ ┌┄┄┄┄┄┄┄┄┐ ┌┄┄┄┄┄┄┄┄┐    │
│ │DAY 4   │ ┆DAY 5   ┆ ┆DAY 6   ┆    │  today: cream + amber ring
│ │  [?]   │ ┆  ◎◎    ┆ ┆  ◆◆    ┆    │  upcoming: dashed border
│ │Tap to… │ ┆  300   ┆ ┆ 3 gems ┆    │
│ └────────┘ └┄┄┄┄┄┄┄┄┘ └┄┄┄┄┄┄┄┄┘    │
│ ┌──────────────────────────────────┐ │
│ │ [chest] DAY 7 · GRAND PRIZE      │ │  coral, 350×112, r18
│ │         Ember chest              │ │
│ │         1 rare lantern skin, …   │ │
│ └──────────────────────────────────┘ │
│ ┌ (clock) Miss a day and the week… ┐ │  rule card, 1px line border
│ └──────────────────────────────────┘ │
│ (          Claim day 4             ) │  58px pill, margin-top:auto
│              ↻ Replay                │  40px, hidden until claimed
└──────────────────────────────────────┘
```

- `<main class="app">` flex column, `max-width:430px`, `padding:54px 20px 34px`.
- `<header>`: close `<button aria-label="Close">`, `<h1>`, `.wallet` with two `.pill` divs (`aria-label="Coins"` / `"Gems"`).
- `<section class="streak">`: inline SVG flame (shadow ellipse + three nested flame paths in a `.lick` group), the count, a meta line, and seven pip `<i>`s.
- `<section class="grid">`: six `.tile`s, each `.tile > .in > .face`. Today's tile has `.tag`, a front `<button class="face front">` and a back `div.face.back`. The Day 7 tile is a plain `div.big` spanning all three columns.
- `<p class="rule">` with a clock icon.
- `.cta`: `<button class="claim">` and `<button class="replay">`.
- A visually hidden `aria-live="polite"` paragraph.

## Tokens

```css
:root {
  /* surfaces */
  --bg: #0F2B25;          /* pine sheet; plus a #1C4A3E radial glow at top centre */
  --panel: #173A32;       /* pills, upcoming tiles, waiting button, close */
  --claimed: #1E4038;     /* claimed tiles */
  --line: #2D5247;        /* rule card border, unlit pips */
  --dash: #4F7A6C;        /* upcoming tile dashed border */
  /* text */
  --ink: #F4ECD8;         /* primary text, today tile front */
  --ink-2: #C9D8CB;       /* secondary text on green (7.6:1 on --claimed) */
  --ink-dark: #1B1410;    /* text on amber, coral and cream */
  /* accents */
  --amber: #F2A93B;       /* today ring, back face, claim button, timer digits, streak number */
  --amber-deep: #B87418;  /* button lip, coin ring */
  --coral: #F26B3A;       /* flame outer, pips, Day 7 tile */
  --leaf: #8FD19E;        /* claimed check, gem */
  /* type */
  --display: "Righteous", system-ui, sans-serif;
  --ui: "Outfit", system-ui, sans-serif;
  --fs-streak: 64px; --fs-title: 20px; --fs-prize: 22px; --fs-button: 20px;
  --fs-reward: 15px; --fs-body: 13px; --fs-label: 12px; --fs-tag: 11px;
  /* space */
  --gutter: 20px; --gap-grid: 10px; --tile-h: 124px; --prize-h: 112px;
  /* radii */
  --r-tile: 16px; --r-prize: 18px; --r-rule: 14px; --r-button: 29px; --r-pill: 17px;
  /* shadows */
  --today-glow: 0 0 0 2px var(--amber), 0 10px 28px -6px rgba(242,169,59,.55);
  --button-lip: 0 4px 0 #B87418;
  /* motion */
  --std: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --arc: cubic-bezier(0.5, 0, 0.3, 1);
  --t-flip: 600ms; --t-coin: 820ms; --coin-stagger: 70ms; --t-count: 520ms; --t-flame: 640ms; --t-pulse: 1600ms;
}
```

## Typography

| Role | Family | Size / line | Weight | Tracking | Case |
|---|---|---|---|---|---|
| Streak number | Righteous | 64px / 0.9 | 400 | 0 | — |
| Screen title | Righteous | 20px / 1 | 400 | 0.01em | sentence |
| Prize name | Righteous | 22px / 1.05 | 400 | 0 | title |
| Claim button | Righteous | 20px / 1 | 400 | 0 | sentence |
| Wallet numbers | Righteous | 16px / 1, tabular | 400 | 0 | — |
| Tile reward | Righteous | 15px / 1.1 | 400 | 0 | sentence |
| Streak label | Outfit | 17px / 1.15 | 600 | 0 | lower |
| Day label | Outfit | 12px / 1 | 600 | 0.1em | upper |
| TODAY tag | Outfit | 11px / 1 | 700 | 0.1em | upper |
| Body, rule, meta | Outfit | 13px / 1.4 | 500 | 0 | sentence |
| Waiting button | Outfit 16px + Righteous 20px digits | 1 | 500 / 400 | 0 | sentence |

## Motion

| What | Trigger | Property | From → to | Duration | Easing | Delay | Reduced motion |
|---|---|---|---|---|---|---|---|
| Today pulse | idle | ring `opacity`, `scale` | 1, 1 → 0, 1.1 | 1600ms loop | `--std` | — | off |
| Flame lick | idle | `scaleY`, `skewX` | 1, 0 → 1.05, −2deg | 1800ms alternate | ease-in-out | — | off |
| Tile flip | claim | `rotateY` | 0 → 180deg | 600ms | `--expo` | 0 | 200ms crossfade of the faces |
| Face swap | claim | `visibility` | front → back | step | — | 300ms | opacity 200ms |
| Coins | claim | translate, scale, opacity | tile → wallet, 0.6 → 1.15 → 0.8 | 820ms each | `--arc` | 620ms + n × 70ms | skipped |
| Wallet bump | first coin lands | `scale` | 1 → 1.16 → 1 | 380ms | `--spring` | — | off |
| Count-up | after coins | text | 1,240 → 1,490 | 520ms | cubic out (rAF) | 1380ms | instant |
| Flame grow | after count | `scale` | 0.93 → 1.00 | 640ms | `--spring` | 1900ms | 200ms |
| Streak number | after count | `translateY`, `opacity` | 14px, 0 → 0, 1 | 520ms | `--spring` | 1900ms | instant |
| Button → timer | last | content swap | Claim → Come back in | instant | — | 2320ms | 650ms |
| Button press | `:active` | `translateY`, lip | 0 → 3px, 4px → 1px | 120ms | `--std` | 0 | same |

Flame scale is `0.72 + streak × 0.07`: 3 days 0.93, 4 days 1.00, 7 days 1.21.

## States

- **Claimed tile**: `--claimed` fill, `--ink-2` text, a 22px leaf check disc at top right with a pine tick. Never dim it with opacity.
- **Today, unclaimed**: cream face, amber ring and glow, pulsing outer ring, TODAY tag.
- **Today, opened**: amber back face, "250 coins", no pulse, `aria-disabled="true"` on the tile button.
- **Upcoming**: `--panel` fill with a 1px dashed `--dash` border and muted icons; text stays `--ink-2`.
- **Prize**: coral tile with a chest; it never changes in this demo.
- **Claim button**: amber with a 4px lip; pressed sinks 3px; "Opening…" while the sequence runs (disabled); waiting state is a flat `--panel` bar with amber tabular digits.
- **Focus-visible**: 3px amber outline, 3px offset.

## Accessibility

- The Day 4 front face is a real `<button>` labelled "Claim day 4, mystery reward"; the back face is `aria-hidden`.
- Claimed tiles carry an `aria-label="Claimed"` check; reward amounts are text, not only icons.
- The live region announces "Day 4 opened: 250 coins.", then "250 coins added. Streak is now 4 days."
- The waiting button carries `aria-label="Claimed. Next reward in 18 hours 22 minutes"` so screen readers do not hear seconds every tick.
- Tab order: Close, Day 4 tile, Claim, Replay. Enter and Space activate.
- Contrast: `--ink-2` on `--claimed` 7.6:1; `--ink-dark` on amber 9.1:1 and on coral 5.9:1; amber digits on `--panel` 6.2:1.
- Hit targets: Close 40×40, tile 110×124, Claim 58px tall, Replay 40px tall.

## Responsive rules

- At 360 wide: tiles become 100px wide, the reward text stays on one line (`white-space:nowrap`, 15px fits "250 coins" in 80px), the prize tile wraps its description to two lines.
- Height under 780: the app keeps `min-height:780px` and scrolls; the button stays last.
- Taller phones: the extra height opens above the button (`margin-top:auto`).
- Tablet: the column caps at 430px and centres on the pine background.

## Acceptance checklist

**Always**
- [ ] Seven days shown: three claimed, one today, two upcoming, one full-width prize tile.
- [ ] Today is the only glowing, pulsing tile, and both the tile and the button claim it.
- [ ] The beats run in order and never overlap: flip, coins, wallet bump, count-up, flame and number, then timer.
- [ ] Coins start at the tile centre and land on the wallet icon, measured with `getBoundingClientRect` at claim time.
- [ ] The flame scale follows `0.72 + streak × 0.07`.
- [ ] After claiming, the button shows a ticking HH:MM:SS countdown and cannot claim again.
- [ ] The missed-day rule is visible on the screen in a sentence, not in a tooltip.
- [ ] Replay clears every pending timeout and restores the first frame.
- [ ] Reduced motion: no flip, no flying coins, no pulse; faces crossfade and numbers update.
- [ ] The back face is `visibility:hidden` until the flip passes 90°.

**This demo**
- [ ] Wallet 1,240 → 1,490 coins; 36 gems unchanged.
- [ ] Rewards: 100, 150, 1 gem, 250 coins, 300, 3 gems, Ember chest.
- [ ] Streak 3 → 4; "Best streak 11 days · Week 46".
- [ ] Countdown starts at 18:22:40.

## Implementation notes

1. **Hide the faces, not just the backface.** `backface-visibility` hides paint but the text still counts as visible to checkers and screen readers. Swap `visibility` at the halfway point of the flip with a delayed transition:

```css
.today .in { transform-style: preserve-3d; transition: transform 600ms var(--expo); }
.today .back { transform: rotateY(180deg); visibility: hidden; }
.today .front, .today .back { transition: visibility 0s 300ms; }
.today.flip .in { transform: rotateY(180deg); }
.today.flip .front { visibility: hidden; }
.today.flip .back { visibility: visible; }
```

2. **Coins on a bent path with the Web Animations API.** Measure both ends at claim time, then animate four keyframes; offset each coin a little so they fan out instead of stacking.

```js
const a = tile.getBoundingClientRect(), b = walletIcon.getBoundingClientRect();
const x0 = a.left + a.width / 2 - 13, y0 = a.top + a.height / 2 - 13;
coin.animate([
  { transform: `translate(${x0 + dx}px,${y0}px) scale(.6)`, opacity: 0 },
  { transform: `translate(${x0 + dx}px,${y0 - 24}px) scale(1.15)`, opacity: 1, offset: .18 },
  { transform: `translate(${b.left - 70 - dx}px,${(y0 + b.top) / 2}px)`, offset: .6 },
  { transform: `translate(${b.left - 2}px,${b.top - 2}px) scale(.8)` }
], { duration: 820, delay: n * 70, easing: 'cubic-bezier(0.5,0,0.3,1)', fill: 'both' });
```

3. **One timeline you can cancel.** Push every `setTimeout` into an array so Replay can clear the whole sequence; otherwise a quick Replay lets a stale "streak 4" land on a reset screen.

```js
const timers = []; const later = (fn, ms) => timers.push(setTimeout(fn, ms));
later(fly, 620); later(countUp, 1380); later(growFlame, 1900); later(showTimer, 2320);
function reset() { timers.forEach(clearTimeout); timers.length = 0; /* restore state */ }
```

Common mistakes: letting the count-up start while coins are still in the air, using a fake-urgency red timer (the countdown here is calm amber on green), and dimming claimed days with `opacity`, which drops their labels below 4.5:1.
