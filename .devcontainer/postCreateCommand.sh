#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGES_FILE="$SCRIPT_DIR/packages"
REQUIREMENTS_FILE="$SCRIPT_DIR/requirements.txt"

die() {
  echo "❌ $1" >&2
  exit "${2:-1}"
}

[[ -f "$PACKAGES_FILE" ]] || die "packages fehlt unter $PACKAGES_FILE"
[[ -r "$PACKAGES_FILE" ]] || die "$PACKAGES_FILE nicht lesbar"
[[ -s "$PACKAGES_FILE" ]] || die "$PACKAGES_FILE ist leer"

[[ -f "$REQUIREMENTS_FILE" ]] || die "$REQUIREMENTS_FILE nicht gefunden"
[[ -r "$REQUIREMENTS_FILE" ]] || die "$REQUIREMENTS_FILE nicht lesbar"
[[ -s "$REQUIREMENTS_FILE" ]] || die "$REQUIREMENTS_FILE ist leer"

sudo apt-get update
sudo apt-get install -y $(grep -vE '^\s*#|^\s*$' "$PACKAGES_FILE")
# sudo apt-get upgrade -y

# prepare python environment
python3 -m venv .venv

source .venv/bin/activate
pip install --upgrade pip
pip install -r "$REQUIREMENTS_FILE"

#  npm install vue-router@4

# sudo apt-get install ftp
# sudo apt-get install lftp
# sudo apt install apache2-utils