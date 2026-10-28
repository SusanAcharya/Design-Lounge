---
title: "ASCII art homepage"
summary: "A homepage drawn in 7-bit ASCII on a monospace grid: a generated sunset with a packet on a wire, a typing command line, bracket buttons that go solid."
platform: web
type: screen
category: landing
tags: [ascii, monospace, homepage, generative, plain-text]
styles: [terminal, paper, minimal]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-28
palette: ["#F1ECE1", "#1C1A16", "#544E44", "#A8391B", "#E8E1D2"]
fonts: ["IBM Plex Mono"]
related: [ascii-style, terminal-ui-style]
---

# ASCII art homepage

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The marketing homepage for "Fernwire", an invented sync tool for plain-text notes, drawn entirely with characters on a monospace grid. The hero illustration is a sunset over three ridges with a wire strung between two poles, generated in JS from 7-bit ASCII at whatever width the column has; a rust `o` (a note in transit) travels along the wire. Dividers, buttons (`[ Download for macOS ]`), the product diagram and the pricing frames are characters too. The page sits on warm paper, not black, so it reads as a printed manual rather than a terminal clone. The detail worth copying: **every glyph in the art, frames and buttons is in U+0020 to U+007E**, because Google Fonts' monospace subsets ship no box-drawing or block characters, and one fallback glyph breaks the grid.

## Reference behaviour

1. Initial state at 1280 × 800: a 72px nav with a dashed bottom rule; a two-column hero (46ch copy column, art column fills the rest), bottom-aligned; under it a "how it works" divider. The art is already drawn, the clock already shows local time, and the typing line is mid-type.
2. The nav clock reads `HH:MM:SS  local` and updates every 1000ms.
3. The typing line in the hero types a command at 70ms per character after a `$ ` prompt, waits 420ms, prints the result on the second line after `> `, and starts the next of three commands every 6000ms: `fernwire sync ~/notes` → `1,204 files · 3 devices · 0 conflicts`; `fernwire log --today` → `14 notes changed · 2.1 KB of diffs`; `fernwire relay status` → `eu-2 healthy · holding 0 bytes`. A 1ch block cursor blinks with `steps(1)` at 1.1s.
4. The art redraws every 120ms: the packet `o` advances 2.5% of the wire per tick (one crossing every 4.8s); the caption reads `relay eu-2 · packet  NN%`. Nothing else in the art moves.
5. Hover or focus a bracket button: an ink block grows from the left edge across the full label, brackets included, over 220ms; label and brackets turn paper. The brackets "go solid". The primary button is rust-filled at rest and turns ink on hover.
6. Hover a nav link: text goes from `--ink-2` to `--ink`, and a `./` prefix (already laid out, transparent) turns rust, so nothing shifts.
7. The changelog form at the foot: submit empties the field and its placeholder becomes "subscribed, thanks".
8. Resize: the art is regenerated to the column's character count; at < 640px it draws 18 rows instead of 24 and the diagram swaps to a vertical version.

## Structure

```
1280 × 800  (wrap 1184px, gutter 48px; 15px/24px Plex Mono; 1ch ≈ 9px)
+------------------------------------------------------------------------------+
| [~] fernwire   how it works  pricing  changelog  manual   20:37:03 local [ sign in ] | 72
| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
|                                                                              |
| v3.2 · sync for plain-text notes            *  .        .                    |
| Notes that                                -+-     @@@@@         -+-          |
| stay .txt   (72px, 600)                    |__  @@@@@@@@@     __|            |
| lede 44ch                                  |  ---___o___----    |           | art 13/15
| +- $ fernwire sync ~/notes_ ---+           |  ##########        |           | 24 rows
| |  > 1,204 files · 3 devices   |    ....::::::::::::::.......... |           |
| +------------------------------+    ::::::::::::::::::::::::::::|           |
| [ Download for macOS ]  [ Read the manual ]  //////////////////////////////  |
|                                       fig.1 a note in transit   relay eu-2 · packet 50% |
| how it works - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
| +-------+       +-------+       +-------+  |  what it does, plainly         |
| |laptop |<=====>| relay |<=====>| phone |  |  [x] Syncs any folder ...       |
+------------------------------------------------------------------------------+
below the fold: pricing (3 framed plans) · footer with changelog email field
```

- `<header class="nav">`: logo link (`[~]` in rust + "fernwire" 600), `<nav><ul>` of four links, `<span class="clock">`, a `.btn` "sign in".
- `<main>`:
  - `<section class="hero">`: grid `minmax(0,46ch) minmax(0,1fr)`, gap 4ch, `align-items: end`, padding `56px 0 24px`. Left: `.eyebrow`, `<h1>`, `.lede`, `.type` (two lines), `.ctas`. Right: `<figure>` holding `<pre class="art" role="img" aria-label>` and a `<figcaption class="cap">` with two spans.
  - `.div` dividers: a bold label then an `::after` string of `- ` repeated, clipped with `overflow: hidden`.
  - `<section class="how">`: grid `minmax(0,1fr) 40ch`. Left: `<pre class="diag h">` (horizontal, 77 columns) and `<pre class="diag v" aria-hidden>` (vertical, 21 columns), then a note. Right: `<table class="spec">` with `[x]` / `[ ]` rows.
  - `<section class="plans">`: three `<article class="plan">` with an `<h3>` that sits on the top border (`[ plus ]`), a 32px price, `+ ` list items. The middle plan is inverted (ink fill).
- `<footer class="foot">`: copyright line and a `<form class="sub">` with label `changelog >` and an email input.

## Tokens

```css
:root {
  /* colour: warm paper, one rust accent */
  --paper: #f1ece1;      /* page */
  --paper-2: #e8e1d2;    /* typing-line well */
  --ink: #1c1a16;        /* text, frames, button fill on hover, hot plan */
  --ink-2: #544e44;      /* nav links, captions, far ridges, stars (7.0:1 on paper) */
  --rule: #8a8172;       /* dashed rules, divider dashes, well border */
  --rust: #a8391b;       /* accent: sun, packet, brackets, primary button (5.5:1 on paper) */
  --rust-ink: #fff6ea;   /* text on rust */
  --rust-soft: #f0a184;  /* list markers on the ink plan */

  /* type: one family */
  --mono: "IBM Plex Mono", ui-monospace, Menlo, monospace;
  --fs: 15px; --lh: 24px;          /* body */
  --fs-h1: clamp(36px, 5.6vw, 72px);
  --fs-price: 32px;
  --fs-diag: 14px; --lh-diag: 20px;
  --art-fs: 13px; --art-lh: 15px;  /* art grid */
  --fs-cap: 13px;

  /* layout */
  --wrap: 1184px; --gut: 48px;
  --nav-h: 72px;
  --hero-cols: minmax(0, 46ch) minmax(0, 1fr);
  --btn-h: 40px;
  --radius: 0;

  /* motion */
  --t-micro: 140ms;
  --t-fill: 220ms;
  --type-step: 70ms; --type-pause: 420ms; --type-cycle: 6000ms;
  --art-tick: 120ms; --packet-step: 0.025;
  --blink: 1.1s;
  --ease: cubic-bezier(.2, .7, .2, 1);

  /* focus */
  --focus: 2px dashed var(--rust); --focus-offset: 3px;
}
```

## Typography

| Role | Family | Size / line | Weight | Tracking | Colour |
|---|---|---|---|---|---|
| H1 "Notes that stay .txt" | IBM Plex Mono | clamp(36px, 5.6vw, 72px) / 1.02 | 600 | -0.035em | `--ink`, `.txt` in `--rust` |
| Body, lede, nav | IBM Plex Mono | 15 / 24 | 400 | 0 | `--ink` / `--ink-2` |
| Logo | IBM Plex Mono | 15 / 24 | 600 | 0 | `[~]` rust |
| Buttons | IBM Plex Mono | 15 / 24 | 500 | 0 | brackets rust |
| Art | IBM Plex Mono | 13 / 15 | 400 (packet 600) | 0 | sun rust, far ridges and stars `--ink-2`, near ridge and poles `--ink` |
| Diagram | IBM Plex Mono | 14 / 20 | 400 (labels 600) | 0 | "diffs" rust |
| Price | IBM Plex Mono | 32 / 40 | 600 | -0.02em | |
| Caption | IBM Plex Mono | 13 / 24 | 400 | 0 | `--ink-2` |

Set `font-variant-ligatures: none` on `body`. Plex Mono ligates nothing by default, but swapping the family for one that does (`<=>`, `->`) breaks the diagram.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
|---|---|---|---|---|---|
| Clock | load, every 1000ms | text | time | instant | still updates (it is content) |
| Typing line | load, every 6000ms | text, one char per tick | "" → command | 70ms per char, result after 420ms | full command and result, no cycling |
| Cursor | always | background | ink ↔ transparent | 1.1s `steps(1)` | static |
| Packet on wire | every 120ms | redraw art | t → t + 0.025 | stepwise | art drawn once, packet at 0% |
| Button fill | hover / focus | `::after` `transform: scaleX` | 0 → 1, origin left | 220ms `--ease` | 1ms |
| Bracket colour | hover / focus | `color` | rust → paper | 140ms `--ease` | 1ms |
| Nav `./` prefix | hover | `color` | transparent → rust | 140ms `--ease` | 1ms |
| Button press | active | `transform` | 0 → translateY(1px) | instant | same |

## States

- **Bracket button rest:** no fill, label `--ink`, brackets `--rust`, height 40px, no border.
- **Hover / focus-visible:** ink block fills left to right inset 6px top and bottom (so it hugs the text line), label and brackets become `--paper`.
- **Primary rest:** rust block (`--rust`), text and brackets `--rust-ink`. **Hover:** block becomes `--ink`.
- **Active:** `translateY(1px)`.
- **Focus-visible (all links, inputs):** `2px dashed --rust`, offset 3px.
- **Nav link hover:** `--ink`, `./` prefix appears in rust (it is always laid out as transparent text).
- **Spec table:** `[x]` rows are what the product does, `[ ]` rows what it never does; both markers in rust.
- **Plan "plus":** inverted, ink fill, paper text, title tab on rust.
- **Email field:** 1px `--ink-2` border, 2px `--ink` bottom; placeholder `--ink-2`; after submit the placeholder reads "subscribed, thanks".

## Accessibility

- The art is `<pre role="img">` with an `aria-label` that describes the drawing; screen readers do not read 1,700 punctuation marks. The vertical diagram duplicate is `aria-hidden`; the horizontal one has `role="img"` and a label that states what the diagram says.
- The typing line is `aria-live="off"`: it repeats, so announcing it would be noise. The same facts are in the lede and diagram.
- The clock has `aria-label="Local time"`.
- Bracket characters live in `<b>` inside the link, so the accessible name is "[ Download for macOS ]"; if that reads badly in your stack, wrap the brackets in `aria-hidden="true"` spans.
- Contrast on `--paper`: `--ink` 14.8:1, `--ink-2` 7.0:1, `--rust` 5.5:1; `--rust-ink` on `--rust` 6.0:1; `--paper` on `--ink` 14.8:1. Every glyph of the art meets 4.5:1 because the art uses only these three inks.
- The email input keeps 3:1 against the paper through its `--ink-2` border.
- Tab order: logo, nav links, sign in, the two hero buttons, footer email.

## Responsive rules

- ≥ 1280: as drawn; the art fills about 70 columns.
- 900–1279: hero columns keep their ratio; the art regenerates to fewer columns; the H1 shrinks with its clamp.
- < 900: hero stacks (copy, then art), `how` stacks (diagram, then table), plans stack to one column, nav links hide (logo, clock and sign in remain).
- < 640: gutter 16px, body 14/22, art 11/13 and 18 rows, the horizontal diagram is swapped for the 21-column vertical one, the nav "sign in" hides, plans gap 28px so the tab titles clear the card above. At 390 nothing scrolls sideways.

## Acceptance checklist

**Always**
- [ ] Every glyph in the art, frames, diagram and buttons is in U+0020–U+007E (copy may add `·` from Latin-1); no box-drawing or block characters anywhere.
- [ ] One monospace family; `font-variant-ligatures: none` on body.
- [ ] The art is generated to `floor(column width / measured ch width)` columns and redraws on resize.
- [ ] The art uses at most three inks, each ≥ 4.5:1 on the paper.
- [ ] Bracket buttons fill left to right over 220ms on hover and keyboard focus, and brackets change colour with the label.
- [ ] The typing line types at 70ms per char and shows the full text with no cycling under reduced motion.
- [ ] Below 640px the diagram swaps to the vertical version and the page has no horizontal scroll at 390.
- [ ] All interactive elements show a 2px dashed rust focus ring at 3px offset.
- [ ] The art and diagram have `role="img"` and a written description.

**This demo**
- [ ] H1 reads "Notes that stay .txt" with ".txt" in `#A8391B`.
- [ ] The three typing commands and results match Reference behaviour 3.
- [ ] The packet crosses the wire in 4.8s; caption shows `relay eu-2 · packet NN%`.
- [ ] Plans are solo $0, plus $4 / month (inverted), self-host $29 once.
- [ ] Nav clock shows `HH:MM:SS  local` and ticks every second.

## Implementation notes

**Measure the character cell, then generate to fit.** Never hard-code columns; fonts differ by a fraction of a pixel and the right edge ragged-breaks.

```js
const probe = document.createElement('span');
probe.textContent = '0000000000'; probe.style.visibility = 'hidden';
art.appendChild(probe);
const cw = probe.getBoundingClientRect().width / 10 || 7.8; probe.remove();
const cols = Math.max(30, Math.floor(art.clientWidth / cw));
const lh = parseFloat(getComputedStyle(art).lineHeight);
const asp = cw / lh;               // scale x by this so a circle stays round
```

**Paint order for the art.** For each cell: sky (hash-seeded `.` and `*`, never `Math.random`, so it is stable between frames), then the sun (a circle in row units, ramp `@%#*+=-:.` by row, blank every other row below its centre for sunset bands), then three ridges far to near (edge glyph from the slope: `/` rising, `\` falling, `_` flat; fill `.`, `:`, `/`), then poles `|` with `-+-` caps, then the wire. The wire uses `-` when the curve's fractional row is < 0.5 and `_` otherwise, which doubles its vertical resolution.

```js
const wire = x => { const t = (x - p1) / (p2 - p1); return top + .4 + rows * .13 * (1 - (2 * t - 1) ** 2); };
if (x > p1 && x < p2) { const w = wire(x), wy = Math.floor(w);
  if (y === wy) { ch = (w - wy) < .5 ? '-' : '_'; if (x === pk) { ch = 'o'; c = 'p'; } } }
```

**Brackets that go solid** without shifting layout: the fill is a pseudo-element behind the text, scaled from 0.

```css
.btn { position: relative; isolation: isolate; height: 40px; }
.btn::after { content: ""; position: absolute; inset: 6px 0; background: var(--ink);
  transform: scaleX(0); transform-origin: left; transition: transform 220ms var(--ease); z-index: -1; }
.btn:hover::after, .btn:focus-visible::after { transform: scaleX(1); }
.btn:hover, .btn:hover b { color: var(--paper); }
```

Common mistakes: using `│ ┌ █` from a cheat sheet (they fall back to Menlo or DejaVu with a different advance and the frame tears); letting the art `<pre>` set the column width (give its grid track `minmax(0,1fr)` and the pre `overflow: hidden`); greying the far ridges below 4.5:1 for "atmosphere", which fails contrast because every glyph is text.
