<!-- Design Lounge Nº 159 · "Upload file queue" · designlounge.vercel.app -->

# Upload file queue

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Keep the three states: sent, running, rejected.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The drawing upload for a small architecture desk. A 160px dashed drop zone sits under the title "Drawings". Below it, a card lists files. plan-level-2.pdf is already sent. section-aa.png is in progress and advances. site-notes.heic is rejected because HEIC is not accepted. Dropping, clicking, or pressing Enter on the zone adds sheet-0N.pdf at 8 percent, which then climbs. The queue does not leave the page.

## Structure

```
padding 36px 48px
h1 Drawings
deck
drop zone 160px, dashed
ul card
  row: name + meta | state
       bar full width, 4px
```

- Drop zone is a `div` with `role="button"`, tabindex 0, label "Add files".
- List is a `ul`. Each file is an `li`.
- Do not use a real file input if it would open the OS dialog in the demo. The zone adds a sample sheet. In a product build, the same row component receives real `File` objects.

## Motion

| What | Trigger | Property | From → to | Duration | Easing | Reduced |
| --- | --- | --- | --- | --- | --- | --- |
| Bar | progress tick | width | previous → next | 400ms | standard | instant width |
| Tick | timer | — | +12% | every 700ms | — | same ticks, no width transition |

The timer stops when no row is running. It starts again when a file is added.

## States

- Zone rest, keyboard focus, drag-over.
- Row running, done, rejected.
- Bar colour follows the row state. Done is full width `--success`. Rejected stays at 40% `--danger` and never becomes Sent.

## Accessibility

- Zone is a button in the accessibility tree, with an accessible name.
- Enter and Space activate it.
- List is a polite live region.
- Do not rely on green and red alone: the words Sent and Rejected are visible.
- Focus ring 2px `--focus`.
- Contrast of state colours on `--surface` is above 4.5.

## Responsive rules

- At 1280 and 1024, page padding is 36px 48px and the zone is 160px tall.
- At 768, padding becomes 24px and the row stays two columns.
- Below 640, the state label drops under the file name, and the bar remains full width under both.

## Acceptance checklist

- [ ] Zone is 160px with a dashed border.
- [ ] Three initial rows: sent, 62 percent, rejected HEIC.
- [ ] Running rows advance by 12 points about every 700ms and stop at Sent.
- [ ] Click, Enter, and drop add a new PDF at 8 percent.
- [ ] Drag-over tints the zone and does not navigate.
- [ ] Rejected row never turns into Sent.
- [ ] Names are Plex Sans. Sizes are Plex Mono.
- [ ] Reduced motion removes the bar width transition.
- [ ] The ticker is not left running when every row has settled.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: three rows. Sent row has a full green bar and the word Sent. Running row starts at 62 percent with a primary bar. Rejected row has a 40 percent danger bar and the meta line "HEIC is not accepted".
2. Every 700ms, each running row gains 12 percent, capped at 100. At 100 the label becomes Sent, the bar turns `--success`, and the row stops.
3. Click the drop zone, press Enter or Space on it, or drop a file: append `sheet-0N.pdf`, 1.1 MB, starting at 8 percent, then start the ticker if it had stopped.
4. Drag over the zone: background `--primary-soft`, border `--primary`. Drag leave or drop removes that state. Drop also adds a file and does not navigate.
5. The list is `aria-live="polite"` so the new name is announced.
6. There is no separate upload button besides the zone.
7. Reduced motion: the bar width still updates, but it does not transition.

## Tokens

```css
:root {
  --bg: #f4f1ea;
  --surface: #fffdf8;
  --surface-2: #efeae0;
  --ink: #1c1915;
  --ink-2: #5e574e;
  --ink-3: #8a8176;
  --line: #e0d8cc;
  --line-strong: #cfc4b4;
  --primary: #8a4b12;
  --success: #2f6b45;
  --success-soft: #e5f2ea;
  --danger: #8d2f2f;
  --focus: #8a4b12;
  --font-text: "IBM Plex Sans", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  --radius: 8px;
  --zone: 160px;
  --bar: 4px;
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
}
```

## Typography

- Title: IBM Plex Sans 500, 28px, tracking -0.03em.
- Deck: 14px, `--ink-2`.
- File name: 14px, weight 500.
- Meta and sizes: IBM Plex Mono 12px, `--ink-3`.
- State label: 12px, weight 600. Sent is `--success`. Rejected is `--danger`. Percent is `--ink`.

## Implementation notes

Stop the timer when `li.run` is empty. An interval that runs forever will keep waking the page after the queue is done.

The product version should reject by type and size before a row is marked running. HEIC and files over 20 MB use the rejected row. Do not show a browser alert.

Progress in the demo is fake. In the product, set the width from the upload event's loaded/total. The row markup stays the same.

Rebuild in this order:

1. Page padding 36px 48px. Background `#f4f1ea`. Text `#1c1915`.
2. Title 28px, weight 500, tracking -0.03em. Deck 14px `#5e574e`, margin-bottom 22px.
3. Zone height 160, radius 8, dashed border 1.5px `#cfc4b4`, fill `#fffdf8`.
4. Zone title 14px weight 600. Zone hint 13px `#5e574e`.
5. Drag-over fill `#f3e6d8`, border `#8a4b12`.
6. List card fill `#fffdf8`, border `#e0d8cc`, radius 8, no shadow.
7. Row padding 12px 14px, grid name-block and state, then a 4px bar across both columns. Row gap 4px 16px.
8. Name 14px weight 500. Meta IBM Plex Mono 12px `#8a8176`.
9. Sent bar full, colour `#2f6b45`, label Sent in that colour, weight 600, 12px.
10. Running bar colour `#8a4b12`. Label is the percent.
11. Rejected bar width 40%, colour `#8d2f2f`. Meta reads "HEIC is not accepted".
12. Bar track `#efeae0`, radius 99px. Width transition 400ms, standard ease, removed under reduced motion.
13. Tick is +12 percentage points, not +12 pixels, every 700ms, cap 100.
14. New files are named sheet-04.pdf onward, 1.1 MB, start at 8%.
15. Do not open an alert. Do not leave a timer running when no row has the running class.

Common mistakes to avoid:

- Using a file input that opens the OS dialog in the demo. Add a sample row instead.
- Letting HEIC reach 100 percent.
- Painting the whole row red. Only the bar and the state word use danger.
- A progress bar taller than 4px.
- Showing remaining time. The demo does not estimate seconds.
- Restarting plan-level-2.pdf. It begins done and stays done.
- Using a circular spinner beside the bar. The bar is the progress.
- Forgetting preventDefault on drop, which navigates the iframe.
- Running the tick every 16ms. The step is 700ms.
- Adding a cancel icon on the sent row. Sent has no further action in this piece.
- Writing the percent in mono. The percent is Plex Sans. The file size is mono.
- Putting the drop zone below the list. The zone is first.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
