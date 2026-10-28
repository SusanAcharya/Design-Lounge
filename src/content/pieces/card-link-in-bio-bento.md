---
title: "Link-in-bio bento"
summary: "A creator's link-in-bio page as a bento of tiles: profile, socials, a drawn latest-work tile, a playable podcast card, a shop drop and a workshop. Tiles press in on tap."
platform: mobile-web
type: screen
category: profile
tags: [link-in-bio, bento, creator, profile, podcast]
styles: [organic, soft, editorial]
motion: subtle
difficulty: 1
featured: false
published: 2026-10-28
palette: ["#E9ECE1", "#1F2B27", "#F5F1E6", "#A63D2A", "#C9D8C5"]
fonts: ["Limelight", "Cormorant Garamond"]
related: [card-music-playlist]
---

# Link-in-bio bento

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The one page a creator links from every profile, built as a bento grid instead of a stack of identical pill buttons. The invented creator is Wren Achterberg, a ceramicist with a podcast and a Sunday-only shop. Each link gets a tile shaped by what it is: a dark profile tile, four square social tiles, a tall "latest work" tile with a drawn celadon vase, an iron-red podcast tile with a waveform that moves when you press play, a sage shop tile with the next drop time, and a workshop tile with a date block. Every tile scales to 0.96 with an inset shadow when pressed and springs back on release. The detail worth copying is that tile size encodes priority: the vase and the podcast get two and three rows, the socials get one small square each.

## Reference behaviour

1. Initial state at 390 × 844: profile tile, the social row, then the work, podcast and shop tiles fill the first screen; the workshop tile starts just above the fold.
2. Press any tile (pointer-down): it scales to 0.96 over 140ms and its outer shadow becomes a 2px inset shadow. Release: it springs back over 320ms with a slight overshoot (`cubic-bezier(.34,1.56,.64,1)`).
3. The profile tile does not press; it is not a link.
4. Tap the podcast tile: the play glyph becomes a pause glyph, `aria-pressed` turns true, and the 28 waveform bars start bobbing (scaleY 1 → 0.45, 900ms alternate, each bar offset by −70ms). Tap again to stop.
5. The first 8 waveform bars are full cream (played), the rest at 55% opacity, matching "12:04 / 41:30".
6. Links are real `<a>` elements; in the demo their navigation is prevented.
7. At ≥ 700px wide the grid becomes four columns with named areas (see Responsive rules).

## Structure

```
390 × 844, 16px side padding, 62px top, tiles gap 10, radius 22
┌──────────────────────────────────────┐
│ ┌──────────────────────────────────┐ │
│ │ (WA)  Wren Achterberg  (Limelight 31)│ profile, span 2
│ │       @wren.makes · Leith studio  │ │ dark #1F2B27
│ │ Stoneware, slow radio, and a…     │ │
│ │ (● Taking commissions)(21.4k…)    │ │
│ └──────────────────────────────────┘ │
│ [Diary] [Films] [Letters] [Email]    │ 4 squares, span 2
│ ┌───────────────┐ ┌───────────────┐  │
│ │  drawn vase   │ │ KILN HOURS    │  │ work: span 3 rows
│ │               │ │ Glaze is a…   │  │ podcast: span 2 rows
│ │               │ │ ▌▌▐▌▐▐▌ wave  │  │
│ │───────────────│ │ (▶) 12:04/41:30│ │
│ │ LATEST WORK   │ ├───────────────┤  │
│ │ Tidal series  │ │ SHOP Sun 10am │  │ shop: 1 row
│ └───────────────┘ └───────────────┘  │
│ ┌──────────────────────────────────┐ │
│ │ [09 NOV] Wheel class for two [2 spots]│ workshop, span 2
│ └──────────────────────────────────┘ │
│        Achterberg Studio · address    │ footer
└──────────────────────────────────────┘
```

- `<main>` max-width 720px, centred. `.grid` is CSS grid, `repeat(2, minmax(0,1fr))`, `grid-auto-rows: minmax(84px, auto)`, gap 10px.
- `<section class="t pro" aria-label="Profile">`: avatar disc (initials in Limelight on an iron-red radial gradient, 3px ground ring + 1px outer line), `<h1>` name, handle line, bio `<p>` with one italic word, two status pills.
- `<nav class="soc" aria-label="Elsewhere">`: four `<a class="t">` squares (`aspect-ratio:1`), each a 40px icon well plus a label.
- `<a class="t work">`: drawn image area (`flex:1`, min 200px) with an inline SVG vase, then a cream caption block.
- `<button class="t pod" aria-pressed>`: kicker, title, episode line, `.wave` (28 bars), controls row with a 40px play disc and time.
- `<a class="t shop">` and `<a class="t ws">` (workshop with a 58 × 62 date block and a "2 spots" pill).
- Every tile that is a link shows a 32px round arrow chip in its top-right corner.

## Tokens

```css
:root {
  /* colour */
  --ground: #e9ece1;   /* page, icon wells */
  --ink: #1f2b27;      /* text, profile tile, date block */
  --ink-2: #5a6660;    /* secondary text on light tiles */
  --cream: #f5f1e6;    /* text on dark, work caption, workshop tile */
  --paper: #f9f7f1;    /* social tiles */
  --sage: #c9d8c5;     /* shop tile */
  --iron: #a63d2a;     /* podcast tile, focus ring */
  --iron-2: #8e3121;   /* "2 spots" text */
  --moss-ink: #a9b8b0; /* handle on the profile tile */
  --blush: #f2d3c6;    /* italic word in the bio */
  --spots-bg: #f3dcd3;

  /* type */
  --display: "Limelight", Georgia, serif;
  --serif: "Cormorant Garamond", Georgia, serif;

  /* layout */
  --pad: 16px;
  --gap: 10px;
  --r: 22px;      /* tiles */
  --r-s: 14px;    /* date block */
  --r-icon: 12px; /* icon wells */
  --tap: 40px;    /* play disc, icon wells */

  /* depth */
  --sh: 0 1px 0 rgba(31,43,39,.06), 0 10px 24px -16px rgba(31,43,39,.35);
  --sh-press: inset 0 2px 8px rgba(31,43,39,.18);

  /* motion */
  --t-press: 140ms;
  --t-release: 320ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --spring: cubic-bezier(.34, 1.56, .64, 1);
  --t-wave: 900ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Name | Limelight | 31px | 400 | 1 | +0.01em | Title |
| Avatar initials | Limelight | 28px | 400 | 1 | 0 | caps |
| Tile headline (work) | Limelight | 22px | 400 | 1.05 | 0 | sentence |
| Shop time | Limelight | 30px | 400 | 1 | 0 | sentence |
| Date numeral | Limelight | 26px | 400 | 1 | 0 | — |
| Bio | Cormorant Garamond | 21px | 500 | 1.25 | 0 | sentence, max 30ch |
| Podcast title | Cormorant Garamond | 21px | 700 | 1.08 | 0 | sentence |
| Workshop title | Cormorant Garamond | 20px | 700 | 1.1 | 0 | sentence |
| Body / meta | Cormorant Garamond | 15–17px | 500–600 | 1.35 | 0 | sentence |
| Kicker | Cormorant Garamond | 12px | 600 | 1 | +0.16em | UPPERCASE |
| Social label | Cormorant Garamond | 14px | 600 | 1 | 0 | Title |

Set `font-variant-numeric: lining-nums` on the body; Cormorant's default old-style 1 reads as a capital I in "10am".

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---:|---|---|
| `.t` | pointer-down / `:active` | transform, box-shadow | 1, `--sh` → .96, `--sh-press` | 140ms | `--ease` | instant, no scale |
| `.t` | release | transform, box-shadow | .96 → 1 | 320ms | `--spring` | instant |
| `.wave i` | podcast playing | scaleY | 1 → .45, alternate, infinite | 900ms | `--ease` | static bars |
| play glyph | podcast toggle | swap | triangle ↔ two bars | 0 | — | same |

The waveform is the only loop and only runs after the visitor presses play.

## States

- **Rest:** tile shadow `--sh`.
- **Pressed:** `transform: scale(.96)`, inset shadow; mirrored by a `.press` class on `pointerdown` because iOS Safari applies `:active` unreliably.
- **Focus-visible:** 3px `--iron` outline, 3px offset, on every tile.
- **Podcast playing:** `.on` class, `aria-pressed="true"`, label "Pause Kiln Hours episode 38", bars bobbing.
- **Commission status:** the 8px dot in the first pill is `#7fd19b` when open; swap for `--ink-2` and the text "Books closed" when not.
- **Low stock:** the workshop "2 spots" pill uses `--iron-2` on `--spots-bg`.

## Accessibility

- One `<h1>` (the creator's name). Tile headlines are `<h2>` only inside links; the podcast tile is a `<button>`, so its title is a `<span>` (buttons may only hold phrasing content).
- Every link has an `aria-label` that reads as a sentence ("Wheel class for two, Saturday 9 November, 2 spots left"); arrow chips and drawings are `aria-hidden`.
- The podcast button is a toggle with `aria-pressed` and a label that flips between Play and Pause.
- Socials sit in `<nav aria-label="Elsewhere">`.
- Contrast: cream on iron 5.6:1, cream on ink 13.0:1, `--ink-2` on cream 5.3:1, `--moss-ink` on ink 7.1:1, `#33433d` on sage 7.0:1.
- Hit targets: every tile is at least 82px square at 390 (74px at 360); the play disc is 40px but the whole tile is the button.

## Responsive rules

- 390: two columns as drawn.
- 360: same; tiles are 159px wide and social squares 74px; the bio wraps to three lines; nothing changes size.
- ≥ 700px: four columns and named areas, max-width 720px:

```css
.grid { grid-template-columns: repeat(4, minmax(0,1fr));
  grid-template-areas: "pro pro work pod" "pro pro work pod" "ws ws work shop" "soc soc soc soc"; }
```

  Social tiles drop `aspect-ratio` and become 104px tall; profile pills sit at the tile's bottom (`margin-top:auto`).
- ≥ 1280: same as 700, centred on the ground.

## Acceptance checklist

**Always**
- [ ] Tiles use a 2-column grid on phones with a 10px gap and 22px radius.
- [ ] Tile spans encode priority: the hero link spans 3 rows, the media tile 2, small links 1.
- [ ] Every pressable tile scales to 0.96 on press (140ms) and springs back (320ms, overshoot curve).
- [ ] The profile tile is not a link and does not press.
- [ ] The media tile is a toggle button with `aria-pressed`, a glyph swap and an animated waveform only while playing.
- [ ] Links are real anchors with sentence-style labels; decorative icons and drawings are hidden from assistive tech.
- [ ] Focus rings are visible on every tile.
- [ ] Nothing scrolls sideways at 360 or 390.
- [ ] Reduced motion removes the press scale and the waveform loop.

**This demo**
- [ ] Name "Wren Achterberg", handle "@wren.makes · Leith studio", pills "Taking commissions" and "21.4k followers".
- [ ] Socials: Diary, Films, Letters, Email.
- [ ] Work tile: "Tidal series · 14 pieces · celadon over iron clay" with a drawn vase.
- [ ] Podcast: "Kiln Hours · Glaze is a weather report · Ep 38 · with Sol Okonjo", 12:04 / 41:30.
- [ ] Shop "Sun 10am · 36 pieces drop · mugs from £38"; workshop "09 Nov · Wheel class for two · £140 per pair · 2 spots".

## Implementation notes

**Press feedback that works on iOS.** Use both `:active` and a pointer class, and give press and release different clocks:

```css
.t { transition: transform 320ms cubic-bezier(.34,1.56,.64,1), box-shadow 320ms cubic-bezier(.2,.7,.2,1); }
.t:active, .t.press { transform: scale(.96); box-shadow: inset 0 2px 8px rgba(31,43,39,.18);
  transition-duration: 140ms; transition-timing-function: cubic-bezier(.2,.7,.2,1); }
```

```js
tile.addEventListener('pointerdown', () => tile.classList.add('press'));
['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => tile.addEventListener(ev, () => tile.classList.remove('press')));
```

**A vase without an image.** Two stacked SVG paths share one silhouette: the clay body with a horizontal gradient, and the glaze clipped by a wavy lower edge that reads as drips:

```html
<path d="M44 6h32v8c0 6 26 20 30 52 4 34-14 64-46 78C28 130 10 100 14 66 18 34 44 20 44 14z" fill="url(#clay)"/>
<path d="M44 6h32v8c0 6 26 20 30 52 1 8 0 15-2 22-6-4-9 6-15 2-5-3-8 8-14 4-6-4-10 7-16 3-6-4-9 5-15 1-5-4-8 4-12 0C11 80 12 72 14 66 18 34 44 20 44 14z" fill="url(#glaze)"/>
```

**Offset loop phases with negative delays** so the waveform starts mid-motion instead of every bar moving in lockstep: `animation-delay: calc(var(--i) * -70ms)`.

Common mistakes: putting headings or `<div>`s inside the `<button>` tile; making every tile the same size (the page turns back into a list of pills); leaving Cormorant on old-style numerals for times and prices.
