---
title: "Dating swipe deck with match screen"
summary: "A card stack for a dating app: drag to like or pass with rotation and LIKE/PASS stamps, velocity flings, a next card that grows in, and a calm match screen."
platform: mobile-app
type: screen
category: social
tags: [swipe, drag, cards, dating, press]
styles: [soft, playful]
motion: rich
difficulty: 3
featured: false
published: 2026-11-06
palette: ["#F4EDE3", "#FFFAF3", "#231A15", "#1D7149", "#B0301F"]
fonts: ["Space Grotesk"]
related: [motion-spring-throw-sheet, phone-feed-posts]
---

# Dating swipe deck with match screen

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The Discover tab of "Tandem", an invented dating app. A stack of profile cards, each a full-bleed golden-hour "photo" drawn in SVG (sky gradient, sun bloom, two hills and a rim-lit silhouette) with a solid cream plate at the bottom holding name, age, job, distance and one prompt. Drag the top card and it tilts around a point low on the card, a LIKE or PASS stamp inks in with distance, and the next card grows from 0.95 to 1 under it. Let go fast and it flings at a speed that matches your flick; let go slow and short and it springs home. Liking Leila, the third card, opens a quiet match screen. Worth copying: the fling uses the release velocity, not just distance, and the copy is respectful: no countdowns, no "she's waiting", no likes-left counter.

The language is iOS 26-ish: 26px card radius, 44px round header buttons, spring motion, a single sans family.

## Reference behaviour

1. First frame at 390 × 844 (Lounge status bar; content from 54px). Header 52px: the Tandem mark (two 7px-radius rings, rust `#C2410C` and ink, overlapping) and "tandem" (22/700, −0.03em); right, two 44px round buttons on `#FFFAF3` with a 1px `#E3D7C8` border: Filters and Messages.
2. Deck below (10px gap, 22px bottom margin) fills to the action row. The top card is Amara, 31, Ceramicist, 2 km away, prompt "A PERFECT SUNDAY": "Flea market at nine, a long lunch, then throwing bowls until the light goes." Behind it, two cards peek 12px and 24px lower at scale 0.95 and 0.9.
3. Card: 26px radius, shadow `0 18px 34px -18px rgba(35,26,21,.45)`, three 4px photo bars at the top (current one solid cream, others 45% cream). The plate is 10px in from the sides and bottom, `#FFFAF3`, radius 18: name 28/700 with age 28/400 `#5E5048`; a meta row (job with a bag icon, distance with a pin, 14/500); a 1px rule; prompt label (12/600, 0.08em, rust, uppercase) and answer (17/500, line-height 1.35).
4. Tap the right half of the photo: next photo (a 1.55× close crop on the face); tap again: a mirrored 1.12× wide crop; the left half goes back. The bars follow. Crops ease over 380ms expo-out.
5. Drag the card: it translates 1:1 and rotates `dx × 0.07°`, clamped to ±16°, around 50% 90%. The LIKE stamp (green `#1D7149`, rotated −14°, top-left) fades in as `dx / 90`; PASS (red `#B0301F`, +14°, top-right) as `−dx / 90`; dragging up shows "SUPER LIKE" (amber `#9A5B00`). Stamps are 4px outlined boxes on a cream fill, 38px/700, 0.06em.
6. While dragging, the second card goes from `translateY(12px) scale(.95)` to `translateY(0) scale(1)` as drag distance runs 0 → 160px; the third follows one step behind.
7. Release. Velocity is measured over the last six pointer samples. Like if `dx > 110` or `vx > 0.55 px/ms`; pass if `dx < −110` or `vx < −0.55`; super if `dy < −120` with `|dx| < 80`, or `vy < −0.9`. The card flies 520px sideways (or 900px up), rotating `tx / 26°`, over `clamp(220, 520 / v, 420)` ms with `cubic-bezier(.2,.7,.2,1)`. The stack moves up over 320ms expo-out.
8. Otherwise it springs home over 420ms `cubic-bezier(.34,1.56,.64,1)` and the stamps fade out.
9. Buttons in the lower third: Pass (64px, red X on cream), Super like (52px, amber star), Like (64px, solid green with a cream heart). Each scales to 0.9 on press and triggers the same fling as a drag.
10. Keyboard: Left arrow passes, Right likes, Up super likes. A polite live region says "Liked Amara." and so on.
11. Liking or super liking Leila (third card, "Let's argue about: Whether trams beat the metro. They do, and I have a slideshow.") opens the match screen after the card leaves: `#2A1D17` ground, two 132px discs ("You" on amber, "LR" on salmon) sliding in from ±90px with ±20° turning to ±6° over 620ms, a 48px green heart badge popping in at 300ms, "It's mutual" (44/700, −0.04em), "You and Leila liked each other. Say hello whenever you're ready; this match stays here.", a 54px cream "Send Leila a message" and a 48px outline "Keep browsing". Focus moves to the primary button; Escape closes.
12. After the last card: a dashed panel, "That's everyone nearby today", "New people show up as they join. You can also widen your distance in Filters." and a "Start over" pill.
13. Reduced motion: no transitions on the stack, crops or buttons; flings take 0ms; the match screen fades in 260ms with no slide or pop. Drag still follows the finger.

## Structure

```
390 × 844
┌──────────────────────────────────────┐
│ 54 status (Lounge)                   │
│ ◎◎ tandem                  (⚙) (✉)  │ 52 header, 44 buttons
│ ┌──────────────────────────────────┐ │ deck top ~116
│ │ ━━━━━━  ──────  ──────           │ │ photo bars 4px
│ │ [LIKE]                   [PASS]  │ │ stamps, top 44
│ │            ☀                     │ │
│ │          (head)                  │ │ SVG scene
│ │  hills  ▟█████▙                  │ │
│ │ ┌──────────────────────────────┐ │ │ plate, inset 10
│ │ │ Amara 31                      │ │ │ 28/700
│ │ │ ▭ Ceramicist  ⌖ 2 km away     │ │ │
│ │ │ ─────────────────────────────│ │ │
│ │ │ A PERFECT SUNDAY              │ │ │
│ │ │ Flea market at nine, a long…  │ │ │ 17/500
│ │ └──────────────────────────────┘ │ │
│ └──────────────────────────────────┘ │ two cards peek 12 / 24 below
│         (✕)    (☆)    (♥)            │ 92 action row, 64/52/64
└──────────────────────────────────────┘ 34 home indicator
```

- `<main class="app">`: flex column, `padding: 54px 16px 34px`, `overflow: hidden` (flung cards must not widen the page).
- `<header>` with the mark and a `<nav>` of two `<button>`s.
- `<section class="deck" aria-roledescription="card stack">`: one `<article class="card">` per person, appended in reverse so the first is on top; back cards `aria-hidden`.
  - `.ph` (the SVG scene, `aria-hidden`), `.bars`, three `aria-hidden` stamps, `.plate` with `<h2>`, meta, prompt.
- `.acts`: three `<button>`s with `aria-label` Pass / Super like / Like.
- `<section class="match" role="dialog" aria-modal="true">`, `visibility: hidden` when closed.
- `<p aria-live="polite">`.

## Tokens

```css
:root {
  --ground: #f4ede3;        /* app background */
  --plate: #fffaf3;         /* card plate, buttons */
  --line: #e3d7c8;          /* hairlines, button borders */
  --ink: #231a15;           /* 16:1 on plate */
  --ink-2: #5e5048;         /* meta, age; 7.4:1 on plate */
  --brand: #c2410c;         /* prompt label, focus; 5.0:1 on plate */
  --like: #1d7149;          /* LIKE stamp, Like button; cream on it 6.0:1 */
  --pass: #b0301f;          /* PASS stamp, Pass icon; 6.1:1 on cream */
  --super: #9a5b00;         /* SUPER LIKE stamp, star; 5.3:1 */
  --match-ground: #2a1d17; --match-body: #e6d6c6; --match-outline: #8a776a;
  --disc-you: #f2b43c; --disc-them: #f0a48a;
  /* photo scenes: sky top, sky low, far hill, near hill, figure */
  --scene-amara: #f6c58a, #e88a5a, #7b3b2a, #c96a3f, #3c2219;
  --scene-jonas: #bfe0dc, #6aa9a6, #1f4d55, #3f7f84, #14262b;
  --scene-leila: #f3d4c2, #d98b7a, #5a2f3a, #a85a5c, #2b1820;
  --scene-tomas: #e7dca6, #a9a65c, #3b4423, #77803d, #1e2412;
  --sans: "Space Grotesk", system-ui, sans-serif;
  --fs-match: 44px; --fs-name: 28px; --fs-stamp: 38px; --fs-logo: 22px; --fs-answer: 17px;
  --fs-body: 16px; --fs-meta: 14px; --fs-label: 12px;
  --r-card: 26px; --r-plate: 18px; --r-stamp: 10px; --r-pill: 999px;
  --sh-card: 0 1px 0 rgba(35,26,21,.06), 0 18px 34px -18px rgba(35,26,21,.45);
  --sh-button: 0 8px 18px -10px rgba(35,26,21,.45);
  --btn-main: 64px; --btn-super: 52px; --tap: 44px;
  --peek-1: 12px; --peek-2: 24px; --scale-1: .95; --scale-2: .9;
  --rot-per-px: .07deg; --rot-max: 16deg; --rot-origin: 50% 90%;
  --stamp-full: 90px;       /* drag distance at full stamp opacity */
  --like-dist: 110px; --like-vel: .55;  /* px/ms */
  --super-dist: 120px; --super-vel: .9;
  --fling-x: 520px; --fling-y: 900px; --fling-min: 220ms; --fling-max: 420ms;
  --out: cubic-bezier(.16,1,.3,1);
  --spring: cubic-bezier(.34,1.56,.64,1);
  --ease: cubic-bezier(.2,.7,.2,1);
  --d-stack: 320ms; --d-home: 420ms; --d-crop: 380ms; --d-press: 160ms;
  --d-match-fade: 260ms; --d-match-discs: 620ms; --d-heart: 520ms; --heart-delay: 300ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|
| Match title | Space Grotesk | 44px | 700 | 1 | −0.04em | sentence |
| Disc initials | Space Grotesk | 40px (You 30px) | 700 | 1 | 0 | as typed |
| Stamp | Space Grotesk | 38px (super 30px) | 700 | 1 | 0.06em | upper |
| Name / age | Space Grotesk | 28px | 700 / 400 | 1 | −0.03em | — |
| Logo | Space Grotesk | 22px | 700 | 1 | −0.03em | lower |
| Prompt answer | Space Grotesk | 17px | 500 | 1.35 | −0.01em | sentence |
| Match body, buttons | Space Grotesk | 16px | 400 / 600 | 1.4 | 0 | sentence |
| Meta | Space Grotesk | 14px | 500 | 1.4 | 0 | sentence |
| Prompt label | Space Grotesk | 12px | 600 | 1.4 | 0.08em | upper |

## Motion

| Thing | Trigger | Property | From → to | Timing | Reduced motion |
|---|---|---|---|---|---|
| Card follow | drag | translate, rotate | 1:1, dx × 0.07° (±16°) | per move | same |
| Stamps | drag | opacity | 0 → 1 over 90px (super over 110px up) | per move | same |
| Next card | drag | translateY, scale | 12px .95 → 0 1 over 160px | per move | same |
| Fling | release past threshold or fast | translate, rotate | → ±520px (or −900px), tx/26° | clamp(220, 520/v, 420)ms `--ease` | 0ms |
| Stack advance | after fling | translateY, scale | one step up | 320ms `--out` | instant |
| Spring home | short slow release | transform | → 0 | 420ms `--spring` | instant |
| Photo crop | tap half | transform | 1 → 1.55 → −1.12/1.12 | 380ms `--out` | instant |
| Button press | :active | scale | 1 → .9 | 160ms `--spring` | none |
| Match in | scripted like | opacity | 0 → 1 | 260ms `--ease` | same |
| Discs | match open | translateX, rotate, opacity | ±90px ±20° 0 → 0 ±6° 1 | 620ms `--out` | none |
| Heart badge | match open | scale | 0 → 1 | 520ms `--spring`, 300ms delay | none |

## States

- **Resting:** top card flat, stamps at 0, two cards peeking.
- **Dragging:** card follows; stamp grows with direction; next card grows in.
- **Flinging:** input on the deck is ignored for that card; the next card is already the top.
- **Springing home:** `.spring` transition on transform; stamps return to 0.
- **Photo n of 3:** bar n solid; crop applied on `.ph`.
- **Empty deck:** dashed panel with "Start over".
- **Match open:** dialog visible, deck untouched behind it; Escape or either button closes and focus returns to Like.
- **Focus-visible:** 3px `#C2410C` outline, 3px offset on every button.

## Accessibility

- Each card is an `<article>` labelled "Amara, 31, Ceramicist, 2 km away. A perfect Sunday: Flea market at nine…", so the whole profile is read in one go. Only the top card is exposed; the rest are `aria-hidden`.
- Every gesture has a button: Pass, Super like, Like (labelled). Arrow keys mirror them.
- Decisions and the match are announced in a polite live region.
- The match screen is a modal dialog; focus moves to "Send Leila a message"; Escape closes.
- No text sits on the SVG photo: name, meta and prompt are on the solid cream plate; stamps have their own cream fill.
- Contrast: ink 16:1, `#5E5048` 7.4:1, rust label 5.0:1 on cream; cream on green 6.0:1; `#E6D6C6` on `#2A1D17` 11:1.
- Targets: 44px header buttons, 64/52/64 action buttons, full-card drag target.

## Responsive rules

- At 360 wide the plate keeps 16px padding; long answers clamp at three lines; the action row gap drops to 16px.
- Under 760px tall the plate drops the rule and tightens to 12px padding; the deck keeps at least 440px.
- Fling distance is `max(520, innerWidth × 1.3)` so cards always fully leave at tablet width; above 430px the column centres at 430px.
- The SVG scene uses `preserveAspectRatio="xMidYMid slice"`, so any card ratio keeps the figure centred.

## Acceptance checklist

**Always**
- [ ] Rotation pivots near the bottom of the card (origin 50% 90%) and is clamped to ±16°.
- [ ] Stamps fade in proportionally to drag and never cover the plate text.
- [ ] The next card scales and rises with drag progress, not only after release.
- [ ] A quick 60px flick likes or passes (velocity over the last samples); a slow 100px drag springs back.
- [ ] Fling duration shortens with faster flicks, within 220–420ms.
- [ ] Pass, Super like and Like buttons and the arrow keys do exactly what the gestures do.
- [ ] The match screen is a modal dialog, `visibility: hidden` when closed, and has no timer or urgency copy.
- [ ] Profile text sits on a solid plate at 4.5:1 or better.
- [ ] `scrollWidth` stays 390 while cards fly off.
- [ ] Reduced motion keeps drag, drops flings, springs and the match slide.

**This demo**
- [ ] Deck order: Amara 31 (Ceramicist, 2 km), Jonas 33 (Paediatric nurse, 4 km), Leila 29 (Urban planner, 6 km), Tomás 34 (Line cook, 1 km).
- [ ] Liking Leila opens "It's mutual" with "You" and "LR" discs and "Send Leila a message".
- [ ] Empty state "That's everyone nearby today" with "Start over".

## Implementation notes

**1. Velocity from the last samples.** Keep a short ring buffer of `[time, x, y]` and compute px/ms between its ends on release. A single last-delta is noisy; the whole gesture average is too slow.

```js
g.s.push([e.timeStamp, e.clientX, e.clientY]); if (g.s.length > 6) g.s.shift();
// on release
const a = g.s[0], b = g.s[g.s.length - 1], dt = Math.max(1, b[0] - a[0]);
const vx = (b[1] - a[1]) / dt, vy = (b[2] - a[2]) / dt;
if (dy < -120 && Math.abs(dx) < 80 || vy < -.9 && Math.abs(vx) < .5) return decide('up', -vy);
if (dx > 110 || vx > .55) return decide('right', vx);
if (dx < -110 || vx < -.55) return decide('left', -vx);
```

**2. Fling at the finger's speed.** Duration is distance over velocity, clamped, so a hard flick leaves fast and a pushed card glides.

```js
const ms = reduced ? 0 : Math.max(220, Math.min(420, 520 / Math.max(.6, v)));
el.style.transition = `transform ${ms}ms cubic-bezier(.2,.7,.2,1)`;
el.style.transform = `translate(${tx}px,${ty}px) rotate(${tx / 26}deg)`;
```

**3. Stack progress during drag.** Drive the back cards from the same progress value so the next card is already "arriving" when you let go.

```js
const layout = (prog) => cards.forEach((c, k) => { if (!k) return;
  const s = k === 1 ? .95 + .05 * prog : .9 + .05 * prog, y = k === 1 ? 12 - 12 * prog : 24 - 12 * prog;
  c.style.transform = `translateY(${y}px) scale(${s})`; });
layout(Math.min(1, Math.hypot(dx, dy) / 160));
```

Common mistakes: rotating around the card centre (it looks like a spinning plate, not a held card), forgetting `touch-action: none` on the card (the page scrolls instead), treating a 3px wobble as a drag (use a 6px tap threshold for the photo crop), and match copy that pressures ("Don't keep her waiting!").
