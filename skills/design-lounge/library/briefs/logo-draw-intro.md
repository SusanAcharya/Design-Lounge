<!-- Design Lounge Nº 084 · "Logo draw site intro" · www.designlounge.live -->

# Logo draw site intro

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A first-visit intro for a courier brand's marketing site. Two full-bleed black panels cover the page. A 140px "NP" monogram draws its own outline in white over 900ms, fills red for 250ms, then the panels slide apart (top up, bottom down) over 700ms while the monogram fades. Underneath, the page is already laid out; its uppercase Archivo Black headline rises letter by letter with a 45ms stagger, followed by a stats row. A small "Replay intro" button in the bottom-right corner (or a click on empty page) re-runs the whole 2.9s sequence. The whole thing is a single CSS animation timeline driven by one `.play` class on `<body>`; the JS only splits the headline and toggles the class.

## Structure

```
1280 × 800  (page beneath the intro)
┌──────────────────────────────────────────────────────────────────────┐
│ header 72   ■ Nord Post              Send   Track   Business   Depots │
├──────────────────────────────────────────────────────────────────────┤
│ 56px gutters                                                          │
│   SAME-DAY COURIER · OSLO, BERGEN, TRONDHEIM         (eyebrow, red)   │
│   DELIVERED BEFORE                                                    │
│   THE COFFEE COOLS                  ← h1 100px / 0.94, uppercase      │
│   ───────────────────────────────────────────────────────────────     │
│   94 min      3,120       NOK 79                     [Book a pickup →]│
└──────────────────────────────────────────────────────────────────────┘
intro overlay (fixed, z 10):  ┌─────── panel.t (top 50%) ───────┐
                              │            [NP] 140px           │  ← mark centred
                              └─────── panel.b (bottom 50%) ────┘
replay button: fixed, right 20 / bottom 20, z 20
```

- `.page` — flex column, `padding: 0 56px`. `<header>` with `.wordmark` (10px red square + name in Archivo Black 18px) and `<nav aria-label="Primary">`.
- `<main>` — flex 1, vertically centred. `.eyebrow` `<p>`, `<h1 id="hl">` (JS wraps each word in `<span class="w">` (overflow hidden) and each letter in `<span class="c" style="--i:n">`), `.row` with `.stats` (three `b` + `span` pairs) and `<button class="btn">`.
- `.intro` — `position: fixed; inset: 0; pointer-events: none; aria-hidden="true"`, holding `.panel.t`, `.panel.b`, and `<svg class="mark" viewBox="0 0 100 100">` with one path: `M18 82V18l32 40V18M62 82V18h14a20 20 0 0 1 0 40H62` (an N and a P).
- `<button class="replay" id="replay">` — outside `.intro` so it stays clickable.

## Motion

| Element        | Trigger | Property                  | From → To                  | Duration | Easing         | Delay |
|----------------|---------|---------------------------|----------------------------|---------:|----------------|------:|
| `.mark path`   | `.play` | stroke-dashoffset         | 640 → 0                    | 900ms    | `--ease-draw`  | 0 |
| `.mark path`   | `.play` | fill-opacity              | 0 → 1                      | 250ms    | `--ease`       | 900ms |
| `.panel.t`     | `.play` | transform                 | 0 → translateY(−100%)      | 700ms    | `--ease-out`   | 1250ms |
| `.panel.b`     | `.play` | transform                 | 0 → translateY(100%)       | 700ms    | `--ease-out`   | 1250ms |
| `.mark`        | `.play` | opacity, transform        | 1, 1 → 0, scale(.9)        | 300ms    | `--ease`       | 1250ms |
| `h1 .c`        | `.play` | transform, opacity        | translateY(110%), 0 → 0, 1 | 640ms    | `--ease-out`   | 1500ms + i × 45ms |
| `.row`         | `.play` | opacity                   | 0 → 1                      | 500ms    | `--ease`       | 2400ms |
| nav / CTA / replay | hover | color / background       | black ↔ red / white        | 0        | —              | instant |

All animations use `animation-fill-mode: forwards`. Reduced motion: panels and mark use 1ms durations with a 400ms delay (so the page is briefly covered, then simply present); letters and row have `animation: none` and rest at their final values.

## States

- **Covered (0–1250ms):** panels visible, page not interactive in practice (panels are `pointer-events: none` but there is nothing to see).
- **Revealed:** page fully interactive; intro overlay remains in the DOM, invisible, `pointer-events: none`.
- **Hover (nav link):** colour `--red`. **Hover (CTA):** background `--red`. **Hover (Replay):** background `--ink`, colour `--bg`.
- **Focus-visible (any link/button):** `outline: 2px solid var(--red); outline-offset: 3px`.
- **Replaying:** identical to first load; no fade between — the panels snap back to cover because `.play` is removed and re-added in the same frame.

## Accessibility

- The intro overlay is `aria-hidden="true"`; screen readers get the page immediately.
- `<h1>` keeps the full sentence in `aria-label`; every generated `.w` span is `aria-hidden`.
- Replay is a real `<button>` reachable by Tab after the CTA; keyboard Enter/Space replays. Clicking blank page also replays but never traps focus or scroll.
- Focus order: nav (4) → CTA → Replay.
- Contrast: black on white 21:1; `--ink-2` on white 6.4:1; `--red` on white 4.9:1 (used for the 13px eyebrow — acceptable, it is 500 weight uppercase); white on black 21:1.
- Reduced motion path leaves no element hidden and no delay longer than 400ms.
- Nothing is announced on replay; add `aria-live` only if the product requires it.

## Responsive rules

- ≥ 1280: as specified; headline wraps to two lines ("DELIVERED BEFORE / THE COFFEE COOLS").
- 1024–1279: headline 100px still fits at ≤ 1160px width; keep.
- 768–1023 (demo: `max-width: 1100px`): headline 96px, three lines; stats gap 40px.
- < 640: headline 56px, `.row` stacks (stats above CTA, CTA full width), gutters 24px, monogram 96px; Replay moves to bottom-left 16px so it does not collide with a mobile browser bar.

## Acceptance checklist

- [ ] Monogram is a single SVG path with `stroke-dasharray: 640; stroke-dashoffset: 640`, 3px white stroke, round joins and caps.
- [ ] Stroke draws over exactly 900ms with `cubic-bezier(.65,0,.35,1)`, then fills `#e0261a` over 250ms.
- [ ] Two black panels, each 50% tall, split at 1250ms over 700ms `cubic-bezier(.16,1,.3,1)` — top goes up, bottom goes down.
- [ ] Headline letters are individually wrapped, clipped by per-word `overflow: hidden` wrappers, and rise from `translateY(110%)` with a 45ms stagger starting at 1500ms.
- [ ] Stats row fades in at 2400ms over 500ms.
- [ ] The intro is driven by one `.play` class on `<body>`; no `setTimeout` chains.
- [ ] "Replay intro" button (fixed, right 20 / bottom 20) restarts the full sequence; so does clicking blank page.
- [ ] Overlay is `aria-hidden` and `pointer-events: none`; the `<h1>` has an `aria-label` with the full text.
- [ ] Focus outlines are 2px red with 3px offset on every link and button.
- [ ] With `prefers-reduced-motion: reduce` the page is fully visible within 400ms and no letter animates.
- [ ] Only pure `#000`, `#fff`, one grey and one red appear anywhere.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. t = 0 (page load): both panels cover the viewport (each 50% tall, `#000`). Monogram stroke is invisible (`stroke-dashoffset: 640` on a 640 dash). Page content beneath is present but headline letters are at `translateY(110%)`, opacity 0, clipped by their word wrappers; the stats row is opacity 0.
2. 0–900ms: the monogram path's `stroke-dashoffset` animates 640 → 0 with `cubic-bezier(.65,0,.35,1)`; 3px white stroke, round joins.
3. 900–1150ms: `fill-opacity` 0 → 1, fill `--red`. The white stroke stays.
4. 1250–1950ms: top panel `translateY(-100%)`, bottom panel `translateY(100%)`, 700ms expo-out. Simultaneously the monogram fades to 0 and scales to 0.9 over 300ms.
5. 1500ms onward: each headline letter animates `translateY(110%) → 0`, opacity 0 → 1, 640ms expo-out, delay `1500ms + index × 45ms` (31 letters, last one starts at ~2.9s).
6. 2400ms: the stats row and CTA fade in over 500ms.
7. Clicking "Replay intro" (fixed, bottom-right 20px, 1px black outline pill, uppercase 12px) removes `.play`, forces a reflow, re-adds it: everything restarts from step 1. Clicking anywhere on the page that is not a link or button does the same.
8. Hover: nav links turn `--red`; CTA background `#000` → `--red`; Replay inverts to black with white text.
9. `prefers-reduced-motion`: the panels open at 400ms with a 1ms duration, the monogram appears fully drawn and filled instantly, headline letters and stats row are visible with no animation.

## Tokens

```css
:root {
  /* colour — pure black/white is the point; one red */
  --bg: #ffffff;        /* page */
  --ink: #000000;       /* text, panels, CTA */
  --ink-2: #5c5c5c;     /* stat labels */
  --line: #e3e3e3;      /* hairlines */
  --red: #e0261a;       /* eyebrow, monogram fill, hovers, focus */
  --panel: #000000;     /* intro panels */
  --mark: #ffffff;      /* monogram stroke */

  /* type */
  --display: "Archivo Black", Impact, sans-serif;
  --sans: "Archivo", system-ui, sans-serif;

  /* layout */
  --header-h: 72px;
  --gutter: 56px;
  --mark-size: 140px;
  --h1-size: 100px;

  /* motion */
  --t-draw: 900ms;      /* stroke draw */
  --t-fill: 250ms;      /* fill in, starts at --t-draw */
  --t-split: 700ms;     /* panels open */
  --t-letter: 640ms;    /* each headline letter */
  --stagger: 45ms;      /* per letter */
  --d-split: 1250ms;    /* when panels start */
  --d-letters: 1500ms;  /* when the first letter starts */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease-draw: cubic-bezier(.65, 0, .35, 1);
}
```

## Typography

| Role        | Family        | Size  | Weight | Line-height | Tracking | Case      |
|-------------|---------------|------:|-------:|------------:|---------:|-----------|
| Headline    | Archivo Black | 100px | 400    | 0.94        | −0.035em | UPPERCASE |
| Wordmark    | Archivo Black | 18px  | 400    | 1           | −0.02em  | sentence  |
| Stat value  | Archivo Black | 28px  | 400    | 1           | −0.02em  | numerals  |
| Eyebrow     | Archivo       | 13px  | 500    | 1.5         | +0.10em  | UPPERCASE |
| Nav         | Archivo       | 14px  | 500    | 1.5         | 0        | sentence  |
| Stat label  | Archivo       | 13px  | 400    | 1.5         | 0        | sentence  |
| CTA         | Archivo       | 14px  | 500    | 1           | 0        | sentence  |
| Replay      | Archivo       | 12px  | 500    | 1           | +0.06em  | UPPERCASE |

## Implementation notes

**One timeline, one class.** Every animation is declared with its own delay against the same start, so restarting is trivial:

```css
.play .mark path { animation: draw 900ms cubic-bezier(.65,0,.35,1) forwards,
                              fill 250ms cubic-bezier(.2,.7,.2,1) forwards 900ms; }
.play .panel.t { animation: up 700ms cubic-bezier(.16,1,.3,1) forwards 1250ms; }
.play .panel.b { animation: down 700ms cubic-bezier(.16,1,.3,1) forwards 1250ms; }
.play h1 .c    { animation: rise 640ms cubic-bezier(.16,1,.3,1) forwards;
                 animation-delay: calc(1500ms + var(--i) * 45ms); }
@keyframes draw { to { stroke-dashoffset: 0 } }
@keyframes up   { to { transform: translateY(-100%) } }
@keyframes rise { to { transform: translateY(0); opacity: 1 } }
```

**Restart by forcing a reflow** between removing and re-adding the class; without the `offsetWidth` read the browser coalesces the two changes and nothing replays:

```js
function replay() {
  document.body.classList.remove('play');
  void document.body.offsetWidth;   // flush styles
  document.body.classList.add('play');
}
```

**Split by word, then by letter**, so a word never breaks mid-line and the rise is clipped per word:

```js
text.split(' ').forEach((word, wi, arr) => {
  const w = Object.assign(document.createElement('span'), { className: 'w' });
  w.setAttribute('aria-hidden', 'true');
  [...word].forEach(ch => { const c = document.createElement('span');
    c.className = 'c'; c.textContent = ch; c.style.setProperty('--i', i++); w.appendChild(c); });
  h1.appendChild(w); if (wi < arr.length - 1) h1.appendChild(document.createTextNode(' '));
});
```

Common mistakes: measuring the dash length precisely (640 is an over-estimate of the ~590 path length; over-estimating is fine, under-estimating leaves a gap); forgetting `fill-opacity: 0` so the fill shows before the stroke; putting the Replay button inside the `pointer-events: none` overlay; clipping letters with `overflow: hidden` on the `<h1>` itself (that clips descenders on the last line — clip per word with a small bottom padding instead).

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
