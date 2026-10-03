<!-- Design Lounge Nº 454 · "Vertical rail navbar" · designlounge.vercel.app -->

# Vertical rail navbar

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The navigation for Ruma Office, a fictional two-person print studio in Patan. Instead of a top bar, a fixed 88px rail runs down the left edge with a 2px black rule. The wordmark is rotated to read bottom to top. Four numbered links (01 Work, 02 About, 03 Notes, 04 Contact) sit in the middle. A fluorescent pink block slides behind the link for the section in view. The foot of the rail shows the studio's local time and a pink dot for "Booking Jan 2027". The content scrolls to the right of the rail. The detail worth copying: one indicator element moves with `transform`, so the active state reads like ink sliding along the rail, not four boxes blinking.

## Reference behaviour

1. First frame: scroll is 0. "01 Work" is active. The pink block sits behind it and the link has `aria-current="true"`.
2. The rail is 88px wide, full height, cream `#f2ebdd`, with a 2px `#141414` right border. It does not scroll.
3. At the top of the rail the wordmark "RUMA OFFICE" reads bottom to top in Big Shoulders Display 900, 30px. "OFFICE" sits on a pink ground.
4. In the middle, four links stack. Each is 72px tall and fills the rail width. The number is 26px display, the label is 10px mono below it. A 1px rule separates links. A 2px rule sits above and below the group.
5. At the foot: "PATAN", then the time "22:13" in 22px display, then a 10px pink dot with a 2px black ring, then "BOOKING JAN 2027".
6. The time is real. It reads Asia/Kathmandu in 24-hour format and updates every 30 seconds. The `time` element's `datetime` updates with it.
7. The dot pulses: scale 1 to 0.7 and back over 2.4s, forever. It is calm enough to sit beside other pieces.
8. The user scrolls. An IntersectionObserver watches the four sections. The section crossing a band 45% from the top becomes active.
9. When the active section changes, the pink block moves to the new link with `translateY` over 420ms on `cubic-bezier(.16,1,.3,1)`. `aria-current` moves with it.
10. Clicking a link smooth-scrolls to its section. The observer then moves the block. The click does not move it directly.
11. A 6px black bar sits on the right edge of the pink block, over the rail border, so the active link looks like a tab cut into the rule.
12. Below 760px wide the rail becomes a 56px top bar with the wordmark horizontal and a 44px menu button on the right. The numbered links and the clock hide. The button opens a panel of the four links in 28px display type; the active one has a pink ground. Escape closes it.

## Structure

```
1280 x 800 frame

+------+-----------------------------------------------------------------+
| R    |  [01] SELECTED WORK, 2022 – 2026                                 |
| U    |                                                                  |
| M    |  POSTERS,                                       (pink circle)    |
| A    |  BOOKS AND                                   (halftone circle)   |
| O    |  SIGNS THAT       132px display                                  |
| F    |  GET PRINTED.                                                    |
| F    |                                                                  |
|======|  +------------+------------+------------+------------+           |
| 01 ##|  | art        | art        | art        | art        |           |
| WORK#|  | JHAMSIKHEL | KILN & CO. | NINE RIVERS| THAMEL BUS |           |
|------|  +------------+------------+------------+------------+           |
| 02   |                                                                  |
| ABOUT|  section 02 About, 03 Notes, 04 Contact below, each min 100vh     |
|------|                                                                  |
| 03   |                                                                  |
|------|                                                                  |
| 04   |                                                                  |
|======|                                                                  |
| PATAN|                                                                  |
| 22:13|                                                                  |
|  o   |                                                                  |
| BOOK |                                                                  |
+------+-----------------------------------------------------------------+
 88px    main, margin-left 88px, section padding 56px 64px
         ## = pink indicator, 88 x 72
```

- The rail is a `header`, `position: fixed`, `inset: 0 auto 0 0`, `width: 88px`, flex column with `justify-content: space-between`.
- The wordmark is a link to `#work` with `aria-label="Ruma Office, home"`.
- The links are a `nav` labelled "Sections" holding an `ol` of four links. The order is meaningful, so it is an ordered list.
- The indicator is a `div` with `aria-hidden="true"`, placed in the `nav` before the list, with the list above it by `z-index`.
- The foot is a `div` with a `time` element and the availability line.
- The menu button and the mobile panel exist in the DOM but are `display: none` above 760px.
- `main` holds four `section` elements with ids `work`, `about`, `notes`, `contact`. Each has one heading. The first is the `h1`.

## Tokens

```css
:root {
  /* surfaces */
  --cream: #f2ebdd;        /* page, rail */
  --cream-2: #e9e0cd;      /* art grounds, focus fill */

  /* ink */
  --ink: #141414;          /* text, rules */
  --ink-2: #3d3a35;        /* secondary text */
  --line: #141414;         /* every rule is ink */

  /* accent */
  --pink: #ff48b0;         /* indicator, dot, highlights. Never text. */

  /* type */
  --display: "Big Shoulders Display", Impact, sans-serif;
  --mono: "Space Mono", ui-monospace, monospace;
  --fs-word: 30px;
  --fs-num: 26px;
  --fs-label: 10px;
  --fs-time: 22px;
  --fs-h1: 132px;
  --fs-h2: 96px;
  --fs-body: 15px;

  /* space */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-6: 48px;
  --space-7: 56px;
  --space-8: 64px;

  /* rail */
  --rail: 88px;
  --item: 72px;
  --rule: 2px;

  /* radius and shadow */
  --radius: 0;
  --shadow: none;

  /* motion */
  --ease: cubic-bezier(.16,1,.3,1);
  --dur: 420ms;
  --pulse: 2.4s;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Wordmark | Big Shoulders Display | 30px | 900 | 1 | 0.06em | upper |
| Link number | Big Shoulders Display | 26px | 700 | 1 | 0.02em | — |
| Link label | Space Mono | 10px | 400 | 1.6 | 0.12em | upper |
| Time | Big Shoulders Display | 22px | 700 | 1 | 0.02em | — |
| Foot text | Space Mono | 10px | 400 | 1.4 | 0.06em | upper |
| Section tag | Space Mono | 12px | 400 | 1.6 | 0.14em | upper |
| h1 | Big Shoulders Display | 132px | 900 | 0.86 | -0.005em | upper |
| h2 | Big Shoulders Display | 96px | 900 | 0.86 | -0.005em | upper |
| Project title | Big Shoulders Display | 28px | 700 | 1 | 0 | upper |
| Body | Space Mono | 15px | 400 | 1.6 | 0 | sentence |
| Email | Big Shoulders Display | 112px | 900 | 0.9 | 0 | upper |

Two families only. The condensed display is for everything big. The mono is for everything small. Never set body copy in the display face.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Indicator | active section changes | transform | translateY(old) → translateY(new) | 420ms | `cubic-bezier(.16,1,.3,1)` |
| Availability dot | always | transform | scale(1) → scale(.7) → scale(1) | 2.4s loop | ease-in-out |
| Smooth scroll | link click | scroll position | current → section top | browser default | browser default |
| Clock | every 30s | text | old time → new time | instant | — |

- No hover animation on the links. Hover underlines the label.
- The indicator does not stretch or fade. It slides.
- Reduced motion: the indicator jumps (no transition), the dot stops, and `scroll-behavior` is `auto`. The clock still updates.

## States

- Link resting: ink text on cream.
- Link hover: the label underlines, offset 3px.
- Link active: `aria-current="true"`, pink block behind it, 6px black bar on its right edge.
- Focus-visible: 3px ink outline inset by 3px, and the ground turns `#e9e0cd`. Applies to links, the wordmark, project cards and the menu button.
- Project card hover: its title underlines, 3px thick, offset 4px.
- Available dot: pink with a 2px ink ring. A product that is booked out swaps the label and sets the dot to cream.
- Mobile panel open: fixed under the 56px bar; the active link has a pink ground.
- No loading, empty or error state.

## Accessibility

- The rail is a `header`. The links sit in a `nav` with `aria-label="Sections"`.
- The mobile panel is a second `nav` with `aria-label="Sections, compact"`. Only one of the two is visible at a time.
- Use `aria-current="true"` on the active link. It is an in-page section, not a page.
- The indicator is `aria-hidden="true"`. It is decoration. `aria-current` carries the meaning.
- The rotated wordmark keeps its text in the DOM. Screen readers read "Ruma Office" from the `aria-label`.
- The clock is a `time` element. Do not put it in a live region; reading the time every 30 seconds is noise.
- The menu button has `aria-controls`, `aria-expanded` and a label that switches between "Open menu" and "Close menu". Escape closes the panel and returns focus.
- Tab order: wordmark, 01, 02, 03, 04, then the main content.
- Contrast: `#141414` on `#f2ebdd` is about 16:1. `#141414` on `#ff48b0` is about 7:1. Pink is never used as text on cream; it would fail.
- Hit targets: each rail link is 88 × 72px. The menu button is 44px square.

## Responsive rules

- At 1280 and above: the full rail, h1 132px, a 300px column for the riso circles, four project cards in a row.
- At 1024 and below: h1 96px, h2 72px, the circles hide, the hero is one column, project cards are two per row, the email is 80px.
- At 768: the rail stays. 88px is still under 12% of the width.
- Below 760: the rail turns into a 56px top bar with a 2px bottom rule. The wordmark turns horizontal at 24px. The numbered links and the foot hide. A 44px menu button with a 2px border sits on the right. `main` loses its left margin and gains 56px top padding. Sections pad 40px 20px. h1 64px, h2 56px. Cards and columns stack to one. The email is 44px.
- The rail never gets taller than the viewport. At 640px tall (80% of the frame) the wordmark, four links and foot still fit: about 240 + 294 + 100px.
- No horizontal scroll at any width. Every grid uses `minmax(0,1fr)`. The email uses `word-break: break-all`.

## Acceptance checklist

### Always

- [ ] The rail is fixed to the left edge, full height, and does not scroll with the page.
- [ ] The wordmark reads bottom to top.
- [ ] Links are numbered and in an ordered list.
- [ ] One indicator element moves with `transform` to the active link.
- [ ] The active link follows the section in view, not only clicks.
- [ ] Exactly one link has `aria-current="true"`.
- [ ] The foot shows a real local time that updates, plus an availability line.
- [ ] Focus rings are visible on every link and on the menu button.
- [ ] Below the collapse width the rail becomes a top bar with a 44px menu button and a panel.
- [ ] Reduced motion stops the slide and the pulse.
- [ ] No horizontal scroll at any width.

### This demo

- [ ] The rail is 88px wide with a 2px `#141414` right border on `#f2ebdd`.
- [ ] Links: 01 Work, 02 About, 03 Notes, 04 Contact, each 72px tall.
- [ ] The indicator is `#ff48b0`, 88 × 72px, with a 6px ink bar on its right edge.
- [ ] The slide is 420ms on `cubic-bezier(.16,1,.3,1)`.
- [ ] The clock reads Asia/Kathmandu and updates every 30 seconds.
- [ ] The foot reads "PATAN" and "BOOKING JAN 2027".
- [ ] The observer uses `rootMargin: "-45% 0px -50% 0px"`.
- [ ] The rail collapses below 760px.

## Implementation notes

Always: keep the rail one fixed column and push `main` right by the same width. Do not put the rail in a grid with `main`; the rail would scroll away.

The rotated wordmark. `vertical-rl` alone reads top to bottom; rotating it 180 degrees makes it read bottom to top:

```css
.word {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  align-self: center;
  padding-top: 20px;
  font: 900 30px/1 var(--display);
  letter-spacing: .06em;
  text-transform: uppercase;
  white-space: nowrap;
}
.word em { font-style: normal; background: var(--pink); padding: 6px 0; }
```

The indicator and the spy:

```css
.nav { position: relative; }
.nav ol { position: relative; z-index: 1; }
.ind { position: absolute; left: 0; top: 0; width: 100%; height: var(--item); background: var(--pink);
  transform: translateY(var(--y, 0px)); transition: transform var(--dur) var(--ease); }
.ind::after { content: ""; position: absolute; right: -2px; top: 0; bottom: 0; width: 6px; background: var(--ink); }
```

```js
function setActive(id) {
  allLinks.forEach(a => a.getAttribute('href') === '#' + id
    ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
  const link = railLinks.find(a => a.getAttribute('href') === '#' + id);
  if (link) ind.style.setProperty('--y', link.parentElement.offsetTop + 'px');
}
const spy = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)),
  { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section').forEach(s => spy.observe(s));
```

Measure `offsetTop` of the `li`, not the `a`. The 1px rules between items push each one down by 1px, and the measurement picks that up.

The clock:

```js
const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kathmandu' });
function tick() { const t = fmt.format(new Date()); clock.textContent = t; clock.setAttribute('datetime', t); }
tick();
setInterval(tick, 30000);
```

Common mistakes:

- Rotating each letter or using `transform: rotate(-90deg)` on a horizontal block. The box keeps its old width and overflows the rail.
- Four separate pink backgrounds toggled by class. The point is one block that slides.
- Moving the indicator on click and again from the observer, so it jumps twice.
- Pink text on cream. Pink is a ground, never a colour for words.
- Labels in the display face at 10px. They turn to mush. Labels are mono.
- Rounded corners or a shadow on the rail. Every edge is a 2px rule.
- A clock with seconds. It changes too often and pulls the eye.
- Forgetting the left margin on `main`, so the first column of content sits under the rail.

Rebuild order:

1. Build the fixed 88px rail with its three zones.
2. Rotate the wordmark.
3. Add the four numbered links in an `ol`.
4. Add the indicator under the list.
5. Add the foot with the clock and dot.
6. Push `main` right and add four full-height sections.
7. Wire the observer to the indicator and `aria-current`.
8. Add the 1024 and 760 breakpoints and the menu panel.
9. Tab through and check every focus ring.
10. Turn on reduced motion and confirm the block jumps and the dot is still.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
