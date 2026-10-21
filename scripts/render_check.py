#!/usr/bin/env python3
"""Günün bültenini yerelde tarayıcıda açıp görünüm kontrolü yapar (Antigravity yerine).

Kullanım:
    python3 scripts/render_check.py 2026-10-15

Kontroller (masaüstü 1440 px ve mobil 390 px):
- Sayfa hatasız yükleniyor mu (JavaScript hataları)
- Bülten kartları ve öne çıkanlar görünüyor mu
- Yatay taşma (sayfa ekrandan geniş mi)
- Maç paneli / dijital gündem şeridi verisi varsa sayfada görünüyor mu
- Kaynak ve görsel adresleri https ile mi başlıyor

Sınır: Bulut ortamında dış sitelere ağ erişimi kısıtlı olduğu için görsellerin
ve kaynak linklerinin gerçekten açılıp açılmadığı test edilemez; yalnız biçim kontrol edilir.
Playwright yoksa kontrol atlanır (çıkış kodu 0, "ATLANDI").
"""
import json
import socket
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def free_port():
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    p = s.getsockname()[1]
    s.close()
    return p


def main():
    if len(sys.argv) < 2:
        print("Kullanım: python3 scripts/render_check.py YYYY-MM-DD")
        sys.exit(2)
    date = sys.argv[1]
    data = json.loads((ROOT / "bulletins" / f"{date}.json").read_text(encoding="utf-8"))
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("ATLANDI: playwright kurulu değil.")
        return

    problems = []
    for a in data.get("articles", []):
        for s in a.get("sources", []):
            if not str(s.get("url", "")).startswith("https://"):
                problems.append(f"Kaynak https değil: {a['id']}")
        img = a.get("image")
        if img and not str(img.get("url", "")).startswith("https://"):
            problems.append(f"Görsel https değil: {a['id']}")

    port = free_port()
    srv = subprocess.Popen([sys.executable, "-m", "http.server", str(port), "--bind", "127.0.0.1"],
                           cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.5)
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            for name, width in (("masaüstü", 1440), ("mobil", 390)):
                page = browser.new_page(viewport={"width": width, "height": 900})
                errors = []
                page.on("pageerror", lambda e, errors=errors: errors.append(str(e)))
                page.goto(f"http://127.0.0.1:{port}/?tarih={date}")
                page.wait_for_timeout(2500)
                cards = page.locator("#articles article.card").count()
                if cards == 0:
                    # 20 Ekim 2026 tasarımı: haberler kare kapak galerisinde (.story-cover) gösterilir
                    cards = page.locator(".story-cover").count()
                    if cards:
                        page.locator(".story-cover").first.click()
                        page.wait_for_timeout(500)
                        if not page.locator(".story-dialog-content").inner_text().strip():
                            problems.append(f"{name}: haber penceresi boş açılıyor")
                        page.keyboard.press("Escape")
                over = page.evaluate("document.documentElement.scrollWidth") - width
                if errors:
                    problems.append(f"{name}: JavaScript hatası: {errors[0][:160]}")
                if cards != len(data.get("articles", [])):
                    problems.append(f"{name}: kart sayısı {cards}, bültende {len(data.get('articles', []))}")
                if over > 2:
                    problems.append(f"{name}: yatay taşma {over}px")
                if data.get("matches") and page.locator(".fixtures").count() == 0:
                    problems.append(f"{name}: maç paneli görünmüyor")
                if (data.get("social") or {}).get("items") and page.locator(".social").count() == 0:
                    problems.append(f"{name}: dijital gündem şeridi görünmüyor")
                if page.locator(".highlights li").count() == 0:
                    problems.append(f"{name}: 'Bu sayıda' boş")
                page.close()
            browser.close()
    finally:
        srv.terminate()

    imgs = sum(1 for a in data.get("articles", []) if a.get("image"))
    print(f"Görselli kart: {imgs}/{len(data.get('articles', []))} (dış erişim test edilmedi)")
    if problems:
        print("SORUN:")
        for x in problems:
            print("  -", x)
        sys.exit(1)
    print("OK: masaüstü ve mobil görünüm kontrolü temiz.")


if __name__ == "__main__":
    main()
