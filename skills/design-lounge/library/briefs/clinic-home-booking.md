<!-- Design Lounge Nº 214 · "Dental clinic home with live booking" · www.designlounge.live -->

# Dental clinic home with live booking

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The one-page home for a fictional family dental practice, Larkfield Dental Studio, in Manchester. It must feel calm and trustworthy, not like a hospital. Pale aqua page, white cards, deep teal type, a rounded humanist sans, 12px radii. The hero answers the three questions a nervous patient has before they call: can I get in soon, how do I book, and who will I see. The detail worth copying is the **live next-slot card** in the hero: it shows "Today 16:30", four time chips, a treatment select and a "Hold this slot" button. Holding a slot strikes it out and moves "Next available" to the next free time.

Below the hero sit five bands: treatments with prices from, dentists with credentials, insurers next to opening hours (today highlighted), a location block with an SVG map, and a review summary. Then a one-line footer.

## Structure

```
1280 × 800 (first frame)
┌───────────────────────────────────────────────────────────────────────┐
│ [tooth] Larkfield Dental  Treatments Dentists Hours Find us Reviews   │ 68 sticky
│                                          (phone) 0161 496 0732 [Book] │
├───────────────────────────────────────────────────────────────────────┤
│ FAMILY AND NERVOUS-PATIENT DENTISTRY…        ┌─────────────────────┐  │
│ Unhurried                                    │ NEXT AVAILABLE  •Live│  │
│ dental care,          (54px, 13ch)           │ Today 16:30   (30px) │  │
│ close to home.                               │ with Dr Amara Osei   │  │
│ lede 18px, 46ch                              │ [14:10][16:30][17:00]│  │
│ [Book an appointment] [(phone) 0161…]        │ [17:40]              │  │
│ ───────────────────────────────              │ Treatment [select ▾] │  │
│ 4.9 ★★★★★   Since 2009   Same week           │ [ Hold this slot   ] │  │
│                                              └─────────────────────┘  │
├───────────────────────────────────────────────────────────────────────┤
│ TREATMENTS  Prices you can see first            note, 40ch            │
│ [card][card][card]   3 × 2 grid, 16px gap                             │
│ [card][card][card]                                                    │
└───────────────────────────────────────────────────────────────────────┘
below: dentists 4-up · insurers | hours · map | address · reviews · footer
```

- `header.top` is `position: sticky`, 68px, background `rgba(242,249,248,.94)`, 1px bottom rule.
- Content max width 1168px, side padding 56px.
- Hero is a 2-column grid: `minmax(0,1.15fr) minmax(0,.85fr)`, 48px gap, 52px top padding, 56px bottom padding.
- The slot card is a `<form>` labelled by its "Next available" heading. The chips are a `<fieldset>` of radio inputs with a `<legend>`.
- Treatments: `<section>` with six `<article class="card">`, `repeat(3, minmax(0,1fr))`.
- Dentists: four `<article>`, `repeat(4, minmax(0,1fr))`. Each has a 64px initials disc and a `<ul>` of credential pills.
- Insurers and hours: a 2-column split. Insurers are a 2-column `<ul>` with check icons. Hours are a `<table>` with `<th scope="row">` day names.
- Location: `minmax(0,1.3fr) minmax(0,1fr)`. The map is a `div role="img"` with an `aria-label`, holding an inline SVG. The address card sits right.
- Reviews: three columns `.8fr 1.2fr 1.2fr`. A teal score card, then two `<blockquote>` with a `<footer>`.
- Alternate bands use a white surface with 1px rules top and bottom. The others sit on the aqua page.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | ---: | --- | --- |
| Live dot | load, loop | box-shadow ring | 0 → 8px, alpha .45 → 0 | 2400ms | `--ease` | no animation |
| Time chip | hover / select | border, background | line → teal-2 / white → teal | 180ms | `--ease` | 1ms |
| Primary button | hover | background | teal → teal-2 | 180ms | `--ease` | 1ms |
| Primary button | active | translateY | 0 → 1px | 180ms | `--ease` | 1ms |
| Treatment card | hover | translateY, border | 0 → -2px | 180ms | `--ease` | no lift |
| Nav links | click | scroll | smooth | browser | — | `scroll-behavior: auto` |

Nothing else moves. No scroll reveals, no counters, no parallax. A clinic page should be still.

## States

- **Time chip, free:** white, 1px `--line`, 10px radius, 44px tall, 15px 700 text.
- **Time chip, hover:** border `--teal-2`.
- **Time chip, selected:** `--teal` fill and border, white text.
- **Time chip, taken:** `--bg` fill, `--ink-3` text, `line-through`, `disabled`.
- **Hold button, disabled:** opacity 0.5, `cursor: default`. Only when no chip is free.
- **Held note:** 14px 600 `--ok`, inside `role="status"`. Empty on load. Clears when a chip changes.
- **Today row:** `--aqua` fill, day name `--teal` 800, plus a `Today` pill (11px, uppercase, teal fill, white text, 999px radius).
- **Closed day:** hours cell reads "Closed" in `--ink-3` at 600.
- **Ghost button:** white fill, inset 1px `--aqua-2` ring, teal text. Hover fill `--aqua`.
- **Focus-visible:** 2px `--teal` outline, 3px offset, 6px radius. On chips the ring draws on the visible `span` because the radio is hidden.
- **Menu open (≤900px):** dropdown under the header, white, links 12px vertical padding with 1px rules.

## Accessibility

- One `h1` (the headline). Each band has an `h2` and `aria-labelledby` on its `section`.
- The slot card is a `<form aria-labelledby>`. Chips are real radios in a `<fieldset>` with the legend "Pick a time today". Disabled radios are skipped by arrow keys.
- "Today 16:30" is `aria-live="polite"`, so a screen reader hears the new next slot after a hold.
- The held note is `role="status"`.
- The phone number is a `tel:` link in the header and in the hero. Its icon is `aria-hidden`.
- Initials discs are `aria-hidden`. The name in the `h3` carries the meaning.
- The map is `role="img"` with an `aria-label` that says where the clinic is relative to the tram stop and the park. The SVG inside is `aria-hidden`.
- Star rows are `aria-hidden`. The number "4.9" and "612 reviews" are text.
- The rating bars have an `aria-label` that reads all three percentages.
- The today row gets `aria-current="date"`. The pill is CSS content, so the attribute is the real signal.
- Contrast: `#0e4f55` on `#f2f9f8` is about 9:1. `#45605f` on white is about 6.6:1. `#6a8180` on white is about 4.2:1; use it only for 13–14px meta and disabled chips, never for body.
- Menu button: 44px square, `aria-label="Menu"`, `aria-controls="nav"`, `aria-expanded` true or false.
- Hit targets: buttons 48px tall, header Book 42px, chips 44px, selects 46px.

## Responsive rules

- **≥1280:** as specified. Hero 2 columns. Headline 54px. Treatments 3 × 2. Dentists 4 across. Reviews 3 columns.
- **1024–1279 (below 1100px):** side padding 40px. Headline 46px. Nav gap 18px. Dentists 2 × 2. Reviews: the score card spans the full row, the two quotes sit side by side under it.
- **768–1023 (below 900px):** hide nav links and the header phone. Show the menu button. "Book" stays in the header. Hero, insurers/hours, and location each stack to 1 column. Treatments 2 columns.
- **<640:** side padding 20px. Hide the header "Book" (the hero buttons do the job). Headline 38px. Lede 17px. Section headings 28px. Bands 52px vertical padding. The two hero buttons go full width. The trust row becomes 3 equal columns, 18px numbers. Treatments, dentists, insurers and reviews go 1 column. Time chips go 2 × 2. The map is 220px tall.
- Every grid uses `minmax(0, 1fr)`. The page never scrolls sideways at 390px.

## Acceptance checklist

### Always

- [ ] The hero has a booking action and a `tel:` phone link above the fold at 1280×800.
- [ ] The hero shows the next free slot as text, with real radio chips under it, one disabled.
- [ ] Holding a slot disables that chip, writes a `role="status"` note, and moves "Next available" to the next free chip.
- [ ] Prices show as "from" amounts on every treatment card.
- [ ] Each clinician card has an initials disc, a role with years, and credential pills. No photos.
- [ ] The hours table marks today from the device clock with a fill, a pill and `aria-current="date"`.
- [ ] The map is inline SVG with a text alternative. No map tiles or iframes.
- [ ] Radii are 12px on cards and buttons, 18px on large panels. Only the slot card has a shadow.
- [ ] Focus rings are 2px teal with 3px offset, including on hidden-radio chips.
- [ ] At 390px there is a 44px menu button and no horizontal scroll.
- [ ] Reduced motion removes the live pulse and the card lift.

### This demo

- [ ] Brand "Larkfield Dental", phone "0161 496 0732", headline "Unhurried dental care, close to home."
- [ ] Chips 14:10 (taken), 16:30 (selected), 17:00, 17:40. Next available "Today 16:30" with Dr Amara Osei.
- [ ] Six treatments: Check-up and polish £65, Emergency visit £80, Hygienist £55, White fillings £120, Clear aligners £1,950, Whitening £295.
- [ ] Four clinicians: Dr Amara Osei, Dr Tomasz Lewicki, Dr Priya Raman, Hannah Brook.
- [ ] Six insurers, hours Mon–Sat with Sunday closed, address 14 Briar Lane, Manchester M19 4LD.
- [ ] Review score 4.9 from 612 reviews, bars 91% / 7% / 2%, two quotes.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: the hero shows the headline "Unhurried dental care, close to home." on the left and the slot card on the right. The card reads "Next available", a green "Live" dot, then "Today 16:30" at 30px.
2. The time chips are 14:10, 16:30, 17:00, 17:40. 14:10 is disabled and struck through. 16:30 is selected (teal fill, white text).
3. The "Live" dot pulses: a green ring grows from 0 to 8px and fades over 2400ms, forever. Reduced motion: no pulse, the dot stays solid.
4. Click a free chip: it becomes selected. Any old confirmation text clears.
5. Click "Hold this slot": prevent default. The selected chip becomes disabled and struck through. The status line under the button reads "Held: today 16:30. We will text you to confirm within 10 minutes." The first remaining free chip becomes selected and "Next available" updates to it ("Today 17:00").
6. When no chip is free, "Next available" reads "Tomorrow 08:20" and the button is disabled (opacity 0.5).
7. The opening hours table highlights today's row with an aqua fill and a small teal "Today" pill. Today comes from `new Date().getDay()`. The row also gets `aria-current="date"`.
8. Header: "Book" and the phone number are always visible at 1280. Nav links scroll to their bands. Scroll is smooth unless reduced motion is on.
9. Treatment cards lift 2px and the border turns `--aqua-2` on hover, over 180ms.
10. At 900px and below, the nav and phone hide and a 44px menu button appears. It toggles a full-width dropdown under the header and sets `aria-expanded`. Tapping a link closes it.

## Tokens

```css
:root {
  --bg: #f2f9f8;        /* page, pale aqua */
  --surface: #ffffff;   /* cards, alternate bands */
  --aqua: #d6efec;      /* icon wells, today row, avatars */
  --aqua-2: #b7e2dd;    /* hover border, ghost button ring */
  --teal: #0e4f55;      /* headline, primary button, focus */
  --teal-2: #1d6b70;    /* kickers, hover on primary */
  --ink: #12302f;       /* body text */
  --ink-2: #45605f;     /* secondary text */
  --ink-3: #6a8180;     /* meta, disabled */
  --line: #d5e6e3;      /* hairlines and card borders */
  --warm: #d98a3d;      /* review stars only */
  --ok: #1f8a6d;        /* live dot, insurer checks, held note */

  --display: "Nunito", system-ui, sans-serif;
  --sans: "Nunito Sans", system-ui, sans-serif;

  --fs-h1: 54px;
  --fs-h2: 34px;
  --fs-next: 30px;
  --fs-lede: 18px;
  --fs-body: 16px;
  --fs-small: 14px;
  --fs-kick: 13px;

  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 48px;
  --band: 72px;
  --pad: 56px;
  --max: 1168px;

  --r: 12px;
  --r-lg: 18px;
  --shadow-card: 0 1px 0 var(--line), 0 18px 40px -28px rgba(14, 79, 85, .35);

  --t: 180ms;
  --t-pulse: 2400ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

Only the slot card has a shadow. Every other region is split by 1px `--line` rules.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Hero headline | Nunito | 54px | 800 | 1.06 | -0.015em | sentence |
| Section heading | Nunito | 34px | 800 | 1.15 | -0.015em | sentence |
| Next slot | Nunito | 30px | 800 | 1.15 | 0 | sentence |
| Card title | Nunito | 18–19px | 800 | 1.3 | 0 | sentence |
| Price | Nunito | 20px | 800 | 1 | 0 | numerals |
| Review score | Nunito | 56px | 800 | 1 | 0 | numerals |
| Kicker | Nunito Sans | 13px | 700 | 1.4 | 0.06em | UPPERCASE |
| Lede | Nunito Sans | 18px | 400 | 1.55 | 0 | sentence |
| Body | Nunito Sans | 15–16px | 400 | 1.55 | 0 | sentence |
| Buttons | Nunito Sans | 15–16px | 700 | 1 | 0 | sentence |
| Credential pill | Nunito Sans | 12px | 700 | 1.4 | 0 | as written |

The hero headline is teal, not ink. Keep it to three lines at 1280 with `max-width: 13ch`.

## Implementation notes

**Hidden radios with a visible chip.** Keep the input in the label so the whole chip is clickable, and draw focus on the sibling span:

```css
.times label { position: relative; }
.times input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: pointer; }
.times span { display: grid; place-items: center; min-height: 44px;
  border: 1px solid var(--line); border-radius: 10px; font-weight: 700; }
.times input:checked + span { background: var(--teal); border-color: var(--teal); color: #fff; }
.times input:focus-visible + span { outline: 2px solid var(--teal); outline-offset: 2px; }
.times input:disabled + span { color: var(--ink-3); background: var(--bg); text-decoration: line-through; }
```

**Hold a slot and advance "next".** The free list is computed from the DOM each time, so there is no second source of truth:

```js
form.addEventListener('submit', e => {
  e.preventDefault();
  const c = form.querySelector('input[name=t]:checked');
  if (!c) return;
  c.disabled = true; c.checked = false;
  note.textContent = `Held: today ${c.value}. We will text you to confirm within 10 minutes.`;
  const free = [...form.querySelectorAll('input[name=t]:not(:disabled)')];
  if (free.length) { free[0].checked = true; next.textContent = 'Today ' + free[0].value; }
  else { next.textContent = 'Tomorrow 08:20'; form.querySelector('[type=submit]').disabled = true; }
});
```

**Today in the hours table.** Put the weekday number on each row (`data-d`, Sunday = 0) and mark it on load. Render Saturday as today in the static HTML so the first frame is right even before script runs:

```js
const day = new Date().getDay();
document.querySelectorAll('#hrs tr').forEach(r => {
  const on = +r.dataset.d === day;
  r.classList.toggle('today', on);
  on ? r.setAttribute('aria-current', 'date') : r.removeAttribute('aria-current');
});
```

**The map.** One 640×320 SVG with `preserveAspectRatio="xMidYMid slice"`: an aqua field, a green park block, a river as a 22px `--aqua-2` curve, white roads (16px main, 12px side, 7px diagonal), a dashed teal tram line with a ringed stop, three 12–13px labels, and a teal teardrop pin with a white centre. Keep it under 20 paths.

**Stars.** Define one `<symbol id="st">` and `<use href="#st">` it ten times. Pasting the path ten times costs about 1 KB.

Common mistakes:

- A stock photo of a smiling patient. The page has no photos. Initials discs stand in for portraits.
- Hospital white and blue with sharp corners. This is pale aqua and teal at 12px radii.
- A booking modal or a full calendar. The hero card is four chips and a select.
- Hiding prices behind "Contact us". Every card shows a "from" price.
- Using the warm amber for buttons. It is for stars only.
- Shadows on every card. Only the slot card has one.
- "Next available" that never changes. It must follow the chips.
- Animating the hours table or the map. They stay still.

Rebuild order:

1. Tokens, fonts, sticky header with phone and Book.
2. Hero copy, two buttons, trust row.
3. Slot card form with chips, select, hold button, live region.
4. Treatments grid with prices.
5. Dentists row with initials and credentials.
6. Insurers list and hours table, then today logic.
7. Map SVG and address card.
8. Review score card with bars and two quotes. Footer.
9. Breakpoints at 1100, 900 and 640, then the menu toggle.
10. Reduced motion, focus pass, and a 390px overflow check.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
