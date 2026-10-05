<!-- Design Lounge Nº 343 · "Phone notification centre" · www.designlounge.live -->

# Phone notification centre

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Keep the groups, the filter, the unread rules and the empty state.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The notification screen of Plinth, a fictional app where architects share drawings. It is a full phone screen. A fixed header holds the title, an unread count, a Mark all read link and a three-part filter. Below it a list scrolls, grouped by Today, This week and Earlier.

The look is Swiss and quiet. White page, black type, one red. Red is only for unread: the 8px dot, the count and the filter badge. Everything sits on an 8px grid. Radii are 6px. Separation is 1px rules, not shadows.

There are four row types. A mention shows a short quote with a 2px black left rule. A like batch shows two stacked squares and "Mira Okafor and 4 others". A follow has an inline Follow back button. A system row is about billing and uses a black square with a card icon.

The detail worth copying is Mark all read. The red dots shrink away one after another, 60ms apart, top to bottom. The text drops from weight 500 black to weight 400 grey at the same time. Then the count and the badge update once.

## Structure

```
390 x 844
+--------------------------------------+
| padding-top 56px                     |
| Notifications           Mark all read|  h1 32/40, link 48px tall
| 5 unread                             |  13/24
| +----------+----------+-----------+  |
| |###All####| Mentions | Unread (5)|  |  48px, 1px ink, 6px radius
| +----------+----------+-----------+  |
+==1px ink rule========================+
| TODAY                    sticky 11px |
| * [AR] Anaya Rai mentioned you   12m |  row min 72px
|   @  in Riverside housing study      |  padding 16 / 24
|      | @sam can you check...         |  quote 2px rule
| ------------------------------------ |  1px #e5e5e5
| * [MO+4] Mira Okafor and 4 others  1h|
| * [TD] Tenzin Doma started...      3h|
|        [ Follow back ]  40px         |
| * [##] Studio plan renews on...    5h|
| THIS WEEK                            |
|   [JB] Jonas Berg mentioned...    Tue|
| * [PN+11] Priya Nair and 11...    Mon|
|   [OL] Oskar Lind ...  [Following]   |
| EARLIER                              |
|   [LP] [##] [KS+2] ...               |
|            34px bottom clearance     |
+--------------------------------------+
```

- `header` is not scrolled. It has the only `h1`, a `p` count, a `button` Mark all read, and a `div role="group"` filter with three `button[aria-pressed]`.
- `main` is the scroll area. It holds three `section`s. Each has an `h2` group label and a `ul`.
- Each row is an `li`. Inside it: a decorative dot `span`, a full-width `button.hit` with the avatar, text and time, and for follows a separate `button.fb` placed over the row. Never nest the follow button inside the row button.
- The row button is a 3-column grid: 40px avatar, 1fr text, auto time. Gap 16px.
- Follow rows add 64px bottom padding to the row button. The follow button sits absolute at left 80px, bottom 16px.
- The empty state is a `div role="status"` at the end of `main`, hidden until needed.

## Motion

| Thing | Trigger | Property | From to | Duration | Easing | Delay | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Unread dot | mark read | transform scale | 1 to 0 | 160ms | `--ease` | 0 | instant |
| Row text | mark read | colour | `--ink` to `--ink-2` | 200ms | `--ease` | 0 | instant |
| Mark all read | click | dot and text as above | | 160 / 200ms | `--ease` | 60ms x index of visible unread rows | all at once |
| Filter indicator | segment click | translateX | 0 / 100% / 200% | 240ms | `--ease` | 0 | instant |
| Segment label | segment click | colour | ink to white | 200ms | `--ease` | 0 | instant |
| Unread filter refresh | row read | rows hide | | | | 360ms after read | 0ms |
| Empty state | last unread cleared in Unread | display | | | | 240ms after the stagger | 0ms |
| Follow button | click | background, colour | black to white | 160ms | `--ease` | 0 | instant |

Weight change from 500 to 400 is not animated. Only colour moves. Nothing loops.

## States

- Row unread: red dot, text 500 `--ink`. The row button's `aria-label` starts with "Unread."
- Row read: no dot, text 400 `--ink-2`.
- Row hover: background `--fill`.
- Row focus-visible: 2px ink outline inset by 2px so it is not clipped by the list.
- Segment selected: black indicator under it, white label, `aria-pressed="true"`.
- Filter badge: red, shows the unread count. Empty when zero, then hidden.
- Mark all read disabled: `--ink-3`, no underline, `disabled` attribute.
- Follow back: black fill, white text. Following: white fill, 1px inset ink ring, ink text, `aria-pressed="true"`.
- Group hidden: when the filter leaves it with no rows, hide the whole `section` including its header.
- Empty, Unread filter: "All caught up" and "No unread notifications. New mentions, likes and follows will show up here."
- Empty, Mentions filter: "No mentions yet" and "When someone writes @sam in a project, it shows up here."
- Loading and error: not on this frame. Use `mobile-load-failed` for a failed fetch.

## Accessibility

- The filter is a `role="group"` labelled "Filter notifications" with toggle buttons using `aria-pressed`. It is not a tablist, because the list is the same region filtered.
- Each row button gets an `aria-label` built from its visible text, prefixed with "Unread." when unread. Rebuild the label when the state changes.
- Avatars and stacked squares are decorative. The name is in the text.
- The follow button has its own label: "Follow back Tenzin Doma". It uses `aria-pressed`.
- Mark all read announces once through a polite live region, after the stagger, not per row.
- The empty state is `role="status"` so its text is read when it appears.
- Show all notifications moves focus to the All segment, so focus is not lost when the button disappears.
- Group headers are `h2`, so screen reader users can jump between Today, This week and Earlier.
- Tab order: Mark all read, the three segments, then rows top to bottom, with each follow button after its row.
- Hit targets: segments 48px tall, Mark all read 48px, rows at least 72px, follow button 40px tall plus an invisible 4px extension to 48px.
- Contrast: `#0a0a0a` on white is 19.8:1. `#525252` is 7.8:1. `#737373` is 4.7:1. White on `#e10600` is 4.6:1 at 11px 400, so keep the badge numbers short.
- Red is never the only signal. Unread text is heavier and darker, and the label says "Unread."

## Responsive rules

- Frame is 390x844. Header padding-top is 56px, the first 8px step over the 54px clearance. List padding-bottom is 34px.
- At 360 wide: keep 24px side padding. Text wraps. Time stays on the first line. The segment labels still fit at 14px.
- At 430 wide: nothing changes except text measure.
- If the app has a tab bar, the list padding-bottom becomes the bar height plus 34px. Use `phone-tab-plain` for that bar.
- Tablet: show this list as a 360px column next to the item it opens. Do not stretch rows to 1180px.
- Do not draw a status bar. The padding is the clearance.

## Acceptance checklist

### Always

- [ ] Rows are grouped by time, each group with a sticky `h2` label. Empty groups are hidden.
- [ ] Unread uses three signals: a red dot, heavier text, and "Unread." in the accessible name.
- [ ] Red is used only for unread. No red buttons, no red icons.
- [ ] Tapping a row marks it read. No swipe gestures are needed.
- [ ] Inline actions are sibling buttons, not nested inside the row button.
- [ ] The filter is three toggle buttons with a sliding indicator, 48px tall.
- [ ] Mark all read staggers the visible rows, announces once, then disables itself.
- [ ] A filter with no results shows an empty state with a way back to All.
- [ ] Every spacing value is on the 8px grid. Radii are 6px.
- [ ] Reduced motion makes every change instant and removes the stagger.

### This demo

- [ ] Title "Notifications", 32px 700. Count starts at "5 unread".
- [ ] Segments are All, Mentions, Unread with a red 5 badge.
- [ ] Groups are Today (4 rows), This week (3), Earlier (3).
- [ ] The like batch reads "Mira Okafor and 4 others liked Facade study 07".
- [ ] Tenzin Doma shows Follow back. Oskar Lind shows Following.
- [ ] The billing row reads "Studio plan renews on 12 October. $96.00 will be charged to the card ending 4421."
- [ ] Stagger is 60ms per row. Dot shrink is 160ms.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: All is selected. 10 rows in three groups. 5 are unread: Anaya Rai, Mira Okafor, Tenzin Doma, Studio plan (Today) and Priya Nair (This week). The count reads "5 unread" with the 5 in red. The Unread segment shows a red 5 badge.
2. Unread rows have an 8px red dot 8px from the left edge, 32px from the row top, and text at weight 500 in `--ink`. Read rows have no dot and text at weight 400 in `--ink-2`. Names are always 600 `--ink`.
3. Tap any unread row. Its dot scales from 1 to 0 over 160ms. Its text goes to read style over 200ms. The count and badge drop by one.
4. Tap Follow back on Tenzin Doma. The button turns from black fill to white with a 1px black inset ring and reads "Following". The row is also marked read. Tap again to undo the follow. Oskar Lind starts as "Following".
5. Tap Mentions. The black indicator slides under Mentions over 240ms. Only mention rows show: Anaya Rai, Jonas Berg, Lena Park. Groups with no visible rows are hidden. The list scrolls to the top.
6. Tap Unread. Only unread rows show. Tapping one marks it read, and 360ms later it leaves the list.
7. Tap Mark all read. Visible unread dots clear one by one, 60ms apart. Hidden unread rows clear at once. When the last one is done, the count reads "No unread", the badge disappears, Mark all read becomes disabled grey, and a live region says "All notifications marked as read."
8. If the filter is Unread when the list becomes empty, the groups hide 240ms later and the empty state shows: a 48px outlined tick square, "All caught up", one line of help, and a "Show all notifications" button.
9. "Show all notifications" switches the filter to All and moves focus to the All segment.
10. Group headers are sticky at the top of the scroll area.

## Tokens

```css
:root {
  /* colour */
  --bg: #ffffff;      /* page and sticky headers */
  --ink: #0a0a0a;     /* text, rules, indicator, buttons */
  --ink-2: #525252;   /* read text, quotes */
  --ink-3: #737373;   /* times, group labels, disabled */
  --line: #e5e5e5;    /* row rules */
  --fill: #f4f4f4;    /* avatar fill, row hover */
  --red: #e10600;     /* unread only */
  --focus: #0a0a0a;

  /* type */
  --sans: "Inter", system-ui, -apple-system, sans-serif;

  /* grid: 8px. Allowed steps 8 16 24 32 40 48 56 64 72 80 */
  --s1: 8px; --s2: 16px; --s3: 24px; --s4: 32px; --s5: 40px; --s6: 48px;

  /* shape */
  --r: 6px;          /* avatars, segmented, buttons */
  --r-inner: 3px;    /* indicator, type badge, filter badge */

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --dot: 160ms;
  --text: 200ms;
  --slide: 240ms;
  --stagger: 60ms;
}
```

The only exceptions to the 8px grid are the 3px inset inside the segmented control and the 4px offset of the type badge. Every row, gap and padding is a multiple of 8.

## Typography

One family, Inter, with `cv11` and `ss01` on for single-storey a and straight digits.

| Role | Size / line | Weight | Tracking | Colour | Case |
| --- | --- | --- | --- | --- | --- |
| Title | 32 / 40 | 700 | -0.025em | `--ink` | sentence |
| Count | 13 / 24 | 400, number 600 | 0 | `--ink-2`, number `--red` | |
| Mark all read | 14 / 48 | 600 | 0 | `--ink`, 1px underline at 4px | sentence |
| Segment | 14 | 600 | 0 | `--ink`, selected `#fff` | sentence |
| Filter badge | 11 / 16 | 400 | 0 | `#fff` on `--red` | tabular |
| Group label | 11 / 16 | 600 | 0.1em | `--ink-3` | upper |
| Row text unread | 14 / 24 | 500 | 0 | `--ink` | |
| Row text read | 14 / 24 | 400 | 0 | `--ink-2` | |
| Name | 14 / 24 | 600 | 0 | `--ink` | |
| Quote | 13 / 16 | 400 | 0 | `--ink-2` | |
| Time | 12 / 24 | 400 | 0 | `--ink-3` | tabular |
| Initials | 13 | 600 | 0.02em | `--ink` | upper |
| Follow button | 13 | 600 | 0 | `#fff` on `--ink` | sentence |
| Empty title | 24 / 32 | 700 | -0.02em | `--ink` | |

Line heights are 16, 24, 32 or 40 so text sits on the 8px grid.

## Implementation notes

The row is an `li` with two sibling buttons. The follow button sits over the bottom of the row with absolute positioning, so the whole row stays tappable and the HTML stays valid:

```html
<li class="row unread" data-t="follow">
  <span class="dot" aria-hidden="true"></span>
  <button class="hit" type="button">avatar, text, time</button>
  <button class="fb" type="button" aria-pressed="false"
          aria-label="Follow back Tenzin Doma">Follow back</button>
</li>
```

```css
.row { position: relative; }
.row.has-btn .hit { padding-bottom: 64px; }
.fb { position: absolute; left: 80px; bottom: 16px; height: 40px; }
.fb::before { content: ""; position: absolute; inset: -4px -2px; } /* 48px target */
```

Mark all read changes classes on a timer, then updates the shared count once:

```js
const visible = rows.filter(r => r.classList.contains('unread') && !r.hidden);
const step = reduce ? 0 : 60;
visible.forEach((r, i) => setTimeout(() => r.classList.remove('unread'), i * step));
rows.filter(r => r.hidden).forEach(r => r.classList.remove('unread'));
setTimeout(() => {
  syncCount();                 // text, badge, disabled state
  live.textContent = 'All notifications marked as read.';
  if (filter === 'unread') setTimeout(applyFilter, reduce ? 0 : 240);
}, visible.length * step);
```

The dot is always in the DOM. Unread only changes its scale, so the row never shifts:

```css
.dot { position: absolute; left: 8px; top: 32px; width: 8px; height: 8px;
  border-radius: 50%; background: var(--red);
  transform: scale(0); transition: transform 160ms var(--ease); }
.unread .dot { transform: scale(1); }
```

The filter indicator is one element moved by `translateX(i * 100%)`. Its width is `(100% - 6px) / 3` because of the 3px inset on each side.

Common mistakes:

- Removing the row from the Unread filter the instant it is tapped. Wait 360ms so the user sees it go read first.
- Updating the count once per row during the stagger. Update once at the end.
- Red time stamps, red icons, or a red Mark all read link. Red means unread, nothing else.
- Card shadows around rows. Use 1px rules.
- Round avatars. This family uses 6px squares.
- Nesting the Follow back button inside the row button.
- Using a tablist for the filter.
- A swipe-to-dismiss gesture. This piece is tap only. Swipe actions are `ios-swipe-row-actions`.
- Leaving an empty group label on screen after filtering.
- Breaking the grid with 12px or 20px gaps.

Rebuild order:

1. Tokens and the 8px scale.
2. Fixed header with title, count, link and filter.
3. Scrolling list with three groups and sticky labels.
4. The four row types, with the dot and the follow button as siblings.
5. Tap to read and the count sync.
6. Filter logic, group hiding, empty state.
7. Mark all read with the stagger and the live region.
8. Reduced motion and a keyboard pass.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
