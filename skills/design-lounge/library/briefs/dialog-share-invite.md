<!-- Design Lounge Nº 570 · "Share and invite dialog" · www.designlounge.live -->

# Share and invite dialog

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The Share dialog of a document in Larder, a kitchen-operations workspace, open over the "Winter menu costing" sheet. One modal answers three questions in order: who else should get this (an email field that turns addresses into chips, a role for all of them, Invite), who already has it (owner, three people with their own role select, a pending invite with Resend), and can anyone with the link open it (a switch, the link, Copy link). It is set in one family, Red Hat Display, on warm paper with a pine-green accent. The detail worth copying is that invalid addresses become red chips with a sentence saying what is wrong, and Invite stays disabled until they are fixed or removed, so nobody sends half a list.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────┐
│ Larder / Kiln Street / Winter menu costing                 [Share]   │ 56
├──────────────────────────────────────────────────────────────────────┤
│   Winter menu costing  ┌──────────── dialog 540 ───────────┐        │
│   ┌ table ─────────────│ Share “Winter menu costing”     [x]│──────┐ │
│   │ Dish               │ [Add emails, separated b] [Can v][Invite]│ │
│   │ Braised short rib  │ (dara.whitlock@… x)(ines@harbour… x)    │ │
│   │ ...                │ 2 people get an email with a link.  │   │ │
│   │                    │ People with access                 5   │ │
│   │                    │ (HL) Hana Lindqvist [You]     Owner    │ │
│   │                    │ (JO) Joel Okonkwo          [Can edit v]│ │
│   │                    │ (MB) Mireille Baptiste  [Can comment v]│ │
│   │                    │ (SR) Sam Reyes             [Can view v]│ │
│   │                    │ (@)  priya@ashdown…  Resend [Can view v]│ │
│   └────────────────────│ ┌ link card ────────────────────────┐ │ │
│                        │ │ (∞) Anyone at Kiln Street… [ ●] │ │   │
│                        │ │ [larder.app/kiln-st…]  [Copy link]│ │   │
│                        │ └───────────────────────────────────┘ │   │
│                        └────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

- `<header class="top">`: wordmark, breadcrumb, Share primary (`#open`). `<main class="sheet">`: h1, meta line, a costing `<table>`.
- `<dialog aria-labelledby="st">` opened with `showModal()`.
  - `.hd`: `<h2>` with the document name in curly quotes, 34px close button.
  - `.inv` (flex row, 8px gap): `<input class="field" inputmode="email">` (flex 1), `<select>` for the new people's role, Invite primary.
  - `.tray` (hidden while it holds no chip): chips (`<span class="chip">` with text and a remove `<button aria-label="Remove …">`) and the `#hint` count.
  - `<p class="msg" aria-live="polite">` for the validation sentence.
  - `<h3>` "People with access" with the count; `<ul class="ppl">` rows: 36px initials avatar, `.who` (name, sub-line), optional Resend, role `<select>`.
  - `.link` card: 3-column grid (icon, text, switch) with a full-width row for the URL box and Copy link.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
|---|---|---|---|---:|---|
| dialog | open | opacity, scale | 0, .97 → 1, 1 | 320ms | `--ease` / `--ease-out` |
| backdrop | open | background | transparent → `--scrim` | 320ms | `--ease` |
| chip | added | scale, opacity | .85, 0 → 1, 1 | 160ms | `--ease-out` |
| new person row | Invite | background | `--accent-soft` → transparent | 1200ms | `--ease` |
| switch knob | toggle | translateX | 0 ↔ 18px | 240ms | `--ease-out` |
| switch track, link icon | toggle | background, colour | accent ↔ edge grey | 160ms | `--ease` |
| field | focus | border, ring | edge → accent + 3px soft ring | 160ms | `--ease` |
| sheet (< 640px) | open | translateY | 100% → 0 | 320ms | `--ease-sheet` |

Reduced motion: transitions drop to 1ms and the chip pop is removed. The flash still marks the new row for one frame, so rely on the count change as well.

## States

- **Field:** hover border `--ink-3`; focus border `--accent` with `0 0 0 3px var(--accent-soft)`; placeholder `--ink-3`.
- **Chip:** default `--sunk` fill, `--line-2` border; invalid `--error-soft` fill, `--error` border and text; remove button hover tint `rgba(31,28,23,.08)`.
- **Invite:** disabled (opacity .45, `not-allowed`) when the tray is empty or holds an invalid chip.
- **Role select:** 34px, `--edge` border, chevron drawn as an inline SVG background; hover fill `--sunk`.
- **Pending row:** dashed 1.5px `--edge` avatar ring with `@`; sub-line says when it was sent and whether it was opened.
- **Resend:** accent text button; after use reads "Sent", disabled.
- **Link off:** icon disc greys, link row hidden, sub-line explains who can still open it.
- **Copy link:** "Copied" with accent-soft fill and accent border for 1800ms.
- **Focus-visible:** 2px `--accent` outline, 2px offset, on every button, select and the switch.

## Accessibility

- `showModal()` traps focus; Escape closes; focus returns to Share. Tab order: close, email field, role, Invite, chip removes, people selects and Resend, switch, Copy link.
- The field is labelled "Invite by email" and described by the hint and the validation message (`aria-describedby="hint msg"`); the message is `aria-live="polite"`.
- Every chip's remove button is labelled "Remove dara.whitlock@kilnst.co". Every role select is labelled "Role for Joel Okonkwo".
- The link switch is a `<button role="switch" aria-checked>` labelled by the card title, so it reads "Anyone at Kiln Street with the link, switch, on".
- Contrast: all text passes 4.5:1 on its surface (figures in Tokens). Every input and select has an `--edge` border at 3.59:1 or more.
- Targets: 42px controls on desktop, 44px Invite on the phone sheet, 34px selects, 22px chip remove buttons inside a 30px chip.

## Responsive rules

- ≥ 1280: as specified, 540px centred.
- 1024 and 768: unchanged; the dialog keeps 540px.
- < 640: the dialog becomes a bottom sheet (full width, radius `20px 20px 0 0`, `max-height: calc(100dvh - 16px)`, scrolls inside). The email field takes a full row; role select and Invite share the next row 50/50 at 44px. Side padding 16px. Sub-lines may wrap to two lines; names ellipsize. Breadcrumb in the top bar is hidden; h1 26px.

## Acceptance checklist

**Always**

- [ ] Enter, comma, space, Tab, blur and paste all turn text into chips; duplicates are ignored.
- [ ] Invalid addresses become red chips with a sentence naming the address, and Invite is disabled until they are fixed or removed.
- [ ] Backspace on an empty field removes the last chip.
- [ ] Invite adds pending rows with the chosen role, flashes them, updates the count and empties the tray.
- [ ] Each person has their own role control with a Remove option; the owner has none.
- [ ] The link switch uses `role="switch"` and `aria-checked`, and hides the link row when off.
- [ ] Copy link confirms in place for about 1.8s and never throws when the clipboard is blocked.
- [ ] Every input and select keeps a 3:1 border against its ground.
- [ ] Below 640px the dialog is a full-width bottom sheet and nothing scrolls sideways at 390px.

**This demo**

- [ ] First frame shows two valid chips and "2 people get an email with a link."
- [ ] People with access lists Hana Lindqvist (Owner), Joel Okonkwo, Mireille Baptiste, Sam Reyes and a pending priya@ashdownfarm.co.uk, count 5.
- [ ] The link reads `larder.app/kiln-street/d/winter-costing-7Kq2` and the switch is on.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: the dialog is open over the dimmed sheet (scrim `rgba(31,28,23,.44)`). Two chips sit under the field (`dara.whitlock@kilnst.co`, `ines@harbourfish.co.uk`), followed by "2 people get an email with a link." The role select reads "Can comment". Focus is in the email field.
2. Typing an address and pressing Enter, comma, space or Tab turns it into a chip (scale .85 → 1 over 160ms). Leaving the field does the same. Pasting text with commas, spaces or semicolons splits it into several chips. Duplicates (case-insensitive) are ignored.
3. An address that fails `^[^\s@,;]+@[^\s@,;]+\.[a-z]{2,}$` becomes a red chip. A message appears under the tray: "marco@kilnst is missing its domain ending. Fix it or remove it to invite." Invite is disabled while any chip is red.
4. Backspace in an empty field removes the last chip. Each chip's 22px × button removes it and returns focus to the field.
5. Invite (or Enter on an empty field when Invite is enabled) appends each chip to People with access as a pending row ("Invite sent just now", dashed `@` avatar) with the chosen role. New rows flash `--accent-soft` and fade to transparent over 1200ms. The count in the heading updates. The tray empties and hides.
6. Each person's role select offers Can edit, Can comment, Can view and Remove. Choosing Remove deletes the row and updates the count. The owner row shows "Owner" as text, not a control.
7. Resend on a pending row changes to "Sent" (disabled) and the row's sub-line to "Reminder sent just now".
8. The link switch (`role="switch"`, 44 × 26px) is on. Turning it off greys the link icon, changes the sub-line to "Off. Only the people above can open it." and hides the link row. Turning it on restores it.
9. Copy link writes the URL to the clipboard where allowed and changes the button to "Copied" in the accent tint for 1800ms.
10. Escape, the close button or a scrim click closes. Focus returns to the top-bar Share button; a fixed "Open share dialog" button also appears bottom right to reopen.

## Tokens

```css
:root {
  /* paper */
  --bg: #f3efe7;          /* page */
  --paper: #fbf9f4;       /* top bar, table head, link card */
  --surface: #ffffff;     /* dialog, controls */
  --sunk: #f5f1ea;        /* chips, hover */
  --line: #e6dfd3;        /* hairlines */
  --line-2: #d3cabb;      /* chip border */
  --edge: #8c8273;        /* control borders, 3.78:1 on white, 3.59:1 on paper */
  /* ink */
  --ink: #1f1c17;         /* 16.98:1 */
  --ink-2: #4f493f;       /* 8.91:1 */
  --ink-3: #6b6457;       /* 5.86:1 on white, 5.57:1 on paper */
  /* accent, pine */
  --accent: #1f6f4a;      /* white on it 6.12:1 */
  --accent-hover: #185a3c;
  --accent-ink: #ffffff;
  --accent-soft: #e3f0e8; /* new-row flash, Copied, link icon disc */
  --error: #a8382a;       /* 5.44:1 on its soft fill */
  --error-soft: #fbe8e4;
  --scrim: rgba(31,28,23,.44);
  /* type */
  --font: "Red Hat Display", system-ui, sans-serif;
  /* size */
  --w: 540px;
  --r: 18px;
  --r-ctl: 10px;
  --h-ctl: 42px;
  --shadow: 0 1px 2px rgba(31,28,23,.06), 0 40px 80px -30px rgba(31,28,23,.5);
  /* motion */
  --t-micro: 160ms;
  --t-open: 320ms;
  --t-flash: 1200ms;
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
  --ease-sheet: cubic-bezier(.32,.72,0,1);
}
```

## Typography

One family at five weights. Weight, not a second face, does the hierarchy.

| Role | Size | Weight | Line-height | Tracking | Case |
|---|---:|---:|---:|---:|---|
| Page h1 | 34px | 800 | 1.15 | -0.03em | sentence |
| Wordmark | 17px | 800 | 1 | -0.02em | title |
| Dialog title | 19px | 700 | 1.3 | -0.015em | sentence |
| Section heading | 12.5px | 700 | 1.4 | 0 | sentence |
| Person name | 14px | 600 | 1.35 | 0 | name |
| Sub-line, hint | 12.5px | 400 | 1.4 | 0 | sentence |
| Chip | 13px | 600 | 30px box | 0 | as typed |
| Control text | 13.5–14px | 600 | 1 | 0 | sentence |
| You tag | 11.5px | 700 | 1.4 | 0 | title |
| Buttons | 14px | 700 | 1 | 0 | sentence |

## Implementation notes

**Chip entry on one keydown handler.** Commit on separators only when there is text; otherwise let Enter submit and Backspace eat the last chip.

```js
email.addEventListener('keydown', (e) => {
  if (['Enter', ',', ' ', 'Tab'].includes(e.key) && email.value.trim()) {
    if (e.key !== 'Tab') e.preventDefault();
    add(email.value); email.value = '';
  } else if (e.key === 'Enter' && !invite.disabled) { e.preventDefault(); invite.click(); }
  else if (e.key === 'Backspace' && !email.value && list().length) { list().pop().remove(); sync(); }
});
```

**The flash that fades.** Add the row with the tint and no transition, then remove the class two frames later so the 1200ms transition runs from tint to clear.

```css
.ppl li { transition: background 1200ms var(--ease); }
.ppl li.new { background: var(--accent-soft); transition: none; }
```
```js
li.className = 'new'; list.appendChild(li);
requestAnimationFrame(() => requestAnimationFrame(() => li.classList.remove('new')));
```

**Clipboard that cannot throw.** Sandboxed frames and http pages reject `writeText`. Swallow both the sync throw and the rejected promise. In production, await the promise and show "Copied" only on success; on failure, select the URL text so the user can press Cmd+C.

```js
try { navigator.clipboard && navigator.clipboard.writeText(url).catch(() => {}); } catch (e) {}
```

Common mistakes: putting the chips inside a borderless input so the control has no visible edge; validating only on Invite, after the user has typed eight addresses; a single role for everyone with no per-person change; a link toggle that is a checkbox with no state announced; hiding pending invites, which is how people end up invited twice.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
