#!/usr/bin/env bash

basepath=$(dirname $(readlink -f ${0}))

cat ./assets/.htaccess_base > .htaccess
cat ./assets/.htaccess_update >> .htaccess

echo "📤 upload webpage"

lftp -u "$FTP_UPLOAD_USER","$FTP_UPLOAD_PASSWORD" $FTP_SERVER <<EOF | tee -a "upload.log"
set ftp:ssl-allow no
set cmd:trace yes        # alle Befehle anzeigen
set xfer:log yes         # Dateiübertragungen loggen
PUT ./assets/update.html
PUT .htaccess
PUT ./dist/favicon.ico
PUT ./dist/index.html
MIRROR -R --verbose ./dist/images /images
MIRROR -R --verbose ./dist/assets /assets
bye
EOF

echo "🌟 webpage updated"

source "${basepath}/enable_webpage.sh"

echo "https://${FTP_SERVER}"
