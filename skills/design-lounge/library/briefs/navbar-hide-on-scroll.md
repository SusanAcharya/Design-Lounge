<!-- Design Lounge Nº 203 · "Hide-on-scroll navbar" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Hide-on-scroll navbar

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The header of Kestrel, a fictional feature-flag service. A 36px black announcement bar sits on top and can be dismissed. Under it is a 64px navbar with the logo, five section links, "Sign in" and a cobalt "Start free" button. Scroll down more than 8px and the whole header slides up out of view. Scroll up and it slides back with a soft shadow. As you pass each section, its link gets a 2px cobalt underline. The detail worth copying: the header only moves when the scroll delta passes 8px, so trackpad jitter never makes it flicker.

## Reference behaviour

1. First frame: scroll is 0. The announcement bar and the navbar are both visible. There is no shadow.
2. The announcement reads "NEW Kestrel 4.2 evaluates flags at the edge in 11 regions. Read the changelog". "NEW" is a cobalt tag. "Read the changelog" is an underlined link. An X button on the right dismisses it.
3. "Product" is the active link. It has `aria-current="true"`, ink text and a 2px cobalt underline.
4. The user scrolls down. Each scroll event compares `scrollY` with the last recorded position. When the difference is more than 8px and the direction is down, and `scrollY` is past the header's own height, the header gets `translateY(-100%)` over 280ms.
5. The user scrolls up by more than 8px. The header returns to `translateY(0)` over 280ms and shows a shadow because the page is not at the top.
6. At `scrollY` 0 the header is always shown and the shadow goes away.
7. Moves under 8px do nothing. The last recorded position only updates when a move passes 8px.
8. The header does not hide while the mobile menu is open, or while keyboard focus is inside it. If focus moves into a hidden header, it slides back in.
9. As the reader scrolls, an IntersectionObserver watches the five sections. The section crossing a band 40% from the top of the viewport becomes active. Its link gets `aria-current="true"` and the underline grows from the left over 200ms. The old link loses both.
10. Clicking a link scrolls to its section. Sections have `scroll-margin-top: 64px` so the heading clears the navbar when it reappears.
11. Clicking the X removes the announcement bar from the page. The main content's top padding animates from 100px to 64px over 280ms. Focus moves to the logo.
12. Below 760px wide the five links, "Sign in" and "Start free" hide. A 44px menu button appears on the right. It opens a panel under the navbar with all links, "Sign in", and "Start free" at full width. Escape closes it and returns focus to the button.

## Structure

```
1280 x 800 frame, header fixed at top

+--------------------------------------------------------------------------+
| [NEW] Kestrel 4.2 evaluates flags at the edge in 11 regions. Read the changelog   [x] |  36px black
+--------------------------------------------------------------------------+
|  /\ Kestrel    Product  SDKs  Pricing  Changelog  Customers   Sign in [Start free ->] |  64px
|                ‾‾‾‾‾‾‾ 2px cobalt                                         |
+--------------------------------------------------------------------------+ 1px #e2e0d8
| main, padding-top 100px                                                  |
|   FEATURE FLAGS · V4.2                                                   |
|   Ship on Friday. Flip it off on Saturday.     [ code block ]            |
|   ...                                                                    |
|   02 · SDKs     | 2 x 2 cell grid |                                      |
|   03 · Pricing  ...                                                      |

inner width 1184px max, padding 0 32px
navbar grid: auto | minmax(0,1fr) | auto, gap 40px
announcement grid: 40px | minmax(0,1fr) | 40px
```

- One `header` holds the announcement, the navbar and the mobile panel. It is `position: fixed`, so one transform moves all of it.
- The announcement is a `div` with `role="region"` and `aria-label="Announcement"`. Inside: a `p` and a `button`.
- The navbar row holds a logo link, a `nav` labelled "Primary" with a `ul` of five links, and an actions group.
- The actions group holds the "Sign in" link, the "Start free" link styled as a button, and the menu button.
- `main` has top padding equal to the header height so the hero is not hidden on load.
- Each section has an `id` matching a link `href` and a `data-spy` attribute.

## Tokens

```css
:root {
  /* surfaces */
  --bg: #f6f5f1;           /* page */
  --surface: #fbfaf7;      /* navbar, cells, panel */
  --note-bg: #141414;      /* announcement */
  --note-ink: #f6f5f1;

  /* ink */
  --ink: #141414;
  --ink-2: #4b4b48;        /* links at rest, body */
  --ink-3: #6b6b66;        /* labels, dates */
  --line: #e2e0d8;

  /* accent */
  --accent: #1f4fd8;       /* underline, button, tag, focus */
  --accent-hover: #173fb3;
  --accent-ink: #ffffff;

  /* type */
  --sans: "Hanken Grotesk", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --fs-note: 13px;
  --fs-link: 14px;
  --fs-logo: 18px;
  --fs-h1: 64px;
  --fs-h2: 40px;
  --fs-body: 16px;

  /* space */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;

  /* sizes */
  --note-h: 36px;
  --nav-h: 64px;
  --delta: 8px;

  /* radius and shadow */
  --radius: 6px;
  --shadow: 0 1px 0 rgba(20,20,20,.06), 0 8px 24px -12px rgba(20,20,20,.18);

  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --dur: 280ms;
  --dur-micro: 200ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Announcement | IBM Plex Mono | 13px | 400 | 1 | 0 | sentence |
| NEW tag | IBM Plex Mono | 11px | 400 | 1 | 0.06em | upper |
| Logo | Hanken Grotesk | 18px | 700 | 1 | -0.02em | title |
| Nav link | Hanken Grotesk | 14px | 500 | 1.55 | 0 | title |
| Sign in | Hanken Grotesk | 14px | 500 | 1.55 | 0 | title |
| Start free | Hanken Grotesk | 14px | 600 | 1 | 0 | title |
| Label | IBM Plex Mono | 12px | 400 | 1 | 0.08em | upper |
| h1 | Hanken Grotesk | 64px | 700 | 1.02 | -0.035em | sentence |
| h2 | Hanken Grotesk | 40px | 700 | 1.05 | -0.03em | sentence |
| Body | Hanken Grotesk | 16px | 400 | 1.55 | 0 | sentence |

Mono is for the announcement, labels, dates and code. Everything a user clicks in the navbar is in the grotesk.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Header hide | scroll down > 8px past header height | transform | translateY(0) → translateY(-100%) | 280ms | `--ease` |
| Header reveal | scroll up > 8px | transform | translateY(-100%) → translateY(0) | 280ms | `--ease` |
| Shadow | header shown and scrollY > 0 | box-shadow | none → `--shadow` | 280ms | `--ease` |
| Active underline | section enters band | transform | scaleX(0) → scaleX(1), origin left | 200ms | `--ease` |
| Dismiss | X clicked | main padding-top | 100px → 64px | 280ms | `--ease` |
| Button hover | hover | background | `#1f4fd8` → `#173fb3` | 160ms | `--ease` |

- No delay, no stagger.
- Reduced motion: remove the transitions on the header, `main` and the underline. The header still hides and shows, it just jumps. Scrollspy still updates.
- Do not animate `top` or `height`. Only `transform` moves the header.

## States

- Header at top: shown, no shadow.
- Header hidden: `translateY(-100%)`, no shadow.
- Header revealed mid-page: shown, with `--shadow`.
- Link resting: `#4b4b48`.
- Link hover: `#141414`.
- Link active: `#141414`, `aria-current="true"`, 2px cobalt bar 2px above the bottom edge, inset 12px each side.
- Focus-visible: 2px cobalt outline, offset 2px, radius 2px. On the black announcement bar the ring is white and inset 4px.
- Start free hover: `#173fb3`.
- Announcement dismissed: removed from the DOM, not hidden with opacity.
- Menu open: the panel shows under the navbar; the active link in the panel is cobalt text.
- No disabled, loading or error state.

## Accessibility

- The header is a `header`. The links sit in a `nav` with `aria-label="Primary"`.
- The announcement has `role="region"` and `aria-label="Announcement"`. The X is a `button` with `aria-label="Dismiss announcement"`.
- After dismissing, move focus to the logo so focus is not lost on a removed node.
- Use `aria-current="true"` for the section link, not `"page"`. All five links are on one page.
- Keep exactly one link current in the bar and one in the panel.
- Do not hide the header while focus is inside it. On `focusin`, reveal it. A keyboard user tabbing from the page back into the header must see it.
- The menu button has `aria-controls`, `aria-expanded` and a label that switches between "Open menu" and "Close menu". Escape closes the panel and returns focus.
- Tab order: "Read the changelog", the X, logo, five links, Sign in, Start free.
- Contrast: `#4b4b48` on `#fbfaf7` is about 8:1. `#1f4fd8` on `#fbfaf7` is about 6.5:1. White on `#1f4fd8` is about 6.8:1. `#6b6b66` on `#f6f5f1` is about 5:1.
- Hit targets: links are 38px tall at 14px; the button is 40px; the X is 36px square; the menu button is 44px square.

## Responsive rules

- At 1280 and above: the full row. Grid gap 40px. Link padding 8px 12px.
- At 1024 and below: link padding 8px 8px, grid gap 24px, h1 52px, the hero stacks to one column.
- At 768: the row still fits: logo, five links, Sign in, Start free.
- Below 760: hide the link `nav`, Sign in and Start free. Show the 44px menu button. The NEW tag hides. The announcement text drops to 12px and ends in an ellipsis when too long.
- Below 640: page padding 0 20px. h1 40px. Cell grids stack to one column.
- The hide and reveal logic is the same at every width.
- No element ever overflows sideways. The code block scrolls inside itself with `overflow-x: auto`.

## Acceptance checklist

### Always

- [ ] The header hides on scroll down and returns on scroll up.
- [ ] Moves smaller than the delta do nothing.
- [ ] At scroll 0 the header is always shown, with no shadow.
- [ ] A revealed header mid-page has a shadow.
- [ ] Only `transform` animates the header.
- [ ] The section in view gets `aria-current` and an underline; the others do not.
- [ ] The announcement can be dismissed; the content shifts up to close the gap; focus moves to a visible element.
- [ ] The header never hides while focus is inside it or the menu is open.
- [ ] Below the collapse width a 44px menu button opens a panel with every link and both actions.
- [ ] Focus rings are visible on the dark bar and on the light bar.
- [ ] Reduced motion keeps the behaviour but removes the slide.

### This demo

- [ ] The announcement is 36px, `#141414`, mono 13px, with a cobalt NEW tag.
- [ ] The navbar is 64px, `#fbfaf7`, with a 1px `#e2e0d8` rule.
- [ ] Links: Product, SDKs, Pricing, Changelog, Customers. Product is current on load.
- [ ] The delta is 8px. The slide is 280ms.
- [ ] The observer uses `rootMargin: "-40% 0px -55% 0px"`.
- [ ] "Start free" is cobalt `#1f4fd8`, 40px tall, radius 6px.
- [ ] Menu collapses below 760px.

## Implementation notes

Always: move the announcement and the navbar together. One wrapper, one transform. Two fixed bars that hide separately drift apart by a frame.

The hide and reveal logic with the 8px delta:

```js
const header = document.getElementById('top');
const DELTA = 8;
let lastY = scrollY, ticking = false;
function onScroll() {
  const y = scrollY, dy = y - lastY;
  if (Math.abs(dy) > DELTA) {
    const busy = panel.classList.contains('open') || header.contains(document.activeElement);
    if (dy > 0 && y > header.offsetHeight && !busy) header.classList.add('hidden');
    else if (dy < 0) header.classList.remove('hidden');
    lastY = y;
  }
  header.classList.toggle('raised', y > 0 && !header.classList.contains('hidden'));
  if (y <= 0) header.classList.remove('hidden');
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
header.addEventListener('focusin', () => header.classList.remove('hidden'));
```

Update `lastY` only inside the delta branch. If you update it on every event, slow scrolling never adds up to 8px and the header never hides.

The scrollspy:

```js
const links = [...document.querySelectorAll('.links a, .panel a[href^="#"]')];
const spy = new IntersectionObserver(entries => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    links.forEach(a => a.getAttribute('href') === '#' + e.target.id
      ? a.setAttribute('aria-current', 'true')
      : a.removeAttribute('aria-current'));
  }
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('[data-spy]').forEach(s => spy.observe(s));
```

The negative margins leave a 5% band near the upper middle of the viewport. Only one section can cross it at a time, so only one link is ever active.

The underline and header styles:

```css
.top { position: fixed; inset: 0 0 auto 0; transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease); }
.top.hidden { transform: translateY(-100%); }
.top.raised { box-shadow: var(--shadow); }
.links a::after { content: ""; position: absolute; left: 12px; right: 12px; bottom: 2px; height: 2px;
  background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform 200ms var(--ease); }
.links a[aria-current="true"]::after { transform: scaleX(1); }
[data-spy] { scroll-margin-top: var(--nav-h); }
```

Common mistakes:

- Hiding on every downward pixel, so the header twitches on a trackpad.
- Hiding the header at scroll 0 on a bounce.
- Using `position: sticky` and animating `top`. It reflows the page.
- Leaving the shadow on at the top of the page.
- Hiding the announcement with `opacity: 0` so it still takes 36px and still takes focus.
- Leaving `main` padding at 100px after the announcement is gone.
- Two active links during the handoff because the observer band is too tall.
- `aria-current="page"` on in-page section links.
- A gradient or a glow on the Start free button. It is flat cobalt.
- A second accent colour for the NEW tag. It is the same cobalt.

Rebuild order:

1. Build the fixed header with the announcement and the 64px navbar.
2. Pad `main` by the header height.
3. Add the five sections with matching ids.
4. Add the hide and reveal logic with the 8px delta.
5. Add the shadow rule.
6. Add the scrollspy and the underline.
7. Wire the dismiss button and the padding change.
8. Add the 1024 and 760 breakpoints and the menu panel.
9. Tab through the header from the bottom of the page and confirm it reveals.
10. Turn on reduced motion and confirm the header jumps instead of sliding.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
