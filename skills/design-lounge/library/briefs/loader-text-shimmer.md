<!-- Design Lounge Nº 449 · "Text loaders for AI states" · www.designlounge.live -->

# Text loaders for AI states

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. These are words, not spinners: the loader is the sentence that tells the person what is happening.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A sheet of four text loaders for Verdure, a tenancy-law research assistant. Each card shows one way to say "still working" in a 32px serif line, and resolves into the finished sentence: a shimmer sweep for a known search, a "Thinking..." ellipsis with real elapsed seconds for open-ended reasoning, a typewriter that types, holds and deletes named steps for multi-stage jobs, and a scramble of mono glyphs that settles into a matched record. Each card has its own Resolve / Replay button, and a header button resolves or replays all four. The detail worth copying is that every loader has a matching done state with the same line, the same position and a copper check, so the answer replaces the wait without the layout moving.

## Structure

```
1280 x 800, padding 32 40 40, gap 24
+---------------------------------------------------------------------------+
| (leaf) VERDURE · TENANCY RESEARCH                                         |
| Four ways to say “still working”  (44px serif)          [✓ Resolve all]   |
+-------------------------------------+-------------------------------------+
| 01 SHIMMER SWEEP           SEARCH   | 02 THINKING ELLIPSIS     REASONING  |
|                                     |                                     |
| (o) Searching 2,418 case files      | (o) Thinking...  3s                 |
|                                     |                                     |
| caption, 12px mono, 52ch            | caption                             |
| ─────────────────────────────────── | ─────────────────────────────────── |
| Running                  [Resolve]  | Running                  [Resolve]  |
+-------------------------------------+-------------------------------------+
| 03 TYPEWRITER STATUS    MULTI-STEP  | 04 SCRAMBLE TO RESOLVE    MATCHING  |
| (o) Comparing deposit clauses…|     | (o) INV-20931 → Harbour Joinery     |
| Step 2 of 4              [Resolve]  | Record 1 of 3            [Resolve]  |
+-------------------------------------+-------------------------------------+
cards: 2 x 2, gap 16, radius 6, padding 20 24 16
```

- `header` holds the brand line, the `h1`, and the Resolve all `button`.
- `main.grid` is `repeat(2, minmax(0,1fr))` with rows `minmax(0,1fr)`, so the four cards share the height.
- Each card is a `section` with `aria-labelledby` on its title, and `data-state="loading" | "done"`.
- Card anatomy: top row (number + name left, use-case tag right), the line (28px leading circle + text), caption `p`, footer (status text + action button) above a 1px rule.
- One visually hidden `p aria-live="polite"` for results.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Shimmer | loading | background-position of a 250%-wide gradient clipped to text | 100% → 0% | 2.2s loop | linear | static `--ink-2` text |
| Thinking dots | loading | opacity | .2 → 1 → .2 | 1.2s loop, 0.2s stagger | `--ease` | static, opacity 1 |
| Seconds | loading | text | +1 | every 1000ms | — | same |
| Typewriter | loading | text | type → hold → delete | 38ms/char, 1400ms, 18ms/char, 220ms gap | — | whole step, 2200ms each |
| Caret | loading | opacity | 1 ↔ 0 | 1s, `steps(1)` | — | static |
| Scramble | loading | glyphs | random → locked, left to right | 45ms frames, lock every 2nd frame after 8 | — | whole record, 2400ms each |
| Result | resolve | opacity, translateY | 0, 6px → 1, 0 | 500ms | `--ease-out` | instant |
| Lead circle | resolve | background, border | transparent → copper | 300ms | `--ease` | instant |

Gradient for the shimmer: `linear-gradient(100deg, ghost 0%, ghost 40%, ink 50%, ghost 60%, ghost 100%)`, `background-size: 250% 100%`.

## States

- Loading: lead circle 1px `--line-2` with a 14px stroke icon per card (search, bulb, lines, swap). Footer shows progress ("Running", "Step 2 of 4", "Record 1 of 3").
- Done: lead circle filled `--accent` with a white check; line is `--ink`; caret hidden; button reads Replay; footer shows the outcome.
- Action button: 32px pill, 1px `--line-2`. Hover: border `--ink-2`, fill `--bg`.
- Resolve all: 40px ink pill with check icon. Hover `#33443A`. Label flips between "Resolve all" and "Replay all" depending on whether any card is loading.
- Focus-visible: 2px copper outline, offset 3px.

## Accessibility

- The animated text is not a live region. Typing and scrambling would flood a screen reader.
- The shimmer and scramble lines carry `aria-label` ("Loading: searching 2,418 case files", "Matching invoice") while loading.
- Results are announced once through the polite live region, cleared and re-set so repeats are read.
- Each card is a labelled `section`; buttons are real buttons with visible text.
- The ghost colour `#A3ADA4` is decorative (shimmer base, churning glyphs). Everything a person must read resolves to `--ink` `#1E2A22` (about 13:1 on the card). Captions `#4C5A50` are about 6.9:1.
- Reduced motion keeps all four states legible without any movement.

## Responsive rules

- ≥1280: 2 × 2 cards fill the frame height.
- 1024 (≤1100px): title 36px, line 28px, scramble 22px.
- 768 (≤820px): one column, cards auto height, the page scrolls.
- <640: padding 20px 16px; header stacks with Resolve all under the title; title 28px; card padding 16px; line 24px, min-height 80px; scramble 17px and wraps freely (`overflow-wrap: anywhere`).
- No sideways scroll at 375px.

## Acceptance checklist

### Always

- [ ] Four loaders: shimmer sweep, thinking ellipsis with seconds, typewriter step cycle, scramble to resolve.
- [ ] Each has a done state in the same position with a filled check circle.
- [ ] Per-card Resolve / Replay, plus a global Resolve all / Replay all.
- [ ] Timers are cleared on resolve; nothing keeps ticking in the background.
- [ ] Elapsed seconds are real, and the done line uses the same number.
- [ ] Scramble glyphs are mono and lock left to right.
- [ ] Results announced once via a polite live region; animated text is not live.
- [ ] Reduced motion replaces every animation with static whole-text states.
- [ ] No spinner icons anywhere: the words are the loader.

### This demo

- [ ] Brand "Verdure · tenancy research", title "Four ways to say “still working”".
- [ ] Lines and results exactly as quoted in Reference behaviour.
- [ ] Shimmer 2.2s; type 38ms, hold 1400ms, delete 18ms; scramble frames 45ms.
- [ ] Paper `#ECEEE6`, card `#F6F7F1`, ink `#1E2A22`, copper `#B5562A`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: all four cards loading at once. Card 01 sweeps light across "Searching 2,418 case files". Card 02 reads "Thinking" with three breathing dots and a counter from "0s". Card 03 is typing "Reading 14 sources…" with a copper caret. Card 04 is scrambling into "INV-20931 → Harbour Joinery".
2. 01 Shimmer: a bright band crosses grey text left to right every 2.2s. The footer says "Running".
3. 02 Thinking: dots fade up in turn (0, 0.2, 0.4s offsets over 1.2s). Seconds tick every 1000ms in mono beside the word.
4. 03 Typewriter: each step types at 38ms per character, holds 1400ms, deletes at 18ms per character, waits 220ms, then types the next. Steps: "Reading 14 sources…", "Comparing deposit clauses…", "Checking dates against the 2024 act…", "Drafting a summary…", then loop. The footer counts "Step 2 of 4".
5. 04 Scramble: the record starts as all random glyphs. After 8 frames (45ms each) one more character locks every second frame, left to right. Locked characters are ink, the arrow is copper, unresolved glyphs are pale. Held 1600ms, then the next record: "INV-20944 → Pellow & Daughters", "INV-20958 → Marlow Glazing". The footer counts "Record 1 of 3".
6. Clicking Resolve on a card stops its timers, fills the leading circle copper with a white check, and replaces the line with the result, rising 6px into place over 500ms:
   - 01 "Found 37 filings that cite clause 4.2", footer "Done in 3.8 s".
   - 02 "Thought for N seconds" (N = elapsed, at least 2), footer "Reasoning hidden · expand".
   - 03 "Summary ready · 312 words", caret hidden, footer "4 of 4 steps".
   - 04 "INV-20931 → Harbour Joinery", footer "Matched · 98% confidence".
   The button becomes Replay. A polite live region reads the result.
7. Replay restarts that card's loader from its first state.
8. The header "Resolve all" resolves every card still loading and becomes "Replay all". Once all are done, "Replay all" restarts all four. The live region says "All four resolved" / "All four running again".
9. Reduced motion: no sweep (the text sits in `--ink-2`), dots are static, the caret does not blink, the typewriter shows each whole step for 2200ms, and the scramble shows each whole record for 2400ms. Results appear without the rise.

## Tokens

```css
:root {
  --bg: #eceee6;          /* sage paper */
  --card: #f6f7f1;        /* card */
  --line: #d3d8cc;        /* card border, footer rule */
  --line-2: #b9c0b2;      /* button border, lead circle */
  --ink: #1e2a22;         /* moss ink, resolved text, shimmer highlight */
  --ink-2: #4c5a50;       /* captions */
  --ink-3: #6f7b72;       /* labels, footer status */
  --ghost: #a3ada4;       /* shimmer base, unresolved glyphs */
  --accent: #b5562a;      /* copper: caret, arrow, done circle */
  --focus: #b5562a;

  --serif: "Spectral", Georgia, serif;
  --mono: "Spline Sans Mono", ui-monospace, Menlo, monospace;

  --radius: 6px;
  --gap: 16px;
  --sweep: 2.2s;
  --type-ms: 38ms;
  --delete-ms: 18ms;
  --hold-ms: 1400ms;
  --scramble-frame: 45ms;

  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Page title | Spectral | 44px | 400 | 1.02 | -0.02em | Sentence; quoted phrase italic in `--ink-3` |
| Loader line | Spectral | 32px | 400 | 1.15 | -0.01em | Sentence |
| Scramble line | Spline Sans Mono | 26px | 400 | 1.2 | -0.01em | Upper ID + name |
| Elapsed seconds | Spline Sans Mono | 13px | 400 | 1 | 0 | tabular-nums |
| Card label, tag | Spline Sans Mono | 11px | 400 (number 500) | 1.5 | 0.08em | Upper |
| Caption | Spline Sans Mono | 12px | 400 | 1.5 | 0 | Sentence |
| Footer, buttons | Spline Sans Mono | 12px | 400 | 1.5 | 0 | Sentence |
| Brand line | Spline Sans Mono | 12px | 400 | 1.5 | 0.08em | Upper |

The loading sentence is serif because it is content. The scramble is mono because the glyphs must not change width while they churn.

## Implementation notes

**1. Shimmer is a clipped gradient, not a mask over text.**

```css
.shim {
  background: linear-gradient(100deg, var(--ghost) 0%, var(--ghost) 40%, var(--ink) 50%,
              var(--ghost) 60%, var(--ghost) 100%) 0 0 / 250% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: sweep var(--sweep) linear infinite;
}
@keyframes sweep { from { background-position: 100% 0 } to { background-position: 0 0 } }
@media (prefers-reduced-motion: reduce) { .shim { animation: none; background: none; color: var(--ink-2); } }
```

**2. Keep every timer on the card so resolve can kill them all.** The typewriter is a chain of `setTimeout`s; push each id.

```js
const c = { timers: [], clear() { this.timers.forEach(t => { clearTimeout(t); clearInterval(t); }); this.timers = []; } };
function type(i = 0) {
  const w = STEPS[i % STEPS.length] + '…'; let k = 0;
  const add = () => { tw.textContent = w.slice(0, ++k);
    c.timers.push(setTimeout(k < w.length ? add : del, k < w.length ? 38 : 1400)); };
  const del = () => { tw.textContent = w.slice(0, --k);
    c.timers.push(k > 0 ? setTimeout(del, 18) : setTimeout(() => type(i + 1), 220)); };
  add();
}
```

**3. Scramble paints locked and random spans each frame.**

```js
const GL = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%/';
function paint(el, target, fixed) {
  el.innerHTML = [...target].map((ch, j) => ch === ' ' ? ' '
    : j < fixed ? `<span class="${ch === '→' ? 'ar' : 'r'}">${ch}</span>`
    : `<span class="u">${GL[Math.random() * GL.length | 0]}</span>`).join('');
}
let f = 0, tick = 0;
const iv = setInterval(() => { if (++tick > 8 && tick % 2 === 0) f++;
  paint(el, target, f); if (f >= target.length) clearInterval(iv); }, 45);
```

Escape `&` in names before writing HTML ("Pellow & Daughters").

Common mistakes:

- Making the typewriter line `aria-live`. Screen readers read every keystroke.
- A done state that changes font size or jumps lines. The answer takes the loader's exact slot.
- Faking "Thought for 6 seconds" with a constant. Count real seconds.
- Proportional font for the scramble, so the line jitters as glyphs change width.
- Leaving intervals running after Replay, which doubles the speed every time.
- A gradient shimmer in brand purple. The sweep is ink on grey.
- Adding a spinner next to the words.

Rebuild order:

1. Tokens, header, 2 × 2 card grid with a shared card anatomy.
2. A small card controller: `run()`, `done()`, a timer list, `data-state`.
3. The four loaders and their done states.
4. Per-card and global buttons, live region.
5. Reduced motion, then 820px and 640px rules.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
