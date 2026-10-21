#!/usr/bin/env python3
"""ChatGPT araştırma paketini (research/YYYY-MM-DD.json) doğrular.

Kullanım:
    python3 scripts/validate_research.py research/2026-10-15.json

Yalnız standart kütüphane. Hata varsa çıkış kodu 1; uyarılar çıkışı bozmaz.
"""
import json
import re
import sys
from pathlib import Path

CATEGORIES = {
    "TV & Entertainment", "Dijital & AI", "Ölçüm & Araştırma", "Ajans & Marka",
    "Rekabet", "Spor", "Sinema", "Yaratıcı Mecra", "Etkinlik",
}
VERIFICATION = {"official", "two_independent", "single_secondary", "rumor"}
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
TV_CHANNELS = {"ATV", "KANAL D", "STAR TV", "SHOW TV", "NOW", "TRT 1", "TV8"}
TV_DAYS = {"Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar", "Günü belirsiz"}
TV_STATUS = {"yayinda", "kanal-teyitli", "planlanan", "belirsiz"}


def s(v):
    return isinstance(v, str) and v.strip() != ""


def check(path: Path):
    errs, warns = [], []
    try:
        d = json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:  # noqa: BLE001
        return [f"JSON okunamadı: {e}"], []
    if d.get("date") != path.stem:
        errs.append(f"date ({d.get('date')}) dosya adıyla aynı değil")
    for k in ("cutoff", "window"):
        if not s(d.get(k)):
            errs.append(f"{k} eksik")
    items = d.get("items")
    if not isinstance(items, list) or not items:
        errs.append("items boş olamaz")
        items = []
    ids = set()
    for i, it in enumerate(items):
        tag = f"items[{i}] ({it.get('id', '?')})"
        for k in ("id", "region", "category", "title", "eventDate", "verification"):
            if not s(it.get(k)):
                errs.append(f"{tag}: {k} eksik")
        if it.get("id") in ids:
            errs.append(f"{tag}: id tekrar ediyor")
        ids.add(it.get("id"))
        if it.get("category") not in CATEGORIES:
            errs.append(f"{tag}: geçersiz category")
        if it.get("region") not in ("Türkiye", "Global"):
            errs.append(f"{tag}: region Türkiye/Global olmalı")
        if it.get("verification") not in VERIFICATION:
            errs.append(f"{tag}: verification {sorted(VERIFICATION)} olmalı")
        facts = it.get("facts")
        if not isinstance(facts, list) or not facts or not all(s(x) for x in facts):
            errs.append(f"{tag}: facts boş olmayan liste olmalı")
        else:
            long = [x for x in facts if len(x.split()) > 22]
            if long:
                warns.append(f"{tag}: {len(long)} madde 22 kelimeyi aşıyor")
        srcs = it.get("sources")
        if not isinstance(srcs, list) or not srcs:
            errs.append(f"{tag}: en az bir kaynak gerekli")
        else:
            for j, src in enumerate(srcs):
                if not s(src.get("url")) or not src["url"].startswith("https://"):
                    errs.append(f"{tag} sources[{j}]: url https:// olmalı")
                for k in ("name", "published"):
                    if not s(src.get(k)):
                        errs.append(f"{tag} sources[{j}]: {k} eksik")
        if it.get("verification") == "single_secondary" and it.get("category") == "Spor":
            warns.append(f"{tag}: spor bilgisi tek ikincil kaynaklı")
    for i, m in enumerate(d.get("matches") or []):
        for k in ("date", "sport", "competition", "home", "away", "source"):
            if not s(m.get(k)):
                errs.append(f"matches[{i}]: {k} eksik")
    for i, u in enumerate(d.get("tvTableUpdates") or []):
        tag = f"tvTableUpdates[{i}] ({u.get('channel')} / {u.get('day')} / {u.get('title')})"
        if u.get("action") not in ("add", "update", "remove"):
            errs.append(f"{tag}: action add/update/remove olmalı")
        if u.get("channel") not in TV_CHANNELS:
            errs.append(f"{tag}: kanal geçersiz")
        if u.get("day") not in TV_DAYS:
            errs.append(f"{tag}: gün geçersiz")
        if not s(u.get("title")):
            errs.append(f"{tag}: title eksik")
        if u.get("action") != "remove" and u.get("status") not in TV_STATUS:
            errs.append(f"{tag}: status {sorted(TV_STATUS)} olmalı")
        if u.get("tag") not in (None, "", "yeni", "final"):
            errs.append(f"{tag}: tag yeni/final olmalı")
        for k in ("start", "final", "checked"):
            if k in u and not DATE_RE.match(str(u[k])):
                errs.append(f"{tag}: {k} YYYY-MM-DD olmalı")
        if not u.get("checked"):
            errs.append(f"{tag}: checked eksik")
        if u.get("source") and not str(u["source"]).startswith("https://"):
            errs.append(f"{tag}: source https:// olmalı")
    if "tvTableUpdates" not in d:
        warns.append("tvTableUpdates yok: TV takvimi kontrol edildiyse boş liste yaz")
    if not d.get("accessLog"):
        warns.append("accessLog boş: hangi resmî kaynakların açıldığı bilinmiyor")
    return errs, warns


def main():
    if len(sys.argv) < 2:
        print("Kullanım: python3 scripts/validate_research.py research/YYYY-MM-DD.json")
        sys.exit(2)
    p = Path(sys.argv[1])
    if not p.exists():
        print(f"YOK: {p}")
        sys.exit(3)
    errs, warns = check(p)
    for w in warns:
        print("UYARI:", w)
    if errs:
        for e in errs:
            print("HATA:", e)
        sys.exit(1)
    print(f"OK: {p.name} geçerli.")


if __name__ == "__main__":
    main()
