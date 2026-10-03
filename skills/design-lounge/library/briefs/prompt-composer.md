<!-- Design Lounge Nº 265 · "Prompt composer" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Prompt composer

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the fill is `--primary` and the tone chip uses `--primary-soft`. The radius follows the family. This demo uses 2px.

## What it is

One question box for Hollis, a yard desk. The label is Ask. The field holds up to 240 characters. Three tone chips sit under it: Plain, Short, Formal. Send is off until the field has text that is not only space. Sending does not invent an answer. It prints the tone and the count. This is not a chat. A chat is `chat-thread`. This is not a hero that types by itself. That hero is `hero-ai-prompt-cycle`. A plain note with a 160 limit is `textarea-field`.

## Reference behaviour

1. The first frame field is empty. The placeholder is "Which loads are still at Gate 4?". Plain is pressed. Send is disabled.
2. The status line under the row is empty.
3. Typing any non-space character enables Send. Clearing the field disables Send and clears the status line.
4. Clicking Short or Formal moves `aria-pressed` to that chip. One tone is pressed.
5. Submit prints `Sent · Plain · 12 characters` using the pressed tone and the trimmed length. The field keeps the text.
6. A second edit clears the status line until the next submit.
7. Past 240 characters the field stops. `maxlength` is 240. Do not show an error sentence. The limit is the attribute.

## Structure

```
1280 × 800, the form centered
form, 640px, surface, border, radius 2px, padding 20px
  label Ask
  textarea, min-height 96px, padding 12px
  row
    [Plain] [Short] [Formal]
    Send, margin-left auto, 40px
  status line, 14px, min-height 22px
```

- The form is the only region. No nav and no second column.
- Tone chips are `type="button"` so they do not submit.
- Send is `type="submit"`.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --surface-2: #f0ebe3;
  --ink: #161513;
  --ink-2: #5a554c;
  --ink-3: #5c564e;
  --line: #e4dfd4;
  --line-strong: #cfc6b8;
  --primary: #1f4d3a;
  --primary-ink: #fffdf8;
  --primary-soft: #e7f2ec;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
  --radius: 2px;
}
```

The chip radius stays 999px. The field and the send button use `--radius`. A family that uses pills for buttons may pill the send button. The chips are already pills.

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Label | IBM Plex Sans | 13px | 500 | 1 | 0 |
| Field | IBM Plex Sans | 16px | 400 | 1.45 | 0 |
| Chip | IBM Plex Sans | 13px | 500 | 32px | 0 |
| Send | IBM Plex Sans | 14px | 500 | 40px | 0 |
| Status | IBM Plex Sans | 14px | 400 | 1.4 | 0 |

Placeholder colour is `--ink-3`. Typed text is `--ink`.

## Motion

None. Send does not morph. The status line replaces its text. Reduced motion has nothing to remove. Do not stream a fake reply.

## States

- Send disabled: `--surface-2` fill, `--ink-3` text, no border, `cursor: default`.
- Send enabled: `--primary` fill, `--primary-ink` text.
- A pressed chip: `--primary-soft` fill, `--primary` border, `--primary` text.
- An unpressed chip: `--surface-2` fill, `--line-strong` border, `--ink-2` text.
- The field border is `--line-strong`. Focus border is `--primary`. The focus ring on chips and Send is 2px `--primary`, offset 3px.
- Status after send uses `--primary`. Before send the line is empty.

## Accessibility

- The label is tied to the textarea with `for` and `id`.
- The chip group is `role="group"` with `aria-label="Tone"`.
- The status line is `aria-live="polite"`.
- Send has an accessible name of Send.
- Disabled Send is not removed from the tab order by `display: none`. It stays a disabled submit.
- The field is at least 96px tall. Send is 40px. Chips are 32px, which is the chip height, not a phone target. On a phone this control is not the piece. Use a full-width column and chips at 40px if the product is a phone.

## Responsive rules

- The form is 640px and centered at 1280.
- Below 720 the form is `width: calc(100% - 40px)` and stays centered.
- The chip row wraps. Send stays on the right of the first line when there is room, and drops under the chips when the row wraps.
- Do not add a sidebar of past questions.

## Acceptance checklist

### Always

- [ ] One field, one label, three tone chips, one Send.
- [ ] Send is disabled when the trimmed field is empty.
- [ ] One tone is pressed. Clicking another moves the pressed state.
- [ ] Submit prints the tone and the trimmed character count. It does not invent an answer.
- [ ] Editing after a send clears the status line.
- [ ] The field stops at 240 characters.
- [ ] The form is 640px wide from 720px up.
- [ ] Focus ring is 2px `--primary`, offset 3px.
- [ ] Chips do not submit the form.

### This demo

- [ ] The label is Ask.
- [ ] The placeholder is "Which loads are still at Gate 4?".
- [ ] Plain starts pressed.
- [ ] The sent line begins with "Sent ·".
- [ ] The type is IBM Plex Sans. The radius of the field is 2px.

## Implementation notes

Disable Send from the trimmed value, not from `value.length`. A field of spaces is empty.

```js
send.disabled = q.value.trim().length === 0;
```

Prevent the form's default submit or the page reloads and the status line never stays.

```js
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const tone = document.querySelector('[aria-pressed="true"]').textContent;
  out.textContent = 'Sent · ' + tone + ' · ' + q.value.trim().length + ' characters';
});
```

Do not call a model. Do not type a canned answer into a second box. The hero that cycles prompts is `hero-ai-prompt-cycle`. This piece stops at the send.

The status line has `min-height: 22px` so the form does not jump when the sentence appears.

Measurements to keep:

- The form is 640px wide, padding 20px, radius 2px, border 1px `--line`.
- The label is 13px with 8px under it.
- The field min-height is 96px, padding 12px, radius 2px.
- Chips are 32px tall, padding 0 12px, gap 6px, radius 999px.
- Send is 40px tall, padding 0 16px, radius 2px.
- The row gap is 8px. The status margin-top is 14px.
- `maxlength` is 240. A space-only field does not enable Send.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
