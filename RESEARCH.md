# Araştırma Kontrol Listesi (Daily Media Intelligence)

> **11 Kasım 2026'dan itibaren (kullanıcı kararı):** ChatGPT akıştan çıktı. Bu dosyadaki tüm görevleri **Claude** yapar: sabah görevi (07.30-09.15) araştırma, dijital gündem, guru notları ve TV tablosu; ayrı yayın sonrası görevi (10.30) değerlendirme raporu. Aşağıdaki metinde "sen" Claude'dur. Araştırma paketi (`research/YYYY-MM-DD.json`) artık yazılmaz; bulgular doğrudan bülten alanlarına (`articles`, `signals`, `matches`, `social`, `gurus`) ve TV tablosu doğrudan `data/tv-takvim.json` dosyasına işlenir. "Paket", "`researcherNotes`", "`accessLog`", "`tvTableUpdates`", "`socialSourceReview`", "`guruCheck`" geçen yerlerde karşılığı: bülten `limitations`/`review.summary` ve `state/handoff.md` (bölüm 7 kaynak erişimi, bölüm 9 geri bildirim). Yazma sınırı bölümü artık geçerli değildir; yetkiler `WORKFLOW.md`'dedir. Çelişkide `WORKFLOW.md` geçerlidir.

## Zaman

- Hafta içi her gün **07.30 TSİ** başla; araştırmayı **08.40**'ta bitir, bülteni **09.15**'te yayımla.
- Yetişmeyen bölümü çıkar ve `limitations` içine yaz; eksik ama doğrulanmış bülten, geç bültenden iyidir.
- Pencere: önceki bültenin bilgi kesim saatinden (devir notu bölüm 1) bugünkü bilgi kesimine kadar.

## Ne araştırılır

İçerik ve kaynak kuralları kök dizindeki `PROMPT.md` dosyasındadır. Bölüm 2-5 ve 4.1 aynen geçerlidir. Özetle:

1. **Türkiye ve Global** medya, reklam, pazarlama gelişmeleri (Global en fazla 5).
2. **TV & Entertainment Türkiye:** yayın takvimi değişiklikleri, başlangıç/final/erteleme; resmî kanal akışı veya bölüm arşiviyle teyit. Reyting takibi kapsam dışı.
3. **Rakip marka gelişmeleri:** PROMPT.md 5.2 şirket evreni. Haber araması + şirketlerin kendi sayfaları + MediaCat/Marketing Türkiye'de marka adıyla arama. Şirketlerden hiçbirini "kendi şirket" ya da "bizim taraf" diye etiketleme; hepsini aynı tarafsız dille yaz.
4. **Yaklaşan önemli maçlar:** PROMPT.md 5.3 kapsamı ve dönemi; resmî fikstür kaynakları.
5. **Dijital gündem:** PROMPT.md 5.6.
6. **Sinema:** yalnız cuma (PROMPT.md 5.4).
7. **Yaratıcı mecra vakası:** her gün bir vaka (PROMPT.md 5.5); daha önce kullanılan vakalar `state/handoff.md` bölüm 6'da.

Başlamadan önce `state/handoff.md` dosyasını oku: pencere başlangıcı, TV takip tablosu, açık kontroller, kullanılmış vakalar, kaynak erişim notları ve **bölüm 9 "Araştırma geri bildirimi"** (Claude'un önceki paketlerde düzelttiği hatalar; aynı hatayı tekrarlama).

## Teyit seviyeleri (her haberde zorunlu)

| Değer | Anlamı |
|---|---|
| `official` | Şirket, kanal, federasyon, kurum veya araştırma sahibinin kendi sayfası |
| `two_independent` | Birbirini kopyalamayan iki güvenilir kaynak |
| `single_secondary` | Tek ikincil kaynak (haber sitesi, toplayıcı) |
| `rumor` | Kulis; resmî teyit yok |

- Maç yayıncısını yalnız `official` veya `two_independent` ise yaz; değilse `broadcaster: null` ve `note` içinde kaynağı belirt.
- TV'de "Fiilen yayında" yalnız resmî akış veya bölüm arşiviyle.
- Sayı, tarih ve saatleri tahminle doldurma. Doğrulanamayanı `limitations` içine yaz.

## Katmanlı haber seçimi ve kısa sinyaller (22 Ekim 2026'dan itibaren, kullanıcı kararı)

Haberleri "o gün kim ne yayımladı"ya göre değil, 6 katmana göre ara ve seç. Tam kurallar `PROMPT.md` 5.8'de.

Katmanlar (`layer`): `Medya tüketimi ve izleyici`, `Reklam pazarı ve para`, `Platform ve ürün`, `Marka ve kampanya`, `Tüketici ve ekonomi`, `Düzenleme ve sektör`.

- Her `items[]` kaydına `layer` ve `tier` ekle. `tier: "main"` (ana haber, 5-8 adet, tam `facts`) veya `tier: "signal"` (kısa sinyal, 4-6 adet, tek `facts` maddesi yeter).
- Gün içinde mümkünse en az 4 katmandan içerik getir; tek katman toplamın en fazla %40'ı olsun. TV yayın akışı haberleri tek başına gündemi doldurmasın. Bir katmanda doğrulanmış içerik yoksa boş bırak ve `limitations` içine "X katmanında yeni içerik bulunamadı" yaz; dolgu haber ekleme.
- Toplam sayı sabit değil: genelde 8-14. Zayıf haberle sayı doldurma.
- Katman başına önerilen kaynaklar: tüketim için Netflix Tudum, YouTube, DataReportal, GWI, TÜİK, BTK, Reuters Digital News Report, Google Trends; reklam pazarı için Reklamcılar Derneği, IAB Türkiye, şirket çeyrek sonuçları; düzenleme için RTÜK, Reklam Kurulu, Ticaret Bakanlığı, Resmî Gazete; tüketici için TÜİK, TCMB tüketici güven endeksi, e-ticaret ve perakende dernekleri. Erişemediğin kaynağı `accessLog` ve `limitations` içine yaz.
- Kısa sinyal en az bir https birincil veya güvenilir ikincil kaynak ve yayın tarihi taşır. `rumor` olamaz.
- İsteğe bağlı `attitudeTag`: haberin gösterdiği medya tutumunu 1-3 kelimeyle yaz (ör. "kısa video", "ikinci ekran", "fiyat duyarlılığı"). Yorum ve Radar'ı Claude yazar; sen yalnız etiket öner.

## Yayın sonrası okuma ve değerlendirme raporu (22 Ekim 2026'dan itibaren, kullanıcı kararı)

Claude bülteni yazıp yayımladıktan sonra (09.15), sen yayımlanmış bültenin **her haberini okur** ve Claude'un yazdığı metni değerlendirirsin. Amaç ikinci bir göz: hata, zayıf yorum, abartı veya eksik yakalamak.

**Sınır (11 Kasım 2026'dan itibaren):** Yalnız kaynakla çelişen açık olgu hatalarını (sayı, tarih, saat, yayıncı, isim) bültende düzelt ve `corrections` alanına yaz; geri kalan her şey yalnız rapora. Aşağıdaki eski metin ChatGPT içindi: `bulletins/`, `data/`, `state/`, site dosyaları ve `research/` altındaki paketler dahil hiçbir dosyayı düzenleme, düzeltme veya yeniden yazma. Yalnız aşağıdaki rapor dosyasını yaz. Önerilerini kullanıcıya ilet; kararı kullanıcı verir, uygulamayı Claude yapar.

**Zaman:** Bülten 09.15'te yayımlanır; raporu 11.00'e kadar tamamla. Bülten 09.30'a kadar yayımlanmadıysa rapora "bülten yayımlanmadı" yaz ve dur.

**Ne okunur:** `bulletins/YYYY-MM-DD.json` (güncel bülten; siteden de açılabilir). Her `articles[]` kaydı, `signals[]`, `attitudeRadar`, `social`, `gurus` ve `limitations`.

**Her ana haber için kontrol et (kaynakları aç, başlık ve özetle yetinme):**
1. Kaynak ile iddia uyumu: kartta yazan olgu, sayı, tarih ve isim kaynakta aynen var mı?
2. "Bu ne anlama geliyor?" (`impact`) notu: mantıklı mı, abartı veya dayanaksız çıkarım var mı, ajans, marka ve tüketici gözünü yansıtıyor mu, sade mi?
3. `action`: somut ve uygulanabilir mi?
4. `counterView`: gerçek bir alternatif açıklama mı, yoksa kalıp cümle mi?
5. `layer` doğru mu? Tekrar eden veya önceki bültenin devamı olup belirtilmemiş haber var mı?
6. Dil: jargon, uzun cümle, sensasyon, belirsiz ifade.

**Bülten bütünü için:**
- `attitudeRadar`: `basis` ("Veri" yalnız ölçülmüş veriye dayanıyor mu), `recurrence` (önceki bültenlerde gerçekten görülmüş mü) ve tek haberden trend çıkarılıp çıkarılmadığı.
- `signals`: yorum karışmış mı, kaynak ve tarih doğru mu?
- Katman dengesi (en az 4 katman, tek katman en fazla %40) ve gün içinde kaçırılmış önemli bir gelişme.

**Rapor dosyası:** `reviews/YYYY-MM-DD.md` (11 Kasım'dan önceki ChatGPT raporları `research/reviews/` altında arşivdir). Biçim:
```
# Değerlendirme raporu: YYYY-MM-DD
Okunan: N ana haber, M kısa sinyal. Kaynak açılamayan: ...
## Özet (en fazla 5 madde: en önemli bulgular)
## Kritik (yayındaki bilgi yanlış veya yanıltıcı olabilir)
- [haber id] Bulgu. Kartta yazan (kısa alıntı). Kaynakta görülen + https bağlantı. Önerim.
## İyileştirme önerileri (zayıf yorum, dil, counterView, eksik bağlam)
- [haber id] Bulgu. Önerim.
## Bülten bütünü (Radar, katman dengesi, kaçırılan gelişmeler)
## Sorun görmediğim haberler (id listesi)
```
- Her bulgu: hangi haber, neyi gördün, hangi kaynakta (https bağlantı) ve önerin. Kaynağı açamadığın iddiayı "doğru" veya "yanlış" sayma; "doğrulanamadı" yaz.
- Zevk farkı için bulgu üretme. Sorun yoksa "sorun görmedim" yaz; sayı doldurmak için eleştiri uydurma.
- Veri ile yorumunu ayır. Düzeltme önerini hazır cümle olarak yazabilirsin, ama dosyaya uygulama.

**Kullanıcıya iletme:** Raporu dosyaya yazdıktan sonra kısa bir özetini (kritik bulgu sayısı, en önemli 3 öneri, dosya yolu) kendi sohbetinde de kullanıcıya sun. Claude ertesi sabah raporu okur, kritik bulguları kaynaktan yeniden teyit eder, kullanıcıya iletir ve yalnız onaylananları uygular.

## TV dizi takvimi güncellemesi (her gün, 12 Kasım 2026 kullanıcı kararı)

Sitede "2026 TV Dizi Takvimi" tablosu vardır (kanal x gün). Kaynağı `data/tv-takvim.json` dosyasıdır ve **Claude her sabah** günceller (bülten commit'iyle yayımlanır). Tablo sitede güncel kalmalıdır; bir gün atlanırsa bir sonraki gün tam kontrol yapılır.

**Her sabah yapılacaklar (hafta içi, bülten yayınından önce)**
1. 7 kanalın resmî yayın akışı sayfasını aç ve **bulunulan haftanın Pazartesi-Pazar akışını** gün gün oku (kanal başına 7 gün; en az bugün ve yarın zorunlu, haftanın geri kalanı da bakılır). Resmî sayfa açılmıyorsa (ör. TV8 "yenileniyor") kaydı değiştirme, `checked` tarihini ilerletme ve bunu bülten `limitations` alanına ve `state/handoff.md` içine yaz.
2. Tabloyla karşılaştır. Farkları doğrudan `data/tv-takvim.json` içine işle: yeni bölüm yoksa TKR (`air: "tkr"`) veya yerine konan program (maç, film, özel yayın), saat kayması, yeni dizi, yeni sezon, final, günü belirsiz dizinin başlaması.
3. Her kontrol edilen kayda `checked` (bugün) ve `source` (kanalın resmî akış sayfası, https) yaz. Bugünün tarihini `updated` alanına yaz.
4. İşledikten sonra `python3 scripts/validate_tv.py` çalıştır.
5. `checked` tarihi 14 günden eski kayıtlar sitede † ile görünür. Günlük kontrol çalışıyorsa nadir olmalı. Bu kayıtta dizi hakkında hiçbir bilgi bulamazsan kaydı kaldır, bilgi varsa kalır ve `checked` güncellenir.
6. Resmî kaynakla çelişen haber veya kulis bilgisini tabloya işleme; `note` içinde "teyitsiz" diye belirt.
7. **Maç yayını olan günler (12 Kasım 2026 kullanıcı kararı):** Tablodaki kanallarda maç yayını varsa (millî maç, Avrupa kupası, derbi vb.) maçın kendisi o günün hücresine gerçek saatiyle eklenir (`air: "mac"`, sitede MAÇ rozeti, başlık "Takım - Takım" biçiminde, kanalın akışındaki yazımla). Maçtan önce veya sonra kaydırılmış **yeni bölümlü** dizi varsa o da gerçek saatiyle eklenir (ör. 22.15). Kayan bölüm tekrar ise `air: "tkr"`. Kaymış saati resmî akıştan ("Yeni Bölüm" ibaresi) teyit et; haber veya kulis yetmez. Maç günü geçince kaydı kaldır. Maç öncesi ve sonrası program (ör. "Milli Maça Doğru") yazılmaz.

Hafta sonu: Cumartesi ve Pazar bülten çıkmıyorsa bakılmaz; Pazartesi sabahı hafta tam kontrol edilir.

**Görünüm kuralları (22 Ekim 2026, kullanıcı kararı)**
- Bu hafta yeni bölümle yayınlanan dizide yalnız saat görünür. Not yazma.
- Yeni dizi: doğrulanmış başlangıç tarihi varsa tarih görünür, yoksa "Başlangıç tarihi açıklanmadı". Var olan dizi yeniden yayına başlayacaksa yeni sezondur: `tag: "sezon"` ("Yeni Sezon") kullan (kullanıcı onayı, 22 Ekim).
- "Günü belirsiz" sütunundaki dizinin başlayıp başlamadığını kontrol et. Başladıysa gerçek gününe ve saatine taşı (`update`, `day` değişir, `tag` boşalır). Başlamadıysa Yeni Dizi etiketiyle kalır.
- Haftalık dizinin yeni bölümü gelmediyse (maç, özel yayın vb.) tekrar ise `air: "tkr"` (sitede TKR), yerine başka program konduysa `note` içine onun adını yaz.

**Kayıt biçimi** (`schema/research.example.json` içinde örnek var)
- `action`: `add`, `update` veya `remove`. `update` ve `remove` için `channel`, `day`, `title` kaydı bulmaya yeter.
- `channel`: ATV, KANAL D, STAR TV, SHOW TV, NOW, TRT 1, TV8. `day`: Pazartesi ... Pazar veya `Günü belirsiz`.
- `status`: `yayinda` (resmî akışta veya arşivde yeni bölüm görüldü), `kanal-teyitli` (kanal açıkladı, henüz yayında değil veya bölüm teyidi yok), `planlanan`, `belirsiz`. Haber sitesi veya kulis bilgisini `belirsiz` yap ve `note` içine "Kulis" yaz.
- `time`: `20.00` biçimi. Saat teyitsizse alanı koyma.
- `note`: tek kısa not (en fazla ~12 kelime). Yeni bölümle yayındaki dizide not yazılmaz.
- `tag`: `yeni`, `sezon` veya `final`. `air`: `tkr` (bu hafta tekrar).

**Veda eden diziler**
- Final tarihi resmî olarak açıklanmışsa kaydın `tag` alanı `final`, `final` alanı `YYYY-MM-DD` olur. Sitede "Dizi Finali" ve veda tarihi görünür. Kulis bilgisini final olarak yazma; `note` içinde Kulis de.
- Final yayını geçtikten sonra kaydı `remove` ile kaldırmayı öner.

**Yeni gelen diziler**
- Günü belli ise kayıt o günün sütununa gider. `tag: "yeni"` ve başlangıç tarihi biliniyorsa `start: "YYYY-MM-DD"` yaz. Sitede "Yeni Dizi" ve başlangıç tarihi görünür.
- Günü belirsiz ise `day: "Günü belirsiz"`, `tag: "yeni"` ile ilgili kanalın satırına konur.
- Dizi yayına başlayınca `tag` alanını boş bırakarak `update` öner (Yeni Dizi notu kalkar), `status` değerini `yayinda` yap.
- Tarih ve saati tahminle doldurma. Teyitsiz bilgiyi `belirsiz` bırak.

## Dijital gündem araştırması (yalnız ChatGPT, 21 Ekim 2026 kullanıcı kararı)

Bu bölümün araştırmasını yalnız sen yaparsın. Claude bu konuda araştırma yapmaz, paket gelmezse yedek akışta da yapmaz; o gün sitede dijital gündem şeridi çıkmaz. Sonuçlar paketin `social` alanına yazılır (biçim: `schema/research.example.json`).

**Amaç.** Tek bir platforma (yalnız Google veya yalnız Netflix) bağlı kalma. Dijitalde en çok konuşulanları ve medya planlama açısından anlamlı olanları farklı kaynaklardan süz. Bir ayrım yap:
- `market: "Türkiye"`: Türkiye'de görünen gündem.
- `market: "Global, Türkiye'de henüz yok"`: Global trend olmuş ama Türkiye'de henüz görünmeyen konu, format veya platform davranışı. Bu öğeler özellikle değerlidir.
- `market: "Global, Türkiye'de de görünür"`: İki pazarda da izlenen konu.

**Süzme kuralları**
- En fazla 8 öğe. Tek kaynaktan veya platformdan en fazla 3 öğe. Mümkünse en az 3 farklı kaynak.
- Medya planlamayı etkileyen konuları seç: platform ve format değişiklikleri, izleyici davranışı, arama ve ilgi trendleri, markaların içerik biçimleri, yeni reklam alanları. Siyasi, kişisel veya hassas gündemleri ve özel kişileri alma.
- Rapor ve yıllık veri kaynakları (DataReportal, Think with Google, Pew vb.) sık güncellenmez. Yeni yayımlanmış veya güncellenmiş bir çalışma yoksa o kaynaktan öğe ekleme. Aynı raporu tekrar etme (önceki bültenlerin `social` alanına bak).
- `metric` yalnız kaynağın verdiği sayıdır. Kaynak adını yaz. Sayıyı sen hesaplama, tahmin etme. Veriyi yorumdan ayır.
- `note` alanına listenin neyi ölçtüğünü ve neyi ölçmediğini yaz.

**Başlangıç kaynak listesi (kullanıcının verdiği, 21 Ekim 2026)**
- https://www.thinkwithgoogle.com/intl/tr-tr/ (Google, Türkiye içgörüleri)
- https://trends.google.com/trends/ (arama trendleri; Türkiye ve global karşılaştırması)
- https://datareportal.com/digital-in-turkey (Türkiye dijital kullanım verisi)
- https://www.searchenginejournal.com/ (arama ve dijital pazarlama haberleri)
- https://www.pewresearch.org/ (araştırma; ABD ağırlıklı, ilgisini kontrol et)
- https://www.warc.com/ (kampanya ve etkililik; çoğu içerik üyelik gerektirir)
- https://app.globalwebindex.com/ (GWI; giriş gerektirir)
- https://www.statista.com/ (veri; çoğu içerik ücretli)
- https://www.semrush.com/ (arama ve trafik verisi; çoğu araç girişli)
- https://www.similarweb.com/ (site trafiği; çoğu veri girişli)
- https://www.trendhunter.com/trends/tagwalk (moda ağırlıklı; yalnız marka, ürün veya ambalaj ilgisi varsa)

Bu liste başlangıçtır. Benzer, daha iyi veya günlük trend veren başka kaynaklar bulursan öner (örnekler, doğrulanmadı: Pinterest Trends, Exploding Topics, Know Your Meme, Reddit gündemi).

**Erişim ve enerji kuralları**
- Yalnız herkese açık sayfaları aç. Giriş yapma, üyelik veya ödeme duvarını aşma, CAPTCHA geçme.
- Bir site yanıt vermiyorsa, giriş istiyorsa, ücretliyse veya kapsamı bu işe uygun değilse aynı gün tekrar deneme, zaman harcama. `accessLog` ve `socialSourceReview` içine yaz ve devam et.
- Her pakette `socialSourceReview` listesi ver. Her kaynak için sonuç (`ok`, `login_required`, `paywall`, `no_response`, `poor_scope`) ve öneri (`keep`, `remove`, `add`) yaz. `remove` önerdiğin kaynağı sabah Claude bu listeden çıkarır. Sen listeyi kendin değiştirme, yalnız `research/` klasörüne yazabilirsin. Kaynağı çıkarmadan önce de aynı gün o kaynağı kullanma.
- Aynı kaynak üç ardışık gün `remove` önerilirse Claude'dan beklemeden o kaynağı atla.

## Media Guru'larından Notlar (yalnız ChatGPT, 22 Ekim 2026 kullanıcı kararı)

Her gün şu araştırmacıların yeni çalışmalarını kontrol et: **Byron Sharp, Steven Bellman, Virginia Beal, Erica Riebe, Karen Nelson-Field**. Önemli bir gelişme varsa paketin `gurus` alanına yaz. Sitede Dijital Gündem ve Spor Takvimi panellerinin yanında "Media Guru'larından Notlar" paneli olarak görünür. Bu işi yalnız sen yaparsın. Claude araştırmaz ve içeriği yeniden teyit etmez, yalnız biçim kontrolü yapar. Paket gelmezse panel çıkmaz.

**Nereye bak**
- Kurum ve yazar sayfaları: Ehrenberg-Bass Institute (marketingscience.info ve üniversite sayfaları), Amplified Intelligence (Karen Nelson-Field), yazarların kendi sayfaları. Kurum bağlarını güncel kaynakla teyit et.
- Akademik kayıtlar: Google Scholar, ResearchGate, SSRN ve dergi sayfaları (Journal of Advertising Research, Journal of Marketing, International Journal of Research in Marketing, Journal of Marketing Research vb.).
- Konuşma ve podcast kayıtları, kitap duyuruları. Sosyal medya gönderileri yalnız ilk sinyaldir; birincil kaynağı aç.
- Önce son önceki çalıştırmanın `cutoff` saatinden sonrasına bak. Yeni bir şey yoksa `gurus` alanını koyma.

**Neyi önemli say**
- Yeni hakemli makale veya çalışma kâğıdı, yeni kurum raporu, kitap veya veri seti.
- Mevcut bir bulguyu değiştiren, genişleten veya çürüten sonuç.
- Medya planlama kararını (reach, frekans, attention, kanal karması, marka büyümesi, ölçüm) ilgilendiren konuşma veya açıklama.
- Sayma: eski çalışmanın yeniden paylaşımı, etkinlik veya eğitim duyurusu, yeni bilgi içermeyen görüş yazısı. Aynı çalışmayı tekrar etme (önceki bültenlerin `gurus` alanına bak).

**Kurallar**
- En fazla 3 öğe. Her öğe: `person`, `title` (özgün başlık), `evidence` (Hakemli makale, Çalışma kâğıdı, Kurum raporu, Kitap, Konuşma veya podcast, Yazı veya görüş), `summary` (tek cümle, en fazla ~25 kelime, kendi sözlerinle), `whyItMatters` (planlama etkisi, tek cümle), `counterView` (sınır), `url` (birincil kaynak, https), `source`, `published`.
- Birincil kaynağı aç (dergi, kurum veya yazarın sayfası). Haber özetiyle yetinme. Tam metin kapalıysa yalnız özetten (abstract) söylenebileni yaz ve belirt.
- `counterView` içinde örneklem, ülke, yöntem (deney mi gözlem mi, korelasyon mu nedensellik mi), çalışmanın finansörü ve yazarın ticari bağı gibi sınırları yaz. Bulgunun hangi pazar verisine dayandığını belirt; Türkiye'ye aktarılabilirliği tahmin etme.
- Kısa alıntı yalnız tırnak içinde ve 15 kelimeyi geçmeden. Metni kopyalama, kendi sözlerinle özetle.
- Her pakette `guruCheck` ver: her isim için `result` (`new`, `none`, `unreachable`), baktığın adresler ve kısa not.
- Erişim kuralları dijital gündemle aynı: giriş yapma, ödeme duvarını aşma, yanıt vermeyen sayfayı aynı gün tekrar deneme.

## Çıktı

- Dosya: `research/YYYY-MM-DD.json`
- Biçim: `schema/research.example.json`. Alan adlarını değiştirme.
- `facts`: her madde tek olgu, en fazla 22 kelime. Paragraf yazma.
- `layer` ve `tier` (22 Ekim'den itibaren zorunlu): yukarıdaki "Katmanlı haber seçimi" bölümü.
- `impactDraft`, `actionDraft`, `counterViewDraft` isteğe bağlıdır; yazarsan kısa tut. Son metni Claude yazar.
- `accessLog`: açmayı denediğin her resmî kaynak ve sonucu. Bu kayıt, Claude'un hangi bilgiyi yeniden teyit edeceğini belirler.
- Görsel: haberin kaynak sayfasındaki ana görselin doğrudan https adresi, kredisi ve kaynak sayfası. Görsel üretme.

Göndermeden önce kontrol et:
```
python3 scripts/validate_research.py research/YYYY-MM-DD.json
```
Betik çalıştırılamıyorsa dosyayı şema örneğiyle alan alan karşılaştır.

## Yazma sınırı (zorunlu)

- Tek istisna yayın sonrası rapordur: `research/reviews/YYYY-MM-DD.md` (yukarıdaki "Yayın sonrası okuma ve değerlendirme raporu"). Başka hiçbir dosyada değişiklik yapma.

- **Yalnız `research/` klasörüne yaz.** Commit mesajı: `Araştırma YYYY-MM-DD`.
- Başka hiçbir dosyaya dokunma: `bulletins/`, `index.html`, `assets/`, `PROMPT.md`, `state/`, `scripts/` vb. Bunlar Claude tarafından yönetilir. Dışarıdan değişiklik her gün otomatik kontrolle tespit edilir ve kullanıcıya raporlanır.
- Depo herkese açıktır: müşteriye özel bilgi, bütçe, iç yazışma veya erişim anahtarı ekleme.

## Bildirim ve iletişim

- Claude'a iletmek istediğin her şeyi (çelişkili bilgi, öncelik önerisi, erişim sorunu, talimatta belirsizlik) paketin `researcherNotes` alanına yaz. Claude bunu okur, gerekirse kullanıcıya iletir ve talimatı günceller.
- Paket gönderildikten sonra kısa bildirim: kaç haber, kaç maç, hangi resmî kaynaklar açılamadı, en önemli 2 gelişme. Gönderim başarısızsa "gönderildi" deme; paketi sohbette ilet.

## Talimat değişiklikleri

Tarihli değişiklik kaydı `WORKFLOW.md` sonundaki "Talimat değişiklikleri" bölümündedir. Her çalışmada son kayıtlara bak.
