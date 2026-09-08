# Threat Sweep architecture

## Purpose and boundaries

Threat Sweep is a mobile-first React single-page application backed by a
FastAPI JSON API and a local SQLite database. The API is authoritative for
mission availability, generated boards, threat behavior, action resolution,
scoring, and saved player progress. The SPA renders the game, collects player
intent, plays locally owned media, and never calculates a mission result from
secret board data.

The initial release ships five short, seeded missions. It supports one local
player profile (database id `1`) and any number of recorded mission attempts.
No login, multiplayer, remote deployment, or server-served media is in scope.

## Repository layout

```
backend/
  main.py                  FastAPI application and route registration
  database.py              SQLite engine, sessions, schema initialization
  models.py                SQLAlchemy persistence models
  schemas.py               Pydantic request/response contracts
  seed.py                  Idempotent mission/profile seed definitions
  services/
    missions.py            Mission catalog, unlock and result summaries
    game_engine.py         Board generation, legal actions, effects, scoring
    attempts.py            Attempt lifecycle and atomic persistence
  tests/                   Backend and engine tests (Stage 06)
frontend/
  package.json             React/Vite scripts and dependencies (Stage 07)
  src/
    main.jsx               SPA bootstrap
    App.jsx                Route-free screen coordinator
    api/client.js          Typed API wrapper and error normalization
    hooks/useGameAudio.js  Browser audio playback and mute preference sync
    state/gameReducer.js   UI-only async/action state reducer
    components/
      HomeScreen.jsx       Mission collection and settings access
      MissionCard.jsx      Available/locked mission presentation
      MissionScreen.jsx    HUD, tactical board, controls, action feedback
      TacticalGrid.jsx     Touch-friendly sector grid
      Sector.jsx           Individual sector visual states
      ResultsScreen.jsx    Outcome, score, unlock feedback, navigation
      SoundToggle.jsx      Sound preference control
      ThreatIcon.jsx       Category-to-SVG/icon mapping
    styles/                Command-center tokens, responsive/mobile styling
    assets/
      threats/             Original static SVG/icon assets
      audio/               Short scan, mark, clear, warning, win, lose clips
docs/
  architecture.md          This specification
```

`backend/` is the only owner of persisted data and game rules. `frontend/` is
the only owner of the React build setup, presentation layout, CSS animation,
and bundled threat/audio assets. `run.sh` starts `backend.main:app`; frontend
development and build commands are defined by Stage 07 in `frontend/package.json`.

## Mission rules and server game model

Each mission has an immutable configuration: grid dimensions, ordered threat
composition, score target, and unlock order. A generated attempt stores its
own complete board so an unfinished or completed game remains reproducible.

The five initial missions are deliberately compact, with increasing board size
and threat variety:

| Order | Slug | Grid | Threat mix | Unlock condition |
| --- | --- | --- | --- | --- |
| 1 | `signal-breach` | 6 x 6 | virus, software bug | available initially |
| 2 | `ghost-terminal` | 7 x 7 | virus, hacker, software bug | complete mission 1 |
| 3 | `botnet-drift` | 7 x 8 | virus, hacker, rogue AI bot | complete mission 2 |
| 4 | `malware-cascade` | 8 x 8 | virus, rogue AI bot, malware | complete mission 3 |
| 5 | `blackout-protocol` | 8 x 9 | all five categories | complete mission 4 |

The exact count of each category, generated coordinates, and board seed belong
to the mission configuration/attempt, not to the client. The engine generates
only valid boards (at least one safe opening move) and does not expose hidden
threat coordinates in an active attempt response.

### Sector states and actions

A sector's persisted state is one of `hidden`, `scanned`, `cleared`, or
`marked`. A `revealedThreat` field is only set when the engine has legitimately
identified a threat. A sector cannot be cleared while marked; marking toggles
between `hidden` and `marked`; completed attempts are immutable.

- **Scan:** inspect an unmarked, non-cleared sector. A safe scan returns its
  adjacent risk signal. A threat scan identifies its category, keeps the sector
  uncleared, emits a warning, and applies that category's non-terminal scan
  effect.
- **Clear:** clear an unmarked sector believed safe. Clearing a safe sector
  awards points and automatically clears a contiguous zero-signal safe region.
  Clearing a threat is a breach and ends the attempt in `failed` state.
- **Mark:** toggle a suspicion marker on a hidden sector. It is a player aid,
  not proof; it awards no points and cannot itself complete a mission.

A mission succeeds when every safe sector has been cleared. Marks are not
required, so a player cannot be blocked by an inaccurate marker. A mission
fails only when the player clears a threat. The resulting score is calculated
on the server from safe clears, efficient scans, unused markers, and any
effect penalties; it is never accepted from the client.

### Threat behavior contract

All five threats have a distinct effect that the engine reports through an
explicit `effects` array. The client shows its message, visual treatment, and
warning sound; it does not recreate the rule locally.

| Category | Icon identity | Effect when scanned | Effect if cleared |
| --- | --- | --- | --- |
| `virus` | segmented neon viral node | `virus_signature`: the sector is identified and its adjacent sectors receive a brief contamination highlight | breach / mission failure |
| `hacker` | hooded terminal silhouette | `hacker_probe`: one previously scanned safe signal is redacted back to `hidden` when possible | breach / mission failure |
| `software_bug` | angular crawling bug | `signal_noise`: the next safe scan reports an explicitly labelled noisy signal (one point high or low, clamped at zero) | breach / mission failure |
| `rogue_ai_bot` | glowing robot eye | `ai_relocation`: this identified bot relocates to a randomly selected hidden, unmarked safe sector; the old sector becomes safe and scanned | breach / mission failure |
| `malware` | fractured file/skull glyph | `malware_spread`: one eligible neighboring hidden safe sector becomes malware, with the mission's threat total updated | breach / mission failure |

An effect is skipped with an explicit `skipped` flag and reason when no legal
target exists. This preserves deterministic, understandable results on small
boards. The engine records an event for both applied and skipped effects.
Threat categories remain visible on a terminal board; active board snapshots
only show categories discovered through scans.

## Persistence model

SQLite is initialized on startup with idempotent metadata creation and seed
insertion. Timestamps are ISO-8601 UTC values. SQLAlchemy owns all database
access; routes do not write raw SQL.

### Tables

`player_profiles`

| Column | Type / constraints | Meaning |
| --- | --- | --- |
| `id` | integer primary key, fixed to `1` | singleton local player |
| `sound_enabled` | boolean, not null, default true | persisted audio preference |
| `created_at`, `updated_at` | datetime, not null | profile lifecycle |

`missions`

| Column | Type / constraints | Meaning |
| --- | --- | --- |
| `id` | integer primary key | seed record identifier |
| `slug` | text unique, not null | stable API identifier |
| `order_index` | integer unique, not null | unlock and display ordering |
| `title`, `briefing` | text, not null | mission presentation |
| `grid_rows`, `grid_columns` | integer, not null | board dimensions |
| `threat_config_json` | text JSON, not null | category/count configuration |
| `target_score` | integer, not null | three-tier performance reference |

`mission_progress`

| Column | Type / constraints | Meaning |
| --- | --- | --- |
| `id` | integer primary key | record identity |
| `profile_id`, `mission_id` | foreign keys, unique pair | player/mission progress |
| `completed_at` | nullable datetime | first successful completion |
| `best_score` | integer, default 0 | best successful score |
| `best_rating` | integer, default 0 | 0–3 performance rating |

`mission_attempts`

| Column | Type / constraints | Meaning |
| --- | --- | --- |
| `id` | UUID/text primary key | attempt API identifier |
| `profile_id`, `mission_id` | foreign keys, indexed | owner and template |
| `status` | text check: active/succeeded/failed/abandoned | lifecycle state |
| `board_seed` | integer, not null | generation audit value |
| `board_state_json` | text JSON, not null | canonical hidden board and public sector state |
| `score`, `clear_count`, `scan_count`, `mark_count` | integer, not null | calculated gameplay counters |
| `started_at`, `finished_at` | datetime / nullable datetime | attempt lifecycle |

`attempt_events`

| Column | Type / constraints | Meaning |
| --- | --- | --- |
| `id` | integer primary key | event ordering identity |
| `attempt_id` | foreign key, indexed | parent attempt |
| `sequence` | integer, unique with attempt id | action ordering |
| `event_type` | text, not null | action/effect/result event name |
| `payload_json` | text JSON, not null | coordinates, effects, and details |
| `created_at` | datetime, not null | audit timestamp |

`board_state_json` is intentionally denormalized: dynamic relocation/spread and
the need to preserve secret state make atomic board snapshots safer and simpler
than a per-cell write pattern. It contains a version field, dimensions, all
cells (including internal threat type), and action state. The serialization
function has separate internal and public views; the latter strips unknown
threat types and future-only information before returning it to the SPA.

## HTTP API

All endpoints are rooted at `/api`, exchange JSON, and return UTC ISO-8601
timestamps. `Content-Type: application/json` is required for request bodies.
There is no authentication in the local singleton release. Errors use:

```json
{"detail": {"code": "invalid_action", "message": "Marked sectors cannot be cleared."}}
```

Expected status codes are `400` for invalid payloads, `403` for locked
missions, `404` for unknown IDs, and `409` for an action incompatible with an
attempt's current state. Validation failures may use FastAPI's standard `422`.

### Bootstrap and player settings

| Method and path | Request | Success response |
| --- | --- | --- |
| `GET /api/health` | none | `{"status":"ok"}` |
| `GET /api/bootstrap` | none | player settings plus ordered mission cards and their availability/progress |
| `PUT /api/player/settings` | `{"soundEnabled": true}` | `{"soundEnabled": true, "updatedAt":"..."}` |

A mission card contains `id`, `slug`, `title`, `briefing`, `grid`,
`threatCategories`, `targetScore`, `locked`, `completed`, `bestScore`, and
`bestRating`. Locked cards omit gameplay configuration that would spoil later
missions beyond this overview.

### Attempt lifecycle

| Method and path | Request | Success response |
| --- | --- | --- |
| `POST /api/missions/{missionId}/attempts` | optional `{"restart": false}` | `201` with an active public attempt snapshot |
| `GET /api/attempts/{attemptId}` | none | current public attempt snapshot |
| `POST /api/attempts/{attemptId}/actions` | action request below | action resolution response |
| `POST /api/attempts/{attemptId}/abandon` | none | final abandoned attempt snapshot |

Creating an attempt for an unlocked mission returns an existing active attempt
unless `restart` is true. `restart: true` atomically abandons that active
attempt and creates a new one. This avoids duplicate concurrent boards for the
single player while retaining a deliberate restart choice.

Action requests have one uniform shape:

```json
{"type":"scan", "row":2, "column":4}
```

`type` is exactly `scan`, `clear`, or `mark`; coordinates are zero-based and
must be within the configured grid. The action response is:

```json
{
  "attempt": {"id":"...", "status":"active", "score":120, "board": {"rows":6,"columns":6,"cells":[[]]}},
  "action": {"type":"scan", "row":2, "column":4},
  "effects": [{"type":"virus_signature", "applied":true, "message":"Viral signature isolated."}],
  "events": ["scan", "warning"],
  "result": null
}
```

The `attempt` is always a fresh public snapshot so the client can replace its
board atomically. `events` is a compact media/UI cue list selected by the
server (`scan`, `mark`, `clear`, `warning`, `success`, `failure`). `result` is
`null` for active play; terminal actions include `outcome`, `score`, `rating`,
`newBest`, `unlockedMissionId` (or `null`), and a full terminal board with all
threat categories visible.

## Backend execution and consistency

Routes validate input, load the singleton profile, and delegate business rules
to services. The attempt service opens one database transaction per start,
action, or abandon request. It reloads the attempt, confirms status and legal
coordinates, asks the game engine to resolve the action/effects, persists the
full board/counters and ordered events, then updates progress only on a
success. The response is produced from the committed state. This prevents a
double tap or stale request from awarding duplicate clears or unlocks.

The seed service inserts/updates only the known mission catalog without
erasing player attempts. SQLite database location is configured by a single
backend setting, defaulting to a gitignored local file such as
`backend/threat_sweep.db`; tests use a separate temporary database.

## SPA state flow and responsibilities

`App` maintains a small screen state: `home`, `mission`, or `results`. On
startup it calls `/api/bootstrap`, applies the persisted sound setting, and
renders the mission collection. Selecting an unlocked card starts/retrieves an
attempt, then stores only the returned public snapshot in the reducer.

During a mission, the action-mode control selects scan, clear, or mark and a
sector tap posts a uniform action request. Controls are disabled while that
request is pending to prevent accidental duplicate taps. On response, the
reducer replaces the displayed attempt, renders effect messages/animations,
and passes each server event to `useGameAudio`. A terminal result transitions
to `ResultsScreen`; returning home reloads bootstrap cards so the newly
unlocked mission is immediately represented. Settings send `PUT` optimistically
and roll back their visual state if the request fails.

The browser audio hook maps the server event names to bundled `assets/audio`
clips. It respects the current sound preference and may fall back silently if
autoplay/browser policies reject playback. `ThreatIcon` maps the API category
strings to local SVG assets. CSS gives states and effects visual feedback, but
no animation or media decision changes a server result.

The frontend is responsible for portrait-first layout, accessible labels and
large targets, loading/error/retry states, sound toggling, and dark
command-center visual treatment. It must never receive or cache undiscovered
active-board threats. The backend is responsible for rules, random selection,
score/rating calculation, unlock decisions, persistence, and all terminal
outcomes.

## Implementation checks for later stages

- Stage 06 should unit-test engine legality, each threat effect (including
  skipped effects), public-board redaction, scoring, terminal results, unlocks,
  and active-attempt restart behavior.
- Stage 07 should use the API contracts verbatim, test each screen and all
  three action modes, make the grid usable at narrow portrait widths, and ship
  original lightweight threat and audio assets for every documented category/event.
- Any contract change must be recorded here and coordinated across both stages;
  in particular, do not move game-rule calculation into the SPA.
