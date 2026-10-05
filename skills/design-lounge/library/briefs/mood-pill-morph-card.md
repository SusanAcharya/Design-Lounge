<!-- Design Lounge Nº 317 · "Mood pill that morphs into a card" · www.designlounge.live -->

# Mood pill that morphs into a card

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Studied from 60fps.design, a gallery of mobile micro-interaction clips: this piece takes the "pill morphs and expands into a card" idea from its mood-logging and menu-morph shots and rebuilds it as a working check-in. It is the morning screen of a fictional journal called Mannata. Five tall capsules (Heavy, Low, Steady, Bright, Glowing) sit in a row. Tapping one grows that same element into a 216×340 card with a serif mood name, a one-line note, feeling chips, place chips and a round submit button; the other four shrink to 20px slivers and dim. A soft radial light behind the row takes the mood's hue. Submitting collapses the card back into its pill with a little pop and adds a chip to "Today". The detail worth copying is that nothing is swapped: the pill itself changes width, height and radius on one spring, and its contents stagger in after the shape has mostly arrived.

The language is soft and warm, not glass: tonal fills, a faint inner bottom shadow for "pressable" depth, Fraunces for feeling, Figtree for controls.

## Structure

```
390 × 844, padding 54 top / 20 sides / 34 bottom
┌──────────────────────────────────────┐
│ MANNATA            Sun, 4 Oct · 09:46│ 44px header
│                                      │
│ How does this morning                │ Fraunces 34/1.08
│ sit with you?                        │
│ Tap the one that fits…               │ 14px hint (hidden when open)
│                                      │
│        ┌─────────────┐               │
│ ▌ ▌ ▌  │ ☼        (×)│  ▌            │ row 340px tall, centred
│ ▌ ▌ ▌  │ Bright      │  ▌            │ slivers 20×104
│ ▌ ▌ ▌  │ Light on…   │  ▌            │ card 216×340
│        │ (Hopeful)(Social)           │
│        │ (Curious)(Warm)             │
│        │ WHERE       │               │
│        │ (Home)(Work)(Out)           │
│        │          (↑)│               │ submit 52px
│        └─────────────┘               │
│──────────────────────────────────────│ 1px rule
│ TODAY                                │
│ (● Steady · Calm 08:12) (● Low …)    │ 36px pills
└──────────────────────────────────────┘
```

- `main.app` is a flex column with `overflow: hidden`. The ambient layer is an absolutely positioned div at `inset: -20%`.
- The row is a flex container, centred, `gap: 10px`, `height: 340px`.
- Each mood is a `div.mood` holding a `button.face` (`aria-expanded`, `aria-controls`) and a `div.panel` (`role="group"`, labelled "<Mood> details"). The face and the panel are siblings, so no button sits inside a button.
- The panel holds `h2`, `p`, a chip group "Feelings", an `h4` "Where", a chip group "Where", the submit button and the close button (absolutely placed at top 12, right 12).
- "Today" is a `section` with an `h3` and an `ol` with `aria-live="polite"`.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Delay | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Pill press | :active on face | transform | 1 → 0.95 | 200ms | `--spring` | 0 | none |
| Open card | tap face | width, height, border-radius | 56×148 r28 → 216×340 r30 | 520ms | `--spring` | 0 | opacity swap 150ms |
| Others shrink | another opens | width, height, radius, opacity | 56×148 → 20×104, 1 → 0.4 | 520ms / 300ms | `--spring` / `--std` | 0 | instant size, 150ms fade |
| Face icon | open | transform | scale 1 → 1.25, origin top-left | 520ms | `--spring` | 0 | none |
| Panel | open | opacity | 0 → 1 | 200ms | `--std` | 140ms | 150ms, no delay |
| Panel children | open | translateY, opacity | 8px,0 → 0,1 | 360ms / 250ms | `--out` | 160, 200, 240, 280, 300, 320ms | fade only |
| Ambient | open / close | opacity, gradient colour | 0 → 0.55 | 600ms | `--std` | 0 | 150ms |
| Hint | open | opacity | 1 → 0 | 250ms | `--std` | 0 | same |
| Logged pop | submit | transform | 1 → 1.08 → 1 | 500ms | `--spring` | 0 | none |
| Log entry | submit | translateX, scale, opacity | -24px, 0.8, 0 → 0, 1, 1 | 500ms | `--spring` | 0 | none |
| Chip press | :active | transform | 1 → 0.94 | 150ms | `--spring` | 0 | none |

Close uses the same transitions in reverse; there is no separate close animation. The panel fades out in 200ms with no delay, so it is gone before the shape finishes shrinking.

## States

- Pill resting: tonal fill, inner bottom shadow, soft drop shadow, icon + label.
- Pill pressed: scale 0.95.
- Pill dimmed (another open): 20×104, opacity 0.4, label hidden, icon scaled 0.7. Still a button; tapping it switches.
- Card open: 216×340, larger shadow, face is not clickable (`pointer-events: none`, `tabindex=-1`), panel controls are tabbable.
- Chip off: 55% white on the mood fill. Chip on: `--ink` fill, `--paper` text, `aria-pressed="true"`.
- Focus-visible: 2px `--ink` outline, 3px offset, everywhere.
- Logged: the pill pops once; the log gains an entry.
- Empty log (not in demo): show "Nothing yet today" in `--ink-3` 13px in place of the list.
- No disabled state. Submit works with zero chips picked.

## Accessibility

- Each face button has `aria-expanded` and `aria-controls` pointing at its panel. Its name is the visible mood label.
- Panel buttons have `tabindex="-1"` while closed and `0` while open, so Tab never lands inside a hidden card.
- On open (user action), focus moves to the first chip after 260ms (0ms with reduced motion). The initial hero card does not steal focus on load.
- Escape closes and returns focus to the face. Tapping outside closes without moving focus.
- Submit has `aria-label="Log Bright"`; close has `aria-label="Close Bright"`.
- Chip groups have `role="group"` with labels "Feelings" and "Where".
- The log list and a hidden status line are `aria-live="polite"`.
- Contrast: `#1d1a27` on `#f1cf8a` is about 12:1; on the palest fill `#b9c7c9` about 10:1. `#6e6a78` on `#f2eee7` is about 4.7:1.
- Hit targets: pills 56×148; chips are 34px tall with a pseudo-element extending the target to 40px; submit 52px; close 40px.

## Responsive rules

- Frame 390×844. At 360 wide the gap drops to 8px, pills to 50px, the card to 196px, slivers to 16px. The row never scrolls horizontally.
- Below 720px tall, the row and card drop to 300px tall and the "Where" group is hidden so the submit button stays inside the card.
- At tablet width, keep the row centred at the same pixel sizes. Do not scale the pills up; put the log in a side column instead.
- Do not draw a status bar. The header starts at the 54px clearance.

## Acceptance checklist

### Always

- [ ] The same element grows from pill to card. No separate modal, no cross-fade between two elements.
- [ ] Width, height and radius animate together on one spring with slight overshoot.
- [ ] Other options shrink and dim but remain tappable to switch.
- [ ] Card contents stagger in after the shape, and fade out first on close.
- [ ] The background light takes the selected option's hue.
- [ ] Escape, a close button, and tapping outside all collapse it.
- [ ] Hidden panel controls are not in the tab order.
- [ ] Reduced motion keeps every state but replaces the spring with a 150ms fade.
- [ ] No horizontal scroll at 375px.
- [ ] Hit targets are at least 40px.

### This demo

- [ ] Moods: Heavy, Low, Steady, Bright, Glowing, with the five fills in the tokens.
- [ ] Heading "How does this morning sit with you?" with "morning" in italic.
- [ ] Bright is open on first load with chips Hopeful, Social, Curious, Warm and Where: Home, Work, Out.
- [ ] Card 216×340, pills 56×148, slivers 20×104.
- [ ] Submitting adds a log pill like "Bright · Social 09:51".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: brand "MANNATA" and "Sun, 4 Oct · 09:46" in the header; heading "How does this *morning* sit with you?" at 34px; Bright is already open as a card (the hero state); the ambient glow is amber.
2. "Today" at the bottom lists two earlier check-ins: "Steady · Calm 08:12" and "Low · Foggy 06:40", each a pill with a colour dot.
3. When no pill is open, the row shows five 56×148 capsules with a 24px stroke icon and an 11px label each, and a hint line "Tap the one that fits. You can add a word or two." under the heading.
4. Pressing a capsule squeezes it to scale 0.95 (200ms spring) for tactile feedback.
5. Tapping a capsule opens it: width 56 → 216, height 148 → 340, radius 28 → 30, over 520ms on `cubic-bezier(.34,1.36,.64,1)` (slight overshoot). The others go to 20×104, radius 10, opacity 0.4, and their labels fade. The hint fades out.
6. The face (icon + label) slides to the top-left; the icon scales to 1.25. The panel fades in at 140ms, and its children rise 8px and fade in one after another: title 160ms, note 200ms, chips 240ms, "Where" label 280ms, place chips 300ms, submit and close 320ms.
7. The ambient light (a 60%×45% radial gradient behind the row) cross-fades to the mood's hue at 55% opacity over 600ms.
8. Chips toggle `aria-pressed`. Pressed chips are ink with paper text.
9. Tapping another dimmed sliver opens that mood instead; the first one collapses on the same spring. Only one is open.
10. Close (×), Escape, or tapping outside the card collapses it. Escape and × return focus to the mood's face button.
11. The submit button (arrow up) logs the mood: the card collapses, the pill plays a 500ms pop to 1.08, chips reset, and a new pill slides into "Today" from the left with the mood name, up to two picked words, and the current time. The list keeps four.
12. A hidden live region announces "Logged Bright at 09:51".

## Tokens

```css
:root {
  --bg: #f2eee7;        /* warm paper page */
  --paper: #fbf8f3;     /* log pills, pressed-chip text */
  --ink: #1d1a27;       /* text, submit, pressed chip */
  --ink-2: #4b4757;     /* secondary text */
  --ink-3: #6e6a78;     /* muted text, timestamps */
  --line: #ddd6ca;      /* hairline, pill borders */
  --hue: #f0b44a;       /* ambient light, set per mood */
  /* mood fills (pill/card) and ambient hues */
  --heavy: #9fb3cf;   --heavy-amb: #7f9cc6;
  --low: #b9c7c9;     --low-amb: #97b1b4;
  --steady: #c4d2ad;  --steady-amb: #a9c288;
  --bright: #f1cf8a;  --bright-amb: #f0b44a;
  --glowing: #f2aa92; --glowing-amb: #ee7f5c;
  /* type */
  --serif: "Fraunces", Georgia, serif;
  --sans: "Figtree", system-ui, sans-serif;
  /* sizes */
  --pill-w: 56px; --pill-h: 148px;
  --card-w: 216px; --card-h: 340px;
  --sliver-w: 20px; --sliver-h: 104px;
  --r-pill: 28px; --r-card: 30px; --r-sliver: 10px;
  /* spacing */
  --s-1: 4px; --s-2: 6px; --s-3: 10px; --s-4: 14px; --s-5: 18px; --s-6: 22px;
  /* depth */
  --press-depth: inset 0 -3px 0 rgba(29,26,39,.08), inset 0 1px 0 rgba(255,255,255,.6);
  --pill-shadow: 0 6px 16px -8px rgba(29,26,39,.35);
  --card-shadow: 0 24px 40px -18px rgba(29,26,39,.45);
  /* motion */
  --spring: cubic-bezier(.34, 1.36, .64, 1);
  --out: cubic-bezier(.16, 1, .3, 1);
  --std: cubic-bezier(.2, .7, .2, 1);
  --t-morph: 520ms;
  --t-ambient: 600ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Heading (h1) | Fraunces, opsz 96 | 34px | 400, italic for one word | 1.08 | -0.02em | sentence |
| Card title (h2) | Fraunces, opsz 72 | 30px | 600 | 1 | -0.02em | sentence |
| Brand | Figtree | 13px | 600 | 1 | 0.08em | upper |
| Date | Figtree | 13px | 400 | 1.45 | 0 | sentence |
| Hint, card note | Figtree | 14px / 13px | 400 | 1.45 | 0 | sentence |
| Pill label | Figtree | 11px | 600 | 1 | 0.02em | sentence |
| Chip | Figtree | 13px | 500 | 1 | 0 | sentence |
| Section label (h3, h4) | Figtree | 12px / 11px | 600 | 1 | 0.08em | upper |
| Log pill | Figtree | 13px | 400 | 1 | 0 | sentence, time in `--ink-3` |

The serif is only for words that carry feeling: the question and the mood name. Every control is Figtree.

## Implementation notes

**1. Morph by sizing the real element.** Keep the pill in the flex row and change its box. Because siblings shrink at the same time, the row stays centred without any FLIP maths. Overflow hidden on the pill clips the panel while it is small.

```css
.mood { width: 56px; height: 148px; border-radius: 28px; overflow: hidden;
  transition: width .52s var(--spring), height .52s var(--spring),
              border-radius .52s var(--spring), opacity .3s var(--std); }
.row.has-open .mood       { width: 20px; height: 104px; border-radius: 10px; opacity: .4; }
.row.has-open .mood.open  { width: 216px; height: 340px; border-radius: 30px; opacity: 1; }
.panel       { opacity: 0; visibility: hidden; transition: opacity .2s, visibility 0s .2s; }
.mood.open .panel { opacity: 1; visibility: visible; transition: opacity .2s .14s, visibility 0s; }
.panel > *   { transform: translateY(8px); opacity: 0; transition: transform .36s var(--out), opacity .25s; }
.mood.open .panel > * { transform: none; opacity: 1; }
.mood.open .panel > :nth-child(1) { transition-delay: .16s; }
.mood.open .panel > :nth-child(2) { transition-delay: .2s; }
/* …+40ms per child */
```

Common mistake: animating `transform: scale()` instead of size. Scale stretches the text and radius; this piece needs the box to grow while type stays crisp.

**2. One open at a time, with focus rules.**

```js
function expand(el, focus = true) {
  open = el;
  row.classList.add('has-open'); app.classList.add('open');
  app.style.setProperty('--hue', mood(el).amb);
  els.forEach(e => {
    const on = e === el;
    e.classList.toggle('open', on);
    e.querySelector('.face').setAttribute('aria-expanded', on);
    e.querySelector('.face').tabIndex = on ? -1 : 0;
    e.querySelectorAll('.panel button').forEach(b => b.tabIndex = on ? 0 : -1);
  });
  if (focus) setTimeout(() => el.querySelector('.chip').focus({ preventScroll: true }), 260);
}
document.addEventListener('keydown', e => e.key === 'Escape' && collapse());
document.addEventListener('pointerdown', e => open && !e.target.closest('.mood.open') && collapse(false));
```

**3. Ambient light.** A single oversized radial gradient behind everything, coloured by a custom property. Transition its opacity; the colour change rides along.

```css
.ambient { position: absolute; inset: -20%; pointer-events: none;
  background: radial-gradient(60% 45% at 50% 52%, var(--hue) 0%, transparent 70%);
  opacity: 0; transition: opacity .6s var(--std), background .6s var(--std); }
.app.open .ambient { opacity: .55; }
```

Common mistakes overall:

- Opening a centred modal over a scrim. The card stays in the row, in place.
- Putting chips inside the face button (nested buttons).
- Leaving the dimmed options un-tappable, forcing close-then-open.
- Strong saturated mood colours. Fills are pastel; only the ambient light is stronger, and it is blurred by distance.
- Starting the content stagger at 0ms, so text appears in a 56px-wide box and wraps letter by letter.
- Purple for "heavy". Use slate blue; keep the scale cool to warm.
- Forgetting the 40px hit area on 34px chips.

Where it sits: the first screen after unlock in a journaling or wellbeing app, or any picker with five to seven coarse options that each need a few refinements. For more than seven options, use a sheet instead.

Rebuild order:

1. Lay out the header, heading, hint and log with the 54px top and 34px bottom clearance.
2. Build one pill (56×148) with the face button and the tonal fill and inner bottom shadow.
3. Render five pills from data (name, fill, ambient hue, note, four feeling words, icon path).
4. Add the open and dimmed sizes and the shared spring transition; check the row stays centred.
5. Add the panel with its staggered children, then the close and submit buttons.
6. Wire the single-open logic, Escape, outside tap, and the tabindex rules.
7. Add the ambient layer and the hue swap.
8. Add the submit pop and the log entry; cap the log at four.
9. Add the reduced-motion override and test at 360 and 375 wide.
10. Open Bright on load without moving focus.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
