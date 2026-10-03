<!-- Design Lounge Nº 316 · "Outline to fill topic list" · designlounge.vercel.app -->

# Outline to fill topic list

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

Studied from hauntedbouldercity.com: the "You'll learn about..." list, where every topic is a giant outlined condensed word and only the one in the middle of the screen fills in, steps to the right behind a coloured bar, and changes the photo behind it. This piece is the "what you'll hear" section of a fictional cemetery night walk, Hollinsmoor After Dark. Eight topics, each a number, an 88px name and one sentence. A sticky backdrop on the right shows a large monoline drawing for the current topic, a soft colour wash that shifts per topic, and a big counter "01/08". The detail worth copying is that a plain features list becomes a reading pace: the page shows one topic at full voice and keeps the others as quiet outlines, so eight items never feel like a wall.

## Reference behaviour

1. First frame: the kicker "04 / On the walk · 90 minutes · 1.2 km · lanterns provided", the heading "You'll hear" (solid) / "about..." (outlined), then topic 01 "The iron gate" already filled, stepped 160px right, with a 2px mint bar on its left and mint number. Topic 02 shows below as an outline. The backdrop shows the gate drawing at 20% opacity and the counter reads 01/08 "The iron gate".
2. As you scroll, the topic whose vertical centre is closest to the viewport centre becomes current. Only one is current.
3. Becoming current: name fill goes from transparent to bone (450ms), outline from 50% to full bone, description opacity 0.55 → 1, the block slides right 0 → 160px (600ms expo-out), the mint bar grows from the top (scaleY 0 → 1, 500ms).
4. Losing current reverses all of it at the same speeds.
5. The backdrop crossfades: old drawing fades to 0 and shrinks to 0.94, new one fades to 0.2 and scales to 1 (700ms opacity, 1000ms scale). The radial colour wash interpolates to the topic's colour over 800ms. The counter and caption change.
6. A fixed rail of eight short ticks sits at the left edge, vertically centred. The current tick is mint and 40% taller. Clicking a tick or a topic name scrolls that topic to the centre (smooth, or instant under reduced motion).
7. Tabbing onto a topic name also centres it, so keyboard users get the same filled state.
8. After topic 08 the backdrop releases and a booking strip ("Find a night") scrolls up.

## Structure

```
1280 × 800, section scrolls (≈ 2400px), backdrop sticky 100vh
┌──────────────────────────────────────────────────────────────────────────┐
│ 04 / ON THE WALK   90 MINUTES · 1.2 KM · LANTERNS PROVIDED              │ header 56px 48px
│ YOU'LL HEAR                                                              │ h2 112px
│ ABOUT...  (outlined)                                                     │
│ ╎                                                                        │
│ ╎        ┃ 01 /                                 ┌────────────────┐       │ backdrop drawing
│ ╎ rail   ┃ THE IRON GATE   (filled, +160px)     │  monoline SVG  │       │ min(42vw,520px) square
│ ╎ 8 ticks┃ one sentence, max 440px              │   20% bone     │       │ right 6%
│ ╎                                               └────────────────┘       │
│    02 /                                                                  │
│    THE BELL GRAVE  (outline 1px, 50% bone)                       01/08   │ counter 64px
│    sentence at 55%                                         THE IRON GATE │ right 48 bottom 36
└──────────────────────────────────────────────────────────────────────────┘
 list: padding 64px 48px 30vh, item max-width 760, item padding 22px 0 22px 22px
```

- `section.sec aria-labelledby` the `h2`.
- `div.back` (`aria-hidden`, `position: sticky; top: 0; height: 100vh; margin-bottom: -100vh`) so it sits behind the list without taking space: `.wash`, `.glyphs` (eight inline SVGs on a 200×200 viewBox, stroke 1.2, round caps), `.grain`, `.hud` (counter and caption).
- `header` with a kicker `p` and the `h2`.
- `ol.list > li.item` × 8, each with `id`, `data-w` (wash colour) and `data-c` (caption). Inside: `p.n` number, `h3 > a href="#tN"`, `p` sentence.
- `ol.rail aria-label="Topics"`, fixed, generated from the items: `a` with an `aria-label` like "03 The stone choir" and `aria-current`.
- `section.end` with a sentence and the booking link.
- A visually hidden polite live region.

## Tokens

```css
@property --w { syntax: "<color>"; inherits: true; initial-value: #3a2226; }

:root {
  --ash: #140d0e;            /* page */
  --ash-2: #1d1415;          /* bottom of page gradient */
  --bone: #eae0cf;           /* filled names, heading */
  --bone-2: #bfb5a6;         /* sentences */
  --bone-3: #8f8579;         /* numbers, kicker, caption */
  --stroke: rgba(234,224,207,.5);   /* outline names */
  --line: rgba(234,224,207,.14);    /* rail ticks, end rule */
  --mint: #7fd1c3;           /* spectral accent: bar, current number, rail, button */
  --mint-2: #b5e6dc;         /* button hover */
  --focus: #7fd1c3;

  --display: "Big Shoulders Display", Impact, "Arial Narrow", sans-serif;
  --mono: "Spline Sans Mono", ui-monospace, monospace;

  --h2: clamp(56px, 8vw, 112px);
  --h3: clamp(48px, 6.4vw, 88px);
  --step: 160px;             /* current indent; 48px ≤900, 14px ≤560 */
  --gutter: 48px;

  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --t-fill: 450ms; --t-step: 600ms; --t-bar: 500ms;
  --t-glyph: 700ms; --t-glyph-scale: 1000ms; --t-wash: 800ms;
}
```

Wash colours, topics 01–08: `#3a2226`, `#1f3134`, `#3a2c1f`, `#2a2238`, `#3a3020`, `#22301f`, `#1a2a36`, `#34212a`. Each is a radial gradient (60% × 70% at 72% 50%) fading to transparent at 70% over the page gradient.

## Typography

| Role | Family | Size / LH | Weight | Tracking | Case / colour |
| --- | --- | --- | --- | --- | --- |
| Kicker | Spline Sans Mono | 11px | 400 / 500 | 0.16em | uppercase, `--bone-3`; "04" mint |
| Section h2 | Big Shoulders Display | `--h2` / 0.88 | 900 | 0.005em | uppercase; line 2 outlined 1.5px bone |
| Topic number | Spline Sans Mono | 11px | 400 | 0.16em | "01 /", `--bone-3`, current mint |
| Topic name h3 | Big Shoulders Display | `--h3` / 0.9 | 700 | 0.01em | uppercase; outline 1px `--stroke`, current solid bone |
| Sentence | Spline Sans Mono | 14.5px / 1.6 | 400 | 0 | `--bone-2`, max 440px |
| Counter | Big Shoulders Display | 64px | 900 | 0 | tabular, "/08" 28px 700 `--bone-3` |
| Caption | Spline Sans Mono | 11px | 400 | 0.16em | uppercase, `--bone-3` |
| Button | Spline Sans Mono | 14px | 500 | 0 | `--ash` on `--mint` |

Outlined type uses `color: transparent` plus `-webkit-text-stroke`. Keep outline width 1px for names and 1.5px for the bigger heading so both read the same weight.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Name fill | becomes current | color, stroke colour | transparent / 50% → bone / bone | 450ms `--ease` | instant |
| Item step | becomes current | translateX | 0 → 160px | 600ms `--expo` | no step; fill only |
| Mint bar | becomes current | scaleY from top | 0 → 1 | 500ms `--expo` | instant |
| Sentence | becomes current | opacity | 0.55 → 1 | 450ms `--ease` | instant |
| Drawing out | topic change | opacity, scale | 0.2 → 0, 1 → 0.94 | 700ms / 1000ms | instant |
| Drawing in | topic change | opacity, scale | 0 → 0.2, 0.94 → 1 | 700ms / 1000ms | instant |
| Wash | topic change | `--w` colour | old → new | 800ms `--ease` | instant |
| Rail tick | topic change | background, scaleY | line → mint, 1 → 1.4 | 300ms | instant |

Nothing animates on its own. Every change follows scroll position, so the list never moves while the reader is still.

## States

- Item resting: outlined name, muted number, sentence 55%, no bar, no indent.
- Item current (`.on`): filled name, mint number, sentence 100%, mint bar, stepped right.
- Name link hover (any item): outline goes to full bone, fill stays transparent unless current.
- Focus-visible: 2px mint outline, 6px offset on names, 4px elsewhere. Focusing a name centres it, which also makes it current.
- Rail tick hover: `--bone-2`. Current: mint, 1.4× tall, `aria-current="true"`.
- Button hover: `--mint-2`.

## Accessibility

- The list is an `ol` of real headings with links, so it reads as eight topics in order with or without the visual effect.
- Outlined text alone fails contrast as body text, so it's only used for 48px+ names; the sentence under each is always solid `--bone-2` (≈ 9:1 on `--ash`, ≈ 5:1 at 55% opacity on `--ash`). The 55% state is decorative emphasis, not hidden content.
- The backdrop, drawings, wash and counter are `aria-hidden`. A polite live region says "Topic 3: The stone choir" on change.
- Rail links have names ("03 The stone choir") and `aria-current`. Ticks are 14×22px visually; in a touch product, pad them to 44px.
- Tab order: names in order, then rail, then the booking link.

## Responsive rules

- ≥1280: as drawn. Step 160px.
- 1024: same; names shrink with `6.4vw`.
- ≤900: step 48px, drawing 70vw pushed off the right edge at 70% opacity so it stays a backdrop.
- ≤560: page padding 22px, list left padding 30px (room for the rail at 6px), step 14px, the second kicker item and the counter hide, sentence 13.5px.
- Keep 30vh of bottom padding on the list at every size so the last topic can reach the centre.

## Acceptance checklist

### Always

- [ ] Exactly one topic is current: the one whose centre is nearest the viewport centre.
- [ ] Current = solid fill, accent bar, accent number, full-opacity sentence, stepped right. Others = outline only.
- [ ] The backdrop is sticky behind the list (negative margin), not a fixed layer covering the footer.
- [ ] Drawing, wash colour, counter and caption all change with the current topic.
- [ ] Rail ticks and topic names scroll their topic to centre.
- [ ] Focusing a topic name centres and fills it.
- [ ] Sentences are solid text, never outline.
- [ ] Reduced motion: no step, no fades; states switch instantly.
- [ ] No horizontal overflow at 375px.

### This demo

- [ ] Eight topics from "The iron gate" to "The last tram".
- [ ] Names 88px Big Shoulders Display 700, outline `rgba(234,224,207,.5)`.
- [ ] Accent `#7fd1c3`; page `#140d0e`.
- [ ] Counter shows "01/08" in the first frame.
- [ ] Booking link reads "Find a night".

## Implementation notes

1. **Pick the item nearest the centre, in one rAF pass.** IntersectionObserver with a thin band also works, but nearest-centre never leaves a gap between items.

```js
function update() {
  ticking = false;
  const mid = innerHeight / 2; let best = 0, bd = Infinity;
  items.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    const d = Math.abs(r.top + r.height / 2 - mid);
    if (d < bd) { bd = d; best = i; }
  });
  set(best);   /* toggles .on, swaps drawing, sets --w, counter, rail, live region */
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
```

2. **Sticky backdrop that takes no space.**

```css
.back { position: sticky; top: 0; height: 100vh; margin-bottom: -100vh;
        overflow: hidden; pointer-events: none; }
```

3. **Animate a gradient colour.** Gradients can't transition, but a registered custom property inside one can:

```css
@property --w { syntax: "<color>"; inherits: true; initial-value: #3a2226; }
.wash { background: radial-gradient(60% 70% at 72% 50%, var(--w), transparent 70%),
                    linear-gradient(180deg, var(--ash), var(--ash-2));
        transition: --w 800ms var(--ease); }
```

Common mistakes:

- Filling the item when it enters the viewport instead of when it reaches the centre; then three are filled at once.
- Animating `font-weight` or `font-size` for emphasis. That reflows the whole list. Fill and translate only.
- Outline text for sentences. Thin strokes at 14px are unreadable.
- A fixed backdrop that floats over the booking strip. Use sticky inside the section.
- Forgetting bottom padding, so the last topic can never become current.
- Photo backdrops with no dark wash; the outlines vanish over bright spots.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
