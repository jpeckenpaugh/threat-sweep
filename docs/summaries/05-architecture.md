# Stage 05 — Architecture summary

## Completed work

- Defined the FastAPI + SQLite and React SPA boundaries in `docs/architecture.md`.
- Specified the five seeded missions, authoritative board/action model, all
  threat-category effects, terminal conditions, and scoring ownership.
- Defined SQLite tables, board persistence/redaction strategy, API routes and
  payloads, plus the client/server interaction and media responsibilities.
- Corrective pass: established the five canonical lower-snake-case threat IDs
  as a shared API/SPA contract and specified renderable transient target data
  for virus contamination feedback.

## Handoff notes

- Stage 06 owns implementation of the documented API, schema, seed catalog,
  transactional game engine, and tests.
- Stage 07 owns React/Vite setup, screens, mobile visual treatment, and local
  original icon/audio assets; it must consume only public API board snapshots,
  map all five canonical threat IDs directly, and render virus target highlights.
- The repository did not contain `summaries/00-template.md`; this direct
  summary format is used in accordance with the Stage Manager's instruction.

## Open questions / concerns

None. The Stage Manager selected the server-authoritative state model, five
seeded missions, singleton player profile, explicit effects, and frontend-owned
static media. The corrective contract removes the visual-ID ambiguity and gives
the frontend sufficient public data to render virus contamination feedback.
