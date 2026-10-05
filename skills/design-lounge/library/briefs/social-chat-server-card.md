<!-- Design Lounge Nº 253 · "Gamer community chat card" · www.designlounge.live -->

# Gamer community chat card

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

> Read down to "Optional below this line". Your locked theme, pairing, and family replace this demo's colours and fonts. The Look fails in practice.md and the label limit beat this brief: drop any scroll cue, numbered eyebrow, or extra label it draws. The demo's names, prices, and sentences belong to the demo. Write this product's facts in short sentences.

## What it is

A compact, working snapshot of a community server on "Bivouac", an invented voice-and-text chat app. Use it as a landing-page embed ("see what's happening inside") or an invite preview. The server is "Lowlight Collective", a speedrunning crew. The look is gamer without the clichés: violet-black surfaces, a single acid-lime accent (`#C6F36B`) that means "live" (current channel, online dot, MOD tag, unread badge, send button), a squared techno display face (Chakra Petch) for labels and headings, and a friendly round sans (Rubik) for chat text. The banner has a hairline diagonal hatch, CRT scanlines and an outlined ghost monogram. There is no glow, no RGB gradient and no glitch effect. The detail worth copying is that the room feels inhabited. Four scripted messages arrive one by one after a typing indicator, and if you are in another channel they pile up as an unread badge on #general instead.

## Structure

```
page 1280 × 800, #0D0B12 + 40px lime grid at 3% ; card 940 × 580, radius 14, centred
┌──────────────┬───────────────────────────────────────────┬──────────────┐
│ BANNER 132   │ # general │ Hang out, ask for help, …     │ ONLINE — 6   │ header 52
│ ■ BIVOUAC·LIVE         LLC│───────────────────────────────│ [V] vexa     │
│ LOWLIGHT     │                                           │     Moderating│
│ COLLECTIVE   │                      (log, bottom-aligned)│ [K] kaito     │
│ 2,431 · 318 online       │ [V] vexa [MOD] Today at 21:02  │ [R] rue.exe   │
│──────────────│     Reminder: relay sign-ups close …      │ [P] pim_o ●   │
│ TEXT         │ [P] pim_o  Today at 21:09                 │ [B] Brannoch ●│
│ # announce…  │     anyone got the 4-2 ledge skip …       │ [I] Ivo Sand  │
│▌# general  ② │ [K] kaito  Today at 21:11                 │ OFFLINE — 2   │
│•# routes-and…│     buffer the dash on the second ledge…  │ [M] mothlamp  │
│ # clips      │ ••• pim_o is typing                  22px │ [T] Tamsin    │
│ VOICE        │ ┌───────────────────────────────────[→]┐  │              │
│ ) Practice…  │ │ Message #general                     │  │              │
│   R B I      │ └──────────────────────────────────────┘  │              │
└──────────────┴───────────────────────────────────────────┴──────────────┘
   256px                    flexible                            208px
```

- `section.card` labelled by the server `h1`. Grid: `256px minmax(0,1fr) 208px`.
- Left `aside.side`: banner `div` (decorative tag, ghost monogram, `h1`, member line), then `nav aria-label="Channels"` of `button.chan` with `aria-current="true"` on the open one. Group labels are decorative. Voice lobby is a `role="note"` with a full text label.
- Middle `.main`: `header` (`h2` channel name + topic), `div role="log" aria-live="polite"` for messages, a decorative typing row, and a `form` with a labelled input and a send button.
- Right `aside aria-label="Members"`: two `h3` groups and `ul`s. Each presence dot is a pseudo-element plus a visually hidden status word.
- Each message is an `article`: 36px avatar, meta row (name, optional role tag, `time`), text `p`, optional clip block.

## Motion

| Thing | Trigger | Property | From → to | Duration / timing | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Live tag square | always | opacity | 1 ↔ .25 | 2.4s, steps(1) | stepped | static |
| Speaking ring | always | ring alpha | 1 → .15 → 1 | 1.8s loop | `--ease` | static ring |
| Typing row | script | opacity | 0 ↔ 1 | 200ms | `--ease` | instant |
| Typing dots | while visible | translateY, opacity | 0/.5 → −3px/1 | 1.1s, stagger 150ms | `--ease` | static |
| New message | arrival | opacity, translateY | 0, 10px → 1, 0 | 420ms | `--expo` | instant |
| Unread badge | count > 0 | scale | 0 → 1 | 250ms | `--expo` | instant |
| Channel hover | hover | background | → `--hover` | 140ms | `--ease` | instant |
| Send press | :active | scale | 1 → .92 | 120ms | `--ease` | none |

Script timing: first typing at 1400ms. Each message is typing for 1700ms, then a 1500ms pause before the next author types. Four messages in total, then silence until Replay.

## States

- Channel: resting ink-3. Hover `--hover` bg + ink-2. Unread is ink, weight 500, with a 4 × 8px white pip at the left edge. Current is `--raise` bg, ink, and a 4px lime bar on the left edge (inset 8px top and bottom).
- Badge hidden at 0 (scale 0), visible with the count.
- Presence: online lime, idle amber, do-not-disturb coral, offline ink-3 with the avatar at 40%.
- Composer: focus-within gives a 1px lime border at 45%. Disabled (read-only channel) shows the permission placeholder.
- Send: disabled at 30% opacity until there is text.
- Focus-visible: 2px lime outline, offset 2px.
- Empty channel: show "No messages yet. Say hi." centred in ink-3. Not used in this demo.

## Accessibility

- The log is `role="log"` with `aria-live="polite"`, so live and sent messages are read. Set it to `aria-live="off"` while swapping channels so the whole history isn't re-announced, and restore it on the next frame.
- The typing row is `aria-hidden`. Announcing "is typing" every few seconds is noise.
- Channels are buttons with `aria-current="true"` on the open one. The unread badge is `aria-hidden`. Expose unread as text in production ("general, 2 unread").
- Presence dots have a visually hidden status word in each member row.
- The composer input has a visually hidden label "Message". Send has `aria-label="Send"`.
- Escape user text before inserting it as HTML.
- Contrast: `#aaa3ba` on `#1b1724` ≈ 7:1. `#8a8299` ≈ 4.7:1. `#141a05` on lime ≈ 15:1.
- Targets: channel rows 34px, send 34px inside a 44px composer, replay 32px. On touch use 40px rows.

## Responsive rules

- ≥1024: three columns, card 940 × 580 (height capped at viewport − 48px).
- <980: the members column hides and the left column is 232px.
- <640: single column. The banner shrinks to 96px, channels become a horizontally scrolling row of chips (group labels and voice hidden), the header topic hides, the card fills the viewport height, and Replay moves to the top-right above the card.
- Use `minmax(0,1fr)` for flexible tracks so the channel strip and long messages cannot widen the page.

## Acceptance checklist

### Always

- [ ] One accent colour, and it always means live or current. No second neon.
- [ ] Three columns: channels, messages, members. Members hide below 980px.
- [ ] The current channel shows a lime left bar, and unread channels a white pip in bold.
- [ ] Live messages are preceded by a typing indicator for about 1.7s and rise in.
- [ ] Messages arriving while another channel is open increment an unread badge.
- [ ] Opening a channel clears its unread state and shows its full history.
- [ ] The composer sends on Enter and is disabled with a reason in read-only channels.
- [ ] Presence uses four states (online, idle, do not disturb, offline) with text alternatives.
- [ ] The log is a polite live region, muted during channel swaps.
- [ ] There is a Replay control to rerun the live script.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Server "Lowlight Collective", "2,431 members · 318 online", tag "BIVOUAC · LIVE".
- [ ] Channels: announcements, general, routes-and-splits (unread), clips, and a voice lobby "Practice lobby" with rue.exe (speaking), Brannoch, Ivo Sand.
- [ ] Members online: vexa, kaito, rue.exe, pim_o (idle), Brannoch (dnd), Ivo Sand. Offline: mothlamp, Tamsin.
- [ ] Four live lines ending with vexa "pinned. nice find, that goes in the route doc".

---

**Optional below this line.** Open it when you build the motion, get stuck, or want the demo's exact paint.

## Reference behaviour

1. Initial state: #general open with three messages (vexa MOD 21:02, pim_o 21:09, kaito 21:11), bottom-aligned in the log. #routes-and-splits is unread (bold, white pip on the left edge). The "BIVOUAC · LIVE" square blinks at 2.4s steps. rue.exe's avatar in the voice lobby pulses a lime ring (1.8s) to show speaking.
2. At 1.4s the typing row fades in: three bouncing dots + "**pim_o** is typing". After 1.7s it fades out and pim_o's message rises in (opacity 0 → 1, translateY 10px → 0, 420ms expo). The next author starts typing 1.5s later. Sequence: pim_o "wait. the SECOND ledge?", rue.exe "clip or it didn't happen", kaito "posting it in #clips now" with a clip attachment, vexa "pinned. nice find, that goes in the route doc". Timestamps continue 21:14, 21:15, 21:16, …
3. Click another channel. The log swaps to that channel's messages, the header name and topic update, and the composer placeholder becomes "Message #clips". The lime current bar moves to it, and opening it clears its unread state.
4. While away from #general, each live message increments a lime pill badge on #general (scales in 0 → 1, 250ms expo) and marks it unread. Returning to #general clears the badge, and every message is there.
5. #announcements is read-only. The composer is disabled with the placeholder "You do not have permission to send messages here".
6. Type in the composer. The send button enables at the first non-space character. Enter or click posts your message as "you" (white avatar "Y") with the next timestamp, then clears the input.
7. REPLAY (fixed bottom-right, 32px) resets #general to its first three messages and replays the live sequence.
8. Reduced motion: no blink, pulse, dot bounce or rise-in. Messages still arrive on the same schedule and the typing row still toggles.

## Tokens

```css
:root {
  --bg: #0d0b12;          /* page */
  --card: #16131d;        /* message column */
  --side: #1b1724;        /* sidebars */
  --raise: #241f30;       /* current channel, composer */
  --hover: #2a2438;
  --ink: #ece8f4;
  --ink-2: #aaa3ba;
  --ink-3: #8a8299;
  --line: #2c2639;
  --accent: #c6f36b;      /* acid lime = live */
  --accent-ink: #141a05;  /* text on lime */
  --idle: #f0b545;
  --dnd: #f0606a;
  --disp: "Chakra Petch", system-ui, sans-serif;
  --body: "Rubik", system-ui, sans-serif;
  --r-card: 14px; --r-av: 10px; --r-chan: 6px; --r-comp: 10px;
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

Avatar fills (initials in `#0d0b12`): vexa `#c6f36b`, kaito `#8fe0d0`, rue.exe `#e7a6d8`, pim_o `#f1c27a`, Brannoch `#9ec8f0`, Ivo Sand `#b9a7f2`, offline `#d9d3e4` at 40%.

## Typography

| Role | Family | Size / line | Weight | Tracking | Case |
| --- | --- | --- | --- | --- | --- |
| Server name | Chakra Petch | 20 / 1.05 | 700 | 0.02em | uppercase |
| Banner tag | Chakra Petch | 10px | 600 | 0.18em | uppercase, lime |
| Ghost monogram | Chakra Petch | 56px | 700 | −0.02em | outlined, 1px lime at 22% |
| Group labels | Chakra Petch | 11px | 600 | 0.14em | uppercase |
| Channel | Rubik | 14px | 400 (unread 500) | 0 | lowercase |
| Channel header | Chakra Petch | 16px | 600 | 0.01em | |
| Author | Rubik | 14px | 500 | 0 | |
| Role tag | Chakra Petch | 9.5px | 700 | 0.12em | uppercase, lime outline |
| Message | Rubik | 14 / 1.45 | 400 | 0 | `#d6d1e0` |
| Time, meta | Rubik | 11.5px | 400 | 0 | ink-3 |
| Badge | Chakra Petch | 11 / 18 | 700 | 0 | on lime |

## Implementation notes

Script the live sequence with a timer list so Replay can cancel it cleanly:

```js
function run() {
  timers.forEach(clearTimeout); timers = [];
  let t = 1400;
  LIVE.slice(liveIdx).forEach(([u, txt, clip]) => {
    timers.push(setTimeout(() => setTyping(true, u), t));
    t += 1700;
    timers.push(setTimeout(() => { setTyping(false); push('general', u, txt, clip); liveIdx++; }, t));
    t += 1500;
  });
}
```

`push` always appends to the channel's data. It renders only if that channel is open, and otherwise bumps the badge. Keep data and DOM separate so switching channels re-renders from data.

Bottom-align a short log without JS by giving the flex column a growing pseudo-element:

```css
.log { flex: 1; overflow: auto; display: flex; flex-direction: column; }
.log::before { content: ""; flex: 1; }
```

The current-channel bar and unread pip are both `::before` on the button, positioned at `left: -8px` so they sit flush with the sidebar edge despite the list padding.

Common mistakes:

- Neon glow (`box-shadow` blur) on text or borders. The lime is flat.
- An RGB gradient banner. The banner is a dark violet gradient with a hairline hatch and scanlines.
- Re-announcing the entire log on channel switch.
- Letting the horizontal channel strip push the card wider than the phone.
- Messages appearing forever. Four, then stop.

---

*From Design Lounge (https://www.designlounge.live). Free to use in your products. Credit line: Designed using Design Lounge.*
