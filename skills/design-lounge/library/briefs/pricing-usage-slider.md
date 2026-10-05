<!-- Design Lounge Nº 466 · "Usage pricing slider" · www.designlounge.live -->

# Usage pricing slider

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The pricing section for "Meterly", a fictional event analytics product that charges by volume. The visitor drags one slider for monthly events, from 10k to 10M on a log scale with 11 snapping ticks. Three plan columns recalculate on every step, the prices count to their new value, and the cheapest plan that fits gets a 2px cobalt border and a "Recommended for 500k" tag. Past the last tick, the section switches to a "Talk to sales" state. The look is Swiss: white, black, one cobalt, mono numbers, 6px radii, hairlines. The detail worth copying: the recommendation is computed from real plan maths, so it moves for a reason, and the slider speaks that reason through `aria-valuetext`.

## Structure

```
1280 × 800, main padding 32 / 64, max-width 1280
┌─────────────────────────────────────────────────────────────────────────┐
│ METERLY PRICING                                                         │ eyebrow, mono 12
│ Pay for the events you send.                          [Monthly|Yearly -20%]
│ Nothing for seats you forget.                                           │ h1 44px, 2 lines
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│ 2px ink rule
│ MONTHLY VOLUME        │ ●━━━━━━━━━━━━━━━━━━[■]────────────────────────  │ 4fr | 8fr, gap 48
│ 500,000 events/month  │ 10k 25k 50k 100k 250k 500k 1M 2.5M 5M 10M 10M+ │ ticks, mono 11
│                                                                         │
│ ┌─Starter──────────┐ ┌[Recommended for 500k]┐ ┌─Scale────────────┐      │ 3 × 1fr, gap 16
│ │ desc             │ │ Growth               │ │                  │      │ card padding 22/24/20
│ │ $139 / month     │ │ $79 / month          │ │ $349 / month     │      │ price 44px mono
│ │ sub line         │ │ sub line             │ │ sub line         │      │
│ │ [Start w Starter]│ │ [■ Start w Growth ■] │ │ [Start w Scale]  │      │ 42px button
│ │ Included   100k  │ │ …                    │ │ …                │      │ 5 rows, 1px rules
│ └──────────────────┘ └──────────────────────┘ └──────────────────┘      │
│ Prices in USD, excluding tax…                                           │ mono 12
└─────────────────────────────────────────────────────────────────────────┘
```

- `main` wraps everything. The header is a `header` with the eyebrow `p`, the `h1`, and the billing `fieldset`.
- Billing toggle: `fieldset` with a visually hidden `legend` "Billing period" and two `label > input[type=radio]`.
- Meter: `section aria-label="Monthly volume"`. The visible `label for="vol"` names the slider. The big readout is `aria-hidden` because `aria-valuetext` already says it.
- Slider: `input type="range" min="0" max="10" step="1"`. The value is a step index, not an event count.
- Ticks: a `div aria-hidden="true"` with 11 absolutely positioned spans.
- Plans: three `article`s, each labelled by its `h2`. Each has a tag `span`, `h2`, description `p`, price `p > b + span`, sub `p`, `button`, and a `dl` of five rows.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Price count | step or billing change | text value | old → new dollars | 420ms | expo out `1 − 2^(−10t)` | jumps to new value |
| Recommended card | recommendation changes | border-color, box-shadow | `--line`, none → `--accent`, 0 0 0 1px `--accent` | 260ms | `--ease` | instant |
| Tag | recommendation changes | opacity, translateY | 0, 4px → 1, 0 | 160ms / 260ms | `--ease` / `--expo` | instant |
| Thumb | pointer down | scale | 1 → 1.12 | 160ms | `--ease` | instant |
| Toggle option | click | background, color | `--soft` → `--ink`, white text | 160ms | `--ease` | instant |
| Buttons | hover | background | white → `--ink` (or cobalt → `#163cb3`) | 160ms | `--ease` | instant |

- Count with `requestAnimationFrame`, not `setInterval`. If a new target arrives mid-count, start from the value on screen now.
- The count is not an odometer. It is one number counting. The digit roll is `pricing-annual-toggle-roll`.
- No motion on first paint.

## States

- Slider thumb: 24×24, 6px radius, white fill, 2px `--ink` border. Track 4px, `--accent` up to the thumb, `--line` after.
- Slider focus-visible: the thumb gets `0 0 0 3px #fff, 0 0 0 5px var(--accent)`.
- Tick current: `--ink`, weight 700, the 6px tick mark turns `--ink`.
- Toggle selected: `--ink` fill, white text. The -20% chip stays cobalt on a white chip.
- Card default: 1px `--line` border, 6px radius.
- Card recommended: cobalt border plus 1px cobalt ring, tag visible, button cobalt fill.
- Card above limit: price "Above plan limit" in `--ink-3` 22px, button disabled with `--soft` fill and `--ink-3` text, `cursor: not-allowed`.
- Sales state: Scale price reads "Custom", no "/ month", button "Talk to sales".
- Button hover: outline buttons fill `--ink` with white text.
- Focus-visible on everything else: 2px solid `--accent`, offset 3px.

## Accessibility

- The slider is a native `input type=range`. Arrow keys move one step, Home and End jump to 10k and 10M+, Page Up and Page Down move by the browser default.
- `aria-valuetext` is set on every change, for example "500,000 events per month. Growth recommended." and on the last step "More than 10 million events per month. Talk to sales."
- `aria-describedby` points to a hidden note: "Ten steps from 10 thousand to 10 million events. The last step is for volumes above 10 million."
- The visible readout and tick labels are `aria-hidden` so the value is not read twice.
- Do not put `aria-live` on the plan grid. It would read three cards on every arrow press. The value text already says which plan fits.
- The tag is `aria-hidden="true"` unless its card is recommended.
- Billing is a radio group in a `fieldset` with a `legend`. Arrow keys move between Monthly and Yearly.
- Disabled buttons use the `disabled` attribute and say why in their text ("Up to 1M events").
- Contrast on white: `--ink-3` 5.3:1, `--ink-2` 8.9:1, cobalt 6.4:1, white on cobalt 6.4:1.
- The slider input is 40px tall so the hit area is larger than the 4px track.

## Responsive rules

- ≥1280: as drawn. Padding 32px top, 64px sides. Meter is 4fr readout and 8fr slider side by side. Three cards in a row. The whole section fits 800px tall.
- 1024 (≤1100px): padding 36px / 40px. Meter gap 32px. Three cards still in a row.
- 768 (≤900px): the meter stacks: readout above, slider below at full width. The cards stack in one column, 20px apart. The h1 drops to 38px and the forced line break goes away.
- <640px: padding 28px / 20px. The header stacks and the toggle sits under the h1, left-aligned. h1 34px. Readout 40px. Tick labels 10px and only every other tick shows (10k, 50k, 250k, 1M, 5M, 10M+), plus the current tick even if it is an odd one.
- Never scroll sideways. Cards use `minmax(0, 1fr)`. Long sub lines wrap.

## Acceptance checklist

### Always

- [ ] One native range input with fixed steps. No free values between ticks.
- [ ] `aria-valuetext` names the volume in words and the recommended plan.
- [ ] Every price is computed from base, included volume and rate. Nothing is hard-coded per step.
- [ ] Exactly one card is recommended at a time, and it is the cheapest one that fits.
- [ ] A plan above its limit shows a disabled button that says the limit.
- [ ] The last step is a sales state with a "Talk to sales" button.
- [ ] Prices count to the new value in about 400ms and jump instantly with reduced motion.
- [ ] All numbers use tabular mono digits.
- [ ] The billing toggle is a radio group with a legend.
- [ ] Focus ring visible on the slider thumb, the toggle and every button.
- [ ] No horizontal scroll at 1280, 1024, 768, 390 or 360.

### This demo

- [ ] Ticks are 10k, 25k, 50k, 100k, 250k, 500k, 1M, 2.5M, 5M, 10M, 10M+.
- [ ] First frame: 500,000 events, Growth recommended, prices $139, $79, $349.
- [ ] At 250k Starter is $64 and recommended. At 2.5M Scale is $349 and recommended.
- [ ] Yearly at 500k shows Growth $63 and "billed $756 yearly".
- [ ] Cobalt is `#1f4fe0`, radius 6px, the rule under the header is 2px `#0b0b0c`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: slider on step 5 of 0–10, which is 500,000 events. Monthly billing. Growth is recommended. Starter shows $139, Growth $79, Scale $349.
2. The readout on the left reads "500,000" at 48px mono, then "events / month".
3. Under the slider, 11 tick labels: 10k, 25k, 50k, 100k, 250k, 500k, 1M, 2.5M, 5M, 10M, 10M+. The current one is black and bold. "10M+" is always cobalt.
4. Dragging or using arrow keys moves one step at a time. There are no values between ticks.
5. Clicking a tick label jumps the slider to that step.
6. On every step change, each available plan's price counts from its old value to its new one over 420ms with an expo-out curve. Digits are tabular so the width does not jitter.
7. The cheapest available plan becomes recommended. Its card border turns cobalt with a 1px cobalt outer ring (2px total), the tag fades in above the top-left corner, and its button fills cobalt. The old recommended card fades back to a grey border over 260ms.
8. Each card's sub line explains the price, for example "$19 base + 400k × $0.30/1k · billed monthly", or "$79 base, all included · billed monthly".
9. When the volume is above a plan's limit, that card shows "Above plan limit" in grey 22px mono, the sub line reads "Starter tops out at 1M events a month.", and the button is disabled with the text "Up to 1M events".
10. Step 10 ("10M+") is the sales state. Readout "10M+". Starter and Growth are above limit. Scale shows "Custom", the sub line "Volume pricing from 10M events, annual contract.", its button reads "Talk to sales", and the tag reads "Recommended above 10M".
11. The Monthly / Yearly toggle is a two-option radio group. Yearly takes 20% off and shows the monthly equivalent; the sub line ends with "billed $X yearly" (the monthly figure × 12). The prices count to the new values.
12. A comparison list sits inside each card under the button: Included events, Then per 1,000, Data retention, Seats, Single sign-on.
13. A mono footnote under the cards: "Prices in USD, excluding tax. Overage is billed per 1,000 events at the end of the month."

Price rule: `price = base + max(0, events − included) / 1000 × rate`, rounded to whole dollars, then × 0.8 for yearly.

| Plan | Base | Included | Per 1k after | Max | Retention | Seats | SSO |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Starter | $19 | 100k | $0.30 | 1M | 7 days | 3 | Not included |
| Growth | $79 | 500k | $0.22 | 5M | 30 days | 10 | Google |
| Scale | $349 | 2.5M | $0.11 | 10M | 90 days | Unlimited | SAML |

Recommendations this gives: 10k to 250k Starter, 500k and 1M Growth, 2.5M to 10M Scale, 10M+ Scale (sales).

## Tokens

```css
:root {
  --bg: #ffffff;          /* page */
  --ink: #0b0b0c;         /* text, rules, selected toggle */
  --ink-2: #4a4a4f;       /* descriptions, labels */
  --ink-3: #6b6b70;       /* ticks, meta, disabled text */
  --line: #dcdcdf;        /* hairlines, track, card border */
  --soft: #f4f4f5;        /* toggle well, disabled button */
  --accent: #1f4fe0;      /* cobalt: fill, recommended, focus */
  --accent-ink: #ffffff;  /* text on cobalt */
  --accent-soft: #eaf0ff; /* -20% chip */

  --sans: "Inter Tight", system-ui, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;

  --r: 6px;
  --s1: 4px; --s2: 8px; --s3: 12px; --s4: 16px; --s5: 24px; --s6: 32px; --s7: 48px; --s8: 64px;

  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --fast: 160ms;
  --layout: 260ms;
  --roll: 420ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Eyebrow | JetBrains Mono | 12px | 500 | 1.45 | 0.08em | upper, `--ink-3` |
| h1 | Inter Tight | 44px | 700 | 1.02 | -0.035em | two lines with a `br` |
| Toggle | Inter Tight | 14px | 600 | 1 | 0 | |
| Readout number | JetBrains Mono | 48px | 700 | 1 | -0.04em | tabular-nums |
| Readout unit | JetBrains Mono | 13px | 400 | 1.45 | 0 | `--ink-2` |
| Tick label | JetBrains Mono | 11px | 400 / 700 current | 1 | 0 | |
| Plan name | Inter Tight | 18px | 700 | 1.2 | -0.01em | |
| Plan description | Inter Tight | 13px | 400 | 1.45 | 0 | `--ink-2` |
| Price | JetBrains Mono | 44px | 700 | 1 | -0.04em | tabular-nums |
| Price unit, sub line | JetBrains Mono | 13px / 12px | 400 | 1.5 | 0 | |
| Compare label / value | Inter Tight 13px / JetBrains Mono 12px | | 400 / 500 | 1.45 | 0 | value right-aligned |
| Tag | JetBrains Mono | 11px | 500 | 18px | 0.02em | white on cobalt |

Every number on the page is mono. Every word that is not a number is Inter Tight, except the eyebrow, ticks and footnote.

## Implementation notes

**1. Step index, not value.** The range input holds 0–10. Map it to events through an array. This gives log-like spacing and exact snapping for free.

```js
const STEPS = [1e4, 2.5e4, 5e4, 1e5, 2.5e5, 5e5, 1e6, 2.5e6, 5e6, 1e7, Infinity];
const cost = (p, v) => p.base + Math.max(0, v - p.inc) / 1000 * p.rate;
function recommend(v) {
  if (v === Infinity) return 'scale';
  let best = null, low = Infinity;
  for (const p of PLANS) if (v <= p.max && cost(p, v) < low) { best = p.id; low = cost(p, v); }
  return best;
}
vol.setAttribute('aria-valuetext', v === Infinity
  ? 'More than 10 million events per month. Talk to sales.'
  : words(v) + ' events per month. ' + name(recommend(v)) + ' recommended.');
```

**2. The count.** Keep the last target per element. If a newer target arrives, the old frame loop stops itself.

```js
const shown = new Map();
function roll(el, to) {
  const from = shown.get(el) ?? to;
  shown.set(el, to);
  if (reduce.matches || from === to) { el.textContent = '$' + fmt(to); return; }
  const t0 = performance.now();
  const step = now => {
    if (shown.get(el) !== to) return;
    const k = Math.min(1, (now - t0) / 420);
    const e = k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
    el.textContent = '$' + fmt(Math.round(from + (to - from) * e));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
```

**3. Filled track and aligned ticks.** Fill the track with a gradient driven by a custom property. Inset the tick row by half the thumb width so each label sits under the thumb centre.

```css
input[type=range] { --p: 50%; -webkit-appearance: none; appearance: none; width: 100%; height: 40px; background: transparent; }
input[type=range]::-webkit-slider-runnable-track { height: 4px; border-radius: 2px;
  background: linear-gradient(90deg, var(--accent) var(--p), var(--line) var(--p)); }
input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; margin-top: -10px;
  border-radius: 6px; background: #fff; border: 2px solid var(--ink); }
.ticks { position: relative; height: 30px; margin: 0 12px; } /* 12px = half the thumb */
.ticks span { position: absolute; transform: translateX(-50%); } /* left: i * 10% */
```

Common mistakes:

- A linear 10k–10M slider. Everything under 1M is crushed into the first tenth.
- Recommending the middle plan always. The point is that the border moves.
- Announcing the plan grid with `aria-live`. It is noisy. Use `aria-valuetext`.
- Showing a price for a plan that cannot serve the volume.
- Letting the price width jump while counting. Use `font-variant-numeric: tabular-nums` and a mono face.
- Changing the border from 1px to 2px and shifting the layout. Keep the 1px border and add a 1px ring with `box-shadow`.
- A purple or gradient "popular" ribbon. The tag is a small cobalt label.

Rebuild order:

1. Tokens and the header with the billing radios.
2. The meter: label, readout, range input, tick row.
3. The plan data and the three cards with their comparison lists.
4. The price function, the recommendation and the sub lines.
5. Above-limit and sales states.
6. The count animation and the border move.
7. `aria-valuetext`, then the breakpoints at 1100, 900 and 639px.
8. Test 250k, 500k, 2.5M and 10M+ in both billing modes.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
