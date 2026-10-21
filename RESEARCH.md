# Araştırma Talimatı: ChatGPT (Daily Media Intelligence)

> **Çalışma ilkesi:** Bu dosya ChatGPT için **tek ve güncel talimat kaynağıdır**. Her çalışmada baştan oku; sohbetteki veya görev metnindeki eski talimatlarla çelişirse bu dosya geçerlidir. **Kullanıcıdan onay, seçim veya geri bildirim bekleme**; belirsiz bir durumda en makul yolu seç, kararını `researcherNotes` alanına yaz ve devam et. Kullanıcı yalnız Claude ile iletişim kurar; talimat değişikliklerini Claude bu dosyaya işler.

Bu dosya ChatGPT'nin günlük araştırma görevini tanımlar. ChatGPT bülteni **yazmaz ve yayımlamaz**; doğrulanmış bir **araştırma paketi** hazırlar. Paketi Claude teyit eder, bülten kartlarına çevirir ve 09.15'te siteye yayımlar.

## Zaman

- Hafta içi her gün **07.30 TSİ** başla; paketi en geç **08.30 TSİ**'de depoya gönder.
- 08.30'a yetişmeyecekse, o ana kadar doğrulananları gönder ve `limitations` içine eksikleri yaz. Eksik paket, hiç paket olmamasından iyidir.
- Pencere: önceki paketin `cutoff` saatinden bu paketin gerçek `cutoff` saatine kadar. Önceki paket yoksa son 24 saat (pazartesi: cuma 08.30'dan itibaren).

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

## TV dizi takvimi güncellemesi (her gün, 21 Ekim 2026'dan itibaren)

Sitede "2026 TV Dizi Takvimi" tablosu vardır (kanal x gün). Kaynağı `data/tv-takvim.json` dosyasıdır. Bu dosyayı sen değiştirme, yalnız oku. Önerilerini paketin `tvTableUpdates` alanına yaz. Claude teyit eder ve dosyaya işler.

**Her sabah yapılacaklar**
1. `data/tv-takvim.json` içindeki kayıtları oku. Önce `checked` tarihi 14 günden eski olan (sitede † işaretli) kayıtları resmî yayın akışı ve program sayfasıyla yeniden kontrol et.
2. Yeni dizi, final, gün veya saat değişikliği, kanal değişikliği varsa `tvTableUpdates` içine yaz. Değişiklik yoksa alanı boş liste bırak ve `researcherNotes` içinde "tablo kontrol edildi, değişiklik yok" de.
3. Her öneride `checked` (kontrol ettiğin tarih) ve mümkünse `source` (resmî kaynak, https) ver.

**Kayıt biçimi** (`schema/research.example.json` içinde örnek var)
- `action`: `add`, `update` veya `remove`. `update` ve `remove` için `channel`, `day`, `title` kaydı bulmaya yeter.
- `channel`: ATV, KANAL D, STAR TV, SHOW TV, NOW, TRT 1, TV8. `day`: Pazartesi ... Pazar veya `Günü belirsiz`.
- `status`: `yayinda` (resmî akışta veya arşivde yeni bölüm görüldü), `kanal-teyitli` (kanal açıkladı, henüz yayında değil veya bölüm teyidi yok), `planlanan`, `belirsiz`. Haber sitesi veya kulis bilgisini `belirsiz` yap ve `note` içine "Kulis" yaz.
- `time`: `20.00` biçimi. Saat teyitsizse alanı koyma.
- `note`: tek kısa not (en fazla ~12 kelime).

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
- `impactDraft`, `actionDraft`, `counterViewDraft` isteğe bağlıdır; yazarsan kısa tut. Son metni Claude yazar.
- `accessLog`: açmayı denediğin her resmî kaynak ve sonucu. Bu kayıt, Claude'un hangi bilgiyi yeniden teyit edeceğini belirler.
- Görsel: haberin kaynak sayfasındaki ana görselin doğrudan https adresi, kredisi ve kaynak sayfası. Görsel üretme.

Göndermeden önce kontrol et:
```
python3 scripts/validate_research.py research/YYYY-MM-DD.json
```
Betik çalıştırılamıyorsa dosyayı şema örneğiyle alan alan karşılaştır.

## Yazma sınırı (zorunlu)

- **Yalnız `research/` klasörüne yaz.** Commit mesajı: `Araştırma YYYY-MM-DD`.
- Başka hiçbir dosyaya dokunma: `bulletins/`, `index.html`, `assets/`, `PROMPT.md`, `state/`, `scripts/` vb. Bunlar Claude tarafından yönetilir. Dışarıdan değişiklik her gün otomatik kontrolle tespit edilir ve kullanıcıya raporlanır.
- Depo herkese açıktır: müşteriye özel bilgi, bütçe, iç yazışma veya erişim anahtarı ekleme.

## Bildirim ve iletişim

- Claude'a iletmek istediğin her şeyi (çelişkili bilgi, öncelik önerisi, erişim sorunu, talimatta belirsizlik) paketin `researcherNotes` alanına yaz. Claude bunu okur, gerekirse kullanıcıya iletir ve talimatı günceller.
- Paket gönderildikten sonra kısa bildirim: kaç haber, kaç maç, hangi resmî kaynaklar açılamadı, en önemli 2 gelişme. Gönderim başarısızsa "gönderildi" deme; paketi sohbette ilet.

## Talimat değişiklikleri

Tarihli değişiklik kaydı `WORKFLOW.md` sonundaki "Talimat değişiklikleri" bölümündedir. Her çalışmada son kayıtlara bak.
