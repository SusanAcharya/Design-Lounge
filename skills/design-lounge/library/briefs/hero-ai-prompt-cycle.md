<!-- Design Lounge Nº 091 · "AI prompt cycle hero" · www.designlounge.live -->

# AI prompt cycle hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The top of a B2B search product ("Hollis"). A 64px nav, a "New" pill, a 96px serif headline **Ask the whole company / at once.**, then an 820px question box that auto-types four canned prompts. Submitting streams a two-sentence answer with numbered source chips. The box feels like a real composer: 22px radius, sunk source pills, a 40px terracotta send disc. The detail worth copying is the ghost layer — while demoing, a transparent textarea sits under a `.ghost` that paints the typed string plus a 2px blinking caret, so focus still works and the demo stops on first focus without a flash.

## Structure

```
1280 × 800  body flex column, overflow hidden, bg #EDF1EE
┌────────────────────────────────────────────────────────────────────────┐
│ nav 64  [star] hollis     Product Customers Security Pricing   Log in [Get Hollis] │
│ pad 0 48, logo 32px serif, links 14px ink-2                            │
├────────────────────────────────────────────────────────────────────────┤
│                         [NEW] Hollis 3 now reads…   pill               │
│                   Ask the whole company                                │
│                   at once.          96px / .98, em ink-2               │
│                   sub 17px, max 560, centred                           │
│         ┌ wrap 820 ─────────────────────────────────────────────┐      │
│         │ box r 22, pad 20 20 14, shadow                         │      │
│         │  field 60h  textarea + ghost (21px/1.4)                │      │
│         │  [Wiki · Drive · Chat · 4 more] [Only what you can see]│      │
│         │  Hollis 3 · fast                              (send 40)│      │
│         └────────────────────────────────────────────────────────┘      │
│         chips 36h, gap 8, centred                                      │
│         answer (hidden until asked): h · meta · New question           │
│                                body 15/1.6 · cites                     │
│  SOC 2 Type II · Your data never trains models · Used by 1,900 teams   │
└────────────────────────────────────────────────────────────────────────┘
  main flex 1, align centre, pad 44 48 28; trust row margin-top auto
```

- `<nav aria-label="Main">` — 20px four-point star SVG in `--accent`, wordmark "hollis", four links, "Log in", pill "Get Hollis".
- Badge: `<b>New</b>` terracotta on `--accent-soft`, then the Hollis 3 sentence.
- `<form class="box typing" id="box" autocomplete="off">` — sr label "Ask Hollis a question", `.field` with `#q` textarea (2 rows) and `#ghost` (`aria-hidden`) containing `#gt` + `.caret`.
- Tools: two `.src` pills, `.model` "Hollis 3 · fast", `<button class="send" aria-label="Ask">`.
- `#chips` `role="group" aria-label="Example questions"` — buttons built in JS from the prompt list.
- `<section class="answer" aria-live="polite" aria-busy="false">` — `.ahead`, `#text`, `#cites`.
- `.trust` — three items, first with a shield SVG.

Prompts and answers (match exactly):

1. q: `What did we promise Larchmont in the renewal?`  
   a: `In the 12 September renewal we committed to SSO for all 340 seats by 1 November, a 99.9% uptime SLA with 10% service credits, and a dedicated success manager. Pricing is locked at $38 per seat for 24 months.`  
   cites: Renewal memo · Sep 12 / Order form v3 / #acct-larchmont
2. q: `Summarise Q3 churn by plan, with the top reason for each.`  
   a: `Q3 logo churn was 2.1%. Starter lost 41 accounts, mostly to price after the July change; Team lost 9, citing missing audit logs; Business lost 2, both after mergers. Net revenue retention held at 112%.`  
   cites: Q3 board deck / Churn survey export / Pricing retro
3. q: `Draft the on-call handoff for this week.`  
   a: `Handoff for 28 Sep to 5 Oct: two open incidents (INC-482 queue lag, INC-485 flaky webhooks), the Postgres minor upgrade is scheduled Thursday 02:00 UTC, and the billing cron moved to every 15 minutes.`  
   cites: Incident log / Runbook: upgrades / #eng-oncall
4. q: `Which product specs mention offline mode?`  
   a: `Three specs mention offline mode: Mobile Sync v2 (approved, ships in 4.8), Field Notes (draft, owner Priya Nair) and the 2025 Kiosk proposal, which was shelved in March.`  
   cites: Mobile Sync v2 / Field Notes draft / Kiosk proposal  
   Fallback a: `I found 6 documents that touch on this. The most recent is from last Tuesday; the clearest answer is in the team wiki, which was updated by Jonah Weiss two weeks ago.`  
   cites: Team wiki / #general / Weekly notes

## Motion

| Element        | Trigger      | Property                 | From → To                    | Duration        | Easing   | Notes |
|----------------|--------------|--------------------------|------------------------------|-----------------|----------|-------|
| Ghost type     | load, loop   | text length              | 18 → full → 0 → next         | 34–64ms / 16ms  | —        | dwell 1800ms, gap 420ms |
| Caret          | typing       | opacity                  | 1 ↔ 0                        | 1s steps(1)     | —        | hidden when not `.typing` |
| Box focus      | focus-within | border, box-shadow       | line → `#b7c3bc` + 4px wash  | 160ms           | `--ease` | `rgba(232,100,60,.14)` |
| Answer panel   | submit       | opacity, translateY      | 0, 8px → 1, 0                | 420ms           | `--expo` | display:block via `.asked` |
| Thinking dots  | submit       | opacity, translateY      | bounce                       | 900ms infinite  | `--ease` | delays 0 / 150 / 300ms |
| Words          | stream       | opacity, blur            | 0, 2px → 1, 0                | 240ms           | `--ease` | one span per word, 42ms |
| Cites          | `.done`      | opacity                  | 0 → 1                        | 420ms           | `--ease` | |
| Send           | hover/active | background, scale        | accent → `#d4532c` / .94     | 160ms           | `--ease` | |
| Chip pressed   | demo / click | bg, color, border        | transparent → `--ink`        | 160ms           | —        | |

While `.typing`, textarea colour and caret-color are `transparent` so only the ghost is seen.

## States

- **Typing (default):** `.box.typing`, ghost visible, chips press the active index.
- **Editing:** `.typing` off, ghost `display:none`, real caret. Chip press cleared on `input` (`mark(-1)`).
- **Asked:** chips hidden, answer shown. `aria-busy="true"` until the last word.
- **Chip hover:** surface fill, ink type, border `#b7c3bc`. Pressed: `--ink` fill, `--surface` type.
- **New question hover:** ink type, border `--ink-3`.
- **Get Hollis hover:** `#2b3a32`. Nav/login hover: `--ink`.
- **Focus-visible:** 2px accent outline, 3px offset (global). Textarea uses the box ring instead of its own outline.

## Accessibility

- Textarea has a clipped `<label for="q">`. Send `aria-label="Ask"`.
- Chips are a `role="group"` of buttons with `aria-pressed`.
- Answer is `aria-live="polite"` and toggles `aria-busy` during the stream. Thinking dots have `aria-label="Thinking"`.
- Keyboard: Tab through nav → textarea → send → chips (or New question once asked). Enter submits; Shift+Enter would be a newline but the handler always prevents Enter without Shift.
- Contrast: `--ink-2` on `--bg` ~5.8:1; `--ink-3` only on 12–13px meta. White on terracotta send is for the icon only.
- Hit targets: send 40×40, chips 36px, New question 28px (small, desktop hero — keep it).

## Responsive rules

- ≥ 1280: as specified, wrap 820px, headline 96px.
- 1024–1279: headline 80px; wrap `min(820px, 100% - 64px)`.
- 768–1023: headline 56px; nav links may hide; wrap full width minus 40px; chips wrap.
- < 640: headline 40px; stack trust items; source pills can wrap under the field. Keep the ghost/textarea pair.
- Reduced motion as in Reference behaviour — first prompt visible, no caret blink.

## Acceptance checklist

- [ ] Headline is 96px Instrument Serif; second line "at once." is `--ink-2` italic.
- [ ] Question box is 820px, radius 22px, field 21px/1.4, send 40px terracotta disc.
- [ ] On load (motion on) the ghost types prompt 1 from character 18, dwells 1800ms, deletes, cycles all four.
- [ ] The matching example chip is `aria-pressed="true"` while that prompt types.
- [ ] Focus or chip click stops the demo and puts real text in the textarea.
- [ ] Submit streams the matching canned answer after a 650ms think, 42ms per word; cites fade in at the end.
- [ ] Unknown questions use the Jonah Weiss fallback and three generic cites.
- [ ] New question hides the answer, clears the field, does not restart typing.
- [ ] Enter without Shift submits; Shift+Enter is prevented from submitting.
- [ ] Reduced motion loads prompt 1 as static text and writes answers in one paint.
- [ ] Answer region is `aria-live="polite"` and `aria-busy` during the stream.
- [ ] Focus-visible rings are 2px terracotta on nav, chips, send, and New question.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: `.box.typing` is on. Ghost shows the first prompt already 18 characters in ("What did we promise L"), then types forward at 34–64ms per character. After the full string, wait 1800ms, delete at 16ms/char, wait 420ms, advance to the next prompt. Cycle the four prompts. The matching chip is `aria-pressed="true"`.
2. Four chips, left to right: "Larchmont renewal", "Q3 churn by plan", "On-call handoff", "Specs on offline mode".
3. Clicking a chip (or focusing the textarea) calls `stopDemo`: clear the timer, remove `.typing`, put that prompt (or the current one, if focus with empty field) into the textarea, focus the field.
4. Enter (without Shift) or the send button submits. Empty value is ignored. Matched prompt plays its canned answer; any other string plays a generic 6-document fallback.
5. On submit: `.wrap` gets `.asked` (chips `display:none`, answer `display:block`). Answer fades/slides in 420ms expo (opacity 0 + 8px rise → 1 / 0). For 650ms show three bouncing dots (`aria-label="Thinking"`), then stream words: each word is a `.w` span, 42ms apart, 240ms blur-in. When finished, `.answer.done` fades the cite chips and sets `aria-busy="false"`.
6. Header of the answer: terracotta "h" mark, "Searched 1,284 documents", **New question** (28px pill). New question clears `.asked` / `.show` / `.done`, empties the field, `aria-pressed` off all chips, refocuses the textarea. It does **not** restart the typewriter.
7. Send is type=submit, 40px circle. Hover `#d4532c`; active `scale(.94)`; disabled (not used in the demo) `#c9d1cc`.
8. Reduced motion: skip the typewriter. Load prompt 1 into the textarea, mark chip 0, no `.typing`. Streaming writes the full answer in one shot; thinking delay is 0. Answer has `transition:none`. Caret and dots do not animate.

## Tokens

```css
:root {
  /* colour — cool paper, forest ink, terracotta send */
  --bg: #edf1ee;
  --surface: #fbfcfb;
  --sunk: #e3e9e5;
  --ink: #17201b;
  --ink-2: #55605a;
  --ink-3: #7c8580;
  --line: #d5ddd8;
  --accent: #e8643c;
  --accent-ink: #fff;
  --accent-soft: #fbe3d9;

  /* type */
  --serif: "Instrument Serif", Georgia, serif;
  --sans: "Instrument Sans", system-ui, sans-serif;

  /* layout */
  --wrap: 820px;
  --nav-h: 64px;
  --r-box: 22px;
  --r-chip: 999px;
  --shadow: 0 1px 2px rgba(23, 32, 27, .06), 0 12px 32px -12px rgba(23, 32, 27, .18);

  /* motion */
  --t-micro: 160ms;
  --t-card: 420ms;
  --type-ms: 34;          /* + random 0–30 */
  --delete-ms: 16;
  --dwell: 1800ms;
  --gap: 420ms;
  --think: 650ms;
  --word: 42ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role          | Family           | Size | Weight | Line-height | Tracking | Case      |
|---------------|------------------|-----:|-------:|------------:|---------:|-----------|
| Wordmark      | Instrument Serif | 32px | 400    | 1           | −0.01em  | lowercase |
| Nav / login   | Instrument Sans  | 14px | 400    | 1.5         | 0        | sentence  |
| Get Hollis    | Instrument Sans  | 14px | 500    | 1           | 0        | sentence  |
| Badge         | Instrument Sans  | 13px | 500    | 1           | 0        | sentence  |
| Badge NEW     | Instrument Sans  | 11px | 600    | 1           | +0.06em  | UPPERCASE |
| Headline      | Instrument Serif | 96px | 400    | 0.98        | −0.025em | sentence  |
| Sub           | Instrument Sans  | 17px | 400    | 1.5         | 0        | sentence  |
| Prompt        | Instrument Sans  | 21px | 400    | 1.4         | −0.01em  | sentence  |
| Tools / chips | Instrument Sans  | 13px | 400/500| 32 / 36px h | 0        | sentence  |
| Answer        | Instrument Sans  | 15px | 400    | 1.6         | 0        | sentence  |
| Meta / cites  | Instrument Sans  | 12px | 400/600| 1           | 0        | sentence  |
| Trust         | Instrument Sans  | 13px | 400    | 1.5         | 0        | sentence  |
| Mark "h"      | Instrument Serif | 14px | 400 italic | 18px box | 0      | lowercase |

## Implementation notes

**Ghost over a real textarea** so focus, IME and submit stay native:

```css
textarea, .ghost { position: absolute; inset: 0; font: 400 21px/1.4 var(--sans); }
.box.typing textarea { color: transparent; caret-color: transparent; }
.box:not(.typing) .ghost { display: none; }
```

**Type / delete loop** — start `pos` at 18 so the first frame is already mid-sentence:

```js
function tick() {
  if (!demo) return;
  const full = P[i].q;
  if (dir > 0) {
    pos++; gt.textContent = full.slice(0, pos); mark(i);
    if (pos >= full.length) { dir = -1; t = setTimeout(tick, 1800); return; }
    t = setTimeout(tick, 34 + Math.random() * 30);
  } else {
    pos--; gt.textContent = full.slice(0, pos);
    if (pos <= 0) { dir = 1; i = (i + 1) % P.length; t = setTimeout(tick, 420); return; }
    t = setTimeout(tick, 16);
  }
}
```

**Word stream** — wait 650ms on the dots, then append spans; reduced motion writes `textContent` once:

```js
s = setTimeout(function next() {
  if (k === 0) text.textContent = '';
  if (reduce) { text.textContent = p.a; k = words.length; }
  else {
    const w = document.createElement('span'); w.className = 'w';
    w.textContent = (k ? ' ' : '') + words[k++]; text.appendChild(w);
  }
  if (k < words.length) s = setTimeout(next, 42);
  else { ans.classList.add('done'); ans.setAttribute('aria-busy', 'false'); }
}, reduce ? 0 : 650);
```

Common mistakes: typing into the textarea during the demo (the caret will fight the ghost — keep colour transparent and drive `#gt` only); restarting the typewriter after New question; using one `innerHTML` rewrite per word (that kills the per-word animation); forgetting `Enter` preventDefault so a newline is inserted; matching prompts with case-folded compare (the demo uses exact `P.find(x => x.q === v)`).

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
