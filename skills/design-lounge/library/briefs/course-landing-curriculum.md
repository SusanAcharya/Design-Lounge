<!-- Design Lounge Nº 206 · "Course landing with curriculum" · www.designlounge.live -->

# Course landing with curriculum

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The sales page for one online course on a fictional learning site, Lectern. The course is "Data journalism: from spreadsheet to story" by Dr Amara Okonjo. It reads like a university press page: warm white paper, deep navy serif headings, 8px corners, 1px rules, and one green used only for checks, preview links and the free-lesson icon. The hero has a price card with a CSS-drawn video poster. Below it, a learning checklist, a six-module curriculum accordion, an FAQ, and an instructor card. Once the hero's Enroll button scrolls away, a navy enroll bar slides up from the bottom. The detail worth copying is the honest discount: a dated price with a plain sentence about when it ends, and no countdown timer.

## Structure

```
1280 × 800, content max 1280, side padding 56px, grid minmax(0,1fr) 380px, gap 56px
┌──────────────────────────────────────────────────────────────────────┐
│ [lectern] Lectern   Courses  Teachers  For teams              Sign in │ 64
├──────────────────────────────────────────────────────────────────────┤
│ JOURNALISM · INTERMEDIATE (green 12px)        ┌──────────────────────┐│
│ Data journalism: from                         │  poster 16:9 navy    ││
│ spreadsheet to story   (52px serif, 16ch)     │  grid + bars + play  ││
│ Six modules on finding… (21px serif, 44ch)    ├──────────────────────┤│
│ (AO) Dr Amara Okonjo  4.8 ★★★★★ 2,316 · 18,402│ $129 $189   Save $60 ││
│ [ Enroll for $129 ] [ ▷ Preview lesson ]      │ Autumn term price…   ││
│ ══════════════════════════════════ 2px navy   │ [   Enroll now    ]  ││
│ LEVEL      PACE       FORMAT        CAPTIONS  │ [  Add to my list ]  ││
│ Intermed.  4–6 weeks  Video and…    English…  │ ▢ 5 h of video, 31 … ││
│                                               └──────────────────────┘│
├──────────────────────────────────────────────────────────────────────┤
│ What you'll learn  [✓ ×6 in 2 columns]        ┌ instructor (sticky) ┐│
│ Curriculum   6 modules · 31 lessons · 5 h · Expand all  │ (AO) 72px   ││
│ ┌ 01  Finding the story      5 lessons · 42 min  ^ ┐   │ bio, 3 facts││
│ │     ▷ 1.1 Welcome…              Preview   04:10 │   └─────────────┘│
│ │     x 1.3 Asking…               Locked    09:05 │                   │
│ ├ 02  Cleaning without lying  6 lessons · 58 min v ┤                   │
│ Questions  (4 rows, 1px rules)                                        │
└──────────────────────────────────────────────────────────────────────┘
[ fixed bottom bar 72px navy: title + instructor · $129 $189 · [Enroll now] ]
```

- `header.top` holds the logo link, `nav aria-label="Primary"`, and a Sign in link.
- The hero is a two-column grid. The left column holds the eyebrow `p`, the `h1`, the subtitle, the meta row, the two buttons, and a `dl.glance` of four facts. The right column is `div.card`: a `button.poster` then `div.cbody`.
- The lower part is the same grid. `main` holds three `section`s labelled by their `h2`. `aside.rail` holds the instructor card.
- Each module is `div.mod > h3 > button.mbtn` plus `div.panel[role=region]`. Lessons are an `ol` of `li.les`.
- Each FAQ item is `div.q > h3 > button.qb` plus `div.panel[role=region] > div > p`.
- The enroll bar is `div.bar[role=region][aria-label=Enroll]`, `position: fixed`, bottom 0.
- The preview is a native `dialog` opened with `showModal()`.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Accordion panel | header click | `grid-template-rows` | 0fr → 1fr | 320ms | `--ease` | instant |
| Chevron | header click | `transform` | 0 → rotate(180deg) | 280ms | `--ease` | instant |
| Dialog | open | `opacity`, `transform` | 0, translateY(12px) → 1, none | 320ms | `--out` | none |
| Enroll bar | hero button leaves top | `transform` | translateY(100%) → none | 340ms | `--out` | instant |
| Play disc | poster hover | `transform` | scale(1) → scale(1.06) | 200ms | `--out` | 1ms |
| Buttons | hover | `background` | base → hover | 160ms | `--ease` | 1ms |

The bar hides with `visibility` delayed by 340ms so it finishes sliding before it leaves the tab order.

## States

- Primary button: navy fill, warm-white text. Hover `--navy-2`.
- Ghost button: 1px navy border, no fill. Hover `--surface`.
- Module header hover: background `--bg`. Open: `aria-expanded="true"`, chevron up.
- Lesson free: green play icon, green underlined `Preview` button. Locked: grey lock, grey `Locked` label. Locked rows are not clickable.
- Expand all text toggles to `Collapse all` only when every module is open.
- Enroll bar hidden: `translateY(100%)`, `visibility: hidden`. Shown: class `on`.
- Focus-visible: 2px solid `--green`, offset 2px. Inside the navy bar, the ring is `#8fc2a6`.
- Closed panels have `inert` on their inner wrapper so hidden Preview buttons cannot be tabbed into.
- There is no loading or error state on this frame. The price is static.

## Accessibility

- One `h1`. Section headings are `h2`. Module and FAQ headers are `h3` elements that wrap a `button`, per the accordion pattern.
- Each header button has `aria-expanded` and `aria-controls`. Each panel has `role="region"` and `aria-labelledby` pointing back to its button.
- Enter and Space toggle because the headers are real buttons. Tab moves header to header, and into an open panel's Preview buttons.
- The rating stars are `aria-hidden`; the visible `4.8` and `2,316 ratings` carry the meaning.
- The card poster is a `button` with `aria-label="Preview lesson 1.2, Finding the story in a column of numbers, 7 minutes"`.
- The dialog is native, labelled by its heading. `showModal()` traps focus and Esc closes it. The poster inside is `role="img"` with a short label.
- The enroll bar is a labelled region. It is removed from the tab order while hidden.
- Contrast: navy on warm white is about 15:1. `#4a5068` passes 7:1. Green `#2e6b4e` on `#fffdf8` passes 6:1. Warm white on navy passes 14:1.
- Hit targets: module headers 64px, FAQ rows 56px, buttons 48px, close button 40px.

## Responsive rules

- ≥1280: as drawn. Padding 56px. Grid `minmax(0,1fr) 380px`, gap 56px.
- 1024 (max-width 1100px): padding 36px. Right column 340px, gap 36px. `h1` 46px.
- 768 (max-width 860px): one column. Header links hide. The price card follows the hero text, max 520px wide. The instructor card follows the FAQ and is not sticky.
- <640: padding 18px. `h1` 36px, subtitle 18px. Glance strip 2×2. Learn list one column. Module header becomes title over meta, with the chevron on the right; the module number hides. Lesson rows drop the duration column; the action stays. The bar hides its title and shows price on the left and Enroll on the right.
- Never scroll sideways at 390px. Every grid column uses `minmax(0, …)`.
- Keep 120px of bottom padding on the page so the fixed bar never covers the last FAQ row.

## Acceptance checklist

### Always

- [ ] The discount states a plain end date and the full price after it. No countdown, no "only 3 left".
- [ ] One accent colour (green), used only for checks, preview links, free icons, the eyebrow and focus.
- [ ] Module and FAQ headers are buttons inside headings, with `aria-expanded` and `aria-controls`.
- [ ] Module meta shows lesson count and total duration, computed from the lesson list.
- [ ] Every lesson row shows either a free-preview action or a lock, never both.
- [ ] Preview opens a modal dialog that closes on Esc, × and backdrop, and returns focus.
- [ ] The enroll bar appears only after the hero's primary button scrolls above the viewport, and cannot be tabbed into while hidden.
- [ ] Closed panels are `inert`.
- [ ] All corners 8px; regions separated by 1px rules, no drop shadows.
- [ ] No horizontal scroll at 390px.

### This demo

- [ ] Title `Data journalism: from spreadsheet to story`, instructor Dr Amara Okonjo, 4.8 from 2,316 ratings, 18,402 students.
- [ ] Price `$129`, struck `$189`, `Save $60`, ends 31 October.
- [ ] Curriculum summary reads `6 modules · 31 lessons · 5 h`; module 01 is open with 5 lessons · 42 min.
- [ ] Free previews are 1.1, 1.2 and 2.2.
- [ ] FAQ has four questions, including `Is the discount real?`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame at 1280×800: header (64px), the hero with title, subtitle, instructor and rating row, two buttons, a four-fact strip, and the price card on the right. The top of "What you'll learn" shows at the bottom edge.
2. The price card shows `$129`, struck `$189`, a green `Save $60` pill, and the sentence `Autumn term price, the same for everyone until 31 October. After that it returns to $189.`
3. Click `Preview lesson`, the poster in the card, or any `Preview` link in the curriculum. A modal dialog opens with a 320ms rise (opacity 0 → 1, translateY 12px → 0). Its header reads `Lesson preview` and the lesson name with its length. Below is a 16:9 CSS-drawn video poster with a play disc, a green progress bar at 18%, `01:23` and the lesson length.
4. Close the modal with the × button, Esc, or a click on the backdrop. Focus returns to the control that opened it.
5. The curriculum header reads `6 modules · 31 lessons · 5 h` and has an `Expand all` text button. These totals are computed from the lesson data, never typed.
6. Module 01 is open at load. Every other module is closed.
7. Click a module header. Its panel opens or closes over 320ms (grid rows 0fr → 1fr) and the chevron turns 180° over 280ms. Several modules may be open at once.
8. When every module is open the text button reads `Collapse all`; clicking it closes all. Otherwise it reads `Expand all` and opens all.
9. Each lesson row shows an icon, `1.2 Lesson name`, a right-side action, and a tabular duration. Free lessons have a green play-circle icon and a green underlined `Preview` button. Locked lessons have a grey lock icon and the word `Locked`.
10. The FAQ has four questions, all closed. Each opens and closes the same way as a module.
11. Scroll until the hero's `Enroll for $129` button is above the viewport. The enroll bar slides up from the bottom over 340ms (expo out). Scroll back up until the button is visible and the bar slides away. While hidden, the bar is `visibility: hidden` so it cannot be tabbed into.
12. The instructor card in the right rail is sticky at `top: 24px` on desktop.
13. Reduced motion: no rise, no slide, no row animation. Panels and the bar switch instantly.

## Tokens

```css
:root {
  --bg: #faf7f1;        /* warm white page */
  --surface: #fffdf8;   /* cards, accordion, dialog */
  --navy: #15234a;      /* headings, text, primary button, bar */
  --navy-2: #24356a;    /* primary hover */
  --ink-2: #4a5068;     /* body copy */
  --ink-3: #6b7086;     /* meta, durations, lock icon */
  --line: #e3ddd0;      /* 1px rules and borders */
  --green: #2e6b4e;     /* the one accent: checks, preview, eyebrow, focus */
  --green-t: #e3efe7;   /* Save pill */
  --gold: #b7862c;      /* rating stars only */
  --poster-hi: #8fc2a6; /* highlighted bar and progress on navy */

  --serif: "Newsreader", Georgia, serif;
  --sans: "Public Sans", system-ui, sans-serif;

  --fs-11: 11px; --fs-12: 12px; --fs-13: 13px; --fs-14: 14px; --fs-15: 15px;
  --fs-17: 17px; --fs-18: 18px; --fs-19: 19px; --fs-21: 21px; --fs-22: 22px;
  --fs-32: 32px; --fs-40: 40px; --fs-52: 52px;

  --s-8: 8px; --s-12: 12px; --s-16: 16px; --s-24: 24px; --s-36: 36px;
  --s-48: 48px; --s-56: 56px;

  --r: 8px;
  --shadow: none;
  --t-micro: 160ms; --t-chev: 280ms; --t-panel: 320ms; --t-bar: 340ms;
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Logo | Newsreader | 22px | 600 | 1 | 0 | Title |
| `h1` | Newsreader | 52px | 500 | 1.04 | -0.015em | Sentence, max 16ch |
| Subtitle | Newsreader | 21px | 500 | 1.45 | 0 | Sentence, max 44ch |
| `h2` | Newsreader | 32px | 500 | 1.15 | 0 | Sentence |
| Module title | Newsreader | 19px | 600 | 1.3 | 0 | Sentence |
| FAQ question | Newsreader | 18px | 500 | 1.35 | 0 | Sentence |
| Price | Newsreader | 40px | 600 | 1 | 0 | `$129` |
| Glance value | Newsreader | 17px | 500 | 1.3 | 0 | Sentence |
| Eyebrow | Public Sans | 12px | 600 | 1.4 | 0.14em | UPPER, green |
| Labels | Public Sans | 11px | 600 | 1.4 | 0.14em | UPPER |
| Body | Public Sans | 15px | 400 | 1.6 | 0 | Sentence |
| Lesson row | Public Sans | 14px | 400 | 1.5 | 0 | Sentence |
| Buttons | Public Sans | 15px | 600 | 1 | 0 | Sentence |

Durations use `font-variant-numeric: tabular-nums` so the column lines up.

## Implementation notes

**1. Height animation without measuring.** Animate grid rows from `0fr` to `1fr`. The child needs `overflow: hidden`. Put `inert` on the child when closed.

```css
.panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .32s var(--ease); }
.panel > div { overflow: hidden; }
.panel.open { grid-template-rows: 1fr; }
.mbtn[aria-expanded="true"] .chev { transform: rotate(180deg); }
```

```js
function toggle(btn, open) {
  const panel = document.getElementById(btn.getAttribute('aria-controls'));
  open = open ?? btn.getAttribute('aria-expanded') !== 'true';
  btn.setAttribute('aria-expanded', open);
  panel.classList.toggle('open', open);
  panel.firstElementChild.inert = !open;
}
```

**2. Totals from data.** Store lessons as `[name, "mm:ss", isFree]`. Sum seconds, then round to whole minutes before splitting into hours, or you get `4 h 60 min`.

```js
const sec = t => { const [m, s] = t.split(':'); return +m * 60 + +s; };
const fmt = s => {
  const t = Math.round(s / 60), h = Math.floor(t / 60), m = t % 60;
  return h ? h + ' h' + (m ? ' ' + m + ' min' : '') : m + ' min';
};
```

**3. Enroll bar trigger.** Observe the hero's primary button. Show the bar only when it is out of view above the top, not when the page first loads with it below the fold.

```js
new IntersectionObserver(([e]) => {
  bar.classList.toggle('on', !e.isIntersecting && e.boundingClientRect.top < 0);
}).observe(document.getElementById('enrollTop'));
```

```css
.bar { position: fixed; inset: auto 0 0; transform: translateY(100%); visibility: hidden;
       transition: transform .34s var(--out), visibility 0s .34s; }
.bar.on { transform: none; visibility: visible; transition: transform .34s var(--out); }
```

The poster is drawn, not an image: a navy box, a grid from two `repeating-linear-gradient`s at 14% white, six flex bars at 28% white with one green bar at 96% height, and a 64px warm-white play disc.

Common mistakes:

- A countdown timer or a fake "price goes up in 02:14:09". The honest sentence is the point of this piece.
- Using `<details>` for the curriculum and then adding a second set of ARIA. Pick buttons with `aria-expanded` and stay consistent.
- Leaving Preview buttons focusable inside closed panels.
- A sticky bar that is visible on the first frame, covering the hero button it duplicates.
- Typing module durations by hand. They drift from the lessons.
- A purple gradient hero or a video thumbnail with a glow. The page is paper and ink.
- Making the right card sticky as well as showing the bar. Use one sticky purchase surface at a time; here the rail holds the instructor.

Rebuild order:

1. Set tokens, header, and the two-column grid.
2. Build the hero text, meta row, buttons and glance strip.
3. Build the price card with the drawn poster.
4. Add the learn checklist.
5. Generate the curriculum from data and wire the accordion.
6. Add the FAQ with the same toggle.
7. Add the preview dialog and wire every preview trigger.
8. Add the enroll bar and its observer.
9. Check 1024, 768 and 390.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
