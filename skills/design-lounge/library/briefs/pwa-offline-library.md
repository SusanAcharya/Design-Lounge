<!-- Design Lounge Nº 365 · "PWA offline library" · designlounge.vercel.app -->

# PWA offline library

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The "Saved" screen of "Nightjar", an installed reading and listening app. It answers three questions in order: how much room is left, what is still downloading, and what can I open with no signal. The look is an editorial night page: deep navy, paper-white serif titles, sans meta, and one amber accent for progress and warnings. The detail worth copying is that nothing is hidden when offline. Items that cannot work offline stay in the list, dimmed, with the reason written under the title.

## Reference behaviour

1. First frame, online. Top row: a moon mark and "NIGHTJAR" on the left, a dashed "Demo: go offline" button on the right. Heading "Saved for offline" at 34px serif, then "Stories and episodes kept on this phone."
2. Storage card: "1.21 GB of 2.00 GB" on the left, "786 MB free" on the right. An 8px meter shows Episodes (amber, 1.12 GB) and Articles (paper, 94 MB) on a navy track. A legend repeats both numbers.
3. Inside the same card, under a hairline: a switch row "Download on Wi-Fi only", on by default, with the sub line "Episodes wait for Wi-Fi. Articles always download."
4. Section "Downloading 2". Each row has a 40px progress ring with the percent in the middle, a kicker ("Episode · The Long Tide"), a serif title, a meta line ("52 min · 23.2 of 61 MB"), and a 44px cancel button (×).
5. The rings advance every 500ms. Episode one gains 1.6% per tick from 38%. Episode two gains 0.45% per tick from 9%.
6. When a ring reaches 100%, its row fades and collapses over 420ms. The item then appears at the top of "On this device", the item count goes up by one, the episode size is added to the meter, and the live region says "The Harbour Pilots Who Never Sleep downloaded. Available offline."
7. Section "On this device 31 items" shows four rows: a 40px type icon with a small amber tick badge, kicker, title, "14 min read · 2.4 MB", and a 44px remove button (bin icon). Below them: "Show 27 older items".
8. Tap remove. The row fades (220ms) and collapses (300ms after a 120ms delay). Then the meter drops by the item size, the count drops by one, focus moves to the next row's remove button, and the live region says "Removed A Winter on the Salt Road. 41.6 MB freed."
9. Tap cancel on a download. The row collapses the same way and the live region says "Download cancelled: …".
10. Section "Not available offline 2". Rows are dimmed: muted title colour, dashed icon border, and an amber lock line with the reason ("Live broadcasts stream only", "Publisher allows online reading only"). The download button is disabled.
11. Tap the switch. It flips to off and the sub line becomes "Episodes may use mobile data, about 50 MB each."
12. Tap "Demo: go offline". An amber "OFFLINE" pill appears next to the wordmark (pops in over 240ms). A notice with a 3px amber left rule appears under the heading: "You are offline. Everything under On this device still opens. Downloads resume when you reconnect." Rings stop and turn grey, and their meta becomes "Paused · 28.1 of 61 MB". Dimmed reasons gain a prefix: "Needs a connection. Live broadcasts stream only". The button now reads "Demo: go online".
13. Go online again. The pill and notice go, rings turn amber and resume, and the live region says "Back online. Downloads resumed."
14. A footer line explains the eviction rule: "Nightjar keeps up to 2.00 GB. Oldest finished episodes are cleared first when space runs low."
15. The page scrolls in one column. Nothing scrolls sideways.

## Structure

```
390 × 844, padding 54px top, 20px sides, 34px bottom
┌──────────────────────────────────────┐
│ ) NIGHTJAR [OFFLINE]  (Demo: offline)│ 40px row
│ Saved for offline            34px    │
│ Stories and episodes kept on...      │
│ ┃ You are offline. Everything...     │ notice, only offline
│ ┌──────────────────────────────────┐ │
│ │ 1.21 GB of 2.00 GB     786 MB free│ │ storage card, 16px padding
│ │ ███████████████████░░░░░░░░░░░░░ │ │ meter 8px
│ │ ■ Episodes 1.12 GB  ■ Articles 94 │ │
│ │ ──────────────────────────────── │ │
│ │ Download on Wi-Fi only    [ ●] │ │ 56px switch row
│ └──────────────────────────────────┘ │
│ DOWNLOADING                       2  │
│ (42) EPISODE · THE LONG TIDE      ×  │ 40 | 1fr | 44
│      The Harbour Pilots Who...       │
│      52 min · 26.1 of 61 MB          │
│ ON THIS DEVICE               31 ITEMS│
│ [=v] ARTICLE · COASTLINE REVIEW  bin │
│      What the Tide Tables Don't...   │
│ Show 27 older items              v   │
│ NOT AVAILABLE OFFLINE             2  │
│ [ ] LIVE AUDIO · FATHOM RADIO     ↓  │ dimmed, disabled
│     Storm Watch From Ness Point      │
│     [lock] Live broadcasts stream only│
│ Nightjar keeps up to 2.00 GB...      │
└──────────────────────────────────────┘
```

- One scrolling container fills the frame. `overflow-x: hidden`.
- Top row: a `span` mark with the offline pill inside, and the demo `<button aria-pressed>`.
- `h1` heading, `p` sub, `p.notice` (shown only offline).
- Storage: `<section>` with a hidden `h2`, the numbers, a `role="meter"` bar, a legend `ul`, and the switch as `<button role="switch" aria-checked>`.
- Three `<section>`s, each with an `h2` (label left, count right) and a `ul` of rows.
- A row is a 3-column grid: `40px minmax(0,1fr) 44px`, gap 12px, padding 12px 0, 1px bottom rule.
- A visually hidden `aria-live="polite"` paragraph.

Sample content:

| Section | Kicker | Title | Meta |
| --- | --- | --- | --- |
| Downloading | Episode · The Long Tide | The Harbour Pilots Who Never Sleep | 52 min · 61.0 MB, from 38% |
| Downloading | Episode · Fathom Radio | Inside the Last Lighthouse Logbook | 44 min · 48.2 MB, from 9% |
| On device | Article · Coastline Review | What the Tide Tables Don't Tell You | 14 min read · 2.4 MB |
| On device | Episode · Fathom Radio | A Winter on the Salt Road | 38 min · 41.6 MB |
| On device | Article · The Quarter | How Night Trains Learned to Keep Time | 9 min read · 1.1 MB |
| On device | Article · Coastline Review | Letters From the Weather Ship | 22 min read · 3.8 MB |
| Not available | Live audio · Fathom Radio | Storm Watch From Ness Point | Live broadcasts stream only |
| Not available | Article · Meridian Weekly | The Cartographer's Daughter, Part 3 | Publisher allows online reading only |

## Tokens

```css
:root {
  /* night neutrals */
  --bg: #0d1726;          /* page */
  --surface: #14223a;     /* storage card, notice */
  --raise: #1b2b45;       /* button hover */
  --line: #26385a;        /* hairlines, meter track, ring track */
  --ink: #f3eee4;         /* paper-white titles */
  --ink-2: #bcc2cd;       /* meta, body */
  --ink-3: #8f99ab;       /* kickers, dimmed titles, paused ring */

  /* the one accent */
  --amber: #f0a640;       /* rings, episode share, ticks, offline pill, reasons */
  --amber-ink: #1c1304;   /* text and icons on amber */

  /* type */
  --serif: "Source Serif 4", Georgia, serif;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
  --fs-h1: 34px; --fs-used: 26px; --fs-title: 16px; --fs-body: 14px;
  --fs-meta: 12px; --fs-kicker: 10.5px; --fs-label: 11px;

  /* space and shape */
  --pad-x: 20px;
  --top-clear: 54px;
  --bottom-clear: 34px;
  --row-pad: 12px;
  --r: 10px;              /* card */
  --r-sm: 8px;            /* icons, buttons */

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --out: cubic-bezier(.16, 1, .3, 1);
  --t-ring: 400ms;
  --t-meter: 400ms;
  --t-fade: 220ms;
  --t-collapse: 300ms;
  --tick: 500ms;          /* demo download tick */
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Heading | Source Serif 4 | 34px | 600 | 1.05 | −0.015em | sentence |
| Used amount | Source Serif 4 | 26px | 600 | 1 | 0 | numerals, tabular |
| Item title | Source Serif 4 | 16px | 600 | 1.25 | −0.005em | title, 2-line clamp |
| Switch label | IBM Plex Sans | 15px | 500 | 1.3 | 0 | sentence |
| Body / sub | IBM Plex Sans | 14px | 400 | 1.45 | 0 | sentence |
| Meta / legend | IBM Plex Sans | 12px | 400 | 1.45 | 0 | sentence, tabular |
| Section label | IBM Plex Sans | 11px | 600 | 1 | 0.14em | upper |
| Kicker | IBM Plex Sans | 10.5px | 600 | 1.2 | 0.1em | upper |
| Wordmark | IBM Plex Sans | 12px | 600 | 1 | 0.14em | upper |
| Offline pill | IBM Plex Sans | 11px | 600 | 1 | 0.06em | upper |
| Ring percent | IBM Plex Sans | 10px | 600 | 1 | 0 | numerals |

Serif is for things you read: the heading, the amount, and titles. Sans is for things you scan: sizes, durations, labels.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Ring | each tick | stroke-dashoffset | prev → next | 400ms | `--ease` | 1ms |
| Meter segments | size changes | width | prev → next | 400ms | `--ease` | 1ms |
| Row removed | remove, cancel, finish | opacity | 1 → 0 | 220ms | `--ease` | 1ms |
| Row removed | same | max-height, padding | 120px, 12px → 0 | 300ms, 120ms delay | `--ease` | 1ms |
| Switch thumb | toggle | translateX | 0 → 20px | 200ms | `--out` | 1ms |
| Switch track | toggle | background | line → amber | 160ms | `--ease` | 1ms |
| Offline pill | go offline | scale, opacity | 0.85, 0 → 1, 1 | 240ms | `--out` | none |

The download percentages keep updating under reduced motion. Only the tweening goes.

## States

- Downloading: amber ring, percent in the ring, "52 min · 26.1 of 61 MB".
- Paused (offline): ring stroke `--ink-3`, meta "Paused · 28.1 of 61 MB".
- Done: row leaves Downloading and joins the top of On this device with the amber tick badge.
- Saved row: 40px icon box with 1px `--line` border and a 16px amber tick circle at its bottom-right.
- Not available: title `--ink-3`, icon border dashed, amber lock line with the reason, download button `disabled` at 60% opacity.
- Offline: amber pill in the top row, amber-ruled notice under the heading, reasons prefixed "Needs a connection."
- Switch on: amber track, dark thumb at 20px. Off: `--line` track, grey thumb at 0.
- Demo button pressed: amber dashed border and amber text.
- Button hover: `--raise` background, `--ink` icon. Active: scale 0.94.
- Focus-visible: 2px amber outline, 2px offset, 6px radius.
- Empty Downloading: "Nothing downloading." in meta style.

## Accessibility

- The meter is `role="meter"` with `aria-valuemin="0"`, `aria-valuemax="2000"`, `aria-valuenow` in MB, and `aria-valuetext="1.21 GB of 2.00 GB"`.
- Each ring is `role="progressbar"` labelled with the item title and has `aria-valuenow`.
- The switch is `<button role="switch" aria-checked>`. Its visible text is its name.
- Remove buttons are labelled "Remove from device: What the Tide Tables Don't Tell You, 2.4 MB". Cancel buttons say "Cancel download: …". Disabled ones say "Download unavailable: …".
- After a remove, move focus to the next remove button, or the previous one, or "Show older items". Never drop focus to the body.
- The live region announces finishes, removals, cancels, and the network change. It does not announce every tick.
- The reason text is real text, not a tooltip. Dimming never relies on opacity alone: the colour changes and a lock line is added.
- Contrast: `--ink` on `--bg` 15:1. `--ink-2` on `--bg` 10:1. `--ink-3` on `--bg` 6.3:1. `--amber` on `--bg` 9:1. `--amber-ink` on `--amber` 9:1.
- Hit targets: remove and cancel 44×44, switch row 56px tall, demo button 40px.

## Responsive rules

- 390 wide: as specified.
- 360 wide: keep the 3-column row. Titles wrap to two lines and then clamp. The heading stays 34px. The meter legend stays on one line; drop the word "Episodes" to its icon only if it wraps below 340px.
- 600 wide and up: cap the column at 560px and centre it. The storage card and switch stay full column width.
- Tablet width: put the storage card in a 320px left column, sticky, and the three lists on the right. Do not add a second accent.
- The offline pill always sits next to the wordmark, never on its own row.

## Acceptance checklist

### Always

- [ ] A storage meter shows used and total from the browser's estimate, with free space on the right.
- [ ] A Wi-Fi-only switch with a sub line that changes with its state.
- [ ] Three sections in order: downloading, on this device, not available offline.
- [ ] Downloading rows show a ring with the percent and bytes done of total.
- [ ] Remove and cancel are visible 44px buttons. No swipe needed.
- [ ] Unavailable items stay in the list, dimmed, with a written reason and a disabled action.
- [ ] Offline shows a pill next to the wordmark and pauses downloads with "Paused".
- [ ] Removing an item updates the meter and the count, and keeps focus on a nearby control.
- [ ] A polite live region announces finish, remove, cancel, and network changes.
- [ ] No horizontal scroll at 360 wide. Focus rings are visible.

### This demo

- [ ] Brand "Nightjar", heading "Saved for offline".
- [ ] Meter starts at 1.21 GB of 2.00 GB: Episodes 1.12 GB, Articles 94 MB.
- [ ] Two downloads start at 38% and 9%.
- [ ] "On this device" starts at 31 items with 4 shown and "Show 27 older items".
- [ ] Background `#0d1726`, titles `#f3eee4` in Source Serif 4, accent `#f0a640`.
- [ ] Removing "A Winter on the Salt Road" frees 41.6 MB.

## Implementation notes

**Real storage numbers.** Ask for persistent storage once, after the first save, so the browser does not evict the library. Then read the estimate.

```js
async function readStorage() {
  if (!navigator.storage?.estimate) return null;
  if (navigator.storage.persist && !(await navigator.storage.persisted())) {
    await navigator.storage.persist();      // ask once, after a user save
  }
  const { usage, quota } = await navigator.storage.estimate();
  return { used: usage, total: Math.min(quota, APP_BUDGET), free: Math.min(quota, APP_BUDGET) - usage };
}
// Re-run after every download, remove, and on 'visibilitychange'.
```

Quota is the browser's limit and is often huge. Show your own app budget (2.00 GB here) as the total, and evict oldest finished episodes when usage passes it.

**Downloading into a named cache with progress.** Stream the body so you can count bytes. Write to the cache only when complete.

```js
async function download(item, onProgress) {
  const res = await fetch(item.url);
  const total = +res.headers.get('Content-Length') || item.bytes;
  const reader = res.body.getReader(); const chunks = []; let got = 0;
  for (;;) {
    const { done, value } = await reader.read(); if (done) break;
    chunks.push(value); got += value.length; onProgress(got / total);
  }
  const cache = await caches.open('nightjar-saved-v1');
  await cache.put(item.url, new Response(new Blob(chunks), { headers: res.headers }));
}
```

For long episodes use the Background Fetch API where it exists (`registration.backgroundFetch.fetch`) so downloads survive the app closing. Fall back to the loop above.

**Service worker: saved items cache-first.** Everything in the saved cache answers offline. Everything else goes to the network.

```js
self.addEventListener('fetch', e => {
  e.respondWith(caches.open('nightjar-saved-v1').then(async c =>
    (await c.match(e.request)) || fetch(e.request)));
});
```

**Online and offline.** `navigator.onLine` can be wrong. Treat the event as a hint and confirm with a small request.

```js
window.addEventListener('offline', () => setOffline(true));
window.addEventListener('online', async () => {
  try { await fetch('/ping', { cache: 'no-store' }); setOffline(false); } catch {}
});
```

**Wi-Fi only.** Check `navigator.connection?.type` where it exists. If it is `cellular`, hold episode downloads and leave articles alone. Where the API is missing, trust the switch and say so in the sub line.

**The ring.** One circle, `r=16`, circumference 100.5. Rotate the SVG −90° so it starts at 12 o'clock.

```css
.ring svg { transform: rotate(-90deg); }
.ring .fg { stroke: var(--amber); stroke-width: 3; stroke-dasharray: 100.5;
  transition: stroke-dashoffset 400ms var(--ease); }
```

Set `stroke-dashoffset = 100.5 * (1 - p/100)` from JS.

Common mistakes:

- Hiding items that do not work offline. Users then think they were deleted.
- Showing `quota` as the total. On many phones it reads as hundreds of GB and the meter never moves.
- Swipe-to-delete as the only way to remove. Give a visible button.
- A spinner instead of a ring. People need to know how far along it is.
- Announcing every percent to screen readers.
- Writing a partial download to the cache. Write only when the body is complete.
- A purple or blue accent for progress. This piece is amber on navy.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
