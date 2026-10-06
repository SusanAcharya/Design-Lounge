<!-- Design Lounge Nº 131 · "Newsletter fold inline" · www.designlounge.live -->

# Newsletter fold inline

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A newsletter capture sitting **inside** an essay, not in a footer and not as a hero. The host is **The Loam Letter**, a monthly soil journal. The first frame is a 720px column on olive paper: masthead, a 34px Caslon headline, one drop-capped paragraph, then a fold band (`#F3EEE3`, 2px moss rule on top) with “No. 41”, the italic title, a one-sentence promise, and a hairline email + Subscribe row. On a valid submit the input and button hide and the italic line “You’re on the list” takes their place. A second paragraph continues under the fold so it reads as a mid-article interrupt.

## Structure

```
1280 × 800
          ┌──────────────── 720px column ────────────────┐
          │ THE LOAM LETTER    No. 41 · April 2026  …    │ mast  + ink rule
          │                                              │
          │ What the frost left in the north bed         │ 34 / 700
          │ By Ida Marum · 12 April 2026 · 9 min read    │
          │                                              │
          │ [W]he cloches came off on a Tuesday that     │ drop 62 moss
          │     still felt like March. Under the glass…  │
          │                                              │
          │ ┌──────────┬───────────────────────────────┐ │ fold
          │ │ ISSUE    │  The Loam Letter              │ │ 2px moss top
          │ │ No. 41   │  Field notes on soil, once a  │ │
          │ │          │  month, from one garden. …    │ │
          │ │          │  you@garden.mail   SUBSCRIBE  │ │ 44 row
          │ └──────────┴───────────────────────────────┘ │
          │                                              │
          │ I left the chard. The mustard I thinned…     │
          └──────────────────────────────────────────────┘
  page bg #E7E2D4     fold bg #F3EEE3     pad 36 top
```

- `<article class="page">` width 720px, centered in the 1280 frame.
- `<header class="mast">` three spans.
- `h1`, `.by`, `.art` opening paragraph with `.drop`.
- `<aside class="fold" aria-label="Subscribe to The Loam Letter">` 2-column grid: 140px issue stack + copy/form.
- `<form id="form" novalidate>`: visually hidden label, email input, `button.go`, `.done-label` (hidden until `.done`).
- `#msg` `role="status" aria-live="polite"`.
- Closing `.art.after` paragraph.

Copy, exact:

- Headline: “What the frost left in the north bed”
- Opening: “The cloches came off on a Tuesday that still felt like March. Under the glass the soil was dark and a little sweet, the way it gets when the worms have been working the leaf mould we put down in November. I had expected a bare patch. I got mustard seedlings the size of a fingernail and one stubborn chard that had kept its colour.”
- Promise: “Field notes on soil, once a month, from one garden. No ads, no product list.”
- After: “I left the chard. The mustard I thinned with two fingers and ate on the walk back to the shed, because that is the whole argument of this letter: the garden is already feeding you if you are willing to put your hands in it before the plan for May is written down.”

## Motion

Almost none. The only transition is the hairline colour (160ms). The morph is a display swap:

| Element | Trigger | What changes | Duration |
|---------|---------|--------------|---------:|
| `form` border | `.bad` / `.done` | `--ink` → rust or moss | 160ms |
| `input`, `button.go` | `.done` | `display: none` | 0 |
| `.done-label` | `.done` | `display: flex` | 0 |
| `button.go:hover` | hover | colour moss → ink | 0 |

Reduced motion: border transition 1ms. Do not fade the done label — a fade would fight the “morph” and add a clock this piece does not need.

## States

- **Form rest:** 1.5px `--ink` bottom border, 44px row, italic placeholder `--ink-3`.
- **Form invalid:** `.bad`, rust hairline, rust 12px message.
- **Form done:** `.done`, moss hairline, input/button removed from display, italic moss “You’re on the list”, input disabled so a later Enter does nothing.
- **Button rest:** transparent, moss 13px/600 uppercase, 16px left padding.
- **Button hover:** colour `--ink`.
- **Focus-visible:** 2px moss, 3px offset on input, button, and any mast link.

## Accessibility

- Fold is an `<aside aria-label="Subscribe to The Loam Letter">` inside the `<article>`, so it is complementary, not a second article.
- Visually hidden `<label for="email">`. `type="email"`, `autocomplete="email"`, `required`, form `novalidate`.
- `#msg` is `role="status"` + `aria-live="polite"`.
- `.done-label` is `aria-hidden="true"` until `.done`, then the attribute is removed. The live region still announces the longer sentence so screen readers are not left with a silent swap.
- Invalid submit returns focus to the input.
- Contrast: `--ink` on `--bg` ~13:1; `--ink-2` on `--fold` ~6.4:1; moss on fold ~5.8:1; rust on fold ~5.2:1.
- Hit target: 44px row. Button text is short; keep the 16px left padding so the clickable end of the row is ≥ 88px wide.

## Responsive rules

- ≥ 1280: 720px column centered in the frame, fold 140px + 1fr, pad 28px 32px 24px.
- 1024–1279: column stays 720px or shrinks with the frame; fold layout unchanged.
- 768–1023: page padding 24×20. Fold stacks to one column, issue number 32px, headline 28px.
- < 640: same stack. Drop cap may wrap awkwardly — keep it; do not hide it. Form row stays one line until 400px, then stack the button under the input at 44px full width.

## Acceptance checklist

- [ ] First frame shows article type above and below a fold; the fold is in view at 800px tall.
- [ ] Issue reads **No. 41** at 40px Caslon; promise is the exact one-sentence line.
- [ ] Form is a 44px hairline row: italic input + uppercase Subscribe in moss.
- [ ] Invalid submit turns the hairline rust and keeps the fields.
- [ ] Valid submit hides input and button and shows italic “You’re on the list” in moss.
- [ ] Live region announces “You’re on the list. No. 42 leaves on 12 May.”
- [ ] Drop cap is 62px/700 moss on the opening T.
- [ ] Type pairing is Libre Caslon Text + Karla only; page ground is `#E7E2D4`.
- [ ] Fold is an `<aside>` with an accessible name; label is present for the email.
- [ ] `prefers-reduced-motion: reduce` does not break submit.
- [ ] No images, no emoji, no dummy latin. Demo starts with the piece header comment.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: masthead “THE LOAM LETTER / No. 41 · April 2026 / FIELD NOTES” with a 1px ink rule under it. Headline “What the frost left in the north bed”. Byline “By *Ida Marum* · 12 April 2026 · 9 min read”. Opening paragraph with a 62px moss drop cap. Fold already visible in the first 800px. Form empty, placeholder `you@garden.mail`, button “Subscribe”. Second paragraph visible below the fold.
2. Focus the input: default focus ring (2px moss, 3px offset). The hairline stays `--ink`.
3. Submit empty or invalid: `preventDefault`, form gets `.bad` (hairline `--rust` `#9A4A2C`), `#msg` reads “A full address, please — the letter does not go to a first name.” Focus returns to the input. Button still says “Subscribe”.
4. Submit a value matching `^[^\s@]+@[^\s@]+\.[^\s@]+$`: form gets `.done` (hairline moss), input and button `display:none`, `.done-label` displays as a flex row: italic 18px Caslon “You’re on the list”. Input is `disabled`. Live region: “You’re on the list. No. 42 leaves on 12 May.”
5. Hover Subscribe (enabled): colour `--ink` from `--moss`.
6. No other animation. The fold does not slide in.
7. Reduced motion: form border-color transition is 1ms. Morph is a class swap (no height animation), so it is already instant.

## Tokens

```css
:root {
  --bg: #e7e2d4;          /* page olive paper */
  --fold: #f3eee3;        /* fold panel */
  --ink: #242018;
  --ink-2: #5c5648;
  --ink-3: #8a8374;
  --line: #c9c2b0;
  --line-2: #b4ad98;
  --moss: #3d5340;        /* issue, drop cap, button, success */
  --rust: #9a4a2c;        /* invalid hairline + message */
  --ok: #3d5340;

  --serif: "Libre Caslon Text", Georgia, serif;
  --sans: "Karla", system-ui, sans-serif;

  --col: 720px;
  --fold-pad: 28px 32px 24px;
  --iss-col: 140px;
  --row-h: 44px;

  --t-fast: 160ms;
  --t-morph: 320ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Body / article | Libre Caslon Text | 16px | 400 | 1.55 | 0 | sentence |
| Mast / issue kicker | Karla | 11px | 500–600 | 1 | +0.14–0.16em | UPPERCASE |
| Headline | Libre Caslon Text | 34px | 700 | 1.15 | −0.015em | sentence |
| Byline | Karla + italic Caslon name | 13 / 15px | 400 | 1.4 | 0 | sentence |
| Drop cap | Libre Caslon Text | 62px | 700 | 0.8 | 0 | the letter T |
| Issue number | Libre Caslon Text | 40px | 700 | 1 | −0.02em | “No. 41” |
| Fold title | Libre Caslon Text italic | 22px | 400 | 1.2 | 0 | sentence |
| Promise | Karla | 15px | 400 | 1.45 | 0 | sentence |
| Input | Libre Caslon Text italic | 17px | 400 | 1 | 0 | as typed |
| Button | Karla | 13px | 600 | 1 | +0.08em | UPPERCASE |
| Done line | Libre Caslon Text italic | 18px | 400 | 1 | 0 | sentence |
| Message | Karla | 12px | 400 | 1.3 | 0 | sentence |

Article measure is the 720px column, about 62–68 characters at 16px Caslon.

## Implementation notes

**Morph by class, not by rewriting the button label only.** Hiding both controls and showing a serif line is the point — a button that says the same sentence in Karla uppercase is a different piece:

```css
.done-label { display: none; }
form.done input, form.done button.go { display: none; }
form.done .done-label { display: flex; }
```

**Keep the article around the fold.** If you ship only the band, it reads as a footer. The drop-capped opening and the continuing paragraph are required for the first frame.

```html
<div class="art"><p class="drop">The cloches came off…</p></div>
<aside class="fold">…</aside>
<div class="art after"><p>I left the chard…</p></div>
```

**Drop cap without a span:**

```css
.drop::first-letter { float: left; font: 700 62px/0.8 var(--serif); padding: 6px 10px 0 0; color: var(--moss); }
```

Common mistakes: putting this in the footer; a filled moss pill button; pairing Caslon with Inter; using the Loam garden FAQ copy (that is a different product); animating the fold in on load so the first screenshot is empty.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
