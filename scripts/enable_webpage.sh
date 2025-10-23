#!/usr/bin/env bash

cat ./assets/.htaccess_base > .htaccess
cat ./assets/.htaccess_enable >> .htaccess

lftp -u "$FTP_UPLOAD_USER","$FTP_UPLOAD_PASSWORD" $FTP_SERVER <<EOF
set ftp:ssl-allow no
PUT .htaccess
PUT .htpasswd
bye
EOF

echo "✅ webpage is now active"
rm .htaccess
