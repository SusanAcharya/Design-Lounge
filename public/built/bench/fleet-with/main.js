/* Van desk · Designed using Design Lounge (https://www.designlounge.live) */
(function () {
  "use strict";

  // Sample day. Replace with the tracker feed once it is set in Settings.
  var DEPOT = "M470 290";
  var vans = [
    { id: "1", driver: "Priya Nair", done: 14, total: 22, delay: 2, area: "Harbour Road", t: 0.58,
      route: DEPOT + "L470 235L690 235L690 145L820 145L820 60" },
    { id: "2", driver: "Tom Brennan", done: 9, total: 20, delay: 18, area: "Mill Bridge, northbound", t: 0.5,
      route: DEPOT + "L470 345L545 345L548 400L560 470L560 505L700 505", note: "Queue on Mill Bridge since 13:40" },
    { id: "3", driver: "Aisha Okafor", done: 11, total: 21, delay: 26, area: "Kiln Street", t: 0.64, help: true,
      issue: "Van will not start after stop 11", waited: 12,
      route: DEPOT + "L415 290L415 235L290 235L290 145L60 145L60 60" },
    { id: "4", driver: "Marek Duda", done: 17, total: 24, delay: 0, area: "Station Approach", t: 0.72,
      route: DEPOT + "L525 290L525 235L820 235L820 320L960 290" },
    { id: "5", driver: "Lucy Hale", done: 8, total: 18, delay: 11, area: "Abbey Fields", t: 0.46,
      route: DEPOT + "L415 290L415 145L290 145L180 145L180 60" },
    { id: "6", driver: "Sam Reid", done: 12, total: 19, delay: 4, area: "Long Lane", t: 0.62,
      route: DEPOT + "L470 345L290 345L60 345L60 505L200 505" },
    { id: "7", driver: "Joe Mensah", done: 15, total: 23, delay: 9, area: "Quay Court", t: 0.68, help: true,
      issue: "Locked out of Quay Court gate, needs the access code", waited: 4,
      route: DEPOT + "L525 290L525 345L690 345L690 400L820 380L960 320" },
    { id: "8", driver: "Ines Duarte", done: 21, total: 21, delay: 0, area: "Depot bay 2", t: 0, depot: true,
      route: DEPOT },
    { id: "9", driver: "Ravi Patel", done: 10, total: 20, delay: 3, area: "Tannery Row", t: 0.42, stale: 14,
      route: DEPOT + "L290 290L290 235L60 235L60 345" },
    { id: "10", driver: "Hannah Cole", done: 6, total: 19, delay: 23, area: "Marsh Park", t: 0.55,
      route: DEPOT + "L525 290L525 420L690 420L800 470L880 470", note: "Two failed drops at Marsh Park flats" },
    { id: "11", driver: "Dev Malhotra", done: 13, total: 22, delay: 1, area: "North Gate", t: 0.6,
      route: DEPOT + "L525 290L525 145L690 145L690 40" },
    { id: "12", driver: "Grace Liu", done: 16, total: 25, delay: 6, area: "Ropewalk", t: 0.66,
      route: DEPOT + "L415 290L415 345L290 345L290 505L60 560" }
  ];
  var streets = ["Harbour Road", "Kiln Street", "Ropewalk", "Tannery Row", "Abbey Lane", "Quay Court", "Long Lane",
    "Mill Street", "Station Approach", "Marsh Road", "North Gate", "Bell Yard", "Copper Close", "Wend Terrace",
    "Chapel Row", "Granary Walk", "Fletcher Way", "Saddle Street", "Orchard Rise", "Cooper Lane", "Barge Walk",
    "Linden Road", "Weaver Street", "Pound Lane", "Hythe Close"];

  var state = { sel: null, late: 10, updatedAt: Date.now(), pinging: {} };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var svgNS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  var ICON = {
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h4l1 4-2 2a12 12 0 006 6l2-2 4 1v4c0 1-1 2-2 2C9 20 4 15 4 5c0-1 1-2 3-2z"/></svg>',
    message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H8l-4 3z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/></svg>',
    loader: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 109 9"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>'
  };

  function status(v) {
    if (v.help && !v.sorted) return "help";
    if (v.depot || v.done >= v.total) return "depot";
    if (v.delay > state.late) return "late";
    return "ok";
  }
  var WORD = { help: "Needs help", late: "Late", ok: "On time", depot: "At depot" };
  function first(v) { return v.driver.split(" ")[0]; }
  function hhmm(d) { return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); }
  function minsFromNow(m) { return hhmm(new Date(Date.now() + m * 60000)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function announce(msg) { var sr = $("#sr"); sr.textContent = ""; setTimeout(function () { sr.textContent = msg; }, 30); }
  function stopName(v, i) { return streets[(parseInt(v.id, 10) * 7 + i * 3) % streets.length] + " " + (((i * 13 + parseInt(v.id, 10) * 5) % 88) + 2); }
  function delayText(v) { return v.delay > 0 ? "+" + v.delay + " min" : "On time"; }

  /* Header date */
  $("#today").textContent = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  /* Map */
  var routesG = $("#routes"), pinsG = $("#pins");
  vans.forEach(function (v) {
    var p = document.createElementNS(svgNS, "path");
    p.setAttribute("d", v.route);
    p.setAttribute("class", "route");
    routesG.appendChild(p);
    v.path = p;

    var g = document.createElementNS(svgNS, "g");
    g.setAttribute("class", "pin");
    g.setAttribute("role", "button");
    g.setAttribute("tabindex", "0");
    g.innerHTML = '<rect class="hit" x="-38" y="-56" width="76" height="76"/><g class="pin-in"><path class="stem" d="M-5 -9L0 0L5 -9Z"/><rect class="body" x="-21" y="-36" width="42" height="27" rx="2"/><text y="-16">' + v.id + "</text></g>";
    g.addEventListener("click", function () { select(v.id); });
    g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(v.id); } });
    g.addEventListener("mouseenter", function () { v.path.classList.add("on"); });
    g.addEventListener("mouseleave", function () { if (state.sel !== v.id) v.path.classList.remove("on"); });
    pinsG.appendChild(g);
    v.pin = g;
  });

  function place(v, animate) {
    var len = v.path.getTotalLength();
    var pt = v.depot ? { x: 470 + 62, y: 290 + 14 } : v.path.getPointAtLength(len * v.t);
    v.pin.style.transition = animate && !reduce.matches ? "transform 1200ms cubic-bezier(.2,.7,.2,1)" : "none";
    v.pin.style.transform = "translate(" + pt.x.toFixed(1) + "px," + pt.y.toFixed(1) + "px)";
  }

  /* Strip */
  function renderStrip() {
    var strip = $("#strip");
    strip.innerHTML = vans.map(function (v) {
      var s = status(v);
      var short = s === "help" ? "Help" : s === "late" ? "+" + v.delay + " min" : s === "depot" ? "Depot" : (v.stale ? "No ping" : "On time");
      return '<li><button class="plate-btn" type="button" data-id="' + v.id + '" data-s="' + s + '" aria-pressed="' + (state.sel === v.id) + '" aria-label="Van ' + v.id + ", " + esc(v.driver) + ", " + WORD[s] + '"><span class="pn">' + v.id + '</span><span class="ps">' + short + "</span></button></li>";
    }).join("");
  }

  function renderSay() {
    var c = { help: 0, late: 0, ok: 0, depot: 0 };
    vans.forEach(function (v) { c[status(v)]++; });
    var parts = [];
    parts.push(c.help ? "<b>" + c.help + (c.help === 1 ? " needs" : " need") + " help.</b>" : "Nobody needs help.");
    parts.push(c.late + " running late.");
    parts.push(c.ok + " on time.");
    parts.push(c.depot + " back at depot.");
    $("#say").innerHTML = parts.join(" ");
    var nh = $("#navHelp");
    nh.textContent = c.help;
    nh.classList.toggle("hot", c.help > 0);
    return c;
  }

  /* Board */
  function renderBoard(c) {
    ["help", "late", "ok", "depot"].forEach(function (col) {
      var sec = $('.col[data-col="' + col + '"]');
      var list = sec.querySelector(".list");
      var items = vans.filter(function (v) { return status(v) === col; });
      if (col === "help") items.sort(function (a, b) { return b.waited - a.waited; });
      if (col === "late") items.sort(function (a, b) { return b.delay - a.delay; });
      sec.querySelector(".n").textContent = items.length;
      if (!items.length) {
        var msg = {
          help: "<strong>Nobody needs help.</strong>New calls from drivers land here first.",
          late: "<strong>No van is late.</strong>Every run is within " + state.late + " minutes of its sheet.",
          ok: "<strong>No van on time.</strong>Check the late column.",
          depot: "<strong>No van back yet.</strong>Vans show here once their last stop is signed."
        }[col];
        list.innerHTML = '<p class="empty">' + msg + "</p>";
        return;
      }
      list.innerHTML = items.map(function (v) {
        var s = status(v);
        var line1, right;
        if (s === "help") { line1 = esc(v.issue); right = v.waited + " min wait"; }
        else if (s === "depot") { line1 = "All " + v.total + " stops signed"; right = "Done"; }
        else { line1 = "Next: " + esc(stopName(v, v.done)); right = delayText(v); }
        var pct = Math.round(v.done / v.total * 100);
        var stale = v.stale ? " · no ping for " + v.stale + " min" : "";
        return '<button class="card" type="button" data-id="' + v.id + '" data-s="' + s + '" aria-pressed="' + (state.sel === v.id) + '">' +
          '<span class="c-plate" aria-hidden="true">' + v.id + "</span>" +
          '<span class="c-top"><span>' + esc(v.driver) + '<span class="vh">, van ' + v.id + '</span></span><span class="delta' + (s === "help" || s === "late" ? " bad" : "") + '">' + right + "</span></span>" +
          '<span class="c-line">' + line1 + "</span>" +
          '<span class="c-line">' + v.done + " of " + v.total + " stops" + stale + '<span class="bar" aria-hidden="true"><i style="width:' + pct + '%"></i></span></span>' +
          "</button>";
      }).join("");
    });
  }

  /* Detail */
  function renderDetail() {
    var v = vans.find(function (x) { return x.id === state.sel; });
    var box = $("#detail");
    if (!v) { box.innerHTML = '<p class="empty" style="margin:14px">Pick a van on the strip, the map or the board.</p>'; return; }
    var s = status(v);
    var tagCls = { help: "tag-help", late: "tag-late", ok: "tag-ok", depot: "tag-depot" }[s];
    var tagIcon = s === "help" || s === "late" ? ICON.alert : ICON.check;
    var html = '<div class="d-head"><span class="d-plate" data-s="' + s + '" aria-hidden="true">' + v.id + '</span><div>' +
      '<h2 class="vh" id="detailH">Van ' + v.id + "</h2>" +
      '<p class="d-name">' + esc(v.driver) + '</p><p class="d-where">Van ' + v.id + " · " + esc(v.area) + "</p>" +
      '<span class="tag ' + tagCls + '">' + tagIcon + WORD[s] + "</span>" +
      (v.stale ? ' <span class="tag tag-stale">' + ICON.clock + "No ping for " + v.stale + " min</span>" : "") +
      "</div></div>";

    if (s === "help") {
      html += '<div class="d-issue"><strong>' + esc(v.issue) + "</strong><span>Called in " + v.waited + " min ago, at " + minsFromNow(-v.waited) + "</span></div>";
    } else if (v.stale) {
      var fail = state.pinging[v.id] === "fail";
      html += '<div class="d-issue warn"><strong>' + (fail ? "No answer from the tracker." : "Tracker has gone quiet.") + "</strong><span>" +
        (fail ? "Try again, or call " + esc(first(v)) + " to check the van." : "Last position at " + minsFromNow(-v.stale) + ". The plate shows where it was.") + "</span></div>";
    } else if (v.note && s === "late") {
      html += '<div class="d-issue warn"><strong>' + esc(v.note) + "</strong><span>Running " + v.delay + " min behind the sheet</span></div>";
    }

    var left = v.total - v.done;
    var finish = minsFromNow(Math.round(left * 9 + v.delay));
    html += '<dl class="d-stats"><div><dt>Stops</dt><dd class="num">' + v.done + "/" + v.total + "</dd></div>" +
      "<div><dt>Behind sheet</dt><dd class=\"num" + (v.delay > state.late ? " bad" : "") + '">' + (v.delay > 0 ? "+" + v.delay + " min" : "0") + "</dd></div>" +
      "<div><dt>" + (s === "depot" ? "Back at" : "Last stop by") + '</dt><dd class="num">' + (s === "depot" ? minsFromNow(-38) : finish) + "</dd></div></dl>";

    if (s !== "depot") {
      html += '<ol class="stops" aria-label="Stops around now">';
      for (var i = Math.max(0, v.done - 2); i < Math.min(v.total, v.done + 3); i++) {
        var cls = i < v.done ? "done" : i === v.done ? "next" : "";
        var mins = i < v.done ? -(v.done - i) * 9 : (i - v.done + 1) * 9 + v.delay;
        html += '<li class="' + cls + '"><span class="tick" aria-hidden="true"></span><time>' + minsFromNow(mins) + "</time><span>" +
          (i === v.done ? "Next: " : i < v.done ? '<span class="vh">Signed: </span>' : "") + esc(stopName(v, i)) + "</span></li>";
      }
      if (v.done + 3 < v.total) html += '<li><span></span><span class="more">' + (v.total - v.done - 3) + " more stops after these</span></li>";
      html += "</ol>";
    }

    html += '<div class="d-actions">';
    if (s === "help") {
      html += '<button class="btn btn-primary" type="button" data-act="call">' + ICON.phone + "Call " + esc(first(v)) + "</button>";
      html += '<button class="btn" type="button" data-act="sorted">' + ICON.check + "Mark sorted</button>";
    } else if (v.stale) {
      var busy = state.pinging[v.id] === "busy";
      html += '<button class="btn" type="button" data-act="ping"' + (busy ? ' aria-busy="true" disabled' : "") + ">" + ICON.loader + (busy ? "Pinging tracker" : "Ping tracker") + "</button>";
      html += '<button class="btn" type="button" data-act="call">' + ICON.phone + "Call " + esc(first(v)) + "</button>";
    } else {
      html += '<button class="btn" type="button" data-act="call">' + ICON.phone + "Call " + esc(first(v)) + "</button>";
      html += '<button class="btn" type="button" data-act="msg">' + ICON.message + "Message</button>";
    }
    html += "</div>";
    box.innerHTML = html;
  }

  function renderPins() {
    vans.forEach(function (v) {
      var s = status(v);
      v.pin.setAttribute("data-s", s);
      v.pin.classList.toggle("stale", !!v.stale);
      v.pin.classList.toggle("sel", state.sel === v.id);
      v.pin.setAttribute("aria-label", "Van " + v.id + ", " + v.driver + ", " + WORD[s] + ", " + v.area);
      v.pin.setAttribute("aria-pressed", String(state.sel === v.id));
      v.path.classList.toggle("on", state.sel === v.id);
    });
    // selected plate drawn last
    var sel = vans.find(function (x) { return x.id === state.sel; });
    if (sel) pinsG.appendChild(sel.pin);
  }

  var mapSvg = $("#mapSvg");
  function fitView() {
    var box = mapSvg.getBoundingClientRect();
    if (window.innerWidth >= 768 || !box.width) { mapSvg.setAttribute("viewBox", "0 0 1000 600"); return; }
    var W = Math.min(1000, 600 * box.width / box.height);
    var v = vans.find(function (x) { return x.id === state.sel; });
    var cx = 500;
    if (v) { var m = /translate\(([-\d.]+)px/.exec(v.pin.style.transform); if (m) cx = parseFloat(m[1]); }
    var x0 = Math.max(0, Math.min(1000 - W, cx - W / 2));
    mapSvg.setAttribute("viewBox", x0.toFixed(0) + " 0 " + W.toFixed(0) + " 600");
  }
  window.addEventListener("resize", fitView);

  function render() {
    var c = renderSay();
    renderStrip();
    renderBoard(c);
    renderPins();
    renderDetail();
    fitView();
  }

  function select(id, opts) {
    state.sel = id;
    render();
    var v = vans.find(function (x) { return x.id === id; });
    announce("Van " + id + ", " + v.driver + ", " + WORD[status(v)]);
    if (opts && opts.reveal && window.innerWidth < 1024) $("#help").scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth", block: "start" });
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest(".plate-btn, .card");
    if (b) { select(b.getAttribute("data-id"), { reveal: true }); return; }
    var a = e.target.closest("[data-act]");
    if (!a) return;
    var v = vans.find(function (x) { return x.id === state.sel; });
    var act = a.getAttribute("data-act");
    if (act === "call") announce("Calling " + v.driver + " on the van " + v.id + " phone.");
    if (act === "msg") announce("Message to " + v.driver + " opened.");
    if (act === "sorted") {
      v.sorted = true;
      render();
      announce("Van " + v.id + " marked sorted. It moves to " + WORD[status(v)] + ".");
    }
    if (act === "ping") {
      var tries = (v.tries || 0) + 1; v.tries = tries;
      state.pinging[v.id] = "busy"; renderDetail();
      setTimeout(function () {
        if (tries === 1) { state.pinging[v.id] = "fail"; announce("No answer from van " + v.id + " tracker."); }
        else { delete state.pinging[v.id]; v.stale = 0; v.t = Math.min(1, v.t + 0.04); place(v, true); announce("Van " + v.id + " tracker answered. Position updated."); }
        render(); updateFeed();
      }, 900);
    }
  });

  /* Live positions: the sample day advances each van along its route */
  function tick(animate) {
    vans.forEach(function (v) {
      if (v.depot || v.stale || (v.help && !v.sorted)) { place(v, false); return; }
      v.t = Math.min(0.96, v.t + 0.004 + (parseInt(v.id, 10) % 3) * 0.002);
      place(v, animate);
    });
    state.updatedAt = Date.now();
    updateAge();
  }
  function updateAge() {
    var s = Math.round((Date.now() - state.updatedAt) / 1000);
    $("#updated").textContent = s < 5 ? "just now" : s + " s ago";
  }
  function updateFeed() {
    var stale = vans.filter(function (v) { return v.stale; }).length;
    var f = $("#feedState");
    f.classList.toggle("stale", stale > 0);
    f.lastChild.textContent = stale ? "Feed live, " + stale + " van quiet" : "Feed live";
  }
  vans.forEach(function (v) { place(v, false); });
  setInterval(function () { tick(true); }, 30000);
  setInterval(updateAge, 1000);
  $("#refresh").addEventListener("click", function () { tick(true); announce("Positions refreshed."); });

  /* Sidebar rail and drawer */
  var app = $("#app"), toggle = $("#toggle"), menuBtn = $("#menuBtn"), scrim = $("#scrim");
  function setRail(on) {
    app.classList.toggle("rail", on);
    toggle.setAttribute("aria-expanded", String(!on));
    toggle.setAttribute("aria-label", on ? "Expand sidebar" : "Collapse sidebar");
  }
  function setDrawer(on) {
    app.classList.toggle("drawer", on);
    menuBtn.setAttribute("aria-expanded", String(on));
    scrim.hidden = !on;
  }
  toggle.addEventListener("click", function () { setRail(!app.classList.contains("rail")); });
  menuBtn.addEventListener("click", function () { setDrawer(!app.classList.contains("drawer")); });
  scrim.addEventListener("click", function () { setDrawer(false); });
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") { e.preventDefault(); setRail(!app.classList.contains("rail")); }
    if (e.key === "Escape") setDrawer(false);
  });
  document.querySelectorAll(".nav a").forEach(function (a) {
    a.addEventListener("click", function () {
      document.querySelectorAll(".nav a").forEach(function (x) { x.removeAttribute("aria-current"); });
      if (a.id !== "openSettings") a.setAttribute("aria-current", "page");
      if (a.getAttribute("href") === "#help") {
        var h = vans.filter(function (v) { return status(v) === "help"; }).sort(function (x, y) { return y.waited - x.waited; })[0];
        if (h) select(h.id);
      }
      setDrawer(false);
    });
  });
  if (window.innerWidth >= 768 && window.innerWidth < 1280) setRail(true);

  /* Settings */
  var dlg = $("#settings");
  function applyTheme(v) {
    if (v === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", v);
  }
  try {
    var saved = localStorage.getItem("vandesk-theme");
    if (saved) { applyTheme(saved); var r = dlg.querySelector('input[value="' + saved + '"]'); if (r) r.checked = true; }
    var sl = localStorage.getItem("vandesk-late");
    if (sl) { state.late = parseInt(sl, 10); $("#lateSel").value = sl; }
  } catch (e) { /* storage blocked: defaults stand */ }
  $("#lateHint").textContent = state.late;

  $("#openSettings").addEventListener("click", function (e) {
    e.preventDefault();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  });
  dlg.addEventListener("change", function (e) {
    if (e.target.name === "theme") applyTheme(e.target.value);
  });
  $("#saveSettings").addEventListener("click", function () {
    state.late = parseInt($("#lateSel").value, 10);
    var th = dlg.querySelector('input[name="theme"]:checked').value;
    try { localStorage.setItem("vandesk-theme", th); localStorage.setItem("vandesk-late", String(state.late)); } catch (e) { /* ignore */ }
    $("#lateHint").textContent = state.late;
    render();
    announce("Settings saved. Late now means more than " + state.late + " minutes behind.");
  });

  /* First paint: open the van that has waited longest for help */
  state.sel = "3";
  render();
  updateFeed();
})();
