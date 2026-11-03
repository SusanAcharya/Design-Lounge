/* Van desk · Designed using Design Lounge (https://www.designlounge.live) */
(function () {
  "use strict";

  var NOW_START = 14 * 60 + 12; // 14:12, the sample day's clock
  var DAY_START = 8 * 60 + 30;
  var DAY_END = 17 * 60 + 30;
  var DEPOT = { x: 400, y: 250 };
  var KM_PER_PX = 0.012;

  var STREETS = ["Hollis Street", "Fenwick Road", "Mill Road", "Abbey Court", "Brook Park", "Linden Close",
    "Quarry Lane", "Station Street", "Orchard Row", "Tanner Way", "Kiln Lane", "Weir Road", "Ash Grove", "Market Hill"];

  var ICON = {
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h4l1 4-2 2a12 12 0 006 6l2-2 4 1v4c0 1-1 2-2 2C9 20 4 15 4 5c0-1 1-2 3-2z"/></svg>',
    message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H8l-4 3z"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12l16-8-6 16-2-7z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>',
    loader: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 109 9"/></svg>',
    error: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/></svg>'
  };

  // Sample day. Replace with the dispatch feed.
  var vans = [
    { id: "01", driver: "Amira", cx: 175, cy: 120, total: 34, done: 21, planned: 21, delay: 0, at: "Hollis Street" },
    { id: "02", driver: "Tom", cx: 630, cy: 105, total: 38, done: 22, planned: 25, delay: 18, at: "Fenwick Road" },
    { id: "03", driver: "Leila", cx: 300, cy: 345, total: 30, done: 19, planned: 19, delay: 0, at: "Mill Road" },
    { id: "04", driver: "Sam", cx: 520, cy: 385, total: 36, done: 23, planned: 24, delay: 6, at: "Tanner Way" },
    { id: "05", driver: "Priya", cx: 705, cy: 290, total: 33, done: 17, planned: 19, delay: 12, at: "Brook Park" },
    { id: "06", driver: "Joe", cx: 110, cy: 300, total: 29, done: 20, planned: 20, delay: 0, at: "Orchard Row" },
    { id: "07", driver: "Dawit", cx: 565, cy: 205, total: 31, done: 22, planned: 22, delay: 0, at: "Ring Road east",
      issue: { kind: "tyre", badge: "Flat tyre", since: 13 * 60 + 46 } },
    { id: "08", driver: "Marta", cx: 265, cy: 190, total: 35, done: 25, planned: 24, delay: 0, at: "Station Street" },
    { id: "09", driver: "Kofi", cx: 650, cy: 410, total: 32, done: 18, planned: 19, delay: 14, at: "Quarry Lane",
      issue: { kind: "lost", badge: "No signal", since: 13 * 60 + 48, tries: 0 } },
    { id: "10", driver: "Ines", cx: 430, cy: 90, total: 37, done: 23, planned: 24, delay: 11, at: "Abbey Court" },
    { id: "11", driver: "Grace", cx: 185, cy: 410, total: 28, done: 16, planned: 16, delay: 0, at: "Linden Close",
      issue: { kind: "home", badge: "No one home", since: 14 * 60 + 4 } },
    { id: "12", driver: "Ben", cx: 400, cy: 250, total: 24, done: 24, planned: 24, delay: 0, at: "Depot", back: 13 * 60 + 30 }
  ];

  var state = {
    now: NOW_START, lateAfter: 10, showDone: true, selected: "07", lastUpdate: Date.now()
  };

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function hhmm(m) {
    m = Math.round(m);
    var h = Math.floor(m / 60), mm = m % 60;
    return (h < 10 ? "0" : "") + h + ":" + (mm < 10 ? "0" : "") + mm;
  }
  function rng(seed) {
    var s = seed;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // Build each van's stops: a loop of points around its patch of town.
  vans.forEach(function (v, i) {
    var r = rng(97 + i * 131);
    var pts = [];
    for (var k = 0; k < v.total; k++) {
      var a = (k / v.total) * Math.PI * 2 + r() * 0.12;
      var rad = 0.7 + r() * 0.3;
      pts.push({
        x: clamp(v.cx + Math.cos(a) * 78 * rad, 18, 782),
        y: clamp(v.cy + Math.sin(a) * 58 * rad, 18, 462),
        addr: (3 + Math.floor(r() * 88)) + " " + STREETS[(i * 3 + Math.floor(k / 5)) % STREETS.length]
      });
    }
    v.stops = pts;
    v.avg = (DAY_END - DAY_START) / v.total;
    v.frac = 0.35 + r() * 0.4;
    v.issue && (v.issue.resolved = false);
  });

  function due(v, i) { return NOW_START + (i - v.planned) * v.avg + v.avg * 0.5; }
  function behind(v) { return Math.max(0, v.planned - v.done); }

  function status(v) {
    if (v.issue && !v.issue.resolved) return "help";
    if (v.done >= v.total) return "done";
    if (behind(v) >= 2 || v.delay >= state.lateAfter) return "late";
    return "ok";
  }

  function pos(v) {
    var s = status(v);
    if (s === "done") return { x: DEPOT.x + 34, y: DEPOT.y + 2 };
    var a = v.done === 0 ? DEPOT : v.stops[v.done - 1];
    var b = v.stops[Math.min(v.done, v.total - 1)];
    var f = s === "help" ? 0.5 : v.frac;
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
  }

  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

  function nearestHelper(v) {
    var me = pos(v), best = null, bd = Infinity;
    vans.forEach(function (o) {
      if (o === v || status(o) !== "ok") return;
      var d = dist(me, pos(o));
      if (d < bd) { bd = d; best = o; }
    });
    return best ? { van: best, km: (bd * KM_PER_PX).toFixed(1) } : null;
  }

  /* ---------- the slip strip ---------- */
  function strip(v, s) {
    var done = v.done / v.total * 100, plan = v.planned / v.total * 100;
    var gap = plan > done ? '<span class="gap" style="left:' + done + "%;width:" + (plan - done) + '%"></span>' : "";
    return '<div class="strip" role="img" aria-label="' + v.done + " of " + v.total + " stops done, " +
      (behind(v) ? behind(v) + " behind schedule" : "on schedule") + '">' +
      '<span class="done" style="width:' + done + '%"></span>' + gap +
      (s === "done" ? "" : '<span class="tick" style="left:' + plan + '%"></span>') + "</div>";
  }

  /* ---------- board ---------- */
  function btn(label, act, id, icon, primary) {
    return '<button type="button" class="btn' + (primary ? " primary" : "") + '" data-act="' + act + '" data-van="' + id + '">' +
      (icon ? ICON[icon] : "") + "<span>" + esc(label) + "</span></button>";
  }

  function helpCard(v, first) {
    var is = v.issue, mins = Math.round(state.now - is.since), body = "", acts = "";
    var left = v.total - v.done;
    if (is.kind === "tyre") {
      body = "Stopped on <strong>" + esc(v.at) + "</strong> since " + hhmm(is.since) + ". " + left + " stops still on board.";
      if (is.helper) {
        body += " <strong>Van " + is.helper + "</strong> is on the way, about " + is.eta + " min.";
        acts = btn("Call " + v.driver, "call", v.id, "phone", first) + btn("Mark fixed", "fixed", v.id, "check");
      } else {
        var h = nearestHelper(v);
        acts = btn("Call " + v.driver, "call", v.id, "phone", first) +
          (h ? btn("Send Van " + h.van.id + ", " + h.km + " km", "send", v.id, "send") : "");
      }
    } else if (is.kind === "home") {
      body = "Signature parcel at <strong>" + esc(v.at) + "</strong>. Asked at " + hhmm(is.since) + " whether to leave it with a neighbour.";
      acts = btn("Call " + v.driver, "call", v.id, "phone", first) + btn("Bring it back", "back", v.id, "home");
    } else if (is.kind === "lost") {
      body = '<span class="lost">' + ICON.error + "<span>Tracker silent since " + hhmm(is.since) +
        ". Last seen on <strong>" + esc(v.at) + "</strong>." + (is.tries ? " Retry " + is.tries + " found nothing." : "") + "</span></span>";
      acts = btn("Retry tracker", "retry", v.id, "loader", first) + btn("Call " + v.driver, "call", v.id, "phone");
    }
    return '<article class="card card-help' + (state.selected === v.id ? " sel" : "") + '" data-select="' + v.id + '">' +
      '<div class="row1"><button type="button" class="vid" data-select="' + v.id + '" aria-label="Show Van ' + v.id + ' on the map">Van ' + v.id + "</button>" +
      '<span class="who">' + esc(v.driver) + "</span>" +
      '<span class="since">for <b class="num">' + mins + " min</b></span></div>" +
      '<div><span class="badge b-help">' + esc(is.badge) + "</span></div>" +
      '<p class="what">' + body + "</p>" +
      '<div class="acts">' + acts + "</div></article>";
  }

  function lateCard(v) {
    var firstLate = v.done, b = behind(v);
    var lateLine = b > 0
      ? "Stop " + (firstLate + 1) + ", " + esc(v.stops[firstLate].addr) + ", was due " + hhmm(due(v, firstLate)) + "."
      : "Next stop " + esc(v.stops[firstLate].addr) + ", now due " + hhmm(due(v, firstLate) + v.delay) + ".";
    return '<article class="card card-late' + (state.selected === v.id ? " sel" : "") + '" data-select="' + v.id + '">' +
      '<div class="row1"><button type="button" class="vid" data-select="' + v.id + '" aria-label="Show Van ' + v.id + ' on the map">Van ' + v.id + "</button>" +
      '<span class="who">' + esc(v.driver) + "</span>" +
      '<span class="badge b-late">+' + v.delay + " min</span></div>" +
      '<p class="what">' + lateLine + "</p>" +
      "<div>" + strip(v, "late") +
      '<p class="stripline"><span><b>' + v.done + "</b> of " + v.total + " stops</span><span>" +
      (b ? b + (b === 1 ? " stop" : " stops") + " behind" : "slow stops") + "</span></p></div>" +
      '<div class="acts">' + btn("Message " + v.driver, "msg", v.id, "message") + "</div></article>";
  }

  function mini(v, s) {
    var right = s === "done" ? "Back " + hhmm(v.back) : v.done + "/" + v.total;
    var who = s === "done" ? v.driver + ", all " + v.total + " done" : v.driver + ", " + v.at;
    return '<button type="button" class="mini' + (state.selected === v.id ? " sel" : "") + '" data-select="' + v.id +
      '" aria-label="Van ' + v.id + ", " + esc(who) + '">' +
      '<span class="vid" aria-hidden="true">Van ' + v.id + "</span>" +
      '<span class="who" aria-hidden="true">' + esc(who) + "</span>" +
      '<span class="stops" aria-hidden="true">' + right + "</span>" +
      (s === "done" ? "" : strip(v, s)) + "</button>";
  }

  function renderBoard() {
    var groups = { help: [], late: [], ok: [], done: [] };
    vans.forEach(function (v) { groups[status(v)].push(v); });
    groups.help.sort(function (a, b) { return a.issue.since - b.issue.since; });
    groups.late.sort(function (a, b) { return b.delay - a.delay; });

    $("l-help").innerHTML = groups.help.length
      ? groups.help.map(function (v, i) { return helpCard(v, i === 0); }).join("")
      : '<p class="empty"><strong>No one needs help.</strong>Breakdowns, lost trackers and driver questions land here.</p>';
    $("l-late").innerHTML = groups.late.length
      ? groups.late.map(lateCard).join("")
      : '<p class="empty"><strong>Nothing late.</strong>Every van is within ' + state.lateAfter + " min of its round.</p>";
    $("l-ok").innerHTML = groups.ok.map(function (v) { return mini(v, "ok"); }).join("") ||
      '<p class="empty">No vans on time right now.</p>';
    $("l-done").innerHTML = groups.done.map(function (v) { return mini(v, "done"); }).join("") ||
      '<p class="empty">No van has finished its round yet.</p>';

    ["help", "late", "ok", "done"].forEach(function (k) {
      var n = $("n-" + k); n.textContent = groups[k].length;
      if (groups[k].length) n.removeAttribute("data-zero"); else n.setAttribute("data-zero", "");
    });
    var nh = $("navHelp"); nh.textContent = groups.help.length;
    if (groups.help.length) nh.removeAttribute("data-zero"); else nh.setAttribute("data-zero", "");
    $("board").classList.toggle("no-done", !state.showDone);

    var stopsBehind = groups.late.reduce(function (s, v) { return s + behind(v); }, 0);
    var done = vans.reduce(function (s, v) { return s + v.done; }, 0);
    var total = vans.reduce(function (s, v) { return s + v.total; }, 0);
    var h = groups.help.length, l = groups.late.length;
    $("summary").innerHTML =
      (h ? "<b>" + h + (h === 1 ? " van needs" : " vans need") + " help.</b> " : "<b>No one needs help.</b> ") +
      (l ? l + (l === 1 ? " is" : " are") + " running late, " + stopsBehind + " stops behind between them. " : "Nothing is late. ") +
      groups.ok.length + " on time and " + groups.done.length + " back at the depot. " +
      '<span class="num">' + done.toLocaleString("en-GB") + "</span> of " + total.toLocaleString("en-GB") + " stops delivered.";
    return groups;
  }

  /* ---------- map ---------- */
  var SVGNS = "http://www.w3.org/2000/svg";
  function ground() {
    return '' +
      '<g aria-hidden="true">' +
      '<rect class="block" x="60" y="40" width="70" height="44"/><rect class="block" x="214" y="60" width="96" height="52"/>' +
      '<rect class="block" x="470" y="40" width="86" height="40"/><rect class="block" x="660" y="160" width="90" height="56"/>' +
      '<rect class="block" x="330" y="300" width="60" height="70"/><rect class="block" x="590" y="330" width="70" height="40"/>' +
      '<rect class="block" x="60" y="200" width="80" height="50"/><rect class="block" x="230" y="420" width="90" height="40"/>' +
      '<path class="water" d="M-20 300 C 120 260, 200 250, 300 235 S 470 170, 560 150 S 720 140, 820 70"/>' +
      '<ellipse class="ring-edge" cx="400" cy="250" rx="250" ry="160"/><ellipse class="ring" cx="400" cy="250" rx="250" ry="160"/>' +
      '<path class="road-edge" d="M400 250 L400 -10 M400 250 L810 250 M400 250 L400 490 M400 250 L-10 250 M400 250 L120 30 M400 250 L700 470 M400 250 L700 20 M400 250 L90 470"/>' +
      '<path class="road" d="M400 250 L400 -10 M400 250 L810 250 M400 250 L400 490 M400 250 L-10 250 M400 250 L120 30 M400 250 L700 470 M400 250 L700 20 M400 250 L90 470"/>' +
      '<text class="lbl lbl-w" x="70" y="282">River Wend</text>' +
      '<text class="lbl" x="612" y="132">Ring Road</text>' +
      '<text class="lbl" x="408" y="470">Station Street</text>' +
      '<text class="lbl" x="18" y="240">Mill Road</text>' +
      '<g class="depot"><rect x="386" y="236" width="28" height="28" rx="2"/><text x="420" y="230">DEPOT</text></g>' +
      "</g>";
  }

  function renderMap() {
    var svg = $("map");
    var sel = vans.filter(function (v) { return v.id === state.selected; })[0];
    var route = "";
    if (sel && status(sel) !== "done") {
      var pts = [DEPOT].concat(sel.stops);
      var p = pos(sel);
      var donePath = pts.slice(0, sel.done + 1).map(function (q) { return q.x.toFixed(1) + "," + q.y.toFixed(1); }).join(" ") + " " + p.x.toFixed(1) + "," + p.y.toFixed(1);
      var restPath = [p].concat(sel.stops.slice(sel.done)).map(function (q) { return q.x.toFixed(1) + "," + q.y.toFixed(1); }).join(" ");
      route = '<g aria-hidden="true"><polyline class="route-done" points="' + donePath + '"/><polyline class="route" points="' + restPath + '"/>' +
        sel.stops.map(function (q, i) {
          var c = i < sel.done ? "stop d" : (i < sel.planned ? "stop lt" : "stop");
          return '<circle class="' + c + '" cx="' + q.x.toFixed(1) + '" cy="' + q.y.toFixed(1) + '" r="3.5"/>';
        }).join("") + "</g>";
    }
    var order = vans.slice().sort(function (a, b) {
      return (a.id === state.selected) - (b.id === state.selected);
    });
    var marks = order.map(function (v) {
      var s = status(v), cls = s;
      if (v.issue && !v.issue.resolved && v.issue.kind === "lost") cls = "lost";
      var p = pos(v);
      if (s === "done") { p = { x: DEPOT.x + 34, y: DEPOT.y + 2 + (parseInt(v.id, 10) % 2) * 0 }; }
      var label = "Van " + v.id + ", " + v.driver + ", " + ({ help: "needs help", late: "running late", ok: "on time", done: "back at depot" })[s] + ", " + v.at;
      return '<g class="van s-' + cls + (v.id === state.selected ? " sel" : "") + '" data-select="' + v.id +
        '" role="button" tabindex="0" aria-label="' + esc(label) + '" transform="translate(' + p.x.toFixed(1) + " " + p.y.toFixed(1) + ')">' +
        (s === "help" ? '<circle class="halo" r="24"/>' : "") +
        '<g class="vb"><rect class="hit" x="-22" y="-22" width="44" height="44"/><rect class="selring" x="-19" y="-16" width="38" height="32" rx="3"/>' +
        '<rect class="body" x="-14" y="-11" width="28" height="22" rx="2"/>' +
        "<text>" + v.id + "</text></g></g>";
    }).join("");

    // Keep existing van nodes so transforms can transition.
    if (!svg.dataset.ready) {
      svg.innerHTML = ground() + '<g id="routeLayer"></g><g id="vanLayer"></g>';
      svg.dataset.ready = "1";
    }
    $("routeLayer").innerHTML = route;
    var layer = $("vanLayer");
    var existing = {};
    Array.prototype.forEach.call(layer.children, function (g) { existing[g.getAttribute("data-select")] = g; });
    var tmp = document.createElementNS(SVGNS, "g");
    tmp.innerHTML = marks;
    var focusedId = document.activeElement && document.activeElement.closest && document.activeElement.closest(".van") ?
      document.activeElement.getAttribute("data-select") : null;
    Array.prototype.slice.call(tmp.children).forEach(function (g) {
      var id = g.getAttribute("data-select"), old = existing[id];
      if (old) {
        old.setAttribute("class", g.getAttribute("class"));
        old.setAttribute("aria-label", g.getAttribute("aria-label"));
        old.setAttribute("transform", g.getAttribute("transform"));
        old.innerHTML = g.innerHTML;
        layer.appendChild(old);
      } else {
        layer.appendChild(g);
      }
    });
    if (focusedId) { var f = layer.querySelector('[data-select="' + focusedId + '"]'); f && f.focus(); }
  }

  /* ---------- detail ---------- */
  function renderDetail() {
    var v = vans.filter(function (x) { return x.id === state.selected; })[0];
    if (!v) { $("detail").innerHTML = '<p class="empty">Pick a van on the board or the map.</p>'; return; }
    var s = status(v);
    var badge = {
      help: '<span class="badge b-help">' + esc(v.issue && v.issue.badge) + "</span>",
      late: '<span class="badge b-late">+' + v.delay + " min late</span>",
      ok: '<span class="badge b-ok">On time</span>',
      done: '<span class="badge b-info">Round done</span>'
    }[s];
    var facts = "<dt>Now at</dt><dd>" + esc(v.at) + (v.issue && !v.issue.resolved && v.issue.kind === "lost" ? " (last seen " + hhmm(v.issue.since) + ")" : "") + "</dd>" +
      "<dt>Stops</dt><dd>" + v.done + " of " + v.total + " done" + "</dd>";
    if (s !== "done") {
      var left = v.total - v.done;
      var back = state.now + left * v.avg + v.delay + 20;
      facts += "<dt>Schedule</dt><dd>" + (behind(v) ? behind(v) + " behind" : (v.done > v.planned ? (v.done - v.planned) + " ahead" : "on the plan")) + "</dd>" +
        "<dt>Back at depot</dt><dd>about " + hhmm(back) + "</dd>";
    } else {
      facts += "<dt>Back at depot</dt><dd>" + hhmm(v.back) + "</dd>";
    }
    var list = "";
    if (s !== "done") {
      var rows = [];
      for (var i = v.done; i < Math.min(v.total, v.done + 4); i++) {
        var d = due(v, i), late = d < state.now;
        rows.push('<li><span class="t' + (late ? " late-t" : "") + '">' + hhmm(d) + "</span><span>Stop " + (i + 1) + ", " + esc(v.stops[i].addr) + "</span>" +
          (late ? '<span class="badge b-late">Late</span>' : "<span></span>") + "</li>");
      }
      list = '<div><p class="dlabel">Next stops, promised by</p><ul class="stoplist">' + rows.join("") + "</ul></div>";
    }
    $("detail").innerHTML =
      '<div class="dhead"><h2>Van ' + v.id + "</h2>" + badge + "</div>" +
      '<p class="dwho">' + esc(v.driver) + " is driving today.</p>" +
      (s !== "done" ? "<div>" + strip(v, s) + '<p class="stripline"><span>Done</span><span>Tick: where the plan says it should be at ' + hhmm(state.now) + "</span></p></div>" : "") +
      '<dl class="facts">' + facts + "</dl>" + list +
      '<div class="acts">' + btn("Call " + v.driver, "call", v.id, "phone") + btn("Message", "msg", v.id, "message") + "</div>";
    $("detail").className = "detail d-" + s;
  }

  function render() { renderBoard(); renderMap(); renderDetail(); }

  /* ---------- toast ---------- */
  var toastT;
  function toast(msg) {
    var t = $("toast"); t.textContent = msg; t.classList.add("on");
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("on"); }, 3200);
  }

  function find(id) { return vans.filter(function (v) { return v.id === id; })[0]; }

  /* ---------- actions ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (b) {
      e.stopPropagation();
      var v = find(b.getAttribute("data-van")), act = b.getAttribute("data-act");
      if (act === "call") toast("Calling " + v.driver + " in Van " + v.id + ".");
      if (act === "msg") toast("Message to " + v.driver + " opened. The next customers will get the new time.");
      if (act === "send") {
        var h = nearestHelper(v);
        if (h) {
          v.issue.helper = h.van.id; v.issue.eta = Math.max(4, Math.round(h.km * 3.4));
          toast("Van " + h.van.id + " is heading to " + v.driver + " on " + v.at + ".");
        }
      }
      if (act === "fixed") {
        v.issue.resolved = true; v.delay = Math.round(state.now - v.issue.since); v.planned += 2;
        toast("Van " + v.id + " is moving again. Marked as running late.");
      }
      if (act === "back") {
        v.issue.resolved = true; v.at = "Linden Close";
        toast(v.driver + " is bringing the parcel back to the depot.");
      }
      if (act === "retry") {
        b.setAttribute("aria-busy", "true"); b.disabled = true;
        b.querySelector("span").textContent = "Checking";
        setTimeout(function () {
          v.issue.tries += 1;
          if (v.issue.tries >= 2) {
            v.issue.resolved = true; v.at = "Kiln Lane";
            toast("Van 09 is back on the map, on Kiln Lane.");
          } else {
            toast("Still no signal from Van 09. Try calling " + v.driver + ".");
          }
          render();
        }, 1200);
        return;
      }
      state.selected = v.id;
      render();
      return;
    }
    var s = e.target.closest("[data-select]");
    if (s) { select(s.getAttribute("data-select"), s.closest(".van") ? "map" : "board"); }
  });

  document.addEventListener("keydown", function (e) {
    var g = e.target.closest && e.target.closest(".van");
    if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); select(g.getAttribute("data-select"), "map"); }
    if ((e.metaKey || e.ctrlKey) && (e.key === "b" || e.key === "B")) { e.preventDefault(); toggleRail(); }
  });

  function select(id, from) {
    state.selected = id;
    render();
    if (from === "map") {
      var c = document.querySelector('.board [data-select="' + id + '"].card, .board .mini[data-select="' + id + '"]');
      if (c && window.innerWidth > 1100) c.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
      if (window.innerWidth <= 1100) $("detail").scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
    } else if (window.innerWidth <= 1100) {
      $("where").scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
    }
  }

  /* ---------- rail ---------- */
  var side = $("side"), toggle = $("toggle");
  function setRail(on) {
    side.classList.toggle("rail", on);
    toggle.setAttribute("aria-expanded", String(!on));
    toggle.setAttribute("aria-label", on ? "Expand sidebar" : "Collapse sidebar");
  }
  function toggleRail() { if (window.innerWidth >= 768) setRail(!side.classList.contains("rail")); }
  toggle.addEventListener("click", toggleRail);
  setRail(window.innerWidth >= 768 && window.innerWidth < 1280);

  var menu = $("menu"), scrim = $("scrim");
  function drawer(open) {
    side.classList.toggle("open", open); scrim.hidden = !open;
    menu.setAttribute("aria-expanded", String(open));
    if (open) { var a = side.querySelector(".nav a"); a && a.focus(); }
  }
  menu.addEventListener("click", function () { drawer(true); });
  scrim.addEventListener("click", function () { drawer(false); menu.focus(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && side.classList.contains("open")) { drawer(false); menu.focus(); } });
  side.querySelectorAll(".nav a").forEach(function (a) {
    a.addEventListener("click", function () {
      if (a.id !== "openSettings") {
        side.querySelectorAll(".nav a").forEach(function (x) { x.removeAttribute("aria-current"); });
        a.setAttribute("aria-current", "page");
      }
      if (side.classList.contains("open")) drawer(false);
    });
  });

  /* ---------- settings ---------- */
  var dlg = $("settings");
  $("openSettings").addEventListener("click", function (e) {
    e.preventDefault();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  });
  dlg.addEventListener("change", function (e) {
    var t = e.target;
    if (t.name === "late") { state.lateAfter = parseInt(t.value, 10); render(); }
    if (t.name === "theme") {
      if (t.value === "auto") document.documentElement.removeAttribute("data-theme");
      else document.documentElement.setAttribute("data-theme", t.value);
      try { localStorage.setItem("vandesk-theme", t.value); } catch (err) { /* storage blocked */ }
    }
    if (t.id === "showDone") { state.showDone = t.checked; render(); }
  });
  try {
    var saved = localStorage.getItem("vandesk-theme");
    if (saved && saved !== "auto") {
      document.documentElement.setAttribute("data-theme", saved);
      var r = dlg.querySelector('input[name="theme"][value="' + saved + '"]'); r && (r.checked = true);
    }
  } catch (err) { /* storage blocked */ }

  /* ---------- live tick ---------- */
  function freshness() {
    var s = Math.round((Date.now() - state.lastUpdate) / 1000);
    $("freshText").textContent = s < 3 ? "Positions updated just now" : "Positions updated " + s + " s ago";
  }
  setInterval(freshness, 1000);
  setInterval(function () {
    state.now += 1;
    vans.forEach(function (v) {
      var s = status(v);
      if (s === "ok" || s === "late") v.frac = Math.min(0.95, v.frac + 1 / v.avg);
    });
    state.lastUpdate = Date.now();
    $("clock").textContent = hhmm(state.now);
    render(); freshness();
  }, 15000);

  render();
})();
