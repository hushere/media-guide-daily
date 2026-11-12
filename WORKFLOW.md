# Çalışma Akışı

Bu dosya bültenin nasıl yazılıp denetlendiğini ve yayımlandığını tanımlar. İçerik kuralları `PROMPT.md` içindedir.

## Güncel düzen: tek araçlı akış (11 Kasım 2026'dan itibaren, kullanıcı kararı)

10 Kasım 2026'da kullanıcı ChatGPT'nin akıştan çıktığını bildirdi; ChatGPT'ye atanmış tüm görevler 11 Kasım'dan itibaren Claude'dadır. `research/` paketi beklenmez, `validate_research.py` çalıştırılmaz, paketin gelmemesi aksama değildir.

| Saat (hafta içi) | Görev | Yazdığı yer |
|---|---|---|
| 07.30 - 09.15 | **Claude sabah görevi:** araştırma (eski ChatGPT görevleri dahil), teyit, yazım, görünüm kontrolü (`scripts/render_check.py`), **09.15'te yayın** | `bulletins/`, `state/`, `data/tv-takvim.json`, gerekirse site dosyaları |
| 10.30 - 11.30 | **Claude yayın sonrası değerlendirme:** yayımlanmış bülteni ayrı bir oturumda baştan okur, kaynaklarla karşılaştırır, raporlar; yalnız açık olgu hatalarını düzeltir | `reviews/YYYY-MM-DD.md`, gerekirse `bulletins/` ve `state/handoff.md` |
| Gün içi | **Kullanıcı:** editoryal geri bildirim, düzeltme talebi | - |

- **Ana kontrol Claude'dadır.** `main` dalındaki dosyalar yalnız Claude veya kullanıcının açık onayıyla değişir. `scripts/guard.py` her sabah Claude dışı commit'leri denetler; ihlal varsa kullanıcıya bildirilir, Claude kendiliğinden geri almaz.
- **Araştırma talimatı:** `RESEARCH.md` artık Claude'un araştırma kontrol listesidir (katmanlar, teyit seviyeleri, dijital gündem kaynakları, guru kontrolü, TV tablosu, yayın sonrası değerlendirme). İçerik kuralları `PROMPT.md`.
- **Alt ajanlar (PROMPT.md 10):** Araştırma paralel alt ajanlarla (`model: "sonnet"`) yapılır; önerilen bölüşüm: (1) TV ve TV tablosu, (2) spor, (3) Türkiye sektör ve rakip, (4) global, yaratıcı mecra vakası, (5) dijital gündem ve guru notları; cuma ek olarak sinema. Yazım, karar ve bölüm 8 kalite kontrolü ana modelde kalır. Hedef: araştırma 08.40'ta biter, yazım 09.05'te.
- **Bülten alanları:** `source: {"writer": "Claude"}`; `review.status: "approved"` (Claude teyit ve bölüm 8 kalite kontrolü yapıldı), `review.summary`: neyin resmî kaynakla teyit edildiği, neyin açılamadığı (tek paragraf). Kısmi tarama ise `edition: "selection"`. Yayın sonrası değerlendirmede düzeltme yapılırsa `review.status: "approved_with_changes"` ve `corrections` alanı.
- **TV dizi takvimi:** `data/tv-takvim.json` Claude'dadır. **Her sabah** 7 kanalın resmî akışı bulunulan haftanın tamamı için karşılaştırılır (en az bugün ve yarın zorunlu), farklar aynı gün `data/tv-takvim.json` içine işlenir. Değişiklikten sonra `updated` tarihi güncellenir ve `python3 scripts/validate_tv.py` çalıştırılır; bülten commit'iyle yayımlanır. Kurallar `RESEARCH.md` "TV dizi takvimi güncellemesi".
- **Dijital gündem ve Media Guru'larından Notlar:** Claude araştırır (`RESEARCH.md` ilgili bölümler, `PROMPT.md` 5.6, 5.7). Doğrulanmış öğe yoksa alan eklenmez; `limitations` içine nedeni yazılır.
- **Yayın sonrası değerlendirme:** Ayrı zamanlanmış oturum, `RESEARCH.md` "Yayın sonrası okuma ve değerlendirme raporu" kontrollerini uygular, raporu `reviews/YYYY-MM-DD.md` olarak yazar. Yalnız kaynakla çelişen açık olgu hatalarını (sayı, tarih, saat, yayıncı, isim) bültende düzeltir ve `corrections` alanına yazar; editoryal önerileri yalnız rapora ve devir notu bölüm 9'a yazar, uygulamaz (kullanıcı onaylarsa sonraki sabah uygulanır).
- **Görünüm kontrolü:** Yayından önce `python3 scripts/render_check.py <tarih>`. Sınır: bulut ortamından dış görsellerin ve linklerin açılıp açılmadığı test edilemez.
- **Öz geri bildirim:** Devir notu bölüm 9 "Araştırma geri bildirimi" artık Claude'un kendi düzeltme/değerlendirme notlarıdır; sabah görevi okur, değerlendirme görevi yazar.
- **İletişim düzeni:** Kullanıcı yalnız Claude ile konuşur. Kullanıcının istediği değişiklikler bu dosyalara işlenir ve "Talimat değişiklikleri" kaydına tarihli eklenir.
- **Devir notu:** Her çalışmada önce `state/handoff.md` okunur, yayından sonra güncellenir (bülten dosyalarıyla aynı commit). En fazla ~150 satır.
- **Arşiv:** `research/` altındaki ChatGPT paketleri (14 Ekim - 9 Kasım 2026) ve `research/reviews/` raporları arşiv olarak kalır; değiştirilmez.

## Roller (ileride yazar/denetçi düzenine geçilirse)

| Rol | Görev | Yetki |
|---|---|---|
| **Yazar** | Araştırır, bülteni taslak olarak yazar | Yalnız `draft/YYYY-MM-DD` dalına yazar |
| **Denetçi (ana kontrol)** | Taslağı doğrular, düzeltir, onaylar ve yayımlar | `main` dalına yazan tek rol |

Rol dağılımı kullanıcı kararıyla değişir; değişirse yalnız bu bölüm güncellenir.

## Depo düzeni

```
PROMPT.md                     İçerik kuralları
WORKFLOW.md                   Bu dosya
schema/bulletin.example.json  Bülten JSON örneği ve alan açıklamaları
bulletins/YYYY-MM-DD.json     Günlük bülten
bulletins/index.json          Arşiv dizini (betik üretir, elle düzenleme)
reviews/YYYY-MM-DD.md         Denetim raporu
state/handoff.md              Günlük devir notu (bir sonraki çalışmanın hafızası)
RESEARCH.md                   Araştırma kontrol listesi (Claude; 11 Kasım'a kadar ChatGPT talimatıydı)
schema/research.example.json  Araştırma paketi şeması
research/YYYY-MM-DD.json      Eski ChatGPT araştırma paketleri (arşiv)
reviews/YYYY-MM-DD.md         Yayın sonrası değerlendirme raporu (Claude)
scripts/validate.py           Bülten doğrulama ve dizin üretimi
scripts/validate_research.py  Araştırma paketi doğrulama
scripts/validate_tv.py        TV dizi takvimi (data/tv-takvim.json) doğrulama
data/tv-takvim.json           Sitedeki TV dizi takvimi tablosunun verisi
scripts/render_check.py       Yayın öncesi masaüstü/mobil görünüm kontrolü
scripts/guard.py              İzinli klasörler dışına Claude dışı değişiklik kontrolü
index.html, assets/           Site (GitHub Pages)
```

## Günlük akış (hafta içi, Türkiye saati)

### 1. Yazar: 09.15

1. `main` dalını güncel haliyle al. `bulletins/index.json` ve son 5 bülteni oku: tekrarlar, TV takvimi, sinema eşikleri, kullanılmış yaratıcı vakalar, açık düzeltmeler ve önceki bültenin gerçek bilgi kesim saati (tarama penceresinin başlangıcı).
2. `PROMPT.md` kurallarıyla araştır.
3. `draft/YYYY-MM-DD` dalını aç ve `bulletins/YYYY-MM-DD.json` dosyasını yaz:
   - `status: "draft"`
   - `review: {"status": "not_reviewed"}`
   - `source: {"writer": "<yazar adı>"}`
4. `python3 scripts/validate.py --check` çalıştır; hata varsa düzelt.
5. Dalı gönder. `main` dalına yazma.

### 2. Denetçi: 10.45

1. `draft/YYYY-MM-DD` dalındaki taslağı oku.
2. Denetim (her haber için):
   - Kaynağı aç; iddia, sayı, tarih ve saat kaynakla uyumlu mu?
   - Yayın tarihi ile olay tarihi ayrılmış mı? Tarama penceresinde mi, değilse "Gecikmeli fakat önemli" etiketi var mı?
   - Veri, kaynak yorumu ve analitik çıkarım ayrılmış mı?
   - Planlama etkisi ve aksiyon somut mu, uydurma mı?
   - Counter-View gerçek bir alternatif açıklama veya sınır mı?
3. Bölüm kontrolleri: `PROMPT.md` bölüm 8 listesinin tamamı. Özellikle spor (derbi, Avrupa maçları, dışlanan branşlar, yayıncı) ve TV takvim karşılaştırması (reyting takibi 13 Ekim 2026 itibarıyla kapsam dışı).
4. Eksik kalan önemli konuyu araştırıp ekle veya `limitations` içine yaz. Yanlış bilgiyi düzelt; doğrulanamayan bilgiyi çıkar veya etiketle.
5. `reviews/YYYY-MM-DD.md` raporunu yaz (şablon aşağıda).
6. Bülten dosyasında:
   - `status: "published"`
   - `review.status`: değişiklik yoksa `approved`, değişiklik varsa `approved_with_changes`
   - `review.reviewer`, `review.reviewedAt`, `review.summary` (tek paragraf), `review.reportPath`
7. `python3 scripts/validate.py` çalıştır (dizini yeniden üretir).
8. Bülten, rapor ve `bulletins/index.json` dosyalarını `main` dalına gönder.
9. Doğrula: `main` dalında dosya var, dizinde kayıt var, site bağlantısı açılıyor. Sonra bildirim gönder.

### 3. Yedek kural

- **10.45'te taslak yoksa:** Denetçi bülteni kendisi yazar, kendi denetim listesinden geçirir ve `review.status: "unreviewed_fallback"` ile yayımlar. Rapora yazarın taslağının gelmediğini not eder.
- **Taslak sonradan gelirse:** Yayımlanmış bülteni körlemesine ezme. Taslakta yeni ve doğrulanabilir içerik varsa ekle, `corrections` veya denetim notunda belirt.
- **Gönderim başarısızsa:** Yayımlandı deme. Bülteni bildirim içinde ilet, engeli açıkla. Sonraki çalışmada eksik günü tamamla.

## Denetim raporu şablonu (`reviews/YYYY-MM-DD.md`)

```markdown
# Denetim: YYYY-MM-DD

- Yazar: <ad> | Taslak saati: <saat veya "gelmedi">
- Denetçi: <ad> | Denetim saati: <saat>
- Sonuç: approved | approved_with_changes | unreviewed_fallback

## Düzeltilenler
- <haber id>: ne yanlıştı, ne yapıldı, kaynak

## Eklenenler / çıkarılanlar
- ...

## Doğrulanamayanlar
- ...

## Yazara geri bildirim
- Tekrarlayan hata türleri ve bir sonraki taslak için not
```

"Yazara geri bildirim" bölümü, yazarın sonraki gün okuması içindir. Aynı hata üç kez tekrarlanırsa `PROMPT.md` için kural önerisi olarak kullanıcıya iletilir; `PROMPT.md` kullanıcı onayı olmadan değiştirilmez.

## Genel kurallar

- `main` dalına yalnız denetçi yazar. `PROMPT.md` ve `WORKFLOW.md` yalnız kullanıcı onayıyla değişir.
- Depo herkese açıktır. Özel müşteri bilgisi, bütçe, iç yazışma, kişisel veri veya erişim anahtarı ekleme.
- Yapılmamış bir kontrolü yapılmış gibi gösterme.

## Talimat değişiklikleri

En yeni en üstte. Claude her çalışmada bu kayda bakar.

- **2026-11-12 (ek):** Tablodaki kanallarda maç yayını varsa maçın kendisi (MAÇ rozeti, `air: "mac"`) ve maçtan önce veya sonra kaydırılmış yeni bölümlü diziler gerçek saatiyle tabloya eklenir (kullanıcı kararı). Resmî akışta "Yeni Bölüm" yazıyorsa eklenir, tekrar ise TKR. Ayrıntı `RESEARCH.md` "TV dizi takvimi güncellemesi" madde 7.
- **2026-11-12:** TV Dizi Takvimi kontrolü **günlük** oldu (kullanıcı kararı; eski kural "her Pazartesi" kalktı). Claude her sabah 7 kanalın resmî akışıyla tabloyu karşılaştırıp aynı gün günceller. Neden: 9 Kasım haftalık kontrolü yapılmamış, ATV Cumartesi kaydı 3 hafta eski kalmış, ATV Perşembe maç nedeniyle yanlıştı. 12 Kasım'da düzeltildi (ATV Perşembe 22.15 TKR, Cumartesi kaydı kaldırıldı). TV8 sitesi o gün "yenileniyor" sayfasındaydı, doğrulanamadı.
- **2026-11-10:** ChatGPT akıştan çıktı (kullanıcı kararı); tüm görevleri 11 Kasım'dan itibaren Claude'da. Sabah görevi 07.30'da başlar (araştırma + teyit + yazım + 09.15 yayın; dijital gündem, guru notları ve TV tablosu dahil). Yayın sonrası değerlendirme hafta içi 10.30'da ayrı Claude görevi olarak çalışır, raporu `reviews/` altına yazar, yalnız açık olgu hatalarını düzeltir. Paket gelmemesi artık aksama değildir.

- **2026-10-22:** TV Dizi Takvimi kuralları değişti (kullanıcı kararı). Yayındaki dizide yalnız saat görünür; yeni dizide doğrulanmış tarih ya da "Başlangıç tarihi açıklanmadı"; dönen dizi için "Yeni Sezon" etiketi (`tag: "sezon"`); yeni bölüm gelmeyen haftada TKR (`air: "tkr"`) veya yerine konan program; "Günü belirsiz" dizi başladıysa gerçek gününe taşınır; † kayıtta bilgi yoksa kaldırılır, varsa kalır. TV tablosu kontrolü **ChatGPT'ye atandı: her Pazartesi** tüm tablo kanal sayfalarıyla karşılaştırılır, öneriler `tvTableUpdates` ile gelir, Claude teyit edip işler (Claude kanal sitelerinden doğrudan da kontrol edebilir). Var olan dizi yeniden başlıyorsa "Yeni Sezon" etiketi kullanıcı tarafından onaylandı. 22 Ekim'de tablo 7 kanalın resmî akışından yeniden kuruldu (Mercan Köşk bitti, kaldırıldı). Ayrıntı `RESEARCH.md` "TV dizi takvimi güncellemesi".
- **2026-10-22:** "Günün okuması" kaldırıldı (kullanıcı kararı). `dayRead` artık yazılmaz, doğrulayıcı istemez, site çizmez; eski bültenlerdeki alan arşivde kalır. ChatGPT incelemelerinde `dayRead` kontrolü yapılmaz. "Tutum Radarı" adı **Radar** oldu (JSON alanı `attitudeRadar` aynı) ve sitede Spor Takvimi ile yan yana gösterilir; Dijital Gündem ve Media Guru paneli altta kalır.
- **2026-10-21:** Yeni ChatGPT görevi: yayın sonrası okuma ve değerlendirme raporu (22 Ekim'den itibaren). Her haberi okur, değişiklik yapmaz, önerilerini `research/reviews/YYYY-MM-DD.md` dosyasına yazar ve kullanıcıya özetler. Ayrıntı `RESEARCH.md`.
- **2026-10-21:** Katmanlı haber seçimi (6 katman), iki kademe (Ana haberler + Kısa sinyaller), "Günün okuması" ve her gün "Tutum Radarı" eklendi (22 Ekim bülteninden itibaren). ChatGPT araştırma paketinde her kayda `layer` ve `tier` yazar (`RESEARCH.md`). Claude `dayRead`, `attitudeRadar` ve `signals` alanlarını yazar (`PROMPT.md` 5.8). "Neden önemli?" etiketi "Bu ne anlama geliyor?" oldu; okuma notu ajans, marka ve tüketici gözüyle yazılır.
- **2026-10-21:** Hiçbir şirket "kendi şirket / bizim taraf / rakip değil" diye etiketlenmez. Paketlerde ve bültenlerde tüm şirketler aynı tarafsız dille yazılır; `rivalCheck` satırlarına bu tür not eklenmez.
- **2026-10-21:** "Media Guru'larından Notlar" paneli eklendi (Dijital Gündem ve Spor Takvimi yanında). ChatGPT her gün Byron Sharp, Steven Bellman, Virginia Beal, Erica Riebe ve Karen Nelson-Field'in yeni çalışmalarını kontrol eder; önemli olan en fazla 3 öğeyi paketin `gurus` alanına, kontrol sonucunu `guruCheck` alanına yazar (`RESEARCH.md`). Önemli yayın yoksa alan koyulmaz. Claude araştırmaz ve yeniden teyit etmez.

- **2026-10-21:** Dijital gündem kapsamı genişledi: yalnız ChatGPT araştırır. Tek platforma (Google, Netflix) bağlı kalma; Türkiye gündemi ile Türkiye'de henüz görünmeyen global trendler birlikte, `market` alanıyla. Kullanıcının verdiği başlangıç kaynak listesi `RESEARCH.md` "Dijital gündem araştırması" bölümündedir. Yanıt vermeyen, girişli, ücretli veya uygunsuz kaynak aynı gün tekrar denenmez; paketteki `socialSourceReview` ile `remove` önerilir, Claude listeden çıkarır. Claude bu araştırmayı yapmaz, paket yoksa yedekte de yapmaz.

- **2026-10-21:** Sitede "2026 TV Dizi Takvimi" tablosu eklendi (`data/tv-takvim.json`). ChatGPT'nin yeni günlük görevi: tabloyu kontrol et, değişiklikleri `tvTableUpdates` alanına yaz (`RESEARCH.md` "TV dizi takvimi güncellemesi"). Önce 14 günden eski (†) kayıtları yeniden teyit et. Dosyayı doğrudan değiştirme.

- **2026-10-15:** Sitede "Kaydedilenler": kartlardaki ☆ ile haber kaydetme (yalnız okuyucunun tarayıcısında). Bülten verisini etkilemez; haber `id` değerleri yayından sonra değiştirilmemeli (kayıtlar id ile bağlanır).

- **2026-10-14:** Antigravity akıştan çıkarıldı (kullanıcı kararı). Site görünüm kontrolünü Claude yayından önce `scripts/render_check.py` ile yapar. `QA.md` ve `qa/` kaldırıldı.

- **2026-10-14:** Üç araçlı akış başladı (ilk çalışma 15 Ekim). ChatGPT 07.30-08.30 araştırma paketi (`RESEARCH.md`), Claude 08.40 teyit ve 09.15 yayın, Antigravity 09.30 site kontrolü (`QA.md`). GPT karşılaştırma sitesi kaldırıldı. Araçlar kullanıcıdan onay beklemeden çalışır; talimat kaynağı yalnız bu depo.
- **2026-10-14:** PROMPT.md 4.1: resmî kaynak listesi; "Fiilen yayında" yalnız resmî akış/bölüm arşiviyle; maç yayıncısı resmî veya iki bağımsız kaynakla; rakip şirket sayfaları zorunlu; madde ≤22 kelime.
- **2026-10-13:** Reyting takibi kapsam dışı. Sinema kontrolü yalnız cuma. Global en fazla 5 haber. Cuma bülteninde "Haftanın özeti".
