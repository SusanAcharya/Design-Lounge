/* Aadhi Raat Records · Designed using Design Lounge (https://www.designlounge.live) */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var RM = function () { return reduced.matches; };

  /* ---------- Kathmandu time (UTC+5:45, no daylight saving) ---------- */

  var KTM_OFFSET = 345 * 60000;
  var LAT = 27.7172, LNG = 85.3240;
  var DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function ktm(ms) {
    var d = new Date((ms == null ? Date.now() : ms) + KTM_OFFSET);
    return {
      y: d.getUTCFullYear(), mo: d.getUTCMonth(), d: d.getUTCDate(),
      h: d.getUTCHours(), m: d.getUTCMinutes(), s: d.getUTCSeconds(),
      dow: d.getUTCDay(), dayMs: Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    };
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function hm(min) { min = Math.round(min); return pad(Math.floor(min / 60) % 24) + ':' + pad(min % 60); }
  function dur(min) {
    min = Math.max(0, Math.round(min));
    var h = Math.floor(min / 60), m = min % 60;
    return (h ? h + 'h ' : '') + m + 'm';
  }

  /* Sunrise in Kathmandu, local minutes after midnight, for a civil date. Almanac method, zenith 90.833. */
  function sunrise(y, mo, d) {
    var M = mo + 1, rad = Math.PI / 180;
    var N = Math.floor(275 * M / 9) - Math.floor((M + 9) / 12) * (1 + Math.floor((y - 4 * Math.floor(y / 4) + 2) / 3)) + d - 30;
    var lngHour = LNG / 15;
    var t = N + ((6 - lngHour) / 24);
    var Ma = (0.9856 * t) - 3.289;
    var L = Ma + (1.916 * Math.sin(Ma * rad)) + (0.020 * Math.sin(2 * Ma * rad)) + 282.634;
    L = ((L % 360) + 360) % 360;
    var RA = Math.atan(0.91764 * Math.tan(L * rad)) / rad;
    RA = ((RA % 360) + 360) % 360;
    var Lq = Math.floor(L / 90) * 90, RAq = Math.floor(RA / 90) * 90;
    RA = (RA + (Lq - RAq)) / 15;
    var sinDec = 0.39782 * Math.sin(L * rad);
    var cosDec = Math.cos(Math.asin(sinDec));
    var cosH = (Math.cos(90.833 * rad) - (sinDec * Math.sin(LAT * rad))) / (cosDec * Math.cos(LAT * rad));
    if (cosH > 1 || cosH < -1) return 6 * 60;
    var H = (360 - Math.acos(cosH) / rad) / 15;
    var T = H + RA - (0.06571 * t) - 6.622;
    var UT = ((T - lngHour) % 24 + 24) % 24;
    var local = (UT + 5.75) % 24;
    return local * 60;
  }

  /* The state of the gate right now. */
  function gate(now) {
    var k = now || ktm();
    var rise = sunrise(k.y, k.mo, k.d);
    var mins = k.h * 60 + k.m + k.s / 60;
    var open = mins < rise;
    return { k: k, rise: rise, open: open, toMidnight: 1440 - mins, left: rise - mins };
  }

  /* ---------- Readouts ---------- */

  var rTime = document.getElementById('r-time');
  var rGateLabel = document.getElementById('r-gate-label');
  var rGate = document.getElementById('r-gate');
  var rDawn = document.getElementById('r-dawn');
  var rTape = document.getElementById('r-tape');
  var menuTime = document.getElementById('menu-time');
  var lastOpen = null;
  var rolling = false;

  function tick() {
    var g = gate();
    var k = g.k;
    var t = pad(k.h) + ':' + pad(k.m) + ':' + pad(k.s);
    rTime.textContent = t;
    menuTime.textContent = t;
    rDawn.textContent = hm(g.rise);
    if (g.open) {
      rGateLabel.textContent = 'The window';
      rGate.textContent = 'open, ' + dur(g.left) + ' left';
      rGate.classList.add('lit');
    } else {
      rGateLabel.textContent = 'Midnight';
      rGate.textContent = 'in ' + dur(g.toMidnight);
      rGate.classList.remove('lit');
    }
    rTape.textContent = rolling ? 'rolling' : (g.open ? 'may roll' : 'waiting');
    rTape.classList.toggle('lit', rolling);
    if (lastOpen !== g.open) {
      lastOpen = g.open;
      scene.setOpen(g.open);
      if (board.built) board.build();
    }
  }

  /* ---------- The scene: a reel-to-reel under one lamp ---------- */

  var scene = (function () {
    var canvas = document.getElementById('scene');
    var hero = canvas.parentElement;
    var copy = hero.querySelector('.hero-copy');
    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, DPR = 1;
    var statics = null;
    var open = false;
    var running = false, visible = true, raf = 0, last = 0, time = 14;
    var L = {};
    var theta1 = 0, theta2 = 0.7, rt1, rt2, rt1_0, rt2_0;
    var level = 0, needleL = 0, needleR = 0;
    var mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    var stars = [], sodium = [];
    var seed = 7;
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    var rootStyle = getComputedStyle(document.documentElement);
    var C = {
      lamp: rootStyle.getPropertyValue('--scene-lamp').trim() || '#ffd48a',
      sky: rootStyle.getPropertyValue('--scene-sky').trim() || '#0d1330',
      sodium: rootStyle.getPropertyValue('--scene-sodium').trim() || '#ff9a3c',
      rec: rootStyle.getPropertyValue('--scene-rec').trim() || '#ff4a3d',
      primary: rootStyle.getPropertyValue('--primary').trim() || '#f3b63f',
      ink: rootStyle.getPropertyValue('--ink').trim() || '#ece4cf'
    };

    function layout() {
      var rect = hero.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      DPR = Math.min(window.devicePixelRatio || 1, 1.5);
      if (W < 640) DPR *= 0.85;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      var pad = parseFloat(rootStyle.getPropertyValue('--pad')) || 56;
      var readouts = parseFloat(getComputedStyle(hero).getPropertyValue('--readouts-h')) || 72;
      var cRect = copy.getBoundingClientRect();
      var copyBottom = cRect.bottom - rect.top;
      var narrow = W < 768;
      var left = narrow ? pad : pad;
      var right = W - pad;
      var top = copyBottom + (narrow ? 22 : 30);
      var bottom = H - readouts + 12;
      var dh = Math.max(160, bottom - top);
      var dw = right - left;
      var usable = narrow ? Math.max(120, dh - 118) : dh;
      var R = Math.max(40, Math.min(usable * (narrow ? 0.36 : 0.33), dw * (narrow ? 0.19 : 0.115), 150));
      var cy = narrow ? top + 20 + usable * 0.5 : top + dh * 0.44;
      var cx1 = narrow ? left + dw * 0.27 : left + dw * 0.22;
      var cx2 = narrow ? left + dw * 0.73 : left + dw * 0.49;
      L = {
        pad: pad, left: left, right: right, top: top, bottom: bottom, dh: dh, dw: dw, narrow: narrow,
        R: R, cy: cy, cx1: cx1, cx2: cx2,
        lampX: left + dw * 0.17, lampY: 0, cord: Math.max(44, Math.min(90, top * 0.35)),
        horizon: top - 4,
        headY: cy + R + (narrow ? 22 : Math.max(26, R * 0.3)),
        vuX: left + dw * 0.64, vuW: dw * 0.36, vuY: top + dh * 0.16, vuH: Math.min(dh * 0.5, dw * 0.36 * 0.5 * 0.62)
      };
      if (rt1_0 == null) { rt1_0 = R * 0.92; rt2_0 = R * 0.56; rt1 = rt1_0; rt2 = rt2_0; }
      else { var sc = R; rt1 = Math.min(rt1, sc * 0.92); rt2 = Math.max(rt2, sc * 0.4); rt1_0 = sc * 0.92; rt2_0 = sc * 0.56; }

      stars = []; seed = 7;
      var n = Math.round(W / 9);
      for (var i = 0; i < n; i++) stars.push({ x: rnd() * W, y: rnd() * (L.horizon - 20), r: 0.4 + rnd() * 1.1, a: 0.25 + rnd() * 0.6, p: rnd() * 6.28 });
      sodium = []; seed = 99;
      var m = Math.round(W / 22);
      for (var j = 0; j < m; j++) sodium.push({ x: rnd() * W, y: L.horizon - 2 - rnd() * 34, r: 0.8 + rnd() * 1.2, a: 0.4 + rnd() * 0.6, p: rnd() * 6.28 });

      buildStatics();
    }

    function roundRect(c, x, y, w, h, r) {
      c.beginPath();
      c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
      c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
      c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
    }

    function buildStatics() {
      statics = document.createElement('canvas');
      statics.width = canvas.width; statics.height = canvas.height;
      var c = statics.getContext('2d');
      c.setTransform(DPR, 0, 0, DPR, 0, 0);

      // sky
      var sky = c.createLinearGradient(0, 0, 0, L.horizon);
      sky.addColorStop(0, '#04050b');
      sky.addColorStop(0.7, '#090d20');
      sky.addColorStop(1, C.sky);
      c.fillStyle = sky; c.fillRect(0, 0, W, L.horizon + 2);
      c.fillStyle = '#0a0b12'; c.fillRect(0, L.horizon, W, H - L.horizon);

      // stars
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        c.globalAlpha = s.a;
        c.fillStyle = '#e6ecff';
        c.beginPath(); c.arc(s.x, s.y, s.r, 0, 6.283); c.fill();
      }
      c.globalAlpha = 1;

      // far hills
      c.fillStyle = '#0b1026';
      c.beginPath(); c.moveTo(0, L.horizon);
      var hx = 0;
      seed = 3;
      c.lineTo(0, L.horizon - 30);
      while (hx < W) {
        hx += 90 + rnd() * 160;
        c.quadraticCurveTo(hx - 60, L.horizon - 60 - rnd() * 50, hx, L.horizon - 20 - rnd() * 30);
      }
      c.lineTo(W, L.horizon); c.closePath(); c.fill();

      // city glow at the horizon
      c.globalCompositeOperation = 'lighter';
      var glow = c.createRadialGradient(W * 0.55, L.horizon, 0, W * 0.55, L.horizon, W * 0.55);
      glow.addColorStop(0, 'rgba(255,154,60,0.16)');
      glow.addColorStop(0.5, 'rgba(255,154,60,0.05)');
      glow.addColorStop(1, 'rgba(255,154,60,0)');
      c.fillStyle = glow; c.fillRect(0, 0, W, L.horizon + 2);
      c.globalCompositeOperation = 'source-over';

      // near skyline: low rooftops, a stupa on the right
      c.fillStyle = '#070912';
      c.beginPath(); c.moveTo(0, L.horizon + 2);
      var bx = 0; seed = 11;
      c.lineTo(0, L.horizon - 8);
      while (bx < W) {
        var bw = 18 + rnd() * 40, bh = 6 + rnd() * 26;
        c.lineTo(bx, L.horizon - bh); c.lineTo(bx + bw, L.horizon - bh);
        bx += bw;
      }
      c.lineTo(W, L.horizon + 2); c.closePath(); c.fill();
      var sx = W * (L.narrow ? 0.8 : 0.47), sy = L.horizon - 18, sr = Math.min(34, W * 0.04);
      c.beginPath(); c.arc(sx, sy, sr, Math.PI, 0); c.lineTo(sx + sr, sy + 18); c.lineTo(sx - sr, sy + 18); c.closePath(); c.fill();
      c.fillRect(sx - sr * 0.22, sy - sr - 8, sr * 0.44, 9);
      c.beginPath(); c.moveTo(sx - sr * 0.3, sy - sr - 8); c.lineTo(sx, sy - sr - 8 - sr * 1.4); c.lineTo(sx + sr * 0.3, sy - sr - 8); c.closePath(); c.fill();

      // deck shadow and plate
      c.save();
      c.shadowColor = 'rgba(0,0,0,0.6)'; c.shadowBlur = 40; c.shadowOffsetY = 18;
      c.fillStyle = '#121319';
      roundRect(c, L.left, L.top, L.dw, H - L.top + 40, 8); c.fill();
      c.restore();
      var plate = c.createLinearGradient(L.left, L.top, L.right, L.bottom);
      plate.addColorStop(0, '#20222c');
      plate.addColorStop(0.45, '#15171f');
      plate.addColorStop(1, '#0e0f15');
      c.fillStyle = plate;
      roundRect(c, L.left, L.top, L.dw, H - L.top + 40, 8); c.fill();
      // edge light and shade
      c.strokeStyle = 'rgba(255,212,138,0.28)'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(L.left + 8, L.top + 0.5); c.lineTo(L.right - 8, L.top + 0.5); c.stroke();
      c.strokeStyle = 'rgba(255,212,138,0.12)';
      c.beginPath(); c.moveTo(L.left + 0.5, L.top + 8); c.lineTo(L.left + 0.5, H); c.stroke();
      c.strokeStyle = 'rgba(0,0,0,0.6)';
      c.beginPath(); c.moveTo(L.right - 0.5, L.top + 8); c.lineTo(L.right - 0.5, H); c.stroke();
      // brushed lines
      c.globalAlpha = 0.045; c.strokeStyle = '#ffffff';
      for (var y = L.top + 6; y < H; y += 3) { c.beginPath(); c.moveTo(L.left + 2, y + 0.5); c.lineTo(L.right - 2, y + 0.5); c.stroke(); }
      c.globalAlpha = 1;
      // screws
      c.fillStyle = '#2b2d38';
      [[L.left + 14, L.top + 14], [L.right - 14, L.top + 14]].forEach(function (p) {
        c.beginPath(); c.arc(p[0], p[1], 4, 0, 6.283); c.fill();
        c.strokeStyle = 'rgba(255,212,138,0.35)'; c.lineWidth = 1;
        c.beginPath(); c.moveTo(p[0] - 2.5, p[1] - 1); c.lineTo(p[0] + 2.5, p[1] + 1); c.stroke();
      });
      // engraving
      c.fillStyle = 'rgba(236,228,207,0.42)';
      c.font = '600 11px Archivo, "Helvetica Neue", Arial, sans-serif';
      c.textBaseline = 'middle';
      c.fillText('A A D H I   R A A T   R E C O R D S   ·   K A T H M A N D U', L.left + 30, L.top + 14);

      // vignette
      var vg = c.createRadialGradient(W * 0.45, H * 0.45, Math.min(W, H) * 0.35, W * 0.5, H * 0.5, Math.max(W, H) * 0.8);
      vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.5)');
      c.fillStyle = vg; c.fillRect(0, 0, W, H);
    }

    function drawLamp(c, t, flick) {
      var a = RM() ? 0 : Math.sin(t * 0.6) * 0.025;
      var bx = L.lampX + Math.sin(a) * L.cord, by = L.cord;
      // cord
      c.strokeStyle = '#2a2b33'; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(L.lampX, -2); c.lineTo(bx, by - 14); c.stroke();
      // shade
      c.fillStyle = '#1a1b23';
      c.beginPath(); c.moveTo(bx - 7, by - 14); c.lineTo(bx + 7, by - 14); c.lineTo(bx + 22, by + 2); c.lineTo(bx - 22, by + 2); c.closePath(); c.fill();
      c.fillStyle = 'rgba(255,212,138,0.5)';
      c.beginPath(); c.moveTo(bx - 20, by + 2); c.lineTo(bx + 20, by + 2); c.lineTo(bx + 15, by + 4); c.lineTo(bx - 15, by + 4); c.closePath(); c.fill();
      // cone and glow (additive)
      c.globalCompositeOperation = 'lighter';
      var cone = c.createLinearGradient(bx, by, bx, L.bottom);
      cone.addColorStop(0, 'rgba(255,212,138,' + (0.16 * flick) + ')');
      cone.addColorStop(0.5, 'rgba(255,212,138,' + (0.06 * flick) + ')');
      cone.addColorStop(1, 'rgba(255,212,138,0)');
      c.fillStyle = cone;
      c.beginPath(); c.moveTo(bx - 20, by + 3); c.lineTo(bx + 20, by + 3); c.lineTo(bx + L.dw * 0.75, L.bottom + 60); c.lineTo(bx - L.dw * 0.55, L.bottom + 60); c.closePath(); c.fill();
      var g = c.createRadialGradient(bx, by + 8, 0, bx, by + 8, Math.max(W, H) * 0.42);
      g.addColorStop(0, 'rgba(255,212,138,' + (0.5 * flick) + ')');
      g.addColorStop(0.12, 'rgba(255,212,138,' + (0.18 * flick) + ')');
      g.addColorStop(0.45, 'rgba(255,180,90,' + (0.05 * flick) + ')');
      g.addColorStop(1, 'rgba(255,180,90,0)');
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      // bulb
      c.fillStyle = 'rgba(255,240,200,' + (0.95 * flick) + ')';
      c.beginPath(); c.arc(bx, by + 8, 7, 0, 6.283); c.fill();
      c.globalCompositeOperation = 'source-over';
      return { x: bx, y: by + 8 };
    }

    function drawReel(c, cx, cy, R, rt, theta, lamp) {
      var dx = cx - lamp.x, dy = cy - lamp.y, dl = Math.hypot(dx, dy) || 1;
      var sx = dx / dl, sy = dy / dl;
      // cast shadow on the deck
      var sh = c.createRadialGradient(cx + sx * 12, cy + sy * 14, R * 0.6, cx + sx * 12, cy + sy * 14, R * 1.25);
      sh.addColorStop(0, 'rgba(0,0,0,0.55)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = sh; c.beginPath(); c.arc(cx + sx * 12, cy + sy * 14, R * 1.25, 0, 6.283); c.fill();
      // tape pancake
      var tp = c.createRadialGradient(cx - sx * rt * 0.5, cy - sy * rt * 0.5, rt * 0.1, cx, cy, rt);
      tp.addColorStop(0, '#3b2d22'); tp.addColorStop(0.6, '#241b14'); tp.addColorStop(1, '#171109');
      c.fillStyle = tp; c.beginPath(); c.arc(cx, cy, rt, 0, 6.283); c.fill();
      c.strokeStyle = 'rgba(255,255,255,0.05)'; c.lineWidth = 1;
      for (var r = R * 0.34; r < rt; r += 4) { c.beginPath(); c.arc(cx, cy, r, 0, 6.283); c.stroke(); }
      // tape edge highlight toward the lamp
      c.strokeStyle = 'rgba(255,212,138,0.22)'; c.lineWidth = 1.5;
      var la = Math.atan2(-sy, -sx);
      c.beginPath(); c.arc(cx, cy, rt - 0.5, la - 0.9, la + 0.9); c.stroke();
      // flange: rim, three spokes, hub
      c.save(); c.translate(cx, cy); c.rotate(theta);
      var steel = c.createLinearGradient(-R, -R, R, R);
      steel.addColorStop(0, '#5a5d6b'); steel.addColorStop(0.5, '#2e3039'); steel.addColorStop(1, '#1b1c24');
      c.strokeStyle = steel; c.lineWidth = Math.max(3, R * 0.045);
      c.beginPath(); c.arc(0, 0, R, 0, 6.283); c.stroke();
      c.fillStyle = steel;
      for (var k = 0; k < 3; k++) {
        c.save(); c.rotate(k * 2.0944);
        roundRect(c, -R * 0.11, -R * 0.98, R * 0.22, R * 0.98, R * 0.08); c.fill();
        c.restore();
      }
      c.beginPath(); c.arc(0, 0, R * 0.3, 0, 6.283); c.fill();
      c.restore();
      // hub detail (not rotated: the spindle)
      var hub = c.createRadialGradient(cx - sx * R * 0.12, cy - sy * R * 0.12, 0, cx, cy, R * 0.3);
      hub.addColorStop(0, '#6a6d7c'); hub.addColorStop(1, '#23252e');
      c.fillStyle = hub; c.beginPath(); c.arc(cx, cy, R * 0.3, 0, 6.283); c.fill();
      c.fillStyle = '#0d0e14'; c.beginPath(); c.arc(cx, cy, R * 0.1, 0, 6.283); c.fill();
      c.strokeStyle = 'rgba(255,212,138,0.45)'; c.lineWidth = 1.5;
      c.beginPath(); c.arc(cx, cy, R * 0.3 - 1, la - 1.1, la + 1.1); c.stroke();
      // rim specular
      c.strokeStyle = 'rgba(255,212,138,0.55)'; c.lineWidth = 2;
      c.beginPath(); c.arc(cx, cy, R, la - 0.7, la + 0.7); c.stroke();
    }

    function drawTape(c) {
      var r1x = L.cx1 + L.R * 0.35, r2x = L.cx2 - L.R * 0.35, ry = L.headY;
      var hw = (L.cx2 - L.cx1) * 0.46, hx = (L.cx1 + L.cx2) / 2 - hw / 2, hy = ry - 12, hh = 26;
      // tape
      c.strokeStyle = '#2a1f17'; c.lineWidth = 3;
      c.beginPath();
      c.moveTo(L.cx1 - rt1, L.cy);
      c.quadraticCurveTo(L.cx1 - rt1, ry - 8, r1x, ry - 8);
      c.lineTo(hx, hy - 1); c.lineTo(hx + hw, hy - 1);
      c.lineTo(r2x, ry - 8);
      c.quadraticCurveTo(L.cx2 + rt2, ry - 8, L.cx2 + rt2, L.cy);
      c.stroke();
      c.strokeStyle = 'rgba(255,212,138,0.16)'; c.lineWidth = 1;
      c.beginPath();
      c.moveTo(L.cx1 - rt1 - 1, L.cy);
      c.quadraticCurveTo(L.cx1 - rt1 - 1, ry - 10, r1x, ry - 10);
      c.lineTo(hx, hy - 3); c.lineTo(hx + hw, hy - 3);
      c.lineTo(r2x, ry - 10);
      c.quadraticCurveTo(L.cx2 + rt2 + 1, ry - 10, L.cx2 + rt2 + 1, L.cy);
      c.stroke();
      // rollers
      [r1x, r2x].forEach(function (x) {
        c.fillStyle = '#20222b'; c.beginPath(); c.arc(x, ry, 8, 0, 6.283); c.fill();
        c.fillStyle = '#4a4d5a'; c.beginPath(); c.arc(x, ry, 3, 0, 6.283); c.fill();
        c.strokeStyle = 'rgba(255,212,138,0.4)'; c.lineWidth = 1; c.beginPath(); c.arc(x, ry, 7.5, 3.6, 5.2); c.stroke();
      });
      // head block
      var hb = c.createLinearGradient(hx, hy, hx, hy + hh);
      hb.addColorStop(0, '#2d2f3a'); hb.addColorStop(1, '#171920');
      c.fillStyle = hb; roundRect(c, hx, hy, hw, hh, 3); c.fill();
      c.strokeStyle = 'rgba(255,212,138,0.3)'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(hx + 3, hy + 0.5); c.lineTo(hx + hw - 3, hy + 0.5); c.stroke();
      c.fillStyle = '#0f1016';
      for (var i = 0; i < 3; i++) { var w = hw * 0.16, x = hx + hw * (0.14 + i * 0.3); roundRect(c, x, hy + 6, w, hh - 12, 2); c.fill(); }
      // REC lamp
      var rx = hx + hw + 26, rcy = hy + hh / 2;
      c.fillStyle = '#1a1c25'; c.beginPath(); c.arc(rx, rcy, 12, 0, 6.283); c.fill();
      if (open) {
        c.globalCompositeOperation = 'lighter';
        var rg = c.createRadialGradient(rx, rcy, 0, rx, rcy, 48);
        rg.addColorStop(0, 'rgba(255,74,61,0.75)'); rg.addColorStop(0.3, 'rgba(255,74,61,0.28)'); rg.addColorStop(1, 'rgba(255,74,61,0)');
        c.fillStyle = rg; c.beginPath(); c.arc(rx, rcy, 48, 0, 6.283); c.fill();
        c.globalCompositeOperation = 'source-over';
        c.fillStyle = C.rec; c.beginPath(); c.arc(rx, rcy, 8.5, 0, 6.283); c.fill();
        c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.arc(rx - 2.5, rcy - 2.5, 2.2, 0, 6.283); c.fill();
      } else {
        c.fillStyle = '#3a1c1a'; c.beginPath(); c.arc(rx, rcy, 8.5, 0, 6.283); c.fill();
        c.strokeStyle = 'rgba(255,212,138,0.3)'; c.lineWidth = 1; c.beginPath(); c.arc(rx, rcy, 11.5, 3.6, 5.2); c.stroke();
      }
      c.fillStyle = open ? 'rgba(255,120,110,0.9)' : 'rgba(236,228,207,0.55)';
      c.font = '600 11px Archivo, "Helvetica Neue", Arial, sans-serif'; c.textBaseline = 'middle';
      c.fillText(open ? 'REC · after midnight' : 'REC · from 00:00', rx + 18, rcy);
    }

    function drawMeter(c, x, y, w, h, needle, powered) {
      // bezel
      c.fillStyle = '#0d0e14'; roundRect(c, x - 4, y - 4, w + 8, h + 8, 5); c.fill();
      var face = c.createLinearGradient(x, y, x, y + h);
      face.addColorStop(0, powered ? '#f6e6b9' : '#d9ccaa'); face.addColorStop(1, powered ? '#dcc994' : '#b9ab88');
      c.fillStyle = face; roundRect(c, x, y, w, h, 3); c.fill();
      if (powered) {
        c.globalCompositeOperation = 'lighter';
        var bl = c.createRadialGradient(x + w / 2, y + h * 0.9, 0, x + w / 2, y + h * 0.9, w * 0.7);
        bl.addColorStop(0, 'rgba(255,212,138,0.35)'); bl.addColorStop(1, 'rgba(255,212,138,0)');
        c.fillStyle = bl; roundRect(c, x, y, w, h, 3); c.fill();
        c.globalCompositeOperation = 'source-over';
      }
      var px = x + w / 2, py = y + h * 0.96, rad = h * 0.78;
      // scale
      var a0 = -Math.PI / 2 - 0.95, a1 = -Math.PI / 2 + 0.95;
      c.strokeStyle = '#3a3226'; c.lineWidth = 1.5;
      c.beginPath(); c.arc(px, py, rad, a0, a1 - 0.47); c.stroke();
      c.strokeStyle = '#c2362b'; c.lineWidth = 2.5;
      c.beginPath(); c.arc(px, py, rad, a1 - 0.47, a1); c.stroke();
      for (var i = 0; i <= 10; i++) {
        var a = a0 + (a1 - a0) * i / 10, big = i % 5 === 0;
        c.strokeStyle = i >= 8 ? '#c2362b' : '#3a3226'; c.lineWidth = big ? 1.5 : 1;
        c.beginPath(); c.moveTo(px + Math.cos(a) * (rad - (big ? 10 : 6)), py + Math.sin(a) * (rad - (big ? 10 : 6))); c.lineTo(px + Math.cos(a) * rad, py + Math.sin(a) * rad); c.stroke();
      }
      c.fillStyle = '#4a3f2d'; c.font = '600 10px Archivo, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('VU', px, py - rad * 0.42);
      c.textAlign = 'left';
      // needle
      var na = a0 + (a1 - a0) * Math.max(0, Math.min(1, needle));
      c.strokeStyle = 'rgba(0,0,0,0.25)'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(px + 2, py + 2); c.lineTo(px + 2 + Math.cos(na) * rad * 1.02, py + 2 + Math.sin(na) * rad * 1.02); c.stroke();
      c.strokeStyle = '#1a1612'; c.lineWidth = 1.6;
      c.beginPath(); c.moveTo(px, py); c.lineTo(px + Math.cos(na) * rad * 1.02, py + Math.sin(na) * rad * 1.02); c.stroke();
      c.fillStyle = '#1a1612'; c.beginPath(); c.arc(px, py, 4, 0, 6.283); c.fill();
      // glass
      var gl = c.createLinearGradient(x, y, x + w * 0.6, y + h);
      gl.addColorStop(0, 'rgba(255,255,255,0.14)'); gl.addColorStop(0.45, 'rgba(255,255,255,0.02)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = gl; roundRect(c, x, y, w, h, 3); c.fill();
    }

    function draw(dt) {
      if (!statics) return;
      var c = ctx;
      c.clearRect(0, 0, W, H);
      c.drawImage(statics, 0, 0, W, H);

      // sodium streetlights, flickering
      c.globalCompositeOperation = 'lighter';
      for (var i = 0; i < sodium.length; i++) {
        var s = sodium[i];
        var a = s.a * (RM() ? 1 : (0.75 + 0.25 * Math.sin(time * 1.7 + s.p)));
        c.fillStyle = 'rgba(255,154,60,' + (a * 0.9) + ')';
        c.beginPath(); c.arc(s.x, s.y, s.r, 0, 6.283); c.fill();
        c.fillStyle = 'rgba(255,154,60,' + (a * 0.12) + ')';
        c.beginPath(); c.arc(s.x, s.y, s.r * 4, 0, 6.283); c.fill();
      }
      c.globalCompositeOperation = 'source-over';

      var flick = RM() ? 1 : 0.96 + 0.04 * Math.sin(time * 9.3) * Math.sin(time * 2.1);
      var lamp = drawLamp(c, time, flick);

      // light pool on the deck
      c.globalCompositeOperation = 'lighter';
      var pool = c.createRadialGradient(lamp.x + 40, L.top + L.dh * 0.25, 0, lamp.x + 40, L.top + L.dh * 0.25, L.dw * 0.6);
      pool.addColorStop(0, 'rgba(255,212,138,' + (0.14 * flick) + ')'); pool.addColorStop(1, 'rgba(255,212,138,0)');
      c.fillStyle = pool; c.fillRect(L.left, L.top, L.dw, H - L.top);
      c.globalCompositeOperation = 'source-over';

      // reels and tape
      if (rolling && !RM()) {
        var v = 110;
        theta1 += (v / rt1) * dt; theta2 += (v / rt2) * dt;
        var take = 1.2 * dt;
        if (rt1 > L.R * 0.42) {
          rt1 -= take;
          rt2 = Math.sqrt(Math.max(0, rt2_0 * rt2_0 + (rt1_0 * rt1_0 - rt1 * rt1)));
          rt2 = Math.min(rt2, L.R * 0.93);
        }
      }
      drawTape(c);
      drawReel(c, L.cx1, L.cy, L.R, rt1, theta1, lamp);
      drawReel(c, L.cx2, L.cy, L.R, rt2, -theta2, lamp);

      // meters
      if (!L.narrow) {
        var target = rolling ? level : 0;
        if (RM()) { needleL = target; needleR = target * 0.9; }
        else {
          needleL += (target - needleL) * (target > needleL ? 0.25 : 0.08);
          needleR += (target * 0.92 - needleR) * (target * 0.92 > needleR ? 0.22 : 0.07);
        }
        var mw = L.vuW / 2 - 14, mh = L.vuH;
        drawMeter(c, L.vuX, L.vuY, mw, mh, needleL, rolling);
        drawMeter(c, L.vuX + mw + 20, L.vuY, mw, mh, needleR, rolling);
      }

      if (!canvas.classList.contains('ready')) canvas.classList.add('ready');
    }

    function frame(now) {
      raf = 0;
      if (!running) return;
      var dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      time += dt;
      if (audio.active) level = audio.level();
      draw(dt);
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (RM() || !visible || document.hidden) { draw(0); return; }
      if (running) return;
      running = true; last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

    var io = new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0.02 });
    io.observe(canvas);
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
    reduced.addEventListener('change', function () { stop(); layout(); start(); });

    var ro = new ResizeObserver(function () { layout(); draw(0); });
    ro.observe(hero);
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width; mouse.ty = (e.clientY - r.top) / r.height;
    });

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { layout(); draw(0); });
    layout(); draw(0); start();

    return {
      setOpen: function (v) { open = v; if (!running) draw(0); },
      redraw: function () { draw(0); },
      start: start
    };
  })();

  /* ---------- Sound: the room, synthesised. Never before a press. ---------- */

  var audio = (function () {
    var ctx = null, master = null, analyser = null, nodes = [], buf = null, active = false;
    function make() {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        ctx = new AC();
        analyser = ctx.createAnalyser(); analyser.fftSize = 1024;
        buf = new Float32Array(analyser.fftSize);
        analyser.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
      master = ctx.createGain(); master.gain.value = 0;
      master.connect(analyser);
      var now = ctx.currentTime;
      var filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 520; filt.Q.value = 0.8;
      filt.connect(master);
      var lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
      var lfoG = ctx.createGain(); lfoG.gain.value = 220; lfo.connect(lfoG); lfoG.connect(filt.frequency); lfo.start(now);
      var wow = ctx.createOscillator(); wow.frequency.value = 0.21;
      var wowG = ctx.createGain(); wowG.gain.value = 5; wow.connect(wowG); wow.start(now);
      var voices = [[55, 'sawtooth', 0.22], [82.41, 'triangle', 0.22], [110, 'sine', 0.16], [123.47, 'sine', 0.08], [164.81, 'triangle', 0.05]];
      voices.forEach(function (v, i) {
        var o = ctx.createOscillator(); o.type = v[1]; o.frequency.value = v[0]; o.detune.value = (i % 2 ? -4 : 4);
        wowG.connect(o.detune);
        var g = ctx.createGain(); g.gain.value = v[2];
        o.connect(g); g.connect(filt); o.start(now);
        nodes.push(o);
      });
      // tape hiss
      var len = ctx.sampleRate * 2, nb = ctx.createBuffer(1, len, ctx.sampleRate), data = nb.getChannelData(0);
      for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
      var src = ctx.createBufferSource(); src.buffer = nb; src.loop = true;
      var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 5200; bp.Q.value = 0.6;
      var hg = ctx.createGain(); hg.gain.value = 0.035;
      src.connect(bp); bp.connect(hg); hg.connect(master); src.start(now);
      nodes.push(src, lfo, wow);
      master.gain.setTargetAtTime(0.55, now, 0.5);
      active = true;
      return true;
    }
    function kill() {
      if (!ctx || !master) return;
      var m = master, ns = nodes, now = ctx.currentTime;
      m.gain.cancelScheduledValues(now);
      m.gain.setTargetAtTime(0, now, 0.25);
      nodes = []; master = null; active = false;
      setTimeout(function () {
        ns.forEach(function (n) { try { n.stop(); } catch (e) { /* already stopped */ } });
        try { m.disconnect(); } catch (e) { /* gone */ }
      }, 1200);
    }
    return {
      start: make,
      stop: kill,
      get active() { return active; },
      level: function () {
        if (!analyser) return 0;
        analyser.getFloatTimeDomainData(buf);
        var sum = 0;
        for (var i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
        var rms = Math.sqrt(sum / buf.length);
        return Math.min(1, rms * 3.4);
      }
    };
  })();

  var rollBtn = document.getElementById('roll');
  var rollLabel = document.getElementById('roll-label');
  var rollIc = document.getElementById('roll-ic');
  var PLAY = '<path d="M8 6l12 6-12 6z"/>', PAUSE = '<path d="M8 5v14M16 5v14"/>';
  function setRolling(v) {
    if (v) { if (!audio.start()) return; }
    else audio.stop();
    rolling = v;
    rollBtn.setAttribute('aria-pressed', v ? 'true' : 'false');
    rollLabel.textContent = v ? 'Stop the tape' : 'Roll the tape';
    rollIc.innerHTML = v ? PAUSE : PLAY;
    tick();
    scene.redraw();
  }
  rollBtn.addEventListener('click', function () { setRolling(!rolling); });
  document.addEventListener('keydown', function (e) {
    if (e.repeat || e.code !== 'KeyR') return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'BUTTON' || t.tagName === 'A' || t.tagName === 'TEXTAREA')) return;
    setRolling(!rolling);
  });

  /* ---------- The window: seven nights ---------- */

  var board = (function () {
    var el = document.getElementById('board');
    var detail = document.getElementById('window-detail');
    var HOUR = 40, AXIS_TOP = 38;
    var days = [], pressed = -1;
    function minsToY(min) { return AXIS_TOP + ((min + 120) / 60) * HOUR; }
    function describe(i, tonight) {
      var d = days[i];
      var lead = tonight ? '<strong>Tonight</strong> · ' : '';
      return lead + DOW[d.dow] + ' ' + d.d + ' ' + MONTH[d.mo] + ' · <span class="num">00:00</span> to <span class="num">' + hm(d.rise) + '</span>, first light.';
    }
    function press(i) {
      pressed = i;
      var btns = el.querySelectorAll('.slot');
      for (var k = 0; k < btns.length; k++) btns[k].setAttribute('aria-pressed', k === i ? 'true' : 'false');
      detail.innerHTML = describe(i, days[i].tonight);
    }
    function build() {
      var g = gate(), k = g.k;
      // Monday of this week, in Kathmandu
      var offset = (k.dow + 6) % 7;
      var monday = k.dayMs - offset * 86400000;
      days = [];
      var tonightMs = g.open ? k.dayMs : k.dayMs + 86400000;
      for (var i = 0; i < 7; i++) {
        var ms = monday + i * 86400000, dd = new Date(ms);
        var y = dd.getUTCFullYear(), mo = dd.getUTCMonth(), d = dd.getUTCDate();
        days.push({ y: y, mo: mo, d: d, dow: dd.getUTCDay(), rise: sunrise(y, mo, d), today: ms === k.dayMs, tonight: ms === tonightMs, ms: ms });
      }
      var title = document.getElementById('window-h');
      var m0 = new Date(monday);
      title.textContent = 'When the tape may roll · week of ' + m0.getUTCDate() + ' ' + MON[m0.getUTCMonth()];

      var html = '<div class="axis" aria-hidden="true">';
      [22, 0, 2, 4, 6].forEach(function (h) { var min = h < 22 ? h * 60 : (h - 24) * 60; html += '<span style="top:' + minsToY(min) + 'px">' + pad(h) + '</span>'; });
      html += '</div>';
      var idx = -1;
      days.forEach(function (d, i) {
        if (d.tonight) idx = i;
        var top = minsToY(0), h = (d.rise / 60) * HOUR;
        html += '<section class="day' + (d.today ? ' today' : '') + '" role="listitem"><h3>' + DOW[d.dow].slice(0, 3) + ' <span class="num">' + d.d + '</span></h3>' +
          '<div class="day-lines" aria-hidden="true"></div>' +
          '<button type="button" class="slot" aria-pressed="false" data-i="' + i + '" style="top:' + top + 'px;height:' + h + 'px">' +
          '<span>00:00-' + hm(d.rise) + '</span><small>' + (d.tonight ? 'tonight' : 'the window') + '</small></button></section>';
      });
      el.innerHTML = html;
      if (idx < 0) idx = 0;
      press(idx);
      board.built = true;
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('.slot');
      if (!b) return;
      press(parseInt(b.getAttribute('data-i'), 10));
    });
    return { build: build, built: false };
  })();

  /* ---------- Clock art on card 1 ---------- */

  (function () {
    var ticks = document.getElementById('art-ticks');
    if (!ticks) return;
    var s = '';
    for (var i = 0; i < 12; i++) {
      var a = i * 30 * Math.PI / 180, r1 = i % 3 === 0 ? 96 : 102, r2 = 110;
      s += '<line x1="' + (120 + Math.sin(a) * r1).toFixed(1) + '" y1="' + (120 - Math.cos(a) * r1).toFixed(1) + '" x2="' + (120 + Math.sin(a) * r2).toFixed(1) + '" y2="' + (120 - Math.cos(a) * r2).toFixed(1) + '" stroke="currentColor" stroke-width="' + (i % 3 === 0 ? 2 : 1) + '" opacity=".7"/>';
    }
    ticks.innerHTML = s;
    var g = gate();
    var deg = (g.rise / 60) * 30, a = deg * Math.PI / 180;
    var ex = 120 + Math.sin(a) * 110, ey = 120 - Math.cos(a) * 110;
    var wedge = document.querySelector('.art-window');
    wedge.setAttribute('d', 'M120 120 L120 10 A110 110 0 ' + (deg > 180 ? 1 : 0) + ' 1 ' + ex.toFixed(1) + ' ' + ey.toFixed(1) + ' Z');
    var cap = document.querySelector('.art-clock .art-caption');
    cap.textContent = '00:00 to ' + hm(g.rise) + ' tonight';
    var exTime = document.querySelector('.art-file-time');
    if (exTime) exTime.textContent = '02:31';
  })();

  /* ---------- Stacking cards: JS fallback when the browser has no scroll timelines ---------- */

  (function () {
    var supports = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
    if (supports) return;
    var lis = Array.prototype.slice.call(document.querySelectorAll('#stack > li'));
    var cards = lis.map(function (li) { return li.querySelector('.card'); });
    var n = cards.length, pending = false;
    function update() {
      pending = false;
      if (RM()) { cards.forEach(function (c) { c.style.transform = ''; c.style.setProperty('--dim', '0'); }); return; }
      for (var k = 0; k < n - 1; k++) {
        var a = cards[k].getBoundingClientRect(), b = cards[k + 1].getBoundingClientRect();
        var p = Math.max(0, Math.min(1, (a.bottom - b.top) / a.height));
        var to = 1 - (n - 1 - k) * 0.035;
        cards[k].style.transform = 'scale(' + (1 - p * (1 - to)).toFixed(4) + ')';
        cards[k].style.setProperty('--dim', (p * 0.16).toFixed(3));
      }
    }
    function onScroll() { if (!pending) { pending = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  })();

  /* ---------- The gate: read the clock on a file ---------- */

  (function () {
    var input = document.getElementById('file');
    var drop = document.getElementById('drop');
    var verdict = document.getElementById('verdict');
    var CHECK = '<svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-9"/></svg>';
    var X = '<svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    function esc(s) { return String(s).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); }
    function check(file) {
      if (!file) return;
      var name = esc(file.name);
      if (!file.lastModified) {
        verdict.className = 'verdict show no';
        verdict.innerHTML = '<p class="v-head">' + X + 'No clock on this file.</p><p class="v-line">' + name + ' carries no modified time, so there is nothing to read. Save it again on the night you record it.</p>';
        return;
      }
      var k = ktm(file.lastModified);
      var rise = sunrise(k.y, k.mo, k.d);
      var mins = k.h * 60 + k.m;
      var ok = mins < rise;
      var when = DOW[k.dow] + ' ' + k.d + ' ' + MONTH[k.mo] + ' ' + k.y;
      var t = '<span class="num">' + pad(k.h) + ':' + pad(k.m) + '</span>';
      var r = '<span class="num">' + hm(rise) + '</span>';
      if (ok) {
        verdict.className = 'verdict show ok';
        verdict.innerHTML = '<p class="v-head">' + CHECK + 'It qualifies.</p>' +
          '<p class="v-line">' + name + ' was last saved at ' + t + ' Kathmandu time on ' + when + '. That is after midnight and before first light, which came at ' + r + '.</p>' +
          '<p class="v-sub">We read the clock the file carries. Nothing was sent anywhere.</p>';
      } else {
        verdict.className = 'verdict show no';
        verdict.innerHTML = '<p class="v-head">' + X + 'Not after midnight.</p>' +
          '<p class="v-line">' + name + ' was last saved at ' + t + ' Kathmandu time on ' + when + '. First light that morning was ' + r + '. The window is 00:00 to first light.</p>' +
          '<p class="v-sub">Record it again tonight, after 00:00, and save it before the sun is up.</p>';
      }
    }
    input.addEventListener('change', function () { check(input.files && input.files[0]); });
    ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('over'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('over'); }); });
    drop.addEventListener('drop', function (e) { var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; check(f); });
  })();

  /* ---------- Phone menu: circle reveal ---------- */

  (function () {
    var burger = document.querySelector('.burger');
    var menu = document.getElementById('menu');
    var main = document.querySelector('main');
    var links = Array.prototype.slice.call(menu.querySelectorAll('a'));
    var isOpen = false;
    function geometry() {
      var r = burger.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var W = window.innerWidth, H = window.innerHeight;
      var far = Math.max(Math.hypot(cx, cy), Math.hypot(W - cx, cy), Math.hypot(cx, H - cy), Math.hypot(W - cx, H - cy));
      menu.style.setProperty('--cx', cx + 'px');
      menu.style.setProperty('--cy', cy + 'px');
      menu.style.setProperty('--r', (far + 8) + 'px');
    }
    function open() {
      geometry();
      isOpen = true;
      menu.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('menu-open');
      main.setAttribute('inert', '');
      setTimeout(function () { if (isOpen && links[0]) links[0].focus(); }, RM() ? 0 : 200);
    }
    function close(cb) {
      isOpen = false;
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('menu-open');
      main.removeAttribute('inert');
      burger.focus();
      if (cb) setTimeout(cb, RM() ? 0 : 60);
    }
    burger.addEventListener('click', function () { if (isOpen) close(); else open(); });
    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key === 'Tab') {
        var order = [burger].concat(links);
        var i = order.indexOf(document.activeElement);
        if (i < 0) { e.preventDefault(); burger.focus(); return; }
        if (e.shiftKey && i === 0) { e.preventDefault(); order[order.length - 1].focus(); }
        else if (!e.shiftKey && i === order.length - 1) { e.preventDefault(); order[0].focus(); }
      }
    });
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var id = a.getAttribute('href').slice(1);
        close(function () {
          var t = document.getElementById(id);
          if (t) t.scrollIntoView({ behavior: RM() ? 'auto' : 'smooth', block: 'start' });
        });
      });
    });
    window.addEventListener('resize', function () { if (isOpen) geometry(); if (isOpen && window.innerWidth > 767) close(); });
  })();

  /* ---------- Entry, bar, back to top ---------- */

  (function () {
    var targets = document.querySelectorAll('.window .frame, .steps-head, .colophon');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    Array.prototype.forEach.call(targets, function (t) { t.classList.add('reveal'); io.observe(t); });

    var bar = document.querySelector('.bar');
    function onScroll() { bar.classList.toggle('scrolled', window.scrollY > 10); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    document.getElementById('topbtn').addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: RM() ? 'auto' : 'smooth' });
    });
  })();

  /* ---------- Go ---------- */

  board.build();
  tick();
  setInterval(tick, 250);
})();
