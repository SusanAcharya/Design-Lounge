/* KEY-01 — interactive launch page. No dependencies. */
(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const body = document.body;
  const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => rm.matches;

  /* ------------------------------------------------------------------ */
  /* Layout: 60% board, 15 units per row                                 */
  /* [code, legend, width, classes, shiftLegend]                         */
  const ROWS = [
    [['Escape', 'Esc', 1, 'acc sm'], ['Digit1', '1', 1, '', '!'], ['Digit2', '2', 1, '', '@'], ['Digit3', '3', 1, '', '#'],
     ['Digit4', '4', 1, '', '$'], ['Digit5', '5', 1, '', '%'], ['Digit6', '6', 1, '', '^'], ['Digit7', '7', 1, '', '&'],
     ['Digit8', '8', 1, '', '*'], ['Digit9', '9', 1, '', '('], ['Digit0', '0', 1, '', ')'], ['Minus', '-', 1, '', '_'],
     ['Equal', '=', 1, '', '+'], ['Backspace', 'Backspace', 2, 'mod wide']],
    [['Tab', 'Tab', 1.5, 'mod wide'], ['KeyQ', 'Q', 1], ['KeyW', 'W', 1], ['KeyE', 'E', 1], ['KeyR', 'R', 1], ['KeyT', 'T', 1],
     ['KeyY', 'Y', 1], ['KeyU', 'U', 1], ['KeyI', 'I', 1], ['KeyO', 'O', 1], ['KeyP', 'P', 1], ['BracketLeft', '[', 1, '', '{'],
     ['BracketRight', ']', 1, '', '}'], ['Backslash', '\\', 1.5, 'wide', '|']],
    [['CapsLock', 'Caps', 1.75, 'mod wide'], ['KeyA', 'A', 1], ['KeyS', 'S', 1], ['KeyD', 'D', 1], ['KeyF', 'F', 1], ['KeyG', 'G', 1],
     ['KeyH', 'H', 1], ['KeyJ', 'J', 1], ['KeyK', 'K', 1], ['KeyL', 'L', 1], ['Semicolon', ';', 1, '', ':'], ['Quote', "'", 1, '', '"'],
     ['Enter', 'Enter', 2.25, 'acc wide']],
    [['ShiftLeft', 'Shift', 2.25, 'mod wide'], ['KeyZ', 'Z', 1], ['KeyX', 'X', 1], ['KeyC', 'C', 1], ['KeyV', 'V', 1], ['KeyB', 'B', 1],
     ['KeyN', 'N', 1], ['KeyM', 'M', 1], ['Comma', ',', 1, '', '<'], ['Period', '.', 1, '', '>'], ['Slash', '/', 1, '', '?'],
     ['ShiftRight', 'Shift', 2.75, 'mod wide']],
    [['ControlLeft', 'Ctrl', 1.25, 'mod wide'], ['MetaLeft', 'Cmd', 1.25, 'mod wide'], ['AltLeft', 'Alt', 1.25, 'mod wide'],
     ['Space', '', 6.25, 'space'], ['AltRight', 'Alt', 1.25, 'mod wide'], ['Fn', 'Fn', 1.25, 'mod wide'],
     ['ContextMenu', 'Menu', 1.25, 'mod wide'], ['ControlRight', 'Ctrl', 1.25, 'mod wide']]
  ];

  const keys = [];            // { el, code, w, x, y, legend, shift, kind }
  const byCode = new Map();
  const rowsEl = $('[data-rows]');

  ROWS.forEach((row, ri) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'row';
    let x = 0;
    row.forEach(([code, legend, w, cls, shift]) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'key ' + (cls || '');
      el.style.setProperty('--w', w);
      el.dataset.code = code;
      const name = legend || (code === 'Space' ? 'Space' : code);
      el.setAttribute('aria-label', shift ? `${legend} (shift: ${shift})` : name);
      if (shift) {
        el.innerHTML = `<span class="lg sub">${esc(shift)}</span><span class="lg main">${esc(legend)}</span>`;
      } else if (legend) {
        el.innerHTML = `<span class="lg">${esc(legend)}</span>`;
      }
      if (cls && cls.includes('sm')) el.style.fontSize = 'calc(var(--u) * 0.2)';
      rowEl.appendChild(el);
      const k = { el, code, w, x: x + w / 2, y: ri, legend, shift, i: keys.length };
      keys.push(k);
      el._k = k;
      byCode.set(code, k);
      x += w;
    });
    rowsEl.appendChild(rowEl);
  });

  function esc(s) { return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  /* ------------------------------------------------------------------ */
  /* Sizing: fit 15 units into the wrapper, never below a tappable size  */
  const wrap = $('[data-kb-wrap]');
  const kb = $('[data-kb]');
  let sizedOnce = false;
  function size() {
    const cs = getComputedStyle(wrap);
    const inner = wrap.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gap')) || 6;
    const kcs = getComputedStyle(kb);
    const pad = parseFloat(kcs.paddingLeft) + parseFloat(kcs.paddingRight);
    let u = Math.floor((inner - pad - 14 * gap) / 15);
    u = Math.max(28, Math.min(60, u));
    document.documentElement.style.setProperty('--u', u + 'px');
    if (!sizedOnce) {
      sizedOnce = true;
      requestAnimationFrame(() => { wrap.scrollLeft = Math.max(0, (kb.offsetWidth - wrap.clientWidth) / 2 + parseFloat(cs.paddingLeft)); });
    }
  }
  size();
  if ('ResizeObserver' in window) new ResizeObserver(size).observe(wrap);
  else window.addEventListener('resize', size);

  /* ------------------------------------------------------------------ */
  /* Sound engine: synthesized, off by default, needs a gesture          */
  const Snd = {
    ctx: null, master: null, noise: null, on: false, vol: 0.7,
    init() {
      if (this.ctx) return true;
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return false;
      this.ctx = new C();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.vol * this.vol * 0.9;
      this.master.connect(this.ctx.destination);
      const len = Math.floor(this.ctx.sampleRate * 0.25);
      const b = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.noise = b;
      return true;
    },
    setVol(v) { this.vol = v; if (this.master) this.master.gain.setTargetAtTime(v * v * 0.9, this.ctx.currentTime, 0.02); },
    ready() {
      if (!this.on || !this.ctx) return false;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx.state === 'running';
    },
    burst(t, type, f, q, g, d, delay) {
      const c = this.ctx;
      const s = c.createBufferSource(); s.buffer = this.noise;
      const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
      const gn = c.createGain();
      const t0 = t + (delay || 0);
      gn.gain.setValueAtTime(0.0001, t0);
      gn.gain.exponentialRampToValueAtTime(g, t0 + 0.002);
      gn.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
      s.connect(fl); fl.connect(gn); gn.connect(this.master);
      s.start(t0); s.stop(t0 + d + 0.02);
    },
    thock(t, f, g, d) {
      const c = this.ctx;
      const o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(f, t);
      o.frequency.exponentialRampToValueAtTime(f * 0.55, t + d);
      const gn = c.createGain();
      gn.gain.setValueAtTime(g, t);
      gn.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(gn); gn.connect(this.master);
      o.start(t); o.stop(t + d + 0.02);
    },
    play(sw, w, phase) {
      if (!this.ready()) return;
      const P = PROFILES[sw][phase];
      const t = this.ctx.currentTime;
      const big = w >= 6 ? 2 : w >= 2 ? 1 : 0;
      const fm = [1, 0.82, 0.6][big] * (1 + (Math.random() - 0.5) * 0.12);
      const gm = [1, 1.12, 1.3][big] * (1 + (Math.random() - 0.5) * 0.2);
      const dm = [1, 1.25, 1.6][big];
      for (const p of P) {
        if (p.n) this.burst(t, p.n, p.f * fm, p.q, p.g * gm, p.d * dm, p.delay);
        else this.thock(t, p.f * fm, p.g * gm, p.d * dm);
      }
    }
  };

  const PROFILES = {
    linear: {
      press: [{ n: 'lowpass', f: 900, q: 0.7, g: 0.5, d: 0.05 }, { f: 150, g: 0.55, d: 0.09 }],
      release: [{ n: 'lowpass', f: 1500, q: 0.7, g: 0.16, d: 0.03 }]
    },
    tactile: {
      press: [{ n: 'bandpass', f: 1700, q: 1, g: 0.5, d: 0.045 }, { n: 'highpass', f: 3200, q: 0.8, g: 0.22, d: 0.012 }, { f: 165, g: 0.5, d: 0.08 }],
      release: [{ n: 'bandpass', f: 2200, q: 1, g: 0.18, d: 0.03 }]
    },
    clicky: {
      press: [{ n: 'highpass', f: 4500, q: 1.2, g: 0.7, d: 0.012 }, { n: 'highpass', f: 5200, q: 1.2, g: 0.45, d: 0.01, delay: 0.007 },
              { n: 'bandpass', f: 1500, q: 1, g: 0.3, d: 0.04 }, { f: 190, g: 0.35, d: 0.06 }],
      release: [{ n: 'highpass', f: 4800, q: 1.2, g: 0.4, d: 0.01 }, { n: 'lowpass', f: 1200, q: 0.7, g: 0.12, d: 0.03 }]
    }
  };

  const soundBtns = $$('[data-sound-toggle]');
  function setSound(on) {
    if (on && !Snd.init()) on = false;
    Snd.on = on;
    if (on && Snd.ctx.state === 'suspended') Snd.ctx.resume();
    soundBtns.forEach(b => {
      b.setAttribute('aria-pressed', String(on));
      $('[data-sound-label]', b).textContent = on ? 'Sound on' : 'Sound off';
    });
    if (on) { Snd.play(state.sw, 1, 'press'); setTimeout(() => Snd.play(state.sw, 1, 'release'), 70); }
  }
  soundBtns.forEach(b => b.addEventListener('click', () => setSound(!Snd.on)));
  const volEl = $('[data-volume]');
  volEl.addEventListener('input', () => Snd.setVol(volEl.value / 100));

  /* ------------------------------------------------------------------ */
  /* State                                                               */
  const state = { sw: 'tactile', light: 'reactive', caps: false, shift: false, count: 0, lastT: 0, intervals: [] };

  /* ------------------------------------------------------------------ */
  /* Lighting loop                                                        */
  const glow = new Float32Array(keys.length);
  const held = new Set();
  let waves = [];
  let running = false;
  let lastFrame = 0;
  const WAVE_SPEED = 11;   // units per second
  const WAVE_LIFE = 950;   // ms

  function kick() { if (!running) { running = true; lastFrame = performance.now(); requestAnimationFrame(tick); } }

  function tick(now) {
    const dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;
    const mode = state.light;
    const r = reduced();
    let active = false;
    waves = waves.filter(w => now - w.t0 < WAVE_LIFE);
    for (let i = 0; i < keys.length; i++) {
      let g = 0;
      const isHeld = held.has(i);
      if (mode === 'static') {
        g = 0.32;
      } else if (mode === 'reactive') {
        g = isHeld ? 1 : (r ? 0 : Math.max(0, glow[i] - dt * 2.4));
      } else if (mode === 'wave') {
        const k = keys[i];
        if (isHeld) g = 1;
        if (r) {
          for (const j of held) {
            const h = keys[j];
            const d = Math.hypot((k.x - h.x) * 0.55, k.y - h.y);
            g = Math.max(g, 1 - d / 2.6);
          }
        } else {
          for (const w of waves) {
            const age = (now - w.t0) / 1000;
            const rad = age * WAVE_SPEED;
            const d = Math.hypot((k.x - w.x) * 0.55, k.y - w.y);
            const ring = 1 - Math.abs(d - rad) / 1.6;
            const fade = 1 - (now - w.t0) / WAVE_LIFE;
            if (ring > 0) g = Math.max(g, ring * fade);
          }
        }
      }
      g = Math.max(0, Math.min(1, g));
      if (Math.abs(g - glow[i]) > 0.004 || (g === 0 && glow[i] !== 0)) {
        glow[i] = g;
        keys[i].el.style.setProperty('--g', g.toFixed(3));
      }
      if (g > 0 && mode !== 'static') active = true;
    }
    if (active || waves.length) requestAnimationFrame(tick);
    else running = false;
  }

  /* ------------------------------------------------------------------ */
  /* Tape + stats                                                        */
  const tape = $('.tape');
  const tapeText = $('[data-tape]');
  const tapeOut = $('[data-tape-out]');
  const countEl = $('[data-count]');
  const lastEl = $('[data-last]');
  const ledCaps = $('[data-led="caps"]');
  const rhythm = $('[data-rhythm]');
  const rctx = rhythm.getContext('2d');
  let text = '';

  function setText(s) {
    text = s.length > 400 ? s.slice(-400) : s;
    tapeOut.textContent = text;
    tape.classList.toggle('has-text', text.length > 0);
    tapeText.scrollLeft = tapeText.scrollWidth;
  }

  function drawRhythm() {
    const dpr = window.devicePixelRatio || 1;
    const W = rhythm.clientWidth || 300, H = rhythm.clientHeight || 32;
    if (rhythm.width !== Math.round(W * dpr) || rhythm.height !== Math.round(H * dpr)) {
      rhythm.width = Math.round(W * dpr); rhythm.height = Math.round(H * dpr);
    }
    rctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rctx.clearRect(0, 0, W, H);
    const N = 48, bw = W / N;
    const arr = state.intervals;
    const accent = getComputedStyle(body).getPropertyValue('--accent').trim() || '#ff5a1f';
    for (let i = 0; i < N; i++) {
      const v = arr[arr.length - N + i];
      let h = 2;
      if (v != null) h = Math.max(3, Math.min(1, 240 / v) * H);
      rctx.fillStyle = v == null ? 'rgba(255,255,255,.12)' : (i === N - 1 ? accent : 'rgba(255,255,255,.55)');
      rctx.fillRect(i * bw + 1, H - h, Math.max(1, bw - 2), h);
    }
  }
  drawRhythm();
  window.addEventListener('resize', drawRhythm);

  function record() {
    state.count++;
    countEl.textContent = state.count;
    const now = performance.now();
    if (state.lastT) {
      const iv = now - state.lastT;
      if (iv < 3000) {
        state.intervals.push(iv);
        if (state.intervals.length > 64) state.intervals.shift();
        lastEl.textContent = Math.round(iv) + ' ms since last';
      } else {
        lastEl.textContent = 'paused';
      }
    } else {
      lastEl.textContent = 'first press';
    }
    state.lastT = now;
    drawRhythm();
  }

  function charFor(k) {
    if (k.code === 'Space') return ' ';
    if (k.code === 'Tab') return '\t';
    if (/^Key[A-Z]$/.test(k.code)) {
      const up = state.shift !== state.caps;
      return up ? k.legend : k.legend.toLowerCase();
    }
    if (k.shift) return state.shift ? k.shift : k.legend;
    return null;
  }

  function type(k, ch) {
    if (k.code === 'Backspace') { setText(text.slice(0, -1)); return; }
    if (k.code === 'Enter') { setText(''); return; }
    if (ch != null) setText(text + ch);
  }

  /* ------------------------------------------------------------------ */
  /* Press / release                                                     */
  function press(k, opts) {
    opts = opts || {};
    if (held.has(k.i)) return;
    held.add(k.i);
    k.el.classList.add('down');
    Snd.play(state.sw, k.w, 'press');
    record();
    if (state.light === 'wave' && !reduced()) waves.push({ x: k.x, y: k.y, t0: performance.now() });
    if (state.light !== 'off') kick();

    // typing
    if (opts.pointer) {
      if (k.code === 'ShiftLeft' || k.code === 'ShiftRight') {
        state.shift = !state.shift;
        $$('.key[data-code^="Shift"]').forEach(e => e.classList.toggle('locked', state.shift));
        return;
      }
      if (k.code === 'CapsLock') { state.caps = !state.caps; ledCaps.classList.toggle('on', state.caps); return; }
      const ch = charFor(k);
      type(k, ch);
      if (state.shift && (ch != null || k.code === 'Backspace')) {
        state.shift = false;
        $$('.key[data-code^="Shift"]').forEach(e => e.classList.remove('locked'));
      }
    } else {
      if (k.code === 'CapsLock') { state.caps = !state.caps; ledCaps.classList.toggle('on', state.caps); return; }
      type(k, opts.ch);
    }
  }

  function release(k) {
    if (!held.has(k.i)) return;
    held.delete(k.i);
    k.el.classList.remove('down');
    Snd.play(state.sw, k.w, 'release');
    if (state.light !== 'off') kick();
  }

  function releaseAll() { for (const i of Array.from(held)) release(keys[i]); }

  // physical keyboard
  const PREVENT = new Set(['Space', 'Backspace', 'Quote', 'Slash']);
  function typingElsewhere(t) {
    return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
  }
  window.addEventListener('keydown', e => {
    if (typingElsewhere(e.target)) return;
    const k = byCode.get(e.code);
    if (!k) return;
    if (!e.metaKey && !e.ctrlKey && !e.altKey && PREVENT.has(e.code)) e.preventDefault();
    if (e.repeat) return;
    const ch = (!e.metaKey && !e.ctrlKey && e.key.length === 1) ? e.key : null;
    press(k, { ch });
  });
  window.addEventListener('keyup', e => {
    const k = byCode.get(e.code);
    if (k) release(k);
    if (e.key === 'Meta') releaseAll();
  });
  window.addEventListener('blur', releaseAll);
  document.addEventListener('visibilitychange', () => { if (document.hidden) releaseAll(); });

  // pointer
  let pointerKey = null;
  kb.addEventListener('pointerdown', e => {
    const el = e.target.closest('.key');
    if (!el) return;
    e.preventDefault();
    pointerKey = el._k;
    press(pointerKey, { pointer: true });
  });
  function pointerEnd() { if (pointerKey) { release(pointerKey); pointerKey = null; } }
  window.addEventListener('pointerup', pointerEnd);
  window.addEventListener('pointercancel', pointerEnd);
  // keyboard activation of a focused key (Enter/Space via Tab navigation)
  kb.addEventListener('click', e => {
    if (e.detail !== 0) return;
    const el = e.target.closest('.key');
    if (!el) return;
    press(el._k, { pointer: true });
    setTimeout(() => release(el._k), 90);
  });

  /* ------------------------------------------------------------------ */
  /* Controls                                                            */
  const swCards = $$('[data-sw]');
  function setSwitch(v) {
    state.sw = v;
    body.dataset.switch = v;
    swCards.forEach(c => c.classList.toggle('is-selected', c.dataset.sw === v));
    const r = $(`input[name="switch"][value="${v}"]`);
    if (r && !r.checked) r.checked = true;
  }
  $('[data-seg="switch"]').addEventListener('change', e => setSwitch(e.target.value));
  $('[data-seg="light"]').addEventListener('change', e => {
    state.light = e.target.value;
    body.dataset.light = state.light;
    if (state.light === 'off') { for (let i = 0; i < keys.length; i++) { glow[i] = 0; keys[i].el.style.setProperty('--g', '0'); } }
    else kick();
  });
  $('[data-seg="caps"]').addEventListener('change', e => { body.dataset.caps = e.target.value; drawRhythm(); });
  setSwitch('tactile');

  $$('[data-sw-pick]').forEach(b => b.addEventListener('click', () => {
    const v = b.dataset.swPick;
    setSwitch(v);
    Snd.play(v, 1, 'press');
    setTimeout(() => Snd.play(v, 1, 'release'), 80);
  }));

  /* ------------------------------------------------------------------ */
  /* Cut-away figure                                                     */
  const cut = $('[data-cut]');
  const depthEl = $('[data-depth]');
  const capG = $('[data-capg]');
  const springG = $('[data-spring]');
  const leaf = $('[data-leaf]');
  const depthLine = $('[data-depth-line]');
  const status = $('[data-cut-status]');
  const ACT = 60;
  let actuated = false;

  function applyDepth(v) {
    v = Math.max(0, Math.min(100, v));
    const px = v * 0.3;
    capG.style.transform = `translateY(${px}px)`;
    springG.style.transform = `scaleY(${1 - v * 0.0038})`;
    depthLine.setAttribute('y2', 120 + px);
    const nowAct = v >= ACT;
    if (nowAct !== actuated) {
      actuated = nowAct;
      cut.classList.toggle('is-actuated', nowAct);
      leaf.style.transform = nowAct ? 'translateX(-5px)' : '';
      Snd.play(state.sw, 1, nowAct ? 'press' : 'release');
    }
    const label = v === 0 ? 'Resting' : v >= 100 ? 'Bottomed out' : nowAct ? 'Actuated' : 'Pre-travel';
    status.textContent = label;
    depthEl.setAttribute('aria-valuetext', label);
  }
  depthEl.addEventListener('input', () => applyDepth(+depthEl.value));

  let pressing = null;
  $('[data-press-once]').addEventListener('click', () => {
    if (pressing) cancelAnimationFrame(pressing);
    if (reduced()) {
      depthEl.value = 100; applyDepth(100);
      setTimeout(() => { depthEl.value = 0; applyDepth(0); }, 220);
      return;
    }
    const t0 = performance.now(), D = 380;
    const step = now => {
      const p = Math.min(1, (now - t0) / D);
      const v = p < 0.4 ? p / 0.4 : 1 - (p - 0.4) / 0.6;
      const e = v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2;
      depthEl.value = Math.round(e * 100);
      applyDepth(e * 100);
      if (p < 1) pressing = requestAnimationFrame(step); else { pressing = null; depthEl.value = 0; applyDepth(0); }
    };
    pressing = requestAnimationFrame(step);
  });

  /* ------------------------------------------------------------------ */
  /* Reserve form                                                        */
  const form = $('[data-res-form]');
  const email = $('#email', form);
  const msg = $('[data-res-msg]');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!email.value || !email.validity.valid) {
      email.setAttribute('aria-invalid', 'true');
      msg.textContent = 'Enter an email address.';
      email.focus();
      return;
    }
    email.removeAttribute('aria-invalid');
    form.classList.add('is-done');
    msg.textContent = `Noted. We will write to ${email.value} once, when KEY-01 is ready.`;
  });
  email.addEventListener('input', () => { if (email.getAttribute('aria-invalid')) { email.removeAttribute('aria-invalid'); msg.textContent = ''; } });
})();
