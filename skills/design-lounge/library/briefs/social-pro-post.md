<!-- Design Lounge Nº 370 · "Professional network post" · designlounge.vercel.app -->

# Professional network post

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A post from a professional network, for an invented product called Commons, dressed in warm paper and a book serif instead of corporate blue. It reads instantly as the familiar format: author with connection degree, role and company, age with an audience globe, text clamped to three lines with "see more", a document carousel with page counter and progress bar, a reaction summary with stacked badges and counts, and the four-button bar React, Comment, Repost, Send. The detail worth copying is the reaction picker: hover React for 350ms and a pill of five coloured reactions rises with a 30ms stagger; each lifts and shows its name on hover; the one you pick takes over the React button's icon, label and colour.

## Reference behaviour

1. First frame: Priya Raman, "· 2nd", "Head of Yard Operations at Halden Freight · Rotterdam", "3d · Edited · globe". Text clamped to three lines with "see more" right-aligned below. Document on page 1 of 6, progress 1/6, Prev disabled. Summary: three badges (Like, Insightful, Celebrate), "Tomas Brandt and 1,284 others", "212 comments · 48 reposts". React reads "Like".
2. Click "see more": the clamp lifts, the button is removed, focus moves to the text.
3. Click Follow: icon becomes a check and the label "Following" in muted ink.
4. Document: Next/Prev buttons, Left/Right keys on the focused page, or a horizontal swipe over 40px change page. The track slides 380ms, the progress bar grows to (page/6), the counter reads "n / 6", the end button disables.
5. Hover the React button with a mouse for 350ms: the picker opens above it. Leaving the React area for 300ms closes it; re-entering cancels the close.
6. Hover a reaction: it lifts 6px and scales 1.18, and a dark label pill (Like, Celebrate, Support, Insightful, Curious) appears above it.
7. Click a reaction: the picker closes, React shows that icon and label in the reaction's colour with a pop, the summary reads "You, Tomas Brandt and 1,284 others", and if the reaction is not already in the badge stack it takes the first badge slot.
8. Click React without opening the picker: toggles Like on, or removes whatever reaction you had.
9. Keyboard: on React press Arrow Up to open the picker with focus on your current reaction (or Like). Left/Right move between reactions (wrapping), Enter/Space choose, Escape or Arrow Down close and return focus to React. Tab out closes it.
10. Touch: press and hold React for 450ms to open the picker without reacting.
11. Click Comment: the comment section opens and the field is focused. Click "212 comments" to toggle the section. Posting a comment prepends it as "You · Just now" and the count rolls 212 → 213.
12. Click Repost: toggles green.

## Structure

```
stage 1280×800, warm paper, card centred
┌──────────────── card 560px, radius 10, 1px line ────────────────┐
│ (52 PR)  Priya Raman · 2nd                          [+ Follow]  │
│          Head of Yard Operations at Halden Freight · Rotterdam │
│          3d · Edited · (globe)                                  │
│ text 14.5/1.5, clamped to 3 lines                               │
│                                                    see more     │
├──────── doc-top: (file) title                        6 pages ───┤
│  ┌──────────── sheet on 16:10 viewport, pad 22/26 ───────────┐  │
│  │ KICKER                                                    │  │
│  │ Big serif headline with italic ink blue word        9      │  │
│  │ FOOTER LEFT                              FOOTER RIGHT     │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ▬▬▬▬────────────────────────────────  1 / 6   (‹) (›)          │
├─────────────────────────────────────────────────────────────────┤
│ (●●●) Tomas Brandt and 1,284 others     212 comments · 48 reposts│
│ ─────────────────────────────────────────────────────────────── │
│ [Like]       [Comment]        [Repost]          [Send]           │
│  └ picker: ( Like )( Celebrate )( Support )( Insightful )( Curious )
├─────────────────────────────────────────────────────────────────┤
│ comments (hidden until opened): composer + list                 │
└─────────────────────────────────────────────────────────────────┘
```

- Card: `article` labelled by the author name.
- Document: `section` labelled with the document title; the page viewport is `tabindex="0"` with `aria-roledescription="carousel"`; each page is `role="group"` labelled "Page n of 6"; off-screen pages `aria-hidden`.
- Counter: `aria-live="polite"` so page changes are announced.
- Actions: `role="group"` of four buttons. React has `aria-haspopup`, `aria-expanded`, `aria-pressed`, and `aria-describedby` pointing at a hidden "Press Arrow Up for more reactions" hint.
- Picker: `role="toolbar" aria-label="Reactions"` of five buttons with `aria-pressed`, roving tabindex.
- Comments: `section` with a `form` (hidden label, input, submit) and a `ul`.

## Tokens

```css
:root {
  --stage: #ebe3d4;        /* page */
  --card: #fbf7ef;         /* card */
  --sunk: #f3ecdf;         /* document band, hover, comment bubbles */
  --line: #e0d5c2;
  --line-2: #cfc2ab;
  --ink: #24201b;
  --ink-2: #544d45;
  --ink-3: #71685e;
  --accent: #2f5e4b;       /* Follow, links, focus, Post, repost on */
  --accent-soft: rgba(47,94,75,.1);
  --inkblue: #2e3f7a;      /* avatar, kickers, italic words, big numerals */
  --paper: #f6eedd;        /* document sheets */
  /* reactions: each one colour, all ≥ 4.5:1 on the card */
  --r-like: #2f5e8c;
  --r-celebrate: #3d7f4f;
  --r-support: #b4492f;
  --r-insight: #93680f;
  --r-curious: #6b5a8e;
  --serif: "Newsreader", Georgia, serif;
  --sans: "Public Sans", system-ui, sans-serif;
  --r: 10px;
  --t-micro: 150ms;
  --t-picker: 260ms;
  --t-slide: 380ms;
  --hover-delay: 350ms;
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
  --ease-pop: cubic-bezier(.34,1.56,.64,1);
}
```

Sheet shadow `0 8px 20px -14px rgba(36,32,27,.5)`; picker shadow `0 12px 28px -12px rgba(36,32,27,.45)`. The card itself only has a 1px bottom lip, `0 1px 0 rgba(36,32,27,.05)`.

## Typography

| Role | Family | Size | Weight | Line-height | Notes |
| --- | --- | --- | --- | --- | --- |
| Author name | Newsreader | 17px | 600 | 1.2 | -0.005em |
| Degree | Public Sans | 13px | 400 | | `--ink-3` |
| Role | Public Sans | 13px | 400 | 1.35 | `--ink-2` |
| Age | Public Sans | 12px | 400 | | `--ink-3` |
| Body | Public Sans | 14.5px | 400 | 1.5 | 3-line clamp |
| Avatar initials | Newsreader italic | 22px | 500 | 1 | paper on ink blue |
| Doc kicker | Public Sans | 10.5px | 600 | | 0.14em uppercase, ink blue |
| Doc headline | Newsreader | clamp(22px, 5.4vw, 34px) | 500 | 1.08 | -0.015em, max 16ch |
| Doc numeral | Newsreader italic | 150px | 400 | 1 | ink blue at 13% |
| Doc quote | Newsreader italic | clamp(18px, 4.2vw, 25px) | 400 | 1.25 | max 24ch |
| Action label | Public Sans | 14px | 600 | | |
| Reaction tooltip | Public Sans | 11.5px | 600 | | card on ink pill |
| Comment author | Newsreader | 14px | 600 | | |

Serif is for people and documents; sans is for UI. Keep that split.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Picker open | hover 350ms, Arrow Up, long-press | opacity, y, scale | 0/8px/0.96 → 1/0/1 | 260ms `--ease-out` | instant |
| Reactions rise | picker open | y, opacity | 12px/0 → 0/1 | 320ms, stagger 30ms | none |
| Reaction hover | hover, focus | y, scale | 0/1 → −6px/1.18 | 200ms `--ease-pop` | instant |
| Tooltip | hover, focus | opacity | 0 → 1 | 150ms | instant |
| React icon | reaction chosen | scale | 0.5 → 1.25 → 1 | 380ms `--ease-pop` | none |
| Pages | Next, Prev, keys, swipe | translateX | −i×100% | 380ms `--ease-out` | 1ms |
| Progress | page change | width | (i/6) → (j/6) | 380ms `--ease-out` | 1ms |
| Comment count | post | y, opacity | 70%/0 → 0/1 | 320ms `--ease-out` | none |
| New comment | post | same | | 320ms | none |
| Picker close | leave 300ms, choose, Esc | reverse of open | | 260ms | instant |

## States

- React idle: "Like" in `--ink-2`, thumb icon.
- React chosen: icon and label of the reaction in its colour, `aria-pressed="true"`, label "Reacted Insightful. Press to remove."
- Picker reaction pressed: `aria-pressed="true"` on the chosen one.
- Action hover: background `--sunk`, ink darkens.
- Follow on: check icon, "Following", `--ink-3`.
- Page buttons disabled at ends: 35% opacity, no hover.
- Comment Post disabled until text: 40% opacity.
- Field focus: border `--accent`, 3px soft ring.
- Focus-visible everywhere: 2px green outline, 2px offset. On the document viewport it is an inset 2px ring.
- Collapsed text: 3-line clamp with ellipsis; "see more" is its own button below, so the label has no leading ellipsis.

## Accessibility

- React is reachable as a single button; the picker is an optional richer path. Arrow Up opens it, a hidden hint says so via `aria-describedby`.
- Picker uses a roving tabindex: only the focused reaction is `tabindex="0"`; closing resets all to −1.
- Hover timers only run for `pointerType === 'mouse'`; touch uses long-press, keyboard uses Arrow Up.
- On narrow screens the action labels hide, so each action button has its own `aria-label`.
- The page counter is a polite live region. The bar chart page has a text label with all six values.
- Contrast: body `#24201b` on `#fbf7ef` 15:1; `--ink-3` 5:1; every reaction colour used as text is ≥ 4.5:1 on the card.
- Hit targets: actions 44px tall, page buttons 36px, reactions 44px.

## Responsive rules

- ≥1280 to 768: card 560px centred; the document is 16:10 of the card width.
- <640: card `min(560px, 100%)`. At ≤480 the action labels and the repost count hide (icons only, labels kept in `aria-label`), the sheet padding drops to 16/18, the numeral to 110px, and the summary name truncates with an ellipsis.
- The headline uses `clamp()`, so it fits a 320px-wide sheet without wrapping into the footer.
- If comments push the card past the viewport, the page scrolls vertically.

## Acceptance checklist

### Always

- [ ] Header has avatar, name with degree, role with company, age with audience icon, and Follow.
- [ ] Body clamps to three lines; "see more" expands and moves focus.
- [ ] Document shows title and page total, one page at a time, progress bar, counter, and end-disabled arrows.
- [ ] Picker opens after 350ms of mouse hover, closes 300ms after leaving, and never opens on a plain click.
- [ ] Five reactions, each with its own colour, lift and tooltip on hover or focus.
- [ ] Choosing a reaction recolours React and updates the summary to start with "You".
- [ ] Clicking React with no picker toggles the default reaction or removes the current one.
- [ ] Arrow Up / Left / Right / Enter / Escape work as described; focus returns to React on close.
- [ ] Posting a comment prepends it and increments the visible count.
- [ ] Action buttons are at least 44px tall; focus is visible on everything.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Author Priya Raman, Head of Yard Operations at Halden Freight, Rotterdam.
- [ ] Document "Nine lessons from moving our yard to nights", 6 pages.
- [ ] Summary starts "Tomas Brandt and 1,284 others · 212 comments · 48 reposts".
- [ ] Reactions in order: Like, Celebrate, Support, Insightful, Curious.
- [ ] The seeded comment is from Elif Demir, Depot Manager, Kestrow Logistics.

## Implementation notes

**Hover intent with two timers.** One timer opens after 350ms, another closes 300ms after leaving. Each cancels the other. Only for mice.

```js
let tOpen, tClose;
wrap.addEventListener('pointerenter', e => {
  if (e.pointerType !== 'mouse') return;
  clearTimeout(tClose); tOpen = setTimeout(() => open(false), 350);
});
wrap.addEventListener('pointerleave', e => {
  if (e.pointerType !== 'mouse') return;
  clearTimeout(tOpen); tClose = setTimeout(() => close(false), 300);
});
```

Put the picker inside the same wrapper as the React button, so moving from the button up into the picker never fires `pointerleave`.

**Staggered rise with a CSS variable.**

```css
.picker.open .rx { animation: rise 320ms var(--ease-out) both; animation-delay: calc(var(--i) * 30ms); }
@keyframes rise { from { transform: translateY(12px); opacity: 0 } to { transform: none; opacity: 1 } }
.rx:hover, .rx:focus-visible { transform: translateY(-6px) scale(1.18); }
.rx::after { content: attr(data-label); position: absolute; bottom: calc(100% + 8px); left: 50%;
  transform: translateX(-50%); opacity: 0; transition: opacity 150ms var(--ease); }
.rx:hover::after, .rx:focus-visible::after { opacity: 1; }
```

**Badge stack.** Keep the three most common reactions as the base stack. If the user's reaction is not among them, put it first and drop the last.

```js
const base = ['like', 'insight', 'celebrate'];
const types = mine && !base.includes(mine) ? [mine, ...base.slice(0, 2)] : base;
```

**Common mistakes.**

- Opening the picker on click. Click is the fast path to the default reaction.
- Using the real network's blue, "in" mark or its exact reaction set and artwork. Commons uses its own five reactions in muted earth colours.
- Keyboard users unable to reach anything but Like.
- A clamp that cuts mid-word with a "…see more" that doubles the ellipsis.
- Making the document a real PDF. It is styled HTML pages.
- Using emoji for reactions. They are stroke SVG on solid colour circles.

**Rebuild order.**

1. Card and header with Follow.
2. Clamped body and "see more".
3. Document band, pages, progress, arrows, keys and swipe.
4. Summary row with badge stack and comment count button.
5. Action bar; React toggle.
6. Picker: hover timers, long-press, keyboard, stagger.
7. Comment section and count tick.
8. Narrow layout and reduced motion.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
