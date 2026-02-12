#!/bin/bash

set -euo pipefail

# Konfiguration
DIR_A="/workspace/data/develop"
DIR_B="/workspace/data/prod"

# Zeitstempel erzeugen (YYYYMMDDHHMMSS)
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
NEW_NAME="${DIR_A}_${TIMESTAMP}"

echo "Starte Vorgang..."

# Prüfen, ob A existiert
if [ ! -d "$DIR_A" ]; then
    echo "Fehler: Verzeichnis '$DIR_A' existiert nicht."
    exit 1
fi

# Prüfen, ob B existiert
if [ ! -d "$DIR_B" ]; then
    echo "Fehler: Verzeichnis '$DIR_B' existiert nicht."
    exit 1
fi

# A umbenennen
echo "Benenne '$DIR_A' um in '$NEW_NAME'..."
mv "$DIR_A" "$NEW_NAME"

echo "Umbenennung erfolgreich."

# B nach A kopieren
echo "Kopiere '$DIR_B' nach '$DIR_A'..."
cp -a "$DIR_B" "$DIR_A"

echo "Vorgang erfolgreich abgeschlossen."
exit 0
