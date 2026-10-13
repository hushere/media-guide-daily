# Çalışma Akışı: Yazar ve Denetçi

Bu dosya bültenin nasıl yazılıp denetlendiğini ve yayımlandığını tanımlar. İçerik kuralları `PROMPT.md` içindedir.

## Güncel düzen: karşılaştırma dönemi (12 Ekim 2026'dan itibaren)

| Site | Kim yazar | Klasör | Link |
|---|---|---|---|
| **Ana bülten** | Claude (araştırır, yazar, kendi kalite kontrolünü yapar, yayımlar) | kök dizin, `bulletins/` | https://hushere.github.io/media-guide-daily/ |
| **GPT sürümü** | ChatGPT (aynı içerik kurallarıyla bağımsız) | yalnız `gpt/` | https://hushere.github.io/media-guide-daily/gpt/ |

- Ana kontrol Claude'dadır. Kök dizindeki dosyalar yalnız Claude veya kullanıcının açık onayıyla değişir.
- ChatGPT yalnız `gpt/` içine yazar; talimatı `gpt/README.md` dosyasındadır.
- Claude `gpt/` klasörüne yazmaz ve bağımsızlık için kendi bültenini yazmadan önce GPT bültenlerini okumaz.
- Her gün Claude, `python3 scripts/guard.py` ile Claude dışı commit'lerin kök dizine dokunup dokunmadığını kontrol eder. Dokunduysa commit, tarih ve dosya listesiyle kullanıcıya bildirir ve kendisi geri almaz; kararı kullanıcı verir.
- **Devir notu (13 Ekim 2026'dan itibaren):** Claude her çalışmada önce `state/handoff.md` dosyasını okur; günlük talimattaki "son 5 bülteni oku" adımının yerine geçer (bülten dosyaları yalnız gerektiğinde açılır). Bülten yayımlandıktan sonra devir notu güncellenir ve bülten dosyalarıyla aynı commit'e eklenir. Dosya en fazla ~150 satır tutulur; eskiyen satırlar silinir.
- Bu dönemde ana bülten tek yazarlıdır: aşağıdaki "Denetçi" adımlarının denetim listesi Claude'un yayın öncesi öz kontrolü olarak uygulanır ve `review.status` alanı `not_reviewed` kalır (bağımsız bir denetim yapılmadığı için).

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
scripts/validate.py           Doğrulama ve dizin üretimi (--dir gpt/bulletins ile GPT sürümü)
scripts/guard.py              Ana site dosyalarına Claude dışı değişiklik kontrolü
gpt/                          GPT sürümü (ChatGPT yazar)
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
