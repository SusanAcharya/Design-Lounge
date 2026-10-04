<!-- Design Lounge Nº 428 · "Stepped project brief form" · designlounge.vercel.app -->

# Stepped project brief form

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The "Start a project" section of a design studio site, for the fictional "Okaro Studio" in Leeds. One page, one card, four steps: what you need (service chips), budget (five segments), timeline (four radio cards) and about you (four fields). Then a review screen and a success screen that says "We reply within 1 working day." The look is warm brutalist: cream paper, black ink, one tomato red, 0 radius, 2px black borders, a hard 8px offset shadow on the card, and huge condensed uppercase headings. The detail worth copying: every step is a real `fieldset` with a `legend`, each step checks itself before moving on, and the first broken field gets focus.

## Structure

```
1280 × 800, wrap padding 40 / 56, grid 5fr | 7fr, gap 48
┌──────────────────────────────┬─────────────────────────────────────────┐
│ OKARO/STUDIO   13px          │ ┌─────────────────────────────────────┐ │
│                              │ │ STEP 1 OF 4            [■][ ][ ][ ] │ │ bar, 2px rule below
│ START A        136px / .84   │ ├─────────────────────────────────────┤ │
│ PROJECT.       tomato        │ │ WHAT DO YOU NEED?   64px            │ │
│                              │ │ Pick everything that applies…       │ │
│                              │ │ [✓Brand identity][✓Website][Product]│ │ chips 56px tall
│                              │ │ [Design system][Motion][Copy][Illus]│ │
│                              │ │ [Not sure yet]                      │ │
│ ─────────────────────────────│ │ ⚠ error line                        │ │
│ [01] WHAT YOU NEED           │ │                                     │ │
│ [02] BUDGET                  │ │ [← BACK]                  [NEXT →]  │ │ nav 52px buttons
│ [03] TIMELINE                │ └─────────────────────────────────────┘ │
│ [04] ABOUT YOU               │   8px 8px hard black shadow             │
│ Rather talk? Call Ines…      │                                         │
└──────────────────────────────┴─────────────────────────────────────────┘
```

- Left: `aside` with the mark `div`, the `h1` (second line in a `span`), an `ol aria-label="Brief steps"` with `aria-current="step"` on the current row, and a contact `p`.
- Right: `section.card aria-labelledby` the step label. The label `p` is `aria-live="polite"`.
- `form novalidate` holds five `div.step` blocks (four steps and the review) and the nav row. Only one step is visible; the rest are `hidden`.
- Steps 1–4: `fieldset` > `legend` > `h2 tabindex="-1"`, a hint `p`, the controls, and an error `p`.
- Chips: `label.chip > input[type=checkbox] + span`. Segments: `label > input[type=radio] + span`. Radio cards: `label.rc > input[type=radio] + span.dot + strong + small`.
- Step 4: `div.f` per field with `label`, `input` or `textarea`, and an error `p`.
- Review: `h2`, hint, `dl.review` with rows of `dt`, `dd`, `button.edit`.
- Success: `div.sent` outside the form, with `h2 tabindex="-1"`, two `p`s, an `ol`, and a reset `button`.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Step enter | step change | opacity, translateX | 0, 24px → 1, 0 | 300ms | `--expo` | none |
| Progress box | step change | background | empty → tomato → ink | 300ms | `--ease` | instant |
| Next button | hover | transform, shadow | 0, 4px → -2px -2px, 6px | 140ms | `--ease` | instant |
| Next button | active | transform, shadow | → 2px 2px, 0 | 140ms | `--ease` | instant |
| Chip | press | translate | 0 → 2px 2px | 140ms | `--ease` | instant |
| Radio card dot | select | scale | 0 → 1 | 140ms | `--ease` | instant |
| Field | focus | box-shadow | none → 4px 4px tomato | 140ms | `--ease` | instant |

- Only the step enter is a layout move. Everything else is feedback.
- The success screen does not animate in. It replaces the form at once and takes focus.

## States

- Chip resting: 2px ink border, no fill. Hover: `--hover` fill. Checked: tomato fill, weight 700, check icon shown. Pressed: shifts 2px down-right.
- Segment resting: no fill. Hover: `--hover`. Checked: ink fill, card text.
- Radio card resting: no fill, empty square. Hover: `--hover`. Checked: tomato fill, black 10px square inside the dot.
- Field resting: white fill, 2px ink border. Focus-visible: 4px 4px tomato offset shadow, no outline.
- Field invalid: border `--error`, 4px 4px `--error` shadow, `aria-invalid="true"`, error line under it.
- Group error: warning icon and bold `--error` line under the group.
- Primary button: ink fill, card text, 4px tomato offset shadow. Secondary button: no fill, 2px border, hover `--hover`.
- Sending: `aria-busy="true"`, opacity 0.7, text "SENDING", progress cursor.
- Rail: done rows have an ink-filled number box; current row has a tomato number box and ink text; later rows are `--ink-2`.
- Focus-visible on all other controls: 3px solid tomato, offset 2px. For hidden radio and checkbox inputs, draw the ring on the visible span or card.

## Accessibility

- Each step is a `fieldset` with its heading in the `legend`. Group errors are linked with `aria-describedby` on the fieldset.
- Text fields have visible labels and `aria-describedby` pointing to their error (and to the counter for the message).
- On a failed step, focus moves to the first checkbox or radio in the group, or the first bad field.
- On a passed step, focus moves to the new step's `h2` (`tabindex="-1"`, no visible outline on that heading).
- The step label "Step 2 of 4" is `aria-live="polite"`, so the step change is announced.
- The rail is an `ol` with `aria-current="step"` on the current row. It is a guide, not navigation, so its rows are not links.
- Chips are real checkboxes; segments and cards are real radios. Space toggles a chip. Arrow keys move inside a radio group.
- Edit buttons include a hidden suffix ("Edit Budget") so each one has a unique name.
- The success heading takes focus so the result is read out.
- Contrast: ink on cream about 16:1, `--ink-2` on card about 9:1, `--error` on card about 6.6:1, ink on tomato about 5:1. Tomato is not used for small text on cream.
- Hit targets: chips 56px tall (48px on phones), segments 64px (56px), buttons 52px, inputs 46px, Edit buttons 40px.

## Responsive rules

- ≥1280: as drawn. Grid 5fr | 7fr, gap 48px, padding 40px / 56px. Page heading 136px. Card fills the column height.
- 1024 (≤1100px): page heading 104px, padding 32px / 40px, gap 36px.
- 768 (≤900px): one column. The page heading sits on top at 96px, the rail is hidden (the step label and progress boxes carry it), the contact line sits under the heading, then the card.
- <640px: padding 20px / 16px. Page heading 68px. Card shadow 6px. Step heading 46px. Chips 48px tall and 15px. Budget segments go to a 2×2 grid plus a full-width last row. Radio cards and fields go to one column. Review rows put the value under the label with Edit on the right. Success heading 64px. Progress boxes shrink to 24px wide.
- Never scroll sideways at any width. Every grid uses `minmax(0, 1fr)`. Long review values wrap with `overflow-wrap: anywhere`.

## Acceptance checklist

### Always

- [ ] Four steps, then a review, then a success screen. All on one page, one step visible at a time.
- [ ] Each step is a `fieldset` with a `legend`. Choice controls are native checkboxes and radios.
- [ ] Next checks only the current step. Back never checks.
- [ ] Errors are text under the group or field, linked with `aria-describedby`, and the first broken control gets focus.
- [ ] The step label reads "Step N of 4" and is announced.
- [ ] Review lists every answer with an Edit button that jumps to its step.
- [ ] The success screen takes focus and states the reply time.
- [ ] Every border is 2px. Every radius is 0. One accent colour.
- [ ] Focus is visible on every chip, segment, card, field and button.
- [ ] Reduced motion removes the step slide.
- [ ] No horizontal scroll at 1280, 1024, 768, 390 or 360.

### This demo

- [ ] The studio is "Okaro Studio" and the heading reads "START A PROJECT." with "PROJECT." in `#e5432a`.
- [ ] Step headings: WHAT DO YOU NEED?, WHAT IS THE BUDGET?, WHEN SHOULD WE START?, WHO ARE YOU?, CHECK YOUR BRIEF.
- [ ] Eight chips with Brand identity and Website checked on the first frame.
- [ ] Budgets are Under £15k, £15–30k, £30–60k, £60–120k, £120k+.
- [ ] The message needs at least 20 characters and caps at 800.
- [ ] Success reads "We reply within 1 working day." and "Reference OK-2610-047".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state at 1280×800: left column shows "OKARO/STUDIO", the heading "START A" in black and "PROJECT." in tomato at 136px, and a 4-row step rail at the bottom. The right column is the card on step 1.
2. The card's top bar reads "STEP 1 OF 4" on the left and shows four 40×12px boxes on the right. The current box is tomato, done boxes are black, later boxes are empty.
3. Step 1 "WHAT DO YOU NEED?": eight chips. Brand identity and Website start checked (tomato fill, a check icon). Clicking toggles a chip. Any number can be picked.
4. Next with no chip checked: an error line appears under the chips, "Pick at least one service, or choose Not sure yet.", and focus moves to the first chip.
5. Changing any chip in a step with an error clears the error.
6. Valid Next: the step slides in from 24px right with a fade (300ms), the label becomes "STEP 2 OF 4", the rail moves, and focus goes to the new step heading.
7. Step 2 "WHAT IS THE BUDGET?": five segments in one bordered row: Under £15k, £15–30k, £30–60k, £60–120k, £120k+. One choice. The selected segment fills black with cream text. Error text: "Choose a budget range to continue."
8. Step 3 "WHEN SHOULD WE START?": four radio cards in a 2×2 grid: As soon as possible (Start within 2 weeks), Next month (Start in 3 to 6 weeks), This quarter (Start in 2 to 3 months), Flexible (No fixed date yet). The selected card fills tomato and its square dot shows a black 10px square. Error text: "Choose when you would like to start."
9. Step 4 "WHO ARE YOU?": Name and Email side by side, Company (optional) full width, "Tell us about it" textarea full width with a counter "0 / 800 · at least 20 characters". The Next button now reads "REVIEW".
10. Review with bad fields: every bad field gets a red border, a 4px red offset shadow and its own error line. Focus moves to the first bad field in order name, email, message. Typing in a field clears its error.
11. Step 5 "CHECK YOUR BRIEF.": the label reads "REVIEW", all four boxes are black, and a list shows What you need, Budget, Timeline and About you, each with an "Edit" button. Edit jumps straight to that step. The Next button reads "SEND BRIEF".
12. Send brief: the button reads "SENDING" with `aria-busy="true"` for 700ms, then the card swaps to the success screen.
13. Success: label "SENT". "BRIEF" in black and "RECEIVED." in tomato at 104px, then "WE REPLY WITHIN 1 WORKING DAY.", "Reference OK-2610-047. A copy is on its way to [email].", three numbered next steps, and a "START ANOTHER BRIEF" button that resets the form to step 1. Focus goes to the success heading.
14. Back appears from step 2 onwards and goes one step back without checking.

## Tokens

```css
:root {
  --bg: #f2e8d5;      /* cream page */
  --card: #fbf5ea;    /* card paper */
  --ink: #141210;     /* text, borders, shadow, black fills */
  --ink-2: #4a443c;   /* hints, muted rail rows */
  --line: #141210;    /* every border is ink */
  --accent: #e5432a;  /* tomato: selected chip, current step, button shadow */
  --accent-ink: #141210;
  --error: #a8240f;   /* error text and invalid border */
  --hover: #efe3cc;   /* hover fill on chips, segments, cards */
  --field: #ffffff;   /* text input fill */

  --display: "Big Shoulders Display", Impact, sans-serif;
  --sans: "Archivo", system-ui, sans-serif;

  --b: 2px;           /* the only border width */
  --radius: 0;
  --shadow-card: 8px 8px 0 var(--ink);
  --shadow-btn: 4px 4px 0 var(--accent);
  --shadow-field: 4px 4px 0 var(--accent);

  --s1: 4px; --s2: 8px; --s3: 12px; --s4: 16px; --s5: 24px; --s6: 28px; --s7: 40px; --s8: 56px;

  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --fast: 140ms;
  --layout: 300ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Page heading | Big Shoulders Display | 136px | 900 | 0.84 | -0.01em | upper |
| Step heading | Big Shoulders Display | 64px | 900 | 0.9 | -0.005em | upper |
| Success heading | Big Shoulders Display | 104px | 900 | 0.9 | 0 | upper |
| Rail row, segment, card title | Big Shoulders Display | 22px / 24px / 26px | 800 | 1 | 0.02em | upper |
| Buttons | Big Shoulders Display | 22px | 800 | 1 | 0.04em | upper |
| Mark, step label, field label | Archivo | 13px / 13px / 12px | 700 | 1.45 | 0.1–0.14em | upper |
| Body, hint | Archivo | 15px | 400 | 1.45 | 0 | sentence |
| Chip | Archivo | 16px | 500, 700 checked | 1 | 0 | sentence |
| Error | Archivo | 14px (13px under fields) | 700 | 1.45 | 0 | sentence |

The display face is only ever uppercase. Body copy is never in the display face.

## Implementation notes

**1. One validator per step, returning the element to focus.** Keep it small and ordered so "first error" is obvious.

```js
function validate(n) {
  if (n === 1) return groupCheck('svc', 'e-svc', 'Pick at least one service, or choose Not sure yet.');
  if (n === 2) return groupCheck('budget', 'e-budget', 'Choose a budget range to continue.');
  if (n === 3) return groupCheck('time', 'e-time', 'Choose when you would like to start.');
  if (n === 4) return [
    fieldCheck(name, 'e-name', v => v.length > 1, 'Enter your name.'),
    fieldCheck(email, 'e-email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter an email like ines@company.com.'),
    fieldCheck(msg, 'e-msg', v => v.length >= 20, 'Write at least 20 characters so we know where to start.')
  ].filter(Boolean)[0] || null;
  return null;
}
form.addEventListener('submit', e => {
  e.preventDefault();
  if (cur < 5) { const bad = validate(cur); if (bad) { bad.focus(); return; } show(cur + 1); return; }
  send();
});
```

Run every field check in step 4 before focusing, so all errors show at once, not one at a time.

**2. Hidden inputs, visible rings.** The inputs sit invisibly on top of their label so clicks and keys work. Draw focus and checked state on the sibling.

```css
.chip, .seg label, .rc { position: relative; }
.chip input, .seg input, .rc input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: pointer; }
.chip input:checked + span { background: var(--accent); font-weight: 700; }
.seg input:checked + span { background: var(--ink); color: var(--card); }
.rc:has(input:checked) { background: var(--accent); }
.chip input:focus-visible + span,
.seg input:focus-visible + span,
.rc input:focus-visible ~ * { outline: 3px solid var(--accent); outline-offset: 2px; }
```

**3. `hidden` versus `display`.** The form and the success block both use `display: flex`. Add `form[hidden], .sent[hidden] { display: none }`, or the `hidden` attribute does nothing. Do not reuse a class like `.done` for both the rail state and the success block; the rail rows will pick up the success layout.

Common mistakes:

- Validating every step on the last click. Each step checks itself.
- `div`s with click handlers instead of checkboxes and radios.
- Moving focus to the top of the page on each step. Move it to the step heading.
- Rounded corners or soft shadows. The shadow is a hard 8px offset with no blur.
- Using tomato for error text. Errors are the darker `#a8240f` so they stay readable and do not look like selection.
- A progress bar with a percentage. This uses four boxes and the words "Step 2 of 4".
- Setting body copy in the condensed display face.

Rebuild order:

1. Tokens, the two-column grid and the left heading.
2. The card with its top bar and progress boxes.
3. Step 1 to step 4 markup with fieldsets and error lines.
4. `show(n)`: visibility, label, boxes, rail, button text, focus.
5. Validators and error clearing on change and input.
6. The review list with Edit buttons.
7. Sending state and the success screen with reset.
8. Breakpoints at 1100, 900 and 639px, then reduced motion.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
