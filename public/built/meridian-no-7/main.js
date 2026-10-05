/* Meridian No. 7 · Designed using Design Lounge (https://www.designlounge.live) */
(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const rad = (d) => (d * Math.PI) / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const mod = (n, m) => ((n % m) + m) % m;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ================= The watch ================= */

  const R = 130;          // case radius
  const T = 64;           // case thickness
  const DIAL = 224;       // dial diameter
  const N_BAND = 48;
  const N_REHAUT = 32;
  const DIAL_Z = T / 2 - 6;

  const L = norm([-0.45, -0.6, 0.66]);
  const H = norm([L[0], L[1], L[2] + 1]);
  function norm(v) { const l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; }

  const M = () => new DOMMatrix();
  const normalOf = (m) => { const p = m.transformPoint(new DOMPoint(0, 0, 1, 0)); return [p.x, p.y, p.z]; };
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  function polar(cx, cy, r, deg) {
    return [cx + r * Math.sin(rad(deg)), cy - r * Math.cos(rad(deg))];
  }

  function dialSVG() {
    let s = '<svg viewBox="0 0 224 224" xmlns="http://www.w3.org/2000/svg">';
    s += '<circle cx="112" cy="112" r="109" class="d-ink-s" stroke-width=".5"/>';
    for (let i = 0; i < 60; i++) {
      const [x1, y1] = polar(112, 112, 104, i * 6);
      const [x2, y2] = polar(112, 112, 108.5, i * 6);
      s += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" class="d-ink-s" stroke-width="${i % 5 ? 0.6 : 1.4}"/>`;
    }
    for (let h = 0; h < 12; h++) {
      if (h === 6) continue;
      if (h === 0) {
        s += '<rect x="106.6" y="18" width="4" height="24" rx="1" class="baton"/><rect x="113.4" y="18" width="4" height="24" rx="1" class="baton"/>';
      } else {
        s += `<rect x="110" y="18" width="4" height="21" rx="1" class="baton" transform="rotate(${h * 30} 112 112)"/>`;
      }
    }
    s += '<text x="112" y="63" text-anchor="middle" class="d-ink" style="font:600 7px Inter, Arial, sans-serif;letter-spacing:.34em">MERIDIAN</text>';
    s += '<text x="112" y="82" text-anchor="middle" class="d-acc" style="font:italic 400 16px \'Instrument Serif\', Georgia, serif">No. 7</text>';
    s += '<circle cx="112" cy="156" r="24" class="d-ink-s" stroke-width=".6"/>';
    for (let i = 0; i < 60; i += 1) {
      const major = i % 5 === 0;
      const [x1, y1] = polar(112, 156, major ? 19.5 : 21.8, i * 6);
      const [x2, y2] = polar(112, 156, 23.4, i * 6);
      s += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" class="d-ink-s" stroke-width="${major ? 0.9 : 0.4}"/>`;
    }
    s += '<text x="112" y="197" text-anchor="middle" class="d-ink" style="font:500 5px Inter, Arial, sans-serif;letter-spacing:.3em">HAND WOUND</text>';
    s += '</svg>';
    return s;
  }

  const HANDS = {
    hour: '<svg viewBox="0 0 224 224"><path d="M112 50 L116.6 112 L112 121 L107.4 112 Z" class="h-fill"/></svg>',
    minute: '<svg viewBox="0 0 224 224"><path d="M112 17 L115.4 112 L112 123 L108.6 112 Z" class="h-fill"/><circle cx="112" cy="112" r="5" class="h-fill"/><circle cx="112" cy="112" r="1.8" class="d-gold"/></svg>',
    sec: '<svg viewBox="0 0 224 224"><line x1="112" y1="163" x2="112" y2="135" stroke="var(--primary)" stroke-width="1.3" stroke-linecap="round"/><circle cx="112" cy="156" r="2.4" class="d-gold"/></svg>'
  };

  /* The Calibre M7, drawn once and used on the caseback and on the craft plate. */
  function movementSVG(id, ring) {
    const stripes = [];
    for (let k = -260; k < 260; k += 9) stripes.push(`<line x1="${k}" y1="0" x2="${k + 260}" y2="260" class="mv-stripe"/>`);
    let s = `<svg viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg"${ring ? '' : ' aria-hidden="true"'}>`;
    s += `<defs>
      <clipPath id="${id}-win"><circle cx="130" cy="130" r="86"/></clipPath>
      <clipPath id="${id}-br"><path d="M50 128 Q56 66 118 50 L152 70 Q128 100 138 132 L88 162 Z"/><path d="M142 142 L204 120 Q218 152 198 184 L152 204 Q128 180 142 142 Z"/></clipPath>
      <path id="${id}-arc" d="M130,130 m-108,0 a108,108 0 1,1 216,0 a108,108 0 1,1 -216,0"/>
    </defs>`;
    if (ring) {
      s += `<circle cx="130" cy="130" r="122" fill="none" class="mv-screw" style="fill:none"/>`;
      s += `<circle cx="130" cy="130" r="96" fill="none" class="mv-screw" style="fill:none"/>`;
      s += `<text class="cb-text"><textPath href="#${id}-arc" startOffset="2%">MAISON MERIDIAN · MERIDIAN No. 7 · CALIBRE M7 · HAND WOUND · SAPPHIRE ·</textPath></text>`;
    }
    s += `<g clip-path="url(#${id}-win)">
      <circle cx="130" cy="130" r="86" class="mv-plate"/>
      <circle cx="100" cy="100" r="34" class="mv-wheel"/>
      <circle cx="152" cy="104" r="19" class="mv-wheel"/>
      <circle cx="168" cy="142" r="14" class="mv-wheel"/>
      <circle cx="150" cy="172" r="10" class="mv-wheel"/>
      <path d="M50 128 Q56 66 118 50 L152 70 Q128 100 138 132 L88 162 Z" class="mv-bridge"/>
      <path d="M142 142 L204 120 Q218 152 198 184 L152 204 Q128 180 142 142 Z" class="mv-bridge"/>
      <g clip-path="url(#${id}-br)">${stripes.join('')}</g>
      <g data-bal>
        <circle cx="94" cy="176" r="25" class="mv-balance"/>
        <path d="M94 151 V201 M69 176 H119" class="mv-balance" style="stroke-width:1.4"/>
      </g>
      <path d="M94 176 m0 -3 a3 3 0 1 1 -0.1 0 m0 -3 a6 6 0 1 1 -0.1 0 m0 -3 a9 9 0 1 1 -0.1 0 m0 -3 a12 12 0 1 1 -0.1 0" class="mv-spring"/>
      <path d="M44 214 L86 168 L102 178 L64 222 Z" class="mv-bridge"/>
      <circle cx="100" cy="100" r="10" class="mv-screw"/><path d="M93 100 H107" class="mv-screw"/>
      <circle cx="94" cy="176" r="3.4" class="mv-jewel"/>
      <circle cx="152" cy="104" r="3.4" class="mv-jewel"/>
      <circle cx="168" cy="142" r="3.2" class="mv-jewel"/>
      <circle cx="150" cy="172" r="3" class="mv-jewel"/>
      <circle cx="122" cy="62" r="3" class="mv-jewel"/>
      <circle cx="70" cy="120" r="4.5" class="mv-screw"/><path d="M67 117 L73 123" class="mv-screw"/>
      <circle cx="128" cy="112" r="4.5" class="mv-screw"/><path d="M125 115 L131 109" class="mv-screw"/>
      <circle cx="196" cy="160" r="4.5" class="mv-screw"/><path d="M193 157 L199 163" class="mv-screw"/>
      <circle cx="74" cy="208" r="4" class="mv-screw"/><path d="M71 208 H77" class="mv-screw"/>
    </g>`;
    s += '</svg>';
    return s;
  }

  function buildWatch(host, id) {
    const w = document.createElement('div');
    w.className = 'watch';
    const faces = [];

    function face(cls, width, height, m, opt = {}) {
      if (opt.outward && dot(normalOf(m), opt.outward) < 0) m = m.rotateAxisAngle(0, 1, 0, 180);
      const e = document.createElement('div');
      e.className = 'wf ' + cls;
      e.style.width = width + 'px';
      e.style.height = height + 'px';
      e.style.marginLeft = -width / 2 + 'px';
      e.style.marginTop = -height / 2 + 'px';
      e.style.transform = m.toString();
      if (opt.html) e.innerHTML = opt.html;
      w.appendChild(e);
      if (opt.kind) faces.push({ el: e, n: normalOf(m), kind: opt.kind, both: !!opt.both, d: -1, g: -1 });
      return e;
    }

    function pickRotation(base, axis, candidates, want) {
      for (const a of candidates) {
        const m = base.rotateAxisAngle(axis[0], axis[1], axis[2], a);
        if (dot(normalOf(m), want) > 0.98) return m;
      }
      return base.rotateAxisAngle(axis[0], axis[1], axis[2], candidates[0]);
    }

    // Case band
    const segLen = (2 * Math.PI * R) / N_BAND + 1.4;
    for (let i = 0; i < N_BAND; i++) {
      const th = (i * 360) / N_BAND;
      const c = Math.cos(rad(th)), s = Math.sin(rad(th));
      const m = M().translate(R * c, R * s, 0).rotateAxisAngle(0, 0, 1, th).rotateAxisAngle(0, 1, 0, 90);
      face('metal shade', T, segLen, m, { outward: [c, s, 0], kind: 'metal' });
    }

    // Lugs
    const lug = (cx, cy) => {
      const cz = 6, lw = 18, lh = 66, ld = 26;
      const list = [
        [[0, 0, 1], lw, lh, M().translate(cx, cy, cz + ld / 2), 'rotY'],
        [[0, 0, -1], lw, lh, M().translate(cx, cy, cz - ld / 2), 'rotY'],
        [[1, 0, 0], ld, lh, M().translate(cx + lw / 2, cy, cz).rotateAxisAngle(0, 1, 0, 90), 'rotY'],
        [[-1, 0, 0], ld, lh, M().translate(cx - lw / 2, cy, cz).rotateAxisAngle(0, 1, 0, 90), 'rotY'],
        [[0, -1, 0], lw, ld, M().translate(cx, cy - lh / 2, cz).rotateAxisAngle(1, 0, 0, 90), 'rotX'],
        [[0, 1, 0], lw, ld, M().translate(cx, cy + lh / 2, cz).rotateAxisAngle(1, 0, 0, 90), 'rotX']
      ];
      for (const [out, fw, fh, m] of list) face('metal shade', fw, fh, m, { outward: out, kind: 'metal' });
    };
    lug(-76, -(R + 3)); lug(76, -(R + 3)); lug(-76, R + 3); lug(76, R + 3);

    // Crown at three o'clock
    const rc = 13, cl = 20, cx = R + 8, NC = 16;
    const cLen = (2 * Math.PI * rc) / NC + 1;
    for (let i = 0; i < NC; i++) {
      const ph = (i * 360) / NC;
      const y = rc * Math.cos(rad(ph)), z = rc * Math.sin(rad(ph));
      const want = [0, Math.cos(rad(ph)), Math.sin(rad(ph))];
      const m = pickRotation(M().translate(cx, y, z), [1, 0, 0], [ph - 90, 90 - ph, ph + 90, -ph - 90], want);
      face(i % 2 ? 'metal shade' : 'metal-lo shade', cl, cLen, m, { kind: 'metal' });
    }
    face('metal shade disc', rc * 2, rc * 2, M().translate(cx + cl / 2, 0, 0).rotateAxisAngle(0, 1, 0, 90), { outward: [1, 0, 0], kind: 'metal' });

    // Straps: chained segments that curl back around the wrist
    const curl = (dir) => (M().rotateAxisAngle(1, 0, 0, 10).transformPoint(new DOMPoint(0, dir, 0, 0)).z < 0 ? 1 : -1);
    const strap = (dir, angles, w0, w1, opts) => {
      const sg = curl(dir);
      const SL = 34;
      let P = M().translate(0, dir * (R + 16), 4);
      angles.forEach((a, k) => {
        P = P.rotateAxisAngle(1, 0, 0, sg * a);
        const width = w0 + ((w1 - w0) * k) / (angles.length - 1);
        const C = P.translate(0, (dir * SL) / 2, 0);
        let html = '<i></i>';
        if (opts.holes && opts.holes.includes(k)) html += '<b></b>';
        const e = face('strap shade stitched', width, SL + 1.6, C, { html, kind: 'strap', both: true });
        if (opts.tip && k === angles.length - 1) e.style.borderRadius = dir > 0 ? '0 0 46% 46% / 0 0 60% 60%' : '46% 46% 0 0 / 60% 60% 0 0';
        P = P.translate(0, dir * SL, 0);
      });
      if (opts.buckle) {
        const B = P.translate(0, dir * 14, 2);
        face('buckle', w1 + 16, 30, B, {});
      }
    };
    strap(-1, [2, 8, 14, 18, 20, 22], 128, 108, { buckle: true });
    strap(1, [2, 8, 12, 16, 18, 18, 20, 20], 128, 100, { holes: [3, 4, 5, 6], tip: true });

    // Caseback with the movement window
    face('disc caseback shade', R * 2, R * 2, M().translate(0, 0, -T / 2), { outward: [0, 0, -1], kind: 'metal', html: movementSVG(id + '-cb', true) });

    // Rehaut: the inner wall between bezel and dial
    const rr = DIAL / 2;
    const rLen = (2 * Math.PI * rr) / N_REHAUT + 1.2;
    for (let i = 0; i < N_REHAUT; i++) {
      const th = (i * 360) / N_REHAUT;
      const c = Math.cos(rad(th)), s = Math.sin(rad(th));
      const m = M().translate(rr * c, rr * s, DIAL_Z + 3).rotateAxisAngle(0, 0, 1, th).rotateAxisAngle(0, 1, 0, 90);
      face('metal-lo shade', 6.5, rLen, m, { outward: [-c, -s, 0], kind: 'metal' });
    }

    // Dial, hands, bezel, crystal
    face('disc dial', DIAL, DIAL, M().translate(0, 0, DIAL_Z), { outward: [0, 0, 1], kind: 'dial', html: dialSVG() });
    const hand = (z, html, origin) => {
      const e = document.createElement('div');
      e.className = 'wf hand';
      e.style.cssText = `width:${DIAL}px;height:${DIAL}px;margin:${-DIAL / 2}px 0 0 ${-DIAL / 2}px;transform-origin:${origin}`;
      e.innerHTML = html;
      w.appendChild(e);
      return { el: e, z };
    };
    const hSec = hand(DIAL_Z + 1.2, HANDS.sec, '112px 156px');
    const hHour = hand(DIAL_Z + 2.4, HANDS.hour, '50% 50%');
    const hMin = hand(DIAL_Z + 3.6, HANDS.minute, '50% 50%');
    face('disc bezel shade', R * 2, R * 2, M().translate(0, 0, T / 2), { outward: [0, 0, 1], kind: 'metal' });
    face('disc crystal', DIAL + 4, DIAL + 4, M().translate(0, 0, T / 2 + 1.5), {});

    const shadow = document.createElement('div');
    shadow.className = 'w-shadow';
    host.appendChild(shadow);
    host.appendChild(w);

    const balance = $$('[data-bal]', w);
    let lastSec = -1;

    function setTime(now) {
      if (!reduce.matches && balance.length) {
        const a = 96 * Math.sin((now / 1000) * 2 * Math.PI * 2.5);
        for (const b of balance) b.setAttribute('transform', `rotate(${a.toFixed(1)} 94 176)`);
      }
      const d = new Date();
      const ms = d.getMilliseconds();
      const s = d.getSeconds() + (reduce.matches ? 0 : Math.floor(ms / 125) / 8);
      if (s === lastSec) return;
      lastSec = s;
      const m = d.getMinutes() + s / 60;
      const h = (d.getHours() % 12) + m / 60;
      hSec.el.style.transform = `translate3d(0,0,${hSec.z}px) rotate(${(s * 6).toFixed(2)}deg)`;
      hMin.el.style.transform = `translate3d(0,0,${hMin.z}px) rotate(${(m * 6).toFixed(3)}deg)`;
      hHour.el.style.transform = `translate3d(0,0,${hHour.z}px) rotate(${(h * 30).toFixed(3)}deg)`;
    }

    return { root: w, faces, shadow, setTime };
  }

  function shadeWatch(watch, pitch, yaw) {
    const m = M().rotateAxisAngle(1, 0, 0, pitch).rotateAxisAngle(0, 1, 0, yaw);
    for (const f of watch.faces) {
      const [a, b, c] = f.n;
      let x = m.m11 * a + m.m21 * b + m.m31 * c;
      let y = m.m12 * a + m.m22 * b + m.m32 * c;
      let z = m.m13 * a + m.m23 * b + m.m33 * c;
      if (f.both && z < 0) { x = -x; y = -y; z = -z; }
      const dif = Math.max(0, x * L[0] + y * L[1] + z * L[2]);
      const sp = Math.max(0, x * H[0] + y * H[1] + z * H[2]);
      let d, g;
      if (f.kind === 'metal') { d = 0.72 * (1 - dif); g = Math.pow(sp, 26) * 0.8; }
      else if (f.kind === 'strap') { d = 0.62 * (1 - dif); g = Math.pow(sp, 6) * 0.1; }
      else { d = 0.32 * (1 - dif); g = 0; }
      d = Math.round(d * 100) / 100;
      g = Math.round(g * 100) / 100;
      if (d !== f.d) { f.el.style.setProperty('--d', d); f.d = d; }
      if (g !== f.g) { f.el.style.setProperty('--g', g); f.g = g; }
    }
  }

  /* ================= Turntable ================= */

  const REST_PITCH = -12;
  const OFFSET = -24;
  const FACES = ['Dial', 'Crown side', 'Caseback', 'Left side'];

  class Turntable {
    constructor(stage, opts) {
      this.stage = stage;
      this.opts = opts;
      this.scale = $('.scale', stage);
      this.watch = buildWatch(this.scale, opts.id);
      const intro = opts.intro && !reduce.matches;
      this.yaw = intro ? -200 : 0;
      this.pitch = intro ? -30 : REST_PITCH;
      this.target = 0;
      this.vYaw = 0;
      this.vPitch = 0;
      this.springing = intro;
      this.dragging = false;
      this.sway = null;
      this.lastInteract = performance.now();
      this.visible = true;
      this.dirty = true;
      this.face = -1;
      this.bind();
      this.fit();
      this.render();
    }

    fit() {
      const r = this.stage.getBoundingClientRect();
      const s = clamp(Math.min(r.width / 440, r.height / 600), 0.42, this.opts.max || 1);
      this.scale.style.setProperty('--s', s.toFixed(3));
    }

    interact() {
      this.lastInteract = performance.now();
      if (this.sway) { this.sway = null; this.target = Math.round(this.target / 90) * 90; }
    }

    bind() {
      const st = this.stage;
      st.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        this.interact();
        this.dragging = true;
        this.springing = false;
        this.pid = e.pointerId;
        this.lx = e.clientX; this.ly = e.clientY; this.lt = e.timeStamp;
        this.vYaw = 0;
        if (e.pointerType === 'mouse') st.setPointerCapture(e.pointerId);
        st.classList.add('grabbing');
      });
      st.addEventListener('pointermove', (e) => {
        if (!this.dragging || e.pointerId !== this.pid) return;
        const dx = e.clientX - this.lx, dy = e.clientY - this.ly;
        const dt = Math.max(1, e.timeStamp - this.lt);
        this.yaw += dx * 0.5;
        if (e.pointerType !== 'touch') this.pitch = clamp(this.pitch - dy * 0.25, -34, 6);
        this.vYaw = this.vYaw * 0.4 + ((dx * 0.5) / dt) * 16 * 0.6;
        this.lx = e.clientX; this.ly = e.clientY; this.lt = e.timeStamp;
        this.lastInteract = performance.now();
        this.dirty = true;
      });
      const up = (e) => {
        if (!this.dragging || e.pointerId !== this.pid) return;
        if (e.timeStamp - this.lt > 90) this.vYaw = 0;
        this.release();
      };
      st.addEventListener('pointerup', up);
      st.addEventListener('pointercancel', up);
      st.addEventListener('lostpointercapture', up);
      st.addEventListener('keydown', (e) => {
        let step = 0;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') step = -90;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') step = 90;
        else if (e.key === 'Home') { e.preventDefault(); this.interact(); this.goTo(Math.round(this.target / 360) * 360); return; }
        else return;
        e.preventDefault();
        this.interact();
        this.goTo(this.target + step);
      });
    }

    release() {
      this.dragging = false;
      this.stage.classList.remove('grabbing');
      this.lastInteract = performance.now();
      if (reduce.matches) {
        this.target = Math.round(this.yaw / 90) * 90;
        this.yaw = this.target; this.pitch = REST_PITCH;
        this.dirty = true; this.settled();
        return;
      }
      const coast = clamp((this.vYaw * 0.92) / 0.08, -270, 270);
      this.target = Math.round((this.yaw + coast) / 90) * 90;
      this.springing = true;
    }

    goTo(t) {
      this.target = t;
      if (reduce.matches) {
        this.yaw = t; this.pitch = REST_PITCH; this.dirty = true; this.settled();
      } else {
        this.springing = true;
      }
    }

    goFace(i) {
      this.interact();
      const want = -i * 90;
      const diff = mod(want - this.target + 180, 360) - 180;
      this.goTo(this.target + diff);
    }

    step() {
      this.vYaw = (this.vYaw + (this.target - this.yaw) * 0.06) * 0.8;
      this.vPitch = (this.vPitch + (REST_PITCH - this.pitch) * 0.08) * 0.78;
      this.yaw += this.vYaw;
      this.pitch += this.vPitch;
      if (Math.abs(this.target - this.yaw) < 0.05 && Math.abs(this.vYaw) < 0.05 && Math.abs(REST_PITCH - this.pitch) < 0.05) {
        this.yaw = this.target; this.pitch = REST_PITCH;
        this.vYaw = 0; this.vPitch = 0;
        this.springing = false;
        this.settled();
      }
      this.dirty = true;
    }

    settled() {
      const i = mod(Math.round(-this.yaw / 90), 4);
      if (this.opts.live) this.opts.live.textContent = 'Showing ' + FACES[i];
    }

    tick(now) {
      if (this.springing && !this.dragging) this.step();
      else if (this.sway) {
        const t = (now - this.sway.t0) / 1000;
        const env = Math.min(1, t / 3);
        this.yaw = this.sway.base + env * 26 * Math.sin((t * 2 * Math.PI) / 11);
        this.pitch = REST_PITCH + env * 4 * Math.sin((t * 2 * Math.PI) / 15);
        this.dirty = true;
      } else if (this.opts.sway && !reduce.matches && !this.dragging && mod(this.target, 360) === 0 && now - this.lastInteract > 7000) {
        this.sway = { t0: now, base: this.target };
      }
      if (this.dirty) { this.render(); this.dirty = false; }
    }

    render() {
      const shown = this.yaw + OFFSET;
      this.watch.root.style.transform = `rotateX(${this.pitch.toFixed(2)}deg) rotateY(${shown.toFixed(2)}deg)`;
      shadeWatch(this.watch, this.pitch, shown);

      const foot = Math.abs(260 * Math.cos(rad(shown))) + Math.abs(T * Math.sin(rad(shown)));
      const tilt = Math.min(1, Math.abs(this.pitch) / 40);
      const sh = this.watch.shadow.style;
      sh.setProperty('--sx', ((foot / 260) * (0.92 + tilt * 0.2)).toFixed(3));
      sh.setProperty('--sy', (0.7 + tilt * 0.9).toFixed(3));
      sh.setProperty('--so', (0.95 - tilt * 0.35).toFixed(3));
      sh.setProperty('--sb', (4 + tilt * 8).toFixed(1) + 'px');

      const i = mod(Math.round(-this.yaw / 90), 4);
      if (this.opts.readout) {
        const deg = mod(Math.round(-this.yaw), 360);
        this.opts.readout.deg.textContent = String(deg).padStart(3, '0') + '°';
      }
      if (i !== this.face) {
        this.face = i;
        this.stage.setAttribute('aria-valuenow', String(i * 90));
        this.stage.setAttribute('aria-valuetext', FACES[i]);
        if (this.opts.readout) this.opts.readout.name.textContent = FACES[i];
        if (this.opts.views) this.opts.views.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.face) === i)));
      }
    }
  }

  const heroStage = $('#heroStage');
  const prodStage = $('#prodStage');
  const views = $$('.views button');
  const hero = new Turntable(heroStage, {
    id: 'hero', intro: true, sway: true, max: 1.08,
    live: $('#heroLive'),
    views,
    readout: { name: $('.ro-name'), deg: $('.ro-deg') }
  });
  const prod = new Turntable(prodStage, { id: 'prod', intro: false, sway: false, max: 0.86 });
  const tables = [hero, prod];
  views.forEach((b) => b.addEventListener('click', () => hero.goFace(Number(b.dataset.face))));

  const ro = new ResizeObserver(() => tables.forEach((t) => { t.fit(); }));
  tables.forEach((t) => ro.observe(t.stage));
  const vis = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const t = tables.find((x) => x.stage === en.target);
      if (t) t.visible = en.isIntersecting;
    });
  }, { rootMargin: '120px 0px' });
  tables.forEach((t) => vis.observe(t.stage));

  function frame(now) {
    for (const t of tables) {
      if (!t.visible) continue;
      t.tick(now);
      t.watch.setTime(now);
    }
    requestAnimationFrame(frame);
  }
  tables.forEach((t) => t.watch.setTime(performance.now()));
  requestAnimationFrame(frame);

  /* ================= Variants and Reserve ================= */

  const DIALS = {
    bone: { name: 'Bone lacquer', note: 'Bone lacquer, applied batons, small seconds' },
    oxblood: { name: 'Oxblood lacquer', note: 'Oxblood lacquer, applied batons, small seconds' },
    slate: { name: 'Slate grained', note: 'Slate grained, applied batons, small seconds' }
  };
  const STRAPS = {
    calf: { name: 'Noir calf', note: 'Noir calf, hand stitched, steel pin buckle', p: 6480 },
    cordovan: { name: 'Oxblood cordovan', note: 'Oxblood shell cordovan, hand stitched, steel pin buckle', p: 6720 },
    canvas: { name: 'Slate canvas', note: 'Slate canvas, leather lined, steel pin buckle', p: 6390 }
  };
  const money = (p) => '€' + p.toLocaleString('en-US');
  const state = { dial: 'bone', strap: 'calf', reserved: false };
  const reserveBtn = $('#reserveBtn');
  const prodLive = $('#prodLive');

  function resetReserved() {
    if (!state.reserved) return;
    state.reserved = false;
    reserveBtn.classList.remove('reserved');
  }

  const swatches = $$('.swatch');
  swatches.forEach((b) => b.addEventListener('click', () => {
    state.dial = b.dataset.dial;
    root.dataset.dial = state.dial;
    swatches.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $('#dialName').textContent = DIALS[state.dial].name;
    $('#noteDial').textContent = DIALS[state.dial].note;
    resetReserved();
  }));

  const seg = $('#seg');
  const radios = $$('[role="radio"]', seg);
  function pickStrap(i, focus) {
    radios.forEach((b, k) => { b.setAttribute('aria-checked', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
    seg.style.setProperty('--i', i);
    state.strap = radios[i].dataset.strap;
    root.dataset.strap = state.strap;
    const st = STRAPS[state.strap];
    $('#price').textContent = money(st.p);
    $('#noteStrap').textContent = st.note;
    if (focus) radios[i].focus();
    resetReserved();
  }
  radios.forEach((b, i) => b.addEventListener('click', () => pickStrap(i, false)));
  seg.addEventListener('keydown', (e) => {
    const cur = radios.findIndex((b) => b.getAttribute('aria-checked') === 'true');
    let n = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (cur + 1) % radios.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (cur - 1 + radios.length) % radios.length;
    if (n < 0) return;
    e.preventDefault();
    pickStrap(n, true);
  });

  const dlg = $('#reserveDlg');
  const form = $('#dlgForm');
  const fName = $('#fName'), fEmail = $('#fEmail');
  const eName = $('#eName'), eEmail = $('#eEmail');
  const ask = $('#dlgAsk'), done = $('#dlgDone');

  function setErr(input, err, bad) {
    input.setAttribute('aria-invalid', String(bad));
    err.hidden = !bad;
  }

  reserveBtn.addEventListener('click', () => {
    if (state.reserved) return;
    $('#sumDial').textContent = DIALS[state.dial].name;
    $('#sumStrap').textContent = STRAPS[state.strap].name;
    $('#sumPrice').textContent = money(STRAPS[state.strap].p);
    form.reset();
    setErr(fName, eName, false);
    setErr(fEmail, eEmail, false);
    ask.hidden = false;
    done.hidden = true;
    dlg.showModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = fName.value.trim();
    const email = fEmail.value.trim();
    const badName = name.length < 2;
    const badEmail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setErr(fName, eName, badName);
    setErr(fEmail, eEmail, badEmail);
    if (badName) { fName.focus(); return; }
    if (badEmail) { fEmail.focus(); return; }
    const d = DIALS[state.dial].name.toLowerCase();
    const s = STRAPS[state.strap].name.toLowerCase();
    $('#doneText').innerHTML = `Your Meridian No. 7, ${esc(d)} dial on ${esc(s)}, is held under <strong>${esc(name)}</strong>. We will write to <strong>${esc(email)}</strong> within two working days to agree payment and delivery.`;
    ask.hidden = true;
    done.hidden = false;
    $('#doneTitle').focus();
    state.reserved = true;
    reserveBtn.classList.add('reserved');
    prodLive.textContent = `Reserved. ${DIALS[state.dial].name} dial on ${STRAPS[state.strap].name}, held for 14 days.`;
  });
  [fName, fEmail].forEach((inp) => inp.addEventListener('input', () => {
    if (inp.getAttribute('aria-invalid') === 'true') setErr(inp, inp === fName ? eName : eEmail, false);
  }));
  $$('[data-dlg-close]', dlg).forEach((b) => b.addEventListener('click', () => dlg.close('cancel')));
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close('cancel'); });

  /* ================= Nav, drawer, reveals ================= */

  const bar = $('#bar');
  let ticking = false;
  function updateBar() { bar.classList.toggle('solid', window.scrollY > 80); ticking = false; }
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateBar); ticking = true; } }, { passive: true });
  updateBar();

  const spyLinks = $$('.bar nav a[data-spy]');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      spyLinks.forEach((a) => {
        if (a.dataset.spy === en.target.id) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => spy.observe(s));

  const drawer = $('#drawer');
  const menuBtn = $('#menuBtn');
  const page = $('.page');
  function openDrawer() {
    document.body.classList.add('drawer-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    page.inert = true;
    bar.inert = true;
    setTimeout(() => $('.d-close', drawer).focus(), 60);
  }
  function closeDrawer(returnFocus) {
    if (!document.body.classList.contains('drawer-open')) return;
    document.body.classList.remove('drawer-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    page.inert = false;
    bar.inert = false;
    if (returnFocus) menuBtn.focus();
  }
  menuBtn.addEventListener('click', openDrawer);
  $$('[data-close]').forEach((el) => el.addEventListener('click', () => closeDrawer(true)));
  document.addEventListener('keydown', (e) => {
    if (!document.body.classList.contains('drawer-open')) return;
    if (e.key === 'Escape') { closeDrawer(true); return; }
    if (e.key !== 'Tab') return;
    const items = $$('a[href], button, input', drawer).filter((el) => !el.closest('[inert]'));
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  const accRows = $$('button.row', drawer);
  accRows.forEach((row) => row.addEventListener('click', () => {
    const willOpen = row.getAttribute('aria-expanded') !== 'true';
    accRows.forEach((r) => {
      const on = r === row && willOpen;
      r.setAttribute('aria-expanded', String(on));
      document.getElementById(r.getAttribute('aria-controls')).inert = !on;
    });
  }));
  $$('a', drawer).forEach((a) => a.addEventListener('click', () => {
    if (a.dataset.cat) faq.select(a.dataset.cat);
    closeDrawer(false);
  }));
  matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) closeDrawer(false); });

  const craft = $('#craft');
  const maskHead = $('.mask-head', craft);
  const goCraft = () => { craft.classList.add('go'); maskHead.classList.add('go'); };
  if (reduce.matches) goCraft();
  else {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) { goCraft(); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(maskHead);
  }

  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); } });
  }, { threshold: 0.15 });
  $$('[data-reveal]').forEach((el) => (reduce.matches ? el.classList.add('in') : revealIO.observe(el)));

  $('#plateMovement').innerHTML = movementSVG('plate', true)
    .replace('<svg ', '<svg role="img" aria-label="Drawing of the Calibre M7 movement: barrel, gear train, bridges and balance wheel" ');

  $('#toTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduce.matches ? 'auto' : 'smooth' }));

  /* ================= FAQ ================= */

  const faq = (() => {
    const DATA = {
      Shipping: [
        ['Where do you deliver?', 'We deliver to Switzerland, the EU, the United Kingdom, the United States, Canada, Japan and Singapore. Each watch travels insured, by courier, and needs a signature on arrival.'],
        ['How long does a reserved watch take?', 'Each Meridian No. 7 is assembled to order. Expect six weeks from the day you confirm your dial and strap. We write when the movement is cased and again when it ships.'],
        ['Are import duties included?', 'Prices include Swiss VAT. Outside Switzerland, import duties and local tax are shown before you pay and charged then, so nothing is collected at the door.']
      ],
      Servicing: [
        ['How often should it be serviced?', 'Every five to seven years, depending on wear. The atelier strips, cleans, oils and regulates the Calibre M7, then tests it for six days before it comes back to you.'],
        ['How do I wind it?', 'Turn the crown clockwise, about thirty turns, until you feel it resist. Do not force it past that point. A full wind runs the watch for 72 hours.'],
        ['Can I change the strap later?', 'Yes. The lugs use quick-release spring bars, so any 20 mm strap fits without tools. Straps from the atelier can be ordered from the same address as servicing.']
      ],
      Warranty: [
        ['What does the warranty cover?', 'Five years on the movement and the case against defects in materials or assembly. It does not cover the strap, a crystal broken by an impact, or water let in through an open crown.'],
        ['Is the warranty transferable?', 'Yes. It belongs to the watch, not to the owner. The serial number engraved on the caseback is the record we keep.'],
        ['What does reserving commit me to?', 'Nothing yet. A reservation holds one watch in your dial and strap for 14 days while we write to agree payment and delivery. If you do not reply, the hold simply lapses.']
      ]
    };
    const CATS = Object.keys(DATA);
    const TOTAL = CATS.reduce((n, c) => n + DATA[c].length, 0);
    const input = $('#faqQ'), clearBtn = $('#faqClear'), list = $('#faqList');
    const empty = $('#faqEmpty'), count = $('#faqCount'), catsEl = $('#cats');
    const open = new Set(['Shipping-1']);
    let cat = 'Shipping';
    const chev = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
    const rx = (q) => new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const hi = (s, q) => (q ? esc(s).replace(rx(esc(q)), (m) => '<mark>' + m + '</mark>') : esc(s));

    catsEl.innerHTML = CATS.map((c) => `<li><button type="button" class="cat" data-cat="${c}" aria-pressed="false"><span>${c}</span><span class="pill">${DATA[c].length}</span></button></li>`).join('');
    const catBtns = $$('.cat', catsEl);

    function render() {
      const q = input.value.trim();
      const ql = q.toLowerCase();
      let shown = 0, groups = 0, html = '';
      for (const c of CATS) {
        const hits = DATA[c].map((qa, i) => ({ qa, i })).filter(({ qa }) => !q || (qa[0] + ' ' + qa[1]).toLowerCase().includes(ql));
        const btn = catBtns.find((b) => b.dataset.cat === c);
        btn.setAttribute('aria-pressed', String(!q && c === cat));
        btn.querySelector('.pill').textContent = q ? hits.length : DATA[c].length;
        btn.classList.toggle('zero', !!q && !hits.length);
        if ((!q && c !== cat) || !hits.length) continue;
        groups++; shown += hits.length;
        html += `<div class="group${q ? ' searching' : ''}"><h3>${c}</h3>` + hits.map(({ qa, i }) => {
          const id = `${c}-${i}`;
          const ansOnly = q && !qa[0].toLowerCase().includes(ql) && qa[1].toLowerCase().includes(ql);
          const isOpen = open.has(id) || ansOnly;
          return `<div class="item${isOpen ? ' open' : ''}" data-id="${id}"><h4><button class="q" type="button" id="q-${id}" aria-expanded="${isOpen}" aria-controls="a-${id}"><span>${hi(qa[0], q)}</span>${chev}</button></h4><div class="a" id="a-${id}" role="region" aria-labelledby="q-${id}"><div><p>${hi(qa[1], q)}</p></div></div></div>`;
        }).join('') + '</div>';
      }
      list.innerHTML = html;
      empty.hidden = !(q && !shown);
      clearBtn.hidden = !q;
      if (!q) count.textContent = `${DATA[cat].length} questions in ${cat}, ${TOTAL} in total`;
      else if (!shown) count.textContent = `No questions match “${q}”`;
      else count.textContent = `${shown} ${shown === 1 ? 'question matches' : 'questions match'} “${q}” in ${groups} ${groups === 1 ? 'category' : 'categories'}`;
    }

    list.addEventListener('click', (e) => {
      const b = e.target.closest('.q');
      if (!b) return;
      const item = b.closest('.item');
      const id = item.dataset.id;
      const on = !item.classList.contains('open');
      item.classList.toggle('open', on);
      b.setAttribute('aria-expanded', String(on));
      if (on) open.add(id); else open.delete(id);
    });
    catBtns.forEach((b) => b.addEventListener('click', () => { input.value = ''; cat = b.dataset.cat; render(); }));
    input.addEventListener('input', render);
    const clear = () => { input.value = ''; render(); input.focus(); };
    clearBtn.addEventListener('click', clear);
    $('#faqReset').addEventListener('click', clear);
    input.addEventListener('keydown', (e) => { if (e.key === 'Escape' && input.value) { e.preventDefault(); clear(); } });
    render();

    return { select(c) { if (DATA[c]) { input.value = ''; cat = c; render(); } } };
  })();
})();
