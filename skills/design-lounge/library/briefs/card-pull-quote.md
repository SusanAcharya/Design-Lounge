<!-- Design Lounge Nº 375 · "Pull-quote testimonial card" · www.designlounge.live -->

# Pull-quote testimonial card

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

One testimonial at a time, set like a magazine pull quote on a dark olive card. A 300px solid chartreuse opening quote mark hangs off the card's top-left edge. A 220px outlined closing mark sits faint at the bottom right. The quote is 46px Gloock, and one phrase in it is the point of the testimonial. That phrase gets a highlighter sweep: a chartreuse block draws left to right across its lines, and the text inside turns dark as it lands. Below the quote are a monogram attribution, five segment indicators, and round prev/next buttons. It sits on a pricing or landing page for a fictional small-business bookkeeping app, Tallybook. The detail worth copying is the highlight: it runs line by line across wrapped text using one inline background, with no per-line markup.

## Structure

```
1280 × 800 stage, padding 56/48, card max 980, padding 64 72 40 152
   ██ ██   ← 300px “ at left 28, top −58 (overflows card)
┌──────────────────────────────────────────────────────────────┐
│            TALLYBOOK · FIELD NOTES FROM OWNERS       01 / 05 │
│                                                              │
│            We stopped losing Fridays to                      │
│            invoicing. ▓The books close▓            46px      │
│            ▓themselves by Thursday lunch,▓                   │
│            and I finally trust the number at                 │
│            the bottom.                                ”  ←220px outline
│            (PR)  Priya Raman                                 │
│                  Founder, Oak & Ember Joinery                │
│            ──────────────────────────────────────────────── │
│            ━━ ── ── ── ──      Use ← → to move     (←) (→)   │
└──────────────────────────────────────────────────────────────┘
```

- `section.card`: `tabindex="0"`, `aria-roledescription="carousel"`, `aria-label`. Both quote marks are absolutely positioned `span`s with `aria-hidden`.
- `.top` is a flex row: eyebrow, then counter (`aria-hidden`; the slide label carries the position).
- `div[aria-live=polite][aria-atomic=true]` wraps `figure.slide` (`aria-roledescription="slide"`, `aria-label="1 of 5"`). Inside: `blockquote > p` with one `mark`, and `figcaption.who` with monogram, name and role.
- `.bar` is a flex row with a top hairline: segment buttons (a group, max 260px), a hint, and the nav (two 48px round buttons).
- The 152px left padding gives the hanging mark its gutter. The quote measure is `max-width: 22ch`.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Delay |
| --- | --- | --- | --- | --- | --- | --- |
| Slide out | prev/next/segment/arrow | opacity, translateY | 1, 0 → 0, −10px | 200ms | standard | 0 |
| Slide in | after swap | opacity, translateY | 0, 14px → 1, 0 | 460ms | expo | 0 |
| Highlight | load, after swap | background-size | 0% 82% → 100% 82% | 720ms | expo | 260ms |
| Highlight text | same | colour | `--ink` → `--marker-ink` | 240ms | standard | 380ms |
| Segment | current change | background | `--line` → `--marker` | 200ms | standard | 0 |
| Button press | :active | transform, background | 1 → .94, marker fill | 120ms | standard | 0 |

Reduced motion: no slide transitions and no sweep. The highlight is drawn fully at once with dark text.

## States

- Segment resting: 2px `--line` bar inside a 24px-tall hit area. Hover: `--ink-3`. Current: `--marker`, `aria-current="true"`.
- Round button resting: 1px `--line` ring, cream icon. Hover: ring and icon go chartreuse. Active: chartreuse fill, dark icon, scale .94.
- Focus-visible everywhere: 2px chartreuse outline, offset 3px. The card itself uses offset 6px.
- Rapid clicks: each navigation clears the pending timers, so only the last target renders.

## Accessibility

- Carousel pattern: `section` with `aria-roledescription="carousel"` and a label; each slide is a `figure` with `aria-roledescription="slide"` and `aria-label="N of 5"`.
- The live region is `polite` and atomic, so the full new quote and attribution are read once.
- `mark` keeps its meaning for screen readers; the highlight colour is never the only carrier, because the words are the same.
- Buttons: "Previous testimonial", "Next testimonial"; segments: "Testimonial 3: Hanna Lindqvist".
- Keys: Tab moves card → segments → prev → next. Left/Right work anywhere inside the card.
- Contrast on `#1d2019`: cream 13.7:1, `--ink-2` 7.9:1, `--ink-3` 5.0:1. Dark text on chartreuse is 13.3:1.
- Nav buttons are 48px; segments are 24px tall and at least 40px wide.
- No autoplay. Nothing moves unless the user asks.

## Responsive rules

- ≥1280: as drawn.
- 1024: the card shrinks with the stage. The measure stays 22ch, so the quote is the same size.
- ≤900: the card padding becomes 72/24/28 and the open mark 200px at left 12, top −44. The closing mark is hidden, the quote is 30px, the hint is hidden, and body top padding is 72px so the mark has room.
- 375: no horizontal scroll. The counter stays on one line; the eyebrow wraps.

## Acceptance checklist

### Always

- [ ] One testimonial is visible. Prev/Next wrap and arrow keys work inside the card.
- [ ] The highlighted phrase is a single inline `mark`; its sweep crosses wrapped lines in reading order.
- [ ] The text inside the highlight switches to the dark ink after the sweep starts, and contrast stays at least 4.5:1 at the end.
- [ ] The slide has a fixed min-height; the card height doesn't change between quotes.
- [ ] The opening mark hangs outside the card edge, and the closing mark is outline-only and faint.
- [ ] Segment indicators are buttons with names, and the current one has `aria-current`.
- [ ] A polite live region announces the new quote.
- [ ] No autoplay.
- [ ] Reduced motion shows the highlight fully drawn without animation.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Five quotes, in order: Priya Raman, Tomás Ferreira, Hanna Lindqvist, Desmond Okafor, Mei Tanaka.
- [ ] Eyebrow "Tallybook · field notes from owners". Counter format "01 / 05".
- [ ] Quote 46px Gloock in `#edeadf` on `#1d2019`; marker `#d4ee4e`.
- [ ] Open mark 300px; close mark 220px, stroke `#3b4130`.
- [ ] Monograms are initials ("PR", "TF", …) in a 52px chartreuse ring.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: testimonial 1 of 5, Priya Raman. The counter reads "01 / 05" with "01" in chartreuse. The first segment is chartreuse, the other four are `--line`.
2. On load, the highlight on "The books close themselves by Thursday lunch," sweeps from 0% to 100% width over 720ms after a 260ms delay. The phrase's text colour goes from cream to `#191b16` over 240ms, starting 380ms in.
3. Clicking Next fades the slide out and up 10px over 200ms. It swaps content, then the slide fades in from 14px below over 460ms. The new highlight resets to 0% and redraws.
4. Prev and Next wrap: Next on 05 goes to 01.
5. Clicking a segment jumps straight to that testimonial with the same transition. Clicking the current one does nothing.
6. With focus anywhere in the card, Left and Right arrows act as Prev and Next.
7. The slide keeps a fixed 360px minimum height, so the card never changes height between quotes.
8. Prev/Next press: scale to .94 and fill chartreuse with dark icon while held.

## Tokens

```css
:root {
  --stage: #141611;
  --card: #1d2019;
  --line: #323729;
  --ink: #edeadf;
  --ink-2: #b4b5a3;
  --ink-3: #8d8f7c;
  --marker: #d4ee4e;       /* chartreuse: open mark, highlight, current segment, monogram ring */
  --marker-ink: #191b16;   /* text on the highlight */
  --ghost: #3b4130;        /* closing mark outline */

  --serif: "Gloock", Georgia, serif;
  --sans: "Albert Sans", system-ui, sans-serif;

  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --t-out: 200ms;
  --t-in: 460ms;
  --t-draw: 720ms;
  --d-draw: 260ms;
}
```

The stage has a soft top glow: `radial-gradient(120% 80% at 50% 0%, #1b1e17 0%, transparent 60%)`. There is no shadow on the card. A 1px `--line` border separates it.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Open mark | Gloock | 300px | 400 | 1 | — | `--marker` |
| Close mark | Gloock | 220px | 400 | .6 | — | transparent fill, 1.5px `--ghost` stroke |
| Eyebrow / counter | Albert Sans | 12px | 600 | 1 | .16em | upper, tabular numbers |
| Quote | Gloock | 46px | 400 | 1.16 | -.01em | max 22ch, `text-wrap: pretty` |
| Monogram | Gloock | 19px | 400 | 1 | — | in a 52px circle, 1.5px marker ring |
| Name | Albert Sans | 16px | 600 | 1.3 | 0 | `--ink` |
| Role | Albert Sans | 14px | 400 | 1.5 | 0 | `--ink-2` |
| Hint | Albert Sans | 12px | 400 | 1.5 | 0 | `--ink-3` |

## Implementation notes

**1. The line-by-line highlighter.** An inline element with the default `box-decoration-break: slice` lays its background out as if all its line fragments sat end to end. Growing `background-size` from 0% to 100% therefore fills line one, then line two. Don't set `clone`, or every line sweeps at once.

```css
mark {
  color: inherit;
  background: linear-gradient(var(--marker), var(--marker)) no-repeat 0 60% / 0% 82%;
  padding: 0 .08em; margin: 0 -.04em;
}
.drawn mark {
  background-size: 100% 82%;
  color: var(--marker-ink);
  transition: background-size 720ms var(--expo) 260ms,
              color 240ms var(--ease) 380ms;
}
```

**2. Replaying the sweep.** Remove `.drawn`, swap the content, force a reflow, then add `.drawn` back in the next frame. If you add it in the same frame, the browser skips the 0% state and nothing animates.

```js
fill(i);
slide.classList.remove("out", "drawn");
void slide.offsetWidth;
slide.classList.add("in");
requestAnimationFrame(() => slide.classList.add("drawn"));
```

**3. Hanging punctuation without overflow bugs.** The open mark is `position: absolute; left: 28px; top: -58px` on a card that does not clip (`overflow: visible`). The stage padding (56px top) leaves room for the 58px overhang. On mobile, the body gets 72px top padding for the same reason.

Common mistakes:

- A thin underline instead of a block highlight. At 46px it reads as a link or a strikethrough.
- Highlighting the whole quote. One phrase, about a third of the words.
- Fading the colour change in before the sweep. The dark text then sits on the dark card for a moment and becomes unreadable.
- Autoplay. A testimonial nobody can finish reading isn't social proof.
- Letting the card resize per quote, which moves the nav buttons under the cursor.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
