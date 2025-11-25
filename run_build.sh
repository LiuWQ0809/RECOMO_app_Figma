#!/usr/bin/env bash
set -euo pipefail

# One-command build for RECOMO app
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
API_HOST="${API_HOST:-192.168.100.100}"
API_PORT="${API_PORT:-3001}"
VITE_PORT="${VITE_PORT:-3002}"

export VITE_API_BASE_URL="http://${API_HOST}:${API_PORT}"
export HOST=0.0.0.0
export PORT="$VITE_PORT"

echo "==> Installing deps (if needed)"
if [ ! -d "$ROOT_DIR/node_modules" ]; then
  (cd "$ROOT_DIR" && npm install)
fi

echo "==> Building frontend"
(cd "$ROOT_DIR" && npm run build)

echo "Build complete. Output: $ROOT_DIR/build"
