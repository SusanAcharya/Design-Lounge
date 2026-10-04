(() => {
  'use strict';

  const doc = document.documentElement;
  const body = document.body;
  doc.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  requestAnimationFrame(() => requestAnimationFrame(() => body.classList.remove('preload')));

  async function writeClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
    } catch (e) { /* the visual confirmation still runs */ }
  }

  /* ---------- WebGL shader hero ---------- */
  function shaderHero() {
    const canvas = document.getElementById('gl');
    const hero = document.querySelector('.hero');
    const pauseBtn = document.getElementById('pause');
    const pauseLabel = pauseBtn.querySelector('span');
    if (!canvas || !hero) return;

    const VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
    const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_oct;
uniform vec2 u_off;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;mat2 r=mat2(.8,.6,-.6,.8);
  for(int i=0;i<6;i++){if(float(i)>=u_oct)break;v+=a*noise(p);p=r*p*2.02;a*=.5;}
  return v;
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  vec2 p=(gl_FragCoord.xy-.5*u_res)/u_res.y+u_off;
  vec2 m=(u_mouse-.5*u_res)/u_res.y+u_off;
  float t=u_time*.035;
  float d=length(p-m);
  float pull=exp(-d*d*5.);
  vec2 q=vec2(fbm(p*1.3+vec2(0.,t)),fbm(p*1.3+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p*1.5+2.*q+vec2(1.7,9.2)+t*.6+(m-p)*pull*.35),
              fbm(p*1.5+2.*q+vec2(8.3,2.8)-t*.4));
  float f=clamp((fbm(p*1.7+2.4*r)-.5)*2.4+.5,0.,1.);
  vec3 bg=vec3(.078,.075,.067);
  vec3 surf=vec3(.141,.137,.125);
  vec3 soft=vec3(.271,.212,.122);
  vec3 lamp=vec3(.878,.639,.294);
  vec3 c=mix(bg,surf,smoothstep(.05,.45,f));
  c=mix(c,soft,smoothstep(.4,.75,f)*(.5+.5*clamp(length(q),0.,1.)));
  c=mix(c,lamp,smoothstep(.62,.98,f+.3*(r.x-.5)+pull*.08)*.62);
  c+=lamp*pull*.04;
  c*=1.-.6*dot(uv-.5,uv-.5);
  gl_FragColor=vec4(c,1.);
}`;

    let gl, prog, uRes, uTime, uMouse, uOct, uOff;
    let raf = 0, last = 0, time = 14, visible = true, paused = false, failed = false;
    let probeN = 0, probeMs = 0, probeDone = false;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    function fail() {
      failed = true;
      cancelAnimationFrame(raf);
      body.classList.add('no-gl');
      canvas.classList.remove('on');
    }

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    }

    try {
      gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
      if (!gl) throw new Error('no webgl');
      prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'a');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      uRes = gl.getUniformLocation(prog, 'u_res');
      uTime = gl.getUniformLocation(prog, 'u_time');
      uMouse = gl.getUniformLocation(prog, 'u_mouse');
      uOct = gl.getUniformLocation(prog, 'u_oct');
      uOff = gl.getUniformLocation(prog, 'u_off');
    } catch (e) {
      fail();
      return;
    }

    function isPhone() { return innerWidth < 640; }

    function rest() {
      mouse.tx = canvas.width * 0.72;
      mouse.ty = canvas.height * 0.5;
    }

    function resize() {
      const cap = Math.min(window.devicePixelRatio || 1, 1.5) * (isPhone() ? 0.75 : 1);
      const w = Math.max(1, Math.round(canvas.clientWidth * cap));
      const h = Math.max(1, Math.round(canvas.clientHeight * cap));
      if (w !== canvas.width || h !== canvas.height) {
        const first = canvas.width === 300 && canvas.height === 150;
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        rest();
        if (first || !mouse.x) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
        gl.uniform1f(uOct, isPhone() ? 3 : 5);
        gl.uniform2f(uOff, isPhone() ? 0.55 : 0, isPhone() ? 0.2 : 0);
        draw();
      }
    }

    function draw() {
      if (failed) return;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!canvas.classList.contains('on')) canvas.classList.add('on');
    }

    function frame(now) {
      const raw = now - last;
      last = now;
      if (!probeDone) {
        probeN++; probeMs += raw;
        if (probeN >= 30) {
          probeDone = true;
          if (probeMs / 30 > 28) { setPaused(true); return; }
        }
      }
      time += Math.min(raw, 50) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      draw();
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (raf || failed) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    function update() {
      if (visible && !document.hidden && !paused) start(); else stop();
    }
    function setPaused(p) {
      paused = p;
      pauseBtn.setAttribute('aria-pressed', String(p));
      pauseLabel.textContent = p ? 'Play motion' : 'Pause motion';
      update();
    }

    pauseBtn.addEventListener('click', () => setPaused(!paused));
    hero.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width * canvas.width;
      mouse.ty = (1 - (e.clientY - r.top) / r.height) * canvas.height;
    });
    hero.addEventListener('pointerleave', rest);
    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); fail(); });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; update(); }).observe(canvas);
    document.addEventListener('visibilitychange', update);
    let rt = 0;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 120); });

    resize();
    if (reduce.matches) setPaused(true); else update();
  }

  /* ---------- Header: hide on scroll + scrollspy ---------- */
  function header() {
    const top = document.getElementById('top');
    const DELTA = 8;
    let lastY = scrollY, ticking = false;

    function onScroll() {
      const y = scrollY, dy = y - lastY;
      if (Math.abs(dy) > DELTA) {
        const busy = body.classList.contains('menu-open') || top.contains(document.activeElement);
        if (dy > 0 && y > top.offsetHeight && !busy) top.classList.add('hidden');
        else if (dy < 0) top.classList.remove('hidden');
        lastY = y;
      }
      if (y <= 0) top.classList.remove('hidden');
      top.classList.toggle('raised', y > 0 && !top.classList.contains('hidden'));
      ticking = false;
    }
    addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    top.addEventListener('focusin', () => top.classList.remove('hidden'));

    const links = [...document.querySelectorAll('[data-link]')];
    const spy = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        links.forEach((a) => {
          if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('[data-spy]').forEach((s) => spy.observe(s));
  }

  /* ---------- Phone menu: circle reveal ---------- */
  function menu() {
    const btn = document.querySelector('.burger');
    const panel = document.getElementById('menu');
    const main = document.getElementById('main');
    const footer = document.querySelector('.site-footer');
    const links = [...panel.querySelectorAll('a')];
    const logo = document.querySelector('.top .logo');
    let open = false;

    function geometry() {
      const b = btn.getBoundingClientRect();
      const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      const r = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
      body.style.setProperty('--cx', cx + 'px');
      body.style.setProperty('--cy', cy + 'px');
      body.style.setProperty('--r', Math.ceil(r) + 'px');
    }

    function setOpen(next, returnFocus = true) {
      open = next;
      if (open) geometry();
      body.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      main.inert = open;
      footer.inert = open;
      logo.inert = open;
      if (open) {
        document.getElementById('top').classList.remove('hidden');
        setTimeout(() => { if (open) links[0].focus(); }, reduce.matches ? 0 : 200);
      } else if (returnFocus) {
        btn.focus();
      }
    }

    btn.addEventListener('click', () => setOpen(!open));
    links.forEach((a) => a.addEventListener('click', () => setOpen(false, false)));

    document.addEventListener('keydown', (e) => {
      if (!open) return;
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return; }
      if (e.key !== 'Tab') return;
      const ring = [btn, ...links];
      const i = ring.indexOf(document.activeElement);
      if (i === -1) { e.preventDefault(); btn.focus(); return; }
      if (e.shiftKey && i === 0) { e.preventDefault(); ring[ring.length - 1].focus(); }
      else if (!e.shiftKey && i === ring.length - 1) { e.preventDefault(); ring[0].focus(); }
    });

    matchMedia('(min-width: 901px)').addEventListener('change', (m) => { if (m.matches && open) setOpen(false, false); });
    addEventListener('resize', () => { if (open) geometry(); });
  }

  /* ---------- Roving tabs (hero trace card + install deck) ---------- */
  function tabs(listSel, onSelect) {
    const list = document.querySelector(listSel);
    if (!list) return null;
    const tabEls = [...list.querySelectorAll('[role="tab"]')];
    const panels = tabEls.map((t) => document.getElementById(t.getAttribute('aria-controls')));
    let index = 0;

    function select(i, focus) {
      index = (i + tabEls.length) % tabEls.length;
      tabEls.forEach((t, j) => {
        const on = j === index;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) tabEls[index].focus();
      if (onSelect) onSelect(panels[index], index);
    }

    tabEls.forEach((t, j) => t.addEventListener('click', () => select(j, false)));
    list.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); select(index + 1, true); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); select(index - 1, true); }
      else if (e.key === 'Home') { e.preventDefault(); select(0, true); }
      else if (e.key === 'End') { e.preventDefault(); select(tabEls.length - 1, true); }
    });
    return { current: () => panels[index] };
  }

  function flashCopied(btn, ms, labelEl) {
    clearTimeout(btn._t);
    btn.classList.add('copied');
    if (labelEl) labelEl.textContent = 'Copied';
    btn._t = setTimeout(() => {
      btn.classList.remove('copied');
      if (labelEl) labelEl.textContent = 'Copy';
    }, ms);
  }

  function heroCard() {
    const bar = document.querySelector('.tc-bar i');
    const slow = document.querySelector('.tc-slow');
    const copyBtn = document.getElementById('tc-copy');

    function syncTiming(panel) {
      const slowRow = panel.querySelector('.slow');
      const total = panel.querySelector('.wf li .dur');
      const ms = slowRow.querySelector('.dur').textContent.trim();
      bar.style.setProperty('--f', (parseFloat(ms) / parseFloat(total.textContent)).toFixed(3));
      slow.textContent = ms + ' ms';
      bar.style.animation = 'none';
      void bar.offsetWidth;
      bar.style.animation = '';
    }

    const t = tabs('.tc-tabs', (panel) => syncTiming(panel));
    syncTiming(t.current());

    copyBtn.addEventListener('click', () => {
      writeClipboard(t.current().dataset.cmd);
      flashCopied(copyBtn, 1400, copyBtn.querySelector('span'));
    });

    document.querySelectorAll('.chip-copy').forEach((b) => {
      b.addEventListener('click', () => {
        writeClipboard(b.dataset.copy);
        flashCopied(b, 1400);
      });
    });
  }

  function deck() {
    const file = document.getElementById('deck-file');
    const copyBtn = document.getElementById('deck-copy');
    const t = tabs('.deck-tabs', (panel) => { file.textContent = panel.dataset.file; });
    copyBtn.addEventListener('click', () => {
      writeClipboard(t.current().innerText);
      flashCopied(copyBtn, 1600, copyBtn.querySelector('span'));
    });
  }

  /* ---------- Sticky scroll steps ---------- */
  function steps() {
    const viz = document.querySelector('.viz');
    const items = [...document.querySelectorAll('.step')];
    if (!viz || !items.length) return;

    function set(n) {
      n = String(n);
      viz.dataset.step = n;
      items.forEach((s) => {
        const on = s.dataset.s === n;
        s.classList.toggle('on', on);
        s.querySelector('.num-btn').setAttribute('aria-current', on ? 'step' : 'false');
      });
    }

    items.forEach((s) => {
      s.querySelector('.num-btn').addEventListener('click', () => {
        set(s.dataset.s);
        s.scrollIntoView({ block: 'center', behavior: reduce.matches ? 'auto' : 'smooth' });
      });
    });

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) set(e.target.dataset.s); });
      }, { rootMargin: '-45% 0px -50% 0px' });
      items.forEach((s) => io.observe(s));
    }
  }

  /* ---------- Text scramble reveal (section titles only) ---------- */
  function scramble() {
    const GLYPHS = '<>-_\\/[]{}=+*^?#%&@!;:~';
    const pick = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    const targets = [...document.querySelectorAll('[data-scramble]')];
    if (!targets.length || reduce.matches || !('IntersectionObserver' in window)) return;

    function play(el) {
      const text = el.textContent;
      const sr = document.createElement('span');
      sr.className = 'sr-only';
      sr.textContent = text;
      const vis = document.createElement('span');
      vis.setAttribute('aria-hidden', 'true');

      const cells = [];
      text.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { vis.appendChild(document.createTextNode(' ')); return; }
        const w = document.createElement('span');
        w.className = 'scr-w';
        [...part].forEach((ch) => {
          const c = document.createElement('span');
          c.className = 'scr-c';
          c.textContent = ch;
          w.appendChild(c);
          cells.push({ el: c, ch });
        });
        vis.appendChild(w);
      });

      el.textContent = '';
      el.append(sr, vis);
      cells.forEach((c) => { c.el.style.width = c.el.getBoundingClientRect().width + 'px'; });

      const n = cells.length;
      const at = cells.map((c, k) => 150 + (k / n) * 600 + Math.random() * 150);
      const glyph = cells.map(pick);
      const startT = performance.now();
      let frameN = 0;

      (function step(now) {
        const t = now - startT;
        frameN++;
        let done = true;
        for (let k = 0; k < n; k++) {
          const c = cells[k];
          if (t >= at[k]) {
            if (!c.done) { c.el.textContent = c.ch; c.el.classList.remove('scr-g'); c.done = true; }
          } else {
            done = false;
            if (frameN % 3 === 1) glyph[k] = pick();
            c.el.textContent = glyph[k];
            c.el.classList.add('scr-g');
          }
        }
        if (!done) requestAnimationFrame(step);
        else el.textContent = text;
      })(startT);
    }

    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        play(e.target);
      });
    }, { rootMargin: '0px 0px -20% 0px' });

    const startObserving = () => targets.forEach((el) => io.observe(el));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(startObserving);
    else startObserving();
  }

  /* ---------- Entry reveals ---------- */
  function reveals() {
    const els = [...document.querySelectorAll('.reveal')];
    if (reduce.matches || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((es) => {
      es.forEach((e, i) => {
        if (!e.isIntersecting) return;
        e.target.style.transitionDelay = (i * 60) + 'ms';
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Footer: accordions + newsletter ---------- */
  function footer() {
    const mq = matchMedia('(max-width: 639px)');
    const heads = [...document.querySelectorAll('.col h2 button')];

    function mode() {
      heads.forEach((b) => {
        const panel = document.getElementById(b.getAttribute('aria-controls'));
        if (mq.matches) {
          b.removeAttribute('tabindex');
          b.setAttribute('aria-expanded', 'false');
          panel.classList.remove('open');
          panel.inert = true;
        } else {
          b.setAttribute('tabindex', '-1');
          b.removeAttribute('aria-expanded');
          panel.classList.add('open');
          panel.inert = false;
        }
      });
    }
    heads.forEach((b) => b.addEventListener('click', () => {
      if (!mq.matches) return;
      const panel = document.getElementById(b.getAttribute('aria-controls'));
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('open', open);
      panel.inert = !open;
    }));
    mq.addEventListener('change', mode);
    mode();

    const form = document.querySelector('.news');
    const input = document.getElementById('email');
    const hint = document.getElementById('email-hint');
    const HINT = 'One email a month. Unsubscribe in one click.';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        input.setAttribute('aria-invalid', 'true');
        hint.className = 'hint-line err';
        hint.textContent = v ? 'That address is missing something. Check it and try again.' : 'Enter an email address to get the changelog.';
        input.focus();
        return;
      }
      input.removeAttribute('aria-invalid');
      input.value = '';
      hint.className = 'hint-line ok';
      hint.textContent = 'Subscribed. The next changelog lands on 1 November.';
    });
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') {
        input.removeAttribute('aria-invalid');
        hint.className = 'hint-line';
        hint.textContent = HINT;
      }
    });
  }

  shaderHero();
  header();
  menu();
  heroCard();
  deck();
  steps();
  scramble();
  reveals();
  footer();
})();
