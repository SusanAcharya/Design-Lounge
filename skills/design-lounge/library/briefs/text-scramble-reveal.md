<!-- Design Lounge Nº 076 · "Text scramble reveal" · designlounge.vercel.app -->

# Text scramble reveal

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

A release-notes hero for a database tool ("Mira 3.2"). A 64px Chivo Mono headline starts as a run of grey punctuation glyphs and resolves into its real characters from left to right over 900ms; unresolved glyphs re-randomise every third frame so they flicker without strobing. A one-line sub-caption sits under it, an orange block cursor blinks at the resolving edge, and three 56 × 2px dashes at the bottom show which of the three headlines is up and how far through its 4s dwell it is. Clicking anywhere, pressing Space or → skips to the next headline. The detail worth copying is the per-character resolve schedule — `150ms + (i / n) × 600ms + random(0–150ms)` — which gives a left-to-right sweep that is never a perfectly straight edge.

## Structure

```
1280 × 800  (page padding 40px 48px)
┌───────────────────────────────────────────────────────────────────────┐
│ Mira · Release notes 3.2                                    01 / 03   │ top 13px
│                                                                       │
│                                                                       │
│  Search that reads your                                               │ h1 64px mono
│  schema, not your str#^gs█          ← resolving edge + cursor         │ min-height 3 lines
│                                                                       │ (max-width 30ch)
│  Mira 3.2 indexes column types and foreign keys, so "orders last      │ sub 15px, 62ch
│  week" becomes a real query instead of a guess.                       │
│                                                                       │
├───────────────────────────────────────────────────────────────────────┤ 1px line
│ ▬▬▬▬ ▬▬▬▬ ▬▬▬▬    › Resolves left to right in 900 ms · next in 4 s   [ Next headline ] │ bottom
└───────────────────────────────────────────────────────────────────────┘
```

- `<body>` — flex column, `cursor: pointer`, `user-select: none`, padding 40px 48px.
- `.top` — flex space-between: product label (`<b>Mira</b> · Release notes 3.2`) and `.idx` ("`<b id="n">01</b> / 03`").
- `<main>` — flex column, centred vertically, gap 28px: `.sr` (`role="status"`, visually hidden, holds the resolved headline), `<h1 id="h" aria-hidden="true">` (rendered glyphs), `<p class="sub">`.
- `.bottom` — 1px top hairline, flex space-between: `.dots` (three `.dot` with an inner `<i>` fill, `aria-hidden`), `.hint` (16px chevron SVG + text), `<button class="skip">Next headline</button>`.

Headlines and captions:

| # | Headline | Caption |
|---|----------|---------|
| 1 | Search that reads your schema, not your strings. | Mira 3.2 indexes column types and foreign keys, so "orders last week" becomes a real query instead of a guess. |
| 2 | Ship the migration. Keep the weekend. | Dry runs now diff the live schema against your branch and estimate lock time per table before anything touches production. |
| 3 | Latency budgets, enforced at merge. | Set a p95 target per endpoint. Pull requests that would blow it get a red check and the query plan that caused it. |

## Motion

| Element      | Trigger          | Property                 | From → To                  | Duration | Easing      | Notes |
|--------------|------------------|--------------------------|----------------------------|---------:|-------------|-------|
| character *k*| play             | content, colour, weight  | random glyph (`--ink-3`, 300) → true char (`--ink`, 400) | instant at `at[k]` | — | `at[k] = 150 + k/n × 600 + rand × 150` ms |
| unresolved glyphs | every 3rd frame | content              | glyph → new random glyph   | —        | —           | ~50ms cadence at 60fps |
| `.c` cursor  | while unresolved | opacity                  | 1 ↔ 0                      | 1s       | `steps(2, end)`, infinite | removed when done |
| `.dot.on i`  | play             | scaleX                   | 0 → 1                      | 4000ms   | linear, forwards | origin left |
| `.dot.done i`| headline passed  | scaleX                   | 1                          | 0        | —           | static |
| `.skip`      | hover            | border-color             | `--line` → `--ink-3`       | 160ms    | linear      | |

Worked schedule for headline 2 ("Ship the migration. Keep the weekend.", n = 37, 5 spaces):

| k  | char | earliest | latest |
|---:|------|---------:|-------:|
| 0  | S    | 150ms | 300ms |
| 9  | m    | 296ms | 446ms |
| 18 | .    | 442ms | 592ms |
| 27 | e    | 588ms | 738ms |
| 36 | .    | 734ms | 884ms |

Because of the jitter, character 18 can resolve before character 15 — that is intended; the sweep should look like a front, not a wipe.

Reduced motion: skip the frame loop entirely (set `textContent`), `h1 { transition: opacity 200ms }`, cursor `animation: none`, dashes `transform: scaleX(1)` when active.

## States

- **Resolving:** mixed grey/black characters with the orange cursor at the end.
- **Resolved:** all `--ink`, no cursor; dash still filling.
- **Dash states:** `done` (full, `--ink`), `on` (filling), default (empty `--line`).
- **Hover (page):** cursor is `pointer` everywhere to signal "click to skip".
- **Hover (button):** border `--ink-3`. **Focus-visible (button):** 2px `--accent` outline, offset 2px.
- **Reduced motion:** static text swap every 4s.
- **Dwell:** fully resolved, cursor gone, dash filling — this is the state the page spends 78% of its time in, so it must look finished on its own.
- **Wrap (3 → 1):** the three dashes reset (`done` removed from all) before the first refills.

## Accessibility

- The visible `<h1>` is `aria-hidden="true"` because its content is noise for most of a second. A visually hidden `role="status"` element holds the final headline and is updated at the start of each play, so screen readers announce the real sentence once per headline.
- The "Next headline" `<button>` is the keyboard path; Space/→ shortcuts only fire when `document.body` is the event target, so pressing Space on the focused button does not advance twice.
- Body click ignores clicks that originate on the button (`closest('.skip')`) for the same reason.
- Dashes are `aria-hidden`; the "01 / 03" index conveys position in text.
- Contrast: `--ink` on `--bg` 15.7:1; `--ink-2` 5.9:1; `--ink-3` glyphs 2.9:1 — intentionally low, they are transient noise; `--accent` on `--bg` 3.6:1 (used for a 13px number and a cursor, not body text).
- The cursor blink is 1Hz and small; the glyph flicker is confined to the headline and stops within 900ms — no sustained flashing.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: `--head: 56px`; measure stays 30ch.
- 768–1023: `--head: 44px`; padding 32px; caption 14px; hint text hidden, button remains.
- < 640: `--head: 30px`; padding 20px; `min-height` 4 lines; dashes 40px; the index and product label stack.

## Acceptance checklist

- [ ] Headline is Chivo Mono 64px/1.15 with `white-space: pre-wrap` and a 30ch max width; the box reserves 3 lines.
- [ ] Every non-space character resolves at `150 + (k/n) × 600 + random × 150` ms; the last one is resolved by 900ms.
- [ ] Unresolved characters are drawn from the glyph set, in `--ink-3` at weight 300, and re-randomise every third frame only.
- [ ] Spaces are never scrambled.
- [ ] An orange block cursor (.6ch × .9em) blinks at the end while resolving and disappears on completion.
- [ ] Headlines cycle every 4000ms; "01 / 03" and the caption update at the start of each play.
- [ ] Three 56 × 2px dashes: previous full, current filling linearly over 4s, next empty.
- [ ] Click anywhere, Space, → and the "Next headline" button all skip; none of them can double-advance.
- [ ] Skipping cancels the pending `requestAnimationFrame` and the 4s timer before starting the next play.
- [ ] A visually hidden `role="status"` element carries the final text; the visible `<h1>` is `aria-hidden`.
- [ ] Reduced motion shows the final text immediately with no cursor and no flicker.
- [ ] No layout shift between headlines of different line counts.
- [ ] `<`, `>` and `&` from the glyph set render literally (escaped when building the HTML string).
- [ ] The rAF loop stops on the frame the last character resolves — no idle loop runs during the dwell.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state (t = 0): header "Mira · Release notes 3.2" left, "01 / 03" right (number in orange). Headline area shows all characters of headline 1 as grey glyphs; spaces are real spaces. First dash starts filling. Sub-caption for headline 1 is already fully visible.
2. Each character *k* (of *n*, spaces excluded) has a resolve time `at[k] = 150 + (k / n) × 600 + random() × 150` ms — so the first character resolves between 150 and 300ms, the last between 750 and 900ms. Before `at[k]` the character is a random glyph from `<>-_\/[]{}=+*^?#%&@!;:~` rendered in `--ink-3` at weight 300; from `at[k]` it is the true character in `--ink` at weight 400.
3. Every third animation frame (~50ms at 60fps), all still-unresolved glyphs are re-randomised. Between those frames they hold, so the texture reads as flicker, not noise.
4. While any character is unresolved, a `.6ch × .9em` orange block cursor is appended after the text and blinks (1s, `steps(2)`); it is removed on the frame everything resolves.
5. The active dash's fill scales from 0 to 1 over 4000ms, linear. Dashes for earlier headlines are full; later ones empty.
6. At t = 4000ms: the next headline plays (index wraps 3 → 1). Its sub-caption swaps instantly; "02 / 03" updates; the headline's hidden live text updates to the final string.
7. Click anywhere on the page, or press Space / ArrowRight with nothing focused: cancel the current frame loop and dwell timer, play the next headline immediately. The "Next headline" button does the same and is keyboard-reachable.
8. The headline box reserves three lines of height (`min-height: 64 × 1.15 × 3 = 220.8px`) so switching between a one-line and a two-line headline does not move the caption or dashes.
9. With `prefers-reduced-motion: reduce`: no scramble — the final text is set directly (a 200ms opacity transition is allowed); no blinking cursor; dashes jump to full when active. The 4s cycle and skipping still work.

## Tokens

```css
:root {
  /* colour — off-white paper, near-black, grey glyphs, one orange */
  --bg: #f2f0eb;
  --ink: #141414;         /* resolved text, active dash fill */
  --ink-2: #5c5a55;       /* captions, header text */
  --ink-3: #9b9891;       /* unresolved glyphs, hint */
  --line: #dcd9d1;        /* hairline, empty dashes, button border */
  --accent: #e4572e;      /* cursor, index number, focus ring */

  /* type */
  --mono: "Chivo Mono", ui-monospace, monospace;
  --head: 64px;
  --head-lh: 1.15;
  --measure: 30ch;        /* headline max width */
  --sub-measure: 62ch;

  /* layout */
  --pad: 40px 48px;
  --dash-w: 56px;
  --dash-h: 2px;
  --cursor-w: .6ch;

  /* motion */
  --t-scramble: 900ms;    /* last character resolves by here */
  --t-lead: 150ms;        /* first character earliest */
  --t-sweep: 600ms;       /* linear spread across characters */
  --t-jitter: 150ms;      /* random addition per character */
  --glyph-hold: 3;        /* frames between glyph re-randomisation */
  --t-dwell: 4000ms;      /* per headline */
  --t-blink: 1s;
  --t-micro: 160ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role            | Family     | Size | Weight | Line-height | Tracking | Case     | Notes |
|-----------------|------------|-----:|-------:|------------:|---------:|----------|-------|
| Headline        | Chivo Mono | 64px | 400    | 1.15        | −0.02em  | sentence | `white-space: pre-wrap`, max-width 30ch |
| Unresolved glyph| Chivo Mono | 64px | 300    | 1.15        | −0.02em  | —        | colour `--ink-3` |
| Caption         | Chivo Mono | 15px | 400    | 1.6         | 0        | sentence | max-width 62ch, `--ink-2` |
| Header / footer | Chivo Mono | 13px | 400 (labels 500) | 1.5 | 0     | sentence | |
| Index           | Chivo Mono | 13px | 500    | 1.5         | 0        | numerals | tabular, accent |
| Button          | Chivo Mono | 13px | 400    | 1.5         | 0        | sentence | 6px 12px padding, 4px radius |
| Cursor          | —          | .6ch × .9em | —  | —           | —        | —        | `--accent` block, `vertical-align: -.1em`, `margin-left: .1ch` |

Only one family is loaded (300/400/500). Mono is what makes the effect work: every glyph has the same advance, so the line never reflows while it resolves.

## Implementation notes

**Schedule per character, render per frame.** Precompute the resolve times and a starting glyph per character; on each frame emit the true character or the held glyph:

```js
const GLYPHS = '<>-_\\/[]{}=+*^?#%&@!;:~';
function play(i) {
  cancelAnimationFrame(raf); clearTimeout(timer);
  const chars = [...lines[i][0]], n = chars.length;
  const at    = chars.map((c, k) => c === ' ' ? 0 : 150 + (k / n) * 600 + Math.random() * 150);
  const glyph = chars.map(() => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
  const start = performance.now(); let frame = 0;
  (function step(now) {
    const t = now - start; frame++; let done = true, out = '';
    for (let k = 0; k < n; k++) {
      if (t >= at[k]) out += chars[k];
      else { done = false;
             if (frame % 3 === 0) glyph[k] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
             out += `<span class="g">${glyph[k]}</span>`; }
    }
    h.innerHTML = out + (done ? '' : '<span class="c"></span>');
    if (!done) raf = requestAnimationFrame(step);
  })(start);
  timer = setTimeout(() => play((i + 1) % lines.length), 4000);
}
```

**Restart the dash fill** by removing and re-adding the class with a reflow between; without the reflow the animation doesn't restart when the same dash is re-activated on wrap:

```js
dots.forEach((d, j) => { d.classList.remove('on', 'done'); if (j < i) d.classList.add('done'); });
void dots[i].offsetWidth;
dots[i].classList.add('on');
```

**Escape while you build.** The glyph set includes `<`, `>` and `&`; wrap each glyph through a map before concatenating HTML:

```js
const ESC = { '<': '&lt;', '>': '&gt;', '&': '&amp;' }, esc = c => ESC[c] || c;
out += t >= at[k] ? esc(chars[k]) : `<span class="g">${esc(glyph[k])}</span>`;
```

**Keep the glyphs in the same font and size** as the resolved text (only colour and weight change). Any size difference makes the line jitter as characters resolve; Chivo Mono's 300 and 400 weights share advance widths, which is why weight is safe to change here — check that before substituting another mono.

Common mistakes: re-randomising every frame (strobes); scrambling spaces (words visibly change length); using `Math.random()` inside the frame loop for the *schedule* (characters resolve then un-resolve); forgetting to escape `<` and `&` — pick a glyph set without them or escape when building HTML (this set includes `<`, `>` and `&`, so build the string with `textContent`-safe spans or a map: `{'<':'&lt;','>':'&gt;','&':'&amp;'}`).

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
