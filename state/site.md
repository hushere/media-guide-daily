# Site notları (tasarım ve geliştirme hafızası)

Yeni bir sohbette site tasarımına devam edecekseniz önce bu dosyayı, sonra `WORKFLOW.md` "Talimat değişiklikleri" son kayıtlarını okuyun. Son güncelleme: 22 Ekim 2026.

## 1. Dosya haritası
| Dosya | Ne yönetir |
|---|---|
| `index.html` | Sayfa iskeleti, CSS/JS çağrıları ve önbellek sürümü (bkz. bölüm 3) |
| `assets/app.js` | Bülten, kart, TV tablosu, dijital gündem, spor takvimi, Media Guru, Günün okuması, Tutum Radarı ve Kısa sinyaller render mantığı |
| `assets/editorial.js` | Dergi düzeni: üst başlık, "Bugün ne var?" galerisi, panel yerleşimi, haber penceresi (dialog) |
| `assets/style.css` | Temel stiller ve açık/koyu tema değişkenleri |
| `assets/experiment.css` | Editoryal düzen ve sonradan eklenen stiller. Stil çakışmasında bu dosya kazanır (en son yüklenir) |
| `data/tv-takvim.json` | TV dizi takvimi verisi (yalnız Claude düzenler) |
| `bulletins/`, `research/`, `state/` | İçerik ve akış (WORKFLOW.md) |
| `deneme/` | ChatGPT'nin görsel denemeleri; dokunulmaz |

## 2. Bugünkü tasarım kararları (neden ile)
- **TV Dizi Takvimi:** Satırlar içeriğe göre yükselir (eskiden hepsi en uzun satıra eşitleniyordu, 200 px). "Günü belirsiz" sütunu biraz geniş (1.55 birim) ve etiket ile not yan yana. Renk: kiremit. Açık modda koyu kiremitten turuncuya başlık, krem kanal sütunu, sarı "bugün" vurgusu. Koyu modda "Koru kiremit": canlı kiremit başlık, sıcak koyu kahve satırlar. Kullanıcı seçti (C açık, C1 koyu). Değişkenler `experiment.css` sonundaki `.tvgrid` bloğunda.
- **Sıralı yeni bölümler (22 Ekim'den itibaren):** Günün okuması ve Tutum Radarı başlığın hemen altında, Kısa sinyaller galeri altında. Alanlar `PROMPT.md` 5.8'de.
- **"Bu ne anlama geliyor?":** Eski "Neden önemli?" etiketi. Ajans, marka ve tüketici gözüyle yazılır.
- **Başlık:** "Daily Media Intelligence" metni başlıktan kaldırıldı. Depo adı değişmedi (kullanıcı kararı).
- **Hareket kontrolü ve bitiş bloğu** kaldırıldı (kullanıcı kararı).

## 3. Önbellek sürümü kuralı (hata geçmişi)
`index.html` içinde **dört** dosya çağrısı vardır: `style.css`, `experiment.css`, `editorial.js`, `app.js`. Her stil veya betik değişikliğinde dördünün `?v=` etiketini birlikte güncelle. 22 Ekim'de `experiment.css` etiketi atlandı, kullanıcı eski renkleri gördü. Güncelleme sonrası komut: `grep -n "v=2026" index.html` ve dördünün aynı olduğunu doğrula.

## 4. Test yöntemi
1. `python3 scripts/validate.py --check` (bülten şeması)
2. Yerel sunucu ile masaüstü (1440) ve mobil (390) genişlikte aç; açık ve koyu temayı ayrı dene. Koyu tema kuralları `:root[data-theme="dark"]` ile yazılır; önizleme yaparken aynı özgüllükte yaz, yoksa renk görünmez.
3. Yatay taşma kontrolü: `document.documentElement.scrollWidth` genişliği aşmamalı.
4. Gerçek ekran görüntüsünü gözle kontrol et; canlı siteye bulut ortamından erişilemez, son kontrolü kullanıcı yapar.
5. `scripts/render_check.py <tarih>` yayın öncesi (bilinen uyarı: "'Bu sayıda' boş", kutu kaldırıldığı için).

## 5. Açık işler
- TV tablosu şu an hero altında; "Bugün ne var?" başlığının altına taşınması teklif edildi, karar bekliyor.
- `render_check.py` içindeki "'Bu sayıda' boş" kontrolü güncellenebilir.
- "hyperframes" sunum formatı tanımlanmadı; kullanıcıdan örnek bekleniyor.
- İlk Tutum Radarı, katman ve kısa sinyal içeren gerçek paket bekleniyor (ChatGPT paketi 22 Ekim'de gelmedi, bülten yedek akışla çıktı).
