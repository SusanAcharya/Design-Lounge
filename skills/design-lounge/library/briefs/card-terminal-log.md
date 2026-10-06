<!-- Design Lounge Nº 299 · "Live terminal log card" · www.designlounge.live -->

# Live terminal log card

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The log tail of one worker inside an infrastructure console, set as a single card on a warm graphite page. New lines stream in every 0.4–1.3s, each with a timestamp, a coloured level, a source, and a message. Four level chips filter the stream, a search box filters and highlights, and the moment the pointer rests over the log the autoscroll holds so you can read. A pill counts what arrived while you were reading and jumps you back. Any line can be copied with its timestamp and level. The detail worth copying is the hold: autoscroll stops on hover, focus, or scroll-up, never on a timer, and the header badge says which state you are in (LIVE, HOLDING, PAUSED).

This is not `terminal-ui-style` (a whole visual language) and not `audit-activity-log` (a human audit trail). It is one data card for a machine stream.

## Structure

```
1280 × 800, page #161513 with 24px dot grid at 5%; card centred, 40px page padding
┌──────────────────────────── card 960 × 640, r 10px ─────────────────────────────┐
│ ninefold / eu-west-2 / deploy 4812                       1.0/s   [ ‖ Pause stream ]│ head 18/20px pad
│ ingest-worker-3  (● LIVE)                       lines, last 10s                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [■ DEBUG 14] [■ INFO 27] [■ WARN 3] [■ ERROR 4]              [⌕ Search messages /] │ tools 10/20px
├─────────────────────────────────────────────────────────────────────────────────┤
│ 00:14:03.877  DEBUG  lease        lease renewed partition=11 owner=worker-3    ⧉ │
│ 00:14:04.451  INFO   checkpoint   rebalanced: now owning 6 of 32 partitions      │ log well #191816
│ 00:14:04.944  WARN   upstream     slow flush 3485ms (threshold 1000ms) …         │ 104 / 54 / 124 / 1fr / 36
│ 00:14:09.806  ERR    consumer     write failed: connection reset by peer …       │
│                         ( ↓ 3 new lines )                                        │ pill bottom 14px
├─────────────────────────────────────────────────────────────────────────────────┤
│ 48 lines · 48 shown · following                 [/] search  [↑][↓] move  [C] copy │ foot 10/20px
└─────────────────────────────────────────────────────────────────────────────────┘
```

- `section.card` labelled by the `h1`. Grid rows `auto auto minmax(0,1fr) auto`, `overflow: hidden`.
- Head: crumb `p`, `h1` containing the worker name and the status badge `span`. Rate block is `aria-hidden` decoration. Pause is a `button[aria-pressed]`.
- Tools: `div[role=group][aria-label="Show levels"]` of four `button[aria-pressed]` chips, then a `label` wrapping a visually hidden name, a search icon, `input[type=search]`, and a `kbd` hint that hides when the input has text.
- Body: `ul.log[role=log][aria-live=off][tabindex=0]` with `aria-activedescendant` pointing to the current line. Each line is `li.ln` with five grid cells: `.ts`, `.lv`, `.src`, `.msg`, and `button.cp[tabindex=-1]`. The jump pill is a `button` absolutely positioned over the body.
- Footer: `span[role=status]` and an `aria-hidden` keys legend.

Message copy is generated from templates per level. Use these so the stream reads true:

| Level | Sources | Templates |
|-------|---------|-----------|
| debug | consumer, cache, runtime, lease | `poll queue=events.raw batch=N lag=Nms` · `cache hit key=tenant:N:schema ttl=Ns` · `gc pause N.Nms heap=NMB` · `lease renewed partition=N owner=worker-3` |
| info | writer, api, checkpoint, schema, coordinator | `flushed N rows to warehouse.events_2026_10 in Nms` · `POST /v2/ingest 202 Nms req=hex6` · `checkpoint committed offset=N partition=N` · `schema vN accepted for source checkout-web` · `rebalanced: now owning N of 32 partitions` |
| warn | writer, upstream, consumer, validate | `slow flush Nms (threshold 1000ms) table=events_2026_10` · `retrying upstream fetch attempt=N/5 backoff=Nms` · `queue depth Nk above soft limit 10k` · `dropped N rows: missing field "occurred_at"` |
| error | writer, api, consumer | `write failed: connection reset by peer (pg-replica-2:5432) req=hex6` · `payload rejected: 413 body N.NMB > 5MB limit` · `deadline exceeded after 30000ms on partition=N` |

Table names and source names inside messages are wrapped in `<em>` and coloured cyan.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| New line | appended | opacity, translateY | 0, 6px → 1, 0 | 380ms | `--expo` | none, appears |
| LIVE dot | always while streaming | opacity | 1 → .25 → 1 | 1.6s loop | `--ease` | static |
| Jump pill | unseen > 0 and holding | opacity, translateY | 0, 12px → 1, 0 | 240ms | `--expo` | instant |
| Chips, buttons | hover / press | background, border | — | 150ms | `--ease` | instant |
| Copy icon | line hover / current | opacity | 0 → 1 | 120ms | `--ease` | instant |
| Jump to bottom | pill click | scrollTop | current → bottom | browser smooth | — | `behavior: auto` |
| Autoscroll | new line, following | scrollTop | instant | 0 | — | same |

No other motion. Autoscroll is never animated: smooth-scrolling every 600ms makes the log swim.

## States

- **Following (LIVE):** cyan badge, pulsing dot, log pinned to the bottom.
- **Holding (HOLDING):** amber badge, dot still pulses, new lines append below the fold, pill shows the count.
- **Paused (PAUSED):** grey badge, dot still, no new lines, pause button filled amber and reads `Resume stream`.
- **Chip on:** filled square in the level colour, text `--ink`, border 45% level colour, background 9% level colour. **Off:** hollow square, text `--ink-3`.
- **Line hover:** row background `rgba(235,230,218,.035)`, copy icon visible.
- **Current line:** 2px amber left border, row background `rgba(230,179,80,.07)`, copy icon visible.
- **Copied:** icon becomes a cyan check for 1.6s; footer status says `Copied line <ts>`.
- **Copy blocked:** icon unchanged, footer says `Copy blocked by this frame. Select the line text instead.`
- **Search active:** `kbd` hint hidden, matches marked amber on `#1a1813` text.
- **Empty:** centred mono line in `--ink-3`, 48px vertical padding.
- **Focus-visible:** 2px amber outline, 2px offset; the log gets `outline-offset: -2px` so it is not clipped by the card.

## Accessibility

- The log is `role="log"` with `aria-live="off"`: announcing a line every second is noise. The footer `role="status"` carries state changes (filters, copy, hold).
- The log is a single tab stop. Up/Down/Home/End move `aria-activedescendant`; C or Enter copies; Escape leaves. Copy buttons are `tabindex="-1"` so a 240-line log is not 240 tab stops.
- `aria-label` on the log names the keys: "Log lines. Arrow keys move, C copies the line."
- Chips are toggle buttons with `aria-pressed`, inside a labelled group.
- The search input has a visually hidden label "Search log". `/` focuses it from anywhere except when already typing.
- Hover hold is mouse-only (`pointerType === 'mouse'`). Keyboard users get the same hold through focus.
- Level is never colour-only: the word DEBUG/INFO/WARN/ERR is always printed.
- Contrast on `#191816`: `--ink` 14.2:1, `--ink-2` 7.1:1, `--ink-3` 5.0:1 (4.7:1 on `--card`), info 8.4:1, warn 9.2:1, error 6.1:1. Do not darken `--ink-3` below `#8e877a`; `#847d70` falls to 4.35:1.

## Responsive rules

- **≥ 1280:** card 960 × 640, five columns as above.
- **1024:** card fills width minus 64px; columns unchanged; search shrinks first (`flex: 0 1 280px`).
- **768:** same as 1024; chips may wrap to a second row before the search.
- **< 760:** page padding 16/12px, card height `100vh − 32px`. Log font 11.5px. Columns become `58px 38px minmax(0,1fr) 28px`: the source column and the milliseconds are hidden. Search takes its own full row. Rate block and keys legend hide. Pause button becomes a 40px icon button with its text visually hidden. h1 drops to 18px and the badge may wrap under it.
- Messages wrap (`white-space: pre-wrap; overflow-wrap: anywhere`). Nothing scrolls sideways.

## Acceptance checklist

### Always

- [ ] Lines stream on a randomised timer (not a fixed interval) and the buffer is capped.
- [ ] Autoscroll holds on mouse hover, on focus inside the log, and on scroll-up of more than 24px; it resumes only when all three are clear.
- [ ] A badge shows the state in words: LIVE, HOLDING, PAUSED.
- [ ] While holding, a pill counts unseen visible lines and jumps to the bottom on click.
- [ ] Level chips are multi-select toggles with `aria-pressed` and live counts.
- [ ] Search filters and wraps matches in `<mark>`; the query is regex-escaped.
- [ ] Copy writes timestamp, level, source and message; the success or failure is shown, not assumed.
- [ ] The log is one tab stop with arrow-key line navigation.
- [ ] Hidden lines are really hidden (`[hidden]{display:none}` beats `display:grid`).
- [ ] Reduced motion: no line fade, no dot pulse, instant jump.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Worker `ingest-worker-3`, crumb `ninefold / eu-west-2 / deploy 4812`.
- [ ] Page `#161513`, card `#1e1d1a`, log well `#191816`.
- [ ] Levels: debug `#948e82`, info `#7fbcc8`, warn `#e6b350`, error `#f0705a`.
- [ ] Martian Mono at 87.5% width for all log text; Familjen Grotesk for the title, buttons, pill.
- [ ] 46 seed lines, 240-line cap, 380–1300ms between lines.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: 46 lines already in the log, scrolled to the bottom. Header reads `ninefold / eu-west-2 / deploy 4812` above `ingest-worker-3` and a cyan `LIVE` badge with a pulsing 6px dot. Right side shows the line rate (`1.0/s`, lines in the last 10s) and a `Pause stream` button. All four level chips are on, each with its count.
2. Streaming: a new line is appended every 380–1300ms (random). Level mix: 28% debug, 52% info, 14% warn, 6% error. Each new line fades and rises 6px over 380ms. The log keeps the last 240 lines; older lines are removed from the top.
3. Following: while the log is following, every new line scrolls the log to the bottom instantly.
4. Hold: pointer enters the log body (mouse only), or focus enters the log, or the user scrolls more than 24px up from the bottom. Autoscroll stops. The badge turns amber and reads `HOLDING`. Lines still arrive. Each new visible line increments an amber pill at the bottom centre: `3 new lines`.
5. Release: pointer leaves and focus is outside and the log is at the bottom → badge back to `LIVE`, unseen count resets, log jumps to the bottom. Clicking the pill scrolls to the bottom (smooth, or instant with reduced motion) and clears the count.
6. Pause stream: the header button toggles generation. Pressed state is a filled amber button labelled `Resume stream` with a play icon. Badge reads `PAUSED` in muted grey with a still dot. Resuming restarts the stream after 300ms.
7. Level chips: each toggles its level (multi-select). Off chips show a hollow square and muted text. Hidden lines are `display: none`, counts keep counting.
8. Search: typing filters to lines whose message contains the query (case-insensitive, 90ms debounce) and wraps every match in an amber `<mark>`. Escape clears. `/` anywhere focuses the search.
9. Copy: hovering a line reveals a copy icon at the right edge. Clicking copies `HH:MM:SS.mmm LEVEL [source] message`. The icon becomes a cyan check for 1.6s, and the footer status reads `Copied line 00:14:45.934` for the same 1.6s. If the clipboard is blocked, the status says so instead of pretending.
10. Keyboard in the log: Tab to the log, then Up/Down move a current-line marker (amber left border, tinted row), Home/End jump, `C` or Enter copies the current line, Escape clears the marker and leaves.
11. Footer status always describes the state: `52 lines · 14 matches for "partition" · autoscroll held`.
12. Empty filter result: a centred line reads `No lines match "x" at the selected levels.` or `All levels are hidden. Turn one back on above.`

## Tokens

```css
:root {
  /* surfaces: warm graphite, never pure black */
  --bg: #161513;        /* page */
  --card: #1e1d1a;      /* card head, tools, foot */
  --well: #191816;      /* log body and search field */
  --line: #2e2c28;      /* hairlines between regions */
  --line-2: #3a3833;    /* control borders */

  /* ink */
  --ink: #ebe6da;       /* messages, title */
  --ink-2: #aaa395;     /* sources, debug messages, footer bold */
  --ink-3: #8e877a;     /* timestamps, crumb, placeholders */

  /* levels */
  --debug: #948e82;
  --info: #7fbcc8;      /* also <em> highlights and the LIVE badge */
  --warn: #e6b350;
  --error: #f0705a;     /* level label; error messages use #f6c7bc */

  --accent: #e6b350;    /* focus, mark, pill, current line, pressed pause */

  --ui: "Familjen Grotesk", system-ui, sans-serif;
  --mono: "Martian Mono", ui-monospace, monospace;   /* at font-stretch 87.5% */

  --r-card: 10px; --r-ctl: 6px; --r-chip: 5px;
  --pad-x: 20px;
  --row-cols: 104px 54px 124px minmax(0, 1fr) 36px;

  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-line: 380ms;  --t-pill: 240ms;  --t-micro: 150ms;
  --shadow-card: 0 40px 80px -40px rgba(0, 0, 0, .7);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Crumb | Martian Mono 87.5% | 11px | 500 | 1.4 | 0.02em | lower |
| Worker name (h1) | Familjen Grotesk | 22px | 700 | 1.15 | -0.01em | as written |
| Badge | Martian Mono 87.5% | 11px | 500 | 1 | 0.04em | UPPER |
| Rate number | Martian Mono 87.5% | 15px | 500 | 1.3 | 0 | — |
| Button | Familjen Grotesk | 13px | 600 | 1 | 0 | Sentence |
| Chip | Martian Mono 87.5% | 11px | 500 (count 400) | 1 | 0.06em | UPPER |
| Search | Martian Mono 87.5% | 12px | 400 | 1 | 0 | — |
| Log line | Martian Mono 87.5% | 12.5px | 400 (level 500) | 1.6 | level 0.04em | level UPPER |
| Footer | Martian Mono 87.5% | 11px | 400 (bold 500) | 1.4 | 0 | sentence |
| Pill | Familjen Grotesk | 12px | 600 | 1 | 0 | sentence |

Load Martian Mono with the width axis: `family=Martian+Mono:wdth,wght@87.5,400;87.5,500`. At 100% width the columns get too wide for 960px.

## Implementation notes

**The hold is three booleans, not one.** Hover, focus and scroll-up each hold independently; following is "none of them":

```js
let hovering = false, focused = false, scrolledUp = false, unseen = 0;
const following = () => !(hovering || focused || scrolledUp);

body.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hovering = true; sync(); });
body.addEventListener('pointerleave', () => { hovering = false; resume(); });
log.addEventListener('focusin', () => { focused = true; sync(); });
log.addEventListener('focusout', e => { if (!log.contains(e.relatedTarget)) { focused = false; resume(); } });
log.addEventListener('scroll', () => {
  scrolledUp = log.scrollHeight - log.scrollTop - log.clientHeight > 24;
  sync();
}, { passive: true });
function resume() { if (following()) { unseen = 0; log.scrollTop = log.scrollHeight; } sync(); }
// on each new line:
if (following()) log.scrollTop = log.scrollHeight; else if (!row.hidden) unseen++;
```

**Highlight from plain text, never from the HTML.** Keep the message as plain text and as rich HTML. With no query, render the rich version. With a query, escape the plain text and wrap matches:

```js
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function msgHTML(row) {
  if (!query) return row.html;
  const re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  return esc(row.text).replace(re, '<mark>$1</mark>');
}
```

**Copy with an honest fallback.** Sandboxed iframes often block `navigator.clipboard`:

```js
async function copy(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch {}
  const ta = Object.assign(document.createElement('textarea'), { value: text });
  ta.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(ta); ta.select();
  let ok = false; try { ok = document.execCommand('copy'); } catch {}
  ta.remove(); return ok;
}
```

Common mistakes:

- `display: grid` on the row overriding the `hidden` attribute. Add `.ln[hidden]{display:none}`.
- Smooth-scrolling on every line. The log drifts and never settles. Jump instantly; smooth only for the pill.
- `role="log"` with the default polite live region. Screen readers read every line forever.
- Building the regex from raw input. A user typing `(` throws.
- Pausing autoscroll on a timeout after hover. Hold until the pointer leaves.
- One copy button per line in the tab order.
- A fake macOS window bar with three dots. This is a card in a console, not a window.

Rebuild order:

1. Card grid and the four regions with tokens.
2. Line template, seed 46 lines, scroll to bottom.
3. Randomised stream with the 240-line cap.
4. Hold logic, badge, pill.
5. Chips and search with highlight.
6. Copy, keyboard current line, status messages.
7. The < 760 layout and reduced motion.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
