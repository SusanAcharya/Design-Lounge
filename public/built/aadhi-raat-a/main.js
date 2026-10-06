/* Aadhi Raat Records · Designed using Design Lounge (https://www.designlounge.live) */
(() => {
  'use strict';

  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NPT_OFFSET = 345 * 60000; // Nepal is UTC+5:45 all year, no daylight saving
  const LAT = 27.7172, LON = 85.324;
  const pad2 = (n) => String(n).padStart(2, '0');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const rng = (s) => () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);

  /* ---------- Kathmandu time, sunrise, moon ---------- */
  function nptParts(d = new Date()) {
    const n = new Date(d.getTime() + NPT_OFFSET);
    return { y: n.getUTCFullYear(), mo: n.getUTCMonth(), d: n.getUTCDate(), h: n.getUTCHours(), m: n.getUTCMinutes(), s: n.getUTCSeconds() };
  }
  function sunriseMinutes(p) {
    const doy = Math.floor((Date.UTC(p.y, p.mo, p.d) - Date.UTC(p.y, 0, 0)) / 864e5);
    const g = 2 * Math.PI / 365 * (doy - 1);
    const eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    const lat = LAT * Math.PI / 180;
    const ha = Math.acos(Math.cos(90.833 * Math.PI / 180) / (Math.cos(lat) * Math.cos(decl)) - Math.tan(lat) * Math.tan(decl)) * 180 / Math.PI;
    return Math.round(720 - 4 * (LON + ha) - eq + 345);
  }
  function moonNow(d = new Date()) {
    const P = 29.530588853;
    const ref = Date.UTC(2000, 0, 6, 18, 14) / 864e5;
    const age = (((d.getTime() / 864e5 - ref) % P) + P) % P;
    const k = (1 - Math.cos(2 * Math.PI * age / P)) / 2;
    return { age, k, waxing: age < P / 2, P };
  }
  const hm = (min) => `${pad2(Math.floor(min / 60) % 24)}:${pad2(min % 60)}`;

  /* ---------- Clock, status, readouts ---------- */
  const clk = document.getElementById('clk');
  const stTitle = document.getElementById('stTitle');
  const stLine = document.getElementById('stLine');
  const moonRead = document.getElementById('moonRead');
  const sunRead = document.getElementById('sunRead');
  let sunriseMin = 360;

  function tick() {
    const p = nptParts();
    sunriseMin = sunriseMinutes(p);
    const sec = p.h * 3600 + p.m * 60 + p.s;
    const t = `${pad2(p.h)}:${pad2(p.m)}:${pad2(p.s)}`;
    clk.textContent = t;
    clk.setAttribute('datetime', `${p.y}-${pad2(p.mo + 1)}-${pad2(p.d)}T${t}+05:45`);
    const open = sec < sunriseMin * 60;
    document.body.classList.toggle('rec', open);
    if (open) {
      stTitle.textContent = 'After midnight now';
      stLine.textContent = `Until sunrise at ${hm(sunriseMin)}`;
    } else {
      const left = 86400 - sec;
      stTitle.textContent = 'Midnight in Kathmandu';
      stLine.textContent = `in ${pad2(Math.floor(left / 3600))}:${pad2(Math.floor(left / 60) % 60)}:${pad2(left % 60)}`;
    }
    const m = moonNow();
    const pct = Math.round(m.k * 100);
    let phase = m.waxing ? 'waxing' : 'waning';
    if (m.age < 1 || m.age > m.P - 1) phase = 'Aunsi, new moon';
    else if (Math.abs(m.age - m.P / 2) < 1) phase = 'Purnima, full moon';
    moonRead.textContent = `Moon ${pct}% lit, ${phase}`;
    sunRead.textContent = `Sunrise ${hm(sunriseMin)}`;
  }
  tick();
  setTimeout(() => { tick(); setInterval(tick, 1000); }, 1000 - (Date.now() % 1000));

  /* ---------- Title letters ---------- */
  const title = document.querySelector('.title');
  let n = 0;
  title.querySelectorAll('[data-split]').forEach((w) => {
    for (const c of w.dataset.split) {
      const s = document.createElement('span');
      s.className = 'ch';
      s.style.setProperty('--n', n++);
      s.textContent = c === ' ' ? '\u00a0' : c;
      w.append(s);
    }
  });
  requestAnimationFrame(() => requestAnimationFrame(() => title.classList.add('go')));

  /* ---------- Sprites ---------- */
  function sprite(r, rgb, core = .25) {
    const c = document.createElement('canvas'); c.width = c.height = r * 2;
    const g = c.getContext('2d'), gr = g.createRadialGradient(r, r, 0, r, r, r);
    gr.addColorStop(0, `rgba(${rgb},1)`);
    gr.addColorStop(core, `rgba(${rgb},.35)`);
    gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr; g.fillRect(0, 0, r * 2, r * 2); return c;
  }
  const SP = {
    bone: sprite(32, '236,232,246', .18),
    sodium: sprite(32, '255,173,85', .22),
    cool: sprite(32, '214,226,255', .22),
    red: sprite(32, '255,94,43', .2),
    gold: sprite(64, '255,196,120', .18),
  };

  /* ---------- Ridge generator ---------- */
  function ridge(seed, n, rough, sharp) {
    const R = rng(seed), p = new Array(n).fill(0);
    p[0] = R(); p[n - 1] = R();
    for (let step = n - 1, sc = 1; step > 1; step /= 2, sc *= rough)
      for (let k = step / 2; k < n; k += step)
        p[k] = (p[k - step / 2] + p[k + step / 2]) / 2 + (R() - .5) * sc;
    const lo = Math.min(...p), hi = Math.max(...p);
    return p.map((v) => Math.pow((v - lo) / (hi - lo), sharp));
  }

  /* ---------- Moon drawing (real phase) ---------- */
  function drawMoon(x, cx, cy, r, m, glow = 1) {
    const lit = m.waxing ? 1 : -1;
    const hx = cx + lit * r * .3, hy = cy + r * .1;
    const strength = .35 + .65 * m.k;
    const halo = (r0, r1, a) => {
      const g = x.createRadialGradient(hx, hy, r0, hx, hy, r1);
      g.addColorStop(0, `rgba(255,236,206,${a})`);
      g.addColorStop(.4, `rgba(240,226,210,${a * .32})`);
      g.addColorStop(1, 'rgba(240,226,210,0)');
      x.fillStyle = g; x.fillRect(hx - r1, hy - r1, r1 * 2, r1 * 2);
    };
    x.save();
    x.globalCompositeOperation = 'lighter';
    halo(r * .6, r * 10, .15 * strength * glow);
    halo(r * .6, r * 3.2, .2 * strength * glow);
    halo(r * .7, r * 1.6, .26 * strength * glow);
    x.globalCompositeOperation = 'source-over';
    x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2);
    x.fillStyle = 'rgba(14,16,40,.92)'; x.fill();
    x.fillStyle = 'rgba(200,205,235,.07)'; x.fill();
    x.translate(cx, cy);
    if (!m.waxing) x.scale(-1, 1);
    const rx = r * Math.abs(1 - 2 * m.k);
    x.beginPath();
    x.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false);
    if (m.k < .5) x.ellipse(0, 0, Math.max(rx, .01), r, 0, Math.PI / 2, -Math.PI / 2, true);
    else x.ellipse(0, 0, Math.max(rx, .01), r, 0, Math.PI / 2, Math.PI * 1.5, false);
    x.closePath();
    const g = x.createRadialGradient(r * .25, -r * .2, r * .1, 0, 0, r);
    g.addColorStop(0, '#fffaf0'); g.addColorStop(1, '#e2d8bf');
    x.fillStyle = g; x.fill();
    x.globalAlpha = .12; x.fillStyle = '#8b8a9e';
    [[.3, -.25, .22], [-.15, .2, .16], [.1, .45, .12], [-.35, -.3, .1]].forEach(([a, b, c]) => { x.beginPath(); x.arc(a * r, b * r, c * r, 0, Math.PI * 2); x.fill(); });
    x.restore();
  }

  /* ---------- The valley ---------- */
  const cv = document.getElementById('sky');
  const hero = document.querySelector('.hero');
  const ctx = cv.getContext('2d');
  const M = 80;
  let W = 0, H = 0, DPR = 1, layers = [], stars = [], windows = [], valleyLights = [], motes = [], stupa = null, moon = null;
  let ptr = { x: .5, y: .5 }, ease = { x: .5, y: .5 }, pointerX = -1;
  let analyser = null, waveData = null;
  let ac = null, out = null, playing = false, token = 0, sched = 0, nextT = 0, step = 0;

  function off(w, h) {
    const c = document.createElement('canvas');
    c.width = Math.ceil(w * DPR); c.height = Math.ceil(h * DPR);
    const g = c.getContext('2d'); g.setTransform(DPR, 0, 0, DPR, 0, 0);
    return { c, g };
  }

  function build() {
    const r = hero.getBoundingClientRect();
    W = r.width; H = r.height; DPR = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    const A = H * Math.min(1, .55 + .4 * W / H);
    const LW = W + M * 2;
    const R = rng(7);
    moon = { x: W * (W < 640 ? .74 : .76), y: H * (W < 640 ? .2 : .19), r: Math.max(24, Math.min(W, H) * .05), m: moonNow() };

    // Stars: fewer near the horizon, the city's haze swallows them
    stars = [];
    const count = Math.round(W * H / 2400);
    for (let i = 0; i < count; i++) stars.push({ x: R() * LW - M, y: Math.pow(R(), 1.6) * H * .62, s: .35 + R() * 1.7, a: .35 + R() * .65, sp: .4 + R() * 1.8, ph: R() * 6.28 });
    for (let i = 0; i < 200; i++) { const t = R(); stars.push({ x: (.02 + t * .55) * W + (R() - .5) * 90, y: t * .55 * H + (R() - .5) * 70, s: .3 + R() * .7, a: .2 + R() * .4, sp: .5 + R(), ph: R() * 6.28 }); }

    const defs = [
      { seed: 11, base: .6, amp: .2, rough: .7, sharp: 1.7, px: 8, sy: .04, kind: 'himal' },
      { seed: 23, base: .7, amp: .085, rough: .5, sharp: 1, px: 18, sy: .11, kind: 'rim' },
      { seed: 37, base: .79, amp: .05, rough: .45, sharp: 1, px: 32, sy: .18, kind: 'hill' },
      { seed: 53, base: .9, amp: 0, rough: 0, sharp: 1, px: 54, sy: .25, kind: 'city' },
    ];
    const fills = ['#1d2352', '#10142f', '#0a0c20', '#060712'];
    layers = []; windows = []; valleyLights = []; motes = [];

    defs.forEach((d, i) => {
      const L = off(LW, H), g = L.g;
      g.translate(M, 0);
      const pts = [];
      const nPts = 129, dx = LW / (nPts - 1);
      if (d.kind !== 'city') {
        const pr = ridge(d.seed, nPts, d.rough, d.sharp);
        for (let k = 0; k < nPts; k++) {
          let y = H * d.base - pr[k] * d.amp * A;
          const xx = k * dx - M;
          if (d.kind === 'hill') { // Swayambhu's hill rises out of the valley floor
            const sx = W * (W < 640 ? .7 : .63);
            y -= Math.exp(-Math.pow((xx - sx) / (W < 640 ? 70 : 120), 2)) * H * .075;
          }
          pts.push([xx, y]);
        }
        g.beginPath(); g.moveTo(-M, H);
        pts.forEach(([xx, y]) => g.lineTo(xx, y));
        g.lineTo(W + M, H); g.closePath();
        if (i === 0) {
          const top = Math.min(...pts.map((p) => p[1]));
          const gr = g.createLinearGradient(0, top, 0, top + H * .4);
          gr.addColorStop(0, '#5f6797'); gr.addColorStop(.12, '#353c74'); gr.addColorStop(.4, '#1f2556'); gr.addColorStop(1, '#171c46');
          g.fillStyle = gr;
        } else g.fillStyle = fills[i];
        g.fill();
        if (i === 0) { // moon wash clipped to the Himalaya
          g.save(); g.clip();
          const mw = g.createRadialGradient(moon.x, moon.y, 0, moon.x, moon.y, W * .45);
          mw.addColorStop(0, `rgba(255,232,200,${.22 * (.4 + .6 * moon.m.k)})`); mw.addColorStop(1, 'rgba(255,232,200,0)');
          g.fillStyle = mw; g.fillRect(-M, 0, LW, H); g.restore();
        }
        if (i <= 1) { // snow faces turned toward the moon
          const top = Math.min(...pts.map((p) => p[1]));
          const baseY = H * d.base;
          for (let k = 0; k < pts.length - 1; k++) {
            const [x0, y0] = pts[k], [x1, y1] = pts[k + 1];
            const alt = clamp((baseY - Math.min(y0, y1)) / (baseY - top + 1));
            if (alt < .28) continue;
            const f = (y1 - y0) / dx * Math.sign(moon.x - (x0 + dx / 2));
            if (Math.abs(f) < .04) continue;
            const depth = 3 + Math.min(1, Math.abs(f)) * .16 * (baseY - top) * alt;
            const gr = g.createLinearGradient(0, Math.min(y0, y1), 0, Math.min(y0, y1) + depth * 1.3);
            const c = f > 0 ? '238,240,255' : '5,8,26';
            gr.addColorStop(0, `rgba(${c},1)`); gr.addColorStop(1, `rgba(${c},0)`);
            g.globalAlpha = Math.min(1, Math.abs(f) * 1.5) * (alt - .28) / .72 * (f > 0 ? (i === 0 ? .85 : .3) : .45) * (f > 0 ? (.45 + .55 * moon.m.k) : 1);
            g.fillStyle = gr;
            g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.lineTo(x1, y1 + depth); g.lineTo(x0, y0 + depth); g.closePath(); g.fill();
          }
          g.globalAlpha = 1;
        }
        if (d.kind === 'rim' || d.kind === 'hill') { // scattered house lights on the slopes
          const Rl = rng(d.seed * 3), num = Math.round(W / (d.kind === 'rim' ? 26 : 12));
          for (let k = 0; k < num; k++) {
            const xx = Rl() * LW - M;
            const idx = clamp(Math.round((xx + M) / dx), 0, nPts - 1);
            const yTop = pts[idx][1];
            const y = yTop + 6 + Rl() * (H * (d.kind === 'rim' ? .05 : .08));
            valleyLights.push({ layer: i, x: xx, y, r: .4 + Rl() * (d.kind === 'rim' ? .7 : 1.1), warm: Rl() < .82, f: Rl() * 100, str: d.kind === 'rim' ? .5 : .8 });
          }
        }
        if (d.kind === 'hill') stupa = buildStupa(g, pts, dx, fills[i]);
      } else {
        // The city: stepped roofs, two pagodas, lit windows
        const Rc = rng(d.seed);
        g.fillStyle = fills[i];
        let xx = -M;
        const base = H * .9;
        const pagodas = [W * .2, W * .86];
        while (xx < W + M) {
          const bw = 14 + Rc() * 40;
          const bh = H * (.018 + Rc() * .05) + (Rc() < .12 ? H * .03 : 0);
          const top = base - bh;
          g.fillRect(xx, top, bw + 1, H - top);
          if (Rc() < .3) g.fillRect(xx + bw * .2, top - 4, bw * .25, 4); // water tank on the roof
          for (let wy = top + 5; wy < H - 6; wy += 10) {
            for (let wx = xx + 4; wx < xx + bw - 5; wx += 8) {
              const p = Rc();
              const late = (wy - base) / (H - base);
              if (p < .27 - late * .08) windows.push({ x: wx, y: wy, w: 3.2, h: 4.2, warm: Rc() < .78, f: Rc() * 100 });
            }
          }
          xx += bw + (Rc() < .2 ? 3 : 0);
        }
        pagodas.forEach((px, j) => {
          const s = clamp(H / 800, .8, 1.3) * (j ? .8 : 1);
          let y = base - H * .035;
          g.fillRect(px - 14 * s, y, 28 * s, H - y);
          [[30, 9], [24, 8], [18, 7]].forEach(([w, h]) => {
            g.beginPath();
            g.moveTo(px - w * s, y); g.lineTo(px + w * s, y);
            g.lineTo(px + w * .45 * s, y - h * s); g.lineTo(px - w * .45 * s, y - h * s); g.closePath(); g.fill();
            y -= h * s;
            g.fillRect(px - w * .32 * s, y - 5 * s, w * .64 * s, 5 * s);
            y -= 5 * s;
          });
          g.fillRect(px - 1.2 * s, y - 12 * s, 2.4 * s, 12 * s);
          windows.push({ x: px - 3 * s, y: base - H * .02, w: 6 * s, h: 5 * s, warm: true, f: j * 7, glow: 1 });
        });
        for (let k = 0; k < 40; k++) motes.push({ x: Rc() * W, y: base - Rc() * H * .25, life: Rc(), spd: .00006 + Rc() * .00012, sway: 4 + Rc() * 16, s: 4 + Rc() * 8, ph: Rc() * 6 });
      }
      // mist pooled at the foot of each layer
      const nextBase = defs[i + 1] ? defs[i + 1].base : null;
      layers.push({ c: L.c, px: d.px, sy: d.sy, mist: nextBase ? { y0: H * (nextBase - .2), y1: H * nextBase, a: .3 - .07 * i } : null });
    });
  }

  function buildStupa(g, pts, dx, fill) {
    const sx = W * (W < 640 ? .7 : .63);
    const idx = Math.round((sx + M) / dx);
    const gy = pts[idx][1] + 2;
    const s = clamp(H / 800, .75, 1.3) * (W < 640 ? 1.05 : 1.45);
    g.fillStyle = fill;
    g.fillRect(sx - 34 * s, gy - 5 * s, 68 * s, 6 * s);
    g.beginPath(); g.ellipse(sx, gy - 5 * s, 25 * s, 21 * s, 0, Math.PI, 0); g.fill();
    g.fillRect(sx - 7 * s, gy - 33 * s, 14 * s, 9 * s);
    g.beginPath();
    g.moveTo(sx - 6.5 * s, gy - 33 * s); g.lineTo(sx + 6.5 * s, gy - 33 * s);
    g.lineTo(sx + 2 * s, gy - 60 * s); g.lineTo(sx - 2 * s, gy - 60 * s); g.closePath(); g.fill();
    g.fillRect(sx - 6 * s, gy - 63 * s, 12 * s, 3 * s);
    g.fillRect(sx - .8 * s, gy - 72 * s, 1.6 * s, 9 * s);
    // tiers on the spire, caught by the moon
    g.fillStyle = 'rgba(255,214,150,.22)';
    for (let t = 0; t < 13; t++) { const yy = gy - 34 * s - t * 2 * s; const w = 6.2 - t * .32; g.fillRect(sx - w * s, yy, w * 2 * s, .7 * s); }
    // prayer flags running down from the spire
    const top = { x: sx, y: gy - 62 * s };
    const cols = ['120,150,230', '235,232,245', '230,90,80', '110,190,140', '240,200,110'];
    const lines = [[-150, 26], [-95, 18], [90, 20], [160, 30]].map(([ex, ey]) => ({ x: sx + ex * s, y: gy + ey * s - 6 }));
    lines.forEach((e, li) => {
      g.strokeStyle = 'rgba(160,165,205,.35)'; g.lineWidth = .7;
      const cxp = (top.x + e.x) / 2, cyp = Math.max(top.y, e.y) + 8 * s;
      g.beginPath(); g.moveTo(top.x, top.y); g.quadraticCurveTo(cxp, cyp, e.x, e.y); g.stroke();
      const steps = 14;
      for (let k = 1; k < steps; k++) {
        const t = k / steps;
        const x = (1 - t) * (1 - t) * top.x + 2 * (1 - t) * t * cxp + t * t * e.x;
        const y = (1 - t) * (1 - t) * top.y + 2 * (1 - t) * t * cyp + t * t * e.y;
        g.fillStyle = `rgba(${cols[(k + li) % 5]},.42)`;
        g.fillRect(x - 1.6 * s, y, 3.2 * s, 3.6 * s);
      }
    });
    return { x: sx, y: gy - 66 * s, s };
  }

  function frame(t) {
    ease.x += (ptr.x - ease.x) * .05; ease.y += (ptr.y - ease.y) * .05;
    const ox = ease.x - .5, oy = ease.y - .5;
    const sc = Math.min(scrollY, H);
    const x = ctx;
    x.setTransform(DPR, 0, 0, DPR, 0, 0);
    x.globalCompositeOperation = 'source-over';
    const sky = x.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#02030a'); sky.addColorStop(.36, '#090a20'); sky.addColorStop(.64, '#1a1840'); sky.addColorStop(.86, '#3a2a55'); sky.addColorStop(1, '#4a2f4f');
    x.fillStyle = sky; x.fillRect(0, 0, W, H);

    x.globalCompositeOperation = 'lighter';
    const mw = x.createLinearGradient(W * .05, 0, W * .5, H * .7);
    mw.addColorStop(0, 'rgba(120,135,210,0)'); mw.addColorStop(.5, 'rgba(130,140,215,.05)'); mw.addColorStop(1, 'rgba(120,135,210,0)');
    x.fillStyle = mw; x.fillRect(0, 0, W, H);
    // stars
    const sox = ox * 5, soy = oy * 5 + sc * .08;
    for (const s of stars) {
      const a = RM ? s.a * .8 : s.a * (.55 + .45 * Math.sin(t * .001 * s.sp + s.ph));
      x.globalAlpha = a;
      x.fillStyle = '#ece8f6';
      x.fillRect(s.x + sox, s.y + soy, s.s, s.s);
      if (s.s > 1.4) { x.globalAlpha = a * .5; x.drawImage(SP.bone, s.x + sox - 10, s.y + soy - 10, 20, 20); }
    }
    x.globalAlpha = 1;
    // the valley's sodium haze from below
    const vg = x.createRadialGradient(W * .5, H * .98, 0, W * .5, H * .98, W * .7);
    vg.addColorStop(0, 'rgba(255,150,70,.16)'); vg.addColorStop(1, 'rgba(255,150,70,0)');
    x.fillStyle = vg; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'source-over';

    drawMoon(x, moon.x + ox * 16, moon.y + oy * 16 + sc * .22, moon.r, moon.m);

    layers.forEach((L, i) => {
      const lx = ox * L.px - M, ly = oy * L.px * .4 + sc * L.sy;
      x.drawImage(L.c, lx, ly, L.c.width / DPR, L.c.height / DPR);
      // lights on this layer
      x.globalCompositeOperation = 'lighter';
      for (const v of valleyLights) {
        if (v.layer !== i) continue;
        const fl = RM ? .8 : .62 + .38 * Math.sin(t * .003 + v.f) * Math.sin(t * .0017 + v.f);
        x.globalAlpha = fl * v.str;
        x.fillStyle = v.warm ? '#ffad55' : '#dfe8ff';
        x.beginPath(); x.arc(v.x + lx + M, v.y + ly, v.r, 0, 6.28); x.fill();
        if (v.r > 1.05) { x.globalAlpha = .32 * fl; const R = v.r * 12; x.drawImage(v.warm ? SP.sodium : SP.cool, v.x + lx + M - R / 2, v.y + ly - R / 2, R, R); }
      }
      if (i === 2 && stupa) {
        const fl = RM ? .9 : .85 + .15 * Math.sin(t * .0021);
        x.globalAlpha = .7 * fl; const R = 150 * stupa.s;
        x.drawImage(SP.gold, stupa.x + lx + M - R / 2, stupa.y + ly - R / 2 + 10 * stupa.s, R, R);
      }
      if (i === 3) {
        for (const w of windows) {
          const fl = RM ? .9 : .8 + .2 * Math.sin(t * .004 + w.f) * Math.sin(t * .0013 + w.f * 2);
          x.globalAlpha = fl * (w.glow ? 1 : .85);
          x.fillStyle = w.warm ? '#ffbd6e' : '#d6e2ff';
          x.fillRect(w.x + lx + M, w.y + ly, w.w, w.h);
          if (w.glow || w.f > 88) { x.globalAlpha = .4 * fl; const R = w.glow ? 70 : 26; x.drawImage(w.warm ? SP.sodium : SP.cool, w.x + lx + M - R / 2 + w.w / 2, w.y + ly - R / 2, R, R); }
        }
        if (!RM) { // dust in the lamp light, drifting up from the streets
          for (const m of motes) {
            m.life += m.spd * 16; if (m.life > 1) { m.life = 0; m.x = Math.random() * W; }
            const a = Math.pow(Math.sin(Math.PI * m.life), 2) * .5;
            const yy = m.y - m.life * H * .18 + ly, xx = m.x + Math.sin(m.life * 6 + m.ph) * m.sway + ox * (L.px + 30);
            x.globalAlpha = a; const R = m.s * (1 - m.life * .6);
            x.drawImage(SP.sodium, xx - R / 2, yy - R / 2, R, R);
          }
        }
      }
      x.globalAlpha = 1;
      x.globalCompositeOperation = 'source-over';
      if (L.mist) {
        const y0 = L.mist.y0 + ly, y1 = L.mist.y1 + ly;
        const mg = x.createLinearGradient(0, y0, 0, y1);
        mg.addColorStop(0, 'rgba(110,100,170,0)'); mg.addColorStop(1, `rgba(110,100,170,${L.mist.a})`);
        x.fillStyle = mg; x.fillRect(0, y0, W, y1 - y0);
      }
    });

    // the signal line
    const wy = H * .868 + sc * .3;
    x.save();
    x.strokeStyle = 'rgba(255,94,43,.85)'; x.lineWidth = 1.2; x.shadowColor = 'rgba(255,94,43,.9)'; x.shadowBlur = 8;
    x.beginPath();
    const live = analyser && waveData;
    if (live) analyser.getByteTimeDomainData(waveData);
    for (let px = 0; px <= W; px += 3) {
      let y;
      if (live) {
        const v = (waveData[Math.floor(px / W * (waveData.length - 1))] - 128) / 128;
        y = wy + clamp(v * 140, -40, 40);
      } else {
        const near = pointerX >= 0 ? Math.max(0, 1 - Math.abs(px - pointerX) / (W * .25)) : 0;
        const amp = 5 * (1 + near * 2.5);
        y = wy + (RM ? Math.sin(px * .02) * 3 : Math.sin(px * .018 + t * .002) * amp * .6 + Math.sin(px * .047 - t * .0031) * amp * .4);
      }
      px ? x.lineTo(px, y) : x.moveTo(px, y);
    }
    x.stroke(); x.restore();
  }

  let running = false, visible = true, raf = 0;
  function loop(t) { frame(t); raf = requestAnimationFrame(loop); }
  function setRun() {
    const want = visible && (!RM || (analyser && playing));
    if (want && !running) { running = true; raf = requestAnimationFrame(loop); }
    if (!want && running) { running = false; cancelAnimationFrame(raf); }
    if (!running) frame(performance.now());
  }
  function rebuild() { build(); frame(performance.now()); setRun(); }
  let rz = 0;
  addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(rebuild, 120); });
  hero.addEventListener('pointermove', (e) => { const r = hero.getBoundingClientRect(); ptr.x = (e.clientX - r.left) / r.width; ptr.y = (e.clientY - r.top) / r.height; pointerX = e.clientX - r.left; });
  hero.addEventListener('pointerleave', () => { ptr.x = .5; ptr.y = .5; pointerX = -1; });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; setRun(); }).observe(hero);
  build(); setRun();
  if (document.fonts) document.fonts.ready.then(() => frame(performance.now()));

  /* ---------- The drone (tanpura cycle, tape hiss, a low bed) ---------- */
  const btn = document.querySelector('.play');
  const btnTxt = btn.querySelector('.play-txt');
  const SA = 138.59, CYCLE = [SA * .75, SA, SA, SA / 2];
  let noiseBuf = null;

  function buildAudio() {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    out = ac.createGain(); out.gain.value = 0;
    analyser = ac.createAnalyser(); analyser.fftSize = 2048;
    waveData = new Uint8Array(analyser.fftSize);
    out.connect(analyser); analyser.connect(ac.destination);
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const hiss = ac.createBufferSource(), hp = ac.createBiquadFilter(), hg = ac.createGain();
    hiss.buffer = noiseBuf; hiss.loop = true; hp.type = 'highpass'; hp.frequency.value = 4200; hg.gain.value = .016;
    hiss.connect(hp); hp.connect(hg); hg.connect(out); hiss.start();
    const bed = ac.createOscillator(), bed2 = ac.createOscillator(), lp = ac.createBiquadFilter(), bg = ac.createGain();
    bed.type = 'sine'; bed.frequency.value = SA / 2; bed2.type = 'triangle'; bed2.frequency.value = SA * .75 + .3;
    lp.type = 'lowpass'; lp.frequency.value = 380; bg.gain.value = .07;
    bed.connect(lp); bed2.connect(lp); lp.connect(bg); bg.connect(out); bed.start(); bed2.start();
    const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = .07; lg.gain.value = .025;
    lfo.connect(lg); lg.connect(bg.gain); lfo.start();
  }
  function pluck(f, t) {
    const o1 = ac.createOscillator(), o2 = ac.createOscillator(), fl = ac.createBiquadFilter(), g = ac.createGain();
    o1.type = 'sawtooth'; o2.type = 'sawtooth'; o1.frequency.value = f; o2.frequency.value = f * 1.0035;
    fl.type = 'lowpass'; fl.Q.value = 3;
    fl.frequency.setValueAtTime(3200, t); fl.frequency.exponentialRampToValueAtTime(520, t + 2.6);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.07, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + 3.6);
    o1.connect(fl); o2.connect(fl); fl.connect(g); g.connect(out);
    o1.start(t); o2.start(t); o1.stop(t + 3.7); o2.stop(t + 3.7);
  }
  function scheduler() {
    while (nextT < ac.currentTime + .25) {
      pluck(CYCLE[step % 4], nextT);
      nextT += step % 4 === 3 ? 1.5 : .85;
      step++;
    }
  }
  btn.addEventListener('click', () => {
    playing = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', String(playing));
    btnTxt.textContent = playing ? 'Sound off' : 'Play a drone';
    if (!ac) buildAudio();
    const now = ac.currentTime, my = ++token;
    out.gain.cancelScheduledValues(now); out.gain.setValueAtTime(out.gain.value, now);
    if (playing) {
      ac.resume();
      out.gain.linearRampToValueAtTime(.6, now + 2.5);
      nextT = now + .1; clearInterval(sched); sched = setInterval(scheduler, 100); scheduler();
    } else {
      out.gain.linearRampToValueAtTime(0, now + .8);
      clearInterval(sched);
      setTimeout(() => { if (my === token) ac.suspend(); }, 900);
    }
    setRun();
  });

  /* ---------- Sleeves: the sky at the minute the recording stopped ---------- */
  const STOPS = [[0, 14], [1, 8], [2, 37], [3, 46], [4, 59]];
  const stage = document.getElementById('stage');
  const prev = document.getElementById('prev'), next = document.getElementById('next');
  let idx = 2;
  const cards = STOPS.map(([h, m], i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'card';
    const c = document.createElement('canvas');
    c.setAttribute('role', 'img');
    c.setAttribute('aria-label', `Sleeve study: the sky over Kathmandu at ${pad2(h)}:${pad2(m)}`);
    b.append(c);
    const nEl = document.createElement('span'); nEl.className = 'c-num num'; nEl.textContent = `${pad2(h)}:${pad2(m)}`;
    const cap = document.createElement('span'); cap.className = 'c-cap'; cap.textContent = 'Study, stopped after midnight';
    b.append(nEl, cap);
    b.addEventListener('click', () => go(i));
    stage.append(b);
    drawSleeve(c, h, m, i);
    return b;
  });

  function drawSleeve(c, h, m, i) {
    const S = 560; c.width = c.height = S;
    const x = c.getContext('2d');
    const night = (h * 60 + m) / 300; // 0 at midnight, 1 near five
    const R = rng(101 + i * 17);
    const HOURS = [ // top, middle, horizon for each stop: violet haze at midnight, deepest at three, blue before dawn
      ['#05030e', '#1a1036', '#5a2f5e'], ['#04030c', '#140f30', '#3f2a5c'], ['#020309', '#0a0c22', '#22224a'],
      ['#03050e', '#0e1430', '#2a3566'], ['#0a1430', '#1e3260', '#6d7fae']];
    const [c0, c1, c2] = HOURS[i];
    const sky = x.createLinearGradient(0, 0, 0, S);
    sky.addColorStop(0, c0); sky.addColorStop(.55, c1); sky.addColorStop(.86, c2);
    x.fillStyle = sky; x.fillRect(0, 0, S, S);
    x.globalCompositeOperation = 'lighter';
    const nStars = 120 + Math.round(Math.sin(night * Math.PI) * 260);
    for (let k = 0; k < nStars; k++) { x.globalAlpha = .25 + R() * .7 * (1 - night * .4); x.fillStyle = '#ece8f6'; const s = .6 + R() * 1.8; x.fillRect(R() * S, Math.pow(R(), 1.5) * S * .7, s, s); }
    x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    // the moon travels across the sleeve as the night goes on
    const mx = S * (.82 - night * .62), my = S * (.32 - Math.sin(night * Math.PI) * .16);
    drawMoon(x, mx, my, S * .055, moonNow(), .9);
    // Himalaya, then the valley rim, then the city
    const r0 = ridge(11 + i, 65, .68, 1.6);
    x.beginPath(); x.moveTo(0, S);
    r0.forEach((v, k) => x.lineTo(k / 64 * S, S * .68 - v * S * .16)); x.lineTo(S, S); x.closePath();
    const hg = x.createLinearGradient(0, S * .5, 0, S * .75); hg.addColorStop(0, '#5b6394'); hg.addColorStop(1, '#1b2150');
    x.fillStyle = hg; x.fill();
    const r1 = ridge(23 + i, 65, .5, 1);
    x.beginPath(); x.moveTo(0, S);
    r1.forEach((v, k) => x.lineTo(k / 64 * S, S * .78 - v * S * .07)); x.lineTo(S, S); x.closePath();
    x.fillStyle = '#0f1330'; x.fill();
    const base = S * .86;
    x.fillStyle = '#060712';
    let bx = 0; const lit = [];
    while (bx < S) {
      const bw = 16 + R() * 34, bh = S * (.02 + R() * .06);
      x.fillRect(bx, base - bh, bw + 1, S);
      for (let wy = base - bh + 6; wy < S - 6; wy += 11) for (let wx = bx + 4; wx < bx + bw - 5; wx += 8) if (R() < .42 * (1 - night) + .03) lit.push([wx, wy]);
      bx += bw;
    }
    x.globalCompositeOperation = 'lighter';
    lit.forEach(([wx, wy]) => { x.fillStyle = R() < .8 ? '#ffbd6e' : '#d6e2ff'; x.globalAlpha = .9; x.fillRect(wx, wy, 3.5, 4.5); x.globalAlpha = .25; x.drawImage(SP.sodium, wx - 9, wy - 9, 22, 22); });
    x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    // type on the sleeve
    x.fillStyle = 'rgba(233,229,244,.92)';
    x.font = '400 150px "Rozha One", Georgia, serif';
    x.textBaseline = 'alphabetic';
    const tt = `${pad2(h)}:${pad2(m)}`;
    const tw = x.measureText(tt).width;
    x.fillText(tt, (S - tw) / 2, S * .58);
    x.font = '500 17px "Martian Mono", monospace';
    x.fillStyle = 'rgba(233,229,244,.75)';
    x.fillText('AADHI RAAT', 34, 50);
    x.textAlign = 'right';
    x.font = '400 26px "Rozha One", serif';
    x.fillText('आधी रात', S - 34, 54);
    x.textAlign = 'left';
    x.fillStyle = '#ff5e2b';
    x.beginPath(); x.arc(40, S - 40, 7, 0, 6.28); x.fill();
    x.font = '500 15px "Martian Mono", monospace'; x.fillStyle = 'rgba(233,229,244,.75)';
    x.fillText('STUDY', 58, S - 34);
  }

  function layout() {
    const narrow = innerWidth < 800;
    const stepPx = narrow ? 120 : 190;
    cards.forEach((c, i) => {
      const d = i - idx, ad = Math.abs(d);
      c.style.transform = `translateX(${d * stepPx}px) translateZ(${ad ? -80 * ad : 40}px) rotateY(${-18 * d}deg)`;
      c.style.zIndex = String(10 - ad);
      c.style.opacity = ad > 2 ? '0' : '1';
      c.style.filter = `brightness(${1 - ad * .22})`;
      c.tabIndex = ad > 2 ? -1 : 0;
      c.setAttribute('aria-hidden', ad > 2 ? 'true' : 'false');
      if (ad === 0) c.setAttribute('aria-current', 'true'); else c.removeAttribute('aria-current');
    });
    prev.disabled = idx === 0;
    next.disabled = idx === cards.length - 1;
  }
  function go(i) { idx = clamp(i, 0, cards.length - 1); layout(); }
  prev.addEventListener('click', () => go(idx - 1));
  next.addEventListener('click', () => go(idx + 1));
  addEventListener('resize', layout);
  if (RM) cards.forEach((c) => (c.style.transition = 'none'));
  layout();
  if (document.fonts) document.fonts.ready.then(() => STOPS.forEach(([h, m], i) => drawSleeve(cards[i].querySelector('canvas'), h, m, i)));

  /* ---------- The rule: words light as you scroll ---------- */
  const p = document.getElementById('manifesto');
  const runway = document.getElementById('rule');
  const rClock = document.getElementById('rClock');
  const rEnd = document.getElementById('rEnd');
  const rFill = document.getElementById('rFill');
  const sr = Object.assign(document.createElement('span'), { className: 'vh' });
  sr.textContent = p.textContent.replace(/\s+/g, ' ').trim();
  const vis = document.createElement('span'); vis.setAttribute('aria-hidden', 'true');
  const words = [], groups = [];
  const add = (text, g) => {
    for (const tok of text.match(/\s+|\S+/g) || []) {
      const space = /^\s/.test(tok);
      if (space && !g) { vis.append(' '); continue; }
      const s = document.createElement('span');
      s.textContent = space ? ' ' : tok;
      if (!space) { s.className = 'w'; words.push({ el: s, o: -1 }); }
      if (g) { s.classList.add('k'); s.style.setProperty('--j', g.els.length); g.els.push(s); if (!space) g.last = words.length - 1; }
      vis.append(s);
    }
  };
  for (const node of [...p.childNodes]) node.nodeType === 3 ? add(node.textContent) : add(node.textContent, groups[groups.push({ els: [], last: 0, on: false }) - 1]);
  p.replaceChildren(sr, vis);
  const N = words.length;
  rEnd.textContent = `sunrise ${hm(sunriseMin)}`;

  let ticking = false;
  function onScroll() {
    ticking = false;
    const range = runway.offsetHeight - innerHeight;
    const t = clamp(-runway.getBoundingClientRect().top / (range * .8));
    const f = .6 + t * (N + .4);
    for (let i = 0; i < N; i++) {
      const o = +(0.18 + 0.82 * clamp(f - i)).toFixed(3);
      if (o !== words[i].o) { words[i].o = o; words[i].el.style.opacity = o; }
    }
    for (const g of groups) {
      const on = f >= g.last + 1;
      if (on !== g.on) { g.on = on; g.els.forEach((el) => el.classList.toggle('on', on)); }
    }
    rFill.style.transform = `scaleX(${t})`;
    rClock.textContent = hm(Math.round(t * sunriseMin));
  }
  if (!RM) {
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
  } else {
    groups.forEach((g) => g.els.forEach((el) => el.classList.add('on')));
  }

  /* ---------- Entry fades ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* ---------- Sign-up form ---------- */
  const form = document.getElementById('form');
  const input = document.getElementById('email');
  const msgTxt = form.querySelector('.msg-txt');
  const msgIco = form.querySelector('.msg-ico');
  const DEFAULT = msgTxt.textContent;
  const ICON = {
    bad: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/></svg>',
    done: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-9"/></svg>',
  };
  function set(state, text) {
    form.classList.remove('bad', 'done');
    if (state) form.classList.add(state);
    msgIco.innerHTML = state ? ICON[state] : '';
    msgTxt.textContent = text;
    input.setAttribute('aria-invalid', state === 'bad' ? 'true' : 'false');
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) { set('bad', 'Enter an email address to sign up.'); input.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { set('bad', 'That address is missing an @ or a domain, like name@example.com.'); input.focus(); return; }
    const endpoint = form.getAttribute('action');
    if (endpoint) {
      fetch(endpoint, { method: 'POST', body: new FormData(form) })
        .then((r) => { if (!r.ok) throw 0; set('done', `Thanks. ${v} will hear when a release is out.`); })
        .catch(() => set('bad', 'That did not go through. Try again in a minute.'));
    } else {
      set('done', `Address looks right. This form is not connected to a mailing list yet, so ${v} was not sent anywhere.`);
    }
  });
  input.addEventListener('input', () => { if (form.classList.contains('bad') || form.classList.contains('done')) set(null, DEFAULT); });
})();
