/* VOLT 44 · Designed using Design Lounge (https://www.designlounge.live) */
(function () {
  'use strict';

  var html = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var rmQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = function () { return rmQuery.matches; };

  var site = $('#site');
  var main = $('#main');
  var tabbar = $('#tabbar');

  /* ---------- Ride profiles: one bar per minute, 44 bars ---------- */
  var CLASS_NAME = { spin: 'Spin', hiit: 'HIIT', climb: 'Climb', recover: 'Recover' };
  var PROFILES = {
    spin: [['Warm up', 6, 25, 45, 'easy'], ['Base', 10, 50, 62, 'base'], ['Sprint', 8, 90, 45, 'sprint', 'pulse'], ['Climb', 10, 55, 85, 'climb'], ['Sprint', 4, 95, 50, 'sprint', 'pulse'], ['Recover', 6, 45, 20, 'easy']],
    hiit: [['Warm up', 6, 25, 45, 'easy'], ['Rounds', 16, 95, 30, 'sprint', 'pulse'], ['Base', 6, 55, 55, 'base'], ['Rounds', 10, 92, 35, 'sprint', 'pulse'], ['Recover', 6, 45, 20, 'easy']],
    climb: [['Warm up', 6, 25, 45, 'easy'], ['Climb', 14, 40, 80, 'climb'], ['Base', 4, 55, 55, 'base'], ['Climb', 14, 50, 95, 'climb'], ['Recover', 6, 45, 20, 'easy']],
    recover: [['Warm up', 8, 20, 35, 'easy'], ['Base', 28, 40, 50, 'base', 'wave'], ['Cool down', 8, 35, 15, 'easy']]
  };

  function bars(cls) {
    var out = [];
    PROFILES[cls].forEach(function (seg) {
      var len = seg[1], from = seg[2], to = seg[3], zone = seg[4], kind = seg[5];
      for (var i = 0; i < len; i++) {
        var h, z = zone;
        if (kind === 'pulse') { h = i % 2 ? to : from; if (i % 2) z = 'easy'; }
        else if (kind === 'wave') h = from + (to - from) * (0.5 + 0.5 * Math.sin(i / 2));
        else h = len > 1 ? from + (to - from) * (i / (len - 1)) : from;
        out.push({ h: Math.round(h), z: z });
      }
    });
    return out;
  }

  function renderProfile(el, cls) {
    var list = bars(cls);
    var segs = PROFILES[cls];
    var summary = segs.map(function (s) { return s[0].toLowerCase() + ' ' + s[1] + ' min'; }).join(', ');
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', CLASS_NAME[cls] + ' profile, 44 minutes: ' + summary + '.');
    el.dataset.class = cls;
    el.innerHTML =
      '<div class="bars">' + list.map(function (b, i) {
        return '<i class="z-' + b.z + '" style="--h:' + b.h + '%;--b:' + i + '"></i>';
      }).join('') + '</div>' +
      '<div class="axis num" aria-hidden="true"><span>0</span><span>22</span><span>44 min</span></div>' +
      '<div class="phase-row" aria-hidden="true">' + segs.map(function (s) {
        return '<span class="z-' + s[4] + '" style="--len:' + s[1] + '">' + s[0] + '</span>';
      }).join('') + '</div>';
  }

  renderProfile($('#hero-profile'), 'climb');

  /* ---------- Hero letters ---------- */
  var letterIndex = 0;
  $$('.hero-title .w').forEach(function (w) {
    var text = w.textContent;
    w.textContent = '';
    for (var i = 0; i < text.length; i++) {
      var s = document.createElement('span');
      s.className = 'ch';
      s.textContent = text[i];
      s.style.setProperty('--i', letterIndex++);
      w.appendChild(s);
    }
  });

  function heroIn() { site.classList.add('in'); }

  /* ---------- Lead effect: preloader counter intro ---------- */
  var loader = $('#loader');
  var tpl = $('#stage-tpl');
  var introStatus = $('#intro-status');
  var COUNT_MIN = 800;   // floor so the count reads as a count
  var COUNT_CAP = 1000;  // count + hold + split stays under 1.8s
  var HOLD = 120;
  var SPLIT = 640;
  var real = 0.2;
  var bump = function (v) { real = Math.max(real, v); };
  if (document.readyState !== 'loading') bump(0.4); else document.addEventListener('DOMContentLoaded', function () { bump(0.4); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { bump(0.85); });
  if (document.readyState === 'complete') bump(1); else window.addEventListener('load', function () { bump(1); });

  $$('.stage', loader).forEach(function (s) { s.appendChild(tpl.content.cloneNode(true)); });
  var digitSets = $$('.stage', loader).map(function (s) { return $$('.count .d', s); });
  var barFills = $$('.bar i', loader);
  var pops = [0, 1, 2, 3].map(function (k) { return $$('.p' + (k + 1), loader); });
  var THRESH = [18, 42, 66, 88];

  var raf = 0, timers = [], phase = 'idle', lastAria = -1;
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function cancelAll() { cancelAnimationFrame(raf); timers.forEach(clearTimeout); timers = []; }
  var easeInOut = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  function setCount(v) {
    var s = String(v);
    while (s.length < 3) s = ' ' + s;
    digitSets.forEach(function (ds) { ds.forEach(function (el, k) { el.textContent = s[k] === ' ' ? '' : s[k]; }); });
    barFills.forEach(function (b) { b.style.transform = 'scaleX(' + v / 100 + ')'; });
    THRESH.forEach(function (t, k) { if (v >= t) pops[k].forEach(function (p) { p.classList.add('on'); }); });
    var step = Math.floor(v / 25) * 25;
    if (step !== lastAria) { lastAria = step; loader.setAttribute('aria-valuenow', step); }
  }

  function setInert(on) {
    [main, $('#top'), $('.foot'), tabbar].forEach(function (el) {
      if (!el) return;
      if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
  }

  function runIntro() {
    cancelAll();
    phase = 'count';
    lastAria = -1;
    loader.hidden = false;
    loader.classList.remove('full', 'split', 'fade');
    pops.forEach(function (ps) { ps.forEach(function (p) { p.classList.remove('on'); }); });
    setCount(0);
    setInert(true);
    try { sessionStorage.setItem('volt44-intro', '1'); } catch (e) {}
    var start = performance.now();
    function tick(now) {
      var elapsed = now - start;
      var shown = Math.round(100 * Math.min(easeInOut(Math.min(1, elapsed / COUNT_MIN)), real));
      if (elapsed >= COUNT_CAP) shown = 100;
      setCount(shown);
      if (shown < 100) raf = requestAnimationFrame(tick);
      else full();
    }
    raf = requestAnimationFrame(tick);
  }

  function full() {
    phase = 'full';
    setCount(100);
    loader.classList.add('full');
    later(split, HOLD);
  }

  function split() {
    if (phase === 'split' || phase === 'done') return;
    phase = 'split';
    loader.classList.add('split');
    heroIn();
    later(done, SPLIT + 20);
  }

  function done() {
    phase = 'done';
    loader.hidden = true;
    html.classList.remove('intro');
    setInert(false);
    introStatus.textContent = 'VOLT 44 loaded';
  }

  function skip() {
    if (phase !== 'count' && phase !== 'full') return;
    cancelAll();
    setCount(100);
    loader.classList.add('full');
    split();
  }

  $('#skip').addEventListener('click', function (e) { e.stopPropagation(); skip(); });
  loader.addEventListener('click', skip);
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') && (phase === 'count' || phase === 'full')) skip();
  });

  if (html.classList.contains('intro')) {
    runIntro();
  } else {
    loader.hidden = true;
    if (reduced()) heroIn();
    else requestAnimationFrame(function () { requestAnimationFrame(heroIn); });
  }

  $('#replay').addEventListener('click', function () {
    if (reduced()) { introStatus.textContent = 'The intro is off while reduced motion is on.'; return; }
    window.scrollTo({ top: 0, behavior: 'auto' });
    site.classList.add('no-trans');
    site.classList.remove('in');
    void site.offsetWidth;
    site.classList.remove('no-trans');
    html.classList.add('intro');
    runIntro();
  });

  $('#to-top').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
    $('.wordmark').focus({ preventScroll: true });
  });

  /* ---------- Entry reveals ---------- */
  var revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduced()) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('shown'); revealIO.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('shown'); });
  }

  /* ---------- Supporting effect 1: scroll velocity type ---------- */
  var band = $('#band');
  var rows = $$('.band-row', band);
  var bandTop = 0, bandOn = false, pricesHot = false;
  var energy = 0, dir = 1, settle = null;

  function measureBand() { bandTop = band.getBoundingClientRect().top + window.scrollY; }
  measureBand();
  window.addEventListener('resize', measureBand);
  window.addEventListener('load', measureBand);

  function paintBand(y) {
    var p = (y - bandTop + window.innerHeight) * 0.42;
    rows.forEach(function (r, i) {
      var s = i % 2 ? 1 : -1;
      var x = s * (p + dir * energy * 90);
      var skew = -dir * energy * 14 * (i % 2 ? -1 : 1);
      r.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0) skewX(' + skew.toFixed(2) + 'deg)';
    });
  }

  function decay() {
    energy *= 0.75;
    if (energy < 0.04) { energy = 0; clearInterval(settle); settle = null; }
    paintBand(window.scrollY);
  }

  function bandScroll(y, dy) {
    if (reduced() || !bandOn || pricesHot) return;
    if (dy !== 0) {
      dir = dy > 0 ? 1 : -1;
      energy = Math.min(1, energy + 0.15);
      clearInterval(settle);
      settle = setInterval(decay, 48);
    }
    paintBand(y);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      bandOn = entries[0].isIntersecting;
      band.classList.toggle('live', bandOn && !reduced());
      if (bandOn && !reduced()) paintBand(window.scrollY);
    }).observe(band);
    new IntersectionObserver(function (entries) {
      pricesHot = entries[0].intersectionRatio > 0.25;
    }, { threshold: [0, 0.25, 0.5] }).observe($('#prices'));
  }
  if (!reduced()) paintBand(window.scrollY);

  /* ---------- One scroll loop: rAF throttled, no layout reads ---------- */
  var lastY = window.scrollY, navY = lastY, ticking = false;
  function onFrame() {
    ticking = false;
    var y = window.scrollY;
    var dy = y - lastY;
    lastY = y;
    bandScroll(y, dy);
    if (!reduced()) {
      var atEnd = window.innerHeight + y >= document.documentElement.scrollHeight - 8;
      if (atEnd || y < 80 || y < navY - 6) tabbar.classList.remove('hidden');
      else if (y > navY + 6) tabbar.classList.add('hidden');
      if (Math.abs(y - navY) > 6 || atEnd) navY = y;
      if (atEnd) setCurrent('trial');
    }
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onFrame); }
  }, { passive: true });
  tabbar.addEventListener('focusin', function () { tabbar.classList.remove('hidden'); });

  /* ---------- Current section for both navs ---------- */
  var navLinks = $$('[data-nav]');
  function setCurrent(id) {
    navLinks.forEach(function (a) {
      if (a.dataset.nav === id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }
  setCurrent('home');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setCurrent(en.target.id); });
    }, { rootMargin: '-40% 0px -59% 0px' });
    ['home', 'ride', 'book', 'prices', 'trial'].forEach(function (id) { spy.observe(document.getElementById(id)); });
  }

  /* ---------- Timetable: phone-booking-slots structure ---------- */
  var WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var WD_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var WEEKDAY = [['06:30', 'spin'], ['07:30', 'hiit'], ['12:30', 'hiit'], ['13:15', 'recover'], ['17:30', 'spin'], ['18:30', 'hiit'], ['19:15', 'climb'], ['20:15', 'recover']];
  var WEEKEND = [['08:00', 'spin'], ['09:15', 'climb'], ['10:30', 'hiit'], ['11:45', 'recover'], ['16:00', 'spin']];
  var GROUPS = [['Morning', '00:00', '11:59'], ['Midday', '12:00', '16:59'], ['Evening', '17:00', '23:59']];

  var DAYS = [];
  for (var k = 0; k < 14; k++) {
    var d = new Date(2026, 9, 5 + k);
    var w = d.getDay();
    DAYS.push({ k: k, date: d.getDate(), w: w, out: k === 5, slots: (w === 0 || w === 6 ? WEEKEND : WEEKDAY) });
  }
  function isFull(day, i) { return day.out || (day.k * 7 + i * 3) % 9 === 0; }

  var state = { cls: 'any', day: 1, time: '19:15', booked: false };
  var strip = $('#strip');
  var groupsEl = $('#groups');
  var live = $('#book-live');
  var confirmBtn = $('#confirm');

  function slotFor(day, time) {
    for (var i = 0; i < day.slots.length; i++) if (day.slots[i][0] === time) return { i: i, time: time, cls: day.slots[i][1] };
    return null;
  }
  function slotOpen(day, s) { return s && !isFull(day, s.i) && (state.cls === 'any' || s.cls === state.cls); }

  function drawStrip() {
    strip.innerHTML = DAYS.map(function (day) {
      var label = WD_LONG[day.w] + ' ' + day.date + ' October' + (day.out ? ', fully booked' : '') + (day.k === 0 ? ', tomorrow' : '');
      return '<button type="button" class="day" data-k="' + day.k + '" aria-pressed="' + (day.k === state.day) + '"' +
        (day.out ? ' disabled' : '') + ' aria-label="' + label + '"><small>' + (day.k === 0 ? 'Tmrw' : WD[day.w]) + '</small><b>' + day.date + '</b></button>';
    }).join('');
  }

  function drawSlots() {
    var day = DAYS[state.day];
    $('#day-name').textContent = WD_LONG[day.w] + ' ' + day.date;
    groupsEl.innerHTML = GROUPS.map(function (g) {
      var list = day.slots.map(function (s, i) { return { i: i, time: s[0], cls: s[1] }; })
        .filter(function (s) { return s.time >= g[1] && s.time <= g[2]; });
      var open = list.filter(function (s) { return slotOpen(day, s); }).length;
      var count = !list.length ? 'none' : open ? open + ' open' : 'full';
      var body;
      if (!list.length) {
        body = '<p class="note">No ' + g[0].toLowerCase() + ' classes on ' + WD_LONG[day.w] + 's.</p>';
      } else if (!open) {
        body = '<p class="note">No ' + g[0].toLowerCase() + ' ' + (state.cls === 'any' ? 'rides' : CLASS_NAME[state.cls] + ' rides') + ' left on this day.</p>';
      } else {
        body = list.map(function (s) {
          var full = isFull(day, s.i);
          var other = !full && state.cls !== 'any' && s.cls !== state.cls;
          var on = s.time === state.time && !full && !other;
          var label = s.time + ' ' + CLASS_NAME[s.cls] + (full ? ', full' : other ? ', a different class' : '');
          return '<button type="button" class="slot' + (full ? ' full' : '') + (other ? ' other' : '') + '" data-t="' + s.time + '" aria-pressed="' + on + '"' +
            (full || other ? ' disabled' : '') + ' aria-label="' + label + '"><b>' + s.time + '</b><small>' + CLASS_NAME[s.cls] + '</small></button>';
        }).join('');
      }
      return '<div class="group" role="group" aria-label="' + g[0] + '"><h4>' + g[0] + '<span>' + count + '</span></h4><div class="slots">' + body + '</div></div>';
    }).join('');
  }

  var sumProfile = $('#sum-profile');
  function sync() {
    var day = DAYS[state.day];
    var s = state.time ? slotFor(day, state.time) : null;
    if (!slotOpen(day, s)) { state.time = null; s = null; }
    var filled = !!s;
    $('#sum-filled').hidden = !filled;
    $('#sum-empty').hidden = filled;
    confirmBtn.disabled = !filled;
    confirmBtn.classList.remove('done');
    state.booked = false;
    if (filled) {
      var when = WD[day.w] + ' ' + day.date + ' Oct, ' + s.time;
      $('#sum-title').textContent = CLASS_NAME[s.cls];
      $('#sum-when').textContent = when;
      if (sumProfile.dataset.class !== s.cls || !sumProfile.firstChild) renderProfile(sumProfile, s.cls);
      confirmBtn.textContent = 'Book ' + when;
    } else {
      confirmBtn.textContent = 'Pick a time first';
    }
  }

  function redraw(focusSel) {
    sync();
    drawSlots();
    if (focusSel) { var f = $(focusSel); if (f) f.focus(); }
  }

  strip.addEventListener('click', function (e) {
    var b = e.target.closest('.day');
    if (!b || b.disabled) return;
    state.day = +b.dataset.k;
    $$('.day', strip).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
    redraw();
    var day = DAYS[state.day];
    live.textContent = WD_LONG[day.w] + ' ' + day.date + ' October' + (state.time ? ', ' + state.time + ' kept' : '');
  });

  groupsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.slot');
    if (!b || b.disabled) return;
    state.time = b.dataset.t;
    redraw('.slot[data-t="' + state.time + '"]');
    var day = DAYS[state.day];
    live.textContent = WD[day.w] + ' ' + day.date + ' Oct, ' + state.time + ' selected';
  });

  var clsBtns = $$('.cls');
  function pickClass(btn, focus) {
    clsBtns.forEach(function (x) {
      var on = x === btn;
      x.setAttribute('aria-checked', on);
      x.tabIndex = on ? 0 : -1;
    });
    state.cls = btn.dataset.cls;
    if (focus) btn.focus();
    redraw();
    live.textContent = (state.cls === 'any' ? 'Any class' : CLASS_NAME[state.cls]) + ' selected' + (state.time ? '' : ', pick a time');
  }
  clsBtns.forEach(function (b, i) {
    b.addEventListener('click', function () { pickClass(b, false); });
    b.addEventListener('keydown', function (e) {
      var step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      pickClass(clsBtns[(i + step + clsBtns.length) % clsBtns.length], true);
    });
  });

  confirmBtn.addEventListener('click', function () {
    if (!state.time || state.booked) return;
    var day = DAYS[state.day];
    state.booked = true;
    confirmBtn.classList.add('done');
    confirmBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-9"/></svg>Booked · ' + WD[day.w] + ' ' + day.date + ' Oct, ' + state.time;
    live.textContent = 'Booked for ' + WD_LONG[day.w] + ' ' + day.date + ' October at ' + state.time;
  });

  drawStrip();
  redraw();
  (function centreDay() {
    var sel = $('.day[aria-pressed="true"]', strip);
    if (sel) strip.scrollLeft = sel.offsetLeft - strip.clientWidth / 2 + sel.offsetWidth / 2;
  })();

  /* ---------- Supporting effect 2: pricing annual toggle roll ---------- */
  var pricesSec = $('#prices');
  var seg = $('#seg');
  var segBtns = $$('button', seg);
  var priceLive = $('#price-live');
  var odos = $$('.odo').map(function (o) {
    var row = +o.closest('.plan').style.getPropertyValue('--r');
    var len = Math.max(o.dataset.m.length, o.dataset.a.length);
    var strips = [];
    for (var i = 0; i < len; i++) {
      var col = document.createElement('span');
      col.className = 'col';
      var st = document.createElement('span');
      st.className = 'strip-n';
      st.style.setProperty('--i', i);
      st.style.setProperty('--r', row);
      for (var n = 0; n < 10; n++) { var sp = document.createElement('span'); sp.textContent = n; st.appendChild(sp); }
      col.appendChild(st);
      o.appendChild(col);
      strips.push({ col: col, strip: st });
    }
    return { el: o, strips: strips, m: o.dataset.m, a: o.dataset.a };
  });

  var billing = null;
  function setBilling(mode, announce) {
    if (mode === billing) return;
    billing = mode;
    var annual = mode === 'annual';
    seg.classList.toggle('annual', annual);
    pricesSec.classList.toggle('annual-on', annual);
    segBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.bill === mode); });
    odos.forEach(function (o) {
      var v = annual ? o.a : o.m;
      var pad = o.strips.length - v.length;
      o.strips.forEach(function (s, i) {
        var blank = i < pad;
        s.col.classList.toggle('blank', blank);
        s.strip.style.setProperty('--n', blank ? 0 : v[i - pad]);
      });
    });
    if (announce) {
      priceLive.textContent = annual
        ? 'Annual billing, 2 months free: Off peak $58, Ten rides $74, Unlimited $116 per month.'
        : 'Monthly billing: Off peak $69, Ten rides $89, Unlimited $139 per month.';
    }
  }

  segBtns.forEach(function (b) {
    b.addEventListener('click', function () { autoRolled = true; setBilling(b.dataset.bill, true); });
  });

  var autoRolled = false;
  if (reduced() || !('IntersectionObserver' in window)) {
    setBilling('annual', false);
    autoRolled = true;
  } else {
    setBilling('monthly', false);
    var rollIO = new IntersectionObserver(function (entries) {
      if (!autoRolled && entries[0].intersectionRatio >= 0.45) {
        autoRolled = true;
        setTimeout(function () { setBilling('annual', true); }, 300);
        rollIO.disconnect();
      }
    }, { threshold: [0, 0.45, 0.6] });
    rollIO.observe(pricesSec);
  }

  /* ---------- Free ride form ---------- */
  var form = $('#form');
  var status = $('#status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements;
    var bad = [];
    var name = f.first.value.trim();
    var email = f.email.value.trim();
    function mark(input, msgEl, msg) {
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      $(msgEl).textContent = msg || '';
      if (msg) bad.push(input);
    }
    mark(f.first, '#e-name', name ? '' : 'Add your first name so the desk knows who you are.');
    mark(f.email, '#e-email', !email ? 'Add an email for your free ride.' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'That email is missing an @ or a domain.');
    var okMsg = f.ok.checked ? '' : 'Tick this so we can send your free ride.';
    f.ok.setAttribute('aria-invalid', okMsg ? 'true' : 'false');
    f.ok.closest('.check').classList.toggle('bad', !!okMsg);
    $('#e-ok').textContent = okMsg;
    if (okMsg) bad.push(f.ok);
    if (bad.length) { status.textContent = ''; bad[0].focus(); return; }
    var pick = f.cls.value ? ' Your first ' + f.cls.value + ' class' : ' Any class';
    status.textContent = 'Held, ' + name + '.' + pick + ' is free for the next seven days. Check your email to pick a time.';
  });
})();
