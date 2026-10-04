<!-- Design Lounge Nº 213 · "Dark motion shot gallery" · designlounge.vercel.app -->

# Dark motion shot gallery

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

Studied from 60fps.design, a gallery of about 2,100 short clips of mobile micro-interactions: this piece takes the gallery itself (a giant pale wordmark sitting above a hairline nav, numbered shot cards with an app chip and a phone on a tile, and tag filters by gesture, pattern and effect) and rebuilds it as a dark page for a fictional library called Framewell. Each card holds a CSS-drawn phone whose screen plays a three-second loop of one micro-interaction: a swipe slider, a tab pill, a card stack, pull to refresh, a digit ticker, confetti, a pill morph, a hold ring, a skeleton shimmer, a glowing border, a stagger, a streak, a timer, a splash. Loops play only while the card is at least 60% in view (or hovered, or focused), so the grid is never 24 busy screens at once. The detail worth copying is the playback model: one `play` class per card toggles `animation-play-state` for everything inside, and a 2px progress line under the tile tells you a loop is running, like a video scrubber.

## Structure

```
1280 × 800 (wrap max-width 1200, padding 24)
┌──────────────────────────────────────────────────────────────┐
│            F R A M E W E L L   (214px, #17171a)              │ padding-top 18
├──────────────────────────────────────────────────────────────┤ 1px hairline
│ Shots¹²⁸⁴ Apps³¹² Patterns⁴⁶        [FW]   Glossary Submit Search │ 52px, sticky
├──────────────────────────────────────────────────────────────┤
│ Small moments from apps that feel right. One   Autoplay in view (●)│ margin 30/18
│ loop at a time, tagged by …                                  │
│ (Gesture|Pattern|Effect) (drag 4)(flick 1)(hold 2)(long press 2)… │ 12px padding, hairline under
│ 24 shots · newest first                       Clear filters │ 44px
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│ │1284  ■Kosi │ │1283  ■Gufa │ │1282  ■Doko │ │1281 ■Lahar │ │ cards r18, padding 10
│ │ ┌────────┐ │ │            │ │            │ │            │ │
│ │ │ ▯phone │ │ │   tile 300px, r12, phone 132×272        │ │
│ │ │      FW│ │ │            │ │            │ │            │ │
│ │ └──────▔─┘ │ │  2px progress line at tile bottom       │ │
│ │ Kosi Pay slide to send ›  │ title 14/500              │ │
│ │ swipe · drag · success…   │ tags 11px mono            │ │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

- The wordmark is a `p` with `aria-hidden`. There is one `h1` (the intro line).
- `nav` labelled "Main" holds two `ul`s and the logo tile.
- The autoplay control is `button role="switch"` with `aria-checked`, labelled by its text.
- Group selector: `div role="tablist"` of three `button role="tab"`. Chips: `div role="group"` labelled "Tags", each `button` with `aria-pressed`.
- The grid is `main` labelled "Shots"; each card is an `article` with an `h3` title, a stretched invisible `button.open` covering the card (`aria-label="Open …"`), and a `button.pp` above it (`z-index` 2) for play/pause.
- The viewer is a native `dialog` opened with `showModal()`, labelled by its `h2`.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Card lift | hover / focus-within | transform, border, shadow | 0 → -3px | 300ms | `--out` | no lift |
| Title chevron | hover / focus-within | opacity, translateX | 0, -4px → 1, 0 | 200ms / 300ms | `--out` | instant |
| Shot loop | card has `.play` | per-type keyframes | — | 3s infinite | per type | autoplay off by default |
| Progress line | card has `.play` | scaleX | 0 → 1 | 3s linear infinite | linear | same rule |
| Switch knob | toggle | translateX | 0 → 16px | 300ms | `--spring` | instant |
| Chip press | :active | scale | 1 → 0.95 | 150ms | `--spring` | none |
| Dialog in | open | opacity, translateY, scale | 0, 12px, .98 → 1, 0, 1 | 350ms | `--out` | none |

Loop recipes (all 3s, so the progress line matches):

| Type | What moves |
| --- | --- |
| swipe | knob translateX 0 → 78px (10–50%), fill width follows, a ring pops in at 52–62% and fades at 100% |
| tabs | pill translateX 0 → 37 → 74px with holds, spring easing |
| stack | top card flies to (130px, -10px) rotate 18° at 30–55%, the next card rises from (8px, .94) |
| pull | list translateY 0 → 34px (15–35%), spinner fades in and spins 540°, list springs back at 80% |
| ticker | three digit columns translateY 0 → -200px, delays 0/80/160ms |
| confetti | badge pops from 0.3, ten pieces fly to points on a circle (radius 40–68px) and fade |
| morph | black pill 54×20 → 108×120 (r 10 → 22), inner block fades in 44–66% |
| hold | dot scales to .86, ring stroke-dashoffset 170 → 0, dot pops to 1.1 in the accent |
| shimmer | gradient background-position 100% → 0, 1.5s |
| glow | a conic gradient behind a 2px-inset card rotates 360° |
| stagger | rows rise 12px and fade in, 90ms apart |
| streak | seven dots fill in turn (120ms apart), flame pops at 70% |
| timer | ring stroke-dashoffset 0 → 226 linear |
| splash | mark scales 0.2 → 1, holds, then scales to 14 and fades |

## States

- Card resting: `--card` with 1px `--line`. Hover/focus: lifted, `--line-2` border, shadow `0 18px 40px -20px rgba(0,0,0,.9)`, chevron shown, playing.
- Card paused: loop frozen on its current frame, play button visible (32px, 70% black).
- Card playing: progress line running; play button shows pause icon and is visible on hover/focus only.
- Card hidden by filters: `display: none`.
- Chip off: 1px `--line-2` border, `--ink-2` text. Chip hover: `--ink-3` border, `--ink` text. Chip on: accent fill, `#06122e` text. Chip with 0 results: 45% opacity.
- Group tab selected: cream fill, `--bg` text.
- Switch on: accent track, knob right. Off: `--line-2` track.
- Empty result: a full-width mono line "No shots match all of these. Remove a tag." centred with 60px padding.
- Focus-visible everywhere: 2px accent outline, 2px offset.

## Accessibility

- The giant wordmark is decorative (`aria-hidden`). The logo tile has `aria-label="Framewell"`.
- Autoplay is a real `role="switch"` with `aria-checked`. Reduced motion users get it off by default.
- Each card has two controls: "Open Kosi Pay slide to send" (stretched across the card) and "Play …" / "Pause …" (label changes with state). Tab order: open, then play.
- Focus inside a card plays it, so keyboard users get the same preview as hover.
- The chip row is a labelled group of toggle buttons with `aria-pressed`. The group selector is a tablist; Arrow Left/Right move between groups.
- The status line is `aria-live="polite"` and reads the result count and active tags.
- The dialog uses `showModal()` (focus is trapped natively), is labelled by its title, supports Escape, Arrow Left/Right, and returns focus to the card's open button on close.
- Phone screens are decorative drawings; the title and tags carry the meaning.
- Contrast: `#ededE8` on `#0b0b0c` ≈ 17:1; `#a6a6a0` on `#131315` ≈ 7.6:1; `#85857f` on `#131315` ≈ 4.9:1; `#06122e` on `#7aa2ff` ≈ 7.4:1.
- Hit targets: chips and group tabs 32px tall (desktop); the play button 32px; the open button covers the whole card.

## Responsive rules

- ≥1280: four columns, wordmark at 214px.
- 1100 and below: three columns.
- 860 and below: two columns; the intro stacks (switch under the text); the right nav keeps only Search.
- Below 640: one column; wrap padding 16px; left nav keeps Shots and Apps; the chip row takes a full line and scrolls; the dialog stacks (phone at 1× on top, info below).
- The wordmark scales with `17.2vw` and is clipped by `overflow: hidden`; it never causes horizontal scroll. Grid tracks use `minmax(0, 1fr)` so long tag lines truncate instead of widening the page.

## Acceptance checklist

### Always

- [ ] Cards loop only when in view (≥ 60%), hovered, focused or pinned; everything else is paused on a frame.
- [ ] One class per card controls playback via `animation-play-state` for every descendant.
- [ ] A 2px progress line runs under the tile while a card plays, with the same duration as the loop.
- [ ] Filters by three facets combine with AND; chip counts reflect the current filter set.
- [ ] A clear-filters control appears only when something is active; an empty state exists.
- [ ] The viewer steps through the filtered list, not the whole list.
- [ ] Autoplay can be switched off; reduced motion starts with it off.
- [ ] Grid tracks are `minmax(0, 1fr)`; no horizontal scroll at 1280 or 375.
- [ ] Every card is reachable and playable by keyboard.
- [ ] One accent on the page; app colours appear only inside phones and as small swatches.

### This demo

- [ ] Wordmark "FRAMEWELL" in `#17171a`, 214px, Archivo 900 at 62% width.
- [ ] Nav counts Shots 1,284, Apps 312, Patterns 46.
- [ ] 24 shots numbered 1284 to 1261, first "Kosi Pay slide to send", last "Nimbu menu skeleton".
- [ ] Filtering Pattern "card stack" + Effect "spring" shows exactly 2 shots (Doko deck dismiss, Paila trail card stack).
- [ ] Accent `#7aa2ff` (cobalt) on `#0b0b0c`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame at 1280×800: a 214px condensed "FRAMEWELL" in `#17171a` (barely visible on `#0b0b0c`), its bottom edge resting on the nav's top hairline.
2. The nav is a 52px three-column grid: left "Shots 1,284 · Apps 312 · Patterns 46" with mono superscript counts; centre a 32px cream "FW" tile; right "Glossary · Submit · Search". It sticks to the top with 92% opaque background and an 8px blur.
3. Intro row: a 22px line, bold first sentence in cream, rest in grey: "Small moments from apps that feel right. One loop at a time, tagged by the gesture, the pattern and the effect." On the right, "Autoplay in view" with a 40×24 switch, on (cobalt) by default.
4. Filter bar: a three-option segmented control (Gesture, Pattern, Effect) and a horizontally scrolling row of chips for the chosen group. Each chip shows a mono count of shots that would match if added.
5. Gesture chips: drag, flick, hold, long press, pull, scrub, swipe, tap. Pattern: card stack, onboarding, streak, reward, success state, timer, splash, loading. Effect: morph, spring, stagger, ticker, glow, shimmer, confetti, fade.
6. Tapping a chip toggles it (cobalt fill, navy text). Filters combine with AND across and within groups. Chips whose count is 0 dim to 45% but remain pressable.
7. The status line reads "24 shots · newest first", or "2 of 24 shots · card stack + spring" with a "Clear filters" link when tags are active. It is a polite live region.
8. The grid is four columns at 1280, gap 14px. Each card: top row with a four-digit mono number (1284…1261) and an app chip (14px rounded swatch + name); a 300px tile with the phone (132×272, 26px radius, 5px black bezel, tiny island) and a faint "FW" mark bottom-right; the title ("Kosi Pay slide to send"); and a mono tag line truncated with an ellipsis.
9. Cards at least 60% visible play their loop (when autoplay is on). Others show the paused frame and a round play button top-left.
10. Hover or focus within a card: it lifts 3px, its border brightens, a deep shadow appears, a chevron slides in after the title, and the loop plays regardless of autoplay.
11. The play/pause button on each card forces play, or forces pause (a paused card stays paused even in view until pressed again).
12. Switching autoplay off changes the label to "Play on hover"; only hovered, focused or pinned cards play.
13. Clicking a card opens a modal viewer: the phone at 1.45× on the left tile, and on the right the number and app, a 30px condensed title, a one-sentence description of the interaction, tag pills, and Previous / Next / Close. Arrow keys step through the currently filtered list; Escape or a backdrop click closes; focus returns to the card.
14. With reduced motion, autoplay starts off, so nothing moves until the user hovers or presses play, and card lift and dialog entrance are removed.

## Tokens

```css
:root {
  --bg: #0b0b0c;      /* page */
  --card: #131315;    /* card, dialog */
  --tile: #1a1a1d;    /* phone tile */
  --line: #242428;    /* hairlines, card borders */
  --line-2: #34343a;  /* hover border, chip border, switch off */
  --ink: #ededE8;     /* primary text, logo tile, selected group */
  --ink-2: #a6a6a0;   /* secondary text, chips */
  --ink-3: #85857f;   /* numbers, counts, tags */
  --mark: #17171a;    /* giant wordmark */
  --accent: #7aa2ff;  /* cobalt: chips on, switch on, progress line, focus */
  --sans: "Archivo", system-ui, sans-serif;   /* variable width 62–125 */
  --mono: "Geist Mono", ui-monospace, monospace;
  --wrap: 1200px; --gutter: 24px; --gap: 14px;
  --nav-h: 52px; --tile-h: 300px;
  --phone-w: 132px; --phone-h: 272px; --phone-r: 26px; --bezel: 5px;
  --r-card: 18px; --r-tile: 12px; --r-pill: 999px; --r-dialog: 22px;
  --loop: 3s;
  --spring: cubic-bezier(.34, 1.56, .64, 1);
  --out: cubic-bezier(.16, 1, .3, 1);
  --std: cubic-bezier(.2, .7, .2, 1);
}
```

Each card also sets `--a` (the app accent) and each phone sets `--s` (screen), `--m` (muted blocks) and `--a`. App colours in this demo: Kosi Pay `#0f1a14 / #2a3a31 / #5cf29a`, Gufa `#101322 / #262c48 / #8aa2ff`, Doko `#f2ede4 / #d9d1c3 / #e2552d`, Lahar `#0d2024 / #1e3c42 / #5fd3c9`, Masi `#faf6ee / #e4dccd / #b08d57`, Nimbu `#f4f7e6 / #dfe5c3 / #9bbf1f`, Paila `#1b1410 / #3a2b22 / #ffb547`, Imli `#160f1a / #33233b / #ff7ac1`, Kasrat `#0b0b0b / #262626 / #ff5a36`, Tiffin `#fff4e8 / #f1dcc6 / #e0782f`, Lanta `#eef1f6 / #d3d9e4 / #3b5bdb`, Ujyalo `#1a1508 / #3a301a / #f2c94c`. These are screen colours inside phones, not page colours; the page keeps one accent.

## Typography

| Role | Family | Size | Weight | Width | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- | --- |
| Wordmark | Archivo | clamp(64px, 17.2vw, 214px) | 900 | 62% | 0.8 | -0.01em |
| Intro (h1) | Archivo | 22px | 600 lead / 500 rest | 100% | 1.3 | -0.01em |
| Nav links | Archivo | 14px | 500 | 100% | 1.45 | 0 |
| Nav counts | Geist Mono | 10px | 400 | — | 1 | 0 |
| Logo tile | Archivo | 14px | 900 | 70% | 1 | 0 |
| Group tabs, chips | Archivo | 14px | 500 / 400 | 100% | 1 | 0 |
| Chip counts, status, card numbers, tags | Geist Mono | 11–12px | 400 | — | 1.45 | 0 |
| Card title (h3) | Archivo | 14px | 500 | 100% | 1.45 | 0 |
| Dialog title (h2) | Archivo | 30px | 700 | 80% | 1.05 | -0.01em |
| Ticker digits inside a phone | Archivo | 36px | 800 | 100% | 40px | 0 |

Mono is for anything that counts or tags. The condensed width is only for the wordmark, logo and dialog title.

## Implementation notes

**1. Playback by class, not by JS animation.** Write each loop as plain CSS keyframes that run forever, then pause them all unless the card is playing. Starting and stopping never resets the loop; it resumes from where it froze.

```css
.card:not(.play) .scr *,
.card:not(.play) .scr *::before,
.card:not(.play) .scr *::after { animation-play-state: paused !important; }
.card.play .bar i { animation: prog 3s linear infinite; }
@keyframes prog { to { transform: scaleX(1); } }
```

```js
const inView = new Set(), hover = new Set(), pinned = new Set();
function sync(c) {
  const on = !c.dataset.off && (pinned.has(c) || hover.has(c) || (autoplay && inView.has(c)));
  c.classList.toggle('play', on);
  pp(c).setAttribute('aria-label', (on ? 'Pause ' : 'Play ') + title(c));
}
const io = new IntersectionObserver(es => es.forEach(e => {
  e.isIntersecting ? inView.add(e.target) : inView.delete(e.target); sync(e.target);
}), { threshold: .6 });
```

Common mistake: using `<video>` autoplay for every card. Twenty decoding videos stutter and drain batteries; if you do use video, apply the same in-view rule and call `play()`/`pause()` from `sync`.

**2. Faceted filter with live counts.** Keep one `Set` per facet. A shot matches when every active tag in every facet is on that shot. A chip's count is the number of shots that have that tag and match the current set.

```js
const active = { g: new Set(), p: new Set(), e: new Set() };
const matches = s => ['g', 'p', 'e'].every(k => [...active[k]].every(t => s[k].includes(t)));
function renderChips() {
  const k = KEY[group];
  chips.innerHTML = GROUPS[group].map(t => {
    const n = SHOTS.filter(s => s[k].includes(t) && matches(s)).length;
    return `<button class="chip${n ? '' : ' zero'}" aria-pressed="${active[k].has(t)}">${t}<small>${n}</small></button>`;
  }).join('');
}
```

**3. The giant wordmark.** It is type, not an image, set in the variable width axis and clipped.

```css
.mark { margin: 0; padding-top: 18px; text-align: center; white-space: nowrap; overflow: hidden;
  font: 900 clamp(64px, 17.2vw, 214px)/.8 var(--sans); font-stretch: 62%;
  color: var(--mark); user-select: none; }
nav { border-top: 1px solid var(--line); position: sticky; top: 0; }
```

Load Archivo with the width axis: `family=Archivo:wdth,wght@62..125,400..900`.

Common mistakes overall:

- A bright wordmark. It is two steps above the background; it is texture, not a headline.
- Coloured card backgrounds per app. Cards are all `--card`; colour lives inside the phone.
- Every card playing on load, including those below the fold.
- Filters with OR logic; designers narrow down, so AND is expected.
- Copying real app names or recorded clips. Draw the loops; invent the apps.
- Forgetting `minmax(0, 1fr)`; a long tag line pushes the grid past the viewport.
- Hover-only previews with nothing for keyboard or touch.

Where it sits: the home page of any curated library (motion, components, illustrations). The viewer is the shot page; deep links would open it directly.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
