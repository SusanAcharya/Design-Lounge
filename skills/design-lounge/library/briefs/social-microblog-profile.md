<!-- Design Lounge Nº 312 · "Microblog profile header" · designlounge.vercel.app -->

# Microblog profile header

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws.

## What it is

The top of a person's page on a short-post network, in a near-black theme with one acid-lime accent. A 620px timeline column holds a contour-ring banner with a coordinate tag and a glowing pin, a 128px avatar overlapping the banner, actions on the right (more, bell, Follow), name with a verified seal, a mono handle with a "Follows you" chip, bio with lime links, a meta row, follow counts, and a three-tab strip that swaps the timeline below.

The member is Saoirse Dunleavy, a Galway cartographer, so the banner is a map: concentric rings around her pin, a halftone screen over it, the latitude and longitude in DM Mono. The detail worth copying is the behaviour of the Follow cluster: the bell is disabled until you follow, the Following pill reads "Unfollow" in coral on hover, and the follower count changes by exactly one.

## Structure

```
page 1280×800, dotted bg, column 620px centred, 1px side rules
┌──────────────────── column 620 ────────────────────┐
│ banner 190px  [53.2707° N, 9.0568° W]       ◉ pin   │
│ ╭──────╮                                            │
│ │avatar│ 128px, −64px overlap   (···)(bell)(Follow) │ row 72px
│ ╰──────╯                                            │
│ Saoirse Dunleavy ✓            26px / 800            │
│ @dunleavy.maps [Follows you]  mono 14px             │
│ bio, max 540px                                      │
│ ⌖ Galway, Ireland  ⛓ dunleavy.ie/atlas  ▦ Joined… │
│ 482 Following   21,438 Followers                    │
├──────── Posts ──────── Replies ──────── Media ──────┤ 53px
│ ▔▔▔▔ lime bar 4px                                   │
│ (40) Name @handle · 2h                              │
│      text                                           │
│      ◌ 38   ⇄ 112   ♡ 1,204   (mono 12.5px)         │
├─────────────────────────────────────────────────────┤
│ …                                                   │
└─────────────────────────────────────────────────────┘
```

- Column: `main`. Header block: `section` labelled by the `h1`.
- Banner: decorative `div` (`aria-hidden`). Avatar: `div role="img"` with a label, painted with radial gradients.
- Actions: three `button`s. Bell and Follow are toggle buttons with `aria-pressed`.
- Verified seal: inline SVG with `role="img" aria-label="Verified"` inside the `h1`.
- Counts: two `button`s (they would open lists).
- Tabs: `div role="tablist" aria-label="Profile timeline"` with three `button role="tab"`, each label wrapped in a `span` (measured for the bar). The bar is a decorative absolutely positioned `span`.
- Panels: `section role="tabpanel" tabindex="0" aria-labelledby`. Posts are `article`s. Media tiles are `button`s with `aria-label`.
- Hidden `p aria-live="polite"` for announcements.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing |
| --- | --- | --- | --- | --- |
| Tab bar | tab select | `transform: translateX`, `width` | old label → new label (+8px) | 360ms `--expo` |
| Panel | becomes visible | opacity, translateY | 0, 6px → 1, 0 | 320ms `--expo` (keyframes) |
| Follow pill | toggle / hover | background, color, inset shadow | lime → outline → coral | 160ms `--ease` |
| Follow pill | `:active` | scale | 1 → 0.96 | 120ms |
| Icon buttons | hover / pressed / enable | background, color, opacity | — | 160–200ms `--ease` |
| Media tile | hover | `filter: brightness` | 1 → 1.15 | 200ms `--ease` |

On first paint, place the bar with transitions disabled, force a reflow, then re-enable, so it doesn't slide in from 0. Reduced motion: all transitions and animations to 0.01ms; the bar jumps, panels swap instantly.

## States

- Follow idle: lime fill, `--lime-ink` text, min-width 112px so the label swap doesn't change its width.
- Following: transparent, `--ink` text, 1px `--ink-3` inset ring.
- Following hover: label "Unfollow", coral text and ring, `rgba(255,107,90,.08)` fill.
- Bell disabled: opacity .35, `cursor: not-allowed`. Bell on: lime icon, 1px lime ring.
- Icon button hover: `--raise` fill.
- Tab hover: `--raise` fill, `--ink` text. Selected: bold, `--ink`, bar under label.
- Post hover: row background `#171a13`.
- Focus-visible: 2px lime outline, offset 2px; tabs use offset −3px so the ring sits inside the strip.

## Accessibility

- Follow and bell are toggle buttons (`aria-pressed`). The bell has `aria-label="Notify me when Saoirse posts"` and is `disabled` (not just styled) while not following.
- The hover-only "Unfollow" label is a visual affordance; the accessible state is `aria-pressed="true"` with the visible "Following" label on focus.
- Tabs follow the WAI-ARIA tabs pattern with automatic activation: roving `tabindex`, Left/Right wrap, Home/End. `aria-selected` and `aria-controls` on every tab; panels are `tabindex="0"` so they can receive focus after the tablist.
- Live region announces follow, unfollow, and bell changes.
- Contrast on `#141611`: `#eeede4` ≈ 15:1, `#8b8e80` ≈ 5.4:1, lime `#c8f23a` ≈ 13:1, `#151a05` on lime ≈ 14:1.
- Hit targets: icon buttons 40×40, Follow 40px tall, tabs 53px tall.

## Responsive rules

- ≥1280 / 1024 / 768: column stays 620px centred on the dotted page.
- <640: column fills width; side rules sit at the viewport edge.
- ≤520 (checked at 375): banner 140px, avatar 96px with −48px overlap, action row 56px tall, stats gap 18px. The meta row wraps to two lines. Tab bar re-measures on resize.
- No horizontal overflow at 375px.

## Acceptance checklist

### Always

- [ ] Avatar overlaps the banner by half its height and has a 4px ring in the column colour.
- [ ] Follow toggles `aria-pressed`, changes the follower count by exactly ±1, and keeps its width.
- [ ] The Following pill reads "Unfollow" in the danger colour on hover only.
- [ ] The notification bell is disabled until following and resets when unfollowing.
- [ ] Exactly three tabs; one panel visible; the accent bar slides to the selected label and matches its width + 8px.
- [ ] Arrow keys, Home and End operate the tabs; only the selected tab is tabbable.
- [ ] Handles and timestamps are in the mono face.
- [ ] One accent colour; coral appears only for Unfollow.
- [ ] Live region announces follow and notification changes.
- [ ] No horizontal overflow at 375px.

### This demo

- [ ] Name "Saoirse Dunleavy", handle "@dunleavy.maps", chip "Follows you", verified seal in lime.
- [ ] Meta: "Galway, Ireland", "dunleavy.ie/atlas", "Joined March 2019".
- [ ] Counts: 482 Following, 21,438 → 21,439 Followers.
- [ ] Banner tag "53.2707° N, 9.0568° W" and a lime pin at 70% / 60%.
- [ ] Media grid: Rossaveel, Hatching, Inis Meáin, Spiddal, Rose, Night tide.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: Posts tab selected with a 4px lime bar under its label. Two posts are visible. Follow is a solid lime pill; the bell is at 35% opacity and disabled. Followers reads "21,438".
2. Clicking Follow: the pill becomes an outlined "Following" (`aria-pressed="true"`), Followers becomes "21,439", the bell enables, and a polite live region says "You are following Saoirse Dunleavy."
3. Hovering the Following pill changes its label to "Unfollow" with coral text, coral 1px ring and an 8% coral wash. Leaving restores "Following".
4. Clicking it again unfollows: back to lime "Follow", count returns to 21,438, bell disables and resets to off, live region says "Unfollowed Saoirse Dunleavy."
5. Clicking the bell (only when following) toggles `aria-pressed`; on it turns lime with a lime ring. Announces "Notifications on for new posts." / "Notifications off."
6. Clicking a tab selects it: label goes bold and full ink, the lime bar slides and resizes to the label width + 8px over 360ms, and the matching panel fades up 6px over 320ms. Other panels are `hidden`.
7. With focus on a tab, Left/Right move and select (wrapping), Home/End jump to first/last. Only the selected tab is in the tab order.
8. Replies shows two posts with a "Replying to @…" line. Media shows a 3×2 grid of square, CSS-drawn map tiles with mono captions; tiles brighten 15% on hover.
9. Bio links, the site link and mentions are inert in the demo.

## Tokens

```css
:root {
  /* colour */
  --bg: #0e0f0c;         /* page, with lime dot grid at 5% */
  --col: #141611;        /* timeline column */
  --raise: #1b1e17;      /* hover wash, chips */
  --line: #2a2e24;       /* hairlines */
  --ink: #eeede4;        /* primary text */
  --ink-2: #b0b2a4;      /* chip text */
  --ink-3: #8b8e80;      /* meta, handles, inactive tabs */
  --lime: #c8f23a;       /* accent: Follow, links, tab bar, seal, focus */
  --lime-ink: #151a05;   /* text on lime */
  --danger: #ff6b5a;     /* Unfollow hover only */

  /* type */
  --sans: "Bricolage Grotesque", system-ui, sans-serif;
  --mono: "DM Mono", ui-monospace, monospace;

  /* space */
  --s1: 4px; --s2: 8px; --s3: 12px; --s4: 16px; --s5: 20px;

  /* shape */
  --r-pill: 999px;
  --r-chip: 4px;
  --bar-h: 4px;

  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --t-micro: 160ms;
  --t-bar: 360ms;
  --t-panel: 320ms;
}
```

## Typography

| Role | Family | Size / lh | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Name | Bricolage Grotesque (opsz 48) | 26px / 1.1 | 800 | -0.02em | `--ink` |
| Handle | DM Mono | 14px | 400 | 0 | `--ink-3` |
| Chip "Follows you" | DM Mono | 11px | 500 | 0 | `--ink-2` on `--raise` |
| Bio | Bricolage Grotesque | 15px / 1.45 | 400 | 0 | `--ink`, links `--lime` |
| Meta row | Bricolage Grotesque | 14px | 400 | 0 | `--ink-3`, 17px icons |
| Count number | Bricolage Grotesque | 14px | 700 | 0 | `--ink`, tabular-nums |
| Follow | Bricolage Grotesque | 15px | 700 | 0 | `--lime-ink` on lime |
| Tab | Bricolage Grotesque | 15px | 500 / 700 selected | 0 | `--ink-3` / `--ink` |
| Post author | Bricolage Grotesque | 14px | 700 | 0 | |
| Post handle + time | DM Mono | 13px | 400 | 0 | `--ink-3` |
| Post stats | DM Mono | 12.5px | 400 | 0 | `--ink-3`, 16px icons |
| Banner coords | DM Mono | 11px | 500 | 0.06em | lime on 70% black |

Mono is for machine-ish strings: handles, timestamps, counts on posts, coordinates. Names and prose are the grotesque.

## Implementation notes

**Sliding bar sized to the label.** Measure the label `span`, not the tab, so the bar is a word-wide underline rather than a third of the strip.

```js
function placeInk(tab) {
  const w = tab.firstElementChild.offsetWidth + 8;
  ink.style.width = w + 'px';
  ink.style.transform = `translateX(${tab.offsetLeft + (tab.offsetWidth - w) / 2}px)`;
}
ink.style.transition = 'none';
placeInk(tabs[0]);
ink.offsetWidth;            // flush before re-enabling
ink.style.transition = '';
addEventListener('resize', () => placeInk(current()));
```

**Follow cluster.** Keep the count as a number and format it; never parse the DOM string back.

```js
let n = 21438;
follow.addEventListener('click', () => {
  const on = follow.getAttribute('aria-pressed') !== 'true';
  follow.setAttribute('aria-pressed', on);
  follow.textContent = on ? 'Following' : 'Follow';
  fcount.textContent = (n += on ? 1 : -1).toLocaleString('en-US');
  bell.disabled = !on;
  if (!on) bell.setAttribute('aria-pressed', 'false');
});
follow.addEventListener('mouseenter', () => { if (isOn()) follow.textContent = 'Unfollow'; });
follow.addEventListener('mouseleave', () => { if (isOn()) follow.textContent = 'Following'; });
```

**Contour banner in CSS.** Two repeating radial gradients at different centres, a dark linear base, and a 5px halftone dot screen on top with `mix-blend-mode: multiply`.

```css
.banner { background:
  repeating-radial-gradient(circle at 70% 60%, transparent 0 11px, rgba(200,242,58,.32) 11px 12px),
  repeating-radial-gradient(circle at 22% 110%, transparent 0 15px, rgba(200,242,58,.18) 15px 16px),
  linear-gradient(160deg, #25321a, #121a0c 70%); }
.banner::after { content: ""; position: absolute; inset: 0; opacity: .55; mix-blend-mode: multiply;
  background: radial-gradient(rgba(14,15,12,.9) 1.1px, transparent 1.3px) 0 0 / 5px 5px; }
```

Common mistakes:

- A blue accent and white page. This piece is the dark lime one; don't drift back to the default network look.
- Making the bell clickable before following.
- Tabs that only restyle without hiding the other panels, or panels that remain in the tab order when hidden.
- A full-width underline under the selected tab.
- Using the danger colour for anything except the Unfollow hover.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
