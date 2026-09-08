# Local Game Authority

## Purpose

Preserve the established separation between player intent and game-rule
resolution after removing the server dependency: the visible game interface
asks to act and renders the resulting public state, while browser-local game
authority owns concealed board information and outcome decisions.

## Expected behavior

1. The player uses the visible tactical interface to request scans, clears,
   marks, mission starts, restarts, or resumptions.
2. The local game authority evaluates each request against the mission's
   current hidden board, legal-action rules, threat behavior, score, and
   progression rules.
3. It returns the resulting public mission snapshot, action feedback, threat
   effect feedback, and terminal outcome when applicable for the interface to
   display.
4. During an active mission, undiscovered threat locations and categories stay
   outside the public board information shown by the interface.
5. The same established rules remain in effect: safe scans reveal nearby-risk
   information, clears can expand safe regions, marks remain player aids, a
   threat clear fails the mission, and clearing all safe sectors succeeds.
6. The five established threat behaviors remain associated with their
   canonical identities and produce understandable feedback when triggered or
   skipped.

## Inputs / outputs

- **Inputs:** mission choice or active mission state; player intents; the
  mission's current concealed state and saved progression.
- **Outputs:** a redacted public board snapshot, updated counters and status,
  action and threat-effect feedback, saved attempt state, and a success or
  failure result when the mission ends.

## User-visible behavior

The player taps the same scan, clear, and mark controls and receives immediate
clear feedback on the grid, HUD, and results screen. An invalid or unavailable
action is communicated without changing the mission unexpectedly. Threat
effects remain legible and category-specific, while sectors that have not
been legitimately discovered do not reveal hidden threats.

## Constraints

- Keep rule resolution and hidden-board handling separate from the visible
  interface's rendering and input collection.
- Preserve the established mission rules, scoring meaning, progression rules,
  terminal conditions, and public-board redaction behavior.
- Treat this boundary as local gameplay organization only; it does not create
  anti-cheat guarantees.
- Maintain support for one local player and offline play without a server or
  account.
- Do not introduce new threat categories, actions, score systems, or online
  gameplay.

## Basic acceptance expectations

- The interface can request each established tactical action and render only
  the returned public state.
- An active board does not reveal undiscovered threat locations or categories.
- Legal actions, invalid actions, threat effects, score changes, and terminal
  outcomes match the established Threat Sweep behavior.
- A clear on a threat fails a mission, and clearing every safe sector succeeds.
