/* Pocketplan · Designed using Design Lounge (https://designlounge.vercel.app) */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(pointer: fine)').matches;
  const isWide = () => innerWidth >= 768;

  document.documentElement.classList.add('js');

  /* ---------- entry reveals ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach((el) => revealIO.observe(el));

  /* ---------- navbar-island-morph ---------- */
  const island = $('#island');
  const toggle = $('#island-toggle');
  const scrim = $('#scrim');
  const here = $('#here');
  const layers = {
    full: $('.l-full', island),
    compact: $('.l-compact', island),
    nudge: $('.l-nudge', island),
    menu: $('.l-menu', island),
  };
  let islandState = '';
  let nudgeTimer = 0;

  const baseState = () => (!isWide() || scrollY > 140 ? 'compact' : 'full');

  function setIsland(s) {
    if (s === islandState) return;
    islandState = s;
    island.dataset.s = s;
    Object.entries(layers).forEach(([k, el]) => { el.inert = k !== s; });
    const open = s === 'menu';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    scrim.classList.toggle('on', open);
  }

  function openMenu() {
    const links = $$('.l-menu li', island).length;
    island.style.setProperty('--mh', (52 + 4 + links * 52 + (links - 1) * 4 + 12) + 'px');
    setIsland('menu');
    setTimeout(() => { const a = $('.l-menu a', island); if (a) a.focus({ preventScroll: true }); }, RM ? 0 : 220);
  }
  function closeMenu(focusToggle) {
    setIsland(baseState());
    if (focusToggle) toggle.focus({ preventScroll: true });
  }

  toggle.addEventListener('click', () => (islandState === 'menu' ? closeMenu(true) : openMenu()));
  scrim.addEventListener('click', () => closeMenu(false));
  $$('.l-menu a', island).forEach((a) => a.addEventListener('click', () => closeMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && islandState === 'menu') closeMenu(true);
    if (e.key === 'Escape' && islandState === 'nudge') setIsland(baseState());
  });
  $('#nudge-ok').addEventListener('click', () => { clearTimeout(nudgeTimer); setIsland(baseState()); });

  setIsland(baseState());

  const firstCard = $('.c-plan');
  let nudged = false;
  new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (!e.isIntersecting || nudged || islandState === 'menu') return;
      nudged = true;
      obs.disconnect();
      setTimeout(() => {
        if (islandState === 'menu') return;
        setIsland('nudge');
        nudgeTimer = setTimeout(() => { if (islandState === 'nudge') setIsland(baseState()); }, 5200);
      }, 600);
    });
  }, { threshold: 0.35 }).observe(firstCard);

  const sectionNames = { top: 'The week', how: 'How it works', inside: 'Inside', pricing: 'Pricing', faq: 'Questions' };
  const fullLinks = $$('.l-full a', island);
  const sectionIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      here.textContent = sectionNames[id] || 'The week';
      fullLinks.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + id)));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(sectionNames).forEach((id) => { const el = document.getElementById(id); if (el) sectionIO.observe(el); });

  /* ---------- hero: headline chip ---------- */
  const tickChip = $('.tick-chip');
  if (RM) { tickChip.classList.add('in', 'ticked'); }
  else {
    setTimeout(() => tickChip.classList.add('in'), 450);
    setTimeout(() => tickChip.classList.add('ticked'), 1250);
  }

  /* ---------- hero-product-window-tilt ---------- */
  const stageWrap = $('#stage-wrap');
  const stage = $('#stage');
  const win = $('#win');
  let stageScale = 1;

  function fitStage() {
    const cs = getComputedStyle(stage);
    const W = parseFloat(cs.getPropertyValue('--ww')) || 1000;
    const H = parseFloat(cs.getPropertyValue('--wh')) || 560;
    const overhang = isWide() ? 140 : 0;
    const avail = stageWrap.clientWidth;
    stageScale = Math.min(1, avail / (W + overhang));
    stage.style.setProperty('--s', stageScale.toFixed(4));
    stageWrap.style.setProperty('--sh', Math.round(H * stageScale + (isWide() ? 40 : 24)));
  }
  fitStage();
  requestAnimationFrame(() => requestAnimationFrame(() => win.classList.add('in')));

  const REST = { x: 6, y: -3 };
  const cur = { x: REST.x, y: REST.y };
  const tgt = { x: REST.x, y: REST.y };
  let tiltRaf = 0;
  let tiltOn = false;

  function tiltStep() {
    cur.x += (tgt.x - cur.x) * 0.09;
    cur.y += (tgt.y - cur.y) * 0.09;
    win.style.setProperty('--rx', cur.x.toFixed(2) + 'deg');
    win.style.setProperty('--ry', cur.y.toFixed(2) + 'deg');
    tiltRaf = (Math.abs(tgt.x - cur.x) > 0.01 || Math.abs(tgt.y - cur.y) > 0.01) ? requestAnimationFrame(tiltStep) : 0;
  }
  function kick() { if (!tiltRaf) tiltRaf = requestAnimationFrame(tiltStep); }

  function updateTiltMode() {
    const want = FINE && !RM && isWide();
    if (want === tiltOn) return;
    tiltOn = want;
    if (!tiltOn) {
      cancelAnimationFrame(tiltRaf); tiltRaf = 0;
      win.style.removeProperty('--rx'); win.style.removeProperty('--ry');
      cur.x = tgt.x = REST.x; cur.y = tgt.y = REST.y;
    }
  }
  updateTiltMode();

  addEventListener('pointermove', (e) => {
    if (!tiltOn) return;
    const r = stageWrap.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const H = (parseFloat(getComputedStyle(stage).getPropertyValue('--wh')) || 560) * stageScale;
    const nx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2), -1, 1);
    const ny = clamp((e.clientY - (r.top + H / 3)) / (H / 2), -1, 1);
    tgt.x = clamp(2 - ny * 6, -8, 8);
    tgt.y = nx * 8;
    kick();
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => {
    if (!tiltOn) return;
    tgt.x = REST.x; tgt.y = REST.y; kick();
  });

  /* tasks moving inside the window */
  const board = $('#board');
  const tMove = $('#t-move');
  const tTick = $('#t-tick');
  const tNew = $('#t-new');
  const tNewText = $('#t-new-text');
  const colMon = $('.col[data-day="mon"]', board);
  const colWed = $('#col-wed');
  const count = $('#w-count');
  const bar = $('#w-bar');
  const toast = $('#toast');
  const toastText = $('#toast-text');
  const toastGo = $('#toast-go');
  const TOAST_START = toastText.textContent;

  let heroVisible = true;
  new IntersectionObserver((entries) => { heroVisible = entries[0].isIntersecting; }, { threshold: 0.05 }).observe(stageWrap);

  function sleep(ms) {
    return new Promise((resolve) => {
      let left = ms;
      const step = () => {
        if (!heroVisible || document.hidden) { setTimeout(step, 250); return; }
        if (left <= 0) { resolve(); return; }
        const d = Math.min(left, 100);
        left -= d;
        setTimeout(step, d);
      };
      step();
    });
  }

  function setCount(done, total) {
    count.textContent = done + ' of ' + total + ' done';
    bar.style.setProperty('--p', (done / total).toFixed(4));
  }

  function flip(mutate) {
    const tasks = $$('.task', board);
    const first = new Map(tasks.map((t) => [t, { x: t.offsetLeft, y: t.offsetTop }]));
    mutate();
    tasks.forEach((t) => {
      if (t.offsetParent === null) return;
      const f = first.get(t);
      const dx = f.x - t.offsetLeft;
      const dy = f.y - t.offsetTop;
      if (!dx && !dy) return;
      t.style.transition = 'none';
      t.style.translate = dx + 'px ' + dy + 'px';
      void t.offsetWidth;
      t.style.transition = '';
      t.style.transitionProperty = 'translate, transform, box-shadow';
      t.style.transitionDuration = '640ms, 520ms, 320ms';
      t.style.transitionTimingFunction = 'cubic-bezier(0.16, 1, 0.3, 1)';
      t.style.translate = '0px 0px';
    });
  }

  async function typeInto(el, text) {
    el.textContent = '';
    for (const ch of text) {
      el.textContent += ch;
      await sleep(45 + Math.random() * 50);
    }
  }

  function resetBoard() {
    flip(() => {
      colMon.appendChild(tMove);
      tMove.classList.remove('moved', 'lift');
      tTick.classList.remove('done');
      tNew.classList.remove('show', 'typed');
      tNewText.textContent = '';
    });
    setCount(5, 11);
    toast.classList.remove('ok');
    toastText.textContent = TOAST_START;
  }

  async function taskLoop() {
    await sleep(2000);
    for (;;) {
      tTick.classList.add('done');
      setCount(6, 11);
      await sleep(1500);

      toastGo.classList.add('press');
      await sleep(320);
      toastGo.classList.remove('press');
      tMove.classList.add('lift');
      await sleep(260);
      flip(() => colWed.insertBefore(tMove, tNew));
      toastText.textContent = 'Moved to Wednesday. Kofi has it today.';
      toast.classList.add('ok');
      await sleep(700);
      tMove.classList.remove('lift');
      tMove.classList.add('moved');
      await sleep(1400);

      tNew.classList.add('show');
      await sleep(300);
      await typeInto(tNewText, 'Ring the egg farm');
      tNew.classList.add('typed');
      setCount(6, 12);
      await sleep(3600);

      resetBoard();
      await sleep(1800);
    }
  }
  if (!RM) taskLoop();

  /* ---------- stacking-cards-scroll ---------- */
  const stack = $('#stack');
  const cards = $$('.card', stack);
  const scrollDriven = CSS.supports('animation-timeline: view()');
  let stackFallback = false;
  if (!scrollDriven && !RM) {
    stackFallback = true;
    cards.slice(0, -1).forEach((c) => { c.style.animation = 'recede 1s linear both paused'; });
  }
  function updateStack() {
    const r = stack.getBoundingClientRect();
    const p = -r.top / r.height;
    cards.slice(0, -1).forEach((c, i) => {
      const t = clamp(p * cards.length - i, 0, 1);
      c.style.animationDelay = (-t * 0.999) + 's';
    });
  }

  const liveIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('live'); liveIO.unobserve(e.target); }
    });
  }, { threshold: 0.55 });
  cards.forEach((c) => liveIO.observe(c));

  /* ---------- features-tabbed-preview ---------- */
  const tabsRoot = $('#tabs-root');
  const tabs = $$('[role="tab"]', tabsRoot);
  const panes = $$('[role="tabpanel"]', tabsRoot);
  const big = $('#big');
  const ctrlBtn = $('#ctrl-btn');
  const ctrlLabel = $('#ctrl-label');
  const tablist = $('.tabs', tabsRoot);
  let tabCur = 0;
  let autoPaused = RM || innerWidth < 640;

  function syncCtrl() {
    tabsRoot.classList.toggle('paused', autoPaused);
    ctrlBtn.setAttribute('aria-pressed', String(autoPaused));
    ctrlBtn.setAttribute('aria-label', autoPaused ? 'Resume autoplay' : 'Pause autoplay');
    ctrlLabel.textContent = autoPaused ? 'Paused' : 'Autoplay';
  }

  function showTab(i, focus) {
    tabCur = (i + tabs.length) % tabs.length;
    tabs.forEach((t, k) => {
      const on = k === tabCur;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const b = $('.tbar i', t);
      b.style.animation = 'none'; void b.offsetWidth; b.style.animation = '';
    });
    panes.forEach((p, k) => {
      const on = k === tabCur;
      p.classList.toggle('on', on);
      p.inert = !on;
      if (on) {
        $$('*', p).forEach((n) => { if (n.getAnimations) n.getAnimations().forEach((a) => { a.cancel(); a.play(); }); });
      }
    });
    big.textContent = String(tabCur + 1).padStart(2, '0');
    const t = tabs[tabCur];
    if (tablist.scrollWidth > tablist.clientWidth) {
      tablist.scrollTo({ left: t.offsetLeft - 20, behavior: RM ? 'auto' : 'smooth' });
    }
    if (focus) t.focus({ preventScroll: true });
  }

  tabs.forEach((t, k) => {
    t.addEventListener('click', () => showTab(k, false));
    $('.tbar i', t).addEventListener('animationend', () => { if (!autoPaused && k === tabCur) showTab(tabCur + 1, false); });
  });
  tablist.addEventListener('keydown', (e) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (e.key in keys) { e.preventDefault(); showTab(tabCur + keys[e.key], true); }
    else if (e.key === 'Home') { e.preventDefault(); showTab(0, true); }
    else if (e.key === 'End') { e.preventDefault(); showTab(tabs.length - 1, true); }
  });
  ctrlBtn.addEventListener('click', () => { autoPaused = !autoPaused; syncCtrl(); });
  new IntersectionObserver((entries) => {
    tabsRoot.classList.toggle('offscreen', !entries[0].isIntersecting);
  }, { threshold: 0.2 }).observe(tabsRoot);
  panes.forEach((p, k) => { p.inert = k !== 0; });
  syncCtrl();

  /* ---------- magnetic-buttons (the one primary) ---------- */
  if (FINE && !RM) {
    const mags = $$('.mag');
    const R = 80, MAX = 10;
    let px = -1e4, py = -1e4, raf = 0;
    const update = () => {
      raf = 0;
      mags.forEach((el) => {
        const r = el.getBoundingClientRect();
        const nx = clamp(px, r.left, r.right), ny = clamp(py, r.top, r.bottom);
        const d = Math.hypot(px - nx, py - ny);
        if (d < R && document.activeElement !== el) {
          const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          el.style.setProperty('--ox', ((px - cx) / (r.width / 2 + R) * MAX).toFixed(2) + 'px');
          el.style.setProperty('--oy', ((py - cy) / (r.height / 2 + R) * MAX).toFixed(2) + 'px');
          el.classList.add('near');
        } else if (el.classList.contains('near')) {
          el.classList.remove('near');
          el.style.setProperty('--ox', '0px');
          el.style.setProperty('--oy', '0px');
        }
      });
    };
    document.addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { px = py = -1e4; if (!raf) raf = requestAnimationFrame(update); });
  }

  /* ---------- pricing-annual-toggle-roll ---------- */
  const pricing = $('#pricing');
  const billBtns = $$('#bill button');
  const priceLive = $('#price-live');
  const odos = $$('.odo', pricing);
  const plans = $$('.plan', pricing);

  odos.forEach((o) => {
    const len = Math.max(o.dataset.m.length, o.dataset.a.length);
    for (let i = 0; i < len; i++) {
      const col = document.createElement('span');
      col.className = 'col';
      const strip = document.createElement('span');
      strip.className = 'strip';
      strip.style.setProperty('--i', i);
      for (let d = 0; d < 10; d++) { const s = document.createElement('span'); s.textContent = d; strip.append(s); }
      col.append(strip);
      o.append(col);
    }
  });

  function paintPrices(mode, animate) {
    odos.forEach((o) => {
      const v = (mode === 'a' ? o.dataset.a : o.dataset.m);
      const strips = $$('.strip', o);
      const padded = v.padStart(strips.length, '0');
      strips.forEach((s, i) => {
        if (!animate) s.style.transition = 'none';
        s.style.setProperty('--d', padded[i]);
      });
      if (!animate) { void o.offsetWidth; strips.forEach((s) => { s.style.transition = ''; }); }
    });
  }

  function setBilling(mode, animate = true) {
    if (pricing.dataset.b === mode) return;
    pricing.dataset.b = mode;
    billBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.b === mode)));
    paintPrices(mode, animate);
    const names = plans.map((p) => $('h3', p).textContent);
    const vals = odos.map((o) => '$' + (mode === 'a' ? o.dataset.a : o.dataset.m));
    priceLive.textContent = (mode === 'a' ? 'Annual billing, 2 months free: ' : 'Monthly billing: ')
      + names.map((n, i) => n + ' ' + vals[i]).join(', ') + ' per team per month.';
  }
  pricing.dataset.b = '';
  setBilling('m', false);
  priceLive.textContent = '';
  billBtns.forEach((b) => b.addEventListener('click', () => setBilling(b.dataset.b)));

  let pricingSeen = false;
  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting || pricingSeen) return;
    pricingSeen = true;
    obs.disconnect();
    setTimeout(() => setBilling('a', !RM), RM ? 0 : 450);
  }, { threshold: 0.35 }).observe($('.plans', pricing));

  /* ---------- faq-two-column-search ---------- */
  const FAQ = [
    ['How is Pocketplan different from a to-do app?', 'A to-do list has no days. Pocketplan is a week: five columns, one lane per person, and every task sits on the day it should happen. When Friday comes, the leftovers have somewhere to go.'],
    ['Do nudges ping people at night?', 'No. Each person sets quiet hours, <code>18:00 to 08:30</code> by default, in their own time zone. Weekends are off unless they turn them on. A nudge that lands during quiet hours waits until the morning.'],
    ['Can a task repeat?', 'Yes. Repeats can run every Monday, every other Friday, or on the 1st of the month. The owner can rotate between people, so the same person is not always cleaning the oven.'],
    ['What happens to unfinished tasks on Friday?', 'The Friday look-back lists them. Move each one into next week with one click, or drop it. Nothing silently rolls over.'],
    ['How many people can join a team?', 'Pocket is up to 3 people, Team is up to 12, and Studio is up to 40. Guests who only need to see the week can view it for free on every plan.'],
    ['Is there a free trial?', 'Every plan starts with 14 days free, and you do not need a card to start. If you do nothing at the end, the team drops to view-only and your week stays put.'],
    ['Can I bring tasks over from a spreadsheet?', 'Paste rows straight into the backlog. Pocketplan reads three columns: <code>title</code>, <code>day</code> and <code>owner</code>. Anything it cannot place lands in the backlog for you to drag.'],
    ['Does it work on a phone?', 'Yes. On a phone the week board shows three days at a time and swipes to the rest, and nudges arrive as notifications once you add Pocketplan to your home screen.'],
  ];
  const colA = $('#col-a'), colB = $('#col-b');
  const items = FAQ.map(([q, a], idx) => {
    const n = String(idx + 1).padStart(2, '0');
    const item = document.createElement('div');
    item.className = 'item' + (idx === 0 ? ' open' : '');
    item.innerHTML =
      '<h3><button class="q" type="button" id="q-' + n + '" aria-expanded="' + (idx === 0) + '" aria-controls="a-' + n + '">' +
      '<span class="n num">' + n + '</span><span class="t">' + q + '</span>' +
      '<svg class="ic" aria-hidden="true"><use href="#i-plus"/></svg></button></h3>' +
      '<div class="panel" id="a-' + n + '" role="region" aria-labelledby="q-' + n + '"><div><p>' + a + '</p></div></div>';
    const tmp = document.createElement('div');
    tmp.innerHTML = a;
    item.dataset.hay = (q + ' ' + tmp.textContent).toLowerCase();
    (idx % 2 === 0 ? colA : colB).append(item);
    const btn = $('.q', item);
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('open');
      item.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    return item;
  });
  const qInput = $('#q');
  const shown = $('#shown');
  const empty = $('#empty');
  function filter() {
    const t = qInput.value.trim().toLowerCase();
    let n = 0;
    items.forEach((el) => {
      const hit = !t || el.dataset.hay.includes(t);
      el.hidden = !hit;
      if (hit) n++;
    });
    shown.textContent = n;
    empty.classList.toggle('show', n === 0);
  }
  qInput.addEventListener('input', filter);
  $('#clear').addEventListener('click', () => { qInput.value = ''; filter(); qInput.focus(); });

  /* ---------- footer-giant-wordmark-reveal ---------- */
  const foot = $('#foot');
  const word = $('#word');
  function fitWord() {
    word.style.setProperty('--word', '200px');
    const cs = getComputedStyle(foot);
    const avail = foot.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    word.style.setProperty('--word', (200 * avail / word.scrollWidth).toFixed(1) + 'px');
  }
  function updateFoot() {
    const r = foot.getBoundingClientRect(), vh = innerHeight;
    const p = clamp((vh - r.top) / Math.max(1, Math.min(r.height, vh)), 0, 1);
    foot.style.setProperty('--p', p.toFixed(3));
  }
  fitWord();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fitWord(); fitStage(); });
  $('#replay').addEventListener('click', () => {
    const se = document.scrollingElement || document.documentElement;
    se.style.scrollBehavior = 'auto';
    scrollTo(0, foot.offsetTop - innerHeight + 80);
    updateFoot();
    setTimeout(() => {
      se.style.scrollBehavior = '';
      scrollTo({ top: se.scrollHeight, behavior: RM ? 'auto' : 'smooth' });
    }, 420);
  });

  /* ---------- one scroll + resize loop ---------- */
  let scrollRaf = 0;
  function onScroll() {
    scrollRaf = 0;
    if (islandState === 'full' || islandState === 'compact') setIsland(baseState());
    if (!RM) updateFoot();
    if (stackFallback) updateStack();
  }
  addEventListener('scroll', () => { if (!scrollRaf) scrollRaf = requestAnimationFrame(onScroll); }, { passive: true });
  let resizeT = 0;
  addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      fitStage(); fitWord(); updateTiltMode();
      if (islandState === 'full' || islandState === 'compact') setIsland(baseState());
      if (islandState === 'menu' && isWide() && scrollY < 140) closeMenu(false);
      onScroll();
    }, 120);
  });
  onScroll();
})();
