/* Late Light · the voyage, the board, the band, the footer · Designed using Design Lounge (https://www.designlounge.live) */
'use strict';
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const TAU = Math.PI * 2;
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  let reduce = mq.matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const css = getComputedStyle(document.documentElement);
  const tok = (n) => css.getPropertyValue(n).trim();
  const hexRGB = (h) => { const n = parseInt(h.slice(1), 16); return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`; };
  const C = {
    bg: tok('--bg') || '#06070f',
    sky: hexRGB(tok('--scene-sky') || '#0f1538'),
    moon: hexRGB(tok('--scene-moon') || '#cfd9ff'),
    lamp: hexRGB(tok('--scene-lamp') || '#ffb04a'),
    ember: hexRGB(tok('--scene-ember') || '#ff9a3a'),
    surface: tok('--surface') || '#0e1120',
    surface2: tok('--surface-2') || '#171b30',
  };
  function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  /* ---------- The Moon tonight: phase from the date */
  const SYN = 29.530588853;
  function moonPhase(d = new Date()) {
    const ref = Date.UTC(2000, 0, 6, 18, 14);
    const age = (((d - ref) / 864e5) % SYN + SYN) % SYN;
    const f = (1 - Math.cos(TAU * age / SYN)) / 2;
    const waxing = age < SYN / 2;
    let name;
    if (f < 0.03) name = 'New moon';
    else if (f < 0.47) name = (waxing ? 'Waxing' : 'Waning') + ' crescent';
    else if (f <= 0.53) name = waxing ? 'First quarter' : 'Last quarter';
    else if (f < 0.97) name = (waxing ? 'Waxing' : 'Waning') + ' gibbous';
    else name = 'Full moon';
    return { age, f, waxing, name, pct: Math.round(f * 100) };
  }
  const PH = moonPhase();
  const phaseText = `${PH.name}, ${PH.pct}% lit`;
  $$('[data-phase]').forEach((el) => { el.textContent = phaseText; });

  /* ---------- The hour, where you are */
  const clocks = $$('[data-clock]');
  function tickClock() {
    const d = new Date();
    const s = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    for (const el of clocks) {
      if (el.textContent !== s) el.textContent = s;
      if (el.tagName === 'TIME') el.dateTime = d.toISOString();
    }
  }
  tickClock();
  setInterval(tickClock, 15000);

  /* ---------- Readout formats */
  const LY = 9.4607e12;
  function fmtDist(km) {
    if (km < 0.5) return '0 km';
    if (km < 1e6) return Math.round(km).toLocaleString('en-US') + ' km';
    if (km < 1e9) return Math.round(km / 1e6) + ' million km';
    if (km < 1e12) return (km / 1e9).toFixed(km < 1e10 ? 2 : 1) + ' billion km';
    const ly = km / LY;
    if (ly < 100) return ly.toFixed(2) + ' light years';
    if (ly < 1e6) return Math.round(ly).toLocaleString('en-US') + ' light years';
    if (ly < 1e9) return (ly / 1e6).toFixed(1) + ' million light years';
    return Math.round(ly / 1e9) + ' billion light years';
  }
  function fmtAge(s) {
    if (s < 0.05) return 'just now';
    if (s < 60) return s.toFixed(1) + ' seconds ago';
    if (s < 3600) return Math.round(s / 60) + ' minutes ago';
    if (s < 86400) return (s / 3600).toFixed(1) + ' hours ago';
    const yr = s / 3.15576e7;
    if (yr < 1) return Math.round(s / 86400) + ' days ago';
    if (yr < 100) return yr.toFixed(1) + ' years ago';
    if (yr < 1e6) return Math.round(yr).toLocaleString('en-US') + ' years ago';
    if (yr < 1e9) return (yr / 1e6).toFixed(1) + ' million years ago';
    return (yr / 1e9).toFixed(1) + ' billion years ago';
  }

  /* ---------- Canvas */
  const cv = $('#space');
  const ctx = cv.getContext('2d', { alpha: false });
  let W = 1, H = 1, DPR = 1, CX = 0, CY = 0, F = 1, phone = false, diag = 0;
  const ZVH = 1000, DEPTH = 2600, SR = 2;
  let sy = scrollY, lastSy = scrollY, vel = 0, camX = 0, camY = 0, px = 0, py = 0;
  let voyageEnd = 0;
  const t0 = performance.now();
  let introT = null;

  function size() {
    W = innerWidth; H = innerHeight;
    DPR = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    CX = W / 2; CY = H / 2; F = 0.9 * Math.min(W, H);
    phone = W < 760;
  }

  function mk(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; }
  function radial(g, x, y, r0, r1, stops) { const gr = g.createRadialGradient(x, y, r0, x, y, r1); for (const [o, c] of stops) gr.addColorStop(o, c); return gr; }
  function blob(g, x, y, r, rgb, a) {
    g.globalAlpha = a;
    g.fillStyle = radial(g, x, y, 0, r, [[0, `rgba(${rgb},1)`], [0.4, `rgba(${rgb},.45)`], [1, `rgba(${rgb},0)`]]);
    g.fillRect(x - r, y - r, 2 * r, 2 * r);
    g.globalAlpha = 1;
  }

  /* ---------- Stars */
  let stars = [];
  const STAR_COLS = ['255,255,255', '255,244,224', '214,228,255', '255,228,200'];
  function seedStars() {
    const n = clamp(Math.round(W * H / 650), 700, 2000);
    const r = rng(7);
    const sx = (W / 2) * DEPTH / F * 1.15, sy2 = (H / 2) * DEPTH / F * 1.15;
    stars = new Array(n);
    for (let i = 0; i < n; i++) {
      const b = r();
      stars[i] = { x: (r() * 2 - 1) * sx, y: (r() * 2 - 1) * sy2, z: r() * DEPTH, s: 0.6 + b * b * 1.8, b: 0.45 + r() * 0.55, tw: 0.5 + r() * 2.5, ph: r() * TAU, c: STAR_COLS[(r() * 4) | 0] };
    }
  }
  function drawStars(camZ, t, alphaG, streak) {
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (const s of stars) {
      const dz = ((s.z - camZ) % DEPTH + DEPTH) % DEPTH;
      if (dz < 24) continue;
      const near = 1 - dz / DEPTH, k = F / dz;
      const x = CX + (s.x - camX) * k, y = CY + (s.y - camY) * k;
      if (x < -20 || x > W + 20 || y < -20 || y > H + 20) continue;
      let a = Math.min(1, 0.15 + near * 1.9) * s.b * alphaG;
      a *= reduce ? 0.86 : (0.72 + 0.28 * Math.sin(t * s.tw + s.ph));
      ctx.strokeStyle = `rgba(${s.c},${a.toFixed(3)})`;
      ctx.lineWidth = (0.8 + near * near * 2.8) * s.s;
      let x2 = x, y2 = y;
      if (streak) { const dz2 = dz + streak; if (dz2 > 10) { const k2 = F / dz2; x2 = CX + (s.x - camX) * k2; y2 = CY + (s.y - camY) * k2; } }
      ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x, y); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  /* ---------- Sprites, painted once */
  function litPath(g, R, f, right) {
    const a = 1 - 2 * f;
    g.beginPath(); g.moveTo(0, -R);
    g.arc(0, 0, R, -Math.PI / 2, Math.PI / 2, !right);
    const N = 56;
    for (let i = 0; i <= N; i++) {
      const y = R - 2 * R * i / N;
      const w = Math.sqrt(Math.max(0, 1 - (y / R) * (y / R)));
      g.lineTo((right ? a : -a) * R * w, y);
    }
    g.closePath();
  }
  function paintMoon(R, ph) {
    const ext = 1.6, S = Math.ceil(R * ext) * 2, c = mk(S, S), g = c.getContext('2d'), r = rng(11);
    const dir = ph.waxing ? 1 : -1;
    g.translate(S / 2, S / 2);
    g.fillStyle = radial(g, 0, 0, R * 0.1, R, [[0, '#1c1d29'], [1, '#0b0c15']]);
    g.beginPath(); g.arc(0, 0, R, 0, TAU); g.fill();
    const L = mk(S, S), l = L.getContext('2d');
    l.translate(S / 2, S / 2);
    l.fillStyle = radial(l, dir * R * 0.35, -R * 0.25, R * 0.1, R * 1.25, [[0, '#f2efe7'], [0.6, '#c9c5bb'], [1, '#8d897f']]);
    l.beginPath(); l.arc(0, 0, R, 0, TAU); l.fill();
    l.save(); l.beginPath(); l.arc(0, 0, R, 0, TAU); l.clip();
    const maria = [[-0.25, -0.35, 0.32], [0.15, -0.45, 0.22], [0.3, -0.1, 0.26], [-0.45, 0.05, 0.2], [0.05, 0.15, 0.18], [-0.1, 0.45, 0.14], [0.42, 0.3, 0.12]];
    for (const [mx, my, mr] of maria) {
      l.fillStyle = radial(l, mx * R, my * R, 0, mr * R, [[0, 'rgba(96,94,90,.55)'], [0.7, 'rgba(96,94,90,.35)'], [1, 'rgba(96,94,90,0)']]);
      l.fillRect(-R, -R, 2 * R, 2 * R);
    }
    for (let i = 0; i < 90; i++) {
      const a = r() * TAU, d = Math.sqrt(r()) * 0.93 * R, x = Math.cos(a) * d, y = Math.sin(a) * d, cr = (0.012 + r() * r() * 0.07) * R;
      l.fillStyle = 'rgba(60,58,54,.35)'; l.beginPath(); l.arc(x, y, cr, 0, TAU); l.fill();
      l.lineWidth = Math.max(1, cr * 0.18);
      l.strokeStyle = 'rgba(255,252,240,.4)'; l.beginPath();
      l.arc(x, y, cr, dir > 0 ? Math.PI * 0.6 : -Math.PI * 0.4, dir > 0 ? Math.PI * 1.4 : Math.PI * 0.4); l.stroke();
      l.strokeStyle = 'rgba(0,0,0,.42)'; l.beginPath();
      l.arc(x, y, cr * 0.9, dir > 0 ? -Math.PI * 0.4 : Math.PI * 0.6, dir > 0 ? Math.PI * 0.4 : Math.PI * 1.4); l.stroke();
    }
    l.restore();
    const M = mk(S, S), m = M.getContext('2d');
    m.translate(S / 2, S / 2);
    try { m.filter = `blur(${Math.max(1, R * 0.02)}px)`; } catch (e) { /* no filter, hard edge */ }
    m.fillStyle = '#fff'; litPath(m, R, ph.f, ph.waxing); m.fill();
    l.globalCompositeOperation = 'destination-in'; l.setTransform(1, 0, 0, 1, 0, 0); l.drawImage(M, 0, 0);
    g.drawImage(L, -S / 2, -S / 2);
    g.globalAlpha = 0.3 * ph.f; g.strokeStyle = 'rgba(255,255,250,1)'; g.lineWidth = 1.5; g.beginPath();
    g.arc(0, 0, R - 0.75, dir > 0 ? -Math.PI * 0.45 : Math.PI * 0.55, dir > 0 ? Math.PI * 0.45 : Math.PI * 1.45); g.stroke();
    g.globalAlpha = 1;
    return { cv: c, ext };
  }
  function paintJupiter(R) {
    const ext = 1.3, S = Math.ceil(R * ext) * 2, c = mk(S, S), g = c.getContext('2d'), r = rng(23);
    g.translate(S / 2, S / 2);
    g.save(); g.beginPath(); g.arc(0, 0, R, 0, TAU); g.clip();
    g.fillStyle = '#d9c3a3'; g.fillRect(-R, -R, 2 * R, 2 * R);
    const bands = [[-1, -0.86, '#a98c6c'], [-0.86, -0.72, '#e9dcc3'], [-0.72, -0.58, '#b58b5c'], [-0.58, -0.42, '#ecdfc6'], [-0.42, -0.3, '#9c6a44'], [-0.3, -0.12, '#f0e4cd'], [-0.12, 0.02, '#b98a5e'], [0.02, 0.16, '#efe2c8'], [0.16, 0.3, '#a7744c'], [0.3, 0.46, '#e6d7bb'], [0.46, 0.6, '#b08866'], [0.6, 0.76, '#dccab0'], [0.76, 1, '#9f8a6e']];
    g.rotate(-0.12);
    for (const [y0, y1, col] of bands) { g.fillStyle = col; g.fillRect(-R * 1.3, y0 * R, R * 2.6, (y1 - y0) * R + 1); }
    for (let i = 0; i < 180; i++) {
      const y = (r() * 2 - 1) * R, x = (r() * 2 - 1) * R * 1.2, w = R * (0.08 + r() * 0.22), h = R * (0.008 + r() * 0.022);
      g.globalAlpha = 0.16; g.fillStyle = r() < 0.5 ? '#fff5e0' : '#7d5236';
      g.beginPath(); g.ellipse(x, y, w, h, 0, 0, TAU); g.fill();
    }
    g.globalAlpha = 1;
    g.fillStyle = radial(g, R * 0.3, R * 0.37, 0, R * 0.2, [[0, '#dc7d5c'], [0.55, '#c4634a'], [1, 'rgba(196,99,74,0)']]);
    g.beginPath(); g.ellipse(R * 0.3, R * 0.37, R * 0.2, R * 0.115, 0, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(255,232,212,.4)'; g.lineWidth = R * 0.012;
    g.beginPath(); g.ellipse(R * 0.3, R * 0.37, R * 0.2, R * 0.115, 0, 0, TAU); g.stroke();
    g.rotate(0.12);
    g.fillStyle = radial(g, -R * 0.35, -R * 0.35, R * 0.2, R * 1.35, [[0, 'rgba(255,250,235,.16)'], [0.45, 'rgba(0,0,0,0)'], [0.78, 'rgba(4,5,12,.55)'], [1, 'rgba(4,5,12,.98)']]);
    g.fillRect(-R, -R, 2 * R, 2 * R);
    g.restore();
    g.strokeStyle = 'rgba(255,245,225,.45)'; g.lineWidth = 1.5; g.beginPath(); g.arc(0, 0, R - 0.75, Math.PI * 1.05, Math.PI * 1.75); g.stroke();
    return { cv: c, ext };
  }
  function paintProxima(R) {
    const ext = 2.6, S = Math.ceil(R * ext) * 2, c = mk(S, S), g = c.getContext('2d'), r = rng(31);
    g.translate(S / 2, S / 2);
    g.globalCompositeOperation = 'lighter';
    blob(g, 0, 0, R * 2.5, '255,60,24', 0.26);
    blob(g, 0, 0, R * 1.5, '255,110,50', 0.45);
    for (let i = 0; i < 9; i++) {
      const a = r() * TAU, len = R * (1.4 + r() * 1.0), w = R * (0.03 + r() * 0.06);
      g.save(); g.rotate(a);
      g.fillStyle = radial(g, 0, 0, R * 0.6, len, [[0, 'rgba(255,140,70,.3)'], [1, 'rgba(255,100,50,0)']]);
      g.fillRect(0, -w, len, 2 * w);
      g.restore();
    }
    g.fillStyle = radial(g, 0, 0, 0, R, [[0, '#fff7ea'], [0.22, '#ffd6a6'], [0.52, '#ff7e3c'], [0.8, '#ff3a1a'], [1, 'rgba(255,40,20,0)']]);
    g.beginPath(); g.arc(0, 0, R, 0, TAU); g.fill();
    g.globalCompositeOperation = 'source-over';
    return { cv: c, ext };
  }
  function paintSgrA(R) {
    const ext = 1.9, S = Math.ceil(R * ext) * 2, c = mk(S, S), g = c.getContext('2d'), r = rng(41);
    g.translate(S / 2, S / 2);
    g.globalCompositeOperation = 'lighter';
    blob(g, 0, 0, R * 1.8, C.ember, 0.1);
    for (let i = 0; i < 240; i++) {
      const ang = i / 240 * TAU + (r() - 0.5) * 0.05;
      const rr = R * 0.72 + (r() - 0.5) * R * 0.14;
      const x = Math.cos(ang) * rr, y = Math.sin(ang) * rr;
      const br = 0.5 + 0.5 * Math.cos(ang - 2.3);
      blob(g, x, y, R * 0.22 * (0.8 + 0.5 * br), `255,${Math.round(140 + 80 * br)},${Math.round(40 + 70 * br)}`, 0.09 + 0.2 * br);
    }
    g.strokeStyle = 'rgba(255,236,200,.75)'; g.lineWidth = R * 0.03;
    g.beginPath(); g.arc(0, 0, R * 0.5, 0, TAU); g.stroke();
    g.globalCompositeOperation = 'source-over';
    g.fillStyle = radial(g, 0, 0, R * 0.44, R * 0.52, [[0, '#020208'], [0.7, 'rgba(2,2,8,.9)'], [1, 'rgba(2,2,8,0)']]);
    g.beginPath(); g.arc(0, 0, R * 0.52, 0, TAU); g.fill();
    return { cv: c, ext };
  }
  function paintMilky(d) {
    const w = Math.ceil(d * 1.25), h = Math.ceil(d * 0.42), c = mk(w, h), g = c.getContext('2d'), r = rng(53);
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 1400; i++) {
      const x = r() * w, y = h / 2 + (r() + r() + r() - 1.5) * h * 0.2;
      blob(g, x, y, h * (0.03 + r() * 0.11), r() < 0.7 ? '255,241,214' : '214,226,255', 0.025 + r() * 0.035);
    }
    for (let i = 0; i < 900; i++) {
      const x = r() * w, y = h / 2 + (r() + r() + r() - 1.5) * h * 0.16;
      g.globalAlpha = 0.25 + r() * 0.5; g.fillStyle = r() < 0.6 ? '#fff4dc' : '#d7e3ff';
      g.beginPath(); g.arc(x, y, 0.5 + r() * 0.9, 0, TAU); g.fill();
    }
    g.globalAlpha = 1;
    blob(g, w * 0.52, h * 0.5, h * 0.6, '255,228,190', 0.12);
    g.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 260; i++) {
      const x = r() * w, y = h / 2 + (r() - 0.5) * h * 0.14;
      blob(g, x, y, h * (0.025 + r() * 0.07), '0,0,0', 0.3);
    }
    g.globalCompositeOperation = 'source-over';
    return c;
  }
  function paintDeep(w, h) {
    const c = mk(w, h), g = c.getContext('2d'), r = rng(67);
    const cols = ['255,217,168', '255,233,201', '188,208,255', '217,195,255', '255,255,255'];
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 700; i++) {
      const x = r() * w, y = r() * h, rad = 1.2 + r() * r() * 6, col = cols[(r() * 5) | 0], a = 0.2 + r() * 0.6;
      g.save(); g.translate(x, y); g.rotate(r() * TAU); g.scale(1, 0.35 + r() * 0.65);
      g.fillStyle = radial(g, 0, 0, 0, rad, [[0, `rgba(${col},${a})`], [0.5, `rgba(${col},${a * 0.5})`], [1, `rgba(${col},0)`]]);
      g.fillRect(-rad, -rad, 2 * rad, 2 * rad); g.restore();
    }
    for (let i = 0; i < 12; i++) {
      const x = r() * w, y = r() * h, rad = 9 + r() * 10, col = cols[(r() * 5) | 0];
      g.save(); g.translate(x, y); g.rotate(r() * TAU); g.scale(1, 0.4 + r() * 0.5);
      blob(g, 0, 0, rad, col, 0.5);
      g.strokeStyle = `rgba(${col},.25)`; g.lineWidth = 1; g.beginPath(); g.ellipse(0, 0, rad * 0.8, rad * 0.6, 0, 0, TAU); g.stroke();
      g.restore();
    }
    for (let i = 0; i < 8; i++) {
      const x = r() * w, y = r() * h, len = 18 + r() * 40;
      blob(g, x, y, 6, '255,255,255', 0.9);
      g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 1;
      for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; g.beginPath(); g.moveTo(x - Math.cos(a) * len, y - Math.sin(a) * len); g.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); g.stroke(); }
    }
    g.globalCompositeOperation = 'source-over';
    return c;
  }
  function paintCMB(w, h) {
    const c = mk(w, h), g = c.getContext('2d'), r = rng(79);
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 260; i++) {
      const x = r() * w, y = r() * h, rad = 30 + r() * 110;
      blob(g, x, y, rad, r() < 0.5 ? C.ember : '60,180,255', 0.07 + r() * 0.05);
    }
    g.globalCompositeOperation = 'source-over';
    return c;
  }

  /* ---------- The hill: the opening plate */
  let ground = null;
  function ridgeY(x, base, amp, seed) {
    const r = rng(seed); const p1 = r() * TAU, p2 = r() * TAU, p3 = r() * TAU, f1 = 0.0028 + r() * 0.001, f2 = 0.007 + r() * 0.002, f3 = 0.019;
    return base - amp * (0.55 * Math.sin(x * f1 + p1) + 0.3 * Math.sin(x * f2 + p2) + 0.15 * Math.sin(x * f3 + p3));
  }
  function buildGround() {
    const x0 = (phone ? 0.64 : 0.6) * W;
    const mk2 = (top) => { const h = H - top + 4; const c = mk(W * DPR, h * DPR); const g = c.getContext('2d'); g.scale(DPR, DPR); return { c, g, top, h }; };
    const fill = (L, base, amp, seed, col, plateau) => {
      const { g, top } = L; g.fillStyle = col; g.beginPath(); g.moveTo(0, L.h);
      for (let x = 0; x <= W; x += 4) {
        let y = ridgeY(x, base, amp, seed);
        if (plateau) { const b = smooth(plateau.w * 1.4, plateau.w * 0.8, Math.abs(x - plateau.x)); y = lerp(y, Math.min(y, plateau.y), b); }
        g.lineTo(x, y - top);
      }
      g.lineTo(W, L.h); g.closePath(); g.fill();
    };
    const haze = (L, y, hgt, a) => { const { g, top } = L; const gr = g.createLinearGradient(0, y - top - hgt, 0, y - top); gr.addColorStop(0, `rgba(${C.moon},0)`); gr.addColorStop(1, `rgba(${C.moon},${a})`); g.fillStyle = gr; g.fillRect(0, y - top - hgt, W, hgt); };
    const farBase = H * 0.72, midBase = H * 0.8, nearBase = H * 0.9;
    const far = mk2(H * 0.5), mid = mk2(H * 0.56), near = mk2(H * 0.7);
    haze(far, farBase + H * 0.02, H * 0.12, 0.1);
    fill(far, farBase, H * 0.07, 101, '#121632');
    haze(mid, midBase, H * 0.1, 0.07);
    const plat = { x: x0, y: midBase - H * 0.03, w: W * 0.15 };
    fill(mid, midBase, H * 0.06, 103, '#0b0e1f', plat);
    const g = mid.g, top = mid.top, py0 = plat.y - top;
    const bw = Math.min(W * 0.24, 400), bh = H * 0.052, dr = bw * 0.4;
    g.fillStyle = '#0d1124'; g.fillRect(x0 - bw / 2, py0 - bh, bw, bh + 6);
    g.fillStyle = '#10152b'; g.beginPath(); g.arc(x0, py0 - bh, dr, Math.PI, 0); g.closePath(); g.fill();
    g.save(); g.beginPath(); g.arc(x0, py0 - bh, dr, Math.PI, 0); g.closePath(); g.clip();
    g.fillStyle = radial(g, x0 + dr * 0.9, py0 - bh - dr * 1.1, 0, dr * 1.8, [[0, `rgba(${C.moon},.22)`], [1, `rgba(${C.moon},0)`]]);
    g.fillRect(x0 - dr, py0 - bh - dr, 2 * dr, dr);
    g.restore();
    g.strokeStyle = `rgba(${C.moon},.6)`; g.lineWidth = 1.5; g.beginPath(); g.arc(x0, py0 - bh, dr - 0.75, -1.45, 0.05); g.stroke();
    g.strokeStyle = 'rgba(14,18,36,1)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x0 - bw / 2, py0 - bh); g.lineTo(x0 + bw / 2, py0 - bh); g.stroke();
    g.fillStyle = `rgba(${C.lamp},.95)`; g.fillRect(x0 - bw / 2 + bw * 0.1, py0 - bh * 0.72, Math.max(3, bw * 0.02), bh * 0.72);
    fill(near, nearBase, H * 0.05, 107, '#05060d');
    const lamps = [];
    for (let i = 0; i < 4; i++) { const lx = x0 - bw / 2 - W * 0.04 - i * W * 0.045; lamps.push({ x: lx, y: ridgeY(lx, midBase, H * 0.06, 103) - 4, f: i * 1.7 }); }
    ground = { far, mid, near, x0, door: { x: x0 - bw / 2 + bw * 0.1, y: py0 - bh * 0.36 + top }, lamps, midBase };
  }
  function drawGround(s, t, lampA) {
    if (!ground) return;
    const a = 1 - smooth(0.75, 1.1, s);
    if (a <= 0) return;
    const off = sy;
    const par = finePointer && !reduce ? camX / 40 : 0;
    const layers = [[ground.far, 0.55, 4], [ground.mid, 0.75, 8], [ground.near, 1.0, 14]];
    ctx.globalAlpha = a;
    for (const [L, k, pp] of layers) {
      const y = L.top + off * k;
      if (y > H) continue;
      ctx.drawImage(L.c, par * pp, y, W, L.h);
      if (L === ground.mid) {
        ctx.globalCompositeOperation = 'lighter';
        const dy = off * k, dx = par * pp;
        const flick = reduce ? 1 : 0.86 + 0.14 * Math.sin(t * 3.1) * Math.sin(t * 1.3 + 1);
        blob(ctx, ground.door.x + dx, ground.door.y + dy, Math.min(W * 0.07, 120), C.lamp, 0.42 * lampA * flick * a);
        blob(ctx, ground.x0 + dx, ground.midBase + dy, Math.min(W * 0.32, 520), C.lamp, 0.07 * lampA * a);
        for (const l of ground.lamps) {
          const fl = reduce ? 0.9 : 0.62 + 0.38 * Math.sin(t * 2.6 + l.f) * Math.sin(t * 1.1 + l.f);
          blob(ctx, l.x + dx, l.y + dy, 16, C.lamp, 0.55 * lampA * fl * a);
          ctx.globalAlpha = lampA * a; ctx.fillStyle = `rgba(${C.lamp},1)`; ctx.beginPath(); ctx.arc(l.x + dx, l.y + dy, 1.4, 0, TAU); ctx.fill(); ctx.globalAlpha = a;
        }
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- Bodies and chapters */
  const objs = {
    moon: { r: 150, k: 4.2, mul: 1, side: 1, off: 0.26, paint: (R) => paintMoon(R, PH) },
    jupiter: { r: 170, k: 4.4, mul: 1, side: -1, off: 0.25, paint: paintJupiter },
    proxima: { r: 110, k: 4.0, mul: 1, side: 1, off: 0.24, paint: paintProxima },
    sgra: { r: 160, k: 4.0, mul: 1, side: -1, off: 0.22, paint: paintSgrA },
  };
  for (const o of Object.values(objs)) { const sp = o.paint(o.r * SR); o.cv = sp.cv; o.ext = sp.ext; o.vd = o.r * o.k; }
  let milky = null, deep = null, cmb = null;
  function buildPlates() { milky = paintMilky(diag); deep = paintDeep(W, H); cmb = paintCMB(W, H); }

  const secs = $$('main > section.ch');
  const chapters = secs.map((el, i) => ({ el, i, inEl: $('.in', el), label: el.dataset.label, km: +el.dataset.km, lt: +el.dataset.lt, obj: el.dataset.obj || null, top: 0, h: 0, ctr: 0, lastOp: -1, lastY: -1 }));
  function layout() {
    for (const c of chapters) {
      const r = c.el.getBoundingClientRect();
      c.top = r.top + scrollY; c.h = r.height; c.ctr = c.top + c.h / 2 - H / 2;
      const o = c.obj && objs[c.obj];
      if (o) {
        o.vd = o.r * o.k;
        o.z = c.ctr * ZVH / H + o.vd;
        o.x = o.side * o.off * W * o.vd / F;
        o.y = (phone ? -0.26 : (o.side > 0 ? -0.03 : 0.03)) * H * o.vd / F;
      }
    }
    const last = chapters[chapters.length - 1];
    voyageEnd = last.top + last.h;
  }
  function drawBody(o, camZ, s) {
    const dz = o.z - camZ;
    if (dz <= 10) return;
    const k = F / dz;
    let x = CX + (o.x - camX) * k, y = CY + (o.y - camY) * k;
    const R = o.r * k * o.mul;
    const nc = 0.08 * o.vd;
    const a = smooth(o.vd * 3.6, o.vd * 2.0, dz) * smooth(nc * 0.3, nc * 1.6, dz);
    if (o === objs.moon) {
      const e = 1 - smooth(0, 1.5, s);
      x += ((phone ? 0.7 : 0.76) * W - CX) * e;
      y += ((phone ? 0.2 : 0.22) * H - CY) * e;
      const haze = 0.3 + 0.7 * (1 - smooth(0.3, 1.2, s));
      const ha = Math.max(a, e);
      ctx.globalCompositeOperation = 'lighter';
      blob(ctx, x, y, R * 9, C.moon, 0.05 * haze * ha);
      blob(ctx, x, y, R * 4.5, C.moon, 0.09 * haze * ha);
      blob(ctx, x, y, R * 2.2, C.moon, 0.16 * haze * ha);
      ctx.globalCompositeOperation = 'source-over';
      if (a < 0.005 && e > 0) { ctx.globalAlpha = e; ctx.drawImage(o.cv, x - R * o.ext, y - R * o.ext, 2 * R * o.ext, 2 * R * o.ext); ctx.globalAlpha = 1; return; }
    }
    if (a <= 0.005 || R < 0.4) return;
    ctx.globalAlpha = a;
    ctx.drawImage(o.cv, x - R * o.ext, y - R * o.ext, 2 * R * o.ext, 2 * R * o.ext);
    if (o === objs.jupiter) {
      ctx.globalCompositeOperation = 'lighter';
      const moons = [[2.1, 0.03], [3.0, 0.028], [4.0, 0.04], [5.2, 0.036]];
      for (const [d, sz] of moons) {
        const mx = x - R * d, my = y + R * d * 0.08;
        if (mx < -10) continue;
        blob(ctx, mx, my, Math.max(3, R * sz * 2.2), '240,228,210', 0.6 * a);
        ctx.fillStyle = 'rgba(245,236,220,1)'; ctx.beginPath(); ctx.arc(mx, my, Math.max(1.2, R * sz), 0, TAU); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- Readouts */
  const roDist = $('#ro-dist'), roAge = $('#ro-age');
  let lastDist = '', lastAge = '';
  function at(s, key) {
    const L = chapters.length - 1;
    if (s <= chapters[0].ctr) return chapters[0][key];
    for (let i = 0; i < L; i++) {
      const a = chapters[i], b = chapters[i + 1];
      if (s < b.ctr) {
        const t = smooth(a.ctr, b.ctr, s), A = a[key], B = b[key];
        return A <= 0 ? B * t * t : Math.exp(lerp(Math.log(A), Math.log(B), t));
      }
    }
    return chapters[L][key];
  }
  function put(el, s, last) { if (s !== last) el.textContent = s; return s; }

  /* ---------- Index */
  const rail = $('#rail'), live = $('#live');
  let current = -1;
  chapters.forEach((c, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('aria-label', `Stop ${i + 1}: ${c.label}`);
    b.innerHTML = `<span>${c.label}</span><i></i>`;
    b.addEventListener('click', () => { const top = c.i === 0 ? 0 : c.top + (c.h - H) / 2; scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' }); });
    li.appendChild(b); rail.appendChild(li); c.btn = b;
  });
  function setCurrent(i) {
    if (i === current) return;
    chapters.forEach((c, j) => { if (j === i) c.btn.setAttribute('aria-current', 'true'); else c.btn.removeAttribute('aria-current'); });
    if (current !== -1) live.textContent = `Stop ${i + 1}: ${chapters[i].label}`;
    current = i;
  }
  $('#back').addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  /* ---------- Copy */
  function placeCopy() {
    const h = chapters[0];
    const op = clamp(1 - sy / (0.65 * H), 0, 1);
    if (op !== h.lastOp) {
      h.inEl.style.opacity = op.toFixed(3);
      h.inEl.style.transform = reduce ? 'none' : `translateY(${(-0.25 * sy).toFixed(1)}px) scale(${(1 - 0.06 * (1 - op)).toFixed(4)})`;
      h.inEl.style.visibility = op < 0.01 ? 'hidden' : 'visible';
      h.lastOp = op;
    }
    for (let i = 1; i < chapters.length; i++) {
      const c = chapters[i];
      const lp = (sy - c.top) / (c.h - H);
      const op = clamp(Math.min((lp + 0.22) / 0.32, (1.22 - lp) / 0.32), 0, 1);
      const y = reduce ? 0 : lerp(18, -18, clamp(lp, 0, 1));
      if (op !== c.lastOp || y !== c.lastY) {
        c.inEl.style.opacity = op.toFixed(3);
        c.inEl.style.transform = y ? `translateY(${y.toFixed(1)}px)` : 'none';
        c.inEl.style.visibility = op < 0.01 ? 'hidden' : 'visible';
        c.lastOp = op; c.lastY = y;
      }
    }
    let cur = 0;
    for (let i = 0; i < chapters.length; i++) if (chapters[i].top <= sy + H / 2) cur = i;
    setCurrent(cur);
    const past = sy > voyageEnd - H * 0.6;
    if (past !== document.body.classList.contains('past')) document.body.classList.toggle('past', past);
  }

  /* ---------- The frame */
  function frame(now) {
    if (reduce) sy = scrollY;
    else { sy += (scrollY - sy) * 0.085; if (Math.abs(scrollY - sy) < 0.05) sy = scrollY; }
    const t = (now - t0) / 1000;
    if (introT === null) introT = now;
    const intro = reduce ? 1 : smooth(0.2, 2.4, (now - introT) / 1000);
    vel = reduce ? 0 : lerp(vel, sy - lastSy, 0.35);
    lastSy = sy;
    if (finePointer && !reduce) { camX += (px * 40 - camX) * 0.04; camY += (py * 26 - camY) * 0.04; }
    const s = sy / H;
    const camZ = sy * ZVH / H;
    const atm = 1 - smooth(0.25, 1.15, s);
    const lastC = chapters[chapters.length - 1];
    const firstP = clamp((sy - lastC.top + H) / (lastC.h), 0, 1);
    const sgraP = chapters.length > 4 ? smooth(chapters[3].ctr - H, chapters[3].ctr + H * 0.6, sy) : 0;

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);

    if (atm > 0) {
      const gr = ctx.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, `rgba(${C.sky},0)`); gr.addColorStop(0.55, `rgba(${C.sky},.55)`); gr.addColorStop(1, `rgba(${C.sky},1)`);
      ctx.globalAlpha = atm; ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
    }
    if (milky) {
      const mwA = (0.3 + 0.3 * (1 - atm)) * (1 - 0.7 * firstP) + 0.45 * sgraP * (1 - firstP);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = clamp(mwA, 0, 0.95);
      ctx.translate(CX - camX * 0.4, CY - camY * 0.4 + atm * H * 0.08); ctx.rotate(-0.52); ctx.scale(1 + s * 0.015, 1 + s * 0.015);
      ctx.drawImage(milky, -milky.width / 2, -milky.height / 2); ctx.restore();
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }
    const starA = (0.55 + 0.45 * (1 - atm)) * (0.3 + 0.7 * intro) * (1 - 0.5 * firstP);
    const streak = reduce ? 0 : clamp(vel * 5, -500, 1100);
    drawStars(camZ + (reduce ? 0 : t * 10), t, starA, streak);

    const order = Object.values(objs).filter((o) => o.z !== undefined).sort((a, b) => (b.z - camZ) - (a.z - camZ));
    for (const o of order) drawBody(o, camZ, s);

    if (deep && firstP > 0) {
      const z = 1 + firstP * 0.06 * 2;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = smooth(0, 0.55, firstP);
      ctx.translate(CX - camX * 0.15, CY - camY * 0.15); ctx.scale(z, z); ctx.drawImage(deep, -W / 2, -H / 2); ctx.restore();
      ctx.globalAlpha = smooth(0.45, 1, firstP) * 0.5;
      ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(cmb, 0, 0); ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    drawGround(s, t, intro);
    placeCopy();
    lastDist = put(roDist, fmtDist(at(sy, 'km')), lastDist);
    lastAge = put(roAge, fmtAge(at(sy, 'lt')), lastAge);
  }

  /* ---------- Loop */
  let raf = 0, lastT = 0, pending = false;
  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (now - lastT < 31) return;
    lastT = now; frame(now);
  }
  function once() { if (pending) return; pending = true; requestAnimationFrame((now) => { pending = false; frame(now); }); }
  function start() { if (reduce) { once(); return; } if (!raf) raf = requestAnimationFrame(loop); }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
  mq.addEventListener('change', (e) => { reduce = e.matches; stop(); sy = scrollY; start(); });
  addEventListener('scroll', () => { if (reduce) once(); }, { passive: true });
  if (finePointer) addEventListener('pointermove', (e) => { px = e.clientX / W - 0.5; py = e.clientY / H - 0.5; }, { passive: true });

  let rt = 0;
  function rebuild(full) {
    const oldDiag = diag;
    size(); diag = Math.hypot(W, H);
    seedStars(); buildGround(); layout();
    if (full || Math.abs(diag - oldDiag) > 200 || !milky) buildPlates();
    else { deep = paintDeep(W, H); cmb = paintCMB(W, H); }
    once();
  }
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => rebuild(false), 120); });
  rebuild(true);
  start();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { layout(); once(); });
  addEventListener('load', () => { layout(); once(); });

  /* ---------- The departures board */
  const board = $('#flaps');
  const rows = $$('.row', board);
  let timers = [];
  function buildRow(row) {
    row.innerHTML = '';
    for (const key of ['a', 'b']) {
      const grp = document.createElement('span'); grp.className = 'grp';
      for (const ch of row.dataset[key]) {
        const c = document.createElement('span');
        c.className = ch === ' ' ? 'cell sp' : 'cell';
        c.textContent = ch === ' ' ? ' ' : ch; c.dataset.g = ch;
        grp.appendChild(c);
      }
      row.appendChild(grp);
    }
  }
  rows.forEach(buildRow);
  const cells = $$('.cell:not(.sp)', board);
  function settle() {
    timers.forEach(clearTimeout); timers = [];
    if (reduce) { cells.forEach((c) => { c.textContent = c.dataset.g; c.classList.remove('dot', 'flip'); }); return; }
    cells.forEach((c) => { c.textContent = '·'; c.classList.add('dot'); c.classList.remove('flip'); });
    cells.forEach((c, i) => {
      timers.push(setTimeout(() => { c.textContent = c.dataset.g; c.classList.remove('dot'); c.classList.add('flip'); }, 40 + i * 28));
    });
  }
  cells.forEach((c) => { c.textContent = c.dataset.g; });
  let settled = false;
  const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting && !settled) { settled = true; settle(); io.disconnect(); } }, { threshold: 0.3 });
  io.observe(board);
  $('#replay').addEventListener('click', settle);

  /* ---------- Take a seat */
  const form = $('#form'), email = $('#email'), go = $('.go', form), msg = $('#msg'), rowf = $('#rowf');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = email.value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    if (!ok) { rowf.classList.add('bad'); msg.textContent = 'That address looks short a letter or two.'; email.focus(); return; }
    rowf.classList.remove('bad'); rowf.classList.add('done');
    msg.textContent = `Noted for ${v}. One email, when the dates are set.`;
    email.disabled = true; go.disabled = true; go.textContent = 'Noted';
  });
  email.addEventListener('input', () => { if (rowf.classList.contains('bad')) { rowf.classList.remove('bad'); msg.textContent = ''; } });
})();
