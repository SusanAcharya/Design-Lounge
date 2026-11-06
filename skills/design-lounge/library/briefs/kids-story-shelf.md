<!-- Design Lounge Nº 668 · "Kids bedtime story shelf" · www.designlounge.live -->

# Kids bedtime story shelf

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The bedtime corner of a fictional kids reading app, "Lanternlight", for ages 4 to 8. Three screens: a shelf of four big covers drawn in flat SVG (a lighthouse at night, an owl on a branch, a hedgehog in a red hat, the moon and a pink sock), a story page with one picture and two or three short sentences in 30px Lora, and a quiet "The end". A grown-up or child picks "Read to me" (the device reads aloud and each word lights up on a soft yellow plate as it is spoken) or "I'll read" (silent, and tapping any word says just that word). Night mode is the default: deep ink-navy with cream text, so the screen is not a lamp in a dark room. The detail worth copying: the highlight follows the real voice using `speechSynthesis` boundary events, and falls back to a per-word timer when the browser gives none, so the karaoke never stalls.

Language: iOS 26-ish (64–88px round controls, 24–28px radii, soft lift shadows, crossfade and short slide page turns).

## Structure

```
390 × 844, night #141C33, column padding 54 / 16 / 34
SHELF                                   STORY
┌──────────────────────────────────┐    ┌──────────────────────────────────┐
│ 54px clear                       │    │ 54px clear                       │
│ Story shelf               ( ☾ )  │    │ ( ‹ )  The Sleepy Lighthouse (☾) │ 64h
│ ┌────────────┐ ┌────────────┐    │    │ ┌──────────────────────────────┐ │
│ │ lighthouse ▮│ │   owl      │   │    │ │  scene 358 × 262, r 28       │ │
│ │            │ │            │    │    │ └──────────────────────────────┘ │
│ │ The Sleepy │ │ Otto Counts│    │    │ One foggy night, a [little]      │ Lora 30/1.45
│ └────────────┘ └────────────┘    │    │ boat was lost. "Over here!"      │ min 220h
│ ┌────────────┐ ┌────────────┐    │    │ called Lumo, and he shone…       │
│ │ hedgehog   │ │ moon, sock │    │    │            ○ ━ ○ ○               │ dots 20h
│ └────────────┘ └────────────┘    │    │  ( ‹ )      ( ❚❚ )      ( › )    │ 96h: 76 / 88 / 76
│ [ 🔈 Read to me ] [ 📖 I'll read ]│    │ 34px clear                       │
└──────────────────────────────────┘    └──────────────────────────────────┘
covers 173 × 284, gap 12, picture 212, title plate 72
```

- Three `section.view` layers, fixed and stacked; the hidden ones get `.off` (opacity 0, `visibility:hidden`) and `inert`.
- Shelf: `h1`, `button.nightBtn[aria-pressed]`, `div.grid` of `button.cover` (each with an `svg` using a shared `<symbol>` and a `span.t`), `div.mode[role=radiogroup]` with two `role=radio` buttons.
- Story: back button, `div.mini` title, night button, `div.scene` (same symbol, larger), `p.words` with one `span` per word, `div.dots`, `div.ctrl` with prev, play, next.
- End: moon `svg`, `h2`, `p`, two buttons.
- One `div[aria-live=polite]` announces each page's text, "The end." and night mode changes.

## Motion

| What | Trigger | Property | From → to | Duration / easing | Reduced motion |
|---|---|---|---|---|---|
| Screen swap | cover, back, end | opacity, scale | 0 / .97 → 1 / 1 | 320ms `--ease`, 480ms `--sheet` | opacity only |
| Page text | turn | translateX, opacity | ±36px / 0 → 0 / 1 | 480ms `--expo` | 200ms fade |
| Word plate | each word | background, colour | none → `--hl` | 160ms `--ease` | same |
| Next nudge | page done | translateX | 0 → 6px → 0 | 1.4s loop | none |
| Current dot | turn | width | 10 → 28px | 320ms `--ease` | same |
| Beam | always | rotate | −14° → 10° | 6s alternate | still |
| Waves | always | translateY | 0 → 4px | 4s alternate | still |
| Stars | always | opacity | .45 → 1 | 3s alternate | still |
| Night mode | toggle | colours | day ↔ night | 600ms `--ease` | same |

## States

- **Cover pressed:** scale 0.97.
- **Choice selected:** accent fill and text in `--accent-text`; unselected has a 2px `--text-2` outline (both above 3:1 on the page).
- **Reading:** play shows Pause bars, label "Pause reading"; one word has the plate.
- **Page done:** next arrow nudges; on the last page its label is "Finish story".
- **Prev disabled:** on page 1, icon in `--text-2`.
- **Night on:** moon icon filled; off: outline only.
- **Focus-visible:** 4px `--accent` outline, 4px offset.

## Accessibility

- Covers are buttons named by the title ("The Sleepy Lighthouse, page 2 of 4").
- Read mode is a `radiogroup`; ArrowLeft/ArrowRight switch it.
- Story keyboard: ArrowLeft/Right turn pages, Escape goes back, Tab reaches back, night, play, prev, next.
- The polite live region speaks each page's text for screen-reader users; the visual highlight is not announced word by word.
- Speech only starts from a tap (cover, play, word, page turn), inside `try/catch`, and is silently skipped if missing.
- Contrast: night cream `#F3EBDD` on `#141C33` 14:1; highlight `#141C33` on `#F6D27A` 11.6:1; day text `#1F2A3D` on `#EAF0E6` 12:1; `--text-2` above 4.5:1 in both modes. Titles sit on solid plates, never on the pictures.
- Hit targets: 64px bar buttons, 76px arrows, 88px play, 76px choices, 72px end buttons, words are at least 44px tall at 30px × 1.45.

## Responsive rules

- At 360 wide: covers 158 × 270, story text 28px, arrows 72px; the text block keeps 220px min height so controls never jump.
- Taller than 844: extra height goes above the dots; controls stay in the bottom 130px.
- At tablet width: the shelf becomes 3 columns of 220 × 320 covers inside a 720px column; the story page puts the picture left and text right at 34px.

## Acceptance checklist

### Always

- [ ] Covers are drawn (SVG or CSS), titles on solid plates, at least 150px wide.
- [ ] Read-to-me highlights the spoken word from `onboundary` `charIndex`, mapped to word spans.
- [ ] With no boundary event in 700ms, a timer highlights words at 280ms + 55ms per character.
- [ ] `speechSynthesis` calls are in `try/catch`; the page still works without it.
- [ ] Read-to-me turns the page 1500ms after the last word; I'll-read never speaks unless a word is tapped.
- [ ] Swipe over 60px, the arrows and ArrowLeft/Right all turn pages.
- [ ] Hidden screens are `visibility:hidden` and `inert`.
- [ ] Night mode is the default and recolours every surface, including the moon icon fill.
- [ ] The end screen has no score; Read again restarts from page 1.
- [ ] `document.documentElement.scrollWidth` is 390; reduced motion stops beam, waves, twinkle and slides.

### This demo

- [ ] Books: The Sleepy Lighthouse (4 pages, opens at page 2), Otto Counts the Stars, A Hat for Hedgehog, The Moon's Lost Sock (3 pages each).
- [ ] Child's name Juno in "Sleep tight, Juno."
- [ ] Night palette `#141C33` / `#F3EBDD` / `#F6D27A`; day `#EAF0E6` / `#1F2A3D` / `#2F6F6A`.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: the shelf in night mode. Title "Story shelf" (Lora 30px) with a 64px moon button (filled moon = night on). A 2 × 2 grid of covers 173 × 284: picture on top (212px), title on a solid plate (72px). The lighthouse cover has a coral bookmark ribbon (it is mid-story, page 2 of 4). At the bottom, two 76px pill choices: "Read to me" (selected, moon-yellow fill) and "I'll read" (2px outlined).
2. Lights in the pictures move slowly: the lighthouse beam sweeps ±12° over 6s, waves bob 4px over 4s, stars twinkle 0.45 → 1 opacity over 3s.
3. Tap a cover: the shelf fades out and the story fades and scales in (320ms fade, 480ms scale 0.97 → 1). The lighthouse opens at page 2; the others at page 1. Focus moves to the play button.
4. Read to me: reading starts at once (the cover tap is the gesture). The play button becomes Pause. Each word gets the `.on` plate as the voice reaches it. After the last word: the highlight clears, the next arrow nudges 6px (1.4s loop), and 1500ms later the page turns by itself.
5. If no boundary event arrives within 700ms of `speak()` (or `speechSynthesis` is missing or throws), a timer drives the highlight: each word stays for 280ms + 55ms × its length. Page done fires when the timer passes the last word, or on `onend` if boundary events were working.
6. Pause stops the voice (`cancel()`) and clears the highlight; Play reads the page from its start.
7. I'll read: no voice on page open. Tapping a word lights it and says only that word (rate 0.8); the plate clears after 900ms.
8. Page turns: big 76px arrows, a horizontal swipe over 60px anywhere on the page (not on a button), or ArrowLeft/ArrowRight. New text slides in 36px from the turn direction (480ms expo out). Dots under the text show the page; the current dot widens to 28px. Previous is disabled on page 1.
9. After the last page: "The end" screen with a crescent moon on a navy disc, "The end" in Lora italic 60px, "Sleep tight, Juno. Lumo is sleeping too." (or "Sleep tight, Juno."), and two 72px buttons: "Read again" (primary, focused) and "Back to shelf". No stars, scores or streaks.
10. Night button on any screen swaps the whole palette (600ms colour transition) and updates `aria-pressed` on both buttons.
11. Back (64px chevron) or Escape returns to the shelf and stops the voice.

## Tokens

```css
:root {                       /* day */
  --bg: #EAF0E6;              /* sage linen page */
  --surf: #FBF8F1;            /* title plates, round buttons */
  --well: #DCE5D6;            /* page dots, moon disc */
  --text: #1F2A3D;
  --text-2: #46536A;
  --hl: #FFE08A;              /* word plate */
  --hl-text: #1F2A3D;
  --accent: #2F6F6A;          /* play, selected choice, current dot */
  --accent-text: #FFFFFF;
  --edge: rgba(31,42,61,.10);
  --ribbon: #E2574C;
  /* type */
  --serif: "Lora", Georgia, serif;
  --sans: "Karla", system-ui, sans-serif;
  --fs-story: 30px; --lh-story: 1.45; --fs-end: 60px; --fs-h1: 30px; --fs-cover: 17px; --fs-choice: 18px; --fs-mini: 15px;
  /* shape */
  --r-cover: 24px; --r-scene: 28px; --r-word: 10px; --r-pill: 999px;
  --hit: 64px; --arrow: 76px; --play: 88px; --choice-h: 76px; --big-h: 72px;
  --lift: 0 10px 26px rgba(20,28,51,.16);
  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --sheet: cubic-bezier(.32,.72,0,1);
  --t-micro: 160ms; --t-layout: 320ms; --t-page: 480ms; --t-theme: 600ms;
  --word-base: 280ms; --word-per-char: 55ms; --auto-turn: 1500ms; --boundary-wait: 700ms;
}
:root[data-night] {           /* default */
  --bg: #141C33; --surf: #1E2946; --well: #28355A;
  --text: #F3EBDD; --text-2: #C9C3D6;
  --hl: #F6D27A; --hl-text: #141C33;
  --accent: #F6D27A; --accent-text: #141C33;
  --edge: rgba(243,235,221,.10);
  --lift: 0 10px 26px rgba(0,0,0,.35);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Notes |
|---|---|---|---|---|---|
| Story text | Lora | 30px | 500 | 1.45 | −0.005em, ≤ 22 words a page |
| The end | Lora italic | 60px | 500 | 1 | −0.02em |
| End line | Lora | 22px | 500 | 1.35 | `--text-2` |
| Shelf title | Lora | 30px | 600 | 1 | −0.01em |
| Cover title | Lora | 17px | 600 | 1.2 | two lines max |
| Choices, buttons | Karla | 18–20px | 800 | 1 | nowrap |
| Story title (bar) | Karla | 15px | 700 | 1.2 | ellipsis |

Lora's open counters and moderate contrast hold up at 30px for early readers; Karla carries the controls so the two never compete.

## Implementation notes

**Map boundary `charIndex` to a word.** Build the utterance from the spans so the offsets line up, and keep each span's start index:

```js
const ws = [...wordsEl.children], starts = []; let c = 0;
ws.forEach(s => { starts.push(c); c += s.textContent.length + 1; });
const u = new SpeechSynthesisUtterance(ws.map(s => s.textContent).join(' '));
u.rate = .82;
u.onboundary = e => {
  if (e.name === 'sentence') return; got = true;
  let k = 0; while (k + 1 < starts.length && starts[k + 1] <= e.charIndex) k++;
  highlight(k);
};
u.onend = () => { if (got) pageDone(); };
speechSynthesis.speak(u);
setTimeout(() => { if (!got) timed(0); }, 700);
```

**Guard every async callback with a token.** Turning a page, pausing or leaving must kill the old voice and the old timers, or a late `onend` will turn the next page:

```js
function stop() { token++; clearTimeout(timer); try { speechSynthesis.cancel(); } catch (e) {} }
function timed(t, i) {
  if (t !== token) return;
  if (i >= ws.length) return pageDone(t);
  highlight(i);
  timer = setTimeout(() => timed(t, i + 1), 280 + ws[i].textContent.length * 55);
}
```

**Highlight with a background, not a weight change.** Bolding the spoken word reflows the line on every word. A padded background with equal negative margin (`padding:0 3px; margin:0 -3px`) lights the word without moving anything. Common mistakes: starting speech on page load (blocked, and not the child's choice), letting the timed fallback and `onend` both call page done, and putting title text straight onto the cover picture.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
