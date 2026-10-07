/* Aadhi Raat — main.js */
(() => {
  'use strict';

  const KTM = 'Asia/Kathmandu';
  const WINDOW_END_MIN = 5 * 60 + 45; // 05:45 NPT
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => reduceMQ.matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const pad = (n) => String(n).padStart(2, '0');

  /* ------------------------------------------------------------------ */
  /* Time                                                                */
  /* ------------------------------------------------------------------ */

  const fmtCache = new Map();
  function fmt(zone) {
    if (!fmtCache.has(zone)) {
      fmtCache.set(zone, new Intl.DateTimeFormat('en-GB', {
        timeZone: zone, hourCycle: 'h23',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }));
    }
    return fmtCache.get(zone);
  }
  function parts(zone, date = new Date()) {
    const o = {};
    for (const p of fmt(zone).formatToParts(date)) if (p.type !== 'literal') o[p.type] = +p.value;
    if (o.hour === 24) o.hour = 0;
    return o;
  }
  const hms = (p) => `${pad(p.hour)}:${pad(p.minute)}:${pad(p.second)}`;
  const hm = (p) => `${pad(p.hour)}:${pad(p.minute)}`;

  function ktmState(now = new Date()) {
    const p = parts(KTM, now);
    const mins = p.hour * 60 + p.minute;
    const sec = mins * 60 + p.second;
    const open = mins < WINDOW_END_MIN;
    return {
      p, open,
      secOfDay: sec,
      secToMidnight: 86400 - sec,
      secLeft: open ? WINDOW_END_MIN * 60 - sec : 0
    };
  }
  function dur(secs) {
    secs = Math.max(0, Math.round(secs));
    const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
    if (h > 0) return `${h}h ${pad(m)}m`;
    if (m > 0) return `${m}m ${pad(s)}s`;
    return `${s}s`;
  }
  // offset of a zone at an instant, in ms (zone wall clock minus UTC)
  function zoneOffset(zone, date) {
    const p = parts(zone, date);
    const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    const t = Math.floor(date.getTime() / 1000) * 1000;
    return Math.round((asUTC - t) / 60000) * 60000;
  }
  // wall time in a zone -> instant
  function wallToInstant(zone, y, mo, d, h, mi) {
    const wall = Date.UTC(y, mo - 1, d, h, mi);
    let guess = wall;
    for (let i = 0; i < 3; i++) guess = wall - zoneOffset(zone, new Date(guess));
    return new Date(guess);
  }
  function dayWord(hour) {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }
  function zoneLabel(zone) {
    const city = zone.split('/').pop().replace(/_/g, ' ');
    return city;
  }
  const localZone = (() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) { return 'UTC'; }
  })();

  /* ------------------------------------------------------------------ */
  /* Clocks, state, gate                                                 */
  /* ------------------------------------------------------------------ */

  const clockEls = $$('[data-ktm-clock]');
  const heroClock = $('[data-hero-clock]');
  const stateEl = $('[data-ktm-state]');
  const navDot = $('[data-ktm-dot]');
  const gateBtn = $('[data-gate]');
  const gateStatus = $('[data-gate-status]');
  const gateWhen = $('[data-gate-when]');
  const gateLocal = $('[data-gate-local]');
  const gatePanel = $('[data-gate-panel]');
  let introDone = reduced();

  function paintState(st) {
    if (stateEl) {
      stateEl.textContent = st.open
        ? `Window open · ${dur(st.secLeft)} of night left`
        : `Window closed · midnight in ${dur(st.secToMidnight)}`;
    }
    if (navDot) navDot.classList.toggle('is-open', st.open);
    if (gateBtn) {
      gateBtn.disabled = !st.open;
      gateStatus.textContent = st.open ? 'Window open' : 'Window closed';
      gateWhen.textContent = st.open ? `${dur(st.secLeft)} left` : `opens in ${dur(st.secToMidnight)}`;
      if (!st.open && !gatePanel.hidden) { gatePanel.hidden = true; gateBtn.setAttribute('aria-expanded', 'false'); }
      const midnight = new Date(Date.now() + st.secToMidnight * 1000);
      const lp = parts(localZone, midnight);
      gateLocal.textContent = st.open
        ? `It is ${hm(parts(localZone))} where you are. The window closes at ${hm(parts(localZone, new Date(Date.now() + st.secLeft * 1000)))}.`
        : `Where you are, that is ${hm(lp)} this ${dayWord(lp.hour)}.`;
    }
  }

  function tick() {
    const st = ktmState();
    const t = hms(st.p);
    if (introDone) clockEls.forEach((e) => { e.textContent = t; });
    else clockEls.forEach((e) => { if (e !== heroClock) e.textContent = t; });
    paintState(st);
  }
  tick();
  setInterval(tick, 1000);

  if (gateBtn) {
    gateBtn.setAttribute('aria-expanded', 'false');
    gateBtn.addEventListener('click', () => {
      if (gateBtn.disabled) return;
      gatePanel.hidden = !gatePanel.hidden;
      gateBtn.setAttribute('aria-expanded', String(!gatePanel.hidden));
    });
  }

  // Intro: the hero clock tunes itself from 00:00:00 up to Kathmandu's time.
  function intro() {
    if (reduced() || !heroClock) {
      document.body.classList.remove('is-loading');
      introDone = true;
      return;
    }
    const target = ktmState().secOfDay;
    const t0 = performance.now();
    const D = 1400;
    const ease = (x) => 1 - Math.pow(1 - x, 4);
    function step(now) {
      const k = Math.min(1, (now - t0) / D);
      const s = Math.round(target * ease(k));
      heroClock.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
      if (k < 1) requestAnimationFrame(step);
      else { introDone = true; tick(); }
    }
    requestAnimationFrame(step);
    requestAnimationFrame(() => document.body.classList.remove('is-loading'));
  }
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 900))]).then(intro, intro);
  } else intro();

  /* ------------------------------------------------------------------ */
  /* Midnight elsewhere                                                  */
  /* ------------------------------------------------------------------ */

  function midnightElsewhere() {
    const list = $('[data-cities]');
    if (!list) return;
    const st = ktmState();
    const midnight = new Date(Date.now() + st.secToMidnight * 1000);
    const cities = [
      ['Los Angeles', 'America/Los_Angeles'], ['Mexico City', 'America/Mexico_City'],
      ['New York', 'America/New_York'], ['São Paulo', 'America/Sao_Paulo'],
      ['London', 'Europe/London'], ['Paris', 'Europe/Paris'], ['Berlin', 'Europe/Berlin'],
      ['Lagos', 'Africa/Lagos'], ['Cairo', 'Africa/Cairo'], ['Istanbul', 'Europe/Istanbul'],
      ['Nairobi', 'Africa/Nairobi'], ['Dubai', 'Asia/Dubai'], ['Mumbai', 'Asia/Kolkata'],
      ['Kathmandu', KTM], ['Bangkok', 'Asia/Bangkok'], ['Singapore', 'Asia/Singapore'],
      ['Tokyo', 'Asia/Tokyo'], ['Seoul', 'Asia/Seoul'], ['Sydney', 'Australia/Sydney'],
      ['Auckland', 'Pacific/Auckland']
    ];
    const frag = document.createDocumentFragment();
    for (const [name, zone] of cities) {
      let p;
      try { p = parts(zone, midnight); } catch (e) { continue; }
      const li = document.createElement('li');
      if (zone === KTM) li.className = 'is-ktm';
      li.innerHTML = `<span class="c__name"></span><span class="c__time"></span><span class="c__meta"></span>`;
      li.children[0].textContent = name;
      li.children[1].textContent = zone === KTM ? '00:00' : hm(p);
      li.children[2].textContent = zone === KTM ? 'midnight' : dayWord(p.hour);
      frag.appendChild(li);
    }
    list.textContent = '';
    list.appendChild(frag);

    const youZone = $('[data-you-zone]'), youTime = $('[data-you-time]'), youNote = $('[data-you-note]');
    const lp = parts(localZone, midnight);
    if (youZone) youZone.textContent = localZone === KTM ? 'Kathmandu' : zoneLabel(localZone);
    if (youTime) youTime.textContent = localZone === KTM ? '00:00' : hm(lp);
    if (youNote) youNote.textContent = localZone === KTM ? 'You are on our clock.' : `${dayWord(lp.hour)} · ${localZone}`;
  }
  midnightElsewhere();
  setInterval(midnightElsewhere, 60000);

  /* ------------------------------------------------------------------ */
  /* Session checker                                                     */
  /* ------------------------------------------------------------------ */

  function checker() {
    const form = $('[data-checker]');
    if (!form) return;
    const dt = $('#check-time'), tz = $('#check-zone');
    const out = $('.verdict', form), vTime = $('[data-v-time]'), vMsg = $('[data-v-msg]');

    let zones = [];
    try { if (typeof Intl.supportedValuesOf === 'function') zones = Intl.supportedValuesOf('timeZone'); } catch (e) { zones = []; }
    if (!zones.length) {
      zones = ['UTC', 'America/Los_Angeles', 'America/Denver', 'America/Chicago', 'America/New_York', 'America/Sao_Paulo',
        'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Istanbul', 'Africa/Lagos', 'Africa/Cairo', 'Africa/Nairobi',
        'Asia/Dubai', 'Asia/Karachi', 'Asia/Kolkata', 'Asia/Kathmandu', 'Asia/Dhaka', 'Asia/Bangkok', 'Asia/Singapore',
        'Asia/Shanghai', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Sydney', 'Pacific/Auckland'];
    }
    if (!zones.includes(localZone)) zones = [localZone].concat(zones);
    const frag = document.createDocumentFragment();
    for (const z of zones) {
      const o = document.createElement('option');
      o.value = z; o.textContent = z.replace(/_/g, ' ');
      if (z === localZone) o.selected = true;
      frag.appendChild(o);
    }
    tz.appendChild(frag);

    const lp = parts(localZone);
    dt.value = `${lp.year}-${pad(lp.month)}-${pad(lp.day)}T${pad(lp.hour)}:${pad(lp.minute)}`;

    function run() {
      const m = (dt.value || '').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
      out.classList.remove('is-ok', 'is-no');
      if (!m) { vTime.textContent = '—'; vMsg.textContent = 'Pick a time to begin.'; return; }
      let inst;
      try { inst = wallToInstant(tz.value, +m[1], +m[2], +m[3], +m[4], +m[5]); } catch (e) { vTime.textContent = '—'; vMsg.textContent = 'That zone could not be read.'; return; }
      const p = parts(KTM, inst);
      const mins = p.hour * 60 + p.minute;
      const ok = mins < WINDOW_END_MIN;
      vTime.textContent = hm(p);
      out.classList.add(ok ? 'is-ok' : 'is-no');
      if (ok) {
        vMsg.textContent = `Inside the window. That take belongs to hour ${pad(p.hour)} of the night. Shelve it under AR·${pad(p.hour)}.`;
      } else {
        // next Kathmandu midnight after that instant, shown in the chosen zone
        const sec = mins * 60 + p.second;
        const next = new Date(inst.getTime() + (86400 - sec) * 1000);
        const np = parts(tz.value, next);
        vMsg.textContent = `Outside the window. Kathmandu is awake. Midnight here comes at ${hm(np)} on your clock. Start then.`;
      }
    }
    dt.addEventListener('input', run);
    tz.addEventListener('change', run);
    form.addEventListener('submit', (e) => { e.preventDefault(); run(); });
    run();
  }
  checker();

  /* ------------------------------------------------------------------ */
  /* Hero sky                                                            */
  /* ------------------------------------------------------------------ */

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function sky() {
    const c = $('#sky');
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const hero = c.parentElement;
    let W = 0, H = 0, stars = [], lights = [], far = [], near = [];
    let mx = 0, my = 0, tx = 0, ty = 0;
    let raf = 0, visible = true, shoot = null, nextShoot = 3500;
    const STEP = 4;

    function ridge(base, amp, seed, oct) {
      const r = mulberry32(seed);
      const f = [];
      for (let o = 0; o < oct; o++) f.push({ k: (1 + o * 1.9) * (0.7 + r() * 0.5), ph: r() * 6.283, a: 1 / (o + 1) });
      const pts = [];
      for (let x = 0; x <= W + STEP; x += STEP) {
        let y = 0; const u = x / W;
        for (const q of f) y += Math.sin(u * q.k * 6.283 + q.ph) * q.a;
        pts.push([x, base + (y / 1.9) * amp]);
      }
      return pts;
    }
    const ridgeY = (pts, x) => pts[Math.min(pts.length - 1, Math.max(0, Math.round(x / STEP)))][1];

    function build() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = hero.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const rnd = mulberry32(2045);
      stars = [];
      const n = Math.round((W * H) / 3200);
      for (let i = 0; i < n; i++) {
        const big = rnd() < 0.07;
        stars.push({ x: rnd() * W, y: rnd() * H * 0.74, r: big ? 1.2 + rnd() * 0.9 : 0.35 + rnd() * 0.75,
          a: 0.25 + rnd() * 0.65, ph: rnd() * 6.283, sp: 0.5 + rnd() * 1.4, d: 0.25 + rnd() * 0.75, warm: rnd() < 0.12 });
      }
      far = ridge(H * 0.66, H * 0.09, 11, 4);
      near = ridge(H * 0.84, H * 0.07, 23, 4);
      lights = [];
      const m = Math.round(W / 2.6);
      for (let i = 0; i < m; i++) {
        const x = rnd() * W;
        const top = ridgeY(far, x) + 4, bot = ridgeY(near, x) - 3;
        if (bot <= top) continue;
        const t = rnd();
        lights.push({ x, y: top + (bot - top) * Math.pow(t, 0.55), r: 0.5 + rnd() * 1.0, a: 0.2 + rnd() * 0.6, ph: rnd() * 6.283, warm: rnd() < 0.86 });
      }
    }

    function poly(pts, dx) {
      ctx.beginPath();
      ctx.moveTo(-10, H + 10);
      for (const [x, y] of pts) ctx.lineTo(x + dx, y);
      ctx.lineTo(W + 10, H + 10);
      ctx.closePath();
      ctx.fill();
    }

    function draw(t) {
      const still = reduced();
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#03040a'); g.addColorStop(0.5, '#090b19'); g.addColorStop(0.72, '#13112a'); g.addColorStop(1, '#1b1430');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      // valley glow
      const gx = W * 0.56, gy = ridgeY(far, gx) + H * 0.06;
      const rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(W, H) * 0.55);
      rg.addColorStop(0, 'rgba(255,150,60,0.30)'); rg.addColorStop(0.35, 'rgba(255,120,60,0.10)'); rg.addColorStop(1, 'rgba(255,120,60,0)');
      ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);

      // moon
      const mxp = W * 0.78 + tx * 3, myp = H * 0.16 + ty * 2, mr = Math.max(14, Math.min(W, H) * 0.028);
      const mg = ctx.createRadialGradient(mxp, myp, mr * 0.6, mxp, myp, mr * 5);
      mg.addColorStop(0, 'rgba(217,221,255,0.16)'); mg.addColorStop(1, 'rgba(217,221,255,0)');
      ctx.fillStyle = mg; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#d9ddff'; ctx.beginPath(); ctx.arc(mxp, myp, mr, 0, 6.283); ctx.fill();
      ctx.fillStyle = '#07080f'; ctx.beginPath(); ctx.arc(mxp - mr * 0.42, myp - mr * 0.12, mr * 0.92, 0, 6.283); ctx.fill();

      // stars
      for (const s of stars) {
        const tw = still ? 1 : 0.7 + 0.3 * Math.sin(t * 0.0012 * s.sp + s.ph);
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = s.warm ? '#ffe2b0' : '#e8ecff';
        ctx.beginPath(); ctx.arc(s.x + tx * s.d * 14, s.y + ty * s.d * 8, s.r, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // shooting star
      if (shoot) {
        const k = (t - shoot.t0) / shoot.d;
        if (k >= 1) shoot = null;
        else {
          const x = shoot.x + shoot.vx * k, y = shoot.y + shoot.vy * k;
          const grd = ctx.createLinearGradient(x - shoot.vx * 0.12, y - shoot.vy * 0.12, x, y);
          grd.addColorStop(0, 'rgba(232,236,255,0)'); grd.addColorStop(1, `rgba(232,236,255,${0.9 * (1 - k)})`);
          ctx.strokeStyle = grd; ctx.lineWidth = 1.2; ctx.beginPath();
          ctx.moveTo(x - shoot.vx * 0.12, y - shoot.vy * 0.12); ctx.lineTo(x, y); ctx.stroke();
        }
      }

      // far hills
      ctx.fillStyle = '#0c0e1f'; poly(far, tx * 5);
      // valley lights
      for (const l of lights) {
        const f = still ? 1 : 0.72 + 0.28 * Math.sin(t * 0.0025 + l.ph);
        ctx.globalAlpha = l.a * f;
        ctx.fillStyle = l.warm ? '#ffb24a' : '#cfe0ff';
        ctx.beginPath(); ctx.arc(l.x + tx * 2.5, l.y, l.r, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      // near ridge
      ctx.fillStyle = '#05060c'; poly(near, 0);
    }

    function loop(t) {
      raf = 0;
      if (reduced()) { tx = 0; ty = 0; draw(t); return; }
      tx += (mx - tx) * 0.04; ty += (my - ty) * 0.04;
      if (!shoot && t > nextShoot) {
        const r = Math.random();
        shoot = { t0: t, d: 650 + r * 400, x: W * (0.1 + Math.random() * 0.7), y: H * (0.05 + Math.random() * 0.3), vx: 180 + r * 160, vy: 70 + r * 60 };
        nextShoot = t + 4500 + Math.random() * 6000;
      }
      draw(t);
      if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(loop); }

    build(); kick();
    let rT;
    addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { build(); kick(); }, 120); });
    if (finePointer) addEventListener('pointermove', (e) => { mx = (e.clientX / innerWidth - 0.5) * 2; my = (e.clientY / innerHeight - 0.5) * 2; }, { passive: true });
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) kick(); }).observe(hero);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
    reduceMQ.addEventListener('change', kick);
  }
  sky();

  /* ------------------------------------------------------------------ */
  /* Hour waveforms                                                      */
  /* ------------------------------------------------------------------ */

  function waves() {
    const cards = $$('.hour');
    if (!cards.length) return;
    const live = new Set();
    let raf = 0;
    const state = cards.map((card) => {
      const cv = $('canvas', card);
      return { card, cv, ctx: cv.getContext('2d'), hour: +card.dataset.hour, w: 0, h: 0, hot: 0 };
    });
    function size(s) {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = s.cv.getBoundingClientRect();
      s.w = Math.max(1, Math.round(r.width)); s.h = Math.max(1, Math.round(r.height));
      s.cv.width = Math.round(s.w * dpr); s.cv.height = Math.round(s.h * dpr);
      s.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw(s, t) {
      const { ctx, w, h, hour } = s;
      ctx.clearRect(0, 0, w, h);
      const rnd = mulberry32(100 + hour * 17);
      const n = Math.max(12, Math.floor(w / 6));
      const gap = w / n;
      const base = [0.9, 0.55, 0.7, 0.3, 0.45, 0.85][hour] || 0.5;
      const still = reduced();
      const amp = still ? 1 : 0.85 + 0.15 * s.hot;
      for (let i = 0; i < n; i++) {
        const u = i / (n - 1);
        const env = Math.sin(u * Math.PI) ** 0.6;
        const nz = rnd();
        const mv = still ? 0 : Math.sin(t * 0.0022 + i * 0.35 + hour) * 0.18 * (0.3 + s.hot);
        let v = (0.08 + nz * base * env + mv) * amp;
        v = Math.max(0.04, Math.min(1, v));
        const bh = v * h;
        const x = i * gap + gap * 0.3;
        ctx.fillStyle = i % 9 === hour ? '#ffae3d' : (nz > 0.86 ? '#d9ddff' : 'rgba(235,230,218,0.55)');
        ctx.fillRect(x, (h - bh) / 2, Math.max(1, gap * 0.4), bh);
      }
      // the 05:45 cut line on the last card
      if (hour === 5) {
        ctx.fillStyle = '#ffae3d';
        ctx.fillRect(w * 0.75, 0, 1, h);
      }
    }
    function loop(t) {
      raf = 0;
      for (const s of state) {
        if (!live.has(s.card)) continue;
        const want = s.card.matches(':hover') ? 1 : 0;
        s.hot += (want - s.hot) * 0.08;
        draw(s, t);
      }
      if (live.size && !reduced() && !document.hidden) raf = requestAnimationFrame(loop);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(loop); }
    state.forEach(size);
    const io = new IntersectionObserver((es) => {
      for (const e of es) {
        if (e.isIntersecting) live.add(e.target); else live.delete(e.target);
        if (reduced() && e.isIntersecting) { const s = state.find((q) => q.card === e.target); draw(s, 0); }
      }
      kick();
    }, { threshold: 0.15 });
    cards.forEach((c) => io.observe(c));
    let rT;
    addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { state.forEach(size); state.forEach((s) => draw(s, 0)); kick(); }, 120); });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
    reduceMQ.addEventListener('change', () => { state.forEach((s) => draw(s, 0)); kick(); });
  }
  waves();

  /* ------------------------------------------------------------------ */
  /* Drag to scroll the hour track (desktop)                             */
  /* ------------------------------------------------------------------ */

  function dragTrack() {
    const track = $('[data-track]');
    if (!track || !finePointer) return;
    let down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      down = true; moved = false; sx = e.clientX; sl = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 4) { moved = true; track.classList.add('is-dragging'); }
      if (moved) track.scrollLeft = sl - dx;
    });
    const up = () => { down = false; track.classList.remove('is-dragging'); };
    track.addEventListener('pointerup', up);
    track.addEventListener('pointercancel', up);
  }
  dragTrack();

  /* ------------------------------------------------------------------ */
  /* Reveals, word splits, progress, hero parallax                      */
  /* ------------------------------------------------------------------ */

  function splitWords() {
    for (const el of $$('[data-split]')) {
      if (reduced()) { el.classList.add('in'); continue; }
      const words = el.textContent.trim().split(/\s+/);
      el.textContent = '';
      words.forEach((w, i) => {
        const outer = document.createElement('span'); outer.className = 'w';
        const inner = document.createElement('span'); inner.textContent = w;
        inner.style.setProperty('--d', `${Math.min(i * 0.035, 0.7)}s`);
        outer.appendChild(inner); el.appendChild(outer);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
    }
  }
  splitWords();

  function reveals() {
    const els = $$('.reveal, [data-split]');
    if (reduced()) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
  }
  reveals();

  function scrollFx() {
    const bar = $('.progress i');
    const heroInner = $('.hero__inner');
    const ghost = $('.hero__ghost');
    const hero = $('.hero');
    let raf = 0;
    function apply() {
      raf = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const y = scrollY;
      if (bar) bar.style.transform = `scaleX(${Math.min(1, y / max)})`;
      if (reduced()) return;
      const hh = hero ? hero.offsetHeight : innerHeight;
      const k = Math.min(1, y / hh);
      if (heroInner) { heroInner.style.transform = `translateY(${y * 0.22}px)`; heroInner.style.opacity = String(1 - k * 1.1); }
      if (ghost) ghost.style.transform = `translate(-50%, ${y * -0.12}px)`;
    }
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(apply); }, { passive: true });
    apply();
  }
  scrollFx();

  function marquee() {
    const t = $('[data-marquee]');
    if (!t) return;
    t.innerHTML += t.innerHTML;
  }
  marquee();

  /* ------------------------------------------------------------------ */
  /* Cursor                                                              */
  /* ------------------------------------------------------------------ */

  function cursor() {
    const el = $('.cursor');
    if (!el || !finePointer || reduced()) return;
    document.body.classList.add('has-cursor');
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, raf = 0, on = false;
    function loop() {
      cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
      el.style.transform = `translate(${cx}px, ${cy}px)`;
      if (Math.abs(x - cx) > 0.2 || Math.abs(y - cy) > 0.2) raf = requestAnimationFrame(loop); else raf = 0;
    }
    addEventListener('pointermove', (e) => {
      x = e.clientX; y = e.clientY;
      if (!on) { on = true; el.classList.add('is-on'); }
      if (!raf) raf = requestAnimationFrame(loop);
      const t = e.target.closest('[data-cursor]');
      el.classList.toggle('is-hover', !!t && t.dataset.cursor === '');
      const lab = t && t.dataset.cursor ? t.dataset.cursor : '';
      el.classList.toggle('is-label', !!lab);
      el.setAttribute('data-label', lab);
    }, { passive: true });
    document.addEventListener('mouseleave', () => { on = false; el.classList.remove('is-on'); });
    reduceMQ.addEventListener('change', () => { if (reduced()) document.body.classList.remove('has-cursor'); });
  }
  cursor();

  /* ------------------------------------------------------------------ */
  /* Night tone (Web Audio drone; never autoplays)                       */
  /* ------------------------------------------------------------------ */

  function sound() {
    const btns = $$('[data-sound]');
    if (!btns.length) return;
    let ctx = null, master = null, on = false, offTimer = 0;

    function build() {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);

      const filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 420; filt.Q.value = 0.8; filt.connect(master);
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.045;
      const lg = ctx.createGain(); lg.gain.value = 170; lfo.connect(lg); lg.connect(filt.frequency); lfo.start();

      // A low tanpura-ish drone: root, fifth, octave, with slow beating
      const voices = [[55, 'sine', 0.55, 0], [82.41, 'sine', 0.26, 2], [110, 'triangle', 0.14, -5], [110, 'sine', 0.12, 7], [164.81, 'sine', 0.05, 0]];
      for (const [f, type, g, det] of voices) {
        const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = det;
        const vg = ctx.createGain(); vg.gain.value = g;
        o.connect(vg); vg.connect(filt); o.start();
      }

      // Room: filtered noise that breathes
      const len = ctx.sampleRate * 2;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 520; bp.Q.value = 0.5;
      const ng = ctx.createGain(); ng.gain.value = 0.03;
      const nl = ctx.createOscillator(); nl.frequency.value = 0.08;
      const nlg = ctx.createGain(); nlg.gain.value = 0.018;
      nl.connect(nlg); nlg.connect(ng.gain); nl.start();
      src.connect(bp); bp.connect(ng); ng.connect(master); src.start();
    }

    function paint() {
      for (const b of btns) {
        b.setAttribute('aria-pressed', String(on));
        const l = $('[data-sound-label]', b);
        if (l) l.textContent = on ? 'Night tone on' : 'Night tone off';
      }
    }

    async function toggle() {
      on = !on;
      paint();
      try {
        if (on) {
          if (!ctx) build();
          clearTimeout(offTimer);
          if (ctx.state !== 'running') await ctx.resume();
          master.gain.cancelScheduledValues(ctx.currentTime);
          master.gain.setTargetAtTime(0.2, ctx.currentTime, 0.9);
        } else if (ctx) {
          master.gain.cancelScheduledValues(ctx.currentTime);
          master.gain.setTargetAtTime(0, ctx.currentTime, 0.35);
          offTimer = setTimeout(() => { if (!on && ctx && ctx.state === 'running') ctx.suspend(); }, 2200);
        }
      } catch (e) {
        on = false; paint();
      }
    }
    btns.forEach((b) => b.addEventListener('click', toggle));
  }
  sound();
})();
