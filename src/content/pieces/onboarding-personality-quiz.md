---
title: "Onboarding personality quiz"
summary: "A five-question Material 3 Expressive onboarding quiz with big tonal answer cards, a wavy progress bar, back, and a result card that says what the app will set up."
platform: mobile-app
type: screen
category: onboarding
tags: [onboarding, quiz, material, personalisation, mobile]
styles: [playful, material, soft]
motion: rich
difficulty: 2
featured: false
published: 2026-10-28
palette: ["#F4FAF6", "#006A5B", "#FFDDB0", "#B8EAD9", "#B2401F"]
fonts: ["Fredoka", "Gochi Hand"]
related: [phone-lesson-quiz]
---

# Onboarding personality quiz

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The first-run quiz of Leafling, an invented houseplant care app. Five questions ("Which way does your brightest window face?") each offer four big tonal answer cards in a 2 × 2 grid; tapping one marks it and moves on. The result is one of four plant-parent types ("The Sun Chaser", "The Steady Keeper", "The Gentle Forgetter", "The Jungle Builder") on a scalloped Material cookie shape, followed by the three things the app will set up because of it (watering cadence, starter plants, one feature switched on). The language is **Material 3 Expressive**: tonal surface colours, a wavy linear progress indicator with a stop dot, shape morphing on press and selection, and spring-ish spatial easing. The detail worth copying: the result is not a horoscope; it ends in concrete settings the user can accept with one button.

## Reference behaviour

1. Initial state: question 1 of 5. Top bar: a 48px round tonal Back button (disabled at 38% opacity on question 1), a wavy progress bar filled to 20% (current question ÷ 5), a flat track for the rest ending in a 3px stop dot, and "1 of 5". Below: a coral handwritten kicker "be honest" rotated −3°, the question in 31/600, the four cards, and a handwritten hint "tap one, there are no wrong answers".
2. Each card has its own tonal container (sun, mint, sky, lime) and its own corner set: one of the four corners is 8px, the rest 28px, so the grid reads as a flower of shapes. A 52px white-tinted circle holds a 28px line icon; the answer (18/600) and a short line (14/400) sit at the bottom.
3. Press a card: it scales to 0.96 over 160ms. On release it becomes checked: all corners morph to 56px with an overshooting spring over 350ms, a 3px inset ring in the card's ink colour appears, and a 30px dark check badge pops from scale 0 to 1 in the top-right over 300ms.
4. 420ms after the tap, the question content slides 24px left and fades out over 180ms, the next question slides in from 32px right over 360ms, and the progress wave grows to the next fifth. Taps during that 420ms are ignored.
5. Back (question 2 onwards): the content slides the other way and the previous question returns with its earlier answer still checked. Choosing again replaces the answer.
6. After question 5 the result screen slides in: the wave fills the whole track (the flat track disappears), the counter reads "5 of 5", a 236px nine-scallop cookie in the type's tonal colour spins in from −90° and scale 0.4 over 900ms, and its 88px icon pops in after 200ms.
7. Under it: handwritten "so you are", the type name in 38/600, a two-line description, then a tonal 24px-radius list of three setup rows (36px icon tile, bold title, detail), each fading up 12px with 60ms stagger starting at 360ms.
8. A full-width 56px "Set up my garden" primary pill, and below it a 48px "Retake the quiz" text button with a restart icon. Retake clears every answer and slides back to question 1.
9. Scoring: every answer belongs to one type; the type with the most answers wins, ties go to the type listed first (Sun Chaser, Steady Keeper, Gentle Forgetter, Jungle Builder).

## Structure

```
390 × 844 (Lounge draws the status bar; 54px top and 34px bottom kept clear)
┌──────────────────────────────────────┐
│               54 safe area           │
│ (<)  ∿∿∿∿━━━━━━━━━━━━━━━━━━━━━━•  1 of 5 │ 64  bar: 48 button · wave · 64 count
│                                      │
│ be honest  (Gochi Hand, −3°)         │
│ Which way does your                  │ 31/600
│ brightest window face?               │
│ ┌───────────────┐ ┌───────────────┐  │
│ │ (☼)           │ │ (⊞)           │  │ 2 × 2 grid, 12 gap
│ │               │ │               │  │ cards ≥ 214 tall
│ │ South         │ │ East          │  │
│ │ Sun most…     │ │ Soft, bright… │  │
│ └───────────────┘ └───────────────┘  │
│ ┌───────────────┐ ┌───────────────┐  │
│ │ North …       │ │ Skylight …    │  │
│ └───────────────┘ └───────────────┘  │
│   tap one, there are no wrong answers │
│               34 home indicator      │
└──────────────────────────────────────┘
Result: cookie 236 in a 250 hero · kicker · h1 38 · p · setup list · 56 CTA · 48 retake
```

- `.app`: flex column, `padding: 54px 0 34px`.
- `.bar`: `button#back`, `div role="progressbar"` containing an inline `<svg viewBox="0 0 260 24" preserveAspectRatio="none">` with a track path, a wave path and a stop circle, and a 64px counter.
- `<main aria-live="polite">`: swapped per step. A question is a kicker `span`, an `h1` with an id, and `div role="radiogroup" aria-labelledby` of four `button role="radio" aria-checked`.
- Result: decorative hero (`aria-hidden`), kicker, `h1 tabindex="-1"` (focused on arrival), `p`, `ul aria-label="Leafling will set up"`, two buttons.

## Tokens

```css
:root {
  /* Material 3 tonal scheme, seed teal #006A5B */
  --surface: #f4faf6;
  --surface-high: #e3eee8;      /* back button, setup list */
  --on-surface: #15201c;
  --on-surface-var: #3f4944;    /* hint, description, counter, 9.3:1 */
  --primary: #006a5b;           /* CTA, wave, focus ring */
  --on-primary: #ffffff;
  --primary-container: #a6f0da; /* setup icon tiles */
  --on-primary-container: #00201a;
  --tertiary: #b2401f;          /* handwritten kickers, 5.6:1 */
  --track: #c4d6ce;             /* progress track */
  --divider: #cfdcd5;
  /* answer containers: fill / ink / 2px edge (edge ≥ 3:1 on surface) */
  --sun: #ffddb0;  --on-sun: #2a1800;  --sun-edge: #a0661a;
  --keep: #b8ead9; --on-keep: #00201a; --keep-edge: #2e8a72;
  --sky: #cfe6f2;  --on-sky: #0b1e28;  --sky-edge: #3f7ea0;
  --lime: #cdeda3; --on-lime: #102000; --lime-edge: #5e8a1e;
  /* type */
  --round: "Fredoka", system-ui, sans-serif;
  --hand: "Gochi Hand", cursive;
  --fs-question: 31px; --fs-result: 38px; --fs-answer: 18px; --fs-body: 16px; --fs-small: 14px;
  --fs-kicker: 22px; --fs-hint: 19px;
  /* shape */
  --r-card: 28px; --r-card-corner: 8px; --r-card-checked: 56px;
  --r-list: 24px; --r-tile: 12px; --r-pill: 28px; --r-pressed: 14px;
  /* size */
  --icon-btn: 48px; --cta-h: 56px; --text-btn-h: 48px; --card-min-h: 214px; --gap: 12px; --gutter: 20px;
  /* motion (M3 Expressive spatial and effects curves) */
  --spring: cubic-bezier(.42,1.67,.21,.9);     /* fast spatial: corner morph, badge */
  --spatial: cubic-bezier(.38,1.21,.22,1);     /* default spatial: cookie */
  --emph: cubic-bezier(.2,0,0,1);              /* emphasized: press, list rows */
  --emph-in: cubic-bezier(.3,0,.8,.15);        /* exit */
  --emph-out: cubic-bezier(.05,.7,.1,1);       /* enter */
  --t-press: 160ms; --t-morph: 350ms; --t-exit: 180ms; --t-enter: 360ms; --t-advance: 420ms; --t-cookie: 900ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Question | Fredoka | 31px | 600 | 1.12 | −0.01em | sentence |
| Result type | Fredoka | 38px | 600 | 1.12 | −0.01em | title |
| Answer | Fredoka | 18px | 600 | 1.15 | 0 | sentence |
| Answer detail | Fredoka | 14px | 400 | 1.4 | 0 | sentence |
| Body, setup rows | Fredoka | 15 to 16px | 400 (titles 600) | 1.4 | 0 | sentence |
| CTA | Fredoka | 17px | 600 | 1 | 0 | sentence |
| Counter | Fredoka, tabular | 14px | 600 | 1 | 0 | "1 of 5" |
| Kicker | Gochi Hand, rotate −3° | 22px | 400 | 1 | 0 | lowercase |
| Hint | Gochi Hand | 19px | 400 | 1.2 | 0 | lowercase |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---:|---|---|
| Answer card | press | scale | 1 → 0.96 | 160ms | `--emph` | none |
| Answer card | checked | border-radius | per-card set → 56px | 350ms | `--spring` (overshoots) | instant |
| Check badge | checked | scale | 0 → 1 | 300ms | `--spring` | instant |
| Question | advance | opacity, translateX | 1, 0 → 0, −24px | 180ms | `--emph-in` | swap in place |
| Question | enter | opacity, translateX | 0, +32px → 1, 0 | 360ms | `--emph-out` | swap in place |
| Back | go back | as above, mirrored | +24 out, −32 in | 180 / 360ms | same | swap in place |
| Progress wave | step | path length | n/5 → (n+1)/5 | instant redraw | none | same |
| Cookie | result | rotate, scale, opacity | −90°, 0.4, 0 → 0°, 1, 1 | 900ms | `--spatial` | static |
| Result icon | result | scale | 0 → 1 | 600ms, 200ms delay | `--spring` | static |
| Setup rows | result | opacity, translateY | 0, 12px → 1, 0 | 400ms, delays 360/420/480ms | `--emph` | static |
| Icon button, CTA | press | border-radius | 50% / 28px → 14px | 250ms | `--spring` | instant |

Under reduced motion the auto-advance delay drops from 420ms to 120ms so the checked state still flashes before the next question.

## States

- **Default card:** tonal fill, 2px darker edge in the same hue, one 8px corner.
- **Pressed:** scale 0.96.
- **Checked:** 56px corners, 3px inset ring in the card's ink, check badge (`--on-surface` disc, `--surface` tick). `aria-checked="true"`.
- **Focus-visible:** 3px `--primary` outline, 3px offset, on cards, Back, CTA and Retake.
- **Back disabled:** question 1 only, `disabled`, 38% opacity.
- **Busy:** during the 420ms advance further taps are ignored.
- **Result:** wave full width, no track, counter "5 of 5"; Back returns to question 5 with its answer checked.

## Accessibility

- Each question is a `role="radiogroup"` labelled by its `h1`; cards are `button role="radio"` with `aria-checked`. Space or Enter chooses. In a production build add arrow-key roving between the four radios.
- The progress bar is `role="progressbar"` with `aria-valuemin="0"`, `aria-valuemax="5"`, `aria-valuenow` and `aria-valuetext="Question 2 of 5"`; the visible counter is `aria-hidden` to avoid double reading.
- `<main>` is `aria-live="polite"` so each new question is read; on the result screen focus moves to the `h1` (`tabindex="-1"`, no visible outline on that programmatic focus).
- The decorative cookie and glyph are `aria-hidden`; every icon in a card sits next to its text label.
- Contrast: answer ink on every tonal fill is ≥ 12:1; `--tertiary` kickers 5.6:1; hint and description 9.3:1. Card edges are ≥ 3:1 against the surface.
- Targets: Back 48px, cards ≥ 169 × 214px, CTA 56px, Retake 48px. All exceed 44px.

## Responsive rules

- 390 × 844: as specified.
- 360 wide: the grid keeps two columns (cards about 154px wide); answer detail lines wrap to two lines; nothing truncates.
- Height under 760px: cards drop to a 150px minimum and the result hero to 200px so the CTA stays above the home indicator.
- Tablet or ≥ 600px wide: the bar and content centre in a 560px column; the grid stays 2 × 2.
- iOS port: keep the shapes and tonal fills but swap the spring curves for a 0.35s spring with 0.8 damping and use SF-style type sizes; the structure does not change.

## Acceptance checklist

**Always**

- [ ] Exactly five questions, four answer cards each, in a 2 × 2 grid with 12px gaps.
- [ ] Every hit target is at least 44px (Back 48, CTA 56, Retake 48, cards far larger).
- [ ] Tapping a card checks it, morphs its corners to 56px, shows the badge, and advances after 420ms.
- [ ] Back restores the previous question with its earlier answer checked; it is disabled on question 1.
- [ ] Progress is a wavy filled segment plus flat track and stop dot; `aria-valuenow` and `aria-valuetext` update.
- [ ] Each card has a 2px edge with ≥ 3:1 contrast against the surface.
- [ ] The result names one type and lists exactly three setup items, then one primary button and a restart.
- [ ] Restart clears all answers and returns to question 1.
- [ ] Reduced motion: no slides, spins or pops; every state still appears.
- [ ] Nothing fixed sits in the top 54px or bottom 34px.

**This demo**

- [ ] App is Leafling; types are The Sun Chaser, The Steady Keeper, The Gentle Forgetter, The Jungle Builder.
- [ ] Kickers in Gochi Hand: "be honest", "no judgement", "picture your place", "real life", "last one", "so you are".
- [ ] Steady Keeper sets up "Water every 7 days · Saturdays at 10:00", "Starter shelf · Pothos, calathea, peperomia", "Feeding reminder · First Sunday of the month".
- [ ] Primary button reads "Set up my garden".

## Implementation notes

**The wavy progress indicator** is one SVG: a sine polyline up to the filled length, then a flat track that starts 10px later (the gap M3 draws), then a stop dot at the end. Stretch it with `preserveAspectRatio="none"` so it fills the bar:

```js
function wave(w) {               // viewBox 0 0 260 24, centre line y = 12
  let d = 'M3 12';
  for (let x = 3; x <= w; x += 2) d += `L${x} ${(12 + 3.2 * Math.sin(x / 5)).toFixed(2)}`;
  return d;
}
function progress(n) {           // n = current question index 0..4, 5 on the result
  const w = 3 + Math.min(n + 1, 5) / 5 * 244;
  wavePath.setAttribute('d', wave(w));
  trackPath.setAttribute('d', n < 4 ? `M${w + 10} 12L247 12` : '');
}
```

**Shape morph as the selection signal.** Give each card its own corner set and transition `border-radius` on an overshooting curve; the overshoot is what makes it feel Expressive rather than a plain fade:

```css
.ans { border-radius: 28px; transition: border-radius 350ms cubic-bezier(.42,1.67,.21,.9),
  transform 160ms cubic-bezier(.2,0,0,1); }
.ans:nth-child(1) { border-radius: 28px 28px 28px 8px; border: 2px solid #a0661a; background: #ffddb0; }
.ans:active { transform: scale(.96); }
.ans[aria-checked="true"] { border-radius: 56px; box-shadow: inset 0 0 0 3px currentColor; }
```

**The cookie** is a polar path, generated once: radius `100 + 7·cos(9θ)` gives nine soft scallops.

```js
function cookie(cx = 118, cy = 118) {
  let d = '';
  for (let k = 0; k <= 96; k++) {
    const a = k / 96 * Math.PI * 2, r = 100 + 7 * Math.cos(a * 9);
    d += (k ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1);
  }
  return d + 'Z';
}
```

Common mistakes: advancing instantly on tap (the user never sees their choice land); losing answers on Back; putting the 3:1 edge on a wrapper instead of the button; ending the quiz on a personality label with no settings, which makes it feel like a gimmick instead of onboarding.
