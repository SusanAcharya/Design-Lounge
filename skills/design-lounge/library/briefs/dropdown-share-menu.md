<!-- Design Lounge Nº 401 · "Share menu with invites and QR" · designlounge.vercel.app -->

# Share menu with invites and QR

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, keep the structure and the keyboard model and map the colours onto the kit; the offset shadow becomes the kit's popover shadow.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The Share popover of Pressleaf, a small editor for printed community newsletters. It hangs from a pink Share button in the top bar and holds everything sharing needs in one 400px panel: invite by email (chips plus an access-level menu), the people who already have access, a copy-link row that turns green and says Copied for 2 seconds, a four-button Send to toolbar, and a QR switch that shows a code sized for the noticeboard. It looks printed: cream paper, navy ink, 1.5px ink borders, 4px corners and a solid pink offset shadow like a misregistered second colour. The detail worth copying is the layering: the panel is a non-modal dialog, the access picker inside it is a real `role="menu"` of `menuitemradio`, and Escape peels them off one at a time.

## Structure

```
1280 × 800
┌ top bar 60px, paper, 1.5px ink bottom rule ───────────────────────────┐
│ Pressleaf  Issues / 14 · The Allotment Letter  Saved 2 min ago  (RA TB NS) [Share] │
└────────────────────────────────────────────────────────────────────────┘
  page card 640px, centred, 48/56 padding            ┌ panel 400px ──────────┐
  ISSUE 14 · EARLY AUTUMN                             │ Share issue 14  The… │ 22px Gloock
  The Allotment Letter  (64px Gloock)                 ├ INVITE BY EMAIL ──────┤
  lede 17px, two columns 13.5px                       │ [chip][chip]   [Can edit ▾]
                                                      │ Add people            │
                                                      │ (NS) Nell Sarpong (you)    Owner
                                                      │ (TB) Tomas Bell     Can comment ▾
                                                      │               [Send 2 invites]
                                                      ├ ANYONE WITH THE LINK CAN VIEW ┤
                                                      │ ⛓ pressleaf.page/plot22/…  [Copy link]
                                                      ├ SEND TO ·········· status ┤
                                                      │ (✉) (▢) ((•)) (<>)    │ 40px circles
                                                      ├───────────────────────┤
                                                      │ QR code           (●━)│ switch 44×26
                                                      │ [QR 92px] Scan to read│
                                                      └───────────────────────┘
```

- Share: `<button aria-haspopup="dialog" aria-expanded aria-controls="panel">`.
- Panel: `<section role="dialog" aria-labelledby="ph">`, non-modal (no `aria-modal`, no scrim, no trap). It contains a text input, so it cannot be `role="menu"`.
- Invite field: a wrapper with chips (`<span>` + remove `<button>`) followed by `<input type="email">` labelled "Invite by email", `aria-describedby` pointing at the error line, which is `aria-live="polite"`.
- Access selects: `<button aria-haspopup="menu" aria-expanded aria-label="Invite access: Can edit">`.
- Access menu: one `role="menu"` element at body level (not inside the panel, because the panel's transform would capture `position: fixed`), items `role="menuitemradio"` with `aria-checked`.
- Copy row: an `<output>` with the URL and a button. Toolbar: `role="toolbar" aria-labelledby` with roving tabindex. QR: `<button role="switch" aria-checked aria-controls="qr">`, the code is an `<svg role="img" aria-label="QR code for …">`.
- Status: one `role="status"` span in the Send to label row.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Panel in | open | opacity, translateY | 0, -6px → 1, 0 | 220ms | `--expo` |
| Panel out | close | opacity, translateY | 1 → 0, -6px, then `hidden` | 120ms | `--ease` |
| Share press | active / expanded | translate, shadow | 0, 3px → 2px, 1px | 120ms | `--ease` |
| Invalid email | Enter on bad text | translateX | 0 → -4 → 4 → 0 | 260ms | `--ease` |
| Copy | click | background, colour | white → `--ok` | 160ms | `--ease`, reverts at 2000ms |
| Target hover | hover / focus | circle translateY, fill | 0 → -2px, white → `--pink-soft` | 160ms | `--ease` |
| Switch | click | knob translateX | 0 → 18px | 180ms | `--ease` |

The access menu has no animation; it is a quick pick inside an already-animated surface. Reduced motion: all transitions 1ms, no shake, panel appears without translate. The Copied state still shows for 2000ms; it is state, not motion.

## States

- Share: pink fill, white 700, 1.5px ink border, 3px offset shadow. Pressed and `aria-expanded="true"`: translated 2px, 1px shadow.
- Invite field focus-within: 3px `--pink-soft` ring outside the ink border.
- Chip: 26px tall, radius 13, × button 22px round, hover tint `rgba(163,23,60,.12)`.
- Send: ink fill, paper text; disabled at 45% opacity.
- Quiet select (per person): no border at rest; hover and expanded show `--line` border and white fill.
- Menu item focus: `--pink-soft` fill; focus-visible adds a 2px inset pink ring; checked shows a `--pink-ink` check in the 18px gutter.
- Copy: white, ink border; copied: `--ok` fill and border, white check + "Copied".
- Switch off: white track, ink knob at left. On: pink track, white knob at 18px.
- Error: one line under the chips, 12px `--pink-ink`. Cleared on input.
- Empty invite list: Send reads "Send invites" and is disabled.

## Accessibility

- The panel is a non-modal `dialog`. A share surface with text fields is not a menu; using `role="menu"` would make screen readers swallow typing. The menu role is used where it is true: the access picker.
- Focus order inside the panel: email input → access select → Tomas's select → Send → Copy → toolbar (one stop) → QR switch.
- Escape order: an open access menu closes first (focus back on its select); the next Escape closes the panel and returns focus to Share. The menu's Escape handler stops propagation so one key press doesn't close both.
- The access menu has `aria-label` set per anchor ("Invite access", "Tomas Bell access"); each select's `aria-label` includes the current value and is updated on change.
- Chips' remove buttons are named "Remove rhea@tidepool.org". The error line is `aria-live="polite"` and referenced by `aria-describedby`.
- The status span announces copy, send and target actions. Clear it, then set it on the next frame, so repeating the same message is announced again.
- Contrast: `--ink` on `--paper` 13.3:1; `--pink-ink` on `--pink-soft` 6.0:1; white on `--pink` 5.5:1; white on `--ok` 6.1:1; `--ink-3` on `--paper` 4.7:1.
- Targets: chip × is 22px inside a 26px chip (desktop only); every other control is 34–44px tall.

## Responsive rules

- ≥1024: panel 400px, right-aligned to Share.
- 768: the breadcrumb, saved label and faces hide below 760px; the panel is unchanged.
- <640: the panel becomes `calc(100vw - 16px)` wide, clamped 8px from both edges; it hangs below Share and uses `max-height` with internal scroll when it is taller than the space below. The page title drops to 40px and the columns become one.
- Do not turn this into a bottom sheet on desktop. On a phone app the native share sheet replaces it.

## Acceptance checklist

### Always

- [ ] The trigger has `aria-haspopup="dialog"` and `aria-expanded`; the panel is a non-modal dialog labelled by its title.
- [ ] Email entry commits on Enter, comma, semicolon, Space and blur; invalid text stays and shows an inline error.
- [ ] Backspace on an empty field removes the last chip; every chip has a named remove button.
- [ ] The access picker is `role="menu"` with `menuitemradio` + `aria-checked`, opens on the current value, supports arrows, Home/End, typeahead, Enter/Space, Escape, Tab.
- [ ] Escape closes the innermost layer only; focus returns to the control that opened that layer.
- [ ] Copy shows a Copied state for 2000ms and announces it.
- [ ] Send to is a `role="toolbar"` with one tab stop and arrow-key movement.
- [ ] The QR control is a `role="switch"`; toggling it re-places the panel.
- [ ] Placement flips above when needed, else clamps height with internal scroll; never covers its own trigger.
- [ ] Reduced motion removes translate and shake.

### This demo

- [ ] First frame shows rhea@tidepool.org and jun@fieldpost.net, Can edit, Send 2 invites, and the QR code.
- [ ] People: Nell Sarpong (you) · Owner, Tomas Bell · Can comment.
- [ ] Link is pressleaf.page/plot22/allotment-14; label "Anyone with the link can view".
- [ ] Targets: Email, Message, Broadcast, Embed.
- [ ] Panel 400px, 1.5px ink border, radius 4, 6px pink offset shadow.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: the panel is open under Share, right edges aligned, 8px gap. Two chips are in the invite field: rhea@tidepool.org and jun@fieldpost.net. Invite access reads Can edit. The QR switch is on and the code is visible. Share shows its pressed state.
2. Clicking Share toggles the panel. Opening by click or keyboard focuses the email input.
3. Typing an email and pressing Enter, comma, semicolon or Space turns it into a chip. Leaving the field with text in it does the same. Valid means `x@y.zz`. Invalid text stays in the field, the field shakes 4px twice over 260ms, and the line under it reads "“bad-address” is not an email address". A duplicate reads "… is already on the list".
4. Backspace in an empty field removes the last chip. Each chip has a 22px × button labelled "Remove <email>". Removals are announced.
5. The Send button reads "Send 2 invites", tracks the count, and is disabled at zero. Sending clears the chips and announces "2 invites sent · can edit".
6. The access select (Can edit ▾) and Tomas Bell's quiet select (Can comment ▾) open the same access menu: Can view, Can comment, Can edit, each with a one-line description. The current value has a pink check and focus starts on it. ArrowDown on the select opens it; ArrowUp opens it on the last item.
7. In the access menu: ArrowUp/Down wrap, Home/End jump, typeahead matches the first word or the second word ("v" → Can view, "e" → Can edit), Enter/Space picks and closes, Escape closes only the menu and returns focus to its select, Tab closes it and returns focus to the select.
8. Copy link writes `https://pressleaf.page/plot22/allotment-14` to the clipboard where allowed, turns the button `--ok` green with a check and the word Copied, announces "Link copied to clipboard", and reverts after 2000ms. Clicking again restarts the 2000ms.
9. Send to is a toolbar: Email, Message, Broadcast, Embed. One tab stop; ArrowLeft/Right move and wrap; Home/End jump. Each button announces what it opened, shown in green next to the Send to label.
10. The QR switch toggles the code and re-places the panel because its height changed.
11. Escape with the panel open (and no menu open) closes the panel and returns focus to Share. Clicking outside the panel closes it without moving focus. Tabbing out of the panel closes it.
12. Placement: below the button if it fits; above if it doesn't fit below and does fit above; otherwise below with `max-height` equal to the space left and internal scroll. Left is clamped 8px inside the viewport. The access menu uses the same function with a 4px gap, so near the bottom it opens upward.

## Tokens

```css
:root {
  --bg: #f1e8d6;        /* desk, with a 6px navy dot screen at 7% */
  --paper: #fffaf0;     /* top bar, page, panel, menu */
  --ink: #1f2a55;       /* text, 1.5px borders, Send button */
  --ink-2: #4d5577;
  --ink-3: #69708f;     /* labels, descriptions */
  --line: #d9cdb4;      /* section rules, dashed URL box */
  --line-2: #e8dfcc;
  --pink: #c8264f;      /* Share, offset shadow, switch on, focus */
  --pink-soft: #fbdde3; /* chips, menu focus, page shadow */
  --pink-ink: #a3173c;  /* chip text, errors, check marks */
  --ok: #1f6e5a;        /* Copied state, status text */

  --display: "Gloock", Georgia, serif;
  --sans: "Atkinson Hyperlegible", system-ui, sans-serif;

  --r: 4px;
  --border: 1.5px solid var(--ink);
  --shadow-panel: 6px 6px 0 var(--pink);
  --shadow-menu: 4px 4px 0 var(--ink);
  --shadow-btn: 3px 3px 0 var(--ink);

  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
}
```

## Typography

| Role | Family | Size | Weight | Notes |
| --- | --- | --- | --- | --- |
| Logo | Gloock | 22px | 400 | "leaf" in `--pink` |
| Page title | Gloock | 64px | 400 | line-height .95, -0.02em |
| Panel title | Gloock | 22px | 400 | -0.01em, followed by a 12px `--ink-3` subtitle |
| QR caption title | Gloock | 18px | 400 | |
| Section label | Atkinson Hyperlegible | 11.5px | 700 | uppercase, 0.08em, `--ink-3` |
| Body, inputs | Atkinson Hyperlegible | 13–14px | 400 | |
| Chip | Atkinson Hyperlegible | 12.5px | 700 | `--pink-ink` on `--pink-soft` |
| Buttons | Atkinson Hyperlegible | 13–14px | 700 | |
| Menu item | Atkinson Hyperlegible | 13.5px / 12px | 700 / 400 | title / description |

Atkinson is chosen for legibility of email addresses (l, I, 1 and 0, O are distinct). Do not set addresses in the display face.

## Implementation notes

**Flip, else clamp height.** Reset `max-height` before measuring or the panel never grows back.

```js
function place(el, a, { gap = 8 } = {}) {
  el.style.maxHeight = '';
  const r = a.getBoundingClientRect(), m = el.getBoundingClientRect(), pad = 8;
  const below = innerHeight - pad - r.bottom - gap, above = r.top - gap - pad;
  let top = r.bottom + gap;
  if (m.height > below && m.height <= above) top = r.top - gap - m.height;
  else if (m.height > below) el.style.maxHeight = below + 'px'; // panel has overflow:auto
  let left = r.right - m.width;
  left = Math.max(pad, Math.min(left, innerWidth - pad - m.width));
  el.style.top = top + 'px'; el.style.left = left + 'px';
}
```

**Layered Escape.** The menu handles its own Escape and stops it; the document handler only closes the panel when no menu is open.

```js
menu.addEventListener('keydown', e => {
  if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeMenu(); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !panel.hidden && !menuAnchor) closePanel(); // focus → Share
});
```

**Copied state that restarts.** Keep one timer; clear it on every click.

```js
copy.onclick = () => {
  navigator.clipboard?.writeText(url).catch(() => {});
  copy.dataset.copied = ''; label.textContent = 'Copied'; announce('Link copied to clipboard');
  clearTimeout(t); t = setTimeout(() => { delete copy.dataset.copied; label.textContent = 'Copy link'; }, 2000);
};
```

The clipboard call is wrapped because sandboxed iframes reject it. The UI state must not depend on the promise resolving.

Common mistakes:

- `role="menu"` on the whole panel. Arrow keys then fight the text input and screen readers stop echoing typed characters.
- Putting the access menu inside the transformed panel. `position: fixed` becomes relative to the panel and the menu lands in the wrong place.
- One Escape closing both layers.
- A native `<select>` for access. It cannot show the description lines and its open state cannot be styled to the family.
- Letting the panel cover the Share button when it's too tall. Clamp the height instead.
- A real QR library. The demo draws a deterministic decorative grid with three finder squares; a product generates a real code server-side.
- Brand logos for the send targets. Use generic glyphs and the product's own names.

Rebuild order:

1. Top bar, Share button, and the page behind.
2. The panel shell with sections and the placement function.
3. Chip input with validation and the error line.
4. The shared access menu and its keyboard model.
5. Copy with the 2000ms state, toolbar with roving focus, QR switch.
6. Layered Escape, outside click, focus-out close, focus return.
7. Check 375px and reduced motion.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
