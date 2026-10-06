<!-- Design Lounge Nº 420 · "Split hero with UI card stack" · www.designlounge.live -->

# Split hero with UI card stack

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The top of a marketing site for Tendwell, a fictional booking tool for clinics. The left half sells: a small "New" pill, a 62px headline with one word marked in butter yellow, a subline, two buttons, and a trust line that says "Used by 2,400 clinics". The right half shows the product instead of describing it: three real UI cards built from HTML and CSS, stacked and overlapping. A day schedule sits at the back, a patient text message sits in the middle, and a weekly fill-rate card sits in front. The cards settle in one after another on load, then drift a few pixels with the pointer, so the stack feels like paper on a desk. The detail worth copying: the three cards tell one story. The waitlist slot on the schedule, the text that filled it, and the number that went up are the same event.

## Structure

```
1280 x 800
+--------------------------------------------------------------------------+
| [v] Tendwell   Scheduling Reminders Waitlist Pricing Customers  Sign in [Book a demo] |  nav 72
|                                                                          |
|  (New) Waitlist autofill...          +---- schedule card 76% ----+       |
|                                      | Thursday, 8 Oct    M T W[T]F|     |
|  Every open slot,                    | 09:00 | Ruth Mbeki   Arrived |     |
|  [filled] by morning.     62/1.02    | 09:45 | Tomas F.   Confirmed |     |
|                                      | 10:30 | Priya R.  Autofilled +-message card 58%-+
|  subline 19px, 3 lines               | 11:15 | Jonah A.   | (PR) Priya Raman        |
|                                      +--------------------| "Hi Priya, a 10:30..."  |
|  [Start free for 30 days ->] [> Watch the 3-minute tour]  |              [YES]      |
|                                  +- metric card 44% -+    |   Booked in 41 seconds  |
|  (BH)(NP)(AO)(+) Used by 2,400   | Chairs filled     |    +-------------------------+
|                                  | 96%  (+14 pts)    |
|  left col 1fr                    | bars M T W T F S  |       right col 1.04fr, stage 540
|                                  +-------------------+
+--------------------------------------------------------------------------+
padding 24 72 40, column gap 48
```

- `<header class="nav">`: logo link, `<nav aria-label="Primary">` with a `<ul>` of 5 links, then Sign in and a small primary button.
- `<main class="hero">`: a CSS grid with `grid-template-columns: minmax(0,1fr) minmax(0,1.04fr)`.
- Left column: a `span` pill, one `h1` with a `mark` inside, a `p` subline, a `div` of two `a` buttons, a `p` trust line.
- Right column: a `div` stage with `role="img"` and an `aria-label` that names the three cards.
- Each card is two layers: an outer `.slot` that is absolutely placed and takes the pointer drift, and an inner `.card` that plays the entrance. Never put both transforms on one element.
- Schedule card: a header row (title, doctor, a 5-day strip with Thursday filled), then a `ul` of 4 appointment rows. Each row is a grid: time 52px, a 4px colour bar, name and type, a status tag.
- Message card: avatar and name row, an outgoing teal bubble, an incoming "YES" bubble aligned right, a teal status line with a check icon.
- Metric card: label, a 40px number with a delta pill, 6 bars, 6 day letters.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Delay |
| --- | --- | --- | --- | --- | --- | --- |
| Schedule card | load | opacity, transform | 0, translateY(28px) scale(.96) → 1, none | 800ms | expo-out | 150ms |
| Message card | load | same | same | 800ms | expo-out | 300ms |
| Metric card | load | same | same | 800ms | expo-out | 450ms |
| Card slots | pointermove | translate3d | 0,0 → nx·d, ny·d (d = 2, 4, 6px) | 700ms | expo-out | none |
| Card slots | pointer leaves page | translate3d | current → 0,0 | 700ms | expo-out | none |
| Buttons | hover | background-color | base → darker | 160ms | standard | none |
| Buttons | active | transform | none → translateY(1px) | 160ms | standard | none |

- `nx` and `ny` run from -1 to 1 across the viewport.
- Throttle the pointer handler with one `requestAnimationFrame` per frame.
- Reduced motion: no entrance animation, cards start at opacity 1. Do not attach the pointer listener. Button colour still changes, without a transition.
- Nothing loops.

## States

- Primary button: `--teal` fill, warm white text. Hover `--teal-2`. Active 1px down.
- Secondary button: white fill, 1.5px `--line` border, `--ink` text. Hover `--sunk`.
- Nav link hover: colour from `--ink-2` to `--ink`.
- Focus-visible on every link and button: 2px `--focus` outline, 3px offset, 6px radius.
- Autofilled schedule row: `--butter-soft` row fill, a darker gold `#d9a92b` colour bar, a `--butter` tag with dark text `#4a3a06`. This is the only yellow inside the cards.
- Today in the day strip: a 30px `--teal` square with warm white text.
- Loading, empty and error do not apply. The cards are static content.

## Accessibility

- One `h1`. The highlighted word is a `mark` inside it, so screen readers read the sentence once.
- Nav has `aria-label="Primary"`.
- The stage has `role="img"` and `aria-label="Product preview: schedule, patient message and weekly fill rate"`. Do not make the cards focusable.
- Every icon is inline SVG with `aria-hidden="true"`. Each button has visible text.
- The trust initials are decorative and `aria-hidden`. The sentence carries the meaning.
- Contrast: `#4a5b58` on `#fbf8f2` is about 6.8:1. `#6f7d7a` on white is about 4.4:1, so keep it to 12px+ meta only and never for body copy. Warm white on `#0f4c4a` is about 9:1.
- Buttons are 48px tall. The nav button is 40px.
- Tab order: logo, 5 nav links, Sign in, Book a demo, Start free, Watch the tour. The stage is skipped.

## Responsive rules

- ≥1280: as drawn. Side padding 72px. Headline 62px. Stage 540px tall.
- 1024: side padding 40px, nav link gap 20px, headline 52px, subline 17px. Keep two columns.
- 768: hide the nav links. Switch the hero to one column, with copy first and the stage below. Cap the stage at 560px wide and centre it. Column gap 40px.
- <640: nav 64px tall, side padding 20px, hide Sign in. Headline 40px. Both buttons go full width and stack. Stage 600px tall. Schedule card 92% wide at top 0. Message card 80% wide at top 250px. Metric card 58% wide at left 0, top 430px. Hide the status tags in the schedule rows and show only 3 day letters.
- At every size the page must not scroll sideways. Use `minmax(0,1fr)` tracks and `overflow-x: hidden` on the body as a guard.

## Acceptance checklist

### Always

- [ ] Two columns at 1024 and up: copy on the left, product on the right. One column below 900px.
- [ ] Exactly three product cards. They overlap, and each one is real UI built in HTML and CSS, not an image.
- [ ] One word in the headline is marked with a flat band of the highlight colour behind the lower half of the letters.
- [ ] Two buttons: one filled primary, one outlined secondary with an icon. Both are 48px tall.
- [ ] A trust line with a number sits under the buttons.
- [ ] Cards settle in back to front with a 150ms stagger and 800ms expo-out.
- [ ] Pointer drift is capped at 6px on the front card, with less on cards behind it.
- [ ] Entrance and drift live on different elements.
- [ ] Reduced motion shows the final layout with no entrance and no drift.
- [ ] Focus rings are visible on every link and button.
- [ ] No horizontal scroll at 390px.

### This demo

- [ ] The brand is Tendwell. The headline reads "Every open slot, filled by morning." with "filled" marked in `#f6d97a`.
- [ ] The trust line reads "Used by 2,400 clinics across 11 countries".
- [ ] The schedule is "Thursday, 8 Oct" for Dr. Ama Osei, with the 10:30 Priya Raman row marked "Autofilled".
- [ ] The message offers the 10:30 slot. The reply is "YES". The status reads "Booked in 41 seconds".
- [ ] The metric card reads 96% with "+14 pts" and has 6 bars, Friday filled in teal.
- [ ] Card radius is 14px. Primary is `#0f4c4a` on a `#fbf8f2` page.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: warm white page. Nav at the top, 72px tall. Below it, a two-column hero fills the rest of the 800px frame and is centred vertically.
2. Left column, top to bottom: pill "New · Waitlist autofill for group practices", headline "Every open slot, filled by morning." with "filled" marked, subline (3 lines at 1280), two buttons, trust line with four small round initials and the text "Used by 2,400 clinics across 11 countries".
3. Right column: a 540px tall stage holding three cards at absolute positions. The schedule card is at the back, top left, 76% of the stage width. The message card is on the right, 58% wide, 186px from the top. The metric card is in front, bottom left, 44% wide, 330px from the top.
4. On load, each card rises from 28px below and scales from 0.96 to 1 while it fades in. Each takes 800ms on expo-out. Delays are 150ms, 300ms and 450ms, back to front.
5. Moving the pointer anywhere on the page shifts the cards. The back card moves up to 2px, the middle card up to 4px, the front card up to 6px. The direction follows the pointer: pointer at the right edge moves cards right, pointer at the top moves cards up.
6. Each card follows the pointer through a 700ms expo-out transition, so the drift lags behind the pointer and never jitters.
7. When the pointer leaves the page, the cards ease back to 0, 0.
8. Hovering a button darkens its fill over 160ms. Pressing a button nudges it down 1px.
9. The stage is not interactive. The cards are pictures of the product, not controls.
10. With reduced motion, the cards are in place on the first frame and do not drift.

## Tokens

```css
:root {
  /* colour */
  --bg: #fbf8f2;          /* warm white page */
  --surface: #ffffff;     /* cards */
  --sunk: #f3eee4;        /* tags, incoming bubble, secondary hover */
  --ink: #16302e;         /* headings, names */
  --ink-2: #4a5b58;       /* body, subline */
  --ink-3: #6f7d7a;       /* meta, times */
  --line: #e6dfd1;        /* card borders, dividers */
  --teal: #0f4c4a;        /* primary, outgoing bubble, bars */
  --teal-2: #0b3a38;      /* primary hover */
  --teal-soft: #e2eeec;   /* pill, delta, low bars */
  --butter: #f6d97a;      /* headline mark, autofilled tag */
  --butter-soft: #fbefc4; /* autofilled row */
  --focus: #0f4c4a;

  /* type */
  --sans: "Hanken Grotesk", system-ui, sans-serif;
  --fs-h1: 62px;
  --fs-sub: 19px;
  --fs-body: 16px;
  --fs-card: 14px;
  --fs-meta: 12px;

  /* space (4px base) */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 24px; --s-6: 32px; --s-7: 48px; --s-8: 72px;

  /* shape */
  --r: 14px;      /* cards, big buttons */
  --r-sm: 10px;   /* schedule rows */
  --r-pill: 999px;
  --shadow: 0 1px 0 rgba(22,48,46,.04), 0 12px 32px -12px rgba(22,48,46,.22);

  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --t-micro: 160ms;
  --t-enter: 800ms;
  --t-drift: 700ms;
}
```

## Typography

One family, Hanken Grotesk, at 400, 500, 600, 700 and 800. It is a grotesk with open, humanist shapes, which keeps the page friendly without going round and bubbly.

| Role | Size | Weight | Line-height | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Logo | 19px | 800 | 1 | -0.02em | `--ink` |
| Nav links | 15px | 500 | 1.5 | 0 | `--ink-2` |
| Pill | 14px | 600 | 1 | 0 | `--teal` |
| Headline `h1` | 62px | 800 | 1.02 | -0.035em | `--ink` |
| Subline | 19px | 400 | 1.55 | 0 | `--ink-2` |
| Button | 16px | 700 | 1 | 0 | per variant |
| Trust line | 15px | 400, number part 700 | 1.5 | 0 | `--ink-2`, bold part `--ink` |
| Card title | 15px | 700 | 1.3 | 0 | `--ink` |
| Card row name | 14px | 600 | 1.3 | 0 | `--ink` |
| Card meta | 12-13px | 500-600 | 1.3 | 0 | `--ink-3` |
| Metric number | 40px | 800 | 1 | -0.03em | `--ink` |

- Cap the headline at 13ch so it breaks into two lines at 1280: "Every open slot," then "filled by morning."
- Cap the subline at 30em.
- Use `font-variant-numeric: tabular-nums` on the schedule times.

## Implementation notes

**Two layers per card.** The entrance uses a keyframe on `.card`. The drift uses an inline transform on `.slot`. If you put both on one element, the drift will cancel the entrance halfway or the entrance will lock the transform.

```css
.slot { position: absolute; transition: transform 700ms var(--expo); will-change: transform; }
.card { opacity: 0; transform: translateY(28px) scale(.96);
        animation: settle 800ms var(--expo) forwards; }
.s-sched .card { animation-delay: 150ms; }
.s-msg   .card { animation-delay: 300ms; }
.s-metric .card { animation-delay: 450ms; }
@keyframes settle { to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  .card { animation: none; opacity: 1; transform: none; }
  .slot { transition: none; }
}
```

**Drift.** Store a depth on each slot and let CSS do the easing. JS only sets the target.

```js
const slots = [...document.querySelectorAll('.slot')];
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let raf = 0, nx = 0, ny = 0;
  const apply = () => {
    raf = 0;
    for (const s of slots) {
      const d = +s.dataset.depth; // 2, 4, 6
      s.style.transform = `translate3d(${nx * d}px, ${ny * d}px, 0)`;
    }
  };
  addEventListener('pointermove', e => {
    nx = e.clientX / innerWidth * 2 - 1;
    ny = e.clientY / innerHeight * 2 - 1;
    if (!raf) raf = requestAnimationFrame(apply);
  });
  document.addEventListener('pointerleave', () => { nx = ny = 0; apply(); });
}
```

**The highlight.** Use a hard-stop gradient on a `mark`, not a pseudo-element. It wraps with the word if the line breaks.

```css
mark {
  color: inherit;
  background: linear-gradient(transparent 52%, var(--butter) 52%, var(--butter) 92%, transparent 92%);
  padding: 0 .06em; margin: 0 -.06em;
}
```

Common mistakes:

- Drawing the cards as a screenshot or a blurred image. They must be real markup so the text is crisp at any zoom.
- Tilting the cards in 3D. This piece only moves them flat. For a 3D lean, use `hero-product-window-tilt`.
- Drift above 6px. More than that feels seasick and pulls focus from the headline.
- Glow blobs or a gradient behind the stack. The page is flat warm white. The cards' soft shadow is the only depth.
- Using yellow for buttons. Yellow is for the headline mark and the one autofilled row. Teal is the action colour.
- Letting the stage collapse on mobile because every card is absolute. Give the stage an explicit height at each breakpoint.
- Three unrelated cards. Keep them on one story: one cancellation, one text, one number.

Rebuild order:

1. Lay out the nav and the two-column grid with `minmax(0,1fr)` tracks.
2. Set the headline, mark, subline, buttons and trust line.
3. Build the three cards flat, one after another, and check each at real size.
4. Make the stage `position: relative` with a fixed height. Place the slots.
5. Add the entrance keyframe with the three delays.
6. Add the pointer drift with depths 2, 4 and 6.
7. Add the reduced-motion block.
8. Check 1024, 768 and 390. Adjust the slot positions per breakpoint.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
