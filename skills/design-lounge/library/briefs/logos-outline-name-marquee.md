<!-- Design Lounge Nº 326 · "Outline name marquee" · www.designlounge.live -->

# Outline name marquee

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Studied from moremedia.at: the "our clients" wall where the names themselves are the logos, set huge in outline type and drifting in rows that alternate direction, plus the slowly rotating circular-text badge used as a link. This rebuild is for **Ombra**, a fictional design studio, and flips it to a warm plum-black page with cream outlines. Hovering a name fills it solid apricot, pauses its row, and a caption under the rows says what the studio made for that client and since when. The detail worth copying is that the wall stops being a brag and becomes an index: each name answers "what did you do for them?" without leaving the section.

## Structure

```
1280 × 800
┌────────────────────────────────────────────────────────────────────────┐
│ SELECTED CLIENTS · 2014–2026                       64 companies, …     │ pad 44/64
│ Some of the people we have                         (15px, 30ch)        │
│ made things with           (52px serif)                                │
│                                                                        │
│ …mmer Opera  ○  Pellucid Optics  ○  Wendle Da…          ← 64s          │ 92
│ ○ [Ivelle Ferries]  ○  Mossgiel Hotels  ○  Oberla…       → 76s          │ 92
│ …he & Linden  ○  Ostwick Coffee  ○  Pelham Cli…          ← 58s          │ 92
│ … ○  The Glass Archive  ○  Stillwell Trust  ○  Oak…      → 70s          │ 92
│ ────────────────────────────────────────────────────────────────────── │ 1px
│ ● NOW SHOWING                                              ╭ALL WORK╮  │
│ Ivelle Ferries — Timetables, booking and onboard signs     │   ↗    │  │ 124
│ Since 2021 · row 2 of 4                                    ╰────────╯  │
└────────────────────────────────────────────────────────────────────────┘
```

- `section[aria-labelledby]` > `.top` (eyebrow, `h2`, note), `.rows`, `.bottom`, and a visually hidden `ul.sr` client list.
- Each `.row` is `div[role=group][tabindex=0]` with an `aria-label` naming its number and direction. Inside: `.track` > two `.set`s (both `aria-hidden`; the hidden list carries the names).
- Each `.set`: `span.name[data-k="row-index"]` + `span.dot`, repeated.
- `.bottom`: `.now[aria-live=polite]` (key, value, year line) and `a.badge` holding a ring SVG with `textPath` and an arrow SVG.

## Motion

| Thing | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---:|---|---|
| Row 1 / 3 track | load | translateX | 0 → −50% | 64s / 58s | linear, infinite | static, clone hidden |
| Row 2 / 4 track | load | translateX | −50% → 0 (reverse) | 76s / 70s | linear, infinite | static, clone hidden |
| Track | row hover / focus | animation-play-state | running → paused | 0 | — | — |
| Name | select | color, stroke colour | transparent / cream 62% → apricot | 200ms | standard | instant |
| Ring | load | rotate | 0 → 360° | 22s | linear, infinite | static |
| Badge arrow | hover / focus | rotate, colour | 0 → 45°, cream → apricot | 350ms | expo out | instant |

The four durations are deliberately unrelated so the rows never line up into a grid.

## States

- Name rest: outline only.
- Name selected: solid apricot fill and stroke. Exactly one name (plus its clone) is selected at any time.
- Row hover / focus: paused. Focus-visible: 2px apricot outline, inset 2px.
- Badge rest: spinning ring, cream arrow. Hover: arrow 45° apricot, ring text apricot. Focus-visible: 2px apricot ring, 2px offset, round.
- Caption always shows the selected client; it is never empty.

## Accessibility

- The moving sets are `aria-hidden`. A visually hidden `ul` lists every client as "Name: project, since year", so screen readers get a calm list, not a ticker.
- Rows are focusable groups with labels such as "Client row 2 of 4, scrolling right. Arrow keys read names." Focus pauses the row (`:focus` and `:focus-within`).
- Keys on a focused row: ← previous, → next (wrap), Home first, End last.
- The caption is `aria-live="polite"`, so stepping names announces them.
- The badge is a link with `aria-label="See all work"`; both SVGs are `aria-hidden`.
- Contrast: `#EADFCB` on `#191517` ≈ 14:1; `#B3A895` ≈ 7.8:1; `#FF9F6B` ≈ 8.9:1. Outlined names are large display type; the hidden list and caption carry the same information at full contrast.
- Motion never exceeds one row-width per minute and stops on hover, focus, or reduced motion.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1100: horizontal padding 32px; heading 44px.
- 768–1023: same; keep four rows.
- < 760: top block stacks (heading 36px, note below), rows 64px with 46px names and 20px dot gaps, caption 22px, badge 96px.
- Reduced motion: each row shows its first names from the left edge and clips at the right. Do not wrap names onto a second line.
- At 375px: no horizontal scroll (rows clip with `overflow: hidden`).

## Acceptance checklist

### Always

- [ ] Client names are set in type, outlined, very large — no logo images.
- [ ] Four rows, alternating direction, each with its own unrelated duration.
- [ ] One name is selected at load and the caption already describes it.
- [ ] Hovering a name fills it and its clone and updates the caption; the hovered row pauses and resumes from the same offset.
- [ ] Rows are keyboard focusable; arrows step through names; the caption is a polite live region.
- [ ] The moving sets are `aria-hidden` and a hidden list carries the names once.
- [ ] Circular text badge links onward and rotates slowly; it stops under reduced motion.
- [ ] Reduced motion stops all drifting and hides the clone set.
- [ ] One accent colour for fill, accent words and focus.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] 24 fictional clients, six per row; row 2 starts with "Ivelle Ferries" filled.
- [ ] Durations 64s, 76s, 58s, 70s; ring 22s.
- [ ] Names 70px Hanken Grotesk 800 with a 1px `rgba(234,223,203,.62)` stroke on `#191517`.
- [ ] Fill colour `#FF9F6B`; heading and caption in Instrument Serif.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: eyebrow "SELECTED CLIENTS · 2014–2026", a 52px serif heading "Some of the people we have *made things* with" (the two words in apricot italic), and a 15px note on the right.
2. Four 92px rows of 70px outlined names (Hanken Grotesk 800, 1px cream stroke at 62%, transparent fill) separated by 10px ring dots with 34px margins on each side.
3. Rows 1 and 3 drift left; rows 2 and 4 drift right. Durations 64s, 76s, 58s, 70s, linear, infinite.
4. "Ivelle Ferries" (row 2) starts filled apricot, and the caption reads "Ivelle Ferries — *Timetables, booking and onboard signs*" with "Since 2021 · row 2 of 4".
5. Hover any name: the previous fill clears, this name (and its clone) fills apricot over 200ms, the caption updates. The hovered row pauses in place; other rows keep moving.
6. Leave the row: it resumes from the same offset. The last name stays filled.
7. Tab focuses a row (2px apricot outline inset). Focus pauses it and selects its first name unless one in that row is already selected. ←/→ step through that row's names (wrapping), Home/End jump.
8. Bottom right: a 124px ring badge "ALL WORK · ALL WORK · ALL WORK ·" rotating once every 22s around a ↗ arrow. Hover/focus turns the arrow 45° and apricot; the ring text turns apricot on hover.
9. Reduced motion: rows and badge stop; the clone set hides; names still fill and caption on hover and arrows.

## Tokens

```css
:root {
  --bg: #191517;                          /* warm plum-black */
  --cream: #eadfcb;                       /* headings, caption, ring text */
  --cream-2: #b3a895;                     /* eyebrow, note, year line */
  --stroke: rgba(234, 223, 203, 0.62);    /* outline names, dots */
  --line: rgba(234, 223, 203, 0.14);      /* rule above caption */
  --apricot: #ff9f6b;                     /* filled name, italic words, focus */

  --sans: "Hanken Grotesk", system-ui, sans-serif;
  --serif: "Instrument Serif", Georgia, serif;

  --row-h: 92px;
  --name: 70px;
  --dot: 10px;
  --dot-gap: 34px;
  --badge: 124px;
  --pad-x: 64px;

  --d1: 64s; --d2: 76s; --d3: 58s; --d4: 70s;
  --spin: 22s;
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
|---|---|---:|---:|---:|---:|---|
| Eyebrow / caption key | Hanken Grotesk | 11px | 600 | 1 | 0.18em | UPPER |
| Heading | Instrument Serif | 52px | 400 | 1.02 | −0.01em | max 20ch, 2 lines; accent words italic |
| Note | Hanken Grotesk | 15px | 400 (lead 600) | 1.5 | 0 | max 30ch |
| Client name | Hanken Grotesk | 70px | 800 | 1 | −0.035em | outline only, 1px stroke |
| Caption | Instrument Serif | 28px | 400 | 1.2 | 0 | name roman, project italic |
| Year line | Hanken Grotesk | 14px | 400 | 1.5 | 0 | — |
| Ring text | Hanken Grotesk | 10.5px | 600 | 1 | 0.32em | UPPER, on a 48px-radius path |

## Implementation notes

**Outline type and fill.** Use a transparent fill with `-webkit-text-stroke`; transition both colour properties. Stroke at 1px — 2px turns 70px type into a blob.

```css
.name { font: 800 70px/1 var(--sans); letter-spacing: -.035em; white-space: nowrap;
  color: transparent; -webkit-text-stroke: 1px var(--stroke);
  transition: color .2s var(--ease), -webkit-text-stroke-color .2s var(--ease); }
.name.on { color: var(--apricot); -webkit-text-stroke-color: var(--apricot); }
```

**Closed loop, reversed rows.** Two identical sets in one track, animate to −50%. Reverse rows with `animation-direction: reverse` rather than a second keyframe, and pause with `animation-play-state` so leaving the row does not snap it.

```css
.track { display: flex; width: max-content; animation: marq var(--d) linear infinite; }
.row.rev .track { animation-direction: reverse; }
.row:hover .track, .row:focus .track { animation-play-state: paused; }
@keyframes marq { to { transform: translateX(-50%); } }
```

**Select by key, not by element.** Every name carries `data-k="row-index"`, so one call fills the original and its clone, whichever the pointer happened to touch:

```js
function show(r, i) {
  document.querySelectorAll('.name.on').forEach(e => e.classList.remove('on'));
  document.querySelectorAll(`.name[data-k="${r}-${i}"]`).forEach(e => e.classList.add('on'));
  // write caption: name roman, " — " + project italic; "Since " + year
}
```

Use one delegated `mouseover` on each track instead of a listener per name.

**Ring text.** One circle path, one `textPath`; repeat the phrase three times so it closes the circle at 10.5px with 0.32em tracking on a 48px radius. Rotate the SVG, not the arrow.

Common mistakes: solid grey names (loses the outline idea); all rows the same direction and speed; filling the name only in one of the two copies, so it flickers as the loop wraps; restarting the animation on mouseleave; reading the ticker to screen readers twice; making every name a tab stop (24+ tab stops for a logo wall).

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
