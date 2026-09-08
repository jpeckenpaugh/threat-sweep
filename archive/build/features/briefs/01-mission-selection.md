# Mission Selection

## Purpose

Let the player choose a short threat-sweep mission and enter play with a clear understanding of its availability and progress through the mission set.

## Expected behavior

1. The home screen presents the available mission collection.
2. Each mission is shown as selectable or locked according to the player's progression.
3. Selecting an available mission presents enough identifying information for the player to choose it confidently.
4. Starting the selected mission moves the player into that mission's tactical sweep.
5. Locked missions cannot be started and communicate that they must be unlocked first.

## Inputs / outputs

- **Inputs:** a player selection of a mission; the player's current unlock progress.
- **Outputs:** entry into the selected mission, or clear locked-state feedback.

## User-visible behavior

The player sees a mobile-game-style mission list or map from the home screen. Available missions are visually actionable; locked missions are visibly distinct. Beginning a mission transitions into the mission screen.

## Constraints

- Missions are short, playable threat-sweep sessions.
- The initial experience includes a small set of missions.
- Mission availability follows the simple unlock progression.

## Basic acceptance expectations

- A new player can find and start an initial available mission.
- A locked mission is identifiable and cannot be started.
- Starting an available mission opens its tactical grid rather than a separate website-like flow.
