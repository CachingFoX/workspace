#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGES_FILE="$SCRIPT_DIR/packages"

die() {
  echo "❌ $1" >&2
  exit "${2:-1}"
}

[[ -f "$PACKAGES_FILE" ]] || die "packages fehlt unter $PACKAGES_FILE"
[[ -r "$PACKAGES_FILE" ]] || die "$PACKAGES_FILE nicht lesbar"
[[ -s "$PACKAGES_FILE" ]] || die "$PACKAGES_FILE ist leer"

sudo apt-get update
sudo apt-get install -y $(grep -vE '^\s*#|^\s*$' "$PACKAGES_FILE")
sudo apt-get upgrade -y



#  npm install vue-router@4

# sudo apt-get install ftp
# sudo apt-get install lftp
# sudo apt install apache2-utils