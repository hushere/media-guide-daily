(function () {
  'use strict';
  function esc(v) { return String(v || '').replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function url(v) { try { var u = new URL(v); return u.protocol === 'https:' ? u.href : ''; } catch (_) { return ''; } }
  window.mountMediaEditorial = function (b) {
    var root = document.getElementById('main');
    var host = document.getElementById('articles');
    var articles = b.articles || [];
    if (!articles.length) return;
    var engine = null, disabled = false, pending = false, active = null, allOpen = false;
    var reduced = matchMedia('(prefers-reduced-motion: reduce)');
    try { disabled = localStorage.getItem('mg-trial-motion') === 'off'; } catch (_) {}
    var hero = root.querySelector('.hero-copy');
    hero.querySelector('h1').innerHTML = 'Medyanın bugününe<br><em>yakından bak.</em>';
    hero.insertAdjacentHTML('beforeend', '<div class="editorial-entry"><a href="#articles">Tüm haberleri oku <span aria-hidden="true">↗</span></a><span><strong data-sc-count="0 ' + articles.length + '">' + articles.length + '</strong> kaynaklı gelişme</span><button type="button" class="text-btn" id="motionToggle" aria-pressed="false">Hareketi kapat</button></div>');
    var lead = articles.find(function (a) { return a.image && url(a.image.url); }) || articles[0];
    var feature = document.createElement('section');
    feature.className = 'editorial-lead';
    feature.setAttribute('data-sc-act', 'flow');
    feature.setAttribute('aria-label', 'Gündeme yakından bakış');
    var image = lead.image && url(lead.image.url);
    feature.innerHTML = '<div class="lead-story"><span class="lead-label">' + esc(lead.region) + ' / ' + esc(lead.category) + '</span><h2>' + esc(lead.title) + '</h2><p>' + esc(lead.summary) + '</p><a class="lead-link" href="#' + esc(lead.id) + '">Haberi ve kaynakları oku ↗</a></div>' +
      '<div class="lead-media">' + (image ? '<figure><div class="lead-photo"><img data-sc-parallax="-0.7" src="' + esc(image) + '" alt="' + esc(lead.image.alt || lead.title) + '"></div><figcaption>' + esc(lead.image.credit || lead.image.source || 'Haberdeki kaynak görseli') + '</figcaption></figure>' : '<div class="lead-letter" aria-hidden="true" data-sc-parallax="-0.5">MG</div>') + '<div class="lead-insight"><span>Planlama açısından</span><p>' + esc(lead.impact) + '</p></div></div><div class="chapter-rule" aria-hidden="true" data-sc-reveal="left" data-sc-reveal-at="0.05 0.35"></div>';
    hero.after(feature);
    feature.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('error', function () { this.closest('figure').hidden = true; feature.classList.add('without-image'); });
      img.addEventListener('load', function () { if (engine) engine.layout(); });
    });
    root.querySelector('.hero-row').setAttribute('data-sc-in', '');
    var toc = document.createElement('nav');
    toc.className = 'story-index'; toc.setAttribute('aria-label', 'Haber dizini');
    toc.innerHTML = '<h3>Bu sayının haberleri</h3>' + articles.map(function (a) { return '<a href="#' + esc(a.id) + '" data-story="' + esc(a.id) + '">' + esc(a.title) + '</a>'; }).join('');
    root.querySelector('.discover').appendChild(toc);
    var companion = document.createElement('section');
    companion.className = 'reading-companion'; companion.setAttribute('aria-label', 'Okuma eşlikçisi');
    companion.innerHTML = '<span class="companion-label">OKUDUĞUN HABERDEN</span><h2>Planına taşı.</h2><p class="companion-title"></p><div class="companion-action"></div><button class="btn" type="button">Aksiyonu kopyala</button><p class="copy-status" role="status"></p>';
    root.querySelector('.radar').prepend(companion);
    var copyStatus = companion.querySelector('.copy-status');
    companion.querySelector('button').onclick = function () {
      if (!active) return;
      var link = new URL(location.href); link.searchParams.set('tarih', b.date); link.hash = active.id;
      var text = active.title + '\n\n' + active.action + '\n\n' + link.href;
      if (!navigator.clipboard) { copyStatus.textContent = 'Kopyalama kullanılamıyor. Metni seçerek kopyalayabilirsin.'; return; }
      navigator.clipboard.writeText(text).then(function () { copyStatus.textContent = 'Aksiyon ve haber bağlantısı kopyalandı.'; }, function () { copyStatus.textContent = 'Kopyalanamadı. Metni seçerek kopyalayabilirsin.'; });
    };
    var readingTools = document.createElement('div'); readingTools.className = 'reading-tools';
    readingTools.innerHTML = '<span>Tam metin, analiz ve kaynaklar</span><button class="btn" type="button" aria-pressed="false">Tüm detayları aç</button>';
    host.before(readingTools);
    function applyOpen() { host.querySelectorAll('article details').forEach(function (d) { d.open = allOpen; }); }
    readingTools.querySelector('button').onclick = function () { allOpen = !allOpen; this.setAttribute('aria-pressed', String(allOpen)); this.textContent = allOpen ? 'Detayları kapat' : 'Tüm detayları aç'; applyOpen(); if (engine) engine.layout(); };
    function update() {
      pending = false;
      var cards = Array.from(host.querySelectorAll('article'));
      var chosen = cards.find(function (card) { var r = card.getBoundingClientRect(); return r.bottom > 150 && r.top < innerHeight * .6; });
      if (!chosen) return;
      var next = articles.find(function (a) { return a.id === chosen.id; });
      if (!next || next === active) return;
      active = next;
      companion.querySelector('.companion-title').textContent = active.title;
      companion.querySelector('.companion-action').textContent = active.action || 'Bu haber için ayrı bir aksiyon belirtilmemiş.';
      copyStatus.textContent = '';
      toc.querySelectorAll('a').forEach(function (a) { if (a.dataset.story === active.id) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
    }
    function queue() { if (!pending) { pending = true; requestAnimationFrame(update); } }
    addEventListener('scroll', queue, {passive:true});
    addEventListener('resize', queue, {passive:true});
    toc.addEventListener('click', function (e) {
      var link = e.target.closest('a'); if (!link) return;
      if (!document.getElementById(link.dataset.story)) {
        var search = document.getElementById('search'); search.value = ''; search.dispatchEvent(new Event('input', {bubbles:true}));
        var all = root.querySelector('[data-region="Tümü"]'); if (all) all.click();
        var selected = root.querySelector('[data-cat][aria-pressed="true"]'); if (selected) selected.click();
      }
    });
    new MutationObserver(function () { if (allOpen) applyOpen(); queue(); if (engine) engine.layout(); }).observe(host, {childList:true});
    host.addEventListener('toggle', function () { if (engine) engine.layout(); }, true);
    var toggle = document.getElementById('motionToggle');
    function setMotion() {
      if (engine) { engine.destroy(); engine = null; }
      var off = disabled || reduced.matches;
      root.classList.toggle('motion-off', off);
      toggle.textContent = off ? 'Hareketi aç' : 'Hareketi kapat';
      toggle.setAttribute('aria-pressed', String(!off));
      toggle.disabled = reduced.matches;
      if (reduced.matches) toggle.textContent = 'Azaltılmış hareket';
      if (!off && window.ScrollCraft) engine = ScrollCraft.mount(root);
    }
    toggle.onclick = function () { disabled = !disabled; try { localStorage.setItem('mg-trial-motion', disabled ? 'off' : 'on'); } catch (_) {} setMotion(); };
    reduced.addEventListener('change', setMotion);
    setMotion();
    active = articles[0];
    companion.querySelector('.companion-title').textContent = active.title;
    companion.querySelector('.companion-action').textContent = active.action || '';
    queue();
  };
})();
