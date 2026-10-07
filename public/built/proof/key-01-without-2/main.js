/* KEY-01 — the board on the page */
(function () {
  'use strict';

  // ---------- layout ----------
  // [code, legend, width, shiftLegend, classes]
  var K = function (code, legend, w, sub, cls) { return { code: code, legend: legend, w: w || 1, sub: sub || '', cls: cls || '' }; };
  var ROWS = [
    [K('Escape', 'esc', 1, '', 'mod accent word'), K('F1', 'F1', 1, '', 'mod fkey'), K('F2', 'F2', 1, '', 'mod fkey'), K('F3', 'F3', 1, '', 'mod fkey'), K('F4', 'F4', 1, '', 'mod fkey'),
     K('F5', 'F5', 1, '', 'mod fkey'), K('F6', 'F6', 1, '', 'mod fkey'), K('F7', 'F7', 1, '', 'mod fkey'), K('F8', 'F8', 1, '', 'mod fkey'),
     K('F9', 'F9', 1, '', 'mod fkey'), K('F10', 'F10', 1, '', 'mod fkey'), K('F11', 'F11', 1, '', 'mod fkey'), K('F12', 'F12', 1, '', 'mod fkey'),
     K('PrintScreen', 'prt', 1, '', 'mod word'), K('Delete', 'del', 1, '', 'mod word'), { knob: true }],
    [K('Backquote', '`', 1, '~', 'sym'), K('Digit1', '1', 1, '!'), K('Digit2', '2', 1, '@'), K('Digit3', '3', 1, '#'), K('Digit4', '4', 1, '$'), K('Digit5', '5', 1, '%'),
     K('Digit6', '6', 1, '^'), K('Digit7', '7', 1, '&'), K('Digit8', '8', 1, '*'), K('Digit9', '9', 1, '('), K('Digit0', '0', 1, ')'),
     K('Minus', '-', 1, '_', 'sym'), K('Equal', '=', 1, '+', 'sym'), K('Backspace', 'backspace', 2, '', 'mod word'), K('PageUp', 'pg up', 1, '', 'mod word')],
    [K('Tab', 'tab', 1.5, '', 'mod word'), K('KeyQ', 'Q'), K('KeyW', 'W'), K('KeyE', 'E'), K('KeyR', 'R'), K('KeyT', 'T'), K('KeyY', 'Y'), K('KeyU', 'U'), K('KeyI', 'I'), K('KeyO', 'O'), K('KeyP', 'P'),
     K('BracketLeft', '[', 1, '{', 'sym'), K('BracketRight', ']', 1, '}', 'sym'), K('Backslash', '\\', 1.5, '|', 'sym'), K('PageDown', 'pg dn', 1, '', 'mod word')],
    [K('CapsLock', 'caps', 1.75, '', 'mod word'), K('KeyA', 'A'), K('KeyS', 'S'), K('KeyD', 'D'), K('KeyF', 'F'), K('KeyG', 'G'), K('KeyH', 'H'), K('KeyJ', 'J'), K('KeyK', 'K'), K('KeyL', 'L'),
     K('Semicolon', ';', 1, ':', 'sym'), K('Quote', "'", 1, '"', 'sym'), K('Enter', 'enter', 2.25, '', 'accent word'), K('Home', 'home', 1, '', 'mod word')],
    [K('ShiftLeft', 'shift', 2.25, '', 'mod word'), K('KeyZ', 'Z'), K('KeyX', 'X'), K('KeyC', 'C'), K('KeyV', 'V'), K('KeyB', 'B'), K('KeyN', 'N'), K('KeyM', 'M'),
     K('Comma', ',', 1, '<', 'sym'), K('Period', '.', 1, '>', 'sym'), K('Slash', '/', 1, '?', 'sym'), K('ShiftRight', 'shift', 1.75, '', 'mod word'),
     K('ArrowUp', '↑', 1, '', 'mod sym'), K('End', 'end', 1, '', 'mod word')],
    [K('ControlLeft', 'ctrl', 1.25, '', 'mod word'), K('AltLeft', 'opt', 1.25, '', 'mod word'), K('MetaLeft', 'cmd', 1.25, '', 'mod word'), K('Space', '', 6.25, '', 'space'),
     K('MetaRight', 'cmd', 1, '', 'mod word'), K('Fn', 'fn', 1, '', 'mod word'), K('ControlRight', 'ctrl', 1, '', 'mod word'),
     K('ArrowLeft', '←', 1, '', 'mod sym'), K('ArrowDown', '↓', 1, '', 'mod sym'), K('ArrowRight', '→', 1, '', 'mod sym')]
  ];

  var SHIFT_SYM = { '`': '~', '1': '!', '2': '@', '3': '#', '4': '$', '5': '%', '6': '^', '7': '&', '8': '*', '9': '(', '0': ')', '-': '_', '=': '+', '[': '{', ']': '}', '\\': '|', ';': ':', "'": '"', ',': '<', '.': '>', '/': '?' };
  var ARIA = { Escape: 'Escape', PrintScreen: 'Print screen', Delete: 'Delete', Backquote: 'Backtick', Backspace: 'Backspace', PageUp: 'Page up', PageDown: 'Page down', CapsLock: 'Caps lock', ShiftLeft: 'Left shift', ShiftRight: 'Right shift', ArrowUp: 'Up arrow', ArrowDown: 'Down arrow', ArrowLeft: 'Left arrow', ArrowRight: 'Right arrow', ControlLeft: 'Left control', ControlRight: 'Right control', AltLeft: 'Option', MetaLeft: 'Left command', MetaRight: 'Right command', Fn: 'Function', Space: 'Space', Enter: 'Enter', Tab: 'Tab', Home: 'Home', End: 'End' };

  var $ = function (id) { return document.getElementById(id); };
  var board = $('board'), keyboard = $('keyboard'), stage = $('stage'), hint = $('hint');
  var keyEls = {};
  var keyDefs = {};
  var knobEl = null;

  function buildBoard() {
    var frag = document.createDocumentFragment();
    ROWS.forEach(function (row, ri) {
      var r = document.createElement('div');
      r.className = 'row' + (ri === 0 ? ' frow' : '');
      row.forEach(function (k) {
        if (k.knob) { r.appendChild(buildKnob()); return; }
        keyDefs[k.code] = k;
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'key ' + k.cls;
        b.style.setProperty('--w', k.w);
        b.dataset.code = k.code;
        b.setAttribute('aria-label', ARIA[k.code] || (k.sub ? k.legend + ' ' + k.sub : k.legend));
        var cap = document.createElement('span');
        cap.className = 'cap';
        if (k.sub) { var s = document.createElement('span'); s.className = 'sub'; s.textContent = k.sub; cap.appendChild(s); }
        var l = document.createElement('span');
        l.className = 'legend' + (/\bword\b/.test(k.cls) ? ' word' : '') + (/\bsym\b/.test(k.cls) ? ' sym' : '') + (/\bfkey\b/.test(k.cls) ? ' fkey' : '');
        l.textContent = k.legend;
        cap.appendChild(l);
        b.appendChild(cap);
        keyEls[k.code] = b;
        r.appendChild(b);
      });
      frag.appendChild(r);
    });
    board.appendChild(frag);
  }

  function buildKnob() {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'knob';
    b.id = 'knob';
    b.setAttribute('role', 'slider');
    b.setAttribute('aria-label', 'Volume knob. Drag, scroll or use arrow keys to turn. Click to mute.');
    b.setAttribute('aria-valuemin', '0');
    b.setAttribute('aria-valuemax', '100');
    var ticks = '';
    for (var i = 0; i < 24; i++) {
      var a = (i / 24) * Math.PI * 2;
      var x1 = 50 + Math.cos(a) * 40, y1 = 50 + Math.sin(a) * 40, x2 = 50 + Math.cos(a) * 46, y2 = 50 + Math.sin(a) * 46;
      ticks += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke-width="2"/>';
    }
    b.innerHTML =
      '<svg viewBox="0 0 100 100" aria-hidden="true">' +
      '<circle cx="50" cy="56" r="44" fill="#0c0b0a"/>' +
      '<g class="knob-body">' +
      '<circle cx="50" cy="50" r="44" fill="#2a2724"/>' +
      '<circle class="knob-ring" cx="50" cy="50" r="42" fill="none" stroke="#3f3b36" stroke-width="2"/>' +
      '<g class="knob-ticks">' + ticks + '</g>' +
      '<circle cx="50" cy="50" r="30" fill="#1f1d1a"/>' +
      '<circle class="knob-ind" cx="50" cy="20" r="4"/>' +
      '</g></svg>';
    knobEl = b;
    return b;
  }

  buildBoard();

  // ---------- sizing ----------
  var UNITS = 16.9;
  function size() {
    var w = stage.clientWidth;
    var u = Math.floor(w / UNITS);
    var scrolls = false;
    if (u < 30) { u = 30; scrolls = true; }
    if (u > 64) u = 64;
    keyboard.style.setProperty('--u', u + 'px');
    stage.classList.toggle('scrolls', scrolls);
    if (scrolls) {
      var kw = u * UNITS;
      stage.scrollLeft = Math.max(0, (kw - w) / 2);
    }
  }
  size();
  if (window.ResizeObserver) new ResizeObserver(size).observe(stage);
  else window.addEventListener('resize', size);

  // ---------- audio ----------
  var AC = window.AudioContext || window.webkitAudioContext;
  var audio = { ctx: null, master: null, noise: null, on: false, volume: 0.7 };
  var soundBtn = $('soundBtn'), statVol = $('statVol');

  function ensureAudio() {
    if (!AC) return false;
    if (!audio.ctx) {
      audio.ctx = new AC();
      audio.master = audio.ctx.createGain();
      audio.master.gain.value = audio.volume * 0.9;
      audio.master.connect(audio.ctx.destination);
      var len = audio.ctx.sampleRate;
      var buf = audio.ctx.createBuffer(1, len, audio.ctx.sampleRate);
      var d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      audio.noise = buf;
    }
    if (audio.ctx.state === 'suspended') audio.ctx.resume();
    return true;
  }

  function burst(t, opts) {
    // a short filtered noise burst with exponential decay
    var ctx = audio.ctx;
    var src = ctx.createBufferSource();
    src.buffer = audio.noise;
    src.playbackRate.value = opts.rate || 1;
    var f = ctx.createBiquadFilter();
    f.type = opts.type;
    f.frequency.value = opts.freq;
    f.Q.value = opts.q || 1;
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(opts.gain, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur);
    src.connect(f); f.connect(g); g.connect(audio.master);
    src.start(t, Math.random() * 0.5);
    src.stop(t + opts.dur + 0.02);
  }
  function thump(t, freq, gain, dur) {
    var ctx = audio.ctx;
    var o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * 0.45, t + dur);
    var g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(audio.master);
    o.start(t); o.stop(t + dur + 0.02);
  }
  var rnd = function (a, b) { return a + Math.random() * (b - a); };

  function playPress(def) {
    if (!audio.on || !ensureAudio()) return;
    var t = audio.ctx.currentTime + 0.001;
    var big = def.w >= 2 ? 0.72 : def.w > 1 ? 0.88 : 1;   // bigger caps, deeper cavity
    var v = rnd(0.85, 1.15);
    var sw = keyboard.dataset.switch;
    // bottom-out body, every switch
    burst(t, { type: 'lowpass', freq: 1100 * big * rnd(0.92, 1.08), q: 1.2, gain: 0.8 * v, dur: 0.055 / big });
    thump(t, 140 * big * rnd(0.95, 1.05), 0.35 * v, 0.06 / big);
    if (sw === 'linear') {
      burst(t, { type: 'bandpass', freq: 2600 * rnd(0.9, 1.1), q: 2, gain: 0.18 * v, dur: 0.015 });
    } else if (sw === 'tactile') {
      burst(t - 0.001, { type: 'bandpass', freq: 2100 * rnd(0.9, 1.1), q: 3, gain: 0.45 * v, dur: 0.022 });
      burst(t, { type: 'lowpass', freq: 700 * big, q: 2, gain: 0.3 * v, dur: 0.07 });
    } else {
      burst(t, { type: 'bandpass', freq: 5600 * rnd(0.92, 1.08), q: 7, gain: 0.9 * v, dur: 0.028 });
      burst(t, { type: 'highpass', freq: 4000, q: 1, gain: 0.35 * v, dur: 0.018 });
    }
  }
  function playRelease(def) {
    if (!audio.on || !audio.ctx) return;
    var t = audio.ctx.currentTime + 0.001;
    var sw = keyboard.dataset.switch;
    var big = def.w >= 2 ? 0.8 : 1;
    burst(t, { type: 'bandpass', freq: 2400 * big * rnd(0.9, 1.1), q: 2.5, gain: 0.22, dur: 0.02 });
    if (sw === 'clicky') burst(t + 0.004, { type: 'bandpass', freq: 5200 * rnd(0.92, 1.08), q: 7, gain: 0.5, dur: 0.022 });
  }
  function playDetent() {
    if (!audio.on || !ensureAudio()) return;
    burst(audio.ctx.currentTime + 0.001, { type: 'bandpass', freq: 3200, q: 4, gain: 0.25, dur: 0.014 });
  }

  function setSound(on) {
    audio.on = on;
    if (on) ensureAudio();
    soundBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    soundBtn.querySelector('.sound-label').textContent = on ? 'Sound on' : 'Sound off';
    knobEl.classList.toggle('muted', !on);
  }
  soundBtn.addEventListener('click', function () { setSound(!audio.on); if (audio.on) playDetent(); });

  // ---------- knob ----------
  function setVolume(v, silentDetent) {
    v = Math.max(0, Math.min(1, v));
    var step = Math.round(v * 20) / 20;
    var changed = step !== audio.volume;
    audio.volume = step;
    if (audio.master) audio.master.gain.setTargetAtTime(step * 0.9, audio.ctx.currentTime, 0.01);
    knobEl.querySelector('.knob-body').style.transform = 'rotate(' + (-135 + step * 270) + 'deg)';
    knobEl.setAttribute('aria-valuenow', String(Math.round(step * 100)));
    knobEl.setAttribute('aria-valuetext', Math.round(step * 100) + ' percent');
    statVol.textContent = Math.round(step * 100) + '%';
    if (changed && !silentDetent) playDetent();
  }
  setVolume(0.7, true);

  knobEl.addEventListener('wheel', function (e) {
    e.preventDefault();
    setVolume(audio.volume + (e.deltaY < 0 ? 0.05 : -0.05));
  }, { passive: false });

  var drag = null;
  knobEl.addEventListener('pointerdown', function (e) {
    drag = { y: e.clientY, v: audio.volume, moved: false };
    knobEl.setPointerCapture(e.pointerId);
  });
  knobEl.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dy = drag.y - e.clientY;
    if (Math.abs(dy) > 3) drag.moved = true;
    if (drag.moved) setVolume(drag.v + dy / 160);
  });
  function endDrag(e) {
    if (!drag) return;
    var tapped = !drag.moved;
    drag = null;
    if (tapped && e.type === 'pointerup') { setSound(!audio.on); if (audio.on) playDetent(); }
  }
  knobEl.addEventListener('pointerup', endDrag);
  knobEl.addEventListener('pointercancel', endDrag);
  knobEl.addEventListener('keydown', function (e) {
    var d = 0;
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') d = 0.05;
    else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') d = -0.05;
    else if (e.key === 'Home') d = -1;
    else if (e.key === 'End') d = 1;
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSound(!audio.on); return; }
    else return;
    e.preventDefault();
    e.stopPropagation();
    setVolume(audio.volume + d);
  });

  // ---------- tape + stats ----------
  var SENTENCE = 'the quick brown fox jumps over the lazy dog';
  var typed = '';
  var counts = {};
  var total = 0;
  var tape = $('tape'), tapeNote = $('tapeNote'), tapeLabel = $('tapeLabel');
  var statKeys = $('statKeys'), statTop = $('statTop');
  var startedAt = 0, finished = false;

  function renderTape() {
    var html = '';
    var i;
    for (i = 0; i < SENTENCE.length; i++) {
      var ch = SENTENCE[i];
      var shown = ch === ' ' ? ' ' : ch;
      if (i < typed.length) {
        var ok = typed[i] === ch;
        html += '<span class="' + (ok ? 'ok' : 'bad') + '">' + (ok ? shown : (typed[i] === ' ' ? ' ' : esc(typed[i]))) + '</span>';
      } else {
        html += '<span>' + shown + '</span>';
      }
      if (i === typed.length - 1 && typed.length < SENTENCE.length) html += '<span class="caret"></span>';
    }
    if (typed.length === 0) html = '<span class="caret"></span>' + html;
    tape.innerHTML = html;
  }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function charFor(code, shift) {
    var def = keyDefs[code];
    if (!def) return null;
    if (code === 'Space') return ' ';
    if (/^Key[A-Z]$/.test(code)) return shift ? def.legend.toUpperCase() : def.legend.toLowerCase();
    if (def.sub) return shift ? SHIFT_SYM[def.legend] || def.sub : def.legend;
    return null;
  }

  function onType(code, shift) {
    if (finished) return;
    if (code === 'Backspace') { typed = typed.slice(0, -1); renderTape(); return; }
    var ch = charFor(code, shift);
    if (ch === null) return;
    if (typed.length >= SENTENCE.length) return;
    if (!startedAt) startedAt = performance.now();
    typed += ch;
    renderTape();
    if (typed.length === SENTENCE.length) {
      var secs = (performance.now() - startedAt) / 1000;
      var wrong = 0;
      for (var i = 0; i < SENTENCE.length; i++) if (typed[i] !== SENTENCE[i]) wrong++;
      finished = true;
      tapeLabel.textContent = 'Done';
      if (wrong === 0) tapeNote.textContent = 'Every letter of the alphabet in ' + secs.toFixed(1) + ' seconds, no mistakes.';
      else tapeNote.textContent = 'Every letter of the alphabet in ' + secs.toFixed(1) + ' seconds, ' + wrong + (wrong === 1 ? ' slip.' : ' slips.');
    }
  }

  function bump(code) {
    counts[code] = (counts[code] || 0) + 1;
    total++;
    statKeys.textContent = String(total);
    var top = null, max = 0;
    for (var c in counts) if (counts[c] > max) { max = counts[c]; top = c; }
    if (top) {
      var d = keyDefs[top];
      statTop.textContent = (d.legend || 'space') + ' ×' + max;
    }
    if (keyboard.classList.contains('heat')) paintHeat();
  }

  function paintHeat() {
    var max = 0;
    for (var c in counts) if (counts[c] > max) max = counts[c];
    for (var code in keyEls) {
      var n = counts[code] || 0;
      keyEls[code].style.setProperty('--heat', max ? (n / max).toFixed(3) : 0);
    }
  }

  $('resetBtn').addEventListener('click', function () {
    typed = ''; counts = {}; total = 0; startedAt = 0; finished = false;
    statKeys.textContent = '0'; statTop.textContent = '—';
    tapeLabel.textContent = 'Type this sentence'; tapeNote.textContent = '';
    renderTape(); paintHeat();
  });
  renderTape();

  // ---------- press / release ----------
  var down = {};
  var cutaway = $('cutaway'), cutawayBtn = $('cutawayBtn'), cutawayState = $('cutawayState');
  var cutawayHold = false;

  function neighbors(el) {
    // keys whose horizontal centre falls within 1.4u on the same or adjacent rows
    var out = [];
    var r = el.getBoundingClientRect();
    var u = parseFloat(getComputedStyle(keyboard).getPropertyValue('--u')) || 54;
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (var code in keyEls) {
      var k = keyEls[code]; if (k === el) continue;
      var b = k.getBoundingClientRect();
      var dx = Math.abs(b.left + b.width / 2 - cx), dy = Math.abs(b.top + b.height / 2 - cy);
      if (dx < u * 1.4 && dy < u * 1.2) out.push(k);
    }
    return out;
  }

  function press(code, opts) {
    var el = keyEls[code]; if (!el || down[code]) return;
    down[code] = true;
    el.classList.add('down');
    var def = keyDefs[code];
    playPress(def);
    bump(code);
    onType(code, opts.shift);
    if (!hint.classList.contains('gone')) hint.classList.add('gone');
    if (keyboard.classList.contains('lit')) {
      var cap = el.firstChild;
      cap.classList.add('flash');
      var near = neighbors(el);
      near.forEach(function (k) { k.firstChild.classList.add('flash-near'); });
      setTimeout(function () { cap.classList.remove('flash'); near.forEach(function (k) { k.firstChild.classList.remove('flash-near'); }); }, 260);
    }
    if (code === 'CapsLock') setTimeout(function () { release(code); }, 160); // macOS sends no keyup for caps lock
    cutaway.classList.add('pressed');
  }
  function release(code) {
    var el = keyEls[code]; if (!el || !down[code]) return;
    delete down[code];
    el.classList.remove('down');
    playRelease(keyDefs[code]);
    if (!Object.keys(down).length && !cutawayHold) cutaway.classList.remove('pressed');
  }
  function releaseAll() { for (var c in down) release(c); }

  // physical keyboard
  var PREVENT = { Space: 1, ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1, Backspace: 1, Slash: 1, Quote: 1, PageUp: 1, PageDown: 1, Home: 1, End: 1 };
  function listening() {
    var a = document.activeElement;
    if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable)) return false;
    if (a === knobEl) return false;
    var r = stage.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  }
  document.addEventListener('keydown', function (e) {
    if (!listening()) return;
    var code = e.code;
    if (!keyEls[code]) return;
    if (e.metaKey || e.ctrlKey) { press(code, { shift: e.shiftKey }); return; } // let shortcuts through
    if (PREVENT[code] || (document.activeElement === stage && code !== 'Tab' && !/^F\d+$/.test(code))) e.preventDefault();
    if (e.repeat) return;
    press(code, { shift: e.shiftKey });
  });
  document.addEventListener('keyup', function (e) {
    if (keyEls[e.code]) release(e.code);
    if (e.code === 'MetaLeft' || e.code === 'MetaRight') releaseAll(); // macOS swallows keyups while cmd is held
  });
  window.addEventListener('blur', releaseAll);

  // pointer
  board.addEventListener('pointerdown', function (e) {
    var el = e.target.closest('.key'); if (!el) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    stage.focus({ preventScroll: true });
    press(el.dataset.code, { shift: e.shiftKey || down.ShiftLeft || down.ShiftRight });
    el.dataset.ptr = String(e.pointerId);
    try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  });
  function pointerEnd(e) {
    var el = e.target.closest && e.target.closest('.key'); if (!el) return;
    release(el.dataset.code);
  }
  board.addEventListener('pointerup', pointerEnd);
  board.addEventListener('pointercancel', pointerEnd);
  board.addEventListener('lostpointercapture', pointerEnd);
  // the on-screen buttons are driven by pointer events; stop Enter/Space from re-firing them
  board.addEventListener('click', function (e) { e.preventDefault(); });
  board.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  // ---------- options ----------
  var switchRadios = document.querySelectorAll('input[name="switch"]');
  var cardRadios = document.querySelectorAll('input[name="switch-card"]');
  var STEM = { linear: '#d9433a', tactile: '#9a6b3f', clicky: '#3f7fd9' };
  function setSwitch(v) {
    keyboard.dataset.switch = v;
    cutaway.dataset.switch = v;
    document.documentElement.style.setProperty('--sw-stem', STEM[v]);
    switchRadios.forEach(function (r) { r.checked = r.value === v; });
    cardRadios.forEach(function (r) { r.checked = r.value === v; });
  }
  switchRadios.forEach(function (r) { r.addEventListener('change', function () { if (r.checked) setSwitch(r.value); }); });
  cardRadios.forEach(function (r) { r.addEventListener('change', function () { if (r.checked) setSwitch(r.value); }); });
  setSwitch('linear');

  document.querySelectorAll('input[name="colorway"]').forEach(function (r) {
    r.addEventListener('change', function () { if (r.checked) keyboard.dataset.colorway = r.value; });
  });

  var lightBtn = $('lightBtn'), heatBtn = $('heatBtn');
  lightBtn.addEventListener('click', function () {
    var on = lightBtn.getAttribute('aria-pressed') !== 'true';
    lightBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    keyboard.classList.toggle('lit', on);
  });
  heatBtn.addEventListener('click', function () {
    var on = heatBtn.getAttribute('aria-pressed') !== 'true';
    heatBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    keyboard.classList.toggle('heat', on);
    if (on) paintHeat();
  });

  // cutaway: press and hold
  function cutDown(e) {
    if (e.type === 'pointerdown') { if (e.button !== 0 && e.pointerType === 'mouse') return; try { cutawayBtn.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } }
    if (cutawayHold) return;
    cutawayHold = true;
    cutaway.classList.add('pressed');
    cutawayBtn.classList.add('pressing');
    cutawayState.textContent = 'bottomed out';
    playPress({ w: 1 });
  }
  function cutUp() {
    if (!cutawayHold) return;
    cutawayHold = false;
    cutaway.classList.remove('pressed');
    cutawayBtn.classList.remove('pressing');
    cutawayState.textContent = 'hold to press';
    playRelease({ w: 1 });
  }
  cutawayBtn.addEventListener('pointerdown', cutDown);
  cutawayBtn.addEventListener('pointerup', cutUp);
  cutawayBtn.addEventListener('pointercancel', cutUp);
  cutawayBtn.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); cutDown(e); } });
  cutawayBtn.addEventListener('keyup', function (e) { if (e.key === ' ' || e.key === 'Enter') cutUp(); });
  cutawayBtn.addEventListener('blur', cutUp);

  // ---------- reserve ----------
  var form = $('reserveForm'), note = $('formNote'), email = $('email');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = email.value.trim();
    if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      note.textContent = 'That does not look like an address yet.';
      email.focus();
      return;
    }
    note.textContent = 'Noted. One message, when the first batch is ready.';
    form.reset();
  });
})();
