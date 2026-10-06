---
title: "Agent approval card"
summary: "A notice stays a draft until Yes. No keeps it. The card says which, and nothing sends itself."
platform: web
type: component
category: cards
tags: [agent, approval, confirm]
styles: [paper, minimal]
motion: none
difficulty: 1
featured: false
published: 2026-10-06
palette: ["#F3EFE6", "#FFFCF7", "#241C16", "#1F4D3A", "#9C2F24"]
fonts: ["Newsreader", "Outfit"]
related: [agent-step-trace, agent-tool-chip, ai-chat-workspace]
---

# Agent approval card

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, the filled button is `--primary` and the eyebrow uses the kit's danger colour. This demo uses the numbers below.

## What it is

One card on Silt, a lock desk. The agent has drafted a notice and will not send it. The first frame is the question, with No and Yes both live. Yes is the only filled button. No keeps the draft. After either answer the buttons go quiet and one sentence says what happened. Decide again returns to the question. This is not a step you open. That list is `agent-step-trace`. A tool call drawn as a chip is `agent-tool-chip`. The whole conversation is `ai-chat-workspace`. A confirm that deletes an account is a different card. This one only gates a send.

## Reference behaviour

1. Eyebrow reads Waiting. Heading is "Send the lock notice?". The paragraph names twelve loads at Gate 4 and a hold until 06:00.
2. No, keep the draft is an outline button. Yes, send it is filled `#1f4d3a` with ink `#f3efe6`. Both are enabled. The status line is empty.
3. Yes sets the eyebrow to Sent, disables both buttons, and the status reads "Sent to the lock keeper."
4. No sets the eyebrow to Kept, disables both buttons, and the status reads "Kept as a draft. Nothing was sent."
5. Decide again is hidden until a choice. It then shows, and clicking it restores Waiting, clears the status, and enables both buttons.
6. A second choice is impossible until Decide again. Do not send on a timer.

## Structure

```
1280 × 800, card centred
article.card  520 × auto, padding 28px 28px 24px
  p.eye           12px uppercase, #9c2f24
  h1              32px serif
  p.ask           16px, max 42ch
  div.acts        flex, gap 8px, margin-top 22px
    button.no     44px, outline
    button.yes    44px, margin-left auto, filled
  p.status        min-height 22px, role=status
  button.again    hidden until a choice
```

- The card is the only region. No nav, no thread, no second question.
- Both actions are `type="button"`. This card is not a form submit.
- The status is one paragraph. Do not add a toast.

## Tokens

```css
:root {
  --bg: #f3efe6;
  --surface: #fffcf7;
  --ink: #241c16;
  --ink-2: #5c5348;
  --line: #e4dcd0;
  --yes: #1f4d3a;
  --yes-ink: #f3efe6;
  --mark: #9c2f24;
  --serif: "Newsreader", Georgia, serif;
  --sans: "Outfit", system-ui, sans-serif;
  --radius: 2px;
}
```

Buttons and the card use `--radius`. Do not pill them.

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Eyebrow | Outfit | 12px | 600 | 1 | 0.14em, uppercase |
| Question | Newsreader | 32px | 600 | 1.08 | -0.02em |
| Ask | Outfit | 16px | 400 | 1.45 | 0 |
| Buttons | Outfit | 14px | 600 | 1 | 0 |
| Status | Outfit | 14px | 400 | 1.4 | 0 |
| Decide again | Outfit | 14px | 500 | 1 | 0, underline offset 3px |

## Motion

| Thing | Trigger | From | To | Duration | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Status | a choice | empty | one sentence | none | instant |
| Decide again | a choice | hidden | shown | none | instant |

No spinner. Waiting is a word, not a pulse.

## States

- Waiting: both buttons enabled, eyebrow Waiting, status empty, Decide again hidden.
- Sent: both buttons `disabled`, eyebrow Sent, status "Sent to the lock keeper."
- Kept: both buttons `disabled`, eyebrow Kept, status "Kept as a draft. Nothing was sent."
- Disabled buttons: `opacity: 0.45`, `cursor: default`. Do not restyle them into a third colour.
- Focus-visible: 2px `#1f4d3a` outline, offset 3px, on every button including Decide again.
- Hover does not change the fill. The filled button is already the answer.

## Accessibility

- The question is the only `h1`.
- The status uses `role="status"` so the sentence is announced when it changes.
- Buttons are real buttons. Enter and Space activate the focused one.
- Focus order: No, Yes, then Decide again once it is shown.
- Disabled buttons leave the tab order.
- Contrast: `#241c16` on `#fffcf7`, `#f3efe6` on `#1f4d3a`, `#9c2f24` on `#fffcf7` for the eyebrow.
- Hit targets: both answers are 44px tall. Decide again is 32px, and it is a text button after the decision, not the primary target.

## Responsive rules

- ≥1280: the card stays 520px, centred.
- 768: same card, page padding 24px.
- <640: the card is `width: calc(100% - 32px)`. The heading drops to 28px. The two buttons stack, each `width: 100%`, Yes loses `margin-left: auto`, both stay 44px. The ask wraps inside 42ch or the card, whichever is narrower.
- A phone product does not use this web card. Ask before the agent continues in the same thread, at 44px targets.

## Acceptance checklist

### Always

- [ ] The first frame is a question with two live buttons. Nothing has been sent.
- [ ] Yes is the only filled button. No is an outline.
- [ ] Either answer disables both buttons and writes one sentence.
- [ ] No path says nothing was sent.
- [ ] Decide again restores the question and clears the sentence.
- [ ] There is no timer and no second card.
- [ ] Buttons are 44px tall. The card is 520px on a wide screen.

### This demo

- [ ] Heading is "Send the lock notice?".
- [ ] Waiting, Sent, and Kept are the only eyebrow words.
- [ ] Yes status is "Sent to the lock keeper."
- [ ] No status is "Kept as a draft. Nothing was sent."
- [ ] The ask names Gate 4 and 06:00.

## Implementation notes

Keep the three words on the eyebrow in one place, so a product can rename them without forking the buttons:

```js
function choose(sent) {
  yes.disabled = true;
  no.disabled = true;
  eye.textContent = sent ? 'Sent' : 'Kept';
  status.textContent = sent
    ? 'Sent to the lock keeper.'
    : 'Kept as a draft. Nothing was sent.';
  again.hidden = false;
}
```

Decide again sets `disabled` back to false, writes Waiting, and clears the status. Hide it with the `hidden` attribute, and give that button `display` only when it is shown. A class of `display: flex` on a parent must not override `hidden`.

Common mistakes:

- Sending on load, or after a pause, because the demo looks idle. The point is that it waits.
- Using one button. The person needs a way to keep the draft.
- Putting this copy inside `agent-step-trace` as a fourth row. The approval is its own card, shown when the agent would otherwise continue.
- A toast instead of the status line. The sentence stays on the card.
- Enabling Yes again without Decide again. The choice sticks until the person reopens it.
- Writing the gate count into the eyebrow. The eyebrow is only Waiting, Sent, or Kept.
