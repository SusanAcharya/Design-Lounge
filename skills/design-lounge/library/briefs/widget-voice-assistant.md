<!-- Design Lounge Nº 272 · "Hold-to-talk voice orb" · designlounge.vercel.app -->

# Hold-to-talk voice orb

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them.

## What it is

A voice assistant widget for a fictional assistant, "Ossa". A pale sage card holds a 168px pearl-teal orb wrapped in a ring of 56 short radial bars. Press and hold the orb (or hold Space) and it starts "listening": the bars turn coral and jump with each word, the orb swells with the amplitude, a coral glow rises from its base, and your words appear one at a time in a large italic serif with a blinking caret. Let go and the orb thinks for 900ms, then Ossa answers word by word in a grotesk, and a small result chip slides in. The feeling is calm and near-future, without purple gradients or glass. The detail worth copying: one smoothed amplitude value drives the bar lengths and the orb scale, and every word that appears "kicks" that value, so the waveform visibly reacts to speech.

## Reference behaviour

1. First frame: idle, chip "READY". A previous exchange is already shown: "Remind me to water the tulsi plant tomorrow at seven", the reply "Done. Tomorrow at 7:00 am I'll remind you to water the tulsi plant.", and the chip "Reminder · Sun 4 Oct, 7:00". Its words fade up on load (60ms stagger for the question, 40ms for the reply after 600ms). The orb breathes between 0.97 and 1.02 scale over 4.8s. The bars sit at about 4px, teal, 55% opacity.
2. Pointer down on the orb (mouse, touch, pen) or Space/Enter keydown while it has focus: state becomes listening. Chip "LISTENING" in coral tint. The transcript and reply clear. A coral caret blinks. The hint reads "Listening. Let go when you are done." `aria-pressed="true"`.
3. While held: after 380ms the first word appears, then one word every 230–340ms (random). Each word fades up from 6px below with a 4px blur over 260ms, and sets `pulseAt = now`. For 220ms after each pulse the target amplitude is 0.55–1.0; between words it falls to about 0.12–0.18. The bars lengthen to as much as 37px, and the orb scales up to 1.09.
4. Holding past the last word: the waveform settles to the quiet level; nothing more appears.
5. Release (pointer up, pointer cancel, or key up): if fewer than 2 words were heard, the transcript clears, state returns to idle, and the hint reads "Hold a little longer, then speak". Otherwise any unheard words are filled in at once, the caret goes, and the state becomes thinking (chip "THINKING", the orb's inner swirl speeds from 9s to 1.2s per turn, the bars pulse at 0.25 ± 0.15).
6. After 900ms: state speaking (chip "ANSWERING"). The reply appears one word every 110ms with the same fade, each word kicking the amplitude (bars teal).
7. When the reply ends: the result chip fades and slides up over 300ms, the live region reads the reply, state returns to idle, hint "Hold again to ask something else". The next hold uses the next script (three, looping).
8. Starting a new hold during thinking or speaking cancels the old answer.
9. Reduced motion: no breathing, swirl, word fades, caret blink, or orb scale. The bars stay at their idle length. The words and reply still appear in sequence, thinking lasts 200ms.

Scripts:

| # | Heard | Reply | Chip |
|---|-------|-------|------|
| 1 | Remind me to water the tulsi plant tomorrow at seven | Done. Tomorrow at 7:00 am I'll remind you to water the tulsi plant. | Reminder · Sun 4 Oct, 7:00 |
| 2 | What's the weather in Pokhara this evening | Clear until nine, then light rain. 19° at sunset, so take a thin jacket. | Pokhara · 19° · rain after 21:00 |
| 3 | Play something quiet for reading | Playing Slow Paper, a quiet piano mix. It runs 42 minutes. | Slow Paper · 42 min |

## Structure

```
1280 × 800 · body grid (one minmax(0,1fr) column), centred, padding 32px 16px
┌──────────────────────────────────────┐  card 400px wide, r 36px
│ ● Ossa                      [READY]  │  padding 24px 28px 28px
│                                      │
│           ╱ ╲ 56 radial bars ╱ ╲     │  stage 280 × 280
│          │   ( orb 168px )    │      │  bars start at r 100
│           ╲ ╱                ╲ ╱     │
│   Hold the orb, or hold [Space]…     │  hint 12px
│ ──────────────────────────────────── │  1px rule, 18px above and below
│ Remind me to water the tulsi plant   │  serif italic 26px, min-height 62px
│ tomorrow at seven                    │
│ ● Done. Tomorrow at 7:00 am I'll…    │  15px, 8px teal dot
│   [⏱ Reminder · Sun 4 Oct, 7:00]     │  chip, margin-left 18px
└──────────────────────────────────────┘
```

- `section.w[aria-label="Ossa voice assistant"][data-state="idle|listening|thinking|speaking"]`.
- `.top`: wordmark (10px orb dot + "Ossa"), state chip `span`.
- `.stage`: absolute `svg.bars` (viewBox −140 −140 280 280, `aria-hidden`), with 56 `line`s; the orb `button` centred on top.
- `p.hint` with a `kbd`.
- `.tx`: `p.said` (transcript), `p.reply > span` (reply words), `span.card` (result chip with icon).
- `p.sr[aria-live=polite]` for the final reply.

## Tokens

```css
:root {
  --page: #e4e9e4;   /* sage page, radial lift to #f1f4f0 at 50% 40% */
  --card: #f6f7f3;
  --line: #d9dfd8;   /* card border, rules, chip outline */
  --ink: #13201d;    /* transcript */
  --ink-2: #45534f;  /* reply */
  --ink-3: #66736f;  /* hint, chip text idle */
  --mint: #9fe3d2;   /* orb mid */
  --teal: #2e8c7c;   /* orb edge, idle and speaking bars, focus, reply dot */
  --deep: #1d5e55;   /* orb rim, result chip text */
  --coral: #f0764a;  /* listening only: bars, caret */

  --sans: "Sora", system-ui, sans-serif;
  --serif: "Newsreader", Georgia, serif;

  --card-w: 400px; --r-card: 36px;
  --orb: 168px; --stage: 280px; --bar-r: 100px; --bars: 56;
  --shadow-card: 0 1px 0 #fff inset, 0 40px 70px -40px rgba(19, 32, 29, .35);
  --shadow-orb: 0 30px 60px -22px rgba(46, 140, 124, .55), inset 0 -10px 30px rgba(29, 94, 85, .35);

  --std: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-word: 260ms;
  --t-think: 900ms;
  --t-breathe: 4.8s;
  --t-swirl: 9s;  --t-swirl-think: 1.2s;
}
```

Orb fill: `radial-gradient(circle at 34% 28%, #fff 0 6%, #d8f6ee 18%, var(--mint) 42%, var(--teal) 76%, var(--deep))`. Inner swirl (`::before`, inset −20%): a conic gradient of two white highlights at 55% and 35%, blurred 14px, `mix-blend-mode: soft-light`, rotating. Listening glow (`::after`): `radial-gradient(circle at 50% 115%, rgba(255,180,146,.85), transparent 64%)` with `mix-blend-mode: screen`, opacity 0 → 1.

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
|------|--------|-----:|-------:|------------:|---------:|------|
| Wordmark | Sora | 15px | 600 | 1.5 | -0.01em | Title |
| State chip | Sora | 11px | 500 | 1.5 | 0.08em | UPPER |
| Hint | Sora | 12px | 400 | 1.5 | 0 | Sentence |
| Transcript | Newsreader italic (opsz auto) | 26px | 400 | 1.2 | -0.01em | Sentence |
| Reply | Sora | 15px | 400 | 1.5 | 0 | Sentence |
| Result chip | Sora | 12px | 500 | 1.5 | 0 | Sentence |

What you said is serif italic and large because it is the thing being captured; the assistant's answer is the plain grotesk. Don't swap them.

## Motion

| Element | Trigger | Property | From → To | Duration | Easing | Reduced motion |
|---------|---------|----------|-----------|---------:|--------|----------------|
| Orb | idle, thinking | scale | .97 → 1.02, alternate | 4.8s | `cubic-bezier(.45,0,.55,1)` | none |
| Orb | listening, speaking | scale | 1 + amp × .09 | 90ms per frame | linear | none |
| Orb swirl | always | rotate | 0 → 360° | 9s (1.2s thinking) | linear | none |
| Orb glow | listening | opacity | 0 → 1 | 300ms | `--std` | instant |
| Bars | every frame while active | line length | 3 + amp × (6 + 28n) px | rAF | smoothed (amp += (target − amp) × .18) | static 4px |
| Bars | listening | stroke | teal 55% → coral 85% | 300ms | `--std` | instant |
| Word | appears | opacity, translateY, blur | 0, 6px, 4px → 1, 0, 0 | 260ms | `--expo` | instant |
| Caret | listening | opacity | 1 ↔ 0 | 1s | steps(1) | static |
| Result chip | reply done | opacity, translateY | 0, 6px → 1, 0 | 300ms | `--expo` / `--std` | instant |
| State chip | state change | colour, border, background | idle → tint | 200ms | `--std` | instant |

`n` is a per-bar shape: `0.5 + 0.5 × sin(k × 1.7 + t × .011) × sin(k × .45 − t × .007)`, so the ring has moving lumps rather than a uniform pulse. The rAF loop stops itself once the state is idle and the amplitude has settled.

## States

- **Idle:** chip "READY", neutral outline. Orb breathing. Bars teal, ~4px.
- **Listening:** chip coral text `#a8401c` on `#fdf0ea`, border `#f5c3ae`. Bars coral. Glow on. Caret blinking. `aria-pressed="true"`.
- **Thinking:** chip teal-tinted (`--deep` on `#ecf8f4`, border `#bfe6dc`). Swirl fast. Bars gently pulsing.
- **Speaking:** same chip tint, label "ANSWERING". Bars teal and reacting to reply words. Orb scale follows amplitude.
- **Too short:** hint "Hold a little longer, then speak", transcript empty, idle.
- **Focus-visible:** 2px teal outline, 10px offset around the orb (4px elsewhere).
- **Error:** a real product shows "I didn't catch that" as the reply with no chip, and returns to idle. Not shown in the demo.
- **Mic denied:** replace the hint with "Microphone is off. Turn it on in settings." and disable the orb. Not shown in the demo.

## Accessibility

- The orb is a `button` with `aria-label="Hold to talk to Ossa"`, `aria-describedby` pointing at the hint, and `aria-pressed` true while listening.
- Keyboard: Space or Enter keydown starts listening (ignore `e.repeat`), keyup releases. `preventDefault` on both so Space doesn't scroll and Enter doesn't fire a click.
- The transcript `p` is labelled "You said". It is not a live region: words would be read one at a time.
- The final reply is written once to a polite live region when it finishes.
- Pointer: `setPointerCapture` on down so a finger sliding off the orb still releases correctly; `touch-action: none` and `contextmenu` prevented so a long press doesn't open the system menu or select text.
- Colour is not the only state signal: the chip word and the hint change too.
- Contrast: `--ink` on `--card` 16:1, `--ink-2` 8:1, `--ink-3` 4.9:1, `#a8401c` on `#fdf0ea` 5.6:1, `--deep` on `#ecf3ef` 6.9:1.
- The orb is 168px, far above any hit-target minimum.

## Responsive rules

- **≥ 640:** card 400px, centred.
- **≤ 420:** card padding 20px 20px 24px, radius 28px, stage 240px, orb 144px, transcript 22px. Bars keep their viewBox, so they scale with the stage.
- The body grid has a single `minmax(0, 1fr)` column. Without it the track sizes to the transcript's max-content and the card overflows at 375px.
- The reply sits in a `span` inside a flex row, so words wrap inside the span; if the words are flex items themselves, they never wrap.
- On a phone, the same card can sit as a sheet at the bottom of the screen with 34px bottom padding.

## Acceptance checklist

### Always

- [ ] Press and hold (pointer or Space/Enter) starts listening; release ends it. A quick tap under two words returns to idle with a hint.
- [ ] One smoothed amplitude drives both bar length and orb scale.
- [ ] Each heard or spoken word bumps the amplitude for about 220ms.
- [ ] Words appear one at a time with a 260ms fade-up.
- [ ] Four states with distinct chip text: Ready, Listening, Thinking, Answering.
- [ ] Listening colour (coral) appears only while listening.
- [ ] The rAF loop stops when idle.
- [ ] A new hold cancels a pending answer.
- [ ] Reply announced once via a polite live region; transcript not live.
- [ ] Reduced motion: words still appear in order; nothing pulses, swirls, or scales.
- [ ] No horizontal scroll at 375px.

### This demo

- [ ] Ossa; three scripts as listed, opening with the tulsi reminder already answered.
- [ ] Orb 168px, 56 bars from radius 100px, card 400px with 36px radius.
- [ ] Coral `#f0764a` bars while listening, teal `#2e8c7c` otherwise.
- [ ] Transcript in Newsreader italic 26px; everything else Sora.
- [ ] Thinking lasts 900ms; reply words every 110ms.

## Implementation notes

**Bars are SVG lines placed once and stretched every frame.** Store each bar's unit vector:

```js
const N = 56, R = 100;
for (let k = 0; k < N; k++) {
  const a = k / N * Math.PI * 2, l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  l.dataset.c = Math.cos(a); l.dataset.s = Math.sin(a); bars.appendChild(l);
}
function drawBars(amp, t) {
  for (const [k, l] of lines.entries()) {
    const c = +l.dataset.c, s = +l.dataset.s;
    const n = .5 + .5 * Math.sin(k * 1.7 + t * .011) * Math.sin(k * .45 - t * .007);
    const len = 3 + amp * (6 + 28 * n);
    l.setAttribute('x1', c * R); l.setAttribute('y1', s * R);
    l.setAttribute('x2', c * (R + len)); l.setAttribute('y2', s * (R + len));
  }
}
```

**Fake audio is a word clock plus easing.** The target is loud just after a word lands, quiet otherwise; the visible amplitude chases it:

```js
function loop(t) {
  const since = t - pulseAt;
  if (state === 'listening' || state === 'speaking')
    target = since < 220 ? .55 + .45 * Math.abs(Math.sin(t * .03)) : .12 + .06 * Math.sin(t * .02);
  else if (state === 'thinking') target = .25 + .15 * Math.sin(t * .012);
  else target = .08;
  amp += (target - amp) * .18;
  orb.style.setProperty('--amp', amp);          /* transform: scale(calc(1 + var(--amp) * .09)) */
  drawBars(amp, t);
  if (state === 'idle' && Math.abs(amp - target) < .005) { raf = null; return; }
  raf = requestAnimationFrame(loop);
}
```

With a real microphone, replace `target` with the RMS of an `AnalyserNode` frame, clamped to 0–1. Everything else stays.

**Hold, not click.** Use pointer events with capture, and key events without repeat:

```js
orb.addEventListener('pointerdown', e => { e.preventDefault(); orb.setPointerCapture(e.pointerId); start(); });
orb.addEventListener('pointerup', release);
orb.addEventListener('pointercancel', release);
orb.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); start(); } });
orb.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); release(); } });
```

Common mistakes:

- A purple-to-blue gradient orb with a neon glow. This orb is pearl and teal, lit from the upper left, with a soft drop shadow.
- Driving the orb scale with a CSS keyframe while listening. The breathing animation must be switched off in listening and speaking, or it overrides the amplitude transform.
- Toggling on click. A tap that starts listening and a second tap that stops it is a different interaction; this one is hold.
- Making the transcript a live region.
- Running the rAF loop forever while idle.
- Blending a coral glow over teal with normal blending; it goes brown. Use `screen` and a light peach.

Rebuild order:

1. Page, card, top row, hint.
2. Orb with gradient, shadow, swirl, glow layers.
3. Bars SVG and `drawBars`; idle ring.
4. State machine: idle → listening → thinking → speaking → idle.
5. Word reveal for transcript and reply; the pulse hook.
6. The amplitude loop and orb scale.
7. Result chip, live region, too-short path, keyboard, reduced motion, small layout.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
