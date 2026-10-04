(() => {
  'use strict';

  const doc = document;
  const body = doc.body;
  const $ = (s, r = doc) => r.querySelector(s);
  const $$ = (s, r = doc) => Array.from(r.querySelectorAll(s));
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const compactMQ = matchMedia('(max-width: 639px)');
  const reduced = () => reduceMQ.matches;

  /* ------------------------------------------------------------------
     Keyboard layouts. Widths are in quarter units (4 = 1u).
     [code, label, width, kind, char]
  ------------------------------------------------------------------ */
  const A = (c) => ['Key' + c, c, 4, 'alpha', c.toLowerCase()];
  const D = (n) => ['Digit' + n, n, 4, 'alpha', n];
  const F = (n) => ['F' + n, 'F' + n, 4, 'alpha', ''];

  const FULL = [
    [['Escape', 'esc', 4, 'esc', ''], F(1), F(2), F(3), F(4), F(5), F(6), F(7), F(8), F(9), F(10), F(11), F(12),
      ['PrintScreen', 'prt', 4, 'mod', ''], ['Insert', 'ins', 4, 'mod', ''], ['Delete', 'del', 4, 'mod', '']],
    [['Backquote', '`', 4, 'alpha', '`'], D(1), D(2), D(3), D(4), D(5), D(6), D(7), D(8), D(9), D(0),
      ['Minus', '-', 4, 'alpha', '-'], ['Equal', '=', 4, 'alpha', '='], ['Backspace', 'back', 8, 'mod', ''], ['PageUp', 'pg up', 4, 'mod', '']],
    [['Tab', 'tab', 6, 'mod', ''], A('Q'), A('W'), A('E'), A('R'), A('T'), A('Y'), A('U'), A('I'), A('O'), A('P'),
      ['BracketLeft', '[', 4, 'alpha', '['], ['BracketRight', ']', 4, 'alpha', ']'], ['Backslash', '\\', 6, 'alpha', '\\'], ['PageDown', 'pg dn', 4, 'mod', '']],
    [['CapsLock', 'caps', 7, 'mod', ''], A('A'), A('S'), A('D'), A('F'), A('G'), A('H'), A('J'), A('K'), A('L'),
      ['Semicolon', ';', 4, 'alpha', ';'], ['Quote', "'", 4, 'alpha', "'"], ['Enter', 'enter', 9, 'enter', ''], ['Home', 'home', 4, 'mod', '']],
    [['ShiftLeft', 'shift', 9, 'mod', ''], A('Z'), A('X'), A('C'), A('V'), A('B'), A('N'), A('M'),
      ['Comma', ',', 4, 'alpha', ','], ['Period', '.', 4, 'alpha', '.'], ['Slash', '/', 4, 'alpha', '/'],
      ['ShiftRight', 'shift', 7, 'mod', ''], ['ArrowUp', '↑', 4, 'mod', ''], ['End', 'end', 4, 'mod', '']],
    [['ControlLeft', 'ctrl', 5, 'mod', ''], ['AltLeft', 'opt', 5, 'mod', ''], ['MetaLeft', 'cmd', 5, 'mod', ''],
      ['Space', '', 25, 'alpha', ' '], ['MetaRight', 'cmd', 4, 'mod', ''], ['AltRight', 'opt', 4, 'mod', ''], ['Fn', 'fn', 4, 'mod', ''],
      ['ArrowLeft', '←', 4, 'mod', ''], ['ArrowDown', '↓', 4, 'mod', ''], ['ArrowRight', '→', 4, 'mod', '']]
  ];

  const COMPACT = [
    [['Escape', 'esc', 4, 'esc', ''], D(1), D(2), D(3), ['Backspace', 'back', 8, 'mod', '']],
    [A('Q'), A('W'), A('E'), A('R'), A('T'), A('Y')],
    [A('A'), A('S'), A('D'), A('F'), A('G'), A('H')],
    [A('Z'), A('X'), A('C'), A('V'), A('B'), A('N')],
    [['Space', '', 16, 'alpha', ' '], ['Enter', 'enter', 8, 'enter', '']]
  ];

  const ARIA = { '`': 'Backtick', '-': 'Minus', '=': 'Equals', '[': 'Left bracket', ']': 'Right bracket', '\\': 'Backslash', ';': 'Semicolon', "'": 'Quote', ',': 'Comma', '.': 'Full stop', '/': 'Slash', '↑': 'Up', '↓': 'Down', '←': 'Left', '→': 'Right' };

  const kb = $('#kb');
  let keyByCode = new Map();
  let capsOn = false;

  function render() {
    const layout = compactMQ.matches ? COMPACT : FULL;
    kb.classList.toggle('is-compact', compactMQ.matches);
    kb.textContent = '';
    keyByCode = new Map();
    layout.forEach((row) => {
      const r = doc.createElement('div');
      r.className = 'kb-row';
      row.forEach(([code, label, w, kind, ch]) => {
        const b = doc.createElement('button');
        b.type = 'button';
        b.tabIndex = -1;
        b.className = 'key k-' + kind;
        b.style.setProperty('--w', w);
        b.dataset.code = code;
        b.dataset.ch = ch;
        b.dataset.size = String(w / 4);
        b.setAttribute('aria-label', code === 'Space' ? 'Space' : (ARIA[label] || label));
        const lg = doc.createElement('span');
        lg.className = 'lg';
        lg.setAttribute('aria-hidden', 'true');
        lg.textContent = label;
        b.appendChild(lg);
        if (code === 'CapsLock') {
          const led = doc.createElement('i');
          led.className = 'led';
          led.setAttribute('aria-hidden', 'true');
          b.appendChild(led);
          b.classList.toggle('is-latched', capsOn);
        }
        r.appendChild(b);
        keyByCode.set(code, b);
      });
      kb.appendChild(r);
    });
  }
  render();
  compactMQ.addEventListener('change', render);

  /* ------------------------------------------------------------------
     Switch sounds, synthesised with Web Audio.
  ------------------------------------------------------------------ */
  let switchType = 'tactile';
  let soundOn = true;
  let ctx = null;
  let master = null;
  let noise = null;

  function audio() {
    if (!soundOn) return null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.55;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      master.connect(comp).connect(ctx.destination);
      noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function burst(t, { type = 'bandpass', freq = 1000, q = 1, gain = 0.3, dur = 0.04 }) {
    const src = ctx.createBufferSource();
    src.buffer = noise;
    src.playbackRate.value = 0.9 + Math.random() * 0.2;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.0015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(master);
    src.start(t, Math.random() * 0.3);
    src.stop(t + dur + 0.02);
  }

  function tone(t, { freq = 200, gain = 0.2, dur = 0.06, wave = 'sine', drop = 0.6 }) {
    const o = ctx.createOscillator();
    o.type = wave;
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * drop, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  function soundDown(size = 1, type = switchType) {
    if (!audio()) return;
    const t = ctx.currentTime + 0.002;
    const big = Math.min(size, 6.25);
    const low = 1 / Math.pow(big, 0.28);
    const jitter = 0.94 + Math.random() * 0.12;
    let at = t;
    if (type === 'tactile') {
      burst(t, { freq: 1900 * jitter, q: 2.2, gain: 0.12, dur: 0.012 });
      at = t + 0.014;
    } else if (type === 'clicky') {
      burst(t, { freq: 4300 * jitter, q: 3.2, gain: 0.55, dur: 0.014 });
      tone(t, { freq: 2600 * jitter, gain: 0.05, dur: 0.008, wave: 'square', drop: 0.9 });
      at = t + 0.011;
    }
    const thock = type === 'clicky' ? 0.6 : 1;
    burst(at, { freq: 950 * low * jitter, q: 1.3, gain: 0.45 * thock, dur: 0.05 });
    tone(at, { freq: 190 * low * jitter, gain: 0.32 * thock, dur: 0.07 });
    burst(at + 0.002, { type: 'highpass', freq: 2600, q: 0.7, gain: 0.07, dur: 0.01 });
    if (size >= 2) {
      burst(at + 0.006, { freq: 520 * jitter, q: 4, gain: 0.12, dur: 0.05 });
      tone(at, { freq: 118 * jitter, gain: 0.16, dur: 0.09 });
    }
  }

  function soundUp(size = 1, type = switchType) {
    if (!audio()) return;
    const t = ctx.currentTime + 0.002;
    const jitter = 0.94 + Math.random() * 0.12;
    if (type === 'clicky') {
      burst(t, { freq: 3500 * jitter, q: 3, gain: 0.28, dur: 0.012 });
    }
    burst(t + 0.004, { freq: 1500 * jitter / Math.pow(Math.min(size, 6.25), 0.2), q: 1.6, gain: 0.1, dur: 0.025 });
  }

  /* ------------------------------------------------------------------
     Pressing: shared by pointer, physical keys, and samples.
  ------------------------------------------------------------------ */
  const readout = $('#readout');
  const typeOut = $('#typeOut');
  const typeHint = $('#typeHint');
  const letters = $$('.cell b');
  const LETTER_CODES = { KeyK: 0, KeyE: 1, KeyY: 2, Minus: 3, Digit0: 4, Digit1: 5 };
  let presses = 0;
  let typed = '';

  function nameOf(code, el) {
    if (el) return el.getAttribute('aria-label');
    if (code.startsWith('Key')) return code.slice(3);
    if (code.startsWith('Digit')) return code.slice(5);
    return code.replace(/(Left|Right)$/, '');
  }

  function report(label) {
    presses += 1;
    readout.textContent = 'Last: ' + label + ' · ' + presses + (presses === 1 ? ' press' : ' presses');
  }

  function type(ch, code) {
    if (code === 'Backspace') typed = typed.slice(0, -1);
    else if (code === 'Enter') typed = '';
    else if (ch) typed = (typed + ch).slice(-64);
    typeOut.textContent = typed;
    typeHint.hidden = typed.length > 0;
  }

  function lightLetter(code, on) {
    const i = LETTER_CODES[code];
    if (i !== undefined) letters[i].classList.toggle('lit', on);
  }

  function down(code, opts = {}) {
    const el = keyByCode.get(code);
    if (el) el.classList.add('is-pressed');
    lightLetter(code, true);
    const size = el ? Number(el.dataset.size) : (code === 'Space' ? 6.25 : 1);
    soundDown(size);
    report(nameOf(code, el));
    if (code === 'CapsLock') {
      capsOn = !capsOn;
      const caps = keyByCode.get('CapsLock');
      if (caps) caps.classList.toggle('is-latched', capsOn);
    }
    const ch = opts.ch !== undefined ? opts.ch : (el ? el.dataset.ch : '');
    type(capsOn && ch ? ch.toUpperCase() : ch, code);
  }

  function up(code) {
    const el = keyByCode.get(code);
    const was = el && el.classList.contains('is-pressed');
    if (el) el.classList.remove('is-pressed');
    lightLetter(code, false);
    if (was || !el) soundUp(el ? Number(el.dataset.size) : 1);
  }

  /* pointer: multi-touch safe */
  const pointerKeys = new Map();
  kb.addEventListener('pointerdown', (e) => {
    const k = e.target.closest('.key');
    if (!k) return;
    e.preventDefault();
    try { k.setPointerCapture(e.pointerId); } catch (_) { /* capture is optional */ }
    pointerKeys.set(e.pointerId, k.dataset.code);
    down(k.dataset.code);
  });
  const endPointer = (e) => {
    const code = pointerKeys.get(e.pointerId);
    if (!code) return;
    pointerKeys.delete(e.pointerId);
    up(code);
  };
  kb.addEventListener('pointerup', endPointer);
  kb.addEventListener('pointercancel', endPointer);
  kb.addEventListener('lostpointercapture', endPointer);
  kb.addEventListener('contextmenu', (e) => e.preventDefault());

  /* physical keyboard */
  const hero = $('#play');
  let heroVisible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es) => { heroVisible = es[0].isIntersecting; }, { threshold: 0.35 }).observe(hero);
  }
  const SCROLLERS = new Set(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End', 'Slash', 'Quote', 'Backspace']);
  const held = new Set();

  function isField(t) {
    return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  }
  function isControl(t) {
    return t && t !== body && !t.closest('.kb') && /^(A|BUTTON|SUMMARY)$/.test(t.tagName);
  }

  doc.addEventListener('keydown', (e) => {
    if (body.classList.contains('menu-open')) return;
    if (!e.code || e.code === 'Unidentified') return;
    const field = isField(e.target);
    const inForm = e.target.closest && e.target.closest('#reserve');
    if (inForm && !field) return;
    if (field) {
      if (!e.repeat && !e.metaKey && !e.ctrlKey) soundDown(e.code === 'Space' ? 6.25 : 1);
      return;
    }
    const plain = !e.metaKey && !e.ctrlKey && !e.altKey;
    if (plain && heroVisible && SCROLLERS.has(e.code) && !isControl(e.target)) e.preventDefault();
    if (e.repeat || held.has(e.code)) return;
    held.add(e.code);
    const printable = plain && e.key && e.key.length === 1 ? e.key : (e.code === 'Space' ? ' ' : '');
    down(e.code, { ch: printable });
  });

  doc.addEventListener('keyup', (e) => {
    if (isField(e.target)) {
      if (!e.metaKey && !e.ctrlKey) soundUp(1);
      return;
    }
    if (!held.has(e.code)) return;
    held.delete(e.code);
    up(e.code);
  });

  function releaseAll() {
    held.forEach((c) => up(c));
    held.clear();
    keyByCode.forEach((k) => k.classList.remove('is-pressed'));
    letters.forEach((l) => l.classList.remove('lit'));
  }
  window.addEventListener('blur', releaseAll);
  doc.addEventListener('visibilitychange', () => { if (doc.hidden) releaseAll(); });

  /* ------------------------------------------------------------------
     Hero controls: switch picker and sound latch.
  ------------------------------------------------------------------ */
  const pickKeys = $$('.pick [data-switch]');
  function setSwitch(type, preview) {
    switchType = type;
    pickKeys.forEach((b) => b.setAttribute('aria-checked', String(b.dataset.switch === type)));
    if (preview) {
      soundDown(1, type);
      setTimeout(() => soundUp(1, type), 90);
    }
  }
  pickKeys.forEach((b) => {
    b.addEventListener('click', () => setSwitch(b.dataset.switch, true));
    b.addEventListener('keydown', (e) => {
      const i = pickKeys.indexOf(b);
      let n = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % pickKeys.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i + pickKeys.length - 1) % pickKeys.length;
      if (n < 0) return;
      e.preventDefault();
      e.stopPropagation();
      pickKeys[n].focus();
      setSwitch(pickKeys[n].dataset.switch, true);
    });
  });
  pickKeys.forEach((b) => { b.tabIndex = b.getAttribute('aria-checked') === 'true' ? 0 : -1; });
  const syncRoving = () => pickKeys.forEach((b) => { b.tabIndex = b.getAttribute('aria-checked') === 'true' ? 0 : -1; });
  new MutationObserver(syncRoving).observe($('.pick-keys'), { subtree: true, attributes: true, attributeFilter: ['aria-checked'] });

  const soundKey = $('#soundKey');
  soundKey.addEventListener('click', () => {
    soundOn = !soundOn;
    soundKey.setAttribute('aria-pressed', String(soundOn));
    if (soundOn) soundDown(1);
  });

  /* Enter on a focused control key shows travel, as Space does */
  $$('.ctl').forEach((b) => {
    b.addEventListener('keydown', (e) => { if (e.key === 'Enter') b.classList.add('is-pressed'); });
    b.addEventListener('keyup', (e) => { if (e.key === 'Enter') b.classList.remove('is-pressed'); });
    b.addEventListener('blur', () => b.classList.remove('is-pressed'));
  });

  /* ------------------------------------------------------------------
     Wordmark: load rise, column hover.
  ------------------------------------------------------------------ */
  const cols = $$('.cols i');
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    body.classList.remove('preload');
    body.classList.add('play');
  };
  requestAnimationFrame(() => requestAnimationFrame(start));
  setTimeout(start, 120);
  let activeCol = -1;
  function setCol(i) {
    if (i === activeCol) return;
    if (activeCol > -1) {
      cols[activeCol].classList.remove('on');
      const l = letterForCol(activeCol);
      if (l) l.classList.remove('on');
    }
    activeCol = i;
    if (i > -1) {
      cols[i].classList.add('on');
      const l = letterForCol(i);
      if (l) l.classList.add('on');
    }
  }
  function letterForCol(i) {
    if (compactMQ.matches) return null;
    return letters[i >> 1] || null;
  }
  hero.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    let hit = -1;
    cols.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      if (r.width && e.clientX >= r.left && e.clientX <= r.right) hit = i;
    });
    setCol(hit);
  });
  hero.addEventListener('pointerleave', () => setCol(-1));

  /* ------------------------------------------------------------------
     Phone menu: circle reveal from the button.
  ------------------------------------------------------------------ */
  const burger = $('#burger');
  const menu = $('#menu');
  const main = $('#main');
  const menuLinks = $$('a', menu);

  function geometry() {
    const b = burger.getBoundingClientRect();
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;
    const r = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
    menu.style.setProperty('--cx', cx + 'px');
    menu.style.setProperty('--cy', cy + 'px');
    menu.style.setProperty('--r', Math.ceil(r) + 'px');
  }
  function openMenu() {
    geometry();
    body.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    main.inert = true;
    $('.colophon').inert = true;
    setTimeout(() => menuLinks[0].focus(), reduced() ? 0 : 200);
  }
  function closeMenu(focusBtn = true) {
    body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    main.inert = false;
    $('.colophon').inert = false;
    if (focusBtn) burger.focus();
  }
  burger.addEventListener('click', () => (body.classList.contains('menu-open') ? closeMenu() : openMenu()));
  menuLinks.forEach((a) => a.addEventListener('click', () => closeMenu(false)));
  doc.addEventListener('keydown', (e) => {
    if (!body.classList.contains('menu-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
    if (e.key !== 'Tab') return;
    const ring = [burger, ...menuLinks];
    const i = ring.indexOf(doc.activeElement);
    e.preventDefault();
    const n = i < 0 ? 0 : (i + (e.shiftKey ? ring.length - 1 : 1)) % ring.length;
    ring[n].focus();
  });
  addEventListener('resize', () => {
    if (body.classList.contains('menu-open')) {
      if (innerWidth >= 768) closeMenu(false);
      else geometry();
    }
  });

  /* nav current item follows the section in view */
  const navLinks = $$('.nav-links a');
  const sections = ['play', 'build', 'sound', 'specs', 'reserve'].map((id) => doc.getElementById(id));
  if ('IntersectionObserver' in window) {
    const navIO = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        navLinks.forEach((a) => {
          if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'page');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => navIO.observe(s));
  }

  /* ------------------------------------------------------------------
     Build: sticky exploded view driven by data-step.
  ------------------------------------------------------------------ */
  const viz = $('#viz');
  const steps = $$('.step');
  function setStep(n) {
    n = String(n);
    viz.dataset.step = n;
    steps.forEach((s) => {
      const on = s.dataset.s === n;
      s.classList.toggle('on', on);
      const nb = $('.num-btn', s);
      if (on) nb.setAttribute('aria-current', 'step');
      else nb.removeAttribute('aria-current');
    });
  }
  if ('IntersectionObserver' in window) {
    const stepIO = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setStep(e.target.dataset.s); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    steps.forEach((s) => stepIO.observe(s));
  }
  steps.forEach((s) => {
    $('.num-btn', s).addEventListener('click', () => {
      setStep(s.dataset.s);
      s.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
    });
  });

  /* ------------------------------------------------------------------
     Sound band: scroll velocity tracking, plus sample buttons.
  ------------------------------------------------------------------ */
  const vel = $('.vel');
  const band = $('#sound');
  let space = 0;
  let settle = null;
  let bandVisible = false;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es) => { bandVisible = es[0].isIntersecting; }, { threshold: 0 }).observe(band);
  }
  addEventListener('scroll', () => {
    if (reduced() || !bandVisible) return;
    space = Math.min(0.2, space + 0.03);
    vel.style.setProperty('--ls', space.toFixed(4) + 'em');
    clearInterval(settle);
    settle = setInterval(() => {
      space *= 0.75;
      if (space < 0.008) {
        space = 0;
        clearInterval(settle);
        settle = null;
      }
      vel.style.setProperty('--ls', space.toFixed(4) + 'em');
    }, 48);
  }, { passive: true });

  $$('[data-play]').forEach((b) => {
    b.addEventListener('click', () => {
      const t = b.dataset.play;
      setSwitch(t, false);
      const seq = [0, 150, 290, 520];
      seq.forEach((ms, i) => {
        setTimeout(() => soundDown(i === 3 ? 6.25 : 1, t), ms);
        setTimeout(() => soundUp(i === 3 ? 6.25 : 1, t), ms + 85);
      });
    });
  });

  /* ------------------------------------------------------------------
     Reserve: one question at a time.
  ------------------------------------------------------------------ */
  const qs = $$('.q');
  const count = $('#count');
  const pfill = $('#pfill');
  const pbar = $('.pbar');
  const okBtn = $('#okBtn');
  const backBtn = $('#backBtn');
  const review = $('#review');
  const done = $('#done');
  const reserveSec = $('#reserve');
  const answers = { name: '', switch: '', finish: '', email: '' };
  const KEYS = ['name', 'switch', 'finish', 'email'];
  const LABELS = ['Name', 'Switch', 'Finish', 'Email'];
  let cur = 0;
  let editing = false;

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const first = () => (answers.name.trim().split(/\s+/)[0] || 'there');

  function paintProgress() {
    const n = Math.min(cur, 4);
    pfill.style.width = (n / 4 * 100) + '%';
    pbar.setAttribute('aria-valuenow', String(n));
    count.textContent = cur < 4 ? 'Question ' + (cur + 1) + ' of 4' : 'Review';
    backBtn.disabled = cur === 0;
    okBtn.firstChild.textContent = cur === 4 ? 'Reserve my KEY-01' : 'OK';
  }

  function focusStep() {
    setTimeout(() => {
      const q = qs[cur];
      const target = $('.inp', q) || $('.ch[aria-checked="true"]', q) || $('.ch', q) || $('.edit', q);
      if (target) target.focus({ preventScroll: true });
    }, reduced() ? 0 : 140);
  }

  function go(n, dir = 1) {
    if (n === cur) return;
    const leaving = qs[cur];
    leaving.classList.remove('on');
    leaving.classList.add(dir > 0 ? 'out' : 'out-down');
    setTimeout(() => leaving.classList.remove('out', 'out-down'), 540);
    cur = n;
    $$('.who').forEach((w) => { w.textContent = first(); });
    if (cur === 4) renderReview();
    qs[cur].classList.add('on');
    paintProgress();
    focusStep();
  }

  function renderReview() {
    review.innerHTML = KEYS.map((k, i) =>
      '<li><span class="rl">' + LABELS[i] + '</span><span class="ra">' + esc(answers[k]) +
      '</span><button class="edit" type="button" data-edit="' + i + '">Edit</button></li>').join('');
  }

  function setErr(msg) { $('.err', qs[cur]).textContent = msg || ''; }

  function next() {
    if (cur === 0) {
      const v = $('#f-name').value.trim();
      if (v.length < 2) return setErr('Just a first name is fine.');
      answers.name = v;
    } else if (cur === 1 || cur === 2) {
      const sel = $('.ch[aria-checked="true"]', qs[cur]);
      if (!sel) return setErr('Pick one, or press A to C.');
      answers[KEYS[cur]] = sel.dataset.v;
    } else if (cur === 3) {
      const v = $('#f-mail').value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return setErr('That address looks incomplete.');
      answers.email = v;
    } else if (cur === 4) {
      return send();
    }
    setErr('');
    if (editing) { editing = false; go(4); } else go(cur + 1);
  }

  function back() { if (cur > 0) go(cur - 1, -1); }

  function send() {
    okBtn.setAttribute('aria-busy', 'true');
    okBtn.firstChild.textContent = 'Sending';
    setTimeout(() => {
      okBtn.removeAttribute('aria-busy');
      $('#doneH').innerHTML = 'Thanks, ' + esc(first()) + '. Your <span class="nb">KEY-01</span> is on hold.';
      $('#doneP').textContent = answers.switch.split(',')[0] + ' switches, ' + answers.finish + ' case. We will write to ' + answers.email + ' before your batch is built. Nothing has been charged.';
      done.classList.add('show');
      done.setAttribute('aria-hidden', 'false');
      count.textContent = 'Sent';
      setTimeout(() => $('#againBtn').focus({ preventScroll: true }), reduced() ? 0 : 400);
    }, 1300);
  }

  function reset() {
    Object.keys(answers).forEach((k) => { answers[k] = ''; });
    $('#f-name').value = '';
    $('#f-mail').value = '';
    $$('.ch').forEach((c) => c.setAttribute('aria-checked', 'false'));
    $$('.err').forEach((e) => { e.textContent = ''; });
    done.classList.remove('show');
    done.setAttribute('aria-hidden', 'true');
    editing = false;
    qs.forEach((q) => q.classList.remove('on', 'out', 'out-down'));
    cur = 0;
    qs[0].classList.add('on');
    paintProgress();
    focusStep();
  }

  okBtn.addEventListener('click', next);
  backBtn.addEventListener('click', back);
  $('#againBtn').addEventListener('click', reset);
  $('#stage').addEventListener('submit', (e) => { e.preventDefault(); next(); });
  $$('.inp').forEach((i) => i.addEventListener('input', () => setErr('')));

  $$('.chs').forEach((group) => {
    const chs = $$('.ch', group);
    chs.forEach((c) => {
      c.addEventListener('click', () => {
        chs.forEach((o) => o.setAttribute('aria-checked', String(o === c)));
        setErr('');
        if (c.dataset.switch) {
          setSwitch(c.dataset.switch, true);
        } else {
          soundDown(1);
          setTimeout(() => soundUp(1), 80);
        }
        setTimeout(next, 260);
      });
    });
  });

  review.addEventListener('click', (e) => {
    const b = e.target.closest('[data-edit]');
    if (!b) return;
    editing = true;
    go(Number(b.dataset.edit), -1);
  });

  reserveSec.addEventListener('keydown', (e) => {
    if (done.classList.contains('show')) return;
    const t = e.target;
    if (e.key === 'Enter' && t.classList.contains('ch')) { e.preventDefault(); t.click(); return; }
    if (e.key === 'Enter' && !e.shiftKey && !t.closest('.edit, .back, #okBtn, #againBtn')) { e.preventDefault(); next(); return; }
    if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1 || isField(t)) return;
    const chs = $$('.ch', qs[cur]);
    const L = e.key.toUpperCase().charCodeAt(0) - 65;
    if (chs.length && L >= 0 && L < chs.length) { e.preventDefault(); chs[L].click(); }
  });

  paintProgress();

  /* ------------------------------------------------------------------
     Footer: back to the keyboard.
  ------------------------------------------------------------------ */
  $('#topBtn').addEventListener('click', () => {
    scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
  });
})();
