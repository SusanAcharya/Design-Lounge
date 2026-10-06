/* Aadhi Raat Records · Designed using Design Lounge (https://www.designlounge.live) */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const pad = n => String(n).padStart(2, '0');
  const SESSION_END = 300; // minutes after midnight: the first bell, around 05:00

  /* ---------- The takes (example catalogue) ---------- */
  const TAKES = [
    { time: '00:07', min: 7, title: 'Madal in a shuttered shop', short: 'Madal, Asan', where: 'Asan', on: 'Madal, two hands',
      line: 'Seven minutes past midnight. The shutters are down and the drum is the loudest thing in the bazaar.', voice: 'madal' },
    { time: '01:14', min: 74, title: 'Sarangi on a Thamel rooftop', short: 'Sarangi, Thamel', where: 'Thamel', on: 'Sarangi, one bow',
      line: 'The bars below have closed. One bowed string carries over the water tanks and the roofs.', voice: 'sarangi' },
    { time: '02:51', min: 171, title: 'Tanpura drone in a Naxal room', short: 'Tanpura, Naxal', where: 'Naxal', on: 'Tanpura, four strings',
      line: 'The deepest part of the night. Four strings, plucked in a ring, until the room hums with them.', voice: 'tanpura' },
    { time: '04:46', min: 286, title: 'The kora at Boudha, until the bell', short: 'Kora, Boudha', where: 'Boudha', on: 'Feet, wheels, a bell',
      line: 'Fourteen minutes before the session ends. Walkers circle the stupa, wheels turn, and the first bell closes the take.', voice: 'kora' }
  ];

  /* ---------- Sleeve art: drawn per take ---------- */
  const SV = (inner, t) => `<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${inner}<text x="14" y="186" fill="currentColor" stroke="none" font-family="JetBrains Mono, monospace" font-size="11" letter-spacing=".5">${t}</text><text x="186" y="186" text-anchor="end" fill="currentColor" stroke="none" font-family="Instrument Serif, serif" font-style="italic" font-size="15">Aadhi Raat</text></svg>`;
  const ART = {
    madal(t) {
      let lace = '';
      for (let k = 0; k <= 24; k++) {
        const a = (k / 24) * Math.PI * 2, r = k % 2 ? 76 : 60;
        lace += `${k ? 'L' : 'M'}${(100 + Math.cos(a) * r).toFixed(1)} ${(92 + Math.sin(a) * r).toFixed(1)}`;
      }
      return SV(`<circle cx="100" cy="92" r="60"/><circle cx="100" cy="92" r="48" opacity=".55"/><path d="${lace}" opacity=".8"/><circle cx="100" cy="92" r="15" fill="var(--sleeve-mark)" stroke="none"/>`, t);
    },
    sarangi(t) {
      let s = '';
      [84, 94, 106, 116].forEach(x => { s += `<path d="M${x} 22V160"/><circle cx="${x}" cy="22" r="3"/>`; });
      for (let x = 70; x <= 130; x += 4) s += `<path d="M${x} 60V140" opacity=".22"/>`;
      return SV(`${s}<path d="M28 132C70 104 128 86 176 78" stroke="var(--sleeve-mark)" stroke-width="2.2"/><path d="M30 138C72 110 130 92 178 84" opacity=".5"/>`, t);
    },
    tanpura(t) {
      let s = '';
      for (let r = 0; r < 7; r++) {
        const y = 40 + r * 18, amp = 16 - r * 2, mark = r === 3;
        let d = `M20 ${y}`;
        for (let x = 20; x <= 180; x += 4) d += `L${x} ${(y + Math.sin((x / 160) * Math.PI * (3 + r * .5)) * amp * Math.sin(((x - 20) / 160) * Math.PI)).toFixed(1)}`;
        s += `<path d="${d}" ${mark ? 'stroke="var(--sleeve-mark)" stroke-width="2.2"' : `opacity="${(1 - r * .1).toFixed(2)}"`}/>`;
      }
      return SV(s, t);
    },
    kora(t) {
      return SV(`<ellipse cx="100" cy="112" rx="78" ry="34" stroke-dasharray="2 6" opacity=".8"/><path d="M50 128A50 50 0 0 1 150 128Z"/><path d="M88 78h24v-14H88z"/><path d="M92 64l8-30 8 30" opacity=".85"/><path d="M40 128h120"/><g stroke="var(--sleeve-mark)" stroke-width="2"><path d="M150 34c0-8 6-12 10-12s10 4 10 12l2 12h-24z"/><path d="M157 50a3 3 0 0 0 6 0"/></g>`, t);
    }
  };

  /* ---------- Build the takes ---------- */
  const stack = $('.stack');
  const pins = $('.ruler-pins');
  const footTakes = $('.foot-takes');
  TAKES.forEach((tk, i) => {
    const li = document.createElement('li');
    li.style.setProperty('--i', i);
    li.id = `take-${i}`;
    li.innerHTML = `
      <article class="card c${i}" aria-labelledby="take-title-${i}">
        <div class="card-art">
          <div class="art-sleeve" style="transform:translateX(-14%)">
            <div class="disc" data-disc="${i}"><span class="disc-label"></span></div>
            <div class="sleeve">${ART[tk.voice](tk.time)}</div>
          </div>
        </div>
        <div class="card-txt">
          <p class="card-top"><span>Example take</span><span>${tk.where}, Kathmandu</span></p>
          <p class="card-time" aria-label="Tape rolled at ${tk.time}">${tk.time}</p>
          <h3 id="take-title-${i}">${tk.title}</h3>
          <p class="card-line">${tk.line}</p>
          <dl class="card-meta">
            <div><dt>On the tape</dt><dd>${tk.on}</dd></div>
            <div><dt>Sketch</dt><dd><span class="num">0:08</span>, made in your browser</dd></div>
          </dl>
          <button class="btn card-play" type="button" data-take="${i}" aria-pressed="false">
            <svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6l12 6-12 6z"/></svg>
            <svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>
            <span>Play the ${tk.time} take</span>
          </button>
        </div>
      </article>`;
    stack.append(li);

    const pin = document.createElement('button');
    pin.type = 'button';
    pin.className = 'pin' + (i === 0 ? ' on' : '');
    pin.style.left = `${(tk.min / SESSION_END) * 100}%`;
    pin.setAttribute('aria-label', `Go to the ${tk.time} take`);
    pin.innerHTML = '<i></i>';
    pin.addEventListener('click', () => goToTake(i));
    pins.append(pin);

    const fli = document.createElement('li');
    fli.innerHTML = `<a href="#take-${i}"><span class="num">${tk.time}</span>${tk.short}</a>`;
    footTakes.append(fli);
  });
  const heroSleeve = $('.hero-sleeve .sleeve');
  heroSleeve.innerHTML = ART.madal('00:07');

  /* ruler hours */
  const hours = $('.ruler-hours');
  for (let m = 0; m <= SESSION_END; m += 15) {
    const tick = document.createElement('i');
    tick.className = 'tick' + (m % 60 === 0 ? ' hour' : '');
    tick.style.left = `${(m / SESSION_END) * 100}%`;
    hours.append(tick);
    if (m % 60 === 0) {
      const hl = document.createElement('span');
      hl.className = 'hl' + (m === SESSION_END ? ' end' : '') + (m === SESSION_END - 60 ? ' near-end' : '');
      hl.style.left = `${(m / SESSION_END) * 100}%`;
      hl.textContent = m === SESSION_END ? 'First bell' : `${pad(m / 60)}:00`;
      hours.append(hl);
    }
  }

  /* ---------- Kathmandu clock ---------- */
  const ktmNow = () => {
    const d = new Date();
    const mins = (d.getUTCHours() * 60 + d.getUTCMinutes() + 345) % 1440;
    return { mins, h: Math.floor(mins / 60), m: mins % 60 };
  };
  const span = mins => {
    const h = Math.floor(mins / 60), m = mins % 60;
    return h ? `${h} h ${pad(m)} m` : `${m} m`;
  };
  const needle = $('.ruler-needle');
  const rulerRead = $('.ruler-read');
  const status = $('[data-status]');
  let lastMin = -1;
  function tickClock() {
    const now = ktmNow();
    if (now.mins === lastMin) return;
    lastMin = now.mins;
    const hhmm = `${pad(now.h)}:${pad(now.m)}`;
    $$('[data-clock]').forEach(el => { el.textContent = hhmm; });
    const rolling = now.mins < SESSION_END;
    const studio = $('[data-studio]');
    if (rolling) {
      studio.textContent = `Tape rolling. ${span(SESSION_END - now.mins)} to the first bell`;
      needle.hidden = false;
      needle.style.left = `${(now.mins / SESSION_END) * 100}%`;
      needle.querySelector('span').textContent = `Now ${hhmm}`;
      rulerRead.textContent = `Tape rolling now in Kathmandu, ${hhmm}`;
      status.classList.add('live');
      $('[data-status-text]').textContent = `Tape rolling in Kathmandu, ${hhmm}`;
    } else {
      const until = 1440 - now.mins;
      studio.textContent = `Dark. The tape rolls in ${span(until)}`;
      needle.hidden = true;
      rulerRead.innerHTML = `Kathmandu <span class="num">${hhmm}</span>. Studio dark, the tape rolls in ${span(until)}`;
      status.classList.remove('live');
      $('[data-status-text]').textContent = `Studio dark until 00:00 Kathmandu time, ${span(until)} from now`;
    }
  }
  tickClock();
  setInterval(tickClock, 5000);

  /* ---------- Hero entrance ---------- */
  const hero = $('.hero');
  let settleTimer;
  function playHero() {
    hero.classList.remove('play', 'settled');
    void hero.offsetWidth;
    hero.classList.add('play');
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => hero.classList.add('settled'), 1900);
  }
  requestAnimationFrame(playHero);
  $('[data-replay="hero"]').addEventListener('click', playHero);
  $('.stage').addEventListener('click', e => { if (!e.target.closest('a, button')) playHero(); });

  /* ---------- The rule: mask line reveal on enter ---------- */
  const rule = $('.rule');
  const playRule = () => { rule.classList.remove('go'); void rule.offsetWidth; rule.classList.add('go'); };
  if ('IntersectionObserver' in window && !reduce.matches) {
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { playRule(); io.disconnect(); } });
    }, { threshold: .3 });
    io.observe(rule);
  } else {
    rule.classList.add('go');
  }
  $('[data-replay="rule"]').addEventListener('click', playRule);

  /* ---------- Stack: fallback, active pin, jump ---------- */
  const lis = $$('.stack > li');
  const cards = $$('.stack .card');
  const pinEls = $$('.pin');
  const naturalTops = () => {
    const cs = getComputedStyle(stack);
    let y = stack.getBoundingClientRect().top + scrollY + parseFloat(cs.paddingTop);
    return lis.map((li, i) => {
      if (i) y += parseFloat(getComputedStyle(li).marginTop);
      const top = y;
      y += li.offsetHeight;
      return top;
    });
  };
  function goToTake(i) {
    const top = naturalTops()[i];
    scrollTo({ top: Math.ceil(top) + 1, behavior: reduce.matches ? 'auto' : 'smooth' });
  }
  const scrubFallback = !CSS.supports('animation-timeline: view()');
  if (scrubFallback && !reduce.matches) {
    cards.slice(0, -1).forEach(c => { c.style.animation = 'recede 1s linear both paused'; });
  }
  let ticking = false, active = 0;
  function onScroll() {
    ticking = false;
    const tops = naturalTops();
    let a = 0;
    tops.forEach((t, i) => { if (scrollY >= t - innerHeight * .45) a = i; });
    if (a !== active) {
      active = a;
      pinEls.forEach((p, i) => p.classList.toggle('on', i === a));
    }
    if (scrubFallback && !reduce.matches) {
      const r = stack.getBoundingClientRect();
      const p = (-r.top) / r.height;
      cards.slice(0, -1).forEach((c, i) => {
        const t = clamp(p * cards.length - i);
        c.style.animationDelay = `${-t}s`;
      });
    }
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Sound: each take is synthesised, never loaded ---------- */
  const SA = 138.59; // C#3
  const nf = s => SA * Math.pow(2, s / 12);
  let ctx, bus, master, analyser;
  function ensureAudio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = .85;
      analyser = ctx.createAnalyser(); analyser.fftSize = 2048;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 3;
      bus = ctx.createGain();
      const verb = ctx.createConvolver();
      verb.buffer = impulse(3.2, 2.4);
      const wet = ctx.createGain(); wet.gain.value = .32;
      bus.connect(master); bus.connect(verb); verb.connect(wet); wet.connect(master);
      master.connect(comp); comp.connect(analyser); analyser.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }
  function impulse(dur, decay) {
    const len = Math.floor(ctx.sampleRate * dur), b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return b;
  }
  let noiseBuf;
  function noise() {
    if (!noiseBuf) {
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true; return s;
  }
  function env(g, t, a, peak, d) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }
  function osc(type, f, t0, t1, out) {
    const o = ctx.createOscillator(); o.type = type; o.frequency.value = f;
    o.connect(out); o.start(t0); o.stop(t1); return o;
  }
  function drone(t0, out, level) {
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(level, t0 + 1.2);
    g.gain.setValueAtTime(level, t0 + 6.8);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 8);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700;
    g.connect(lp); lp.connect(out);
    osc('triangle', nf(-12), t0, t0 + 8, g);
    osc('triangle', nf(-5) * 1.002, t0, t0 + 8, g);
  }
  const VOICES = {
    madal(t0, out) {
      drone(t0, out, .05);
      const pat = 'D.tDt.D.ttDt';
      const step = .2;
      for (let k = 0; k < 40; k++) {
        const ch = pat[k % pat.length], t = t0 + k * step + (k % 2 ? .012 : 0);
        if (t > t0 + 7.8) break;
        if (ch === 'D') {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.frequency.setValueAtTime(128, t); o.frequency.exponentialRampToValueAtTime(58, t + .32);
          env(g, t, .004, k % 12 === 0 ? .9 : .65, .42); o.connect(g); g.connect(out); o.start(t); o.stop(t + .5);
        } else if (ch === 't') {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = 'triangle'; o.frequency.setValueAtTime(410, t); o.frequency.exponentialRampToValueAtTime(330, t + .08);
          env(g, t, .002, .28, .1); o.connect(g); g.connect(out); o.start(t); o.stop(t + .15);
          const n = noise(), bp = ctx.createBiquadFilter(), ng = ctx.createGain();
          bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = 1.2;
          env(ng, t, .001, .22, .06); n.connect(bp); bp.connect(ng); ng.connect(out); n.start(t); n.stop(t + .1);
        }
      }
    },
    sarangi(t0, out) {
      drone(t0, out, .045);
      const o = ctx.createOscillator(); o.type = 'sawtooth';
      const o2 = ctx.createOscillator(); o2.type = 'sawtooth'; o2.detune.value = 7;
      const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 5.3; lg.gain.value = 3.2;
      lfo.connect(lg); lg.connect(o.frequency); lg.connect(o2.frequency);
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400; lp.Q.value = .8;
      const pk = ctx.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = 950; pk.gain.value = 7; pk.Q.value = 1.4;
      const g = ctx.createGain(); g.gain.value = 0.0001;
      o.connect(lp); o2.connect(lp); lp.connect(pk); pk.connect(g); g.connect(out);
      const phrase = [[0, .9], [3, .6], [5, .7], [3, .5], [0, .9], [-2, .5], [0, .8], [3, .4], [5, .4], [8, .9], [10, .5], [8, .45], [5, 1.1]];
      let t = t0 + .1;
      phrase.forEach(([s, d], k) => {
        const f = nf(s + 12);
        if (k === 0) { o.frequency.setValueAtTime(f, t); o2.frequency.setValueAtTime(f, t); }
        else { o.frequency.setTargetAtTime(f, t, .06); o2.frequency.setTargetAtTime(f, t, .06); }
        g.gain.setTargetAtTime(.16, t, .09);
        g.gain.setTargetAtTime(.1, t + d * .8, .05);
        t += d;
      });
      g.gain.setTargetAtTime(0.0001, Math.min(t, t0 + 7.6), .18);
      [o, o2, lfo].forEach(n => { n.start(t0); n.stop(t0 + 8); });
    },
    tanpura(t0, out) {
      const ring = [-5, 0, 0, -12];
      let k = 0;
      for (let t = t0 + .05; t < t0 + 7.2; t += .78, k++) {
        const f = nf(ring[k % 4]);
        const g = ctx.createGain(), lp = ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.Q.value = 2;
        lp.frequency.setValueAtTime(3600, t); lp.frequency.exponentialRampToValueAtTime(700, t + 2.4);
        env(g, t, .012, .12, 3.2);
        g.connect(lp); lp.connect(out);
        osc('sawtooth', f, t, t + 3.4, g);
        osc('sawtooth', f * 1.0035, t, t + 3.4, g);
        osc('sine', f * 2, t, t + 3.4, g);
      }
    },
    kora(t0, out) {
      const hum = ctx.createGain(); hum.gain.setValueAtTime(0.0001, t0);
      hum.gain.exponentialRampToValueAtTime(.09, t0 + 1.5); hum.gain.setValueAtTime(.09, t0 + 5.6);
      hum.gain.exponentialRampToValueAtTime(0.0001, t0 + 7.5);
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 480; bp.Q.value = 1.1;
      const am = ctx.createOscillator(), amg = ctx.createGain(); am.frequency.value = .45; amg.gain.value = .04;
      am.connect(amg); amg.connect(hum.gain); am.start(t0); am.stop(t0 + 8);
      hum.connect(bp); bp.connect(out);
      osc('sawtooth', nf(-12), t0, t0 + 8, hum);
      osc('sawtooth', nf(-5) * .998, t0, t0 + 8, hum);
      for (let t = t0 + .3, k = 0; t < t0 + 5.8; t += .42 + (k % 3) * .11, k++) {
        const n = noise(), hp = ctx.createBiquadFilter(), g = ctx.createGain();
        hp.type = 'highpass'; hp.frequency.value = 3200;
        env(g, t, .001, .1, .05); n.connect(hp); hp.connect(g); g.connect(out); n.start(t); n.stop(t + .08);
        if (k % 5 === 4) { const g2 = ctx.createGain(); env(g2, t, .002, .05, .5); g2.connect(out); osc('sine', 2093, t, t + .6, g2); }
      }
      const tb = t0 + 5.9, base = 196;
      [[.5, .5, 4.6], [1, .35, 4], [1.183, .18, 3.2], [1.506, .16, 2.8], [2, .14, 2.4], [2.514, .08, 1.9], [2.662, .07, 1.7], [3.011, .05, 1.4], [4.166, .04, 1]]
        .forEach(([r, a, d]) => { const g = ctx.createGain(); env(g, tb, .003, a, d); g.connect(out); osc('sine', base * r, tb, tb + d + .1, g); });
    }
  };

  /* ---------- Corner player ---------- */
  const player = $('.player');
  const pPlay = $('[data-p-play]');
  const pOpen = $('[data-p-open]');
  const canvas = $('.player-canvas');
  const g2d = canvas.getContext('2d');
  let current = 0, playing = false, voice = null, endTimer = null, raf = null;

  function setTake(i) {
    current = i;
    $('[data-p-time]').textContent = TAKES[i].time;
    $('[data-p-name]').textContent = TAKES[i].short;
    syncButtons();
  }
  function syncButtons() {
    const tk = TAKES[current];
    player.dataset.play = String(playing);
    pPlay.setAttribute('aria-pressed', String(playing));
    pPlay.setAttribute('aria-label', playing ? `Pause the ${tk.time} take` : `Play the ${tk.time} take`);
    $$('.card-play').forEach(b => {
      const i = +b.dataset.take, on = playing && i === current;
      b.setAttribute('aria-pressed', String(on));
      b.querySelector('span').textContent = `${on ? 'Pause' : 'Play'} the ${TAKES[i].time} take`;
    });
    const cta = $('.cta');
    const ctaOn = playing && current === 0;
    cta.querySelector('.cta-text').textContent = `${ctaOn ? 'Pause' : 'Play'} the 00:07 take`;
    $$('.disc').forEach(d => d.classList.toggle('spinning', playing && +d.dataset.disc === current));
  }
  function stop() {
    playing = false;
    clearTimeout(endTimer);
    if (voice && ctx) {
      const v = voice; voice = null;
      v.gain.setTargetAtTime(0.0001, ctx.currentTime, .05);
      setTimeout(() => v.disconnect(), 400);
    }
    const bar = $('.track i');
    bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
    syncButtons();
    drawIdle();
  }
  function play(i) {
    if (playing) stop();
    setTake(i);
    if (!ensureAudio()) return;
    voice = ctx.createGain(); voice.gain.value = 1; voice.connect(bus);
    VOICES[TAKES[i].voice](ctx.currentTime + .05, voice);
    playing = true;
    syncButtons();
    endTimer = setTimeout(stop, 8000);
    loop();
  }
  function toggle(i) {
    if (playing && current === i) stop(); else play(i);
  }
  pPlay.addEventListener('click', () => toggle(current));
  pOpen.addEventListener('click', () => {
    const open = player.dataset.open !== 'true';
    player.dataset.open = String(open);
    pOpen.setAttribute('aria-expanded', String(open));
    pOpen.setAttribute('aria-label', open ? 'Close player' : 'Open player');
    setTimeout(sizeCanvas, reduce.matches ? 0 : 380);
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-take]');
    if (b && !b.closest('.player')) toggle(+b.dataset.take);
  });

  function sizeCanvas() {
    const r = canvas.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
    if (!playing) drawIdle();
  }
  const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  function drawIdle() {
    const w = canvas.width, h = canvas.height;
    g2d.clearRect(0, 0, w, h);
    const tk = TAKES[current];
    g2d.strokeStyle = cssVar('--inverse-line') || '#3a3650';
    g2d.lineWidth = 1;
    const y = h * .62;
    g2d.beginPath(); g2d.moveTo(0, y); g2d.lineTo(w, y); g2d.stroke();
    g2d.fillStyle = cssVar('--primary-soft') || '#ebd7c3';
    const x = (tk.min / SESSION_END) * w;
    g2d.save(); g2d.translate(x, y); g2d.rotate(Math.PI / 4);
    const s = 5 * Math.min(2, devicePixelRatio || 1);
    g2d.fillRect(-s / 2, -s / 2, s, s); g2d.restore();
  }
  const wave = new Uint8Array(2048);
  function loop() {
    cancelAnimationFrame(raf);
    const draw = () => {
      if (!playing) { drawIdle(); return; }
      const w = canvas.width, h = canvas.height;
      analyser.getByteTimeDomainData(wave);
      g2d.clearRect(0, 0, w, h);
      g2d.strokeStyle = cssVar('--primary-soft') || '#ebd7c3';
      g2d.lineWidth = Math.min(2, devicePixelRatio || 1) * 1.25;
      g2d.beginPath();
      const n = wave.length, step = Math.max(1, Math.floor(n / w));
      for (let x = 0, i = 0; i < n; i += step, x++) {
        const v = (wave[i] - 128) / 128;
        const yy = h * .55 + v * h * .42;
        x === 0 ? g2d.moveTo(0, yy) : g2d.lineTo((i / n) * w, yy);
      }
      g2d.stroke();
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
  }
  addEventListener('resize', sizeCanvas);
  setTake(0);
  requestAnimationFrame(sizeCanvas);

  /* ---------- Send a tape: stepped brief ---------- */
  const form = $('.brief');
  const steps = $$('.step', form);
  const label = $('#step-label');
  const boxes = $$('.boxes i');
  const railItems = $$('.rail li');
  const back = $('[data-back]');
  const next = $('[data-next]');
  const sent = $('.sent');
  let cur = 1;
  const ccPin = $('.cc-pin');

  function show(n, focus = true) {
    cur = n;
    steps.forEach(s => {
      const on = +s.dataset.step === n;
      s.hidden = !on;
      s.classList.remove('enter');
      if (on && !reduce.matches) { void s.offsetWidth; s.classList.add('enter'); }
    });
    label.textContent = n <= 4 ? `Step ${n} of 4` : 'Review';
    boxes.forEach((b, i) => { b.classList.toggle('on', i + 1 === n); b.classList.toggle('done', i + 1 < n); });
    railItems.forEach((li, i) => {
      li.classList.toggle('done', i + 1 < n);
      if (i + 1 === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    back.hidden = n === 1;
    next.querySelector('span').textContent = n < 4 ? 'Next' : n === 4 ? 'Review' : 'Send the tape';
    if (n === 5) buildReview();
    if (focus) { const h = steps[n - 1].querySelector('h3'); h && h.focus({ preventScroll: false }); }
  }

  function setErr(input, errId, msg) {
    const e = document.getElementById(errId);
    e.textContent = msg || '';
    if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return msg ? input : null;
  }
  const alertSvg = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/></svg>';
  function groupErr(id, msg) {
    const e = document.getElementById(id);
    e.innerHTML = msg ? `${alertSvg}<span>${msg}</span>` : '';
  }
  const timeMins = v => { const m = /^(\d{2}):(\d{2})/.exec(v || ''); return m ? +m[1] * 60 + +m[2] : null; };

  function updateClockCheck() {
    const m = timeMins($('#f-time').value);
    if (m == null) { ccPin.className = 'cc-pin'; return; }
    const pos = clamp(((m - 1080 + 1440) % 1440) / 1080);
    ccPin.style.left = `${pos * 100}%`;
    ccPin.className = 'cc-pin ' + (m < SESSION_END ? 'in' : 'out');
  }
  $('#f-time').addEventListener('input', () => { updateClockCheck(); setErr($('#f-time'), 'e-time-f', ''); groupErr('e-time', ''); });
  $('#f-date').addEventListener('input', () => setErr($('#f-date'), 'e-date', ''));

  function validate(n) {
    if (n === 1) {
      const d = $('#f-date'), t = $('#f-time');
      const bad = [
        setErr(d, 'e-date', d.value ? '' : 'Choose the night you recorded.'),
        setErr(t, 'e-time-f', t.value ? '' : 'Enter the time the tape started.')
      ].filter(Boolean);
      groupErr('e-time', '');
      if (bad.length) return bad[0];
      const m = timeMins(t.value);
      if (m >= SESSION_END) {
        groupErr('e-time', `That take started at ${t.value}. We only release takes that start after midnight and before the first bell.`);
        t.setAttribute('aria-invalid', 'true');
        return t;
      }
      return null;
    }
    if (n === 2) {
      const boxesC = $$('input[name="what"]');
      if (!boxesC.some(b => b.checked)) { groupErr('e-what', 'Pick at least one sound, or choose Not sure yet.'); return boxesC[0]; }
      groupErr('e-what', ''); return null;
    }
    if (n === 3) {
      const l = $('#f-link'), p = $('#f-place');
      return [
        setErr(l, 'e-link', /^https?:\/\/\S+\.\S+/.test(l.value.trim()) ? '' : 'Paste a link that starts with https://.'),
        setErr(p, 'e-place', p.value.trim().length > 1 ? '' : 'Tell us where in Kathmandu you recorded it.')
      ].filter(Boolean)[0] || null;
    }
    if (n === 4) {
      const nm = $('#f-name'), em = $('#f-email'), ms = $('#f-msg');
      return [
        setErr(nm, 'e-name', nm.value.trim().length > 1 ? '' : 'Enter your name.'),
        setErr(em, 'e-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim()) ? '' : 'Enter an email like you@example.com.'),
        setErr(ms, 'e-msg', ms.value.trim().length >= 20 ? '' : 'Write at least 20 characters about the night.')
      ].filter(Boolean)[0] || null;
    }
    return null;
  }
  $$('input[name="what"]').forEach(b => b.addEventListener('change', () => groupErr('e-what', '')));
  [['#f-link', 'e-link'], ['#f-place', 'e-place'], ['#f-name', 'e-name'], ['#f-email', 'e-email'], ['#f-msg', 'e-msg']]
    .forEach(([s, id]) => $(s).addEventListener('input', () => setErr($(s), id, '')));
  $('#f-msg').addEventListener('input', e => { $('#c-msg').textContent = `${e.target.value.length} / 800 · at least 20 characters`; });

  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function buildReview() {
    const d = $('#f-date').value;
    const night = d ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    const rows = [
      ['When it rolled', `Night of ${night}, tape started ${$('#f-time').value}`, 1],
      ['What is on it', $$('input[name="what"]:checked').map(b => b.value).join(', '), 2],
      ['Where to hear it', `${$('#f-link').value.trim()} · ${$('#f-place').value.trim()}`, 3],
      ['Who you are', `${$('#f-name').value.trim()}, ${$('#f-email').value.trim()}`, 4]
    ];
    $('.review').innerHTML = rows.map(([k, v, s]) =>
      `<div><dt>${k}</dt><dd>${esc(v)}</dd><button class="edit" type="button" data-edit="${s}">Edit<span class="sr"> ${k}</span></button></div>`).join('');
  }
  $('.review').addEventListener('click', e => { const b = e.target.closest('[data-edit]'); if (b) show(+b.dataset.edit); });
  back.addEventListener('click', () => show(Math.max(1, cur - 1)));
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (cur < 5) {
      const bad = validate(cur);
      if (bad) { bad.focus(); return; }
      show(cur + 1);
      return;
    }
    next.setAttribute('aria-busy', 'true');
    next.querySelector('span').textContent = 'Sending';
    setTimeout(() => {
      next.removeAttribute('aria-busy');
      $('[data-sent-email]').textContent = $('#f-email').value.trim();
      form.hidden = true; sent.hidden = false;
      label.textContent = 'Sent';
      boxes.forEach(b => { b.classList.remove('on'); b.classList.add('done'); });
      railItems.forEach(li => { li.classList.add('done'); li.removeAttribute('aria-current'); });
      sent.querySelector('h3').focus();
    }, 700);
  });
  $('[data-reset]').addEventListener('click', () => {
    form.reset(); updateClockCheck();
    $('#c-msg').textContent = '0 / 800 · at least 20 characters';
    $$('[aria-invalid]', form).forEach(i => i.setAttribute('aria-invalid', 'false'));
    sent.hidden = true; form.hidden = false; show(1);
  });

  /* ---------- Footer: accordions below 640, newsletter ---------- */
  const mq = matchMedia('(max-width: 639px)');
  const heads = $$('.col h2 button');
  function footMode() {
    heads.forEach(b => {
      const panel = document.getElementById(b.getAttribute('aria-controls'));
      if (mq.matches) {
        b.removeAttribute('tabindex'); b.setAttribute('aria-expanded', 'false');
        panel.classList.remove('open'); panel.inert = true;
      } else {
        b.setAttribute('tabindex', '-1'); b.removeAttribute('aria-expanded');
        panel.classList.add('open'); panel.inert = false;
      }
    });
  }
  heads.forEach(b => b.addEventListener('click', () => {
    if (!mq.matches) return;
    const panel = document.getElementById(b.getAttribute('aria-controls'));
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('open', open); panel.inert = !open;
  }));
  mq.addEventListener('change', footMode);
  footMode();

  const news = $('.news'), nIn = $('#n-email'), nHint = $('#n-hint');
  const nDefault = nHint.textContent;
  news.addEventListener('submit', e => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nIn.value.trim())) {
      nIn.setAttribute('aria-invalid', 'true');
      nHint.className = 'news-hint bad';
      nHint.textContent = 'Enter an email like you@example.com.';
      nIn.focus();
      return;
    }
    nIn.value = ''; nIn.setAttribute('aria-invalid', 'false');
    nHint.className = 'news-hint ok';
    nHint.textContent = 'You are on the night list. The next email comes when a take is released.';
  });
  nIn.addEventListener('input', () => {
    if (nIn.getAttribute('aria-invalid') === 'true') { nIn.setAttribute('aria-invalid', 'false'); nHint.className = 'news-hint'; nHint.textContent = nDefault; }
  });
})();
