(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------------- layout: 68 keys, 16 units wide ---------------- */
  const L = (c) => [c, 1, [/[A-Z]/.test(c) ? 'Key' + c : 'Digit' + c]];
  const ROWS = [
    [['Esc', 1, ['Escape', 'Backquote'], 'acc'], ...'1234567890'.split('').map(L),
      ['-', 1, ['Minus']], ['=', 1, ['Equal']], ['Back', 2, ['Backspace'], 'mod'], ['Del', 1, ['Delete'], 'mod']],
    [['Tab', 1.5, ['Tab'], 'mod'], ...'QWERTYUIOP'.split('').map(L),
      ['[', 1, ['BracketLeft']], [']', 1, ['BracketRight']], ['\\', 1.5, ['Backslash']], ['PgUp', 1, ['PageUp', 'Home'], 'mod']],
    [['Caps', 1.75, ['CapsLock'], 'mod'], ...'ASDFGHJKL'.split('').map(L),
      [';', 1, ['Semicolon']], ["'", 1, ['Quote']], ['Enter', 2.25, ['Enter', 'NumpadEnter'], 'acc'], ['PgDn', 1, ['PageDown'], 'mod']],
    [['Shift', 2.25, ['ShiftLeft'], 'mod'], ...'ZXCVBNM'.split('').map(L),
      [',', 1, ['Comma']], ['.', 1, ['Period']], ['/', 1, ['Slash']], ['Shift', 1.75, ['ShiftRight'], 'mod'],
      ['↑', 1, ['ArrowUp'], 'mod arrow'], ['End', 1, ['End'], 'mod']],
    [['Ctrl', 1.25, ['ControlLeft'], 'mod'], ['Alt', 1.25, ['AltLeft'], 'mod'], ['Cmd', 1.25, ['MetaLeft', 'OSLeft'], 'mod'],
      ['', 6.25, ['Space']], ['Cmd', 1, ['MetaRight', 'OSRight'], 'mod'], ['Fn', 1, [], 'mod'], ['Ctrl', 1, ['ControlRight', 'AltRight'], 'mod'],
      ['←', 1, ['ArrowLeft'], 'mod arrow'], ['↓', 1, ['ArrowDown'], 'mod arrow'], ['→', 1, ['ArrowRight'], 'mod arrow']]
  ];
  const NAMES = {
    Esc: 'Escape', '-': 'Minus', '=': 'Equals', Back: 'Backspace', Del: 'Delete', '[': 'Left bracket', ']': 'Right bracket',
    '\\': 'Backslash', PgUp: 'Page up', PgDn: 'Page down', Caps: 'Caps lock', ';': 'Semicolon', "'": 'Quote',
    ',': 'Comma', '.': 'Full stop', '/': 'Slash', '↑': 'Up arrow', '←': 'Left arrow', '↓': 'Down arrow', '→': 'Right arrow',
    Ctrl: 'Control', Cmd: 'Command', Fn: 'Function', '': 'Space'
  };
  const CHAR_CODE = {
    '`': 'Backquote', '~': 'Backquote', '!': 'Digit1', '@': 'Digit2', '#': 'Digit3', '$': 'Digit4', '%': 'Digit5',
    '^': 'Digit6', '&': 'Digit7', '*': 'Digit8', '(': 'Digit9', ')': 'Digit0', '-': 'Minus', '_': 'Minus', '=': 'Equal',
    '+': 'Equal', '[': 'BracketLeft', '{': 'BracketLeft', ']': 'BracketRight', '}': 'BracketRight', '\\': 'Backslash',
    '|': 'Backslash', ';': 'Semicolon', ':': 'Semicolon', "'": 'Quote', '"': 'Quote', ',': 'Comma', '<': 'Comma',
    '.': 'Period', '>': 'Period', '/': 'Slash', '?': 'Slash', ' ': 'Space'
  };
  const SHORT = { Back: '⌫', '': 'Space' };

  const plate = $('#keys');
  const boardEl = $('#board');
  const keys = [];
  const byCode = new Map();
  ROWS.forEach((row, r) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'krow';
    let x = 0;
    row.forEach(([lg, w, codes, kind]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.tabIndex = -1;
      b.className = 'key' + (kind ? ' ' + kind : '');
      b.style.setProperty('--w', w);
      const name = NAMES[lg] || lg;
      b.setAttribute('aria-label', name);
      const cap = document.createElement('span'); cap.className = 'cap';
      const top = document.createElement('span'); top.className = 'top';
      const leg = document.createElement('span'); leg.className = 'lg'; leg.textContent = lg;
      top.appendChild(leg); cap.appendChild(top); b.appendChild(cap);
      rowEl.appendChild(b);
      let ch = null;
      if (lg.length === 1 && !/[↑←↓→]/.test(lg)) ch = lg.toLowerCase();
      if (lg === '') ch = ' ';
      const k = { el: b, lg, w, codes, name, ch, row: r, x, i: keys.length, short: SHORT[lg] ?? (lg || 'Space') };
      b._k = k;
      keys.push(k);
      codes.forEach(c => byCode.set(c, k));
      x += w;
    });
    plate.appendChild(rowEl);
  });
  const keyForChar = (c) => {
    if (!c) return null;
    const low = c.toLowerCase();
    if (/[a-z]/.test(low) && low.length === 1) return byCode.get('Key' + low.toUpperCase());
    if (/[0-9]/.test(c)) return byCode.get('Digit' + c);
    return CHAR_CODE[c] ? byCode.get(CHAR_CODE[c]) : null;
  };

  /* ---------------- switch modes ---------------- */
  let mode = 'linear';
  const COPY = {
    linear: 'Straight down, with no bump and no click. What you hear is the cap meeting the bottom.',
    tactile: 'A small bump on the stem, felt just before the key registers. Quieter than a click, easier to feel.',
    clicky: 'A separate collar snaps down at that bump, so you hear the key register as well as feel it.'
  };

  /* ---------------- sound ---------------- */
  const audio = (() => {
    let ac = null, bus = null, noise = null, on = true;
    const SW = {
      linear: { body: 170, bodyG: .5, cont: 1250, contG: .55, dec: .075 },
      tactile: { body: 205, bodyG: .42, cont: 1800, contG: .55, dec: .065, bump: true },
      clicky: { body: 235, bodyG: .34, cont: 2300, contG: .45, dec: .055, click: true }
    };
    function init() {
      if (ac) { if (ac.state === 'suspended') ac.resume(); return true; }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ac = new AC();
      const comp = ac.createDynamicsCompressor();
      comp.threshold.value = -16; comp.ratio.value = 4; comp.attack.value = .002; comp.release.value = .08;
      const master = ac.createGain(); master.gain.value = .8;
      bus = ac.createGain();
      bus.connect(comp); comp.connect(master); master.connect(ac.destination);
      const len = Math.floor(ac.sampleRate * .6);
      noise = ac.createBuffer(1, len, ac.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      return true;
    }
    function n(t, type, f, q, g, dec, att = .0012) {
      const s = ac.createBufferSource(); s.buffer = noise;
      const fl = ac.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
      const e = ac.createGain();
      e.gain.setValueAtTime(.0001, t);
      e.gain.exponentialRampToValueAtTime(Math.max(.0002, g), t + att);
      e.gain.exponentialRampToValueAtTime(.0001, t + att + dec);
      s.connect(fl); fl.connect(e); e.connect(bus);
      s.start(t, Math.random() * .4); s.stop(t + att + dec + .03);
    }
    function o(t, type, f0, f1, pd, g, dec) {
      const s = ac.createOscillator(), e = ac.createGain(); s.type = type;
      s.frequency.setValueAtTime(f0, t); s.frequency.exponentialRampToValueAtTime(f1, t + pd);
      e.gain.setValueAtTime(.0001, t);
      e.gain.exponentialRampToValueAtTime(Math.max(.0002, g), t + .0015);
      e.gain.exponentialRampToValueAtTime(.0001, t + dec);
      s.connect(e); e.connect(bus); s.start(t); s.stop(t + dec + .03);
    }
    const ready = () => on && init();
    const vary = () => 1 + (Math.random() - .5) * .12;
    const pitchFor = (w) => (1 + (Math.random() - .5) * .05) / Math.pow(Math.min(w, 6.25), .3);
    return {
      get on() { return on; },
      set on(v) { on = v; },
      unlock() { if (on) init(); },
      down(w = 1) {
        if (!ready()) return;
        const p = SW[mode], t = ac.currentTime + .002, v = vary(), pf = pitchFor(w);
        let tb = t;
        if (p.bump) { n(t, 'bandpass', 1100 * pf, 1.6, .16 * v, .014); tb = t + .014; }
        if (p.click) { n(t, 'highpass', 4300, .9, .5 * v, .006); n(t + .004, 'bandpass', 5400, 3, .32 * v, .012); tb = t + .011; }
        o(tb, 'sine', p.body * pf * 1.45, p.body * pf, .022, p.bodyG * v, p.dec + (w > 2 ? .05 : 0));
        n(tb, 'bandpass', p.cont * pf, 1.1, p.contG * v, .032);
        n(tb, 'lowpass', 650 * pf, .7, .22 * v, .045);
        if (w > 2) n(tb + .009, 'bandpass', 760, 5, .1 * v, .07);
      },
      up(w = 1) {
        if (!ready()) return;
        const p = SW[mode], t = ac.currentTime + .002, v = vary(), pf = pitchFor(w);
        n(t, 'bandpass', 2900 * pf, 1.3, .13 * v, .016);
        if (p.click) n(t, 'highpass', 4700, 1, .32 * v, .006);
        o(t, 'triangle', p.body * 2.3 * pf, p.body * 2 * pf, .01, .06 * v, .03);
      },
      tick(kind) {
        if (!ready()) return;
        const t = ac.currentTime + .002, v = vary();
        if (kind === 'bump') n(t, 'bandpass', 1100, 1.6, .2 * v, .016);
        if (kind === 'click') { n(t, 'highpass', 4300, .9, .55 * v, .006); n(t + .004, 'bandpass', 5400, 3, .34 * v, .012); }
        if (kind === 'bottom') { const p = SW[mode]; o(t, 'sine', p.body * 1.45, p.body, .022, p.bodyG * v, p.dec); n(t, 'bandpass', p.cont, 1.1, p.contG * v, .032); n(t, 'lowpass', 650, .7, .22 * v, .045); }
        if (kind === 'top') { n(t, 'bandpass', 2900, 1.3, .16 * v, .016); o(t, 'triangle', 470, 410, .01, .07, .03); }
      }
    };
  })();

  const sndBtn = $('#snd');
  sndBtn.addEventListener('click', () => {
    audio.on = !audio.on;
    sndBtn.setAttribute('aria-pressed', String(audio.on));
    $('.snd-l', sndBtn).textContent = audio.on ? 'Sound on' : 'Sound off';
    if (audio.on) audio.unlock();
    stopIdle();
  });

  /* ---------------- the typed line ---------------- */
  const proof = $('#proof');
  const typer = $('#typer');
  let text = '';
  let drawQueued = false;
  function drawProof() {
    drawQueued = false;
    if (!text) { proof.innerHTML = '<span class="ph">Start typing. Your words land here.</span>'; return; }
    const tail = text.slice(-90);
    const cut = Math.max(0, tail.length - 34);
    proof.innerHTML = '';
    const a = document.createElement('span'); a.className = 'ch old'; a.textContent = tail.slice(0, cut);
    const b = document.createElement('span'); b.className = 'ch'; b.textContent = tail.slice(cut);
    proof.append(a, b);
  }
  const queueProof = () => { if (!drawQueued) { drawQueued = true; requestAnimationFrame(drawProof); } };
  function edit(k, key) {
    if (key === 'Backspace' || (k && k.lg === 'Back')) text = text.slice(0, -1);
    else if (key === 'Escape' || (k && k.lg === 'Esc' && !key)) text = '';
    else if (key === 'Enter' || (k && k.lg === 'Enter' && !key)) text += '  ';
    else if (key && key.length === 1) text += key;
    else if (!key && k && k.ch) text += k.ch;
    else return;
    if (text.length > 400) text = text.slice(-200);
    queueProof();
  }

  /* ---------------- readouts and session data ---------------- */
  const S = { strokes: 0, start: 0, recent: [], counts: new Map(), touched: new Set(), buckets: [], wpm: [], best: 0, last: 0 };
  const rLast = $('#r-last'), rN = $('#r-n'), rW = $('#r-wpm');
  let readQueued = false, lastKey = null;
  function currentWpm(now) {
    while (S.recent.length && now - S.recent[0] > 10000) S.recent.shift();
    if (!S.recent.length) return 0;
    const span = Math.max(4000, Math.min(10000, now - S.start));
    return Math.round((S.recent.length / 5) / (span / 60000));
  }
  function drawReads() {
    readQueued = false;
    if (lastKey) rLast.textContent = lastKey.name;
    rN.textContent = S.strokes.toLocaleString('en-US');
    rW.textContent = String(currentWpm(performance.now()));
  }
  function record(k) {
    const now = performance.now();
    if (!S.start) S.start = now;
    S.strokes++; S.last = now;
    if (k.ch) S.recent.push(now);
    S.counts.set(k, (S.counts.get(k) || 0) + 1);
    S.touched.add(k);
    const b = Math.floor((now - S.start) / 2000);
    S.buckets[b] = (S.buckets[b] || 0) + 1;
    lastKey = k;
    if (!readQueued) { readQueued = true; requestAnimationFrame(drawReads); }
    band.live();
  }
  setInterval(() => {
    if (!S.start) return;
    const now = performance.now();
    if (now - S.last > 10500) { if (rW.textContent !== '0') rW.textContent = '0'; return; }
    const w = currentWpm(now);
    S.wpm.push(w);
    if (S.wpm.length > 120) S.wpm.shift();
    if (now - S.start > 4000) S.best = Math.max(S.best, w);
    rW.textContent = String(w);
  }, 1000);

  /* ---------------- press and release ---------------- */
  const held = new Set();
  const footKeys = new Map($$('.fk').map(el => [el.dataset.code, el]));
  function footDown(k, on) {
    k.codes.forEach(c => { const el = footKeys.get(c); if (el) el.classList.toggle('down', on); });
  }
  function press(k, opts = {}) {
    if (held.has(k)) return;
    held.add(k);
    stopIdle();
    k.el.classList.add('down');
    audio.down(k.w);
    footDown(k, true);
    if (opts.record !== false) record(k);
    if (opts.type) edit(k);
  }
  function release(k) {
    if (!held.has(k)) return;
    held.delete(k);
    k.el.classList.remove('down');
    audio.up(k.w);
    footDown(k, false);
  }
  function releaseAll() { [...held].forEach(release); }
  function tap(k, ms = 90, type = false, rec = true) { press(k, { type, record: rec }); setTimeout(() => release(k), ms); }
  addEventListener('blur', releaseAll);
  document.addEventListener('visibilitychange', () => { if (document.hidden) releaseAll(); });

  /* keyboard */
  let heroVisible = true;
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }, { threshold: .25 }).observe($('#play'));
  const lastByKey = new Map();
  addEventListener('keydown', (e) => {
    const t = e.target;
    const inTyper = t === typer;
    if (!inTyper && t.closest && t.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (t.closest && t.closest('#cut-key')) return;
    const isMod = /^(Meta|Control|Alt|Shift|OS)/.test(e.code);
    if ((e.metaKey || e.ctrlKey) && !isMod) return;
    const onControl = t.closest && t.closest('button, a, [role="slider"], [role="radio"]') && !t.closest('#keys');
    if (onControl && (e.code === 'Space' || e.code === 'Enter')) return;
    let k = byCode.get(e.code);
    if (!k && e.key && e.key.length === 1) k = keyForChar(e.key);
    if (k && !e.repeat) { press(k); lastByKey.set(k, performance.now()); }
    const editable = e.key && (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Escape' || e.key === 'Enter');
    if (editable && (!e.repeat || e.key === 'Backspace' || e.key.length === 1)) edit(null, e.key);
    if (inTyper && editable) { e.preventDefault(); return; }
    if (k && heroVisible && e.code !== 'Tab' && !isMod) e.preventDefault();
  });
  addEventListener('keyup', (e) => {
    let k = byCode.get(e.code);
    if (!k && e.key && e.key.length === 1) k = keyForChar(e.key);
    if (k) release(k);
    if (e.key === 'Meta') releaseAll();
  });
  /* phone keyboards that send only input events */
  typer.addEventListener('input', (e) => {
    const now = performance.now();
    if (e.inputType === 'deleteContentBackward') {
      const k = byCode.get('Backspace');
      if (now - (lastByKey.get(k) || 0) > 60) { tap(k); edit(null, 'Backspace'); }
    } else if (e.data) {
      for (const c of e.data) {
        const k = keyForChar(c);
        if (k && now - (lastByKey.get(k) || 0) > 60) tap(k, 80);
        edit(null, c);
      }
    }
    typer.value = ' ';
    typer.setSelectionRange(1, 1);
  });

  /* pointer and touch: tap, multi-touch, slide to roll */
  const ptr = new Map();
  plate.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('.key');
    if (!el) return;
    e.preventDefault();
    try { plate.setPointerCapture(e.pointerId); } catch (_) { /* capture is optional */ }
    ptr.set(e.pointerId, el._k);
    press(el._k, { type: true });
  });
  plate.addEventListener('pointermove', (e) => {
    if (!ptr.has(e.pointerId)) return;
    const hit = document.elementFromPoint(e.clientX, e.clientY);
    const el = hit && hit.closest('.key');
    const k = el ? el._k : null;
    const prev = ptr.get(e.pointerId);
    if (k !== prev) {
      if (prev) release(prev);
      if (k) press(k, { type: true });
      ptr.set(e.pointerId, k);
    }
  });
  const endPtr = (e) => { const k = ptr.get(e.pointerId); if (k) release(k); ptr.delete(e.pointerId); };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => plate.addEventListener(ev, endPtr));
  plate.addEventListener('click', (e) => {
    if (e.detail !== 0) return;
    const el = e.target.closest('.key');
    if (el) tap(el._k, 80, true);
  });

  /* ---------------- idle invitation: K E Y - 0 1 ---------------- */
  let idleTimer = null;
  function startIdle() {
    if (reduce) return;
    const seq = ['KeyK', 'KeyE', 'KeyY', 'Minus', 'Digit0', 'Digit1', null, null, null];
    let i = 0;
    idleTimer = setInterval(() => {
      const code = seq[i++ % seq.length];
      if (!code) return;
      const k = byCode.get(code);
      k.el.classList.add('dip');
      setTimeout(() => k.el.classList.remove('dip'), 150);
    }, 420);
  }
  function stopIdle() {
    if (!idleTimer) return;
    clearInterval(idleTimer); idleTimer = null;
    $$('.key.dip').forEach(el => el.classList.remove('dip'));
  }
  startIdle();

  /* ---------------- mode selectors (hero and cut stay in sync) ---------------- */
  const cutSec = $('#switch');
  function setMode(m, from) {
    mode = m;
    boardEl.dataset.sw = m;
    cutSec.dataset.sw = m;
    $('#sw-copy').textContent = COPY[m];
    $$('.seg').forEach(g => $$('[role="radio"]', g).forEach(b => {
      const on = b.dataset.sw === m;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    }));
    stopIdle();
    if (from === 'hero' && !held.size) {
      ['KeyK', 'KeyE', 'KeyY', 'Digit0', 'Digit1'].forEach((c, i) => setTimeout(() => tap(byCode.get(c), 70, false, false), i * 110));
    }
    if (from === 'cut') cut.demo();
  }
  $$('.seg').forEach(g => {
    const radios = $$('[role="radio"]', g);
    radios.forEach((b, i) => {
      b.addEventListener('click', () => setMode(b.dataset.sw, g.dataset.group));
      b.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        e.preventDefault(); e.stopPropagation();
        const step = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : -1;
        const n = radios[(i + step + radios.length) % radios.length];
        setMode(n.dataset.sw, g.dataset.group); n.focus();
      });
    });
  });

  /* ---------------- the cut-open switch ---------------- */
  const cut = (() => {
    const svg = $('#cut-key');
    const move = $('#cut-move'), jacket = $('#cut-jacket'), spring = $('#cut-spring');
    const leaf = $('#cut-leaf'), spark = $('#cut-spark');
    const dOut = $('#c-depth'), sOut = $('#c-state');
    const TRAVEL = 48, ACT = .5, BUMP = .36;
    let depth = 0, prev = 0, raf = 0, dragging = false, startY = 0, startD = 0, snapped = false;

    function springPath(topY) {
      const bottom = 420, coils = 9, x0 = 196, x1 = 224;
      const h = (bottom - topY) / coils;
      let d = `M210 ${topY.toFixed(1)}`;
      for (let i = 0; i < coils; i++) {
        d += ` L${i % 2 ? x0 : x1} ${(topY + h * (i + .5)).toFixed(1)}`;
      }
      return d + ` L210 ${bottom}`;
    }
    function render() {
      const y = depth * TRAVEL;
      move.setAttribute('transform', `translate(0 ${y.toFixed(2)})`);
      const jy = mode === 'clicky' && depth > .4 ? 9 : 0;
      jacket.setAttribute('transform', `translate(0 ${jy})`);
      spring.setAttribute('d', springPath(350 + y));
      const bend = clamp((depth - .3) / (ACT - .3), 0, 1);
      leaf.setAttribute('d', `M262 420 L${(262 + bend * 12).toFixed(1)} 340`);
      const on = depth >= ACT;
      spark.setAttribute('opacity', on ? '.9' : '0');
      dOut.textContent = Math.round(depth * 100) + '%';
      sOut.textContent = on ? 'Closed' : 'Open';
      sOut.classList.toggle('on', on);
      svg.setAttribute('aria-valuenow', String(Math.round(depth * 100)));
      svg.setAttribute('aria-valuetext', `${Math.round(depth * 100)} percent down, ${on ? 'registered' : 'not registered'}`);
    }
    function sounds() {
      const d = depth, p = prev;
      if (mode === 'tactile' && p < BUMP && d >= BUMP) audio.tick('bump');
      if (mode === 'clicky' && p < .4 && d >= .4) { audio.tick('click'); snapped = true; }
      if (mode === 'clicky' && snapped && p > .3 && d <= .3) { audio.tick('click'); snapped = false; }
      if (p < .97 && d >= .97) audio.tick('bottom');
      if (p > .04 && d <= .04) audio.tick('top');
      prev = d;
    }
    function set(d) { depth = clamp(d, 0, 1); sounds(); render(); }
    function animateTo(target, ms, then) {
      cancelAnimationFrame(raf);
      if (reduce) { set(target); then && then(); return; }
      const from = depth, t0 = performance.now();
      const ease = target > from ? (p) => p * p : (p) => 1 - Math.pow(1 - p, 3) + Math.sin(p * Math.PI) * .06;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / ms);
        set(from + (target - from) * ease(p));
        if (p < 1) raf = requestAnimationFrame(step); else { set(target); then && then(); }
      };
      raf = requestAnimationFrame(step);
    }
    const scale = () => svg.getBoundingClientRect().height / 480;
    svg.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      audio.unlock();
      dragging = true; startY = e.clientY; startD = depth;
      cancelAnimationFrame(raf);
      try { svg.setPointerCapture(e.pointerId); } catch (_) { /* optional */ }
    });
    svg.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      set(startD + (e.clientY - startY) / (TRAVEL * 2.4 * scale()));
    });
    const end = () => { if (!dragging) return; dragging = false; animateTo(0, mode === 'clicky' ? 110 : 160); };
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => svg.addEventListener(ev, end));
    svg.addEventListener('keydown', (e) => {
      const map = { ArrowDown: .05, ArrowRight: .05, ArrowUp: -.05, ArrowLeft: -.05, PageDown: .25, PageUp: -.25 };
      if (map[e.key] !== undefined) { e.preventDefault(); cancelAnimationFrame(raf); set(depth + map[e.key]); }
      else if (e.key === 'Home') { e.preventDefault(); set(0); }
      else if (e.key === 'End') { e.preventDefault(); set(1); }
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!e.repeat) demo(); }
    });
    function demo() { audio.unlock(); animateTo(1, 260, () => setTimeout(() => animateTo(0, 180), 120)); }
    render();
    return { demo, render };
  })();
  cutSec.dataset.sw = mode;

  /* ---------------- session band ---------------- */
  const band = (() => {
    const el = $('#session');
    const fmt = (v) => Math.round(v).toLocaleString('en-US');
    const cntN = $('#s-n'), cntW = $('#s-w'), cntU = $('#s-u');
    let raf = 0, ran = false, visible = false, liveQueued = false;

    function linePath(vals, w = 200, h = 40) {
      if (vals.length < 2) return { d: `M0 ${h - 2}H${w}`, x: w, y: h - 2 };
      const max = Math.max(...vals, 1);
      const pts = vals.map((v, i) => [i / (vals.length - 1) * w, h - 2 - (v / max) * (h - 6)]);
      return { d: 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L'), x: pts[pts.length - 1][0], y: pts[pts.length - 1][1] };
    }
    function drawCharts() {
      const b = [];
      for (let i = 0; i < S.buckets.length; i++) b.push(S.buckets[i] || 0);
      const ln = linePath(b.slice(-30));
      $('#sp-n').setAttribute('d', ln.d); $('#sp-n-dot').setAttribute('cx', ln.x); $('#sp-n-dot').setAttribute('cy', ln.y);
      const lw = linePath(S.wpm.slice(-40));
      $('#sp-w').setAttribute('d', lw.d); $('#sp-w-dot').setAttribute('cx', lw.x); $('#sp-w-dot').setAttribute('cy', lw.y);

      const top = [...S.counts.entries()].sort((a, c) => c[1] - a[1]).slice(0, 8);
      const max = top.length ? top[0][1] : 1;
      let bars = '<rect class="base" x="0" y="39" width="200" height="1"/>';
      top.forEach(([, n], i) => {
        const h = Math.max(2, n / max * 34);
        bars += `<rect class="sbar${i === 0 ? ' hot' : ''}" style="--i:${i}" x="${i * 25 + 2}" y="${(39 - h).toFixed(1)}" width="18" height="${h.toFixed(1)}"/>`;
      });
      $('#sp-m').innerHTML = bars;

      const u = 200 / 16;
      $('#sp-u').innerHTML = keys.map(k =>
        `<rect class="${S.touched.has(k) ? 'on' : ''}" x="${(k.x * u + 1).toFixed(1)}" y="${(k.row * 12.6 + 1).toFixed(1)}" width="${(k.w * u - 2).toFixed(1)}" height="10.6"/>`).join('');
    }
    function values() {
      const top = [...S.counts.entries()].sort((a, c) => c[1] - a[1])[0];
      return { n: S.strokes, w: S.best || (S.wpm.length ? Math.max(...S.wpm) : 0), u: keys.length - S.touched.size, top };
    }
    function words(v) {
      $('#s-n-sr').textContent = `${fmt(v.n)} keystrokes`;
      $('#s-w-sr').textContent = `${v.w} words per minute`;
      $('#s-u-sr').textContent = `${v.u} of 68 keys untouched`;
      if (v.top) {
        $('#s-m').textContent = v.top[0].short;
        $('#s-m-sr').textContent = `${v.top[0].name}, pressed ${v.top[1]} times`;
        $('#s-m-desc').textContent = `${v.top[0].name}, pressed ${v.top[1].toLocaleString('en-US')} time${v.top[1] === 1 ? '' : 's'}.`;
      }
      el.classList.toggle('empty', v.n === 0);
      $('#band-note').textContent = v.n === 0
        ? 'Nothing typed yet. Go back up, type a line, and these fill in.'
        : 'Every number here comes from the keys you pressed on this page.';
    }
    function finish(v) {
      cntN.textContent = fmt(v.n); cntW.textContent = fmt(v.w); cntU.textContent = fmt(v.u);
    }
    function run() {
      cancelAnimationFrame(raf);
      const v = values();
      drawCharts(); words(v);
      if (reduce) { el.classList.add('run'); finish(v); ran = true; return; }
      el.classList.remove('run');
      cntN.textContent = '0'; cntW.textContent = '0'; cntU.textContent = '0';
      void el.offsetWidth;
      el.classList.add('run');
      const t0 = performance.now();
      const ease = (p) => 1 - Math.pow(1 - p, 3);
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / 1200), e = ease(p);
        cntN.textContent = fmt(v.n * e); cntW.textContent = fmt(v.w * e); cntU.textContent = fmt(v.u * e);
        if (p < 1) raf = requestAnimationFrame(tick); else ran = true;
      };
      raf = requestAnimationFrame(tick);
    }
    function live() {
      if (!ran || !visible || liveQueued) return;
      liveQueued = true;
      requestAnimationFrame(() => { liveQueued = false; const v = values(); drawCharts(); words(v); finish(v); });
    }
    const io = new IntersectionObserver((es) => {
      es.forEach(e => {
        visible = e.isIntersecting;
        if (e.isIntersecting && !ran && e.intersectionRatio >= .35) run();
      });
    }, { threshold: [0, .35] });
    io.observe(el);
    $('#replay-count').addEventListener('click', run);
    drawCharts();
    return { live };
  })();

  /* back to the keyboard, with focus on it */
  $$('#foot-back, #band-back').forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault();
    $('#play').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    setTimeout(() => plate.focus({ preventScroll: true }), reduce ? 0 : 500);
  }));

  /* ---------------- footer keycaps rise ---------------- */
  const foot = $('#foot');
  let footQueued = false;
  function footProgress() {
    footQueued = false;
    const r = foot.getBoundingClientRect(), vh = innerHeight;
    const p = clamp((vh - r.top) / Math.max(1, Math.min(r.height, vh)), 0, 1);
    foot.style.setProperty('--p', p.toFixed(3));
  }
  addEventListener('scroll', () => { if (!footQueued) { footQueued = true; requestAnimationFrame(footProgress); } }, { passive: true });
  addEventListener('resize', footProgress);
  footProgress();
  $('#replay-rise').addEventListener('click', () => {
    const top = foot.getBoundingClientRect().top + scrollY;
    if (reduce) { scrollTo(0, document.documentElement.scrollHeight); return; }
    document.documentElement.style.scrollBehavior = 'auto';
    scrollTo(0, top - innerHeight + 80);
    footProgress();
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = '';
      scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }, 420);
  });
})();
