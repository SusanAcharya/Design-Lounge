<!-- Design Lounge Nº 186 · "Case file horizontal scroll" · www.designlounge.live -->

# Case file horizontal scroll

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Studied from hauntedbouldercity.com: the "strange stuff" section, where vertical scrolling pins the screen and slides three full-height story panels sideways, each a night scene with a huge condensed headline, while tabs at the bottom track the chapter. This piece is that section for a fictional harbour ghost walk, the Wrexley Lantern Walk. Three case files (the keeper, the wreck, the lights) sit side by side on a track. The next panel always peeks in from the right at 22% width, dimmed, so people know to keep going. The detail worth copying is that every piece of chrome reads the same single number, scroll progress from 0 to 1: the track position, the tab fills, the counter, the dimming and the top progress bar.

## Structure

```
1280 × 800, section height 340vh, pinned frame 100vh
┌──────────────────────────────────────────────────────────────┬────────────┐
│▀▀▀▀▀▀ 3px page progress                                       │            │
│ WREXLEY LANTERN WALK                        [Book a lantern ↗]│            │ fixed header, 22px 48px
│ 02 / THE HARBOUR FILES          KEEP SCROLLING. IT GETS COLDER│            │ meta row, top 74px
│                                     ( moon )                  │  next      │
│ CASE FILE 01 / THE KEEPER                                     │  panel     │
│ THE LIGHT                              ▲ lighthouse           │  peeks     │
│ STAYED ON                                                     │  (22vw,    │
│ FOR NOBODY.          (amber line)                  ┌──┐       │  copy at   │
│ paragraph max 420px                                │01│ outline│  35%)      │
│ KEEPERS & LOGBOOKS                                 └──┘       │            │
│ ~~~~~~~~~~~~~~~~~~~~~ fog ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│            │
│ ─01 Keepers─  ─02 Wrecks─  ─03 Lights─                01 / 03 │            │ foot, bottom 30px
└──────────────────────────────────────────────────────────────┴────────────┘
 panels: 78vw, 78vw, 100vw (last one fills the screen at progress 1)
```

- `div.bar` fixed, `aria-hidden`.
- `header.top` fixed: brand text, booking link.
- `section.wrap aria-label="Case files"` (340vh) → `div.pin` (sticky, 100vh, overflow hidden) → `.meta`, `.track` (flex row), `.foot`.
- Each panel is an `article aria-labelledby` its `h2`. Layers inside, back to front: `.sky` gradient, `.moon`, inline SVG scene silhouette (`preserveAspectRatio="xMidYMax slice"`, 62% height), two `.fog` layers, `.shade` left-to-right darkening gradient, `.num` outlined numeral, `.copy` (kicker, `h2`, `p`, tag).
- `.foot`: `ol.tabs aria-label="Case files"` of three buttons, and the counter (`aria-hidden`; the live region speaks).
- `section.after` with an `h3` and a second booking link.

## Motion

| Thing | Trigger | Property | Mapping / from → to | Timing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Track | scroll | translateX | `-p × (trackWidth − innerWidth)` | 1:1 with scroll, rAF | kept (user-driven) |
| Tab rule | scroll | scaleX from left | `clamp(p×(n−1) − i + 1, 0, 1)` | 1:1 | kept |
| Page bar | scroll | scaleX | page scroll / max | 1:1 | kept |
| Panel copy | chapter change | opacity | 0.35 ↔ 1 | 500ms `--ease` | instant |
| Fog A / B | always | translateX | -6% → 8%, alternate | 38s / 54s linear | static |
| Tab click | click | window scroll | to `top + range × i/(n−1)` | browser smooth | jump |
| Button arrow | hover | translate | 0 → (2px, -2px) | 200ms expo | none |

Scroll-linked transforms stay under reduced motion because the user is driving them. Only the ambient fog stops.

## States

- Tab resting: `--bone-2` text, 1px `--line` top rule, amber fill at its current `--f`.
- Tab current: `aria-current="true"`, text `--lamp-2`, number `--lamp`.
- Tab hover: text `--bone`. Focus-visible: 2px `--focus` outline at 6px offset.
- Panel current: `.on`, copy full opacity. Others: copy 35%.
- Button hover: background `--lamp-2`, arrow nudges up-right.
- Top of page: tab 01 current, bar at 0. End of section: tab 03 current and full, track at max, then normal scroll resumes.

## Accessibility

- Every panel is a real `article` with an `h2`, all in the DOM, so screen readers and find-in-page reach all three without scrolling sideways.
- Tabs are buttons in an `ol` with `aria-current`, not a `tablist`; they move the scroll position, they don't hide content.
- A polite live region announces "Case file N of 3" on chapter change. The counter is `aria-hidden` to avoid double reading.
- Keyboard: Tab reaches the booking link and the three tabs. ArrowLeft/Right step chapters only when the section is pinned, so arrows still scroll text elsewhere.
- Decorative layers (sky, moon, scenes, fog, shade, numeral, bar) are `aria-hidden`.
- Contrast: `#ece6d8` on `#0a1220` ≈ 15:1; `#b9b7ae` on the shaded left side ≈ 9:1; the `.shade` gradient (88% → 10% near-black from the left) guarantees this over any scene.
- Tab hit area: 150px × 40px.

## Responsive rules

- ≥1280: as drawn. Panels 78vw.
- 1024: same. The headline clamps on height (`11vh`).
- 768: same layout; `--h2` now clamps on width (`13vw`).
- <760: gutters 18px, panels 88vw, tab words hidden (numbers only), meta right item hidden, numeral 34vh, button padding 11px 12px. Pinning still works with touch scroll.
- Short screens (<600px tall): reduce the pin length to 260vh so the section doesn't feel endless.
- If the product has more than five chapters, don't use this pattern; use a stacked story.

## Acceptance checklist

### Always

- [ ] The section pins and the track moves sideways 1:1 with vertical scroll; no scroll hijacking and no snapping.
- [ ] The next panel peeks in at ~22% width with dimmed copy.
- [ ] Track, tab fills, counter, dimming and page bar all derive from one progress value.
- [ ] Tabs scroll to their chapter; arrows step chapters while pinned.
- [ ] All panel text is in the DOM and reachable without horizontal scrolling.
- [ ] A shade gradient sits between scene and copy so body text passes 4.5:1.
- [ ] Ambient fog stops under reduced motion; scroll-linked movement stays.
- [ ] No horizontal page overflow at 375px (the track is clipped by the pin).

### This demo

- [ ] Section 340vh; panels 78vw, 78vw, 100vw.
- [ ] Headlines: "The light stayed on for nobody.", "The tide gives things back.", "Three lights. No boat. No answer.", last line amber `#e8873a`.
- [ ] Tabs "01 Keepers", "02 Wrecks", "03 Lights"; counter "01 / 03".
- [ ] Booking button "Book a lantern" amber with near-black text.
- [ ] Outlined numerals 01–03 bottom-right of each panel.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: panel 01 fills the left 78% of the screen. Panel 02 peeks on the right, its copy at 35% opacity. Tab "01 Keepers" is current and its top rule is lit amber. The counter reads 01 / 03. Fog drifts slowly across the bottom.
2. Scrolling down does not move the page visibly. The section is pinned (`position: sticky`) and the track translates left in exact proportion to scroll. There is no snapping and no easing; the track follows the wheel.
3. The pinned scroll distance is 240vh (section 340vh minus one screen). Across it, the track moves by `trackWidth - viewportWidth`.
4. Each tab's 1px top rule fills left to right as you pass through its chapter (`scaleX` 0 → 1). Tabs behind you stay full.
5. When progress × 2 rounds to a new integer, that panel becomes current: its copy fades to full opacity (500ms), the previous one dims to 35%, the tab gets `aria-current="true"`, the counter changes, and the live region says "Case file 2 of 3".
6. Clicking a tab smooth-scrolls the window to that chapter's exact progress point (0, 0.5, 1). Under reduced motion it jumps.
7. ArrowLeft / ArrowRight step one chapter while the section is fully pinned on screen.
8. A 3px amber bar at the very top shows whole-page progress.
9. After the last panel, the section un-pins and a short "Pick a foggy night." booking block scrolls up.

## Tokens

```css
:root {
  --night: #0a1220;          /* page */
  --night-2: #111c30;
  --deep: #060b14;           /* silhouettes, button text */
  --bone: #ece6d8;           /* headlines */
  --bone-2: #b9b7ae;         /* body, meta */
  --bone-3: #8d9099;         /* tags, inactive tab numbers */
  --line: rgba(236,230,216,.18);
  --fog: #9fb4c4;            /* fog gradients at 26–34% alpha */
  --lamp: #e8873a;           /* lantern amber: highlight line, button, progress */
  --lamp-2: #f2b27a;         /* lit window, kicker bold, current tab text */
  --focus: #f2b27a;

  --display: "Anton", Impact, "Arial Narrow", sans-serif;
  --mono: "DM Mono", ui-monospace, monospace;

  --h2: clamp(44px, min(11vh, 13vw), 104px);
  --numeral: min(40vh, 330px);
  --gutter: 48px;            /* 18px under 760px */
  --panel: 78vw;             /* 88vw under 760px; last panel 100vw */
  --pin-length: 340vh;

  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --t-dim: 500ms; --t-copy: 700ms;
  --fog-a: 38s; --fog-b: 54s;
}
```

Sky gradients per panel (top → bottom): `#0d1a2e → #1b2c44 → #2a3a52`, `#081322 → #12253a → #1e3a4a`, `#05101d → #0f2033 → #1a2e45`.

## Typography

| Role | Family | Size / LH | Weight | Tracking | Case / colour |
| --- | --- | --- | --- | --- | --- |
| Brand | Anton | 20px | 400 | 0.04em | uppercase, middle word `--lamp` |
| Meta row | DM Mono | 11px | 400 | 0.14em | uppercase, `--bone-2`; right item `--lamp-2` |
| Kicker | DM Mono | 11px | 400 / 500 | 0.16em | uppercase; "Case file 01" `--lamp-2` |
| Headline h2 | Anton | `--h2` / 0.92 | 400 | 0.005em | uppercase, 3 short lines, last line `--lamp` |
| Body | DM Mono | 14.5px / 1.55 | 400 | 0 | `--bone-2`, max 420px |
| Tag | DM Mono | 11px | 400 | 0.16em | uppercase, `--bone-3` |
| Tab | DM Mono | 13px | 400 | 0 | number `--bone-3`, current `--lamp` |
| Counter | DM Mono | 12px | 400 / 500 | 0.2em | tabular, current number `--bone` |
| Numeral | Anton | `--numeral` / 0.8 | 400 | 0 | transparent fill, 1.5px stroke at 22% bone |
| Button | DM Mono | 13px | 500 | 0.02em | sentence case, `--deep` on `--lamp` |

Each headline is three lines broken by hand with `<br>`. Never let a condensed headline wrap on its own.

## Implementation notes

1. **One progress value drives everything.** Throttle with rAF. Compute the track distance from the real `scrollWidth`, not from panel counts, so mixed panel widths work.

```js
function update() {
  ticking = false;
  const range = wrap.offsetHeight - innerHeight;
  const p = clamp((scrollY - wrap.offsetTop) / range, 0, 1);
  track.style.transform = `translate3d(${-p * (track.scrollWidth - innerWidth)}px,0,0)`;
  const f = p * (n - 1);
  tabs.forEach((t, i) => t.style.setProperty("--f", clamp(f - i + 1, 0, 1)));
  const a = Math.round(f);
  if (a !== active) { active = a; /* toggle .on, aria-current, counter, live region */ }
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
```

2. **Pin with sticky, not fixed.** The tall wrapper creates the scroll distance; the sticky child stays put. `overflow: hidden` on the pin clips the track so the page never scrolls sideways.

```css
.wrap  { position: relative; height: 340vh; }
.pin   { position: sticky; top: 0; height: 100vh; overflow: hidden; }
.track { display: flex; height: 100%; will-change: transform; }
.panel { flex: 0 0 78vw; } .panel:last-child { flex-basis: 100vw; }
```

3. **Tabs jump to exact progress points.** `top = wrap.offsetTop + range × i / (n − 1)`; use `behavior: "auto"` under reduced motion.

Common mistakes:

- Listening to `wheel` and translating on your own. That breaks trackpads, keyboards and touch. Map native scroll.
- Setting `overflow-x: hidden` only on `body`; clip at the pin or iOS will still pan sideways.
- Putting `overflow: hidden` on an ancestor of the sticky element, which silently breaks sticky.
- Snapping the track with CSS scroll-snap on a transformed element. It won't snap and it fights the mapping.
- Letting long headlines wrap into four or five lines; write three-line headlines.
- Photo backgrounds with no shade layer; the copy disappears on bright patches.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
