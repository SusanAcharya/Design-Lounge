<!-- Design Lounge Nº 098 · "Billing plan summary" · designlounge.vercel.app -->

# Billing plan summary

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Keep one primary button and the usage fraction.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

Billing for a small ops tool on the Yard desk plan. Two cards in a grid, max width 880px. The left card names the plan, the price, a renewal date, and a usage bar at 72 percent: 720 of 1,000 runs. Change plan is the only solid button. The right card lists three invoices and an outline button, Download October. Change plan rewrites itself to "Request sent" and disables. This is an account screen, not a marketing pricing table. Do not add three plan columns.

## Structure

```
padding 32px 48px
h1 Billing
grid 1.2fr 0.8fr, gap 16, max-width 880
left card: kicker, plan, price, bar, fraction, primary
right card: kicker, three invoices, outline button
```

- Each card is a `section`.
- Invoices are a `ul`.

## Motion

None. The bar does not animate from 0. It renders at 72 percent. Reduced motion changes nothing.

## States

- Change plan enabled, then disabled with the label Request sent.
- Download stays enabled.
- No error state in the demo. If you add a failed invoice in a product, use `--danger` on that amount only.

## Accessibility

- The usage fraction is text beside the bar. The bar may be `aria-hidden` because the numbers are visible.
- Buttons have visible labels.
- Amounts are not colour-coded. They are all the same ink.
- Contrast of `#152033` on `#fffaf0` is above 4.5.
- Primary ink `#fffaf0` on `#8a6230` must be checked. If a locked kit fails contrast, use the kit's `primaryInk`, not a guess.

## Responsive rules

- At 1280 the grid is 1.2fr and 0.8fr inside 880px.
- At 768 the grid becomes one column, plan card first.
- Below 640 page padding is 20px and both buttons are full width.

## Acceptance checklist

- [ ] Title is Billing.
- [ ] Plan name is Yard desk. Price line is "$48 / month · renews 1 Nov".
- [ ] Bar is 8px tall and 72 percent filled.
- [ ] Fraction reads 720 / 1,000.
- [ ] Three invoices at $48.00.
- [ ] Only Change plan is a solid primary.
- [ ] Change plan becomes "Request sent" and disables.
- [ ] Amounts are IBM Plex Mono. Prose is IBM Plex Sans.
- [ ] There is no three-column pricing comparison.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial usage bar width is 72 percent. The fraction reads 720 / 1,000.
2. Change plan sets its label to Request sent and disables. The plan name does not change.
3. Download October does nothing in the demo. It stays an outline button.
4. Invoice rows are 1 Oct, 1 Sep, 1 Aug, each $48.00, mono, right aligned.
5. No toggle for annual pricing. No comparison grid.
6. Focus ring 2px `--focus`, offset 2px.
7. The bar is decorative for the number. The fraction is the text.

## Tokens

```css
:root {
  --bg: #f4efe4;
  --surface: #fffaf0;
  --surface-2: #efe6d4;
  --ink: #152033;
  --ink-2: #4a5568;
  --ink-3: #7a8494;
  --line: #e4dcc8;
  --primary: #8a6230;
  --primary-ink: #fffaf0;
  --focus: #8a6230;
  --font-text: "IBM Plex Sans", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  --radius: 2px;
}
```

## Typography

- Title: IBM Plex Sans 500, 28px, tracking -0.03em.
- Kicker: 11px, weight 600, uppercase, tracking 0.12em, `--ink-3`.
- Plan name: 22px, weight 500.
- Price line: IBM Plex Mono 13px, `--ink-2`.
- Fraction: mono 12px weight 500 for the numbers. The label "Runs this month" is 12px sans `--ink-2`.
- Invoice date 13px sans. Amount mono 13px.
- Buttons 14px weight 500, height 36, radius 2px.

## Implementation notes

Do not build a plan picker here. Changing plan is a request, not an instant switch.

Rebuild order:

1. Page `#f4efe4`, padding 32px 48px.
2. Title 28px weight 500.
3. Grid gap 16, max-width 880.
4. Cards fill `#fffaf0`, border `#e4dcc8`, radius 2, padding 20.
5. Kicker "Current plan" and "Invoices".
6. Bar track height 8, fill `#efe6d4`. Fill `#8a6230` at width 72%.
7. Invoices separated by 1px `#e4dcc8`, padding 10px 0.
8. Outline button transparent, 1px ink border. Primary fill `#8a6230`, text `#fffaf0`.
9. Margin-top on buttons is 16px.
10. Do not add a credit card form on this screen.

Common mistakes:

- Three pricing tiers.
- An annual toggle.
- Animating the bar on load.
- Making Download the primary.
- A red bar because 72 percent is "high". The bar is primary, not danger.
- Inventing a tax line.
- Using a display serif for the plan name.
- Putting the usage bar on the invoice card.
- A card number field. Payment method is a later screen.
- A green check on each paid invoice.
- Changing the plan name when the request is sent.

Copy you keep, in this order:

1. Title is "Billing".
2. Left kicker is "Current plan".
3. Plan name is "Yard desk".
4. Price line is "$48 / month · renews 1 Nov".
5. Usage label is "Runs this month".
6. Usage value is "720 / 1,000".
7. Bar fill width is 72 percent. Track colour is `#efe6d4`.
8. Primary starts as "Change plan" and becomes "Request sent".
9. Right kicker is "Invoices".
10. Rows are "1 Oct", "1 Sep", "1 Aug".
11. Each amount is "$48.00".
12. Outline button reads "Download October".
13. Grid max width is 880px. Gap is 16px.
14. Card padding is 20px. Radius is 2px.
15. Page padding is 32px 48px until the 640px rule.
16. Do not add a seat count, a tax line, or a card brand.
17. The bar does not change width when the request is sent.
18. Invoice amounts stay right-aligned in mono. Dates stay in the text face.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
