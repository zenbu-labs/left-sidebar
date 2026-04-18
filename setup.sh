#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ZENBU_HOME="${ZENBU_HOME:-$HOME/.zenbu}"
PACKAGES_DIR="${ZENBU_HOME}/plugins/zenbu/packages"
REGISTRY_DIR="${ZENBU_HOME}/registry"

for dir in "${PACKAGES_DIR}" "${REGISTRY_DIR}"; do
  if [ ! -d "${dir}" ]; then
    echo "ERROR: missing ${dir}. Set ZENBU_HOME if your Zenbu lives elsewhere." >&2
    exit 1
  fi
done

cat > "${SCRIPT_DIR}/tsconfig.local.json" <<EOF
{
  "compilerOptions": {
    "paths": {
      "@testbu/*": ["${PACKAGES_DIR}/*"],
      "#registry/*": ["${REGISTRY_DIR}/*"]
    }
  }
}
EOF
echo "  ✓ wrote tsconfig.local.json"

echo "Installing packages..."
ni --dir "${SCRIPT_DIR}" 2>/dev/null || pnpm install --dir "${SCRIPT_DIR}"
echo "  ✓ install done"
