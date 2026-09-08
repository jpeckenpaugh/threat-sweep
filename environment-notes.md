# Threat Sweep environment notes

## Runtime contract

- **Backend:** Python 3.11 or newer; Python 3.12 is the development target.
- **API service:** FastAPI served by Uvicorn at `http://127.0.0.1:8000` by default.
- **Persistence:** SQLite is provided by Python's standard library; local database files are intentionally ignored by Git.
- **Frontend:** React SPA tooling requires Node.js 20 or newer and npm. Its `package.json` and frontend dependencies are owned by Stage 07.

## Setup and launch

From the repository root, run:

```bash
./install.sh
./run.sh
```

`install.sh` creates `.venv`, installs the pinned Python service dependencies, and validates the installed Node/npm toolchain. It does not create frontend project files or install frontend dependencies before Stage 07 defines them.

`run.sh` is the backend launch contract. It expects the Stage 06 entry point at `backend/main.py` to expose `app`, then starts Uvicorn in reload mode. Use `HOST` and `PORT` environment variables to override its default bind address and port.

## Platform notes

- The scripts target macOS and Linux shells with Bash 3.2 or newer.
- Windows users should run the equivalent commands from WSL or adapt the scripts for PowerShell.
- Network access is required during installation to download Python packages.
- Production deployment settings, CORS policy, frontend dev-server commands, and database migration tooling are architectural or implementation concerns for later stages.
