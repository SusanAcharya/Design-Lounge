<!-- Design Lounge Nº 225 · "Donation page with impact" · designlounge.vercel.app -->

# Donation page with impact

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Keep the impact lines and the honest fee wording whatever the look.

## What it is

The donate page of Saathi Lunch Fund, a fictional charity that cooks school lunches in hill schools in Nepal. On the left is the story: an eyebrow, a large rounded-serif heading, one paragraph, an SVG illustration of hills, a school and a bowl, and a trust row. On the right is the donation card: goal progress, a One-time / Monthly switch, four amount chips, a fee-cover checkbox, and a terracotta Donate button. Recent donors sit under the card. The look is organic and warm: cream paper, terracotta, forest green, a soft serif, a humanist sans, 12px corners. The detail worth copying is that every amount says what it buys, in the chip and again in a green line under the chips: "Rs 1,000 = 8 school lunches."

## Reference behaviour

1. First frame: One-time is on. Rs 1,000 is selected. The impact line reads "Rs 1,000 = 8 school lunches." The button reads "Donate Rs 1,000". The fee box is unticked.
2. The card top shows "Rs 12,46,500" raised "of Rs 18,00,000", a forest bar at 69%, "1,284 donors" and "11 days left". Numbers use Indian grouping (lakh), via `toLocaleString('en-IN')`.
3. The chips are Rs 500, Rs 1,000, Rs 2,500 and Other. Each amount chip has a line under it: "= 4 school lunches", "= 8 school lunches", "= 20 school lunches". One lunch is Rs 125. Other reads "Choose any amount".
4. Switching to Monthly slides the white knob to the right in 260ms. Every impact line adds "every month". The button reads "Donate Rs 1,000 monthly".
5. Rs 2,500 one-time adds ", a month of lunches for one child" to the impact line.
6. Choosing Other shows a "Your amount" field with an Rs prefix, starting at 1,500, and moves focus into it. The impact line updates as you type.
7. Under Rs 100, the impact line reads "Enter at least Rs 100." Pressing Donate then marks the field invalid, shows "The smallest gift is Rs 100." under it in terracotta, and keeps focus in the field.
8. The fee box reads "Add Rs 30 to cover the 3% card fee, so all of your Rs 1,000 reaches the kitchen." The fee is 3% of the gift, rounded. Ticking it adds the fee to the button total: "Donate Rs 1,030".
9. Pressing Donate with a valid amount replaces the form with a thank-you state: a bowl drawing, "Thank you. That is 8 school lunches.", one sentence about when the money arrives, a dashed receipt (Gift, Card fee covered, Charged today), and a "Make another gift" button. Focus moves to the heading.
10. At the same time the raised total grows by the gift, donors goes up by 1, the bar widens over 700ms, and "You · just now" slides in at the top of Recent donors. The list stays at three rows.
11. "Make another gift" brings the form back with the last choices kept and focuses the Donate button.
12. The trust row has three items: the registration number with the council and PAN, an audited report link with file type and size, and the share of each rupee that goes to food.

## Structure

```
1280 × 800, content max-width 1200px, padding-inline 40px
┌──────────────────────────────────────────────────────────────────────────────┐
│ (●) Saathi Lunch Fund                         Our kitchens  Reports  About   │ ~64px
├──────────────────────────────────────────────┬───────────────────────────────┤
│ ● SINDHUPALCHOK · AUTUMN 2026 APPEAL          │ ┌───────────────────────────┐ │
│ A warm lunch keeps a                          │ │ Rs 12,46,500  of 18,00,000│ │
│ child in class all afternoon.  (50px serif)   │ │ ████████████░░░░░  69%     │ │
│ One paragraph, 18px, max 52ch                 │ │ 1,284 donors   11 days left│ │
│ ┌──────────────────────────────────────────┐  │ │ ─────────────────────────  │ │
│ │  SVG: sun, three hills, school, bowl     │  │ │ [ One-time | Monthly ]     │ │
│ │  640 × 250 viewBox                       │  │ │ [Rs 500   ][Rs 1,000 ■]    │ │
│ └──────────────────────────────────────────┘  │ │ [Rs 2,500 ][Other     ]    │ │
│ caption                     Rs 125 = one plate│ │ (bowl) Rs 1,000 = 8 lunches│ │
│ ───────────────────────────────────────────── │ │ ☐ Add Rs 30 to cover fee   │ │
│ [Reg. 41372/079] [Audited 2025/26] [91 paise] │ │ [   Donate Rs 1,000    ]   │ │
│                                               │ └───────────────────────────┘ │
│              minmax(0,1fr)                    │ Recent donors (3)    440px    │
└──────────────────────────────────────────────┴───────────────────────────────┘
```

- `nav` with the logo link and three text links.
- `main.wrap`: a grid `minmax(0,1fr) 440px`, gap 48px, `align-items:start`. The page scrolls; the first frame shows the story, the illustration, and the whole card.
- Left: a `section` with the eyebrow `p`, the only `h1`, the lede `p`, a `figure` holding the SVG (`role="img"` with a full description), a caption row, and a three-column trust grid.
- Right: a `div.card` holding the progress block, a hairline, then a `form` with two `fieldset`s (frequency, amount), the Other field, the impact line, the fee checkbox, the submit button, and a payment note. The thank-you block is a sibling of the form in the same card.
- Under the card: a `section` with an `h2` "Recent donors" and a `ul` of three rows.
- The illustration is inline SVG: a cream sky, a `#e2a35a` sun, three hill paths in `#9db58f`, `#5f8a68`, `#2f5d46`, a dotted terrace line, a school with a terracotta roof, and a terracotta bowl with steam. Keep it to about 15 shapes.

## Tokens

```css
:root {
  /* colour */
  --bg: #f6eedf;          /* cream page */
  --card: #fffbf3;        /* card surface */
  --ink: #2b2118;         /* warm dark brown text */
  --ink-2: #5b4a3c;       /* body text */
  --ink-3: #76614f;       /* captions, meta */
  --line: #e4d5bf;        /* hairlines, chip borders */
  --terra: #b4502c;       /* primary: Donate, selected chip, heading accent */
  --terra-dk: #94401f;    /* hover, error text, selected chip line */
  --terra-tint: #f5e1d2;  /* selected chip fill */
  --forest: #2f5d46;      /* progress, impact, trust icons, focus */
  --forest-tint: #dfe9dc; /* progress track, impact line fill */
  --sun: #e2a35a;         /* illustration only */
  --focus: #2f5d46;

  /* type */
  --serif: "Fraunces", Georgia, serif;      /* font-variation-settings: "SOFT" 100 */
  --sans: "Source Sans 3", system-ui, sans-serif;

  /* space (4px base) */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px; --s-6: 24px; --s-8: 32px; --s-12: 48px;

  /* shape */
  --r: 12px;
  --r-sm: 8px;
  --card-shadow: 0 1px 0 #e9dcc7, 0 18px 40px -28px rgba(80, 48, 20, .35);

  /* motion */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

Load Fraunces with the SOFT axis: `family=Fraunces:opsz,wght,SOFT@9..144,400..600,100`. SOFT 100 rounds the serifs. That is the "rounded serif".

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Hero h1 | Fraunces SOFT 100, opsz 120 | 50px | 500 | 1.04 | -0.025em | max 15ch, last words italic terracotta |
| Raised total | Fraunces SOFT 100 | 30px | 600 | 1.2 | -0.02em | |
| Thank-you h2 | Fraunces SOFT 100 | 28px | 500 | 1.12 | -0.02em | |
| Chip amount | Fraunces SOFT 100 | 22px | 600 | 1.2 | -0.01em | |
| Other input | Fraunces SOFT 100 | 20px | 600 | 1 | 0 | |
| Logo | Fraunces SOFT 100 | 19px | 600 | 1 | -0.01em | |
| Donor amount | Fraunces SOFT 100 | 15px | 600 | 1.3 | 0 | |
| Lede | Source Sans 3 | 18px | 400 | 1.55 | 0 | max 52ch |
| Body, impact | Source Sans 3 | 15–16px | 400 | 1.5 | 0 | impact number bold 700 |
| Button | Source Sans 3 | 18px | 600 | 1 | 0 | |
| Eyebrow | Source Sans 3 | 13px | 600 | 1.4 | 0.06em | upper, forest |
| Chip impact, meta | Source Sans 3 | 12–14px | 400 | 1.4 | 0 | `--ink-3` |

Rule: amounts of money are serif. Explanations are sans.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency knob | switch | `transform: translateX` | 0 → 100% | 260ms | `--ease` | instant |
| Chip | select / hover | border-color, background | line → terra | 160ms | `--ease` | instant |
| Donate | press | `transform: scale` | 1 → 0.985 | 160ms | `--ease` | none |
| Progress bar | after a gift | width | old % → new % | 700ms | `--expo` | instant |
| Thank-you block | after a gift | opacity, translateY | 0, -6px → 1, 0 | 500ms | `--expo` | instant |
| New donor row | after a gift | opacity, translateY | 0, -6px → 1, 0 | 500ms | `--expo` | instant |

No confetti, no count-up on the raised total, no looping illustration.

## States

- Chip resting: white, 1.5px `--line` border, 12px radius. Hover: border `#cdb89b`.
- Chip selected: `--terra-tint` fill, `--terra` border, impact line `--terra-dk`.
- Chip focus-visible: 2px forest outline, offset 2px, on the label (the radio is hidden).
- Frequency switch: a `#f1e7d6` track, 4px padding, a white knob 40px tall with a 1px shadow behind the selected label.
- Other field resting: white, 1.5px `--line` border, 48px tall. Focus: forest border. Invalid: terracotta border and the error line.
- Impact line: forest tint fill, forest text, a 28px bowl icon.
- Fee checkbox: 20px, 6px radius. Ticked: forest fill, white tick.
- Donate hover: `--terra-dk`. Pressed: scale 0.985.
- Thank-you: the form is hidden, the thank-you block shows, the card keeps the progress block on top.
- Recent donors: alternating avatar tints (terracotta, forest). The new "You" row slides in.

## Accessibility

- Frequency and amount are `fieldset` groups with visually hidden legends "How often" and "Amount". The options are native radios inside labels, so arrow keys move between them.
- The Other input has a visible label "Your amount", `inputmode="numeric"`, and `aria-describedby` pointing at the error line. Invalid sets `aria-invalid="true"` on the field wrapper and puts the message in an `aria-live="polite"` line.
- The impact line is `aria-live="polite"`, so a screen reader hears the new impact after each change.
- The progress bar is `role="progressbar"` with `aria-valuenow` and an `aria-valuetext` like "Rs 12,46,500 of Rs 18,00,000, 69 percent".
- After Donate, focus moves to the thank-you heading (`tabindex="-1"`). After "Make another gift", focus returns to Donate.
- The illustration is `role="img"` with a full sentence label. The bowl icons and avatars are `aria-hidden`.
- The audited report is a real link, with type and size in the visible text.
- Contrast: `#76614f` on `#f6eedf` is 5.1:1. `#fffbf3` on `#b4502c` is 4.9:1. `#2f5d46` on `#dfe9dc` is 6.0:1.
- Hit targets: chips at least 64px tall, frequency options 40px, Other field 48px, Donate 54px, Make another gift 44px.

## Responsive rules

- ≥1280: two columns, fluid story and a 440px card, gap 48px. Content max-width 1200px.
- 1100 and below: card 400px, gap 32px, heading 44px.
- 1024: same as 1100.
- 900 and below (covers 768): one column. The story's children and the card share one grid. Order: eyebrow, heading, lede, then the card and recent donors, then the illustration, caption, and trust row. The card is max 560px wide. The nav links hide; the logo stays.
- <640: padding-inline 20px, heading 36px, lede 16px, card padding 18px, trust row stacks to one column, the caption stacks. The chips stay 2 × 2.
- Never scroll sideways. The SVG is `width:100%; height:auto`.

## Acceptance checklist

### Always

- [ ] Every preset amount shows what it buys, in the chip and in one line under the chips.
- [ ] The impact line updates on every change: amount, Other input, frequency.
- [ ] Monthly changes the impact wording and the button label.
- [ ] The fee is opt-in, shows its exact amount, and the button total includes it when ticked.
- [ ] Other has a minimum, a visible error, and keeps focus on failure.
- [ ] Goal progress shows raised, goal, a bar, donors, and days left, with `role="progressbar"`.
- [ ] The thank-you state replaces the form, repeats the impact, shows a receipt, and takes focus.
- [ ] The total and donor count update after a gift. The new donor appears at the top.
- [ ] A trust row with registration, an audited report link, and how money is spent.
- [ ] Two accents: terracotta for action, forest for impact and progress.
- [ ] No horizontal scroll at 390px. The card comes before the illustration on narrow screens.

### This demo

- [ ] Charity "Saathi Lunch Fund", heading "A warm lunch keeps a child in class all afternoon."
- [ ] Chips Rs 500, Rs 1,000, Rs 2,500, Other. Rs 1,000 starts selected. One lunch is Rs 125.
- [ ] Raised Rs 12,46,500 of Rs 18,00,000, 1,284 donors, 11 days left.
- [ ] Fee is 3%. Minimum gift is Rs 100.
- [ ] Trust row reads Reg. 41372/079, Audited 2025/26, 91 paise in every rupee.
- [ ] Radius 12px. Terracotta `#b4502c`. Forest `#2f5d46`. Page `#f6eedf`.

## Implementation notes

**1. One state, one paint.** Keep frequency, the chosen chip, and the fee box in one place, and repaint every dependent line from it. Do not let the button and the impact line drift apart.

```js
const PLATE = 125;
const nf = n => n.toLocaleString('en-IN');
const impact = (n, monthly) => {
  const p = Math.floor(n / PLATE);
  return p < 1 ? 'less than one lunch'
    : `${p} school lunch${p > 1 ? 'es' : ''}${monthly ? ' every month' : ''}`;
};
function paint() {
  const m = state.freq === 'month', a = amount(), fee = Math.round(a * 0.03);
  const total = a + (feeBox.checked ? fee : 0);
  chipLines.forEach(el => (el.textContent = '= ' + impact(+el.dataset.a, m)));
  impactLine.innerHTML = a >= 100 ? `Rs ${nf(a)}${m ? ' a month' : ''} = <b>${impact(a, m)}</b>.`
                                  : 'Enter at least Rs 100.';
  feeText.textContent = `Add Rs ${nf(fee)} to cover the 3% card fee, so all of your Rs ${nf(a)} reaches the kitchen.`;
  donate.textContent = `Donate Rs ${nf(total)}${m ? ' monthly' : ''}`;
}
```

**2. Chips as radios.** Keep native radios for the keyboard and style the label with `:has()`.

```css
.chip { position: relative; display: block; padding: 12px 14px;
  border: 1.5px solid var(--line); border-radius: 12px; background: #fff; cursor: pointer; }
.chip input { position: absolute; opacity: 0; pointer-events: none; }
.chip:has(input:checked) { border-color: var(--terra); background: var(--terra-tint); }
.chip:has(input:focus-visible) { outline: 2px solid var(--focus); outline-offset: 2px; }
```

**3. Card first on phones without moving markup.** Flatten the story column into the grid and reorder.

```css
@media (max-width: 900px) {
  .wrap { grid-template-columns: minmax(0, 1fr); gap: 0; }
  .story { display: contents; }
  .art, .cap, .trust { order: 3; }
  .side { order: 2; max-width: 560px; width: 100%; margin: 4px 0 32px; }
}
```

Common mistakes:

- Amount chips with no impact. The whole point is "Rs 1,000 = 8 school lunches".
- Pre-ticking the fee box. It is the donor's choice.
- A fee line that says "a small fee" with no number.
- Western grouping (1,800,000) on a rupee page. Use `en-IN`: 18,00,000.
- A thank-you that is a toast. Replace the form and move focus.
- Purple or blue gradients. This page is cream, terracotta, and forest.
- Pure white page. The page is cream; only the chips and inputs are white.
- A stock-photo hero. The illustration is a few flat SVG shapes in the palette.
- Sharp corners. Every surface is 12px; the switch inner pieces are 6–8px.
- A count-up animation on the raised total. The bar moving is enough.

Rebuild order:

1. Set the nav and the two-column grid.
2. Write the story text and draw the SVG illustration.
3. Add the caption and the trust row.
4. Build the card: progress block, switch, chips, Other field.
5. Write `paint()` and wire every input to it.
6. Add the fee checkbox and the button total.
7. Add validation for Other.
8. Build the thank-you state, the receipt, and the donor list update.
9. Add the 900 and <640 layouts and check 390px for sideways scroll.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
