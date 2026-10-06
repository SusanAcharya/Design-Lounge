/* KEY-01 · Grid launch · Designed using Design Lounge (https://www.designlounge.live) */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const phoneMq = matchMedia('(max-width: 640px)');
  const midMq = matchMedia('(max-width: 1023px)');
  const SVGNS = 'http://www.w3.org/2000/svg';

  const plate = $('#plate');

  /* ---------- Sound: synthesised, off until asked ---------- */
  let ac = null, master = null, noise = null, soundOn = false;
  function initAudio() {
    if (ac) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ac = new AC();
    master = ac.createGain();
    master.gain.value = 0.55;
    master.connect(ac.destination);
    noise = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.08), ac.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
  }
  function click(kind, up) {
    if (!soundOn || !ac) return;
    const t = ac.currentTime;
    const big = kind === 'space' || kind === 'wide';
    const src = ac.createBufferSource();
    src.buffer = noise;
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = (up ? 4200 : big ? 1700 : 2900) + Math.random() * 500;
    bp.Q.value = up ? 2.2 : 1.1;
    const g = ac.createGain();
    const peak = up ? 0.18 : 0.5;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (up ? 0.03 : 0.05));
    src.connect(bp).connect(g).connect(master);
    src.start(t);
    src.stop(t + 0.08);
    if (up) return;
    const o = ac.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(big ? 150 : 230, t);
    o.frequency.exponentialRampToValueAtTime(55, t + 0.06);
    const og = ac.createGain();
    og.gain.setValueAtTime(0.0001, t);
    og.gain.exponentialRampToValueAtTime(big ? 0.4 : 0.22, t + 0.003);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    o.connect(og).connect(master);
    o.start(t);
    o.stop(t + 0.09);
  }
  const soundBtn = $('#soundBtn');
  const footSound = $('#footSound');
  function setSound(on) {
    soundOn = on;
    if (on) { initAudio(); if (ac && ac.state === 'suspended') ac.resume(); }
    soundBtn.setAttribute('aria-pressed', String(on));
    $('.snd-label', soundBtn).textContent = on ? 'Sound on' : 'Sound off';
    footSound.textContent = on ? 'Turn sound off' : 'Turn sound on';
    if (on) click('alpha');
  }
  const backToBoard = e => { if (e.detail > 0) plate.focus({ preventScroll: true }); };
  soundBtn.addEventListener('click', e => { setSound(!soundOn); backToBoard(e); });
  footSound.addEventListener('click', () => setSound(!soundOn));

  /* ---------- Grid columns ---------- */
  const colsEl = $('.cols');
  let cols = [];
  function colCount() { return phoneMq.matches ? 4 : midMq.matches ? 6 : 12; }
  function buildCols() {
    const n = colCount();
    colsEl.innerHTML = '';
    cols = [];
    for (let i = 0; i < n; i++) {
      const c = document.createElement('div');
      c.className = 'col';
      const s = document.createElement('span');
      s.textContent = String(i + 1).padStart(2, '0');
      c.appendChild(s);
      colsEl.appendChild(c);
      cols.push(c);
    }
  }

  /* ---------- Wordmark: six cells, the last six keys ---------- */
  const BASE = 'KEY-01';
  const cells = $$('.word .cell');
  let hist = '';
  let shown = BASE;
  function cellForCol(c) {
    const n = cols.length;
    if (c < 0) return -1;
    if (n === 12) return c >> 1;
    if (n === 6) return c;
    return -1;
  }
  function rise(b) {
    if (reduced.matches) return;
    b.classList.remove('in');
    void b.offsetWidth;
    b.classList.add('in');
  }
  function renderWord(dir) {
    const next = (BASE + hist).slice(-6);
    cells.forEach((cell, i) => {
      const ch = next[i];
      const b = $('b', cell);
      b.textContent = ch === ' ' ? '\u00a0' : ch;
      cell.classList.toggle('blank', ch === ' ');
    });
    if (dir === 'add') rise($('b', cells[5]));
    if (dir === 'del' && next !== shown) rise($('b', cells[0]));
    shown = next;
    $('#name').setAttribute('aria-label', next.trim() || BASE);
  }
  function replay() {
    hist = '';
    renderWord();
    cells.forEach(c => $('b', c).classList.remove('in'));
    document.body.classList.remove('play');
    void document.body.offsetWidth;
    document.body.classList.add('play');
  }
  $('#resetBtn').addEventListener('click', e => { replay(); if (e.detail > 0) plate.focus({ preventScroll: true }); });
  $('#footReset').addEventListener('click', () => { replay(); });

  /* ---------- The keyboard ---------- */
  const A = (code, label, w, kind, ch, name) => ({ code, label, w: w || 1, kind: kind || '', ch, name });
  const letter = c => A('Key' + c, c, 1, 'alpha', c, c);
  const digit = d => A('Digit' + d, d, 1, 'alpha', d, d);
  const FULL = [
    [A('Escape', 'esc', 1, 'esc', null, 'Escape'), ...'1234567890'.split('').map(digit), A('Minus', '-', 1, 'alpha', '-', 'Minus'), A('Equal', '=', 1, 'alpha', '=', 'Equal'), A('Backspace', 'delete', 2, 'mod wide', null, 'Delete')],
    [A('Tab', 'tab', 1.5, 'mod', null, 'Tab'), ...'QWERTYUIOP'.split('').map(letter), A('BracketLeft', '[', 1, 'alpha', '[', 'Bracket left'), A('BracketRight', ']', 1, 'alpha', ']', 'Bracket right'), A('Backslash', '\\', 1.5, 'mod', '\\', 'Backslash')],
    [A('CapsLock', 'caps', 1.75, 'mod', null, 'Caps Lock'), ...'ASDFGHJKL'.split('').map(letter), A('Semicolon', ';', 1, 'alpha', ';', 'Semicolon'), A('Quote', "'", 1, 'alpha', "'", 'Quote'), A('Enter', 'return', 2.25, 'ent wide', null, 'Return')],
    [A('ShiftLeft', 'shift', 2.25, 'mod wide', null, 'Shift left'), ...'ZXCVBNM'.split('').map(letter), A('Comma', ',', 1, 'alpha', ',', 'Comma'), A('Period', '.', 1, 'alpha', '.', 'Period'), A('Slash', '/', 1, 'alpha', '/', 'Slash'), A('ShiftRight', 'shift', 2.75, 'mod wide', null, 'Shift right')],
    [A('ControlLeft', 'ctrl', 1.25, 'mod', null, 'Control left'), A('MetaLeft', 'cmd', 1.25, 'mod', null, 'Command left'), A('AltLeft', 'opt', 1.25, 'mod', null, 'Option left'), A('Space', '', 6.25, 'mod space', ' ', 'Space'), A('AltRight', 'opt', 1.25, 'mod', null, 'Option right'), A('MetaRight', 'cmd', 1.25, 'mod', null, 'Command right'), A('ContextMenu', 'menu', 1.25, 'mod', null, 'Menu'), A('ControlRight', 'ctrl', 1.25, 'mod', null, 'Control right')]
  ];
  const COMPACT = [
    'QWERTYUIOP'.split('').map(letter),
    [...'ASDFGHJKL'.split('').map(letter), A('Minus', '-', 1, 'alpha', '-', 'Minus')],
    [...'ZXCVBNM'.split('').map(letter), digit('0'), digit('1'), A('Backspace', 'del', 1, 'mod', null, 'Delete')],
    [A('Space', 'space', 7, 'mod space', ' ', 'Space'), A('Enter', 'return', 3, 'ent wide', null, 'Return')]
  ];
  let keyEls = new Map();
  function buildBoard() {
    const layout = phoneMq.matches ? COMPACT : FULL;
    const units = phoneMq.matches ? 10 : 15;
    plate.innerHTML = '';
    keyEls = new Map();
    layout.forEach(row => {
      const r = document.createElement('div');
      r.className = 'krow';
      r.style.setProperty('--qcols', units * 4);
      row.forEach(k => {
        const b = document.createElement('button');
        b.type = 'button';
        b.tabIndex = -1;
        b.className = 'key ' + k.kind + (k.code === 'KeyF' || k.code === 'KeyJ' ? ' home' : '');
        b.style.setProperty('--w', Math.round(k.w * 4));
        b.style.setProperty('--units', units);
        b.setAttribute('aria-label', k.name);
        b.dataset.code = k.code;
        const cap = document.createElement('span');
        cap.className = 'cap';
        const lg = document.createElement('span');
        lg.className = 'lg';
        lg.textContent = k.label;
        cap.appendChild(lg);
        b.appendChild(cap);
        b._k = k;
        r.appendChild(b);
        keyEls.set(k.code, b);
      });
      plate.appendChild(r);
    });
  }

  const lastKey = $('#lastKey');
  lastKey.classList.add('idle');
  let hitTimer = null;
  function flashColumn(el) {
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2;
    let hit = -1;
    cols.forEach((c, i) => { const cr = c.getBoundingClientRect(); if (x >= cr.left - 8 && x <= cr.right + 8) hit = i; });
    cols.forEach((c, i) => c.classList.toggle('hit', i === hit));
    const ci = cellForCol(hit);
    cells.forEach((c, i) => c.classList.toggle('hit', i === ci));
    clearTimeout(hitTimer);
    hitTimer = setTimeout(() => {
      cols.forEach(c => c.classList.remove('hit'));
      cells.forEach(c => c.classList.remove('hit'));
    }, 240);
  }
  function type(k, chOverride) {
    if (k.code === 'Backspace') { if (hist.length) { hist = hist.slice(0, -1); renderWord('del'); } return; }
    if (k.code === 'Enter') { replay(); return; }
    const ch = chOverride != null ? chOverride : k.ch;
    if (ch == null) return;
    hist = (hist + ch.toUpperCase()).slice(-24);
    renderWord('add');
  }
  const held = new Set();
  function press(el, chOverride, fromKeyboard) {
    if (!el || held.has(el)) return;
    held.add(el);
    el.classList.add('down');
    const k = el._k;
    click(k.kind.includes('space') ? 'space' : k.kind.includes('wide') ? 'wide' : 'alpha');
    flashColumn(el);
    lastKey.classList.remove('idle');
    lastKey.textContent = k.ch && k.ch !== ' ' ? k.ch.toUpperCase() : k.name.replace(/ (left|right)$/, '');
    if (!fromKeyboard || chOverride !== false) type(k, chOverride === false ? null : chOverride);
  }
  function release(el) {
    if (!el || !held.has(el)) return;
    held.delete(el);
    el.classList.remove('down');
    click('alpha', true);
  }
  function releaseAll() { Array.from(held).forEach(release); }

  /* Pointer and touch, including slide to play */
  let dragKey = null, dragging = false;
  plate.addEventListener('pointerdown', e => {
    const el = e.target.closest('.key');
    if (!el) return;
    e.preventDefault();
    dragging = true;
    try { plate.setPointerCapture(e.pointerId); } catch (_) {}
    dragKey = el;
    press(el);
  });
  plate.addEventListener('pointermove', e => {
    if (!dragging) return;
    const under = document.elementFromPoint(e.clientX, e.clientY);
    const el = under && under.closest ? under.closest('.key') : null;
    if (el !== dragKey) {
      release(dragKey);
      dragKey = el;
      if (el) press(el);
    }
  });
  const endDrag = () => { dragging = false; release(dragKey); dragKey = null; };
  plate.addEventListener('pointerup', endDrag);
  plate.addEventListener('pointercancel', endDrag);
  plate.addEventListener('lostpointercapture', endDrag);

  /* Physical keys, by position */
  let heroVisible = true;
  new IntersectionObserver(es => { heroVisible = es[0].isIntersecting; }, { threshold: 0.25 }).observe($('#board'));
  const capsLed = $('#capsLed');
  function isField(t) { return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable); }
  addEventListener('keydown', e => {
    if (isField(e.target)) return;
    if (e.getModifierState) capsLed.classList.toggle('on', e.getModifierState('CapsLock'));
    const el = keyEls.get(e.code);
    if (!el) return;
    const onControl = e.target.closest && e.target.closest('button, a') && e.target !== plate;
    if (onControl && (e.code === 'Space' || e.code === 'Enter')) return;
    if (!heroVisible && document.activeElement !== plate) return;
    if (e.code !== 'Tab' && ['Space', 'Backspace', 'Quote', 'Slash', 'Enter'].includes(e.code)) e.preventDefault();
    if (e.repeat) return;
    const shortcut = e.metaKey || e.ctrlKey;
    let ch = null;
    if (!shortcut && e.key && e.key.length === 1) ch = e.key;
    if (e.code === 'Backspace' || e.code === 'Enter') ch = undefined;
    press(el, ch === null ? false : ch, true);
  });
  addEventListener('keyup', e => {
    if (e.getModifierState) capsLed.classList.toggle('on', e.getModifierState('CapsLock'));
    release(keyEls.get(e.code));
  });
  addEventListener('blur', releaseAll);

  /* Pointer over the grid: the column answers (brief behaviour) */
  const hero = $('.hero');
  let lastCol = -1;
  function setCol(i) {
    if (i === lastCol) return;
    lastCol = i;
    cols.forEach((c, j) => c.classList.toggle('on', j === i));
    const ci = cellForCol(i);
    cells.forEach((c, j) => c.classList.toggle('on', j === ci));
  }
  hero.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    let hit = -1;
    cols.forEach((c, i) => { const r = c.getBoundingClientRect(); if (e.clientX >= r.left && e.clientX <= r.right) hit = i; });
    setCol(hit);
  });
  hero.addEventListener('pointerleave', () => setCol(-1));

  /* ---------- Cross-section drawings for the four layers ---------- */
  function section(layer) {
    const on = n => (n === layer ? ' on' : '');
    const capInk = layer === 'cap' ? ' on-ink' : '';
    return `<svg class="xs" viewBox="0 0 600 460" role="img" aria-label="Cross-section of one key, ${layer} highlighted">
      <line x1="0" y1="430" x2="600" y2="430" class="hair"/>
      <path class="fl${on('case')}" d="M30 222 H50 V390 H550 V222 H570 V410 H30 Z"/>
      <rect class="fl" x="50" y="350" width="500" height="14"/>
      <line class="hair" x1="262" y1="340" x2="262" y2="350"/><line class="hair" x1="338" y1="340" x2="338" y2="350"/>
      <rect class="fl${on('switch')}" x="214" y="268" width="172" height="72"/>
      <g class="spring"><polyline class="ln" points="300,276 286,286 314,296 286,306 314,316 286,326 314,336 300,340"/></g>
      <line class="ln" x1="350" y1="286" x2="350" y2="334"/>
      <g class="contact"><line class="ln" x1="336" y1="334" x2="332" y2="290"/></g>
      <circle class="dot" cx="347" cy="296" r="5"/>
      <rect class="fl${on('plate')}" x="50" y="258" width="156" height="12"/>
      <rect class="fl${on('plate')}" x="394" y="258" width="156" height="12"/>
      <path class="fl${on('switch')}" d="M206 262 H394 L378 226 H222 Z"/>
      <g class="mv">
        <rect class="fl${on('switch')}" x="287" y="190" width="26" height="90"/>
        <path class="wall" d="M432 200 L410 98 L418 98 L442 200 Z"/>
        <path class="fl${on('cap')}" d="M168 200 H432 L410 98 Q300 116 190 98 Z"/>
        <text class="lgd${capInk}" x="212" y="150">K</text>
      </g>
      <line class="hair" x1="456" y1="98" x2="500" y2="98"/><line class="hair" x1="456" y1="124" x2="500" y2="124"/>
      <line class="hair" x1="490" y1="98" x2="490" y2="124"/>
      <text class="tagt" x="508" y="116">travel</text>
    </svg>`;
  }
  const arts = $$('.card .art');
  arts.forEach(a => { a.innerHTML = section(a.dataset.layer); });
  function pressArt(i, hold) {
    const xs = $('svg', arts[i]);
    xs.classList.add('down');
    click('alpha');
    if (!hold) setTimeout(() => { xs.classList.remove('down'); click('alpha', true); }, 260);
  }
  $$('.press').forEach(b => b.addEventListener('click', () => pressArt(+b.dataset.press)));
  arts.forEach((a, i) => {
    a.addEventListener('pointerdown', e => { e.preventDefault(); pressArt(i, true); });
    const up = () => { const xs = $('svg', a); if (xs.classList.contains('down')) { xs.classList.remove('down'); click('alpha', true); } };
    a.addEventListener('pointerup', up);
    a.addEventListener('pointerleave', up);
    a.addEventListener('pointercancel', up);
  });

  /* ---------- Stacking cards: JS fallback without scroll-driven animation ---------- */
  const supportsTimeline = CSS.supports && CSS.supports('animation-timeline: view()');
  const stackLis = $$('.stack > li');
  if (!supportsTimeline) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = innerHeight;
      stackLis.forEach((li, k) => {
        const card = $('.card', li);
        if (k === stackLis.length - 1 || reduced.matches) { card.style.transform = ''; return; }
        let p = 0;
        for (let j = k + 1; j < stackLis.length; j++) {
          const top = stackLis[j].getBoundingClientRect().top;
          p += Math.min(1, Math.max(0, (vh - top) / vh));
        }
        const own = Math.min(1, Math.max(0, (vh - stackLis[k + 1].getBoundingClientRect().top) / vh));
        const s = 1 - (p / (stackLis.length - 1 - k)) * (stackLis.length - 1 - k) * 0.035;
        card.style.transform = `scale(${s})`;
        card.style.setProperty('--dimv', own * 0.16);
        card.style.setProperty('position', 'relative');
        card.dataset.dim = '1';
      });
    };
    const st = document.createElement('style');
    st.textContent = '.card[data-dim]::after{opacity:var(--dimv,0)}';
    document.head.appendChild(st);
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- Scroll velocity type ---------- */
  const vt = $('.vt');
  let space = 0, settle = null;
  addEventListener('scroll', () => {
    if (reduced.matches) return;
    space = Math.min(0.2, space + 0.03);
    vt.style.setProperty('--ls', space.toFixed(4) + 'em');
    clearInterval(settle);
    settle = setInterval(() => {
      space *= 0.75;
      if (space < 0.008) { space = 0; clearInterval(settle); settle = null; }
      vt.style.setProperty('--ls', space.toFixed(4) + 'em');
    }, 48);
  }, { passive: true });

  /* ---------- Waiting list band ---------- */
  const form = $('#listForm');
  const email = $('#email');
  const go = $('#goBtn');
  const status = $('#status');
  const row = $('.field-row');
  const done = $('#done');
  const fillWord = $('#fillWord');
  const stamp = $('.stamp');
  let sending = false;
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (sending) return;
    const v = email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      row.classList.add('err');
      email.setAttribute('aria-invalid', 'true');
      status.className = 'status err';
      status.textContent = v ? 'That address is missing a part. Check the @ and the dot.' : 'Add an email address first.';
      email.focus();
      return;
    }
    row.classList.remove('err');
    email.removeAttribute('aria-invalid');
    status.className = 'status';
    status.textContent = 'Adding you to the list.';
    sending = true;
    go.setAttribute('aria-disabled', 'true');
    $('.go-label', go).textContent = 'Adding';
    setTimeout(() => {
      sending = false;
      go.removeAttribute('aria-disabled');
      $('.go-label', go).textContent = 'Join the list';
      form.hidden = true;
      $('#doneAddr').textContent = v;
      done.hidden = false;
      fillWord.classList.add('filled');
      stamp.classList.add('pop');
      setTimeout(() => stamp.classList.remove('pop'), 500);
      status.textContent = 'You are on the list. ' + v + ' hears first.';
      $('#doneTitle').focus();
    }, 1100);
  });
  email.addEventListener('input', () => {
    if (row.classList.contains('err')) { row.classList.remove('err'); email.removeAttribute('aria-invalid'); status.className = 'status'; status.textContent = ''; }
  });
  $('#againBtn').addEventListener('click', () => {
    done.hidden = true;
    form.hidden = false;
    fillWord.classList.remove('filled');
    status.textContent = '';
    email.value = '';
    email.focus();
  });

  /* Ticker of keycaps */
  const run = $('#tickerRun');
  const seq = 'KEY-01 ';
  let html = '';
  for (let n = 0; n < 2; n++) for (let r = 0; r < 14; r++) for (const c of seq) {
    html += c === ' ' ? '<span class="tk gap"></span>' : `<span class="tk${c === '-' ? ' e' : ''}">${c}</span>`;
  }
  run.innerHTML = html;

  /* ---------- Footer strip: keycap ridges and a walking row of caps ---------- */
  function rng(seed) { return () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; }
  function ridge(base, wMin, wMax, hMin, hMax, seed) {
    const r = rng(seed);
    let d = `M-40 240 L-40 ${base}`;
    let x = -40;
    while (x < 1640) {
      const w = wMin + r() * (wMax - wMin);
      const h = hMin + r() * (hMax - hMin);
      const lean = w * 0.12;
      d += ` L${x.toFixed(1)} ${base} L${(x + lean).toFixed(1)} ${(base - h).toFixed(1)} Q${(x + w / 2).toFixed(1)} ${(base - h + 5).toFixed(1)} ${(x + w - lean).toFixed(1)} ${(base - h).toFixed(1)} L${(x + w).toFixed(1)} ${base}`;
      x += w + 2 + r() * 4;
    }
    d += ` L1640 ${base} L1640 240 Z`;
    return d;
  }
  const mk = (tag, attrs) => { const el = document.createElementNS(SVGNS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); return el; };
  $('#far').appendChild(mk('path', { d: ridge(180, 30, 46, 22, 46, 11), class: 'ridge-far' }));
  $('#mid').appendChild(mk('path', { d: ridge(214, 56, 84, 34, 62, 29), class: 'ridge-mid' }));
  const near = $('#near');
  near.appendChild(mk('rect', { x: -40, y: 222, width: 1680, height: 20, class: 'plain' }));
  near.appendChild(mk('line', { x1: -40, y1: 222, x2: 1640, y2: 222, class: 'plain-edge' }));
  const caravan = $('#caravan');
  'KEY-01'.split('').forEach((c, i) => {
    const pos = mk('g', { transform: `translate(${i * 36} 0)` });
    const bob = mk('g', { class: 'bob' + (i % 2 ? ' b' : '') + (c === '-' ? ' wcap-e' : '') });
    if (c === '-') bob.classList.add('wcap-e');
    bob.appendChild(mk('rect', { x: 3, y: 194, width: 28, height: 26, class: 'wcap-side' }));
    bob.appendChild(mk('rect', { x: 0, y: 188, width: 28, height: 26, class: 'wcap-top' }));
    bob.appendChild(mk('rect', { x: 0.5, y: 188.5, width: 27, height: 25, class: 'wcap-edge' }));
    const t = mk('text', { x: 5, y: 201, class: 'wcap-l' });
    t.textContent = c;
    bob.appendChild(t);
    pos.appendChild(bob);
    caravan.appendChild(pos);
  });
  const foot = $('.foot');
  const far = $('#far'), mid = $('#mid');
  let fTick = false;
  function footParallax() {
    fTick = false;
    if (reduced.matches) { far.style.transform = mid.style.transform = ''; return; }
    const r = foot.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight - r.top) / r.height));
    far.style.transform = `translateY(${((1 - p) * 40).toFixed(1)}px)`;
    mid.style.transform = `translateY(${((1 - p) * 18).toFixed(1)}px)`;
  }
  addEventListener('scroll', () => { if (!fTick) { fTick = true; requestAnimationFrame(footParallax); } }, { passive: true });
  footParallax();

  /* ---------- Entry ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); } }), { threshold: 0.2 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Build, and rebuild at breakpoints ---------- */
  const boardNote = $('#boardNote');
  function build() {
    releaseAll();
    buildCols();
    buildBoard();
    setCol(-1);
    boardNote.textContent = phoneMq.matches ? 'Tap the keys, or slide across them. Return gives the name back.' : 'Your keys press these keys by position. Return gives the name back.';
  }
  build();
  phoneMq.addEventListener('change', build);
  midMq.addEventListener('change', build);
})();
