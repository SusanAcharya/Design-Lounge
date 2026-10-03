<!-- Design Lounge Nº 195 · "Editorial phone sign-in" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Editorial phone sign-in

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. This is the Sharp family: radius 0 on every control. It is not glass.

## What it is

The sign-in screen of Margin, a fictional long-read magazine app. The top third is a masthead. A thin rule carries the issue number and the date. Under it sits the word "Margin." at 112px in Instrument Serif, with an orange full stop. The form below is plain: two underlined fields, a forgot link, one orange button, one outlined passkey button, and a create-account link at the foot. Every corner is square. The colours are off-white paper, near-black ink and one signal orange. The detail worth copying is the primary button. It shows three square loading bars, then turns ink with a drawn orange tick and greets the reader by name.

## Reference behaviour

1. First frame. The masthead reads "No. 214" on the left and "Saturday 3 October" on the right. "Margin." is at 112px. The dek reads "Long reads, read to the end." Both fields are empty with placeholders. No errors show.
2. Focus a field. Its 1.5px ink underline turns orange and thickens to 3px. The label above stays put.
3. Leave the email field empty and blur it before any submit. Nothing happens. Do not scold a user who only tabbed past.
4. Type "asha@" and blur. The error "Enter an email like name@example.com." appears under the field in `--accent-ink`, with a 6px square marker. The underline turns `--accent-ink`. `aria-invalid="true"` is set.
5. Fix the email while an error shows. The error clears on the keystroke that makes the value valid.
6. Tap "Sign in" with an empty email. The error reads "Enter your email address." Focus moves to the email field. The password is checked too.
7. Tap "Sign in" with a valid email and an empty password. The error reads "Enter your password." Focus moves to the password field.
8. Tap the eye button. The password shows as text. The icon gains a slash. The button label becomes "Hide password" and `aria-pressed="true"`. Tap again to reverse.
9. Tap "Sign in" with both fields valid. The button turns ink in 280ms. The label reads "Signing in". Three 4px orange bars pulse on the right. `aria-busy="true"` is set.
10. After 1200ms the button reads "Welcome back, Asha" (the first part of the email, capitalised). An orange tick draws in 360ms on the right.
11. At 3600ms after submit the button returns to "Sign in" in orange. In a product, navigate instead.
12. Tap "Continue with passkey". Its border turns dashed. The label reads "Check your phone" for 1800ms, then returns.
13. "Forgot password?" and "Create an account" are links. In the demo they announce through the status region and do not navigate.

## Structure

```
390 x 844, padding 54px top, 24px sides, 34px bottom
+--------------------------------------+
| NO. 214            SATURDAY 3 OCTOBER| 11px caps, 1px ink rule under
|                                      |
| Margin.                              | 112px serif, line-height 0.82
| Long reads, read                     | 22px italic serif, 18ch
| to the end.                          |
| ------------------------------------ | 1px --line, 20px above, 16px below
| SIGN IN                              | 13px caps
| EMAIL                                | 11px caps label
| you@example.com_____________________ | 48px input, 1.5px underline
| PASSWORD                             |
| Your password_________________ [eye] | eye 44x44
|                     Forgot password? | 44px tall link, right
| [ Sign in                         -> ]| 56px, orange
| ---------------- OR ---------------- |
| [ (key) Continue with passkey      ] | 56px, 1.5px ink border
|                                      |
|   New to Margin? Create an account   | pinned to the bottom
+--------------------------------------+
```

- `header` holds the masthead row, the `h1` wordmark and the dek `p`.
- The rule is a `div` with `role="presentation"`.
- `main` holds an `h2` "Sign in" and the `form`.
- The form has `novalidate` and `aria-labelledby` pointing at the `h2`.
- Each field is a `label`, a wrapper `.box` that owns the underline, the `input`, and an error `p`.
- The passkey button sits outside the form so Enter never fires it.
- The foot is a `p` with `margin-top: auto`, so it sinks to the bottom of the column.
- A visually hidden `p` with `role="status"` speaks loading, success and passkey changes.

## Tokens

```css
:root {
  /* colour */
  --bg: #f2efe8;          /* paper */
  --surface: #faf8f3;     /* text on ink button */
  --ink: #121110;         /* body, rules, focus ring */
  --ink-2: #47443e;       /* labels, dek, date */
  --ink-3: #6b665d;       /* the "or" divider */
  --line: #d6d0c4;        /* hairlines */
  --accent: #ff4f00;      /* signal orange: button fill, full stop, focus underline */
  --accent-ink: #b3380a;  /* orange that passes as text: errors */
  --on-accent: #121110;   /* text on the orange button */

  /* type */
  --serif: "Instrument Serif", Georgia, serif;
  --sans: "Inter Tight", system-ui, sans-serif;

  /* shape */
  --radius: 0;
  --control: 56px;
  --field: 48px;
  --hit: 44px;

  /* space: 4px base */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px; --s-6: 24px;

  /* motion */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --fast: 160ms;
  --mid: 280ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Masthead row | Inter Tight | 11px | 600 | 1.45 | 0.12em | upper |
| Wordmark | Instrument Serif | 112px | 400 | 0.82 | -0.045em | as set |
| Dek | Instrument Serif italic | 22px | 400 | 1.15 | 0 | sentence |
| Section ("Sign in") | Inter Tight | 13px | 700 | 1.45 | 0.12em | upper |
| Field label | Inter Tight | 11px | 600 | 1.45 | 0.1em | upper |
| Input text | Inter Tight | 18px | 500 | 48px box | 0 | as typed |
| Placeholder | Inter Tight | 18px | 400 | 48px box | 0 | `#9b958a` |
| Error | Inter Tight | 13px | 500 | 1.45 | 0 | sentence |
| Buttons | Inter Tight | 16px | 600 | 1 | 0.01em | sentence |
| Links | Inter Tight | 14px | 600 | 1 | 0 | sentence |

- The wordmark is the only serif display. Do not set the button in the serif.
- The full stop after "Margin" is `--accent`. It is the only orange in the masthead.
- Under 760px of height, drop the wordmark to 92px. Keep everything else.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Field underline | focus | border colour, box-shadow | ink 1.5px → orange 3px | 160ms | `--ease` | instant |
| Error | invalid on blur or submit | display | hidden → shown | none | none | same |
| Primary fill | submit, valid | background, colour | orange → ink | 280ms | `--ease` | instant |
| Loading bars | loading | scaleY | 0.35 → 1 → 0.35 | 720ms loop, 120ms stagger | `--ease` | one frame, static |
| Success tick | done | stroke-dashoffset | 24 → 0 | 360ms, 60ms delay | `--ease` | drawn at once |
| Button press | active | translateY | 0 → 1px | 160ms | `--ease` | instant |
| Passkey wait | click | border-style | solid → dashed | none | none | same |

- Nothing moves on the first frame. The masthead is still.
- The loading bars are the only loop. They stop when the state changes.

## States

- Field resting: underline 1.5px `--ink`. Label `--ink-2`.
- Field focus: underline `--accent` plus a 1.5px orange box-shadow under it. Total 3px.
- Field error: underline `--accent-ink`. Error text in `--accent-ink` with a 6px square before it. `aria-invalid="true"`.
- Eye button: 44×44, `--ink-2`, hover `--ink`. Pressed shows a slash line across the eye.
- Primary resting: `--accent` fill, `--on-accent` text, label left, arrow right. Hover `#ff6620`.
- Primary loading: `--ink` fill, `--surface` text, label "Signing in", three bars right, `cursor: progress`, `aria-busy="true"`. Extra taps do nothing.
- Primary done: `--ink` fill, label "Welcome back, Asha", orange tick right.
- Ghost resting: transparent, 1.5px `--ink` border. Hover fills `--ink`, text `--surface`.
- Ghost busy: dashed border, label "Check your phone", `aria-busy="true"`.
- Links: ink text, 2px orange underline, 4px offset. Hover turns the underline ink.
- Focus-visible on buttons and links: 2px `--ink` outline, 3px offset. Square, because radius is 0.
- Disabled: not used. The button never greys out. It validates on tap.

## Accessibility

- One `h1`: the wordmark "Margin.". The form heading is an `h2`.
- Inputs have real `label` elements. Placeholders are hints, not labels.
- Email: `type="email"`, `inputmode="email"`, `autocomplete="username"`.
- Password: `autocomplete="current-password"`. The toggle changes `type`, never the value.
- Each input has `aria-describedby` pointing at its error `p`. The error `p` has `aria-live="polite"`.
- On a failed submit, focus the first bad field. Email comes before password.
- The eye button has `aria-controls="pw"`, `aria-pressed` and a label that flips between "Show password" and "Hide password".
- A hidden `role="status"` region announces "Signing in", then "Signed in. Welcome back, Asha".
- Tab order: email, eye, password, forgot, Sign in, passkey, create account. The eye sits after the password input in the DOM. Move it before the input only if your design puts it on the left.
- Contrast: `#121110` on `#f2efe8` is about 16:1. `#b3380a` errors on `#f2efe8` are about 5.2:1. `#121110` on `#ff4f00` is about 5.7:1. Do not put orange text on the paper. `#ff4f00` on `#f2efe8` is near 3:1. It is fine for the underline and the full stop, not for words.
- Hit targets: buttons 56px tall, eye 44×44, links 44px tall.
- Errors are not colour only. Each error has words and a square marker.

## Responsive rules

- The frame is 390×844. Top padding is max(54px, env(safe-area-inset-top)). Bottom padding is max(34px, env(safe-area-inset-bottom)).
- At 360 wide, keep the 112px wordmark. "Margin." is 6 letters and fits at 24px side padding.
- Under 760px tall, the wordmark drops to 92px and the rule margins shrink to 16px and 12px.
- When the keyboard opens, let the column scroll. Do not shrink the inputs.
- At tablet width, centre the column at 420px max width. Do not stretch the fields to 1180px.
- Do not draw a status bar. The 54px is clearance.

## Acceptance checklist

### Always

- [ ] Radius is 0 on fields, buttons and focus rings.
- [ ] One primary button. The passkey button is outlined, not filled.
- [ ] Inputs have visible labels above them, 11px caps.
- [ ] Errors appear on blur after input, and on submit. Tabbing past an empty field shows nothing.
- [ ] Each error is linked by `aria-describedby`, and `aria-invalid` is set while it shows.
- [ ] A failed submit moves focus to the first bad field.
- [ ] The password toggle is a 44px button with `aria-pressed` and a changing label.
- [ ] The submit button shows a loading state with `aria-busy`, then a success state, and ignores taps while busy.
- [ ] Every hit target is 44px tall or more.
- [ ] Focus is visible on every control.
- [ ] Reduced motion removes the loop and the tick draw. The states still change.

### This demo

- [ ] The wordmark reads "Margin." at 112px Instrument Serif with an orange `#ff4f00` full stop.
- [ ] The masthead reads "No. 214" and "Saturday 3 October" over a 1px ink rule.
- [ ] The empty email error reads "Enter your email address."
- [ ] The bad email error reads "Enter an email like name@example.com."
- [ ] The loading label reads "Signing in" for 1200ms, then "Welcome back, Asha" for the email asha@….
- [ ] The foot reads "New to Margin? Create an account".

## Implementation notes

**The underline is the field.** Put the border on the wrapper, not the input, so the eye button sits on the same line. Use a box-shadow for the focus thickening so the layout does not jump.

```css
.box { display: flex; align-items: center; border-bottom: 1.5px solid var(--ink); }
.box input { flex: 1; height: 48px; border: 0; background: none; outline: 0; border-radius: 0; font-size: 18px; }
.box:focus-within { border-bottom-color: var(--accent); box-shadow: 0 1.5px 0 var(--accent); }
.field.bad .box { border-bottom-color: var(--accent-ink); }
.eye { width: 44px; height: 44px; margin-right: -10px; }
```

**Validate late, clear early.** Show an error on blur only once the user has typed or tried to submit. Clear it on the keystroke that fixes it.

```js
const RX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function checkEmail() {
  const v = email.value.trim();
  const msg = !v ? 'Enter your email address.'
    : !RX.test(v) ? 'Enter an email like name@example.com.' : '';
  document.getElementById('email-err').textContent = msg;
  email.closest('.field').classList.toggle('bad', !!msg);
  msg ? email.setAttribute('aria-invalid', 'true') : email.removeAttribute('aria-invalid');
  return !msg;
}
email.addEventListener('blur', () => { if (touched || email.value) checkEmail(); });
email.addEventListener('input', () => { if (email.getAttribute('aria-invalid')) checkEmail(); });
```

**One button, three states.** Drive the look from a `data-state` attribute. Keep the label in one `span` so screen readers hear one name.

```css
.primary { background: var(--accent); color: var(--on-accent); transition: background-color 280ms var(--ease); }
.primary[data-state="loading"], .primary[data-state="done"] { background: var(--ink); color: var(--surface); }
.bars, .tick { display: none; }
.primary[data-state="loading"] .bars { display: flex; }
.primary[data-state="done"] .tick { display: block; stroke: var(--accent);
  stroke-dasharray: 24; stroke-dashoffset: 24; animation: draw 360ms var(--ease) 60ms forwards; }
@keyframes draw { to { stroke-dashoffset: 0; } }
```

Common mistakes:

- Rounding the button "a little". Sharp is 0. A 4px corner breaks the family.
- Orange text for errors at `#ff4f00`. It fails contrast. Use `--accent-ink`.
- Errors that fire on the first keystroke of the email. Wait for blur.
- Disabling the button until the form is valid. The user then cannot learn what is wrong.
- A spinner circle. This family uses three square bars.
- Putting the passkey button inside the form, so Enter triggers it.
- Floating labels. The label sits above the field and does not move.
- A glass card behind the form. The paper is the surface.
- A second accent for success. Success is ink plus the same orange tick.

Where it sits:

1. This is the returning-user door. New users go to `phone-sign-up-steps`.
2. "Continue with passkey" hands off to the system sheet. To set up a passkey after sign in, use `auth-passkey-setup`, restyled onto this family.
3. "Forgot password?" opens a reset screen. If your product sends a link, `auth-magic-link-sent` is the next screen.
4. After sign in, the app shell can use `phone-tab-plain`. Do not use the glass tab bar with this family.
5. On web, the two-column version is `split-sign-in`.

Rebuild order:

1. Set the column: 54px top, 24px sides, 34px bottom, flex column.
2. Set the masthead row, the 112px wordmark and the dek.
3. Build the two fields with underlines and labels.
4. Add the eye toggle.
5. Add the primary button with its three states.
6. Add the divider and the passkey button.
7. Pin the create-account line with `margin-top: auto`.
8. Wire validation, focus moves and the status region.
9. Check contrast and reduced motion.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
