<!-- Design Lounge Nº 503 · "M3 sign-in with passkey" · www.designlounge.live -->

# M3 sign-in with passkey

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The sign-in screen of Glazeday, an invented pottery studio app where members book wheel time and kiln firing slots. It is pure **Material 3 Expressive** on Android: a 64px small top app bar, two M3 outlined text fields with floating labels and supporting text, a full-pill filled "Sign in" button, a tonal "Use a passkey" button, and a "Forgot password" text button. The colour scheme is a terracotta tonal palette generated from a clay seed (`#8f4c38`), on a warm `#fff8f6` surface. The detail worth copying is that every state lives in the M3 slots: the error replaces the supporting text under the field (it does not appear as a banner), the loading state lives inside the button that was pressed, and success is a snackbar. There are no third party sign-in buttons and no company logos.

## Structure

```
390 × 844
┌──────────────────────────────────────┐
│ 54 safe area                         │
│ [X]                            [?]   │ small top app bar 64, icon buttons 48
│  ✺ brand mark 64                     │
│  Sign in                    32/40    │ headline-large, Lexend 500
│  Book wheel time and firing slots    │ body-large, 30ch max
│  at Glazeday Studio.                 │
│                                      │ 28
│ ┌ Email ───────────────────────────┐ │ outlined field 56, radius 4
│ │ dorje.lama@example.com           │ │
│ └──────────────────────────────────┘ │
│   The address you booked with        │ supporting 12/16, pad 4 16 0, min-h 20
│ ┌──────────────────────────────────┐ │ 12 gap
│ │ Password                     (◉) │ │ trailing icon button 48
│ └──────────────────────────────────┘ │
│   Demo password is glaze. …          │
│                     Forgot password  │ text button 48 tall, right aligned
│ ( ⟳  Sign in                       ) │ filled, 56 tall, radius 28
│ ───────────── or ─────────────       │ 48 tall divider row
│ ( ⚿  Use a passkey                 ) │ tonal, 56 tall, radius 28
│                                      │ flex spacer
│   New to the studio? Create account  │ foot, text button
│ 34 home indicator                    │
└──────────────────────────────────────┘
snackbar: fixed, left/right 16, bottom 34+12, min-h 48, radius 4
```

- `header.bar` holds two `button.icon-btn`. No title text in the bar; the screen title is the `h1` below it.
- `main` is a flex column, padding 0 24px. The foot is pushed down with `margin-top:auto`.
- `form#f` has `novalidate` and `aria-labelledby` pointing at the `h1`. It contains both fields, the forgot row and the submit button. The passkey button sits outside the form after the divider.
- Each field is `.field > .tf > input + label (+ trailing button or error icon)` followed by `p.support`. The input has `placeholder=" "` so `:placeholder-shown` drives the floating label.
- The snackbar is a single `div role="status" aria-live="polite"` reused for every message.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Field label | focus / value | top, font-size, colour | 28px centre, 16px → 0, 12px | 150ms | `--emph` | 1ms |
| Field outline | focus | border colour + inset shadow | 1px outline → 2px primary | 150ms | `--emph` | 1ms |
| Button shape | press | border-radius | 28px → 16px | 200ms | `--emph` | 1ms |
| Ripple | pointerdown | scale of a circle 2× the button diagonal | 0 → 1, then opacity .12 → 0 on release | 450ms + 200ms | `--emph` | no ripple, state layer only |
| State layer | hover / focus / press | `::after` opacity | 0 → .08 / .10 / .10 | 150ms | linear | 1ms |
| Spinner | loading | rotate + dash arc | 360° per 1000ms, arc 1400ms loop | loop | linear / `--emph` | static 28 unit arc |
| Success check | success | stroke-dashoffset | 24 → 0 | 300ms, 60ms delay | `--emph-d` | drawn instantly |
| Snackbar | message | translateY, opacity | 16px, 0 → 0, 1 | 300ms / 200ms | `--emph-d` | 1ms |
| Brand mark | always | rotate | 0 → 360° | 24s loop | linear | stopped |

## States

- **Field resting**: 1px `--outline`, label inside at 16px.
- **Field hover**: outline `--on-surface`.
- **Field focused**: 2px `--primary` (1px border + `inset 0 0 0 1px`), label floated and `--primary`, caret `--primary`.
- **Field filled, not focused**: label floated in `--on-surface-v`.
- **Field error**: outline and label `--error`, focused error ring 2px `--error`, trailing error icon (circle with exclamation) at right 4px for email, eye icon tinted `--error` for password, supporting text replaced by the message in `--error`, `aria-invalid="true"`.
- **Field read-only (during loading)**: text `--on-surface-v`, no edits.
- **Filled button**: `--primary` bg; hover adds the M3 level 1 shadow; press morphs radius to 16px.
- **Loading**: spinner + new label inside the pressed button, `aria-busy="true"`; the other button `aria-disabled="true"` at 60% opacity; cursor `progress`. The pressed button keeps full opacity.
- **Success**: pressed button `--inverse` bg, check icon, "Signed in". Not dimmed.
- **Tonal button**: `--secondary-c` bg, `--on-secondary-c` text, key icon left.
- **Text button**: 48px tall, 12px side padding (pulled flush with the field edge by -12px margin), `--primary` text, pill state layer.
- **Focus-visible**: 3px `--primary` outline, 2px offset, on every button and icon button.
- **Empty**: does not apply; the screen always has its fields.

## Accessibility

- One `h1` ("Sign in"). The form is labelled by it.
- Each input has a real `<label for>`. Supporting text is linked with `aria-describedby`, so the error message is read with the field. Password supporting text is `aria-live="polite"` so a new error is announced.
- `autocomplete="username"` on email, `autocomplete="current-password"` on password, `inputmode="email"`.
- The eye button: `aria-controls="pw"`, `aria-pressed`, and a label that says what the next press does.
- Loading uses `aria-busy` on the button and `aria-disabled` (not `disabled`) on both buttons so focus is not lost mid-request. Submits during loading are ignored in script.
- On wrong password, focus moves to the password field and its text is selected.
- Snackbar is `role="status"`. Messages stay 3200ms; none contain an action, so none need to be focusable.
- Hit targets: icon buttons 48×48, text buttons 48 tall, filled and tonal 56 tall full width, fields 56 tall.
- Contrast: `--on-surface-v` `#53433f` on `#fff8f6` is above 7:1; `--primary` text on surface is above 6:1; white on `--primary` is above 6:1; `--error` on surface is above 6:1.
- Keyboard: Tab order is Close, Help, Email, Password, Eye, Forgot password, Sign in, Use a passkey, Create account. Enter in a field submits.

## Responsive rules

- Frame 390×844; content padding 24px; top clearance `max(54px, env(safe-area-inset-top))`, bottom `max(34px, env(safe-area-inset-bottom))`.
- Under 780px tall the brand mark hides and the headline and form margins tighten (12px and 20px), so Sign in stays above the fold.
- At 360 wide nothing changes except the field width; supporting text wraps to two lines and pushes content down instead of truncating.
- At the largest font scale (Android 200%): fields and buttons use `min-height`, not `height`, so they grow; the label floats over a taller field; supporting text wraps; the "or" divider row grows; the foot "New to the studio? Create account" wraps to two lines with the text button on its own line. The screen scrolls rather than clips.
- On a tablet, centre the column at 400px max width on `--surface`. Do not stretch fields across 1180px.

## Acceptance checklist

### Always

- [ ] Two M3 outlined fields, 56px tall, radius 4, floating label that sits on the outline with a surface-coloured gap behind it.
- [ ] Supporting text under every field, 12/16; the error message replaces it in the same slot and the field shows the error outline, label and trailing icon.
- [ ] Password has a 48×48 show and hide icon button with `aria-pressed` and a changing label.
- [ ] One filled primary button and one tonal button, both 56px full pills that morph to 16px radius on press.
- [ ] Loading lives inside the pressed button (spinner + new label, `aria-busy`); the other button is `aria-disabled` and fields are read-only.
- [ ] Wrong credentials put the error on the password field and move focus there with the text selected.
- [ ] Success is a snackbar, not a dialog.
- [ ] Ripple from the pointer and an 8/10/10% state layer on every pressable.
- [ ] No company sign-in buttons, logos or brand names.
- [ ] Every target at least 48px.

### This demo

- [ ] Scheme seeded from `#8f4c38` on `#fff8f6`; headline in Lexend 500 32/40; fields in Nunito Sans.
- [ ] Prefilled email `dorje.lama@example.com`; demo password `glaze`.
- [ ] Wrong password message "Wrong password. Try again or reset it." after 1400ms loading.
- [ ] Passkey loading label "Waiting for screen lock" for 1600ms.
- [ ] Snackbar "Welcome back, Dorje. Your Thursday wheel slot is held."

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: email is prefilled with `dorje.lama@example.com`, so its label sits floated on the outline. Password is empty, label resting inside the field. Supporting text under email reads "The address you booked with". Under password it reads "Demo password is **glaze**. Anything else is wrong."
2. Focus a field: outline goes from 1px `--outline` to 2px `--primary` (drawn as a 1px border plus a 1px inset shadow so text does not shift). The label floats to the top edge, shrinks 16px to 12px and turns `--primary` over 150ms.
3. Type in the password. Tap the trailing eye icon button (48×48): the field switches between `type=password` and `type=text`; the icon gains a diagonal slash; `aria-pressed` and the label ("Show password" / "Hide password") update.
4. Blur email with an invalid value: the field enters error. Outline `--error`, label `--error`, a trailing error icon appears, and the supporting text is replaced by "Enter an email like name@example.com". Empty email on submit gives "Enter your email address". Typing a fix re-validates live and restores the original supporting text.
5. Tap "Sign in" (or press Enter in either field):
   - Empty password: password goes to error with "Enter your password" and receives focus. No loading.
   - Otherwise the button enters **loading**: a 20px circular indeterminate indicator appears left of the label, the label becomes "Signing in", the button gets `aria-busy="true"`. Both buttons get `aria-disabled="true"` (the tonal one dims to 60%); both fields become read-only. Loading lasts 1400ms.
6. Wrong password (anything other than `glaze`): loading ends, the button returns to "Sign in", the password field enters error with "Wrong password. Try again or reset it.", receives focus, and its value is selected so the next keystroke replaces it.
7. Right password: the button becomes "Signed in" with a check mark that draws in over 300ms, background switches to `--inverse` (`#392e2b`). A snackbar rises from the bottom: "Welcome back, Dorje. Your Thursday wheel slot is held." After 3400ms the button resets, the password clears, the supporting text returns.
8. Tap "Use a passkey": the tonal button itself enters loading ("Waiting for screen lock", spinner replaces the key icon) for 1600ms, then runs the same success as step 7 with its own label "Use a passkey" on reset.
9. Tap "Forgot password": if the email is valid, a snackbar reads "Reset link sent to dorje.lama@example.com". If not, the email field goes to error and gets focus.
10. Close (X) and Help (?) in the top app bar, and "Create account" at the foot, show explanatory snackbars in this demo.
11. Every pressable element shows an M3 ripple from the pointer position plus a state layer (hover 8%, focus 10%, press 10%).
12. The brand mark (a 12 lobed scallop in `--primary-c` with a pot glyph) rotates once every 24s. It is the only ambient motion.

## Tokens

```css
:root {
  /* M3 scheme from seed #8f4c38 (light) */
  --primary: #8f4c38;
  --on-primary: #ffffff;
  --primary-c: #ffdbd1;        /* primary container: brand mark */
  --on-primary-c: #3a0b01;
  --secondary-c: #f7ded6;      /* tonal button */
  --on-secondary-c: #2c150f;
  --surface: #fff8f6;
  --surface-c: #fceae5;
  --on-surface: #231917;
  --on-surface-v: #53433f;     /* labels, supporting text, icons */
  --outline: #85736e;          /* resting field outline */
  --outline-v: #d8c2bc;        /* divider */
  --inverse: #392e2b;          /* snackbar, success button */
  --on-inverse: #ffede8;
  --error: #ba1a1a;

  --display: "Lexend", system-ui, sans-serif;     /* headline, buttons */
  --body: "Nunito Sans", system-ui, sans-serif;   /* fields, body, supporting */

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-6: 24px;
  --radius-field: 4px;
  --radius-btn: 28px;          /* full pill at 56px */
  --radius-btn-pressed: 16px;  /* expressive press morph */
  --radius-snack: 4px;
  --control: 56px;
  --target: 48px;

  --emph: cubic-bezier(.2, 0, 0, 1);       /* M3 emphasized */
  --emph-d: cubic-bezier(.05, .7, .1, 1);  /* emphasized decelerate */
  --d-micro: 150ms;
  --d-shape: 200ms;
  --d-snack: 300ms;
  --d-ripple: 450ms;
}
```

## Typography

| Role (M3 scale) | Family | Size / line | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Headline large ("Sign in") | Lexend | 32 / 40 | 500 | -0.01em | `--on-surface` |
| Body large (lede, input text) | Nunito Sans | 16 / 24 | 400 | 0 | `--on-surface-v` lede, `--on-surface` input |
| Field label resting | Nunito Sans | 16 / 20 | 400 | 0 | `--on-surface-v` |
| Field label floated | Nunito Sans | 12 / 16 | 400 | 0 | `--primary` focused, `--on-surface-v` filled |
| Supporting text | Nunito Sans | 12 / 16 | 400, demo word 700 | 0.03em | `--on-surface-v`, error `--error` |
| Button label | Lexend | 16 / 24 | 500 | 0.01em | per button |
| Text button | Lexend | 14 / 20 | 500 | 0.01em | `--primary` |
| Divider "or" | Nunito Sans | 12 | 400 | 0.06em | `--on-surface-v` |
| Snackbar | Nunito Sans | 14 / 20 | 400 | 0.02em | `--on-inverse` |

Lexend is only for the headline and button labels. Everything the user reads or types is Nunito Sans.

## Implementation notes

**The floating label without a fieldset.** Put the label after the input, give the input `placeholder=" "`, and paint the label background with the surface colour so it cuts the outline:

```css
.tf { position: relative; }
.tf input { height: 56px; width: 100%; padding: 0 16px; border: 1px solid var(--outline); border-radius: 4px; background: transparent; }
.tf input:focus { border-color: var(--primary); box-shadow: inset 0 0 0 1px var(--primary); outline: 0; }
.tf label { position: absolute; left: 12px; top: 28px; transform: translateY(-50%); padding: 0 4px;
  background: var(--surface); font-size: 16px; line-height: 20px; pointer-events: none;
  transition: top 150ms var(--emph), font-size 150ms var(--emph), color 150ms; }
.tf input:focus + label, .tf input:not(:placeholder-shown) + label { top: 0; font-size: 12px; line-height: 16px; }
.tf input:focus + label { color: var(--primary); }
```

Do not change `border-width` on focus; the text jumps by a pixel. Use the inset shadow.

**One error slot.** The supporting paragraph is both hint and error. Keep the original hint so you can restore it:

```js
function setErr(input, msg, hint) {
  const field = input.closest('.field'), s = document.getElementById(input.getAttribute('aria-describedby'));
  field.classList.toggle('bad', !!msg);
  if (msg) { s.textContent = msg; input.setAttribute('aria-invalid', 'true'); }
  else { s.innerHTML = hint; input.removeAttribute('aria-invalid'); }
  return !msg;
}
```

**Ripple.** Append a circle sized to twice the element's diagonal, centred on the pointer, scale it 0 → 1 over 450ms, and fade it only after both the grow has finished and the pointer is up. The element needs `position: relative; overflow: hidden; isolation: isolate` and the circle `z-index: -1` so it sits under the label.

Common mistakes:

- An error banner above the form. M3 puts the error under the field it belongs to.
- Disabling the submit button while the form is empty. Let the press happen and show which field is wrong.
- Replacing the whole button with a spinner. Keep the pill and the label; the user should still read what is happening.
- Using `disabled` during loading, which drops focus to `body`.
- A passkey button styled as filled. It is the secondary path and is tonal.
- iOS chrome: no large title bar, no grouped inset fields, no blur.
- Drawing a status bar. The Lounge draws one.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
