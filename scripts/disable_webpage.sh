#!/usr/bin/env bash

cat ./assets/.htaccess_base > .htaccess
cat ./assets/.htaccess_disable >> .htaccess

lftp -u "$FTP_UPLOAD_USER","$FTP_UPLOAD_PASSWORD" $FTP_SERVER <<EOF
set ftp:ssl-allow no
PUT ./assets/disabled.html
PUT .htaccess
bye
EOF

echo "🚧 webpage is now in maintenance mode"
rm .htaccess
