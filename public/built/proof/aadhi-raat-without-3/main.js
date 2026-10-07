/* Aadhi Raat — everything here runs from the file system, no dependencies. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var NPT_OFFSET_MIN = 5 * 60 + 45;          // Nepal Standard Time, UTC+5:45
  var LAT = 27.7172, LON = 85.3240;          // Kathmandu
  var DAY = 86400000;

  function $(id) { return document.getElementById(id); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---------- Kathmandu time ---------- */
  function ktmNow() {
    // A Date whose UTC fields read as Nepal local time.
    return new Date(Date.now() + NPT_OFFSET_MIN * 60000);
  }
  function hms(d) {
    return pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds());
  }
  function hm(min) {
    min = ((min % 1440) + 1440) % 1440;
    return pad(Math.floor(min / 60)) + ':' + pad(Math.floor(min % 60));
  }
  function dur(sec) {
    sec = Math.max(0, Math.floor(sec));
    return pad(Math.floor(sec / 3600)) + ':' + pad(Math.floor((sec % 3600) / 60)) + ':' + pad(sec % 60);
  }
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  /* ---------- Civil dawn for Kathmandu (NOAA approximation) ---------- */
  function civilDawnMinutes(d) {
    // d: Date whose UTC fields are Nepal local date. Returns minutes after local midnight.
    var start = Date.UTC(d.getUTCFullYear(), 0, 0);
    var doy = Math.floor((Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - start) / DAY);
    var rad = Math.PI / 180;
    var g = (2 * Math.PI / 365) * (doy - 1 + (5 - 12) / 24);
    var eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    var decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    var zenith = 96 * rad; // civil dawn: sun 6° below the horizon
    var cosHa = Math.cos(zenith) / (Math.cos(LAT * rad) * Math.cos(decl)) - Math.tan(LAT * rad) * Math.tan(decl);
    var ha = Math.acos(clamp(cosHa, -1, 1)) / rad;
    var utcMin = 720 - 4 * (LON + ha) - eqt;
    return utcMin + NPT_OFFSET_MIN;
  }

  /* ---------- Moon phase ---------- */
  function moonPhase(now) {
    var known = Date.UTC(2000, 0, 6, 18, 14); // a new moon
    var synodic = 29.530588853;
    var p = ((now - known) / DAY / synodic) % 1;
    if (p < 0) p += 1;
    return p;
  }
  function phaseName(p) {
    if (p < 0.03 || p > 0.97) return 'New moon';
    if (p < 0.22) return 'Waxing crescent';
    if (p < 0.28) return 'First quarter';
    if (p < 0.47) return 'Waxing gibbous';
    if (p < 0.53) return 'Full moon';
    if (p < 0.72) return 'Waning gibbous';
    if (p < 0.78) return 'Last quarter';
    return 'Waning crescent';
  }
  function setMoon(p) {
    var shadow = $('moonShadow');
    if (!shadow) return;
    var lit = (1 - Math.cos(2 * Math.PI * p)) / 2; // illuminated fraction
    var dir = p < 0.5 ? -1 : 1;                    // waxing lights the right edge
    shadow.style.transform = 'translateX(' + (dir * lit * 104) + '%)';
    var el = $('moonPhase');
    if (el) el.textContent = phaseName(p);
  }

  /* ---------- Clock loop ---------- */
  var state = { open: false, dawn: 330, lastDay: -1 };

  function tick() {
    var d = ktmNow();
    var dayKey = d.getUTCFullYear() * 400 + d.getUTCMonth() * 32 + d.getUTCDate();
    if (dayKey !== state.lastDay) {
      state.lastDay = dayKey;
      state.dawn = civilDawnMinutes(d);
      var dawnEl = $('dawnTime'), lenEl = $('windowLength');
      if (dawnEl) dawnEl.textContent = hm(state.dawn) + ' NPT';
      if (lenEl) lenEl.textContent = Math.floor(state.dawn / 60) + ' h ' + pad(Math.round(state.dawn % 60)) + ' min';
      setMoon(moonPhase(Date.now()));
      layoutTimeline();
      updateSleeveDormancy();
    }
    var secs = d.getUTCHours() * 3600 + d.getUTCMinutes() * 60 + d.getUTCSeconds();
    var mins = secs / 60;
    var open = mins < state.dawn;
    var timeStr = hms(d);

    var nav = $('navClock'); if (nav) nav.textContent = timeStr;
    var hero = $('heroClock'); if (hero) hero.textContent = timeStr;
    var date = $('heroDate');
    if (date) date.textContent = DAYS[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()] + ' · Nepal Standard Time';

    if (open !== state.open || document.body.dataset.window === 'unknown') {
      state.open = open;
      document.body.dataset.window = open ? 'open' : 'closed';
      var pill = $('statusPill'), detail = $('statusDetail'), sState = $('submitState'), btn = $('submitBtn');
      if (pill) pill.textContent = open ? 'Window open' : 'Window closed';
      if (detail) detail.textContent = open
        ? 'The tape is rolling. Tonight it stops at civil dawn, ' + hm(state.dawn) + '.'
        : 'Opens at midnight, Kathmandu time. First light tomorrow is at ' + hm(state.dawn) + '.';
      if (sState) sState.textContent = open ? 'The desk is open.' : 'The desk is asleep until midnight.';
      if (btn) {
        btn.textContent = open ? 'Open the desk' : 'Sleeping until 00:00 NPT';
        btn.setAttribute('aria-disabled', open ? 'false' : 'true');
        if (!open) { btn.setAttribute('aria-expanded', 'false'); var panel = $('submitPanel'); if (panel) panel.hidden = true; }
      }
    }
    var cd = $('submitCountdown');
    if (cd) cd.textContent = open
      ? 'Closes in ' + dur(state.dawn * 60 - secs)
      : 'Opens in ' + dur(86400 - secs);
    moveTimelineNow(mins);
  }

  /* ---------- Timeline ---------- */
  function layoutTimeline() {
    var ticks = $('tlTicks'), win = $('tlWindow');
    if (!ticks || !win) return;
    var html = '';
    for (var h = 0; h <= 24; h++) {
      var x = (h / 24) * 1000;
      var major = h % 6 === 0;
      html += '<line x1="' + x + '" y1="' + (major ? 56 : 62) + '" x2="' + x + '" y2="' + (major ? 104 : 98) + '"' + (major ? ' class="major"' : '') + '></line>';
    }
    ticks.innerHTML = html;
    win.setAttribute('width', (state.dawn / 1440) * 1000);
  }
  function moveTimelineNow(mins) {
    var now = $('tlNow');
    if (now) now.setAttribute('transform', 'translate(' + ((mins / 1440) * 1000) + ' 0)');
  }

  /* ---------- Sky canvas ---------- */
  function initSky() {
    var canvas = $('sky');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var stars = [], meteors = [], w = 0, h = 0, dpr = 1, scrollY = 0, raf = 0, t0 = performance.now();

    function resize() {
      var r = canvas.parentElement.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round((w * h) / 2600);
      stars = [];
      for (var i = 0; i < n; i++) {
        var depth = Math.random();
        stars.push({ x: Math.random() * w, y: Math.random() * h * 0.92, r: 0.3 + depth * 1.3, d: depth, ph: Math.random() * Math.PI * 2, sp: 0.4 + Math.random() * 1.6, warm: Math.random() < 0.12 });
      }
      draw(performance.now());
    }
    function draw(now) {
      var t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var tw = reduceMotion.matches ? 0.75 : 0.55 + 0.45 * Math.sin(s.ph + t * s.sp);
        var drift = reduceMotion.matches ? 0 : t * 1.2 * (0.3 + s.d);
        var x = (s.x + drift) % (w + 4);
        var y = s.y - scrollY * 0.18 * s.d;
        if (y < -4) continue;
        ctx.globalAlpha = (0.25 + 0.75 * s.d) * tw;
        ctx.fillStyle = s.warm ? '#f2c589' : '#efe9dc';
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduceMotion.matches) {
        if (Math.random() < 0.004 && meteors.length < 2) {
          meteors.push({ x: Math.random() * w * 0.8, y: Math.random() * h * 0.4, vx: 7 + Math.random() * 5, vy: 3 + Math.random() * 2, life: 1 });
        }
        for (var m = meteors.length - 1; m >= 0; m--) {
          var mt = meteors[m];
          mt.x += mt.vx; mt.y += mt.vy; mt.life -= 0.02;
          if (mt.life <= 0) { meteors.splice(m, 1); continue; }
          var grad = ctx.createLinearGradient(mt.x, mt.y, mt.x - mt.vx * 9, mt.y - mt.vy * 9);
          grad.addColorStop(0, 'rgba(239,233,220,' + mt.life + ')');
          grad.addColorStop(1, 'rgba(239,233,220,0)');
          ctx.strokeStyle = grad; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(mt.x, mt.y); ctx.lineTo(mt.x - mt.vx * 9, mt.y - mt.vy * 9); ctx.stroke();
        }
      }
    }
    function loop(now) { draw(now); raf = requestAnimationFrame(loop); }
    function start() {
      cancelAnimationFrame(raf);
      if (reduceMotion.matches) draw(performance.now()); else raf = requestAnimationFrame(loop);
    }
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', function () {
      scrollY = window.scrollY || 0;
      if (reduceMotion.matches) draw(performance.now());
      var moon = $('moon');
      if (moon && !reduceMotion.matches) moon.style.transform = 'translateY(' + (scrollY * 0.35) + 'px)';
    }, { passive: true });
    reduceMotion.addEventListener('change', start);
    resize();
    start();
  }

  /* ---------- Lamp cursor ---------- */
  function initLamp() {
    var lamp = document.querySelector('.lamp');
    if (!lamp || !finePointer.matches || reduceMotion.matches) return;
    var tx = -999, ty = -999, x = tx, y = ty, shown = false;
    window.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { shown = true; lamp.classList.add('on'); }
    }, { passive: true });
    document.addEventListener('mouseleave', function () { lamp.classList.remove('on'); shown = false; });
    (function frame() {
      x += (tx - x) * 0.14; y += (ty - y) * 0.14;
      lamp.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      requestAnimationFrame(frame);
    })();
  }

  /* ---------- Scroll reveals and manifesto ---------- */
  function initReveals() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion.matches) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
    items.forEach(function (el) { io.observe(el); });
  }
  function initManifesto() {
    var el = document.querySelector('[data-split]');
    if (!el) return;
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    var spans = el.querySelectorAll('.w');
    if (reduceMotion.matches) { spans.forEach(function (s) { s.classList.add('on'); }); return; }
    function update() {
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight;
      var progress = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
      var count = Math.round(progress * spans.length);
      for (var i = 0; i < spans.length; i++) spans[i].classList.toggle('on', i < count);
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Sleeves: generative sky per hour ---------- */
  function rng(seed) {
    var s = seed >>> 0;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }
  function drawSleeve(canvas, hour, seed) {
    var size = 480;
    canvas.width = size; canvas.height = size;
    var ctx = canvas.getContext('2d');
    var r = rng(seed);
    var depth = 1 - Math.abs(hour - 2.5) / 3.5; // darkest around 02:30
    var top = hour >= 5 ? '#1b2440' : hour >= 4 ? '#0e1226' : '#06060c';
    var mid = hour >= 5 ? '#2a2d4a' : '#0b0d1a';
    var g = ctx.createLinearGradient(0, 0, 0, size);
    g.addColorStop(0, top); g.addColorStop(0.75, mid); g.addColorStop(1, hour >= 4 ? '#3b2a3a' : '#1b1530');
    ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

    var n = Math.round(120 + depth * 260);
    for (var i = 0; i < n; i++) {
      var d = r();
      ctx.globalAlpha = 0.2 + d * 0.8 * (hour >= 5 ? 0.5 : 1);
      ctx.fillStyle = r() < 0.1 ? '#f2c589' : '#efe9dc';
      ctx.beginPath(); ctx.arc(r() * size, r() * size * 0.8, 0.4 + d * 1.6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // moon travelling west through the window
    var mx = size * (0.82 - hour * 0.12), my = size * (0.22 + hour * 0.03);
    var mr = 22 + r() * 10;
    ctx.save();
    ctx.shadowColor = 'rgba(239,233,220,0.5)'; ctx.shadowBlur = 40;
    ctx.fillStyle = '#efe9dc'; ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    var p = moonPhase(Date.now());
    var lit = (1 - Math.cos(2 * Math.PI * p)) / 2;
    ctx.fillStyle = top;
    ctx.beginPath(); ctx.arc(mx + (p < 0.5 ? -1 : 1) * lit * mr * 2.08, my, mr * 1.02, 0, Math.PI * 2); ctx.fill();

    // hills
    ctx.fillStyle = '#0f1124';
    ctx.beginPath(); ctx.moveTo(0, size * 0.72);
    for (var x = 0; x <= size; x += 24) ctx.lineTo(x, size * (0.66 + Math.sin(x / 70 + seed) * 0.03 + r() * 0.01));
    ctx.lineTo(size, size); ctx.lineTo(0, size); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#050509';
    ctx.beginPath(); ctx.moveTo(0, size * 0.82);
    for (var x2 = 0; x2 <= size; x2 += 20) ctx.lineTo(x2, size * (0.78 + Math.sin(x2 / 45 + seed * 2) * 0.025));
    ctx.lineTo(size, size); ctx.lineTo(0, size); ctx.closePath(); ctx.fill();

    // a few sodium windows
    var wins = 2 + Math.floor(r() * 5);
    ctx.fillStyle = '#f2a33a';
    for (var k = 0; k < wins; k++) { ctx.globalAlpha = 0.5 + r() * 0.5; ctx.fillRect(Math.floor(r() * size), size * (0.84 + r() * 0.1), 3, 4); }
    ctx.globalAlpha = 1;

    // the hour
    ctx.fillStyle = '#efe9dc';
    ctx.font = 'italic 150px "Instrument Serif", Georgia, serif';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(pad(hour), 28, size - 40);
    ctx.font = '13px "Space Mono", monospace';
    ctx.fillStyle = 'rgba(239,233,220,0.7)';
    ctx.fillText('AADHI RAAT  ·  ' + pad(hour) + ':00 – ' + pad(hour) + ':59 NPT', 30, 40);
  }
  var sleeveEls = [];
  function initSleeves() {
    var grid = $('sleeveGrid');
    if (!grid) return;
    var frag = document.createDocumentFragment();
    for (var h = 0; h < 6; h++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sleeve';
      btn.setAttribute('aria-label', 'Sleeve for the hour ' + pad(h) + ':00 to ' + pad(h) + ':59. Press to redraw.');
      btn.dataset.hour = h;
      btn.dataset.seed = Math.floor(Math.random() * 1e9);
      btn.innerHTML = '<div class="sleeve-art"><canvas width="480" height="480"></canvas></div>' +
        '<div class="sleeve-meta"><b>Hour ' + pad(h) + '</b><span>' + pad(h) + ':00 – ' + pad(h) + ':59</span></div>' +
        '<p class="sleeve-hint">Press to redraw the sky.</p>';
      frag.appendChild(btn);
      sleeveEls.push(btn);
    }
    grid.appendChild(frag);
    sleeveEls.forEach(function (btn) {
      var canvas = btn.querySelector('canvas');
      var h = +btn.dataset.hour;
      drawSleeve(canvas, h, +btn.dataset.seed);
      btn.addEventListener('click', function () {
        btn.dataset.seed = Math.floor(Math.random() * 1e9);
        drawSleeve(canvas, h, +btn.dataset.seed);
      });
      if (finePointer.matches && !reduceMotion.matches) {
        btn.addEventListener('pointermove', function (e) {
          var rc = btn.getBoundingClientRect();
          var px = (e.clientX - rc.left) / rc.width - 0.5, py = (e.clientY - rc.top) / rc.height - 0.5;
          btn.style.transform = 'rotateX(' + (-py * 10) + 'deg) rotateY(' + (px * 12) + 'deg) translateZ(6px)';
        });
        btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
      }
    });
    // Redraw once the display font is in, so the numerals use the serif.
    if (document.fonts && document.fonts.load) {
      document.fonts.load('italic 150px "Instrument Serif"').then(function () {
        sleeveEls.forEach(function (btn) { drawSleeve(btn.querySelector('canvas'), +btn.dataset.hour, +btn.dataset.seed); });
      }).catch(function () {});
    }
  }
  function updateSleeveDormancy() {
    sleeveEls.forEach(function (btn) {
      var h = +btn.dataset.hour;
      var dormant = h * 60 >= state.dawn;
      btn.style.opacity = dormant ? '0.42' : '';
      var hint = btn.querySelector('.sleeve-hint');
      if (hint) hint.textContent = dormant ? 'After tonight’s dawn. Waits for longer nights.' : 'Press to redraw the sky.';
    });
  }

  /* ---------- Submission desk ---------- */
  function initSubmit() {
    var btn = $('submitBtn'), panel = $('submitPanel');
    if (!btn || !panel) return;
    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-disabled') === 'true') return;
      var openNow = panel.hidden;
      panel.hidden = !openNow;
      btn.setAttribute('aria-expanded', openNow ? 'true' : 'false');
      btn.textContent = openNow ? 'Close the desk' : 'Open the desk';
    });
  }

  /* ---------- Sound: a night drone, only on request ---------- */
  function initSound() {
    var btn = $('soundToggle');
    if (!btn) return;
    var ctx = null, master = null, nodes = [], bellTimer = 0, on = false;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { btn.disabled = true; btn.querySelector('.sound-text').textContent = 'No sound'; return; }

    function build() {
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0;
      var comp = ctx.createDynamicsCompressor();
      master.connect(comp); comp.connect(ctx.destination);

      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420; lp.Q.value = 0.6;
      lp.connect(master);
      [[55, 'sine', 0.22], [55.4, 'sine', 0.16], [110, 'triangle', 0.06], [82.4, 'sine', 0.08], [164.8, 'sine', 0.025]].forEach(function (spec) {
        var o = ctx.createOscillator(); o.type = spec[1]; o.frequency.value = spec[0];
        var g = ctx.createGain(); g.gain.value = spec[2];
        o.connect(g); g.connect(lp); o.start(); nodes.push(o);
      });
      var lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
      var lfoG = ctx.createGain(); lfoG.gain.value = 140;
      lfo.connect(lfoG); lfoG.connect(lp.frequency); lfo.start(); nodes.push(lfo);

      // city hush: filtered noise that breathes
      var len = ctx.sampleRate * 4, buf = ctx.createBuffer(1, len, ctx.sampleRate), data = buf.getChannelData(0);
      var last = 0;
      for (var i = 0; i < len; i++) { var white = Math.random() * 2 - 1; last = (last + 0.02 * white) / 1.02; data[i] = last * 3.5; }
      var noise = ctx.createBufferSource(); noise.buffer = buf; noise.loop = true;
      var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 600; bp.Q.value = 0.5;
      var ng = ctx.createGain(); ng.gain.value = 0.05;
      noise.connect(bp); bp.connect(ng); ng.connect(master); noise.start(); nodes.push(noise);
      var lfo2 = ctx.createOscillator(); lfo2.frequency.value = 0.045;
      var lfo2G = ctx.createGain(); lfo2G.gain.value = 0.03;
      lfo2.connect(lfo2G); lfo2G.connect(ng.gain); lfo2.start(); nodes.push(lfo2);
    }
    function bell() {
      if (!ctx || !on) return;
      var t = ctx.currentTime;
      var base = [523.25, 659.25, 783.99, 1046.5][Math.floor(Math.random() * 4)];
      [[1, 0.18], [2.76, 0.07], [5.4, 0.025]].forEach(function (h) {
        var o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = base * h[0];
        var g = ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(h[1], t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 6 / h[0]);
        o.connect(g); g.connect(master); o.start(t); o.stop(t + 6.5);
      });
      bellTimer = setTimeout(bell, 9000 + Math.random() * 11000);
    }
    function setOn(v) {
      on = v;
      btn.setAttribute('aria-pressed', v ? 'true' : 'false');
      btn.querySelector('.sound-text').textContent = v ? 'Sound on' : 'Sound off';
      if (v) {
        if (!ctx) build();
        if (ctx.state === 'suspended') ctx.resume();
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 2.5);
        clearTimeout(bellTimer);
        bellTimer = setTimeout(bell, 2500 + Math.random() * 4000);
      } else if (ctx) {
        clearTimeout(bellTimer);
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
      }
    }
    btn.addEventListener('click', function () { setOn(!on); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && on) setOn(false);
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    initSky();
    initLamp();
    initReveals();
    initManifesto();
    initSleeves();
    initSubmit();
    initSound();
    tick();
    setInterval(tick, 250);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
