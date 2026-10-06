<!-- Design Lounge Nº 456 · "Tilted stat card stack" · www.designlounge.live -->

# Tilted stat card stack

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

Studied from mindmarket.com: the "few numbers behind the insights" block, where a sticky headline stays put while big coloured stat cards slide up one by one and pile on top of each other. This version is the stats section of a fictional user-research recruiting service, Fieldwise. The section pins for three scroll steps. On the left: an eyebrow, a 76px headline with one word underlined by a hand-drawn ochre wave, a short lede, and a step counter with dots and a Next button. On the right: four 420×480 cards (white, ochre, teal, brick). Each new card rises from below tilted 7–9°, settles to a small resting tilt of 1–2°, and lands 44px lower than the one before, so every earlier card's label row still shows like a tab. When a card lands, its number counts up. The detail worth copying: the cards are driven by one scroll progress value, each card takes a one-unit slice of it, and the next card is always peeking tilted at the bottom of the first frame, so the viewer knows to scroll.

## Structure

```
1280 × 800, page scrolls
┌──────────────────────────────────────────────────────────────────┐
│ 16px ┌ nav bar 56px, white, radius 14 ─────────────┐ ┌ Book a call ┐│
│      │ ~ Fieldwise      Recruiting Moderation …    │ │         (>) ││
│      └──────────────────────────────────────────────┘ └────────────┘│
│ pad 120 top / 96 sides                                              │
│ BY THE NUMBERS                               ┌ stage 420 × 612 ──┐ │
│ The numbers                                  │┌ card 0 white ───┐│ │
│ behind every                                 ││LANGUAGES    (o) ││ │
│ interview we run       (76px)                ││ 41   (112px)    ││ │
│ ~~~~~~~~~ ochre wave                         ││                 ││ │
│ lede 300px wide                              ││ sentence        ││ │
│                                              │└╱card 1 tilted╲──┘│ │
│ 01 / 04  ━ • • •   [ Next ↓ ]                │ ╱ peeking      ╲  │ │
└──────────────────────────────────────────────────────────────────┘
grid: 1fr | 420px, gap 64px. Stage height = 480 + 3 × 44.
```

- Nav: a fixed row with a `nav` bar (brand link + four links) and a separate `a.quote` pill. The pill holds a 40px ochre circle with a chevron.
- Section: `section#stats` labelled by its `h2`. Inside, `.pin` is the sticky grid.
- Left column: `p.eyebrow`, `h2` with `span.wavy` containing the inline SVG wave, `p.lede`, and `.steps` (counter, `ol.dots` of buttons, `button.next`).
- Right column: `.stage` with `role="list"`, four `article.card` with `role="listitem"` and an `aria-label` that reads the full stat ("2,380 interviews this year").
- Card: `header` (label + 48px icon disc), `.num`, `p` pinned to the bottom with `margin-top: auto`.
- After: `section#book`, ochre, centred CTA.
- A visually hidden `aria-live="polite"` paragraph announces the current stat.

## Motion

| Thing | Trigger | Property | From → To | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Wave underline | load | stroke-dashoffset | 1 → 0 (pathLength 1) | 800ms `--expo`, 300ms delay | drawn from the start |
| Card i rise | scroll | translateY | `0.75 × cardH` → 0 | scroll-linked over one step | same, user-driven |
| Card i tilt | scroll | rotate | `rest + entry` → `rest` | scroll-linked | rotation 0 always |
| Card count-up | t > 0.97 | number text | 0 → value | 700ms, quartic out | final value, no tween |
| Covered card dim | p − i > 0.6 | opacity of number + sentence | 1 → 0.35 | 240ms `--ease` | no transition |
| Current dot | step change | width, radius, colour | 10 circle → 28×10 pill | 240ms `--ease` | instant |
| Quote chevron | hover | translateX | 0 → 3px | 180ms `--ease` | none |
| Dot / Next | click | window scroll | — | smooth | `behavior: auto` |

Scroll work runs in one `requestAnimationFrame` per scroll burst. Do not tween the transforms with CSS transitions on top of the scroll mapping: it lags the finger.

## States

- Nav link hover: colour `--ink-2` → `--ink`.
- Quote pill hover: chevron circle nudges 3px right.
- Next hover: fills ink, text turns white.
- Dot current: `aria-current="true"`, 28×10 ink pill. Others are 10px `--line` circles inside 40px hit targets.
- Card resting: full opacity.
- Card covered: number and sentence 35% opacity, label row unchanged.
- Card landing: number tweens up once per landing.
- Focus-visible: 2px ink outline, 3px offset, 8px radius on every link and button.
- Empty, error, loading: not used. The figures are static content.

## Accessibility

- The section is a `section` with `aria-labelledby` pointing to the `h2`.
- The stage is a list. Each card's `aria-label` reads the full stat so a screen reader does not hear "2" "3" "8" "0" mid-count.
- The dots are real buttons inside an `ol` labelled "Stats". Each has an `aria-label` ("Stat 2: interviews") and `aria-current` on the active one.
- Next is a button with a visible word. Icons are `aria-hidden`.
- A polite live region announces the card label when the step changes.
- Tab order: brand, nav links, Book a call, dots 1–4, Next, then the CTA band. Cards are not focusable; the controls drive them.
- Contrast: white on `#1f7a6d` is about 5.2:1, white on `#c2452d` about 5.0:1, `#13202b` on `#e3a21a` about 7.4:1, `#465462` on `#e8eef2` about 6.7:1.
- Hit targets: dots 40×40 (32×40 under 900px), Next 44px tall, quote pill 56px.

## Responsive rules

- ≥1280: as specified, 96px side padding, 76px headline.
- 1024–1100: side padding 48px, gap 40px, headline 60px, the four nav links hide; the brand and the pill stay.
- 768–900 and below: single column. Headline 38px, lede hidden, steps row under the headline with 8px gaps. Stage becomes `width: 100%; max-width: 340px`, centred. Cards 340px tall, peek 34px, numbers 76px with 30px suffix, sentences 15px.
- <640: same as above; the quote pill drops its words and keeps the 40px chevron circle. Check there is no horizontal scroll at 375px: rotated cards stay inside the pin's `overflow: hidden`.
- Never shrink the peek below 32px: the label row must stay readable in the pile.

## Acceptance checklist

### Always

- [ ] The pinned panel is exactly `100vh` and the section is `100vh + (n − 1) × 0.8 × 100vh` for n cards.
- [ ] One progress value drives every card. Card i uses the slice `[i − 1, i]`.
- [ ] In the first frame the first card is in place and the second card is visibly peeking and tilted.
- [ ] Each landed card sits `i × peek` below the first, so every covered label row stays visible.
- [ ] Rotation origin is bottom centre. Resting tilts are within ±2°.
- [ ] A number counts up once each time its card lands, and reads its final value under reduced motion.
- [ ] Dots and Next scroll to the matching step. The current dot has `aria-current`.
- [ ] Covered cards dim their number and sentence, not their label.
- [ ] No horizontal scroll at 375px wide.
- [ ] Focus is visible on every control.

### This demo

- [ ] Headline "The numbers behind every interview we run", 76px, with an ochre wave under "interview".
- [ ] Cards in order: 41 Languages (white/teal), 2,380 Interviews this year (ochre/ink), 6 days Brief to first session (teal/white), 93% Clients who return (brick/white).
- [ ] Card 420×480, radius 32, peek 44px, stage 420×612.
- [ ] Entry tilts 9, −8, 7 degrees; resting tilts −2, 1.5, −1 degrees.
- [ ] Counter reads "01 / 04" at the top and "04 / 04" when the pile is complete.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame (scrollY 0): floating white nav bar 16px from the top, headline "The numbers behind every interview we run" with a wave under "interview", counter "01 / 04", and the white Languages card (41) fully in place. The ochre card peeks tilted about 11° from below the stage, its top edge roughly 300px below the white card's top.
2. The wave under "interview" draws left to right on load, 800ms, 300ms delay.
3. The section is `100vh + 3 × 80vh` tall. Its inner panel is `position: sticky; top: 0; height: 100vh`. One step is `0.8 × innerHeight` of scroll.
4. Progress `p = clamp((scrollY − section.offsetTop) / step, 0, 3)`.
5. For card `i ≥ 1`, local `t = clamp(p − (i − 1), 0, 1)`. The card's translateY is `(1 − t) × 0.75 × cardHeight`, plus a queue offset `clamp((i − 1) − p, 0, 3) × (0.75 × cardHeight + 200)` that keeps later cards out of sight below the pin.
6. Rotation is `restingTilt[i] + (1 − t) × entryTilt[i]`, with resting `[0, −2, 1.5, −1]` degrees and entry `[0, 9, −8, 7]` degrees. Rotation origin is bottom centre.
7. Each card's resting top is `i × 44px`, so the finished pile shows a 44px strip of each covered card: its uppercase label and icon disc.
8. When `t` passes 0.97, the card's number counts up from 0 to its value in 700ms, quartic ease-out, formatted with thousands commas. If `t` drops back under 0.3, the count is re-armed for the next landing.
9. A card that is covered by more than 0.6 of the next card's travel dims its number and sentence to 35% opacity. The label row stays at full strength.
10. The counter and the dots follow `round(p)`. The current dot stretches from a 10px circle to a 28×10 pill in ink.
11. Clicking a dot smooth-scrolls to `section.offsetTop + i × step`. Next goes to the next step, and from step 4 to the following CTA band.
12. After the pin releases, an ochre CTA band follows: "Ready when your users are" at 88px with a Book a call pill.

## Tokens

```css
:root {
  /* colour */
  --bg: #e8eef2;        /* page, pale steel */
  --surface: #ffffff;   /* nav, first card, icon discs */
  --ink: #13202b;       /* headline, body, current dot */
  --ink-2: #465462;     /* lede, eyebrow, nav links */
  --line: #cfd9e0;      /* inactive dots */
  --ochre: #e3a21a;     /* wave, card 2, CTA band, quote circle */
  --teal: #1f7a6d;      /* card 1 text, card 3 fill */
  --brick: #c2452d;     /* card 4 fill */
  --focus: #13202b;

  /* type */
  --sans: "Schibsted Grotesk", system-ui, sans-serif;

  /* shape */
  --r-card: 32px;
  --r-pill: 14px;
  --peek: 44px;
  --card-h: 480px;
  --stage-w: 420px;

  /* motion */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --t-micro: 160ms;
  --t-layout: 240ms;
  --t-draw: 800ms;
  --t-count: 700ms;
}
```

Card colour pairs:

| Card | Fill | Text | Icon disc |
| --- | --- | --- | --- |
| 1 Languages | `--surface` | `--teal` | teal disc, white glyph |
| 2 Interviews | `--ochre` | `--ink` | white disc, ink glyph |
| 3 Brief to session | `--teal` | `#fff` | white disc, teal glyph |
| 4 Returning clients | `--brick` | `#fff` | white disc, brick glyph |

## Typography

One family, Schibsted Grotesk, at very different sizes. The size jump is the design.

| Role | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- |
| Headline h2 | 76px | 500 | 0.98 | −0.05em | Sentence |
| Stat number | 112px | 500 | 1 | −0.055em | — |
| Stat suffix (days, %) | 44px | 500 | 1 | −0.03em | lower |
| CTA band h3 | 88px | 500 | 0.95 | −0.05em | Sentence |
| Card sentence | 17px | 400 | 1.4 | 0 | Sentence |
| Lede | 16px | 400 | 1.5 | 0 | Sentence |
| Nav brand | 19px | 600 | 1 | −0.02em | — |
| Nav link | 15px | 500 | 1 | 0 | — |
| Eyebrow, card label | 13px | 600 | 1 | 0.06–0.08em | UPPER |
| Counter | 14px | 600 | 1 | 0.02em | tabular |

Use lining figures on the stat number, not tabular. Tabular figures make the comma in "2,380" a full figure wide.

## Implementation notes

1. The scroll mapping. Keep it to one function and one rAF:

```js
const step = () => innerHeight * 0.8;
function render() {
  const p = clamp((scrollY - section.offsetTop) / step(), 0, cards.length - 1);
  const rise = cards[0].offsetHeight * 0.75;
  cards.forEach((c, i) => {
    if (!i) return;
    const t = clamp(p - (i - 1), 0, 1);
    const queued = clamp((i - 1) - p, 0, 3) * (rise + 200);
    const r = reduce ? 0 : tilt[i] + (1 - t) * enter[i];
    c.style.transform = `translateY(${(1 - t) * rise + queued}px) rotate(${r}deg)`;
    if (t > 0.97 && !landed[i]) { landed[i] = true; countUp(c); }
    if (t < 0.3) landed[i] = false;
  });
}
```

The `queued` term is what stops cards 3 and 4 sitting right behind card 2 in the first frame. Without it, all three peek in the same spot.

2. The wave underline is a single path with `pathLength="1"`, so the draw needs no measuring:

```html
<span class="wavy">interview<svg viewBox="0 0 100 16" preserveAspectRatio="none" aria-hidden="true">
  <path pathLength="1" d="M0 8 Q 6.25 0 12.5 8 T 25 8 T 37.5 8 T 50 8 T 62.5 8 T 75 8 T 87.5 8 T 100 8"/></svg></span>
```

```css
.wavy { position: relative; display: inline-block; }
.wavy svg { position: absolute; left: -2px; bottom: -14px; width: calc(100% + 4px); height: 16px; overflow: visible; }
.wavy path { fill: none; stroke: var(--ochre); stroke-width: 5; stroke-linecap: round;
  stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw .8s var(--expo) .3s forwards; }
```

3. The count-up writes `innerHTML` so the suffix stays in its smaller `small` element:

```js
function countUp(card) {
  const el = card.querySelector('.num'), to = +el.dataset.to;
  const tail = el.dataset.suffix ? `<small>${el.dataset.suffix}</small>` : '';
  if (reduce) { el.innerHTML = to.toLocaleString('en-US') + tail; return; }
  const t0 = performance.now();
  requestAnimationFrame(function tick(now) {
    const k = Math.min(1, (now - t0) / 700), e = 1 - (1 - k) ** 4;
    el.innerHTML = Math.round(to * e).toLocaleString('en-US') + tail;
    if (k < 1) requestAnimationFrame(tick);
  });
}
```

Common mistakes:

- Stacking the cards with no peek. The pile then looks like one card and the earlier stats vanish.
- Tilting around the centre. A centre origin swings the top corners into the headline column; bottom centre keeps the motion low.
- Animating `top` instead of `transform`. Use transforms only.
- Starting with no card peeking. The section then reads as a static card and nobody scrolls.
- Using four random brand colours. Keep one white card, one warm, one cool, one hot, and repeat the page accent (ochre) on the wave and the CTA.
- Making the cards focusable buttons. They do nothing on click; the dots and Next are the controls.
- Forgetting `overflow: hidden` on the pin. Tilted cards then create horizontal scroll on phones.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
