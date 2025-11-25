#!/usr/bin/env bash
set -euo pipefail

# One-command dev runner for RECOMO app (frontend + backend)

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
API_HOST="${API_HOST:-192.168.100.100}"
API_PORT="${API_PORT:-3001}"
VITE_PORT="${VITE_PORT:-3002}"
DATA_DIR="${DATA_DIR:-/home/converge/data/RECOMO_App_Data}"

echo "==> Preparing directories"
mkdir -p "$DATA_DIR" "$ROOT_DIR/server/uploads"

echo "==> Installing frontend deps (if needed)"
if [ ! -d "$ROOT_DIR/node_modules" ]; then
  (cd "$ROOT_DIR" && npm install)
fi

echo "==> Installing backend deps (if needed)"
if [ ! -d "$ROOT_DIR/server/node_modules" ]; then
  (cd "$ROOT_DIR/server" && npm install)
fi

export VITE_API_BASE_URL="http://${API_HOST}:${API_PORT}"
export HOST=0.0.0.0
export PORT="$VITE_PORT"

echo "==> Starting backend on ${API_HOST}:${API_PORT} (data -> $DATA_DIR)"
(cd "$ROOT_DIR/server" && PORT="$API_PORT" STORAGE_BASE_PATH="$DATA_DIR" node index.js) &
BACK_PID=$!

echo "==> Starting frontend on 0.0.0.0:${VITE_PORT} (API -> $VITE_API_BASE_URL)"
(cd "$ROOT_DIR" && npm run dev -- --host 0.0.0.0 --port "$VITE_PORT") &
FRONT_PID=$!

trap 'echo "Stopping..."; kill $BACK_PID $FRONT_PID 2>/dev/null || true' EXIT

wait
