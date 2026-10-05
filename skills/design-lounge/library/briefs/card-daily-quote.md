<!-- Design Lounge Nº 211 · "Daily quote card" · www.designlounge.live -->

# Daily quote card

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The home card of a small motivation app, "Dayleaf". One tall card holds the quote of the day, the author and the source, over a sky gradient that matches the reader's local time: dawn peach and rose, day butter to teal, dusk amber to plum, night navy with stars and a crescent moon. Two cards peek from behind it as a stack. You swipe it away for the next quote, save it with a bookmark, or open a share sheet with a square or story-sized image preview. The detail worth copying is that the four skies are registered colour properties on the root, so the card, the stack, the page tint and the share preview all crossfade together in 900ms from one attribute change.

## Structure

```
1280 × 800, content centred, page = soft vertical tint of the current sky
                ┌───────────────────────────────────────────┐
                │ Now 00:16  [Dawn] [Day] [Dusk] [Night]    │ pill, 40px
                └───────────────────────────────────────────┘
                              22px
        (‹)   ┌──────────────────────────────┐   (›)   44px round
              │ Dayleaf      NO. 277 · SUN 4 OCT│
              │                       ( moon ) │  card 420 × 520
              │ “                              │  radius 28px
              │ It is not that we have a short │  sky gradient 165°
              │ time to live, but that we      │
              │ waste a lot of it.             │
              │ ── Seneca  On the Shortness…   │
              │ ─────────────────────────────  │
              │ 1 of 6                 ▬ • • • │
              └──────────────────────────────┘
                 stack: 2 cards behind, +16px/.94 and +32px/.88
                              22px
                 [ ▯ Save 2 ]  [ ⇧ Share as image ]           44px pills
                 Swipe the card, or use ← → when it has focus 12px
```

- `div.stage`: a centred grid with a 22px gap and a 560px max width.
- `div.times[role=group]`: the clock `span` and four `aria-pressed` buttons, each with a 15px icon and a label.
- `div.deckrow`: a grid `44px minmax(0,420px) 44px` with a 20px gap. Prev button, `div.deck` (aspect 21:26), next button.
- `.deck` holds `div.card.b2`, `div.card.b1` (empty stack cards) and `article.card.top` (tabindex 0). The top card holds `.stars`, `.orb`, `.grain` and `.inner`. `.inner` holds `.meta`, `blockquote.q`, `p.by` (author and a `span` source), and `.foot` (position and pips).
- `div.actions`: the Save button (`aria-pressed`, label, count) and the Share button (`aria-haspopup="dialog"`).
- `div.scrim > div.sheet[role=dialog][aria-modal=true]`: header with `h2` and close, format group, `.pv-wrap > .pv[role=img]`, and two action buttons.
- A visually hidden polite live region.

Quotes, in order:

| # | Quote | Author | Source |
|---|-------|--------|--------|
| 1 | It is not that we have a short time to live, but that we waste a lot of it. | Seneca | On the Shortness of Life |
| 2 | The happiness of your life depends upon the quality of your thoughts. | Marcus Aurelius | Meditations |
| 3 | Forever is composed of nows. | Emily Dickinson | Poems, 1896 |
| 4 | A journey of a thousand miles begins beneath one's feet. | Lao Tzu | Tao Te Ching, 64 |
| 5 | Dwell on the beauty of life. Watch the stars, and see yourself running with them. | Marcus Aurelius | Meditations |
| 6 | Rather than love, than money, than fame, give me truth. | Henry David Thoreau | Walden |

Quotes 4 and 6 start saved.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| Sky, ink, page | time change | `--g1..3`, `--ink`, `--acc`, `--sun`, `--p1..2` | old → new period | 900ms | `--ease` | instant |
| Orb | time change | left, top | old spot → new spot | 900ms | `--expo` | instant |
| Stars | night on/off | opacity | 0 ↔ .8 | 900ms | `--ease` | instant |
| Card | drag | translateX, rotate | follows pointer, `dx/22` deg | 0 | — | same |
| Card | release < 100px | transform | → none | 420ms | `--expo` | instant |
| Card | swipe / arrow | translateX, rotate, opacity | 0 → ±130%, ±14°, 0 | 280ms | `cubic-bezier(.4,0,1,1)` | skipped |
| Card | new quote | translateY, scale, opacity | 16px, .94, 0 → 0, 1, 1 | 420ms / 300ms | `--expo` / `--ease` | instant |
| Pip | index | width, opacity | 6px, .35 → 18px, 1 | 300ms | `--expo` | instant |
| Save icon | save | scale | 1 → 1.35 → 1 | 380ms | `--expo` | none |
| Scrim | open | opacity | 0 → 1 | 240ms | `--ease` | instant |
| Sheet | open | translateY, scale | 24px, .98 → 0, 1 | 360ms | `--expo` | instant |
| Preview | format | aspect-ratio | 1 ↔ 9/16 | 360ms | `--expo` | instant |

## States

- **Auto:** no time button pressed, the clock pill says "Now". **Preview:** one button is pressed (ink fill, paper text) and the pill says "Preview".
- **Card focus-visible:** 2px `#1f1c19` outline, offset 3px.
- **Dragging:** cursor `grabbing`, transitions off.
- **Busy:** during the 280ms fly-out, more swipes and arrows are ignored.
- **Saved:** the pill turns ink with paper text, the icon is filled, the label reads "Saved". **Unsaved:** a 60% white pill with a 1px border.
- **Nav / action hover:** the background goes to white. **Active:** scale 0.92 for nav and 0.96 for pills.
- **Sheet open:** the page sits under a 48% scrim. Copy and Save show "Copied" / "Saved" after a press.
- **Stack cards:** their content is hidden. They show only the sky at 75% and 45% opacity with lower saturation.
- **Error:** not shown. If copying an image fails in a real product, set the button to "Copy failed" and keep the sheet open.

## Accessibility

- The top card is an `article` with `tabindex="0"`, `aria-roledescription="quote card"`, and a label that says swipe or arrows work. ← and → change the quote.
- Every quote change announces the quote, the author, and "Quote N of 6" in a polite live region.
- Prev and next are real buttons, "Previous quote" and "Next quote", so swiping is never the only way.
- Time buttons are `aria-pressed` toggles inside `role="group"` "Sky by time of day". Each has an `aria-label` such as "Dusk sky", so it keeps a name when its text label hides on phones.
- Save is `aria-pressed`, with a label such as "Saved quote. 3 saved".
- The share sheet is `role="dialog"` with `aria-modal`, labelled by its heading. Focus moves to Copy image on open and stays trapped. Esc closes it and focus returns to Share.
- The preview is `role="img"` with the full quote as its label.
- Contrast on the card: night ink on navy about 10:1, dusk cream on `#b84a3a` 4.7:1, dawn plum on rose about 6.5:1, day teal-black on teal about 8.5:1. If you add a period, test the ink against `--g2`, which is the darkest spot behind the text.
- Hit targets: nav 44px, action pills 44px, time buttons 32px tall inside a 40px pill, sheet close 40px.

## Responsive rules

- **≥ 1280:** the card is 420px wide (520px tall). Nav buttons sit 20px either side.
- **1024 / 768:** unchanged. The stage is at most 560px wide.
- **< 640:** nav buttons hide (swipe and keyboard stay). The card fills the width up to 420px. The quote drops to 24px and its mark to 72px. Card padding is 22px. The orb is 90px. Time buttons show icons only, and the clock hides.
- **Sheet:** `min(440px, 100%)` wide with 20px of page padding. The preview well is 300px tall and the preview 260px tall.
- Nothing scrolls sideways at 375px.

## Acceptance checklist

### Always

- [ ] The sky follows the local hour, and a manual preview can override it and then return to Auto.
- [ ] Every period change crossfades the card, the stack, the page and the share preview together.
- [ ] Swipe past 100px changes the quote; less springs back. Buttons and arrow keys do the same.
- [ ] A changed quote enters from the second stack slot.
- [ ] Save is a pressed toggle with a count and a live announcement.
- [ ] The share sheet is a modal dialog with a focus trap, Esc to close, and focus return.
- [ ] The preview reflects the current quote and sky, in both 1:1 and 9:16.
- [ ] Reduced motion removes the fly-out, the crossfade, and the pop.
- [ ] No image files. The sky, sun, moon, and stars are CSS.

### This demo

- [ ] Six quotes, starting with Seneca. Quotes 4 and 6 are saved, so the count is 2.
- [ ] Card 420 × 520, radius 28px, gradient at 165°. Stack offsets are 16px/0.94 and 32px/0.88.
- [ ] Night sky `#0f1a33 → #1e3358 → #3b4f7a` with a `#e9c46a` crescent. Dusk is `#f4b05a → #b84a3a → #4e2a46`.
- [ ] The quote is Young Serif 32px/1.18 with a 96px accent mark. UI text is Figtree.
- [ ] The meta shows the day-of-year number and the short date.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: the card shows quote 1 of 6, Seneca, with the sky for the current local hour. 05–10 is dawn, 10–16 day, 16–20 dusk, 20–05 night. The pill above reads "Now HH:MM". No time button is pressed. The save count reads 2.
2. The card meta reads "Dayleaf" on the left and "No. <day of year> · <Sun 4 Oct>" on the right, computed from today.
3. Press a time button (Dawn, Day, Dusk, Night): the sky crossfades in 900ms. The sun or moon slides to that period's spot. Stars fade in only at night. The pill reads "Preview HH:MM" and the button is pressed. Press the pressed button again to return to Auto.
4. The clock refreshes every 30 s. In Auto, crossing a period boundary changes the sky by itself.
5. Drag the card sideways: it follows the pointer and rotates `dx / 22` degrees. Release beyond 100px: it flies out (130% of its width, 14° rotation, 280ms, accelerating). Left goes to the next quote, right to the previous. Under 100px it springs back in 420ms.
6. After a fly-out the card reappears in the second stack slot (translateY 16px, scale 0.94, invisible) with the new quote and rises to the top in 420ms. That reads as the stack moving up.
7. The round arrow buttons on either side, and ← / → while the card has focus, do the same as a swipe. Quotes wrap from 6 back to 1.
8. The pips under the quote show the position. The current pip widens from 6px to 18px in 300ms. "1 of 6" updates.
9. Save toggles the bookmark for the current quote. When saved, the button fills ink with paper text, the label reads "Saved", the icon fills and pops to 1.35 and back in 380ms, and the count updates.
10. "Share as image" opens a modal sheet, "Share today's leaf". It holds a format toggle (Square 1:1, Story 9:16), a preview on a checkerboard well, and two buttons: Copy image and Save PNG. The preview uses the same live sky, the quote, and "AUTHOR · DAYLEAF NO. 277".
11. Story 9:16 changes the preview's aspect ratio in 360ms. The text drops from 19px to 15px.
12. Copy image changes its label to "Copied". Save PNG changes to "Saved". Both announce through a live region. Closing the sheet resets the labels.
13. Esc, the close button, or a click on the scrim closes the sheet. Focus returns to the Share button. Tab cycles inside the sheet.
14. With reduced motion, the sky changes at once and the card swaps without flying. There is no pop and no slide. The content is the same.

## Tokens

```css
/* registered so they can tween */
@property --g1  { syntax: "<color>"; inherits: true; initial-value: #0f1a33; }
@property --g2  { syntax: "<color>"; inherits: true; initial-value: #1e3358; }
@property --g3  { syntax: "<color>"; inherits: true; initial-value: #3b4f7a; }
@property --ink { syntax: "<color>"; inherits: true; initial-value: #f2ebdd; }
@property --acc { syntax: "<color>"; inherits: true; initial-value: #e9c46a; }
@property --sun { syntax: "<color>"; inherits: true; initial-value: #e9c46a; }
@property --p1  { syntax: "<color>"; inherits: true; initial-value: #e6e8ef; }
@property --p2  { syntax: "<color>"; inherits: true; initial-value: #c3cadc; }

:root {
  --serif: "Young Serif", Georgia, serif;
  --sans: "Figtree", system-ui, sans-serif;
  --chrome-ink: #1f1c19;      /* pills, buttons, sheet text */
  --chrome-ink-2: #4b443d;    /* unpressed time labels, hint */
  --sheet: #f7f3ec;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-sky: 900ms;
  --radius-card: 28px;
  transition: --g1 var(--t-sky) var(--ease), --g2 var(--t-sky) var(--ease), --g3 var(--t-sky) var(--ease),
              --ink var(--t-sky) var(--ease), --acc var(--t-sky) var(--ease), --sun var(--t-sky) var(--ease),
              --p1 var(--t-sky) var(--ease), --p2 var(--t-sky) var(--ease);
}
/* sky g1 → g2 → g3, card ink, quote-mark accent, sun or moon, page tint top → bottom */
:root[data-t=dawn]  { --g1:#f6c9a8; --g2:#e7a3a6; --g3:#a4b8d8; --ink:#3a2230; --acc:#b5413f; --sun:#ffe0bf; --p1:#fbeee4; --p2:#efd3d2; }
:root[data-t=day]   { --g1:#fbe7b2; --g2:#a3d5cf; --g3:#4d97b3; --ink:#12303a; --acc:#b85a1e; --sun:#fff1bd; --p1:#fbf4df; --p2:#cfe6e0; }
:root[data-t=dusk]  { --g1:#f4b05a; --g2:#b84a3a; --g3:#4e2a46; --ink:#fff4e6; --acc:#ffd38a; --sun:#ffd38a; --p1:#fbe6cc; --p2:#ecc0ae; }
:root[data-t=night] { --g1:#0f1a33; --g2:#1e3358; --g3:#3b4f7a; --ink:#f2ebdd; --acc:#e9c46a; --sun:#e9c46a; --p1:#e6e8ef; --p2:#c3cadc; }
```

Card: `background: linear-gradient(165deg, var(--g1), var(--g2) 55%, var(--g3))`, shadow `0 1px 0 rgba(255,255,255,.35) inset, 0 24px 50px -18px rgba(31,20,30,.45)`. Page: `linear-gradient(var(--p1), var(--p2))` under a white radial glow at the bottom. The grain is `radial-gradient(rgba(255,255,255,.08) .6px, transparent .8px)` at 3px with `mix-blend-mode: overlay`.

Orb (120px): dawn at `left 60%, top 24%`. Day at `62%, -44px` (it hangs off the top edge). Dusk at `68%, 15%`. Night at `66%, 62px`, drawn as a crescent: `radial-gradient(circle at 64% 40%, transparent 38%, var(--sun) 39%)`. Suns use `radial-gradient(circle at 40% 38%, color-mix(in srgb, var(--sun) 40%, #fff), var(--sun) 62%)` and a 70px glow.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Quote | Young Serif | 32px | 400 | 1.18 | -0.01em | sentence, `text-wrap: balance` |
| Opening mark “ | Young Serif | 96px | 400 | 0.6 | 0 | in `--acc` |
| Wordmark on card | Young Serif | 18px | 400 | 1 | 0 | title |
| Card meta | Figtree | 12px | 600 | 1 | 0.08em | UPPER |
| Author / source | Figtree | 14px | 600 / 400 | 1.5 | 0 | title |
| Position, pips | Figtree | 12px | 400 | 1 | 0 | tabular numerals |
| Time pill | Figtree | 13px | 600 | 1 | 0 | title; clock 12px/500 tabular |
| Action pills | Figtree | 14px | 600 | 1 | 0 | sentence |
| Sheet title | Young Serif | 20px | 400 | 1 | 0 | sentence |
| Preview quote | Young Serif | 19px (story 15px) | 400 | 1.2 | 0 | sentence |
| Preview credit | Figtree | 10px | 600 | 1.4 | 0.08em | UPPER |

## Implementation notes

**One attribute drives every colour.** Register the colours, put the transition on `:root`, and switch `data-t`. Descendants inherit the colours while they tween. You do not need a per-element transition or a second gradient layer to crossfade.

```js
function period(h) {
  return h >= 5 && h < 10 ? 'dawn' : h >= 10 && h < 16 ? 'day' : h >= 16 && h < 20 ? 'dusk' : 'night';
}
function setTime(t, isAuto) {
  document.documentElement.dataset.t = t;
  auto = isAuto;
  timeButtons.forEach(b => b.setAttribute('aria-pressed', !isAuto && b.dataset.t === t));
}
setInterval(() => { if (auto) setTime(period(new Date().getHours()), true); }, 30000);
```

A gradient can't be transitioned, but its colour stops can be once they are registered `<color>` properties. Without `@property` the sky snaps.

**The fly-out, then a re-entry from the stack.** Animate out, swap the content, jump to the second slot with transitions off, force a reflow, and release:

```js
card.style.transition = 'transform 280ms cubic-bezier(.4,0,1,1), opacity 280ms';
card.style.transform = `translateX(${out * 130}%) rotate(${out * 14}deg)`;
card.style.opacity = '0';
setTimeout(() => {
  index = (index + dir + quotes.length) % quotes.length; fill();
  card.style.transition = 'none';
  card.style.transform = 'translateY(16px) scale(.94)'; card.style.opacity = '0';
  void card.offsetWidth;                     // commit the jump
  card.style.transition = card.style.transform = card.style.opacity = '';
}, 280);
```

**Swipe with `touch-action: pan-y`** on the card. Vertical scrolling still works on phones, and horizontal drags reach your pointer handlers. Capture the pointer on pointerdown.

Common mistakes:

- Recomputing the sky from the clock in Preview mode, so the reader's choice flips back.
- One gradient for all times with a dark overlay at night. Each period has its own ink, and a light quote on dawn peach fails contrast.
- Putting the sun behind the quote text. Keep the orb in the upper-right band and off the text block.
- A purple-to-blue "night" gradient. Night here is navy with an ochre moon.
- A share button that just copies a URL. The point is the image preview with a format choice.
- Leaving the stack cards' text visible behind the top card. Hide their content.
- Swipe as the only way to advance.

Rebuild order:

1. Register the colours, write the four period blocks, and set `data-t` from the hour.
2. Build the card (meta, quote, author, footer) and the two stack cards.
3. Add the orb positions, the night stars, and the grain.
4. Add swipe, buttons, keys, the fly-out with re-entry, and the pips.
5. Add Save with its count and pop.
6. Add the share sheet: dialog, focus trap, format toggle, preview, and button states.
7. Add the time pill, the clock tick, reduced motion, and the phone breakpoint.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
