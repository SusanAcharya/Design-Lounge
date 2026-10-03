<!-- Design Lounge Nº 167 · "AI chat workspace" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# AI chat workspace

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Keep the serif answer, the one clay accent, and the paper ground.

## What it is

The full screen of an AI assistant called Slipway, used by a small pottery studio. A history sidebar sits on the left. The conversation sits in a 720px centre column. A sources panel slides in on the right when you press a citation. On load, the answer to "how long should I wait before opening the kiln" streams in word by word, with a Stop button in the composer. The answer is set in a serif, like a letter. The interface is set in a sans. Code is mono. The ground is ivory paper, not grey. There is one accent, a clay red, and it is used only for the brand dot, citations, the caret, the send button, and the selected source. The detail worth copying is that citations are small numbered chips inside the sentence that open the exact source card, with its quote, in a side panel.

## Reference behaviour

1. On load, the user message is already there. Below it, the label "Slipway" and an empty answer.
2. The answer streams in. Every 34ms, two more words appear. A 0.5em clay caret blinks at the end of the newest word.
3. Each paragraph and the code block appear only when the stream reaches them. Nothing jumps in later above the caret.
4. While streaming, the round send button becomes a charcoal Stop button with a filled square icon. Its label is "Stop generating".
5. The live region says "Slipway is writing an answer" when the stream starts and "Answer ready" when it ends.
6. When the stream ends, the caret goes away and a row of three icon buttons appears under the answer: Copy answer, Good answer, Bad answer.
7. Press Stop mid-stream: the stream halts, the partial text stays, empty blocks are removed, the action row appears with the word "Stopped", and the live region says "Stopped. Partial answer kept."
8. The answer has three citation chips, 1, 2 and 3, placed right after the claim they support.
9. Press a citation chip: the sources panel opens on the right (340px), the matching card gets a clay border and a 3px inner left bar, and focus moves to that card. The chip turns solid clay.
10. Press "Sources 3" in the top bar: the panel opens with no card selected. Press it again, press the close button, or press Escape: the panel closes and focus goes back to the control that opened it.
11. The code block has a header "Controller program · cone 6 slow cool" and a Copy button. Pressing Copy puts the code text on the clipboard, changes the label to "Copied" for 1600ms, and announces "Copied to clipboard".
12. Good answer and Bad answer are toggle buttons. Pressing one sets `aria-pressed="true"` on it and false on the other. A note appears: "Thanks. Noted for this chat." Pressing the pressed one again clears it.
13. The composer textarea grows with its content up to 180px, then scrolls.
14. Enter sends. Shift+Enter adds a new line. Send is disabled while the field is empty.
15. Sending adds your message on the right, clears the field, and adds a Slipway block with three pulsing clay dots and the italic line "Reading the firing log". After 1100ms the dots are replaced by a short reply that streams the same way.
16. The paperclip button opens the real file picker. Each chosen file shows as a 28px chip with its name above the textarea. The live region says "2 files attached".
17. The model button reads "Slipway 3 · Careful". It opens a menu upward with Swift, Careful and Long. Each has a one-line description. The checked one has a clay title. Choosing one updates the button text.
18. History items: pressing one moves `aria-current="page"` to it. "New chat" clears the thread, shows "What are we firing today?" in 34px serif, sets the title to "New chat", and focuses the composer.
19. Reduced motion: the whole answer appears at once, no caret, no pulsing dots, no panel slide.

## Structure

```
1280 x 800
+-------------+-----------------------------------------+---------------+
| side 248    | top bar 56: title          [Sources 3]  | sources 340   |
| Slipway (dot)  +-----------------------------------------+ (closed = 0)  |
| [+ New chat]|          centre column max 720          | Sources · 3 x |
|             |                     [ user message   ]  | [1 card     ] |
| TODAY       |  * SLIPWAY                                 | [2 card on  ] |
|  Cone 6 ... |  serif answer, 17px, 66ch max           | [3 card     ] |
|  Glaze ...  |  [code block: header + pre]             |               |
| PREVIOUS 7  |  [copy] [up] [down]                     |               |
|  ...        +-----------------------------------------+               |
|             |  composer, max 720, radius 16           |               |
| TB Tara     |  [clip] [Slipway 3 · Careful]  hint   (o)  |               |
+-------------+-----------------------------------------+---------------+
```

- The app is a fixed full-viewport grid: `248px minmax(0,1fr) 0`. With the panel open: `248px minmax(0,1fr) 340px`.
- Sidebar is an `aside` labelled "Chat history". The list is a `nav` labelled "Conversations" with two `h2` group labels and `ul` lists of buttons.
- The centre is `main`. The top bar is a `header` with the chat title as the only `h1`.
- The thread is a scrolling `div`. Each answer is an `article` labelled "Slipway answer".
- The user message is a `p` in a right-aligned row, max 78% wide.
- Citations are `button` elements with `aria-label="Source 1"` and `aria-expanded`.
- The code block is a `figure` with a `header` and a `pre > code`.
- The composer is a `form` with a visually hidden `label` "Message Slipway", a `textarea`, an attach button, a hidden `input type="file" multiple`, the model menu, a hint, and a submit button.
- The sources panel is an `aside` labelled "Sources" with an `ol` of cards. Each card is an `li` with `tabindex="-1"`, an `h3`, a publisher line, and a `blockquote`.
- One visually hidden `p` with `aria-live="polite"` sits at the end of the body.

## Tokens

```css
:root {
  --bg: #f7f2e8;          /* ivory page */
  --side: #efe8da;        /* sidebar and user bubble */
  --surface: #fcf9f3;     /* composer, panel, current history item */
  --well: #f1eadd;        /* code block, file chips */
  --ink: #1f1b16;         /* charcoal text */
  --ink-2: #544c42;       /* secondary text */
  --ink-3: #6b6155;       /* labels, hints */
  --line: #e0d6c4;        /* hairlines */
  --line-2: #d3c7b2;      /* control borders */
  --clay: #a8491f;        /* the one accent */
  --clay-soft: #f3e2d6;   /* citation chip fill */
  --focus: #a8491f;

  --serif: "Newsreader", Georgia, serif;
  --sans: "Instrument Sans", system-ui, sans-serif;
  --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;

  --r-sm: 6px;
  --r: 10px;
  --r-lg: 16px;

  --space-1: 4px; --space-2: 8px; --space-3: 12px;
  --space-4: 16px; --space-5: 24px; --space-6: 28px;

  --shadow-composer: 0 1px 0 rgba(31,27,22,.04), 0 8px 24px -16px rgba(31,27,22,.25);
  --shadow-menu: 0 12px 32px -12px rgba(31,27,22,.3);

  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
  --t-micro: 160ms;
  --t-panel: 320ms;
  --t-word: 34ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Brand | Newsreader | 22px | 500 | 1 | -0.01em | Title |
| Answer body | Newsreader | 17px | 400 | 1.6 | 0 | Sentence |
| Thinking line | Newsreader italic | 16px | 400 | 1 | 0 | Sentence |
| Source quote | Newsreader italic | 15px | 400 | 1.5 | 0 | Sentence |
| Empty state | Newsreader | 34px | 400 | 1.2 | 0 | Sentence |
| Chat title | Instrument Sans | 15px | 500 | 1.2 | 0 | Sentence |
| User message | Instrument Sans | 15px | 400 | 1.5 | 0 | Sentence |
| UI text | Instrument Sans | 14px | 400-500 | 1.45 | 0 | Sentence |
| Group label, "Slipway" label | Instrument Sans | 11-12px | 600 | 1 | 0.06-0.08em | Upper |
| Citation chip | Instrument Sans | 11px | 600 | 1 | 0 | Number |
| Code | system mono | 13px | 400 | 1.65 | 0 | As typed |

- The answer is the only long text, and it is serif. Never set UI controls in the serif.
- Keep the answer measure at 66ch max.
- In code, segment names are clay and the comment line is `--ink-3`. No other syntax colours.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Streaming text | load, after send | text content | empty → full, 2 words per tick | 34ms per tick | none | full text at once |
| Caret | while streaming | opacity | 1 → 0 | 1s, steps(2), loop | steps | hidden |
| Thinking dots | after send | opacity, scale | 0.25, 0.8 → 1, 1 | 1.2s loop, 150ms stagger | `--ease` | static |
| Thinking → reply | after send | swap | dots → stream | 1100ms delay | none | 300ms delay |
| Sources panel | chip or Sources button | grid column | 0 → 340px | 320ms | `--ease` | instant |
| Panel under 900px | same | translateX | 100% → 0 | 300ms | `--ease-out` | instant |
| Sidebar under 900px | menu button | translateX | -100% → 0 | 300ms | `--ease-out` | instant |
| Send ↔ Stop | stream start/end | background | clay ↔ charcoal | 160ms | `--ease` | instant |
| Copy label | Copy | text | Copy → Copied → Copy | 1600ms hold | none | same |

- Auto-scroll the thread to the bottom on each tick only if the reader was within 120px of the bottom. If they scrolled up to read, leave them there.
- No fade on each word. Words appear. The caret is the motion.

## States

- History item hover: 5% charcoal tint. Current: `--surface` fill, 2px clay inner left bar, `aria-current="page"`.
- Chip buttons (Sources, model): 1px `--line-2` border, 999px radius, 34px tall. Hover: border `--ink-3`. Expanded Sources: charcoal fill, ivory text.
- Citation chip: 20px tall, min 20px wide, radius 5px, `--clay-soft` fill, clay number. Hover and expanded: clay fill, white number.
- Icon buttons: 34px square, radius 6px, `--ink-3`. Hover: `--side` fill. Pressed feedback: clay icon on `--clay-soft`.
- Send: 36px circle, clay. Disabled (empty field): `--line-2` fill. Streaming: charcoal with a 12px filled square.
- Composer focus-within: border goes from `--line-2` to `--ink-3`. The textarea has no outline of its own.
- Source card selected: 1px clay border, `#fffaf4` fill, 3px clay inner left bar.
- Thinking: three 6px clay dots and the italic line "Reading the firing log".
- Stopped: action row with the word "Stopped" in 13px `--ink-3`.
- Empty (after New chat): "What are we firing today?" centred, 34px serif, 120px from the top.
- Focus-visible everywhere: 2px clay outline, offset 2px, radius 6px.

## Accessibility

- One `h1`, the chat title. Group labels and the panel title are `h2`. Source titles are `h3`.
- The live region is polite. Announce start, end, stop, copy, feedback, attach, and model change. Do not announce each word.
- The streaming article is not itself a live region. Screen reader users read it when "Answer ready" is announced.
- Stop and Send are the same button. Its `aria-label` switches between "Send message" and "Stop generating".
- Citation chips have `aria-label="Source N"` and `aria-expanded`. Opening moves focus into the matching card. Closing returns focus to the chip.
- The closed panel is `visibility: hidden` so its buttons are not in the tab order.
- Model menu: the button has `aria-haspopup="menu"` and `aria-expanded`. Items are `menuitemradio` with `aria-checked`. Arrow Up and Down move. Enter or Space picks. Escape closes and returns focus. Tab closes.
- Escape also closes the mobile sidebar first, then the sources panel.
- Textarea: Enter sends, Shift+Enter is a new line. Ignore Enter while an IME is composing.
- Contrast: `#1f1b16` on `#f7f2e8` is about 15:1. `#6b6155` on `#efe8da` is about 4.8:1. Clay `#a8491f` on ivory is about 5.2:1.
- Icon buttons are 34px on desktop. Under 640px keep them at least 34px and keep 4px gaps so taps do not collide.

## Responsive rules

- ≥1280: three columns, sidebar 248px, centre fluid with a 720px column, panel 340px when open.
- 1024: sidebar shrinks with `clamp(216px, 19.4vw, 248px)`. Panel uses `clamp(300px, 26.6vw, 340px)`. The centre column stays at most 720px and fills the rest.
- 768 (anything ≤900px): one column. The sidebar becomes a 272px drawer from the left, opened by a menu button in the top bar, with a 28% charcoal scrim. The sources panel becomes a fixed sheet from the right, `min(340px, 100%)` wide.
- <640: top bar padding 12px. Column padding 22px 16px. Answer drops to 16.5px. User bubble max 90%. The keyboard hint is hidden. The Sources button shows only the icon and "3". The panel is full width.
- Never let the page scroll sideways. The code block scrolls sideways inside itself.

## Acceptance checklist

### Always

- [ ] The grid uses `minmax(0,1fr)` for the centre and the page never scrolls sideways at 390px.
- [ ] The answer streams in on first load and shows a Stop button while it streams.
- [ ] Stop keeps the partial text and shows the action row.
- [ ] Each citation chip opens the panel with the matching card selected and focused.
- [ ] Escape and the close button return focus to whatever opened the panel.
- [ ] Enter sends, Shift+Enter adds a line, Send is disabled when empty.
- [ ] Sending shows a thinking state, then streams a reply.
- [ ] One polite live region announces start and end, not each word.
- [ ] Reduced motion shows the full answer at once with no caret.
- [ ] One accent colour. Answer in serif, UI in sans, code in mono.
- [ ] Focus is visible on every control, including citation chips and menu items.

### This demo

- [ ] The assistant is "Slipway". The user is "Tara Bhandari, Hollow Oak Pottery".
- [ ] The current chat is "Cone 6 cooling schedule" under Today.
- [ ] The answer cites "Firing log, 2019 to 2024", "Silica inversions and dunting", and "Slow cooling for matte surfaces".
- [ ] The model button reads "Slipway 3 · Careful".
- [ ] The page is `#f7f2e8`, text `#1f1b16`, accent `#a8491f`.

## Implementation notes

**1. Stream real markup, not a string.** Render the finished answer HTML, then empty its text nodes and refill them. Citations, emphasis, and the code block keep their real elements. A citation with no text yet is hidden by `:empty`.

```js
const blocks = [...body.children];
const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
const items = [];
while (walker.nextNode()) {
  const n = walker.currentNode;
  if (n.parentNode === body) continue;          // skip whitespace between blocks
  items.push({ n, parts: n.data.match(/\S+\s*|\s+/g) || [], block: blocks.find(b => b.contains(n)) });
}
items.forEach(i => (i.n.data = ''));
blocks.forEach(b => (b.hidden = true));
let i = 0, p = 0;
(function tick() {
  for (let k = 0; k < 2 && i < items.length; k++) {
    const it = items[i];
    it.block.hidden = false;
    it.n.data += it.parts[p++] ?? '';
    if (p >= it.parts.length) { i++; p = 0; }
  }
  if (i < items.length) timer = setTimeout(tick, 34); else finish();
})();
```

```css
.cite:empty { display: none; }
```

**2. One button, two jobs.** Keep both icons in the button and swap with a class. Do not rebuild the button, or focus is lost when the stream starts.

```css
.send .i-stop, .send.stop .i-send { display: none; }
.send.stop { background: var(--ink); }
.send.stop .i-stop { display: block; width: 12px; height: 12px; fill: currentColor; }
```

**3. A panel that is really closed.** Animate the grid column, and hide the panel from the tab order only after the slide ends.

```css
.app { grid-template-columns: 248px minmax(0,1fr) 0; transition: grid-template-columns .32s var(--ease); }
.app.src-open { grid-template-columns: 248px minmax(0,1fr) 340px; }
.src { visibility: hidden; border-left: 0 solid var(--line); transition: visibility 0s .32s; }
.app.src-open .src { visibility: visible; border-left-width: 1px; transition: none; }
.src-in { width: 340px; }  /* fixed inner width so text does not reflow while sliding */
```

Common mistakes:

- A grey chat app. The ground is ivory paper and the answer is a serif.
- Chat bubbles for the assistant. Only the user gets a bubble. The answer is plain text on the page.
- Typing one character at a time. It reads as a gimmick. Two words per 34ms tick.
- Announcing every token to screen readers.
- Citations as superscript links that jump to a footnote list at the bottom.
- Rebuilding the send button on each state change, which drops focus.
- A 1px border on the closed panel, which makes the page scroll 1px sideways.
- Letting focus or `scrollIntoView` scroll the body. Pin the app shell with `position: fixed; inset: 0`.
- A second accent for code highlighting. Clay and grey only.
- A purple gradient "AI" badge or a glowing orb. Slipway's mark is an 8px clay dot.

Rebuild order:

1. Set the tokens and the three-column grid.
2. Build the sidebar with the two groups and the current item.
3. Build the top bar, the user message, and the finished answer as static HTML.
4. Add the composer with attach, model menu, hint, and send.
5. Add the sources panel and wire the citation chips.
6. Add streaming, Stop, and the action row.
7. Add send, thinking, and the canned reply.
8. Add the 900px and 640px rules and the reduced-motion rule.
9. Tab through everything and check focus and the live region.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
