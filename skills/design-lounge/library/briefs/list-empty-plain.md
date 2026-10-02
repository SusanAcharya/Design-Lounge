<!-- Design Lounge Nº 164 · "Plain list empty" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Plain list empty

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Keep one button.

## What it is

The empty state of a runs list in an ops tool. A 64px header says Runs. The rest of the page is paper, and the message sits in the centre of that space: "No runs today", one sentence, and a single primary button, New run. There is no drawing, no inbox tray, and no second button. New run changes its label to "Run opened" and disables. Use this when a table or a list has zero rows. Use the illustrated empty only when the product is a consumer inbox and that piece was named.

## Reference behaviour

1. First frame is the empty message, centred. The header is already there.
2. New run sets its text to "Run opened" and disables. Opacity follows the disabled attribute, about 0.55.
3. It does not insert a row. The empty copy stays.
4. No motion.
5. Focus ring 2px `--focus`, offset 2px.
6. The message block is at most 360px wide and centre-aligned.
7. One button. Do not add "Learn more".

## Structure

```
header 64px: Runs
well, grid place-items center
block max-width 360, text-align center
h2, sentence, button
```

- The header is a real `header`. The title is an `h1` even at 20px, because the page has one title.
- The empty heading is an `h2`.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --line: #e4dfd4;
  --primary: #1f4d3a;
  --primary-ink: #f6f4ef;
  --focus: #1f4d3a;
  --font-text: "IBM Plex Sans", system-ui, sans-serif;
  --radius: 2px;
}
```

## Typography

- Header title: IBM Plex Sans 500, 20px.
- Empty heading: 22px, weight 500, tracking -0.02em.
- Sentence: 14px, `--ink-2`, margin 0 0 18px.
- Button: 14px, weight 500, height 36px, radius 2px, fill `#1f4d3a`, ink `#f6f4ef`.
- One face. No italic display word.

## Motion

None. Reduced motion changes nothing.

## States

- Button "New run", enabled.
- Button "Run opened", disabled.
- The heading and sentence do not change.

## Accessibility

- The empty heading is text, not an image.
- The button has a visible label.
- Header and empty region are in the document, not a dialog.
- Contrast of `#5a554c` on `#f6f4ef` must stay at or above 4.5. If a locked theme's `--ink-2` fails, use that theme's `--ink`.
- Button height 36px on web. On a phone rebuild, use 44px.

## Responsive rules

- At 1280 the header padding is 0 32px and the message is centred in the remaining height.
- At 768 the same centring holds.
- Below 640 the message padding is 20px and the button can be full width of the 360px block.

## Acceptance checklist

- [ ] Header reads Runs and is 64px tall.
- [ ] Heading is "No runs today".
- [ ] Sentence is "The yard is clear. A new load shows up in this list."
- [ ] One button, "New run".
- [ ] The button becomes "Run opened" and disables.
- [ ] No illustration, no second button, no emoji.
- [ ] The block is centred and max 360px.
- [ ] One typeface, IBM Plex Sans.
- [ ] Radius on the button is 2px.

## Implementation notes

Do not mount a table with zero rows and a sentence inside the first cell. The empty state replaces the list.

Rebuild order:

1. Page `#f6f4ef`. Header white, 64px, bottom rule `#e4dfd4`.
2. Header padding 0 32px. Title 20px weight 500.
3. The well is `flex: 1` and `display: grid; place-items: center`.
4. Block max-width 360px, `text-align: center`.
5. Heading 22px, margin 0 0 8px.
6. Sentence colour `#5a554c`, margin 0 0 18px.
7. Button height 36, padding 0 14px, radius 2, no border.
8. Disabled opacity 0.55.
9. Do not add a search field to this screen.
10. Do not add a sidebar. The header is the chrome.

Copy you keep:

1. Title "Runs".
2. Heading "No runs today".
3. Sentence "The yard is clear. A new load shows up in this list."
4. Button "New run" then "Run opened".
5. Fill `#1f4d3a`, label `#f6f4ef`.
6. Block width 360px.
7. Header height 64px.
8. No count badge in the header.
9. No illustration path.
10. No link under the button.

Common mistakes:

- A line drawing of a box or a tray. That is the other empty piece.
- Two buttons.
- "Oops" or "Nothing here yet!" with a bang.
- An italic word in a serif.
- Centring the header title. The header title stays at the start.
- Replacing the whole page with a 404.
- Adding a row when the button is pressed.
- A dashed border around the message.

Where it sits in a product:

1. Use it when the list request succeeded and the count is zero.
2. Do not use it when the request failed. That is the retry banner.
3. The header of the product stays. Only the list region is replaced.
4. Filters that hide every row can reuse this block, with the same heading.
5. Do not put the empty block inside a table row.
6. The button is the primary of that view. Remove any other primary.
7. On a phone, the block stays centred between the header and the tab bar.
8. Padding around the block is the well, not a card with a shadow.
9. Do not add a help link, a docs URL, or an email address.
10. The illustrated inbox empty is a different piece. Do not merge them.
11. The page background stays `#f6f4ef`. Do not put the message on a gray card.
12. The header rule is 1px `#e4dfd4`.
13. There is no count of zero in the header.
14. There is no avatar, icon, or arrow on the button.
15. Body text is 14px. Do not bump the sentence to 18px.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
