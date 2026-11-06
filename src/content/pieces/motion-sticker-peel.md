---
title: "Peel-and-place reward sticker"
summary: "A travel journal's streak reward: drag the corner to peel a sticker off its glossy liner, the curl follows your finger, then press it onto today's page with a settle."
platform: mobile-app
type: component
category: micro
tags: [drag, reward, sticker, journal, peel]
styles: [paper, playful]
motion: rich
difficulty: 3
featured: false
published: 2026-11-06
palette: ["#E8DCC6", "#FBF7EE", "#2B241C", "#2F5DA8", "#F2B632"]
fonts: ["Syne"]
related: [sticker-board, cartoon-sticker-landing]
---

# Peel-and-place reward sticker

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The day-7 screen of "Wayfolio", an invented travel journal. You walked every day of your week in Porto, and the reward is a die-cut sticker (a yellow tram on an azulejo band under a dusk sky, "PORTO / WEEK ONE / 7/7 DAYS") sitting on a glossy backing liner at the bottom of the screen. Its bottom-right corner is already dog-eared. Drag it and the corner curls back along a true fold line: the front is cut away, the white back of the sticker appears mirrored across the fold with a highlight along the crease, and a soft shadow falls on the sticker beneath. Pull far enough and it pops off the liner; carry it to the dashed spot on today's ruled journal page and let go: it presses down with a squash, a gloss sweep and a few yellow specks. Let go early and the corner springs back. Worth copying: the fold maths is about 25 lines and needs no canvas or WebGL, just two `clip-path` polygons and one reflection matrix.

## Reference behaviour

1. First frame, 390 × 844 on a kraft desk `#E8DCC6` (the Lounge draws the status bar). Top at 56px: 44px round back button, "Porto, week one" (16/700) over "Day 7 of 7 · Wayfolio journal" (13, `#62574A`), 44px round camera button.
2. Journal page card, 452px tall, radius `6 18 18 6`, `#FBF7EE` with 1px rules `#E9E0CF` every 28px from y 60 and a 1.5px pink margin line `#E7A48F` at x 24. Contents: "Ribeira to Foz" (Syne 26/800, −0.02em), "SAT 7 NOV · 11.8 KM" (12/600, 0.1em), a four-line entry set on the rules (15px, line-height 28px), two earlier stickers (a "Linha 28" tram ticket stub at −4°, a pastry disc at −8°) and, at right 16px / top 232px, a 164px dashed slot (2px `#A89B86`, radius 26) reading "Sticker goes here".
3. Reward row at the bottom (thumb zone): left, "Seven days on foot in Porto" (22/800), "64.2 km walked · streak sticker earned" and a 32px paper chip "Peel the corner" with a diagonal arrow that nudges 3px toward the corner three times. Right, the 188 × 212 liner: a pale silicone gradient `#E9EEEF → #DFE5E6 → #EEF2F2 → #CFD8DA` at 135°, a faint die-cut outline where the sticker sits, and "EARNED · 7/7" (11/700) along the bottom.
4. The sticker (164px square, radius 26, 6px white die-cut border, 1px contact shadow) rests on the liner with its corner curled: the fold point is 24px in from the bottom-right corner on both axes.
5. Pointer down anywhere on the sticker, then drag: the fold point P follows the finger's movement from where it started (P = rest point + finger delta). The corner C is fixed at (164, 164). The fold line is the perpendicular bisector of C and P.
6. While curling: the sticker face is clipped to the far side of the fold; the cut-away part is drawn as the sticker's back (`#F4F1EA`), reflected across the fold, with a white highlight right at the crease, then `#F1EDE4` 7% later and `#D4CCBD` 40% later. The flap casts `drop-shadow(-3px 4px 5px rgba(43,36,28,.32))`; the face gets a crease shadow that darkens to `rgba(43,36,28,.22)` at the fold.
7. Release before the lift point: P springs back to the rest curl (k 500, c 30, m 1), with a slight wobble.
8. When |C − P| exceeds 1.3 × 164 = 213px, the sticker pops off: it goes flat, centres on the finger, tilts −6°, scales 1.06 and gets a lifted shadow (`0 18px 18px rgba(43,36,28,.3)` + `0 2px 3px rgba(43,36,28,.2)`) over 180ms. The hint chip disappears.
9. Carry it: the sticker follows the finger. Within 80px of the slot, the slot's dash turns blue `#2F5DA8`.
10. Drop within 80px of the slot: it springs into the slot (k 520, c 40), settles at −3°, and plays the press: scale 1.06 → 0.955 → 1.012 → 1 over 460ms expo-out, a white gloss band sweeps across in 700ms (120ms delay), and six 6px yellow specks fly 70 → 104px out and fade (520ms). The slot hides; a "Replay" button replaces the hint. A polite live region says "Sticker placed on Saturday's page."
11. Drop elsewhere on the page: it presses down where it is (clamped 8px inside the page). Drop off the page: it springs back to the liner (k 300, c 26), then the corner re-curls to rest.
12. Keyboard: the sticker is a `<button>`. Enter or Space plays the whole gesture: the curl travels to the lift point over 620ms (cubic out), it lifts, then 260ms later springs into the slot and presses.
13. Replay: the sticker returns to the liner with its corner curled, the slot and hint come back, focus returns to the sticker.
14. Reduced motion: the curl still follows the finger (it is direct manipulation), but no hint nudge, no spring travel (jumps to the slot or back to the liner), no squash, gloss or specks.

## Structure

```
390 × 844
┌──────────────────────────────────────┐
│ 54 status (Lounge)                   │
│ (‹)  Porto, week one            (◎)  │ 56–104 header
│ ┌──────────────────────────────────┐ │ 116 page, 452 tall
│ ││ Ribeira to Foz                  │ │ 26/800
│ ││ SAT 7 NOV · 11.8 KM             │ │
│ ││ entry, 4 lines on 28px rules     │ │
│ ││ [Linha 28 ticket]  ┌ ─ ─ ─ ─ ┐  │ │ slot 164², right 16, top 232
│ ││                    │ Sticker  │  │ │
│ ││ (pastry)           └ ─ ─ ─ ─ ┘  │ │
│ └──────────────────────────────────┘ │
│ Seven days on      ┌─ liner 188×212┐ │ reward row, margin-top auto
│ foot in Porto      │ ┌──sticker──┐ │ │
│ 64.2 km walked …   │ │   164²   ◸│ │ │ corner curled 24px
│ [↖ Peel the corner]│ └──────────┘ │ │
│                    │ EARNED   7/7  │ │
└──────────────────────────────────────┘ 34 bottom pad
```

- `<main class="app">`: `position: relative; overflow: clip` (the reflected flap's box extends past the sticker; without the clip the page scrolls sideways).
- `<header class="top">`, `<article class="page" aria-label="Journal page, Saturday 7 November">` with `<h1>`, date, entry `<p>`, the `aria-hidden` slot and two decorative SVG stickers.
- `<section class="reward">`: `<h2>`, stats, hint chip, hidden Replay `<button>`, and the `.liner`.
- `<button class="stk">` positioned absolutely in `.app` coordinates (it must travel between liner and page):
  - `.in` (press animation) → `.basew` (contact or lifted shadow) → `.base` (clip-path: the face side) → `.face` (white border + SVG art) and `.crease`.
  - `.gloss` (sweep), `.flapw` (reflection matrix + flap shadow) → `.flap` (clip-path: the corner side, back-of-sticker gradient), six `.dust` specks.
- `<p class="vh" aria-live="polite">`.

## Tokens

```css
:root {
  /* paper and desk */
  --desk: #e8dcc6;
  --page: #fbf7ee;
  --rule: #e9e0cf;
  --margin: #e7a48f;
  --slot-line: #a89b86;
  --ink: #2b241c;
  --ink-2: #62574a;        /* 6.7:1 on page */
  --outline: #8d806d;      /* Replay border */
  /* sticker art */
  --blue: #2f5da8;         /* azulejo, focus, slot hot */
  --blue-deep: #1f3f78;
  --yellow: #f2b632;       /* tram, specks */
  --sky-top: #f9d58a; --sky-low: #f4a66b; --hills: #e27d55; --roofs: #c55a3a; --sun: #fff3d6;
  --die-cut: #ffffff;
  --back: #f4f1ea;         /* sticker back */
  --back-mid: #f1ede4; --back-tip: #d4ccbd;
  /* liner */
  --liner: #dfe5e6; --liner-2: #cfd8da; --liner-hi: #e9eeef; --liner-label: #4b5557;
  /* type */
  --sans: "Syne", system-ui, sans-serif;
  --fs-page-title: 26px; --fs-reward: 22px; --fs-entry: 15px; --fs-top: 16px; --fs-meta: 13px; --fs-hint: 12px; --fs-label: 11px;
  --rule-step: 28px;
  /* geometry */
  --S: 164px;              /* sticker */
  --r-sticker: 26px; --die-border: 6px;
  --rest-curl: 24px;       /* fold point inset from the corner */
  --lift: 1.3;             /* × S of |C − P| pops it off */
  --snap-radius: 80px;
  --r-page: 6px 18px 18px 6px; --r-liner: 14px; --r-chip: 16px;
  /* shadows */
  --sh-contact: drop-shadow(0 1px 1px rgba(43,36,28,.25));
  --sh-lifted: drop-shadow(0 18px 18px rgba(43,36,28,.3)) drop-shadow(0 2px 3px rgba(43,36,28,.2));
  --sh-flap: drop-shadow(-3px 4px 5px rgba(43,36,28,.32));
  --crease: rgba(43,36,28,.22);
  /* springs (k, c, m = 1) */
  --spring-curl: 500 30;   /* early release */
  --spring-place: 520 40;  /* into the slot */
  --spring-home: 300 26;   /* dropped off the page */
  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --out: cubic-bezier(.16,1,.3,1);
  --d-lift: 180ms; --lift-tilt: -6deg; --lift-scale: 1.06; --placed-tilt: -3deg;
  --d-press: 460ms; --d-gloss: 700ms; --gloss-delay: 120ms; --d-dust: 520ms;
  --d-auto-peel: 620ms; --auto-gap: 260ms;
  --d-nudge: 1800ms;       /* × 3, 600ms delay */
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|
| Page title | Syne | 26px | 800 | 1 | −0.02em | Title |
| Reward headline | Syne | 22px | 800 | 1.05 | −0.02em | Sentence |
| Entry | Syne | 15px | 400 | 28px (on the rules) | 0 | Sentence |
| Header title | Syne | 16px | 700 | 1.2 | 0 | Sentence |
| Meta, stats | Syne | 13px | 400 | 1.5 | 0 | Sentence |
| Date | Syne | 12px | 600 | 1.5 | 0.1em | Upper |
| Hint chip | Syne | 12px | 600 | 1 | 0 | Sentence, nowrap |
| Liner label | Syne | 11px | 700 | 1 | 0.08em | Upper |
| Sticker "PORTO" | Syne (SVG) | 22 units | 800 | — | −0.5 | Upper |

## Motion

| Thing | Trigger | Property | From → to | Timing | Reduced motion |
|---|---|---|---|---|---|
| Hint arrow | load | translate | 0 → (−3, −3) → 0 | 1800ms × 3, 600ms delay | none |
| Curl | drag on liner | clip-path ×2, flap matrix, gradients | fold point follows finger | per pointermove | same |
| Curl return | release before lift | fold point | P → rest (24px in) | spring k 500, c 30 | same (direct) |
| Lift | \|C − P\| > 213px | transform, filter | flat; −6°, 1.06, lifted shadow | 180ms `--out` | opacity 200ms |
| Carry | drag | translate | follows finger | — | same |
| Slot hot | within 80px | border-color | `#A89B86` → `#2F5DA8` | 200ms `--ease` | same |
| Into slot | drop near slot | translate | drop point → slot | spring k 520, c 40 | jump |
| Press | arrival | scale (inner) | 1.06 → 0.955 → 1.012 → 1 | 460ms `--out` | none |
| Gloss | arrival | left of a skewed band | −60% → 130% | 700ms `--ease`, 120ms delay | none |
| Specks | arrival | rotate(a) translateX, opacity | 70px, 1 → 104px, 0 | 520ms `--out` | none |
| Home | drop off page | translate | → liner | spring k 300, c 26, then curl spring | jump |
| Auto peel | Enter / Space | fold point | rest → lift point | 620ms cubic out, then lift, 260ms, place | lift and place at once |

## States

- **Resting:** corner dog-eared, contact shadow, hint chip visible.
- **Curling:** face clipped, flap mirrored with crease highlight and shadow; cursor stays on the sticker (pointer captured).
- **Lifted:** flat, −6°, 1.06, big shadow; slot turns blue when within 80px.
- **Placed:** on the page at −3°, contact shadow, slot hidden (`visibility:hidden`), Replay visible; further drags ignored.
- **Returning:** springs back to the liner, ignores input until the curl has re-formed.
- **Focus-visible:** 3px `#2F5DA8` outline, 3px offset, on the sticker, header buttons and Replay.

## Accessibility

- The sticker is a `<button>` labelled "Porto week sticker. Press Enter to peel it and place it on today's page." Enter and Space run the full peel-lift-place sequence, so the reward is never pointer-only.
- The placement is announced in a polite live region; Replay then takes focus back to the sticker.
- The slot and the decorative page stickers are `aria-hidden`; the journal text is real text.
- Contrast: `#62574A` on `#FBF7EE` 6.7:1; `#4B5557` liner label on `#DFE5E6` 6.1:1; hint chip ink on paper 14:1. Sticker art text sits on solid fills (ink on the sky, deep blue on the cream pill).
- Hit targets: the sticker is 164px; header buttons 44px; Replay 40px.
- Keep the sticker's SVG text in short words: two-word labels inside narrow SVG elements can be read as collapsed columns by layout checks.

## Responsive rules

- At 360 wide the reward text column narrows to ~126px (headline wraps to four lines); the liner and sticker keep 188px and 164px.
- On shorter screens (under 780px tall) reduce the page to 400px; the slot moves up with it (keep it 16px from the right, below the entry).
- Above 430px wide the app column centres at 430px and the sticker can only travel inside it.
- Recompute the liner and slot positions on resize; a placed sticker re-snaps to the slot.

## Acceptance checklist

**Always**
- [ ] The curl is a geometric fold: fold line = perpendicular bisector of the fixed corner and the fold point; the face is clipped on one side and the mirrored back appears on the other.
- [ ] Crease highlight on the flap and crease shadow on the face both sit exactly on the fold line and move with it.
- [ ] Release before 1.3 × size springs the corner back to its resting curl with a visible wobble.
- [ ] Past the threshold the sticker lifts flat, tilted and shadowed, and follows the finger.
- [ ] Dropping within 80px of the slot snaps into it; on the page elsewhere it sticks where dropped; off the page it returns to the liner.
- [ ] The press is a squash-and-settle with a gloss sweep, in that order, under 800ms total.
- [ ] Keyboard Enter/Space plays the whole gesture and announces the result.
- [ ] Replay restores the first frame exactly (curl, hint, slot).
- [ ] Reduced motion keeps direct manipulation but removes travel springs, squash, gloss, specks and the hint nudge.
- [ ] `scrollWidth` stays 390 at every point of the gesture.

**This demo**
- [ ] Page "Ribeira to Foz", "SAT 7 NOV · 11.8 KM"; reward "Seven days on foot in Porto", "64.2 km walked · streak sticker earned".
- [ ] Sticker art: tram, azulejo band, "PORTO", "WEEK ONE", "7 / 7 DAYS".
- [ ] Live region copy "Sticker placed on Saturday's page."

## Implementation notes

**1. The fold.** Clip the square with one half-plane twice (keep each side) and reflect the corner side across the line. `clip-path` on the flap is in its own coordinates, so apply the reflection on a wrapper.

```js
// C = corner (S,S), P = fold point. n points from P to C; M is the midpoint.
const n = norm(C.x - P.x, C.y - P.y), M = { x: (C.x + P.x) / 2, y: (C.y + P.y) / 2 };
const cut = (sign) => {               // Sutherland–Hodgman against one plane
  const sq = [{x:0,y:0},{x:S,y:0},{x:S,y:S},{x:0,y:S}], out = [];
  const f = (p) => sign * ((p.x - M.x) * n.x + (p.y - M.y) * n.y);
  for (let i = 0; i < 4; i++) { const a = sq[i], b = sq[(i + 1) % 4], fa = f(a), fb = f(b);
    if (fa <= 0) out.push(a);
    if ((fa <= 0) !== (fb <= 0)) { const t = fa / (fa - fb); out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }); } }
  return out;
};
base.style.clipPath = poly(cut(1));   // face side
flap.style.clipPath = poly(cut(-1));  // corner side
const k = 2 * (M.x * n.x + M.y * n.y); // X' = (I − 2nnᵀ)X + 2(M·n)n
flapW.style.transform = `matrix(${1-2*n.x*n.x},${-2*n.x*n.y},${-2*n.x*n.y},${1-2*n.y*n.y},${k*n.x},${k*n.y})`;
```

**2. Light that sits on the crease.** Turn the fold position into a gradient stop: the CSS angle for direction n is `atan2(n.x, −n.y)`, and for a square the gradient line is `S·(|n.x| + |n.y|)` long.

```js
const ang = Math.atan2(n.x, -n.y) * 180 / Math.PI, Lg = S * (Math.abs(n.x) + Math.abs(n.y));
const at = (((M.x - S/2) * n.x + (M.y - S/2) * n.y) / Lg + 0.5) * 100;
flap.style.background = `linear-gradient(${ang}deg,#f4f1ea ${at-1}%,#fff ${at}%,#f1ede4 ${at+7}%,#d4ccbd ${at+40}%)`;
crease.style.background = `linear-gradient(${ang}deg,transparent ${at-9}%,rgba(43,36,28,.22) ${at}%)`;
```

**3. Shadows and clips in the right order.** CSS applies `filter` before `clip-path` on the same element, so a drop-shadow on a clipped element is clipped away. Put the shadow on a wrapper (`.basew`, `.flapw`) and the clip on its child. Put the press squash on an inner element (`.in`), because the outer transform carries position and tilt and a keyframe on it would wipe them.

Common mistakes: rotating a flap image instead of reflecting it (the curl then hinges on a fixed edge and looks like a door), forgetting `overflow: clip` on the container (the reflected box pushes `scrollWidth` past 390), and moving the sticker between DOM parents mid-gesture, which drops pointer capture.
