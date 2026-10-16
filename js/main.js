/* ============================================================
   GBÊKÊ FM — Logique du site public
   Layout injecté, lecteur audio, favoris, historique, recherche
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- Icônes SVG ---------------- */
  const I = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1.4"/><rect x="14" y="4" width="4" height="16" rx="1.4"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    radio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5C19 15.5 12 20 12 20Z"/></svg>',
    heartFill: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5C19 15.5 12 20 12 20Z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m0 0-6-6m6 6-6 6"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m9 6 6 6-6 6"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4 10-10"/></svg>',
    volume: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>',
    mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="m16 9 5 6M21 9l-5 6"/></svg>',
    forward: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 5v14l7-7-7-7ZM4 5v14l7-7-7-7Z"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5v14l-7-7 7-7ZM20 5v14l-7-7 7-7Z"/></svg>',
    skipBack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5"/><text x="12" y="15.6" font-size="7.4" font-weight="700" fill="currentColor" stroke="none" text-anchor="middle" font-family="Poppins, sans-serif">15</text></svg>',
    skipFwd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.4L21 8"/><path d="M21 3v5h-5"/><text x="12" y="15.6" font-size="7.4" font-weight="700" fill="currentColor" stroke="none" text-anchor="middle" font-family="Poppins, sans-serif">15</text></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2 0-3.5 1.5-3.5 3.5V11H8v3h2.5v7h3v-7H16l.5-3h-3V9.5c0-.3.2-.5.5-.5Z"/></svg>',
    tw: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 3h3l-6.6 7.6L21.8 21h-6l-4.7-6.2L5.6 21h-3l7-8L2.6 3h6.1l4.3 5.6L17.5 3Zm-1 16h1.7L7.6 4.8H5.8L16.5 19Z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    yt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2c-.2-1-.9-1.7-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3c-1 .2-1.7.9-1.9 1.9C2 9 2 12 2 12s0 3 .4 4.8c.2 1 .9 1.7 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3c1-.2 1.7-.9 1.9-1.9.4-1.8.4-4.8.4-4.8s0-3-.4-4.8ZM10 15V9l5 3-5 3Z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.4-3.9-4.6-4.1-.1-.2-1-1.4-1-2.6s.6-1.8.9-2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.5.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.4.1.6-.1l.8-1c.2-.2.3-.2.5-.1l1.8.9c.5.2.5.4.5.5.1.2.1.9-.1 1.5Z"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5Z"/><path d="M8 3v18"/></svg>',
    music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>',
    cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-5 9 5-9 5-9-5Z"/><path d="M7 11v5c0 1 2 2 5 2s5-1 5-2v-5"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5a3.5 3.5 0 0 1 0 7M18 20a6 6 0 0 0-3-5"/></svg>',
    ball: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="m12 7 3 2-1 3.5h-4L9 9l3-2Z"/><path d="M12 3v4M4 10l4 1M20 10l-4 1M7 20l2-4M17 20l-2-4"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2Z"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>'
  };

  /* ---------------- Utilitaires ---------------- */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
    set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
  };
  const FAV_KEY = "gbeke_favoris";
  const HIST_KEY = "gbeke_historique";
  const USER_KEY = "gbeke_user";
  const getFavs = () => store.get(FAV_KEY, []);
  const isFav = (id) => getFavs().includes(id);
  const getUser = () => store.get(USER_KEY, null);
  const setUser = (u) => u ? store.set(USER_KEY, u) : localStorage.removeItem(USER_KEY);

  function toggleFav(id) {
    let f = getFavs();
    const on = f.includes(id);
    f = on ? f.filter((x) => x !== id) : [...f, id];
    store.set(FAV_KEY, f);
    document.dispatchEvent(new CustomEvent("favchange"));
    toast(on ? "Retiré des favoris" : "Ajouté à vos favoris", !on);
    return !on;
  }
  function addHistory(podcast) {
    let h = store.get(HIST_KEY, []).filter((x) => x.id !== podcast.id);
    h.unshift({ id: podcast.id, titre: podcast.titre, emission: podcast.emission, image: podcast.image, date: new Date().toISOString(), position: 0 });
    h = h.slice(0, 30);
    store.set(HIST_KEY, h);
  }

  /* Téléchargement réel d'un podcast : déclenche immédiatement le téléchargement
     du fichier audio avec un nom de fichier propre. */
  function safeName(s) {
    return String(s || "podcast").replace(/[\\/:*?"<>|\r\n\t]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 90);
  }
  function downloadPodcast(p) {
    if (!p || !p.audio) return;
    const filename = "GBEKE-FM - " + safeName(p.titre) + ".mp3";
    const a = document.createElement("a");
    a.href = p.audio;
    a.download = filename;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addHistory(p);
  }

  /* Ouvre la page d'écoute en direct dédiée (Zeno.fm) dans un nouvel onglet. */
  function openLive() {
    window.open((GBEKE.radio && GBEKE.radio.livePage) || "https://zeno.fm/radio/gbeke-fm/", "_blank", "noopener");
  }

  /* ---------------- Toast ---------------- */
  let toastEl;
  function toast(msg, ok = true) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; document.body.appendChild(toastEl); }
    toastEl.className = "toast" + (ok ? "" : " warn");
    toastEl.innerHTML = (ok ? I.check : I.spark) + "<span>" + msg + "</span>";
    requestAnimationFrame(() => toastEl.classList.add("is-show"));
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toastEl.classList.remove("is-show"), 2600);
  }

  /* ---------------- Lecteur audio ---------------- */
  const Player = (function () {
    let audio, el, state = { title: "", sub: "", cover: "", id: null, live: false };
    function build() {
      el = document.createElement("div");
      el.className = "player";
      el.innerHTML = `
        <div class="wrap">
          <div class="player__info">
            <div class="player__cover" id="pCover">${I.radio}</div>
            <div class="player__txt"><b id="pTitle">GBÊKÊ FM</b><span id="pSub">Prêt à écouter</span></div>
          </div>
          <div class="player__controls">
            <button class="player__icon" id="pBack" aria-label="Reculer de 15 secondes" title="Reculer 15 s">${I.skipBack}</button>
            <button class="player__btn" id="pPlay" aria-label="Lecture">${I.play}</button>
            <button class="player__icon" id="pFwd" aria-label="Avancer de 15 secondes" title="Avancer 15 s">${I.skipFwd}</button>
          </div>
          <div class="player__bar" id="pBar">
            <span class="player__time" id="pCur">0:00</span>
            <div class="progress" id="pProg"><div class="progress__fill" id="pFill"></div><div class="progress__knob" id="pKnob"></div></div>
            <span class="player__time" id="pDur">0:00</span>
          </div>
          <div class="player__actions">
            <span class="player__live hide" id="pLive"><span class="live-dot"></span>DIRECT</span>
            <button class="player__icon" id="pFav" aria-label="Favori">${I.heart}</button>
            <button class="player__icon" id="pVol" aria-label="Volume">${I.volume}</button>
          </div>
        </div>`;
      document.body.appendChild(el);
      audio = new Audio();
      audio.preload = "metadata";
      const p = {
        play: $("#pPlay", el), prog: $("#pProg", el), fill: $("#pFill", el), knob: $("#pKnob", el),
        cur: $("#pCur", el), dur: $("#pDur", el), title: $("#pTitle", el), sub: $("#pSub", el),
        cover: $("#pCover", el), live: $("#pLive", el), bar: $("#pBar", el), fav: $("#pFav", el)
      };
      p.play.addEventListener("click", togglePlay);
      $("#pBack", el).addEventListener("click", () => skip(-15));
      $("#pFwd", el).addEventListener("click", () => skip(15));
      $("#pVol", el).addEventListener("click", () => { audio.muted = !audio.muted; $("#pVol", el).innerHTML = audio.muted ? I.mute : I.volume; });
      p.fav.addEventListener("click", () => { if (state.id) { const on = toggleFav(state.id); p.fav.classList.toggle("is-active", on); p.fav.innerHTML = on ? I.heartFill : I.heart; } });
      const seek = (e) => {
        const r = p.prog.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        if (isFinite(audio.duration) && audio.duration > 0) audio.currentTime = ratio * audio.duration;
      };
      p.prog.addEventListener("click", seek);
      audio.addEventListener("timeupdate", () => {
        if (!isFinite(audio.duration) || audio.duration <= 0) return;
        const r = audio.currentTime / audio.duration;
        p.fill.style.width = (r * 100) + "%";
        p.knob.style.left = (r * 100) + "%";
        p.cur.textContent = time(audio.currentTime);
      });
      audio.addEventListener("loadedmetadata", () => { p.dur.textContent = time(audio.duration); });
      audio.addEventListener("play", () => { p.play.innerHTML = I.pause; });
      audio.addEventListener("pause", () => { p.play.innerHTML = I.play; });
      audio.addEventListener("ended", () => { p.play.innerHTML = I.play; });
      audio.addEventListener("error", () => { toast("Flux audio indisponible (démo)", false); });
    }
    const time = (s) => { s = Math.floor(s || 0); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
    function togglePlay() { if (audio.paused) audio.play().catch(() => {}); else audio.pause(); }
    function play(opt) {
      if (!el) build();
      state = Object.assign({ live: false, id: null, cover: "" }, opt);
      el.classList.add("is-visible");
      $("#pTitle", el).textContent = opt.title || "GBÊKÊ FM";
      $("#pSub", el).textContent = opt.sub || "";
      const cov = $("#pCover", el);
      cov.innerHTML = opt.cover ? `<img src="${opt.cover}" alt="">` : I.radio;
      $("#pLive", el).classList.toggle("hide", !opt.live);
      $("#pBar", el).style.visibility = opt.live ? "hidden" : "visible";
      $("#pBack", el).style.display = opt.live ? "none" : "";
      $("#pFwd", el).style.display = opt.live ? "none" : "";
      const fav = $("#pFav", el);
      if (opt.id) { fav.style.display = ""; const on = isFav(opt.id); fav.classList.toggle("is-active", on); fav.innerHTML = on ? I.heartFill : I.heart; }
      else fav.style.display = "none";
      if (audio.src !== opt.src) { audio.src = opt.src; }
      audio.play().catch(() => {});
      if (opt.id) { const p = GBEKE.podcastById(opt.id); if (p) addHistory(p); }
    }
    function skip(sec) {
      if (!audio || !isFinite(audio.duration) || audio.duration <= 0) return;
      audio.currentTime = Math.min(audio.duration, Math.max(0, audio.currentTime + sec));
    }
    return { play, toggle: togglePlay, el: () => el, audio: () => audio, skip };
  })();
  window.GBEKE_PLAYER = Player;

  /* ---------------- Cartes ---------------- */
  function emissionCard(e) {
    return `<article class="card card--show reveal">
      <a class="card__media" href="emission.html?id=${e.id}">
        <img src="${e.image}" alt="${e.nom}" loading="lazy">
        <span class="badge">${e.categorie}</span>
        <div class="card__overlay"><h3>${e.nom}</h3><span>${e.animateur}</span></div>
      </a>
    </article>`;
  }
  function podcastCard(p) {
    return `<article class="card card--podcast reveal">
      <div class="thumb"><img src="${p.image}" alt="${p.titre}" loading="lazy"></div>
      <div class="info">
        <h4><a href="podcast.html?id=${p.id}">${p.titre}</a></h4>
        <p>${p.emission} • ${p.duree}</p>
      </div>
      <button class="card__dl" data-dl="${p.id}" aria-label="Télécharger" title="Télécharger le podcast">${I.download}</button>
      <button class="play-fab play-fab--sm" data-play="${p.id}" aria-label="Écouter">${I.play}</button>
    </article>`;
  }
  function podcastGridCard(p) {
    return `<article class="card reveal">
      <div class="card__media">
        <img src="${p.image}" alt="${p.titre}" loading="lazy">
        <span class="badge">${p.categorie}</span>
        <button class="play-fab card__play" data-play="${p.id}" aria-label="Écouter">${I.play}</button>
        <button class="card__dl card__dl--media" data-dl="${p.id}" aria-label="Télécharger" title="Télécharger le podcast">${I.download}</button>
      </div>
      <div class="card__body">
        <h3><a href="podcast.html?id=${p.id}">${p.titre}</a></h3>
        <p>${p.description}</p>
        <div class="card__meta">
          <span>${I.radio}${p.emission}</span>
          <span>${I.clock}${p.duree}</span>
        </div>
        <a class="btn btn--ghost btn--sm card__dlbtn" href="${p.audio}" download="GBEKE-FM - ${p.titre}.mp3" data-dl="${p.id}">${I.download}Télécharger</a>
      </div>
    </article>`;
  }
  function articleCard(a) {
    return `<article class="card card--article reveal">
      <a class="card__media" href="article.html?id=${a.id}"><img src="${a.image}" alt="${a.titre}" loading="lazy"><span class="badge">${a.categorie}</span></a>
      <div class="card__body">
        <h3><a href="article.html?id=${a.id}">${a.titre}</a></h3>
        <p>${a.resume}</p>
        <div class="card__meta"><span>${I.user}${a.auteur}</span><span>${I.clock}${GBEKE.fmtDateShort(a.date)}</span></div>
      </div>
    </article>`;
  }
  const catIcon = (n) => I[n] || I.grid;
  function categoryTile(c, count) {
    return `<a class="cat-tile reveal" href="categorie.html?id=${c.id}">
      <span class="ic">${catIcon(c.icone)}</span>
      <span><b>${c.nom}</b><span>${count} contenus</span></span>
      <span class="arrow">${I.arrow}</span>
    </a>`;
  }

  /* ---------------- Recherche ---------------- */
  function searchAll(q) {
    q = q.toLowerCase().trim();
    if (!q) return { emissions: [], podcasts: [], articles: [] };
    const m = (t) => (t || "").toLowerCase().includes(q);
    return {
      emissions: GBEKE.emissions.filter((e) => m(e.nom) || m(e.description) || m(e.categorie)),
      podcasts: GBEKE.podcasts.filter((p) => p.statut === "publié" && (m(p.titre) || m(p.description) || m(p.emission))),
      articles: GBEKE.articles.filter((a) => a.statut === "publié" && (m(a.titre) || m(a.resume) || m(a.categorie)))
    };
  }

  /* ---------------- Layout (header/footer/player) ---------------- */
  const NAV = [
    ["accueil", "index.html", "Accueil"],
    ["emissions", "emissions.html", "Émissions"],
    ["podcasts", "podcasts.html", "Podcasts"],
    ["actualites", "actualites.html", "Actualités"],
    ["categories", "categories.html", "Catégories"],
    ["contact", "contact.html", "Contact"]
  ];

  function headerHTML(active) {
    const u = getUser();
    const navLinks = NAV.map(([k, h, l]) => `<a href="${h}" class="${k === active ? "active" : ""}">${l}</a>`).join("");
    const drawerLinks = NAV.map(([k, h, l]) => `<a href="${h}" class="${k === active ? "active" : ""}">${l}</a>`).join("");
    return `
    <div class="topstrip">
      <div class="wrap">
        <div class="ts-left">
          <span class="ts-item freq">${I.radio}<strong>105.2 MHz</strong></span>
          <span class="ts-item">${I.pin}Bouaké, Côte d'Ivoire</span>
          <span class="ts-item">${I.spark}Jusqu'au bout du monde !</span>
        </div>
        <div class="ts-right">
          <a href="tel:+2252734765354" class="ts-item">${I.phone}+225 27 34 76 53 54</a>
          <span class="socials-wrap">
            <span class="socials-label">Nous suivre</span>
            <span class="socials">
              <a href="https://www.facebook.com/webradiogbekefm" target="_blank" rel="noopener" aria-label="Facebook">${I.fb}</a>
              <a href="https://twitter.com/Gbeke_fm" target="_blank" rel="noopener" aria-label="Twitter">${I.tw}</a>
              <a href="https://www.instagram.com/gbeke_fm/" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a>
              <a href="https://www.youtube.com/@gbekefm5987" target="_blank" rel="noopener" aria-label="YouTube">${I.yt}</a>
            </span>
          </span>
        </div>
      </div>
    </div>
    <header class="site-header">
      <div class="wrap">
        <a class="brand" href="index.html">
          <img src="assets/brand/gbeke-logo.png" alt="GBÊKÊ FM">
          <span class="brand-txt"><b>GBÊKÊ FM</b><span>Web Radio • 105.2</span></span>
        </a>
        <nav class="main-nav">${navLinks}</nav>
        <div class="header-actions">
          <button class="icon-btn" id="openSearch" aria-label="Rechercher">${I.search}</button>
          <a class="icon-btn" href="${u ? "profil.html" : "connexion.html"}" aria-label="${u ? "Mon profil" : "Connexion"}">${I.user}</a>
          <button class="btn btn--primary" id="listenLive">${I.radio}<span>Écouter en direct</span></button>
          <button class="icon-btn burger" id="openDrawer" aria-label="Menu">${I.menu}</button>
        </div>
      </div>
    </header>
    <div class="drawer" id="drawer">
      <div class="drawer__scrim" data-close-drawer></div>
      <div class="drawer__panel">
        <div class="drawer__head">
          <img src="assets/brand/gbeke-logo.png" alt="GBÊKÊ FM">
          <button class="icon-btn" data-close-drawer aria-label="Fermer">${I.close}</button>
        </div>
        <nav>${drawerLinks}</nav>
        <div class="drawer__foot">
          <button class="btn btn--primary btn--block" id="listenLive2">${I.radio}Écouter en direct</button>
          <a class="btn btn--ghost btn--block" href="${u ? "profil.html" : "connexion.html"}">${I.user}${u ? "Mon profil" : "Connexion / Inscription"}</a>
        </div>
      </div>
    </div>
    <div class="search-overlay" id="searchOverlay">
      <div class="search-box">
        <form id="searchForm" action="recherche.html" method="get">
          ${I.search}
          <input type="search" name="q" id="searchInput" placeholder="Rechercher une émission, un podcast, un article…" autocomplete="off">
          <button class="btn btn--primary btn--sm" type="submit">Rechercher</button>
        </form>
        <div class="sug">
          <span style="color:var(--muted);font-size:.85rem;width:100%;margin-top:4px">Recherches populaires</span>
          ${["Culture", "Gossip Star", "Mag' Santé", "Parlons Sport", "Matinale"].map((s) => `<a class="chip" href="recherche.html?q=${encodeURIComponent(s)}">${s}</a>`).join("")}
        </div>
      </div>
    </div>`;
  }

  function footerHTML() {
    return `
    <footer class="site-footer">
      <div class="wrap">
        <div class="f-top">
          <div class="f-brand">
            <img src="assets/brand/gbeke-logo.png" alt="GBÊKÊ FM">
            <p>GBÊKÊ FM, premier média de Côte d'Ivoire certifié JTI à la norme CWA 17493. Votre radio de proximité à Bouaké.</p>
            <div class="f-social-wrap">
              <span class="f-social-label">Nous suivre</span>
              <div class="f-social">
                <a href="https://www.facebook.com/webradiogbekefm" target="_blank" rel="noopener" aria-label="Facebook">${I.fb}</a>
                <a href="https://twitter.com/Gbeke_fm" target="_blank" rel="noopener" aria-label="Twitter">${I.tw}</a>
                <a href="https://www.instagram.com/gbeke_fm/" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a>
                <a href="https://www.youtube.com/@gbekefm5987" target="_blank" rel="noopener" aria-label="YouTube">${I.yt}</a>
              </div>
            </div>
          </div>
          <div>
            <h4>Navigation</h4>
            <ul>
              <li><a href="index.html">Accueil</a></li>
              <li><a href="emissions.html">Émissions</a></li>
              <li><a href="podcasts.html">Podcasts</a></li>
              <li><a href="actualites.html">Actualités</a></li>
              <li><a href="categories.html">Catégories</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul class="f-contact">
              <li>${I.mail}<span>radiogbeke@gmail.com</span></li>
              <li>${I.phone}<span>+225 27 34 76 53 54<br>+225 07 48 23 41 86</span></li>
              <li>${I.pin}<span>Bouaké, Côte d'Ivoire<br>105.2 MHz</span></li>
            </ul>
          </div>
        </div>
        <div class="f-bottom">
          <span>© ${new Date().getFullYear()} GBÊKÊ FM — Tous droits réservés.</span>
          <span class="made">Jusqu'au bout du monde ! • Conçu selon le cahier des charges v1.0</span>
        </div>
      </div>
    </footer>`;
  }

  function mountChrome() {
    const active = document.body.dataset.page || "";
    const h = $("#app-header"); if (h) h.innerHTML = headerHTML(active);
    const f = $("#app-footer"); if (f) f.innerHTML = footerHTML();
    // interactions
    const header = $(".site-header");
    window.addEventListener("scroll", () => { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); }, { passive: true });
    const drawer = $("#drawer");
    const openD = () => drawer && drawer.classList.add("is-open");
    const closeD = () => drawer && drawer.classList.remove("is-open");
    $("#openDrawer") && $("#openDrawer").addEventListener("click", openD);
    $$("[data-close-drawer]").forEach((b) => b.addEventListener("click", closeD));
    const so = $("#searchOverlay");
    const openS = () => { if (so) { so.classList.add("is-open"); setTimeout(() => $("#searchInput").focus(), 120); } };
    const closeS = () => so && so.classList.remove("is-open");
    $("#openSearch") && $("#openSearch").addEventListener("click", openS);
    so && so.addEventListener("click", (e) => { if (e.target === so) closeS(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeS(); closeD(); } });
    // live buttons → ouvrent la page d'écoute en direct dédiée (Zeno.fm)
    const goLive = openLive;
    ["listenLive", "listenLive2"].forEach((id) => { const b = $("#" + id); if (b) b.addEventListener("click", goLive); });
    // delegated play buttons
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-play]");
      if (b) {
        e.preventDefault();
        const p = GBEKE.podcastById(b.dataset.play);
        if (p) Player.play({ title: p.titre, sub: p.emission + " • " + p.duree, cover: p.image, src: p.audio, id: p.id });
        return;
      }
      // delegated download buttons
      const d = e.target.closest("[data-dl]");
      if (d) {
        e.preventDefault();
        const p = GBEKE.podcastById(d.dataset.dl);
        if (p) { downloadPodcast(p); toast("Téléchargement de « " + p.titre + " » lancé…"); }
      }
    });
    revealInit();
  }

  /* ---------------- Reveal ---------------- */
  function revealInit() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-in")); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.08 });
    els.forEach((e) => io.observe(e));
  }

  /* ---------------- Newsletter ---------------- */
  function bindNewsletter() {
    $$("form[data-newsletter]").forEach((f) => {
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = f.querySelector("input[type=email]");
        if (!input.value || !/.+@.+\..+/.test(input.value)) { toast("Veuillez saisir une adresse e-mail valide", false); return; }
        toast("Merci ! Votre inscription à la newsletter est confirmée.");
        f.reset();
      });
    });
  }

  /* ---------------- Expose ---------------- */
  window.GBEKE_UI = {
    I, $, $$, toast, Player, emissionCard, podcastCard, podcastGridCard, articleCard, categoryTile,
    catIcon, searchAll, revealInit, bindNewsletter, toggleFav, isFav, getFavs, addHistory, downloadPodcast, openLive, getUser, setUser, store,
    FAV_KEY, HIST_KEY, USER_KEY
  };

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    mountChrome();
    bindNewsletter();
    document.dispatchEvent(new CustomEvent("gbeke:ready"));
  });
})();
