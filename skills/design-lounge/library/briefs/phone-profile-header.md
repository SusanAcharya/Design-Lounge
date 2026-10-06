<!-- Design Lounge Nº 349 · "Phone profile header" · www.designlounge.live -->

# Phone profile header

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them. When a kit is locked, map colours onto the kit tokens. Glass is allowed in one place only: the compact top bar. Everything else is opaque.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A creator profile in Kiln, a fictional app where potters share their work. The profile is Noor Haddad, @noorthrows, who throws stoneware in a garage in Leeds. The top of the screen is a large header: a 92px avatar drawn from initials, the name at 28px, the handle, a two-line bio, three stats, and a row of actions. Under it, a segmented control switches between Posts, Saved, and About. Posts is a two-column grid of six tiles drawn with CSS colour blocks. When the name scrolls under the top bar, the bar turns to iOS 26-ish glass and shows a small avatar and the name. The detail worth copying is the hand-off: the big name leaves, and the small name arrives in the same place your eye is looking.

The language is iOS 26-ish. Use an SF-like stack. This demo loads Inter so it renders the same everywhere. Neutrals are bright and slightly warm. One vivid cobalt does the brand work: the avatar, the Follow button, and the focus ring.

## Structure

```
390 × 844
┌──────────────────────────────────────┐
│ (54px top inset, status bar by host) │
│ [<]      (NH) Noor Haddad       [⋯]  │ bar: fixed, 44px row, glass when compact
├──────────────────────────────────────┤ y = 99
│ ( NH )                [● Studio open]│ avatar 92px, badge
│ Noor Haddad                          │ 28px / 700
│ @noorthrows                          │ 15px
│ Wheel-thrown stoneware from a        │ bio, max 32ch
│ garage in Leeds. Glaze tests…        │
│ ──────────────────────────────────── │
│ 214     │ 18,642     │ 312           │ stats 20px tabular
│ Posts   │ Followers  │ Following     │
│ ──────────────────────────────────── │
│ [ + Follow ] [ Message ] [⇪]         │ 44px row, 1fr 1fr 44px
│ ┌ Posts ─┬ Saved ─┬ About ┐          │ sticky at 98px, 50px tall
│ ┌────────┐ ┌────────┐                │
│ │ swatch │ │ swatch │                │ 2 cols, gap 16 / 12,
│ └────────┘ └────────┘                │ tiles 4:5
│ Celadon bowl…  Tenmoku jug…          │
│ (3 rows of 2)                        │
│ (34px bottom inset)                  │
└──────────────────────────────────────┘
```

- The bar is a `header` with `position: fixed`, `padding-top: max(54px, env(safe-area-inset-top))`, and a 3-column grid: 44px, 1fr, 44px.
- The bar title is `aria-hidden`. The `h1` is the accessible name of the page.
- The large header is a `section` labelled by the `h1`.
- The avatar is a `div role="img" aria-label="Noor Haddad"`. Inside are three thin concentric circles in SVG, like rings on a wheel, and the initials.
- Stats are a `dl`. Each pair is a `div` with `dt` and `dd`. CSS `order` puts the number above the label.
- The tabs are `role="tablist"` with three `role="tab"` buttons and a decorative thumb `span`.
- Each panel is a `section role="tabpanel"` with `tabindex="0"` and `hidden` when not selected.
- Each tile is a `button` with a block swatch, a bold title, and a meta line.
- Panels have `min-height: 560px`, so the header can collapse on every tab.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Avatar | scroll 0–120px | scale, opacity | 1, 1 → 0.65, 0.1 | tied to scroll | linear map | opacity only, no scale |
| Bar fill | name passes bar | background, border | transparent → glass | 280ms | `--ease` | instant |
| Bar title | name passes bar | opacity, translateY | 0, 6px → 1, 0 | 200ms | `--ease` | opacity, no move |
| Follow fill | click | background, color, inset border | cobalt → white | 160ms | `--ease` | instant |
| Follow shape | click | border-radius | 999px → 14px | 280ms | `--spring` | instant |
| Plus icon | click | opacity, scale, rotate | 1, 1, 0 → 0, 0.4, 90° | 280ms | `--spring` | instant |
| Check icon | click | opacity, scale, rotate | 0, 0.4, -45° → 1, 1, 0 | 280ms | `--spring` | instant |
| Follow press | `:active` | scale | 1 → 0.97 | 160ms | `--ease` | kept |
| Tab thumb | tab change | translateX | n × 100% | 280ms | `--spring` | instant |
| Tab label | tab change | color | `--ink-3` → `--ink` | 160ms | `--ease` | instant |

- Read scroll in a passive listener. Batch work into one `requestAnimationFrame`.
- Do not tie the bar's glass to a scroll ratio here. It is a state switch with a transition. `ios-large-title-collapse` is the piece where the glass scales with scroll.
- Nothing loops.

## States

- Follow, not following: cobalt fill, white text, plus icon, `aria-pressed="false"`, pill radius.
- Follow, following: white fill, 1px `--line` inset border, ink text, check icon, `aria-pressed="true"`, 14px radius.
- Follow hover: not following → `--accent-press`. Following → `--fill`.
- Ghost buttons (Message, Share) hover: `--fill`.
- Tab selected: white thumb under it, `--ink` text, `aria-selected="true"`, `tabindex="0"`.
- Tab resting: `--ink-3` text, `tabindex="-1"`.
- Bar expanded: transparent, no border, title hidden.
- Bar compact: glass fill, blur, hairline, title shown.
- Focus-visible: 2px cobalt outline, offset 2px. Tabs use offset -2px so the ring stays inside the track.
- Loading, for a product: keep the header shape. Show grey 92px circle, two grey bars for name and handle, and grey tiles. Do not show 0 followers.
- Empty Posts, for a product: one line, "No posts yet", and no grid. Keep the tabs.
- Follow error, for a product: revert the button and the count, and announce "Could not follow. Try again."

## Accessibility

- Follow is a toggle button with `aria-pressed`. Its visible label changes too. Screen readers hear "Following, toggle button, pressed".
- The followers count is plain text. The live region carries the change message, so the count does not need its own live region.
- Tabs follow the ARIA tabs pattern with automatic activation. Arrow keys move and select. Home and End work. Only the selected tab is in the tab order.
- Each panel is focusable with `tabindex="0"` so keyboard users can reach the panel after the tablist.
- The bar title is decorative. The page `h1` stays in the DOM when it scrolls away.
- Hit targets: back, more, share are 44×44. Follow and Message are 44px tall. Tabs are 44px tall inside a 50px track. Tiles are much larger.
- Contrast: `#141518` on `#f6f5f2` is about 17:1. `#686b73` on `#f6f5f2` is about 4.9:1. White on `#2340f0` is about 6.9:1.
- Glass legibility: at 72% fill, ink text stays above 4.5:1 over the brightest tile. If your tiles are darker, raise the fill to 80%. Do not lower the text weight.
- The avatar has a text label. The ring SVG is `aria-hidden`.

## Responsive rules

- Frame: 390×844. Bar is 54 + 44 + 1px. The header starts at 106px.
- At 360 wide: keep two tile columns. Tiles become about 162px wide. The action row stays 1fr 1fr 44px. Let the bio wrap to three lines.
- At tablet width: center the profile in a 600px column. Use three tile columns. Keep the bar full width, with the title centred.
- If the name is long, let the `h1` wrap to two lines. Truncate the bar title with an ellipsis at one line.
- Do not draw a status bar. The bar's top padding is the clearance.

## Acceptance checklist

### Always

- [ ] The first frame shows the full header with a transparent bar.
- [ ] The avatar is drawn with initials or a shape. No image file.
- [ ] Three stats with tabular numbers. Changing a count does not shift its label.
- [ ] Follow toggles `aria-pressed`, label, icon, fill, and radius together.
- [ ] The follower count changes by exactly 1 on follow and back on unfollow.
- [ ] Three tabs in a tablist. Arrow keys, Home, and End work. One panel is visible at a time.
- [ ] The tab thumb slides with the iOS sheet easing.
- [ ] The bar turns to glass only after the name passes under it, and goes back on scroll up.
- [ ] Glass is used on the compact bar only. Nothing else blurs.
- [ ] Every control is at least 44px on its tap axis.
- [ ] Reduced motion: no scale on the avatar, no slide on the bar title.

### This demo

- [ ] The app is Kiln. The profile is Noor Haddad, @noorthrows.
- [ ] Stats read 214 Posts, 18,642 Followers, 312 Following.
- [ ] The avatar is 92px, `#2340f0`, initials "NH", with three thin rings.
- [ ] Posts shows six tiles. The first is "Celadon bowl, third firing", "Cone 10 · 2d".
- [ ] Saved shows four tiles. About shows five rows.
- [ ] Background `#f6f5f2`, track `#ecebe7`, glass `rgba(250,250,248,.72)` with 20px blur.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: the bar is transparent. Only the back and more buttons show in it. The large header is fully visible. Follow is a filled cobalt pill with a plus icon. Posts is the selected tab. Six post tiles are below.
2. Scroll down. The avatar scales from 1 to 0.65 and fades from 1 to 0.1 over the first 120px of scroll. It scales from its bottom-left corner.
3. When the bottom of the `h1` passes the bottom of the bar (99px from the top), the bar gets the class `is-compact`. Its background fades to glass over 280ms. A hairline appears under it. The bar title (26px avatar + "Noor Haddad") fades in and rises 6px over 200ms.
4. Scroll back up past that line. The bar returns to transparent and the title fades out.
5. The segmented control is sticky. It pins at 98px from the top, right under the bar. Tiles scroll under it and then under the glass bar.
6. Tap Follow. The button turns white with a hairline border. Its radius goes from pill to 14px. The plus rotates 90° and fades out. A check scales in from 0.4 and rotates from -45°. The label becomes "Following". Followers goes from 18,642 to 18,643.
7. Tap Following. Everything reverses. Followers goes back to 18,642.
8. A polite live region says "Following Noor Haddad" or "Unfollowed Noor Haddad".
9. Tap Saved. The white thumb slides under Saved over 280ms. The Posts panel hides. The Saved panel shows four tiles from other makers.
10. Tap About. The thumb slides again. A five-row definition list shows Studio, Clay, Sells, Teaches, Joined.
11. With a tab focused, Left and Right move to the next tab and select it. Home and End jump to the first and last tab.
12. Message and Share are buttons. They do nothing in this demo.

## Tokens

```css
:root {
  /* neutrals */
  --bg: #f6f5f2;
  --surface: #ffffff;
  --fill: #ecebe7;          /* segmented track */
  --line: #e3e1dc;
  --ink: #141518;
  --ink-2: #45474d;
  --ink-3: #686b73;
  /* accent */
  --accent: #2340f0;        /* cobalt */
  --accent-press: #1a31c4;
  --on-accent: #ffffff;
  --focus: #2340f0;
  /* glass, compact bar only */
  --glass: rgba(250, 250, 248, 0.72);
  --glass-line: rgba(20, 21, 24, 0.08);
  --glass-blur: blur(20px) saturate(180%);
  /* type */
  --sans: "Inter", -apple-system, "SF Pro Text", system-ui, sans-serif;
  /* space, 4px base */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px;
  --page-x: 20px;
  /* radii */
  --r-s: 10px; --r-m: 14px; --r-l: 20px; --r-pill: 999px;
  /* motion */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --spring: cubic-bezier(0.32, 0.72, 0, 1);
  --micro: 160ms;
  --layout: 280ms;
  /* insets */
  --top: max(54px, env(safe-area-inset-top));
}
```

Glaze colours for the tiles are per-tile inline values, not tokens: `--a` top block, `--b` bottom block, `--c` pot. Example celadon: `#dfe7dc`, `#c9d5c4`, `#8fb19a`.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Name | Inter | 28px | 700 | 1.1 | -0.025em | `--ink` |
| Handle | Inter | 15px | 400 | 1.45 | 0 | `--ink-3` |
| Bio | Inter | 15px | 400 | 1.45 | 0 | `--ink-2`, max 32ch |
| Stat number | Inter | 20px | 700 | 1.2 | -0.02em | tabular-nums |
| Stat label | Inter | 13px | 400 | 1.3 | 0 | `--ink-3` |
| Button | Inter | 15px | 600 | 1 | 0 | |
| Tab | Inter | 14px | 600 | 1 | 0 | `--ink-3`, selected `--ink` |
| Bar title | Inter | 16px | 600 | 1 | -0.01em | |
| Avatar initials | Inter | 32px | 700 | 1 | -0.02em | white |
| Tile title | Inter | 14px | 600 | 1.25 | -0.01em | |
| Tile meta | Inter | 12px | 400 | 1.3 | 0 | tabular-nums |
| Badge | Inter | 12px | 600 | 1 | 0 | `--ink-2` |

- Turn on `font-feature-settings: "cv11", "ss01"` for Inter's single-storey a and open digits. With SF, drop it.
- Stat numbers must be tabular. 18,642 → 18,643 must not shift the label.

## Implementation notes

Always: the compact switch should compare the name's bottom edge with the bar's height. Do not use a fixed scroll number. The header height changes with the bio length.

```js
let ticking = false;
addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const p = Math.min(Math.max(scrollY / 120, 0), 1);
    avatar.style.transform = reduce.matches ? '' : `scale(${1 - 0.35 * p})`;
    avatar.style.opacity = String(1 - p * 0.9);
    const passed = nameEl.getBoundingClientRect().bottom < bar.offsetHeight;
    bar.classList.toggle('is-compact', passed);
    ticking = false;
  });
}, { passive: true });
```

The bar and its glass state:

```css
.bar { position: fixed; inset: 0 0 auto; z-index: 10;
  padding: var(--top) 6px 0; border-bottom: 1px solid transparent;
  transition: background-color var(--layout) var(--ease), border-color var(--layout) var(--ease); }
.bar.is-compact { background: var(--glass); border-bottom-color: var(--glass-line);
  -webkit-backdrop-filter: var(--glass-blur); backdrop-filter: var(--glass-blur); }
.bar-title { opacity: 0; transform: translateY(6px);
  transition: opacity 200ms var(--ease), transform 200ms var(--ease); }
.is-compact .bar-title { opacity: 1; transform: none; }
```

The Follow morph. Two icons stack in one 18px box and swap:

```css
.follow { border-radius: 999px; background: var(--accent); color: var(--on-accent);
  transition: background-color 160ms var(--ease), color 160ms var(--ease),
    box-shadow 160ms var(--ease), border-radius 280ms var(--spring); }
.follow[aria-pressed="true"] { background: var(--surface); color: var(--ink);
  box-shadow: inset 0 0 0 1px var(--line); border-radius: 14px; }
.follow .ic svg { position: absolute; inset: 0;
  transition: opacity 160ms var(--ease), transform 280ms var(--spring); }
.follow .chk { opacity: 0; transform: scale(.4) rotate(-45deg); }
.follow[aria-pressed="true"] .plus { opacity: 0; transform: scale(.4) rotate(90deg); }
.follow[aria-pressed="true"] .chk { opacity: 1; transform: none; }
```

The tile swatch is three CSS layers. No image:

```css
.swatch { display: block; aspect-ratio: 4 / 5; border-radius: 14px; position: relative;
  overflow: hidden; background: linear-gradient(180deg, var(--a) 0 58%, var(--b) 58% 100%); }
.swatch::before { content: ""; position: absolute; left: 22%; right: 22%; top: 30%; bottom: 16%;
  border-radius: 40% 40% 18% 18% / 30% 30% 14% 14%; background: var(--c);
  box-shadow: inset -10px 0 0 rgba(0,0,0,.12), inset 6px 0 0 rgba(255,255,255,.14); }
.swatch::after { content: ""; position: absolute; left: 30%; right: 30%; top: 24%;
  height: 9%; border-radius: 4px; background: var(--c); filter: brightness(.88); }
```

Common mistakes:

- Glass on the whole header, the tabs, and the buttons. Glass is the compact bar only.
- A bar that is glass from the first frame. It starts transparent.
- Animating the follower count with a roll. It changes by one. Swap the text.
- Proportional digits in the stats. The labels jump.
- The tablist scrolling away. It sticks under the bar.
- Panels with too little content, so the header cannot collapse on About. Give panels a min-height.
- A cover photo above the avatar. This piece has none.
- A purple-to-blue gradient behind the avatar. The avatar is one flat cobalt with thin rings.
- Using `div`s with click handlers for tabs. Use the tabs pattern.
- Drawing a status bar.

Where it sits:

1. You reach this screen from a post or from search. Back returns there.
2. Your own profile reuses this layout. Swap Follow for "Edit profile" in the ghost style, and drop Message.
3. A tap on a tile opens the post detail. It is not drawn here.
4. A web profile with an editorial masthead is `profile-creator-masthead`. Do not merge the two.
5. If the app has a tab bar, it sits under this screen. Use `phone-tab-plain`, not a glass bar, so there is one glass surface.

Rebuild order:

1. Set the page background and the fixed bar with back and more buttons.
2. Build the header: avatar, badge, name, handle, bio.
3. Add the stats `dl` with tabular numbers and the action row.
4. Add the sticky tablist with the sliding thumb.
5. Build the three panels. Fill Posts with six swatch tiles.
6. Wire tabs with click and arrow keys.
7. Wire Follow with the morph and the count.
8. Add the scroll handler for the avatar and the compact bar.
9. Check reduced motion and focus rings.
10. Map colours onto the locked theme if a kit is on.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
