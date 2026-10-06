/* Late Light · Designed using Design Lounge (https://www.designlounge.live) */
(() => {
  'use strict';

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cvs = document.getElementById('space');
  const ctx = cvs.getContext('2d');
  const TAU = Math.PI * 2;
  const DEPTH = 2600, ZVH = 1000;
  let W = 0, H = 0, DPR = 1, F = 1, CX = 0, CY = 0;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); };

  function canvas(w, h) { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return c; }
  function glow(g, x, y, r, rgb, a) {
    if (r <= 0 || a <= 0) return;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(${rgb},${a})`);
    gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }

  /* ---------------- sprites, painted once ---------------- */
  const sprites = {};

  function paintMoon() {
    const S = 520, c = S / 2, R = 196, cv = canvas(S, S), g = cv.getContext('2d');
    seed = 11;
    g.globalCompositeOperation = 'lighter';
    glow(g, c, c, 258, '230,224,214', 0.13);
    g.globalCompositeOperation = 'source-over';
    g.save();
    g.beginPath(); g.arc(c, c, R, 0, TAU); g.clip();
    const base = g.createRadialGradient(c - 70, c - 80, 10, c, c, R);
    base.addColorStop(0, '#e2dcd2'); base.addColorStop(0.6, '#b9b1a6'); base.addColorStop(1, '#8a8278');
    g.fillStyle = base; g.fillRect(0, 0, S, S);
    // maria
    const maria = [[-40, -60, 70], [30, -30, 60], [60, 30, 46], [-20, 20, 50], [-80, 10, 36], [20, 80, 30], [90, -70, 30]];
    for (const [mx, my, mr] of maria) {
      let x = c + mx, y = c + my;
      for (let i = 0; i < 40; i++) {
        x += gauss() * 7; y += gauss() * 7;
        glow(g, x, y, mr * (0.4 + rnd() * 0.5), '74,70,70', 0.16);
      }
    }
    // regolith speckle, then a few soft craters
    for (let i = 0; i < 5200; i++) {
      const a = rnd() * TAU, d = Math.sqrt(rnd()) * R;
      g.fillStyle = rnd() < 0.5 ? `rgba(30,28,28,${0.05 + rnd() * 0.07})` : `rgba(255,250,240,${0.04 + rnd() * 0.06})`;
      g.fillRect(c + Math.cos(a) * d, c + Math.sin(a) * d, 1 + rnd() * 1.5, 1 + rnd() * 1.5);
    }
    for (let i = 0; i < 64; i++) {
      const a = rnd() * TAU, d = Math.sqrt(rnd()) * R * 0.97, x = c + Math.cos(a) * d, y = c + Math.sin(a) * d;
      const r = 1.2 + Math.pow(rnd(), 4) * 13;
      const fore = Math.sqrt(1 - Math.min(1, (d / R) ** 2)) * 0.6 + 0.4;
      g.save(); g.translate(x, y); g.rotate(a); g.scale(fore, 1);
      glow(g, 0, 0, r * 1.1, '30,26,26', 0.18);
      g.lineWidth = Math.max(0.6, r * 0.16);
      g.strokeStyle = 'rgba(255,250,240,.16)'; g.beginPath(); g.arc(0, 0, r, Math.PI * 0.5, Math.PI * 1.4); g.stroke();
      g.restore();
    }
    // a rayed crater
    const tx = c + 40, ty = c + 120;
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 18; i++) {
      const a = rnd() * TAU, L = 40 + rnd() * 120;
      g.strokeStyle = 'rgba(255,250,240,.05)'; g.lineWidth = 2 + rnd() * 3;
      g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx + Math.cos(a) * L, ty + Math.sin(a) * L); g.stroke();
    }
    glow(g, tx, ty, 10, '255,252,244', 0.5);
    g.globalCompositeOperation = 'source-over';
    // limb darkening, then the terminator: the Sun is upper left
    const limb = g.createRadialGradient(c, c, R * 0.55, c, c, R);
    limb.addColorStop(0, 'rgba(0,0,0,0)'); limb.addColorStop(1, 'rgba(0,0,0,.28)');
    g.fillStyle = limb; g.fillRect(0, 0, S, S);
    const term = g.createRadialGradient(c - R * 0.55, c - R * 0.6, R * 0.2, c - R * 0.3, c - R * 0.34, R * 1.95);
    term.addColorStop(0, 'rgba(4,2,8,0)'); term.addColorStop(0.5, 'rgba(4,2,8,0)'); term.addColorStop(0.74, 'rgba(4,2,8,.96)'); term.addColorStop(1, 'rgba(4,2,8,1)');
    g.fillStyle = term; g.fillRect(0, 0, S, S);
    g.restore();
    g.lineWidth = 2; g.strokeStyle = 'rgba(255,248,236,.55)';
    g.beginPath(); g.arc(c, c, R - 1, Math.PI * 0.95, Math.PI * 1.55); g.stroke();
    return cv;
  }

  function paintSaturn() {
    const S = 680, c = S / 2, p = 128, ang = -0.36, sq = 0.3, cv = canvas(S, S), g = cv.getContext('2d');
    seed = 23;
    const bands = [[1.23, 1.52, '160,140,118', 0.28], [1.52, 1.95, '232,212,176', 0.92], [1.95, 2.03, '0,0,0', 0], [2.03, 2.2, '206,186,152', 0.78], [2.2, 2.23, '0,0,0', 0], [2.23, 2.29, '200,180,150', 0.62]];
    const rings = (front) => {
      g.save();
      g.translate(c, c); g.rotate(ang);
      if (front) { g.beginPath(); g.rect(-S, 0, S * 2, S); g.clip(); }
      g.scale(1, sq);
      for (const [r0, r1, rgb, a] of bands) {
        if (!a) continue;
        g.beginPath(); g.arc(0, 0, r1 * p, 0, TAU); g.arc(0, 0, r0 * p, 0, TAU, true);
        g.fillStyle = `rgba(${rgb},${a})`; g.fill('evenodd');
      }
      for (let i = 0; i < 70; i++) {
        const r = lerp(1.25, 2.28, rnd()) * p;
        g.strokeStyle = rnd() < 0.5 ? `rgba(20,14,10,${0.06 + rnd() * 0.12})` : `rgba(255,244,222,${0.04 + rnd() * 0.08})`;
        g.lineWidth = 0.6 + rnd() * 1.6; g.beginPath(); g.arc(0, 0, r, 0, TAU); g.stroke();
      }
      g.restore();
    };
    g.globalCompositeOperation = 'lighter';
    glow(g, c, c, 330, '255,226,180', 0.07);
    g.globalCompositeOperation = 'source-over';
    rings(false);
    // planet
    g.save();
    g.beginPath(); g.arc(c, c, p, 0, TAU); g.clip();
    g.save(); g.translate(c, c); g.rotate(ang);
    const lg = g.createLinearGradient(0, -p, 0, p);
    const stops = [[0, '#c9a46c'], [0.12, '#e3c993'], [0.22, '#bf9662'], [0.3, '#f0dcb0'], [0.42, '#d9b77f'], [0.5, '#efd9ac'], [0.58, '#c89c64'], [0.68, '#e8cf9c'], [0.8, '#b98c58'], [0.9, '#d8b47c'], [1, '#a77b4a']];
    for (const [o, col] of stops) lg.addColorStop(o, col);
    g.fillStyle = lg; g.fillRect(-p * 1.5, -p, p * 3, p * 2);
    for (let i = 0; i < 26; i++) { const y = lerp(-p, p, rnd()); g.fillStyle = `rgba(${rnd() < 0.5 ? '90,60,30' : '255,240,210'},${0.04 + rnd() * 0.06})`; g.fillRect(-p * 1.5, y, p * 3, 1 + rnd() * 5); }
    // ring shadow on the globe, falling just below the rings
    g.scale(1, sq);
    g.strokeStyle = 'rgba(20,10,6,.5)'; g.lineWidth = p * 0.42;
    g.beginPath(); g.arc(0, p * 0.5, 1.75 * p, 0, TAU); g.stroke();
    g.restore();
    const term = g.createRadialGradient(c - p * 0.55, c - p * 0.6, p * 0.15, c - p * 0.25, c - p * 0.3, p * 1.7);
    term.addColorStop(0, 'rgba(4,2,8,0)'); term.addColorStop(0.55, 'rgba(4,2,8,0)'); term.addColorStop(0.85, 'rgba(4,2,8,.9)'); term.addColorStop(1, 'rgba(4,2,8,1)');
    g.fillStyle = term; g.fillRect(0, 0, S, S);
    g.restore();
    g.lineWidth = 1.5; g.strokeStyle = 'rgba(255,240,214,.5)';
    g.beginPath(); g.arc(c, c, p - 1, Math.PI * 1.0, Math.PI * 1.5); g.stroke();
    rings(true);
    // the globe's shadow across the rings, away from the Sun (lower right)
    g.save();
    g.translate(c, c); g.rotate(ang); g.scale(1, sq);
    g.beginPath(); g.arc(0, 0, 2.32 * p, 0, TAU); g.arc(0, 0, 1.2 * p, 0, TAU, true);
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clip('evenodd');
    g.beginPath(); g.rect(0, 0, S, S); g.arc(c, c, p, 0, TAU, true);
    g.clip('evenodd');
    g.translate(c, c); g.rotate(Math.PI * 0.22);
    g.fillStyle = 'rgba(4,2,8,.66)';
    g.fillRect(0, -p * 0.96, S, p * 1.92);
    g.restore();
    return cv;
  }

  function paintPleiades() {
    const S = 680, c = S / 2, cv = canvas(S, S), g = cv.getContext('2d');
    seed = 41;
    const stars = [[0, 0, 2.9], [-0.62, 0.06, 3.6], [-0.63, -0.06, 5.0], [0.55, 0.12, 3.7], [0.42, -0.22, 3.9], [0.25, 0.3, 4.2], [0.62, -0.4, 4.3], [0.74, -0.05, 5.4], [0.6, -0.58, 5.8]];
    const sc = 210;
    g.globalCompositeOperation = 'lighter';
    glow(g, c, c, 330, '90,120,255', 0.08);
    for (const [sx, sy, m] of stars) {
      const x = c + sx * sc, y = c + sy * sc, b = (6.5 - m) / 3.6;
      for (let i = 0; i < 16; i++) {
        g.save();
        g.translate(x + gauss() * 30, y + gauss() * 24); g.rotate(-0.55 + gauss() * 0.15); g.scale(2.4, 0.55);
        glow(g, 0, 0, 20 + rnd() * 50 * b, rnd() < 0.8 ? '110,150,255' : '160,190,255', 0.05 + rnd() * 0.05);
        g.restore();
      }
    }
    for (let i = 0; i < 90; i++) {
      const x = c + gauss() * 120, y = c + gauss() * 90, r = 0.6 + rnd() * 1.4;
      glow(g, x, y, r * 4, '210,225,255', 0.5); glow(g, x, y, r, '255,255,255', 0.9);
    }
    for (const [sx, sy, m] of stars) {
      const x = c + sx * sc, y = c + sy * sc, b = (6.5 - m) / 3.6;
      glow(g, x, y, 14 + 40 * b, '150,180,255', 0.35);
      glow(g, x, y, 6 + 10 * b, '235,242,255', 0.95);
      const L = 30 + 70 * b;
      for (let k = 0; k < 4; k++) {
        const a = Math.PI / 4 + k * Math.PI / 2;
        const lgd = g.createLinearGradient(x, y, x + Math.cos(a) * L, y + Math.sin(a) * L);
        lgd.addColorStop(0, 'rgba(220,232,255,.75)'); lgd.addColorStop(1, 'rgba(220,232,255,0)');
        g.strokeStyle = lgd; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke();
      }
    }
    return cv;
  }

  function paintOrion() {
    const S = 760, c = S / 2, cv = canvas(S, S), g = cv.getContext('2d');
    seed = 59;
    g.globalCompositeOperation = 'lighter';
    glow(g, c, c, 360, '200,40,70', 0.08);
    const walk = (x, y, dir, n, rgb, rmin, rmax, a, curl = 0) => {
      for (let i = 0; i < n; i++) {
        dir += gauss() * 0.3 + curl; x += Math.cos(dir) * 6; y += Math.sin(dir) * 6;
        glow(g, x, y, rmin + rnd() * (rmax - rmin), rgb, a * (1 - i / n * 0.6));
      }
    };
    // a broad cloud first, so the wings sit in gas rather than in black
    for (let i = 0; i < 70; i++) {
      const a = rnd() * TAU, d = Math.abs(gauss()) * 130;
      glow(g, c + Math.cos(a) * d * 1.25, c + Math.sin(a) * d * 0.95, 60 + rnd() * 90, rnd() < 0.7 ? '220,52,84' : '255,96,128', 0.035);
    }
    // two lobes of filaments: the bat wings
    const lobes = [[-2.6, 0.35, 0.05, 6], [0.5, 0.35, 0.05, 6], [-1.4, 0.25, -0.04, 3], [2.0, 0.25, -0.04, 3]];
    for (const [d0, spread, curl, n] of lobes) {
      for (let k = 0; k < n; k++) {
        const rgb = rnd() < 0.5 ? '255,86,118' : rnd() < 0.5 ? '232,56,90' : '255,140,160';
        walk(c + gauss() * 30, c + gauss() * 24, d0 + gauss() * spread, 40, rgb, 12, 34, 0.05, curl);
      }
    }
    for (let i = 0; i < 420; i++) {
      const a = rnd() * TAU, d = Math.abs(gauss()) * 120;
      glow(g, c + Math.cos(a) * d * 1.3, c + Math.sin(a) * d, 4 + rnd() * 14, '255,130,156', 0.04);
    }
    glow(g, c + 10, c - 4, 140, '95,216,200', 0.14);
    glow(g, c + 6, c, 70, '140,240,220', 0.2);
    glow(g, c, c, 34, '255,238,220', 0.45);
    g.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 26; i++) {
      const x = c - 70 - rnd() * 90, y = c + gauss() * 30 - 10;
      glow(g, x, y, 18 + rnd() * 26, '7,5,11', 0.32);
    }
    for (let i = 0; i < 18; i++) glow(g, c + 120 + rnd() * 140, c + 60 + rnd() * 120, 20 + rnd() * 30, '7,5,11', 0.22);
    g.globalCompositeOperation = 'lighter';
    // M43, the small comma above
    walk(c + 30, c - 150, -1.2, 30, '255,90,120', 10, 30, 0.08);
    glow(g, c + 28, c - 160, 6, '255,250,240', 0.9);
    // the Trapezium
    for (const [dx, dy] of [[-6, -4], [5, -6], [-3, 6], [8, 4]]) {
      glow(g, c + dx, c + dy, 14, '210,225,255', 0.5); glow(g, c + dx, c + dy, 3.2, '255,255,255', 1);
    }
    for (let i = 0; i < 70; i++) { const x = rnd() * S, y = rnd() * S, r = 0.6 + rnd(); glow(g, x, y, r * 3, '255,240,230', 0.4 * (1 - Math.hypot(x - c, y - c) / S)); }
    return cv;
  }

  function paintAndromeda() {
    const S = 980, c = S / 2, cv = canvas(S, S), g = cv.getContext('2d');
    seed = 73;
    g.globalCompositeOperation = 'lighter';
    g.save();
    g.translate(c, c); g.rotate(-0.62); g.scale(1, 0.3);
    glow(g, 0, 0, 470, '140,165,255', 0.12);
    glow(g, 0, 0, 330, '190,190,255', 0.14);
    glow(g, 0, 0, 200, '255,220,200', 0.2);
    // two trailing arms of young blue stars, with a few pink star-forming knots
    for (let arm = 0; arm < 2; arm++) {
      for (let i = 0; i < 1300; i++) {
        const th = (i / 1300) * Math.PI * 3.1;
        const r = 70 * Math.exp(0.175 * th);
        const a = th + arm * Math.PI;
        const x = Math.cos(a) * r + gauss() * (10 + r * 0.06), y = Math.sin(a) * r + gauss() * (10 + r * 0.06);
        if (rnd() < 0.012) { glow(g, x, y, 9, '255,110,150', 0.35); continue; }
        g.fillStyle = `rgba(${rnd() < 0.75 ? '176,198,255' : '255,240,226'},${0.14 + rnd() * 0.32})`;
        g.fillRect(x, y, 1.6, 4.6);
        if (rnd() < 0.08) glow(g, x, y, 22, '150,175,255', 0.05);
      }
    }
    for (let i = 0; i < 1600; i++) {
      const a = rnd() * TAU, d = Math.abs(gauss()) * 170;
      const x = Math.cos(a) * d, y = Math.sin(a) * d;
      g.fillStyle = `rgba(${rnd() < 0.6 ? '255,236,214' : '190,205,255'},${0.18 + rnd() * 0.4})`;
      g.fillRect(x, y, 1.6, 4.4);
    }
    glow(g, 0, 0, 110, '255,232,200', 0.55);
    glow(g, 0, 0, 36, '255,250,240', 0.95);
    g.globalCompositeOperation = 'source-over';
    g.shadowColor = 'rgba(7,5,11,.8)'; g.shadowBlur = 14;
    for (const [r, a0, a1, w] of [[150, 0.08, 0.92, 9], [205, 0.12, 0.85, 12], [270, 0.18, 0.78, 10], [335, 0.22, 0.7, 8]]) {
      g.strokeStyle = 'rgba(14,8,14,.5)'; g.lineWidth = w; g.beginPath(); g.arc(0, -14, r, Math.PI * a0, Math.PI * a1); g.stroke();
    }
    g.restore();
    g.globalCompositeOperation = 'lighter';
    glow(g, c + 52, c - 44, 22, '255,236,214', 0.6); glow(g, c + 52, c - 44, 6, '255,250,240', 0.9);
    g.save(); g.translate(c - 150, c + 170); g.rotate(-0.9); g.scale(1, 0.55); glow(g, 0, 0, 48, '255,226,200', 0.22); g.restore();
    return cv;
  }

  function paintMilkyWay(w, h) {
    const D = Math.hypot(w, h), cv = canvas(D * 1.2, D * 0.6), g = cv.getContext('2d');
    seed = 97;
    const cw = cv.width, ch = cv.height;
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 900; i++) {
      const x = rnd() * cw, y = ch / 2 + gauss() * ch * 0.12 + Math.sin(x / cw * 5) * ch * 0.04;
      glow(g, x, y, 20 + rnd() * 70, rnd() < 0.9 ? '255,232,214' : '255,90,122', 0.025 + rnd() * 0.02);
    }
    for (let i = 0; i < 2200; i++) {
      const x = rnd() * cw, y = ch / 2 + gauss() * ch * 0.1;
      g.fillStyle = `rgba(255,244,232,${0.2 + rnd() * 0.4})`; g.fillRect(x, y, 1.1, 1.1);
    }
    g.globalCompositeOperation = 'destination-out';
    let y = ch / 2;
    for (let x = 0; x < cw; x += 6) {
      y += gauss() * 3; y = clamp(y, ch * 0.42, ch * 0.58);
      glow(g, x, y, 14 + rnd() * 26, '0,0,0', 0.18);
    }
    return cv;
  }

  function paintDeepField(w, h) {
    const cv = canvas(w * DPR, h * DPR), g = cv.getContext('2d');
    seed = 131;
    g.scale(DPR, DPR);
    g.globalCompositeOperation = 'lighter';
    const n = Math.round(clamp(w * h / 1500, 260, 700));
    for (let i = 0; i < n; i++) {
      const x = rnd() * w, y = rnd() * h, s = 0.5 + Math.pow(rnd(), 5) * 5;
      const t = rnd(), rgb = t < 0.45 ? '255,214,170' : t < 0.75 ? '170,195,255' : t < 0.9 ? '255,150,140' : '255,240,225';
      g.save(); g.translate(x, y); g.rotate(rnd() * Math.PI); g.scale(1, 0.3 + rnd() * 0.6);
      glow(g, 0, 0, s * 2.4, rgb, 0.26); glow(g, 0, 0, s * 0.7, '255,248,240', 0.5);
      g.restore();
    }
    for (let i = 0; i < 9; i++) {
      const x = rnd() * w, y = rnd() * h, L = 14 + rnd() * 18;
      glow(g, x, y, 10, '255,240,225', 0.5);
      for (let k = 0; k < 6; k++) {
        const a = k * Math.PI / 3 + Math.PI / 6;
        g.strokeStyle = 'rgba(255,236,220,.32)'; g.lineWidth = 0.8;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke();
      }
    }
    return cv;
  }

  /* ---------------- the dome ---------------- */
  let skyline = [], pins = [], beams = [];
  function buildDome() {
    seed = 151;
    skyline = [];
    let v = 0;
    for (let i = 0; i <= 120; i++) { v += gauss() * 0.35; v *= 0.92; skyline.push(v); }
    pins = [];
    for (let i = 0; i < 70; i++) {
      const th = rnd() * TAU, ph = Math.acos(rnd() * 0.95);
      pins.push({ x: Math.sin(ph) * Math.cos(th), y: -Math.abs(Math.cos(ph)) * 0.95 + Math.sin(ph) * Math.sin(th) * 0.35, b: 0.4 + rnd() * 0.6 });
    }
    beams = [];
    for (let i = 0; i < 16; i++) beams.push({ p: pins[(i * 4) % pins.length], tx: (rnd() - 0.5) * 2.4, ty: -0.4 - rnd() * 0.9, a: 0.03 + rnd() * 0.04 });
  }

  function drawDome(alpha, lift, t) {
    if (alpha <= 0.002) return;
    const hy = H * (W < 760 ? 0.66 : 0.75) + lift * H * 0.75;
    const zen = { x: CX, y: hy - H * 1.5 };
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255,170,170,.06)';
    for (let i = -8; i <= 8; i++) {
      const sx = CX + i * W * 0.13;
      ctx.beginPath(); ctx.moveTo(sx, hy); ctx.quadraticCurveTo(CX + i * W * 0.1, hy - H * 0.7, zen.x, zen.y); ctx.stroke();
    }
    for (const k of [0.9, 1.25, 1.65]) {
      ctx.beginPath(); ctx.ellipse(CX, hy + H * 0.25, W * 0.75 * k, H * 0.62 * k, 0, Math.PI, TAU); ctx.stroke();
    }
    // cove glow: the red dark-adaptation lamps
    ctx.globalCompositeOperation = 'lighter';
    const cg = ctx.createLinearGradient(0, hy - H * 0.2, 0, hy);
    cg.addColorStop(0, 'rgba(255,58,46,0)'); cg.addColorStop(1, 'rgba(255,58,46,.26)');
    ctx.fillStyle = cg; ctx.fillRect(0, hy - H * 0.2, W, H * 0.2);
    // projector beams
    const pr = Math.min(W, H) * 0.06, px = CX, py = hy + H * 0.02 - pr * 0.4;
    for (const b of beams) {
      const x0 = px + b.p.x * pr, y0 = py + b.p.y * pr, x1 = CX + b.tx * W * 0.5, y1 = hy + b.ty * H;
      const bg = ctx.createLinearGradient(x0, y0, x1, y1);
      bg.addColorStop(0, `rgba(255,236,214,${b.a})`); bg.addColorStop(1, 'rgba(255,236,214,0)');
      ctx.strokeStyle = bg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    // the horizon silhouette and the room below it
    ctx.beginPath(); ctx.moveTo(0, H + 10);
    for (let i = 0; i < skyline.length; i++) ctx.lineTo(i / (skyline.length - 1) * W, hy - 4 - Math.abs(skyline[i]) * 9 - (i % 17 === 3 ? 10 : 0));
    ctx.lineTo(W, H + 10); ctx.closePath();
    const room = ctx.createLinearGradient(0, hy, 0, H);
    room.addColorStop(0, '#0d060c'); room.addColorStop(1, '#050307');
    ctx.fillStyle = room; ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(255,80,64,.5)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(0, hy + 12); ctx.lineTo(W, hy + 12); ctx.stroke();
    for (let i = 0; i < 15; i++) {
      const x = (i + 0.5) / 15 * W;
      glow(ctx, x, hy + 12, 18, '255,58,46', 0.45); glow(ctx, x, hy + 12, 2.5, '255,170,150', 0.9);
    }
    ctx.globalCompositeOperation = 'source-over';
    // the star projector: a dark ball on a column, pinholes lit
    ctx.fillStyle = '#07040a';
    ctx.fillRect(px - pr * 0.22, py, pr * 0.44, H);
    const ball = ctx.createRadialGradient(px - pr * 0.3, py - pr * 0.4, pr * 0.1, px, py, pr);
    ball.addColorStop(0, '#2a1e26'); ball.addColorStop(1, '#060308');
    ctx.fillStyle = ball; ctx.beginPath(); ctx.arc(px, py, pr, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(255,90,70,.55)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(px, py, pr - 0.5, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    ctx.globalCompositeOperation = 'lighter';
    for (const p of pins) {
      const tw = reduce ? 1 : 0.75 + 0.25 * Math.sin(t * 2 + p.b * 9);
      glow(ctx, px + p.x * pr * 0.92, py + p.y * pr * 0.92, 4, '255,236,214', 0.5 * p.b * tw);
    }
    ctx.globalCompositeOperation = 'source-over';
    // seats: three rows of reclined backs, rim-lit by the cove
    const rows = [[0.84, 13, 0.75, 0.9], [0.93, 10, 1.0, 1.25], [1.03, 7, 1.4, 1.7]];
    for (const [ry, n, sz, par] of rows) {
      const y0 = H * ry + lift * H * par;
      const sw = W / n * 0.78, sh = sw * 0.62 * sz;
      for (let i = 0; i < n; i++) {
        const x = (i + 0.5) / n * W - sw / 2 + ((n % 2) ? 0 : sw * 0.1);
        const dx = (x + sw / 2 - CX) / W;
        const y = y0 + dx * dx * H * 0.12;
        ctx.fillStyle = '#040205';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, y, sw, sh * 2, sw * 0.28) : ctx.rect(x, y, sw, sh * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,75,62,.42)'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(x + sw * 0.16, y + 0.5); ctx.lineTo(x + sw * 0.84, y + 0.5); ctx.stroke();
      }
    }
    ctx.restore();
  }

  /* ---------------- stars ---------------- */
  let stars = [];
  function seedStars() {
    seed = 3;
    const n = Math.round(clamp(W * H / 650, 700, 2000));
    const xr = (W / 2) * DEPTH / F * 1.15, yr = (H / 2) * DEPTH / F * 1.15;
    stars = [];
    for (let i = 0; i < n; i++) {
      const t = rnd();
      stars.push({
        x: (rnd() * 2 - 1) * xr, y: (rnd() * 2 - 1) * yr, z: rnd() * DEPTH,
        s: 0.5 + Math.pow(rnd(), 4) * 2.2, tw: 0.5 + rnd() * 2.5, ph: rnd() * TAU, b: 0.45 + rnd() * 0.55,
        c: t < 0.7 ? '255,240,226' : t < 0.88 ? '196,214,255' : '255,186,168'
      });
    }
  }

  /* ---------------- chapters and bodies ---------------- */
  const sections = [...document.querySelectorAll('main .ch')];
  const chapters = sections.map(el => ({
    el, label: el.dataset.label, km: +el.dataset.km, obj: el.dataset.obj || null,
    side: el.dataset.side === 'left' ? -1 : 1, copy: el.querySelector('.copy') || el.querySelector('.in'), top: 0, h: 0, ctr: 0
  }));
  const objs = {
    moon: { r: 150, k: 4.2, paint: paintMoon },
    saturn: { r: 150, k: 3.0, paint: paintSaturn },
    pleiades: { r: 150, k: 2.6, paint: paintPleiades },
    orion: { r: 150, k: 2.7, paint: paintOrion },
    andromeda: { r: 150, k: 1.45, paint: paintAndromeda, hold: true }
  };
  let lastCtr = 0, milky = null, milkyDiag = 0, deep = null;

  function layout() {
    const narrow = W < 760;
    for (const c of chapters) {
      c.top = c.el.offsetTop; c.h = c.el.offsetHeight;
      c.ctr = c.top + c.h / 2 - H / 2;
      const o = objs[c.obj]; if (!o) continue;
      o.vd = o.r * o.k;
      o.z = c.ctr * ZVH / H + o.vd;
      o.x = c.side * (narrow ? 0.2 : 0.25) * W * o.vd / F;
      o.y = (narrow ? -0.17 : -0.02) * H * o.vd / F;
    }
    chapters[0].ctr = 0;
    lastCtr = chapters[chapters.length - 1].ctr;
  }

  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    cvs.width = Math.round(W * DPR); cvs.height = Math.round(H * DPR);
    F = 0.9 * Math.min(W, H); CX = W / 2; CY = H / 2;
    const diag = Math.hypot(W, H);
    if (!milky || Math.abs(diag - milkyDiag) > 200) { milky = paintMilkyWay(W, H); milkyDiag = diag; }
    deep = paintDeepField(W, H);
    seedStars();
    layout();
  }

  /* ---------------- readouts ---------------- */
  const C_KMS = 299792.458, LY = 9.4607e12, YEAR = 31557600;
  const roEls = { km: document.querySelector('[data-ro="km"]'), lt: document.querySelector('[data-ro="lt"]'), left: document.querySelector('[data-ro="left"]') };
  const last = {};
  function put(k, s) { if (last[k] !== s) { last[k] = s; roEls[k].textContent = s; } }
  const nf = new Intl.NumberFormat('en-GB');
  const pad = n => String(n).padStart(2, '0');

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
  function fmtDist(km) {
    if (km < 1) return '0 km';
    if (km < 1e6) return nf.format(Math.round(km / 100) * 100) + ' km';
    if (km < 1e9) return (km / 1e6).toFixed(1) + ' million km';
    if (km < 1e12) return (km / 1e9).toFixed(2) + ' billion km';
    if (km < 0.5 * LY) return (km / 1e12).toFixed(1) + ' trillion km';
    const ly = km / LY;
    if (ly < 10) return ly.toFixed(1) + ' light-years';
    if (ly < 1e6) return nf.format(Math.round(ly)) + ' light-years';
    return (ly / 1e6).toFixed(2) + ' million light-years';
  }
  function fmtTravel(sec) {
    if (sec < 0.05) return '0 s';
    if (sec < 60) return sec.toFixed(1) + ' s';
    if (sec < 3600) return Math.floor(sec / 60) + ' min ' + pad(Math.floor(sec % 60)) + ' s';
    if (sec < 86400) return Math.floor(sec / 3600) + ' h ' + pad(Math.floor(sec % 3600 / 60)) + ' min';
    const yr = sec / YEAR;
    if (yr < 1) return nf.format(Math.round(sec / 86400)) + ' days';
    if (yr < 1e6) return nf.format(Math.round(yr)) + (Math.round(yr) === 1 ? ' year' : ' years');
    return (yr / 1e6).toFixed(2) + ' million years';
  }
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtLeft(sec) {
    const now = Date.now();
    if (sec < 86400) {
      const d = new Date(now - sec * 1000);
      return 'at ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    }
    const yr = sec / YEAR;
    if (yr < 1) { const d = new Date(now - sec * 1000); return 'on ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear(); }
    const year = new Date(now).getFullYear() - Math.round(yr);
    if (year > 0) return 'in ' + year;
    if (yr < 1e4) return 'in ' + nf.format(1 - year) + ' BCE';
    if (yr < 1e6) return nf.format(Math.round(yr / 1000) * 1000) + ' years ago';
    return (yr / 1e6).toFixed(1) + ' million years ago';
  }

  /* ---------------- rail ---------------- */
  const railOl = document.querySelector('.rail ol');
  const live = document.querySelector('.sr');
  const railBtns = chapters.map((c, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Chapter ${i + 1}: ${c.label}`);
    b.innerHTML = `<span>${c.label}</span><i></i>`;
    b.addEventListener('click', () => scrollTo({ top: i === 0 ? 0 : c.ctr, behavior: reduce ? 'auto' : 'smooth' }));
    li.appendChild(b); railOl.appendChild(li);
    return b;
  });
  let current = -1;
  function setCurrent() {
    let idx = 0;
    const mid = scrollY + H / 2;
    chapters.forEach((c, i) => { if (c.top <= mid) idx = i; });
    if (idx !== current) {
      railBtns.forEach((b, i) => { if (i === idx) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
      if (current !== -1) live.textContent = `Chapter ${idx + 1}: ${chapters[idx].label}`;
      current = idx;
    }
  }

  /* ---------------- frame ---------------- */
  let sy = scrollY, camZPrev = sy * ZVH / Math.max(1, innerHeight), vel = 0;
  let camX = 0, camY = 0, tCamX = 0, tCamY = 0;
  const t0 = performance.now();
  const house = document.querySelector('.house');
  const heroIn = document.querySelector('.hero .in');

  addEventListener('pointermove', e => {
    if (reduce) return;
    tCamX = (e.clientX / W - 0.5) * 80; tCamY = (e.clientY / H - 0.5) * 52;
  }, { passive: true });

  function proj(x, y, dz, par = 1) { const k = F / dz; return [CX + (x - camX * par) * k, CY + (y - camY * par) * k, k]; }

  function draw(now) {
    const t = (now - t0) / 1000;
    sy = reduce ? scrollY : sy + (scrollY - sy) * 0.085;
    if (Math.abs(scrollY - sy) < 0.05) sy = scrollY;
    if (!reduce) { camX += (tCamX - camX) * 0.04; camY += (tCamY - camY) * 0.04; }
    const camZ = sy * ZVH / H;
    vel = reduce ? 0 : lerp(vel, camZ - camZPrev, 0.35);
    camZPrev = camZ;

    // the house lights going down
    const intro = reduce ? 1 : smooth(0.3, 2.6, t);
    house.style.opacity = reduce ? 0 : (1 - intro).toFixed(3);

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#07050b';
    ctx.fillRect(0, 0, W, H);

    const domeA = 1 - smooth(0, H * 1.25, sy);
    const deepA = smooth(lastCtr - H * 0.9, lastCtr, sy);

    // Milky Way
    ctx.globalCompositeOperation = 'lighter';
    ctx.save();
    ctx.globalAlpha = (0.32 + 0.22 * (1 - domeA) - 0.3 * deepA) * intro;
    ctx.translate(CX - camX * 0.4, CY - camY * 0.4 - H * 0.08 * domeA);
    ctx.rotate(-0.42);
    ctx.drawImage(milky, -milky.width / 2, -milky.height / 2);
    ctx.restore();

    // deep field
    if (deepA > 0.002) {
      const z = 1 + 0.06 * Math.max(0, (sy - (lastCtr - H)) / H);
      ctx.save();
      ctx.globalAlpha = deepA * 0.85;
      ctx.translate(CX - camX * 0.15, CY - camY * 0.15); ctx.scale(z, z);
      ctx.drawImage(deep, -W / 2, -H / 2, W, H);
      ctx.restore();
    }

    // stars
    const streak = clamp(vel * 5, -500, 1100);
    const starA = (0.15 + 0.85 * intro);
    ctx.lineCap = 'round';
    for (const s of stars) {
      const z = reduce ? s.z : s.z - t * 10;
      const dz = ((z - camZ) % DEPTH + DEPTH) % DEPTH;
      if (dz < 8) continue;
      const near = 1 - dz / DEPTH;
      const tw = reduce ? 0.86 : 0.72 + 0.28 * Math.sin(t * s.tw + s.ph);
      const a = Math.min(1, 0.15 + near * 1.9) * tw * s.b * starA;
      const [x1, y1, k] = proj(s.x, s.y, dz);
      if (x1 < -40 || x1 > W + 40 || y1 < -40 || y1 > H + 40) continue;
      const w = (0.8 + near * near * 2.8) * s.s;
      ctx.strokeStyle = `rgba(${s.c},${a.toFixed(3)})`;
      ctx.lineWidth = w;
      ctx.beginPath();
      if (Math.abs(streak) > 2 && !reduce) {
        const dz0 = Math.max(8, dz + streak);
        const [x0, y0] = proj(s.x, s.y, dz0);
        ctx.moveTo(x0, y0);
      } else ctx.moveTo(x1 - 0.01, y1);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }

    // bodies
    for (const key in objs) {
      const o = objs[key]; if (!o.sprite || o.z === undefined) continue;
      let dz = o.z - camZ;
      if (o.hold) dz = Math.max(dz, o.vd);
      if (dz <= 1) continue;
      const a = smooth(o.vd + 1500, o.vd + 450, dz) * (o.hold ? 1 : smooth(o.vd * 0.22, o.vd * 0.7, dz));
      if (a <= 0.003) continue;
      const [x, y, k] = proj(o.x, o.y, dz, 1);
      const R = o.r * k;
      if (R > W * 4) continue;
      ctx.globalCompositeOperation = (key === 'moon' || key === 'saturn') ? 'source-over' : 'lighter';
      ctx.globalAlpha = a;
      ctx.drawImage(o.sprite, x - R, y - R, R * 2, R * 2);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    drawDome(domeA, sy / H, t);

    // copy
    const hp = sy / (H * 0.65);
    const ho = clamp(1 - hp, 0, 1);
    heroIn.style.opacity = ho.toFixed(3);
    heroIn.style.transform = reduce ? 'none' : `translateY(${(-0.25 * sy).toFixed(1)}px) scale(${(1 - 0.06 * clamp(hp, 0, 1)).toFixed(4)})`;
    heroIn.style.visibility = ho < 0.01 ? 'hidden' : 'visible';
    for (let i = 1; i < chapters.length; i++) {
      const c = chapters[i];
      const lp = (sy - c.top + H / 2) / c.h;
      let op = clamp(Math.min((lp + 0.22) / 0.32, (1.22 - lp) / 0.32), 0, 1);
      if (i === chapters.length - 1) op = clamp((lp + 0.22) / 0.32, 0, 1);
      c.copy.style.opacity = op.toFixed(3);
      c.copy.style.transform = reduce ? 'none' : `translateY(${lerp(18, -18, clamp(lp, 0, 1)).toFixed(1)}px)`;
      c.copy.style.visibility = op < 0.01 ? 'hidden' : 'visible';
    }

    // readouts
    const km = at(sy);
    const sec = km / C_KMS;
    put('km', fmtDist(km));
    put('lt', fmtTravel(sec));
    put('left', fmtLeft(sec));
    setCurrent();

    // the readouts belong to the voyage: they leave when the wall arrives
    const off = wallEl.getBoundingClientRect().top < H * 0.55;
    if (off !== hudOff) { hudOff = off; hudEls.forEach(el => el.classList.toggle('is-off', off)); }
  }
  const wallEl = document.getElementById('wall');
  const hudEls = [...document.querySelectorAll('.hud, .rail')];
  let hudOff = false;

  let raf = 0;
  function loop(now) { draw(now); raf = requestAnimationFrame(loop); }

  /* ---------------- boot ---------------- */
  for (const k in objs) objs[k].sprite = objs[k].paint();
  buildDome();
  resize();
  let rt = 0;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resize(); if (reduce) draw(performance.now()); fitWord(); updateFoot(); }, 120); });
  if (reduce) {
    draw(performance.now());
    addEventListener('scroll', () => requestAnimationFrame(draw), { passive: true });
    setInterval(() => draw(performance.now()), 1000);
  } else {
    raf = requestAnimationFrame(loop);
  }
  document.fonts && document.fonts.ready.then(() => { layout(); fitWord(); updateFoot(); });
  addEventListener('load', () => { layout(); fitWord(); updateFoot(); });

  document.querySelector('[data-to-top]').addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  /* ---------------- the wall of plates ---------------- */
  const plates = [
    {
      id: 'saturn', w: 240, h: 172, a: 'Saturn', m: 'Planet, sixth from the Sun', title: 'Light from about 78 minutes ago',
      dl: [['Distance', 'About 1.4 billion km, changing as both planets orbit'], ['Light travel', 'About 78 minutes'], ['Seen with', 'A small telescope shows the rings'], ['Where', 'Wanders along the zodiac, one lap every 29 years']],
      note: 'The rings are mostly water ice, in pieces from grains of dust to chunks the size of a house. Sunlight reaches them, bounces, and takes well over an hour more to reach you.'
    },
    {
      id: 'pleiades', w: 186, h: 232, a: 'The Pleiades', m: 'Open star cluster, M45', title: 'Light that left in 1582',
      dl: [['Distance', '444 light-years'], ['The light left', 'Around 1582'], ['Seen with', 'The eye. Binoculars show dozens more'], ['Where', 'Taurus, on winter evenings']],
      note: 'Most people count six or seven stars. The cluster is young, around 100 million years old, and its brightest stars are hot and blue. The haze is not their birth cloud, just dust they are drifting through.'
    },
    {
      id: 'orion', w: 200, h: 252, a: 'The Orion Nebula', m: 'Star-forming nebula, M42', title: 'Light that left in 682',
      dl: [['Distance', '1,344 light-years'], ['The light left', 'Around 682'], ['Seen with', 'The eye, as a soft smudge'], ['Where', 'Orion, below the three belt stars']],
      note: 'The nearest large region of star birth to Earth. Its glow is hydrogen, lit from inside by the four young stars of the Trapezium. Thousands more stars are forming in the cloud around them.'
    },
    {
      id: 'andromeda', w: 272, h: 160, a: 'Andromeda', m: 'Spiral galaxy, M31', title: 'Light from 2.5 million years ago',
      dl: [['Distance', '2.5 million light-years'], ['The light left', '2.5 million years ago'], ['Seen with', 'The eye, from a dark site, as an oval glow'], ['Where', 'Andromeda, near the Great Square of Pegasus']],
      note: 'The nearest large galaxy to ours, with about a trillion stars. It is moving toward the Milky Way at around 110 km a second. The light you see left it before our species existed.'
    }
  ];
  const scale = [0.6, 0.55, 0.55, 0.56];

  function plateSVG(p, uid) {
    const { w, h } = p, cx = w / 2, cy = h / 2;
    let s = 41 + uid.length * 7 + w;
    const r = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    let dots = '';
    for (let i = 0; i < 40; i++) dots += `<circle cx="${(r() * w).toFixed(1)}" cy="${(r() * h).toFixed(1)}" r="${(0.3 + r() * 0.8).toFixed(2)}" fill="#f6eee6" opacity="${(0.3 + r() * 0.6).toFixed(2)}"/>`;
    const defs = `<defs>
      <filter id="paint-${uid}" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter>
      <filter id="soft-${uid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
      <filter id="haze-${uid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
      <radialGradient id="rg-${uid}"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <linearGradient id="bands-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9a46c"/><stop offset=".2" stop-color="#e8cf9c"/><stop offset=".35" stop-color="#bf9662"/><stop offset=".5" stop-color="#f0dcb0"/><stop offset=".66" stop-color="#c89c64"/><stop offset=".82" stop-color="#e3c993"/><stop offset="1" stop-color="#a77b4a"/></linearGradient>
      <radialGradient id="shade-${uid}" cx=".3" cy=".28" r=".95"><stop offset=".45" stop-color="#05030a" stop-opacity="0"/><stop offset=".9" stop-color="#05030a" stop-opacity=".95"/></radialGradient>
      <clipPath id="front-${uid}"><rect x="-200" y="0" width="400" height="200"/></clipPath>
    </defs>`;
    let art = '';
    if (p.id === 'saturn') {
      const ring = (front) => `<g transform="translate(${cx} ${cy}) rotate(-16)" ${front ? `clip-path="url(#front-${uid})"` : ''}><g transform="scale(1 .3)">
        <ellipse rx="96" ry="96" fill="none" stroke="#e6d2ac" stroke-width="16" opacity=".9"/>
        <ellipse rx="77" ry="77" fill="none" stroke="#ccb48a" stroke-width="14" opacity=".75"/>
        <ellipse rx="62" ry="62" fill="none" stroke="#9e8a70" stroke-width="10" opacity=".35"/></g></g>`;
      art = `${ring(false)}
        <g><circle cx="${cx}" cy="${cy}" r="44" fill="url(#bands-${uid})" transform="rotate(-16 ${cx} ${cy})"/><circle cx="${cx}" cy="${cy}" r="44" fill="url(#shade-${uid})"/></g>
        ${ring(true)}`;
    } else if (p.id === 'pleiades') {
      const st = [[0, 0, 2.9], [-0.62, 0.06, 3.6], [-0.63, -0.06, 5], [0.55, 0.12, 3.7], [0.42, -0.22, 3.9], [0.25, 0.3, 4.2], [0.62, -0.4, 4.3], [0.74, -0.05, 5.4]];
      art = `<g filter="url(#haze-${uid})" opacity=".85">${st.map(([x, y]) => `<ellipse cx="${cx - 10 + x * 70}" cy="${cy + y * 70}" rx="34" ry="12" transform="rotate(-30 ${cx - 10 + x * 70} ${cy + y * 70})" fill="#6f8fff" opacity=".55"/>`).join('')}</g>
        ${st.map(([x, y, m]) => { const b = (6.5 - m) / 3.6, X = cx - 10 + x * 70, Y = cy + y * 70; return `<circle cx="${X}" cy="${Y}" r="${(5 + 9 * b).toFixed(1)}" fill="url(#rg-${uid})" opacity=".6"/><circle cx="${X}" cy="${Y}" r="${(1.4 + 1.8 * b).toFixed(1)}" fill="#f2f6ff"/><path d="M${X - 10 * b - 4} ${Y}H${X + 10 * b + 4}M${X} ${Y - 10 * b - 4}V${Y + 10 * b + 4}" stroke="#dfe8ff" stroke-width=".7" opacity=".7"/>`; }).join('')}`;
    } else if (p.id === 'orion') {
      let wisps = '';
      for (const [d0, n] of [[-2.5, 14], [0.6, 14], [-1.4, 7], [2.2, 7]]) {
        let x = cx, y = cy, d = d0;
        for (let i = 0; i < n; i++) {
          d += (r() - 0.5) * 0.7; x += Math.cos(d) * 7; y += Math.sin(d) * 7;
          const col = ['#d8344f', '#ff5a7a', '#b02a48', '#ff8aa0'][Math.floor(r() * 4)];
          wisps += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(8 + r() * 14).toFixed(1)}" ry="${(3 + r() * 6).toFixed(1)}" transform="rotate(${(d * 57.3).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${col}" opacity="${(0.35 + r() * 0.35).toFixed(2)}"/>`;
        }
      }
      art = `<g filter="url(#haze-${uid})"><ellipse cx="${cx - 6}" cy="${cy + 6}" rx="76" ry="62" fill="#a8243f" opacity=".55"/></g>
        <g filter="url(#soft-${uid})" opacity=".9">${wisps}</g>
        <g filter="url(#soft-${uid})"><ellipse cx="${cx + 4}" cy="${cy}" rx="26" ry="20" fill="#5fd8c8" opacity=".6"/></g>
        <g filter="url(#soft-${uid})"><ellipse cx="${cx - 34}" cy="${cy - 4}" rx="18" ry="10" fill="#07050b" opacity=".8"/><circle cx="${cx + 2}" cy="${cy}" r="12" fill="#fff1e2" opacity=".9"/></g>
        <circle cx="${cx + 8}" cy="${cy - 78}" r="10" fill="#ff5a7a" opacity=".5" filter="url(#soft-${uid})"/>
        ${[[-3, -2], [3, -3], [-1, 3], [4, 2]].map(([x, y]) => `<circle cx="${cx + 2 + x}" cy="${cy + y}" r="1.3" fill="#fff"/>`).join('')}`;
    } else {
      art = `<g transform="translate(${cx} ${cy}) rotate(-28)">
          <g filter="url(#haze-${uid})"><ellipse rx="118" ry="30" fill="#8ea6ff" opacity=".55"/><ellipse rx="70" ry="18" fill="#ffd9bd" opacity=".7"/></g>
          <g filter="url(#soft-${uid})"><ellipse rx="26" ry="9" fill="#fff4e4"/></g>
          <path d="M-86 6 Q0 26 86 2" fill="none" stroke="#0b070e" stroke-width="3" opacity=".7" filter="url(#soft-${uid})"/>
          <path d="M-60 10 Q0 20 64 6" fill="none" stroke="#0b070e" stroke-width="2" opacity=".75"/>
        </g>
        <circle cx="${cx + 22}" cy="${cy - 18}" r="3" fill="#ffeedd" opacity=".85" filter="url(#soft-${uid})"/>
        <ellipse cx="${cx - 52}" cy="${cy + 40}" rx="12" ry="6" fill="#ffe2cc" opacity=".35" transform="rotate(-50 ${cx - 52} ${cy + 40})" filter="url(#soft-${uid})"/>`;
    }
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true" focusable="false">${defs}
      <rect x="-6" y="-6" width="${w + 12}" height="${h + 12}" fill="#06040a"/>
      <g filter="url(#paint-${uid})">${dots}${art}</g></svg>`;
  }

  const works = [...document.querySelectorAll('.work')];
  works.forEach((wk, i) => {
    const p = plates[i], cv = wk.querySelector('.cv');
    cv.innerHTML = plateSVG(p, p.id + '-w');
    const svg = cv.querySelector('svg');
    svg.setAttribute('width', Math.round(p.w * scale[i])); svg.setAttribute('height', Math.round(p.h * scale[i]));
  });

  const detail = document.querySelector('.detail');
  const big = detail.querySelector('.big');
  const bigCv = big.querySelector('.cv');
  const stage = detail.querySelector('.stagebig');
  const panel = detail.querySelector('.panel');
  const closeBtn = detail.querySelector('.close');
  let openIdx = -1, opener = null;

  function fillPanel(i) {
    const p = plates[i];
    panel.querySelector('.pd-a').textContent = p.a;
    panel.querySelector('.pd-m').textContent = p.m;
    panel.querySelector('h2').textContent = p.title;
    panel.querySelector('.pd-dl').innerHTML = p.dl.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
    panel.querySelector('.pd-note').textContent = p.note;
    panel.querySelector('.pd-count').textContent = `${i + 1} of ${plates.length}`;
    big.dataset.frame = works[i].querySelector('.art').dataset.frame;
    bigCv.innerHTML = plateSVG(p, p.id + '-b');
    const sw = stage.clientWidth || innerWidth - 380, sh = stage.clientHeight || innerHeight;
    const padF = big.dataset.frame === 'mat' ? 52 : big.dataset.frame === 'brass' ? 28 : 32;
    const k = Math.max(0.5, Math.min((sw - 112 - padF) / p.w, (sh - 112 - padF) / p.h, 2.4));
    const svg = bigCv.querySelector('svg');
    svg.setAttribute('width', Math.round(p.w * k)); svg.setAttribute('height', Math.round(p.h * k));
  }
  function flip(fromEl, toEl, back) {
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    const tr = `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`;
    return toEl.animate(back ? [{ transform: 'none' }, { transform: tr }] : [{ transform: tr }, { transform: 'none' }],
      { duration: back ? 380 : 560, easing: 'cubic-bezier(.16,1,.3,1)', fill: back ? 'forwards' : 'none' });
  }
  function open(i) {
    openIdx = i;
    opener = works[i].querySelector('.art');
    detail.hidden = false;
    detail.setAttribute('aria-hidden', 'false');
    fillPanel(i);
    const wallFrame = opener.querySelector('.frame');
    requestAnimationFrame(() => {
      detail.classList.add('open');
      if (!reduce) flip(wallFrame, big, false);
      wallFrame.style.visibility = 'hidden';
      closeBtn.focus({ preventScroll: true });
    });
    document.documentElement.style.overflow = 'hidden';
  }
  function close() {
    if (openIdx < 0) return;
    const wallFrame = works[openIdx].querySelector('.frame');
    const done = () => {
      detail.hidden = true; detail.setAttribute('aria-hidden', 'true');
      big.getAnimations().forEach(a => a.cancel());
      wallFrame.style.visibility = '';
      opener && opener.focus({ preventScroll: true });
      openIdx = -1;
    };
    detail.classList.remove('open');
    document.documentElement.style.overflow = '';
    if (reduce) { done(); return; }
    wallFrame.style.visibility = 'hidden';
    flip(wallFrame, big, true).finished.then(done, done);
  }
  function step(d) {
    const prevFrame = works[openIdx].querySelector('.frame');
    prevFrame.style.visibility = '';
    openIdx = (openIdx + d + plates.length) % plates.length;
    opener = works[openIdx].querySelector('.art');
    opener.querySelector('.frame').style.visibility = 'hidden';
    fillPanel(openIdx);
    if (!reduce) big.animate([{ opacity: 0, transform: `translateX(${d * 24}px)` }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.2,.7,.2,1)' });
  }
  works.forEach((wk, i) => wk.querySelector('.art').addEventListener('click', () => open(i)));
  document.querySelectorAll('[data-open]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const i = +a.dataset.open;
    document.getElementById('wall').scrollIntoView({ behavior: 'auto', block: 'center' });
    setTimeout(() => open(i), 60);
  }));
  closeBtn.addEventListener('click', close);
  detail.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => step(+b.dataset.step)));
  stage.addEventListener('click', e => { if (!big.contains(e.target)) close(); });
  detail.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    else if (e.key === 'Tab') {
      const f = [...detail.querySelectorAll('button')];
      const iA = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(iA + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });

  /* ---------------- footer ---------------- */
  const foot = document.querySelector('.foot');
  const word = foot.querySelector('.word');
  const text = 'late light.';
  word.innerHTML = [...text].map((ch, i) => {
    const cls = i === text.length - 1 ? ' class="end"' : (i >= 5 && i <= 9 ? ' class="it"' : '');
    return `<span style="--i:${i}"${cls}>${ch === ' ' ? '&nbsp;' : ch}</span>`;
  }).join('');
  function fitWord() {
    word.style.setProperty('--word', '200px');
    const avail = foot.clientWidth - (W < 760 ? 40 : 80);
    word.style.setProperty('--word', (200 * avail / word.scrollWidth).toFixed(1) + 'px');
  }
  function updateFoot() {
    const r = foot.getBoundingClientRect(), vh = innerHeight;
    const p = clamp((vh - r.top) / Math.max(1, Math.min(r.height, vh)), 0, 1);
    foot.style.setProperty('--p', reduce ? '1' : p.toFixed(3));
  }
  addEventListener('scroll', updateFoot, { passive: true });
  fitWord(); updateFoot();
  foot.querySelector('.replay').addEventListener('click', () => {
    const top = foot.offsetTop - innerHeight + 80;
    scrollTo({ top, behavior: 'auto' });
    updateFoot();
    setTimeout(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: reduce ? 'auto' : 'smooth' }), 420);
  });

  // the visitor's clock
  const hmEl = foot.querySelector('[data-hm]'), sEl = foot.querySelector('[data-s]'), zEl = foot.querySelector('[data-zone]');
  const off = -new Date().getTimezoneOffset();
  zEl.textContent = `Your time, GMT${off >= 0 ? '+' : '-'}${Math.floor(Math.abs(off) / 60)}${Math.abs(off) % 60 ? ':' + pad(Math.abs(off) % 60) : ''}`;
  function tick() {
    const d = new Date();
    const hm = pad(d.getHours()) + ':' + pad(d.getMinutes()), s = ':' + pad(d.getSeconds());
    if (hmEl.textContent !== hm) hmEl.textContent = hm;
    sEl.textContent = s;
  }
  tick(); setInterval(tick, 1000);

  // tonight's Moon, from the date
  (function moon() {
    const SYN = 29.530588853;
    const ref = Date.UTC(2000, 0, 6, 18, 14);
    const age = (((Date.now() - ref) / 86400000) % SYN + SYN) % SYN;
    const ph = age / SYN;
    const illum = (1 - Math.cos(TAU * ph)) / 2;
    const pct = Math.round(illum * 100);
    const waxing = ph < 0.5;
    let name;
    if (age < 1.0 || age > SYN - 1.0) name = 'new Moon';
    else if (Math.abs(age - SYN / 2) < 1.0) name = 'full Moon';
    else if (Math.abs(age - SYN / 4) < 1.0) name = 'first quarter';
    else if (Math.abs(age - 3 * SYN / 4) < 1.0) name = 'last quarter';
    else name = (waxing ? 'waxing ' : 'waning ') + (illum < 0.5 ? 'crescent' : 'gibbous');
    foot.querySelector('[data-moon]').textContent = `${pct}% lit, ${name}.`;
    const r = 18, rx = Math.abs(Math.cos(TAU * ph)) * r;
    const outer = waxing ? 1 : 0;
    const inner = illum < 0.5 ? (waxing ? 0 : 1) : (waxing ? 1 : 0);
    const d = `M20 2 A${r} ${r} 0 0 ${outer} 20 38 A${rx.toFixed(2)} ${r} 0 0 ${inner} 20 2 Z`;
    foot.querySelector('.phase .lit').setAttribute('d', d);
  })();
})();
