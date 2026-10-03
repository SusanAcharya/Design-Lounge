<!-- Design Lounge Nº 309 · "Tablet recipe cook mode" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Tablet recipe cook mode

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The screen a recipe app ("Pantry Press") shows when the tablet is propped up next to the stove. It shows one step at a time, in type big enough to read from a metre away, with messy hands. The ingredients for that step sit in a dark olive panel on the right, each with a large tick box. Two timers live as chips in the top bar. When one runs out it turns tomato red and pulses gently until tapped. A green dot says the screen will stay on. Move between steps by swiping the step text or with 72px Back and Next buttons. The look is bold kitchen: cream paper, dark olive ink, one tomato red, heavy rounded Rubik. The detail worth copying is that the time in each step is set in red inside the sentence, and the matching timer is one tap away under it.

## Reference behaviour

1. First frame: step 4 of 7, "Tip in the tomatoes and chickpeas. Simmer until thick and glossy, 10 minutes." with "10 minutes." in tomato red. The tip reads "Squash a few chickpeas with the spoon. It thickens the sauce." A "Start 10 min sauce timer" button sits under it. The panel lists four ingredients. Chopped tomatoes and Chickpeas are ticked. The footer reads "2 of 4 still to add" and "Next step needs: Eggs".
2. The top bar shows two running timer chips: Bread 0:18 and Sauce 9:48. Both count down once a second. "Screen stays on" shows with a green dot.
3. When Bread reaches zero, its chip turns tomato red, the pause icon becomes a bell, the time reads "Done", and a soft ring pulses out from the chip every 1.8s. A screen reader hears "Bread timer is done".
4. Tap a running chip: it pauses and the time turns grey-olive. Tap again: it resumes. Tap a done chip: it stops ringing and resets to its full time, paused.
5. Tap "Start 10 min sauce timer": the Sauce chip restarts at 10:00. Starting a timer with a new name replaces a done chip first, then a paused one, then the first chip. There are never more than two chips.
6. Tap an ingredient row: its box fills cream with an olive tick, the name gets a line through it at 60% opacity. The footer count updates. With all ticked it reads "All in. On to the next step."
7. Tap Next ("Next: Add the eggs"): step 5 slides in from the right. Back slides the previous step in from the left. Back is disabled on step 1. On step 7, Next reads "Finish".
8. Drag the step text sideways: it follows the finger. Let go past 80px to change step. Under 80px it springs back in 240ms. At the first or last step the drag moves at a quarter speed and always springs back.
9. Tap a step dot to jump to that step. Left and Right arrow keys move one step.
10. Ticks are kept per step. Going back to step 4 shows the same ticks.
11. A step with no new ingredients shows "Nothing new to add. Keep the lid close." in the panel.
12. Tap "Screen stays on": it changes to "Screen may sleep" and the dot turns grey. Where the Wake Lock API exists, it is requested and released to match.

## Structure

```
1180 × 820, 24px top clearance
┌──────────────────────────────────────────────────────────────────────────────┐
│ (X) Chickpea shakshuka          (‖ Bread 0:18) (‖ Sauce 9:48)  ● Screen on  │ 56
│     Pantry Press · Serves 4 · 35 min                                         │
├───────────────────────────────────────────────────────┬──────────────────────┤
│                                                       │ FOR THIS STEP        │
│ (4) STEP 4 OF 7                                       │ Tick as you add      │
│                                                       │ [x] Chopped tomatoes │ 72
│ Tip in the tomatoes                                   │ [x] Chickpeas        │
│ and chickpeas.                       54px / 800       │ [ ] Sugar            │
│ Simmer until thick and                                │ [ ] Salt             │
│ glossy, 10 minutes.  ← red                            │                      │
│ (bulb) Squash a few chickpeas…       19px             │ 2 of 4 still to add  │
│ [ (clock) Start 10 min sauce timer ]  56px            │ Next step needs: Eggs│
├──────────────────┬────────────────────────────────────┼──────────────────────┤
│ [ <  Back      ] │      ●  ●  ●  ▬▬  ●  ●  ●          │ [ Next: Add the eggs >]│ 72
└──────────────────┴────────────────────────────────────┴──────────────────────┘
       220                 minmax(0,1fr)                        340
 padding 0 28px 24px, row gap 20px, column gap 28px
```

- `.app` is a grid with rows `auto minmax(0,1fr) auto`, padding `0 28px 24px`, gap 20px.
- `<header class="top">`: a 56px close button, the recipe title and meta, a `role="group" aria-label="Timers"` holding two chip buttons, the wake button with `aria-pressed`.
- `<main class="main">`: a grid `minmax(0,1fr) 340px`, gap 28px.
- `<section class="stage" aria-roledescription="carousel" aria-label="Recipe steps">` holds `.slide` with `aria-live="polite"`: the step badge and label, the step sentence as the `h1`, the tip, and the timer start button.
- `<aside class="ing" aria-labelledby>`: `h2` "For this step", a helper line, `<ul>` of `<button role="checkbox" aria-checked>` rows, a footer with the count and the next step's needs.
- `<nav class="nav" aria-label="Step navigation">`: a grid `220px minmax(0,1fr) 340px` with Back, the dots (buttons, current has `aria-current="step"`), and Next. Next lines up with the panel above it.

### Content

| # | Step (red part in brackets) | Ingredients | Timer |
| --- | --- | --- | --- |
| 1 | Warm 3 tbsp olive oil in a wide 28 cm pan over [medium heat.] | Olive oil 3 tbsp | |
| 2 | Add the onion and peppers with a pinch of salt. Cook until soft, [8 minutes.] | Onion, Red peppers, Salt | Onions 8 |
| 3 | Stir in the garlic, cumin and paprika. Cook until it smells toasty, [1 minute.] | Garlic, Ground cumin, Smoked paprika | |
| 4 | Tip in the tomatoes and chickpeas. Simmer until thick and glossy, [10 minutes.] | Chopped tomatoes, Chickpeas, Sugar, Salt | Sauce 10 |
| 5 | Make 6 wells with the back of a spoon. Crack an egg into [each one.] | Eggs | |
| 6 | Cover the pan. Cook until the whites set and the yolks wobble, [6 to 7 minutes.] | none | Eggs 7 |
| 7 | Scatter the feta and coriander. Serve from the pan with [warm bread.] | Feta, Coriander, Flatbreads | |

Each ingredient has a name and an amount line ("2 × 400 g tins", "1 × 400 g tin, drained"). Each step has a short name for the Next label and the dot labels: Warm the oil, Soften onions, Toast spices, Simmer sauce, Add the eggs, Set the eggs, Serve.

## Tokens

```css
:root {
  --cream: #f5ecd7;        /* page */
  --cream-2: #ece0c2;      /* close button, hover */
  --card: #fbf5e6;         /* timer chip */
  --line: #ddcda8;         /* chip border, future dots */
  --olive: #2e3820;        /* ink and the ingredient panel */
  --olive-2: #545e3e;      /* secondary text */
  --olive-3: #6b7452;      /* past dots, paused time */
  --on-olive: #f5ecd7;
  --on-olive-2: #c9c7a6;   /* labels on the panel */
  --tomato: #c4381f;       /* the one accent: Next, done timers, step badge */
  --tomato-dk: #a92e18;    /* red text on cream, Next hover */
  --tomato-soft: #f4d2c3;
  --on-tomato: #fff8ef;
  --wake: #5b7a2e;         /* the keep-awake dot only */
  --font: "Rubik", system-ui, sans-serif;
  --r: 20px;
  --r-lg: 28px;
  --tap: 72px;
  --t-fast: 150ms;
  --t-step: 320ms;
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
}
```

Spacing: 4, 8, 10, 12, 14, 18, 20, 24, 28.

## Typography

One family, Rubik, at four weights (400, 500, 700, 800).

| Role | Size | Weight | Line-height | Notes |
| --- | --- | --- | --- | --- |
| Step sentence | 54px | 800 | 1.1 | -0.02em, max 16ch, `text-wrap: balance` |
| Time inside the step | 54px | 800 | 1.1 | `--tomato-dk`, `white-space: nowrap` |
| Step label | 16px | 700 | 1.2 | uppercase, 0.08em, `--tomato-dk` |
| Step number badge | 20px | 700 | 1 | in a 44px tomato circle |
| Tip | 19px | 400 | 1.4 | `--olive-2`, max 42ch |
| Recipe title | 22px | 800 | 1.2 | -0.01em |
| Recipe meta | 14px | 500 | 1.4 | `--olive-2` |
| Timer name | 15px | 500 | 1 | |
| Timer time | 20px | 700 | 1 | tabular figures |
| Panel heading | 15px | 700 | 1.2 | uppercase, 0.08em, `--on-olive-2` |
| Ingredient name | 20px | 700 | 1.2 | |
| Ingredient amount | 15px | 400 | 1.3 | `--on-olive-2` |
| Back / Next | 21px | 700 | 1 | |

Never set the step under 40px at any size. It is read from across the kitchen.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Step enter, forward | Next, swipe left, later dot | translateX, opacity | 64px, 0 → 0, 1 | 320ms | `--ease-out` | instant |
| Step enter, back | Back, swipe right, earlier dot | translateX, opacity | -64px, 0 → 0, 1 | 320ms | `--ease-out` | instant |
| Drag follow | pointer move | translateX, opacity | dx, 1 − min(abs(dx)/600, 0.4) | live | none | still follows |
| Snap back | release under 80px | translateX, opacity | dx → 0 | 240ms | `--ease-out` | instant |
| Done ring | timer reaches 0 | box-shadow spread | 0 → 14px, alpha 0.45 → 0 | 1.8s, loops | `--ease-out` | static 4px `--tomato-soft` ring, no loop |
| Chip colour | state change | background, border, colour | card → tomato | 150ms | `--ease` | instant |
| Ingredient tick | tap | box fill, tick opacity and scale | clear, 0, 0.6 → cream, 1, 1 | 150ms | `--ease-out` | instant |
| Current dot | step change | width | 12px → 36px | 320ms | `--ease-out` | instant |
| Button press | `:active` | scale | 1 → 0.98 | 150ms | `--ease` | instant |

The ring is the only loop. It is calm on purpose: one soft pulse every 1.8s, not a flash.

## States

- Timer running: card fill, 2px `--line` border, olive pause button, olive time.
- Timer paused: play icon, time in `--olive-3`.
- Timer done: tomato fill and border, bell in a cream circle, "Done" in cream, ring pulse.
- Wake on: green dot with a 4px halo at 18%. Off: grey-olive dot, no halo, label "Screen may sleep".
- Ingredient unticked: 32px box, 2.5px `--on-olive-2` border, 10px radius. Ticked: cream fill, olive tick, name struck through at 60% opacity.
- Timer start button: 2px olive outline. Hover: olive fill, cream text. Hidden on steps with no timer.
- Back: 2.5px olive outline. Hover `--cream-2`. Disabled on step 1 at 35% opacity.
- Next: tomato fill. Hover `--tomato-dk`. Label "Next: <short name>", or "Finish" on the last step.
- Dots: past `--olive-3`, current 36px tomato pill, future `--line`.
- Focus-visible: 3px tomato outline, offset 3px. On the olive panel the outline is cream, inset 2px.

## Accessibility

- The step sentence is the `h1`. The slide is `aria-live="polite"`, so each new step is read out.
- The stage has `aria-roledescription="carousel"`. Swipe is never the only way: Back, Next, dots and arrow keys all work.
- Ingredient rows are `<button role="checkbox" aria-checked>`, 72px tall, full panel width.
- Timer chips are buttons whose label says the full state: "Sauce timer, 9:48 left, running. Tap to pause." When done: "Bread timer done. Tap to clear." Rebuild the label when the state changes, not every second.
- A visually hidden `aria-live="assertive"` region says "Bread timer is done" once.
- The wake button uses `aria-pressed`. Its text stays in the accessible name even when hidden visually on narrow screens.
- Dots are buttons labelled "Step 5: Add the eggs". The current dot has `aria-current="step"`.
- Every target is at least 56px, and Back, Next and ingredient rows are 72px. Dots have a 40×48 hit area around a 12px mark.
- Contrast: `#2e3820` on `#f5ecd7` is above 11:1. `#a92e18` on `#f5ecd7` is about 5.8:1. `#fff8ef` on `#c4381f` is about 5:1.

## Responsive rules

- 1180×820 landscape is the reference. From 1024 to 1366 wide, the step column takes the slack and the panel stays 340px.
- Tablet portrait, 820×1180: one column. The step sits on top and takes the free height. The ingredient panel goes under it at full width and grows to fit its rows, never scrolling. The step drops to 50px. The nav becomes `132px minmax(0,1fr) 280px` with 32px dot hit areas. The wake label is hidden visually but kept for screen readers. Timer chips stay in the top bar.
- Phone, under 600 wide: the step is 40px, 800, with 20px side padding. The ingredients collapse into a 64px bar under the step ("4 ingredients for this step") that opens a bottom sheet. Timer chips move to a row under the top bar and scroll sideways if there are more than two. Back and Next become a 72px bar pinned to the bottom, Back as a 72px square icon button, Next filling the rest. Dots move above that bar.
- Never let the step text overflow sideways. Use `minmax(0,1fr)` and `max-width: 16ch` together.
- Do not draw a status bar. Leave 24px at the top.

## Acceptance checklist

### Always

- [ ] One step on screen at a time, at 40px or more, as the page heading.
- [ ] The time inside the step sentence is in the accent colour.
- [ ] Ingredients for only this step, each a large tick box, with ticks kept per step.
- [ ] Two timer chips at most. Each can start, pause, and ring when done. The ring loops calmly and stops when tapped.
- [ ] Steps with a timer offer a start button under the tip.
- [ ] A keep-awake indicator that can be turned off.
- [ ] Swipe, Back/Next buttons, dots and arrow keys all change step. The swipe threshold is 80px with spring-back.
- [ ] Back and Next are at least 72px tall.
- [ ] Step changes slide in from the side you are moving towards.
- [ ] Timer state changes are announced. Swipe has a button equivalent.
- [ ] Reduced motion removes slides and the loop. Done timers still show a static ring.

### This demo

- [ ] The first frame is step 4 of 7 with "10 minutes." in `#a92e18`.
- [ ] Chopped tomatoes and Chickpeas start ticked. The footer reads "2 of 4 still to add".
- [ ] Bread starts at 0:18 and rings at zero. Sauce starts at 9:48.
- [ ] The panel is `#2e3820` with a 28px radius. Next is `#c4381f`.
- [ ] The step sentence is Rubik 800 at 54px.

## Implementation notes

Always: compute time left from an end timestamp, not by subtracting one each tick. Tabs throttle timers. A kitchen tablet is often half asleep.

**Timers that survive throttling.**

```js
const now = () => performance.now();
const t = { name: 'Sauce', total: 600, end: now() + 588000, left: 588, s: 'run' };
setInterval(() => {
  if (t.s !== 'run') return;
  t.left = (t.end - now()) / 1000;
  if (t.left <= 0) { t.s = 'done'; t.left = 0; announce(t.name + ' timer is done'); }
  render();   // redraw the chip only when the shown second or the state changes
}, 250);
// pause: t.left = (t.end - now()) / 1000; t.s = 'paused'
// resume: t.end = now() + t.left * 1000; t.s = 'run'
```

**The ring.** A box-shadow that grows and fades. No scale, so the chip text never shakes.

```css
.chip[data-s="done"] { background: var(--tomato); color: var(--on-tomato);
  animation: ring 1.8s var(--ease-out) infinite; }
@keyframes ring {
  0% { box-shadow: 0 0 0 0 rgba(196,56,31,.45); }
  70%, 100% { box-shadow: 0 0 0 14px rgba(196,56,31,0); }
}
@media (prefers-reduced-motion: reduce) {
  .chip[data-s="done"] { animation: none; box-shadow: 0 0 0 4px var(--tomato-soft); }
}
```

**Swipe with edge resistance.** Capture the pointer, follow it, and decide on release. Ignore drags that start on a button.

```js
stage.addEventListener('pointerdown', e => {
  if (e.target.closest('button')) return;
  x0 = e.clientX; dx = 0; slide.style.transition = 'none';
  stage.setPointerCapture(e.pointerId);
});
stage.addEventListener('pointermove', e => {
  if (x0 == null) return;
  dx = e.clientX - x0;
  const edge = (dx > 0 && cur === 0) || (dx < 0 && cur === last);
  slide.style.transform = `translateX(${edge ? dx / 4 : dx}px)`;
});
// on pointerup: animate back to 0 over 240ms; if dx < -80 go(cur + 1); if dx > 80 go(cur - 1)
```

Set `touch-action: pan-y` on the stage so vertical scroll still works and the browser does not steal the sideways drag.

Common mistakes:

- Small step text with a long scrolling list of every step. Cook mode is one step, very large.
- Showing the whole ingredient list. Only this step's items belong in the panel.
- A flashing red alarm. The ring is soft and slow.
- Counting timers down with `left -= 1` in an interval, so they drift when the tab sleeps.
- Swipe only, no buttons. Wet hands miss swipes.
- Red used for everything. Red is Next, the step badge, the time in the sentence and done timers.
- A thin grotesk. The type is 800 weight and rounded.
- Drawing a status bar or a tablet bezel.

Rebuild order:

1. Lay out the top bar, the step column with the panel, and the nav.
2. Render a step from data with the red time and the tip.
3. Add the ingredient panel with per-step ticks and the footer.
4. Wire Back, Next, dots and arrow keys, then the slide-in.
5. Add swipe with the 80px threshold and edge resistance.
6. Add the two timer chips from end timestamps, the ring and the announcer.
7. Add the keep-awake toggle.
8. Check portrait and reduced motion.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
