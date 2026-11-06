<!-- Design Lounge Nº 654 · "Y2K friend profile with stickers" · www.designlounge.live -->

# Y2K friend profile with stickers

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The own-profile screen of "Glowpage", an invented social app with a 2003 personal-page soul. Mira Okafor's page sits on a pearly iridescent ground: a chrome wordmark, glossy bubble buttons, a scrolling mood status, a "TOP 8" friends grid and a sticker tray at the bottom from which you drag a star, heart, butterfly, CD or "2COOL" tag onto your profile card, where it slaps down with an overshoot. Every tap anywhere throws a small burst of glitter sparkles. The style is loud, but every word of text sits on a solid white or tinted plate with a 2px ink outline, so it reads at 4.5:1 or better. Worth copying: Y2K done as a real, usable screen. The chrome, iridescence and gloss live only in decoration (wordmark, avatar ring, stickers, button highlights); type and ground stay solid.

The language is neither iOS nor Material: it is its own Y2K component set (2px ink outlines, 4px hard offset shadows, pill bubbles with an inner bottom shade and a top gloss stripe). Native behaviour is kept where it matters: 44px+ targets, controls in the lower third, no custom scroll physics.

## Structure

```
390 × 844
┌──────────────────────────────────────┐
│ 54 status (Lounge)                   │
│ GLOWPAGE✦                 (✉3) (✎)   │ 54–106 header, bubbles 44
│ ┌──────────────────────────────────┐ │ profile plate, r22, shadow 4/4
│ │ (MO)★  MIRA OKAFOR               │ │ avatar 88
│ │        @mirabelle.exe            │ │
│ │        [online now][Leeds][pisces]│ │ chips 24
│ │ ┌ 1,204 ─── 38 ──── 9,481 ─────┐ │ │ stats strip
│ │ [   + Add friend   ] [ ➤ Wink ] │ │ bubbles 48
│ └───────────────────────────[2COOL]┘ │
│ ( MOOD ) burning a mixtape for sat…  │ mood pill 48, marquee
│ ┌ TOP 8 ─────────── edited 2 days ┐ │
│ │ (PD) (TW) (JA) (KM)             │ │ 4 × 2 tiles, disc 48
│ │ (RV) (EB) (NH) (LV)             │ │
│ └──────────────────────────────────┘ │
│ ┌ Drag a sticker onto…   2 placed ┐ │ tray, bottom 34, r26
│ │  ★    ♥    ✿    ◎    [2COOL]    │ │ 58px stickers
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘ 34 home indicator
```

- `<main class="app">` with `overflow: hidden` (ghosts and glitter must never widen the page).
- `<header>`: wordmark as `<svg role="img" aria-label="Glowpage">` with SVG `<text>` filled by a chrome gradient; `<nav>` with two `<button>`s.
- `<section class="card" aria-labelledby>`: `<h1>`, chips as `<span>`, stats `<div>`s, two `<button>`s, then placed stickers as absolutely positioned `<button>`s.
- `<div role="group" aria-label="Mood status">` with the marquee `<p>` (second copy `aria-hidden`).
- `<section>` TOP 8 with `<h2>` and eight `<button>` tiles.
- `<section class="tray">` with five sticker `<button>`s; `<p aria-live="polite">` for announcements.

## Motion

| Thing | Trigger | Property | From → to | Timing | Reduced motion |
|---|---|---|---|---|---|
| Online dot | load, loop | background | `#13A05A` ↔ `#3ED98A` | 2.4s `--ease`, infinite | static |
| Marquee | load, loop | translateX | 0 → −50% (two copies) | 16s linear, infinite | stopped, text wraps at 13px |
| Bubble press | :active | scale | 1 → 0.95 | 160ms `--pop` | instant |
| Tile press | :active | scale | 1 → 0.94 | 160ms `--pop` | instant |
| Tray hover | hover | rotate, scale | 0 → −6°, 1.06 | 180ms `--pop` | none |
| Ghost | drag | left/top | follows pointer | none | same |
| Plate hot | ghost over plate | box-shadow | ink → pink + halo | instant | same |
| Slap | drop on plate | scale | 1.35 → 0.9 → 1 | 420ms `--pop` | none |
| Return | drop off plate | left/top, opacity | release → tray slot, 1 → 0 | 260ms `--out` | removed at once |
| Glitter | any pointerdown | translate, scale, rotate, opacity | 0, .2, 0°, 1 → 34–64px out, 1, 120°, 0 | 640ms `--out` | one sparkle, opacity only, 400ms |

## States

- **Bubble buttons:** rest has the inner bottom shade and a white gloss stripe across the top 7px (stops at 60% width so text never sits on it); hover keeps shape; active scales 0.95; focus-visible 3px `#A3105B` outline, 3px offset.
- **Add friend pressed:** fill `#0F7A45`, label "Friends", check icon, `aria-pressed="true"`.
- **Friend tile:** hover adds a 1.5px ink border; active scales 0.94.
- **Tray sticker:** hover tints `#F3F6FF` and tilts −6°.
- **Dragging:** ghost at scale 1.18 with `drop-shadow(3px 8px 4px rgba(31,26,61,.28))`; a dragged placed sticker hides its original until dropped.
- **Plate hot:** pink offset shadow plus a 4px `rgba(216,27,122,.18)` halo.
- **Empty:** with zero stickers placed the count reads "0 placed"; the plate is unchanged.

## Accessibility

- Every sticker is a `<button>`: tray buttons say "Pink heart sticker. Drag onto your page, or press Enter to stick it."; placed ones say "Pink heart on your page. Press Delete to peel it off."
- Enter or Space on a tray sticker places it on one of five spots kept clear of text; Delete or Backspace removes a focused placed sticker. Drag is never the only way.
- A polite live region announces each stick, peel and friend toggle.
- The wordmark SVG is `role="img"` with a label; the avatar initials are `aria-hidden` because the name is the heading; the online dot is `role="img"` "Online now".
- The marquee's second copy is `aria-hidden`; screen readers hear the mood once.
- Contrast: ink on white 16:1, `#544D72` on white 7.6:1, white on pink 4.8:1, white on green 5.6:1, ink on every pastel disc at least 11:1. No text touches the gradient ground.
- Targets: header bubbles 44px, buttons 48px, stickers 58px, tiles about 82 × 80px.

## Responsive rules

- At 360 wide the plate keeps 16px padding; chips wrap to two lines; "Wink" shrinks to 112px; tiles stay four across (about 74px each).
- Under 780px tall, the TOP 8 plate drops the "edited" line and tiles lose 2px of padding each; the tray stays pinned 34px above the bottom.
- Above 430px wide the app column centres at 430px; at tablet width put the tray beside the TOP 8 plate instead of below it.
- Placed sticker positions are stored relative to the plate, so they stay put when the plate resizes.

## Acceptance checklist

**Always**
- [ ] No text sits directly on the iridescent ground: every label, number and line has a solid plate behind it and passes 4.5:1.
- [ ] Chrome and iridescence appear only on the wordmark, avatar ring, CD sticker and gloss stripes.
- [ ] Drag from tray to plate places a sticker at the release point with a random −12°…12° tilt and an overshoot slap.
- [ ] Dropping outside the plate returns the ghost to its slot; dragging a placed sticker off the plate removes it.
- [ ] Keyboard Enter places a sticker on a free spot that does not cover text; Delete peels a focused one.
- [ ] Every pointerdown throws glitter that removes itself after its animation.
- [ ] The sticker tray sits 34px above the bottom; all controls are 44px or more.
- [ ] Reduced motion stops the marquee and wraps the mood, keeps drag and placement working.
- [ ] `document.documentElement.scrollWidth` is 390 during and after drags.

**This demo**
- [ ] Wordmark "glowpage"; profile "Mira Okafor", "@mirabelle.exe", chips "online now", "Leeds", "pisces".
- [ ] Stats 1,204 friends (1,205 after Add friend), 38 stickers, 9,481 page views.
- [ ] TOP 8: Priya, Theo, Juno, Kai, Rosa, Ezra, Noor, Lev, ranked 1–8.
- [ ] Five stickers: gold star, pink heart, butterfly, shiny CD, "2COOL" tag; two placed on load.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame at 390 × 844 (the Lounge draws the status bar; content starts at 54px). Header row 52px tall: the chrome SVG wordmark "glowpage" (196 × 44) with a 4-point sparkle after it on the left; two 44px round bubble buttons on the right (messages with a pink "3" badge, edit page).
2. Profile plate 8px below: white, 2px `#1F1A3D` outline, radius 22, hard shadow `4px 4px 0 #1F1A3D`, 16px padding. Inside:
   - an 88px avatar: 5px iridescent conic ring around a pink `#D81B7A` disc with "MO" in Rubik Mono One 26px white, and a green online dot (18px, white 3px ring) that breathes between `#13A05A` and `#3ED98A` every 2.4s;
   - "MIRA OKAFOR" (Rubik Mono One 19px), "@mirabelle.exe" (14/600, `#544D72`), three 24px chips: "online now" (mint fill), "Leeds", "pisces";
   - a stats strip `#F3F6FF` with three cells: 1,204 friends, 38 stickers, 9,481 page views (numbers in Rubik Mono One 15px, labels 12/600);
   - two 48px bubbles: "Add friend" (primary, pink `#D81B7A`, white text, plus icon, flex 1) and "Wink" (butter `#FFE27A`, 132px).
   - two stickers already placed: a gold star on the avatar's top-right edge (rotated 14°) and the "2COOL" tag hanging off the plate's bottom-right corner (−10°).
3. Mood bar 12px below: a 48px white pill with a 34px ink "MOOD" label (star icon in butter) and a marquee reading "burning a mixtape for saturday · new film camera, ask me · rain on repeat", looping every 16s, edges faded with a 12px / 16px mask.
4. TOP 8 plate: "TOP 8" (Rubik Mono One 14px) and "edited 2 days ago"; a 4 × 2 grid of friend tiles (`#FFF4FA`, radius 14). Each tile: 48px initials disc on its own pastel (yellow, aqua, lime, pink, lilac, peach, mint, butter) with a 2px ink outline, a 20px ink rank badge at the top-left, and the first name (13/700) under it.
5. Sticker tray pinned 34px above the bottom, 12px from both sides: white plate, radius 26, "Drag a sticker onto your page" and a live count "2 placed" on the right, then five 58px sticker buttons.
6. Press a tray sticker and drag: a ghost copy (scale 1.18, deeper drop shadow) follows the finger. While over the profile plate the plate's offset shadow turns pink and a 4px pink halo appears.
7. Release over the plate: the sticker lands at the release point with a random rotation between −12° and 12° and slaps down (scale 1.35 → 0.9 → 1 over 420ms, overshoot curve). The count updates; a polite live region says "Pink heart stuck on your page."
8. Release anywhere else: the ghost glides back to its tray slot over 260ms expo-out while fading, then is removed.
9. Placed stickers can be dragged again. Drop on the plate to move; drop outside to peel it off (count drops, "Pink heart peeled off.").
10. Tap anywhere: eight 16px 4-point sparkles (gold, pink, aqua, white, each with a 0.8px ink stroke) burst from the pointer 34–64px outwards, rotating 120°, fading over 640ms.
11. "Add friend" toggles to "Friends" with a check icon on green `#0F7A45`; the friend count goes 1,204 → 1,205; aria-pressed flips. Tap again to undo.
12. Keyboard: Enter or Space on a tray sticker sticks it onto the next of five free spots on the plate (corners and edges, never over text). Delete or Backspace on a focused placed sticker peels it off.
13. Reduced motion: the marquee stops and the mood wraps to two lines at 13px; glitter is one sparkle that fades in place; no slap, no glide, no breathing dot.

## Tokens

```css
:root {
  /* ground: pearl iridescent, static */
  --ground: linear-gradient(165deg, #ffd6ee 0%, #d4f2ff 30%, #efe2ff 55%, #dcffe0 78%, #ffe7cc 100%);
  --ground-fallback: #efe2ff;
  --glints: radial-gradient(circle, rgba(255,255,255,.9) 0 2px, transparent 3px) 0 0/46px 46px;
  /* plates and ink */
  --plate: #ffffff;
  --plate-2: #fff4fa;          /* friend tiles, chips */
  --strip: #f3f6ff;            /* stats strip */
  --ink: #1f1a3d;              /* 16:1 on white */
  --ink-2: #544d72;            /* 7.6:1 on white */
  /* candy accents */
  --pink: #d81b7a;             /* primary bubble, avatar; white on it 4.8:1 */
  --pink-deep: #a3105b;        /* focus ring */
  --friends: #0f7a45;          /* pressed Add friend; white on it 5.6:1 */
  --butter: #ffe27a; --lime: #c6f75a; --aqua: #9ff0ff; --lilac: #dcc8ff; --bubblegum: #ff8fc8;
  --online: #13a05a; --online-hi: #3ed98a;
  /* chrome (SVG gradient stops, top to bottom) */
  --chrome: #ffffff 0, #c7d3e3 42%, #5d6c86 50%, #e8f0fa 62%, #8b9ab2 100%;
  /* type */
  --display: "Rubik Mono One", system-ui, sans-serif;
  --sans: "Familjen Grotesk", system-ui, sans-serif;
  --fs-wordmark: 26px; --fs-initials: 26px; --fs-name: 19px; --fs-stat: 15px; --fs-h2: 14px;
  --fs-button: 16px; --fs-body: 15px; --fs-handle: 14px; --fs-small: 13px; --fs-chip: 12px; --fs-label: 11px;
  /* shape */
  --edge: 2px solid var(--ink);
  --drop: 4px 4px 0 var(--ink);
  --drop-hot: 4px 4px 0 var(--pink), 0 0 0 4px rgba(216,27,122,.18);
  --bubble-shade: inset 0 -5px 0 rgba(31,26,61,.18);
  --r-plate: 22px; --r-tray: 26px; --r-tile: 14px; --r-strip: 14px; --r-bubble: 999px;
  --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px;
  --tap: 44px; --button-h: 48px; --sticker-slot: 58px; --sticker: 50px;
  /* motion */
  --pop: cubic-bezier(.34,1.56,.64,1);
  --out: cubic-bezier(.16,1,.3,1);
  --ease: cubic-bezier(.2,.7,.2,1);
  --d-press: 160ms; --d-slap: 420ms; --d-return: 260ms; --d-glitter: 640ms; --d-marquee: 16s; --d-breathe: 2.4s;
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|
| Wordmark (SVG) | Rubik Mono One | 26px | 400 | — | −1 unit | lower (font draws caps) |
| Name | Rubik Mono One | 19px | 400 | 1.1 | −0.01em | as typed |
| Initials | Rubik Mono One | 26px avatar, 15px tiles | 400 | 1 | 0 | upper |
| Stat numbers | Rubik Mono One | 15px | 400 | 1.1 | 0 | — |
| Section title "TOP 8" | Rubik Mono One | 14px | 400 | 1 | 0 | upper |
| MOOD label | Rubik Mono One | 11px | 400 | 1 | 0.04em | upper |
| Buttons | Familjen Grotesk | 16px | 700 | 1 | 0 | sentence |
| Marquee | Familjen Grotesk | 15px | 600 | 1.4 | 0 | lower |
| Handle | Familjen Grotesk | 14px | 600 | 1.4 | 0 | as typed |
| Friend names, tray copy | Familjen Grotesk | 13px | 700 | 1.4 | 0 | sentence |
| Chips, stat labels | Familjen Grotesk | 12px | 600–700 | 1 | 0 | lower |

## Implementation notes

**1. Chrome that never touches readable text.** Draw the wordmark as SVG text with a hard-banded vertical gradient (the dark band at 50% is what sells "chrome") and an ink stroke painted under the fill. Layout checks skip SVG, and the name below stays solid ink.

```html
<linearGradient id="chr" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#fff"/><stop offset=".42" stop-color="#c7d3e3"/>
  <stop offset=".5" stop-color="#5d6c86"/><stop offset=".62" stop-color="#e8f0fa"/>
  <stop offset="1" stop-color="#8b9ab2"/>
</linearGradient>
<text x="4" y="33" font-family="Rubik Mono One" font-size="26" fill="url(#chr)"
      stroke="#1f1a3d" stroke-width="1.6" paint-order="stroke">glowpage</text>
```

**2. A marquee that does not fail an off-screen check.** Text translated past the edge counts as off-screen unless its container scrolls. Make the track `overflow-x: auto` with the scrollbar hidden, duplicate the text, and translate by −50%.

```css
.tick { overflow-x: auto; scrollbar-width: none; white-space: nowrap;
  mask: linear-gradient(90deg, transparent, #000 12px, #000 calc(100% - 16px), transparent); }
.tick p { display: inline-block; animation: mq 16s linear infinite; }
.tick p span { padding-right: 28px; }          /* gap between copies */
@keyframes mq { to { transform: translateX(-50%); } }
```

**3. Drag with a ghost, place relative to the plate.** Keep the ghost in the app container (not the plate) so it can travel anywhere; convert to plate coordinates only on drop. Separate keyboard activation from pointer clicks with `event.detail === 0`.

```js
const end = (e) => {
  const c = card.getBoundingClientRect();
  if (inCard(e.clientX, e.clientY)) {
    ghost.remove();
    place(kind, e.clientX - c.left, e.clientY - c.top, Math.random() * 24 - 12, true);
  } else {                                   // glide home, then drop the ghost
    ghost.style.opacity = 0; ghost.style.left = slotX + 'px'; ghost.style.top = slotY + 'px';
    setTimeout(() => ghost.remove(), 280);
  }
};
tray.addEventListener('click', (e) => { if (e.detail === 0) placeAtNextSpot(e.target.closest('.stk')); });
```

Common mistakes: putting the gloss highlight across the middle of a button (it lowers the contrast under the label; keep it to the top 7px and the left 60%), using `opacity` to make chips look "softer" (it fails contrast), and letting glitter SVGs pile up (remove each on `animationend`).

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
