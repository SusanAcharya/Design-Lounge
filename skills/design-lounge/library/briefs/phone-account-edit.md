<!-- Design Lounge Nº 487 · "Edit profile with live username check" · www.designlounge.live -->

# Edit profile with live username check

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The edit-profile screen of Wrenfold, an invented reading-journal app, built in an iOS 26-ish language: a translucent nav bar, grouped inset rows on warm oat paper, and action sheets that rise from the bottom. The user can change their photo, name, username, and bio, and sees that their email is still unverified. The detail worth copying is the honesty of the Save button. It stays a grey pill until something has actually changed *and* every field is valid. If you edit the username and then type it back, Save goes grey again. Leaving with unsaved edits asks first.

## Structure

```
390 x 844
+--------------------------------------------+  fixed, glass, padding-top 54px
| < Account      Edit profile       (Save)   |  44px row
+--------------------------------------------+
|                 ( MO )   104px avatar       |  main padding-top 54+44+20
|              Mira Okafor   Young Serif 24   |
|              @mira.okafor  14px             |
|              Change photo  44px link        |
| PROFILE                                     |  13px caps label
| +----------------------------------------+ |  group, radius 14
| | Name      Mira Okafor                  | |  row min 52px
| | Username  @ mira.okafor            [v] | |
| | Bio       Reading my way through...    | |
| |                                 76/150 | |
| +----------------------------------------+ |
| wrenfold.app/@mira.okafor is your ...      |  live note 13px
| ACCOUNT                                     |
| +----------------------------------------+ |
| | Email     mira@okafor.studio           | |
| |           [! Unverified]  Resend link  | |
| | Password           Changed in July  >  | |
| +----------------------------------------+ |
| We send reading reminders and receipts ... |
+--------------------------------------------+  padding-bottom 34+24
```

- `header.nav` holds the back `button`, an `h1` "Edit profile", and the Save `button` with `aria-disabled`, not `disabled`, so it stays focusable and announces why it is off.
- `main` holds the photo `section`, then two `div role="group"` blocks, each labelled by an `h2` group label.
- Each row is a flex row with a 92px label column and a field that flex-wraps underneath at large text sizes.
- The username note is a `p` with `aria-live="polite"` and is the field's `aria-describedby`.
- The two sheets are `role="dialog"` (photo) and `role="alertdialog"` (discard), both `aria-modal="true"`, over a `.scrim`.
- The toast is `role="status"`.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Save pill | becomes enabled | background, colour | `--fill` → `--accent` | 160ms | `--ease` | instant |
| Save press | :active | transform | 1 → 0.95 | 160ms | `--ease` | instant |
| Save busy | tap | spinner rotate | 0 → 360deg loop | 800ms | linear | static ring |
| Username check | resolving | spinner rotate | loop | 800ms | linear | static ring |
| Scrim | sheet open | opacity | 0 → 1 | 320ms | `--ease` | instant |
| Action sheet | open / close | translateY | 100% + 60px → 0 | 320ms | `--sheet` | instant |
| Avatar | photo changed | scale | 0.86 → 1 | 320ms | `--sheet` | none |
| Toast | message | translateY, opacity | 20px, 0 → 0, 1 | 320ms / 160ms | `--sheet` | instant, still shown 2.4s |
| Resend countdown | after send | text | 30s → 1s | 1s steps | n/a | unchanged |

The rule is `*{transition-duration:1ms!important;animation-duration:1ms!important}` inside `prefers-reduced-motion: reduce`, and the spinners stop rotating and become a static ring.

## States

- **Save disabled:** `--fill` background, `--ink-3` text, `aria-disabled="true"`, label "Save, nothing changed" or "Save, fix the highlighted field first".
- **Save enabled:** `--accent` background, `--on-accent` text, hover `--accent-press`, press scale 0.95.
- **Save busy:** the text goes transparent and a 16px ring spins in its place. A second tap is ignored.
- **Field focus:** 2px `--accent` underline across the field (inset box-shadow), no box.
- **Field invalid:** 2px `--err` underline. The name placeholder "Required" is red.
- **Username:** `same` (no icon), `checking` (spinner), `available` (green check, green note), `taken` (red cross, red note, suggestion button), `bad` (red cross, rule in the note).
- **Bio counter:** neutral up to 139, amber 140 to 150, red and 600 weight above 150.
- **Email:** unverified pill always. Resend has three states: "Resend link", "Sending..." (disabled), "Resend in Ns" (disabled, tabular nums).
- **Focus-visible:** 2px `--accent` outline, offset 2px, radius 6px, on every button.
- **Empty:** not applicable. A new account with no bio shows "0/150" and an empty textarea.
- **Error saving:** not simulated. In production keep the edits, re-enable Save, and put "Couldn't save. Check your connection and try again." in the toast.

## Accessibility

- The Save button uses `aria-disabled` and an `aria-label` that explains why it is off. Do not use the `disabled` attribute, which removes it from the tab order.
- Username status is announced through the polite live note (`aria-describedby` on the input). The icon next to the field is `aria-hidden`.
- The bio counter is a polite live region with an `aria-label` of "N characters left" or "N characters over the limit".
- Sheets: opening moves focus to the first option. Tab and Shift+Tab are trapped inside. Escape closes and returns focus to the button that opened it.
- The discard sheet is `role="alertdialog"` with `aria-labelledby` (title) and `aria-describedby` (line).
- The avatar is `role="img"` with "Initials MO, no photo" or "New profile photo".
- Every hit target is at least 44px: back 44px tall, Save 36px visible with a `::before` that extends the hit area to 44px, "Change photo" 44px, Resend 44px, sheet options 56px.
- Contrast: `#1f1d1a` on `#fbf9f4` is 16.0:1. `#6b655b` on `#fbf9f4` is 5.5:1 (4.9:1 on the `#efebe3` page). `#8a5200` on `#f4e6cc` is 5.2:1. `#1f5c4a` on `#efebe3` is 6.6:1. `#b3261e` on `#fbf9f4` is 6.2:1. `#2c7346` on `#efebe3` is 4.8:1.
- Focus order: back, Save, Change photo, Name, Username, (suggestion), Bio, Resend, Password.

## Responsive rules

- Designed at 390×844. The page scrolls under the fixed glass nav. Padding top is `--top + 44px + 20px`, padding bottom is `--bottom + 24px`.
- At 360 wide the 92px label column stays and fields shrink. The email address wraps with `word-break: break-all` rather than overflowing.
- **Largest text size:** rows grow vertically, never clip. Each row is `flex-wrap: wrap` with the field at `flex: 1 1 180px`, so when the label and the field no longer fit side by side the field drops under the label and the two-column row stacks. The username note and the counter wrap onto more lines. The nav title may truncate. The back label and Save never do.
- Tablet: present this as a sheet or a centred column of max 560px. Do not stretch rows to 1180px.
- Do not draw the status bar or home indicator. `--top` and `--bottom` are the clearance.

## Acceptance checklist

### Always

- [ ] Save is enabled only when something changed and every field is valid. Reverting an edit by hand disables it again.
- [ ] Save uses `aria-disabled`, stays focusable, and its label says why it is off.
- [ ] Username shows four distinct states: checking (spinner), available (green check), taken (red cross with a suggestion), and invalid (rule text).
- [ ] Stale availability responses are ignored, so only the latest request updates the UI.
- [ ] Bio counter shows `n/max`, warns 10 characters before the limit, and blocks Save when over.
- [ ] Unverified email shows a pill and a Resend control with a visible cooldown.
- [ ] Leaving with unsaved changes opens a confirm sheet with a destructive Discard and a bold Keep editing.
- [ ] Sheets trap focus, close on Escape and scrim tap, and restore focus.
- [ ] Every target is at least 44px. Inputs are 16px.
- [ ] Reduced motion removes the sheet slide, avatar pop, and spinner rotation.

### This demo

- [ ] Saved values: "Mira Okafor", "mira.okafor", 76 character bio, "mira@okafor.studio".
- [ ] Typing "mira.reads" shows "Checking @mira.reads..." then "@mira.reads is taken. Use @mira.books" after 950ms.
- [ ] Typing "mira.reads2" ends in "@mira.reads2 is available." and enables Save.
- [ ] Resend reads "Sending..." for 700ms, then counts "Resend in 30s" down to 1s.
- [ ] Save shows a spinner for 900ms, then the toast "Profile saved".
- [ ] Oat `#efebe3` page, `#fbf9f4` groups, bottle green `#1f5c4a` accent, Young Serif only on the avatar and preview name.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. **Initial state.** The fields hold the saved values: name "Mira Okafor", username "mira.okafor", bio of 76 characters ("Reading my way through every Booker shortlist since 1990. Currently on 2004."). Save is a grey pill with `aria-disabled="true"`. Under the avatar, a preview shows the name in Young Serif 24px and "@mira.okafor".
2. **Live preview.** Typing in Name or Username updates the preview under the avatar on every keystroke. An empty name previews as "Your name".
3. **Username input.** Input is lowercased and spaces are removed as you type. Max 20 characters (`maxlength`).
   - Equal to the saved value: no icon. Note reads "wrenfold.app/@mira.okafor is your profile link." State `same`.
   - Under 3 characters: red cross, note "Usernames need at least 3 characters." State `bad`.
   - Contains anything other than `a-z 0-9 . _`: red cross, note "Use letters, numbers, full stops and underscores only." State `bad`.
   - Otherwise: a 16px spinner and "Checking @name...". After 950ms (450ms debounce plus 500ms simulated request) it resolves. Only the latest request applies, so a stale response never overwrites a newer one.
   - **Taken** (`mira`, `miraokafor`, `mira.reads`, `mira_o`, `reader`, `wren`, `okafor`, `booker`): red cross, note "@mira.reads is taken." plus a text button "Use @mira.books". The suggestion strips the last `.segment` or `_segment` and tries `.reads`, then `.books`, then `_04`, skipping any taken value. Tapping it fills the field and re-runs the check.
   - **Available**: green check, note in green "@mira.reads2 is available."
4. **Bio.** The counter reads `n/150` under the textarea, right-aligned. From 140 it turns amber `--warn`. Over 150 it turns red and semibold, and Save is blocked. Typing past 150 is allowed so the user can see the overage and trim it.
5. **Name.** If the name is empty, the field gets a 2px red underline, the placeholder "Required" shows in red, and Save is blocked.
6. **Save rule.** Save is enabled only when `dirty && valid`. Dirty means the trimmed name, username, bio, or photo differs from the saved baseline. Valid means the name is not empty, the username state is `same` or `available`, and the bio is 150 characters or fewer. While a username check is in flight, Save stays disabled.
7. **Saving.** Tap Save. The label becomes a 16px spinner for 900ms. Then the baseline is replaced with the current values, Save goes grey, and a dark toast reads "Profile saved" for 2.4s.
8. **Change photo.** Tap "Change photo". An action sheet rises with "Take photo", "Choose from library", and a red "Remove photo", plus a separate "Cancel" card. Picking a photo option swaps the initials for a photo (here a CSS-drawn portrait) with a 320ms scale pop from 0.86. "Remove photo" brings the initials back. Either one counts as a change.
9. **Email.** The row shows "mira@okafor.studio", an amber "Unverified" pill, and a "Resend link" text button. Tap it. It reads "Sending..." for 700ms, then a toast says "Link sent to mira@okafor.studio" and the button counts down "Resend in 30s" ... "Resend in 1s" once per second, disabled, before returning to "Resend link". The pill stays Unverified until the user clicks the link in their mail.
10. **Leaving.** Tap "Account" (back). If clean, the screen goes back (the demo shows a toast "Back to Account"). If dirty, an action sheet asks "Discard changes?" with the line "Your edits to this profile have not been saved.", a red "Discard changes", and a bold "Keep editing" card. Discard restores every field, the photo, and the counter, then shows "Changes discarded". Keep editing, Escape, or tapping the scrim closes the sheet and returns focus to the back button.

## Tokens

```css
:root {
  --bg: #efebe3;            /* oat page */
  --surface: #fbf9f4;       /* grouped rows, sheets */
  --fill: #e6e0d5;          /* disabled Save pill */
  --ink: #1f1d1a;
  --ink-2: #4a463f;         /* row labels */
  --ink-3: #6b655b;         /* notes, counter, values */
  --line: #ddd6ca;          /* row separators, inset 16px */
  --accent: #1f5c4a;        /* bottle green: Save, links, focus */
  --accent-press: #17473a;
  --accent-soft: #dce8e1;   /* initials avatar */
  --on-accent: #f7f5ef;
  --ok: #2c7346;            /* available */
  --warn: #8a5200;          /* unverified, counter near limit */
  --warn-soft: #f4e6cc;
  --err: #b3261e;           /* taken, over limit, destructive options */
  --glass: rgba(239,235,227,.78);
  --serif: "Young Serif", Georgia, serif;
  --sans: "Rethink Sans", -apple-system, system-ui, sans-serif;
  --r-s: 10px; --r-m: 14px; --r-l: 22px; --pill: 999px;
  --ease: cubic-bezier(.2,.7,.2,1);
  --sheet: cubic-bezier(.32,.72,0,1);
  --micro: 160ms; --layout: 320ms;
  --top: max(54px, env(safe-area-inset-top));
  --bottom: max(34px, env(safe-area-inset-bottom));
}
```

Spacing is on a 4px base: 4, 6, 8, 12, 16, 20, 22, 24.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Nav title | Rethink Sans | 17px | 600 | 1.4 | -0.01em | Sentence |
| Back, Save | Rethink Sans | 17px / 16px | 500 / 600 | 1 | 0 | Sentence |
| Avatar initials | Young Serif | 38px | 400 | 1 | -0.02em | Upper |
| Preview name | Young Serif | 24px | 400 | 1.15 | -0.01em | As typed |
| Preview handle | Rethink Sans | 14px | 400 | 1.4 | 0 | Lower |
| Group label | Rethink Sans | 13px | 500 | 1.4 | 0.04em | Upper |
| Row label | Rethink Sans | 15px | 400 | 1.4 | 0 | Sentence |
| Field value | Rethink Sans | 16px | 400 | 1.45 | 0 | As typed |
| Note, counter | Rethink Sans | 13px | 400 | 1.4 | 0 | Sentence, tabular nums |
| Pill | Rethink Sans | 12px | 600 | 1 | 0 | Sentence |
| Sheet option | Rethink Sans | 18px | 400, Cancel 600 | 56px row | 0 | Sentence |

Inputs are 16px so iOS Safari does not zoom on focus. Only the avatar and the preview name use the serif.

## Implementation notes

**1. Dirty and valid are two separate questions.** Compare against a baseline object, not a "touched" flag, so typing a value back to the original counts as clean.

```js
let base = { name: name.value, user: user.value, bio: bio.value, photo: false };
const dirty = () => name.value.trim() !== base.name || user.value !== base.user
  || bio.value !== base.bio || photo !== base.photo;
const valid = () => name.value.trim() && (uState === 'same' || uState === 'ok')
  && bio.value.length <= 150;
function sync() {
  const on = dirty() && valid();
  save.setAttribute('aria-disabled', String(!on));
}
// after a successful save: base = { ...current values }; sync();
```

**2. Debounce and drop stale answers.** A sequence number is enough. Without it, a slow "taken" for `mira` can land after a fast "available" for `mira.reads2`.

```js
let seq = 0, timer;
function check() {
  clearTimeout(timer);
  const v = user.value = user.value.toLowerCase().replace(/\s/g, '');
  const my = ++seq;
  if (v === base.user) return setState('same');
  if (v.length < 3 || !/^[a-z0-9._]+$/.test(v)) return setState('bad');
  setState('checking');
  timer = setTimeout(async () => {
    const taken = await api.isTaken(v);
    if (my !== seq) return;
    setState(taken ? 'taken' : 'ok');
  }, 450);
}
```

**3. The large-text row.** Let the row wrap instead of fixing a grid. The 92px label column is a flex-basis, not a track.

```css
.row { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 12px; min-height: 52px; padding: 6px 16px; }
.row > label { flex: 0 0 92px; }
.field { flex: 1 1 180px; display: flex; align-items: center; min-height: 40px; }
.field:focus-within { box-shadow: inset 0 -2px 0 var(--accent); }
.row + .row::before { content: ""; position: absolute; top: 0; left: 16px; right: 0; border-top: 1px solid var(--line); }
```

Common mistakes:

- Enabling Save on the first `input` event and never disabling it again.
- Using `disabled` on Save, which hides it from screen readers and keyboard users.
- Hard-capping the bio with `maxlength`, which silently eats pasted text. Show the overage instead.
- Running the availability check on every keystroke with no debounce.
- Showing "available" for the user's current username. It is theirs, so say it is their link.
- A centred `alert()` for discard. iOS uses an action sheet anchored to the bottom.
- Making "Discard changes" the bold option. The safe choice, Keep editing, is bold.
- Drawing a status bar or a home indicator.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
