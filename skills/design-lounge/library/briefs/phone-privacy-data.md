<!-- Design Lounge Nº 512 · "Phone privacy and data" · www.designlounge.live -->

# Phone privacy and data

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The "Privacy & data" screen of "Quillpad", an invented journaling app, in a dark iOS 26-ish language: near-black page, charcoal grouped sections, a large serif title with a mint italic ampersand, and mint as the one accent. It is honest about what the app can reach: each permission row shows the state the phone reports (Allowed, While using, Limited, Off), never a toggle the app cannot actually flip, and one row deep-links to the phone's Settings. Below that sit a single tracking switch, a "Download my data" card that walks through requested, preparing (with a real progress bar and step labels) and ready (expires in 7 days), and a destructive "Clear search history" row guarded by an action-sheet confirm. The detail worth copying is the read-only status pill: the app reports system state instead of pretending to control it.

## Structure

```
390 × 844, <main> scrolls
┌──────────────────────────────────────┐
│ (54px status clearance)              │
│ ‹ Settings                           │ fixed bar 98px, blur
│ Privacy & data                       │ serif 42, "&" italic mint
│ Your journal stays on this phone …   │ lede 15px, 32ch
│ PERMISSIONS          Checked 08:41   │
│ ┌──────────────────────────────────┐ │
│ │ ▣ Camera            (● Allowed) ›│ │ row ≥60px, pill 28px
│ │ ▣ Location      (● While using) ›│ │
│ │ ▣ Photos            (○ Limited) ˅│ │ expanded: why text, indent 62px
│ │   12 photos selected. …          │ │
│ │ ▣ Contacts              (○ Off) ›│ │
│ │ ✲ Change in iPhone Settings    ↗ │ │ 52px, mint
│ └──────────────────────────────────┘ │
│ TRACKING                             │
│ ┌──────────────────────────────────┐ │
│ │ ▣ Usage measurement        (─○)  │ │ 64px
│ └──────────────────────────────────┘ │
│ YOUR DATA                            │
│ ┌──────────────────────────────────┐ │
│ │ ▣ Preparing your archive         │ │
│ │   ▬▬▬▬▬ ▬▬▬▬▬ ─────              │ │ step rail, 2px tops
│ │   ███████░░░░░░░░░░              │ │ meter 6px
│ │   Collecting 1,284 entries   37% │ │
│ │   [ Cancel request ]             │ │ 44px
│ │──────────────────────────────────│ │
│ │ ▣ Clear search history           │ │ red label
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
  sheet: 8px side inset, bottom 34px, card 18px radius + separate Cancel card
```

- `header.bar` with a back `button`. The `h1` lives in `main`.
- Each section is `div role="group"` labelled by its `h2`. The permissions `h2` holds the "Checked" stamp in a `small`.
- Permission row: `button aria-expanded aria-controls`, containing icon, two-line label, status pill (`span`, text is the state), chevron. The explanation is a `.collapse` region that is `inert` while closed.
- Deep link: a `button` (in production an anchor to the OS settings URL) with an arrow-out icon.
- Tracking: `button role="switch" aria-checked`, labelled by the row title and described by the sub line.
- Export card: `div aria-live="polite"` containing the title, sub line, `ol` step rail, `div role="progressbar"` with `aria-valuenow`, and an actions row whose buttons are swapped per state.
- Clear row: `button aria-haspopup="dialog"`, later `aria-disabled="true"`.
- Confirm: `div role="alertdialog" aria-modal="true" aria-labelledby aria-describedby`; `main` gets `inert` while it is open.
- Toast: `div role="status"`.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Permission explanation | row tap | grid-template-rows | 0fr ↔ 1fr | 320ms | `--spring` |
| Chevron | row tap | rotate | 0 ↔ 90° | 320ms | `--spring` |
| Status pills | after deep link | opacity, scale | 1 → .25/.94 → 1 | 700ms | `--ease` |
| Switch knob / track | toggle | translateX / background | 0 ↔ 20px | 320ms | `--spring` / `--ease` |
| Progress fill | preparing | width | 0 → 100% | 6000ms, rAF driven | linear in time |
| Step rail segments | state change | border colour, text colour | line → mint | 320ms | `--ease` |
| Export card | ready | inset ring | 1px mint → transparent | 900ms | `--ease` |
| Scrim | sheet open / close | opacity | 0 ↔ 1 | 420ms / 260ms | `--ease` |
| Sheet | open | translateY | 100% + 60px → 0 | 420ms | `--spring` |
| Sheet | close | translateY | 0 → 100% + 60px | 260ms | `--exit` |
| Toast | show / hide | translateY, opacity | 20px, 0 ↔ 0, 1 | 240ms | `--spring` |
| Buttons | :active | scale | 1 → .97 | 160ms | `--ease` |

Reduced motion: all transitions 1ms, pill pop and ring flash removed. The flow keeps its states but shortens: request 400ms, prepare 1500ms, deep-link wait 200ms, so a reviewer still sees each state.

## States

- **Permission pill Allowed / While using:** mint-soft fill, mint text, solid 7px dot.
- **Limited:** amber-soft fill, amber text, hollow dot (1.5px ring).
- **Off:** `--surface-2` fill, `--ink-2` text, hollow dot.
- **Permission row expanded:** chevron rotated, explanation visible. Pressed row: `--surface-2` background.
- **Deep link pending:** label "Opening Settings…".
- **Export idle:** "Request download" primary.
- **Export requested:** rail segment 1 current, "Cancel request" secondary.
- **Export preparing:** rail 1 done, 2 current, meter and step label visible.
- **Export ready:** all rail segments mint, mint icon tile with check, "Save archive" primary and "Start over" secondary, expiry stated as both a count and a date.
- **Export error (production, not simulated here):** keep the rail, mark the current segment red, title "We could not finish your archive", sub with a reason, primary "Try again". Never silently fall back to idle.
- **Clear row enabled:** red title and red-soft tile. **Cleared:** grey title and tile, `aria-disabled="true"`, sheet will not open.
- **Focus-visible:** 2px mint outline, 2px offset, 10px radius.
- **Empty:** if there is no search history at load, the clear row starts in the cleared state with "Nothing to clear".

## Accessibility

- One `h1`; three `h2` that label their groups.
- Permission rows are disclosure buttons (`aria-expanded`, `aria-controls`). The pill text carries the state so VoiceOver reads "Photos, Attach pictures to entries, Limited, collapsed".
- Status is never colour-only: each pill has a word and a filled versus hollow dot.
- Switch: `role="switch"`, `aria-checked`, labelled by the title, described by the sub line, so the consequence is read with the state.
- The export card is `aria-live="polite"`; the meter is a `progressbar` with `aria-valuenow` 0 to 100 and an `aria-label`. Do not announce every percent; the live region updates on title changes and the progressbar is read on demand.
- When a state swaps the action buttons, focus moves to the new first button so keyboard users are not dropped on `body`.
- Confirm is an `alertdialog`, `aria-modal`, with `main` set `inert`. Focus starts on Cancel (the safe choice), Tab cycles between Clear history and Cancel, Esc closes, focus returns to the row.
- Toasts use `role="status"`.
- Contrast on `#191e20`: `--ink` 13.8:1, `--ink-2` 7.3:1, `--mint` 10.6:1, `--amber` 9.9:1, `--red` 7.4:1; `--mint-ink` on `--mint` 9.7:1. `--ink-3` is 3.8:1, so it is for the stamp and chevrons only, never for sentences.
- Hit targets: rows at least 60px, deep link 52px, buttons 44px, sheet actions 56px, switch extended to 55 × 45px.

## Responsive rules

- 390 × 844 design frame; content starts under the 98px bar; `main` has 64px bottom padding; the sheet sits 34px above the bottom edge.
- 360 wide: "While using" pill stays on one line; the row sub wraps to two lines. Export actions wrap onto two lines if both buttons do not fit (`flex-wrap: wrap`).
- Largest text size: rows grow, nothing truncates. The status pill moves under the row title instead of sitting on the right (two-column rows stack). The step rail labels may wrap; keep the three segments equal width. Export buttons go full width and stack. The sheet scrolls internally if taller than the viewport minus 54px.
- Tablet: render as the detail pane of a settings split view, max width 600px. The sheet becomes a centred alert 320px wide.
- Do not draw the status bar or the home indicator.

## Acceptance checklist

### Always

- [ ] Permission rows show the state reported by the OS as a read-only pill, not a switch the app cannot honour.
- [ ] Partial states are shown as such ("While using", "Limited"), not rounded up to on.
- [ ] One row deep-links to system settings, and permissions are re-read when the app returns to the foreground.
- [ ] Tracking is a single switch, off by default, whose sub line says exactly what is collected in each state.
- [ ] Data export moves through requested, preparing with a determinate progress bar, and ready with an expiry as both a count and a date; it can be cancelled before ready.
- [ ] The destructive action asks for confirmation in an alert dialog, defaults focus to Cancel, and states what is kept.
- [ ] After clearing, the row becomes a disabled empty state.
- [ ] All targets at least 44px; focus visible everywhere; reduced motion keeps every state reachable.

### This demo

- [ ] Title "Privacy & data" in Instrument Serif 42px with a mint italic "&" on `#101314`.
- [ ] Camera "Allowed", Location "While using", Photos "Limited", Contacts "Off".
- [ ] Tracking sub line "Off. We record crash reports only, never entry text."
- [ ] Preparing labels change at 0%, 38%, 82%; total 6000ms after a 1400ms requested state.
- [ ] Ready reads "quillpad-export.zip, 248 MB. Expires in 7 days, on 11 Oct at 08:47."
- [ ] Clear confirm reads "This removes 214 searches from this phone and your backup. Your entries and photos stay."

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: four permission rows (Camera Allowed, Location While using, Photos Limited, Contacts Off), a mint "Change in iPhone Settings" row, header stamp "Checked 08:41". Tracking switch off. Export card idle. Clear history row active with "214 searches on this phone and in backup".
2. Tap a permission row: it expands (320ms) to explain what the permission is used for, and the chevron rotates 90°. Example for Photos: "12 photos selected. Quillpad sees only those. Add more from the picker or allow full access in Settings." Tap again to collapse. Rows are independent.
3. Tap "Change in iPhone Settings": label becomes "Opening Settings…" for 1000ms (stand-in for the deep link and the user coming back), then each status pill dims and pops once (700ms), the stamp becomes "Checked just now", and a toast says "Permissions re-checked. No changes." In production, re-read permissions on app foreground and only toast when something changed.
4. Tap the tracking switch: it slides on (mint track, dark knob) and the sub line changes from "Off. We record crash reports only, never entry text." to "On. Screens opened and features used, no entry text. Kept 90 days."
5. Tap "Request download": the card shows a three-part step rail (Requested, Preparing, Ready), title "Request received", sub "Started 08:41. We will also email maya.r@quillpad.mail when it is ready." and a "Cancel request" button. Focus moves to that button.
6. After 1400ms: "Preparing your archive", a 6px progress bar fills over 6000ms with a percentage on the right and a step label on the left that changes at 0% "Collecting 1,284 entries", 38% "Packing 312 photos", 82% "Encrypting archive". "Cancel request" stays available and returns to idle with a toast "Request cancelled".
7. At 100%: the card flashes a 1px mint inset ring (900ms), the icon tile turns solid mint with a check, title "Your archive is ready", sub "quillpad-export.zip, 248 MB. Expires in 7 days, on 11 Oct at 08:47." Buttons: "Save archive" (toast "Saved to Files") and "Start over".
8. Tap "Clear search history": a scrim fades in (420ms) and an iOS action sheet rises from below: "Clear search history?" / "This removes 214 searches from this phone and your backup. Your entries and photos stay." / red "Clear history" / separate "Cancel" card. Focus lands on Cancel.
9. Cancel, a scrim tap, or Esc closes the sheet (260ms) and returns focus to the row.
10. Confirm: the sheet closes, the row goes grey and reads "Search history cleared / Nothing to clear. New searches start from here.", `aria-disabled="true"`, and a toast says "Cleared 214 searches". Tapping the row again does nothing.

## Tokens

```css
:root {
  /* dark neutrals, slightly green-cool */
  --bg: #101314;              /* page */
  --surface: #191e20;         /* grouped sections */
  --surface-2: #22292c;       /* icon tiles, secondary buttons, off pill */
  --line: #2b3336;            /* row dividers, empty rail */
  --ink: #ece8df;             /* warm off-white text */
  --ink-2: #a3acae;           /* secondary text */
  --ink-3: #6f797c;           /* stamp, chevrons, rail labels upcoming */

  /* accent */
  --mint: #9adbc0;            /* links, switch on, primary button, progress */
  --mint-ink: #0d2a1f;        /* text on mint, knob when on */
  --mint-soft: rgba(154, 219, 192, .14);   /* Allowed / While using pill */

  /* status */
  --amber: #e8c26e;           /* Limited */
  --amber-soft: rgba(232, 194, 110, .14);
  --red: #ff8b7b;             /* destructive */
  --red-soft: rgba(255, 139, 123, .12);
  --sheet: #232a2d;           /* action sheet cards */
  --scrim: rgba(0, 0, 0, .55);

  --serif: "Instrument Serif", Georgia, serif;
  --sans: "Schibsted Grotesk", system-ui, sans-serif;

  --r-group: 16px; --r-tile: 10px; --r-btn: 12px; --r-sheet: 18px; --r-pill: 999px;
  --inset: 16px; --why-indent: 62px; --card-indent: 46px;

  --t-micro: 160ms; --t-layout: 320ms; --t-sheet: 420ms; --t-exit: 260ms;
  --t-request: 1400ms; --t-prepare: 6000ms; --t-toast: 2600ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --spring: cubic-bezier(.32, .72, 0, 1);
  --exit: cubic-bezier(.4, 0, 1, 1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Large title | Instrument Serif | 42px | 400 | 1 | -0.01em | "&" in italic, `--mint` |
| Sheet title | Instrument Serif | 24px | 400 | 1.15 | 0 | |
| Lede | Schibsted Grotesk | 15px | 400 | 1.4 | 0 | `--ink-2`, max 32ch |
| Section header | Schibsted Grotesk | 13px | 500 | 1 | 0.06em | uppercase |
| Stamp | Schibsted Grotesk | 12px | 400 | 1 | 0 | `--ink-3` |
| Row title | Schibsted Grotesk | 16px | 500 | 1.4 | 0 | |
| Row sub, explanations | Schibsted Grotesk | 13px / 14px | 400 | 1.4 | 0 | `--ink-2` |
| Status pill | Schibsted Grotesk | 13px | 500 | 28px | 0 | no wrap |
| Buttons | Schibsted Grotesk | 15px | 600 | 1 | 0 | |
| Step rail | Schibsted Grotesk | 12px | 400 | 1 | 0 | |
| Percentage | Schibsted Grotesk | 13px | 400 | 1 | 0 | tabular numerals on the number only |
| Sheet actions | Schibsted Grotesk | 17px | 400 / 600 | 56px | 0 | |

The serif appears only twice: the screen title and the confirm title. It marks the two moments that are about trust.

## Implementation notes

**Export as a small state machine.** One function owns the state; every transition clears timers and animation frames first, so Cancel during preparing cannot be overwritten by a late tick.

```js
function state(s) {
  card.dataset.s = s; clearTimeout(timer); cancelAnimationFrame(raf);
  if (s === 'requested') timer = setTimeout(() => state('preparing'), 1400);
  if (s === 'preparing') {
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min(100, Math.round((now - t0) / 6000 * 100));
      meter.setAttribute('aria-valuenow', p); fill.style.width = p + '%';
      p < 100 ? raf = requestAnimationFrame(tick) : state('ready');
    };
    raf = requestAnimationFrame(tick);
  }
  renderActions(s); // swap buttons, then focus the first one
}
```

In production the server owns progress; poll or push the percentage and keep this exact UI. Persist "ready" with its expiry timestamp so leaving and returning shows the same card.

**Pills from data, not markup.** Map the platform's permission enums to three visual kinds:

```js
const KIND = { authorized: 'on', whenInUse: 'on', limited: 'part', denied: 'off', notDetermined: 'off' };
const LABEL = { authorized: 'Allowed', whenInUse: 'While using', limited: 'Limited', denied: 'Off', notDetermined: 'Not asked' };
```

**Modal hygiene.** Set `inert` on `main` while the sheet is open, keep the sheet `visibility: hidden` after its exit transition (delay the visibility change by 260ms) so it is not tabbable, and trap Tab between the two actions.

Common mistakes:

- Drawing switches for camera or location. The app cannot flip them; a switch that opens Settings lies about what it does.
- Showing "On" for Limited photo access.
- An indeterminate spinner for the export. People leave the screen; a percentage and a named step tell them it is worth coming back.
- Putting focus on the destructive button in the confirm.
- Hiding the expiry. "Ready" without "expires in 7 days" leads to dead download links.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
