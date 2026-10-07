/* KEY-01 launch page: a playable keyboard. No dependencies. */
(function () {
  'use strict';

  /* ---------------- layout (65%, 68 keys) ----------------
     [label, code, width, options]
     options: sub (shifted legend), fn (function-layer legend), ch (character typed),
              shift (character typed with shift), accent, small (small legend), glyph, kind */
  var ROWS = [
    [
      ['Esc', 'Escape', 1, { accent: 1, small: 1, kind: 'mod' }],
      ['1', 'Digit1', 1, { sub: '!', fn: 'F1', shift: '!' }],
      ['2', 'Digit2', 1, { sub: '@', fn: 'F2', shift: '@' }],
      ['3', 'Digit3', 1, { sub: '#', fn: 'F3', shift: '#' }],
      ['4', 'Digit4', 1, { sub: '$', fn: 'F4', shift: '$' }],
      ['5', 'Digit5', 1, { sub: '%', fn: 'F5', shift: '%' }],
      ['6', 'Digit6', 1, { sub: '^', fn: 'F6', shift: '^' }],
      ['7', 'Digit7', 1, { sub: '&', fn: 'F7', shift: '&' }],
      ['8', 'Digit8', 1, { sub: '*', fn: 'F8', shift: '*' }],
      ['9', 'Digit9', 1, { sub: '(', fn: 'F9', shift: '(' }],
      ['0', 'Digit0', 1, { sub: ')', fn: 'F10', shift: ')' }],
      ['-', 'Minus', 1, { sub: '_', fn: 'F11', shift: '_' }],
      ['=', 'Equal', 1, { sub: '+', fn: 'F12', shift: '+' }],
      ['Backspace', 'Backspace', 2, { small: 1, kind: 'back' }],
      ['Del', 'Delete', 1, { small: 1, kind: 'mod' }]
    ],
    [
      ['Tab', 'Tab', 1.5, { small: 1, kind: 'tab' }],
      ['Q', 'KeyQ', 1], ['W', 'KeyW', 1], ['E', 'KeyE', 1], ['R', 'KeyR', 1], ['T', 'KeyT', 1],
      ['Y', 'KeyY', 1], ['U', 'KeyU', 1], ['I', 'KeyI', 1], ['O', 'KeyO', 1], ['P', 'KeyP', 1],
      ['[', 'BracketLeft', 1, { sub: '{', shift: '{' }],
      [']', 'BracketRight', 1, { sub: '}', shift: '}' }],
      ['\\', 'Backslash', 1.5, { sub: '|', shift: '|' }],
      ['PgUp', 'PageUp', 1, { small: 1, kind: 'mod' }]
    ],
    [
      ['Caps', 'CapsLock', 1.75, { small: 1, kind: 'caps', led: 1 }],
      ['A', 'KeyA', 1], ['S', 'KeyS', 1], ['D', 'KeyD', 1], ['F', 'KeyF', 1, { home: 1 }], ['G', 'KeyG', 1],
      ['H', 'KeyH', 1], ['J', 'KeyJ', 1, { home: 1 }], ['K', 'KeyK', 1], ['L', 'KeyL', 1],
      [';', 'Semicolon', 1, { sub: ':', shift: ':' }],
      ["'", 'Quote', 1, { sub: '"', shift: '"' }],
      ['Enter', 'Enter', 2.25, { accent: 1, small: 1, kind: 'enter' }],
      ['PgDn', 'PageDown', 1, { small: 1, kind: 'mod' }]
    ],
    [
      ['Shift', 'ShiftLeft', 2.25, { small: 1, kind: 'shift' }],
      ['Z', 'KeyZ', 1], ['X', 'KeyX', 1], ['C', 'KeyC', 1], ['V', 'KeyV', 1], ['B', 'KeyB', 1],
      ['N', 'KeyN', 1], ['M', 'KeyM', 1],
      [',', 'Comma', 1, { sub: '<', shift: '<' }],
      ['.', 'Period', 1, { sub: '>', shift: '>' }],
      ['/', 'Slash', 1, { sub: '?', shift: '?' }],
      ['Shift', 'ShiftRight', 1.75, { small: 1, kind: 'shift' }],
      ['↑', 'ArrowUp', 1, { accent: 1, glyph: 1, kind: 'mod' }],
      ['End', 'End', 1, { small: 1, kind: 'mod' }]
    ],
    [
      ['Ctrl', 'ControlLeft', 1.25, { small: 1, kind: 'mod' }],
      ['Opt', 'AltLeft', 1.25, { small: 1, kind: 'mod' }],
      ['Cmd', 'MetaLeft', 1.25, { small: 1, kind: 'mod' }],
      ['', 'Space', 6.25, { ch: ' ', kind: 'space' }],
      ['Cmd', 'MetaRight', 1, { small: 1, kind: 'mod' }],
      ['Fn', 'Fn', 1, { small: 1, kind: 'fn' }],
      ['Ctrl', 'ControlRight', 1, { small: 1, kind: 'mod' }],
      ['←', 'ArrowLeft', 1, { accent: 1, glyph: 1, kind: 'mod' }],
      ['↓', 'ArrowDown', 1, { accent: 1, glyph: 1, kind: 'mod' }],
      ['→', 'ArrowRight', 1, { accent: 1, glyph: 1, kind: 'mod' }]
    ]
  ];

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var board = $('#board');
  var plate = $('#keys');
  var hint = $('#hint');
  var transcript = $('#transcript');
  var typedEl = $('#typed');
  var countEl = $('#count');
  var xsec = $('#xsec');
  var xsecState = $('#xsec-state');
  var xsecName = $('#xsec-name');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var state = {
    text: '',
    count: 0,
    sw: 'tactile',
    colour: 'bone',
    sound: false,
    shiftSticky: false,
    caps: false,
    fn: false,
    downCount: 0
  };
  var keysByCode = {};
  var keyList = [];

  /* ---------------- build the board ---------------- */
  function buildKey(spec) {
    var label = spec[0], code = spec[1], w = spec[2], o = spec[3] || {};
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'key';
    b.style.gridColumn = 'span ' + Math.round(w * 4);
    b.dataset.code = code;
    b.dataset.w = w;
    if (o.accent) b.classList.add('accent');
    if (o.small) b.classList.add('small');
    if (o.glyph) b.classList.add('glyph');
    if (o.fn) b.dataset.fn = o.fn;
    var name = label || (code === 'Space' ? 'Space' : code);
    if (code === 'ArrowUp') name = 'Up arrow';
    if (code === 'ArrowDown') name = 'Down arrow';
    if (code === 'ArrowLeft') name = 'Left arrow';
    if (code === 'ArrowRight') name = 'Right arrow';
    b.setAttribute('aria-label', name);

    var cap = document.createElement('span');
    cap.className = 'cap';
    if (o.sub) { var sub = document.createElement('span'); sub.className = 'sub'; sub.textContent = o.sub; cap.appendChild(sub); }
    if (o.fn) { var fl = document.createElement('span'); fl.className = 'fn-lg'; fl.textContent = o.fn; cap.appendChild(fl); }
    if (o.led) { var led = document.createElement('span'); led.className = 'led'; cap.appendChild(led); }
    var lg = document.createElement('span');
    lg.className = 'lg';
    lg.textContent = label;
    cap.appendChild(lg);
    b.appendChild(cap);

    var k = {
      el: b, code: code, w: w, kind: o.kind || 'char', label: label,
      ch: o.ch !== undefined ? o.ch : (o.kind ? null : (label.length === 1 ? label.toLowerCase() : null)),
      shift: o.shift || (label.length === 1 && /[a-z]/i.test(label) ? label.toUpperCase() : null),
      down: false
    };
    keysByCode[code] = k;
    keyList.push(k);
    return b;
  }

  var frag = document.createDocumentFragment();
  ROWS.forEach(function (row) { row.forEach(function (spec) { frag.appendChild(buildKey(spec)); }); });
  plate.appendChild(frag);
  var kc = $('#keycount'); if (kc) kc.textContent = String(keyList.length);
  plate.setAttribute('aria-label', 'KEY-01 keyboard, ' + keyList.length + ' keys');

  /* ---------------- sound (synthesised) ---------------- */
  var audio = { ctx: null, master: null, noise: null };
  var PROFILES = {
    linear:  { thock: 110, thockGain: 0.55, noiseHz: 1100, noiseQ: 0.9, noiseGain: 0.28, click: 0,    clickGain: 0 },
    tactile: { thock: 130, thockGain: 0.5,  noiseHz: 1700, noiseQ: 1.1, noiseGain: 0.34, click: 2400, clickGain: 0.14 },
    clicky:  { thock: 150, thockGain: 0.4,  noiseHz: 2600, noiseQ: 1.4, noiseGain: 0.3,  click: 5200, clickGain: 0.45 }
  };

  function ensureAudio() {
    if (audio.ctx) { if (audio.ctx.state === 'suspended') audio.ctx.resume(); return true; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    var ctx = new AC();
    var master = ctx.createGain();
    master.gain.value = 0.6;
    master.connect(ctx.destination);
    var len = Math.floor(ctx.sampleRate * 0.12);
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    audio.ctx = ctx; audio.master = master; audio.noise = buf;
    return true;
  }

  function playKey(k, up) {
    if (!state.sound || !audio.ctx) return;
    var ctx = audio.ctx, t = ctx.currentTime;
    var p = PROFILES[state.sw];
    var size = Math.min(k.w, 3);
    var wide = k.w >= 2;
    var pitch = (wide ? 0.78 : 1) * (0.95 + Math.random() * 0.1);
    var vol = up ? 0.35 : 1;

    // body thock: short, pitch-sweeping sine
    var osc = ctx.createOscillator();
    var og = ctx.createGain();
    osc.type = 'sine';
    var f0 = p.thock * pitch * (up ? 1.6 : 1);
    osc.frequency.setValueAtTime(f0 * 1.8, t);
    osc.frequency.exponentialRampToValueAtTime(f0, t + 0.03);
    og.gain.setValueAtTime(0.0001, t);
    og.gain.exponentialRampToValueAtTime(p.thockGain * vol * (0.8 + size * 0.1), t + 0.004);
    og.gain.exponentialRampToValueAtTime(0.0001, t + (up ? 0.05 : 0.11));
    osc.connect(og); og.connect(audio.master);
    osc.start(t); osc.stop(t + 0.13);

    // plastic noise
    var n = ctx.createBufferSource();
    n.buffer = audio.noise;
    var bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = p.noiseHz * pitch * (up ? 1.3 : 1);
    bp.Q.value = p.noiseQ;
    var ng = ctx.createGain();
    ng.gain.setValueAtTime(p.noiseGain * vol, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + (up ? 0.03 : 0.06));
    n.connect(bp); bp.connect(ng); ng.connect(audio.master);
    n.start(t); n.stop(t + 0.08);

    // click transient (tactile knock / clicky click) on the way down only
    if (!up && p.click) {
      var c = ctx.createOscillator();
      var cg = ctx.createGain();
      c.type = state.sw === 'clicky' ? 'square' : 'triangle';
      c.frequency.setValueAtTime(p.click * pitch, t);
      c.frequency.exponentialRampToValueAtTime(p.click * pitch * 0.6, t + 0.012);
      cg.gain.setValueAtTime(p.clickGain, t);
      cg.gain.exponentialRampToValueAtTime(0.0001, t + (state.sw === 'clicky' ? 0.018 : 0.012));
      var hp = ctx.createBiquadFilter();
      hp.type = 'highpass'; hp.frequency.value = 1800;
      c.connect(hp); hp.connect(cg); cg.connect(audio.master);
      c.start(t); c.stop(t + 0.03);
    }
  }

  function setSound(on) {
    if (on && !ensureAudio()) on = false;
    state.sound = on;
    $$('[data-sound-toggle]').forEach(function (b, i) {
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      var lbl = $('.sound-label', b);
      if (lbl) lbl.textContent = b.classList.contains('big') ? (on ? 'On' : 'Off') : (on ? 'Sound on' : 'Sound off');
    });
    if (on) {
      // one demo press so the user hears what they just enabled
      var demo = keysByCode.KeyK;
      press(demo, 'demo'); setTimeout(function () { release(demo); }, 90);
    }
  }
  $$('[data-sound-toggle]').forEach(function (b) {
    b.addEventListener('click', function () { setSound(!state.sound); });
  });

  /* ---------------- transcript ---------------- */
  function renderText() {
    typedEl.textContent = state.text;
    transcript.classList.toggle('has-text', state.text.length > 0);
    countEl.textContent = String(state.count);
  }
  function typeChar(ch) {
    state.text = (state.text + ch).slice(-160);
    renderText();
  }
  function backspace() {
    state.text = state.text.slice(0, -1);
    renderText();
  }
  $('#clear').addEventListener('click', function () { state.text = ''; renderText(); });

  /* ---------------- press / release ---------------- */
  function setXsec(down) {
    xsec.classList.toggle('down', down);
    xsecState.textContent = down ? 'Pressed' : 'At rest';
  }

  function press(k, source) {
    if (!k || k.down) return;
    k.down = true;
    k.el.classList.add('is-down');
    state.count++;
    state.downCount++;
    board.classList.add('touched');
    setXsec(true);
    playKey(k, false);

    if (source === 'pointer') {
      // the on-screen keyboard types for itself (phones have no physical keys)
      if (k.kind === 'char' && k.ch !== null) {
        var upper = state.shiftSticky !== state.caps;
        var useShift = state.shiftSticky;
        var out;
        if (k.shift && /[a-z]/.test(k.ch)) out = upper ? k.shift : k.ch;
        else out = useShift && k.shift ? k.shift : k.ch;
        typeChar(out);
        if (state.shiftSticky) setShiftSticky(false);
      } else if (k.kind === 'space') {
        typeChar(' ');
      } else if (k.kind === 'back') {
        backspace();
      } else if (k.kind === 'enter') {
        typeChar('\n');
      } else if (k.kind === 'shift') {
        setShiftSticky(!state.shiftSticky);
      } else if (k.kind === 'caps') {
        setCaps(!state.caps);
      } else if (k.kind === 'fn') {
        setFn(!state.fn);
      }
    }
    renderText();
  }

  function release(k) {
    if (!k || !k.down) return;
    k.down = false;
    k.el.classList.remove('is-down');
    state.downCount = Math.max(0, state.downCount - 1);
    if (state.downCount === 0) setXsec(false);
    playKey(k, true);
  }

  function releaseAll() { keyList.forEach(function (k) { if (k.down) release(k); }); state.downCount = 0; setXsec(false); }

  function setShiftSticky(on) {
    state.shiftSticky = on;
    [keysByCode.ShiftLeft, keysByCode.ShiftRight].forEach(function (k) { k.el.classList.toggle('sticky', on); });
  }
  function setCaps(on) {
    state.caps = on;
    keysByCode.CapsLock.el.classList.toggle('lit', on);
  }
  function setFn(on) {
    state.fn = on;
    board.classList.toggle('fn-layer', on);
    keysByCode.Fn.el.classList.toggle('sticky', on);
  }

  /* pointer input on the drawn keys */
  plate.addEventListener('pointerdown', function (e) {
    var el = e.target.closest('.key');
    if (!el) return;
    e.preventDefault();
    var k = keysByCode[el.dataset.code];
    try { el.setPointerCapture(e.pointerId); } catch (err) { /* not needed */ }
    press(k, 'pointer');
    var done = function () {
      release(k);
      el.removeEventListener('pointerup', done);
      el.removeEventListener('pointercancel', done);
      el.removeEventListener('lostpointercapture', done);
    };
    el.addEventListener('pointerup', done);
    el.addEventListener('pointercancel', done);
    el.addEventListener('lostpointercapture', done);
  });
  // keyboard activation of a focused drawn key (Enter/Space) behaves like a tap
  plate.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('key')) {
      var k = keysByCode[e.target.dataset.code];
      if (!k || k.down) { e.preventDefault(); return; }
      e.preventDefault();
      press(k, 'pointer');
    }
  });
  plate.addEventListener('keyup', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('key')) {
      release(keysByCode[e.target.dataset.code]);
    }
  });

  /* physical keyboard */
  var PREVENT = { Space: 1, Backspace: 1, ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1, Slash: 1, Quote: 1, PageUp: 1, PageDown: 1, End: 1, Enter: 1 };
  function inField(t) {
    return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
  }
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = keysByCode[e.code];
    if (!k) return;
    var field = inField(e.target);
    var onDrawnKey = e.target.classList && e.target.classList.contains('key');
    if (e.getModifierState && e.getModifierState('CapsLock') !== state.caps) setCaps(!state.caps);
    if (field) { if (!e.repeat) { press(k, 'physical'); } return; }
    if (onDrawnKey && (e.code === 'Enter' || e.code === 'Space')) return; // handled above
    if (PREVENT[e.code]) e.preventDefault();
    if (e.repeat) {
      if (e.key.length === 1) typeChar(e.key);
      else if (e.code === 'Backspace') backspace();
      return;
    }
    press(k, 'physical');
    if (e.key.length === 1) typeChar(e.key);
    else if (e.code === 'Backspace') backspace();
    else if (e.code === 'Enter') typeChar('\n');
  });
  document.addEventListener('keyup', function (e) {
    var k = keysByCode[e.code];
    if (k) release(k);
    if (e.key === 'Meta' || e.key === 'Control' || e.key === 'Alt') releaseAll();
    if (e.getModifierState && e.code !== 'CapsLock' && e.getModifierState('CapsLock') !== state.caps) setCaps(!state.caps);
  });
  window.addEventListener('blur', releaseAll);
  document.addEventListener('visibilitychange', function () { if (document.hidden) releaseAll(); });

  /* ---------------- switch and colour controls ---------------- */
  var SWITCH_NAMES = { linear: 'Linear', tactile: 'Tactile', clicky: 'Clicky' };
  function setGroup(group, value) {
    $$('[data-group="' + group + '"] [role="radio"]').forEach(function (b) {
      b.setAttribute('aria-checked', b.dataset.value === value ? 'true' : 'false');
    });
    if (group === 'switch') {
      state.sw = value;
      board.dataset.switch = value;
      xsec.classList.remove('linear', 'tactile', 'clicky');
      xsec.classList.add(value);
      xsecName.textContent = SWITCH_NAMES[value];
      if (state.sound) { var k = keysByCode.KeyJ; press(k, 'demo'); setTimeout(function () { release(k); }, 80); }
    } else if (group === 'colour') {
      state.colour = value;
      board.dataset.colour = value;
    }
  }
  $$('[data-group]').forEach(function (g) {
    var group = g.dataset.group;
    g.addEventListener('click', function (e) {
      var b = e.target.closest('[role="radio"]');
      if (!b || !g.contains(b)) return;
      setGroup(group, b.dataset.value);
    });
    g.addEventListener('keydown', function (e) {
      var radios = $$('[role="radio"]', g);
      var i = radios.indexOf(document.activeElement);
      if (i < 0) return;
      var next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = radios[(i + 1) % radios.length];
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = radios[(i - 1 + radios.length) % radios.length];
      if (next) { e.preventDefault(); e.stopPropagation(); next.focus(); setGroup(group, next.dataset.value); }
    });
  });
  setGroup('switch', state.sw);
  setGroup('colour', state.colour);

  /* ---------------- reserve form ---------------- */
  var form = $('#reserveForm');
  var note = $('#formNote');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = $('#email');
    var v = input.value.trim();
    if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      note.className = 'form-note err';
      note.textContent = 'That doesn’t look like an email address yet.';
      input.focus();
      return;
    }
    note.className = 'form-note ok';
    note.textContent = 'Noted. One message to ' + v + ' when KEY-01 is ready to order.';
    input.value = '';
  });

  /* ---------------- motion preference ---------------- */
  function applyMotion() { document.documentElement.classList.toggle('reduce-motion', reduceMotion.matches); }
  applyMotion();
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', applyMotion);

  renderText();
})();
