/* Crumb & Co. Designed using Design Lounge (https://www.designlounge.live) */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var live = $("#live");
  function say(t) { live.textContent = ""; setTimeout(function () { live.textContent = t; }, 30); }

  /* Today's bakes. Stand-in list: replace with the bakery's own each morning. */
  var BATCHES = {
    morning: { name: "Morning tray", out: 7 * 60 },
    midday: { name: "Midday loaves", out: 12 * 60 },
    afternoon: { name: "Afternoon sweets", out: 16 * 60 }
  };
  var BAKES = [
    { id: "nata", batch: "morning", name: "Pastel de nata", note: "Custard tart", price: 1.30, left: 23 },
    { id: "deus", batch: "morning", name: "Pão de Deus", note: "Coconut sweet bun", price: 1.60, left: 9 },
    { id: "croissant", batch: "morning", name: "Croissant de manteiga", note: "All butter", price: 1.90, left: 14 },
    { id: "arroz", batch: "morning", name: "Bolo de arroz", note: "Rice flour cake", price: 1.40, left: 0 },
    { id: "broa", batch: "midday", name: "Broa de milho", note: "Corn bread, 600 g", price: 3.20, left: 6 },
    { id: "sourdough", batch: "midday", name: "Country sourdough", note: "Two-day ferment, 900 g", price: 4.80, left: 11 },
    { id: "alentejano", batch: "midday", name: "Pão alentejano", note: "Dense white loaf, 750 g", price: 3.90, left: 4 },
    { id: "berlim", batch: "afternoon", name: "Bola de Berlim", note: "Filled with egg cream", price: 1.80, left: 18 },
    { id: "queijada", batch: "afternoon", name: "Queijada", note: "Small cheese tart", price: 1.70, left: 12 },
    { id: "laranja", batch: "afternoon", name: "Torta de laranja", note: "Orange roll, one slice", price: 2.40, left: 7 }
  ];
  /* Day index: 0 Sunday. Minutes from midnight, Lisbon time. */
  var HOURS = { 0: [450, 840], 1: null, 2: [420, 1140], 3: [420, 1140], 4: [420, 1140], 5: [420, 1140], 6: [450, 1140] };
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var byId = {};
  BAKES.forEach(function (b) { byId[b.id] = b; });
  var basket = {};
  var slipOrder = [];
  var reserved = false;

  function euro(n) { return "€" + n.toFixed(2); }
  function hhmm(m) { return Math.floor(m / 60) + ":" + String(m % 60).padStart(2, "0"); }

  /* Lisbon clock */
  function lisbonNow() {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Lisbon", weekday: "short", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", hour12: false
      }).formatToParts(new Date());
      var o = {};
      parts.forEach(function (p) { o[p.type] = p.value; });
      var wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(o.weekday);
      return { day: wd, date: +o.day, month: +o.month - 1, year: +o.year, min: (+o.hour % 24) * 60 + +o.minute };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), date: d.getDate(), month: d.getMonth(), year: d.getFullYear(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var now = lisbonNow();

  /* Date on the letter, status, hours row */
  (function () {
    var t = $("[data-today]");
    t.textContent = DAYS[now.day] + " " + now.date + " " + MONTHS[now.month];
    t.setAttribute("datetime", now.year + "-" + String(now.month + 1).padStart(2, "0") + "-" + String(now.date).padStart(2, "0"));
    var h = HOURS[now.day];
    var status = $("[data-status]"), st = $("[data-status-text]");
    var foot = $("[data-hours-line]");
    if (h && now.min >= h[0] && now.min < h[1]) {
      status.classList.add("open");
      st.textContent = "Open until " + hhmm(h[1]);
      foot.textContent = "Rua de São Bento 182, Lisbon. Open today until " + hhmm(h[1]) + ".";
    } else if (h && now.min < h[0]) {
      st.textContent = "Opens at " + hhmm(h[0]);
      foot.textContent = "Rua de São Bento 182, Lisbon. Doors open at " + hhmm(h[0]) + " today.";
    } else {
      st.textContent = "Closed now";
      foot.textContent = "Rua de São Bento 182, Lisbon. Closed now. Pre-orders go to the next open day.";
    }
    var row = $('.hours tr[data-day="' + now.day + '"]');
    if (row) row.classList.add("today");
  })();

  /* Bake rows */
  var ICON_PLUS = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  var ICON_MINUS = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>';

  Object.keys(BATCHES).forEach(function (k) {
    var ul = $('[data-items="' + k + '"]');
    BAKES.filter(function (b) { return b.batch === k; }).forEach(function (b) {
      var li = document.createElement("li");
      li.className = "item" + (b.left === 0 ? " out" : "");
      li.dataset.id = b.id;
      var meta = b.left === 0
        ? "Sold out today"
        : b.note + ", " + euro(b.price) + ', <span class="num' + (b.left <= 6 ? ' left-low' : '') + '">' + b.left + " left</span>";
      li.innerHTML =
        '<p class="item-name"><span>' + b.name + '</span><span class="item-meta">' + meta + "</span></p>" +
        '<div class="ctl"></div>';
      ul.appendChild(li);
      renderCtl(b.id);
    });
    var items = BAKES.filter(function (b) { return b.batch === k; });
    var left = items.reduce(function (s, b) { return s + b.left; }, 0);
    var out = items.filter(function (b) { return b.left === 0; }).length;
    $('[data-readout="' + k + '"]').innerHTML =
      '<div><span class="k">Bakes</span><span class="v num">' + items.length + "</span></div>" +
      '<div><span class="k">On the shelf</span><span class="v num">' + left + "</span></div>" +
      '<div><span class="k">Sold out</span><span class="v num' + (out ? " out" : "") + '">' + out + "</span></div>";
    var line = $('[data-batch-line="' + k + '"]');
    if (line) {
      var top = items.filter(function (b) { return b.left > 0; }).sort(function (a, b) { return b.left - a.left; })[0];
      line.textContent = left + " on the shelf right now" + (top ? ", most of them " + top.name.toLowerCase() + "." : ".");
    }
  });

  function renderCtl(id) {
    var b = byId[id];
    var li = $('.item[data-id="' + id + '"]');
    var ctl = $(".ctl", li);
    var q = basket[id] || 0;
    if (b.left === 0) {
      ctl.innerHTML = '<button class="add" type="button" disabled aria-label="' + b.name + ', sold out">Gone</button>';
      return;
    }
    if (!q) {
      ctl.innerHTML = '<button class="add" type="button" data-add="' + id + '" aria-label="Add ' + b.name + ' to your slip">' + ICON_PLUS + "Add</button>";
      return;
    }
    ctl.innerHTML =
      '<div class="step has" role="group" aria-label="' + b.name + ' quantity">' +
      '<button type="button" data-dec="' + id + '" aria-label="One less ' + b.name + '">' + ICON_MINUS + "</button>" +
      '<output class="num" aria-live="polite">' + q + "</output>" +
      '<button type="button" data-inc="' + id + '" aria-label="One more ' + b.name + '"' + (q >= b.left ? " disabled" : "") + ">" + ICON_PLUS + "</button></div>";
  }

  function setQty(id, q, focusSel) {
    if (reserved) resetReserved();
    var b = byId[id];
    q = Math.max(0, Math.min(b.left, q));
    var had = basket[id] || 0;
    if (q) basket[id] = q; else delete basket[id];
    if (q && slipOrder.indexOf(id) < 0) slipOrder.push(id);
    if (!q) slipOrder = slipOrder.filter(function (x) { return x !== id; });
    renderCtl(id);
    var f = focusSel && $(focusSel);
    if (f && !f.disabled) f.focus();
    else if (focusSel) { var any = $('.item[data-id="' + id + '"] .ctl button:not(:disabled)'); if (any) any.focus(); }
    renderSlip(id, had === 0 && q > 0);
    say(q > had ? b.name + " added. " + q + " on your slip." : q ? "One less " + b.name + ". " + q + " on your slip." : b.name + " taken off your slip.");
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-add],[data-inc],[data-dec]");
    if (!t) return;
    var id = t.dataset.add || t.dataset.inc || t.dataset.dec;
    var q = basket[id] || 0;
    if (t.dataset.add) setQty(id, 1, '[data-inc="' + id + '"]');
    else if (t.dataset.inc) setQty(id, q + 1, '[data-inc="' + id + '"]');
    else setQty(id, q - 1, q - 1 > 0 ? '[data-dec="' + id + '"]' : '[data-add="' + id + '"]');
  });

  /* The slip */
  var lines = $("#slip-lines"), empty = $("#slip-empty");
  function renderSlip(fresh, isNew) {
    var total = 0, count = 0;
    lines.innerHTML = "";
    slipOrder.forEach(function (id) {
      var b = byId[id], q = basket[id];
      total += q * b.price; count += q;
      var li = document.createElement("li");
      if (id === fresh && isNew && !reduce) li.className = "write";
      li.innerHTML = '<span class="q num">' + q + "×</span><span>" + b.name + '</span><span class="num">' + euro(q * b.price) + "</span>";
      lines.appendChild(li);
    });
    empty.hidden = count > 0;
    $("[data-total]").textContent = euro(total);
    $$("[data-count]").forEach(function (c) {
      c.textContent = count;
      c.classList.toggle("zero", count === 0);
    });
    $(".top-r .count").setAttribute("aria-label", count + (count === 1 ? " item" : " items") + " on your slip");
    buildSlots();
  }

  /* Pickup slots */
  var slotsEl = $("#slots"), chosen = null;
  function buildSlots() {
    var earliestBatch = 0;
    slipOrder.forEach(function (id) { earliestBatch = Math.max(earliestBatch, BATCHES[byId[id].batch].out); });
    var day = now.day, label = "today", startNow = now.min + 30;
    var h = HOURS[day];
    function lastOK(h, from) { return h && Math.max(from, h[0], earliestBatch) <= h[1] - 30; }
    if (!lastOK(h, startNow)) {
      for (var i = 1; i <= 7; i++) {
        var d = (now.day + i) % 7;
        if (HOURS[d]) { day = d; break; }
      }
      h = HOURS[day];
      startNow = 0;
      label = day === (now.day + 1) % 7 ? "tomorrow" : "on " + DAYS[day];
    }
    var start = Math.max(startNow, h[0], earliestBatch);
    start = Math.ceil(start / 30) * 30;
    var keep = chosen;
    slotsEl.innerHTML = "";
    var first = null, found = false;
    for (var m = start; m <= h[1] - 30; m += 30) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "chip num"; b.setAttribute("role", "radio");
      b.dataset.min = m; b.textContent = hhmm(m);
      var on = keep && keep.day === day && keep.min === m;
      if (on) found = true;
      b.setAttribute("aria-checked", on ? "true" : "false");
      b.tabIndex = -1;
      slotsEl.appendChild(b);
      if (!first) first = b;
    }
    if (!found) chosen = null;
    var tab = $('.chip[aria-checked="true"]', slotsEl) || first;
    if (tab) tab.tabIndex = 0;
    slotsEl.dataset.day = day;
    $("[data-slot-day]").textContent = label;
    updateStub();
  }
  function pick(btn, focus) {
    $$(".chip", slotsEl).forEach(function (c) { c.setAttribute("aria-checked", "false"); c.tabIndex = -1; });
    btn.setAttribute("aria-checked", "true"); btn.tabIndex = 0;
    if (focus) btn.focus();
    chosen = { day: +slotsEl.dataset.day, min: +btn.dataset.min };
    if (reserved) resetReserved();
    updateStub();
  }
  slotsEl.addEventListener("click", function (e) { var b = e.target.closest(".chip"); if (b) pick(b); });
  slotsEl.addEventListener("keydown", function (e) {
    var all = $$(".chip", slotsEl), i = all.indexOf(document.activeElement);
    if (i < 0) return;
    var n = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (n) { e.preventDefault(); pick(all[(i + n + all.length) % all.length], true); }
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); pick(all[i], true); }
  });

  var nameIn = $("#f-name");
  function updateStub() {
    var n = nameIn.value.trim();
    $("[data-stub-name]").textContent = n || "Your name";
    var d = chosen ? (chosen.day === now.day ? "Today " : DAYS[chosen.day] + " ") + hhmm(chosen.min) : "Pick a time";
    $("[data-stub-time]").textContent = d;
  }
  nameIn.addEventListener("input", function () { nameIn.removeAttribute("aria-invalid"); updateStub(); if (reserved) resetReserved(); });

  /* Reserve */
  var form = $("#form"), msg = $("#form-msg"), slip = $("#slip");
  function resetReserved() {
    reserved = false;
    slip.classList.remove("done");
    $("[data-slip-no]").textContent = "Not reserved yet";
    $("#reserve").textContent = "Reserve for pickup";
    msg.textContent = ""; msg.className = "form-msg";
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    msg.className = "form-msg";
    if (!slipOrder.length) {
      msg.classList.add("err"); msg.textContent = "Your slip is empty. Add a bake from the trays first.";
      $("#bakes").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      return;
    }
    if (!nameIn.value.trim()) {
      nameIn.setAttribute("aria-invalid", "true");
      msg.classList.add("err"); msg.textContent = "Write the name we should put on the bag.";
      nameIn.focus(); return;
    }
    if (!chosen) {
      msg.classList.add("err"); msg.textContent = "Pick a pickup time.";
      var c = $(".chip", slotsEl); if (c) c.focus(); return;
    }
    reserved = true;
    var code = "CR-" + String((Date.now() / 1000 | 0) % 9000 + 1000);
    $("[data-slip-no]").textContent = "Kept for you, " + code;
    slip.classList.add("done");
    $("#reserve").textContent = "Reserved";
    msg.classList.add("ok");
    msg.textContent = "Reserved. Your bag will be on the shelf, " + $("[data-stub-time]").textContent.toLowerCase() + ". Say " + code + " or your name at the counter.";
  });

  /* Notes in the margin: one open at a time */
  var notes = $$(".note");
  notes.forEach(function (n) {
    n.addEventListener("click", function () {
      var open = n.getAttribute("aria-pressed") !== "true";
      notes.forEach(function (o) {
        o.setAttribute("aria-pressed", "false");
        $(".note-more", o).hidden = true;
      });
      if (open) { n.setAttribute("aria-pressed", "true"); $(".note-more", n).hidden = false; }
    });
    n.addEventListener("dblclick", function () { $("#" + n.dataset.batch).scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); });
  });

  /* Hand-drawn marks on the letter (text-annotated-underlines) */
  var letter = $("#letter"), ink = $(".ink", letter);
  var seed = 7;
  function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  function j(a) { return (rnd() - .5) * 2 * a; }
  function boxOf(el) {
    var r = document.createRange(); r.selectNodeContents(el);
    var rr = r.getBoundingClientRect(), lr = letter.getBoundingClientRect();
    return { x: rr.left - lr.left, y: rr.top - lr.top, w: rr.width, h: rr.height };
  }
  function drawPath(d, w, dur, delay) {
    var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", d); p.setAttribute("stroke-width", w);
    ink.appendChild(p);
    if (reduce) return;
    var L = p.getTotalLength() + 2;
    p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
    p.getBoundingClientRect();
    p.style.transition = "stroke-dashoffset " + dur + "ms cubic-bezier(.65,0,.35,1) " + delay + "ms";
    requestAnimationFrame(function () { p.style.strokeDashoffset = 0; });
  }
  function marks(animate) {
    ink.innerHTML = ""; seed = 7;
    var keep = reduce; if (!animate) reduce = true;
    $$(".an", letter).forEach(function (el, i) {
      var b = boxOf(el), delay = 250 + i * 380;
      if (el.dataset.k === "underline") {
        var y = b.y + b.h - 3;
        drawPath("M" + (b.x - 2) + " " + (y + j(1)) + " Q " + (b.x + b.w / 2) + " " + (y + 2 + j(1.5)) + " " + (b.x + b.w + 3) + " " + (y + j(1)), 2.2, 620, delay);
        drawPath("M" + (b.x + 6) + " " + (y + 5 + j(1)) + " Q " + (b.x + b.w / 2) + " " + (y + 7 + j(1.5)) + " " + (b.x + b.w - 4) + " " + (y + 4 + j(1)), 1.6, 180, delay + 620);
      } else {
        var cx = b.x + b.w / 2, cy = b.y + b.h / 2 + 1, rx = b.w / 2 + 10, ry = b.h / 2 + 4, d = "";
        for (var a = 0; a <= 6.9; a += .3) {
          var k = 1 + j(.03) + a * .006;
          d += (a ? " L " : "M ") + (cx + Math.cos(a - 2.4) * rx * k).toFixed(1) + " " + (cy + Math.sin(a - 2.4) * ry * k).toFixed(1);
        }
        drawPath(d, 1.8, 820, delay);
      }
    });
    reduce = keep;
  }
  function startMarks() {
    if (!("IntersectionObserver" in window)) { marks(true); return; }
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { marks(true); io.disconnect(); }
    }, { threshold: .4 });
    io.observe(letter);
  }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
    startMarks();
    var drawn = false, rt;
    if ("ResizeObserver" in window) {
      new ResizeObserver(function () {
        if (!drawn) { drawn = true; return; }
        clearTimeout(rt); rt = setTimeout(function () { if (ink.childNodes.length) marks(false); }, 80);
      }).observe(letter);
    }
  });

  /* Tray reveal */
  var trays = $$(".tray");
  if (reduce || !("IntersectionObserver" in window)) trays.forEach(function (t) { t.classList.add("in"); });
  else {
    var tio = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); tio.unobserve(x.target); } });
    }, { threshold: .25, rootMargin: "0px 0px -40px 0px" });
    trays.forEach(function (t) { tio.observe(t); });
  }

  /* Header fill, current section, phone bar hide */
  var top = $("#top"), bar = $("#bar"), lastY = window.scrollY;
  var sections = ["today", "bakes", "order", "visit"].map(function (id) { return document.getElementById(id); });
  function setCurrent(id) {
    $$("[data-nav]").forEach(function (a) {
      if (a.dataset.nav === id) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }
  function onScroll() {
    var y = window.scrollY;
    top.classList.toggle("solid", y > 80);
    var cur = "today";
    sections.forEach(function (s) { if (s.getBoundingClientRect().top < window.innerHeight * .4) cur = s.id; });
    setCurrent(cur);
    if (!reduce) {
      var atEnd = window.innerHeight + y >= document.documentElement.scrollHeight - 4;
      if (y - lastY > 6 && y > 80 && !atEnd) bar.classList.add("hide");
      else if (lastY - y > 6 || atEnd || y < 80) bar.classList.remove("hide");
    }
    lastY = y;
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { onScroll(); ticking = false; }); }
  }, { passive: true });
  bar.addEventListener("focusin", function () { bar.classList.remove("hide"); });
  onScroll();

  /* Footer accordions under 640px */
  var mq = window.matchMedia("(max-width: 640px)");
  var cols = $$(".foot-col");
  function setupFoot() {
    cols.forEach(function (c) {
      var btn = $("h2 button", c), panel = $(".panel", c);
      if (mq.matches) {
        btn.tabIndex = 0;
        var open = c.classList.contains("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) panel.removeAttribute("inert"); else panel.setAttribute("inert", "");
      } else {
        btn.tabIndex = -1; btn.removeAttribute("aria-expanded"); panel.removeAttribute("inert");
      }
    });
  }
  cols.forEach(function (c) {
    $("h2 button", c).addEventListener("click", function () {
      if (!mq.matches) return;
      c.classList.toggle("open"); setupFoot();
    });
  });
  if (mq.addEventListener) mq.addEventListener("change", setupFoot);
  setupFoot();

  renderSlip();
})();
