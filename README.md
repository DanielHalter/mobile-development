# Mobile Development – React Native & Expo

Ein Codespace für das ganze Repository. Die Übungs-Apps liegen unter
`Beispiele`, die Lösungen im eigenen Ordner `Lösungen`. Es läuft immer nur
eine Expo-App.

Die Befehle unten gelten im **Repo-Root** (dort öffnet der Codespace).

Studierende arbeiten mit **QR-Code und Expo Go** auf dem Handy.

## Vorbereitung

- Bei GitHub anmelden.
- Kostenloses Konto auf https://expo.dev anlegen.
- Expo Go installieren und **dort mit demselben Konto anmelden**.
- Für dieses Repository muss GitHub Codespaces verfügbar sein.

## Entwicklungsumgebung öffnen

[![In GitHub Codespaces öffnen](https://github.com/codespaces/badge.svg)](https://codespaces.new/camenzro-teko/mobile-development)

1. Auf den Button klicken und den Codespace erstellen.
2. Warten, bis die automatische Einrichtung abgeschlossen ist.
3. Expo starten: `F1` → **Tasks: Run Task** → **Startup-App starten**
   oder `npm start`.
   Wenn niemand eingeloggt ist, startet `npx expo login` von selbst.
4. Den QR-Code im Terminal scannen:
   - Android: mit Expo Go.
   - iPhone: mit der Kamera-App, danach in Expo Go öffnen.

Beim nächsten Unterricht denselben Codespace unter
https://github.com/codespaces öffnen. Keinen zweiten Space anlegen.

## Ordner

`Beispiele` enthält die Apps für den Unterricht. `Lösungen` liegt daneben
und enthält die gelösten Aufgaben. `Javascript` sind dieselben Themen im
Browser.

```
Beispiele/
  Startup-App/                 erste App
  JavaScript/                  JavaScript-Themen als React Native
  UI-Komponenten/
    MyJournal/                 Tagebuch aus Kapitel 4, ohne Gestaltung
  Styling/
    MyJournal/                 gelöstes Tagebuch mit dem Styling aus Kapitel 5
    Layout/                    Beispiele 5-1 bis 5-5
  Fotos/
    MyJournal/                 Styling-Lösung plus Foto und Kamera aus Kapitel 6
  Persistenz/
    MyJournal/                 Foto-Lösung plus Speichern, Löschen und Wetter aus Kapitel 7
  Gerät/                       ein Screen zu Gerät, Fenster, Sprache, Netz, Akku, Ort und Sensor
  Karte/                       Karte, eigene Position und aufgezeichnete Route
Lösungen/
  JavaScript/                  Lösungen zu Javascript/Lösungen
  UI-Komponenten/              gelöste Aufgaben zum Tagebuch
  Styling/                     dasselbe Tagebuch mit klarerer Gestaltung
  Fotos/                       Foto-App, Entwurf wird beim Tippen daneben geleert
  Persistenz/                  MyJournal plus Name unter settings.displayName
Javascript/
  Beispiele/                   dieselben Themen im Browser
  Lösungen/                    Web-Lösungen zu den Übungen
```

`UI-Komponenten/MyJournal` ist der Durchgang aus Kapitel 4, ohne die
gelösten Aufgaben und ohne Gestaltung. `Styling/MyJournal` ist die gelöste
App aus `Lösungen/UI-Komponenten` mit den Styles aus Kapitel 5, Beispiele
5-6 bis 5-14. `Styling/Layout` sind die Beispiele 5-1 bis 5-5 mit Rechtecken
und Flexbox. `Fotos/MyJournal` nimmt `Lösungen/Styling` als Vorlage und ergänzt
sie um die Beispiele aus Kapitel 6: Uhrzeit, mehrzeiliger Text und Foto per Kamera.
`Persistenz/MyJournal` nimmt `Lösungen/Fotos` als Vorlage und ergänzt sie
um Kapitel 7: Die Einträge bleiben gespeichert, lassen sich komplett löschen
und erhalten beim Anlegen Standort und Wetter.
`Gerät` ist ein einzelner Screen: Geräte- und App-Version, Fenstergrösse,
Sprache, Netzwerk, Akku, Standort und Beschleunigungssensor.
`Karte` öffnet beim Bahnhof Luzern, liest auf Tipp die eigene Position
und zeichnet Messpunkte als Linie auf. Android nutzt Google Maps, iOS
Apple Maps, mit demselben Code.
`Lösungen/Styling` ist dieselbe App mit klarerer Hierarchie,
gruppierter Eingabe, Abständen, lesbarem Eintragstext und umbrechenden Zeilen.
`Lösungen/Fotos` ist die Foto-App, bei der Text und Fotovorschau
verschwinden, wenn man neben die Eingabe tippt.
`Lösungen/Persistenz` löst `Beispiele/Persistenz/AUFGABE.md`: dasselbe
MyJournal, oben das Namensfeld. Der Name liegt unter `settings.displayName`,
die Einträge unter `MYJOURNAL_ITEMS`.

## Erste Änderung

Öffne `Beispiele/Startup-App/src/app/index.tsx`, ändere einen sichtbaren
Text und speichere.

Die App aktualisiert sich automatisch auf dem Handy.

## App wechseln

Immer nur eine Expo-App gleichzeitig. Die laufende im Terminal mit
`Ctrl+C` beenden, danach die andere starten.

- `F1` → **Tasks: Run Task**, oder im Repo-Root:

```bash
npm run start:javascript          # Beispiele/JavaScript
npm run start:ui                  # UI-Komponenten/MyJournal
npm run start:myjournal           # Styling/MyJournal
npm run start:layout              # Styling/Layout, Beispiele 5-1 bis 5-5
npm run start:fotos               # Fotos/MyJournal, Kapitel 6
npm run start:persistenz          # Persistenz/MyJournal, Kapitel 7
npm run start:geraet              # Gerät, ein Screen zu Gerät und Sensoren
npm run start:karte               # Karte, Bahnhof Luzern und Route
npm run start:javascript-loesung  # Lösungen/JavaScript
npm run start:ui-loesung          # Lösungen/UI-Komponenten
npm run start:styling-loesung     # Lösungen/Styling
npm run start:fotos-loesung       # Lösungen/Fotos
npm run start:persistenz-loesung  # Lösungen/Persistenz
```

Die Tasks heissen **JavaScript starten**, **UI-Komponenten starten**,
**Styling MyJournal starten**, **Layout starten**, **Fotos starten**, **Persistenz starten**, **Gerät starten**, **Karte starten**,
**JavaScript-Lösung starten**, **UI-Komponenten-Lösung starten**,
**Styling-Lösung starten**, **Fotos-Lösung starten** und **Persistenz-Lösung starten**.

Zurück zur Startup-App:

```bash
npm start
```

Den neuen QR-Code in Expo Go scannen.

## Falls der QR-Code nicht öffnet

1. `npx expo whoami` – eingeloggt? Sonst `npx expo login`.
2. In Expo Go derselbe Account wie im Terminal.
3. `npm start` neu starten und den QR-Code erneut scannen.

## Nach dem Unterricht

Änderungen speichern und den Codespace stoppen.
