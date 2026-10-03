<!-- Design Lounge Nº 087 · "Variable font proximity headline" · designlounge.vercel.app -->

# Variable font proximity headline

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A type-foundry specimen hero on a cream page. The headline "Weight follows your hand" is set in Fraunces Variable at 148px, weight 300. As the pointer moves across it, each letter's `wght` axis is driven by its distance to the cursor: the nearest glyph reaches 900 and turns rust-red, letters within a 260px radius blend between, everything else stays at 300. On leave, the letters ease back to 300 over 520ms. Keyboard focus and `prefers-reduced-motion` show a static heavy state (800) so nobody misses the point. The detail worth copying: weight is written per-letter via a custom property (`--w`) and rendered by `font-variation-settings`, with a CSS transition doing the smoothing, so the JS only sets numbers.

## Reference behaviour

1. Initial state: 64px header (brand, 4 nav links, dark pill CTA "Trial fonts"), a kicker line "Fraunces Variable · 100–900 · optical size 9–144", the headline at weight 300, a 420px paragraph, three stats on the right, and a 52px footer with a status readout "Weight 300 — resting" beside a 6px rust dot.
2. Pointer enters the `<h1>`: letter centres are measured once (`getBoundingClientRect`), the footer dot scales to 1.6 over 160ms.
3. Pointer moves: on each `requestAnimationFrame`, for every letter compute `d` = distance from cursor to the letter's centre, `t = smoothstep(1 − d/260)`, then `wght = 300 + 600·t` and `SOFT = 30 + 70·t`. Letters with `t > 0.92` get class `.hot` (colour `--accent`). Each letter's `font-variation-settings` transitions over 180ms so the weight glides rather than snaps.
4. The footer readout updates to the heaviest weight in the frame: "Weight 900 — peak" or "Weight 640 — blending".
5. Pointer leaves: every letter gets `.leave` (transition 520ms expo-out), `--w` resets to 300, `.hot` is removed, readout returns to "Weight 300 — resting", dot scales back.
6. Tab to the headline (`tabindex="0"`): a 2px rust focus ring at 4px offset appears and all letters jump to weight 800 / SOFT 60 with no transition; readout says "Weight 800 — keyboard".
7. With `prefers-reduced-motion: reduce`, the body gets `.static`: the headline sits permanently at weight 800, the pointer handlers are never attached, readout says "Weight 800 — static (reduced motion)".
8. Hovering nav links darkens them to `--ink`; hovering the CTA fills it with `--accent`.

## Structure

```
1280 × 800
┌────────────────────────────────────────────────────────────────────────┐
│ header 64   ◎ Loam Type Foundry      Families Licensing In use Journal  [Trial fonts] │
├────────────────────────────────────────────────────────────────────────┤
│ 48px gutter                                                             │
│   — FRAUNCES VARIABLE · 100–900 · OPTICAL SIZE 9–144   (kicker 12px)    │
│                                                                         │
│   Weight follows                       ← h1 148px / 0.92, max-width 1100│
│   your hand                                                             │
│                                                                         │
│   paragraph 420px ·········   9 axes   2,148   € 180  (meta, right)     │
├────────────────────────────────────────────────────────────────────────┤
│ footer 52   ● Weight 300 — resting          Loam Type Foundry · Specimen 04 │
└────────────────────────────────────────────────────────────────────────┘
```

- `<header>` — flex row, `border-bottom: 1px solid --line`. `.brand` (22px inline SVG + name), `<nav aria-label="Primary">` with four `<a>`, `<button class="cta">`.
- `<main>` — flex column, `justify-content: center`, padding `0 48px 24px`.
  - `<p class="kicker">` with a 28px hairline drawn by `::before`.
  - `<h1 id="hl" tabindex="0" aria-label="Weight follows your hand">` — JS splits the text into `<span class="l">` per letter and `<span class="sp">` per space, all `aria-hidden="true"`.
  - `.sub` — 2-column grid `420px 1fr`, gap 48px, align end: paragraph left, `.meta` stats right.
- `<footer>` — `.status` (`.dot` + `#read` live text) and a right-aligned caption.

## Tokens

```css
:root {
  /* colour — cream paper, warm near-black ink, one rust accent */
  --bg: #f4efe4;        /* page */
  --bg-2: #ede6d6;      /* reserved for hover surfaces */
  --ink: #1c1a16;       /* headline, primary text */
  --ink-2: #6b655a;     /* paragraph, nav */
  --ink-3: #9a9385;     /* kicker, meta labels, footer */
  --line: #d9d1c0;      /* hairlines */
  --accent: #b4472b;    /* hot letters, focus ring, CTA hover, dot */

  /* type */
  --serif: "Fraunces", Georgia, serif;          /* axes: opsz 9..144, wght 100..900, SOFT 0..100 */
  --sans: "Instrument Sans", system-ui, sans-serif;

  /* proximity model */
  --w-min: 300;         /* resting weight */
  --w-max: 900;         /* weight under the cursor */
  --radius: 260px;      /* falloff radius */

  /* layout */
  --header-h: 64px;
  --footer-h: 52px;
  --gutter: 48px;
  --measure: 420px;     /* paragraph width */
  --r-focus: 8px;       /* headline focus-ring radius */

  /* motion */
  --t-micro: 160ms;     /* colour, dot */
  --t-weight: 180ms;    /* per-letter weight glide while hovering */
  --t-leave: 520ms;     /* ease back to rest */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role          | Family          | Size  | Weight        | Line-height | Tracking | Case      | Extra axes |
|---------------|-----------------|------:|--------------:|------------:|---------:|-----------|------------|
| Headline      | Fraunces        | 148px | 300 → 900 var | 0.92        | −0.035em | sentence  | `opsz` 144, `SOFT` 30 → 100 |
| Headline (focus / reduced) | Fraunces | 148px | 800   | 0.92        | −0.035em | sentence  | `SOFT` 60 |
| Kicker        | Instrument Sans | 12px  | 400           | 1           | +0.14em  | UPPERCASE | — |
| Paragraph     | Instrument Sans | 17px  | 400           | 1.5         | 0        | sentence  | — |
| Nav / body    | Instrument Sans | 14px  | 400           | 1.5         | 0        | sentence  | — |
| Brand         | Instrument Sans | 15px  | 500           | 1           | −0.01em  | sentence  | — |
| CTA           | Instrument Sans | 13px  | 500           | 1           | 0        | sentence  | — |
| Stat value    | Fraunces        | 22px  | 500           | 1.1         | −0.01em  | numerals  | `opsz` 24 |
| Stat label / footer | Instrument Sans | 13px / 12px | 400 | 1.5   | 0        | sentence  | — |

Load Fraunces with the axis ranges in the URL, otherwise the browser gets static instances and nothing animates:
`family=Fraunces:opsz,wght,SOFT@9..144,100..900,0..100`.

## Motion

| Element        | Trigger         | Property                  | From → To                       | Duration | Easing       | Notes |
|----------------|-----------------|---------------------------|---------------------------------|---------:|--------------|-------|
| `.l` (letter)  | pointermove     | `font-variation-settings` | wght 300 → up to 900, SOFT 30 → 100 | 180ms | `--ease`     | value set per rAF; CSS transition smooths |
| `.l.hot`       | t > 0.92        | color                     | `--ink` → `--accent`            | 160ms    | `--ease`     | at most 2–3 letters at once |
| `.l.leave`     | pointerleave    | `font-variation-settings` | current → wght 300, SOFT 30     | 520ms    | `--ease-out` | class swaps transition duration only |
| `.dot`         | pointerenter/leave | transform              | scale 1 → 1.6                   | 160ms    | `--ease`     | footer status |
| `h1:focus-visible .l` | keyboard focus | `font-variation-settings` | any → wght 800, SOFT 60   | 0        | —            | deliberate snap |

Falloff curve: `t = clamp(1 − d / 260, 0, 1)`, then smoothstep `t² (3 − 2t)`. Do not use linear falloff; the smoothstep keeps the middle letters from flickering.

Reduced motion: no pointer listeners are attached; `.static .l` is fixed at wght 800 with `transition: none`.

## States

- **Rest:** all letters wght 300, colour `--ink`; readout "Weight 300 — resting".
- **Hover (headline):** per-letter weights; nearest letters `.hot` in `--accent`; footer dot scaled 1.6.
- **Leave:** letters glide back over 520ms; `.hot` removed immediately.
- **Focus-visible (headline):** `box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent)`, radius 8px; letters snap to 800.
- **Hover (nav link):** colour `--ink-2` → `--ink`, no underline.
- **Hover (CTA):** background `--ink` → `--accent`.
- **Reduced motion:** `.static` on body; letters 800 permanently; readout says so.

## Accessibility

- The `<h1>` keeps its full text in `aria-label`; the generated letter spans are `aria-hidden="true"` so screen readers hear one phrase, not 22 characters.
- `tabindex="0"` on the headline gives keyboard users a way to see the heavy state; the focus ring is 2px `--accent` with a 2px cream gap.
- Focus order: nav links → CTA → headline. No focus traps; the footer readout is plain text (add `aria-live="polite"` only if the product wants the weight announced; the demo does not, to avoid chatter on every frame).
- Contrast: `--ink` on `--bg` 15.2:1; `--ink-2` on `--bg` 5.6:1; `--ink-3` (9a9385) on `--bg` is 3.1:1 and is used only for 12–13px uppercase meta, never body copy; `--accent` on `--bg` 5.4:1.
- `user-select: none` on the headline so dragging across it does not highlight; `cursor: default`.
- Hit targets: nav links have 6px vertical padding (26px tall) — acceptable for web; CTA is 35px tall.

## Responsive rules

- ≥ 1280: as specified; headline 148px, `.sub` two columns.
- 1024–1279: headline 148px still fits ("Weight follows" ≈ 1000px); keep two columns.
- 768–1023 (`max-width: 1100px` in the demo): headline 112px; `.sub` becomes one column, meta left-aligned; radius stays 260px in CSS pixels.
- < 640: headline 72px, radius 160px, header nav hidden behind the CTA; on touch devices there is no hover, so bind `touchmove`/`pointermove` with `pointer-type` touch too, and add a "Press and drag" hint under the kicker.

## Acceptance checklist

- [ ] Fraunces is loaded with `opsz,wght,SOFT@9..144,100..900,0..100` in the Google Fonts URL.
- [ ] Headline is 148px, line-height 0.92, letter-spacing −0.035em, resting weight 300.
- [ ] Each letter is its own `<span class="l">`; spaces are `.sp` spans of width 0.26em; all spans are `aria-hidden`.
- [ ] Moving the cursor across the headline drives weight from 300 to exactly 900 on the nearest letter, with a 260px smoothstep falloff.
- [ ] Letters within t > 0.92 turn `#b4472b`.
- [ ] Weight changes are smoothed by a 180ms `font-variation-settings` transition while hovering.
- [ ] On pointer leave all letters return to 300 over 520ms with `cubic-bezier(.16,1,.3,1)`.
- [ ] Letter positions are measured on `pointerenter` and `resize`, not on every move.
- [ ] Focusing the headline with Tab shows a rust ring and snaps every letter to weight 800.
- [ ] With `prefers-reduced-motion: reduce` no pointer listeners run and the headline is static at 800.
- [ ] Footer readout shows the current peak weight and the dot scales 1.6 while hovering.
- [ ] No console errors; only one rAF is queued at a time.

## Implementation notes

**Let CSS do the tween.** JS writes a number to a custom property; the transition on `font-variation-settings` interpolates it. Fraunces needs `opsz` pinned or the browser will auto-pick it per size:

```css
h1 .l {
  display: inline-block;
  font-variation-settings: "opsz" 144, "wght" var(--w, 300), "SOFT" var(--s, 30);
  transition: font-variation-settings 180ms cubic-bezier(.2,.7,.2,1), color 160ms;
}
h1 .l.leave { transition-duration: 520ms; transition-timing-function: cubic-bezier(.16,1,.3,1); }
```

**Falloff per frame**, one rAF at a time, using cached centres:

```js
function paint() {
  raf = 0; if (!last) return;
  letters.forEach((l, i) => {
    const dx = rects[i].x - last.x, dy = rects[i].y - last.y;
    let t = Math.max(0, 1 - Math.hypot(dx, dy) / 260);
    t = t * t * (3 - 2 * t);                      // smoothstep
    l.style.setProperty('--w', Math.round(300 + 600 * t));
    l.style.setProperty('--s', Math.round(30 + 70 * t));
    l.classList.toggle('hot', t > 0.92);
  });
}
h1.addEventListener('pointermove', e => { last = { x: e.clientX, y: e.clientY }; if (!raf) raf = requestAnimationFrame(paint); });
```

**Split without losing the accessible name:**

```js
const text = h1.textContent; h1.textContent = ''; h1.setAttribute('aria-label', text);
for (const ch of text) { const s = document.createElement('span');
  s.className = ch === ' ' ? 'sp' : 'l'; s.textContent = ch; s.setAttribute('aria-hidden', 'true'); h1.appendChild(s); }
```

Common mistakes: animating `font-weight` instead of `font-variation-settings` (no interpolation on many engines and it triggers font fallback swaps); forgetting `display: inline-block` on the spans (transforms and measurement break); measuring `getBoundingClientRect` on every move (layout thrash with 22 letters × 60fps); loading Fraunces without the axis ranges.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
