# Günlük Site Kontrolü: Antigravity

Antigravity her iş günü, bülten 09.15'te yayımlandıktan sonra siteyi kontrol eder ve sonucu bir rapor olarak depoya yazar. Claude ertesi sabah bu raporu okur ve teknik hataları düzeltir.

## Ne zaman

- Hafta içi, 09.15'ten sonra (önerilen: 09.30 - 10.00 arası).
- Antigravity kullanıcının bilgisayarında çalışır; bilgisayar kapalıysa o gün kontrol yapılmaz. Bu bir hata sayılmaz; rapor yoksa Claude devam eder.

## Kontrol listesi

Canlı site: https://hushere.github.io/media-guide-daily/
Günün bülteni: https://hushere.github.io/media-guide-daily/?tarih=YYYY-MM-DD

1. **Yayın:** Günün bülteni açılıyor mu? Tarih ve başlık doğru mu? Arşivde görünüyor mu?
2. **Görseller:** Kaç kartta görsel var, kaçı kırık (kategori bandına düşen)? Kırık görselin kart başlığını yaz.
3. **Linkler:** Her kartın kaynak linklerini ve maç panelindeki ↗ linklerini aç. 404, hata veya alakasız sayfaya gidenleri listele.
4. **Maç paneli ve dijital gündem şeridi:** Görünüyor mu, taşma veya boş alan var mı?
5. **Mobil görünüm:** Tarayıcının mobil görünümünde (390 px genişlik) yatay kayma, üst üste binen metin, kesilen başlık var mı?
6. **Konsol hataları:** Tarayıcı konsolunda kırmızı hata var mı?
7. **Okunabilirlik:** Dikkat çeken biçim sorunu (çok uzun madde, tekrar eden haber, boş bölüm) varsa kısa not.

## Rapor

- Dosya: `qa/YYYY-MM-DD.md`
- Commit mesajı: `QA YYYY-MM-DD`
- **Yalnız `qa/` klasörüne yaz.** Site dosyalarını, bülteni veya kuralları düzeltme; düzeltmeyi Claude yapar.

Şablon:

```markdown
# QA: YYYY-MM-DD

- Kontrol saati: SS:DD
- Sonuç: Sorunsuz | Küçük sorunlar | Kritik sorun

## Görseller
- Var: X / Y kart; kırık: [kart başlıkları]

## Kırık linkler
- [kart başlığı] → [link] → [hata]

## Görünüm (masaüstü / mobil)
- ...

## Konsol hataları
- ...

## Diğer notlar
- ...
```

"Kritik sorun": bülten açılmıyor, sayfa boş, günün tarihi yanlış, ya da kartların yarısından fazlası bozuk.
