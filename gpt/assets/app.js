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


  function points(items) { return '<ul class="quick-points">' + items.map(function(t) {return '<li>' + esc(t) + '</li>';}).join('') + '</ul>'; }
  function articleHTML(a) {
    var tags = '<span class="pill ' + (a.region === "Türkiye" ? "tr" : "gl") + '">' + esc(a.region) + '</span><span class="pill accent">' + esc(a.category) + '</span>' + (a.label ? '<span class="pill warn">' + esc(a.label) + '</span>' : '');
    var img = a.image && safeUrl(a.image.url) !== "#" ? a.image : null;
    var media = img ? '<figure class="news-visual"><img src="' + esc(img.url) + '" alt="' + esc(img.alt || a.title) + '" width="800" height="450" loading="lazy" decoding="async" referrerpolicy="no-referrer"><figcaption><a href="' + esc(safeUrl(img.sourceUrl)) + '" target="_blank" rel="noopener noreferrer">Görsel: ' + esc(img.credit) + ' ↗</a></figcaption></figure>' : '<div class="type-visual" aria-hidden="true"><span>MEDIA GUIDE</span><strong>' + esc(a.category) + '</strong></div>';
    var sources = (a.sources || []).map(function(s) { return '<li><a href="' + esc(safeUrl(s.url)) + '" target="_blank" rel="noopener noreferrer">' + esc(s.name) + ' ↗</a><span class="s-meta">' + esc(s.published) + ' · ' + esc(s.country) + ' · ' + esc(s.language) + '</span></li>'; }).join('');
    var related = (a.related || []).filter(function(r) {return /^\d{4}-\d{2}-\d{2}$/.test(r.date) && /^[a-z0-9-]+$/.test(r.id);}).map(function(r) {return '<a href="?tarih=' + r.date + '#' + r.id + '">' + esc(r.title) + ' →</a>';}).join('');
    return '<article class="card" id="' + esc(a.id) + '">' + media + '<div class="card-main"><div class="card-tags">' + tags + '</div><h3>' + esc(a.title) + '</h3><p class="summary">' + esc(a.summary) + '</p><div class="quick-read"><section><h4>Ne oldu?</h4>' + points((a.body || []).slice(0,3)) + '</section><section class="quick-impact"><h4>Medya etkisi</h4>' + points([a.impact]) + '</section><section class="quick-action"><h4>Ne yapmalı?</h4>' + points([a.action]) + '</section></div></div><details><summary>Detayı oku <span aria-hidden="true">＋</span></summary><div class="detail"><div class="when">' + esc(a.market) + ' · ' + esc(a.eventDate) + '</div>' + ((a.body || []).length > 3 ? '<div class="block">' + points(a.body.slice(3)) + '</div>' : '') + '<div class="block counter"><h4>Counter-View</h4><p>' + esc(a.counterView) + '</p></div>' + (a.learning ? '<div class="block learn"><h4>Öğrenme notu</h4><p>' + esc(a.learning) + '</p></div>' : '') + '<div class="block"><h4>Kaynaklar ve tarihler</h4><ul class="sources">' + sources + '</ul></div>' + (related ? '<div class="related"><h4>Önceki sayıyla bağlantı</h4>' + related + '</div>' : '') + '</div></details></article>';
  }

  function socialHTML(b) {
    var s=b.social;
    if (!s || !s.items || !s.items.length) return '<section class="social-strip" id="sosyal"><h2>Sosyal medyada gündem</h2><p class="muted">Bu sayıda yayımlanabilecek doğrulanmış platform verisi bulunmuyor.</p><p class="social-note">' + esc(s && s.note || 'Kapsam notlarını kontrol edin.') + '</p></section>';
    return '<section class="social-strip" id="sosyal" aria-labelledby="social-title"><div class="section-title"><div><span class="eyebrow">Dijital radar</span><h2 id="social-title">Sosyal medyada gündem</h2></div><span class="pill">Öne çıkan içerikler</span></div><p class="social-window">' + esc(s.window) + '</p><div class="social-grid">' + s.items.slice(0,8).map(function(it) {return '<article class="social-card"><span class="eyebrow">' + esc(it.platform) + ' · ' + esc(it.country || "Türkiye") + '</span><h3>' + (Number.isInteger(it.rank) ? '<span class="social-rank">#' + it.rank + '</span> ' : '') + esc(it.title) + '</h3>' + (it.metric ? '<p class="social-metric">' + esc(it.metric) + '</p>' : '') + points([it.whyItMatters].concat(it.action ? [it.action] : [])) + '<details><summary>Dönem ve kaynak</summary><p>' + esc(it.published) + '</p><p>' + esc(it.checkedAt || '') + '</p><p>' + esc(it.type) + ' · ' + esc(it.measurementWindow || s.window) + '</p><a href="' + esc(safeUrl(it.url)) + '" target="_blank" rel="noopener noreferrer">' + esc(it.source) + ' ↗</a></details></article>';}).join('') + '</div><p class="social-note">' + esc(s.note) + '</p></section>';
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
        '</h2><span>' + group.length + ' içerik</span></div>' + '<div class="article-grid">' + group.map(articleHTML).join("") + '</div>';
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

  function matchesHTML(b) {
    var matches = (b.matches || []).slice().sort(function (a, c) {
      return (a.date + (a.time || "99:99")).localeCompare(c.date + (c.time || "99:99"));
    });
    return '<aside class="match-panel" aria-labelledby="matches-title"><div class="match-heading"><div><span class="eyebrow">Spor takvimi · Türkiye saati</span><h2 id="matches-title">Haftanın karşılaşmaları</h2></div><span class="pill">' + matches.length + ' maç</span></div><p class="match-period">' + esc(b.matchesWindow || 'Güncel maç takvimi') + '</p><div class="match-list" tabindex="0" aria-label="Maç listesi">' +
      (matches.length ? matches.map(function (m) {
        return '<div class="match-row"><div class="match-date"><time datetime="' + esc(m.date) + '">' + esc(fmtDate(m.date).replace(/ \d{4}$/, '')) + '</time><strong>' + esc(m.time || 'Saat teyitsiz') + '</strong></div><div class="match-info"><span class="match-tournament">' + esc(m.sport) + ' · ' + esc(m.competition) + '</span><h3>' + esc(m.home) + ' <span>–</span> ' + esc(m.away) + '</h3><p class="match-broadcaster">Yayın: ' + esc(m.broadcaster || 'Teyit bekleniyor') + '</p>' + (m.note ? '<p class="match-note">' + esc(m.note) + '</p>' : '') + '<details><summary>Kaynaklar ve planlama etkisi</summary><p>' + esc(m.impact) + '</p>' + (m.sources || []).map(function (source) {return '<a href="' + esc(safeUrl(source.url)) + '" target="_blank" rel="noopener">' + esc(source.name) + ' ↗</a>';}).join(' · ') + '</details></div></div>';
      }).join('') : '<p class="empty">Bu sayı için doğrulanmış maç kaydı bulunmuyor.</p>') + '</div><p class="match-footnote">' + esc(b.matchNote || 'Saat ve yayıncı bilgileri değişebilir. Son kontrol kaynaklarını açın.') + '</p></aside>';
  }

  function renderBulletin(b) {
    state.bulletin = b; state.region = "Tümü"; state.category = null; state.query = "";
    document.title = fmtDate(b.date) + " · Media Guide Daily GPT";
    var rv = REVIEW_LABEL[(b.review || {}).status] || REVIEW_LABEL.not_reviewed;
    var highlights = (b.highlights || []).map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("");
    $main.innerHTML =
      '<section class="hero"><div class="hero-copy">' +
        '<div class="eyebrow">Daily Media Intelligence <span class="pill">' + (b.edition === "daily" ? "Günlük bülten" : "Editörün seçkisi") + '</span></div>' +
        '<h1>' + esc(b.title) + '</h1>' +
        '<p class="hero-intro">' + esc(b.summary) + '</p><p class="cutoff">' + esc(b.window) + '</p>' +
        '<div class="hero-meta">' + esc(fmtDate(b.date)) + ' <span>·</span> ' + b.articles.length + ' gelişme</div>' +
      '</div></section><section class="briefing-grid" aria-label="Sayı özeti ve maç takvimi"><aside class="highlights"><h2>Bu sayıda</h2><ol>' + highlights + '</ol><p>Kaynaklı bilgi. Net planlama etkisi. <span aria-hidden="true">↗</span></p></aside>' + matchesHTML(b) + '</section>' +
      socialHTML(b) + '<nav class="section-nav" aria-label="Bu sayıda gezin"><a href="#sosyal">Sosyal gündem</a><a href="#matches-title">Maç takvimi</a><a href="#articles">Haberler</a><a href="#radar">Takip listesi</a></nav>' +
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
      '</section></section><aside class="radar" id="radar"><span class="eyebrow">Radarda</span><h2>Sırada ne var?</h2><p class="muted">Kararları değiştirebilecek sinyaller.</p><ol>' +
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
      if (!date) { $main.innerHTML = '<p class="empty">Henüz yayımlanmış bülten yok. ChatGPT ilk bülteni yayımladığında burada görünecek.</p>'; return; }
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

  document.addEventListener("error", function(e) {
    if(e.target.tagName === "IMG" && e.target.closest(".news-visual")) {
      var figure=e.target.closest(".news-visual");
      e.target.remove();
      figure.classList.add("image-unavailable");
      var note=document.createElement("p");
      note.textContent="Görsel yüklenemedi. Kaynak bağlantısından açabilirsiniz.";
      figure.prepend(note);
    }
  }, true);
  load();
})();

