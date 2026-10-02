---
title: "Mask line reveal"
summary: "A four-line Bodoni manifesto where each line slides up from behind its own mask with a 110ms stagger, then a hairline draws and notes fade in."
platform: web
type: animation
category: text-motion
tags: [headline, reveal, stagger, mask, editorial]
styles: [editorial, luxe, dark]
motion: rich
difficulty: 2
featured: false
published: 2026-10-02
palette: ["#2A0C10", "#EFE2CA", "#E39A86", "#BFA79A"]
fonts: ["Bodoni Moda", "Manrope"]
related: [text-blur-focus-in, text-split-letter-wave]
---

# Mask line reveal

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The "Chapter II — The house" section of a fictional lakeside hotel, Maison Ardent. A 112px Bodoni Moda headline, "The quiet art of / *staying* a little / longer than / planned.", is set as four hand-broken lines with stepped indents. Each line sits in its own `overflow:hidden` mask and slides up from 112% below with a 3° tilt that straightens as it lands, on a long expo-out curve. After the lines, a hairline rule draws left to right and three numbered notes fade up. It is the classic agency reveal done carefully: masks are padded so italic overhangs and descenders are never clipped at rest, and the tilt pivots from the bottom-left corner so letters "unfold" rather than simply translate.

## Reference behaviour

1. Initial state on load: masks are empty (each line is below its mask) and begin revealing at 150ms.
2. Line `i` (0–3) starts at `150ms + i × 110ms` and takes 1100ms with `cubic-bezier(.16,1,.3,1)`. It travels from `translateY(112%) rotate(3deg)` to rest, pivoting at `0 100%`.
3. At 600ms the hairline under the headline scales from `scaleX(0)` to full width over 1200ms (expo out), from the left.
4. At `800ms + d × 90ms` (d = 0, 1, 2) each note fades from opacity 0 and `translateY(10px)` to rest over 900ms.
5. Everything has settled by about 2.2s; nothing loops.
6. "staying" is italic and rose (`--rose`); the rest of the headline is champagne (`--ink`).
7. Lines are indented 0, 2.1em, 0.9em and 3.6em, giving a ragged, set-by-hand left edge.
8. Clicking "Replay" (bottom right) restarts the whole sequence from empty masks.
9. "Reserve a suite" (top right) is an underlined link with a 1px rose rule 4px below the text.

## Structure

```
1280 × 800, 64px side padding
┌────────────────────────────────────────────────────────────────────────┐
│ LAKE ANNECY · EST. 1931          A R D E N T          RESERVE A SUITE  │ 72px header
├────┬───────────────────────────────────────────────────────────────────┤
│02/05│ The quiet art of                                                 │
│    │          staying a little                                         │ 4 masked lines
│    │     longer than                                                   │ 112px / 1.0
│ C  │                 planned.                                          │
│ h  │ ───────────────────────────────────────────────────────── (draws) │ rule, 40px above, 28 below
│ II │ 01 — ROOMS       02 — TABLE        03 — SEASON                    │ 3 × notes, max 860px
├────┴───────────────────────────────────────────────────────────────────┤
│ MAISON ARDENT, TALLOIRES — 74290                             [↺ REPLAY]│ 88px footer
└────────────────────────────────────────────────────────────────────────┘
  side column 120px + 1px right hairline + 56px gap
```

- `.page`: grid rows `72px 1fr 88px`.
- `<header>`: three-column grid (`1fr auto 1fr`): location label, centred wordmark "ARDENT" (Bodoni 20px, tracking .32em), link.
- `<main>`: grid `120px 1fr`. `.side` holds a page index "02 / 05" at top and a vertical label (`writing-mode: vertical-rl; rotate(180deg)`) at bottom; `aria-hidden`.
- `.copy`: `<h1>` with four `.ln` mask spans, each containing one inner `<span>` that moves; `.rule`; `.notes` grid of three `<p>`.
- `<footer>`: address label and the Replay `<button>`.

## Tokens

```css
:root {
  /* colour */
  --bg: #2A0C10;          /* oxblood page */
  --bg-2: #3A1218;        /* top-right radial glow */
  --ink: #EFE2CA;         /* champagne headline + emphasis */
  --ink-2: #BFA79A;       /* body notes, labels */
  --ink-3: #8E7570;       /* footer meta, index */
  --rose: #E39A86;        /* italic accent, note labels, link rule, focus */
  --line: rgba(239, 226, 202, .16); /* hairlines */

  /* type */
  --serif: "Bodoni Moda", Didot, serif;
  --sans: "Manrope", system-ui, sans-serif;
  --fs-display: 112px;
  --fs-body: 15px;
  --fs-label: 11px;

  /* motion */
  --reveal: 1100ms;
  --stagger: 110ms;
  --ease-expo: cubic-bezier(.16, 1, .3, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

Background: `--bg` with radial `1100×700 at 100% 0` of `--bg-2` and `500×300 at 8% 100%` of `rgba(227,154,134,.08)`. Radii are 0 everywhere, including the Replay button.

## Typography

| Role            | Family      | Size  | Weight | Line-height | Tracking | Case      |
|-----------------|-------------|------:|-------:|------------:|---------:|-----------|
| Headline        | Bodoni Moda (opsz 96) | 112px | 400 | 1.0 | −0.025em | sentence |
| Headline accent | Bodoni Moda italic | 112px | 400 | 1.0     | −0.01em  | lowercase |
| Wordmark        | Bodoni Moda | 20px  | 500    | 1           | +0.32em  | UPPERCASE |
| Labels / nav    | Manrope     | 11px  | 500    | 1           | +0.2em   | UPPERCASE |
| Note label      | Manrope     | 11px  | 500    | 1           | +0.2em   | UPPERCASE, rose |
| Note body       | Manrope     | 15px  | 400 / 500 strong | 1.6 | 0      | sentence  |
| Page index      | Manrope     | 13px  | 400 / 500 | 1        | +0.08em  | numerals  |

Load Bodoni Moda with the `opsz` axis (`6..96`) and set `font-variation-settings: "opsz" 96` on the headline so hairlines get the display cut.

## Motion

| Element          | Trigger        | Property            | From → To                              | Duration | Easing        | Delay |
|------------------|----------------|---------------------|----------------------------------------|---------:|---------------|-------|
| `.ln > span`     | load / Replay  | transform           | `translateY(112%) rotate(3deg)` → none | 1100ms   | `--ease-expo` | `150ms + i × 110ms` |
| `.rule`          | load / Replay  | transform           | `scaleX(0)` → none, origin left        | 1200ms   | `--ease-expo` | 600ms |
| `.note`          | load / Replay  | opacity, transform  | 0, `translateY(10px)` → 1, none        | 900ms    | `--ease`      | `800ms + d × 90ms` |
| `.replay` border | hover          | border-color        | `--line` → `--rose`                    | 160ms    | `--ease`      | — |

All three use `animation-fill-mode: backwards`, so elements are hidden during their delay and carry no transform afterwards.

Reduced motion: no line or rule animation (content is at rest on first paint); notes appear instantly (1ms).

## States

- **Replay hover:** border becomes rose.
- **Focus-visible:** 1px rose outline, 4px offset, square corners (matches the luxe hairline system).
- **Link:** "Reserve a suite" keeps its rose underline at rest; no hover colour change needed.
- **Replay mid-sequence:** class removal + reflow resets all masks to empty and starts again.

## Accessibility

- The `<h1>` contains real text; the mask spans are presentational and do not split words, so screen readers read the sentence naturally.
- `.side` (index + vertical label) is decorative: `aria-hidden="true"`.
- Replay is a `<button type="button">` with visible text.
- Contrast: `--ink` on `--bg` 13.6:1; `--ink-2` 7.6:1; `--ink-3` (footer meta, 11px uppercase) 4.5:1; rose 7.2:1.
- Total sequence under 2.3s, never loops.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: `--fs-display: 92px`; indents unchanged (they're in `em`).
- 768–1023: `--fs-display: 72px`; side column collapses to a 48px strip with only the vertical label; notes become one column with 20px gap.
- < 640: `--fs-display: 48px`; drop the indents to 0 / 1em / 0 / 2em; re-break the headline into five lines so no mask ever wraps ("The quiet / art of staying / a little / longer than / planned."). Notes stack.

## Acceptance checklist

- [ ] Headline is Bodoni Moda 112px, opsz 96, line-height 1, four lines with indents 0 / 2.1em / 0.9em / 3.6em.
- [ ] Each line is wrapped in its own `overflow:hidden` mask with `white-space:nowrap`; no line wraps inside a mask at 1280.
- [ ] At rest, no glyph is clipped: the italic "g" and "y" descenders and the "f" overhang are fully visible.
- [ ] Line `i` starts at `150 + i × 110` ms and lasts 1100ms with `cubic-bezier(.16,1,.3,1)`.
- [ ] Lines start 3° tilted, pivoting at the bottom-left, and straighten as they rise.
- [ ] The rule draws from the left starting at 600ms.
- [ ] Notes fade up 10px with 90ms stagger starting at 800ms.
- [ ] Replay restarts everything from empty masks.
- [ ] "staying" is italic in `#E39A86`.
- [ ] With reduced motion the section is complete and static on first paint.
- [ ] All interactive elements have a visible rose focus outline.

## Implementation notes

**Pad the mask, then pull the padding back.** A bare `overflow:hidden` at `line-height:1` clips descenders and italic overhangs at rest. Give the mask inner padding and cancel it with a negative margin so layout is unchanged:

```css
.ln {
  display: block; overflow: hidden; white-space: nowrap;
  padding: 0 .06em .14em;
  margin: 0 -.06em -.14em;
}
.ln > span { display: block; transform-origin: 0 100%; }
```

**Animate the inner span, delay by index, fill backwards.** `backwards` keeps the line hidden during its delay; no `forwards` means no lingering transform:

```css
.go .ln > span {
  animation: up var(--reveal) var(--ease-expo) backwards;
  animation-delay: calc(var(--i) * var(--stagger) + 150ms);
}
@keyframes up { from { transform: translateY(112%) rotate(3deg); } to { transform: none; } }
```

**Break lines by hand.** Don't split on rendered line boxes at runtime; the reveal depends on each mask holding exactly one line. Author the breaks, and re-author them per breakpoint.

```js
replay.addEventListener('click', () => {
  copy.classList.remove('go'); void copy.offsetWidth; copy.classList.add('go');
});
```

Common mistakes: translating by `100%` exactly (anti-aliased top pixels peek over the mask; use 110–115%); using `ease-out` instead of an expo curve (the landing feels abrupt); animating opacity together with the slide (the mask already hides it, and the fade muddies the edge).
