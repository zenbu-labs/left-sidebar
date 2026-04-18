#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PACKAGES_DIR="$(cd "${SCRIPT_DIR}/../zenbu/packages" && pwd)"
REGISTRY_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)/registry"

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
