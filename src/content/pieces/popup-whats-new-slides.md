---
title: "What's new slides modal"
summary: "A 580px What's new modal with three slides of drawn product scenes, pill dots, previous and next, Remind me later, and arrow-key paging."
platform: web
type: component
category: overlays
tags: [modal, carousel, announcement, onboarding, calendar]
styles: [dark, minimal]
motion: subtle
difficulty: 2
featured: false
published: 2026-10-28
palette: ["#10131a", "#181c25", "#eef1f6", "#9ad0ff", "#343b4a"]
fonts: ["Sora", "Literata"]
related: [popup-onboarding-tour]
---

# What's new slides modal

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

The release-notes modal of Daybook, a calendar app, shown once after an update. Three slides, each a 288px drawn scene of the actual feature (a day column with a hatched travel block and a route map; three people's busy bars with the common free slot outlined; a focus-hour week with a counter-offered invite) above a Sora headline and a Literata paragraph. Pill dots, Previous and Next, "Remind me later", and the arrow keys move through them. The scenes are small working screens built from divs, not icons or stock art, and their parts rise in with a 120ms stagger each time a slide arrives. That stagger is the detail worth copying: the feature explains itself in under a second.

## Reference behaviour

1. Initial state: open over the dimmed week view (scrim `rgba(6,8,12,.7)`), slide 1 "Travel time, blocked for you". The first dot is a 22 × 8px accent pill, the others 8 × 8px. Previous is disabled. Focus is on the dialog itself, so the arrow keys work at once with no focus ring showing.
2. Next, ArrowRight, or clicking a dot moves the track by 100% per slide over 480ms. ArrowLeft and Previous go back. Home and End jump to the first and last slide. Paging stops at both ends; it does not wrap.
3. When a slide becomes current, its scene parts (class `.a`) go from opacity 0, translateY(10px) to rest over 640ms, delayed 0, 120, 240 and 360ms. On slide 1 the hatched "22 min travel" block also grows from scaleY(.2) from its top edge, starting at 300ms.
4. On the last slide Next reads "Got it" and closes.
5. "Remind me later" closes and shows a toast at the bottom: "We will show this again tomorrow morning." It hides after 3200ms.
6. The close button, Escape and "Got it" close without the toast. Focus returns to the "What's new" pill in the top bar (with a 7px accent dot), which reopens at slide 1.
7. Only the current slide is reachable: the others are `inert`, so Tab never lands on hidden content.

## Structure

```
1280 × 800
┌───────────────────────────────────────────────────────────────────────┐
│ Daybook  26 to 30 October                              (• What's new) │ 60
├────┬──────────┬──────────┬──────────┬──────────┬──────────────────────┤
│ 09 │ Mon 26   │ Tue 27   ┌──────────── dialog 580 ──────────┐ Fri 30 │
│ 10 │ [event]  │ [event]  │                              (x) │ [event]│
│ 11 │          │          │   ┌ day column ┐  ┌ map ┐        │        │
│ 12 │ [event]  │          │   │ 09 review  │  │ ●   │  art   │        │
│ 13 │          │          │   │ ▨ travel   │  │  ╲  │  288px │        │
│ 14 │          │          │   │ 11 lunch   │  │   ● │        │        │
│ 15 │          │          │   └────────────┘  └─────┘        │        │
│ 16 │          │          ├──────────────────────────────────┤        │
│    │          │          │ New in Daybook this October      │        │
│    │          │          │ Travel time, blocked for you 24px│        │
│    │          │          │ Literata paragraph, 50ch         │        │
│    │          │          │ ━ • •      Remind me later [<][Next]      │
│    │          │          └──────────────────────────────────┘        │
└────┴──────────┴──────────┴──────────┴──────────┴──────────────────────┘
```

- `<header class="top">` and a decorative `.cal` week grid (`aria-hidden`), 72px per hour.
- `<dialog tabindex="-1" aria-labelledby="h0">` opened with `showModal()`; `aria-labelledby` is updated to the current slide's heading.
  - `.x` close button, absolutely positioned top right on a `rgba(16,19,26,.72)` disc so it reads over the art.
  - `.vp` (overflow hidden) > `.track` (flex, transformed) > three `<section class="slide" role="group" aria-roledescription="slide" aria-label="1 of 3">`.
    - `.art` (`aria-hidden`, 288px, `radial-gradient(90% 120% at 50% 0, #232a3a, #141821 70%)`) holding `.mini` cards: 14px radius, `--line-2` border, `0 20px 40px -18px rgba(0,0,0,.7)`.
    - `.txt`: kicker, `<h2>`, `<p class="b">`. Min height 150px so the footer does not move between slides.
  - `.ft`: `.dots` (three 28px buttons each holding an `<i>` pill), Remind me later (ghost), Previous (42px icon button), Next (primary).

## Tokens

```css
:root {
  /* night ink */
  --bg: #10131a;          /* app */
  --panel: #181c25;       /* dialog, scene cards */
  --raise: #1f2430;       /* events, hover */
  --well: #141821;        /* art ground, bars */
  --line: #2a303d;
  --line-2: #3a4252;      /* card borders, idle dots */
  --edge: #77819a;        /* outline buttons, 4.38:1 on panel */
  --ink: #eef1f6;         /* 15.06:1 */
  --ink-2: #b3bac8;       /* 8.75:1, paragraphs */
  --ink-3: #8b93a5;       /* 5.53:1, labels */
  /* one accent, sky */
  --accent: #9ad0ff;      /* 10.43:1 as text */
  --accent-ink: #0c1a2a;  /* 10.73:1 on accent */
  --accent-soft: rgba(154,208,255,.14);
  --accent-line: rgba(154,208,255,.45);
  --busy: #343b4a;        /* busy segments */
  --scrim: rgba(6,8,12,.7);
  /* type */
  --sans: "Sora", system-ui, sans-serif;
  --serif: "Literata", Georgia, serif;
  /* size */
  --w: 580px;
  --art-h: 288px;         /* 236px on phones */
  --r: 22px;
  --r-ctl: 12px;
  --h-ctl: 42px;
  --shadow: 0 1px 0 rgba(255,255,255,.05) inset, 0 48px 96px -32px rgba(0,0,0,.8);
  /* motion */
  --t-micro: 160ms;
  --t-open: 360ms;
  --t-slide: 480ms;
  --t-art: 640ms;
  --ease: cubic-bezier(.2,.7,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
  --ease-sheet: cubic-bezier(.32,.72,0,1);
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| Slide headline | Sora | 24px (21px phone) | 600 | 1.2 | -0.025em | sentence |
| Kicker | Sora | 12px | 600 | 1.4 | 0.02em | sentence |
| Paragraph | Literata (opsz auto) | 16px (15px phone) | 400 | 1.6 | 0 | sentence, max 50ch |
| Buttons | Sora | 14px | 600 | 1 | 0 | sentence |
| Scene event title | Sora | 11.5px | 600 | 1.3 | 0 | sentence |
| Scene labels | Sora | 10.5px | 400–700 | 1.3 | 0 | sentence |
| App wordmark | Sora | 17px | 700 | 1 | -0.02em | title |

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Delay |
|---|---|---|---|---:|---|---|
| dialog | open | opacity, translateY, scale | 0, 12px, .98 → 1, 0, 1 | 360ms | `--ease` / `--ease-out` | 0 |
| backdrop | open | background | transparent → scrim | 360ms | `--ease` | 0 |
| `.track` | page | translateX | -100% × index | 480ms | `--ease-out` | 0 |
| scene parts `.a` | slide becomes current | opacity, translateY | 0, 10px → 1, 0 | 640ms | `--ease-out` | 0 / 120 / 240 / 360ms |
| travel block | slide 1 current | scaleY (top origin), opacity | .2, 0 → 1, 1 | 640ms | `--ease-out` | 300ms |
| active dot | page | width, background | 8px grey → 22px accent | 480ms / 160ms | `--ease-out` / `--ease` | 0 |
| toast | Remind me later | opacity, translateY | 0, 12px → 1, 0 | 360ms | `--ease-out` | 0 |
| sheet (< 640px) | open | translateY | 100% → 0 | 360ms | `--ease-sheet` | 0 |

Reduced motion: every duration and delay drops to 1ms, the grow animation is removed; scenes appear complete and the track jumps.

## States

- **Dot:** idle 8 × 8px `--line-2`; current 22 × 8px `--accent` with `aria-current="true"`. The button around it is 28 × 28px.
- **Previous:** disabled (opacity .35) on slide 1. Hover fills `--raise`.
- **Next:** accent fill, hover `#b3dcff`; label "Next", then "Got it" on slide 3.
- **Remind me later:** ghost, `--ink-2` text, hover `--raise`.
- **Close:** 36px dark disc, hover `--line-2`.
- **Focus-visible:** 2px `--accent` outline, 2px offset, on every control. The dialog itself takes focus on open with no outline.
- **Inactive slides:** `inert`, their scene parts at opacity 0 until they become current.

## Accessibility

- `showModal()` traps focus; Escape closes; focus returns to "What's new".
- Each slide is `role="group" aria-roledescription="slide" aria-label="n of 3"`; the dialog's accessible name follows the current headline.
- Arrow keys, Home and End page while focus is anywhere in the dialog. Dots are real buttons labelled "Slide 2, shared free time".
- Scenes are `aria-hidden`; the paragraph says everything the drawing shows.
- Inactive slides are `inert`, so screen readers and Tab only meet the current one.
- The toast is `role="status"`.
- Contrast: all text passes 4.5:1 (figures in Tokens). Outline buttons use `--edge` at 4.38:1 on the panel.
- Targets: 42px buttons, 36px close, 28px dots (raise to 44px if your product targets touch first).

## Responsive rules

- ≥ 1280: as specified, 580px centred.
- 1024 and 768: unchanged. The week grid behind drops to 3 days below 900px.
- < 640: bottom sheet, full width, radius `22px 22px 0 0`, top border only, scrolls inside. Art 236px with each scene scaled to .74. Text padding 20px 16px. The dots take their own centred row above the buttons; Remind me later sits left, Previous and Next right. The week grid shows 2 days.

## Acceptance checklist

**Always**

- [ ] Three slides in one track; only the current slide is reachable by Tab (`inert` on the rest).
- [ ] Next, Previous, dots, ArrowLeft, ArrowRight, Home and End all page; paging does not wrap.
- [ ] Previous is disabled on the first slide; the last slide's primary closes.
- [ ] The active dot is a 22px pill and carries `aria-current`.
- [ ] Each scene is drawn UI of the feature, and its parts stagger in by 120ms when the slide arrives.
- [ ] Text block height is fixed so the footer never moves between slides.
- [ ] "Remind me later" closes and says when it will come back.
- [ ] Below 640px it is a full-width bottom sheet with no sideways scroll at 390px.
- [ ] Reduced motion shows finished scenes with no movement.

**This demo**

- [ ] Slide titles: "Travel time, blocked for you", "See when everyone is free", "Focus hours that hold".
- [ ] Slide 1 shows a hatched "22 min travel" block between Design review (Hollis St, 09:15) and Lunch with Ama (Riverside, 10:45), and a dashed route between two pins.
- [ ] Slide 2 outlines a slot at 60% of the 08:00 to 18:00 axis tagged "Thu 14:00, all 3 free".
- [ ] Slide 3 shows an invite "Requested Thu 11:00" struck through with "Offered 13:30 instead".

## Implementation notes

**A track plus `inert`, not display toggling.** Keep every slide laid out so the transform can animate, and make the off-screen ones unreachable.

```js
function go(n) {
  i = Math.max(0, Math.min(N - 1, n));
  track.style.transform = `translateX(${-100 * i}%)`;
  slides.forEach((s, k) => { s.classList.toggle('on', k === i); s.inert = k !== i; });
  dots.forEach((d, k) => d.setAttribute('aria-current', k === i));
  prev.disabled = i === 0;
  next.textContent = i === N - 1 ? 'Got it' : 'Next';
}
```

**Stagger with transition delays that only apply on arrival.** Put the delays on the `.on` state so leaving is immediate and arriving is choreographed.

```css
.slide .a { opacity: 0; transform: translateY(10px);
  transition: opacity 640ms var(--ease-out), transform 640ms var(--ease-out); }
.slide.on .a { opacity: 1; transform: none; }
.slide.on .a.d1 { transition-delay: 120ms; }
.slide.on .a.d2 { transition-delay: 240ms; }
.slide.on .a.d3 { transition-delay: 360ms; }
```

**Keys on the dialog, focus on the dialog.** Give the dialog `tabindex="-1"` and focus it on open so arrows work immediately without a ring on a button the user did not choose.

```js
dlg.addEventListener('keydown', (e) => {
  const map = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: N - 1 };
  if (e.key in map) { e.preventDefault(); go(map[e.key]); }
});
```

Common mistakes: autoplaying the slides; icons in circles instead of drawings of the feature; a "Don't show again" checkbox that hides the only way back (keep the top-bar entry); letting slide heights differ so the buttons jump; wrapping from slide 3 to slide 1, which reads as a bug.
