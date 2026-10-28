<!-- Design Lounge Nº 571 · "Honest exit-intent offer popup" · www.designlounge.live -->

# Honest exit-intent offer popup

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The popup a small online tea shop, Marlow & Pike, shows when a visitor moves to leave the loose-leaf page. It is a 760px split card: a 300px drawn still life on the left (a green Darjeeling tin, a steaming cup, a rotated "20% off loose-leaf" stamp) and the pitch on the right. The pitch gives one offer and the true reason for it: "We bought too much of this year's Darjeeling. The autumn flush came in 40 kg over our order". Then an email field, and two buttons of equal size: "No thanks" and "Send my code". It rises 28px into place over 640ms. It must read as a shopkeeper being straight with you. No countdown, no "No, I hate saving money", no hidden close button, no email wall in front of the code.

## Structure

```
1280 × 800
┌──────────────────────────────────────────────────────────────────────┐
│ Marlow & Pike  Loose leaf Teaware Gifts Visit          Basket (0)    │ 68
├──────────────────────────────────────────────────────────────────────┤
│ Loose-leaf tea (44px)                                               │
│ ┌──────┐  ┌──────────── dialog 760 × ~510 ──────────────┐ ┌──────┐  │
│ │ tin  │  │ ( 20% )        │ Before you go           [x] │ │ tin  │  │
│ │      │  │ stamp -8deg    │ We bought too much of       │ │      │  │
│ └──────┘  │                │ this year's Darjeeling.     │ └──────┘  │
│           │   art 300px    │ (34px Young Serif)          │           │
│           │   radial warm  │ reason paragraph, 40ch      │           │
│           │   ┌───┐  ~     │ Where should we send...     │           │
│           │   │tin│ (cup)  │ [you@example.com         ]  │           │
│           │   └───┘        │ [No thanks] [Send my code]  │           │
│           │ ~~~ ground ~~~ │ fine print 12.5px           │           │
│           └────────────────┴─────────────────────────────┘           │
└──────────────────────────────────────────────────────────────────────┘
```

- `<header class="nav">` and `<main class="shop">` with a 4-column product grid (drawn mini tins on tinted tiles).
- `<dialog aria-labelledby="ot" aria-describedby="ow">` opened with `showModal()`; when open, `display: grid; grid-template-columns: 300px 1fr`.
  - `.art` (`aria-hidden`): a radial gradient sky `radial-gradient(120% 80% at 20% 10%, #f6e3c4, #ecc994 45%, #d9a868)`, a 96px rotated stamp, and an inline SVG still life bottom-centred at 300px wide (tin and lid with left-lit linear gradients, label with Young Serif type, cup with a radial tea surface, three steam paths, two leaves, a soft ground shadow).
  - `.body`: close button absolutely top right; `#ask` (kicker, `<h2>`, reason, `<form novalidate>` with label, email input, alert line, a 2-column button grid, fine print); `#done` (hidden until success).
- `.peek` pill, fixed bottom right, hidden while the popup is open.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Notes |
|---|---|---|---|---:|---|---|
| dialog | open | translateY | 28px → 0 | 640ms | `--ease-out` | the soft rise |
| dialog | open | opacity | 0 → 1 | 400ms | `--ease` | fades faster than it rises |
| backdrop | open | background | transparent → scrim | 400ms | `--ease` | |
| steam paths | loop | opacity, translateY | 0, 8px → .85 at 30% → 0, -18px | 4800ms | `--ease` | stagger 1.6s |
| `#done` | success | opacity, translateY | 0, 8px → 1, 0 | 400ms | `--ease-out` | |
| buttons | active | translateY | 0 → 1px | 160ms | `--ease` | |
| sheet (< 640px) | open | translateY | 100% → 0 | 640ms | `--ease-sheet` | |

Reduced motion: no rise, no steam loop (steam paths sit still at .6 opacity), state swaps are instant.

## States

- **Input:** focus border `--ink-2` with a 3px `rgba(42,31,24,.1)` ring (neutral, so focus never looks like an error); invalid border `--accent`, ring `--accent-soft`; message in `--accent` 13px/500 under the field.
- **No thanks:** outline button, same 48px height and width as the primary. Hover `--accent-soft` fill.
- **Send my code:** oxblood fill, hover `--accent-hover`.
- **Close:** 40px circle, transparent, hover `--accent-soft`. On phones it sits on a `rgba(255,250,242,.9)` disc so it reads over the art.
- **Success:** right column replaced; headline takes focus (`tabindex="-1"`, no outline).
- **Copy code:** label "Copied" for 1800ms.
- **Focus-visible:** 2px `--accent` outline, 3px offset.

## Accessibility

- `showModal()` traps focus; Escape closes; the page behind is inert. Focus lands in the email field on open, on the success headline after submit, and on the "See the Darjeeling offer" pill after close.
- The dialog is labelled by the headline and described by the reason paragraph, so a screen reader hears the offer and why.
- The input has a visible `<label>` and `autocomplete="email"`; it is described by the error line (`role="alert"`) and the fine print, so the email promise is read with the field.
- The illustration is `aria-hidden`; the stamp repeats the offer that the paragraph already states.
- Contrast: every text token passes 4.5:1 on the panel (figures in Tokens). The stamp text `#fff6ee` on `#8b2f22` is 7.78:1. Field and outline-button borders are 4.00:1.
- Targets: 48px buttons and field, 40px close, 44px reopen pill.
- Dark-pattern rules, as acceptance items: the decline is a real button labelled "No thanks", equal in size; the close button is visible; the popup never reopens itself; the code is shown on screen after submit.

## Responsive rules

- ≥ 1280: as specified, 760px.
- 1024 and 768: the card keeps its two columns down to 792px viewport (760 + 2 × 16).
- < 900: shop grid 2 columns, nav links hidden except Basket.
- < 640: bottom sheet, full width, radius `22px 22px 0 0`, scrolls inside. The art becomes a 150px band across the top with the SVG at 170px; the stamp shrinks to 76px. Headline 28px. The two buttons stay side by side at 50/50.

## Acceptance checklist

**Always**

- [ ] One offer, with a stated reason a customer could check, and a stated end date.
- [ ] The decline button is labelled plainly, has the same size as the primary, and closes at once.
- [ ] A visible close button, Escape and a scrim click all close.
- [ ] Exit intent fires at most once per page view and never after a dismissal; a pill lets the visitor reopen.
- [ ] Validation messages say what to fix, appear under the field, and clear on input.
- [ ] After submit the code is shown on screen with Copy, not only promised by email.
- [ ] The fine print says how many emails will follow.
- [ ] The rise is 28px over 640ms with opacity on a shorter 400ms clock; reduced motion removes it and stops the steam.
- [ ] Below 640px it is a full-width bottom sheet with no sideways scroll at 390px.

**This demo**

- [ ] Headline: "We bought too much of this year's Darjeeling." in Young Serif 34px.
- [ ] Offer: 20% off any loose-leaf tea until Sunday 1 November; code `FLUSH20`.
- [ ] Art: green tin with a "Darjeeling / AUTUMN FLUSH" label, cup with three steam strokes, oxblood stamp rotated -8deg.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: the popup is already open over the dimmed shop page (scrim `rgba(42,31,24,.5)`), focus in the email field. Below it, the shop's product grid shows four tins.
2. Exit intent: once per page view, when the pointer leaves the document through the top edge (`mouseout` with no `relatedTarget` and `clientY <= 0`), the popup opens. It never opens a second time by itself.
3. "No thanks", the 40px round close button, Escape and a scrim click all close it at once. A pill button, "See the Darjeeling offer", appears bottom right so the visitor can come back, and takes focus.
4. Send my code with an empty field: the field border turns oxblood and "Add an email so the code has somewhere to go." appears below. With a malformed address: "That address looks incomplete. Check the part after the @." Typing clears the message.
5. A valid address swaps the right column for the result: "Sent to nell.ashworth@postbox.uk", the headline "Here it is, in case the email is slow.", the code `FLUSH20` in a dashed 1.5px oxblood box with Copy code, the terms ("Works on everything in Loose leaf, including the 250 g caddies. Ends Sunday 1 November at midnight.") and one primary, "Back to the teas", which closes. The code is shown on screen, not held hostage in the inbox.
6. Copy code copies where allowed and reads "Copied" for 1800ms.
7. The steam over the cup is three strokes that drift up 26px and fade, 4.8s each, staggered 1.6s. It is the only loop.

## Tokens

```css
:root {
  /* paper and tea */
  --bg: #f1e9dc;          /* shop page */
  --card: #fbf6ee;        /* product cards */
  --panel: #fffaf2;       /* popup */
  --line: #e2d6c3;
  --edge: #8a7a66;        /* input and outline buttons, 4.00:1 on panel */
  --ink: #2a1f18;         /* 15.45:1 on panel */
  --ink-2: #5a4a3e;       /* 8.14:1 */
  --ink-3: #6f5f52;       /* 5.88:1, fine print, placeholder */
  --accent: #8b2f22;      /* oxblood: primary, stamp, kicker, errors; 8.00:1 as text */
  --accent-hover: #74261b;
  --accent-ink: #fff6ee;  /* 7.78:1 on accent */
  --accent-soft: #f3dfd6; /* hover fill, close hover */
  --tin: #2f4a3a;         /* illustration */
  --tin-2: #c99a3e;       /* lid */
  --scrim: rgba(42,31,24,.5);
  /* type */
  --serif: "Young Serif", Georgia, serif;
  --sans: "Lexend", system-ui, sans-serif;
  /* size */
  --w: 760px;
  --art: 300px;
  --r: 20px;
  --r-ctl: 12px;
  --h-ctl: 48px;
  --shadow: 0 2px 6px rgba(42,31,24,.08), 0 50px 100px -40px rgba(42,31,24,.6);
  /* motion */
  --t-micro: 160ms;
  --t-fade: 400ms;
  --t-rise: 640ms;
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
  --ease-sheet: cubic-bezier(.32,.72,0,1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Popup headline | Young Serif | 34px (28px phone) | 400 | 1.12 | -0.015em | sentence, max 15ch |
| Shop h1 | Young Serif | 44px | 400 | 1.1 | -0.015em | sentence |
| Wordmark | Young Serif | 22px | 400 | 1 | -0.01em | title |
| Stamp figure | Young Serif | 30px | 400 | 1 | 0 | numerals |
| Code | Young Serif | 26px | 400 | 1 | 0.06em | UPPERCASE |
| Kicker | Lexend | 13px | 500 | 1.4 | 0 | sentence |
| Reason paragraph | Lexend | 15px | 300 (bold part 500) | 1.55 | 0 | sentence, max 40ch |
| Field label | Lexend | 13px | 500 | 1.4 | 0 | sentence |
| Input, buttons | Lexend | 15px | 400 / 500 | 1 | 0 | sentence |
| Fine print | Lexend | 12.5px | 300 | 1.5 | 0 | sentence |

## Implementation notes

**Two clocks for a soft rise.** Fade and rise on separate durations so the card is visible early and settles late. `@starting-style` gives the entry without JS.

```css
dialog { opacity: 0; transform: translateY(28px);
  transition: opacity 400ms var(--ease), transform 640ms var(--ease-out),
              overlay 640ms allow-discrete, display 640ms allow-discrete; }
dialog[open] { opacity: 1; transform: none; display: grid; grid-template-columns: 300px 1fr; }
@starting-style { dialog[open] { opacity: 0; transform: translateY(28px); } }
```

**Exit intent that respects a no.** Fire only when the pointer leaves through the top and only if nothing has shown yet. Track it in memory for this page, or in your own consent-aware storage for the session.

```js
let shown = false;
document.addEventListener('mouseout', (e) => {
  if (!e.relatedTarget && e.clientY <= 0 && !shown) open();
});
function open() { if (dlg.open) return; shown = true; dlg.showModal(); email.focus(); }
```

**Left-lit cylinders in SVG.** One horizontal gradient per object, light on the left third, dark on the right, sells the volume without filters.

```html
<linearGradient id="tin" x1="0" x2="1">
  <stop offset="0" stop-color="#3f604c"/><stop offset=".35" stop-color="#2f4a3a"/><stop offset="1" stop-color="#1c2e24"/>
</linearGradient>
```

Common mistakes: a shaming decline link in 11px grey; a countdown timer that resets on reload; opening on page load for first-time visitors on a phone (there is no exit intent on touch, so use a scroll-depth or never); stacking the offer behind an email wall; a stock photo instead of a drawn object in the shop's own colours.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
