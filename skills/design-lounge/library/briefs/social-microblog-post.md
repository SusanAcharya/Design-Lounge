<!-- Design Lounge Nº 311 · "Microblog post card" · www.designlounge.live -->

# Microblog post card

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

One post from a short-form feed, for an invented network called Chirrup. It reads instantly as the familiar format: round avatar, display name with a scalloped verified mark, @handle and age, a few lines of text with a mention, a link and two hashtags picked out in the brand teal, a 16:9 image, a mono timestamp line with a view count, and a four-button action row. The image is an inline SVG transit map, not a photo, so the piece has zero assets. The detail worth copying is the counters: every digit is its own vertical strip of 0–9, so 8,402 becomes 8,403 by rolling only the last digit, and the like fires a ring plus seven particles behind the heart.

## Structure

```
stage 1280×800, card centred
┌──────────────── card 598px, radius 18, pad 18/20/8 ────────────────┐
│ (44 av)  Mira Okafor [✓18]                                 [ ⋯ 36 ]│
│          @miraokafor · 2h                                          │
│                                                                    │
│ text 17/1.48, mention + link + #tags in teal                       │
│                                                                    │
│ ┌──────────── media 16:9, radius 14, 1px line ─────────────┐       │
│ │  SVG transit map, four lines, ten stops, five labels     │       │
│ │ [28 · 14 stops · 9 chimes]  mono caption, bottom-left    │       │
│ └──────────────────────────────────────────────────────────┘       │
│ 9:41 AM · Oct 3, 2026 · 48.2K views        mono 12.5             │
│ ───────────────────────────── 1px ──────────────────────────────── │
│ [◯ 214]       [⟲ 1,186]        [♡ 8,402]                  [⇪]      │
└────────────────────────────────────────────────────────────────────┘
toast: fixed, centred, 28px from bottom
```

- Card: `article` labelled by the author name.
- Header: `header` with a decorative avatar (`aria-hidden`), the name in a div with an `svg role="img" aria-label="Verified account"`, and a "More options" icon button.
- Text: one `p`. Mentions, links and hashtags are `a` elements.
- Media: `figure` holding the `svg role="img"` with a descriptive label, and a `figcaption`.
- Meta: `p` with a `time datetime`.
- Actions: `div role="group" aria-label="Post actions"` of four buttons; Share is in a wrapper with its `role="menu"` popover.
- Toast: `div role="status" aria-live="polite"`.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Action tint | hover | background, colour | transparent → soft tint | 160ms `--ease` | instant |
| Icon press | :active | transform | 1 → 0.88 | 160ms | instant |
| Heart fill | like on | transform | 0.4 → 1.2 → 1 | 420ms `--ease-pop` | none |
| Like ring | like on | scale, opacity, border | 0.2/0.9/2px → 1.5/0/0 | 600ms `--ease-out` | hidden |
| Like particles ×7 | like on | rotate(a) translateY | 0 → −26px, scale 1 → 0.3, fade | 600ms `--ease-out` | hidden |
| Repost icon | repost on | rotate, scale | −180°/0.7 → 0/1 | 480ms `--ease-out` | none |
| Digit strip | count change | translateY | −20px × old → −20px × new | 420ms `--ease-out` | instant |
| Share menu | open | opacity, translateY, scale | 0/6px/0.98 → 1/0/1 | 220ms `--ease-out` | instant |
| Toast | message | opacity, translateY | 0/16px → 1/0 | 280ms, hides after 1.8s | instant |
| Interchange stop | always | scale | 1 → 1.35 → 1 | 2.4s loop | none |

Particle angles: 0°, 51°, 103°, 154°, 206°, 257°, 309°. Odd particles are amber `#f2a33a`, even are `--like`.

## States

- Action idle: `--ink-3`, no background.
- Action hover: action colour, 34px circle tint behind the icon.
- Like pressed: pink-red text and heart fill, `aria-pressed="true"`.
- Repost pressed: green text and icon, `aria-pressed="true"`.
- Share expanded: `aria-expanded="true"`, menu visible.
- Menu item hover/focus: teal soft background and teal text.
- Focus-visible: 2px teal outline, 2px offset, 8px radius, on every button and link.
- Disabled, loading, empty: not used on a single post.

## Accessibility

- Each action button carries the full sentence in `aria-label`: "Like, 8,402 likes". Update it whenever the count changes. The rolling digits are `aria-hidden`, because the strips read as "0123456789" to a screen reader.
- Like and Repost are toggles with `aria-pressed`. Reply and Share are plain buttons.
- Share: `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`. Items are `role="menuitem"`. Arrow keys cycle, Escape closes and refocuses the trigger.
- The verified mark is an `svg role="img"` with "Verified account". The avatar is decorative because the name is right beside it.
- The map has a text alternative describing what it shows.
- Toasts go to a polite live region.
- Contrast: `#6b746e` on `#fcfdfb` is 4.7:1. Teal `#0b6f6a` on the card is 5.9:1.
- Hit targets: actions are 40px tall, the more button is 36px; raise it to 40px on touch layouts.

## Responsive rules

- ≥1280: card 598px wide, centred.
- 1024 and 768: unchanged; the card is narrower than the viewport.
- <640: the card is `min(598px, 100%)` with 16px page padding. At ≤480 the card padding drops to 14/14/6, text to 16px, action padding to 6px, and the meta line to 11.5px. The image stays 16:9.
- At 375 nothing overflows horizontally; long links break with `overflow-wrap: anywhere`.

## Acceptance checklist

### Always

- [ ] Card shows avatar, name, verified mark, handle and age, text, media, timestamp line, and four actions in that order.
- [ ] Links, mentions and hashtags are real anchors coloured with the brand token.
- [ ] Each digit of each count rolls independently; separators do not move.
- [ ] Like and Repost are `aria-pressed` toggles; their `aria-label` includes the current count.
- [ ] Liking fires the ring and seven particles once; unliking fires nothing.
- [ ] Share menu opens with focus on the first item, closes on Escape and outside click.
- [ ] All actions are at least 40px tall and show a visible focus ring.
- [ ] Reduced motion removes the burst, pop, spin and stop pulse; counts change instantly.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Author is Mira Okafor, @miraokafor, 2h.
- [ ] Starting counts: 214 replies, 1,186 reposts, 8,402 likes, 48.2K views.
- [ ] Liking shows 8,403 and the label "Like, 8,403 likes".
- [ ] The map caption reads "28 · 14 stops · 9 chimes".
- [ ] Repost toast reads "Reposted to your followers".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: the card sits centred on a pale sage stage. Likes 8,402, reposts 1,186, replies 214, nothing pressed. The Baixa interchange stop on the map pulses slowly (scale 1 → 1.35 → 1 over 2.4s).
2. Hover any action: icon and count turn the action's colour, and a 34px circular tint appears behind the icon. Reply and share use teal, repost green, like pink-red.
3. Click Like: `aria-pressed` becomes true, the heart fills, pops from scale 0.4 to 1.2 to 1 in 420ms, a ring expands from the heart and fades, seven dots fly outward 26px. The count rolls 8,402 → 8,403. The button label updates to "Like, 8,403 likes".
4. Click Like again: unfills, count rolls back. No burst on unlike.
5. Click Repost: icon turns green and spins in from −180°, count rolls up by one, and a dark pill toast says "Reposted to your followers" for 1.8s. Clicking again says "Repost removed".
6. Click Reply: toast "Replying to @miraokafor". (In a product this opens the composer.)
7. Click Share: a menu rises from the button (fade + 6px lift, 220ms) with Copy link, Bookmark, Send via message. Focus moves to the first item. Arrow Up/Down move, Escape closes and returns focus to Share, click outside closes. Choosing an item closes the menu and shows a matching toast.
8. When the digit count of a number changes (999 → 1,000), the counter rebuilds its strips and then rolls.

## Tokens

```css
:root {
  /* surfaces */
  --stage: #eef0ec;        /* page behind the card */
  --card: #fcfdfb;         /* card */
  --line: #dfe3dc;         /* card border, media border, meta rule */
  --line-2: #cfd5cc;       /* menu border */
  /* ink */
  --ink: #121614;
  --ink-2: #4a524d;
  --ink-3: #6b746e;        /* handle, idle actions, meta */
  /* roles */
  --brand: #0b6f6a;        /* links, hashtags, verified, reply/share hover, focus */
  --brand-soft: rgba(11,111,106,.1);
  --like: #d92a5b;
  --like-soft: rgba(217,42,91,.1);
  --repost: #16834f;
  --repost-soft: rgba(22,131,79,.1);
  /* type */
  --sans: "Hanken Grotesk", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  /* shape */
  --r: 18px;               /* card */
  --r-media: 14px;
  /* motion */
  --t-micro: 160ms;
  --t-roll: 420ms;
  --t-burst: 600ms;
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
  --ease-pop: cubic-bezier(.34,1.56,.64,1);
}
```

Card shadow: `0 1px 0 rgba(18,22,20,.04), 0 18px 40px -28px rgba(18,22,20,.35)`. Spacing runs on 4: 4, 8, 12, 14, 18, 20.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display name | Hanken Grotesk | 15.5px | 700 | 1.2 | 0 |
| Handle · age | Hanken Grotesk | 14px | 400 | 1.5 | 0, `--ink-3` |
| Post text | Hanken Grotesk | 17px | 400 | 1.48 | -0.006em |
| Hashtag | Hanken Grotesk | 17px | 600 | 1.48 | teal |
| Action count | Hanken Grotesk | 13px | 500 | 20px | tabular-nums |
| Timestamp line | IBM Plex Mono | 12.5px | 400 | 1.5 | 0.01em, view count 500 `--ink` |
| Media caption | IBM Plex Mono | 11px | 500 | 1 | 0.04em, light on 72% ink |
| Menu item | Hanken Grotesk | 14px | 500 | 40px row | 0 |

Mono is only for machine facts (time, views, map caption). Do not set the post text in mono.

## Implementation notes

**Digit strips.** Build each digit as a 20px-tall window over a column of ten 20px spans. Only rebuild when the string length changes; otherwise just move the columns, so the transition runs.

```js
function render(el, n) {
  const s = n.toLocaleString('en-US');
  if (el.dataset.len != s.length) {
    el.innerHTML = [...s].map(c => /\d/.test(c)
      ? '<span class="d"><span class="col">' +
        [...'0123456789'].map(x => `<span>${x}</span>`).join('') + '</span></span>'
      : `<span>${c}</span>`).join('');
    el.dataset.len = s.length;
    el.offsetHeight; // commit layout so the first move animates
  }
  [...s].forEach((c, i) => {
    const col = el.children[i].querySelector('.col');
    if (col) col.style.transform = `translateY(${-20 * c}px)`;
  });
}
```

```css
.num, .num .d, .num .col span { height: 20px; line-height: 20px; }
.num .d { overflow: hidden; display: inline-block; }
.num .col { display: flex; flex-direction: column; transition: transform 420ms var(--ease-out); }
```

**Burst restart.** The burst is a class toggle. Remove the class, force a reflow, add it back, so rapid likes replay it.

```js
burst.classList.remove('go'); burst.offsetWidth; burst.classList.add('go');
```

```css
.burst b { position:absolute; left:50%; top:50%; width:5px; height:5px; margin:-2.5px; border-radius:50%; opacity:0; }
.burst.go b { animation: fly 600ms var(--ease-out); }
@keyframes fly {
  0%   { opacity:1; transform: rotate(var(--a)) translateY(0) scale(1); }
  100% { opacity:0; transform: rotate(var(--a)) translateY(-26px) scale(.3); }
}
```

**Common mistakes.**

- Animating the whole number with a crossfade. The point is that only changed digits move.
- Leaving the digit strips readable by screen readers.
- Using the real network's blue and bird. Chirrup is teal with a scalloped badge; invent your own.
- Firing the burst on unlike, or on page load.
- Putting the burst inside the icon's circle with `overflow: hidden`; the particles get clipped.
- Map labels sitting on top of route lines. Place labels in empty quadrants.
- Using `ease` or `linear` for the roll; it needs the expo-out curve to settle.

**Rebuild order.**

1. Stage, card, header with avatar, name, badge, handle.
2. Text with anchors.
3. Media figure with the SVG map and caption.
4. Meta line and rule.
5. Action row with counters wired to `render`.
6. Like and repost toggles, burst, toast.
7. Share menu with keyboard handling.
8. Reduced-motion block and 375px check.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
