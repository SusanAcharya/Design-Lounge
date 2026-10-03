<!-- Design Lounge Nº 260 · "Hamburger circle reveal" · designlounge.vercel.app -->

# Hamburger circle reveal

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The phone header of a motion and type studio site, "Ferro", from Lisboa. A cream page holds a logo and a round black 44px menu button. Tapping the button turns its three lines into an X and grows a black panel out of the button as a circle. The circle covers the whole screen in 500ms with an expo-out curve. Five huge uppercase links rise out of their rows one after another, each with a small vermilion index number. A contact email and three social links fade in last. The detail worth copying is that the circle starts at the exact centre of the button, so the menu looks like it pours out of the control you pressed.

This is not `mobile-fullscreen-menu`. That piece recolours the page with no panel edge and uses a serif. This one is a hard black panel with a visible circular edge while it grows, and a wide grotesk.

## Reference behaviour

1. First frame (hero): the menu is already open. The body has `.open`, the button shows the X on a vermilion disc, `aria-expanded="true"`, and the page behind is `inert`. No animation plays on load. Transitions are switched on two animation frames after load.
2. Tap the X: the five links drop back into their rows over 240ms with an expo-in curve. The bottom link leaves first, 30ms apart. The contact block fades out over 160ms.
3. 160ms after the tap, the circle shrinks back into the button over 500ms with an expo-in curve. The panel becomes `visibility: hidden` at 660ms.
4. At the same time the X turns back into three lines over 300ms, and the disc goes from vermilion back to black.
5. The logo turns from cream back to ink with a 380ms delay, so it never sits ink-on-black while the circle is still large.
6. Focus returns to the menu button. The page loses `inert`. Body scroll unlocks.
7. Tap the menu button: the button centre is measured. The circle radius is set to the distance from that centre to the farthest screen corner. The panel clip-path grows from `circle(0px)` to `circle(r)` over 500ms `cubic-bezier(.16,1,.3,1)`.
8. The X forms over 300ms. The top line moves down 6px and turns 45 degrees. The bottom line moves up 6px and turns -45 degrees. The middle line fades over 160ms and scales to 20% width.
9. Each link rises from `translateY(105%)` to `0` over 520ms expo-out. Link 1 starts at 180ms, then each next link starts 50ms later: 180, 230, 280, 330, 380ms.
10. The contact block rises 12px and fades in over 420ms with a 460ms delay.
11. 200ms after opening, focus moves to the first link, "Work".
12. Tab and Shift+Tab cycle through the menu button, five links, the email and three social links. Focus never reaches the page behind.
13. Esc closes the menu exactly like the X does.
14. Tapping a link marks it current (`aria-current="page"`, arrow shown) and closes the menu. The demo has no routing.
15. Hover or focus on a link turns its text vermilion and slides a 24px arrow in from 8px left over 200ms.

## Structure

```
390 x 844 (54px status reserve on top, 84px browser bar drawn over the bottom)
+----------------------------------------+
|                                        | 54px reserve
| FERRO  LISBOA                     (X)  | fixed header, 60px, gutter 20px
|                                        | panel top padding 24px
| INDEX                         05 PAGES | 11px mono kicker + 1px rule
| 01  WORK                          ->   | row 72px, 40px display
| 02  REEL                               | 1px rule rgba(242,237,226,.16)
| 03  STUDIO                             |
| 04  JOURNAL                            |
| 05  CONTACT                            |
|                                        | flexible gap (margin-top:auto)
| NEW PROJECTS                           | 11px mono
| ola@ferro.studio                       | 22px, 2px vermilion underline
| INSTAGRAM   VIMEO   LINKEDIN           | 12px mono, 44px tall, gap 24px
|                                        | bottom padding 84 + 20px
+----------------------------------------+
row grid: 32px index | minmax(0,1fr) word | 24px arrow
```

- `<header class="bar">` is fixed to the top, `z-index: 30`, height `54 + 60px`. It holds `<a class="logo">` (wordmark plus a mono city label) and `<button class="burger" aria-expanded aria-controls="menu">` with three `<span>` lines.
- The header sits above the panel, so the same button is the opener and the closer. Do not render a second X inside the panel.
- The header background is the page colour while closed and transparent while open.
- `<main class="page">` is the page: kicker, a 58px condensed `h1`, a lede, a four-row work list and a black call-to-action. It gets `inert` while the menu is open.
- `<nav class="menu" aria-label="Main menu">` is fixed, `inset: 0`, `z-index: 20`, a flex column with `overflow-y: auto`. It holds a kicker row, `<ul class="links">` and `<div class="foot">`.
- Each `<li>` has `overflow: hidden` and a bottom rule. The `<a>` inside it is what moves, so the word rises out of its own row.
- Each link carries its index as a CSS custom property, `style="--i:0"` to `--i:4`, which drives the stagger.
- The foot holds a mono label, a `mailto:` link and a `<ul aria-label="Elsewhere">` of three text links.

### Content

- Logo: "FERRO", city label "Lisboa".
- Page kicker: "Motion & type studio · Est. 2014". Headline: "Type that refuses to sit still." with "refuses" underlined in vermilion.
- Lede: "Title sequences, brand motion and kinetic identities for broadcasters, festivals and the occasional opera house."
- Work rows: Halvard Opera 2026, Nodo Telecom 2025, Cinemateca Sul 2025, Pano Paper Co. 2024, each with a one-line note.
- Menu kicker: "Index" and "05 pages".
- Links: 01 Work (current), 02 Reel, 03 Studio, 04 Journal, 05 Contact.
- Foot: "New projects", "ola@ferro.studio", then Instagram, Vimeo, LinkedIn.

## Tokens

```css
:root {
  /* colour: cream page, black panel, one vermilion accent */
  --page: #efe9dc;          /* page background */
  --ink: #121110;           /* page text, closed button */
  --ink-2: #4a4640;         /* page secondary text */
  --line: #d3cab8;          /* page hairlines */
  --panel: #121110;         /* menu panel */
  --on-panel: #f2ede2;      /* menu text */
  --on-panel-2: #a39d92;    /* menu labels, social links */
  --rule: rgba(242, 237, 226, .16); /* menu row rules */
  --accent: #ff4a1c;        /* index numbers, X disc, arrow, email underline, focus */

  /* type */
  --display: "Archivo", system-ui, sans-serif;   /* variable, wdth 62..125 */
  --mono: "JetBrains Mono", ui-monospace, monospace;

  /* layout */
  --top: 54px;              /* status bar reserve */
  --bar-h: 60px;            /* header row */
  --chrome-bottom: 84px;    /* browser bar drawn over the frame; 0 in production */
  --gutter: 20px;

  /* motion */
  --std: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --expo-in: cubic-bezier(.7, 0, .84, 0);
  --t-reveal: 500ms;
  --t-link: 520ms;
  --stagger: 50ms;

  /* circle geometry, overwritten by JS */
  --cx: calc(100% - 42px);
  --cy: 84px;
  --r: 900px;
}
```

## Typography

| Role | Family | Size / line | Weight | Width | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Menu link | Archivo | 40px / 1 | 800 | 112% | -0.02em | upper |
| Index number | JetBrains Mono | 11px / 1 | 500 | n/a | 0.04em | digits |
| Kicker, labels | JetBrains Mono | 11px / 1 | 500 | n/a | 0.08em | upper |
| Wordmark | Archivo | 24px | 900 | 125% | -0.03em | upper |
| City label | JetBrains Mono | 10px | 500 | n/a | 0.08em | upper |
| Email | Archivo | 22px | 600 | 100% | -0.01em | lower |
| Social links | JetBrains Mono | 12px | 500 | n/a | 0.08em | upper |
| Page headline | Archivo | 58px / 0.9 | 900 | 75% | -0.02em | upper |
| Page body | Archivo | 15–16px / 1.5 | 400 | 100% | 0 | sentence |

Load Archivo with its width axis (`wdth,wght@62..125,400..900`) and set width with `font-stretch`. The menu links are wide (112%), the page headline is narrow (75%). That contrast between the two states is part of the look. Keep links on one line with `white-space: nowrap`.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Delay |
| --- | --- | --- | --- | --- | --- | --- |
| Panel | open | clip-path | circle(0px at cx cy) → circle(r at cx cy) | 500ms | expo-out | 0 |
| Panel | close | clip-path | circle(r) → circle(0px) | 500ms | expo-in | 160ms |
| Panel | close | visibility | visible → hidden | 0 | step | 660ms |
| Links | open | transform | translateY(105%) → 0 | 520ms | expo-out | 180ms + i × 50ms |
| Links | close | transform | 0 → translateY(105%) | 240ms | expo-in | (4 − i) × 30ms |
| Foot | open | opacity, transform | 0, 12px → 1, 0 | 420ms / 520ms | std / expo-out | 460ms |
| Foot | close | opacity, transform | 1 → 0 | 160ms | std | 0 |
| Burger lines | toggle | transform, opacity | lines → X | 300ms (middle fade 160ms) | expo-out | 0 |
| Burger disc | toggle | background | ink ↔ vermilion | 300ms | std | 0 |
| Logo | close | color | cream → ink | 240ms | std | 380ms |
| Link arrow | hover, focus | opacity, transform | 0, −8px → 1, 0 | 200ms | expo-out | 0 |

Reduced motion: drop the clip-path entirely. The panel fades `opacity 0 → 1` over 150ms. Links and foot do not move; they are simply visible. The burger lines swap with no transition. Focus moves to the first link at once.

## States

- Closed: cream page, black 44px disc with three cream 20×2px lines at 15, 21 and 27px from the top.
- Open: black panel over everything, vermilion disc with an ink X, cream wordmark.
- Link resting: cream text, index in vermilion, arrow hidden.
- Link hover and focus-visible: text vermilion, arrow visible. Focus ring is a 2px vermilion outline inset by 2px so it stays inside the row.
- Link current: `aria-current="page"`, arrow visible in vermilion, text stays cream.
- Burger focus-visible: 2px outline, offset 3px. Ink outline on the cream page, cream outline on the black panel.
- Email: 2px vermilion underline always. Social link hover: grey to cream.
- Disabled, loading, empty, error: not used.

## Accessibility

- The button is a real `<button>` with `aria-controls="menu"` and `aria-expanded`. Its `aria-label` switches between "Open menu" and "Close menu".
- The panel is a `<nav aria-label="Main menu">`. It is hidden with `visibility: hidden` when closed, so its links are not focusable and not read.
- While open, `<main>` gets `inert` and the body gets `overflow: hidden`.
- Focus trap: on Tab, build the list `[button, ...menu links]`. Wrap from last to first and from first to last on Shift+Tab. If focus is somehow outside, send it to the button.
- Esc closes from anywhere while open.
- On close, focus goes back to the button. On open, focus goes to the first link after 200ms (0ms with reduced motion).
- Index numbers are visible text inside the link. They read as "01 Work". If a product wants them silent, wrap them in `aria-hidden="true"`.
- Arrows are `aria-hidden` SVGs.
- Contrast: `#f2ede2` on `#121110` is about 16:1. `#a39d92` on `#121110` is about 7:1. `#ff4a1c` on `#121110` is about 6:1. Ink `#121110` on the vermilion disc is about 6:1.
- Hit targets: the button is 44×44. Menu rows are 72px tall and full width. Email and social links are 44px tall.

## Responsive rules

- At 360 wide, "JOURNAL" and "CONTACT" still fit on one line at 40px and 112% width. Do not shrink the type. If a product adds a longer word, drop that link to 100% width before you drop the size.
- The circle radius is measured from the button centre to the farthest corner on every open and on resize, so the reveal timing feels the same on any phone.
- Short screens (under 700px tall): the panel scrolls (`overflow-y: auto`). Rows keep 72px. The foot follows the links instead of pinning.
- At tablet width and above, this menu is not used. Show the five links inline in the header instead.
- The bottom padding is `--chrome-bottom + 20px`. In the Lounge frame `--chrome-bottom` is 84px because the browser bar is drawn over the bottom of the page. In production set it to `max(20px, env(safe-area-inset-bottom))`.
- Do not draw a status bar or a URL bar. The paddings are the clearance.

## Acceptance checklist

### Always

- [ ] The menu button is 44×44 and its three lines become an X in 300ms.
- [ ] The panel grows as a circle from the button centre, not from a screen corner.
- [ ] The radius reaches the farthest corner; no corner is left uncovered at the end.
- [ ] Opening uses expo-out over 500ms. Closing reverses: links leave first, then the circle shrinks with expo-in.
- [ ] Links rise out of their own rows with a 50ms stagger, from the top link down.
- [ ] Body scroll is locked and the page is `inert` while open.
- [ ] Tab cycles only through the button and the menu links. Esc closes. Focus returns to the button.
- [ ] Reduced motion replaces the circle with a 150ms fade and removes all movement.
- [ ] Every hit target is at least 44px.
- [ ] One accent colour only. Nothing else in the panel is coloured.

### This demo

- [ ] First frame shows the menu open with "Work" current.
- [ ] Links read 01 Work, 02 Reel, 03 Studio, 04 Journal, 05 Contact at 40px Archivo 800.
- [ ] The panel is `#121110`, text `#f2ede2`, accent `#ff4a1c`, page `#efe9dc`.
- [ ] The email is "ola@ferro.studio" with a 2px vermilion underline.
- [ ] Social links read Instagram, Vimeo, LinkedIn in 12px mono caps.

## Implementation notes

Measure the circle every time it opens. Hard-coding `150vmax` makes the circle cover the screen long before the 500ms ends, so the expo curve looks flat.

```js
function geometry() {
  const b = btn.getBoundingClientRect();
  const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
  const r = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
  body.style.setProperty('--cx', cx + 'px');
  body.style.setProperty('--cy', cy + 'px');
  body.style.setProperty('--r', Math.ceil(r) + 'px');
}
```

Put the open timing on the open selector and the close timing on the base selector. The browser uses the transition of the state you are going to, which is how one set of rules gives you a different close.

```css
.menu {
  clip-path: circle(0px at var(--cx) var(--cy));
  visibility: hidden;
  transition: clip-path var(--t-reveal) var(--expo-in) 160ms, visibility 0s linear 660ms;
}
.open .menu {
  clip-path: circle(var(--r) at var(--cx) var(--cy));
  visibility: visible;
  transition: clip-path var(--t-reveal) var(--expo), visibility 0s;
}
.links li { overflow: hidden; }
.links a { transform: translateY(105%); transition: transform 240ms var(--expo-in) calc((4 - var(--i)) * 30ms); }
.open .links a { transform: none; transition: transform var(--t-link) var(--expo) calc(180ms + var(--i) * var(--stagger)); }
```

The burger X, from three spans 6px apart:

```css
.burger span { position: absolute; left: 12px; width: 20px; height: 2px; transition: transform 300ms var(--expo), opacity 160ms; }
.burger span:nth-child(1) { top: 15px } .burger span:nth-child(2) { top: 21px } .burger span:nth-child(3) { top: 27px }
.open .burger span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
.open .burger span:nth-child(2) { opacity: 0; transform: scaleX(.2); }
.open .burger span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
```

Start in the open state without a flash of animation: render `.open` in the markup with a `.preload` class that sets `transition: none` on everything, then remove `.preload` after two `requestAnimationFrame` calls.

Common mistakes:

- Growing the circle from the top-right corner of the screen instead of the button centre.
- Putting the X inside the panel and hiding the real button. Keep one control on top.
- Animating `width`/`height` of a round div with `border-radius` instead of `clip-path`. It reflows the page and blurs the edge.
- Fading the links instead of letting them rise out of a clipped row.
- Forgetting `visibility: hidden` at the end of the close, which leaves invisible links in the tab order.
- Letting the logo turn ink while the panel is still black, so it disappears for 400ms.
- Using the vermilion on body text on the cream page. It is about 3:1 there. Use it only as an underline or a fill.
- A second accent colour for hover. Hover uses the same vermilion.
- Leaving `overflow: hidden` on the body after close.

Rebuild order:

1. Build the page and the fixed header with the black disc button.
2. Build the panel as a static black screen with the links and foot visible.
3. Add the clip-path circle and the JS geometry.
4. Add the row clip and the staggered rise.
5. Add the reverse timings on the base selectors.
6. Add `inert`, scroll lock, the focus trap and Esc.
7. Add the reduced-motion block and check it is still complete.
8. Render the open state first with `.preload`.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
