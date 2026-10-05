/* Late Light · Corvus Planetarium. Designed using Design Lounge (https://www.designlounge.live) */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rootStyle = getComputedStyle(document.documentElement);
  const tok = n => rootStyle.getPropertyValue('--' + n).trim();
  const C = {
    bg: tok('bg'), surface: tok('surface'), s2: tok('surface-2'), s3: tok('surface-3'),
    ink: tok('ink'), ink2: tok('ink-2'), ink3: tok('ink-3'), line: tok('line'), lineS: tok('line-strong'),
    p: tok('primary'), s: tok('secondary'), t: tok('tertiary')
  };
  const rgba = (hex, a) => {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.replace(/(.)/g, '$1$1') : h, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  };
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const seg = (v, a, b) => clamp((v - a) / (b - a), 0, 1);
  const smooth = t => t * t * (3 - 2 * t);
  const rng = seed => () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  let reduce = mqReduce.matches;
  const phone = () => innerWidth < 768;
  const dpr = () => Math.min(window.devicePixelRatio || 1, phone() ? 1.5 : 2);
  const euro = n => '€' + n.toFixed(2);

  function sizeCanvas(cv, w, h) {
    const d = dpr();
    cv.width = Math.max(1, Math.round(w * d));
    cv.height = Math.max(1, Math.round(h * d));
    const ctx = cv.getContext('2d');
    ctx.setTransform(d, 0, 0, d, 0, 0);
    return ctx;
  }

  /* ================= Laser drawings (shared by the journey, the still sky and the minis) ================= */

  function laser(ctx, color, w, a, path) {
    ctx.strokeStyle = color;
    ctx.globalAlpha = a * 0.2; ctx.lineWidth = w * 5; ctx.beginPath(); path(); ctx.stroke();
    ctx.globalAlpha = a; ctx.lineWidth = w; ctx.beginPath(); path(); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  const circ = (ctx, x, y, r) => () => ctx.arc(x, y, Math.max(0.1, r), 0, Math.PI * 2);

  let cmbTex = null;
  function cmbTexture() {
    if (cmbTex) return cmbTex;
    cmbTex = document.createElement('canvas');
    cmbTex.width = 512; cmbTex.height = 256;
    const g = cmbTex.getContext('2d');
    g.fillStyle = C.surface; g.fillRect(0, 0, 512, 256);
    const r = rng(1965);
    const cols = [C.p, C.s, C.t];
    for (let i = 0; i < 1500; i++) {
      g.fillStyle = rgba(cols[i % 3], 0.1 + r() * 0.22);
      g.beginPath(); g.arc(r() * 512, r() * 256, 2 + r() * 7, 0, Math.PI * 2); g.fill();
    }
    return cmbTex;
  }

  const nebula = (() => {
    const r = rng(42), loops = [];
    for (let i = 0; i < 9; i++) {
      const a0 = r() * Math.PI * 2, rad = 0.35 + r() * 0.9;
      loops.push({ a0, rad, sw: 0.8 + r() * 1.6, wob: 0.2 + r() * 0.35, col: i % 3 });
    }
    return loops;
  })();

  function drawObject(ctx, kind, x, y, R, a) {
    if (a <= 0.002 || R < 0.5) return;
    const lw = clamp(R / 70, 1, 2.4);
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'lighter';
    switch (kind) {
      case 'dome': {
        for (let k = 1; k <= 5; k++) laser(ctx, C.t, lw, a * (0.5 + k * 0.1), circ(ctx, x, y, R * k * 0.42));
        laser(ctx, C.t, lw, a * 0.6, () => {
          for (let k = 0; k < 16; k++) {
            const an = k * Math.PI / 8;
            ctx.moveTo(x + Math.cos(an) * R * 0.42, y + Math.sin(an) * R * 0.42);
            ctx.lineTo(x + Math.cos(an) * R * 2.1, y + Math.sin(an) * R * 2.1);
          }
        });
        laser(ctx, C.s, lw, a, circ(ctx, x, y, R * 0.12));
        break;
      }
      case 'moon': {
        laser(ctx, C.s, lw * 1.2, a, circ(ctx, x, y, R));
        const cr = [[-0.32, -0.22, 0.2], [0.26, 0.3, 0.13], [0.38, -0.36, 0.09], [-0.08, 0.5, 0.08], [-0.5, 0.22, 0.07], [0.05, -0.05, 0.06]];
        laser(ctx, C.s, lw * 0.7, a * 0.75, () => cr.forEach(([cx, cy, rr]) => {
          ctx.moveTo(x + cx * R + rr * R, y + cy * R); ctx.arc(x + cx * R, y + cy * R, rr * R, 0, Math.PI * 2);
        }));
        laser(ctx, C.s, lw * 0.6, a * 0.4, () => ctx.ellipse(x, y, R * 0.42, R, 0, -Math.PI / 2, Math.PI / 2));
        break;
      }
      case 'sun': {
        laser(ctx, C.p, lw * 1.3, a, circ(ctx, x, y, R));
        laser(ctx, C.p, lw * 0.7, a * 0.6, circ(ctx, x, y, R * 0.8));
        laser(ctx, C.p, lw, a * 0.85, () => {
          for (let k = 0; k < 24; k++) {
            const an = k * Math.PI / 12, l = k % 2 ? 1.32 : 1.55;
            ctx.moveTo(x + Math.cos(an) * R * 1.12, y + Math.sin(an) * R * 1.12);
            ctx.lineTo(x + Math.cos(an) * R * l, y + Math.sin(an) * R * l);
          }
        });
        break;
      }
      case 'jupiter': {
        laser(ctx, C.t, lw * 1.3, a, circ(ctx, x, y, R));
        laser(ctx, C.t, lw * 0.8, a * 0.8, () => {
          [-0.62, -0.36, -0.1, 0.16, 0.5].forEach(by => {
            const hw = Math.sqrt(1 - by * by) * R * 0.96;
            ctx.moveTo(x - hw, y + by * R);
            ctx.quadraticCurveTo(x, y + by * R + R * 0.06, x + hw, y + by * R);
          });
        });
        laser(ctx, C.p, lw, a, () => ctx.ellipse(x + R * 0.3, y + R * 0.31, R * 0.2, R * 0.1, 0, 0, Math.PI * 2));
        break;
      }
      case 'saturn': {
        const tilt = -0.32;
        const ring = (from, to) => () => {
          ctx.ellipse(x, y, R * 2.15, R * 0.52, tilt, from, to);
          ctx.moveTo(x + Math.cos(tilt) * R * 1.75 * Math.cos(from) - Math.sin(tilt) * R * 0.42 * Math.sin(from), y + Math.sin(tilt) * R * 1.75 * Math.cos(from) + Math.cos(tilt) * R * 0.42 * Math.sin(from));
          ctx.ellipse(x, y, R * 1.75, R * 0.42, tilt, from, to);
        };
        laser(ctx, C.p, lw, a, ring(Math.PI, Math.PI * 2));
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = a; ctx.fillStyle = C.bg;
        ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'lighter';
        laser(ctx, C.ink, lw * 1.2, a * 0.9, circ(ctx, x, y, R));
        laser(ctx, C.ink, lw * 0.6, a * 0.35, () => {
          [-0.45, 0.05].forEach(by => {
            const hw = Math.sqrt(1 - by * by) * R * 0.95;
            ctx.moveTo(x - hw, y + by * R); ctx.lineTo(x + hw, y + by * R + hw * Math.tan(tilt) * 0.3);
          });
        });
        laser(ctx, C.p, lw, a, ring(0, Math.PI));
        break;
      }
      case 'voyager': {
        laser(ctx, C.ink, lw * 1.2, a, circ(ctx, x, y, R * 0.6));
        laser(ctx, C.ink, lw * 0.7, a * 0.7, circ(ctx, x, y, R * 0.12));
        laser(ctx, C.ink, lw, a * 0.9, () => {
          ctx.moveTo(x, y + R * 0.6); ctx.lineTo(x, y + R * 0.95);
          ctx.rect(x - R * 0.28, y + R * 0.95, R * 0.56, R * 0.3);
          ctx.moveTo(x + R * 0.28, y + R * 1.1); ctx.lineTo(x + R * 1.6, y + R * 1.5);
          ctx.moveTo(x - R * 0.28, y + R * 1.1); ctx.lineTo(x - R * 1.15, y + R * 1.7);
          ctx.moveTo(x - R * 0.2, y + R * 1.0); ctx.lineTo(x - R * 1.9, y - R * 0.4);
        });
        ctx.setLineDash([R * 0.08, R * 0.12]);
        laser(ctx, C.s, lw * 0.6, a * 0.7, () => { ctx.moveTo(x - R * 0.5, y - R * 0.3); ctx.lineTo(x - R * 3.2, y - R * 1.6); });
        ctx.setLineDash([]);
        break;
      }
      case 'proxima': {
        ctx.globalAlpha = a;
        const g = ctx.createRadialGradient(x, y, 0, x, y, R * 0.75);
        g.addColorStop(0, rgba(C.p, 0.9)); g.addColorStop(0.55, rgba(C.p, 0.35)); g.addColorStop(1, rgba(C.p, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R * 0.75, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        laser(ctx, C.p, lw * 1.2, a, circ(ctx, x, y, R * 0.45));
        laser(ctx, C.p, lw * 0.8, a * 0.8, () => {
          ctx.moveTo(x + R * 0.32, y - R * 0.32);
          ctx.bezierCurveTo(x + R * 0.9, y - R * 0.95, x + R * 1.1, y - R * 0.2, x + R * 0.45, y - R * 0.05);
          ctx.moveTo(x - R * 0.4, y + R * 0.22);
          ctx.bezierCurveTo(x - R * 0.95, y + R * 0.5, x - R * 0.8, y + R * 0.95, x - R * 0.25, y + R * 0.42);
        });
        break;
      }
      case 'orion': {
        const cols = [C.t, C.p, C.s];
        nebula.forEach(L => {
          laser(ctx, cols[L.col], lw * 0.8, a * 0.75, () => {
            for (let k = 0; k <= 40; k++) {
              const an = L.a0 + (k / 40) * Math.PI * L.sw;
              const rr = R * L.rad * (1 + Math.sin(k * 0.6 + L.a0) * L.wob);
              const px = x + Math.cos(an) * rr * 1.25, py = y + Math.sin(an) * rr * 0.85;
              k ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
            }
          });
        });
        ctx.fillStyle = C.ink; ctx.globalAlpha = a;
        [[-0.06, -0.04], [0.07, -0.06], [-0.03, 0.08], [0.09, 0.05]].forEach(([dx, dy]) => {
          ctx.beginPath(); ctx.arc(x + dx * R, y + dy * R, Math.max(1.2, R * 0.025), 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1;
        break;
      }
      case 'core': {
        laser(ctx, C.t, lw * 0.6, a * 0.45, () => ctx.ellipse(x, y, R * 2.1, R * 0.7, -0.12, 0, Math.PI * 2));
        laser(ctx, C.t, lw * 0.6, a * 0.3, () => ctx.ellipse(x, y, R * 2.8, R * 0.95, -0.12, 0, Math.PI * 2));
        laser(ctx, C.p, lw * 1.1, a, () => ctx.ellipse(x, y, R * 1.35, R * 0.3, -0.12, 0, Math.PI * 2));
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = a; ctx.fillStyle = C.bg;
        ctx.beginPath(); ctx.arc(x, y, R * 0.38, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'lighter';
        laser(ctx, C.ink, lw * 1.2, a, circ(ctx, x, y, R * 0.44));
        laser(ctx, C.s, lw, a * 0.8, () => ctx.ellipse(x, y - R * 0.05, R * 0.78, R * 0.6, -0.12, Math.PI * 1.08, Math.PI * 1.92));
        break;
      }
      case 'andromeda': {
        const rot = -0.62;
        for (let k = 1; k <= 6; k++) {
          laser(ctx, k < 3 ? C.ink : C.t, lw * 0.8, a * (1 - k * 0.11), () => ctx.ellipse(x, y, R * 0.28 * k, R * 0.09 * k, rot, 0, Math.PI * 2));
        }
        ctx.fillStyle = C.ink; ctx.globalAlpha = a;
        ctx.beginPath(); ctx.arc(x, y, Math.max(1.5, R * 0.05), 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + R * 0.35, y + R * 0.42, Math.max(1, R * 0.03), 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x - R * 0.55, y - R * 0.62, Math.max(1, R * 0.035), 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        break;
      }
      case 'cmb': {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = a;
        ctx.save();
        ctx.beginPath(); ctx.ellipse(x, y, R * 1.6, R * 0.8, 0, 0, Math.PI * 2); ctx.clip();
        ctx.drawImage(cmbTexture(), x - R * 1.6, y - R * 0.8, R * 3.2, R * 1.6);
        ctx.restore();
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'lighter';
        laser(ctx, C.ink, lw, a, () => ctx.ellipse(x, y, R * 1.6, R * 0.8, 0, 0, Math.PI * 2));
        break;
      }
    }
    ctx.restore();
  }

  /* ================= Desktop nav: pill + scrollspy ================= */

  const html = document.documentElement;
  const spyLinks = $$('.links a');
  const cta = $('.cta');
  const ind = $('.ind');
  const order = ['show', 'journey', 'book', 'visit', 'letter'];
  const secs = order.map(id => document.getElementById(id));
  const tabs = $$('.tabbar a');
  const tabbar = $('.tabbar');

  function currentId() {
    const line = innerHeight * 0.4;
    let cur = 'show';
    secs.forEach(s => { if (s.getBoundingClientRect().top <= line) cur = s.id; });
    if (innerHeight + scrollY >= html.scrollHeight - 8) cur = 'letter';
    return cur;
  }
  let lastCur = '';
  function setCurrent(cur) {
    if (cur === lastCur) return;
    lastCur = cur;
    let hit = null;
    spyLinks.forEach(a => {
      const on = a.dataset.spy === cur;
      on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
      if (on) hit = a;
    });
    cur === 'book' ? cta.setAttribute('aria-current', 'true') : cta.removeAttribute('aria-current');
    if (hit) {
      ind.style.width = hit.offsetWidth + 'px';
      ind.style.height = hit.offsetHeight + 'px';
      ind.style.top = hit.offsetTop + 'px';
      ind.style.transform = `translateX(${hit.offsetLeft}px)`;
      ind.classList.add('on');
    } else ind.classList.remove('on');
    tabs.forEach(a => a.dataset.tab === cur ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
  }

  let lastY = scrollY, navTick = false;
  function onNavScroll() {
    navTick = false;
    const y = scrollY;
    html.classList.toggle('pill', y > 48);
    if (tabbar && !reduce) {
      const atEnd = innerHeight + y >= html.scrollHeight - 8;
      if (atEnd || y < 80 || y < lastY - 6) tabbar.classList.remove('hidden');
      else if (y > lastY + 6) tabbar.classList.add('hidden');
      if (Math.abs(y - lastY) > 6 || atEnd) lastY = y;
    }
    setCurrent(currentId());
  }
  addEventListener('scroll', () => { if (!navTick) { navTick = true; requestAnimationFrame(onNavScroll); } }, { passive: true });
  tabbar.addEventListener('focusin', () => tabbar.classList.remove('hidden'));

  /* ================= 1 · Hero: torch over a star chart ================= */

  const hero = $('#show');
  const cvBase = $('#sky-base');
  const cvChart = $('#sky-chart');
  const notesEl = $('#notes');
  const readout = $('.readout');
  const revealBtn = $('#reveal');
  const hintText = $('.hint-text');

  const STARS = {
    Betelgeuse: [5.92, 7.4, 0.5, 'p'], Bellatrix: [5.42, 6.35, 1.6], Alnitak: [5.68, -1.94, 1.7], Alnilam: [5.6, -1.2, 1.7],
    Mintaka: [5.53, -0.3, 2.2], Saiph: [5.8, -9.67, 2.1], Rigel: [5.24, -8.2, 0.1, 's'], Meissa: [5.59, 9.93, 3.4],
    Aldebaran: [4.6, 16.5, 0.9, 'p'], Elnath: [5.44, 28.6, 1.6], Tianguan: [5.63, 21.1, 3], HyG: [4.33, 15.6, 3.6], HyD: [4.38, 17.5, 3.8],
    HyE: [4.48, 19.2, 3.5], HyT: [4.48, 15.9, 3.4],
    Alcyone: [3.79, 24.1, 2.9], Atlas: [3.82, 24.05, 3.6], Electra: [3.75, 24.1, 3.7], Maia: [3.76, 24.4, 3.9], Merope: [3.77, 23.95, 4.1], Taygeta: [3.75, 24.5, 4.3],
    Sirius: [6.75, -16.7, -1.5, 's'], Mirzam: [6.38, -17.96, 2], Adhara: [6.98, -28.97, 1.5], Wezen: [7.14, -26.4, 1.8], Aludra: [7.4, -29.3, 2.4],
    Procyon: [7.66, 5.2, 0.4], Gomeisa: [7.45, 8.3, 2.9]
  };
  const FIGURES = [
    ['Betelgeuse', 'Alnitak'], ['Bellatrix', 'Mintaka'], ['Alnitak', 'Alnilam'], ['Alnilam', 'Mintaka'], ['Alnitak', 'Saiph'], ['Mintaka', 'Rigel'],
    ['Betelgeuse', 'Meissa'], ['Meissa', 'Bellatrix'], ['Betelgeuse', 'Bellatrix'],
    ['Aldebaran', 'HyE'], ['HyE', 'HyD'], ['HyD', 'HyG'], ['HyG', 'HyT'], ['HyT', 'Aldebaran'], ['HyE', 'Elnath'], ['Aldebaran', 'Tianguan'],
    ['Sirius', 'Mirzam'], ['Sirius', 'Adhara'], ['Adhara', 'Wezen'], ['Wezen', 'Aludra'], ['Sirius', 'Wezen'],
    ['Procyon', 'Gomeisa']
  ];
  const LABELS = ['Betelgeuse', 'Rigel', 'Procyon', 'Bellatrix'];
  const CONST_NAMES = [['ORION', 5.55, -14], ['TAURUS', 4.9, 9], ['CANIS MAJOR', 7.0, -34]];
  const NOTES = [
    ['Sirius', 'Sirius', '8.6 light-years.', ' The brightest star in the night sky.', 18, 10, 12, -46],
    ['Aldebaran', 'Aldebaran', 'About 65 light-years.', ' This light left before the first Moon landing.', 16, 12, 12, 12],
    ['Alcyone', 'The Pleiades', 'About 440 light-years.', ' Most people can count six by eye.', 14, -70, -10, 30]
  ];
  const RA0 = 5.6, DEC0 = 2;
  let proj = { cx: 0, cy: 0, k: 1 };
  const P = (ra, dec) => ({
    x: proj.cx + (RA0 - ra) * 15 * Math.cos(dec * Math.PI / 180) * proj.k,
    y: proj.cy - (dec - DEC0) * proj.k
  });

  let heroW = 0, heroH = 0, tx = 0, ty = 0, torchR = 168, heroRaf = 0, torchMoved = false;
  function heroLayout() {
    const ledes = $$('.lede', hero);
    ledes.forEach(l => (l.style.minHeight = ''));
    const lh = Math.max(...ledes.map(l => l.offsetHeight));
    ledes.forEach(l => (l.style.minHeight = lh + 'px'));
    const r = hero.getBoundingClientRect();
    heroW = r.width; heroH = r.height;
    const ph = phone();
    torchR = ph ? 110 : (heroW < 1280 ? 150 : 168);
    hero.style.setProperty('--rr', torchR + 'px');
    if (!hero.classList.contains('full')) hero.style.setProperty('--r', torchR + 'px');
    proj = ph
      ? { cx: heroW * 0.54, cy: heroH * 0.22, k: Math.min(heroW * 0.9 / 56, heroH * 0.32 / 58) }
      : { cx: heroW * 0.66, cy: heroH * 0.5, k: Math.min(heroW * 0.46 / 56, heroH * 0.62 / 58) };
    drawSky();
    placeNotes();
    if (!torchMoved && ph) {
      const belt = P(5.6, 1);
      tx = belt.x; ty = belt.y;
    } else if (!torchMoved) {
      const w1 = $('h1 .w1', hero).getBoundingClientRect();
      tx = w1.left - r.left + w1.width * 0.55; ty = w1.top - r.top + w1.height * 0.5;
    }
    paintTorch();
  }

  function bgStars(n, seed, w, h) {
    const r = rng(seed), out = [];
    for (let i = 0; i < n; i++) out.push([r() * w, r() * h, 0.35 + r() * r() * 1.3, 0.25 + r() * 0.65]);
    return out;
  }
  function starSize(mag) { return clamp(3.4 - mag * 0.62, 0.9, 4.2); }

  function drawSky() {
    const b = sizeCanvas(cvBase, heroW, heroH);
    const c = sizeCanvas(cvChart, heroW, heroH);
    const field = bgStars(Math.round(heroW * heroH / 4200), 7, heroW, heroH);
    b.clearRect(0, 0, heroW, heroH);
    c.clearRect(0, 0, heroW, heroH);

    c.strokeStyle = rgba(C.lineS, 0.45); c.lineWidth = 1;
    c.beginPath();
    for (let dec = -40; dec <= 40; dec += 10) {
      for (let ra = 2.4; ra <= 8.8; ra += 0.1) {
        const q = P(ra, dec); ra === 2.4 ? c.moveTo(q.x, q.y) : c.lineTo(q.x, q.y);
      }
    }
    for (let ra = 3; ra <= 8; ra += 1) {
      for (let dec = -44; dec <= 44; dec += 2) {
        const q = P(ra, dec); dec === -44 ? c.moveTo(q.x, q.y) : c.lineTo(q.x, q.y);
      }
    }
    c.stroke();

    field.forEach(([x, y, s, a]) => {
      b.globalAlpha = a; b.fillStyle = C.ink; b.beginPath(); b.arc(x, y, s, 0, Math.PI * 2); b.fill();
      c.globalAlpha = a * 0.55; c.fillStyle = C.ink2; c.beginPath(); c.arc(x, y, s * 0.8, 0, Math.PI * 2); c.fill();
    });
    b.globalAlpha = 1; c.globalAlpha = 1;

    c.strokeStyle = C.s; c.lineWidth = 1.5; c.lineCap = 'round';
    c.beginPath();
    FIGURES.forEach(([m, n]) => { const A = P(STARS[m][0], STARS[m][1]), B = P(STARS[n][0], STARS[n][1]); c.moveTo(A.x, A.y); c.lineTo(B.x, B.y); });
    c.stroke();

    Object.keys(STARS).forEach(name => {
      const [ra, dec, mag, tint] = STARS[name];
      const q = P(ra, dec), s = starSize(mag);
      b.fillStyle = tint === 'p' ? C.p : tint === 's' ? C.s : C.ink;
      b.globalAlpha = 0.18; b.beginPath(); b.arc(q.x, q.y, s * 3, 0, Math.PI * 2); b.fill();
      b.globalAlpha = 1; b.beginPath(); b.arc(q.x, q.y, s, 0, Math.PI * 2); b.fill();
      c.fillStyle = C.ink; c.beginPath(); c.arc(q.x, q.y, s + 0.6, 0, Math.PI * 2); c.fill();
    });

    c.font = '600 13px "Josefin Sans", sans-serif'; c.fillStyle = C.ink2;
    if (!phone()) LABELS.forEach(name => { const q = P(STARS[name][0], STARS[name][1]); c.fillText(name, q.x + 9, q.y - 8); });
    c.font = '600 12px "Josefin Sans", sans-serif'; c.fillStyle = C.s;
    CONST_NAMES.forEach(([n, ra, dec]) => {
      const q = P(ra, dec);
      c.save(); c.translate(q.x, q.y);
      if ('letterSpacing' in c) c.letterSpacing = '3px';
      c.textAlign = 'center'; c.fillText(n, 0, 0); c.restore();
    });
  }

  function placeNotes() {
    notesEl.textContent = '';
    const ph = phone();
    NOTES.forEach(([star, title, first, rest, dx, dy, pdx, pdy]) => {
      const q = P(STARS[star][0], STARS[star][1]);
      const n = document.createElement('p');
      n.className = 'note';
      n.innerHTML = `<b>${title}</b>${first}<span class="note-more">${rest}</span>`;
      notesEl.appendChild(n);
      const w = n.offsetWidth;
      const left = ph ? q.x + (pdx < 0 ? pdx - w : pdx) : q.x + dx;
      n.style.left = clamp(left, 12, heroW - w - 12) + 'px';
      n.style.top = (ph ? clamp(q.y + pdy, 108, heroH) : clamp(q.y + dy, 120, heroH - 120)) + 'px';
    });
    const placed = [...notesEl.children].sort((a, b) => a.offsetTop - b.offsetTop);
    placed.forEach((n, i) => {
      for (let j = 0; j < i; j++) {
        const m = placed[j];
        const xHit = n.offsetLeft < m.offsetLeft + m.offsetWidth && m.offsetLeft < n.offsetLeft + n.offsetWidth;
        if (xHit && n.offsetTop < m.offsetTop + m.offsetHeight + 8) n.style.top = (m.offsetTop + m.offsetHeight + 8) + 'px';
      }
    });
  }

  function paintTorch() {
    heroRaf = 0;
    hero.style.setProperty('--x', tx + 'px');
    hero.style.setProperty('--y', ty + 'px');
    hero.style.setProperty('--px', tx + 'px');
    hero.style.setProperty('--py', ty + 'px');
    const dec = DEC0 - (ty - proj.cy) / proj.k;
    const ra = RA0 - (tx - proj.cx) / (proj.k * 15 * Math.max(0.2, Math.cos(dec * Math.PI / 180)));
    const raN = ((ra % 24) + 24) % 24;
    const h = Math.floor(raN), m = Math.floor((raN - h) * 60);
    const d = Math.round(dec);
    readout.textContent = `RA ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m · DEC ${d < 0 ? '\u2212' : '+'}${String(Math.abs(d)).padStart(2, '0')}°`;
  }
  function moveTorch(nx, ny) {
    tx = clamp(nx, 0, heroW); ty = clamp(ny, 0, heroH); torchMoved = true;
    if (!heroRaf) heroRaf = requestAnimationFrame(paintTorch);
  }
  hero.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const r = hero.getBoundingClientRect(); moveTorch(e.clientX - r.left, e.clientY - r.top);
  });
  hero.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' || e.target.closest('a, button')) return;
    const r = hero.getBoundingClientRect(); moveTorch(e.clientX - r.left, e.clientY - r.top);
  });
  hero.addEventListener('keydown', e => {
    if (e.target !== hero) return;
    const step = e.shiftKey ? 96 : 32;
    const map = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (!map[e.key]) return;
    e.preventDefault(); moveTorch(tx + map[e.key][0], ty + map[e.key][1]);
  });
  function toggleReveal() {
    const on = !hero.classList.contains('full');
    hero.classList.toggle('full', on);
    hero.style.setProperty('--r', on ? '2400px' : torchR + 'px');
    revealBtn.setAttribute('aria-pressed', String(on));
    revealBtn.firstChild.textContent = on ? 'Torch mode ' : 'Light the whole sky ';
    hintText.textContent = on ? 'The whole sky, charted' : (matchMedia('(hover: none)').matches ? 'Tap the sky to move the torch' : 'Move the torch to read the chart');
  }
  revealBtn.addEventListener('click', toggleReveal);
  addEventListener('keydown', e => {
    if ((e.key === 'r' || e.key === 'R') && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const t = e.target;
      if (t.closest && t.closest('input, textarea, select, dialog')) return;
      toggleReveal();
    }
  });
  if (matchMedia('(hover: none)').matches) hintText.textContent = 'Tap the sky to move the torch';

  /* ================= 2 · Journey: the lead effect ================= */

  const journey = $('#journey');
  const stage = $('.j-stage', journey);
  const space = $('#space');
  const stillSky = $('#still-sky');
  const hudV = $('#hud-v');
  const stopEls = $$('.stop', journey);
  const kinds = stopEls.map(el => el.dataset.kind);
  const agos = stopEls.map(el => $('.stop-d', el).dataset.ago);
  const railFill = $('.rail-fill', journey);
  const after = $('.after', journey);
  const lift = $('.lift', journey);
  const NSTOP = kinds.length;          // 11: the dome plus ten stops
  const PORTAL_AT = 0.84;              // the last stop and the portal take the final 16%
  const SEGW = PORTAL_AT / (NSTOP - 1);
  const SIZE = { dome: 1.4, moon: 0.8, sun: 1, jupiter: 0.95, saturn: 0.62, voyager: 0.55, proxima: 0.7, orion: 1.05, core: 0.8, andromeda: 1.25, cmb: 1 };

  let jw = 0, jh = 0, jctx = null, jTop = 0, jLen = 1, jVisible = false, jRaf = 0;
  let prog = 0, lastProg = -1, vel = 0, hudIdx = -1;
  let stars = [];

  function makeStars() {
    const n = phone() ? 420 : 900;
    const r = rng(2026);
    const tints = () => { const v = r(); return v < 0.1 ? C.s : v < 0.18 ? C.p : v < 0.24 ? C.t : C.ink; };
    stars = Array.from({ length: n }, () => ({ x: (r() * 2 - 1) * 1.6, y: (r() * 2 - 1), z: 0.04 + r() * 0.96, c: tints(), r }));
  }

  function jLayout() {
    jw = stage.clientWidth; jh = stage.clientHeight;
    jctx = sizeCanvas(space, jw, jh);
    const rect = journey.getBoundingClientRect();
    jTop = rect.top + scrollY;
    jLen = Math.max(1, journey.offsetHeight - jh);
    stopEls.forEach((el, i) => el.classList.toggle('left', side(i) > 0 && !phone()));
    lastProg = -1;
    requestJ();
  }
  function side(i) { return (i === 0 || i === NSTOP - 1) ? 0 : (i % 2 ? -1 : 1); }

  function readProgress() { return clamp((scrollY - jTop) / jLen, 0, 1); }

  function requestJ() { if (!jRaf && jVisible && !reduce) jRaf = requestAnimationFrame(jFrame); }

  function jFrame() {
    jRaf = 0;
    prog = readProgress();
    const dp = lastProg < 0 ? 0 : prog - lastProg;
    lastProg = prog;
    const target = clamp(dp * 55, -0.12, 0.12);
    vel += (target - vel) * 0.28;
    renderJourney();
    if (Math.abs(vel) > 0.0004 || Math.abs(dp) > 0) requestJ();
  }

  function renderJourney() {
    const ctx = jctx, w = jw, h = jh, ph = phone();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h);

    const cx = w / 2, cy = ph ? h * 0.4 : h / 2;
    const f = Math.max(w, h) * 0.42;
    const streak = Math.abs(vel) > 0.004;
    ctx.lineCap = 'round';
    for (const s of stars) {
      const zPrev = s.z;
      s.z -= vel;
      if (s.z <= 0.03) { s.z += 1; s.x = (s.r() * 2 - 1) * 1.6; s.y = s.r() * 2 - 1; continue; }
      if (s.z > 1.03) { s.z -= 1; continue; }
      const sx = cx + (s.x / s.z) * f, sy = cy + (s.y / s.z) * f;
      if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) continue;
      const depth = 1 - s.z;
      const size = 0.35 + depth * depth * 2.4;
      const a = clamp(0.15 + depth * 1.1, 0, 1);
      ctx.globalAlpha = a;
      if (streak) {
        const pz = Math.min(1.2, zPrev + vel * 2.2);
        const px = cx + (s.x / pz) * f, py = cy + (s.y / pz) * f;
        ctx.strokeStyle = s.c; ctx.lineWidth = size;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(sx, sy); ctx.stroke();
      } else {
        ctx.fillStyle = s.c;
        ctx.beginPath(); ctx.arc(sx, sy, size * 0.6, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    const base = Math.min(w, h) * (ph ? 0.27 : 0.2);
    const u = Math.min(prog, PORTAL_AT) / SEGW;
    for (let i = 0; i < NSTOP - 1; i++) {
      const t = u - i;
      if (t < -0.4 || t > 1.1) { cardState(i, 0, 0); continue; }
      const g = Math.pow(2, (t - 0.5) * 5);
      const sd = side(i);
      const ax = ph ? cx + sd * w * 0.1 : cx + sd * w * 0.21;
      const ay = ph ? h * 0.36 : cy;
      const spread = Math.pow(g, 0.75);
      const ox = cx + (ax - cx) * spread;
      const oy = cy + (ay - cy) * spread;
      const a = seg(t, -0.4, 0.02) * (1 - seg(t, 0.86, 1.08));
      if (i === 0) {
        const tt = clamp(t, 0, 1);
        drawObject(ctx, 'dome', cx, cy, base * SIZE.dome * Math.pow(2, tt * 4.5), (1 - seg(t, 0.55, 1.0)));
      } else {
        drawObject(ctx, kinds[i], ox, oy, base * SIZE[kinds[i]] * g, a);
      }
      const ca = i === 0 ? (1 - seg(t, 0.62, 0.82)) : seg(t, 0.14, 0.28) * (1 - seg(t, 0.74, 0.88));
      const cyOff = i === 0 ? 0 : (1 - seg(t, 0.14, 0.32)) * 24 - seg(t, 0.74, 0.88) * 16;
      cardState(i, ca, cyOff);
    }

    const last = NSTOP - 1;
    const q = seg(prog, PORTAL_AT, 1);
    if (prog > PORTAL_AT - SEGW * 0.5) {
      const appear = seg(prog, PORTAL_AT - SEGW * 0.5, PORTAL_AT + 0.02);
      const R0 = base * 0.95 * (0.15 + 0.85 * smooth(appear));
      const rx = R0 * 1.6, ry = R0 * 0.8;
      const ocx = cx, ocy = ph ? h * 0.36 : cy;
      const D = Math.hypot(Math.max(ocx, w - ocx) / rx, Math.max(ocy, h - ocy) / ry);
      const S = 1.12 * D;
      const z = smooth(seg(q, 0.3, 0.82));
      drawObject(ctx, 'cmb', ocx, ocy, R0 * Math.pow(S, z), appear);
      const ca = seg(q, 0.02, 0.12) * (1 - seg(q, 0.28, 0.38));
      cardState(last, ca, (1 - seg(q, 0.02, 0.14)) * 24);
    } else cardState(last, 0, 0);

    const cover = smooth(seg(q, 0.76, 0.86));
    const l = smooth(seg(q, 0.86, 0.97));
    after.style.opacity = cover;
    lift.style.opacity = l;
    lift.style.transform = `translateY(${(1 - l) * 32}px)`;
    railFill.style.transform = `scaleY(${prog})`;

    const idx = prog >= PORTAL_AT - SEGW * 0.2 ? last : clamp(Math.floor(u + 0.15), 0, last - 1);
    if (idx !== hudIdx) {
      hudIdx = idx;
      hudV.textContent = agos[idx];
      if (hudV.animate) hudV.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    }
    $('.hud', journey).style.opacity = 1 - smooth(seg(q, 0.3, 0.5));
  }

  const cardCache = [];
  function cardState(i, a, y) {
    const key = a.toFixed(3) + '|' + y.toFixed(1);
    if (cardCache[i] === key) return;
    cardCache[i] = key;
    const el = stopEls[i];
    el.style.opacity = a;
    el.style.transform = `translateY(${y}px)`;
    el.style.visibility = a < 0.01 ? 'hidden' : 'visible';
  }

  const jio = new IntersectionObserver(entries => {
    entries.forEach(e => { jVisible = e.isIntersecting; if (jVisible) { lastProg = -1; requestJ(); } });
  });

  function drawStillSky() {
    const w = stillSky.clientWidth, h = stillSky.clientHeight;
    if (!w || !h) return;
    const ctx = sizeCanvas(stillSky, w, h);
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h);
    const r = rng(11);
    const n = Math.round(w * h / 1600);
    for (let i = 0; i < n; i++) {
      const x = r() * w;
      const band = r() < 0.45;
      const y = band ? (h * 0.95 - x * (h * 0.7 / w)) + (r() - 0.5) * h * 0.22 : r() * h;
      const s = 0.3 + r() * r() * 1.6;
      ctx.globalAlpha = band ? 0.3 + r() * 0.4 : 0.25 + r() * 0.6;
      const v = r(); ctx.fillStyle = v < 0.08 ? C.s : v < 0.14 ? C.p : C.ink;
      ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    const m = Math.min(w, h);
    drawObject(ctx, 'saturn', w * 0.68, h * 0.55, m * 0.13, 1);
    drawObject(ctx, 'moon', w * 0.2, h * 0.3, m * 0.08, 1);
    drawObject(ctx, 'andromeda', w * 0.86, h * 0.2, m * 0.1, 0.8);
  }
  function drawMinis() {
    stopEls.forEach((el, i) => {
      let cv = $('canvas.mini', el);
      if (!cv) { cv = document.createElement('canvas'); cv.className = 'mini'; cv.setAttribute('aria-hidden', 'true'); el.prepend(cv); }
      const s = cv.clientWidth || 96;
      const ctx = sizeCanvas(cv, s, s);
      ctx.clearRect(0, 0, s, s);
      const k = kinds[i];
      const R = s * ({ dome: 0.22, saturn: 0.17, voyager: 0.2, cmb: 0.26, core: 0.2, andromeda: 0.3, sun: 0.26 }[k] || 0.32);
      drawObject(ctx, k, s / 2, s / 2, R, 1);
    });
  }

  function applyMode() {
    journey.classList.toggle('still', reduce);
    if (reduce) {
      stopEls.forEach(el => { el.style.opacity = ''; el.style.transform = ''; el.style.visibility = ''; });
      after.style.opacity = ''; lift.style.opacity = ''; lift.style.transform = '';
      drawStillSky(); drawMinis();
      hero.style.setProperty('--r', hero.classList.contains('full') ? '2400px' : torchR + 'px');
      tabbar.classList.remove('hidden');
      $$('.rise').forEach(el => el.classList.add('in'));
    } else {
      $$('canvas.mini', journey).forEach(c => c.remove());
      cardCache.length = 0; hudIdx = -1;
      jLayout();
    }
  }
  mqReduce.addEventListener('change', e => { reduce = e.matches; applyMode(); });

  /* ================= 3 · Week board + checkout ================= */

  const DAYS = [
    { d: 'Mon', full: 'Monday', date: 5, shows: [] },
    { d: 'Tue', full: 'Tuesday', date: 6, shows: [] },
    { d: 'Wed', full: 'Wednesday', date: 7, shows: [] },
    { d: 'Thu', full: 'Thursday', date: 8, shows: [['22:00', '22:55']] },
    { d: 'Fri', full: 'Friday', date: 9, shows: [['22:00', '22:55'], ['23:30', '00:25']] },
    { d: 'Sat', full: 'Saturday', date: 10, shows: [['22:00', '22:55'], ['23:30', '00:25']] },
    { d: 'Sun', full: 'Sunday', date: 11, shows: [] }
  ];
  const daysEl = $('#days');
  const weekLine = $('#week-line');
  let show = { day: 4, time: '22:00' };

  DAYS.forEach((day, di) => {
    const sec = document.createElement('section');
    sec.className = 'day' + (day.shows.length ? ' has' : '');
    sec.setAttribute('aria-label', `${day.full} ${day.date} October`);
    sec.innerHTML = `<h4>${day.d}<span class="num">${day.date}</span></h4>`;
    if (!day.shows.length) sec.insertAdjacentHTML('beforeend', '<p class="none">No late show</p>');
    day.shows.forEach(([t, end]) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'slot';
      b.dataset.day = di; b.dataset.time = t;
      b.innerHTML = `<span class="num">${t}</span><small class="num">Ends ${end}</small>`;
      b.setAttribute('aria-pressed', String(di === show.day && t === show.time));
      b.addEventListener('click', () => pickShow(di, t));
      sec.appendChild(b);
    });
    daysEl.appendChild(sec);
  });
  function weekText() { const d = DAYS[show.day]; return `Late Light · ${d.full} ${d.date} Oct · ${show.time}`; }
  function pickShow(di, t) {
    if (di === show.day && t === show.time) return;
    show = { day: di, time: t };
    $$('.slot', daysEl).forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.day === di && b.dataset.time === t)));
    weekLine.textContent = weekText();
    const had = seats.some(s => s.mine);
    buildSeats();
    stopHold();
    say(had ? `Seats cleared for ${DAYS[di].full} at ${t}. Pick again.` : '');
    render();
  }
  weekLine.textContent = weekText();

  const TYPES = [
    { id: 'std', name: 'Standard', price: 18, fee: 1.5, max: 6, tier: 'dome', qty: 2 },
    { id: 'con', name: 'Concession', price: 13, fee: 1.5, max: 6, tier: 'dome', qty: 0 },
    { id: 'mem', name: "Members' preview", price: 12, fee: 0, max: 0, out: true, qty: 0 },
    { id: 'rec', name: 'Recliner, row E', price: 26, fee: 2, max: 4, tier: 'rec', qty: 0 }
  ];
  const ORDER_MAX = 6;
  const typesEl = $('#types');
  const svgNS = 'http://www.w3.org/2000/svg';
  const dome = $('#dome');
  const RINGS = [
    { row: 'A', r: 92, n: 16 }, { row: 'B', r: 124, n: 20 }, { row: 'C', r: 156, n: 24 },
    { row: 'D', r: 188, n: 28 }, { row: 'E', r: 224, n: 30, rec: true }
  ];
  const GAP = 50, START = 90 + GAP / 2, SPAN = 360 - GAP;
  let seats = [];
  let focusIdx = 0;

  TYPES.forEach(t => {
    const li = document.createElement('li');
    li.className = 'type' + (t.out ? ' out' : '');
    const priceHtml = t.out
      ? `<s class="num">${euro(t.price)}</s><span class="tag-out">SOLD OUT</span>`
      : `<span class="num">${euro(t.price)} + ${euro(t.fee)} fee</span>`;
    li.innerHTML = `<span class="type-n" id="tn-${t.id}">${t.name}</span><span class="type-p">${priceHtml}</span>
      <div class="stepper" role="group" aria-labelledby="tn-${t.id}">
        <button class="icon-btn" type="button" data-act="-" aria-label="Remove one ${t.name} ticket"><svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button>
        <output class="num" aria-live="polite">${t.qty}</output>
        <button class="icon-btn" type="button" data-act="+" aria-label="Add one ${t.name} ticket"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>
      </div>`;
    t.el = li;
    li.querySelectorAll('button').forEach(b => b.addEventListener('click', () => step(t, b.dataset.act === '+' ? 1 : -1, b)));
    typesEl.appendChild(li);
  });

  const totalQty = () => TYPES.reduce((s, t) => s + t.qty, 0);
  const tierQty = tier => TYPES.filter(t => t.tier === tier).reduce((s, t) => s + t.qty, 0);
  const mineIn = tier => seats.filter(s => s.mine && s.tier === tier);

  function step(t, d, btn) {
    if (t.out) return;
    const next = t.qty + d;
    if (next < 0 || next > t.max || (d > 0 && totalQty() >= ORDER_MAX)) return;
    t.qty = next;
    if (d < 0) {
      const placed = mineIn(t.tier);
      if (placed.length > tierQty(t.tier)) {
        const freed = placed[placed.length - 1];
        freed.mine = false;
        say(`Seat ${freed.id} released.`);
      }
    }
    render();
    if (btn.disabled) { const other = btn.parentElement.querySelector(`[data-act="${d > 0 ? '-' : '+'}"]`); if (other) other.focus(); }
  }

  function buildSeats() {
    const r = rng(show.day * 100 + parseInt(show.time, 10));
    seats = [];
    dome.textContent = '';
    const add = (tag, attrs, parent = dome) => {
      const el = document.createElementNS(svgNS, tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      parent.appendChild(el); return el;
    };
    const a0 = (START) * Math.PI / 180, a1 = (START + SPAN) * Math.PI / 180;
    add('path', { class: 'dome-ring', d: `M ${260 + 250 * Math.cos(a0)} ${260 + 250 * Math.sin(a0)} A 250 250 0 1 1 ${260 + 250 * Math.cos(a1)} ${260 + 250 * Math.sin(a1)}` });
    add('circle', { class: 'dome-ring', cx: 260, cy: 260, r: 34 });
    add('circle', { cx: 260, cy: 260, r: 5, fill: C.s });
    const pl = add('text', { class: 'dome-label', x: 260, y: 252, 'text-anchor': 'middle' }); pl.textContent = 'Projector';
    const el = add('text', { class: 'dome-label', x: 260, y: 512, 'text-anchor': 'middle' }); el.textContent = 'Entrance';
    RINGS.forEach((ring, ri) => {
      const lab = add('text', { class: 'row-label', x: 260, y: 260 + ring.r + 4, 'text-anchor': 'middle' }); lab.textContent = ring.row;
      const w = ring.rec ? 22 : 18, h = ring.rec ? 17 : 14;
      const pitch = ring.r * SPAN * Math.PI / 180 / ring.n - 1;
      for (let k = 0; k < ring.n; k++) {
        const deg = START + SPAN * (k + 0.5) / ring.n;
        const rad = deg * Math.PI / 180;
        const x = 260 + ring.r * Math.cos(rad), y = 260 + ring.r * Math.sin(rad);
        const sold = r() < 0.26;
        const s = { id: ring.row + (k + 1), row: ring.row, num: k + 1, ri, k, sold, mine: false, tier: ring.rec ? 'rec' : 'dome', rec: !!ring.rec };
        const g = add('g', {
          class: 'seat' + (ring.rec ? ' rec' : '') + (sold ? ' sold' : ''), role: 'button', tabindex: '-1',
          transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(deg + 90).toFixed(1)})`
        });
        add('rect', { class: 'hit', x: -pitch / 2, y: -15, width: pitch, height: 30 }, g);
        add('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 4 }, g);
        if (sold) add('path', { class: 'slash', d: `M ${-w / 2 + 5} ${h / 2 - 4} L ${w / 2 - 5} ${-h / 2 + 4}` }, g);
        const tx2 = add('text', { x: 0, y: 3, 'text-anchor': 'middle', transform: `rotate(${-(deg + 90).toFixed(1)})` }, g);
        tx2.textContent = '';
        s.g = g; s.label = tx2;
        g.dataset.i = seats.length;
        seats.push(s);
      }
    });
    focusIdx = seats.findIndex(s => !s.sold);
    seats[focusIdx].g.setAttribute('tabindex', '0');
  }

  function seatLabel(s) {
    const state = s.sold ? 'sold' : s.mine ? 'selected' : 'available';
    return `Row ${s.row} seat ${s.num}, ${state}${s.rec ? ', recliner' : ''}`;
  }

  function toggleSeat(i) {
    const s = seats[i];
    if (s.sold) { say(`Row ${s.row} seat ${s.num} is sold.`); return; }
    if (s.mine) { s.mine = false; say(''); render(); return; }
    const need = tierQty(s.tier), have = mineIn(s.tier).length;
    if (have >= need) {
      if (s.tier === 'rec') say(need ? `All ${need} recliner seat${need > 1 ? 's are' : ' is'} placed. Remove one or add a ticket.` : 'Add a Recliner ticket to pick row E.');
      else say(need ? `All ${need} seat${need > 1 ? 's' : ''} for Standard and Concession ${need > 1 ? 'are' : 'is'} placed. Remove one or add a ticket.` : 'Add a Standard or Concession ticket to pick rows A to D.');
      return;
    }
    s.mine = true;
    say('');
    if (!holdLive) startHold();
    render();
  }

  dome.addEventListener('click', e => {
    const g = e.target.closest('.seat'); if (!g) return;
    focusTo(+g.dataset.i, false);
    toggleSeat(+g.dataset.i);
  });
  dome.addEventListener('keydown', e => {
    const g = e.target.closest('.seat'); if (!g) return;
    const i = +g.dataset.i, s = seats[i];
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleSeat(i); return; }
    const ring = RINGS[s.ri];
    const idxOf = (ri, k) => seats.findIndex(x => x.ri === ri && x.k === k);
    let next = -1;
    if (e.key === 'ArrowRight') next = idxOf(s.ri, (s.k + 1) % ring.n);
    else if (e.key === 'ArrowLeft') next = idxOf(s.ri, (s.k - 1 + ring.n) % ring.n);
    else if (e.key === 'Home') next = idxOf(s.ri, 0);
    else if (e.key === 'End') next = idxOf(s.ri, ring.n - 1);
    else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const ri = clamp(s.ri + (e.key === 'ArrowDown' ? 1 : -1), 0, RINGS.length - 1);
      const k = clamp(Math.round((s.k + 0.5) / ring.n * RINGS[ri].n - 0.5), 0, RINGS[ri].n - 1);
      next = idxOf(ri, k);
    } else return;
    e.preventDefault();
    focusTo(next, true);
  });
  function focusTo(i, move) {
    seats[focusIdx].g.setAttribute('tabindex', '-1');
    focusIdx = i;
    seats[i].g.setAttribute('tabindex', '0');
    if (move) seats[i].g.focus();
  }

  const msgEl = $('#msg');
  function say(t) { msgEl.textContent = t; }

  /* Honest hold: it starts with the first seat, counts from a deadline, and really releases seats at 00:00 */
  const HOLD = 600;
  const holdEl = $('#hold'), clockEl = $('#clock'), barEl = $('#hold-bar'), liveEl = $('#hold-live');
  const expiredEl = $('#expired'), expiredText = $('#expired-text');
  let holdLive = false, expired = false, deadline = 0, holdTimer = 0;

  function startHold() {
    holdLive = true; expired = false; deadline = Date.now() + HOLD * 1000;
    expiredEl.hidden = true;
    clearInterval(holdTimer); holdTimer = setInterval(tick, 1000);
    tick();
  }
  function stopHold() {
    holdLive = false; clearInterval(holdTimer);
    holdEl.classList.add('idle'); holdEl.classList.remove('low');
    clockEl.textContent = '10:00'; barEl.style.transform = 'scaleX(1)';
  }
  function tick() {
    if (!holdLive) return;
    const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    clockEl.textContent = String(left / 60 | 0).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0');
    barEl.style.transform = `scaleX(${left / HOLD})`;
    holdEl.classList.remove('idle');
    holdEl.classList.toggle('low', left <= 120);
    const sayT = { 300: '5 minutes', 120: '2 minutes', 60: '1 minute' }[left];
    if (sayT) liveEl.textContent = `${sayT} left on your seat hold.`;
    if (left === 0) expire();
  }
  function expire() {
    holdLive = false; expired = true; clearInterval(holdTimer);
    const freed = seats.filter(s => s.mine);
    freed.forEach(s => (s.mine = false));
    expiredText.textContent = `Your hold ran out. ${freed.length ? `Seat${freed.length > 1 ? 's' : ''} ${freed.map(s => s.id).join(', ')} ${freed.length > 1 ? 'were' : 'was'} released and ${freed.length > 1 ? 'are' : 'is'} back on sale.` : ''} Your ticket choice is kept.`;
    expiredEl.hidden = false;
    liveEl.textContent = 'Your seat hold ran out.';
    render();
  }
  $('#rehold').addEventListener('click', () => { expiredEl.hidden = true; expired = false; stopHold(); say('Pick your seats to start a new 10:00 hold.'); render(); });

  const linesEl = $('#lines'), seatsLine = $('#seats-line'), totalEl = $('#total'), goBtn = $('#go'), leftLine = $('#left-line'), doneEl = $('#done');

  function render() {
    TYPES.forEach(t => {
      const out = t.el.querySelector('output');
      out.textContent = t.qty;
      const [minus, plus] = t.el.querySelectorAll('button');
      minus.disabled = t.out || t.qty <= 0;
      plus.disabled = t.out || t.qty >= t.max || totalQty() >= ORDER_MAX;
    });
    seats.forEach(s => {
      s.g.classList.toggle('mine', s.mine);
      s.g.setAttribute('aria-label', seatLabel(s));
      if (s.sold) s.g.setAttribute('aria-disabled', 'true'); else s.g.setAttribute('aria-pressed', String(s.mine));
      s.label.textContent = s.mine ? s.num : '';
    });

    const dNeed = tierQty('dome') - mineIn('dome').length;
    const rNeed = tierQty('rec') - mineIn('rec').length;
    const total = totalQty();
    if (!total) leftLine.textContent = 'Add a ticket to pick seats';
    else if (!dNeed && !rNeed) leftLine.textContent = `All ${total} seat${total > 1 ? 's' : ''} placed`;
    else {
      const parts = [];
      if (dNeed > 0) parts.push(`${dNeed} seat${dNeed > 1 ? 's' : ''}`);
      if (rNeed > 0) parts.push(`${rNeed} recliner${rNeed > 1 ? 's' : ''}`);
      leftLine.textContent = 'Pick ' + parts.join(' + ');
    }

    linesEl.textContent = '';
    let sum = 0;
    const feeParts = []; let feeSum = 0;
    TYPES.forEach(t => {
      if (!t.qty) return;
      const amt = t.qty * t.price; sum += amt;
      linesEl.insertAdjacentHTML('beforeend', `<div><dt>${t.qty} × ${t.name}</dt><dd class="num">${euro(amt)}</dd></div>`);
    });
    [1.5, 2].forEach(fee => {
      const q = TYPES.filter(t => t.fee === fee).reduce((s, t) => s + t.qty, 0);
      if (q) { feeParts.push(`${euro(fee)} × ${q}`); feeSum += fee * q; }
    });
    if (feeSum) linesEl.insertAdjacentHTML('beforeend', `<div><dt>Booking fee (${feeParts.join(' + ')})</dt><dd class="num">${euro(feeSum)}</dd></div>`);
    if (!total) linesEl.insertAdjacentHTML('beforeend', '<div><dt>No tickets yet</dt><dd class="num">€0.00</dd></div>');
    const grand = sum + feeSum;
    totalEl.textContent = euro(grand);
    const mine = seats.filter(s => s.mine);
    seatsLine.textContent = expired && !mine.length ? 'No seats held' : mine.length ? `Seats ${mine.map(s => s.id).join(', ')}` : 'No seats picked yet';
    const ready = total > 0 && !dNeed && !rNeed && holdLive;
    goBtn.disabled = !ready;
    goBtn.textContent = ready ? `Continue · ${euro(grand)}` : 'Continue';
    if (!mine.length && holdLive) stopHold();
    if (!holdLive && !expired) holdEl.classList.add('idle');
    doneEl.textContent = '';
  }
  goBtn.addEventListener('click', () => {
    const mine = seats.filter(s => s.mine).map(s => s.id).join(', ');
    const d = DAYS[show.day];
    doneEl.textContent = `Held for you: ${d.full} ${d.date} Oct at ${show.time}, seats ${mine}. Your details and payment come next.`;
  });

  buildSeats();
  stopHold();
  render();

  /* ================= 4 · Visit: group night dialog ================= */

  const dlg = $('#dlg'), dform = $('#dlg-form'), openDlg = $('#open-dlg');
  const gName = $('#g-name'), gMail = $('#g-mail');
  let closeTimer = 0;
  openDlg.addEventListener('click', () => {
    clearTimeout(closeTimer);
    dform.classList.remove('ok'); dform.reset();
    $('#sent').textContent = ''; $('#g-name-e').textContent = ''; $('#g-mail-e').textContent = '';
    gName.removeAttribute('aria-invalid'); gMail.removeAttribute('aria-invalid');
    dlg.showModal(); gName.focus();
  });
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { clearTimeout(closeTimer); openDlg.focus(); });
  $('#dlg-x').addEventListener('click', () => dlg.close());
  $('#dlg-cancel').addEventListener('click', () => dlg.close());
  dform.addEventListener('submit', e => {
    e.preventDefault();
    let first = null;
    const nameOk = gName.value.trim().length > 0;
    const mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(gMail.value.trim());
    $('#g-name-e').textContent = nameOk ? '' : 'Enter your name.';
    $('#g-mail-e').textContent = mailOk ? '' : 'Enter an email address, like name@example.com.';
    gName.setAttribute('aria-invalid', String(!nameOk)); gMail.setAttribute('aria-invalid', String(!mailOk));
    if (!nameOk) first = gName; else if (!mailOk) first = gMail;
    if (first) { first.focus(); return; }
    dform.classList.add('ok');
    $('#sent').textContent = 'Request sent. We will write within two working days.';
    closeTimer = setTimeout(() => dlg.close(), 1200);
  });

  /* ================= 5 · Footer: sky letter ================= */

  const nl = $('#nl'), nlIn = $('#nl-mail'), nlMsg = $('#nl-msg');
  const NL_DEFAULT = 'One email a month. No other lists.';
  const ICON_INFO = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 8h.01"/></svg>';
  const ICON_OK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-9"/></svg>';
  function nlSet(state, text) {
    nl.className = 'nl' + (state ? ' ' + state : '');
    nlMsg.className = 'nl-msg' + (state ? ' ' + state : '');
    nlMsg.innerHTML = state ? (state === 'bad' ? ICON_INFO : ICON_OK) + '<span></span>' : '<span></span>';
    nlMsg.querySelector('span').textContent = text;
    nlIn.setAttribute('aria-invalid', String(state === 'bad'));
  }
  nl.addEventListener('submit', e => {
    e.preventDefault();
    const v = nlIn.value.trim();
    if (!v) { nlSet('bad', 'Enter an email address to subscribe.'); nlIn.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { nlSet('bad', 'That address is missing an @ or a domain, like name@example.com.'); nlIn.focus(); return; }
    nlSet('ok', `Check your inbox. We sent a confirmation link to ${v}.`);
  });
  nlIn.addEventListener('input', () => { if (nl.classList.contains('bad') || nl.classList.contains('ok')) nlSet('', NL_DEFAULT); });

  /* ================= Entry, layout, start ================= */

  if (!reduce && 'IntersectionObserver' in window) {
    const targets = $$('.book-head, .week, .checkout, .v-left, .v-right, .foot .sub, .side');
    targets.forEach(el => el.classList.add('rise'));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
    targets.forEach(el => io.observe(el));
  }

  let lastW = innerWidth, lastH = innerHeight, resizeT = 0;
  const mapWrap = $('.map-wrap');
  const centreMap = () => { mapWrap.scrollLeft = (mapWrap.scrollWidth - mapWrap.clientWidth) / 2; };
  function layoutAll() {
    heroLayout();
    centreMap();
    if (reduce) { drawStillSky(); drawMinis(); } else jLayout();
    lastCur = ''; setCurrent(currentId());
  }
  addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      const wChanged = innerWidth !== lastW, hJump = Math.abs(innerHeight - lastH) > 120;
      if (!wChanged && !hJump) {
        if (!reduce) { const rect = journey.getBoundingClientRect(); jTop = rect.top + scrollY; jLen = Math.max(1, journey.offsetHeight - stage.clientHeight); requestJ(); }
        return;
      }
      lastW = innerWidth; lastH = innerHeight;
      if (wChanged) makeStars();
      layoutAll();
    }, 120);
  });
  addEventListener('scroll', () => { if (!reduce) requestJ(); }, { passive: true });

  makeStars();
  applyMode();
  heroLayout();
  centreMap();
  jio.observe(journey);
  onNavScroll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { layoutAll(); });
})();
