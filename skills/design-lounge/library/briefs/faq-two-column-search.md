<!-- Design Lounge Nº 111 · "FAQ two-column search" · www.designlounge.live -->

# FAQ two-column search

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A docs FAQ for **Kestrel**, an HTTP API product. Eight numbered questions sit in two columns under a 44px search field. Typing filters rows by question and answer text (case-insensitive). A live “**N** of 8 topics” count updates on every keystroke. If the filter matches nothing, both columns hide their rows and an empty state appears: “No topics match that filter” plus a Clear filter button. Each row is an accordion that opens with `grid-template-rows: 0fr → 1fr` over 280ms; several may be open at once. This is a swiss index, not a paper one-column FAQ.

## Structure

```
1280 × 800
+----------------------------------------------------------------------+
| * Kestrel     Guides   API   Changelog                    docs 2.4.1 | 52
| DOCS · FAQ                         [ Filter by topic -- auth...    ] |
| Questions the API desk hears       8 of 8 topics                     | 44
|----------------------------------------------------------------------| ink rule
| 01 How do I rotate an API key... + | 02 Why is my webhook...      +  |
|    (answer open on 01)             | 04 What does the 429...      +  |
| 03 Which regions can a project...+ | 06 How do signed requests... +  |
| 05 Can I replay a failed event...+ | 08 Where do I file a...      +  |
| 07 Is the sandbox key billed?   +  |                                 |
+----------------------------------------------------------------------+
  pad 56     columns 1fr 1fr, gap 48     row pad 14 0
```

- `<nav>` 52px.
- `<section aria-label="Frequently asked questions">`: `.lead` (heading + `.search`) and `#grid`.
- `#grid` is a 2-column grid containing `#col-a`, `#col-b`, and `#empty` (spans both columns when shown).
- Each `.item`: `<h3><button class="q" aria-expanded aria-controls>` (`.n` + `.t` + plus SVG) and `.panel` `role="region"`.
- Search: icon SVG, visually hidden label, `input type="search"`, `.count`.

Questions, exact (odd → left, even → right):

| # | Question | Answer facts |
|---|----------|----------------|
| 01 | How do I rotate an API key without dropping traffic? | Second key, 15-minute overlap, then revoke. Old key → `401 kestrel.auth.stale`. |
| 02 | Why is my webhook retrying every 30 seconds? | Retries on non-2xx for 2 hours: 30s, 60s, then 5 min. Return `204`. 10-second budget. |
| 03 | Which regions can a project live in? | `eu-central`, `us-east`, `ap-south`. Move is a copy; old region readable 30 days. |
| 04 | What does the 429 burst window actually count? | 120 / 10 s per key. `X-Kestrel-Remain`. Daily cap 250,000 is a separate 429 `kestrel.quota.day`. |
| 05 | Can I replay a failed event from the dashboard? | 14 days. Adds `x-kestrel-replay: 1`. Replays do not increment daily quota. |
| 06 | How do signed requests expire? | `X-Kestrel-Ts` within 300 seconds. Else `401 kestrel.auth.skew`. |
| 07 | Is the sandbox key billed? | No. 1,000 calls/day. Promote copies routes and drops the flag; new key. |
| 08 | Where do I file a region outage? | status.kestrel.dev. Ticket with `X-Kestrel-Id`. Do not rotate keys first. |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
|---------|---------|----------|-----------|---------:|--------|
| `.panel` | open / close | grid-template-rows | 0fr ↔ 1fr | 280ms | `--ease` |
| `.q svg` | open / close | rotate | 0 ↔ 45° | 280ms | `--ease` |
| Filter show/hide | input | `hidden` | — | 0 | instant |

Do not animate rows in and out of the filter. Reduced motion: 1ms on `.panel` and the icon.

## States

- **Question rest:** `--ink`, plus at 0°.
- **Question hover:** colour `--navy`.
- **Question open:** colour `--navy`, plus at 45°, panel `1fr`.
- **Question focus-visible:** 2px navy outline, 3px offset (global).
- **Search rest:** 44px, white fill, 1px `--line-2`, 36px left padding for the icon.
- **Search focus:** border `--navy`.
- **Empty hidden:** `#empty` `display:none`.
- **Empty shown:** `.show` → `display:block`, grid-column 1 / -1.
- **Clear hover:** invert to `#111` fill, `#F6F6F4` text.
- **Filtered-out row:** `[hidden]` / `display:none`. Do not use `opacity:0` — hidden rows must leave the columns.

## Accessibility

- Section: `aria-label="Frequently asked questions"`.
- Search has a visually hidden `<label for="q">` “Filter questions”. Use `type="search"`.
- Each question is a `<button>` with `aria-expanded` and `aria-controls` pointing at the panel id. Panel is `role="region"` + `aria-labelledby` the button.
- Count (`#shown`) updates in visible text; it does not need a live region on every keystroke (that would chatter). The empty heading is enough when the list collapses.
- Keyboard: Tab through nav → search → each visible question button → Clear (when shown). Enter/Space toggles the focused question (native button).
- Contrast: `#111` on `#F6F6F4` 16:1; `#5A5A56` on `#F6F6F4` 5.8:1; `#1F4E79` on `#F6F6F4` 7.4:1; navy on `#E6EEF4` ≥ 7:1.
- Hit targets: search 44px; question rows ≥ 44px (14px padding + 15px/1.3 type); Clear 36px × auto with 12px padding.

## Responsive rules

- ≥ 1280: two columns, 48px gutter, lead is heading + 340px search, pad 56px.
- 1024–1279: pad 28px, lead stacks (search under heading), gutter 24px. Two columns remain.
- 768–1023: one column; nav links hide; heading 26px. Filter still applies to the single stack (odds then evens, or keep source order by walking both columns).
- < 640: same single column. Search stays 44px full width.

## Acceptance checklist

- [ ] First frame shows eight numbered questions in two columns; 01 is open; search is empty; count is **8 of 8**.
- [ ] Typing `auth` leaves two rows and the count reads **2 of 8**.
- [ ] A non-matching filter shows the empty state and hides every row.
- [ ] Clear filter restores eight rows and focuses the search field.
- [ ] Accordion height animates with `grid-template-rows` 0fr → 1fr over 280ms; several rows may be open together.
- [ ] Open question and plus icon are navy; plus rotates 45°.
- [ ] Answers use Geist Mono chips on `#E6EEF4` for codes such as `401 kestrel.auth.stale`.
- [ ] Type pairing is Geist + Geist Mono only. Ground is `#F6F6F4`. Navy is `#1F4E79`, not a purple-to-blue gradient.
- [ ] Focus rings are 2px navy, 3px offset, on search, questions, and Clear.
- [ ] `prefers-reduced-motion: reduce` keeps filter and toggle, instant height.
- [ ] Demo fills 1280×800 and starts with the piece header comment.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: 52px nav (8px rotated-square mark + Kestrel + Guides / API / Changelog in Geist Mono + “docs 2.4.1”). Lead: kicker “DOCS · FAQ”, 32px heading “Questions the API desk hears”, search on the right with placeholder “Filter by topic — auth, webhook, region…”. Count reads **8** of 8 topics. Eight rows in two columns (odd numbers left, even right). Question 01 is open (`aria-expanded="true"`), its plus icon rotated 45°, text navy. The other seven are closed.
2. Click a closed question: that row opens over 280ms; its plus rotates 45° to a close mark; question text turns `--navy`. Other open rows stay open.
3. Click an open question: it closes on the same clock; icon returns to +; colour returns to `--ink`.
4. Type `auth` in the search field: rows whose haystack contains “auth” stay; the rest get `hidden`. Count becomes **2 of 8** (01 rotate key, 06 signed requests). Open/closed state of survivors is unchanged.
5. Type a string with no hit (e.g. `banana`): count **0 of 8**, `#empty` gets `.show`, the two columns look vacant. Empty copy offers `auth`, `webhook`, `region` as examples.
6. Click **Clear filter**: input value is emptied, all eight rows unhide, count returns to 8, focus returns to the search field.
7. Clearing the field with the input’s native clear control (type=search) also runs the same `input` handler.
8. Reduced motion: panel and icon transitions become 1ms. Filter still works.

## Tokens

```css
:root {
  --bg: #f6f6f4;
  --ink: #111111;
  --ink-2: #5a5a56;
  --ink-3: #8a8a84;
  --line: #e2e2dc;
  --line-2: #c8c8c2;
  --navy: #1f4e79;        /* kicker, open question, focus, code */
  --navy-soft: #e6eef4;   /* code chip */

  --sans: "Geist", system-ui, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;

  --nav-h: 52px;
  --pad: 56px;
  --search-h: 44px;
  --gap-cols: 48px;

  --t-fast: 160ms;
  --t-open: 280ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Body / answers | Geist | 14px | 400 | 1.45 | 0 | sentence |
| Brand | Geist | 14px | 600 | 1 | −0.02em | sentence |
| Nav links | Geist Mono | 12px | 400 | 1 | 0 | sentence |
| Version / count | Geist Mono | 11px | 400 / 500 | 1 | 0 | sentence |
| Kicker | Geist Mono | 11px | 500 | 1 | +0.12em | UPPERCASE |
| Heading | Geist | 32px | 600 | 1.1 | −0.03em | sentence |
| Search input | Geist | 14px | 400 | 1 | 0 | as typed |
| Question | Geist | 15px | 500 | 1.3 | −0.01em | sentence |
| Number | Geist Mono | 11px | 400 | 1.3 | 0 | 01–08 |
| Code | Geist Mono | 12px | 400 | 1 | 0 | as written |
| Empty title | Geist | 22px | 600 | 1.2 | −0.02em | sentence |
| Clear button | Geist Mono | 12px | 500 | 1 | 0 | sentence |

## Implementation notes

**Split columns in source, filter in place.** Build eight items, append odds to column A and evens to column B, then toggle `hidden` — do not rebuild the DOM on each keystroke or the open state is lost:

```js
el.hidden = t && !el.dataset.hay.includes(t);
```

Store a plain-text haystack (question + answer, tags stripped) on `data-hay` at build time.

**Height without scrollHeight:**

```css
.panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 280ms var(--ease); }
.item.open .panel { grid-template-rows: 1fr; }
.panel > div { overflow: hidden; min-height: 0; }
```

**Empty state is a grid child**, not a sibling covering the grid:

```css
.empty { display: none; grid-column: 1 / -1; }
.empty.show { display: block; }
```

Common mistakes: a single-column accordion (that is a different piece); filtering only the question title so “429” misses the burst answer; `display:none` on the panel for close (no animation, and `hidden` on the item already covers filter); loading Inter instead of Geist; a magnifying-glass PNG.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
