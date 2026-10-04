<!-- Design Lounge Nº 095 · "Audit activity log" · designlounge.vercel.app -->

# Audit activity log

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Keep the four filters and the row anatomy.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The activity screen for an ops tool. A title "Activity" and four pills: All, Access, Changes, Denied. All starts pressed. Below, six events. Each row is a mono timestamp, an 8px dot, a bold verb plus a sentence, and a badge. Filtering hides rows that are not that kind. Nothing animates. It should read like a yard log, not a social feed.

## Structure

```
header: h1 Activity | pill group
ol
  time 148px | dot | sentence | badge
```

- Filters are a group labelled "Filter events". Each pill is a `button` with `aria-pressed`.
- The log is an `ol` of `li`.
- Time is a `time` element. The visible text is HH:MM:SS. A full datetime attribute is optional.

## Motion

None. Filtering is instant. Reduced motion changes nothing.

## States

- Pill pressed and not pressed.
- Row visible or hidden by filter.
- Badge and dot variants: info, warning, danger. There is no success badge in this piece.

## Accessibility

- The pill group has an accessible name.
- Pressed state is `aria-pressed`, not only a colour change.
- The verb is text, so the dot is not the only signal.
- `--info`, `--warning`, and `--danger` on their soft backgrounds must stay at or above 4.5.
- Do not auto-refresh the log in the demo.

## Responsive rules

- At 1280 the row is four columns: 148px, 16px, fluid text, badge.
- At 768 the timestamp stays on the left.
- Below 640 the badge wraps under the sentence, and the timestamp column shrinks to 96px with the same mono size.

## Acceptance checklist

- [ ] Six events render in the listed order.
- [ ] All is pressed on load.
- [ ] Access, Changes, and Denied each hide the other kinds.
- [ ] Timestamps are IBM Plex Mono. Prose is IBM Plex Sans.
- [ ] Dots are 8px. Badges name the kind in words.
- [ ] Pressed pill is ink on background, not a second palette.
- [ ] Hidden rows stay in the DOM.
- [ ] No motion, no emoji, no avatar images.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: All is `aria-pressed="true"`. Six rows visible, newest conceptually at the top as listed: 09:41 sign-in through 10:22 password failure.
2. Click Access: only rows with kind info remain. Changes shows warning rows. Denied shows danger rows. All shows every row.
3. The pressed pill is ink fill with background-coloured text. The others are white with a hairline.
4. Dots: info `#1e4f78`, warning `#8a5a10`, danger `#8d2f2f`. Badges use the matching soft fill and the same ink.
5. Rows that do not match get `display: none`. Do not remove them from the DOM.
6. There is no pagination and no search in this piece.
7. Focus ring is 2px `--focus` with 2px offset on the pills.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --ink-3: #8a847a;
  --line: #e4dfd4;
  --primary: #1f4d3a;
  --danger: #8d2f2f;
  --danger-soft: #f8e8e6;
  --warning: #8a5a10;
  --warning-soft: #f8efd8;
  --info: #1e4f78;
  --info-soft: #e7f0f7;
  --focus: #1f4d3a;
  --font-text: "IBM Plex Sans", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
}
```

## Typography

- Title: IBM Plex Sans 500, 28px, tracking -0.03em.
- Verb: 14px, weight 600. The rest of the sentence is 14px, `--ink-2`.
- Timestamp: IBM Plex Mono 12px, `--ink-3`, column width 148px.
- Badge: 11px, weight 600, height 22px, padding 0 8px, pill radius.
- Pills: 12px, weight 500, height 32px.

## Implementation notes

Store the kind on `data-kind`. The filter buttons use `data-f` of `all`, `info`, `warning`, or `danger`. One listener can serve every pill.

Do not colour the whole row. The signal is the dot, the badge, and the verb. A full-row danger wash makes a log unreadable at fifty lines.

In the product, append new events at the top without resetting the active filter.

Rebuild in this order:

1. Page `#f6f4ef`. Title padding 22px 32px 12px. Title 28px, weight 500, tracking -0.03em.
2. Pills height 32, padding 0 12px, radius 999px, 12px weight 500. Rest fill white, border `#e4dfd4`, text `#5a554c`.
3. Pressed pill fill `#161513`, text `#f6f4ef`, border the same ink.
4. List padding 0 32px 32px.
5. Row grid `148px 16px 1fr auto`, padding 12px 0, top rule `#e4dfd4`.
6. Time IBM Plex Mono 12px `#8a847a`.
7. Dot 8px circle, margin-top 6. Info `#1e4f78`. Warning `#8a5a10`. Danger `#8d2f2f`.
8. Verb 14px weight 600. Remainder 14px `#5a554c`.
9. Badge height 22, padding 0 8px, radius 99px, 11px weight 600.
10. Access badge fill `#e7f0f7` ink `#1e4f78`. Change badge fill `#f8efd8` ink `#8a5a10`. Denied badge fill `#f8e8e6` ink `#8d2f2f`.
11. The six times are 09:41:12, 09:44:03, 09:51:40, 10:02:18, 10:16:55, 10:22:07.
12. Verbs, in order: Signed in, Rate changed, Export denied, Key copied, Member invited, Password failed.
13. Kinds in that order: info, warning, danger, info, warning, danger.
14. Filtering uses display none. Rows stay in the DOM.
15. Do not add avatars, a search field, or a live clock.

Common mistakes to avoid:

- Sorting the list when a filter is clicked. Order stays as authored.
- Removing denied rows from the DOM. They are display none.
- Using red text for the whole "Export denied" sentence. The verb stays ink. The badge carries the status colour.
- A 16px dot. The dot is 8px.
- Making All a dropdown. It is one of four pills.
- Adding pagination after six rows.
- Live-updating the clock in the timestamps.
- Using a table element. This is an ordered list.
- Giving every row a card shadow.
- Translating the verbs. Keep the six verbs as written.
- Filtering with opacity 0. Hidden rows must not take space and must not be readable as if present.
- Adding a fifth pill for Success. This log has access, change, and denied.
- Rewriting "Rate changed" as "Updated". Keep the verb.
- Putting the badge before the sentence. The badge is the last column.
- Using 13px for the timestamp. It is 12px mono.
- Collapsing the 148px time column at 1280. That column is for the desktop frame.
- Adding a row hover that covers the badge. Hover is not part of this piece.
- Centering the title. It is left aligned with the list's 32px padding.
- Giving Denied a heavier font than the other verbs. All verbs are weight 600.
- Inserting a date header between morning and the later events. The list is one sequence.
- Colouring the page title green. The title is ink. Green is not a brand fill here.
- Making the pills 40px tall. They are 32px.
- Adding a divider under the header besides the first row's top rule.
- Exporting the log from a button. There is no export control on this screen.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
