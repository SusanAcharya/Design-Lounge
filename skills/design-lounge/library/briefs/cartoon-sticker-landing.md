<!-- Design Lounge Nº 548 · "Cartoon sticker landing page" · www.designlounge.live -->

# Cartoon sticker landing page

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The landing page for "Mopsy", an invented app that splits household chores fairly. It borrows the rubber-hose cartoon look: thick 4px outlines in warm brown-black (`#2A1A12`, never black), noodle arms, white-glove hands, a mop-headed mascot made of a few SVG paths, and a mint blob behind it that "boils" (jitters between two poses on `steps(2)`) the way hand-inked animation does. Buttons are chunky 60px slabs with 6px hard shadows. Under the hero a real chore board (checkboxes, points, a progress bar) shows the product. The detail worth copying: the mascot responds to the page. Its pupils follow the pointer up to 6px, and when the main CTA is hovered or focused it waves and opens its mouth, so the character points at the one thing you should click.

## Structure

```
1280 × 800 first frame (page scrolls)
+--------------------------------------------------------------------------------+
| (o) mopsy                          How it works  Pricing  Questions [Get the app] | 84
|                                                                                |
| (New  Shared shopping list, synced live)        .-~~~~~~~~-.   [Bins out tonight]|
| Chores, but                                    (   .-mmm-.  )   Tom, 8:00 pm    |
| everyone                                      (   ( o   o ) o/                 |
| actually does   (orange squiggle)              (  (  \__/  )  )                  |
| them.            78px Bagel Fat One             o-(          )  )                |
| lede 34ch                                     [+40 points]~~~~-'                 |
| [Start a household ->]  [See the chore board]                                  |
| (PR)(TO)(AD)(JK) 41,800 households, 4.8 on 12,400 reviews                      |
+--------------------------------------------------------------------------------+
| band (card fill, 4px rules top and bottom)                                     |
| One board for the whole flat.   +-- This week at Flat 4B ------ Sun 26 Oct... -+|
| copy, price line                | [x] (PR) Dishes, every night          40     ||
|                                 | [ ] (TO) Bins and recycling           20     ||
|                                 | [ ] (AD) Bathroom, deep clean         60     ||
|                                 | [=====-----------] 40 of 120 points done     ||
+--------------------------------------------------------------------------------+
| mopsy        Made in Bristol by a team of six ...              iOS · Android · web |
wrap 1180px, padding 0 40px; hero grid 1.05fr / 1fr, gap 24px
```

- `<header class="nav">`: logo link (34px blob `<i>` with uneven `border-radius`), `<nav><ul>`, `.btn.sm.w`.
- `<section class="hero">`: left `<div>` with `.chip`, `<h1>` (the squiggle is an inline SVG inside `.u`), `.lede`, `.ctas`, `.proof`. Right `.stage` (`aria-hidden`, `aspect-ratio: 1 / .92`) with `svg.blob` (viewBox 400 × 370), `svg.mop` (viewBox 300 × 300, 72% wide) and two `.stick` spans.
- `.mop` layers in paint order: floor shadow ellipse, right arm group (`.arm`: noodle path + glove circle), left arm, body, body shade stroke, mop fringe, eyes group (`#eyes`: two ovals with white wedge highlights), blink lid, small smile, open grin, left glove, cheeks.
- `<section class="band">`: two columns; `.board` (rotated 1°) of `<label class="chore">` rows (`<input type=checkbox>`, avatar, text, points), a `role="progressbar"`.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
|---|---|---|---|---|---|
| Blob boil | always | transform | none ↔ rotate(1.2deg) scale(1.01,.99) | 1.2s `steps(2)` | static |
| Blink | always | lid `scaleY` | 0 → 1 → 0 at 92–100% | 4s | lid hidden, eyes open |
| Pupils | pointermove | translate | 0 → up to 6px toward pointer | 120ms `--ease` | not bound |
| Wave | CTA hover or focus, stage hover, chore ticked | arm group rotate around (226,168) | 0 → 24deg | 380ms `--spring` | 1ms |
| Grin | same | opacity swap smile ↔ grin | 0 ↔ 1 | 120ms | 1ms |
| Button lift | hover | transform, shadow | → (-3px,-3px) rotate(-1.5deg), 6 → 9px | 140ms `--spring` | 1ms |
| Button press | active | transform, shadow | → (4px,4px), 2px | 140ms | 1ms |
| Progress | chore change | width | old → new % | 500ms `--spring` | 1ms |

## States

- **Primary button:** orange, 4px ink border, 18px radius, 6px hard shadow. **White button:** `--card` fill. **Hover:** lift and tilt. **Active:** pressed. **Focus-visible:** 4px ink outline at 4px offset, 12px radius.
- **Nav link hover:** wavy orange underline, 3px, 6px offset.
- **Chore unchecked:** 30px box, 4px ink border, `--card` fill. **Checked:** mint fill with a 4px ink check (rotated L), title struck through 3px orange.
- **Mascot rest:** small smile, arm up at 0°. **Excited:** arm 24° out, open grin. **Blink:** lid over eyes for about 120ms each 4s.
- **Progress:** orange fill with a 3px ink right edge; label "40 of 120 points done" updates with each tick.

## Accessibility

- The whole stage is `aria-hidden`; the mascot is decoration and its reactions duplicate what the button already says.
- Chores are real checkboxes inside `<label>` with `aria-label`s ("Bins and recycling, Tom"); Space toggles. The progress bar has `role="progressbar"`, `aria-valuemin="0"`, `aria-valuemax="120"` and an updated `aria-valuenow`.
- The CTA's `focus` also triggers the wave, so keyboard users get the same moment.
- Contrast on cream: ink 15.0:1, `--ink-2` 8.1:1. Ink on orange 6.4:1, on mint 9.7:1, on pink 9.3:1, on butter 12.1:1. All button text is ink.
- The 4px ink border keeps every checkbox well above 3:1 against its row.
- Hit targets: 60px buttons, 48px nav button, 30px checkbox inside a full-row label (the whole row is clickable).

## Responsive rules

- ≥ 1280: as drawn.
- 900–1279: columns keep their ratio; H1 scales with its clamp.
- < 900: hero and band stack; nav links hide (logo and "Get the app" stay); the stage centres at up to 520px wide.
- < 640: wrap padding 16px; nav 72px; logo 26px; nav button 44px with a 3px shadow; lede 18px; buttons 56px; stickers 13px; band padding 44px; the board loses its 1° tilt and rows tighten to 36px avatars. At 390 nothing scrolls sideways and the H1 sits on three lines.

## Acceptance checklist

**Always**
- [ ] Every outline is 3–4px in the warm ink colour; no `#000`.
- [ ] Buttons are at least 56px tall with a 6px hard ink shadow; hover lifts and tilts, active presses within 140ms.
- [ ] The background blob boils on a two-step loop, not a smooth tween.
- [ ] The mascot is an original character from basic SVG paths, `aria-hidden`, and blinks on a 4s cycle.
- [ ] Pupils follow the pointer and never move more than 6px.
- [ ] Hovering or focusing the main CTA makes the mascot wave and grin; leaving reverts.
- [ ] Chore checkboxes are native inputs; ticking one updates points, the progress bar and its `aria-valuenow`.
- [ ] Reduced motion stops boil, blink and pointer tracking; every state still works.
- [ ] At 390 wide the layout stacks with no sideways scroll.

**This demo**
- [ ] H1 reads "Chores, but everyone actually does them." with an orange squiggle under "actually".
- [ ] Stickers read "Bins out tonight / Tom, 8:00 pm" and "+40 points / Priya did the dishes".
- [ ] The board is "This week at Flat 4B", Sun 26 Oct to Sat 1 Nov, chores worth 40, 20, 60, starting at 40 of 120.
- [ ] Pricing line: free for two people, £3 a month for up to eight.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state at 1280 × 800: an 84px nav (logo blob + "mopsy", three links, a white "Get the app" button) on a cream page with a 28px dot grid. The hero is two columns: copy left (mint "New" chip rotated -2°, 78px headline, lede, two buttons, social proof), mascot stage right (mint blob, Mop, two tilted stickers).
2. The headline reads "Chores, but everyone actually does them." with a hand-drawn orange squiggle under "actually".
3. The blob alternates between rest and `rotate(1.2deg) scale(1.01, .99)` on a 1.2s `steps(2)` loop: a two-frame line boil, not a smooth wobble.
4. Mop blinks: an orange lid scales from 0 to full over the eyes at 95% of a 4s cycle.
5. Move the pointer anywhere: Mop's eyes shift toward it, up to 6px (distance / 40, capped), 120ms ease.
6. Hover or focus "Start a household", or hover the stage: Mop's right arm (with its glove) swings 24° outward around the shoulder over 380ms with a spring overshoot, and the small smile swaps for an open grin. Leaving reverts it.
7. Hover any button: it lifts `translate(-3px,-3px) rotate(-1.5deg)` and its shadow grows 6px → 9px (140ms spring). Press: `translate(4px,4px)`, shadow 2px.
8. Scroll to the band "One board for the whole flat.": a chore board for "Flat 4B" with three chores. Tick a chore: its box fills mint with a check, its title is struck through in orange, the progress bar springs to the new total over 500ms, the label reads "N of 120 points done", and Mop grins and waves for 900ms.
9. Footer: wordmark, a one-line team note, platforms.

## Tokens

```css
:root {
  /* colour */
  --cream: #fff1d6;     /* page */
  --dot: #f3dcb0;       /* 2px dots on a 28px grid */
  --card: #fffaf0;      /* band, cards, white buttons, gloves, fringe */
  --ink: #2a1a12;       /* every outline, text, hard shadows */
  --ink-2: #5c4335;     /* lede, captions (8.1:1 on cream) */
  --orange: #ff7a2f;    /* Mop, primary button, squiggle, progress */
  --orange-sh: #d9561a; /* Mop's body shade stroke */
  --mint: #7ed6b5;      /* blob, chip, checked box */
  --pink: #ffa8c5;      /* cheeks, sticker, avatar */
  --butter: #ffd75e;    /* sticker, avatar */

  /* type */
  --disp: "Bagel Fat One", system-ui, sans-serif;
  --body: "Fredoka", system-ui, sans-serif;
  --fs-h1: clamp(44px, 6.1vw, 78px);
  --fs-h2: clamp(34px, 4.6vw, 56px);
  --fs-logo: 32px; --fs-lede: 20px; --fs-body: 17px; --fs-btn: 19px; --fs-small: 15px;

  /* shape */
  --o: 4px;                       /* outline on buttons, blob, board, stickers */
  --o-thin: 3px;                  /* chip, chore rows, avatars */
  --hard: 6px 6px 0 var(--ink);
  --hard-lift: 9px 9px 0 var(--ink);
  --hard-press: 2px 2px 0 var(--ink);
  --r: 22px; --r-btn: 18px; --r-row: 16px; --r-check: 9px;
  --btn-h: 60px; --btn-sm-h: 48px;
  --wrap: 1180px;

  /* motion */
  --t-micro: 140ms;
  --t-wave: 380ms;
  --t-bar: 500ms;
  --boil: 1.2s steps(2) infinite;
  --blink: 4s;
  --pupil-max: 6px;
  --spring: cubic-bezier(.34, 1.56, .64, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role | Family | Size / line | Weight | Notes |
|---|---|---|---|---|
| H1 | Bagel Fat One | clamp(44px, 6.1vw, 78px) / 0.95 | 400 | -0.02em; "actually" nowrap with squiggle |
| H2 | Bagel Fat One | clamp(34px, 4.6vw, 56px) / 1 | 400 | -0.01em |
| Logo, footer mark | Bagel Fat One | 32 / 1, 26 | 400 | |
| Points | Bagel Fat One | 20 / 1 | 400 | |
| Lede | Fredoka | 20 / 1.5 | 500 | `--ink-2`, 34ch |
| Body | Fredoka | 17 / 1.5 | 500 | |
| Buttons | Fredoka | 19 / 1 (small 16) | 600 | |
| Nav, chip, stickers | Fredoka | 15–17 | 600–700 | |

## Implementation notes

**Wave around the shoulder, glove included.** Group the arm path and its glove and rotate the group around a point in the SVG's own coordinates; `fill-box` origins make the glove fly off the arm.

```css
.mop .arm { transform-box: view-box; transform-origin: 226px 168px;
            transition: transform 380ms cubic-bezier(.34, 1.56, .64, 1); }
body.hey .mop .arm { transform: rotate(24deg); }
body.hey .mop .smile1 { opacity: 0 } body.hey .mop .smile2 { opacity: 1 }
```

**Pupils that look at the pointer**, capped so the eyes never leave their sockets:

```js
addEventListener('pointermove', e => {
  const r = eyes.getBoundingClientRect(); if (!r.width) return;
  const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
  const d = Math.hypot(dx, dy) || 1, k = Math.min(6, d / 40);
  eyes.style.transform = `translate(${(dx / d * k).toFixed(1)}px, ${(dy / d * k).toFixed(1)}px)`;
});
```

**Line boil** is two frames, not a tween:

```css
.blob { animation: boil 1.2s steps(2) infinite; }
@keyframes boil { 50% { transform: rotate(1.2deg) scale(1.01, .99); } }
```

Common mistakes: making the mascot bounce constantly (it should only react to the CTA and the board); white text on the orange button (fails AA; ink on orange is 6.4:1); a `box-shadow` with blur on cartoon elements (every shadow here has 0 blur); forgetting the `focus` listener so the mascot only reacts to a mouse.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
