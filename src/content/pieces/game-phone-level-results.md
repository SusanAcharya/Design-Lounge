---
title: "Phone level results"
summary: "An end-of-level screen in a bakery puzzle game: three stars stamp in with squash and a hit-stop, the score counts up, a new-best tag slams and Next lands last."
platform: mobile-app
type: screen
category: games
tags: [game, results, rewards, stars, press, celebration]
styles: [playful, kinetic]
motion: rich
difficulty: 2
featured: false
published: 2026-11-06
palette: ["#9C3520", "#FFF6E6", "#FFC83D", "#3A1E14", "#C2264B"]
fonts: ["Fredoka"]
related: [game-phone-level-map, game-racing-results, game-gacha-pull-reveal]
---

# Phone level results

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The "level cleared" screen of Moonmill, an invented cosy bakery puzzle game, set on a slow-turning sunburst in oven-brick red. It is a lesson in reward pacing: nothing arrives at the same time. Three stars stamp into dark recessed slots one by one, each with a squash-and-stretch and a 64ms hit-stop that freezes the whole screen at the moment of impact, then a 3px shake and a ring of butter sparks. Only after the third star does the score count up to 48,260; then a jam-red "New best +6,360" tag slams onto the card's edge; then three collected items tally in and each one pushes its own coloured segment into the oven-upgrade bar; and last of all the big butter Next button springs up from below with Retry and Map as quieter secondaries. The visual language is custom game UI (3–4px ink outlines, solid under-lip shadows, rounded Fredoka), laid out with Material 3 Expressive proportions: a 64px full-width primary in the thumb zone.

## Reference behaviour

1. On load the sequence plays once. The ribbon "Level 23 baked!" unfurls (scaleX 0 → 1, 500ms) and the results card rises 40px and fades in (500ms) together at 0ms.
2. Stars stamp at 520, 880 and 1,240ms (360ms apart). Each star drops from 2.6× and −18° into its slot over 420ms: squash to `scale(1.28,.74)` at 40%, stretch to `scale(.9,1.12)` at 62%, settle `scale(1.04,.97)` at 80%, then 1.
3. At 168ms into each stamp (the squash frame) the screen freezes for 64ms (every CSS animation paused, count-ups held), then shakes 3px for 160ms in 4 steps. Eight diamond sparks fly 64px outward over 550ms from the star centre.
4. At 1,640ms the score counts from 0 to 48,260 over 1,100ms, cubic ease-out, with tabular figures. "Previous best 41,900" sits under it from the start.
5. At 2,820ms the "New best +6,360" tag slams from 2× and −8° to 1× and +4° (500ms, overshoot), hanging 12px past the card's right edge.
6. At 3,160, 3,580 and 4,000ms the three collected items appear (fade + 8px rise with overshoot) and count up over 360ms: Croissants 24, Jam jars 9, Gold wheat 3. Each adds its own segment to the oven-upgrade bar (+240, +180, +150 crumbs; widths 24%, 18%, 15%), so the bar goes 380 → 950 / 1,000.
7. At 4,500ms Next level springs up from 40px below and .9× (500ms, overshoot). At 4,760ms Retry and Map fade up 10px (300ms).
8. Replay (round button, top right) and Retry both cancel every pending timer and frame and replay from step 1. Next and Map show a short confirmation in the ribbon ("Level 24 up next", "Back to the map") for 1,600ms.

## Structure

```
390 × 844 · padding 54 20 34 · flex column
┌──────────────────────────────────┐
│ 54px clear                       │
│ [Moonmill · Crust Quarter]   (↻) │ top row 48px; chip + 44px replay
│      ★       ★★★       ★         │ stars row 124px: slots 86 / 110 / 86, sides ±10°,
│                                  │ middle raised 22px
│   ◣[ Level 23 baked! ]◢          │ ribbon h1, 22px, notched tails
│ ┌──────────────────────────────┐ │
│ │ SCORE                [New best│ │ card: 4px ink, 24px radius, 6px lip
│ │ 48,260                +6,360]│ │ score 60px
│ │ Previous best 41,900         │ │
│ │ - - - - - - - - - - - - - -  │ │ 2px dashed rule
│ │ COLLECTED                    │ │
│ │ [croissant][ jam  ][ wheat ] │ │ 3 equal tiles, icon 34, count 22px
│ │ OVEN UPGRADE   950/1,000     │ │
│ │ [███████|████|███|███|  ]    │ │ 18px bar, segments split by 2px ink
│ └──────────────────────────────┘ │
│        (flex space)              │
│ [   Retry   ] [    Map     ]     │ 50px, gap 10
│ [        Next level  →       ]   │ 64px, 3px ink, 6px lip
│ 34px home indicator              │
└──────────────────────────────────┘
Sunburst: a 1,400px circle centred at y 190, masked to fade by 62% radius.
```

- `main.stage` is the column; the sunburst is a fixed decorative `div` behind it.
- Stars: a `div role="img" aria-label="3 of 3 stars"` holding three SVGs (an empty path plus a filled group with a highlight).
- Title: `h1.ribbon`. Card: `section aria-label="Results"`.
- Bar: `div role="progressbar"` with `aria-valuenow` updated per item.
- Actions: three `<button>`s; Next spans both columns.

## Tokens

```css
:root {
  /* surfaces */
  --oven: #9C3520;        /* page */
  --oven-ray: #B2452A;    /* alternate sunburst ray */
  --oven-deep: #6E2416;   /* empty star slot, chips, secondary buttons */
  --dough: #FFF6E6;       /* card, text on deep chips (8.9:1) */
  --dough-2: #F5E4C6;     /* item tile */
  --track: #E9D3AE;       /* bar track */
  --rule: #D8BE95;        /* dashed divider */
  /* ink and text */
  --ink: #3A1E14;         /* outlines, primary text (14:1 on dough) */
  --sub: #7A4B36;         /* labels, previous best (6.8:1 on dough) */
  /* accents */
  --butter: #FFC83D;      /* stars, ribbon, Next */
  --butter-tail: #E0A520; /* ribbon tails */
  --star-shine: #FFF1C2;
  --jam: #C2264B;         /* new best tag, jam segment (white 5.6:1) */
  --crust: #C9773A;       /* existing crumbs segment */
  --croissant: #E08A3C;
  --wheat: #E3A33A;
  /* type */
  --font: "Fredoka", ui-rounded, system-ui, sans-serif;
  --fs-score: 60px; --fs-next: 24px; --fs-ribbon: 22px; --fs-count: 22px;
  --fs-sec: 16px; --fs-tag: 15px; --fs-body: 14px; --fs-chip: 13px; --fs-label: 12px;
  /* space */
  --pad-x: 20px; --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px;
  /* radii */
  --r-card: 24px; --r-next: 20px; --r-sec: 16px; --r-tile: 14px; --r-ribbon: 10px; --r-bar: 9px; --r-pill: 999px;
  /* edges and lips */
  --edge-card: 4px solid var(--ink); --edge-ui: 3px solid var(--ink);
  --lip-card: 0 6px 0 var(--ink); --lip-next: 0 6px 0 var(--ink); --lip-ribbon: 0 4px 0 var(--ink);
  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --out: cubic-bezier(.16, 1, .3, 1);
  --pop: cubic-bezier(.34, 1.56, .64, 1);
  --t-stamp: 420ms; --gap-star: 360ms; --t-hitstop: 64ms; --t-shake: 160ms;
  --t-count: 1100ms; --t-slam: 500ms; --t-spark: 550ms; --t-rays: 60s;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|
| Score | Fredoka | 60px | 700 | 1 | −0.01em, tabular | — |
| Next level | Fredoka | 24px | 700 | 1 | 0 | sentence |
| Ribbon title | Fredoka | 22px | 700 | 1 | 0 | sentence |
| Item count | Fredoka | 22px | 700 | 1 | 0, tabular | — |
| Retry / Map | Fredoka | 16px | 600 | 1 | 0 | sentence |
| New best tag | Fredoka | 15px | 700 | 1 | 0 | sentence |
| Previous best, bar value | Fredoka | 14px | 500 / 700 | 1.2 | 0 | sentence |
| World chip | Fredoka | 13px | 600 | 1 | 0.06em | title |
| Labels (SCORE, COLLECTED) | Fredoka | 12px | 600 | 1 | 0.16em | upper |
| Item name | Fredoka | 12px | 500 | 1.1 | 0 | sentence |

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Delay | Reduced motion |
|---|---|---|---|---|---|---|---|
| Sunburst | always | rotate | 0 → 360° | 60s loop | linear | — | static |
| Ribbon | run | scaleX | 0 → 1 | 500ms | `--pop` | 0 | 300ms fade |
| Card | run | translateY, opacity | 40px, 0 → 0, 1 | 500ms | `--out` | 0 | 300ms fade |
| Star stamp ×3 | run | scale, rotate, opacity | 2.6, −18°, 0 → squash → stretch → 1 | 420ms | keyframed, linear between | 520 / 880 / 1,240ms | 300ms fade, no squash |
| Hit-stop | each star | all animations | paused | 64ms | — | +168ms | skipped |
| Shake | after hit-stop | translate | ±3px | 160ms | `steps(4)` | +232ms | skipped |
| Sparks ×8 | each star | translateY, scale, opacity | −10px, 1 → −64px, .3, 0 | 550ms | `--out` | +170ms | hidden |
| Score count | run | text | 0 → 48,260 | 1,100ms | cubic out | 1,640ms | 300ms |
| New best tag | run | scale, rotate | 2, −8° → 1, 4° | 500ms | `--pop` | 2,820ms | fade |
| Items ×3 | run | opacity, translateY + count | 0, 8px → 1, 0 | 250 / 350ms; count 360ms | `--ease` / `--pop` | 3,160 + 420ms stagger | no rise |
| Bar segments | each item | width | 0 → 24 / 18 / 15% | 500ms | `--out` | with item | same |
| Next | run | translateY, scale, opacity | 40px, .9, 0 → 0, 1, 1 | 500ms | `--pop` | 4,500ms | fade only |
| Retry, Map | run | translateY, opacity | 10px, 0 → 0, 1 | 300ms | `--ease` | 4,760ms | fade only |

Under reduced motion every delay is halved, there is no shake, hit-stop, sparks or squash, and every entrance is a 300ms crossfade.

## States

- **Before reveal**: star slots are dark `#6E2416` star shapes; item tiles and buttons are `opacity:0` and `visibility:hidden`, so they cannot be focused before they arrive.
- **Next**: hover none (touch); active translateY(4px) with the lip shrinking to 2px.
- **Secondary**: deep brick fill, dough text; active none beyond the default.
- **Focus-visible**: 3px dough outline offset 3px plus a 6px ink halo.
- **Freeze**: a `.freeze` class on the stage pauses every animation inside it; JS count-ups check the class and hold their value.
- **Replay mid-sequence**: all timeouts and rAF ids are cancelled; every class and count resets to zero before the run starts again.

## Accessibility

- `h1` is the ribbon; the stars group is `role="img"` with "3 of 3 stars".
- The New best tag is `role="status"`, so it is announced once when it lands; the score itself is `aria-live="off"` to avoid reading every tick.
- The bar is a `progressbar` with `aria-valuemin="0" aria-valuemax="1000"` and `aria-valuenow` updated per item.
- Replay has `aria-label="Replay results"`. Buttons stay out of the tab order until they appear (`visibility:hidden`).
- Contrast: ink on butter 10:1, ink on dough 14:1, sub on dough 6.8:1, dough on deep brick 8.9:1, white on jam 5.6:1.
- Hit targets: Next 64px, Retry and Map 50px, Replay 44px.

## Responsive rules

- At 360 wide, keep 20px side padding; the side stars shrink to 76px and the middle to 98px; the score drops to 54px.
- Below 700px tall, collapse the stars row to 100px and the card gap to 12px; the actions stay pinned at the bottom.
- At tablet width the column stays 390px, centred; the sunburst stays full-screen behind it.

## Acceptance checklist

**Always**
- [ ] Rewards arrive one at a time: stars, then score, then new best, then items, then the primary button, then secondaries.
- [ ] Each star stamp squashes to about 1.28×.74, stretches to about .9×1.12 and settles, in 420ms.
- [ ] Each impact freezes every animation for one to two frames (64ms), then shakes for 160ms.
- [ ] The score counts with tabular figures, so its width does not jitter.
- [ ] The primary action is the last thing to arrive and sits in the bottom third, full width, 64px tall.
- [ ] Replay cancels all pending timers and frames and restarts cleanly, even mid-sequence.
- [ ] Reduced motion keeps the order but uses crossfades, with no shake, sparks or squash.
- [ ] Buttons are not focusable before they appear.
- [ ] `document.documentElement.scrollWidth` is 390.

**This demo**
- [ ] Ribbon "Level 23 baked!", chip "Moonmill · Crust Quarter".
- [ ] Score 48,260; "Previous best 41,900"; tag "New best +6,360".
- [ ] Items Croissants 24, Jam jars 9, Gold wheat 3; bar 380 → 950 / 1,000 crumbs.
- [ ] Next level, Retry, Map.

## Implementation notes

1. **Squash and stretch belong in one keyframe set**, with linear timing between hand-placed keys. Put the transform origin low (50% 60%) so the star squashes onto its slot instead of shrinking in place.

```css
.slot .full{transform-origin:50% 60%;opacity:0}
.slot.on .full{animation:stamp .42s linear both}
@keyframes stamp{
  0%{opacity:0;transform:scale(2.6) rotate(-18deg)}
  30%{opacity:1}
  40%{transform:scale(1.28,.74) rotate(0)}
  62%{transform:scale(.9,1.12)}
  80%{transform:scale(1.04,.97)}
  100%{opacity:1;transform:scale(1)}
}
```

2. **Hit-stop is a pause, not a delay.** Pausing every running animation for 64ms at the squash frame sells weight; resuming with a short stepped shake sells impact. JS count-ups must honour the same flag.

```css
.stage.freeze, .stage.freeze *{animation-play-state:paused!important}
.stage.shake{animation:shake .16s steps(4) 1}
```
```js
function hit(){
  stage.classList.add('freeze');
  setTimeout(() => {
    stage.classList.remove('freeze', 'shake'); void stage.offsetWidth; stage.classList.add('shake');
  }, 64);
}
slots.forEach((s, k) => at(520 + k * 360, () => { s.classList.add('on'); setTimeout(hit, 168); }));
```

3. **Keep a ledger of timers so Replay is clean.** Every `setTimeout` and `requestAnimationFrame` id goes in an array; `reset()` cancels them all, strips classes, zeroes counts, and restarts the CSS entrances by setting `animation:none`, forcing a reflow and clearing it. The common mistake is replaying on top of a running sequence, which stacks two count-ups on the same element.
