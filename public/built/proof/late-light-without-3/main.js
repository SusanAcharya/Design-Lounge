/* Late Light — scroll, and you travel. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var docEl = document.documentElement;
  var body = document.body;

  /* ---------- Sky: a starfield you fly through ---------- */
  var canvas = document.getElementById('sky');
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, DPR = 1, focal = 0;
  var stars = [];
  var lastY = window.scrollY;
  var vel = 0;            // forward speed in z per frame
  var pendingDelta = 0;   // scroll distance since last frame
  var raf = 0;
  var visible = true;

  var palette = ['#ffffff', '#dfe6ff', '#fff1dc', '#c9d4ff', '#ffe4c4'];

  function makeStar(z) {
    return {
      x: (Math.random() * 2 - 1) * 1.4,
      y: (Math.random() * 2 - 1) * 1.4,
      z: z == null ? Math.random() : z,
      m: 0.35 + Math.random() * 0.65,
      c: palette[(Math.random() * palette.length) | 0],
      px: null, py: null
    };
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    focal = Math.min(W, H) * 0.7;
    var n = W < 700 ? 320 : 620;
    if (stars.length !== n) {
      stars = [];
      for (var i = 0; i < n; i++) stars.push(makeStar());
    } else {
      for (var j = 0; j < stars.length; j++) { stars[j].px = null; }
    }
    draw(true);
  }

  function project(s) {
    var k = focal / s.z;
    return [W / 2 + s.x * k, H / 2 + s.y * k];
  }

  function draw(still) {
    ctx.fillStyle = '#05070f';
    ctx.fillRect(0, 0, W, H);

    var speed = Math.abs(vel);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      if (!still) {
        s.z -= vel;
        if (s.z <= 0.02) { var ns = makeStar(1); s.x = ns.x; s.y = ns.y; s.z = 1; s.px = null; }
        else if (s.z > 1) { var ns2 = makeStar(0.03); s.x = ns2.x; s.y = ns2.y; s.z = 0.03 + Math.random() * 0.05; s.px = null; }
      }
      var p = project(s);
      var x = p[0], y = p[1];
      if (x < -40 || x > W + 40 || y < -40 || y > H + 40) { s.px = x; s.py = y; continue; }

      var depth = 1 - s.z;                      // 0 far, 1 near
      var r = s.m * (0.4 + depth * 1.6);
      var a = Math.min(1, 0.25 + depth * 0.9) * (0.5 + s.m * 0.5);

      if (!still && speed > 0.0025 && s.px !== null) {
        var dx = x - s.px, dy = y - s.py;
        var len = Math.sqrt(dx * dx + dy * dy);
        if (len > 1.5 && len < 400) {
          ctx.strokeStyle = s.c;
          ctx.globalAlpha = a * Math.min(1, 0.35 + speed * 30);
          ctx.lineWidth = r;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(s.px, s.py);
          ctx.lineTo(x, y);
          ctx.stroke();
          s.px = x; s.py = y;
          continue;
        }
      }
      ctx.globalAlpha = a;
      ctx.fillStyle = s.c;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 6.2832);
      ctx.fill();
      s.px = x; s.py = y;
    }
    ctx.globalAlpha = 1;
  }

  function frame() {
    raf = 0;
    // forward speed follows scrolling; a little drift keeps the sky alive at rest
    var target = pendingDelta * 0.00045 + 0.00035;
    pendingDelta = 0;
    target = Math.max(-0.08, Math.min(0.08, target));
    vel += (target - vel) * 0.14;
    draw(false);
    if (visible) raf = requestAnimationFrame(frame);
  }

  /* ---------- Stages, bodies, readout ---------- */
  var stages = Array.prototype.slice.call(document.querySelectorAll('.stage'));
  var wraps = stages.map(function (s) { return s.querySelector('.body-wrap'); });
  var earthWrap = document.querySelector('.body-earth');
  var railLinks = {};
  Array.prototype.forEach.call(document.querySelectorAll('.rail a'), function (a) { railLinks[a.getAttribute('data-stop')] = a; });
  var numEl = document.getElementById('dist-num');
  var unitEl = document.getElementById('dist-unit');
  var ageEl = document.getElementById('dist-age');

  var YEAR = 31557600;
  var EPS = 0.05;
  var lastNumText = '', lastUnitText = '', lastAgeText = '';

  function fmtDistance(sec) {
    if (sec < 0.1) return ['0', 'light-seconds from Earth'];
    if (sec < 60) return [sec.toFixed(1), 'light-seconds from Earth'];
    if (sec < 3600) return [(sec / 60).toFixed(1), 'light-minutes from Earth'];
    if (sec < 86400) return [(sec / 3600).toFixed(1), 'light-hours from Earth'];
    if (sec < YEAR) return [(sec / 86400).toFixed(1), 'light-days from Earth'];
    var y = sec / YEAR;
    if (y < 100) return [y.toFixed(2), 'light-years from Earth'];
    if (y < 1e6) return [Math.round(y).toLocaleString('en-US'), 'light-years from Earth'];
    return [(y / 1e6).toFixed(2) + ' million', 'light-years from Earth'];
  }

  function fmtAge(sec) {
    if (sec < 0.1) return 'the light here is new';
    if (sec < 60) return 'the light here left ' + sec.toFixed(1) + ' seconds ago';
    if (sec < 3600) return 'the light here left ' + (sec / 60).toFixed(1) + ' minutes ago';
    if (sec < 86400) return 'the light here left ' + (sec / 3600).toFixed(1) + ' hours ago';
    if (sec < YEAR) return 'the light here left ' + (sec / 86400).toFixed(1) + ' days ago';
    var y = sec / YEAR;
    if (y < 100) return 'the light here left ' + y.toFixed(1) + ' years ago';
    if (y < 1e6) return 'the light here left ' + Math.round(y).toLocaleString('en-US') + ' years ago';
    return 'the light here left ' + (y / 1e6).toFixed(1) + ' million years ago';
  }

  var tops = [];
  function measure() {
    tops = stages.map(function (s) { return s.offsetTop; });
  }

  function distanceAt(scrollY) {
    var y = scrollY + H * 0.08;
    var i = 0;
    while (i < tops.length - 1 && y >= tops[i + 1]) i++;
    var d0 = parseFloat(stages[i].getAttribute('data-dist')) || 0;
    if (i >= tops.length - 1) return d0;
    var d1 = parseFloat(stages[i + 1].getAttribute('data-dist')) || 0;
    var span = Math.max(1, tops[i + 1] - tops[i]);
    var t = Math.max(0, Math.min(1, (y - tops[i]) / span));
    // hold the stop's own distance while it fills the view, then run to the next
    t = Math.max(0, Math.min(1, (t - 0.4) / 0.6));
    t = t * t * (3 - 2 * t);
    var l0 = Math.log(d0 + EPS), l1 = Math.log(d1 + EPS);
    return Math.exp(l0 + (l1 - l0) * t) - EPS;
  }

  function updateReadout(scrollY) {
    var d = Math.max(0, distanceAt(scrollY));
    var f = fmtDistance(d);
    if (f[0] !== lastNumText) { numEl.textContent = f[0]; lastNumText = f[0]; }
    if (f[1] !== lastUnitText) { unitEl.textContent = f[1]; lastUnitText = f[1]; }
    var age = fmtAge(d);
    if (age !== lastAgeText) { ageEl.textContent = age; lastAgeText = age; }
  }

  function updateBodies(scrollY) {
    if (reduceMotion) return;
    for (var i = 0; i < stages.length; i++) {
      var wrap = wraps[i];
      if (!wrap) continue;
      var rect = stages[i].getBoundingClientRect();
      if (rect.bottom < -H || rect.top > H * 2) continue;
      if (wrap === earthWrap) {
        // Earth drops away as you lift off.
        var lift = Math.max(0, Math.min(1, scrollY / H));
        wrap.style.setProperty('--fy', (lift * H * 0.6).toFixed(1) + 'px');
        wrap.style.setProperty('--fs', (1 - lift * 0.12).toFixed(3));
        continue;
      }
      // t: +1 when the stage is a full viewport below, 0 centred, -1 a full viewport above
      var t = (rect.top + rect.height / 2 - H / 2) / H;
      t = Math.max(-1.2, Math.min(1.2, t));
      wrap.style.setProperty('--fy', (t * H * 0.22).toFixed(1) + 'px');
      wrap.style.setProperty('--fs', (1 - t * 0.28).toFixed(3));
    }
  }

  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    pendingDelta += y - lastY;
    lastY = y;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        updateReadout(y);
        updateBodies(y);
      });
    }
  }

  /* Which stage are we at? */
  var current = null;
  function setStage(stage) {
    if (stage === current) return;
    current = stage;
    var id = stage.id;
    body.setAttribute('data-stage', id);
    docEl.style.setProperty('--tint', stage.getAttribute('data-tint') || '214 70% 50%');
    for (var k in railLinks) {
      if (railLinks.hasOwnProperty(k)) railLinks[k].classList.toggle('is-active', k === id);
    }
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
        }
      });
    }, { rootMargin: '0px 0px -18% 0px', threshold: 0.12 });
    stages.forEach(function (s) { io.observe(s); });

    var io2 = new IntersectionObserver(function (entries) {
      var best = null;
      entries.forEach(function (e) { if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) best = e; });
      if (best) setStage(best.target);
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    stages.forEach(function (s) { io2.observe(s); });
  } else {
    stages.forEach(function (s) { s.classList.add('is-in'); });
    setStage(stages[0]);
  }

  /* ---------- Boot ---------- */
  function boot() {
    resize();
    measure();
    updateReadout(window.scrollY);
    updateBodies(window.scrollY);
    if (!reduceMotion && !raf) raf = requestAnimationFrame(frame);
  }

  window.addEventListener('resize', function () {
    resize();
    measure();
    updateReadout(window.scrollY);
    updateBodies(window.scrollY);
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', function () { measure(); updateReadout(window.scrollY); });
  document.addEventListener('visibilitychange', function () {
    visible = !document.hidden;
    if (visible && !reduceMotion && !raf) raf = requestAnimationFrame(frame);
  });

  boot();
})();
