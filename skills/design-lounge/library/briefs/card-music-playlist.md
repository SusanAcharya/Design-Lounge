<!-- Design Lounge Nº 359 · "Playlist card with now playing" · www.designlounge.live -->

# Playlist card with now playing

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A playlist card for a listening app, "Slow Lanes", on a sage page. The left column is a 2×2 cover collage built from CSS shapes (no images), the title in a high-contrast serif, a one-line description, the curator, and a control row with a cobalt play button, shuffle, save, and the total runtime. The right column is a ten-row track list and a dark now-playing bar with a scrubber that really advances. The details worth copying: the track number turns into a play glyph on hover and into four equaliser bars on the playing row, and turning shuffle on physically reorders the queue with a staggered FLIP slide, keeping the current track on top.

## Structure

```
1280 × 800, page #d8ddcb, card centred, max 960px, padding 28px, radius 20px
┌──────────────────────────────────────────────────────────────────────────┐
│ ┌──────────┬──────────┐   #   TITLE                               TIME  │
│ │ cobalt + │ coral    │  ───────────────────────────────────────────────│
│ │ ochre sun│ stripes  │   1   Sodium Lights / Parade of…          3:42  │
│ ├──────────┼──────────┤  ▮▮▮▮ Ring Road, 2am / Tara Vale (cobalt)  4:18  │
│ │ pine     │ ochre +  │   3   Kerosene Blue / The Lantern Set     3:05  │
│ │ arcs     │ cobalt   │   …   ten rows, 44px min each                   │
│ └──────────┴──────────┘  10   Toll Booth Lullaby / Juno Marr      5:04  │
│ PLAYLIST · UPDATED THURSDAY                                              │
│ Slow Lanes            46px                                               │
│ description 14px, 34ch                                                   │
│ Compiled by Nisha Gurung · 1,204 saves                                   │
│ (▶ 56) (⤨) (♡)                     41 min 07 s                           │
│                                    10 tracks   ┌────────────────────────┐│
│                                                │[art] Ring Road, 2am ▮▮ ⏮ ⏭││
│  300px column, gap 36px                        │ 1:13 ━━━━━○──────── 4:18 ││
│                                                └────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
```

- `article.card` labelled by the `h1`. Grid `300px minmax(0,1fr)`, gap 36px.
- Left `section`: `.collage` (decorative, `aria-hidden`, grid 2×2, gap 4px, radius 12px, square), kicker, `h1`, description, curator line, `.ctrls` row.
- Right `section.list-wrap[aria-label=Tracks]`: a decorative header row, `ol#list`, then `.now[role=region][aria-label="Now playing"]` pushed to the bottom with `margin-top: auto`.
- Each `li.track` holds one `button.tp` laid out as a grid `40px minmax(0,1fr) 60px`: number slot, title + artist, duration. The number slot stacks the number, a play glyph, and the bars in the same 20px box.
- The now-playing bar is a grid `44px minmax(0,1fr) auto`: mini art (the collage tile for that track), title, artist, elapsed, slider, duration, then bars, previous, next.

Tracks (title, artist, seconds): Sodium Lights, Parade of Small Hours, 222 · Ring Road, 2am, Tara Vale, 258 · Kerosene Blue, The Lantern Set, 185 · Underpass, Juno Marr, 311 · Slow Indicator, Okra Dusk, 236 · Petrol Rain, Mekh Ensemble, 242 · Last Bus Home, Sabin and the Quiet, 208 · Overpass Choir, Tara Vale, 284 · Low Beams, Parade of Small Hours, 217 · Toll Booth Lullaby, Juno Marr, 304.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| Equaliser bars (4 per set) | playing | scaleY from bottom | 0.25 → 1, alternate | 1s, .7s, 1.2s, .85s; negative delays | `--ease` | static |
| Bars | paused | play-state | running → paused | – | – | – |
| Row | hover/focus | background | transparent → `--row` | 160ms | `--ease` | instant |
| Number ↔ play glyph | hover/focus | opacity swap | – | instant | – | same |
| Track rows | shuffle toggle | translateY (FLIP) | old offset → 0 | 420ms, +18ms per row | `--expo` | instant |
| Heart | save on | scale | 1 → 1.35 (30%) → 1 | 420ms | `--expo` | none |
| Play button | hover / active | scale | 1.05 / 0.95 | 160ms | `--ease` | none |
| Scrubber fill | each second | width | – | none | – | same |

## States

- **Row resting:** number in `--ink-2`, title ink.
- **Row hover/focus-visible:** `--row` background, play glyph replaces the number. Focus ring is drawn inset (−2px offset) so it stays inside the list.
- **Row current (`aria-current="true"`):** cobalt title, bars replace the number, even on hover.
- **Paused:** bars frozen; big button shows a play triangle and is labelled "Play".
- **Shuffle on:** `aria-pressed="true"`, cobalt glyph, `#e2e5f8` disc.
- **Saved:** `aria-pressed="true"`, filled coral heart.
- **Icon button hover:** `--row` disc, ink glyph.
- **Empty playlist (not drawn):** replace the list with one line "No tracks yet. Add songs from search." and hide the now-playing bar.
- **Error (not drawn):** a track that fails to load shows its duration as "—" in `--ink-2` and is skipped by next.

## Accessibility

- The list is an `ol`. Each row is one `button` named "Play Sodium Lights by Parade of Small Hours, 3:42"; the current playing row reads "Pause …".
- The collage and mini art are decorative (`aria-hidden`).
- Play, Shuffle, Save, Previous, Next are buttons with labels; Shuffle and Save use `aria-pressed`.
- The scrubber is `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and `aria-valuetext` ("1:13 of 4:18"). Arrow keys step 5 seconds.
- A polite live region announces track changes, play/pause, shuffle on/off, and save.
- Contrast: ink on card 15:1. `--ink-2` on card 6.6:1. Cobalt title on card 6.4:1. Card text on the ink bar 15:1; the artist grey `#b9bfb2` on ink 9:1.
- Hit targets: rows 44px, icon buttons 44px, play 56px.

## Responsive rules

- **≥ 1280:** as drawn, card 960px.
- **1024:** card shrinks to viewport minus 64px; the list column absorbs it. Titles truncate.
- **≤ 900:** one column. The collage caps at 300px; the list and now-playing bar follow below.
- **< 480 (check 375):** page padding 12px, card padding 18px, gap 24px, title 38px. The now-playing bar becomes two columns with its controls on a centred row underneath. No horizontal scroll.

## Acceptance checklist

### Always

- [ ] The cover is made from CSS shapes or real artwork, never a placeholder box.
- [ ] Row number swaps to a play glyph on hover and on keyboard focus.
- [ ] The playing row shows animated bars that freeze, not vanish, when paused.
- [ ] The total runtime is computed from track data, not typed.
- [ ] Shuffle reorders the visible queue with a FLIP slide, keeps the current track first, and renumbers.
- [ ] Save is a toggle with `aria-pressed`, a count change, and a one-shot pop.
- [ ] The scrubber advances in real time, seeks on click, and works with arrow keys.
- [ ] Every row is a single button with a full accessible name.
- [ ] One polite live region announces changes.
- [ ] Reduced motion stops bars, pop, and slide.

### This demo

- [ ] "Slow Lanes" in Gloock 46px; curator Nisha Gurung; 1,204 saves.
- [ ] Ten tracks totalling 41 min 07 s; track 2 starts current at 1:12.
- [ ] Cobalt `#2b44e0` is the only UI accent; coral is only for the saved heart and collage.
- [ ] Page `#d8ddcb`, card `#f7f4ea`, now-playing bar `#1b201b` with ochre bars.
- [ ] Rows are 44px with columns 40px / flexible / 60px.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: track 2, "Ring Road, 2am" by Tara Vale, is playing at 1:12 of 4:18. Its row title is cobalt and its number slot shows cobalt equaliser bars. The big button shows a pause glyph.
2. The elapsed time advances once per second and the scrubber fill follows. At the end of a track, the next track in the current order starts at 0:00.
3. Hover or keyboard-focus any row: its background becomes `#efebdd` and its number cross-fades to a 16px play triangle.
4. Click a row: that track starts at 0:00, becomes current, and the live region says "Playing Kerosene Blue by The Lantern Set". Clicking the current row toggles pause.
5. The big play button and the current row both toggle play/pause. When paused, every set of bars freezes in place (`animation-play-state: paused`) rather than disappearing.
6. Shuffle (44px round button): on, it gets a cobalt glyph and a `#e2e5f8` disc. The queue is reshuffled with the current track moved to position 1; every other row slides from its old position to its new one in 420ms expo, staggered 18ms per row. Numbers rewrite to 1–10 in the new order. Off restores the original order with the same slide.
7. Save (heart): on, the heart fills coral `#e8674a`, pops to 1.35× and back in 420ms, the save count goes from 1,204 to 1,205, and the label becomes "Remove from saved".
8. Previous: if more than 3 seconds in, restart the track; otherwise go to the previous track. Next: go to the next track in the current order.
9. The scrubber is a slider: click to seek, ArrowLeft/ArrowRight step 5 seconds.
10. The total under the controls is computed from the data: "41 min 07 s · 10 tracks".
11. Reduced motion: bars are static, the shuffle reorder is instant, the heart does not pop.

## Tokens

```css
:root {
  /* colour */
  --bg: #d8ddcb;      /* sage page */
  --card: #f7f4ea;    /* card surface */
  --row: #efebdd;     /* row hover, icon hover */
  --ink: #1b201b;     /* text, now-playing bar */
  --ink-2: #565c52;   /* artist, numbers, durations, captions */
  --line: #ddd8c6;    /* header rule */
  --cobalt: #2b44e0;  /* the accent: play button, current title, bars, focus */
  --ochre: #e3a23a;   /* collage, bars inside the dark bar */
  --coral: #e8674a;   /* collage, saved heart */
  --pine: #2f4a3a;    /* collage */
  --cream: #f3ecd9;   /* collage */

  /* type */
  --serif: "Gloock", Georgia, serif;
  --sans: "Rethink Sans", system-ui, sans-serif;

  /* space: 4px base */
  --s1: 4px; --s2: 8px; --s3: 12px; --s4: 14px; --s5: 20px; --s6: 28px; --s7: 36px;

  /* radius */
  --r-card: 20px; --r-collage: 12px; --r-now: 12px; --r-row: 8px; --r-art: 6px;

  /* shadow (card only) */
  --shadow: 0 1px 0 rgba(27,32,27,.06), 0 40px 80px -40px rgba(27,32,27,.35);

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-micro: 160ms; --t-flip: 420ms; --t-pop: 420ms; --stagger: 18ms;
}
```

Collage tiles, all pure CSS:

- Tile 1: cobalt square, ochre disc 70% wide at left −12% bottom −24%, three 2px cream lines at 22% from the top spaced 8px.
- Tile 2: `repeating-linear-gradient(-45deg, coral 0 14px, cream 14px 18px)`.
- Tile 3: concentric quarter arcs from the bottom-right corner: `radial-gradient(circle at 100% 100%, cream 0 14%, pine 14% 26%, cream 26% 30%, pine 30% 44%, cream 44% 48%, pine 48%)`.
- Tile 4: ochre square, a cobalt arch (left/right 12%, top 30%, radius `50% 50% 0 0`), a 16% coral dot top-right.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Title `h1` | Gloock | 46px | 400 | 1 | -0.01em | Title |
| Kicker, table header | Rethink Sans | 11px | 600 | 1 | 0.12–0.14em | UPPER |
| Description | Rethink Sans | 14px | 400 | 1.45 | 0 | sentence |
| Curator, total caption | Rethink Sans | 12px | 400 / 600 name | 1.3 | 0 | sentence |
| Track title | Rethink Sans | 14px | 600 | 1.3 | 0 | as written |
| Artist | Rethink Sans | 12px | 400 | 1.3 | 0 | as written |
| Number, duration | Rethink Sans | 13px | 400 | 1 | 0 | tabular-nums |
| Now-playing times | Rethink Sans | 11px | 400 | 1 | 0 | tabular-nums |

Gloock is used once, for the title. Everything else is the sans. Long titles truncate with an ellipsis rather than wrap.

## Implementation notes

**Three glyphs, one slot.** Stack the number, the play glyph, and the bars in the same box and switch with opacity and display, so the row never shifts width.

```css
.idx { position: relative; height: 20px; display: grid; place-items: center; }
.idx svg { position: absolute; width: 16px; height: 16px; opacity: 0; }
.tp:hover .idx .n, .tp:focus-visible .idx .n { opacity: 0; }
.tp:hover .idx svg, .tp:focus-visible .idx svg { opacity: 1; }
.bars { display: none; align-items: flex-end; gap: 2px; height: 14px; color: var(--cobalt); }
.track[aria-current="true"] .idx .bars { display: flex; position: absolute; }
.track[aria-current="true"] .idx .n,
.track[aria-current="true"] .tp:hover .idx svg { opacity: 0; }
.bars i { width: 3px; height: 100%; background: currentColor; transform-origin: bottom;
  animation: eq 1s var(--ease) infinite alternate; }
.paused .bars i { animation-play-state: paused; }
@keyframes eq { from { transform: scaleY(.25); } to { transform: scaleY(1); } }
```

**FLIP the shuffle.** Measure, reorder the DOM, invert, then play:

```js
const first = new Map(rows.map(r => [r, r.getBoundingClientRect().top]));
order.forEach(id => list.appendChild(byId[id]));          // new DOM order
rows.forEach((r, i) => {
  const dy = first.get(r) - r.getBoundingClientRect().top;
  if (!dy) return;
  r.style.transition = 'none';
  r.style.transform = `translateY(${dy}px)`;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    r.style.transition = `transform 420ms cubic-bezier(.16,1,.3,1) ${i * 18}ms`;
    r.style.transform = '';
  }));
});
```

The double `requestAnimationFrame` matters: with one, the browser can merge the inverted and final transforms and nothing moves.

**Total runtime from data:**

```js
const sum = tracks.reduce((a, t) => a + t.len, 0);
total.textContent = `${Math.floor(sum / 60)} min ${String(sum % 60).padStart(2, '0')} s`;
```

Common mistakes:

- A hover-only play icon with no keyboard equivalent. Use `:focus-visible` in the same selector.
- Hiding the bars on pause. Frozen bars still say "this is the track".
- Shuffling only the internal queue while the list stays put. The point is that the user sees the new order.
- Moving the current track out of view on shuffle.
- `setInterval` that keeps counting while paused.
- A second accent for the heart in the resting state. It is grey until saved.

Rebuild order:

1. Page, card grid, collage tiles.
2. Title block and control row with the computed total.
3. Track rows with the three-glyph number slot.
4. Now-playing bar, ticking elapsed time, slider, next/previous.
5. Play/pause wiring across the big button, rows, and bars.
6. Shuffle with FLIP, save with pop and count.
7. Live region, reduced motion, breakpoints.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
