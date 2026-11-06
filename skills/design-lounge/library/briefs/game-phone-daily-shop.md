<!-- Design Lounge Nº 635 · "Daily game shop" · www.designlounge.live -->

# Daily game shop

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The daily shop of **Hollowmere**, an invented fox-adventure game, styled as a travelling "Trader's Cart" on warm paper. A header carries the two currencies (Acorns, earned in play; Moonstones, bought), a deep-green featured bundle card sells one thing for real money (€4.99, with every item it contains written on the card), and a 2 × 3 grid shows today's six items in rarity frames: common stone, rare teal, epic berry and a double-ruled legendary gold. A plain "Refreshes in 06:14:22" is the only time pressure; there are no "only 2 left" badges, no struck-through fake discounts, and a footnote says the price is the same for everyone. Every purchase goes through a confirm sheet that shows the price, what you have and what you will have after. Confirming tilts the card in 3D and ticks the currency down; when you cannot afford something, the sheet says how much you are short inline and disables the button instead of pushing a top-up pop-up. Custom game UI with iOS sheet physics.

## Structure

```
390 × 844 (54px top, 34px bottom clear)
┌──────────────────────────────────────┐
│ 54px safe area                       │
│ HOLLOWMERE        ( 12,480)( 340)  │ header, chips 36px tall, gap 6
│ Trader's Cart                        │ 24px / 800
│ ┌───────────┬──────────────────────┐ │ featured, min-height 150, radius 24
│ │  cloak +  │ FEATURED BUNDLE      │ │ art column 124px
│ │  lantern  │ Wayfarer's bundle    │ │
│ │   art     │ Moss cloak, brass .. │ │
│ │           │ Until 13 Nov [€4.99] │ │ price pill 40px
│ └───────────┴──────────────────────┘ │
│ Daily stock        ↻ Refreshes in .. │ margin 22 0 10
│ ┌──────────────┐ ┌──────────────┐    │ 2 columns, gap 10
│ │COMMON        │ │COMMON        │    │ cards min-height 142, radius 18
│ │    icon 52   │ │    icon      │    │ 2px rarity border
│ │Ember tonic   │ │Fernway map   │    │
│ │ 450         │ │ 900         │    │
│ └──────────────┘ └──────────────┘    │
│ (rare, rare) (epic, legendary)       │
│ Same price for everyone. Stock ...   │ inside the scroll area
│ 34px home indicator                  │
└──────────────────────────────────────┘
Sheet: fixed bottom, radius 28 28 0 0, padding 12 22 34.
```

- `<header>`: eyebrow, `<h1>`, `.wallet` with two `role="status"` chips whose `aria-label` holds the full balance.
- `<main>` scrolls vertically if the screen is short (scrollbar hidden). It holds the featured `<button class="feat">`, the section heading with the timer, the `.grid` of six `<button class="item">`, and the footnote.
- `.scrim` and `.sheet` (`role="dialog" aria-modal="true"`): icon tile, `<h2>`, sub line, `<ul class="lines">`, `.msg` (`role="alert"`), Cancel and primary buttons.
- A visually hidden polite live region announces purchases.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---:|---|---|
| Scrim | open / close | opacity | 0 ↔ 1 | 260ms | `--ease` | 1ms |
| Sheet | open | translateY | 100% → 0 | 420ms | `--sheet-ease` | 1ms |
| Sheet | close | translateY | 0 → 100%, then `visibility:hidden` | 360ms | `--sheet-ease` | 1ms |
| Card | press | scale | 1 → .97 | 160ms | `--ease` | kept |
| Card | bought | translateY, rotateY, rotateZ | 0 → −6px, −16°, −2.5° (30%) → −2px, 8°, 1° (60%) → 0 | 640ms | `--spring` | none; "Owned" swaps in |
| Currency chip | balance change | scale | 1 → 1.08 → 1 | 520ms | `--ease-out` | none |
| Currency number | balance change | text value | old → new | 720ms, rAF, dt capped at 48ms | cubic ease-out | set instantly |

The grid has `perspective: 700px` so the tilt reads as a card turning in the hand, not a skew.

## States

- **Rarity frame:** `--rc` per card sets the 2px border, a 14% top tint fading out at 62%, the tag fill (white text) and the icon colour. Legendary adds an inner 2px card-coloured gap and a 1px `--legend-hi` rule.
- **Unaffordable:** price text `--bad`; the card stays fully opaque and tappable; the sheet shows the inline message.
- **Owned:** dashed border, price replaced by "Owned" in `--rare`; tap does nothing.
- **Featured owned:** pill reads "Owned".
- **Primary disabled:** `--disabled` fill, `--ink-2` text, `cursor:not-allowed`.
- **Focus-visible:** 2.5px `--moon` outline, 3px offset on every button.
- **Sheet closed:** `visibility:hidden` after the slide-out, so nothing in it can be focused or read.

## Accessibility

- Every item is a `<button aria-haspopup="dialog">` with a full label: "Hollow crown, Legendary, 600 Moonstones, not enough".
- Currency chips are `role="status"` with the balance spelled in `aria-label` ("340 moonstones"); the label updates to the final value at once, not every animation frame.
- The sheet is `role="dialog" aria-modal="true"` labelled by its title. Focus goes to the primary button, or to Cancel if the primary is disabled. Escape closes; focus returns to the opener.
- The not-enough message is `role="alert"` and is real text, not a toast.
- Purchases announce politely: "Starglass lantern bought for 280 Moonstones."
- Contrast: `--ink` on `--bg` 14.8:1; `--ink-2` on `--bg` 6.3:1; white on rarity tags 5.2–6.5:1; `--bad` on `--card` 6.9:1 and on `--bad-bg` 5.9:1; `--cream` on `--deep` 10.6:1; disabled label 5.3:1.
- Hit targets: item cards 165 × 142, price pill 40px, sheet buttons 52px, currency chips 36px (display only).

## Responsive rules

- 390 × 844: as drawn; everything above the fold, footnote just below.
- 360 wide: cards shrink to about 150px; the header chips keep 6px gap; if the title and chips collide, the title drops to 21px.
- Under 800px tall: `main` scrolls; the header and wallet stay put.
- Tablet: cap the column at 430px and centre; or use a 3 × 2 grid at 600px and wider with the bundle spanning the top.
- No horizontal scroll at any width; `scrollWidth` is 390 at 390.

## Acceptance checklist

**Always**
- [ ] Both currencies are visible at all times; real-money items show a local price with VAT stated.
- [ ] Six items in a 2 × 3 grid with four distinguishable rarity frames; rarity is named in text, not colour alone.
- [ ] The only time pressure is a plain refresh countdown; no stock counts, no fake discounts.
- [ ] Every purchase opens a confirm sheet with Price, You have, After buying.
- [ ] Unaffordable items show an inline message with the exact shortfall and a disabled button, never a pop-up upsell.
- [ ] Confirming tilts the card and ticks the balance to its new value with `requestAnimationFrame`.
- [ ] The closed sheet is `visibility:hidden`; Escape closes it; focus is trapped and returned.
- [ ] Reduced motion removes the tilt, pulse and count; the result is identical.
- [ ] Hit targets at least 40px; nothing fixed in the top 54px or bottom 34px.

**This demo**
- [ ] Hollowmere, Trader's Cart; Acorns 12,480, Moonstones 340; timer starts 06:14:22.
- [ ] Wayfarer's bundle €4.99: Moss cloak, brass lantern, 600 Moonstones, until 13 Nov.
- [ ] Prices 450, 900, 2,400 Acorns; 120, 280, 600 Moonstones; the crown is 260 short.
- [ ] Rubik is the only family.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: Acorns 12,480, Moonstones 340, timer 06:14:22 counting down once per second.
2. Grid, in order: Ember tonic (Common, 450 Acorns), Fernway map (Common, 900 Acorns), Owl quill (Rare, 2,400 Acorns), Tidewalker boots (Rare, 120 Moonstones), Starglass lantern (Epic, 280 Moonstones), Hollow crown (Legendary, 600 Moonstones). The crown's price is red (`--bad`) because 600 > 340: the card tells you before you tap.
3. Tap any unowned item: a 50% warm scrim fades in (260ms) and a sheet rises (420ms iOS sheet curve). The sheet shows a 72px rarity-framed icon, the name, "Rarity · effect", and three rows: Price, You have, After buying.
4. Affordable: the primary button reads "Buy for 280" and takes focus. Unaffordable: an inline tinted message, "You need 260 more Moonstones. Nothing has been charged.", the After row shows a dash, the primary button is disabled and reads "Not enough Moonstones", and focus starts on Cancel. No upsell appears.
5. Confirm: the sheet drops (360ms), the currency chip pulses 1 → 1.08 → 1 (520ms) while its number counts down to the new balance over 720ms (cubic ease-out, `requestAnimationFrame`), and the bought card plays a 640ms tilt: up 6px with `rotateY(-16deg) rotateZ(-2.5deg)`, back through `rotateY(8deg)`, to rest. The card turns dashed with a green "Owned" in place of the price and takes focus.
6. Tap the featured bundle: the same sheet lists Moss cloak (Cosmetic), Brass lantern (Cosmetic), 600 Moonstones and "Price, incl. VAT €4.99"; the button reads "Pay €4.99" (the store's own payment sheet would follow in a real build). Confirming counts Moonstones up by 600 (340 → 940), changes the bundle button to "Owned", and redraws the grid so the crown's price is no longer red.
7. Cancel, the scrim or Escape closes the sheet; focus returns to the card that opened it. Tab cycles between the enabled sheet buttons only.
8. Owned cards and the owned bundle do nothing on tap.

## Tokens

```css
:root {
  /* colour */
  --bg: #f4efe4;          /* paper */
  --card: #fffdf8;        /* cards, chips, sheet */
  --ink: #201c17;         /* text, primary button */
  --ink-2: #5e564b;       /* secondary text */
  --line: #e2d9c8;        /* 1px borders, sheet rules */
  --acorn: #a4521f;       /* soft currency */
  --moon: #2f5fc4;        /* hard currency, focus ring */
  --deep: #1f3b33;        /* featured card */
  --cream: #f6efdc;       /* featured text, price pill */
  --mint: #bfe3cf;        /* featured tag */
  --bad: #a3301f;         /* not-enough text */
  --bad-bg: #fbe7e1;      /* inline message ground */
  --common: #6f6a60;
  --rare: #1f7a62;
  --epic: #a1356a;
  --legend: #8c5e00;      /* legendary border + tag */
  --legend-hi: #e0a92b;   /* legendary inner rule */
  --scrim: rgba(32,28,23,.5);
  --cancel: #efe8da;
  --disabled: #e4dccd;
  /* type */
  --font: "Rubik", system-ui, sans-serif;
  --fs-h1: 24px; --fs-sheet: 20px; --fs-feat: 19px; --fs-sec: 17px;
  --fs-btn: 15px; --fs-body: 14px; --fs-name: 13.5px; --fs-small: 12.5px; --fs-tag: 10.5px;
  /* space and shape */
  --gutter: 20px; --gap: 10px;
  --r-card: 18px; --r-big: 24px; --r-sheet: 28px; --r-tag: 6px; --r-pill: 999px;
  --chip-h: 36px; --btn-h: 52px; --price-h: 40px; --item-h: 142px; --icon: 52px;
  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
  --sheet-ease: cubic-bezier(.32,.72,0,1);
  --spring: cubic-bezier(.34,1.56,.64,1);
  --t-sheet-in: 420ms; --t-sheet-out: 360ms; --t-scrim: 260ms;
  --t-tilt: 640ms; --t-count: 720ms; --t-chip: 520ms; --t-press: 160ms;
}
```

## Typography

One family, Rubik, at four weights.

| Role | Size | Weight | Line-height | Tracking | Case |
|---|---:|---:|---:|---:|---|
| Screen title | 24px | 800 | 1 | −.02em | title |
| Sheet title | 20px | 800 | 1.2 | −.01em | sentence |
| Bundle title | 19px | 800 | 1.2 | −.01em | sentence |
| Section heading | 17px | 800 | 1.2 | −.01em | sentence |
| Price pill, buttons | 15px | 700–800 | 1 | 0 | sentence |
| Balances, prices | 14px | 700 | 1.35 | 0 | tabular numerals |
| Item names | 13.5px | 700 | 1.2 | 0 | sentence |
| Timer | 13px | 500 | 1.35 | 0 | tabular |
| Bundle copy | 12.5px | 400 | 1.4 | 0 | sentence |
| Rarity tags, eyebrow | 10.5–11px | 700 | 1 | .08–.14em | upper |

## Implementation notes

**Count the balance with a capped frame delta.** Set the true balance and the `aria-label` first, then animate only the visible digits:

```js
const tickTo = (el, from, to) => {
  let t = 0, last = performance.now();
  const step = (now) => {
    t += Math.min(48, now - last); last = now;
    const k = Math.min(1, t / 720), e = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(from + (to - from) * e).toLocaleString('en-GB');
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
```

**One custom property per rarity.** The frame, tint, tag and icon all read `--rc`, so a new rarity is one line:

```css
.item{--rc:var(--common);border:2px solid var(--rc)}
.item::before{background:linear-gradient(180deg,color-mix(in srgb,var(--rc) 14%,transparent),transparent 62%)}
.item.rare{--rc:var(--rare)} .item.epic{--rc:var(--epic)}
.item.legend{--rc:var(--legend);box-shadow:inset 0 0 0 2px var(--card),inset 0 0 0 3px var(--legend-hi)}
```

**Shortfall is computed, not written.** `short = price - wallet[currency]`; when it is above zero, fill the message, disable the primary, and move initial focus to Cancel. Recompute after every balance change so a bundle purchase can make the crown affordable.

Common mistakes: dimming the unaffordable card (it fails contrast and hides the price); a top-up modal on the not-enough path; "only 2 left" or a red ticking timer; hiding the euro price until the store sheet; animating the `aria-label` along with the digits.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
