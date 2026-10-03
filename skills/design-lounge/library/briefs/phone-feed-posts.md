<!-- Design Lounge Nº 323 · "Social feed with stories and posts" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Social feed with stories and posts

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The home feed of "Hubbub", a social app for people who make things. From the top: a sticky bar with the lowercase wordmark "hubbub." (the dot is coral), a black New post button and an Activity bell with a coral dot. Then a sideways row of stories with a coral ring for unseen and a grey ring for seen. Then the feed: a picture post, a text-only post, a suggested-accounts carousel, and a second picture post. A flat tab bar sits at the bottom in the `phone-tab-plain` style.

The look is playful and bright: off-white page, near-black ink, one hot coral, a chunky rounded grotesk (Fredoka) for names, numbers and the wordmark, Nunito for body text, 18px radii. Pictures are drawn in CSS, not loaded. The detail worth copying is the double-tap: two taps on a picture within 300ms fill the like button, add one to the count, and play a 96px coral heart with six small dots flying out, all in under 800ms.

No pull-to-refresh. The feed just scrolls.

## Reference behaviour

1. First frame: the bar, the stories row (Your story plus seven people, the first five unseen), and the first post with its picture, actions and two lines of caption. "Home" is the current tab.
2. Stories: Your story has a dashed grey ring and a black + badge. Unseen stories have a 3px coral ring with a 3px off-white gap. Seen stories have a grey ring and muted name. The last two (marlo, kit.and.co) start seen.
3. Tap an unseen story: its ring turns grey over 240ms, it moves to the end of the row, and keeps focus. A seen story does nothing here; the viewer is `mobile-story-viewer`.
4. Each post has an author row: 40px initials avatar, name (Fredoka 16/600), real name and age (13px muted), and a 44px "more options" button.
5. Picture post 1, "juno.makes": three glazed mugs on a black shelf over peach, a "Glaze test 14" pill bottom-left.
6. Double-tap a picture (two pointer-ups within 300ms and 30px): the like button turns on (it never turns off by double-tap), the count rises by one, and the heart burst plays in the centre of the picture.
7. Tap the heart button: toggles like. On: coral, filled, a 1.3× thump over 360ms, count +1. Off: ink outline, count back.
8. Comment button shows the count. Share shows a toast "Link copied". Save toggles a filled bookmark and shows "Saved to your collection" or "Removed from saved". Toasts sit 68px above the bar's safe area and hide after 1.8s.
9. Captions clamp to two lines. A "more" link sits at the end of line two over a 30px fade. Tapping it opens the full caption and moves focus to the text.
10. Text post, "marlo": a black card, off-white Fredoka 24/500 text, the last two words in coral. It supports double-tap like too.
11. Suggested accounts: heading "Accounts you might like" and "See all". Five 156px cards scroll sideways with snap. Each card: dismiss X (44px), 64px avatar, name, reason line, and a full-width black Follow pill.
12. Tap Follow: it becomes "Following", white with a 1.5px ink inset ring. Tap again to undo.
13. Tap X: the card fades and scales to 0.9 over 200ms, then is removed. Focus moves to the next card's X. If the last card goes, the whole section goes.
14. Picture post 2, "oro.studio": a riso poster, coral sun behind teal scalloped waves on butter, "LOW TIDE" in spaced Fredoka. It starts saved.
15. Tab bar: four tabs with a 3px coral top mark on the current tab. Tapping Home while on Home scrolls the feed to the top.

## Structure

```
390 × 844 (status bar drawn by the Lounge)
┌──────────────────────────────────────┐
│                                      │ 54 (sticky bar, off-white)
│ hubbub.                     (+) (bell)│ wordmark 30/700 · buttons 44
│ (You)(JF)(DW)(PB)(OS)(TD)…           │ stories 68 rings, gap 14
│ Your  juno  dev.  pip_  oro.         │ names 12/600, ellipsis
├──────────────────────────────────────┤ 1px rule
│ (JF) juno.makes                 ⋯    │ author row, avatar 40
│      Juno Ferreira · 2h              │
│ ┌──────────────────────────────────┐ │ picture: margin 0 12,
│ │   ▆▆▆   ▆▆▆▆   ▆▆▆              │ │ height clamp(260, 42vh, 352)
│ │ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ shelf         │ │ radius 18
│ │ (Glaze test 14)                  │ │
│ └──────────────────────────────────┘ │
│ ♡ 1,284  ◯ 48  ➤                 ⊓   │ actions 44 tall
│ juno.makes Glaze test 14 came out…   │ caption 2-line clamp
│ of a tangerine peel and I am… more   │
│ View all 48 comments                 │
├──────────────────────────────────────┤
│ text post · suggested · picture post │ (scroll)
├──────────────────────────────────────┤ flat bar, 1px top rule
│  ▔▔▔                                 │ 3px coral mark
│ Home   Discover   Inbox   You        │ tabs 52 tall
│                                      │ 34 home clearance
└──────────────────────────────────────┘
```

- `main` is the only scroller (`height: 100%; overflow-y: auto`). Its bottom padding is 62px + 34px so the last post clears the bar.
- The top bar is a `header` with `position: sticky; top: 0` inside `main`. The wordmark is the page's only `h1`.
- Stories are a `nav aria-label="Stories"` of buttons.
- Each post is an `article` labelled by the author name. Pictures are `div role="img"` with a written description.
- Actions are buttons. Like and Save use `aria-pressed`.
- The suggestion block is a `section` labelled by its `h2`.
- The tab bar is a `nav aria-label="Sections"` of four buttons with `aria-current="page"` on the current one.
- One `div role="status"` toast.

## Tokens

```css
:root {
  /* colour */
  --bg: #faf7f2;       /* off-white page */
  --surface: #ffffff;  /* tab bar, suggestion cards */
  --ink: #141210;      /* text, black buttons, text-post card */
  --ink-2: #46413b;    /* story names */
  --ink-3: #6c655d;    /* meta, muted tabs */
  --line: #e8e1d6;     /* rules, card borders */
  --seen: #d6cec3;     /* seen story ring */
  --hot: #ff4b36;      /* the one accent */
  --focus: #141210;

  /* picture and avatar fills (content, not UI) */
  --butter: #ffe27a;
  --peach: #ffd5c4;
  --mint: #cfe8e2;
  --teal: #1d5b57;
  --oat: #ece5da;

  /* type */
  --round: "Fredoka", "Nunito", system-ui, sans-serif;
  --sans: "Nunito", system-ui, sans-serif;

  /* space: 4px base */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px;
  --top-clear: 54px;
  --bottom-clear: 34px;

  /* shape */
  --r: 18px;
  --pill: 999px;

  /* motion */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Notes |
| --- | --- | --- | --- | --- | --- |
| Wordmark | Fredoka | 30px | 700 | 1 | -0.02em, lowercase, coral full stop |
| Author name | Fredoka | 16px | 600 | 1.2 | |
| Author meta | Nunito | 13px | 400 | 1.45 | `--ink-3` |
| Story name | Nunito | 12px | 600 | 1.45 | ellipsis at 68px |
| Avatar initials | Fredoka | 16 / 20 / 24px | 600 | — | by avatar size 40 / 62 / 64 |
| Action count | Fredoka | 14px | 600 | — | tabular, en-GB commas |
| Caption | Nunito | 15px | 400 | 1.45 | handle in Fredoka 15/600 |
| Text post | Fredoka | 24px | 500 | 1.25 | -0.01em, off-white on ink |
| Section heading | Fredoka | 18px | 600 | 1.45 | |
| Follow pill | Fredoka | 15px | 600 | — | |
| Tab label | Fredoka | 11px | 600 | — | |
| Toast | Fredoka | 14px | 600 | — | |

Fredoka is the voice. Long reading text is Nunito. Never set captions in Fredoka.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Heart burst | double-tap picture | scale, opacity, y | 0.2, 0 → 1.15, 1 → 0.95 → 1 → 1.05, 0, -14px | 760ms | `--expo` | not shown; like still applies |
| Burst dots (6) | same | rotate(a) translateY | 0 → -78px, scale 0.6 → 0 | 620ms | `--expo` | not shown |
| Like thump | like on | icon scale | 1 → 1.3 → 1 | 360ms | `--expo` | none |
| Story seen | tap story | ring colour | coral → `--seen` | 240ms | `--ease` | instant |
| Card dismiss | tap X | opacity, scale | 1 → 0, 1 → 0.9 | 200ms | `--ease` | removed at once |
| Follow | tap | background, colour | ink → white | 160ms | `--ease` | instant |
| Toast | share, save | opacity, y | 0, 12px → 1, 0 | 200ms / 240ms | `--expo` | instant |
| Home re-tap | tap Home | scrollTop | current → 0 | smooth | — | `behavior: auto` |

The burst dots sit at 0°, 60°, 120°, 180°, 240° and 300°. They are off-white so they read on any picture.

## States

- Story unseen: 3px coral ring, ink-2 name. Seen: grey ring, ink-3 name, label ends ", seen".
- Like off: ink outline heart, `aria-pressed="false"`. On: coral fill and text, `aria-pressed="true"`, count +1.
- Save off: outline bookmark. On: filled ink bookmark.
- Caption closed: 2-line clamp, "more" visible. Open: full text, "more" gone.
- Follow off: black pill, off-white "Follow". On: white pill, ink ring, "Following", `aria-pressed="true"`.
- Card dismissed: removed; if none remain, the section is removed.
- Tab current: ink label, 3px coral top border. Others `--ink-3`.
- Activity button: coral 9px dot with a 2px off-white ring.
- Focus-visible: 2.5px ink outline, 2px offset, 12px radius on everything.
- Loading and error are not drawn. Use `mobile-load-failed` for a failed feed and skeleton posts at the same 352px picture height for loading.

## Accessibility

- Pictures are `role="img"` with a description that ends "Double-tap to like." Double-tap is a shortcut; the heart button is the real control.
- The like button's name includes the count: "Like, 1,284 likes", then "Liked, 1,285 likes".
- Comment buttons are named "48 comments"; the visible count is `aria-hidden` to avoid a double read.
- Story buttons are named "juno.makes's story, new" or "..., seen".
- Follow buttons are named "Follow nell.sews" with `aria-pressed`. Dismiss buttons are named "Dismiss nell.sews".
- Focus never drops to `body`: after a card is dismissed it goes to the next X; after a story is seen it stays on that story.
- The toast is `role="status"`.
- Hit targets: icon buttons 44×44, actions 44 tall, Follow 44 tall, dismiss 44×44, tabs 52 tall, "more" has an invisible pad to 44 tall. Story buttons are 68×90.
- Contrast: ink on off-white 17:1; `--ink-3` on off-white 5.4:1; off-white on ink 17:1. Coral is never used for small text on off-white. In the text post, coral on ink is 5.6:1 at 24px.

## Responsive rules

- Picture height is `clamp(260px, 42vh, 352px)`: 352 at 844 tall, about 328 at 780 tall.
- At 360 wide the stories row shows four and a half rings, which signals that it scrolls. Names ellipsize.
- Suggestion cards stay 156px. At 360 two full cards and a sliver show.
- Long names ellipsize in author rows and cards; the "more options" button never wraps.
- At tablet width, centre the feed in a 470px column. Do not stretch pictures to 1180px. Swap the bottom bar for a side rail.
- Never draw a status bar. Keep 54px top and 34px bottom clearance.

## Acceptance checklist

### Always

- [ ] Stories row scrolls sideways; unseen rings use the accent, seen rings are grey.
- [ ] Tapping an unseen story marks it seen and moves it to the end.
- [ ] Each picture post has an author row, a picture, four actions with counts, and a caption.
- [ ] Double-tap on a picture likes (never unlikes) and plays a heart burst.
- [ ] The heart button toggles like and updates the count and its accessible name.
- [ ] Captions clamp to two lines with an inline "more".
- [ ] At least one text-only post sits in the feed.
- [ ] A suggested-accounts carousel sits between posts, with Follow and dismiss.
- [ ] The tab bar is flat with a 1px rule and an accent top mark, no blur.
- [ ] No pull-to-refresh, no images, no emoji.
- [ ] All hit targets 44px or more; focus visible everywhere.
- [ ] No horizontal page scroll at 360 wide.

### This demo

- [ ] Wordmark "hubbub." with a `#ff4b36` full stop.
- [ ] First post is juno.makes with 1,284 likes and 48 comments; double-tap shows 1,285.
- [ ] Text post by marlo ends with "standing up." in coral.
- [ ] Suggested: nell.sews, bike.shed.co, ana.ferments, the.tile.guy, wren.plants.
- [ ] Last post is oro.studio "LOW TIDE" and starts saved.
- [ ] Radii 18px on pictures and cards; Fredoka and Nunito only.

## Implementation notes

**1. Double-tap without breaking single taps or scroll.** Do not use `dblclick`; touch browsers delay or drop it. Track the last pointer-up on the same element. Set `touch-action: manipulation` on pictures to stop double-tap zoom.

```js
let last = { t: 0, x: 0, y: 0, el: null };
pic.addEventListener('pointerup', e => {
  const now = performance.now();
  const near = Math.hypot(e.clientX - last.x, e.clientY - last.y) < 30;
  if (now - last.t < 300 && near && last.el === pic) {
    setLike(likeButtonFor(pic), true);   // on only
    burst(pic);
    last.t = 0;
    return;
  }
  last = { t: now, x: e.clientX, y: e.clientY, el: pic };
});
```

**2. Heart burst that restarts.** Rebuild the burst children, force a reflow, then add the class. Each dot reads its angle from a custom property.

```css
.burst { position: absolute; left: 50%; top: 50%; width: 0; height: 0; pointer-events: none; }
.burst svg { position: absolute; width: 96px; height: 96px; left: -48px; top: -48px; fill: var(--hot); opacity: 0; }
.burst i { position: absolute; width: 10px; height: 10px; margin: -5px; border-radius: 50%; background: var(--bg); opacity: 0; }
.burst.go svg { animation: pop 760ms var(--expo) forwards; }
.burst.go i { animation: fly 620ms var(--expo) forwards; }
@keyframes fly { 0% { transform: rotate(var(--a)) translateY(0) scale(.6); opacity: 1; }
  100% { transform: rotate(var(--a)) translateY(-78px) scale(0); opacity: 1; } }
```

```js
b.classList.remove('go'); void b.offsetWidth; b.classList.add('go');
```

**3. Inline "more" on a clamped caption.** Clamp the text span, then pin the button to the bottom right with a fade so it covers the ellipsis. Give it an invisible pad for a 44px target.

```css
.cap { position: relative; }
.cap .txt { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.more { position: absolute; right: 0; bottom: 0; padding-left: 36px;
  background: linear-gradient(90deg, transparent, var(--bg) 30px); }
.more::before { content: ""; position: absolute; inset: -12px -8px -12px 20px; }
.cap.open .txt { display: block; }
.cap.open .more { display: none; }
```

**4. CSS pictures.** The mugs are three absolutely placed spans with `border-radius: 10px 10px 28px 28px` and a handle from a bordered `::after` circle with one side transparent. The poster is a butter fill, a coral circle in `::before`, and scalloped waves in `::after` from one repeating radial gradient: `radial-gradient(circle at 25px 0, transparent 24px, var(--teal) 25px) 0 0 / 50px 100% repeat-x`.

Other mistakes to avoid:

- A second accent for Follow or the text post. Follow is black. Coral is rings, the heart, the dot, the tab mark, two words.
- Double-tap that toggles. It only ever likes, like every feed people know.
- A glass tab bar. This feed uses the flat bar from `phone-tab-plain`.
- Drawing a status bar or a story viewer here.
- Purple gradients on the story rings. The ring is flat coral.
- Using `dblclick`, which fires late or not at all on touch.

Rebuild order:

1. Set the page, sticky bar and the flat tab bar.
2. Build the stories row with seen and unseen rings.
3. Build one picture post: author row, CSS picture, actions, caption.
4. Add like, save, share and the toast.
5. Add double-tap and the heart burst.
6. Add the text post and the second picture post.
7. Insert the suggested-accounts carousel with Follow and dismiss.
8. Check focus after every removal, reduced motion, and 360 wide.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
