<!-- Design Lounge Nº 371 · "Professional network profile card" · www.designlounge.live -->

# Professional network profile card

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. Use the stack already chosen for this build (When to ask in SKILL.md). Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours, fonts, and corner radius. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. A Show mode centrepiece keeps its live readouts. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

The top of a member's profile on a professional network, cut down to one 580px card: a sage contour-line banner, a 132px avatar wrapped in an orange "OPEN TO WORK" arc, name with a connection-degree badge, an italic serif headline, a meta line, three actions, an "Open to work" note, and a three-row experience timeline. The fictional network is Plyline; the member is Ama Mensah, an infrastructure engineer in Accra.

The feeling is calm and credible: sage neutrals, black ink buttons, one signal orange used only for the job-seeking state. The detail worth copying is the ring: an SVG circle stroke with a 240-unit dash centred on the bottom of the avatar and the words set on a `textPath` inside it, so the badge is real vector type, not a baked image. On hover it lengthens symmetrically.

## Structure

```
page 1280×800, card centred, padding 24px 16px
┌──────────────────── card 580px, radius 14 ────────────────────┐
│ banner 132px  contour rings + gradient     [GRID RESILIENCE…] │
│  ╭─────╮                                                      │
│  │ AM  │ 132px avatar wrap, margin-top −72px                  │
│  ╰─────╯ ring arc "OPEN TO WORK" ── tooltip →                 │
│ Ama Mensah she/her [2nd]                 [HL] Hearthline      │
│ italic headline, max 440px               [KN] KNUST, Kumasi   │
│ Accra · 812 connections · 14 mutual                           │
│ (Connect) (Message) (···)            40px pills, gap 8        │
│ [composer, collapsed]                                         │
│ ● Open to work: … (accent-soft panel, radius 10)              │
├───────────────────────────────────────────────────────────────┤
│ EXPERIENCE                                   9 yrs 4 mos      │
│ ● [HL] Senior Infrastructure Engineer      2022 – now   ^     │
│        description (open)                                     │
│ ○ [KR] Platform Engineer                   2019 – 2022  v     │
│ ○ [OW] Systems Administrator               2016 – 2019  v     │
└───────────────────────────────────────────────────────────────┘
```

- Card: `article` labelled by the name `h1`.
- Banner: decorative `div` with `aria-hidden="true"`; the corner chip is text inside it.
- Avatar: a `div role="img" aria-label="Portrait of Ama Mensah"` painted with stacked radial gradients (face, shoulders, hair, terracotta ground). Ring: an inline SVG (`aria-hidden`). A transparent circular `button` over the avatar carries focus and `aria-describedby` the tooltip (`role="tooltip"`).
- Name row: `h1` containing the name, a `small` for pronouns, and a `span` degree badge.
- Current company and school: a right-hand column of two rows, 24px square monogram logos.
- Actions: three `button`s. Message has `aria-expanded` + `aria-controls="compose"`.
- Composer: a `form` with a `textarea` and a submit button; both get `tabindex=-1` when collapsed.
- Open-to note: `div` with a decorative dot and a `p`.
- Experience: `section` with `h2`, then an `ol` of `li.role`; each row's header is a `button aria-expanded aria-controls` and the description is a sibling `div`.
- A visually hidden `p aria-live="polite"` for announcements.

## Motion

| Thing | Trigger | Property | From → to | Duration / easing |
| --- | --- | --- | --- | --- |
| Ring arc | hover / focus-within avatar | `stroke-dasharray`, `stroke-dashoffset` | 240/24 → 272/40 | 500ms `--expo` |
| Tooltip | hover / focus-within avatar | opacity, translateX | 0, −6px → 1, 0 | 180ms `--ease` |
| Connect button | click | background, color, inset shadow | ink → outline → green | 160ms `--ease` |
| Degree badge | accepted | background, color | outline → `--ok` | 300ms `--ease` |
| Any pill | `:active` | scale | 1 → 0.97 | 120ms |
| Composer | Message click | `grid-template-rows` | 0fr → 1fr | 320ms `--expo` |
| Experience row | click | `grid-template-rows`; chevron rotate | 0fr → 1fr; 0 → 180° | 300ms `--expo`; 240ms |

Reduced motion: set every transition to 0.01ms. All state changes still happen; nothing slides.

## States

- Connect idle: ink fill, `#f6f7f2` text, person-plus icon. Hover `#2b3730`.
- Connect pending: card fill, `--ink-2` text, 1.5px inset ring in `--ink-3`, `aria-label="Invitation pending. Activate to withdraw"`.
- Connect connected: `--ok` fill, white text, `aria-label="Connected with Ama Mensah"`.
- Message: 1.5px inset ink ring; hover and `aria-expanded="true"` add `--soft` fill. After send, label reads "Sent" for 1800ms.
- More: 40px circular ghost button, three dots.
- Experience row hover: `--soft` wash on the row button, radius 8.
- Current role dot: filled `--accent` with a 4px `--accent-soft` halo. Past roles: hollow dot with a 2px `--ink-3` border.
- Focus-visible everywhere: 2px `--accent` outline, offset 2px, radius 6.
- Empty composer: Send does nothing.

## Accessibility

- The avatar has an image role and label. The ring is decorative; the "open to work" meaning is carried by the focusable overlay button (`aria-label="Open to work status"`, `aria-describedby="tip"`) and repeated in the visible note below the actions, so it never depends on the colour or the arc text.
- Tab order: ring button → Connect → Message → More → (composer textarea → Send, when open) → each experience row.
- Message: `aria-expanded` reflects the composer. Escape inside the composer closes it and returns focus to Message.
- Experience rows: `button` with `aria-expanded` and `aria-controls`; Enter and Space toggle.
- Live region (`aria-live="polite"`) announces sent, withdrawn, accepted, and message sent.
- Contrast: `#17201b` on `#fbfbf7` ≈ 16:1; `#5f6a64` on `#fbfbf7` ≈ 5.6:1; `#4a2615` on `#fbe6dc` ≈ 11:1; white on `#2d6a4a` ≈ 6.6:1.
- Hit targets: all buttons ≥ 40px tall; experience rows ≥ 44px.

## Responsive rules

- ≥1280 and 1024: card stays 580px, centred.
- 768: same card; page padding 24px 16px.
- <640 (checked at 375): card fills width minus 32px. Padding drops from 28px to 18px. The company/school column stacks under the name. The banner chip moves to the top-right so it clears the avatar. The tooltip drops below the avatar instead of to its right. Years on experience rows are hidden.
- The body is `min-height: 100%` grid-centred, so opening rows or the composer makes the page scroll instead of clipping the top of the card.
- No horizontal scroll at any width.

## Acceptance checklist

### Always

- [ ] The open-to-work ring is an SVG stroke arc centred on the bottom of the avatar, with its label on a `textPath`, not an image.
- [ ] The ring lengthens symmetrically on hover and on keyboard focus.
- [ ] Connect cycles idle → pending → connected; pending can be withdrawn; connected is terminal.
- [ ] The degree badge and the connection count update on acceptance.
- [ ] Message toggles an inline composer with `aria-expanded`; focus moves into it on open and back on close; Escape closes it.
- [ ] Experience rows are independent disclosures with rotating chevrons.
- [ ] One accent colour, used only for the job-seeking state and the current-role dot.
- [ ] All buttons ≥ 40px tall; focus ring visible on every control.
- [ ] A polite live region announces every state change.
- [ ] No horizontal overflow at 375px.

### This demo

- [ ] Name "Ama Mensah", pronouns "she/her", badge "2nd" → "1st".
- [ ] Headline "Infrastructure engineer keeping power-grid telemetry honest at 40,000 meters a second."
- [ ] "812 connections" → "813 connections" after 2400ms in Pending.
- [ ] Roles: Hearthline Energy (2022 – now, open), Kessock Rail (2019 – 2022), Ossory Water (2016 – 2019).
- [ ] Ring stroke `#d4511b`, 9 units wide, r=61 in a 132 viewBox.

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. First frame: card centred on a `#E3E6DF` page. Connect is a solid ink pill, the degree badge reads "2nd", the first experience row (Hearthline Energy) is expanded, the other two are collapsed.
2. Hovering or focusing the avatar lengthens the orange arc from 240 to 272 units (it grows from both ends) over 500ms and shows a dark tooltip to the right: "Open to work — Visible to all Plyline members. Seeking staff platform and infrastructure lead roles."
3. Clicking Connect turns it into an outlined "Pending" pill. A polite live region says "Invitation sent to Ama Mensah."
4. While Pending, clicking it again withdraws the invite: back to "Connect", live region says "Invitation withdrawn."
5. If not withdrawn, after 2400ms the invite is accepted: the button becomes a solid green "Connected" pill, the degree badge flips to a green "1st", and "812 connections" becomes "813 connections". The live region announces the acceptance. Connected is a terminal state; clicking it does nothing.
6. Clicking Message toggles an inline composer under the actions. It opens by animating `grid-template-rows` 0fr → 1fr over 320ms, then focuses the textarea with the caret at the end of the prefilled text.
7. In the composer, Send (or Enter on the button) closes it, returns focus to Message, relabels Message to "Sent" for 1800ms, and announces "Message sent to Ama Mensah." An empty message does not send. Escape closes the composer and returns focus to Message.
8. Each experience row is a disclosure button. Clicking toggles its description open/closed (300ms row-height animation) and rotates the chevron 180°. Rows are independent; several can be open.
9. The "812 connections" link is inert in the demo (prevents navigation).

## Tokens

```css
:root {
  /* colour */
  --bg: #e3e6df;          /* page, sage-grey */
  --card: #fbfbf7;        /* card surface */
  --ink: #17201b;         /* text, primary button */
  --ink-2: #46514b;       /* secondary text */
  --ink-3: #5f6a64;       /* meta, timeline dots */
  --line: #d6dbd2;        /* hairlines, badge border */
  --soft: #eef1ea;        /* hover wash */
  --accent: #d4511b;      /* open-to-work ring, current-role dot, focus */
  --accent-soft: #fbe6dc; /* open-to-work panel */
  --ok: #2d6a4a;          /* connected state, 1st badge */
  --banner: linear-gradient(120deg, #c9d3c4, #aebfb0 55%, #97ab9b);

  /* type */
  --serif: "Spectral", Georgia, serif;
  --sans: "Albert Sans", system-ui, sans-serif;

  /* space (4 base) */
  --s1: 4px; --s2: 8px; --s3: 12px; --s4: 16px; --s5: 20px; --s7: 28px;

  /* shape */
  --r: 10px;              /* panels, composer */
  --r-card: 14px;
  --r-pill: 999px;
  --shadow-card: 0 1px 0 rgba(23,32,27,.04), 0 24px 48px -32px rgba(23,32,27,.35);

  /* motion */
  --ease: cubic-bezier(.2,.7,.2,1);
  --expo: cubic-bezier(.16,1,.3,1);
  --t-micro: 160ms;
  --t-layout: 320ms;
  --t-ring: 500ms;
}
```

## Typography

| Role | Family | Size / line-height | Weight | Tracking | Notes |
| --- | --- | --- | --- | --- | --- |
| Name | Spectral | 28px / 1.1 | 600 | -0.01em | `--ink` |
| Pronouns | Albert Sans | 13px | 500 | 0 | `--ink-3`, 6px left margin |
| Degree badge | Albert Sans | 11px | 600 | 0 | 1px border, radius 4 |
| Headline | Spectral italic | 17px / 1.35 | 500 | 0 | max-width 440px |
| Meta | Albert Sans | 13px | 400 | 0 | count link 600 with 1px underline in `--line` |
| Button | Albert Sans | 14px | 600 | 0 | 40px tall pills |
| Section label | Albert Sans | 12px | 600 | 0.1em | uppercase, `--ink-3` |
| Role title | Albert Sans | 14px | 600 | 0 | |
| Role meta / years | Albert Sans | 12.5px / 12px | 400 | 0 | years use `tabular-nums` |
| Ring text | Albert Sans | 9.5px | 700 | 0.16em | white on orange stroke |
| Body copy | Albert Sans | 13px / 1.45 | 400 | 0 | |

The serif is only for the person (name and headline). Every control is the sans.

## Implementation notes

**The ring.** A circle's stroke starts at 3 o'clock and runs clockwise. Circumference at r=61 is ≈383. To centre a 240-unit dash on 6 o'clock (96 units along), start it at 96 − 120 = −24, so `stroke-dashoffset: 24`. To grow by 32 symmetrically, add 32 to the dash and 16 to the offset.

```html
<svg class="ring" viewBox="0 0 132 132" aria-hidden="true">
  <defs><path id="arc" d="M18 66a48 48 0 0 0 96 0"/></defs>
  <circle cx="66" cy="66" r="61"/>
  <text><textPath href="#arc" startOffset="50%" text-anchor="middle">OPEN TO WORK</textPath></text>
</svg>
```

```css
.ring circle { fill: none; stroke: var(--accent); stroke-width: 9;
  stroke-dasharray: 240 400; stroke-dashoffset: 24;
  transition: stroke-dasharray .5s var(--expo), stroke-dashoffset .5s var(--expo); }
.avatar-wrap:hover .ring circle,
.avatar-wrap:focus-within .ring circle { stroke-dasharray: 272 400; stroke-dashoffset: 40; }
```

The text path is a lower half-circle of radius 48 (inside the r=61 stroke) drawn left to right, so the words read upright along the bottom.

**Connect state machine.** Keep the state in `data-state` and style from it. Clear the accept timer on every click, or a fast withdraw-then-reconnect fires two acceptances.

```js
let timer;
connect.addEventListener('click', () => {
  clearTimeout(timer);
  if (connect.dataset.state === 'idle') {
    setState('pending');
    timer = setTimeout(() => setState('connected'), 2400);
  } else if (connect.dataset.state === 'pending') {
    setState('idle');
  }
});
```

**Height animations without measuring.** Wrap collapsible content in a one-row grid and animate the track; the child needs `overflow: hidden`.

```css
.detail { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .3s var(--expo); }
.detail.open { grid-template-rows: 1fr; }
.detail > div { overflow: hidden; }
```

Common mistakes:

- Using the orange for the Connect button too. Connect is ink; orange means "this person is looking".
- A full 360° ring. The gap at the top is what makes it read as a badge.
- Leaving composer controls tabbable while collapsed. Set `tabindex=-1` on them when closed.
- Centering the body with `height: 100%` grid: the top of a tall card becomes unreachable. Use `min-height`.
- Logos as real company marks. Use monogram squares.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
