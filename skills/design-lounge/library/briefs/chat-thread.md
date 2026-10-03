<!-- Design Lounge Nº 171 · "Chat thread" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Chat thread

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the theme. Incoming and outgoing stay two surfaces, not two brand colours. Phone insets use max(), not an env() fallback.

## What it is

The conversation you open from an inbox. The screen name is Yard desk. The title is Mira. Three messages are on screen: Mira says Gate 4 is clear for the rice. You say send the truck at 16:10. Mira says the driver is Mira and the plate is NA 4 123. Your lines sit on the right on `--primary-soft`. Hers sit on the left on a white surface. The composer is a field and a Send button. Send stays disabled until there is text. This is not the inbox. The inbox is `mobile-inbox-list`. A tablet mail split is `tablet-split-view-mail`.

## Reference behaviour

1. The thread shows those three messages. The field is empty. Send is disabled.
2. Typing anything but whitespace enables Send.
3. Submit, by button or Enter, appends your text as a right-hand message labeled You, clears the field, and disables Send.
4. An empty submit does nothing.
5. There is no typing indicator, no delivered tick, and no animation.
6. Focus ring is 2px `--focus`, offset 2px.
7. The top inset is at least 54px. The bottom inset is at least 34px. Use `max(54px, env(safe-area-inset-top))` and `max(34px, env(safe-area-inset-bottom))`. A plain env() fallback collapses to 0 in a desktop browser.

## Structure

```
390 × 844
padding top max(54px, safe top), sides 20, bottom max(34px, safe bottom)
Yard desk                    12px
Mira                         28px
thread, column, gap 8
  Mira     left, surface, max-width 78%
  You      right, primary-soft
  Mira     left
form
  [ Message the desk ]       44px
  [ Send ]                   44px, primary
```

- The thread is a `ul`.
- Each message is an `li`. The speaker is a span. The text is a text node, so a message cannot inject markup.
- The form submit is prevented. This demo does not post anywhere.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --line: #e4dfd4;
  --line-strong: #cfc6b8;
  --primary: #1f4d3a;
  --primary-ink: #fffdf8;
  --primary-soft: #e7f2ec;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

Bubble radius is 2px in this yard demo. The family replaces it. Do not use a 20px chat bubble on a square family. Your bubble is `--primary-soft` with `--ink` text, not a solid primary with light text. Send is the one solid button.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Where | sans | 12px | 500 | `--ink-2` |
| Title | sans | 28px | 500 | `--ink` |
| Speaker | sans | 12px | 400 | `--ink-2` |
| Message | sans | 15px | 400 | `--ink` |
| Field | sans | 15px | 400 | `--ink` |
| Send | sans | 15px | 500 | `--primary-ink` |

Phone body type is 15px. The where-line letter-spacing is 0.04em.

## Motion

None. A new message appears in one frame. Reduced motion has nothing to remove. Do not animate the bubble in from the side.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Input | text | Send enables |
| Submit | text present | a new You message, field clears |
| Empty | submit | nothing |

## States

- Incoming: align left, background `--surface`, 1px `--line`, padding 10px 12px, radius 2px, max-width 78%.
- Outgoing: align right, background `--primary-soft`, no border, same padding and radius.
- Speaker line: 12px `--ink-2`, above the text.
- Field: height 44px, radius 2px, 1px `--line-strong`, flex 1.
- Send resting: height 44px, fill `--primary`, text `--primary-ink`.
- Send disabled: opacity 0.4, when the field is empty.
- Focus-visible: 2px outline, offset 2px.
- Do not colour outgoing in the brand red. The soft primary is the selection surface. Send carries the solid.

## Accessibility

- The field's name is Message.
- Send's name is Send.
- New text is a text node. Do not use innerHTML.
- The list order is the reading order, oldest first.
- Hit targets: the field and Send are 44px.
- Contrast: `#161513` on `#e7f2ec` and `#fffdf8` on `#1f4d3a` clear 4.5.
- The top and bottom insets keep the title and the composer off the system bars. Do not draw a status bar.

## Responsive rules

- The frame is 390 by 844. At 360 the padding stays 20px and the bubbles stay within 78% of the column.
- If this thread is ever shown on a tablet, cap the column at 720px and align it left. Do not stretch bubbles to the full tablet width.
- The composer stays at the bottom of the column. It is not a second tab bar. A tab bar, if the product has one, is `phone-tab-plain` and this screen is one of its sections.

## Acceptance checklist

- [ ] The label is Yard desk. The title is Mira.
- [ ] Three messages are visible, in order, before any typing.
- [ ] Your messages are on the right, on `#e7f2ec`. Mira's are on the left, on white.
- [ ] Send is disabled while the field is empty.
- [ ] Sending adds the typed text as a You message and clears the field.
- [ ] Empty submit does nothing.
- [ ] The field and Send are 44px tall.
- [ ] Top padding is at least 54px. Bottom padding is at least 34px, via max() with the safe-area inset.
- [ ] Bubbles are radius 2px, not a large pill, until a family says otherwise.
- [ ] There is no tick, no typing indicator, and no animation.
- [ ] The new message is text, not HTML.

## Implementation notes

Build the node yourself.

```js
const li = document.createElement('li');
li.className = 'me';
li.append(who, document.createTextNode(text));
```

The phone inset:

```css
padding: max(54px, env(safe-area-inset-top)) 20px max(34px, env(safe-area-inset-bottom));
```

Common mistakes:

- `env(safe-area-inset-top, 54px)`, which becomes 0 when the inset exists and is 0.
- A solid primary bubble, so every sentence looks like a button.
- Send enabled on an empty field.
- innerHTML, so a message can break the layout.
- A second conversation style beside the inbox.
- Timestamps on every line when the thread is three lines. Add a time only when the day changes.
- An emoji as the send icon.
- Drawing the status bar.
- Paginating the thread. New messages append.

Where it sits in a product:

1. Open it from `mobile-inbox-list`. The inbox row and the thread title share the name Mira.
2. One thread on screen. Do not show the inbox beside it on a phone.
3. Outgoing is `--primary-soft`. Incoming is `--surface`. Send is the only solid.
4. The family wins the bubble radius and the control height. Phone controls are at least 44px.
5. When a theme is locked, the green becomes that theme's `--primary` and `--primary-soft`.
6. Do not put a chart, a payment, or a second primary in the thread.
7. A failed send stays in the composer with one sentence under the field in `--danger`. This demo does not fail.
8. The plate NA 4 123 is this demo. Do not invent a second plate on the inbox row.
9. Keep the credit line on the token block.
10. Yard desk is the place. It is not a second product name in the bubble.

Rebuild order:

1. Set the paper, the insets, and IBM Plex Sans.
2. Place the label, the title, and the three messages.
3. Place the field and the disabled Send.
4. Enable Send when there is text.
5. Append a text node on submit and clear the field.
6. Check an empty submit.
7. Check the insets with max().
8. Map colours and radius onto the kit.

Copy you keep:

1. Yard desk.
2. Mira.
3. Gate 4 is clear for the rice.
4. Send the truck at 16:10.
5. Driver is Mira. Plate NA 4 123.
6. Message the desk.
7. Send. You.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
