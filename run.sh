#!/usr/bin/env bash
# Start the FastAPI backend used by the Threat Sweep SPA.
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_PYTHON="$PROJECT_DIR/.venv/bin/python"
HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-8000}"

if [ ! -x "$VENV_PYTHON" ]; then
  echo "Missing .venv. Run ./install.sh first." >&2
  exit 1
fi

if [ ! -f "$PROJECT_DIR/backend/main.py" ]; then
  echo "Backend entry point not found at backend/main.py. Stage 06 must implement it before the service can start." >&2
  exit 1
fi

cd "$PROJECT_DIR"
exec "$PROJECT_DIR/.venv/bin/uvicorn" backend.main:app --reload --host "$HOST" --port "$PORT"
