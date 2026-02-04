import requests
from bs4 import BeautifulSoup
import csv
import sys
import time

# =========================
# KONFIGURATION
# =========================

# Geizhals GPU-Kategorie (Grafikkarten)
URL = "https://geizhals.at/?cat=gra16_512"

CSV_DATEI = "gpu_preise_geizhals.csv"

# Wie viele GPUs maximal gespeichert werden sollen
MAX_GPU_ANZAHL = 20

# HTTP Header (wichtig, sonst Block oder falsche Seite)
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}

# =========================
# HTML SEITE LADEN
# =========================

def lade_webseite(url):
    """
    Lädt die Webseite und gibt den HTML-Inhalt zurück.
    Beendet das Programm bei Fehlern.
    """
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
    except requests.exceptions.RequestException as e:
        print("Fehler beim HTTP-Request:", e)
        sys.exit(1)

    if response.status_code != 200:
        print("HTTP Fehlercode:", response.status_code)
        sys.exit(1)

    return response.text

# =========================
# GPU DATEN PARSEN
# =========================

def parse_gpus(html):
    """
    Extrahiert GPU-Namen und Preise aus dem HTML.
    Gibt eine Liste von Tupeln zurück: (name, preis)
    """
    soup = BeautifulSoup(html, "html.parser")
    gpus = []

    # Jede GPU steht in einem Artikel-Block
    artikel = soup.select("article.listview__item")

    if not artikel:
        print("Keine GPU-Einträge gefunden.")
        sys.exit(1)

    for item in artikel[:MAX_GPU_ANZAHL]:
        try:
            # Name der Grafikkarte
            name_element = item.select_one("h3 a span")
            name = name_element.text.strip() if name_element else "Unbekannt"

            # Preis
            preis_element = item.select_one("span.price")
            preis = preis_element.text.strip() if preis_element else "Kein Preis"

            gpus.append((name, preis))

        except Exception as e:
            print("Fehler beim Parsen eines Eintrags:", e)

    return gpus

# =========================
# CSV SCHREIBEN
# =========================

def schreibe_csv(gpus):
    """
    Schreibt die GPU-Daten in eine CSV-Datei.
    """
    try:
        with open(CSV_DATEI, "w", newline="", encoding="utf-8") as datei:
            writer = csv.writer(datei)
            writer.writerow(["Grafikkarte", "Preis", "Quelle"])

            for name, preis in gpus:
                writer.writerow([name, preis, "geizhals.at"])

    except Exception as e:
        print("Fehler beim Schreiben der CSV:", e)
        sys.exit(1)

# =========================
# MAIN
# =========================

def main():
    print("Lade Webseite...")
    html = lade_webseite(URL)

    print("Analysiere HTML...")
    gpus = parse_gpus(html)

    if not gpus:
        print("Keine Daten zum Speichern gefunden.")
        sys.exit(1)

    print("Schreibe CSV...")
    schreibe_csv(gpus)

    print("Fertig. CSV wurde erstellt:", CSV_DATEI)

# =========================
# START
# =========================

if __name__ == "__main__":
    main()
