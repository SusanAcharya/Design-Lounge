<!-- Design Lounge Nº 063 · "Split sign-in" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Split sign-in

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The sign-in screen for *Mira*, a planning tool for teams. The viewport is split 45 / 55: the left 576px is a warm off-white column holding a 360px form (floating-label email and password fields, a filled "Continue" button, an "or" rule, and an outlined "Email me a magic link" button that turns into a confirmation). The right 704px is a deep-green panel with two thin concentric circles in the corner, a 40px DM Serif Display testimonial that crossfades to the next quote every 5 seconds, three 40px bar-shaped dots, and a footer meta line. The feeling is calm and print-like; the detail worth copying is the floating label: 56px fields whose label shrinks to 78% and lifts 10px on focus or when the field has a value, with no layout shift.

## Reference behaviour

1. Initial state: email field is prefilled ("priya@loam.studio") so its label is already floated; password is empty with the label at rest; "Keep me signed in" is checked; testimonial 1 is visible and dot 1 is filled.
2. Hover a field: border `--line` → `--ink-3`. Focus: border `--ink`, 3px ring `rgba(31,107,82,.15)`, label lifts (`translateY(-10px) scale(.78)`) and darkens over 180ms.
3. Type into the password field: label stays lifted after blur because the input is no longer `:placeholder-shown`.
4. Click the eye button (40 × 40, inside the field's right edge): input type flips `password` ↔ `text`, the icon swaps to a slashed eye, `aria-pressed` and `aria-label` ("Show password" / "Hide password") update, and focus returns to the input.
5. Hover "Continue": background `--green` → `--green-2`. Submit is prevented in the demo.
6. Click "Email me a magic link": the button's border and text become `--accent`, its label changes to "Link sent to priya@loam.studio · check your email", and further clicks do nothing.
7. Every 5000ms the visible quote fades out and the next fades in (both over 600ms, overlapping, since the figures are absolutely stacked). The corresponding dot fills.
8. Click a dot: jumps to that quote and restarts the 5s timer. Hovering anywhere on the green panel pauses rotation; leaving resumes it.
9. Reduced motion: quotes swap instantly; labels move in 1ms.

## Structure

```
1280 × 800
┌──────────────────────────────────┬────────────────────────────────────────────┐
│ ● Mira                           │ TEAMS ON MIRA                    ( )  ( )  │  circles 420px, corner
│                                  │                                            │
│                                  │                                            │
│  Welcome back            (36px)  │                                            │
│  Sign in to your workspace …     │      “We stopped writing status            │
│  ┌ Email address ──────────────┐ │       updates. Mira became the             │  40px serif, 18ch max
│  │ priya@loam.studio           │ │       update.”                             │
│  └─────────────────────────────┘ │       Ines Halvorsen                       │
│  ┌ Password ───────────────(o)─┐ │       Head of Product, Fjord Bank          │
│  └─────────────────────────────┘ │                                            │
│  ☑ Keep me signed in   Forgot?   │                                            │
│  [        Continue          ]    │                                            │
│  ──────────── OR ─────────────   │                                            │
│  [ ✉ Email me a magic link  ]    │  ▬▬  ──  ──                                │  dots 40×2
│  New to Mira? Create a workspace │  4.8 / 5 across 1,200 workspaces  SOC 2 · EU│
└──────────────────────────────────┴────────────────────────────────────────────┘
   45% = 576px · padding 32/48         55% = 704px · padding 40/56
```

- `<body>` — `display:grid; grid-template-columns: 45% 1fr`.
- `<section class="form">` — flex column; `.logo` link at top; `<form>` vertically centred with `margin: auto 0`, width 360px.
  - `.field` — `position:relative`; `<input placeholder=" ">` then `<label>`; password field also has `<button class="eye" aria-pressed aria-controls="pw">` with two SVGs (`.on`, `.off`).
  - `.row` — checkbox label + "Forgot password?" link.
  - `.btn` submit, `.or` rule, `.btn.ghost#magic`, `.foot` paragraph.
- `<aside class="panel" aria-label="What customers say">` — `.tag`, `.quotes[aria-live="polite"]` with three stacked `<figure class="q">` (blockquote + figcaption), `.dots` group of three buttons, `.meta` row. Circles are `.panel::before/::after`.

## Tokens

```css
:root {
  /* colour — warm off-white left, deep green right, cream type on green */
  --bg:         #fbfaf7;  /* left column */
  --field:      #ffffff;  /* input surface */
  --ink:        #1b1f1c;  /* headings, input text, links */
  --ink-2:      #5d645f;  /* lede, floated labels, footer text */
  --ink-3:      #8c938e;  /* resting labels, eye icon, "or" */
  --line:       #dcdfda;  /* field borders, ghost button, rules */
  --line-focus: #1b1f1c;  /* focused field border */
  --green:      #0f2e26;  /* panel, primary button */
  --green-2:    #173d33;  /* primary button hover */
  --cream:      #f1e9d6;  /* panel text, active dot, button label */
  --cream-2:    #b9b19b;  /* panel secondary text, italic emphasis */
  --accent:     #1f6b52;  /* focus ring, magic-link sent state */
  --ring:       rgba(31, 107, 82, .15);
  --circle:     rgba(241, 233, 214, .14);

  /* type */
  --serif: "DM Serif Display", Georgia, serif;
  --sans:  "DM Sans", system-ui, sans-serif;
  --quote-size: 40px;    /* 32 ≤1100 */

  /* layout */
  --split: 45%;
  --form-w: 360px;
  --field-h: 56px;
  --btn-h: 50px;
  --eye: 40px;
  --r: 8px;
  --r-eye: 6px;

  /* motion */
  --t-micro: 160ms;
  --t-label: 180ms;
  --t-fade: 600ms;
  --t-rotate: 5000ms;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
}
```

## Typography

| Role              | Family           | Size | Weight | Line-height | Tracking | Notes |
|-------------------|------------------|-----:|-------:|------------:|---------:|-------|
| Wordmark          | DM Serif Display | 24px | 400    | 1           | −0.01em  | 26px two-ring logo mark before it |
| Heading           | DM Serif Display | 36px | 400    | 1.1         | −0.01em  | |
| Lede              | DM Sans          | 15px | 400    | 1.5         | 0        | `--ink-2` |
| Input text        | DM Sans          | 15px | 400    | 1           | 0        | padding `22px 48px 6px 14px` |
| Label at rest     | DM Sans          | 15px | 400    | 1           | 0        | `--ink-3`, `left:14px; top:18px` |
| Label floated     | DM Sans          | 15px × .78 (≈11.7px) | 400 | 1 | 0 | `--ink-2`, `translateY(-10px)` |
| Checkbox / links  | DM Sans          | 13px | 400    | 1.5         | 0        | links underlined, `text-underline-offset: 3px` |
| Buttons           | DM Sans          | 15px | 500    | 1           | 0        | |
| "OR" rule label   | DM Sans          | 12px | 400    | 1           | +0.06em  | UPPERCASE, `--ink-3` |
| Panel tag         | DM Sans          | 12px | 400    | 1           | +0.14em  | UPPERCASE, `--cream-2` |
| Quote             | DM Serif Display | 40px | 400    | 1.2         | −0.01em  | `max-width: 18ch; text-indent: -.4em` (hanging open quote); `<em>` italic in `--cream-2` |
| Attribution       | DM Sans          | 14px | 500 name / 400 role | 1.5 | 0 | name `--cream`, role `--cream-2` |
| Panel meta        | DM Sans          | 12px | 400    | 1.5         | 0        | `--cream-2` |

## Motion

| Element        | Trigger                     | Property            | From → To                              | Duration | Easing   | Notes |
|----------------|-----------------------------|---------------------|----------------------------------------|---------:|----------|-------|
| `.field label` | input focus / has value     | transform, color    | `none`, `--ink-3` → `translateY(-10px) scale(.78)`, `--ink-2` | 180ms | `--ease` | `transform-origin: left top` |
| `.field input` | hover / focus               | border-color, box-shadow | `--line` → `--ink-3` / `--ink` + 3px ring | 160ms | `--ease` | |
| `.btn`         | hover                       | background          | `--green` → `--green-2`                | 160ms    | `--ease` | |
| `.btn.ghost`   | hover                       | border-color, background | `--line` → `--ink`, transparent → white | 160ms | `--ease` | |
| `.btn.ghost`   | click → sent                | border-color, color | → `--accent`                           | 160ms    | `--ease` | one-way |
| `.q`           | every 5000ms / dot click    | opacity             | 1 → 0 (outgoing), 0 → 1 (incoming)     | 600ms    | `--ease` | simultaneous; figures are stacked with `position:absolute; inset:0` |
| `.dots button::before` | current / hover     | background          | 28% cream → cream / `--cream-2`        | 160ms    | `--ease` | |
| `.eye`         | hover                       | color, background   | `--ink-3` → `--ink`, transparent → `--bg` | 160ms | `--ease` | |

Timer: `setInterval(next, 5000)`; cleared on `pointerenter` of the panel and on dot click (then restarted), restarted on `pointerleave`. Reduced motion: `.q { transition: none }`.

## States

- **Field rest:** white, 1px `--line` border, 8px radius, 56px tall.
- **Field hover:** border `--ink-3`.
- **Field focus:** border `--ink`, `box-shadow: 0 0 0 3px var(--ring)`, no outline.
- **Field filled (blurred):** label stays floated (`:not(:placeholder-shown)`).
- **Field error (not in demo):** border `--error: #a9401f`, a 13px message below in the same colour, `aria-describedby` linking them.
- **Eye pressed:** slashed icon, `aria-pressed="true"`, input type `text`.
- **Primary button:** fill `--green`, text `--cream`; hover `--green-2`; focus-visible 2px `--accent` outline at 3px offset.
- **Ghost button:** transparent, 1px `--line`, `--ink` text; hover border `--ink` + white fill.
- **Ghost sent:** border and text `--accent`, cursor default, label replaced; not disabled (so it stays readable), but clicks are ignored.
- **Dot current:** `aria-current="true"`, bar `--cream`; others 28% cream; hover `--cream-2`.
- **Panel hover:** rotation paused (no visual change).

## Accessibility

- Labels are real `<label for>` elements positioned over the input; the `placeholder=" "` (single space) exists only so `:placeholder-shown` works. Never use the placeholder as the label.
- The eye toggle is a `<button type="button" aria-pressed aria-controls="pw">` with a live `aria-label`. After toggling, focus returns to the input so keyboard users continue typing.
- The magic-link button changes its own text; because it stays a focused button, screen readers announce the new label. If you prefer, add `aria-live="polite"` to a status paragraph instead.
- Quotes live in `.quotes[aria-live="polite"]`; only the visible figure is announced because hidden ones are `opacity:0` — if that causes double announcements in your framework, toggle `aria-hidden` on the inactive figures.
- Dots are buttons with `aria-label="Testimonial n"` and `aria-current` on the active one, inside `role="group" aria-label="Choose testimonial"`. Hit area 40 × 20 around a 2px bar.
- Keyboard order: logo → email → password → eye → checkbox → forgot link → Continue → magic link → Create a workspace → dot 1–3.
- Contrast: `--ink-2` on `--bg` 6.7:1; `--ink-3` on white 3.4:1, used only for the resting label (which becomes `--ink-2` once floated) and the 12px "OR"; `--cream` on `--green` 13.6:1; `--cream-2` on `--green` 7.3:1; `--cream` on `--green` button 13.6:1.
- Checkbox uses `accent-color: var(--green)` so the native control matches.

## Responsive rules

- ≥ 1280: as specified (576 / 704).
- 1024–1279: same split; form padding `28px 36px`; panel padding `32px 40px`; quote 32px.
- 768–1023: panel hidden; the form column takes full width, form stays 360px and centred; page scrolls if shorter than 640px tall.
- < 640: form width 100% with 24px padding; field height stays 56px; buttons stay 50px; footer paragraph wraps.
- Heights: the form is vertically centred by `margin: auto 0`; the quotes block has `min-height: 320px` and sits in the panel's flexible middle, so the panel works down to ~640px tall.

## Acceptance checklist

- [ ] Columns are 45% / 55% at 1280 (576px / 704px); left background `#fbfaf7`, right `#0f2e26`.
- [ ] Form is 360px wide and vertically centred; heading is DM Serif Display 36px.
- [ ] Fields are 56px tall with 1px `#dcdfda` borders and 8px radius; label floats via `translateY(-10px) scale(.78)` over 180ms on focus or when filled.
- [ ] The prefilled email shows its label already floated on first paint, with no animation.
- [ ] Focused field shows a `#1b1f1c` border plus a 3px `rgba(31,107,82,.15)` ring.
- [ ] Eye button is 40 × 40, toggles input type, swaps icon, updates `aria-pressed`/`aria-label`, and refocuses the input.
- [ ] Magic-link button turns `#1f6b52` and reads "Link sent to <email> · check your email" after one click; further clicks are ignored.
- [ ] Testimonials crossfade over 600ms every 5000ms; dots reflect the current quote; clicking a dot jumps and restarts the timer.
- [ ] Hovering the green panel pauses rotation; leaving resumes it.
- [ ] Two 420px hairline circles (`rgba(241,233,214,.14)`) sit in the panel's top-right corner, clipped by the panel.
- [ ] Focus rings (2px `#1f6b52`, 3px offset) are visible on every control including the dots.
- [ ] No layout shift occurs when labels float or when the magic-link text changes (button height stays 50px).
- [ ] Reduced motion: quote swaps are instant.

## Implementation notes

**Floating label with zero layout shift.** Reserve the label's floated position inside the input's padding; the label is absolutely positioned and only transforms:

```css
.field { position: relative; }
.field input { height: 56px; padding: 22px 48px 6px 14px; }
.field label { position: absolute; left: 14px; top: 18px; color: var(--ink-3); pointer-events: none;
  transform-origin: left top; transition: transform 180ms var(--ease), color 180ms var(--ease); }
.field input:focus + label,
.field input:not(:placeholder-shown) + label { transform: translateY(-10px) scale(.78); color: var(--ink-2); }
```

`placeholder=" "` must be exactly one space; an empty string makes `:placeholder-shown` false in some browsers.

**Crossfade by stacking, not by swapping DOM:**

```css
.quotes { position: relative; min-height: 320px; }
.q { position: absolute; inset: 0; opacity: 0; transition: opacity 600ms var(--ease);
     display: flex; flex-direction: column; justify-content: flex-end; }
.q.on { opacity: 1; }
```

```js
let i = 0, timer;
const show = n => { i = (n + qs.length) % qs.length;
  qs.forEach((q, k) => q.classList.toggle('on', k === i));
  dots.forEach((d, k) => k === i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')); };
const start = () => { clearInterval(timer); timer = setInterval(() => show(i + 1), 5000); };
panel.addEventListener('pointerenter', () => clearInterval(timer));
panel.addEventListener('pointerleave', start);
```

**Password toggle** keeps focus in the field: after flipping `input.type`, call `input.focus()`; set both `aria-pressed` and the label text.

Common mistakes: animating `font-size` on the label instead of `scale` (blurry, janky); using `display:none` for inactive quotes (kills the crossfade); disabling the magic-link button after sending (greys out the confirmation text below 4.5:1); forgetting `overflow:hidden` on the panel so the circles spill into the form column.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
