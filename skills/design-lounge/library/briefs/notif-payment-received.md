<!-- Design Lounge Nº 329 · "Payment received banner" · designlounge.vercel.app -->

# Payment received banner

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The money-in moment of "Pocketful", a fictional wallet app, in a Material 3 Expressive language. A white 32px-radius banner springs down at the top of the home screen. Its amount counts up from €0 to €1,240.00, and a moment later the balance card below counts up too, with a new row in Recent. Under the amount are the sender and their note and two pill buttons. "View receipt" unfolds a perforated slip inside the banner. "Split" opens a bottom sheet to request shares from flatmates. Under the banner, three older notifications sit as a grouped stack, offset and scaled like a deck. Tap the deck and they fan out into a list with a staggered spring. The detail worth copying is that the banner lives **in the page flow**. Opening the receipt or fanning the stack pushes the app down, and dismissing the banner closes the gap smoothly. Nothing ever covers the balance it just changed.

## Reference behaviour

1. Frame: a cool tonal page `#f4f5fb`. The banner region starts 54px from the top with 10px side insets.
2. 200ms after load, the banner springs in from translateY(−130%) scale(.9) over 620ms (`cubic-bezier(.34,1.45,.64,1)`). Its 40px icon container morphs from a 12px rounded square rotated −45° to a 50% / 50% / 50% / 14px "drop" shape.
3. Banner content:
   - The header row: the drop icon (a down arrow), "Payment received", "· now", and a 40px dismiss button.
   - The amount: a green superscript "+", then "€1,240" in Funnel Display 46px/800, with ".00" at 62% size in muted ink. It counts up from 0 over 900ms with expo-out, starting 120ms after arrival.
   - From: a 32px marigold avatar "AV", "Anouk de Vries", and "“Lisbon flat, October share”".
   - Two 48px pills: "View receipt" (filled cobalt, receipt icon) and "Split" (tonal, split icon).
4. 900ms after arrival, the balance card counts from €3,182.40 to €4,422.40 over 900ms. Its chip "+€0.00 today" turns marigold and reads "+€1,240.00 today". A row "Anouk de Vries · Transfer · now · +€1,240.00" springs into the top of Recent.
5. The polite live region says "Payment received. 1,240 euros from Anouk de Vries."
6. Under the banner sits the grouped stack. The top card is "Salary from Harrowgate Studio", "Yesterday · move 10% to Savings?", "+€2,850", with an unread dot. Behind it are two cards at translateY 9px and 18px, scaled .95 and .90. A dark "+2" badge hangs off the bottom right.
7. Tap the stack: the cards fan out into a list with 8px gaps over 500ms with the spring, staggered 45ms top to bottom. A header "Earlier · Pocketful" and a "Show less ⌃" pill fade in above. The container height animates over 450ms and pushes the app down. The badge fades. The other two cards are "Tilde Café · Card ··4471 · 08:12 · −€4.20" and "Your week in money · Spent €212, 18% less than usual".
8. In the fanned list, tapping a card marks it read: its dot disappears and the live region says "Tilde Café, marked read."
9. Show less, or Escape, folds the deck back (stagger reversed, 30ms) and moves focus to the top card.
10. View receipt: the button reads "Hide receipt" and squares its corners to 14px. A slip unfolds below the buttons (grid rows 0fr → 1fr, 420ms). It has a perforated top edge and these rows: Date "Thu 8 Oct, 11:42", Method "Instant transfer", Fee "€0.00", Into "Everyday ··4471", Reference "PKF-8Q2M-7701". Opening the receipt folds the stack if it was open.
11. Split: a scrim dims the app to 28% and a bottom sheet slides up over 420ms. It holds "Split €1,240.00" and "Who shares the Lisbon flat with you?", then chips: You (locked on), Mireille (on), Kofi (on), Sander (off). Below a rule is "Each of 3 pays €413.33", then "Cancel" and "Request from 2".
12. Toggling chips updates the per-person amount live (Sander on gives "Each of 4 pays €310.00" and "Request from 3"). With nobody but you, the button disables and reads "Pick someone". A selected chip fills tonal and rounds from 14px to 22px.
13. Request: the sheet closes and a marigold note appears in the banner: "Requested €310.00 each from Mireille, Kofi and Sander". The Split button reads "Split sent".
14. Dismiss (×): the banner slides up and fades over 340ms, then its row closes (grid rows 1fr → 0fr, 420ms). The stack slides up to 54px from the top and the app follows. A dark "Replay payment" pill appears near the bottom and takes focus.
15. Replay runs from step 2.

## Structure

```
390 × 844 (Lounge draws status bar)
┌──────────────────────────────────────┐
│ (54px)                               │
│ ┌──────────────────────────────────┐ │ banner, inset 10, r 32, white
│ │ (↓) Payment received · now   (×) │ │ 40px row
│ │ +€1,240.00                       │ │ 46px / 800
│ │ (AV) Anouk de Vries              │ │
│ │      “Lisbon flat, October share”│ │
│ │ [ View receipt ] [   Split    ]  │ │ 48px pills, 8px gap
│ │ ┌ ◡◡◡◡◡◡◡◡◡◡◡◡◡◡◡◡◡◡◡◡◡◡◡◡◡◡ ┐  │ │ receipt slip (collapsible)
│ │ │ Date  ...  Reference ...    │  │ │
│ └──────────────────────────────────┘ │
│   ┌──────────────────────────────┐   │ grouped stack, inset 16
│   │(HS) Salary from Harrowgate… ●│   │ 64px cards
│   └──────────────────────────────┘═+2│ two cards peeking 9 / 18px
│ ┌──────────────────────────────────┐ │ app (in flow, pushed down)
│ │ Everyday · EUR                   │ │ balance card, cobalt, r 32
│ │ €4,422.40      [+€1,240.00 today]│ │
│ └──────────────────────────────────┘ │
│ [→] [←] [+] [▭]  Send Request …      │ quick actions
│ Recent: Anouk / Tilde Café / …       │
└──────────────────────────────────────┘
bottom sheet (Split): r 32 32 0 0, padding 10 20 34
```

- The overlay region is the first child of `body`, in normal flow: `.bw` (grid-rows wrapper) > `.pad` (54px 10px 16px) > `section.ban`. After it come `.sw` > `.stack`, and then `main.app`.
- The banner is a `section role="region"` labelled by "Payment received".
- The amount is a `p` with `aria-label="Plus 1,240 euros"`, so screen readers do not hear the counting digits.
- "View receipt" is a `button aria-expanded aria-controls="rc"`. "Split" is `aria-haspopup="dialog"`.
- The stack is a `div` holding three `button.card`s positioned absolutely by JS. While collapsed, only the top card is focusable. Its label is "Earlier notifications, 3. Show all".
- The split sheet is `section role="dialog" aria-modal="true"`. While it is open, the overlay and app are `inert`. People are `button aria-pressed` chips.

## Tokens

```css
:root {
  /* tonal surfaces */
  --surface: #f4f5fb;
  --s-low: #eceef8;      /* receipt slip, hovers */
  --s-high: #e2e5f3;     /* quick action tiles, avatar tiles */
  --s-top: #ffffff;      /* banner, cards, sheet */
  --on: #161a2e;
  --on-2: #454b66;
  --on-3: #6a7090;
  --outline: #c7cbe0;

  /* roles */
  --primary: #2341d9;    /* filled button, balance card */
  --on-primary: #ffffff;
  --p-cont: #dce1ff;     /* tonal button, icon container, selected chip */
  --on-p-cont: #0a1a6e;
  --tert: #ffb23f;       /* sender avatar, "today" chip */
  --on-tert: #3d2500;
  --t-cont: #ffe2b8;     /* split note, Request tile */
  --good: #0e7a4a;       /* "+", incoming amounts */
  --focus: #2341d9;

  --display: "Funnel Display", system-ui, sans-serif;
  --sans: "Funnel Sans", system-ui, sans-serif;

  --r-banner: 32px;
  --r-card: 22px;
  --r-pill: 24px;
  --r-pill-pressed: 14px;
  --btn-h: 48px;

  --emph: cubic-bezier(.2, 0, 0, 1);        /* M3 emphasized: layout */
  --spring: cubic-bezier(.34, 1.45, .64, 1); /* arrival, fan-out, shape morphs */
  --sheet: cubic-bezier(.32, .72, 0, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

Banner shadow: `0 1px 0 var(--outline), 0 18px 40px -14px rgba(22,26,46,.35)`. Card shadow: `0 1px 0 var(--outline), 0 10px 24px -14px rgba(22,26,46,.4)`.

## Typography

| Role | Family | Size | Weight | Line-height | Notes |
| --- | --- | ---: | ---: | ---: | --- |
| Amount | Funnel Display | 46px | 800 | 1.05 | −0.03em, tabular, cents at .62em 700 |
| Balance | Funnel Display | 44px | 700 | 1 | −0.02em, tabular |
| Sheet title | Funnel Display | 24px | 700 | 1.1 | |
| Per-person amount | Funnel Display | 32px | 800 | 1 | |
| Section heads | Funnel Display | 13–14px | 600 | 1.2 | |
| Buttons | Funnel Sans | 15px | 600 | 1 | |
| Body, sender | Funnel Sans | 15px | 400–600 | 1.4 | |
| Banner header, meta | Funnel Sans | 13px | 500–600 | 1.4 | |
| Card title / sub | Funnel Sans | 14.5 / 13px | 600 / 400 | 1.3 | one line, ellipsis |
| Reference | ui-monospace | 12.5px | 600 | 1 | 0.02em |

Use one family at two optical cuts. Display is for money and headings, Sans for everything you read.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Banner | arrive | translateY, scale, opacity | −130%, .9, 0 → 0, 1, 1 | 620ms | `--spring` | 1ms |
| Icon container | arrive | radius, rotate | 12px, −45° → drop, 0 | 600ms | `--spring` | 1ms |
| Amount | arrive +120ms | count | 0 → 1240.00 | 900ms | expo-out (JS) | final value at once |
| Balance | arrive +900ms | count | 3182.40 → 4422.40 | 900ms | expo-out (JS) | final value at once |
| Recent row | balance lands | translateY, opacity | −8px, 0 → 0, 1 | 500ms | `--spring` | none |
| Banner | dismiss | translateY, scale, opacity | → −130%, .94, 0 | 340ms | `--emph` | 1ms |
| Banner row | dismiss +260ms | grid rows | 1fr → 0fr | 420ms | `--emph` | 1ms |
| Receipt | toggle | grid rows | 0fr ↔ 1fr | 420ms | `--emph` | 1ms |
| Stack cards | fan out | translateY, scale | deck → list | 500ms, +45ms per card | `--spring` | 1ms |
| Stack cards | fold | translateY, scale | list → deck | 500ms, reverse 30ms stagger | `--spring` | 1ms |
| Stack height | fan / fold | height | H+18 ↔ 44+3(H+8) | 450ms | `--emph` | 1ms |
| Sheet | open | translateY | 105% → 0 | 420ms | `--sheet` | 1ms |
| Pills, chips | press / select | radius | 24 → 14px / 14 → 22px | 250ms | `--spring` | 1ms |

The springs overshoot once, by about 4%, and then settle. Nothing loops.

## States

- Banner: arriving, resting, receipt open ("Hide receipt", squared pill), split sent (marigold note, "Split sent"), dismissed (row closed, "Replay payment" shown).
- Stack: collapsed (top card focusable, "+2" badge, back cards ignore pointer events), fanned (all cards focusable, header and "Show less" visible), card read (no dot).
- Sheet chips: off (1px outline, 14px radius), on (`--p-cont` fill, 22px radius, avatar cobalt), locked "You" (70% opacity, `aria-disabled`).
- Request button: enabled "Request from N", disabled "Pick someone" (`--s-high` fill, `--on-3` text).
- Hover: filled pill `#1a35bf`, tonal pill `#cbd2ff`, dismiss button `--s-low`.
- Focus-visible: 3px cobalt outline, 2px offset.

## Accessibility

- The banner is a labelled region. Arrival is announced once, politely, with the final amount, never the counting digits. The amount carries `aria-label="Plus 1,240 euros"`.
- "View receipt" reports `aria-expanded`. The slip is a `dl`, so each label pairs with its value.
- The collapsed stack exposes one button, "Earlier notifications, 3. Show all". After fanning, focus moves to the first card and each card reads its own title. Show less and Escape fold it and return focus.
- Split is a modal dialog: the app and banner go `inert`, focus starts on the first chip, Escape or Cancel closes, and focus returns to the Split button. The result is announced: "Requests sent to Mireille, Kofi and Sander. €310.00 each."
- Chips use `aria-pressed`. "You" is `aria-disabled` and not in the tab order.
- Dismiss moves focus to "Replay payment".
- Hit targets: pills 48px, dismiss 40px, cards 64px, chips 44px, "Show less" 36px tall and wide enough at 104px.
- Contrast: `#161a2e` on white is about 17:1, `#6a7090` on white about 4.9:1, white on `#2341d9` about 7:1, `#3d2500` on `#ffe2b8` about 12:1, and `#0e7a4a` on white about 5.4:1.

## Responsive rules

- 390 × 844: as specified.
- 360 wide: the amount drops to 40px and the quick-action tiles to 56px. Card titles ellipsise. Chips wrap to two rows.
- Short phones: the app scrolls under the banner region. The banner and stack never overlap the balance, because they are in flow.
- Tablet: the banner caps at 420px wide and centres at the top. The split sheet becomes a 420px centred dialog.
- Do not draw a status bar. The 54px is clearance.

## Acceptance checklist

### Always

- [ ] The banner is in the document flow. Opening the receipt or fanning the stack pushes content down, and dismissing closes the gap.
- [ ] The amount counts up once, with tabular figures, and the balance it affects updates after it.
- [ ] Two actions: a filled primary (receipt) and a tonal secondary (split).
- [ ] The receipt unfolds inside the banner with label and value pairs and a reference.
- [ ] The split sheet recalculates the share live and disables the request when nobody is chosen.
- [ ] Grouped notifications show as a deck with a count and fan out with a staggered spring. "Show less" folds them.
- [ ] Only the top card of a collapsed deck is focusable.
- [ ] Screen readers hear the final amount once, never the count.
- [ ] Hit targets are 44px or more, except "Show less" at 36px. Focus rings are 3px.
- [ ] Reduced motion shows final numbers at once and removes the springs.

### This demo

- [ ] "Pocketful", +€1,240.00 from "Anouk de Vries", note "Lisbon flat, October share".
- [ ] Balance €3,182.40 → €4,422.40, chip "+€1,240.00 today".
- [ ] Stack: Harrowgate Studio salary +€2,850, Tilde Café −€4.20, "Your week in money".
- [ ] Split people: You, Mireille, Kofi (on), Sander (off). The default is "Each of 3 pays €413.33".
- [ ] Reference "PKF-8Q2M-7701", into "Everyday ··4471".
- [ ] Cobalt `#2341d9`, marigold `#ffb23f`, page `#f4f5fb`, banner radius 32px.

## Implementation notes

**Count up with rAF and expo-out, and label the final value.**

```js
function countUp(el, from, to, dur = 900) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return draw(to);
  const t0 = performance.now();
  requestAnimationFrame(function f(now) {
    const k = Math.min(1, (now - t0) / dur), e = k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
    draw(from + (to - from) * e);
    if (k < 1) requestAnimationFrame(f);
  });
  function draw(v) { el.textContent = '€' + v.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
}
```

Set `font-variant-numeric: tabular-nums` on the number, or the width wobbles every frame.

**Deck to list with one layout function.** Position the cards absolutely and compute the transforms. Let the container's height transition push the page.

```js
function layout(open) {
  const H = cards[0].offsetHeight, G = 8, TOP = open ? 44 : 0;
  cards.forEach((c, i) => {
    c.style.zIndex = cards.length - i;
    c.style.transitionDelay = (open ? i * 45 : (cards.length - 1 - i) * 30) + 'ms';
    c.style.transform = open ? `translateY(${TOP + i * (H + G)}px)` : `translateY(${i * 9}px) scale(${1 - i * .05})`;
    c.tabIndex = open || i === 0 ? 0 : -1;
  });
  stack.style.height = (open ? TOP + cards.length * (H + G) : H + 18) + 'px';
}
```

Use `transform-origin: 50% 0` on the cards so the scaled ones peek from the bottom edge.

**Dismiss in two beats.** First slide the banner out (340ms). Then, 260ms in, collapse its wrapper with `grid-template-rows: 1fr → 0fr`. Removing the node at once makes the page jump. To replay, reset the banner transform with `transition: none`, reopen the wrapper, then slide in.

**Split maths.** Floor to the cent per person (`Math.floor(total / n * 100) / 100`) and let the requester absorb the remainder. €1,240 / 3 is €413.33 each, and you keep €413.34.

Common mistakes:

- An overlay banner that covers the balance it just changed.
- Counting the balance and the amount at the same time. The amount lands first.
- Fanning the stack with no height change, so the cards spill over the content below.
- Announcing "€1,238.33…" while counting.
- A split sheet without a live per-person figure.
- Square buttons. In this family pills square off only when pressed or expanded.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
