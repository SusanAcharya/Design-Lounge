---
title: "Chaptered cinema hero"
summary: "A dark film-studio hero: fixed headline on the left, four night scenes crossfading on the right, and a numbered chapter index whose hairline fills as each scene plays."
platform: web
type: section
category: hero
tags: [hero, chapters, autoplay, cinema, architecture]
styles: [dark, editorial, luxe]
motion: rich
difficulty: 2
featured: false
published: 2026-10-03
palette: ["#110E0B", "#F1E8DA", "#E9A15B", "#C9BCA9", "#8F8272"]
fonts: ["Familjen Grotesk", "IBM Plex Mono"]
related: [hero-video-loop, stage-passes-compare, parallax-layered-hero]
---

# Chaptered cinema hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Studied from gmxdigital.com: the idea is a pinned hero where a short headline stays still while numbered chapters (01 to 04) play scenes behind it, each with its own progress hairline. This version is the first screen of Brasswell Films, a fictional studio that films hotels and residences before they are built. The left side never moves: a kicker, a two-line 108px headline ("Unbuilt." / "Already lit." in amber), a lede and two actions. The right two-thirds is a stack of four night scenes (Facade, Courtyard, Rooms, Shoreline) that crossfade every 6.5s with a slow push-in, while a chapter index on the right edge shows which scene is playing. The detail worth copying is that the progress lives in the active row's bottom hairline, so the index is both the navigation and the timer.

The scenes are inline SVG so the demo has no images. In a product, each scene is a muted, looping video or a still with a Ken Burns push. Keep everything else.

## Reference behaviour

1. Load: scene 01 Facade is visible. Index row 01 is amber with a ↗ arrow, and its bottom hairline starts filling left to right over 6500ms.
2. Kicker, both headline lines, lede and actions rise in: opacity 0 → 1, `translateY(18px)` → 0, 800ms expo-out, stagger 0 / 90 / 200 / 280ms.
3. The active scene's SVG scales from 1.07 → 1 over 7400ms while it is on screen (push-in).
4. When the hairline reaches the end (`animationend`), the next chapter becomes active. After 04 it wraps to 01.
5. Changing chapter: the old scene fades out and the new one fades in over 900ms (crossfade, both absolute). The bottom-left meta line and bottom-right pair label swap with a 220ms fade/drop. The bottom-right number changes to the new chapter number.
6. Clicking a chapter row jumps to it at once and restarts its hairline from 0.
7. Hovering the index pauses the hairline (`animation-play-state: paused`). Leaving resumes it, unless the pause button is on.
8. Pause button (40×40 square in the header, amber bars icon): toggles autoplay. When paused the icon becomes a play triangle, `aria-pressed="true"`, the hairline freezes where it is.
9. Keyboard: the index is a tablist. Arrow Down / Right goes to the next chapter, Up / Left to the previous (wrapping), Home and End go to 01 and 04. Focus moves with the selection.
10. A polite live region announces "Scene 3 of 4: Rooms" on each change.
11. Reduced motion: autoplay starts paused, no push-in, no crossfade (instant swap), no entrance rise, hairline shows full for the active row, window flicker and light twinkle are off.

## Structure

```
1280 × 800, background --bg
┌──────────────────────────────────────────────────────────────────────────┐
│ [B] BRASSWELL FILMS            [‖] Films Method Studio Journal  Book (↗) │ header 76px, 1px rule
├───────────────────────┬──────────────────────────────────────────────────┤
│                       │  scenes: left 34% → right edge, full height      │
│ —— Hotels and resid…  │  masked: left fade, right fade, bottom fade      │
│                       │                                    01 Facade  ↗  │
│ Unbuilt.              │                                    ───────────── │ index 236px wide
│ Already lit.  (amber) │                                    02 Courtyard  │ rows 54px
│                       │                                    03 Rooms      │ right 56px
│ lede 17px, 440px      │                                    04 Shoreline  │
│ (Plan a launch film ↗)  See the reel (↓)                                 │
│                                                                          │
│ SCENE 01 · 35MM · 19:42 · LISBON                    01 ────── SITE → SKY │ strip, bottom 30px
└──────────────────────────────────────────────────────────────────────────┘
copy: left 56px, width 600px, vertically centred (translateY(-44%))
```

- `header`: brand link (30px square mark + wordmark), pause `button`, `nav` with four links, "Book a call" link with a 44px circle icon.
- `section.copy` labelled by the `h1`. The `h1` has two `span` lines; the second carries the accent colour.
- `.scenes` is `aria-hidden="true"`. Four `.scene` layers, absolute, stacked. A `::after` holds the three masking gradients. A grain layer sits on top at 22% overlay.
- `.index` is `role="tablist"` with four `button role="tab"`. Each tab: number, label, arrow SVG, and an absolute `.bar` hairline.
- `.strip`: meta text left, chapter number + 120px rule + pair label right. Mono, uppercase.
- One visually hidden `p aria-live="polite"`.

## Tokens

```css
:root {
  --bg: #110e0b;            /* warm night, page and mask colour */
  --bg-2: #1a1510;
  --ink: #f1e8da;           /* headline, primary text */
  --ink-2: #c9bca9;         /* lede, nav, inactive labels */
  --ink-3: #8f8272;         /* numbers, meta strip */
  --line: rgba(241,232,218,.14);
  --line-2: rgba(241,232,218,.28);
  --accent: #e9a15b;        /* amber: second headline line, active chapter, CTA */
  --accent-ink: #1d130a;    /* text on amber */
  --glow: #f2b66a;          /* lit windows and lamps in scenes */

  --sans: "Familjen Grotesk", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;

  --space-1: 8px; --space-2: 16px; --space-3: 24px; --space-4: 32px; --gutter: 56px;
  --radius-pill: 999px;

  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --dwell: 6500ms;          /* time per chapter */
  --fade: 900ms;            /* scene crossfade */
  --push: 7400ms;           /* scene push-in, longer than dwell so it never stops on screen */
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Headline | Familjen Grotesk | 108px | 500 | 0.98 | -0.058em | Sentence |
| Kicker | Familjen Grotesk | 14px | 400 | 1.5 | 0 | Sentence, 40px rule before |
| Lede | Familjen Grotesk | 17px | 400 | 1.55 | 0 | Sentence, `--ink-2`, max 440px |
| Nav, CTA | Familjen Grotesk | 14–15px | 500–600 | 1 | 0 | Title |
| Brand | Familjen Grotesk | 13px | 600 | 1 | 0.16em | Upper |
| Chapter number | Familjen Grotesk | 26px | 400 | 1 | -0.02em | Digits, 2-wide |
| Chapter label | Familjen Grotesk | 14px | 500 | 1 | 0 | Title |
| Meta strip | IBM Plex Mono | 11px | 500 | 1 | 0.14em | Upper |

The headline is the only big type. Chapter numbers are big-ish and light so they read as a timeline, not as buttons.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Copy entrance | load | opacity, translateY | 0, 18px → 1, 0 | 800ms, stagger 0/90/200/280 | expo | none, shown |
| Scene crossfade | chapter change | opacity | 0 ↔ 1 | 900ms | `--ease` | instant |
| Scene push-in | scene becomes active | transform scale | 1.07 → 1 | 7400ms | cubic-bezier(.25,.6,.3,1) | none, scale 1 |
| Active hairline | chapter active | transform scaleX | 0 → 1 | 6500ms | linear (it is a timer) | full, static |
| Arrow on active row | selection | opacity, translate | 0, (-6px, 6px) → 1, 0 | 200ms / 300ms | ease / expo | instant |
| Meta and pair text | chapter change | opacity, translateY | 1 → 0 (+6px), swap, back | 260ms / 400ms | ease / expo | instant |
| CTA arrow | hover | rotate | 0 → 45deg | 300ms | expo | keep (tiny) |
| Window flicker | always | opacity steps | 1 → .15 → 1 | 7s loop | steps(1) | off |
| String lights | always | opacity | .35 ↔ 1 | 3.6s alternate | ease-in-out | off |

The hairline is the only linear motion. It is a clock.

## States

- Chapter row resting: label `--ink-2`, number `--ink-3`, 1px `--line` bottom border.
- Chapter row hover: label `--ink`, number `--ink-2`.
- Chapter row selected: label and number `--accent`, arrow visible, amber `.bar` filling over the bottom border, `aria-selected="true"`, `tabindex=0`.
- Index hovered: the active bar pauses.
- Pause on: play triangle icon, `aria-pressed="true"`, label "Play scene autoplay", bar frozen.
- CTA hover: background `#f0b06f`, inner circle arrow rotates 45deg. Active: scale .98.
- Ghost link hover: its down arrow drops 3px.
- "Book a call" hover: circle fills `--ink`, icon becomes `--bg`.
- Focus-visible: 2px `--accent` outline, offset 3px, on every link and button.

## Accessibility

- The index is `role="tablist"` labelled "Scenes". Tabs use roving tabindex. Only the selected tab is in the tab order.
- Arrow keys, Home and End move between chapters as described. Enter and Space work because the tabs are buttons.
- The scenes are decorative (`aria-hidden`). The live region announces the scene name.
- Autoplay longer than 5s must be pausable: the pause button is the second focusable control in the header, right after the brand.
- Contrast: `#f1e8da` on `#110e0b` is about 15:1. `#c9bca9` lede is about 10:1. Amber `#e9a15b` on `#110e0b` is about 8.6:1. `#1d130a` on amber is about 8:1.
- The right-side mask gradient guarantees the index sits on at least 60% dark, whatever scene is behind it.
- Targets: chapter rows are 54px tall and 236px wide. Pause 40×40. CTA 56px tall.

## Responsive rules

- ≥1280: as drawn.
- 1024–1100: headline 88px, copy 520px wide, nav links hidden (brand, pause and "Book a call" stay).
- 768: same as 1024. The index still floats right; the copy may run over the scene, the left mask keeps it legible.
- <760: scenes fill the whole frame under a vertical dark mask (bottom `--bg`, 72% at middle, 85% at top). Copy sits at top 120px, left/right 20px, headline 60px. The index becomes a 4-column row at the bottom (64px tall cells, number over label, arrow hidden), with the hairline under each cell. The meta text is hidden; the pair label stays.
- No horizontal scroll at 375px.

## Acceptance checklist

### Always

- [ ] The headline and actions never move or change when chapters change.
- [ ] Exactly one chapter is selected. Its bottom hairline is the progress timer, and reaching the end advances to the next chapter, wrapping after the last.
- [ ] Scenes crossfade (900ms) with both layers absolutely stacked. No blank frame between them.
- [ ] The active scene pushes in from 1.07 to 1 over a duration longer than the dwell.
- [ ] A pause control exists, toggles `aria-pressed`, and freezes the hairline.
- [ ] Hovering the index pauses progress. Leaving resumes it unless paused.
- [ ] Tablist keyboard: arrows, Home, End. Roving tabindex.
- [ ] A polite live region names the new scene.
- [ ] Reduced motion starts paused with no crossfade, push-in, or loops.
- [ ] No horizontal overflow at 375px. Index turns into a bottom row under 760px.

### This demo

- [ ] Brand is "BRASSWELL FILMS"; headline reads "Unbuilt." / "Already lit." with the second line `#e9a15b` at 108px.
- [ ] Chapters: 01 Facade, 02 Courtyard, 03 Rooms, 04 Shoreline.
- [ ] Pair labels: Site → Skyline, Path → Gathering, Space → Stay, Tide → Terrace.
- [ ] Dwell is 6500ms per chapter.
- [ ] CTA "Plan a launch film" is a 56px amber pill with a 44px dark circle arrow.

## Implementation notes

1. Let the hairline drive the timer. Do not run a separate `setInterval`. A CSS animation on the bar plus `animationend` keeps the visual and the logic in sync, and pausing is one CSS property.

```css
.chap .bar { position:absolute; left:0; right:0; bottom:-1px; height:1px;
  background:var(--accent); transform:scaleX(0); transform-origin:left; }
.chap[aria-selected="true"] .bar { animation: fill var(--dwell) linear forwards; }
.paused .chap[aria-selected="true"] .bar { animation-play-state: paused; }
@keyframes fill { to { transform: scaleX(1); } }
```

```js
bar.addEventListener('animationend', () => { if (!paused) go((cur + 1) % n); });
// restart a bar on manual jump
bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
```

2. Mask the scene, not the copy. Three gradients on one `::after` over the scene stack: from the left (bg → 82% at 18% → clear at 52%), from the right (86% → 60% at 26% → clear at 44%) behind the index, and from the bottom (bg → clear at 26%) behind the strip. Put `overflow:hidden` on each scene, or the 1.07 scale leaks past the left mask and draws a visible seam.

3. Make the push-in longer than the dwell (7400ms vs 6500ms) so the camera is still moving when the crossfade starts. A push that finishes and sits still looks like a frozen video.

```css
.scene svg { transform: scale(1.07); transform-origin: 60% 55%; }
.scene.on svg { transform: scale(1); transition: transform 7400ms cubic-bezier(.25,.6,.3,1); }
```

Common mistakes:

- Swapping the headline per chapter. Only the scene, the meta line and the pair label change.
- Putting the progress in a separate bar under the hero. The index row's own hairline is the progress.
- Autoplay with no pause control.
- Scenes brighter than the copy. Keep scene highlights at `--glow` and let the mask do the work; the amber headline must stay the brightest warm thing.
- Bouncy easing on the crossfade. It is film, not UI.
