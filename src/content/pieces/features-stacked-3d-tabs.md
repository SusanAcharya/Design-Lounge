---
title: "Stacked 3D tabs"
summary: "Vertical tabs whose panels sit as a perspective stack of product cards; choosing a tab, a number key or a card behind brings that card to the front."
platform: web
type: section
category: features
tags: [features, tabs, 3d, stack, travel]
styles: [dark, kinetic]
motion: rich
difficulty: 2
featured: false
published: 2026-10-28
palette: ["#0E1624", "#152033", "#F5F1E8", "#FF8B78", "#EEF2F8"]
fonts: ["Gabarito"]
related: [features-tabbed-preview, features-accordion-media-swap]
---

# Stacked 3D tabs

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The features section for "Nightjar", an invented sleeper-train operator. Four vertical tabs on the left (Pick your berth, See the night, Order breakfast, Board offline) control four product cards on the right that sit as a physical stack in perspective: the active card at the front, the other three stepping back 90px in depth and 34px up each, their headers peeking over the top so you can read what is behind. Choosing a tab sends the cards round: each one moves to its new depth on the same 640ms expo-out curve. The thing to copy: one custom property, `--d` (depth), drives position, tilt and dimming, and the browser's 3D sort handles the overlap.

## Reference behaviour

1. Initial state: tab 1 selected; the berth card is in front; behind it, in order, the route, breakfast and ticket cards, each header visible above the one in front.
2. Click a tab: the cards re-deal. Depth for each card is `(index − active + 4) % 4`. The old front card travels back and up to its new slot while the chosen one comes forward; all move together over 640ms.
3. Click a card that is behind: it comes to the front (same as its tab).
4. Keyboard on the tablist: Up/Left previous, Down/Right next (wrapping), Home first, End last. The newly selected tab takes focus (automatic activation). Keys 1 to 4 anywhere jump to that tab.
5. The selected tab gets a `--bg-2` fill, full-ink title and a 2px coral bar on the left rule that grows from its centre over 240ms.
6. Berth card: three radio cards (Couchette 4 €89, Sleeper 2 €164 selected, Deluxe 1 €238), each with a tiny cabin plan; your berth is drawn in coral. Selecting one updates the total.
7. Route card: seven stops on a 2px line from Amsterdam Centraal 19:58 to Wien Hauptbahnhof 08:12; night stops are dotted and grey ("no doors open").
8. Breakfast card: two dishes with − and + steppers (0 to 4); the total updates (€9.50 initially).
9. Ticket card: AMS to VIE, six fields, a 21 × 21 ticket code with three finder squares, and a perforated strip "Valid offline until 08:12, Sat 15 Nov."
10. Only the front card is interactive and exposed to assistive tech; the others are `aria-hidden` and their contents are `inert`.

## Structure

```
1280 × 800
┌──────────── wrap 1200 max, padding 34 / 44 / 22 · grid 400px 1fr, gap 56 ──────────────┐
│ Nightjar sleeper trains (coral 13)      │            ┌─ header d=3 ───────────────┐     │
│ Go to sleep in Amsterdam.               │          ┌─┴─ header d=2 ───────────────┴─┐   │
│ Wake up in Vienna.  (46px, 800)         │        ┌─┴─── header d=1 ─────────────────┴─┐ │
│ lede (36ch)                             │      ┌─┴───── front card d=0 ───────────────┴┐│
│ ┃ Pick your berth              [1]      │      │ 56px header: title · meta              ││
│ ┃ Seat, couchette or a cabin…           │      │ body 20/22 padding: working screen     ││
│ │ See the night                [2]      │      │                                        ││
│ │ Order breakfast              [3]      │      │                       400px tall       ││
│ │ Board offline                [4]      │      └────────────────────────────────────────┘│
│ hint                                    │   stage 540 tall, stack inset 118 0 0          │
│──────────────────────────────── footer hairline ─────────────────────────────────────── │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

- Left: `.kicker`, `<h2>`, `.lede`, `<div role="tablist" aria-orientation="vertical">` with four `<button role="tab">` (title `<b>`, key hint `<kbd>`, line `<span>`), `.hint`.
- Right: `.stage` (`perspective: 1500px; perspective-origin: 50% -30%`) → `.stack` (`transform-style: preserve-3d`) → four `<section class="card" role="tabpanel">`, each `.ch` header (56px) and `.cb` body.
- Footer row spans both columns.

## Tokens

```css
:root {
  /* colour: night navy, warm paper cards, one coral */
  --bg: #0E1624;          /* page, also the dimming veil on back cards */
  --bg-2: #152033;        /* selected / hovered tab */
  --line: #26344C;        /* tablist rule, footer rule */
  --line-2: #3A4B68;      /* kbd border */
  --ink: #EEF2F8;         /* headline, selected tab */
  --ink-2: #AFBACB;       /* lede, unselected titles */
  --ink-3: #8C99AE;       /* tab lines, hint, footer */
  --card: #F5F1E8;        /* card face */
  --card-2: #EAE4D6;      /* cabin plan ground */
  --card-line: #D8D0BF;   /* hairlines */
  --control-line: #857C6B; /* berth card border, 3:1 on --card */
  --c-ink: #18202E;  --c-ink-2: #4C5566;  --c-ink-3: #646C7B;
  --accent: #FF8B78;      /* active bar, primary, your berth */
  --accent-ink: #2A0E08;  /* text on coral */
  --accent-deep: #B83A26; /* coral text on paper ("to") */

  /* type */
  --font: "Gabarito", system-ui, sans-serif;
  --fs-h2: clamp(34px, 3.8vw, 46px);
  --fs-tab: 18px;
  --fs-body: 15px;
  --fs-small: 13–14px;

  /* stack */
  --step-y: -34px;        /* per depth level */
  --step-z: -90px;
  --tilt: 1.5deg;         /* rotateX per level */
  --veil: .2;             /* veil opacity per level */
  --card-h: 400px;
  --r: 16px;
  --r-sm: 8px;

  /* motion */
  --t: 160ms;
  --t-bar: 240ms;
  --t-stack: 640ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Kicker | Gabarito | 13px | 600 | 1.4 | +0.02em | sentence, coral |
| Headline | Gabarito | clamp(34px, 3.8vw, 46px) | 800 | 1.02 | -0.03em | sentence |
| Lede | Gabarito | 16px | 400 | 1.5 | 0 | sentence |
| Tab title | Gabarito | 18px | 700 | 1.3 | 0 | sentence |
| Tab line, hint | Gabarito | 13–14px | 400 | 1.4 | 0 | sentence |
| Key hint | Gabarito | 12px | 500 | 1 | 0 | digit in a 1px box |
| Card header | Gabarito | 16px / 13px | 700 / 500 | 1 | 0 | sentence |
| Prices, totals | Gabarito | 22–26px | 800 | 1.1 | -0.02em | numerals |
| Ticket route | Gabarito | 40px | 800 | 1 | -0.03em | UPPERCASE codes |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|---|
| `.card` | tab change | transform | old depth → `translateY(d × −34px) translateZ(d × −90px) rotateX(d × 1.5deg)` | 640ms | `--expo` | 1ms |
| `.card::after` veil | tab change | opacity | old → d × 0.2 | 640ms | `--expo` | 1ms |
| tab bar `::before` | selected | scaleY | 0 → 1 | 240ms | `--expo` | 1ms |
| tab | hover | background | transparent → `--bg-2` | 160ms | `--ease` | 1ms |
| buttons | hover | background | coral → `#FF9F8F` | 160ms | `--ease` | 1ms |

All four cards move at once with no stagger, so the stack reads as one object. Keep `transform-origin: 50% 0` so the tilt hinges at each card's top edge.

## States

- **Tab selected:** `aria-selected="true"`, `tabindex="0"`, `--bg-2` fill, `--ink` title, coral 2px bar. Others `tabindex="-1"`.
- **Tab hover:** `--bg-2` fill.
- **Tab focus-visible:** 2px coral outline inset 2px.
- **Card behind:** veil of `--bg` at 20% per level, pointer cursor, contents `inert`.
- **Berth:** 1px `#857C6B` border (3.3:1 on the card). **Berth selected:** `aria-checked="true"`, 2px ink ring (1px border plus 1px inset shadow), your berth coral in the plan.
- **Stepper at 0 or 4:** value clamps; buttons stay enabled and do nothing past the limit.
- **Primary (Hold this berth, Add to booking):** coral pill 42px; hover `#FF9F8F`.

## Accessibility

- Tabs follow the ARIA tabs pattern: `role="tablist"` with `aria-orientation="vertical"`, `role="tab"` with `aria-controls`, `role="tabpanel"` with `aria-labelledby`. Roving `tabindex`.
- Both arrow axes work, because the visual list is vertical but people reach for Left and Right too.
- Back cards are `aria-hidden="true"` and their header and body are `inert`, so Tab never lands inside a card you cannot see properly. The card element itself stays hit-testable so it can be clicked forward.
- The number-key shortcut ignores keystrokes inside inputs.
- Berths are a `role="radiogroup"` of `role="radio"` buttons; the ticket code is `role="img"` with `aria-label="Ticket code K7Q-2LX"`.
- Contrast: `--ink-2` on `--bg` 9.4:1; `--ink-3` on `--bg` 6.3:1; `--c-ink-2` on `--card` 7.1:1; `--accent-ink` on coral 8.9:1; `--accent-deep` on `--card` 5.0:1.
- Tabs are 70px tall rows; steppers 32px circles (web); primary 42px.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: same two columns; the stack narrows with its column.
- < 1024: one column; tabs above the stage; stage height 560px.
- < 760: wrap padding 32px 16px; perspective 1100px; depth steps `−26px` and `−70px`; stack inset 90px; cards 480px tall. Berths become rows (plan hidden, price right), dishes stack and lose their plate art, the ticket code drops under the fields at 120px, key hints are hidden. At 390 wide nothing scrolls sideways; the `body` keeps `overflow-x: hidden` as a guard against the perspective box.

## Acceptance checklist

**Always**
- [ ] Four tabs, four cards; exactly one card at depth 0.
- [ ] Depth is `(index − active + n) % n` and drives translateY, translateZ, rotateX and the veil from one `--d` property.
- [ ] Every card moves on the same 640ms `cubic-bezier(.16,1,.3,1)`, no stagger.
- [ ] Headers of the three back cards stay readable above the front card.
- [ ] Clicking a back card brings it forward.
- [ ] Arrow keys (both axes), Home and End move selection and focus; 1 to 4 jump directly.
- [ ] Back cards are `aria-hidden` with `inert` contents, and are still clickable.
- [ ] Reduced motion: re-dealing is instant and complete.
- [ ] At 390 wide: single column, stack fits, no sideways scroll.

**This demo**
- [ ] Headline "Go to sleep in Amsterdam. Wake up in Vienna."
- [ ] Berths €89, €164 (default), €238; total follows the choice.
- [ ] Route runs 19:58 Amsterdam Centraal to 08:12 Wien Hauptbahnhof with two dotted night stops.
- [ ] Breakfast total starts at €9.50 and adds €13.00 per eggs plate.

## Implementation notes

**One property for the whole stack.**

```css
.stage { perspective: 1500px; perspective-origin: 50% -30%; }
.stack { position: absolute; inset: 118px 0 0; transform-style: preserve-3d; }
.card {
  position: absolute; inset: 0 0 auto; height: 400px; transform-origin: 50% 0;
  transform: translateY(calc(var(--d) * -34px)) translateZ(calc(var(--d) * -90px))
             rotateX(calc(var(--d) * 1.5deg));
  transition: transform 640ms var(--expo);
}
.card::after { content: ""; position: absolute; inset: 0; background: var(--bg);
  opacity: calc(var(--d) * .2); transition: opacity 640ms var(--expo); pointer-events: none; }
```

**Deal the cards.** Set `z-index` too: some browsers flatten `preserve-3d` when an ancestor has `overflow` or `filter`, and the z-index keeps the order right in that case.

```js
function show(i, focus) {
  cur = (i + n) % n;
  tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === cur); t.tabIndex = k === cur ? 0 : -1; });
  cards.forEach((c, k) => {
    const d = (k - cur + n) % n;
    c.style.setProperty('--d', d); c.style.zIndex = n - d; c.dataset.d = d;
    d ? c.setAttribute('aria-hidden', 'true') : c.removeAttribute('aria-hidden');
    [...c.children].forEach(ch => ch.inert = d > 0);   // inert the insides, not the card
  });
  if (focus) tabs[cur].focus();
}
```

**Click-through to a back card.** Inert nodes are skipped by hit-testing, so if the card itself were inert the click would fall through to the stack. Make only its children inert; the click then lands on the card box.

```js
stack.addEventListener('click', e => {
  const c = e.target.closest('.card');
  if (c && c.dataset.d !== '0') show(+c.dataset.i);
});
```

Common mistakes: animating `top` and `z-index` instead of transforms (no depth, and z-index cannot ease); putting `overflow: hidden` on the stage, which clips the back cards' headers; dimming back cards with `filter: brightness()` (it flattens 3D in some engines; use the veil); leaving back cards focusable.
