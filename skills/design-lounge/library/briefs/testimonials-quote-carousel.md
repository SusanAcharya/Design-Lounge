<!-- Design Lounge Nº 155 · "Testimonials quote carousel" · www.designlounge.live -->

# Testimonials quote carousel

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A mid-page testimonials section for **Fieldnote**, a B2B field-research tool. One quote fills the viewport at a time: a 72px decorative opening mark, a 48px Newsreader sentence (one italic clay word), then a 40px initials disc and a name/role line. Controls sit on a single row: 44px prev/next squares and four 8px dots. It is a carousel, not a wall — the point is the scale of a single sentence and the quiet wrap from 04 back to 01. The first frame already shows quote 01.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────┐
│ ● Fieldnote     Product   Methods   Pricing          Request a seat  │ 56
├──────────────────────────────────────────────────────────────────────┤
│  01 / 04                                  WHAT TEAMS WRITE BACK      │ 36 pad
│                                                                      │
│  “                                                                   │ 72 mark
│  We stopped losing the week after                                    │
│  the site visit.                                                     │ 48 / 1.12
│                                                                      │
│  (PS) Priya Sen                                                      │
│       Research lead · Northline Labs                                 │
│                                                                      │
│  [←] [→]  ● ○ ○ ○                                                    │ 44 btns
└──────────────────────────────────────────────────────────────────────┘
  pad 72
```

- `<nav>` 56px: `.brand` (18px ring mark + word), `.links` of three `<a>`, `.cta` button.
- `<section aria-roledescription="carousel" aria-label="Customer quotes">` is a 3-row grid: `.head`, `.stage`, `.foot`.
- `.head`: `#n` current index + “ / 04”, `.kicker`.
- `.stage` holds four `<article class="slide">`. The on-slide is `position:relative` so the stage takes its height; others are `position:absolute; inset:0`.
- Each slide: decorative `.qmark`, `<blockquote><p>`, `.who` (`.av` + name/role).
- `.foot`: `#prev`, `#next`, `.dots` `role="tablist"` with four `role="tab"` buttons.
- `#live` is a clipped polite live region.

Quotes, in order:

| # | Sentence (italic word) | Name | Role · company | Disc |
|---|------------------------|------|----------------|------|
| 01 | We stopped losing the week *after* the site visit. | Priya Sen | Research lead · Northline Labs | `#2C5A45` PS |
| 02 | Four cities, one thread, tagged before the *debrief*. | Tomas Brekke | Operations · Harbor & Co | `#3D4A62` TB |
| 03 | Friday used to be transcripts. Now I leave the field *done*. | Elena Voss | Partner · Kite Field | `#B5522A` EV |
| 04 | The codebook stopped living in a *private* spreadsheet. | Jonah Ndiaye | Director of insight · Vale Civic | `#5A4638` JN |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Notes |
|---------|---------|----------|-----------|---------:|--------|-------|
| outgoing `.slide` | next/prev/dot | opacity, translateX | 1, 0 → 0, ±28px | 420ms | `--ease` | +28px if `data-dir="fwd"`, −28px if `back` |
| incoming `.slide` | same | opacity, translateX | 0, ∓28px → 1, 0 | 420ms | `--ease` | opposite start |
| lock | after `go()` | — | — | 430ms | — | ignore further `go()` until the clock ends |
| `.navbtn:active` | click | translateY | 0 → 1px | 0 | — | instant press |
| `.dot[aria-current]` | selection | background, scale | line-2, 1 → pine, 1.15 | 0 | — | instant |

Reduced motion: `.slide { transition-duration: 1ms; transform: none !important }`. Lock timeout becomes 1ms. No autoplay.

## States

- **Current slide:** `data-on="1"`, `opacity:1`, `position:relative`. Others `opacity:0`, `pointer-events:none`, `position:absolute`.
- **Nav button hover:** background and border `--ink`, icon `--bg`.
- **Nav button focus-visible:** 2px `--pine` outline, 3px offset. Same ring on brand, links, CTA, dots.
- **Nav button active:** `translateY(1px)`.
- **Dot current:** `--pine`, scale 1.15. Idle `--line-2`. Hover idle `--ink-2`.
- **CTA hover:** inverted fill.
- **CTA default:** 32px tall, 1px `--ink` border, transparent fill, 12px uppercase.

## Accessibility

- Section: `aria-roledescription="carousel"` and `aria-label="Customer quotes"`.
- Prev/next are real `<button>`s with `aria-label="Previous quote"` / `"Next quote"`.
- Dots: `role="tablist"`; each dot `role="tab"` and `aria-label="Quote N"`; the active one has `aria-current="true"`.
- Each dot has a 10px invisible `::after` hit pad so the 8px face is still a ≥28px target; the 44px nav buttons already clear 40px.
- `#live` (`aria-live="polite"`) announces “Quote N of 4, {Name}” after every change.
- Decorative quote marks are `aria-hidden="true"`.
- Keyboard: Tab through nav → prev → next → dots. ArrowLeft / ArrowRight change slides from anywhere on the page (`preventDefault` so the page does not scroll).
- Contrast: `--ink` on `--bg` is ~13:1; `--ink-2` on `--bg` is ~6.2:1; `--pine` on `--bg` is ~5.8:1; clay italic on paper is ~5.1:1.

## Responsive rules

- ≥ 1280: as specified, `--pad: 72px`, quote 48px, mark 72px.
- 1024–1279: `--pad: 40px`, quote 36px, mark 56px. Controls stay in one row.
- 768–1023: quote 28px, mark 48px. Nav links hide; brand and CTA remain.
- < 640: `--pad: 24px`. Quote stays 28px / 22ch. Stack `.who` under the quote (already does). Keep buttons 44px. Dots remain 8px with the 10px hit pad.

## Acceptance checklist

- [ ] First frame shows quote 01 at 48px Newsreader on `#EFE6D4`, index **01 / 04**, pine kicker on the right. Two or three lines, not one word per line.
- [ ] Exactly four quotes; Next from 04 wraps to 01; Prev from 01 wraps to 04.
- [ ] Slide is 420ms, 28px horizontal, `cubic-bezier(.2,.7,.2,1)`; a second click inside that window does nothing.
- [ ] One italic clay word per quote (`--clay` `#B5522A`, weight 600).
- [ ] Prev/next are 44×44px squares; active dot is pine at scale 1.15.
- [ ] ArrowLeft / ArrowRight change slides and do not scroll the page.
- [ ] Live region announces “Quote N of 4, {Name}”.
- [ ] Focus rings (2px pine, 3px offset) appear on brand, links, CTA, both buttons, and every dot.
- [ ] `prefers-reduced-motion: reduce` swaps instantly; wrap and announcement still work.
- [ ] No images, no emoji, no dummy copy, no amber-on-black palette.
- [ ] Demo starts with the piece header comment and fills 1280×800 without a vertical scrollbar.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: paper page, 56px nav (Fieldnote mark + Product / Methods / Pricing + “Request a seat”), then the section. Index reads **01 / 04**. Kicker on the right: “WHAT TEAMS WRITE BACK”. Quote 01 is on: “We stopped losing the week *after* the site visit.” Author Priya Sen, Research lead · Northline Labs, pine disc “PS”. Dot 1 has `aria-current="true"`.
2. Click Next (or press ArrowRight): quote 01 fades and slides 28px left over 420ms; quote 02 enters from 28px right. Index becomes **02 / 04**. Live region announces “Quote 2 of 4, Tomas Brekke”.
3. Click Prev (or press ArrowLeft) from 01: wraps to 04 (Jonah Ndiaye) with a reverse 28px slide. Index **04 / 04**.
4. Click a dot: jump to that quote. Direction is `back` if the target index is lower, `fwd` if higher.
5. Clicks during the 420ms lock are ignored so slides cannot stack.
6. Hover a nav square: fill `--ink`, icon `--bg`, border `--ink`. Hover a closed dot: `--ink-2`. Active dot is `--pine` at scale 1.15.
7. Hover “Request a seat”: invert to `--ink` fill, `--bg` text.
8. With `prefers-reduced-motion: reduce`, the slide duration is 1ms and transforms are forced to none; state still updates.

## Tokens

```css
:root {
  --bg: #efe6d4;          /* page */
  --paper: #f6efe2;       /* button faces */
  --ink: #1a241e;         /* primary text */
  --ink-2: #5a5648;       /* secondary */
  --ink-3: #8a8374;       /* index / meta */
  --line: #d4cbb8;        /* nav rule */
  --line-2: #c4b9a4;      /* button border, idle dots */
  --pine: #2c5a45;        /* kicker, active dot, focus, mark fill */
  --clay: #b5522a;        /* italic word in the quote */
  --mark: #d8cbb4;        /* giant opening quote */

  --serif: "Newsreader", Georgia, serif;
  --sans: "Work Sans", system-ui, sans-serif;

  --nav-h: 56px;
  --pad: 72px;
  --quote: 48px;
  --qmark: 72px;
  --btn: 44px;

  --t-fast: 160ms;
  --t-slide: 420ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Body / nav links | Work Sans | 13–14px | 400 | 1.45 | 0 | sentence |
| Brand | Work Sans | 15px | 600 | 1 | −0.02em | sentence |
| CTA | Work Sans | 12px | 500 | 1 | +0.04em | UPPERCASE |
| Index / kicker | Work Sans | 12px | 500 | 1 | +0.14–0.16em | UPPERCASE |
| Opening mark | Newsreader | 72px | 600 | 0.7 | −0.06em | — |
| Quote | Newsreader | 48px | 400 | 1.12 | −0.025em | sentence |
| Quote emphasis | Newsreader | 48px | 600 italic | 1.12 | −0.025em | sentence |
| Author | Work Sans | 15px | 500 | 1.2 | 0 | sentence |
| Role line | Work Sans | 13px | 400 | 1.3 | 0 | sentence |
| Avatar initials | Work Sans | 13px | 500 | 1 | +0.02em | UPPERCASE |

Quote measure is `max-width: 22ch` on the 48px `<p>` (not the blockquote — `ch` on a 14px parent is ~144px and wraps every word). The line breaks at two or three lines, never a full-bleed ribbon.

## Implementation notes

**Only the current slide is in flow.** Absolute-position the rest so the stage height equals the visible quote:

```css
.slide { position: absolute; inset: 0; opacity: 0; pointer-events: none; }
.slide[data-on="1"] { position: relative; opacity: 1; pointer-events: auto; }
```

**Direction on the outgoing card, then the incoming card.** Set `data-dir` on both, paint the incoming off-screen in one frame, then flip `data-on` on the next frame so the 28px travel runs:

```js
from.removeAttribute('data-on');
from.dataset.dir = dir;
next.dataset.dir = dir === 'back' ? 'fwd' : 'back';
requestAnimationFrame(() => { next.dataset.dir = dir; next.dataset.on = '1'; });
```

**Lock for 430ms** (1ms under reduced motion) so overlapping transitions cannot desync the index and the live region.

Common mistakes: using a horizontal scroller instead of one-quote-at-a-time; fading without the 28px travel; putting the giant quote mark in the accessibility tree; autoplaying (this piece does not); measuring `scrollWidth` when CSS already knows the active slide’s height.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
