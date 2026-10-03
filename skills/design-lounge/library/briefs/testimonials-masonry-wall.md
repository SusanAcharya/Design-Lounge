<!-- Design Lounge Nº 409 · "Testimonials masonry wall" · designlounge.vercel.app -->

# Testimonials masonry wall

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A testimonials section for **Pressroom**, a print proofing tool for small studios. Twelve short letters sit in a 3-column masonry made with CSS `columns`, not a grid. The cards come in four kinds: a big coral featured quote, a plain quote, a quote with one coral marked phrase, and a post card with a handle and a date. The wall is cut off at the bottom by a soft fade, and a **Show more letters** button opens the rest. It looks like a riso print: cream paper with a dot grain, black ink, one fluoro coral. The detail worth copying is the mix of card kinds inside one column flow, so the wall reads as a pinboard and not a row of identical boxes.

This is not `testimonials-wall-grid`. That one is a fixed CSS grid with spans and a hover lift. This one is free column flow, a fade, and an expand.

## Reference behaviour

1. First frame: a header row and the wall. The header has a kicker "LETTERS TO PRESSROOM" with a 10px coral dot, a 56px serif heading "Proofed on Thursday, *printed* on Friday.", and on the right a tally: "212" at 40px over "studios writing back / Avg. 4.8 / 5 · since 2023".
2. The word *printed* is italic with a coral band behind its lower 30%. It is the only coral in the heading.
3. Under a 1.5px black rule, the wall starts. Column 1 starts with the coral featured card. Columns 2 and 3 start with plain and marked quotes. A post card is visible in the first frame, partly faded.
4. The wall is capped at `calc(100vh - 262px)`, never less than 420px. The bottom 220px fades out with a mask, so the paper grain shows through the fade.
5. Under the wall, a row: a 1.5px black line, the button, a 1.5px black line. The button overlaps the fade by 28px.
6. Click **Show more letters**: the cap lifts to 3200px over 560ms with expo-out. The fade is removed. The chevron turns 180°. The label becomes **Show fewer**. `aria-expanded` becomes `true`.
7. Click **Show fewer**: the cap comes back, the fade returns, the label resets, and the wall scrolls back to its top so the reader is not left below a short section.
8. Hover the button: it moves up-left 2px and its coral offset shadow grows from 4px to 6px. Press: it moves down-right 2px and the shadow drops to 1px.
9. Cards do not move, flip, or link. They are text.
10. Reduced motion: the height change is instant, the chevron turns with no transition, and the button does not move on hover. Smooth scroll on collapse becomes instant.

## Structure

```
1280 × 800, section padding 40px 56px 32px, max-width 1280px
┌──────────────────────────────────────────────────────────────────────┐
│ ● LETTERS TO PRESSROOM                                         212   │
│ Proofed on Thursday, printed on Friday.     studios writing back     │
│ 56px serif                                  Avg. 4.8 / 5 · since 2023│
├══════════════════════════════════════════════════════════════════════┤ 1.5px ink rule, 20px under
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │ 24px gap
│ │ FEATURED coral  │  │ plain quote     │  │ marked quote    │        │
│ │ 34px serif      │  │                 │  │                 │        │
│ │ 6px ink shadow  │  ├─────────────────┤  ├─────────────────┤        │
│ └─────────────────┘  │ marked quote    │  │ plain quote     │        │
│ ┌─────────────────┐  │                 │  ├─────────────────┤        │
│ │ post card       │  ├─────────────────┤  │ post card       │        │
│ │ (fading)        │  │ post (fading)   │  │ (fading)        │        │
│ └ ─ ─ ─ ─ ─ ─ ─ ─ ┘  └ ─ ─ ─ ─ ─ ─ ─ ─ ┘  └ ─ ─ ─ ─ ─ ─ ─ ─ ┘        │ mask fade 220px
│ ─────────────────────[ SHOW MORE LETTERS v ]──────────────────────── │ 44px button
└──────────────────────────────────────────────────────────────────────┘
  3 columns, column-gap 20px, card margin-bottom 20px
```

- `<section aria-labelledby>` wraps everything. The heading is an `h2` because this is a page section.
- `.head` is a two-column grid: `minmax(0,1fr) auto`. Left: kicker `p` and `h2`. Right: tally `p`.
- `.wall` is the clip box. It holds `max-height`, `overflow: hidden`, and the mask. It has an `id` for `aria-controls`.
- `.cols` sits inside `.wall` and holds `columns: 3`. Keep these two elements apart. See Implementation notes.
- Plain, marked and featured cards are `figure` > `blockquote` + `figcaption`.
- Post cards are `article` with `aria-label="Post by <name>"`, a `header` (avatar, name, handle), the text, and a `footer` (date, reply count).
- `.more` is a flex row with the button and two pseudo-element lines.

## Tokens

```css
:root {
  /* colour */
  --paper: #f2ead9;        /* page */
  --card: #fbf6ea;         /* card surface */
  --ink: #16130f;          /* text, borders, rules */
  --ink-2: #4a443b;        /* kicker, tally, secondary */
  --ink-3: #6b6457;        /* role, handle, date */
  --rule: #d8ccb4;         /* dashed divider inside cards */
  --coral: #ff5b4a;        /* the one accent */
  --focus: #ff5b4a;

  /* type */
  --serif: "Instrument Serif", Georgia, serif;
  --mono: "DM Mono", ui-monospace, monospace;
  --fs-display: 56px;
  --fs-featured: 34px;
  --fs-quote: 21px;
  --fs-post: 19px;
  --fs-meta: 12px;
  --fs-name: 13px;

  /* space */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px; --s-6: 24px;
  --pad-x: 56px;
  --col-gap: 20px;

  /* shape */
  --border: 1.5px solid var(--ink);
  --radius: 0;
  --shadow-feat: 6px 6px 0 var(--ink);
  --shadow-btn: 4px 4px 0 var(--coral);

  /* motion */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --t-micro: 160ms;
  --t-fade: 240ms;
  --t-expand: 560ms;
}
```

The paper grain is two dot layers on `body`:

```css
background-image:
  radial-gradient(rgba(22,19,15,.09) .7px, transparent .8px),
  radial-gradient(rgba(255,91,74,.07) .7px, transparent .8px);
background-size: 4px 4px, 7px 7px;
background-position: 0 0, 2px 3px;
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Kicker | DM Mono | 12px | 400 | 1.45 | 0.14em | upper |
| Heading | Instrument Serif | 56px | 400 | 0.98 | -0.015em | sentence |
| Tally number | Instrument Serif | 40px | 400 | 1 | 0 | — |
| Tally text | DM Mono | 12px | 400 | 1.7 | 0.04em | sentence |
| Featured quote | Instrument Serif | 34px | 400 | 1.06 | -0.015em | sentence |
| Quote | Instrument Serif | 21px | 400 | 1.22 | -0.005em | sentence |
| Post text | Instrument Serif | 19px | 400 | 1.28 | 0 | sentence |
| Name | DM Mono | 13px | 500 | 1.45 | 0 | — |
| Role · company | DM Mono | 12px | 400 | 1.45 | 0 | — |
| Avatar initials | DM Mono | 12px | 500 | 1 | 0.02em | upper |
| Featured tag | DM Mono | 11px | 400 | 1 | 0.14em | upper |
| Button | DM Mono | 13px | 500 | 1 | 0.08em | upper |

Rules:

- Quotes are always serif. Everything else is mono. Do not set a name in serif.
- The featured opening mark is a serif `“` at 112px with line-height 0.6, in a 46px tall box so it does not push the text down.
- Role text is one line with ellipsis. Never let it wrap under the avatar.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Wall | Show more | `max-height` | `calc(100vh - 262px)` → 3200px | 560ms | expo | instant |
| Wall | Show fewer | `max-height` | 3200px → cap | 560ms | expo | instant |
| Fade | Show more | mask | on → none | instant | — | same |
| Chevron | toggle | `rotate` | 0 → 180deg | 240ms | standard | instant |
| Button | hover | `translate`, shadow | 0 → -2px, 4px → 6px | 160ms | standard | no move |
| Button | active | `translate`, shadow | → 2px, → 1px | 160ms | standard | no move |
| Scroll | Show fewer | `scrollIntoView` | — | browser | smooth | `auto` |

There is no entrance animation. The first frame is the finished wall.

## States

- Collapsed (default): cap on, mask fade on, `aria-expanded="false"`, label "Show more letters", chevron down.
- Expanded: cap 3200px, no mask, `aria-expanded="true"`, label "Show fewer", chevron up. The button sits 8px under the last card.
- Button hover: lift 2px up-left, coral shadow 6px.
- Button active: push 2px down-right, coral shadow 1px.
- Button focus-visible: 2px coral outline, offset 3px. The coral outline sits on cream, so it reads.
- Card hover: nothing. Cards are not controls. Do not add a lift; that is the other wall.
- Empty: if there are fewer than seven letters, drop the cap, the fade and the button. Show the cards in full.
- Loading: not drawn. If letters load late, render the header and keep the wall at its 420px minimum.

## Accessibility

- Each quote card is a `figure`. The quote is a `blockquote`. The person is in `figcaption`.
- Avatar discs are `aria-hidden="true"`. The name is real text next to them.
- Post cards are `article` with `aria-label="Post by Mira Duensing"`. The handle is plain text, not a link.
- The star row is `role="img"` with `aria-label="5 out of 5"`. The five SVGs inside have no label of their own.
- The button has `aria-expanded` and `aria-controls="wall"`.
- Cards hidden under the cap are still in the DOM and still read by a screen reader. That is fine because they hold no controls. If you add links inside cards, set `inert` on cards that are fully under the cap.
- Contrast: `#16130f` on `#fbf6ea` is about 17:1. `#6b6457` on `#fbf6ea` is about 5.4:1. Ink on coral `#ff5b4a` is about 6:1. Do not put white text on the coral.
- The marked phrase has a 2px ink offset shadow as well as the coral fill, so it is not colour alone.
- Button height 44px. Tab order: button only, since cards are not focusable.

## Responsive rules

- ≥1280: three columns, 56px side padding, heading 56px, cap `calc(100vh - 262px)`.
- 1024: same three columns. The cards narrow. Nothing else changes.
- 768 (up to 1023): two columns, side padding 32px, heading 46px. The featured card stays first in column 1.
- <640: one column, side padding 20px. The header stacks: heading 38px, then the tally on one line with "212" at 32px inline. Cap becomes `calc(100vh - 300px)`. Featured quote drops to 28px.
- At every width, `scrollWidth` equals the viewport. The clip box gets 8px of right padding and -8px margin so the 6px featured shadow is not cut.
- Never switch to a horizontal scroll strip on phones. The wall stacks.

## Acceptance checklist

### Always

- [ ] The wall is CSS `columns`, on an inner element, inside a separate clip element.
- [ ] Cards use `break-inside: avoid` and never split across columns.
- [ ] Four card kinds appear: featured, plain, marked phrase, post.
- [ ] Exactly one featured card, and it is first in reading order.
- [ ] The fade is a mask on the clip box, not a coloured overlay. The grain shows through.
- [ ] The button toggles `aria-expanded` and its label, and is at least 44px tall.
- [ ] Collapsing scrolls the wall back into view.
- [ ] One accent colour. Coral is used for the featured card, marks, avatar fills, the button shadow and focus only.
- [ ] Three columns at 1024 and up, two at 768, one under 640. No horizontal scroll at 390.
- [ ] Reduced motion makes the expand instant and stops the button moving.

### This demo

- [ ] Heading reads "Proofed on Thursday, printed on Friday." with *printed* italic on a coral band.
- [ ] Tally reads "212" over "studios writing back" and "Avg. 4.8 / 5 · since 2023".
- [ ] Twelve letters. The featured one is Hana Vlasák, Founder · Kopf & Vlasák Press, tagged "STUDIO OF THE YEAR".
- [ ] Three post cards: @mira.prints (14 Mar 2026, 18 replies), @dele.makes.books (2 Feb 2026, 41 replies), @solherran (27 Jan 2026, 9 replies).
- [ ] Three marked phrases: "right on the spread", "what a bleed is", "a week to an afternoon".
- [ ] Button reads "Show more letters", then "Show fewer".

## Implementation notes

**1. Keep the columns away from the cap.** If `columns` and `max-height` sit on the same element, the browser does not cut the columns. It makes more columns to the right and hides them. Cards vanish sideways. Put the cap on a wrapper.

```css
.wall {
  max-height: calc(100vh - 262px);
  min-height: 420px;
  overflow: hidden;
  padding-right: 8px; margin-right: -8px;   /* room for the 6px shadow */
  -webkit-mask-image: linear-gradient(#000 calc(100% - 220px), transparent calc(100% - 24px));
          mask-image: linear-gradient(#000 calc(100% - 220px), transparent calc(100% - 24px));
  transition: max-height 560ms var(--expo);
}
.wall.open { max-height: 3200px; -webkit-mask-image: none; mask-image: none; }
.cols { columns: 3; column-gap: 20px; }
.card { break-inside: avoid; margin: 0 0 20px; }
```

**2. Do not fade with a paper-coloured gradient box.** A flat `#f2ead9` overlay hides the dot grain and shows a clear rectangle at the bottom. The mask fades the cards themselves.

**3. The toggle.** Keep it small. Scroll back on collapse.

```js
const wall = document.getElementById('wall');
const btn = document.querySelector('.btn');
btn.addEventListener('click', () => {
  const open = btn.getAttribute('aria-expanded') !== 'true';
  btn.setAttribute('aria-expanded', String(open));
  wall.classList.toggle('open', open);
  btn.querySelector('span').textContent = open ? 'Show fewer' : 'Show more letters';
  if (!open) wall.scrollIntoView({
    block: 'start',
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  });
});
```

**4. The riso mark.** A coral fill with a small ink offset, like two plates printed a hair apart.

```css
mark { background: var(--coral); color: var(--ink); padding: 0 3px; box-shadow: 2px 1px 0 rgba(22,19,15,.85); }
h2 em { font-style: italic; background: linear-gradient(transparent 62%, var(--coral) 62% 92%, transparent 92%); padding: 0 4px; }
```

**5. Card order sets the first frame.** CSS columns fill top to bottom, then move right. Put the featured card first and a post card second, so column 1 shows both kinds. Check that columns 2 and 3 start with a plain and a marked quote. Reorder the source, not the visual order, so reading order still matches.

Common mistakes:

- Using CSS grid with `grid-row: span` and calling it masonry. That is the other piece.
- Equal-height cards. The point is uneven height.
- A real social network logo on the post cards. Use a handle and a date only.
- A second accent colour for the post cards.
- Rounded corners. Corners here are square; the border is 1.5px ink.
- Drop shadows on every card. Only the featured card and the button have an offset shadow.
- Animating `height: auto`. Animate `max-height` between two numbers.
- Leaving the fade on after expanding.
- Hiding cards with `display: none` and showing them on click. The wall must keep its column flow when it opens.

Rebuild order:

1. Paper background and grain.
2. Header row with kicker, heading, tally, and rule.
3. Clip box and inner columns with twelve cards.
4. The four card kinds.
5. Mask fade and the button row.
6. Toggle script and scroll back.
7. Breakpoints at 1023 and 639.
8. Reduced motion.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
