<!-- Design Lounge Nº 021 · "Hover tilt cards" · www.designlounge.live -->

# Hover tilt cards

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A pricing row for a design tool ("Tessel") with three 340 × 440 cards: Sketch (€12), Studio (€48, highlighted, "Most picked" badge), Scale (€190). Each card sits in its own 1000px perspective. As the pointer moves across a card it rotates toward the cursor — at most 8° on either axis — a soft white radial highlight tracks the pointer across the surface, and the shadow deepens and drops as if the card lifted. When the pointer leaves, the card returns to flat over 650ms on an overshooting cubic-bezier, so it settles with one small bounce. The detail worth copying is the two transition profiles: a 90ms linear transition while tracking (so it follows the hand without lag or jitter) and a 650ms spring only on the way back.

## Structure

```
1280 × 800  (everything centred vertically and horizontally)
                       Choose your Tessel plan
        Billed monthly. Every plan includes the desktop app and unlimited exports.

   ┌──────────────────┐   ┌──────────────────┐  ← "Most picked" badge, top −12px, right 24px
   │ SOLO           ● │   │ TEAM           ● │   ┌──────────────────┐
   │                  │   │                  │   │ COMPANY        ● │
   │ Sketch           │   │ Studio           │   │ Scale            │
   │ €12  per editor  │   │ €48  per editor  │   │ €190 per editor  │
   │ For one person…  │   │ Shared libraries…│   │ SSO, audit logs… │
   │ - 3 projects     │   │ - Unlimited …    │   │ - Everything in… │
   │ - 2 GB storage   │   │ - 50 GB storage  │   │ - SAML SSO & SCIM│
   │ - History 30 d   │   │ - History 1 yr   │   │ - Unlimited hist.│
   │                  │   │ - Guest reviewers│   │                  │
   │ [Start w/ Sketch]│   │ [Start w/ Studio]│   │ [Talk to sales]  │
   └──────────────────┘   └──────────────────┘   └──────────────────┘
       340 × 440, pad 28       gap 28                 (each "-" is a 16px inline check SVG)

   Move the pointer across a card: it tilts up to 8° toward the cursor…
```

- `.head` — centred `<h1>` and `<p>`, 40px below to the grid.
- `.grid` — flex row, gap 28px. Each child is `.scene { perspective: 1000px }` wrapping one `<article class="card" tabindex="0" aria-labelledby>`.
- `.card` — flex column, padding 28px, radius 16px, 1px border. Children in order: `.badge` (Studio only, absolute), `.tier` (label + dot), `<h2 class="name">`, `.price` (`<b>` amount + `<span>` unit), `<p class="desc">`, `<ul>` of features with a 16px check SVG, `<button class="cta">` pushed to the bottom with `margin-top: auto`.
- `.card::after` — the specular highlight layer (radial gradient, `pointer-events: none`).
- `.note` — caption, 36px below the grid.

Card copy:

| Tier    | Name   | Price | Description | Features | CTA |
|---------|--------|------:|-------------|----------|-----|
| Solo    | Sketch | €12   | For one person shipping one product. Everything you need, nothing to administer. | 3 projects · 2 GB asset storage · Version history, 30 days | Start with Sketch |
| Team    | Studio | €48   | Shared libraries, review links and a permissions model that survives your second hire. | Unlimited projects · 50 GB asset storage · Version history, 1 year · Guest reviewers, free | Start with Studio |
| Company | Scale  | €190  | SSO, audit logs and a named engineer who answers within four hours, 24 / 7. | Everything in Studio · SAML SSO & SCIM · Unlimited history | Talk to sales |

Unit line under every price: "per editor / month".

## Motion

| Element        | Trigger        | Property                 | From → To                       | Duration | Easing     | Notes |
|----------------|----------------|--------------------------|---------------------------------|---------:|------------|-------|
| `.card`        | pointermove    | `rotateX`, `rotateY`     | 0 → ±8° (linear in pointer pos) | 90ms     | linear     | via `--rx`/`--ry`, rAF-throttled |
| `.card`        | pointerleave   | `rotateX`, `rotateY`     | current → 0                     | 650ms    | `--spring` | overshoots ≈1° then settles |
| `.card`        | pointerenter   | box-shadow               | rest → lift                     | 160ms    | `--ease`   | |
| `.card`        | pointerleave   | box-shadow               | lift → rest                     | 650ms    | `--spring` | same clock as rotation |
| `.card::after` | enter / leave  | opacity                  | 0 ↔ 1                           | 160ms    | `--ease`   | gradient centre follows `--mx`/`--my` with no transition |
| `.cta`         | hover          | background, border-color | see States                      | 160ms    | linear     | |

Pointer position → rotation (card is 340 × 440):

| Pointer (x, y) in card | `--ry` | `--rx` | Reads as |
|------------------------|-------:|-------:|----------|
| (0, 0) top-left        | −8°    | +8°    | top-left corner toward viewer |
| (170, 220) centre      | 0°     | 0°     | flat |
| (340, 220) right edge  | +8°    | 0°     | right edge toward viewer |
| (170, 440) bottom      | 0°     | −8°    | bottom edge toward viewer |
| (255, 110)             | +4°    | +4°    | quarter tilt |

Highlight gradient: `radial-gradient(360px circle at var(--mx) var(--my), rgba(255,255,255,.14), rgba(255,255,255,.04) 40%, transparent 70%)`.

Reduced motion: `.card { transition: none; transform: none !important } .card::after { display: none }` and the JS returns early from all pointer handlers.

## States

- **Rest:** flat, `--shadow-rest`, highlight opacity 0.
- **Tracking (`.track`):** tilted, `--shadow-lift`, highlight visible.
- **Focus-visible (card):** `--shadow-lift`, border `--accent`, no tilt.
- **Highlighted plan (`.hot`):** tier dot `--accent`; badge visible; CTA filled `--accent` with `--accent-ink` text.
- **CTA hover:** border `--ink-3` (outlined); background `--accent-hover` (filled).
- **CTA focus-visible:** `outline: 2px solid var(--accent); outline-offset: 2px`.
- **Disabled / loading:** not part of this piece.

## Accessibility

- Each card is an `<article tabindex="0" aria-labelledby="{plan name id}">` so keyboard users can reach the card itself (and see the lift), then Tab into its CTA.
- Focus order: card 1 → its CTA → card 2 → its CTA → card 3 → its CTA.
- The tilt is pointer-only decoration; nothing is conveyed by it. The highlight pseudo-element is `pointer-events: none` so it never intercepts clicks on the CTA.
- Check icons are decorative SVGs without titles; the feature text carries the meaning.
- Contrast: `--ink-2` on `--card` 6.5:1; `--ink-3` on `--card` 3.3:1 (caption and dot only); `--accent-ink` on `--accent` 8.9:1.
- Hit target: CTA 44px tall, full card width minus padding (284px).
- Never rotate on `focus` — a tilted card under keyboard focus reads as a glitch.

## Responsive rules

- ≥ 1280: three cards in a row, as specified.
- 1024–1279: cards 300 × 440, gap 20px; tilt unchanged.
- 768–1023: cards 2 + 1 wrap (`flex-wrap`), 320px wide; the third card centred below.
- < 640: single column, cards 100% wide (max 360px), 400px tall; tilt disabled (touch has no hover — do not attach pointer handlers when `matchMedia('(hover: none)')` matches); the badge moves inside the card above the tier row.

## Acceptance checklist

- [ ] Cards are 340 × 440 with 28px padding, 16px radius, in a 1000px perspective each (`perspective` on the wrapper, not on the card).
- [ ] Rotation is linear in pointer position and clamps to ±8° on both axes at the card edges.
- [ ] `rotateY` is positive when the pointer is on the right half; `rotateX` is positive when the pointer is on the top half (card tips toward the cursor).
- [ ] While tracking, the transform transition is 90ms linear; pointer updates are throttled to one per animation frame.
- [ ] On leave the card returns over 650ms with `cubic-bezier(.34,1.56,.64,1)` and visibly overshoots once.
- [ ] A radial highlight (360px radius, white at 14% → 4% → 0) follows the pointer and fades in/out over 160ms.
- [ ] Shadow changes from the rest to the lift definition on enter/focus.
- [ ] Focused card lifts and shows an orange border but does not tilt.
- [ ] The Studio card shows a "Most picked" badge overlapping its top edge by 12px and an orange filled CTA.
- [ ] Card content does not blur during rotation (`translateZ(0)` on children or `transform-style: preserve-3d`).
- [ ] With `prefers-reduced-motion: reduce` or `(hover: none)`, no tilt or highlight is applied.
- [ ] No pointer handler throws when the pointer leaves before the pending frame runs.
- [ ] Pointer updates are clamped to the 0–1 range so a fast exit never leaves a card at more than 8°.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: centred heading "Choose your Tessel plan" and a one-line subtitle, three cards in a row with 28px gaps, a caption underneath. All cards flat, resting shadow. The middle card has an orange tier dot, an orange "Most picked" badge overlapping its top edge, and an orange filled CTA. The others have grey dots and outlined CTAs.
2. Pointer enters a card: class `track` is added. Transition durations switch to 90ms (transform) and 160ms (shadow). Shadow goes from resting to lifted; the specular layer fades in (160ms).
3. Pointer moves: on each frame (throttled with `requestAnimationFrame`), pointer position is normalised to 0–1 across the card's box. `rotateY = (x − 0.5) × 16°` (−8° at left edge, +8° at right); `rotateX = (0.5 − y) × 16°` (+8° at top, −8° at bottom). The highlight centre is set to `x%, y%`.
4. Pointer leaves: `track` is removed, `--rx` and `--ry` are set to 0. The return transition is 650ms `cubic-bezier(.34,1.56,.64,1)`, which overshoots past flat by roughly 1° and settles. Shadow returns on the same curve; highlight fades over 160ms.
5. Keyboard focus on a card (`tabindex="0"`): lifted shadow and a 1px orange border, no tilt. CTA buttons are separately focusable with a 2px orange outline.
6. Hover a CTA: border becomes `--ink-3`; on the highlighted card the orange fill lightens to `#ff7e57`.
7. Card content is on its own composited layer (`translateZ(0)`) so text stays crisp during rotation.
8. With `prefers-reduced-motion: reduce`: no tilt (JS ignores pointer events), no highlight layer, transitions off; the shadow lift on focus remains.

## Tokens

```css
:root {
  /* colour — cool charcoal, one coral accent */
  --bg: #121316;
  --card: #1b1d22;
  --card-2: #22252b;      /* outlined CTA fill */
  --line: #2b2e36;
  --ink: #edeef2;
  --ink-2: #9aa0ab;       /* tier label, unit, description */
  --ink-3: #666c78;       /* resting tier dot, caption, CTA hover border */
  --accent: #ff6a3d;      /* badge, hot dot, checks, hot CTA, focus */
  --accent-hover: #ff7e57;
  --accent-ink: #1a0c07;  /* text on accent */

  /* type */
  --display: "Syne", system-ui, sans-serif;
  --sans: "Manrope", system-ui, sans-serif;

  /* geometry */
  --card-w: 340px;
  --card-h: 440px;
  --card-pad: 28px;
  --gap: 28px;
  --r: 16px;
  --r-cta: 10px;
  --tilt: 8deg;           /* max rotation per axis */
  --persp: 1000px;
  --spot: 360px;          /* highlight radius */

  /* shadow */
  --shadow-rest: 0 1px 0 rgba(255,255,255,.04) inset, 0 8px 24px -12px rgba(0,0,0,.6);
  --shadow-lift: 0 1px 0 rgba(255,255,255,.06) inset, 0 30px 60px -20px rgba(0,0,0,.7), 0 12px 24px -12px rgba(0,0,0,.5);

  /* motion */
  --t-track: 90ms;        /* while pointer is over the card */
  --t-return: 650ms;      /* spring back */
  --t-micro: 160ms;       /* highlight and colour changes */
  --spring: cubic-bezier(.34, 1.56, .64, 1);
  --ease: cubic-bezier(.2, .7, .2, 1);
}
```

## Typography

| Role        | Family  | Size | Weight | Line-height | Tracking | Case      |
|-------------|---------|-----:|-------:|------------:|---------:|-----------|
| Heading     | Syne    | 34px | 700    | 1.1         | −0.02em  | sentence  |
| Subtitle    | Manrope | 15px | 400    | 1.5         | 0        | sentence  |
| Tier label  | Manrope | 12px | 600    | 1.5         | +0.10em  | UPPERCASE |
| Plan name   | Syne    | 30px | 700    | 1           | −0.02em  | sentence  |
| Price       | Syne    | 44px | 700    | 1           | −0.03em  | numerals  |
| Unit        | Manrope | 13px | 400    | 1.5         | 0        | sentence  |
| Description | Manrope | 14px | 400    | 1.5         | 0        | sentence  |
| Feature     | Manrope | 13px | 400    | 1.5         | 0        | sentence  |
| CTA         | Manrope | 14px | 600    | 44px box    | 0        | sentence  |
| Badge       | Manrope | 11px | 700    | 1           | +0.06em  | UPPERCASE |
| Caption     | Manrope | 12px | 400    | 1.5         | 0        | sentence  |

## Implementation notes

**Two transition profiles on the same element.** Swap them with a class rather than setting inline transition strings:

```css
.card { transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateZ(0);
        transition: transform var(--t-return) var(--spring), box-shadow var(--t-return) var(--spring); }
.card.track { transition: transform var(--t-track) linear, box-shadow var(--t-micro) var(--ease); }
```

**rAF-throttled tracking** — store the last event, compute once per frame, and clear it on leave so a stale frame can't re-tilt a card the pointer has left:

```js
let raf = 0, ev = null;
function apply() {
  raf = 0; if (!ev) return;
  const r = card.getBoundingClientRect();
  const x = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
  const y = Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height));
  card.style.setProperty('--ry', ((x - .5) * 16).toFixed(2) + 'deg');
  card.style.setProperty('--rx', ((.5 - y) * 16).toFixed(2) + 'deg');
  card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
  card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
}
card.addEventListener('pointermove', e => { ev = e; if (!raf) raf = requestAnimationFrame(apply); });
card.addEventListener('pointerleave', () => { ev = null; card.classList.remove('track');
  card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
```

**Highlight as a pseudo-element**, not a background on the card, so the card's own background and border stay stable and the layer can fade independently:

```css
.card::after { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  opacity: 0; transition: opacity var(--t-micro) var(--ease);
  background: radial-gradient(var(--spot) circle at var(--mx, 50%) var(--my, 50%),
              rgba(255,255,255,.14), rgba(255,255,255,.04) 40%, transparent 70%); }
.card.track::after { opacity: 1; }
```

**Skip touch and reduced motion** before attaching anything:

```js
const inert = matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(hover: none)').matches;
if (!inert) cards.forEach(attachTilt);
```

Common mistakes: putting `perspective()` inside the card's own transform (the vanishing point then moves with the card); using `getBoundingClientRect()` of a *rotated* card for the maths — it still works because the rect is the axis-aligned bounding box, but with tilts above ~15° it drifts, which is one more reason to keep 8°; applying the spring transition while tracking (feels rubbery and laggy); forgetting `will-change: transform` so the first move stutters.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
