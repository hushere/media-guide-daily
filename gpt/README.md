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
