<!-- Design Lounge Nº 183 · "Café chalkboard and letterboard menu" · www.designlounge.live -->

# Café chalkboard and letterboard menu

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The menu board of a fictional café, Juniper & Ash, hung on a warm plaster wall. It is one card in a wooden frame with two faces. The chalkboard face is a dark green slate with hand lettering in Caveat, roughened by an SVG chalk filter, yellow chalk prices, a pink "Today's special" label inside a wobbly hand-drawn box, and a small coffee-cup doodle. The letterboard face swaps the frame to light oak and the board to black ribbed felt, and every word becomes white Antonio capitals that sit slightly crooked, like pushed-in plastic letters. Today's special writes itself in on the chalkboard: a chalk stick runs left to right and the words appear behind it. The detail worth copying is that the same DOM serves both faces; only a `data-mode` attribute and per-letter custom properties change.

## Structure

```
1280 × 800, body grid centred, gap 20px, wall #cdbba0 with a lighter radial spot
┌──────────── .frame 600px, padding 16px, radius 8px, wood ────────────┐
│ ┌──────────── .board, padding 30/36/26, min-height 560px ──────────┐ │
│ │                    Juniper & Ash   58px              [cup doodle]│ │
│ │                 coffee · bakes · since 2019  22px                 │ │
│ │        ╭──────────── wobbly yellow box, max 420px ────────────╮  │ │
│ │        │              Today's special  (pink 20px)            │  │ │
│ │        │      Smoked maple oat latte — 5.20   (yellow 34px)   │  │ │
│ │        ╰──────────────────────────────────────────────────────╯  │ │
│ │  Coffee                              Bakes                        │ │
│ │  Espresso ·········· 3.00            Morning bun ········ 3.60    │ │
│ │  Cortado ··········· 3.80            Brown butter cookie  2.80    │ │
│ │  Flat white ········ 4.20            Rye banana loaf ···· 3.40    │ │
│ │  Cardamom latte ···· 4.80            Fig toast ·········· 6.20    │ │
│ │  Pour-over ········· 5.50              ricotta, honey             │ │
│ │    Guji, washed                                                   │ │
│ │          oat or almond +0.50 · ask us about the beans             │ │
│ └───────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────┘
        [ CHALKBOARD | LETTERBOARD ]    [ ✎ NEXT SPECIAL ]
```

- `.board` is a `section` labelled by the `h1` café name.
- `.dust` is an absolutely positioned SVG `rect` filled by a speck filter (`opacity .16`, `mix-blend-mode: screen`).
- `.ink` wraps all lettering and carries `filter: url(#chalk)` in chalk mode.
- Two columns, each an `h2` and a `ul`. Each `li` is name, a flex-grow dotted leader, and price. Sub-notes are `small` under the name.
- The special is a `div` with an absolutely placed SVG box path, the label, the `.write` span (`aria-live="polite"`) and the chalk stick span.
- Controls: a `radiogroup` of two `role="radio"` buttons and a plain "Next special" button.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing |
| --- | --- | --- | --- | --- |
| Special write-in | load, next, back to chalk | clip-path | `inset(-10px 100% -10px 0)` → `inset(-10px 0 -10px 0)` | 1900ms `--ease-write` |
| Chalk stick | with write-in | left, opacity | start → end of text, fades in last 8% | 1900ms same |
| Special erase | next | opacity, filter, transform | 1 → 0, blur 0 → 4px, x 0 → 10px | 380ms standard |
| Letter pop | switch to letter, next | opacity, translateY | 0, −8px → 1, 0 | 360ms expo out, `i × 14ms` delay |
| Frame | mode switch | background | wood ↔ oak | 400ms standard |
| Row hover | hover | background | none → 5% white | 160ms standard |
| Segment | select | background, colour | 200ms standard |

Reduced motion: every animation and transition above is off.

## States

- Segmented control: selected segment is `--slate` with `--chalk` text; the other is `#4a3f33` on transparent. Track `rgba(31,42,38,.12)`, pill radius.
- Next special hover: `rgba(255,255,255,.3)` fill on its 1.5px ring.
- Focus-visible: 2px `--slate` outline, offset 3px.
- Menu rows: hover tint only. They are not buttons in this piece.
- Sold out (not shown): strike through with a 2px chalk line in chalk mode, and remove the price in letterboard mode.

## Accessibility

- The board is a `section` labelled by the café name `h1`. Columns use `h2` and `ul`.
- Every text node that is split into letters gets a visually hidden copy of the plain text, and the letter spans sit in an `aria-hidden` wrapper. Screen readers read "Flat white 4.20", not single letters.
- The special span is `aria-live="polite"`, so the new special is announced.
- Segmented control: `role="radiogroup"` labelled "Board style", buttons `role="radio"` with `aria-checked`, roving `tabindex`, arrows switch.
- Contrast: chalk `#ece8df` on slate `#1f2a26` is 12.6:1 before the grain filter; the filter removes up to roughly a third of the pixels, so keep text at 18px or larger. Yellow on slate is 11:1. Letters `#f4f1ea` on felt 16:1. Muted `#a9a59c` on felt 7.6:1.
- Hit targets: segments 40px tall, Next special 44px.

## Responsive rules

- ≥1024: 600px frame centred, two columns.
- 768: same; frame stays 600px.
- <560: board padding 24px 20px 20px, no minimum height, café name 46px (32px in letterboard), single column (Coffee then Bakes, 14px gap), doodle hidden. Words never break mid-word because each word is a `white-space: nowrap` group of letter spans.
- 375: no horizontal scroll; controls wrap onto two lines if needed.

## Acceptance checklist

### Always

- [ ] One framed board with two faces sharing the same DOM, switched by a single attribute.
- [ ] Chalk face uses a hand face with a grain-and-displacement filter; letterboard face uses a condensed sans in capitals on ribbed felt.
- [ ] Today's special writes in left to right with a moving chalk stick, and can be cycled.
- [ ] Letterboard letters each carry a small fixed rotation (±0.6°) and offset (±0.5px), stable between renders.
- [ ] Prices align right with a dotted leader in chalk mode.
- [ ] Letter splitting does not break screen reader reading or line wrapping.
- [ ] Segmented control is a radiogroup with arrow-key support.
- [ ] Reduced motion shows the special fully, with no pops or smudges.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Café "Juniper & Ash", sub-line "coffee · bakes · since 2019".
- [ ] Coffee: Espresso 3.00, Cortado 3.80, Flat white 4.20, Cardamom latte 4.80, Pour-over 5.50 (Guji, washed).
- [ ] Bakes: Morning bun 3.60, Brown butter cookie 2.80, Rye banana loaf 3.40, Fig toast 6.20 (ricotta, honey).
- [ ] Specials cycle: Smoked maple oat latte 5.20 → Pear & ginger galette 4.40 → Miso caramel cortado 4.60.
- [ ] Footer "oat or almond +0.50 · ask us about the beans".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: chalkboard mode. "Smoked maple oat latte — 5.20" writes in over 1900ms (clip reveal left to right), while a 22 × 8px chalk stick tilted −28° travels along with the reveal edge and fades out at the end.
2. Hovering a menu row lifts it with `rgba(255,255,255,.05)` behind it (160ms).
3. "Next special": the current special smudges out (opacity 0, blur 4px, 10px right, 380ms), then the next one writes in. Three specials cycle: Smoked maple oat latte 5.20, Pear & ginger galette 4.40, Miso caramel cortado 4.60.
4. Choose "Letterboard" in the segmented control: the body's `data-mode` becomes `letter`. The frame becomes oak, the board becomes ribbed felt, the chalk filter and dust are removed, all text switches to Antonio capitals, and each letter pops in (from 8px above, opacity 0) over 360ms with a 14ms stagger per letter within its line.
5. In letterboard mode "Next special" swaps the line and its letters pop in. There is no chalk stick.
6. Choose "Chalkboard": back to chalk; the special writes in again.
7. In the segmented control, arrow keys switch mode and move focus (roving tabindex).
8. Reduced motion: no write-in (the special is fully visible), no smudge, no letter pop, no hover or frame transitions. The mode switch still works instantly.

## Tokens

```css
:root {
  --wall: #cdbba0;
  --wood: #6b4528; --wood-2: #8a5d39;     /* chalkboard frame */
  --oak: #b98a57;  --oak-2: #d2a874;      /* letterboard frame */
  --slate: #1f2a26;                        /* chalkboard; also selected segment */
  --chalk: #ece8df; --chalk-2: #b9b8ae;   /* chalk text, muted chalk */
  --yellow: #f2d57e;                       /* prices, special, box */
  --pink: #e9a6a0;                         /* special label */
  --felt: #161616;                         /* letterboard */
  --letter: #f4f1ea; --letter-2: #a9a59c;  /* plastic letters, muted */
  --red: #d9452b;                          /* letterboard headings */
  --hand: "Caveat", cursive;
  --block: "Antonio", "Arial Narrow", sans-serif;
  --std: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --t-write: 1900ms;  --ease-write: cubic-bezier(.45, .05, .55, .95);
  --t-erase: 380ms;   --t-pop: 360ms;  --stagger: 14ms;
}
```

Felt grooves: `repeating-linear-gradient(180deg, #0c0c0c 0 2px, #1d1d1d 2px 3px, var(--felt) 3px 12px)`. Wood grain: a 92° repeating gradient of dark and light hairlines on a vertical `--wood-2 → --wood` gradient.

## Typography

| Role | Chalk mode | Letterboard mode |
| --- | --- | --- |
| Café name | Caveat 700, 58px / .95 | Antonio 400, 44px, .14em, caps |
| Sub-line | Caveat 500, 22px, `--chalk-2` | Antonio 15px, .3em, `--letter-2` |
| Special label | Caveat 700, 20px, `--pink` | Antonio 14px, .3em, `--red` |
| Special | Caveat 700, 34px, `--yellow` | Antonio 24px, .08em, `--letter` |
| Section heading | Caveat 700, 30px, 2px chalk underline | Antonio 18px, .3em, `--red`, no rule |
| Item | Caveat 500, 26px / 1.45 | Antonio 19px / 2.1, .08em |
| Price | Caveat 700, `--yellow` | Antonio, `--letter` |
| Sub-note | Caveat 18px, `--chalk-2` | Antonio 12px, `--letter-2` |
| Footer | Caveat 500, 21px | Antonio 13px, .2em |
| Controls | Antonio 600, 14px, .14em, caps | same |

In letterboard mode all weights are 400: plastic letters come in one weight.

## Implementation notes

The chalk look is one SVG filter applied to the lettering wrapper. Noise becomes an alpha mask, then nudges the edges:

```html
<filter id="chalk" x="-5%" y="-5%" width="110%" height="110%">
  <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 -2.2 0 0 0 1.75" result="m"/>
  <feComposite in="SourceGraphic" in2="m" operator="in" result="t"/>
  <feDisplacementMap in="t" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
</filter>
```

Split letters by word, keep the plain text for assistive tech, and do the uppercase in JS (set `textContent` to `ch.toUpperCase()` when entering letterboard mode) instead of relying on `text-transform` across hundreds of inline-block spans:

```js
function wrap(el, text) {
  el.textContent = '';
  const sr = Object.assign(document.createElement('span'), { className: 'sr', textContent: text });
  const vis = document.createElement('span'); vis.setAttribute('aria-hidden', 'true');
  let i = 0;
  text.split(' ').forEach((word, w) => {
    if (w) vis.append(' ');
    const wd = Object.assign(document.createElement('span'), { className: 'w' }); // white-space: nowrap
    [...word].forEach(ch => {
      const c = Object.assign(document.createElement('span'), { className: 'c', textContent: ch });
      const h = (i * 7919 + text.length * 31) % 100;
      c.dataset.ch = ch;
      c.style.setProperty('--r', ((h % 5) - 2) * .3 + 'deg');
      c.style.setProperty('--y', ((h % 3) - 1) * .5 + 'px');
      c.style.setProperty('--d', (i++ * 14) + 'ms');
      wd.append(c);
    });
    vis.append(wd);
  });
  el.append(sr, vis);
}
```

The chalk stick needs the start and end of the text, which differ per special. Measure after swapping text and before restarting the animation:

```js
stick.style.setProperty('--x0', write.offsetLeft + 'px');
stick.style.setProperty('--x1', write.offsetLeft + write.offsetWidth + 'px');
write.classList.remove('go'); void write.offsetWidth; write.classList.add('go');
```

Common mistakes:

- Splitting into letters without word groups. Lines then break in the middle of words on narrow screens.
- Larger letter jitter. More than about 1px of offset at 19px reads as mixed case, not as plastic letters.
- Putting the chalk filter on the whole board. The slate gradient gets grainy too; filter only the lettering.
- Using a typewriter or script face for the letterboard. It is a condensed grotesk.
- Animating every letter of the whole board on load. The first frame is chalk; letters pop only when the user asks for the letterboard.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
