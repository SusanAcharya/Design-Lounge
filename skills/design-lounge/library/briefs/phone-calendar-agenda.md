<!-- Design Lounge Nº 165 · "Agenda calendar with quick add" · www.designlounge.live -->

# Agenda calendar with quick add

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The home screen of Ochre, a fictional personal calendar, in a Material 3 Expressive language. The top half is a month grid on a tonal card. Each day shows up to three coloured dots for its events. Drag the card up, tap the grab handle, or tap the month title, and the grid folds into a single week strip. The bottom half is an agenda list grouped by day, with day headers that stick to the top while you scroll, events with a colour bar, and a terracotta Now line between today's events. A large rounded FAB opens a quick-add sheet. You type "Lunch with Asha Fri 1pm" and it turns into chips: title, date, time, guest. The detail worth copying is the parser preview. The user sees what the app understood before they save.

## Structure

```
390 × 844 frame, padding-top 54px
┌──────────────────────────────────────┐
│ October 2026 ^        [Today] [AK]   │ 56px top bar
├──────────────────────────────────────┤
│ ┌──────── tonal card, r 28 ────────┐ │ margin 0 12px
│ │ M  T  W  T  F  S  S              │ │ 20px weekday row
│ │ 28 29 30  1  2 (3) 4             │ │ 5 rows × 44px
│ │  5  6  7  8  9 10 11   · dots    │ │ (folds to 1 row)
│ │ …                                │ │
│ │            ───                   │ │ 44px grab handle
│ └──────────────────────────────────┘ │
├──────────────────────────────────────┤
│ (3) Saturday                         │ sticky day header, 62px
│     Today · 4 events                 │
│ ┃ 09:00  Saturday market run         │ event card, r 20
│ ┃ 10:00  pin Jhamsikhel stalls  2 people    │
│ ● ─────────────────────────── 14:10  │ Now line
│ ┃ 16:00  Pottery wheel class         │
│ …                         ┌────────┐ │
│                           │ + New  │ │ FAB 64px, r 22
│                           └────────┘ │ bottom 34 + 12px
└──────────────────────────────────────┘
```

- Top bar: a `header`. The month title is a `button` with `aria-expanded` and `aria-controls="cal"`. Today is a button. The avatar is a `span role="img"` with the user's name as its label.
- Calendar card: a `section` labelled "October 2026". The weekday row is `aria-hidden`. Each date is a `button` with `aria-pressed` for selection and `aria-current="date"` for today. Days from the previous and next month are `aria-hidden` spans.
- The grid sits in a viewport with `overflow: hidden`. Folding changes the viewport height and moves the inner week stack up with `translateY`.
- Grab handle: a full-width `button`, 44px tall, labelled "Collapse to week" or "Expand to month".
- Agenda: a `main` that is the only scroll container. Each day is a `section` with an `h2` header. Events are `li` items in a `ul`. The Now line is an `li` with `aria-label="Now, 14:10"`.
- FAB: a `button` with `aria-haspopup="dialog"`. Fixed, right 16px, bottom 34px + 12px.
- Quick add: a native `dialog` opened with `showModal()`. A `form` holds a labelled `input`, a polite live region for the chips, a suggestion group, and the two actions.
- Snackbar: a `div role="status"`, fixed above the FAB.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Grid fold | title, handle, drag 30px | viewport height | 220px → 44px | 420ms | `--emph` | 1ms |
| Week stack | fold, or date change while folded | translateY | 0 → row × -44px | 420ms | `--emph` | 1ms |
| Chevron | fold | rotate | 0 → 180° | 400ms | `--emph` | 1ms |
| Selected date | tap | background, radius | none → `--pc`, 18px → 12px | 200ms / 300ms | `--emph` | 1ms |
| Agenda jump | date tap, Today, save | scrollTop | current → group top | browser smooth | browser | instant |
| Sheet in | FAB | translateY | 100% → 0 | 450ms | `--emph-dec` | 1ms |
| Scrim in | FAB | opacity | 0 → 1 | 300ms | `--emph` | 1ms |
| Sheet out | Cancel, Esc, scrim, save | translateY | 0 → 100% | 200ms | `--emph-acc` | close at once |
| Chips | every keystroke | scale, opacity | 0.85, 0 → 1, 1 | 300ms | `--emph-dec` | 1ms |
| FAB hover | pointer | border-radius | 22px → 32px | 250ms | `--emph` | 1ms |
| FAB press | pointer | scale | 1 → 0.96 | 200ms | `--emph` | 1ms |
| New event | save | background | `--pc` → `--s1` | 600ms after a 2.4s hold | `--emph` | 1ms |
| Snackbar | save | translateY, opacity | 16px, 0 → 0, 1 | 300ms / 200ms | `--emph` | 1ms |

Nothing loops. The screen is still when nobody touches it.

## States

- Date resting: no fill, 15px weight 500.
- Date selected: 34px shape filled `--pc`, radius 12px, text `--on-pc` weight 700.
- Date today: 34px circle filled `--primary`, text white. Today and selected together: same fill, radius 12px.
- Out-of-month date: `--outline` at 60% opacity, not focusable.
- Dots: 5px circles, 3px gap, 0px from the cell bottom. One dot per category present that day, max three.
- Day header for today: number tile is a 44px circle in `--primary`. Other days: a 44px tile, radius 16px, `--s3`.
- Grab handle: 36 × 4px pill at 55% opacity. Hover widens it to 48px.
- FAB: rest radius 22px. Hover radius 32px. Pressed scale 0.96.
- Save disabled: `--s4` fill, `--outline` text, label "Add".
- Field focus: 2px inset ring in `--primary`. No floating label. The label sits above.
- Focus-visible on everything else: 3px `--primary` outline, 2px offset.
- Empty agenda day: not drawn. The agenda lists only days with events. A date tap on an empty day scrolls to the next day that has events.

## Accessibility

- The month title button and the grab handle both report `aria-expanded`. Their labels say what the next tap does: "collapse to week" or "expand to month".
- Each date button has a full label: "Saturday 3 October, 4 events". Today also has `aria-current="date"`. Selection uses `aria-pressed`.
- Event people counts read "8 people" through a visually hidden span. The icon is `aria-hidden`.
- The agenda `main` is labelled "Agenda". Day headers are `h2`, so screen reader users can jump day to day.
- The sheet is a real modal `dialog`. It traps focus, Escape closes it, and focus returns to the FAB.
- The chip row is `aria-live="polite"` so the parsed result is read after typing stops.
- The snackbar is `role="status"`.
- Hit targets: dates 44px tall and a seventh of the card wide, handle 44px, Today 44px, FAB 64px, suggestions 44px, sheet actions 52px.
- Contrast: `--ink2` `#55433d` on `--s1` `#fcf0eb` is above 8:1. White on `--primary` `#9a4524` is above 6:1. The dots are decoration. The count is also in the label and the header.

## Responsive rules

- At 390 × 844 the month card is 292px tall and the agenda gets about 430px.
- At 360 wide the month title shrinks through the clamp to about 27px. Today and the avatar are `flex: none` so they never clip. Event titles ellipsis. The page never scrolls sideways.
- At heights under 700px, start folded, so the agenda keeps at least 400px.
- At tablet width do not stretch this. Put the month grid in a 360px left pane and the agenda on the right, both always open, and drop the fold.
- Do not draw a status bar. The top padding is max(54px, env(safe-area-inset-top)). The FAB sits 12px above the 34px home clearance.

## Acceptance checklist

### Always

- [ ] The month grid folds to a single 44px week row and unfolds again, from the title, the handle, and a 30px vertical drag.
- [ ] When folded, the visible row is the row holding the selected date.
- [ ] Each date shows at most three category dots.
- [ ] The agenda is the only scroll container, and day headers stick to its top.
- [ ] The Now line sits between the last past event and the first future event of today.
- [ ] Tapping a date scrolls the agenda; scrolling the agenda moves the selection.
- [ ] The FAB opens a modal sheet. Escape, Cancel, and the scrim close it, and focus returns to the FAB.
- [ ] The quick-add preview updates on every keystroke and shows title, date, time, and any guest or place as separate chips.
- [ ] The save button names the parsed date and is disabled when the field is empty.
- [ ] Every target is at least 44px. Focus is visible on every control.

### This demo

- [ ] The month is October 2026, Monday first. Today is Saturday 3, filled `#9a4524`.
- [ ] The first group is "Saturday · Today · 4 events" and the Now line reads 14:10.
- [ ] The FAB is 64px tall, radius 22px, filled `#ffdbcf`, label "New".
- [ ] "Lunch with Asha Fri 1pm" parses to "Lunch with Asha", "Fri 9 Oct", "13:00 – 14:00", "Asha".
- [ ] "Climbing Thu 6pm at Hattiban Wall" lands on Thursday 8 October with place Hattiban Wall.
- [ ] After save, the snackbar reads "Added <title> to <date>" for 3.2s.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: October 2026, month view open. Today is Saturday 3 October and is selected. The agenda is scrolled so the Saturday header sits at the top of the list.
2. The Saturday group shows four events. The Now line reads 14:10 and sits between the 12:30 brunch and the 16:00 pottery class.
3. Tap any date in the grid. That date becomes selected (tonal container shape), and the agenda smooth-scrolls so the first group on or after that date sits at the top. Dates with no events scroll to the next date that has events.
4. Scroll the agenda by hand. When a new day header reaches the top, the grid selection follows it. Programmatic scrolls lock this for 700ms so the selection does not flicker through the days in between.
5. Tap the month title, tap the grab handle, or drag the calendar card up more than 30px. The grid folds to one 44px row, the row that holds the selected date. The chevron turns 180°. Drag down more than 30px, or tap again, to unfold.
6. While folded, selecting a date in another week slides the strip to that week.
7. Tap Today. The agenda scrolls back to Saturday 3 and Saturday is selected again.
8. Tap the FAB ("New"). A modal sheet slides up from the bottom over a 36% scrim. The field is focused and holds "Lunch with Asha Fri 1pm". Under it four chips read: "Lunch with Asha", "Fri 9 Oct", "13:00 – 14:00", "Asha". The save button reads "Add to Fri 9 Oct".
9. Edit the field. The chips rebuild on every keystroke. Empty field: no chips, save is disabled and reads "Add".
10. Tap a suggestion ("Standup tomorrow 9am", "Dentist Tue 4:30pm", "Climbing Thu 6pm at Hattiban Wall"). It fills the field and the preview updates.
11. Tap save. The sheet closes, the event joins the right day, the grid dots update, the agenda scrolls to that day, and the new event card is tinted primary container for 2.4s. A snackbar reads "Added Climbing to Thu 8 Oct" for 3.2s.
12. Cancel, Escape, or a tap on the scrim closes the sheet. Focus returns to the FAB.

## Tokens

```css
:root {
  /* tonal scheme from seed #B4532F (terracotta) */
  --primary: #9a4524;          /* today, Now line, save button, focus */
  --on-primary: #ffffff;
  --pc: #ffdbcf;               /* primary container: FAB, selected day, new event */
  --on-pc: #3a0b00;
  --sc: #f5ded5;               /* secondary container: suggestions, avatar */
  --on-sc: #2c160e;
  --surface: #fff8f5;          /* page */
  --s1: #fcf0eb;               /* event cards, sheet */
  --s2: #f7e8e1;               /* calendar card */
  --s3: #f1e1d9;               /* day number tile */
  --s4: #ead9d0;               /* text field */
  --ink: #231915;
  --ink2: #55433d;             /* secondary text */
  --outline: #86736c;
  --ov: #dac2b9;               /* outline variant: chip borders */
  --inverse: #392e2a;          /* snackbar */
  --on-inverse: #ffede7;

  /* event categories */
  --work: #b4532f;
  --social: #2e6b5f;
  --health: #8f6c00;

  --font: "Roboto Flex", system-ui, sans-serif;

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px; --space-6: 24px;
  --r-chip: 12px; --r-field: 20px; --r-event: 20px; --r-fab: 22px; --r-card: 28px; --r-sheet: 28px;

  --fab-shadow: 0 3px 8px rgba(58, 11, 0, .18), 0 1px 2px rgba(58, 11, 0, .12);
  --scrim: rgba(35, 25, 21, .36);

  --emph: cubic-bezier(.2, 0, 0, 1);         /* emphasized */
  --emph-dec: cubic-bezier(.05, .7, .1, 1);  /* emphasized decelerate, enter */
  --emph-acc: cubic-bezier(.3, 0, .8, .15);  /* emphasized accelerate, exit */
  --dur-fold: 420ms;
  --dur-sheet-in: 450ms;
  --dur-sheet-out: 200ms;
}
```

## Typography

One variable family, Roboto Flex, at two optical sizes. The month title uses the wide axis and the big optical size. Everything else is text size.

| Role | Size | Weight | Axes | Colour |
| --- | --- | --- | --- | --- |
| Month name | clamp(26px, 7.6vw, 32px) | 760 | wdth 112, opsz 72, tracking -0.02em | `--ink` |
| Year | same as month | 400 | wdth 100, opsz 72 | `--ink2` |
| Weekday initials | 12px | 650 | default | `--ink2` |
| Date number | 15px | 500, 700 when selected or today | default | `--ink` |
| Day header number | 20px | 720 | wdth 110 | `--ink` or `--on-primary` |
| Day header weekday | 16px | 680 | default | `--ink` |
| Day header sub line | 12.5px | 500 | default | `--ink2` |
| Event time start | 14px | 700 | tabular numbers | `--ink` |
| Event time end | 12.5px | 400 | tabular numbers | `--ink2` |
| Event title | 16px | 620 | default, one line, ellipsis | `--ink` |
| Event meta | 13px | 400 | default | `--ink2` |
| Now label | 12px | 750 | default | `--primary` |
| FAB label | 17px | 700 | default | `--on-pc` |
| Sheet title | 24px | 720 | wdth 108 | `--ink` |
| Field text | 19px | 500 | default | `--ink` |
| Chip | 14px | 600 | default | `--ink` |

Load the font with the `opsz,wdth,wght` axes: `opsz 8..144`, `wdth 25..151`, `wght 400..800`.

## Implementation notes

**The fold.** Animate the viewport height and the inner stack together. Do not hide rows with `display: none`, because that cannot animate and the strip jumps.

```css
.vp { height: calc(var(--rows) * 44px); overflow: hidden; transition: height .42s var(--emph); }
.weeks { transition: transform .42s var(--emph); }
.cal.col .vp { height: 44px; }
.cal.col .weeks { transform: translateY(calc(var(--row) * -44px)); }
```

Set `--row` from JS whenever the selection changes: `Math.floor((offset + day - 1) / 7)`, where `offset` is the Monday-first index of the 1st (3 for October 2026).

**The parser.** Pull tokens out in a fixed order: time, then day, then place, then guests. Whatever is left is the title. Match whole words only, or "Sunrise hike" becomes a Sunday.

```js
function parse(v) {
  let r = ' ' + v + ' ', d = TODAY, s = '', e = '', place = '', who = '';
  const tm = r.match(/\s(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)(?=\s)/i);
  if (tm) {
    let h = +tm[1] % 12; if (/pm/i.test(tm[3])) h += 12;
    const m = tm[2] || '00'; s = pad(h) + ':' + m; e = pad((h + 1) % 24) + ':' + m;
    r = r.replace(tm[0], ' ');
  }
  const dm = r.match(/\s(today|tomorrow|(sun|mon|tue|wed|thu|fri|sat)(?:s|r|rs)?(?:day|sday|nesday|rsday|urday)?)(?=\s)/i);
  if (dm) { d = dm[1].toLowerCase() === 'tomorrow' ? TODAY + 1 : dm[2] ? TODAY + (DN.indexOf(dm[2].toLowerCase()) - 6 + 7) % 7 : TODAY; r = r.replace(dm[0], ' '); }
  const pm = r.match(/\sat\s+(.+?)\s*$/i); if (pm) { place = pm[1]; r = r.replace(pm[0], ' '); }
  const wm = r.match(/\swith\s+([A-Z][a-z]+(?:\s+(?:and|&)\s+[A-Z][a-z]+)?)/); if (wm) who = wm[1];
  const t = r.replace(/\s+/g, ' ').trim();
  return { t: t.charAt(0).toUpperCase() + t.slice(1), d, s, e, place, who };
}
```

`6` is today's `getDay()` (Saturday). Use a real date library in production. Keep the guest inside the title. "Lunch with Asha" reads better than "Lunch".

**Scroll sync without a feedback loop.** A date tap starts a smooth scroll. The scroll handler would then select every day it passes. Stamp the time of each programmatic scroll and skip the spy for 700ms.

```js
function go(d) { mark(d); lock = Date.now(); agenda.scrollTo({ top: group(d).offsetTop, behavior: 'smooth' }); }
agenda.addEventListener('scroll', () => requestAnimationFrame(() => {
  if (Date.now() - lock < 700) return;
  let cur; for (const g of groups()) if (g.offsetTop <= agenda.scrollTop + 8) cur = g;
  if (cur) mark(+cur.dataset.d);
}));
```

Give the agenda `position: relative` so `offsetTop` is measured from it. Add a 360px spacer after the last group so late days can still reach the top.

Common mistakes:

- Sticky day headers with `z-index` above the FAB. Give the FAB `z-index: 3` and the snackbar 4.
- Drawing the dots inside the number circle. They sit under it, at the cell bottom.
- Using a floating label in the sheet. The label sits above the field so the value never moves.
- A second "Today" ring around the selected day. Today is a fill. Selection is a tonal shape.
- Closing the sheet with `dialog.close()` straight away. Play the 200ms exit first, then close.
- A purple seed. The scheme comes from terracotta `#B4532F`.

Rebuild order:

1. Build the static grid and the agenda from one events array.
2. Add selection, the Today button, and scroll-to-group.
3. Add the scroll spy with its lock.
4. Add the fold and the drag gesture.
5. Add the sheet, then the parser, then save.
6. Add the snackbar and the new-event tint.
7. Test at 360 × 780 and with reduced motion on.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
