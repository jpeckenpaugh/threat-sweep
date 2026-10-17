# Player Progression

## Purpose

Give short missions a connected sense of advancement by recording basic player progress and unlocking further missions.

## Expected behavior

1. The game records the player's basic mission progression.
2. An initial mission is available to a new player.
3. Completing missions updates progression.
4. Progression makes later missions available through a simple unlock sequence.
5. Mission selection reflects the updated availability when the player returns to it.

## Inputs / outputs

- **Inputs:** the player's current saved progress and mission completion outcomes.
- **Outputs:** updated progress records and the resulting set of available or locked missions.

## User-visible behavior

The player sees which missions are available and gains access to later missions as they progress. Completion produces a tangible sense of advancement beyond the individual results screen.

## Constraints

- Progression is basic and easy for a new player to understand.
- Missions unlock through a simple progression rather than all being unavailable by default.
- Progress must support the mission-selection experience.

## Basic acceptance expectations

- A new player has a playable starting mission.
- Completing an appropriate mission changes progress and can unlock a subsequent mission.
- The unlocked state remains reflected when the player revisits mission selection.
