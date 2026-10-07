/* Aadhi Raat Records · main.js · Designed using Design Lounge (https://www.designlounge.live)
   One scroll value drives the sky, the copy, the chapter and the scene clock.
   Kathmandu's clock and the window (midnight to sunrise) are real and update every second. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Nepal time, sunrise, the window ---------- */
  var NPT_OFFSET = 345; // minutes, UTC+5:45, no daylight saving
  var LAT = 27.7172, LON = 85.3240;

  function nowNPT() { return new Date(Date.now() + NPT_OFFSET * 60000); } // read with getUTC*
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function hhmm(min) { min = ((min % 1440) + 1440) % 1440; return pad(Math.floor(min / 60)) + ':' + pad(Math.floor(min % 60)); }
  function hhmmss(sec) { sec = Math.max(0, Math.floor(sec)); return pad(Math.floor(sec / 3600)) + ':' + pad(Math.floor(sec / 60) % 60) + ':' + pad(sec % 60); }

  // Sunrise for a calendar day in Kathmandu, as minutes after local midnight.
  // Almanac for Computers algorithm, zenith 90.833 degrees.
  function sunriseNPT(y, m, d) {
    var rad = Math.PI / 180;
    var n1 = Math.floor(275 * m / 9), n2 = Math.floor((m + 9) / 12);
    var n3 = 1 + Math.floor((y - 4 * Math.floor(y / 4) + 2) / 3);
    var N = n1 - (n2 * n3) + d - 30;
    var lngHour = LON / 15;
    var t = N + ((6 - lngHour) / 24);
    var M = (0.9856 * t) - 3.289;
    var L = M + (1.916 * Math.sin(M * rad)) + (0.020 * Math.sin(2 * M * rad)) + 282.634;
    L = ((L % 360) + 360) % 360;
    var RA = Math.atan(0.91764 * Math.tan(L * rad)) / rad;
    RA = ((RA % 360) + 360) % 360;
    var Lq = Math.floor(L / 90) * 90, RAq = Math.floor(RA / 90) * 90;
    RA = (RA + (Lq - RAq)) / 15;
    var sinDec = 0.39782 * Math.sin(L * rad);
    var cosDec = Math.cos(Math.asin(sinDec));
    var cosH = (Math.cos(90.833 * rad) - (sinDec * Math.sin(LAT * rad))) / (cosDec * Math.cos(LAT * rad));
    if (cosH > 1 || cosH < -1) return 6 * 60; // never for Kathmandu, keep a sane value
    var H = (360 - Math.acos(cosH) / rad) / 15;
    var T = H + RA - (0.06571 * t) - 6.622;
    var UT = ((T - lngHour) % 24 + 24) % 24;
    return Math.round((UT * 60 + NPT_OFFSET) % 1440);
  }

  var clock = {
    minutes: 0, seconds: 0, sunrise: 365, open: false, toMidnight: 0, toSunrise: 0, hm: '--:--', hms: '--:--:--'
  };
  function tick() {
    var n = nowNPT();
    var y = n.getUTCFullYear(), m = n.getUTCMonth() + 1, d = n.getUTCDate();
    var sr = sunriseNPT(y, m, d);
    var mins = n.getUTCHours() * 60 + n.getUTCMinutes();
    var secs = mins * 60 + n.getUTCSeconds();
    clock.sunrise = sr;
    clock.minutes = mins;
    clock.seconds = secs;
    clock.open = mins < sr;
    clock.toMidnight = 86400 - secs;
    clock.toSunrise = sr * 60 - secs;
    clock.hm = hhmm(mins);
    clock.hms = hhmmss(secs);
    document.body.setAttribute('data-window', clock.open ? 'open' : 'closed');
  }
  tick();

  var railClock = $('#railClock'), railWin = $('#railWin'), menuClock = $('#menuClock'), menuWin = $('#menuWin');
  var roNow = $('#roNow'), roWin = $('#roWin'), roWinLabel = $('#roWinLabel'), sunriseMeta = $('#sunriseMeta');
  var lastText = {};
  function setText(el, key, s) { if (el && lastText[key] !== s) { lastText[key] = s; el.textContent = s; } }

  function paintClocks() {
    tick();
    setText(railClock, 'rc', clock.hm);
    if (railClock) railClock.setAttribute('datetime', clock.hm + ':00+05:45');
    setText(menuClock, 'mc', clock.hm + ' NPT');
    setText(roNow, 'now', clock.hms);
    setText(sunriseMeta, 'sr', hhmm(clock.sunrise));
    if (clock.open) {
      setText(roWinLabel, 'wl', 'Open until sunrise ' + hhmm(clock.sunrise));
      setText(roWin, 'w', hhmmss(clock.toSunrise));
      setText(railWin, 'rw', 'Open until ' + hhmm(clock.sunrise));
      setText(menuWin, 'mw', 'Open now. Closes at sunrise, ' + hhmm(clock.sunrise) + '.');
    } else {
      setText(roWinLabel, 'wl', 'Midnight in');
      setText(roWin, 'w', hhmmss(clock.toMidnight));
      setText(railWin, 'rw', 'Opens at 00:00');
      setText(menuWin, 'mw', 'Opens at 00:00, in ' + hhmmss(clock.toMidnight) + '.');
    }
  }
  paintClocks();
  setInterval(paintClocks, 1000);

  /* ---------- The scene ---------- */
  var canvas = $('#sky');
  var ctx = canvas.getContext('2d', { alpha: false });
  var W = 0, H = 0, DPR = 1;
  var night = $('#night');
  var chapters = $$('.ch', night);
  var hud = $('.hud');
  var roScene = $('#roScene');
  var live = $('#live');
  var currentCh = -1;

  function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function hex(h) { h = h.replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function mixc(a, b, k) { return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; }
  function rgb(c, a) { return 'rgba(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ',' + (a == null ? 1 : a) + ')'; }
  function smooth(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }

  // Seeded random so the city is the same on every load.
  var seed = 20261007;
  function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }

  var SKY23 = hex(css('--scene-sky-23') || '#141c3f');
  var SKY00 = hex(css('--scene-sky-00') || '#04060d');
  var SKY03 = hex(css('--scene-sky-03') || '#070a22');
  var DAWN = hex(css('--scene-dawn') || '#f4b58a');

  // Keyframes by scene minutes since 23:00. Sunrise is filled in from the clock.
  function keyframes() {
    var sr = 60 + clock.sunrise; // minutes after 23:00
    return [
      { t: 0,       top: SKY23,              mid: [26, 36, 82],   hor: [58, 47, 63],   star: 0.35, lamp: 1.0,  moon: 0.8,  win: 1.0,  fog: 0.0, ridge: [18, 26, 56],   city: [6, 7, 14],     near: [3, 4, 9] },
      { t: 60,      top: SKY00,              mid: [8, 11, 26],    hor: [18, 20, 40],   star: 0.8,  lamp: 0.6,  moon: 1.0,  win: 0.18, fog: 0.0, ridge: [10, 14, 34],   city: [4, 5, 11],     near: [2, 3, 7] },
      { t: 210,     top: SKY03,              mid: [13, 18, 54],   hor: [26, 32, 72],   star: 1.0,  lamp: 0.45, moon: 1.0,  win: 0.06, fog: 0.1, ridge: [16, 22, 56],   city: [5, 6, 14],     near: [3, 3, 8] },
      { t: sr - 50, top: [14, 26, 68],       mid: [39, 64, 111],  hor: [107, 106, 122], star: 0.4, lamp: 0.35, moon: 0.7,  win: 0.1,  fog: 0.55, ridge: [46, 62, 100], city: [16, 20, 38],   near: [10, 13, 24] },
      { t: sr,      top: [59, 90, 149],      mid: [138, 160, 192], hor: DAWN,          star: 0.0,  lamp: 0.1,  moon: 0.25, win: 0.04, fog: 0.8, ridge: [96, 112, 146], city: [34, 40, 62],   near: [22, 26, 42] },
      { t: sr + 25, top: [95, 134, 191],     mid: [185, 199, 216], hor: [247, 201, 163], star: 0, lamp: 0.0,  moon: 0.1,  win: 0.02, fog: 0.7, ridge: [128, 145, 178], city: [52, 58, 82],  near: [34, 38, 56] }
    ];
  }
  function sample(t) {
    var K = keyframes();
    var i = 0;
    while (i < K.length - 2 && t > K[i + 1].t) i++;
    var a = K[i], b = K[i + 1];
    var k = smooth((t - a.t) / Math.max(1, (b.t - a.t)));
    var out = { t: t };
    ['top', 'mid', 'hor', 'ridge', 'city', 'near'].forEach(function (key) { out[key] = mixc(a[key], b[key], k); });
    ['star', 'lamp', 'moon', 'win', 'fog'].forEach(function (key) { out[key] = lerp(a[key], b[key], k); });
    return out;
  }

  // Scroll progress 0..1 across the night maps to scene minutes: 23:00 at the top, sunrise at the last chapter's middle.
  function sceneMinutes(p) {
    var sr = 60 + clock.sunrise;
    var pts = [[0, 0], [0.14, 40], [0.2857, 60], [0.5714, 210], [0.8571, sr], [1, sr + 20]];
    var i = 0;
    while (i < pts.length - 2 && p > pts[i + 1][0]) i++;
    var k = (p - pts[i][0]) / (pts[i + 1][0] - pts[i][0]);
    return lerp(pts[i][1], pts[i + 1][1], Math.max(0, Math.min(1, k)));
  }

  // World
  var stars = [], buildings = [], windows = [], lamps = [], flags = [], ridgePts = [], nearPts = [];
  var moonSprite, lampSprite, starSprite;

  function makeGlow(size, inner, outer) {
    var c = document.createElement('canvas'); c.width = c.height = size;
    var g = c.getContext('2d');
    var r = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    r.addColorStop(0, inner); r.addColorStop(0.35, outer); r.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = r; g.fillRect(0, 0, size, size);
    return c;
  }

  function build() {
    seed = 20261007;
    stars = []; buildings = []; windows = []; lamps = []; flags = []; ridgePts = []; nearPts = [];
    var n = Math.max(500, Math.min(1600, Math.round(W * H / 900)));
    for (var i = 0; i < n; i++) {
      stars.push({ x: rnd() * W, y: rnd() * H * 0.78, r: rnd() < 0.08 ? 1.6 + rnd() * 1.2 : 0.5 + rnd() * 0.9, ph: rnd() * 6.28, sp: 0.5 + rnd() * 2.5, a: 0.5 + rnd() * 0.5 });
    }
    // far ridge (Shivapuri, to the north)
    var segs = 28, baseY = H * 0.62;
    for (var s = 0; s <= segs; s++) {
      var x = (s / segs) * W;
      var y = baseY - (Math.sin(s * 0.55) * 0.5 + 0.5) * H * 0.07 - rnd() * H * 0.03 - (Math.sin(s * 1.9 + 1) * 0.5 + 0.5) * H * 0.02;
      ridgePts.push([x, y]);
    }
    // the city: flat roofs, tanks, two temples, one stupa
    var x0 = -20, groundY = H * 0.84;
    var templeAt = [Math.floor(W * 0.22), Math.floor(W * 0.68)], stupaAt = Math.floor(W * 0.46), used = 0;
    while (x0 < W + 20) {
      var w = 28 + rnd() * 70;
      var h = 40 + rnd() * (H * 0.16);
      var type = 'flat';
      if (used < 2 && x0 > templeAt[used] - 10) { type = 'temple'; w = 90 + rnd() * 30; h = H * 0.17 + rnd() * 20; used++; }
      else if (x0 > stupaAt - 10 && x0 < stupaAt + 60 && !buildings.some(function (b) { return b.type === 'stupa'; })) { type = 'stupa'; w = 150; h = H * 0.13; }
      var b = { x: x0, w: w, h: h, type: type, tank: rnd() < 0.35, aerial: rnd() < 0.3, y: groundY - h };
      buildings.push(b);
      if (type === 'flat') {
        var cols = Math.max(1, Math.floor((w - 10) / 14)), rows = Math.max(1, Math.floor((h - 14) / 18));
        for (var c = 0; c < cols; c++) for (var r = 0; r < rows; r++) {
          if (rnd() < 0.55) continue;
          // most windows go dark between 23:10 and 00:40; a few bakers wake before sunrise
          var off = 10 + rnd() * 90 + (rnd() < 0.25 ? 60 : 0);
          var on = rnd() < 0.08 ? (60 + clock.sunrise - 70 - rnd() * 40) : 9999;
          windows.push({ x: b.x + 6 + c * 14, y: b.y + 8 + r * 18, w: 7, h: 9, off: off, on: on, warm: rnd() < 0.7 });
        }
      }
      x0 += w + 2 + rnd() * 6;
    }
    // sodium lamps along the street line
    for (var l = 0; l < 9; l++) {
      lamps.push({ x: W * (0.04 + l * 0.115) + rnd() * 30, y: groundY - 14 - rnd() * 10, s: 0.8 + rnd() * 0.5 });
    }
    // near rooftop parapet and a line of prayer flags
    var py = H * 0.91;
    for (var q = 0; q <= 10; q++) nearPts.push([q / 10 * W, py - (q % 2 ? 0 : 2)]);
    var fl = 22;
    for (var f = 0; f <= fl; f++) {
      var fx = W * 0.05 + (f / fl) * W * 0.9;
      var sag = Math.sin((f / fl) * Math.PI) * H * 0.045;
      flags.push({ x: fx, y: py - H * 0.085 + sag, c: f % 5 });
    }
    moonSprite = makeGlow(Math.round(Math.min(W, H) * 0.42), 'rgba(239,233,219,0.5)', 'rgba(159,180,214,0.14)');
    lampSprite = makeGlow(160, 'rgba(242,169,59,0.6)', 'rgba(242,169,59,0.14)');
    starSprite = makeGlow(24, 'rgba(255,255,255,0.9)', 'rgba(200,214,255,0.3)');
  }

  var FLAG = [[42, 99, 196], [232, 228, 216], [199, 53, 44], [46, 139, 87], [232, 181, 48]];

  function draw(p, time) {
    var t = sceneMinutes(p);
    var s = sample(t);
    var still = reduce.matches;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    // sky
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, rgb(s.top)); g.addColorStop(0.55, rgb(s.mid)); g.addColorStop(0.86, rgb(s.hor));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // stars
    if (s.star > 0.01) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < stars.length; i++) {
        var st = stars[i];
        var tw = still ? 0.86 : (0.62 + 0.38 * Math.sin(time * 0.001 * st.sp + st.ph));
        var a = s.star * st.a * tw * smooth((H * 0.8 - st.y) / (H * 0.25));
        if (a <= 0.02) continue;
        if (st.r > 1.5) { ctx.globalAlpha = a; ctx.drawImage(starSprite, st.x - 12, st.y - 12, 24, 24); }
        else { ctx.globalAlpha = a; ctx.fillStyle = '#e8ecff'; ctx.fillRect(st.x, st.y, st.r, st.r); }
      }
      ctx.restore();
    }

    // moon: rises low right at 23:00, crosses to the upper left by the small hours, pales at dawn
    var mp = Math.min(1, t / (60 + clock.sunrise));
    var mx = lerp(W * 0.86, W * 0.18, mp);
    var my = lerp(H * 0.5, H * 0.08, Math.sin(mp * Math.PI)) + lerp(0, H * 0.2, Math.max(0, mp - 0.85) * 4);
    var mr = Math.max(18, Math.min(W, H) * 0.038);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = s.moon * 0.9;
    var ms = moonSprite.width;
    ctx.drawImage(moonSprite, mx - ms / 2, my - ms / 2, ms, ms);
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = Math.min(1, s.moon + 0.1);
    var mg = ctx.createRadialGradient(mx - mr * 0.35, my - mr * 0.35, mr * 0.1, mx, my, mr);
    mg.addColorStop(0, '#fbf6e8'); mg.addColorStop(0.7, '#e9e4d2'); mg.addColorStop(1, '#c9c6b8');
    ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.fill();
    // a soft terminator so it reads as a sphere, lit from the upper left
    ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.clip();
    var sh = ctx.createRadialGradient(mx - mr * 0.55, my - mr * 0.5, mr * 0.2, mx - mr * 0.2, my - mr * 0.15, mr * 1.5);
    sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(0.55, 'rgba(0,0,0,0)'); sh.addColorStop(1, rgb(s.top, 0.6));
    ctx.globalAlpha = Math.min(1, s.moon + 0.1);
    ctx.fillStyle = sh; ctx.fillRect(mx - mr, my - mr, mr * 2, mr * 2);
    ctx.restore();

    // far ridge, lighter and bluer, low contrast
    ctx.fillStyle = rgb(s.ridge);
    ctx.beginPath(); ctx.moveTo(0, H);
    ridgePts.forEach(function (pt) { ctx.lineTo(pt[0], pt[1]); });
    ctx.lineTo(W, H); ctx.closePath(); ctx.fill();

    // valley fog before first light
    if (s.fog > 0.01) {
      var fg = ctx.createLinearGradient(0, H * 0.55, 0, H * 0.86);
      fg.addColorStop(0, 'rgba(200,210,228,0)'); fg.addColorStop(0.6, 'rgba(200,210,228,' + (0.35 * s.fog) + ')'); fg.addColorStop(1, 'rgba(210,218,232,' + (0.5 * s.fog) + ')');
      ctx.fillStyle = fg; ctx.fillRect(0, H * 0.55, W, H * 0.31);
    }

    // the city
    var cityDy = -p * 14;
    ctx.save();
    ctx.translate(0, cityDy);
    ctx.fillStyle = rgb(s.city);
    buildings.forEach(function (b) {
      if (b.type === 'flat') {
        ctx.fillRect(b.x, b.y, b.w, b.h + 20);
        ctx.fillRect(b.x - 2, b.y, b.w + 4, 3); // parapet lip
        if (b.tank) { ctx.fillRect(b.x + b.w * 0.55, b.y - 16, Math.min(18, b.w * 0.3), 16); }
        if (b.aerial) { ctx.fillRect(b.x + 6, b.y - 26, 1.5, 26); ctx.fillRect(b.x + 1, b.y - 22, 11, 1.5); }
      } else if (b.type === 'temple') {
        var cx = b.x + b.w / 2, base = b.y + b.h;
        ctx.fillRect(b.x, base - b.h * 0.35, b.w, b.h * 0.35 + 20);
        var tiers = 3, ty = base - b.h * 0.35;
        for (var k = 0; k < tiers; k++) {
          var tw = b.w * (1.15 - k * 0.3), th = b.h * 0.2;
          ctx.beginPath(); ctx.moveTo(cx - tw / 2, ty); ctx.lineTo(cx + tw / 2, ty); ctx.lineTo(cx + tw * 0.28, ty - th); ctx.lineTo(cx - tw * 0.28, ty - th); ctx.closePath(); ctx.fill();
          ctx.fillRect(cx - tw * 0.26, ty - th - b.h * 0.07, tw * 0.52, b.h * 0.07);
          ty -= th + b.h * 0.07;
        }
        ctx.fillRect(cx - 1.5, ty - 18, 3, 18);
      } else if (b.type === 'stupa') {
        var sx = b.x + b.w / 2, sy = b.y + b.h;
        ctx.fillRect(b.x, sy - 12, b.w, 32);
        ctx.beginPath(); ctx.arc(sx, sy - 12, b.w * 0.42, Math.PI, 0); ctx.fill();
        var hy = sy - 12 - b.w * 0.42;
        ctx.fillRect(sx - 14, hy - 22, 28, 22);
        ctx.beginPath(); ctx.moveTo(sx - 14, hy - 22); ctx.lineTo(sx + 14, hy - 22); ctx.lineTo(sx + 1.5, hy - 70); ctx.lineTo(sx - 1.5, hy - 70); ctx.closePath(); ctx.fill();
        // the eyes on the harmika
        ctx.fillStyle = rgb(mixc(s.city, [242, 169, 59], 0.5 * (1 - s.fog)));
        ctx.fillRect(sx - 10, hy - 16, 7, 3); ctx.fillRect(sx + 3, hy - 16, 7, 3);
        ctx.fillStyle = rgb(s.city);
      }
    });
    // windows: embers that go out through midnight
    windows.forEach(function (w) {
      var a;
      if (t < w.off) a = s.win * 0.9 + 0.1; else if (t > w.on) a = 0.9; else a = 0.08;
      a *= (1 - s.fog * 0.6);
      if (a <= 0.03) return;
      ctx.fillStyle = w.warm ? 'rgba(242,169,59,' + a + ')' : 'rgba(216,224,240,' + (a * 0.8) + ')';
      ctx.fillRect(w.x, w.y, w.w, w.h);
    });
    ctx.restore();

    // sodium lamps: halos drawn additive, posts in the city ink
    ctx.save();
    ctx.translate(0, cityDy);
    lamps.forEach(function (l) {
      ctx.fillStyle = rgb(s.city);
      ctx.fillRect(l.x - 1, l.y, 2, H - l.y);
      ctx.fillRect(l.x - 7, l.y - 3, 14, 3);
      if (s.lamp > 0.02) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = s.lamp * (still ? 1 : (0.92 + 0.08 * Math.sin(time * 0.009 + l.x)));
        var sz = 160 * l.s;
        ctx.drawImage(lampSprite, l.x - sz / 2, l.y - sz / 2 + 8, sz, sz);
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(255,220,150,' + Math.min(1, s.lamp + 0.2) + ')';
        ctx.fillRect(l.x - 3, l.y - 2, 6, 2);
      }
    });
    ctx.restore();

    // near rooftop with the flag line, sharp, moves the most
    var nearDy = -p * 36;
    ctx.save();
    ctx.translate(0, nearDy);
    ctx.fillStyle = rgb(s.near);
    ctx.beginPath(); ctx.moveTo(0, H + 60);
    nearPts.forEach(function (pt) { ctx.lineTo(pt[0], pt[1]); });
    ctx.lineTo(W, H + 60); ctx.closePath(); ctx.fill();
    // water tank and a stair head on this roof
    var py = nearPts[0][1];
    ctx.fillRect(W * 0.72, py - H * 0.075, W * 0.07, H * 0.075);
    ctx.beginPath(); ctx.ellipse(W * 0.755, py - H * 0.075, W * 0.035, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(W * 0.1, py - H * 0.05, W * 0.06, H * 0.05);
    ctx.fillRect(W * 0.14, py - H * 0.05 - 24, 3, 24);
    // the line
    ctx.strokeStyle = rgb(mixc(s.near, [239, 233, 219], 0.35)); ctx.lineWidth = 1;
    ctx.beginPath(); flags.forEach(function (f, i) { if (i === 0) ctx.moveTo(f.x, f.y); else ctx.lineTo(f.x, f.y); }); ctx.stroke();
    // the flags, lit by the moon and later by dawn
    var light = 0.28 + 0.72 * (1 - s.moon * 0.4) * smooth(s.fog + 0.25);
    flags.forEach(function (f, i) {
      if (i === flags.length - 1) return;
      var nx = flags[i + 1].x, ny = flags[i + 1].y;
      var c = mixc(s.near, FLAG[f.c], Math.min(1, 0.22 + light * 0.6));
      ctx.fillStyle = rgb(c);
      var wave = still ? 0 : Math.sin(time * 0.002 + i) * 2;
      ctx.beginPath(); ctx.moveTo(f.x + 2, f.y); ctx.lineTo(nx - 2, ny); ctx.lineTo(nx - 2 + wave, ny + 15); ctx.lineTo(f.x + 2 + wave, f.y + 15); ctx.closePath(); ctx.fill();
    });
    ctx.restore();

    return t;
  }

  /* ---------- Scroll: one value drives everything ---------- */
  var sy = 0, target = 0, lastDrawT = -1, needs = true, rafId = 0, lastFrame = 0;
  var nightTop = 0, nightH = 1, vh = 1;

  function measure() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight; vh = H;
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    var r = night.getBoundingClientRect();
    nightTop = r.top + window.scrollY; nightH = night.offsetHeight;
    build();
    needs = true;
  }

  function chapterProgress() {
    var centre = sy + vh / 2;
    var active = 0;
    chapters.forEach(function (sec, i) {
      var top = sec.offsetTop + nightTop, h = sec.offsetHeight;
      var copy = $('.copy', sec), inner = $('.in', sec);
      if (centre >= top && centre < top + h) active = i;
      var op, dy;
      if (i === 0) {
        op = 1 - Math.max(0, Math.min(1, sy / (vh * 0.65)));
        dy = -0.25 * Math.min(sy, vh);
        copy.style.opacity = op;
        copy.style.transform = reduce.matches ? 'none' : 'translateY(' + dy + 'px) scale(' + (1 - 0.06 * (1 - op)) + ')';
        inner.style.setProperty('--scrim', 0.9 * op);
      } else {
        var q = (sy - top) / Math.max(1, h - vh); // 0..1 across the 200vh
        if (q < -0.2 || q > 1.2) { op = 0; } else {
          op = q < 0.3 ? smooth(q / 0.3) : q > 0.7 ? smooth((1 - q) / 0.3) : 1;
        }
        dy = reduce.matches ? 0 : lerp(18, -18, Math.max(0, Math.min(1, q)));
        copy.style.opacity = op;
        copy.style.transform = 'translateY(' + dy + 'px)';
        copy.style.visibility = op < 0.01 ? 'hidden' : 'visible';
        inner.style.setProperty('--scrim', op);
      }
    });
    if (active !== currentCh) {
      currentCh = active;
      document.body.setAttribute('data-ch', String(active));
      live.textContent = chapters[active].getAttribute('data-label');
    }
  }

  function frame(now) {
    rafId = 0;
    var still = reduce.matches;
    var gap = target - sy;
    if (still) sy = target; else sy += gap * 0.14;
    if (Math.abs(target - sy) < 0.5) sy = target;
    var p = Math.max(0, Math.min(1, sy / Math.max(1, nightH - vh)));
    var inNight = window.scrollY < nightTop + nightH - vh * 0.5;
    var moving = Math.abs(target - sy) > 0.4;
    if (inNight || needs) {
      var t = draw(p, now);
      chapterProgress();
      var sc = hhmm(23 * 60 + t);
      setText(roScene, 'scene', sc);
      needs = false;
    }
    hud.classList.toggle('on', inNight);
    var animate = !still && inNight && document.visibilityState === 'visible';
    if (animate || moving) {
      if (now - lastFrame < 28 && !moving) { rafId = requestAnimationFrame(frame); return; }
      lastFrame = now;
      rafId = requestAnimationFrame(frame);
    }
  }
  function kick() { if (!rafId) rafId = requestAnimationFrame(frame); }

  window.addEventListener('scroll', function () { target = window.scrollY; needs = true; kick(); }, { passive: true });
  var rto;
  window.addEventListener('resize', function () { clearTimeout(rto); rto = setTimeout(function () { measure(); target = window.scrollY; kick(); }, 120); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') { needs = true; kick(); } });
  reduce.addEventListener && reduce.addEventListener('change', function () { needs = true; kick(); });

  measure();
  target = window.scrollY; sy = target;
  kick();

  /* ---------- Rail: scrollspy, indicator ---------- */
  var railLinks = $$('.sections a');
  var menuLinks = $$('.links a');
  var ind = $('.ind');
  var targets = ['night', 'sleeve', 'send'].map(function (id) { return document.getElementById(id); });
  function setCurrent(id) {
    railLinks.forEach(function (a, i) {
      var on = a.getAttribute('href') === '#' + id;
      if (on) { a.setAttribute('aria-current', 'true'); ind.style.transform = 'translateY(' + (i * 73) + 'px)'; } else a.removeAttribute('aria-current');
    });
    menuLinks.forEach(function (a) { if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) setCurrent(e.target.id); });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  targets.forEach(function (el) { spy.observe(el); });
  railLinks.forEach(function (a) { a.addEventListener('click', function () { setCurrent(a.getAttribute('href').slice(1)); }); });

  /* ---------- Phone menu (hamburger-circle-reveal) ---------- */
  var burger = $('.burger'), menu = $('#menu'), rail = $('.rail'), mainEl = $('#main'), footEl = $('.colophon');
  var menuOpen = false;
  function menuRadius() {
    var r = burger.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var far = Math.max(Math.hypot(cx, cy), Math.hypot(window.innerWidth - cx, cy), Math.hypot(cx, window.innerHeight - cy), Math.hypot(window.innerWidth - cx, window.innerHeight - cy));
    menu.style.setProperty('--cx', cx + 'px'); menu.style.setProperty('--cy', cy + 'px'); menu.style.setProperty('--r', Math.ceil(far) + 'px');
  }
  function openMenu() {
    menuRadius();
    menuOpen = true;
    menu.classList.add('open');
    burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Close menu');
    rail.classList.add('lifted');
    mainEl.setAttribute('inert', ''); footEl.setAttribute('inert', '');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { menuLinks[0].focus(); }, reduce.matches ? 0 : 200);
  }
  function closeMenu() {
    menuOpen = false;
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu');
    rail.classList.remove('lifted');
    mainEl.removeAttribute('inert'); footEl.removeAttribute('inert');
    document.body.style.overflow = '';
    burger.focus();
  }
  burger.addEventListener('click', function () { menuOpen ? closeMenu() : openMenu(); });
  menuLinks.forEach(function (a) { a.addEventListener('click', function () { if (menuOpen) { closeMenu(); } }); });
  document.addEventListener('keydown', function (e) {
    if (!menuOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
    if (e.key === 'Tab') {
      var ring = [burger].concat(menuLinks);
      var i = ring.indexOf(document.activeElement);
      if (i < 0) { e.preventDefault(); burger.focus(); return; }
      if (!e.shiftKey && i === ring.length - 1) { e.preventDefault(); ring[0].focus(); }
      else if (e.shiftKey && i === 0) { e.preventDefault(); ring[ring.length - 1].focus(); }
    }
  });
  window.addEventListener('resize', function () { if (menuOpen) { menuRadius(); if (window.innerWidth > 760) closeMenu(); } });

  /* ---------- Send a tape (contact-project-brief-steps) ---------- */
  var form = $('#brief'), steps = $$('.step', form), stepLabel = $('#stepLabel'), prog = $$('.prog i'), railSteps = $$('.steps-rail li');
  var back = $('#back'), next = $('#next'), copyBtn = $('#copy'), sent = $('#sent'), again = $('#again'), rev = $('#rev'), clip = $('#clip');
  var tDate = $('#tDate'), tTime = $('#tTime'), verdict = $('#verdict');
  var who = $('#who'), link = $('#link'), note = $('#note'), noteCount = $('#noteCount'), place = $('#place');
  var cur = 1, total = 3;
  var check = { ok: false, text: '' };

  function qualify() {
    var d = tDate.value, tm = tTime.value;
    if (!d || !tm) { verdict.textContent = ''; verdict.className = 'verdict'; check.ok = false; return; }
    var parts = d.split('-').map(Number), hm = tm.split(':').map(Number);
    var sr = sunriseNPT(parts[0], parts[1], parts[2]);
    var mins = hm[0] * 60 + hm[1];
    if (mins < sr) {
      check.ok = true;
      check.text = 'Started ' + hhmm(mins) + ', ' + (mins === 0 ? 'on the hour' : mins + ' min after midnight') + '. Sunrise that day was ' + hhmm(sr) + '. It qualifies.';
      verdict.className = 'verdict ok';
    } else if (mins >= 20 * 60) {
      check.ok = false;
      check.text = 'Started ' + hhmm(mins) + '. That is before midnight. Count it from 00:00: a take that starts at ' + hhmm(mins) + ' does not qualify, however late it ran.';
      verdict.className = 'verdict bad';
    } else {
      check.ok = false;
      check.text = 'Started ' + hhmm(mins) + '. Sunrise that day was ' + hhmm(sr) + ', so the window had closed. It waits for the next night.';
      verdict.className = 'verdict bad';
    }
    verdict.textContent = check.text;
  }
  tDate.addEventListener('input', qualify); tTime.addEventListener('input', qualify);
  note.addEventListener('input', function () { $('.num', noteCount).textContent = String(note.value.length); });

  function showStep(n, focusHeading) {
    cur = n;
    steps.forEach(function (s) { s.hidden = Number(s.getAttribute('data-step')) !== n; });
    var isReview = n === 4;
    stepLabel.textContent = isReview ? 'Check the brief' : 'Step ' + n + ' of ' + total;
    prog.forEach(function (i, k) { i.className = (k + 1 < n || isReview) ? 'done' : (k + 1 === n ? 'on' : ''); });
    railSteps.forEach(function (li, k) {
      li.classList.toggle('done', k + 1 < n || isReview);
      if (k + 1 === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    back.hidden = n === 1;
    next.hidden = isReview;
    copyBtn.hidden = !isReview;
    if (isReview) buildReview();
    if (focusHeading) { var h = $('h3', steps[n - 1]); if (h) h.focus({ preventScroll: false }); }
  }
  function setErr(input, errEl, msg) {
    if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (errEl) errEl.textContent = msg || '';
  }
  function validate(n) {
    var first = null, groupMsg = '';
    if (n === 1) {
      if (!tDate.value) { setErr(tDate, $('#errDate'), 'Enter the date of the take.'); first = first || tDate; } else setErr(tDate, $('#errDate'), '');
      if (!tTime.value) { setErr(tTime, $('#errTime'), 'Enter the time the first note landed.'); first = first || tTime; } else setErr(tTime, $('#errTime'), '');
      if (!first && !check.ok) { groupMsg = 'The take must start between 00:00 and sunrise, Nepal time. Record another night and come back.'; first = tTime; }
      $('#err1').textContent = groupMsg;
    }
    if (n === 2) {
      var room = form.querySelector('input[name="room"]:checked');
      if (!room) { groupMsg = 'Pick the room the take was recorded in.'; first = form.querySelector('input[name="room"]'); }
      $('#err2').textContent = groupMsg;
    }
    if (n === 3) {
      if (!who.value.trim()) { setErr(who, $('#errWho'), 'Tell us who to reply to.'); first = first || who; } else setErr(who, $('#errWho'), '');
      var ok = /^https?:\/\/\S+\.\S+/.test(link.value.trim());
      if (!ok) { setErr(link, $('#errLink'), 'Paste a link that starts with http, to the take itself.'); first = first || link; } else setErr(link, $('#errLink'), '');
      $('#err3').textContent = '';
    }
    if (first) { first.focus(); return false; }
    return true;
  }
  function answers() {
    var room = form.querySelector('input[name="room"]:checked');
    return [
      ['Started', tDate.value && tTime.value ? tDate.value + ' at ' + tTime.value + ' NPT' : '', 1],
      ['Check', check.text, 1],
      ['Room', (room ? room.value : '') + (place.value.trim() ? ', ' + place.value.trim() : ''), 2],
      ['Name', who.value.trim(), 3],
      ['Take', link.value.trim(), 3],
      ['Note', note.value.trim() || 'none', 3]
    ];
  }
  function buildReview() {
    rev.innerHTML = '';
    answers().forEach(function (a) {
      var dt = document.createElement('dt'); dt.textContent = a[0];
      var dd = document.createElement('dd'); dd.className = 'val'; dd.textContent = a[1];
      var ed = document.createElement('dd');
      var b = document.createElement('button'); b.type = 'button'; b.className = 'edit';
      b.textContent = 'Edit'; b.setAttribute('aria-label', 'Edit ' + a[0]);
      b.addEventListener('click', function () { showStep(a[2], true); });
      ed.appendChild(b);
      rev.appendChild(dt); rev.appendChild(dd); rev.appendChild(ed);
    });
  }
  next.addEventListener('click', function () { if (validate(cur)) showStep(cur + 1, true); });
  back.addEventListener('click', function () { showStep(cur - 1, true); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (cur !== 4) return;
    var text = 'Aadhi Raat Records · a tape\n' + answers().map(function (a) { return a[0] + ': ' + a[1]; }).join('\n') + '\nRule: recorded after 00:00 and before sunrise, Kathmandu.';
    clip.value = text;
    copyBtn.setAttribute('aria-busy', 'true');
    var done = function () {
      copyBtn.removeAttribute('aria-busy');
      form.hidden = true; sent.hidden = false;
      stepLabel.textContent = 'Copied';
      $('h3', sent).focus();
    };
    var fallback = function () {
      try { clip.removeAttribute('aria-hidden'); clip.focus(); clip.select(); document.execCommand('copy'); clip.setAttribute('aria-hidden', 'true'); } catch (err) { /* the text stays in the field */ }
      done();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else fallback();
  });
  again.addEventListener('click', function () {
    form.reset(); check = { ok: false, text: '' }; verdict.textContent = ''; verdict.className = 'verdict';
    $$('[aria-invalid]', form).forEach(function (i) { i.removeAttribute('aria-invalid'); });
    $$('.ferr, .gerr', form).forEach(function (p) { p.textContent = ''; });
    $('.num', noteCount).textContent = '0';
    sent.hidden = true; form.hidden = false;
    showStep(1, true);
  });
  showStep(1, false);

  /* ---------- Back to eleven ---------- */
  $('#topbtn').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce.matches ? 'auto' : 'smooth' });
    setTimeout(function () { $('.mark').focus(); }, reduce.matches ? 0 : 600);
  });
})();
