<!-- Design Lounge Nº 334 · "Phone input with country picker" · designlounge.vercel.app -->

# Phone input with country picker

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Flags are emoji built from the ISO code at runtime (regional indicator letters), at the user's request; there are no flag images.

## What it is

The contact step of Parcelry's checkout. One field holds a country button (flag, dial code, chevron) and a mono number input. The button opens a searchable list of 27 countries with Suggested on top. The number formats itself as you type using each country's pattern, a trunk 0 is dropped, and pasting a full international number like "+977 984 123 4567" switches the country for you. A hint line under the field counts digits, says what is missing, and turns green or red; a grey strip shows the number exactly as it will be saved in E.164. The detail worth copying is that formatting and validation come from one pattern string per country, e.g. Nepal `XXX-XXXXXXX`, United Kingdom `XXXX XXXXXX`.

## Reference behaviour

1. First frame: United Kingdom selected, number "7700 900123", field border green with a check, hint "Valid United Kingdom mobile." and count "10/10". The picker is open below the field with no focus moved into it, showing Suggested (United Kingdom checked and highlighted, Nepal, United States) and the start of All countries.
2. Clicking the country button toggles the picker. Opening it focuses the search input. ArrowDown or ArrowUp on the button also opens it.
3. Typing in search filters by name substring ("nep" → Nepal, with "Nep" highlighted in blue), ISO code ("np"), or dial digits ("977" or "+977"). Suggested hides while searching. No match shows "No country matches “xyz”."
4. ArrowUp/Down move the highlight (wrapping), Home/End jump, Enter selects, Escape closes and returns focus to the country button, Tab closes. Hovering an option highlights it; clicking selects it. Clicking outside closes.
5. Selecting a country updates the flag and dial code, trims digits to the new length, updates the placeholder to that country's example (Nepal "984-1234567"), and moves focus to the number.
6. Typing digits formats live with the caret kept after the same digit. Letters are blocked; spaces, dashes, brackets and dots are allowed and normalised away. A leading 0 is dropped (except Italy). Input stops at the country's digit count.
7. Typing or pasting a value that starts with "+" or "00" finds the longest matching dial code, switches country, and keeps the rest as the national number. If the current country already shares the code (+1 for US and Canada), it stays; otherwise +1 goes to United States.
8. While typing an incomplete number the hint says "3 more digits" in grey. On blur with an incomplete number it turns red: "Nepal mobile numbers have 10 digits. You've entered 7." with a red border and a 3px pale red ring.
9. If the digits don't start the way that country's mobiles start (UK `7`, Nepal `96/97/98`, India `6–9` and so on), the hint goes red: "That doesn't look like a United Kingdom mobile. Try 7700 900123."
10. Valid: green border, check fades and scales in, hint "Valid Nepal mobile.", strip "Saved as +9779841234567", Continue enabled.
11. Incomplete: strip shows the formatted partial with an ellipsis, Continue disabled at 35% opacity.
12. Continue writes "Saved. The courier will text +977 984-1234567." in the hint.
13. Reduced motion: the picker appears without the 220ms drop, and border, chevron and check changes are instant.

## Structure

```
1280 x 800, padding 48 96, columns 1fr | 520px, gap 80, vertically centred
+-------------------------------+   +--------------------------------------+
| [box] Parcelry                |   | Delivery contact            (22px)   |
|                               |   | The courier texts you 30 minutes ... |
| Where should                  |   | Full name                            |
| the courier                   |   | [ Tobias Ferreira-Okafor           ] |
| call?        (60px)           |   | Mobile number                        |
|                               |   | [GB +44 v | 7700 900123         ✓ ]  | 52px
| One number, any country...    |   | Valid United Kingdom mobile.  10/10  |
|                               |   | +----------------------------------+ |
| 01 Address • 02 Contact 03 Pay|   | | (search) Search country or code  | | 48px
|                               |   | | SUGGESTED                        | |
|                               |   | | GB United Kingdom          +44 ✓ | | 44px rows
|                               |   | | NP Nepal                  +977   | |
|                               |   | | ALL COUNTRIES ...                | | list max 240px
|                               |   | +----------------------------------+ |
|                               |   | Saved as            +447700900123    |
|                               |   | [x] Text me delivery updates         |
|                               |   | [      Continue to payment       ]   | 48px
+-------------------------------+   +--------------------------------------+
```

- Left: `section.intro` with the wordmark, `h1`, paragraph and an `ol` of checkout steps (current has `aria-current="step"`).
- Right: `main.card` (16px radius, 1px `--line`, padding 32px).
- The phone row is a positioned wrapper: `label for="tel"`, `div.field` (country `button`, `input type="tel"`, status check), the popover `div.pop`, then `p.hint` with message and count.
- The popover has a search `input role="combobox"` and a `ul role="listbox"` of `li role="option"`. Group headings are `li role="presentation"`.
- Under the field: the E.164 strip (`aria-live="polite"`), a checkbox, and the Continue button.

## Tokens

```css
:root {
  --bg: #f4f1ea;           /* warm paper */
  --card: #fffdf8;         /* card, field, popover */
  --sunk: #f7f4ed;         /* E.164 strip, country hover */
  --line: #e2ddd1;         /* card border, inner dividers */
  --line-2: #cbc5b7;       /* field border, popover border */
  --ink: #1a1916;
  --ink-2: #55524a;
  --ink-3: #716d64;
  --accent: #2443d6;       /* cobalt: focus, highlight, match */
  --accent-soft: #e8ecfc;  /* focus ring, active option */
  --ok: #1f7a4d;
  --err: #c2412d;
  --err-ring: #f6e1dc;
  --focus: #2443d6;

  --sans: "Rethink Sans", system-ui, sans-serif;
  --mono: "Fragment Mono", ui-monospace, Menlo, monospace;

  --r: 10px;               /* fields, buttons */
  --r-card: 16px;
  --r-pop: 12px;
  --field-h: 52px;
  --option-h: 44px;
  --list-max: 240px;
  --shadow-pop: 0 18px 40px -18px rgba(26,25,22,.35), 0 2px 6px rgba(26,25,22,.06);

  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Headline | Rethink Sans | 60px | 600 | 0.98 | -0.04em | Sentence, max 10ch |
| Card title | Rethink Sans | 22px | 600 | 1.2 | -0.02em | Sentence |
| Label | Rethink Sans | 13px | 600 | 1.5 | 0 | Sentence |
| Body, options | Rethink Sans | 15px | 400 | 1.5 | 0 | Sentence |
| Phone number | Fragment Mono | 16px | 400 | 1 | 0.02em | Digits |
| Dial code | Fragment Mono | 15px (13px in list) | 400 | 1 | 0 | +NN |
| Hint | Rethink Sans | 13px | 400 | 1.5 | 0 | Sentence; count in mono 12px |
| Group heading, steps, E.164 | Fragment Mono | 11–13px | 400 | 1.4 | 0.08em on headings | Upper headings |
| Flag | system emoji | 20px | — | 1 | — | — |

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Popover | open | opacity, translateY, scale | 0, -4px, .98 → 1, 0, 1 | 220ms | `--ease-out` | instant |
| Chevron | open / close | rotate | 0 ↔ 180° | 200ms | `--ease` | instant |
| Field | focus / valid / invalid | border, box-shadow | — | 160ms | `--ease` | instant |
| Check | valid | opacity, scale | 0, .6 → 1, 1 | 200ms / 300ms | `--ease` / `--ease-out` | instant |
| Highlight | arrow / hover | background | — | none | — | — |

## States

- Field resting: 1px `--line-2`. Focus-within: border `--accent` + 3px `--accent-soft` ring.
- Valid: border `--ok`, check visible, hint green.
- Invalid (blurred incomplete, or wrong start): border `--err`, 3px `--err-ring`, hint red, `aria-invalid="true"`.
- Typing incomplete: neutral hint "N more digits", count "7/10".
- Empty: hint "Nepal · 10 digits after +977", strip "—".
- Country button hover: `--sunk`. Expanded: chevron rotated.
- Option active: `--accent-soft` fill, dial code `--ink-2`. Selected: blue check at the right.
- Search no result: one muted line, no options.
- Continue disabled: 35% opacity, `not-allowed`. Hover when enabled: ink → cobalt.
- Focus-visible: 2px cobalt outline, offset 2px (inset -2px on the country button).

## Accessibility

- The number input has a visible label and `aria-describedby` pointing at the hint, so the digit rule and errors are read with it. `autocomplete="tel-national"`, `inputmode="tel"`.
- The country button has `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`, and a visually hidden name: "United Kingdom, country code +44. Change country". Flag glyphs are `aria-hidden`.
- The search is a combobox with `aria-activedescendant` pointing at the highlighted option; focus never leaves the search while arrowing.
- Options carry `aria-selected` for the current country.
- Escape returns focus to the country button; selecting returns focus to the number.
- The E.164 strip is a polite live region, so the saved value is confirmed.
- Contrast: ink on card about 17:1; `#716D64` about 5:1; `--ok` `#1F7A4D` about 5.3:1; `--err` `#C2412D` about 5:1.
- Options are 44px tall; the field is 52px.
- Emoji flags fall back to two letters on some Windows setups. The country name and dial code are always visible, so nothing depends on the flag.

## Responsive rules

- ≥1280: two columns, card 520px.
- 1024 (≤1100px): padding 40px 48px, card column 460px, headline 48px.
- 768 (≤820px): one column (`minmax(0,1fr)`), intro above the card, headline 40px, page scrolls.
- <640: padding 24px 16px, headline 34px, card padding 20px, tighter country button, number 15px; the E.164 strip stacks label over value. The popover stays the width of the field.
- No sideways scroll at 375px.

## Acceptance checklist

### Always

- [ ] Country button shows flag, dial code and chevron and opens a searchable list.
- [ ] Search matches name, ISO code and dial digits, with the match highlighted.
- [ ] Full keyboard support in the list: arrows, Home/End, Enter, Escape, Tab.
- [ ] One pattern per country drives both formatting and digit count.
- [ ] Caret stays after the same digit while formatting.
- [ ] A leading trunk 0 is dropped.
- [ ] Pasting "+CC…" or "00CC…" switches country by longest dial-code match.
- [ ] Hint counts digits, explains the error in a sentence, and is wired with `aria-describedby`.
- [ ] Errors show only after blur (or for an impossible prefix), never while typing a valid start.
- [ ] Saved value shown in E.164; Continue disabled until valid.
- [ ] No sideways scroll at 375px.

### This demo

- [ ] Brand "Parcelry", headline "Where should the courier call?".
- [ ] 27 countries; Suggested is United Kingdom, Nepal, United States.
- [ ] First frame: UK, "7700 900123", valid, picker open.
- [ ] Nepal pattern `XXX-XXXXXXX`, example 984-1234567, mobiles start 96/97/98.

## Implementation notes

**1. Data and formatting from one pattern.** Length is the number of X's; formatting walks the pattern.

```js
const C = [
  ['GB','United Kingdom','44','XXXX XXXXXX','7700900123',/^7/],
  ['NP','Nepal','977','XXX-XXXXXXX','9841234567',/^9[678]/],
  ['US','United States','1','(XXX) XXX-XXXX','2015550123',/^[2-9]/],
  // ...
].map(([iso, name, dial, pat, ex, start]) =>
  ({ iso, name, dial, pat, ex, start, len: pat.split('X').length - 1 }));
const fmt = (d, pat) => { let out = '', i = 0;
  for (const p of pat) { if (i >= d.length) break; out += p === 'X' ? d[i++] : p; } return out; };
const flagOf = iso => String.fromCodePoint(...[...iso].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
```

Building flags from the ISO code means no emoji literals in source and no image sprite.

**2. Keep the caret on the same digit.** Count digits before the caret, reformat, then walk the new string to that digit count.

```js
tel.addEventListener('input', () => {
  const raw = tel.value, before = raw.slice(0, tel.selectionStart).replace(/\D/g, '').length;
  let d = raw.replace(/\D/g, ''), drop = 0;
  if (d.startsWith('0') && cur.dial !== '39') { d = d.slice(1); drop = 1; }
  digits = d.slice(0, cur.len);
  const shown = fmt(digits, cur.pat); tel.value = shown;
  let pos = 0, seen = 0, want = Math.max(0, before - drop);
  while (pos < shown.length && seen < want) { if (/\d/.test(shown[pos])) seen++; pos++; }
  tel.setSelectionRange(pos, pos);
});
```

**3. Longest dial-code match for pasted international numbers.**

```js
function fromInternational(raw) {
  const d = raw.replace(/\D/g, '');
  const hits = C.filter(c => d.startsWith(c.dial))
    .sort((a, b) => b.dial.length - a.dial.length || (b.iso === 'US') - (a.iso === 'US'));
  if (!hits.length) return null;
  const best = hits[0].dial === cur.dial ? cur : hits[0];   // +1 keeps US or Canada
  return { c: best, rest: d.slice(best.dial.length) };
}
```

Common mistakes:

- A native `select` of 240 countries with no search.
- Storing the formatted string. Store digits; save `+` + dial + digits.
- Showing "Invalid number" in red on the first keystroke.
- Formatting that jumps the caret to the end when editing the middle.
- Matching "+1" before "+1 868"-style longer codes; always prefer the longest code.
- Moving focus into the list items instead of using `aria-activedescendant`.
- Relying on the flag alone to show the country.
- Letting the popover push the layout down; it overlays.

Rebuild order:

1. Tokens, two-column layout, card and the name field.
2. Country data, `fmt`, `flagOf`.
3. The composite field with formatting, caret logic and trunk-0 drop.
4. Validation, hint, count and E.164 strip; Continue enable.
5. The popover combobox: search, groups, highlight, keyboard, outside click.
6. International paste detection.
7. Reduced motion, then the 1100px, 820px and 640px rules.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
