# Media Guide Daily: Scroll-craft denemesi

Canlı adres: https://hushere.github.io/media-guide-daily/deneme/

Bu sürüm yalnız deneme/ altında çalışır. Ana site, haber JSON dosyaları, araştırma ve yayın otomasyonları değiştirilmez. Orijinal üç arayüz dosyasının birebir kopyası original/ içinde korunur. Başlangıç commit'i: 2e38b2c4b34b80059ccdb86138bbd17c02a39de6. original/ kaynak yedeğidir, bağıl veri yolları değiştirilmiş ikinci çalışan site değildir.

## Kaynak ve uygulama

https://github.com/nateherkai/scroll-craft reposunun Scroll-craft becerisi ve değiştirilmemiş engine/scrollcraft.js + engine/scrollcraft.css dosyaları kullanıldı. MIT lisansı vendor/LICENSE.scroll-craft dosyasındadır. Tasarım brief'i BRIEF.md içindedir.

Önceki Hyperframes/GSAP oynatıcısı kaldırıldı. Bu sürüm video veya ücretli API kullanmaz. Vendor dosyaları yerelden sunulur. Var olan haber görselleri, yazı tipleri ve kaynaklar kendi adreslerinden yüklenir.

## Deneyim

- Editoryal başlık sayfası ve tam akışa doğrudan geçiş.
- Gerçek haber görseli, başlık, özet ve planlama etkisinden oluşan asimetrik açılış.
- Scroll-craft'ın doğal akış, parallax, reveal ve gerçek içerik sayısı mekanizmaları.
- Tam haber akışında okuyucunun bulunduğu habere göre değişen aksiyon alanı. Aksiyon ve tarihli haber bağlantısı kopyalanabilir.
- Tüm detayları topluca açma, arama, filtreler, arşiv, kaydetme, paylaşım ve tema değişimi korunur.
- Hareketi kapatma ve işletim sisteminin azaltılmış hareket ayarına uyum.
- Mobilde tek sütun, sabit metin; yan panelde tekrarlanan aksiyon zaten haberin içinde bulunur.

## İçerik bütünlüğü

Deneme ../bulletins/index.json ve tarihli JSON dosyalarını salt okunur kullanır. Haber çizim işlevleri orijinalle aynıdır; tüm haberler, metinler, analizler, kaynaklar, spor, sosyal gündem, haftalık notlar, düzeltmeler ve sınırlamalar korunur. Başlangıçta tek bir haberin öne çıkarılması tam listeden içerik çıkarmaz. Ana indekse eklenen yeni sayılar sayfa yenilendiğinde burada da okunur.

Yerel kayıtlar mg-trial- anahtarlarında tutulur. Üretim ziyaret sayacı yüklenmez. Denemeyi kaldırmak için yalnız deneme/ klasörünü kaldırmak yeterlidir.

## Kontrol kapsamı

JavaScript sözdizimi ve ana haber çizim koduyla eşitlik kontrolü yapıldı. Tarayıcı doğrulaması canlı GitHub Pages üzerinde yapılır. Reponun shoot.mjs tarama aracı bu ortamın izin verdiği tarayıcı yüzeyi yerine ayrı Chrome gerektirdiği için kullanılmaz. Gerçek telefon donanımında test yapılmadı.
