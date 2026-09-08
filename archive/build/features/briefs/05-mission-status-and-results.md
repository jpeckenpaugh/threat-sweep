# Mission Status and Results

## Purpose

Keep the player informed during a sweep and conclude every mission with clear, satisfying performance feedback.

## Expected behavior

1. During play, a compact status HUD communicates mission progress.
2. Player actions update relevant progress and performance feedback.
3. The mission reaches a clearly defined success or failure state.
4. When it ends, the game presents a results screen with the outcome and performance or score feedback.
5. The player can understand the result before returning to the game flow or choosing another mission.

## Inputs / outputs

- **Inputs:** mission state and player in-mission actions.
- **Outputs:** current progress information, a success or failure outcome, and a results presentation including score or performance feedback.

## User-visible behavior

The player sees an always-accessible but compact mission HUD, clear success or failure feedback, and a dedicated mobile-game-style results screen. Outcome feedback is visually prominent and supported by appropriate game feedback.

## Constraints

- Show mission progress, score or performance feedback, and win/loss states.
- The status display must remain compact and not crowd out the tactical grid.
- Results must clearly distinguish success from failure.

## Basic acceptance expectations

- The player can tell how the mission is progressing while playing.
- Every completed mission produces one unambiguous outcome.
- The results screen communicates performance and lets the player continue the core game flow.
