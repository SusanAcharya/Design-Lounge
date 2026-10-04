<!-- Design Lounge Nº 283 · "Issue index" · designlounge.vercel.app -->

# Issue index

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the column is the pass column and the pressed topic uses `--primary-soft`. This is a list of notes. The magazine front is `magazine-editorial-grid`.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The index of Field Index, not a front spread. A kicker, a 48px serif title "Four notes", then four topics: All, City, Desk, Kitchen. All starts pressed. Under that, four essays in a 720px column, each a date and a serif headline with one sentence. Newest first: The frost line on 3 Oct 2026, A desk by the window on 19 Sep 2026, Bread before noon on 2 Sep 2026, What the river kept on 14 Aug 2026. City leaves the frost line and the river. Desk leaves the window. Kitchen leaves the bread. The links do not leave the frame.

## Structure

```
padding 48px 64px
FIELD INDEX                  12px
Four notes                   48px serif
[ All ] [ City ] [ Desk ] [ Kitchen ]   40px
column 720
  3 Oct 2026     The frost line
  19 Sep 2026    A desk by the window
  2 Sep 2026     Bread before noon
  14 Aug 2026    What the river kept
```

- Each essay is an `article` with a `time` and an `h2` inside a link.
- The date column is 140px. The headline takes the rest.
- A hairline sits on top of each article.

## Motion

None. A topic hides rows in one frame. Reduced motion has nothing to remove. Do not fade the list.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Topic | click | pressed chip, which articles show |
| Headline | click | no navigation in the demo |
| Focus | keyboard | 2px ring |

## States

- Topic resting: height 40px, padding 0 14px, 1px `--line`, transparent, radius 2px.
- Topic pressed: background `--primary-soft`, border transparent, `aria-pressed="true"`.
- Article: padding 16px 0, min-height 72px, 1px `--line` on top.
- Link: no underline. The headline is the link.
- Focus-visible: 2px outline, offset 2px.
- Do not paint the pressed topic as a solid primary button. The page has no commit button. The topic is a filter.

## Accessibility

- Each topic is a button with `aria-pressed`.
- Each date is a `time` with a `datetime`.
- Hidden articles use the `hidden` attribute.
- The headline is an `h2` inside the link, so the link's name is the headline.
- Hit target: topics are 40px. The article link is at least 72px tall.
- Contrast: `#3e4a5c` on `#f7f4ee` and `#1c2430` on `#e4eef5` clear 4.5.
- The kicker is uppercase by letter-spacing, not by a second font. The words are "FIELD INDEX" in this demo. A product may use sentence case. Do not add a second tracking rule on top of the pairing once a kit is locked. This 0.06em is the demo kicker only.

## Responsive rules

- At 1280 the column is 720px, padding 48px 64px. That is the pass column.
- Below 640 the date stacks above the headline. The column is full width inside 20px padding. The title may step down to 36px. It stays the largest type.
- Topics wrap. They do not become a select.
- Another screen in the same pass uses the same 720px column.

## Acceptance checklist

- [ ] The title is Four notes at 48px Newsreader.
- [ ] The column is 720px.
- [ ] The four headlines and dates match the copy below, newest first.
- [ ] All starts pressed. City shows two notes. Desk shows one. Kitchen shows one.
- [ ] The pressed topic is `#e4eef5`, not a solid fill.
- [ ] Topics are 40px tall, radius 2px.
- [ ] A headline click does not leave the frame.
- [ ] Hidden notes use the hidden attribute.
- [ ] Focus ring is 2px, offset 2px.
- [ ] There is no magazine spread and no animation.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. All is `aria-pressed="true"`. Four articles show, in the date order above.
2. City hides the desk and the kitchen. Desk hides the other three. Kitchen hides the other three.
3. One topic is pressed. Pressing another releases the rest.
4. The pressed topic is pale blue, `#e4eef5`, which becomes `--primary-soft` when a theme is locked.
5. Clicking a headline does not navigate away. In a product the link opens that essay. The essay page is `paper-article-reader` in structure, with this index's own words.
6. There is no animation. Focus ring is 2px `--focus`, offset 2px.
7. An empty topic does not exist in this demo. Every chip has at least one note.

## Tokens

```css
:root {
  --bg: #f7f4ee;
  --ink: #1c2430;
  --ink-2: #3e4a5c;
  --line: #ddd6c8;
  --primary-soft: #e4eef5;
  --focus: #1e4a6e;
  --serif: "Newsreader", Georgia, serif;
  --sans: "Public Sans", system-ui, sans-serif;
}
```

Topic radius is 2px in this demo. The family replaces it. A pill topic survives only when the family's button is already a pill. The title is the display face. The dates and the sentences are the text face.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Kicker | sans | 12px | 500 | `--ink-2` |
| Title | serif | 48px | 500 | `--ink` |
| Topic | sans | 13px | 500 | `--ink` |
| Date | sans | 13px | 400 | `--ink-2` |
| Headline | serif | 28px | 500 | `--ink` |
| Sentence | sans | 16px | 400 | `--ink-2` |

The kicker letter-spacing is 0.06em. The title is the largest type. Headlines are not the same size as the title. The sentence measure stays under 52ch.

## Implementation notes

One topic value. Hide with the attribute.

```js
row.hidden = topic !== 'all' && row.dataset.topic !== topic;
```

Common mistakes:

- Rebuilding the magazine grid and calling it an index. The front is `magazine-editorial-grid`.
- Four equal cards with images. This list is type.
- Pill topics on a square family.
- A pressed topic in solid brand colour.
- Dates in a second calendar system mixed into the same list. These are AD dates. A BS date is labeled once, on a product that uses BS, and not mixed into one line with October.
- Links that navigate the demo iframe away.
- A 640px column beside a 720px page.

Where it sits in a product:

1. It is the list of essays. The essay itself is a reader, `paper-article-reader`, with the product's own column.
2. The title is the largest type. Headlines step down.
3. Topics use the family's radius and `--primary-soft` when pressed.
4. The column is the pass column, 720px in this demo.
5. When a theme is locked, the paper and the pale fill become that theme. The serif becomes the pairing's display face.
6. Do not add a hero image above the title.
7. Four notes is this issue. A product lists the notes it has. Do not invent a fifth to fill the page.
8. The close of this page, if it asks for an address, is `newsletter-close-band`, not a second form in the index.
9. Keep the credit line on the token block.
10. City, Desk, and Kitchen are the only topics. A note has one topic.

Rebuild order:

1. Set the paper, Newsreader, and Public Sans.
2. Place the kicker, the title, and the four topics.
3. Place the four articles in the 720px column.
4. Wire the topics.
5. Prevent the demo links from navigating.
6. Map the pressed fill and the radius onto the kit.

Copy you keep:

1. FIELD INDEX.
2. Four notes.
3. All, City, Desk, Kitchen.
4. The frost line. 3 Oct 2026. Where the hill road holds ice after the valley has thawed.
5. A desk by the window. 19 Sep 2026. The afternoon light lasts forty minutes and then it is gone.
6. Bread before noon. 2 Sep 2026. The first loaf is for the house. The second is for the neighbour.
7. What the river kept. 14 Aug 2026. A stone jetty, a lost oar, and the mark of last monsoon.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
