(function () {
  'use strict';
  function esc(v) { return String(v || '').replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function composition(articles, date) {
    var duration = articles.length * 20;
    var scenes = articles.map(function (a, i) {
      return '<section class="scene" id="s' + i + '"><div class="label">MEDIA GUIDE DAILY / ' + esc(date) + '</div><div class="number">0' + (i + 1) + ' / 0' + articles.length + '</div><div class="category">' + esc(a.region) + ' · ' + esc(a.category) + '</div><h1>' + esc(a.title) + '</h1><div class="bottom">Gündemden bir başlık <span>Tam haber ve kaynaklar sayfada ↓</span></div></section>';
    }).join('');
    return '<!doctype html><html lang="tr"><head><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#132b49;color:#fff;font-family:Arial,sans-serif}#stage{width:1280px;height:720px;position:relative}.scene{position:absolute;inset:0;padding:58px 64px;background:radial-gradient(ellipse at 100% 0%,#315b6c 0%,#132b49 65%);opacity:0}.scene:first-child{opacity:1}.label{font-size:17px;letter-spacing:4px;color:#b8cec8}.number{position:absolute;right:64px;top:52px;color:#e6b48a;font-size:28px}.category{margin-top:90px;font-size:22px;color:#e6b48a}h1{font-size:52px;line-height:1.15;font-weight:500;letter-spacing:-1px;max-width:1120px;margin-top:26px;overflow-wrap:anywhere}.bottom{position:absolute;bottom:44px;left:64px;right:64px;border-top:1px solid #587084;padding-top:24px;font-size:18px;color:#c7d5e5}.bottom span{float:right}#progress{position:absolute;bottom:0;left:0;height:5px;background:#e6b48a;width:100%;transform-origin:left}</style></head><body><div id="stage" data-composition-id="brief" data-width="1280" data-height="720" data-start="0" data-duration="' + duration + '">' + scenes + '<div id="progress"></div></div><script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script><script>var tl=gsap.timeline({paused:true});' + articles.map(function (_, i) { return (i ? 'tl.to("#s' + (i - 1) + '",{opacity:0,duration:.5},' + (i * 20) + ');' : '') + 'tl.fromTo("#s' + i + '",{opacity:0,y:20},{opacity:1,y:0,duration:.8},' + (i * 20) + ');'; }).join('') + 'tl.fromTo("#progress",{scaleX:0},{scaleX:1,duration:' + duration + ',ease:"none"},0);window.__timelines={brief:tl};</script></body></html>';
  }
  window.mountMediaMotion = function (b) {
    var articles = (b.articles || []).slice(0, 3);
    if (!articles.length) return;
    var section = document.createElement('section');
    section.className = 'motion-brief';
    section.setAttribute('aria-label', 'Hareketli gündem özeti');
    section.innerHTML = '<div class="motion-stage"><div class="motion-cover"><small>GÜNDEM / HAREKETLİ ÖZET</small><h2>Medyanın gündemi.<br>Bir dakikalık bakış.</h2><p>' + articles.length + ' başlık · ' + (articles.length * 20) + ' saniye · Sessiz</p><button type="button" id="startMotion">▶ Özeti aç</button></div></div><div class="motion-index"><h2>Özetteki başlıklar</h2>' + articles.map(function (a, i) { return '<a href="#' + esc(a.id) + '"><span>0' + (i + 1) + ' / ' + esc(a.category) + '</span>' + esc(a.title) + '</a>'; }).join('') + '<p>Bu kısa seçkinin ardından ' + b.articles.length + ' haberin tamamı, analizler ve kaynaklar aşağıda.</p></div>';
    document.querySelector('.hero-copy').after(section);
    var tools = document.createElement('div');
    tools.className = 'reading-tools';
    tools.innerHTML = '<span>Okuma biçimini seç · Hiçbir haber eksiltilmedi</span><button class="btn" type="button" aria-pressed="false">Tüm detayları aç</button>';
    var allOpen = false;
    var articleHost = document.getElementById('articles');
    articleHost.before(tools);
    function applyOpen() { articleHost.querySelectorAll('article details').forEach(function (d) { d.open = allOpen; }); }
    tools.querySelector('button').onclick = function () { allOpen = !allOpen; this.setAttribute('aria-pressed', String(allOpen)); this.textContent = allOpen ? 'Detayları kapat' : 'Tüm detayları aç'; applyOpen(); };
    new MutationObserver(function () { if (allOpen) applyOpen(); }).observe(articleHost, {childList:true});
    document.getElementById('startMotion').onclick = function () {
      var button = this;
      button.disabled = true;
      button.textContent = 'Özet hazırlanıyor…';
      var stage = section.querySelector('.motion-stage');
      var timer;
      function fallback() {
        clearTimeout(timer);
        stage.innerHTML = '<div class="motion-cover"><small>GÜNDEM / OKUMA MODU</small><h2>Haberler burada.</h2><p>Hareketli özet yüklenemedi. Başlıklardan tam habere geçebilir, aşağıdaki tüm içeriği okuyabilirsin.</p></div>';
      }
      function mount() {
        var player = document.createElement('hyperframes-player');
        player.setAttribute('controls', '');
        player.setAttribute('muted', '');
        player.setAttribute('width', '1280');
        player.setAttribute('height', '720');
        player.setAttribute('aria-label', 'Günün üç başlığının hareketli özeti');
        player.setAttribute('srcdoc', composition(articles, b.date));
        player.addEventListener('ready', function () { clearTimeout(timer); });
        player.addEventListener('error', fallback);
        player.addEventListener('playbackerror', fallback);
        stage.replaceChildren(player);
      }
      timer = setTimeout(fallback, 20000);
      if (customElements.get('hyperframes-player')) { mount(); return; }
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@hyperframes/player@0.8.181/dist/hyperframes-player.global.js';
      script.onload = function () { customElements.whenDefined('hyperframes-player').then(mount); };
      script.onerror = fallback;
      document.head.appendChild(script);
    };
  };
})();
