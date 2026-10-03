---
title: "Threaded conversation card"
summary: "A playful thread card: parent post with a drawn thread line through replies, a hooked expand control, a quote post, and repost or quote from any post."
platform: web
type: component
category: social
tags: [social, thread, replies, quote, comments]
styles: [playful, brutalist]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-03
palette: ["#FFE38A", "#FFFAF0", "#1D1638", "#D0391F", "#6FD3A8"]
fonts: ["Bricolage Grotesque", "DM Mono"]
related: [social-microblog-post, social-pro-post, social-photo-post]
---

# Threaded conversation card

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A thread view for an invented text network called Murmur, styled loud and friendly: butter-yellow dotted stage, cream card with a 2px ink outline and a hard 6px offset shadow, bright flat avatar discs. It reads instantly as the familiar threaded format: parent post with photos, replies stacked under it, and a continuous vertical line running from avatar to avatar. The line ends in a curved hook that points at the "Show 4 more replies" pill. One reply embeds a quoted post. The details worth copying are the line, which is drawn per post so it survives any content height, and the repost button, which offers Repost or Quote; Quote loads the post into the composer as a chip and posts a new reply carrying the quote card.

## Reference behaviour

1. First frame: header "Thread" and a mint "312 replies" pill. Parent post by juno.bakes (4h) with two painted photos and 1.2K likes, 312 replies, 48 reposts. Two replies follow: tomas.kneads, and wren.eats quoting fermentfriday. The thread line joins the three avatars and curves into the hook beside "Show 4 more replies". The composer is pinned at the bottom.
2. Hover any action: a cream tint pill appears behind it. Press scales it to 0.94.
3. Click a heart: it fills tomato and squishes (0.6×0.8 → 1.3×1.15 rotated −8° → 1), the count ticks down into place. Click again to unlike.
4. Click "Show 4 more replies": the hidden block grows from 0 to its height in 420ms, and each of the four replies fades and drops in with a 70ms stagger. The chevron flips, the label becomes "Hide replies", and the list scrolls so the first new reply is visible. The last reply is from the author with a tomato "Author" badge. Click again to collapse.
5. Collapsed replies are `inert`, so Tab skips them.
6. Click a repost button: a small menu pops with a slight −1° tilt: Repost, Quote. Focus goes to Repost; Arrow Up/Down move; Escape closes and refocuses the button.
7. Repost: the button turns green, count +1, the item reads "Undo repost".
8. Quote: the menu closes, a chip "Quoting juno.bakes: Hot take: sourdough discard pancakes…" appears above the composer with a remove button, the placeholder becomes "Add your take…", and the field takes focus.
9. Type and press Post: a new reply from "you · now" drops in at the end of the thread with the quoted post embedded below the text, gets its own working action row, and scrolls into view. The chip clears.
10. Without a quote, Post adds a plain reply. Reply buttons focus the composer. Post is disabled until there is text.

## Structure

```
stage 1280×800, #ffe38a with 22px dot grid
┌──────────── card 560 × min(752, 100%), 2px ink, radius 24, 6/6 hard shadow ─────────┐
│ Thread                                                       (312 replies) mint pill │ 52
├════════════════════════════════════════════════════════════════════════════════════ ┤
│ scroll area, pad 16/18/8                                                             │
│ (48)  juno.bakes 4h                                                                  │
│  │    Hot take: sourdough discard pancakes… 18/1.4 500                               │
│  │    [ pancakes photo ][ discard jar photo ] 100px tall                             │
│  │    ♡ 1.2K  ◯ 312  ⟲ 48  ➤                                                        │
│ (40)  tomas.kneads 3h                                                                │
│  │    text · actions                                                                 │
│ (40)  wren.eats 2h                                                                   │
│  │    text                                                                           │
│  │    ┌ quote card, 2px ink, radius 16, 3/3 shadow ┐                                 │
│  │    └────────────────────────────────────────────┘                                 │
│  ╰──  ( ◐◐◐  Show 4 more replies  ⌄ ) pill 44px                                      │
│ [hidden block: 4 replies, grid-rows 0fr → 1fr]                                       │
├════════════════════════════════════════════════════════════════════════════════════ ┤
│ [quote chip, only when quoting]                                                      │
│ (You)  [ Reply to juno.bakes…                          ]  [ Post ]                   │ 68
└──────────────────────────────────────────────────────────────────────────────────────┘
```

- Card: `main` labelled by the "Thread" `h1`. The header pill is plain text.
- Each post: `article` with an `aria-label` naming the author (and "quoting …" when it embeds one). Grid: 40px rail + 1fr, 12px gap. The parent avatar is 48px.
- Rail: the avatar disc plus a `::after` line. All avatars are `aria-hidden`; the handle is text.
- Actions: `div role="group" aria-label="Actions"`: like (`aria-pressed`), reply, repost (`aria-haspopup="menu"`, `aria-expanded`) with a `role="menu"`, share.
- Quote card: a `button` (it would open the quoted post) whose `aria-label` reads the quoted author and text.
- Expand: `button aria-expanded aria-controls` pointing at the hidden block.
- Composer: `form` with a hidden `label`, an input and a submit; the quote chip sits above it.

## Tokens

```css
:root {
  --stage: #ffe38a;         /* butter, with a rgba(29,22,56,.14) 1.2px dot every 22px */
  --card: #fffaf0;
  --sunk: #fff1d6;          /* hover tint, quote cards, chip */
  --ink: #1d1638;           /* text, outlines, thread line, shadows */
  --ink-2: #4a4366;         /* action counts */
  --ink-3: #6a6385;         /* timestamps, placeholder */
  --tomato: #d0391f;        /* liked heart, Post, Author badge, focus */
  --mint: #6fd3a8;          /* replies pill, menu hover, "You" avatar */
  --lilac: #c4b2ff;         /* avatar, expand hover */
  --sky: #8fd0ff;           /* avatar, photo background */
  --peach: #ffb38a;         /* avatar, photo background */
  --sans: "Bricolage Grotesque", system-ui, sans-serif;
  --mono: "DM Mono", ui-monospace, monospace;
  --b: 2px solid var(--ink);
  --r: 24px;
  --shadow: 6px 6px 0 var(--ink);
  --av: 40px;
  --t-micro: 140ms;
  --t-expand: 420ms;
  --stagger: 70ms;
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
  --ease-pop: cubic-bezier(.34,1.56,.64,1);
}
```

Every bordered thing uses `--b`. Shadows are always hard and ink: card 6/6, quote card and Post 3/3, menu 4/4. No blur shadows anywhere.

## Typography

| Role | Family | Size | Weight | Line-height | Notes |
| --- | --- | --- | --- | --- | --- |
| Header "Thread" | Bricolage Grotesque | 20px | 800 | 1 | -0.02em |
| Parent text | Bricolage Grotesque | 18px | 500 | 1.4 | -0.01em |
| Reply text | Bricolage Grotesque | 15px | 400 | 1.45 | |
| Handle | Bricolage Grotesque | 15px | 800 | | -0.01em |
| Avatar initials | Bricolage Grotesque | 14px | 800 | | -0.02em |
| Timestamp | DM Mono | 12px | 400 | | `--ink-3` |
| Action count | DM Mono | 13px | 500 | | `--ink-2` |
| Replies pill, Author badge | DM Mono | 12px / 10.5px | 500 | | |
| Expand label, menu | Bricolage Grotesque | 14px | 600 | | |
| Post button | Bricolage Grotesque | 15px | 800 | | cream on tomato |

Mono carries numbers and time only. Zero counts render as nothing, not "0".

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Action tint | hover | background | none → `--sunk` | 140ms | instant |
| Action press | :active | scale | 1 → 0.94 | 140ms | instant |
| Heart squish | like on | scale, rotate | 1 → 0.6/0.8 → 1.3/1.15 −8° → 1 | 460ms `--ease-pop` | none |
| Count tick | count change | y, opacity | −70%/0 → 0/1 | 300ms `--ease-out` | none |
| Hidden block | expand | grid-template-rows | 0fr → 1fr | 420ms `--ease-out` | 1ms |
| Revealed replies | expand | opacity, y | 0/−8px → 1/0 | 260/320ms, delay k × 70ms | instant, no delay |
| Chevron | expand | rotate | 0 → 180° | 420ms `--ease-out` | instant |
| Repost menu | open | opacity, y, rotate | 0/6px/−1° → 1/0/0 | 220ms `--ease-pop` | instant |
| Quote card hover | hover | translate, shadow | 0, 3/3 → −1/−1, 4/4 | 140ms | instant |
| Post press | :active | translate, shadow | 0, 3/3 → 3/3, 0 | 140ms | instant |
| Quote chip, new post | appear | opacity, y | 0/10px → 1/0 | 260–360ms `--ease-out` | none |
| Scroll to new | expand, post | scroll | smooth | browser | `auto` |

## States

- Like on: tomato stroke and fill, `aria-pressed="true"`.
- Repost on: green `#1e8a5c`, `aria-pressed="true"`, menu item "Undo repost".
- Repost menu open: `aria-expanded="true"` on its button; only one menu open at a time.
- Expand: `aria-expanded`, label flips between "Show 4 more replies" and "Hide replies", hover fills lilac.
- Collapsed replies: `inert`.
- Composer quoting: chip visible, placeholder "Add your take…".
- Post disabled: `--sunk` fill, `--ink-3` text, no shadow.
- Input focus: 3/3 hard ink shadow instead of a glow.
- Focus-visible: 3px tomato outline, 2px offset, 10px radius.
- Author reply: tomato "Author" badge after the handle.

## Accessibility

- The thread line and avatars are decoration; each `article` label names the author, so the structure is clear without the line.
- Action buttons carry counts in `aria-label` ("Like, 1204 likes"; "Repost or quote, 48 reposts"); the visible numbers are `aria-hidden`.
- The repost menu is `role="menu"` with `menuitem`s; arrows move, Escape closes and returns focus.
- Collapsed replies are `inert` so they are neither focusable nor announced.
- Composer input has a real label; the quote chip's remove button is labelled "Remove quote".
- Contrast: ink on cream 15:1; `--ink-3` on cream 5.4:1; cream on tomato 4.7:1 at 15px/800.
- Hit targets: actions 36px tall by at least 40px wide; expand pill, composer and Post 44px.

## Responsive rules

- ≥1280 to 768: card 560px wide, height `min(752px, 100%)`, centred; the post list scrolls inside the card and the composer stays pinned.
- <640: card is `min(560px, 100%)`. At ≤480 scroll padding becomes 14/12/6, parent text 16.5px, action padding 6px, photos 96px tall, card shadow 4/4.
- The page never scrolls; only the inner list does (`overscroll-behavior: contain`).
- At 375 the quote chip text truncates with an ellipsis rather than wrapping.

## Acceptance checklist

### Always

- [ ] A continuous line connects every avatar in the visible thread and ends in a curved hook at the expand control.
- [ ] The line is drawn per post (`::after` on the rail), not as one tall element, so any post height works.
- [ ] Parent post is visually larger (48px avatar, 18px text) than replies.
- [ ] Expand animates height and staggers the revealed replies; collapsed replies are inert.
- [ ] At least one reply embeds a quoted post as a bordered card.
- [ ] Repost opens a two-item menu: Repost toggles; Quote loads a chip into the composer.
- [ ] Posting with a chip adds a reply carrying the quote card and its own working actions.
- [ ] Hard ink borders and offset shadows only; no blurred shadows.
- [ ] Focus visible on every control; reduced motion removes squish, stagger and tilt.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Parent: juno.bakes, "Hot take: sourdough discard pancakes are better than the sourdough itself.", 1.2K · 312 · 48.
- [ ] Visible replies: tomas.kneads, wren.eats quoting fermentfriday.
- [ ] Hidden replies: ada.k, basil.ok, mo.cooks, juno.bakes with an Author badge.
- [ ] Header pill reads "312 replies".
- [ ] Liking the parent makes its label "Like, 1205 likes".

## Implementation notes

**The thread line.** Give every post a rail column and draw the line from just below the avatar to slightly past the post's bottom, so it meets the next avatar. The expand row draws a hook that overlaps the last segment.

```css
.p { display:grid; grid-template-columns: var(--av) 1fr; column-gap:12px; padding-bottom:12px; }
.rail { position:relative; display:flex; justify-content:center; }
.p.line .rail::after { content:""; position:absolute; left:50%; width:2px; margin-left:-1px;
  top: calc(var(--av) + 6px); bottom: -10px; background: var(--ink); border-radius:2px; }
.hook::before { content:""; position:absolute; left:50%; top:-12px; width:16px; height:24px;
  margin-left:-1px; border-left:2px solid var(--ink); border-bottom:2px solid var(--ink);
  border-bottom-left-radius:14px; }
```

The avatar needs `position: relative; z-index: 1` so the line slips under it.

**Expand without measuring.** Animate `grid-template-rows` from `0fr` to `1fr`; the child needs `min-height: 0; overflow: hidden`. Stagger with a per-item `--k`.

```css
.hidden-wrap { display:grid; grid-template-rows:0fr; transition: grid-template-rows 420ms var(--ease-out); }
.hidden-wrap.open { grid-template-rows:1fr; }
.hidden-wrap > div { overflow:hidden; min-height:0; }
.hidden-wrap .p { opacity:0; transform:translateY(-8px); transition: opacity 260ms, transform 320ms var(--ease-out); }
.hidden-wrap.open .p { opacity:1; transform:none; transition-delay: calc(var(--k) * 70ms); }
```

Toggle `inert` on the hidden replies in the same handler.

**Quote from any post.** Read the author, text and avatar from the post that owns the menu, store them, and render them into the new reply with `textContent` (never `innerHTML` for user or post text).

```js
const post = el.closest('.p');
startQuote(post.querySelector('.meta b').textContent,
           post.querySelector('.txt').textContent,
           post.querySelector('.av').outerHTML);
```

**Common mistakes.**

- One absolutely positioned line behind the whole list; it breaks when replies expand or vary in height.
- Copying the real app's "@" spiral mark or its monochrome look. Murmur is yellow, tomato and ink.
- Soft blurred shadows next to hard outlines; pick hard.
- Leaving collapsed replies in the tab order.
- Showing "0" under every action on a fresh reply.
- Quote that only toggles a flag; it must put a visible chip in the composer and a visible card in the result.

**Rebuild order.**

1. Stage, card with header, scroll area, pinned composer.
2. Post grid with rail and line; parent post with photos.
3. Replies, quote card, hook and expand pill.
4. Action builder: like, reply, repost menu, share.
5. Expand with stagger and `inert`.
6. Quote chip and posting new replies.
7. Narrow layout and reduced motion.
