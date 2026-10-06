/* Late Light · Designed using Design Lounge (https://www.designlounge.live) */
(() => {
  const root = document.documentElement;
  const rm = matchMedia('(prefers-reduced-motion: reduce)');
  let still = rm.matches;

  /* ---------- The sky poster (hero-bauhaus-composition) ---------- */
  // [x, y, w, h, rotate] in 560px poster units
  const C = [
    { n: 'I / III', t: 'Moonrise', d: 'The Moon clears the dome.', s: {
      c: [42, 42, 310, 310, 0], t: [96, 280, 250, 230, 0], s: [300, 250, 218, 218, 0], h: [300, 42, 218, 109, 0],
      r: [392, 150, 96, 96, 0], b: [42, 500, 476, 18, 0], d: [230, 200, 44, 44, 0] } },
    { n: 'II / III', t: 'Meridian', d: 'One line splits the sky in two.', s: {
      c: [270, 250, 250, 250, 0], t: [40, 300, 250, 220, 0], s: [60, 60, 170, 170, 12], h: [290, 70, 230, 115, 180],
      r: [110, 190, 60, 60, 0], b: [252, 24, 18, 512, 0], d: [430, 40, 70, 70, 0] } },
    { n: 'III / III', t: 'Tilt', d: 'The horizon leans as the sky turns.', s: {
      c: [180, 170, 210, 210, 0], t: [310, 40, 210, 190, 180], s: [62, 370, 140, 140, 45], h: [24, 80, 260, 130, 90],
      r: [380, 360, 140, 140, 0], b: [20, 272, 520, 18, -32], d: [120, 40, 40, 40, 0] } },
  ];
  const poster = document.getElementById('poster');
  const posterIn = document.getElementById('posterIn');
  const shapes = [...posterIn.querySelectorAll('.shape')];
  const numBtns = [...document.querySelectorAll('.nums button')];
  const capN = document.getElementById('capN');
  const capT = document.getElementById('capT');
  const capD = document.getElementById('capD');
  let comp = 0;
  let settleTimer = 0;

  function applyComp(k) {
    comp = k;
    shapes.forEach(el => {
      const [x, y, w, h, r] = C[k].s[el.dataset.k];
      el.style.width = w + 'px';
      el.style.height = h + 'px';
      el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
    });
    numBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(i === k)));
    capN.textContent = C[k].n;
    capT.textContent = C[k].t;
    capD.textContent = C[k].d;
    clearTimeout(settleTimer);
    settleTimer = setTimeout(measure, still ? 30 : 900 + 6 * 60 + 60);
  }
  applyComp(0);

  const posterLocked = () => !still && scrollY - pinTop > 4;
  poster.addEventListener('click', () => { if (!posterLocked()) applyComp((comp + 1) % C.length); });
  numBtns.forEach((b, i) => b.addEventListener('click', () => { if (!posterLocked()) applyComp(i); }));

  /* ---------- The journey (scroll-zoom-portal, chained) ---------- */
  const pin = document.getElementById('journey');
  const stage = document.getElementById('stage');
  const layers = [...stage.querySelectorAll('.layer')];
  const portals = layers.slice(0, 4).map(l => l.querySelector('[data-portal]'));
  const copies = layers.map(l => l.querySelector('.copy, .scopy'));
  const roDist = document.getElementById('roDist');
  const roTime = document.getElementById('roTime');
  const roPass = document.getElementById('roPass');
  const hudBar = document.getElementById('hudBar');

  const LY = 9.4607e12;
  const STOPS = [0, 1.496e8, 4.24 * LY, 26000 * LY, 2.5e6 * LY];
  const NAMES = ['Your seat', 'The Sun', 'Proxima Centauri', 'The Milky Way', 'Andromeda'];

  let W = 0, H = 0, dive = 1, tail = 0, pinTop = 0;
  const O = [], OS = [], S = [];

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
  const smooth = t => t * t * (3 - 2 * t);
  const about = (s, o) => ({ a: s, x: o.x * (1 - s), y: o.y * (1 - s) });
  const comp2 = (A, B) => ({ a: A.a * B.a, x: A.a * B.x + A.x, y: A.a * B.y + A.y });

  function clearInline() {
    layers.forEach(l => { l.style.transform = ''; l.style.visibility = ''; delete l.dataset.mask; });
    copies.forEach(c => { c.style.opacity = ''; c.style.visibility = ''; });
    pin.style.height = '';
  }

  function measure() {
    const P = poster.clientWidth - 2;
    posterIn.style.setProperty('--k', (P / 560).toFixed(5));
    if (still) { clearInline(); return; }
    W = stage.clientWidth;
    H = stage.clientHeight;
    const phone = innerWidth < 768;
    dive = H * (phone ? 1.05 : 1.3);
    tail = H * 0.75;
    pin.style.height = Math.round(4 * dive + H + tail) + 'px';

    layers.forEach(l => { l.style.transform = 'none'; l.style.visibility = 'visible'; });
    const sr = stage.getBoundingClientRect();
    portals.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const k = r.width / el.offsetWidth;
      const bw = parseFloat(getComputedStyle(el).borderTopWidth) * k;
      const cx = r.left - sr.left + r.width / 2;
      const cy = r.top - sr.top + r.height / 2;
      const rad = Math.max(2, r.width / 2 - bw);
      OS[i] = { x: cx, y: cy };
      O[i] = { x: cx + 1.5 * W, y: cy + 1.5 * H };
      const l = layers[i];
      l.style.setProperty('--cx', O[i].x + 'px');
      l.style.setProperty('--cy', O[i].y + 'px');
      l.style.setProperty('--r', rad + 'px');
      l.dataset.mask = '';
      const D = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy));
      S[i] = 1.12 * D / rad;
    });
    pinTop = pin.getBoundingClientRect().top + scrollY;
    sizeCanvas();
    paint();
  }

  /* readouts */
  function distAt(j, t) {
    if (t <= 0) return STOPS[j];
    const a = Math.log10(Math.max(1, STOPS[j]));
    const b = Math.log10(STOPS[j + 1]);
    return Math.pow(10, a + (b - a) * t);
  }
  const fmt = (n, d = 0) => n.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });
  function fmtDist(km) {
    if (km < 1) return '0 km';
    if (km < 1e6) return fmt(km) + ' km';
    if (km < 1e9) return fmt(km / 1e6, 1) + ' million km';
    const ly = km / LY;
    if (ly < 0.05) return fmt(km / 1e9, 1) + ' billion km';
    if (ly < 10) return fmt(ly, 2) + ' light years';
    if (ly < 1e6) return fmt(ly) + ' light years';
    return fmt(ly / 1e6, 1) + ' million light years';
  }
  function fmtTime(km) {
    const s = km / 299792.458;
    if (s < 0.05) return '0 s';
    if (s < 60) return fmt(s, 1) + ' s';
    if (s < 3600) return Math.floor(s / 60) + ' min ' + Math.floor(s % 60) + ' s';
    if (s < 86400) return Math.floor(s / 3600) + ' h ' + Math.floor((s % 3600) / 60) + ' min';
    const y = s / 31557600;
    if (y < 1) return fmt(s / 86400) + ' days';
    if (y < 10) return fmt(y, 2) + ' years';
    if (y < 1e6) return fmt(y) + ' years';
    return fmt(y / 1e6, 1) + ' million years';
  }

  let lastLogZ = 0;
  function paint() {
    if (still || !S.length) return;
    const y = clamp(scrollY - pinTop, 0, 4 * dive + tail);
    let j = Math.min(3, Math.floor(y / dive));
    let u = (y - j * dive) / dive;
    if (y >= 4 * dive) { j = 3; u = 1; }
    const t = smooth(seg(u, 0.06, 0.8));
    const z = Math.pow(S[j], t);

    const M = [];
    M[j] = about(z, O[j]);
    M[j + 1] = comp2(M[j], about(1 / S[j], O[j]));
    if (j + 2 <= 4) M[j + 2] = comp2(M[j + 1], about(1 / S[j + 1], O[j + 1]));

    layers.forEach((l, k) => {
      const m = M[k];
      const show = m && !(k === j && t >= 1) && m.a > 0.004;
      l.style.visibility = show ? 'visible' : 'hidden';
      if (show) l.style.transform = `matrix(${m.a},0,0,${m.a},${m.x},${m.y})`;
    });
    copies.forEach((c, k) => {
      let o = 0;
      if (k < j) o = 0;
      else if (k === j) o = 1 - smooth(seg(u, 0.06, 0.26));
      else if (k === j + 1) o = smooth(seg(u, 0.7, 0.94));
      c.style.opacity = o.toFixed(3);
      c.style.visibility = o > 0.002 ? 'visible' : 'hidden';
    });

    const km = distAt(j, t);
    roDist.textContent = fmtDist(km);
    roTime.textContent = fmtTime(km);
    roPass.textContent = t > 0.55 ? NAMES[j + 1] : NAMES[j];
    hudBar.style.transform = `scaleX(${clamp(y / (4 * dive), 0, 1).toFixed(4)})`;
    poster.setAttribute('aria-disabled', String(y > 4));

    let logZ = Math.log(z);
    for (let i = 0; i < j; i++) logZ += Math.log(S[i]);
    cv.style.opacity = (STAR_ALPHA[j] + (STAR_ALPHA[j + 1] - STAR_ALPHA[j]) * t).toFixed(3);
    drawStars(logZ - lastLogZ, OS[j]);
    lastLogZ = logZ;
  }

  /* ---------- Starfield: three depths, pushed outward by the zoom ---------- */
  const cv = document.getElementById('stars');
  const ctx = cv.getContext('2d');
  const DEPTH = [
    { d: 0.35, r: 0.55, a: 0.4, c: '154,172,196' },
    { d: 0.65, r: 0.85, a: 0.65, c: '232,238,248' },
    { d: 1.0, r: 1.25, a: 0.95, c: '255,244,216' },
  ];
  // the stars are light added to the ground: strongest on night grounds, faint on the gold and teal ones
  const STAR_ALPHA = [1, 0.3, 0.75, 0.3, 1];
  let stars = [];
  let dpr = 1;
  function sizeCanvas() {
    dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    if (!stars.length || stars.W !== W || stars.H !== H) {
      stars = [];
      const n = Math.round(clamp(W * H / 5200, 70, 210));
      for (let i = 0; i < n; i++) {
        const L = DEPTH[i % 7 === 0 ? 2 : i % 2];
        stars.push({ x: Math.random() * W, y: Math.random() * H, L, k: 0.6 + Math.random() * 0.8 });
      }
      stars.W = W; stars.H = H;
    }
  }
  function respawn(s) {
    s.x = Math.random() * W;
    s.y = Math.random() * H;
    s.fresh = true;
  }
  function drawStars(dLog, o) {
    if (!o) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    const floor = H - (parseFloat(getComputedStyle(root).getPropertyValue('--hud-h')) || 56);
    for (const s of stars) {
      const f = Math.exp(dLog * s.L.d * 0.85);
      const px = s.x, py = s.y;
      s.x = o.x + (s.x - o.x) * f;
      s.y = o.y + (s.y - o.y) * f;
      const off = s.x < -20 || s.x > W + 20 || s.y < -20 || s.y > H + 20;
      const near = Math.hypot(s.x - o.x, s.y - o.y) < 2;
      if ((off && dLog > 0) || (near && dLog < 0)) { respawn(s); continue; }
      if (s.y > floor) continue;
      const len = s.fresh ? 0 : Math.hypot(s.x - px, s.y - py);
      s.fresh = false;
      const rad = s.L.r * s.k;
      if (len > 1.5) {
        ctx.strokeStyle = `rgba(${s.L.c},${s.L.a})`;
        ctx.lineWidth = rad;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(px + (s.x - px) * Math.max(0, 1 - 90 / len), py + (s.y - py) * Math.max(0, 1 - 90 / len));
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(${s.L.c},${s.L.a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, rad, 0, Math.PI * 2);
        ctx.fill();
        if (s.L.d === 1 && s.k > 1.1) {
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, rad * 5);
          g.addColorStop(0, `rgba(${s.L.c},0.22)`);
          g.addColorStop(1, `rgba(${s.L.c},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(s.x, s.y, rad * 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; paint(); });
  }, { passive: true });

  let rz = 0;
  addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(measure); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  rm.addEventListener('change', e => {
    still = e.matches;
    root.classList.toggle('still', still);
    measure();
  });
  measure();

  /* ---------- Eight lights (gallery-contact-sheet) ---------- */
  const PLATES = [
    ['The Moon', '384,400 km', '1.3 seconds old', 'The closest thing in the night sky. Moonlight is a little over one second old when it reaches you.'],
    ['The Sun', '149.6 million km', '8 min 19 s old', 'Every sunrise you have watched was already eight minutes old when it reached you.'],
    ['Saturn', '1.2 to 1.7 billion km', '66 to 92 min old', 'Its distance changes through the year as Earth and Saturn each go round the Sun.'],
    ['Proxima Centauri', '4.24 light years', '4.24 years old', 'The nearest star after the Sun. A small red dwarf, too faint to see without a telescope.'],
    ['Sirius', '8.6 light years', '8.6 years old', "The brightest star in the night sky. Follow Orion's belt down and to the left on a northern winter night."],
    ['The Pleiades', 'About 444 light years', 'About 444 years old', 'A cluster of young stars. Most people can pick out six or seven of them by eye.'],
    ['The galactic centre', 'About 26,000 light years', 'About 26,000 years old', 'Hidden behind dust from here. Astronomers watch it in infrared and radio instead.'],
    ['Andromeda', '2.5 million light years', '2.5 million years old', 'The farthest thing most people can see with their own eyes, as a faint smudge on a dark night.'],
  ];
  const plates = [...document.querySelectorAll('.plate')];
  const pName = document.getElementById('pName');
  const pDist = document.getElementById('pDist');
  const pAge = document.getElementById('pAge');
  const pLine = document.getElementById('pLine');
  plates.forEach(b => b.addEventListener('click', () => {
    const i = +b.dataset.p;
    plates.forEach(p => p.setAttribute('aria-pressed', String(p === b)));
    [pName.textContent, pDist.textContent, pAge.textContent, pLine.textContent] = PLATES[i];
  }));

  /* ---------- Hold a seat (contact-booking-hours dialog) ---------- */
  const dlg = document.getElementById('seat');
  const form = document.getElementById('seatForm');
  const mail = document.getElementById('f-mail');
  const mailErr = document.getElementById('mailErr');
  const done = document.getElementById('done');
  const fields = form.querySelector('.fields');
  const acts = form.querySelector('.acts');
  let opener = null;
  function resetForm() {
    form.reset();
    fields.hidden = false; acts.hidden = false; done.hidden = true;
    mailErr.hidden = true; mail.removeAttribute('aria-invalid');
  }
  document.querySelectorAll('[data-open-seat]').forEach(b => b.addEventListener('click', () => {
    opener = b;
    resetForm();
    dlg.showModal();
  }));
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  form.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => dlg.close()));
  dlg.addEventListener('close', () => { if (opener) opener.focus(); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!mail.value || !mail.checkValidity()) {
      mailErr.hidden = false;
      mail.setAttribute('aria-invalid', 'true');
      mail.setAttribute('aria-describedby', 'mailErr');
      mail.focus();
      return;
    }
    const night = form.night.value;
    done.textContent = `Not sent yet: this form is not connected to the box office, so your ${night} request stayed on this page.`;
    fields.hidden = true; acts.hidden = true; done.hidden = false;
    setTimeout(() => { if (dlg.open) dlg.close(); }, 3200);
  });

  /* ---------- Entry fades and back to top ---------- */
  const reveal = document.querySelectorAll('.sheet-left, .sheet-cap, .visit-left, .visit-right');
  if (!still && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.2 });
    reveal.forEach((el, i) => { el.classList.add('reveal'); el.style.transitionDelay = (i % 2) * 80 + 'ms'; io.observe(el); });
  }
  document.getElementById('topBtn').addEventListener('click', () => {
    scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' });
  });
})();
