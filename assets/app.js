(function () {
  "use strict";

  var CATEGORY_ORDER = [
    "TV & Entertainment", "Rekabet", "Ajans & Marka", "Dijital & AI", "Ölçüm & Araştırma",
    "Etkinlik", "Spor", "Sinema", "Yaratıcı Mecra"
  ];
  var REVIEW_LABEL = {
    approved: ["Claude denetiminden geçti", "ok"],
    approved_with_changes: ["Denetlendi, düzeltildi", "ok"],
    not_reviewed: ["Denetlenmedi", "warn"],
    unreviewed_fallback: ["Denetimsiz yedek yayın", "warn"]
  };
  var MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  var DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

  var state = { index: [], bulletin: null, region: "Tümü", category: null, query: "" };
  var $main = document.getElementById("main");

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function safeUrl(u) { return /^https:\/\//.test(u || "") ? u : "#"; }
  function fmtDate(iso, withDay) {
    var p = iso.split("-").map(Number);
    var d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    var s = p[2] + " " + MONTHS[p[1] - 1] + " " + p[0];
    return withDay ? s + ", " + DAYS[d.getUTCDay()] : s;
  }
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    setTimeout(function () { t.classList.remove("show"); }, 1800);
  }
  function getJSON(url) {
    return fetch(url, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    });
  }
  function currentDate() {
    var q = new URLSearchParams(location.search).get("tarih");
    return q && /^\d{4}-\d{2}-\d{2}$/.test(q) ? q : null;
  }

  /* Theme */
  (function theme() {
    var saved = null;
    try { saved = localStorage.getItem("mg-theme"); } catch (e) {}
    if (saved) document.documentElement.setAttribute("data-theme", saved);
    document.getElementById("themeBtn").addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme");
      var dark = cur ? cur === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      var next = dark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("mg-theme", next); } catch (e) {}
    });
  })();

  document.getElementById("archiveToggle").addEventListener("click", function () {
    document.getElementById("archive").showModal();
  });
  document.getElementById("archiveClose").addEventListener("click", function () {
    document.getElementById("archive").close();
  });
  document.getElementById("shareBtn").addEventListener("click", function () {
    var date = state.bulletin && state.bulletin.date;
    var url = location.origin + location.pathname + (date ? "?tarih=" + date : "");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () { toast("Link kopyalandı"); },
        function () { prompt("Linki kopyalayın:", url); });
    } else { prompt("Linki kopyalayın:", url); }
  });

  /* Kaydedilenler: kullanıcının yıldızladığı haberler (yalnız bu tarayıcıda) */
  var SAVED_KEY = "mg-saved";
  function getSaved() { try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); } catch (e) { return []; } }
  function setSaved(list) { try { localStorage.setItem(SAVED_KEY, JSON.stringify(list)); } catch (e) { toast("Bu tarayıcıda kayıt yapılamıyor"); } }
  function isSaved(date, id) { return getSaved().some(function (x) { return x.date === date && x.id === id; }); }
  function updateSavedCount() {
    var n = getSaved().length, el = document.getElementById("savedCount");
    if (!el) return;
    el.textContent = n; el.hidden = n === 0;
  }
  function toggleSave(id) {
    var b = state.bulletin; if (!b) return;
    var list = getSaved(), i = list.findIndex(function (x) { return x.date === b.date && x.id === id; });
    var on;
    if (i >= 0) { list.splice(i, 1); on = false; }
    else {
      var a = b.articles.find(function (x) { return x.id === id; }); if (!a) return;
      list.unshift({ date: b.date, id: a.id, title: a.title, summary: a.summary, category: a.category, region: a.region, savedAt: new Date().toISOString() });
      on = true;
    }
    setSaved(list); updateSavedCount();
    var btn = document.querySelector('#' + CSS.escape(id) + ' .save-btn');
    if (btn) { btn.setAttribute("aria-pressed", on); btn.innerHTML = on ? "★" : "☆"; btn.title = on ? "Kaydedilenlerden çıkar" : "Kaydet"; }
    toast(on ? "Kaydedildi" : "Kaydedilenlerden çıkarıldı");
  }
  function renderSaved() {
    var list = getSaved(), body = document.getElementById("savedBody");
    if (!list.length) { body.innerHTML = '<p class="empty">Henüz kaydedilmiş haber yok. Bir haber kartındaki ☆ simgesine dokunarak kaydedebilirsin.</p>'; return; }
    var byDate = {};
    list.forEach(function (x) { (byDate[x.date] = byDate[x.date] || []).push(x); });
    body.innerHTML = Object.keys(byDate).sort().reverse().map(function (d) {
      return '<h3 class="saved-day">' + esc(fmtDate(d, true)) + '</h3><ul class="saved-list">' + byDate[d].map(function (x) {
        return '<li><a href="?tarih=' + esc(d) + '#' + esc(x.id) + '" data-date="' + esc(d) + '" data-id="' + esc(x.id) + '">' +
          '<span class="saved-cat">' + esc(x.region) + ' · ' + esc(x.category) + '</span>' +
          '<strong>' + esc(x.title) + '</strong><span class="saved-sum">' + esc(x.summary) + '</span></a>' +
          '<button type="button" class="saved-remove" data-date="' + esc(d) + '" data-id="' + esc(x.id) + '" aria-label="Kaydı kaldır" title="Kaldır">×</button></li>';
      }).join("") + '</ul>';
    }).join("");
  }
  function openArticle(id) {
    if (window.openMediaStory && window.openMediaStory(id)) return;
    var el = document.getElementById(id); if (!el) return;
    var d = el.querySelector("details"); if (d) d.open = true;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  document.getElementById("savedToggle").addEventListener("click", function () { renderSaved(); document.getElementById("saved").showModal(); });
  document.getElementById("savedClose").addEventListener("click", function () { document.getElementById("saved").close(); });
  document.getElementById("savedBody").addEventListener("click", function (e) {
    var rm = e.target.closest(".saved-remove");
    if (rm) {
      setSaved(getSaved().filter(function (x) { return !(x.date === rm.dataset.date && x.id === rm.dataset.id); }));
      updateSavedCount(); renderSaved();
      if (state.bulletin && state.bulletin.date === rm.dataset.date) {
        var b2 = document.querySelector('#' + CSS.escape(rm.dataset.id) + ' .save-btn');
        if (b2) { b2.setAttribute("aria-pressed", "false"); b2.innerHTML = "☆"; }
      }
      return;
    }
    var a = e.target.closest("a[data-id]");
    if (a && state.bulletin && a.dataset.date === state.bulletin.date) {
      e.preventDefault(); document.getElementById("saved").close();
      history.replaceState(null, "", "?tarih=" + a.dataset.date + "#" + a.dataset.id);
      openArticle(a.dataset.id);
    }
  });
  updateSavedCount();

  function renderArchive(active) {
    var html = state.index.map(function (b) {
      return '<li><a href="?tarih=' + b.date + '" class="' + (b.date === active ? "active" : "") + '">' +
        '<div class="a-date">' + esc(fmtDate(b.date, true)) + '</div>' +
        '<div class="a-meta">' + b.articleCount + ' içerik · ' + (b.edition === "daily" ? "Tam" : "Seçki") + '</div></a></li>';
    }).join("");
    document.getElementById("archiveList").innerHTML = html || '<li class="empty">Henüz bülten yok.</li>';
  }

  /* Okuma süresi ve okundu takibi (yalnız bu tarayıcıda) */
  function readMinutes(a) {
    var txt = [a.summary, a.impact, a.action, a.counterView].concat(a.body || []).join(" ");
    return Math.max(1, Math.round(txt.split(/\s+/).length / 200));
  }
  function readKey() { return "mg-read-" + (state.bulletin ? state.bulletin.date : ""); }
  function getRead() { try { return JSON.parse(localStorage.getItem(readKey()) || "{}"); } catch (e) { return {}; } }
  function markRead(id) {
    var r = getRead(); if (r[id]) return; r[id] = 1;
    try { localStorage.setItem(readKey(), JSON.stringify(r)); } catch (e) {}
    var el = document.getElementById(id); if (el) el.classList.add("is-read");
    updateProgress();
  }
  function updateProgress() {
    var b = state.bulletin; if (!b) return;
    var r = getRead(), n = b.articles.filter(function (a) { return r[a.id]; }).length;
    var el = document.getElementById("readProgress");
    if (el) el.innerHTML = '<span class="rp-bar"><span style="width:' + Math.round(100 * n / b.articles.length) + '%"></span></span>' +
      n + ' / ' + b.articles.length + ' okundu';
  }
  function watchReading() {
    if (!("IntersectionObserver" in window)) return;
    var timers = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var id = en.target.id;
        if (en.isIntersecting) { timers[id] = setTimeout(function () { markRead(id); }, 6000); }
        else { clearTimeout(timers[id]); }
      });
    }, { threshold: 0.6 });
    state.watching = function () { io.disconnect(); document.querySelectorAll("#articles article.card").forEach(function (c) { io.observe(c); }); };
    state.watching();
    document.getElementById("articles").addEventListener("toggle", function (e) {
      if (e.target.open) { var c = e.target.closest("article"); if (c) markRead(c.id); }
    }, true);
  }

  /* Önceki / sonraki sayı */
  function issueNavHTML(b) {
    var i = state.index.findIndex(function (x) { return x.date === b.date; });
    if (i < 0) return "";
    var newer = state.index[i - 1], older = state.index[i + 1];
    function cell(x, dir) {
      if (!x) return '<span class="in-cell empty"></span>';
      return '<a class="in-cell ' + dir + '" href="?tarih=' + x.date + '"><span class="in-dir">' + (dir === "prev" ? "← Önceki sayı" : "Sonraki sayı →") + '</span>' +
        '<strong>' + esc(fmtDate(x.date, true)) + '</strong><span class="in-title">' + esc(x.title) + '</span></a>';
    }
    if (!newer && !older) return "";
    return '<nav class="issue-nav" aria-label="Sayılar arası geçiş">' + cell(older, "prev") + cell(newer, "next") + '</nav>';
  }

  /* Kategori görsel yedeği: haberde görsel yoksa ya da yüklenemezse */
  var CAT_ICON = {
    "TV & Entertainment": '<rect x="6" y="10" width="36" height="24" rx="3"/><path d="M18 40h12M24 34v6"/>',
    "Rekabet": '<path d="M8 38l10-12 8 6 14-18"/><path d="M32 14h8v8"/>',
    "Ajans & Marka": '<circle cx="24" cy="24" r="14"/><path d="M24 14v20M14 24h20"/>',
    "Dijital & AI": '<rect x="10" y="10" width="28" height="28" rx="4"/><path d="M18 18h12v12H18zM24 4v6M24 38v6M4 24h6M38 24h6"/>',
    "Ölçüm & Araştırma": '<path d="M10 38V22M20 38V12M30 38V26M40 38V16"/>',
    "Etkinlik": '<rect x="8" y="12" width="32" height="28" rx="3"/><path d="M8 20h32M16 8v8M32 8v8"/>',
    "Spor": '<circle cx="24" cy="24" r="15"/><path d="M24 9v30M9 24h30"/>',
    "Sinema": '<rect x="8" y="14" width="32" height="22" rx="2"/><path d="M8 20h32M14 14l4 6M22 14l4 6M30 14l4 6"/>',
    "Yaratıcı Mecra": '<path d="M24 6l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z"/>'
  };
  function domainOf(u) { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } }
  function fallbackVisual(a) {
    var src = (a.sources || [])[0];
    return '<div class="card-visual fallback cat-' + (CATEGORY_ORDER.indexOf(a.category) + 1) + '" aria-hidden="true">' +
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (CAT_ICON[a.category] || "") + '</svg>' +
      '<span class="fv-cat">' + esc(a.category) + '</span>' +
      (src ? '<span class="fv-src">' + esc(domainOf(src.url)) + '</span>' : '') + '</div>';
  }
  function visualHTML(a) {
    var img = a.image;
    if (!img || !/^https:\/\//.test(img.url || "")) return fallbackVisual(a);
    return '<figure class="card-visual has-img"><img src="' + esc(img.url) + '" alt="' + esc(img.alt || "") + '" loading="lazy" referrerpolicy="no-referrer" ' +
      'onerror="var c=this.closest(\'article\');if(c.classList.contains(\'featured\')){c.classList.remove(\'featured\');c.classList.add(\'lead\');}this.closest(\'figure\').outerHTML=c.dataset.fallback">' +
      (img.credit ? '<figcaption>Görsel: ' + (img.sourceUrl ? '<a href="' + esc(safeUrl(img.sourceUrl)) + '" target="_blank" rel="noopener">' + esc(img.credit) + '</a>' : esc(img.credit)) + '</figcaption>' : '') +
      '</figure>';
  }
  function bullets(list, cls) {
    return '<ul class="' + cls + '">' + list.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul>';
  }

  function articleHTML(a, i) {
    var regionCls = a.region === "Türkiye" ? "tr" : "gl";
    var tags = '<span class="pill ' + regionCls + '">' + esc(a.region) + '</span>' +
      '<span class="pill accent">' + esc(a.category) + '</span>' +
      (a.layer ? '<span class="pill layer">' + esc(a.layer) + '</span>' : "") +
      (a.label ? '<span class="pill warn">' + esc(a.label) + '</span>' : "");
    var body = a.body || [];
    var preview = body.slice(0, 3), rest = body.slice(3);
    var sources = (a.sources || []).map(function (s) {
      return '<li><a href="' + esc(safeUrl(s.url)) + '" target="_blank" rel="noopener">' + esc(s.name) + '</a>' +
        '<span class="s-meta">' + esc(s.published) + ' · ' + esc(s.country) + ' · ' + esc(s.language) + '</span></li>';
    }).join("");
    return '<article class="card' + (getRead()[a.id] ? ' is-read' : '') + (i === 0 ? (a.image && a.image.url ? ' featured' : ' lead') : '') + '" id="' + esc(a.id) + '" data-fallback="' + esc(fallbackVisual(a)) + '">' +
      visualHTML(a) +
      '<div class="card-main">' +
        '<div class="card-tags">' + tags + (function () { var on = isSaved(state.bulletin.date, a.id); return '<button type="button" class="save-btn" data-save="' + esc(a.id) + '" aria-pressed="' + on + '" title="' + (on ? 'Kaydedilenlerden çıkar' : 'Kaydet') + '" aria-label="Haberi kaydet">' + (on ? '★' : '☆') + '</button>'; })() + '</div>' +
        '<h3>' + esc(a.title) + '</h3>' +
        '<div class="when">' + esc(a.market) + ' · ' + esc(a.eventDate) + ' · ' + readMinutes(a) + ' dk okuma<span class="read-mark">✓ Okundu</span></div>' +
        '<p class="summary">' + esc(a.summary) + '</p>' +
        '<div class="kv"><h4>Ne değişti?</h4>' + bullets(preview, "facts") + '</div>' +
        '<div class="kv why"><h4>Bu ne anlama geliyor?</h4><p>' + esc(a.impact) + '</p></div>' +
        '<div class="kv act"><h4>Ne yapmalı?</h4><p>' + esc(a.action) + '</p></div>' +
      '</div>' +
      '<details><summary>Detay ve kaynaklar · ' + (a.sources || []).length + ' kaynak <span aria-hidden="true">↗</span></summary><div class="detail">' +
        (rest.length ? '<div class="block"><h4>Diğer ayrıntılar</h4>' + bullets(rest, "facts") + '</div>' : "") +
        '<div class="block counter"><h4 lang="en">Counter-View</h4><p>' + esc(a.counterView) + '</p></div>' +
        (a.learning ? '<div class="block learn"><h4>Öğrenme notu</h4><p>' + esc(a.learning) + '</p></div>' : "") +
        '<div class="block"><h4>Kaynaklar</h4><ul class="sources">' + sources + '</ul></div>' +
      '</div></details>' +
    '</article>';
  }

  /* Radar (eski adı Tutum Radarı) ve Kısa sinyaller (22 Ekim 2026'dan itibaren).
     Günün okuması 22 Ekim'de kaldırıldı; eski bültenlerdeki dayRead alanı çizilmez.
     editorial.js Spor Takvimi panelini bu bandın içine, Radar'ın yanına taşır. */
  function dayBriefHTML(b) {
    var ar = b.attitudeRadar;
    if (!(ar && ar.items && ar.items.length)) return "";
    var items = ar.items.map(function (it) {
      var cls = it.basis === "Veri" ? "att-basis veri" : "att-basis";
      return '<li><div class="att-meta"><span class="att-tag">' + esc(it.tag) + '</span><span class="' + cls + '">' + esc(it.basis) + '</span><span class="att-rec">' + esc(it.recurrence) + '</span></div><p>' + esc(it.text) + '</p></li>';
    }).join("");
    return '<section class="day-brief agenda-panels" aria-label="Radar ve Spor Takvimi">' +
      '<aside class="attitude agenda-panel" aria-labelledby="radarTitle"><div class="att-head"><span class="eyebrow">Medya tutumunda bugün</span><h2 id="radarTitle">Radar</h2></div>' +
      '<div class="att-body"><ul class="att-list">' + items + '</ul>' + (ar.note ? '<p class="att-note">' + esc(ar.note) + '</p>' : "") + '</div></aside></section>';
  }
  function signalsHTML(b) {
    var sg = b.signals;
    if (!sg || !sg.length) return "";
    return '<section class="signals" id="kisaSinyaller" aria-label="Kısa sinyaller"><div class="sig-head"><span class="eyebrow">Hızlı bakış</span><h2>Kısa sinyaller</h2><p>Tek satırlık, kaynaklı gelişmeler. Yorum içermez.</p></div><ul class="sig-list">' +
      sg.map(function (x) {
        return '<li><div class="sig-tags"><span class="pill ' + (x.region === "Türkiye" ? "tr" : "gl") + '">' + esc(x.region) + '</span><span class="pill layer">' + esc(x.layer) + '</span></div><p>' + esc(x.text) + '</p><a href="' + esc(safeUrl(x.url)) + '" target="_blank" rel="noopener">' + esc(x.source) + ' · ' + esc(x.published) + ' ↗</a></li>';
      }).join("") + '</ul></section>';
  }

  /* Dijital gündem: sosyal medyada konuşulanlar ve en çok izlenenler */
  var PLATFORM_CLS = { "YouTube": "yt", "TikTok": "tt", "Instagram": "ig", "X": "x", "Netflix": "nf", "Google": "gg", "Spotify": "sp", "Disney+": "dp", "Prime Video": "pv" };
  function socialHTML(b) {
    var soc = b.social;
    if (!soc || !soc.items || !soc.items.length) return "";
    var cards = soc.items.map(function (it) {
      var cls = PLATFORM_CLS[it.platform] || "other";
      return '<li class="soc-card">' +
        '<div class="soc-top"><span class="soc-plat ' + cls + '">' + esc(it.platform) + '</span>' +
          (it.type ? '<span class="soc-type">' + esc(it.type) + '</span>' : '') +
          (it.rank ? '<span class="soc-rank">#' + esc(it.rank) + '</span>' : '') + '</div>' +
        (it.market ? '<div class="soc-mkt' + (/henüz yok/.test(it.market) ? ' new' : '') + '">' + esc(it.market) + '</div>' : '') +
        '<h3>' + esc(it.title) + '</h3>' +
        (it.metric ? '<div class="soc-metric">' + esc(it.metric) + '</div>' : '') +
        (it.whyItMatters ? '<p>' + esc(it.whyItMatters) + '</p>' : '') +
        '<a class="soc-src" href="' + esc(safeUrl(it.url)) + '" target="_blank" rel="noopener">' + esc(it.source) + (it.published ? ' · ' + esc(it.published) : '') + ' ↗</a>' +
      '</li>';
    }).join("");
    return '<section class="social" aria-labelledby="socTitle"><div class="soc-head"><div><span class="eyebrow">Dijital gündem</span>' +
      '<h2 id="socTitle">Sosyal medyada konuşulanlar ve en çok izlenenler</h2>' +
      (soc.window ? '<p>' + esc(soc.window) + '</p>' : '') + '</div>' +
      (soc.note ? '<p class="soc-note">' + esc(soc.note) + '</p>' : '') + '</div>' +
      '<ul class="soc-list">' + cards + '</ul></section>';
  }

  /* Cuma: haftanın özeti */
  function weeklyHTML(b) {
    var w = b.weekly;
    if (!w || !w.items || !w.items.length) return "";
    var items = w.items.map(function (it, i) {
      var ref = it.ref ? '<a class="wk-ref" href="?tarih=' + esc(String(it.ref).split("#")[0]) + (String(it.ref).indexOf("#") > -1 ? "#" + esc(String(it.ref).split("#")[1]) : "") + '">İlgili sayı ↗</a>' : "";
      return '<li class="wk-card"><span class="wk-num">' + (i + 1) + '</span><div><h3>' + esc(it.title) + '</h3>' +
        (it.text ? '<p>' + esc(it.text) + '</p>' : '') + ref + '</div></li>';
    }).join("");
    var open = (w.open || []).length ? '<div class="wk-open"><h3>Açık kalan konular</h3><ul>' +
      w.open.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul></div>' : "";
    return '<section class="weekly" aria-labelledby="wkTitle"><div class="soc-head"><div><span class="eyebrow">Haftanın özeti</span>' +
      '<h2 id="wkTitle">Bu haftanın 3 ana gelişmesi</h2>' + (w.window ? '<p>' + esc(w.window) + '</p>' : '') + '</div></div>' +
      '<ol class="wk-list">' + items + '</ol>' + open + '</section>';
  }

  function listBlock(title, items, open) {
    if (!items || !items.length) return "";
    return '<details' + (open ? " open" : "") + '><summary>' + esc(title) +
      '<span class="count">' + items.length + '</span></summary><ul>' +
      items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></details>";
  }

  function renderArticles() {
    var b = state.bulletin;
    var arts = b.articles.filter(function (a) {
      return (state.region === "Tümü" || a.region === state.region) &&
        (!state.category || a.category === state.category) &&
        (!state.query || [a.title, a.summary, a.impact, a.action, a.category].concat(a.body || []).join(" ").toLocaleLowerCase("tr").includes(state.query));
    });
    document.getElementById("resultCount").textContent = arts.length + " kaynaklı gelişme · toplam " + arts.reduce(function (t, a) { return t + readMinutes(a); }, 0) + " dk okuma";
    var html = "";
    ["Türkiye", "Global"].forEach(function (region) {
      var group = arts.filter(function (a) { return a.region === region; });
      if (!group.length) return;
      group.sort(function (x, y) {
        return CATEGORY_ORDER.indexOf(x.category) - CATEGORY_ORDER.indexOf(y.category);
      });
      html += '<div class="region-head ' + (region === "Türkiye" ? "tr" : "gl") + '"><h2>' + region +
        '</h2><span>' + group.length + ' içerik</span></div><div class="card-grid">' + group.map(function (a, i) { return articleHTML(a, i); }).join("") + '</div>';
    });
    document.getElementById("articles").innerHTML = html || '<p class="empty">Bu filtrede içerik yok.</p>';
    if (state.watching) state.watching();
  }

  function renderFilters() {
    var cats = {};
    state.bulletin.articles.forEach(function (a) {
      if (state.region === "Tümü" || a.region === state.region) cats[a.category] = (cats[a.category] || 0) + 1;
    });
    if (state.category && !cats[state.category]) state.category = null;
    var segs = ["Tümü", "Türkiye", "Global"].map(function (r) {
      return '<button type="button" data-region="' + r + '" aria-pressed="' + (state.region === r) + '">' + r + '</button>';
    }).join("");
    var chips = CATEGORY_ORDER.filter(function (c) { return cats[c]; }).map(function (c) {
      return '<button type="button" class="chip" data-cat="' + esc(c) + '" aria-pressed="' + (state.category === c) + '">' +
        esc(c) + ' · ' + cats[c] + '</button>';
    }).join("");
    document.getElementById("filters").innerHTML = '<div class="filters"><div class="seg" role="group" aria-label="Bölge">' + segs + '</div></div>' +
      '<div class="chips" role="group" aria-label="Kategori">' + chips + '</div>';
  }

  function bindFilters() {
    document.getElementById("filters").addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      if (btn.dataset.region) state.region = btn.dataset.region;
      if (btn.dataset.cat) state.category = state.category === btn.dataset.cat ? null : btn.dataset.cat;
      renderFilters(); renderArticles();
    });
  }

  /* Haftanın önemli maçları paneli */
  var SHORT_DAYS = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
  function fixturesHTML(b) {
    var list = (b.matches || []).slice().sort(function (x, y) {
      return (x.date + (x.time || "99:99")).localeCompare(y.date + (y.time || "99:99"));
    });
    if (!list.length) return "";
    var groups = [], cur = null;
    list.forEach(function (m) {
      if (!cur || cur.date !== m.date) { cur = { date: m.date, items: [] }; groups.push(cur); }
      cur.items.push(m);
    });
    var rows = 0;
    var body = groups.map(function (g) {
      var p = g.date.split("-").map(Number);
      var d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
      var isToday = g.date === b.date;
      var items = g.items.map(function (m) {
        rows++;
        var extra = rows > 8 && !(m.tags && m.tags.length);
        var tags = (m.tags || []).map(function (t) { return '<span class="fx-tag">' + esc(t) + '</span>'; }).join("");
        var bc = m.broadcaster ? esc(m.broadcaster) : '<span class="fx-unverified">Yayıncı teyitsiz</span>';
        var time = m.time ? esc(m.time) : '<span class="fx-unverified" title="Saat teyitsiz">--:--</span>';
        var teams = esc(m.home) + ' <span class="fx-vs">–</span> ' + esc(m.away);
        var link = m.source ? '<a class="fx-src" href="' + esc(safeUrl(m.source)) + '" target="_blank" rel="noopener" aria-label="Kaynak">↗</a>' : "";
        return '<li class="fx-row' + (extra ? ' fx-extra' : '') + '"><span class="fx-time">' + time + '</span>' +
          '<div class="fx-body"><div class="fx-teams">' + teams + tags + '</div>' +
          '<div class="fx-meta">' + esc(m.sport) + ' · ' + esc(m.competition) + ' · ' + bc + (m.note ? ' · ' + esc(m.note) : '') + '</div></div>' + link + '</li>';
      }).join("");
      var allExtra = items.indexOf('fx-row"') === -1;
      return '<div class="fx-day' + (allExtra ? ' fx-extra-day' : '') + '"><span>' + p[2] + ' ' + MONTHS[p[1] - 1] + '</span> ' + SHORT_DAYS[d.getUTCDay()] +
        (isToday ? ' <span class="fx-today">Bugün</span>' : '') + '</div><ul>' + items + '</ul>';
    }).join("");
    return '<div class="fx-wrap"><aside class="fixtures show-all" aria-labelledby="fxTitle"><div class="fx-head"><span class="eyebrow">Spor takvimi</span>' +
      '<h2 id="fxTitle">Haftanın önemli maçları</h2>' + (b.matchesWindow ? '<p>' + esc(b.matchesWindow) + ' · Türkiye saati · ' + rows + ' maç</p>' : '') + '</div>' +
      '<div class="fx-scroll" tabindex="0" aria-label="Maç listesi, kaydırılabilir">' + body +
      '<p class="fx-foot">Tarih, saat ve yayıncı resmî kaynaklardan alınır; teyit edilemeyenler işaretlidir.</p></div></aside></div>';
  }



  /* Media Guru'larından Notlar (22 Ekim 2026): yalnız ChatGPT paketinden gelir; önemli yayın yoksa panel çıkmaz */
  function gurusHTML(b) {
    var g = b.gurus;
    if (!g || !g.items || !g.items.length) return "";
    var cards = g.items.map(function (it) {
      var link = /^https:\/\//.test(it.url || "") ? '<a href="' + esc(safeUrl(it.url)) + '" target="_blank" rel="noopener">' + esc(it.title) + ' ↗</a>' : esc(it.title);
      return '<li class="gur-card"><div class="gur-top"><span class="gur-person">' + esc(it.person) + '</span>' +
        (it.evidence ? '<span class="gur-ev">' + esc(it.evidence) + '</span>' : '') + '</div>' +
        '<h3>' + link + '</h3>' +
        (it.summary ? '<p>' + esc(it.summary) + '</p>' : '') +
        (it.whyItMatters ? '<p class="gur-why"><strong>Planlamaya etkisi:</strong> ' + esc(it.whyItMatters) + '</p>' : '') +
        (it.counterView ? '<p class="gur-cv"><strong>Sınır:</strong> ' + esc(it.counterView) + '</p>' : '') +
        '<span class="gur-src">' + esc(it.source) + (it.published ? ' · ' + esc(it.published) : '') + '</span></li>';
    }).join("");
    return '<aside class="gurus" aria-labelledby="gurTitle"><div class="gur-head"><span class="eyebrow">Araştırmacılardan</span>' +
      '<h2 id="gurTitle">Media Guru\'larından Notlar</h2>' + (g.window ? '<p>' + esc(g.window) + '</p>' : '') + '</div>' +
      '<ul class="gur-list" tabindex="0" aria-label="Araştırmacı notları, kaydırılabilir">' + cards + '</ul>' +
      (g.note ? '<details class="agenda-note"><summary>Veri hakkında</summary><p class="soc-note">' + esc(g.note) + '</p></details>' : '') + '</aside>';
  }

  /* TV dizi takvimi (21 Ekim 2026): data/tv-takvim.json; yalnız en güncel sayıda gösterilir */
  var TV_DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar", "Günü belirsiz"];
  var TV_STATUS = { "yayinda": "Yayında", "kanal-teyitli": "Kanal teyitli", "planlanan": "Planlanan", "belirsiz": "Belirsiz" };
  function dayGap(a, b) { return Math.round((Date.parse(b) - Date.parse(a)) / 864e5); }
  function fmtShort(iso) { var p = iso.split("-").map(Number); return p[2] + " " + MONTHS[p[1] - 1]; }
  function tvItemHTML(e, b, upd) {
    var stale = e.checked && upd && dayGap(e.checked, upd) > 14;
    var title = e.source && /^https:\/\//.test(e.source)
      ? '<a href="' + esc(safeUrl(e.source)) + '" target="_blank" rel="noopener">' + esc(e.title) + '</a>' : esc(e.title);
    var badge = "";
    if (e.tag === "final") {
      badge = '<span class="tv-badge final">Dizi Finali</span> <span class="tv-when">' + (e.final ? "Veda: " + esc(fmtShort(e.final)) : "Tarih açıklanmadı") + '</span>';
    } else if (e.tag === "yeni" && !(e.start && e.start <= b.date)) {
      badge = '<span class="tv-badge new">Yeni Dizi</span> <span class="tv-when">' + (e.start ? "Başlangıç: " + esc(fmtShort(e.start)) : "Başlangıç tarihi açıklanmadı") + '</span>';
    }
    return '<div class="tv-item st-' + esc(e.status) + '" title="' + esc(TV_STATUS[e.status] || "") + (e.checked ? " · son teyit " + esc(fmtShort(e.checked)) : "") + '">' +
      '<span class="tv-dot" aria-hidden="true"></span><div><strong>' + title + (stale ? ' <sup class="tv-stale" title="Son teyit 14 günden eski">†</sup>' : "") + '</strong>' +
      (e.time ? '<small class="tv-time">' + esc(e.time) + '</small>' : "") +
      (e.note ? '<small>' + esc(e.note) + '</small>' : "") +
      (badge ? '<small class="tv-tags">' + badge + '</small>' : "") + '</div></div>' +
      '<span class="sr-only"> Durum: ' + esc(TV_STATUS[e.status] || "") + '.</span>';
  }
  function tvHTML(b) {
    var tv = state.tv;
    if (!tv || !tv.entries || !tv.entries.length) return "";
    if (state.index[0] && state.index[0].date !== b.date) return "";
    var d = b.date.split("-").map(Number);
    var today = DAYS[new Date(Date.UTC(d[0], d[1] - 1, d[2])).getUTCDay()];
    var entries = tv.entries.filter(function (e) { return !(e.tag === "final" && e.final && e.final < b.date); });
    var head = '<tr><th scope="col" class="tv-corner"><span class="sr-only">Kanal</span></th>' + TV_DAYS.map(function (day) {
      return '<th scope="col"' + (day === today ? ' class="tv-today" aria-current="date"' : "") + '>' + esc(day === "Günü belirsiz" ? "Günü belirsiz" : day) + '</th>';
    }).join("") + '</tr>';
    var rows = (tv.channels || []).map(function (ch) {
      var cells = TV_DAYS.map(function (day) {
        var items = entries.filter(function (e) { return e.channel === ch && e.day === day; }).map(function (e) { return tvItemHTML(e, b, tv.updated); }).join("");
        return '<td' + (day === today ? ' class="tv-today"' : "") + '>' + items + '</td>';
      }).join("");
      return '<tr><th scope="row">' + esc(ch) + '</th>' + cells + '</tr>';
    }).join("");
    var legend = ["kanal-teyitli", "planlanan", "yayinda", "belirsiz"].map(function (k) {
      return '<li class="st-' + k + '"><span class="tv-dot" aria-hidden="true"></span>' + TV_STATUS[k] + '</li>';
    }).join("");
    return '<section class="tvgrid" id="tvTakvim" aria-labelledby="tvTitle"><div class="tv-head"><div><span class="eyebrow">TV takvimi</span>' +
      '<h2 id="tvTitle">' + esc(tv.title || "TV Dizi Takvimi") + '</h2><p>' + esc(fmtDate(tv.updated)) + ' itibarıyla · Kanal yayın akışlarına göre</p></div>' +
      '<ul class="tv-legend" aria-label="Durum renkleri">' + legend + '</ul></div>' +
      '<div class="tv-scroll" tabindex="0" role="region" aria-label="Haftalık dizi takvimi, yatay kaydırılabilir"><table class="tv-table"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>' +
      '</section>';
  }

  function renderBulletin(b) {
    state.bulletin = b; state.region = "Tümü"; state.category = null;
    document.title = fmtDate(b.date) + " · Media Guide Daily";
    var rv = REVIEW_LABEL[(b.review || {}).status] || REVIEW_LABEL.not_reviewed;
    var highlights = (b.highlights || []).map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("");
    var fixtures = fixturesHTML(b);
    $main.innerHTML =
      '<section class="hero' + (fixtures ? '' : ' no-fixtures') + '"><div class="hero-copy">' +
        '<div class="eyebrow">Daily Media Intelligence <span class="pill">' + (b.edition === "daily" ? "Günlük bülten" : "Editörün seçkisi") + '</span></div>' +
        '<h1>Gündemi oku. <em>Etkisini gör.</em></h1>' +
        '<div class="hero-meta">' + esc(fmtDate(b.date, true)) + ' <span>·</span> ' + b.articles.length + ' gelişme</div>' +
      '</div>' + dayBriefHTML(b) + '<div class="hero-row"><aside class="highlights"><h2>Bu sayıda</h2><ol>' + highlights + '</ol><p>Kaynaklı bilgi. Net planlama etkisi. <span aria-hidden="true">↗</span></p></aside>' +
      fixtures + gurusHTML(b) + '</div></section>' + signalsHTML(b) + tvHTML(b) +
      '<div class="edition-bar"><span>■ &nbsp; Editörün seçkisi <span class="edition-date">' + esc(fmtDate(b.date)) + '</span></span><button class="text-btn" id="allIssues">Tüm sayılar &nbsp; →</button></div>' +
      weeklyHTML(b) + socialHTML(b) +
      '<div class="reading-layout"><aside class="discover"><h2>Keşfet</h2><div id="filters"></div>' +
        '<div class="discover-note"><span class="eyebrow">Daha iyi kararlar için</span><p>Haberin ötesinde,<br>medya etkisine bak.</p><a href="#yontem">Yaklaşımımız ↗</a></div></aside>' +
      '<section class="feed"><div class="feed-head"><div><h2>Öne çıkan gelişmeler</h2><p id="resultCount" role="status"></p><p id="readProgress" class="read-progress"></p></div><input type="search" id="search" aria-label="Bu bültende ara" placeholder="Bu bültende ara…"></div>' +
      '<details class="issue-context"><summary>Bu sayının kapsamı ve denetimi <span class="pill ' + rv[1] + '">' + rv[0] + '</span></summary><div><h3>' + esc(b.title) + '</h3><p>' + esc(b.summary) + '</p><p><strong>Tarama penceresi:</strong> ' + esc(b.window) + '</p></div></details>' +
      '<div id="articles"></div><section class="closing">' +
        listBlock("Düzeltmeler", b.corrections, true) +
        listBlock("Eksik ve doğrulanamayan kontroller", b.limitations, false) +
        (b.review && b.review.summary ? listBlock("Denetim notu", [b.review.summary], false) : "") +
        (b.proposal ? '<div class="proposal"><strong>Öneri:</strong> ' + esc(b.proposal) + '</div>' : "") +
      '</section>' + issueNavHTML(b) + '</section><aside class="radar"><span class="eyebrow">Radarda</span><h2>Sırada ne var?</h2><p class="muted">Kararları değiştirebilecek sinyaller.</p><ol>' +
        (b.watchlist || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') +
      '</ol><div class="share-card"><h3>İyi bilgi paylaştıkça değerli.</h3><p>Bu sayıyı ekibinizle paylaşın. Üyelik gerektirmez.</p><button class="btn" id="shareIssue">Bağlantıyı kopyala ↗</button></div></aside></div>';
    document.getElementById("allIssues").addEventListener("click", function () { document.getElementById("archive").showModal(); });
    document.getElementById("shareIssue").addEventListener("click", function () { document.getElementById("shareBtn").click(); });
    
    document.getElementById("articles").addEventListener("click", function (e) {
      var sb = e.target.closest(".save-btn"); if (sb) { e.preventDefault(); toggleSave(sb.dataset.save); }
    });
    updateProgress();
    if (window.mountMediaEditorial) window.mountMediaEditorial(b, {render: function(a){return articleHTML(a, 1);}, save: toggleSave, markRead: markRead});
    if (location.hash) openArticle(decodeURIComponent(location.hash.slice(1)));
  }

  /* GoatCounter: sayfa görüntülemesini bülten tarihiyle kaydet */
  function track(path, title, tries) {
    tries = tries || 0;
    if (window.goatcounter && typeof window.goatcounter.count === "function") {
      try { window.goatcounter.count({ path: path, title: title }); } catch (e) {}
    } else if (tries < 20) {
      setTimeout(function () { track(path, title, tries + 1); }, 500);
    }
  }

  function load() {
    getJSON("bulletins/index.json").then(function (idx) {
      state.index = idx.bulletins || [];
      var date = currentDate() || (state.index[0] && state.index[0].date);
      renderArchive(date);
      if (!date) { $main.innerHTML = '<p class="empty">Henüz yayımlanmış bülten yok.</p>'; return; }
      return Promise.all([getJSON("bulletins/" + date + ".json"), getJSON("data/tv-takvim.json").catch(function () { return null; })]).then(function (res) {
        var b = res[0]; state.tv = res[1];
        if (b.status !== "published") throw new Error("draft");
        renderBulletin(b);
        track("/bulten/" + b.date, b.title);
      }).catch(function () {
        $main.innerHTML = '<p class="empty">' + esc(fmtDate(date)) + ' tarihli yayımlanmış bülten bulunamadı. Arşivden başka bir gün seçebilirsiniz.</p>';
      });
    }).catch(function () {
      $main.innerHTML = '<p class="empty">Arşiv yüklenemedi. Sayfayı yenilemeyi deneyin.</p>';
    });
  }

  /* Sayfa okuma çubuğu */
  (function () {
    var bar = document.createElement("div"); bar.className = "scroll-bar"; document.body.appendChild(bar);
    window.addEventListener("scroll", function () {
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, scrollY / h) : 0) + ")";
    }, { passive: true });
  })();

  load();
})();
