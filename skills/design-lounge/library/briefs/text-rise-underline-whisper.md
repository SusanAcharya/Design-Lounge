<!-- Design Lounge Nº 267 · "Headline rise with drawn underline" · www.designlounge.live -->

# Headline rise with drawn underline

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Studied from acharyasusan.com.np: the hero headline intro, where two serif lines rise into place one after the other and, a beat later, a rough hand-drawn stroke underlines the one italic word, next to a faint italic aside that only comes up when you hover it. This rebuild isolates that sequence on a light editorial page for **Vessa Rooms**, a fictional restoration practice in Porto. A cue sheet at the bottom shows when each part starts, with a playhead, a replay button, three headline takes and a "Slow ×4" switch, so the timing can be studied. The feeling is calm and confident: nothing bounces, and the underline is the one moment of hand-made warmth. The detail worth copying is the gap: lines land by about 1060ms, and the underline waits until 1000ms, so it reads as a second thought, not part of the entrance.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────┐
│ Vessa Rooms•                                 RESTORATION PRACTICE, PORTO │ 76px, hairline under
│                                                                        │
│ ── HOUSES BROUGHT BACK SINCE 2014                                      │
│ Rooms that keep                      ← h1 98px / .95                   │
│ the light longer.                                                      │
│     ‾‾‾‾‾ drawn underline (cobalt)                  ───────────────── │
│ A four-person practice…  31 … 9 …                   We spend the first │
│                                                     week only…  (aside)│
├──────────────────────────────────────────────────────────────────────┤
│ (↻ Replay) (1|2|3)  ●─●───────────────●──●────●─────────  2100 ms (Slow ×4) │ cue sheet
└──────────────────────────────────────────────────────────────────────┘
```

- `header.bar` with `span.logo` and `span.meta`.
- `main > div.wrap > div.grid#stage`: the copy column (`p.kicker`, `h1#h`, `p.sub`) and `p.note[tabindex=0]`.
- `h1` holds two `span.line > span` wrappers; the second contains `span.ul > em + svg`.
- `section.cues[aria-label="Intro timing"]`: `div.ctrl` (`button#replay`, `div.takes[role=radiogroup]` with three `button[role=radio]`), `div.track[aria-hidden]` (`div.rail`, `div.head`, five `div.cue[data-t]`), `div.ctrl` (`span#time`, `button#slow[aria-pressed]`).
- The intro runs whenever `body` gets the class `play`. Replay = remove the class, force a reflow, add it again.

## Motion

| Element | Trigger | Property | From → to | Duration | Easing | Delay | Reduced motion |
|---|---|---|---|---|---|---|---|
| Kicker | `.play` | opacity, translateY | 0, 18px → 1, 0 | 700ms × k | `--ease` | 0 | shown |
| Line 1 | `.play` | opacity, translateY | 0, .35em → 1, 0 | 900ms × k | `--ease` | 0 | shown |
| Line 2 | `.play` | same | same | 900ms × k | `--ease` | 160ms × k | shown |
| Underline | `.play` | stroke-dashoffset | 220 → 0 | 800ms × k | `--ease` | 1000ms × k | drawn |
| Paragraph | `.play` | opacity, translateY | 0, 18px → 1, 0 | 700ms × k | `--ease` | 1150ms × k | shown |
| Aside note | `.play` | opacity, translateY | 0, 18px → 1, 0 | 700ms × k | `--ease` | 1400ms × k | shown |
| Playhead | `.play` | scaleX from left | 0 → 1 | 2100ms × k | linear (it is a clock) | 0 | full |
| Cue dots | playhead passes | background, border | white/grey → cobalt | 150ms | ease | — | all filled |
| Aside note | hover / focus | color, border-color | 32% → 92% ink | 500ms | ease | — | instant |
| Buttons | hover | background, translateY | → ink fill, −2px | 200ms / 250ms | `--ease` | — | instant |

All `forwards` fill mode, so nothing snaps back after the intro.

## States

- **Replay button**: 44px pill, 1px ink border. Hover: ink fill, card text, lift 2px. Active: scale 0.97.
- **Takes**: a 3px-padded pill track on card. The checked take is an ink pill with card text; others are ink-2. Hover on an unchecked take: `--accent-soft` fill.
- **Slow ×4**: `aria-pressed="false"` looks like Replay. Pressed: cobalt fill and border, white text.
- **Cue dot**: idle 12px circle, card fill, 2px ink-3 border, label ink-3. Hit: cobalt fill and border, label ink.
- **Aside note**: rest 32% ink (decorative), hover/focus 92% ink and full cobalt rule. On touch (`hover: none`) it rests at 62%.
- **Replay mid-intro**: pressing Replay (or picking a take) while the intro is still running cancels it and starts again from the hidden state. The readout resets to 0 ms and all cue dots clear.
- **Slow ×4 mid-intro**: the switch also restarts, so the new speed applies from the first frame.
- **Focus-visible**: 2px cobalt outline, 3px offset, on every control and on the note.

## Accessibility

- The headline is a real `h1`. The underline SVG inside it is `aria-hidden`. Swapping takes replaces the h1 text; that is a user action, so no live announcement is needed.
- The takes are `role="radiogroup"` with `role="radio"` buttons and `aria-checked`. Only the checked one is in the tab order (roving tabindex). Arrow keys move and select, and replay the intro.
- Slow ×4 is a toggle button with `aria-pressed`.
- The cue track is `aria-hidden`; it is a visual aid. The readout is `aria-hidden` too, so it does not chatter.
- The aside note is focusable (`tabindex="0"`) so keyboard users can raise it.
- Contrast: ink on chalk about 14:1; ink-2 paragraph about 7.5:1; cobalt on chalk about 6:1. The resting aside note is low contrast on purpose. Do not put essential words in it.
- Targets: Replay and Slow are 44px tall; takes are 40×36px.

## Responsive rules

- **≥ 1280**: two-column grid (copy max 44rem, note at right, bottom aligned).
- **1024**: same, headline scales with `7.6vw`.
- **≤ 980**: one column; the note sits under the paragraph, left aligned.
- **≤ 760**: meta text hides; main aligns to the top with 36px padding. The cue sheet becomes two rows: controls on top (Replay + takes at left, Slow at right), the track full width below. Cue labels and the ms readout hide; dots and playhead remain. Buttons use 14px side padding.
- **375**: headline lands at 48px over two lines. No horizontal scroll.

## Acceptance checklist

**Always**
- [ ] Headline lines are separate wrappers; line 2 starts 160ms after line 1; each rises 0.35em over 900ms.
- [ ] The underline is an SVG path with dasharray/dashoffset 220, drawn from 1000ms to 1800ms.
- [ ] The paragraph starts at 1150ms and the aside at 1400ms, each rising 18px over 700ms.
- [ ] Every reveal uses `cubic-bezier(.22,1,.36,1)` with `forwards` fill.
- [ ] Replay fully resets to hidden and re-runs (class off, reflow, class on).
- [ ] A single multiplier variable scales every duration and delay.
- [ ] Takes behave as a radio group with arrow-key support.
- [ ] Cue labels never overlap at 1280 (alternate above and below).
- [ ] Reduced motion: everything visible at once, underline drawn, all cues filled.
- [ ] No horizontal scroll at 375px.

**This demo**
- [ ] Wordmark "Vessa Rooms" with a 7px cobalt dot.
- [ ] Take 1 reads "Rooms that keep / the *light* longer."
- [ ] Paragraph has bold "31" and "9".
- [ ] Cue labels read "Line 1 · 0", "Line 2 · 160", "Underline · 1000", "Sub · 1150", "Note · 1400".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame (1280×800): chalk page, a 76px top bar with the wordmark "Vessa Rooms" plus a small cobalt dot, and "RESTORATION PRACTICE, PORTO" in caps at right.
2. Main area, vertically centred: a cobalt kicker with a 28px rule ("HOUSES BROUGHT BACK SINCE 2014"), the headline "Rooms that keep" / "the *light* longer.", and a 17px paragraph with bold numbers. At right, bottom-aligned, the aside note in faint italic serif with a cobalt hairline above.
3. On load the intro plays once:
   - 0ms: kicker fades up 18px (700ms). Line 1 rises 0.35em and fades in (900ms).
   - 160ms: line 2 does the same (900ms).
   - 1000ms: the underline under the italic word draws left to right (800ms).
   - 1150ms: the paragraph fades up 18px (700ms).
   - 1400ms: the aside note fades up 18px (700ms) to its faint resting colour.
4. The cue sheet below shows a 2px rail with five cue dots placed by time over a 2100ms span (0%, 7.6%, 47.6%, 54.8%, 66.7%). Labels alternate below and above the rail so close cues never collide. A cobalt playhead fills the rail from left to right over 2100ms. Each dot fills cobalt when the playhead passes it. A mono readout counts "0 ms" up to "2100 ms".
5. **Replay** re-runs the whole sequence from the hidden state.
6. **Takes 1 / 2 / 3** (a radio group) swap the headline and replay:
   - 1: "Rooms that keep" / "the *light* longer."
   - 2: "We draw the stair" / "*before* the facade."
   - 3: "Old walls, new" / "*reasons* to stay."
7. **Slow ×4** (toggle) multiplies every duration and delay by 4 and replays. The playhead and readout slow with it; the readout still counts in real-time-equivalent milliseconds (0 → 2100).
8. Hovering or focusing the aside note raises it from 32% to 92% ink and turns its rule full cobalt over 500ms.

## Tokens

```css
:root {
  /* colour */
  --chalk: #f3eee4;        /* page */
  --card: #fbf8f2;         /* cue sheet, chip fill */
  --ink: #1e2633;          /* headline, text */
  --ink-2: #4a5263;        /* paragraph */
  --ink-3: #7c8292;        /* meta, idle cue labels */
  --line: rgba(30,38,51,.14);
  --accent: #2f55c8;       /* cobalt: italic word, underline, kicker, playhead */
  --accent-soft: rgba(47,85,200,.1);
  --note-rest: rgba(30,38,51,.32);
  --note-on: rgba(30,38,51,.92);

  /* type */
  --serif: "Cormorant Garamond", Georgia, serif;
  --sans: "Karla", system-ui, sans-serif;

  /* motion */
  --ease: cubic-bezier(.22, 1, .36, 1);
  --k: 1;                  /* time multiplier: 1 normal, 4 slow */
  --t-line: 900ms;   --t-line-gap: 160ms;
  --t-draw: 800ms;   --t-draw-at: 1000ms;
  --t-up: 700ms;     --t-sub-at: 1150ms;  --t-note-at: 1400ms;
  --t-span: 2100ms;  /* cue sheet length */
}
```

The page also has two soft background washes on a fixed `body::before`: `radial-gradient(ellipse 70% 60% at 90% 0%, rgba(47,85,200,.07), transparent 60%)` and `radial-gradient(ellipse 50% 50% at 0% 100%, rgba(196,160,110,.14), transparent 60%)`.

## Typography

| Role | Family | Size | Weight | Line-height | Letter-spacing | Case |
|---|---|---|---|---|---|---|
| Headline | Cormorant Garamond | clamp(48px, 7.6vw, 98px) | 500 | 0.95 | −0.03em | Sentence |
| Italic word | Cormorant Garamond italic | inherit | 600 | inherit | inherit | lower, cobalt |
| Kicker | Karla | 11px | 700 | 1 | 0.18em | UPPER, cobalt |
| Paragraph | Karla | 17px | 400 (numbers 700) | 1.6 | 0 | Sentence |
| Aside note | Cormorant Garamond italic | 19px | 500 | 1.45 | 0 | Sentence |
| Wordmark | Cormorant Garamond | 24px | 600 | 1 | −0.01em | Title |
| Meta | Karla | 11px | 700 | 1 | 0.18em | UPPER |
| Buttons | Karla | 14px | 700 | 1 | 0 | Sentence |
| Cue labels | Karla | 11px | 500 | 1 | 0 | Sentence |
| Readout | Karla | 12px | 700, tabular | 1 | 0 | — |

## Implementation notes

1. **The whole intro is CSS behind one class.** Keep the resting state visible (so no-JS and reduced-motion users see the headline). Only under `.play` do elements start hidden and animate in. That way there is never a flash of missing text.

```css
.play h1 .line > span {
  display: block; opacity: 0; transform: translateY(.35em);
  animation: lineup calc(900ms * var(--k)) var(--ease) forwards;
}
.play h1 .line:nth-child(2) > span { animation-delay: calc(160ms * var(--k)); }
.play .ul path {
  stroke-dashoffset: 220;
  animation: draw calc(800ms * var(--k)) var(--ease) calc(1000ms * var(--k)) forwards;
}
@keyframes lineup { to { opacity: 1; transform: none; } }
@keyframes draw   { to { stroke-dashoffset: 0; } }
```

2. **Replay by restarting the class.** Removing and re-adding a class in the same frame does nothing; read a layout property in between.

```js
function run() {
  document.body.classList.remove('play');
  void document.body.offsetWidth;   // force reflow so animations restart
  document.body.classList.add('play');
}
```

3. **The underline markup.** A short, slightly wavy cubic path in a 200×20 box, stretched to the word with `preserveAspectRatio="none"`. Position it under the word, a little wider than it.

```html
<span class="ul"><em>light</em>
  <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
    <path d="M4 13C40 5 90 4 130 9s52 6 66 1"/>
  </svg></span>
```

```css
.ul { position: relative; display: inline-block; }
.ul svg { position: absolute; left: -3%; bottom: -.02em; width: 106%; height: .17em; overflow: visible; }
.ul path { fill: none; stroke: var(--accent); stroke-width: 6; stroke-linecap: round; stroke-dasharray: 220; }
```

4. **Playhead readout.** Drive the dots and the ms counter from `performance.now()` divided by `k`, not from `setInterval`, so Slow ×4 stays in step with the CSS.

5. **Reuse the same rise for section heads.** The source site applies the 18px fade-up to every section as it scrolls into view. Use one observer, reveal once, and skip it entirely for reduced motion.

```css
.js .reveal    { opacity: 0; transform: translateY(18px); }
.js .reveal.in { animation: up 700ms var(--ease) forwards; }
```

```js
document.documentElement.classList.add('js');
const ok = !matchMedia('(prefers-reduced-motion: reduce)').matches;
if (ok && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}
```

6. **On a dark hero.** The same sequence works over an illustration: give the headline `text-shadow: 0 2px 30px` in the background colour at 60%, keep the underline in the accent at stroke-width 6–7, and drop the aside note to 30% of the light text colour.

7. **Choosing the italic word.** Underline one word only, and put it at the start of line 2, where the eye lands after the first line settles. A word of 4–7 letters works best; very short words make the stroke look like a tick, long ones make it look like a strike-through.

Common mistakes: putting the transform on the `.line` itself (use an inner span so the line box keeps its height), using `overflow: hidden` masks here (this piece fades and rises, it does not clip), and letting long first lines wrap so a single word sits alone on its own row.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
