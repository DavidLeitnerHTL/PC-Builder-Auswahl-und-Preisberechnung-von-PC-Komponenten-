PC Builder
==========

**Teammitglieder**

David Leitner, Maximilian Baumgartner

Ausgangssituation
-----------------

PCs selbst zu bauen ist kompliziert geworden. Es gibt ständig neue Teile (wie RTX 50er Karten oder DDR5 RAM) und man verliert schnell den Überblick. Viele Leute wissen nicht, was zusammenpasst, und kaufen oft das Falsche oder geben zu viel Geld aus.

Projektziele & Nicht-Ziele
--------------------------

**Das wollen wir erreichen (Ziele):**

*   Einen einfachen Web-Konfigurator für aktuelle PC-Hardware (Stand 2026) bauen.
    
*   "1-Click-Presets" anbieten: Fertige Listen für Budget, Mittelklasse und High-End.
    
*   Einen KI-Assistenten (Google Gemini) einbauen, der Fragen beantwortet.
    
*   **Neu:** Einen Webscraper entwickeln, der Preise und technische Daten (wie Watt oder VRAM) automatisch von Seiten wie Geizhals oder Amazon holt.
    
*   Der Preis soll sich sofort aktualisieren, wenn man etwas ändert.
    

**Das machen wir nicht (Nicht-Ziele):**

*   Wir verkaufen keine Hardware (kein Shop).
    
*   Es gibt keine Benutzer-Logins oder Datenbanken im Hintergrund.
    
*   Wir bauen keine Handy-App (die Webseite funktioniert aber auf dem Handy).
    

Projektinhalte
--------------

*   **Webseite:** Bau der Oberfläche mit HTML, CSS (Bootstrap) und JavaScript.
    
*   **Logik:** Programmieren der Hardware-Auswahl und Preis-Rechnung.
    
*   **KI:** Verbindung zum Google Gemini Chatbot herstellen.
    
*   **Automation (Webscraper):** Ein Programm schreiben, das regelmäßig aktuelle Preise und Daten aus dem Netz zieht, damit wir das nicht von Hand machen müssen.
    
*   **Wissen:** Tipps und News für PC-Bauer bereitstellen.
    
*   **Hosting:** Die Seite läuft über Cloudflare Pages.
    

Was ist wichtig für den Erfolg?
-------------------------------

*   Die Google KI muss schnell und zuverlässig antworten.
    
*   Die Hardware-Teile müssen wirklich zusammenpassen (keine Fehler in der Logik).
    
*   Der Webscraper muss stabil laufen und darf nicht geblockt werden.
    
*   Die Seite muss auf dem Handy gut bedienbar sein.
    

Meilensteine & Plan
-------------------

**Phase 1: Basis & Kernfunktionen (Erledigt)**

*   \[x\] **Grundgerüst:** Die Webseite steht (HTML/CSS/Bootstrap).
    
*   \[x\] **Konfigurator:** Man kann Teile auswählen und der Preis wird berechnet.
    
*   \[x\] **Presets:** Die Buttons für "Budget", "Mid-Range" und "High-End" funktionieren.
    
*   \[x\] **KI-Chat:** Der Google Gemini Bot antwortet und prüft das System.
    
*   \[x\] **Inhalt:** Expertenwissen und News sind drin (mit Bildern).
    
*   \[x\] **Online:** Die Seite läuft auf Cloudflare.
    

**Phase 2: Erweiterung & Webscraper (Geplant)**

*   \[ \] **Webscraper bauen:** Ein Script entwickeln, das Preise und technische Details (VRAM, Takt, Watt) automatisch aktualisiert.
    
*   \[ \] **Datenbank:** Die festen Werte im Code durch die automatisch gescrapten Daten ersetzen.
    
*   \[ \] **Peripherie:** Einen neuen Bereich für Monitore, Tastaturen und Mäuse hinzufügen.
    
*   \[ \] **Watt-Rechner:** Automatische Warnung, wenn das Netzteil zu schwach für die Grafikkarte ist.
    
*   \[ \] **Teilen:** Button, um die fertige PC-Liste an Freunde zu schicken.