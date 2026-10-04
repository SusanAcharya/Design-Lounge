<!-- Design Lounge Nº 365 · "Presence dock with follow mode" · designlounge.vercel.app -->

# Presence dock with follow mode

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A floating presence dock for a collaborative document editor, Tessera. The document is a bone-coloured workspace with a single paper sheet in a book serif. Pinned 24px above the bottom is a near-black 60px pill: "5 here", your own avatar, four collaborators ringed in their cursor colours with live status dots, a hairline, and a lime "Invite" button. Each collaborator's named arrow cursor drifts through the section they're working in. Clicking a face turns on follow mode: the viewport gains a 3px frame in that person's colour, a pill says who you're following, and the page scrolls to keep their cursor in view until you scroll yourself or press Escape. The detail worth copying is that follow mode ends the moment the user takes over scrolling. That's how it should feel in a real editor.

## Reference behaviour

1. First frame: the document is at the top. Asha's coral cursor and Leo's faded amber (idle) cursor are moving in the introduction and §1. Sunita's mint cursor is in §2, just behind the dock. Dev's blue cursor is below the fold in §3, where his selection is highlighted in blue.
2. Each active cursor picks a new target every 1.3–3.2s, a random point inside a paragraph, heading or list item of its section, and eases there with an exponential approach (time constant 260ms). Dev picks his own selection half the time. The idle cursor moves every 7s and sits at 70% opacity.
3. Hovering or focusing a collaborator avatar lifts it 2px and shows a dark tooltip card: name, location ("Selecting in §3 · Risks"), and "Click to follow" in their colour.
4. Clicking an avatar starts follow mode. The avatar fills with its colour and pulses an expanding ring every 1.8s. A 3px viewport frame fades in over 200ms in the same colour. A pill at the top centre reads "Following Dev Raman · Esc to stop". The scroller eases (time constant 180ms) so the cursor sits 42% down the viewport. A status toast reads "Following Dev Raman".
5. Clicking the same avatar again, pressing Escape, wheeling, touch-scrolling, or pressing PageUp/PageDown/arrows/Home/End/Space in the page stops following. The toast reads "Stopped following".
6. Clicking a different avatar switches the follow target directly.
7. Invite opens a 320px popover above the button with the email field focused, an access select (Can edit / Can comment / Can view), and "Send invite".
8. Sending with an invalid email marks the field `aria-invalid`, turns its border rust, and shows "Enter an email address, like name@studio.np".
9. Sending a valid email closes the popover, appends a dashed-ring "pending" avatar with the first two letters of the address, returns focus to Invite, and toasts "Invite sent to kiran@studio.np".
10. Escape or a click outside closes the popover.
11. "Your" avatar (YO) is not a button. You can't follow yourself.

## Structure

```
┌────────────────────────────────────────────────────────────── 1280 ──┐
│ ■ Tessera / Launch team / Field notes: the Pokhara pop-up   Last edit │ 56px top bar
├──────────────────────────────────────────────────────────────────────┤
│            ┌──────────────── sheet 760px ────────────────┐           │
│            │  Field notes: the Pokhara pop-up   44px      │           │ padding 72/84
│            │  Draft 3 · Launch team · Updated 4 Oct       │           │
│            │  intro…     ↖Asha                            │           │
│            │  1. What we're opening        ↖Leo           │           │
│            │  2. Who walks in   ↖Sunita                   │           │
│            │  3. Risks — [Dev's selection]  ↖Dev          │           │
│            │  4. Opening week (day table)                 │           │
│            └──────────────────────────────────────────────┘           │
│        ┌─────────────────────────────────────────────────┐            │
│        │ 5 here (YO)(AT)(DR)(SG)(LB) │ [+ Invite]        │ 60px pill  │
│        └─────────────────────────────────────────────────┘ bottom 24px│
└──────────────────────────────────────────────────────────────────────┘
```

- Top bar: `header` with a 22px mark, breadcrumbs and "Last edit by Asha just now".
- Scroller: an absolutely positioned `div` from 56px to the bottom, `overflow: hidden auto`. Follow mode scrolls this element, not the window.
- Sheet: `article`, `position: relative`, so cursors are positioned in document coordinates and scroll with the text.
- Cursors: `div.cur` absolutely positioned in the sheet with `transform: translate()`, a 20px SVG arrow filled in the person's colour with a 1.3px ink outline, and a name tag offset 14px/17px. `pointer-events: none`.
- Frame: a fixed `div` with a 3px border and a centred `b` label, `aria-hidden` (the toast carries the message).
- Dock: `div role="region" aria-label="People in this document"`, a `ul` of avatars, a separator, and the Invite button with a `form role="dialog"` popover.
- Toast: `p role="status"` fixed at 72px from the top.

## Tokens

```css
:root {
  --bone: #ece9e1;      /* workspace and top bar */
  --sheet: #fbfaf6;     /* paper, popover */
  --ink: #17181c;       /* text, dock */
  --ink-2: #4a4b52;
  --ink-3: #6e6f76;     /* meta */
  --line: #dcd8cd;      /* hairlines */
  --dock: #17181c; --dock-2: #2a2b31;  /* pill, avatar fill, separator */
  --dock-ink: #f3f1ea; --dock-mute: #a3a29b;
  --lime: #d4f25a;      /* Invite, focus on dark */
  --p1: #ff7a59;  /* Asha  */
  --p2: #6aa8ff;  /* Dev   */
  --p3: #3fd0a0;  /* Sunita */
  --p4: #f5b82e;  /* Leo   */
  --serif: "Literata", Georgia, serif;
  --ui: "Albert Sans", system-ui, sans-serif;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --avatar: 42px; --dock-h: 60px; --frame: 3px;
}
```

Presence colours are chosen so ink text passes on all four (each above 7:1). Name tags and the follow pill use ink text, never white.

## Typography

| Role | Family | Size | Weight | Line-height |
| --- | --- | --- | --- | --- |
| Doc title | Literata | 44px | 600 | 1.08, −0.02em |
| Section heading | Literata | 22px | 600 | 1.25 |
| Body / list | Literata | 17px | 400 | 1.65, max 62ch |
| Meta line | Albert Sans | 13px | 500 | `--ink-3` |
| Breadcrumbs | Albert Sans | 13.5px | 400, current 600 | |
| Avatar initials | Albert Sans | 13px | 600 | |
| Cursor tag | Albert Sans | 12px | 600 | ink on person colour |
| Tooltip | Albert Sans | 13px name / 12px meta / 11.5px hint | 600 / 400 | |
| Invite | Albert Sans | 14px | 700 | |
| Popover title | Literata | 18px | 600 | |

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Cursor drift | every 1.3–3.2s | transform | current → target | exponential, τ 260ms | jumps to target every 3.5s |
| Follow scroll | each frame while following | scrollTop | current → cursor at 42% | exponential, τ 180ms | jumps |
| Follow frame | follow on/off | opacity | 0 ↔ 1 | 200ms `--ease` | instant |
| Followed avatar | follow on | box-shadow ring | 0 → 9px, fading | 1.8s `--ease`, infinite | static 3px ring |
| Avatar hover | hover | translateY | 0 → −2px | 160ms `--ease` | none |
| Tooltip | hover / focus | opacity, translateY | 0, 4px → 1, 0 | 140ms | instant |
| Popover | open | opacity, translateY | 0, 8px → 1, 0 | 260ms `--expo` | none |
| Toast | message | opacity, translateY | 0, −8px → 1, 0; hides after 2.2s | 200ms | instant |

Run cursors and follow scroll from one `requestAnimationFrame` loop with a real `dt`, clamped to 64ms, so a background tab doesn't teleport everything on return.

## States

- Avatar active: 2px colour ring, `--dock-2` fill, a 12px green `#4ade80` status dot with a 2.5px dock-coloured border.
- Avatar idle: grey status dot; the cursor is at 70% opacity.
- Avatar following: filled with its colour, ink initials, pulsing ring, `aria-pressed="true"`.
- Avatar pending: dashed `--dock-mute` ring, muted initials, no status dot, not a button.
- You: muted ring, default cursor, no hover lift.
- Invite hover: brightness 1.06. Pressed: down 1px.
- Email invalid: rust `#c2410c` border plus message in `#b4380a`.
- Focus-visible: 2px lime outline offset 3px on dark; 2px ink outline elsewhere.
- Text selection by a collaborator: their colour at 32% behind the text plus a 2px underline in full colour.

## Accessibility

- Each collaborator is a `button` with `aria-pressed` and a full name: "Dev Raman, Selecting in §3 · Risks. Follow".
- Tooltips and cursors are `aria-hidden`; the button name already carries the information.
- Follow start/stop is announced through the `role="status"` toast.
- Escape stops following, or closes the popover first if it's open.
- The Invite button has `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`. The popover is a labelled `role="dialog"` form. Focus goes to the email field on open and back to Invite on close.
- The error message is linked with `aria-describedby` and is a polite live region.
- Pending invites are `role="img"` with a label "kiran@studio.np, invited, pending".
- Body text `#26272c` on `#fbfaf6` is above 13:1. Dock text `#f3f1ea` on `#17181c` is above 15:1. Ink on lime is above 14:1.
- Avatars are 42px (38px on phones).

## Responsive rules

- ≥1280: as drawn.
- 1024 / 768: the sheet stays 760px or `100% − 32px`; the dock is unchanged.
- <640: hide the breadcrumb path and "Last edit"; sheet padding 40px/22px; title 32px. Hide "5 here". Avatars 38px with 4px gaps. Invite collapses to its plus icon (the label stays as accessible text). The popover is `min(320px, 100vw − 24px)`.
- The scroller hides horizontal overflow so cursor tags near the edge never cause sideways scroll.

## Acceptance checklist

### Always

- [ ] Each collaborator has one colour, used for avatar ring, cursor, tag, tooltip hint and follow frame.
- [ ] Cursors live in document coordinates and scroll with the text.
- [ ] Cursors ease toward targets; one rAF loop drives all of them.
- [ ] Clicking a face toggles follow mode with `aria-pressed`, a coloured frame and a label.
- [ ] Follow mode stops on user scroll (wheel, touch, keys) and on Escape.
- [ ] You can't follow yourself.
- [ ] Invite validates the email, then adds a pending seat and returns focus.
- [ ] Follow changes and invites are announced via a status region.
- [ ] Reduced motion: cursors jump, the ring is static, scrolling is instant.
- [ ] No horizontal overflow at 375px.

### This demo

- [ ] Dock is a 60px `#17181c` pill, 24px from the bottom, with "5 here".
- [ ] Collaborators: Asha Thapa `#ff7a59`, Dev Raman `#6aa8ff`, Sunita Gurung `#3fd0a0`, Leo Brandt `#f5b82e` (idle).
- [ ] Invite is lime `#d4f25a` with ink text.
- [ ] Dev's selection in §3 is highlighted in blue.
- [ ] The doc is "Field notes: the Pokhara pop-up" in Literata.

## Implementation notes

Pick targets relative to the sheet, so they stay right when the window resizes or the page scrolls:

```js
function rel(el) {
  const a = el.getBoundingClientRect(), b = sheet.getBoundingClientRect();
  return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height };
}
function pickTarget(p) {
  const el = p.els[Math.floor(Math.random() * p.els.length)], r = rel(el);
  return { x: r.x + Math.min(r.w, 560) * (.05 + Math.random() * .9),
           y: r.y + r.h * (.15 + Math.random() * .7) };
}
```

One loop for cursors and follow scrolling, using frame-rate-independent easing:

```js
function loop(t) {
  const dt = Math.min(64, t - last); last = t;
  const k = reduce.matches ? 1 : 1 - Math.exp(-dt / 260);
  for (const p of PEOPLE) {
    if (t > p.next) { p.tgt = pickTarget(p); p.next = t + 1300 + Math.random() * 1900; }
    p.pos.x += (p.tgt.x - p.pos.x) * k; p.pos.y += (p.tgt.y - p.pos.y) * k;
    p.cur.style.transform = `translate(${p.pos.x}px, ${p.pos.y}px)`;
  }
  if (following) {
    const view = scroller.clientHeight, top = sheet.offsetTop + following.pos.y;
    const goal = Math.max(0, Math.min(scroller.scrollHeight - view, top - view * .42));
    scroller.scrollTop += (goal - scroller.scrollTop) * (1 - Math.exp(-dt / 180));
  }
  requestAnimationFrame(loop);
}
```

Stop following on user intent, not on `scroll`. The follow loop itself fires `scroll` events, so listening to `scroll` would cancel follow on its first frame:

```js
['wheel', 'touchmove'].forEach(ev =>
  scroller.addEventListener(ev, () => following && follow(null), { passive: true }));
```

Common mistakes:

- Positioning cursors with `position: fixed`. They float in place while the text scrolls away.
- White text on the presence colours. Use ink.
- Animating cursors with CSS transitions retargeted every second. They stutter on retarget; the eased loop doesn't.
- Overlapping avatar stacks with −12px margins. Each face here is a button, so it needs its full 42px.
- Leaving follow mode on after the user scrolls. It fights them.
- Making "you" clickable.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
