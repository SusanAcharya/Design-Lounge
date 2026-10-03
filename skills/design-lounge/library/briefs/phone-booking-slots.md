<!-- Design Lounge Nº 169 · "Booking time slots" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Booking time slots

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The "Pick a time" screen of Willowmere Studio, a massage and bodywork studio on Canal Street. A service card names the treatment and the price. Under it, a 14-day date strip scrolls sideways, with fully booked days drawn dashed and struck through. Times are grouped Morning, Afternoon and Evening as chips, with taken times dashed and struck through too. A row of therapist avatars, with "Any" first, sits under the times. Once a time is chosen, a bar slides up from the bottom: "Thu 8 Oct, 14:30 · Confirm" with the price on the right. The feel is calm and soft: cream paper, sage, a deep green for anything chosen. The detail to copy: unavailable things stay in place, dashed and struck, so the grid never reflows when availability changes.

The language is iOS-ish: 16px radii, a sheet spring for the bar, no glass. Headings are a soft serif (Fraunces with SOFT 100). Body is a humanist sans (Source Sans 3).

## Reference behaviour

1. First frame: Thursday 8 October is the chosen day and 14:30 the chosen time. The bar is up and reads "Thu 8 Oct, 14:30 · Confirm" and "€78". The line above the button reads "Any therapist · 60 min" and "Pay at the studio".
2. The date strip runs from Saturday 3 October ("Today") to Friday 16 October. On load it scrolls so the chosen day sits in the middle. Sunday 4, Wednesday 7, Sunday 11 and Tuesday 13 are fully booked: transparent, dashed border, date struck through, disabled.
3. The "Time" heading names the chosen day in serif on the right: "Thursday 8".
4. Each time group shows its name and a count: "Morning 3 open". If no time in a group is free, the count reads "full" and a sage note replaces the chips: "No morning times with any therapist on this day."
5. Tap a free day: it fills deep green. The time grid redraws for that day. If the chosen time is still free on the new day, it stays chosen and the bar updates its date. If not, the time clears and the bar slides down.
6. Tap a free time chip: it fills deep green, any other chip clears, and the bar slides up (if down) and updates its label.
7. Taken chips and booked days do nothing.
8. Tap a therapist: a 2px deep green ring appears around the avatar with a 2px cream gap, and the name turns bold. Availability redraws for that person. The service card subtitle becomes "60 min · with Ada". Ada is senior, so the price becomes €88 on the card and in the bar.
9. Tap Confirm: the button turns a lighter green and shows a 20px SVG tick and "Booked · Thu 8 Oct, 14:30". A polite live region announces "Booked for Thursday 8 October at 14:30". Changing the day, time or therapist after that resets the button to Confirm.
10. Timezone note under the therapists: "Times are Berlin time, CEST (UTC+2). Free to move up to 24 hours before."
11. The back button is present and does nothing in the demo.

## Structure

```
390 × 844, page #F4EFE4, page scrolls
┌──────────────────────────────────────┐
│ 54 clearance                         │
│ (<) Willowmere Studio · Canal Street │  44 back, 14px label
│ Pick a time                          │  30px serif
│ ┌──────────────────────────────────┐ │
│ │ [leaf] Deep tissue massage   €78 │ │  service card, r16
│ │ 48px   60 min · any therapist    │ │
│ └──────────────────────────────────┘ │
│ DATE                   October 2026  │
│  [Tue][Wed][Thu][Fri][Sat][Sun]…     │  56 × 72 days, gap 8, scrolls
│ TIME                     Thursday 8  │
│ Morning 3 open                       │
│ [09:00][09:45][10:30][11:15]         │  4 columns, gap 8, 46 tall
│ Afternoon 5 open                     │
│ [12:00][12:45][13:30][14:30]         │
│ [15:15][16:00]                       │
│ Evening 4 open                       │
│ [17:00][17:45][18:30][19:15]         │
│ THERAPIST                            │
│ (Any) (MO) (JR) (AL) (TK)            │  52 avatars
│ ──────────────────────────────────── │
│ (globe) Times are Berlin time …      │
├──────── fixed bar, 1px top rule ─────┤
│ Any therapist · 60 min  Pay at the … │  14px
│ [ Thu 8 Oct, 14:30 · Confirm    €78 ]│  56 tall, r16
│ 34 clearance                         │
└──────────────────────────────────────┘
```

- The top row is a `div` with the back `button` and a `p`. The heading is the only `h1`.
- The service card is a `section aria-label="Service"` with an `h2`, a subtitle `small` and the price.
- Section labels ("Date", "Time", "Therapist") are `h3` elements: 13px caps on the left, a serif value on the right.
- The date strip is a `div role="group"` labelled by its `h3`, holding 14 `button`s with `aria-pressed`. It bleeds to the screen edges (`margin: 0 -20px; padding: 0 20px`) and scrolls on x with snap.
- Each time group is a `div role="group" aria-label="Morning"` with an `h4` and a 4-column grid of `button`s with `aria-pressed`.
- The therapist row is a `div role="radiogroup"` of `button role="radio"` with `aria-checked` and a roving `tabindex`.
- The bar is a fixed `div` at the bottom, made `inert` while hidden.
- The page ends with a `::after` spacer of 156px plus the bottom clearance, so the last rows can scroll clear of the bar.

## Tokens

```css
:root {
  --bg: #f4efe4;          /* cream page and bar */
  --surface: #fbf8f1;     /* card, days, chips */
  --sage: #b7c4ab;        /* hover border, weekday on chosen day, Any ring */
  --sage-soft: #e1e7d8;   /* leaf tile, "full" note, Maren's avatar */
  --green: #23402f;       /* chosen day, chosen time, Confirm, focus */
  --green-2: #36573f;     /* Booked */
  --on-green: #f4efe4;
  --ink: #1f2a22;
  --ink-2: #4b574e;
  --ink-3: #6c766f;
  --line: #e0d9c9;        /* borders and the bar's top rule */
  --av-clay: #ecdcc8; --av-mist: #dbe3e3; --av-sand: #e8e0cf;

  --serif: "Fraunces", Georgia, serif;          /* font-variation-settings "SOFT" 100, "WONK" 0 */
  --sans: "Source Sans 3", system-ui, sans-serif;

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px; --space-6: 24px;
  --r: 16px;              /* card, days, Confirm */
  --r-chip: 14px;         /* time chips */
  --r-tile: 14px;         /* leaf tile */

  --std: cubic-bezier(.2, .7, .2, 1);
  --ios: cubic-bezier(.32, .72, 0, 1);
  --micro: 160ms;
  --layout: 320ms;
}
```

## Typography

| Role | Family | Size | Weight | Notes |
| --- | --- | --- | --- | --- |
| Heading | Fraunces SOFT 100 | 30px | 560 | line-height 1.1, -0.01em |
| Service name | Fraunces SOFT 100 | 18px | 560 | line-height 1.2 |
| Price | Fraunces SOFT 100 | 20px | 600 | `--green`, tabular |
| Section label | Source Sans 3 | 13px | 700 | caps, 0.08em, `--ink-2` |
| Section value | Fraunces SOFT 100 | 16px | 560 | `--ink` |
| Day weekday | Source Sans 3 | 12px | 600 | `--ink-3` |
| Day date | Fraunces SOFT 100 | 22px | 560 | tabular |
| Group name | Source Sans 3 | 14px | 600 | count 400 `--ink-3` |
| Time chip | Source Sans 3 | 16px | 600 | tabular; taken 400 struck |
| Avatar initials | Fraunces SOFT 100 | 18px | 560 | `--green` |
| Avatar name | Source Sans 3 | 13px | 400 | chosen 700 `--ink` |
| Body, notes | Source Sans 3 | 14–16px | 400 | line-height 1.45 |
| Confirm | Source Sans 3 | 17px | 700 | price in Fraunces 19px 600 |

Load Fraunces with its SOFT axis: `family=Fraunces:opsz,wght,SOFT@9..144,500..600,100`. Without SOFT 100 the serif is sharp and the piece loses its tone.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Bottom bar | time chosen / cleared | translateY | 105% ↔ 0 | 320ms | `--ios` |
| Day | tap | background, colour | surface → green | 160ms | `--std` |
| Day | press | scale | 1 → 0.95 | 160ms | `--std` |
| Time chip | tap | background, colour, border | surface → green | 160ms | `--std` |
| Time chip | press | scale | 1 → 0.95 | 160ms | `--std` |
| Avatar ring | tap | box-shadow | none → 2px cream + 2px green | 160ms | `--std` |
| Confirm | press | scale | 1 → 0.98 | 160ms | `--std` |
| Confirm | booked | background | `--green` → `--green-2` | 160ms | `--std` |

Nothing loops. Reduced motion: every transition drops to 1ms. The bar appears and disappears in place.

## States

- Day free: surface, 1px `--line` border.
- Day chosen: `--green` fill, cream date, weekday in `--sage`, `aria-pressed="true"`.
- Day booked: transparent, dashed border, date struck at 1.5px and 70% opacity, `disabled`, `cursor: not-allowed`.
- Today: the weekday reads "Today". No extra colour.
- Chip free: surface, 1px `--line`. Hover: border `--sage`.
- Chip chosen: `--green` fill, cream text.
- Chip taken: transparent, dashed border, weight 400, struck, `disabled`.
- Group empty: the count reads "full" and one sage note spans the grid.
- Therapist chosen: ring and bold name, `aria-checked="true"`.
- Bar hidden: `translateY(105%)` and `inert`. Bar shown: no transform.
- Booked: lighter green, tick icon, "Booked · Thu 8 Oct, 14:30".
- Focus-visible: 2px `--green` outline, offset 2px. The strip has 6px of padding top and bottom so the ring is not clipped.
- Loading and error are not drawn. A slow fetch keeps the old chips and dims the grid to 50%. A failed fetch replaces the grid with a sage note and a "Try again" chip.

## Accessibility

- Each day button has a full label: "Wednesday 7 October, fully booked", "Saturday 3 October, today".
- Each chip label is its time. Taken chips add ", taken". Disabled chips are skipped by Tab.
- Chosen day and chosen time use `aria-pressed`. The therapist row is a radiogroup: Arrow keys move the choice and the focus, and only the chosen radio has `tabindex="0"`.
- After choosing a day or time, focus stays on the button you pressed even though the grid redraws.
- A polite live region announces "Thu 8 Oct, 14:30 selected", day changes, and "Booked for Thursday 8 October at 14:30".
- The bar is `inert` while hidden, so its button cannot be focused off screen.
- Hit targets: back 44, days 56 × 72, chips 46 tall and about 80 wide, avatars 52 plus label, Confirm 56.
- Contrast: `#1f2a22` on `#fbf8f1` is about 14:1. `#6c766f` on `#f4efe4` is about 4.6:1. Cream on `#23402f` is about 10:1.
- "Taken" is not shown by colour alone. It has the dashed border and the strike.

## Responsive rules

- The frame is 390×844. The page starts at max(54px, safe-area top). The bar keeps max(34px, safe-area bottom) under the button.
- At 360 the chip grid stays 4 columns (about 74px each). The service name may wrap to two lines. The date strip shows about five days.
- The avatar row uses `flex: 1` per item, so five fit at 360. If a studio has more than five, make the row scroll like the date strip. Do not shrink avatars below 48px.
- The bar label is short on purpose. If a locale makes it longer than the button, drop the weekday before dropping the time.
- At tablet width, put the date strip and time grid in a 560px column and keep the bar inside that column.
- The page never scrolls on x. Only the date strip does.

## Acceptance checklist

### Always

- [ ] The first frame has a day and a time chosen and the bar up.
- [ ] The date strip shows 14 days, scrolls on x with snap, and starts with the chosen day in view.
- [ ] Unavailable days and times stay in place, dashed and struck, and are disabled.
- [ ] Times are grouped Morning, Afternoon, Evening with an open count.
- [ ] A group with nothing free shows one note, not a row of struck chips.
- [ ] Changing day or therapist keeps the chosen time if it is still free, and clears it if not.
- [ ] The bar slides up only when a time is chosen, and is inert when hidden.
- [ ] The therapist row is a radiogroup with arrow keys and an "Any" option first.
- [ ] Hit targets at least 44px. Focus rings are visible and not clipped.
- [ ] No status bar is drawn. 54px top and 34px bottom clearance.

### This demo

- [ ] Studio "Willowmere Studio · Canal Street", service "Deep tissue massage", 60 min, €78.
- [ ] Days Sat 3 to Fri 16 October 2026. Booked: 4, 7, 11, 13.
- [ ] Bar reads "Thu 8 Oct, 14:30 · Confirm" and "€78" on load.
- [ ] Therapists: Any, Maren (MO), Jonah (JR), Ada (AL, €88), Teo (TK).
- [ ] Chosen fill `#23402f`, page `#f4efe4`, radii 16px and 14px.
- [ ] Headings in Fraunces SOFT 100, body in Source Sans 3.

## Implementation notes

**1. Keep one source of truth and redraw from it.** State is `day`, `time` and `who`. Every tap changes one of them, then `sync()` decides what survives.

```js
function sync() {
  const d = DAYS[day], s = STAFF[who];
  if (time && !isFree(day, time, who)) time = null;
  svcSub.textContent = `60 min · ${who ? 'with ' + s.name : 'any therapist'}`;
  svcPrice.textContent = goPrice.textContent = '€' + s.price;
  barWho.textContent = `${s.label} · 60 min`;
  if (time) goLabel.textContent = `${WD[d.w]} ${d.d} Oct, ${time} · Confirm`;
  bar.classList.toggle('on', !!time);
  bar.inert = !time;
  go.classList.remove('done');
}
```

Redraw the chips after `sync()`, then put focus back on the button the user pressed. Redrawing drops focus otherwise.

**2. Draw "unavailable" so the grid never moves.**

```css
.slot { height: 46px; border-radius: 14px; border: 1px solid var(--line); background: var(--surface); }
.slot[aria-pressed="true"] { background: var(--green); border-color: var(--green); color: var(--on-green); }
.slot:disabled { background: transparent; border-style: dashed; color: var(--ink-3);
  font-weight: 400; text-decoration: line-through; cursor: not-allowed; }
.day:disabled { background: transparent; border-style: dashed; }
.day:disabled b { text-decoration: line-through; text-decoration-thickness: 1.5px; opacity: .7; }
```

Do not hide taken times. A grid that reflows makes people tap the wrong chip.

**3. The bleeding strip and its focus room.** The strip runs edge to edge but its first day lines up with the page margin. The vertical padding is there so focus rings are not cut by `overflow-x: auto`.

```css
.strip { display: flex; gap: 8px; margin: -6px -20px; padding: 6px 20px;
  overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding: 0 20px; scrollbar-width: none;
  mask-image: linear-gradient(90deg, transparent, #000 16px, #000 calc(100% - 28px), transparent); }
.day { flex: none; width: 56px; height: 72px; border-radius: 16px; scroll-snap-align: start; }
```

```js
const sel = strip.querySelector('[aria-pressed="true"]');
strip.scrollLeft = sel.offsetLeft - strip.clientWidth / 2 + sel.offsetWidth / 2;
```

Give the strip `position: relative` so `offsetLeft` is measured from it.

Common mistakes:

- Putting the bottom padding on a `body` with `height: 100%`. Overflowing content ignores it and the last rows hide under the bar. Use a spacer after the content.
- Removing taken chips from the grid.
- Greying out booked days with colour only.
- Showing the bar with "Confirm" before a time is chosen.
- A purple or bright accent. The only strong colour is the deep green.
- Sharp serif headings. Turn SOFT to 100.
- Clearing the chosen time on every day change, even when it is still free.

Rebuild order:

1. Page, top row, heading, service card.
2. Date strip with booked days and centred scroll.
3. Time groups from data, with counts and the empty note.
4. Therapist radiogroup.
5. `sync()` and the bar.
6. Confirm and booked state, live region.
7. Reduced motion and focus checks at 360.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
