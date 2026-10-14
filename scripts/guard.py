#!/usr/bin/env python3
"""Ana siteyi koruma kontrolü.

Claude dışındaki commit'lerin izinli klasör (`research/`: ChatGPT araştırma paketi) dışındaki dosyaları değiştirip değiştirmediğini listeler. Ana sitenin dosyaları yalnız Claude veya kullanıcının
açık onayıyla değişmelidir.

Kullanım:
    python3 scripts/guard.py --since 2026-10-12T09:00+03:00
    python3 scripts/guard.py --days 3

Çıktı yoksa ("TEMİZ") ana siteye dışarıdan dokunulmamıştır.
Not: Kullanıcının kendi hesabıyla yaptığı değişiklikler ile ChatGPT'nin aynı
hesap üzerinden yaptığı değişiklikler yazar adından ayırt edilemez; ikisi de raporlanır.
"""
import subprocess
import sys

ALLOWED_PREFIX = ("research/",)
CLAUDE_EMAIL = "noreply@anthropic.com"


def git(*args):
    return subprocess.run(["git", *args], capture_output=True, text=True, check=True).stdout


def main():
    if "--since" in sys.argv:
        since = sys.argv[sys.argv.index("--since") + 1]
    else:
        days = sys.argv[sys.argv.index("--days") + 1] if "--days" in sys.argv else "1"
        since = f"{days} days ago"
    log = git("log", "origin/main", f"--since={since}", "--format=%H%x09%ae%x09%an%x09%aI%x09%s")
    findings = []
    for line in log.strip().splitlines():
        sha, email, name, date, subject = line.split("\t", 4)
        if email == CLAUDE_EMAIL:
            continue
        files = git("show", "--name-status", "--format=", sha).strip().splitlines()
        outside = [f for f in files if f and not f.split("\t")[-1].startswith(ALLOWED_PREFIX)]
        if outside:
            findings.append((sha[:7], name, date, subject, outside))
    if not findings:
        print("TEMİZ: Claude dışı commit'ler ana site dosyalarına dokunmadı.")
        return
    print("UYARI: Ana site dosyalarına Claude dışı değişiklik var.")
    for sha, name, date, subject, outside in findings:
        print(f"\n{sha} | {name} | {date}\n  Mesaj: {subject}")
        for f in outside:
            print(f"  {f}")
    sys.exit(2)


if __name__ == "__main__":
    main()
