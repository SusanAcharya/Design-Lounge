<!-- Design Lounge Nº 261 · "Greeting loader" · www.designlounge.live -->

# Greeting loader

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A paper page. The word starts at Hello and steps through Namaste, Salaam, and Bonjour, 700ms each, then stops on Bonjour. Replay starts at Hello again. Reduced motion stays on Hello. This is not a spinning loader. That loader is `orbit-dots-loader`. The words are the wait.

## Structure

```
Hello
Replay, bottom
```

- The heading is Fraunces 92px, weight 560, min-width 8ch, centered.
- Replay is Public Sans 14px, height 40px, absolute, bottom 36px.
- Ground is #f4f1ea.
- Words are Hello, Namaste, Salaam, Bonjour.
- One interval, cleared before a new play.

## Motion

- Word | load or Replay | Hello | next word every 700ms | none | text replaces text. Reduced motion stays on Hello.

## States

- Playing: interval running.
- Done: Bonjour, no interval.
- Reduced: Hello, no interval.
- Replay: back to playing, or Hello if reduced.

## Accessibility

- The heading is polite so the word changes are announced.
- Replay is a button.
- Reduced motion does not step the words.
- Focus ring is 2px #1f4d3a, offset 4px.
- The words are real text.
- Do not use a spinner as well.

## Responsive rules

- The word is 92px at 1280.
- Below 700 the word is 56px and min-width is 6ch.
- Replay stays at the bottom.

## Acceptance checklist

### Always

- [ ] Four words, in that order.
- [ ] 700ms between words.
- [ ] It stops.
- [ ] Replay restarts.
- [ ] Reduced motion stays on Hello.

### This demo

- [ ] Words are Hello, Namaste, Salaam, Bonjour.
- [ ] The first word is Hello.
- [ ] The interval is 700ms.
- [ ] Display is Fraunces. The button is Public Sans.
- [ ] Ground is #f4f1ea.

## Measurements to keep

- Word 92px, weight 560, min-width 8ch.
- Step 700ms. Four words.
- Button height 40px, bottom 36px.
- Focus offset 4px.
- Ground #f4f1ea. Ink #1a1814.

## Wrong turns

- Do not loop forever.
- Do not use a spinner beside the word.
- Do not run under reduced motion.
- Do not fetch a translation.
- Do not scramble the letters.
- Do not add a fifth word in this demo.

## Fit with the rest of the library

- A dot loader is `orbit-dots-loader`.
- A scramble is `text-scramble-reveal`.
- This is a short greeting.
- Do not put it on every route.
- Display is Fraunces.
- The ground is paper.

## Keyboard

- Enter runs Replay.
- The heading is polite.
- Do not use a positive tabindex.
- Reduced motion stays on Hello.
- The interval is 700ms.
- Clear the old timer first.
- One button.
- Four words.
- Focus offset is 4px.
- It stops on Bonjour.
- Display type is Fraunces.
- Button type is Public Sans.
- Escape does nothing.
- No spinner.
- The first frame can already be changing, because play runs on load.
- Do not trap focus.

## Rebuild order

1. Build step: play() runs on load. The word is Hello.
2. Build step: Every 700ms the next word replaces it.
3. Build step: After Bonjour the interval clears.
4. Build step: Replay clears any timer, sets Hello, and starts again.
5. Build step: The heading is aria-live polite.
6. Build step: Reduced motion sets Hello and returns. Replay does the same.
7. Build step: The button sits 36px from the bottom.

- Keep this measurement while rebuilding: Word 92px, weight 560, min-width 8ch.
- Keep this measurement while rebuilding: Step 700ms. Four words.
- Keep this measurement while rebuilding: Button height 40px, bottom 36px.
- Keep this measurement while rebuilding: Focus offset 4px.
- Keep this measurement while rebuilding: Ground #f4f1ea. Ink #1a1814.

- While rebuilding, remember: Do not loop forever.
- While rebuilding, remember: Do not use a spinner beside the word.
- While rebuilding, remember: Do not run under reduced motion.
- While rebuilding, remember: Do not fetch a translation.
- While rebuilding, remember: Do not scramble the letters.
- While rebuilding, remember: Do not add a fifth word in this demo.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. play() runs on load. The word is Hello.
2. Every 700ms the next word replaces it.
3. After Bonjour the interval clears.
4. Replay clears any timer, sets Hello, and starts again.
5. The heading is aria-live polite.
6. Reduced motion sets Hello and returns. Replay does the same.
7. The button sits 36px from the bottom.

## Tokens

```css
:root { --bg:#f4f1ea; --ink:#1a1814; --primary:#1f4d3a; --serif:Fraunces,Georgia,serif; }
```

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Word | Fraunces | 92px | 560 |
| Button | Public Sans | 14px | 500 |

## Implementation notes

Clear the interval before starting another.

```js
if (i >= words.length) { clearInterval(timer); return; }
```

The first word is set before the interval, so the wait is before the second word.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
