(() => {
  'use strict';

  const doc = document;
  const body = doc.body;
  const $ = (s, r = doc) => r.querySelector(s);
  const $$ = (s, r = doc) => Array.from(r.querySelectorAll(s));
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => reduceMQ.matches;

  /* ------------------------------------------------------------------
     Kathmandu clock and the room's live state
  ------------------------------------------------------------------ */
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  });
  const fmtDay = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kathmandu', month: '2-digit', day: '2-digit' });

  function npt() {
    const [h, m] = fmt.format(new Date()).split(':').map(Number);
    return { h, m, text: String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') };
  }

  function liveState() {
    const t = npt();
    const mins = t.h * 60 + t.m;
    const live = mins < 5 * 60 + 20;
    const left = 24 * 60 - mins;
    const hh = Math.floor(left / 60), mm = left % 60;
    const wait = (hh ? hh + 'h ' : '') + mm + 'm';
    return {
      t, live,
      short: live ? 'Recording' : 'Doors 00:00',
      long: live ? 'Recording now, until the first bell' : 'The room locks in ' + wait,
      state: live ? 'Recording now' : 'Locks in ' + wait
    };
  }

  function tick() {
    const s = liveState();
    $$('[data-clock]').forEach(el => {
      el.textContent = s.t.text;
      if (el.tagName === 'TIME') el.setAttribute('datetime', s.t.text);
    });
    $$('[data-clock-blink]').forEach(el => {
      const [h, m] = s.t.text.split(':');
      el.innerHTML = h + '<span class="c">:</span>' + m;
    });
    $$('[data-live-short]').forEach(el => { el.textContent = s.short; });
    $$('[data-live-long]').forEach(el => { el.textContent = s.long; });
    $$('[data-live-state]').forEach(el => { el.textContent = s.state; });
    body.classList.toggle('is-live', s.live);
  }
  tick();
  setInterval(tick, 30000);

  /* ------------------------------------------------------------------
     Rail: one indicator that follows the section in view
  ------------------------------------------------------------------ */
  const railLinks = $$('.rail-nav a');
  const menuLinks = $$('.menu-links a');
  const ind = $('.rail-ind');

  function setActive(id) {
    railLinks.forEach(a => {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    menuLinks.forEach(a => {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    const link = railLinks.find(a => a.getAttribute('href') === '#' + id);
    if (link && ind) ind.style.setProperty('--y', link.parentElement.offsetTop + 'px');
  }
  const spy = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), {
    rootMargin: '-45% 0px -50% 0px'
  });
  ['records', 'rules', 'night', 'send'].forEach(id => { const s = doc.getElementById(id); if (s) spy.observe(s); });

  /* ------------------------------------------------------------------
     Phone menu: circle reveal from the button
  ------------------------------------------------------------------ */
  const burger = $('.burger');
  const menu = $('#menu');
  const site = $('.site');
  const player = $('#player');
  let menuOpen = false;

  function geometry() {
    const b = burger.getBoundingClientRect();
    const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
    const r = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
    body.style.setProperty('--cx', cx + 'px');
    body.style.setProperty('--cy', cy + 'px');
    body.style.setProperty('--r', Math.ceil(r) + 'px');
  }
  function setMenu(open) {
    menuOpen = open;
    if (open) geometry();
    body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    site.inert = open;
    player.inert = open;
    doc.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) setTimeout(() => menuLinks[0] && menuLinks[0].focus(), reduced() ? 0 : 200);
    else burger.focus();
  }
  burger.addEventListener('click', () => setMenu(!menuOpen));
  menuLinks.forEach(a => a.addEventListener('click', () => { if (menuOpen) setMenu(false); }));
  doc.addEventListener('keydown', e => {
    if (!menuOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); setMenu(false); return; }
    if (e.key === 'Tab') {
      const list = [burger, ...menuLinks];
      const i = list.indexOf(doc.activeElement);
      if (i === -1) { e.preventDefault(); burger.focus(); return; }
      if (e.shiftKey && i === 0) { e.preventDefault(); list[list.length - 1].focus(); }
      else if (!e.shiftKey && i === list.length - 1) { e.preventDefault(); list[0].focus(); }
    }
  });
  addEventListener('resize', () => { if (menuOpen) geometry(); if (innerWidth >= 760 && menuOpen) setMenu(false); });

  /* ------------------------------------------------------------------
     Hero shader: domain-warped fog, sodium gold over the valley
  ------------------------------------------------------------------ */
  (function shader() {
    const canvas = $('#gl');
    const hero = $('.hero');
    const pauseBtn = $('[data-pause]');
    const pauseLabel = pauseBtn.querySelector('span');
    let gl, prog, uRes, uTime, uMouse, uOct, uOff;
    let raf = 0, last = 0, time = 14, visible = true, paused = false, drawn = false;
    let probeN = 0, probeMs = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const frag = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_oct;
uniform vec2 u_off;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;mat2 r=mat2(.8,.6,-.6,.8);
  for(int i=0;i<6;i++){if(float(i)>=u_oct)break;v+=a*noise(p);p=r*p*2.02;a*=.5;}
  return v;
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  vec2 p=(gl_FragCoord.xy-.5*u_res)/u_res.y+u_off;
  vec2 m=(u_mouse-.5*u_res)/u_res.y+u_off;
  float t=u_time*.035;
  float d=length(p-m);
  float pull=exp(-d*d*2.2);
  vec2 q=vec2(fbm(p*1.3+vec2(0.,t)),fbm(p*1.3+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p*1.5+2.*q+vec2(1.7,9.2)+t*.6+(m-p)*pull*.35),
              fbm(p*1.5+2.*q+vec2(8.3,2.8)-t*.4));
  float f=clamp((fbm(p*1.7+2.4*r)-.5)*2.4+.5,0.,1.);
  vec3 navy=vec3(.043,.071,.125),deep=vec3(.102,.141,.220);
  vec3 glacier=vec3(.184,.220,.294),ice=vec3(.878,.706,.290);
  vec3 c=mix(navy,deep,smoothstep(.05,.45,f));
  c=mix(c,glacier,smoothstep(.4,.75,f)*(.5+.5*clamp(length(q),0.,1.)));
  c=mix(c,ice,smoothstep(.42,.86,f+.3*(r.x-.5)+pull*.18)*.8);
  c=mix(c,ice,pull*.6*smoothstep(.2,.75,f));
  c*=1.-.55*dot(uv-.5,uv-.5);
  gl_FragColor=vec4(c,1.);
}`;
    const vert = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';

    function fail() {
      body.classList.add('no-gl');
      stop();
    }
    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    }
    try {
      gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
      if (!gl) throw new Error('no webgl');
      prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'a');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      uRes = gl.getUniformLocation(prog, 'u_res');
      uTime = gl.getUniformLocation(prog, 'u_time');
      uMouse = gl.getUniformLocation(prog, 'u_mouse');
      uOct = gl.getUniformLocation(prog, 'u_oct');
      uOff = gl.getUniformLocation(prog, 'u_off');
    } catch (err) {
      fail();
      return;
    }

    const small = () => innerWidth < 640;
    function rest() {
      mouse.tx = canvas.width * 0.72;
      mouse.ty = canvas.height * 0.8;
    }
    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 1.5) * (small() ? 0.75 : 1);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (w !== canvas.width || h !== canvas.height) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
        rest();
        mouse.x = mouse.tx; mouse.y = mouse.ty;
      }
      draw();
    }
    function draw() {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uOct, small() ? 3 : 5);
      if (small()) gl.uniform2f(uOff, 0.55, 0.2); else gl.uniform2f(uOff, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!drawn) { drawn = true; requestAnimationFrame(() => canvas.classList.add('on')); }
    }
    function frame(now) {
      const raw = now - last;
      last = now;
      if (probeN < 30) {
        probeN++; probeMs += raw;
        if (probeN === 30 && probeMs / 30 > 28) { setPaused(true); return; }
      }
      time += Math.min(raw, 50) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      draw();
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }
    function update() {
      if (visible && !doc.hidden && !paused) start(); else stop();
    }
    function setPaused(p) {
      paused = p;
      pauseBtn.setAttribute('aria-pressed', String(p));
      pauseLabel.textContent = p ? 'Play motion' : 'Pause motion';
      update();
    }
    pauseBtn.addEventListener('click', () => setPaused(!paused));
    hero.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      const k = canvas.width / r.width;
      mouse.tx = (e.clientX - r.left) * k;
      mouse.ty = (r.bottom - e.clientY) * k;
    });
    hero.addEventListener('pointerleave', rest);
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; update(); }).observe(canvas);
    doc.addEventListener('visibilitychange', update);
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); fail(); });
    let rt = 0;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 120); });
    resize();
    if (reduced()) setPaused(true); else update();
  })();

  /* ------------------------------------------------------------------
     Audio: one context, every sound drawn live, nothing fetched
  ------------------------------------------------------------------ */
  const Sound = (() => {
    let ctx = null, master = null, analyser = null, noiseBuf = null;
    function ensure() {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.9;
        analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        master.connect(analyser);
        analyser.connect(ctx.destination);
        noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
        const d = noiseBuf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }
    function noise(dest, { type = 'bandpass', freq = 800, q = 0.7, gain = 0.05, at = 0, dur = 0, loop = true } = {}) {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuf; src.loop = loop;
      const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
      const g = ctx.createGain(); g.gain.value = gain;
      src.connect(f); f.connect(g); g.connect(dest);
      const t0 = ctx.currentTime + at;
      src.start(t0);
      if (dur) {
        g.gain.setValueAtTime(gain, t0);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        src.stop(t0 + dur + 0.05);
      }
      return { src, g };
    }
    function bell(dest, freq, at = 0, level = 0.25, decay = 3.6) {
      const t0 = ctx.currentTime + at;
      [[1, 1], [2.76, 0.5], [5.4, 0.26], [8.93, 0.12]].forEach(([r, a]) => {
        const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = freq * r;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(level * a, t0 + 0.006);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + decay / Math.sqrt(r));
        o.connect(g); g.connect(dest);
        o.start(t0); o.stop(t0 + decay + 0.1);
      });
    }
    function thud(dest, at = 0, from = 120, to = 40, level = 0.6) {
      const t0 = ctx.currentTime + at;
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(from, t0);
      o.frequency.exponentialRampToValueAtTime(to, t0 + 0.16);
      const g = ctx.createGain();
      g.gain.setValueAtTime(level, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.3);
      o.connect(g); g.connect(dest);
      o.start(t0); o.stop(t0 + 0.35);
    }

    /* A 42 second sketch: drone, a harmonium swell, the street, a bell */
    let sketch = null;
    function startSketch(root) {
      if (!ensure()) return false;
      stopSketch(true);
      const bus = ctx.createGain();
      bus.gain.value = 0.0001;
      bus.connect(master);
      const now = ctx.currentTime;
      bus.gain.exponentialRampToValueAtTime(0.9, now + 2.4);
      const nodes = [];

      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 650; lp.Q.value = 3;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
      const lfoG = ctx.createGain(); lfoG.gain.value = 280;
      lfo.connect(lfoG); lfoG.connect(lp.frequency); lfo.start(); nodes.push(lfo);
      const droneG = ctx.createGain(); droneG.gain.value = 0.05;
      lp.connect(droneG); droneG.connect(bus);
      [[1, 0], [1.5, 6], [2, -5]].forEach(([r, det]) => {
        const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = root * r; o.detune.value = det;
        o.connect(lp); o.start(); nodes.push(o);
      });

      const padG = ctx.createGain(); padG.gain.value = 0.0;
      const swell = ctx.createOscillator(); swell.frequency.value = 0.11;
      const swellG = ctx.createGain(); swellG.gain.value = 0.03;
      swell.connect(swellG); swellG.connect(padG.gain); swell.start(); nodes.push(swell);
      const padF = ctx.createBiquadFilter(); padF.type = 'lowpass'; padF.frequency.value = 1400;
      padF.connect(padG); padG.connect(bus);
      [2, 2.4, 3].forEach(r => {
        const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = root * r;
        o.connect(padF); o.start(); nodes.push(o);
      });

      const street = noise(bus, { type: 'bandpass', freq: 420, q: 0.6, gain: 0.03 });
      nodes.push(street.src);

      const scale = [4, 4.5, 5, 6, 6.75];
      let n = 0;
      const ring = () => { bell(bus, root * scale[n++ % scale.length], 0, 0.12, 4.2); };
      const timers = [setTimeout(ring, 1800), setInterval(ring, 6400)];

      sketch = { bus, nodes, timers };
      return true;
    }
    function stopSketch(now) {
      if (!sketch) return;
      const { bus, nodes, timers } = sketch;
      sketch = null;
      clearTimeout(timers[0]); clearInterval(timers[1]);
      const t = ctx.currentTime;
      bus.gain.cancelScheduledValues(t);
      bus.gain.setValueAtTime(Math.max(bus.gain.value, 0.0001), t);
      bus.gain.exponentialRampToValueAtTime(0.0001, t + (now ? 0.05 : 0.6));
      nodes.forEach(o => { try { o.stop(t + 0.7); } catch (e) { /* already stopped */ } });
      setTimeout(() => bus.disconnect(), 900);
    }

    /* The five rule sounds */
    function rule(kind) {
      if (!ensure()) return 0;
      const out = ctx.createGain(); out.gain.value = 0.9; out.connect(master);
      const done = (s) => { setTimeout(() => out.disconnect(), (s + 0.5) * 1000); return s; };
      if (kind === 'lock') {
        noise(out, { type: 'lowpass', freq: 500, gain: 0.5, dur: 0.12, loop: false });
        thud(out, 0, 140, 60, 0.5);
        noise(out, { type: 'bandpass', freq: 3200, q: 4, gain: 0.4, at: 0.42, dur: 0.05, loop: false });
        thud(out, 0.44, 180, 90, 0.3);
        return done(1.2);
      }
      if (kind === 'hum') {
        const g = ctx.createGain(); g.gain.value = 0.0001; g.connect(out);
        const t0 = ctx.currentTime;
        g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.4);
        g.gain.setValueAtTime(0.12, t0 + 2.2);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.8);
        [[50, 1], [100, 0.5], [150, 0.25]].forEach(([f, a]) => {
          const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
          const og = ctx.createGain(); og.gain.value = a;
          o.connect(og); og.connect(g); o.start(t0); o.stop(t0 + 2.9);
        });
        noise(out, { type: 'bandpass', freq: 900, q: 0.4, gain: 0.03, dur: 2.8, loop: true });
        return done(2.9);
      }
      if (kind === 'tape') {
        const t0 = ctx.currentTime;
        noise(out, { type: 'highpass', freq: 4200, q: 0.5, gain: 0.05, dur: 2.8, loop: true });
        const o = ctx.createOscillator(); o.type = 'triangle';
        o.frequency.setValueAtTime(70, t0);
        o.frequency.exponentialRampToValueAtTime(220, t0 + 0.7);
        const vib = ctx.createOscillator(); vib.frequency.value = 5.2;
        const vibG = ctx.createGain(); vibG.gain.value = 2.2;
        vib.connect(vibG); vibG.connect(o.frequency);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.6);
        g.gain.setValueAtTime(0.12, t0 + 2.2);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.8);
        o.connect(g); g.connect(out);
        o.start(t0); vib.start(t0); o.stop(t0 + 2.9); vib.stop(t0 + 2.9);
        return done(2.9);
      }
      if (kind === 'bell') {
        bell(out, 262, 0, 0.32, 4.8);
        return done(3.2);
      }
      if (kind === 'stamp') {
        thud(out, 0, 130, 40, 0.7);
        noise(out, { type: 'lowpass', freq: 900, gain: 0.35, dur: 0.08, loop: false });
        thud(out, 0.9, 130, 40, 0.7);
        noise(out, { type: 'lowpass', freq: 900, gain: 0.35, at: 0.9, dur: 0.08, loop: false });
        return done(1.6);
      }
      return 0;
    }

    return { ensure, startSketch, stopSketch, rule, analyser: () => analyser };
  })();

  /* ------------------------------------------------------------------
     Showreel: four cases, always one open
  ------------------------------------------------------------------ */
  const cases = $$('.case');
  let current = cases[0];

  function openCase(el) {
    cases.forEach(c => {
      const on = c === el;
      c.setAttribute('aria-expanded', String(on));
      c.querySelector('.case-head').setAttribute('aria-expanded', String(on));
    });
    current = el;
    if (!playing) loadTrack(el);
  }
  cases.forEach(c => c.querySelector('.case-head').addEventListener('click', () => openCase(c)));
  $$('[data-open-case]').forEach(a => a.addEventListener('click', () => {
    const c = cases[Number(a.dataset.openCase)];
    if (c) openCase(c);
  }));

  /* ------------------------------------------------------------------
     Corner player
  ------------------------------------------------------------------ */
  const pPlay = $('[data-p-play]');
  const pOpen = $('[data-p-open]');
  const pTitle = $('[data-p-title]');
  const pStamp = $('.p-sleeve .stamp');
  const scope = $('.p-scope');
  const DURATION = 42;
  let playing = false, opened = false, track = cases[0], endTimer = 0, scopeRaf = 0;

  function loadTrack(c) {
    track = c;
    pTitle.textContent = c.dataset.cat + ' · ' + c.dataset.title;
    pStamp.textContent = c.querySelector('.stamp').textContent;
    player.style.setProperty('--sleeve', c.style.getPropertyValue('--sleeve'));
    player.style.setProperty('--sleeve-ink', c.style.getPropertyValue('--sleeve-ink'));
  }
  function setPlay(on) {
    if (on) {
      const ok = Sound.startSketch(Number(track.dataset.root) || 110);
      if (!ok) return;
      clearTimeout(endTimer);
      endTimer = setTimeout(() => setPlay(false), DURATION * 1000);
    } else {
      Sound.stopSketch(false);
      clearTimeout(endTimer);
    }
    playing = on;
    player.dataset.play = String(on);
    pPlay.setAttribute('aria-pressed', String(on));
    pPlay.querySelector('span').textContent = on ? 'Pause' : 'Play';
    scopeLoop();
  }
  function setOpen(on) {
    opened = on;
    player.dataset.open = String(on);
    pOpen.setAttribute('aria-expanded', String(on));
    pOpen.querySelector('span').textContent = on ? 'Close' : 'Open';
    scopeLoop();
  }
  player.style.setProperty('--dur', DURATION + 's');
  pPlay.addEventListener('click', () => setPlay(!playing));
  pOpen.addEventListener('click', () => setOpen(!opened));
  $('[data-play-hero]').addEventListener('click', () => {
    openCase(cases[0]);
    loadTrack(cases[0]);
    if (!playing) setPlay(true);
  });
  $$('[data-open-player]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    setOpen(true);
    pOpen.focus();
  }));

  function drawScope() {
    const ctx2 = scope.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(scope.clientWidth * dpr));
    const h = Math.max(1, Math.round(scope.clientHeight * dpr));
    if (scope.width !== w || scope.height !== h) { scope.width = w; scope.height = h; }
    const css = getComputedStyle(doc.documentElement);
    ctx2.clearRect(0, 0, w, h);
    ctx2.strokeStyle = css.getPropertyValue('--line').trim();
    ctx2.lineWidth = 1 * dpr;
    ctx2.beginPath(); ctx2.moveTo(0, h / 2); ctx2.lineTo(w, h / 2); ctx2.stroke();
    const an = Sound.analyser();
    ctx2.strokeStyle = css.getPropertyValue('--primary').trim();
    ctx2.lineWidth = 1.5 * dpr;
    ctx2.beginPath();
    if (an && playing) {
      const data = new Uint8Array(an.fftSize);
      an.getByteTimeDomainData(data);
      for (let i = 0; i < data.length; i++) {
        const x = (i / (data.length - 1)) * w;
        const y = h / 2 + ((data[i] - 128) / 128) * h * 1.6;
        if (i) ctx2.lineTo(x, y); else ctx2.moveTo(x, y);
      }
    } else {
      ctx2.moveTo(0, h / 2); ctx2.lineTo(w, h / 2);
    }
    ctx2.stroke();
  }
  function scopeLoop() {
    cancelAnimationFrame(scopeRaf);
    drawScope();
    if (playing && !reduced()) {
      const loop = () => { drawScope(); scopeRaf = requestAnimationFrame(loop); };
      scopeRaf = requestAnimationFrame(loop);
    }
  }
  loadTrack(cases[0]);
  requestAnimationFrame(drawScope);

  /* ------------------------------------------------------------------
     Rules: stacking cards, step rail, the sound of each rule
  ------------------------------------------------------------------ */
  (function rules() {
    const section = $('#rules');
    const stack = $('.stack');
    const items = $$('.stack > li');
    const cards = items.map(li => li.querySelector('.card'));
    const srail = $('.srail');
    const heardEl = $('[data-heard]');
    const heard = new Set();

    const names = cards.map(c => c.querySelector('h3').lastChild.textContent.trim());
    const railBtns = items.map((li, i) => {
      const b = doc.createElement('button');
      b.type = 'button';
      b.textContent = String(i + 1).padStart(2, '0');
      b.setAttribute('aria-label', 'Rule ' + (i + 1) + ': ' + names[i]);
      b.addEventListener('click', () => scrollTo({ top: stuckAt(i), behavior: reduced() ? 'auto' : 'smooth' }));
      srail.appendChild(b);
      return b;
    });

    function stackTop() { return stack.getBoundingClientRect().top + scrollY; }
    function stuckAt(i) {
      let y = stackTop();
      for (let k = 0; k < i; k++) y += items[k].offsetHeight;
      return Math.round(y);
    }
    function activeStep() {
      let a = 0;
      for (let i = 0; i < items.length; i++) if (scrollY + 2 >= stuckAt(i)) a = i;
      railBtns.forEach((b, i) => {
        if (i === a) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      });
    }

    const scrubbed = !CSS.supports('animation-timeline: view()');
    if (scrubbed && !reduced()) cards.slice(0, -1).forEach(c => { c.style.animation = 'recede 1s linear both paused'; });

    let ticking = false;
    function onScroll() {
      ticking = false;
      activeStep();
      if (scrubbed && !reduced()) {
        const p = (scrollY - stackTop()) / stack.offsetHeight;
        cards.slice(0, -1).forEach((c, i) => {
          const t = Math.min(1, Math.max(0, p * cards.length - i));
          c.style.animationDelay = -t + 's';
        });
      }
    }
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();

    new IntersectionObserver(([e]) => body.classList.toggle('in-rules', e.isIntersecting), {
      rootMargin: '-30% 0px -30% 0px'
    }).observe(stack);

    $$('.hear').forEach(btn => btn.addEventListener('click', () => {
      if (btn.getAttribute('aria-pressed') === 'true') return;
      const secs = Sound.rule(btn.dataset.sound);
      if (!secs) return;
      const card = btn.closest('.card');
      btn.setAttribute('aria-pressed', 'true');
      btn.querySelector('span').textContent = 'Playing';
      card.setAttribute('data-playing', '');
      heard.add(btn.dataset.sound);
      heardEl.textContent = heard.size + ' of 5';
      setTimeout(() => {
        btn.setAttribute('aria-pressed', 'false');
        btn.querySelector('span').textContent = 'Hear it again';
        card.removeAttribute('data-playing');
      }, secs * 1000);
    }));
    section.dataset.ready = 'true';
  })();

  /* ------------------------------------------------------------------
     The night: one attribute drives the sky
  ------------------------------------------------------------------ */
  (function night() {
    const hudTime = $('#hudTime');
    const hudLabel = $('#hudLabel');
    const links = $$('.ch-rail a');
    const hud = {
      1: ['23:58', 'Shutters down'],
      2: ['00:40', 'Room locked · moon high'],
      3: ['03:10', 'One window lit'],
      4: ['05:20', 'First bell · sun on the hills']
    };
    function set(n) {
      n = String(n);
      if (body.dataset.ch === n) return;
      body.dataset.ch = n;
      hudTime.textContent = hud[n][0];
      hudLabel.textContent = hud[n][1];
      links.forEach(a => a.classList.toggle('on', a.dataset.n === n));
    }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) set(e.target.dataset.n); }), {
      rootMargin: '-45% 0px -45% 0px', threshold: 0
    });
    $$('.ch').forEach(c => io.observe(c));
    links.forEach(a => a.addEventListener('click', () => set(a.dataset.n)));
  })();

  /* ------------------------------------------------------------------
     Send a night: four steps, a review, a reply
  ------------------------------------------------------------------ */
  (function send() {
    const form = $('#brief');
    const steps = $$('.step', form);
    const label = $('#stepLabel');
    const boxes = $$('.boxes i');
    const railRows = $$('.send-rail li');
    const back = $('[data-back]', form);
    const next = $('[data-next]', form);
    const nextLabel = next.querySelector('span');
    const sent = $('.sent');
    const name = $('#f-name'), email = $('#f-email'), msg = $('#f-msg'), link = $('#f-link');
    const count = $('#c-msg');
    let cur = 1;

    function show(n, focus = true) {
      cur = n;
      steps.forEach(s => { s.hidden = Number(s.dataset.step) !== n; });
      label.textContent = n <= 4 ? 'Step ' + n + ' of 4' : 'Review';
      boxes.forEach((b, i) => {
        b.classList.toggle('cur', i + 1 === n);
        b.classList.toggle('done', i + 1 < n);
      });
      railRows.forEach((r, i) => {
        r.classList.toggle('done', i + 1 < n);
        if (i + 1 === n) r.setAttribute('aria-current', 'step'); else r.removeAttribute('aria-current');
      });
      back.hidden = n === 1;
      nextLabel.textContent = n === 4 ? 'Review' : n === 5 ? 'Send the night' : 'Next';
      if (n === 5) fillReview();
      if (focus) { const h = steps[n - 1].querySelector('h3'); if (h) h.focus({ preventScroll: true }); }
    }

    function groupCheck(nameAttr, errId, text) {
      const inputs = $$('input[name="' + nameAttr + '"]', form);
      const err = doc.getElementById(errId);
      if (inputs.some(i => i.checked)) { err.textContent = ''; return null; }
      err.textContent = text;
      return inputs[0];
    }
    function fieldCheck(el, errId, ok, text) {
      const err = doc.getElementById(errId);
      if (ok(el.value.trim())) { err.textContent = ''; el.removeAttribute('aria-invalid'); return null; }
      err.textContent = text; el.setAttribute('aria-invalid', 'true');
      return el;
    }
    function validate(n) {
      if (n === 1) return groupCheck('kind', 'e-kind', 'Pick at least one, or choose Not sure yet.');
      if (n === 2) return groupCheck('hour', 'e-hour', 'Choose the hour the take began.');
      if (n === 3) return groupCheck('room', 'e-room', 'Choose where the room was.');
      if (n === 4) return [
        fieldCheck(name, 'e-name', v => v.length > 1, 'Enter your name.'),
        fieldCheck(email, 'e-email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter an email like you@example.com.'),
        fieldCheck(msg, 'e-msg', v => v.length >= 20, 'Write at least 20 characters so we know which night it was.')
      ].filter(Boolean)[0] || null;
      return null;
    }
    function fillReview() {
      const val = n => $$('input[name="' + n + '"]:checked', form).map(i => i.value).join(', ');
      $('[data-r="kind"]').textContent = val('kind');
      $('[data-r="hour"]').textContent = val('hour');
      $('[data-r="room"]').textContent = val('room');
      $('[data-r="you"]').textContent = name.value.trim() + ', ' + email.value.trim() + (link.value.trim() ? ', ' + link.value.trim() : '');
    }

    $$('input[type="checkbox"], input[type="radio"]', form).forEach(i => i.addEventListener('change', () => {
      const err = i.closest('fieldset').querySelector('.err');
      if (err) err.textContent = '';
    }));
    [name, email, msg].forEach(el => el.addEventListener('input', () => {
      if (el.getAttribute('aria-invalid') === 'true') {
        el.removeAttribute('aria-invalid');
        doc.getElementById(el.getAttribute('aria-describedby').split(' ').pop()).textContent = '';
      }
    }));
    msg.addEventListener('input', () => { count.textContent = msg.value.length + ' / 800 · at least 20 characters'; });

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (cur < 5) {
        const bad = validate(cur);
        if (bad) { bad.focus(); return; }
        show(cur + 1);
        return;
      }
      next.setAttribute('aria-busy', 'true');
      nextLabel.textContent = 'Sending';
      setTimeout(() => {
        next.removeAttribute('aria-busy');
        const t = npt();
        $('[data-ref]').textContent = 'AR-' + fmtDay.format(new Date()).replace('/', '') + '-' + t.text.replace(':', '');
        $('[data-mail]').textContent = email.value.trim();
        form.hidden = true;
        sent.hidden = false;
        label.textContent = 'Sent';
        boxes.forEach(b => { b.classList.remove('cur'); b.classList.add('done'); });
        sent.querySelector('h3').focus();
      }, 700);
    });
    back.addEventListener('click', () => show(cur - 1));
    $$('[data-edit]', form).forEach(b => b.addEventListener('click', () => show(Number(b.dataset.edit))));
    $('[data-reset]').addEventListener('click', () => {
      form.reset();
      count.textContent = '0 / 800 · at least 20 characters';
      $$('.err', form).forEach(e => { e.textContent = ''; });
      $$('[aria-invalid]', form).forEach(e => e.removeAttribute('aria-invalid'));
      sent.hidden = true;
      form.hidden = false;
      show(1);
    });
    show(1, false);
  })();

  /* ------------------------------------------------------------------
     Footer: the valley plain, a porter and two dogs
  ------------------------------------------------------------------ */
  (function footer() {
    const NS = 'http://www.w3.org/2000/svg';
    let seed = 2026;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const el = (tag, attrs) => { const n = doc.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); return n; };

    const stars = $('#fstars');
    for (let i = 0; i < 46; i++) {
      const c = el('circle', { cx: (rnd() * 1600).toFixed(1), cy: (rnd() * 150).toFixed(1), r: (0.7 + rnd()).toFixed(2), class: 'fstar twinkle' });
      c.style.animationDuration = (3 + rnd() * 3).toFixed(2) + 's';
      c.style.animationDelay = (-rnd() * 6).toFixed(2) + 's';
      stars.appendChild(c);
    }
    const tufts = $('#tufts');
    for (let i = 0; i < 52; i++) {
      const y = 322 + rnd() * 56;
      const k = 0.7 + (y - 322) / 40;
      const g = el('g', { transform: 'translate(' + (rnd() * 1600).toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + k.toFixed(2) + ')' });
      const u = el('use', { href: '#grass', class: 'sway' + (i % 2 ? ' s2' : '') });
      g.appendChild(u);
      tufts.appendChild(g);
    }
    const flags = $('#flags');
    const P0 = [0, -66], P1 = [80, -48], P2 = [160, -60];
    for (let k = 0; k < 7; k++) {
      const t = (k + 1) / 8;
      const x = (1 - t) * (1 - t) * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0];
      const y = (1 - t) * (1 - t) * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1];
      const g = el('g', { transform: 'translate(' + (x - 5).toFixed(1) + ' ' + y.toFixed(1) + ')' });
      const r = el('rect', { width: 10, height: 12, class: 'flag' + (k % 2 ? ' lit' : '') });
      r.style.animationDelay = (-0.2 * k).toFixed(1) + 's';
      g.appendChild(r);
      flags.appendChild(g);
    }

    const art = $('.foot-art');
    const far = $('#far'), mid = $('#mid');
    let ticking = false;
    const par = () => {
      ticking = false;
      if (reduced()) return;
      const r = art.getBoundingClientRect(), vh = innerHeight || 1;
      if (r.top > vh || r.bottom < 0) return;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      far.style.transform = 'translateY(' + ((1 - p) * 40).toFixed(1) + 'px)';
      mid.style.transform = 'translateY(' + ((1 - p) * 18).toFixed(1) + 'px)';
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(par); } }, { passive: true });
    par();

    const form = $('#letter');
    const input = $('#l-email');
    const status = $('#l-status');
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        status.className = 'f-status ok';
        status.textContent = 'Added. The next letter leaves after midnight.';
        input.value = '';
      } else {
        status.className = 'f-status bad';
        status.textContent = 'That address looks short a letter or two.';
        input.focus();
      }
    });
  })();
})();
