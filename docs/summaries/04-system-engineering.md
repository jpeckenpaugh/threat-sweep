# Stage 04 Summary — System Engineering

## Completed work

Established the reproducible local environment contract for Threat Sweep:

- Added pinned FastAPI, Uvicorn, and SQLAlchemy runtime dependencies in `requirements.txt`.
- Added `install.sh` to create a local virtual environment, install Python dependencies, and validate the Node.js/npm prerequisite for the future React SPA.
- Added `run.sh` as the backend start contract for `backend.main:app` on port 8000, with `HOST` and `PORT` overrides.
- Expanded `.gitignore` for virtual environments, caches, local SQLite state, frontend build artifacts, temporary output, and editor files.
- Documented runtime assumptions, setup, launch behavior, and platform caveats in `environment-notes.md`.

## Open questions / downstream considerations

The frontend dependency manifest and scripts are intentionally deferred to Stage 07, which owns the React application. `run.sh` currently launches only the FastAPI service and will become executable once Stage 06 creates `backend/main.py`; Stage 06 may make the minimal compatible adjustment needed to match the approved architecture.

The selected pinned dependencies establish the initial backend runtime. Later stages should add a dependency only when their approved implementation requires it, while preserving the Python 3.11+ and Node.js 20+ contract.

## Handoff

Stage 05 can define the application architecture against this FastAPI, SQLite, and React SPA environment. Stage 06 should expose its API application as `backend.main:app` so the established launch script works.
