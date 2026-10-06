<!-- Design Lounge Nº 179 · "Boxing gym home with timetable" · www.designlounge.live -->

# Boxing gym home with timetable

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The one-page home for a fictional boxing and strength gym, Graftworks, under a railway arch in Leeds. It is a fight poster first and a website second: black page, off-white type, one blood orange, ultra-condensed Anton display, JetBrains Mono for everything else, 0 radius, 2px borders. The hero headline "Hit harder. Lift heavy." runs at 190px with a −7° orange stripe crossing behind it carrying a slow ticker.

The page does the four jobs a gym site must do: show when classes are (a timetable with day tabs and two filters), show what it costs (three tiers with a monthly/annual toggle), show who coaches (four cards), and convert (a free-trial form plus a sticky "Book free class" button). The detail worth copying is the **timetable**: real tabs, two selects, a live count, a waitlist state, and an empty state, all from one data array.

## Structure

```
1280 × 800 (first frame)
┌─────────────────────────────────────────────────────────────────────────┐
│ ▰ GRAFTWORKS  TIMETABLE MEMBERSHIP COACHES FREE CLASS   Arch 9 · 06–22  │ 64, 2px rule
├─────────────────────────────────────────────────────────────────────────┤
│ EST. 2016   BOXING / STRENGTH / CONDITIONING        (12px mono, grey)   │
│ HIT                                               ┌───────────────────┐ │
│ HARDER.   (orange)          190px Anton            │ UNDER A RAILWAY…  │ │
│ ╲╲╲╲ orange stripe −7°, 96px tall, ticker ╲╲╲╲╲╲╲╲ │ 41 classes a week │ │
│ LIFT HEAVY.                                       │ body              │ │
│                                                   │ [BOOK FREE CLASS] │ │
│                                                   │ [ SEE TIMETABLE ] │ │
│                                                   └───────────────────┘ │
├─────────────────────────────────────────────────────────────────────────┤ 2px rule
│ TIMETABLE (88px)                       WEEK OF 5 OCTOBER · 60 MIN       │ light band
│ [MON][TUE][WED][THU][FRI][SAT][SUN]  2px black box, 48 tall             │
│ Level [▾]  Coach [▾]                                   5 classes        │
└─────────────────────────────────────────────────────────────────────────┘
below: membership (black) · coaches (light) · free trial (black) · footer
fixed: [BOOK FREE CLASS] bottom-right 24px, 56 tall, 6px white offset shadow
```

- `header.top`: sticky, 64px, black, 2px off-white bottom border. Logo is a 16×28px orange bar skewed −14° plus "GRAFTWORKS" in Anton 28px.
- Hero `section`: `min-height: 560px`, `overflow: hidden`, 2px bottom border. Inner grid `minmax(0,1fr) 300px`, 32px gap, items aligned to the bottom.
- The stripe is an `aria-hidden` absolute `div` behind the type (z-index 1, text z-index 2), `left/right: -10%`, `top: 58%`, rotated −7°.
- The side box is a black panel with a 2px off-white border, 20px padding, so it stays readable over the stripe.
- Timetable: `div role="tablist"` of seven `button role="tab"`, then a filter row, then `div role="tabpanel"` wrapping a `<table>`.
- Membership: `div role="group" aria-label="Billing"` with two `aria-pressed` buttons; three `<article class="tier">` in a 2px bordered 3-column grid. The middle tier is orange.
- Coaches: four `<article>` in a 2px bordered 4-column grid. Each has a 220px striped portrait block with initials, then text.
- Free trial: 2 columns. Left: 120px headline "First class is free." Right: `<form novalidate>` in a 2-column grid.
- Bands alternate black and `#f3f1ec` and are split by 2px off-white rules.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | ---: | --- | --- |
| Stripe ticker | load, loop | translateX | 0 → -50% | 38s | linear (ticker only) | static |
| Sticky button | hero or trial in view | translateY, opacity | 0 → 140%, 1 → 0 | 240ms | `--ease` | 1ms |
| Buttons | hover | background, colour | swap fill | 140ms | `--ease` | 1ms |
| Buttons | active | transform | 0 → translate(2px,2px) | 140ms | `--ease` | none |
| Sticky button | hover | box-shadow colour | white → orange | 140ms | `--ease` | 1ms |
| Day tab, toggle | click | fill | instant | 0 | — | — |

The ticker text is the phrase repeated three times plus a trailing space, so moving it −50% loops without a jump. It is the one place linear is right.

## States

- **Day tab:** 48px tall, 2px black dividers. Hover `#e4e0d8`. Selected: black fill, off-white text, `aria-selected="true"`, `tabindex="0"`. Others `tabindex="-1"`.
- **Select:** 44px, 2px black border, off-white fill, 200px min width, bold.
- **Level tag:** 1.5px black outline. Advanced: black fill, off-white text.
- **Spaces:** "4 of 14 spaces" in `--grey-2` with the coach name bold. Zero: orange "Waitlist", button "Join list".
- **Empty timetable:** one full-width row, bold, "No classes match. Clear a filter or pick another day."
- **Billing toggle:** 2px off-white box, two 44px buttons. Pressed: off-white fill, black text.
- **Tier, default:** black, 2px off-white dividers. **Tier, featured:** orange fill, black text, black button.
- **Primary button:** orange fill and border, black text. Hover: off-white fill.
- **Ghost button:** 2px off-white border. Hover: off-white fill, black text.
- **Input invalid:** border turns orange, message 12px orange under the field, `aria-invalid="true"`.
- **Success:** bold orange status line under the submit.
- **Focus-visible:** 3px orange outline, 3px offset, on everything.
- **Sticky hidden:** `.off` class, translated down 140%, opacity 0.

## Accessibility

- One `h1` (the hero lines in three spans). Each band has an `h2` and `aria-labelledby`.
- Tabs follow the ARIA tabs pattern: `role="tablist"` with a label "Day", `role="tab"` with `aria-selected` and `aria-controls`, roving `tabindex`, Left/Right arrows wrap around seven tabs. The table sits in `role="tabpanel"`.
- The class count is `aria-live="polite"`, so filter changes are announced.
- Filters are real `<select>` elements wrapped in `<label>`.
- The billing toggle is `role="group"` with two `aria-pressed` buttons. Prices are plain text so they read out after a change.
- The form uses `novalidate` and does its own checks so the messages match the brand. Each required input has `aria-describedby` pointing to its message. The status line is `role="status"`.
- The stripe and the hero meta line are `aria-hidden`; the ticker is decoration.
- Portraits are `aria-hidden` initials. Names are in `h3`.
- The sticky button is a link to `#trial`. When hidden it is `aria-hidden="true"` and `tabindex="-1"`.
- Contrast: off-white on black is about 17:1. Black on orange is about 6.7:1. `#a19d95` on black is about 7:1. `#6f6c66` on off-white is about 4.8:1. Orange text on black (prices on the toggle, "Waitlist" on light) is display weight or bold only.
- Hit targets: buttons 48px, tabs 48px, selects 44px, menu 44px, sticky 56px, checkbox 22px inside a full-width label.

## Responsive rules

- **≥1280:** as specified. Hero 190px. Section headings 88px. Tiers 3 across. Coaches 4 across. Trial 2 columns.
- **1024–1279 (below 1180px):** hero 150px. Section headings 72px. Trial headline 96px.
- **768–1023 (below 960px):** hide nav and address. Show the menu button. Hero 120px, side box drops under the headline. Tiers stack 1 column with 2px rules between. Coaches 2 × 2. Trial stacks.
- **<640:** side padding 20px. Hero `min-height` auto, 72px top padding, headline 84px. Stripe moves to `top: 30%`, 60px tall, ticker 28px. Hide "Est. 2016" in the meta line. Section headings 60px. Day tabs shrink to 11px with tight tracking; all seven stay on one row. Filters wrap, each 50% wide. Hide the level, coach and spaces columns; keep time, class and Book. Coaches 1 column, portraits 160px. Form 1 column. The sticky button spans the width with 20px side gaps, no offset shadow.
- Every grid uses `minmax(0, 1fr)`. The hero has `overflow: hidden` so the rotated stripe never causes horizontal scroll.

## Acceptance checklist

### Always

- [ ] Every corner is square. Borders are 2px. No soft shadows.
- [ ] One accent colour. Everything else is black, off-white, or grey.
- [ ] The hero headline is the largest thing on the page, set in a condensed display face.
- [ ] The timetable has seven real tabs with arrow-key support and two filters.
- [ ] The class count is a live region and handles singular and plural.
- [ ] Zero-space classes show a waitlist state; no match shows an empty-state row.
- [ ] The billing toggle uses `aria-pressed` and rewrites price and unit together.
- [ ] The trial form shows per-field errors, focuses the first one, and confirms in a status line.
- [ ] The sticky CTA hides over the hero and over the form, and is not focusable when hidden.
- [ ] Focus rings are 3px orange with 3px offset.
- [ ] Reduced motion stops the ticker and the button press.
- [ ] At 390px there is a menu button, and no horizontal scroll.

### This demo

- [ ] Brand "Graftworks", headline "Hit / harder. / Lift heavy." with "harder." in orange.
- [ ] Ticker: "No mirrors · No contracts · Gloves on the house · First class free".
- [ ] Side box: "41 classes a week", buttons "Book free class" and "See timetable".
- [ ] Monday shows 5 classes from 06:30 Conditioning to 19:30 Open Boxing.
- [ ] Tiers Day shift £39, Unlimited £69 (orange), Fight camp £119. Annual £390 / £690 / £1,190.
- [ ] Coaches Dee Achebe, Marcus Vale, Ines Roca, Rob Keane.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: hero visible. The orange stripe ticker scrolls left at a 38s loop. The sticky button is hidden because the hero is on screen.
2. Scroll past the hero: the sticky "Book free class" button slides up into the bottom-right corner (240ms). When the free-trial section enters the viewport it slides away again. Hidden means `aria-hidden="true"`, `tabindex="-1"` and `pointer-events: none`.
3. Timetable starts on Mon with all levels and all coaches: 5 classes. The count reads "5 classes".
4. Click a day tab (or press Left/Right while a tab is focused): that tab becomes selected (black fill, white text), focus moves with arrow keys, and the rows redraw for that day.
5. Change Level or Coach: rows filter at once. The count updates ("1 class" singular). With no match the table shows one row: "No classes match. Clear a filter or pick another day."
6. Each row: time, class name, level tag (Advanced is inverted), coach, spaces ("4 of 14 spaces") and a "Book" button. A class with 0 spaces shows orange "Waitlist" and the button reads "Join list".
7. Membership toggle: Monthly is pressed on load. Click Annual: prices become £390 / £690 / £1,190 and "/ month" becomes "/ year". The Annual button carries an orange "2 months free" note.
8. Free-trial form: submit empty and each missing field gets an orange border and a message under it. Focus moves to the first bad field. Fill first name, a valid email and tick the box: the status line reads "Booked, Sam. Boxing Fundamentals · Mon 18:30. Check your email for the door code."
9. Buttons press 2px down-right on `:active`.
10. At 960px and below the nav hides and a 44px square menu button opens a full-width black dropdown.

## Tokens

```css
:root {
  --black: #0c0c0c;     /* page, dark bands */
  --black-2: #161616;   /* portrait stripe dark */
  --white: #f3f1ec;     /* type on black, light bands */
  --grey: #a19d95;      /* labels on black */
  --grey-2: #6f6c66;    /* labels on light */
  --line: #2c2c2c;      /* hairline on black (menu rows) */
  --line-l: #d6d2ca;    /* hairline on light (table rows) */
  --orange: #ff4b1f;    /* the one accent */

  --display: "Anton", Impact, "Arial Narrow", sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;

  --fs-hero: 190px;
  --fs-h2: 88px;
  --fs-trial: 120px;
  --fs-price: 84px;
  --fs-tier: 44px;
  --fs-body: 14px;
  --fs-label: 12px;

  --pad: 48px;
  --band: 80px;
  --border: 2px;
  --radius: 0;

  --t: 140ms;
  --t-sticky: 240ms;
  --ticker: 38s;
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

Set `border-radius: 0` on `*`. The only "shadow" is the sticky button's hard `6px 6px 0` offset.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Hero headline | Anton | 190px | 400 | 0.88 | -0.005em | UPPERCASE |
| Section heading | Anton | 88px | 400 | 0.88 | 0.005em | UPPERCASE |
| Trial headline | Anton | 120px | 400 | 0.88 | 0.005em | UPPERCASE |
| Price | Anton | 84px | 400 | 0.85 | 0 | numerals |
| Big stat | Anton | 64px | 400 | 0.9 | 0 | sentence, orange |
| Tier / coach name | Anton | 44px / 34px | 400 | 0.88 | 0 | UPPERCASE |
| Timetable time | Anton | 30px | 400 | 1 | 0 | numerals |
| Class name | Anton | 26px | 400 | 1 | 0 | UPPERCASE |
| Ticker | Anton | 44px | 400 | 1 | 0.02em | UPPERCASE, black on orange |
| Body | JetBrains Mono | 14px | 400 | 1.55 | 0 | sentence |
| Labels | JetBrains Mono | 12px | 400 | 1.55 | 0.14em | UPPERCASE |
| Buttons | JetBrains Mono | 13px | 700 | 1 | 0.08em | UPPERCASE |
| Level tag | JetBrains Mono | 11px | 700 | 1 | 0.1em | UPPERCASE |

Never set body copy in Anton. Never set a heading in the mono.

## Implementation notes

**One data array drives the timetable.** Each class is `[time, name, level, coach, days[]]`. Filter, sort by time, render. Do not hard-code seven tables.

```js
function draw() {
  const list = CLASSES
    .filter(c => c.days.includes(day))
    .filter(c => !level.value || c.level === level.value)
    .filter(c => !coach.value || c.coach === coach.value)
    .sort((a, b) => a.time.localeCompare(b.time));
  rows.innerHTML = list.length
    ? list.map(rowHTML).join('')
    : '<tr><td colspan="6" class="empty">No classes match. Clear a filter or pick another day.</td></tr>';
  count.textContent = list.length + (list.length === 1 ? ' class' : ' classes');
}
```

**Roving tabindex on the day tabs.**

```js
function select(t) {
  tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; });
  day = +t.dataset.d; draw();
}
tabs.forEach((t, i) => t.addEventListener('keydown', e => {
  const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
  if (k) { const n = tabs[(i + k + 7) % 7]; select(n); n.focus(); }
}));
```

**Sticky CTA that knows when to leave.** Watch the hero and the trial section. Hide when either is visible:

```js
const seen = new Map();
new IntersectionObserver(es => {
  es.forEach(x => seen.set(x.target.id, x.isIntersecting));
  const off = seen.get('h') || seen.get('trial');
  sticky.classList.toggle('off', !!off);
  sticky.setAttribute('aria-hidden', !!off);
  off ? sticky.setAttribute('tabindex', '-1') : sticky.removeAttribute('tabindex');
}).observe(hero);
```

Observe `#trial` with the same observer. Start the button with `.off` in the HTML so the first frame has no duplicate CTA.

**Form field named "name".** `form.name` returns the form's own name attribute, not the input. Read fields through `form.elements.name`. This bug fails silently.

**The stripe.** Absolute, wider than the hero, rotated, behind the type:

```css
.hero { position: relative; overflow: hidden; }
.stripe { position: absolute; z-index: 1; left: -10%; right: -10%; top: 58%; height: 96px;
  background: var(--orange); transform: rotate(-7deg); display: flex; align-items: center; }
.stripe p { white-space: nowrap; animation: run 38s linear infinite; }
@keyframes run { to { transform: translateX(-50%); } }
```

**Coach portraits** are a `repeating-linear-gradient(-55deg, #0c0c0c 0 14px, #1f1f1f 14px 28px)` block, 110px Anton initials centred, and a 14px orange bar from the left edge at 60% width, 18px from the bottom.

Common mistakes:

- Rounded buttons or 8px cards. Radius is 0 everywhere.
- A second accent (yellow, red, neon green). There is only orange.
- Stock photos of athletes. Initials and stripes stand in.
- Gradient overlays or glow on the hero. Flat black and one flat stripe.
- A timetable that is a picture of a table. It must filter.
- A pill-shaped billing switch. It is two square buttons in a 2px box.
- The sticky button covering the form's submit button on mobile.
- Letting the rotated stripe widen the page at 390px.

Rebuild order:

1. Tokens, fonts, `* { border-radius: 0 }`, sticky header.
2. Hero headline, side box, stripe with ticker.
3. Timetable tabs, filters, data array, render, empty and waitlist states.
4. Tiers with the billing toggle.
5. Coach cards.
6. Trial form with validation and status.
7. Footer and sticky CTA with the observer.
8. Breakpoints at 1180, 960 and 640, then the menu toggle.
9. Reduced motion, focus pass, 390px overflow check.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
