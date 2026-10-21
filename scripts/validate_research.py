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
SOCIAL_MARKETS = {"Türkiye", "Global, Türkiye'de henüz yok", "Global, Türkiye'de de görünür"}
GURU_PEOPLE = {'Karen Nelson-Field', 'Steven Bellman', 'Byron Sharp', 'Virginia Beal', 'Erica Riebe'}
GURU_EVIDENCE = {'Çalışma kâğıdı', 'Konuşma veya podcast', 'Yazı veya görüş', 'Hakemli makale', 'Kitap', 'Kurum raporu'}
SOURCE_RESULTS = {"ok", "login_required", "paywall", "no_response", "poor_scope"}


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
    soc = d.get("social")
    if isinstance(soc, dict):
        sitems = soc.get("items") or []
        if len(sitems) > 8:
            errs.append("social.items en fazla 8 öğe olmalı")
        srcs_count = {}
        for i, it in enumerate(sitems):
            tag = f"social.items[{i}] ({it.get('title')})"
            for k in ("platform", "title", "url", "source", "published"):
                if not s(it.get(k)):
                    errs.append(f"{tag}: {k} eksik")
            if s(it.get("url")) and not it["url"].startswith("https://"):
                errs.append(f"{tag}: url https:// olmalı")
            if it.get("market") not in SOCIAL_MARKETS:
                # market zorunluluğu 22 Ekim 2026 paketinden itibaren geçerli
                (errs if d.get("date", "") >= "2026-10-22" else warns).append(f"{tag}: market {sorted(SOCIAL_MARKETS)} olmalı")
            srcs_count[it.get("source")] = srcs_count.get(it.get("source"), 0) + 1
        for name, n in srcs_count.items():
            if n > 3:
                warns.append(f"social: '{name}' kaynağından {n} öğe var (en fazla 3)")
        if sitems and len(srcs_count) < 3:
            warns.append("social: 3'ten az farklı kaynak; çeşitliliği artır")
    if "socialSourceReview" not in d:
        warns.append("socialSourceReview yok: dijital gündem kaynaklarının sonucunu ve önerisini yaz")
    for i, r in enumerate(d.get("socialSourceReview") or []):
        tag = f"socialSourceReview[{i}] ({r.get('url')})"
        if not str(r.get("url", "")).startswith("https://"):
            errs.append(f"{tag}: url https:// olmalı")
        if r.get("result") not in SOURCE_RESULTS:
            errs.append(f"{tag}: result {sorted(SOURCE_RESULTS)} olmalı")
        if r.get("action") not in ("keep", "remove", "add"):
            errs.append(f"{tag}: action keep/remove/add olmalı")
    g = d.get("gurus")
    if isinstance(g, dict):
        gitems = g.get("items") or []
        if len(gitems) > 3:
            errs.append("gurus.items en fazla 3 öğe olmalı")
        for i, it in enumerate(gitems):
            tag = f"gurus.items[{i}] ({it.get('person')})"
            for k in ("person", "title", "evidence", "summary", "whyItMatters", "counterView", "url", "source", "published"):
                if not s(it.get(k)):
                    errs.append(f"{tag}: {k} eksik")
            if s(it.get("url")) and not it["url"].startswith("https://"):
                errs.append(f"{tag}: url https:// olmalı")
            if it.get("person") not in GURU_PEOPLE:
                warns.append(f"{tag}: kişi listede yok")
            if it.get("evidence") not in GURU_EVIDENCE:
                errs.append(f"{tag}: evidence {sorted(GURU_EVIDENCE)} olmalı")
            if len(str(it.get("summary", "")).split()) > 30:
                warns.append(f"{tag}: summary 30 kelimeyi aşıyor")
    if "guruCheck" not in d:
        warns.append("guruCheck yok: her isim için kontrol sonucunu yaz")
    else:
        done = {c.get("person") for c in d.get("guruCheck") or []}
        miss = sorted(GURU_PEOPLE - done)
        if miss:
            warns.append(f"guruCheck eksik isimler: {', '.join(miss)}")
        for i, c in enumerate(d.get("guruCheck") or []):
            if c.get("result") not in ("new", "none", "unreachable"):
                errs.append(f"guruCheck[{i}]: result new/none/unreachable olmalı")
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
