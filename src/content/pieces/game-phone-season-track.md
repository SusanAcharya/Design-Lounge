---
title: "Season pass track"
summary: "A two-lane season pass for a kite-racing game: claim glowing tiers, watch the reward fly into your satchel, and see exactly what €9.99 premium buys."
platform: mobile-app
type: screen
category: games
tags: [game, season-pass, rewards, press, scroll]
styles: [playful, dark]
motion: rich
difficulty: 3
featured: false
published: 2026-11-06
palette: ["#0E2620", "#16352D", "#F3EEDF", "#8BE3B9", "#FFC24B"]
fonts: ["Bagel Fat One", "Figtree"]
related: [game-gacha-pull-reveal, game-cozy-farm-hud]
---

# Season pass track

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The season pass screen of **Kitecrest**, an invented kite-racing game, in its fourth season, "Monsoon Run". Thirty tiers run along a horizontally scrolling rail with two lanes: premium on top (saffron, locked) and free underneath (mint, in the thumb zone). The player is at tier 12 with 640 of 1,000 XP, and three free rewards (tiers 10, 11, 12) glow because they have been reached but not claimed. Tapping Claim lifts the reward icon out of its card, flies it in an arc into the satchel chip in the header, which bumps and counts up, and the XP bar fills by 120. The third claim crosses 1,000 XP and the tier numeral springs from 12 to 13. The monetisation is honest: one "Unlock premium · €9.99" button opens a plain light sheet that lists exactly what the lane contains, line by line, with counts that add up to the 30 premium tiers. The visual language is custom game UI on iOS-style sheet physics.

## Reference behaviour

1. Initial state: tier 12, XP 640 / 1,000, "360 XP to tier 13", countdown "Season ends in 18d 06:41:12" ticking down once per second. Satchel chip shows 3.
2. The rail is pre-scrolled so tier 9 peeks on the left edge and tier 13 peeks on the right; tiers 10, 11 and 12 sit in full view. Scrolling is native horizontal overflow with `scroll-snap-type: x proximity` on 92px columns.
3. Tiers 1 to 9 on the free lane are claimed: a 20px mint check badge, icon at 45% opacity, label in `--text-3`. Tiers 10 to 12 free are claimable: mint border, 1px mint ring plus a 22px glow that breathes on a 2.4s loop, and a 26px mint "Claim" pill; the whole 80 × 128 card is the button.
4. Every premium card shows a 20px lock disc top right and its label in solid `--locked` (`#C9B98F`), never faded with opacity.
5. Track: a 4px line through the middle row with a numbered pill per tier. Passed tiers are mint, the current tier is a larger cream pill (40 × 32, 17px), future tiers are `--surface-2` with `--text-2` numerals.
6. Tap Claim: the card's icon is cloned at its exact rect and flown to the satchel icon in 680ms along a three-key arc (up 70px and scaled 1.35 at 40%, ends scaled .6). On landing the clone is removed, the satchel count goes up by one and the chip scales 1 → 1.18 → 1 in 420ms on a spring.
7. A free claim adds 120 XP: the bar width transitions in 620ms expo-out, the numbers update, and "+120 XP" floats up 22px and fades in 900ms. The card becomes claimed.
8. When XP reaches 1,000 the tier goes up: XP wraps to the remainder, the tier numeral bumps (520ms spring), the column states move along, and the new tier's free reward becomes claimable. In the demo the third claim lands exactly on 1,000, so the screen reads Tier 13, 0 / 1,000.
9. After a claim, focus moves to the next Claim button in the same lane; if it is off-screen the rail scrolls it into view (smooth, 120px from the left edge).
10. "Tier 13 next" card under the rail names the next tier's free and premium rewards and updates on tier up.
11. Tap "Unlock premium · €9.99": a 66% scrim fades in (280ms) and a light sheet rises (420ms iOS sheet curve). Focus goes to "Pay €9.99". The sheet lists six kite skins, six string trails, two glider frames, 1,600 Gale coins and "12 rewards already reached, claimable now", then a plain note: no XP boosts, no gameplay advantage, the end date.
12. "Not now", the scrim or Escape closes the sheet and returns focus to the opener. Tab is trapped between the two sheet buttons.
13. "Pay €9.99" (the demo stands in for the store's own payment sheet): the sheet closes, every reached premium card (tiers 1 to 12) turns claimable with a saffron ring and pill, the buy button becomes a disabled "Premium unlocked" with a check, and the note changes to a thank-you line. Premium claims fly to the satchel too but add no XP.

## Structure

```
390 × 844 (54px top and 34px bottom left clear)
┌──────────────────────────────────────┐
│ 54px safe area                       │
│ KITECREST · SEASON 4        ( 3)  │ header 20px gutters, chip 44px tall
│ Monsoon Run   (28px display)         │
│ ┌──────┐  640 / 1,000           XP   │ hero grid: 104px tile + 1fr
│ │ TIER │  ████████████░░░░░░          │ bar 14px
│ │  12  │  360 XP to tier 13          │
│ └──────┘  ◷ Season ends in 18d 06:.. │
│  PREMIUM LANE           TIERS 1–30  │ lane labels 12px caps
│ ┌────┐┌────┐┌────┐┌────┐┌──          │ premium cells 80×128
│ │   ││   ││   ││   ││             │
│ └────┘└────┘└────┘└────┘└──          │
│ ─9───10────11────12────13──          │ node row 44px
│ ┌────┐┌════┐┌════┐┌════┐┌──          │ free cells, glowing when claimable
│ │ ✓  ││Claim││Claim││Claim││         │
│ └────┘└════┘└════┘└════┘└──          │
│ ✓ FREE LANE      SWIPE FOR MORE TIERS│
│ ┌──────────────────────────────────┐ │ next-tier card, 18px radius
│ │  Tier 13 next · 50 coins · trail │ │
│ └──────────────────────────────────┘ │
│ [   Unlock premium · €9.99       ]  │ 56px pill, margin-top auto
│ One-time purchase for Season 4. ...  │
│ 34px home indicator                  │
└──────────────────────────────────────┘
Sheet: fixed bottom, radius 28 28 0 0, padding 12 22 34, light paper.
```

- `<header>`: eyebrow, `<h1>` season name, satchel `<button>` with an `aria-label` that carries the count.
- `<section class="hero">`: tier tile, XP numbers, `role="progressbar"` bar, countdown.
- `<section class="track-wrap">`: lane labels, `.rail` (horizontal scroller) → `.cols` → 30 × `.col` (premium cell, node, free cell). Each cell is `role="group"` with a full `aria-label`; claimable cells contain a `<button class="claim">` that covers the card.
- `.next` card, `.foot` with the buy button and note.
- `.scrim` and `.sheet` (`role="dialog" aria-modal="true"`) with a `<ul>` of inclusions and two buttons.
- A visually hidden `aria-live="polite"` paragraph for claim and tier-up announcements.

## Tokens

```css
:root {
  /* colour */
  --bg: #0e2620;          /* pine night */
  --surface: #16352d;     /* free cells, tier tile, next card */
  --surface-2: #1e443a;   /* chip, bar track, future tier pills */
  --line: #2f5e50;        /* 1px borders, track line */
  --text: #f3eedf;        /* primary text, current tier pill */
  --text-2: #b9c8be;      /* secondary text */
  --text-3: #9fb3a7;      /* claimed labels */
  --free: #8be3b9;        /* free lane accent, XP fill, focus ring */
  --free-ink: #06281c;    /* text on mint */
  --prem: #ffc24b;        /* premium accent, buy button */
  --prem-ink: #2a1a00;    /* text on saffron */
  --prem-cell: #2a2a1a;   /* premium card fill */
  --prem-line: #4a4426;   /* premium card border */
  --locked: #c9b98f;      /* locked label, lock glyph */
  --sheet: #f6f1e4;       /* sheet paper */
  --sheet-ink: #1d2a24;
  --sheet-2: #4b5a52;
  --sheet-line: #ddd5c2;
  --scrim: rgba(4,14,11,.66);
  /* type */
  --display: "Bagel Fat One", system-ui, sans-serif;
  --ui: "Figtree", system-ui, sans-serif;
  --fs-tier: 64px; --fs-title: 28px; --fs-sheet-title: 24px; --fs-xp: 20px;
  --fs-body: 14px; --fs-small: 13px; --fs-label: 12px; --fs-eyebrow: 11px;
  /* size */
  --gutter: 20px; --col: 92px; --cell-w: 80px; --cell-h: 128px; --node-h: 44px;
  --r-cell: 16px; --r-tile: 24px; --r-card: 18px; --r-sheet: 28px; --r-pill: 999px;
  --btn-h: 56px; --chip-h: 44px; --bar-h: 14px;
  /* shadow */
  --glow-free: 0 0 0 1px #8be3b9, 0 0 22px rgba(139,227,185,.35);
  --glow-prem: 0 0 0 1px #ffc24b, 0 0 22px rgba(255,194,75,.35);
  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
  --sheet-ease: cubic-bezier(.32,.72,0,1);
  --spring: cubic-bezier(.34,1.56,.64,1);
  --arc: cubic-bezier(.5,0,.3,1);
  --t-fly: 680ms; --t-bump: 420ms; --t-bar: 620ms; --t-sheet: 420ms; --t-scrim: 280ms; --t-glow: 2400ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Tier numeral | Bagel Fat One | 64px | 400 | 1 | 0 | numerals |
| Season name | Bagel Fat One | 28px | 400 | 1 | .005em | title |
| Sheet title | Bagel Fat One | 24px | 400 | 1.1 | 0 | sentence |
| Track pills | Bagel Fat One | 13px (17px current) | 400 | 1 | 0 | numerals |
| XP numbers | Figtree | 20px | 800 | 1.35 | 0 | tabular |
| Buy button | Figtree | 16px | 800 | 1 | 0 | sentence |
| Body, sheet rows | Figtree | 14px | 500 | 1.35 | 0 | sentence |
| Countdown, XP to next | Figtree | 13px | 600 | 1.35 | 0 | tabular |
| Cell labels, Claim | Figtree | 12px | 600 / 800 | 1.2 | 0 / .02em | sentence |
| Eyebrow, lane labels | Figtree | 12px | 700–800 | 1 | .12em | upper |
| Tile "TIER" | Figtree | 11px | 800 | 1 | .14em | upper |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---:|---|---|
| Claimable glow | always | box-shadow | 22px glow → 8px → 22px | 2400ms loop | `--ease` | static 22px glow |
| Reward clone | Claim | transform | 0 → arc peak (35% dx, 35% dy − 70px, 1.35) at 40% → target, .6 | 680ms | `--arc` | no clone; count changes in place |
| Satchel chip | clone lands | scale | 1 → 1.18 → 1 | 420ms | `--spring` | none |
| XP fill | free claim | width | old % → new % | 620ms | `--ease-out` | 1ms |
| "+120 XP" | free claim | opacity, translateY | 0, 8px → 1 → 0, −14px | 900ms | `--ease-out` | hidden |
| Tier numeral | tier up | scale | 1 → 1.18 → 1 | 520ms | `--spring` | none |
| Rail | next claim off-screen | scrollLeft | current → column − 120px | native smooth | browser | instant |
| Scrim | open / close | opacity | 0 ↔ 1 | 280ms | `--ease` | 1ms |
| Sheet | open / close | translateY | 100% ↔ 0 | 420ms in, 380ms out | `--sheet-ease` | 1ms |
| Buy, Claim | press | scale | 1 → .97 (.94 pill) | 160ms | `--ease` | kept |

## States

- **Claimed cell:** mint check disc, icon 45% opacity (decorative), label `--text-3` (6.0:1 on `--surface`).
- **Claimable cell:** accent border, glow ring, accent "Claim" pill, label in `--text`. The full card is the hit area.
- **Future cell (free):** default `--surface`, label `--text-2`, no button.
- **Locked premium cell:** lock disc, label and icon in solid `--locked` / `#A8925A` on `--prem-cell`; never opacity.
- **Track pills:** passed (mint fill, `--free-ink`), current (cream fill, 40 × 32), future (`--surface-2`).
- **Buy button:** default saffron; pressed scales .97; after purchase `aria-disabled="true"`, `--surface-2` fill, saffron text, check glyph.
- **Focus-visible:** 2px mint outline, 3px offset everywhere; inside the sheet the outline turns `--sheet-ink`.
- **Sheet:** closed is `visibility:hidden` plus `translateY(100%)`; the visibility flips after the 380ms slide.

## Accessibility

- Each cell is `role="group"` labelled "Tier 11 free: 50 coins, ready to claim" (or claimed / locked, premium / reached at tier n). The Claim button says "Claim 50 coins, tier 11".
- The XP bar is `role="progressbar"` with `aria-valuemin="0"`, `aria-valuemax="1000"` and a live `aria-valuenow`.
- Claims announce through a polite live region: "Cheer emote claimed. Tier 13 reached."
- The satchel chip's `aria-label` updates with the count ("Satchel, 4 unopened items").
- The sheet is `role="dialog" aria-modal="true"`, labelled by its title; focus starts on Pay, Tab loops between the two buttons, Escape closes, focus returns to the opener.
- Contrast: `--text` on `--bg` 13.8:1; `--text-2` on `--surface` 7.6:1; `--locked` on `--prem-cell` 7.5:1; `--free-ink` on `--free` 10.4:1; `--prem-ink` on `--prem` 10.5:1; `--sheet-2` on `--sheet` 6.5:1.
- Hit targets: Claim cards 80 × 128, satchel 44px tall, buy 56px, sheet buttons 52px.

## Responsive rules

- 390 × 844: as drawn; four full columns visible.
- 360 wide: the column width stays 92px (about 3.6 columns visible), gutters stay 20px, the hero tile stays 104px and the XP column shrinks.
- Under 760px tall: drop the "next tier" card first, then reduce cells to 112px tall.
- Tablet: cap the app column at 430px and centre it; the rail never stretches cells, it shows more columns.
- The page never scrolls vertically; only the rail scrolls, and its scrollbar is hidden.

## Acceptance checklist

**Always**
- [ ] Two lanes share one horizontal rail; premium above the track, free below it in the thumb zone.
- [ ] Reached, unclaimed tiers glow and the whole card is the Claim button (at least 80 × 128).
- [ ] Claim flies a clone of the reward icon to the header inventory chip; the chip bumps and its count goes up only when the clone lands.
- [ ] The XP bar animates on a free claim and a full bar rolls the tier over with the remainder.
- [ ] Locked cards use a lock icon plus a solid muted colour that passes 4.5:1, never opacity.
- [ ] The buy button states the real price; its sheet lists every inclusion with counts and says what is not included.
- [ ] The closed sheet is `visibility:hidden`; Escape and the scrim close it; focus is trapped and restored.
- [ ] Reduced motion removes the flight, the glow pulse and the bumps; claims still work.
- [ ] `document.documentElement.scrollWidth` is 390; nothing fixed sits in the top 54px or bottom 34px.

**This demo**
- [ ] Kitecrest · Season 4, "Monsoon Run"; tier 12, 640 / 1,000 XP; free tiers 10–12 claimable; satchel 3.
- [ ] Each free claim adds 120 XP; the third claim reaches Tier 13 at 0 / 1,000.
- [ ] Sheet: €9.99 once, 6 kite skins, 6 trails, 2 gliders, 1,600 Gale coins, 12 already reached; season ends 24 Nov 2026.
- [ ] Countdown starts at 18d 06:41:12 and ticks each second.

## Implementation notes

**Fly to the chip with WAAPI.** Clone the icon, pin it with `position:fixed` at its own rect, and animate a three-key arc. Bump the count in `onfinish`, not when the tap happens, so the number changes when the eye arrives:

```js
const fly = (icon) => {
  const a = icon.getBoundingClientRect(), b = bagIcon.getBoundingClientRect();
  if (reduce) return addToBag();
  const f = icon.cloneNode(true);
  Object.assign(f.style, { position: 'fixed', left: a.left + 'px', top: a.top + 'px', color: getComputedStyle(icon).color });
  document.body.appendChild(f);
  const dx = b.left - a.left - 7, dy = b.top - a.top - 7;
  f.animate([
    { transform: 'translate(0,0) scale(1)' },
    { transform: `translate(${dx*.35}px,${dy*.35-70}px) scale(1.35)`, offset: .4 },
    { transform: `translate(${dx}px,${dy}px) scale(.6)`, opacity: .85 }
  ], { duration: 680, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = () => { f.remove(); addToBag(); };
};
```

**One render from state.** Keep `{ tier, xp, premium, got: { f: Set, p: Set } }` and rebuild the 30 columns from it after every change; a cell is claimable when `t <= tier && !got.has(t) && (lane === 'f' || premium)`. Restore focus to the next Claim in the same lane after the rebuild.

**Closed sheets must be hidden, not just moved.** Delay the `visibility` flip until the slide-out ends:

```css
.sheet{transform:translateY(100%);visibility:hidden;
  transition:transform 380ms var(--sheet-ease),visibility 0s 380ms}
.open .sheet{transform:none;visibility:visible;transition:transform 420ms var(--sheet-ease)}
```

Common mistakes: dimming locked cards with `opacity` (fails contrast); a premium button that hides the price until the store sheet; fake scarcity ("ends soon!" banners) beyond the plain countdown; bumping the count before the icon arrives; letting the rail cause horizontal page scroll instead of scrolling inside itself.
