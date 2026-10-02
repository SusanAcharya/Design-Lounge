---
title: "Newsletter split footer"
summary: "Split footer for The Margin: underline email on the left, 84px italic wordmark and sitemap on the right, shown under the last essay paragraph."
platform: web
type: section
category: footer
tags: [footer, newsletter, subscribe, magazine, sitemap]
styles: [editorial, paper]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-02
palette: ["#F1EBDF", "#1E1B16", "#A3301C", "#F8F4EC"]
fonts: ["Newsreader", "Instrument Sans"]
related: []
---

# Newsletter split footer

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The closing block of a literary magazine site ("The Margin"). Above the footer, the last paragraph of an essay sits centred with a terracotta end-stop square and a byline. The footer itself is a 7fr / 5fr split under a double top rule (1px plus a 4px inset echo): left is the Sunday letter subscribe form — 60px serif headline, an underline-only email field, latest-issue teaser with a CSS shopfront; right is a three-column sitemap and an 84px italic wordmark. The feeling is print: Munken-warm paper, hairlines, italic Newsreader. The detail worth copying is the form chrome — no box, just a 1.5px ink underline that turns terracotta on error and green on success, with a polite live message and an SVG icon.

## Reference behaviour

1. On load, `requestAnimationFrame` scrolls the document to `scrollHeight` so the first frame is the footer (essay remnant above, then the split). Do not start at the top of the essay.
2. Default message under the field: "Free, every Sunday at 07:00. 41,208 readers. One-click unsubscribe."
3. Submit empty: form gets `.bad`, underline `--accent`, message terracotta with an info-circle SVG: "Enter an email address to subscribe." Focus returns to the input; `aria-invalid="true"`.
4. Submit a string that fails `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`: same error chrome, copy "That address is missing an @ or a domain, like name@studio.pt."
5. Submit a valid address: form `.done`, underline `--ok` `#3d6b3a`, message green with a check path: "Check your inbox. We sent a confirmation link to {value}." `novalidate` on the form so the custom copy wins over the browser bubble.
6. Any `input` event while `.bad` or `.done` clears the state and restores the default sentence.
7. Subscribe button: arrow SVG translates +5px on hover (280ms expo-out). Issue title underline grows 0 → 100% width over 360ms. Sitemap links go terracotta and italic on hover.
8. Reduced motion: all transition-durations 1ms. Validation still runs.

## Structure

```
1280 × 800  (page scrolls; first paint is scrolled to the footer)
┌──────────────── essay remnant, max 640, centred ──────────────────────┐
│  The street never widened. …  (21px Newsreader, opsz 18)              │
│  ●  Words by Inês Valadares · Filed from Porto · 18 min read          │
│     32px initials disc "IV"                                           │
├════ double rule (1px top + 4px inset 1px) ════════════════════════════┤
│ LEFT 7fr, paper #F8F4EC          │ RIGHT 5fr                          │
│ pad 44 56 40                     │ pad 44 56 32 48                    │
│ — THE SUNDAY LETTER              │ Read / About / Elsewhere           │
│ Read us where you                │ 3-col, h4 11/600 +0.14em           │
│ read slowly.   60px, em accent   │ links 17px Newsreader              │
│  [ italic field          Subscribe → ]  52px, 1.5px underline         │
│  live message 13px               │                                    │
│  ┌168ph┐ Latest · No. 214        │  The Margin   (84px italic)        │
│  │shop │ The street that refused │  An independent quarterly…         │
│  └─────┘ 18 min · Dhaka          │                                    │
├──────────────────────────────────┴────────────────────────────────────┤
│ legal 12px: © 2026 The Margin Editions, Lda.  Privacy  Terms    Set in…│
└───────────────────────────────────────────────────────────────────────┘
```

- `<article class="end" aria-label="End of essay">` — one `<p>` plus `.sign` (`.av` "IV" + byline). End-stop is `p::after` 0.55em square `--accent`.
- `<footer aria-label="Site footer">` — grid `7fr 5fr`. `::before` draws the inner 1px rule at `top: 4px`. Box-shadow `0 -4px 0 -3px var(--ink) inset` plus `border-top: 1px` makes the double rule.
- `<section class="sub" aria-labelledby="sub-h">` — kicker, `<h2 id="sub-h">`, `<form id="form" novalidate>`, `#msg aria-live="polite"`, `.issue` teaser.
- Form: visually-hidden `<label for="email">`, `input type="email" autocomplete="email"`, submit `.go` with arrow SVG.
- `.ph` — 118px CSS illustration (`role="img" aria-label="Illustration: shopfronts at dusk on Rua das Flores"`), "No. 214" in `::after`.
- `.side` — flex column; `.cols` sitemap `aria-label="Sitemap"`; `.mast` wordmark + blurb `margin-top: auto`.
- `.legal` — `grid-column: 1 / -1`.

Sitemap:
- Read: Essays, Dispatches, Interviews, The Index, Archive
- About: Masthead, Write for us, Corrections, Advertise, Contact
- Elsewhere: Print edition, Podcast, RSS feed, Shop

## Tokens

```css
:root {
  /* colour — warm newsprint, oxblood accent, one green for success */
  --bg: #f1ebdf;
  --paper: #f8f4ec;       /* subscribe pane */
  --sunk: #e8e0d0;
  --line: #d6ccb8;
  --line-2: #b9ad95;
  --ink: #1e1b16;
  --ink-2: #544c40;
  --ink-3: #6f6656;
  --accent: #a3301c;      /* kicker, em, error, end-stop */
  --accent-2: #f3ddd5;
  --ok: #3d6b3a;

  /* type */
  --serif: "Newsreader", Georgia, serif;
  --sans: "Instrument Sans", system-ui, sans-serif;

  /* layout */
  --pad: 56px;
  --r: 2px;
  --input-h: 52px;

  /* motion */
  --t-micro: 150ms;
  --t-state: 280ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role            | Family          | Size | Weight | Line-height | Tracking | Case      |
|-----------------|-----------------|-----:|-------:|------------:|---------:|-----------|
| Body            | Instrument Sans | 15px | 400    | 1.5         | 0        | sentence  |
| Essay remnant   | Newsreader      | 21px | 400    | 1.55        | 0        | sentence  |
| Byline          | Instrument Sans | 13px | 400/600| 1.5         | 0        | sentence  |
| Kicker          | Instrument Sans | 11px | 600    | 1           | +0.14em  | UPPERCASE |
| Footer headline | Newsreader      | 60px | 400    | 1           | −0.025em | sentence  |
| Email input     | Newsreader      | 22px | 400 italic | 52px h   | 0        | sentence  |
| Subscribe       | Instrument Sans | 14px | 600    | 52px h      | 0        | sentence  |
| Message         | Instrument Sans | 13px | 400    | 1.5         | 0        | sentence  |
| Issue kicker    | Instrument Sans | 11px | 600    | 1           | +0.1em   | UPPERCASE |
| Issue title     | Newsreader      | 24px | 500    | 1.15        | −0.01em  | sentence  |
| Issue deck      | Newsreader      | 15px | 400    | 1.5         | 0        | sentence  |
| Column heads    | Instrument Sans | 11px | 600    | 1           | +0.14em  | UPPERCASE |
| Sitemap links   | Newsreader      | 17px | 400    | 1.3         | 0        | sentence  |
| Wordmark        | Newsreader      | 84px | 400 italic | 0.9      | −0.035em | title     |
| Mast blurb      | Instrument Sans | 13px | 400    | 1.5         | 0        | sentence  |
| Legal           | Instrument Sans | 12px | 400    | 1.5         | 0        | sentence  |

Headline and wordmark set `font-variation-settings: "opsz" 72`. Essay remnant uses `"opsz" 18`.

## Motion

| Element           | Trigger        | Property              | From → To                 | Duration | Easing      | Notes |
|-------------------|----------------|-----------------------|---------------------------|---------:|-------------|-------|
| Form underline    | error / done  | border-color          | ink → accent or ok        | 150ms    | `--ease`    | |
| Arrow             | hover         | translateX            | 0 → 5px                   | 280ms    | `--ease-out`| |
| Issue title rule  | hover / focus | background-size       | 0 1px → 100% 1px          | 360ms    | `--ease-out`| gradient underline |
| Sitemap link      | hover         | color, font-style     | ink → accent + italic     | 150ms    | `--ease`    | |
| Legal link        | hover         | color, underline      | ink-2 → ink, 3px offset   | instant  | —           | |
| Page              | load          | scrollTop             | → scrollHeight            | 1 frame  | —           | show footer first |

Reduced motion: `* { transition-duration: 1ms !important }`.

## States

- **Idle:** underline `--ink`; message `--ink-2`, no icon.
- **Error `.bad`:** underline `--accent`; message `--accent` with circle + stem/dot SVG; `aria-invalid="true"`.
- **Success `.done`:** underline `--ok`; message `--ok` with check path.
- **Input after error/success:** classes cleared, default sentence restored, `aria-invalid="false"`.
- **Subscribe hover:** arrow +5px. Focus-visible: 2px `--accent` outline, 3px offset (global); submit uses `outline-offset: -2px`.
- **Issue title hover / focus-visible:** 1px accent underline grows from the left (`background-size` 0 → 100% 1px).
- **Sitemap hover:** colour `--accent`, italic.

## Accessibility

- Footer `aria-label="Site footer"`; subscribe heading `id="sub-h"` referenced by `aria-labelledby`.
- Email has a clipped `<label for="email">`. Message is `aria-live="polite"` and `aria-describedby` on the input.
- `novalidate` plus JS so error copy is specific, not the native "Please include an '@'".
- Illustration has `role="img"` and a text label. Initials disc `aria-hidden`.
- Tab order: essay (not interactive) → email → Subscribe → issue title link → 14 sitemap links → Privacy → Terms.
- Contrast: `--ink-2` on `--paper` ~7:1; error terracotta on paper ~5.5:1; `--ok` on paper ~4.6:1 for 13px (keep the icon).
- Hit targets: input and submit 52px tall; sitemap lines ~22px with 8px gap — acceptable for a desktop footer.

## Responsive rules

- ≥ 1280: as specified, `--pad: 56px`.
- ≤ 1023: footer one column; `.sub` loses the right border, gains a bottom `--line-2` rule; headline 48px.
- ≤ 640: `--pad: 20px`; issue stacks (image above copy); sitemap 2 columns; legal wraps; essay padding 28px 20px.
- Always scroll to the footer on first paint so the 800px frame shows the split, not the essay.

## Acceptance checklist

- [ ] Footer grid is 7fr / 5fr with a double top rule (1px + 4px inset echo) and a 1px column rule.
- [ ] First paint is scrolled to the bottom so the essay remnant and footer share the 800px frame.
- [ ] Headline is 60px Newsreader; "slowly." is terracotta italic via `<em>`.
- [ ] Email field is 22px italic serif, 52px tall, no box — only a 1.5px bottom rule.
- [ ] Empty submit shows the exact empty-field sentence and terracotta underline; invalid format shows the @/domain sentence.
- [ ] Valid submit shows the confirmation sentence including the typed address, green underline, check icon.
- [ ] Typing after error or success restores the Sunday-letter sentence.
- [ ] Latest issue is No. 214, 27 Sep 2026, "The street that refused to widen", 18 min, with a CSS shopfront labelled "No. 214".
- [ ] Wordmark "The Margin" is 84px italic Newsreader; legal line names both font families.
- [ ] Focus rings are 2px oxblood; the live region is polite.
- [ ] At 1023px the split stacks; at 640px the issue image stacks and padding is 20px.
- [ ] Reduced motion keeps validation, drops transition time to 1ms.

## Implementation notes

**Double rule** without extra DOM:

```css
footer {
  border-top: 1px solid var(--ink);
  box-shadow: 0 -4px 0 -3px var(--ink) inset;
  display: grid;
  grid-template-columns: 7fr 5fr;
}
footer::before {
  content: "";
  position: absolute;
  left: 0; right: 0; top: 4px;
  border-top: 1px solid var(--ink);
}
```

**Custom validity**, never the native bubble:

```js
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const v = input.value.trim();
  if (!v) { set('bad', 'Enter an email address to subscribe.'); input.focus(); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
    set('bad', 'That address is missing an @ or a domain, like name@studio.pt.');
    input.focus(); return;
  }
  set('done', 'Check your inbox. We sent a confirmation link to ' + v + '.');
});
```

**Show the footer in an 800px frame** (the Lounge scales the document, it does not scroll it for you):

```js
requestAnimationFrame(() => {
  const se = document.scrollingElement || document.documentElement;
  se.scrollTop = se.scrollHeight;
});
```

Common mistakes: a filled input box (the piece is an underline); using `type="email"` without `novalidate` so Chrome's tooltip fights the live region; putting the wordmark in the left column; forgetting the essay remnant (a footer piece must show the last bit of page above it); drawing the shopfront as a grey rectangle instead of the stacked-gradient dusk street.
