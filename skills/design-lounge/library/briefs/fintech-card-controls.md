<!-- Design Lounge Nº 581 · "Card controls with frost freeze" · www.designlounge.live -->

# Card controls with frost freeze

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The card settings screen of an invented bank, Tidewell, in an iOS 26 language: a translucent sticky nav bar, inset grouped lists on a warm stone ground, 51×31 switches, SF-like type set in Instrument Sans. At the top sits the physical card drawn in CSS: copper gradient, engraved wave lines, a chip and contactless mark. Freezing the card does not just flip a switch; frost grows across the card from its top-right corner, six-armed crystals settle in with a stagger, and the card's print turns from cream to a deep ice-ink so it reads through the frost. Below: a monthly spending limit slider with a marker for what has already been spent, three where-it-works switches (online, ATM, abroad) and a short list of this week's declined payments with a one-tap fix.

## Structure

```
390 × 844 (54px status area drawn by the Lounge)
┌──────────────────────────────────────┐
│ 54 safe area (bar padding)            │
│ ‹ Cards      Card controls       ···  │ 44  sticky glass bar
├──────────────────────────────────────┤
│ ┌──────────────────────────────────┐ │ 16 side gutter
│ │ Tidewell                  DEBIT  │ │ card 358 × 226 (1.586:1), r16
│ │ [chip] )))                       │ │
│ │ ···· 2290              Valid thru│ │
│ │ NOOR HALVORSEN             08/29 │ │
│ └──────────────────────────────────┘ │
│ ● Frozen since 2:41 pm …             │ status, live
│ ┌ [*] Card frozen            (●  ) ┐ │ group r14
│ SPENDING LIMIT                       │
│ ┌ Per month               $2,400  ┐  │
│ │ $1,186.40 spent … $1,213.60 left │ │
│ │ ━━━━━━━━|━━━━━○──────────────── │ │ 6px track, 28px thumb
│ │ $0     Spent                $5,000│ │
│ WHERE IT WORKS                       │
│ ┌ Online and in apps         (●  ) ┐ │ 60px cells
│ │ ATM withdrawals            (●  ) │ │
│ └ Payments abroad            (  ○) ┘ │
│ DECLINED THIS WEEK                   │
│ ┌ (HA) Halden Air        $412.00  ┐  │
│ │ [Payments abroad are off]        │ │
│ │ [Allow abroad for 24 hours]      │ │
│ └ (PG) Pellmore Games     $59.99  ┘  │
│ footnote                             │
└──────────────────────────────────────┘
```

- `<header class="bar">` sticky, `padding-top: 54px`, `backdrop-filter: blur(18px) saturate(1.6)` over `rgba(239,237,232,.78)`; a 3-column grid with a back `<button>`, `<h1>`, and a 44px more button.
- `.card` (`role="img"`, `aria-label` with the last four digits): engraving SVG (z 0), `.frost` (z 1, holds the crystal SVGs), then the print rows, chip and contactless mark (z 2).
- Each settings row is `.cell`: 32px tinted icon tile, `.txt` (label + sub-line), `<button role="switch" aria-checked>`. Separators are inset 62px from the left, iOS style.
- Limit block: label row with `<output>`, sub-line, `.rng` wrapper containing `<input type="range">`, the spent tick and its label.
- Declines: `.dec` rows with a 36px initials disc, name/amount row, meta line, reason tag, optional action `<button>`.

## Motion

| Element           | Trigger        | Property               | From → To                         | Duration | Easing / delay |
|-------------------|----------------|------------------------|-----------------------------------|---------:|----------------|
| `.frost`          | freeze         | clip-path              | `circle(0% at 92% 8%)` → `circle(150% …)` | 720ms | `--ease-out` |
| `.frost`          | unfreeze       | clip-path              | 150% → 0%                         | 420ms    | `--ease`       |
| Crystals          | freeze         | opacity, transform     | 0, `scale(.4) rotate(-20deg)` → .95, none | 500 / 600ms | `--ease-out`, 120ms + 0/90/160/220ms |
| Crystals          | unfreeze       | same, reversed         |                                   | 420ms    | `--ease`, no stagger |
| Card print colour | freeze toggle  | color                  | `--print` ↔ `--frost-ink`         | 720ms    | `--ease-out`   |
| Chip              | freeze         | filter                 | none → `saturate(.25) brightness(1.15)` | instant with frost | — |
| Card              | press          | transform              | 1 → .985                          | 180ms    | `--spring`     |
| Switch knob       | toggle         | translateX             | 0 → 20px                          | 260ms    | `--spring`     |
| Switch knob       | press          | width                  | 27 → 32px (stretch)               | 0        | —              |
| Switch track      | toggle         | background             | `--off` → `--accent`              | 180ms    | `--ease`       |
| Action button     | press          | transform              | 1 → .96                           | 180ms    | `--spring`     |

Reduced motion: all transitions and delays drop to 1ms. Frost appears and disappears at once; nothing else changes.

## States

- **Frozen:** `body.frozen` (or a frozen flag on the card component). Frost visible, print `--frost-ink`, chip desaturated, status dot `--accent`, row label "Card frozen".
- **Active:** frost clipped to 0%, print `--print`, status dot `--live`.
- **Switch on/off:** `aria-checked="true"` fills `--accent` and moves the knob 20px; off is `--off`, never a pale grey (it must hold 3:1 on the white cell).
- **Slider:** fill `--accent` up to the value (`background-size: var(--p) 100%` over a `--off` background-color); 28px white thumb with a 3px/8px shadow.
- **Over limit:** sub-line swaps to the decline sentence when the limit is under the amount spent.
- **Decline fixed:** action button `disabled`, fill `--accent-wash`, text `--accent`, label "Allowed until tomorrow, 2:41 pm".
- **Focus-visible:** 2px `--accent` outline, 2px offset, on every button, switch and the slider.

## Accessibility

- Switches are `<button role="switch" aria-checked>` labelled by their row label via `aria-labelledby`. Space and Enter toggle (native button behaviour).
- The card is `role="img"` with "Tidewell everyday debit card ending 2290"; tapping it is a shortcut, the switch is the real control.
- The status line is `aria-live="polite"` so freezing and unfreezing are announced.
- The slider keeps native arrow-key stepping ($100) and sets `aria-valuetext` to "$2,400 per month".
- Hit targets: switches 51×31 inside a 60px row, bar buttons 44×44, action button 40px tall with full-width text.
- Contrast: frost-ink on the frosted copper is about 7:1; card print on copper 4.8:1 at the lightest corner (the glow is capped at #AE5230 for that reason); `--off` against `--cell` 3.6:1 for the control edge.

## Responsive rules

- 390: as specified; the screen scrolls, the bar stays sticky and blurs content under it.
- 360: the card keeps 1.586:1 at 328px wide; card number drops to 17px; row sub-lines wrap to two lines.
- Tablet: centre a 440px column on `--bg`; the card stays at that column's width.
- Never scroll sideways; amounts in decline rows stay on the name line, right aligned.

## Acceptance checklist

**Always**
- [ ] The card is drawn, not an image, at a 1.586:1 ratio with a 16px radius.
- [ ] Freezing grows frost from the top-right corner over 720ms; unfreezing retracts it over 420ms.
- [ ] Card text changes to a dark ice ink while frozen and keeps 4.5:1 on the frost.
- [ ] Tapping the card toggles freeze exactly like the switch.
- [ ] Switches are 51×31 with `role="switch"`, and the off track holds 3:1 against the cell.
- [ ] The limit slider shows the amount already spent as a tick on the track.
- [ ] The status line is a polite live region.
- [ ] One filled action button on the screen.
- [ ] Reduced motion removes every transition but keeps both states complete.

**This demo**
- [ ] Bank "Tidewell", card ending 2290, NOOR HALVORSEN, 08/29.
- [ ] Limit starts at $2,400 of $5,000 with $1,186.40 spent and $1,213.60 left.
- [ ] Online and ATM on, Payments abroad off.
- [ ] Halden Air $412.00 decline offers "Allow abroad for 24 hours", which sets "On until Oct 29, 2:41 pm".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: the card is **frozen** (the hero look). Frost covers the card, four crystals are visible, the status line reads "**Frozen** since 2:41 pm. Nothing new can be charged." with a blue dot, the first row reads "Card frozen / Subscriptions and refunds still go through" and its switch is on.
2. Tap the switch, or tap the card itself: the frost retracts into the top-right corner as a shrinking circle (420ms), crystals fade and scale to 0.4, print colour returns to cream, the status line becomes "**Active.** Last used today, Corva Market, $18.40" with a green dot, and the row reads "Freeze card / Stops new purchases. Undo any time".
3. Tap again: frost grows as `circle(0% → 150% at 92% 8%)` over 720ms expo-out; crystals arrive 120ms later, staggered 0 / 90 / 160 / 220ms, each from `scale(.4) rotate(-20deg)` to rest.
4. Drag the spending-limit slider (0 to $5,000, step $100, starts at $2,400): the 28px output updates live; the sub-line reads "$1,186.40 spent since Oct 1 · $1,213.60 left"; drop below $1,186.40 and it reads "$1,186.40 spent. New purchases decline until Nov 1". At 0 the output reads "No spending". A 2×20px ink tick labelled "Spent" marks $1,186.40 on the track.
5. The three where-it-works switches toggle independently. "Payments abroad" starts off; its sub-line reads "Off. Turn on before you travel".
6. In "Declined this week", Halden Air ($412.00, Reykjavik) shows a rust tag "Payments abroad are off" and a filled button "Allow abroad for 24 hours". Tapping it turns the abroad switch on, the sub-line becomes "On until Oct 29, 2:41 pm" and the button disables to "Allowed until tomorrow, 2:41 pm". Turning the switch off by hand restores the button.
7. The second decline (Pellmore Games, $59.99, "Card was frozen") is informational only.

## Tokens

```css
:root {
  /* ground */
  --bg: #EFEDE8;          /* warm stone, grouped background */
  --cell: #FDFCFA;        /* group surface */
  --sep: #E2DED6;         /* inset separators */
  --ink: #1D1B18;
  --ink-2: #5B5650;       /* sub-lines (6.6:1 on cell) */
  --ink-3: #6E6962;       /* section headers, scale (5.0:1 on bg) */

  /* the accent: deep ice blue, used for switches, slider fill, links, the one action */
  --accent: #1F5F8B;
  --accent-wash: #E1ECF4; /* icon tiles, disabled action */
  --off: #8A867F;         /* off switch track and empty slider track (3.6:1 on cell) */

  /* status */
  --live: #2E7D4F;        /* active dot */
  --warn: #9A3B1E;        /* decline tag text */
  --warn-wash: #F6E6DE;   /* decline tag fill */

  /* the card */
  --copper-1: #A84B2A;
  --copper-2: #7A3019;
  --copper-glow: #AE5230;
  --print: #FFF7F2;       /* card text, unfrozen */
  --frost-ink: #12324A;   /* card text, frozen */
  --frost-1: rgba(230, 240, 247, .86);
  --frost-2: rgba(200, 220, 234, .80);

  /* type */
  --font: "Instrument Sans", system-ui, sans-serif;

  /* shape */
  --gutter: 16px;
  --r-group: 14px;
  --r-card: 16px;
  --r-btn: 12px;
  --cell-h: 60px;
  --switch-w: 51px; --switch-h: 31px; --knob: 27px;
  --shadow-card: 0 1px 0 rgba(255,255,255,.25) inset, 0 18px 30px -18px rgba(90,30,10,.6), 0 2px 6px rgba(29,27,24,.12);

  /* motion */
  --t-fast: 180ms;
  --t-knob: 260ms;
  --t-freeze: 720ms;
  --t-thaw: 420ms;
  --spring: cubic-bezier(.32, .72, 0, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

All Instrument Sans, `font-variant-numeric: tabular-nums` on the body.

| Role              | Size | Weight | Line-height | Tracking | Case      |
|-------------------|-----:|-------:|------------:|---------:|-----------|
| Nav title         | 17px | 600    | 1.35        | 0        | Title     |
| Back / bar links  | 17px | 400    | 1.35        | 0        | Title     |
| Row label         | 16px | 600    | 1.35        | 0        | sentence  |
| Row sub-line      | 13px | 400    | 1.35        | 0        | sentence  |
| Section header    | 13px | 600    | 1.35        | +0.04em  | UPPERCASE |
| Limit output      | 28px | 600    | 1.1         | −0.02em  | numerals  |
| Card wordmark     | 17px | 700    | 1           | −0.01em  | Title     |
| Card number       | 19px | 500    | 1           | +0.12em  | numerals  |
| Card name, kind   | 12px | 600    | 1           | +0.10em / +0.14em | UPPERCASE |
| Decline tag       | 12px | 600    | 1.35        | 0        | sentence  |
| Action button     | 15px | 600    | 40px box    | 0        | sentence  |

## Implementation notes

**Frost as a clipped layer between engraving and print.** Order the card's children by z-index so print always sits above the ice, and grow the ice with `clip-path` from the corner:

```css
.card .eng { z-index: 0; }
.frost {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,.35) 46%, transparent 60%),
              linear-gradient(160deg, var(--frost-1), var(--frost-2));
  box-shadow: inset 0 0 24px 6px rgba(255,255,255,.55);
  clip-path: circle(0% at 92% 8%);
  transition: clip-path var(--t-thaw) var(--ease);
}
.frozen .frost { clip-path: circle(150% at 92% 8%); transition: clip-path var(--t-freeze) var(--ease-out); }
.frozen .card { color: var(--frost-ink); }
```

**Staggered crystals with a per-element variable.** Each crystal SVG carries `--d`; only the freezing direction uses it, so thawing is a single quick fade:

```css
.frost svg { opacity: 0; transform: scale(.4) rotate(-20deg); transition: all var(--t-thaw) var(--ease); }
.frozen .frost svg { opacity: .95; transform: none;
  transition: opacity 500ms var(--ease-out) calc(var(--d) + 120ms), transform 600ms var(--ease-out) calc(var(--d) + 120ms); }
```

**Put the spent tick under the thumb's travel, not the track's width.** The thumb centre moves from 14px to `width − 14px`, so offset the tick by the same rule:

```js
const f = SPENT / 5000;
rng.style.setProperty('--s', `calc(${f * 100}% - ${f * 28 - 14}px)`);
```

Common mistakes: a pale grey off-switch that disappears on white; covering the card print with the frost so the number becomes unreadable; animating `backdrop-filter` (expensive, and it blurs the print too).

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
