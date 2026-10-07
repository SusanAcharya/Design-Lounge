/* KEY-01 launch page · the board, the typed headline, the click · Designed using Design Lounge (https://www.designlounge.live) */
(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s) => document.querySelector(s);

  /* ---------- The board ---------- */
  // [code, legend, width in quarter units, variant, shifted legend]
  const ROWS = [
    [
      ['Escape', 'Esc', 4, 'acc'],
      ['Digit1', '1', 4, '', '!'], ['Digit2', '2', 4, '', '@'], ['Digit3', '3', 4, '', '#'], ['Digit4', '4', 4, '', '$'], ['Digit5', '5', 4, '', '%'],
      ['Digit6', '6', 4, '', '^'], ['Digit7', '7', 4, '', '&'], ['Digit8', '8', 4, '', '*'], ['Digit9', '9', 4, '', '('], ['Digit0', '0', 4, '', ')'],
      ['Minus', '-', 4, '', '_'], ['Equal', '=', 4, '', '+'], ['Backspace', 'Backspace', 8, 'mod'],
    ],
    [
      ['Tab', 'Tab', 6, 'mod'],
      ['KeyQ', 'Q', 4], ['KeyW', 'W', 4], ['KeyE', 'E', 4], ['KeyR', 'R', 4], ['KeyT', 'T', 4], ['KeyY', 'Y', 4], ['KeyU', 'U', 4], ['KeyI', 'I', 4], ['KeyO', 'O', 4], ['KeyP', 'P', 4],
      ['BracketLeft', '[', 4, '', '{'], ['BracketRight', ']', 4, '', '}'], ['Backslash', '\\', 6, '', '|'],
    ],
    [
      ['CapsLock', 'Caps', 7, 'mod'],
      ['KeyA', 'A', 4], ['KeyS', 'S', 4], ['KeyD', 'D', 4], ['KeyF', 'F', 4], ['KeyG', 'G', 4], ['KeyH', 'H', 4], ['KeyJ', 'J', 4], ['KeyK', 'K', 4], ['KeyL', 'L', 4],
      ['Semicolon', ';', 4, '', ':'], ['Quote', "'", 4, '', '"'], ['Enter', 'Enter', 9, 'acc'],
    ],
    [
      ['ShiftLeft', 'Shift', 9, 'mod'],
      ['KeyZ', 'Z', 4], ['KeyX', 'X', 4], ['KeyC', 'C', 4], ['KeyV', 'V', 4], ['KeyB', 'B', 4], ['KeyN', 'N', 4], ['KeyM', 'M', 4],
      ['Comma', ',', 4, '', '<'], ['Period', '.', 4, '', '>'], ['Slash', '/', 4, '', '?'], ['ShiftRight', 'Shift', 11, 'mod'],
    ],
    [
      ['ControlLeft', 'Ctrl', 5, 'mod'], ['MetaLeft', 'Meta', 5, 'mod'], ['AltLeft', 'Alt', 5, 'mod'],
      ['Space', '', 25, ''],
      ['AltRight', 'Alt', 5, 'mod'], ['Fn', 'Fn', 5, 'mod'], ['ContextMenu', 'Menu', 5, 'mod'], ['ControlRight', 'Ctrl', 5, 'mod'],
    ],
  ];

  const NAMES = {
    Escape: 'Esc', Backspace: 'Backspace', Tab: 'Tab', CapsLock: 'Caps', Enter: 'Enter', ShiftLeft: 'Shift', ShiftRight: 'Shift',
    ControlLeft: 'Ctrl', ControlRight: 'Ctrl', MetaLeft: 'Meta', AltLeft: 'Alt', AltRight: 'Alt', Space: 'Space', Fn: 'Fn', ContextMenu: 'Menu',
  };

  const board = $('#board');
  const keyByCode = new Map();
  const codeByChar = new Map();   // char -> { code, shift }

  for (const row of ROWS) {
    for (const [code, legend, w, variant, shifted] of row) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'key' + (variant ? ' v-' + variant : '');
      b.dataset.code = code;
      b.tabIndex = -1;
      b.style.setProperty('--w', w);
      const name = NAMES[code] || legend;
      b.setAttribute('aria-label', name === 'Space' ? 'Space' : name);
      const wide = legend.length > 1;
      b.innerHTML =
        '<span class="cap"><span class="top"><span class="lg' + (wide ? ' wide' : '') + '">' +
        (shifted ? '<span class="sh">' + esc(shifted) + '</span>' : '') + esc(legend) +
        '</span></span></span>';
      board.appendChild(b);
      keyByCode.set(code, b);
      if (legend.length === 1) {
        if (/[A-Z]/.test(legend)) {
          codeByChar.set(legend.toLowerCase(), { code, shift: false });
          codeByChar.set(legend, { code, shift: true });
        } else {
          codeByChar.set(legend, { code, shift: false });
          if (shifted) codeByChar.set(shifted, { code, shift: true });
        }
      }
    }
  }
  codeByChar.set(' ', { code: 'Space', shift: false });

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------- The typed headline ---------- */
  const FIRST_LINE = 'Type on it.';
  const MAX = 42;
  const h1 = $('#line');
  const buf = $('#buf');
  const rKey = $('#r-key');
  const rCount = $('#r-count');
  const rWpm = $('#r-wpm');
  let text = FIRST_LINE;
  let typedFresh = true;        // the first keystroke replaces the first line
  let count = 0;
  const stamps = [];

  function render() {
    buf.textContent = text;
    fit();
  }

  const linebox = h1.querySelector('.linebox');
  function lines() {
    const fs = parseFloat(h1.style.fontSize) || 1;
    return Math.max(1, Math.round(linebox.getBoundingClientRect().height / (fs * 0.9)));
  }

  function fit() {
    const max = parseFloat(getComputedStyle(h1).getPropertyValue('--fs-max')) || 128;
    const maxPx = max > 0 && max < 30 ? (max / 100) * window.innerWidth : max;  // vw values in the media queries
    let fs = maxPx;
    h1.style.fontSize = fs + 'px';
    // One line at the biggest size that holds it, down to half.
    while (lines() > 1 && fs > maxPx / 2) {
      fs = Math.max(maxPx / 2, fs - Math.max(2, fs * 0.05));
      h1.style.fontSize = fs + 'px';
    }
    // Then two lines, shrinking until they hold it.
    if (lines() > 1) {
      fs = maxPx / 2;
      h1.style.fontSize = fs + 'px';
      while (lines() > 2 && fs > 22) {
        fs = Math.max(22, fs - Math.max(1, fs * 0.06));
        h1.style.fontSize = fs + 'px';
      }
    }
  }

  function typeChar(ch) {
    if (typedFresh) { text = ''; typedFresh = false; }
    if (text.length >= MAX) return;
    text += ch;
    stamps.push(performance.now());
    render();
  }
  function backspace() {
    if (typedFresh) { text = ''; typedFresh = false; }
    text = text.slice(0, -1);
    render();
  }
  function clearLine() { text = ''; typedFresh = false; render(); }
  function resetLine() { text = FIRST_LINE; typedFresh = true; render(); }

  function countKey(name) {
    count++;
    rKey.textContent = name;
    rCount.textContent = String(count);
    wpm();
  }
  function wpm() {
    const now = performance.now();
    while (stamps.length && now - stamps[0] > 10000) stamps.shift();
    rWpm.textContent = String(Math.round((stamps.length / 5) * 6));
  }
  setInterval(wpm, 1000);

  /* ---------- Press, release ---------- */
  const held = new Set();
  let caps = false;
  let shiftLatch = false;
  let touched = false;

  function press(code, silent) {
    const k = keyByCode.get(code);
    if (!k) return false;
    firstTouch();
    k.classList.add('down');
    held.add(code);
    if (!silent) click('down', code);
    return true;
  }
  function release(code, silent) {
    const k = keyByCode.get(code);
    if (!k) return;
    k.classList.remove('down');
    held.delete(code);
    if (!silent) click('up', code);
  }
  function releaseAll() { for (const c of Array.from(held)) release(c, true); }
  function tap(code, ms) {
    press(code);
    setTimeout(() => release(code), ms || 90);
  }

  /* ---------- Physical keys ---------- */
  const tapInput = $('#tap');

  function handledTarget(t) {
    // Where a key press should type into the headline.
    if (!t || t === document.body || t === document.documentElement) return 'page';
    if (t === tapInput) return 'tap';
    if (t.closest('.key') || t === board) return 'board';
    if (t.closest('button, a, input, textarea, select, [role=slider]')) return 'control';
    return 'page';
  }

  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const where = handledTarget(e.target);
    const code = e.code;
    const onBoard = keyByCode.has(code);

    // Space and Enter keep their meaning on the page's real controls.
    if (where === 'control' && (code === 'Space' || code === 'Enter')) return;
    if (code === 'Tab') return;

    if (!e.repeat && onBoard) {
      press(code);
      countKey(NAMES[code] || (e.key.length === 1 ? e.key.toUpperCase() : e.key));
    }

    if (code === 'Backspace') { e.preventDefault(); backspace(); return; }
    if (code === 'Enter') { if (!e.repeat) { e.preventDefault(); clearLine(); } return; }
    if (code === 'Escape') { if (!e.repeat) { e.preventDefault(); resetLine(); } return; }
    if (e.key.length === 1 && !e.repeat) {
      e.preventDefault();
      typeChar(e.key);
      return;
    }
    if (onBoard && code === 'Space') e.preventDefault();
  });

  window.addEventListener('keyup', (e) => {
    if (keyByCode.has(e.code)) release(e.code);
    if (e.code === 'CapsLock' && typeof e.getModifierState === 'function') {
      caps = e.getModifierState('CapsLock');
      keyByCode.get('CapsLock').classList.toggle('on', caps);
    }
  });
  window.addEventListener('blur', releaseAll);

  // Phone keyboards: the hidden input gives characters, not codes.
  tapInput.addEventListener('input', (e) => {
    const t = e.inputType || '';
    if (t === 'deleteContentBackward') {
      tap('Backspace');
      countKey('Backspace');
      backspace();
    } else if (e.data) {
      for (const ch of e.data) {
        const m = codeByChar.get(ch);
        if (m) {
          if (m.shift) tap('ShiftLeft');
          tap(m.code);
        }
        countKey(m ? (NAMES[m.code] || ch.toUpperCase()) : ch);
        typeChar(ch);
      }
    }
    tapInput.value = '';
  });

  $('#type-btn').addEventListener('click', () => {
    firstTouch();
    tapInput.focus({ preventScroll: true });
  });

  /* ---------- Pointer on the drawn keys ---------- */
  const pointers = new Map();

  board.addEventListener('pointerdown', (e) => {
    const k = e.target.closest('.key');
    if (!k) return;
    e.preventDefault();
    board.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, k.dataset.code);
    hitKey(k.dataset.code);
  });
  board.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const k = el && el.closest ? el.closest('.key') : null;
    const prev = pointers.get(e.pointerId);
    if (k && k.dataset.code !== prev) {
      release(prev);
      pointers.set(e.pointerId, k.dataset.code);
      hitKey(k.dataset.code);
    }
  });
  function endPointer(e) {
    if (!pointers.has(e.pointerId)) return;
    release(pointers.get(e.pointerId));
    pointers.delete(e.pointerId);
  }
  board.addEventListener('pointerup', endPointer);
  board.addEventListener('pointercancel', endPointer);

  // A screen reader's activation (click with no pointer) gives a short press.
  board.addEventListener('click', (e) => {
    const k = e.target.closest('.key');
    if (!k || e.detail !== 0) return;
    hitKey(k.dataset.code);
    setTimeout(() => release(k.dataset.code), 90);
  });

  function hitKey(code) {
    press(code);
    const name = NAMES[code];
    if (code === 'Backspace') { backspace(); countKey('Backspace'); return; }
    if (code === 'Enter') { clearLine(); countKey('Enter'); return; }
    if (code === 'Escape') { resetLine(); countKey('Esc'); return; }
    if (code === 'CapsLock') {
      caps = !caps; keyByCode.get('CapsLock').classList.toggle('on', caps); countKey('Caps'); return;
    }
    if (code === 'ShiftLeft' || code === 'ShiftRight') {
      shiftLatch = !shiftLatch;
      keyByCode.get('ShiftLeft').classList.toggle('on', shiftLatch);
      keyByCode.get('ShiftRight').classList.toggle('on', shiftLatch);
      countKey('Shift'); return;
    }
    if (code === 'Space') { typeChar(' '); countKey('Space'); return; }
    if (name) { countKey(name); return; }   // Ctrl, Alt, Meta, Fn, Menu, Tab: they press, nothing more
    const k = keyByCode.get(code);
    const lg = k.querySelector('.lg');
    const base = lg.lastChild.textContent;
    const sh = lg.querySelector('.sh');
    let ch;
    const upper = shiftLatch !== caps;
    if (/[A-Z]/.test(base)) ch = upper ? base : base.toLowerCase();
    else ch = shiftLatch && sh ? sh.textContent : base;
    if (shiftLatch) {
      shiftLatch = false;
      keyByCode.get('ShiftLeft').classList.remove('on');
      keyByCode.get('ShiftRight').classList.remove('on');
    }
    typeChar(ch);
    countKey(base);
  }

  /* ---------- Idle invitation: T, Y, P, E dip silently until the first touch ---------- */
  let idleTimer = null;
  if (!reduced) {
    const seq = ['KeyT', 'KeyY', 'KeyP', 'KeyE'];
    let i = 0;
    idleTimer = setInterval(() => {
      if (touched) return;
      const code = seq[i++ % seq.length];
      const k = keyByCode.get(code);
      k.classList.add('down');
      setTimeout(() => { if (!held.has(code)) k.classList.remove('down'); }, 140);
    }, 480);
  }
  function firstTouch() {
    if (touched) return;
    touched = true;
    if (idleTimer) clearInterval(idleTimer);
  }

  /* ---------- Sound: a synthesised switch, off until asked ---------- */
  let ac = null, master = null, analyser = null, noiseBuf = null;
  let soundOn = false;
  const sndButtons = [$('#snd'), $('#snd2')];
  const rClick = $('#r-click');

  function ensureAudio() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    ac = new Ctx();
    master = ac.createGain();
    master.gain.value = 0.9;
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    analyser = ac.createAnalyser();
    analyser.fftSize = 2048;
    master.connect(comp);
    comp.connect(analyser);
    analyser.connect(ac.destination);
    const n = ac.sampleRate;
    noiseBuf = ac.createBuffer(1, n, n);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  }

  function osc(t, type, f0, f1, pd, g, dec) {
    const s = ac.createOscillator(), e = ac.createGain();
    s.type = type;
    s.frequency.setValueAtTime(f0, t);
    s.frequency.exponentialRampToValueAtTime(f1, t + pd);
    e.gain.setValueAtTime(0.0001, t);
    e.gain.exponentialRampToValueAtTime(g, t + 0.002);
    e.gain.exponentialRampToValueAtTime(0.0001, t + dec);
    s.connect(e).connect(master);
    s.start(t); s.stop(t + dec + 0.03);
  }
  function noise(t, type, f, q, g, dec, attack) {
    const s = ac.createBufferSource(), fl = ac.createBiquadFilter(), e = ac.createGain();
    s.buffer = noiseBuf;
    fl.type = type; fl.frequency.value = f; fl.Q.value = q;
    e.gain.setValueAtTime(0.0001, t);
    e.gain.exponentialRampToValueAtTime(g, t + (attack || 0.002));
    e.gain.exponentialRampToValueAtTime(0.0001, t + dec);
    s.connect(fl).connect(e).connect(master);
    s.start(t); s.stop(t + dec + 0.03);
  }

  function click(kind, code, force) {
    if (!force && !soundOn) return;
    if (!ac) return;
    const t = ac.currentTime;
    const vel = 0.94 + Math.random() * 0.12;
    const p = 0.97 + Math.random() * 0.06;
    const big = code === 'Space' || code === 'Enter' || code === 'ShiftLeft' || code === 'ShiftRight' || code === 'Backspace';
    if (kind === 'down') {
      noise(t, 'bandpass', 4600 * p, 2.2, 0.55 * vel, 0.014);                    // the contact tick
      osc(t, 'sine', (big ? 130 : 175) * p, (big ? 68 : 92) * p, 0.028, 0.5 * vel, big ? 0.11 : 0.075); // the body
      noise(t + 0.004, 'lowpass', 900 * p, 0.7, 0.22 * vel, big ? 0.07 : 0.045); // the cap meeting the case
      rClick.textContent = (NAMES[code] || (keyByCode.get(code) ? keyByCode.get(code).getAttribute('aria-label') : 'key')) + ', ' + Math.round((big ? 110 : 75) * p) + ' ms';
      scopeRun();
    } else {
      noise(t, 'highpass', 3800 * p, 0.8, 0.16 * vel, 0.02);                     // the upstroke
      scopeRun();
    }
  }

  function setSound(on) {
    soundOn = on;
    for (const b of sndButtons) {
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.querySelector('.snd-label').textContent = on ? 'Sound on' : 'Sound off';
    }
  }
  for (const b of sndButtons) {
    b.addEventListener('click', () => {
      const on = !soundOn;
      if (on) ensureAudio();
      setSound(on);
      if (on) { tap('KeyK'); }
    });
  }
  $('#one-click').addEventListener('click', () => {
    ensureAudio();
    press('KeyK', true);
    click('down', 'KeyK', true);
    setTimeout(() => { release('KeyK', true); click('up', 'KeyK', true); }, 90);
  });

  /* ---------- The scope ---------- */
  const scope = $('#scope');
  const ctx = scope.getContext('2d');
  let scopeUntil = 0, scopeRaf = 0;
  const data = new Uint8Array(2048);

  function sizeScope() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = scope.clientWidth || 1120;
    const h = Math.round(w * 260 / 1120);
    scope.width = Math.round(w * dpr);
    scope.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawScope(true);
  }
  function drawScope(idle) {
    const w = scope.width / (ctx.getTransform().a || 1);
    const h = scope.height / (ctx.getTransform().d || 1);
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,253,248,.28)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= w; x += w / 8) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
    ctx.stroke();
    ctx.strokeStyle = '#fffdf8';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    if (idle || !analyser) {
      ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
    } else {
      analyser.getByteTimeDomainData(data);
      const n = data.length;
      for (let i = 0; i < n; i++) {
        const x = (i / (n - 1)) * w;
        const y = h / 2 + ((data[i] - 128) / 128) * (h / 2 - 6);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }
  function scopeRun() {
    if (!analyser) return;
    if (reduced) {
      setTimeout(() => drawScope(false), 30);
      return;
    }
    scopeUntil = performance.now() + 420;
    if (!scopeRaf) scopeRaf = requestAnimationFrame(scopeFrame);
  }
  function scopeFrame() {
    drawScope(false);
    if (performance.now() < scopeUntil) scopeRaf = requestAnimationFrame(scopeFrame);
    else { scopeRaf = 0; drawScope(true); }
  }
  sizeScope();
  window.addEventListener('resize', () => { sizeScope(); fit(); });

  /* ---------- Inside: four steps, one figure ---------- */
  const viz = $('#viz');
  const steps = Array.from(document.querySelectorAll('.step'));
  function setStep(n) {
    viz.dataset.step = String(n);
    for (const s of steps) {
      const on = s.dataset.s === String(n);
      s.classList.toggle('on', on);
      s.querySelector('.numb').setAttribute('aria-current', on ? 'step' : 'false');
    }
  }
  for (const s of steps) {
    s.addEventListener('click', () => setStep(s.dataset.s));
    s.addEventListener('mouseenter', () => setStep(s.dataset.s));
    s.querySelector('.numb').addEventListener('focus', () => setStep(s.dataset.s));
  }

  /* ---------- Back to top, entry ---------- */
  $('#topbtn').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }, { rootMargin: '0px 0px -10% 0px' });
    document.documentElement.classList.add('js-motion');
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }

  render();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
