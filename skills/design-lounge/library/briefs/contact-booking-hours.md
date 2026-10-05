<!-- Design Lounge Nº 151 · "Studio hours and booking" · www.designlounge.live -->

# Studio hours and booking

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The visit page for Clay & Co, a fictional ceramics studio in Alcântara, Lisbon. Left: a kicker, a giant two-line italic email, a short hint, and a "Book 30 min" button. Right: an "Hours this week" table for Monday–Sunday and a timezone note. The button opens a native `<dialog>` with three fields (name, email, note). `showModal()` supplies the focus trap, Esc-to-close, and inert background. The studio feeling is clay dust and a fired-brick accent, not a marketing form with a map.

## Structure

```
1280 × 800
┌────────────────────────────────────────────────────────────┐
│ Clay & Co                    Work  Studio  Visit           │ 64
├─────────────────────────────┬──────────────────────────────┤
│ STUDIO · APPOINTMENTS       │ Hours this week              │
│ hello@                      │ DAY              OPEN        │
│ clayandco.studio            │ Monday     10:00 – 18:00     │
│ A ceramics studio in        │ …                            │
│ Alcântara. Write anytime…   │ Saturday          Closed     │
│ [ Book 30 min ]             │ Sunday            Closed     │
│                             │ ⏱ Times in Lisbon, WEST…    │
└─────────────────────────────┴──────────────────────────────┘
          dialog 420, centred, when open
```

- `<nav aria-label="Primary">` + `<main>` CSS grid `1.15fr .85fr`, padding `0 56px`.
- `.left`: kicker, `<a class="mail">` with a `<br>`, hint `<p>`, `<button class="book" id="open">`.
- `.right` `aria-labelledby="hours-h"`: `<h2 id="hours-h">`, `<table>` with thead + seven rows, `.tz` note.
- `<dialog id="dlg" aria-labelledby="dlg-h">` wrapping `<form class="dlg" method="dialog" id="form">`: header (h2 + ×), helper p, `.fields` (three labels), `.done` status, `.acts` (Cancel + Send).
- Click-on-scrim works because padding lives on `.dlg`, not on `dialog`. `e.target === dlg` closes.

## Motion

| Element     | Trigger     | Property         | From → To           | Duration | Easing   |
|-------------|-------------|------------------|---------------------|---------:|----------|
| Email rule  | hover/focus | background-size  | 0 2px → 100% 2px    | 320ms    | `--expo` |
| Book button | hover       | background       | accent → `#8d3e2e`  | 160ms    | `--ease` |
| Book button | active      | transform        | 1 → 0.98            | 160ms    | `--ease` |
| Dialog panel| open        | scale, opacity   | 0.96 + 0 → 1 + 1    | 280ms    | `--expo` / `--ease` |
| Backdrop    | open        | opacity          | 0 → 1               | 280ms    | `--ease` |

Reduced motion: those transitions become 1ms. Do not disable `showModal()`.

## States

- **Nav current:** `aria-current="page"`, colour `--ink`. Hover same.
- **Email hover/focus:** accent underline draws.
- **Book hover:** `#8d3e2e`. Active: scale 0.98.
- **Closed days:** italic `--ink-3` in the hours cell.
- **Input focus:** bottom border `--accent`.
- **Form `.ok`:** `.fields` and `.acts` `display: none`; `.done` shows.
- **Focus-visible:** 2px accent outline, 3px offset.

## Accessibility

- Use native `<dialog>` + `showModal()` for the trap. Do not hand-roll Tab cycling unless the host stack has no dialog primitive.
- Dialog labelled by `aria-labelledby="dlg-h"`. Close button has `aria-label="Close"`. Success copy has `role="status"`.
- Esc, scrim click, Cancel and × all close. Focus returns to `#open`.
- Hours are a real `<table>` with a `<thead>`, not a definition list pretending to be a grid.
- Email is a real `mailto:` link. Button is 48px tall. Dialog actions are 40px tall.
- Contrast: ink on clay exceeds 9:1. Accent-ink on accent exceeds 4.5:1. `--ink-3` is captions and closed hours, not body.

## Responsive rules

- ≥ 1280: two columns as specified, email 64px on two lines.
- 1024–1279: email 52px. Right padding 40px.
- 768–1023: stack. Hours move under the email. Dialog still 420px or `min(420px, 100vw − 32px)`.
- < 640: email 40px. Nav keeps the mark and Visit only. Book button full width. Table can scroll-x if needed; prefer wrapping the day name.

## Acceptance checklist

- [ ] Email is two lines, 64px italic Cormorant, `mailto:hello@clayandco.studio`.
- [ ] Hours table lists seven days with Fri closing at 16:00 and weekend Closed in italic.
- [ ] Timezone note names Lisbon / Europe/Lisbon / WEST UTC+1.
- [ ] Book 30 min opens a 420px dialog with name, email, note.
- [ ] Focus is trapped inside the open dialog; Tab never reaches the page behind.
- [ ] Esc, ×, Cancel, and scrim click close the dialog; focus returns to Book 30 min.
- [ ] Submit shows the status line, then closes after 1200ms.
- [ ] Focus rings are 2px `#a34b38` with a 3px offset.
- [ ] Reduced motion keeps the dialog usable with 1ms transitions.
- [ ] Palette is clay `#ebd8cc` and brick `#a34b38`, not orange brutalist and not a map split.
- [ ] Only Cormorant Garamond and Work Sans load.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: clay ground `#ebd8cc`. 64px nav: italic 28px "Clay & Co", links Work / Studio / Visit (`aria-current` on Visit). Main is a two-column split with a 1px hairline between.
2. Email `hello@` / `clayandco.studio` is 64px italic Cormorant, a `mailto:` link. Hover or focus draws a 2px accent underline from left over 320ms expo-out (`background-size` 0 → 100%).
3. Primary button "Book 30 min" is 48px tall, brick `#a34b38`, cream type, 4px radius. Hover darkens to `#8d3e2e`. Active scales to 0.98.
4. Hours table: caption "Hours this week" as italic 28px serif. Header row DAY / OPEN in 11px uppercase. Seven body rows, 11px vertical padding, 1px hairline between. Mon–Thu `10:00 – 18:00`, Fri `10:00 – 16:00`, Sat and Sun `Closed` in italic `--ink-3`. Tabular nums, times right-aligned.
5. Timezone note under the table: 16px clock SVG + "Times in Lisbon, Europe/Lisbon (WEST, UTC+1). Kiln days may close the floor at 15:00; we will write if your slot moves."
6. Clicking Book 30 min: `form.reset()`, remove `.ok`, `dialog.showModal()`, focus the name input. The panel is 420px, dust `#f4ece6`, 8px radius, scales from 0.96 and fades in over 280ms. Backdrop `rgba(46,32,24,.42)`.
7. Fields: Name (text, required, autocomplete=name), Email (email, required), Note (textarea, 3 rows, placeholder "What you would like to see"). Labels 11px uppercase above 1px bottom-border inputs. Focus turns the border `--accent`.
8. Submit: prevent default, add `.ok` to the form (hides fields and actions, shows "Request sent. We will write within a working day." in `--ok`). After 1200ms the dialog closes. Cancel, ×, Esc, and a click on the dialog element (the scrim) all close. On `close`, focus returns to Book 30 min.
9. Tab inside the open dialog cycles name → email → note → Cancel → Send → × → name. Page content behind is inert.
10. Reduced motion: dialog and underline transitions drop to 1ms.

## Tokens

```css
:root {
  --clay: #ebd8cc;             /* page */
  --dust: #f4ece6;             /* dialog surface */
  --ink: #2e2018;
  --ink-2: #6d5648;
  --ink-3: #9a8170;
  --line: rgba(46, 32, 24, .14);
  --accent: #a34b38;           /* button, underline, focus */
  --accent-ink: #f7efe9;
  --ok: #3f6b4e;               /* sent status */
  --serif: "Cormorant Garamond", Georgia, serif;
  --sans: "Work Sans", system-ui, sans-serif;
  --gutter: 56px;
  --r: 4px;
  --t-micro: 160ms;
  --t-dlg: 280ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role          | Family              | Size | Weight | Line-height | Tracking | Case      |
|---------------|---------------------|-----:|-------:|------------:|---------:|-----------|
| Email         | Cormorant Garamond  | 64px | italic 500 | 0.92    | −0.03em  | lowercase |
| Logo / hours  | Cormorant Garamond  | 28px | italic 500 | 1       | −0.02em  | Title     |
| Dialog title  | Cormorant Garamond  | 28px | italic 500 | 1       | −0.02em  | Title     |
| Body / hint   | Work Sans           | 14–15px | 400 | 1.5       | 0        | sentence  |
| Table body    | Work Sans           | 14px | 500/400 | 1.45     | 0        | Title / nums |
| Kicker / labels | Work Sans         | 11px | 500    | 1           | +0.1–.16em | UPPERCASE |
| Button        | Work Sans           | 14px | 500    | 1           | 0        | Title     |

## Implementation notes

**Let the platform trap focus.** `showModal()` is the whole overlay implementation:

```js
open.addEventListener('click', () => {
  form.classList.remove('ok');
  form.reset();
  dlg.showModal();
  form.querySelector('input').focus();
});
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
dlg.addEventListener('close', () => open.focus());
```

**Underline as a background gradient**, so it can draw without wrapping a span:

```css
.mail {
  background: linear-gradient(var(--accent), var(--accent)) 0 100% / 0 2px no-repeat;
  transition: background-size 320ms cubic-bezier(.16, 1, .3, 1);
}
.mail:hover, .mail:focus-visible { background-size: 100% 2px; }
```

**Padding on the inner form, not the dialog**, so a click on the dialog box itself is a scrim click. Putting padding on `dialog` makes `e.target === dlg` fail.

**Return focus after the 1200ms auto-close.** `dlg.close()` fires `close`, which already points at `#open`. Do not call `open.focus()` from the timeout as well or it races if the user closed early.

Common mistakes: a custom focus trap that forgets Shift+Tab. Using `alert`. Putting Saturday hours as 10–18. One-line email at 72px that overflows the left column at 1280. Forgetting `autocomplete` on name and email.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
