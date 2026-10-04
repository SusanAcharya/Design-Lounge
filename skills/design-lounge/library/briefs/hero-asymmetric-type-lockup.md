<!-- Design Lounge Nº 094 · "Asymmetric type lockup hero" · designlounge.vercel.app -->

# Asymmetric type lockup hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The top of the site for Quarto, a fictional Lisbon poetry press. The brand name is the composition: **QUA** sits in columns 1–8 at 160px italic Playfair Display, **RTO** sits in columns 6–13 on the next row, right-aligned and pulled up 28px so the two halves almost lock. A 14px Karla paragraph occupies the leftover cell (columns 9–13 of the first row), tucked against the A. One underline text button is the only CTA. Letters rise on load with a 70ms stagger; Replay and a click on the stage restart them.

## Structure

```
1280 × 800, margins 48, 12 cols, gutter 16
┌──────────┬──────────────────────────┬────────────┐
│ Quarto   │ Catalogue Authors Events │ Subscribe  │  nav 64, 1px rule
├──────────┴──────────────────────────┴────────────┤
│ —— Poetry in print · Lisbon                       │  kicker 11
│                                                   │
│ Q U A                  Twelve poets on the        │  160px italic
│                        weather of a city…         │  nest 14 / 1.55
│              R T O                                │  160px, −28px
│ Open the autumn list →                            │  underline CTA
│                                                   │
│ Vol. XII   128 pages   Edition of 800      28 €   │  meta, 1px rule
│ Autumn     Smyth-sewn  Lisbon + mail    incl. post│
│                                      [REPLAY]     │
└───────────────────────────────────────────────────┘
```

- `<nav aria-label="Primary">` is a 12-column grid. `.mark` spans 1–4, `<ul>` spans 5–10, `.sub` spans 11–13 (end).
- `<main>` is the same 12-column grid, rows `auto 1fr auto`.
- `.kick` spans 1–6. `.stage` spans 1–12 and is itself `grid-template-columns: subgrid`.
- Visually hidden `<h1 class="sr">Quarto</h1>`. Display letters live in `.a` (columns 1–8) and `.b` (columns 6–13), each letter a `<span style="--i">`, `aria-hidden`.
- `.nest` is a `<p>` at columns 9–13, `grid-row: 1`, `align-self: end`.
- `.cta` is a text `<a>` at columns 1–6 with an inline SVG arrow.
- `.meta` is four `<div>`s on the same 12-column subgrid. Replay is `position:absolute; right:48px; bottom:86px` inside `main` (`position:relative`).

## Motion

| Element     | Trigger        | Property            | From → To        | Duration | Easing   | Delay              |
|-------------|----------------|---------------------|------------------|---------:|----------|--------------------|
| QUA letter  | load / replay  | translateY, opacity | 108% + 0 → rest  | 720ms    | `--expo` | i × 70ms           |
| RTO letter  | load / replay  | translateY, opacity | 108% + 0 → rest  | 720ms    | `--expo` | 240ms + i × 70ms   |
| Nest        | load / replay  | opacity, translateY | 0 + 10px → rest  | 640ms    | `--ease` | 620ms              |
| CTA         | load / replay  | opacity, translateY | 0 + 8px → rest   | 640ms    | `--ease` | 780ms              |
| CTA arrow   | hover          | translateX          | 0 → 4px          | 160ms    | `--ease` | 0                  |
| Nav / CTA   | hover          | color, border       | ink-2 → ink/accent | 160ms  | `--ease` | 0                  |

Replay: `body.classList.remove('play'); void body.offsetWidth; body.classList.add('play')`. Reduced motion: no keyframes; letters and copy start at rest, opacity 1.

## States

- **Nav link hover / current:** colour `--ink`, 1px ink bottom border. Current route uses `aria-current="page"`.
- **Subscribe hover:** 1px `--accent` underline.
- **CTA hover:** colour and underline `--accent`; arrow +4px X.
- **Replay hover:** colour and border `--ink`.
- **Focus-visible:** 2px `--accent` outline, 4px offset, on every link and the Replay button.
- **Reduced motion:** final frame, no rise.

## Accessibility

- The visible lockup is `aria-hidden`. Screen readers get the visually hidden `<h1>Quarto</h1>` (clipped 1×1).
- Tab order: brand, Catalogue, Authors, Events, Subscribe, CTA, Replay.
- Contrast: `--ink` on `--paper` is well above 4.5:1. `--ink-2` (`#6a4e3e`) on paper is about 6.5:1. `--ink-3` is used only for 11–12px captions that repeat other information.
- Hit targets: Replay padding makes it ≥ 32px tall; pad to 40px on touch. CTA is a text link with 8px vertical padding.

## Responsive rules

- ≥ 1280: as specified. `--display` stays 160px.
- 1024–1279: `--display: 12.5vw` (still ~128–160px). Nest stays columns 9–13.
- 768–1023: stack the lockup. QUA full width, nest below it (not beside), RTO left-aligned on the next row. Nav links collapse to the mark plus Subscribe.
- < 640: `--display: 72px`. Meta becomes a 2×2 grid. Hide Replay; clicking the lockup still replays.

## Acceptance checklist

- [ ] QUA is 160px italic 700 Playfair, columns 1–8; RTO is the same size, columns 6–13, `text-align: right`, `margin-top: -28px`.
- [ ] Nest paragraph sits in columns 9–13 of the first lockup row, 14px/1.55 Karla, `--ink-2`.
- [ ] Letters rise 108% → 0 over 720ms on `cubic-bezier(.16,1,.3,1)` with a 70ms stagger; RTO is delayed 240ms.
- [ ] Exactly one CTA: underline text plus 16px arrow, no filled button.
- [ ] Replay and a click on empty stage restart the entrance; clicking a link does not.
- [ ] `<h1>` announces "Quarto", not six letters.
- [ ] Focus rings are 2px `#a33a24` with a 4px offset.
- [ ] Reduced motion shows the finished lockup with no movement.
- [ ] Palette is apricot paper `#f3e4d2`, walnut `#27170f`, brick `#a33a24` — not Fraunces, not amber-on-black.
- [ ] Only Playfair Display and Karla load.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: warm apricot paper (`#f3e4d2`). A 64px nav with italic "Quarto" mark, three links (Catalogue is current), and a brick "Subscribe" on the right. Below: an 11px uppercase kicker "Poetry in print · Lisbon".
2. On load, body has class `play`. The three letters of QUA rise from `translateY(108%)` + opacity 0 to rest, 720ms expo-out, delays 0 / 70 / 140ms. RTO uses the same animation with a 240ms base delay (240 / 310 / 380ms).
3. The nest paragraph fades and rises 10px over 640ms, delay 620ms. The CTA does the same, delay 780ms.
4. Hovering the CTA turns text and underline `--accent` (`#a33a24`); the 16px arrow translates 4px right over 160ms.
5. Nav links: hover or `aria-current` turns colour `--ink` and draws a 1px ink underline. Subscribe hover adds a 1px accent underline.
6. Clicking Replay, or clicking the stage anywhere except a link, removes `play`, forces reflow, and adds `play` again so every entrance restarts from zero.
7. Links with `href="#"` call `preventDefault` in the demo.
8. Reduced motion: letters, nest and CTA render in their final position with no animation.

## Tokens

```css
:root {
  --paper: #f3e4d2;            /* page */
  --paper-2: #ead6c0;          /* reserved */
  --ink: #27170f;              /* primary type */
  --ink-2: #6a4e3e;            /* nest, nav rest */
  --ink-3: #9a7d6a;            /* kicker, meta, replay */
  --line: rgba(39, 23, 15, .16);
  --accent: #a33a24;           /* subscribe, CTA hover */
  --accent-soft: #e8c4b4;
  --serif: "Playfair Display", Georgia, "Times New Roman", serif;
  --sans: "Karla", system-ui, sans-serif;
  --gutter: 48px;
  --gap: 16px;
  --nav-h: 64px;
  --display: 160px;
  --t-micro: 160ms;
  --t-letter: 720ms;
  --t-copy: 640ms;
  --stagger: 70ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role        | Family           | Size | Weight | Line-height | Tracking | Case      |
|-------------|------------------|-----:|-------:|------------:|---------:|-----------|
| Lockup      | Playfair Display | 160px | italic 700 | 0.82    | −0.045em | UPPERCASE |
| Brand mark  | Playfair Display | 22px | italic 500 | 1       | −0.02em  | Title     |
| Nest copy   | Karla            | 14px | 400    | 1.55        | 0        | sentence  |
| CTA         | Karla            | 15px | 500    | 1           | 0        | sentence  |
| Nav         | Karla            | 13px | 500    | 1           | +0.04em  | Title     |
| Kicker      | Karla            | 11px | 500    | 1           | +0.18em  | UPPERCASE |
| Meta        | Karla            | 12px | 500    | 1.4         | +0.04em  | mixed     |
| Replay      | Karla            | 11px | 500    | 1           | +0.12em  | UPPERCASE |

## Implementation notes

**Subgrid keeps the nest cell on the same 12 columns as the nav.** Without it the leftover cell drifts:

```css
main, nav, .stage, .meta {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 16px;
}
.stage, .meta { grid-column: 1 / -1; grid-template-columns: subgrid; }
.a { grid-column: 1 / 8; }
.nest { grid-column: 9 / 13; grid-row: 1; align-self: end; }
.b { grid-column: 6 / 13; text-align: right; margin-top: -28px; }
```

**Replayable letter rise** — letters start translated; `.play` attaches the animation:

```css
.a span, .b span { display: inline-block; transform: translateY(108%); opacity: 0; }
.play .a span, .play .b span {
  animation: rise 720ms cubic-bezier(.16,1,.3,1) forwards;
  animation-delay: calc(var(--i) * 70ms + var(--base, 0ms));
}
@keyframes rise { to { transform: none; opacity: 1; } }
```

**Do not put the nest `<p>` inside the `<h1>`.** It is invalid HTML and it steals the heading from AT. Keep a clipped `<h1>` and `aria-hidden` on the display letters.

Common mistakes: `line-height: 1` on 160px italic (the tails clip), giving RTO a positive margin so the lockup falls apart, filling the CTA.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
