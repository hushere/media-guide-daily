# Media Guide Daily — bağımsız görünüm denemesi

Adres: https://hushere.github.io/media-guide-daily/deneme/

Bu çalışma yalnız `deneme/` altına dosya ekler. Ana sitenin HTML, CSS, JS, veri dosyaları ve iş akışları değiştirilmez.

## Korunan orijinal

Başlangıç sürümü: `2e38b2c4b34b80059ccdb86138bbd17c02a39de6`.
O sürümdeki üç arayüz dosyasının birebir kopyası `original/` içinde tutulur. Bu klasör çalıştırılabilir ikinci site değil, kaynak yedeğidir; veri ve bağıl adresleri değiştirilmemiştir. Ana site kendi adresinde çalışmayı sürdürür.

## İçerik ve görünüm

Deneme, `../bulletins/index.json` ve aynı klasördeki tarihli JSON dosyalarını salt okunur biçimde kullanır. Yeni bülten indeksine eklenen içerik sayfa yenilendiğinde burada da görünür. Ayrı bülten üretmez veya yayımlamaz.

Ana sitenin haber çizim işlevleri korunmuştur: tüm haberler, Türkiye/Global grupları, metinler, analizler, kaynaklar, maçlar, sosyal gündem, haftalık alan, izleme listesi, düzeltmeler ve kısıtlar mevcut veriyle gösterilir. İlk üç haber yalnız ek hareketli özet için seçilir; tam akıştan çıkarılmaz. Detaylar tek tek veya topluca açılabilir. Filtre, arama, tarihli arşiv, paylaşım ve kayıt işlevleri korunur.

Denemenin kayıt, tema ve okundu bilgileri `mg-trial-` anahtarlarını kullanır. Üretim ziyaret sayacı denemede yüklenmez.

## Hareketli özet

Hyperframes Player 0.8.181 ve GSAP 3.12.5, yalnız kullanıcı özeti açınca jsDelivr üzerinden yüklenir. HTML kompozisyonu mevcut haber başlıklarından oluşturulur, başlık başına 20 saniyedir. Ses yoktur; oynatma kullanıcı kontrolündedir, otomatik başlamaz. Harici servis yüklenemezse okuma modu gösterilir. Tam haber akışı bu bağımlılıklardan bağımsızdır. MP4 üretimi, ücretli API ve yeni günlük otomasyon eklenmemiştir.

## Geri alma

Denemeyi kaldırmak için yalnız `deneme/` klasörünü silmek yeterlidir. Ana siteye geçiş üst şeritteki bağlantıyla yapılır. Deneme kodu ana siteye otomatik taşınmaz.
