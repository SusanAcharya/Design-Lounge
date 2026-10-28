---
title: "AI chat demo as the features section"
summary: "A features section whose centrepiece is a working, labelled example chat: click a suggested question and a scripted answer streams in with a table or chart and its sources."
platform: web
type: section
category: features
tags: [features, ai, chat, assistant, retail]
styles: [editorial, soft]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-28
palette: ["#DCE5E1", "#FBFCFA", "#142220", "#A63B27", "#9DB5AC"]
fonts: ["DM Serif Display", "DM Sans"]
related: [features-thread-to-issue-board, automation-config-live-preview]
---

# AI chat demo as the features section

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The features section for "Shelfwise", an invented assistant for independent bookshops that answers questions from the shop's till, stock counts and supplier orders. Instead of describing features, the section hands the visitor the product: a 712px chat window, plainly marked "Example", with one finished exchange already on screen (a reorder table) and three suggested questions. Clicking one adds the question, shows a "Reading till export…" indicator, streams the answer word by word, then lands the artefact (table or bar chart) and numbered source chips you can open. A serif headline and three hard facts sit on the left. The detail to copy: every answer carries its receipt, a rendered artefact plus sources, which is the product's whole promise made visible.

## Reference behaviour

1. Initial state: the chat already shows the question "Which titles should I reorder before Thursday?", the answer paragraph, a five-row table "Reorder before Thu 30 Oct" and two source chips. The log is scrolled to the top so the whole exchange is visible. Three suggestion pills sit above the input; the asked one is dashed with a tick and sorted last.
2. Click "How did the poetry table do in October?": the pills disable; a dark user bubble appears right-aligned; under a Shelfwise mark, three pulsing dots and "Reading till export, October" show for 900ms.
3. The dots are replaced by the answer streaming one word every 38ms. The log follows the bottom.
4. When the last word lands, the paragraph is re-rendered with its bold figures, the artefact card rises in (8px, 420ms), source chips appear, and the pills re-enable with the new question marked as asked.
5. Poetry answer: a paired bar chart of five weeks, 2026 against 2025, with the open-mic week in brick and its value (£694) labelled. Saturday answer: a nine-bar chart of hourly takings, 11:00 in brick at £412.
6. Click a source chip: it turns brick (`aria-expanded="true"`) and a small panel under the chips gives its detail ("Source 1: 4,212 lines, exported 27 Oct 18:02"). Clicking it again, or another chip, swaps or closes it.
7. Typing in the input and pressing Ask: a question that matches reorder, poetry or Saturday keywords replays that answer under the typed words; anything else gets "This example only knows three questions…" with no streaming.
8. With reduced motion, answers appear complete at once; the dots never pulse.

## Structure

```
1280 × 800
┌────────────── wrap 1200 max, padding 44 / 44 / 36 · grid 360px 1fr, gap 56 ───────────────┐
│ Shelfwise for independent bookshops   │ ┌─ chat 712 tall, radius 14 ───────────────────────┐ │
│ Ask the till. It shows                │ │ [S] Shelfwise / Till and stock data…   (Example) │ │ 62
│ its working.  (DM Serif 58)           │ ├──────────────────────────────────────────────────┤ │
│ lede (16px)                           │ │                   [ Which titles should I… ]     │ │
│ ─────────────────────────────         │ │ [S] Five titles will sell out before…            │ │
│ 1,140   shops on the morning…         │ │     ┌ Reorder before Thu 30 Oct ─ 5 of 3,204 ┐   │ │
│ 9 s     median time from…             │ │     │ Title  On hand  Sold  Runs out  Order │   │ │ log
│ 0       answers without a source…     │ │     └───────────────────────────────────────┘   │ │ scrolls
│ note: Example conversation with…      │ │     [1 Till export…] [2 Stock count…]           │ │
│                                       │ ├──────────────────────────────────────────────────┤ │
│                                       │ │ (poetry?) (Saturday?) (✓ reorder?)               │ │ dock
│                                       │ │ [ Ask about sales, stock or suppliers ] [Ask →]  │ │
│                                       │ └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

- Left column: `.kicker`, `<h2>` (serif, italic accent phrase), `.lede`, `<ul class="facts">` (serif figure + sans line, hairline rows), `.note` stating it is an example with a demo shop.
- `<section class="chat" aria-label="Example Shelfwise conversation">`: `.top` header (mark, name, data date, "Example" pill), `.log` (`role="log" aria-live="polite"`, scrolls), `.dock` (suggestions `role="group"` + `<form>` with labelled input and submit).
- Messages: `.u` user bubble (`<p>`); `.a` assistant row (mark + body: `<p>`, `.art` artefact card with `<h4>` and `<table>` or `<svg role="img">`, `.src` chips, optional `.srcbox`).

## Tokens

```css
:root {
  /* colour: celadon ground, paper chat, ink, one brick accent */
  --bg: #DCE5E1;          /* page */
  --panel: #FBFCFA;       /* chat window, chips */
  --sunk: #EEF3F0;        /* table head, source detail */
  --line: #C9D6D0;        /* hairlines, artefact border */
  --line-2: #7E918A;      /* input, pills, chip borders (3:1 on panel) */
  --ink: #142220;         /* headline, user bubble */
  --ink-2: #3E504B;       /* body, 2026 bars */
  --ink-3: #4F605B;       /* meta, axis labels, placeholder */
  --accent: #A63B27;      /* kicker, italic phrase, mark, Ask, highlight bar */
  --accent-hover: #9A3522;
  --accent-ink: #FFFFFF;
  --accent-tint: #F6E3DD; /* pill hover */
  --series-2: #9DB5AC;    /* last year's bars */
  --bubble-ink: #F2F6F4;

  /* type */
  --serif: "DM Serif Display", Georgia, serif;
  --sans: "DM Sans", system-ui, sans-serif;
  --fs-h2: clamp(40px, 4.6vw, 58px);
  --fs-fact: 26px;
  --fs-body: 15px;
  --fs-small: 13px;
  --fs-micro: 12px;

  /* layout */
  --chat-h: 712px;
  --left-w: 360px;
  --r: 14px;
  --r-sm: 8px;
  --bubble-r: 14px 14px 4px 14px;

  /* motion */
  --t: 160ms;
  --think: 900ms;
  --word: 38ms;
  --rise: 420ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Headline | DM Serif Display | clamp(40px, 4.6vw, 58px) | 400 (italic for the accent phrase) | 1.0 | -0.015em | sentence |
| Fact figure | DM Serif Display | 26px | 400 | 1 | 0 | numerals |
| Kicker | DM Sans | 13px | 600 | 1.4 | 0 | sentence, brick |
| Lede | DM Sans | 16px | 400 | 1.55 | 0 | sentence |
| Chat body | DM Sans | 15px | 400 (700 for key figures) | 1.55 | 0 | sentence, max 62ch |
| User bubble | DM Sans | 15px | 500 | 1.55 | 0 | sentence |
| Artefact title | DM Sans | 13px | 700 / 500 | 1.4 | 0 | sentence |
| Table | DM Sans | 13px (head 12px 600) | 400 | 1.4 | 0 | tabular numerals |
| Pills, chips | DM Sans | 13px / 12px | 500 / 600 | 1.2 | 0 | sentence |
| Mark glyph | DM Serif Display | 18px | 400 | 1 | 0 | "S" |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|---|
| thinking dots | answer starts | opacity | 0.25 ↔ 1, staggered 150ms | 1000ms loop, removed after 900ms | `--ease` | static, skipped |
| answer text | after thinking | words revealed | 0 → all | 38ms per word | none (it is a clock) | instant |
| `.art` | answer complete | opacity, translateY | 0, 8px → 1, 0 | 420ms | `--expo` | none |
| `.log` | new content | scrollTop | → bottom | smooth scroll | browser | `scroll-behavior: auto` |
| pills | hover | background, border | panel → `--accent-tint`, brick | 160ms | `--ease` | 1ms |

The dots loop only while an answer is being prepared (under a second), so nothing moves at rest.

## States

- **Pill:** 1px `--line-2` border, pill radius; hover tint and brick border; disabled at 55% while an answer runs; asked: dashed border, tick icon, `--ink-2`, sorted last, `aria-label` ends "asked already".
- **Source chip:** collapsed `--line-2` border; expanded brick border and text, detail panel shown below.
- **Input:** 44px, 1px `--line-2`, white fill; placeholder `--ink-3`; focus 2px brick outline.
- **Ask:** brick fill, white label and arrow; hover `#9A3522`.
- **Busy:** pills disabled; typed submits are ignored until the answer lands.
- **Unknown question:** an immediate, unstreamed assistant reply listing what this example can answer.
- **Highlight in data:** table cells for titles that run out first (Tue, Wed) and the key bar in brick.

## Accessibility

- The log is `role="log"` with `aria-live="polite"`, so new questions and answers are read in order. Streaming writes into a text node; the final render replaces it once.
- The window has `aria-label="Example Shelfwise conversation"` and a visible "Example" pill; the note under the facts says it is a demo shop with illustrative figures.
- Charts are `<svg role="img">` with an `aria-label` that lists every value ("Average Saturday takings by hour: 9 £84, 10 £231…").
- Source chips are buttons with `aria-expanded`; the input has a visually hidden `<label>`.
- Typed text is escaped before it is inserted.
- Contrast: `--ink-2` on `--panel` 8.9:1; `--ink-3` on `--bg` 5.0:1 and on `--panel` 6.3:1; brick on `--bg` 5.2:1; white on brick 6.6:1; bubble text on ink 15:1; `--line-2` control borders 3.3:1 on `--panel`.
- Pills are 34px tall with 8px gaps; input and Ask are 44px.

## Responsive rules

- ≥ 1280: two columns as specified.
- 1024–1279: same; the chat narrows.
- < 1024: one column, the chat under the copy, gap 28px.
- < 760: wrap padding 32px 16px; chat 680px tall; log padding 16px 14px; user bubbles up to 88%; the assistant mark beside answers is hidden; the "Sold, 14 days" column is hidden; artefact titles stack; chart text is set to 21 viewBox units so axis labels stay about 11px on screen. At 390 wide nothing scrolls sideways.

## Acceptance checklist

**Always**
- [ ] The chat is visibly labelled as an example in the window and in the copy beside it.
- [ ] First frame shows one finished exchange with its artefact and sources, not an empty chat.
- [ ] Suggested questions are buttons; clicking one runs think (900ms), stream (38ms a word), then artefact and sources.
- [ ] Every answer includes a rendered artefact (table or chart) and at least two numbered sources that expand.
- [ ] Pills disable while an answer runs; asked pills are marked and sorted last.
- [ ] The log is a polite live region and follows new content to the bottom.
- [ ] Typed questions are escaped; unknown ones get an honest "this example only knows…" reply.
- [ ] Reduced motion: answers appear whole, no pulsing dots, no smooth scroll.
- [ ] At 390 wide: one column, no sideways scroll, chart labels readable.

**This demo**
- [ ] Headline "Ask the till. It shows its working." with "its working." in brick italic.
- [ ] Facts 1,140, 9 s and 0, set in DM Serif Display.
- [ ] Reorder table lists Fen Light, A Year of Small Bread, The Lantern Keeper's Daughter, Moorland Birds of the North, The Quiet Engine.
- [ ] Poetry answer £1,846, up 31%, open-mic week £694; Saturday answer 11:00 at £412.

## Implementation notes

**Script the answers as data.** Each scripted turn carries its words, one artefact and its sources, so the renderer stays generic.

```js
const S = [{
  q: 'What is my best hour on a Saturday?', k: /hour|saturday|busy|staff/i,
  a: '<strong>11:00 to 12:00.</strong> Over the last eight Saturdays that hour averaged £412…',
  c: { h: 'Average Saturday takings by hour', s: 'Last 8 Saturdays',
       labels: ['9','10','11','12','13','14','15','16','17'],
       a: [84,231,412,356,268,301,247,176,98], hi: 2 },
  src: [['Till export, 8 Saturdays', '6 Sep to 25 Oct, 1,486 sales'], ['Rota, Sep to Oct', 'Second till staffed from 12:00']]
}];
```

**Stream plain words, then render once.** Strip tags for the stream so half a `<strong>` never shows, then swap in the HTML when done.

```js
const words = s.a.replace(/<[^>]+>/g, '').split(' ');
let i = 0;
const iv = setInterval(() => {
  p.textContent = words.slice(0, ++i).join(' ');
  log.scrollTop = log.scrollHeight;
  if (i >= words.length) { clearInterval(iv); p.innerHTML = s.a; renderArtefact(s); renderSources(s); }
}, 38);
```

**Bar chart from numbers, in the piece's colours.** Bars scale to the series max; the highlighted bar is brick and labelled.

```js
const y = H - 26 - v / max * (H - 50);
svg += `<rect x="${x}" y="${y}" width="${w}" height="${H - 26 - y}" rx="2"
         fill="${i === c.hi ? '#A63B27' : '#3E504B'}"/>`;
```

Common mistakes: an empty chat that waits for the visitor to type; answers with no artefact or no sources, which turns it back into a text bubble; streaming raw HTML; leaving pills active mid-answer so two answers interleave; a chart in a library's default palette; forgetting to say it is an example.
