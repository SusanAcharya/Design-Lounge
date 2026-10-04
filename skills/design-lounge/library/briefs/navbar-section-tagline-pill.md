<!-- Design Lounge Nº 398 · "Section-tagline nav pill" · designlounge.vercel.app -->

# Section-tagline nav pill

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Studied from lamalama.com: the small dark nav bar fixed at top centre whose middle text changes to a different cheeky line for each section you scroll into. The hamburger expands the same bar into a menu, and a column of small dark "( + )" cards in the top-right corner open in place. This rebuild is for **Brightwork**, a fictional product studio, on a pale stone page. The pill is 440×48px with a pixel logo, a mono caps tagline, and a burger. As each section crosses the middle of the viewport, the tagline rolls up and the next one rolls in from below ("Let's break something nice" → "Receipts, not promises" → "How the lights stay on" → "People who came back" → "Your move"). The detail worth copying is that the menu is the pill itself growing (grid-rows 0fr → 1fr), not a separate overlay, and it marks the section you are in.

## Reference behaviour

1. First frame: a stone page `#E4E6E1` showing the hero. "[ BRIGHTWORK / PRODUCT STUDIO ]" sits over a 104px heavy headline "Interfaces with a pulse, built by people who answer the phone." with "pulse" on a lime highlight. Below it, a lede and "SCROLL — THE PILL KEEPS UP".
2. The pill is fixed 14px from the top, centred, 440×48, `#111311`, radius 6. Left: a 22px pixel logo (link to top). Centre: the tagline "LET'S BREAK SOMETHING NICE" in 11px mono caps. Right: a 40px burger.
3. The right stack is fixed 14px from the top and right, 220px wide, with 4px gaps: a lime "MV · BOOK A CALL WITH MIRA" link, a dark "STUDIO REEL ( + )" card, and a dark "HOW WE WORK ( + )" card.
4. Scrolling: an IntersectionObserver with `rootMargin: -45% 0px -50% 0px` picks the section crossing the middle band. When the section changes, the old tagline translates −110% and fades, and the new one starts at +110% and slides to 0 (420ms expo-out, opacity 300ms). The old node is removed after 440ms.
5. Burger click: the burger's lines morph into a single minus (outer bars collapse onto the middle, 240ms). The pill's drawer opens (grid-template-rows 0fr → 1fr, 420ms expo-out) and shows five 44px rows (Home 00, Work 01, Services 02, Clients 03, Contact 04) and two buttons, "BOOK A CALL" (outline) and "START A PROJECT" (lime). The page behind gets a veil, 28% ink with a 10px backdrop blur, fading in over 320ms.
6. The row for the current section shows a 6px lime square instead of its number and carries `aria-current="true"`. Focus moves to that row 120ms after opening.
7. The drawer closes on Escape (focus returns to the burger), a veil click, a row click (which also jumps to the anchor), or the burger again. Tab and Shift+Tab cycle inside the pill while it is open.
8. Stack card click: the card's body opens (grid-rows 0fr → 1fr, 380ms expo-out), and the sign reads "( – )". "Studio reel" shows a 118px striped preview with a lime sheen sweeping every 2.6s and the caption "01:12 · 2026 CUT". "How we work" shows three numbered lines. The cards open independently.
9. Work rows on the page: name, black mono chips, "( + )". Hovering a row nudges the name 8px right (240ms expo-out).
10. Reduced motion: the tagline swaps instantly, the drawer and cards open without transition, the reel sheen stops, and smooth scroll is off.

## Structure

```
1280 × 800 viewport, page scrolls
                 ┌──────────── pill 440×48, top 14, r6 ─────────────┐   ┌ stack 220w ──────┐
                 │ ▙▘  LET'S BREAK SOMETHING NICE              ☰  │   │■ BOOK A CALL …   │ lime 44
                 ├─────────────────────────────────────────────────┤   │STUDIO REEL  ( + )│ 44
   (open only)   │ Home                                        00  │   │HOW WE WORK  ( + )│ 44
                 │ Work                                        01  │   └──────────────────┘
                 │ Services                                    ■   │ ← current
                 │ Clients                                     03  │
                 │ Contact                                     04  │
                 │ [ BOOK A CALL ]          [ START A PROJECT ]    │ 40px, 8px pad
                 └─────────────────────────────────────────────────┘
 [ BRIGHTWORK / PRODUCT STUDIO ]
 Interfaces with a ▓pulse▓, built by          104px / .9 / 800
 people who answer the phone.
 Product design and front-end …                       SCROLL — THE PILL KEEPS UP
```

- `header.pill` (fixed) holds `div.bar` (`a.logo`, `div.tag[aria-hidden]` with one `span`, `button.burger[aria-expanded][aria-controls=drawer]`) and `div.drawer#drawer`. Inside the drawer: `nav[aria-label=Main] > ul.menu > li > a[data-s]` and `div.ctas` with two links.
- `div.veil` is a fixed full-screen layer under the pill (z 15 vs 20).
- `aside.stack[aria-label="Quick links"]` holds `a.call` and two `div.card[data-open]`, each with a `button[aria-expanded][aria-controls]` and `div.body`.
- `main` holds `section[id][data-tag]`: top, work, services, clients, contact. Each is at least 92vh tall (the hero 100vh) with a 1px bottom rule.

## Tokens

```css
:root {
  --bg: #E4E6E1;        /* page */
  --ink: #111311;       /* page text, chips */
  --ink-2: #4A4F4A;     /* labels, lede */
  --line: #C9CCC5;      /* page rules */
  --pill: #111311;      /* pill, cards */
  --pill-2: #1E211E;    /* row and burger hover */
  --pill-line: #2C302C; /* rules inside pill and cards */
  --on-pill: #E9ECE6;   /* text on pill */
  --on-pill-2: #8E958D; /* row numbers, ( + ) signs */
  --lime: #C8F04A;      /* primary CTA, current marker, highlight, focus */
  --sans: "Schibsted Grotesk", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --r: 6px; --pad: 32px;
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
}
```

Fixed sizes: pill 440×48, bar padding 0 6px 0 14px, burger 40×40, menu rows 44px with 22px inset, CTA buttons 40px, stack 220px wide with 44px card heads and 4px gaps.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Tagline, labels, chips, CTAs, card heads | IBM Plex Mono | 11px | 500 | 1 | 0.08em | Upper |
| Menu rows | Schibsted Grotesk | 15px | 400 | 44px row | 0 | Title |
| Hero headline | Schibsted Grotesk | 104px | 800 | 0.9 | −0.045em | Sentence |
| Section statement | Schibsted Grotesk | 40px | 500 | 1.12 | −0.02em | Sentence |
| Work row name | Schibsted Grotesk | 22px | 500 | 1.45 | 0 | Title |
| Contact headline | Schibsted Grotesk | 96px | 800 | 0.9 | −0.045em | Sentence |
| Manifesto lines | Schibsted Grotesk | 13px | 400 | 1.35 | 0 | Sentence |

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Tagline out | section change | translateY, opacity | 0 → −110%, 1 → 0 | 420ms expo / 300ms | instant replace |
| Tagline in | section change | translateY, opacity | 110% → 0, 0 → 1 | 420ms expo / 300ms | instant |
| Drawer | burger | grid-template-rows | 0fr ↔ 1fr | 420ms expo | instant |
| Burger → minus | burger | ::before / ::after translateY, opacity | ±5px → 0, 1 → 0 | 240ms `--ease` | instant |
| Veil | burger | opacity (blur 10px fixed) | 0 ↔ 1 | 320ms `--ease` | instant |
| Menu row hover | hover / focus | padding-left, background | 22 → 28px | 240ms expo / 160ms | instant |
| Stack card | click | grid-template-rows | 0fr ↔ 1fr | 380ms expo | instant |
| Reel sheen | loop | left | −40% → 110% | 2.6s `--ease` infinite | none |
| Work row name | hover | translateX | 0 → 8px | 240ms expo | instant |

## States

- Burger resting: three 16×1.5px bars. Hover: `--pill-2` square behind. Open: a single bar (minus), `aria-expanded="true"`, label "Close menu".
- Menu row resting: `--on-pill` text, number in `--on-pill-2`. Hover and focus: `--pill-2` fill, 6px extra indent. Current section: the number is replaced by a 6px lime square, `aria-current="true"`.
- CTAs: outline (1px `--pill-line`) and lime fill. Hover: brightness 1.1.
- Stack card closed: "( + )". Open: "( – )", `aria-expanded="true"`, body visible.
- Focus-visible: 2px lime outline, 2px offset, 4px radius. Lime reads on both the dark pill and the stone page.
- Veil open: the page under it does not receive clicks except to close.

## Accessibility

- The pill is a `header`. The menu links are inside `nav[aria-label="Main"]`, in the drawer, so they are only in the tab order when open. Collapsed rows have zero height and `overflow: hidden`. For a stricter build, add `inert` to the drawer when closed.
- The burger is a `button` with `aria-expanded`, `aria-controls="drawer"`, and an `aria-label` that toggles between "Open menu" and "Close menu".
- On open, focus goes to the current section's row. While open, Tab cycles inside the pill. Escape closes and returns focus to the burger.
- The tagline is decorative flavour and `aria-hidden`. The current section is conveyed by `aria-current` on the menu row.
- Stack cards are disclosure buttons (`aria-expanded`, `aria-controls`). The "( + )" sign is `aria-hidden`.
- Contrast: `#E9ECE6` on `#111311` is about 16:1, `#8E958D` on `#111311` about 6:1, ink on lime about 15:1, and ink on stone about 15:1.
- Targets: burger 40×40, rows 44px, CTAs 40px, card heads 44px.

## Responsive rules

- ≥1280: as specified.
- 1024: the same. The stack still fits beside the pill (440 + 220 + gutters).
- ≤900: the stack hides. Move "Book a call" into the drawer CTAs, which already have it. The hero headline is 64px, the contact headline 60px, and the grids go to two columns. Work rows drop their chips.
- ≤520: the pill spans the width with 12px insets (`left: 12px; right: 12px; width: auto`), `--pad` is 16px, the headline 44px, the statement 28px, services one column.
- The tagline never wraps. It is a single line in a 14px-tall clipping box. Keep taglines under about 30 characters so they fit the 440px pill.

## Acceptance checklist

### Always

- [ ] One fixed pill, top centre, with a logo, a single-line tagline, and a burger.
- [ ] The tagline changes only when a different section crosses the middle band. The old line rolls up and the new one rolls in from below.
- [ ] The menu is the pill growing (grid-rows 0fr → 1fr), not a separate full-screen overlay.
- [ ] The current section is marked in the menu with `aria-current` and a visual marker that is not just colour.
- [ ] Escape, veil click, and row click close the menu. Focus returns to the burger on Escape.
- [ ] Focus is trapped in the open pill.
- [ ] Stack cards are independent disclosures with `aria-expanded` and a "( + )" / "( – )" sign.
- [ ] The page behind the open menu is veiled and blurred.
- [ ] Reduced motion removes every transition and the sheen loop.
- [ ] No horizontal overflow at 375px.

### This demo

- [ ] The pill is 440×48, `#111311`, radius 6, 14px from the top.
- [ ] Taglines: "Let's break something nice" / "Receipts, not promises" / "How the lights stay on" / "People who came back" / "Your move".
- [ ] Menu rows: Home 00, Work 01, Services 02, Clients 03, Contact 04, 44px each.
- [ ] CTAs: "BOOK A CALL" outline and "START A PROJECT" lime `#C8F04A`.
- [ ] The stack is 220px wide: "BOOK A CALL WITH MIRA" (lime), "STUDIO REEL ( + )", "HOW WE WORK ( + )".
- [ ] The headline is Schibsted Grotesk 800 at 104px, with "pulse" highlighted lime.

## Implementation notes

**1. Roll the tagline with two spans.** Never animate a single node's text. Insert the next span below, force a reflow, then move both.

```js
function setTag(text) {
  if (current.textContent === text) return;
  const next = document.createElement('span');
  next.textContent = text; next.className = 'below';
  box.appendChild(next);
  next.offsetWidth;                         // commit the start position
  current.classList.add('above');
  next.classList.remove('below');
  const old = current; setTimeout(() => old.remove(), 440);
  current = next;
}
```

```css
.tag { height: 14px; overflow: hidden; position: relative; }
.tag span { position: absolute; inset: 0 0 auto; transition: transform 420ms var(--expo), opacity 300ms var(--ease); }
.tag .below { transform: translateY(110%); opacity: 0; }
.tag .above { transform: translateY(-110%); opacity: 0; }
```

**2. Section detection with a thin middle band.** `rootMargin: '-45% 0px -50% 0px'` leaves a 5% strip just above centre, so exactly one section intersects at a time and short sections still register.

**3. Grow the pill with grid rows.** Animating `height: auto` does not work. A one-row grid going from `0fr` to `1fr`, with an `overflow: hidden` child, animates to the content's real height.

```css
.drawer { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 420ms var(--expo); }
.pill.open .drawer { grid-template-rows: 1fr; }
.drawer > div { overflow: hidden; }
```

Common mistakes:

- Making the menu a full-screen takeover. The point is the small bar becoming the menu.
- Updating the tagline on every scroll event instead of on section change.
- Long taglines that wrap or get cut with an ellipsis. Write them short.
- Rounding the pill to a full capsule. It is a 6px-radius bar.
- Leaving drawer links focusable while closed (zero height but still tabbable). Use the open state or `inert`.
- Blurring the page without dimming it. The 28% ink veil is what makes the menu read.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
