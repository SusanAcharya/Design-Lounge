<!-- Design Lounge Nº 198 · "Copy, share and copy-email buttons" · designlounge.vercel.app -->

# Copy, share and copy-email buttons

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Three small "take this with you" controls on an essay page in "Vellum", a fictional quarterly of letters. The page is warm paper with a serif text column. A **Share** pill on the byline row opens a compact menu: Copy link (with the short URL shown), Email to a friend, and Send as a text. A **Copy** button sits beside a "Cite this essay" block. On click it writes the citation to the clipboard, its two-squares icon spins out while a check draws in, the pill fills forest green, and a tooltip says "Copied to clipboard" for 1.6s. At the foot, an **email chip** "letters@vellum.press" copies the address. Its text slides up to "Copied. Paste anywhere" and slides back after 1.8s.

The detail worth copying is the honest fallback. If the clipboard API is refused, which happens in iframes, on insecure origins and with permissions off, the button selects the text and tells you to press Ctrl or ⌘ + C. It never claims "Copied" when nothing was copied.

`contact-giant-email-copy` is a whole contact section built around one giant address. This piece is the set of small inline controls.

## Reference behaviour

1. First frame: a 680px column centred on paper. There are two faint 1px vertical rules at ±400px from centre, like page edges.
2. Masthead: "*Vellum*" (italic 28px/700) left, "No. 41 · Autumn letters" right (12px uppercase), over a 2px ink rule.
3. Kicker "ESSAY" in forest, title "The case for slow correspondence" (50px/500), dek in italic 21px.
4. Byline row between two hairlines: "By **Margit Sallow** · 12 min read · 3 Oct 2026" left, and a 40px outline pill "Share" with an arrow-out icon right.
5. One paragraph of body text (18px/1.6) with a forest drop cap spanning two lines.
6. The cite block: surface fill, 1px line, 3px forest left rule. "CITE THIS ESSAY" label, then "Sallow, M. (2026). The case for slow correspondence. *Vellum*, 41, 12–19." On the right, a 40px outline pill with a copy icon and "Copy", min-width 104px.
7. Foot row: "Write back. Letters run in the winter issue." left, and the email chip right (36px: mail icon, address, 26px round copy badge).
8. **Hover or focus Copy:** a dark tooltip "Copy citation" fades in 10px above, rising 4px (160ms), with a 5px arrow.
9. **Click Copy:** the citation text goes to the clipboard. The copy icon fades and turns −12° while scaling to .6, and the check stroke draws (320ms after 60ms). The label crossfades "Copy" → "Copied" (6px vertical slide). The pill fills `--accent` with paper text. The tooltip text becomes "Copied to clipboard" and stays visible. After 1600ms everything reverts and the tooltip text resets. Clicking again within the hold restarts it.
10. **Copy refused:** the citation paragraph is selected, the tooltip reads "Selected. Press Ctrl or ⌘ + C", and no check is shown.
11. **Click Share** (or ArrowDown on it): the menu opens under the button, right-aligned, 264px wide. It scales .96 → 1 and moves −4px → 0 from the top-right origin over 180ms. The button inverts to an ink fill. Focus goes to "Copy link". ArrowUp on the button opens it with focus on the last item.
12. In the menu: ArrowDown and ArrowUp cycle, Home and End jump, Escape closes and refocuses Share, and Tab closes and moves on. Clicking outside closes it. Hover and focus both paint the item `--accent-soft`.
13. **Copy link:** copies "vellum.press/41/slow". The item label becomes "Link copied" and its link icon morphs to a check. 650ms later the menu closes, focus returns to Share, and Share's tooltip shows "Link copied" for 1400ms.
14. **Email to a friend** is a `mailto:` link with the subject and the URL in the body. **Send as a text** is an `sms:` link. Each closes the menu.
15. **Click the chip:** copies "letters@vellum.press". The chip fills forest, the address slides up out of a 36px window while "Copied. Paste anywhere" slides up into it (240ms), and the badge icon turns to a check. It reverts after 1800ms.

## Structure

```
1280 × 800, column 680px centred, faint page-edge rules at ±400px
┌──────────────────────────────────────────────────────────────┐
│ Vellum                                NO. 41 · AUTUMN LETTERS │
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│ 2px ink
│ ESSAY                                                         │
│ The case for slow correspondence                    (50px)    │
│ Why a letter that takes a week to arrive still says…  italic  │
│───────────────────────────────────────────────────────────────│
│ By Margit Sallow · 12 min read · 3 Oct 2026        ( ⇪ Share )│ 40px
│───────────────────────────────────────────── ┌ menu 264 ─────┐│
│ T he postcard came eleven days after it was  │ Copy link      ││
│   sent. By then the weather it described…    │ vellum.press/… ││
│                                              │───────────────-││
│ ┃ CITE THIS ESSAY                            │ Email a friend ││
│ ┃ Sallow, M. (2026). The case for… ( ⧉ Copy )│ Send as a text ││
│                                              └────────────────┘│
│ Write back. Letters run in the winter issue. ( mail letters@… ⧉ ) │ 36px
└──────────────────────────────────────────────────────────────┘
```

- `<main class="col">`: `.mast`, `p.kick`, `<h1>`, `p.dek`, `.by` (byline + `.share-wrap`), `p.body`, `.cite` (`.cite-t` + `button.copy`), `.foot` (text + `button.chip`).
- `.share-wrap` is `position: relative`. It holds `button.share[aria-haspopup=menu][aria-expanded][aria-controls]` and `div.menu[role=menu]`, which holds a `button[role=menuitem]`, a `div[role=separator]` and two `a[role=menuitem]`. All items have `tabindex="-1"` (roving focus).
- Tooltips are `span.tip[aria-hidden]` inside their buttons. The live region carries the real announcement.
- The icon morph `.ico` holds two absolutely stacked SVGs: `.cp` (copy or link) and `.ok` (check).
- The chip's `.swap` is a 36px `overflow: hidden` grid window with two spans in one cell.

## Tokens

```css
:root {
  --paper: #f1ebdf;         /* page */
  --surface: #f9f5ec;       /* cite block, menu, chip */
  --line: #d9cfbd;
  --ink: #1e1b16;           /* text, tooltip, open Share fill */
  --ink-2: #575043;         /* dek, byline */
  --ink-3: #71695a;         /* labels, outline ring of pills */
  --accent: #2e5a43;        /* forest: drop cap, kicker, copied fill, focus */
  --accent-soft: #dce6dc;   /* menu item hover/focus */
  --on-accent: #f9f5ec;

  --serif: "Alegreya", Georgia, serif;
  --ui: "Commissioner", system-ui, sans-serif;

  --r: 6px;                 /* tooltip, menu items */
  --r-menu: 10px;
  --r-pill: 999px;

  --t-micro: 160ms;
  --t-menu: 180ms;
  --t-check: 320ms;
  --hold-copy: 1600ms;
  --hold-chip: 1800ms;
  --hold-link: 1400ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --shadow-menu: 0 18px 40px rgba(30, 27, 22, .16), 0 2px 6px rgba(30, 27, 22, .08);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Masthead | Alegreya italic | 28px | 700 | 1 | −0.01em | |
| Issue line | Commissioner | 12px | 500 | 1 | 0.12em | UPPERCASE `--ink-2` |
| Kicker | Commissioner | 12px | 600 | 1 | 0.14em | UPPERCASE `--accent` |
| Title | Alegreya | 50px | 500 | 1.04 | −0.02em | 36px under 640px |
| Dek | Alegreya italic | 21px | 400 | 1.4 | 0 | `--ink-2` |
| Body | Alegreya | 18px | 400 | 1.6 | 0 | drop cap 62px/500 forest |
| Byline | Commissioner | 14px | 400 | 1.4 | 0 | name 600 `--ink` |
| Cite label | Commissioner | 11px | 600 | 1 | 0.14em | UPPERCASE `--ink-3` |
| Citation | Alegreya | 16px | 400 | 1.45 | 0 | journal title italic |
| Button / chip | Commissioner | 14px | 500 | 1 | 0 | |
| Tooltip | Commissioner | 12.5px | 500 | 1.2 | 0 | paper on ink |
| Menu item | Commissioner | 14px | 500 | 1.25 | 0 | hint 12.5px/400 `--ink-3` |

The serif carries the reading. Every control is in Commissioner.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| `.tip` | hover, focus-visible, done | opacity, translateY | 0, 4px → 1, 0 | 160ms | `--ease` | 1ms |
| `.ico .cp` | done | opacity, scale, rotate | 1, 1, 0 → 0, .6, −12° | 160 / 320ms | `--ease` / `--ease-out` | 1ms |
| `.ico .ok path` | done | stroke-dashoffset | 20 → 0 | 320ms, delay 60ms | `--ease` | drawn |
| Copy label | done | opacity, translateY | crossfade, ±6px | 160ms | `--ease` | 1ms |
| Copy / chip fill | done | background, color | outline → `--accent` | 160ms | `--ease` | 1ms |
| `.menu` | open | opacity, translateY, scale | 0, −4px, .96 → 1, 0, 1 | 180ms | `--ease` / `--ease-out` | 1ms |
| `.menu` | close | same, reversed; `visibility` flips after 180ms | | 180ms | | 1ms |
| chip `.swap` spans | done | translateY, opacity | 0 → −100%, and 100% → 0 | 240ms | `--ease-out` | 1ms |
| buttons | :active | translateY | 0 → 1px | instant | | kept |

Restart a confirmation on a repeat click: clear the timer, remove `.done`, read `offsetWidth`, add `.done`, start a new timer.

## States

- **Pill rest:** transparent, 1px inset `--ink-3` ring, ink text. Hover `rgba(30,27,22,.05)`.
- **Copy done:** forest fill, paper text, check icon, "Copied", tooltip "Copied to clipboard" pinned.
- **Copy refused:** citation selected (native highlight), tooltip "Selected. Press Ctrl or ⌘ + C", no fill change.
- **Share open:** ink fill, paper text, `aria-expanded="true"`. Its tooltip is suppressed while open.
- **Share after copy link:** tooltip "Link copied" pinned for 1400ms.
- **Menu item hover / focus:** `--accent-soft` background, no outline (the fill is the focus indicator, 13:1 against ink text).
- **Menu item done:** label "Link copied", check icon in `--accent`.
- **Chip rest:** surface fill, 1px `--line` ring, hover ring `--ink-3`. **Done:** forest fill, paper text, badge `rgba(249,245,236,.16)` with a check.
- **Focus-visible:** 2px `--accent` outline, 3px offset on pills and the chip.

## Accessibility

- Copy has the fixed label "Copy citation". Its visible label and tooltip are `aria-hidden`. The result goes to a polite live region: "Citation copied to clipboard." or "Citation selected. Press Control or Command plus C to copy."
- The chip's label is "Copy email address letters@vellum.press". It announces "Email address copied."
- Share is a menu button: `aria-haspopup="menu"`, `aria-expanded`, `aria-controls="menu"`. The menu is `role="menu"` labelled "Share this essay". Items are `role="menuitem"` with roving `tabindex="-1"` focus.
- Keys: Enter, Space or ArrowDown opens on the first item. ArrowUp opens on the last. Inside: ArrowUp and ArrowDown wrap, Home and End jump, Escape closes and returns focus to Share, Tab closes and continues the tab order.
- After Copy link, focus returns to Share. Do not leave focus inside a closed menu.
- The menu uses `visibility: hidden` when closed, so its items can't be reached by screen reader browse mode.
- Contrast: `--ink-3` on `--surface` is 4.99:1 and on `--paper` 4.57:1. Paper on forest is 7.3:1. Ink on `--accent-soft` is 13.4:1. The tooltip, paper on ink, is 14.5:1.
- Hit targets: pills 40px, chip 36px (pointer web; 44px on touch), menu items at least 44px.

## Responsive rules

- ≥ 1280: 680px column, as specified.
- 1024–1279, 768–1023: unchanged. The column is `min(680px, 100%)`.
- < 640: title 36px, dek 18px. The issue line in the masthead is hidden. The cite block stacks with Copy under the citation, left-aligned. The menu is `min(264px, 100vw − 48px)`, still right-aligned to Share. The foot wraps with the chip on its own line.
- The page grid uses `minmax(0, 1fr)` so nothing can push past 375px.

## Acceptance checklist

### Always

- [ ] Copy writes to the clipboard with `navigator.clipboard.writeText`, falls back to a hidden textarea with `execCommand('copy')`, and if both fail, selects the text and says how to copy.
- [ ] "Copied" appears only after a successful write.
- [ ] The copy icon and the check are stacked in one box. The button doesn't change width (min-width 104px, labels in one grid cell).
- [ ] The confirmation holds for a fixed time and restarts on a repeat click.
- [ ] Share is a real menu button with arrow keys, Home and End, Escape (refocus) and click-outside.
- [ ] The Share menu's copy-link item shows the URL it will copy.
- [ ] The email chip copies the address and swaps its text inside a fixed-height window.
- [ ] Results are announced in a polite live region. Tooltips are decorative.

### This demo

- [ ] Citation: "Sallow, M. (2026). The case for slow correspondence. Vellum, 41, 12–19."
- [ ] Link: "vellum.press/41/slow". Email: "letters@vellum.press".
- [ ] Holds: 1600ms (copy), 1400ms (link), 1800ms (chip). Menu opens 180ms. Check draws 320ms.
- [ ] Menu items: Copy link, Email to a friend, Send as a text.
- [ ] The accent is `#2e5a43` on `#f1ebdf` paper. The tooltip is `#1e1b16`.

## Implementation notes

**Copy with an honest fallback.**

```js
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    const ta = Object.assign(document.createElement('textarea'), { value: text, readOnly: true });
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.append(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch {}
    ta.remove(); return ok;
  }
}
copy.onclick = async () => {
  if (await copyText(citation.textContent)) { tip.textContent = 'Copied to clipboard'; flash(copy, 1600); say('Citation copied to clipboard.'); }
  else { selectNode(citation); tip.textContent = 'Selected. Press Ctrl or ⌘ + C'; }
};
```

**Restartable confirmation.**

```js
function flash(el, ms, onEnd) {
  clearTimeout(el._t);
  el.classList.remove('done'); void el.offsetWidth; el.classList.add('done');
  el._t = setTimeout(() => { el.classList.remove('done'); onEnd?.(); }, ms);
}
```

**Menu that animates out and still hides from assistive tech.** Delay the `visibility` flip on close by the fade duration, and flip it immediately on open.

```css
.menu { opacity: 0; transform: translateY(-4px) scale(.96); transform-origin: top right; visibility: hidden;
  transition: opacity 180ms var(--ease), transform 180ms var(--ease-out), visibility 0s 180ms; }
.menu.open { opacity: 1; transform: none; visibility: visible;
  transition: opacity 180ms var(--ease), transform 180ms var(--ease-out), visibility 0s; }
```

Common mistakes:

- Showing "Copied" in a `.then()` without a `.catch()`. In a sandboxed iframe the write rejects, and the user is told a lie.
- Putting the tooltip text in `aria-label` and changing it, so screen readers re-read the whole button. Use the live region.
- A share menu of brand logos. Use verbs with plain icons, and show the link.
- Using `display: none` for the closed menu. The close animation can't run.
- Swapping the chip text without a fixed-height window. The chip jumps in height or width.
- Forgetting to return focus to Share after an item closes the menu.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
