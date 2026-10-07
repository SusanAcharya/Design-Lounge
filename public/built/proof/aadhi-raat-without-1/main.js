/* Aadhi Raat Records — main.js
   Everything on this page is keyed to Nepal Standard Time (UTC+5:45). */
(function () {
  'use strict';

  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NPT_OFFSET_MIN = 345;                 // UTC+5:45
  var KTM_LAT = 27.7172, KTM_LON = 85.3240;  // Kathmandu
  var DAY_MS = 86400000;

  var $ = function (id) { return document.getElementById(id); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var hhmm = function (min) { min = ((min % 1440) + 1440) % 1440; return pad(Math.floor(min / 60)) + ':' + pad(Math.floor(min % 60)); };
  var hms = function (ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    return pad(Math.floor(s / 3600)) + ':' + pad(Math.floor((s % 3600) / 60)) + ':' + pad(s % 60);
  };

  /* ------------------------------------------------------------------
     Sun: civil dawn (sun 6° below the horizon) for a given UTC date,
     after the classic almanac algorithm. Returns minutes after 00:00 UTC.
  ------------------------------------------------------------------ */
  function dawnUTCMinutes(y, m, d, lat, lon) {
    var rad = Math.PI / 180, deg = 180 / Math.PI;
    var zenith = 96; // civil
    var n1 = Math.floor(275 * m / 9), n2 = Math.floor((m + 9) / 12);
    var n3 = 1 + Math.floor((y - 4 * Math.floor(y / 4) + 2) / 3);
    var n = n1 - n2 * n3 + d - 30;
    var lngHour = lon / 15;
    var t = n + ((6 - lngHour) / 24);
    var M = (0.9856 * t) - 3.289;
    var L = M + (1.916 * Math.sin(M * rad)) + (0.020 * Math.sin(2 * M * rad)) + 282.634;
    L = ((L % 360) + 360) % 360;
    var RA = Math.atan(0.91764 * Math.tan(L * rad)) * deg;
    RA = ((RA % 360) + 360) % 360;
    var Lq = Math.floor(L / 90) * 90, RAq = Math.floor(RA / 90) * 90;
    RA = (RA + (Lq - RAq)) / 15;
    var sinDec = 0.39782 * Math.sin(L * rad);
    var cosDec = Math.cos(Math.asin(sinDec));
    var cosH = (Math.cos(zenith * rad) - (sinDec * Math.sin(lat * rad))) / (cosDec * Math.cos(lat * rad));
    if (cosH > 1 || cosH < -1) return null;
    var H = (360 - Math.acos(cosH) * deg) / 15;
    var T = H + RA - (0.06571 * t) - 6.622;
    var UT = T - lngHour;
    UT = ((UT % 24) + 24) % 24;
    return UT * 60;
  }

  /* NPT state for a given instant */
  function nptState(nowMs) {
    var nptMs = nowMs + NPT_OFFSET_MIN * 60000;
    var npt = new Date(nptMs);
    var tod = ((nptMs % DAY_MS) + DAY_MS) % DAY_MS;          // ms since NPT midnight
    var todMin = tod / 60000;
    var y = npt.getUTCFullYear(), mo = npt.getUTCMonth() + 1, d = npt.getUTCDate();
    var dawnToday = dawnUTCMinutes(y, mo, d, KTM_LAT, KTM_LON);
    dawnToday = dawnToday === null ? 6 * 60 : (dawnToday + NPT_OFFSET_MIN) % 1440;
    var open = todMin < dawnToday;
    var dawnForWindow = dawnToday;
    if (!open) {
      var tm = new Date(nptMs + DAY_MS);
      var dt = dawnUTCMinutes(tm.getUTCFullYear(), tm.getUTCMonth() + 1, tm.getUTCDate(), KTM_LAT, KTM_LON);
      dawnForWindow = dt === null ? 6 * 60 : (dt + NPT_OFFSET_MIN) % 1440;
    }
    var nextMidnightMs = nowMs + (DAY_MS - tod);
    return {
      h: npt.getUTCHours(), m: npt.getUTCMinutes(), s: npt.getUTCSeconds(),
      todMin: todMin, open: open, dawn: dawnForWindow,
      msToOpen: DAY_MS - tod,
      msToClose: open ? (dawnForWindow * 60000 - tod) : 0,
      nextMidnightMs: nextMidnightMs
    };
  }

  /* ------------------------------------------------------------------
     Clock wiring
  ------------------------------------------------------------------ */
  var navClock = $('nav-clock'), footClock = $('foot-clock');
  var statusText = $('status-text');
  var dawnInline = $('dawn-inline'), dawnStat = $('dawn-stat'), lengthStat = $('length-stat');
  var countdown = $('countdown'), countdownLabel = $('countdown-label');
  var doorState = $('door-state'), doorCount = $('door-count'), doorSub = $('door-sub');
  var localMidnight = $('local-midnight');
  var dialHand = $('dial-hand'), dialNow = $('dial-now'), dialArc = $('dial-arc');
  var lastMinute = -1, lastOpen = null;

  function fmtLocal(ms, tz) {
    try {
      var opt = { hour: '2-digit', minute: '2-digit', hour12: false };
      if (tz) opt.timeZone = tz;
      return new Intl.DateTimeFormat('en-GB', opt).format(new Date(ms));
    } catch (e) {
      var d = new Date(ms);
      return pad(d.getHours()) + ':' + pad(d.getMinutes());
    }
  }

  function arcPath(startMin, endMin) {
    // dial: midnight at top, clockwise, 1440 minutes round
    var cx = 200, cy = 200, r = 150;
    var a0 = (startMin / 1440) * Math.PI * 2 - Math.PI / 2;
    var a1 = (endMin / 1440) * Math.PI * 2 - Math.PI / 2;
    var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    var x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    var large = (endMin - startMin) > 720 ? 1 : 0;
    return 'M' + cx + ' ' + cy + ' L' + x0.toFixed(2) + ' ' + y0.toFixed(2) +
      ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(2) + ' ' + y1.toFixed(2) + ' Z';
  }

  function buildDialTicks() {
    var g = $('dial-ticks');
    if (!g) return;
    var html = '';
    for (var i = 0; i < 96; i++) {
      var a = (i / 96) * Math.PI * 2 - Math.PI / 2;
      var major = i % 4 === 0;
      var r1 = major ? 136 : 142, r2 = 150;
      html += '<line class="' + (major ? 'major' : '') + '" x1="' + (200 + r1 * Math.cos(a)).toFixed(2) + '" y1="' + (200 + r1 * Math.sin(a)).toFixed(2) +
        '" x2="' + (200 + r2 * Math.cos(a)).toFixed(2) + '" y2="' + (200 + r2 * Math.sin(a)).toFixed(2) + '"/>';
    }
    g.innerHTML = html;
  }

  function tick() {
    var now = Date.now();
    var st = nptState(now);
    var clock = pad(st.h) + ':' + pad(st.m) + ':' + pad(st.s);
    var iso = pad(st.h) + ':' + pad(st.m) + ':' + pad(st.s) + '+05:45';
    if (navClock) { navClock.textContent = clock; navClock.setAttribute('datetime', iso); }
    if (footClock) { footClock.textContent = clock; footClock.setAttribute('datetime', iso); }

    if (st.open !== lastOpen) {
      lastOpen = st.open;
      document.body.setAttribute('data-window', st.open ? 'open' : 'closed');
      if (countdownLabel) countdownLabel.textContent = st.open ? 'Closes in' : 'Opens in';
      if (doorState) doorState.textContent = st.open ? 'The door is open.' : 'The door is closed.';
      if (doorSub) doorSub.textContent = st.open ? 'until first light' : 'until it opens';
    }

    var remaining = st.open ? st.msToClose : st.msToOpen;
    if (countdown) countdown.textContent = hms(remaining);
    if (doorCount) doorCount.textContent = hms(remaining);
    if (statusText) {
      statusText.textContent = st.open
        ? 'Window open · first light in ' + hms(st.msToClose)
        : 'Window closed · opens in ' + hms(st.msToOpen);
    }

    var minuteKey = st.h * 60 + st.m;
    if (minuteKey !== lastMinute) {
      lastMinute = minuteKey;
      var dawnStr = hhmm(st.dawn);
      if (dawnInline) dawnInline.textContent = dawnStr;
      if (dawnStat) dawnStat.textContent = dawnStr;
      if (lengthStat) {
        var len = st.dawn;
        lengthStat.textContent = Math.floor(len / 60) + 'h ' + pad(Math.round(len % 60)) + 'm';
      }
      if (dialArc) dialArc.setAttribute('d', arcPath(0, st.dawn));
      if (dialHand) dialHand.style.transform = 'rotate(' + ((st.todMin / 1440) * 360).toFixed(3) + 'deg)';
      if (dialNow) dialNow.textContent = pad(st.h) + ':' + pad(st.m);
      if (localMidnight) localMidnight.textContent = fmtLocal(st.nextMidnightMs);
      var cityTimes = document.querySelectorAll('.city-time[data-tz]');
      for (var i = 0; i < cityTimes.length; i++) {
        cityTimes[i].textContent = fmtLocal(st.nextMidnightMs, cityTimes[i].getAttribute('data-tz'));
      }
    }
  }

  buildDialTicks();
  tick();
  setInterval(tick, 1000);

  /* ------------------------------------------------------------------
     Sky: stars on canvas. Twinkle and the occasional meteor unless the
     visitor prefers reduced motion, in which case the sky is drawn once.
  ------------------------------------------------------------------ */
  (function sky() {
    var c = $('sky');
    if (!c) return;
    var ctx = c.getContext('2d');
    if (!ctx) return;
    var stars = [], W = 0, H = 0, dpr = 1, meteors = [], raf = 0, last = 0;

    function seed() {
      stars.length = 0;
      var count = Math.round((W * H) / 3800);
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H * 0.78,
          r: Math.random() < 0.08 ? 1.6 + Math.random() * 0.8 : 0.5 + Math.random() * 0.8,
          a: 0.25 + Math.random() * 0.65, ph: Math.random() * Math.PI * 2, sp: 0.4 + Math.random() * 1.2,
          warm: Math.random() < 0.18
        });
      }
    }
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = c.clientWidth; H = c.clientHeight;
      c.width = Math.max(1, Math.round(W * dpr)); c.height = Math.max(1, Math.round(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      draw(0);
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      // night gradient: deep indigo at the top, warmer sodium haze at the horizon
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#07060b'); g.addColorStop(0.55, '#0c0b18'); g.addColorStop(0.85, '#1a1426'); g.addColorStop(1, '#2a1a22');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // milky band
      var band = ctx.createLinearGradient(0, 0, W, H * 0.7);
      band.addColorStop(0, 'rgba(239,233,217,0)'); band.addColorStop(0.45, 'rgba(239,233,217,0.035)'); band.addColorStop(0.6, 'rgba(239,233,217,0.03)'); band.addColorStop(1, 'rgba(239,233,217,0)');
      ctx.fillStyle = band; ctx.fillRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var tw = REDUCED ? 1 : 0.7 + 0.3 * Math.sin(t * 0.001 * s.sp + s.ph);
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = s.warm ? '#f2d6a0' : '#efe9d9';
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      for (var j = meteors.length - 1; j >= 0; j--) {
        var m = meteors[j];
        m.life += 16;
        var p = m.life / m.dur;
        if (p >= 1) { meteors.splice(j, 1); continue; }
        var x = m.x + m.vx * p * m.len, y = m.y + m.vy * p * m.len;
        var tail = ctx.createLinearGradient(x, y, x - m.vx * 90, y - m.vy * 90);
        tail.addColorStop(0, 'rgba(239,233,217,' + (0.9 * (1 - p)) + ')'); tail.addColorStop(1, 'rgba(239,233,217,0)');
        ctx.strokeStyle = tail; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - m.vx * 90, y - m.vy * 90); ctx.stroke();
      }
    }
    function loop(t) {
      if (t - last > 33) {
        last = t;
        if (Math.random() < 0.004 && meteors.length < 2) {
          var ang = Math.PI * 0.18 + Math.random() * 0.2;
          meteors.push({ x: Math.random() * W * 0.8, y: Math.random() * H * 0.3, vx: Math.cos(ang), vy: Math.sin(ang), len: 260 + Math.random() * 200, dur: 900 + Math.random() * 500, life: 0 });
        }
        draw(t);
      }
      raf = requestAnimationFrame(loop);
    }
    resize();
    window.addEventListener('resize', resize);
    if (!REDUCED) {
      raf = requestAnimationFrame(loop);
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
        else if (!raf) { raf = requestAnimationFrame(loop); }
      });
    }
  })();

  /* ------------------------------------------------------------------
     Hero: split the title into letters and stagger them in; parallax on
     the moon and the ridges from the pointer and the scroll.
  ------------------------------------------------------------------ */
  (function hero() {
    var hero = $('hero');
    if (!hero) return;
    var words = hero.querySelectorAll('[data-split]');
    var delay = 0;
    for (var i = 0; i < words.length; i++) {
      var text = words[i].textContent;
      var out = '';
      for (var k = 0; k < text.length; k++) {
        var ch = text[k];
        out += '<span class="ch" style="transition-delay:' + (delay * 35) + 'ms">' + (ch === ' ' ? '&nbsp;' : ch) + '</span>';
        delay++;
      }
      words[i].innerHTML = out;
    }
    requestAnimationFrame(function () { requestAnimationFrame(function () { hero.classList.add('ready'); }); });

    if (REDUCED) return;
    var moon = $('moon'), ridges = hero.querySelectorAll('.ridge');
    var tx = 0, ty = 0, cx = 0, cy = 0, sy = 0, running = false;
    function frame() {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      if (moon) moon.style.transform = 'translate(' + (cx * -18).toFixed(2) + 'px,' + (cy * -12 + sy * 0.25).toFixed(2) + 'px)';
      for (var i = 0; i < ridges.length; i++) {
        var depth = (ridges.length - i) * 0.5; // far ridges move more
        ridges[i].style.transform = 'translate(' + (cx * 10 * depth).toFixed(2) + 'px,' + (sy * 0.08 * (3 - i) + cy * 4 * depth).toFixed(2) + 'px)';
      }
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) requestAnimationFrame(frame); else running = false;
    }
    function kick() { if (!running) { running = true; requestAnimationFrame(frame); } }
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      tx = (e.clientX / window.innerWidth - 0.5); ty = (e.clientY / window.innerHeight - 0.5); kick();
    }, { passive: true });
    window.addEventListener('scroll', function () {
      sy = Math.min(window.scrollY, window.innerHeight); cx += 0.0001; kick();
    }, { passive: true });
  })();

  /* ------------------------------------------------------------------
     Reveal on scroll
  ------------------------------------------------------------------ */
  (function reveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (REDUCED || !('IntersectionObserver' in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add('in');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) { entries[i].target.classList.add('in'); io.unobserve(entries[i].target); }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  })();

  /* ------------------------------------------------------------------
     Cursor and magnetic buttons (pointer: fine only)
  ------------------------------------------------------------------ */
  (function cursor() {
    if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return;
    var cur = document.querySelector('.cursor');
    if (!cur) return;
    document.body.classList.add('has-cursor');
    var x = -100, y = -100, cx = -100, cy = -100, raf = 0;
    function frame() {
      if (REDUCED) { cx = x; cy = y; } else { cx += (x - cx) * 0.22; cy += (y - cy) * 0.22; }
      cur.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
      if (Math.abs(x - cx) > 0.05 || Math.abs(y - cy) > 0.05) raf = requestAnimationFrame(frame); else raf = 0;
    }
    window.addEventListener('pointermove', function (e) {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(frame);
    }, { passive: true });
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest ? e.target.closest('a, button, input, [data-magnet]') : null;
      document.body.classList.toggle('cursor-hover', !!t);
    });
    document.addEventListener('pointerleave', function () { document.body.classList.remove('cursor-hover'); });

    if (REDUCED) return;
    var mags = document.querySelectorAll('[data-magnet]');
    for (var i = 0; i < mags.length; i++) {
      (function (el) {
        el.addEventListener('pointermove', function (e) {
          var r = el.getBoundingClientRect();
          var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
          el.style.transform = 'translate(' + (dx * 0.18).toFixed(1) + 'px,' + (dy * 0.25).toFixed(1) + 'px)';
        });
        el.addEventListener('pointerleave', function () { el.style.transform = ''; });
      })(mags[i]);
    }
  })();

  /* ------------------------------------------------------------------
     The night, as a drone. Web Audio, synthesised on demand, never on
     its own. Two controls: the big button and the switch in the nav.
  ------------------------------------------------------------------ */
  (function drone() {
    var playBtn = $('play'), playLabel = $('play-label'), toggle = $('sound-toggle');
    var vol = $('vol'), scope = $('scope'), scopeState = $('scope-state');
    var AC = window.AudioContext || window.webkitAudioContext;
    var ctx = null, master = null, analyser = null, bellTimer = 0, playing = false, nodes = [];
    var sctx = scope ? scope.getContext('2d') : null;
    var sraf = 0, sW = 0, sH = 0, data = null;

    function level() { return vol ? (parseInt(vol.value, 10) / 100) * 0.7 : 0.4; }

    function build() {
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0;
      analyser = ctx.createAnalyser(); analyser.fftSize = 1024;
      master.connect(analyser); analyser.connect(ctx.destination);

      // low hum: two detuned saws through a slow low-pass, plus a sub
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260; lp.Q.value = 0.7;
      var humGain = ctx.createGain(); humGain.gain.value = 0.16;
      lp.connect(humGain); humGain.connect(master);
      var freqs = [55, 55.3, 82.4]; // A1, A1 detuned, E2
      for (var i = 0; i < freqs.length; i++) {
        var o = ctx.createOscillator(); o.type = i === 2 ? 'triangle' : 'sawtooth'; o.frequency.value = freqs[i];
        var g = ctx.createGain(); g.gain.value = i === 2 ? 0.5 : 0.35;
        o.connect(g); g.connect(lp); o.start(); nodes.push(o);
      }
      var sub = ctx.createOscillator(); sub.type = 'sine'; sub.frequency.value = 27.5;
      var subG = ctx.createGain(); subG.gain.value = 0.25; sub.connect(subG); subG.connect(master); sub.start(); nodes.push(sub);
      // filter breathes slowly
      var lfo = ctx.createOscillator(); lfo.frequency.value = 0.05;
      var lfoG = ctx.createGain(); lfoG.gain.value = 120; lfo.connect(lfoG); lfoG.connect(lp.frequency); lfo.start(); nodes.push(lfo);

      // wind: looping noise through a wandering band-pass
      var len = ctx.sampleRate * 4, buf = ctx.createBuffer(1, len, ctx.sampleRate), ch = buf.getChannelData(0);
      var b0 = 0, b1 = 0, b2 = 0;
      for (var n = 0; n < len; n++) { var w = Math.random() * 2 - 1; b0 = 0.99765 * b0 + w * 0.099; b1 = 0.963 * b1 + w * 0.2965; b2 = 0.57 * b2 + w * 1.0526; ch[n] = (b0 + b1 + b2 + w * 0.1848) * 0.08; }
      var noise = ctx.createBufferSource(); noise.buffer = buf; noise.loop = true;
      var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 420; bp.Q.value = 0.6;
      var windG = ctx.createGain(); windG.gain.value = 0.35;
      var wlfo = ctx.createOscillator(); wlfo.frequency.value = 0.11; var wlfoG = ctx.createGain(); wlfoG.gain.value = 260;
      wlfo.connect(wlfoG); wlfoG.connect(bp.frequency); wlfo.start(); nodes.push(wlfo);
      var alfo = ctx.createOscillator(); alfo.frequency.value = 0.07; var alfoG = ctx.createGain(); alfoG.gain.value = 0.18;
      alfo.connect(alfoG); alfoG.connect(windG.gain); alfo.start(); nodes.push(alfo);
      noise.connect(bp); bp.connect(windG); windG.connect(master); noise.start(); nodes.push(noise);
    }

    function bell() {
      if (!ctx || !playing) return;
      var base = [220, 246.9, 293.7, 329.6, 392][Math.floor(Math.random() * 5)] * (Math.random() < 0.3 ? 0.5 : 1);
      var partials = [1, 2.76, 5.4, 8.93], t = ctx.currentTime;
      var bg = ctx.createGain(); bg.gain.value = 0.9; bg.connect(master);
      for (var i = 0; i < partials.length; i++) {
        var o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = base * partials[i];
        var g = ctx.createGain();
        var peak = 0.09 / (i + 1);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 7 - i * 1.2);
        o.connect(g); g.connect(bg); o.start(t); o.stop(t + 7.2);
      }
      bellTimer = setTimeout(bell, 9000 + Math.random() * 11000);
    }

    function setUI(on) {
      if (playBtn) playBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (playLabel) playLabel.textContent = on ? 'Stop the night' : 'Play the night';
      if (toggle) {
        toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
        toggle.setAttribute('aria-label', on ? 'Sound on. Press to stop the night drone.' : 'Sound off. Press to play the night drone.');
        var st = toggle.querySelector('.sound-text'); if (st) st.textContent = on ? 'Sound on' : 'Sound off';
      }
      if (scopeState) scopeState.textContent = on ? 'playing' : 'silent';
    }

    function start() {
      if (!AC) { setUI(false); if (scopeState) scopeState.textContent = 'no audio here'; return; }
      try {
        if (!ctx) build();
        if (ctx.state === 'suspended') ctx.resume();
        playing = true;
        var t = ctx.currentTime;
        master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t);
        master.gain.linearRampToValueAtTime(level(), t + 2.5);
        clearTimeout(bellTimer); bellTimer = setTimeout(bell, 1800);
        setUI(true);
        if (!sraf) sraf = requestAnimationFrame(scopeLoop);
      } catch (e) { setUI(false); }
    }
    function stop() {
      playing = false; clearTimeout(bellTimer);
      if (ctx && master) {
        var t = ctx.currentTime;
        master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t);
        master.gain.linearRampToValueAtTime(0, t + 1.2);
        setTimeout(function () { if (!playing && ctx && ctx.state === 'running') ctx.suspend(); }, 1400);
      }
      setUI(false);
    }
    function flip() { if (playing) stop(); else start(); }
    if (playBtn) playBtn.addEventListener('click', flip);
    if (toggle) toggle.addEventListener('click', flip);
    if (vol) vol.addEventListener('input', function () {
      if (ctx && master && playing) { var t = ctx.currentTime; master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t); master.gain.linearRampToValueAtTime(level(), t + 0.2); }
    });
    document.addEventListener('visibilitychange', function () { if (document.hidden && playing) stop(); });

    /* scope: a resting line while silent, the live waveform while playing */
    function scopeResize() {
      if (!scope || !sctx) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      sW = scope.clientWidth; sH = scope.clientHeight;
      scope.width = Math.max(1, Math.round(sW * dpr)); scope.height = Math.max(1, Math.round(sH * dpr));
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scopeDraw();
    }
    function scopeDraw() {
      if (!sctx) return;
      sctx.clearRect(0, 0, sW, sH);
      // grid
      sctx.strokeStyle = 'rgba(239,233,217,0.07)'; sctx.lineWidth = 1;
      for (var gx = 0; gx <= sW; gx += sW / 8) { sctx.beginPath(); sctx.moveTo(gx, 0); sctx.lineTo(gx, sH); sctx.stroke(); }
      for (var gy = 0; gy <= sH; gy += sH / 6) { sctx.beginPath(); sctx.moveTo(0, gy); sctx.lineTo(sW, gy); sctx.stroke(); }
      sctx.strokeStyle = '#f2a93b'; sctx.lineWidth = 1.5; sctx.beginPath();
      if (playing && analyser) {
        if (!data || data.length !== analyser.fftSize) data = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(data);
        for (var i = 0; i < data.length; i++) {
          var x = (i / (data.length - 1)) * sW, y = sH / 2 + ((data[i] - 128) / 128) * sH * 0.42;
          if (i === 0) sctx.moveTo(x, y); else sctx.lineTo(x, y);
        }
      } else {
        sctx.moveTo(0, sH / 2); sctx.lineTo(sW, sH / 2);
      }
      sctx.stroke();
    }
    var lastScope = 0;
    function scopeLoop(t) {
      if (!playing && (!master || master.gain.value < 0.001)) { scopeDraw(); sraf = 0; return; }
      if (!REDUCED || t - lastScope > 500) { lastScope = t; scopeDraw(); }
      sraf = requestAnimationFrame(scopeLoop);
    }
    scopeResize();
    window.addEventListener('resize', scopeResize);
  })();

})();
