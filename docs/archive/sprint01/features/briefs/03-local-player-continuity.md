# Local Player Continuity

## Purpose

Let a single local player return to the browser edition without losing the
settings, progression, best mission results, or unfinished mission needed for
the established connected mission experience.

## Expected behavior

1. The browser edition begins with a single local-player experience and does
   not require registration, sign-in, or a network connection.
2. A new local player has the established initial mission available and later
   mission availability follows the existing completion sequence.
3. When the player changes the sound preference, the browser edition retains
   that preference for subsequent visits and applies it to later feedback.
4. When the player succeeds at a mission, it retains the resulting completion
   state, best score, and best rating used by mission selection and results.
5. When the player leaves an active mission and returns later in the same
   browser environment, the edition restores that unfinished mission so it can
   be resumed rather than silently replaced by a different board.
6. Completed and failed mission outcomes remain understandable after a return
   through the retained progression and performance information.

## Inputs / outputs

- **Inputs:** local browser availability; player sound-setting changes;
  mission attempts and their actions; mission outcomes.
- **Outputs:** retained sound preference, mission completion and performance
  records, current unlock availability, and one resumable unfinished mission
  state where applicable.

## User-visible behavior

The player returns to the game and finds the same sound preference and mission
progress reflected in the home screen. A partially played mission remains
available to continue instead of forcing the player to start over. Unlocks and
best performance remain visible wherever the existing game presents them.

## Constraints

- Persistence is local to the player's browser environment and supports one
  local player only.
- Preserve the existing semantics for sound preference, simple mission unlock
  order, completion, best score, best rating, and unfinished attempts.
- Browser-local retention is not an account, cloud-sync, backup, or
  cross-device guarantee.
- Do not add export/import, reset controls, remote storage, multiplayer, or
  account management in this sprint.
- Do not require the FastAPI runtime to save or resume browser-edition play.

## Basic acceptance expectations

- A sound-toggle change remains in effect after the browser edition is
  reopened in the same browser environment.
- Completing a mission retains its completion and performance information and
  unlocks the appropriate following mission.
- Leaving and reopening an active mission permits that mission to be resumed
  with its prior public progress intact.
- The browser edition can perform these continuity behaviors without a server
  or account.
