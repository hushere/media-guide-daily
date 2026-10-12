# GPT sürümü: ChatGPT için çalışma talimatı

Bu klasör, ana bültenle karşılaştırma için ChatGPT'nin hazırladığı bağımsız bülteni barındırır.

**Site:** https://hushere.github.io/media-guide-daily/gpt/
**Belirli bir gün:** https://hushere.github.io/media-guide-daily/gpt/?tarih=YYYY-MM-DD

## Yazma sınırı (zorunlu)

- **Yalnız `gpt/` klasörü içindeki dosyaları oluştur veya değiştir.**
- Kök dizindeki hiçbir dosyaya dokunma: `index.html`, `assets/`, `bulletins/`, `reviews/`, `scripts/`, `schema/`, `PROMPT.md`, `WORKFLOW.md`, `README.md`. Bunlar ana sitenindir ve Claude tarafından yönetilir.
- Görsel değişiklik gerekiyorsa yalnız `gpt/index.html` ve `gpt/assets/` içinde yap.
- Ana kök dışındaki her değişiklik günlük kontrolde tespit edilir ve kullanıcıya raporlanır.

## Bağımsızlık kuralı

Karşılaştırmanın adil olması için bülteni yazmadan önce ana sitenin bültenlerini (`bulletins/`) **okuma**. Süreklilik, tekrar ve düzeltme kontrolleri için yalnız kendi arşivini (`gpt/bulletins/`) kullan.

## Günlük adımlar (hafta içi, 09.15 Türkiye saati)

1. İçerik kuralları: kök dizindeki `PROMPT.md` dosyasının 1-8 ve 10. bölümlerini eksiksiz uygula. Bölüm 9 (yayın) yerine bu dosyadaki adımlar geçerlidir.
2. Bülten biçimi: `schema/bulletin.example.json` (yalnız okunur).
3. Dosyayı `gpt/bulletins/YYYY-MM-DD.json` olarak yaz:
   - `status: "published"`
   - `review: {"status": "not_reviewed"}`
   - `source: {"writer": "ChatGPT"}`
4. Doğrula ve arşiv dizinini güncelle:
   `python3 scripts/validate.py --dir gpt/bulletins`
   Hata varsa düzeltmeden gönderme. Betik çalıştırılamıyorsa `gpt/bulletins/index.json` dosyasını aynı biçimde elle güncelle (en yeni tarih en üstte).
5. Yalnız `gpt/` içindeki dosyaları `main` dalına gönder. Commit mesajı: `GPT bülten YYYY-MM-DD`.
6. Doğrula: dosya ve dizin kaydı `main` dalında mı, site linki açılıyor mu? Sonra kısa bildirim: 2-3 başlık ve o güne özel link.
7. Gönderim başarısızsa yayımlandı deme; bülteni sohbetten ilet ve engeli açıkla.

## Kısıtlar

- Depo herkese açıktır: özel müşteri bilgisi, bütçe, iç yazışma veya erişim anahtarı ekleme.
- Yapılmamış kontrolü yapılmış gibi gösterme.


## 12 Ekim 2026 kullanıcı güncellemesi: maç paneli

- Haftanın karşılaşmalarını `articles` haber akışına yazma. "Bu sayıda" solda, "Haftanın karşılaşmaları" hemen sağında ayrı paneldir. Mobilde aynı sırayla alt alta gösterilir.
- Her günlük JSON'a `matchesWindow` (dönem), `matchNote` (kontrol sınırı) ve `matches` listesi ekle.
- Her maç: `date` (YYYY-MM-DD), `time` (HH:MM, Türkiye saati; doğrulanmadıysa null), `sport`, `competition`, `home`, `away`, `broadcaster`, `note`, `impact`, `source` (birincil kaynak URL), `sources` (name,url,published,country,language).
- Kapsam ve dönem PROMPT.md 5.3'e göre devam eder. Tarih sıralı yaz. Saat çelişkisini note içinde kaynaklarıyla belirt; kesinmiş gibi tek bir saat seçme. Yayıncı doğrulanmadıysa "Teyit bekleniyor" yaz.
- Maç paneli kaynakları ve planlama etkisi açılabilir olmalıdır. Aynı maçı ayrıca haber kartı yapma. Doğrulanmış maç yoksa boş listeyle doğrulama sınırını açıkla.

## 13 Ekim 2026'dan itibaren: sosyal gündem ve görsel okuma deneyimi

Kullanıcı 12 Ekim 2026'da aşağıdaki değişiklikleri onayladı. İlk uygulama 13 Ekim bülteninde yapılacak ve sonraki sayılarda sürdürülecek. Bu kayıt sırasında mevcut sayfanın arayüzünü değiştirmek gerekmiyor.

### Dijital gündem
- Dijital kapsamına ayrı ve görünür "Sosyal medyada gündem" alanı ekle. Türkiye öncelikli; globalden medya, reklam ve markalar açısından anlamlı örnekler seç.
- Konuşulan konular, yüksek izlenme alan videolar, creator içerikleri ve yayılan yaratıcı formatları araştır. YouTube, TikTok, Instagram ve X gibi platformlarda yalnız erişilebilen kamuya açık, doğrulanabilir kaynakları kullan.
- Her örnekte platform, ülke/coğrafya, içerik bağlantısı, yayın tarihi, ölçüm dönemi ve kontrol zamanı belirt. İzlenme ve etkileşim sayılarını yalnız doğrudan doğrulandığında ver; toplam izlenmeyi son 24 saatin izlenmesi diye sunma.
- "En çok izlenen" veya sıra iddiası yalnız kapsamı ve dönemi belli güvenilir sıralamayla kullanılabilir. Böyle bir veri yoksa "Öne çıkan içerikler" de; kişiselleştirilmiş akışı ülke geneline mal etme. Eksik veri ve erişim sınırlarını açıkla.
- Neden dikkat çektiğini, marka/medya planlaması açısından anlamını ve takip edilecek adımı kısa maddelerle ver. Trend ile temsilî kamuoyu veya ölçülmüş ticari başarıyı karıştırma. Veri yokken bölüm doldurmak için içerik uydurma.

### Görsel haber kartları ve okunabilirlik
- 13 Ekim sayısında haber kartlarına ilgili kaynak görsellerini, resmî kampanya materyallerini veya izin verilen platform embedlerini uygun olduğunda ekle. Kullanım koşullarına uy; kaynak bağlantısı, görsel kredisi ve açıklayıcı alt metin göster. Sadece kaynak göstermek kullanım izni sayılmaz. Uygun görsel yoksa sade tipografik kart kullan, haberi temsil eden sahte görsel üretme.
- İlk görünüm: görsel, kısa başlık, tek cümlelik özet ve 3 kısa alan: "Ne oldu?", "Medya etkisi", "Ne yapmalı?". Her alanda kısa ve anlamlı maddeler kullan; uzun paragrafı noktalama değiştirerek aynen taşıma.
- Counter-View, kapsam/örneklem, detaylı analiz ve kaynakları "Detayı oku" bölümünde erişilebilir tut. Kısaltırken veri, yorum, belirsizlik ve kaynak ayrımını kaybetme.
- Başlık hiyerarşisi, okunabilir yazı boyutu, satır aralığı, makul satır uzunluğu, kart aralıkları ve görsel/metin dengesi kur. Geniş ekranda alanı verimli kullan; mobilde taşma ve sıkışma olmasın. Mevcut beğenilen renk tonlarını koru.
- Kullanıcı arayüz kararlarını tekrar onay istemeden doğrudan uygulamaya yetki verdi. Yalnız gpt/ sınırı geçerlidir. Amaç rahat okuma, anlamlı keşif ve geri dönüşü desteklemektir; geçirilen süre artışı ölçülmeden başarı iddia etme.
- İlgili haber bağlantıları, bölüm navigasyonu, filtreler, kaynak/analiz açma ve arşive geçişle keşfi kolaylaştır. Otomatik oynatma, zorunlu tıklama, gereksiz bölünmüş içerik ve dikkat dağıtan hareket kullanma.
- "Bu sayıda" solda ve maç takvimi sağda düzenini koru. Haber görselleri sayfa yüklenmesini ağırlaştırmasın: uygun boyut, sabit en-boy alanı, geç yükleme ve bozuk görsel alternatifi kullan.
- Yeni alanlar için gpt/ içindeki veri ve renderer biçimini birlikte güncelle; mevcut sayılar açılmaya devam etsin. Kök şema/validator dosyalarına yazma. 13 Ekim dosyası ve canlı sayfada sosyal gündem, görseller, maddeli özetler ve mobil/masaüstü yerleşimi kontrol et; yapılamayan kontrolleri açıkça bildir.
