<!-- Design Lounge Nº 214 · "Mobile website bottom bar" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Mobile website bottom bar

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A bottom navigation bar for a phone website, not a native app. The site is "Depot 41", a strength gym in an old tram depot in Porto. Five items sit in a 64px bar with a 2px black top rule: Home, Coaches, Book, Prices, Visit. Book is a raised 60px safety-orange square with a hard black offset shadow. The active item gets a 4px orange mark on the top rule and follows the section you are reading. The bar hides when you scroll down and comes back when you scroll up or reach the end. The detail worth copying is that it behaves like a website: items are anchor links to page sections, and it sits above the browser's own bottom toolbar.

### When to use it

- Use it for sites people come back to often on a phone: a gym timetable, a restaurant that takes orders, a booking site, a club, a PWA.
- Use it when there are three to five places people jump between, and one action that matters most (Book, Order).
- Do not use it on a marketing page, a portfolio, a launch page or an article. People read those once from top to bottom. Use a header with a hamburger there (`hamburger-circle-reveal` or `mobile-fullscreen-menu`).
- Do not use it with a sticky bottom call-to-action bar (`cta-sticky-mobile-bar`) on the same page. Pick one.

## Reference behaviour

1. First frame: the page is at the top. The bar is visible. Home has `aria-current="true"` and the orange mark.
2. Scroll down more than 6px past 80px from the top: the bar slides down out of view over 220ms `cubic-bezier(.4,0,1,1)`.
3. Scroll up more than 6px: the bar slides back over 280ms `cubic-bezier(.16,1,.3,1)`.
4. Reach the end of the page (within 8px): the bar comes back, even if you were scrolling down, and Visit becomes current.
5. Scroll position under 80px: the bar is always shown.
6. While scrolling, the current item is the last section whose top is above 40% of the screen height. Its mark grows from `scaleX(0)` to `scaleX(1)` over 160ms.
7. Tap an item: the page smooth-scrolls to that section. The current item updates as the section arrives.
8. Tap Book: the page scrolls to "Today", the class list. When Book is current, its label gets a 2px orange underline.
9. Press Book: the orange square moves 3px right and 3px down and its shadow shrinks from 4px to 1px, like a key being pressed.
10. Tab into the bar while it is hidden: it slides back so focus is never on something off screen.
11. In the class list, "Book" buttons toggle to "Booked" (`aria-pressed`). "Full" is disabled.

## Structure

```
390 x 844 (54px status reserve on top, 84px browser bar drawn over the bottom)
+--------------------------------------+
| DEPOT[41]        [] Open until 22:00 | 56px, 2px black rule under
| LIFT HEAVY.                          | 64px condensed 800
| COME BACK TOMORROW.                  |
| ...lede, 3 fact cells...             |
| TODAY                    THU 8 OCT   | sections, 2px rule on top
| 17:30 Barbell basics        [BOOK]   |
|                 +------+             |
|                 | [cal]| 60x60 raised 18px, 4px shadow
+=================|      |=============+ 2px black top rule
|  ▬                                   | 4px orange mark on current
| [home] [coach]  +------+ [tag] [pin] | bar 64px, 5 equal columns
|  HOME  COACHES   BOOK   PRICES VISIT | 11px condensed caps
+--------------------------------------+ bottom: --chrome-bottom
|   browser toolbar (not drawn here)   |
+--------------------------------------+
```

- `<main class="page">` is the whole site: header, hero, and four `<section>`s with ids `book`, `classes`, `prices`, `visit`. The header has id `home`.
- The page has bottom padding of `bar 64 + lift 18 + chrome 84 + 24px`, so the last line is never under the bar.
- `<nav class="nav" aria-label="Site">` is `position: fixed; left: 0; right: 0; bottom: var(--chrome-bottom)`, with `padding-bottom: env(safe-area-inset-bottom)`.
- Inside: `<ul>` as a 5-column grid, `repeat(5, minmax(0, 1fr))`, 64px tall. Each `<li>` holds one `<a href="#section">` with an SVG and a label.
- The centre link has class `fab`. Its icon sits in `<span class="pad">`, absolutely placed so its top is 18px above the bar. The label stays inside the bar at the bottom.
- The current mark is the link's `::before`, 28×4px, sitting on the 2px top rule.

### Content

- Logo "DEPOT" with "41" in a black block. Status "Open until 22:00" with an 8px orange square.
- Hero: "Lift heavy." then "Come back tomorrow." in grey. Lede: "A strength gym in an old tram depot. Barbells, coaching and 46 classes a week. No mirrors on the ceiling." Facts: 18 racks, 46 classes a week, 06:00 first session.
- Today, Thu 8 Oct: 17:30 Barbell basics (Ines, 4 left), 18:15 Strongman circuit (Teo, booked), 19:00 Olympic lifting (Mara, full), 19:45 Conditioning 30 (Ines, 9 left), 20:30 Mobility and core (Ruy, 11 left).
- Coaches: Ines Alves, Teo Varga, Mara Kühn, Ruy Batista.
- Prices: Open gym €39/mo, Coached €69/mo (orange offset shadow), Ten pass €95.
- Visit: Rua do Depósito 41, Porto; week 06:00 to 22:00; weekend 08:00 to 18:00; 12 parking bays.
- Bar: Home, Coaches, Book, Prices, Visit.

## Tokens

```css
:root {
  /* colour: concrete, black, safety orange */
  --concrete: #ecebe7;      /* page */
  --surface: #f7f6f3;       /* bar, cards */
  --ink: #111111;           /* text, rules, shadows */
  --ink-2: #4f4d48;         /* secondary text, resting labels */
  --line: #c9c7c0;          /* list hairlines, disabled border */
  --orange: #ff5a00;        /* Book fill, current mark, focus halo */
  --on-orange: #111111;     /* icon on orange */

  /* type */
  --cond: "Barlow Condensed", "Arial Narrow", sans-serif;
  --sans: "Barlow", system-ui, sans-serif;

  /* layout */
  --top: 54px;
  --chrome-bottom: 84px;    /* browser toolbar in the Lounge frame; 0 in production */
  --gutter: 20px;
  --r: 2px;                 /* every radius */
  --bar-h: 64px;
  --fab: 60px;
  --lift: 18px;             /* how far Book rises above the bar */

  /* motion */
  --std: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-bar: 280ms;           /* show */
  --t-micro: 160ms;
}
```

## Typography

| Role | Family | Size / line | Weight | Tracking | Case |
| --- | --- | --- | --- | --- | --- |
| Bar label | Barlow Condensed | 11px / 1 | 700 | 0.1em | upper |
| Logo | Barlow Condensed | 26px / 1 | 800 | -0.01em | upper |
| Hero headline | Barlow Condensed | 64px / 0.86 | 800 | -0.01em | upper |
| Section heading | Barlow Condensed | 32px / 1 | 800 | 0 | upper |
| Section meta | Barlow Condensed | 13px | 700 | 0.08em | upper |
| Slot time | Barlow Condensed | 18px / 1 | 700 | 0 | digits |
| Slot button | Barlow Condensed | 14px / 1 | 700 | 0.08em | upper |
| Price | Barlow Condensed | 28px / 1 | 800 | 0 | digits |
| Body | Barlow | 16px / 1.5 | 400 | 0 | sentence |
| Small body | Barlow | 13px | 400 | 0 | sentence |

Labels are always visible. Do not ship an icon-only bar.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Bar | scroll down > 6px, y > 80 | transform | 0 → translateY(100% + 18 + 84 + 8px) | 220ms | cubic-bezier(.4,0,1,1) |
| Bar | scroll up > 6px, end, top, focus | transform | hidden → 0 | 280ms | `--expo` |
| Current mark | section change | transform | scaleX(0) ↔ scaleX(1) | 160ms | `--std` |
| Book pad | press | transform, box-shadow | 0, 4px 4px → 3px 3px, 1px 1px | 160ms | `--std` |
| Slot button | toggle | background | none ↔ ink | 160ms | `--std` |
| Page | tap item | scroll | smooth scroll to section | browser | browser |

The hide distance includes the lift and the chrome, so the raised Book square goes fully off screen too.

Reduced motion: the bar never hides. Scroll is instant (`scroll-behavior: auto`). The mark, the pad press and the slot button change with no transition.

## States

- Item resting: icon and label `--ink-2`, no mark.
- Item current: icon and label `--ink`, 4px orange mark at full width (28px) on the top rule, `aria-current="true"`.
- Book resting: orange square, 2px black border, 2px radius, 4px black offset shadow, black 26px icon, label `--ink`.
- Book current: as resting, plus a 2px orange underline under the label, offset 4px.
- Book pressed: square moves 3px down-right, shadow 1px.
- Focus-visible on items: 2px black outline inset by 4px. On the Book square: 2px black outline offset 3px around the square.
- Focus-visible elsewhere: 2px black outline plus a 4px orange halo.
- Bar hidden: translated off screen, still in the DOM and in the tab order. Focus brings it back.
- Slot booked: black fill, surface text, "Booked". Slot full: `--line` border, grey text, `disabled`.

## Accessibility

- The bar is `<nav aria-label="Site">` with a list of links. These are links to places, so use `<a href>`, not buttons.
- The current item uses `aria-current="true"` because it marks a section of one page. On a site where each item is its own page, use `aria-current="page"`.
- Icons are `aria-hidden` SVGs. The visible label is the name.
- `focusin` on the nav removes the hidden state, so keyboard users never tab to an off-screen link.
- Book is the same kind of link as the others. Do not give it a different role.
- Contrast: `#111111` on `#f7f6f3` is about 18:1. `#4f4d48` on `#f7f6f3` is about 7.8:1. `#111111` on `#ff5a00` is about 7:1. Never put orange text on concrete; it is under 3:1.
- Hit targets: each column is a fifth of the screen (70–76px) by 64px. The Book square is 60×60 and the full column below it is clickable.
- The header is not sticky. One fixed bar is enough on a phone.

## Responsive rules

- At 360 wide, each column is 70px. Labels at 11px condensed caps fit. "Coaches" is the longest at 7 letters. Keep labels to one word, 8 letters or fewer.
- At 390 wide, columns are 76px.
- Always use `env(safe-area-inset-bottom)` for bottom padding, and `viewport-fit=cover` in the viewport meta.
- In the Lounge frame, `--chrome-bottom` is 84px because the browser toolbar is drawn over the bottom of the page. In production set it to 0. Mobile browsers already place the page above their own toolbar.
- At 768px and wider, hide this bar and show the same five links in a top header. Book becomes a filled button at the right of the header.
- If the site is installed as a PWA, keep the bar and stop hiding it on scroll. There is no browser toolbar fighting for space.
- Do not draw a status bar or a URL bar.

## Acceptance checklist

### Always

- [ ] Five items in equal columns. A product uses three to five, one per real destination.
- [ ] One raised centre action, the one task that matters most.
- [ ] Labels always show under icons.
- [ ] The current item follows the section in view and has one mark.
- [ ] The bar hides on scroll down, returns on scroll up, at the top and at the end of the page.
- [ ] Hiding moves the raised action off screen too.
- [ ] Bottom padding uses `env(safe-area-inset-bottom)`.
- [ ] Page bottom padding keeps the last line clear of the bar.
- [ ] Tabbing into a hidden bar shows it.
- [ ] Every hit target is at least 44px.
- [ ] Reduced motion keeps the bar fixed and visible.

### This demo

- [ ] Items read Home, Coaches, Book, Prices, Visit. Home is current on load.
- [ ] Book is a 60×60 `#ff5a00` square, 2px black border, 2px radius, 4px black offset shadow, raised 18px.
- [ ] The bar is 64px, `#f7f6f3`, with a 2px `#111111` top rule.
- [ ] The current mark is 28×4px orange on the top rule.
- [ ] Labels are Barlow Condensed 700, 11px, 0.1em, uppercase.

## Implementation notes

Hide and show with a small threshold, and always show at the top and the end. Throttle with `requestAnimationFrame`, not a timer.

```js
let lastY = scrollY, ticking = false;
function onScroll() {
  const y = scrollY;
  const atEnd = innerHeight + y >= document.documentElement.scrollHeight - 8;
  if (atEnd || y < 80 || y < lastY - 6) nav.classList.remove('hidden');
  else if (y > lastY + 6) nav.classList.add('hidden');
  if (Math.abs(y - lastY) > 6 || atEnd) lastY = y;
  ticking = false;
}
addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
}, { passive: true });
nav.addEventListener('focusin', () => nav.classList.remove('hidden'));
```

Pick the current section in page order, not bar order. In this demo Book's section comes before Coaches on the page, so looping over the bar items would pick the wrong one.

```js
const sections = [...document.querySelectorAll('#home, main section')];
let current = 'home';
sections.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * 0.4) current = s.id; });
if (atEnd) current = sections[sections.length - 1].id;
```

The raised square and the bar:

```css
.nav { position: fixed; left: 0; right: 0; bottom: var(--chrome-bottom); padding-bottom: env(safe-area-inset-bottom, 0px); border-top: 2px solid var(--ink); transition: transform var(--t-bar) var(--expo); }
.nav.hidden { transform: translateY(calc(100% + var(--lift) + var(--chrome-bottom) + 8px)); transition: transform 220ms cubic-bezier(.4,0,1,1); }
.nav ul { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); height: var(--bar-h); }
.fab .pad { position: absolute; top: calc(var(--lift) * -1); left: 50%; width: var(--fab); height: var(--fab); margin-left: calc(var(--fab) / -2);
  background: var(--orange); border: 2px solid var(--ink); border-radius: var(--r); box-shadow: 4px 4px 0 var(--ink); }
.fab:active .pad { transform: translate(3px, 3px); box-shadow: 1px 1px 0 var(--ink); }
```

Common mistakes:

- Using it on a marketing page. A one-visit page needs a header, not app chrome.
- Hiding on every pixel of scroll. Use the 6px threshold or it flickers.
- Not showing the bar at the end of the page, so the footer links are the only way out.
- Hiding the bar but leaving the raised square peeking above the bottom edge.
- `bottom: 0` with no `env(safe-area-inset-bottom)`, so labels sit under the home indicator.
- A sticky header and a bottom bar together. Two fixed bars eat the screen.
- A round floating button with a soft shadow. This family uses a 2px radius and a hard offset shadow.
- Orange text on the concrete page.
- Buttons instead of links for destinations.

Rebuild order:

1. Build the page with real sections and ids.
2. Add the fixed bar with five equal columns and labels.
3. Raise the centre square with the hard shadow.
4. Add the current mark and the scroll-linked current item.
5. Add hide on scroll down and show on scroll up, top and end.
6. Add `focusin` to show, and the reduced-motion block.
7. Set `--chrome-bottom` to 0 for production and check the safe-area padding.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
