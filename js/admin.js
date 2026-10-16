/* ============================================================
   GBÊKÊ FM — Logique de l'espace administrateur
   Sidebar/topbar injectés, graphiques SVG, modales, CRUD simulé
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- Icônes ---------------- */
  const A = {
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    radio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8"/></svg>',
    podcast: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="11" r="3"/><path d="M12 14v7M8.5 8.5a5 5 0 0 1 7 0M6 6a8.5 8.5 0 0 1 12 0"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 3 12V4a1 1 0 0 1 1-1h8a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.6Z"/><circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5a3.5 3.5 0 0 1 0 7M18 20a6 6 0 0 0-3-5"/></svg>',
    msg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4L4 21l1.1-3.3A8.4 8.4 0 1 1 21 11.5Z"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 14 3-4 3 3 4-6"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4 10-10"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5m0 0-6 6m6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14m0 0 6-6m-6 6-6-6"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V7m0 0-4 4m4-4 4 4M4 19h16"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
    filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18l-7 8v6l-4-2v-4L3 5Z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5C19 15.5 12 20 12 20Z"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2Z"/></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>'
  };

  /* ---------------- Utilitaires ---------------- */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const fmtNum = (n) => (n || 0).toLocaleString("fr-FR");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let toastEl;
  function toast(msg, ok = true) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "a-toast"; document.body.appendChild(toastEl); }
    toastEl.className = "a-toast" + (ok ? "" : " warn");
    toastEl.innerHTML = (ok ? A.check : A.spark) + "<span>" + msg + "</span>";
    requestAnimationFrame(() => toastEl.classList.add("is-show"));
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toastEl.classList.remove("is-show"), 2600);
  }

  /* ---------------- Navigation ---------------- */
  const NAV = [
    { grp: "Pilotage" },
    { k: "dashboard", h: "index.html", l: "Tableau de bord", ic: "grid" },
    { grp: "Contenus" },
    { k: "emissions", h: "emissions.html", l: "Émissions", ic: "mic" },
    { k: "podcasts", h: "podcasts.html", l: "Podcasts", ic: "podcast" },
    { k: "articles", h: "articles.html", l: "Articles", ic: "file" },
    { k: "categories", h: "categories.html", l: "Catégories", ic: "tag" },
    { grp: "Diffusion" },
    { k: "radio", h: "radio.html", l: "Radio en direct", ic: "radio" },
    { grp: "Audience" },
    { k: "messages", h: "messages.html", l: "Messages", ic: "msg", badge: "msg" },
    { k: "statistiques", h: "statistiques.html", l: "Statistiques", ic: "chart" },
    { grp: "Système" },
    { k: "utilisateurs", h: "utilisateurs.html", l: "Utilisateurs & rôles", ic: "users" }
  ];

  function currentUser() {
    try { return JSON.parse(localStorage.getItem("gbeke_user")); } catch (e) { return null; }
  }

  function sidebarHTML(active) {
    const unread = (window.GBEKE ? GBEKE.messages.filter((m) => m.statut === "non_lu").length : 0);
    const items = NAV.map((n) => {
      if (n.grp) return '<div class="grp">' + n.grp + "</div>";
      const cnt = n.badge === "msg" && unread ? '<span class="cnt">' + unread + "</span>" : "";
      return '<a href="' + n.h + '" class="' + (n.k === active ? "active" : "") + '">' + A[n.ic] + "<span>" + n.l + "</span>" + cnt + "</a>";
    }).join("");
    const u = currentUser() || {};
    const prenom = u.prenom || "Amadou";
    const nom = u.nom || "Koné";
    const role = u.role || "Administrateur";
    const initials = (((prenom[0] || "A") + (nom[0] || "K"))).toUpperCase();
    return '<div class="sb-brand"><img src="../assets/brand/gbeke-logo.png" alt="GBÊKÊ FM"><div class="t"><b>GBÊKÊ FM</b><span>Administration</span></div></div>' +
      '<nav class="sb-nav">' + items + "</nav>" +
      '<div class="sb-foot"><div class="sb-user"><div class="av">' + initials + '</div><div class="m"><b>' + prenom + " " + nom + '</b><span>' + role + '</span></div>' +
      '<a href="../connexion.html" class="out" data-logout title="Se déconnecter">' + A.logout + "</a></div></div>";
  }

  function topbarHTML(title, crumb, actions) {
    return '<button class="burger" id="sbOpen" aria-label="Menu">' + A.menu + "</button>" +
      "<div><h1>" + title + "</h1><div class=\"crumb\">" + (crumb || "Administration") + "</div></div>" +
      '<div class="tb-actions">' + (actions || "") +
      '<a class="tb-icon" href="../index.html" title="Voir le site">' + A.external + "</a>" +
      '<button class="tb-icon" id="bellBtn" title="Notifications">' + A.bell + '<span class="dot"></span></button>' +
      "</div>";
  }

  function mountAdmin(active, title, crumb, actions) {
    // Garde d'authentification : back-office réservé aux administrateurs connectés.
    const cu = currentUser();
    if (!cu || cu.role !== "Administrateur") {
      location.replace("../connexion.html");
      return;
    }
    const sb = $("#app-sidebar");
    if (sb) sb.innerHTML = sidebarHTML(active);
    const tb = $("#app-topbar");
    if (tb) tb.innerHTML = topbarHTML(title, crumb, actions);
    const scrim = document.createElement("div");
    scrim.className = "sb-scrim"; scrim.id = "sbScrim";
    document.body.appendChild(scrim);
    const sidebar = $(".sidebar");
    const open = () => { sidebar.classList.add("is-open"); scrim.classList.add("is-open"); };
    const close = () => { sidebar.classList.remove("is-open"); scrim.classList.remove("is-open"); };
    $("#sbOpen") && $("#sbOpen").addEventListener("click", open);
    scrim.addEventListener("click", close);
    $("#bellBtn") && $("#bellBtn").addEventListener("click", () => toast("3 nouvelles notifications."));
    const out = $("[data-logout]");
    if (out) out.addEventListener("click", () => { try { localStorage.removeItem("gbeke_user"); } catch (e) {} });
    // active link fallback
    $$(".sb-nav a").forEach((a) => { if (a.getAttribute("href") === active + ".html") a.classList.add("active"); });
  }

  /* ---------------- Graphiques SVG ---------------- */
  function lineChart(values, labels, opts) {
    opts = opts || {};
    const w = 700, h = 230, pad = { t: 20, r: 16, b: 28, l: 40 };
    const max = Math.max.apply(null, values) * 1.15 || 1;
    const min = 0;
    const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
    const step = values.length > 1 ? iw / (values.length - 1) : iw;
    const X = (i) => pad.l + i * step;
    const Y = (v) => pad.t + ih - ((v - min) / (max - min)) * ih;
    let d = "";
    values.forEach((v, i) => { d += (i ? " L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1); });
    const area = d + " L" + X(values.length - 1).toFixed(1) + " " + (pad.t + ih) + " L" + X(0).toFixed(1) + " " + (pad.t + ih) + " Z";
    let grid = "";
    for (let g = 0; g <= 4; g++) {
      const y = pad.t + (ih / 4) * g;
      const val = Math.round(max - (max / 4) * g);
      grid += '<line class="grid-l" x1="' + pad.l + '" y1="' + y + '" x2="' + (w - pad.r) + '" y2="' + y + '"/>';
      grid += '<text class="axis" x="' + (pad.l - 8) + '" y="' + (y + 3) + '" text-anchor="end">' + fmtNum(val) + "</text>";
    }
    let xlab = "";
    (labels || []).forEach((l, i) => {
      if (i % 2 === 0) xlab += '<text class="axis" x="' + X(i) + '" y="' + (h - 8) + '" text-anchor="middle">' + l + "</text>";
    });
    let pts = "";
    if (opts.dots !== false) values.forEach((v, i) => { pts += '<circle class="pt" cx="' + X(i) + '" cy="' + Y(v) + '" r="3.2"/>'; });
    return '<div class="chart"><svg viewBox="0 0 ' + w + " " + h + '" preserveAspectRatio="none">' +
      '<defs><linearGradient id="gradO" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F26B0F" stop-opacity=".38"/><stop offset="100%" stop-color="#F26B0F" stop-opacity="0"/></linearGradient></defs>' +
      grid + '<path class="area" d="' + area + '"/><path class="line" d="' + d + '"/>' + pts + xlab + "</svg></div>";
  }

  function barChart(data) {
    const max = Math.max.apply(null, data.map((d) => d.v)) || 1;
    return '<div class="bars">' + data.map((d) =>
      '<div class="b"><div class="bar" style="height:' + Math.max(6, (d.v / max) * 100) + '%"><span>' + fmtNum(d.v) + '</span></div><div class="lb">' + d.l + "</div></div>"
    ).join("") + "</div>";
  }

  function donutChart(segments) {
    const total = segments.reduce((s, x) => s + x.v, 0) || 1;
    const r = 54, c = 2 * Math.PI * r;
    let off = 0;
    const circles = segments.map((s) => {
      const len = (s.v / total) * c;
      const el = '<circle cx="75" cy="75" r="' + r + '" fill="none" stroke="' + s.c + '" stroke-width="18" stroke-dasharray="' + len.toFixed(1) + " " + (c - len).toFixed(1) + '" stroke-dashoffset="' + (-off).toFixed(1) + '" transform="rotate(-90 75 75)"/>';
      off += len; return el;
    }).join("");
    const legend = segments.map((s) =>
      '<div><span class="sw" style="background:' + s.c + '"></span><span>' + s.l + '</span><b>' + Math.round((s.v / total) * 100) + "%</b></div>"
    ).join("");
    return '<div class="donut"><svg viewBox="0 0 150 150">' +
      '<circle cx="75" cy="75" r="' + r + '" fill="none" stroke="#1C1F27" stroke-width="18"/>' + circles +
      '<text x="75" y="72" text-anchor="middle" fill="#EDEFF3" font-family="Poppins" font-size="20" font-weight="700">' + fmtNum(total) + '</text>' +
      '<text x="75" y="90" text-anchor="middle" fill="#8B93A3" font-size="10">total</text></svg>' +
      '<div class="legend">' + legend + "</div></div>";
  }

  function sparkline(values, color) {
    color = color || "#F26B0F";
    const w = 90, h = 34, max = Math.max.apply(null, values) || 1, min = Math.min.apply(null, values);
    const rng = (max - min) || 1;
    const step = w / (values.length - 1);
    let d = "";
    values.forEach((v, i) => { d += (i ? " L" : "M") + (i * step).toFixed(1) + " " + (h - ((v - min) / rng) * (h - 6) - 3).toFixed(1); });
    return '<svg class="spark" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + " " + h + '"><path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  /* ---------------- Modales ---------------- */
  function openModal(id) { const m = document.getElementById(id); if (m) m.classList.add("is-open"); }
  function closeModal(id) { const m = document.getElementById(id); if (m) m.classList.remove("is-open"); }
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-close-modal]")) {
      const m = e.target.closest(".a-modal"); if (m) m.classList.remove("is-open");
    }
    if (e.target.classList && e.target.classList.contains("a-modal__scrim")) {
      e.target.closest(".a-modal").classList.remove("is-open");
    }
  });

  /* ---------------- Store CRUD simulé ---------------- */
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const Store = {
    emissions: clone(window.GBEKE.emissions),
    podcasts: clone(window.GBEKE.podcasts),
    articles: clone(window.GBEKE.articles),
    categories: clone(window.GBEKE.categories),
    messages: clone(window.GBEKE.messages),
    utilisateurs: clone(window.GBEKE.utilisateurs),
    roles: clone(window.GBEKE.roles),
    permissions: clone(window.GBEKE.permissions),
    nextId(list) { return list.reduce((m, x) => Math.max(m, x.id), 0) + 1; }
  };

  /* ---------------- Badges ---------------- */
  function statutBadge(s) {
    const map = { "publié": ["pub", "Publié"], "brouillon": ["draft", "Brouillon"], "archivé": ["arch", "Archivé"], "active": ["act", "Active"], "actif": ["act", "Actif"], "inactif": ["draft", "Inactif"], "bloqué": ["off", "Bloqué"] };
    const m = map[s] || ["draft", s];
    return '<span class="a-badge ' + m[0] + '">' + m[1] + "</span>";
  }
  function msgBadge(s) {
    const map = { "non_lu": ["unread", "Non lu"], "lu": ["draft", "Lu"], "traite": ["pub", "Traité"], "archive": ["arch", "Archivé"] };
    const m = map[s] || ["draft", s];
    return '<span class="a-badge ' + m[0] + '">' + m[1] + "</span>";
  }

  /* ---------------- Expose ---------------- */
  window.ADMIN = { A, $, $$, fmtNum, esc, toast, mountAdmin, lineChart, barChart, donutChart, sparkline, openModal, closeModal, Store, statutBadge, msgBadge };
})();
