<!-- Design Lounge Nº 370 · "PWA outbox sync" · designlounge.vercel.app -->

# PWA outbox sync

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The outbox of "Tern Survey", a field-notes app used by crews on sites with weak signal. Anything the crew saves with no signal goes into a queue on the phone. The outbox is a bottom sheet that shows each queued change, its state, and what to do about it. When signal returns, items send one at a time with a progress bar. The look is industrial field kit: sand and khaki, black ink, one signal orange, a mono face for data, a condensed sans for names, and 2px corners. The detail worth copying is the conflict card: when an edit was changed on another device, it shows both versions side by side and asks one plain question with two buttons.

## Reference behaviour

1. First frame, offline. Behind the sheet: the "TERN SURVEY" bar, a chip "● OFFLINE · 3 IN OUTBOX", "SITE 14 · MARSH LANE · CREW B", and a "Field notes" list, under a 28% dark scrim.
2. The sheet is open from 184px down to the bottom. Top: a 40×4 grabber, "OUTBOX" at 26px with "3 waiting", and a 44px close button.
3. A network switch row: crossed-out signal icon, "OFFLINE · NO SIGNAL", "Changes are saved on this phone", and a square toggle, off.
4. An overall bar: "0 OF 3 SENT" on the left, "WAITING FOR SIGNAL" on the right, a 6px track with a black fill at 0%.
5. Three cards, in queue order:
   - "Culvert C-14 outflow", "PHOTO NOTE · 2 PHOTOS · 4.2 MB · 09:14". State FAILED (orange chip, orange border, 4px orange left bar). Message "Failed at 62%. Signal lost at 09:21." A black "Retry" button.
   - "Daily site log, 3 Oct", "FORM · 14 FIELDS · 09:30". State QUEUED (dashed chip). "Sends when signal returns."
   - "Plot 7 boundary note", "EDIT · 1 FIELD · 09:36". State QUEUED.
6. Tap Retry while offline: the card becomes QUEUED with "Still offline. Sends when signal returns." Focus moves to the network switch. The live region says "Culvert C-14 outflow queued. Still offline."
7. Tap the network switch. It turns orange, the icon gets signal bars, the text becomes "ONLINE · 2 BARS" and "Sending queued changes". The chip dot turns black. The live region says "Back online. Sending outbox."
8. Items send one at a time, top first. The sending card gets a black "SENDING 62%" chip and a 4px orange progress bar. The photo resumes from 62% and gains 6% every 160ms. Others start at 0% and gain 12% every 160ms.
9. At 100% the card becomes SENT: transparent fill, khaki border, grey title, a check icon before "SENT", no message. The overall bar grows by a third. 300ms later the next item starts.
10. The form fails once at 48%: FAILED, "Server did not answer. Retrying in 2s.", then "1s", then it goes back to QUEUED and sends again from 0%. No button shows during the countdown.
11. The edit reaches 60% and stops: CONFLICT (orange chip). Message "Changed on another device." Two boxes: "YOURS · 09:36 — Post 7 leans 15° north. Reset needed." and "THEIRS · R. ADEYEMI · 09:52 — Post 7 replaced and reset on 3 Oct." Two 44px buttons: "Keep mine" (black) and "Keep theirs" (outlined). The list scrolls so the whole card is in view. The right label reads "NEEDS YOUR CHOICE".
12. Keep mine: the edit sends from 60% to 100%, then shows SENT with "Your note replaced theirs."
13. Keep theirs: the edit becomes SENT at once with "Their note kept. Yours discarded."
14. When all three are sent: "3 OF 3 SENT", "ALL SENT", the count reads "Empty", the switch sub line reads "Up to date", the chip reads "ONLINE · ALL SENT", and the live region says "Outbox empty. All 3 changes sent."
15. Go offline mid-send: the sending card returns to QUEUED with "Paused at 40%. Resumes with signal." Going offline during a retry countdown stops it and shows the Retry button.
16. Close (×), tap the scrim, press Escape, or tap the chip: the sheet slides down over 360ms. Tap the chip again to open it. Focus goes to the chip on close and the network switch on open.
17. "Reset demo" puts everything back to the first frame.

## Structure

```
390 × 844
┌──────────────────────────────────────┐
│ (54px clearance)                     │
│ TERN SURVEY     [● OFFLINE · 3 IN…]  │ chip 40px
│ SITE 14 · MARSH LANE · CREW B        │
│ Field notes                  30px    │
│ ─────────────────────────────────    │
├══════════════════════════════════════┤ sheet top 184px, 2px ink rule
│               ▬▬                     │ grabber 40×4
│ OUTBOX 3 waiting                 ×   │ 44px close
│ ┌──────────────────────────────────┐ │
│ │ ⌀  OFFLINE · NO SIGNAL     [■  ] │ │ switch row 56px
│ └──────────────────────────────────┘ │
│ 0 OF 3 SENT        WAITING FOR SIGNAL│
│ [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] │ 6px track
│ ┃[cam] Culvert C-14 outflow  [FAILED]│ card, 36 | 1fr | auto
│ ┃      PHOTO NOTE · 2 PHOTOS · 4.2 MB│
│ ┃      Failed at 62%. Signal lost... │
│ ┃      [ RETRY ]                     │ 44px
│ [form] Daily site log, 3 Oct [QUEUED]│
│        Sends when signal returns.    │
│ [pen]  Plot 7 boundary note  [QUEUED]│
│ Kept until the server confirms. [RESET DEMO]│
│ (34px clearance)                     │
└──────────────────────────────────────┘
```

- The app behind is plain markup. The chip is a `<button aria-controls="sheet" aria-expanded>`.
- The scrim is a full-frame `div`. Clicking it closes the sheet.
- The sheet is `<section role="dialog" aria-modal="false" aria-labelledby>`, absolutely placed `top:184px; bottom:0`, a flex column. The list is the only part that scrolls (`flex:1; min-height:0; overflow-y:auto`).
- The network control is `<button role="switch" aria-checked>`.
- The list is a `ul`; each card is an `li` grid `36px minmax(0,1fr) auto`, gap 4px 12px. Row two spans columns 2 to the end and holds the bar, the message, the diff, and buttons.
- A visually hidden `aria-live="polite" aria-atomic="true"` paragraph.

## Tokens

```css
:root {
  /* field neutrals */
  --sand: #d9cdae;        /* page, inner wells */
  --sand-2: #cdbf9b;      /* switch row */
  --paper: #ece4cd;       /* sheet, cards, chip */
  --line: #b3a47f;        /* list hairlines */
  --line-2: #8f8162;      /* grabber, sent border, wells */
  --ink: #16140f;         /* text, borders, primary buttons */
  --ink-2: #3d382c;       /* meta, quiet messages */
  --ink-3: #5c5442;       /* sent titles */

  /* the one accent */
  --sig: #e4571b;         /* failed, conflict, item bar, switch on */
  --sig-ink: #16140f;     /* text on orange */
  --sig-text: #a63a0a;    /* orange text on paper */

  /* type */
  --cond: "Archivo Narrow", "Arial Narrow", sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;

  /* shape and space */
  --r: 2px;
  --border: 1.5px;
  --sheet-top: 184px;
  --pad-x: 16px;
  --top-clear: 54px;
  --bottom-clear: 34px;

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --sheet: cubic-bezier(.32, .72, 0, 1);
  --t-sheet: 360ms;
  --t-total: 400ms;
  --t-item: 200ms;
  --tick: 160ms;          /* demo upload tick */
  --backoff-1: 2s;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Screen heading | Archivo Narrow | 30px | 700 | 1 | −0.01em | sentence |
| Sheet title | Archivo Narrow | 26px | 700 | 1 | 0.02em | upper |
| Wordmark | Archivo Narrow | 20px | 700 | 1 | 0.04em | upper |
| Card title | Archivo Narrow | 16px | 700 | 1.2 | 0 | sentence |
| Network label | Archivo Narrow | 15px | 700 | 1.1 | 0.04em | upper |
| Button | Archivo Narrow | 13px | 700 | 1 | 0.06em | upper |
| Count | JetBrains Mono | 12px | 500 | 1 | 0 | sentence |
| Chip / totals | JetBrains Mono | 11px | 500 | 1 | 0.04em | upper |
| Message, diff | JetBrains Mono | 11px | 400 | 1.45 | 0 | sentence |
| Card meta | JetBrains Mono | 10.5px | 400 | 1.5 | 0.02em | upper |
| State chip | JetBrains Mono | 10.5px | 700 | 1 | 0.06em | upper |

Names of things are condensed sans. Anything a machine produced (times, sizes, states, counts) is mono.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Sheet | open / close | translateY | 102% ↔ 0 | 360ms | `--sheet` | 1ms |
| Scrim | open / close | opacity | 0 ↔ 1 | 300ms | `--ease` | 1ms |
| Network thumb | toggle | translateX | 0 → 23px | 200ms | `--ease` | 1ms |
| Overall fill | item sent | width | n/3 → (n+1)/3 | 400ms | `--ease` | 1ms |
| Item bar | each tick | width | prev → next % | 200ms | linear | 1ms |
| Conflict card | appears | list scroll | to card end | smooth | browser | instant |

The queue still runs in order under reduced motion. Only the tweening goes. Linear is right for the item bar because it tracks bytes.

## States

| State | Chip | Card | Row two |
| --- | --- | --- | --- |
| Queued | dashed 1.5px ink, `--ink-2` text, "QUEUED" | paper, ink border | "Sends when signal returns." or "Next in line." |
| Sending | ink fill, paper text, "SENDING 42%" | paper, ink border | 4px orange bar |
| Failed | orange fill, ink text, "FAILED" | orange border, 4px orange inset left bar | orange message, black Retry button |
| Retrying | same as failed | same | "Retrying in 2s." countdown, no button |
| Conflict | orange fill, "CONFLICT" | same as failed | message, two version boxes, Keep mine / Keep theirs |
| Sent | no border, check icon, "SENT" | transparent, `--line-2` border, `--ink-3` title | only the outcome line after a conflict |
| Paused | as queued | as queued | "Paused at 40%. Resumes with signal." |

- Network off: `--paper` toggle, thumb left. On: `--sig` toggle, thumb 23px right.
- Button active: translateY 1px.
- Focus-visible: 2px ink outline, 2px offset, plus a 4px orange ring outside it.
- Right total label: "WAITING FOR SIGNAL", "SENDING ONE AT A TIME", "NEEDS YOUR CHOICE", "PAUSED", "ALL SENT".
- Empty: count "Empty", chip "ONLINE · ALL SENT", sub line "Up to date".

## Accessibility

- The sheet is a non-modal dialog labelled by "Outbox". Escape closes it.
- The network switch is `role="switch"` with `aria-checked`.
- Each sending bar is `role="progressbar"` labelled "Sending Daily site log, 3 Oct" with `aria-valuenow`.
- State is in text (the chip word), not just colour or border.
- The live region announces: "Sending Culvert C-14 outflow.", "Culvert C-14 outflow sent.", "Daily site log, 3 Oct failed. Retrying in 2 seconds.", "Plot 7 boundary note: changed on another device. Choose keep mine or keep theirs.", and "Outbox empty. All 3 changes sent." It does not announce percent ticks.
- After Retry while offline, focus moves to the network switch, because that is the fix.
- After a conflict choice, focus moves to the sheet heading so it is not lost when the card re-renders.
- On re-render, if focus was inside a card, put it back on that card's first button.
- Hit targets: buttons and close 44px tall, switch row 56px, chip 40px, reset 40px.
- Contrast: ink on paper 15:1. `--ink-2` on paper 9:1. `--sig-text` on paper 5.1:1. Ink on orange 5.7:1. Paper on ink 15:1.

## Responsive rules

- 390 wide: as specified. Sheet top 184px.
- 360 wide: same layout. Buttons in the conflict card wrap to two rows if needed (`flex-wrap: wrap`). Meta wraps under the title.
- Short phones (under 740 tall): sheet top 120px so the conflict card fits without scrolling.
- 600 wide and up: the sheet becomes a 420px panel anchored bottom-right with a 16px gap, the same corners and border.
- Tablet: show the outbox as a right side panel, 360px wide, always open while anything is waiting.

## Acceptance checklist

### Always

- [ ] Every change made offline lands in a visible outbox with its kind, size or field count, and time.
- [ ] Five item states with a written chip: queued, sending, failed, conflict, sent.
- [ ] Items send one at a time in queue order, each with its own progress bar, plus an overall "n of N sent".
- [ ] A failure retries itself with a visible countdown and backoff. A manual Retry appears when it gives up or when offline.
- [ ] A conflict shows both versions with who and when, and offers exactly two choices.
- [ ] Going offline mid-send pauses the item and says where it stopped.
- [ ] Items stay in the outbox until the server confirms.
- [ ] A polite live region announces each state change, not each percent.
- [ ] The sheet opens from a status chip and closes with ×, scrim, Escape, or the chip.
- [ ] Hit targets are 44px. Focus rings are visible. No horizontal scroll at 360 wide.

### This demo

- [ ] Brand "Tern Survey", site "Site 14 · Marsh Lane · Crew B".
- [ ] Items: "Culvert C-14 outflow" (failed at 62%), "Daily site log, 3 Oct", "Plot 7 boundary note".
- [ ] The form fails once at 48% and retries after 2s.
- [ ] The edit conflicts at 60% with R. Adeyemi's 09:52 version.
- [ ] Sand `#d9cdae`, sheet `#ece4cd`, ink `#16140f`, signal `#e4571b`, 2px corners.

## Implementation notes

**Store the outbox in IndexedDB, not memory.** Each entry needs an id that doubles as an idempotency key, so a resend after a lost reply does not create a duplicate.

```js
// entry: { id: crypto.randomUUID(), kind: 'edit', url, method, body,
//          baseVersion: 'W/"17"', attempts: 0, nextAt: 0, state: 'queued', sent: 0 }
async function enqueue(entry) {
  await db.put('outbox', entry);
  const reg = await navigator.serviceWorker.ready;
  if ('sync' in reg) await reg.sync.register('outbox');   // Background Sync
  else if (navigator.onLine) drain();                      // fallback
}
window.addEventListener('online', drain);                  // fallback for no Background Sync
```

**Drain one at a time, with backoff and jitter.** Run it in the service worker's `sync` event and in the page as a fallback.

```js
self.addEventListener('sync', e => { if (e.tag === 'outbox') e.waitUntil(drain()); });
async function drain() {
  for (const item of await db.getAll('outbox')) {
    if (item.state === 'sent' || item.state === 'conflict' || item.nextAt > Date.now()) continue;
    const res = await fetch(item.url, { method: item.method, body: item.body,
      headers: { 'Idempotency-Key': item.id, 'If-Match': item.baseVersion } }).catch(() => null);
    if (res?.ok) { await db.put('outbox', { ...item, state: 'sent' }); notify(item, 'sent'); continue; }
    if (res?.status === 412) { await db.put('outbox', { ...item, state: 'conflict', theirs: await res.json() }); notify(item, 'conflict'); continue; }
    const attempts = item.attempts + 1, wait = Math.min(300000, 2000 * 2 ** (attempts - 1)) * (0.8 + Math.random() * 0.4);
    await db.put('outbox', { ...item, state: 'failed', attempts, nextAt: Date.now() + wait });
    notify(item, 'failed'); break;      // stop the line; keep order
  }
}
```

Backoff runs 2s, 4s, 8s, 16s, and so on, capped at 5 minutes, with ±20% jitter. After 5 attempts stop retrying on your own and show the Retry button.

**Conflicts come from version checks.** Send the version the user edited (`If-Match` with the ETag). The server answers 412 when someone else saved first. "Keep mine" resends with the server's new version as `If-Match`. "Keep theirs" deletes the entry and refreshes the local copy.

**Resume photo uploads.** Upload photos in 256 KB chunks and store `sent` bytes on the entry. On resume, start from `sent`. That is why the photo card restarts at 62%, not 0%.

**Online is a hint.** `navigator.onLine` can say true on a captive portal. Treat the `online` event as "try now", and let the failed fetch decide.

**The sheet list is the only scroller.**

```css
.sheet { position: absolute; inset: 184px 0 0; display: flex; flex-direction: column;
  padding: 0 16px max(34px, env(safe-area-inset-bottom)); }
.items { flex: 1; min-height: 0; overflow-y: auto; display: grid; gap: 8px; align-content: start; }
```

Without `align-content: start` the grid stretches the cards to fill the sheet and leaves gaps inside each card.

Common mistakes:

- Sending in parallel. Order matters for edits to the same record. Send one at a time.
- Dropping the item from the outbox when the request starts, not when the server confirms.
- A silent retry loop with no countdown. People then tap the button many times.
- A conflict dialog that says "Error 412". Say "Changed on another device" and show both versions.
- Three choices for a conflict (merge, mine, theirs) on a phone in a field. Two is enough here.
- Using the orange for sending too. Orange means "needs you". Sending is black.
- Hiding sent items at once. Keep them in the list, quiet, until the sheet closes.
- Rounded corners. This family is 2px.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
