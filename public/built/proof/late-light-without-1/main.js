/* Late Light — scroll outward from Earth; the light gets older as you go. */
(function () {
  'use strict';

  var root = document.documentElement;
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var motionBtn = document.getElementById('motion');
  var userPref = null;
  try { userPref = localStorage.getItem('late-light-motion'); } catch (e) { userPref = null; }

  function motionOff() { return root.getAttribute('data-motion') === 'off'; }

  function applyMotion() {
    var off = userPref ? userPref === 'off' : mq.matches;
    root.setAttribute('data-motion', off ? 'off' : 'on');
    if (motionBtn) {
      motionBtn.setAttribute('aria-pressed', String(!off));
      motionBtn.querySelector('.motion-state').textContent = off ? 'off' : 'on';
    }
  }
  applyMotion();
  if (mq.addEventListener) mq.addEventListener('change', function () { if (!userPref) { applyMotion(); restartSky(); } });

  if (motionBtn) {
    motionBtn.addEventListener('click', function () {
      userPref = motionOff() ? 'on' : 'off';
      try { localStorage.setItem('late-light-motion', userPref); } catch (e) { /* private window */ }
      applyMotion();
      restartSky();
      layout();
    });
  }

  /* ---------- the sky: a starfield that warps with scroll speed ---------- */

  var canvas = document.getElementById('sky');
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, F = 1, CX = 0, CY = 0, stars = [];
  var TINTS = ['239,231,214', '255,255,255', '200,220,255', '255,222,190', '180,205,255'];
  var raf = 0, lastT = 0, lastY = 0, vel = 0, warp = 0;

  function spawn(z) {
    if (z === undefined) z = 0.08 + Math.random() * 0.92;
    return {
      x: (Math.random() * 2 - 1) * z * (W / (2 * F)) * 1.04,
      y: (Math.random() * 2 - 1) * z * (H / (2 * F)) * 1.04,
      z: z,
      t: TINTS[(Math.random() * TINTS.length) | 0],
      m: 0.5 + Math.random() * 0.5
    };
  }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    F = Math.max(W, H); CX = W / 2; CY = H / 2;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    var n = Math.round(Math.min(900, Math.max(260, (W * H) / 1500)));
    stars = [];
    for (var i = 0; i < n; i++) stars.push(spawn());
    if (motionOff()) drawStatic();
  }

  function drawStatic() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var sx = CX + (s.x / s.z) * F, sy = CY + (s.y / s.z) * F;
      var b = 1 - s.z;
      ctx.fillStyle = 'rgba(' + s.t + ',' + (0.25 + b * 0.7) + ')';
      ctx.beginPath();
      ctx.arc(sx, sy, 0.4 + b * 1.1 * s.m, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function frame(t) {
    raf = requestAnimationFrame(frame);
    var dt = lastT ? Math.min(3, (t - lastT) / 16.7) : 1;
    lastT = t;

    var y = window.scrollY || window.pageYOffset;
    var dy = y - lastY; lastY = y;
    vel += (dy - vel) * 0.18;
    var target = Math.min(1, Math.abs(vel) / 70);
    warp += (target - warp) * (target > warp ? 0.22 : 0.05);
    var dir = vel < -0.5 ? -1 : 1;
    var speed = (0.0012 + warp * 0.05) * dt;
    var streak = 1 + warp * 10;

    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var pz = s.z + dir * speed * streak;
      s.z -= dir * speed;
      if (s.z <= 0.02 || s.z >= 1) { stars[i] = spawn(dir > 0 ? 1 : 0.03); continue; }
      var sx = CX + (s.x / s.z) * F, sy = CY + (s.y / s.z) * F;
      if (sx < -20 || sx > W + 20 || sy < -20 || sy > H + 20) { stars[i] = spawn(); continue; }
      if (pz <= 0.01) pz = 0.01;
      var px = CX + (s.x / pz) * F, py = CY + (s.y / pz) * F;
      var b = 1 - s.z;
      ctx.strokeStyle = 'rgba(' + s.t + ',' + (0.22 + b * 0.75) + ')';
      ctx.lineWidth = (0.6 + b * 1.6) * s.m;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(sx, sy);
      ctx.stroke();
    }
  }

  function restartSky() {
    cancelAnimationFrame(raf); raf = 0; lastT = 0;
    if (motionOff()) { drawStatic(); }
    else { lastY = window.scrollY || 0; raf = requestAnimationFrame(frame); }
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; lastT = 0; }
    else restartSky();
  });

  /* ---------- the dome: drawn once ---------- */

  (function drawDome() {
    var g = document.getElementById('dome-stars');
    var seats = document.getElementById('dome-seats');
    if (!g || !seats) return;
    var NS = 'http://www.w3.org/2000/svg';
    var seed = 7;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var i = 0; i < 70; i++) {
      var a = rnd() * Math.PI, r = 20 + rnd() * 168;
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', (220 + Math.cos(a) * r).toFixed(1));
      c.setAttribute('cy', (214 - Math.sin(a) * r).toFixed(1));
      c.setAttribute('r', (0.5 + rnd() * 1.4).toFixed(2));
      c.setAttribute('opacity', (0.35 + rnd() * 0.65).toFixed(2));
      g.appendChild(c);
    }
    var rows = [[232, 9, 30], [252, 11, 30], [272, 13, 30]];
    rows.forEach(function (row) {
      var yy = row[0], n = row[1], w = row[2] * n + 8 * (n - 1);
      var x0 = 220 - w / 2;
      for (var k = 0; k < n; k++) {
        var rect = document.createElementNS(NS, 'rect');
        rect.setAttribute('x', (x0 + k * (row[2] + 8)).toFixed(1));
        rect.setAttribute('y', yy);
        rect.setAttribute('width', row[2]);
        rect.setAttribute('height', 11);
        rect.setAttribute('rx', 3);
        seats.appendChild(rect);
      }
    });
  })();

  /* ---------- waypoints, HUD, parallax, redshift ---------- */

  var chapters = Array.prototype.slice.call(document.querySelectorAll('.chapter')).map(function (el) {
    return {
      el: el,
      id: el.id,
      ls: el.hasAttribute('data-home') ? null : parseFloat(el.getAttribute('data-ls')),
      home: el.hasAttribute('data-home'),
      object: el.querySelector('.object'),
      center: 0
    };
  });
  var earthGlobe = document.getElementById('earth-globe');
  var hudDist = document.getElementById('hud-dist');
  var hudWhen = document.getElementById('hud-when');
  var hudFill = document.getElementById('hud-fill');
  var hud = document.querySelector('.hud');
  var railLinks = {};
  Array.prototype.forEach.call(document.querySelectorAll('.rail a'), function (a) { railLinks[a.getAttribute('data-rail')] = a; });

  var YEAR = 31557600, DAY = 86400;

  function commas(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  function fmtDist(ls) {
    if (ls < 60) return ls.toFixed(1) + ' light-seconds';
    if (ls < 3600) return (ls / 60).toFixed(1) + ' light-minutes';
    if (ls < DAY * 1.5) return (ls / 3600).toFixed(1) + ' light-hours';
    if (ls < DAY * 60) return (ls / DAY).toFixed(1) + ' light-days';
    var y = ls / YEAR;
    if (y < 10) return y.toFixed(2) + ' light-years';
    if (y < 1e6) return commas(y) + ' light-years';
    return (y / 1e6).toFixed(2) + ' million light-years';
  }

  function fmtWhen(ls) {
    var now = new Date();
    if (ls < 2) return 'just now';
    if (ls < DAY * 2) {
      var d = new Date(now.getTime() - ls * 1000);
      var h = d.getHours(), m = d.getMinutes();
      var ampm = h >= 12 ? 'pm' : 'am';
      var hh = h % 12 || 12;
      var time = hh + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
      var sameDay = d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
      return (sameDay ? 'today, ' : 'yesterday, ') + time;
    }
    var y = ls / YEAR;
    if (y < 10) {
      var past = new Date(now.getTime() - ls * 1000);
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[past.getMonth()] + ' ' + past.getFullYear();
    }
    if (y < 12000) {
      var year = Math.round(now.getFullYear() - y);
      return year > 0 ? 'the year ' + year : (1 - year) + ' BC';
    }
    if (y < 1e6) return commas(y) + ' years ago';
    return (y / 1e6).toFixed(1) + ' million years ago';
  }

  function measure() {
    var sy = window.scrollY || 0;
    chapters.forEach(function (c) {
      var r = c.el.getBoundingClientRect();
      c.center = r.top + sy + r.height / 2;
    });
  }

  var activeId = null;
  function setActive(id) {
    if (id === activeId) return;
    activeId = id;
    for (var k in railLinks) {
      if (railLinks[k].classList.toggle('active', k === id)) railLinks[k].setAttribute('aria-current', 'location');
      else railLinks[k].removeAttribute('aria-current');
    }
  }

  var ticking = false;
  function layout() {
    ticking = false;
    var sy = window.scrollY || 0;
    var vh = window.innerHeight;
    var cur = sy + vh / 2;
    var n = chapters.length;

    // which segment are we in?
    var i = 0;
    while (i < n - 1 && cur >= chapters[i + 1].center) i++;
    var a = chapters[i], b = chapters[Math.min(i + 1, n - 1)];
    var t = (a === b) ? 0 : Math.max(0, Math.min(1, (cur - a.center) / (b.center - a.center)));
    var nearest = t < 0.5 ? a : b;
    setActive(nearest.id);

    // distance readout, interpolated on a log scale between waypoints
    var ls, home = false;
    if (a.home) {
      home = true;
    } else if (b.home) {
      if (t < 0.5) ls = a.ls; else home = true;
    } else if (a.ls === 0) {
      ls = b.ls * Math.pow(t, 3);
    } else {
      ls = Math.exp(Math.log(a.ls) + (Math.log(b.ls) - Math.log(a.ls)) * t);
    }
    if (home) {
      hudDist.textContent = 'home';
      hudWhen.textContent = 'the projector, just now';
    } else {
      hudDist.textContent = fmtDist(ls);
      hudWhen.textContent = fmtWhen(ls);
    }

    // overall progress, redshift and the bar
    var progress = (i + t) / (n - 1);
    var shift = Math.max(0, Math.min(1, (i + t) / (n - 2)));
    if (home) shift = a.home ? 0 : Math.max(0, 1 - t * 2);
    root.style.setProperty('--shift', shift.toFixed(3));
    hudFill.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
    var hideHud = home && (a.home || t > 0.7);
    hud.style.opacity = hideHud ? '0' : '1';
    hud.style.pointerEvents = hideHud ? 'none' : '';

    // parallax
    if (!motionOff()) {
      if (earthGlobe) {
        var k = Math.min(1, sy / vh);
        earthGlobe.style.transform = 'translate3d(0,' + (sy * 0.42).toFixed(1) + 'px,0) scale(' + (1 - k * 0.08).toFixed(3) + ')';
      }
      chapters.forEach(function (c) {
        if (!c.object) return;
        var rel = (c.center - cur) / vh;
        if (rel > 1.5 || rel < -1.5) return;
        c.object.style.transform = 'translate3d(0,' + (rel * -64).toFixed(1) + 'px,0)';
      });
    }
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(layout); }
  }

  // reveal chapters as they enter
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('is-in'); });
  }, { threshold: 0.22 });
  chapters.forEach(function (c) { io.observe(c.el); });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { resize(); measure(); layout(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); layout(); });

  resize();
  measure();
  layout();
  restartSky();
})();
