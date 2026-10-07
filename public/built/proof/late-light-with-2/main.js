/* Dome After Dark · the voyage. Built on the scroll-space-voyage piece from Design Lounge (https://www.designlounge.live). */
(() => {
  'use strict';
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const gauss = () => (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2;
  const R = Math.random, TAU = Math.PI * 2, C_KM_S = 299792.458;
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  let reduce = mq.matches;
  const cheap = () => innerWidth < 700;
  const mk = (w, h = w) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };

  function rad(g, x0, y0, r0, x1, y1, r1, s) {
    const gr = g.createRadialGradient(x0, y0, r0, x1, y1, r1);
    for (let i = 0; i < s.length; i += 2) gr.addColorStop(s[i], s[i + 1]);
    return gr;
  }
  function blob(g, x, y, r, col, a) {
    if (r <= 0) return;
    g.fillStyle = rad(g, x, y, 0, x, y, r, [0, `rgba(${col},${a})`, 1, `rgba(${col},0)`]);
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function spikes(g, x, y, len, col, a, angles) {
    g.save(); g.translate(x, y); g.lineWidth = 1.2;
    for (const ang of angles) {
      g.rotate(ang);
      const gr = g.createLinearGradient(-len, 0, len, 0);
      gr.addColorStop(0, `rgba(${col},0)`); gr.addColorStop(.5, `rgba(${col},${a})`); gr.addColorStop(1, `rgba(${col},0)`);
      g.strokeStyle = gr; g.beginPath(); g.moveTo(-len, 0); g.lineTo(len, 0); g.stroke();
      g.rotate(-ang);
    }
    g.restore();
    blob(g, x, y, len * .28, '255,255,255', Math.min(1, a * 1.4));
  }
  /* fade a square sprite to nothing at its edge, so no square ever shows */
  function edgeFade(g, S, from = .72) {
    g.globalCompositeOperation = 'destination-in';
    g.fillStyle = rad(g, S / 2, S / 2, S / 2 * from, S / 2, S / 2, S / 2, [0, 'rgba(0,0,0,1)', 1, 'rgba(0,0,0,0)']);
    g.fillRect(0, 0, S, S);
    g.globalCompositeOperation = 'source-over';
  }
  /* one Sun for every body: light from the upper left, night on the lower right */
  function terminator(g, S) {
    const r = S / 2;
    g.globalCompositeOperation = 'source-over';
    g.fillStyle = rad(g, r * .5, r * .45, r * .15, r * .85, r * .85, r * 1.3, [0, 'rgba(4,5,12,0)', .5, 'rgba(4,5,12,.12)', .78, 'rgba(4,5,12,.86)', 1, 'rgba(4,5,12,.98)']);
    g.fillRect(0, 0, S, S);
  }

  /* sprites: each painted once into an offscreen canvas */
  function makeMoon() {
    const S = 512, [c, g] = mk(S), r = S / 2;
    g.beginPath(); g.arc(r, r, r - 1, 0, TAU); g.clip();
    g.fillStyle = rad(g, r * .7, r * .65, r * .1, r, r, r, [0, '#e6e0d3', 1, '#8c8781']); g.fillRect(0, 0, S, S);
    for (const [mx0, my0, mr] of [[.38, .36, .2], [.58, .3, .16], [.62, .52, .22], [.42, .6, .14], [.3, .5, .12], [.72, .42, .12]])
      for (let k = 0; k < 6; k++) blob(g, S * mx0 + gauss() * S * .05, S * my0 + gauss() * S * .05, S * mr * (.6 + R() * .6), '78,76,82', .22);
    for (let i = 0; i < 3200; i++) { g.fillStyle = R() < .5 ? 'rgba(40,38,36,.08)' : 'rgba(255,250,240,.06)'; g.fillRect(R() * S, R() * S, 1.4, 1.4); }
    for (let i = 0; i < 220; i++) {
      const cr = Math.pow(R(), 4.5) * 30 + 1.2, x = R() * S, y = R() * S;
      g.fillStyle = 'rgba(60,56,54,.16)'; g.beginPath(); g.arc(x, y, cr, 0, TAU); g.fill();
      g.strokeStyle = 'rgba(255,250,238,.14)'; g.lineWidth = Math.max(.6, cr * .14);
      g.beginPath(); g.arc(x + cr * .1, y + cr * .1, cr, Math.PI * .9, Math.PI * 1.9); g.stroke();
    }
    const tx = S * .36, ty = S * .74;
    blob(g, tx, ty, 20, '255,252,244', .35);
    g.strokeStyle = 'rgba(255,250,240,.07)';
    for (let k = 0; k < 26; k++) { const a = R() * TAU, l = 9 * (4 + R() * 14); g.lineWidth = 1.5 + R() * 2; g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx + Math.cos(a) * l, ty + Math.sin(a) * l); g.stroke(); }
    terminator(g, S);
    return c;
  }

  function makeSaturn() {
    const S = 512, [c, g] = mk(S), cx = S / 2, cy = S / 2, pr = S * .2, ri = S * .265, ro = S * .485, tilt = -.38, sq = .34;
    const ringFill = (gg) => rad(gg, 0, 0, ri, 0, 0, ro, [
      0, 'rgba(233,210,160,0)', .04, 'rgba(214,190,146,.5)', .22, 'rgba(240,222,180,.78)', .3, 'rgba(240,222,180,.74)',
      .33, 'rgba(90,70,40,.18)', .38, 'rgba(236,216,172,.72)', .62, 'rgba(226,204,160,.66)', .8, 'rgba(206,184,142,.5)', .86, 'rgba(160,140,100,.22)', 1, 'rgba(160,140,100,0)']);
    const ringHalf = (back) => {
      g.save(); g.translate(cx, cy); g.rotate(tilt); g.scale(1, sq);
      g.beginPath(); g.rect(-S, back ? -S : 0, 2 * S, S); g.clip();
      g.fillStyle = ringFill(g); g.beginPath(); g.arc(0, 0, ro, 0, TAU); g.arc(0, 0, ri, 0, TAU, true); g.fill();
      g.strokeStyle = 'rgba(80,60,30,.35)'; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, ri + (ro - ri) * .335, 0, TAU); g.stroke();
      if (back) { g.fillStyle = 'rgba(5,6,12,.75)'; g.beginPath(); g.ellipse(pr * .42, -pr * .12, pr * 1.02, pr * 2.4, 0, 0, TAU); g.fill(); }
      g.restore();
    };
    ringHalf(true);
    g.save(); g.beginPath(); g.arc(cx, cy, pr, 0, TAU); g.clip();
    g.fillStyle = rad(g, cx - pr * .35, cy - pr * .4, pr * .1, cx, cy, pr, [0, '#f4e7c4', .55, '#d9bf8c', 1, '#9c7d52']); g.fillRect(0, 0, S, S);
    g.save(); g.translate(cx, cy); g.rotate(tilt);
    for (let i = -10; i <= 10; i++) {
      const y = i * pr * .095 + gauss() * 2, h = pr * .05 + R() * pr * .05;
      g.fillStyle = i % 2 ? `rgba(120,90,50,${.08 + R() * .1})` : `rgba(255,240,210,${.06 + R() * .08})`;
      g.fillRect(-pr, y, pr * 2, h);
    }
    g.restore();
    g.save(); g.translate(cx, cy); g.rotate(tilt); g.scale(1, sq);
    g.beginPath(); g.arc(0, 0, ro, 0, TAU); g.arc(0, 0, ri, 0, TAU, true); g.clip();
    g.fillStyle = 'rgba(25,18,8,.45)'; g.fillRect(-S, 0, 2 * S, S);
    g.restore();
    g.fillStyle = rad(g, cx - pr * .5, cy - pr * .55, pr * .15, cx - pr * .15, cy - pr * .15, pr * 1.3, [0, 'rgba(4,5,12,0)', .5, 'rgba(4,5,12,.12)', .78, 'rgba(4,5,12,.86)', 1, 'rgba(4,5,12,.98)']);
    g.fillRect(0, 0, S, S);
    g.restore();
    ringHalf(false);
    return c;
  }

  function makeOrion() {
    const S = 1024, [c, g] = mk(S), cx = S * .5, cy = S * .5;
    const wisp = (x, y, rx, ry, ang, col, a) => { g.save(); g.translate(x, y); g.rotate(ang); g.scale(1, ry / rx); blob(g, 0, 0, rx, col, a); g.restore(); };
    g.globalCompositeOperation = 'lighter';
    blob(g, cx, cy, S * .48, '120,50,95', .16);
    wisp(cx - S * .06, cy + S * .04, S * .36, S * .26, -.5, '255,105,140', .22);
    wisp(cx - S * .16, cy + S * .12, S * .26, S * .14, -.9, '255,120,120', .2);
    wisp(cx + S * .14, cy - S * .1, S * .24, S * .13, -.7, '255,140,150', .18);
    wisp(cx - S * .02, cy + S * .02, S * .17, S * .14, -.4, '255,165,165', .26);
    blob(g, cx + S * .01, cy - S * .01, S * .11, '120,225,210', .36);
    blob(g, cx, cy, S * .05, '235,255,250', .42);
    for (let i = 0; i < 150; i++) {
      const a = R() * TAU, d = Math.abs(gauss()) * S * .3, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * .8;
      const col = R() < .55 ? '255,110,140' : R() < .5 ? '255,170,110' : '110,200,220';
      wisp(x, y, S * (.03 + R() * .09), S * (.015 + R() * .04), R() * Math.PI, col, .05 + R() * .1);
    }
    g.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 60; i++) {
      const t = i / 60, ang = -2.4 + t * 1.3, d = S * (.1 + t * .2);
      wisp(cx + Math.cos(ang) * d, cy + Math.sin(ang) * d, S * (.03 + R() * .05), S * (.02 + R() * .03), ang, '0,0,0', .3);
    }
    for (let i = 0; i < 50; i++) { const a = R() * TAU, d = S * (.26 + R() * .22); wisp(cx + Math.cos(a) * d, cy + Math.sin(a) * d, S * (.03 + R() * .06), S * (.01 + R() * .03), R() * Math.PI, '0,0,0', .2); }
    g.globalCompositeOperation = 'lighter';
    const jw = [Math.PI / 2, Math.PI / 6 + Math.PI / 3, Math.PI / 6 + 2 * Math.PI / 3, Math.PI / 6];
    for (const [ox, oy, l] of [[-.012, -.01, 28], [.014, -.004, 24], [.004, .016, 20], [-.006, .01, 18]]) spikes(g, cx + S * ox, cy + S * oy, l, '235,245,255', .7, jw);
    for (let i = 0; i < 140; i++) { const a = R() * TAU, d = S * (.05 + R() * .42); blob(g, cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1.2 + R() * 3, '255,250,240', .3 + R() * .5); }
    edgeFade(g, S, .5);
    return c;
  }

  function makeAndromeda() {
    const S = 768, [c, g] = mk(S), cx = S / 2, cy = S / 2, rot = -.62, sq = .36;
    g.save(); g.translate(cx, cy); g.rotate(rot); g.scale(1, sq);
    g.globalCompositeOperation = 'lighter';
    blob(g, 0, 0, S * .47, '160,170,230', .24);
    blob(g, 0, 0, S * .28, '230,220,210', .34);
    blob(g, 0, 0, S * .14, '255,236,205', .7);
    blob(g, 0, 0, S * .06, '255,248,232', .95);
    for (let arm = 0; arm < 2; arm++) for (let i = 0; i < 160; i++) {
      const t = i / 160, th = arm * Math.PI + t * 4.6 + gauss() * .18, rr = S * (.09 + t * .38);
      blob(g, Math.cos(th) * rr, Math.sin(th) * rr, S * (.035 - t * .014) + S * .01, '175,195,255', .11 * (1 - t * .5));
    }
    g.globalCompositeOperation = 'destination-out';
    for (let arm = 0; arm < 2; arm++) for (let i = 0; i < 120; i++) {
      const t = i / 120, th = arm * Math.PI + t * 4.6 + .35 + gauss() * .12, rr = S * (.12 + t * .34);
      blob(g, Math.cos(th) * rr, Math.sin(th) * rr, S * (.022 - t * .008), '0,0,0', .28);
    }
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 700; i++) { const a = R() * TAU, d = Math.abs(gauss()) * S * .42; g.fillStyle = `rgba(230,235,255,${(.2 + R() * .5).toFixed(2)})`; g.fillRect(Math.cos(a) * d, Math.sin(a) * d, 1.2, 1.2); }
    g.restore();
    g.globalCompositeOperation = 'lighter';
    blob(g, cx + S * .13, cy + S * .12, S * .035, '255,236,210', .7);
    blob(g, cx - S * .27, cy - S * .2, S * .05, '230,225,240', .4);
    edgeFade(g, S, .6);
    return c;
  }

  function makeDeep() {
    const [c, g] = mk(1600, 1000), cols = ['255,190,140', '255,140,110', '200,215,255', '255,235,210', '255,110,150', '255,170,90'];
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 420; i++) {
      const size = Math.pow(R(), 4.2) * 14 + .9;
      g.save(); g.translate(R() * 1600, R() * 1000); g.rotate(R() * Math.PI); g.scale(1, .25 + R() * .75);
      blob(g, 0, 0, size, cols[R() * 6 | 0], .4 + R() * .5);
      if (size > 5) blob(g, 0, 0, size * .3, '255,245,230', .8);
      g.restore();
    }
    const jw = [Math.PI / 2, Math.PI / 6 + Math.PI / 3, Math.PI / 6 + 2 * Math.PI / 3, Math.PI / 6];
    for (let i = 0; i < 6; i++) { const x = R() * 1600, y = R() * 1000, l = 20 + R() * 50; spikes(g, x, y, l, '255,246,232', .55, jw); }
    return c;
  }

  function makeMilky(size) {
    const [c, g] = mk(size), h = size / 2, bw = size * .075;
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 70; i++) blob(g, R() * size, h + gauss() * bw * .8, bw * (.6 + R() * 1.4), R() < .3 ? '255,190,150' : '140,150,230', .05 + R() * .04);
    for (let i = 0; i < 4000; i++) { g.fillStyle = `rgba(235,230,255,${(R() * .5).toFixed(2)})`; const s = R() < .1 ? 1.6 : .9; g.fillRect(R() * size, h + gauss() * bw * 1.1, s, s); }
    g.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 120; i++) { const t = R(); blob(g, t * size, h + Math.sin(t * 9) * bw * .3 + gauss() * bw * .18, bw * (.07 + R() * .2), '0,0,0', .22); }
    return c;
  }

  /* the dome: a ring of cove light, the seats, the projector. Drawn live, because it grows as you pass through it. */
  function paintDome(g, w, h, dpr, p, px, py) {
    const r0 = Math.min(h * .44, w * .48), r = r0 * (1 + p * 2.4);
    const cx = w / 2 - px * .3 * dpr, cy = h * .6 - py * .3 * dpr + p * h * .15;
    const hold = 1 - smooth(1.3, 2.5, p), cove = (1 - smooth(0, 1, p)) * hold;
    if (hold <= .005) return;
    g.save();
    g.globalCompositeOperation = 'source-over';
    g.fillStyle = rad(g, cx, cy, r * .98, cx, cy, r * 1.7, [0, 'rgba(3,5,12,0)', .05, `rgba(3,5,12,${.7 * hold})`, 1, `rgba(3,5,12,${.9 * hold})`]);
    g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = 'lighter';
    g.fillStyle = rad(g, cx, cy, r * .86, cx, cy, r * 1.16, [0, 'rgba(255,106,85,0)', .42, `rgba(255,106,85,${.55 * cove})`, .47, `rgba(255,150,110,${.9 * cove})`, .6, `rgba(255,106,85,${.3 * cove})`, 1, 'rgba(255,106,85,0)']);
    g.fillRect(cx - r * 1.2, cy - r * 1.2, r * 2.4, r * 2.4);
    g.globalCompositeOperation = 'source-over';
    g.strokeStyle = `rgba(201,184,255,${.5 * hold})`; g.lineWidth = 1.5 * dpr;
    g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke();
    /* seats and the projector drop away as you rise */
    const drop = smooth(0, 1.6, p) * h * 1.1, sa = 1 - smooth(.9, 1.7, p);
    if (sa > .005) {
      g.globalAlpha = sa;
      const sw = clamp(w * .085, 44 * dpr, 120 * dpr), gap = sw * .28, step = sw + gap;
      const rows = [[h * .8 + drop, sw * .78, .72], [h * .87 + drop, sw, 1]];
      for (const [ty, ww, k] of rows) {
        const n = Math.ceil(w / step) + 2, rr = ww * .32, off = (k < 1 ? step / 2 : 0) - px * .2 * dpr * k;
        for (let i = -1; i < n; i++) {
          const x = i * step + off + (step - ww) / 2;
          g.fillStyle = k < 1 ? 'rgba(5,7,15,.9)' : '#04060e';
          g.beginPath(); g.moveTo(x, h + 2); g.lineTo(x, ty + rr); g.arcTo(x, ty, x + rr, ty, rr); g.lineTo(x + ww - rr, ty); g.arcTo(x + ww, ty, x + ww, ty + rr, rr); g.lineTo(x + ww, h + 2); g.closePath(); g.fill();
          g.strokeStyle = `rgba(255,120,95,${(.55 * cove * k).toFixed(3)})`; g.lineWidth = 1.2 * dpr;
          g.beginPath(); g.moveTo(x, ty + rr); g.arcTo(x, ty, x + rr, ty, rr); g.lineTo(x + ww - rr, ty); g.arcTo(x + ww, ty, x + ww, ty + rr, rr); g.stroke();
        }
      }
      /* the star projector: a dumbbell on a stand, with its beam on the dome */
      const pxx = w / 2 - px * .2 * dpr, pyy = h * .78 + drop, s = sw * .22;
      g.globalCompositeOperation = 'lighter';
      g.fillStyle = `rgba(201,184,255,${.06 * cove + .02 * hold})`;
      g.beginPath(); g.moveTo(pxx - s * .4, pyy - s * 2.2); g.lineTo(cx - r * .55, cy - r * .95); g.lineTo(cx + r * .15, cy - r * 1.02); g.lineTo(pxx + s * .4, pyy - s * 2.2); g.closePath(); g.fill();
      g.globalCompositeOperation = 'source-over';
      g.fillStyle = '#05070f'; g.strokeStyle = `rgba(201,184,255,${.35 * hold})`; g.lineWidth = 1 * dpr;
      g.fillRect(pxx - s * .18, pyy, s * .36, h);
      g.save(); g.translate(pxx, pyy); g.rotate(-.55);
      g.lineWidth = s * .55; g.strokeStyle = '#05070f'; g.beginPath(); g.moveTo(-s * 2.1, 0); g.lineTo(s * 2.1, 0); g.stroke();
      for (const sx of [-2.1, 2.1]) {
        g.fillStyle = '#05070f'; g.beginPath(); g.arc(sx * s, 0, s, 0, TAU); g.fill();
        g.strokeStyle = `rgba(201,184,255,${.4 * hold})`; g.lineWidth = 1 * dpr; g.beginPath(); g.arc(sx * s, 0, s, Math.PI * 1.05, Math.PI * 1.75); g.stroke();
        g.fillStyle = `rgba(255,120,95,${.5 * cove})`; g.beginPath(); g.arc(sx * s - s * .3, s * .35, s * .12, 0, TAU); g.fill();
      }
      g.restore();
      g.globalAlpha = 1;
    }
    g.restore();
  }

  /* state */
  const cvs = $('#space'), ctx = cvs.getContext('2d'), house = $('#house');
  const out = [$('#dist'), $('#age'), $('#clock')], last = ['', '', ''];
  const DEPTH = 2600, ZVH = 1000, BUCKETS = 8;
  const starRGB = [[255, 246, 232], [255, 246, 232], [255, 246, 232], [200, 220, 255], [170, 200, 255], [255, 206, 150], [255, 170, 140]];
  const starStyle = starRGB.map(([r, g, b]) => Array.from({ length: BUCKETS }, (_, k) => `rgba(${r},${g},${b},${((k + 1) / BUCKETS).toFixed(3)})`));
  const sprites = { moon: null, saturn: null, orion: null, andromeda: null, deep: null };
  const objs = {
    moon:      { r: 150, k: 4.2, mul: 1, side: 1,  glow: '220,214,200' },
    saturn:    { r: 200, k: 3.6, mul: 1, side: -1, off: .3,  glow: '233,210,160' },
    orion:     { r: 430, k: 2.4, mul: 1, side: 1,  off: .1,  near: .38 },
    andromeda: { r: 260, k: 5,   mul: 1, side: -1, off: .22, glow: '200,205,255', hold: .55 },
  };
  function glowSprite(stops) { const [c, g] = mk(256); g.fillStyle = rad(g, 128, 128, 0, 128, 128, 128, stops); g.fillRect(0, 0, 256, 256); return c; }
  for (const o of Object.values(objs)) if (o.glow) o.halo = glowSprite([0, `rgba(${o.glow},0)`, .45, `rgba(${o.glow},.14)`, .95, `rgba(${o.glow},0)`, 1, `rgba(${o.glow},0)`]);
  let W, H, DPR, F, CX, CY, VH, chapters = [], stars = [], milky = null, milkySize = 0, mainEnd = 0;
  let sy = scrollY, lastSy = -1, lastCam = 0, vel = 0, camX = 0, camY = 0, mx = 0, my = 0;
  const t0 = performance.now();
  const [bgA, gA] = mk(1);
  let keyA = '', lastHouse = '';

  const idle = (fn) => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1200 }) : setTimeout(fn, 50));
  let building = false;
  function buildLater() {
    if (building) return;
    building = true;
    const jobs = [
      () => { if (!milky || milky.width !== milkySize) milky = makeMilky(milkySize); },
      () => { if (!sprites.moon) sprites.moon = makeMoon(); },
      () => { if (!sprites.saturn) sprites.saturn = makeSaturn(); },
      () => { if (!sprites.orion) sprites.orion = makeOrion(); },
      () => { if (!sprites.andromeda) sprites.andromeda = makeAndromeda(); },
      () => { if (!sprites.deep) sprites.deep = makeDeep(); },
      () => paintArt(),
    ];
    const step = () => { const job = jobs.shift(); if (!job) { building = false; return; } job(); keyA = ''; kick(); idle(step); };
    idle(step);
  }

  function seed() {
    const n = clamp(Math.round(innerWidth * innerHeight / 650), cheap() ? 350 : 700, 2000), SX = W / 2 * DEPTH / F * 1.3, SY = H / 2 * DEPTH / F * 1.3;
    stars = Array.from({ length: n }, () => ({ x: (R() * 2 - 1) * SX, y: (R() * 2 - 1) * SY, z: R() * DEPTH, m: .4 + Math.pow(R(), 3) * 1.6, b: .55 + R() * .45, tw: .5 + R() * 2.5, ph: R() * TAU, ci: R() * 7 | 0 }));
  }

  function layout() {
    DPR = Math.min(devicePixelRatio || 1, 1.5);
    const w = Math.round(innerWidth * DPR), h = Math.round(innerHeight * DPR);
    const resized = w !== W || h !== H;
    W = cvs.width = w; H = cvs.height = h;
    bgA.width = W; bgA.height = H; keyA = '';
    CX = W / 2; CY = H / 2; F = Math.min(W, H) * .9; VH = innerHeight;
    const top = (el) => el.getBoundingClientRect().top + scrollY;
    const main = $('main');
    mainEnd = top(main) + main.offsetHeight;
    chapters = $$('.ch').map((el) => ({ el, top: top(el), h: el.offsetHeight, in: el.querySelector('.in'), km: +el.dataset.km, label: el.dataset.label, hero: el.classList.contains('hero') }));
    for (const c of chapters) {
      c.ctr = c.top + c.h / 2 - VH / 2;
      const o = objs[c.el.dataset.obj];
      if (!o) continue;
      o.vd = o.r * o.k; o.z = c.ctr * ZVH / VH + o.vd;
      const phone = innerWidth <= 760;
      o.x = o.side * (phone ? .1 : (o.off || .24)) * W * o.vd / F;
      o.y = (phone ? -.2 : o.side > 0 ? -.03 : .03) * H * o.vd / F;
    }
    const size = Math.round(Math.hypot(innerWidth, innerHeight) * 1.1);
    if (Math.abs(size - milkySize) > 200) { milkySize = size; if (milky) { milky = null; buildLater(); } }
    if (resized || !stars.length) seed();
    if (resized) paintArt();
    lastSy = -1;
    kick();
  }
  const chap = (l) => chapters.find((c) => c.label === l);

  /* readouts: both are one function of the eased scroll value */
  function at(s) {
    const L = chapters.length - 1;
    if (s <= chapters[0].ctr) return chapters[0].km;
    for (let i = 0; i < L; i++) {
      const a = chapters[i], b = chapters[i + 1];
      if (s < b.ctr) {
        const t = smooth(a.ctr, b.ctr, s), A = a.km, B = b.km;
        return A <= 0 ? B * t * t : Math.exp(lerp(Math.log(A), Math.log(B), t));
      }
    }
    return chapters[L].km;
  }
  const n0 = (v) => Math.round(v).toLocaleString('en-US');
  const LY = 9.4607e12;
  function fmtDist(km) {
    if (km < .5) return '0 km';
    if (km < 1e6) return n0(km) + ' km';
    if (km < 1e9) return (km / 1e6).toFixed(1) + ' million km';
    if (km < 1e12) return (km / 1e9).toFixed(2) + ' billion km';
    if (km < LY * .5) return (km / 1e12).toFixed(1) + ' trillion km';
    const ly = km / LY;
    if (ly < 1000) return ly.toFixed(1) + ' light-years';
    if (ly < 1e6) return n0(ly) + ' light-years';
    return (ly / 1e6).toFixed(2) + ' million light-years';
  }
  function fmtAge(km) {
    const s = km / C_KM_S;
    if (s < .05) return 'now';
    if (s < 60) return s.toFixed(1) + ' seconds ago';
    if (s < 3600) return Math.round(s / 60) + ' minutes ago';
    if (s < 86400) return (s / 3600).toFixed(1) + ' hours ago';
    const y = s / 31557600;
    if (y < 1) return Math.round(s / 86400) + ' days ago';
    if (y < 100) return y.toFixed(1) + ' years ago';
    if (y < 1e6) return n0(y) + ' years ago';
    return (y / 1e6).toFixed(2) + ' million years ago';
  }
  const put = (i, s) => { if (last[i] !== s) { out[i].textContent = s; last[i] = s; } };
  const p2 = (n) => String(n).padStart(2, '0');
  function tick() { const d = new Date(); put(2, p2(d.getHours()) + ':' + p2(d.getMinutes()) + ':' + p2(d.getSeconds())); }
  tick(); setInterval(tick, 1000);

  /* drawing */
  function drawMilky(g, a) {
    if (a <= .01 || !milky) return;
    g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = a;
    g.translate(CX - camX * .4 * DPR, CY - camY * .4 * DPR);
    g.rotate(-.55 + sy * .00004);
    const s = milkySize * DPR; g.drawImage(milky, -s / 2, -s / 2, s, s);
    g.restore();
  }
  function drawDeep(g, a) {
    if (a <= .01 || !sprites.deep) return;
    const d = chap('Andromeda'), s = Math.max(W / 1600, H / 1000) * (1 + clamp((sy - d.top) / VH, -1, 3) * .06) * 1.05;
    g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = a;
    g.translate(CX - camX * .15 * DPR, CY - camY * .15 * DPR);
    g.drawImage(sprites.deep, -800 * s, -500 * s, 1600 * s, 1000 * s);
    g.restore();
  }
  function drawBackdrop(ma, da, dim) {
    const key = [Math.round(ma * 200), Math.round(da * 200), Math.round(camX * 2), Math.round(camY * 2), Math.round(sy)].join();
    if (key !== keyA && (milky || sprites.deep)) {
      keyA = key;
      gA.globalCompositeOperation = 'source-over'; gA.globalAlpha = 1;
      gA.fillStyle = '#070b16'; gA.fillRect(0, 0, W, H);
      drawMilky(gA, ma); drawDeep(gA, da);
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.fillStyle = '#070b16'; ctx.fillRect(0, 0, W, H);
    if (keyA) { ctx.globalAlpha = dim; ctx.drawImage(bgA, 0, 0); ctx.globalAlpha = 1; }
  }

  function drawStars(z, t, dim) {
    const twinkle = !reduce && !cheap();
    const streak = reduce ? 0 : clamp(vel * 5, -500, 1100), px = camX * .6, py = camY * .6;
    ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    for (const s of stars) {
      const dz = ((s.z - z) % DEPTH + DEPTH) % DEPTH;
      if (dz < 6) continue;
      const k = F / dz, x = CX + (s.x - px) * k, y = CY + (s.y - py) * k;
      if (x < -80 || x > W + 80 || y < -80 || y > H + 80) continue;
      const near = 1 - dz / DEPTH, tw = twinkle ? .72 + .28 * Math.sin(t * s.tw + s.ph) : .86;
      const a = Math.min(1, .15 + near * 1.9) * tw * s.b * dim;
      if (a < .02) continue;
      const style = starStyle[s.ci][Math.min(BUCKETS - 1, (a * BUCKETS) | 0)];
      const lw = (.8 + near * near * 2.8) * s.m * DPR;
      if (Math.abs(streak) < 2) { ctx.fillStyle = style; ctx.fillRect(x - lw / 2, y - lw / 2, lw, lw); continue; }
      const k2 = F / Math.max(6, dz + streak);
      ctx.strokeStyle = style; ctx.lineWidth = lw;
      ctx.beginPath(); ctx.moveTo(CX + (s.x - px) * k2, CY + (s.y - py) * k2); ctx.lineTo(x + .01, y); ctx.stroke();
    }
  }

  function drawObj(key, camZ) {
    const o = objs[key];
    if (o.z === undefined || !sprites[key]) return;
    const far = o.vd * 3.2, nc = (o.near || .08) * o.vd;
    let dz = o.z - camZ;
    if (o.hold) dz = Math.max(dz, o.vd * o.hold);
    if (dz <= nc * .3 || dz > far) return;
    const k = F / dz, sx = CX + (o.x - camX) * k, sy2 = CY + (o.y - camY) * k, Rr = o.r * k * o.mul;
    if (sx + Rr < -W * .2 || sx - Rr > W * 1.2 || sy2 + Rr < -H * .2 || sy2 - Rr > H * 1.2) return;
    const a = smooth(far, o.vd * 1.9, dz) * (o.hold ? 1 : smooth(nc * .3, nc * 1.6, dz));
    if (a <= .005) return;
    ctx.save();
    if (o.halo) {
      const gr = o.r * k;
      ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a;
      ctx.drawImage(o.halo, sx - gr * 2, sy2 - gr * 2, gr * 4, gr * 4);
    }
    ctx.globalCompositeOperation = key === 'orion' ? 'lighter' : 'source-over'; ctx.globalAlpha = a;
    ctx.translate(sx, sy2);
    if (key === 'moon') ctx.rotate(camZ * .00008);
    if (key === 'orion') ctx.rotate(camZ * .00004);
    ctx.drawImage(sprites[key], -Rr, -Rr, Rr * 2, Rr * 2);
    ctx.restore();
  }

  function choreograph() {
    for (const c of chapters) {
      if (c.hero) {
        const lp = clamp(sy / (VH * .65), 0, 1);
        c.in.style.opacity = (1 - lp).toFixed(3);
        c.in.style.transform = reduce ? 'none' : `translate3d(0,${(-sy * .25).toFixed(1)}px,0) scale(${(1 - lp * .06).toFixed(4)})`;
        c.in.style.visibility = lp >= 1 ? 'hidden' : 'visible';
        continue;
      }
      const lp = (sy - c.top) / Math.max(1, c.h - VH);
      const o = clamp(Math.min((lp + .22) / .32, (1.22 - lp) / .32), 0, 1);
      c.in.style.opacity = o.toFixed(3);
      c.in.style.transform = reduce ? 'none' : `translate3d(0,${((.5 - lp) * 36).toFixed(1)}px,0)`;
      c.in.style.visibility = o < .01 ? 'hidden' : 'visible';
    }
  }

  let first = true;
  function frame(now) {
    const t = reduce ? 0 : (now - t0) / 1000;
    sy = reduce ? scrollY : lerp(sy, scrollY, .085);
    if (Math.abs(scrollY - sy) < .05) sy = scrollY;
    const camZ = sy * ZVH / VH;
    vel = lerp(vel, camZ - lastCam, .35); lastCam = camZ;
    camX = reduce ? 0 : lerp(camX, mx * 40, .04);
    camY = reduce ? 0 : lerp(camY, my * 26, .04);
    const intro = reduce ? 0 : 1 - smooth(.3, 2.6, t), moon = chap('The Moon'), end = chap('Andromeda');
    const ho = (intro * .95).toFixed(2);
    if (ho !== lastHouse) { house.style.opacity = ho; lastHouse = ho; }
    const dim = 1 - intro * .85;
    drawBackdrop(.5 - smooth(moon.ctr, end.ctr, sy) * .3, smooth(end.top - VH * .2, end.ctr, sy), dim);
    drawStars(camZ + (reduce ? 0 : t * 10), t, dim);
    drawObj('andromeda', camZ); drawObj('orion', camZ); drawObj('saturn', camZ); drawObj('moon', camZ);
    paintDome(ctx, W, H, DPR, sy / VH, camX, camY);
    if (sy !== lastSy || intro > 0) { choreograph(); lastSy = sy; }
    const km = at(sy);
    put(0, fmtDist(km)); put(1, fmtAge(km));
    rail();
    if (first) { first = false; requestAnimationFrame(buildLater); }
  }

  /* the route: the same sprites, painted still into the cells */
  function paintArt() {
    for (const c of $$('.art-canvas')) {
      const box = c.parentElement.getBoundingClientRect();
      if (!box.width || !box.height) continue;
      const dpr = Math.min(devicePixelRatio || 1, 2), w = Math.round(box.width * dpr), h = Math.round(box.height * dpr);
      c.width = w; c.height = h;
      const g = c.getContext('2d'), key = c.dataset.body;
      g.clearRect(0, 0, w, h);
      if (key === 'seat') { const hv = Math.max(h, w * .62); g.save(); g.translate(0, h - hv); paintDome(g, w, hv, dpr, 0, 0, 0); g.restore(); continue; }
      const sp = sprites[key];
      if (!sp) continue;
      const o = objs[key], m = key === 'orion' ? 1.15 : key === 'andromeda' ? 1.1 : .92;
      const Rr = Math.min(w, h) / 2 * m, cx = w / 2, cy = h / 2;
      if (o.halo) { g.globalCompositeOperation = 'lighter'; g.drawImage(o.halo, cx - Rr * 2, cy - Rr * 2, Rr * 4, Rr * 4); }
      g.globalCompositeOperation = key === 'orion' ? 'lighter' : 'source-over';
      g.drawImage(sp, cx - Rr, cy - Rr, Rr * 2, Rr * 2);
    }
  }

  /* the stops */
  const say = $('#say');
  const items = $$('.ch').map((el, i) => {
    const li = document.createElement('li'), b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = `<span>${el.dataset.label}</span><i></i>`;
    b.setAttribute('aria-label', `Stop ${i}: ${el.dataset.label}`);
    b.addEventListener('click', () => go(i));
    li.appendChild(b); $('#rail').appendChild(li);
    return b;
  });
  function go(i) {
    const c = chapters[i];
    scrollTo({ top: c.hero ? 0 : c.top + (c.h - VH) * .5, behavior: reduce ? 'auto' : 'smooth' });
  }
  let active = -1, past = null;
  function rail() {
    let idx = 0;
    chapters.forEach((c, i) => { if (c.top <= scrollY + VH * .5) idx = i; });
    const isPast = scrollY > mainEnd - VH * .9;
    if (isPast !== past) { document.body.classList.toggle('past', isPast); past = isPast; }
    if (idx === active) return;
    items.forEach((b, i) => i === idx ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current'));
    if (active >= 0) say.textContent = `Stop ${idx}: ${chapters[idx].label}`;
    active = idx;
  }
  const goTo = (i) => (e) => { e.preventDefault(); go(i); };
  $('#home').addEventListener('click', goTo(0));
  $('#back').addEventListener('click', goTo(0));
  $('#start').addEventListener('click', goTo(1));
  $('#topbtn').addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  /* loop: continuous with motion, one frame per scroll without; nothing runs while the voyage is off screen */
  let raf = 0, seen = true, lastT = -1e9;
  function loop(now) {
    raf = 0;
    if (document.hidden || !seen) return;
    if (now - lastT >= 32 || scrollY !== sy) { lastT = now; frame(now); }
    if (!reduce || scrollY !== sy) raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf && seen && !document.hidden) raf = requestAnimationFrame(loop); }
  addEventListener('scroll', () => { rail(); kick(); }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
  new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (seen) kick(); }).observe($('main'));
  mq.addEventListener('change', (e) => { reduce = e.matches; lastSy = -1; kick(); });
  addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth * 2 - 1; my = e.clientY / innerHeight * 2 - 1; }, { passive: true });
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(layout, 120); });
  if (document.fonts) document.fonts.ready.then(layout);
  layout();
})();
