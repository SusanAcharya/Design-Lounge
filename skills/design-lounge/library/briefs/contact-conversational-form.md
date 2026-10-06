<!-- Design Lounge Nº 102 · "Conversational contact form" · www.designlounge.live -->

# Conversational contact form

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The new-enquiry page of a small film and motion studio ("Odd/Hours"). It asks four questions one at a time: name, project type, budget and email. Each question is set in 64px Young Serif beside a 200px tomato step numeral. The page is a flat sunflower yellow with ink type, and a 4px progress bar runs along the bottom edge of the header. Enter advances, A–D pick choices, and a review step lists every answer with an Edit link. The detail worth copying is that the form talks back: question two greets the visitor by the first name typed in question one, and the success screen does too.

## Structure

```
1280 × 800
┌────────────────────────────────────────────────────────────────────────┐
│ Odd/Hours  FILM & MOTION STUDIO · NEW ENQUIRY                 01 / 04  │ 72h
│▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀────────────────────────────────────────│ 4px bar
│                                                                        │
│  ██  ██         Hello. Who are we talking                              │ 64px serif
│  01 (200px)     to?                                                    │
│                 Maya Okafor_________________________                    │ 40px serif input
│  I                                                                     │
│  N rotated      (error line 24h)                                       │
│  T label                                                               │
│                 ──────────────────────────────────────────────────     │
│                 Today          Within 48 h       Week one              │ next-steps strip
│                                                                        │
│                 [ OK → ]  press [Enter]                         (↑)    │ 104h footer
└────────────────────────────────────────────────────────────────────────┘
   300px numeral column │ fluid stage (left edge x = 348)
```

- `<header>` 72px flex: logo, meta line, `.count[aria-live]`, and `.bar[role=progressbar]` absolutely positioned at the bottom with an inner `<i>` for the fill.
- `<main>` is a grid with `300px 1fr` columns and 48px side padding. `.num[aria-hidden]` holds the giant numeral and a `writing-mode: vertical-rl` label rotated 180° at top 290px.
- `<form class="stage" novalidate>` holds five absolutely stacked `<section class="q">`. Only `.q.on` is visible.
  - Text steps: the `<h2>` wraps a `<label for>` above a borderless `<input class="inp">` with a 2px underline.
  - Choice steps: `<section role="radiogroup" aria-labelledby>` containing `<button role="radio" aria-checked>` items.
  - Review: `<ul class="review">` rendered from the answers.
- `<ol class="steps">` is the next-steps strip, absolutely positioned at left 348px, right 88px, bottom 8px.
- `<footer>` 104px tall, left padding 348px: OK button, Enter hint, back button pushed right.
- `.done[role=status]` is fixed from top 72px to the bottom of the viewport.

## Motion

| Element        | Trigger        | Property             | From → To                 | Duration | Easing       | Delay |
|----------------|----------------|----------------------|---------------------------|---------:|--------------|------:|
| leaving `.q`   | advance        | opacity, translateY  | 1, 0 → 0, −48px           | 520ms    | `--ease` / `--ease-out` | 0 |
| leaving `.q`   | back           | opacity, translateY  | 1, 0 → 0, +48px           | 520ms    | same         | 0 |
| entering `.q`  | step change    | opacity, translateY  | 0, 48px → 1, 0            | 520ms    | same         | 120ms |
| progress fill  | step change    | width                | n/4 → (n+1)/4             | 520ms    | `--ease-out` | 0 |
| choice         | select         | background, color    | transparent → ink         | 160ms    | `--ease`     | then auto-advance at 260ms |
| buttons        | press          | scale                | 1 → .97                   | 160ms    | `--ease`     | |
| `.done`        | sent           | clip-path            | circle(0 at 92% 90%) → circle(150%) | 800ms | `--ease-out` | |

Reduced motion: every transition is 1ms with no delay. Steps swap instantly and the success panel appears without the wipe.

## States

- **Input focus:** the underline goes from ink to tomato and the caret is tomato. No box or ring, because the underline is the field.
- **Input error:** 14px/600 text in `--error` in a fixed 24px slot, so the layout never jumps.
- **Choice hover:** `--bg-2` wash. **Selected:** ink background, yellow text, inverted key cap, and a CSS-drawn check (`::after`, two borders rotated −45°).
- **Focus-visible (buttons, choices, Edit):** 3px tomato outline, 3px offset.
- **OK busy:** `aria-busy="true"`, `--ink-2` fill, label "Sending", pointer events off.
- **Back disabled:** step 01 only, 30% opacity.
- **Review rows:** a 140px label column, the answer, and an underlined Edit link (8px padding for a 40px hit area) that turns tomato on hover.

## Accessibility

- Each text step's question is the `<label>` of its input, so screen readers announce the question on focus.
- Choice steps are `role="radiogroup"` labelled by their `<h2>`. Choices are `role="radio"` with `aria-checked`.
- Focus moves to the new step's input, its selected choice, its first choice or its first Edit link, 140ms after the step changes.
- Errors render into an `aria-live="polite"` span. The counter is also live.
- `role="progressbar"` with `aria-valuenow` 0–4.
- Keyboard: Enter advances (or selects a focused choice). A–D select on choice steps, and are ignored while a modifier key is held. Tab and Shift+Tab work normally.
- Contrast: ink on #ffd84d is 13.9:1, `--ink-2` 7.4:1, tomato numerals are decorative (aria-hidden), and the error red is 5.6:1.

## Responsive rules

- ≥ 1280: as specified.
- 1024–1279: numeral column 220px at 160px numerals; question 56px; the strip and footer offsets follow the column.
- 768–1023: the numeral moves above the question at 96px and the rotated label is hidden. The question is 44px, the input 32px, and choices go to one column of 56px rows.
- < 640: 20px side padding, question 34px, input 26px. The strip becomes a single row of three short titles or is hidden. The footer is sticky with OK at full width and back as a 48px circle.

## Acceptance checklist

- [ ] Only one question is visible at a time. The others are `visibility:hidden` and out of the tab order.
- [ ] Enter advances from every step. A–D select choices and auto-advance after 260ms.
- [ ] Validation messages are exactly as written and appear in a fixed-height slot.
- [ ] Step 02's heading uses the first word of the name answer, in tomato.
- [ ] Questions leave upward and enter from below (reversed for Back) over 520ms, with the 120ms entry delay.
- [ ] The progress bar is 4px tall on the header's bottom edge and fills in quarters.
- [ ] The numeral is 200px, tomato, aria-hidden, with a rotated uppercase label.
- [ ] The review lists four answers, each with a working Edit. After an edit, the next valid answer returns to the review.
- [ ] Sending lasts 1300ms, then the ink panel opens with a circular wipe from the bottom-right.
- [ ] The success copy repeats the first name.
- [ ] "Start a new enquiry" clears all state and returns to step 01.
- [ ] Focus is visible on every control, and moves to the active step's control after each change.
- [ ] The page uses no emoji or dingbat glyphs: the asterisk and check are SVG/CSS.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: step 01 "Hello. Who are we talking to?" with the name prefilled as "Maya Okafor" and the input focused (400ms after load). The progress bar is at 0%, the counter reads "01 / 04", and the rotated side label reads "INTRODUCTIONS". The back button is disabled at 30% opacity. A "what happens next" strip with three columns (Today / Within 48 h / Week one) sits above the footer.
2. Press Enter (or click OK). If the name has fewer than 2 characters, the inline error "Just a first name is fine." appears under the underline. Otherwise the current question leaves, moving up 48px and fading over 520ms, and step 02 enters from 48px below with a 120ms delay.
3. Step 02's heading reads "Nice to meet you, *Maya*. What are we making?" The first name is in tomato. Four 60px choice buttons sit in a 2 × 2 grid, each with a letter key cap.
4. Press A, B, C or D, or click a choice: that choice fills ink with yellow text and a check, the others clear, and after 260ms the form advances automatically. Enter on a focused choice selects it. Enter with nothing selected shows "Pick one, or press A to D."
5. Step 03 asks for the budget (four ranges in euros, plus a hint line) and behaves the same way.
6. Step 04 asks for the email. An invalid address shows "That address looks incomplete." Typing clears the error.
7. Step 05 is the review: the numeral reads 05, the counter "Review", the bar 100% of the questions. A list shows four rows (label, answer in 26px serif, Edit). The primary button now reads "Send it over".
8. Clicking Edit jumps back to that step. When the form is completed again, the next valid answer skips straight back to the review instead of walking through the remaining steps.
9. The back button (52px circle, up arrow) goes to the previous step.
10. "Send it over" shows "Sending" for 1300ms. Then an ink panel opens over everything below the header with a circular clip-path from the bottom-right over 800ms. The panel shows a tomato asterisk, "Thanks, Maya. Talk Thursday." in 72px yellow serif, and a producer note. The counter reads "Sent".
11. "Start a new enquiry" clears all answers and returns to step 01.

## Tokens

```css
:root {
  --bg: #ffd84d;          /* sunflower page */
  --bg-2: #f6cb2f;        /* hover wash on choices and the back button */
  --ink: #1b1a17;
  --ink-2: #4a4535;       /* secondary text, meta */
  --ink-3: #7a6f45;
  --line: rgba(27,26,23,.18);
  --accent: #e5402a;      /* numeral, name echo, caret, focus */
  --error: #a3200e;       /* inline error text, 5.6:1 on yellow */
  --done-copy: #d8d2bd;   /* body text on the ink panel */

  --serif: "Young Serif", Georgia, serif;
  --sans: "Figtree", system-ui, sans-serif;

  --r: 12px;              /* choice buttons */
  --header-h: 72px;
  --footer-h: 104px;
  --col-num: 300px;

  --t-micro: 160ms;
  --t-step: 520ms;
  --t-reveal: 800ms;
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
}
```

## Typography

| Role            | Family      | Size  | Weight | Line-height | Tracking | Case      |
|-----------------|-------------|------:|-------:|------------:|---------:|-----------|
| Step numeral    | Young Serif | 200px | 400    | 1           | −0.05em  | numerals  |
| Question        | Young Serif | 64px  | 400    | 1.04        | −0.025em | sentence  |
| Success title   | Young Serif | 72px  | 400    | 1.02        | −0.03em  | sentence  |
| Text input      | Young Serif | 40px  | 400    | 1.2         | 0        | as typed  |
| Review answer   | Young Serif | 26px  | 400    | 1.2         | 0        | as typed  |
| Next-step title | Young Serif | 22px  | 400    | 1.3         | 0        | sentence  |
| Logo            | Young Serif | 22px  | 400    | 1           | −0.01em  | —         |
| Choice label    | Figtree     | 18px  | 500    | 1           | 0        | sentence  |
| Hint / body     | Figtree     | 17px  | 400    | 1.5         | 0        | sentence  |
| Buttons         | Figtree     | 16px  | 700    | 1           | 0        | sentence  |
| Error           | Figtree     | 14px  | 600    | 24px        | 0        | sentence  |
| Meta / labels   | Figtree     | 12px  | 600    | 1.4         | +0.14em  | UPPERCASE |

## Implementation notes

**Stack the steps and cross-fade with a direction.** Keep every step in the DOM so the transitions are pure CSS, and use `visibility` with a delayed transition so hidden steps leave the tab order:

```css
.q { position:absolute; inset:92px 40px auto 0; opacity:0; visibility:hidden; transform:translateY(48px);
     transition: opacity 520ms var(--ease), transform 520ms var(--ease-out), visibility 0s 520ms; }
.q.on  { opacity:1; visibility:visible; transform:none; transition-delay:120ms,120ms,0s; }
.q.out { opacity:0; transform:translateY(-48px); }
```

**One keydown handler for the whole flow.** Let a focused choice treat Enter as "select", not "next":

```js
addEventListener('keydown', e => {
  if (done.classList.contains('show')) return;
  if (e.key === 'Enter' && e.target.classList.contains('ch')) { e.preventDefault(); e.target.click(); return; }
  if (e.key === 'Enter' && !e.shiftKey && !e.target.closest('.edit,.back')) { e.preventDefault(); next(); return; }
  const L = e.key.toUpperCase().charCodeAt(0) - 65, chs = steps[i].querySelectorAll('.ch');
  if (e.key.length === 1 && L >= 0 && L < 4 && chs.length && !e.metaKey && !e.ctrlKey) chs[L].click();
});
```

**Escape answers before rendering the review.** The review uses `innerHTML`, so pass every answer through an escape function for `& < > "`.

Common mistakes:

- Using `display:none` between steps, which kills the transition.
- Advancing on choice click immediately. The 260ms pause lets the selected state register.
- Letting A–D fire while the user types in a text step. Only listen when the current step has choices.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
