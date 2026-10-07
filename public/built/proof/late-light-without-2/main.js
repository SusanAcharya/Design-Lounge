/* Late Light — scroll to travel. Plain JS, no dependencies. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var smooth = function (t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  /* ---------------- starfield ---------------- */

  var sky = document.getElementById('sky');
  var ctx = sky.getContext('2d');
  var W = 0, H = 0, DPR = 1, stars = [], focal = 0;
  var TONES = ['#ffffff', '#dfe9ff', '#fff2dc', '#c8d8ff', '#ffe3b8'];

  function makeStar(z) {
    var zz = z === undefined ? Math.random() * 0.95 + 0.05 : z;
    var inView = focal > 0;
    var rx = inView ? (W / 2) * zz / focal * 1.08 : 1.6;
    var ry = inView ? (H / 2) * zz / focal * 1.08 : 1.6;
    return {
      x: (Math.random() * 2 - 1) * rx,
      y: (Math.random() * 2 - 1) * ry,
      z: zz,
      tone: TONES[Math.floor(Math.random() * TONES.length)],
      tw: Math.random() * Math.PI * 2,
      w: 0.5 + Math.random()
    };
  }

  function sizeSky() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    sky.width = Math.round(W * DPR);
    sky.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    focal = Math.max(W, H) * 0.62;
    var count = clamp(Math.round((W * H) / 2400), 260, 900);
    stars.length = 0;
    for (var i = 0; i < count; i++) stars.push(makeStar());
  }

  function drawSky(speed, dir, t) {
    ctx.clearRect(0, 0, W, H);
    var cx = W / 2, cy = H / 2;
    var streak = speed > 0.0045;
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      if (speed > 0) {
        s.z -= speed * dir;
        if (s.z <= 0.03) { var n = makeStar(1); s.x = n.x; s.y = n.y; s.z = 1; s.tone = n.tone; }
        else if (s.z > 1) { var m = makeStar(0.05); s.x = m.x; s.y = m.y; s.z = 0.05; s.tone = m.tone; }
      }
      var k = focal / s.z;
      var px = cx + s.x * k, py = cy + s.y * k;
      if (px < -20 || px > W + 20 || py < -20 || py > H + 20) {
        var r = makeStar(1); s.x = r.x; s.y = r.y; s.z = 1; s.tone = r.tone;
        continue;
      }
      var near = 1 - s.z;
      var size = 0.35 + near * near * 2.4 * s.w;
      var alpha = 0.18 + near * 0.82;
      if (!reduceMotion) alpha *= 0.82 + 0.18 * Math.sin(t * 0.0022 * s.w + s.tw);
      ctx.globalAlpha = clamp(alpha, 0, 1);
      ctx.fillStyle = s.tone;
      if (streak) {
        var pz = clamp(s.z + speed * dir * 3.2, 0.03, 1.2);
        var pk = focal / pz;
        ctx.strokeStyle = s.tone;
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx + s.x * pk, cy + s.y * pk);
        ctx.lineTo(px, py);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(px, py, size, 0, 6.2832);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ---------------- galaxy (drawn once) ---------------- */

  function drawGalaxy() {
    var c = document.getElementById('galaxy-canvas');
    if (!c) return;
    var g = c.getContext('2d');
    var size = c.width, cx = size / 2, cy = size / 2;
    var tilt = 0.42, rot = -0.45, maxR = size * 0.44;
    var cosR = Math.cos(rot), sinR = Math.sin(rot);
    g.clearRect(0, 0, size, size);

    // disc haze
    g.save();
    g.translate(cx, cy); g.rotate(rot); g.scale(1, tilt);
    var disc = g.createRadialGradient(0, 0, 0, 0, 0, maxR);
    disc.addColorStop(0, 'rgba(255, 236, 205, 0.55)');
    disc.addColorStop(0.18, 'rgba(230, 220, 255, 0.22)');
    disc.addColorStop(0.6, 'rgba(160, 170, 230, 0.07)');
    disc.addColorStop(1, 'rgba(120, 140, 220, 0)');
    g.fillStyle = disc;
    g.beginPath(); g.arc(0, 0, maxR, 0, 6.2832); g.fill();
    g.restore();

    function plot(r, th, rad, color, alpha) {
      var x0 = r * Math.cos(th), y0 = r * Math.sin(th) * tilt;
      var x = cx + x0 * cosR - y0 * sinR;
      var y = cy + x0 * sinR + y0 * cosR;
      g.globalAlpha = alpha;
      g.fillStyle = color;
      g.beginPath(); g.arc(x, y, rad, 0, 6.2832); g.fill();
    }

    var arms = 2, i, th, r, spread, arm;
    for (i = 0; i < 3200; i++) {
      arm = i % arms;
      th = Math.random() * 4.6;                         // along the arm
      r = (maxR / 5.3) * Math.exp(0.36 * th);          // logarithmic spiral, reaching maxR at the arm's end
      if (r > maxR) continue;
      spread = (Math.random() - 0.5) * (0.22 + r / maxR * 0.5);
      var angle = th + arm * Math.PI + spread;
      var jitter = (Math.random() - 0.5) * 0.08 * maxR;
      var warm = r < maxR * 0.25;
      plot(r + jitter, angle, Math.random() * 1.4 + 0.3,
        warm ? '#ffe9c4' : (Math.random() < 0.3 ? '#bcd2ff' : '#f3f1ff'),
        0.35 + Math.random() * 0.55);
    }
    for (i = 0; i < 1400; i++) {                        // bulge
      r = Math.pow(Math.random(), 2.2) * maxR * 0.28;
      th = Math.random() * 6.2832;
      plot(r, th, Math.random() * 1.6 + 0.4, '#fff1d6', 0.4 + Math.random() * 0.5);
    }
    for (i = 0; i < 900; i++) {                         // faint halo
      r = Math.random() * maxR;
      th = Math.random() * 6.2832;
      plot(r, th, Math.random() * 0.9 + 0.2, '#d9deff', 0.1 + Math.random() * 0.25);
    }
    g.globalAlpha = 1;
    var core = g.createRadialGradient(cx, cy, 0, cx, cy, size * 0.07);
    core.addColorStop(0, 'rgba(255, 250, 235, 0.95)');
    core.addColorStop(1, 'rgba(255, 240, 210, 0)');
    g.fillStyle = core;
    g.beginPath(); g.arc(cx, cy, size * 0.07, 0, 6.2832); g.fill();
  }

  /* ---------------- city lights (drawn once) ---------------- */

  function drawCityLights() {
    var c = document.getElementById('earth-lights');
    if (!c) return;
    var g = c.getContext('2d');
    var w = c.width, h = c.height;
    g.clearRect(0, 0, w, h);
    function gauss() { return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5; }
    var tones = ['#ffcf8a', '#ffd9a8', '#fff0d2', '#ffc06a', '#e8f0ff'];
    var clusters = 46;
    for (var k = 0; k < clusters; k++) {
      var cx = Math.random() * w;
      var cy = Math.pow(Math.random(), 1.4) * h;          // denser toward the limb
      var big = Math.random() < 0.3;
      var rx = (big ? 90 : 36) * (0.6 + Math.random());
      var ry = rx * (0.35 + Math.random() * 0.35);
      var n = big ? 420 : 110;
      var tone = tones[Math.floor(Math.random() * tones.length)];
      for (var i = 0; i < n; i++) {
        var x = cx + gauss() * rx, y = cy + gauss() * ry;
        if (x < 0 || x > w || y < 0 || y > h) continue;
        var d = Math.hypot((x - cx) / rx, (y - cy) / ry);
        g.globalAlpha = clamp(0.95 - d * 0.55, 0.12, 0.95) * (0.5 + Math.random() * 0.5);
        g.fillStyle = tone;
        g.fillRect(x, y, Math.random() < 0.15 ? 2 : 1, 1);
      }
      if (big) {                                          // a city core glows
        var glow = g.createRadialGradient(cx, cy, 0, cx, cy, rx * 0.6);
        glow.addColorStop(0, 'rgba(255, 190, 110, 0.14)');
        glow.addColorStop(0.5, 'rgba(255, 190, 110, 0.05)');
        glow.addColorStop(1, 'rgba(255, 190, 110, 0)');
        g.globalAlpha = 1; g.fillStyle = glow;
        g.beginPath(); g.ellipse(cx, cy, rx * 0.6, ry * 0.6, 0, 0, 6.2832); g.fill();
      }
    }
    for (var s = 0; s < 1400; s++) {                      // scattered towns and roads
      g.globalAlpha = 0.15 + Math.random() * 0.4;
      g.fillStyle = tones[Math.floor(Math.random() * tones.length)];
      g.fillRect(Math.random() * w, Math.pow(Math.random(), 1.3) * h, 1, 1);
    }
    g.globalAlpha = 1;
  }

  /* ---------------- journey ---------------- */

  var stops = Array.prototype.slice.call(document.querySelectorAll('.stop'));
  var odometer = document.getElementById('odometer');
  var hudLabel = document.querySelector('.hud-label');
  var trackLinks = Array.prototype.slice.call(document.querySelectorAll('.track a'));
  var body = document.body;
  var lastOdo = '', lastStop = '';

  var ls = stops.map(function (s) { return parseFloat(s.getAttribute('data-ls')) || 0; });
  var nodes = stops.map(function (s) {
    return {
      el: s,
      orb: s.querySelector('.orb'),
      copy: s.querySelector('.copy'),
      dome: s.querySelector('.dome'),
      name: s.getAttribute('data-stop')
    };
  });

  function formatLight(v) {
    if (v < 0.5) return 'under the dome';
    if (v < 60) return v.toFixed(2) + ' light-seconds';
    var m = v / 60; if (m < 60) return m.toFixed(1) + ' light-minutes';
    var h = v / 3600; if (h < 48) return h.toFixed(1) + ' light-hours';
    var d = v / 86400; if (d < 365) return d.toFixed(1) + ' light-days';
    var y = v / 31557600;
    if (y < 1000) return Math.round(y) + ' light-years';
    if (y < 1e6) return Math.round(y).toLocaleString('en-US') + ' light-years';
    return (y / 1e6).toFixed(2) + ' million light-years';
  }

  var vh = window.innerHeight;
  var sy = window.pageYOffset, target = sy, vel = 0, prevTarget = sy;

  function progressOf(i, scroll) {
    var el = nodes[i].el;
    var top = el.offsetTop - scroll;
    var travel = Math.max(el.offsetHeight - vh, 1);
    return clamp(-top / travel, 0, 1);
  }

  function layout(scroll) {
    var journey = 0;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i], p = progressOf(i, scroll);
      journey += p;
      var o;
      if (n.name === 'earth') {
        var yv = p * (reduceMotion ? 30 : 60);
        var sc = 1 - p * (reduceMotion ? 0.2 : 0.45);
        n.orb.style.setProperty('--y', yv.toFixed(2) + 'vh');
        n.orb.style.setProperty('--s', sc.toFixed(3));
        o = clamp(1 - p * 1.8, 0, 1);
        n.copy.style.opacity = o.toFixed(3);
        n.copy.style.transform = 'translateY(' + ((1 - o) * -14).toFixed(1) + 'px)';
      } else if (n.name === 'home') {
        o = clamp(p * 2.4, 0, 1);
        n.copy.style.opacity = o.toFixed(3);
        n.copy.style.transform = (window.innerWidth > 760 ? 'translateY(-50%) ' : '') + 'translateY(' + ((1 - o) * 16).toFixed(1) + 'px)';
        if (n.dome) n.dome.style.opacity = clamp(p * 1.6, 0, 1).toFixed(3);
      } else {
        // approach, pass, recede
        var a = smooth(p / 0.5), b = smooth((p - 0.5) / 0.5);
        var sMin = reduceMotion ? 0.7 : 0.28, sMax = reduceMotion ? 1.25 : 1.9;
        var yIn = reduceMotion ? -14 : -38, yOut = reduceMotion ? 22 : 78;
        var scale = p < 0.5 ? lerp(sMin, 1, a) : lerp(1, sMax, b);
        var y = p < 0.5 ? lerp(yIn, 0, a) : lerp(0, yOut, b);
        n.orb.style.setProperty('--y', y.toFixed(2) + 'vh');
        n.orb.style.setProperty('--s', scale.toFixed(3));
        o = clamp((0.32 - Math.abs(p - 0.5)) / 0.14, 0, 1);
        n.copy.style.opacity = o.toFixed(3);
        n.copy.style.transform = 'translateY(' + ((1 - o) * 16).toFixed(1) + 'px)';
      }
    }

    // odometer: interpolate between stops on a log scale
    var last = nodes.length - 1;
    var shifted = Math.max(journey - 0.5, 0);
    var idx = clamp(Math.floor(shifted), 0, last);
    var frac = clamp(shifted - idx, 0, 1);
    var from = Math.log1p(ls[idx]), to = Math.log1p(ls[Math.min(idx + 1, last)]);
    var value = Math.expm1(from + (to - from) * frac);
    var text = formatLight(value);
    if (text !== lastOdo) { odometer.textContent = text; lastOdo = text; }

    var current = nodes[clamp(Math.round(journey), 0, last)].name;
    if (current !== lastStop) {
      body.setAttribute('data-stop', current);
      hudLabel.textContent = current === 'home' && frac > 0.6 ? 'Home' : 'Light-time from the dome';
      for (var t = 0; t < trackLinks.length; t++) {
        trackLinks[t].classList.toggle('is-active', trackLinks[t].getAttribute('data-track') === current);
      }
      lastStop = current;
    }
  }

  /* ---------------- loop ---------------- */

  var running = true, lastT = 0, soundNode = null;

  function frame(t) {
    if (!running) return;
    target = window.pageYOffset;
    var dt = Math.min(t - lastT, 50) || 16; lastT = t;
    if (reduceMotion) {
      sy = target;
      vel = 0;
    } else {
      sy += (target - sy) * clamp(dt / 90, 0.08, 0.35);
      vel += ((target - prevTarget) - vel) * 0.15;
      prevTarget = target;
    }
    layout(sy);

    if (!reduceMotion) {
      var v = Math.abs(vel);
      var speed = 0.0006 + Math.min(v, 90) / 90 * 0.028;
      drawSky(speed, vel >= 0 ? 1 : -1, t);
      if (soundNode) soundNode.setVelocity(v);
    }
    requestAnimationFrame(frame);
  }

  function onResize() {
    vh = window.innerHeight;
    sizeSky();
    if (reduceMotion) { drawSky(0, 1, 0); layout(window.pageYOffset); }
  }

  sizeSky();
  drawGalaxy();
  drawCityLights();
  layout(window.pageYOffset);
  window.addEventListener('resize', onResize);

  if (reduceMotion) {
    drawSky(0, 1, 0);
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { layout(window.pageYOffset); ticking = false; });
    }, { passive: true });
  } else {
    requestAnimationFrame(frame);
  }

  document.addEventListener('visibilitychange', function () {
    if (reduceMotion) return;
    if (document.hidden) { running = false; }
    else if (!running) { running = true; lastT = performance.now(); requestAnimationFrame(frame); }
  });

  /* ---------------- sound (opt-in) ---------------- */

  var soundButton = document.getElementById('sound');
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) { soundButton.hidden = true; }

  function makeDrone() {
    var ac = new AC();
    var master = ac.createGain(); master.gain.value = 0;
    var filter = ac.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 220; filter.Q.value = 0.7;
    var oscs = [[55, 'sine', 0.5], [55.7, 'sine', 0.5], [110.3, 'triangle', 0.12], [164.8, 'sine', 0.06]].map(function (d) {
      var o = ac.createOscillator(); o.type = d[1]; o.frequency.value = d[0];
      var g = ac.createGain(); g.gain.value = d[2];
      o.connect(g); g.connect(filter); o.start();
      return o;
    });
    filter.connect(master); master.connect(ac.destination);
    var on = false;
    return {
      toggle: function () {
        on = !on;
        if (ac.state === 'suspended') ac.resume();
        var now = ac.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setTargetAtTime(on ? 0.14 : 0, now, on ? 1.2 : 0.6);
        return on;
      },
      setVelocity: function (v) {
        var f = 220 + Math.min(v, 90) * 9;
        filter.frequency.setTargetAtTime(f, ac.currentTime, 0.25);
      }
    };
  }

  soundButton.addEventListener('click', function () {
    if (!soundNode) soundNode = makeDrone();
    var on = soundNode.toggle();
    soundButton.setAttribute('aria-pressed', on ? 'true' : 'false');
    soundButton.querySelector('span').textContent = on ? 'on' : 'off';
  });
})();
