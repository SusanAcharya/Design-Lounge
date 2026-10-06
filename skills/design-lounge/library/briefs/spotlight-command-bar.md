<!-- Design Lounge Nº 423 · "Spotlight search with preview" · www.designlounge.live -->

# Spotlight search with preview

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A system-level search bar for an invented desktop OS, floating over a dusk alpine-lake wallpaper. It opens with ⌘K (Ctrl+K off Mac) or a magnifier button in the menu bar. It is a 740px frosted-light panel with a 62px search field in 23px light-weight type, a 340px result list on the left, and a preview pane on the right that redraws for whatever is selected: an app icon with version and size, a document thumbnail with path, an action with its shortcut, or a big calculator result. Results are fuzzy-matched and grouped as Top hit, Applications, Files and Actions, with matched letters set bold. It is the system-wide sibling of `command-palette`, which is a dark in-app palette with no preview. The detail worth copying is the preview pane: it turns a list of names into a decision you can make without opening anything.

## Structure

```
┌──────────────────────────────────────────────────────────── 1280 ──┐
│ Nettle File Edit View Format Window               (⌕ ⌘K) Sun 4 Oct │ 28px menu bar
│                                                          [PDF]     │ desktop icons
│        ┌─────────────────────── 740 ───────────────────────┐ [Treks]│
│        │ ⌕  re                                        esc  │ 62px    │ top 16vh
│        ├──────────── 340 ──────┬───────────────────────────┤         │
│        │ TOP HIT               │      ┌───────────────┐     │         │
│        │ ▌Roadmap review…  Slides│     │ slide thumb   │     │ 372px   │
│        │ APPLICATIONS          │      └───────────────┘     │         │
│        │  ▢ Petrel Mail        │   Roadmap review — Oct    │         │
│        │  ▢ Bracken Photos     │   Slides document · 18.7MB│         │
│        │ FILES …  ACTIONS …    │   Modified / Size / Where │         │
│        ├───────────────────────┴───────────────────────────┤         │
│        │ ↑↓ select  ↵ open  esc close            7 results │ 36px    │
│        └───────────────────────────────────────────────────┘         │
│                 ( Press ⌘K to search apps, files and actions )      │
└────────────────────────────────────────────────────────────────────┘
```

- Wallpaper: inline SVG, sky gradient `#16202b → #3e5468 → #9fb2bf`, two slate ridges, a lake gradient with mirrored ridge and four faint ripple lines, `aria-hidden`.
- Menu bar: `header`; the opener is a `button` labelled "Search" with `aria-haspopup="dialog"` and `aria-keyshortcuts="Meta+K Control+K"`.
- Scrim: a full-screen transparent `div` that catches outside clicks. Don't darken the desktop.
- Panel: `div role="dialog" aria-modal="true" aria-label="Search"`.
- Field: `input role="combobox" aria-expanded="true" aria-controls="list" aria-autocomplete="list"` with `aria-activedescendant` pointing at the selected option.
- List: `div role="listbox"`, each group a `div role="group" aria-labelledby` its heading, each row `div role="option" aria-selected`.
- Preview: `section aria-label="Preview"` (not live, to avoid chatter).
- Footer: decorative key hints (`aria-hidden`) and the result count.
- Notification: `div role="status" aria-live="polite"`, fixed top-right.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Panel open | ⌘K / button | opacity, scale | 0, .97 → 1, 1 | 200ms `--expo` | none |
| Panel close | Esc / run / outside | display | shown → hidden | instant | instant |
| Notification | item run | translateX | 100% + 24px → 0, back after 2.6s | 360ms `--expo` | instant |
| Selection, preview | keys / hover | background, content | swap | none | none |

Selection and preview never animate. A search panel that fades between previews feels slow.

## States

- Row resting: transparent; hover `--row-hover`.
- Row selected: `--accent` fill, 9px radius, white title and matched letters, kind at 80% white, file glyph white.
- Field: no visible border or focus ring. The panel itself is the focus context and the caret is visible. Every other control gets a 2px `--accent` ring.
- Empty query: Recent group.
- No results: centred two-line message; preview cleared; count blank.
- Dark appearance: same layout with dark tokens.
- Calculator: single group above the others with an Abacus icon.

## Accessibility

- Combobox/listbox pattern: focus stays in the input; `aria-activedescendant` moves; options carry `aria-selected`.
- Groups are `role="group"` labelled by their visible heading.
- The dialog is modal: Tab is held in the input, and outside pointer down closes it.
- ⌘K and Ctrl+K both work everywhere; the hint glyph switches to "Ctrl K" off Mac.
- Escape: clear, then close. Focus returns to the opener.
- The result notification is a polite status region.
- Contrast: `#4b5360` on the light glass over the dark wallpaper is above 6:1; white on `#2f6fe4` is above 4.5:1.
- Rows are 40px tall.

## Responsive rules

- ≥1280: as drawn, top at 16vh.
- 1024 / 768: same panel (740px fits).
- <720: the preview pane hides; the list takes the full width; the panel is `100vw − 24px` wide at 56px from the top; desktop icons, menu words and the "esc close" hint hide.
- The body height stays 372px; the list scrolls inside.

## Acceptance checklist

### Always

- [ ] Opens on ⌘K / Ctrl+K and from a visible button; toggles on a second press.
- [ ] Fuzzy matching tries every start position of the first letter and scores consecutive and word-start hits higher.
- [ ] Matched letters render bold, not with a highlight background.
- [ ] Results are grouped with a single best "Top hit" first and at most 4 per group.
- [ ] Arrow keys wrap; the selection scrolls into view; hover selects.
- [ ] The preview redraws for every selection, with a different layout per kind.
- [ ] Arithmetic and "N% of M" add a calculator result at the top.
- [ ] Escape clears, then closes; focus returns to the opener.
- [ ] Combobox + listbox ARIA with `aria-activedescendant`.
- [ ] No horizontal overflow at 375px; the preview hides below 720px.

### This demo

- [ ] Light frosted panel `rgba(242,244,247,.8)`, 740px, 18px radius, over the slate lake wallpaper.
- [ ] Selection colour `#2f6fe4`.
- [ ] First frame query "re" with the Roadmap review deck previewed.
- [ ] Eight invented apps, seven files, six actions.
- [ ] "Toggle dark appearance" flips the panel to dark tokens.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: the panel is open with the query "re". Top hit is "Roadmap review — October.deck", selected in blue, and the preview shows a navy slide thumbnail with an orange bar chart and Modified / Size / Where. Below: Applications (Petrel Mail, Bracken Photos), Files (Annapurna ridge at dawn.jpg, Rooftop garden budget.sheet), Actions (Lock screen). The footer reads "7 results".
2. Typing re-runs the search on every input. The first result is selected and previewed.
3. Up/Down move the selection and wrap. PageUp/PageDown jump 5 and clamp. The selected row scrolls into view. The preview updates with no animation.
4. Moving the mouse over a row selects it. Clicking a row runs it.
5. Enter runs the selected item and closes the panel. A notification slides in from the right edge (360ms) for 2.6s. Opening an app also changes the menu bar app name.
6. "Toggle dark appearance" really flips the panel to its dark tokens.
7. A query that is arithmetic (digits, `+ − * / % ( ) ^ × ÷ x`) or "N% of M" adds a Calculator group at the top. "15% of 8000" shows 1,200. The preview shows the expression in mono and the result at 46px. Enter copies the result.
8. Empty query: a Recent group of six items (Nettle, Q3 roadmap.pdf, Marlin, the deck, Toggle dark appearance, Start focus — 25 min).
9. No matches: "No results for “zzz”" with a hint to try an app, a file or a sum like 1280*0.15.
10. Escape clears a non-empty query first, then closes on a second press. ⌘K toggles. A pointer down outside the panel closes it. Focus returns to whatever opened it.
11. When closed, a pill at the bottom reads "Press ⌘K to search apps, files and actions".

## Tokens

```css
:root {
  /* wallpaper */
  --night: #16202b; --slate-1: #3e5468; --slate-2: #2a3a48; --slate-3: #1d2935; --mist: #9fb2bf;
  /* panel, light */
  --glass: rgba(242, 244, 247, .80);
  --glass-line: rgba(255, 255, 255, .65);
  --ink: #14181e;  --ink-2: #4b5360;  --ink-3: #6a7280;
  --rule: rgba(20, 24, 30, .09);
  --row-hover: rgba(20, 24, 30, .05);
  --accent: #2f6fe4;  --on-accent: #fff;  --mark: #14181e;
  /* type */
  --sans: "Geologica", system-ui, sans-serif;
  --mono: "Red Hat Mono", ui-monospace, monospace;
  /* geometry */
  --w: 740px; --r: 18px; --row: 40px; --list-w: 340px; --body-h: 372px;
  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
body.dark {
  --glass: rgba(30, 36, 44, .80); --glass-line: rgba(255, 255, 255, .12);
  --ink: #eef1f5; --ink-2: #b5bdc8; --ink-3: #8c95a2;
  --rule: rgba(255, 255, 255, .09); --row-hover: rgba(255, 255, 255, .06); --mark: #fff;
}
```

Panel surface: `backdrop-filter: blur(40px) saturate(1.6)`, `border: 1px solid var(--glass-line)`, `box-shadow: 0 0 0 .5px rgba(0,0,0,.3), 0 40px 90px -24px rgba(4,8,16,.7)`.

App icon gradients (24px rows, 84px preview, radius 6px / 20px): Marlin `#3aa7a0→#1f6f73`, Petrel Mail `#5b9cf0→#2f6fe4`, Nettle `#f5c84b→#e1a514`, Corvid `#3b4250→#1c2028`, Bracken Photos `#7cc47a→#3f9a55`, Abacus `#f08a4b→#d9612a`, Avocet Calendar `#ef6a62→#cf3f39`, System Settings `#9aa4b1→#6a7482`. File glyphs are tinted by type: PDF `#d9473f`, Slides `#e0812a`, JPEG `#3f9a55`, Sheet `#1e9e6a`, Markdown `#6a7280`, Swatch `#2f6fe4`.

## Typography

| Role | Family | Size | Weight | Notes |
| --- | --- | --- | --- | --- |
| Query | Geologica | 23px | 300 | letter-spacing −0.01em |
| Group heading | Geologica | 11px | 600 | uppercase, 0.08em, `--ink-3` |
| Row title | Geologica | 14px | 400 | `--ink-2`; matched letters 600 `--mark` |
| Row kind | Red Hat Mono | 11.5px | 400 | `--ink-3` |
| Preview title | Geologica | 18px | 500 | ellipsis |
| Preview sub / meta | Geologica | 12.5px | 400 | `--ink-3` labels, `--ink-2` values |
| Calc expression | Red Hat Mono | 15px | 400 | |
| Calc result | Geologica | 46px | 500 | −0.03em, tabular numbers |
| Key caps | Red Hat Mono | 11.5px | 500 | 5px radius |
| Menu bar | Geologica | 13px | 400, app 600 | clock in mono 12.5px |

## Implementation notes

Greedy subsequence matching from the first occurrence picks the wrong letters ("re" would bold the R of "Roadmap" and an e far away). Try every start and keep the best:

```js
function greedy(q, t, start) {
  let score = 0, from = start, prev = start - 2; const idx = [];
  for (const ch of q) {
    const i = t.indexOf(ch, from); if (i < 0) return null;
    score += 1 + (i === prev + 1 ? 5 : 0)
               + (i === 0 || /[\s\-_.—]/.test(t[i - 1]) ? 8 : 0)
               - Math.min(3, (i - from) * .15);
    idx.push(i); prev = i; from = i + 1;
  }
  return { score, idx };
}
function fuzzy(q, s) {
  q = q.replace(/\s+/g, ''); const t = s.toLowerCase(); let best = null;
  for (let i = t.indexOf(q[0]); i >= 0; i = t.indexOf(q[0], i + 1)) {
    const m = greedy(q, t, i); if (m && (!best || m.score > best.score)) best = m;
  }
  return best && { score: best.score - s.length * .02, idx: best.idx };
}
```

Only evaluate a calculator expression after a strict whitelist, and require at least one operator so plain numbers stay searchable:

```js
function calc(q) {
  const pct = q.match(/^\s*(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)\s*$/i);
  const expr = pct ? `${pct[1]}/100*${pct[2]}`
                   : q.replace(/[×x]/g, '*').replace(/÷/g, '/').replace(/\^/g, '**');
  if (!pct && !(/^[\d\s.+\-*/()%]+$/.test(expr) && /\d/.test(expr)
       && /[+\-*/%]/.test(expr.replace(/^\s*-/, '')))) return null;
  try { const v = Function('"use strict";return (' + expr + ')')();
        return Number.isFinite(v) ? v : null; } catch { return null; }
}
```

Keep focus in the input. Rows are never focusable, and the input reports the active row:

```js
el.setAttribute('aria-selected', 'true');
input.setAttribute('aria-activedescendant', el.id);
el.scrollIntoView({ block: 'nearest' });
```

Common mistakes:

- Copying `command-palette`'s dark centred modal with a dimmed backdrop. This is a system bar: frosted light, no scrim tint, preview on the right.
- Animating the preview on every arrow press.
- Moving DOM focus to rows, which breaks typing-to-refine.
- Highlighting matches with a yellow background. Use weight.
- Running `eval` on raw input.
- Letting Escape close straight away when there's a query; clear first.
- Real OS app names or logos. Invent them.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
