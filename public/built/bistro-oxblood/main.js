(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const phone = matchMedia('(max-width: 767px)');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Hours, computed in UK time ---------- */
  const TZ = 'Europe/London';
  const LAST_ORDERS = 45;
  // Minutes from midnight. 1440 means midnight at the end of the day.
  const HOURS = {
    0: [[720, 960]],
    1: [],
    2: [[1050, 1380]],
    3: [[1050, 1380]],
    4: [[1050, 1380]],
    5: [[720, 900], [1050, 1440]],
    6: [[720, 900], [1050, 1440]]
  };
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ, weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', hourCycle: 'h23'
  });

  function londonNow() {
    const parts = {};
    fmt.formatToParts(new Date()).forEach((p) => { parts[p.type] = p.value; });
    return {
      dow: DAYS_SHORT.indexOf(parts.weekday),
      y: +parts.year, m: +parts.month, d: +parts.day,
      mins: (+parts.hour % 24) * 60 + +parts.minute
    };
  }

  const hhmm = (m) => {
    if (m >= 1440) return 'midnight';
    return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  };
  const range = (w) => hhmm(w[0]) + '-' + (w[1] >= 1440 ? '00:00' : hhmm(w[1]));

  function status(now) {
    const today = HOURS[now.dow];
    const win = today.find((w) => now.mins >= w[0] && now.mins < w[1]);
    if (win) {
      const last = win[1] - LAST_ORDERS;
      return {
        open: true,
        hero: 'Open until ' + hhmm(win[1]),
        main: 'Open now, until ' + hhmm(win[1]),
        sub: now.mins < last
          ? 'The kitchen takes last orders at ' + hhmm(last) + '.'
          : 'The kitchen has closed. The bar pours until ' + hhmm(win[1]) + '.'
      };
    }
    const later = today.find((w) => w[0] > now.mins);
    if (later) {
      return {
        open: false,
        hero: 'Closed, opens at ' + hhmm(later[0]),
        main: 'Closed now. Opens today at ' + hhmm(later[0]),
        sub: 'Walk-ins are welcome when there is a seat. Booking helps on Fridays and Saturdays.'
      };
    }
    for (let i = 1; i <= 7; i++) {
      const dow = (now.dow + i) % 7;
      if (HOURS[dow].length) {
        const when = i === 1 ? 'tomorrow' : DAYS[dow];
        return {
          open: false,
          hero: 'Closed, opens ' + when + ' ' + hhmm(HOURS[dow][0][0]),
          main: 'Closed now. Opens ' + when + ' at ' + hhmm(HOURS[dow][0][0]),
          sub: 'You can still ask for a table below. We reply when we open.'
        };
      }
    }
    return null;
  }

  function paintHours() {
    const now = londonNow();
    const s = status(now);
    if (!s) return;
    const setDot = (el) => { if (el) { el.classList.toggle('open', s.open); el.classList.toggle('closed', !s.open); } };
    $('#heroStatus').textContent = s.hero;
    $('#statusText').textContent = s.main;
    $('#statusSub').textContent = s.sub;
    setDot($('#heroDot'));
    setDot($('#statusDot'));

    const todayWins = HOURS[now.dow];
    $('#heroToday').textContent = DAYS[now.dow] + ': ' +
      (todayWins.length ? todayWins.map(range).join(', ') : 'closed all day');

    $$('#hoursBody tr').forEach((tr) => {
      const isToday = +tr.dataset.dow === now.dow;
      tr.classList.toggle('is-today', isToday);
      const th = tr.querySelector('th');
      const tag = th.querySelector('.today-tag');
      if (isToday && !tag) th.insertAdjacentHTML('beforeend', '<span class="today-tag">Today</span>');
      if (!isToday && tag) tag.remove();
    });

    const note = $('#tonightNote');
    if (note) {
      note.textContent = HOURS[now.dow].some((w) => w[1] > 1020)
        ? DAYS[now.dow] + ' night. On the blackboard until it runs out.'
        : 'We are closed tonight. The board is back on ' + nextDinnerDay(now.dow) + '.';
    }
  }

  function nextDinnerDay(dow) {
    for (let i = 1; i <= 7; i++) {
      const d = (dow + i) % 7;
      if (HOURS[d].some((w) => w[1] > 1020)) return DAYS[d];
    }
    return 'Tuesday';
  }

  paintHours();
  setInterval(paintHours, 60000);

  /* ---------- Navbar: transparent to solid at 80px ---------- */
  const bar = $('#bar');
  const menuBtn = $('#menuBtn');
  const panel = $('#panel');

  function setPanel(open, refocus) {
    panel.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) bar.classList.add('solid');
    else if (refocus) menuBtn.focus();
    if (!open) bar.classList.toggle('solid', scrollY > 80);
  }
  menuBtn.addEventListener('click', () => setPanel(panel.hidden, false));
  panel.addEventListener('click', (e) => { if (e.target.closest('a')) setPanel(false, false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) setPanel(false, true);
  });

  /* ---------- Scrollspy: category bar, top nav, bottom bar ---------- */
  const cats = $('#cats');
  const catList = cats.querySelector('ul');
  const catLinks = $$('a', cats);
  const menuSections = catLinks.map((a) => $(a.getAttribute('href')));
  const topLinks = $$('.bar-nav a[data-spy]');
  const bnav = $('#bnav');
  const bLinks = $$('a[data-b]', bnav);
  const hoursEl = $('#hours');
  const bookEl = $('#book');

  let curCat = -1;
  function spyCats(atEnd) {
    const y = cats.getBoundingClientRect().bottom + 24;
    let cur = 0;
    menuSections.forEach((s, i) => { if (s.getBoundingClientRect().top <= y) cur = i; });
    const menuBottom = $('.card').getBoundingClientRect().bottom;
    if (atEnd || menuBottom < y) cur = menuSections.length - 1;
    if (cur === curCat) return;
    curCat = cur;
    catLinks.forEach((a, i) => a.setAttribute('aria-current', i === cur ? 'true' : 'false'));
    const a = catLinks[cur];
    const left = a.offsetLeft - (catList.clientWidth - a.offsetWidth) / 2;
    catList.scrollTo({ left, behavior: reduced.matches ? 'auto' : 'smooth' });
  }

  function spyTop() {
    const line = innerHeight * 0.4;
    let key = null;
    if (hoursEl.getBoundingClientRect().top < line) key = 'hours';
    else if ($('#tonight').getBoundingClientRect().top < line) {
      key = 'tonight';
      if ($('#small-plates').getBoundingClientRect().top < line) key = 'menu';
      if ($('#drinks').getBoundingClientRect().top < line) key = 'wine';
    }
    topLinks.forEach((a) => {
      if (a.dataset.spy === key) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  function spyBottom(atEnd) {
    const line = innerHeight * 0.4;
    let key = 'menu';
    if (hoursEl.getBoundingClientRect().top < line) key = 'hours';
    if (bookEl.getBoundingClientRect().top < line) key = 'book';
    if (atEnd) key = 'book';
    bLinks.forEach((a) => a.setAttribute('aria-current', a.dataset.b === key ? 'true' : 'false'));
  }

  let lastY = scrollY;
  function hideShow(y, atEnd) {
    if (reduced.matches || !phone.matches) { bnav.classList.remove('hidden'); lastY = y; return; }
    if (atEnd || y < 80 || y < lastY - 6) bnav.classList.remove('hidden');
    else if (y > lastY + 6) bnav.classList.add('hidden');
    if (Math.abs(y - lastY) > 6 || atEnd) lastY = y;
  }

  let ticking = false;
  function onScroll() {
    const y = scrollY;
    const atEnd = innerHeight + y >= document.documentElement.scrollHeight - 8;
    if (panel.hidden) bar.classList.toggle('solid', y > 80);
    spyCats(false);
    spyTop();
    spyBottom(atEnd);
    hideShow(y, atEnd);
    ticking = false;
  }
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  addEventListener('resize', () => { curCat = -1; onScroll(); });
  bnav.addEventListener('focusin', () => bnav.classList.remove('hidden'));
  onScroll();

  /* ---------- text-marker-highlight-draw ---------- */
  const markGroups = $$('.marks');
  function run(group) {
    $$('path', group).forEach((p) => { p.style.animation = ''; });
    group.classList.remove('run');
    void group.offsetWidth;
    group.classList.add('run');
  }
  markGroups.filter((g) => g.dataset.marks === 'load').forEach((g) => {
    requestAnimationFrame(() => run(g));
  });
  const scrollGroups = markGroups.filter((g) => g.dataset.marks === 'scroll');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.45, rootMargin: '0px 0px -10% 0px' });
    scrollGroups.forEach((g) => io.observe(g));
  } else {
    scrollGroups.forEach(run);
  }
  $$('.mk').forEach((m) => {
    m.addEventListener('mouseenter', () => {
      const group = m.closest('.marks');
      if (reduced.matches || !group || !group.classList.contains('run')) return;
      const p = m.querySelector('path');
      p.style.animation = 'none';
      void p.getBBox();
      p.style.animation = 'draw ' + (m.classList.contains('ci') ? 820 : 650) +
        'ms cubic-bezier(0.65, 0, 0.35, 1) 0ms both';
    });
  });

  /* ---------- Table request ---------- */
  const form = $('#bform');
  const done = $('#bdone');
  const partyOut = $('#party');
  const fewer = $('#fewer');
  const more = $('#more');
  const dateSel = $('#date');
  const timeSel = $('#time');
  const nameIn = $('#name');
  const telIn = $('#tel');
  const MAX_PARTY = 8;
  let party = 2;

  const ALERT = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/></svg>';
  const CHECK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-9"/></svg>';

  function paintParty() {
    partyOut.textContent = String(party);
    fewer.disabled = party <= 1;
    more.disabled = party >= MAX_PARTY;
  }
  fewer.addEventListener('click', () => { party = Math.max(1, party - 1); paintParty(); });
  more.addEventListener('click', () => { party = Math.min(MAX_PARTY, party + 1); paintParty(); });
  paintParty();

  function slotsFor(dow, minFrom) {
    const out = [];
    HOURS[dow].forEach(([o, c]) => {
      for (let t = o; t <= c - 90; t += 30) if (t >= minFrom) out.push(t);
    });
    return out;
  }

  function buildDates() {
    const now = londonNow();
    const base = Date.UTC(now.y, now.m - 1, now.d);
    const keep = dateSel.value;
    dateSel.innerHTML = '';
    for (let i = 0; i < 21 && dateSel.options.length < 14; i++) {
      const dt = new Date(base + i * 86400000);
      const dow = dt.getUTCDay();
      const slots = slotsFor(dow, i === 0 ? now.mins + 30 : 0);
      if (!slots.length) continue;
      const label = DAYS_SHORT[dow] + ' ' + dt.getUTCDate() + ' ' + MONTHS[dt.getUTCMonth()];
      const opt = new Option((i === 0 ? 'Today, ' : i === 1 ? 'Tomorrow, ' : '') + label, String(i));
      opt.dataset.dow = String(dow);
      opt.dataset.label = label;
      opt.dataset.first = i === 0 ? String(now.mins + 30) : '0';
      dateSel.add(opt);
    }
    if (keep && [...dateSel.options].some((o) => o.value === keep)) dateSel.value = keep;
    buildTimes();
  }

  function buildTimes() {
    const opt = dateSel.selectedOptions[0];
    const keep = timeSel.value;
    timeSel.innerHTML = '';
    if (!opt) return;
    slotsFor(+opt.dataset.dow, +opt.dataset.first).forEach((t) => timeSel.add(new Option(hhmm(t), String(t))));
    const pick = [keep, '1170', timeSel.options[0] && timeSel.options[0].value]
      .find((v) => v && [...timeSel.options].some((o) => o.value === v));
    if (pick) timeSel.value = pick;
  }
  dateSel.addEventListener('change', buildTimes);
  buildDates();

  function setErr(input, msg) {
    const err = $('#' + input.id + '-err');
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      err.innerHTML = ALERT + '<span></span>';
      err.querySelector('span').textContent = msg;
      err.hidden = false;
    } else {
      input.removeAttribute('aria-invalid');
      err.hidden = true;
      err.textContent = '';
    }
  }

  const digits = (v) => v.replace(/\D/g, '');
  const checks = {
    date: () => (dateSel.value ? '' : 'Choose a day. We are closed on Mondays.'),
    time: () => (timeSel.value ? '' : 'Choose a time for that day.'),
    name: () => (nameIn.value.trim().length >= 2 ? '' : 'Add the name we should hold the table under.'),
    tel: () => {
      const n = digits(telIn.value).length;
      if (!n) return 'Add a mobile number so we can text to confirm.';
      if (n < 10 || n > 13) return 'That number looks short. Try it like 07700 900123.';
      return '';
    }
  };
  const inputs = { date: dateSel, time: timeSel, name: nameIn, tel: telIn };

  Object.entries(inputs).forEach(([k, el]) => {
    const ev = el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(ev, () => { if (el.getAttribute('aria-invalid') === 'true') setErr(el, checks[k]()); });
    if (el.tagName === 'INPUT') el.addEventListener('blur', () => { if (el.value) setErr(el, checks[k]()); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let first = null;
    Object.entries(inputs).forEach(([k, el]) => {
      const msg = checks[k]();
      setErr(el, msg);
      if (msg && !first) first = el;
    });
    if (first) { first.focus(); return; }
    const opt = dateSel.selectedOptions[0];
    const who = party === 1 ? '1 person' : party + ' people';
    $('#bdoneText').textContent = 'You asked for ' + who + ' at ' + hhmm(+timeSel.value) + ', ' +
      opt.dataset.label + ', under ' + nameIn.value.trim() + '. We will text ' + telIn.value.trim() +
      ' to confirm within the hour while we are open.';
    form.hidden = true;
    done.hidden = false;
    done.focus();
  });

  $('#bchange').addEventListener('click', () => {
    done.hidden = true;
    form.hidden = false;
    buildDates();
    nameIn.focus();
  });

  /* ---------- Thursday menu letter ---------- */
  const nl = $('#nl');
  const email = $('#email');
  const msg = $('#nl-msg');
  const DEFAULT_MSG = msg.textContent;
  function nlState(kind, text) {
    nl.classList.remove('bad', 'done');
    msg.classList.remove('bad', 'done');
    if (kind) { nl.classList.add(kind); msg.classList.add(kind); }
    msg.innerHTML = kind ? (kind === 'bad' ? ALERT : CHECK) + '<span></span>' : '';
    if (kind) msg.querySelector('span').textContent = text;
    else msg.textContent = text;
    email.setAttribute('aria-invalid', kind === 'bad' ? 'true' : 'false');
  }
  nl.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = email.value.trim();
    if (!v) { nlState('bad', 'Add an email address and we will send Thursday\'s menu.'); email.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      nlState('bad', 'That address is missing an @ or a domain, like name@example.com.');
      email.focus();
      return;
    }
    nlState('done', 'Done. Look for a confirmation email at ' + v + '.');
  });
  email.addEventListener('input', () => {
    if (nl.classList.contains('bad') || nl.classList.contains('done')) nlState(null, DEFAULT_MSG);
  });
})();
