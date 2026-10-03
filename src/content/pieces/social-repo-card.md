---
title: "Dark mono repository card"
summary: "A code repository card in dark mono: star toggle with a ring pop, a growing language bar with legend highlight, and a 52-week commit sparkline you can scrub."
platform: web
type: component
category: social
tags: [repository, code, sparkline, stars, developer]
styles: [dark, terminal, minimal]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-03
palette: ["#0C1011", "#12181A", "#DFE6E3", "#F2B84B"]
fonts: ["IBM Plex Mono", "IBM Plex Sans"]
related: [social-contribution-graph]
---

# Dark mono repository card

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A repository card for an invented code host. Use it as an embed, a search result or a profile "pinned" item. The repo is `heronry / brackwater`, an embedded time-series store. Everything structural is in IBM Plex Mono: the repo path, counts, topics, labels and the last-commit line. The description alone is set in Plex Sans so it reads as prose. One amber accent (`#F2B84B`) marks things you can act on or that belong to you: topics, the starred state and the sparkline. Language colours are the only other hues. The details worth copying are the sparkline, which draws itself once and can be scrubbed by pointer or arrow keys with the header readout changing to "Week of 29 Jun · 71 commits", and the language legend, which dims every other segment when you point at one.

## Reference behaviour

1. Initial state: card centred on a near-black page with a 24px dot grid. The language bar segments grow from 0 to their share over 600ms. The sparkline stroke draws left to right over 1200ms (200ms delay), and its amber area fill fades in at 700ms.
2. The header readout to the right of "COMMIT ACTIVITY · 52 WEEKS" shows the total, "1,721 commits".
3. Click Star. The button turns amber-tinted (border `rgba(242,184,75,.5)`, fill `rgba(242,184,75,.14)`, text amber), the star icon fills, the label becomes "Starred", the count goes 12,418 → 12,419. The icon pops (scale .6 → 1.2 → 1, rotate −30° → 0, 420ms) and a 20px amber ring expands to 1.7× and fades over 500ms.
4. Click again to unstar. The label goes back to "Star", the count to 12,418, and there is no pop.
5. Hover or focus a language in the legend, or hover its bar segment. Every other segment and legend item drops to 28% opacity over 200ms.
6. Move the pointer over the sparkline. A dashed vertical cursor and a 4px amber-ringed dot snap to the nearest of 52 weeks, and the readout says "Week of {d Mon} · {n} commits". Leaving restores the total.
7. Tab to the sparkline. The cursor appears on the last week. ←/→ move one week, Home/End jump to the ends, and a polite live region repeats the readout.
8. Hover a topic chip and its tint deepens from 14% to 24% amber.
9. Reduced motion: bars render at full width, the line and area are fully drawn, and there is no pop or ring.

## Structure

```
page 1280 × 800, #0C1011 + 24px dot grid; card 580 wide, radius 8, centred
┌──────────────────────────────────────────────────────────────────────┐
│ ▤ heronry / brackwater  (Public)            [* Star 12,418][Y Fork 864] │ pad 20/22
│ Embedded time-series store for edge devices. Append-only WAL, …      │ Plex Sans 14.5
│ (time-series)(embedded)(storage-engine)(wal)(edge)                   │ amber chips
│ ──────────────────────────────────────────────────────────────────── │
│ LANGUAGES                                                            │
│ ████████████████████████████████▌██████████▌█████▌███   8px, 2px gaps│
│ ● Rust 62.4%  ● Go 20.8%  ● TypeScript 11.3%  ● Shell 5.5%           │
│ ──────────────────────────────────────────────────────────────────── │
│ COMMIT ACTIVITY · 52 WEEKS                          1,721 commits    │
│ ╱╲_╱‾‾╲__╱‾╲___╱‾‾‾╲__/\__╱‾‾‾‾  64px tall sparkline + area           │
│ Oct 2025                Apr 2026                     This week       │
├──────────────────────────────────────────────────────────────────────┤
│ (OF) orla-f  fix(wal): close compaction race on segm…  a3f9c1e  2h ago│ raised row
├──────────────────────────────────────────────────────────────────────┤
│ ⓘ 37 issues   ⇅ 9 pull requests   § Apache-2.0   ⌖ v0.14.2           │
└──────────────────────────────────────────────────────────────────────┘
```

- `article.card` labelled by the `h1` repo path.
- Actions: two `button`s. Star has `aria-pressed` and an `aria-label` that includes the count.
- Topics: `ul aria-label="Topics"` of links.
- Languages: `section` with a decorative bar and a `ul` of buttons (focusable so keyboard users get the highlight).
- Activity: `section` with an `output` readout and a focusable `div role="img"` wrapping the SVG.
- Last commit: one row. The message truncates with an ellipsis.
- Footer: metadata spans with 14px icons.

## Tokens

```css
:root {
  --bg: #0c1011;          /* page */
  --card: #12181a;        /* card */
  --raise: #182023;       /* buttons, commit row */
  --ink: #dfe6e3;
  --ink-2: #a3aeab;
  --ink-3: #7c8784;
  --line: #243033;        /* section rules */
  --line-2: #2f3d40;      /* button borders */
  --accent: #f2b84b;      /* amber: star, topics, sparkline, focus */
  --accent-dim: rgba(242,184,75,.14);
  --l1: #e08a5b;          /* Rust */
  --l2: #5fb3b3;          /* Go */
  --l3: #7a9cdb;          /* TypeScript */
  --l4: #9bb56a;          /* Shell */
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
  --r-card: 8px; --r-btn: 6px; --r-chip: 999px;
  --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 22px;
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## Typography

| Role | Family | Size / line | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Repo path | Plex Mono | 17 / 1.3 | 500 (owner 400) | −0.01em | ink, owner ink-2, slash ink-3 |
| Badge | Plex Mono | 11px | 500 | 0 | ink-3, 1px line-2 border |
| Button | Plex Mono | 13px | 500 | 0 | ink, count ink-2 on bg chip |
| Description | Plex Sans | 14.5 / 1.5 | 400 | 0 | ink-2, max 52ch |
| Topic | Plex Mono | 12px | 500 | 0 | accent on accent-dim |
| Section label | Plex Mono | 11px | 500 | 0.08em | ink-3, uppercase |
| Readout | Plex Mono | 12px | 500 | 0 | ink-2 |
| Legend | Plex Mono | 12.5px | 400, name 500 | 0 | ink-2 / ink |
| Commit row | Plex Mono | 12.5 / 1.3 | 400 | 0 | author ink 500, hash ink-3 |
| Footer | Plex Mono | 12px | 400 | 0 | ink-3 |

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Language bar | load | flex-grow | 0 → share | 600ms | `--expo` | final widths |
| Sparkline stroke | load | stroke-dashoffset | len → 0 | 1200ms, 200ms delay | `--expo` | drawn |
| Sparkline area | load | opacity | 0 → 1 | 600ms, 700ms delay | `--ease` | visible |
| Star icon | star on | transform | scale .6 rot −30° → 1.2 → 1 | 420ms | `--expo` | none |
| Star ring | star on | scale, opacity | .4/1 → 1.7/0 | 500ms | `--expo` | none |
| Star button | aria-pressed | border, background | neutral ↔ amber | 160ms | `--ease` | instant |
| Legend dim | hover/focus | opacity | 1 → .28 | 200ms | `--ease` | instant |
| Cursor | pointer/keys | opacity | 0 → 1 | 120ms | `--ease` | instant |

## States

- Button hover: border `#41545a`.
- Star pressed: amber tint, filled star, "Starred", count +1.
- Topic hover: background 24% amber.
- Legend item active (`.on`): full opacity, siblings at .28. The card gets `.hl` while any item is active.
- Sparkline active (`.on`): cursor line `--ink-3` dashed 2/3, dot r=4 with fill `--card` and stroke amber 2px.
- Focus-visible: 2px amber outline, offset 2px, on buttons, chips, legend items and the sparkline.
- Empty activity: if all 52 weeks are zero, draw a flat line at the baseline and set the readout to "No commits this year".

## Accessibility

- Star `aria-label` updates to "Unstar heronry/brackwater, 12,419 stars" when pressed. A polite live region says "Starred" or "Star removed".
- The sparkline is `role="img"` with `tabindex="0"` and the label "Weekly commits, use left and right arrow keys to inspect weeks". Arrow keys update the visible readout and the live region. Pointer movement does not announce.
- Legend items are buttons so focus gets the same highlight as hover.
- The language bar is `aria-hidden`. The legend carries the data as text.
- Contrast: `#a3aeab` on `#12181a` ≈ 8:1. `#7c8784` ≈ 4.8:1. Amber on accent-dim over card ≈ 9:1.
- Buttons are 32px tall. That is acceptable on desktop. Make them 40px on touch layouts.

## Responsive rules

- ≥1024: card 580px.
- 768: unchanged.
- <520: the header stacks (name row, then actions row), topics wrap to two lines, the legend wraps to two rows, the commit row hides "2h ago" and keeps the hash, and the footer wraps.
- The sparkline is `width: 100%` with `preserveAspectRatio="none"` and `vector-effect: non-scaling-stroke` so the stroke stays 1.5px at any width. The cursor dot is drawn in a separate pixel-space SVG so it stays round.

## Acceptance checklist

### Always

- [ ] All structural text is monospace. Only the description is sans.
- [ ] One accent colour, used for star-on, topics, sparkline and focus.
- [ ] Star toggles `aria-pressed`, label, count (±1) and accessible name.
- [ ] Star pop and ring play only when starring, not unstarring.
- [ ] Language bar is 8px tall with 2px gaps and grows in on load.
- [ ] Hovering a language dims the others to .28 opacity, and so does keyboard focus.
- [ ] Sparkline has 52 points, draws once, and is scrubbable by pointer and by ←/→/Home/End.
- [ ] Readout returns to the total on leave or blur.
- [ ] Commit message truncates with an ellipsis on one line.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Repo `heronry / brackwater`, Public, 12,418 stars, 864 forks.
- [ ] Languages Rust 62.4%, Go 20.8%, TypeScript 11.3%, Shell 5.5%.
- [ ] Topics: time-series, embedded, storage-engine, wal, edge.
- [ ] Last commit: orla-f, "fix(wal): close compaction race on segment rotate", a3f9c1e, 2h ago.
- [ ] Footer: 37 issues, 9 pull requests, Apache-2.0, v0.14.2.

## Implementation notes

Draw the line with a dash trick. Set `--len` larger than the path length and animate the offset:

```css
.spark .ln { fill: none; stroke: var(--accent); stroke-width: 1.5;
  stroke-dasharray: var(--len); stroke-dashoffset: var(--len);
  animation: draw 1.2s var(--expo) .2s forwards; }
@keyframes draw { to { stroke-dashoffset: 0 } }
```

Snap the cursor to a week, not to the raw pointer x:

```js
const X = i => i * 520 / 51, Y = v => 60 - v / max * 54;
spark.addEventListener('pointermove', e => {
  const r = spark.getBoundingClientRect();
  show(Math.round((e.clientX - r.left) / r.width * 51));
});
function show(i) {
  idx = Math.max(0, Math.min(51, i));
  cl.setAttribute('x1', X(idx)); cl.setAttribute('x2', X(idx));
  dot.setAttribute('cx', X(idx) / 520 * spark.clientWidth);
  dot.setAttribute('cy', Y(W[idx]));
  out.textContent = `Week of ${fmt(idx)} · ${W[idx]} commits`;
}
```

Restart the star pop by removing the class, forcing reflow, and re-adding it: `star.classList.remove('pop'); void star.offsetWidth; star.classList.add('pop');`.

Grow the language bar with `flex-grow` from 0 to the percentage after two animation frames, so the browser paints the 0 state first.

Common mistakes:

- Using a different hue per topic chip. They are all amber.
- A gradient on the language bar. It is flat segments.
- Drawing the dot inside the stretched SVG, where it turns into an ellipse.
- Making the readout `aria-live` and announcing every pointer move.
- Copying a real host's logo or octocat-like mark. The repo icon is a plain book outline.
