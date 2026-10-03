<!-- Design Lounge Nº 136 · "People by role" · designlounge.vercel.app -->

# People by role

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Keep the four people, the role pills, and the empty line.

## What it is

The people screen for a yard company. A title, one primary Invite button, a search field, and pills for All, Dispatch, Finance, and Yard. Four people in a white card: initials, name, email, role badge, last seen. Search and the role pill combine. If nobody matches, the card stays and a line under it reads "No one in that role. Clear the filter." Invite changes its label to "Invite sent". No modal in this piece.

## Reference behaviour

1. All is pressed. Four rows visible. Search is empty.
2. Typing filters by the row's visible text, case-insensitive.
3. A role pill shows only that role. All clears the role constraint. Search still applies.
4. Zero matches shows the empty line. Rows that fail are `display: none` and stay in the DOM.
5. Invite sets its own text to "Invite sent" and disables nothing else. It does not append a person.
6. Pressed pill is ink fill with background-coloured text. Others are white with a hairline.
7. Avatars are initials on `#2c241c`. No photos.
8. Focus ring 2px `--focus`, offset 2px.

## Structure

```
header: People | Invite
tools: search 240×36 | pills 32px
card of rows, min-height 64
empty paragraph
```

- Search is `type="search"` labelled "Search by name".
- Pills are buttons with `aria-pressed`.
- Each person is an `li`.

## Tokens

```css
:root {
  --bg: #f4f1ea;
  --surface: #fffdf8;
  --ink: #1c1915;
  --ink-2: #5e574e;
  --ink-3: #8a8176;
  --line: #e0d8cc;
  --primary: #8a4b12;
  --primary-ink: #fffdf8;
  --primary-soft: #f3e6d8;
  --focus: #8a4b12;
  --font-text: "IBM Plex Sans", system-ui, sans-serif;
  --radius: 8px;
}
```

## Typography

- Title: IBM Plex Sans 500, 28px, tracking -0.03em.
- Invite: 14px weight 500, height 36, radius 6, fill `#8a4b12`, ink `#fffdf8`.
- Name: 14px weight 600. Email: 12px `--ink-2`.
- Role badge: 11px weight 600, height 22, fill `#f3e6d8`.
- Last seen: 12px `--ink-3`.
- Pills: 12px, height 32.
- One face only. No mono.

## Motion

None. Filtering is instant.

## States

- Pill pressed or not.
- Row visible or hidden.
- Empty line hidden or shown.
- Invite label "Invite" then "Invite sent".
- No row selection.

## Accessibility

- Search has an accessible name.
- Role group does not need a menu role. Pressed state is enough.
- Empty line is text, not only a blank card.
- Avatar initials are visible. The name next to them is the accessible name of the row's text.
- Contrast of `#1c1915` on `#fffdf8` is above 4.5.
- Row min-height 64px.

## Responsive rules

- At 1280 the card margin is 0 32px and the row is four columns: 40px, fluid, role, seen.
- At 768 the search field becomes full width on its own row. Pills wrap.
- Below 640 the last-seen column drops under the email, and Invite becomes full width under the title.

## Acceptance checklist

- [ ] Four people render with the roles Dispatch, Finance, Yard, Dispatch.
- [ ] All starts pressed.
- [ ] Search and role filter combine.
- [ ] Empty copy appears when nothing matches.
- [ ] Invite changes to "Invite sent" and does not add a row.
- [ ] Avatars are 40px initials, not photos.
- [ ] The card radius is 8px. The pills are fully round.
- [ ] One typeface, IBM Plex Sans.
- [ ] One solid button, the invite.

## Implementation notes

Store the role on `data-role`. The All pill uses `data-role="all"`.

Rebuild order:

1. Page `#f4f1ea`, padding via header 22px 32px 8px.
2. Title People, 28px, weight 500.
3. Invite height 36, radius 6, fill `#8a4b12`.
4. Search width 240, height 36, radius 6, border `#e0d8cc`, fill `#fffdf8`.
5. Pills height 32, radius 99px.
6. Card margin 0 32px, radius 8, border `#e0d8cc`, fill `#fffdf8`.
7. Row grid `40px 1fr auto auto`, min-height 64, padding 0 16px.
8. People: Mira Lama Dispatch Today, Asha Karki Finance Yesterday, Rajan Shrestha Yard Mon, Nima Gurung Dispatch Invited.
9. Emails end in @yard.test.
10. Empty sentence sits under the card, 14px `#5e574e`, hidden until the count is 0.

Common mistakes:

- Opening an invite modal. The button only changes its label.
- Photos from a CDN.
- A second button in the row, such as Remove.
- Zebra stripes.
- Hiding the card when empty. The card remains. The sentence appears under it.
- Using serif for names.
- Making Finance a different badge colour from Dispatch. All role badges share `--primary-soft`.
- Adding a fifth person on invite.
- A checkbox column for bulk actions.
- Sorting arrows on Name and Seen.
- A second search field for email.

Copy you keep, in this order:

1. Title is "People".
2. Primary button starts as "Invite" and becomes "Invite sent".
3. Search placeholder is "Search by name".
4. Pills read All, Dispatch, Finance, Yard.
5. Mira Lama, mira@yard.test, Dispatch, Today.
6. Asha Karki, asha@yard.test, Finance, Yesterday.
7. Rajan Shrestha, rajan@yard.test, Yard, Mon.
8. Nima Gurung, nima@yard.test, Dispatch, Invited.
9. Initials are ML, AK, RS, NP.
10. Avatar fill is `#2c241c`. Avatar text is `#f4efe6`.
11. Empty sentence is "No one in that role. Clear the filter."
12. Card margin is 0 32px.
13. Row min-height is 64px.
14. Pressed pill fill is `#1c1915` with page-colour text.
15. Role badge fill is `#f3e6d8` for every role.
16. There is no row action, no checkbox, and no pagination.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
