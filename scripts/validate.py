#!/usr/bin/env python3
"""Bülten dosyalarını doğrular ve bulletins/index.json arşiv dizinini yeniden üretir.

Kullanım:
    python3 scripts/validate.py            # tüm bültenleri doğrula + index üret
    python3 scripts/validate.py --check    # yalnız doğrula, dosya yazma

Yalnız Python standart kütüphanesi kullanır. Hata varsa çıkış kodu 1 olur.
"""
import json
import re
import sys
from datetime import date as _date
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent


def bulletin_dir():
    """--dir <klasör> verilirse o klasördeki bültenler kullanılır."""
    if "--dir" in sys.argv:
        return (ROOT / sys.argv[sys.argv.index("--dir") + 1]).resolve()
    return ROOT / "bulletins"

CATEGORIES = {
    "TV & Entertainment", "Dijital & AI", "Ölçüm & Araştırma", "Ajans & Marka",
    "Rekabet", "Spor", "Sinema", "Yaratıcı Mecra", "Etkinlik",
}
LAYERS = {"Medya tüketimi ve izleyici", "Reklam pazarı ve para", "Platform ve ürün", "Marka ve kampanya", "Tüketici ve ekonomi", "Düzenleme ve sektör"}
REGIONS = {"Türkiye", "Global"}
EDITIONS = {"daily", "selection"}
STATUSES = {"draft", "published"}
REVIEW_STATUSES = {"not_reviewed", "approved", "approved_with_changes", "unreviewed_fallback"}

TOP_REQUIRED = ["date", "title", "summary", "edition", "window", "status", "articles",
                "watchlist", "limitations", "corrections", "highlights", "review"]
ARTICLE_REQUIRED = ["id", "title", "region", "category", "market", "eventDate", "summary",
                    "body", "impact", "action", "counterView", "sources"]
SOURCE_REQUIRED = ["name", "url", "published", "country", "language"]
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def nonempty_str(v):
    return isinstance(v, str) and v.strip() != ""


def validate(path: Path, data: dict) -> list:
    errs = []
    stem = path.stem
    for k in TOP_REQUIRED:
        if k not in data:
            errs.append(f"üst alan eksik: {k}")
    if errs:
        return errs

    if data["date"] != stem:
        errs.append(f"date ({data['date']}) dosya adıyla ({stem}) aynı değil")
    if not DATE_RE.match(str(data["date"])):
        errs.append("date YYYY-MM-DD biçiminde olmalı")
    for k in ("title", "summary", "window"):
        if not nonempty_str(data[k]):
            errs.append(f"{k} boş olamaz")
    if data["edition"] not in EDITIONS:
        errs.append(f"edition 'daily' veya 'selection' olmalı: {data['edition']}")
    if data["edition"] == "selection" and not data["limitations"]:
        errs.append("selection sürümünde limitations boş olamaz")
    if data["status"] not in STATUSES:
        errs.append(f"status 'draft' veya 'published' olmalı: {data['status']}")
    for k in ("watchlist", "limitations", "corrections", "highlights"):
        if not isinstance(data[k], list) or not all(nonempty_str(x) for x in data[k]):
            errs.append(f"{k} metin listesi olmalı")

    rv = data["review"]
    if not isinstance(rv, dict) or rv.get("status") not in REVIEW_STATUSES:
        errs.append(f"review.status şunlardan biri olmalı: {sorted(REVIEW_STATUSES)}")

    matches = data.get("matches", [])
    if not isinstance(matches, list):
        errs.append("matches liste olmalı")
        matches = []
    for i, m in enumerate(matches):
        tag = f"matches[{i}]"
        for k in ("date", "sport", "competition", "home", "away"):
            if not nonempty_str(m.get(k)):
                errs.append(f"{tag}: {k} eksik")
        if nonempty_str(m.get("date")) and not DATE_RE.match(m["date"]):
            errs.append(f"{tag}: date YYYY-MM-DD olmalı")
        t = m.get("time")
        if t is not None and not re.match(r"^\d{2}:\d{2}$", str(t)):
            errs.append(f"{tag}: time SS:DD olmalı veya teyitsizse null")
        if m.get("broadcaster") is not None and not nonempty_str(m.get("broadcaster")):
            errs.append(f"{tag}: broadcaster metin olmalı veya teyitsizse null")
        if not nonempty_str(m.get("source")) or not m["source"].startswith("https://"):
            errs.append(f"{tag}: source https:// ile başlayan resmî kaynak olmalı")
        if m.get("sport") in ("Erkek voleybolu", "Kadın futbolu", "Kadın basketbolu", "Hentbol"):
            errs.append(f"{tag}: {m['sport']} kapsam dışı")
    if matches and not nonempty_str(data.get("matchesWindow")):
        errs.append("matches varsa matchesWindow (kapsanan tarih aralığı) gerekli")

    soc = data.get("social")
    if soc is not None:
        if not isinstance(soc, dict) or not isinstance(soc.get("items"), list):
            errs.append("social {window, note, items[]} biçiminde olmalı")
        else:
            for i, it in enumerate(soc["items"]):
                tag = f"social.items[{i}]"
                for k in ("platform", "title", "url", "source"):
                    if not nonempty_str(it.get(k)):
                        errs.append(f"{tag}: {k} eksik")
                if nonempty_str(it.get("url")) and not it["url"].startswith("https://"):
                    errs.append(f"{tag}: url https:// ile başlamalı")
                if it.get("market") is not None and it["market"] not in ("Türkiye", "Global, Türkiye'de henüz yok", "Global, Türkiye'de de görünür"):
                    errs.append(f"{tag}: market geçersiz")

    gu = data.get("gurus")
    if gu is not None:
        if not isinstance(gu, dict) or not isinstance(gu.get("items"), list) or not gu["items"]:
            errs.append("gurus {window, note, items[]} biçiminde ve boş olmayan olmalı")
        else:
            if len(gu["items"]) > 3:
                errs.append("gurus.items en fazla 3 öğe olmalı")
            for i, it in enumerate(gu["items"]):
                tag = f"gurus.items[{i}]"
                for k in ("person", "title", "evidence", "url", "source", "published"):
                    if not nonempty_str(it.get(k)):
                        errs.append(f"{tag}: {k} eksik")
                if nonempty_str(it.get("url")) and not it["url"].startswith("https://"):
                    errs.append(f"{tag}: url https:// ile başlamalı")

    gate = str(data.get("date", "")) >= "2026-10-22"  # katman ve Radar: 22 Ekim 2026'dan itibaren zorunlu
    # dayRead (Günün okuması) 22 Ekim 2026'da kaldırıldı: istenmez, çizilmez. Eski bültenlerdeki alan arşiv verisi olarak kalır.
    ar = data.get("attitudeRadar")
    if gate and ar is None:
        errs.append("attitudeRadar (Radar) zorunlu")
    if ar is not None:
        if not isinstance(ar, dict) or not isinstance(ar.get("items"), list) or not ar["items"]:
            errs.append("attitudeRadar {note, items[]} biçiminde ve boş olmayan olmalı")
        else:
            if not 2 <= len(ar["items"]) <= 4:
                errs.append("attitudeRadar.items 2-4 öğe olmalı")
            for i, it in enumerate(ar["items"]):
                tag = f"attitudeRadar.items[{i}]"
                for k in ("tag", "text"):
                    if not nonempty_str(it.get(k)):
                        errs.append(f"{tag}: {k} eksik")
                if len(str(it.get("text", "")).split()) > 35:
                    errs.append(f"{tag}: text 35 kelimeyi aşıyor")
                if it.get("basis") not in ("Veri", "İşaret"):
                    errs.append(f"{tag}: basis 'Veri' veya 'İşaret' olmalı")
                if it.get("recurrence") not in ("Yeni", "Tekrar ediyor", "Tek günlük olabilir"):
                    errs.append(f"{tag}: recurrence 'Yeni', 'Tekrar ediyor' veya 'Tek günlük olabilir' olmalı")
                if "refs" in it and (not isinstance(it["refs"], list) or not all(nonempty_str(x) for x in it["refs"])):
                    errs.append(f"{tag}: refs metin listesi olmalı")
    sg = data.get("signals")
    if gate and sg is None:
        errs.append("signals (Kısa sinyaller) zorunlu")
    if sg is not None:
        if not isinstance(sg, list):
            errs.append("signals liste olmalı")
        else:
            if len(sg) > 6:
                errs.append("signals en fazla 6 öğe olmalı")
            if gate and len(sg) < 4:
                print(f"UYARI {path.name}: signals {len(sg)} öğe (hedef 4-6); eksiği limitations içinde belirt")
            for i, it in enumerate(sg):
                tag = f"signals[{i}]"
                for k in ("layer", "region", "text", "source", "url", "published"):
                    if not nonempty_str(it.get(k)):
                        errs.append(f"{tag}: {k} eksik")
                if it.get("layer") not in LAYERS:
                    errs.append(f"{tag}: layer geçersiz")
                if it.get("region") not in REGIONS:
                    errs.append(f"{tag}: region 'Türkiye' veya 'Global' olmalı")
                if nonempty_str(it.get("url")) and not it["url"].startswith("https://"):
                    errs.append(f"{tag}: url https:// ile başlamalı")
                if len(str(it.get("text", "")).split()) > 30:
                    errs.append(f"{tag}: text 30 kelimeyi aşıyor")
    if gate:
        layers_seen = {a.get("layer") for a in data["articles"] if isinstance(a, dict)} | {x.get("layer") for x in (sg or []) if isinstance(x, dict)}
        if len(layers_seen & LAYERS) < 4:
            print(f"UYARI {path.name}: yalnız {len(layers_seen & LAYERS)} katman var (hedef en az 4); limitations içinde açıkla")

    wk = data.get("weekly")
    if wk is not None:
        if not isinstance(wk, dict) or not isinstance(wk.get("items"), list) or not wk["items"]:
            errs.append("weekly {window, items[], open[]} biçiminde olmalı")
        else:
            if len(wk["items"]) > 3:
                errs.append("weekly.items en fazla 3 öğe olmalı")
            for i, it in enumerate(wk["items"]):
                if not nonempty_str(it.get("title")):
                    errs.append(f"weekly.items[{i}]: title eksik")
            if not isinstance(wk.get("open", []), list):
                errs.append("weekly.open metin listesi olmalı")

    arts = data["articles"]
    if not isinstance(arts, list) or not arts:
        errs.append("articles boş olamaz")
        return errs
    seen = set()
    for i, a in enumerate(arts):
        tag = f"articles[{i}] ({a.get('id', '?')})"
        for k in ARTICLE_REQUIRED:
            if k not in a:
                errs.append(f"{tag}: alan eksik: {k}")
        if any(k not in a for k in ARTICLE_REQUIRED):
            continue
        if a["id"] in seen:
            errs.append(f"{tag}: id tekrar ediyor")
        seen.add(a["id"])
        if not re.match(r"^[a-z0-9-]+$", a["id"]):
            errs.append(f"{tag}: id yalnız küçük harf, rakam ve tire içermeli")
        if a["category"] not in CATEGORIES:
            errs.append(f"{tag}: geçersiz category: {a['category']}")
        if gate and a.get("layer") not in LAYERS:
            errs.append(f"{tag}: layer şunlardan biri olmalı: {sorted(LAYERS)}")
        if a["region"] not in REGIONS:
            errs.append(f"{tag}: region 'Türkiye' veya 'Global' olmalı")
        for k in ("title", "summary", "impact", "action", "counterView", "market", "eventDate"):
            if not nonempty_str(a[k]):
                errs.append(f"{tag}: {k} boş olamaz")
        if not isinstance(a["body"], list) or not all(nonempty_str(x) for x in a["body"]) or not a["body"]:
            errs.append(f"{tag}: body boş olmayan metin listesi olmalı")
        img = a.get("image")
        if img is not None:
            if not isinstance(img, dict) or not nonempty_str(img.get("url")) or not img["url"].startswith("https://"):
                errs.append(f"{tag}: image.url https:// ile başlamalı")
            elif not nonempty_str(img.get("credit")) or not nonempty_str(img.get("sourceUrl")):
                errs.append(f"{tag}: image için credit ve sourceUrl zorunlu")
        srcs = a["sources"]
        if not isinstance(srcs, list) or not srcs:
            errs.append(f"{tag}: en az bir kaynak gerekli")
            continue
        for j, s in enumerate(srcs):
            for k in SOURCE_REQUIRED:
                if not nonempty_str(s.get(k)):
                    errs.append(f"{tag} sources[{j}]: {k} eksik")
            if nonempty_str(s.get("url")) and not s["url"].startswith("https://"):
                errs.append(f"{tag} sources[{j}]: url https:// ile başlamalı")
    return errs


# --- Kapsam günlüğü (27 Kasım 2026): coverage/YYYY-MM-DD.json ---
COVERAGE_FROM = "2026-11-30"   # bu tarihten itibaren günlük dosya beklenir (eksikse UYARI)
COV_STATUSES = {"opened", "partial", "search_only", "inaccessible", "not_checked"}
COV_ERRORS = {"permission", "timeout", "site_error", "paywall", "js", "robots", "other"}
DOMAIN_WARN_SHARE = 0.5


def load_sources():
    f = ROOT / "data" / "sources.json"
    if not f.exists():
        return None
    return {s["id"]: s for s in json.loads(f.read_text(encoding="utf-8"))["sources"]}


def due_today(src, d):
    wd = _date.fromisoformat(d).weekday()
    c = src.get("cadence", "daily")
    return c == "daily" or (c == "wed" and wd == 2) or (c == "fri" and wd == 4)


def coverage_checks(path, data):
    """(hatalar, uyarılar) döndürür. Yayını yalnız biçim hatası durdurur; eksik dosya UYARI'dır."""
    errs, warns = [], []
    d = data["date"]
    sources = load_sources()
    cf = ROOT / "coverage" / f"{d}.json"
    if sources is not None and cf.exists():
        try:
            cov = json.loads(cf.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            return [f"coverage/{d}.json okunamadı: {e}"], warns
        got = cov.get("sources")
        if cov.get("date") != d or not isinstance(got, dict):
            return [f"coverage/{d}.json: date bülten tarihiyle aynı olmalı ve sources nesne olmalı"], warns
        for sid, e in got.items():
            tag = f"coverage/{d}.json {sid}"
            if sid not in sources:
                errs.append(f"{tag}: data/sources.json içinde yok")
                continue
            if not isinstance(e, dict) or e.get("status") not in COV_STATUSES:
                errs.append(f"{tag}: status şunlardan biri olmalı: {sorted(COV_STATUSES)}")
                continue
            if e["status"] == "inaccessible" and e.get("error") not in COV_ERRORS:
                errs.append(f"{tag}: inaccessible için error gerekli: {sorted(COV_ERRORS)}")
            if e["status"] in ("opened", "partial") and "relevant" not in e:
                errs.append(f"{tag}: opened/partial için relevant (true/false) gerekli")
        if not cov.get("backfill"):
            for sid, s in sources.items():
                if s.get("critical") and due_today(s, d) and sid not in got:
                    errs.append(f"coverage/{d}.json: kritik kaynak için durum yok: {sid}")
    elif d >= COVERAGE_FROM:
        warns.append(f"coverage/{d}.json yok (PROMPT 4.2); kapsam kaydı olmadan 'kontrol edildi' denemez")
    # tek alan adı yoğunluğu (26 Kasım'dan beri ölçülür)
    if d >= "2026-11-26":
        doms = []
        for a in data.get("articles", []):
            for s in a.get("sources", []):
                h = urlparse(s.get("url", "")).hostname or ""
                doms.append(h.removeprefix("www."))
        if len(doms) >= 6:
            top = max(set(doms), key=doms.count)
            share = doms.count(top) / len(doms)
            if share > DOMAIN_WARN_SHARE:
                warns.append(f"kaynak bağlantılarının %{round(share*100)}'i tek alan adında ({top}); asıl yayıncıya inildi mi, limitations içinde belirt")
    return errs, warns


def main():
    check_only = "--check" in sys.argv
    BULLETINS = bulletin_dir()
    INDEX = BULLETINS / "index.json"
    files = sorted(p for p in BULLETINS.glob("*.json") if DATE_RE.match(p.stem))
    all_errs = {}
    entries = []
    for p in files:
        try:
            data = json.loads(p.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            all_errs[p.name] = [f"JSON okunamadı: {e}"]
            continue
        errs = validate(p, data)
        if not errs:
            cerrs, cwarns = coverage_checks(p, data)
            errs = errs + cerrs
            for w in cwarns:
                print(f"UYARI {p.name}: {w}")
        if errs:
            all_errs[p.name] = errs
            continue
        if data["status"] != "published":
            continue
        entries.append({
            "date": data["date"],
            "title": data["title"],
            "summary": data["summary"],
            "edition": data["edition"],
            "articleCount": len(data["articles"]),
            "categories": sorted({a["category"] for a in data["articles"]}),
            "review": data["review"].get("status"),
        })

    if all_errs:
        for name, errs in all_errs.items():
            print(f"HATA {name}:")
            for e in errs:
                print(f"  - {e}")
        sys.exit(1)

    entries.sort(key=lambda e: e["date"], reverse=True)
    if not check_only:
        INDEX.write_text(json.dumps({"bulletins": entries}, ensure_ascii=False, indent=2) + "\n",
                         encoding="utf-8")
    print(f"OK: {len(files)} dosya doğrulandı, {len(entries)} yayımlanmış bülten dizinde.")


if __name__ == "__main__":
    main()
