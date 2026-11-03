(() => {
  "use strict";

  /* ------------------------------------------------------------------
     Simulated feed. In production these would come from van telematics
     and the driver app; here a small model keeps the board moving.
  ------------------------------------------------------------------ */

  const START_MIN = 11 * 60 + 24;           // board opens at 11:24
  const SHIFT = [7 * 60 + 30, 18 * 60];
  const MIN_PER_STOP = 7;
  const LATE_AT = 10;                        // minutes behind plan = "late"
  const DEPOT = [500, 322];
  let simSec = START_MIN * 60;

  const STREETS = ["Mill Rd", "Harrow St", "Quay Lane", "Station Ave", "Ropewalk", "Cedar Close", "Kiln Lane", "Brook St", "Abbey Row", "Foundry Way", "Tanner St", "Orchard Rise", "Wharf Rd", "Chapel Yard", "Low Gate", "Marsh Lane"];

  const vans = [
    { id: "V01", driver: "Priya Shah",    area: "North Loop",      c: [500, 112], total: 26, done: 18, delay: 2,  speed: 1 },
    { id: "V02", driver: "Tomas Nowak",   area: "Riverside",       c: [250, 470], total: 22, done: 9,  delay: 24, speed: .6, note: "Bridge St closed, diverting" },
    { id: "V03", driver: "Ade Okafor",    area: "Old Town",        c: [650, 215], total: 20, done: 14, delay: 6,  speed: 1 },
    { id: "V04", driver: "Mei Lin",       area: "East Industrial", c: [860, 150], total: 24, done: 21, delay: 0,  speed: 1.1 },
    { id: "V05", driver: "Jonas Berg",    area: "Harbour",         c: [835, 455], total: 25, done: 11, delay: 12, speed: .8 },
    { id: "V06", driver: "Rosa Delgado",  area: "University",      c: [320, 205], total: 19, done: 16, delay: 0,  speed: 1 },
    { id: "V07", driver: "Sam Carter",    area: "Hillside",        c: [120, 105], total: 23, done: 7,  delay: 9,  speed: .9 },
    { id: "V08", driver: "Fatima Noor",   area: "West End",        c: [110, 300], total: 21, done: 19, delay: 0,  speed: 1 },
    { id: "V09", driver: "Luca Romano",   area: "Market",          c: [440, 545], total: 24, done: 12, delay: 38, speed: .7 },
    { id: "V10", driver: "Hana Sato",     area: "South Park",      c: [660, 545], total: 24, done: 24, delay: 0,  speed: 1, returning: true },
    { id: "V11", driver: "Diego Alvarez", area: "Airport Road",    c: [925, 310], total: 18, done: 10, delay: 7,  speed: 1 },
    { id: "V12", driver: "Ellie Brooks",  area: "Depot",           c: DEPOT,      total: 20, done: 0,  delay: 0,  speed: 0, atDepot: true, departs: "11:40" },
  ];

  // issues: sev 1 = van stopped / safety, sev 2 = needs a decision
  const issues = [
    { id: "i1", van: "V03", sev: 1, since: 11 * 60 + 6,  what: "Flat tyre", detail: "Stopped on Abbey Row with 6 parcels left. Spare is on but wheel nut is seized.", action: "Send recovery" },
    { id: "i2", van: "V07", sev: 2, since: 11 * 60 + 15, what: "Can't get into gated estate", detail: "Orchard Rise gate code from customer is wrong. 4 parcels for the estate.", action: "Text new code" },
    { id: "i3", van: "V09", sev: 2, since: 11 * 60 + 19, what: "Asks to hand off 5 stops", detail: "38 min behind after the market road closure. Won't make the 14:00 window for the last five.", action: "Give 5 to V10", reassign: { to: "V10", stops: 5 } },
  ];
  const lateIssue = { id: "i4", van: "V05", sev: 1, what: "Engine warning light", detail: "Amber light on the dash, van feels sluggish. Pulled over on Wharf Rd.", action: "Send recovery" };

  const feed = [
    { t: "11:22", html: "<b>V04</b> delivered to 3 Foundry Way" },
    { t: "11:19", html: "<b>V09</b> asked to hand off stops" },
    { t: "11:17", html: "<b>V10</b> finished South Park, heading back" },
    { t: "11:15", html: "<b>V07</b> reported a gate problem" },
    { t: "11:06", html: "<b>V03</b> reported a flat tyre" },
  ];

  let selected = null;
  let filter = "all";

  /* ---------------- helpers ---------------- */
  const $ = (s, el = document) => el.querySelector(s);
  const byId = id => vans.find(v => v.id === id);
  const nowMin = () => Math.floor(simSec / 60);
  const hhmm = m => { m = Math.round(m) % 1440; return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function rng(seed) {
    return () => { seed |= 0; seed = seed + 0x6d2b79f5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }

  /* ---------------- routes ---------------- */
  function buildRoute(v, i) {
    const r = rng(i * 977 + 13);
    const n = 7;
    const loop = [];
    const a0 = r() * Math.PI * 2;
    for (let k = 0; k < n; k++) {
      const a = a0 + (k / n) * Math.PI * 2;
      const rad = 42 + r() * 38;
      loop.push([
        Math.max(24, Math.min(976, v.c[0] + Math.cos(a) * rad * 1.15)),
        Math.max(24, Math.min(616, v.c[1] + Math.sin(a) * rad * .9)),
      ]);
    }
    // manhattanise: insert a corner between every pair so routes follow streets
    const raw = [DEPOT, ...loop];
    const pts = [raw[0]];
    for (let k = 1; k < raw.length; k++) {
      const p = raw[k - 1], q = raw[k];
      pts.push(k % 2 ? [q[0], p[1]] : [p[0], q[1]], q);
    }
    const cum = [0];
    for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
    v.route = { pts, cum, loopStart: cum[2], end: cum[cum.length - 1] };
    v.streets = Array.from({ length: v.total + 8 }, (_, k) => `${1 + Math.floor(r() * 88)} ${STREETS[Math.floor(r() * STREETS.length)]}`);
    v.ping = Math.floor(r() * 25);
    v.progress = v.done + (v.speed ? r() * .6 : 0);
  }

  function pointAt(route, len) {
    const { pts, cum } = route;
    len = Math.max(0, Math.min(route.end, len));
    let k = 1;
    while (k < cum.length - 1 && cum[k] < len) k++;
    const seg = cum[k] - cum[k - 1] || 1, f = (len - cum[k - 1]) / seg;
    return [pts[k - 1][0] + (pts[k][0] - pts[k - 1][0]) * f, pts[k - 1][1] + (pts[k][1] - pts[k - 1][1]) * f];
  }
  const stopLen = (v, s) => v.route.loopStart + (v.route.end - v.route.loopStart) * (s / v.total);

  function vanPos(v) {
    if (v.atDepot) return [DEPOT[0] + 26, DEPOT[1] + 2];
    if (v.returning) {
      const last = v.route.pts[v.route.pts.length - 1];
      const f = Math.min(1, v.returnProgress || 0);
      return [last[0] + (DEPOT[0] - last[0]) * f, last[1] + (DEPOT[1] - last[1]) * f];
    }
    return pointAt(v.route, stopLen(v, v.progress));
  }

  /* ---------------- derived state ---------------- */
  const openIssue = v => issues.find(i => i.van === v.id && !i.resolved);

  function vanDelay(v) {
    const iss = openIssue(v);
    // stopped vans fall further behind every minute they wait
    if (iss && iss.sev === 1) return v.delay + Math.max(0, nowMin() - iss.since);
    return v.delay;
  }

  function status(v) {
    if (openIssue(v)) return "help";
    if (v.atDepot || v.returning) return "idle";
    return vanDelay(v) >= LATE_AT ? "late" : "ok";
  }
  const STATUS_TEXT = { ok: "On time", late: "Late", help: "Needs help", idle: "" };
  function statusText(v) {
    const s = status(v);
    if (s === "idle") return v.atDepot ? "Loading" : "Returning";
    return STATUS_TEXT[s];
  }
  const RANK = { help: 0, late: 1, ok: 2, idle: 3 };

  function finishMin(v) {
    if (v.atDepot) return 11 * 60 + 40 + v.total * MIN_PER_STOP + 20;
    if (v.returning) return nowMin() + Math.round(18 * (1 - (v.returnProgress || 0)));
    const left = v.total - v.done;
    const iss = openIssue(v);
    const stall = iss && iss.sev === 1 ? 20 : 0;     // assume ~20 min more to get moving
    return nowMin() + left * MIN_PER_STOP + stall + 15; // +15 drive back
  }

  function nextStop(v) {
    if (v.atDepot) return { addr: `Departs ${v.departs}`, eta: `${v.total} stops loaded` };
    if (v.returning) return { addr: "Back to depot", eta: `ETA ${hhmm(finishMin(v))}` };
    const iss = openIssue(v);
    const eta = nowMin() + Math.round((1 - (v.progress - v.done)) * MIN_PER_STOP) + (iss && iss.sev === 1 ? 20 : 0);
    return { addr: v.streets[v.done], eta: `ETA ${hhmm(eta)}${vanDelay(v) >= LATE_AT ? ` · due ${hhmm(eta - vanDelay(v))}` : ""}` };
  }

  /* ---------------- map ---------------- */
  const svg = $("#map");
  const NS = "http://www.w3.org/2000/svg";

  function drawMap() {
    const roads = [
      "M 140 320 A 360 222 0 1 1 860 320 A 360 222 0 1 1 140 320",
      "M -10 300 L 330 300 L 500 322 L 1010 290",
      "M 500 -10 L 500 322 L 470 650",
      "M 60 -10 L 220 180 L 500 322",
      "M 500 322 L 760 140 L 1010 90",
      "M 500 322 L 720 470 L 1010 520",
      "M 500 322 L 250 560 L 180 650",
    ];
    let streets = "";
    for (let x = 22; x < 1000; x += 44) streets += `M${x} 0V640`;
    for (let y = 18; y < 640; y += 44) streets += `M0 ${y}H1000`;

    svg.innerHTML = `
      <rect width="1000" height="640" fill="var(--land)"/>
      <path class="street" d="${streets}" opacity=".7"/>
      <rect x="168" y="54" width="128" height="74" rx="14" fill="var(--park)"/>
      <rect x="596" y="508" width="118" height="82" rx="14" fill="var(--park)"/>
      <ellipse cx="352" cy="128" rx="44" ry="26" fill="var(--park)"/>
      <path d="M -20 448 C 160 400, 300 470, 470 418 S 740 310, 1020 362" fill="none" stroke="var(--water)" stroke-width="40" stroke-linecap="round"/>
      <path d="M 760 660 L 760 586 C 806 544, 902 540, 1010 488 L 1010 660 Z" fill="var(--water)"/>
      ${roads.map(d => `<path class="road-edge" d="${d}" stroke-width="10"/><path class="road" d="${d}" stroke-width="6.5"/>`).join("")}
      <text class="water-label" x="70" y="438" transform="rotate(-6 70 438)">River Wend</text>
      <text class="water-label" x="880" y="604">Harbour</text>
      <g id="districts"></g>
      <g id="route-layer"></g>
      <g class="depot" transform="translate(${DEPOT[0]} ${DEPOT[1]})">
        <rect x="-9" y="-9" width="18" height="18" rx="3"/>
        <path d="M-4 1 0 -4 4 1 M-2.5 0v4h5v-4" stroke="#fff" stroke-width="1.5" fill="none"/>
        <text x="-14" y="-15" text-anchor="end">DEPOT</text>
      </g>
      <g id="van-layer"></g>
      <g id="van-top"></g>`;

    const dl = $("#districts", svg);
    vans.filter(v => !v.atDepot).forEach(v => {
      const t = document.createElementNS(NS, "text");
      t.setAttribute("class", "district");
      t.setAttribute("x", v.c[0]);
      t.setAttribute("y", Math.max(22, v.c[1] - 82));
      t.setAttribute("text-anchor", v.c[0] > 900 ? "end" : v.c[0] < 100 ? "start" : "middle");
      if (v.c[0] < 100) t.setAttribute("x", 18);
      if (v.c[0] > 900) t.setAttribute("x", 982);
      t.textContent = v.area;
      dl.appendChild(t);
    });

    const layer = $("#van-layer", svg);
    vans.forEach(v => {
      const g = document.createElementNS(NS, "g");
      g.setAttribute("class", "van");
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");
      g.dataset.id = v.id;
      g.innerHTML = `<circle class="pulse" r="13"/><circle class="van-body" r="13"/><text class="van-num">${v.id.slice(1)}</text><text class="van-tag" x="18" y="4"></text>`;
      g.addEventListener("click", e => { e.stopPropagation(); select(v.id); });
      g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(v.id); } });
      layer.appendChild(g);
      v.el = g;
    });
    svg.addEventListener("click", () => select(null));
  }

  const COLOR = { ok: "var(--ok)", late: "var(--late)", help: "var(--help)", idle: "var(--idle)" };

  function renderMap() {
    vans.forEach(v => {
      const [x, y] = vanPos(v);
      const s = status(v);
      v.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      v.el.querySelector(".van-body").setAttribute("fill", COLOR[s]);
      v.el.querySelector(".pulse").style.display = s === "help" ? "" : "none";
      const tag = v.el.querySelector(".van-tag");
      const iss = openIssue(v);
      tag.textContent = iss ? iss.what : s === "late" ? `+${vanDelay(v)} min` : "";
      tag.setAttribute("x", x > 820 ? -18 : 18);
      tag.setAttribute("text-anchor", x > 820 ? "end" : "start");
      v.el.classList.toggle("is-sel", selected === v.id);
      v.el.classList.toggle("is-dim", !!selected && selected !== v.id && s !== "help");
      v.el.setAttribute("aria-label", `${v.id} ${v.driver}, ${statusText(v)}`);
    });
    // keep help vans on top
    // keep help vans and the selected van on top, moving nodes only when that changes
    const top = $("#van-top", svg), low = $("#van-layer", svg);
    vans.forEach(v => {
      const want = status(v) === "help" || v.id === selected ? top : low;
      if (v.el.parentNode !== want) want.appendChild(v.el);
    });

    const rl = $("#route-layer", svg);
    const v = selected && byId(selected);
    if (!v || v.atDepot || v.returning) { rl.innerHTML = ""; return; }
    const here = stopLen(v, v.progress);
    const sample = (a, b) => {
      const out = [pointAt(v.route, a)];
      v.route.cum.forEach((c, k) => { if (c > a && c < b) out.push(v.route.pts[k]); });
      out.push(pointAt(v.route, b));
      return out.map(p => p.map(n => n.toFixed(1)).join(",")).join(" ");
    };
    let dots = "";
    for (let s = 1; s <= v.total; s++) {
      const [x, y] = pointAt(v.route, stopLen(v, s));
      dots += `<circle class="stop ${s <= v.done ? "done" : "todo"}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${s <= v.done ? 2.6 : 3.4}"/>`;
    }
    rl.innerHTML = `<polyline class="route-done" points="${sample(0, here)}"/><polyline class="route-todo" points="${sample(here, v.route.end)}"/>${dots}`;
  }

  /* ---------------- selected van card ---------------- */
  const ICON_PHONE = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3.5 2h2.2l1.1 3-1.5 1a8 8 0 0 0 3.7 3.7l1-1.5 3 1.1v2.2c0 .8-.7 1.5-1.5 1.5A11.5 11.5 0 0 1 2 3.5C2 2.7 2.7 2 3.5 2Z"/></svg>`;
  const ICON_MSG = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2.5 3h11v8h-6l-3 2.5V11h-2z"/></svg>`;

  function renderCard() {
    const card = $("#van-card");
    const v = selected && byId(selected);
    if (!v) { card.hidden = true; return; }
    card.hidden = false;
    card.classList.toggle("on-right", vanPos(v)[0] < 520);
    const s = status(v), iss = openIssue(v), nx = nextStop(v), d = vanDelay(v);
    const phone = "+44 7700 900" + String(100 + vans.indexOf(v) * 37).slice(-3);
    card.innerHTML = `
      <div class="vc-top">
        <div>
          <p class="vc-name">${v.id} · ${esc(v.driver)}</p>
          <p class="vc-sub">${esc(v.area)} · <span class="badge st-${s}">${statusText(v)}</span></p>
        </div>
        <button class="vc-close" type="button" aria-label="Close">
          <svg viewBox="0 0 16 16" width="16" height="16" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8"/></svg>
        </button>
      </div>
      <dl class="vc-grid">
        <div><dt>Stops</dt><dd>${v.done} of ${v.total}</dd></div>
        <div><dt>Behind plan</dt><dd>${d ? d + " min" : "—"}</dd></div>
        <div><dt>Next</dt><dd>${esc(nx.addr)}</dd></div>
        <div><dt>Last ping</dt><dd>${v.ping}s ago</dd></div>
      </dl>
      ${iss ? `<p class="vc-issue st-help">${esc(iss.what)} · ${nowMin() - iss.since} min</p>` : v.note ? `<p class="vc-issue st-late">${esc(v.note)}</p>` : ""}
      <div class="vc-actions">
        <a class="btn btn-dark" href="tel:${phone.replace(/\s/g, "")}">${ICON_PHONE}Call ${esc(v.driver.split(" ")[0])}</a>
        <button class="btn" type="button">${ICON_MSG}Message</button>
      </div>`;
    $(".vc-close", card).onclick = () => select(null);
  }

  /* ---------------- help queue ---------------- */
  function renderHelp() {
    const open = issues.filter(i => !i.resolved && i.since <= nowMin())
      .sort((a, b) => (!!a.ack - !!b.ack) || a.sev - b.sev || a.since - b.since);
    const pending = open.filter(i => !i.ack).length;
    const pill = $("#help-count");
    pill.textContent = open.length ? `${pending} waiting` : "All clear";
    pill.classList.toggle("is-clear", !pending);

    const list = $("#help-list");
    if (!open.length) { list.innerHTML = `<li class="help-empty">Nobody is waiting on you. Nice.</li>`; return; }
    list.innerHTML = open.map(i => {
      const v = byId(i.van), mins = nowMin() - i.since;
      return `<li class="help-item sev-${i.sev}${i.ack ? " is-ack" : ""}${selected === v.id ? " is-sel" : ""}" data-van="${v.id}">
        <div class="hi-top"><p class="hi-what">${esc(i.what)}</p><p class="hi-time">${mins < 1 ? "just now" : mins + " min"}</p></div>
        <p class="hi-who">${v.id} · ${esc(v.driver)} · ${esc(v.area)}</p>
        <p class="hi-detail">${esc(i.detail)}</p>
        ${i.ack ? `<p class="hi-ack">You took this at ${i.ack}.</p>` : ""}
        <div class="hi-actions">
          <a class="btn" href="tel:+447700900000" data-stop>${ICON_PHONE}Call</a>
          ${i.ack
            ? `<button class="btn btn-dark" type="button" data-resolve="${i.id}">${esc(i.action)} · done</button>`
            : `<button class="btn btn-dark" type="button" data-ack="${i.id}">I'm on it</button>`}
        </div>
      </li>`;
    }).join("");
  }

  $("#help-list").addEventListener("click", e => {
    const ack = e.target.closest("[data-ack]");
    const res = e.target.closest("[data-resolve]");
    if (ack) {
      const i = issues.find(x => x.id === ack.dataset.ack);
      i.ack = hhmm(nowMin());
      log(`<b>${i.van}</b> help taken by dispatch`);
      renderAll();
      return;
    }
    if (res) {
      const i = issues.find(x => x.id === res.dataset.resolve);
      resolve(i);
      return;
    }
    if (e.target.closest("[data-stop]")) return;
    const item = e.target.closest(".help-item");
    if (item) select(item.dataset.van);
  });

  function resolve(i) {
    i.resolved = true;
    const v = byId(i.van);
    if (i.reassign) {
      const to = byId(i.reassign.to);
      const n = i.reassign.stops;
      const moved = v.streets.slice(v.total - n, v.total);
      v.total -= n;
      v.delay = Math.max(0, v.delay - 30);
      to.returning = false;
      to.streets = to.streets.slice(0, to.total).concat(moved, to.streets.slice(to.total));
      to.total += n;
      to.area = to.area + " + Market";
      to.c = v.c;
      buildRoute(to, vans.indexOf(to));
      to.done = to.total - n;
      to.progress = to.done;
      log(`<b>${n} stops</b> moved from ${v.id} to ${to.id}`);
    } else {
      log(`<b>${v.id}</b> ${esc(i.what.toLowerCase())}: sorted`);
    }
    // freeze accumulated stall into base delay
    if (i.sev === 1) v.delay = v.delay + Math.max(0, nowMin() - i.since);
    renderAll();
  }

  /* ---------------- feed ---------------- */
  function log(html) {
    feed.unshift({ t: hhmm(nowMin()), html, fresh: true });
    feed.length = Math.min(feed.length, 6);
    renderFeed();
  }
  function renderFeed() {
    $("#feed").innerHTML = feed.map(f => `<li class="${f.fresh ? "is-new" : ""}"><time>${f.t}</time><span>${f.html}</span></li>`).join("");
    feed.forEach(f => (f.fresh = false));
  }

  /* ---------------- fleet rows ---------------- */
  function renderRows() {
    const sorted = [...vans].sort((a, b) => RANK[status(a)] - RANK[status(b)] || vanDelay(b) - vanDelay(a) || a.id.localeCompare(b.id));
    const counts = { late: 0, help: 0, ok: 0 };
    vans.forEach(v => { const s = status(v); if (s === "idle") counts.ok++; else counts[s]++; });
    $("#f-late").textContent = counts.late;
    $("#f-help").textContent = counts.help;
    $("#f-ok").textContent = counts.ok;

    $("#rows").innerHTML = sorted.map(v => {
      const s = status(v), d = vanDelay(v), nx = nextStop(v);
      const show = filter === "all" || filter === s || (filter === "ok" && s === "idle");
      const pct = Math.round((v.done / v.total) * 100);
      const dCls = s === "help" ? "is-help" : d >= LATE_AT ? "is-late" : d === 0 ? "is-zero" : "";
      return `<li class="row${selected === v.id ? " is-sel" : ""}${show ? "" : " is-hidden"}" data-van="${v.id}" tabindex="0">
        <span class="c-id">${v.id}</span>
        <span class="c-driver"><b>${esc(v.driver)}</b><span>${esc(v.area)}</span></span>
        <span class="c-status"><span class="badge st-${s}">${statusText(v)}</span></span>
        <span class="c-stops"><span class="bar"><span style="width:${pct}%"></span></span>${v.done}/${v.total}</span>
        <span class="c-next"><span>${esc(nx.addr)}</span><small>${nx.eta}</small></span>
        <span class="c-delay ${dCls}">${d ? "+" + d : "0"}</span>
        <span class="c-eta">${hhmm(finishMin(v))}</span>
      </li>`;
    }).join("");
  }

  $("#rows").addEventListener("click", e => { const r = e.target.closest(".row"); if (r) select(r.dataset.van, true); });
  $("#rows").addEventListener("keydown", e => { const r = e.target.closest(".row"); if (r && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); select(r.dataset.van, true); } });

  document.querySelectorAll(".filter").forEach(b => b.addEventListener("click", () => setFilter(b.dataset.filter)));
  function setFilter(f) {
    filter = f;
    document.querySelectorAll(".filter").forEach(b => { const on = b.dataset.filter === f; b.classList.toggle("is-on", on); b.setAttribute("aria-selected", on); });
    renderRows();
  }

  document.querySelectorAll("[data-jump]").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.jump === "late") { setFilter("late"); $("#fleet").scrollIntoView({ behavior: "smooth", block: "start" }); }
    else $("#help").scrollIntoView({ behavior: "smooth", block: "start" });
  }));

  /* ---------------- summary ---------------- */
  function renderSummary() {
    const out = vans.filter(v => !v.atDepot && !v.returning).length;
    const returning = vans.filter(v => v.returning).length;
    $("#s-out").textContent = out;
    $("#s-out-note").textContent = [vans.some(v => v.atDepot) && "1 loading", returning && `${returning} returning`].filter(Boolean).join(" · ") || "everyone is out";
    const done = vans.reduce((a, v) => a + v.done, 0), total = vans.reduce((a, v) => a + v.total, 0);
    $("#s-done").textContent = done;
    $("#s-total").textContent = "/" + total;
    $("#s-meter").style.width = (done / total * 100).toFixed(1) + "%";

    const late = vans.filter(v => status(v) === "late").sort((a, b) => vanDelay(b) - vanDelay(a));
    $("#s-late").textContent = late.length;
    $("#s-late-note").textContent = late.length ? `worst ${late[0].id}, +${vanDelay(late[0])} min` : "nobody behind";
    const help = vans.filter(v => status(v) === "help");
    const oldest = issues.filter(i => !i.resolved && !i.ack && i.since <= nowMin()).sort((a, b) => a.since - b.since)[0];
    $("#s-help").textContent = help.length;
    $("#s-help-note").textContent = oldest ? `oldest waiting ${nowMin() - oldest.since} min` : help.length ? "all being handled" : "all clear";

    const last = vans.reduce((m, v) => (finishMin(v) > finishMin(m) ? v : m));
    const f = finishMin(last);
    $("#s-return").textContent = hhmm(f);
    $("#s-return-note").textContent = f > SHIFT[1] ? `${last.id}, ${f - SHIFT[1]} min past shift` : `${last.id} · inside shift`;
  }

  /* ---------------- clock ---------------- */
  function renderClock() {
    const m = simSec / 60;
    $("#clock").textContent = hhmm(Math.floor(m));
    $("#shift-fill").style.width = Math.max(0, Math.min(100, (m - SHIFT[0]) / (SHIFT[1] - SHIFT[0]) * 100)) + "%";
  }

  /* ---------------- selection ---------------- */
  function select(id, fromList) {
    selected = selected === id && !fromList ? null : id;
    renderAll();
    const ms = $("#map-scroll"), v = selected && byId(selected);
    if (v && ms.scrollWidth > ms.clientWidth) {
      const x = vanPos(v)[0] / 1000 * ms.scrollWidth;
      ms.scrollTo({ left: x - ms.clientWidth / 2, behavior: "smooth" });
    }
    if (selected && fromList && window.innerWidth <= 900) $(".map-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderAll() { renderMap(); renderCard(); renderHelp(); renderRows(); renderSummary(); }

  /* ---------------- simulation tick ---------------- */
  let tick = 0;
  function step() {
    tick++;
    vans.forEach(v => {
      v.ping = (v.ping + 3) % 30;
      if (v.returning) { v.returnProgress = Math.min(1, (v.returnProgress || 0) + .02); return; }
      if (v.atDepot || openIssue(v)?.sev === 1 || !v.speed) return;
      if (openIssue(v)) return; // waiting on a decision at the kerb
      if (v.done >= v.total) return;
      v.progress += 0.05 * v.speed + Math.random() * .03;
      if (Math.floor(v.progress) > v.done) {
        v.done = Math.min(v.total, Math.floor(v.progress));
        log(`<b>${v.id}</b> delivered to ${esc(v.streets[v.done - 1])}`);
        if (v.done === v.total) { v.returning = true; v.returnProgress = 0; log(`<b>${v.id}</b> finished, heading back`); }
      }
    });
    if (tick === 9 && !lateIssue.since) {
      lateIssue.since = nowMin();
      issues.push(lateIssue);
      log(`<b>${lateIssue.van}</b> reported ${lateIssue.what.toLowerCase()}`);
    }
    renderAll();
  }

  /* ---------------- boot ---------------- */
  vans.forEach(buildRoute);
  drawMap();
  $("#today-date").textContent = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  renderClock();
  renderFeed();
  renderAll();
  const ms = $("#map-scroll");
  ms.scrollLeft = (ms.scrollWidth - ms.clientWidth) / 2;
  setInterval(() => { simSec += 1; renderClock(); }, 1000);
  setInterval(step, 3000);
})();
