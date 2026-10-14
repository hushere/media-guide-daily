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
3. **Rakip marka gelişmeleri:** PROMPT.md 5.2 şirket evreni. Haber araması + şirketlerin kendi sayfaları + MediaCat/Marketing Türkiye'de marka adıyla arama. Ülker rakip değildir.
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
