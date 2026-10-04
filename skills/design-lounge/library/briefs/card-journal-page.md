<!-- Design Lounge Nº 285 · "Journal page" · designlounge.vercel.app -->

# Journal page

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A daily journal drawn as a sheet of ruled notepad paper on a kraft desk. The page has a pink margin line, three punched holes, a typewriter entry label and a handwritten date. The writing area is a real `textarea` set in Caveat, and its ruled lines scroll with the text, so every line of writing sits on a rule no matter how long the entry gets. Beside the page are two paper slips: a mood sticker sheet (five die-cut circle stickers) and an ink tray (four colours). Picking a mood sticks a large version onto the page's top-right corner with a small overshoot. Each day keeps its own page, and the entry autosaves 600ms after you stop typing. The detail worth copying is the rule alignment: one `repeating-linear-gradient` with `background-attachment: local`, sized to the line-height.

## Reference behaviour

1. First frame: today's date as "Sunday 4 October" (weekday, day, month, en-GB) in 44px Caveat. Above it, "ENTRY 278 · 2026 · TODAY" (day of year). The Next-day arrow is disabled.
2. On first visit, today's page holds a three-paragraph sample entry in Indigo ink with the Calm sticker on the page. The footer reads "54 words" and "Not saved yet".
3. Typing updates the word count live. The status becomes "Saving…" at once, and 600ms after the last keystroke it becomes "✓ Saved on this device · 00:23".
4. Clicking a mood sticker in the sheet sticks it onto the page. It lands at its own fixed tilt between −6° and +10°, from 1.35 scale and −14° extra rotation, over 420ms with overshoot. The chosen sticker in the sheet fades to 35% and shrinks to .9, as if it was peeled off.
5. Clicking the chosen mood again removes the sticker. Arrow keys in the mood group move and select but never deselect.
6. Clicking an ink changes the text and caret colour over 240ms and moves the ring to that swatch. The choice saves with the entry.
7. Previous day saves any pending edit first, then loads that day's page. Empty days show "Nothing written on this day yet." as a placeholder, no sticker, and Indigo ink. You can't go past today.
8. Text, mood, ink and save time are stored per date under `journal:YYYY-MM-DD`.
9. If storage is unavailable (sandboxed iframe, private mode), saving falls back to memory and the status says "Saved for this session" instead.

## Structure

```
1280 × 800 kraft desk, padding 40, desk grid [720 page][210 tray], gap 40
┌─────────────────────────── page 720 × 700 ───────────────────┐  ┌ slip −1.2° ┐
│     ┊ ENTRY 278 · 2026 · TODAY                      ( ✿ )    │  │ MOOD STICKER│
│     ┊ Sunday 4 October  ‹ ›          44px            88px    │  │ (☀)(❧)(☁)   │
│═════╪════════════════════ double margin rule ════════════════│  │ (☂)(⚡)      │
│ ( ) ┊ Walked the long way to the bakery. The fog…   27/34px  │  └─────────────┘
│─────┼────────────────────────────────────────────────────────│  ┌ slip +0.8° ┐
│     ┊ river and everything sounded closer than it was.       │  │ INK         │
│─────┼────────────────────────────────────────────────────────│  │ ● ● ● ●     │
│ ( ) ┊ …                                                       │  └─────────────┘
│     ┊                                                         │  tip text
│─────┼────────────────────────────────────────────────────────│
│     ┊ 54 words                          Not saved yet  46px  │
└─────┴────────────────────────────────────────────────────────┘
 margin at 88px · holes 22px at left 30 · second sheet behind, rotated 1.6°
```

- `main.desk` is a 2-column grid.
- `section.page` is labelled by the date `h1`. It is a flex column: `header.head` (124px, 3px double margin-colour bottom border), `textarea` (`flex: 1`), `footer.foot` (46px, 1px rule top).
- `.page::after` draws the 1.5px margin line at `left: 88px` over the full height. `.page::before` is the second sheet behind (`#f2ead8`, rotated 1.6°, translated 6px 4px).
- `.holes` holds three 22px circles in desk colour with an inner shadow, spaced with `justify-content: space-around` and 90px vertical padding.
- `.placed` is absolutely positioned at top 20, right 30 in the header and holds the stuck sticker.
- `aside.tray` holds two `.slip` cards, each with an `h2` label and a radiogroup, plus a tip line.

## Tokens

```css
:root {
  --desk: #b89f7b;        /* kraft */
  --desk-2: #a98f6a;
  --paper: #fbf6e9;
  --paper-2: #f2ead8;     /* sheet behind */
  --card: #fffdf6;        /* tray slips */
  --rule: #b9cde0;        /* blue rules */
  --margin: #e2908c;      /* pink margin + double header rule */
  --label: #5e5243;
  --label-2: #6f6353;
  --ink: #233067;         /* current ink, swapped at runtime */

  --hand: "Caveat", "Bradley Hand", cursive;
  --type: "Courier Prime", "Courier New", monospace;

  --lh: 34px;             /* line pitch: line-height AND rule spacing */
  --rule-at: 29px;        /* rule offset inside each 34px band, sits just under the baseline */
  --margin-x: 88px;

  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --stick: cubic-bezier(.34,1.4,.64,1);   /* overshoot, stickers only */

  --save-debounce: 600ms;
}
```

Inks: Indigo `#233067`, Sepia `#6b4226`, Forest `#2f5b3a`, Oxblood `#8a2432`.
Stickers (fill, then a 4px white die-cut border): Bright `#f6c945` sun, Calm `#9ccb9a` leaf, Meh `#cfd6dc` cloud, Low `#8fb3d9` rain cloud, Wired `#f08a5d` bolt. Icons are 24-grid strokes at 2px in `#2a2620`, 56% of the sticker.
Desk texture: two repeating gradients, `87deg rgba(255,255,255,.035) 0 2px, transparent 2px 7px` and `3deg rgba(0,0,0,.03) 0 1px, transparent 1px 5px`.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Entry label | Courier Prime | 11px | 700 | 1 | .18em | upper, `--label-2` |
| Date | Caveat | 44px | 600 | 1.05 | 0 | — `#2a2620` |
| Writing | Caveat | 27px | 400 | 34px (`--lh`) | 0 | — `--ink` |
| Placeholder | Caveat | 27px | 400 | 34px | 0 | `#766b59` |
| Footer / status | Courier Prime | 12px | 400 | 1.5 | 0 | `--label-2` |
| Slip label | Courier Prime | 11px | 700 | 1 | .18em | upper |
| Sticker / ink names | Courier Prime | 11px | 400 | 1.1 | 0 | — |

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Stuck sticker | mood pick | opacity, rotate, scale | 0, r−14°, 1.35 → 1, r, 1 | 420ms | `--stick` |
| Sheet sticker | hover | rotate, scale | 0, 1 → −8°, 1.06 | 200ms | `--stick` |
| Sheet sticker | picked | opacity, scale | 1, 1 → .35, .9 | 200ms | standard |
| Ink swatch | hover | translateY | 0 → −2px | 160ms | standard |
| Writing colour | ink pick | colour | old ink → new ink | 240ms | standard |
| Page focus ring | textarea focus | box-shadow | none → 0 0 0 3px ink | 200ms | standard |

Loading a different day never animates the sticker; only a pick does. Reduced motion: the sticker appears in place, and all transitions are off.

## States

- Textarea focused: no inner outline. The whole page gets a 3px ring in the current ink colour (`.page:focus-within`).
- Day arrow hover: 8% label-colour circle. Disabled (Next on today): 30% opacity, no hover.
- Mood picked: `aria-checked="true"`, faded in the sheet, large copy on the page. None picked: the page corner is empty.
- Ink picked: a 3px card-colour gap and a 2px ring of the ink itself around the 34px swatch.
- Status: "Not saved yet" (no save time), "Saving…" (darker label colour), "✓ Saved on this device · HH:MM" or "✓ Saved for this session · HH:MM".
- Empty day: placeholder in `#766b59`, "0 words".

## Accessibility

- The textarea has a visually hidden label and `aria-label="Journal entry for Sunday 4 October"`, updated per day.
- The mood sheet and ink tray are each `role="radiogroup"` labelled by their slip heading. Every option is `role="radio"` with a name ("Calm", "Oxblood ink") and roving tabindex. Arrow keys move and select.
- The stuck sticker is `role="img"` with `aria-label="Mood: Calm"`.
- The save status is `role="status"`, so changes are announced politely.
- Day arrows are named "Previous day" / "Next day", and they are real disabled buttons at the limit.
- Contrast on `#fbf6e9`: Indigo 11.5:1, Sepia 8.0:1, Forest 7.3:1, Oxblood 8.2:1, labels 5.4–7.0:1, placeholder 4.8:1. The tip on kraft uses `#3a3125` (5.0:1).
- Hit targets: day arrows 36px, stickers 52px, ink swatches 34px inside a ~44px button.

## Responsive rules

- ≥1280: as drawn.
- ≤1000: one column. The tray moves under the page as an auto-fit row of slips (min 200px). The tip is hidden.
- ≤640: margin moves to 44px, holes are hidden, the page is 600px tall, the date is 32px and wraps above the arrows, and the stuck sticker is 64px. The 34px pitch and the rule offset do not change.
- 375: no horizontal scroll. The writing still sits on the rules.

## Acceptance checklist

### Always

- [ ] Line-height and rule spacing are the same token. Every written line sits on a rule while scrolling a long entry.
- [ ] The rules belong to the textarea background with `background-attachment: local`, not to the page.
- [ ] The margin line runs the full page height at a fixed x, and text starts 20px right of it.
- [ ] Each day has its own entry. You can't navigate past today.
- [ ] Edits autosave after a 600ms debounce. Switching day flushes a pending save first.
- [ ] Storage access is wrapped in try/catch and falls back to memory. The status says which one happened.
- [ ] Mood and ink are radiogroups with roving tabindex. Clicking the chosen mood clears it.
- [ ] The textarea's focus is shown on the page (ring in the ink colour), not as an inner rectangle.
- [ ] Reduced motion removes the sticker overshoot.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Kraft desk `#b89f7b`, paper `#fbf6e9`, rules `#b9cde0`, margin `#e2908c` at 88px.
- [ ] Writing is Caveat 27px on a 34px pitch, with the rule at 29px in each band.
- [ ] Five stickers: Bright, Calm, Meh, Low, Wired. Four inks: Indigo, Sepia, Forest, Oxblood.
- [ ] Today's sample entry starts "Walked the long way to the bakery." and opens with Calm and Indigo.
- [ ] Storage keys are `journal:YYYY-MM-DD`, holding JSON `{text, mood, ink, at}`.

## Implementation notes

**1. Rules that follow the text.** Put the rules on the textarea itself and let them scroll with its content. The offset depends on the font's ascent. For Caveat at 27px in a 34px line, the baseline is about 26px down, so the rule sits at 29px. If you change the font, change `--rule-at`, never the pitch.

```css
textarea {
  font: 400 27px/var(--lh) var(--hand);
  padding: 0 36px 0 calc(var(--margin-x) + 20px);   /* no top padding: band 1 starts at 0 */
  background: transparent repeating-linear-gradient(to bottom,
    transparent 0 var(--rule-at),
    var(--rule) var(--rule-at) calc(var(--rule-at) + 1px),
    transparent calc(var(--rule-at) + 1px) var(--lh));
  background-attachment: local;    /* the key line: rules scroll with the text */
  resize: none; border: 0; outline: 0;
}
```

Common mistake: vertical padding on the textarea that isn't a multiple of 34px. Every line then sits off its rule.

**2. Storage that can't crash the page.** The demo keeps entries in memory only, because it runs in a sandboxed iframe. In a real product, persist to the user's device or account. Sandboxed iframes throw on any access to `localStorage`, even reading the property, so probe it once and fall back.

```js
const store = (() => {
  const mem = {};
  try {
    const s = window.localStorage; s.setItem("__jp", "1"); s.removeItem("__jp");
    return { get: k => s.getItem(k), set: (k, v) => s.setItem(k, v), durable: true };
  } catch (e) {
    return { get: k => mem[k] ?? null, set: (k, v) => { mem[k] = v; }, durable: false };
  }
})();
```

**3. Debounced save with a flush.**

```js
ta.addEventListener("input", () => { entry.text = ta.value; words(); setStatus("saving");
  clearTimeout(saveT); saveT = setTimeout(save, 600); });
function shift(n) {
  clearTimeout(saveT); if (pending) save();         // never lose the last keystrokes
  const d = new Date(day); d.setDate(d.getDate() + n);
  if (d > TODAY) return; day = d; load();
}
```

Build dates at local noon (`setHours(12)`) before `toISOString().slice(0,10)`, so keys don't slip a day around midnight in far-from-UTC time zones.

Other mistakes to avoid:

- A `contenteditable` div with rules drawn on the page behind it. The rules stop matching as soon as it scrolls.
- Animating the sticker every time a day loads. Only a fresh pick earns the overshoot.
- Emoji moods. The stickers are SVG strokes on flat colour circles.
- Saving on every keystroke without a debounce.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
