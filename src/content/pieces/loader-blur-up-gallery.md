---
title: "Blur-up photo album"
summary: "A shared album that loads like a real network: dominant-colour tiles, blurred previews, sharp photos four at a time, one failed tile with Retry, and a slow-network replay."
platform: web
type: component
category: gallery
tags: [loading, skeleton, gallery, photos, progressive]
styles: [paper, soft, editorial]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-31
palette: ["#F4F1EA", "#FFFDF8", "#1E1C18", "#1F4E5F", "#A2361C"]
fonts: ["Merriweather", "Gantari"]
related: [loader-export-render, skeleton-to-content-swap]
---

# Blur-up photo album

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A shared album page in "Fieldbook", an invented photo-sharing app: "Carran Point, late May", 14 photos from a coastal trip. The point is the loading choreography. Every tile first paints its dominant colour, then a blurred low-res preview arrives almost at once, then the full photos come in four at a time like a real browser connection pool, each sharpening from 14px blur to crisp. One photo fails mid-transfer and offers Retry on a solid card. A "Simulate slow network" switch replays the whole sequence at slow-3G pace so you can watch each stage. Worth copying: the believable waterfall (big above-the-fold tiles first, a little jitter, four in flight) and the fact that no text ever sits on a blurred image.

## Reference behaviour

1. First paint (0ms): header, controls and the status line "Loading 0 of 14 · 0.0 of 9.9 MB". Every tile is a solid dominant-colour block (e.g. `#d9b48f`, `#8fa6a8`, `#6c6170`) with a soft sheen sweeping across it every 1.6s (the skeleton).
2. Blurred previews (LQIP) arrive per tile at `240 + i·45 + rand·80` ms: the photo fades in (260ms) at `blur(14px) scale(1.12)` and the sheen stops.
3. Full downloads start at 420ms. The queue puts the three tall tiles first (priority −3), then the rest by position (`i·0.6 + rand·2.2`). Four transfers run at once; each takes 110ms latency + size ÷ 900 KB/s. A 3px cream line grows along the bottom of each in-flight tile.
4. When a tile completes it loses the blur and the scale (620ms expo-out), its progress line fades, and its link becomes focusable. A freed slot immediately takes the next tile in the queue.
5. The status line and the 160 × 4px meter update every frame: "Loading 9 of 14 · 7.6 of 9.9 MB".
6. "Ferry to Inchmor" (940 KB, 2 × 1) fails at 62%: its partial bytes are subtracted, it keeps its blurred preview, and a solid cream card appears in the middle: "Didn't load / Connection dropped" + "Retry" (36px pill).
7. When nothing is in flight: "13 of 14 loaded · 9.0 MB · 1 didn't load", `aria-busy` becomes false and the live region says "13 of 14 photos loaded. Ferry to Inchmor didn't load; Retry is on the photo."
8. Retry: card disappears, the tile downloads again (always succeeds), focus moves to that tile's link, and the end message becomes "All 14 photos loaded."
9. Hover or focus a loaded tile: the photo scales to 1.03 (600ms) and a solid ink caption slides up (220ms): name left (ellipsis), size in KB right.
10. "Simulate slow network" (switch) flips and replays immediately: previews at `900 + i·120` ms, downloads from 1100ms, 650ms latency, 110 KB/s per connection, status suffix "· slow 3G". "Replay loading" restarts with the current setting.

## Structure

```
1280 × 800, wrap max-width 1280, padding 22 / 32 / 28
┌──────────────────────────────────────────────────────────────────────────┐
│ Fieldbook  Albums  Shared with you  Prints                          (IM) │ 32px avatar
│ Carran Point, late May                  [◯ Simulate slow network] [↻ Replay loading]
│ 14 photos · shared by Ines Marlow · 3 days on the north shore            │
│ ▬▬▬───── Loading 9 of 14 · 7.6 of 9.9 MB                                 │ meter 160×4
│ ┌───────────┐┌─────┐┌─────┐┌───────────┐                                 │
│ │ A 2×2     ││ B   ││ C   ││ D 2×1     │   grid: 6 cols, rows 136px,     │
│ │           │├─────┤│ 1×2 │├─────┬─────┤   gap 10, dense flow            │
│ │           ││ E   ││     ││ F   │ H   │                                 │
│ ├───────────┤├─────┤├─────┴─────┼─────┤                                 │
│ │ G 2×2     ││ I   ││ J 2×1 fail│ K   │                                 │
│ │           │├─────┤├───────────┼─────┤                                 │
│ │           ││ L   ││ M 2×1     │ N   │                                 │
│ └───────────┘└─────┘└───────────┴─────┘                                 │
└──────────────────────────────────────────────────────────────────────────┘
```

- `header.top` with the wordmark (Merriweather italic) and plain links.
- `.head`: `h1` with an italic `em`, `.sub` line, and `.ctl` holding `button[role=switch]` and the replay `button`.
- `p.stat`: an `aria-hidden` meter and the status text.
- `ul.grid[aria-label=Photos][aria-busy]` of `li.t` (with `--dom` set inline). Each `li` holds `figure > svg.ph[role=img][aria-label] + figcaption`, an `a.open` covering the tile (`tabindex=-1` until loaded), an `i.bar` progress line, and a `.fail` card with a `button.retry`.
- One visually hidden `p[aria-live=polite]`.

## Tokens

```css
:root {
  /* colour */
  --paper: #f4f1ea;      /* page */
  --card: #fffdf8;       /* failure card, switch, progress line */
  --ink: #1e1c18;        /* text, primary button, caption ground */
  --ink-2: #58534a;      /* secondary text, 6.9:1 */
  --line: #dcd6ca;       /* meter track */
  --edge: #857e72;       /* switch border, 3.6:1 */
  --sea: #1f4e5f;        /* meter fill, switch on, focus ring */
  --fail: #a2361c;       /* "Didn't load", 6.3:1 on card */
  --caption-sub: #cfc8ba;/* KB on the ink caption */
  --dom: <per photo>;    /* dominant colour, set per tile */

  /* type */
  --serif: "Merriweather", Georgia, serif;   /* opsz 18–144 */
  --sans: "Gantari", system-ui, sans-serif;
  --fs-h1: 44px; --fs-body: 14px; --fs-small: 13px; --fs-logo: 17px;

  /* layout */
  --cols: 6; --row: 136px; --gap: 10px; --r-tile: 6px; --r-card: 8px; --r-pill: 20px;
  --meter-w: 160px; --meter-h: 4px; --progress-h: 3px;

  /* network model */
  --lanes: 4;
  --fast: 900KB/s 110ms;      /* per connection, latency */
  --slow: 110KB/s 650ms;
  --lqip-fast: 240ms + i*45ms; --lqip-slow: 900ms + i*120ms;
  --fail-at: .62;

  /* motion */
  --out: cubic-bezier(.16,1,.3,1);
  --ease: cubic-bezier(.2,.7,.2,1);
  --blur: 14px; --blur-scale: 1.12;
  --lqip-in: 260ms; --sharpen: 620ms; --sheen: 1.6s; --caption: 220ms; --hover-zoom: 600ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Album title | Merriweather | 44px (32px < 860) | 700, `em` 400 italic | 1.05 | −0.02em | opsz 96 |
| Wordmark | Merriweather | 17px | 400 italic | 1 | 0 | |
| Subline | Gantari | 14px | 400 | 1.45 | 0 | `--ink-2` |
| Controls | Gantari | 14px | 500 / 600 | 1 | 0 | |
| Status | Gantari | 13px | 400, numbers 600 | 1.45 | 0 | tabular |
| Caption | Gantari | 13px | 500 name, 400 size | 1.3 | 0 | cream on ink |
| Failure card | Gantari | 13px | 600 title / 400 | 1.3 | 0 | |

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Skeleton sheen | tile has only colour | background-position | 120% → −120% | 1.6s --ease, loops | none (flat colour) |
| Preview arrives | LQIP timer | opacity | 0 → 1 (blur 14px, scale 1.12) | 260ms --ease | instant |
| Sharpen | download done | filter, transform | blur 14px / 1.12 → 0 / 1 | 620ms --out | instant swap |
| Progress line | each frame | width | 0 → 100% | linear, follows bytes | same |
| Meter | each frame | width | follows bytes | 200ms linear | instant |
| Caption | hover/focus | translateY | 101% → 0 | 220ms --out | instant |
| Hover zoom | hover | transform | 1 → 1.03 | 600ms --out | none |
| Switch knob | toggle | translateX | 0 → 16px | 200ms --out | instant |

## States

- Placeholder: dominant colour + sheen. Preview: blurred photo. Loaded: sharp, link focusable, caption on hover.
- In flight: 3px cream progress line at the bottom edge (opacity .9).
- Failed: blurred preview stays, centred solid card with `#a2361c` "Didn't load" and Retry; progress line hidden.
- Retrying: card gone, progress line back, focus on the tile.
- Switch off / on: `#fffdf8` track with grey knob; `#1f4e5f` track with white knob.
- Hover: switch and Retry fill `#efe9dd`; Replay `#3a362f`; Replay presses to scale .97.
- Focus-visible: 3px `#1f4e5f` ring, 3px offset; on tiles a white ring inside plus a 6px inset ink band so it reads on any photo.

## Accessibility

- The grid is a `ul` with `aria-label="Photos"` and `aria-busy="true"` until nothing is in flight.
- Each photo `svg` has `role="img"` and the photo's name as `aria-label`; the open link is `aria-label="Open <name>"` and `tabindex=-1` until the photo is loaded, so keyboard users do not land on half-loaded tiles.
- The live region stays quiet during loading and speaks once at the end (count, and which photo failed), on Retry ("Retrying Ferry to Inchmor."), and again when the retry completes.
- The switch is a `button role="switch"` with `aria-checked`; it has its own 1.5px `#857e72` border (3.6:1) so it reads as a control.
- No text over imagery except on solid grounds: the caption is solid ink (14:1), the failure card solid cream (`#1e1c18` 16:1, `#a2361c` 6.3:1). Never put a label over the blurred preview.
- Hit targets: controls 40px tall, Retry 36px inside a tile, tiles at least 120px.

## Responsive rules

- ≥ 1280: 6 columns, 136px rows. 1024 and 860: the same grid, tiles narrow.
- < 860px: 2 columns, 120px rows, gap 8; 2 × 2 tiles become full-width squares-ish, 2 × 1 tiles full-width; the title drops to 32px; nav links hide; the controls wrap under the title; the page scrolls.
- The network model does not change with width; the queue order still follows DOM position, so the top of the phone page loads first.

## Acceptance checklist

### Always

- [ ] Three stages per tile: dominant colour (with sheen), blurred preview, sharp photo.
- [ ] At most four full downloads at once; a finished one starts the next immediately.
- [ ] Above-the-fold large tiles are requested first, with small jitter in order.
- [ ] Each in-flight tile shows its own progress line; the status shows count and MB.
- [ ] One tile fails mid-transfer, keeps its preview, and shows Retry on a solid card; Retry succeeds.
- [ ] `aria-busy` toggles; one polite announcement at the end names the failure.
- [ ] Slow-network switch replays at slower latency and bandwidth.
- [ ] No text on blurred or unloaded imagery; captions on solid ground.
- [ ] Reduced motion: no sheen, no blur transition, no zoom; stages still swap.

### This demo

- [ ] Album "Carran Point, late May", 14 photos, shared by Ines Marlow, 9.9 MB total.
- [ ] "Ferry to Inchmor" (940 KB) is the one that fails, at 62%.
- [ ] Merriweather 44px / 700 title with italic "late May"; Gantari for the UI.
- [ ] Meter `#1f4e5f`, failure text `#a2361c`, paper `#f4f1ea`.

## Implementation notes

**Blur-up in pure CSS.** One element, three classes. Scale the blurred layer so its soft edge is clipped by the tile:

```css
.t { position:relative; overflow:hidden; background:var(--dom); border-radius:6px; }
.t .ph { opacity:0; filter:blur(14px); transform:scale(1.12);
  transition: opacity 260ms var(--ease), filter 620ms var(--out), transform 620ms var(--out); }
.t.lq .ph { opacity:1; }                              /* low-res arrived */
.t.ok .ph { filter:blur(0); transform:scale(1); }     /* full image decoded */
```

**A believable waterfall.** Model lanes, not timers per tile. Priority puts big tiles first, then jitter:

```js
queue = P.map((p, i) => [i, (p.tall ? -3 : 0) + i * .6 + rnd() * 2.2])
         .sort((a, b) => a[1] - b[1]).map(a => a[0]);
function next() { while (active.length < 4 && queue.length) get(queue.shift()); }
// in the rAF tick, per transfer:
const d = clamp((now - x.t - x.lat) / (x.size / bw * 1000));
```

**Do not start new work inside a filter.** Count freed lanes during the pass, then refill once:

```js
let freed = 0;
active = active.filter(x => { /* …advance… */ if (d >= 1) { done(x); freed++; return false; } return true; });
if (freed) next();
```

Common mistakes:

- Calling `next()` inside `active.filter(...)`: the new transfers are pushed onto the old array and silently dropped, and loading stalls.
- Writing the photo title over the blurred preview; it fails contrast at every stage.
- Letting all tiles sharpen in DOM order on one timer; real networks interleave.
- Keeping half-loaded tiles in the tab order.
