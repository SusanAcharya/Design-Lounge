/* KEY-01 launch page. The board on the page answers your keyboard.
   Designed using Design Lounge · https://www.designlounge.live */
(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);

  /* ---------- The layout: 61 keys, five rows ----------
     [code, legend, shifted legend, width in u, kind] */
  const ROWS = [
    [['Escape', 'Esc', '', 1, 'acc'], ['Digit1', '1', '!'], ['Digit2', '2', '@'], ['Digit3', '3', '#'], ['Digit4', '4', '$'],
     ['Digit5', '5', '%'], ['Digit6', '6', '^'], ['Digit7', '7', '&'], ['Digit8', '8', '*'], ['Digit9', '9', '('],
     ['Digit0', '0', ')'], ['Minus', '-', '_'], ['Equal', '=', '+'], ['Backspace', 'Backspace', '', 2, 'mod']],
    [['Tab', 'Tab', '', 1.5, 'mod'], ['KeyQ', 'Q'], ['KeyW', 'W'], ['KeyE', 'E'], ['KeyR', 'R'], ['KeyT', 'T'], ['KeyY', 'Y'],
     ['KeyU', 'U'], ['KeyI', 'I'], ['KeyO', 'O'], ['KeyP', 'P'], ['BracketLeft', '[', '{'], ['BracketRight', ']', '}'],
     ['Backslash', '\\', '|', 1.5]],
    [['CapsLock', 'Caps', '', 1.75, 'mod'], ['KeyA', 'A'], ['KeyS', 'S'], ['KeyD', 'D'], ['KeyF', 'F'], ['KeyG', 'G'],
     ['KeyH', 'H'], ['KeyJ', 'J'], ['KeyK', 'K'], ['KeyL', 'L'], ['Semicolon', ';', ':'], ['Quote', "'", '"'],
     ['Enter', 'Enter', '', 2.25, 'mod']],
    [['ShiftLeft', 'Shift', '', 2.25, 'mod'], ['KeyZ', 'Z'], ['KeyX', 'X'], ['KeyC', 'C'], ['KeyV', 'V'], ['KeyB', 'B'],
     ['KeyN', 'N'], ['KeyM', 'M'], ['Comma', ',', '<'], ['Period', '.', '>'], ['Slash', '/', '?'],
     ['ShiftRight', 'Shift', '', 2.75, 'mod']],
    [['ControlLeft', 'Ctrl', '', 1.25, 'mod'], ['MetaLeft', 'Cmd', '', 1.25, 'mod'], ['AltLeft', 'Alt', '', 1.25, 'mod'],
     ['Space', '', '', 6.25, 'space'], ['AltRight', 'Alt', '', 1.25, 'mod'], ['MetaRight', 'Cmd', '', 1.25, 'mod'],
     ['Fn', 'Fn', '', 1.25, 'mod'], ['ControlRight', 'Ctrl', '', 1.25, 'mod']]
  ];

  const keysEl = $('#keys');
  const kb = $('#kb');
  const byCode = new Map();
  const byChar = new Map();
  const keys = [];

  ROWS.forEach((row) => {
    row.forEach(([code, legend, shifted = '', w = 1, kind = '']) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.tabIndex = -1;
      b.className = 'key' + (kind ? ' ' + kind : '') + (shifted ? ' two' : '');
      b.style.setProperty('--s', String(Math.round(w * 4)));
      const name = code === 'Space' ? 'Space' : legend;
      b.setAttribute('aria-label', shifted ? `${legend}, shift ${shifted}` : name);
      b.innerHTML = `<span class="cap"><span class="top">${shifted ? `<span class="lg2">${esc(shifted)}</span>` : ''}<span class="lg">${esc(legend)}</span></span></span>`;
      const k = { code, legend, shifted, w, kind, el: b, name, held: false };
      b._key = k;
      keys.push(k);
      byCode.set(code, k);
      if (/^Key[A-Z]$/.test(code)) {
        byChar.set(legend.toLowerCase(), k);
        byChar.set(legend, k);
      } else if (code === 'Space') {
        byChar.set(' ', k);
      } else if (code === 'Enter') {
        byChar.set('\n', k);
      } else if (legend.length === 1) {
        byChar.set(legend, k);
        if (shifted) byChar.set(shifted, k);
      }
      keysEl.appendChild(b);
    });
  });

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------- Sound: synthesised switches, no samples ---------- */
  let ac = null;
  let noiseBuf = null;
  let bus = null;
  let lp = null;
  let soundOn = true;
  let mode = 'linear';

  const MODES = {
    linear: { lp: 8000, thock: 0.55, thockF: 900, tone: [150, 70, 0.03, 0.07, 0.34], bump: null, click: null, release: null },
    tactile: { lp: 7000, thock: 0.45, thockF: 1100, tone: [190, 90, 0.025, 0.06, 0.3], bump: [2200, 1.2, 0.015, 0.22], click: null, release: null },
    clicky: { lp: 12000, thock: 0.35, thockF: 1300, tone: [240, 110, 0.02, 0.05, 0.22], bump: null, click: [4200, 3, 0.012, 0.5], release: [3600, 2.5, 0.008, 0.2] }
  };

  function ensureAudio() {
    if (ac) return true;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return false;
    ac = new Ctx();
    const n = ac.sampleRate;
    noiseBuf = ac.createBuffer(1, n, n);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    bus = ac.createGain();
    bus.gain.value = 0.9;
    lp = ac.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = MODES[mode].lp;
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 6;
    comp.attack.value = 0.002;
    comp.release.value = 0.08;
    bus.connect(lp).connect(comp).connect(ac.destination);
    return true;
  }

  function noise(t, type, f, q, dec, g, attack = 0.001) {
    const s = ac.createBufferSource();
    s.buffer = noiseBuf;
    const flt = ac.createBiquadFilter();
    flt.type = type;
    flt.frequency.value = f;
    flt.Q.value = q;
    const e = ac.createGain();
    e.gain.setValueAtTime(0.0001, t);
    e.gain.exponentialRampToValueAtTime(g, t + attack);
    e.gain.exponentialRampToValueAtTime(0.0001, t + dec);
    s.connect(flt).connect(e).connect(bus);
    s.start(t);
    s.stop(t + dec + 0.02);
  }

  function tone(t, type, f0, f1, pd, dec, g) {
    const s = ac.createOscillator();
    s.type = type;
    s.frequency.setValueAtTime(f0, t);
    s.frequency.exponentialRampToValueAtTime(f1, t + pd);
    const e = ac.createGain();
    e.gain.setValueAtTime(0.0001, t);
    e.gain.exponentialRampToValueAtTime(g, t + 0.002);
    e.gain.exponentialRampToValueAtTime(0.0001, t + dec);
    s.connect(e).connect(bus);
    s.start(t);
    s.stop(t + dec + 0.03);
  }

  function playPress(k) {
    if (!soundOn || !ensureAudio()) return;
    if (ac.state === 'suspended') ac.resume();
    const m = MODES[mode];
    const t = ac.currentTime + 0.001;
    const vel = 1 + (Math.random() - 0.5) * 0.12;
    const p = 1 + (Math.random() - 0.5) * 0.06;
    const big = k.kind === 'space';
    const stab = !big && k.w >= 2;
    const size = big ? 0.6 : stab ? 0.85 : 1;
    const len = big ? 1.7 : stab ? 1.25 : 1;

    if (m.click) noise(t, 'bandpass', m.click[0] * p, m.click[1], m.click[2], m.click[3] * vel);
    if (m.bump) noise(t, 'bandpass', m.bump[0] * p, m.bump[1], m.bump[2], m.bump[3] * vel);
    const t2 = t + (m.bump ? 0.012 : m.click ? 0.01 : 0);
    noise(t2, 'lowpass', m.thockF * size * p, 0.7, 0.035 * len, m.thock * vel);
    const [f0, f1, pd, dec, g] = m.tone;
    tone(t2, 'sine', f0 * size * p, f1 * size * p, pd, dec * len, g * vel);
    if (stab) noise(t2 + 0.006, 'bandpass', 3000 * p, 2, 0.01, 0.12 * vel);
    if (big) noise(t2 + 0.004, 'lowpass', 600, 0.5, 0.06, 0.25 * vel);
  }

  function playRelease(k) {
    if (!soundOn || !ac) return;
    const m = MODES[mode];
    if (!m.release) return;
    const t = ac.currentTime + 0.001;
    const p = 1 + (Math.random() - 0.5) * 0.06;
    noise(t, 'bandpass', m.release[0] * p, m.release[1], m.release[2], m.release[3]);
  }

  /* ---------- The headline is what you type ---------- */
  const typed = $('#typed');
  const line = $('#line');
  const txt = $('#txt');
  const typein = $('#typein');
  const MAX = 40;
  let buffer = 'KEY-01';
  let mirror = buffer;

  function fits() { return line.offsetHeight <= typed.clientHeight + 1; }
  function render() {
    txt.textContent = buffer;
    /* The largest size that fits the box wins. A line that is still too long loses its oldest letters. */
    const sizes = ['l', 'm', 's'];
    for (const s of sizes) { typed.dataset.size = s; if (fits()) break; }
    let guard = 0;
    while (!fits() && buffer.length > 1 && guard++ < 60) { buffer = buffer.slice(1); txt.textContent = buffer; }
    mirror = buffer.replace(/\n/g, ' ');
    if (typein.value !== mirror) typein.value = mirror;
  }
  let rt = null;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(render, 120); });

  function typeChar(ch) {
    if (ch === '\n') {
      if (buffer.includes('\n')) return;
      buffer += '\n';
    } else {
      buffer += ch;
    }
    if (buffer.length > MAX) buffer = buffer.slice(buffer.length - MAX);
    render();
  }
  function typeBackspace() { buffer = buffer.slice(0, -1); render(); }
  function typeClear() { buffer = ''; render(); }

  /* ---------- Readouts ---------- */
  const rLast = $('#r-last');
  const rCount = $('#r-count');
  const rRate = $('#r-rate');
  let count = 0;
  const times = [];
  function readout(k) {
    count += 1;
    rCount.textContent = String(count);
    rLast.textContent = k.name;
    const now = performance.now();
    times.push(now);
    while (times.length && now - times[0] > 10000) times.shift();
    rRate.textContent = String(times.length * 6);
  }
  setInterval(() => {
    const now = performance.now();
    while (times.length && now - times[0] > 10000) times.shift();
    rRate.textContent = String(times.length * 6);
  }, 1000);

  /* ---------- Press and release ---------- */
  const ledCaps = $('#led-caps');
  let capsOn = false;
  let shiftHeld = 0;
  let touched = false;

  function down(k, { silent = false, count: doCount = true } = {}) {
    if (k.held) return;
    k.held = true;
    k.el.classList.add('down');
    if (!silent) playPress(k);
    if (doCount) readout(k);
  }
  function up(k) {
    if (!k.held) return;
    k.held = false;
    k.el.classList.remove('down');
    playRelease(k);
  }
  function releaseAll() {
    keys.forEach((k) => { if (k.held) { k.held = false; k.el.classList.remove('down'); } });
    shiftHeld = 0;
  }
  function firstTouch() {
    if (touched) return;
    touched = true;
    typed.classList.add('live');
    stopIdle();
  }

  /* What a tapped or screen-reader-activated key types */
  function actOn(k) {
    if (k.code === 'Backspace') typeBackspace();
    else if (k.code === 'Enter') typeChar('\n');
    else if (k.code === 'Escape') typeClear();
    else if (k.code === 'Space') typeChar(' ');
    else if (k.code === 'CapsLock') { capsOn = !capsOn; ledCaps.classList.toggle('on', capsOn); }
    else if (/^Key[A-Z]$/.test(k.code)) {
      const upper = (shiftHeld > 0) !== capsOn;
      typeChar(upper ? k.legend : k.legend.toLowerCase());
    } else if (k.legend.length === 1) {
      typeChar(shiftHeld > 0 && k.shifted ? k.shifted : k.legend);
    }
  }

  /* ---------- Physical keys, by code ---------- */
  const isMod = (c) => /^(Shift|Control|Alt|Meta)(Left|Right)$/.test(c);

  window.addEventListener('keydown', (e) => {
    const t = e.target;
    const inOtherField = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') && t !== typein;
    if (inOtherField) return;
    if (e.code === 'CapsLock' || e.getModifierState) {
      const c = e.getModifierState && e.getModifierState('CapsLock');
      if (typeof c === 'boolean') { capsOn = c; ledCaps.classList.toggle('on', capsOn); }
    }
    const k = byCode.get(e.code);
    if (!k) return;
    const onControl = t && t.closest && t.closest('button, [role="radio"], a');
    if (e.metaKey || e.ctrlKey || e.altKey) {
      if (isMod(e.code) && !e.repeat) { down(k, { silent: false }); firstTouch(); }
      return; /* browser shortcuts keep working */
    }
    if (e.code === 'Tab') { if (!e.repeat) { firstTouch(); down(k); } return; } /* never trap focus */
    if (onControl && (e.code === 'Space' || e.code === 'Enter')) return;      /* native button behaviour */
    e.preventDefault();
    if (e.repeat) return;
    firstTouch();
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') shiftHeld += 1;
    down(k);
    if (e.code === 'Backspace') typeBackspace();
    else if (e.code === 'Enter') typeChar('\n');
    else if (e.code === 'Escape') typeClear();
    else if (e.code === 'CapsLock') { capsOn = !capsOn; ledCaps.classList.toggle('on', capsOn); }
    else if (e.key && e.key.length === 1) typeChar(e.key);
  });

  window.addEventListener('keyup', (e) => {
    const k = byCode.get(e.code);
    if (!k) return;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') shiftHeld = Math.max(0, shiftHeld - 1);
    up(k);
  });
  window.addEventListener('blur', releaseAll);
  document.addEventListener('visibilitychange', () => { if (document.hidden) releaseAll(); });

  /* ---------- A phone keyboard: diff the hidden input ---------- */
  typein.addEventListener('input', () => {
    const v = typein.value;
    if (v === mirror) return;
    firstTouch();
    if (v.length > mirror.length && v.startsWith(mirror)) {
      const added = v.slice(mirror.length);
      for (const ch of added) {
        const k = byChar.get(ch);
        if (k) tap(k, { type: false });
        typeChar(ch);
      }
    } else if (v.length < mirror.length && mirror.startsWith(v)) {
      const k = byCode.get('Backspace');
      for (let i = 0; i < mirror.length - v.length; i++) { tap(k, { type: false }); typeBackspace(); }
    } else {
      buffer = v.slice(-MAX);
      render();
    }
    render();
  });
  typein.addEventListener('focus', () => typed.classList.add('live'));

  function tap(k, { type = true } = {}) {
    firstTouch();
    down(k);
    if (type) actOn(k);
    setTimeout(() => up(k), 80);
  }

  /* ---------- Pointer: press, slide, lift ---------- */
  const pointers = new Map();
  keysEl.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('.key');
    if (!el) return;
    e.preventDefault();
    keysEl.setPointerCapture(e.pointerId);
    const k = el._key;
    pointers.set(e.pointerId, k);
    firstTouch();
    if (k.code === 'ShiftLeft' || k.code === 'ShiftRight') shiftHeld += 1;
    down(k);
    actOn(k);
  });
  keysEl.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const kel = el && el.closest ? el.closest('.key') : null;
    const prev = pointers.get(e.pointerId);
    if (!kel || kel._key === prev) return;
    if (prev) { if (/^Shift/.test(prev.code)) shiftHeld = Math.max(0, shiftHeld - 1); up(prev); }
    const k = kel._key;
    pointers.set(e.pointerId, k);
    down(k);
    actOn(k);
  });
  function lift(e) {
    const k = pointers.get(e.pointerId);
    if (!k) return;
    pointers.delete(e.pointerId);
    if (/^Shift/.test(k.code)) shiftHeld = Math.max(0, shiftHeld - 1);
    up(k);
  }
  keysEl.addEventListener('pointerup', lift);
  keysEl.addEventListener('pointercancel', lift);
  keysEl.addEventListener('lostpointercapture', lift);
  keysEl.addEventListener('click', (e) => {
    const el = e.target.closest('.key');
    if (el && e.detail === 0) tap(el._key); /* screen reader or keyboard activation */
  });

  /* ---------- Idle invitation: K E Y dip silently until the first touch ---------- */
  let idleTimer = null;
  if (!reduced) {
    const seq = ['KeyK', 'KeyE', 'KeyY', 'Minus', 'Digit0', 'Digit1'];
    let i = 0;
    idleTimer = setInterval(() => {
      const k = byCode.get(seq[i % seq.length]);
      i += 1;
      if (!k || k.held) return;
      k.el.classList.add('down');
      setTimeout(() => { if (!k.held) k.el.classList.remove('down'); }, 140);
    }, 480);
  }
  function stopIdle() {
    if (idleTimer) { clearInterval(idleTimer); idleTimer = null; }
  }

  /* ---------- Switch selector ---------- */
  const seg = $('.seg');
  const radios = Array.from(seg.querySelectorAll('[role="radio"]'));
  function setMode(m, { fill = true } = {}) {
    if (!MODES[m]) return;
    mode = m;
    kb.dataset.sw = m;
    radios.forEach((r) => {
      const on = r.dataset.sw === m;
      r.setAttribute('aria-checked', on ? 'true' : 'false');
      r.tabIndex = on ? 0 : -1;
    });
    if (lp) lp.frequency.setTargetAtTime(MODES[m].lp, ac.currentTime, 0.02);
    if (fill) {
      firstTouch();
      ['KeyK', 'KeyE', 'KeyY'].forEach((c, i) => {
        const k = byCode.get(c);
        setTimeout(() => { down(k, { count: false }); setTimeout(() => up(k), 70); }, i * 110);
      });
    }
  }
  radios.forEach((r) => {
    r.addEventListener('click', () => { setMode(r.dataset.sw); r.focus(); });
    r.addEventListener('keydown', (e) => {
      const i = radios.indexOf(r);
      let j = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % radios.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + radios.length) % radios.length;
      if (j < 0) return;
      e.preventDefault();
      e.stopPropagation();
      setMode(radios[j].dataset.sw);
      radios[j].focus();
    });
  });

  /* ---------- Sound toggle ---------- */
  const snd = $('#snd');
  function setSound(on) {
    soundOn = on;
    snd.setAttribute('aria-pressed', on ? 'true' : 'false');
    $('.snd-label', snd).textContent = on ? 'Sound on' : 'Sound off';
    if (on) { ensureAudio(); if (ac && ac.state === 'suspended') ac.resume(); }
  }
  snd.addEventListener('click', () => { firstTouch(); setSound(!soundOn); });

  /* Links in the rows that set a switch and go up to the board */
  document.querySelectorAll('a.more[data-sw]').forEach((a) => {
    a.addEventListener('click', () => setMode(a.dataset.sw, { fill: true }));
  });

  /* ---------- Entry: the panels slide in once ---------- */
  const panels = Array.from(document.querySelectorAll('.panel'));
  panels.forEach((p) => p.classList.add('reveal'));
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -40px 0px' });
    panels.forEach((p) => io.observe(p));
  } else {
    panels.forEach((p) => p.classList.add('in'));
  }

  /* ---------- Ship-date form ---------- */
  const form = $('#form');
  const email = $('#email');
  const frow = $('.frow');
  const msg = $('#msg');
  const go = $('.go');
  const idle = msg.textContent;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = email.value.trim();
    frow.classList.remove('bad', 'done');
    msg.classList.remove('bad', 'ok');
    if (!v) {
      frow.classList.add('bad'); msg.classList.add('bad');
      msg.textContent = 'Add an email first.';
      email.setAttribute('aria-invalid', 'true');
      email.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      frow.classList.add('bad'); msg.classList.add('bad');
      msg.textContent = 'That email needs an @ and a domain.';
      email.setAttribute('aria-invalid', 'true');
      email.focus();
      return;
    }
    frow.classList.add('done'); msg.classList.add('ok');
    email.setAttribute('aria-invalid', 'false');
    msg.textContent = `Noted. The ship date goes to ${v} the day it is set.`;
    email.disabled = true;
    go.disabled = true;
    go.firstChild.textContent = 'Noted';
  });
  email.addEventListener('input', () => {
    if (frow.classList.contains('bad')) {
      frow.classList.remove('bad'); msg.classList.remove('bad');
      msg.textContent = idle;
      email.setAttribute('aria-invalid', 'false');
    }
  });

  /* ---------- Back to top ---------- */
  $('#topbtn').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  render();
})();
