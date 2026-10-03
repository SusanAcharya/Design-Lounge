<!-- Design Lounge Nº 187 · "CTA giant email band" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# CTA giant email band

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The last block on the site for **Tallyhook**, an invoicing app for freelancers. The whole band is electric yellow `#FFE600` with black type. A 120px, weight 900 headline reads "GET PAID / BY FRIDAY." on two lines. The word "FRIDAY." is outlined, not filled. Under it, one email field and one black button sit in a single 68px row with a 3px black border. The form checks the address, shows a sending state for 1100ms, then swaps itself for a black success card with a check that draws in. At the same moment the outlined word fills solid black from left to right. That fill is the detail worth copying: the headline itself says "done".

Under the form, three small reassurance items: No card needed, Cancel anytime, 14-day trial. A black ticker strip runs along the bottom. A 200px black stamp with rotating text sits to the right of the headline.

## Reference behaviour

1. First frame: top rule row with "TALLYHOOK" mark on the left, "Invoicing for people who bill by the hour" in the middle, "Trial · 14 days" on the right. A 2px black rule sits under it.
2. The headline is already in place. No entrance animation. "FRIDAY." shows only a 3px black outline.
3. The stamp at the top right of the main block turns once every 24s. Its centre reads "14" over "DAYS".
4. Below the headline: a 20px lede on the left, the form on the right. The field is empty with placeholder `you@studio.co`. The button reads "START FREE TRIAL" with an arrow.
5. Focus the field: the whole 68px row gets a 6px by 6px hard black offset shadow. No blur.
6. Hover the button: the gap between label and arrow grows from 10px to 16px over 160ms.
7. Submit with an empty field: the form does not send. The row border and shadow turn `#B3001B`. The status line under the row reads "Type your email so we can send the login link." in red mono with an 8px red square in front. Focus goes back to the field. The input gets `aria-invalid="true"`.
8. Submit with `mira@studio` (no dot in the domain): same error state. Message: "That address is missing something. Try name@domain.com."
9. Type any character while in error: the error clears at once. Border, shadow, and message reset.
10. Submit a valid address, for example `mira@northlight.studio`: the arrow hides, an 18px spinner shows, the label reads "Sending", the input becomes read-only, the button gets `aria-disabled="true"`. The status line reads "Sending your login link."
11. A second click during sending does nothing.
12. After 1100ms: the form hides. A black card replaces it in the same place. It rises 8px and fades in over 320ms. A 52px check icon draws: circle first (520ms, 80ms delay), then the tick (360ms, 520ms delay).
13. The card says "YOU ARE IN." in 24px weight 900. Under it, in 13px mono: "Your login link went to mira@northlight.studio." and a "Use another email" text button.
14. At the same moment, "FRIDAY." fills black from left to right over 700ms. The stamp's "14" pops to 1.12 scale and back over 500ms.
15. Focus moves to the "YOU ARE IN." heading. The live region announces "You are in. Login link sent to mira@northlight.studio."
16. Click "Use another email": the card hides, the form comes back empty, the label is "Start free trial" again, the outlined word empties, focus goes to the field.
17. The ticker at the bottom scrolls left at one full loop per 48s. It never stops on hover.
18. Reduced motion: the ticker and stamp stop. The fill, the card rise, and the check draw finish in 1ms. The spinner stops turning and shows as a full ring at 60% opacity. Every state still works.

## Structure

```
1280 x 800, padding 40 64 0
+----------------------------------------------------------------------+
| H TALLYHOOK      INVOICING FOR PEOPLE WHO BILL...     TRIAL · 14 DAYS| 12px mono
|======================================================================| 2px rule
|                                                                      |
|  GET PAID                                              ( stamp  )    | 120px / 0.9
|  BY [FRIDAY.] <- outlined 3px                          ( 200px  )    |
|                                                                      |
|  Send the invoice from your     [ you@studio.co    | START FREE  -> ]| 68px row
|  phone, chase it ... 20px       status line 13px mono               |
|  max 30ch                       v No card  v Cancel  v 14-day trial  |
|                                                                      |
|######################################################################| ticker 44px
+----------------------------------------------------------------------+
row: columns 0.9fr / 1.1fr, gap 48px, margin-top 40px
```

- The band is a `section` with `aria-labelledby` pointing at the headline.
- The band is a 3-row grid: top row (auto), main (1fr, content centred), ticker (auto).
- Top row is a `div` with three spans. On phone only the brand stays.
- The headline is an `h2` with two block `span` lines. The outlined word is an inline `em` with `font-style: normal`.
- The stamp is a `div` with `aria-hidden="true"`. Inside: an SVG ring with a `textPath`, and a `b` for "14" with a `small` for "days".
- The lede is a `p`.
- The form is a `form` with `novalidate`. It holds a visually hidden `label`, one `div.field` that wraps the `input type="email"` and the submit `button`.
- The status line is a `p` with `role="status"` and `aria-live="polite"`. It sits after the form, outside it, so it still speaks when the form hides.
- The success card is a `div` with an SVG check, an `h3` with `tabindex="-1"`, and a `p` with a text `button`.
- The reassurance row is a `ul` labelled "Trial terms" with three `li`, each with a 18px check SVG.
- The ticker is a `div` with `aria-hidden="true"`. Its content is written twice so the loop has no gap.

## Tokens

```css
:root {
  /* colour */
  --bg: #ffe600;        /* electric yellow, whole band */
  --ink: #0a0a0a;       /* type, borders, button, ticker */
  --ink-2: #2b2a1f;     /* lede body */
  --paper: #fffbe0;     /* input fill */
  --error: #b3001b;     /* error border, shadow, message */
  --focus: #0a0a0a;     /* focus ring on yellow */
  --placeholder: #6b6850;
  --done-text: #fff6b3; /* small text on the black card */

  /* type */
  --sans: "Archivo", "Helvetica Neue", Arial, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;
  --fs-display: clamp(46px, 9.4vw, 120px);
  --fs-lede: 20px;
  --fs-input: 19px;
  --fs-button: 17px;
  --fs-done: 24px;
  --fs-meta: 13px;
  --fs-top: 12px;

  /* space (8px base) */
  --pad-x: 64px;
  --pad-top: 40px;
  --row-gap: 48px;
  --row-h: 68px;
  --border: 3px;
  --shadow-hard: 6px 6px 0;

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --micro: 160ms;
  --layout: 320ms;
  --hero: 700ms;
  --send: 1100ms;
}
```

No radius anywhere except the stamp and the spinner, which are circles.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Headline | Archivo | clamp(46px, 9.4vw, 120px) | 900 | 0.9 | -0.045em | upper |
| Outlined word | Archivo | same | 900 | same | same | upper, 3px stroke, transparent fill |
| Lede | Archivo | 20px | 500 | 1.4 | 0 | sentence |
| Input | Archivo | 19px | 500 | 1 | 0 | as typed |
| Button | Archivo | 17px | 900 | 1 | 0.01em | upper |
| Success title | Archivo | 24px | 900 | 1.1 | -0.01em | upper |
| Success body | JetBrains Mono | 13px | 500 | 1.5 | 0 | sentence |
| Status line | JetBrains Mono | 13px | 700 | 1.5 | 0.02em | sentence |
| Reassurance | JetBrains Mono | 13px | 700 | 1 | 0.04em | upper |
| Top row | JetBrains Mono | 12px | 700 | 1 | 0.08em | upper |
| Stamp number | Archivo | 64px | 900 | 0.8 | -0.04em | - |
| Stamp ring | JetBrains Mono | 12px | 700 | - | 0.1em | upper |
| Ticker | Archivo | 15px | 900 | 1 | 0.06em | upper |

Load Archivo at 500, 700, 900 and JetBrains Mono at 500, 700 from one Google Fonts link. Two families only.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Delay | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Field focus | focus-within | box-shadow | none → 6px 6px 0 ink | 160ms | --ease | 0 | 1ms |
| Error | invalid submit | border-color, box-shadow | ink → error | 160ms | --ease | 0 | 1ms |
| Button hover | hover | gap | 10px → 16px | 160ms | --ease | 0 | 1ms |
| Spinner | sending | rotate | 0 → 360deg | 700ms loop | linear | 0 | no spin, full ring 60% |
| Success card | success | opacity, translateY | 0, 8px → 1, 0 | 320ms | --expo | 0 | 1ms |
| Check circle | success | stroke-dashoffset | 139 → 0 | 520ms | --ease | 80ms | 1ms |
| Check tick | success | stroke-dashoffset | 30 → 0 | 360ms | --expo | 520ms | 1ms |
| Outlined word fill | success | background-size | 0% 100% → 100% 100% | 700ms | --expo | 0 | 1ms |
| Stamp number | success | scale | 1 → 1.12 → 1 | 500ms | --expo | 0 | 1ms |
| Stamp ring | always | rotate | 0 → 360deg | 24s loop | linear | 0 | stopped |
| Ticker | always | translateX | 0 → -50% | 48s loop | linear | 0 | stopped |

The linear easing on the spinner, ring, and ticker is fine. They are constant loops, not UI moves.

## States

- Field resting: 3px `--ink` border, `--paper` fill, no shadow.
- Field focus: the row keeps its border and gets the hard 6px shadow. The input itself has no outline. The row is the focus signal.
- Field error: border and shadow `--error`. Message in `--error` with an 8px square before it. `aria-invalid="true"` on the input.
- Button hover: arrow moves 6px further from the label.
- Button focus-visible: 3px yellow outline, offset -7px, so it shows inside the black button.
- Button sending: label "Sending", spinner in place of the arrow, `aria-disabled="true"`, cursor `progress`. Do not use the `disabled` attribute, because it drops focus.
- Success: form hidden, black card shown, outlined word filled, live region updated, focus on the card heading.
- Text button in the card: yellow, underlined with 3px offset, yellow focus ring.
- Empty: the first frame. No message, status line holds its 22px height so nothing jumps.

## Accessibility

- The section is named by the headline.
- The input has a real `label` "Work email", visually hidden. The placeholder is not the label.
- The input has `type="email"`, `inputmode="email"`, `autocomplete="email"`, and `aria-describedby` pointing at the status line.
- The form has `novalidate`. The script does the check so the message is in the page, not in a browser bubble.
- The status line is `role="status"` with `aria-live="polite"`. It speaks the error, the sending text, and the success text.
- On error, focus returns to the input.
- On success, focus moves to the card heading (`tabindex="-1"`). The heading has no visible outline because it is not interactive.
- The ticker and stamp are `aria-hidden="true"`. They repeat what the page already says.
- Focus ring: 3px solid ink, offset 3px, on everything except the button (yellow, inset).
- Contrast: `#0a0a0a` on `#ffe600` is about 17:1. `#b3001b` on `#ffe600` is about 5.6:1. `#2b2a1f` on yellow clears 12:1. `#fff6b3` on black clears 18:1.
- Hit targets: the button is 68px tall at desktop and 56px tall on phone. The text button in the card is inline text; it sits on its own line of 13px mono with 1.5 line-height.
- Keyboard: Tab goes field, button. Enter in the field submits. After success, Tab from the heading reaches "Use another email".

## Responsive rules

- ≥1280: as drawn. Padding 40px 64px 0. Headline 120px. Stamp 200px at top right. Row columns 0.9fr / 1.1fr, gap 48px.
- 1024: padding 32px 40px 0. Headline about 96px (the clamp). Stamp 152px, number 48px. Row gap 32px.
- 768 (any width of 900px or less): the row becomes one column, gap 24px, margin-top 28px. Two columns at 768 squeeze the input to a few characters. Lede drops to 18px. The form spans the full width. Stamp stays at 152px, top right.
- <640: padding 24px 20px 0. The top row keeps only the brand. The headline uses clamp(44px, 15.5vw, 92px), about 60px at 390 wide. The outline stroke drops to 2px. The stamp hides. The field stacks: input 56px tall, then the button 56px tall and full width, label centred. The reassurance list becomes a column with 12px gaps.
- Never let the headline overflow. Every grid track is `minmax(0, 1fr)` or a fraction inside `minmax(0, ...)`. At 390 the longest line "BY FRIDAY." must fit inside 350px.
- The ticker runs edge to edge at every size by using a negative margin equal to the side padding.

## Acceptance checklist

### Always

- [ ] One headline on two lines, weight 900, line-height 0.9. Exactly one word is outlined.
- [ ] One email field and one button in a single bordered row. No name field, no second button.
- [ ] Empty and malformed addresses show an inline message under the row and set `aria-invalid`.
- [ ] Sending state shows for at least 1000ms with a spinner and `aria-disabled`, and ignores repeat clicks.
- [ ] Success replaces the form in the same spot. The check circle draws before the tick.
- [ ] The outlined word fills solid on success, and empties again on reset.
- [ ] The status line is a polite live region outside the form.
- [ ] Focus goes to the input on error and to the success heading on success.
- [ ] Three reassurance items under the form, each with a check icon.
- [ ] Reduced motion stops the ticker and stamp and makes every transition 1ms.
- [ ] No horizontal scroll at 390, 768, 1024, 1280.

### This demo

- [ ] Background `#FFE600`, ink `#0A0A0A`, error `#B3001B`, input fill `#FFFBE0`.
- [ ] Headline "GET PAID / BY FRIDAY." with "FRIDAY." outlined at 3px.
- [ ] Button "START FREE TRIAL"; placeholder `you@studio.co`.
- [ ] Reassurance: No card needed · Cancel anytime · 14-day trial.
- [ ] Success title "YOU ARE IN." with the submitted address in the body.
- [ ] Stamp ring text "Free for 14 days · No card ·" twice, turning once per 24s.

## Implementation notes

**The outlined word that fills.** Use a transparent fill with a text stroke, and paint the fill as a background clipped to the text. Grow the background width on success. Do not swap to a second element; the letters would jump.

```css
.out {
  color: transparent;
  -webkit-text-stroke: 3px var(--ink);
  background: linear-gradient(var(--ink), var(--ink)) 0 0 / 0% 100% no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  transition: background-size 700ms var(--expo);
}
.won .out { background-size: 100% 100%; }
```

**The check that draws.** Set a dash array equal to each path's length and animate the offset to 0. The circle r=22 has a length of about 139. The tick is about 30.

```css
.done circle { stroke-dasharray: 139; stroke-dashoffset: 139; animation: draw 520ms var(--ease) 80ms forwards; }
.done path   { stroke-dasharray: 30;  stroke-dashoffset: 30;  animation: draw 360ms var(--expo) 520ms forwards; }
@keyframes draw { to { stroke-dashoffset: 0; } }
```

Because the card is `display: none` until success, the animation starts from the beginning each time the card appears. That is how reset and resubmit replay it.

**The submit flow.**

```js
form.addEventListener('submit', e => {
  e.preventDefault();
  if (sending) return;
  const v = input.value.trim();
  if (!v) return setError('Type your email so we can send the login link.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))
    return setError('That address is missing something. Try name@domain.com.');
  clearError();
  sending = true;
  go.classList.add('busy');
  go.setAttribute('aria-disabled', 'true');
  input.readOnly = true;
  label.textContent = 'Sending';
  msg.textContent = 'Sending your login link.';
  setTimeout(() => {
    band.classList.add('won');
    msg.textContent = 'You are in. Login link sent to ' + v + '.';
    doneTitle.focus();
    sending = false;
  }, 1100);
});
```

In a real product, replace the timer with the request. Keep the 1100ms as a minimum so a fast reply does not flash the spinner.

**The stamp ring.** Put the text on a circle path and force its length so it closes with no gap.

```html
<svg viewBox="0 0 200 200">
  <defs><path id="c" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0"/></defs>
  <text><textPath href="#c" textLength="486" lengthAdjust="spacing">Free for 14 days · No card · Free for 14 days · No card ·</textPath></text>
</svg>
```

Common mistakes:

- Putting the status line inside the form. When the form hides, the success text is never read out.
- Using `disabled` on the button while sending. Focus is lost and screen readers jump to the top.
- A soft blurred shadow on focus. This piece uses a hard 6px offset with no blur.
- Rounded corners on the field or button. Everything is square.
- Animating the headline in on load. The first frame is the finished headline.
- Adding a gradient to the yellow. It is one flat colour.
- Setting the reassurance items in the display face. They are mono, 13px, upper case.
- Letting the giant headline set a fixed pixel size on phones. Use the clamp.
- Showing the browser's own validation bubble. Use `novalidate`.
- More than one outlined word. One word carries the emphasis.

Where it sits:

1. It is the last section before the footer. Do not put it at the top of the page.
2. One per page. Do not repeat it mid-page; use `cta-sticky-mobile-bar` for a persistent prompt on phones.
3. For a darker product, use `cta-split-dark-band` instead of changing this yellow.
4. If a kit is locked, map `--bg` to the kit's loudest surface and keep the ink black for contrast.

Rebuild order:

1. Paint the yellow band and set up the 3-row grid.
2. Place the top row and its 2px rule.
3. Set the headline with the clamp size and outline one word.
4. Build the bordered row with the input and button.
5. Add the status line after the form with `role="status"`.
6. Wire validation, sending, and success.
7. Add the success card with the drawn check, then the word fill.
8. Add the reassurance list, the stamp, and the ticker.
9. Add the responsive steps and check 390 wide for overflow.
10. Turn on reduced motion and confirm every state still works.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
