/* KEY-01 launch page · the keyboard you type on · Designed using Design Lounge (https://www.designlounge.live) */
(() => {
  'use strict';

  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s) => document.querySelector(s);

  /* ---------- The board: 65 percent layout, 16 units wide, rows add to 64 quarter-units ---------- */
  // [code, legend, width in units, class, shifted legend]
  const ROWS = [
    [['Escape', 'Esc', 1, 'm'], ['Digit1', '1', 1, '', '!'], ['Digit2', '2', 1, '', '@'], ['Digit3', '3', 1, '', '#'], ['Digit4', '4', 1, '', '$'], ['Digit5', '5', 1, '', '%'], ['Digit6', '6', 1, '', '^'], ['Digit7', '7', 1, '', '&'], ['Digit8', '8', 1, '', '*'], ['Digit9', '9', 1, '', '('], ['Digit0', '0', 1, '', ')'], ['Minus', '-', 1, '', '_'], ['Equal', '=', 1, '', '+'], ['Backspace', 'Backspace', 2, 'm'], ['Delete', 'Del', 1, 'm']],
    [['Tab', 'Tab', 1.5, 'm'], ['KeyQ', 'Q', 1], ['KeyW', 'W', 1], ['KeyE', 'E', 1], ['KeyR', 'R', 1], ['KeyT', 'T', 1], ['KeyY', 'Y', 1], ['KeyU', 'U', 1], ['KeyI', 'I', 1], ['KeyO', 'O', 1], ['KeyP', 'P', 1], ['BracketLeft', '[', 1, '', '{'], ['BracketRight', ']', 1, '', '}'], ['Backslash', '\\', 1.5, '', '|'], ['PageUp', 'PgUp', 1, 'm']],
    [['CapsLock', 'Caps', 1.75, 'm'], ['KeyA', 'A', 1], ['KeyS', 'S', 1], ['KeyD', 'D', 1], ['KeyF', 'F', 1, 'home'], ['KeyG', 'G', 1], ['KeyH', 'H', 1], ['KeyJ', 'J', 1, 'home'], ['KeyK', 'K', 1], ['KeyL', 'L', 1], ['Semicolon', ';', 1, '', ':'], ['Quote', "'", 1, '', '"'], ['Enter', 'Enter', 2.25, 'a'], ['PageDown', 'PgDn', 1, 'm']],
    [['ShiftLeft', 'Shift', 2.25, 'm'], ['KeyZ', 'Z', 1], ['KeyX', 'X', 1], ['KeyC', 'C', 1], ['KeyV', 'V', 1], ['KeyB', 'B', 1], ['KeyN', 'N', 1], ['KeyM', 'M', 1], ['Comma', ',', 1, '', '<'], ['Period', '.', 1, '', '>'], ['Slash', '/', 1, '', '?'], ['ShiftRight', 'Shift', 1.75, 'm'], ['ArrowUp', '↑', 1, 'm'], ['End', 'End', 1, 'm']],
    [['ControlLeft', 'Ctrl', 1.25, 'm'], ['MetaLeft', 'Meta', 1.25, 'm'], ['AltLeft', 'Alt', 1.25, 'm'], ['Space', '', 6.25, ''], ['AltRight', 'Alt', 1.25, 'm'], ['Fn', 'Fn', 1.25, 'm'], null, ['ArrowLeft', '←', 1, 'm'], ['ArrowDown', '↓', 1, 'm'], ['ArrowRight', '→', 1, 'm']]
  ];
  const NAMES = { Space: 'Space', Backspace: 'Backspace', Delete: 'Delete', PageUp: 'Page up', PageDown: 'Page down', ArrowUp: 'Up', ArrowDown: 'Down', ArrowLeft: 'Left', ArrowRight: 'Right', ShiftLeft: 'Left shift', ShiftRight: 'Right shift', ControlLeft: 'Control', MetaLeft: 'Meta', AltLeft: 'Left alt', AltRight: 'Right alt', CapsLock: 'Caps lock', Escape: 'Escape', Enter: 'Enter', Tab: 'Tab', End: 'End', Fn: 'Fn', Backslash: 'Backslash' };
  const ALIAS = { OSLeft: 'MetaLeft', OSRight: 'MetaLeft', MetaRight: 'MetaLeft', ControlRight: 'ControlLeft' };

  const keysEl = $('#keys');
  const board = $('#board');
  const keyByCode = new Map();
  const keyMeta = new Map();   // code -> { name, u }
  const mapRects = new Map();  // code -> svg rect
  const order = [];

  (function build() {
    const frag = document.createDocumentFragment();
    const map = $('#map');
    const U = 20, MU = 1.2;    // map geometry: 16u * 20 = 320 wide
    ROWS.forEach((row, r) => {
      let x = 0;
      row.forEach((k) => {
        if (!k) { const g = document.createElement('span'); g.className = 'gap'; g.setAttribute('aria-hidden', 'true'); frag.appendChild(g); x += 0.5; return; }
        const [code, legend, u, cls = '', shift] = k;
        const name = NAMES[code] || legend;
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'key ' + cls;
        b.tabIndex = -1;
        b.dataset.code = code;
        b.style.setProperty('--u', String(Math.round(u * 4)));
        b.setAttribute('aria-label', name);
        const cap = document.createElement('span'); cap.className = 'cap';
        const top = document.createElement('span'); top.className = 'top';
        if (shift) { const s = document.createElement('span'); s.className = 'lg2'; s.textContent = shift; top.appendChild(s); }
        const lg = document.createElement('span'); lg.className = 'lg'; lg.textContent = legend; top.appendChild(lg);
        cap.appendChild(top); b.appendChild(cap); frag.appendChild(b);
        keyByCode.set(code, b);
        keyMeta.set(code, { name, u, cls });
        order.push(code);
        // the map
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', (x * U + MU).toFixed(1));
        rect.setAttribute('y', (r * U + MU + 2).toFixed(1));
        rect.setAttribute('width', (u * U - MU * 2).toFixed(1));
        rect.setAttribute('height', (U - MU * 2).toFixed(1));
        rect.setAttribute('rx', '2');
        map.appendChild(rect);
        mapRects.set(code, rect);
        x += u;
      });
    });
    keysEl.appendChild(frag);
  })();

  /* ---------- Sound: no AudioContext before a gesture ---------- */
  let ac = null, bus = null, noise = null, soundOn = true;
  function ensureAudio() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      ac = new AC();
      noise = makeNoise(ac);
      bus = buildChain(ac);
    } catch (e) { ac = null; }
  }
  function makeNoise(ctx) {
    const b = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  function buildChain(ctx) {
    const g = ctx.createGain(); g.gain.value = .9;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 11000;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = .002; comp.release.value = .08;
    g.connect(lp).connect(comp).connect(ctx.destination);
    return g;
  }
  function tick(ctx, out, nz, t, type, f, q, g, dec, atk) {
    const s = ctx.createBufferSource(); s.buffer = nz;
    const bq = ctx.createBiquadFilter(); bq.type = type; bq.frequency.value = f; bq.Q.value = q;
    const e = ctx.createGain();
    e.gain.setValueAtTime(.0001, t);
    e.gain.exponentialRampToValueAtTime(g, t + (atk || .0015));
    e.gain.exponentialRampToValueAtTime(.0001, t + dec);
    s.connect(bq).connect(e).connect(out);
    s.start(t); s.stop(t + dec + .03);
  }
  function thump(ctx, out, t, f0, f1, pd, g, dec) {
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + pd);
    const e = ctx.createGain();
    e.gain.setValueAtTime(.0001, t);
    e.gain.exponentialRampToValueAtTime(g, t + .002);
    e.gain.exponentialRampToValueAtTime(.0001, t + dec);
    o.connect(e).connect(out); o.start(t); o.stop(t + dec + .03);
  }
  // Each profile: the press, then the release. s = { v: level, p: pitch, big: large key }
  const PROFILES = {
    linear: {
      press(ctx, out, nz, t, s) {
        tick(ctx, out, nz, t, 'bandpass', 1500 * s.p, 1.0, .38 * s.v, .045);
        thump(ctx, out, t, 180 * s.p, 72, .02, .32 * s.v * (s.big ? 1.25 : 1), .07);
        if (s.big) tick(ctx, out, nz, t + .007, 'bandpass', 2300 * s.p, 1.4, .14 * s.v, .03);
      },
      release(ctx, out, nz, t, s) { tick(ctx, out, nz, t, 'bandpass', 2300 * s.p, 1.2, .1 * s.v, .028); }
    },
    tactile: {
      press(ctx, out, nz, t, s) {
        tick(ctx, out, nz, t, 'bandpass', 3000 * s.p, 2.0, .22 * s.v, .014);
        tick(ctx, out, nz, t + .016, 'bandpass', 1300 * s.p, .9, .5 * s.v, .055);
        thump(ctx, out, t + .016, 170 * s.p, 66, .02, .36 * s.v * (s.big ? 1.25 : 1), .08);
        if (s.big) tick(ctx, out, nz, t + .022, 'bandpass', 2300 * s.p, 1.4, .14 * s.v, .03);
      },
      release(ctx, out, nz, t, s) { tick(ctx, out, nz, t, 'bandpass', 2600 * s.p, 1.5, .14 * s.v, .03); }
    },
    clicky: {
      press(ctx, out, nz, t, s) {
        tick(ctx, out, nz, t, 'highpass', 5200 * s.p, 1.0, .6 * s.v, .009);
        tick(ctx, out, nz, t + .012, 'bandpass', 1900 * s.p, 1.1, .42 * s.v, .04);
        thump(ctx, out, t + .012, 200 * s.p, 86, .018, .28 * s.v * (s.big ? 1.25 : 1), .06);
        if (s.big) tick(ctx, out, nz, t + .018, 'bandpass', 2600 * s.p, 1.4, .14 * s.v, .03);
      },
      release(ctx, out, nz, t, s) { tick(ctx, out, nz, t, 'highpass', 5400 * s.p, 1.0, .32 * s.v, .008); }
    }
  };
  let profile = 'linear';
  function voiceParams(code) {
    const m = keyMeta.get(code) || { u: 1 };
    const big = m.u >= 2;
    return { v: (1 + (Math.random() - .5) * .12), p: (big ? .86 : 1) * (1 + (Math.random() - .5) * .06), big };
  }
  function playPress(code) {
    if (!soundOn || !ac) return;
    PROFILES[profile].press(ac, bus, noise, ac.currentTime, voiceParams(code));
  }
  function playRelease(code) {
    if (!soundOn || !ac) return;
    PROFILES[profile].release(ac, bus, noise, ac.currentTime, voiceParams(code));
  }

  /* ---------- Headline: what you type ---------- */
  const typed = $('#typed');
  const bufEl = typed.querySelector('.buf');
  const echo = $('#echo');
  const PROMPT = 'Go on, type.';
  const MAX = 48;
  let buf = '';
  let fitRaf = 0;
  function renderHeadline() {
    const empty = buf.length === 0;
    typed.classList.toggle('empty', empty);
    bufEl.textContent = empty ? PROMPT : buf;
    echo.textContent = empty ? 'Nothing yet.' : buf;
    echo.classList.toggle('none', empty);
    cancelAnimationFrame(fitRaf);
    fitRaf = requestAnimationFrame(fit);
  }
  const slot = $('#slot');
  function fit() {
    const H = slot.clientHeight;
    const max = H / 1.06;
    let s = max;
    typed.style.fontSize = s + 'px';
    let guard = 40;
    while (typed.offsetHeight > H + 1 && s > 22 && guard--) {
      s = Math.round(s * .9 * 10) / 10;
      typed.style.fontSize = s + 'px';
    }
  }
  function typeChar(ch) {
    buf += ch;
    if (buf.length > MAX) buf = buf.slice(buf.length - MAX);
    renderHeadline();
  }
  function typeKey(e, code) {
    if (code === 'Backspace') { buf = buf.slice(0, -1); renderHeadline(); return; }
    if (code === 'Delete') { return; }
    if (code === 'Enter') { typeChar('\n'); return; }
    if (code === 'Escape') { buf = ''; renderHeadline(); return; }
    if (code === 'Space') { typeChar(' '); return; }
    if (e && typeof e.key === 'string' && e.key.length === 1) { typeChar(e.key); return; }
    if (!e) { // a tap on the drawn key
      const m = keyMeta.get(code);
      if (m && m.cls !== 'm' && m.name.length === 1) typeChar(shiftDown ? m.name : m.name.toLowerCase());
    }
  }

  /* ---------- Press and release ---------- */
  const down = new Set();
  const counts = new Map();
  let presses = 0, touched = false, shiftDown = false;
  const lastEl = $('#lastkey'), countEl = $('#count'), usedEl = $('#used'), mostEl = $('#most'), sw = $('#sw');
  function press(code, opts) {
    const el = keyByCode.get(code);
    if (!el) return false;
    if (down.has(code)) return true;
    down.add(code);
    el.classList.add('down');
    sw.classList.add('down');
    if (code === 'ShiftLeft' || code === 'ShiftRight') shiftDown = true;
    stopIdle();
    if (!opts || !opts.silent) { ensureAudio(); playPress(code); }
    if (!opts || !opts.quiet) {
      presses++;
      counts.set(code, (counts.get(code) || 0) + 1);
      const m = keyMeta.get(code);
      lastEl.textContent = m.name;
      countEl.textContent = String(presses);
      usedEl.textContent = counts.size + ' of ' + order.length;
      let best = null, bn = 0;
      counts.forEach((n, c) => { if (n > bn) { bn = n; best = c; } });
      mostEl.textContent = best ? keyMeta.get(best).name : 'None';
      const r = mapRects.get(code); if (r) r.classList.add('hit');
    }
    return true;
  }
  function release(code, opts) {
    const el = keyByCode.get(code);
    if (!el || !down.has(code)) return;
    down.delete(code);
    el.classList.remove('down');
    if (down.size === 0) sw.classList.remove('down');
    if (code === 'ShiftLeft' || code === 'ShiftRight') shiftDown = false;
    if (!opts || !opts.silent) playRelease(code);
  }
  function releaseAll() { Array.from(down).forEach((c) => release(c, { silent: true })); }

  /* ---------- Physical keys, by code ---------- */
  let heroVisible = true;
  const hero = $('#play');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es) => es.forEach((e) => { heroVisible = e.isIntersecting; }), { threshold: .12 }).observe(hero);
  }
  const capsLed = $('#led-caps');
  function inField(t) { return !!(t && t.closest && t.closest('input, textarea, select, [contenteditable="true"]')); }
  addEventListener('keydown', (e) => {
    if (typeof e.getModifierState === 'function') capsLed.classList.toggle('on', e.getModifierState('CapsLock'));
    if (inField(e.target)) return;
    const code = ALIAS[e.code] || e.code;
    if (!keyByCode.has(code)) return;
    const mod = e.metaKey || e.ctrlKey || e.altKey;
    const onControl = e.target && e.target.closest && e.target.closest('button, [role="radio"], a');
    if (e.repeat) { if (!mod && code !== 'Tab' && heroVisible && !onControl) e.preventDefault(); return; }
    if (mod || code === 'Tab') { press(code, { quiet: !heroVisible }); return; }   // browser shortcuts and focus keep their meaning
    if (!heroVisible) return;                                                       // scrolled away: keys are the browser's again
    if (onControl && (code === 'Space' || code === 'Enter')) return;                // a focused control keeps Space and Enter
    e.preventDefault();
    press(code);
    typeKey(e, code);
  });
  addEventListener('keyup', (e) => {
    if (typeof e.getModifierState === 'function') capsLed.classList.toggle('on', e.getModifierState('CapsLock'));
    const code = ALIAS[e.code] || e.code;
    release(code);
    if (code === 'MetaLeft' || code === 'ControlLeft') releaseAll(); // Cmd+Tab and friends swallow keyups
  });
  addEventListener('blur', releaseAll);
  document.addEventListener('visibilitychange', () => { if (document.hidden) releaseAll(); });

  /* ---------- Pointer and touch: slide to play, several fingers ---------- */
  const pointers = new Map();
  keysEl.addEventListener('pointerdown', (e) => {
    const k = e.target.closest('.key');
    if (!k) return;
    e.preventDefault();
    try { keysEl.setPointerCapture(e.pointerId); } catch (err) { /* capture is optional */ }
    pointers.set(e.pointerId, k.dataset.code);
    press(k.dataset.code);
    typeKey(null, k.dataset.code);
  });
  keysEl.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const k = el && el.closest ? el.closest('.key') : null;
    const cur = pointers.get(e.pointerId);
    if (k && k.dataset.code !== cur) {
      release(cur);
      pointers.set(e.pointerId, k.dataset.code);
      press(k.dataset.code);
      typeKey(null, k.dataset.code);
    }
  });
  function pointerEnd(e) {
    if (!pointers.has(e.pointerId)) return;
    release(pointers.get(e.pointerId));
    pointers.delete(e.pointerId);
  }
  keysEl.addEventListener('pointerup', pointerEnd);
  keysEl.addEventListener('pointercancel', pointerEnd);
  keysEl.addEventListener('lostpointercapture', pointerEnd);
  keysEl.addEventListener('click', (e) => {   // keyboard activation of a focused key (screen readers)
    const k = e.target.closest('.key');
    if (!k || e.detail !== 0) return;
    press(k.dataset.code); typeKey(null, k.dataset.code);
    setTimeout(() => release(k.dataset.code), 80);
  });
  keysEl.addEventListener('contextmenu', (e) => { if (e.target.closest('.key')) e.preventDefault(); });

  /* ---------- Idle invitation: the board types its own name, silently, until you touch it ---------- */
  const IDLE = ['KeyK', 'KeyE', 'KeyY', 'Minus', 'Digit0', 'Digit1'];
  let idleTimer = 0, idleI = 0;
  function idleStep() {
    const code = IDLE[idleI++ % IDLE.length];
    const el = keyByCode.get(code);
    el.classList.add('down');
    setTimeout(() => { if (!down.has(code)) el.classList.remove('down'); }, 140);
    idleTimer = setTimeout(idleStep, idleI % IDLE.length === 0 ? 1400 : 420);
  }
  function stopIdle() { if (!touched) { touched = true; clearTimeout(idleTimer); } }
  if (!REDUCE) idleTimer = setTimeout(idleStep, 900);

  /* ---------- Switch profile ---------- */
  const radios = Array.from(document.querySelectorAll('.seg [role="radio"]'));
  const waveH = $('#wave-h');
  function setProfile(p, withFill) {
    profile = p;
    board.dataset.switch = p;
    radios.forEach((r) => { const on = r.dataset.switch === p; r.setAttribute('aria-checked', on ? 'true' : 'false'); r.tabIndex = on ? 0 : -1; });
    waveH.textContent = 'The sound, drawn: ' + p.charAt(0).toUpperCase() + p.slice(1);
    drawWave();
    if (withFill) {
      stopIdle(); ensureAudio();
      ['KeyK', 'KeyE', 'KeyY'].forEach((c, i) => {
        setTimeout(() => { press(c, { quiet: true }); setTimeout(() => release(c), 90); }, i * 130);
      });
    }
  }
  radios.forEach((r) => {
    r.addEventListener('click', () => setProfile(r.dataset.switch, true));
    r.addEventListener('keydown', (e) => {
      const i = radios.indexOf(r);
      let j = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % radios.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + radios.length) % radios.length;
      if (j < 0) return;
      e.preventDefault(); e.stopPropagation();
      setProfile(radios[j].dataset.switch, true);
      radios[j].focus();
    });
  });

  /* ---------- Sound toggle ---------- */
  const snd = $('#snd');
  snd.addEventListener('click', () => {
    soundOn = !soundOn;
    snd.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    snd.querySelector('.snd-label').textContent = soundOn ? 'Sound on' : 'Sound off';
    if (soundOn) ensureAudio();
  });

  /* ---------- The sound, drawn: render one keystroke offline and plot it ---------- */
  const wavePath = $('#wave-path');
  function drawWave() {
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OAC) { wavePath.setAttribute('d', ''); return; }
    const p = profile;
    try {
      const sr = 22050, len = Math.round(sr * .12);
      const ctx = new OAC(1, len, sr);
      const nz = makeNoise(ctx);
      const g = ctx.createGain(); g.gain.value = 1; g.connect(ctx.destination);
      PROFILES[p].press(ctx, g, nz, .004, { v: 1, p: 1, big: false });
      PROFILES[p].release(ctx, g, nz, .07, { v: 1, p: 1, big: false });
      ctx.startRendering().then((buffer) => {
        if (profile !== p) return;
        const d = buffer.getChannelData(0);
        const W = 600, Hh = 70, N = 300;
        const step = Math.floor(d.length / N);
        let peak = 0;
        for (let i = 0; i < d.length; i++) peak = Math.max(peak, Math.abs(d[i]));
        const k = peak > 0 ? 60 / peak : 1;
        let path = '';
        for (let i = 0; i < N; i++) {
          let mx = 0, mn = 0;
          for (let j = i * step; j < (i + 1) * step; j++) { mx = Math.max(mx, d[j]); mn = Math.min(mn, d[j]); }
          const x = (i / (N - 1)) * W;
          path += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + (Hh - mx * k).toFixed(1) + 'L' + x.toFixed(1) + ' ' + (Hh - mn * k).toFixed(1);
        }
        wavePath.setAttribute('d', path);
      }).catch(() => { wavePath.setAttribute('d', ''); });
    } catch (err) { wavePath.setAttribute('d', ''); }
  }

  /* ---------- The launch-date form ---------- */
  const form = $('#form'), email = $('#email'), row = $('#row'), msg = $('#msg'), msgText = $('#msg-text'), go = $('#go');
  const DEFAULT_MSG = 'One message, on launch day.';
  function setMsg(state, text) {
    row.classList.remove('bad', 'done'); msg.classList.remove('bad', 'done');
    if (state) { row.classList.add(state); msg.classList.add(state); }
    msgText.textContent = text;
    email.setAttribute('aria-invalid', state === 'bad' ? 'true' : 'false');
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = email.value.trim();
    if (!v) { setMsg('bad', 'Type an email address first.'); email.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { setMsg('bad', 'That address needs an @ and a domain.'); email.focus(); return; }
    setMsg('done', 'Noted. The launch date goes to ' + v + ', once.');
    email.disabled = true; go.disabled = true;
    go.querySelector('.go-label').textContent = 'Noted';
  });
  email.addEventListener('input', () => { if (row.classList.contains('bad')) setMsg(null, DEFAULT_MSG); });

  /* ---------- Entry fade ---------- */
  const rises = Array.from(document.querySelectorAll('.rise'));
  if (REDUCE || !('IntersectionObserver' in window)) rises.forEach((r) => r.classList.add('in'));
  else {
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    rises.forEach((r) => io.observe(r));
  }

  /* ---------- Start ---------- */
  renderHeadline();
  drawWave();
  addEventListener('resize', () => { cancelAnimationFrame(fitRaf); fitRaf = requestAnimationFrame(fit); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  // On a phone the board is wider than the screen: start on the letters, not on Esc.
  const tray = $('#tray');
  if (tray.scrollWidth > tray.clientWidth) tray.scrollLeft = (tray.scrollWidth - tray.clientWidth) * .42;
})();
