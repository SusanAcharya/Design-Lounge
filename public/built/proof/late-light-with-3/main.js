/* Late Light · the pull-back voyage, the frames strip, the visit block · Designed using Design Lounge (https://www.designlounge.live) */
(() => {
'use strict';

const C = 299792458;
const LY = 9.4607e15;
const BG = '#050811';
const E_MIN = 1, E_MAX = 23;
const DEC_VH = 0.7;          // viewport heights of scroll per power of ten
const END_HOLD = 1.0;        // viewport heights held on the last frame
const DPR = Math.min(2, window.devicePixelRatio || 1);
const media = matchMedia('(prefers-reduced-motion: reduce)');
let reduce = media.matches;
media.addEventListener('change', (e) => { reduce = e.matches; });

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* colours of the scene */
const MOON = [223, 233, 255], SOD = [255, 180, 92], SUN = [255, 241, 196], ICE = [159, 216, 255], HA = [255, 122, 158], WHITE = [238, 240, 244], BLUE = [86, 150, 230];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/* number formats: two significant figures, with separators */
const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
function sig(x, n) { if (x === 0) return 0; const p = Math.pow(10, Math.floor(Math.log10(Math.abs(x))) - (n - 1)); return Math.round(x / p) * p; }
function fmtNum(x) { const s = sig(x, 2); if (s < 10) return (Math.round(s * 10) / 10).toString(); return nf.format(s); }
function plural(v, one, many) { return v === '1' ? one : many; }
function fmtWidth(m) {
  if (m < 1e3) return fmtNum(m) + ' m';
  if (m < 1e9) return fmtNum(m / 1e3) + ' km';
  if (m < 1e12) return fmtNum(m / 1e9) + ' million km';
  if (m < 0.1 * LY) return fmtNum(m / 1e12) + ' billion km';
  const ly = m / LY;
  if (ly < 1e6) { const v = fmtNum(ly); return v + plural(v, ' light-year', ' light-years'); }
  return fmtNum(ly / 1e6) + ' million light-years';
}
function fmtTime(s) {
  if (s < 1e-6) return fmtNum(s * 1e9) + ' ns';
  if (s < 1e-3) return fmtNum(s * 1e6) + ' µs';
  if (s < 1) return fmtNum(s * 1e3) + ' ms';
  if (s < 60) return fmtNum(s) + ' s';
  if (s < 3600) return fmtNum(s / 60) + ' min';
  if (s < 86400) return fmtNum(s / 3600) + ' h';
  const y = s / 31557600;
  if (y < 1) { const v = fmtNum(s / 86400); return v + plural(v, ' day', ' days'); }
  if (y < 1e6) { const v = fmtNum(y); return v + plural(v, ' year', ' years'); }
  return fmtNum(y / 1e6) + ' million years';
}

/* ---------- sprites: a square of the world, painted once ---------- */
const sprites = {};
function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function glow(ctx, x, y, r, col, a) {
  if (r < 0.5) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(col, a)); g.addColorStop(0.22, rgba(col, a * 0.5)); g.addColorStop(0.55, rgba(col, a * 0.13)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
}
function feather(c, from, to) {
  const ctx = c.getContext('2d'), N = c.width;
  ctx.globalCompositeOperation = 'destination-out';
  const g = ctx.createRadialGradient(N / 2, N / 2, N * from, N / 2, N / 2, N * to);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, N, N);
  ctx.globalCompositeOperation = 'source-over';
}
function withMip(c) { const m = mk(256, 256); const g = m.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(c, 0, 0, 256, 256); return m; }

/* value noise for the land, in km around the dome */
const nz = rng(4071);
const NOISE = new Float32Array(256 * 256); for (let i = 0; i < NOISE.length; i++) NOISE[i] = nz();
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const i = (xi & 255), j = (yi & 255);
  const a = NOISE[((j & 255) << 8) | i], b = NOISE[((j & 255) << 8) | ((i + 1) & 255)];
  const c = NOISE[(((j + 1) & 255) << 8) | i], d = NOISE[(((j + 1) & 255) << 8) | ((i + 1) & 255)];
  return lerp(lerp(a, b, sx), lerp(c, d, sx), sy) * 2 - 1;
}
function landValue(xkm, ykm) {
  let v = 0, amp = 1, wl = 1700;
  for (let o = 0; o < 5; o++) { v += vnoise(xkm / wl + 31.7 * o, ykm / wl + 17.3 * o) * amp; amp *= 0.5; wl *= 0.42; }
  v += 0.55 * Math.exp(-((xkm + 12) ** 2 + (ykm + 8) ** 2) / (90 * 90));   // the dome is on land
  v -= 0.75 * Math.exp(-((xkm - 46) ** 2 + (ykm - 38) ** 2) / (34 * 34));   // the sea, lower right
  return v;
}
const isLand = (x, y) => landValue(x, y) > 0.04;

/* a lit sphere, per pixel */
function shadeSphere(ctx, cx, cy, R, L, base, hi, dark, W, H) {
  const x0 = Math.max(0, Math.floor(cx - R)), y0 = Math.max(0, Math.floor(cy - R));
  const x1 = Math.min(W, Math.ceil(cx + R)), y1 = Math.min(H, Math.ceil(cy + R));
  if (x1 <= x0 || y1 <= y0) return;
  const img = ctx.getImageData(x0, y0, x1 - x0, y1 - y0), d = img.data, w = x1 - x0;
  const ll = Math.hypot(L[0], L[1], L[2]), lx = L[0] / ll, ly = L[1] / ll, lz = L[2] / ll;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const dx = (x + 0.5 - cx) / R, dy = (y + 0.5 - cy) / R, rr = dx * dx + dy * dy;
    if (rr > 1) continue;
    const nzv = Math.sqrt(1 - rr);
    const ndl = dx * lx + dy * ly + nzv * lz;
    const lit = clamp(ndl, 0, 1), spec = Math.pow(lit, 9);
    const edge = smooth(0.985, 1.0, Math.sqrt(rr));
    const k = ((y - y0) * w + (x - x0)) * 4;
    for (let i = 0; i < 3; i++) {
      let v = base[i] * (0.28 + 0.72 * lit) + hi[i] * spec * 0.55 + dark[i] * (1 - lit) * 0.35;
      v = v * (1 - edge * 0.5);
      d[k + i] = clamp(v, 0, 255);
    }
    d[k + 3] = 255;
  }
  ctx.putImageData(img, x0, y0);
}
function domeSeams(ctx, cx, cy, Rpx, n, rings) {
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, Rpx, 0, Math.PI * 2); ctx.clip();
  ctx.lineWidth = Math.max(1, Rpx * 0.004);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    ctx.strokeStyle = 'rgba(0,0,0,.38)'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * Rpx, cy + Math.sin(a) * Rpx); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.05)'; ctx.beginPath(); ctx.moveTo(cx + 1.5, cy); ctx.lineTo(cx + 1.5 + Math.cos(a) * Rpx, cy + Math.sin(a) * Rpx); ctx.stroke();
  }
  for (const f of rings) { ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.arc(cx, cy, Rpx * f, 0, Math.PI * 2); ctx.stroke(); }
  ctx.restore();
}
function lamp(ctx, x, y, r, a, col) {
  ctx.globalCompositeOperation = 'lighter';
  glow(ctx, x, y, r, col || SOD, a);
  ctx.fillStyle = rgba(WHITE, Math.min(1, a * 1.6)); ctx.beginPath(); ctx.arc(x, y, Math.max(0.8, r * 0.06), 0, Math.PI * 2); ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
}
function car(ctx, x, y, w, h, a) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  ctx.fillStyle = '#121923'; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = 'rgba(223,233,255,.12)'; ctx.fillRect(-w / 2, -h / 2, w * 0.6, h * 0.35);
  ctx.restore();
}

/* the building in metres around the dome, used at two scales */
function drawBuilding(ctx, cx, cy, ppm, detail, W, H) {
  const m = (v) => v * ppm;
  ctx.fillStyle = '#10161f'; ctx.fillRect(cx - m(30), cy - m(20), m(60), m(40));
  ctx.strokeStyle = '#1c2531'; ctx.lineWidth = Math.max(1, m(0.6)); ctx.strokeRect(cx - m(30), cy - m(20), m(60), m(40));
  ctx.fillStyle = '#0e131b';
  [[-24, -14, 5, 3], [18, 12, 7, 4], [-26, 12, 4, 4], [22, -15, 6, 3]].forEach(([x, y, w, h]) => ctx.fillRect(cx + m(x), cy + m(y), m(w), m(h)));
  if (detail) {
    // the plaza, bollard lamps, the car park, the street, the trees
    ctx.fillStyle = '#0f131a'; ctx.fillRect(cx - m(34), cy + m(22), m(68), m(22));
    for (let i = 0; i < 7; i++) lamp(ctx, cx - m(30) + m(10) * i, cy + m(33), m(7), 0.5);
    ctx.fillStyle = '#0b0f15'; ctx.fillRect(cx + m(36), cy - m(24), m(28), m(48));
    ctx.strokeStyle = 'rgba(238,240,244,.07)'; ctx.lineWidth = Math.max(1, m(0.15));
    for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(cx + m(38), cy - m(22) + m(5.5) * i); ctx.lineTo(cx + m(62), cy - m(22) + m(5.5) * i); ctx.stroke(); }
    const r = rng(9);
    for (let i = 0; i < 9; i++) if (r() < 0.6) car(ctx, cx + m(41) + m(11) * (i % 2), cy - m(19.5) + m(5.5) * Math.floor(i / 2) * 1.0, m(4.4), m(2), 0);
    [[40, -20], [60, -20], [40, 20], [60, 20]].forEach(([x, y]) => lamp(ctx, cx + m(x), cy + m(y), m(16), 0.42));
    ctx.fillStyle = '#0c1016'; ctx.fillRect(cx - m(70), cy + m(48), m(140), m(11));
    ctx.setLineDash([m(2), m(2)]); ctx.strokeStyle = 'rgba(238,240,244,.16)'; ctx.lineWidth = Math.max(1, m(0.25));
    ctx.beginPath(); ctx.moveTo(cx - m(70), cy + m(53.5)); ctx.lineTo(cx + m(70), cy + m(53.5)); ctx.stroke(); ctx.setLineDash([]);
    for (let i = -2; i <= 2; i++) lamp(ctx, cx + m(25) * i, cy + m(46.5), m(15), 0.45);
    car(ctx, cx - m(40), cy + m(51), m(4.4), m(2), 0); car(ctx, cx + m(30), cy + m(56), m(4.4), m(2), 0);
    const tr = rng(21);
    for (let i = 0; i < 9; i++) {
      const x = cx - m(58) + m(7) * (i % 3) + m(tr() * 4), y = cy - m(22) + m(13) * Math.floor(i / 3) + m(tr() * 5), rad = m(3.5 + tr() * 2.5);
      ctx.fillStyle = '#0d1612'; ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(223,233,255,.07)'; ctx.beginPath(); ctx.arc(x - rad * 0.3, y - rad * 0.3, rad * 0.55, 0, Math.PI * 2); ctx.fill();
    }
  }
  shadeSphere(ctx, cx, cy, m(12), [-0.5, -0.5, 0.7], [34, 42, 58], MOON, [8, 12, 24], W, H);
  domeSeams(ctx, cx, cy, m(12), 16, [0.33, 0.66]);
}

function makeSprite(e, cover, N, paint) {
  const c = mk(N, N), ctx = c.getContext('2d');
  const ppm = N / (Math.pow(10, e) * cover);
  ctx.fillStyle = BG; ctx.fillRect(0, 0, N, N);
  paint(ctx, N / 2, N / 2, ppm, N);
  feather(c, 0.42, 0.5);
  return { canvas: c, small: withMip(c), e, cover };
}

const PAINT = {
  // 10 m: the crown of the dome, from above, lit by the moon
  1(ctx, cx, cy, ppm, N) {
    const R = 12 * ppm;
    ctx.fillStyle = '#10161f'; ctx.fillRect(0, 0, N, N);
    shadeSphere(ctx, cx, cy, R, [-0.5, -0.5, 0.7], [40, 49, 66], MOON, [10, 14, 26], N, N);
    domeSeams(ctx, cx, cy, R, 24, [0.17, 0.34, 0.5, 0.67]);
    ctx.fillStyle = 'rgba(223,233,255,.08)'; ctx.beginPath(); ctx.arc(cx, cy, 0.9 * ppm, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(223,233,255,.28)'; ctx.lineWidth = Math.max(1, 0.05 * ppm); ctx.beginPath(); ctx.arc(cx, cy, 0.9 * ppm, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(223,233,255,.5)'; ctx.beginPath(); ctx.arc(cx - 0.25 * ppm, cy - 0.25 * ppm, 0.16 * ppm, 0, Math.PI * 2); ctx.fill();
    const r = rng(3); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 1400; i++) { ctx.fillStyle = `rgba(223,233,255,${r() * 0.05})`; ctx.fillRect(r() * N, r() * N, 1.5, 1.5); }
    ctx.globalCompositeOperation = 'source-over';
  },
  // 100 m: the building, the car park, the street
  2(ctx, cx, cy, ppm, N) {
    ctx.fillStyle = '#090c12'; ctx.fillRect(0, 0, N, N);
    const r = rng(5); ctx.fillStyle = 'rgba(238,240,244,.025)';
    for (let i = 0; i < 2500; i++) ctx.fillRect(r() * N, r() * N, 2, 2);
    drawBuilding(ctx, cx, cy, ppm, true, N, N);
  },
  // 1 km: streets and blocks
  3(ctx, cx, cy, ppm, N) {
    const m = (v) => v * ppm, r = rng(11);
    ctx.fillStyle = '#070a0f'; ctx.fillRect(0, 0, N, N);
    const half = 625;
    const xs = [], ys = [];
    for (let v = -half; v <= half; v += 95 + r() * 40) xs.push(v);
    for (let v = -half; v <= half; v += 95 + r() * 40) ys.push(v);
    ctx.fillStyle = '#0d1117';
    for (const x of xs) ctx.fillRect(cx + m(x) - m(4), 0, m(8), N);
    for (const y of ys) ctx.fillRect(0, cy + m(y) - m(4), N, m(8));
    ctx.fillStyle = '#0f1319'; ctx.fillRect(0, cy + m(300) - m(9), N, m(18));
    // a park
    ctx.fillStyle = '#0a120e'; ctx.beginPath(); ctx.ellipse(cx + m(260), cy - m(240), m(120), m(80), 0.3, 0, Math.PI * 2); ctx.fill();
    // windows
    for (let i = 0; i < 900; i++) { const x = (r() - 0.5) * 1250, y = (r() - 0.5) * 1250; ctx.fillStyle = rgba(r() < 0.5 ? SUN : SOD, 0.25 + r() * 0.5); ctx.fillRect(cx + m(x), cy + m(y), Math.max(1, m(1.2)), Math.max(1, m(1.2))); }
    // lamps along the streets
    for (const x of xs) for (let y = -half; y <= half; y += 28) lamp(ctx, cx + m(x) + m(4.5), cy + m(y), m(11), 0.28);
    for (const y of ys) for (let x = -half; x <= half; x += 28) lamp(ctx, cx + m(x), cy + m(y) + m(4.5), m(11), 0.28);
    for (let x = -half; x <= half; x += 22) lamp(ctx, cx + m(x), cy + m(300), m(16), 0.34);
    drawBuilding(ctx, cx, cy, ppm, false, N, N);
    [[-30, 33], [-10, 33], [10, 33], [30, 33], [40, -20], [60, 20], [-50, 46], [0, 46], [50, 46]].forEach(([x, y]) => lamp(ctx, cx + m(x), cy + m(y), m(12), 0.4));
  },
  // 10 km: the town
  4(ctx, cx, cy, ppm, N) {
    const m = (v) => v * ppm, r = rng(23);
    ctx.fillStyle = '#060910'; ctx.fillRect(0, 0, N, N);
    // the river
    ctx.strokeStyle = '#04060a'; ctx.lineWidth = m(320); ctx.lineCap = 'round'; ctx.beginPath();
    ctx.moveTo(cx - m(7000), cy + m(2600));
    ctx.bezierCurveTo(cx - m(2500), cy + m(1600), cx + m(500), cy + m(3400), cx + m(2400), cy + m(1900));
    ctx.bezierCurveTo(cx + m(4200), cy + m(600), cx + m(5000), cy + m(2800), cx + m(7000), cy + m(1200));
    ctx.stroke();
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, cx, cy, m(4200), SOD, 0.16);
    ctx.globalCompositeOperation = 'source-over';
    // radial roads with lamps
    for (let k = 0; k < 9; k++) {
      const a = (k / 9) * Math.PI * 2 + 0.2, bend = (r() - 0.5) * 0.5;
      for (let d = 150; d < 6400; d += 60) {
        const aa = a + bend * (d / 6400), x = cx + Math.cos(aa) * m(d), y = cy + Math.sin(aa) * m(d);
        lamp(ctx, x, y, m(90), 0.18 * Math.exp(-d / 5200));
      }
    }
    // the ring road
    for (let a = 0; a < Math.PI * 2; a += 0.012) lamp(ctx, cx + Math.cos(a) * m(3000 + Math.sin(a * 3) * 240), cy + Math.sin(a) * m(3000 + Math.cos(a * 2) * 300), m(80), 0.16);
    // the streets as a scatter that thins with distance
    for (let i = 0; i < 2600; i++) {
      const d = Math.pow(r(), 0.7) * 5200, a = r() * Math.PI * 2, x = cx + Math.cos(a) * m(d), y = cy + Math.sin(a) * m(d);
      lamp(ctx, x, y, m(55 + r() * 70), 0.22 * Math.exp(-d / 3600));
    }
    // bridges
    [[-1900, 2050], [900, 2650], [3300, 1450]].forEach(([x, y]) => { for (let i = -3; i <= 3; i++) lamp(ctx, cx + m(x) + m(60) * i, cy + m(y), m(70), 0.24); });
    // villages
    for (let i = 0; i < 7; i++) { const a = r() * Math.PI * 2, d = 4200 + r() * 1800, x = cx + Math.cos(a) * m(d), y = cy + Math.sin(a) * m(d); for (let j = 0; j < 20; j++) lamp(ctx, x + (r() - 0.5) * m(500), y + (r() - 0.5) * m(500), m(60), 0.2); }
    lamp(ctx, cx, cy, m(60), 0.6, MOON);
  },
  // 100 km: the region, the coast
  5(ctx, cx, cy, ppm, N) {
    const m = (v) => v * ppm, r = rng(37);
    // land and sea from the same land function, at a quarter resolution
    const L = Math.round(N / 4), img = ctx.createImageData(L, L), d = img.data;
    for (let j = 0; j < L; j++) for (let i = 0; i < L; i++) {
      const xkm = (i + 0.5 - L / 2) / L * 125, ykm = (j + 0.5 - L / 2) / L * 125, land = isLand(xkm, ykm);
      const k = (j * L + i) * 4;
      d[k] = land ? 6 : 3; d[k + 1] = land ? 9 : 6; d[k + 2] = land ? 13 : 10; d[k + 3] = 255;
    }
    const tmp = mk(L, L); tmp.getContext('2d').putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true; ctx.drawImage(tmp, 0, 0, N, N);
    // moon glitter on the sea, from the upper left
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, cx + m(52), cy + m(44), m(30), MOON, 0.05);
    ctx.globalCompositeOperation = 'source-over';
    // towns on land, roads between them
    const towns = [[0, 0, 4.6]];
    let tries = 0;
    while (towns.length < 16 && tries++ < 4000) { const x = (r() - 0.5) * 120, y = (r() - 0.5) * 120; if (!isLand(x, y)) continue; if (towns.some(t => Math.hypot(t[0] - x, t[1] - y) < 11)) continue; towns.push([x, y, 0.8 + r() * 2.4]); }
    ctx.strokeStyle = rgba(SOD, 0.09); ctx.lineWidth = Math.max(1, m(0.25));
    for (let i = 1; i < towns.length; i++) { const t = towns[i]; let best = towns[0], bd = 1e9; for (let j = 0; j < i; j++) { const dd = Math.hypot(towns[j][0] - t[0], towns[j][1] - t[1]); if (dd < bd) { bd = dd; best = towns[j]; } } ctx.beginPath(); ctx.moveTo(cx + m(t[0]), cy + m(t[1])); ctx.lineTo(cx + m(best[0]), cy + m(best[1])); ctx.stroke(); }
    for (const [x, y, s] of towns) { lamp(ctx, cx + m(x), cy + m(y), m(s * 3.2), 0.5); for (let j = 0; j < s * 14; j++) lamp(ctx, cx + m(x) + (r() - 0.5) * m(s * 2.4), cy + m(y) + (r() - 0.5) * m(s * 2.4), m(0.5 + r() * 0.8), 0.5); }
    // thin cloud
    for (let i = 0; i < 5; i++) { const x = cx + (r() - 0.5) * N, y = cy + (r() - 0.5) * N; for (let j = 0; j < 12; j++) glow(ctx, x + (r() - 0.5) * m(30), y + (r() - 0.5) * m(10), m(6 + r() * 8), MOON, 0.035); }
  },
  // 1,000 km: the continent at night
  6(ctx, cx, cy, ppm, N) {
    const m = (v) => v * ppm, r = rng(41);
    const L = Math.round(N / 3), img = ctx.createImageData(L, L), d = img.data;
    for (let j = 0; j < L; j++) for (let i = 0; i < L; i++) {
      const xkm = (i + 0.5 - L / 2) / L * 1250, ykm = (j + 0.5 - L / 2) / L * 1250, land = isLand(xkm, ykm);
      const k = (j * L + i) * 4;
      d[k] = land ? 7 : 3; d[k + 1] = land ? 10 : 6; d[k + 2] = land ? 14 : 11; d[k + 3] = 255;
    }
    const tmp = mk(L, L); tmp.getContext('2d').putImageData(img, 0, 0);
    ctx.drawImage(tmp, 0, 0, N, N);
    // cities, thicker on the coast
    let n = 0, tries = 0;
    while (n < 420 && tries++ < 30000) {
      const x = (r() - 0.5) * 1250, y = (r() - 0.5) * 1250;
      if (!isLand(x, y)) continue;
      const coast = !isLand(x + 45, y) || !isLand(x - 45, y) || !isLand(x, y + 45) || !isLand(x, y - 45);
      if (r() > (coast ? 0.55 : 0.12)) continue;
      const s = 6 + Math.pow(r(), 2.2) * 44;
      lamp(ctx, cx + m(x), cy + m(y), m(s), 0.5);
      for (let j = 0; j < 6; j++) lamp(ctx, cx + m(x) + (r() - 0.5) * m(s * 1.4), cy + m(y) + (r() - 0.5) * m(s * 1.4), m(2 + r() * 4), 0.3);
      n++;
    }
    lamp(ctx, cx, cy, m(14), 0.5);
    // moonlit cloud
    for (let i = 0; i < 9; i++) { const x = cx + (r() - 0.5) * N * 1.1, y = cy + (r() - 0.5) * N * 1.1, w = m(90 + r() * 160); for (let j = 0; j < 18; j++) { const ox = (r() - 0.5) * w * 2, oy = (r() - 0.5) * w * 0.6; glow(ctx, x + ox, y + oy, m(40 + r() * 60), [120, 140, 175], 0.05); glow(ctx, x + ox - m(14), y + oy - m(14), m(20 + r() * 30), MOON, 0.035); } }
  },
  // 10,000 km: the Earth, night side toward us, the Sun behind it
  7(ctx, cx, cy, ppm, N) {
    const R = 6371e3 * ppm, r = rng(53);
    const L = Math.round(R * 2);
    const img = ctx.createImageData(L, L), d = img.data;
    const S = [-0.42, -0.42, -0.8], sl = Math.hypot(...S), sx = S[0] / sl, sy = S[1] / sl, sz = S[2] / sl;
    const M = [-0.5, -0.5, 0.7], ml = Math.hypot(...M), mx = M[0] / ml, my = M[1] / ml, mz = M[2] / ml;
    for (let j = 0; j < L; j++) for (let i = 0; i < L; i++) {
      const dx = (i + 0.5 - L / 2) / (L / 2), dy = (j + 0.5 - L / 2) / (L / 2), rr = dx * dx + dy * dy, k = (j * L + i) * 4;
      const dist = Math.sqrt(rr), aa = clamp((1 - dist) * (L / 2), 0, 1);
      if (aa <= 0) { d[k + 3] = 0; continue; }
      const nzv = Math.sqrt(Math.max(0, 1 - rr));
      const land = isLand(dx * 6371, dy * 6371);
      const ndS = dx * sx + dy * sy + nzv * sz, ndM = dx * mx + dy * my + nzv * mz;
      const day = smooth(-0.06, 0.14, ndS), moon = 0.55 + 0.45 * clamp(ndM, 0, 1);
      const night = land ? [9, 15, 24] : [6, 13, 28];
      const dayc = land ? [122, 128, 78] : [52, 112, 196];
      const edge = smooth(0.86, 1.0, dist);
      for (let q = 0; q < 3; q++) {
        let v = night[q] * moon * (1 - day) + dayc[q] * (0.35 + 0.65 * clamp(ndS, 0, 1)) * day;
        v = v + (BLUE[q] * 0.55 - v) * edge * (0.45 + 0.4 * day);
        d[k + q] = clamp(v, 0, 255);
      }
      d[k + 3] = Math.round(255 * aa);
    }
    const tmp = mk(L, L); tmp.getContext('2d').putImageData(img, 0, 0);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(tmp, cx - R, cy - R, 2 * R, 2 * R);
    // city lights on the night side
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    let n = 0, tries = 0;
    while (n < 900 && tries++ < 40000) {
      const dx = (r() - 0.5) * 2, dy = (r() - 0.5) * 2, rr = dx * dx + dy * dy; if (rr > 0.96) continue;
      if (!isLand(dx * 6371, dy * 6371)) continue;
      const nzv = Math.sqrt(1 - rr), ndS = dx * sx + dy * sy + nzv * sz; if (ndS > -0.05) continue;
      const coast = !isLand(dx * 6371 + 60, dy * 6371) || !isLand(dx * 6371, dy * 6371 + 60);
      if (r() > (coast ? 0.6 : 0.2)) continue;
      const rad = R * (0.003 + Math.pow(r(), 2.4) * 0.016);
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, cx + dx * R, cy + dy * R, rad, SOD, 0.3 * nzv);
      ctx.fillStyle = rgba(SUN, 0.5 * nzv); ctx.beginPath(); ctx.arc(cx + dx * R, cy + dy * R, Math.max(0.6, rad * 0.08), 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      n++;
    }
    // cloud, brighter in the morning edge
    for (let i = 0; i < 70; i++) {
      const a = r() * Math.PI * 2, dd = Math.sqrt(r()) * 0.95, dx = Math.cos(a) * dd, dy = Math.sin(a) * dd, nzv = Math.sqrt(Math.max(0, 1 - dd * dd));
      const ndS = dx * sx + dy * sy + nzv * sz, day = smooth(-0.08, 0.14, ndS);
      for (let j = 0; j < 7; j++) glow(ctx, cx + dx * R + (r() - 0.5) * R * 0.16, cy + dy * R + (r() - 0.5) * R * 0.06, R * (0.02 + r() * 0.05), WHITE, 0.035 + day * 0.3);
    }
    ctx.restore();
    // the atmosphere
    ctx.globalCompositeOperation = 'lighter';
    // a radial gradient paints its first stop inside the inner circle, so the ring starts at radius 0 and stays clear until the limb
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.07);
    g.addColorStop(0, 'rgba(120,180,255,0)'); g.addColorStop(0.905, 'rgba(120,180,255,0)'); g.addColorStop(0.925, 'rgba(120,180,255,.5)'); g.addColorStop(0.95, 'rgba(70,140,255,.2)'); g.addColorStop(1, 'rgba(60,120,255,0)');
    ctx.fillStyle = g; ctx.fillRect(cx - R * 1.1, cy - R * 1.1, R * 2.2, R * 2.2);
    // the dawn on the upper left limb
    const ga = ctx.createRadialGradient(cx - R * 0.72, cy - R * 0.72, 0, cx - R * 0.72, cy - R * 0.72, R * 0.6);
    ga.addColorStop(0, rgba(SUN, 0.5)); ga.addColorStop(0.5, rgba(SUN, 0.12)); ga.addColorStop(1, rgba(SUN, 0));
    ctx.fillStyle = ga; ctx.fillRect(cx - R * 1.4, cy - R * 1.4, R * 1.4, R * 1.4);
    ctx.globalCompositeOperation = 'source-over';
  },
  // 100,000 light-years: the Milky Way, face on, with the Sun at the centre of the frame
  21(ctx, cx, cy, ppm, N) {
    const r = rng(67), Rg = 4.73e20 * ppm;
    const gx = cx + 2.46e20 * ppm * 0.7071, gy = cy + 2.46e20 * ppm * 0.7071;
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, gx, gy, Rg * 1.05, [150, 170, 220], 0.16);
    glow(ctx, gx, gy, Rg * 0.42, SUN, 0.24);
    glow(ctx, gx, gy, Rg * 0.14, SUN, 0.9);
    // the bar
    ctx.save(); ctx.translate(gx, gy); ctx.rotate(0.5);
    for (let i = 0; i < 60; i++) glow(ctx, (r() - 0.5) * Rg * 0.5, (r() - 0.5) * Rg * 0.1, Rg * 0.06, SUN, 0.1);
    ctx.restore();
    // four arms, two from each end of the bar
    for (let arm = 0; arm < 4; arm++) {
      const a0 = 0.5 + arm * Math.PI / 2;
      for (let t = 0; t < 1; t += 0.0022) {
        const th = t * 3.4, rad = Rg * 0.2 * Math.exp(0.49 * th);
        if (rad > Rg * 1.02) break;
        const x = gx + Math.cos(th + a0) * rad, y = gy + Math.sin(th + a0) * rad;
        const w = Rg * (0.035 + 0.05 * t), jx = (r() - 0.5) * w * 2, jy = (r() - 0.5) * w * 2;
        glow(ctx, x + jx, y + jy, w * (0.5 + r()), [190, 210, 250], 0.07 * (1 - t * 0.5));
        if (r() < 0.08) glow(ctx, x + jx, y + jy, w * 0.35, HA, 0.26);
        if (r() < 0.3) glow(ctx, x + jx, y + jy, w * 0.15, WHITE, 0.3);
      }
    }
    // field stars across the disc
    for (let i = 0; i < 2600; i++) { const a = r() * Math.PI * 2, dd = Math.pow(r(), 0.6) * Rg; ctx.fillStyle = rgba(r() < 0.5 ? WHITE : SUN, r() * 0.35); ctx.fillRect(gx + Math.cos(a) * dd, gy + Math.sin(a) * dd, 1.5, 1.5); }
    ctx.globalCompositeOperation = 'destination-out';
    // dust lanes along the inner edge of the arms
    for (let arm = 0; arm < 4; arm++) {
      const a0 = 0.5 + arm * Math.PI / 2 - 0.12;
      for (let t = 0.1; t < 0.9; t += 0.004) {
        const th = t * 3.4, rad = Rg * 0.2 * Math.exp(0.49 * th) * 0.9;
        const x = gx + Math.cos(th + a0) * rad, y = gy + Math.sin(th + a0) * rad;
        glow(ctx, x + (r() - 0.5) * Rg * 0.03, y + (r() - 0.5) * Rg * 0.03, Rg * (0.012 + r() * 0.02), [0, 0, 0], 0.5);
      }
    }
    ctx.globalCompositeOperation = 'lighter';
    // globular clusters in the halo
    for (let i = 0; i < 40; i++) { const a = r() * Math.PI * 2, dd = (0.5 + r() * 0.7) * Rg; glow(ctx, gx + Math.cos(a) * dd, gy + Math.sin(a) * dd * 0.9, Rg * 0.008, SUN, 0.5); }
    ctx.globalCompositeOperation = 'source-over';
  },
  // 10 million light-years: the Local Group
  23(ctx, cx, cy, ppm, N) {
    const r = rng(71), ly = (v) => v * LY * ppm;
    ctx.globalCompositeOperation = 'lighter';
    // far galaxies on the line of sight
    for (let i = 0; i < 220; i++) { const x = r() * N, y = r() * N, s = 1.2 + r() * 3; ctx.save(); ctx.translate(x, y); ctx.rotate(r() * Math.PI); ctx.scale(1, 0.35 + r() * 0.65); glow(ctx, 0, 0, s * 2.5, r() < 0.5 ? [200, 190, 170] : [170, 190, 230], 0.4); ctx.restore(); }
    const spiral = (x, y, size, tilt, rot, bright) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(1, tilt);
      glow(ctx, 0, 0, size * 3.2, [170, 185, 225], 0.16 * bright);
      glow(ctx, 0, 0, size * 1.3, [190, 200, 235], 0.4 * bright);
      glow(ctx, 0, 0, size * 0.55, SUN, 0.7 * bright);
      glow(ctx, 0, 0, size * 0.2, WHITE, 1 * bright);
      for (let arm = 0; arm < 2; arm++) for (let t = 0; t < 1; t += 0.03) { const th = t * 3.2 + arm * Math.PI, rad = size * 0.25 * Math.exp(0.42 * th * 0.9); if (rad > size * 1.05) break; glow(ctx, Math.cos(th) * rad, Math.sin(th) * rad, size * 0.1, [200, 215, 250], 0.12 * bright); }
      ctx.restore();
    };
    // the Milky Way, at the centre of the frame
    spiral(cx, cy, ly(50000), 1, 0.6, 1);
    glow(ctx, cx + ly(120000), cy + ly(110000), ly(9000), [200, 205, 230], 0.35);   // the Large Magellanic Cloud
    glow(ctx, cx + ly(150000), cy + ly(135000), ly(5000), [200, 205, 230], 0.3);    // the Small Magellanic Cloud
    // Andromeda, 2.5 million light-years, and Triangulum beside it
    spiral(cx + ly(2500000) * 0.7071, cy - ly(2500000) * 0.7071, ly(110000), 0.3, 0.75, 1.15);
    spiral(cx + ly(2730000) * 0.82, cy - ly(2730000) * 0.57, ly(30000), 0.7, 0.2, 0.7);
    // dwarf galaxies of the group
    for (let i = 0; i < 34; i++) { const a = r() * Math.PI * 2, dd = ly(300000 + r() * 2600000); glow(ctx, cx + Math.cos(a) * dd, cy + Math.sin(a) * dd, ly(6000 + r() * 12000), [190, 195, 220], 0.16); }
    ctx.globalCompositeOperation = 'source-over';
  },
};

/* ---------- vector plates: orbits, dots and labels drawn each frame ---------- */
let canvasFont = '500 11px Jost, sans-serif';
let labelsOn = true, labelClipY = Infinity;
function label(ctx, text, x, y, a, align) {
  if (!labelsOn || a <= 0.02 || y > labelClipY) return;
  ctx.font = canvasFont; ctx.textAlign = align || 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(184,191,204,${a})`; ctx.fillText(text, x, y);
}
function dot(ctx, x, y, rad, col, a, sunDir) {
  ctx.globalCompositeOperation = 'lighter';
  glow(ctx, x, y, rad * 3.2, col, 0.35 * a);
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = rgba(col, a); ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
  if (sunDir && rad > 2.5) {
    // the dark side, away from the Sun
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.clip();
    const g = ctx.createLinearGradient(x + sunDir[0] * rad, y + sunDir[1] * rad, x - sunDir[0] * rad, y - sunDir[1] * rad);
    g.addColorStop(0.35, 'rgba(5,8,17,0)'); g.addColorStop(0.75, `rgba(5,8,17,${0.92 * a})`);
    ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, 2 * rad, 2 * rad); ctx.restore();
  }
}
function ring(ctx, x, y, rad, a, w) {
  if (rad < 1 || rad > 20000) return;
  ctx.strokeStyle = rgba(ICE, 0.32 * a); ctx.lineWidth = w || 1; ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.stroke();
}
const SUNDIR = [-0.7071, -0.7071];
const VECTOR = [
  { e: 9, win: [7.6, 10.8], draw(ctx, cx, cy, ppm, a, r) {
    const rm = 3.844e8 * ppm;
    ring(ctx, cx, cy, rm, a);
    glow(ctx, cx, cy, Math.max(8, 6.371e6 * ppm * 2.2), BLUE, 0.4 * a);
    const th = -0.62, mx = cx + Math.cos(th) * rm, my = cy + Math.sin(th) * rm;
    dot(ctx, mx, my, Math.max(1.6, 1.737e6 * ppm), [214, 214, 206], a, SUNDIR);
    const la = a * smooth(0.25, 0.6, r) * smooth(3.5, 2, r);
    label(ctx, 'Moon', mx + 12, my, la); label(ctx, 'Earth', cx + 12, cy + 14, la);
  } },
  { e: 12, win: [10.5, 13.8], draw(ctx, cx, cy, ppm, a, r) {
    const au = 1.496e11 * ppm, sx = cx - au * 0.7071, sy = cy - au * 0.7071;
    const orbits = [[0.387, 'Mercury', 0.9, [190, 186, 178], 2.44e6], [0.723, 'Venus', 2.5, [236, 222, 190], 6.05e6], [1, 'Earth', Math.PI / 4, [120, 170, 240], 6.371e6], [1.524, 'Mars', 4.1, [222, 140, 96], 3.39e6], [5.203, 'Jupiter', 5.4, [226, 198, 160], 6.99e7]];
    const la = a * smooth(0.2, 0.5, r) * smooth(4, 2.2, r);
    for (const [au_, name, th, col, rad] of orbits) {
      ring(ctx, sx, sy, au * au_, a * (au_ > 2 ? 0.5 : 1));
      const px = sx + Math.cos(th) * au * au_, py = sy + Math.sin(th) * au * au_;
      if (name === 'Earth' && ppm * 6.371e6 > 2) continue;   // the Earth sprite still draws it
      dot(ctx, px, py, Math.max(1.4, rad * ppm), col, a, SUNDIR);
      label(ctx, name, px + 10, py + (name === 'Earth' ? 12 : 0), la);
    }
  } },
  { e: 13, win: [11.8, 15.2], draw(ctx, cx, cy, ppm, a, r) {
    const au = 1.496e11 * ppm, sx = cx - au * 0.7071, sy = cy - au * 0.7071;
    const orbits = [[9.537, 'Saturn', 2.1, [228, 206, 160], 5.82e7], [19.19, 'Uranus', 3.6, [170, 220, 230], 2.54e7], [30.07, 'Neptune', 5.0, [96, 130, 230], 2.46e7]];
    const la = a * smooth(0.2, 0.5, r) * smooth(4, 2.2, r);
    for (const [au_, name, th, col, rad] of orbits) {
      ring(ctx, sx, sy, au * au_, a);
      const px = sx + Math.cos(th) * au * au_, py = sy + Math.sin(th) * au * au_;
      const R = Math.max(1.5, rad * ppm);
      if (name === 'Saturn' && R > 3) { ctx.strokeStyle = rgba([228, 206, 160], 0.6 * a); ctx.lineWidth = Math.max(1, R * 0.25); ctx.beginPath(); ctx.ellipse(px, py, R * 2.2, R * 0.6, -0.4, 0, Math.PI * 2); ctx.stroke(); }
      dot(ctx, px, py, R, col, a, SUNDIR);
      label(ctx, name, px + 10 + R, py, la);
    }
  } },
  { e: 12, win: [10.3, 18.4], id: 'sun', draw(ctx, cx, cy, ppm, a, r, e) {
    const au = 1.496e11 * ppm, sx = cx - au * 0.7071, sy = cy - au * 0.7071;
    const big = clamp(6.96e8 * ppm * 2, 0, 60);
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, sx, sy, 46 + big, SUN, 0.5 * a);
    glow(ctx, sx, sy, 14 + big, SUN, 0.9 * a);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = rgba(WHITE, a); ctx.beginPath(); ctx.arc(sx, sy, 2.2 + big * 0.5, 0, Math.PI * 2); ctx.fill();
    const la = a * smooth(10.6, 11.2, e) * smooth(16.2, 15.6, e);
    label(ctx, 'Sun', sx + 16 + big * 0.5, sy, la);
  } },
  { e: 14, win: [12.6, 16.2], id: 'voyager', draw(ctx, cx, cy, ppm, a, r) {
    const d = 2.5e13 * ppm, x = cx + d * 0.5, y = cy + d * 0.866;
    if (d < 3) return;
    ctx.fillStyle = rgba(ICE, a); ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill();
    label(ctx, 'Voyager 1', x + 9, y, a * smooth(30, 70, d));
  } },
  { e: 18, win: [16.3, 19.8], draw(ctx, cx, cy, ppm, a, r) {
    const stars = [[4.24, 0.35, 'Proxima Centauri', [255, 170, 140], 1.3], [6.0, 2.0, "Barnard's Star", [255, 180, 150], 1.1], [8.6, 4.6, 'Sirius', [205, 225, 255], 2.4], [11.4, 3.9, 'Procyon', [250, 245, 225], 1.7], [16.7, 1.0, 'Altair', [240, 245, 255], 1.6], [25, 0.2, 'Vega', [210, 225, 255], 1.9], [25.1, 5.3, 'Fomalhaut', [230, 238, 255], 1.5], [34, 4.2, 'Pollux', [255, 210, 150], 1.6], [37, 1.6, 'Arcturus', [255, 190, 120], 2.0], [43, 2.9, 'Capella', [255, 236, 190], 1.8], [51, 3.6, 'Castor', [220, 230, 255], 1.4], [65, 4.8, 'Aldebaran', [255, 170, 110], 1.8], [79, 2.4, 'Regulus', [200, 220, 255], 1.5]];
    const la = a * smooth(0.2, 0.5, r) * smooth(3.2, 1.8, r);
    for (const [ly, th, name, col, size] of stars) {
      const d = ly * LY * ppm, x = cx + Math.cos(th) * d, y = cy + Math.sin(th) * d;
      if (d < 4) continue;
      dot(ctx, x, y, size, col, a * smooth(4, 14, d));
      label(ctx, name, x + 10, y, la * smooth(40, 90, d));
    }
    dot(ctx, cx, cy, 2.2, SUN, a);
    label(ctx, 'Sun', cx + 11, cy + 1, la);
  } },
  { e: 23, win: [22.1, 24.5], id: 'group', draw(ctx, cx, cy, ppm, a, r) {
    const ly = (v) => v * LY * ppm, la = a * smooth(0.3, 0.7, r) * smooth(3, 1.6, r);
    const ax = cx + ly(2500000) * 0.7071, ay = cy - ly(2500000) * 0.7071;
    label(ctx, 'Andromeda', ax + 14 + ly(140000), ay, la);
    label(ctx, 'Triangulum', cx + ly(2730000) * 0.82 + 10 + ly(40000), cy - ly(2730000) * 0.57 + 14, la * 0.8);
    label(ctx, 'The Milky Way', cx + 12 + ly(60000), cy + 14, la);
  } },
];

/* ---------- plates, in draw order from the largest frame to the smallest ---------- */
const SPRITE_E = [1, 2, 3, 4, 5, 6, 7, 21, 23];
const COVER = { 7: 2.4 };
let spriteN = 1024;
function plateList() {
  const list = [];
  for (const e of SPRITE_E) list.push({ e, sprite: true });
  for (const v of VECTOR) list.push(v);
  list.sort((a, b) => b.e - a.e);
  return list;
}
let PLATES = plateList();

/* the background stars, in unit coordinates */
const STARS = [];
{ const r = rng(101); for (let i = 0; i < 760; i++) STARS.push({ x: r(), y: r(), s: 0.4 + Math.pow(r(), 3) * 1.6, b: 0.35 + r() * 0.65, ph: r() * 6.28, tw: 0.5 + r() * 2.5, c: r() < 0.12 ? SUN : r() < 0.3 ? ICE : WHITE }); }
function drawStars(ctx, w, h, e, t, scale) {
  const a = smooth(6.4, 8.0, e) * smooth(21.6, 20.4, e);
  if (a <= 0.01) return;
  ctx.globalCompositeOperation = 'lighter';
  for (const s of STARS) {
    const tw = reduce ? 0.86 : 0.74 + 0.26 * Math.sin(t * s.tw + s.ph);
    ctx.fillStyle = rgba(s.c, a * s.b * tw);
    const rad = s.s * scale;
    ctx.beginPath(); ctx.arc(s.x * w, s.y * h, rad, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
}

function drawScene(ctx, w, h, e, t, opts) {
  opts = opts || {};
  const inset = opts.inset || 0.92, scale = opts.scale || 1;
  const S = Math.min(w, h) * inset;
  const cx = w / 2 + (opts.ox || 0), cy = h / 2 + (opts.oy || 0);
  const ppm = S / Math.pow(10, e);
  labelClipY = opts.clipY === undefined ? Infinity : opts.clipY;
  ctx.fillStyle = BG; ctx.fillRect(0, 0, w, h);
  drawStars(ctx, w, h, e, t, scale);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  for (const p of PLATES) {
    const frame = Math.pow(10, p.e) * ppm, r = frame / S;
    if (p.sprite) {
      const sp = sprites[p.e]; if (!sp) continue;
      if (r > 12 || r < 0.004) continue;
      const a = smooth(12, 10, r) * smooth(0.004, 0.012, r);
      const size = frame * sp.cover;
      ctx.globalAlpha = a;
      ctx.drawImage(size * DPR < 300 ? sp.small : sp.canvas, cx - size / 2, cy - size / 2, size, size);
      ctx.globalAlpha = 1;
    } else {
      const [w0, w1] = p.win;
      const a = smooth(w0, w0 + 0.35, e) * smooth(w1, w1 - 0.35, e);
      if (a <= 0.01) continue;
      p.draw(ctx, cx, cy, ppm, a, r, e);
    }
  }
  // the nested frames
  const maxPx = Math.max(w, h) * 1.3;
  for (let E = E_MIN; E <= E_MAX; E++) {
    const size = Math.pow(10, E) * ppm;
    if (size < 6 || size > maxPx) continue;
    const a = 0.62 * smooth(6, 22, size);
    ctx.strokeStyle = rgba(ICE, a); ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(cx - size / 2) + 0.5, Math.round(cy - size / 2) + 0.5, Math.round(size), Math.round(size));
    if (size > 96 && S > 200 && size <= Math.min(w, h)) {
      ctx.font = canvasFont; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = rgba(ICE, Math.min(0.9, a + 0.2));
      ctx.fillText(fmtWidth(Math.pow(10, E)), cx - size / 2 + 8, cy - size / 2 + 17);
    }
  }
}

/* ---------- the page ---------- */
const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d', { alpha: false });
const track = document.getElementById('track');
const chapters = [...document.querySelectorAll('.ch')].map((el) => ({ el, e: +el.dataset.e, label: el.dataset.label, width: el.dataset.width, inner: el.querySelector('.in') }));
const railOl = document.getElementById('rail');
const live = document.getElementById('live');
const roW = document.getElementById('ro-w'), roT = document.getElementById('ro-t'), roS = document.getElementById('ro-s');
let W = innerWidth, H = innerHeight, DEC_PX = DEC_VH * H;
let sy = scrollY, targetY = scrollY, camX = 0, camY = 0, px = 0, py = 0;
let current = -1, lastW = '', lastT = '', lastS = '';
const t0 = performance.now();

function yFor(e) { return (e - E_MIN) * DEC_PX; }
function eFor(y) { return clamp(E_MIN + y / DEC_PX, E_MIN, E_MAX); }

function layout() {
  W = innerWidth; H = innerHeight; DEC_PX = DEC_VH * H;
  track.style.height = Math.round((E_MAX - E_MIN) * DEC_PX + END_HOLD * H) + 'px';
  canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
}

/* the stop index */
chapters.forEach((c, i) => {
  const li = document.createElement('li');
  const b = document.createElement('button'); b.type = 'button';
  b.setAttribute('aria-label', `Stop ${i + 1}: ${c.label}, ${c.width}`);
  b.innerHTML = `<span>${c.label}, ${c.width}</span><i aria-hidden="true"></i>`;
  b.addEventListener('click', () => scrollTo({ top: yFor(c.e), behavior: reduce ? 'auto' : 'smooth' }));
  li.appendChild(b); railOl.appendChild(li); c.btn = b;
});

function setCurrent(i) {
  if (i === current) return;
  current = i;
  chapters.forEach((c, k) => { if (k === i) c.btn.setAttribute('aria-current', 'true'); else c.btn.removeAttribute('aria-current'); });
  live.textContent = `Stop ${i + 1}: ${chapters[i].label}`;
}

function updateCopy(e) {
  let cur = 0;
  chapters.forEach((c, i) => {
    const ws = i === 0 ? -1e9 : c.e - 0.45, we = i === chapters.length - 1 ? 1e9 : c.e + 0.55;
    const a = Math.min(smooth(ws, ws + 0.18, e), smooth(we, we - 0.18, e));
    if (e >= ws) cur = i;
    const el = c.el;
    if (a < 0.01) { if (el.style.visibility !== 'hidden') { el.style.visibility = 'hidden'; el.style.opacity = '0'; } return; }
    el.style.visibility = 'visible';
    el.style.opacity = a.toFixed(3);
    const drift = reduce ? 0 : (e - c.e) * -22;
    c.inner.style.transform = i === 0 ? `translateY(${(drift * 0.6).toFixed(1)}px)` : `translateY(${drift.toFixed(1)}px)`;
  });
  setCurrent(cur);
}

function updateHud(e, now) {
  const w = Math.pow(10, e);
  const s1 = fmtWidth(w), s2 = fmtTime(w / C);
  if (s1 !== lastW) { roW.textContent = s1; lastW = s1; }
  if (s2 !== lastT) { roT.textContent = s2; lastT = s2; }
  const km = Math.round(C * (now - t0) / 1000 / 1000);
  const s3 = nf.format(reduce ? Math.round(km / 300000) * 300000 : km) + ' km';
  if (s3 !== lastS) { roS.textContent = s3; lastS = s3; }
}

let lastFrame = 0, running = true;
function frame(now) {
  if (!running) return;
  requestAnimationFrame(frame);
  if (now - lastFrame < 30) return;
  lastFrame = now;
  targetY = scrollY;
  sy = reduce ? targetY : sy + (targetY - sy) * 0.085;
  if (Math.abs(targetY - sy) < 0.3) sy = targetY;
  const e = eFor(sy);
  updateCopy(e);
  updateHud(e, now);
  const trackEnd = track.offsetHeight;
  if (scrollY > trackEnd + H) return;     // the sections cover the sky
  if (!reduce) { camX += (px - camX) * 0.04; camY += (py - camY) * 0.04; } else { camX = camY = 0; }
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  drawScene(ctx, W, H, e, (now - t0) / 1000, { ox: camX, oy: camY, scale: 1, clipY: W <= 760 ? H * 0.4 : Infinity });
}

addEventListener('pointermove', (ev) => { px = (ev.clientX / W - 0.5) * 36; py = (ev.clientY / H - 0.5) * 24; }, { passive: true });
document.addEventListener('visibilitychange', () => { if (document.hidden) running = false; else if (!running) { running = true; requestAnimationFrame(frame); } });

const home = document.getElementById('home'), topbtn = document.getElementById('topbtn');
const goHome = () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
home.addEventListener('click', goHome); topbtn.addEventListener('click', goHome);

/* ---------- the frames strip ---------- */
const row = document.getElementById('row'), scroller = document.getElementById('scroller');
const view = document.getElementById('view'), viewc = document.getElementById('viewc');
const loupe = document.getElementById('loupe'), loupec = document.getElementById('loupec');
const metaN = document.getElementById('meta-n'), metaT = document.getElementById('meta-t'), metaP = document.getElementById('meta-p'), metaW = document.getElementById('meta-w'), metaL = document.getElementById('meta-l');
const countEl = document.getElementById('count');
let selected = 0, thumbsDone = false, loupeX = 0, loupeY = 0, loupeOn = false;
const frames = chapters.map((c, i) => {
  const li = document.createElement('li');
  const edge = document.createElement('span'); edge.className = 'edge num'; edge.setAttribute('aria-hidden', 'true'); edge.textContent = c.width;
  const b = document.createElement('button'); b.type = 'button'; b.className = 'frame';
  b.setAttribute('aria-label', `Frame ${i + 1}: ${c.label}, ${c.width} across`);
  const cv = document.createElement('canvas'); b.appendChild(cv);
  li.appendChild(edge); li.appendChild(b); row.appendChild(li);
  b.addEventListener('click', () => { if (scroller.dataset.drag === '1') return; select(i, true); });
  b.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') { ev.preventDefault(); const n = clamp(i + (ev.key === 'ArrowRight' ? 1 : -1), 0, chapters.length - 1); select(n, true); frames[n].btn.focus(); }
  });
  return { btn: b, cv, c };
});

function thumbSize() { return frames[0].btn.clientWidth || 150; }
function renderThumbs() {
  const size = thumbSize();
  frames.forEach((f) => {
    f.cv.width = Math.round(size * DPR); f.cv.height = Math.round(size * DPR);
    const g = f.cv.getContext('2d'); g.setTransform(DPR, 0, 0, DPR, 0, 0);
    drawScene(g, size, size, f.c.e, 0, { inset: 0.92, scale: 0.6 });
  });
  thumbsDone = true;
}
function viewSize() { return view.clientWidth - 12; }
function renderView() {
  const size = viewSize(); if (size < 10) return;
  viewc.width = Math.round(size * DPR); viewc.height = Math.round(size * DPR);
  const g = viewc.getContext('2d'); g.setTransform(DPR, 0, 0, DPR, 0, 0);
  drawScene(g, size, size, chapters[selected].e, 0, { inset: 0.92, scale: 1 });
}
function renderLoupe() {
  const size = viewSize(), L = 176, k = 3;
  loupec.width = Math.round(L * DPR); loupec.height = Math.round(L * DPR);
  const g = loupec.getContext('2d'); g.setTransform(DPR, 0, 0, DPR, 0, 0);
  g.translate(L / 2 - loupeX * k, L / 2 - loupeY * k);
  const saveLabels = labelsOn; labelsOn = false;
  drawScene(g, size * k, size * k, chapters[selected].e, 0, { inset: 0.92, scale: k });
  labelsOn = saveLabels;
}
function placeLoupe() {
  loupe.style.transform = `translate(${(loupeX - 88).toFixed(1)}px, ${(loupeY - 88).toFixed(1)}px)`;
}
function select(i, animate) {
  const prev = selected; selected = i;
  frames.forEach((f, k) => { if (k === i) f.btn.setAttribute('aria-current', 'true'); else f.btn.removeAttribute('aria-current'); });
  const c = chapters[i], w = Math.pow(10, c.e);
  metaN.textContent = `Frame ${i + 1} of ${chapters.length}`;
  metaT.textContent = c.label;
  metaP.textContent = c.el.querySelector('p').textContent;
  metaW.textContent = fmtWidth(w); metaL.textContent = fmtTime(w / C);
  countEl.textContent = `Frame ${i + 1} of ${chapters.length}`;
  renderView();
  if (loupeOn) renderLoupe();
  const fr = frames[i].btn;
  const left = fr.offsetLeft - scroller.clientWidth / 2 + fr.clientWidth / 2;
  scroller.scrollTo({ left, behavior: reduce || !animate ? 'auto' : 'smooth' });
  if (animate && !reduce && prev !== i) {
    const a = fr.getBoundingClientRect(), b = view.getBoundingClientRect();
    view.classList.add('flip');
    view.style.transition = 'none';
    view.style.transform = `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width})`;
    view.style.opacity = '.6';
    void view.offsetWidth;
    view.style.transition = 'transform 460ms cubic-bezier(.16,1,.3,1), opacity 460ms cubic-bezier(.16,1,.3,1)';
    view.style.transform = 'none'; view.style.opacity = '1';
    setTimeout(() => { view.style.transition = ''; view.classList.remove('flip'); }, 480);
  }
}

/* drag, wheel and keys on the strip */
let dragX = 0, dragLeft = 0, dragging = false, moved = 0;
scroller.addEventListener('pointerdown', (ev) => { dragging = true; moved = 0; dragX = ev.clientX; dragLeft = scroller.scrollLeft; scroller.dataset.drag = '0'; });
addEventListener('pointermove', (ev) => { if (!dragging) return; const dx = ev.clientX - dragX; moved = Math.max(moved, Math.abs(dx)); if (moved > 5) { scroller.classList.add('dragging'); scroller.dataset.drag = '1'; } scroller.scrollLeft = dragLeft - dx; });
addEventListener('pointerup', () => { if (!dragging) return; dragging = false; scroller.classList.remove('dragging'); setTimeout(() => { scroller.dataset.drag = '0'; }, 0); });
scroller.addEventListener('wheel', (ev) => {
  if (Math.abs(ev.deltaY) <= Math.abs(ev.deltaX)) return;
  const max = scroller.scrollWidth - scroller.clientWidth;
  const at = scroller.scrollLeft;
  if ((ev.deltaY > 0 && at >= max - 1) || (ev.deltaY < 0 && at <= 1)) return;
  ev.preventDefault(); scroller.scrollLeft = at + ev.deltaY;
}, { passive: false });

/* the loupe */
view.addEventListener('pointermove', (ev) => {
  const b = view.getBoundingClientRect();
  loupeX = ev.clientX - b.left - 6; loupeY = ev.clientY - b.top - 6;
  loupeOn = true; loupe.classList.add('on'); placeLoupe(); renderLoupe();
});
view.addEventListener('pointerleave', () => { loupeOn = false; loupe.classList.remove('on'); });
view.addEventListener('keydown', (ev) => {
  const step = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] }[ev.key];
  if (!step) return;
  ev.preventDefault();
  const size = viewSize();
  if (!loupeOn) { loupeX = size / 2; loupeY = size / 2; }
  loupeX = clamp(loupeX + step[0], 0, size); loupeY = clamp(loupeY + step[1], 0, size);
  loupeOn = true; loupe.classList.add('on'); placeLoupe(); renderLoupe();
});
view.addEventListener('blur', () => { loupeOn = false; loupe.classList.remove('on'); });

/* ---------- build the sprites, the first two now, the rest in idle time ---------- */
function build() {
  const S = Math.min(W, H);
  spriteN = clamp(Math.round(S * DPR * 1.3), 768, 1536);
  const order = [1, 2, 3, 4, 7, 21, 23, 5, 6];
  const next = () => {
    const e = order.shift();
    if (e === undefined) { renderThumbs(); renderView(); return; }
    if (!sprites[e]) sprites[e] = makeSprite(e, COVER[e] || 1.25, spriteN, PAINT[e]);
    setTimeout(next, 16);
  };
  sprites[1] = makeSprite(1, 1.25, spriteN, PAINT[1]); order.shift();
  sprites[2] = makeSprite(2, 1.25, spriteN, PAINT[2]); order.shift();
  setTimeout(next, 60);
}

let resizeTimer = 0;
addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { const e = eFor(sy); layout(); sy = targetY = yFor(e); scrollTo(0, sy); if (thumbsDone) { renderThumbs(); renderView(); } }, 120);
});

layout();
select(0, false);
build();
requestAnimationFrame(frame);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { canvasFont = '500 11px Jost, sans-serif'; if (thumbsDone) { renderThumbs(); renderView(); } });
requestAnimationFrame(() => document.body.classList.add('ready'));
})();
