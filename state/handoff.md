# Devir notu (bir sonraki çalışmanın hafızası)

Son güncelleme: 4 Kasım 2026 09:00, Claude (bülten 2026-11-04, ChatGPT paketi + Claude teyit)

## 1. Pencere
- Son bülten: 2026-11-04 (çarşamba) | ChatGPT paketi (research/2026-11-04.json, 7 ana + 4 sinyal, 07:40 cutoff); Claude 1 ana + 1 sinyal ekledi, 1 ana + 1 sinyal çıkardı; bilgi kesimi **4 Kasım 2026 07:40 TSİ**. Perşembe 5 Kasım penceresi 4 Kasım 07:40'tan başlar.
- Son bülten: 2026-11-03 (salı) | ChatGPT paketi (research/2026-11-03.json, 6 ana + 4 sinyal, 07:35 cutoff); Claude 1 ana + 1 sinyal ekledi; bilgi kesimi **3 Kasım 2026 07:35 TSİ**. Çarşamba 4 Kasım penceresi 3 Kasım 07:35'ten başlar.
- Son bülten: 2026-10-30 (cuma) | ChatGPT paketi (research/2026-10-30.json, 7 ana + 4 sinyal + sinema, 07:52 cutoff); bilgi kesimi **30 Ekim 2026 07:52 TSİ**. **Pazartesi 2 Kasım penceresi 30 Ekim 07:52'den başlar.**

## 1b. Haftanın gelişmeleri (cuma özeti için; cuma sonrası boşalt)
- 2 Kasım: yaş doğrulama 1 Kasım yürürlükte (yas-dogrulama-1-kasim-yururluk); Affle–Perion 420 milyon dolar (perion-affle-anlasma); Sevdam Karadeniz finali (sevdam-karadeniz-final).
- 3 Kasım: reklam geliri/%60 doluluk kulisi ve maç gecesi yeni bölüm arası (reklam-dolulugu-dizi-arasi-kulis); Sevdam Karadeniz bitti (sevdam-final-gerceklesti).
- 4 Kasım: maç gecesi kuralı genel değil, Show/NOW yeni bölümde (mac-gecesi-akis-ayristi); Publicis–LiveRamp kapanış ve tarafsızlık tartışması (publicis-liveramp-kapanis); Ekim TÜFE (tuik-ekim-tufe).

## 2. Ertesi güne bırakılan kontroller
- **5 Kasım per (önce bak):** 4 Kasım akşamı gerçekleşen yayınlar (Sevdan Bir Ateş 9, Yeraltı 21); 5 Kasım Halef, Muhtemel Aşk 20, Güneşin Doğduğu Yer 8, Sevdiğim Sensin; 10 Kasım akışı gelince Haysiyet, Anne Yarısı, Mehmed durumunu ve **Mehmed saatini** işle (data/tv-takvim.json: üçü status belirsiz, TKR kaldırıldı, Mehmed saatsiz); Tuzlu Kahve 3 Kasım hâlâ açık (GZT yok diyor, Star arşivi tarihsiz; Milli Gazete 3 Kasım için 10. bölüm bekliyordu, ChatGPT arşivi 3. bölüm diyor: bölüm numarası çelişkili); reklam geliri kulisi ölçülmüş veri; NOW 9 Kasım 20.00; Kızılcık 6 Kasım; Başkalarının Hayatı 7 Kasım; 15-18 yaş reklam hedeflemesi; Meta Commercial Terms 20 Kasım; Zor Baba 4 ve Godzilla dağıtımcı teyidi (cuma). **Pazartesi 9 Kasım:** tablo kayıtları (checked 22 Ekim: Altı Üstü İstanbul Cumartesi, Hamal, Bir Hayat Hikâyesi, Arka Sokaklar, Centilmen) † olur, tam yenileme gerek.
- 23 Ekim'de açık: Go Ahead protein bar reklam/raf görünürlüğü; PMax kaynak video Türkiye yayılımı; tüketici güveni TÜİK bülteni (yöntem); Little Caesars yeni mağaza/ajans açıklaması; OpenProposal nihai sürüm.
- TV takvimi (data/tv-takvim.json) 22 Ekim'de güncellenmedi (`tvTableUpdates` gelmedi).
- **Media Guru'larından Notlar (22 Ekim kararı):** Yalnız ChatGPT araştırır (Sharp, Bellman, Beal, Riebe, Nelson-Field; RESEARCH.md). `gurus` ve `guruCheck` gelirse biçim kontrolü yap ve yayımla, kendin araştırma yapma. Önemli yayın yoksa panel çıkmaz.
- **Dijital gündem (21 Ekim kararı):** Araştırma yalnız ChatGPT'de (`RESEARCH.md`). Claude araştırmaz, paket yoksa yedekte de araştırmaz. 22 Ekim paketinden itibaren `social.items[].market` ve `socialSourceReview` zorunlu/beklenen. `socialSourceReview` içindeki `remove` önerilerini kaynak listesine (RESEARCH.md) işle.
- **TV dizi takvimi tablosu (yeni, 21 Ekim):** data/tv-takvim.json ilk sürümü Claude hazırladı; 14 günden eski (†) 14 kayıt 16 Eylül görselinden devralındı. ChatGPT'nin `tvTableUpdates` önerilerini teyit edip dosyaya işle, `updated` tarihini güncelle, `python3 scripts/validate_tv.py` çalıştır. Çirkin, A.B.İ., Aşk ve Taht final yaptığı için tablodan çıkarıldı.
- Reyting takibi kapsam dışı (kullanıcı kararı); reyting araması yapma.
- Halk TV: yayın yeniden başladı mı, reklam satış/teslimat açıklaması var mı?
- Netflix Organize İşler: Karun Hazinesi yayına girişi; Lupin 4 (23 Ekim).
- Meta Commercial Terms metnini (30 Ekim) birincil kaynaktan aç.
- Sevdam Karadeniz ilk yayın tarihi resmî arşivde metin olarak görünmüyor; NOW gece yarısı kayıtlarında yayın günü/takvim tarihi ayrımı.
- ATV: Hamal, Cevher, Karakuyu için gün ataması; Bir Hayat Hikâyesi resmî açıklama.
- Netflix Q3 (20 Ekim): reklamlı paket, işten çıkarma teyidi (Puck raporu).
- Omnicom, Havas, WPP Q3 sonuçları bu hafta/sonraki hafta gelebilir.
- Ferrero 17 Ekim sonrası kabuklu fındık alım politikası (yerel haberler; maliyet sinyali).
- Yaş doğrulama: 1 Kasım yürürlük, 31 Mart 2027 mevcut hesaplar. Platform duyurularını izle.
- Güneşin Doğduğu Yer: 15 Ekim 5. bölüm ilk yayını arşivde görünmedi (arşivde son 8 Ekim/4); 16 Ekim 22.40 kaydı tekrar mı?
- Centilmen (NOW): Birsen Altuntaş çekim ertelemesi kulisi (16 Ekim); kanal teyidi bekleniyor.

## 3. TV takip tablosu
| Yapım | Kanal | Son durum | Kaynak/tarih |
|---|---|---|---|
| Sevdan Bir Ateş / Yeraltı | Show TV / NOW | 4 Kasım 20.00 FB–Liverpool akşamı yeni bölüm akışta (9. / 21. bölüm); gerçekleşme teyitsiz | Akışlar (ChatGPT) + Milli Gazete, GZT 4 Kasım |
| Haysiyet / Anne Yarısı / Mehmed | Kanal D / NOW / TRT 1 | 3 Kasım yeni bölüm yok; 10 Kasım dönüş teyitsiz; tabloda belirsiz | Paket 4 Kasım + GZT |
| Sevdam Karadeniz | NOW | **Final gerçekleşti (arşiv): 2 Kasım 21.45 akış; 20.00 film.** Tablodan kaldırıldı; 9 Kasım yerine geleni belirsiz | NOW arşivi (ChatGPT) + GZT, BirGün 2 Kasım |
| Tuzlu Kahve | Star | 3 Kasım çelişkili: Star akışı Yeni Bölüm, Altuntaş/Onedio/Haber Dijital yok; tablo değişmedi | ChatGPT + Birsen 2 Kasım |
| Kızılcık Şerbeti | Show TV | 30 Ekim 145. bölüm yayımlanmadı, tekrar; 6 Kasım 20.00 yeni bölüm. Gold Film gerekçesi: bayram haftası; reklam iddiası Birsen Altuntaş | Show akışı + Sözcü 30 Ekim |
| Susuz Yaz, Karakuyu | Kanal D | 2 Kasım tabloya Günü belirsiz eklendi | Kanal D sayfaları (ChatGPT) |
| Güneşin Doğduğu Yer | ATV | Fiilen yayında: 29 Ekim 7. bölüm sayfası (video oynatılmadı); tabloda checked 30 Ekim | ATV bölüm sayfası 30 Ekim (ChatGPT) |
| Muhtemel Aşk / Güldür Güldür | Show TV | 5 Kasım 20. bölüm / 31 Ekim tekrar, 7 Kasım yeni bölüm (değişmedi) | Show TV akışı 30 Ekim (ChatGPT) |
| Muhtemel Aşk | Show TV | 29 Ekim 20.00 yerine film 'Bir Cumhuriyet Şarkısı'; yeni bölüm 5 Kasım 20.00 | Show TV akışı 29 Ekim (ChatGPT) |
| Halef: Köklerin Çağrısı | NOW | 29 Ekim 20.00 yerine film 'Atatürk 2' | NOW akışı 29 Ekim (ChatGPT) |
| Güldür Güldür Show | Show TV | Yeni bölüm 7 Kasım 20.00 duyurusu; 31 Ekim yeni bölüm yok varsayımı | Show TV akışı 29 Ekim (ChatGPT) |
| Susuz Yaz / Karakuyu | Kanal D | Kanal teyitli 'Yakında'; tarih/gün yok | kanald.com.tr dizi sayfaları 29 Ekim (ChatGPT) |
| Sevdan Bir Ateş | Show TV | Fiilen yayında: 8. bölüm arşivde; çarşamba 20.00 | Show TV arşivi 29 Ekim (ChatGPT) |
| Güneşin Doğduğu Yer | ATV | Fiilen yayında: perşembe 20.00, 22 Ekim 6. bölüm sayfası; cuma 22.40 kaydı | ATV bölüm sayfası, 23 Ekim (ChatGPT) |
| Karakuyu | Kanal D | Kanal teyitli: ilk fragman (25 Ekim); sayfada 'Yakında', gün/tarih yok. Tabloya eklenmedi | Kanal D sayfası 26 Ekim (ChatGPT) + Birsen Altuntaş 25 Ekim |
| Mehmed: Fetihler Sultanı (saat) | TRT 1 | Dizi sayfası salı 20.00 gösteriyor (ChatGPT 26 Ekim); tabloda 21.30. Teyitsiz | trt1.com.tr dizi sayfası |
| Altı Üstü İstanbul | ATV | Fiilen yayında; pazartesi 20.00 | Onedio 13 Ekim |
| Sevdam Karadeniz | NOW | Fiilen yayında; pazartesi 20.00; 26 Ekim 3. bölüm akışta (Haber Gazetesi 24 Ekim). **Kulis: 4. bölümde final, 2 Kasım** (resmî teyitsiz); yapımcı 23 Ekim 'Perde kapanmadı' | NOW arşivi + Birsen Altuntaş 20 Ekim + Haber Gazetesi 24 Ekim |
| Mehmed: Fetihler Sultanı | TRT 1 | Kanal teyitli: 20 Ekim akışında 21.30, öncesinde 19.45 FB–Slavia | TRT 1 akışı 20 Ekim (ChatGPT) |
| Var Mısın Yok Musun | ATV | Kanal teyitli: 21 Ekim çarşamba 20.00 (akış + tanıtım); 20 Ekim gerçekleşmesi arşivde yok | ATV akışı + program sayfası 21 Ekim (ChatGPT) |
| Sevdan Bir Ateş | Show TV | 21 Ekim çarşamba 20.00 yeni bölüm (plan) | Show TV akışı 21 Ekim (ChatGPT) |
| Haysiyet | Kanal D | Salı 20.00; perşembe 23.15 tekrar | Kanal D akışı 15 Ekim |
| Uzak Şehir | Kanal D | 15 Ekim perşembe 20.00 "Tekrar" | Kanal D akışı 15 Ekim |
| Sevdiğim Sensin | Star | 15 Ekim 20.00 yeni bölüm | Star akışı 15 Ekim |
| MasterChef Türkiye | TV8 | 15 Ekim 20.00 yeni bölüm | TV8 akışı 15 Ekim |
| Güldür Güldür Show (14. sezon) | Show TV | 24 Ekim cmt 20.00 yeni bölüm planı; 17 Ekim dönüşü hâlâ teyitsiz | Show TV akışı 20 Ekim (ChatGPT) |
| Centilmen | NOW | Kulis: çekim ertelendi iddiası, tarih yok; politikam 7 Ekim: Ekim sonu set, yıl sonu yayın | Birsen Altuntaş 16 Ekim |
| Halk TV | Halk TV | 14 Ekim kayyum, yayın kesintisi; 19 Ekim'de yeniden yayın kaydı bulunamadı | Medyascope 14 Ekim |
| Bir Hayat Hikâyesi | ATV (iddia), önce Star | Kulis; tarih yok | Yeni Bakış 11 Ekim |
| A.B.İ. / Aşk ve Taht (ATV), Çirkin (Star) | | Final: 6 / 7 / 4 Ekim | Karar, Milli Gazete |
| ATV çarşamba 20.00 | ATV | Var Mısın Yok Musun | İlkses 14 Ekim |
| Organize İşler: Karun Hazinesi | Netflix | Fiilen yayında: 2026, 8 bölüm; TR haftalık dizi listesi 1. (12-18 Ekim). Lupin 4 → 23 Ekim | Netflix Tudum + başlık sayfası, 21 Ekim |

## 4. Spor (sonraki dönem için not)
- 4-8 Kasım panelde: Türk Telekom–Frankfurt, Legia–GS (yayıncı null), FB–Liverpool, Trabzonspor–Freiburg, Celtic–BJK (TRT 1), Efes–Paris 20.15, FB–Baskonia 21.00, BJK–Zalgiris 20.00, GS–BJK voleybol 8 Kasım 14.00.
- Hakları: TRT → UEFA kulüp maçları 2026-27 (TRT 1 şifresiz); EuroLeague S Sport Plus; BSL beIN; Süper Lig beIN.
- 15 Ekim: 19.45 KuPS–Trabzonspor (TRT 1), 20.45 Fenerbahçe–Partizan (S Sport Plus), 22.00 Hoffenheim–Beşiktaş (TRT 1). 16 Ekim: 20.00 Beşiktaş–Bayern, 20.00 Žalgiris–Efes (S Sport Plus). 18 Ekim 20.30 Beşiktaş–Galatasaray basketbol (yayıncı teyitsiz).
- 17-18 Ekim Süper Lig'de derbi yok. 19 Ekim pzt 20.00 Trabzonspor–Beşiktaş; 25 Ekim Barcelona–Real Madrid (saat teyitsiz); 26 Ekim pzt Galatasaray–Fenerbahçe; 25 Ekim voleybol: Fenerbahçe–Eczacıbaşı, VakıfBank–Galatasaray. Millî ara: 12-17 Kasım.
- 19 Ekim bülteni maç dönemi 19-25 Ekim yayımlandı. GS–FB 26 Ekim pzt 21:30 (TFF, İl Emniyet gerekçesi). EuroLeague: Efes–BJK 22 Ekim, Olympiacos–FB 23 Ekim 21:15. Voleybol 25 Ekim: VakıfBank–GS 14:00, FB–Eczacıbaşı 19:00 (tek kaynak).

## 5. Sinema (yalnız cuma kontrol edilir)
- **30 Ekim bildirildi:** Godzilla 6→13 Kasım (düzeltme, ana kart); 4 hafta → Hexe: Sihir Krallığı (27 Kasım, UIP); 3 hafta → Açlık Oyunları (20 Kasım), Aşk Tesadüfleri Sever 3 (20 Kasım, dağıtımcı teyitsiz); 2 hafta → Ebenezer (13 Kasım). Zor Baba 4 tarih çelişkisi nedeniyle bildirilmedi (watchlist). Sıradaki (6 Kasım): 4 Aralık 4 hafta, 27 Kasım 3 hafta, 20 Kasım 2 hafta.
- Bildirilen: 6 Kasım → Godzilla Minus Zero, Cinlerin Düğünü (tarih belirsiz) [4 hafta, 13 Ekim]. 9 Ekim sayısında (arşivde yok): Clayface, Çatlı 2, Şapkalı Kedi, Çakallarla Dans 8.
- 16 Ekim: 4 hafta → 13 Kasım Ebenezer (UIP), Av. Mahsun Karaca, Bir Banka Nasıl Soyulur. 3 hafta → Godzilla Minus Zero (Başka Sinema), Şapkalı Kedi (6 Kasım). 2 hafta → Çatlı 2 (30 Ekim).
- **23 Ekim bildirildi:** 4 hafta → Açlık Oyunları: Hasatta Gündoğumu (20 Kasım, Global Pictures); 3 hafta → Ebenezer (13 Kasım, UIP teyitli); 2 hafta → Şapkalı Kedi, Godzilla Minus Zero (6 Kasım). Bilet kampanyası yok.
- Sıradaki (30 Ekim cuma): 27 Kasım filmleri 4 hafta; 20 Kasım 3 hafta; 13 Kasım 2 hafta. Aşk Tesadüfleri Sever 3, Mahsun Karaca, Bir Banka Nasıl Soyulur, Cinlerin Düğünü tarih teyidi.

## 6. Kullanılmış yaratıcı vakalar (tekrar etme)
- ITV sessiz reklam kuşağı, Loose Women, BK 2023 (Cadbury, Aldi, Boots Hearingcare, McCain, HSL) (4 Kasım). Code of Silence sürümü (10 reklamveren) ayrıca kullanılmadı.
- KitKat Free No WiFi Zone, JWT Amsterdam, Hollanda 2012 (3 Kasım)
- KitKat masaj panosu, JWT Colombia, Bogota 2015 (2 Kasım)
- Snickers LIVE canlı Super Bowl reklamı, BBDO NY, ABD 2017 (30 Ekim)
- KitKat 'Have a Seat' oturulabilir pano bankları, JWT Amsterdam, Hollanda 2013 (29 Ekim)
- 28 Ekim: vaka yok (yedek; kaynaklar açılamadı).
- KitKat 'Break Billboards', VML Prague, boş pano dolgu deseni, Çekya 2026 (27 Ekim)
- 26 Ekim: vaka yok (yedek; doğrulanmış güçlü vaka bulunamadı).
- Cadbury Caramilk 'Just Ask An Aussie' canlı OOH panosu, VCCP, BK 2021 (23 Ekim)
- 22 Ekim: vaka yok (yedek; doğrulanmış güçlü vaka bulunamadı). Elenen adaylar: Galaxy yenilebilir billboard 2018 (ajans/sonuç teyitsiz), Reese's "Don't Eat Lava", Milka "Last Square".
- Maltesers / Channel 4 "Together Against Hate" (12 Ekim)
- Snickers "Hungerithm", Avustralya 2016 (13 Ekim)
- KitKat "Have a…" O2 DOOH, BK 2023 (14 Ekim)
- Cadbury Dairy Milk &More komşu ilanlar, VCCP, BK 2024 (15 Ekim)
- Cadbury "Undercover Eggs" kesilip katlanan basın ilanları, VCCP, BK 2026 (16 Ekim)
- Toblerone "Gift Outside the Box" (19 Ekim)
- Cadbury Secret Santa Postal Service, QR'lı OOH, VCCP, BK 2022 (20 Ekim)
- KitKat "Phone Break", VML Czechia, OOH+basın, Çekya 2025 (21 Ekim)

## 7. Kaynak erişimi
- 4 Kasım Claude oturumu: WebFetch **izin/zaman aşımı (PROVENANCE_REQUIRED)** — 7 kanal akışı (now, trt1, show, kanald, atv denendi), mediacat alt sayfaları (adidas, TTCC), gida2000, konyaseker, sec.gov, tuik. Aramadan sonra açılan: gzt, milligazete, ilkses, canlitv, ppc.land, cumhuriyet, digiday, haberturk, mediacat (Pierre Cardin), pierrecardin.com.tr, screenvoice, egta, mediaweekawards, aksiyon, ekovitrin, saraymedya, memleket, konhaber, sporx, bursadabugun, oyak.com.tr. Site hatası: mediapost. guard.py derinleştirilmiş klonda TEMİZ.
- 3 Kasım Claude oturumu: WebFetch **izin/zaman aşımı (PROVENANCE_REQUIRED)** — 7 kanal akışı, T-Mobile, shopfully, kevel, trthaber, businesswire, mediacat, marketingturkiye; ertesi gün yeniden dene. Açılan (arama sonucundan): birsenaltuntas.com, gzt, onedio, mynet, medyatilkisi, haberdijital, ilkses, aksam, birgun, yeniasir, milligazete, sec.gov, investing, SEJ, streamer.guide, adsoftheworld, popupcity. Site hatası: dunya.com. **guard.py sığ klonda yanlış UYARI verir** (tek commit tüm dosyaları "A" gösterir): önce `git fetch --deepen 15 origin main` çalıştır; 3 Kasım derinleştirilince TEMİZ çıktı.
- 2 Kasım Claude oturumu: WebFetch **izin/zaman aşımı (PROVENANCE_REQUIRED)** — nowtv, showtv, trt1 (3 sayfa), businesswire, medyatakip, aboutamazon, cumulusmedia, ssportplus, directnewideas, birsenaltuntas, ppc.land/x sayfası; ertesi gün yeniden dene. **Yeni yol: WebSearch'ün döndürdüğü URL'ler çoğu kez açılıyor** (sabah, onedio, milligazete, sozcu, ppc.land, thedesk, adweek, campaignlive, evrensel, erdem-erdem). Site hatası: teknoblog, ensonhaber, turkgun, bolgegundemi, fenerbahce.org. Önce arama, sonra sonuçtan açma izleyin.
- 30 Ekim Claude oturumu: WebFetch **izin/zaman aşımı (PROVENANCE_REQUIRED)** — wpp.com, mediacat, galatasaray.org, liverpoolfc.com, ssportplus.com; ertesi gün yeniden dene. Site hatası: campaignlive, internethaber. Açılan: yeniasir.com.tr, istiklal.com.tr, mediaweek.com.au. WebSearch güncel başlık döndürdü (WPP Q3, maç rehberleri).
- ChatGPT 23 Ekim: 7 kanal akışı, birsenaltuntas, TFF, TVF, VolleyStation, S Sport Plus, beIN, Box Office Türkiye, UIP, EuroLeague PDF, bjk.com.tr, Google Trends, Netflix Tudum açıldı. 403: tbf.org.tr, trtspor. Erişilemedi: ETİ, Ferrero TR, Şölen, Doğkar, Altınkılıçlar, Lider; zaman aşımı: Fiskobirlik; throttle: YouTube charts; JS: TikTok CC, Spotify, TÜİK veri portalı, realmadrid.com.
- render_check.py: 'Bu sayıda' kontrolü kaldırıldı (kutu 21 Ekim kullanıcı commit'i 8cae976 ile editorial.js'de bilinçli siliniyor; kontrol yanlış SORUN veriyordu).
- Site: 20 Ekim akşamı yeni galeri tasarımı (kare kapak + açılır pencere). render_check.py 21 Ekim'de `.story-cover` sayacak şekilde güncellendi.
- Kalıcı/alternatifli: uefa.com → kulüp siteleri; euroleaguebasketball.net, fenerbahce.org → Passo/kulüp; boxofficeturkiye.com → paribucineverse, sinemalar.com; top10.netflix.com, charts.youtube.com, TikTok Creative Center (JS/robots) → yok.
- Çalışan (önceki günler): mediacat.com, marketingturkiye.com.tr, campaigntr.com, onedio.com, globenewswire, digiday, mediapost, ppc.land, bestmediainfo, creativereview.co.uk.

## 8. Rakip izleme notları
- Tamek Sagra Grup (Tadelle, Sarelle): yeni genel koordinatör, 12 Ekim.
- Ferrero/Nutella "Bu Hikâyede Ekmek Var" turu (1 Ekim'den beri; 5 şehir).
- ETİ Benim'O: Alisa Sezen Sever'li film, 25 Eylül (bildirilmedi).
- Ülker: Lovemarks 2026; Godiva 100. yıl sanat koleksiyonu.
- Mars M&M's Minis/Cookie Dough + Marvel paketleri (13 Eylül, bildirilmedi).
- 14-15 Ekim: Sagra, Nestlé, Ferrero, Mondelez, Şölen, Altınmarka, Mars sayfaları kontrol edildi (ChatGPT); yeni Türkiye gelişmesi yok. ETİ, Torku, Fiskobirlik, Lider açılamadı.
- 16 Ekim: Altınmarka, ETİ, Nestlé, Ferrero, Mars, Şölen, Sagra, Torku erişildi; yeni çikolata gelişmesi yok. Nestlé NESCAFÉ Gold kampanyası (kahve) Ajans & Marka'da yazıldı.

## 9. Araştırma geri bildirimi (ChatGPT için; Claude yazar)
- **4 Kasım: paket geldi** (07:40 cutoff), şema geçerli; TV satırları, tvTableUpdates uyarısı ve spor saat ayrımı çok iyi. Teşekkürler.
- **Tekrar haber:** Sagra–PUDO 30 Ekim bülteninde ana karttı (aynı id), ilk haber 28 Ekim (Ekovitrin, Aksiyon, Saray Medya); Gıda2000'in 3 Kasım tarihi yeniden yayın. Claude çıkardı. Yazmadan önce bulletins/ içinde id ve anahtar kelime arayın, en eski yayın tarihini bulun.
- **Eksik TV ana kartı:** Paket 17 TV satırı getirdi ama ana kart yoktu; "salı ara, çarşamba yeni bölüm" farkı günün TV haberiydi. Claude ekledi. Bölüm 2'deki açık kontrollerin sonucunu `main` öğe olarak önerin.
- **Sayıların yarısı:** Roku'da gösterim +%33 ve fiyat -%7 pakette yoktu, asıl haber buydu; Publicis'te Digiday tarafsızlık tartışması (4 Kasım) ve 2,2 milyar dolar; TÜFE'de beklenti ve gıda katkısı; Banada'da "dörtte birden üçte bire" karşılaştırması eksikti. Şirket verisinde fiyat/hacim ayrımını arayın.
- **Yaratıcı vaka:** Başlık Cadbury'yi öne çıkarıyordu; fikir ITV Commercial'ın, Cadbury beş katılımcıdan biri. Vakanın sahibini doğru yazın.
- **Tekrar:** Lupin hem sinyal hem social idi; birleştirildi. Reklam Kurulu cezaları (GZT 3 Kasım) pakette yoktu, Düzenleme katmanına bakın.
- **Görsel:** 7 ana haberin 3'ünde. **Dijital gündem:** 3 kaynak, hedefte.
- **3 Kasım: paket geldi** (07:35 cutoff), şema geçerli; Sevdam 21.45 tespiti, Mehmed TEKRAR, maç saati/yayıncı ayrımı ve Tuzlu Kahve çelişkisini açıkça yazmanız çok iyi. Teşekkürler.
- **Eksik önemli haber:** Birsen Altuntaş'ın 2 Kasım 22.45 yazısını gördünüz (tvTracking) ama asıl haberi almadınız: "Ekim 30 yılın en düşük reklam geliri, kuşaklar %60 dolu, kanallar maç/özel günde yeni bölüm vermeyecek". Medya planlama bülteni için günün ana konusu; Claude ana kart ekledi. Kulis metnini yalnız yayın saati olarak değil, reklam/fiyat iddiası olarak da okuyun.
- **T-Mobile tarihi:** Paket 2 Kasım 16:21 ABD doğu dedi; Business Wire kodu 20261101, Investing "Pazar günü" diyor. Duyuru ve dağıtım tarihini ayırın.
- **Görsel:** 6 ana haberin 4'ünde iyi. **Dijital gündem:** 3 kaynak; `whyItMatters` içinde süreç notu yazmayın ("dünkü tekrar yerine"), onu `socialSourceReview`e yazın. Netflix başlığını Türkçe adıyla verin.
- **Global:** 5 öğe sınırı doluydu; TikTok Search Ads (SEJ 2 Kasım) eksikti, Claude sinyal olarak ekledi.
- **2 Kasım: paket geldi** (07:48 cutoff), şema geçerli; TV satırları, tvTableUpdates ve maç yayıncıları çok iyi (36 öneri işlendi). Teşekkürler.
- **Eksik önemli haber:** 1 Kasım yaş doğrulama yürürlüğü pakette yoktu; handoff bölüm 2'de açıkça yazılıydı. Bölüm 2 kontrollerini yanıtlayın. Claude ana kart ekledi.
- **Kızılcık:** Gold Film'in X açıklaması (bayram haftası) pakette yoktu; yalnız Birsen Altuntaş gerekçesi verilmişti. Resmî yapım açıklamasını arayın. 30 Ekim paketi de 145. bölümü yeni yazmıştı.
- **Mehmed:** 21.30 kalıcı saat gibi yazılmıştı; 13 Ekim 20.00, 20 Ekim 21.30, 3 Kasım 23.00. Maç haftası ile normal kuşağı ayırın, normal saati teyit edin.
- **Görsel:** 7 ana haberin 3'ünde. **Dijital gündem:** 3 kaynak, video kaynağı yok.
- **30 Ekim: paket geldi** (07:52 cutoff), şema geçerli; pencere doğru, katman dengesi ve sinema eşikleri iyi. Teşekkürler.
- **UEFA maçları:** TRT 2026-27 UEFA kulüp maçlarının hak sahibi; `broadcaster: null` iken `note` içine 'hak sahibi TRT, maç bazında teyitsiz' yazın. Liverpool bilet sayfası ev sahibini belirsiz bıraktı; FB–Liverpool Kadıköy'de (Yeni Asır).
- **Zor Baba 4:** tarih çelişkisi olan filmi `label` ile 4 hafta eşiğine koymayın; Claude sinyal yapmadı. Dağıtımcıdan tek tarih bulun.
- **Godzilla:** 23 Ekim paketi 6 Kasım demişti; tarih değişikliği tarihçesi (23 Ekim) o gün kontrol edilmeliydi. Vizyon tarihlerinde Box Office Türkiye 'değişiklik' geçmişine bakın.
- **Görsel:** 7 ana haberin 3'ünde görsel; Teads/NIQ/Vusion basın sayfalarının og:image'ını arayın.
- **Dijital gündem:** 3 kaynak (Google, Kworb/Spotify, Apple Podcasts) — hedefe ulaşıldı; Kworb verisi 2 gün eski, tarih korunarak yayımlandı.
