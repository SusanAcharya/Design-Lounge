<!-- Design Lounge Nº 118 · "Island morph navbar" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Island morph navbar

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A live-radio site header ("halcyon") whose centrepiece is a **Dynamic-Island-style** black pill, absolutely centred at `top: 18px`. It has four sizes: idle 184×44, now-playing 392×60, notification 480×84, search 540px × (60 + rows). Width, height, negative margin and radius all spring together in 520ms `cubic-bezier(.34, 1.32, .5, 1)`. Layers crossfade with 6px blur. Behind it: 224px "Night / shift." and an "Up next" mix list. Lime `#D4FF3A` is the only accent. The detail worth copying is one DOM node whose `data-s` drives dimensions via custom properties — four inner layers, not four islands.

## Reference behaviour

1. Initial state: `data-s="playing"`. Island 392×60, radius 30px. Mix 0: **Low Tide Signal**, Mira Okonkwo · 48:12, conic art, five lime EQ bars, pause button, progress hairline starting at 38% and filling over 60s. First "Up next" row `aria-pressed="true"`.
2. Pause (`.pp`): toggles `.paused` on the island (EQ `animation-play-state: paused`), swaps the icon to a triangle, `aria-label` Play/Pause.
3. Clicking an Up next row calls `play(i)`: updates title/artist/duration, unpauses, sets that row pressed, `data-s="playing"`.
4. **Collapse** hint (or idle after pause-and-collapse): `data-s="idle"`, 184×44, radius 22. Content: pulsing rose 8px dot, "**Live** 2,418 listening". Click or Enter/Space on this layer opens search.
5. **⌘K / Ctrl+K** or the "⌘K search" hint: `data-s="search"`, width 540, height `--sh`. Input focused after 120ms. Filter mixes by title or host, max 4 rows. `--sh = 60 + max(1, hits.length) * 46 + 9`. Empty query shows the first four mixes. No matches: one disabled row "No mixes match / try “orchard”" (still counts as 1 row for height). ArrowUp/Down move `aria-selected`; Enter plays `hits[sel]`. Click a result plays it. Escape or pointerdown outside the island (and not on a hint button) returns to playing or idle (`back()`).
6. **Ping** hint: `data-s="notify"`, 480×84, radius 32. Avatar "JA", "Juno Arteaga · now", "invited you to co-host Sunday Slow", Later + Join. Auto-returns to the previous non-notify/search state after 5200ms. Later returns immediately. Join rewrites the sentence to "You joined Sunday Slow as co-host" and returns after 1600ms.
7. `prev` remembers the last idle/playing state so a ping can return to playing.
8. Reduced motion: morph and fade durations 1ms, delay 0, EQ/pulse/progress/marquee animations none. States still switch.

## Structure

```
1280 × 800  bg #0B0B0D
┌────────────────────────────────────────────────────────────────────────┐
│ header 80  ● halcyon                         [Go live]  (RC)           │
│                 ┌──────── island, left 50%, top 18, z 10 ────────┐     │
│                 │  playing 392×60  | idle 184×44 | notify 480×84 │     │
│                 │  search 540 × (60+46n+9)                       │     │
│                 └────────────────────────────────────────────────┘     │
│ main inset 80 0 0 0, grid 1fr 420px, pad 28 36 0                       │
│ ON AIR · Tonight… 21:00–02:00 CET                                      │
│ Night                    Up next                         6 mixes       │
│ shift.  (224px, 2nd line  │  [mix art 44] title / host     48:12      │
│         1.5px stroke)     │  six .row buttons                          │
│ Six hosts, five hours…                                                 │
│ Try [⌘K search] [Ping] [Collapse]     bottom 76                        │
│ marquee 56h: mix — host · mix — host · …  40s loop                     │
└────────────────────────────────────────────────────────────────────────┘
```

- `<header>` — `.logo` (10px lime disc + 4px halo, "halcyon" 20/800 −0.04em), `.golive`, `.me` "RC" `aria-label="Signed in as Rhea Castell"`.
- `.island#island` `role="region" aria-label="Activity island"` — four `.layer`s: `.l-idle`, `.l-play`, `.l-note`, `.l-search`.
- Idle: `role="button" tabindex="0" aria-label="Open search"`.
- Playing: art 40×40 r12, `#pt` / `#pa`, `.eq` five `<i>`, `#pp` 32px, `.prog > i`.
- Notify: `role="status" aria-live="polite"`. `#later` `.btn`, `#join` `.btn.pri`.
- Search: label.sbar with magnifier SVG, `#q` `aria-label="Search" aria-controls="res"`, `<kbd>esc</kbd>`, `#res role="listbox"`.
- `<main>` — kick, `<h1>Night<span>shift.</span></h1>`, blurb; `<aside class="list">` `#rows` filled in JS.
- `.hint` — three `data-go` buttons. `.marq#mq` `aria-hidden`.

Mixes (title, host, duration, swatch):

1. Low Tide Signal — Mira Okonkwo — 48:12 — `#2c6b5e`
2. Sodium Hours — Teo Varga — 52:40 — `#7a4a1f`
3. Glass Orchard — Ines Halloran — 41:05 — `#3a2a55`
4. Night Ferry to Split — Duro Collective — 63:18 — `#1f3a5a`
5. Ultramarine Static — Kaito Brandt — 39:47 — `#5a1f33`
6. Paper Moons — Aya Lindqvist — 45:30 — `#4b5a1f`

## Tokens

```css
:root {
  /* colour — near-black, lime accent, rose live pip */
  --bg: #0b0b0d;
  --surface: #141417;
  --surface-2: #1c1c21;
  --line: #26262c;
  --ink: #f4f2ee;
  --ink-2: #a3a1a9;
  --ink-3: #6b6a72;
  --island: #000;
  --accent: #d4ff3a;
  --accent-ink: #141a00;
  --rose: #ff6b8b;

  /* type */
  --sans: "Sora", system-ui, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;

  /* island sizes */
  --idle-w: 184px; --idle-h: 44px; --idle-r: 22px;
  --play-w: 392px; --play-h: 60px; --play-r: 30px;
  --note-w: 480px; --note-h: 84px; --note-r: 32px;
  --search-w: 540px; --search-r: 26px;

  /* motion */
  --spring: cubic-bezier(.34, 1.32, .5, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-morph: 520ms;
  --t-fade: 220ms;
  --t-micro: 160ms;
  --note-hold: 5200ms;
  --join-hold: 1600ms;
}
```

Island uses `--w --h --r --sh` set per `data-s`. Centring: `left:50%; margin-left: calc(var(--w) / -2)` so width changes stay centred (margin is on the same 520ms spring).

## Typography

| Role            | Family        | Size | Weight | Line-height | Tracking | Case      |
|-----------------|---------------|-----:|-------:|------------:|---------:|-----------|
| Body            | Sora          | 14px | 400    | 1.5         | 0        | sentence  |
| Logo            | Sora          | 20px | 800    | 1           | −0.04em  | lowercase |
| Go live         | Sora          | 13px | 500    | 38px h      | 0        | sentence  |
| Idle island     | JetBrains Mono| 12px | 500    | 44px h      | 0        | mixed     |
| Playing title   | Sora          | 13px | 600    | 1.25        | 0        | sentence  |
| Playing meta    | JetBrains Mono| 11px | 400    | 1.25        | 0        | mixed     |
| Notify          | Sora          | 13px | 600/400| 1.35        | 0        | sentence  |
| Search input    | Sora          | 15px | 500    | 1           | 0        | sentence  |
| Results / rows  | Sora          | 13/14| 500/600| 46 / auto   | 0        | sentence  |
| Kick / list h2  | JetBrains Mono| 12px | 500    | 1           | +0.12em  | UPPERCASE |
| Display         | Sora          | 224px| 800    | 0.8         | −0.07em  | title     |
| Blurb           | Sora          | 15px | 400    | 1.5         | 0        | sentence  |
| Marquee / hint  | Sora / Mono   | 15 / 12 | 600/400 | 56 / 32 | 0     | mixed     |

Second headline line is transparent fill, `-webkit-text-stroke: 1.5px var(--ink-3)`.

## Motion

| Element         | Trigger      | Property                          | From → To                 | Duration | Easing    | Notes |
|-----------------|--------------|-----------------------------------|---------------------------|----------|-----------|-------|
| Island box      | data-s       | width, height, margin-left, radius| size table above          | 520ms    | `--spring`| overshoot |
| Incoming layer  | data-s       | opacity, filter, scale            | 0, blur 6, .94 → 1,0,1    | 220 / 520| ease / spring | delay 110ms |
| Outgoing layer  | data-s       | same                              | reverse, delay 0          | 220ms    | `--ease`  | pointer-events none |
| EQ bars         | playing      | scaleY                            | .25 ↔ 1                   | 900ms alt | `--ease` | delays −300/−600/−150/−450 |
| Progress        | playing      | width                             | 38% → 100%                | 60s linear | —       | infinite (demo) |
| Live pip        | idle         | box-shadow                        | 0 → 6px rose fade         | 1.8s      | `--ease` | infinite |
| Marquee         | load         | translateX                        | 0 → −50%                  | 40s linear | —       | content duplicated |
| Row hover       | hover        | background                        | transparent → `--surface` | 160ms    | `--ease` | pressed title `--accent` |

Search height is not in the four fixed `--h` values; JS sets `--sh` on each filter.

## States

- **playing (default):** 392×60 r30. Pause icon. Row 0 pressed.
- **paused:** same size; EQ frozen; play triangle.
- **idle:** 184×44 r22; live count; cursor pointer.
- **notify:** 480×84 r32; Later secondary, Join lime.
- **search:** 540 × `--sh` r26; first result `aria-selected="true"`.
- **Go live hover:** ink, border `--ink-3`.
- **Hint button hover:** ink, border `--ink-3`.
- **Focus-visible:** 2px lime outline, 3px offset (global).

## Accessibility

- Island is `role="region" aria-label="Activity island"`. Idle layer is keyboard-activable (`tabindex="0"`, Enter/Space). Notify is `role="status" aria-live="polite"`.
- Search input labelled; listbox + option; `aria-selected` follows arrow keys. `kbd` is visual only.
- Mix rows are `<button aria-pressed>`. Only one pressed.
- ⌘K / Ctrl+K `preventDefault` so the browser find dialog does not open. Escape leaves search/notify.
- Avatar "JA" and EQ/progress/marquee are `aria-hidden` or decorative.
- Contrast: `--ink` on `--bg` is high; lime on black for Join (`--accent-ink` `#141a00` on `#d4ff3a`). `--ink-3` is 11–12px mono only.
- Hit targets: idle layer full 184×44; pause 32px (tight, desktop); Later/Join 36px; rows ~44px; hint 32px.

## Responsive rules

- ≥ 1280: as specified. Headline 224px.
- 1024–1279: headline 160px; list column 340px; island sizes unchanged (they are centred and independent of the grid).
- 768–1023: main becomes one column; list under the blurb; headline 120px. Island max-width `min(var(--w), 100vw − 24px)` so search does not clip.
- < 640: hide Go live; island idle may become the only header control. Marquee can hide. Keep ⌘K for keyboards; the hint buttons remain the touch path.
- Reduced motion: instant morph, no EQ/pulse/progress/marquee.

## Acceptance checklist

- [ ] Island is centred at top 18px and springs width/height/radius/margin in 520ms with `cubic-bezier(.34,1.32,.5,1)`.
- [ ] First frame is playing 392×60 with Low Tide Signal, EQ moving, progress at 38%.
- [ ] Idle is 184×44 with "Live 2,418 listening" and a pulsing rose pip; click opens search.
- [ ] Notify is 480×84, auto-dismisses at 5200ms; Join rewrites the copy and dismisses at 1600ms.
- [ ] Search is 540px, height `60 + 46×rows + 9`, filters to max 4, arrows + Enter select.
- [ ] ⌘K / Ctrl+K opens search; Escape and outside click return to playing or idle.
- [ ] Playing pause toggles `.paused`, the icon, and EQ play-state.
- [ ] Six mixes, six rows, marquee duplicates the same six "title — host" pairs.
- [ ] Headline is 224px / .8 / −0.07em; "shift." is outlined, not filled.
- [ ] Incoming layer fades 220ms with 110ms delay and a 6px blur.
- [ ] Reduced motion keeps state changes, drops animation.
- [ ] Focus rings are 2px lime on island controls, rows, hints, Go live.

## Implementation notes

**Size is custom properties on `data-s`**, not separate components:

```css
.island {
  width: var(--w); height: var(--h);
  margin-left: calc(var(--w) / -2);
  border-radius: calc(var(--r));
  transition: width var(--t-morph) var(--spring),
              height var(--t-morph) var(--spring),
              margin-left var(--t-morph) var(--spring),
              border-radius var(--t-morph) var(--spring);
}
.island[data-s="idle"]     { --w: 184px; --h: 44px; --r: 22px; }
.island[data-s="playing"]  { --w: 392px; --h: 60px; --r: 30px; }
.island[data-s="notify"]   { --w: 480px; --h: 84px; --r: 32px; }
.island[data-s="search"]   { --w: 540px; --h: var(--sh, 60px); --r: 26px; }
```

**Only the matching layer is interactive:**

```css
.layer { opacity: 0; filter: blur(6px); transform: translateX(-50%) scale(.94); pointer-events: none; }
.island[data-s="playing"] .l-play /* + idle/notify/search */ {
  opacity: 1; filter: none; transform: translateX(-50%); pointer-events: auto; transition-delay: 110ms;
}
```

**Search height from row count** (always at least one row so empty-state still fits):

```js
hits = hits.slice(0, 4);
isl.style.setProperty('--sh', (60 + Math.max(1, hits.length) * 46 + 9) + 'px');
```

Common mistakes: animating `left` instead of `margin-left: calc(w/-2)` (the island will drift off centre); four separate islands with display:none (no morph); using `ease` on the box (the overshoot **is** the idea); forgetting to store `prev` so a ping from playing returns to idle; letting ⌘K fall through to the browser; putting `overflow:hidden` on a parent that clips the 40px shadow.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
