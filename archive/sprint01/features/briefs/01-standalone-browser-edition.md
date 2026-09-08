# Standalone Browser Edition

## Purpose

Make Threat Sweep available as a self-contained, mobile-first browser game so
the player can begin and play the established experience without starting the
existing FastAPI service or relying on its API port.

## Expected behavior

1. A player who opens the supported browser edition is taken into the Threat
   Sweep game experience without needing to configure or sign in to a server.
2. The edition presents the established home, mission-selection, tactical
   mission, and results flow as one continuous mobile-oriented game
   experience.
3. It preserves the existing five seeded missions, their order and unlock
   progression, tactical grid actions, threat identities and effects, mission
   feedback, and sound-preference behavior.
4. Starting, resuming, or finishing a mission in this edition does not depend
   on the FastAPI backend or the existing React/Vite application being
   running.
5. The existing FastAPI/React runtime remains available and unchanged as a
   fallback and reference implementation.

## Inputs / outputs

- **Inputs:** player navigation, mission selection, tactical scan, clear, and
  mark actions, and the existing sound preference.
- **Outputs:** the corresponding game screens, updated public board and
  mission state, established threat and outcome feedback, and locally retained
  player experience.

## User-visible behavior

The player sees a recognizably Threat Sweep, portrait-first command-center
game rather than a web page requiring a companion service. The familiar dark
visual treatment, bright scanner and alert colors, original threat graphics,
touch-friendly board controls, mission feedback, and brief game sounds remain
part of the experience. The player can move between home, mission, and results
screens without leaving the edition.

## Constraints

- Preserve the player-facing meaning of existing missions, threats, tactical
  actions, scores, results, progression, feedback, and sound setting.
- Reuse or faithfully adapt the established Threat Sweep visual identity and
  original threat imagery; do not substitute conventional mine or bomb
  imagery.
- The browser edition must be playable as static browser-served files and
  must not require the existing server runtime.
- Do not remove, replace, or regress the existing FastAPI backend or
  React/Vite frontend.
- Do not add accounts, cloud features, multiplayer, remote hosting,
  export/import, or anti-cheat claims.

## Basic acceptance expectations

- A player can launch the browser edition through the documented local path
  without starting FastAPI.
- A new player can select and play the initial mission through a mobile-first
  game flow.
- The five named threat categories and their established gameplay feedback are
  recognizably present.
- The existing server-backed runtime remains intact and is not a dependency of
  browser-edition play.
