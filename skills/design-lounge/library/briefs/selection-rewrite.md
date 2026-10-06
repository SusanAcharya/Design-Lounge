<!-- Design Lounge Nº 528 · "Rewrite the selected sentence" · www.designlounge.live -->

# Rewrite the selected sentence

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the marker may be a tint of `--primary` and the action button is `--primary`. Keep the marker on the sentence, not on a card around it. This demo uses the numbers below.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A short note on Rowan, a garden almanac. Three sentences read as one paragraph. The first is already marked with `#f3d7a1`, and a button under the paragraph says Shorter. Shorter swaps that sentence for a shorter line the desk already has. The button becomes Restore. Restore puts the long line back. Clicking another sentence moves the marker. The rewrite stays on the sentence that was shortened, so marking it again shows Restore. This is not a confidence pick between two headlines. That card is `card-confidence-pick`. A quote from a source is `cited-answer`. A long article is `paper-article-reader`. A bulk action on table rows is `selection-bar`.

## Structure

```
article  640px, padding 36px 40px 28px
  p.kicker
  h1
  p.note role=group aria-label="Sentences"
    button.line × 3, display inline, separated by a space
  div.bar
    button.act   40px
    span.status  role=status
```

- The sentences are buttons so Enter selects one. They are `display: inline` and `font: inherit` so they read as a paragraph in Newsreader 22px.
- A space text node sits between them. Do not use gaps that break the paragraph.
- The action sits under the paragraph, left aligned with the text. It is not a floating tooltip on the marker.

## Motion

| Thing | Trigger | From | To | Duration | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Marker | click a sentence | previous sentence | the clicked sentence | none | instant |
| Words | Shorter or Restore | one line | the other line | none | instant |

Do not type the short line in. The swap is the action.

## States

- Pressed sentence: background `#f3d7a1`, `aria-pressed="true"`.
- Other sentences: transparent background, `aria-pressed="false"`.
- Action label Shorter when the pressed sentence is the long line. Restore when it is the short line.
- Status empty after a selection move. "Rewrote that sentence." after Shorter. "Restored that sentence." after Restore.
- Focus-visible: 2px `#6b3a2a` outline, offset 3px, on a sentence and on the action.
- The action is hidden only if no sentence is pressed. This demo always has one pressed, including the first frame.

## Accessibility

- The group is named Sentences. Each sentence button's name is its current text.
- One `aria-pressed="true"`.
- The action's name is Shorter or Restore, matching the visible label.
- Status is `role="status"`.
- Focus order: the three sentences, then the action. After a click on a sentence, focus returns to that sentence, because the buttons are rebuilt.
- Do not rely on `window.getSelection`. A dragged highlight is easy to miss and hard to name. The pressed sentence is the selection.
- Contrast: `#2a241c` on `#fffdf8` and on `#f3d7a1`. `#f4f0e6` on `#6b3a2a` for the action.
- Hit target: the action is 40px. Each sentence is a full line at 22px type with 1.45 line-height, so a wrapped sentence is taller than 44px. A sentence that fits on one line is still the whole phrase, not a 22px hit on a side.

## Responsive rules

- ≥1280: the article stays 640px, centred. Heading 40px, sentences 22px.
- 768: same article, page padding 24px.
- <640: the article is `width: calc(100% - 32px)`, padding 24px. Heading 32px. Sentences stay 22px so the marker still reads. The action stays 40px and does not jump to a corner.
- Rebuilding the buttons must put the spaces back, or the paragraph collapses into one word.

## Acceptance checklist

### Always

- [ ] The first frame already has one sentence marked and an action under the paragraph.
- [ ] Marking a sentence does not rewrite it. The action does.
- [ ] Shorter and Restore swap that sentence only.
- [ ] Each sentence remembers whether it is currently the long or the short line.
- [ ] Only one sentence is marked.
- [ ] The sentences still read as one paragraph.
- [ ] The swap is instant. Reduced motion has nothing to shorten.

### This demo

- [ ] Heading is "The south bed".
- [ ] The marked first line begins "The south bed still holds water".
- [ ] Its short line is "The south bed is still wet."
- [ ] Sentence two shortens to "Wait until Friday to turn it."
- [ ] Sentence three shortens to "Leave the beans in the tray."
- [ ] Status is "Rewrote that sentence." or "Restored that sentence."

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Kicker "Rowan · Almanac". Heading "The south bed".
2. Sentence one is pressed and marked: "The south bed still holds water after Tuesday's rain."
3. Sentence two is not marked: "Leave it until Friday before you turn the soil."
4. Sentence three is not marked: "The beans can wait in the tray until the bed dries."
5. The action reads Shorter. The status line is empty.
6. Shorter on sentence one replaces it with "The south bed is still wet." The button reads Restore. Status: "Rewrote that sentence."
7. Restore puts the long line back. Status: "Restored that sentence." The button reads Shorter.
8. Clicking sentence two moves the marker, clears the status, and the button reads Shorter until that sentence has been rewritten. Its short line is "Wait until Friday to turn it."
9. Sentence three's short line is "Leave the beans in the tray."
10. A sentence keeps its own long or short state when the marker moves away and comes back.
11. Only one sentence is pressed. The marker is the pressed state, not a drag selection.

## Tokens

```css
:root {
  --bg: #f4f0e6;
  --surface: #fffdf8;
  --ink: #2a241c;
  --ink-2: #5e564c;
  --line: #e4d8c8;
  --mark: #f3d7a1;
  --accent: #6b3a2a;
  --accent-ink: #f4f0e6;
  --serif: "Newsreader", Georgia, serif;
  --sans: "Outfit", system-ui, sans-serif;
}
```

The action button radius is 2px. The marker radius on a sentence is 2px, padding 1px 3px, so the highlight hugs the words.

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Kicker | Outfit | 12px | 600 | 1 | 0.14em, uppercase |
| Heading | Newsreader | 40px | 600 | 1.05 | -0.02em |
| Sentences | Newsreader | 22px | 500 | 1.45 | 0 |
| Action | Outfit | 14px | 600 | 1 | 0 |
| Status | Outfit | 14px | 400 | 1.4 | 0 |

The sentences inherit the paragraph's face. Do not set them in Outfit or they stop reading as the note.

## Implementation notes

Keep both lines, and a boolean per sentence. Rebuilding the paragraph is safer than editing a text node inside a pressed button:

```js
const pairs = [
  ['The south bed still holds water after Tuesday\u2019s rain.', 'The south bed is still wet.'],
  ['Leave it until Friday before you turn the soil.', 'Wait until Friday to turn it.'],
  ['The beans can wait in the tray until the bed dries.', 'Leave the beans in the tray.']
];
const short = [false, false, false];
```

Paint writes a button per pair, with a space between, and sets `aria-pressed` from the current index. The action label is Restore when `short[current]` is true. After a click on a sentence, focus the pressed button, because paint replaced the node that had focus.

The apostrophe in the first long line is a typographic apostrophe (`\u2019`), matching the printed note. Do not mix it with a straight quote or the restore will look like a different sentence.

Common mistakes:

- A tooltip glued to the mouse. The action is a button under the note, in the tab order.
- Rewriting the whole paragraph. Only the marked sentence changes.
- Forgetting the space text nodes, so three buttons sit as one block.
- Using `selection-bar`. That bar is for checked rows in a table, and its verbs do not rewrite a sentence.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
