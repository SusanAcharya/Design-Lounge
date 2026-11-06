---
title: "Weekly league with promotion climb"
summary: "A 20-player weekly league on a phone: green promotion band, red demotion band, your dark row, and an end-of-week replay where you climb past rivals into Jade."
platform: mobile-app
type: screen
category: games
tags: [leaderboard, league, ranking, press, scroll, results]
styles: [minimal, soft]
motion: rich
difficulty: 2
featured: false
published: 2026-11-06
palette: ["#EDF1EE", "#13221E", "#DCEFE2", "#F7E4E3", "#A3203A", "#1F8A5E"]
fonts: ["Krona One", "Instrument Sans"]
related: [game-leaderboard, game-racing-results, game-lobby]
---

# Weekly league with promotion climb

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The weekly league screen of "Lanternfall", an invented puzzle game. Twenty players share the Garnet League for week 45: the top 5 sit on a pale green band and move up to Jade, the bottom 4 sit on a pale red band and drop to Gilt, and your row is a solid dark plate so you find yourself at a glance. Pressing "End of week" plays the final day: every XP number counts up, your row lifts with a deeper shadow and climbs past five rivals who slide down one slot each, the ranks are recomputed on every frame from the XP, and a result card rises with a jade gem that pops and throws eight rays. The detail worth copying is that nothing is typed: rank, zone colour, "XP to promotion" and the result stats all come from one sort.

The language is iOS 26-ish: a sheet with the iOS curve, 12–28px radii, a calm light mineral ground, one dark plate for "you".

## Reference behaviour

1. First frame, 390 × 844 (the Lounge draws the status bar). Header from 58px: a 64px faceted garnet hexagon badge, eyebrow "LANTERNFALL • WEEK 45", title "Garnet League" in Krona One 22px.
2. Under the title, a meta row: a stopwatch icon and "2 days 14 h left" on the left; on the right a tier ladder of seven 12px diamonds: four filled grey (done), one 16px garnet with a 3px pink halo (current), one jade outline (next), one light grey (locked).
3. The board: a white card inset 12px from each side, top radius 14, a 1px `#d5ddd9` ring, scrolling vertically inside itself. Inside, a 28px label row "^ PROMOTION ZONE … Top 5 go to Jade" on the green band, rows 1–5 on the band, a 12px gap with a 1px rule, rows 6–16 on white, a 28px label row "v DEMOTION ZONE … Bottom 4 drop to Gilt" on the red band, rows 17–20.
4. Each row is 46px tall inside a 50px slot: rank (Krona One 13px, green in the promotion zone, red in the demotion zone), a 34px initials disc on a pastel tint, name (15px / 600) over city (12px), XP right-aligned with tabular figures and a small "XP".
5. Your row ("You / Ness Varga", amber disc with a 2px light ring) is filled `#13221e` with light text and a `0 6px 16px` shadow, and starts 9th with 1,240 XP.
6. The dock is pinned at the bottom: "1,240 XP" (Krona One 18px) over "9th · 256 XP to promotion", and a 52px dark pill "▶ End of week". 34px clear below.
7. Press End of week: the button disables, the clock reads "Final day", and over 3600ms (sine in-out) every player's XP interpolates from its start to its end value. Each frame re-sorts by XP; whenever your position changes, every row whose slot changed moves to its new `translateY` in 420ms expo-out, and a polite announcement says "You passed Pell Arnaud. Now 8th."
8. While climbing, your row gets a deeper `0 14px 30px` shadow and a faster 260ms transform, so it reads as lifted above the others. The crossings land at about 10%, 25%, 44%, 64% and 91% of the run, so the five passes are spread out instead of bunched.
9. The dock text updates live: "8th · 189 XP to promotion" … "4th · in the promotion zone".
10. At the end: final values are applied, DOM order is synced to rank for reading order, a "▲ 5" delta appears in your row, and the clock reads "Week ended".
11. 700ms later a scrim (42% ink) fades in and a result card rises from below in 520ms with the iOS sheet curve. Its parts arrive one at a time: jade gem (pop with overshoot at 220ms, eight rays fly out at 380ms), "PROMOTED", "Jade League", the sentence, a three-cell stat strip "4th / Final rank", "+665 / XP this week", "5 / Places climbed", then two buttons at 860ms.
12. "Enter Jade" or tapping the scrim or Escape closes the card; the dock button now reads "Replay week". "Replay week" (in the card or the dock) resets every value to the start of the final day and plays again.
13. Reduced motion: the climb jumps to the final standings with a 200ms opacity fade, the card fades in instead of sliding, gem and rays do not animate, staggered parts fade without moving.

## Structure

```
390 × 844
┌──────────────────────────────────────┐
│ 58px top pad                         │
│ ⬢  LANTERNFALL • WEEK 45             │ badge 64px, gap 14
│ ⬢  Garnet League                     │ Krona One 22
│ ◷ 2 days 14 h left        ◆◆◆◆◆◇◆    │ meta row, margin-top 14
├──────────────────────────────────────┤ board: inset 12px, r14 top
│ ^ PROMOTION ZONE    Top 5 go to Jade │ 28px label (green band)
│ 1  (TV) Tamsin Vale        2,110 XP  │ 50px slots
│ …  5 rows on #dcefe2                 │
│ ──────────────────────────────────── │ 12px gap + 1px rule
│ 6  (LC) Lio Castellan      1,410 XP  │
│ 9  ███ You / Ness Varga ███ 1,240 XP │ dark plate r12
│ …  rows 6–16 on white                │
│ v DEMOTION ZONE  Bottom 4 drop to Gilt│ 28px label (red band)
│ 17–20 on #f7e4e3                     │ (scrolls)
├──────────────────────────────────────┤
│ 1,240 XP               [▶ End of week]│ dock, pad 12 20 34
│ 9th · 256 XP to promotion            │
└──────────────────────────────────────┘
Result card: fixed, left/right 12, bottom 34, r28, pad 28 24 20
```

- `header` with the badge `svg aria-hidden`, eyebrow `div`, `h1`, the time `span` and the tier ladder as `span role="img" aria-label="Tier 5 of 7: Garnet. Next: Jade."`.
- `section.board aria-label="Garnet League standings"` scrolls (`overflow-y:auto`, `overflow-x:hidden`). Inside: two absolutely placed band `div`s, two zone label `div`s, one rule, and an `ol` of 20 `li` rows positioned with `transform: translateY()`.
- Each `li` has an `aria-label` like "9th, you, Ness Varga, 1,240 XP" refreshed on every rank change.
- `footer.dock` holds the summary and a `button`.
- Result: a scrim `div` and a `section role="dialog" aria-modal="true"` labelled by its `h2`; closed it is `visibility:hidden`.
- A visually hidden `p aria-live="polite"`.

## Tokens

```css
:root {
  /* surfaces */
  --ground: #edf1ee;      /* mineral page */
  --card: #ffffff;        /* board, dock, result card */
  --rule: #d5ddd9;        /* hairlines and board ring */
  --ink: #13221e;         /* text, primary button */
  --ink-2: #4a5a55;       /* secondary text */
  /* zones */
  --up: #1d7a45;  --up-band: #dcefe2;  --up-ink: #155f35;
  --down: #9b1c31; --down-band: #f7e4e3; --down-ink: #8a1a2c;
  /* tiers */
  --garnet: #a3203a; --garnet-2: #d2455d;
  --jade: #1f8a5e;   --jade-2: #6fd1a1;  --jade-button: #17704c;
  /* you */
  --you: #13221e; --on-you: #f3f6f4; --you-sub: #b9c7c2; --you-delta: #8ee0b0;
  --you-disc: #ffd98a;
  /* type */
  --display: "Krona One", system-ui, sans-serif;
  --ui: "Instrument Sans", system-ui, sans-serif;
  --fs-title: 22px; --fs-result: 26px; --fs-dock: 18px; --fs-stat: 17px;
  --fs-name: 15px; --fs-xp: 14px; --fs-rank: 13px; --fs-sub: 12px; --fs-zone: 11px;
  /* layout */
  --row: 50px; --row-h: 46px; --zone-label: 28px; --safe-gap: 12px;
  --gutter: 20px; --board-inset: 12px;
  --r-board: 14px; --r-row: 12px; --r-card: 28px; --r-pill: 26px;
  --button-h: 52px; --disc: 34px; --badge: 64px; --gem: 92px;
  /* shadow */
  --sh-you: 0 6px 16px rgba(19,34,30,.18);
  --sh-lift: 0 14px 30px rgba(19,34,30,.32);
  --scrim: rgba(19,34,30,.42);
  /* motion */
  --out: cubic-bezier(.16,1,.3,1);
  --ease: cubic-bezier(.2,.7,.2,1);
  --sheet: cubic-bezier(.32,.72,0,1);
  --t-slot: 420ms; --t-climb: 260ms; --t-week: 3600ms; --t-sheet: 520ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|
| League title | Krona One | 22px | 400 | 1.15 | −0.01em | Title |
| Result title "Jade League" | Krona One | 26px | 400 | 1.15 | 0 | Title |
| Rank numerals | Krona One | 13px | 400 | 1 | 0, tabular | — |
| Dock XP, stat values | Krona One | 18px / 17px | 400 | 1.1 | 0, tabular | — |
| Eyebrow | Instrument Sans | 12px | 600 | 1 | 0.12em | Upper |
| Zone label | Instrument Sans | 11px | 700 | 1 | 0.1em | Upper |
| Zone note | Instrument Sans | 12px | 600 | 1 | 0.04em | Sentence |
| Player name | Instrument Sans | 15px | 600 | 1.1 | 0 | Name |
| City / sub | Instrument Sans | 12px | 500 | 1.2 | 0 | Name |
| XP value | Instrument Sans | 14px | 600 | 1 | 0, tabular | — |
| Button | Instrument Sans | 16px (dock), 15px (card) | 600 | 1 | 0 | Sentence |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|---|
| XP count | End of week | number | start → end per player | 3600ms | sine in-out (`.5 − cos(πt)/2`) | jumps to end |
| Row slot | rank changes | transform translateY | old slot → new slot | 420ms | `--out` | 200ms opacity only |
| Your row while climbing | play | box-shadow, transform | `--sh-you` → `--sh-lift`; 260ms moves | 240ms | `--ease` | no lift |
| Scrim | end + 700ms | opacity | 0 → 1 | 300ms | `--ease` | same |
| Result card | end + 700ms | transform translateY | 100% + 40px → 0 | 520ms | `--sheet` | 240ms opacity fade |
| Gem | card open | scale, rotate | 0.3 / −25° → 1.12 / 4° → 1 | 640ms, delay 220ms | `--out` | static |
| Rays (×8, every 45°) | card open | translateY, opacity | −30px / 1 → −64px / 0 | 700ms, delay 380ms | `--out` | hidden |
| Card parts | card open | opacity, translateY 10px → 0 | — | 360 / 460ms | `--ease` / `--out` | opacity only |

Stagger for card parts: gem 120ms, eyebrow 380ms, title 460ms, sentence 560ms, stats 700ms, buttons 860ms.

## States

- **Before the week ends:** button "▶ End of week" in ink; hover `#24403a`; active scale 0.96.
- **Playing:** button disabled (`#4a5a55`), clock text "Final day", your row lifted.
- **Ended:** clock "Week ended", delta "▲ 5" in `#8ee0b0` inside your row, button "Replay week".
- **Zones:** rank numeral colour follows the slot, not the player: green for slots 1–5, red for 17–20, ink otherwise.
- **Result card buttons:** "Replay week" is an inset 1.5px ink ring (hover `#e3eae6`); "Enter Jade" is solid `#17704c` with white text (hover `#125d3f`).
- **Focus-visible:** 3px ink outline, 3px offset on every button.

## Accessibility

- The board is a labelled region; each row has a full `aria-label` (ordinal, name, XP) so a screen reader does not read "9 NV You Ness Varga 1,240 XP".
- During the climb rows move with transforms only; DOM order is re-synced to rank after the run so reading order matches the visual order.
- Each pass is announced politely ("You passed Kit Moreau. Now 4th."), then the result ("Week over. You finished 4th and were promoted to Jade League.").
- The result is a modal dialog; focus moves to "Enter Jade" 520ms after it opens and back to the dock button on close. Escape closes it.
- Contrast: zone label `#155f35` on `#dcefe2` is 6.4:1, `#8a1a2c` on `#f7e4e3` is 7.6:1, `#b9c7c2` on `#13221e` is 9.4:1, white on `#17704c` is 6.1:1.
- Hit targets: dock button 52px tall, card buttons 52px.

## Responsive rules

- 360 wide: the board keeps 12px insets; names truncate with an ellipsis (`min-width:0` on the name cell); XP never wraps.
- Taller phones: the board grows (`flex:1`) and shows more rows; nothing else moves.
- Tablet: centre a 460px column; the result card stays max 436px.
- Very short screens: the board keeps scrolling; the dock and header never shrink.

## Acceptance checklist

### Always

- [ ] Ranks, zone colours, "XP to promotion" and the result stats are computed from XP by a sort, never typed.
- [ ] Top 5 slots sit on the green band and bottom 4 on the red band; the bands belong to slots, not players.
- [ ] The player's own row is a solid dark plate and is visible on the first frame without scrolling.
- [ ] End of week counts every player's XP over 3600ms and re-sorts every frame; rows slide 420ms expo-out to new slots.
- [ ] The climbing row is visibly lifted (bigger shadow) above the rows it passes.
- [ ] Each pass is announced through a polite live region.
- [ ] The result card's parts arrive one by one (gem, title, stats, buttons) and the card is `visibility:hidden` when closed.
- [ ] Replay restores the start state and plays again; it can run any number of times.
- [ ] Reduced motion: no slides, no pop, final state shown with fades.
- [ ] 34px clear below the dock, 54px above the header; no horizontal scroll at 390.

### This demo

- [ ] "Garnet League", "LANTERNFALL • WEEK 45", "2 days 14 h left", 20 players.
- [ ] You start 9th at 1,240 XP and finish 4th at 1,905 XP (+665, 5 places).
- [ ] Result says "PROMOTED / Jade League" with buttons "Replay week" and "Enter Jade".
- [ ] Krona One for title, ranks and stats; Instrument Sans for everything else.

## Implementation notes

**One sort drives everything.** Keep every player's element and move it by transform; write ranks and zone classes from the sorted array.

```js
const yOf = i => 28 + i * ROW + (i >= 5 ? 12 : 0) + (i >= 16 ? 28 : 0);
function rank(live) {
  const next = [...P].sort((a, b) => b.xp - a.xp || a.id - b.id);
  next.forEach((p, i) => {
    if (order[i] !== p) p.el.style.transform = `translateY(${yOf(i)}px)`;
    p.rk.textContent = i + 1;
    p.el.classList.toggle('zup', i < 5);
    p.el.classList.toggle('zdown', i >= 16);
  });
  order = next;
  if (!live) list.replaceChildren(...next.map(p => p.el)); // reading order, only when still
}
```

**Do not reorder the DOM mid-animation.** Removing and re-inserting a node cancels its running CSS transition, so rows would jump. Re-sort the DOM only at reset and at the end.

**Spread the passes.** Pick start and end XP so the crossing points `e = (rival.start − you.start) / (you.gain − rival.gain)` fall at different fractions of the run (here ≈ .10, .25, .44, .64, .91). Bunched crossings read as one blur.

```js
const tick = now => {
  const t = Math.min(1, (now - t0) / 3600), e = .5 - Math.cos(Math.PI * t) / 2;
  P.forEach(p => { p.xp = p.a + (p.b - p.a) * e; });
  paint();                               // numbers + dock
  if (myIndexAfterSort() !== order.indexOf(ME)) rank(true);
  t < 1 ? raf = requestAnimationFrame(tick) : finish();
};
```

Common mistakes:

- Painting the zone colour on the player instead of the slot, so a demoted player keeps a green rank after sliding down.
- Scrolling the board to "follow" your row while it climbs; it is already in view and the jump is disorienting.
- Leaving the closed result card off-screen but visible; it must be `visibility:hidden` so its text is not read or measured.
