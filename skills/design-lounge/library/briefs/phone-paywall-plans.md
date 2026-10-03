<!-- Design Lounge Nº 315 · "Phone paywall with two plans" · designlounge.vercel.app -->

# Phone paywall with two plans

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Keep the 2px radii. This is the editorial family, not glass.

## What it is

The members screen of Plainsong, a fictional long-read magazine app. It opens when a reader hits the free article limit. It sells one thing: the full archive, offline, with no ads. The headline says that in plain words. Three benefit rows back it up. Two plan cards sit side by side. Yearly starts selected and wears a "Save 38%" tab. A small timeline shows how the 7-day trial works: today, a reminder on day 5, the first charge on day 7. The primary button repeats the price of the selected plan. The worth-copying detail is honesty. The price, the date of the charge, and the way out are all on the first frame.

The look is paper and ink. The page is warm off-white. The display face is a high-contrast serif. Body text is a narrow grotesk. One deep oxblood accent marks the brand word, the selected radio dot, the "Save" tab, the trial rail, and the button. Nothing else is red.

## Reference behaviour

1. First frame: Yearly is checked. The button reads "Start 7-day free trial" with a second line "Then $59.49 a year". The timeline's day 7 line reads "Billed $59.49".
2. The trial rail draws from the Today dot toward Day 5 over 700ms after a 200ms delay. It stops at 34% of the rail. This shows "you are here".
3. Tap Monthly. The Monthly card gets the strong border. Its radio dot fills. The Yearly card goes back to the thin border.
4. On the same tap, the button's second line becomes "Then $7.99 a month". It slides up 4px and fades in over 220ms. The day 7 line becomes "Billed $7.99".
5. A polite live region announces "Selected monthly plan. Then $7.99 a month after the trial."
6. Arrow keys move between the two plans, because they are real radio inputs in one group.
7. Tap the primary button. It turns `--ink-2` and reads "Starting your trial" for 1200ms. It sets `aria-busy="true"`. A second tap during that time does nothing. Then the label returns and the live region says "Trial started. We will remind you on day 5."
8. Tap "Restore purchase". The live region says "No earlier purchase found on this account." In a real product, call the store's restore API here.
9. "Terms" and "Privacy" are buttons in this demo. In a product they open the documents.
10. The close button sits top right. It is always visible. Its label is "Close and keep reading free articles".
11. Nothing on the screen counts down, flashes, or blocks the close button.

## Structure

```
390 × 844, padding max(54px, safe top) 22px max(34px, safe bottom)
┌──────────────────────────────────────┐
│ Plainsong                       [×]  │ 44px row, close 44×44
│ PLAINSONG MEMBERS ────────────────── │ 11px kicker + hairline
│ Read the whole archive.              │ 36px serif, 3 lines
│ Offline, and without ads.            │ "Offline," italic oxblood
│ ──────────────────────────────────── │
│ [ic] 4,212 essays since 2009         │ 3 rows, 1px rules
│      Every issue, searchable…        │
│ [ic] Save issues for the train       │
│ [ic] Read aloud by the writers       │
│ CHOOSE A PLAN                        │
│ ┌────────────────┐┌──────SAVE 38%┐   │ 2 cards, gap 10px,
│ │ ○ Monthly      ││ ● Yearly      │  │ min-height 118px
│ │ $7.99/mo       ││ $59.49/yr     │  │
│ │ Billed every…  ││ $4.96 a month │  │
│ └────────────────┘└───────────────┘  │
│ ● TODAY  Full access starts.         │ timeline, 3 rows
│ ○ DAY 5  We email you a reminder.    │
│ ○ DAY 7  Billed $59.49. Cancel…      │
│                                      │ flexible space
│ [ Start 7-day free trial          ]  │ 54px, two lines
│ [ Then $59.49 a year              ]  │
│ Cancel any time in Settings.         │ 12px
│ Restore purchase · Terms · Privacy   │ 44px link row
└──────────────────────────────────────┘
```

- The page is one `main`, a flex column with `min-height: 100%`.
- The wordmark is decorative, `aria-hidden`. The `h1` is the headline.
- The benefits are a `ul`. Each `li` is a two-column grid: 28px icon, then text.
- The plans are a `fieldset` with a `legend` "Choose a plan". Each card is a `label` that wraps a visually hidden `input type="radio" name="plan"`.
- The timeline is an `ol` with `aria-label="How the free trial works"`.
- The CTA block has `margin-top: auto`, so it sits at the bottom on tall screens.
- The live region is a visually hidden `p role="status" aria-live="polite"`.

## Tokens

```css
:root {
  /* surfaces */
  --bg: #f3eee4;          /* paper */
  --surface: #fbf8f2;     /* plan card */
  --line: #d8cfc0;        /* hairlines, resting card border */
  --line-strong: #1a1714; /* selected card border */
  /* ink */
  --ink: #1a1714;
  --ink-2: #4a433b;
  --ink-3: #6b6358;
  /* accent */
  --accent: #6b1e23;      /* oxblood */
  --accent-press: #561419;
  --accent-soft: #efe1dd;
  --on-accent: #fbf8f2;
  --focus: #6b1e23;
  /* type */
  --display: "Instrument Serif", Georgia, serif;
  --sans: "Inter Tight", system-ui, sans-serif;
  --fs-display: 36px;
  --fs-price: 30px;
  --fs-body: 15px;
  --fs-small: 13px;
  --fs-micro: 11px;
  /* space, 4px base */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px; --s-6: 24px;
  --page-x: 22px;
  /* shape */
  --r: 2px;
  /* motion */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --micro: 160ms;
  --layout: 320ms;
}
```

No shadows. The selected card uses a 1px border plus a 1px inset shadow in `--line-strong`. That reads as a 2px rule without moving the layout.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Wordmark | Instrument Serif | 22px | 400 | 1 | -0.01em | "song" in accent italic |
| Kicker | Inter Tight | 11px | 600 | 1.45 | 0.14em | upper |
| Headline | Instrument Serif | 36px | 400 | 1.02 | -0.02em | sentence |
| Headline stress | Instrument Serif italic | 36px | 400 | 1.02 | -0.02em | accent colour |
| Benefit title | Inter Tight | 14px | 600 | 1.3 | 0 | sentence |
| Benefit line | Inter Tight | 13px | 400 | 1.35 | 0 | `--ink-3` |
| Legend | Inter Tight | 11px | 600 | 1.45 | 0.14em | upper |
| Plan name | Inter Tight | 13px | 600 | 1.45 | 0 | sentence |
| Price | Instrument Serif | 30px | 400 | 1 | -0.02em | tabular lining nums |
| Price unit | Inter Tight | 12px | 400 | 1 | 0 | `--ink-3` |
| Save tab | Inter Tight | 10px | 700 | 1 | 0.1em | upper |
| Timeline label | Inter Tight | 11px | 600 | 1.45 | 0.1em | upper |
| Timeline text | Inter Tight | 13px | 400 | 1.45 | 0 | sentence |
| Button line 1 | Inter Tight | 16px | 600 | 1.2 | 0 | sentence |
| Button line 2 | Inter Tight | 12px | 400 | 1.2 | 0 | 82% opacity |
| Links | Inter Tight | 13px | 500 | 1 | 0 | underlined |

- Load two families only. One Google Fonts link.
- Use `font-variant-numeric: tabular-nums` on every price and on the billed amount.
- The headline is three short lines at 390px. Do not let it run to four. If it does, cut words, not size.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Trial rail | page load, 200ms delay | `transform: scaleY` | 0 → 0.34 | 700ms | `--expo` | shown at 0.34 at once |
| Plan border | radio change | border-color, inset shadow | `--line` → `--line-strong` | 160ms | `--ease` | instant |
| Radio dot | radio change | inner dot `scale` | 0 → 1 | 160ms | `--expo` | instant |
| Button line 2 | radio change | opacity, translateY | 0, 4px → 0.82, 0 | 220ms | `--ease` | instant |
| Button press | `:active` | translateY | 0 → 1px | 160ms | `--ease` | kept, it is 1px |
| Button busy | click | background | `--accent` → `--ink-2` | 160ms | `--ease` | instant |

- Nothing loops.
- Do not animate the price numbers. A price that rolls looks like a trick here.
- Reduced motion: set all durations to 1ms and delays to 0. The rail still ends at 34%.

## States

- Plan resting: `--surface`, 1px `--line` border, dot ring `--ink-3`, empty.
- Plan selected: background `#fffdf8`, border and 1px inset in `--line-strong`, dot ring `--accent`, inner 8px dot `--accent`.
- Plan focus-visible: the whole card gets a 2px `--focus` outline, offset 2px. Use `label:has(input:focus-visible)`.
- Plan hover: no change. A hover tint on a phone card is noise.
- Primary hover: `--accent-press`. Active: 1px down.
- Primary busy: `--ink-2` background, label "Starting your trial", `aria-busy="true"`, clicks ignored.
- Close hover: icon goes from `--ink-2` to `--ink`.
- Link hover: text `--ink`, underline `--ink`. Resting underline is `--line`, offset 4px.
- Error, for a product: if the store fails, put one line under the button in `--accent`: "The store did not answer. Try again." Keep the button enabled.
- Loading prices, for a product: show the cards with the price text as "—" and the button disabled. Never show a button with no price.

## Accessibility

- The plans are native radios in a `fieldset` with a `legend`. Do not rebuild them with `div role="radio"`. Native radios give arrow keys for free.
- Hide the input with `opacity: 0` and 1px size, not `display: none`. It must stay focusable.
- Each card label reads in order: plan name, price, unit, the per-month line. The "Save 38%" tab is text inside the Yearly label, so it is read too.
- The close button has a full sentence label. Readers should know they can leave and still read.
- The live region announces plan changes and trial start. It is polite, never assertive.
- Focus order: close, Monthly or Yearly (one tab stop for the group), primary button, Restore, Terms, Privacy.
- Every control is at least 44×44. The link row buttons are 44px tall with 10px side padding.
- Contrast: `#1a1714` on `#f3eee4` is about 15:1. `#6b6358` on `#f3eee4` is about 5:1. `#fbf8f2` on `#6b1e23` is about 10:1.
- Do not rely on the red alone for the selection. The selected card also has the thicker border and the filled dot.

## Responsive rules

- Frame: 390×844. The content is about 780px tall, so the CTA block sits about 60px above the bottom padding.
- At 360 wide: keep the two cards side by side. Each card is about 153px. The price is 30px and still fits "$59.49/yr". If it does not, drop the price to 26px. Do not stack the cards.
- On short phones (under 740px tall): the page scrolls. The CTA stays in flow. Do not make it sticky over the trial timeline. The reader should see the charge date before the button.
- On tablet width: center a 420px column. Do not stretch the cards across the screen.
- Do not draw a status bar or home indicator. The padding is the clearance.

## Acceptance checklist

### Always

- [ ] The close button is visible on the first frame, top right, 44×44.
- [ ] The headline names the real benefit in one sentence. No "Unlock premium".
- [ ] Exactly three benefit rows, each with a stroke icon, a bold line, and a muted line.
- [ ] Two plan cards side by side, built as native radios in one `fieldset`.
- [ ] One plan is selected on load. Its card has the strong border and the filled dot.
- [ ] The trial timeline has three steps: start, reminder, first charge, with the amount.
- [ ] The primary button's second line names the selected plan's price and period.
- [ ] Changing the plan updates the button and the charge amount in the same frame.
- [ ] "Restore purchase" is present and reachable.
- [ ] Terms and privacy are reachable from the screen.
- [ ] All radii are 2px. One accent colour.
- [ ] Reduced motion leaves every state readable with no movement.

### This demo

- [ ] The product is Plainsong. The kicker reads "Plainsong Members".
- [ ] The headline is "Read the whole archive. Offline, and without ads." with "Offline," italic in `#6b1e23`.
- [ ] Monthly is $7.99/mo. Yearly is $59.49/yr, "$4.96 a month", with a "Save 38%" tab.
- [ ] Yearly is checked on load. The button reads "Then $59.49 a year".
- [ ] The timeline reads Today, Day 5, Day 7, with "Billed $59.49" on Day 7.
- [ ] Background `#f3eee4`, cards `#fbf8f2`, hairlines `#d8cfc0`.

## Implementation notes

Always: compute the "Save" figure and the per-month figure from the store prices. Do not hardcode them. Round the saving down, never up. $59.49 against 12 × $7.99 = $95.88 is a 37.95% saving, which shows as 38%. If your maths gives 37.4%, show 37%.

The card is a label around a hidden radio. Style it with `:has()`:

```css
.plan { position: relative; display: flex; flex-direction: column; min-height: 118px;
  padding: 14px 14px 12px; background: var(--surface);
  border: 1px solid var(--line); border-radius: var(--r); cursor: pointer;
  transition: border-color var(--micro) var(--ease), box-shadow var(--micro) var(--ease); }
.plan input { position: absolute; opacity: 0; width: 1px; height: 1px; margin: 0; }
.plan:has(input:checked) { border-color: var(--line-strong);
  box-shadow: inset 0 0 0 1px var(--line-strong); background: #fffdf8; }
.plan:has(input:focus-visible) { outline: 2px solid var(--focus); outline-offset: 2px; }
.dot::after { content: ""; width: 8px; height: 8px; border-radius: 50%;
  background: var(--accent); transform: scale(0); transition: transform var(--micro) var(--expo); }
.plan:has(input:checked) .dot::after { transform: scale(1); }
```

The "Save" tab sits on the card corner. It shares the card's top right radius:

```css
.save { position: absolute; top: -1px; right: -1px; padding: 4px 7px;
  font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  background: var(--accent); color: var(--on-accent);
  border-radius: 0 var(--r) 0 var(--r); }
```

One change handler drives the button, the timeline, and the live region:

```js
const plans = {
  monthly: { price: '$7.99', then: 'Then $7.99 a month' },
  yearly:  { price: '$59.49', then: 'Then $59.49 a year' }
};
for (const r of document.querySelectorAll('input[name="plan"]')) {
  r.addEventListener('change', () => {
    const p = plans[r.value];
    then.textContent = p.then;
    billed.textContent = p.price;
    go.classList.remove('swap'); void go.offsetWidth; go.classList.add('swap');
    status.textContent = `Selected ${r.value} plan. ${p.then} after the trial.`;
  });
}
```

The trial rail is two pseudo-elements on the `ol`. The grey one is full height. The accent one scales from the top:

```css
.trial { position: relative; list-style: none; padding: 0; }
.trial::before, .trial::after { content: ""; position: absolute; left: 7px;
  top: 10px; width: 1px; height: calc(100% - 20px); background: var(--line); }
.trial::after { background: var(--accent); transform-origin: top;
  animation: rail 700ms var(--expo) 200ms both; }
@keyframes rail { from { transform: scaleY(0); } to { transform: scaleY(.34); } }
```

Common mistakes:

- Hiding the close button for 3 seconds, or making it grey on grey. It stays visible and full contrast.
- A pre-ticked "I agree" box. There is no checkbox here.
- Showing only the per-month price for the yearly plan. Show the full yearly charge first, large. The per-month figure is the small line.
- A countdown timer or "Offer ends tonight". This paywall does not pressure.
- A button that says only "Continue". It names the trial and the price.
- Purple gradients, glow, or a confetti burst on trial start.
- Rounded 16px cards. The family is editorial. Radii are 2px.
- Three plans "to anchor the price". This piece is two plans.
- A sticky CTA that covers the day 7 charge line.
- Drawing a status bar.

Copy rules:

1. The headline says what the reader gets, not what they lose.
2. The benefit lines use numbers where they exist: 4,212 essays, since 2009, every Sunday.
3. The timeline uses the real amount and the real day.
4. The small line under the button says how to cancel and how long it takes.
5. No exclamation marks.

Where it sits:

1. The reader hits the third locked article. This screen slides up as a full-screen modal.
2. Close returns to the article with the first two paragraphs visible.
3. Trial start dismisses the screen and unlocks the article in place.
4. The same screen opens from Settings → Membership. In that case the close label is "Close".
5. Plan comparison for teams belongs on the website. Use `pricing-comparison-sticky` there, not here.
6. A web pricing page with a yearly toggle is `pricing-annual-toggle-roll`.

Rebuild order:

1. Set the page column, the paper background, and the safe padding.
2. Place the wordmark and the close button in a 44px row.
3. Set the kicker, the headline, and the three benefit rows with hairlines.
4. Build the two radio cards in a fieldset. Check Yearly.
5. Build the trial `ol` with the rail.
6. Place the CTA block with `margin-top: auto`.
7. Wire the change handler and the live region.
8. Add the busy state and the restore message.
9. Turn on reduced motion and confirm every state still reads.
10. Map colours onto the locked theme if a kit is on.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
