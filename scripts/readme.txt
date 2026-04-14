Die Rohdaten-CSV in dieses Verzeichnis legen und in quelldaten.csv umbenennen. Dann im Projekt-Hauptverzeichnis:

node scripts/konverter.js

Das Skript wandelt quelldaten.csv in public/temperaturen.txt um. Bei Plausi-Fehlern wird die Zieldatei nicht geschrieben.
