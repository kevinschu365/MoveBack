# MoveBack

MoveBack ist jetzt als statische Web-App und kleine PWA fuer GitHub Pages vorbereitet.

## Was jetzt direkt funktioniert

- Oeffnen per Browser-Link statt App-Installation
- Lokaler Fortschritt ueber `localStorage`
- Dashboard, Wochenplan, Training Detail, Mobility Check und Fortschritt
- Installierbar als Web-App auf kompatiblen Geraeten

## GitHub Pages

Nach dem Push in GitHub:

1. `Settings`
2. `Pages`
3. `Deploy from a branch`
4. Branch `main`
5. Folder `/ (root)`

Danach liegt die App unter:

`https://kevinschu365.github.io/MoveBack/`

## Lokales Testen

Am einfachsten:

1. Den Repo-Ordner in VS Code oder einem lokalen Server oeffnen
2. `index.html` ueber einen kleinen lokalen Server starten

Oder direkt GitHub Pages verwenden, sobald Pages aktiviert ist.

## Projektstruktur

- `index.html`: App-Shell
- `styles.css`: komplettes UI-Styling
- `main.js`: App-Logik, Rendering und lokaler State
- `data.js`: Dummy-Daten fuer Trainings, Wochenplan und Mobility
- `manifest.webmanifest` und `sw.js`: PWA-Grundlage
