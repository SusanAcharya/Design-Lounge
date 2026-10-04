<!-- Design Lounge Nº 129 · "Mobile run detail" · designlounge.vercel.app -->

# Mobile run detail

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Keep the back control, the fact list, and the bottom button.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The detail a driver opens from a list, on a phone. The Lounge draws the device chrome, so this screen pads 54px at the top and does not draw a clock. Back reads "Runs" in the primary colour. The title is Bay 14. A warning badge says Waiting on driver. Five facts sit in a white rounded card: weight, driver, slot, gate, reference. A fixed bar at the bottom holds one full-width Confirm load button, with 28px padding under it for the home indicator. Confirming disables the button, sets its label to Confirmed, and turns the badge green. There is no tab bar on this screen. Back is the way out.

## Structure

```
390 × 844
padding-top 54
back 44
h1
badge
card of 5 pairs
fixed bar height 84, padding 12 20 28
```

- Facts are a `dl` of pairs. Each pair is a row with the label and the value.
- The bar is `position: fixed` at the bottom.
- Body padding-bottom 96 so the card is not hidden behind the bar.

## Motion

None. The badge and label change in place. Reduced motion changes nothing.

## States

- Badge waiting and confirmed.
- Button enabled and disabled. Disabled opacity 0.55.
- No loading spinner.

## Accessibility

- Back and Confirm are buttons with visible names.
- Status is a word, not only a colour.
- Button height 44px. Back height 44px.
- The fixed bar's 28px bottom padding keeps the button above the home indicator.
- `#fffdf8` on `#8a4b12` is the button pair. If a kit primary fails contrast, use that kit's `primaryInk`.

## Responsive rules

- Designed at 390 wide. At 360, horizontal padding stays 20px and the button stays full width.
- At tablet width, cap the card at 480px and center it. Do not stretch the facts across 1180px.
- The 54px top pad stays.

## Acceptance checklist

- [ ] Top padding is 54px. No fake status bar.
- [ ] Back reads Runs and is 44px tall.
- [ ] Title is Bay 14 at 32px.
- [ ] Five facts: 2,400 kg, Mira Lama, 06:40, North 2, RUN-1844.
- [ ] Values are mono.
- [ ] One bottom button, 44px, full width.
- [ ] Confirm changes the badge and disables the button.
- [ ] No tab bar on this screen.
- [ ] Card radius is 10px. Button radius is 10px.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial badge is Waiting on driver, fill `#f8efd8`, ink `#8a5a10`.
2. Confirm load fills the bar button, height 44, radius 10.
3. Tap confirm: label Confirmed, button disabled, badge text Confirmed, badge fill `#e7f2ec`, ink `#1f4d3a`.
4. Back is a button. In the demo it does not navigate. It is 44px tall so the hit target is real.
5. Fact values are mono. Labels are the text face in `--ink-2`.
6. Do not draw a status bar, a notch, or a tab bar.
7. Focus ring 2px `--focus`, offset 2px.

## Tokens

```css
:root {
  --bg: #f4f1ea;
  --surface: #fffdf8;
  --ink: #1b1814;
  --ink-2: #5e574e;
  --ink-3: #8d857a;
  --line: #e3dbcf;
  --primary: #8a4b12;
  --primary-ink: #fffdf8;
  --warning: #8a5a10;
  --warning-soft: #f8efd8;
  --focus: #8a4b12;
  --font-text: "IBM Plex Sans", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  --safe-top: 54px;
}
```

## Typography

- Back: IBM Plex Sans 600, 15px, colour `#8a4b12`.
- Title: 32px, weight 600, tracking -0.03em.
- Badge: 11px, weight 600, height 22.
- Labels: 14px `--ink-2`. Values: IBM Plex Mono 13px.
- Button: 15px, weight 600, white-warm `#fffdf8` on `#8a4b12`.

## Implementation notes

The bar is fixed. Body padding-bottom must clear it. 96px is enough for an 84px bar.

Rebuild order:

1. Background `#f4f1ea`. Text `#1b1814`.
2. Back padding 0 20px, no border, no fill.
3. Title margin 4px 20px 8px.
4. Badge margin-left 20px.
5. Card margin 20px, fill `#fffdf8`, border `#e3dbcf`, radius 10.
6. Pair padding 12px 14px, top rule except the first.
7. Bar height 84, fill `#fffdf8`, top rule, padding 12px 20px 28px.
8. Button width 100%, height 44, radius 10, fill `#8a4b12`, text `#fffdf8`.
9. Confirmed badge fill `#e7f2ec`, ink `#1f4d3a`.
10. Do not add a map.

Common mistakes:

- A tab bar plus a back button. This screen has back only.
- Drawing the time in the status area.
- Two buttons in the bar, Hold and Confirm. Hold lives on the desktop record, not here.
- A serif title.
- Photos of the bay.
- Letting the card scroll under the button with no padding.
- A 56px button. It is 44.
- Replacing the badge with a banner.
- A share icon in the top right.
- Pull-to-refresh. There is nothing to refresh.
- A second card for notes. Notes live on the desktop record.

Copy you keep, in this order:

1. Back label is "Runs".
2. Title is "Bay 14".
3. Waiting badge reads "Waiting on driver".
4. Weight is "2,400 kg".
5. Driver is "Mira Lama".
6. Slot is "06:40".
7. Gate is "North 2".
8. Reference is "RUN-1844".
9. Button starts as "Confirm load" and becomes "Confirmed".
10. Confirmed badge fill is `#e7f2ec` and ink is `#1f4d3a`.
11. Horizontal padding on the title and card is 20px.
12. Top pad is 54px. Bottom body pad is 96px.
13. Bar height is 84px. Button height is 44px.
14. Disabled button opacity is 0.55.
15. Card and button radius are both 10px.
16. There is no map, no photo, and no second button.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
