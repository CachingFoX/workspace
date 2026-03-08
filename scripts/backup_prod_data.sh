#!/bin/bash

set -euo pipefail

# Konfiguration
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
DIR_A="/workspace/data/prod"
DIR_B="/workspace/data/backup_${TIMESTAMP}"

echo "Starte Vorgang..."

# Prüfen, ob A existiert
if [ ! -d "$DIR_A" ]; then
    echo "Fehler: Verzeichnis '$DIR_A' existiert nicht."
    exit 1
fi

# Prüfen, ob B existiert
# if [ ! -d "$DIR_B" ]; then
#     echo "Fehler: Verzeichnis '$DIR_B' existiert nicht."
#    exit 1
#fi

# A nach B kopieren
echo "Kopiere '$DIR_A' nach '$DIR_B'..."
cp -a "$DIR_A" "$DIR_B"

sqlite3 "$DIR_B/app.db" .dump > "$DIR_B/app.db.sql"


echo "Vorgang erfolgreich abgeschlossen."
exit 0
