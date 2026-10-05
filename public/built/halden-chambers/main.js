/* Halden Chambers · Designed using Design Lounge (https://www.designlounge.live) */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');
  var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = reduceQuery.matches;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var clamp = function (v, lo, hi) { return Math.min(hi === undefined ? 1 : hi, Math.max(lo || 0, v)); };
  var ALERT = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/></svg>';

  /* Phone menu */
  var menuBtn = $('.menu-btn');
  var menu = $('#menu');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('open', open);
    root.style.overflow = open ? 'hidden' : '';
    if (open) {
      var first = $('a', menu);
      if (first) setTimeout(function () { first.focus(); }, 60);
    }
  }
  menuBtn.addEventListener('click', function () {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
  $$('a', menu).forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      setMenu(false);
      menuBtn.focus();
    }
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', function (e) {
    if (e.matches) setMenu(false);
  });

  /* Section heading mask reveal (text-mask-line-reveal), one per section */
  var reveals = $$('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('go'); });
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('go');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { revealIO.observe(el); });
  }

  /* Header CTA steps aside while the enquiry form is on screen */
  var headerCta = $('.header-cta');
  var enquire = $('#enquire');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        headerCta.classList.toggle('is-away', entry.isIntersecting);
      });
    }, { threshold: 0.2 }).observe(enquire);
  }

  /* Current nav item while scrolling */
  var navLinks = $$('.nav a');
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['practice', 'approach', 'partners', 'principles', 'enquire'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) navIO.observe(el);
    });
  }

  /* Partners filter (people-role-list) */
  var peopleQ = $('#people-q');
  var pills = $$('.pill');
  var people = $$('.person');
  var peopleEmpty = $('#people-empty');
  var role = 'all';
  function filterPeople() {
    var q = peopleQ.value.trim().toLowerCase();
    var shown = 0;
    people.forEach(function (p) {
      var okRole = role === 'all' || p.getAttribute('data-role') === role;
      var okText = !q || p.textContent.toLowerCase().indexOf(q) !== -1;
      var show = okRole && okText;
      p.hidden = !show;
      if (show) shown++;
    });
    peopleEmpty.hidden = shown !== 0;
  }
  pills.forEach(function (b) {
    b.addEventListener('click', function () {
      role = b.getAttribute('data-role');
      pills.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      filterPeople();
    });
  });
  peopleQ.addEventListener('input', filterPeople);
  peopleQ.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { peopleQ.value = ''; filterPeople(); }
  });
  $('#people-clear').addEventListener('click', function () {
    peopleQ.value = '';
    role = 'all';
    pills.forEach(function (o) { o.setAttribute('aria-pressed', String(o.getAttribute('data-role') === 'all')); });
    filterPeople();
    peopleQ.focus();
  });

  /* Principles: scroll word highlight (lead effect) */
  var runway = $('#principles');
  var para = $('#manifesto');
  var counter = $('#counter');
  var track = $('#track');
  var words = [];
  var groups = [];
  (function split() {
    var sr = document.createElement('span');
    sr.className = 'sr';
    sr.textContent = para.textContent.replace(/\s+/g, ' ').trim();
    var vis = document.createElement('span');
    vis.setAttribute('aria-hidden', 'true');
    function add(text, g) {
      (text.match(/\s+|\S+/g) || []).forEach(function (tok) {
        var isSpace = /^\s/.test(tok);
        if (isSpace && !g) { vis.appendChild(document.createTextNode(' ')); return; }
        var s = document.createElement('span');
        s.textContent = isSpace ? ' ' : tok;
        if (!isSpace) { s.className = 'w'; words.push({ el: s, o: -1 }); }
        if (g) {
          s.classList.add('k');
          s.style.setProperty('--j', g.els.length);
          g.els.push(s);
          if (!isSpace) g.last = words.length - 1;
        }
        vis.appendChild(s);
      });
    }
    Array.prototype.slice.call(para.childNodes).forEach(function (n) {
      if (n.nodeType === 3) add(n.textContent);
      else {
        var g = { els: [], last: 0, on: false };
        groups.push(g);
        add(n.textContent, g);
      }
    });
    para.textContent = '';
    para.appendChild(sr);
    para.appendChild(vis);
  })();
  var N = words.length;

  function lightAll() {
    words.forEach(function (w) { w.el.style.opacity = '1'; });
    groups.forEach(function (g) { g.els.forEach(function (el) { el.classList.add('on'); }); });
  }

  if (reduce) {
    lightAll();
  } else {
    var ticking = false;
    var lastLit = -1;
    var frame = function () {
      ticking = false;
      var range = runway.offsetHeight - window.innerHeight;
      var t = range > 0 ? clamp(-runway.getBoundingClientRect().top / (range * 0.8)) : 1;
      var f = 0.6 + t * (N + 0.4);
      var lit = 0;
      for (var i = 0; i < N; i++) {
        var o = +(0.18 + 0.82 * clamp(f - i)).toFixed(3);
        if (o === 1) lit++;
        if (o !== words[i].o) { words[i].o = o; words[i].el.style.opacity = o; }
      }
      groups.forEach(function (g) {
        var on = f >= g.last + 1;
        if (on !== g.on) {
          g.on = on;
          g.els.forEach(function (el) { el.classList.toggle('on', on); });
        }
      });
      if (lit !== lastLit) { lastLit = lit; counter.textContent = lit + ' / ' + N; }
      track.style.transform = 'scaleX(' + t.toFixed(4) + ')';
    };
    var schedule = function () {
      if (!ticking) { ticking = true; requestAnimationFrame(frame); }
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    frame();
  }

  /* Enquiry: stepped brief (contact-project-brief-steps) */
  var form = $('#brief');
  var steps = $$('.step', form);
  var stepLabel = $('#step-label');
  var boxes = $$('.box');
  var railRows = $$('.rail li');
  var backBtn = $('#back');
  var nextBtn = $('#next');
  var nextLabel = $('#next-label');
  var sent = $('#sent');
  var F = form.elements;
  var cur = 1;

  function show(n, focus) {
    cur = n;
    steps.forEach(function (s) {
      var on = +s.getAttribute('data-step') === n;
      s.hidden = !on;
      s.classList.remove('enter');
      if (on && focus && !reduce) {
        void s.offsetWidth;
        s.classList.add('enter');
      }
    });
    stepLabel.textContent = n < 5 ? 'Step ' + n + ' of 4' : 'Review';
    boxes.forEach(function (b, i) {
      b.classList.toggle('done', i + 1 < n);
      b.classList.toggle('cur', i + 1 === n);
    });
    railRows.forEach(function (r, i) {
      r.classList.toggle('done', i + 1 < n);
      if (i + 1 === n) r.setAttribute('aria-current', 'step');
      else r.removeAttribute('aria-current');
    });
    backBtn.hidden = n === 1;
    nextLabel.textContent = n < 4 ? 'Next' : n === 4 ? 'Review' : 'Send privately';
    if (n === 5) fillReview();
    if (focus) {
      var h = $('.step-h', steps[n - 1]);
      if (h) h.focus({ preventScroll: true });
      var top = $('.card').getBoundingClientRect().top;
      if (top < 0) $('.card').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  }

  function setErr(id, msg) {
    var p = document.getElementById(id);
    if (msg) { p.innerHTML = ALERT + '<span></span>'; p.lastChild.textContent = msg; p.hidden = false; }
    else { p.hidden = true; p.textContent = ''; }
  }

  function groupCheck(name, errId, msg) {
    var inputs = $$('input[name="' + name + '"]', form);
    var ok = inputs.some(function (i) { return i.checked; });
    setErr(errId, ok ? '' : msg);
    return ok ? null : inputs[0];
  }

  function fieldCheck(el, errId, test, msg) {
    var ok = test(el.value.trim());
    el.setAttribute('aria-invalid', String(!ok));
    setErr(errId, ok ? '' : msg);
    return ok ? null : el;
  }

  function validate(n) {
    if (n === 1) return groupCheck('matter', 'e-matter', 'Pick at least one, or choose Not sure yet.');
    if (n === 2) return groupCheck('stage', 'e-stage', 'Choose where the matter stands today.');
    if (n === 3) return groupCheck('when', 'e-when', 'Choose how soon you need us.');
    if (n === 4) {
      return [
        fieldCheck(F.fullname, 'e-name', function (v) { return v.length > 1; }, 'Enter your name.'),
        fieldCheck(F.email, 'e-email', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, 'Enter an email like name@company.com.'),
        fieldCheck(F.outline, 'e-msg', function (v) { return v.length >= 20; }, 'Write at least 20 characters so the partner knows where to start.')
      ].filter(Boolean)[0] || null;
    }
    return null;
  }

  function checkedValues(name) {
    return $$('input[name="' + name + '"]:checked', form).map(function (i) { return i.value; });
  }

  function fillReview() {
    $('#r-1').textContent = checkedValues('matter').join(', ');
    $('#r-2').textContent = checkedValues('stage')[0] || '';
    $('#r-3').textContent = checkedValues('when')[0] || '';
    var about = [F.fullname.value.trim(), F.email.value.trim(), F.org.value.trim()].filter(Boolean).join(', ');
    var other = F.other.value.trim();
    $('#r-4').textContent = about + (other ? '. Other side: ' + other : '');
  }

  ['matter', 'stage', 'when'].forEach(function (name, i) {
    var errId = ['e-matter', 'e-stage', 'e-when'][i];
    $$('input[name="' + name + '"]', form).forEach(function (inp) {
      inp.addEventListener('change', function () { setErr(errId, ''); });
    });
  });
  [[F.fullname, 'e-name'], [F.email, 'e-email'], [F.outline, 'e-msg']].forEach(function (pair) {
    pair[0].addEventListener('input', function () {
      if (pair[0].getAttribute('aria-invalid') === 'true') {
        pair[0].setAttribute('aria-invalid', 'false');
        setErr(pair[1], '');
      }
    });
  });
  var count = $('#f-count');
  F.outline.addEventListener('input', function () {
    count.textContent = F.outline.value.length + ' / 800, at least 20 characters';
  });

  backBtn.addEventListener('click', function () { if (cur > 1) show(cur - 1, true); });
  $$('.edit', form).forEach(function (b) {
    b.addEventListener('click', function () { show(+b.getAttribute('data-go'), true); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (nextBtn.getAttribute('aria-busy') === 'true') return;
    if (cur < 5) {
      var bad = validate(cur);
      if (bad) { bad.focus(); return; }
      show(cur + 1, true);
      return;
    }
    nextBtn.setAttribute('aria-busy', 'true');
    nextLabel.textContent = 'Sending';
    setTimeout(function () {
      nextBtn.removeAttribute('aria-busy');
      var d = new Date();
      var ref = 'HC-' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(Math.floor(100 + Math.random() * 900));
      $('#sent-ref').textContent = ref;
      $('#sent-email').textContent = F.email.value.trim();
      form.hidden = true;
      $('.card-bar .label').textContent = 'Sent';
      boxes.forEach(function (b) { b.classList.add('done'); b.classList.remove('cur'); });
      railRows.forEach(function (r) { r.classList.add('done'); r.removeAttribute('aria-current'); });
      sent.hidden = false;
      $('.sent-h').focus();
    }, 700);
  });

  $('#again').addEventListener('click', function () {
    form.reset();
    $$('[aria-invalid]', form).forEach(function (el) { el.setAttribute('aria-invalid', 'false'); });
    $$('.err', form).forEach(function (p) { p.hidden = true; p.textContent = ''; });
    count.textContent = '0 / 800, at least 20 characters';
    sent.hidden = true;
    form.hidden = false;
    show(1, true);
  });

  /* Practice rows preselect the matter in the enquiry */
  $$('.area a[data-matter]').forEach(function (a) {
    a.addEventListener('click', function () {
      var v = a.getAttribute('data-matter');
      $$('input[name="matter"]', form).forEach(function (i) { if (i.value === v) i.checked = true; });
      setErr('e-matter', '');
      if (!sent.hidden) return;
      if (cur !== 1) show(1, false);
    });
  });

  /* Back to top (footer-centered-colophon) */
  $('#to-top').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceQuery.matches ? 'auto' : 'smooth' });
    var wm = $('.wordmark');
    if (wm) wm.focus({ preventScroll: true });
  });

  show(1, false);
})();
