/* Aadhi Raat · main.js · Designed using Design Lounge (https://www.designlounge.live) */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const $ = (s, el = document) => el.querySelector(s);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const pad = (n) => String(n).padStart(2, '0');

  /* ---------- Kathmandu time, sunrise, moon ---------- */
  const K = 5.75 * 3600e3;            // Nepal is UTC+05:45, no daylight saving
  const LAT = 27.7172, LON = 85.3240; // Kathmandu
  const RAD = Math.PI / 180;
  const DAY = 86400e3;

  const civil = (ms) => { const d = new Date(ms + K); return [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()]; };
  const kClock = (ms) => { const d = new Date(ms + K); return [d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()]; };
  const kDay = (ms) => new Date(ms + K).getUTCDay(); // 0 Sunday
  const midnightOf = (y, m, d) => Date.UTC(y, m - 1, d) - K;
  const addDays = ([y, m, d], n) => civil(midnightOf(y, m, d) + n * DAY + 1);
  const sameDay = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  const hhmm = (ms) => { const [h, m] = kClock(ms); return pad(h) + ':' + pad(m); };
  const hhmmss = (ms) => { const [h, m, s] = kClock(ms); return pad(h) + ':' + pad(m) + ':' + pad(s); };
  const dur = (ms) => { const t = Math.max(0, Math.floor(ms / 60e3)); return Math.floor(t / 60) + 'h ' + pad(t % 60) + 'm'; };
  const countdown = (ms) => { const t = Math.max(0, Math.floor(ms / 1000)); return pad(Math.floor(t / 3600)) + ':' + pad(Math.floor(t / 60) % 60) + ':' + pad(t % 60); };
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Sunrise for a civil date in Kathmandu, sea-level horizon. The standard sunrise equation.
  function sunriseMs(y, m, d) {
    const jd = Date.UTC(y, m - 1, d) / DAY + 2440587.5;
    const n = Math.ceil(jd - 2451545.0 + 0.0008);
    const js = n - LON / 360;
    const M = (((357.5291 + 0.98560028 * js) % 360) + 360) % 360;
    const C = 1.9148 * Math.sin(M * RAD) + 0.02 * Math.sin(2 * M * RAD) + 0.0003 * Math.sin(3 * M * RAD);
    const L = (M + C + 180 + 102.9372) % 360;
    const jt = 2451545.0 + js + 0.0053 * Math.sin(M * RAD) - 0.0069 * Math.sin(2 * L * RAD);
    const dec = Math.asin(Math.sin(L * RAD) * Math.sin(23.4397 * RAD));
    const cosw = (Math.sin(-0.833 * RAD) - Math.sin(LAT * RAD) * Math.sin(dec)) / (Math.cos(LAT * RAD) * Math.cos(dec));
    const w = Math.acos(clamp(cosw, -1, 1)) / RAD;
    return (jt - w / 360 - 2440587.5) * DAY;
  }
  const windowFor = (c) => ({ date: c, open: midnightOf(...c), close: sunriseMs(...c) });

  // Moon phase 0..1 (0 new, 0.5 full) from the 6 Jan 2000 new moon and the mean synodic month.
  const moonPhase = (ms) => { const p = ((ms - 947182440e3) / (29.530588853 * DAY)) % 1; return p < 0 ? p + 1 : p; };

  /* ---------- Live state ---------- */
  const state = { lit: null, win: null, now: 0 };
  function current(now) {
    const today = civil(now);
    const w = windowFor(today);
    if (now < w.close) return { win: w, lit: true };
    return { win: windowFor(addDays(today, 1)), lit: false };
  }

  const clk = $('#clk'), fclk = $('#fclk'), fsec = $('#fsec'), fstate = $('#fstate');
  const stTitle = $('#stTitle'), stNum = $('#stNum'), winEl = $('#win'), metaClose = $('#metaClose'), exWindow = $('#exWindow');
  const sign = $('#sign');
  const board = $('#board'), weekOf = $('#weekOf'), weekDetail = $('#weekDetail');

  function tick() {
    const now = Date.now();
    state.now = now;
    const { win, lit } = current(now);
    const t = hhmmss(now);
    clk.textContent = t;
    clk.setAttribute('datetime', new Date(now).toISOString());
    fclk.textContent = t.slice(0, 5);
    fsec.textContent = t.slice(5);
    if (lit) {
      stTitle.textContent = 'Lights on. Off at sunrise ' + hhmm(win.close);
      stNum.textContent = 'in ' + countdown(win.close - now);
    } else {
      stTitle.textContent = 'Lights on at 00:00';
      stNum.textContent = 'in ' + countdown(win.open - now);
    }
    fstate.textContent = lit ? 'lights on' : 'lights off';
    if (!state.win || state.win.open !== win.open) {
      state.win = win;
      const line = '00:00 to ' + hhmm(win.close) + ' NPT · ' + dur(win.close - win.open);
      winEl.textContent = line;
      exWindow.textContent = '00:00 to ' + hhmm(win.close);
      metaClose.textContent = 'sunrise ' + hhmm(win.close);
      buildWeek(win);
    }
    if (state.lit !== lit) {
      const first = state.lit === null;
      state.lit = lit;
      root.dataset.lit = lit ? '1' : '0';
      sign.classList.toggle('buzz', lit && !reduced.matches);
      if (lit && !reduced.matches) {
        sign.classList.remove('strike'); void sign.offsetWidth; sign.classList.add('strike');
        setTimeout(() => sign.classList.remove('strike'), 1200);
      }
      if (!first && audio.on) audio.setLit(lit);
      if (first && audio.on) audio.setLit(lit);
    }
  }

  /* ---------- This week: the windows, with the moon ---------- */
  function moonSvg(p) {
    const r = 28, cx = 32, cy = 32;
    const rx = Math.max(0.01, r * Math.abs(Math.cos(2 * Math.PI * p)));
    const waxing = p < 0.5;
    const gibbous = p > 0.25 && p < 0.75;
    let lit;
    if (waxing) lit = `M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r} A${rx} ${r} 0 0 ${gibbous ? 1 : 0} ${cx} ${cy - r}Z`;
    else lit = `M${cx} ${cy - r} A${r} ${r} 0 0 0 ${cx} ${cy + r} A${rx} ${r} 0 0 ${gibbous ? 0 : 1} ${cx} ${cy - r}Z`;
    const k = Math.round((1 - Math.cos(2 * Math.PI * p)) * 50);
    return `<svg class="moon" viewBox="0 0 64 64" role="img" aria-label="Moon, ${k} percent lit"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#1c1722" stroke="#3a3340"/><path d="${lit}" fill="#efe6d2"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#fff" stroke-opacity=".08"/></svg>`;
  }
  function buildWeek(win) {
    const now = Date.now();
    const today = civil(now);
    const dow = kDay(win.open);                       // 0 Sunday
    const monday = addDays(win.date, -((dow + 6) % 7));
    weekOf.textContent = monday[2] + ' ' + MONTHS[monday[1] - 1];
    board.innerHTML = '';
    const nights = [];
    for (let i = 0; i < 7; i++) {
      const c = addDays(monday, i);
      const w = windowFor(c);
      nights.push(w);
      const sec = document.createElement('section');
      sec.className = 'day' + (sameDay(c, today) ? ' today' : '');
      const pressed = w.open === win.open;
      sec.innerHTML = `<h3><span>${DAYS[kDay(w.open)].slice(0, 3)}</span><span class="d">${c[2]} ${MONTHS[c[1] - 1]}</span></h3>` +
        moonSvg(moonPhase(w.open + 2 * 3600e3)) +
        `<button class="night" type="button" aria-pressed="${pressed}"><span class="num">00:00 → ${hhmm(w.close)}</span><small>${dur(w.close - w.open)} · sunrise ${hhmm(w.close)}</small></button>`;
      sec.querySelector('.night').addEventListener('click', (e) => {
        board.querySelectorAll('.night').forEach((b) => b.setAttribute('aria-pressed', 'false'));
        e.currentTarget.setAttribute('aria-pressed', 'true');
        detail(w);
      });
      board.appendChild(sec);
    }
    detail(win);
  }
  function detail(w) {
    const c = w.date;
    weekDetail.textContent = `${DAYS[kDay(w.open)]} ${c[2]} ${MONTHS[c[1] - 1]} · 00:00 to ${hhmm(w.close)} NPT · ${dur(w.close - w.open)}`;
  }

  /* ---------- Sound: rain, the lamp's hum, the tube's buzz ---------- */
  const audio = {
    on: false, ac: null, master: null, tube: null, nodes: [], dripTimer: 0,
    start() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!this.ac) this.ac = new AC();
      const ac = this.ac; if (ac.state === 'suspended') ac.resume();
      const now = ac.currentTime;
      const master = ac.createGain(); master.gain.setValueAtTime(0, now); master.connect(ac.destination);
      master.gain.linearRampToValueAtTime(0.55, now + 2.5);
      this.master = master; this.nodes = [];
      const noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
      const data = noiseBuf.getChannelData(0); for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const mk = (type, f, q, g) => { const s = ac.createBufferSource(); s.buffer = noiseBuf; s.loop = true; const fl = ac.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q; const gn = ac.createGain(); gn.gain.value = g; s.connect(fl); fl.connect(gn); gn.connect(master); s.start(); this.nodes.push(s); return gn; };
      const rain = mk('bandpass', 1900, 0.5, 0.22);
      mk('lowpass', 320, 0.7, 0.10);
      const lfo = ac.createOscillator(); lfo.frequency.value = 0.11; const lg = ac.createGain(); lg.gain.value = 0.06; lfo.connect(lg); lg.connect(rain.gain); lfo.start(); this.nodes.push(lfo);
      const hum = (f, g) => { const o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = f; const gn = ac.createGain(); gn.gain.value = g; o.connect(gn); gn.connect(master); o.start(); this.nodes.push(o); };
      hum(100, 0.028); hum(200, 0.010); hum(300, 0.004);
      const tube = ac.createGain(); tube.gain.value = 0; tube.connect(master); this.tube = tube;
      const saw = ac.createOscillator(); saw.type = 'sawtooth'; saw.frequency.value = 120; const sf = ac.createBiquadFilter(); sf.type = 'lowpass'; sf.frequency.value = 900; saw.connect(sf); sf.connect(tube); saw.start(); this.nodes.push(saw);
      const drip = () => {
        if (!this.on) return;
        const s = ac.createBufferSource(); s.buffer = noiseBuf; const fl = ac.createBiquadFilter(); fl.type = 'highpass'; fl.frequency.value = 2400 + Math.random() * 3000;
        const gn = ac.createGain(); const t = ac.currentTime; gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(0.05 + Math.random() * 0.08, t + 0.004); gn.gain.exponentialRampToValueAtTime(0.0005, t + 0.05 + Math.random() * 0.06);
        s.connect(fl); fl.connect(gn); gn.connect(master); s.start(t, Math.random() * 1.5, 0.15);
        this.dripTimer = setTimeout(drip, 60 + Math.random() * 260);
      };
      drip();
      this.on = true; this.setLit(state.lit);
    },
    setLit(lit) { if (this.tube) this.tube.gain.setTargetAtTime(lit ? 0.02 : 0, this.ac.currentTime, 0.3); },
    stop() {
      if (!this.on) return;
      this.on = false; clearTimeout(this.dripTimer);
      const ac = this.ac, master = this.master, nodes = this.nodes;
      master.gain.cancelScheduledValues(ac.currentTime); master.gain.setValueAtTime(master.gain.value, ac.currentTime); master.gain.linearRampToValueAtTime(0, ac.currentTime + 0.8);
      setTimeout(() => { nodes.forEach((n) => { try { n.stop(); } catch (e) { /* already stopped */ } }); master.disconnect(); }, 900);
      this.nodes = []; this.tube = null;
    }
  };
  const snd = $('#snd');
  snd.addEventListener('click', () => {
    const on = snd.getAttribute('aria-pressed') !== 'true';
    snd.setAttribute('aria-pressed', on ? 'true' : 'false');
    $('.snd-label', snd).textContent = on ? 'Sound off' : 'Hear the street';
    snd.classList.toggle('playing', on);
    if (on) audio.start(); else audio.stop();
  });

  tick();
  setTimeout(() => { tick(); setInterval(tick, 1000); }, 1000 - (Date.now() % 1000));

  /* ---------- The sign's reflection in the wet street ---------- */
  const signWrap = $('#signWrap'), reflect = $('#reflect');
  (function cloneSign() {
    const c = sign.cloneNode(true);
    c.removeAttribute('id'); c.classList.remove('strike', 'buzz');
    const defs = c.querySelector('defs'); if (defs) defs.remove();
    c.querySelectorAll('rect[filter], rect[opacity="0.55"]').forEach((el) => el.remove());
    reflect.appendChild(c);
  })();

  /* ---------- The street: one canvas, lit by one sodium lamp ---------- */
  const hero = $('.hero'), cv = $('#street'), ctx = cv.getContext('2d');
  let W = 0, H = 0, dpr = 1, streetY = 0, roofY = 0, lamp = { x: 0, y: 0, hx: 0, hy: 0 };
  let base = null, stars = [], drops = [], ripples = [], running = false, lastT = 0, visible = true;
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  function layout() {
    const r = hero.getBoundingClientRect();
    W = Math.round(r.width); H = Math.round(r.height);
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const s = sign.getBoundingClientRect();
    streetY = Math.round(s.bottom - r.top + 16);
    roofY = Math.round(Math.max(72, Math.min(s.top - r.top - 16, H * 0.22)));
    lamp = { x: Math.round(W * 0.07), y: Math.round(Math.max(48, roofY - 20)) };
    lamp.hx = lamp.x + 58; lamp.hy = lamp.y;
    buildBase();
    seed = 7;
    const n = Math.round(W / 8);
    drops = Array.from({ length: n }, () => ({ x: rnd() * W, y: rnd() * H, l: 12 + rnd() * 16, v: 560 + rnd() * 420 }));
    stars = Array.from({ length: 32 }, () => ({ x: rnd() * W, y: rnd() * roofY * 0.7, a: 0.3 + rnd() * 0.5, s: 0.5 + rnd() * 1.8, p: rnd() * 6.28 }));
    ripples = [];
  }

  function glow(c, x, y, r, col, a) {
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, col.replace('A', a)); g.addColorStop(0.35, col.replace('A', a * 0.35)); g.addColorStop(1, col.replace('A', 0));
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
  }

  function buildBase() {
    base = document.createElement('canvas'); base.width = cv.width; base.height = cv.height;
    const c = base.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed = 11;
    // sky, far: lighter and bluer than the wall
    const sky = c.createLinearGradient(0, 0, 0, roofY);
    sky.addColorStop(0, '#07060c'); sky.addColorStop(1, '#1a1230');
    c.fillStyle = sky; c.fillRect(0, 0, W, roofY + 2);
    c.fillStyle = 'rgba(255,255,255,0.7)';
    for (let i = 0; i < 90; i++) { const x = rnd() * W, y = rnd() * roofY * 0.75, a = 0.15 + rnd() * 0.5; c.globalAlpha = a; c.fillRect(x, y, 1.2, 1.2); }
    c.globalAlpha = 1;
    // the valley rim and its far lights
    c.beginPath(); c.moveTo(0, roofY);
    let y = roofY - 26;
    for (let x = 0; x <= W; x += 40) { y = roofY - 18 - Math.abs(Math.sin(x * 0.011 + 1.3) * 22 + Math.sin(x * 0.037) * 8); c.lineTo(x, y); }
    c.lineTo(W, roofY); c.closePath();
    const hill = c.createLinearGradient(0, roofY - 50, 0, roofY); hill.addColorStop(0, '#181330'); hill.addColorStop(1, '#120e22');
    c.fillStyle = hill; c.fill();
    for (let i = 0; i < 70; i++) { const x = rnd() * W, yy = roofY - 2 - rnd() * 14; c.globalAlpha = 0.25 + rnd() * 0.45; c.fillStyle = rnd() > 0.2 ? '#ffb257' : '#ffe2b0'; c.fillRect(x, yy, 1.5, 1.2); }
    c.globalAlpha = 1;
    // the wall, mid
    const wall = c.createLinearGradient(0, roofY, 0, streetY);
    wall.addColorStop(0, '#171219'); wall.addColorStop(1, '#0e0b11');
    c.fillStyle = wall; c.fillRect(0, roofY, W, streetY - roofY);
    for (let i = 0; i < 1600; i++) { c.globalAlpha = 0.025 + rnd() * 0.03; c.fillStyle = rnd() > 0.5 ? '#fff' : '#000'; c.fillRect(rnd() * W, roofY + rnd() * (streetY - roofY), 1 + rnd() * 2, 1 + rnd() * 2); }
    c.globalAlpha = 1;
    // roof ledge, lit on top
    c.fillStyle = '#0b090d'; c.fillRect(0, roofY, W, 7);
    c.fillStyle = 'rgba(255,205,150,0.22)'; c.fillRect(0, roofY, W, 1.2);
    // a closed shutter to the right, when there is room
    if (W > 1000) {
      const sx = W * 0.8, sw = W * 0.17, sy = roofY + 44, sh = streetY - sy;
      c.fillStyle = '#0b090d'; c.fillRect(sx - 8, sy - 10, sw + 16, sh + 10);
      for (let yy = sy; yy < streetY; yy += 14) {
        const d = clamp(1 - Math.hypot(sx - lamp.hx, yy - lamp.hy) / (W * 0.9), 0, 1);
        c.fillStyle = '#1a151f'; c.fillRect(sx, yy, sw, 13);
        c.fillStyle = `rgba(255,200,150,${0.04 + d * 0.16})`; c.fillRect(sx, yy, sw, 1.5);
        c.fillStyle = 'rgba(0,0,0,0.5)'; c.fillRect(sx, yy + 11, sw, 2);
      }
    }
    // the lamp's light on the wall and the street
    c.globalCompositeOperation = 'lighter';
    glow(c, lamp.hx, lamp.hy + 6, W * 0.62, 'rgba(255,162,58,A)', 0.26);
    // the cone
    const cone = c.createLinearGradient(lamp.hx, lamp.hy, lamp.hx + W * 0.25, streetY);
    cone.addColorStop(0, 'rgba(255,170,70,0.16)'); cone.addColorStop(1, 'rgba(255,170,70,0)');
    c.fillStyle = cone; c.beginPath(); c.moveTo(lamp.hx - 14, lamp.hy + 10); c.lineTo(lamp.hx + 16, lamp.hy + 10); c.lineTo(lamp.hx + W * 0.42, H); c.lineTo(Math.max(0, lamp.hx - W * 0.2), H); c.closePath(); c.fill();
    c.globalCompositeOperation = 'source-over';
    // the street, near: wet asphalt
    const st = c.createLinearGradient(0, streetY, 0, H);
    st.addColorStop(0, '#17131b'); st.addColorStop(0.25, '#0c0a0e'); st.addColorStop(1, '#09080b');
    c.fillStyle = st; c.fillRect(0, streetY, W, H - streetY);
    c.fillStyle = 'rgba(255,255,255,0.08)'; c.fillRect(0, streetY, W, 1.5);
    c.fillStyle = 'rgba(0,0,0,0.5)'; c.fillRect(0, streetY + 1.5, W, 9);
    // lamp smeared in the water
    c.globalCompositeOperation = 'lighter';
    const sm = c.createLinearGradient(0, streetY, 0, H);
    sm.addColorStop(0, 'rgba(255,162,58,0.3)'); sm.addColorStop(0.45, 'rgba(255,162,58,0.05)'); sm.addColorStop(1, 'rgba(255,162,58,0)');
    c.fillStyle = sm;
    for (let i = 0; i < 18; i++) { const w = 6 + rnd() * 26, x = lamp.hx - 22 + rnd() * 44 - w / 2; c.globalAlpha = 0.2 + rnd() * 0.4; c.fillRect(x, streetY + 2, w, (H - streetY) * 0.7); }
    c.globalAlpha = 1;
    glow(c, lamp.hx, streetY + 10, 160, 'rgba(255,162,58,A)', 0.22);
    c.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 26; i++) { const x = rnd() * W, yy = streetY + 14 + rnd() * (H - streetY - 20), w = 30 + rnd() * 220; c.globalAlpha = 0.03 + rnd() * 0.06; c.fillStyle = '#fff'; c.fillRect(x, yy, w, 1); }
    c.globalAlpha = 1;
    // the pole and the lamp head, lit from the bulb
    c.fillStyle = '#0d0b0f'; c.fillRect(lamp.x - 4, lamp.y - 12, 8, streetY - lamp.y + 12);
    c.fillStyle = 'rgba(255,200,150,0.18)'; c.fillRect(lamp.x + 1, lamp.y - 12, 2, streetY - lamp.y + 12);
    c.fillStyle = '#0d0b0f'; c.fillRect(lamp.x, lamp.y - 10, 60, 5);
    c.beginPath(); c.moveTo(lamp.hx - 26, lamp.hy - 8); c.lineTo(lamp.hx + 26, lamp.hy - 8); c.lineTo(lamp.hx + 20, lamp.hy + 6); c.lineTo(lamp.hx - 20, lamp.hy + 6); c.closePath(); c.fillStyle = '#1a1620'; c.fill();
    c.fillStyle = 'rgba(255,220,170,0.35)'; c.fillRect(lamp.hx - 26, lamp.hy - 8, 52, 1.2);
    c.globalCompositeOperation = 'lighter';
    glow(c, lamp.hx, lamp.hy + 4, 64, 'rgba(255,190,90,A)', 0.9);
    glow(c, lamp.hx, lamp.hy + 4, 18, 'rgba(255,240,200,A)', 1);
    c.globalCompositeOperation = 'source-over';
  }

  function frame(t) {
    if (!running) return;
    const dt = Math.min(0.05, (t - lastT) / 1000 || 0.016); lastT = t;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(base, 0, 0, W, H);
    const lit = state.lit;
    // stars twinkle
    ctx.fillStyle = '#fff';
    for (const s of stars) { ctx.globalAlpha = s.a * (0.55 + 0.45 * Math.sin(t * 0.001 * s.s + s.p)); ctx.fillRect(s.x, s.y, 1.4, 1.4); }
    ctx.globalAlpha = 1;
    // the lamp breathes a little
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, lamp.hx, lamp.hy + 6, W * 0.3, 'rgba(255,162,58,A)', 0.05 + 0.03 * Math.sin(t * 0.0021) * Math.sin(t * 0.0057));
    ctx.globalCompositeOperation = 'source-over';
    // ripples on the street
    if (Math.random() < dt * 9) ripples.push({ x: Math.random() * W, y: streetY + 12 + Math.random() * (H - streetY - 16), t: 0, r: 10 + Math.random() * 16 });
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i]; r.t += dt; const k = r.t / 0.75;
      if (k >= 1) { ripples.splice(i, 1); continue; }
      ctx.globalAlpha = (1 - k) * 0.22; ctx.beginPath(); ctx.ellipse(r.x, r.y, r.r * k, r.r * k * 0.28, 0, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // rain, near: lit by the lamp, and by the sign when it is on
    ctx.lineWidth = 1;
    const sx = W / 2, sy = roofY + (streetY - roofY) * 0.45;
    for (const d of drops) {
      d.y += d.v * dt; d.x += d.v * dt * 0.1;
      if (d.y > H) { d.y = -d.l; d.x = Math.random() * W; }
      if (d.x > W + 10) d.x -= W + 20;
      const dl = 1 - clamp(Math.hypot(d.x - lamp.hx, d.y - lamp.hy) / (W * 0.45), 0, 1);
      let a = 0.05 + dl * dl * 0.45, col = '255,230,190';
      if (lit) { const ds = 1 - clamp(Math.hypot(d.x - sx, d.y - sy) / (W * 0.4), 0, 1); if (ds * ds * 0.35 > a) { a = ds * ds * 0.35; col = '255,170,215'; } }
      ctx.strokeStyle = `rgba(${col},${a.toFixed(3)})`;
      ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + d.l * 0.1, d.y + d.l); ctx.stroke();
    }
    requestAnimationFrame(frame);
  }
  function still() {
    ctx.clearRect(0, 0, W, H); ctx.drawImage(base, 0, 0, W, H);
    ctx.lineWidth = 1;
    for (const d of drops) { const dl = 1 - clamp(Math.hypot(d.x - lamp.hx, d.y - lamp.hy) / (W * 0.45), 0, 1); ctx.strokeStyle = `rgba(255,230,190,${(0.05 + dl * dl * 0.45).toFixed(3)})`; ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + d.l * 0.1, d.y + d.l); ctx.stroke(); }
  }
  function start() {
    if (reduced.matches) { running = false; still(); return; }
    if (running || !visible || document.hidden) return;
    running = true; lastT = performance.now(); requestAnimationFrame(frame);
  }
  function stop() { running = false; }
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) start(); else stop(); }, { threshold: 0.02 }).observe(hero);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
  reduced.addEventListener('change', () => { if (reduced.matches) { stop(); still(); } else start(); sign.classList.toggle('buzz', state.lit && !reduced.matches); });

  let rt = 0;
  const relayout = () => { layout(); if (reduced.matches || !running) still(); };
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(relayout, 120); });
  layout(); still(); start();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);

  // pointer parallax on the sign, the nearest thing
  if (!reduced.matches && matchMedia('(pointer: fine)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const ease = () => { cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06; signWrap.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`; if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) raf = requestAnimationFrame(ease); else raf = 0; };
    hero.addEventListener('pointermove', (e) => { const r = hero.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width - 0.5) * 18; ty = ((e.clientY - r.top) / r.height - 0.5) * 10; if (!raf) raf = requestAnimationFrame(ease); });
  }

  /* ---------- Entry fades ---------- */
  const riseEls = ['.rule', '.week-head', '.board', '.board-note', '.send-head', '.tail'].map((s) => $(s)).filter(Boolean);
  if (!reduced.matches) {
    riseEls.forEach((el) => el.classList.add('rise'));
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
    riseEls.forEach((el) => io.observe(el));
  }

  /* ---------- Send a tape: the stacking cards ---------- */
  const stack = $('#stack'), lis = Array.from(stack.children), cards = lis.map((li) => li.querySelector('.card')), rail = $('#rail');
  cards.forEach((card, i) => {
    const b = document.createElement('button'); b.type = 'button';
    const name = card.querySelector('h3').textContent;
    b.setAttribute('aria-label', `Step ${i + 1}: ${name}`); b.textContent = pad(i + 1);
    b.addEventListener('click', () => { const top = lis[i].getBoundingClientRect().top + window.scrollY; window.scrollTo({ top, behavior: reduced.matches ? 'auto' : 'smooth' }); });
    rail.appendChild(b);
  });
  const railBtns = Array.from(rail.children);
  const stuck = (i) => (window.innerWidth <= 640 ? 24 + i * 12 : 40 + i * 16);
  function stackFrame() {
    const n = lis.length; let cur = 0;
    for (let i = 0; i < n; i++) {
      const top = lis[i].getBoundingClientRect().top;
      if (top <= stuck(i) + 2) cur = i;
      if (i === n - 1 || reduced.matches) continue;
      const next = lis[i + 1].getBoundingClientRect().top;
      const h = cards[i].offsetHeight;
      const p = clamp(1 - (next - stuck(i + 1)) / h, 0, 1);
      cards[i].style.setProperty('--s', (1 - p * (n - 1 - i) * 0.035).toFixed(4));
      cards[i].style.setProperty('--dim', (p * (window.innerWidth <= 640 ? 0.1 : 0.16)).toFixed(3));
    }
    railBtns.forEach((b, i) => { if (i === cur) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
  }
  new IntersectionObserver((es) => rail.classList.toggle('show', es[0].isIntersecting), { threshold: 0.05 }).observe(stack);

  /* ---------- Footer: the wordmark rises out of the floor ---------- */
  const foot = $('#foot'), word = $('#word'), letters = Array.from(word.children);
  function fitWord() {
    word.style.setProperty('--word-size', '300px');
    const avail = word.clientWidth;
    const w = letters.reduce((a, l) => a + l.getBoundingClientRect().width, 0);
    if (w > 0) word.style.setProperty('--word-size', Math.floor(300 * (avail / w)) + 'px');
  }
  let replaying = false;
  function wordFrame() {
    if (replaying) return;
    const r = foot.getBoundingClientRect();
    const p = reduced.matches ? 1 : clamp((window.innerHeight - r.top) / (r.height + 40), 0, 1);
    letters.forEach((l, i) => l.style.setProperty('--p', clamp(p * 1.5 - i * 0.07, 0, 1).toFixed(3)));
  }
  $('#replay').addEventListener('click', () => {
    if (reduced.matches) { window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' }); return; }
    replaying = true;
    letters.forEach((l) => { l.style.transitionDelay = '0ms'; l.style.setProperty('--p', '0'); });
    setTimeout(() => {
      letters.forEach((l, i) => { l.style.transitionDelay = (i * 50) + 'ms'; l.style.setProperty('--p', '1'); });
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      setTimeout(() => { letters.forEach((l) => { l.style.transitionDelay = ''; }); replaying = false; wordFrame(); }, 1200);
    }, 420);
  });

  /* ---------- One scroll listener, one frame ---------- */
  let queued = false;
  const onScroll = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; stackFrame(); wordFrame(); }); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { fitWord(); onScroll(); });
  fitWord(); stackFrame(); wordFrame();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fitWord(); wordFrame(); });
})();
