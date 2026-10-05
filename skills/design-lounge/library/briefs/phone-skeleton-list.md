<!-- Design Lounge Nº 519 · "Skeleton list swap" · www.designlounge.live -->

# Skeleton list swap

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. This is an iOS list: large title, grouped inset card, 44px targets, and safe areas. Do not draw a status bar. The first painted frame is the skeleton, before any timer runs.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The notice board of Reedmark, an invented riverside workshop. Five rows will show an avatar, a title, and two lines. On the first frame those places are blocks: a 44px circle, a title bar, a small time bar, and two text bars. The rows breathe, one after another, on a cool mist page. After 1.4 seconds the blocks swap for the real notices in the same grid, so the card does not jump. Replay puts the blocks back and runs the wait again. The detail worth copying is the calm pulse: opacity from 1 to 0.52 over 1.8 seconds, staggered 160ms per row, not a shiny sweep.

A web card grid that shimmers is `skeleton-to-content-swap`. A pull gesture is `ios-pull-to-refresh`. This one is a phone list that is already a skeleton when it appears.

## Structure

```
390 by 844
padding-top max(54px, safe-area-inset-top), inline 20px
Reedmark                         13px
Notices                    [ Replay 44 ]
Loading notices                  13px, live

card, margin 0 16px, radius 16, 1px rule
  row min-height 96, five times
  [ 44 circle ] [ title bar -------- ] [ time ]
                [ line --------------------- ]
                [ line ------------ ]
padding-bottom max(34px, safe-area-inset-bottom)

These five stay on this phone until the next visit.
```

- `header` holds the kicker, the `h1`, the Replay button, and the status.
- The list is an `ol` with `aria-label="Notices"`. Each `li` contains `.sk` (`aria-hidden="true"`) and `.real`.
- Both layers use the same grid: `44px 1fr`, gap 12px, padding 14px 16px, `min-height: 96px`.
- Skeleton bars are `i` elements inside the hidden skeleton. They are not images.
- Real titles are `b`. The two lines are `p`. The time is a span.
- The footer is one paragraph under the card. It stays during the skeleton and after the swap.
- Replay includes an 18px stroke icon, `aria-hidden`, and the visible word "Replay".

Skeleton geometry inside the text column:

- Title bar: height 14px, width 58 percent, radius 4px.
- Time bar: 48 by 12px, on the right of the title row.
- First line: height 12px, width 100 percent, radius 4px.
- Second line: height 12px, width 72 percent.
- Gap between those bars: 6px.
- Circle: 44px, same bone colour as the bars.

## Motion

| Thing | Trigger | Property | From | To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Row pulse | skeleton visible | opacity | 1 | 0.52 | 1.8s alternate | cubic-bezier(.45, 0, .55, 1) | animation none |
| Stagger | per row | delay | 0 | index times 160ms |  |  | none |
| Swap | 1400ms after the font gate, or Replay | display of the two layers | skeleton shown | real rows shown | 0 | none | wait is 0ms |
| Replay | click | same as the swap, in reverse, then the wait | real rows | skeleton | 0, then 1400ms | none | 0ms wait |

The swap is a display change, not a fade and not a translate. The shared grid is what keeps the card still. Do not add a shimmer gradient. The opacity breath is the only loop, and it is slow enough to sit beside other pieces.

The font gate:

```js
Promise.race([
  document.fonts.ready,
  new Promise((r) => setTimeout(r, 800))
]).then(() => toBones(1400));
```

Under reduced motion, call `toBones(0)` immediately and do not wait for fonts.

## States

- Loading: skeleton visible, status "Loading notices", list `aria-busy="true"` and `aria-hidden="true"`, Replay still works.
- Loaded: real rows visible, status "5 notices", `aria-busy="false"`, `aria-hidden` removed.
- Replay hover: background `rgba(14, 89, 98, .1)`.
- Focus-visible: 2px accent outline, offset 2px, on Replay.
- Empty: not used. The board has five notices.
- Error: not used. The wait always resolves.
- Reduced motion: skeleton still exists as the first HTML frame, then the real rows replace it with no pulse and no 1400ms wait.

## Accessibility

- Replay is a button, at least 44 by 44, with a visible name. The icon is `aria-hidden`.
- The status is `aria-live="polite"`. It changes from "Loading notices" to "5 notices". Do not also make the list a second live region.
- While busy, the list is `aria-hidden` so empty items are not announced as five blank rows. The skeleton blocks are `aria-hidden` as well.
- When the swap finishes, the list is a real ordered list of five items. Titles and lines are text, not images of text.
- Contrast: `#132028` on `#f5f8f9` and `#e6eef2` clears 4.5. `#3d4e58` is the secondary text. `#4a5c66` is the When column on `#f5f8f9`. `#0e5962` is Replay on `#e6eef2`. Initials `#f5f8f9` sit on the dark avatar fills.
- Row separators are `#d3dee4` and are not the only structure. Each loaded row has a title.
- No emoji. No external image. The circle and the bars are CSS.

## Responsive rules

- The frame is 390 by 844. Header padding top is `max(54px, env(safe-area-inset-top))`. Body padding bottom is `max(34px, env(safe-area-inset-bottom))`. Do not draw a clock or a home indicator.
- At 360 wide, the large title is 30px. The title row uses `align-items: flex-start` so a wrapped title does not cover Replay. The card keeps its 16px side margin. Rows stay one column.
- At a 200 percent text size, row titles and the two lines wrap, and the row grows past 96px. The When label stays on the title row and may wrap under the title if the row is narrow. Skeleton bars stay fixed pixel sizes because they are not text. The card does not create a horizontal scrollbar. The page may scroll vertically. `overflow-x: clip` stays on.
- This list is one column. It does not have a two-column row to stack. If a product later puts a title and a value on one line, that pair stacks at 200 percent, with the value under the title, and the row height grows.
- At tablet width, do not stretch the card across 1180px. Cap the card near 420px and keep the same row.

## Acceptance checklist

### Always

- [ ] The first painted frame is the skeleton, with a circle, a title bar, and two lines in each row.
- [ ] The skeleton uses the same grid as the loaded row, so the card does not jump.
- [ ] The pulse is a slow opacity breath. Reduced motion removes it.
- [ ] Reduced motion also removes the 1400ms wait. The swap still happens.
- [ ] Replay returns to the skeleton and restarts the wait. A second click cancels the pending timer.
- [ ] Real rows are not readable text made of placeholder words.
- [ ] Replay is at least 44px. Top clearance is 54px. Bottom clearance is 34px.
- [ ] The list is hidden from assistive tech while busy, and exposed when the rows are real.
- [ ] No status bar is drawn.

### This demo

- [ ] The brand is Reedmark. The title is "Notices". The status goes from "Loading notices" to "5 notices".
- [ ] There are five rows. The first title is "Bench hours on Thursday" by AC, marked Today.
- [ ] The footer reads "These five stay on this phone until the next visit."
- [ ] Bone colour is `#b4c3cb` on card `#f5f8f9`. Page is `#e6eef2`. Replay is `#0e5962`.
- [ ] The wait is 1400ms after fonts are ready, with an 800ms cap on that gate.
- [ ] Pulse is 1.8s, opacity 1 to 0.52, delay 160ms per row.
- [ ] Fonts are Petrona for the large title and Manrope for everything else.
- [ ] The loaded initials are AC, JP, RO, IL, and SV, with the sentences in the table above.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame, before timers: the list has no `show` class. Each row shows `.sk` and hides `.real`. `aria-busy` is `"true"`. The list is `aria-hidden="true"`. The status reads "Loading notices". Replay is visible. The five real notices are in the DOM but not displayed. There is no filler Latin, no label that says "Heading", and no picture with an X.
2. The pulse is on `.sk`: opacity 1 to 0.52, 1.8s, `cubic-bezier(.45, 0, .55, 1)`, infinite alternate. Row `i` delays `i * 160ms`.
3. The 1400ms wait starts when document fonts are ready, or after 800ms, whichever comes first. It does not start before that gate, so a slow font fetch does not eat the skeleton.
4. When the wait ends, the list gains `show`. Skeleton rows hide. Real rows show. `aria-busy` becomes `"false"`. `aria-hidden` is removed. The status becomes "5 notices".
5. Replay at any moment returns to the skeleton immediately, sets the status back to "Loading notices", hides the real rows from assistive tech, and starts a fresh 1400ms wait. A second Replay before the wait ends cancels the previous timer.
6. Under `prefers-reduced-motion: reduce`, the pulse animation is `none`. The wait is 0ms. The swap still happens, on the next task, with no pulse and no 1400ms hold. The HTML first frame is still the skeleton, because the timer has not fired yet.
7. The page does not scroll at 390 by 844. The list is five rows. There is no second page and no pull to refresh.
8. There is no error state and no empty board. A failed load belongs to another piece. This board always resolves to the same five notices.

The five notices, in order:

| Initials | Avatar | Title | When | Line one | Line two |
| --- | --- | --- | --- | --- | --- |
| AC | `#164e56` | Bench hours on Thursday | Today | The oak bench is free from 4 to 7. | Bring extra clamps if you need them. |
| JP | `#1b3e4c` | Clay is still drying | Today | Tuesday's bowls need another night. | Leave that shelf where it is. |
| RO | `#2f4a40` | Linen at the side door | Yesterday | Undyed linen arrives on Friday. | Sign the slip on the clipboard. |
| IL | `#243848` | Lathe induction | Monday | Take the lathe induction first. | The next slot is Monday at 9. |
| SV | `#3a4a42` | Annex key | Monday | The annex key hangs by the kettle. | It does not live in the till. |

Avatar letters are `#f5f8f9`.

## Tokens

```css
:root {
  --bg: #e6eef2;          /* mist page */
  --surface: #f5f8f9;     /* card */
  --ink: #132028;         /* title and row titles */
  --ink-2: #3d4e58;       /* kicker, status, row lines, footer */
  --muted: #4a5c66;       /* the When column */
  --line: #d3dee4;        /* card border and row rules */
  --bone: #b4c3cb;        /* skeleton circle and bars */
  --accent: #0e5962;      /* Replay */
  --serif: "Petrona", Georgia, serif;
  --sans: "Manrope", system-ui, sans-serif;
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

Avatar fills are not the accent. They are darker workshop tones: `#164e56`, `#1b3e4c`, `#2f4a40`, `#243848`, `#3a4a42`. Replay is the only `#0e5962`.

## Typography

| Role | Family | Size | Weight | Line height | Tracking | Colour |
| --- | --- | --- | --- | --- | --- | --- |
| Kicker | Manrope | 13px | 600 | 1.4 | 0 | ink-2 |
| Title | Petrona | 34px | 600 | 1.05 | -0.02em | ink |
| Replay | Manrope | 16px | 700 | 1 | 0 | accent |
| Status, footer | Manrope | 13px | 600 status, 500 footer | 1.4 | 0 | ink-2 |
| Row title | Manrope | 16px | 700 | 1.25 | -0.01em | ink |
| When | Manrope | 13px | 600 | 1 | 0 | muted |
| Row lines | Manrope | 14px | 400 | 1.35 | 0 | ink-2 |
| Initials | Manrope | 13px | 700 | 1 | 0.02em | surface |

The large title is Petrona. Every other role is Manrope. Do not set the row titles in the serif. At 360 wide the large title may drop to 30px and the title row may align to the start so Replay does not collide with a wrapped word.

## Implementation notes

Render both layers in each row. The skeleton is what CSS shows until `.show`.

```css
.real { display: none; }
.card.show .sk { display: none; }
.card.show .real { display: grid; }
.sk {
  animation: breathe 1.8s cubic-bezier(.45, 0, .55, 1) infinite alternate;
  animation-delay: calc(var(--i) * 160ms);
}
@media (prefers-reduced-motion: reduce) {
  .sk { animation: none; }
}
```

One generation counter drops a stale timer when Replay is clicked twice:

```js
function toBones(delay) {
  const gen = ++generation;
  clearTimeout(timer);
  list.classList.remove('show');
  list.setAttribute('aria-busy', 'true');
  list.setAttribute('aria-hidden', 'true');
  status.textContent = 'Loading notices';
  timer = setTimeout(() => {
    if (gen === generation) toContent();
  }, delay);
}
```

Common mistakes:

- Painting the real rows first and covering them after a tick. The HTML must show the skeleton with no class added.
- A shimmer that travels across the bars. This pulse is opacity only.
- Waiting 1400ms even when reduced motion is set.
- Leaving `aria-hidden` off during the skeleton, which announces five empty items.
- Filler Latin, the word "Title", or grey boxes labelled with an X.
- A Replay control under 44px, or a control with only an icon.
- Drawing the status bar above the large title.
- Fading the rows in with a translate. The swap is instant. The grid match is the point.
- Starting the 1400ms clock before the document exists. The clock starts in the script at the end of the body, after the skeleton has already been parsed.

Where it sits:

1. It is the opening state of a phone notice list. The loaded list is the same screen, not a second route.
2. Replay exists so the skeleton can be seen again. A product can drop Replay once the load is real, and keep the same skeleton markup.
3. Map `--bone` to a tint of the locked line, and `--accent` to the locked primary, if a kit is on. Keep the pulse slow.
4. Two families only. Petrona is the large title. Manrope is the list.
5. The footer sentence stays on both frames: "These five stay on this phone until the next visit."
6. Row rules are full width inside the card, `1px solid var(--line)`, not an inset that starts after the avatar.
7. Initials are centred in the 44px circle. The circle does not use an image.
8. A Replay click during the font gate sets `started` so the late gate does not schedule a second wait.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
