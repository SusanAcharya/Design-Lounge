<!-- Design Lounge Nº 266 · "Incoming call banner" · designlounge.vercel.app -->

# Incoming call banner

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The incoming-call surface of a VoIP or calling app, shown while the user is inside another app. A call first arrives as a compact dark banner at the top of the screen. It has the caller, a ringing pulse, and two round buttons: decline and accept. Tapping the caller's name grows the same surface into a full-screen call screen. There the user can slide to answer, decline, decline with a quick text, or set a reminder. Answering turns it into an in-call screen with a ticking timer and six toggles. It can shrink to a pill and later end with a short "Call ended" banner. The language is iOS 26-ish: a smoked glass banner with a 30px radius, round buttons, and sheet easing. The editorial serif for the caller's name is the twist. The detail worth copying is that it is **one surface**. The banner does not hand off to a new screen. Its top, left, right, height and radius all transition to fill the frame, and the content layers cross-fade inside it.

## Reference behaviour

1. Behind it is a cream agenda app, "Daybook · Thursday" over "8 October" at 38px serif, with four agenda rows. The 11:00 row "Call Inés re: tile samples" has a terracotta dot.
2. 250ms after load, the banner slides down from `translateY(-150%)` to rest at top 54px, left and right 12px, height 78px, over 500ms with expo-out.
3. Banner content: a 50px terracotta avatar "IC" with two 1.5px rings pulsing out (scale 1 → 1.6, 2.4s, staggered 1.2s). Then "Inés Calderón" at 16px/600 over "mobile · ringing" at 13px. A 46px red decline button with the handset rotated 135°, and a 46px green accept button whose handset wiggles every 2.4s.
4. A polite live region says "Incoming call from Inés Calderón."
5. Tap Accept on the banner: it answers straight away, see step 11.
6. Tap Decline on the banner: the banner flies up and fades. 380ms later a toast appears under the agenda: "Declined. Inés hears busy." with a dark "Ring again" pill, and focus moves to it.
7. Tap the name area: the surface grows to full screen over 460ms (`cubic-bezier(.32,.72,0,1)`). The radius goes 30 → 0. The background becomes a radial warm-brown gradient. The app behind scales to 0.94 and dims to 60% brightness. The banner content fades out and the call screen fades in after 140ms.
8. Call screen, top to bottom:
   - A 44px round chevron button, "Back to banner".
   - "MOBILE · +34 612 48 09 31".
   - A 128px avatar with three rings pulsing out (scale 1 → 2.1, 3s, staggered 1s).
   - "Inés Calderón" in Gloock at 40px.
   - "Ringing · 0:07", ticking every second.
   - Two chips: "Remind me" and "Message".
   - A 76px slide-to-answer track with a 64px green knob and a shimmering "slide to answer" label.
   - A red text button, "Decline".
9. Drag the knob right. The label fades as you drag (opacity `1 − dx/max × 1.6`). Release past 85% of the track and the knob snaps to the end, then the call answers 140ms later. Release earlier and it springs back over 320ms.
10. On the focused knob, Enter, Space or ArrowRight answers. The drag is never the only way.
11. Answered: the in-call layer shows a 96px avatar, the name at 34px, and a green timer starting at "0:00" that ticks each second. Below is a 3×2 grid of 72px round toggles: Mute, Keypad, Speaker, Add call, Video, Hold. Each toggles `aria-pressed`, and pressed fills the circle cream with dark ink. Last is a 76px red end button. Focus goes to the minimise chevron.
12. Minimise: the surface shrinks to a 40px pill centred at the top (left and right 118px). It shows three tiny green equaliser bars and the timer. Tap the pill to grow back.
13. End: the surface shrinks to the banner. The sub line reads "Call ended · 0:14" and the buttons are hidden. 1.8s later it flies up and the toast reads "Call with Inés · 0:14".
14. Message chip: a reply sheet slides up inside the call screen over 360ms, with "Can't talk now. Call you at 1?", "In the studio. Text me the tile codes.", "On my way to you." and Cancel. Choosing one declines the call. The toast then reads "Sent: “On my way to you.”"
15. Remind me declines the call. The toast reads "Reminder set for 12:00."
16. Left ringing for 30 seconds: the full screen falls back to the banner. The sub line becomes "Missed call · 11:02" and a green "Call back" pill replaces the round buttons.
17. Escape closes the reply sheet, then shrinks the full screen to the banner, then minimises a live call.
18. "Ring again" replays from step 2.

## Structure

```
390 × 844 (Lounge draws status bar)
┌──────────────────────────────────────┐
│ (54px)                               │
│ ┌──────────────────────────────────┐ │ banner: top 54, inset 12, h 78, r 30
│ │(IC) Inés Calderón      (✕)  (✆) │ │ avatar 50 · buttons 46
│ │     mobile · ringing             │ │
│ └──────────────────────────────────┘ │
│ DAYBOOK · THURSDAY                   │ app, padding-top 150
│ 8 October                    38px    │
│ 09:30  Studio walkthrough            │
│ 11:00  Call Inés re: tile samples ●  │
│ ...                                  │
│ [ Call ended          (Ring again) ] │ toast, hidden until used
└──────────────────────────────────────┘

full state: same element, inset 0, r 0
┌──────────────────────────────────────┐
│ (54px)  (⌄)  MOBILE · +34 …          │ 44px row
│              ((( IC )))              │ 128 avatar, 40px from row
│            Inés Calderón             │ 40px serif
│           Ringing · 0:07             │
│                                      │ flex spacer
│       [◷ Remind me] [▭ Message]      │ 44px chips
│ [(✆)      slide to answer         ]  │ 76px track, max 330
│               Decline                │ 44px
│ (34px)                               │
└──────────────────────────────────────┘
```

- The agenda is a `main` with plain markup. It is `inert` while the call is full screen.
- The call is one `section`. Its role is `region` in banner and pill states and `dialog` with `aria-modal="true"` when full screen. A hidden `h2` labels it.
- Four absolutely positioned layers live inside: `.l-banner`, `.l-full`, `.l-live` and `.l-pill`. `data-state` on the section picks the visible one, and the others are `inert`.
- The name area in the banner is a `button` ("Open call screen"). The avatar is decoration.
- The knob is a `button` inside the track, with pointer events for drag.
- The reply sheet is a `div role="group"` inside the full layer. Its buttons are `tabindex=-1` until it opens.
- A separate visually hidden `p aria-live="polite"` handles announcements.

## Tokens

```css
:root {
  /* app behind */
  --app: #f2ede4;        /* agenda page */
  --app-2: #e8e0d3;      /* toast */
  --app-ink: #221d18;
  --app-ink-2: #5e554b;
  --app-line: #d6cbbb;

  /* call surface */
  --night: #120f0d;      /* full-screen base, pill */
  --night-2: #1d1915;
  --night-3: #2a241f;    /* reply sheet */
  --glass: rgba(29, 25, 21, .9);  /* banner fill, with blur(24px) saturate(1.4) */
  --text: #f4eee6;
  --text-2: #b9ada0;
  --text-3: #8d8276;

  /* roles */
  --accept: #3bd07f;
  --decline: #f0524a;
  --caller: #d9734e;     /* avatar, rings, gradient tint */
  --focus: #f6c48f;

  --serif: "Gloock", Georgia, serif;
  --sans: "Rethink Sans", system-ui, sans-serif;

  --r-banner: 30px;
  --r-pill: 20px;
  --banner-top: 54px;
  --banner-inset: 12px;
  --banner-h: 78px;

  --sheet: cubic-bezier(.32, .72, 0, 1);  /* surface resize, knob return, replies */
  --expo: cubic-bezier(.16, 1, .3, 1);    /* arrival */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --t-resize: 460ms;
  --t-arrive: 500ms;
  --t-fade: 220ms;
}
```

Full-screen background: `radial-gradient(120% 60% at 50% 22%, #4a2a1c 0%, var(--night-2) 55%, var(--night) 100%)`.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking |
| --- | --- | ---: | ---: | ---: | ---: |
| Caller name, full | Gloock | 40px | 400 | 1.05 | −0.01em |
| Caller name, in call | Gloock | 34px | 400 | 1.05 | −0.01em |
| Avatar initials, full | Gloock | 52px | 400 | 1 | 0 |
| Agenda date | Gloock | 38px | 400 | 1 | −0.01em |
| Banner name | Rethink Sans | 16px | 600 | 1.3 | 0 |
| Status / timer | Rethink Sans | 15px | 400 | 1.4 | 0, tabular |
| Banner sub | Rethink Sans | 13px | 400 | 1.3 | 0 |
| Number row | Rethink Sans | 13px | 500 | 1 | 0.04em, upper |
| Track label | Rethink Sans | 17px | 500 | 1 | 0 |
| Toggle label | Rethink Sans | 12px | 400 | 1.2 | 0 |

The serif is only for the person, never for controls. Timers use `font-variant-numeric: tabular-nums` so they do not jitter.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Banner | arrive | translateY | −150% → 0 | 500ms | `--expo` | 1ms |
| Banner | leave | translateY, opacity | 0 → −150%, 1 → 0 | 500 / 300ms | `--expo` | 1ms |
| Surface | banner ↔ full ↔ pill | top, left, right, height, radius | per state | 460ms | `--sheet` | 1ms |
| Layers | state change | opacity | 0 → 1 | 300ms, delay 140ms | `--ease` | no delay |
| App behind | full screen | scale, brightness | 1 → .94, 1 → .6 | 460ms | `--sheet` | 1ms |
| Banner rings | ringing | scale, opacity | 1 → 1.6, .7 → 0 | 2.4s loop, 2 rings 1.2s apart | `--ease` | removed |
| Full rings | ringing | scale, opacity | 1 → 2.1, .8 → 0 | 3s loop, 3 rings 1s apart | `--ease` | removed |
| Accept handset | ringing | rotate | 0 → −14° → 12° → −8° → 4° → 0 | in the last 30% of 2.4s | `--ease` | removed |
| Track label | idle | gradient position | 100% → −50% | 2.8s loop | linear | static muted text |
| Knob | release short | translateX | dx → 0 | 320ms | `--sheet` | 1ms |
| Reply sheet | open | translateY | 120% → 0 | 360ms | `--sheet` | 1ms |
| Pill bars | in call | scaleY | 1 → .35 | 1s alternate, 0.3s stagger | `--ease` | removed |
| Toast | after leave | opacity, translateY | 0 → 1, 8px → 0 | 240ms | `--ease` | 1ms |

Every loop stops once the call is answered, declined or missed. Nothing keeps pulsing on an idle screen.

## States

| State (`data-state`) | Surface | Visible layer | Notes |
| --- | --- | --- | --- |
| `banner` | top 54, inset 12, h 78, r 30, glass | banner, rings on | accept and decline shown |
| `full` | inset 0, h 100%, r 0, gradient | call screen | app inert, scaled and dimmed |
| `live` | as full | in-call | timer ticks, toggles |
| `pill` | inset 118, h 40, r 20, `--night` | pill | timer keeps ticking |
| `ended` | as banner | banner, no buttons, no rings | "Call ended · m:ss", leaves after 1.8s |
| `missed` | as banner | banner + "Call back" | rings off |
| gone | `translateY(-150%)`, opacity 0 | none | section `inert`, toast shown |

- Round button hover: brightness 1.08. Active: scale .92.
- Chip hover: fill rises from 8% to 13% white.
- Toggle pressed: circle `--text`, icon `--night`.
- Focus-visible: 2px `--focus` (#f6c48f) outline, 3px offset, everywhere.
- Knob active: `cursor: grabbing`.

## Accessibility

- Banner buttons are labelled "Decline call" and "Accept call", and the name button is "Open call screen". The icons are `aria-hidden`.
- The knob is labelled "Slide to answer. Press Enter to answer." Enter, Space and ArrowRight answer, so dragging is never required.
- In full and live states the section is a modal dialog and the agenda is `inert`. Only the visible layer is focusable, because the others get `inert`.
- Focus moves as follows: to the knob when the call screen opens, to the minimise chevron after answering, to the pill after minimising, to the first reply when replies open, and to "Ring again" after the call leaves.
- Escape steps back one level: replies, then full screen, then a live call minimises.
- The live region announces "Incoming call from Inés Calderón.", "Call connected with Inés Calderón.", "Missed call from Inés Calderón.", "Call ended. 0:14." and each toast message. It never announces the ticking seconds.
- Toggles use `aria-pressed`. Their visible text is the name.
- Hit targets: round buttons 46px, chips and Decline 44px, knob 64px, toggles 72px, end 76px, pill 40px tall and 154px wide.
- Contrast: `#f4eee6` on `#1d1915` is about 15:1, and `#b9ada0` on `#1d1915` is about 8:1. Dark ink `#06240f` on green and white on red pass for icons.

## Responsive rules

- 390 × 844: as specified.
- 360 wide: the banner keeps its 12px insets and the name ellipsises. The toggle grid drops to 72px columns with a 22px gap, and the name drops to 34px.
- Short phones (under 740 tall): the flex spacer above the chips absorbs it, and the avatar keeps its 40px top margin.
- Tablet: keep the banner at 400px wide, centred at the top. The full state becomes a 420 × 760 centred card over a dim, not a full-bleed takeover.
- Do not draw a status bar. The 54px top is clearance.

## Acceptance checklist

### Always

- [ ] One element moves between banner, full screen, pill and back. Its geometry transitions rather than swapping components.
- [ ] Accept and decline exist on the compact banner, so answering does not require expanding.
- [ ] Slide to answer works by drag (85% threshold) and by keyboard (Enter, Space, ArrowRight).
- [ ] A short drag springs back. It never answers by accident.
- [ ] Decline-with-message and a reminder are offered next to decline.
- [ ] The in-call timer ticks in tabular figures and keeps ticking in the pill.
- [ ] An unanswered call becomes a missed-call banner with Call back.
- [ ] Ringing pulses stop when ringing stops. Reduced motion removes all loops.
- [ ] Full screen is a modal dialog, the app behind is inert, and Escape steps back.
- [ ] Hit targets are at least 44px, and the end button is 76px.

### This demo

- [ ] Caller "Inés Calderón", "mobile", "+34 612 48 09 31", initials "IC" on `#d9734e`.
- [ ] Banner at top 54px, 12px insets, 78px tall, 30px radius, `rgba(29,25,21,.9)` with a 24px blur.
- [ ] Name in Gloock 40px on the call screen and Rethink Sans 16px/600 in the banner.
- [ ] Accept `#3bd07f`, decline `#f0524a`.
- [ ] Missed after 30s of ringing, "Missed call · 11:02".
- [ ] Toasts read "Declined. Inés hears busy.", "Reminder set for 12:00." and "Call with Inés · 0:14".

## Implementation notes

**Morph one box, cross-fade its layers.** Transition the geometry on the container and keep each layout in its own absolutely positioned layer. Delay the incoming layer by about 140ms so the old content is gone before the box finishes growing.

```css
.call { position: absolute; top: 54px; left: 12px; right: 12px; height: 78px; border-radius: 30px;
  overflow: hidden; transition: top .46s var(--sheet), left .46s var(--sheet), right .46s var(--sheet),
  height .46s var(--sheet), border-radius .46s var(--sheet), background .46s var(--ease); }
.call[data-state="full"], .call[data-state="live"] { top: 0; left: 0; right: 0; height: 100%; border-radius: 0; }
.call[data-state="pill"] { left: 118px; right: 118px; height: 40px; border-radius: 20px; }
.layer { position: absolute; inset: 0; opacity: 0; visibility: hidden;
  transition: opacity .22s var(--ease), visibility 0s .22s; }
.call[data-state="full"] .l-full { opacity: 1; visibility: visible;
  transition: opacity .3s var(--ease) .14s, visibility 0s; }
```

Set `inert` on every hidden layer each time the state changes. Opacity alone leaves invisible buttons in the tab order.

**Slide to answer with pointer capture, plus a keyboard path.**

```js
let x0 = 0, dx = 0, drag = false;
const max = () => track.clientWidth - knob.offsetWidth - 12;
knob.addEventListener('pointerdown', e => { drag = true; x0 = e.clientX; knob.classList.remove('back'); knob.setPointerCapture(e.pointerId); });
knob.addEventListener('pointermove', e => { if (!drag) return;
  dx = Math.max(0, Math.min(max(), e.clientX - x0)); knob.style.transform = `translateX(${dx}px)`; });
knob.addEventListener('pointerup', () => { drag = false;
  if (dx > max() * .85) { knob.style.transform = `translateX(${max()}px)`; setTimeout(answer, 140); }
  else { knob.classList.add('back'); knob.style.transform = ''; } dx = 0; });
knob.addEventListener('click', e => { if (e.detail === 0) answer(); });   // Enter / Space
knob.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); answer(); } });
```

Put `touch-action: none` on the knob or the page will scroll instead of dragging. `.back` adds the 320ms return transition. Leave it off while dragging so the knob follows the finger 1:1.

**Real calls.** On iOS and Android the system draws the call UI (CallKit, ConnectionService). Build this for in-app calling on the web, or for the in-app view after the system hands over. Drive it from your signalling events: `ringing`, `answered`, `ended`, `missed`. Do not drive it from timers, except the 30s missed fallback.

Common mistakes:

- Navigating to a separate call route on expand, which loses the continuity.
- A swipe-only answer with no button or key.
- Leaving the ring pulses running after the call is answered.
- Putting the caller's name in the sans. The serif carries the person.
- A green and a red button of different sizes. Both are 46px in the banner.
- Forgetting `inert` on the app behind, so Tab walks into the agenda under a full-screen call.
- Drawing a fake status bar above the banner.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
