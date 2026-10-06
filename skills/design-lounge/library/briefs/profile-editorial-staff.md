<!-- Design Lounge Nº 235 · "Editorial staff profile card" · www.designlounge.live -->

# Editorial staff profile card

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The author block a newspaper puts at the top of a journalist's staff page, laid out as a 1020px three-column card on newsprint: a stipple "hedcut" portrait with caption and facts, the name and bio with stats, and a tabbed list of the writer's articles ending in a signature. The paper is The Wexcombe Courier; the journalist is Idris Penhallow, senior climate correspondent.

It should feel like print: a 6px black top rule, column rules in warm grey, a double rule above the numbers, Old Standard TT for anything a sub-editor would set, Libre Franklin for furniture. Blue ink (`#2340A8`) is the only colour, used for the kicker, section labels, the selected tab and the fountain-pen signature. The detail worth copying is the portrait: no image file, just layered radial gradients masked by a 4px dot screen, so it reads as an engraved newspaper hedcut and tightens to a 3px screen on hover.

## Structure

```
page 1280×800, #E9E3D5, card centred, padding 32px 16px
┌━━━━━━━━━━━━━━━━━━━━━ 6px ink top rule ━━━━━━━━━━━━━━━━━━━━━━┐
│ The Wexcombe Courier     STAFF & CONTRIBUTORS    CLIMATE DESK │ 1px ink under
│                                                               │
│ ┌ 260 ───────┐│┌ 1fr ───────────────────┐│┌ 300 ───────────┐ │
│ │ stipple     │││ SENIOR CLIMATE CORR.   │││ RECENT  MOST READ│
│ │ portrait    │││ Idris                  │││ ─────────────────│
│ │ 13:16       │││ Penhallow  52px        │││ COASTS           │
│ └─────────────┘││ italic role 19px       │││ headline 17px  → │
│ caption italic ││ D bio with drop cap    │││ date · read time │
│ Based in  Plym ││ ══════════════════     │││ … ×3             │
│ On staff  2014 ││ 1,284  31  3           │││                  │
│ Languages ...  ││ (Follow Idris) ✉ email │││ ~signature~ Replay│
│                ││                        │││                  │
└───────────────────────────────────────────────────────────────┘
column gutters 26px each side of 1px #CFC6B3 rules
```

- Card: `article` labelled by the `h1`. Masthead: `header`.
- Portrait column: `figure` with a `div role="img"` (aria-label describes the portrait) and `figcaption`; facts are a `ul` of label/value rows.
- Centre column: kicker `div`, `h1`, italic `p.role`, `p.bio` with a `::first-letter` drop cap, stats block (`aria-label="Byline statistics"`), follow toggle `button aria-pressed`, email `button`.
- Right column: `div role="tablist"` with two `role="tab"` buttons; two `ol role="tabpanel"` lists of article links. Signature is an inline SVG `role="img"` with a label; Replay is a button.
- Hidden `p aria-live="polite"`.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing / delay |
| --- | --- | --- | --- | --- |
| Byline count | load | text value | 1,224 → 1,284 | 1400ms, `1-(1-p)^4`, rAF |
| Signature name | load / Replay | `stroke-dashoffset` (pathLength 1) | 1 → 0 | 2200ms `--pen`, 500ms delay |
| Signature underline | load / Replay | `stroke-dashoffset` | 1 → 0 | 600ms `--pen`, 1900ms delay |
| Portrait | hover | `mask-size` | 4px → 3px | 600ms `--expo` |
| Headline underline | hover / focus | `background-size` | 0 → 100% × 1px | 300ms `--expo` |
| Row arrow | hover / focus | opacity, translateX | 0, −4px → 1, 0 | 200ms `--ease` |
| List items | tab switch | opacity, translateY | 0, 6px → 1, 0 | 400ms `--expo`, stagger 40ms |
| Follow | toggle | background, color, inset ring | — | 160ms `--ease` |

Reduced motion: no count animation (final number from the start), signature shown complete (`stroke-dashoffset: 0`), all transitions 0.01ms, no list rise.

## States

- Follow idle: ink fill, paper text, plus icon. Hover `#34302a`. Following: `--blue-soft` fill, `--blue` text, 1px inset blue ring, check icon, `aria-pressed="true"`.
- Email button: 1px ink underline under the whole button; hover turns text and underline blue; success label "Address copied" for 1600ms.
- Tab idle: `--ink-3`, 3px transparent bottom border. Selected: `--ink`, 3px blue bottom border sitting on the 1px ink tablist rule (margin-bottom −1px).
- Article row: hover/focus underline + arrow; no background change.
- Replay: `--ink-3`, hover blue.
- Focus-visible: 2px blue outline, offset 3px.

## Accessibility

- Portrait: `role="img"` with a describing label ("Stipple portrait of Idris Penhallow, short dark hair, round glasses"); the inner dot layer is decorative.
- Signature: `role="img"` with `aria-label="Signature of Idris Penhallow"`.
- Tabs: roving tabindex, Left/Right switch, `aria-selected`, `aria-controls`; inactive panel `hidden`.
- Follow is `aria-pressed`. Email button has `aria-label="Copy Idris's email address"`. Live region reports follow and copy results.
- Contrast on `#f8f4ea`: ink ≈ 16:1, `#6b6558` ≈ 5.3:1, blue `#2340a8` ≈ 8.3:1.
- Hit targets: buttons 42px tall; tabs 40px; article rows ≥ 60px.

## Responsive rules

- ≥1280: three columns 260 / 1fr / 300 inside a 1020px card.
- 1024: card shrinks with the viewport; columns hold.
- ≤1000: two columns (220 / 1fr); the articles column drops under both as a full-width row with a 1px ink rule above it.
- ≤640 (checked at 375): single column. The portrait becomes a 120px thumbnail beside the facts list; the caption hides; the name drops to 40px; masthead shows only the paper's name; the email wraps (`overflow-wrap: anywhere`). Card padding 20px 18px.
- No horizontal overflow at 375px.

## Acceptance checklist

### Always

- [ ] Portrait is CSS only: gradient shapes masked by a radial-gradient dot screen; no image file.
- [ ] Hover on the portrait tightens the screen pitch.
- [ ] Three columns separated by 1px rules; 6px ink rule on top; double rule above the stats.
- [ ] The byline count animates once on load and respects reduced motion.
- [ ] Two tabs with keyboard switching; one list visible; the ranked list shows large numerals.
- [ ] Article headlines get a growing underline and an arrow on hover and on focus.
- [ ] The signature draws with `pathLength="1"` dash animation and can be replayed.
- [ ] Follow is a toggle with `aria-pressed`; copy has a fallback and a visible confirmation.
- [ ] One accent colour; everything else is ink on paper.
- [ ] No horizontal overflow at 375px.

### This demo

- [ ] Paper "The Wexcombe Courier"; name "Idris Penhallow"; kicker "Senior Climate Correspondent".
- [ ] Stats 1,284 bylines, 31 countries, 3 awards.
- [ ] Facts: Plymouth, 2014, EN, CY, PT.
- [ ] Recent: "The village that voted to let the sea in", "Why flood maps are always a year late", "Salt in the orchards of the Tamar valley".
- [ ] Most read leads with "Who pays when the sea wall is sold" (412k readers).

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: the masthead row reads "The Wexcombe Courier · Staff & contributors · Climate desk". Recent tab selected. The byline number counts from 1,224 to 1,284 over 1400ms (quartic ease-out). After 500ms the signature starts drawing in blue: the name stroke over 2200ms, then the underline flourish over 600ms starting at 1900ms.
2. Hovering the portrait tightens the dot screen from 4px to 3px over 600ms, so the face sharpens.
3. Hovering or focusing an article: the serif headline gets a 1px ink underline that grows from 0 to 100% width over 300ms, and a blue arrow fades in and slides 4px left-to-right at the row's right edge.
4. Clicking "Most read" swaps the list for a ranked list (large grey numerals 1–3, reader counts). List items rise 6px and fade in, staggered 40ms.
5. Left/Right on a tab moves to the other tab and selects it.
6. Clicking "Follow Idris" toggles to "Following Idris": pale blue fill, blue text, 1px blue inset ring, plus icon becomes a check. A polite live region announces it.
7. Clicking the email button copies `idris.penhallow@wexcourier.co.uk` (Clipboard API, falling back to a hidden textarea + `execCommand('copy')`). The label reads "Address copied" for 1600ms. If both fail, the address stays visible and the live region says copy is unavailable.
8. Clicking Replay restarts both signature strokes from blank.

## Tokens

```css
:root {
  /* colour */
  --bg: #e9e3d5;         /* newsprint page */
  --paper: #f8f4ea;      /* card */
  --ink: #1c1a16;        /* text, rules, primary button */
  --ink-2: #4b463d;      /* role line, facts */
  --ink-3: #6b6558;      /* captions, meta, idle tab */
  --rule: #cfc6b3;       /* column and row hairlines, rank numerals */
  --blue: #2340a8;       /* kicker, section labels, selected tab, signature, focus */
  --blue-soft: #e3e6f2;  /* following state */
  --portrait-ground: #efe9db;

  /* type */
  --serif: "Old Standard TT", Georgia, serif;
  --sans: "Libre Franklin", system-ui, sans-serif;

  /* space */
  --gutter: 26px; --pad-x: 36px; --pad-top: 28px; --s2: 8px; --s3: 12px; --s4: 18px;

  /* rules */
  --top-rule: 6px solid var(--ink);
  --double: 3px double var(--ink);
  --shadow-card: 0 30px 60px -40px rgba(28,26,22,.45);

  /* stipple */
  --dot-pitch: 4px; --dot-pitch-hover: 3px; --dot-r: 1.15px;

  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --pen: cubic-bezier(.45,.05,.35,1);
}
```

## Typography

| Role | Family | Size / lh | Weight | Tracking / case | Colour |
| --- | --- | --- | --- | --- | --- |
| Masthead title | Old Standard TT italic | 20px | 700 | 0 | `--ink` |
| Masthead labels | Libre Franklin | 11px | 600 | 0.14em upper | `--ink-2` |
| Kicker | Libre Franklin | 11px | 700 | 0.16em upper | `--blue` |
| Name | Old Standard TT | 52px / 0.98 | 400 | -0.015em | `--ink` |
| Role line | Old Standard TT italic | 19px / 1.35 | 400 | 0 | `--ink-2` |
| Bio | Libre Franklin | 15px / 1.5 | 400 | 0 | max 400px |
| Drop cap | Old Standard TT | 54px / 0.82 | 700 | 0 | floated, 8px right |
| Byline count | Old Standard TT | 40px / 1 | 700 | tabular lining nums | |
| Small stats | Old Standard TT | 28px | 700 | | |
| Stat labels | Libre Franklin | 11px | 600 | 0.12em upper | `--ink-3` |
| Tab | Libre Franklin | 12px | 600 | 0.12em upper | `--ink-3` / `--ink` |
| Section label | Libre Franklin | 10.5px | 700 | 0.14em upper | `--blue` |
| Headline | Old Standard TT | 17px / 1.22 | 700 | 0 | |
| Meta | Libre Franklin | 12px | 400 | 0 | `--ink-3` |
| Rank numeral | Old Standard TT | 26px | 700 | | `--rule` |
| Caption | Old Standard TT italic | 13px / 1.4 | 400 | | `--ink-3` |

## Implementation notes

**Stipple hedcut.** Paint the bust with stacked gradients (hair, glasses rings, ears, face with darker edge, neck, collar notch, shoulders, a faint left-to-right ground), then mask the whole layer with a repeating dot. Alpha in the paint becomes lighter dots, so shading still reads.

```css
.portrait .ink { position: absolute; inset: 0;
  background:
    radial-gradient(circle at 41% 41%, transparent 0 5.2%, var(--ink) 5.3% 6.4%, transparent 6.5%),
    radial-gradient(circle at 59% 41%, transparent 0 5.2%, var(--ink) 5.3% 6.4%, transparent 6.5%),
    radial-gradient(ellipse 25% 15% at 49% 27%, var(--ink) 0 72%, transparent 74%),
    radial-gradient(ellipse 22% 27% at 44% 40%, rgba(28,26,22,.14) 0 35%, rgba(28,26,22,.46) 85%, transparent 87%),
    radial-gradient(ellipse 54% 28% at 50% 100%, var(--ink) 0 84%, transparent 86%);
  mask: radial-gradient(circle, #000 1.15px, transparent 1.45px) 0 0 / 4px 4px;
  transition: mask-size .6s var(--expo); }
.portrait:hover .ink { mask-size: 3px 3px; }
```

Add `-webkit-mask` alongside `mask` for Safari.

**Self-drawing signature.** Give each path `pathLength="1"` so the dash maths is the same for any shape.

```css
.sig path { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round;
  stroke-dasharray: 1; stroke-dashoffset: 1;
  animation: draw 2.2s .5s cubic-bezier(.45,.05,.35,1) forwards; }
.sig path + path { animation-duration: .6s; animation-delay: 1.9s; }
@keyframes draw { to { stroke-dashoffset: 0; } }
```

```js
replay.onclick = () => document.querySelectorAll('.sig path').forEach(p => {
  p.style.animation = 'none'; p.getBoundingClientRect(); p.style.animation = '';
});
```

**Underline that grows.** Use a background on the headline span, not `text-decoration`, so it can animate and wrap across lines.

```css
.hd { background: linear-gradient(var(--ink), var(--ink)) 0 100% / 0 1px no-repeat;
  transition: background-size .3s var(--expo); }
a:hover .hd, a:focus-visible .hd { background-size: 100% 1px; }
```

Common mistakes:

- A photo or a grey placeholder circle instead of the stipple.
- Colouring the name or the stats blue. Blue is ink for labels and the pen, not for display type.
- A rounded card with a soft shadow and no rules. The rules are the layout.
- Forgetting `minmax(0, 1fr)` on the single-column grid; the long email then pushes the page sideways on phones.
- Leaving the signature blank under reduced motion.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
