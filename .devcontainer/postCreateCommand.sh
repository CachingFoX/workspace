#!/usr/bin/env bash
set -e

# Files
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGES_FILE="$SCRIPT_DIR/packages"
REQUIREMENTS_FILE="$SCRIPT_DIR/requirements.txt"

# Validate files
[[ -f "$PACKAGES_FILE" ]] || { echo "packages file missing"; exit 1; }
[[ -f "$REQUIREMENTS_FILE" ]] || { echo "requirements.txt missing"; exit 1; }

# Install system packages
sudo apt-get update
sudo apt-get install -y $(grep -vE '^\s*#|^\s*$' "$PACKAGES_FILE")

# Activate venv
PYTHON_VENV="/workspace/.venv"
source "$PYTHON_VENV/bin/activate"

# Upgrade pip and install requirements
"$PYTHON_VENV/bin/pip" install --upgrade pip
"$PYTHON_VENV/bin/pip" install -r "$REQUIREMENTS_FILE"

# Ensure pytest installed
"$PYTHON_VENV/bin/pip" install pytest

echo "✅ Python venv ready at $PYTHON_VENV"
