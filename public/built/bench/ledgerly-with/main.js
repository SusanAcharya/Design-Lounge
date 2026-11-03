(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Header: hide on scroll, scrollspy, menu ---------- */
  var top = $("#top");
  var menuBtn = $(".menu-btn");
  var panel = $("#panel");
  var lastY = window.scrollY;
  var menuOpen = false;

  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    var d = y - lastY;
    if (Math.abs(d) < 8) return;
    var focusInside = top.contains(document.activeElement);
    if (d > 0 && y > 64 && !menuOpen && !focusInside) top.classList.add("hide");
    else if (d < 0) top.classList.remove("hide");
    if (y <= 0) top.classList.remove("hide");
    lastY = y;
  }, { passive: true });
  top.addEventListener("focusin", function () { top.classList.remove("hide"); });

  function setMenu(open) {
    menuOpen = open;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    panel.hidden = !open;
  }
  menuBtn.addEventListener("click", function () { setMenu(!menuOpen); });
  panel.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menuOpen) { setMenu(false); menuBtn.focus(); }
  });

  var spyLinks = $$("[data-spy]");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        spyLinks.forEach(function (a) {
          if (a.dataset.spy === en.target.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    ["draft", "controls", "questions"].forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
  }

  /* ---------- Invoice builder ---------- */
  var gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
  var dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  var live = $("#live");
  var sheet = $("#sheet");
  var sendBtn = $("#send");
  var logList = $("#log");
  var items = $("#items");
  var lines = [
    { d: "Year-end accounts, FY2025-26", q: "1", r: "1850.00" },
    { d: "Corporation tax return", q: "1", r: "640.00" },
    { d: "Payroll, monthly runs", q: "12", r: "45.00" },
    { d: "Bookkeeping review, hours", q: "3.5", r: "95.00" }
  ];
  var state = { client: "Halden Joinery Ltd", email: "accounts@halden.example", days: 30, unit: "pct", sent: false };
  var lastTotal = null;

  function num(v) { var n = parseFloat(String(v).replace(/[^0-9.\-]/g, "")); return isFinite(n) ? n : 0; }
  function now() {
    var d = new Date();
    var h = d.getHours(), m = d.getMinutes();
    var ap = h >= 12 ? "pm" : "am";
    h = h % 12 || 12;
    return h + ":" + (m < 10 ? "0" : "") + m + " " + ap;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function log(text) {
    var li = document.createElement("li");
    if (!reduce) li.className = "new";
    li.innerHTML = "<time>" + now() + "</time><b>AR</b><span></span>";
    li.querySelector("span").textContent = text;
    logList.insertBefore(li, logList.firstChild);
    $("#saved span").textContent = "Saved " + now();
  }

  function rowEl(l, i, isNew) {
    var n = i + 1;
    var row = document.createElement("div");
    row.className = "item" + (isNew && !reduce ? " new" : "");
    row.innerHTML =
      '<input class="desc" type="text" aria-label="Description, line ' + n + '" value="' + esc(l.d) + '">' +
      '<input class="qty" type="text" inputmode="decimal" aria-label="Quantity, line ' + n + '" value="' + esc(l.q) + '">' +
      '<input class="rate" type="text" inputmode="decimal" aria-label="Rate in pounds, line ' + n + '" value="' + esc(l.r) + '">' +
      '<output aria-label="Amount, line ' + n + '"></output>' +
      '<button class="rm" type="button" aria-label="Remove line ' + n + '"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
    return row;
  }
  function renderItems() {
    items.innerHTML = "";
    lines.forEach(function (l, i) { items.appendChild(rowEl(l, i, false)); });
  }
  function rowIndex(el) { return $$(".item", items).indexOf(el.closest(".item")); }
  function fieldOf(el) { return el.classList.contains("desc") ? "description" : el.classList.contains("qty") ? "quantity" : "rate"; }

  items.addEventListener("input", function (e) {
    var i = rowIndex(e.target);
    if (i < 0) return;
    var f = fieldOf(e.target);
    lines[i][f === "description" ? "d" : f === "quantity" ? "q" : "r"] = e.target.value;
    update();
  });
  items.addEventListener("change", function (e) {
    var i = rowIndex(e.target);
    var f = fieldOf(e.target);
    var val = f === "rate" ? gbp.format(num(e.target.value)) : e.target.value;
    log("Changed line " + (i + 1) + " " + f + " to " + val);
  });
  items.addEventListener("click", function (e) {
    var b = e.target.closest(".rm");
    if (!b) return;
    var i = rowIndex(b);
    var gone = lines.splice(i, 1)[0];
    renderItems();
    update();
    log("Removed line " + (i + 1) + ", " + (gone.d || "Untitled line"));
    live.textContent = "Removed line " + (i + 1) + ". Total due " + $("#pTotal").textContent + ".";
    var next = $$(".item .desc", items)[Math.min(i, lines.length - 1)];
    (next || $("#addLine")).focus();
  });
  $("#addLine").addEventListener("click", function () {
    lines.push({ d: "", q: "1", r: "" });
    var row = rowEl(lines[lines.length - 1], lines.length - 1, true);
    items.appendChild(row);
    update();
    $(".desc", row).focus();
    log("Added line " + lines.length);
  });

  function update() {
    var sub = 0;
    var body = "";
    $$(".item", items).forEach(function (row, i) {
      var l = lines[i];
      var amt = Math.round(num(l.q) * num(l.r) * 100) / 100;
      sub += amt;
      $("output", row).textContent = gbp.format(amt);
      if (l.d.trim() || num(l.r)) {
        body += "<tr><td>" + esc(l.d.trim() || "Untitled line") + '</td><td class="r">' + esc(num(l.q)) + '</td><td class="r">' + gbp.format(num(l.r)) + '</td><td class="r">' + gbp.format(amt) + "</td></tr>";
      }
    });
    $("#pLines").innerHTML = body;

    var dv = Math.max(0, num($("#disc").value));
    var disc = state.unit === "pct" ? sub * Math.min(dv, 100) / 100 : dv;
    disc = Math.min(Math.round(disc * 100) / 100, sub);
    var vatRate = Math.max(0, num($("#vat").value));
    var vat = Math.round((sub - disc) * vatRate) / 100;
    var total = sub - disc + vat;

    $("#pSub").textContent = gbp.format(sub);
    $("#pDiscRow").hidden = disc <= 0;
    $("#pDiscLbl").textContent = state.unit === "pct" ? "Discount " + dv + "%" : "Discount";
    $("#pDisc").textContent = "−" + gbp.format(disc);
    $("#pVatLbl").textContent = "VAT " + vatRate + "%";
    $("#pVat").textContent = gbp.format(vat);
    $("#pTotal").textContent = gbp.format(total);

    var iss = $("#issued").value ? new Date($("#issued").value + "T00:00:00Z") : new Date();
    var due = new Date(iss.getTime() + state.days * 86400000);
    $("#pIssued").textContent = dateFmt.format(iss);
    $("#pDue").textContent = dateFmt.format(due);
    $("#pBill").textContent = state.client;
    $("#pEmail").textContent = state.email;
    $("#pNote").textContent = $("#note").value;

    if (lastTotal !== null && total !== lastTotal) {
      if (!reduce) { sheet.classList.remove("flash"); void sheet.offsetWidth; sheet.classList.add("flash"); }
      clearTimeout(update.t);
      update.t = setTimeout(function () { live.textContent = "Total due " + gbp.format(total) + "."; }, 600);
      if (state.sent) toDraft();
    }
    lastTotal = total;
  }

  function toDraft() {
    state.sent = false;
    sheet.classList.remove("sent");
    sendBtn.removeAttribute("data-state");
    $("span", sendBtn).textContent = "Send to client";
    log("Edited after sending, back to draft");
  }

  ["#disc", "#vat", "#issued", "#note"].forEach(function (s) { $(s).addEventListener("input", update); });
  $("#disc").addEventListener("change", function () { log("Set discount to " + $("#disc").value + (state.unit === "pct" ? "%" : " pounds")); });
  $("#vat").addEventListener("change", function () { log("Set VAT to " + $("#vat").value + "%"); });
  $("#issued").addEventListener("change", function () { log("Set issue date to " + $("#pIssued").textContent); });
  $("#note").addEventListener("change", function () { log("Edited the note to client"); });

  $$(".seg").forEach(function (g) {
    g.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      $$("button", g).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      if (b.dataset.days) { state.days = +b.dataset.days; update(); log("Set terms to " + b.textContent + ", due " + $("#pDue").textContent); }
      if (b.dataset.unit) { state.unit = b.dataset.unit; update(); log("Discount unit set to " + (state.unit === "pct" ? "percent" : "pounds")); }
    });
  });

  /* Client picker: listbox */
  var pickBtn = $("#pickBtn");
  var lb = $("#clients");
  var opts = $$("[role=option]", lb);
  function openLb() {
    lb.hidden = false;
    pickBtn.setAttribute("aria-expanded", "true");
    var sel = opts.filter(function (o) { return o.getAttribute("aria-selected") === "true"; })[0] || opts[0];
    sel.focus();
  }
  function closeLb(focusBtn) {
    lb.hidden = true;
    pickBtn.setAttribute("aria-expanded", "false");
    if (focusBtn) pickBtn.focus();
  }
  function choose(o) {
    opts.forEach(function (x) { x.setAttribute("aria-selected", String(x === o)); });
    var changed = state.client !== o.textContent;
    state.client = o.textContent;
    state.email = o.dataset.email;
    $("#pickName").textContent = o.textContent;
    $("#pickInit").textContent = o.dataset.init;
    pickBtn.setAttribute("aria-label", "Client: " + o.textContent);
    closeLb(true);
    if (changed) {
      update();
      if (state.sent) toDraft();
      log("Bill to changed to " + o.textContent);
    }
  }
  pickBtn.addEventListener("click", function () { if (lb.hidden) openLb(); else closeLb(true); });
  pickBtn.addEventListener("keydown", function (e) { if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); openLb(); } });
  lb.addEventListener("click", function (e) { var o = e.target.closest("[role=option]"); if (o) choose(o); });
  lb.addEventListener("keydown", function (e) {
    var i = opts.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); opts[(i + 1) % opts.length].focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); opts[(i - 1 + opts.length) % opts.length].focus(); }
    else if (e.key === "Home") { e.preventDefault(); opts[0].focus(); }
    else if (e.key === "End") { e.preventDefault(); opts[opts.length - 1].focus(); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(opts[i]); }
    else if (e.key === "Escape" || e.key === "Tab") { closeLb(e.key === "Escape"); }
  });
  document.addEventListener("click", function (e) { if (!lb.hidden && !e.target.closest(".picker")) closeLb(false); });

  /* Send */
  sendBtn.addEventListener("click", function () {
    if (state.sent) return;
    state.sent = true;
    var d = new Date();
    var mon = d.toLocaleString("en-GB", { month: "short" }).toUpperCase();
    $("#stampTime").textContent = d.getDate() + " " + mon + ", " + now().toUpperCase();
    sheet.classList.add("sent");
    sendBtn.setAttribute("data-state", "sent");
    $("span", sendBtn).textContent = "Sent at " + now();
    log("Sent RB-2026-041 to " + state.email);
    live.textContent = "Invoice RB-2026-041 sent to " + state.email + ".";
  });

  renderItems();
  update();

  /* ---------- Controls: tabbed preview ---------- */
  var section = $("#controls");
  var tabs = $$("[role=tab]", section);
  var pauseBtn = $("#pause");
  var small = window.matchMedia("(max-width: 639px)");
  var paused = false;

  function setPaused(p) {
    paused = p;
    section.classList.toggle("paused", p);
    pauseBtn.setAttribute("aria-pressed", String(p));
    pauseBtn.setAttribute("aria-label", p ? "Resume autoplay" : "Pause autoplay");
  }
  if (reduce) setPaused(true);

  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      var bar = $(".bar i", t);
      if (on) { bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = ""; }
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t) {
    t.addEventListener("click", function () { select(t, false); });
    $(".bar i", t).addEventListener("animationend", function () {
      if (paused || small.matches) return;
      var i = tabs.indexOf(t);
      select(tabs[(i + 1) % tabs.length], false);
    });
  });
  $("#tabs").addEventListener("keydown", function (e) {
    var i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    var n = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (i + 1) % tabs.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = tabs.length - 1;
    if (n !== null) { e.preventDefault(); select(tabs[n], true); }
  });
  pauseBtn.addEventListener("click", function () { setPaused(!paused); });

  $$("[data-tab]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      select(document.getElementById(a.dataset.tab), false);
      section.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });
  });
})();
