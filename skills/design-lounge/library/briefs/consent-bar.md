<!-- Design Lounge Nº 194 · "Consent bar" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Consent bar

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, Accept is the one solid button and the bar is `--surface` with `--line`. This is a choice about a record. It is not a newsletter and not a sticky sale.

## What it is

A short page, the yard log for 3 October, and a bar fixed to the bottom. The bar says we keep one record of this visit and nothing is sold on from it. Decline is outline. Accept is the one solid primary. Accept hides the bar and the page says "Record kept." Decline hides the bar and the page says "No record kept." The page above is still readable. The body has 120px of padding at the bottom so the bar does not cover the log. There is no second list, no checkbox, and no wall that blocks the log until a choice.

## Reference behaviour

1. The log is visible: the kicker 3 October, the title The yard log, and one sentence about Gate 4.
2. The bar is fixed to the bottom, full width, with the sentence and the two buttons.
3. Accept hides the bar and writes "Record kept."
4. Decline hides the bar and writes "No record kept."
5. After either choice the buttons are gone. The choice is not asked again on this view.
6. There is no animation.
7. Focus ring is 2px `--focus`, offset 3px.

## Structure

```
padding 48px 64px 120px
column 720
  3 October                  12px
  The yard log               40px
  Gate 4 took the rice...
  status                     empty until a choice
bar, fixed, full width, padding 16px 64px, hairline top
  We keep one record of this visit. Nothing is sold on from it.
  [ Decline ] [ Accept ]
```

- The bar is a region labelled Visit record.
- The status line is `role="status"` in the column, not inside the bar, so it remains after the bar is gone.
- Accept is the only button with the primary class.

## Tokens

```css
:root {
  --bg: #f6f4ef;
  --surface: #ffffff;
  --ink: #161513;
  --ink-2: #5a554c;
  --line: #e4dfd4;
  --line-strong: #cfc6b8;
  --primary: #1f4d3a;
  --primary-ink: #fffdf8;
  --focus: #1f4d3a;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
}
```

Button radius is 2px. The family replaces it. The bar itself is square to the viewport edges. Do not float it as a card with a margin unless the family is soft, and even then keep it one bar, not a toast.

## Typography

| Role | Family | Size | Weight | Colour |
| --- | --- | --- | --- | --- |
| Kicker | sans | 12px | 500 | `--ink-2` |
| Title | sans | 40px | 500 | `--ink` |
| Lead | sans | 16px | 400 | `--ink` |
| Bar | sans | 16px | 400 | `--ink` |
| Button | sans | 13px | 500 | see states |
| Status | sans | 16px | 400 | `--ink` |

The title is the largest type. The bar sentence measure is about 52 characters. The kicker letter-spacing is 0.04em.

## Motion

None. The bar leaves in one frame. Reduced motion has nothing to remove. Do not slide it off.

| Thing | Trigger | What changes |
| --- | --- | --- |
| Accept | click | bar hidden, Record kept. |
| Decline | click | bar hidden, No record kept. |

## States

- Page column: max-width 720px.
- Bar: fixed, left 0, right 0, bottom 0, surface, 1px `--line` on top, padding 16px 64px, flex, space between, gap 16px.
- Decline: height 40px, outline `--line-strong`, text `--ink`.
- Accept: height 40px, fill `--primary`, text `--primary-ink`, border transparent.
- Status empty until the choice.
- Focus-visible: 2px outline, offset 3px.
- Do not cover the title. The 120px bottom padding is the clearance.

## Accessibility

- The region name is Visit record.
- Both buttons have visible names.
- The status line remains in the page after the bar is hidden, so the result is not only the absence of the bar.
- The log is readable and focusable before a choice. This is not a blocking wall.
- Hit targets are 40px. On a phone, at least 44px, and the bar may stack the sentence above the buttons.
- Contrast of `#fffdf8` on `#1f4d3a` and the sentence on white clears 4.5.
- Do not use colour alone. The words Accept and Decline are the choice.

## Responsive rules

- At 1280 the bar is one row, padding 16px 64px. The column is 720px.
- Below 640 the bar stacks: the sentence, then the buttons in a row. Decline and Accept stay 40px tall. The page padding at the bottom grows if the stacked bar is taller than 120px.
- Do not pin a second bar. A sticky sale is `cta-sticky-mobile-bar`. A newsletter close is `newsletter-close-band`.
- The choice is once per view. A product remembers it. This demo does not use storage, because the sandbox blocks it. Keep the result in the page.

## Acceptance checklist

- [ ] The title is The yard log. The kicker is 3 October.
- [ ] The column is 720px. The page has room under the text so the bar does not cover it.
- [ ] The bar is fixed to the bottom, on white, with a hairline.
- [ ] The sentence says one record, and that nothing is sold on from it.
- [ ] Decline is outline. Accept is the only solid, `#1f4d3a` with `#fffdf8` text.
- [ ] Accept writes "Record kept." and removes the bar.
- [ ] Decline writes "No record kept." and removes the bar.
- [ ] The log is readable before either choice.
- [ ] Focus ring is 2px, offset 3px.
- [ ] There is no checkbox, no second list, and no animation.

## Implementation notes

Hide the bar with the attribute. Write the result into the status that stays.

```js
function done(text){
  bar.hidden = true;
  status.textContent = text;
}
```

Common mistakes:

- A wall that hides the page until Accept.
- Two solid buttons.
- A newsletter field inside the consent bar.
- Storing the choice in localStorage in the demo. The sandbox throws.
- A toast that vanishes, so the person cannot see what they chose.
- Legal filler with no concrete sentence. Say what is kept.
- Covering the title on a short screen. Add padding.

Where it sits in a product:

1. Put it on the first view that would keep a record, once.
2. Accept is the one primary. Decline is outline. Decline is a real choice, not a link in 11px type.
3. The bar uses `--surface` and `--line`. The buttons follow the family.
4. When a theme is locked, Accept uses `--primary` and `--primary-ink`.
5. Do not combine it with a sale bar. One bar.
6. The sentence is specific. This visit, one record, not sold on.
7. The result stays on the page.
8. The column is the pass column, 720px.
9. The log's Gate 4 matches the rest of the yard.
10. Keep the credit line on the token block.

Rebuild order:

1. Set the paper and IBM Plex Sans.
2. Place the log in the 720px column, with bottom padding.
3. Place the fixed bar, Decline, and Accept.
4. Wire both choices.
5. Check the title is not covered.
6. Map the button and the bar onto the kit.

Copy you keep:

1. 3 October.
2. The yard log.
3. Gate 4 took the rice. The note is the handoff, not a second product.
4. We keep one record of this visit. Nothing is sold on from it.
5. Decline. Accept.
6. Record kept.
7. No record kept.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
