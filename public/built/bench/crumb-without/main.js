(() => {
  "use strict";

  const S = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  const ART = {
    tart: `<svg viewBox="0 0 48 48" ${S}><path d="M7 22h34l-4 13a3 3 0 0 1-3 2H14a3 3 0 0 1-3-2z"/><path d="M9 22c2-4 8-6 15-6s13 2 15 6"/><circle cx="20" cy="19" r="1.6" fill="currentColor"/><circle cx="28" cy="20" r="1.2" fill="currentColor"/><path d="M15 27v6M21 27v7M27 27v7M33 27v6"/></svg>`,
    loaf: `<svg viewBox="0 0 48 48" ${S}><path d="M6 30c0-9 8-16 18-16s18 7 18 16v2a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"/><path d="M15 21l3 6M23 19l2 7M31 21l-1 6"/></svg>`,
    round: `<svg viewBox="0 0 48 48" ${S}><circle cx="24" cy="25" r="15"/><path d="M14 22c3-4 7-6 10-6M18 30c4 2 9 2 13-1"/><path d="M24 10v3"/></svg>`,
    bun: `<svg viewBox="0 0 48 48" ${S}><ellipse cx="24" cy="27" rx="16" ry="11"/><path d="M14 23c2-3 6-5 10-5s8 2 10 5"/><path d="M19 31h10" stroke-dasharray="1 3"/></svg>`,
    croissant: `<svg viewBox="0 0 48 48" ${S}><path d="M6 30c2-8 9-14 18-14s16 6 18 14c-3 2-6 2-8 0-2 3-6 4-10 4s-8-1-10-4c-2 2-5 2-8 0z"/><path d="M16 18l4 12M24 16v14M32 18l-4 12"/></svg>`,
    slice: `<svg viewBox="0 0 48 48" ${S}><path d="M8 34l30-20v20z"/><path d="M8 34h30M15 30l23-15"/><circle cx="31" cy="27" r="1.5" fill="currentColor"/></svg>`,
    pie: `<svg viewBox="0 0 48 48" ${S}><path d="M9 24h30l-3 12H12z"/><path d="M9 24c0-5 7-9 15-9s15 4 15 9"/><path d="M19 15c2 2 8 2 10 0"/></svg>`,
    moon: `<svg viewBox="0 0 48 48" ${S}><path d="M7 30a17 17 0 0 1 34 0z"/><path d="M7 30h34" stroke-dasharray="2 3"/><path d="M17 22l1 3M24 19v4M31 22l-1 3"/></svg>`
  };

  const BAKES = [
    { id: "nata", name: "Pastel de nata", gloss: "Custard tart", desc: "Laminated shell, burnt-top custard, a shake of cinnamon at the counter.", price: 1.4, cat: "pastry", art: "tart", out: "every 40 min", left: 46, of: 120, tag: ["Warm now", "hot"] },
    { id: "deus", name: "Pão de Deus", gloss: "Coconut-topped brioche", desc: "Soft milk bun under a crackled coconut and egg crust.", price: 1.9, cat: "pastry", art: "bun", out: "07:20", left: 9, of: 30 },
    { id: "berlim", name: "Bola de Berlim", gloss: "Doughnut, egg cream", desc: "Fried to order in batches of twelve, split and filled with doce de ovos.", price: 2.2, cat: "pastry", art: "round", out: "10:30", left: 3, of: 24, azul: true },
    { id: "croissant", name: "Croissant de manteiga", gloss: "Butter croissant", desc: "Azorean butter, three-day dough, very shattery. Ask for it warmed.", price: 2.0, cat: "pastry", art: "croissant", out: "07:00", left: 0, of: 36 },
    { id: "queijada", name: "Queijada de Sintra", gloss: "Fresh-cheese tartlet", desc: "Requeijão, cinnamon and a paper-thin crust. Ours is a little less sweet.", price: 1.6, cat: "pastry", art: "tart", out: "08:10", left: 18, of: 30, azul: true },
    { id: "alentejano", name: "Pão alentejano", gloss: "Sourdough, 800 g", desc: "Wheat and a little rye, long cold proof, the loaf every other one is measured against.", price: 4.8, cat: "bread", art: "loaf", out: "07:00", left: 11, of: 28, tag: ["Daily", ""] },
    { id: "broa", name: "Broa de milho", gloss: "Cornbread", desc: "Dense Minho-style cornbread with a cracked, floury top. Good with sardines.", price: 3.6, cat: "bread", art: "round", out: "08:00", left: 6, of: 16 },
    { id: "papo", name: "Papo-seco", gloss: "Crusty roll, bag of 6", desc: "The breakfast roll. Crisp shell, almost hollow inside. Butter is your job.", price: 1.8, cat: "bread", art: "bun", out: "07:00", left: 22, of: 40, azul: true },
    { id: "empada", name: "Empada de galinha", gloss: "Chicken pie", desc: "Short crust, shredded chicken, chouriço and a little white wine.", price: 2.6, cat: "savoury", art: "pie", out: "11:00", left: 14, of: 24 },
    { id: "rissol", name: "Rissol de camarão", gloss: "Prawn turnover", desc: "Creamy prawn filling, crumbed and fried. Gets busy around one.", price: 1.7, cat: "savoury", art: "moon", out: "11:30", left: 4, of: 30, tag: ["New", ""] },
    { id: "laranja", name: "Torta de laranja", gloss: "Orange roll, slice", desc: "Rolled orange sponge, mostly eggs and zest. Whole roll on request.", price: 2.4, cat: "cake", art: "slice", out: "09:00", left: 10, of: 16, azul: true },
    { id: "arroz", name: "Bolo de arroz", gloss: "Rice-flour muffin", desc: "In its paper sleeve, sugar crust on top. The one grandmothers buy.", price: 1.5, cat: "cake", art: "bun", out: "08:30", left: 0, of: 20 }
  ];

  const $ = (s, r = document) => r.querySelector(s);
  const eur = (n) => "€" + n.toFixed(2).replace(".", ",");
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } }
  };

  let bag = store.get("crumb.bag", {});
  // drop anything not available any more
  for (const id of Object.keys(bag)) {
    const b = BAKES.find((x) => x.id === id);
    if (!b || b.left === 0) delete bag[id]; else bag[id] = Math.min(bag[id], b.left);
  }
  let filter = "all";

  /* ---------- Date / hours ---------- */
  const HOURS = { 0: [8, 0, 14, 0], 1: null, 2: [7, 0, 19, 0], 3: [7, 0, 19, 0], 4: [7, 0, 19, 0], 5: [7, 0, 19, 0], 6: [7, 30, 19, 0] };
  const now = new Date();
  const fmtDay = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Lisbon" });
  $("#todayLabel").textContent = fmtDay.format(now);

  function lisbonNow() {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Lisbon", hour: "2-digit", minute: "2-digit", weekday: "short", hourCycle: "h23" }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { day: wd, mins: +get("hour") * 60 + +get("minute") };
  }
  const pad = (n) => String(n).padStart(2, "0");
  const hhmm = (m) => pad(Math.floor(m / 60)) + ":" + pad(m % 60);

  const ln = lisbonNow();
  const todayH = HOURS[ln.day];
  const openM = todayH ? todayH[0] * 60 + todayH[1] : 0;
  const closeM = todayH ? todayH[2] * 60 + todayH[3] : 0;
  const isOpen = todayH && ln.mins >= openM && ln.mins < closeM;
  const status = $("#openStatus");
  if (isOpen) status.lastElementChild.textContent = "Open until " + hhmm(closeM);
  else { status.classList.add("closed"); status.lastElementChild.textContent = todayH && ln.mins < openM ? "Opens " + hhmm(openM) : "Closed now"; }

  const dayRow = { 0: 0, 1: 1, 6: 6 }[ln.day] ?? 2;
  document.querySelector(`.hours tr[data-day="${dayRow}"]`)?.classList.add("today");

  // Pickup slots: today if there's time, otherwise next open day
  function pickupPlan() {
    let d = ln.day, offset = 0, start;
    const lead = 30; // minutes to pack
    for (let i = 0; i < 8; i++) {
      const h = HOURS[d];
      if (h) {
        const o = h[0] * 60 + h[1], c = h[2] * 60 + h[3];
        start = offset === 0 ? Math.max(o, Math.ceil((ln.mins + lead) / 15) * 15) : o;
        if (start <= c - 15) break;
      }
      d = (d + 1) % 7; offset++;
    }
    const h = HOURS[d];
    const close = h[2] * 60 + h[3];
    const slots = [];
    for (let m = start; m <= close - 15 && slots.length < 20; m += 15) slots.push(m);
    const label = offset === 0 ? "today" : offset === 1 ? "tomorrow" : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d];
    return { slots, label };
  }

  /* ---------- Board ---------- */
  const list = $("#list");

  function controlHTML(b) {
    const q = bag[b.id] || 0;
    if (b.left === 0) return `<button class="add" disabled>Sold out</button>`;
    if (!q) return `<button class="add" data-add="${b.id}" aria-label="Add ${b.name}">Add</button>`;
    return `<div class="stepper" role="group" aria-label="${b.name} quantity">
      <button data-dec="${b.id}" aria-label="One less">−</button>
      <output aria-live="polite">${q}</output>
      <button data-inc="${b.id}" aria-label="One more" ${q >= b.left ? "disabled" : ""}>+</button>
    </div>`;
  }

  function stockHTML(b) {
    if (b.left === 0) return `<span class="stock low">Sold out today</span>`;
    const pct = Math.max(6, Math.round((b.left / b.of) * 100));
    const low = b.left <= 5;
    return `<span class="stock ${low ? "low" : ""}"><span class="stock__bar"><i style="width:${pct}%"></i></span>${low ? "Only " + b.left + " left" : b.left + " left"}</span>`;
  }

  function render() {
    const items = BAKES.filter((b) => filter === "all" || b.cat === filter);
    if (!items.length) { list.innerHTML = `<li class="empty">Nothing here today.</li>`; return; }
    list.innerHTML = items.map((b) => `
      <li class="item ${b.left === 0 ? "is-out" : ""}" data-id="${b.id}">
        <div class="item__art ${b.azul ? "t-azul" : ""}" aria-hidden="true">${ART[b.art]}</div>
        <div class="item__body">
          <div class="item__top">
            <h3 class="item__name">${b.name}</h3>
            <span class="item__price">${eur(b.price)}</span>
          </div>
          <p class="item__gloss">${b.gloss}${b.tag ? ` <span class="tag ${b.tag[1] ? "tag--" + b.tag[1] : ""}">${b.tag[0]}</span>` : ""}</p>
          <p class="item__desc">${b.desc}</p>
          <div class="item__foot">
            <span class="stock-wrap">${stockHTML(b)}</span>
            <span class="ctl">${controlHTML(b)}</span>
          </div>
        </div>
      </li>`).join("");
  }

  function updateItem(id) {
    const li = list.querySelector(`[data-id="${id}"]`);
    if (!li) return;
    const b = BAKES.find((x) => x.id === id);
    li.querySelector(".ctl").innerHTML = controlHTML(b);
  }

  function setQty(id, q, focusSel) {
    const b = BAKES.find((x) => x.id === id);
    q = Math.max(0, Math.min(q, b.left));
    if (q) bag[id] = q; else delete bag[id];
    store.set("crumb.bag", bag);
    updateItem(id);
    renderBag();
    if (focusSel) {
      const el = list.querySelector(`[data-id="${id}"] ${focusSel}`) || list.querySelector(`[data-id="${id}"] .add`);
      el?.focus();
    }
  }

  list.addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.add) { setQty(t.dataset.add, 1, "[data-inc]"); toast(BAKES.find((b) => b.id === t.dataset.add).name + " added"); bump(); }
    else if (t.dataset.inc) { setQty(t.dataset.inc, (bag[t.dataset.inc] || 0) + 1, "[data-inc]"); bump(); }
    else if (t.dataset.dec) { setQty(t.dataset.dec, (bag[t.dataset.dec] || 0) - 1, "[data-dec]"); }
  });

  $("#chips").addEventListener("click", (e) => {
    const c = e.target.closest(".chip");
    if (!c) return;
    filter = c.dataset.filter;
    document.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-selected", x === c ? "true" : "false"));
    render();
  });

  /* ---------- Bag ---------- */
  const bagbar = $("#bagbar");
  const totals = () => Object.entries(bag).reduce((a, [id, q]) => {
    const b = BAKES.find((x) => x.id === id);
    a.n += q; a.sum += q * b.price; return a;
  }, { n: 0, sum: 0 });

  function renderBag() {
    const { n, sum } = totals();
    bagbar.hidden = n === 0;
    document.body.classList.toggle("has-bag", n > 0);
    $("#bagCount").textContent = n;
    $("#bagTotal").textContent = eur(sum);
    $("#sheetTotal").textContent = eur(sum);
    $("#bagList").innerHTML = Object.entries(bag).map(([id, q]) => {
      const b = BAKES.find((x) => x.id === id);
      return `<li><div class="bag__name"><strong>${b.name}</strong><span>${q} × ${eur(b.price)} = ${eur(q * b.price)}</span></div>
        <div class="stepper stepper--sm" role="group" aria-label="${b.name} quantity">
          <button type="button" data-bdec="${id}" aria-label="One less ${b.name}">−</button>
          <output>${q}</output>
          <button type="button" data-binc="${id}" aria-label="One more ${b.name}" ${q >= b.left ? "disabled" : ""}>+</button>
        </div></li>`;
    }).join("");
    if (n === 0 && !sheet.hidden && done.hidden) closeSheet();
  }
  function bump() { const c = $("#bagCount"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }

  $("#bagList").addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    const id = t.dataset.binc || t.dataset.bdec;
    setQty(id, (bag[id] || 0) + (t.dataset.binc ? 1 : -1));
  });

  /* ---------- Sheet ---------- */
  const sheet = $("#sheet");
  const form = $("#orderForm");
  const done = $("#done");
  let lastFocus = null;

  function buildSlots() {
    const { slots, label } = pickupPlan();
    $("#slotDay").textContent = "· " + label;
    $("#slots").innerHTML = slots.map((m, i) =>
      `<label class="slot"><input type="radio" name="slot" value="${hhmm(m)}" ${i === 0 ? "" : ""}><span>${hhmm(m)}</span></label>`).join("");
    return label;
  }

  function openSheet() {
    $("#toast").classList.remove("show");
    lastFocus = document.activeElement;
    form.hidden = false; done.hidden = true;
    buildSlots();
    sheet.hidden = false;
    document.body.classList.add("lock");
    $(".sheet__panel").focus();
  }
  function closeSheet() {
    sheet.hidden = true;
    document.body.classList.remove("lock");
    lastFocus?.focus?.();
  }
  $("#openBag").addEventListener("click", openSheet);
  sheet.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeSheet(); });
  document.addEventListener("keydown", (e) => {
    if (sheet.hidden) return;
    if (e.key === "Escape") closeSheet();
    if (e.key === "Tab") {
      const f = [...sheet.querySelectorAll("button, input, [href]")].filter((x) => !x.disabled && x.offsetParent);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const slot = form.querySelector("input[name=slot]:checked");
    const name = $("#name");
    $("#slotErr").hidden = !!slot;
    const nameOk = name.value.trim().length > 0;
    $("#nameErr").hidden = nameOk;
    name.setAttribute("aria-invalid", nameOk ? "false" : "true");
    if (!slot) { $("#slots").scrollIntoView({ block: "center", behavior: "smooth" }); return; }
    if (!nameOk) { name.focus(); return; }

    // Reserve: take stock off the board
    for (const [id, q] of Object.entries(bag)) {
      const b = BAKES.find((x) => x.id === id); b.left -= q;
    }
    const code = "CC-" + String(Math.floor(100 + Math.random() * 900));
    $("#doneName").textContent = name.value.trim().split(" ")[0];
    $("#doneCode").textContent = code;
    $("#doneWhen").textContent = `Pickup ${$("#slotDay").textContent.replace("· ", "")} at ${slot.value} · pay ${$("#sheetTotal").textContent} at the counter`;
    bag = {}; store.set("crumb.bag", bag);
    form.hidden = true; done.hidden = false;
    form.reset();
    render(); renderBag();
    done.querySelector("button").focus();
  });
  $("#slots").addEventListener("change", () => { $("#slotErr").hidden = true; });
  $("#name").addEventListener("input", (e) => { if (e.target.value.trim()) { $("#nameErr").hidden = true; e.target.setAttribute("aria-invalid", "false"); } });

  /* ---------- Toast ---------- */
  let tt;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 1600);
  }

  render();
  renderBag();
})();
