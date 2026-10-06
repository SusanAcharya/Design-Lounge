<!-- Design Lounge Nº 526 · "Ask with a source and a model" · www.designlounge.live -->

# Ask with a source and a model

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, Send is `--primary` and a source chip uses `--primary-soft`. This demo uses the numbers below.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The ask box on Quire, a Thursday note desk. It is not the tone box. That box is `prompt-composer`, and it has Plain, Short, and Formal. This one attaches a source and names the model. Style sheet starts on the box. Add source opens House rules and Night book. The model button reads Quill, and one click switches it to Quill small. Send stays off until the field has text that is not only space. Sending does not invent an answer. It prints the model, the attached names, and the trimmed count. A sourced paragraph that is already written is `cited-answer`. The whole thread is `ai-chat-workspace`.

## Structure

```
form, 680px, padding 20px
  label Ask
  textarea, min-height 96px, maxlength 240
  div.sources
    span.src chips
    button.add "Add source" aria-expanded aria-controls=menu
    div.menu role=listbox, hidden until open
  div.row
    button.model
    button.send, margin-left auto, 40px
  p.out role=status, min-height 22px
```

- Source chips are not buttons. The remove control inside the chip is the button.
- Add source and the model are `type="button"` so they do not submit.
- Send is `type="submit"`.
- The menu is `position: absolute` under Add source, min-width 180px. It does not push the model row.

## Motion

| Thing | Trigger | From | To | Duration | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Menu | Add source | hidden | shown | none | instant |
| Status | submit | empty | one line | none | instant |

No typewriter. The model name swaps in place.

## States

- Send disabled: background `#e7e2d8`, text `#5c564c`. Enabled: background `#1e3a5f`, text `#f4f1ea`.
- Source chip: background `#e7eef6`, border and text `#1e3a5f`, height 32px.
- Model at rest: white, border `#cfc6b6`, label Quill.
- Model pressed: background `#1a1814`, text `#f4f1ea`, label Quill small.
- Menu row hover: background `#e7eef6`.
- Field focus: border `#1e3a5f`. The browser outline is suppressed on the field because the border is the indicator. Every button keeps a 2px `#1e3a5f` focus ring, offset 3px.
- Add source hidden: the `hidden` attribute, not `visibility`.

## Accessibility

- The field has a real label, Ask. The placeholder is not the name.
- Add source has `aria-expanded` and `aria-controls`. The menu is `role="listbox"` named Sources. Each row is `role="option"`.
- Remove buttons are named "Remove Style sheet", "Remove House rules", or "Remove Night book". The icon is `aria-hidden`.
- The model button's accessible name is its visible label, Quill or Quill small. `aria-pressed` matches Quill small.
- Status is `role="status"`.
- Focus order: field, remove buttons left to right, Add source, menu rows when open, model, Send.
- Send is disabled, so it is not in the tab order until the field has text.
- Contrast: `#1a1814` on `#fffdf8`, `#f4f1ea` on `#1e3a5f`, `#1e3a5f` on `#e7eef6`.
- Hit targets: Send is 40px. Chips and the model are 32px, which is the dense desk size. On a phone, make the model and Send 44px.

## Responsive rules

- ≥1280: the form stays 680px, centred.
- 768: same form, page padding 24px. The menu stays 180px and may overlay the chips.
- <640: the form is `width: calc(100% - 32px)`. The model row wraps. Send stays on the right of its row, 40px tall. The menu is at least 180px and must not leave the form: if Add source is near the right edge, align the menu to the form's left padding.
- Do not turn this into `prompt-composer` by adding tone chips. A product that needs a tone and a source uses this box and puts the tone in the sentence, or asks for one control, not both rows.

## Acceptance checklist

### Always

- [ ] A source can be attached before there is text, and Send stays disabled until there is text.
- [ ] Add source lists only names that are not already chips.
- [ ] Removing a chip returns that name to the list.
- [ ] The model is one button with two labels, not a second form.
- [ ] Submit prints the model, the sources, and the trimmed count. It does not write an answer.
- [ ] The field maxlength is 240.
- [ ] The menu does not push the Send row down.

### This demo

- [ ] Style sheet is attached on the first frame.
- [ ] The list starts as House rules and Night book.
- [ ] Model labels are Quill and Quill small.
- [ ] Placeholder is "Which line should lead the Thursday note?".
- [ ] An empty source list prints the words "no source" between the dots.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The field is empty. Placeholder: "Which line should lead the Thursday note?". Send is disabled. The status line is empty.
2. Style sheet is attached, with a remove control named "Remove Style sheet".
3. Add source is collapsed. Activating it opens a list: House rules, Night book.
4. Choosing a row removes it from the list, inserts a chip before Add source, and closes the list.
5. Removing a chip returns that name to the list and shows Add source if it was hidden.
6. Add source hides when the list is empty. It returns when a chip is removed.
7. The model button starts as Quill, `aria-pressed="false"`. One click sets Quill small and `aria-pressed="true"`. The next click returns to Quill.
8. Any non-space character enables Send. Clearing the field disables Send and clears the status.
9. Submit writes `Asked Quill · Style sheet · 12 characters`, using the current model name, the attached names in order separated by commas, and the trimmed length. No sources writes `no source` in that middle place.
10. A second edit, a model click, an add, or a remove clears the status until the next submit.
11. The field stops at 240 characters.

## Tokens

```css
:root {
  --bg: #f4f1ea;
  --surface: #fffdf8;
  --ink: #1a1814;
  --ink-2: #5c564c;
  --line: #e3dcd0;
  --line-2: #cfc6b6;
  --ink-blue: #1e3a5f;
  --soft: #e7eef6;
  --serif: "Fraunces", Georgia, serif;
  --sans: "Public Sans", system-ui, sans-serif;
  --radius: 2px;
}
```

Chips, Add source, and the model button are pills (999px). The field, the menu, and Send use `--radius`.

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Label | Public Sans | 13px | 500 | 1 | 0 |
| Field | Public Sans | 16px | 400 | 1.45 | 0 |
| Chip, Add, model | Public Sans | 13px | 500 | 1 | 0 |
| Menu row | Public Sans | 14px | 500 | 1 | 0 |
| Send | Public Sans | 14px | 600 | 1 | 0 |
| Status | Public Sans | 14px | 400 | 1.4 | 0 |

Fraunces is loaded for a locked editorial pairing that wants a serif question. This demo sets the label and the field in Public Sans. Do not set the field in the serif.

## Implementation notes

Build the spare names from the menu, so the list and the script cannot drift:

```js
const pool = [...menu.querySelectorAll('[data-name]')].map((b) => b.dataset.name);
```

On choose, splice that name out of `pool`, remove the option, and insert a chip before Add source. On remove, push the name back and append a new option. Hide Add source when `pool` is empty.

The status line is one template:

```js
const via = names.length ? names.join(', ') : 'no source';
out.textContent = 'Asked ' + model.textContent + ' · ' + via + ' · ' + q.value.trim().length + ' characters';
```

Clear `out` on input, on model click, on add, and on remove.

Common mistakes:

- Reusing `prompt-composer` and adding the model as a fourth tone. Tone and model are different jobs.
- Letting Send invent a paragraph. This piece ends at the ask.
- A native file input. The sources are named documents already on the desk.
- Leaving the menu open after a choice, or leaving Add source visible when nothing remains.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
