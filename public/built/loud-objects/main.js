/* Loud Objects · Designed using Design Lounge (https://www.designlounge.live) */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const span = (t, a, b) => clamp((t - a) / (b - a));
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => reduceMQ.matches;
  const body = document.body;

  requestAnimationFrame(() => requestAnimationFrame(() => body.classList.remove('preload')));

  /* ---------- Phone menu: hamburger-circle-reveal ---------- */
  const burger = $('.burger');
  const menu = $('#menu');
  const main = $('main');
  const foot = $('.foot');
  const menuLinks = $$('a', menu);
  let isOpen = false;

  function geometry() {
    const b = burger.getBoundingClientRect();
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;
    const r = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
    menu.style.setProperty('--cx', cx + 'px');
    menu.style.setProperty('--cy', cy + 'px');
    menu.style.setProperty('--r', Math.ceil(r) + 'px');
  }

  function setOpen(open, { focusButton = true } = {}) {
    if (open === isOpen) return;
    isOpen = open;
    if (open) geometry();
    body.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    main.inert = open;
    foot.inert = open;
    if (open) {
      setTimeout(() => { if (isOpen) menuLinks[0].focus(); }, reduced() ? 0 : 200);
    } else if (focusButton) {
      burger.focus();
    }
  }

  burger.addEventListener('click', () => setOpen(!isOpen));

  menu.addEventListener('click', (e) => {
    const a = e.target.closest('.links a');
    if (!a) return;
    menuLinks.forEach((x) => x.removeAttribute('aria-current'));
    a.setAttribute('aria-current', 'page');
    setOpen(false, { focusButton: false });
  });

  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return; }
    if (e.key !== 'Tab') return;
    const list = [burger, ...menuLinks];
    const i = list.indexOf(document.activeElement);
    if (i === -1) { e.preventDefault(); burger.focus(); return; }
    if (e.shiftKey && i === 0) { e.preventDefault(); list[list.length - 1].focus(); }
    else if (!e.shiftKey && i === list.length - 1) { e.preventDefault(); list[0].focus(); }
  });

  matchMedia('(min-width: 768px)').addEventListener('change', (e) => { if (e.matches) setOpen(false, { focusButton: false }); });
  addEventListener('resize', () => { if (isOpen) geometry(); });

  /* ---------- Hero: kinetic-type-marquee ---------- */
  const narrowMQ = matchMedia('(max-width: 639px)');
  const rows = $$('.k-row').map((el) => ({
    el,
    track: $('.k-track', el),
    copy: $('.k-copy', el),
    dir: el.dataset.dir === 'right' ? -1 : 1,
    speed: Number(el.dataset.speed),
    x: 0, v: 0, w: 0,
    slow: false,
  }));
  const base = (r) => (narrowMQ.matches ? r.speed / 2 : r.speed);

  function syncFocusable() {
    rows.forEach((r) => {
      if (narrowMQ.matches) { r.el.removeAttribute('tabindex'); r.slow = false; }
      else r.el.tabIndex = 0;
    });
  }
  syncFocusable();
  narrowMQ.addEventListener('change', syncFocusable);

  rows.forEach((r) => {
    r.v = base(r);
    if (r.dir === -1) r.x = 0;
    const measure = () => { r.w = r.copy.offsetWidth; };
    measure();
    new ResizeObserver(measure).observe(r.copy);
    r.el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse' && !narrowMQ.matches) r.slow = true; });
    r.el.addEventListener('pointerleave', () => { if (document.activeElement !== r.el) r.slow = false; });
    r.el.addEventListener('focus', () => { if (!narrowMQ.matches) r.slow = true; });
    r.el.addEventListener('blur', () => { r.slow = false; });
  });
  document.fonts.ready.then(() => rows.forEach((r) => { r.w = r.copy.offsetWidth; }));

  let marqueeVisible = true;
  let marqueeRunning = false;
  let last = performance.now();

  function frame(now) {
    if (!marqueeVisible || reduced()) { marqueeRunning = false; return; }
    const dt = Math.min(48, now - last) / 1000;
    last = now;
    for (const r of rows) {
      const target = r.slow ? base(r) * 0.25 : base(r);
      r.v += (target - r.v) * 0.06;
      r.x -= r.dir * r.v * dt;
      if (r.w > 0) r.x = ((r.x % r.w) + r.w) % r.w - r.w;
      r.track.style.transform = `translate3d(${r.x.toFixed(2)}px,0,0)`;
    }
    requestAnimationFrame(frame);
  }
  function startMarquee() {
    if (marqueeRunning || reduced()) return;
    marqueeRunning = true;
    last = performance.now();
    requestAnimationFrame(frame);
  }
  new IntersectionObserver((entries) => {
    marqueeVisible = entries[0].isIntersecting;
    if (marqueeVisible) startMarquee();
  }).observe($('.kinetic'));
  reduceMQ.addEventListener('change', () => {
    if (reduced()) rows.forEach((r) => { r.track.style.transform = ''; });
    else startMarquee();
  });

  /* ---------- Manifesto: text-mask-scroll-reveal ---------- */
  const runway = $('.runway');
  const stage = $('.stage', runway);
  const knock = $('.knock', runway);
  const maskWord = $('#knock-word');
  const solidWord = $('.knock .solid');
  const knockRects = $$('.knock-rect', knock);
  const stageMeta = $('.stage-meta', runway);
  const over = $('.over', runway);
  let W = 0, H = 0, ox = 0, oy = 0, maxScale = 30;

  function measureMask() {
    W = knock.clientWidth || innerWidth;
    H = knock.clientHeight || innerHeight;
    knock.setAttribute('viewBox', `0 0 ${W} ${H}`);
    knockRects.forEach((r) => { r.setAttribute('width', W); r.setAttribute('height', H); });
    const fs = W * (W < 640 ? 0.28 : 0.26);
    [maskWord, solidWord].forEach((t) => {
      t.setAttribute('font-size', fs.toFixed(1));
      t.setAttribute('x', (W / 2).toFixed(1));
      t.setAttribute('y', (H / 2 + fs * 0.36).toFixed(1));
    });
    let ext;
    try { ext = maskWord.getExtentOfChar(0); } catch (err) { ext = null; }
    ox = ext ? ext.x + ext.width * 0.29 : W * 0.2;
    oy = H / 2;
    const halfStem = fs * 0.09;
    const halfCap = fs * 0.3;
    maxScale = Math.max(Math.max(ox, W - ox) / halfStem, Math.max(oy, H - oy) / halfCap) * 1.15;
    updateMask();
  }

  function updateMask() {
    if (reduced()) {
      knock.setAttribute('viewBox', `0 0 ${W} ${H}`);
      knock.style.opacity = '';
      knock.style.visibility = '';
      over.style.opacity = '';
      over.style.transform = '';
      return;
    }
    const r = runway.getBoundingClientRect();
    const travel = runway.offsetHeight - innerHeight;
    if (travel <= 0) return;
    const t = clamp(-r.top / travel);
    const grow = Math.pow(span(t, 0.04, 0.6), 3);
    const s = Math.exp(Math.log(maxScale) * grow);
    knock.setAttribute('viewBox', `${(ox - ox / s).toFixed(3)} ${(oy - oy / s).toFixed(3)} ${(W / s).toFixed(3)} ${(H / s).toFixed(3)}`);
    knock.style.opacity = String(1 - span(t, 0.58, 0.64));
    knock.style.visibility = t > 0.64 ? 'hidden' : '';
    stageMeta.style.opacity = String(1 - span(t, 0, 0.06));
    const o = 1 - Math.pow(1 - span(t, 0.64, 0.82), 3);
    over.style.opacity = String(o);
    over.style.transform = `translateY(${((1 - o) * 48).toFixed(1)}px)`;
  }

  /* ---------- Footer: footer-giant-wordmark-reveal ---------- */
  const word = $('.word', foot);
  const letters = $$('span', word);
  word.style.setProperty('--k', (0.5 / (letters.length - 1)).toFixed(4));

  function fitWord() {
    word.style.setProperty('--word', '200px');
    const cs = getComputedStyle(foot);
    const avail = foot.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const w = word.scrollWidth || 1;
    word.style.setProperty('--word', (200 * avail / w).toFixed(1) + 'px');
  }

  function updateFoot() {
    if (reduced()) { foot.style.setProperty('--p', '1'); return; }
    const r = foot.getBoundingClientRect();
    const vh = innerHeight;
    const p = clamp((vh - r.top) / Math.max(1, Math.min(r.height, vh)));
    foot.style.setProperty('--p', p.toFixed(3));
  }

  $('.replay', foot).addEventListener('click', () => {
    const footTop = foot.getBoundingClientRect().top + scrollY;
    const smooth = !reduced();
    document.documentElement.style.scrollBehavior = 'auto';
    scrollTo(0, footTop - innerHeight + 80);
    updateFoot();
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = '';
      scrollTo({ top: document.documentElement.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    }, smooth ? 420 : 0);
  });

  /* ---------- One scroll listener, one rAF ---------- */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const rr = runway.getBoundingClientRect();
      if (rr.bottom > -100 && rr.top < innerHeight + 100) updateMask();
      updateFoot();
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { measureMask(); fitWord(); onScroll(); });
  reduceMQ.addEventListener('change', () => { measureMask(); onScroll(); });
  measureMask();
  fitWord();
  updateFoot();
  document.fonts.ready.then(() => { measureMask(); fitWord(); fitMail(); updateFoot(); });

  /* ---------- Contact: contact-giant-email-copy ---------- */
  const contact = $('.contact');
  const mail = $('.mail', contact);
  const mailT = $('.t', mail);
  const probe = $('.probe', contact);
  const chip = $('.chip', contact);
  const live = $('#live');
  const ADDRESS = 'hi@loudobjects.studio';
  const SHOWN = ADDRESS.toUpperCase();
  const COPIED = 'COPIED TO CLIPBOARD';
  const GLYPHS = '#%&*+=/\\<>[]{}?!0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let current = SHOWN;
  let holdTimer = 0;
  let scrambleRaf = 0;

  function sizeFor(str) {
    probe.textContent = str;
    const w = probe.getBoundingClientRect().width || 1;
    return Math.min(260, 200 * (mail.clientWidth / w));
  }
  function fitMail() {
    const size = Math.min(sizeFor(SHOWN), sizeFor(COPIED));
    mailT.style.fontSize = size.toFixed(1) + 'px';
  }
  fitMail();
  addEventListener('resize', fitMail);

  function scramble(target, dur) {
    cancelAnimationFrame(scrambleRaf);
    const from = current;
    current = target;
    if (reduced()) { mailT.textContent = target; return Promise.resolve(); }
    const n = target.length;
    const at = Array.from({ length: n }, (_, i) => (i / n) * dur * 0.7 + Math.random() * dur * 0.3);
    const start = performance.now();
    let lastPaint = 0;
    return new Promise((resolve) => {
      const step = (now) => {
        const el = now - start;
        if (now - lastPaint >= 48 || el >= dur) {
          lastPaint = now;
          let out = '';
          for (let i = 0; i < n; i++) {
            const ch = target[i];
            if (ch === ' ' || el >= at[i]) out += ch;
            else if (el < at[i] * 0.4 && from[i]) out += from[i];
            else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }
          mailT.textContent = out;
        }
        if (el < dur) scrambleRaf = requestAnimationFrame(step);
        else { mailT.textContent = target; resolve(); }
      };
      scrambleRaf = requestAnimationFrame(step);
    });
  }

  async function copyText(s) {
    try {
      await navigator.clipboard.writeText(s);
      return true;
    } catch (err) {
      const a = document.createElement('textarea');
      a.value = s;
      a.setAttribute('readonly', '');
      a.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(a);
      a.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
      a.remove();
      return ok;
    }
  }

  mail.addEventListener('click', async () => {
    const ok = await copyText(ADDRESS);
    clearTimeout(holdTimer);
    if (!ok) {
      live.textContent = `Copy failed. The address is ${ADDRESS}`;
      return;
    }
    live.textContent = `Copied ${ADDRESS} to clipboard`;
    contact.classList.add('flash');
    chip.textContent = 'Copied';
    scramble(COPIED, 720);
    holdTimer = setTimeout(() => {
      contact.classList.remove('flash');
      chip.textContent = 'Copy';
      scramble(SHOWN, 640);
    }, 720 + 1600);
  });

  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    mail.addEventListener('pointermove', (e) => {
      chip.style.left = e.clientX + 'px';
      chip.style.top = e.clientY + 'px';
      chip.classList.add('on');
    });
    mail.addEventListener('pointerleave', () => chip.classList.remove('on'));
  }

  /* ---------- Entry reveals ---------- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduced()) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }
})();
