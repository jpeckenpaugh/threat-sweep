# Threat Sweep

Threat Sweep is a mobile-first cyber-security puzzle game. It takes the
tension of mine-clearing games and makes the player a Security Operator
scanning a compromised system for threats instead of bombs.

The game is a React single-page application backed by a FastAPI JSON API and
a local SQLite database. It is designed around a portrait-oriented,
dark command-center presentation with touch-friendly tactical controls,
short missions, original threat icons, and brief synthesized game sounds.

## What is implemented

- Five seeded missions with progressive unlocking, from **Signal Breach** to
  **Blackout Protocol**.
- A server-authoritative tactical grid with scan, clear, and mark actions.
- Safe-region clearing, nearby-threat signals, scoring, success/failure
  results, attempt history, and persisted best scores/ratings.
- Five distinct cyber threats: virus, hacker, software bug, rogue AI bot, and
  malware. Each has its own icon and scan-time behavior.
- A React SPA with connected home, mission, and results screens; Bootstrap
  baseline styling; a responsive mobile game shell; animations; and a
  persisted sound toggle.
- Brief Web Audio feedback for scan, mark, clear, warning, success, and
  failure events. Visual feedback remains available if browser audio is not.

### Threat behaviors

| Threat | Scan-time behavior |
| --- | --- |
| Virus | Highlights adjacent sectors with a brief contamination effect. |
| Hacker | May redact one previously scanned safe signal. |
| Software bug | Makes the next safe scan explicitly noisy by up to one signal point. |
| Rogue AI bot | Relocates to an eligible hidden safe sector. |
| Malware | Spreads into one eligible neighboring hidden safe sector. |

Clearing any threat is a breach and fails the current mission. Clearing every
safe sector completes it and can unlock the next mission.

## Requirements

- Python 3.11 or later (Python 3.12 was used during development)
- Node.js 20 or later and npm
- A macOS or Linux Bash-compatible shell

## Setup

From the repository root, create the Python environment and install the API
dependencies:

```bash
./install.sh
```

Install the frontend dependencies:

```bash
cd frontend
npm ci
```

`install.sh` creates `.venv`, installs the pinned Python requirements, and
validates the installed Node.js/npm versions. It requires network access when
dependencies are not already available.

## Run locally

Use two terminals.

In the first terminal, start the FastAPI service from the repository root:

```bash
./run.sh
```

In the second terminal, start the Vite development server:

```bash
cd frontend
npm run dev
```

Open the local URL printed by Vite (normally `http://127.0.0.1:5173`). Vite
proxies `/api` requests to the FastAPI service at `http://127.0.0.1:8000`.

The backend stores local progress in `backend/threat_sweep.db`, which is
ignored by Git. To use a different API bind address or port, set `HOST` and/or
`PORT` before running `./run.sh`; if the API port changes, update the Vite
development proxy in `frontend/vite.config.js` to match.

## Build the frontend

```bash
cd frontend
npm run build
```

This produces the Vite build in `frontend/dist/`. It does not serve the built
SPA; the included `run.sh` starts only the API service.

## Verification status

The latest verification report is [docs/verification-report.md](docs/verification-report.md).
The corrective implementation checks passed:

- All five canonical threat IDs render as distinct visuals.
- Virus scan effects provide and render transient contamination targets.
- Direct engine checks confirmed board redaction, legal sector behavior, and
  all five threat-effect types.
- `./install.sh` completed successfully.
- `npm run build` completed successfully.

The overall Stage 08 verification result remains **FAIL** because the required
live HTTP/API portion could not be run in the current sandbox. Uvicorn could
not bind a local port (`Operation not permitted`), so no `curl` checks or
browser-driven end-to-end playthrough could be performed. The environment also
lacked `httpx` for the FastAPI `TestClient` fallback and lacked `pytest`.
Static review and direct game-engine execution are recorded as such in the
report; they are not substitutes for live HTTP or browser verification.

## Known issues and next actions

- Re-run the HTTP API checklist and a browser end-to-end mission flow in an
  environment that permits Uvicorn port binding and has a supported HTTP test
  client (or `pytest`) installed.
- Test narrow portrait layouts, audio event playback, terminal transitions,
  persistence, and mission unlocks through the live Vite proxy.
- `npm install` reported two dependency audit findings during frontend setup;
  no automatic dependency upgrade was made during this build pass.
- Consider production deployment, CORS policy, database migration tooling,
  authentication, and multiplayer only as future product work; none is part
  of this local singleton release.

## Project structure

```text
backend/       FastAPI routes, SQLite models, seeds, and game engine
frontend/      React/Vite SPA, game components, styles, and audio code
features/      Product features and behavior briefs
docs/          Architecture and verification report
instructions/  Workflow-stage instructions
summaries/     Stage handoff summaries
```

For API contracts, persistence details, mission configuration, and game-rule
ownership, see [docs/architecture.md](docs/architecture.md).
