<!-- Design Lounge Nº 059 · "Settings page with sticky nav" · www.designlounge.live -->

# Settings page with sticky nav

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The account-settings page of *Halden Post*, a parcel-logistics product. A 56px top bar, then a centred two-column layout: a 220px left column that sticks to the top of the scroll container and lists six sections along a 1px hairline (the current section gets a 2px teal bar and weight 500), and a 720px right column of six sections, each a heading, a one-line description and a white card of rows. Rows hold a label + hint on the left and one control on the right: a 40 × 24 switch, a 36px select, a text input or a small button. The last section is a danger zone with red-tinted borders and a "Delete workspace" button that arms an inline confirmation requiring the workspace name to be typed. The feeling is neutral, quiet and trustworthy: one teal, one red, no other colour.

## Structure

```
1280 × 800
┌────────────────────────────────────────────────────────────────────────────┐
│ ■ Halden Post / Settings                                ● All changes saved │ 56  top bar
├────────────────────────────────────────────────────────────────────────────┤
│        ┌ sticky ─────────┐   Profile                                       │
│        │ Account settings│   How you appear to teammates …                 │
│        │ ▌Profile        │   ┌──────────────────────────────────────────┐  │
│        │  Notifications  │   │ Display name        [ Mara Lindqvist   ] │  │ rows 16/20 pad
│        │  Security       │   │ Language            [ English (UK)  ⌄ ] │  │
│        │  Billing        │   │ Time zone           [ Europe/Oslo   ⌄ ] │  │
│        │  Integrations   │   └──────────────────────────────────────────┘  │
│        │  Danger zone    │   Notifications                                 │
│        │                 │   ┌──────────────────────────────────────────┐  │
│        │ Signed in as …  │   │ Delivery exceptions               (●━━) │  │ switch 40×24
│        └─────────────────┘   │ Daily digest                      (●━━) │  │
│                              │ Mentions                          (━━○) │  │
│          220px      48px     └───────── 720px ────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
 wrap = 220 + 48 + 720 = 988px, centred; padding 40px 32px 80px
```

- `<header class="top">` — logo square, product, slash, page name, `.saved` status.
- `.scroll` — `flex:1; overflow-y:auto` scroll container.
  - `.wrap` — grid `220px 1fr`, gap 48px, `align-items:start`.
    - `<aside class="side">` — `position:sticky; top:0`; `<h1>`, `<ul id="nav">` of six `<a href="#id">`, `.meta` paragraph.
    - `<main>` — six `<section id>` each with `<h2>`, `<p>`, `.card` of `.row`s. Danger card also has `.confirm` row.
- Switch markup: `<label class="sw"><input type="checkbox"><i></i></label>` — the `<i>` is the track, its `::after` the knob.

## Motion

| Element           | Trigger        | Property         | From → To                         | Duration | Easing   |
|-------------------|----------------|------------------|-----------------------------------|---------:|----------|
| `.sw i` (track)   | check          | background       | `--line-2` → `--accent`           | 200ms    | `--ease` |
| `.sw i::after` (knob) | check      | transform        | `translateX(0)` → `translateX(16px)` | 200ms | `--expo` |
| nav `a`           | hover / current| color, border-left-color | `--ink-2`/transparent → `--ink`/`--accent` | 150ms | `--ease` |
| inputs / selects  | hover / focus  | border-color, box-shadow | see States                 | 150ms    | `--ease` |
| buttons           | hover          | background, border-color, color | see States          | 150ms    | `--ease` |
| `.scroll`         | nav click      | scrollTop        | → `section.offsetTop − 24`        | UA smooth | —       |
| `.confirm`        | arm / cancel   | display          | none ↔ flex                       | 0        | —        |

Reduced motion: `scroll-behavior: auto` and `behavior: 'auto'` in `scrollTo`; all transitions 1ms.

## States

- **Nav current:** `aria-current="true"`, `--ink`, weight 500, 2px `--accent` left bar overlapping the 1px hairline (`margin-left: -1px`).
- **Nav hover:** `--ink`. **Danger zone item:** always `--danger`, still gets the teal bar when current.
- **Switch off:** track `--line-2`, knob left (3px inset). **On:** track `--accent`, knob at +16px. **Focus-visible:** 2px `--accent` outline, 2px offset, on the track.
- **Select / input rest:** 1px `--line-2`, 6px radius, 36px tall, min-width 180px; select is wrapped in a `.sel` span whose `::after` draws a 7px chevron (1.5px right+bottom border rotated 45°) 13px from the right. **Hover:** border `--ink-3`. **Focus:** border `--accent`, ring `0 0 0 3px var(--accent-soft)`.
- **Button secondary:** white, 1px `--line-2`; hover `--bg` + `--ink-3` border.
- **Button danger:** `--danger` text, `--danger-line` border; hover solid `--danger`, white text.
- **Danger card:** `--danger-line` borders on card and rows.
- **Armed:** `.armed` on the card shows `.confirm`; trigger `aria-expanded="true"`.
- **Delete button disabled:** opacity .45, `cursor: not-allowed`, until input equals `halden-post`.
- **Saved status:** static in the demo; wire it to your form state (dot `--accent` = saved, `--ink-3` = saving).

## Accessibility

- Every control has a visible label in the row; controls also carry `aria-label` matching it so the accessible name survives if the row layout changes.
- Switches are native checkboxes (visually hidden but full-size and clickable inside the `<label>`), so Space toggles and screen readers announce "checkbox, checked". If you need "switch" semantics add `role="switch"`.
- Section nav links use real `href="#id"` anchors; JS intercepts to scroll the container (needed because the page body does not scroll). `aria-current="true"` marks the active one.
- The delete trigger has `aria-expanded` + `aria-controls="confirm"`; on arm, focus moves to the confirmation input; on cancel, focus returns to the trigger.
- Keyboard order: top bar (none) → nav links (6) → Profile controls → … → Danger buttons → confirmation input → delete → cancel.
- Contrast: `--ink-2` on white 7.0:1; `--ink-3` on `--bg` 3.6:1 (12–13px meta only); teal on white 5.4:1; `--danger` on white 6.9:1; white on `--danger` 6.9:1.
- Hit targets: switches 40 × 24 with the whole 40 × 24 clickable; buttons 36px; nav items 34px tall.

## Responsive rules

- ≥ 1280: as specified; wrap 988px centred.
- 1024–1279: identical (fits with 32px side padding).
- 768–1023: single column; the nav becomes a horizontal wrapping row of chips with a 2px bottom bar for the current item; meta hidden; `position: static`.
- < 640: rows stack (label above control), controls 100% wide, switches stay right-aligned in a flex row; confirmation row wraps to two lines.

## Acceptance checklist

- [ ] Page background `#f5f5f4`, cards white with 1px `#e6e5e2` border, 10px radius and `0 1px 2px rgba(28,28,26,.04)` shadow.
- [ ] Layout is a centred 220px + 48px + 720px grid with the left column `position: sticky; top: 0` inside the scroll container.
- [ ] Nav has a 1px `#e6e5e2` left hairline; the current item shows a 2px `#0f766e` bar, weight 500 and `aria-current="true"`.
- [ ] Scroll-spy selects the last section whose `offsetTop ≤ scrollTop + 120`, and the last section when scrolled to the bottom.
- [ ] Clicking a nav item smooth-scrolls the section to 24px below the top of the scroll area.
- [ ] Switches are 40 × 24 with an 18px knob that travels 16px over 200ms `cubic-bezier(.16,1,.3,1)`; on-track is `#0f766e`.
- [ ] Selects are 36px with `appearance:none` and a CSS-drawn chevron (no image, no data URI); focus shows a `#0f766e` border with a 3px `#e2f1ef` ring.
- [ ] Danger card and its rows use `#f0c4bf` borders; danger buttons are outlined red and fill `#b42318` on hover.
- [ ] "Delete workspace" reveals a confirmation row and moves focus to its input; the red button enables only when the input equals `halden-post`.
- [ ] Cancel hides the row, clears the input and returns focus to the trigger.
- [ ] All controls show a visible focus ring (2px teal, 2px offset; ring on inputs).
- [ ] Reduced motion: nav clicks jump instantly.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: "Profile" is current in the nav; the Profile and Notifications cards are visible; two of four notification switches are on; "All changes saved" with a 6px teal dot sits at the right of the top bar.
2. Scroll the right column (the whole page area below the top bar is one scroll container; the nav is `position: sticky; top: 0` inside it): the current nav item updates to the last section whose top is ≤ scrollTop + 120px. At the very bottom, "Danger zone" becomes current regardless.
3. Click a nav item: the container scrolls smoothly so that section's top sits 24px below the top of the scroll area; the item becomes current.
4. Hover a nav item: colour `--ink-2` → `--ink` over 150ms. "Danger zone" is always `--danger`.
5. Click a switch: the track animates `--line-2` → `--accent` over 200ms and the 18px knob slides 16px right with expo-out easing. Space toggles it when focused; focus draws a 2px teal ring around the track.
6. Focus a select or text input: border becomes `--accent` with a 3px `--accent-soft` ring; hover darkens the border to `--ink-3`.
7. Hover a secondary button: background `--bg`, border `--ink-3`. Hover a danger button: fills `--danger` with white text.
8. Click "Delete workspace": the card gets `.armed`, a confirmation row appears beneath (text input + disabled red "Permanently delete" + "Cancel"), `aria-expanded` becomes true, focus moves to the input. Typing exactly `halden-post` enables the red button. Cancel collapses the row, clears the input and returns focus to the trigger.
9. Reduced motion: smooth scroll becomes instant; switch transitions 1ms.

## Tokens

```css
:root {
  /* colour — warm neutral greys, one teal, one red */
  --bg:          #f5f5f4;  /* page */
  --surface:     #ffffff;  /* cards, top bar, inputs */
  --line:        #e6e5e2;  /* card borders, row rules, nav hairline */
  --line-2:      #d4d3cf;  /* input borders, switch off-track */
  --ink:         #1c1c1a;
  --ink-2:       #5f5e5a;  /* hints, nav rest */
  --ink-3:       #8b8a85;  /* meta, saved status, hover borders */
  --accent:      #0f766e;  /* current-section bar, switch on, focus */
  --accent-soft: #e2f1ef;  /* focus ring, "Enabled" tag */
  --danger:      #b42318;
  --danger-soft: #fdf1f0;
  --danger-line: #f0c4bf;

  /* type */
  --sans: "Onest", system-ui, sans-serif;

  /* layout */
  --top-h: 56px;
  --nav-w: 220px;
  --content-w: 720px;
  --col-gap: 48px;
  --row-pad: 16px 20px;
  --control-h: 36px;
  --switch-w: 40px; --switch-h: 24px; --knob: 18px; --knob-travel: 16px;
  --r: 10px;      /* cards */
  --r-sm: 6px;    /* controls */
  --shadow: 0 1px 2px rgba(28, 28, 26, .04);
  --spy-offset: 120px;
  --scroll-margin: 24px;

  /* motion */
  --t-micro: 150ms;
  --t-switch: 200ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role            | Family | Size | Weight | Line-height | Tracking | Notes |
|-----------------|--------|-----:|-------:|------------:|---------:|-------|
| Page title (h1) | Onest  | 22px | 600    | 1.2         | −0.02em  | in the sticky column |
| Section title   | Onest  | 17px | 600    | 1.3         | −0.01em  | |
| Section lede    | Onest  | 14px | 400    | 1.5         | 0        | `--ink-2` |
| Nav item        | Onest  | 14px | 400 / 500 current | 1.5 | 0     | 7px 14px padding |
| Row label       | Onest  | 14px | 500    | 1.5         | 0        | |
| Row hint        | Onest  | 13px | 400    | 1.5         | 0        | `--ink-2` |
| Controls        | Onest  | 14px | 400    | 1           | 0        | selects, inputs |
| Buttons         | Onest  | 13px | 500    | 1           | 0        | 36px tall, 14px side padding |
| Tag             | Onest  | 11px | 500    | 1.4         | 0        | teal on `--accent-soft`, pill |
| Meta / saved    | Onest  | 12–13px | 400 | 1.6         | 0        | `--ink-3` |
| Top bar         | Onest  | 14px | 500    | 1           | 0        | |

## Implementation notes

**Scroll-spy on a scroll container** (not `window`), with a bottom-of-page guard so the last short section can become current:

```js
const sc = document.getElementById('scroll');
const links = [...document.querySelectorAll('#nav a')];
const secs = links.map(a => document.querySelector(a.getAttribute('href')));
function spy() {
  const y = sc.scrollTop + 120; let i = 0;
  secs.forEach((s, k) => { if (s.offsetTop <= y) i = k; });
  if (sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2) i = secs.length - 1;
  links.forEach((a, k) => k === i ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
}
sc.addEventListener('scroll', spy, { passive: true }); spy();
```

`offsetTop` is relative to the nearest positioned ancestor; make sure `.scroll` (or `.wrap`) is `position: relative`, or subtract the container's own offset.

**Switch with a native checkbox and a pseudo-element knob:**

```css
.sw { position: relative; width: 40px; height: 24px; }
.sw input { position: absolute; inset: 0; opacity: 0; margin: 0; width: 100%; height: 100%; cursor: pointer; }
.sw i { position: absolute; inset: 0; border-radius: 999px; background: var(--line-2); transition: background 200ms var(--ease); }
.sw i::after { content: ""; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%;
  background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.2); transition: transform 200ms var(--expo); }
.sw input:checked + i { background: var(--accent); }
.sw input:checked + i::after { transform: translateX(16px); }
.sw input:focus-visible + i { outline: 2px solid var(--accent); outline-offset: 2px; }
```

**Armed danger zone** keeps the confirmation in the DOM (`display:none` → `flex`) so `aria-controls` always resolves; enable the destructive button only on an exact match: `del.disabled = typed.value.trim() !== 'halden-post'`.

Common mistakes: sticking the nav to `window` when the body does not scroll (it never sticks); using `scroll-margin-top` alone for nav clicks inside a container (works for anchors, but you still need the JS if you intercept); hiding the checkbox with `display:none` (kills keyboard access); colouring hint text below 4.5:1.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
