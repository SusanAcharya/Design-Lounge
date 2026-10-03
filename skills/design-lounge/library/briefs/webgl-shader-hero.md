<!-- Design Lounge Nº 432 · "WebGL shader hero" · designlounge.vercel.app -->

# WebGL shader hero

> **Build brief for a coding agent.** Rebuild this piece in the reader's stack. If they haven't said which stack, ask once, then default to semantic HTML + CSS + a little vanilla JS. Match the numbers below; don't "improve" them. Use raw WebGL 1. Do not add three.js, regl, OGL, or any other library for one full-screen triangle.

## What it is

The landing hero for Firn, a fictional cold-archive company that seals data on glass inside the Svalbard permafrost. The whole background is one fragment shader: domain-warped fractal noise that flows like ice fog under a polar night, in deep navy, glacier blue and near-white ice. The copy sits on the left over a scrim, and the motion lives in the right half. The pointer pulls the fog gently toward itself, about a tenth of the frame, never a spotlight. The detail worth copying is the discipline around the shader: DPR capped at 1.5, a frame loop that stops when the tab is hidden or the canvas leaves the screen, a still frame for reduced motion, and a CSS gradient that is already painted underneath if WebGL fails.

## Reference behaviour

1. First frame: the page is already showing the shader. Ice-white fog curls in from the right edge and the lower right. The left 40% is dark navy behind the headline.
2. The fog drifts all the time. One visible curl takes about 20 to 30 seconds to change shape. Nothing moves faster than that.
3. Move the pointer over the hero. A soft region about 0.45 of the frame height across, centred on the pointer, pulls the noise toward the pointer and brightens by up to 5%. The pull follows the pointer with an easing factor of 0.05 per frame, so it trails by about half a second.
4. Move the pointer out of the hero. The pull point eases back to its rest position at 72% across and 50% down.
5. Click "Pause motion" at the left end of the bottom band. The shader freezes on the current frame. The label becomes "Play motion", the icon becomes a play triangle, and `aria-pressed="true"`. Click again to resume from the same time with no jump.
6. Switch tabs. The loop is cancelled. Come back and it resumes from the same time.
7. Scroll the hero off-screen (in a longer page). An IntersectionObserver cancels the loop. Scroll back and it resumes.
8. If `getContext('webgl')` returns null, the shader fails to compile, the program fails to link, or the context is lost, the canvas stays hidden and the CSS gradient fallback shows. The pause button is hidden because nothing moves.
9. With `prefers-reduced-motion: reduce` the shader draws one still frame at time 14 s and stops. The button reads "Play motion" so the user can opt in.
10. The canvas fades in over 800ms after the first draw, so a failed start never flashes black.
11. Nav links, "Sign in" and both buttons have 160 to 200ms colour shifts and a 2px ice-blue focus ring.

## Structure

```
1280 × 800, full-bleed, overflow hidden
┌──────────────────────────────────────────────────────────────────┐
│ [*] FIRN            Vaults  Pricing  Field notes  Company (Sign in)│ 28px top, 56px sides
│                                                                    │
│  ── COLD ARCHIVE · SVALBARD                                        │
│  Data that                               shader fog lives here     │
│  keeps for a                                                       │
│  hundred winters.        (80px)                                    │
│  Firn writes your archives to glass …    (18px, max 460px)         │
│  [ Request a vault → ]  [ How sealing works ]                      │ copy bottom 136px
│ ──────────────────────────────────────────────────────────────────│ 1px rule
│ (|| Pause motion)  78°13′N 15°38′E   Vault temp −18 °C   Next sealing 14 Nov  │ 72px band
└──────────────────────────────────────────────────────────────────┘
layers, back to front: .fallback (CSS gradient) → canvas → scrim → content
```

- `main.hero` is `position: relative; height: 100%; min-height: 560px; overflow: hidden; isolation: isolate`.
- `.fallback` is an `aria-hidden` div at `z-index: -3` with the CSS gradient. It is always painted.
- `canvas#gl` is `aria-hidden`, `position: absolute; inset: 0; width: 100%; height: 100%`, `z-index: -2`, opacity 0 until the first draw.
- `.scrim` is an `aria-hidden` div at `z-index: -1` with two linear gradients. It carries the contrast, not the shader.
- `header` holds the logo link, a `nav` labelled "Primary", and the "Sign in" link.
- `section.copy` holds the eyebrow `p`, the only `h1`, the sub `p`, and the two CTA links.
- `.meta` is the bottom band: the pause `button` first, then three mono facts, 40px apart. Keep the button at the left end. The bottom-right corner is where hosts and cookie bars put overlays.

## Tokens

```css
:root {
  /* colour */
  --navy: #06102a;          /* page background, shader base */
  --deep: #0f2b4f;          /* shader mid tone */
  --glacier: #4f8fbf;       /* shader blue ribbons */
  --ice: #d8eaf5;           /* shader highlight, eyebrow, accent words */
  --snow: #f4f9fc;          /* headline, primary button fill */
  --ink-on-dark: #f4f9fc;
  --muted-on-dark: #b6cbdc; /* sub copy, nav, meta */
  --rule: rgba(216, 234, 245, .18);
  --scrim: rgba(4, 11, 28, .82);
  --focus: #9fd3f5;

  /* type */
  --sans: "Instrument Sans", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --fs-hero: 80px;
  --fs-sub: 18px;
  --fs-body: 15px;
  --fs-nav: 14px;
  --fs-meta: 12px;

  /* space (8 base) */
  --s-1: 8px; --s-2: 12px; --s-3: 24px; --s-4: 28px; --s-5: 40px; --s-6: 56px;

  /* radius */
  --r-pill: 999px;

  /* motion */
  --ease: cubic-bezier(.2, .7, .2, 1);
  --expo: cubic-bezier(.16, 1, .3, 1);
  --t-micro: 160ms;
  --t-btn: 200ms;
  --t-fade: 800ms;

  /* shader */
  --shader-dpr-max: 1.5;
  --shader-octaves: 5;       /* 3 under 640px */
  --shader-speed: .035;      /* time multiplier */
  --pointer-ease: .05;       /* per frame */
}
```

## Typography

| Role | Family | Size | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Logo | Instrument Sans | 18px | 600 | 1 | 0.24em | upper |
| Nav | Instrument Sans | 14px | 400 | 1.5 | 0 | sentence |
| Eyebrow | IBM Plex Mono | 12px | 500 | 1 | 0.14em | upper |
| Headline | Instrument Sans | 80px | 500 | 0.98 | -0.035em | sentence |
| Sub | Instrument Sans | 18px | 400 | 1.55 | 0 | sentence |
| Button | Instrument Sans | 15px | 500 | 1 | 0 | sentence |
| Meta | IBM Plex Mono | 12px | 400 | 1 | 0.06em | as written |
| Meta value | IBM Plex Mono | 12px | 500 | 1 | 0.06em | as written |

- The headline wraps with `text-wrap: balance` into three lines at 1280. "a hundred winters." is in `--ice`, not italic.
- The sub copy measure is 460px. Do not widen it.
- Do not set the headline in the mono face. Mono is for facts only.

## Motion

| Thing | Trigger | Property | From → to | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| Shader time | rAF loop | `u_time` | += real seconds | endless | none (time) | one frame at 14 s |
| Pointer pull | pointermove | `u_mouse` | eases to pointer | 0.05 per frame | exponential | not animated |
| Pull rest | pointerleave | `u_mouse` | eases to (72%, 50%) | 0.05 per frame | exponential | not animated |
| Canvas reveal | first draw | opacity | 0 → 1 | 800ms | `--ease` | instant |
| Nav link | hover | colour | muted → snow | 160ms | `--ease` | instant |
| Primary button | hover | background, arrow x | snow → ice, 0 → 3px | 200ms | `--ease` | instant |
| Buttons | active | scale | 1 → 0.98 | 200ms | `--ease` | none |

- Time inside the shader runs at 0.035 of real time. At 60fps that is a drift of about 0.0006 noise units per frame. Do not speed it up to "show it off".
- Clamp the frame delta to 50ms so a long frame never jumps the fog.
- Start time at 14 s, not 0. The first second of noise near the origin is a flat region.

## States

- Running: loop active, button "Pause motion", pause-bars icon, `aria-pressed="false"`.
- Paused by the user: loop cancelled, frame kept, button "Play motion", play icon, `aria-pressed="true"`.
- Paused by the system (tab hidden, canvas off-screen): loop cancelled. The button does not change, because the user did not press it.
- Reduced motion: starts in the paused-by-user state with one frame drawn.
- No WebGL: `body.no-gl`. Canvas stays at opacity 0. The CSS fallback shows. The pause button is `display: none`.
- Hover, nav: text goes from `--muted-on-dark` to `--snow`.
- Hover, primary: fill goes from `--snow` to `--ice` and the arrow moves 3px right.
- Hover, ghost and pause button: border goes from `--rule` to `--ice`.
- Focus-visible: `outline: 2px solid #9fd3f5; outline-offset: 3px` on every link and button.

## Accessibility

- The canvas, the fallback and the scrim are `aria-hidden="true"`. The shader is decoration. Do not give the canvas a role or a label.
- The pause control is a real `button` with visible text. Its state is `aria-pressed`. The text changes with it, so the name always says what a press will do.
- The pause button exists because the motion runs longer than 5 seconds (WCAG 2.2.2). Do not remove it.
- Contrast: `#f4f9fc` on the scrim over navy is above 12:1. `#b6cbdc` sub copy on the scrimmed left side is above 8:1. Never place the copy over the ice highlights without the scrim.
- Focus order: logo, four nav links, Sign in, Request a vault, How sealing works, Pause motion.
- The pause button sits at the left of the band, so a browser or host overlay in the bottom-right corner never covers it.
- The hero responds to the pointer only. Keyboard users lose nothing, because the pull is decoration.
- Hit targets: buttons are 48px tall, the pause button 40px. On phones the pause button stays 40px tall.

## Responsive rules

- ≥1280: as specified. Headline 80px, copy at left 56px, bottom 136px.
- 1024: same layout. The headline wraps to three or four lines inside 640px. The scrim gradient keeps its percentages.
- 768 and below (`max-width: 900px`): the nav links hide, "Sign in" stays at the right. Padding becomes 24px. Headline 48px. Sub 16px. The scrim turns vertical: `linear-gradient(0deg, scrim 0%, rgba(4,11,28,.6) 50%, transparent 85%)`, so the fog shows above the copy.
- Under 640: render the shader at 0.75 of the capped DPR, drop octaves from 5 to 3, and shift the noise domain by `(0.55, 0.2)` so a bright curl sits in the narrow frame. The two meta facts with `.hide-sm` hide. Buttons drop to 18px side padding and 14px text and never wrap their labels.
- Very low-end phones: if the first 30 frames average over 28ms, switch to the paused state (button reads "Play motion") and keep the still frame. That still frame is the phone poster. The probe runs once per page load.
- Never let the hero scroll horizontally. `overflow: hidden` on the hero, and no element wider than 100vw.

## Acceptance checklist

### Always

- [ ] The shader is raw WebGL 1 with one full-screen triangle. No library.
- [ ] Canvas backing size is `clientWidth × min(devicePixelRatio, 1.5)`, and 0.75 of that under 640px.
- [ ] The loop stops when `document.hidden` is true and when an IntersectionObserver reports the canvas is not intersecting.
- [ ] Resuming does not jump. Time only advances while the loop runs, with the delta clamped to 50ms.
- [ ] A CSS gradient is painted under the canvas at all times. Breaking the shader source shows it and hides the pause button.
- [ ] Reduced motion draws one frame and starts paused. The user can press Play.
- [ ] A visible Pause control with `aria-pressed` and a changing label.
- [ ] The copy has a scrim. Body text contrast is at least 4.5:1 at every point the copy can sit.
- [ ] Focus rings are visible on every control.
- [ ] No horizontal overflow at 390 or at 1280.

### This demo

- [ ] Colours are navy `#06102a`, deep `#0f2b4f`, glacier `#4f8fbf`, ice `#d8eaf5`.
- [ ] The headline reads "Data that keeps for a hundred winters." at 80px, with "a hundred winters." in ice.
- [ ] The CTAs read "Request a vault" (filled) and "How sealing works" (outline).
- [ ] The meta band reads "78°13′N 15°38′E", "Vault temp −18 °C", "Next sealing 14 Nov".
- [ ] Shader speed is 0.035 and 5 octaves on desktop, 3 under 640px.

## Implementation notes

### 1. The full shader

This is the whole fragment shader. It is longer than 25 lines on purpose: lift it as-is. Three nested fbm calls give the domain warp: `q` warps `r`, `r` warps the final value. The pointer only adds to the second warp, which is why it reads as a pull and not a light.

```glsl
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;     // canvas backing size in px
uniform float u_time;   // seconds, starts at 14
uniform vec2 u_mouse;   // px, origin bottom-left, eased in JS
uniform float u_oct;    // 5 desktop, 3 phone
uniform vec2 u_off;     // (0,0) desktop, (.55,.2) phone
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;mat2 r=mat2(.8,.6,-.6,.8);
  for(int i=0;i<6;i++){if(float(i)>=u_oct)break;v+=a*noise(p);p=r*p*2.02;a*=.5;}
  return v;
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  vec2 p=(gl_FragCoord.xy-.5*u_res)/u_res.y+u_off;
  vec2 m=(u_mouse-.5*u_res)/u_res.y+u_off;
  float t=u_time*.035;
  float d=length(p-m);
  float pull=exp(-d*d*5.);
  vec2 q=vec2(fbm(p*1.3+vec2(0.,t)),fbm(p*1.3+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p*1.5+2.*q+vec2(1.7,9.2)+t*.6+(m-p)*pull*.35),
              fbm(p*1.5+2.*q+vec2(8.3,2.8)-t*.4));
  float f=clamp((fbm(p*1.7+2.4*r)-.5)*2.4+.5,0.,1.);
  vec3 navy=vec3(.024,.063,.165),deep=vec3(.059,.169,.31);
  vec3 glacier=vec3(.31,.56,.75),ice=vec3(.85,.92,.96);
  vec3 c=mix(navy,deep,smoothstep(.05,.45,f));
  c=mix(c,glacier,smoothstep(.4,.75,f)*(.5+.5*clamp(length(q),0.,1.)));
  c=mix(c,ice,smoothstep(.62,.96,f+.3*(r.x-.5)+pull*.08)*.9);
  c+=ice*pull*.05;
  c*=1.-.55*dot(uv-.5,uv-.5);
  gl_FragColor=vec4(c,1.);
}
```

The vertex shader is one line: `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`. Feed it one triangle, `[-1,-1, 3,-1, -1,3]`, which covers the screen with no diagonal seam.

The `(fbm - .5) * 2.4 + .5` stretch matters. Five octaves of value noise cluster around 0.5, so without it the whole frame sits in the navy band and the ice never shows.

### 2. Performance rules

1. Cap DPR at 1.5. A 3x phone does not need 9x the fragments for fog.
2. Under 640px render at 0.75 of that, and use 3 octaves. Fragment cost scales with octaves × 5 fbm calls.
3. Request `{ antialias: false, alpha: false, powerPreference: 'low-power' }`.
4. Resize only when the backing size changes. Never call `gl.viewport` every frame.
5. One program, one buffer, four uniforms per frame. No textures.
6. Stop the loop when hidden or off-screen. Do not keep drawing a canvas no one sees.
7. No `preserveDrawingBuffer`. No reading pixels back.
8. If the first 30 frames average over 28ms, stop and keep the still frame.

### 3. The loop, the fallback, and reduced motion

```js
let probeN = 0, probeMs = 0;
function frame(now) {
  const raw = now - last;
  last = now;
  if (probeN < 30) {
    probeN++; probeMs += raw;
    if (probeN === 30 && probeMs / 30 > 28) { setPaused(true); return; }
  }
  time += Math.min(raw, 50) / 1000;
  mouse.x += (mouse.tx - mouse.x) * 0.05;
  mouse.y += (mouse.ty - mouse.y) * 0.05;
  draw();
  raf = requestAnimationFrame(frame);
}
function update() {
  if (visible && !document.hidden && !paused) start(); else stop();
}
new IntersectionObserver(([e]) => { visible = e.isIntersecting; update(); }).observe(canvas);
document.addEventListener('visibilitychange', update);
canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); fail(); });
resize();   // draws the first frame
if (reduce.matches) setPaused(true); else update();
```

Wrap context creation, compile and link in one `try`. Any failure adds `no-gl` to `body`. The fallback CSS is three layers:

```css
.fallback {
  background:
    radial-gradient(60% 70% at 78% 42%, rgba(216,234,245,.55), transparent 60%),
    radial-gradient(50% 60% at 62% 70%, rgba(79,143,191,.6), transparent 70%),
    linear-gradient(160deg, #0f2b4f 0%, #06102a 70%);
}
```

Common mistakes:

- Putting the copy straight on the shader with no scrim. The ice highlights drift under the text and contrast drops below 3:1.
- Using `Math.random()` noise textures uploaded every frame. All noise is in the shader.
- Leaving the loop running in a background tab.
- Drawing at full devicePixelRatio on a 3x phone.
- Making the pointer a glowing spotlight. The pull bends the fog. It does not light it.
- Purple or teal. This palette is navy, glacier and ice only.
- Hiding the pause button on desktop "because it is subtle". The motion is endless, so the control stays.
- A blank black frame before WebGL starts. The CSS fallback must already be painted.

---

*From Design Lounge (https://designlounge.vercel.app). Free to use in your products. Credit line: Designed using Design Lounge.*
