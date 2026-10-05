<!-- Design Lounge Nº 239 · "Event countdown ticket card" · www.designlounge.live -->

# Event countdown ticket card

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A single ticket card for a small music night, "Lowtide Sessions 04", sitting on a night-blue page. The left third is a riso-style tangerine poster with a striped setting sun and a stacked condensed title. A dashed perforation with two half-circle notches separates it from the cream stub. The stub carries the event name, a split-flap countdown to Sat 21 Nov 2026 19:30 Kathmandu time (+05:45), the venue with door times, an "Add to calendar" menu, ticket tiers, a quantity stepper, and a tangerine "Get tickets" button that turns into a ten-minute seat hold. The detail worth copying is the flip digit: each digit is four half-tiles, and only the digits that change flip, so the seconds tick on their own and the days only move at midnight.

## Structure

```
1280 × 800, page #0f1633 with a 6px dot grain, card centred, max 960px wide
┌──────────────────────┬╌╌┬──────────────────────────────────────────────────┐
│ TAPE & SYNTH  NO. 04 │ ╎ │ LOWTIDE SESSIONS 04          Sat 21 Nov · 19:30 │
│                      │ ╎ │ ─────────────────────────────────────────────── │
│    (striped sun)     │ ╎ │ • DOORS OPEN IN                                  │
│  ~~~~~~~~~~~~~~~~~~  │ ╎ │ [4][8] : [1][9] : [1][5] : [1][6]   48×72 tiles │
│ LOW                  │ ╎ │ DAYS     HOURS     MINUTES   SECONDS            │
│ TIDE      108px      │ ╎ │ ─────────────────────────────────────────────── │
│ SESSIONS  40px cream │ ╎ │ KILN HALL                     ( Add to calendar )│
│ lineup 12px mono     │ ╎ │ address · Doors 19:30 First set 20:15 Curfew    │
│                      │ ╎ │ ─────────────────────────────────────────────── │
│  poster 340px wide   │ ╎ │ [Standing][Balcony][Early bird]      [- 2 +]    │
│  tangerine #ff6a2b   │ ╎ │ [ GET 2 STANDING TICKETS          NPR 3,600 ]   │
│                      │ ╎ │ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬───  212 of 250 sold           │
└──────────────────────┴╌╌┴──────────────────────────────────────────────────┘
          notches: 24px circles in page colour at the top and bottom of the perforation
```

- `article.ticket` labelled by the `h1`. Grid `340px minmax(0,1fr)`, radius 6px, shadow `0 30px 60px -30px rgba(0,0,0,.6)`.
- `.poster` is decorative (`aria-hidden="true"`). The kicker row, an inline SVG sun (circle r120 in cream, five tangerine bars of growing height across its lower half, a 3px navy wave), the stacked title, and the lineup.
- The perforation is `::after` on the ticket: `border-left: 2px dashed #cdbfa3`, inset 14px top and bottom. Two `span.notch` elements, 24px circles filled with the page colour, sit at top −12px and bottom −12px over it.
- `.stub` is a flex column, gap 18px, padding 26px 34px 26px 42px.
- `header.when`: `h1` and a `<time datetime="2026-11-21T19:30+05:45">`.
- The countdown is a `section` with a label paragraph and `div.clock[role=timer]`. Four `.unit`s, each a `.pair` of two `.flip` tiles and a `small` caption, separated by `.colon` spans.
- `.venue`: a two-column grid, details left and the calendar menu button right.
- `form.buy`: a `fieldset` of radio cards, a quantity group, the submit button, and the meter.
- One `p[role=status]` for announcements.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| `.flip > .ft` (old top) | digit change | rotateX, brightness | 0 → −90°, 1 → 0.6 | 260ms | `--fold` | text swap only |
| `.flip > .fb` (new bottom) | digit change | rotateX, brightness | 90° → 0, 1.4 → 1 | 300ms, delay 260ms | `--expo` | text swap only |
| Live dot | always | opacity | 1 → 0.25 → 1 | 2s loop | `--ease` | static |
| Calendar menu | open/close | scale, translateY, opacity | 0.96, −4px, 0 → 1, 0, 1 | 240ms | `--expo` | instant |
| Outline buttons | hover | background, colour | transparent → ink | 160ms | `--ease` | instant |
| CTA | `:active` | translateY, shadow | 0, 4px → 3px, 1px | 120ms | `--ease` | instant |
| CTA | hold | background | tangerine → ink | 160ms | `--ease` | instant |

Tile perspective is 320px on each `.flip`. The 1px dark seam (`::after` at 50%) sits above all halves (`z-index: 3`).

## States

- **Digit idle:** all four halves show the same character.
- **Digit flipping (`.go`):** top shows new, bottom shows old, folding top shows old, landing bottom shows new. After 600ms, every half shows new and `.go` is removed.
- **Countdown ended:** tiles 00, label "Doors are open".
- **Calendar button idle:** outline. Hover: ink fill. Open: `aria-expanded="true"`. Saved: ink fill, check icon, "Saved · Sat 21 Nov".
- **Menu item hover/focus:** `--paper-2` background, focus ring inset 2px.
- **Tier selected:** ink border plus a 1px inset ink ring, background `#fff8ea`. Disabled: 50% opacity, struck.
- **Stepper:** disabled end shows the button glyph in `--line` with `cursor: not-allowed`.
- **CTA busy:** `aria-busy="true"`, `cursor: progress`, "Holding seats…".
- **CTA held:** ink, cream text, "Held · m:ss to pay" and "Release".
- **Focus-visible everywhere:** 2px tangerine outline, 3px offset.

## Accessibility

- The countdown tiles are visual. The clock has `role="timer"` and an `aria-label` "Countdown to doors"; a visually hidden paragraph holds the sentence "48 days, 19 hours, 15 minutes until doors open." with `aria-live="off"` so screen readers are not spammed every second.
- The poster is `aria-hidden`; the event name, date, and lineup that matter are in the stub.
- The calendar button has `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`. Items have `role="menuitem"` and `tabindex="-1"`. ArrowDown on the button opens the menu; ArrowUp/ArrowDown cycle items; Escape closes and returns focus; Tab closes. Outside click closes.
- Tiers are native radios in a `fieldset` with a `legend`; the input is stretched invisibly over its card so the whole card is the hit target. The sold-out tier is `disabled`.
- Stepper buttons have labels "One fewer ticket" / "One more ticket"; the `output` is polite.
- The status region announces "Calendar file downloaded.", "Date and venue copied.", "3 seats held for 10 minutes.", "Seats released."
- Contrast: ink on paper 14.6:1. `--ink-2` on paper 7.3:1. Navy on tangerine 6.1:1 for the CTA. Cream digits on `#141a33` 14:1.
- Hit targets: calendar button 40px tall, menu items 40px, tier cards 52px, stepper 40×56, CTA 56px.

## Responsive rules

- **≥ 1280:** as drawn. Card 960px.
- **1024:** the card shrinks to the viewport minus 64px; the stub column takes the loss. Tiles stay 48×72.
- **≤ 860:** one column. The poster goes on top, 300px tall, radius on the top corners only, sun moved right. Perforation and notches are hidden. Stub padding 24px.
- **≤ 480 (check 375):** page padding 12px, stub padding 22px 20px, tiles 32×50 with a 40px digit, colons hidden, clock gap 10px so all four pairs stay on one row. Venue and buy grids become one column; the menu aligns left. CTA text 15px. Nothing scrolls sideways.

## Acceptance checklist

### Always

- [ ] The countdown is derived from a real ISO date with an explicit offset, recomputed every second, aligned to the wall clock.
- [ ] Only changed digits flip; each flip is two halves, 260ms fold then 300ms land.
- [ ] The first render shows the correct time without animating.
- [ ] The add-to-calendar control is a menu button with arrow-key navigation, Escape, outside click, and focus return.
- [ ] One option produces a real `.ics` file from a Blob; the other copies text and survives a blocked clipboard.
- [ ] Tiers are radios in a fieldset; a sold-out tier is disabled and struck.
- [ ] The CTA label and price update live from tier and quantity, and the CTA has busy and held states.
- [ ] Every status change is announced in one polite region.
- [ ] Reduced motion removes the flips, pulse, and menu scale but keeps every state.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Target: Sat 21 Nov 2026, 19:30 at +05:45 (13:45 UTC).
- [ ] "Lowtide Sessions 04" at Kiln Hall, Ward 3, Jhamsikhel Road, Lalitpur 44700. Doors 19:30, first set 20:15, curfew 23:30.
- [ ] Standing NPR 1,800, Balcony NPR 2,600, Early bird sold out; quantity starts at 2.
- [ ] Poster `#ff6a2b`, stub `#f1e9d8`, page `#0f1633`, tiles `#1d2547` over `#141a33`.
- [ ] Hold timer starts at 10:00; meter reads 212 of 250.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: the countdown already shows real remaining time (for example `48 : 19 : 15 : 16`). No zeros flash on load; the first render is instant, without flips.
2. Every second, aligned to the wall clock (`setTimeout(tick, 1000 - Date.now() % 1000 + 5)`), the countdown re-renders. Only digits whose value changed flip.
3. A flip: the top half of the old digit folds down to 90° in 260ms (ease-in), then the bottom half of the new digit unfolds from 90° to 0 in 300ms (expo out). Total 560ms. The old digit's bottom stays visible until the new bottom lands.
4. The countdown is computed from `new Date('2026-11-21T19:30:00+05:45')`. Never from a hard-coded day count. When the remaining time reaches 0, every tile reads 00 and the label changes from "Doors open in" to "Doors are open".
5. A 7px tangerine dot before the label pulses opacity 1 → 0.25 → 1 over 2s, forever. It is the only loop.
6. "Add to calendar" (40px pill, 1.5px ink outline) opens a menu below it, right-aligned, scale 0.96 → 1 and fade, 240ms expo. Focus moves to the first item.
7. Menu item 1, "Download calendar file (.ics)", is a real link with `download` and a Blob URL holding a VEVENT (DTSTART 20261121T134500Z, DTEND 20261121T174500Z). Item 2, "Copy date and venue", writes a one-line summary with the Clipboard API.
8. After either item, the menu closes, focus returns to the button, the button fills ink with cream text, reads "Saved · Sat 21 Nov", and its plus icon becomes a check. If the clipboard is blocked, the live region reads the text aloud instead.
9. Tiers are radio cards: Standing NPR 1,800 (selected), Balcony NPR 2,600, Early bird (disabled, struck, "Sold out").
10. The quantity stepper starts at 2, range 1–6. Minus is disabled at 1, plus at 6.
11. The CTA label and price follow the selection live: "Get 2 standing tickets · NPR 3,600". Prices use `toLocaleString('en-US')` with an "NPR " prefix.
12. Press the CTA: it reads "Holding seats…" with `aria-busy` for 700ms, then turns ink, reads "Held · 10:00 to pay", and the right side reads "Release". The timer counts down every second. Pressing again releases the hold and restores the price label. At 0:00 the hold releases itself.
13. Under the CTA, a 4px meter shows 85% sold with "212 of 250 sold · max 6 per order".
14. Reduced motion: digits swap without flipping, the dot does not pulse, the menu appears without scaling.

## Tokens

```css
:root {
  /* colour */
  --night: #0f1633;     /* page */
  --paper: #f1e9d8;     /* stub, digits, sun */
  --paper-2: #e6dcc6;   /* menu hover, meter track */
  --ink: #141a33;       /* text, tile bottoms, held CTA */
  --ink-2: #4a4f66;     /* captions, address */
  --line: #cdbfa3;      /* rules, perforation, idle tier border */
  --tang: #ff6a2b;      /* poster, CTA, focus ring, live dot */
  --tang-ink: #b8410f;  /* colons, CTA bottom edge */
  --tile: #141a33;      /* flip bottom half */
  --tile-2: #1d2547;    /* flip top half, a shade lighter */
  --digit: #f1e9d8;

  /* type */
  --disp: "Anybody", "Arial Narrow", sans-serif;   /* variable width 50–150 */
  --mono: "Reddit Mono", ui-monospace, monospace;

  /* flip tile */
  --fw: 48px; --fh: 72px; --fs: 60px;

  /* space: 4px base */
  --s1: 4px; --s2: 8px; --s3: 12px; --s4: 16px; --s5: 18px; --s6: 24px; --s7: 28px;

  /* radius */
  --r-card: 6px; --r-tile: 6px; --r-field: 8px; --r-menu: 10px; --r-pill: 999px;

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --fold: cubic-bezier(.55, 0, .9, .4);   /* top half falling */
  --t-fold: 260ms; --t-land: 300ms; --t-menu: 240ms; --t-micro: 160ms;
}
```

Grain: `radial-gradient(rgba(241,233,216,.06) 1px, transparent 1.2px)` at 6px on the page; `radial-gradient(rgba(15,22,51,.22) 1px, transparent 1.4px)` at 5px with `mix-blend-mode: multiply` on the poster.

## Typography

| Role | Family | Size | Weight | Width (`font-stretch`) | Tracking | Case |
|------|--------|-----:|-------:|------:|---------:|------|
| Poster title (LOW / TIDE) | Anybody | 108px, lh 0.78 | 900 | 62% | -0.01em | UPPER |
| Poster "Sessions" | Anybody | 40px | 900 | 140% | 0 | UPPER, cream |
| Kicker, lineup | Reddit Mono | 11–12px | 600 | – | 0.06–0.14em | UPPER |
| Event name `h1` | Anybody | 30px | 800 | 110% | 0.01em | UPPER |
| Date line | Reddit Mono | 12px | 400 | – | 0.04em | sentence |
| Section labels | Reddit Mono | 11px | 600 | – | 0.14em | UPPER |
| Flip digit | Anybody | 60px / 72px | 800 | 80% | 0 | numerals |
| Unit caption | Reddit Mono | 10px | 600 | – | 0.16em | UPPER |
| Venue name | Anybody | 22px | 800 | 100% | 0 | UPPER |
| Tier price | Anybody | 18px | 800 | 100% | 0 | as written |
| CTA | Anybody | 18px | 800 | 115% | 0.02em | UPPER |
| CTA price | Reddit Mono | 14px | 600 | – | 0 | as written |

Anybody's width axis is the whole voice: narrow for the poster, normal for names, wide for "Sessions" and the CTA. Load it with `wdth,wght@50..150,500..900`.

## Implementation notes

**Four halves per digit.** The trick is that each half is clipped to 50% height and holds a full-height glyph; the bottom halves shift that glyph up by half.

```css
.flip { position: relative; width: var(--fw); height: var(--fh); perspective: 320px;
  font: 800 var(--fs)/var(--fh) var(--disp); color: var(--digit); }
.flip > span { position: absolute; left: 0; right: 0; height: 50%; overflow: hidden; background: var(--tile); }
.flip > .t, .flip > .ft { top: 0; transform-origin: 50% 100%; background: var(--tile-2); border-radius: 6px 6px 0 0; }
.flip > .b, .flip > .fb { bottom: 0; transform-origin: 50% 0; border-radius: 0 0 6px 6px; }
.flip i { display: block; height: var(--fh); text-align: center; font-style: normal; }
.flip > .b i, .flip > .fb i { transform: translateY(-50%); }
.flip > .ft, .flip > .fb { backface-visibility: hidden; z-index: 2; }
.flip > .fb { transform: rotateX(90deg); }
.flip.go > .ft { animation: ft .26s cubic-bezier(.55,0,.9,.4) forwards; }
.flip.go > .fb { animation: fb .3s .26s cubic-bezier(.16,1,.3,1) forwards; }
@keyframes ft { to { transform: rotateX(-90deg); filter: brightness(.6); } }
@keyframes fb { from { filter: brightness(1.4); } to { transform: rotateX(0); } }
```

**Set the text in the right order, then restart the animation.**

```js
function setFlip(f, v) {
  if (f.v === v) return;
  const [t, b, ft, fb] = f.querySelectorAll('i'), old = f.v; f.v = v;
  t.textContent = v; fb.textContent = v;   // revealed behind, and landing
  ft.textContent = old; b.textContent = old; // falling, and still showing below
  f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
  clearTimeout(f.tm);
  f.tm = setTimeout(() => { b.textContent = ft.textContent = v; f.classList.remove('go'); }, 600);
}
```

**Tick on the second boundary.** `setInterval(fn, 1000)` drifts and can skip a visible second; reschedule each time:

```js
(function tick() { render(true); setTimeout(tick, 1000 - (Date.now() % 1000) + 5); })();
```

Common mistakes:

- Hard-coding "48 days". The card must count to a date and still be right next week.
- Flipping every tile every second. It looks like a slot machine and hides which unit changed.
- Using `Date.parse('2026-11-21 19:30')` with no offset. Visitors in other zones get a different countdown.
- Announcing the countdown every second in a live region.
- A calendar link that opens a third-party site. Generate the `.ics` locally.
- Letting the tier "cards" be divs with click handlers. Use radios so arrow keys work.
- Putting the price inside the CTA as the only price. The tier cards show unit prices; the CTA shows the total.

Rebuild order:

1. Page, card grid, poster panel with sun SVG and stacked title.
2. Perforation and notches.
3. Stub header and the four-unit flip clock with instant first render.
4. Flip animation and the wall-clock tick.
5. Venue block and the calendar menu with keyboard support and the Blob `.ics`.
6. Tier radios, stepper, live CTA label, hold state, meter.
7. Live region, reduced motion, the 860 and 480 breakpoints.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
