# Beispiele

Die Anleitung für Codespace und die Expo-Apps steht in der
[README im Repo-Root](../README.md).

```
Startup-App/          erste App
JavaScript/           JavaScript-Themen als React Native
UI-Komponenten/
  MyJournal/          Tagebuch aus Kapitel 4, ohne Gestaltung
Styling/
  MyJournal/          gelöstes Tagebuch mit dem Styling aus Kapitel 5
  Layout/             Beispiele 5-1 bis 5-5
Fotos/
  MyJournal/          Styling-Lösung plus Foto und Kamera aus Kapitel 6
Persistenz/
  MyJournal/          Foto-Lösung plus Speichern, Löschen und Wetter aus Kapitel 7
Gerät/                ein Screen zu Gerät, Fenster, Sprache, Netz, Akku, Ort und Sensor
Karte/                Karte, eigene Position und aufgezeichnete Route
```

`UI-Komponenten/MyJournal` ist der Durchgang aus Kapitel 4.
`Styling/MyJournal` ist die gelöste App aus `Lösungen/UI-Komponenten`
mit den Styles aus Kapitel 5, Beispiele 5-6 bis 5-14. `Styling/Layout`
sind die Beispiele 5-1 bis 5-5 mit Rechtecken und Flexbox.
`Fotos/MyJournal` nimmt `Lösungen/Styling` als Vorlage und ergänzt
sie um die Beispiele aus Kapitel 6.
`Persistenz/MyJournal` nimmt `Lösungen/Fotos` als Vorlage und ergänzt
sie um Kapitel 7: Einträge bleiben nach dem Neustart erhalten, alle
Einträge lassen sich löschen, und ein neuer Eintrag speichert Standort
und Wetter. Die Übung dazu steht in `Persistenz/AUFGABE.md`, die Folien
zum Speicherort in `Persistenz/folien.html`.
`Gerät` zeigt auf einem Screen Geräte- und App-Version, Fenstergrösse,
Sprache, Netzwerk, Akku, Standort und den Beschleunigungssensor.
`Karte` öffnet beim Bahnhof Luzern, liest auf Tipp die eigene Position
und zeichnet Messpunkte als Linie auf. Android nutzt Google Maps, iOS
Apple Maps, mit demselben Code.
