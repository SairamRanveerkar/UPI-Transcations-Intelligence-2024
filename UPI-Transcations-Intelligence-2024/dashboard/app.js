(function () {
  const D = window.UPI_DATA, NS = "http://www.w3.org/2000/svg";
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const fmt = n => n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const cr = n => (n / 1e7).toFixed(2);
  const el = (t, a = {}, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };
  const svg = (id, w, h) => { const host = document.getElementById(id); host.innerHTML = ""; return el("svg", { viewBox: `0 0 ${w} ${h}`, role: "img" }, host); };
  const txt = (p, x, y, s, a = {}) => { const t = el("text", { x, y, ...a }, p); t.textContent = s; return t; };

  const k = D.kpi;
  document.getElementById("kpis").innerHTML = [
    [fmt(k.total_transactions), "transactions"],
    ["₹" + cr(k.total_transaction_value_inr) + " cr", "total value, median ₹" + fmt(k.median_transaction_inr)],
    [k.success_rate_pct.toFixed(2) + "%", "payments succeeded"],
    [fmt(k.fraud_flagged_transactions), "flagged, " + k.fraud_flag_rate_pct.toFixed(3) + "% of all", "flag"],
    [k.significant_tests_5pct + " of " + k.tests_run, "segment differences were significant", "flag"],
  ].map(([b, s, c]) => `<div class="kpi ${c || ""}"><b>${b}</b><span>${s}</span></div>`).join("");

  function hbars(id, rows, label, val, f, n) {
    rows = rows.slice(0, n); const W = 360, rh = 26, H = rows.length * rh + 4, mx = Math.max(...rows.map(val));
    const s = svg(id, W, H), lw = 96;
    rows.forEach((r, i) => {
      const g = el("g", { class: "row" }, s), y = i * rh + 2, w = (W - lw - 60) * val(r) / mx;
      txt(g, 0, y + 16, label(r));
      el("rect", { x: lw, y: y + 3, width: w, height: 15, fill: css("--blue"), rx: 2 }, g);
      txt(g, lw + w + 6, y + 16, f(val(r)), { class: "v" });
    });
  }
  hbars("states", D.states, r => r.sender_state, r => r.transaction_value_inr, cr, 8);
  hbars("banks", D.banks, r => r.sender_bank, r => r.transaction_value_inr, cr, 8);
  hbars("merchants", D.merchants, r => r.merchant_category, r => r.transactions, fmt, 10);

  (function monthly() {
    const W = 520, H = 250, m = { l: 44, b: 28, t: 8 }, rows = D.monthly, mx = 8000, bw = (W - m.l) / rows.length;
    const s = svg("monthly", W, H);
    [0, 2000, 4000, 6000, 8000].forEach(v => {
      const y = H - m.b - (H - m.b - m.t) * v / mx;
      el("line", { x1: m.l, x2: W, y1: y, y2: y, stroke: css("--line") }, s); txt(s, 0, y + 4, fmt(v));
    });
    rows.forEach((r, i) => {
      const h = (H - m.b - m.t) * r.transactions / mx;
      el("rect", { x: m.l + i * bw + 4, y: H - m.b - h, width: bw - 8, height: h, fill: css("--blue"), rx: 2 }, s);
      txt(s, m.l + i * bw + bw / 2, H - 10, "JFMAMJJASOND"[i], { "text-anchor": "middle" });
    });
  })();

  (function heat() {
    const W = 520, H = 250, m = { l: 36, b: 24 }, days = D.heatmap.days, v = D.heatmap.values, mx = Math.max(...v.flat());
    const cw = (W - m.l) / 24, ch = (H - m.b) / 7, s = svg("heat", W, H);
    v.forEach((row, r) => {
      txt(s, 0, r * ch + ch / 2 + 4, days[r].slice(0, 3));
      row.forEach((n, c) => el("rect", { x: m.l + c * cw, y: r * ch, width: cw - 1, height: ch - 1, fill: css("--blue"), "fill-opacity": (0.07 + 0.93 * n / mx).toFixed(2) }, s));
    });
    [0, 6, 12, 18, 23].forEach(h => txt(s, m.l + h * cw + cw / 2, H - 6, h + "h", { "text-anchor": "middle" }));
  })();

  (function ci() {
    const rows = D.ci, W = 760, rh = 28, m = { l: 150, r: 20 }, H = rows.length * rh + 34, mx = 0.7;
    const x = v => m.l + (W - m.l - m.r) * v / mx, s = svg("ci", W, H);
    const overall = k.fraud_flag_rate_pct;
    [0, 0.2, 0.4, 0.6].forEach(t => { el("line", { x1: x(t), x2: x(t), y1: 0, y2: H - 22, stroke: css("--line") }, s); txt(s, x(t), H - 6, t.toFixed(1) + "%", { "text-anchor": "middle" }); });
    el("line", { x1: x(overall), x2: x(overall), y1: 0, y2: H - 22, stroke: css("--flag"), "stroke-dasharray": "5 4", "stroke-width": 1.5 }, s);
    rows.forEach((r, i) => {
      const y = i * rh + 14;
      txt(s, 0, y + 4, r.group); el("line", { x1: x(r.lo), x2: x(r.hi), y1: y, y2: y, stroke: css("--blue"), "stroke-width": 2 }, s);
      el("circle", { cx: x(r.rate_pct), cy: y, r: 4.5, fill: css("--blue") }, s);
    });
  })();

  (function daily() {
    const W = 1040, H = 260, m = { l: 40, b: 26, t: 8 }, rows = D.daily, mx = 320, mn = 150;
    const x = i => m.l + (W - m.l - 8) * i / (rows.length - 1), y = v => H - m.b - (H - m.b - m.t) * (v - mn) / (mx - mn), s = svg("daily", W, H);
    [150, 200, 250, 300].forEach(v => { el("line", { x1: m.l, x2: W, y1: y(v), y2: y(v), stroke: css("--line") }, s); txt(s, 0, y(v) + 4, v); });
    el("polyline", { points: rows.map((r, i) => `${x(i)},${y(r.n)}`).join(" "), fill: "none", stroke: css("--blue"), "stroke-opacity": .45, "stroke-width": 1 }, s);
    el("polyline", { points: rows.filter(r => r.m).map(r => `${x(rows.indexOf(r))},${y(r.m)}`).join(" "), fill: "none", stroke: css("--ink"), "stroke-width": 2 }, s);
    rows.forEach((r, i) => { if (r.a) { el("circle", { cx: x(i), cy: y(r.n), r: 5, fill: css("--flag") }, s); txt(s, x(i), y(r.n) - 9, r.d.slice(5), { "text-anchor": "middle" }); } });
    ["Jan", "Mar", "May", "Jul", "Sep", "Nov"].forEach((mo, j) => txt(s, x(j * 61), H - 8, mo));
  })();
})();
