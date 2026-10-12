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
        '<div class="impact-preview"><h4>Planlama etkisi</h4><p>' + esc(a.impact) + '</p></div>' +
        '<div class="source-preview">' + esc((a.sources || []).length ? a.sources[0].name : 'Kaynak belirtilmedi') + ' · ' + (a.sources || []).length + ' kaynak</div>' +
      '</div>' +
      '<details><summary>Analizi oku <span aria-hidden="true">↗</span></summary><div class="detail">' +
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
        (!state.category || a.category === state.category) &&
        (!state.query || [a.title, a.summary, a.impact, a.category].join(" ").toLocaleLowerCase("tr").includes(state.query));
    });
    document.getElementById("resultCount").textContent = arts.length + " kaynaklı gelişme";
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
    var hidden = (body.match(/fx-extra/g) || []).length;
    var more = hidden ? '<button type="button" class="fx-more" onclick="this.closest(\'.fixtures\').classList.add(\'show-all\');this.remove()">Tüm maçlar (' + rows + ') ↓</button>' : "";
    return '<aside class="fixtures" aria-labelledby="fxTitle"><div class="fx-head"><span class="eyebrow">Spor takvimi</span>' +
      '<h2 id="fxTitle">Haftanın önemli maçları</h2>' + (b.matchesWindow ? '<p>' + esc(b.matchesWindow) + ' · Türkiye saati</p>' : '') + '</div>' +
      body + more + '<p class="fx-foot">Tarih, saat ve yayıncı resmî kaynaklardan alınır; teyit edilemeyenler işaretlidir.</p></aside>';
  }

  function renderBulletin(b) {
    state.bulletin = b; state.region = "Tümü"; state.category = null;
    document.title = fmtDate(b.date) + " · Media Guide Daily";
    var rv = REVIEW_LABEL[(b.review || {}).status] || REVIEW_LABEL.not_reviewed;
    var highlights = (b.highlights || []).map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("");
    var fixtures = fixturesHTML(b);
    $main.innerHTML =
      '<section class="hero' + (fixtures ? '' : ' no-fixtures') + '"><div class="hero-left"><div class="hero-copy">' +
        '<div class="eyebrow">Daily Media Intelligence <span class="pill">' + (b.edition === "daily" ? "Günlük bülten" : "Editörün seçkisi") + '</span></div>' +
        '<h1>Gündemi oku. <em>Etkisini gör.</em></h1>' +
        '<div class="hero-meta">' + esc(fmtDate(b.date, true)) + ' <span>·</span> ' + b.articles.length + ' gelişme</div>' +
      '</div><aside class="highlights"><h2>Bu sayıda</h2><ol>' + highlights + '</ol><p>Kaynaklı bilgi. Net planlama etkisi. <span aria-hidden="true">↗</span></p></aside></div>' +
      fixtures + '</section>' +
      '<div class="edition-bar"><span>■ &nbsp; Editörün seçkisi <span class="edition-date">' + esc(fmtDate(b.date)) + '</span></span><button class="text-btn" id="allIssues">Tüm sayılar &nbsp; →</button></div>' +
      '<div class="reading-layout"><aside class="discover"><h2>Keşfet</h2><div id="filters"></div>' +
        '<div class="discover-note"><span class="eyebrow">Daha iyi kararlar için</span><p>Haberin ötesinde,<br>medya etkisine bak.</p><a href="#yontem">Yaklaşımımız ↗</a></div></aside>' +
      '<section class="feed"><div class="feed-head"><div><h2>Öne çıkan gelişmeler</h2><p id="resultCount" role="status"></p></div><input type="search" id="search" aria-label="Bu bültende ara" placeholder="Bu bültende ara…"></div>' +
      '<details class="issue-context"><summary>Bu sayının kapsamı ve denetimi <span class="pill ' + rv[1] + '">' + rv[0] + '</span></summary><div><h3>' + esc(b.title) + '</h3><p>' + esc(b.summary) + '</p><p><strong>Tarama penceresi:</strong> ' + esc(b.window) + '</p></div></details>' +
      '<div id="articles"></div><section class="closing">' +
        listBlock("Düzeltmeler", b.corrections, true) +
        listBlock("Eksik ve doğrulanamayan kontroller", b.limitations, false) +
        (b.review && b.review.summary ? listBlock("Denetim notu", [b.review.summary], false) : "") +
        (b.proposal ? '<div class="proposal"><strong>Öneri:</strong> ' + esc(b.proposal) + '</div>' : "") +
      '</section></section><aside class="radar"><span class="eyebrow">Radarda</span><h2>Sırada ne var?</h2><p class="muted">Kararları değiştirebilecek sinyaller.</p><ol>' +
        (b.watchlist || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') +
      '</ol><div class="share-card"><h3>İyi bilgi paylaştıkça değerli.</h3><p>Bu sayıyı ekibinizle paylaşın. Üyelik gerektirmez.</p><button class="btn" id="shareIssue">Bağlantıyı kopyala ↗</button></div></aside></div>';
    document.getElementById("allIssues").addEventListener("click", function () { document.getElementById("archive").showModal(); });
    document.getElementById("shareIssue").addEventListener("click", function () { document.getElementById("shareBtn").click(); });
    document.getElementById("search").addEventListener("input", function () { state.query = this.value.trim().toLocaleLowerCase("tr"); renderArticles(); });
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
