# Devir notu (bir sonraki çalışmanın hafızası)

Son güncelleme: 21 Ekim 2026 08:55, Claude (bülten 2026-10-21 ChatGPT paketinden yayımlandı)

## 1. Pencere
- Son bülten: 2026-10-21 (çarşamba) | ChatGPT paketi (research/2026-10-21.json); bilgi kesimi **21 Ekim 2026 07:41:10 TSİ**, Claude teyit 08:55. Perşembe penceresi 21 Ekim 07:41'den başlar.

## 1b. Haftanın gelişmeleri (cuma özeti için; cuma sonrası boşalt)
- 2026-10-19#meta-ticari-sartlar-ai-tarama: Meta 30 Ekim şartları, reklamveren sitelerini AI eğitimi için tarama hakkı.
- 2026-10-19#holding-q3-publicis-omnicom: Publicis Q3 %5 organik; Omnicom 22 Ekim.
- 2026-10-20#eids-sosyal-ilan-platform-yaptirimlari: EİDS, Meta 20 mn TL, TikTok 4 mn TL ceza.
- 2026-10-20#netflix-globo-18-yapim-lisans: Netflix–Globo 18 yapım lisansı.
- 2026-10-21#netflix-q3-reklam-beklentisi: Netflix 2026 reklam beklentisi ~3 → ~2,7 milyar $; 2027'de 15 yeni ülke (Mart 2027 ilk dalga).
- 2026-10-21#iab-cross-channel-karar-rehberi: IAB ölçüm karar rehberi, görüş son tarihi 4 Kasım.

## 2. Ertesi güne bırakılan kontroller
- **Media Guru'larından Notlar (22 Ekim kararı):** Yalnız ChatGPT araştırır (Sharp, Bellman, Beal, Riebe, Nelson-Field; RESEARCH.md). `gurus` ve `guruCheck` gelirse biçim kontrolü yap ve yayımla, kendin araştırma yapma. Önemli yayın yoksa panel çıkmaz.
- **Dijital gündem (21 Ekim kararı):** Araştırma yalnız ChatGPT'de (`RESEARCH.md`). Claude araştırmaz, paket yoksa yedekte de araştırmaz. 22 Ekim paketinden itibaren `social.items[].market` ve `socialSourceReview` zorunlu/beklenen. `socialSourceReview` içindeki `remove` önerilerini kaynak listesine (RESEARCH.md) işle.
- **TV dizi takvimi tablosu (yeni, 21 Ekim):** data/tv-takvim.json ilk sürümü Claude hazırladı; 14 günden eski (†) 14 kayıt 16 Eylül görselinden devralındı. ChatGPT'nin `tvTableUpdates` önerilerini teyit edip dosyaya işle, `updated` tarihini güncelle, `python3 scripts/validate_tv.py` çalıştır. Çirkin, A.B.İ., Aşk ve Taht final yaptığı için tablodan çıkarıldı.
- 21 Ekim: Sevdam Karadeniz 4. bölüm final kulisi (Birsen Altuntaş 20 Ekim) için NOW teyidi; 26 Ekim pzt 3. bölüm yayını.
- Var Mısın 20 Ekim salı yayını gerçekleşti mi (arşivde son 14 Ekim); 21 Ekim çarşamba yayını.
- Omnicom Q3 (22 Ekim).
- Reyting takibi kapsam dışı (kullanıcı kararı); reyting araması yapma.
- 20 Ekim: Mehmed maç sonrası fiilî başlama; Var Mısın salı/çarşamba düzeni; Güldür Güldür 24 Ekim 20.00 yeni bölüm.
- GS–FB 26 Ekim pzt 21:30: cuma 23 Ekim bülteninin maç dönemine (23 Ekim–1 Kasım) girer.
- Halk TV: yayın yeniden başladı mı, reklam satış/teslimat açıklaması var mı?
- 17 Ekim Güldür Güldür Show 14. sezon fiilen yayımlandı mı (Show TV arşivi); 19 Ekim Sevdam Karadeniz 2. bölüm.
- Netflix Organize İşler: Karun Hazinesi yayına girişi; Lupin 4 (23 Ekim).
- Meta Commercial Terms metnini (30 Ekim) birincil kaynaktan aç.
- 22 Ekim TS–Hearts saat/yayıncı, Efes–Beşiktaş saat; 25 Ekim voleybol saatleri (TVF).
- Sevdam Karadeniz ilk yayın tarihi resmî arşivde metin olarak görünmüyor; NOW gece yarısı kayıtlarında yayın günü/takvim tarihi ayrımı.
- ATV: Hamal, Cevher, Karakuyu için gün ataması; Bir Hayat Hikâyesi resmî açıklama.
- Netflix Q3 (20 Ekim): reklamlı paket, işten çıkarma teyidi (Puck raporu).
- Omnicom, Havas, WPP Q3 sonuçları bu hafta/sonraki hafta gelebilir.
- Ferrero 17 Ekim sonrası kabuklu fındık alım politikası (yerel haberler; maliyet sinyali).
- Yaş doğrulama: 1 Kasım yürürlük, 31 Mart 2027 mevcut hesaplar. Platform duyurularını izle.
- Barcelona–Real Madrid 25 Ekim 23:00 TSİ (iki kaynak); yayıncı S Sport Plus tek kaynak.
- UEFA haftası: FB–Slavia 20 Ekim 19:45 (ŞL), Lille–GS 21 Ekim 19:45 (ŞL), TS–Hearts 22 Ekim (KL, saat tek kaynak), BJK–Crystal Palace 22 Ekim 22:00 (AL). TRT kanal ataması resmî teyitsiz.
- 23 Ekim Olympiacos–Fenerbahçe EuroLeague: resmî teyit ara.
- Güneşin Doğduğu Yer: 15 Ekim 5. bölüm ilk yayını arşivde görünmedi (arşivde son 8 Ekim/4); 16 Ekim 22.40 kaydı tekrar mı?
- Centilmen (NOW): Birsen Altuntaş çekim ertelemesi kulisi (16 Ekim); kanal teyidi bekleniyor.

## 3. TV takip tablosu
| Yapım | Kanal | Son durum | Kaynak/tarih |
|---|---|---|---|
| Güneşin Doğduğu Yer | ATV | Kanal teyitli: perşembe 20.00, 15 Ekim 5. bölüm; gece kaydı tekrar. 00.20 iddiası düşürüldü | ATV akışı + bölüm arşivi, 15 Ekim (ChatGPT) |
| Altı Üstü İstanbul | ATV | Fiilen yayında; pazartesi 20.00 | Onedio 13 Ekim |
| Sevdam Karadeniz | NOW | Fiilen yayında; 2. bölüm arşivde; pazartesi 20.00. **Kulis: 4. bölümde final** (resmî teyitsiz) | NOW bölüm arşivi + Birsen Altuntaş 20 Ekim |
| Mehmed: Fetihler Sultanı | TRT 1 | Kanal teyitli: 20 Ekim akışında 21.30, öncesinde 19.45 FB–Slavia | TRT 1 akışı 20 Ekim (ChatGPT) |
| Var Mısın Yok Musun | ATV | Kanal teyitli: 21 Ekim çarşamba 20.00 (akış + tanıtım); 20 Ekim gerçekleşmesi arşivde yok | ATV akışı + program sayfası 21 Ekim (ChatGPT) |
| Anne Yarısı (NOW), Tuzlu Kahve (Star), Haysiyet (Kanal D), MasterChef (TV8) | | 20 Ekim 20.00 yeni bölüm planı | Akışlar 20 Ekim (ChatGPT) |
| Sevdan Bir Ateş | Show TV | 21 Ekim çarşamba 20.00 yeni bölüm (plan) | Show TV akışı 21 Ekim (ChatGPT) |
| 21 Ekim çarşamba diğer | çeşitli | NOW Yeraltı 20.00 yeni; TV8 MasterChef 20.00 yeni; Kanal D Uzak Şehir 20.00 tekrar; Star 20.00 tekrar/sinema; TRT 1 Taşacak Bu Deniz 21.55 tekrar | Akışlar 21 Ekim (ChatGPT) |
| Haysiyet | Kanal D | Salı 20.00; perşembe 23.15 tekrar | Kanal D akışı 15 Ekim |
| Uzak Şehir | Kanal D | 15 Ekim perşembe 20.00 "Tekrar" | Kanal D akışı 15 Ekim |
| Sevdiğim Sensin | Star | 15 Ekim 20.00 yeni bölüm | Star akışı 15 Ekim |
| MasterChef Türkiye | TV8 | 15 Ekim 20.00 yeni bölüm | TV8 akışı 15 Ekim |
| Güldür Güldür Show (14. sezon) | Show TV | 24 Ekim cmt 20.00 yeni bölüm planı; 17 Ekim dönüşü hâlâ teyitsiz | Show TV akışı 20 Ekim (ChatGPT) |
| Cuma 20.00 (16 Ekim) | çeşitli | Kızılcık Şerbeti (Show), Beyaz'la Joker (Kanal D), Taşacak Bu Deniz (TRT 1), MasterChef (TV8) yeni bölüm; Star film | Akışlar 16 Ekim (ChatGPT) |
| Centilmen | NOW | Kulis: çekim ertelendi iddiası, tarih yok; politikam 7 Ekim: Ekim sonu set, yıl sonu yayın | Birsen Altuntaş 16 Ekim |
| Halk TV | Halk TV | 14 Ekim kayyum, yayın kesintisi; 19 Ekim'de yeniden yayın kaydı bulunamadı | Medyascope 14 Ekim |
| Bir Hayat Hikâyesi | ATV (iddia), önce Star | Kulis; tarih yok | Yeni Bakış 11 Ekim |
| A.B.İ. / Aşk ve Taht (ATV), Çirkin (Star) | | Final: 6 / 7 / 4 Ekim | Karar, Milli Gazete |
| ATV çarşamba 20.00 | ATV | Var Mısın Yok Musun | İlkses 14 Ekim |
| Organize İşler: Karun Hazinesi | Netflix | Fiilen yayında: 2026, 8 bölüm; TR haftalık dizi listesi 1. (12-18 Ekim). Lupin 4 → 23 Ekim | Netflix Tudum + başlık sayfası, 21 Ekim |

## 4. Spor (sonraki dönem için not)
- Hakları: TRT → UEFA kulüp maçları 2026-27 (TRT 1 şifresiz); EuroLeague S Sport Plus; BSL beIN; Süper Lig beIN.
- 15 Ekim: 19.45 KuPS–Trabzonspor (TRT 1), 20.45 Fenerbahçe–Partizan (S Sport Plus), 22.00 Hoffenheim–Beşiktaş (TRT 1). 16 Ekim: 20.00 Beşiktaş–Bayern, 20.00 Žalgiris–Efes (S Sport Plus). 18 Ekim 20.30 Beşiktaş–Galatasaray basketbol (yayıncı teyitsiz).
- 17-18 Ekim Süper Lig'de derbi yok. 19 Ekim pzt 20.00 Trabzonspor–Beşiktaş; 25 Ekim Barcelona–Real Madrid (saat teyitsiz); 26 Ekim pzt Galatasaray–Fenerbahçe; 25 Ekim voleybol: Fenerbahçe–Eczacıbaşı, VakıfBank–Galatasaray. Millî ara: 12-17 Kasım.
- 19 Ekim bülteni maç dönemi 19-25 Ekim yayımlandı. GS–FB 26 Ekim pzt 21:30 (TFF, İl Emniyet gerekçesi). EuroLeague: Efes–BJK 22 Ekim, Olympiacos–FB 23 Ekim 21:15. Voleybol 25 Ekim: VakıfBank–GS 14:00, FB–Eczacıbaşı 19:00 (tek kaynak).

## 5. Sinema (yalnız cuma kontrol edilir)
- Bildirilen: 6 Kasım → Godzilla Minus Zero, Cinlerin Düğünü (tarih belirsiz) [4 hafta, 13 Ekim]. 9 Ekim sayısında (arşivde yok): Clayface, Çatlı 2, Şapkalı Kedi, Çakallarla Dans 8.
- 16 Ekim: 4 hafta → 13 Kasım Ebenezer (UIP), Av. Mahsun Karaca, Bir Banka Nasıl Soyulur. 3 hafta → Godzilla Minus Zero (Başka Sinema), Şapkalı Kedi (6 Kasım). 2 hafta → Çatlı 2 (30 Ekim).
- Sıradaki (23 Ekim cuma): 20 Kasım → Hunger Games: Sunrise on the Reaping, Aşk Tesadüfleri Sever 3 (4 hafta); 13 Kasım filmleri 3 hafta; 6 Kasım filmleri 2 hafta. Cinlerin Düğünü tarihi teyit.

## 6. Kullanılmış yaratıcı vakalar (tekrar etme)
- Maltesers / Channel 4 "Together Against Hate" (12 Ekim)
- Snickers "Hungerithm", Avustralya 2016 (13 Ekim)
- KitKat "Have a…" O2 DOOH, BK 2023 (14 Ekim)
- Cadbury Dairy Milk &More komşu ilanlar, VCCP, BK 2024 (15 Ekim)
- Cadbury "Undercover Eggs" kesilip katlanan basın ilanları, VCCP, BK 2026 (16 Ekim)
- Toblerone "Gift Outside the Box" (19 Ekim)
- Cadbury Secret Santa Postal Service, QR'lı OOH, VCCP, BK 2022 (20 Ekim)
- KitKat "Phone Break", VML Czechia, OOH+basın, Çekya 2025 (21 Ekim)
- Adaylar: Caramilk önceki araştırmada görülmüş.

## 7. Kaynak erişimi
- 21 Ekim Claude oturumu: WebFetch TRT 1 akışında yine **izin/zaman aşımı (PROVENANCE_REQUIRED)**; ertesi gün yeniden dene. sec.gov (Netflix 8-K) açıldı. WebSearch maç/TV teyidinde yalnız başlık döndürdü.
- ChatGPT 21 Ekim: 7 kanal akışı, TFF, TVF, VolleyStation, S Sport Plus, beIN, MediaCat, Marketing Türkiye, campaigntr açıldı. 403: tbf.org.tr, trtspor.com.tr, euroleaguebasketball.net; zaman aşımı: fiskobirlik; erişilemedi: Mondelez TR, Doğkar, Altınkılıçlar, Lider.
- Site: 20 Ekim akşamı yeni galeri tasarımı (kare kapak + açılır pencere). render_check.py 21 Ekim'de `.story-cover` sayacak şekilde güncellendi.
- 20 Ekim Claude oturumu: WebFetch yine **izin/zaman aşımı (PROVENANCE_REQUIRED)** — TRT 1 akışı denendi, açılmadı; teyit WebSearch başlıklarıyla sınırlı. Kalıcı engel değil; ertesi gün yeniden dene.
- ChatGPT 20 Ekim: 7 kanal akışı, TFF, TVF/VolleyStation, S Sport Plus, bjk.com.tr, uefa.com kulüp sayfaları, galatasaray.org, fcbarcelona.com, Google Trends, rakip siteler (9) açıldı. Hata (Internal Error): tbf.org.tr, EuroLeague, fenerbahce.org, trtspor, Fiskobirlik, Lider, Mondelez TR, Doğkar, Altınkılıçlar, charts.youtube.com.
- 19 Ekim Claude oturumu (yedek): WebFetch yine **izin/zaman aşımı (PROVENANCE_REQUIRED)** — 7 kanal akışı, TFF, TRT 1 akışı, VolleyStation, Google Trends, mediacat, marketingturkiye, campaigntr, campaignlive; fenerbahce.org hata; halktv.com.tr robots (kalıcı). Çalışan: ppc.land, adweek, placera, sporekrani, milligazete, internethaber, football-espana.
- 16 Ekim Claude oturumu: WebFetch yine **izin/zaman aşımı (PROVENANCE_REQUIRED)** — ssportplus.com, trt1.com.tr akışı, mediacat.com, birsenaltuntas.com açılamadı; WebSearch yalnız başlık döndürdü. Kalıcı engel değil; ertesi gün yeniden dene. Claude'un teyit gücü bu sorun sürdükçe sınırlı.
- ChatGPT 16 Ekim: 7 kanal akışı, TFF, TVF/VolleyStation, S Sport Plus, bjk.com.tr, uefa.com (kulüp maç sayfaları), Google Trends, MediaCat, Marketing Türkiye açıldı. Hata: EuroLeague/TBF/fenerbahce.org/olympiacos, Netflix/YouTube listeleri, Fiskobirlik, Lider, Mondelez TR, Doğkar, Altınkılıçlar.
- 15 Ekim Claude oturumu: **WebFetch izin istekleri gözetimsiz çalışmada zaman aşımına uğradı (PROVENANCE_REQUIRED; izin/zaman aşımı, kalıcı engel değil)** — TRT 1 akışı, Meio & Mensagem, DoubleVerify IR açılamadı. Teyit WebSearch ile yapıldı. Kullanıcı resmî URL'leri görev mesajında verse de izin adımı yine düştü.
- ChatGPT 15 Ekim: 7 kanal akışı, TFF, TVF, VolleyStation, S Sport Plus, beIN ana sayfa, Google Trends açıldı. Hata: tbf.org.tr, trtspor.com.tr (Internal Error), etietieti.com (zaman aşımı), torku.com.tr, ulker.com.tr, fiskobirlik, lider çikolata (açılış hatası). Hepsi izin/zaman aşımı sayılır; ertesi gün yeniden dene.
- Kalıcı/alternatifli: uefa.com → kulüp siteleri; euroleaguebasketball.net, fenerbahce.org → Passo/kulüp; boxofficeturkiye.com → paribucineverse, sinemalar.com; top10.netflix.com, charts.youtube.com, TikTok Creative Center (JS/robots) → yok.
- Çalışan (önceki günler): mediacat.com, marketingturkiye.com.tr, campaigntr.com, onedio.com, globenewswire, digiday, mediapost, ppc.land, bestmediainfo, creativereview.co.uk.

## 8. Rakip izleme notları
- Tamek Sagra Grup (Tadelle, Sarelle): yeni genel koordinatör, 12 Ekim.
- Ferrero/Nutella "Bu Hikâyede Ekmek Var" turu (1 Ekim'den beri; 5 şehir).
- ETİ Benim'O: Alisa Sezen Sever'li film, 25 Eylül (bildirilmedi).
- Ülker (kendi şirket): Lovemarks 2026; Godiva 100. yıl sanat koleksiyonu.
- Mars M&M's Minis/Cookie Dough + Marvel paketleri (13 Eylül, bildirilmedi).
- 14-15 Ekim: Sagra, Nestlé, Ferrero, Mondelez, Şölen, Altınmarka, Mars sayfaları kontrol edildi (ChatGPT); yeni Türkiye gelişmesi yok. ETİ, Torku, Fiskobirlik, Lider açılamadı.
- 16 Ekim: Altınmarka, ETİ, Nestlé, Ferrero, Mars, Şölen, Sagra, Torku erişildi; yeni çikolata gelişmesi yok. Nestlé NESCAFÉ Gold kampanyası (kahve) Ajans & Marka'da yazıldı.

## 9. Araştırma geri bildirimi (ChatGPT için; Claude yazar)
- **22 Ekim için yeni görev:** RESEARCH.md "Dijital gündem araştırması" ve "TV dizi takvimi güncellemesi" bölümlerini oku. İlki: Netflix/Google dışına çık, Türkiye'de henüz görünmeyen global trendleri `market` ile işaretle, yanıt vermeyen veya girişli siteleri tekrar deneme, `socialSourceReview` ver.
- **21 Ekim: paket geldi** (9 öğe, 07:41 cutoff), şema geçerli; Derbi etiketi kuralı uygulanmış, Netflix rakamları SEC metniyle birebir tuttu. Teşekkürler.
- **Dijital gündem:** Bu kez yalnız 3 Netflix öğesi; Google Trends Türkiye'den dizi/marka/kampanya trendi de ekleyin (3-5 öğe, farklı platformlar).
- **Görsel:** 9 haberin 4'ünde görsel yok (Netflix, Var Mısın, Sevdam, SPAR); kanal program sayfası veya basın görseli arayın.
- **Rakip:** Mondelez TR, Doğkar, Altınkılıçlar, Lider yine açılamadı; alternatif olarak MediaCat/Marketing Türkiye marka araması sonuçlarını tarihleriyle yazın.
- **20 Ekim: paket geldi** (8 öğe, 07:40 cutoff), şema geçerli; accessLog, limitations ve researcherNotes çok iyi. Teşekkürler.
- **Derbi etiketi:** Barcelona–Real Madrid'e yine "Derbi" etiketi verilmişti; Claude kaldırdı. Etiket yalnız FB/GS/BJK arası maçlar için.
- **Dijital gündem:** Yine 3 Google Trends öğesi; "Epic Games" gibi nedeni bilinmeyen trendler yerine dizi/marka/kampanya trendleri, 3-5 öğe.
- **Haber çeşitliliği:** Türkiye'de ajans/marka ve sektör (MediaCat, Marketing Türkiye) haberi yoktu; en az bir yerel sektör haberi arayın.
- **19 Ekim: paket geldi** (research/2026-10-19.json, 9 öğe, 07:40 cutoff). Şema geçerli, accessLog ve limitations açık. Claude yalnız WebFetch izin zaman aşımı nedeniyle bazı sayfaları açamadı; teyit arama özetleriyle yapıldı. Teşekkürler.
- **Görsel:** 19 Ekim'de 9 haberin yalnız 3'ünde doğrudan görsel vardı. Gelecekte haber başına görsel ve kredi bilgisi mümkünse ekleyin.
- 16 Ekim paketi iyi: 11 öğe, şema geçerli, null saat/yayıncılar dürüst bırakılmış, rakip kontrolü ve accessLog açık. Teşekkürler.
- **Çıkarıldı: reyting maddesi** (14 Ekim TİAK/Show TV). PROMPT.md 5.1 b: reyting takibi kapsam dışı (13 Ekim kullanıcı kararı); reyting araması yapma, pakete alma. Yalnız reyting haberin kendisiyse (ör. düşük reyting nedeniyle final) anılabilir.
- **Etiket:** Anadolu Efes–Beşiktaş "Derbi" değildir; Derbi etiketi yalnız FB/GS/BJK arası maçlar (ve PROMPT'taki derbi kuralları) için.
- **Görsel:** Genel kurumsal/varsayılan basın görseli (Havas default-press.jpg) ekleme; haberin konusunu göstermiyorsa alanı boş bırak.
- **UEFA saatleri:** TRT 1 akışı ve kulüp sitelerinde (fenerbahce.org yerine Passo/haber + TRT 1 akışı) TSİ saati ara; hak sahibi TRT ise maç bazında TRT 1/TRT Spor ayrımını teyit et.
- **Dijital gündem:** Yine yalnız 3 Google Trends öğesi; kişi adı trendleri (oyuncu adı) yerine dizi/marka/kampanya trendlerini tercih et, 3-5 öğe hedefle.
- **Pencere:** Bu sefer çelişki yok (bülten ve paket cutoff'u aynı). Pazartesi penceresi bu paketin cutoff'u 16 Ekim 07:42'den başlar.
