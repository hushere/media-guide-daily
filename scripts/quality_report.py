#!/usr/bin/env python3
"""Araştırma kalitesi raporu: coverage/*.json ve bültenlerden günlük ölçüm.

Kullanım: python3 scripts/quality_report.py [--last N]
Ölçülenler (kritik ve o gün vadesi gelen kaynaklar üzerinden):
  açık %    resmî/ikincil kaynağın ana sayfası okundu (opened)
  kısmen %  yalnız makale/alt sayfa okundu (partial)
  arama %   yalnız arama yapıldı (search_only)
  erişilmedi % inaccessible; not_checked ayrıca sayılır
  tek alan adı payı: kaynak bağlantılarında en yoğun alan adı
  düzeltme: bülten corrections alanındaki öğe sayısı
Haber sayısı başarı ölçütü değildir. Yalnız Python standart kütüphanesi.
"""
import json, sys
from pathlib import Path
from urllib.parse import urlparse
sys.path.insert(0, str(Path(__file__).resolve().parent))
from validate import ROOT, load_sources, due_today

def main():
    n = int(sys.argv[sys.argv.index("--last") + 1]) if "--last" in sys.argv else 20
    src = load_sources()
    rows = []
    for f in sorted((ROOT / "coverage").glob("*.json"))[-n:]:
        cov = json.loads(f.read_text(encoding="utf-8")); d = cov["date"]
        crit = [i for i, s in src.items() if s.get("critical") and due_today(s, d)]
        c = {"opened": 0, "partial": 0, "search_only": 0, "inaccessible": 0, "not_checked": 0}
        for i in crit:
            c[cov["sources"].get(i, {}).get("status", "not_checked")] += 1
        tot = max(len(crit), 1)
        b = ROOT / "bulletins" / f"{d}.json"
        top, corr = "-", "-"
        if b.exists():
            bd = json.loads(b.read_text(encoding="utf-8"))
            doms = [(urlparse(s.get("url", "")).hostname or "").removeprefix("www.")
                    for a in bd.get("articles", []) for s in a.get("sources", [])]
            if doms:
                t = max(set(doms), key=doms.count); top = f"%{round(100*doms.count(t)/len(doms))} {t}"
            corr = len(bd.get("corrections", []))
        rows.append((d, len(crit), *(round(100 * c[k] / tot) for k in ("opened", "partial", "search_only", "inaccessible")), c["not_checked"], top, corr))
    print("tarih       kritik açık% kısmen% arama% erişilmedi% kontrolsüz tek-alan-adı            düzeltme")
    for r in rows:
        print(f"{r[0]}  {r[1]:>5} {r[2]:>5} {r[3]:>7} {r[4]:>6} {r[5]:>11} {r[6]:>9} {r[7]:<24} {r[8]}")
    if rows:
        print(f"\nOrtalama açık%: {round(sum(r[2] for r in rows)/len(rows))}  |  erişilmedi%: {round(sum(r[5] for r in rows)/len(rows))}")
        print("Not: 'backfill' günler elle yeniden kurulmuştur; karşılaştırma tabanı olarak kullanın, trend için 10 iş günü bekleyin.")
if __name__ == "__main__":
    main()
