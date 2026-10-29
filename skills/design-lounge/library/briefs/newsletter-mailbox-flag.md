<!-- Design Lounge Nº 610 · "Mailbox flag newsletter signup" · www.designlounge.live -->

# Mailbox flag newsletter signup

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The signup section of The Hedgerow Post, an invented letter club that pairs strangers as pen pals once a month. On the left, a hand-drawn galvanised country mailbox stands on a wooden post in a small meadow patch, drawn in inline SVG with wobbly ink lines (a turbulence displacement filter), hatching and flat fills on grainy warm paper. On the right, a Petrona headline, a short pitch, an email form and three handwritten facts. The mailbox follows the form: its door opens a crack while you type, its red flag swings up the moment the address is valid, and submitting folds a lilac envelope, posts it through the door and shows a thank-you note with the address used. The detail worth copying is that every form state has a physical twin in the drawing, so the form feels like it is talking back.

## Structure

```
1280 × 800, paper #F1E8D4 with an SVG-noise grain tile (180px)
section.wrap  grid 600px | 1fr, gap 24, pad 40 88 40 48, align center
┌──────────── .art 600 × 643 (SVG viewBox 560×600) ─┐ ┌──── .copy max 520 ─────────────────┐
│   cloud ~                       birds  ^ ^         │ │ ~ The Hedgerow Post, a letter club │ Mali 15 red
│                                                    │ │ Write to a stranger.               │ Petrona 64/500
│        ┌──door──┬───── body (steel) ────────┐      │ │ Get a real letter back. (italic)   │
│        │ No. 12 │   [flag]──────o rivet     │robin │ │ Once a month we pair you… 19px     │
│        └────────┴───────────────────────────┘      │ │ Your email, for the monthly prompt │ Mali 15
│         ══════════ plank ══════════                │ │ [ input 54px, 1.5px ink ][Join the club ✉] │
│                   ║ post                 tree      │ │ helper / error line 14px, aria-live│
│  fence ‾‾‾‾‾‾‾‾‾‾ ║ ‾‾‾ far hill (sage) ‾‾‾‾‾‾     │ │ - - - - - - - - - - - - - - - - - -│
│  meadow  * flowers║ mound  stone   *               │ │ Wed 4 Nov | 2,418    | Free        │ Petrona 21
│   (land patch clipped to a soft hand-cut blob)     │ │ next letters | members in | you buy │ Mali 14
└────────────────────────────────────────────────────┘ └────────────────────────────────────┘
```

- `<section class="wrap" aria-labelledby="sub-h">` holds both columns.
- `.art > svg#box[role=img]` with a `<title>` describing the mailbox. Groups: clouds and birds, `g[clip-path=url(#land)]` (far hill, fence, tree, meadow, flowers, mound), post, plank, body, interior, `#flag`, rivet, `#door`, robin `#bird`, `#env` (back, `.letter`, front pocket, stamp, `.flap`). All of it sits inside `g[filter=url(#rough)]`.
- `.copy`: `p.kick` (squiggle SVG + text), `h2#sub-h` with `<em>`, `p.lede`, `.slot` (a 1×1 grid) containing `#formbox` (form + `ul.facts`) and `.note#note`, stacked with `grid-area:1/1`.
- Form: visible `<label for="email">`, `.row` flex with `input#email[type=email]` and `button.go[type=submit]`, then `p#msg[aria-live=polite]`. `novalidate` on the form.
- Note: `div.note[tabindex=-1][aria-live=polite]` with `h3`, `p` containing `b#addr`, and `button.again`.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Notes |
|---|---|---|---|---:|---|---|
| Door | input non-empty | transform | scaleY(1) → scaleY(.84), origin 200 316 | 320ms | `--ease-out` | reverses when emptied |
| Flag | value valid | transform | rotate(0) → rotate(90deg), origin 420 262 | 520ms | `--spring` | overshoots a little |
| Flag | invalid submit | rotate keyframes | 0 → 16° → −7° → 6° → 0 | 620ms | `--ease` | class removed on animationend |
| Envelope | submit | opacity, transform | 0%: 0, y 92 · 12%: 1, y 104 · 50%: hold · 74%: (196,262) scale .5 rotate 8° · 80–100%: 0, (204,272) scale .36 | 2400ms | `--ease` | one keyframe track |
| Letter sheet | submit | translateY | 0–14%: 0 → 32%: 44px | 2400ms | `--ease` | hides behind the front pocket |
| Flap | submit | scaleY about y −39 | 0–34%: 1 → 50%: −1 | 2400ms | `--ease` | folds over the pocket |
| Door | submit | scaleY | 0–38%: .84 → 52–78%: −.46 → 92–100%: 1 | 2400ms | `--ease` | number hidden 40–84% |
| Robin | submit | transform | 82%: none → 88%: translateY(−10) rotate(−6°) → 94%: none | 2400ms | `--ease` | the robin startles |
| Note | 1900ms after submit | opacity, translateY | 0, 10px → 1, 0 (rotate −.6° kept) | 520ms | `--ease-out` | |
| Button | hover / active | translateY, shadow | −1px, 3px shadow / +1px, 1px shadow | 150ms | `--ease` | |

Reduced motion: `*, svg * { transition-duration: 1ms; animation-duration: 1ms; animation-delay: 0 }`; the note appears without the 1900ms wait.

## States

- **Idle:** door closed, flag down, input border 1.5px `--ink` on `--card`, helper `--ink-2`.
- **Typing (`.typing`):** door cracked, dark interior slit visible above it.
- **Valid (`.up`):** flag vertical with the red plate above the box.
- **Input focus:** `box-shadow: 0 0 0 3px #b3361f40` ring, no outline change on the border.
- **Error:** input `border-color: --red`, `aria-invalid="true"`, helper red with a 16px info-circle icon, flag wobble.
- **Sent (`.sent`):** 2400ms sequence, then the note replaces form and facts in the same cell.
- **Button hover / active:** lifts 1px / presses 1px; focus-visible is a 2px `--ink` outline, 3px offset.
- **Reset link hover:** colour `--red`; underline 1.5px, offset 4px.

## Accessibility

- The section is labelled by the headline. The email has a visible `<label>`; `aria-describedby="msg"` links it to the helper line.
- `#msg` is `aria-live="polite"`, so error copy is announced; the input keeps focus.
- The SVG is `role="img"` with a `<title>` that says the drawing follows the form. Decorative inline icons are `aria-hidden`.
- The hidden half of `.slot` uses `visibility:hidden`, so it leaves the tab order and the accessibility tree.
- On success, focus moves to the note (`tabindex=-1`), which is also polite-live, so the address is read out.
- Tab order: input → Join the club → (after success) Use a different address.
- Contrast: ink on paper 12.3:1, `--ink-2` on paper 6.6:1, red kicker and error on paper 5.0:1, button label on red 5.7:1, input border ink on paper well above 3:1.
- Hit targets: input and button 54px tall.

## Responsive rules

- ≥ 1280: as specified, two columns 600px / 1fr.
- 1024: columns shrink proportionally; the SVG scales with its column, the headline holds 64px and wraps to three lines.
- ≤ 900: one column, padding 28 20 40; the drawing comes first, max 440px wide and centred; headline 40px; lede 17px; the form row stacks (input full width with `flex:none`, button full width and centred); facts stack with 12px gaps and lose their rules.
- 390: the mailbox sits at the top of the frame, the form and button are visible above the fold, nothing scrolls sideways; long addresses wrap anywhere in the note.

## Acceptance checklist

**Always**
- [ ] The drawing is inline SVG with ink strokes 2.2px round-capped, hatching at 1.1px, and a displacement filter (turbulence `.04`, scale 3.2) on the whole drawing group.
- [ ] Typing opens the door to `scaleY(.84)` from the bottom hinge; clearing closes it.
- [ ] A valid address raises the flag 90° with a spring; invalid lowers it.
- [ ] Empty and malformed submits show different error sentences, set `aria-invalid`, keep focus in the input and wobble the flag (replayable).
- [ ] A valid submit runs a single 2400ms sequence: fold, door open, envelope in, door close; the flag stays up.
- [ ] The thank-you note shows the exact address typed and replaces the form without moving the headline.
- [ ] The reset control restores the idle drawing and focuses the input.
- [ ] Input and button are 54px tall; the input border is 1.5px ink on the input itself (≥ 3:1).
- [ ] Reduced motion lands on end states with no tweening.
- [ ] At 390px the drawing stays above the form and nothing overflows sideways.

**This demo**
- [ ] Club: The Hedgerow Post; headline "Write to a stranger. Get a real letter back." with the second sentence italic.
- [ ] Facts: Wed 4 Nov / 2,418 members in 31 countries / Free, you buy your own stamp.
- [ ] Door reads "No. 12"; the envelope is lilac `#d8cce6` with a red stamp; a robin sits on the box.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: door closed, flag down (arm horizontal along the box side), a robin sitting on the box, envelope invisible. The input is empty with the placeholder `you@yourlane.co.uk`; the helper line reads "One email on the first of each month. Never shared, never sold."
2. Type any character: the SVG gets `.typing` and the door scales to `scaleY(.84)` from its bottom hinge in 320ms expo-out, so a dark slit of the box interior shows above it. Clearing the field closes it again.
3. When the trimmed value matches `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`, the SVG gets `.up` and the flag rotates 90° about its rivet (420, 262) in 520ms with a spring curve, so the plate stands above the box. Making the value invalid again lowers it.
4. Submit empty: helper turns red with an info-circle icon, copy "Add your email so we can send the first prompt."; `aria-invalid="true"`; focus returns to the input; the flag wobbles (rotate 0 → 16° → −7° → 6° → 0 over 620ms). The wobble class is removed on `animationend` so it can replay.
5. Submit an invalid string: same chrome, copy "That address needs an @ and a domain, like ann@yourlane.co.uk."
6. Typing after an error restores the default helper line and `aria-invalid="false"`.
7. Submit a valid address: the SVG gets `.typing .up .sent` and runs a 2400ms sequence (see Motion): envelope fades in above the box, the letter sheet slides down into it, the flap folds shut, the door swings fully open (`scaleY(-.46)`), the envelope flies to the door while shrinking to 36% and fading, the door closes, the robin hops. The flag stays up.
8. At 1900ms the form and facts become `visibility:hidden` and the thank-you note appears in the same grid cell (no layout shift): "Posted. Thank you." / "Your welcome letter is on its way to {address}. Look for a lilac envelope and your first pen pal on Wednesday 4 November." The note receives focus (`preventScroll`).
9. "Use a different address" clears the field, removes `.sent .typing .up`, hides the note, shows the form and focuses the input.
10. Reduced motion: every transition and keyframe runs in 1ms, the note shows immediately on submit, the drawing lands on its end state (door closed, flag up, envelope hidden).

## Tokens

```css
:root {
  /* colour */
  --paper: #f1e8d4;     /* page ground */
  --card: #fbf6ea;      /* input fill, note card, letter sheet */
  --ink: #2b2620;       /* text, every drawn line, input border */
  --ink-2: #594f43;     /* lede, helper, fact captions */
  --line: #cbbd9f;      /* dashed facts rule, column rules, note shadow */
  --red: #b3361f;       /* flag, button, kicker, error, stamp */
  --red-ink: #fff6ea;   /* button label */
  --steel: #aebcbd;     /* mailbox body */
  --steel-2: #c7d2d1;   /* mailbox door */
  --wood: #b98d5c;      /* post; plank is #a37a4c */
  --sage: #cdd2a9;      /* far hill */
  --meadow: #b0bd88;    /* near meadow */
  --lilac: #d8cce6;     /* envelope front, flowers */
  --interior: #2f2a24;  /* inside of the box */

  /* type */
  --serif: "Petrona", Georgia, serif;
  --hand: "Mali", ui-rounded, cursive;
  --fs-h2: 64px; --fs-lede: 19px; --fs-input: 18px; --fs-label: 15px; --fs-note: 14px;

  /* shape and space */
  --r: 6px; --h: 54px;
  --sp-1: 8px; --sp-2: 16px; --sp-3: 24px; --sp-4: 32px; --sp-5: 48px;
  --shadow-btn: 0 2px 0 #6f1f10;
  --shadow-note: 4px 5px 0 var(--line);

  /* motion */
  --t-door: 320ms; --t-flag: 520ms; --t-send: 2400ms; --t-micro: 150ms;
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
  --spring: cubic-bezier(.34,1.56,.64,1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Kicker | Mali | 15px | 500 | 1.3 | 0 | sentence |
| Headline | Petrona | 64px | 500, em 400 italic | 1.02 | −0.022em | sentence |
| Lede | Petrona | 19px | 400 | 1.55 | 0 | sentence |
| Label | Mali | 15px | 500 | 1 | 0 | sentence |
| Input | Petrona | 18px | 400 | 54px box | 0 | as typed |
| Button | Mali | 16px | 600 | 54px box | 0 | sentence |
| Helper / error | Mali | 14px | 400 | 1.5 | 0 | sentence |
| Fact value | Petrona | 21px | 500 | 1.2 | 0 | sentence |
| Fact caption | Mali | 14px | 400 | 1.4 | 0 | sentence |
| Note title | Mali | 22px | 600 | 1.25 | 0 | sentence |
| Note body | Petrona | 17px | 400, address 600 | 1.5 | 0 | sentence |
| Door number (SVG) | Mali | 15px | 600 | n/a | 0 | "No. 12" |

## Implementation notes

**One class per form state on the SVG.** CSS does the drawing; JS only toggles classes. Use `transform-box: view-box` so the origins are in viewBox units, and remember that a CSS transform replaces an element's `transform` attribute, so place animated groups with CSS, not attributes.

```css
#door, #flag, #env, #env .flap, #env .letter { transform-box: view-box }
#door { transform-origin: 200px 316px; transition: transform 320ms var(--ease-out) }
#flag { transform-origin: 420px 262px; transition: transform 520ms var(--spring) }
.typing #door { transform: scaleY(.84) }
.up #flag { transform: rotate(90deg) }
#env { opacity: 0; transform: translate(96px, 104px) }   /* drawn centred on 0,0 */
#env .flap { transform-origin: 0 -39px }
.sent #env       { animation: envGo    2400ms var(--ease) both }
.sent #env .flap { animation: flapFold 2400ms var(--ease) both }
.sent #door      { animation: doorPost 2400ms var(--ease) both }
@keyframes flapFold { 0%, 34% { transform: scaleY(1) } 50%, 100% { transform: scaleY(-1) } }
@keyframes doorPost { 0%, 38% { transform: scaleY(.84) } 52%, 78% { transform: scaleY(-.46) } 92%, 100% { transform: scaleY(1) } }
```

**Sync the drawing on every keystroke, wobble on a bad submit.** Force a reflow between removing and re-adding the class so the wobble replays.

```js
const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const sync = () => { const v = input.value.trim();
  svg.classList.toggle('typing', v.length > 0);
  svg.classList.toggle('up', re.test(v)); };
const bad = (text) => { msg.className = 'msg bad'; msg.lastChild.textContent = text;
  input.setAttribute('aria-invalid', 'true');
  svg.classList.remove('wobble'); void svg.getBoundingClientRect(); svg.classList.add('wobble');
  input.focus(); };
```

**Stack the form and the note in one grid cell** so the swap never shifts the headline, and hide the inactive one with `visibility`, not `display`, so the cell keeps the taller height.

```css
.slot { display: grid; align-items: start }
.slot > * { grid-area: 1 / 1 }
.off { visibility: hidden }
```

Common mistakes: using `filter: blur` or the rough filter on text (keep it on the drawing only); placing the envelope with an SVG `transform` attribute and then losing it to the CSS keyframes; letting the flag plate collide with the robin (the robin sits mid-box, the flag at the back); drawing the meadow as a hard rectangle instead of a clipped hand-cut patch; forgetting `novalidate`, so Chrome's bubble fights the live region.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
