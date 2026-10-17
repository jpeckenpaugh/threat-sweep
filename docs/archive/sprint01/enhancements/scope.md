# Sprint 01 scope — Browser Edition

Sprint 01 adds a self-contained browser edition of Threat Sweep for offline,
local play. It extends the existing product without replacing or regressing the
current FastAPI and React application, which remains available as a fallback
and reference.

## Sprint items

- **a. Feature — Standalone mobile game:** Provide a mobile-first game
  experience playable in a browser as static files. It preserves the existing
  missions, tactical grid, threat identities, feedback, sound preference, and
  progression experience.
- **b. Feature — Local game authority:** Keep game decisions, hidden-board
  information, scoring, progression, and saved attempts outside the visible
  game interface. The interface submits player actions and displays the
  resulting public game state.
- **c. Feature — Local player continuity:** Save the single local player's
  settings, progress, and unfinished missions in the browser, without a server
  or player account.
- **d. Constraint — Faithful game identity:** Reuse or faithfully adapt the
  existing visual identity, original threat graphics, and lightweight sound
  feedback so the browser edition is recognizably Threat Sweep.
- **e. Feature — Simple local access:** Provide and document a straightforward
  way to serve and play the browser edition locally.
- **f. Boundary — Preserve the existing runtime:** Do not regress or remove the
  existing FastAPI backend or React/Vite frontend. They remain a fallback and
  reference implementation, and are not required to play the browser edition.
- **g. Boundary — Offline local-play focus:** This sprint excludes progress
  export/import, cloud sync, accounts, multiplayer, remote hosting, and
  anti-cheat guarantees.

## Pass boundaries

- The browser edition becomes the primary local play experience for this pass.
- Existing gameplay meaning and player-facing mission progression remain
  consistent with the established Threat Sweep experience.
- Work is limited to the agreed browser edition and does not expand into
  online services or new social, account, or deployment capabilities.
