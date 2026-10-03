<!-- Design Lounge Nº 416 · "Three-step phone sign-up" · designlounge.vercel.app -->

# Three-step phone sign-up

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. This is the Soft family: 14px radii on fields and chips, pill buttons. The motion language is Material 3 Expressive.

## What it is

The sign-up flow of Sprig, a fictional app for home growers. It is three steps in one screen. Step 1 asks for a name and an email. Step 2 asks for a password and ticks off four rules as you type. Step 3 asks you to pick at least three things you grow, as chips. A segmented bar at the top shows the step. Back and Continue sit in a fixed bar at the bottom. Steps slide sideways in 420ms. The colours are warm cream, a deep garden green and a soft green tonal fill. Nunito carries everything, at 800 for headings and 600 for inputs. The detail worth copying is the rules list. Each rule's circle fills green and draws a tick the moment the password meets it, so the user never guesses what is wrong.

## Reference behaviour

1. First frame: step 1. Segment 1 is green, segments 2 and 3 are track colour. The label reads "Step 1 of 3 · About you". The heading reads "Let's get you growing". Name is prefilled "Mina Gurung". Email is prefilled "mina.gurung@fernpost.org". Back is shown at 45% opacity and is disabled. Continue is a green pill.
2. Clear the name and tap Continue. The error "Tell us your name." shows under it in `--danger`. The field border turns `--danger`. Focus moves to the name field.
3. Type a bad email and tap Continue. The error reads "Enter an email like name@example.com." An empty email reads "Enter your email address."
4. While an error shows, typing re-checks the field. The error clears as soon as the value is valid.
5. Tap Continue with valid fields. The track slides left by one step in 420ms. Segment 2 fills left to right in 320ms. The label becomes "Step 2 of 3 · Password". Back becomes active. Focus moves to the new heading after 200ms.
6. Step 2 heading: "Make a password". Four rules are listed: "At least 10 characters", "One number", "One capital letter", "Not your name or email". Each starts with an empty 22px circle.
7. Type in the password. Each rule that passes fills its circle green, scales it to 1.08, and draws a white tick in 320ms. A rule that stops passing reverses. The line under the list reads "N of 4 rules met".
8. "Not your name or email" fails if the password contains the first name or the email's local part, when either is longer than 2 characters. It also fails while the field is empty.
9. Tap Continue with fewer than 4 rules met. The error reads "Meet all four rules to continue." Focus moves to the password.
10. The eye button shows and hides the password. Its label flips between "Show password" and "Hide password".
11. Step 3 heading: "What do you grow?". Ten chips: Herbs, Tomatoes, Balcony pots, Composting, Seed saving, Houseplants, Native flowers, Fruit trees, Mushrooms, Chillies. Herbs and Tomatoes start picked.
12. Tap a chip to toggle it. A picked chip fills green, swaps its plus icon for a tick, and its radius grows from 14px to 22px in 320ms. The tally reads "2 of 3 picked. 1 more to go." or "3 picked. Good start."
13. On step 3, Continue reads "Create account". With fewer than 3 picked, the error reads "Pick at least 3 to continue."
14. With 3 or more picked, Create account shows a spinner and the label "Creating account" for 1300ms, then "Welcome, Mina" for 2200ms. Then the demo clears the password and slides back to step 1.
15. Back slides one step right. Picked chips and typed values stay.
16. Enter in any input acts as Continue.

## Structure

```
390 x 844
+--------------------------------------+
| 54px top clearance                   |
| (leaf) Sprig                         | 18px / 800, green
| [======][------][------]             | 3 segments, 6px tall, 6px gap
| Step 1 of 3 · About you              | 13px / 700
|--------------------------------------|
| sliding viewport, flex 1             |
| Let's get you growing                | 32px / 800
| Your plot, your seed swaps and ...   | 16px, 30ch
|                                      |
| Your name                            | 14px / 700 label
| [ Mina Gurung                      ] | 56px, 14px radius
| Email                                |
| [ mina.gurung@fernpost.org         ] |
|--------------------------------------| 1px --line
| [ < Back ]  [ Continue          -> ] | 56px pills, 12px gap
| 34px bottom clearance                |
+--------------------------------------+
```

- `header.top` holds the brand row, the progress bar and the step label.
- The progress bar is a `div` with `role="progressbar"`, `aria-valuemin="1"`, `aria-valuemax="3"`, `aria-valuenow` and `aria-valuetext`.
- `main.view` is `overflow: hidden`. Inside it, a `form.track` is 300% wide and holds three `section.step`, each one third wide.
- Each step has one `h1` with `tabindex="-1"`, so focus can land on it.
- Off-screen steps carry the `inert` attribute.
- The rules are a `ul` with `aria-label="Password rules"`. Each `li` has a visually hidden ", met" or ", not met".
- The chips are buttons with `aria-pressed`, inside a `div role="group"` labelled by the step heading.
- `nav.bar` holds Back and Continue. It is outside the sliding track, so it never moves.
- A hidden `role="status"` paragraph speaks the account result.

## Tokens

```css
:root {
  /* colour */
  --bg: #f6f0e3;            /* cream page */
  --surface: #fffbf2;       /* fields, chips, rules card */
  --ink: #1e2a22;           /* headings, input text */
  --ink-2: #4a5a4f;         /* lede, labels of quiet text */
  --ink-3: #6e7a70;         /* rare muted text */
  --line: #e2d8c3;          /* field borders, bar rule */
  --primary: #1f4d3a;       /* deep green: Continue, filled segments, picked chips, ticks */
  --on-primary: #fffbf2;
  --primary-soft: #dce8d9;  /* tonal: Back button, focus halo */
  --track: #e8dfcc;         /* empty segments */
  --danger: #a63d2a;        /* errors */

  /* type */
  --sans: "Nunito", system-ui, sans-serif;

  /* shape */
  --radius: 14px;
  --pill: 999px;
  --control: 56px;
  --hit: 44px;

  /* space: 4px base */
  --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px; --s-6: 24px;

  /* motion: M3 Expressive */
  --emph: cubic-bezier(0.2, 0, 0, 1);
  --decel: cubic-bezier(0.05, 0.7, 0.1, 1);
  --fast: 160ms;
  --mid: 320ms;
  --slide: 420ms;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Brand | Nunito | 18px | 800 | 1 | -0.01em |
| Step label | Nunito | 13px | 700 | 1.45 | 0.02em |
| Heading | Nunito | 32px | 800 | 1.08 | -0.02em |
| Lede | Nunito | 16px | 400 | 1.45 | 0 |
| Field label | Nunito | 14px | 700 | 1.45 | 0 |
| Input | Nunito | 17px | 600 | 56px box | 0 |
| Rule item | Nunito | 15px | 600 | 1.45 | 0 |
| Chip | Nunito | 15px | 700 | 1 | 0 |
| Buttons | Nunito | 17px | 800 | 1 | 0 |
| Error | Nunito | 14px | 600 | 1.45 | 0 |

- One family, used at 400, 600, 700 and 800. Do not add a second face.
- Headings are sentence case. Never caps.
- At 360 wide, the heading drops to 28px.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Step track | Continue or Back | translateX | -33.33% × old → × new | 420ms | `--emph` | no slide; new step fades in 120ms |
| Progress segment | step change | width of inner fill | 0 → 100%, or back | 320ms | `--emph` | 1ms |
| Rule circle | rule passes | background, border, scale | line → green, 1 → 1.08 | 320ms | `--decel` | 1ms |
| Rule tick | rule passes | stroke-dashoffset | 20 → 0 | 320ms, 60ms delay | `--decel` | 1ms |
| Chip | toggle | background, border, radius | surface → green, 14px → 22px | 160ms colour, 320ms radius | `--emph`, `--decel` | 1ms |
| Field focus | focus | border, box-shadow | line → green, 0 → 3px soft halo | 160ms | `--emph` | same |
| Button press | active | scale | 1 → 0.97 | 160ms | `--emph` | same |
| Spinner | creating | rotate | 0 → 1turn | 700ms loop | linear | 1.6s loop |

- The slide moves the whole track. Steps do not fade while sliding.
- Focus moves to the new heading 200ms after the slide starts, so the screen reader hears the new step while it lands.

## States

- Field resting: `--surface`, 1.5px `--line` border, 14px radius, 56px tall.
- Field focus: border `--primary`, 3px `--primary-soft` halo.
- Field error: border `--danger`, error text under it, `aria-invalid="true"`.
- Rule not met: empty circle with a 2px `--line` border, text `--ink-2`, hidden text ", not met".
- Rule met: green circle, white tick, text `--ink`, hidden text ", met".
- Chip resting: `--surface`, 1.5px `--line` border, plus icon, 44px tall. Hover border `--primary`.
- Chip picked: `--primary` fill, `--on-primary` text, tick icon, radius 22px, `aria-pressed="true"`.
- Segment empty: `--track`. Segment done or current: `--primary`.
- Back on step 1: `disabled`, opacity 0.45, no press scale.
- Back active: `--primary-soft` fill, `--primary` text, 112px wide.
- Continue: `--primary` fill, flex 1, arrow on the right. Hover `#18402f`. Label "Create account" on step 3.
- Continue busy: arrow swaps for a 20px ring spinner, `aria-busy="true"`, taps ignored.
- Continue done: label "Welcome, Mina".
- Focus-visible: 3px `--primary` outline, 3px offset.

## Accessibility

- Each step has one `h1`. Focus moves to it after every step change.
- Off-screen steps are `inert`, so Tab never reaches a hidden field.
- The progress bar has `aria-valuetext="Step 2 of 3, Password"`. The visible label repeats it.
- Inputs have visible `label` elements. Each has `aria-describedby` pointing at its error. The password also points at the rules list.
- Autocomplete: `name`, `email`, and `new-password`.
- Errors are `aria-live="polite"`. On a failed Continue, focus the first bad field.
- Rules use hidden ", met" and ", not met" text, so the state is not colour only. The "N of 4 rules met" line is a polite live region.
- Chips are `button` elements with `aria-pressed`. The tally is linked by `aria-describedby` on the group and is a polite live region.
- Keyboard: Tab moves through fields, chips, Back, Continue. Enter in an input acts as Continue. Space or Enter toggles a chip.
- Contrast: `#1e2a22` on `#f6f0e3` is about 13:1. `#4a5a4f` on `#f6f0e3` is about 6.5:1. `#fffbf2` on `#1f4d3a` is about 9.3:1. `#a63d2a` on `#f6f0e3` is about 5.6:1. `#1f4d3a` on `#dce8d9` is about 7.5:1.
- Hit targets: buttons 56px tall, chips 44px tall, eye 44×44.

## Responsive rules

- The frame is 390×844. Top padding is max(54px, env(safe-area-inset-top)). The bar's bottom padding is max(34px, env(safe-area-inset-bottom)).
- At 360 wide: heading 28px, Back 96px wide. Chips wrap to more rows.
- If a step is taller than the viewport, that step scrolls on its own. The bar stays fixed.
- When the keyboard opens, keep the bar above it. Do not hide Back and Continue.
- At tablet width, centre a 440px column. Keep the slide inside that column only.
- Do not draw a status bar.

## Acceptance checklist

### Always

- [ ] Three steps, one screen. The track slides sideways. Back and Continue never move.
- [ ] A segmented bar with one segment per step. Done and current segments are filled.
- [ ] Off-screen steps are `inert`. Focus lands on the new step's heading.
- [ ] Continue validates the current step. It is never disabled. Errors use `aria-describedby` and `aria-invalid`.
- [ ] Password rules tick live as the user types, with text state for screen readers.
- [ ] Chips are toggle buttons with `aria-pressed`. A minimum count is stated and checked.
- [ ] The last step's button names the outcome, then shows busy and done states.
- [ ] Back is disabled on step 1 and keeps typed values when used.
- [ ] Every hit target is 44px or more. Buttons are 56px pills.
- [ ] Reduced motion swaps the slide for a 120ms fade.

### This demo

- [ ] Brand row reads "Sprig" in `#1f4d3a`.
- [ ] Step 1 heading "Let's get you growing", prefilled "Mina Gurung" and "mina.gurung@fernpost.org".
- [ ] The four rules read "At least 10 characters", "One number", "One capital letter", "Not your name or email".
- [ ] Ten chips, with Herbs and Tomatoes picked at start. The tally reads "2 of 3 picked. 1 more to go."
- [ ] Step 3 button reads "Create account", then "Creating account", then "Welcome, Mina".
- [ ] Slide is 420ms `cubic-bezier(0.2, 0, 0, 1)`.

## Implementation notes

**Slide the track, not the steps.** One transform on a 300% wide row is cheaper and never desyncs. Mark the hidden steps `inert`.

```css
.view { flex: 1; overflow: hidden; }
.track { display: flex; width: 300%; height: 100%; transition: transform 420ms var(--emph); }
.step { width: calc(100% / 3); padding: 20px 24px 16px; overflow-y: auto; }
@media (prefers-reduced-motion: reduce) { .track { transition: none; } .step { transition: opacity 120ms linear; } }
```

```js
function go(n) {
  i = n;
  track.style.transform = `translateX(${-100 / 3 * i}%)`;
  steps.forEach((s, k) => s.inert = k !== i);
  segs.forEach((s, k) => s.classList.toggle('on', k <= i));
  back.disabled = i === 0;
  label.textContent = i === 2 ? 'Create account' : 'Continue';
  setTimeout(() => steps[i].querySelector('h1').focus({ preventScroll: true }), 200);
}
```

**Rules from one function.** Compute every rule on each input and write both the class and the hidden text.

```js
function rules() {
  const v = pw.value, low = v.toLowerCase();
  const first = nameI.value.trim().split(/\s+/)[0].toLowerCase();
  const local = emailI.value.split('@')[0].toLowerCase();
  const r = {
    len: v.length >= 10, num: /\d/.test(v), up: /[A-Z]/.test(v),
    own: v.length > 0 && !(first.length > 2 && low.includes(first)) && !(local.length > 2 && low.includes(local)),
  };
  let n = 0;
  list.querySelectorAll('li').forEach(li => {
    const ok = r[li.dataset.r]; n += ok;
    li.classList.toggle('ok', ok);
    li.querySelector('.st').textContent = ok ? ', met' : ', not met';
  });
  meter.textContent = `${n} of 4 rules met`;
  return n === 4;
}
```

**The chip shape change is the M3 touch.** Picked chips round from 14px to 22px. Keep the height fixed at 44px so rows do not reflow.

```css
.chip { min-height: 44px; border-radius: 14px; transition: background-color 160ms var(--emph), border-radius 320ms var(--decel); }
.chip[aria-pressed="true"] { background: var(--primary); color: var(--on-primary); border-radius: 22px; }
```

Common mistakes:

- Leaving off-screen steps focusable. Tab then jumps into a hidden field.
- Disabling Continue until valid. The user cannot learn what is missing.
- A strength meter bar instead of named rules. This piece names each rule.
- Moving the bottom bar with the track.
- Animating `left` or `margin` instead of `transform`.
- Dots for progress. This piece uses segments, one per step.
- A second accent colour for picked chips. Picked is the same green.
- Resetting typed values when Back is pressed.
- Chips at 32px tall. They are 44px.

Where it sits:

1. New users arrive here from "Create an account" on `phone-sign-in`.
2. After "Create account", show the first home, or set up a passkey with `auth-passkey-setup` restyled to Soft.
3. If the product wants a tour before sign up, `ios-onboarding-carousel` comes first. Do not put the carousel inside these steps.
4. On web, the wider stepper is `multi-step-form-stepper`.

Rebuild order:

1. Lay out the header, the sliding viewport and the fixed bar.
2. Build the progress segments and the step label.
3. Build step 1 fields and errors.
4. Build step 2 with the eye toggle and the rules list.
5. Build step 3 chips and the tally.
6. Wire `go()`, inert, focus and the progress values.
7. Wire validation per step and the busy and done states.
8. Test with reduced motion and with Tab only.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
