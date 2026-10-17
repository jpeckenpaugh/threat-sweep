# Sprint 01 — Browser Edition

Create a browser-native edition of Threat Sweep under `browser-edition/` that
can be served as static files and played without starting FastAPI or relying on
an API port. It should become the primary local play experience while keeping
the current FastAPI/React application intact as a fallback and reference
implementation.

a. Add a mobile-first, standalone browser game experience that preserves the
existing Threat Sweep missions, tactical grid, threat identities, feedback,
sound setting, and progression experience.

b. Move authoritative local game-rule resolution, hidden-board handling,
scoring, mission progression, and saved attempts behind a browser Worker
boundary so the UI sends game intents and renders returned public snapshots.

c. Persist the single player's local settings, progress, and resumable mission
attempts in browser storage without requiring a server or account.

d. Reuse or faithfully adapt the existing visual identity, original threat
graphics, and lightweight game sound feedback for the browser edition.

e. Provide a simple local static serving path and document how to use the
browser edition.

f. Preserve the existing FastAPI backend and React/Vite frontend without
regression; they remain a reference and fallback runtime, not dependencies of
the browser edition.

g. Keep this sprint focused on offline local play. Export/import, cloud sync,
accounts, multiplayer, remote hosting, and anti-cheat guarantees are outside
this sprint.
