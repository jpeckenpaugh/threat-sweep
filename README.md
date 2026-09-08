# Threat Sweep

Threat Sweep is a mobile-first cyber-security puzzle game. It takes the
tension of mine-clearing games and makes the player a Security Operator
scanning a compromised system for threats instead of bombs.

The recommended local play experience is the standalone **browser edition**:
a static, mobile-first browser game whose Worker owns local game rules and
whose IndexedDB storage retains local progress. It needs neither FastAPI nor
an API port. The original React single-page application backed by FastAPI and
SQLite remains included as a fallback/reference runtime.

Both editions use a portrait-oriented dark command-center presentation with
touch-friendly tactical controls, short missions, original threat icons, and
brief synthesized game sounds.

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
- A dependency-free `browser-edition/` static application with a Worker-owned
  game engine, redacted public snapshots, and browser-local IndexedDB storage
  for sound preference, progression, results, and one resumable mission.

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

## Play the browser edition (recommended)

From the repository root, serve the static browser-edition directory:

```bash
python3 -m http.server 4173 --directory browser-edition
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173) in a modern browser. This
starts no FastAPI service and requires no Node packages or project virtual
environment. Do not open `browser-edition/index.html` directly with `file://`:
the edition needs a served-page context for its module Worker and local storage.

The edition stores the single player's sound setting, mission progress, best
results, and one unfinished mission in IndexedDB for that browser origin.
Clearing that site's browser data removes those local records. It does not
provide accounts, cloud sync, export/import, multiplayer, or anti-cheat
guarantees.

## Run the server-backed fallback

The original server-backed React SPA remains available as a fallback/reference
runtime. Its setup requires:

- Python 3.11 or later (Python 3.12 was used during development)
- Node.js 20 or later and npm
- A macOS or Linux Bash-compatible shell

### Setup

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

### Run locally

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

### Build the fallback frontend

```bash
cd frontend
npm run build
```

This produces the Vite build in `frontend/dist/`. It does not serve the built
SPA; the included `run.sh` starts only the API service.

## Verification status

The latest verification report is [docs/verification-report.md](docs/verification-report.md).
The browser-edition corrective implementation checks passed:

- All five canonical browser-edition threat IDs map to distinct glyphs.
- The standalone engine test suite passed all six tests.
- The existing fallback frontend build and backend syntax checks passed.

The browser edition still has two runtime checks that are **unverified**, not
passed: its served-page Worker/IndexedDB flow and persistence across reload.
This sandbox forbids a local static server from binding a port, so the browser
edition could not be launched here.

The earlier server-backed corrective implementation checks also passed:

- All five canonical threat IDs render as distinct visuals.
- Virus scan effects provide and render transient contamination targets.
- Direct engine checks confirmed board redaction, legal sector behavior, and
  all five threat-effect types.
- `./install.sh` completed successfully.
- `npm run build` completed successfully.

The server-backed Stage 08 result remains **FAIL** because its required live
HTTP/API portion could not run in this sandbox. Uvicorn could not bind a local
port (`Operation not permitted`), so no `curl` checks or browser-driven
end-to-end playthrough could be performed. The environment also lacked `httpx`
for the FastAPI `TestClient` fallback and lacked `pytest`. Static review,
direct game-engine execution, and successful builds are recorded as such in
the report; they are not substitutes for live HTTP or browser verification.

## Known issues and next actions

- In an environment that permits port binding, run the browser-edition static
  server and verify the Worker handshake, IndexedDB persistence/reload,
  portrait layouts, sound feedback, resume flow, and a complete mission.
- Re-run the server-backed HTTP API checklist and browser end-to-end mission
  flow in an environment that permits Uvicorn port binding and has a supported
  HTTP test client (or `pytest`) installed.
- Test narrow portrait layouts, audio event playback, terminal transitions,
  persistence, and mission unlocks through the live Vite proxy for the fallback
  runtime.
- `npm install` reported two dependency audit findings during frontend setup;
  no automatic dependency upgrade was made during this build pass.
- Consider production deployment, CORS policy, database migration tooling,
  authentication, and multiplayer only as future product work; none is part
  of this local singleton release.

## Project structure

```text
backend/       FastAPI routes, SQLite models, seeds, and game engine
frontend/      React/Vite SPA, game components, styles, and audio code
browser-edition/ Static standalone UI, Worker authority, IndexedDB adapter,
                 and pure engine tests
features/      Product features and behavior briefs
enhancements/  Enhancement scope and approved sprint concepts
docs/          Architecture and verification report
instructions/  Workflow-stage instructions
summaries/     Stage handoff summaries
```

For API contracts, persistence details, mission configuration, and game-rule
ownership, see [docs/architecture.md](docs/architecture.md).
