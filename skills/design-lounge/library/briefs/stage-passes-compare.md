<!-- Design Lounge Nº 444 · "Three passes, one frame" · designlounge.vercel.app -->

# Three passes, one frame

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Studied from gmxdigital.com: the idea is the "from an image to an experience" block, where one frame steps through base image, atmosphere and film while three numbered tabs underneath keep time. This version is the method section of Siltworks, a fictional visualisation studio, on a warm paper ground instead of a dark one. The same 400×520 frame of a lake pavilion is shown in three passes: 01 Sketch (line drawing on a grid), 02 Light (flat colour, sun, shadows) and 03 Motion (dusk grade, drifting clouds, birds, water shimmer, a lamp glow and a ticking REC timecode). The detail worth copying is the compare line: from pass 02 on, the previous pass sits under the current one, and a draggable divider shows how much the new pass changed. The page opens on pass 02 with the line at 50%, so the point is visible in the first frame.

## Reference behaviour

1. Load: pass 02 "Light" is selected. Tab 01 shows a full grey line (done). Tab 02's 2px green line starts filling over 6000ms.
2. The frame shows pass 01 on the left of the divider and pass 02 on the right. The divider wipes in from 100% to 50% over 700ms (ease-out quart). Chips: "Pass 01" (paper chip) top-left, "Pass 02 · Light" (ink chip) top-right.
3. Left column shows "02 / 03", the italic step title "Light and weather", a 3-line description, and a link "Read the light study ↗". The step block fades up 8px over 420ms on each change.
4. When tab 02's line completes, pass 03 becomes selected and the wipe runs again with pass 02 now underneath. After 03 it wraps to 01.
5. Pass 01 has no previous pass: no divider, no knob, no left chip. The frame shows the sketch alone.
6. Pass 03 adds the moving layer: clouds drift ±30px (26s and 34s alternate), two birds cross the frame every 9s, five water lines shimmer, the window glow breathes between 55% and 100%, the scene pushes in to scale 1.04 over 6s, and "REC 00:SS:FF" counts at 24 frames per second with a blinking red dot.
7. Drag the 44px knob (or click anywhere in the frame) to move the divider. Dragging also turns autoplay off (Pause becomes Play).
8. Hovering the frame pauses the tab timer. Leaving resumes it unless Pause is on.
9. Pause button (40px pill, right of the tabs) toggles autoplay. The current tab's line freezes in place.
10. Keyboard: tabs are a tablist. Left / Right arrows move and select, Home / End jump. The knob is a slider: Left / Right ±5, PageUp / PageDown ±20, Home 0, End 100.
11. A polite live region announces "Pass 3 of 3: The moving frame".
12. Reduced motion: autoplay starts paused, the wipe jumps straight to 50%, no clouds, birds, shimmer, push or blinking; the timecode still updates as text.

## Structure

```
1280 × 800, padding-inline 56px, paper ground --bg
┌──────────────────────────────────────────────────────────────────────────┐
│ —— 03 / Method      Sketch, light and motion, in one frame.  Skip to ↘  │ head 84px, 1px rule
├──────────────────────────────────────────┬───────────────────────────────┤
│ From a sketch                            │      ┌───────────────────┐    │
│ to a moving frame. (serif italic green)  │      │Pass 01   Pass 02 ·│    │ frame 400×520
│ intro 16px, 430px                        │      │  sketch  │  lit   │    │ centred in column
│ ──────────────────────────────           │      │          ◉        │    │ knob 44px
│ 02 / 03                                  │      │          │        │    │
│ Light and weather (34px serif italic)    │      │          │  REC ● │    │
│ description, 440px                       │      └───────────────────┘    │
│ Read the light study ↗                   │                               │
├──────────────────────────────────────────┴───────────────────────────────┤
│ 01 Sketch ─────────   02 Light ━━━━──────   03 Motion ─────────  (‖ Pause)│ tabs row, 2px lines
└──────────────────────────────────────────────────────────────────────────┘
body grid: 520px | 1fr, gap 56px
```

- `main.wrap`: grid rows head / body / tabs.
- Head: three-column grid. Label span, middle span, skip link.
- Body left: `section` labelled by the `h2`. The step block is the `role="tabpanel"`, `tabindex="0"`, `aria-labelledby` the selected tab.
- Body right: `figure.frame` with two absolute layers (`#under` previous pass, `#over` current pass, clipped), two chips, a divider holding a `button role="slider"`, and the REC label.
- Tabs row: a `role="tablist"` of three buttons (number + name + absolute 2px bar), then the pause button.
- The scene is one SVG template, cloned into both layers. The pass is a class on the SVG root: `sk`, `lt`, `mo`.

## Tokens

```css
:root {
  --bg: #ece7dc;        /* paper ground */
  --paper: #f6f2ea;     /* frame and chips */
  --ink: #1d211c;       /* headings, sketch lines */
  --ink-2: #474d45;     /* body text */
  --ink-3: #6a7067;     /* counters, idle tabs */
  --line: #d3ccbe;      /* rules, idle tab lines, sketch grid */
  --line-2: #b9b1a1;    /* frame edge, done tab lines, button borders */
  --accent: #2f6b4f;    /* forest green: italic word, active tab, focus */
  --accent-2: #e3b45a;  /* lamp and sun, used only inside the scene */

  --sans: "Hanken Grotesk", system-ui, sans-serif;
  --serif: "Literata", Georgia, serif;  /* italic only */

  --space: 4px 8px 12px 16px 24px 28px 56px;
  --frame-w: 400px; --frame-h: 520px;
  --shadow-frame: 0 0 0 1px var(--line-2), 0 30px 60px -30px rgba(29,33,28,.35);

  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --dwell: 6000ms;      /* per pass */
  --wipe: 700ms;        /* divider 100% → 50% */
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Section heading | Hanken Grotesk | 60px | 500 | 1.02 | -0.035em | Last words in Literata italic 400, green |
| Step title | Literata italic | 34px | 400 | 1.1 | -0.015em | `--ink` |
| Body | Hanken Grotesk | 16px | 400 | 1.55 | 0 | `--ink-2`, max 440px |
| Counter "02 / 03" | Hanken Grotesk | 12px | 600 | 1 | 0.12em | `--ink-3` |
| Head row | Hanken Grotesk | 13px | 500–600 | 1 | 0 | Label green with 28px rule |
| Tab number | Hanken Grotesk | 26px | 400 | 1 | -0.02em | Green when selected |
| Tab name | Hanken Grotesk | 14px | 600 | 1 | 0 | |
| Chips, REC | Hanken Grotesk | 12px | 600 | 1 | 0.02–0.08em | REC uses tabular numerals |

Serif italic is used for exactly two things: the end of the heading and the step title. Nothing else.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Divider wipe | pass change (02, 03) | `--x` via rAF | 100% → 50% | 700ms | ease-out quart | jump to 50% |
| Step block | pass change | opacity, translateY | 0, 8px → 1, 0 | 420ms | `--ease` | none |
| Tab line | tab selected | scaleX | 0 → 1 | 6000ms | linear (timer) | full, static |
| Scene push | pass 03 | scale | 1 → 1.04 | 6s, once | cubic-bezier(.25,.6,.3,1) | none |
| Clouds | pass 03 | translateX | -24px ↔ 30px | 26s / 34s alternate | linear | off |
| Birds | pass 03 | translate | (-60, 10) → (460, -30) | 9s loop | linear | off |
| Water shimmer | pass 03 | opacity, translateX | .15, -4px ↔ .7, 4px | 2.8s alternate, half offset | ease-in-out | off |
| Lamp glow | pass 03 | opacity | .55 ↔ 1 | 4s alternate | ease-in-out | off |
| REC dot | pass 03 | opacity | 1 / .2 | 1.2s steps | steps(1) | steady |
| Knob | hover / press | scale | 1.06 / .96 | 160ms | `--ease` | none |
| Sketch fills | pass class change | fill | — | 400ms | `--ease` | none |

## States

- Tab idle: `--ink-3`, 2px `--line` underline.
- Tab hover: `--ink-2`.
- Tab selected: `--ink`, number green, green bar filling. `aria-selected="true"`, `tabindex=0`.
- Tab done (before the selected one): bar full in `--line-2`.
- Frame hovered: timer paused.
- Divider hidden on pass 01 (`.has-prev` removed). Left chip hidden too.
- Knob focus-visible: 2px green outline, offset 3px. The ring sits outside the 44px circle.
- Pause on: play icon, text "Play", `aria-pressed="true"`.
- Link hover: underline darkens from `--line-2` to `--ink`. "Skip to projects" arrow moves 2px down-right.

## Accessibility

- Tablist "Passes" with three tabs. Roving tabindex. The step block is the tabpanel.
- The knob is `role="slider"` with `aria-valuemin=0`, `aria-valuemax=100`, `aria-valuenow`, and `aria-valuetext="50 percent previous pass"`.
- The figure has `aria-label="Pavilion at Lake Orta, shown at the current pass"`. The scene SVGs are `aria-hidden`; the step text describes each pass.
- The live region names the pass on change. The REC timecode is not announced.
- The pause control is in the tab order right after the tabs. Autoplay stops for good once the reader drags the divider.
- Contrast: `#1d211c` on `#ece7dc` is about 14:1; `#474d45` about 7.6:1; green `#2f6b4f` about 5.3:1; `#6a7067` counters about 4.6:1.
- Targets: knob 44px, tabs 48px tall, pause 40px tall.

## Responsive rules

- ≥1280: as drawn.
- 1024: body grid becomes `1fr 400px`, gap 32px, heading 48px.
- 768: same as 1024; if the left column gets tight, the description wraps to 4 lines. The step block keeps `min-height: 228px` so the tabs never jump.
- <760: padding 20px, head drops its middle text, body stacks (text then frame). Frame is `width: min(100%, 400px)` with `aspect-ratio: 400/520`. Tabs become three columns with the number above the name; Pause moves to its own row, left aligned.
- No horizontal overflow at 375px.

## Acceptance checklist

### Always

- [ ] One frame, one camera. Every pass is the same composition; only the rendering changes.
- [ ] Three tabs with a timer line each. Completed tabs show a full neutral line.
- [ ] From the second pass on, the previous pass sits under the current one, split by a draggable divider. The first pass has no divider.
- [ ] The divider wipes from 100% to 50% on every pass change.
- [ ] Dragging, clicking in the frame, or using the slider keys moves the divider and turns autoplay off.
- [ ] Hovering the frame pauses the timer. A visible Pause / Play button exists.
- [ ] The current pass chip is top-right; the previous pass chip is top-left, on the side where that pass shows.
- [ ] Tablist and slider keyboard support as listed.
- [ ] Reduced motion: paused autoplay, no loops, divider at 50% with no wipe.
- [ ] No horizontal overflow at 375px.

### This demo

- [ ] Opens on "02 / 03 Light and weather" with the divider at 50%.
- [ ] Passes are 01 Sketch, 02 Light, 03 Motion; titles "Massing and line", "Light and weather", "The moving frame".
- [ ] Heading "From a sketch to a moving frame." with "moving frame." in Literata italic `#2f6b4f`.
- [ ] Pass 03 shows "REC 00:SS:FF" counting at 24fps with a red dot.
- [ ] Frame is 400×520 on `#f6f2ea` with a 1px `#b9b1a1` edge.

## Implementation notes

1. One scene, three looks. Draw the scene once with colours as SVG `fill` attributes, give every surface a class `f`, and let a class on the root restyle it. CSS beats presentation attributes, so the sketch pass is just an override:

```css
.sk .f { fill: var(--paper); stroke: var(--ink); stroke-width: 1.1; }
.sk .shade, .sk .anim, .sk .grade, .sk .glow { display: none; }
.sk .cons, .sk .grid { display: block; }   /* construction lines, pencil grid */
.lt .anim, .lt .grade, .lt .glow { display: none; }
.mo .grade { display: block; }              /* dusk gradient over everything */
```

2. The compare. Both layers are `position:absolute; inset:0`. Only the top layer is clipped, with a custom property the divider also reads. A common mistake is leaving the layer wrappers unpositioned: a zero-height box with a `clip-path` hides its whole content.

```css
#under, #over { position: absolute; inset: 0; }
.over { clip-path: inset(0 0 0 var(--x, 0%)); }
.divider { position: absolute; top: 0; bottom: 0; left: var(--x, 0%); }
```

```js
const setX = v => { x = Math.max(0, Math.min(100, v));
  frame.style.setProperty('--x', x + '%');
  knob.setAttribute('aria-valuenow', Math.round(x)); };
knob.addEventListener('pointerdown', e => { knob.setPointerCapture(e.pointerId); stopAutoplay(); });
knob.addEventListener('pointermove', e => { if (e.buttons) {
  const r = frame.getBoundingClientRect(); setX((e.clientX - r.left) / r.width * 100); } });
```

3. Cloned SVGs need unique gradient ids. When you inject the template twice, rename every `id` and `url(#…)` per copy (the demo appends a counter), or the second copy silently paints with the first copy's gradients.

Common mistakes:

- Letting the motion pass differ only by tiny animation. Add the dusk grade and the lamp glow so pass 03 reads as a different time of day even in a still.
- Running the wipe with CSS transitions on `clip-path` while also dragging. Drive one custom property from one place.
- Opening on pass 01, which has nothing to compare.
- Putting labels on the wrong side of the divider.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
