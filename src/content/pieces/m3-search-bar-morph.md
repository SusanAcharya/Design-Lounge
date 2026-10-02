---
title: "M3 search bar morph"
summary: "A Material 3 Expressive container transform: a 56px pill search bar in a dark top app bar grows into a full-screen search view (radius 28→0) with suggestions fading in; the back arrow reverses it."
platform: mobile-app
type: animation
category: inputs
tags: [material, search, container-transform, app-bar, dark]
styles: [material, dark, kinetic]
motion: rich
difficulty: 2
featured: false
published: 2026-09-29
palette: ["#0F1512", "#252E2A", "#9AD6A8", "#1F4D2F", "#B5F2C3"]
fonts: ["Gabarito"]
related: [m3-expressive-home, m3-navigation-drawer]
---

# M3 search bar morph

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A **search bar → search view container transform** for "Fjord Bank", a mobile banking app, in Material 3 Expressive on a dark green-tinted scheme. A pill search bar (56px, 28px radius) floats in the top app bar region above a balance card and recent transactions. Tapping the bar makes the *same element* grow to fill the screen — its inset goes 16px→0, top 62px→0, height 56px→100%, radius 28px→0 — while the search icon rotates into a back arrow, the avatar shrinks away and the suggestions body fades up 200ms later. Typing filters transactions live with highlighted matches. The back arrow or Esc runs the transform in reverse on a faster accelerate curve. The detail worth copying is that nothing is duplicated: one container, one input, one leading icon button that morphs its glyph.

## Reference behaviour

1. Initial state: search pill at `top:62px; left:16px; right:16px; height:56px`, background `--surface-high`, with a search glyph, the placeholder "Search transactions" (17px) and a 32px avatar "LN". Behind it: a primary-container balance card ("24 318,40" at 40px) and a list of six transactions.
2. Tap anywhere on the pill: `body.open` is set. Over 500ms `cubic-bezier(.2,0,0,1)` the container moves to `inset:0`, height 100%, radius 0, background `--surface-c`. The input row gains 54px top margin (status clearance) on the same clock.
3. The leading button's search glyph fades out and rotates +90°, the back arrow fades in from −90° (150ms opacity, 500ms rotate). The avatar scales to .6 and fades in 150ms. The input receives focus at ~120ms.
4. The body (recent-search chips + "Suggestions" list of 4 transactions) fades from 0 and rises 8px, starting 200ms after the tap: opacity 300ms, transform 400ms, emphasized.
5. Type: the list filters transactions whose name contains the query (case-insensitive); the matched substring is rendered in `--primary` at weight 600. The heading becomes "2 results" / "1 result". A clear (×) button appears at the right of the input. No match: list empties and "No transactions match "xyz"." shows.
6. Tap a recent-search chip: its text fills the input and filters immediately.
7. Tap the back arrow, press Esc: container returns to the pill geometry over 300ms `cubic-bezier(.3,0,.8,.15)`; body fades out in 150ms with no delay; glyphs and avatar reverse; the query is cleared; focus returns to the pill.
8. While open, the page behind is `aria-hidden="true"` and its list is fully covered.

## Structure

```
390 × 844 — closed                          open
┌────────────────────────────────────┐   ┌────────────────────────────────────┐
│ (54px clearance)                   │   │ (54px clearance — row margin)      │
│ ╭────────────────────────────────╮ │   │ ←  Search transactions|         ×  │  row 56px
│ │ ⌕ Search transactions      (LN)│ │   │ RECENT SEARCHES                    │
│ ╰────────────────────────────────╯ │   │ [◷ Halden Ceramics][◷ rent][◷ …]  │  chips 36px
│ ╭────────────────────────────────╮ │   │ SUGGESTIONS                        │
│ │ Everyday · SEK                 │ │   │ [HC] Halden Ceramics    -1 240,00  │  56px rows
│ │ 24 318,40                      │ │   │ [LS] Salary · Loam    +38 900,00   │
│ │ Available · payday in 4 days   │ │   │ [NP] Nord Post             -84,00  │
│ ╰────────────────────────────────╯ │   │ [MC] Marrow Coffee         -46,00  │
│ RECENT                             │   │                                    │
│ [HC] Halden Ceramics    -1 240,00  │   │                                    │
│ [LS] Salary · Loam    +38 900,00   │   │                                    │
│ ...                                │   │                                    │
└────────────────────────────────────┘   └────────────────────────────────────┘
  pill: top 62 · inset 16 · h 56 · r 28      view: inset 0 · h 100% · r 0
```

- `<main id="main">` — scrolls; `padding-top:134px` (62 + 56 + 16) so content starts under the pill. Contains `.bal` card, `<h2>`, `<ul class="tx">`.
- `<div class="sv" role="search">` — the morphing container, `position:absolute; z-index:2; overflow:hidden`.
  - `.row` — 56px flex row: `<button class="ib" id="lead">` (two stacked SVGs: `.lens`, `.back`), `<input type="search">`, `.av` avatar, `<button class="ib clr">`, and `<button class="hit">` (an invisible full-row button used only when closed).
  - `.body` — `<h3>` + `.chips`, `<h3 id="rh">` + `<ul class="res" aria-live="polite">`, `<p class="empty">`.

Sample data (six transactions; `[name, meta, amount, tile initials]`; positive amounts render in `--primary`):

| Name | Meta | Amount | Tile |
|------|------|-------:|------|
| Halden Ceramics | Card · 27 Sep | −1 240,00 | HC |
| Salary · Loam Studio | Transfer · 25 Sep | +38 900,00 | LS |
| Nord Post | Postage · 24 Sep | −84,00 | NP |
| Marrow Coffee | Card · 24 Sep | −46,00 | MC |
| Rent · Brf Tessel | Standing order · 1 Sep | −11 250,00 | BT |
| Mira Pharmacy | Card · 22 Sep | −312,50 | MP |

Recent-search chips: "Halden Ceramics", "rent", "coffee". Balance card: "Everyday · SEK" / "24 318,40" / "Available · payday in 4 days". Closed suggestions show the first four rows.

## Tokens

```css
:root {
  /* tonal surfaces — dark, green bias */
  --surface: #0f1512;
  --surface-low: #161d19;       /* row hover behind */
  --surface-c: #1b2320;         /* open search view */
  --surface-high: #252e2a;      /* closed pill, icon tiles, result hover */
  --surface-highest: #303935;
  --on-surface: #dfe4df;
  --on-surface-v: #b6c4b9;      /* placeholder, secondary text */
  --outline: #7f8d82;
  --outline-v: #3b4641;         /* chip border */

  /* primary — sage */
  --primary: #9ad6a8;           /* avatar, match highlight, positive amounts, focus */
  --on-primary: #003919;
  --primary-c: #1f4d2f;         /* balance card */
  --on-primary-c: #b5f2c3;

  /* type */
  --font: "Gabarito", system-ui, sans-serif;
  --fs-balance: 40px; --fs-input: 17px; --fs-body: 15px; --fs-chip: 14px; --fs-h: 13px; --fs-tile: 12px;

  /* geometry of the transform */
  --bar-h: 56px;
  --r-bar: 28px;
  --inset: 16px;
  --top: 62px;                  /* 54 clearance + 8 */
  --r-card: 28px;
  --r-row: 16px;
  --r-tile: 12px;
  --r-chip: 10px;

  /* motion */
  --t-micro: 150ms;
  --t-big: 500ms;               /* open */
  --t-exit: 300ms;              /* close */
  --t-body-delay: 200ms;
  --ease-emph: cubic-bezier(.2, 0, 0, 1);
  --ease-exit: cubic-bezier(.3, 0, .8, .15);
}
```

## Typography

| Role              | Family   | Size | Weight | Line-height | Tracking | Case      |
|-------------------|----------|-----:|-------:|------------:|---------:|-----------|
| Balance           | Gabarito | 40px | 600    | 1.05        | −0.03em  | numerals  |
| Balance labels    | Gabarito | 13px | 500    | 1.4         | 0        | sentence  |
| Input / placeholder | Gabarito | 17px | 400  | 1           | 0        | sentence  |
| Section heading   | Gabarito | 13–14px | 600 | 1.3         | +0.06em  | UPPERCASE |
| Row title         | Gabarito | 15px | 500    | 1.35        | 0        | sentence  |
| Row subtitle      | Gabarito | 13px | 400    | 1.4         | 0        | sentence  |
| Amount            | Gabarito | 15px | 600    | 1           | 0        | tabular numerals |
| Chip              | Gabarito | 14px | 500    | 1           | 0        | as typed  |
| Icon tile initials| Gabarito | 12px | 700    | 1           | 0        | UPPERCASE |
| Match highlight   | Gabarito | 15px | 600    | —           | 0        | colour `--primary` |

## Motion

| Element        | Trigger | Property                       | From → To                          | Duration | Easing        | Delay |
|----------------|---------|--------------------------------|------------------------------------|---------:|---------------|------:|
| `.sv`          | open    | top, left, right, height, border-radius, background | 62/16/16/56px/28px/high → 0/0/0/100%/0/surface-c | 500ms | `--ease-emph` | 0 |
| `.sv`          | close   | same                           | reverse                            | 300ms    | `--ease-exit` | 0 |
| `.row`         | open    | margin-top                     | 0 → 54px                           | 500ms    | `--ease-emph` | 0 |
| `.lens`        | open    | opacity, rotate                | 1, 0 → 0, 90°                      | 150 / 500ms | `--ease-emph` | 0 |
| `.back`        | open    | opacity, rotate                | 0, −90° → 1, 0                     | 150 / 500ms | `--ease-emph` | 0 |
| `.av`          | open    | opacity, scale                 | 1, 1 → 0, .6                       | 150ms    | linear        | 0 |
| `.body`        | open    | opacity, translateY            | 0, 8px → 1, 0                      | 300 / 400ms | `--ease-emph` | 200ms |
| `.body`        | close   | opacity, translateY            | 1, 0 → 0, 8px                      | 150ms    | `--ease-exit` | 0 |
| `.clr`         | typing  | opacity                        | 0 → 1                              | 150ms    | linear        | 0 |
| `.res li`      | hover   | background                     | transparent → surface-high         | 0        | —             | instant |

Reduced motion: all durations 1ms, delays 0. The view still swaps between pill and full screen; focus still moves into the input.

## States

- **Closed:** container is the pill; `.hit` covers the row and is the only tab stop; input and leading button are `tabindex="-1"`; leading button labelled "Search".
- **Open:** `body.open`; `.hit` is `display:none`; input `tabindex="0"` and focused; leading button labelled "Back"; `main` is `aria-hidden="true"`.
- **Has query:** `.row.has` — clear button visible; heading shows result count; matches highlighted.
- **Empty result:** `.res` empty, `.empty` visible with the quoted query.
- **Focus-visible:** 3px `--primary` outline, −3px offset on buttons, chips, the hit area and result rows.
- **Positive amount:** `.in` colour `--primary`.

## Accessibility

- Container is `role="search"`; the input has `aria-label="Search transactions"` and `type="search"`.
- Closed, the entire pill is one `<button aria-label="Open search">` in the tab order; open, the order is Back → input → Clear (when visible) → chips → results (rows are `tabindex="0"`).
- Esc closes and returns focus to the pill's hit button.
- Results list is `aria-live="polite"` so counts and matches are announced as you type; the heading text ("3 results") changes with it.
- The page behind gets `aria-hidden="true"` while open.
- Contrast: `--on-surface-v` on `--surface-c` 9.4:1; `--primary` on `--surface-c` 9.6:1; `--on-primary-c` on `--primary-c` 8.5:1.
- Hit targets: leading and clear buttons 48px, pill 56px, chips 36px (allow 44px row spacing), result rows 56px.

## Responsive rules

- 390 wide: as specified.
- 360 wide: identical geometry; the balance figure drops to 36px so it fits with the labels.
- ≥ 600 wide: keep the pill at `max-width:560px` centred (`left/right:auto; margin:0 auto`), and open to a 560px centred sheet with 28px radius rather than full-bleed; the scrim behind is `rgba(15,21,18,.5)`.
- Landscape: the open row still reserves the top safe area; the body scrolls internally.

## Acceptance checklist

- [ ] Closed pill is 56px tall, 28px radius, inset 16px, top 62px, `#252E2A`.
- [ ] Opening transitions top/left/right/height/border-radius on one element over 500ms `cubic-bezier(.2,0,0,1)` to `inset:0; radius:0`.
- [ ] Closing uses 300ms `cubic-bezier(.3,0,.8,.15)`.
- [ ] The search glyph rotates +90° out while the back arrow rotates in from −90°; both share the 500ms clock, opacity 150ms.
- [ ] The suggestions body starts fading in 200ms after the tap and rises 8px.
- [ ] Input is focused within 150ms of opening; Esc and the back arrow close.
- [ ] Typing filters by substring, highlights the match in `#9AD6A8`, and updates the heading to "N result(s)".
- [ ] A clear button appears only when the input has text; it empties the input and keeps focus there.
- [ ] Empty results show "No transactions match "…"." and the list is empty.
- [ ] The page behind is `aria-hidden` while the view is open.
- [ ] Focus rings are visible on the pill, back, clear, chips and result rows.
- [ ] Reduced motion: state change still completes; no residual delays.

## Implementation notes

**Morph one absolutely positioned container by its box, not by scale.** Scaling would distort the text; transitioning the inset keeps everything crisp. Give open and closed rules different transition lists so the two speeds are explicit:

```css
.sv { position:absolute; top:62px; left:16px; right:16px; height:56px; border-radius:28px; overflow:hidden;
  transition: top 300ms var(--ease-exit), left 300ms var(--ease-exit), right 300ms var(--ease-exit),
              height 300ms var(--ease-exit), border-radius 300ms var(--ease-exit), background 300ms; }
.open .sv { top:0; left:0; right:0; height:100%; border-radius:0; background:var(--surface-c);
  transition: top 500ms var(--ease-emph), left 500ms var(--ease-emph), right 500ms var(--ease-emph),
              height 500ms var(--ease-emph), border-radius 500ms var(--ease-emph), background 500ms; }
```

**Glyph swap by rotation** — stack both SVGs absolutely in one 48px button:

```css
.ib svg { position:absolute; transition: opacity 150ms, transform 500ms var(--ease-emph); }
.ib .back { opacity:0; transform:rotate(-90deg); }
.open .ib .back { opacity:1; transform:none; }
.open .ib .lens { opacity:0; transform:rotate(90deg); }
```

**Highlight the match without innerHTML injection** — split the name around the index:

```js
const i = name.toLowerCase().indexOf(q.toLowerCase());
b.append(name.slice(0, i));
const m = document.createElement('mark'); m.textContent = name.slice(i, i + q.length);
b.append(m, name.slice(i + q.length));
```

Common mistakes: fading the pill out and a new full-screen view in (breaks continuity — it must be the same element); forgetting the 54px top margin on the row when open, so the input lands under the status bar; leaving the input focusable while closed (two tab stops for one control).
