/* Thulo Dhunga · Designed using Design Lounge (https://designlounge.vercel.app) */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
  const smooth = t => t * t * (3 - 2 * t);

  const root = document.documentElement;
  root.classList.add('js');
  const reducedMq = matchMedia('(prefers-reduced-motion: reduce)');
  const fineMq = matchMedia('(pointer: fine)');
  let reduced = reducedMq.matches;

  /* ---------- Cached layout ---------- */
  const bar = $('#bar');
  const hero = $('.hero');
  const heroTitle = $('#heroTitle');
  const layers = $$('.hero [data-speed]').map(el => ({ el, s: +el.dataset.speed, d: +el.dataset.depth }));
  const pin = $('#portal');
  const zoom = $('#zoom');
  const hallBig = $('#hallBig');
  const after = $('#after');
  const lift = $('#lift');
  const foot = $('#foot');
  const word = $('#word');

  let vw = innerWidth, vh = innerHeight, sy = scrollY;
  let pinTop = 0, pinLen = 1, S = 20;
  let footTop = 0, footH = 1;
  let px = 0, py = 0, tx = 0, ty = 0;
  let queued = false, heroDone = false, scrolled = null;

  function measure() {
    vw = innerWidth;
    vh = innerHeight;
    sy = scrollY;

    // Portal: measure with the transform removed, or the rects come back scaled.
    zoom.style.transform = 'none';
    const pr = pin.getBoundingClientRect();
    pinTop = pr.top + sy;
    pinLen = Math.max(1, pin.offsetHeight - vh);
    const z = zoom.getBoundingClientRect();
    const w = hallBig.getBoundingClientRect();
    const f = Math.min(w.width / 1100, w.height / 620);
    const ox = (w.width - 1100 * f) / 2;
    const oy = (w.height - 620 * f) / 2;
    const cx = w.left - z.left + ox + 550 * f;
    const cy = w.top - z.top + oy + 390 * f;
    const r = 92 * f;
    zoom.style.transformOrigin = `${cx}px ${cy}px`;
    const D = Math.hypot(Math.max(cx, z.width - cx), Math.max(cy, z.height - cy));
    S = 1.12 * D / Math.max(1, r);

    fitWord();
    const fr = foot.getBoundingClientRect();
    footTop = fr.top + sy;
    footH = Math.max(1, fr.height);

    heroDone = false;
    queue();
  }

  function fitWord() {
    word.style.setProperty('--word', '200px');
    const cs = getComputedStyle($('.foot-inner'));
    const avail = foot.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const width = word.scrollWidth || 1;
    word.style.setProperty('--word', (200 * Math.min(avail, 1200 * 1.1) / width).toFixed(1) + 'px');
  }

  /* ---------- One frame writer ---------- */
  function paint() {
    queued = false;

    const isScrolled = sy > 24;
    if (isScrolled !== scrolled) {
      scrolled = isScrolled;
      bar.classList.toggle('scrolled', isScrolled);
    }

    if (!reduced) {
      // Lead effect: layered parallax hero
      if (!heroDone || sy < vh * 1.2) {
        const k = vw <= 640 ? 0.6 : 1;
        const y = Math.min(sy, vh * 1.1) * k;
        tx += (px - tx) * 0.1;
        ty += (py - ty) * 0.1;
        for (const l of layers) {
          l.el.style.transform = `translate3d(${(tx * l.d).toFixed(2)}px, ${(y * (1 - l.s) + ty * l.d).toFixed(2)}px, 0)`;
        }
        heroTitle.style.opacity = Math.max(0, 1 - sy / (vh * 0.45)).toFixed(3);
        heroDone = sy >= vh * 1.2;
        if (Math.abs(px - tx) > 0.05 || Math.abs(py - ty) > 0.05) queue();
      }

      // Supporting effect: zoom through the hall window
      if (sy > pinTop - vh && sy < pinTop + pinLen + vh) {
        const p = seg(sy - pinTop, 0, pinLen);
        const t = smooth(seg(p, 0.04, 0.70));
        zoom.style.transform = `scale(${Math.pow(S, t).toFixed(4)})`;
        after.style.opacity = smooth(seg(p, 0.62, 0.72)).toFixed(3);
        const l = smooth(seg(p, 0.72, 0.90));
        lift.style.opacity = l.toFixed(3);
        lift.style.transform = `translateY(${((1 - l) * 32).toFixed(1)}px)`;
      }

      // Footer wordmark rise
      if (sy > footTop - vh - 50) {
        const top = footTop - sy;
        const p = clamp((vh - top) / Math.max(1, Math.min(footH, vh)), 0, 1);
        foot.style.setProperty('--p', p.toFixed(3));
      }
    }
  }

  function queue() {
    if (!queued) { queued = true; requestAnimationFrame(paint); }
  }

  addEventListener('scroll', () => { sy = scrollY; queue(); }, { passive: true });

  let resizeRaf = 0;
  addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(measure);
  }, { passive: true });

  addEventListener('pointermove', e => {
    if (reduced || !fineMq.matches || vw < 900 || sy > vh) { px = 0; py = 0; return; }
    px = -(e.clientX / vw - 0.5) * 24;
    py = -(e.clientY / vh - 0.5) * 24;
    queue();
  }, { passive: true });
  document.addEventListener('pointerleave', () => { px = 0; py = 0; queue(); });

  function applyReduced() {
    reduced = reducedMq.matches;
    if (reduced) {
      layers.forEach(l => { l.el.style.transform = ''; });
      heroTitle.style.opacity = '';
      zoom.style.transform = '';
      after.style.opacity = '';
      lift.style.opacity = '';
      lift.style.transform = '';
      foot.style.setProperty('--p', '1');
    }
    measure();
  }
  reducedMq.addEventListener('change', applyReduced);

  // A focused CTA inside the faded title scrolls into view; opacity follows the new scrollY.
  heroTitle.addEventListener('focusin', () => { sy = scrollY; queue(); });

  /* ---------- Craft entry ---------- */
  const revealEls = $$('[data-reveal]');
  $$('[data-reveal-group]').forEach(g => {
    $$('[data-reveal]', g).forEach((el, i) => el.style.setProperty('--d', Math.min(i, 7)));
  });
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Current section in the nav ---------- */
  const navLinks = $$('.bar-nav a');
  if ('IntersectionObserver' in window) {
    const map = new Map(navLinks.map(a => [a.getAttribute('href').slice(1), a]));
    const sio = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        navLinks.forEach(a => a.removeAttribute('aria-current'));
        const a = map.get(e.target.id);
        if (a) a.setAttribute('aria-current', 'true');
      }
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) sio.observe(s); });
  }

  /* ---------- Phone menu: hamburger-circle-reveal ---------- */
  const body = document.body;
  const burger = $('#burger');
  const menu = $('#menu');
  const page = $('#page');
  const menuLinks = $$('.menu-links a');
  let menuOpen = false;

  function geometry() {
    const b = burger.getBoundingClientRect();
    const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
    const r = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
    body.style.setProperty('--cx', cx + 'px');
    body.style.setProperty('--cy', cy + 'px');
    body.style.setProperty('--r', Math.ceil(r) + 'px');
  }
  function openMenu() {
    geometry();
    menuOpen = true;
    body.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    page.inert = true;
    setTimeout(() => { if (menuOpen) menuLinks[0].focus(); }, reduced ? 0 : 200);
  }
  function closeMenu(returnFocus = true) {
    menuOpen = false;
    body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    page.inert = false;
    if (returnFocus) burger.focus();
  }
  burger.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
  menuLinks.forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    closeMenu(false);
    if (target) {
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  }));
  document.addEventListener('keydown', e => {
    if (!menuOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
    if (e.key === 'Tab') {
      const items = [burger, ...$$('a', menu)];
      const i = items.indexOf(document.activeElement);
      if (i === -1) { e.preventDefault(); burger.focus(); return; }
      if (e.shiftKey && i === 0) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    }
  });
  addEventListener('resize', () => { if (menuOpen && innerWidth > 900) closeMenu(false); else if (menuOpen) geometry(); }, { passive: true });

  /* ---------- Stays and the hold ---------- */
  const PRICES = { 3: 36000, 7: 79500, 10: 108000 };
  const state = { nights: 7, guests: 1, selected: null, view: null, held: false };

  const rupees = n => {
    const s = String(Math.round(n));
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    return 'Rs ' + (rest ? rest + ',' + last3 : last3);
  };

  const stayCards = $$('.stay');
  const radios = $$('input[name="nights"]');
  function setNights(n) {
    state.nights = n;
    stayCards.forEach(c => c.setAttribute('aria-pressed', String(+c.dataset.stay === n)));
    radios.forEach(r => { r.checked = +r.value === n; });
    updateSummary();
  }
  stayCards.forEach(c => c.addEventListener('click', () => setNights(+c.dataset.stay)));
  radios.forEach(r => r.addEventListener('change', () => setNights(+r.value)));

  const gOut = $('#gOut'), gMinus = $('#gMinus'), gPlus = $('#gPlus');
  function setGuests(g) {
    state.guests = clamp(g, 1, 4);
    gOut.textContent = state.guests;
    gMinus.disabled = state.guests <= 1;
    gPlus.disabled = state.guests >= 4;
    updateSummary();
  }
  gMinus.addEventListener('click', () => setGuests(state.guests - 1));
  gPlus.addEventListener('click', () => setGuests(state.guests + 1));

  /* ---------- Calendar month ---------- */
  const MONTHS = [new Date(2026, 9, 1), new Date(2026, 10, 1), new Date(2026, 11, 1)];
  const FULL = new Set(['2026-10-08', '2026-11-26']);
  const WINTER = new Date(2026, 11, 16);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const key = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const same = (a, b) => a && b && a.getTime() === b.getTime();
  const fmtLong = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const fmtFull = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const fmtMonth = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });

  function closedReason(d) {
    if (d.getDay() !== 4) return 'no arrival';
    if (d < today) return 'past';
    if (FULL.has(key(d))) return 'full';
    if (d >= WINTER) return 'closed for winter';
    return '';
  }
  function firstOpen() {
    for (const m of MONTHS) {
      const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= days; i++) {
        const d = new Date(m.getFullYear(), m.getMonth(), i);
        if (!closedReason(d)) return d;
      }
    }
    return null;
  }

  const calGrid = $('#calGrid'), calMonth = $('#calMonth'), calPrev = $('#calPrev'), calNext = $('#calNext');
  const calStatus = $('#calStatus'), totalEl = $('#total');

  function renderCal() {
    const m = MONTHS[state.view];
    const y = m.getFullYear(), mo = m.getMonth();
    calMonth.textContent = fmtMonth.format(m);
    const start = (m.getDay() + 6) % 7;
    const days = new Date(y, mo + 1, 0).getDate();
    const prevDays = new Date(y, mo, 0).getDate();
    const cells = [];
    for (let i = start - 1; i >= 0; i--) cells.push(`<span class="cal-day out">${prevDays - i}</span>`);
    for (let i = 1; i <= days; i++) {
      const d = new Date(y, mo, i);
      const isToday = same(d, today) ? ' today' : '';
      const reason = closedReason(d);
      if (d.getDay() === 4) {
        const pressed = same(d, state.selected);
        const label = fmtFull.format(d) + (reason ? `, ${reason}` : ', arrival day') + (isToday ? ', today' : '');
        cells.push(`<button type="button" class="cal-day${isToday}" data-key="${key(d)}" aria-pressed="${pressed}" aria-label="${label}"${reason ? ' disabled' : ''}>${i}</button>`);
      } else {
        cells.push(`<span class="cal-day${isToday}">${i}</span>`);
      }
    }
    let next = 1;
    while (cells.length % 7) cells.push(`<span class="cal-day out">${next++}</span>`);
    calGrid.innerHTML = cells.join('');
    calPrev.disabled = state.view === 0;
    calNext.disabled = state.view === MONTHS.length - 1;
  }

  calGrid.addEventListener('click', e => {
    const b = e.target.closest('button.cal-day');
    if (!b || b.disabled) return;
    const [y, m, d] = b.dataset.key.split('-').map(Number);
    state.selected = new Date(y, m - 1, d);
    renderCal();
    const again = calGrid.querySelector(`[data-key="${b.dataset.key}"]`);
    if (again) again.focus();
    updateSummary();
  });
  calPrev.addEventListener('click', () => { if (state.view > 0) { state.view--; renderCal(); } });
  calNext.addEventListener('click', () => { if (state.view < MONTHS.length - 1) { state.view++; renderCal(); } });

  function leaveDate() {
    const d = new Date(state.selected);
    d.setDate(d.getDate() + state.nights);
    return d;
  }
  function updateSummary() {
    if (!state.selected) {
      calStatus.textContent = 'No arrival days are left this season. Write to the office for February.';
    } else {
      calStatus.textContent = `Arrive ${fmtLong.format(state.selected)}, leave ${fmtLong.format(leaveDate())}.`;
    }
    totalEl.textContent = rupees(PRICES[state.nights] * state.guests);
  }

  const book = $('#book'), email = $('#email'), emailErr = $('#email-err');
  const held = $('#held'), heldText = $('#heldText'), holdActs = $('.book-acts');
  function setEmailError(msg) {
    emailErr.textContent = msg;
    if (msg) email.setAttribute('aria-invalid', 'true'); else email.removeAttribute('aria-invalid');
  }
  email.addEventListener('input', () => { if (emailErr.textContent) setEmailError(''); });
  book.addEventListener('submit', e => {
    e.preventDefault();
    const v = email.value.trim();
    if (!state.selected) { calStatus.focus?.(); return; }
    if (!v) { setEmailError('Add the email we should send the hold to.'); email.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { setEmailError('That address is missing an @ or a domain.'); email.focus(); return; }
    setEmailError('');
    const g = state.guests;
    heldText.textContent = `Held for 48 hours: ${state.nights} nights from ${fmtLong.format(state.selected)} for ${g} ${g === 1 ? 'guest' : 'guests'}, ${rupees(PRICES[state.nights] * g)}. The deposit details are on their way to ${v}.`;
    holdActs.hidden = true;
    held.hidden = false;
    held.focus();
  });
  $('#changeBtn').addEventListener('click', () => {
    held.hidden = true;
    holdActs.hidden = false;
    const sel = calGrid.querySelector('[aria-pressed="true"]') || calGrid.querySelector('button.cal-day:not(:disabled)');
    if (sel) sel.focus();
  });

  state.selected = firstOpen();
  state.view = state.selected ? MONTHS.findIndex(m => m.getMonth() === state.selected.getMonth()) : 0;
  const footNext = $('#footNext');
  if (state.selected) footNext.textContent = fmtLong.format(state.selected);
  else footNext.textContent = 'February, write to us';
  renderCal();
  setGuests(1);
  setNights(7);

  /* ---------- FAQ: faq-category-accordion ---------- */
  const CATS = ['Silence', 'Days', 'Body', 'Travel'];
  const DATA = {
    Silence: [
      ['Do I have to stay silent the whole time?', 'Yes, from the arrival circle on Thursday afternoon until breakfast on the last morning. Anything practical can go to the office on the note pad by the door.'],
      ['What happens to my phone?', 'You hand it to the office on arrival and it stays in a locked drawer with your name on it. If someone needs to reach you, they call the office and we pass the message on the same day.'],
      ['Is this a religious retreat?', 'No. The sittings use simple breath and body practice, with no chanting and no teaching to sign up to. People of any faith, or none, come here.']
    ],
    Days: [
      ['I have never meditated. Is that a problem?', 'Not at all. The first evening has a short spoken introduction, which is the last talk you will hear until you leave. After that the bell and the timetable carry you.'],
      ['Can I skip a sitting?', 'Yes. Nobody takes a register. If you would rather walk the ridge path or rest, do that quietly and come back for the next bell.'],
      ['What is the food like?', 'Vegetarian Nepali food from our terraces and the Pokhara market: porridge, dal bhat, seasonal greens and soup. Tell us about allergies when you hold your dates and the kitchen will cook for them.'],
      ['Can I read or write?', 'A notebook is fine, and there is one in your room. We ask you to leave books at home, so the days stay empty enough to notice things.']
    ],
    Body: [
      ['How high is the house, and will I feel it?', 'The house sits at about 1,600 m. That is well below the height where altitude sickness usually starts, but the walk up is steep, so take it slowly on arrival day.'],
      ['Do I need to be fit?', 'You need to manage a forty-minute walk uphill on stone steps and sit on a cushion or a low stool. There are always chairs in the hall for anyone who needs one.'],
      ['Is there a doctor nearby?', 'A clinic is twenty minutes away by road in Pokhara, and the office can call a jeep at any hour. Tell us about any condition we should know about when you hold your dates.']
    ],
    Travel: [
      ['How do I get to Pokhara?', 'Fly from Kathmandu, about 25 minutes in the air, or take the tourist bus, which takes most of a day. From Pokhara a taxi to the Sarangkot bus stop takes about 30 minutes.'],
      ['Where do we meet on arrival day?', 'At the Sarangkot bus stop at 14:00 on Thursday. Someone from the house meets you there and you walk up together. Your bags go up with a porter.'],
      ['When is the best season?', 'October to mid December brings clear mountain views. February to May is warmer, with rhododendrons on the ridge. The house closes for the monsoon from June to August and for winter from mid December.'],
      ['Can I pay by card?', 'The deposit is paid by card or bank transfer when you hold your dates. The balance is paid on arrival in rupees, by card, or by transfer before you come.']
    ]
  };
  const TOTAL = CATS.reduce((n, c) => n + DATA[c].length, 0);
  const CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

  const faqQ = $('#faqQ'), faqClear = $('#faqClear'), faqCount = $('#faqCount');
  const faqCats = $('#faqCats'), faqList = $('#faqList'), faqEmpty = $('#faqEmpty');
  let cat = 'Silence';
  const openSet = new Set(['Silence-1']);

  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rx = q => new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const hi = (s, q) => (q ? esc(s).replace(rx(esc(q)), m => '<mark>' + m + '</mark>') : esc(s));

  faqCats.innerHTML = CATS.map(c => `<li><button class="faq-cat" type="button" data-cat="${c}" aria-pressed="false"><span>${c}</span><span class="faq-pill">${DATA[c].length}</span></button></li>`).join('');
  const catBtns = $$('.faq-cat', faqCats);

  function item(c, i, qa, q, ql) {
    const id = `${c}-${i}`;
    const inQ = q && qa[0].toLowerCase().includes(ql);
    const inA = q && qa[1].toLowerCase().includes(ql);
    const open = openSet.has(id) || (q && inA && !inQ);
    return `<div class="faq-item${open ? ' open' : ''}" data-id="${id}">
      <h4><button class="faq-q" type="button" id="q-${id}" aria-expanded="${open}" aria-controls="p-${id}"><span>${hi(qa[0], q)}</span>${CHEVRON}</button></h4>
      <div class="faq-panel" id="p-${id}" role="region" aria-labelledby="q-${id}"><div><p>${hi(qa[1], q)}</p></div></div>
    </div>`;
  }

  function renderFaq() {
    const q = faqQ.value.trim();
    const ql = q.toLowerCase();
    let shown = 0, groups = 0, html = '';
    for (const c of CATS) {
      const hits = DATA[c].map((qa, i) => ({ qa, i })).filter(({ qa }) => !q || (qa[0] + ' ' + qa[1]).toLowerCase().includes(ql));
      const btn = catBtns.find(b => b.dataset.cat === c);
      btn.setAttribute('aria-pressed', String(!q && c === cat));
      btn.querySelector('.faq-pill').textContent = q ? hits.length : DATA[c].length;
      btn.classList.toggle('zero', !!q && !hits.length);
      if ((!q && c !== cat) || !hits.length) continue;
      groups++;
      shown += hits.length;
      html += `<div class="faq-group"><h3${q ? '' : ' hidden'}>${c}</h3>${hits.map(({ qa, i }) => item(c, i, qa, q, ql)).join('')}</div>`;
    }
    faqList.innerHTML = html;
    faqEmpty.hidden = !(q && !shown);
    faqClear.hidden = !q;
    const qs = esc(q);
    if (!q) faqCount.textContent = `${DATA[cat].length} questions in ${cat}, ${TOTAL} in total`;
    else if (!shown) faqCount.innerHTML = `No questions match “${qs}”`;
    else faqCount.innerHTML = `${shown} ${shown === 1 ? 'question matches' : 'questions match'} “${qs}” in ${groups} ${groups === 1 ? 'category' : 'categories'}`;
  }

  faqList.addEventListener('click', e => {
    const b = e.target.closest('.faq-q');
    if (!b) return;
    const it = b.closest('.faq-item');
    const id = it.dataset.id;
    const open = !it.classList.contains('open');
    it.classList.toggle('open', open);
    b.setAttribute('aria-expanded', String(open));
    if (open) openSet.add(id); else openSet.delete(id);
  });
  faqCats.addEventListener('click', e => {
    const b = e.target.closest('.faq-cat');
    if (!b) return;
    cat = b.dataset.cat;
    faqQ.value = '';
    renderFaq();
  });
  const clearFaq = () => { faqQ.value = ''; renderFaq(); faqQ.focus(); };
  faqQ.addEventListener('input', renderFaq);
  faqQ.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); clearFaq(); } });
  faqClear.addEventListener('click', clearFaq);
  $('#faqEmptyClear').addEventListener('click', clearFaq);
  renderFaq();

  /* ---------- Contact dialog: contact-booking-hours ---------- */
  const dlg = $('#dlg'), dlgForm = $('#dlgForm'), openDlg = $('#openDlg');
  const dName = $('#dName'), dEmail = $('#dEmail');
  let closeTimer = 0;
  function fieldError(input, msg) {
    const err = $('#' + input.id + '-err');
    err.textContent = msg;
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  }
  openDlg.addEventListener('click', () => {
    clearTimeout(closeTimer);
    dlgForm.classList.remove('ok');
    dlgForm.reset();
    fieldError(dName, '');
    fieldError(dEmail, '');
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    dName.focus();
  });
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { clearTimeout(closeTimer); openDlg.focus(); });
  $('#dlgX').addEventListener('click', () => dlg.close());
  $('#dlgCancel').addEventListener('click', () => dlg.close());
  [dName, dEmail].forEach(i => i.addEventListener('input', () => fieldError(i, '')));
  dlgForm.addEventListener('submit', e => {
    e.preventDefault();
    let bad = null;
    if (!dName.value.trim()) { fieldError(dName, 'Add your name so the office knows who to reply to.'); bad = bad || dName; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(dEmail.value.trim())) { fieldError(dEmail, 'That address is missing an @ or a domain.'); bad = bad || dEmail; }
    if (bad) { bad.focus(); return; }
    dlgForm.classList.add('ok');
    closeTimer = setTimeout(() => dlg.close(), 1200);
  });

  /* ---------- Pokhara clock ---------- */
  const clockT = $('#clockT'), clockZ = $('#clockZ');
  let fmtClock = null;
  try {
    fmtClock = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'long', hourCycle: 'h23' });
  } catch (_) { fmtClock = null; }
  function tick() {
    if (!fmtClock) return;
    const parts = Object.fromEntries(fmtClock.formatToParts(new Date()).map(p => [p.type, p.value]));
    clockT.innerHTML = `${parts.hour}:${parts.minute}<span>:${parts.second}</span>`;
    const h = +parts.hour;
    const end = parts.weekday === 'Thursday' ? 18 : parts.weekday === 'Friday' ? 13 : 16;
    let status;
    if (parts.weekday === 'Saturday') status = 'Saturday, the office is closed';
    else if (h >= 10 && h < end) status = 'the office is open';
    else if (h >= 5 && h < 10) status = 'morning sitting, office opens at 10:00';
    else status = 'the house is asleep, replies tomorrow';
    clockZ.textContent = `Pokhara, NPT, ${status}`;
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Start ---------- */
  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  addEventListener('load', measure);
})();
