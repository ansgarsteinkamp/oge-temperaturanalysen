1. Rohdaten-CSV in dieses Verzeichnis legen und in quelldaten.csv umbenennen

2. Im Projekt-Hauptverzeichnis:

      node scripts/konverter.js

   Das Skript wandelt quelldaten.csv in public/temperaturen.txt um. Bei Plausi-Fehlern wird die Zieldatei nicht geschrieben.

3. public/temperaturen.txt auf main committen und pushen (als Archiv)

4. Auf GitHub in den Branch gh-pages wechseln, die dortige temperaturen.txt durch die neue Version ersetzen (Upload oder Edit via Weboberfläche) und committen.