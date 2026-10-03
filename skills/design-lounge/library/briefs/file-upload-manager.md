<!-- Design Lounge Nº 230 · "File upload manager" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# File upload manager

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Keep one accent for progress and the primary button, and a second warm colour only for failure.

## What it is

The upload screen of Depot, a file desk for a film post house. Rushes for day 3 of a documentary are going up. On the left is a tall dropzone with a real Browse button. On the right is the queue: a large total percent, a total bar, and one row per file with a type badge, live speed, time left, and controls. The look is dark and industrial: graphite panels, off-white type, mono numbers, 4px corners, hairline rules, and one electric lime for progress. The details worth copying are the dropzone that flips to off-white when a file is dragged over it, and the row meta line that reads like a machine log: `48%  39.7 MB/s  0:32 left  1.16 GB / 2.40 GB`.

## Reference behaviour

1. First frame: seven rows. Two are uploading (A001_C014_0912.mov at 46%, boom_scene12_take3.wav at 72%). Two are done (a PDF and a CUBE file). One failed at 61% (drone_pass_04.mp4). One is paused at 18%. One is queued.
2. The header shows the bytes sent of the total, a 56px lime percent, a 6px total bar, and a count line: "2 of 7 done · 2 uploading · 1 paused · 1 failed · 1 queued".
3. Every 250ms, each uploading row gains bytes at its speed. Speed drifts by up to ±1.5 MB/s per tick, kept between 6 and 64 MB/s. Time left is remaining bytes divided by speed.
4. At most two files upload at once. When one finishes, the next queued file starts.
5. A finished row shows "Uploaded", its size, a lime check, and a darker filled badge. Its bar goes away. The live region says "boom_scene12_take3.wav uploaded".
6. Pause on an uploading or queued row sets it to "Paused 48%" with a dashed grey bar. The button becomes Resume (play icon). Resume puts it back in the queue.
7. The failed row reads "Failed at 61%  Connection dropped" in coral, with a coral bar and a coral outlined Retry button. Retry puts it back in the queue and it carries on from 61%.
8. The X on any unfinished row cancels it and removes the row. On a finished row the same X is "Remove". Focus moves to the next row's first button, or to Browse if the list is empty.
9. "Pause all" pauses every uploading and queued row and becomes "Resume all". "Clear finished" removes done rows.
10. Browse files opens the real system file picker, accepting any type, several at once. Each picked file joins the queue with its real name and size. The line under the dropzone reads "2 files added: grade_notes_v3.txt, mix_stem_dialogue.wav". After three names it says "and N more".
11. Dragging files over the dropzone inverts it: off-white ground, graphite text, solid border. The heading changes to "Release to add 2 files". Leaving or dropping restores it. Dropping adds the files. Dropping anywhere else on the page does nothing.
12. When nothing is uploading or queued, the live region says "All uploads complete", or "Uploads stopped. One file needs a retry." if a row failed.
13. Reduced motion: bars jump to their new width, the sheen on uploading bars is off, and the dropzone swaps colours with no fade.

## Structure

```
1280 x 800
+--------------------------------------------------------------------------+
| top bar 52: [#] DEPOT  northbank-post / harbour-doc / rushes / day-03    |
+--------------------------+-----------------------------------------------+
| left 420, padding 24     | head, padding 24 28                           |
| +----------------------+ | UPLOAD QUEUE                          38%     |
| | DROP ZONE   ANY TYPE | | 2.18 GB of 5.68 GB                            |
| |  [up arrow 64]       | | [=========---------------] 6px                |
| |                      | | 2 of 7 done · 2 uploading ... [Pause all][Clear]|
| | Drop files           | +-----------------------------------------------+
| | to upload (44px)     | | [MOV] A001_C014_0912.mov             [||] [x] |
| | copy, 30ch           | |       48% 39.7 MB/s 0:32 left 1.16/2.40 GB    |
| | [Browse files]       | |       [======-------] 3px                     |
| +----------------------+ | [PDF] interview_lighting_plot.pdf     ok  [x] |
| 2 files added: ...       | [MP4] drone_pass_04.mp4          [Retry] [x]  |
| [Destination|Parallel|Free]| ...                                         |
+--------------------------+-----------------------------------------------+
```

- The app is a fixed full-viewport grid: rows `52px minmax(0,1fr)`, body columns `420px minmax(0,1fr)`.
- The top bar is a `header` with the logo, the destination path in mono, and the user.
- The left side is a `section` labelled "Add files". The dropzone is a `div` with an `h2`, a `p`, a `button` "Browse files", and a hidden `input type="file" multiple`.
- The picked line is a `p` with `aria-live="polite"`. Under it is a `dl` of three facts: Destination, Parallel, Free space.
- The right side is a `section` labelled by the `h1` "Upload queue". The total bar is a `div role="progressbar"`.
- The queue is a `ul`. Each row is an `li` grid: `52px minmax(0,1fr) auto`. The badge spans two rows. Name on row 1, meta on row 2, bar under the meta in column 2. Controls span two rows in column 3.
- Each row bar is `role="progressbar"` labelled with the file name and `aria-valuenow`.
- One visually hidden `p aria-live="polite"` announces state changes.

## Tokens

```css
:root {
  --bg: #141518;        /* graphite page */
  --panel: #1b1d21;     /* dropzone */
  --raise: #23262b;     /* bar track, done badge, hover */
  --line: #2c2f35;      /* hairlines */
  --line-2: #3a3e45;    /* dashed border, outlines */
  --ink: #ebe9e3;       /* off-white text */
  --ink-2: #b4b1a9;     /* secondary text */
  --ink-3: #8c8981;     /* labels, meta */
  --lime: #c8f53c;      /* the accent: progress, percent, primary */
  --lime-ink: #141518;  /* text on lime */
  --err: #ff7a66;       /* failure only */
  --focus: #c8f53c;

  --sans: "Archivo", system-ui, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, Menlo, monospace;

  --r: 4px;
  --r-bar: 2px;

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-7: 28px;

  --bar-total: 6px;
  --bar-row: 3px;

  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
  --t-zone: 180ms;
  --t-bar: 250ms;       /* equals the tick, linear */
  --t-total: 300ms;
  --tick: 250ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Dropzone heading | Archivo | 44px | 800 | 0.95 | -0.03em | Sentence |
| Total percent | JetBrains Mono | 56px (% sign 24px) | 500 | 0.85 | -0.04em | Number |
| Logo | Archivo | 13px | 800 | 1 | 0.02em | Upper |
| Queue title | Archivo | 13px | 600 | 1.3 | 0.08em | Upper |
| File name | Archivo | 14px | 500 | 1.45 | 0 | As named |
| Body copy | Archivo | 14px | 400 | 1.45 | 0 | Sentence |
| Button | Archivo | 13-14px | 600 | 1 | 0 | Sentence |
| Row meta, totals, path | JetBrains Mono | 12-13px | 400 | 1.5 | 0 | As written |
| Badge | JetBrains Mono | 11px | 500 | 1 | 0.04em | Upper |
| Zone tag, fact label | JetBrains Mono | 10-11px | 400 | 1 | 0.06-0.08em | Upper |

- Every number is mono. Every word a person reads first is the grotesk.
- The badge is the file extension, up to four letters, uppercased. No icon per file type.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Row bar | each tick | width | old → new % | 250ms | linear (matches the tick) | jump |
| Uploading sheen | while uploading | background-position | 100% → -100% | 1.6s loop | linear | off |
| Total bar | each tick | width | old → new % | 300ms | `--ease` | jump |
| Dropzone invert | dragenter / leave | background, colour, border | graphite → off-white | 180ms | `--ease` | instant |
| Added row | file added | scroll into view | — | smooth | browser | instant |

- The sheen is a soft lighter band (`#efffb5`) crossing a lime bar. Keep it on uploading rows only. Paused, failed, and queued bars do not move.
- Numbers do not animate. They update on the tick.

## States

- Uploading: lime percent, lime bar with sheen, speed, time left, bytes sent of total, Pause button.
- Queued: "Queued", total size, grey bar at 0, Pause button (so you can hold it back).
- Paused: "Paused 18%", dashed grey bar (6px dash, 3px gap), Resume button.
- Failed: coral "Failed at 61%", "Connection dropped", coral bar, coral outlined Retry with an icon and the word. Under 640px Retry shows the icon only.
- Done: "Uploaded", size, lime check, badge filled `--raise`, no bar.
- Dropzone over: `--ink` ground, `--bg` text, solid border, Browse becomes graphite with off-white text.
- Browse hover: lime lightens to `#d8ff5c`.
- Icon buttons: 36px, `--ink-2`. Hover: `--raise` fill and `--ink`.
- Ghost buttons (Pause all, Clear finished): 32px, 1px `--line-2`. Hover: border `--ink-2`. Pause all is disabled when only done and failed rows remain.
- Empty queue: "Queue is empty. Drop files on the left to start." in mono, `--ink-3`.
- Focus-visible everywhere: 2px lime outline, offset 2px.

## Accessibility

- One `h1`, "Upload queue". The dropzone heading is an `h2`.
- Browse files is a real button. It opens the hidden file input. Keyboard users never need drag and drop.
- Each control names its file: "Pause A001_C014_0912.mov", "Retry drone_pass_04.mp4", "Cancel stills_contact_sheet.zip", "Remove interview_lighting_plot.pdf".
- Each row bar is a `progressbar` with `aria-valuenow` updated on every tick. Bars are not live regions.
- The live region announces only state changes: uploaded, paused, resumed, retrying, canceled, removed, all paused, all complete. Never every percent.
- The picked line is its own polite live region so the chosen names are read.
- After a row is removed, focus goes to the next row, not to the top of the page. After pause, resume, or retry, focus stays on the same row's first button.
- The big percent is `aria-hidden`. The total bar carries the value.
- Contrast: `#ebe9e3` on `#141518` is about 15:1. `#8c8981` on `#141518` is about 5.6:1. Lime on graphite is about 14:1. Coral `#ff7a66` on graphite is about 7.4:1. Graphite on lime clears 4.5 for the button.
- Hit targets: 36px icon buttons, 44px Browse. Keep them at 390px.

## Responsive rules

- ≥1280: left column 420px, queue fills the rest. The page itself does not scroll; the queue list scrolls.
- 1024 (≤1100px): left column 340px. Dropzone heading 36px. Percent 44px.
- 768 (≤820px): one column. The page scrolls. The dropzone sits on top at 260px tall, then the facts, then the queue with every row visible.
- <640: padding 16px. Dropzone 230px tall, heading 32px, arrow 44px. Percent 40px. The count line takes its own row above the two buttons. Rows use a 40px badge column. Hide speed, and hide the bytes on uploading rows, so the line shows percent and time left. Retry shows only its icon. The user name in the top bar is hidden.
- Never scroll the page sideways. Long file names and the path truncate with an ellipsis.

## Acceptance checklist

### Always

- [ ] Browse opens a real file picker that accepts any type and several files.
- [ ] Picked or dropped files join the queue with their real names and sizes, and the names are shown and announced.
- [ ] Dragging over the dropzone inverts its colours and changes the heading. Leaving restores it.
- [ ] No more than two uploads run at once. The next queued file starts when one finishes.
- [ ] Uploading rows show percent, speed, time left, and bytes, updated every 250ms.
- [ ] Pause, resume, cancel, and retry work per row. Pause all and Clear finished work for the list.
- [ ] Failure uses a second colour and a labelled Retry, not only a red bar.
- [ ] The header shows total percent and total bytes, and they move with the rows.
- [ ] Live regions announce state changes only.
- [ ] Focus is visible and lands on a sensible control after every action.
- [ ] Reduced motion removes the sheen and bar easing.
- [ ] No sideways scroll at 390px.

### This demo

- [ ] The product is "Depot". The path is "northbank-post / harbour-doc / rushes / day-03".
- [ ] Seven starting rows, including drone_pass_04.mp4 failed at 61% and A001_C015_0912.mov paused at 18%.
- [ ] The page is `#141518`, text `#ebe9e3`, accent `#c8f53c`, failure `#ff7a66`, radius 4px.

## Implementation notes

**1. One tick, two kinds of redraw.** Most ticks only change numbers. Patch the meta line and the bar of uploading rows. Rebuild the list only when a row changes state, and restore focus when you do. Rebuilding every 250ms throws focus away.

```js
setInterval(() => {
  const now = performance.now(), dt = Math.min(1, (now - last) / 1000); last = now;
  let changed = false;
  files.forEach(f => {
    if (f.st !== 'up') return;
    f.sp = Math.max(6, Math.min(64, f.sp + (Math.random() - 0.5) * 3));
    f.done = Math.min(1, f.done + f.sp * MB * dt / f.size);
    if (f.done >= 1) { f.st = 'done'; changed = true; say(f.n + ' uploaded'); }
  });
  if (changed) { schedule(); draw(true); } else draw(false);  // full vs. patch
}, 250);
```

Use real elapsed time (`dt`), not a fixed step. Background tabs throttle timers, and a fixed step makes speed lie.

**2. Drag state needs a counter.** `dragleave` fires every time the pointer crosses a child element. Count enters and leaves, and only clear the state at zero. Also cancel `dragover` and `drop` on `window` so a missed drop does not open the file in the tab.

```js
let depth = 0;
zone.addEventListener('dragenter', e => { e.preventDefault(); if (++depth === 1) zone.classList.add('over'); });
zone.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
zone.addEventListener('dragleave', () => { if (--depth <= 0) { depth = 0; zone.classList.remove('over'); } });
zone.addEventListener('drop', e => { e.preventDefault(); depth = 0; zone.classList.remove('over'); add(e.dataTransfer.files); });
addEventListener('dragover', e => e.preventDefault());
addEventListener('drop', e => e.preventDefault());
```

**3. The inverted zone is a token swap.**

```css
.zone { background: var(--panel); color: var(--ink); border: 1.5px dashed var(--line-2);
  transition: background .18s var(--ease), color .18s var(--ease), border-color .18s var(--ease); }
.zone.over { background: var(--ink); color: var(--bg); border: 1.5px solid var(--bg); }
.zone.over .browse { background: var(--bg); color: var(--ink); }
```

Common mistakes:

- A small dropzone with a cloud icon. This one is the full height of the left column and the heading is 44px.
- A lime glow or a blur behind the dropzone. Inversion is the only drag signal.
- Showing every percent in a live region. It floods screen readers.
- Using red for both cancel and failure. Cancel is a plain X. Coral means it failed.
- A per-file-type icon set. The extension badge is enough.
- Proportional digits for speed and time left. They jitter every tick. Use mono.
- Making the dropzone itself focusable as well as the Browse button, which gives two tab stops for one action.
- Resetting a retried file to 0%. It resumes from where it failed.

Rebuild order:

1. Tokens, the top bar, and the two-column grid.
2. The dropzone with Browse and the hidden file input.
3. The queue rows from an array, all five states.
4. The header totals from the same array.
5. The tick with speed, time left, and the two-upload limit.
6. Row controls and the list buttons, with focus handling.
7. Drag and drop with the counter and the invert.
8. The 1100px, 820px, and 640px rules, then reduced motion.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
