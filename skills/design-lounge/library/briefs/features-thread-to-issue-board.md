<!-- Design Lounge Nº 452 · "Thread to issue board" · designlounge.vercel.app -->

# Thread to issue board

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Studied from linear.app: the "Intake" feature band, where a chat thread panel overlaps a dimmed, edge-faded issue board, so the page shows conversation turning into work. This version is for an invented issue tracker, Tracewell, in cool graphite with a single mint accent. It is fully live: press Send on the prefilled "@Tracewell file these and assign to me", a bot reads the thread, and two issues slide into the Todo column behind the panel, with chips in the reply that light up their cards. The detail worth copying is the two-layer scene: a crisp foreground UI over a background UI that is masked away at its right and bottom edges, so it reads as "the product, continuing beyond the frame".

## Reference behaviour

1. First frame: a 46px two-line heading "Intake that / files itself" on the left; on the right an 18px lede with a bold first sentence and a "How intake works →" link.
2. Below, the scene: a board with four 252px columns (Backlog 12, Todo 7, In progress 3, In review 2) starting 260px from the left, masked to transparent from 62% → 98% across and 58% → 96% down, at 90% opacity.
3. A 392px thread panel floats at the left over the Backlog column with a deep shadow. Header "# Thread #mobile-feedback". Three messages from Maya Okafor, Dev Patel and Lu Chen sit at the bottom of the panel (chat order, bottom-aligned).
4. The composer shows a draft: a mint "@Tracewell" mention pill, then "file these and assign to me". The mint Send button pulses a soft ring every 2.2s, so the viewer knows where to press.
5. Pressing Send: the pulse stops, the button disables, the draft becomes a grey placeholder "Message #mobile-feedback", and "You 10:46" appears with the same text (rises 8px, 400ms).
6. After 500ms a Tracewell message appears with a shimmering "Reading 3 messages…" (gradient text sweep, 1.2s loop).
7. After 1100ms the shimmer is replaced by "Filed 2 issues in Mobile, assigned to you, labelled Bug." and two chips: "TRW-412 Offline banner persists after reconnect" and "TRW-413 Upload retry is inert until relaunch".
8. For each chip, a card is inserted at the top of Todo: the slot opens from 0 to its height (grid-rows 0fr → 1fr, 450ms) while the card drops 10px and scales from 0.97 (600ms) with a mint border and 3px mint ring. Cards arrive 320ms apart. The Todo count goes 7 → 8 → 9 and turns mint.
9. 1.6s later the new cards settle to normal borders, the count returns to grey, and a "Reset demo" button fades into the thread header.
10. Hovering or focusing a chip outlines its card on the board in mint; clicking flashes it for 900ms.
11. The thread keeps at most four messages; older ones drop off the top.
12. Reset restores the original messages, Todo cards, count and draft, re-enables Send and moves focus to it.
13. With reduced motion, delays shrink to 120ms, nothing slides or shimmers, and the outcome is identical.

## Structure

```
┌──────────────────────────────────── 1280 × 800 ─────────────────────────────────────┐
│  Intake that                         Mention Tracewell in any thread. It reads the   │ head: 2 cols, gap 48
│  files itself       46/1.04          conversation, splits it into issues, …          │ lede 18px, max 470
│                                      How intake works →                              │
│                                                                                       │ 40px
│  ┌ # Thread #mobile-feedback ─────┐  ○ Todo 7         ◑ In progress 3   ◕ In review  │ board top +28px
│  │                                │┐ ┌─────────────┐  ┌─────────────┐  ┌─────────┄┄  │
│  │                                ││ │ TRW-401  MO │  │ TRW-389  SL │  │ TRW-380 ┄┄  │ cards 252 wide
│  │ MO Maya Okafor 10:42           ││ │ Paginate …  │  │ Cache …     │  │ Remove ┄┄   │
│  │ The offline banner never …     ││ └─────────────┘  └─────────────┘  └─────────┄┄  │
│  │ DP Dev Patel 10:44             ││ ┌─────────────┐  ┌─────────────┐                 │
│  │ LC Lu Chen 10:45               ││ │ TRW-398 …   │  │ TRW-386 …   │     ← mask fades │
│  │ ┌────────────────────────────┐ ││ └─────────────┘  └─────────────┘       right and  │
│  │ │ @Tracewell file these and …│ ││ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄                         bottom    │
│  │ │ ⊕ ☺ @              [Send →]│ ││                                                  │
│  └─┴────────────────────────────┴─┘│  (Backlog column hidden behind the thread)       │
│   thread 392px, left 40, bottom 28  │                                                  │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

- `section[aria-labelledby]` (flex column, `min-height: 100%`) → `.head` grid (`h2`, lede `p`, link) → `.scene` (`position: relative; flex: 1; overflow: hidden`).
- `.board` is `role="region"` labelled "Mobile team board": a four-column grid of `.col`, each a header row plus `article.issue` cards. Todo's cards live in `#todo` so new ones can be prepended.
- `.thread` is `role="region"` labelled "Thread in studio-feedback": header, `ol.msgs` (live region), and a `form.composer` with the draft `div`, decorative tool icons and a submit button.
- New cards are wrapped in a `.slot` whose grid rows animate from `0fr` to `1fr`, so the column below slides down rather than jumping.

## Tokens

```css
:root {
  --bg: #0D0F12;        /* page */
  --panel: #15181D;     /* thread */
  --raised: #1B1F25;    /* composer, chips, reset */
  --card: #171A1F;      /* board cards */
  --line: #262B33;      /* borders */
  --line-2: #1F242B;    /* inner rules */
  --text: #EEF0F3;
  --text-2: #A3ABB7;    /* body copy, lede */
  --text-3: #6C7480;    /* times, ids, counts */
  --mint: #5BE3B0;      /* the only accent: send, mention, bot, new items */
  --mint-ink: #0B2A1F;  /* text on mint */
  --mint-tint: rgba(91,227,176,.12);

  /* label dots: semantic, 7px only */
  --bug: #EF6F6C; --design: #6FA8FF; --backend: #E6B450;
  --perf: #8BD3E6; --feature: #B79CFF; --android: #A4D96C;

  --sans: "Onest", system-ui, sans-serif;
  --mono: "Fragment Mono", ui-monospace, monospace;

  --r-card: 8px; --r-panel: 12px; --r-ctl: 7px;
  --shadow-panel: 0 30px 60px -20px rgba(0,0,0,.7), 0 0 0 1px rgba(0,0,0,.4);
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## Typography

| Role | Family | Size / line | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Heading | Onest | 46px / 1.04 | 500 | -0.035em | `--text` |
| Lede | Onest | 18px / 1.45 | 400, lead 500 | 0 | `--text-2`, lead `--text` |
| Column header | Onest | 13px | 500 | 0 | `--text`; count Fragment Mono 12px `--text-3` |
| Card id | Fragment Mono | 12px | 400 | 0 | `--text-3` |
| Card title | Onest | 13px | 500 | 0 | `--text`, one line, ellipsis |
| Label chip | Onest | 11px | 400 | 0 | `--text-2` |
| Message name | Onest | 13px | 600 | 0 | `--text`; time 12px `--text-3` |
| Message body | Onest | 13.5px / 1.45 | 400 | 0 | `--text-2` |
| Send | Onest | 13px | 600 | 0 | `--mint-ink` on `--mint` |

## Motion

| Thing | Trigger | Property | From → to | Duration / delay | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Send pulse | idle | box-shadow ring | 0 → 8px, fade | 2.2s loop | standard | none |
| Your message | send | opacity, translateY | 0, 8px → 1, 0 | 400ms | expo | none |
| Bot thinking | +500ms | gradient position | 100% → −100% | 1.2s loop, 1.1s total | linear | plain grey text |
| Slot open | each issue | grid-template-rows | 0fr → 1fr | 450ms, 320ms apart | expo | instant |
| New card | each issue | opacity, translateY, scale | 0, −10px, .97 → 1, 0, 1 | 600ms | expo | instant |
| New card ring | each issue | border, box-shadow | mint → line | holds 1.6s, 200ms out | standard | instant |
| Count | each issue | colour | `--text-3` → `--mint` → back | 300ms | standard | instant |
| Chip link | hover / focus | card border, ring | line → mint | 200ms | standard | instant |
| Reset button | done | opacity | 0 → 1 | 200ms | standard | instant |

The shimmer's linear timing is fine: it is a texture, not a move.

## States

- Send: idle mint with pulse; hover brightness 1.08; active scale 0.97; disabled `--line` fill, `--text-3` text, no pulse.
- Draft: filled (mention pill + text) or empty placeholder in `--text-3`.
- Composer: focus-within raises its border to `#3A414C`.
- Bot message: thinking (shimmer) → done (sentence + chips).
- Card: rest `--line` border; new (mint border + ring); linked (mint, forced while a chip is hovered or focused).
- Count: grey; bumped mint while new cards are arriving.
- Reset: hidden and not clickable until the run ends.
- Focus-visible everywhere: 2px mint outline, offset 2px, radius 6px.

## Accessibility

- `ol.msgs` is `aria-live="polite"` with `aria-relevant="additions"`, so "You…", "Reading 3 messages…" and the filed summary are announced as they arrive.
- The Send button's accessible name includes the draft text: "Send: @Tracewell file these and assign to me".
- Each filed chip is a real `button`; focusing it highlights the matching card, giving keyboard users the same link that hover gives.
- Avatars and tool icons are `aria-hidden`; names are in text.
- Tab order: "How intake works", Reset (when shown), Send, then the chips once they exist.
- Reset returns focus to Send so a keyboard user can run it again immediately.
- Contrast: `--text-2` on `--panel` ≈ 7.5:1; `--text-3` ≈ 3.9:1, used only for 11–12px mono metadata; `--mint-ink` on `--mint` ≈ 10:1.
- The board is decorative context but stays in the accessibility tree as a labelled region, so its counts can be read.

## Responsive rules

- ≥ 1280: as drawn.
- < 980: heading row stacks (gap 16px), heading 38px, thread 340px wide, board starts at 220px.
- < 640: section padding 36px 16px; heading 32px; lede 16px; the thread becomes a full-width 470px block in flow, and the board sits under it at 490px down with four 240px columns that clip inside the scene (no page scroll sideways).
- The scene always has `overflow: hidden`; the board's right edge is faded by the mask, never by the window edge.
- At 375 nothing overflows horizontally.

## Acceptance checklist

### Always

- [ ] Two layers: a crisp foreground thread over a background board masked to transparent at its right and bottom edges.
- [ ] Sending the @mention produces your message, a thinking state, and a bot summary with one chip per filed issue.
- [ ] Each filed issue appears at the top of the correct column with a slot-open animation; the column count updates.
- [ ] Hovering or focusing a chip highlights its card; the link works by keyboard.
- [ ] One accent colour for everything the agent touches; label colours appear only as 7px dots.
- [ ] Messages are announced via a polite live region.
- [ ] A reset restores the exact first frame and refocuses Send.
- [ ] Reduced motion gives the same result with no slides or shimmer.
- [ ] No horizontal overflow at 375px.

### This demo

- [ ] Brand Tracewell; heading "Intake that files itself".
- [ ] Thread #mobile-feedback with Maya Okafor 10:42, Dev Patel 10:44, Lu Chen 10:45.
- [ ] Board columns Backlog 12, Todo 7, In progress 3, In review 2.
- [ ] Filed issues TRW-412 "Offline banner persists after reconnect" (Bug, Android) and TRW-413 "Upload retry is inert until relaunch" (Bug, Uploads); Todo becomes 9.
- [ ] Accent `#5BE3B0` on `#0D0F12`.

## Implementation notes

**1. Fade the background UI with two intersected masks.** One gradient fades to the right, one fades down; intersecting them gives the soft corner. WebKit needs the prefixed property with `source-in`.

```css
.board {
  opacity: .9;
  -webkit-mask-image: linear-gradient(90deg,#000 62%,transparent 98%), linear-gradient(180deg,#000 58%,transparent 96%);
  -webkit-mask-composite: source-in;
  mask-image: linear-gradient(90deg,#000 62%,transparent 98%), linear-gradient(180deg,#000 58%,transparent 96%);
  mask-composite: intersect;
}
```

**2. Insert without a jump.** Wrap each new card in a slot that animates `grid-template-rows` from `0fr` to `1fr`; the inner wrapper needs `overflow: hidden; min-height: 0`. Add the `open` class two frames after inserting, or the browser skips the transition.

```css
.slot { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .45s var(--expo); }
.slot.open { grid-template-rows: 1fr; }
.slot > div { overflow: hidden; min-height: 0; }
```

```js
todo.prepend(node);
requestAnimationFrame(() => requestAnimationFrame(() => node.classList.add('open')));
```

**3. Script the sequence with awaits.** A tiny `wait(ms)` that shortens under reduced motion keeps the choreography readable and guarantees the same end state. Guard against double sends with a `running` flag and the disabled button.

Common mistakes:

- Letting chip text wrap the issue id onto two lines; give the id `flex: none` and the message column `minmax(0, 1fr)` so the title ellipsizes.
- Dimming the board with a dark overlay instead of a mask; it looks like a modal backdrop.
- Faking the board as a screenshot. The new cards must enter the real column.
- Animating the cards in but leaving the count unchanged.
- An accent for every label. Label colours stay tiny; the agent owns the accent.
- Positioning the scene so the board bleeds past the viewport and creates a horizontal scrollbar.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
