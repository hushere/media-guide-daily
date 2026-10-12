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

  var state = { index: [], bulletin: null, region: "Tümü", category: null };
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
    var a = document.getElementById("archive");
    var open = a.classList.toggle("open");
    this.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.getElementById("shareBtn").addEventListener("click", function () {
    var date = state.bulletin && state.bulletin.date;
    var url = location.origin + location.pathname + (date ? "?tarih=" + date : "");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () { toast("Link kopyalandı"); },
        function () { prompt("Linki kopyalayın:", url); });
    } else { prompt("Linki kopyalayın:", url); }
  });

  function renderArchive(active) {
    var html = state.index.map(function (b) {
      return '<li><a href="?tarih=' + b.date + '" class="' + (b.date === active ? "active" : "") + '">' +
        '<div class="a-date">' + esc(fmtDate(b.date, true)) + '</div>' +
        '<div class="a-meta">' + b.articleCount + ' içerik · ' + (b.edition === "daily" ? "Tam" : "Seçki") + '</div></a></li>';
    }).join("");
    document.getElementById("archiveList").innerHTML = html || '<li class="empty">Henüz bülten yok.</li>';
  }

  function articleHTML(a) {
    var regionCls = a.region === "Türkiye" ? "tr" : "gl";
    var tags = '<span class="pill ' + regionCls + '">' + esc(a.region) + '</span>' +
      '<span class="pill accent">' + esc(a.category) + '</span>' +
      (a.label ? '<span class="pill warn">' + esc(a.label) + '</span>' : "");
    var body = (a.body || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    var sources = (a.sources || []).map(function (s) {
      return '<li><a href="' + esc(safeUrl(s.url)) + '" target="_blank" rel="noopener">' + esc(s.name) + '</a>' +
        '<span class="s-meta">' + esc(s.published) + ' · ' + esc(s.country) + ' · ' + esc(s.language) + '</span></li>';
    }).join("");
    return '<article class="card" id="' + esc(a.id) + '">' +
      '<div class="card-main">' +
        '<div class="card-tags">' + tags + '</div>' +
        '<h3>' + esc(a.title) + '</h3>' +
        '<div class="when">' + esc(a.market) + ' · ' + esc(a.eventDate) + '</div>' +
        '<p class="summary">' + esc(a.summary) + '</p>' +
      '</div>' +
      '<details><summary>Detay, planlama etkisi ve kaynaklar</summary><div class="detail">' +
        '<div class="block"><h4>Gelişme</h4>' + body + '</div>' +
        '<div class="block callout"><h4>Planner/Buyer açısından</h4><p>' + esc(a.impact) + '</p></div>' +
        '<div class="block callout"><h4>Takip / aksiyon</h4><p>' + esc(a.action) + '</p></div>' +
        '<div class="block counter"><h4 lang="en">Counter-View</h4><p>' + esc(a.counterView) + '</p></div>' +
        (a.learning ? '<div class="block learn"><h4>Öğrenme notu</h4><p>' + esc(a.learning) + '</p></div>' : "") +
        '<div class="block"><h4>Kaynaklar</h4><ul class="sources">' + sources + '</ul></div>' +
      '</div></details>' +
    '</article>';
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
        (!state.category || a.category === state.category);
    });
    var html = "";
    ["Türkiye", "Global"].forEach(function (region) {
      var group = arts.filter(function (a) { return a.region === region; });
      if (!group.length) return;
      group.sort(function (x, y) {
        return CATEGORY_ORDER.indexOf(x.category) - CATEGORY_ORDER.indexOf(y.category);
      });
      html += '<div class="region-head ' + (region === "Türkiye" ? "tr" : "gl") + '"><h2>' + region +
        '</h2><span>' + group.length + ' içerik</span></div>' + group.map(articleHTML).join("");
    });
    document.getElementById("articles").innerHTML = html || '<p class="empty">Bu filtrede içerik yok.</p>';
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

  function renderBulletin(b) {
    state.bulletin = b; state.region = "Tümü"; state.category = null;
    document.title = fmtDate(b.date) + " · Media Guide Daily";
    var rv = REVIEW_LABEL[(b.review || {}).status] || REVIEW_LABEL.not_reviewed;
    var highlights = (b.highlights || []).map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("");
    $main.innerHTML =
      '<header class="issue-head">' +
        '<div class="issue-date">' + esc(fmtDate(b.date, true)) + '</div>' +
        '<h1 class="issue-title">' + esc(b.title) + '</h1>' +
        '<p class="issue-summary">' + esc(b.summary) + '</p>' +
        '<div class="meta-row">' +
          '<span class="pill">' + (b.edition === "daily" ? "Tam günlük tarama" : "Seçki, kapsam kısmi") + '</span>' +
          '<span class="pill ' + rv[1] + '">' + rv[0] + '</span>' +
          '<span class="pill">' + b.articles.length + ' içerik</span>' +
        '</div>' +
        '<div class="window"><strong>Tarama penceresi:</strong> ' + esc(b.window) + '</div>' +
      '</header>' +
      (highlights ? '<section class="highlights"><h2>Öne çıkanlar</h2><ul>' + highlights + '</ul></section>' : "") +
      '<div id="filters"></div><div id="articles"></div>' +
      '<section class="closing">' +
        listBlock("Watchlist", b.watchlist, true) +
        listBlock("Düzeltmeler", b.corrections, true) +
        listBlock("Eksik ve doğrulanamayan kontroller", b.limitations, false) +
        (b.review && b.review.summary ? listBlock("Denetim notu", [b.review.summary], false) : "") +
        (b.proposal ? '<div class="proposal"><strong>Öneri:</strong> ' + esc(b.proposal) + '</div>' : "") +
      '</section>';
    renderFilters(); bindFilters(); renderArticles();
    if (location.hash) {
      var el = document.getElementById(location.hash.slice(1));
      if (el) { var d = el.querySelector("details"); if (d) d.open = true; el.scrollIntoView(); }
    }
  }

  function load() {
    getJSON("bulletins/index.json").then(function (idx) {
      state.index = idx.bulletins || [];
      var date = currentDate() || (state.index[0] && state.index[0].date);
      renderArchive(date);
      if (!date) { $main.innerHTML = '<p class="empty">Henüz yayımlanmış bülten yok.</p>'; return; }
      return getJSON("bulletins/" + date + ".json").then(function (b) {
        if (b.status !== "published") throw new Error("draft");
        renderBulletin(b);
      }).catch(function () {
        $main.innerHTML = '<p class="empty">' + esc(fmtDate(date)) + ' tarihli yayımlanmış bülten bulunamadı. Arşivden başka bir gün seçebilirsiniz.</p>';
      });
    }).catch(function () {
      $main.innerHTML = '<p class="empty">Arşiv yüklenemedi. Sayfayı yenilemeyi deneyin.</p>';
    });
  }

  load();
})();
