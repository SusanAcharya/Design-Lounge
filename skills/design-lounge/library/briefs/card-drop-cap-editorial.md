<!-- Design Lounge Nº 230 · "Drop-cap editorial card" · www.designlounge.live -->

# Drop-cap editorial card

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A wide essay card for a fictional literary quarterly, The Lantern Review. The left panel holds the masthead strip, kicker, headline, italic standfirst, byline with a reading-time chip, and at the bottom a "Typeset in" tray that switches the whole card between three classic type pairings. The right panel is the opening of the essay set in two columns with a 1px column rule. It has a 96px ultramarine drop cap tile and a pull quote that spans both columns between hairline rules. The details worth copying: the drop cap is a decorated tile (hatch texture, inset hairline frame, a small diamond notch) that wipes down into place, and the pairing switch crossfades the type so the reflow never shows.

## Structure

```
1280 × 800 stage, padding 40, card max 1120 wide, 1px border, soft drop shadow
┌──────────── 340 ────────────┬──────────────────── 1fr ─────────────────────┐
│ THE LANTERN REVIEW   NO. 14 │ ┌────┐ he first ferry…    │ upper deck for…   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ │ T  │ …                  │ I rode it every…  │
│ ESSAYS · HARBOUR LIFE       │ └────┘ …                  │                   │
│ The quiet                   │ …                         │                   │
│ work of          46px       │ ───────────────────────────────────────────── │
│ ferries                     │ “  Nobody thanks a ferry for arriving…  27px  │
│ italic standfirst 17px      │    INES VARGA, DECKHAND…                      │
│ By Wren Hollis [◷ 10 min]   │ ───────────────────────────────────────────── │
│                             │ Ines starts at half…      │ reads the buoys…  │
│ TYPESET IN  Libre Bodoni/…  │ …                         │ …the work. ■      │
│ [ Aa ][ Aa ][ Aa ]          │ ───────────────────────────────────────────── │
│                             │ 2,140 words · excerpt       Continue reading →│
└─────────────────────────────┴───────────────────────────────────────────────┘
```

- `article.card` labelled by the `h1`. It is a 2-column grid: `340px minmax(0,1fr)`.
- `header.head` has padding 40/36/32, a right hairline, and is a flex column so the tray sits at the bottom (`margin-top: auto`).
- `.mast` is a flex row with a 2px ink bottom rule.
- `.type` wraps the `h1` and the standfirst. The body columns also carry `.type`; both fade together.
- `.pairs` is `role="radiogroup"`, a 3-column grid with a 1px ink border and 1px ink dividers. Each `button[role=radio]` shows "Aa" in its own display face over a 10px uppercase name.
- `.body` has padding 40/44/28. It holds `.cols` (CSS multi-column) and `.foot`.
- In `.cols`: `p` with the drop cap, `p`, `blockquote` (`column-span: all`), `p`, `p`.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Delay |
| --- | --- | --- | --- | --- | --- | --- |
| Drop cap tile | load, pairing change | clip-path | inset(0 0 100% 0) → inset(0) | 640ms | expo | 0 |
| Drop cap letter | same | opacity, translateY | 0, +14px → 1, 0 | 640ms | expo | 120ms |
| Type out | pairing click | opacity, translateY | 1, 0 → 0, 4px | 140ms | standard | 0 |
| Type in | 140ms later | opacity, translateY | 0, 4px → 1, 0 | 280ms | expo | 0 |
| Tray button | checked | background, colour | paper → ink | 140ms | standard | 0 |

Reduced motion: no fades and no cap wipe. The pairing swaps instantly.

## States

- Tray button hover: background `rgba(43,58,158,.07)`.
- Tray button checked: background `--ink`, text `--paper`.
- Tray button focus-visible: 2px accent outline, offset 2px, raised with `z-index: 1` so the shared borders don't cover it.
- Link hover: underline, offset 3px.
- During a swap, a second click restarts the timer. Only the last choice applies.

## Accessibility

- `article` with `aria-labelledby` on the headline. The headline is the `h1`. The pull quote is a `blockquote` with a `footer` attribution.
- Drop cap: the tile is `aria-hidden`, and a visually hidden "T" follows it, so screen readers read "The first ferry…" as one word.
- Tray: `role="radiogroup"` labelled by "Typeset in". Each radio has `aria-label="Old style: Palatino / Palatino"`, and its visible text is `aria-hidden` to avoid double reading.
- The spec readout is an `output` with `aria-live="polite"`.
- Keys: Tab reaches the checked pairing and then the link. Arrow keys cycle the pairings.
- Contrast on `#faf7f0`: ink 16:1, `--ink-2` 8.7:1, `--ink-3` 5.5:1, accent 8.9:1. Cream on the accent tile is 8.9:1.
- Tray buttons are at least 44px tall.

## Responsive rules

- ≥1280: as drawn.
- 1024: the same, and the body column narrows. Two columns stay.
- ≤980: the card stacks. The head panel goes on top, its right rule becomes a bottom rule, padding is 28/24, and the headline is 38px.
- ≤700: one text column. The pull quote is 23px with a 72px mark and 48px left padding.
- 375: no horizontal scroll. The drop cap stays 96px; the text wraps beside it for four lines.

## Acceptance checklist

### Always

- [ ] The body is two columns with a 48px gap and a 1px `--line` column rule.
- [ ] The pull quote spans both columns with `column-span: all` and has 1px ink rules above and below.
- [ ] The drop cap is a floated tile, 96px square, as tall as four 26px lines minus the top offset.
- [ ] The drop cap letter is hidden from assistive tech, and the real letter is in the text.
- [ ] The pairing switcher is a radiogroup with roving tabindex and arrow keys.
- [ ] Switching pairings crossfades (140ms out, 280ms in) and replays the cap wipe.
- [ ] UI labels keep one family. Only headline, standfirst, quote, cap and body change with the pairing.
- [ ] Reading time is computed from words ÷ 230 and rounded up.
- [ ] Reduced motion makes switches instant.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Masthead "The Lantern Review / No. 14", kicker "Essays · Harbour life", headline "The quiet work of ferries", byline Wren Hollis.
- [ ] Chip reads "10 min read". Footer reads "2,140 words · excerpt".
- [ ] Pull quote: "Nobody thanks a ferry for arriving. They only notice the morning it doesn't." Attribution: Ines Varga, deckhand, twenty-two years.
- [ ] Pairings in order: Didone & Gothic, Old style, Baskerville & Gill.
- [ ] Accent `#2b3a9e` on `#faf7f0` paper, stage `#e6e0d3`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: pairing "Didone & Gothic" (Libre Bodoni headlines, Libre Franklin body) is checked. The drop cap tile wipes in from the top over 640ms; its letter rises 14px and fades in, 120ms behind the tile.
2. The byline row reads "By Wren Hollis" and a chip with a clock icon reading "10 min read". The value is computed as `ceil(2140 / 230)`.
3. The body shows two balanced columns, then a full-width pull quote, then two more balanced columns. The last paragraph ends with a 9px ultramarine square end mark.
4. The footer row reads "2,140 words · excerpt" on the left and a "Continue reading" link with an arrow on the right.
5. Clicking a pairing in the tray fades the headline block and the body to 0 opacity and down 4px over 140ms. Then it swaps the font variables, replays the drop cap wipe, and fades back in over 280ms.
6. The tray label on the right updates to the pairing's spec ("Palatino / Palatino") through a polite live region.
7. Arrow keys inside the tray move and select (roving tabindex, wrapping). Only the checked pairing is tabbable.
8. Selecting the already-checked pairing does nothing.

## Tokens

```css
:root {
  --stage: #e6e0d3;
  --paper: #faf7f0;
  --ink: #1d1b18;
  --ink-2: #4b463e;
  --ink-3: #6a645a;
  --line: #d6cfc0;
  --accent: #2b3a9e;       /* ultramarine: drop cap, kicker, quote mark, end mark, link */
  --accent-ink: #faf7f0;

  --display: "Libre Bodoni", Didot, "Bodoni 72", serif;
  --body: "Libre Franklin", "Franklin Gothic Book", system-ui, sans-serif;
  --ui: "Libre Franklin", system-ui, sans-serif;   /* never changes with the pairing */

  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --t-out: 140ms;
  --t-in: 280ms;
  --t-cap: 640ms;

  --col-gap: 48px;
  --lh: 26px;              /* body line box; the cap is sized against it */
  --cap: 96px;
}
```

Pairings override `--display` and `--body` on `body[data-pair]`:

| id | Name | Display | Body | Body size | `--cap-y` |
| --- | --- | --- | --- | --- | --- |
| `didone` | Didone & Gothic | Libre Bodoni | Libre Franklin | 15.5px | 4px |
| `old` | Old style | Palatino Linotype, Palatino, Book Antiqua | same | 16.5px | 2px |
| `trans` | Baskerville & Gill | Baskerville, Libre Baskerville, Georgia | Gill Sans, Gill Sans MT, Seravek, Optima | 16px | 6px |

Only the first pairing loads from Google Fonts (two-family limit). The other two use system stacks that exist on macOS and Windows. If the reader's stack can load more fonts, use EB Garamond for Old style and Libre Baskerville + Gill-like Lato for the third.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Masthead strip | `--ui` | 11px | 600 | 1 | .16em | upper |
| Kicker | `--ui` | 11px | 600 | 1 | .18em | upper, accent |
| Headline | `--display` | 46px | 400 | 1.02 | -.015em | sentence |
| Standfirst | `--display` italic | 17px | 400 | 1.45 | 0 | sentence, `--ink-2` |
| Byline | `--ui` | 12px | 500 (name 600) | 1.4 | 0 | — |
| Body | `--body` | 15.5px (per pairing) | 400 | 26px fixed | 0 | — |
| Drop cap | `--display` | 84px | 400 | 1 | 0 | upper |
| Pull quote | `--display` italic | 27px | 400 | 1.25 | -.005em | max 30ch |
| Quote mark | `--display` | 88px | 400 | 1 | 0 | accent |
| Attribution | `--ui` | 11px | 600 | 1 | .14em | upper |
| Tray "Aa" | each pairing's display | 26px | 400 | 1 | 0 | — |
| Tray name | `--ui` | 10px | 500 | 1.2 | .06em | upper |

Body paragraphs after the first get `text-indent: 1.4em` and a 13px bottom margin (half a line). `hyphens: auto`, ragged right.

## Implementation notes

**1. The decorated drop cap.** A floated element, not `::first-letter`. This keeps the tile the same size in every pairing, because cap heights differ a lot between Bodoni, Palatino and Baskerville. Nudge the letter per pairing with `--cap-y`.

```css
.cap {
  float: left; width: 96px; height: 96px; margin: 5px 16px 4px 0;
  position: relative; display: grid; place-items: center;
  background: var(--accent) repeating-linear-gradient(45deg, rgba(250,247,240,.09) 0 1px, transparent 1px 6px);
  color: var(--accent-ink); font: 400 84px/1 var(--display);
  animation: capIn 640ms var(--expo) both;
}
.cap::before { content: ""; position: absolute; inset: 5px; border: 1px solid rgba(250,247,240,.55); }
.cap::after  { content: ""; position: absolute; width: 8px; height: 8px; left: 50%; bottom: 1px;
               background: var(--paper); transform: translateX(-50%) rotate(45deg); }
.cap span    { position: relative; transform: translateY(var(--cap-y, 4px)); }
@keyframes capIn { from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0); } }
```

```html
<p><span class="cap" aria-hidden="true"><span>T</span></span><span class="sr">T</span>he first ferry…</p>
```

**2. Replaying the cap animation.** Set `animation: none`, force a reflow, then clear it. Do this in the same tick as the font swap, while the type is invisible.

```js
cap.style.animation = "none"; void cap.offsetWidth; cap.style.animation = "";
```

**3. Pairing swap without visible reflow.** Fade out first, swap the variables while opacity is 0, then fade in.

```js
types.forEach(t => t.classList.add("swap"));          // opacity 0, translateY 4px, 140ms
setTimeout(() => {
  document.body.dataset.pair = PAIRS[i].id;           // --display / --body change here
  replayCap();
  types.forEach(t => t.classList.remove("swap"));     // back in over 280ms
}, 140);
```

Common mistakes:

- Using `::first-letter` with `initial-letter`. Support is uneven and the tile can't hold the frame and notch.
- Setting body line-height as a unitless ratio. Use a fixed 26px so the 96px cap lines up with four lines in every pairing.
- Letting the UI labels (kicker, tray, byline) change family. They are chrome, not the essay.
- Forgetting `column-span: all` on the quote. Without it, the quote is squeezed into one column.
- Justified text in narrow columns without hyphenation. Keep it ragged right.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
