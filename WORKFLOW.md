# Çalışma Akışı

Bu dosya bültenin nasıl yazılıp denetlendiğini ve yayımlandığını tanımlar. İçerik kuralları `PROMPT.md` içindedir.

## Güncel düzen: iki araçlı akış (15 Ekim 2026'dan itibaren, kullanıcı kararı)

| Saat (hafta içi) | Araç | Görev | Yazdığı yer |
|---|---|---|---|
| 07.30 - 08.30 | **ChatGPT** | Araştırma ve ilk teyit (`RESEARCH.md`) | yalnız `research/YYYY-MM-DD.json` |
| 08.40 - 09.15 | **Claude** | Paketi doğrular, riskli bilgileri yeniden teyit eder, kartları yazar, yayın öncesi görünüm kontrolü yapar (`scripts/render_check.py`), **09.15'te yayımlar** | `bulletins/`, `state/`, gerekirse site dosyaları |
| 09.15 - 11.00 | **ChatGPT** | Yayımlanmış bülteni okur, her haberi değerlendirir; **hiçbir şeyi değiştirmez**, önerilerini rapor olarak yazar ve kullanıcıya iletir (`RESEARCH.md`) | yalnız `research/reviews/YYYY-MM-DD.md` |
| Gün içi | **Kullanıcı** | Editoryal geri bildirim, düzeltme talebi | - |

- **Ana kontrol Claude'dadır.** `main` dalında `research/` dışındaki her dosya yalnız Claude veya kullanıcının açık onayıyla değişir. `scripts/guard.py` her sabah bunu denetler; ihlal varsa commit, tarih ve dosya listesiyle kullanıcıya bildirilir, Claude kendiliğinden geri almaz.
- **Claude'un teyit kapsamı:** Her haberi baştan araştırmaz. Yeniden teyit eder: `single_secondary` ve `rumor` haberleri, maç yayıncı/saatleri, TV durum değişiklikleri, sayısal veriler ve `accessLog`'da açılamadığı görülen resmî kaynaklara dayanan bilgiler. Teyit edemediğini etiketler veya çıkarır; paketteki önemli bir eksiği görürse kısa ek araştırma yapabilir.
- **Bülten alanları:** `source: {"writer": "ChatGPT araştırması, Claude teyit ve yazım"}`; `review.status`: değişiklik yoksa `approved`, düzeltme/çıkarma varsa `approved_with_changes`; `review.summary`: neyin yeniden teyit edildiği, neyin değiştiği (tek paragraf).
- **TV dizi takvimi (21 Ekim 2026'dan itibaren):** Sitede kanal x gün tablosu `data/tv-takvim.json` dosyasından gösterilir (yalnız en güncel sayıda, maç panelinin altında). ChatGPT her sabah tabloyu kontrol edip paketin `tvTableUpdates` alanına öneri yazar (`RESEARCH.md`). Claude öneriyi teyit eder, dosyaya işler, `updated` tarihini günceller ve `python3 scripts/validate_tv.py` çalıştırır; bülten commit'iyle birlikte yayımlar. Veda tarihi geçen kayıtlar tablodan kaldırılır, başlangıç tarihi geçen "Yeni Dizi" notu kalkar (site bunu tarihe göre kendiliğinden de uygular). `checked` tarihi 14 günden eski kayıtlar sitede † ile işaretlenir.
- **Dijital gündem (21 Ekim 2026'dan itibaren):** Bu araştırmayı yalnız ChatGPT yapar (`RESEARCH.md`). Claude yeniden araştırmaz ve teyit etmez, yalnız biçim kontrolü yapar. Paket gelmezse veya `social` boşsa şerit çıkmaz.
- **Media Guru'larından Notlar (22 Ekim 2026'dan itibaren):** Byron Sharp, Steven Bellman, Virginia Beal, Erica Riebe, Karen Nelson-Field çalışmalarını yalnız ChatGPT izler (`RESEARCH.md`). Claude yeniden araştırmaz, yalnız biçim kontrolü yapar; paket yoksa panel çıkmaz.
- **Yayın sonrası değerlendirme (22 Ekim 2026'dan itibaren):** ChatGPT yayın sonrası her haberi okur, kaynaklarla karşılaştırır ve raporunu `research/reviews/` altına yazar; kullanıcıya da özetler. Dosyaları değiştirmez. Claude ertesi sabah raporu okur, kritik bulguları kaynaktan yeniden teyit eder, kullanıcıya iletir; yalnız kullanıcının onayladığı veya açık olgu hatası olanları uygular (hata düzeltmesi `corrections` alanına yazılır). Raporlar ChatGPT'nin görüşüdür, otomatik doğru kabul edilmez.
- **Yedek kural:** 08.40'ta paket yoksa veya `validate_research.py` hata veriyorsa Claude bülteni kendi araştırmasıyla hazırlar (`review.status: "unreviewed_fallback"`, `source.writer: "Claude (yedek)"`). Bu durumda yayın 09.15'i geçebilir; bildirimde belirtilir. Paket sonradan gelirse yayımlanmış bülten körlemesine ezilmez; yalnız yeni ve doğrulanabilir bilgi eklenir.
- **Görünüm kontrolü (Antigravity yerine):** Claude yayından önce `python3 scripts/render_check.py <tarih>` ile bülteni yerelde masaüstü ve mobil genişlikte açar: JavaScript hatası, kart sayısı, yatay taşma, maç paneli, dijital gündem şeridi, 'Bu sayıda'. Sorun varsa yayından önce düzeltir. Sınır: bulut ortamından dış görsellerin ve linklerin açılıp açılmadığı test edilemez; kullanıcı bir kırık görürse Claude'a bildirir.
- **Araştırmacıya geri bildirim:** Claude düzelttiği veya çıkardığı bilgileri `state/handoff.md` içindeki "Araştırma geri bildirimi" bölümüne yazar; ChatGPT ertesi gün bunu okur.
- **İletişim düzeni (14 Ekim 2026, kullanıcı kararı):** Kullanıcı yalnız Claude ile konuşur. ChatGPT talimatlarını yalnız bu depodan (`RESEARCH.md`, `state/handoff.md`) alır ve kullanıcıdan onay beklemeden çalışır. Kullanıcının istediği değişiklikleri Claude bu dosyalara işler ve aşağıdaki "Talimat değişiklikleri" kaydına tarihli olarak ekler. ChatGPT → Claude: paketteki `researcherNotes`. Claude → ChatGPT: `state/handoff.md` bölüm 9. Claude, araçlardan gelen ve kullanıcının kararını gerektiren konuları kullanıcıya iletir.
- **Devir notu:** Claude her çalışmada önce `state/handoff.md` dosyasını okur ve yayından sonra günceller (bülten dosyalarıyla aynı commit). Dosya en fazla ~150 satır tutulur.

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
RESEARCH.md                   ChatGPT araştırma talimatı
schema/research.example.json  Araştırma paketi şeması
research/YYYY-MM-DD.json      ChatGPT araştırma paketi
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

En yeni en üstte. ChatGPT her çalışmada bu kayda bakar.

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
