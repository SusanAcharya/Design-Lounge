(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const wide = matchMedia('(min-width: 1024px)');
  const phone = matchMedia('(max-width: 639px)');

  /* Header: hide on scroll down, reveal on scroll up (navbar-hide-on-scroll) */
  const head = document.querySelector('.site-head');
  const menuBtn = document.querySelector('.menu-btn');
  const panel = document.getElementById('panel');
  let lastY = scrollY, focusIn = false;
  const DELTA = 8;
  function onScroll() {
    const y = scrollY;
    const d = y - lastY;
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    if (y <= 0) { head.classList.remove('hide', 'lift'); lastY = y; return; }
    if (Math.abs(d) < DELTA) return;
    if (d > 0 && y > head.offsetHeight && !focusIn && !open) head.classList.add('hide');
    else if (d < 0) head.classList.remove('hide');
    head.classList.toggle('lift', !head.classList.contains('hide'));
    lastY = y;
  }
  addEventListener('scroll', onScroll, { passive: true });
  head.addEventListener('focusin', () => { focusIn = true; head.classList.remove('hide'); });
  head.addEventListener('focusout', () => { focusIn = false; });

  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.hidden = !open;
  }
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  panel.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && !panel.hidden) { setMenu(false); menuBtn.focus(); }
  });

  /* Scrollspy */
  const links = [...document.querySelectorAll('[data-link]')];
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(a => a.setAttribute('aria-current', a.dataset.link === en.target.id ? 'true' : 'false'));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  ['how', 'safeguards', 'walkthrough'].forEach(id => spy.observe(document.getElementById(id)));

  /* Hero window: scale to fit, tilt toward the pointer */
  const wrap = document.querySelector('.stage-wrap');
  const stage = document.querySelector('.stage');
  const win = document.querySelector('.win');
  function fit() {
    const w = phone.matches ? 600 : 1000;
    const pad = phone.matches ? 32 : 64;
    const vw = document.documentElement.clientWidth || innerWidth;
    const avail = Math.min(vw - pad, 1100);
    const s = Math.min(1, avail / w);
    wrap.style.setProperty('--s', s.toFixed(4));
  }
  fit();
  addEventListener('resize', fit);
  phone.addEventListener('change', fit);
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(document.documentElement);

  const REST = { x: 6, y: -3 };
  const cur = { ...REST }, tgt = { ...REST };
  let raf = 0;
  function tick() {
    cur.x += (tgt.x - cur.x) * 0.09;
    cur.y += (tgt.y - cur.y) * 0.09;
    win.style.setProperty('--rx', cur.x.toFixed(3) + 'deg');
    win.style.setProperty('--ry', cur.y.toFixed(3) + 'deg');
    if (Math.abs(tgt.x - cur.x) > 0.01 || Math.abs(tgt.y - cur.y) > 0.01) raf = requestAnimationFrame(tick);
    else raf = 0;
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  const hero = document.querySelector('.hero');
  hero.addEventListener('pointermove', e => {
    if (reduce.matches || phone.matches || e.pointerType === 'touch') return;
    const r = stage.getBoundingClientRect();
    const nx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2));
    const ny = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2));
    tgt.y = Math.max(-8, Math.min(8, nx * 8));
    tgt.x = Math.max(-8, Math.min(8, -ny * 8));
    kick();
  });
  hero.addEventListener('pointerleave', () => { tgt.x = REST.x; tgt.y = REST.y; kick(); });

  /* Steps: one invoice figure driven by data-step (features-sticky-scroll-steps) */
  const viz = document.querySelector('.viz');
  const steps = [...document.querySelectorAll('.step')];
  function setStep(n) {
    viz.dataset.step = String(n);
    steps.forEach(li => {
      const on = li.dataset.s === String(n);
      li.classList.toggle('on', on);
      li.querySelector('.num').setAttribute('aria-current', on ? 'step' : 'false');
    });
  }
  const stepIO = new IntersectionObserver(entries => {
    if (!wide.matches) return;
    entries.forEach(en => { if (en.isIntersecting) setStep(en.target.dataset.s); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  steps.forEach(li => {
    stepIO.observe(li);
    li.querySelector('.num').addEventListener('click', () => {
      setStep(li.dataset.s);
      if (wide.matches) li.scrollIntoView({ block: 'center', behavior: reduce.matches ? 'auto' : 'smooth' });
      else viz.scrollIntoView({ block: 'nearest', behavior: reduce.matches ? 'auto' : 'smooth' });
    });
  });
  /* Stacked layouts show the invoice at its match, the step the page is about */
  if (!wide.matches) setStep(3);
  wide.addEventListener('change', () => setStep(wide.matches ? 1 : 3));

  /* Tabs with autoplay (features-tabbed-preview) */
  const sec = document.querySelector('.tabs-sec');
  const tabs = [...sec.querySelectorAll('[role="tab"]')];
  const panes = [...sec.querySelectorAll('[role="tabpanel"]')];
  const pauseBtn = sec.querySelector('.pause');
  const label = pauseBtn.querySelector('.pause-label');
  let paused = reduce.matches || phone.matches;

  function select(i, focus) {
    tabs.forEach((t, k) => {
      const on = k === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      // restart the hairline
      const bar = t.querySelector('.prog i');
      bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
    });
    panes.forEach((p, k) => {
      const on = k === i;
      p.classList.toggle('on', on);
      if (on) p.hidden = false;
      else setTimeout(() => { if (!p.classList.contains('on')) p.hidden = true; }, reduce.matches ? 0 : 420);
    });
    if (focus) tabs[i].focus();
  }
  function setPaused(p) {
    paused = p;
    sec.classList.toggle('paused', p);
    pauseBtn.setAttribute('aria-pressed', String(p));
    pauseBtn.setAttribute('aria-label', p ? 'Resume autoplay' : 'Pause autoplay');
    label.textContent = p ? 'Paused' : 'Autoplay';
  }
  setPaused(paused);
  pauseBtn.addEventListener('click', () => setPaused(!paused));
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i, false));
    t.querySelector('.prog i').addEventListener('animationend', () => {
      if (!paused && t.getAttribute('aria-selected') === 'true') select((i + 1) % tabs.length, false);
    });
    t.addEventListener('keydown', e => {
      const n = tabs.length;
      let j = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') j = (i + 1) % n;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') j = (i - 1 + n) % n;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = n - 1;
      if (j !== null) { e.preventDefault(); select(j, true); }
    });
  });
  phone.addEventListener('change', () => { if (phone.matches) setPaused(true); });
})();
