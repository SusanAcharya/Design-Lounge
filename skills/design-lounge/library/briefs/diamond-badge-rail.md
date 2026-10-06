<!-- Design Lounge Nº 221 · "Diamond badge rail" · www.designlounge.live -->

# Diamond badge rail

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Studied from f-list.cleancreatives.org: the "Introducing the F-Badges" block, a dark band of outlined cards that each wear a diamond-framed icon breaking the top border, scrolled sideways and tracked by a thick two-tone progress bar. This version is the badge glossary of a fictional watchdog index, Plainsight's Tracker Index, which tags data brokers with proven habits (Repeat seller, Opt-out maze, Shadow profile…). Eight 264×300 cards sit in a scroll-snap rail that bleeds off the right edge. Each card has a 56px diamond straddling its top border, a condensed uppercase title, a two-line definition, and a footer with the broker count. Hover lifts the card 4px, turns its border lime and spins the diamond a quarter turn as it fills lime. Clicking a card makes it the active filter: it gets a dark-lime fill and a lime ring, and the status line above the rail reads "Showing 48 brokers with Opt-out maze". Below the rail, a 6px scrubber shows how much of the rail is visible and where you are; drag it, click it, or use the arrow keys. The detail worth copying: the diamond is a rotated pseudo-element behind an unrotated icon, so the icon stays upright while the frame spins.

## Structure

```
1280 × 800, padding 60 / 56 / 44
┌──────────────────────────────────────────────────────────────────┐
│ Every broker                                                      │
│ earns its badges   (76px, "badges" lime)                          │
│ lede 520px wide                                [VIEW THE INDEX →]▌│
│                                                                   │
│ Showing 48 brokers with Opt-out maze  [Clear filter]              │
│   ◇            ◆            ◇            ◇            ◇           │ diamonds overlap top
│ ┌──────────┐ ┌══════════┐ ┌──────────┐ ┌──────────┐ ┌────────     │
│ │REPEAT    │ ║OPT-OUT   ║ │LOCATION  │ │BREACH    │ │SHADO…  →   │ cards 264 × 300, gap 20
│ │SELLER    │ ║MAZE      ║ │HOARDER   │ │VETERAN   │ │            │ rail bleeds right
│ │two lines │ ║…         ║ │…         │ │…         │ │            │
│ │61 · Filter│ ║48 · Filtering║ …                                   │
│ └──────────┘ └══════════┘ └──────────┘ └──────────┘ └────────     │
│ ███████████████████────────────────────────────────  [‹] [›]      │ scrubber 6px, arrows 44px
└──────────────────────────────────────────────────────────────────┘
```

- `section.wrap` labelled by the `h2`.
- `.head`: the `h2` (with an `em` for the lime word) and lede `p` on the left; `a.view` on the right.
- `.status`: a `span` with `aria-live="polite"` and `button.clear`.
- `ul.rail` with `tabindex="0"` and `aria-label="Badges"`: eight `li`, each holding one `button.card` with `aria-pressed`. Inside: `span.dia` (icon SVG), `h3`, `p`, `span.foot` (count + state word).
- `.scrub`: `div.track` with `role="slider"`, `tabindex="0"`, `aria-valuemin/max/now/text`, holding `div.thumb`; then two arrow `button`s.

## Motion

| Thing | Trigger | Property | From → To | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Card lift | hover / focus | translateY | 0 → −4px | 240ms `--expo` | none |
| Card border | hover / focus / pressed | border-color | `--line` → `--lime` | 200ms `--ease` | instant |
| Diamond frame | hover / focus | rotate, background | 45°, `--bg` → 135°, `--lime` | 400ms `--expo` / 200ms | colour only, no spin |
| Diamond icon | hover / focus | color, scale | `--ink`, 1 → `--lime-ink`, 1.08 | 200ms / 400ms | colour only |
| Thumb position | rail scroll | translateX | follows scroll | per frame | same |
| Thumb thickness | hover / focus / drag | height, top | 6px, 9 → 10px, 7 | 160ms `--ease` | instant |
| Arrow buttons | click | rail scrollLeft | ±2 cards | smooth | `behavior: auto` |
| View button | hover | translate, shadow | 0, 4px 4px → 2px 2px, 2px 2px | 160ms `--ease` | none |

## States

- Card resting: `--surface` fill, 1px `--line` border, diamond outlined in `--ink-2` on `--bg`.
- Card hover / focus-visible: lime border, lifted 4px, diamond solid lime with dark icon. Focus also shows the 2px lime outline, 3px offset.
- Card pressed (active filter): `--surface-on` fill, lime border plus 1px inset lime ring, diamond solid lime, footer word "Filtering" in lime.
- Only one card can be pressed. Pressing it again clears the filter.
- Status: "Showing all 214 brokers" or "Showing N brokers with Name". Clear filter only exists while a filter is on.
- Arrows: disabled at the ends at 30% opacity, no hover fill.
- Track: thickened thumb while hovered, focused or dragged.
- Empty and loading: not used; the badge list is static.

## Accessibility

- Each card is a real `button` with `aria-pressed`. Its accessible name is the title, definition and count, read in order.
- The rail is focusable (`tabindex="0"`) so keyboard users can scroll it with arrow keys natively; it has `aria-label="Badges"`.
- The track is `role="slider"` with `aria-valuenow` 0–100 and an `aria-valuetext` ("Start of list", "42% through the list", "End of list"). Arrow keys, Home and End work.
- Arrow buttons have `aria-label`s ("Previous badges", "Next badges"). Icons are `aria-hidden`.
- The status line is `aria-live="polite"`.
- Clear filter returns focus to the rail so focus is not lost when the button hides.
- Contrast: `#eef1ea` on `#161b1f` is about 15:1; `#9aa39c` on `#161b1f` about 6.6:1; `#11160a` on `#c5f04a` about 14:1.
- Hit targets: cards 264×300, arrows 44×44, track 24px tall.

## Responsive rules

- ≥1280: as specified; four and a half cards visible.
- 1024: the same; about three and a half cards visible. The cut card at the right edge is the scroll hint, so never let the last visible card align flush.
- <900: header stacks (headline 48px, lede, then the View button). Padding 40 / 20 / 32. Cards 236×290. The rail still bleeds right by the page padding.
- <640: about one and a half cards visible. Status line wraps; Clear filter never wraps internally.
- No horizontal page scroll at 375px: only the rail scrolls.

## Acceptance checklist

### Always

- [ ] Cards are buttons with `aria-pressed`; exactly zero or one is pressed.
- [ ] The diamond is a rotated pseudo-element; the icon inside stays upright.
- [ ] The diamond straddles the card's top border and is not clipped by the rail (rail has top padding).
- [ ] The rail snaps per card, hides its native scrollbar, and bleeds off the right edge.
- [ ] The scrubber thumb's width reflects the visible fraction and its position reflects scroll progress.
- [ ] The scrubber can be clicked, dragged and keyboard-operated; snapping is off during the drag.
- [ ] Arrow buttons disable at the ends.
- [ ] The status line is a polite live region and matches the pressed card.
- [ ] No rounded corners.
- [ ] No horizontal page scroll at 375px.

### This demo

- [ ] Headline "Every broker / earns its badges" with "badges" in `#c5f04a`.
- [ ] Eight cards in order: Repeat seller 61, Opt-out maze 48, Location hoarder 37, Breach veteran 22, Shadow profile 74, Minors' data 9, Index debut 31, On the rise 18.
- [ ] Opt-out maze is pressed in the first frame.
- [ ] Cards 264×300, gap 20, diamond 56px.
- [ ] Track 6px `#2c343a`, thumb lime.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: a 76px two-line headline "Every broker / earns its badges" with "badges" in lime, a 16px lede, and a "View the index" button with a hard 4px offset shadow on the right. Under it, the status line reads "Showing 48 brokers with Opt-out maze" with a Clear filter button, because Opt-out maze starts as the active filter. Four and a half cards are visible; the fifth is cut by the right edge.
2. The rail scrolls horizontally with `scroll-snap-type: x mandatory`; each card snaps at its start. The native scrollbar is hidden.
3. The scrubber thumb width is `track × clientWidth / scrollWidth`, minimum 48px. Its x is `(track − thumb) × scrollLeft / (scrollWidth − clientWidth)`. It updates on every rail scroll frame.
4. Pointer down anywhere on the track jumps the rail so the thumb centres on the pointer, then follows the drag. During the drag, snapping and smooth scrolling are switched off; they come back on release. The thumb thickens from 6px to 10px while hovered, focused or dragged.
5. With the track focused: ArrowRight/ArrowDown scroll one card forward, ArrowLeft/ArrowUp one card back, Home to the start, End to the end. `aria-valuenow` reports 0–100.
6. The two 44px square arrow buttons scroll two cards at a time. Previous is disabled at the start, Next at the end.
7. Hovering or focusing a card: border `#2c343a` → lime, translateY 0 → −4px, diamond frame fills lime and rotates 45° → 135° in 400ms, icon turns near-black and scales to 1.08.
8. Clicking a card sets `aria-pressed="true"` on it and false on all others. Its footer word changes from "Filter" to "Filtering" in lime. The status line updates (polite live region) and Clear filter appears.
9. Clicking the active card again, or Clear filter, removes the filter: "Showing all 214 brokers", Clear filter hides, focus returns to the rail.

## Tokens

```css
:root {
  /* colour */
  --bg: #0f1316;          /* page, diamond interior at rest */
  --surface: #161b1f;     /* card */
  --surface-on: #1c2412;  /* active filter card */
  --ink: #eef1ea;         /* text, button borders, offset shadow */
  --ink-2: #9aa39c;       /* lede, definitions, resting diamond frame */
  --line: #2c343a;        /* card borders, track, rules */
  --lime: #c5f04a;        /* accent: hover, active, thumb, headline word */
  --lime-ink: #11160a;    /* icon colour on lime */
  --focus: #c5f04a;

  /* type */
  --display: "Big Shoulders Display", Impact, sans-serif;
  --sans: "Space Grotesk", system-ui, sans-serif;

  /* layout */
  --card-w: 264px;
  --card-h: 300px;
  --gap: 20px;
  --dia: 56px;

  /* motion */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

No border radius anywhere. Corners are square on cards, buttons, track and thumb.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Headline h2 | Big Shoulders Display | 76px | 800 | 0.9 | −0.005em | Sentence |
| Card title h3 | Big Shoulders Display | 30px | 700 | 0.95 | 0.01em | UPPER |
| View button | Big Shoulders Display | 18px | 700 | 1 | 0.04em | UPPER |
| Lede | Space Grotesk | 16px | 400 | 1.5 | 0 | Sentence |
| Card definition | Space Grotesk | 15px | 400 | 1.45 | 0 | Sentence |
| Status line | Space Grotesk | 14px | 400, numbers 600 | 1.5 | 0 | Sentence |
| Card footer | Space Grotesk | 13px | 600 / 500 | 1.5 | 0 | Sentence |

## Implementation notes

1. The diamond. Rotate a pseudo-element, never the icon's wrapper:

```css
.dia { position: absolute; top: calc(var(--dia) / -2 - 6px); left: 24px;
  width: var(--dia); height: var(--dia); display: grid; place-items: center; }
.dia::before { content: ""; position: absolute; inset: 0; transform: rotate(45deg);
  background: var(--bg); border: 2px solid var(--ink-2);
  transition: background-color .2s var(--ease), border-color .2s var(--ease), transform .4s var(--expo); }
.dia svg { position: relative; color: var(--ink); }
.card:hover .dia::before { background: var(--lime); border-color: var(--lime); transform: rotate(135deg); }
.card:hover .dia svg { color: var(--lime-ink); }
```

The rotated square is about 79px across its diagonal, so the rail needs at least 44px of top padding or `overflow-x: auto` will clip the tips.

2. The scrubber reads and writes the rail's scroll; it owns no state of its own:

```js
function sync() {
  const tw = track.clientWidth, ratio = Math.min(1, rail.clientWidth / rail.scrollWidth);
  const w = Math.max(48, tw * ratio), max = rail.scrollWidth - rail.clientWidth;
  const f = max > 0 ? rail.scrollLeft / max : 0;
  thumb.style.width = w + 'px';
  thumb.style.transform = `translateX(${(tw - w) * f}px)`;
  track.setAttribute('aria-valuenow', Math.round(f * 100));
}
function seek(x) {
  const r = track.getBoundingClientRect(), w = thumb.offsetWidth;
  const f = Math.min(1, Math.max(0, (x - r.left - w / 2) / (r.width - w)));
  rail.style.scrollSnapType = 'none'; rail.style.scrollBehavior = 'auto';
  rail.scrollLeft = f * (rail.scrollWidth - rail.clientWidth);
}
```

Restore `scrollSnapType` and `scrollBehavior` on pointerup. Leaving snap on during a drag makes the rail fight the pointer.

3. The bleed. Pull the rail out of the page padding on the right and pad it back so the last card can still reach the edge:

```css
.rail { display: flex; gap: 20px; margin: 0 -56px 0 0; padding: 44px 56px 8px 0;
  overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; }
.rail::-webkit-scrollbar { display: none; }
```

Common mistakes:

- Rotating `.dia` itself: the icon tilts 45° and the hover spin turns it sideways.
- Clipping the diamond tips with `overflow: hidden` on the rail and no top padding.
- A thin 2px scrubber. It is a control here; 6px resting, 10px active, with a 24px hit area.
- Rounding the corners. This family is square.
- Using `role="tab"` for the cards. They are toggle buttons that filter, not tabs.
- Forgetting to move focus after Clear filter hides itself.

Where it sits:

1. It is a glossary or legend band on an index, ranking or directory page, placed above the list it filters.
2. Six to ten badges. Fewer than five do not need a rail; use a grid.
3. The filter result belongs to the list below. This piece only owns the pressed state and the status line; the list listens for the change.
4. Badges keep one icon language: 24px stroke icons, 2px, square or round caps, all in the same diamond frame.
5. On a light page, keep the structure and swap the tokens: paper background, ink frames, and the accent only for hover, pressed and the thumb.

Rebuild order:

1. Set the header row and the status line.
2. Build the rail with eight card buttons, top padding for the diamonds, and the right bleed.
3. Add the diamond pseudo-element and the hover state.
4. Add `aria-pressed` toggling and the status text.
5. Add the scrubber: sync on scroll, then click and drag, then keys.
6. Add the arrow buttons and their disabled states.
7. Check reduced motion and 375px.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
