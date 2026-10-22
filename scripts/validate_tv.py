#!/usr/bin/env python3
"""data/tv-takvim.json (sitedeki TV dizi takvimi) doğrulaması.

Kullanım:
    python3 scripts/validate_tv.py

Yalnız standart kütüphane. Hata varsa çıkış kodu 1; uyarılar çıkışı bozmaz.
"""
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHANNELS = ["ATV", "KANAL D", "STAR TV", "SHOW TV", "NOW", "TRT 1", "TV8"]
DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar", "Günü belirsiz"]
STATUS = {"yayinda", "kanal-teyitli", "planlanan", "belirsiz"}
TAGS = {"yeni", "sezon", "final"}
AIR = {"tkr"}  # bu hafta yeni bölüm yok: tekrar (TKR) gösterilir
ISO = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def check(d, today=None):
    errs, warns = [], []
    if d.get("channels") != CHANNELS:
        errs.append(f"channels şu olmalı: {CHANNELS}")
    if not ISO.match(str(d.get("updated", ""))):
        errs.append("updated YYYY-MM-DD olmalı")
    entries = d.get("entries")
    if not isinstance(entries, list) or not entries:
        return errs + ["entries boş olamaz"], warns
    seen = set()
    for i, e in enumerate(entries):
        tag = f"entries[{i}] ({e.get('channel')} / {e.get('day')} / {e.get('title')})"
        if e.get("channel") not in CHANNELS:
            errs.append(f"{tag}: kanal geçersiz")
        if e.get("day") not in DAYS:
            errs.append(f"{tag}: gün geçersiz")
        if not str(e.get("title", "")).strip():
            errs.append(f"{tag}: title eksik")
        if e.get("status") not in STATUS:
            errs.append(f"{tag}: status {sorted(STATUS)} olmalı")
        if e.get("tag") is not None and e.get("tag") not in TAGS:
            errs.append(f"{tag}: tag yeni/sezon/final olmalı")
        if e.get("tag") == "final" and not e.get("final"):
            warns.append(f"{tag}: Dizi Finali için veda tarihi (final) yok")
        for k in ("start", "final", "checked"):
            if k in e and not ISO.match(str(e[k])):
                errs.append(f"{tag}: {k} YYYY-MM-DD olmalı")
        if e.get("air") is not None and e.get("air") not in AIR:
            errs.append(f"{tag}: air {sorted(AIR)} olmalı")
        if e.get("status") == "yayinda" and not e.get("time"):
            warns.append(f"{tag}: Yayında kaydında saat yok (sitede yalnız saat görünür)")
        if e.get("status") == "yayinda" and e.get("note"):
            warns.append(f"{tag}: Yayında kaydında not görünmez; notu kaldır")
        if e.get("tag") in ("yeni", "sezon") and e.get("note"):
            warns.append(f"{tag}: Yeni Dizi/Yeni Sezon kaydında not görünmez; yalnız tarih veya 'Başlangıç tarihi açıklanmadı' yazılır")
        if not e.get("checked"):
            errs.append(f"{tag}: checked (son teyit tarihi) eksik")
        if e.get("source") and not str(e["source"]).startswith("https://"):
            errs.append(f"{tag}: source https:// olmalı")
        if e.get("time") and not re.match(r"^\d{2}\.\d{2}$", e["time"]):
            errs.append(f"{tag}: time SS.DD biçiminde olmalı")
        key = (e.get("channel"), e.get("day"), e.get("title"))
        if key in seen:
            errs.append(f"{tag}: aynı kanal, gün ve başlık tekrar ediyor")
        seen.add(key)
        if e.get("tag") in ("yeni", "sezon") and e.get("start") and ISO.match(e["start"]) and ISO.match(str(d.get("updated", ""))) and e["start"] <= d["updated"]:
            warns.append(f"{tag}: başlangıç tarihi geçti; 'yeni'/'sezon' etiketi kaldırılmalı")
        if e.get("tag") == "final" and e.get("final") and ISO.match(e["final"]) and ISO.match(str(d.get("updated", ""))) and e["final"] < d["updated"]:
            warns.append(f"{tag}: veda tarihi geçti; kayıt tablodan kaldırılmalı")
        if e.get("checked") and ISO.match(e["checked"]) and ISO.match(str(d.get("updated", ""))):
            gap = (date.fromisoformat(d["updated"]) - date.fromisoformat(e["checked"])).days
            if gap > 14:
                warns.append(f"{tag}: son teyit {gap} gün önce (†)")
    return errs, warns


def main():
    p = ROOT / "data" / "tv-takvim.json"
    try:
        d = json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:  # noqa: BLE001
        print(f"HATA: JSON okunamadı: {e}")
        sys.exit(1)
    errs, warns = check(d)
    for w in warns:
        print("UYARI:", w)
    if errs:
        for e in errs:
            print("HATA:", e)
        sys.exit(1)
    print(f"OK: {len(d['entries'])} kayıt geçerli, {len(warns)} uyarı.")


if __name__ == "__main__":
    main()
