<!-- Design Lounge Nº 128 · "Mobile inbox list" · designlounge.vercel.app -->

# Mobile inbox list

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens and use the component field and tab rules. Keep the list, the sheet, and the tab bar.

## What it is

The inbox of a yard operations app on a phone. The Lounge draws the device chrome, so this screen does not draw a status bar. It leaves 54px at the top. A 32px title "Inbox", a 40px search field, then message rows at least 72px tall. Unread rows use `--primary-soft` and an 8px dot. Tapping a row opens a sheet with the sender and the full line, and clears the unread state. A 64px tab bar sits at the bottom with 18px of that reserved above the home indicator. Inbox is current.

## Reference behaviour

1. Initial state: two unread rows (Mira Lama, Yard desk) and two read rows. Inbox tab is `aria-current="page"`.
2. Typing in search filters rows by their visible text, case-insensitive. Non-matches are `display: none`.
3. Tap a row: remove the unread class and hide the dot, show the sheet with that sender as the title and `data-body` as the paragraph.
4. Back hides the sheet and shows the list again. The row stays read.
5. Tab buttons set `aria-current` on the pressed one and clear it on the others. They do not navigate away in the demo. The list stays.
6. Search field height 40px, radius 10px, fill `--surface-2`, no border.
7. Avatar is initials on `#2c241c`, 44px circle. No photos.
8. Do not draw a notch, a clock, or a browser bar.

## Structure

```
390 × 844
padding-top 54
title row, padding 0 20
search, margin 8 20 12, height 40
list flex 1
tab bar 64, padding-bottom 18
sheet covers the list, from top 54 to bottom 64, when open
```

- Rows are `button` elements so they are in the tab order.
- Tabs are a `nav` labelled "Sections".
- The sheet starts hidden.

## Tokens

```css
:root {
  --bg: #f4f1ea;
  --surface: #fffdf8;
  --surface-2: #efeae0;
  --ink: #1b1814;
  --ink-2: #5e574e;
  --ink-3: #8d857a;
  --line: #e3dbcf;
  --primary: #8a4b12;
  --primary-soft: #f4e4d4;
  --focus: #8a4b12;
  --font-text: "IBM Plex Sans", system-ui, sans-serif;
  --safe-top: 54px;
  --tab: 64px;
  --row: 72px;
}
```

## Typography

- Title: IBM Plex Sans 600, 32px, tracking -0.03em.
- Name: 15px, weight 600.
- Preview: 13px, `--ink-2`, one line, ellipsis.
- Time: 12px, `--ink-3`.
- Tabs: 11px, weight 500. Current tab weight 600, colour `--primary`.
- Sheet title: 28px, weight 600, tracking -0.03em.
- Back: 15px, weight 600, `--primary`, height 40px.

## Motion

None in this piece. The sheet appears. Do not add a spring. Reduced motion changes nothing.

## States

- Row unread (`--primary-soft` plus dot) and read (surface, dot hidden).
- Search filters the list.
- Sheet open or hidden.
- One tab current.

## Accessibility

- Search has the label "Search threads".
- Rows are buttons. The visible name includes the sender.
- Tab bar is a nav with an accessible name.
- Current tab is `aria-current="page"`.
- Back is a button, not a disguised div.
- Preview ellipsis does not remove the text from the accessibility tree. The sheet shows the full sentence.
- Minimum row height 72px. Tab bar content sits above the 18px home-indicator padding.
- `--ink` on `--primary-soft` stays above 4.5.

## Responsive rules

- This is a 390-wide phone screen. At 360, horizontal padding stays 20px and the preview ellipsis tightens. Do not introduce a second column.
- If the same screen is shown at tablet width, cap the list at 480px and center it. Do not stretch rows across 1180px.
- The 54px top pad remains, because the device chrome is drawn outside this document.

## Acceptance checklist

- [ ] Top padding is 54px. No fake status bar.
- [ ] Title is 32px. Search is 40px.
- [ ] Two rows start unread with a dot and a soft fill.
- [ ] Search hides non-matching rows.
- [ ] Opening a row clears unread and shows the full message.
- [ ] Back returns to the list.
- [ ] Tab bar is 64px with Inbox current.
- [ ] Type is IBM Plex Sans only.
- [ ] Avatars are initials, 44px.

## Implementation notes

The sheet is `position: fixed` between the top safe area and the tab bar. Do not cover the tab bar. Back must remain reachable.

Mark unread with a class, not by guessing from the dot. Removing the class hides the dot via CSS.

In a product build, the other tabs can change the list. In this demo they only move `aria-current`, so the inbox remains the specimen.

Rebuild in this order:

1. Canvas 390 by 844. Background `#f4f1ea`. Padding-top 54. No status bar, no clock, no notch.
2. Title Inbox, 32px, weight 600, tracking -0.03em, padding 0 20px.
3. Search height 40, radius 10, fill `#efeae0`, no border, margin 8px 20px 12px. Placeholder "Search threads".
4. List background `#fffdf8`.
5. Row min-height 72, padding 12px 20px, grid 44px, fluid, auto, gap 10. Bottom rule `#e3dbcf`.
6. Avatar 44px circle, fill `#2c241c`, initials 13px weight 600, colour `#f4efe6`.
7. Name 15px weight 600. Preview 13px `#5e574e`, one line, ellipsis.
8. Time 12px `#8d857a`.
9. Unread fill `#f4e4d4`. Dot 8px `#8a4b12`, aligned to the end, margin-top 8. Read rows hide the dot.
10. Mira Lama and Yard desk start unread. Asha Karki and Rajan Shrestha start read.
11. Times: 09:41, 08:12, Yesterday, Mon.
12. Sheet is fixed from top 54 to bottom 64, padding 20, background `#f4f1ea`.
13. Back is 40px tall, weight 600, colour `#8a4b12`. Sheet title 28px weight 600.
14. Tab bar height 64, padding-bottom 18, fill `#fffdf8`, top rule `#e3dbcf`, four equal columns.
15. Tab label 11px. Current is weight 600 colour `#8a4b12`. Others weight 500 colour `#8d857a`. Labels: Inbox, Runs, People, You.

Common mistakes to avoid:

- Drawing a status bar or a home indicator. The Lounge frame does that.
- Covering the tab bar with the sheet.
- Leaving the unread fill on after the sheet opens.
- Using photos for avatars.
- A glass tab bar. This screen's bar is a solid surface and a 1px rule.
- Swiping to delete. That is a different piece.
- Making search a second screen. It filters in place.
- Animating the sheet up. It appears.
- Shrinking the row under 72px to fit four messages with room to spare. Extra space stays empty below the list.
- Putting the time on the left. Time is in the trailing column.
- Using a serif for the title. The face is IBM Plex Sans.
- Navigating the Runs tab to an empty page in the demo. It only takes aria-current.
- Reducing the top pad below 54px.
- Using a 36px avatar. It is 44px.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
