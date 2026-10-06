<!-- Design Lounge Nº 166 · "Agent step trace" · www.designlounge.live -->

# Agent step trace

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, use that kit's colour and radius. This demo uses the numbers below.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A trace of how a yard note was drafted. Four steps: read the gate note, check the hold rule, draft the reply, wait for a person. The first is expanded and names the tool ledger.get. The others collapse. Opening one closes the rest. The last step has no tool and says the draft stays until someone sends it. This is not a human audit log. That log is `audit-activity-log`. This is not a chat. A chat is `chat-thread`. A question box that does not answer is `prompt-composer`.

## Structure

```
640px card
How the note was drafted
step row
  body
step row
```

- Card 640px, padding on the heading 12px 20px.
- Each step is a list item with a full-width button.
- The body sits under the button and hides with the hidden attribute.
- Tool names are code in IBM Plex Mono on #e7f2ec.
- One step open at a time, or none.

## Motion

| Thing | Trigger | From | To | Duration | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Body | click | hidden | shown | none | instant |

## States

- Expanded: aria-expanded true, body visible.
- Collapsed: aria-expanded false, body hidden.
- Waiting is a label, not a spinner.
- There is no error step in this demo.

## Accessibility

- The row button exposes aria-expanded.
- The body is the next sibling and is hidden when collapsed.
- Tool names are text.
- Do not auto-advance the steps.
- Focus ring is 2px #1f4d3a, offset 3px.
- The list is an ol so the order is the order of the work.

## Responsive rules

- The card is 640px at 1280.
- Below 700 the card is calc(100% - 32px).
- The status word stays on the right of the row. It may wrap under the title below 360px.

## Acceptance checklist

### Always

- [ ] Steps are ordered.
- [ ] Opening one closes the others.
- [ ] A tool name is monospace on a soft wash.
- [ ] The copy says nothing was sent.
- [ ] The last step waits for a person.

### This demo

- [ ] Title is How the note was drafted.
- [ ] First tool is ledger.get. Result: Gate 4 holds 12 loads.
- [ ] Second tool is rules.hold. A hold older than 6 hours needs a person.
- [ ] Third tool is notes.draft.
- [ ] Fourth status is Waiting.

## Measurements to keep

- Card 640px, radius 2px.
- Row button padding 14px 20px. Title 22px, margin 12px 20px 8px.
- Body padding 0 20px 14px. Body text 14px, colour #5a554c.
- Code 13px, padding 2px 6px, background #e7f2ec, colour #1f4d3a.
- Border between steps 1px #e4dfd4.

## Wrong turns

- Do not stream tokens.
- Do not add a send button that posts the draft.
- Do not open every step at once.
- Do not use a spinner on Waiting.
- Do not hide the tool name inside a JSON blob as the only label.
- Do not call a network.

## Fit with the rest of the library

- A human audit is `audit-activity-log`.
- A conversation is `chat-thread`.
- An ask box is `prompt-composer`.
- This trace is the tool list.
- Do not put the trace inside the composer.
- The ground is #f6f4ef.

## Keyboard

- Tab moves through the four step buttons.
- Enter toggles the focused step.
- aria-expanded is true on the open step only.
- Opening one closes the others.
- The first step starts open.
- Bodies that are hidden are not tab stops.
- Do not use a positive tabindex.
- The tool code is not a link.
- Focus ring offset is 3px.
- Waiting is text.
- Nothing is sent.
- Reduced motion changes nothing.
- The list is ordered.
- Sans is IBM Plex Sans.
- Mono is IBM Plex Mono.
- There are four steps.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The first step is aria-expanded true and its body is visible.
2. The body names the tool and one result sentence.
3. Clicking another step closes the open one and opens the clicked step.
4. Clicking the open step closes it, so zero steps may be open.
5. Tools are ledger.get, rules.hold, and notes.draft. The fourth step has no tool.
6. Every result says the work stayed on the page. Nothing was sent.
7. The status words are Done, Done, Done, and Waiting.

## Tokens

```css
:root {
  --bg:#f6f4ef; --surface:#fff; --ink:#161513; --ink-2:#5a554c;
  --line:#e4dfd4; --primary:#1f4d3a; --soft:#e7f2ec;
}
```

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Title | IBM Plex Sans | 22px | 600 | 1.2 | 0 |
| Step | IBM Plex Sans | 15px | 500 | 1.45 | 0 |
| Tool | IBM Plex Mono | 13px | 500 | 1 | 0 |

## Implementation notes

Close every body, then open the clicked one only if it was closed.

```js
const open = b.getAttribute("aria-expanded") !== "true";
```

Do not invent a model response. The trace is the record of tools, not a paragraph of advice.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
