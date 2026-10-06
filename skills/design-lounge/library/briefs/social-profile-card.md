<!-- Design Lounge Nº 233 · "Editorial creator profile card" · www.designlounge.live -->

# Editorial creator profile card

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The profile card of a writer on "Thatch", an invented newsletter-and-essays platform. It sits in a sidebar, a hover preview or a "Who to follow" rail. The cover reads like the masthead of a printed issue: an oxblood block with a small-caps issue line, a two-line italic serif kicker and a huge ghosted italic "41" bleeding off the bottom-right edge. An 88px ochre avatar with italic initials overlaps the cover. Below it come the name, handle, bio, three stats in hairline columns, the latest letter, and a mutuals row. The detail worth copying is how quiet the motion is. The stats count up once on load with a quartic ease-out, and following someone ticks the follower count by exactly one with the same counter. No confetti, no bounce.

## Structure

```
page 1280 × 800, paper #ECE5D8 with 32px rule lines, card centred
┌──────────────── card 440 wide, radius 6, 1px #DDD3C4 ────────────────┐
│ COVER 176 tall, #8C2F1B, padding 18/24                              │
│ LETTERS FROM THE EDGE                                      VOL. 4    │
│ Field notes on slow cities          (Fraunces italic 24)             │
│ and who keeps them                                    ╱41 ghosted    │
│  ┌────┐                                                              │
├──│ Ja │────────────────────────────────────────── [ + Follow ] ──────┤
│  └────┘ 88px, −44px overlap, 4px card-colour ring, green dot          │
│ Juno Achterberg                       Fraunces 600 30                │
│ @juno.writes · Rotterdam · on Thatch since 2021      13px muted      │
│ Urbanist and essayist. I walk a city until it tells me…  max 36ch    │
│ ──────────────────────────────────────────────────────────────────── │
│ 48,213       │ 312          │ 141                                    │
│ FOLLOWERS    │ FOLLOWING    │ LETTERS                                │
│ ──────────────────────────────────────────────────────────────────── │
│ Latest  The bench as infrastructure     (italic serif 17)            │
│ (MS)(TB)(RA)  Followed by Mira Sato, Teo Brandt and 14 others…       │
└──────────────────────────────────────────────────────────────────────┘
```

- `article.card` labelled by the `h1` name.
- Cover is decorative (`aria-hidden="true"`). It contains the issue line, the kicker `p`, and the ghost numeral `span`.
- `.row` holds the avatar (decorative initials) and the follow `button` aligned to its bottom edge.
- Stats are a `dl` with three `div` groups. Each `dt` is visually hidden and the visible uppercase label is `aria-hidden` to avoid double reading.
- "Latest" is a `p` with a link.
- Mutuals are a decorative face stack plus a `p` with two `strong` names.
- One visually hidden `p aria-live="polite"` for follow announcements.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Stat counters | load | text value | 0 → target | 1100ms, stagger 90ms, delay 120ms | quartic out `1-(1-p)^4` | final values at once |
| Follower tick | follow toggle | text value | n → n±1 | 380ms | quartic out | instant |
| Button fill | aria-pressed | background, color | ink fill ↔ transparent | 180ms | `--ease` | none |
| Button press | :active | transform | scale 1 → .96 | 120ms | `--ease` | none |
| Latest underline | hover/focus | background-size | 0 → 100% 1px | 300ms | `--expo` | none |
| Mutual fan | row hover | translateX | 0 → 4px / 8px | 200ms | `--expo` | none |

## States

- Follow resting: `--ink` fill, `--card` text, plus icon, "Follow". Hover darkens the fill to `#3a312b`.
- Following: transparent fill, 1px `--ink` border, check icon, "Following".
- Following + hover: "Unfollow", no icon, text and border `--accent`.
- Focus-visible everywhere: 2px `--accent` outline, offset 3px.
- Presence: 14px `--online` dot, bottom-right of avatar, 3px card-colour ring.
- Loading: not shown. If data is loading, render the card frame with stat numbers as "—", not skeleton bars.
- Error: not part of this piece.

## Accessibility

- `button` with `aria-pressed`. The visible label changes too ("Follow" / "Following"), so screen-reader and sighted users get the same state.
- The hover-only "Unfollow" label is a visual cue. The accessible name stays "Following" with pressed=true, which is correct.
- Stats are a `dl`. Visible labels are `aria-hidden` and hidden `dt`s carry the names.
- The live region announces follow/unfollow once. It does not announce the counter animation.
- Contrast: `#6f665d` on `#fbf8f2` ≈ 5.3:1. `#f6e9dc` on `#8c2f1b` ≈ 8:1.
- Hit targets: button 40px tall, min 128px wide.
- Tab order: follow button → latest link.

## Responsive rules

- ≥1280 and 1024: card stays 440px, centred.
- 768: unchanged.
- <640: card is `min(440px, 100%)` with 16px page padding. At 375 the stats keep three columns, labels stay one line, and the mutuals text wraps to two lines.
- Never truncate the name. Allow it to wrap.

## Acceptance checklist

### Always

- [ ] Cover is a solid accent block with an issue line, a two-line italic kicker and a ghosted numeral, with no image.
- [ ] Avatar is 88px and overlaps the cover by exactly half (−44px) with a 4px ring in the card colour.
- [ ] Follow button is 40px tall with `aria-pressed`, and its label changes between Follow and Following.
- [ ] Hovering the followed button shows Unfollow in the accent colour.
- [ ] Stats are three equal columns split by 1px hairlines, top and bottom rules included.
- [ ] Counters use tabular numerals and quartic ease-out, and run once on load.
- [ ] Following changes the follower count by exactly one, animated.
- [ ] A polite live region announces follow changes.
- [ ] Reduced motion shows final numbers immediately.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Name "Juno Achterberg", handle "@juno.writes · Rotterdam · on Thatch since 2021".
- [ ] Stats 48,213 Followers, 312 Following, 141 Letters.
- [ ] Cover reads "LETTERS FROM THE EDGE · VOL. 4" and "Field notes on slow cities and who keeps them".
- [ ] Latest letter "The bench as infrastructure".
- [ ] Mutuals: MS, TB, RA faces, "Followed by Mira Sato, Teo Brandt and 14 others you follow".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: the card is centred on a warm paper page ruled with faint 32px horizontal lines. Stats show 0 and count up to 48,213 / 312 / 141 over 1100ms each, staggered by 90ms, starting 120ms after load.
2. The Follow button is a 40px ink pill with a plus icon and the word "Follow". `aria-pressed="false"`.
3. Click Follow. The button becomes outlined (transparent fill, ink border, ink text), the icon becomes a check and the label reads "Following". `aria-pressed="true"`. The follower count animates from 48,213 to 48,214 over 380ms. A polite live region says "You now follow Juno Achterberg".
4. Hover the button while following. Label swaps to "Unfollow", the check hides, and text and border turn oxblood `#8C2F1B`. This is the confirmation affordance. It is not a second button.
5. Click again to unfollow. Back to the filled ink pill, count 48,214 → 48,213, live region "You unfollowed Juno Achterberg".
6. Hover the "Latest" title. A 1px oxblood underline grows from left to right over 300ms.
7. Hover the mutuals row. The second and third face fan out by 4px and 8px over 200ms, as if the stack loosened.
8. Press on the button scales it to 0.96 for 120ms.
9. Reduced motion: counters render final values immediately, and all transitions are removed.

## Tokens

```css
:root {
  --bg: #ece5d8;          /* page paper */
  --card: #fbf8f2;        /* card surface */
  --ink: #1f1a17;         /* primary text, filled button */
  --ink-2: #4a423b;       /* bio */
  --ink-3: #6f665d;       /* meta, labels */
  --line: #ddd3c4;        /* hairlines, card border */
  --accent: #8c2f1b;      /* oxblood: cover, focus, unfollow hover, emphasis */
  --accent-ink: #f6e9dc;  /* text on cover */
  --ochre: #d9a441;       /* avatar */
  --online: #3f7a4a;      /* presence dot */
  --serif: "Fraunces", Georgia, serif;
  --sans: "Instrument Sans", system-ui, sans-serif;
  --r: 6px;
  --pill: 999px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 24px;
  --shadow-card: 0 1px 0 rgba(31,26,23,.04), 0 24px 48px -28px rgba(60,36,20,.35);
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
  --t-micro: 180ms;
  --t-count: 1100ms;
  --t-tick: 380ms;
}
```

## Typography

| Role | Family | Size / line | Weight | Tracking | Notes |
| --- | --- | --- | --- | --- | --- |
| Issue line | Instrument Sans | 11px | 600 | 0.14em | uppercase, `--accent-ink` |
| Kicker | Fraunces italic | 24 / 1.12 | 400 | 0 | opsz 48, max-width 270px |
| Ghost numeral | Fraunces italic | 150 / 1 | 400 | −0.06em | `rgba(246,233,220,.16)`, opsz 144 |
| Avatar initials | Fraunces italic | 34px | 600 | −0.04em | "Ja", mixed case on purpose |
| Name | Fraunces | 30 / 1.05 | 600 | −0.02em | opsz 72 |
| Handle | Instrument Sans | 13px | 400 | 0 | `--ink-3` |
| Bio | Instrument Sans | 15 / 1.5 | 400 | 0 | `--ink-2`, 36ch |
| Bio emphasis | Fraunces italic | 16px | 400 | 0 | `--accent` |
| Stat number | Fraunces | 26 / 1 | 400 | −0.02em | tabular lining numerals |
| Stat label | Instrument Sans | 11px | 600 | 0.12em | uppercase |
| Latest title | Fraunces italic | 17 / 1.25 | 400 | 0 | |
| Button | Instrument Sans | 14px | 600 | 0 | |
| Mutual initials | Instrument Sans | 9px | 600 | 0.02em | |

Use `font-variant-numeric: tabular-nums lining-nums` on stat numbers so the count-up does not wobble horizontally.

## Implementation notes

The counter. Use one function for both the load count-up and the follow tick, driven by `requestAnimationFrame`:

```js
const fmt = n => n.toLocaleString('en-US');
function count(el, from, to, ms) {
  if (reduce) { el.textContent = fmt(to); return; }
  const t0 = performance.now();
  const step = t => {
    const p = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - p, 4);
    el.textContent = fmt(Math.round(from + (to - from) * e));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
```

Keep the true value in `data-to` and read it before animating. Do not parse the displayed text, because mid-animation it is wrong.

The three-state button is all CSS on `aria-pressed` plus `:hover`:

```css
.follow[aria-pressed="true"] { background: transparent; color: var(--ink); }
.follow[aria-pressed="true"]:hover { color: var(--accent); border-color: var(--accent); }
.follow .alt { display: none; }
.follow[aria-pressed="true"]:hover .lbl { display: none; }
.follow[aria-pressed="true"]:hover .alt { display: inline; }
```

Give the button a `min-width` (128px) so "Follow" → "Following" → "Unfollow" never changes its width and nudges the layout.

The ghost numeral is a `span` absolutely positioned at `right: 10px; bottom: -22px` with `overflow: hidden` on the cover, so it is cut by the cover edge like a printed bleed.

Common mistakes:

- Animating the counter with a linear ease. It reads as a slot machine.
- Bouncing or spring-scaling the button on follow.
- A stock photo cover. The cover is typographic.
- Putting a drop shadow under the avatar instead of the card-coloured ring.
- Using the serif for the button or the labels.
- Announcing every counter frame to assistive tech.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
