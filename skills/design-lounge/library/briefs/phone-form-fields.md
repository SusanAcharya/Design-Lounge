<!-- Design Lounge Nº 340 · "Phone form fields" · www.designlounge.live -->

# Phone form fields

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. This is the industrial form family: 2px radii, hard borders, one safety yellow.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A full phone screen for booking a skip bag collection in a fictional app called Kerbstone. It holds seven controls: contact name, mobile with a country code select, street, postcode, collection day, a three-way bag size choice, a driver note with a character counter, and an SMS switch. Labels are condensed grotesk in caps. Typed values are mono. Fields check themselves when you leave them. Pressing Save shows an error summary at the top and moves focus to the first bad field. The Save button is fixed above the 34px home area and always shows the day and the price.

The detail worth copying is the honest error. The message says what to type and what you typed: "Enter 10 digits after +44. You typed 6." It is not "Invalid input".

This piece is the native-feel phone form with no glass. It uses neither iOS 26 Liquid Glass nor Material 3. It is its own industrial language, built on the same 44px touch rules.

## Structure

```
390 x 844
padding-top 54px (status bar is drawn by the Lounge)
+--------------------------------------------+
| ////// hazard stripe 6px, full bleed ///// |
| KERBSTONE · COLLECTION          KS-40817   |  13px caps / 12px mono
| BOOK A COLLECTION                          |  34px condensed caps
| Skip bag pickup. Driver needs a clear 3 m  |  12px mono
| [ error summary, hidden until submit ]     |
| CONTACT NAME                               |
| [ Mira Oduya                          v ]  |  48px box
| MOBILE                for the driver only  |
| [ +44 v | 7700 90                      ]   |  48px, red
|  /!\ Enter 10 digits after +44. You typed 6.|
| STREET                 | POSTCODE          |  1.4fr / 1fr, 10px gap
| [ 14 Tanner Row      ] | [ YO1 6JR    v ]  |
| COLLECTION DAY                  Mon to Sat |
| [ 07/10/2026                          v ]  |
| BAG SIZE                  price incl. VAT  |
| [  MINI  |##MIDI##|  MEGA  ]               |  52px cells
| NOTE FOR THE DRIVER                38/140  |
| [ Bag is behind the side gate...        ]  |  88px textarea
| [ TEXT ME ON THE WAY              [##o] ]  |  56px row
|                                            |  page padding-bottom 126px
+--------------------------------------------+
| fixed dock, 2px ink top rule               |
| [ SAVE BOOKING           Wed 7 Oct · £119 ]|  52px yellow
| 34px home clearance                        |
+--------------------------------------------+
```

- The page is a `main`. The title is the only `h1`.
- The form is a `form novalidate`. The Save button sits outside it in the dock and uses `form="form"` and `type="submit"`.
- Each field is a wrapper `div.group` holding a `label`, a `div.box`, and a `p.err`.
- The input links to its error with `aria-describedby`.
- The country code is a `select` inside the same box as the phone input, split by a 2px rule.
- Bag size is a `fieldset` with a `legend` and three radio inputs inside labels.
- The switch is a `button role="switch"` labelled by the row text.
- The error summary is a `div role="alert"` with an `h2` and a `ul` of links.
- The dock is `position: fixed`, full width, `--surface`, with a 2px ink top border.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Field border and ring | focus, blur | border-color, box-shadow | line → ink + 3px yellow | 140ms | `--ease` | instant |
| Error line | rule fails | opacity, translateY | 0, -6px → 1, 0 | 140ms | `--ease` | instant |
| Error summary | submit with errors | opacity, translateY | 0, -6px → 1, 0 | 240ms | `--ease` | instant |
| Switch knob | tap | translateX | 0 → 24px | 240ms | `--ease` | instant |
| Save press | active | translateY | 0 → 1px | 140ms | `--ease` | none |

Replay the summary animation on every failed submit. Remove the class, force a reflow, then add it again. Under `prefers-reduced-motion: reduce`, set all animation and transition to none. Nothing else moves. No shake on error. Industrial means firm, not jumpy.

## States

- Field resting: 2px `--line` border, `--field` fill.
- Field focus: 2px `--ink` border plus a 3px `--accent` ring outside it. The yellow alone fails contrast on concrete, so the ink border is the real signal.
- Field valid (has value, passed): 2px `--ink-2` border and an 18px green tick at the right edge.
- Field invalid: 2px `--error` border, `#faf1ee` fill, error line visible, `aria-invalid="true"`. On focus the ring turns `rgba(163,32,15,.28)`.
- Error line: 16px triangle icon plus text, 6px gap, 6px above. The icon is not the only signal. The text always shows.
- Segmented cell selected: `--accent` fill, price text turns `--ink`. Focus shows a 2px ink outline inset by 6px.
- Counter: `--ink-3`, then `--error` at 120 of 140.
- Switch off: `--surface` track, ink knob left. On: `--accent` track, knob right.
- Save resting: yellow fill, 2px ink border. Saved: ink fill, yellow text, tick, "Booked".
- Summary: 2px red border, 8px red left border, `--error-bg` fill.
- Disabled: not used. Do not disable Save while errors exist. The user needs the button to find out what is wrong.

## Accessibility

- Every input has a visible `label` with `for`. The country code select has `aria-label="Country code"`.
- Each input points at its error `p` with `aria-describedby`. The error is empty until a rule fails.
- Set `aria-invalid` to `true` or `false` after each check.
- On failed submit, focus the first bad field. The summary is `role="alert"` so its title is read once.
- Summary links call `focus()` on the field. Do not rely on the hash jump alone.
- The counter is `aria-hidden`. A visually hidden `aria-live="polite"` line reads "102 characters left".
- The switch is a `button` with `role="switch"` and `aria-checked`. It is labelled by its row text.
- Bag size uses real radios, so arrow keys move the choice.
- Correct keyboards and autofill:
  - Name: `type="text" autocomplete="name" autocapitalize="words"`.
  - Code: `autocomplete="tel-country-code"`.
  - Mobile: `type="tel" inputmode="tel" autocomplete="tel-national"`.
  - Street: `autocomplete="address-line1"`.
  - Postcode: `autocomplete="postal-code" autocapitalize="characters" spellcheck="false"`.
  - Day: `type="date"` with `min` and `max`.
  - Note: `maxlength="140" autocomplete="off"`.
- Use `enterkeyhint="next"` on single-line fields and `done` on the note.
- Contrast: `#1a1a18` on `#f0efeb` is above 15:1. `#a3200f` on `#faf1ee` is above 6:1. `#55534d` on `#d3d1cb` is about 5:1.
- Hit targets: fields 48px, segments 52px, switch 32px tall with an 8px invisible extension above and below, Save 52px.
- Focus ring on buttons: 2px ink outline, 2px offset.

## Responsive rules

- The frame is 390×844. Padding 54px top and 16px on the sides.
- The dock sits at the bottom with `max(34px, env(safe-area-inset-bottom))` under the button. The page bottom padding is 92px plus that, so the last row never hides.
- At 360 wide, keep Street and Postcode side by side at 1.4fr and 1fr. Below 340, stack them.
- Write the columns as `minmax(0, 1.4fr) minmax(0, 1fr)` and give the inputs `min-width: 0`. Plain `1fr` lets an input push the row past the phone edge.
- At 360, the title stays 34px. It wraps to two lines if a product name is longer.
- When the keyboard opens, the dock rides above it on iOS. Scroll the focused field into view with `scrollIntoView({block: "center"})` if the platform does not.
- On tablet width, cap the form at 560px and center it. The dock stays full width with the button capped at 560px.
- Do not draw a status bar or a home indicator. The padding is the clearance.

## Acceptance checklist

### Always

- [ ] Every field has a visible top label. No placeholder-only labels.
- [ ] Rules run on blur, and re-run on input only while the field is in error.
- [ ] Each error line has an icon and text, and names what to type.
- [ ] Failed submit shows a summary with one link per bad field and focuses the first bad field.
- [ ] Inputs carry the correct `type`, `inputmode` and `autocomplete`.
- [ ] The save button is fixed with at least 34px under it and is never disabled.
- [ ] Every touch target is at least 44px tall.
- [ ] Focus is visible on every control. Fields show an ink border plus a 3px accent ring.
- [ ] Radii are 2px everywhere. No pill shapes.
- [ ] Reduced motion removes every animation and transition.

### This demo

- [ ] The title reads "Book a collection" in 34px Barlow Condensed caps.
- [ ] Mobile starts in error with "Enter 10 digits after +44. You typed 6."
- [ ] The segmented control reads Mini £89, Midi £119, Mega £149, with Midi selected and yellow.
- [ ] The note counter starts at 38/140 and turns red at 120.
- [ ] Save reads "Save booking" and "Wed 7 Oct · £119", and turns into "Booked" on success.
- [ ] The hazard stripe is 6px of 10px yellow and ink diagonal bands.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The first frame shows the whole form filled in except Street. Mobile is already in the error state, as if the user left it. It shows `7700 90` and the message "Enter 10 digits after +44. You typed 6."
2. Contact name, Postcode and Collection day show a green tick on the right. Their border is the darker `--ink-2`.
3. A 6px hazard stripe runs across the top of the page, under the 54px top clearance.
4. Above the title sits an eyebrow: "Kerbstone · Collection" on the left, and the booking code `KS-40817` in mono on the right.
5. The title reads "Book a collection" in 34px condensed caps. A 12px mono line under it reads "Skip bag pickup. Driver needs a clear 3 m kerb."
6. Focus on any field turns its border to ink and adds a 3px yellow ring outside it.
7. Leaving a field (blur) runs its rule. A failing field gets a red border, a pale red fill, `aria-invalid="true"` and an error line with a triangle icon.
8. While a field is in error, each keystroke re-runs the rule. The error clears the moment the value passes. A field that is not in error does not nag while typing.
9. Changing the country code re-checks Mobile if it has a value. The message names the new code.
10. Leaving Postcode upper-cases it and collapses spaces. `yo1  6jr` becomes `YO1 6JR`.
11. The collection day rejects dates before Mon 5 Oct and any Sunday. The native picker is limited by `min` and `max`.
12. Bag size is a three-cell segmented control: Mini £89, Midi £119, Mega £149. Midi starts selected. The selected cell fills yellow.
13. The note counter reads `38/140` at the start. It turns red at 120 and above. The textarea stops at 140 with `maxlength`.
14. The switch "Text me on the way" starts on. Tapping it flips `aria-checked`. The knob slides 24px.
15. The Save button shows "Save booking" on the left and "Wed 7 Oct · £119" in mono on the right. Changing the day or the size updates that text at once.
16. Pressing Save with errors runs every rule. A summary box appears above the form: "Fix 2 fields", then one link per bad field. Focus moves to the first bad field in page order, not to the summary.
17. Each summary link moves focus to its field.
18. Pressing Save with no errors hides the summary, turns the button ink with yellow text and a tick, and reads "Booked". A polite live region says "Booking saved for Wed 7 Oct · £119".
19. Editing any field after "Booked" returns the button to "Save booking".

## Tokens

```css
:root {
  --bg: #d3d1cb;          /* concrete page */
  --surface: #e4e2dd;     /* dock */
  --field: #f0efeb;       /* input fill */
  --ink: #1a1a18;         /* text, strong border */
  --ink-2: #45443f;       /* secondary text, valid border */
  --ink-3: #55534d;       /* hints, counter */
  --line: #a8a59d;        /* resting border */
  --accent: #ffd400;      /* safety yellow */
  --accent-ink: #1a1a18;
  --error: #a3200f;
  --error-bg: #f4dcd4;
  --ok: #2f5d2a;          /* tick */
  --cond: "Barlow Condensed", "Arial Narrow", sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;
  --r: 2px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px;
  --field-h: 48px;
  --ring: 0 0 0 3px var(--accent);
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --fast: 140ms;
  --mid: 240ms;
}
```

The page carries a fine grain: two dot grids, `rgba(26,26,24,.07)` at 5px and `rgba(255,255,255,.18)` at 7px, offset by 2px 3px. Keep it under 8% so it reads as concrete, not noise.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Title | Barlow Condensed | 34px | 700 | 0.95 | 0.01em | caps |
| Eyebrow | Barlow Condensed | 13px | 600 | 1 | 0.12em | caps |
| Field label | Barlow Condensed | 13px | 600 | 1 | 0.12em | caps |
| Label hint | JetBrains Mono | 11px | 500 | 1 | 0 | sentence |
| Value | JetBrains Mono | 15px | 400 | 1.4 | 0 | as typed |
| Error | JetBrains Mono | 12px | 400 | 1.35 | 0 | sentence |
| Segment name | Barlow Condensed | 16px | 700 | 1 | 0.06em | caps |
| Segment price | JetBrains Mono | 10px | 400 | 1 | 0 | as is |
| Save label | Barlow Condensed | 19px | 700 | 1 | 0.1em | caps |
| Save meta | JetBrains Mono | 12px | 500 | 1 | 0 | sentence |

Values are 15px or more so iOS does not zoom on focus. Never set an input under 16px on a product that has to support older iOS Safari. In this demo 15px is fine because the frame is an app shell.

## Implementation notes

The rule table keeps every message in one place. Each rule returns an empty string when the value passes:

```js
const rules = {
  tel: v => {
    const d = v.replace(/\D/g, '');
    if (!d) return 'Enter a mobile number.';
    if (d.length !== 10) return `Enter 10 digits after ${cc.value}. You typed ${d.length}.`;
    return '';
  },
  post: v => !v.trim() ? 'Enter a postcode.'
    : !/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(v.trim()) ? 'Use a full postcode, like YO1 6JR.' : '',
};
function check(key) {
  const input = document.getElementById(key), g = input.closest('.group');
  const msg = rules[key](input.value);
  g.classList.toggle('invalid', !!msg);
  g.classList.toggle('valid', !msg && !!input.value.trim());
  input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  g.querySelector('.err span').textContent = msg;
  return msg;
}
```

Wire blur and a guarded input listener. This is "reward early, punish late":

```js
for (const k of Object.keys(rules)) {
  const el = document.getElementById(k);
  el.addEventListener('blur', () => check(k));
  el.addEventListener('input', () => {
    if (el.closest('.group').classList.contains('invalid')) check(k);
  });
}
```

On submit, check everything, build the summary, then focus the first bad field:

```js
form.addEventListener('submit', e => {
  e.preventDefault();
  const bad = Object.keys(rules).filter(k => check(k));
  if (!bad.length) return save();
  title.textContent = bad.length === 1 ? 'Fix 1 field' : `Fix ${bad.length} fields`;
  list.replaceChildren(...bad.map(linkFor));
  summary.classList.remove('show'); void summary.offsetWidth; summary.classList.add('show');
  document.getElementById(bad[0]).focus();
});
```

The focus ring needs two layers, because yellow on concrete is low contrast:

```css
.box { border: 2px solid var(--line); border-radius: 2px; background: var(--field); }
.box:focus-within { border-color: var(--ink); box-shadow: 0 0 0 3px var(--accent); }
.box input { border: 0; outline: none; background: transparent; padding: 12px; }
```

The segmented control is three radios. Style the label with `:has(input:checked)`. Keep the input in the label at full size and `opacity: 0`, so a tap anywhere in the cell selects it.

Common mistakes:

- Validating on every keystroke from the first character. The user sees red before they finish typing.
- Disabling Save until the form is valid. The user cannot find out why.
- Focusing the summary instead of the field. The user then has to tab to the field.
- Errors in red text with no icon and no `aria-describedby`.
- Placeholder used as the label. It vanishes on the first keystroke.
- `type="number"` for phone or postcode. It strips leading zeros and adds spinners.
- A 12px input. iOS zooms the page on focus.
- Rounded 12px fields. This family is 2px.
- Using the yellow for text on concrete. Yellow is a fill only.
- A shadow under the dock. The 2px ink rule is the separation.

Where it sits:

1. It is one screen in a booking flow. Payment is the next screen, built from `mobile-one-page-checkout` restyled to this family.
2. The size choice uses this hard segmented control. The sliding pill in `segmented-control-sliding` belongs to softer families.
3. Settings screens in the same app use `ios-grouped-settings` rows with 2px radii and these tokens.
4. For a long form, split it with `multi-step-form-stepper` and keep this field anatomy.

Rebuild order:

1. Set the page padding, grain, hazard stripe and title.
2. Build one field: label, box, input, tick, error line.
3. Copy it for each field and set the right attributes.
4. Add the phone box with the code select.
5. Add the segmented control, the counted note and the switch.
6. Fix the dock with 34px under the button.
7. Write the rule table, then blur and input wiring.
8. Write submit with the summary and first-error focus.
9. Test with a screen reader: each error is read once, with its field.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
