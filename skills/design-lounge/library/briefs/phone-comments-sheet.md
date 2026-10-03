<!-- Design Lounge Nº 307 · "Phone comments sheet" · designlounge.vercel.app -->

# Phone comments sheet

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. This is the quiet dark family: 6px radii, warm greys, mono numerals, one amber accent.

## What it is

The comments sheet in Ridgeline, a fictional hiking app. Behind it is a post by Kesh Gurung: a sunrise over Poon Hill, drawn with three SVG ridges on a gradient. A scrim dims the post. The sheet rises from the bottom and covers about two thirds of the screen. It holds a title with the count, a Top/Newest toggle, a threaded list, and a composer. Replies go one level deep. They are indented under a thin thread line. Tap Reply and a "Replying to @name" chip appears above the field. The Send button stays disabled until there is text. A new comment lands at the top of the list and glows amber for a moment. The detail worth copying is calm: warm greys, numbers in mono, and one accent that only means "you did this".

This is not a chat. A one-to-one thread is `chat-thread`. A draggable sheet with three detents is `ios-bottom-sheet-detents`. This sheet has two heights and no drag physics.

## Reference behaviour

1. First frame: the post shows at the top, dimmed by a 62% scrim. The sheet is `100% - 268px` tall (576px in the frame). The title reads "Comments 128". Top is pressed. Four comments show, sorted by likes: Bikash Thapa (140), Anjali Rai (86), Mika Sato (12), Priya Menon (1).
2. Anjali's comment has two replies, Kesh (marked "Author") and Tom. Bikash's has one reply, Lena. Replies sit under a 1px thread line, 32px in from the parent's left edge.
3. The field is empty. Its placeholder is "Add a comment for Kesh". Send is disabled.
4. Tap Newest. The list re-sorts by age, newest first: Priya (3m), Mika (8m), Anjali (42m), Bikash (1h). Replies keep their own order, oldest first. The list scrolls to the top.
5. Tap a heart. It fills amber. Its count goes up by 1. The heart scales to 1.25 and back over 220ms. Tap again to undo.
6. Tap Reply under any comment or reply. The chip "Replying to @handle" appears above the field. The placeholder becomes "Reply to Firstname". Focus moves to the field.
7. Reply on a reply attaches to the top-level parent. The chip still names the person you tapped. There is never a second level.
8. Tap the chip's × or press Escape in the field. The chip goes away and the placeholder resets.
9. Type any non-space character. Send turns amber and becomes enabled. Clear the field and it goes grey and disabled again.
10. Press Send or Enter with no reply chip. The comment is added at the top of the list, above every sort. It is from Sam Okoro, the viewer, with "now" as the time. The count becomes 129. The row's background goes amber at 16% and fades out over 1400ms.
11. Press Send with a reply chip. The reply is added at the end of that thread with the same highlight. The list scrolls it into view. The chip clears.
12. The field clears and Send disables after each post. A polite live region says "Comment posted." or "Reply posted."
13. Tap the handle at the top of the sheet. The sheet grows to `100% - 64px` over 360ms. Tap again to shrink. Tapping the scrim also shrinks it.

## Structure

```
390 × 844
┌──────────────────────────────────────┐
│ (54px top inset)                     │
│ (KG) Kesh Gurung · Poon Hill 3,210 m │ post header, dimmed
│ ┌──────────────────────────────────┐ │
│ │ sunrise gradient + 3 ridges      │ │ post scene, 300px tall
├─┴──────────── sheet top y=268 ─────┴─┤ radius 6px 6px 0 0
│               ────                   │ grab button, 44px tall, 36×4 bar
│ Comments 128              [Top|New]  │ 16px / mono 13px, toggle 44px
│ ──────────────────────────────────── │
│ (BT) Bikash Thapa  1h                │ 32px avatar, gap 10px
│      Tip for anyone going: …         │
│      [♥ 140] [Reply]                 │ 44px actions
│   │ (LV) Lena Vogt  1h               │ reply: 24px avatar,
│   │      Can confirm. …              │ 1px line at 32px
│   │      [♥ 9] [Reply]               │
│ (AR) Anjali Rai  42m                 │
│ …                                    │ list scrolls
│ ──────────────────────────────────── │
│      [Replying to @anjali.r     × ]  │ chip, only when replying
│ (SO) [ Add a comment for Kesh ] [↑]  │ 32 / 1fr / 44, field 44px
│ (34px bottom inset)                  │
└──────────────────────────────────────┘
```

- The post is an `article` with `aria-hidden="true"` while the sheet is open.
- The scrim is a `button` with `tabindex="-1"` and `aria-hidden`. Pointer users can tap it. Keyboard users use the handle.
- The sheet is a `section role="dialog" aria-modal="true"` labelled by the `h2`.
- The handle is a `button` with `aria-expanded` and the label "Expand comments" or "Shrink comments".
- The sort is a `div role="group" aria-label="Sort comments"` with two `aria-pressed` buttons.
- The list is a `ul`. Each comment is an `li` holding a row grid (avatar, body) and, when it has replies, a nested `ul.replies`.
- The composer is a `form`. The field has a visually hidden `label` "Add a comment". Send is `type="submit"` with `aria-label="Post comment"`.
- Comment text is set with `textContent`, never `innerHTML`.

## Tokens

```css
:root {
  /* surfaces */
  --page: #0f0e0d;                       /* behind the post */
  --sheet: #1c1a18;                      /* sheet */
  --raised: #262320;                     /* field, chip, sort track */
  --line: #33302c;                       /* hairlines, thread line, handle */
  --scrim: rgba(8, 7, 6, 0.62);
  /* ink */
  --ink: #ede8e1;
  --ink-2: #b8b0a5;
  --ink-3: #948b80;
  /* accent */
  --accent: #e9a23b;                     /* amber */
  --on-accent: #1c1a18;
  --accent-wash: rgba(233, 162, 59, 0.16);
  --focus: #e9a23b;
  /* type */
  --sans: "Instrument Sans", system-ui, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;
  /* space, 4px base */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px;
  --page-x: 16px;
  /* shape */
  --r: 6px;
  /* motion */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --sheet-ease: cubic-bezier(0.32, 0.72, 0, 1);
  --micro: 160ms;
  --layout: 360ms;
  /* insets */
  --top: max(54px, env(safe-area-inset-top));
  --bottom: max(34px, env(safe-area-inset-bottom));
}
```

Avatar fills are per-person muted tints, set inline: `#9db8a0`, `#d9b36c`, `#c98a7a`, `#b8c48f`, `#8fb1c4`, `#a9a3c9`, `#c9a27a`. Initials sit on them in `--sheet`. The viewer's avatar is `--accent`.

No shadows. The sheet is separated from the post by its lighter surface and a 1px `--line` top border.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Colour |
| --- | --- | --- | --- | --- | --- | --- |
| Sheet title | Instrument Sans | 16px | 600 | 1.2 | -0.005em | `--ink` |
| Title count | JetBrains Mono | 13px | 400 | 1.2 | 0 | `--ink-3` |
| Sort label | Instrument Sans | 13px | 500 | 1 | 0 | `--ink-3`, pressed `--ink` |
| Name | Instrument Sans | 13px | 600 | 1.3 | 0 | `--ink` |
| Author tag | Instrument Sans | 10px | 600 | 1 | 0.08em | `--accent`, upper |
| Time | JetBrains Mono | 11px | 400 | 1.3 | 0 | `--ink-3` |
| Comment text | Instrument Sans | 14px | 400 | 1.45 | 0 | `--ink` |
| Action label | Instrument Sans | 12px | 500 | 1 | 0 | `--ink-3` |
| Like count | JetBrains Mono | 12px | 400 | 1 | 0 | inherits, min 3ch |
| Chip | Instrument Sans | 12px | 400 | 1.3 | 0 | `--ink-2`, handle `--ink` 500 |
| Field | Instrument Sans | 15px | 400 | 1.2 | 0 | `--ink`, placeholder `--ink-3` |
| Avatar initials | Instrument Sans | 11px (9px reply) | 600 | 1 | 0 | `--sheet` |

- Every number is mono with `tabular-nums`: the count, times, and likes. Words are sans.
- Give the like count `min-width: 3ch`, so 99 → 100 does not push Reply.
- The field is 15px or more. Smaller text makes iOS Safari zoom on focus.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Sheet height | handle tap, scrim tap | height | `100% - 268px` ↔ `100% - 64px` | 360ms | `--sheet-ease` | instant |
| Heart | like tap | scale (keyframe) | 1 → 1.25 → 1 | 220ms | `--ease` | none |
| Heart fill | like tap | fill, color | none, `--ink-3` → amber | 160ms | `--ease` | instant |
| New row | post | background (keyframe) | wash, held 30% → transparent | 1400ms | `--ease` | 1px amber outline, no fade |
| Send | text present | background, color | `--raised` → amber | 160ms | `--ease` | instant |
| Send press | `:active` | scale | 1 → 0.94 | 160ms | `--ease` | kept |
| Sort pressed | tap | background, color | → `--line`, `--ink` | 160ms | `--ease` | instant |
| Scroll to reply | reply posted | scroll | nearest | smooth | browser | `behavior: auto` |

- The sheet's entry is not in this demo. In a product, slide it up from 100% over 360ms with `--sheet-ease`, and fade the scrim from 0 to 0.62 over the same time.
- The list re-sort is instant. Do not animate rows moving. It reads as noise in a dark list.
- Nothing loops.

## States

- Send disabled: `--raised` fill, `--ink-3` arrow, `cursor: not-allowed`, `disabled` attribute.
- Send enabled: amber fill, `--sheet` arrow.
- Like resting: outline heart, `--ink-3`, `aria-pressed="false"`.
- Like on: filled amber heart, amber count, `aria-pressed="true"`.
- Action hover: text goes to `--ink`.
- Sort pressed: `--line` fill, `--ink` text. Resting: no fill, `--ink-3`.
- Field focus-visible: amber border plus a 1px amber ring. No outline offset inside the composer.
- Other focus-visible: 2px amber outline, offset 2px.
- Replying: chip visible, placeholder "Reply to Firstname".
- New row: amber wash fading out over 1400ms.
- Handle hover: bar goes from `--line` to `--ink-3`.
- Empty, for a product: one line in `--ink-3`, "No comments yet. Start it.", centred, 48px from the top of the list. Keep the composer.
- Loading, for a product: three rows of grey bars at the row sizes. Keep the title and count.
- Post failed, for a product: keep the text in the field, put "Not posted. Tap to retry." under the row in `--ink-2`, and do not bump the count.

## Accessibility

- The sheet is a modal dialog. Move focus into it when it opens, to the field or the first sort button. Trap Tab inside it. Escape with no reply chip closes it in a product.
- Escape in the field with a chip clears the chip first.
- Each like button's name is "Like" plus its count, from a visually hidden "Like" and the visible number. State is `aria-pressed`.
- Each Reply button's label is "Reply to Name".
- The sort buttons use `aria-pressed`. Only one is pressed.
- The chip's × is labelled "Cancel reply".
- A polite live region announces "Comment posted." and "Reply posted." It does not read the comment back.
- The disabled Send is skipped by Tab. That is fine, because Enter in the field submits.
- Hit targets: handle 44px tall and full width, sort buttons 44px tall and 68px wide, like and reply 44×44 minimum, chip × 44×44, field 44px, Send 44×44.
- Contrast on `#1c1a18`: `#ede8e1` is about 14:1, `#b8b0a5` is about 8:1, `#948b80` is about 5:1. `#1c1a18` on `#e9a23b` is about 8.5:1.
- The thread line is decoration. Nesting is also in the DOM, as a nested `ul`.

## Responsive rules

- Frame: 390×844. Sheet top is 268px from the top. Expanded top is 64px.
- At 360 wide: the toggle stays to the right of the title. Comments wrap. The reply indent stays 32px + 22px. Do not shrink the avatars.
- On a short phone (under 700px): open the sheet at `100% - 180px`, so the list still shows two rows.
- With the keyboard up: keep the composer above the keyboard. Use `visualViewport` to read the keyboard height. See the notes.
- At tablet width: show comments in a 420px side panel next to the post, not a bottom sheet.
- Do not draw a status bar or a keyboard. The bottom padding is the clearance.

## Acceptance checklist

### Always

- [ ] The sheet sits over a dimmed post. The scrim is at least 60% dark.
- [ ] The title shows the total count in mono numerals.
- [ ] A two-way sort toggle. It re-sorts the list and resets scroll to the top.
- [ ] Replies go one level deep only, under a 1px thread line.
- [ ] Every like toggles `aria-pressed` and changes its count by exactly 1.
- [ ] Reply shows a "Replying to @handle" chip with a 44px cancel button. Escape also cancels.
- [ ] Send is disabled until the field has a non-space character.
- [ ] A new top-level comment appears at the top of the list, above the sort, with a short highlight.
- [ ] The count goes up by one on each post.
- [ ] Comment text is inserted as text, not HTML.
- [ ] Composer bottom padding is `max(34px, env(safe-area-inset-bottom))`.
- [ ] All radii are 6px except avatars. One accent.

### This demo

- [ ] The app is Ridgeline. The post is by Kesh Gurung at Poon Hill, 3,210 m.
- [ ] The title reads "Comments 128". Top is pressed. Bikash Thapa (140) is first.
- [ ] Anjali Rai's comment has replies from Kesh (Author) and Tom Ellery.
- [ ] New comments post as Sam Okoro with the time "now".
- [ ] Sheet `#1c1a18`, field `#262320`, line `#33302c`, accent `#e9a23b`.
- [ ] The handle grows the sheet to `100% - 64px` over 360ms.

## Implementation notes

Always: keep comments in data and re-render the list from it. Do not move DOM nodes by hand on sort. Pin the viewer's new comments to the top after sorting.

```js
function render() {
  const rows = [...data];
  if (sort === 'top') rows.sort((a, b) => b.likes - a.likes);
  else rows.sort((a, b) => a.mins - b.mins);
  const mine = rows.filter(r => r.mine);
  const rest = rows.filter(r => !r.mine);
  list.replaceChildren(...[...mine, ...rest].map(c => item(c)));
}
```

Reply targets the top-level comment, but the chip names who you tapped:

```js
reply.addEventListener('click', () => setReply(parent || c, c));
function setReply(thread, who) {
  replyTo = thread;
  chipName.textContent = '@' + who.handle;
  chip.hidden = false;
  field.placeholder = 'Reply to ' + who.name.split(' ')[0];
  field.focus();
}
field.addEventListener('input', () => { send.disabled = !field.value.trim(); });
```

The thread line is a border on the nested list. It lines up with the parent avatar's left edge plus its width:

```css
.c { display: grid; grid-template-columns: 32px 1fr; gap: 10px; padding: 10px 16px 2px; border-radius: 6px; }
.replies { list-style: none; margin: 0 0 0 32px; padding: 0 0 0 22px; border-left: 1px solid var(--line); }
.c.reply { grid-template-columns: 24px 1fr; padding: 8px 16px 2px 0; }
.fresh { animation: fresh 1400ms var(--ease); }
@keyframes fresh { 0%, 30% { background: var(--accent-wash); } 100% { background: transparent; } }
@media (prefers-reduced-motion: reduce) {
  .fresh { animation: none; outline: 1px solid var(--accent); outline-offset: -1px; }
}
```

Keep the composer above the keyboard on iOS. The sheet is `position: fixed`, so lift it by the keyboard height:

```js
const vv = window.visualViewport;
if (vv) vv.addEventListener('resize', () => {
  const kb = Math.max(0, innerHeight - vv.height - vv.offsetTop);
  sheet.style.bottom = kb + 'px';
  composer.style.paddingBottom = kb ? '8px' : '';
});
```

When the keyboard is up, drop the 34px home padding. The keyboard already covers the home indicator.

Common mistakes:

- Replies nested three levels deep. One level, then flatten with an @name.
- A Send button that looks enabled with an empty field.
- New comments added at the bottom, where the poster cannot see them.
- Re-sorting the viewer's new comment down the list under Top. It stays on top until the sheet closes.
- Likes in proportional digits, so the row shifts at 99 → 100.
- Pure black `#000` sheet and pure white text. Use the warm greys.
- A second accent for the author tag. It reuses amber.
- Rounded 16px bubbles. This is a list, not a chat.
- Emoji reactions. This piece has one heart.
- Setting comment text with `innerHTML`.
- Drawing a keyboard or a status bar.

Where it sits:

1. The comment icon under a post opens this sheet.
2. The post stays behind it, dimmed, so the reader keeps context.
3. Closing returns focus to the comment icon that opened it.
4. A tap on a name opens that profile. It is not drawn here. Use `phone-profile-header`.
5. Long-press a comment for Report or Copy in a product. Use a context menu, not swipe rows.
6. If the app has a tab bar, the sheet covers it. Do not leave the tab bar above the scrim.

Rebuild order:

1. Draw the post and the scrim.
2. Place the fixed sheet at `100% - 268px` with the 6px top radius.
3. Add the handle, the title with the mono count, and the sort toggle.
4. Put the comment data in an array. Write `item()` and `render()`.
5. Add likes with the pop.
6. Add the composer with the disabled Send.
7. Add the reply chip and Escape.
8. Add posting, the count bump, and the highlight.
9. Add the handle toggle and the scrim tap.
10. Add `visualViewport` handling for the keyboard.
11. Check reduced motion and focus rings.
12. Map colours onto the locked theme if a kit is on.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
