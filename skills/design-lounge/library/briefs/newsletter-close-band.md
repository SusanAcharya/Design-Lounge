<!-- Design Lounge Nº 319 · "Newsletter close" · www.designlounge.live -->

# Newsletter close

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, Join is the one solid button and the band colour is `--surface`. The mid-article fold is `newsletter-fold-inline`. This band closes the page.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The end of a note, then the ask. The note says "That is the evening." in 48px serif, with one sentence under it. The band is a full-width surface with a hairline on top. Inside the same 720px column: "The evening list", the promise of one Sunday letter, an email field, and Join. An empty or broken address shows "Use a full address." under the field and does not submit. A full address hides the form and the promise, and the line "You are on the evening list." takes their place. The band stays. It is not a toast, and it is not a fold in the middle of an essay.

## Structure

```
padding 64px, column max-width 720
That is the evening.         48px
The note ends here. The list, if you want it, is under this line.
band, full width, hairline top, padding 28px 64px
  column 720
    The evening list          28px
    One letter on Sunday...
    [ email ] [ Join ]        40px
    Use a full address.       hidden until invalid
    You are on the evening list.   hidden until valid
```

- The band is a `section` labelled Evening list.
- The field's accessible name is Email.
- The error uses an id the field points at with `aria-describedby`.

## Motion

None. Success replaces the form in one frame. Reduced motion has nothing to remove. Do not slide the band.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Bad submit | click | error, invalid field, focus returns |
| Good submit | click | form and promise hide, done line shows |
| Focus | keyboard | 2px ring |

## States

- Field resting: height 40px, padding 0 12px, radius 2px, 1px `--line-strong`, white fill.
- Field invalid: border `--danger`, error visible.
- Join: height 40px, padding 0 14px, fill `--primary`, text `--primary-ink`. The only solid.
- Error: 12px `--danger`, under the field, hidden until a bad submit.
- Done: 22px serif, hidden until a good submit. The band heading remains.
- Focus-visible: 2px outline, offset 2px.
- Do not add a second button. A person who does not want the letter does nothing. There is no dismiss on a band that is the end of the page.

## Accessibility

- The section name is Evening list.
- The field name is Email. The placeholder is not the label. `aria-label` supplies the name because the band title is the heading, not the field label. A product may use a visible label instead. Do not leave the field with only a placeholder.
- The error is tied with `aria-describedby` and `aria-invalid`.
- A bad submit returns focus to the field.
- Hit target: the field and Join are 40px. On a phone, at least 44px.
- Contrast: `#fffdf8` on `#3f5c4b` and `#9b2c2c` on `#f7f3ea` clear 4.5.
- The done line is in the page, so it is read where the form was. It does not need a toast.

## Responsive rules

- At 1280 the column is 720px. The band is full width. The words and the form sit in that column, padding 64px.
- Below 640 the form stacks. The field is full width. Join stays 40px tall and can be full width. The close title may step down to 36px and stays the largest type.
- Do not pin this band over the page while the person is still reading. It is the close, after the note. A sticky mobile bar is `cta-sticky-mobile-bar`.
- Another screen in the same pass uses the same 720px column for its text.

## Acceptance checklist

- [ ] The close title is "That is the evening." at 48px.
- [ ] The column is 720px. The band is full width with a hairline on top.
- [ ] The band title is The evening list. The promise names Sunday and says there is no second list.
- [ ] Join is the only solid button, `#3f5c4b` with `#fffdf8` text, 40px tall.
- [ ] An empty submit shows "Use a full address." and does not hide the form.
- [ ] `ada@press` is invalid. `ada@press.mail` succeeds.
- [ ] Success hides the form and the promise and shows "You are on the evening list."
- [ ] The error is under the field, not a toast.
- [ ] Focus ring is 2px, offset 2px.
- [ ] There is no name field, no checkbox, and no animation.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. The first frame shows the closing title, the lead, the band, the empty field, and Join.
2. Submit with an empty field, or a value that is not a full address, sets `aria-invalid`, shows the error, and moves focus to the field. Join still says Join.
3. A full address has one @ and a dot in the domain. `ada@press.mail` qualifies. `ada@press` does not.
4. A valid submit hides the form and the promise. The heading stays. The done line reads "You are on the evening list."
5. There is no second field, no name, and no checkbox.
6. There is no animation. Focus ring is 2px `--focus`, offset 2px.
7. The error is under the field. It is not a toast.

## Tokens

```css
:root {
  --bg: #f4efe6;
  --band: #f7f3ea;
  --ink: #241c16;
  --ink-2: #5c5148;
  --line: #ddd4c6;
  --line-strong: #c9bfb2;
  --primary: #3f5c4b;
  --primary-ink: #fffdf8;
  --danger: #9b2c2c;
  --focus: #3f5c4b;
  --serif: "Newsreader", Georgia, serif;
  --sans: "Public Sans", system-ui, sans-serif;
}
```

Join is the one solid button. Radius is 2px. The family replaces the radius and the 40px height. The band background becomes `--surface` when a theme is locked. Do not keep this cream on a dark theme.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Close title | serif | 48px | 500 | `--ink` |
| Lead | sans | 16px | 400 | `--ink-2` |
| Band title | serif | 28px | 500 | `--ink` |
| Promise | sans | 16px | 400 | `--ink-2` |
| Field | sans | 14px | 400 | `--ink` |
| Button | sans | 13px | 500 | `--primary-ink` |
| Error | sans | 12px | 400 | `--danger` |
| Done | serif | 22px | 500 | `--ink` |

The close title is the largest type. The band title steps down. The done line is smaller than the band title, because the ask has been answered. The lead measure is about 42 characters. The promise is about 46.

## Implementation notes

Test the address before hiding the form.

```js
const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
if (!ok) { email.focus(); return; }
form.hidden = true;
```

Hide with the `hidden` attribute.

Common mistakes:

- A fold in the middle of a paragraph. That is `newsletter-fold-inline`, and its sentence is "You're on the list." Do not reuse that sentence here.
- A footer of link columns with a small email jammed in. That is `footer-newsletter-split` when the footer is the piece. This band is the close of a note.
- Two solid buttons.
- A toast on success, so the person loses the confirmation when it vanishes.
- Accepting `ada@press` as a full address.
- A checkbox for a second list after the promise said there is not one.
- A gradient band.
- Pinning the band to the viewport on a long essay.

Where it sits in a product:

1. Put it after the last paragraph, once.
2. The mid-article version is the other newsletter piece. Do not stack both on one essay.
3. Join is the one primary on this view. The note above has no second button.
4. The column is the pass column, 720px.
5. Height and radius follow the family.
6. When a theme is locked, Join uses `--primary` and `--primary-ink`, and the band uses `--surface`.
7. The error uses `--danger`. Do not use the brand red as the error if the theme has a danger token.
8. One letter, one list. Do not add a frequency toggle.
9. The close title is the largest type on the view.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper, Newsreader, and Public Sans.
2. Place the close title and the lead in the 720px column.
3. Place the full-width band and the same column inside it.
4. Place the field and Join.
5. Wire a bad address to the error.
6. Wire a full address to the done line.
7. Map the button and the band onto the kit.

Copy you keep:

1. That is the evening.
2. The note ends here. The list, if you want it, is under this line.
3. The evening list.
4. One letter on Sunday. No second list, and no offer beside the letter.
5. Use a full address.
6. Join.
7. You are on the evening list.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
