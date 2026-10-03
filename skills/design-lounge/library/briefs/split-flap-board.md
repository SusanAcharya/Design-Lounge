<!-- Design Lounge Nº 310 · "Split-flap board" · designed by Susan Acharya (https://acharyasusan.com.np) -->

# Split-flap board

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. When a kit is locked, use that kit's colour and radius. This demo uses the numbers below.

## What it is

A departure board for 3 Oct. Three rows settle from a middle dot into KTM, BIR, and PKR with their gate and time. Each glyph is a 36×52 flap with a hairline through the middle. Replay runs the settle again. Reduced motion shows the final text and does not flip. This is not a scramble. A scramble is `text-scramble-reveal`. This is not a marquee. A marquee is `kinetic-type-marquee`.

## Reference behaviour

1. The board title is Departures · 3 Oct.
2. Row one ends as KTM, GATE 4, 06:40.
3. Row two ends as BIR, HELD, 07:15.
4. Row three ends as PKR, CLEAR, 08:05.
5. On play, each visible glyph shows a dot, then its letter after 40ms plus 28ms times its index, with a 160ms flip.
6. Replay clears the previous timers and plays again.
7. Reduced motion paints the final letters and skips timers.

## Structure

```
860px board on #141311
DEPARTURES · 3 OCT
flap flap flap
Replay
```

- Each character is a 36×52 cell, gap 8px, except spaces which are 12px and hidden.
- The cell has a 1px line at 50% height.
- Flip is rotateX from -80deg to 0 over 160ms.
- Replay is a 36px button.
- The board width is 860px.

## Tokens

```css
:root {
  --bg:#141311; --flap:#1c1b19; --ink:#f4f1ea; --ink-2:#a39b90;
  --line:#2c2a26; --primary:#d7b15e;
}
```

## Typography

| Role | Family | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Kicker | IBM Plex Sans | 12px | 500 | 1 | 0.14em |
| Glyph | IBM Plex Mono | 28px | 500 | 1 | 0 |
| Replay | IBM Plex Sans | 13px | 500 | 1 | 0 |

## Motion

| Thing | Trigger | From | To | Duration | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Flap | play | rotateX -80deg | rotateX 0 | 160ms cubic-bezier(0.2,0.7,0.2,1) | no flip, final text |

## States

- Settled: final glyph, no animation class.
- Flipping: class flip for one cycle.
- Replay available the whole time.
- Spaces take width and are visibility hidden so the gaps stay.

## Accessibility

- The final words are text, so a screen reader can read the cells after they settle.
- Replay is a button.
- Do not put the meaning only in the animation.
- Reduced motion shows the destination immediately.
- Focus ring is 2px #d7b15e, offset 3px.
- The hairline is decorative.

## Responsive rules

- The board is 860px at 1280.
- Below 900 the rows wrap or the cell width drops to 28px and the glyph to 22px. Keep three rows.
- Do not switch to a paragraph of the same words. The flaps are the piece.

## Acceptance checklist

### Always

- [ ] Three rows.
- [ ] Replay restarts the sequence and cancels old timers.
- [ ] Reduced motion shows the final string.
- [ ] One flap per glyph.
- [ ] The stagger is index times 28ms plus 40ms.

### This demo

- [ ] Date is 3 Oct.
- [ ] Destinations are KTM, BIR, PKR.
- [ ] Times are 06:40, 07:15, 08:05.
- [ ] Gate words are GATE 4, HELD, CLEAR.
- [ ] Ground is #141311. Flap is #1c1b19.

## Implementation notes

Store timers and clear them on replay or two plays overlap.

```js
timers.forEach(clearTimeout);
```

Do not step through the whole alphabet. One flip from the dot to the letter is the settle.

## Measurements to keep

- Cell 36×52, radius 2px, gap 8px. Space width 12px.
- Glyph 28px IBM Plex Mono.
- Flip 160ms. Delay 40 + index * 28 ms.
- Kicker tracking 0.14em. Replay margin-top 18px, height 36px.
- Hairline at 50%, 1px, rgba(0,0,0,.45).

## Wrong turns

- Do not loop the flaps forever.
- Do not scramble random letters for seconds.
- Do not use a canvas.
- Do not omit Replay.
- Do not animate under reduced motion.
- Do not draw a clock beside the board.

## Fit with the rest of the library

- A scramble is `text-scramble-reveal`.
- A marquee is `kinetic-type-marquee`.
- A mask reveal is `text-mask-line-reveal`.
- This board is a departure settle.
- Do not combine it with a cursor effect.
- The ground stays near-black.

## Keyboard

- Enter on Replay replays.
- The flaps are not buttons.
- Tab reaches Replay.
- Escape does nothing.
- Reduced motion skips timeouts.
- Timers are cleared before a new play.
- The delay step is 28ms, above 16ms.
- Spaces are not readable cells.
- The title is text, not flaps.
- Focus ring uses #d7b15e.
- Do not use a positive tabindex.
- The final strings match the three rows.
- Play runs on load when motion is allowed.
- Do not read localStorage.
- Mono is IBM Plex Mono.
- Sans is IBM Plex Sans.

---

*From Design Lounge, the design library of Susan Acharya (https://acharyasusan.com.np). Free to use in your products; a credit link is appreciated.*
