/* Late Light · the dome, the trip, the ticket, the booking.
   Designed using Design Lounge (https://www.designlounge.live) */
(() => {
  'use strict';

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const smooth = (u) => u * u * (3 - 2 * u);
  const sstep = (a, b, x) => smooth(clamp((x - a) / (b - a), 0, 1));
  const mix = (a, b, t) => a + (b - a) * t;

  const rootStyle = getComputedStyle(document.documentElement);
  const tok = (name) => {
    const h = rootStyle.getPropertyValue(name).trim();
    return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  };
  const C = {
    bg: tok('--bg'),
    primary: tok('--primary'),
    primarySoft: tok('--primary-soft'),
    secondary: tok('--secondary'),
    tertiary: tok('--tertiary'),
    ink: tok('--ink'),
    ink2: tok('--ink-2'),
    ink3: tok('--ink-3'),
    lineStrong: tok('--line-strong'),
    info: tok('--info'),
  };
  const blend = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

  /* ------------------------------------------------------------------
     The world. Everything is a point of light, like the projector's.
     Groups: 0 dome frame and seats, 1 projected dome stars,
             2 real sky and dust, 3 objects, 4 projector body.
  ------------------------------------------------------------------ */
  let seed = 20261006;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const gauss = () => {
    let u = 0, v = 0;
    while (!u) u = rnd();
    while (!v) v = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const glow = [];
  const solid = [];
  const put = (arr, x, y, z, c, k, size, group) => arr.push(x, y, z, c[0] * k, c[1] * k, c[2] * k, size, group);

  const norm = (v) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const rotX = (p, a) => [p[0], p[1] * Math.cos(a) - p[2] * Math.sin(a), p[1] * Math.sin(a) + p[2] * Math.cos(a)];
  const rotY = (p, a) => [p[0] * Math.cos(a) + p[2] * Math.sin(a), p[1], -p[0] * Math.sin(a) + p[2] * Math.cos(a)];
  const rotZ = (p, a) => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a), p[2]];
  const SUN = norm([0.86, 0.22, 0.46]);
  const fib = (i, n) => {
    const y = 1 - (2 * (i + 0.5)) / n;
    const r = Math.sqrt(1 - y * y);
    const th = i * 2.399963229728653;
    return [Math.cos(th) * r, y, Math.sin(th) * r];
  };

  const R = 10;
  const MOON = [4, 34, -46];
  const SATURN = [-14, 44, -170];
  const GALAXY = [40, -60, -760];

  function buildDome() {
    const deg = Math.PI / 180;
    for (let m = 0; m < 24; m++) {
      const az = (m / 24) * Math.PI * 2;
      for (let e = 0; e <= 80; e += 0.24) {
        const el = e * deg;
        put(glow, R * Math.cos(el) * Math.cos(az), R * Math.sin(el), R * Math.cos(el) * Math.sin(az), C.lineStrong, 0.55, 0.05, 0);
      }
    }
    [20, 40, 60].forEach((e) => {
      const el = e * deg, rr = R * Math.cos(el), n = Math.round(rr * 60);
      for (let i = 0; i < n; i++) {
        const az = (i / n) * Math.PI * 2;
        put(glow, rr * Math.cos(az), R * Math.sin(el), rr * Math.sin(az), C.lineStrong, 0.5, 0.05, 0);
      }
    });
    { // the crown that opens
      const el = 80 * deg, rr = R * Math.cos(el);
      for (let i = 0; i < 260; i++) {
        const az = (i / 260) * Math.PI * 2;
        put(glow, rr * Math.cos(az), R * Math.sin(el), rr * Math.sin(az), C.primary, 0.7, 0.07, 0);
      }
    }
    for (let i = 0; i < 1400; i++) { // cove light along the base of the dome
      const az = (i / 1400) * Math.PI * 2;
      put(glow, (R - 0.05) * Math.cos(az), 0.25, (R - 0.05) * Math.sin(az), C.primary, 0.9, 0.09, 0);
    }
    for (let row = 0; row < 5; row++) { // reclined seats in rings around the projector
      const rr = 3.4 + row * 1.15;
      const n = Math.floor((Math.PI * 2 * rr) / 0.82);
      for (let s = 0; s < n; s++) {
        const az = (s / n) * Math.PI * 2 + row * 0.11;
        if (Math.abs(Math.sin(az * 0.5 - 0.9)) < 0.06) continue;
        for (let k = 0; k < 14; k++) {
          const along = (rnd() - 0.5) * 0.5;
          const up = rnd() * 0.42;
          const back = up * 0.55;
          const r2 = rr + back;
          const a2 = az + along / rr;
          put(glow, r2 * Math.cos(a2), 0.35 + up, r2 * Math.sin(a2), C.ink3, 0.55, 0.05, 0);
        }
      }
    }
    // the star projector: a column, an arm, and two globes
    const shadeP = (n) => clamp(0.25 + 0.75 * Math.max(0, dot(n, norm([0.2, 1, 0.4]))), 0, 1);
    for (let i = 0; i < 700; i++) {
      const a = rnd() * Math.PI * 2, y = rnd() * 1.75;
      const n = [Math.cos(a), 0.2, Math.sin(a)];
      put(solid, 0.24 * Math.cos(a), y, 0.24 * Math.sin(a), C.ink2, shadeP(n) * 0.9, 0.09, 4);
    }
    for (let i = 0; i < 500; i++) {
      const x = (rnd() - 0.5) * 1.9, a = rnd() * Math.PI * 2;
      put(solid, x, 2.05 + 0.13 * Math.sin(a), 0.13 * Math.cos(a), C.ink3, 0.8, 0.07, 4);
    }
    [-0.98, 0.98].forEach((cx) => {
      const n0 = 2200;
      for (let i = 0; i < n0; i++) {
        const n = fib(i, n0);
        put(solid, cx + n[0] * 0.62, 2.05 + n[1] * 0.62, n[2] * 0.62, C.ink2, shadeP(n), 0.06, 4);
      }
      for (let i = 0; i < 70; i++) { // lenses, lit
        const n = norm([gauss(), gauss(), gauss()]);
        put(glow, cx + n[0] * 0.64, 2.05 + n[1] * 0.64, n[2] * 0.64, C.primary, 1, 0.07, 1);
      }
    });
    // the stars it throws on the ceiling
    for (let i = 0; i < 2800; i++) {
      const y = mix(Math.sin(6 * deg), Math.sin(79 * deg), rnd());
      const az = rnd() * Math.PI * 2, rr = Math.sqrt(1 - y * y);
      const mag = Math.pow(rnd(), 3.2);
      const c = rnd() < 0.1 ? C.primary : rnd() < 0.12 ? C.info : C.ink;
      put(glow, 9.9 * rr * Math.cos(az), 9.9 * y, 9.9 * rr * Math.sin(az), c, 0.5 + mag * 0.9, 0.035 + mag * 0.11, 1);
    }
    const band = norm([0.32, 0.62, 0.72]);
    const u = norm([band[1], -band[0], 0]);
    const v = [band[1] * u[2] - band[2] * u[1], band[2] * u[0] - band[0] * u[2], band[0] * u[1] - band[1] * u[0]];
    for (let i = 0; i < 4200; i++) {
      const a = rnd() * Math.PI * 2, off = gauss() * 0.11;
      const d = norm([
        u[0] * Math.cos(a) + v[0] * Math.sin(a) + band[0] * off,
        u[1] * Math.cos(a) + v[1] * Math.sin(a) + band[1] * off,
        u[2] * Math.cos(a) + v[2] * Math.sin(a) + band[2] * off,
      ]);
      if (d[1] < 0.12 || d[1] > 0.97) continue;
      put(glow, d[0] * 9.88, d[1] * 9.88, d[2] * 9.88, C.ink2, 0.45 + rnd() * 0.3, 0.03, 1);
    }
  }

  function buildSky() {
    const centre = [0, 0, -380];
    for (let i = 0; i < 12000; i++) {
      const d = norm([gauss(), gauss(), gauss()]);
      const mag = Math.pow(rnd(), 4);
      const c = rnd() < 0.06 ? C.primary : rnd() < 0.18 ? C.info : rnd() < 0.5 ? C.ink2 : C.ink;
      put(glow, centre[0] + d[0] * 2000, centre[1] + d[1] * 2000, centre[2] + d[2] * 2000, c, 0.7 + mag * 0.7, -(1.4 + mag * 2.8), 2);
    }
    for (let i = 0; i < 6000; i++) { // dust you fly through
      const x = (rnd() - 0.5) * 420, y = -120 + rnd() * 320, z = 60 - rnd() * 1020;
      if (Math.hypot(x, y - 5, z) < 24) continue;
      put(glow, x, y, z, rnd() < 0.2 ? C.info : C.ink2, 0.35 + rnd() * 0.5, 0.18 + rnd() * 0.25, 2);
    }
    const neb = [70, 70, -430];
    for (let i = 0; i < 900; i++) { // a faint nebula on the way out
      const p = [neb[0] + gauss() * 46, neb[1] + gauss() * 20, neb[2] + gauss() * 40];
      const c = rnd() < 0.55 ? C.tertiary : rnd() < 0.5 ? C.secondary : C.primarySoft;
      put(glow, p[0], p[1], p[2], c, 0.05 + rnd() * 0.05, 6 + rnd() * 14, 2);
    }
  }

  function buildMoon() {
    const craters = [];
    for (let i = 0; i < 70; i++) craters.push({ c: norm([gauss(), gauss(), gauss()]), r: 0.03 + Math.pow(rnd(), 2.4) * 0.15 });
    const maria = [];
    for (let i = 0; i < 6; i++) maria.push({ c: norm([gauss(), gauss() * 0.6, gauss()]), r: 0.35 + rnd() * 0.35 });
    const n0 = 22000, r = 5;
    for (let i = 0; i < n0; i++) {
      const n = fib(i, n0);
      let albedo = 0.86;
      maria.forEach((m) => { const d = Math.acos(clamp(dot(n, m.c), -1, 1)); if (d < m.r) albedo -= 0.2 * smooth(1 - d / m.r); });
      craters.forEach((cr) => {
        const d = Math.acos(clamp(dot(n, cr.c), -1, 1)) / cr.r;
        if (d < 0.85) albedo -= 0.06; else if (d < 1.1) albedo += 0.05;
      });
      albedo += (rnd() - 0.5) * 0.08;
      const lit = Math.max(0, dot(n, SUN));
      const k = clamp(0.035 + Math.pow(lit, 0.8) * albedo, 0, 1);
      const c = lit > 0 ? C.ink : C.info;
      put(solid, MOON[0] + n[0] * r, MOON[1] + n[1] * r, MOON[2] + n[2] * r, c, k, 0.19, 3);
    }
  }

  function buildSaturn() {
    const tiltX = 0.44, tiltZ = -0.22;
    const toWorld = (p) => { const q = rotZ(rotX(p, tiltX), tiltZ); return [SATURN[0] + q[0], SATURN[1] + q[1], SATURN[2] + q[2]]; };
    const sunLocal = norm(rotX(rotZ(SUN, -tiltZ), -tiltX));
    const r = 8.5, n0 = 30000;
    for (let i = 0; i < n0; i++) {
      const n = fib(i, n0);
      const lat = n[1];
      const band = 0.5 + 0.5 * Math.sin(lat * 19 + Math.sin(lat * 7) * 1.4) * Math.cos(lat * 3);
      let c = blend(C.primary, C.ink, 0.25 + band * 0.45);
      if (Math.abs(lat) > 0.82) c = blend(c, C.info, 0.5);
      const lit = Math.max(0, dot(n, sunLocal));
      const k = clamp(0.03 + Math.pow(lit, 0.9) * (0.82 + (rnd() - 0.5) * 0.06), 0, 1);
      const p = toWorld([n[0] * r, n[1] * r * 0.9, n[2] * r]);
      put(solid, p[0], p[1], p[2], c, k, 0.31, 3);
    }
    const density = (rr) => {
      if (rr < 12.5) return 0.25;
      if (rr < 16.4) return 0.85 + 0.15 * Math.sin(rr * 9);
      if (rr < 17.1) return 0.02;
      if (rr > 18.9 && rr < 19.05) return 0.05;
      return 0.55 + 0.1 * Math.sin(rr * 13);
    };
    let placed = 0;
    while (placed < 52000) {
      const rr = 11 + rnd() * 8.6;
      const d = density(rr);
      if (rnd() > d) continue;
      const a = rnd() * Math.PI * 2;
      const local = [rr * Math.cos(a), (rnd() - 0.5) * 0.04, rr * Math.sin(a)];
      const along = dot(local, sunLocal);
      const perp = Math.hypot(local[0] - sunLocal[0] * along, local[1] - sunLocal[1] * along * 0.9, local[2] - sunLocal[2] * along);
      const shadow = along < 0 && perp < r * 0.98 ? 0.12 : 1;
      const c = blend(C.ink2, C.primary, 0.35 + rnd() * 0.25);
      const p = toWorld(local);
      put(glow, p[0], p[1], p[2], c, (0.16 + d * 0.22) * shadow, 0.1, 3);
      placed++;
    }
  }

  let HERE = [0, 0, 0];
  function buildGalaxy() {
    const tilt = (p) => { const q = rotY(rotX(rotY(p, -1.16), 0.52), 0.34); return [GALAXY[0] + q[0], GALAXY[1] + q[1], GALAXY[2] + q[2]]; };
    const pitch = Math.tan(13 * Math.PI / 180);
    for (let i = 0; i < 9000; i++) { // the bulge
      const rr = Math.abs(gauss()) * 24;
      const d = norm([gauss(), gauss() * 0.45, gauss()]);
      const p = tilt([d[0] * rr * 1.5, d[1] * rr * 0.7, d[2] * rr]);
      put(glow, p[0], p[1], p[2], blend(C.primary, C.ink, rnd() * 0.5), 0.16 + rnd() * 0.16, 0.9 + rnd() * 0.8, 3);
    }
    for (let i = 0; i < 46000; i++) { // the arms
      const major = rnd() < 0.78;
      const arm = major ? (rnd() < 0.5 ? 0 : 1) : (rnd() < 0.5 ? 0.5 : 1.5);
      const rr = 26 + Math.pow(rnd(), 0.85) * 210;
      const th = Math.log(rr / 26) / pitch + arm * Math.PI + gauss() * (major ? 0.2 : 0.32);
      const spread = gauss() * rr * 0.035;
      const x = rr * Math.cos(th) + spread, z = rr * Math.sin(th) + spread, y = gauss() * 2.6;
      const roll = rnd();
      let c, k;
      if (roll < 0.14) { c = C.tertiary; k = 0.18 + rnd() * 0.16; }
      else if (roll < 0.17) { c = C.secondary; k = 0.42; }
      else if (rr < 70) { c = blend(C.primary, C.ink, 0.5); k = 0.28 + rnd() * 0.24; }
      else { c = rnd() < 0.5 ? C.ink2 : blend(C.info, C.ink, 0.4); k = 0.24 + rnd() * 0.36; }
      const p = tilt([x, y, z]);
      put(glow, p[0], p[1], p[2], c, k, 0.55 + rnd() * 0.75, 3);
    }
    for (let i = 0; i < 12000; i++) { // the haze between arms
      const rr = -Math.log(1 - rnd() * 0.97) * 70;
      const a = rnd() * Math.PI * 2;
      const p = tilt([rr * Math.cos(a), gauss() * 3, rr * Math.sin(a)]);
      put(glow, p[0], p[1], p[2], C.ink2, 0.12 + rnd() * 0.1, 0.6 + rnd() * 0.6, 3);
    }
    // the gold mark: the Sun, about half way out along an arm
    const rs = 122;
    const ths = Math.log(rs / 26) / pitch + 0.08;
    const sun = [rs * Math.cos(ths), 0, rs * Math.sin(ths)];
    HERE = tilt(sun);
    for (let i = 0; i < 160; i++) {
      const a = (i / 160) * Math.PI * 2;
      const p = tilt([sun[0] + Math.cos(a) * 6.5, 0, sun[2] + Math.sin(a) * 6.5]);
      put(glow, p[0], p[1], p[2], C.primary, 1, 0.9, 3);
    }
    for (let i = 0; i < 6; i++) put(glow, HERE[0], HERE[1], HERE[2], C.primary, 1, 3.2, 3);
  }

  buildDome();
  buildSky();
  buildMoon();
  buildSaturn();
  buildGalaxy();

  /* ------------------------------------------------------------------
     The camera path. Scroll progress picks a point on it.
  ------------------------------------------------------------------ */
  const v3 = (a, b, s) => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
  const POSES = [
    { t: 0, T: [0, 0, 0], off: [-4.4, 1.3, 8.4], lookL: [-0.7, 3.3, -3], lookP: [0.4, 3.6, -3], far: 1 },
    { t: 0.12, T: [0, 0, 0], off: [0, 8.6, 0.6], lookL: [0.6, 30, -12], lookP: [0.6, 30, -12], far: 1 },
    { t: 1 / 3, T: MOON, off: [-2.5, -1.5, 40], lookL: [-4.9, 0.4, 0], lookP: [0, 5, 0], far: 1.5 },
    { t: 2 / 3, T: SATURN, off: [-15, 10, 92], lookL: [-10.5, 0, 0], lookP: [0, 13, 0], far: 1.6 },
    { t: 1, T: GALAXY, off: [-120, 430, 660], lookL: [-96, 0, 0], lookP: [0, 140, 0], far: 1.6 },
  ];
  let wide = 1;
  function poseAt(i) {
    const p = POSES[i];
    const s = mix(p.far, 1, wide);
    const look = [mix(p.lookP[0], p.lookL[0], wide), mix(p.lookP[1], p.lookL[1], wide), mix(p.lookP[2], p.lookL[2], wide)];
    return { eye: v3(p.T, p.off, s), at: v3(p.T, look, 1) };
  }
  function sample(t) {
    let i = 0;
    while (i < POSES.length - 2 && t > POSES[i + 1].t) i++;
    const A = poseAt(i), B = poseAt(i + 1);
    const u = smooth(clamp((t - POSES[i].t) / (POSES[i + 1].t - POSES[i].t), 0, 1));
    const lerp3 = (a, b) => [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)];
    return { eye: lerp3(A.eye, B.eye), at: lerp3(A.at, B.at) };
  }

  /* ------------------------------------------------------------------
     WebGL
  ------------------------------------------------------------------ */
  const canvas = $('#sky');
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  let ready = false;
  let prog, uni = {}, bufGlow, bufSolid, nGlow = 0, nSolid = 0, attribs = {};
  let fovScale = 1, dpr = 1;

  const VS = `
    attribute vec3 aPos; attribute vec3 aCol; attribute float aSize; attribute float aGroup;
    uniform mat4 uPV; uniform float uScale; uniform float uDpr; uniform float uHouse;
    uniform vec4 uA; uniform vec3 uGold;
    varying vec3 vCol; varying float vA;
    void main() {
      vec4 p = uPV * vec4(aPos, 1.0);
      gl_Position = p;
      float g = aGroup; float a = 1.0; vec3 col = aCol;
      if (g < 0.5) { a = uA.x; col = mix(aCol, uGold * 0.7, uHouse * 0.6) * (0.85 + uHouse * 1.1); }
      else if (g < 1.5) { a = uA.y * (1.0 - uHouse * 0.9); }
      else if (g < 2.5) { a = uA.z; }
      else if (g < 3.5) { a = uA.w; }
      else { col = aCol * (0.3 + 0.7 * uHouse); }
      float s;
      if (aSize < 0.0) { s = -aSize * uDpr; }
      else {
        s = aSize * uScale / max(p.w, 0.001);
        if (g > 1.5 && g < 2.5) s = min(s, 2.6 * uDpr);
      }
      vA = a * clamp(s, 0.0, 1.0);
      gl_PointSize = clamp(s, 1.0, 72.0);
      if (a < 0.002) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      vCol = col;
    }`;
  const FS_GLOW = `
    precision mediump float; varying vec3 vCol; varying float vA;
    void main() {
      float r = length(gl_PointCoord - 0.5) * 2.0;
      if (r > 1.0) discard;
      float f = 1.0 - r; f *= f;
      gl_FragColor = vec4(vCol * f * vA, 1.0);
    }`;
  const FS_SOLID = `
    precision mediump float; varying vec3 vCol; varying float vA;
    void main() {
      vec2 d = gl_PointCoord - 0.5;
      if (dot(d, d) > 0.25) discard;
      gl_FragColor = vec4(vCol, 1.0);
    }`;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function link(fs) {
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'aPos');
    gl.bindAttribLocation(p, 1, 'aCol');
    gl.bindAttribLocation(p, 2, 'aSize');
    gl.bindAttribLocation(p, 3, 'aGroup');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {};
    ['uPV', 'uScale', 'uDpr', 'uHouse', 'uA', 'uGold'].forEach((n) => (u[n] = gl.getUniformLocation(p, n)));
    return { p, u };
  }

  let progGlow, progSolid;
  try {
    if (!gl) throw new Error('no webgl');
    progGlow = link(FS_GLOW);
    progSolid = link(FS_SOLID);
    const mk = (arr) => {
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
      return b;
    };
    bufGlow = mk(glow); nGlow = glow.length / 8;
    bufSolid = mk(solid); nSolid = solid.length / 8;
    gl.clearColor(C.bg[0], C.bg[1], C.bg[2], 1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    ready = true;
  } catch (err) {
    $('#gl-error').hidden = false;
  }
  glow.length = 0;
  solid.length = 0;

  function bindBuf(b) {
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    const stride = 32;
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, stride, 12);
    gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 1, gl.FLOAT, false, stride, 24);
    gl.enableVertexAttribArray(3); gl.vertexAttribPointer(3, 1, gl.FLOAT, false, stride, 28);
  }

  const FOV = 36 * Math.PI / 180;
  function perspective(aspect, near, far) {
    const f = 1 / Math.tan(FOV / 2), nf = 1 / (near - far);
    return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
  }
  function lookAt(e, a) {
    const z = norm([e[0] - a[0], e[1] - a[1], e[2] - a[2]]);
    let x = norm([z[2], 0, -z[0]]);
    if (!isFinite(x[0])) x = [1, 0, 0];
    const y = [z[1] * x[2] - z[2] * x[1], z[2] * x[0] - z[0] * x[2], z[0] * x[1] - z[1] * x[0]];
    return [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, e), -dot(y, e), -dot(z, e), 1];
  }
  function mul(a, b) {
    const o = new Array(16);
    for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
      o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    }
    return o;
  }

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    fovScale = canvas.height / (2 * Math.tan(FOV / 2));
    wide = clamp((w / h - 0.8) / (1.35 - 0.8), 0, 1);
  }

  let house = reduce ? 0 : 1;
  function draw(t) {
    if (!ready) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const cam = sample(t);
    const pv = mul(perspective(canvas.width / canvas.height, 0.08, 4600), lookAt(cam.eye, cam.at));
    const outer = sstep(0.06, 0.16, t);
    const alphas = [1 - sstep(0.1, 0.26, t), 1 - sstep(0.05, 0.13, t), outer, outer];
    const set = (pr) => {
      gl.useProgram(pr.p);
      gl.uniformMatrix4fv(pr.u.uPV, false, pv);
      gl.uniform1f(pr.u.uScale, fovScale);
      gl.uniform1f(pr.u.uDpr, dpr);
      gl.uniform1f(pr.u.uHouse, house);
      gl.uniform4fv(pr.u.uA, alphas);
      gl.uniform3fv(pr.u.uGold, C.primary);
    };
    set(progSolid);
    gl.disable(gl.BLEND);
    gl.depthMask(true);
    bindBuf(bufSolid);
    gl.drawArrays(gl.POINTS, 0, nSolid);
    set(progGlow);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.depthMask(false);
    bindBuf(bufGlow);
    gl.drawArrays(gl.POINTS, 0, nGlow);
  }

  /* ------------------------------------------------------------------
     Scroll drives everything
  ------------------------------------------------------------------ */
  const journey = $('#journey');
  const chapters = $$('.chapter');
  const chapBtns = $$('.chap');
  const bars = chapBtns.map((b) => $('.bar', b));
  const dist = $('#dist');
  const pair = $('.pair');
  const pairN = $('#pair-n');
  const pairL = $('#pair-l');
  const live = $('#live');
  const topBar = $('#top-bar');
  const NAMES = ['the dome', 'the Moon', 'Saturn', 'the Milky Way'];
  const PAIRS = ['Seat to ceiling', 'Earth to Moon', 'Moon to Saturn', 'Sun to galaxy'];

  let goal = 0, shown = 0, current = 0, running = false;
  let introStart = 0;
  const INTRO_DELAY = 350, INTRO_MS = 900;

  function progress() {
    const r = journey.getBoundingClientRect();
    const max = journey.offsetHeight - innerHeight;
    return max > 0 ? clamp(-r.top / max, 0, 1) : 0;
  }

  const LY = 9.4607e12;
  function distanceKm(t) {
    if (t <= 0.12) return (t / 0.12) * 0.012;
    const seg = (a, b, ka, kb) => Math.exp(mix(Math.log(ka), Math.log(kb), smooth(clamp((t - a) / (b - a), 0, 1))));
    if (t <= 1 / 3) return seg(0.12, 1 / 3, 0.012, 384400);
    if (t <= 2 / 3) return seg(1 / 3, 2 / 3, 384400, 1.4e9);
    return seg(2 / 3, 1, 1.4e9, 150000 * LY);
  }
  const fmt = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });
  const fmt2 = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  function formatKm(km) {
    if (km < 1) return `${Math.round(km * 1000)} m`;
    if (km < 0.1 * LY) return `${fmt.format(Math.round(km))} km`;
    const ly = km / LY;
    return ly < 10 ? `${fmt2.format(ly)} light-years` : `${fmt.format(Math.round(ly))} light-years`;
  }

  function updateChrome(t) {
    bars.forEach((b, i) => b.style.setProperty('--fill', i === 0 ? 1 : clamp(t * 3 - (i - 1), 0, 1).toFixed(4)));
    dist.textContent = formatKm(distanceKm(t));
  }

  function setCurrent(i) {
    if (i === current) return;
    current = i;
    chapBtns.forEach((b, k) => (k === i ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
    live.textContent = `Showing ${NAMES[i]}`;
    const swap = () => { pairN.textContent = String(i + 1).padStart(2, '0'); pairL.textContent = PAIRS[i]; };
    if (reduce) { swap(); return; }
    pair.classList.add('swap');
    setTimeout(() => { swap(); pair.classList.remove('swap'); }, 220);
  }

  const copies = chapters.map((c) => $('.copy', c));
  function readChapter() {
    let idx = 0;
    chapters.forEach((c, i) => { if (c.getBoundingClientRect().top <= 64 + 120) idx = i; });
    const vh = innerHeight;
    copies.forEach((el) => {
      const r = el.getBoundingClientRect();
      const off = Math.abs(r.top + r.height / 2 - vh / 2) / vh;
      el.style.opacity = (1 - sstep(0.3, 0.47, off)).toFixed(3);
    });
    setCurrent(idx);
    const past = journey.getBoundingClientRect().bottom <= 64;
    topBar.classList.toggle('solid', past);
  }

  function frame(now) {
    let busy = false;
    if (!reduce && introStart) {
      const k = clamp((now - introStart - INTRO_DELAY) / INTRO_MS, 0, 1);
      house = 1 - smooth(k);
      busy = k < 1;
    }
    if (reduce) shown = goal;
    else {
      shown += (goal - shown) * 0.08;
      if (Math.abs(goal - shown) < 0.0008) shown = goal;
      else busy = true;
    }
    draw(shown);
    updateChrome(shown);
    if (busy) requestAnimationFrame(frame);
    else running = false;
  }
  function kick() {
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  }

  function onScroll() {
    goal = progress();
    readChapter();
    kick();
  }

  chapBtns.forEach((b) => b.addEventListener('click', () => {
    const el = document.getElementById(b.dataset.jump);
    const top = el.getBoundingClientRect().top + scrollY;
    scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  }));

  resize();
  goal = shown = progress();
  readChapter();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { resize(); onScroll(); kick(); });
  introStart = performance.now();
  kick();

  /* ------------------------------------------------------------------
     The ticket wallet
  ------------------------------------------------------------------ */
  const TIERS = {
    seat: {
      name: 'One seat', line: 'One seat', price: 'A reclined seat for one night',
      perks: ['A reclined seat facing the centre of the dome', 'Doors at 22:15, lights down at 22:30', 'Stay after for questions with the astronomer on duty'],
    },
    pair: {
      name: 'Pair', line: 'Two seats', price: 'Side by side, one night',
      perks: ['Two reclined seats next to each other', 'Pick Friday or either Saturday show', 'Swap the night up to a day before'],
    },
    member: {
      name: 'Member', line: 'Member', price: 'Every late show for twelve months',
      perks: ['Any free seat at any Late Light', 'Book a night before it goes on general sale', 'Bring one guest on your birthday month'],
    },
  };
  const tStage = $('#t-stage');
  const slots = $$('.slot', tStage);
  const tierLine = $('#tier-line'), tierPrice = $('#tier-price'), perks = $('#perks');
  const front = () => slots.find((s) => s.dataset.slot === '0');
  const REST = { rx: -3, ry: 6, px: 30, gx: 28, gy: 22 };

  function setVars(p, rx, ry, px, gx, gy) {
    p.style.setProperty('--rx', `${rx}deg`);
    p.style.setProperty('--ry', `${ry}deg`);
    p.style.setProperty('--px', `${px}%`);
    p.style.setProperty('--gx', `${gx}%`);
    p.style.setProperty('--gy', `${gy}%`);
  }
  function tilt(p, rx, ry) {
    p._rx = rx; p._ry = ry;
    setVars(p, rx, ry, 50 - (ry / 12) * 40, 50 - (ry / 12) * 45, 50 + (rx / 12) * 45);
  }
  function rest(p) {
    p._rx = 0; p._ry = 0;
    setVars(p, REST.rx, REST.ry, REST.px, REST.gx, REST.gy);
  }
  function clear(p) { ['--rx', '--ry', '--px', '--gx', '--gy'].forEach((v) => p.style.removeProperty(v)); }

  function roles() {
    slots.forEach((s) => {
      const p = $('.pass', s), t = TIERS[s.dataset.tier];
      if (s.dataset.slot === '0') {
        p.setAttribute('role', 'group');
        p.setAttribute('aria-roledescription', 'ticket');
        p.setAttribute('aria-label', `${t.name} ticket. Arrow keys tilt it.`);
      } else {
        p.setAttribute('role', 'button');
        p.removeAttribute('aria-roledescription');
        p.setAttribute('aria-label', `Bring the ${t.name} ticket forward`);
      }
    });
  }
  function copy() {
    const t = TIERS[front().dataset.tier];
    tierLine.textContent = t.line;
    tierPrice.textContent = t.price;
    perks.innerHTML = t.perks.map((x) => `<li>${x}</li>`).join('');
  }
  function bring(slot) {
    const cur = front();
    if (cur === slot) return;
    cur.dataset.slot = slot.dataset.slot;
    slot.dataset.slot = '0';
    const old = $('.pass', cur);
    old.classList.remove('track');
    clear(old);
    rest($('.pass', slot));
    roles();
    copy();
    $('.pass', slot).focus({ preventScroll: true });
  }

  let raf = 0;
  slots.forEach((s) => {
    const p = $('.pass', s);
    p.addEventListener('click', () => { if (s.dataset.slot !== '0') bring(s); });
    p.addEventListener('keydown', (e) => {
      if (s.dataset.slot !== '0') {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bring(s); }
        return;
      }
      if (reduce) return;
      const step = { ArrowUp: [-4, 0], ArrowDown: [4, 0], ArrowLeft: [0, 4], ArrowRight: [0, -4] }[e.key];
      if (step) {
        e.preventDefault();
        p.classList.remove('track');
        tilt(p, clamp((p._rx || 0) + step[0], -12, 12), clamp((p._ry || 0) + step[1], -12, 12));
      } else if (e.key === 'Escape' || e.key === 'Home') {
        e.preventDefault();
        tilt(p, 0, 0);
      }
    });
    if (reduce) return;
    p.addEventListener('pointerenter', () => { if (s.dataset.slot === '0') p.classList.add('track'); });
    p.addEventListener('pointermove', (e) => {
      if (s.dataset.slot !== '0' || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = p.getBoundingClientRect();
        const nx = clamp((e.clientX - r.left) / r.width - 0.5, -0.5, 0.5);
        const ny = clamp((e.clientY - r.top) / r.height - 0.5, -0.5, 0.5);
        tilt(p, ny * 24, -nx * 24);
      });
    });
    p.addEventListener('pointerleave', () => {
      if (s.dataset.slot !== '0') return;
      p.classList.remove('track');
      rest(p);
    });
  });
  roles();

  /* ------------------------------------------------------------------
     Booking dialog
  ------------------------------------------------------------------ */
  const dlg = $('#book');
  const form = $('#book-form');
  const done = $('#book-done');
  $('#open-book').addEventListener('click', () => dlg.showModal());
  const shut = () => dlg.close();
  $('#book-x').addEventListener('click', shut);
  $('#book-cancel').addEventListener('click', shut);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) shut(); });
  dlg.addEventListener('close', () => { form.classList.remove('ok'); form.reset(); done.textContent = ''; });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const d = new FormData(form);
    const seats = Number(d.get('seats'));
    done.textContent = `Thanks, ${d.get('name')}. The box office will write to ${d.get('email')} about ${seats} ${seats === 1 ? 'seat' : 'seats'} on ${d.get('night')}.`;
    form.classList.add('ok');
    setTimeout(shut, 1200);
  });

  $('#to-top').addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
})();
