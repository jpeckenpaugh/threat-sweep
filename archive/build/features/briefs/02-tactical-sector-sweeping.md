# Tactical Sector Sweeping

## Purpose

Provide the central puzzle interaction: investigating a system grid to locate threats while avoiding unsafe clears.

## Expected behavior

1. A mission displays a tactical grid of hidden sectors.
2. The player can scan sectors to gather nearby threat signals.
3. The player can clear sectors believed to be safe.
4. The player can mark sectors considered suspicious for later reference.
5. Each action updates the visible board state and mission status.
6. Clearing and marking continue until the mission reaches a success or failure outcome.

## Inputs / outputs

- **Inputs:** player taps or equivalent touch actions on grid sectors; the selected scan, clear, or mark action.
- **Outputs:** updated sector state, visible scan information where applicable, and updates to the mission's progress or outcome.

## User-visible behavior

The player interacts directly with a large, touch-friendly tactical grid. Sectors visibly distinguish hidden, scanned, cleared, and marked states. Feedback makes each action understandable without leaving the mission screen.

## Constraints

- The grid must support scanning, clearing, and marking during a mission.
- The interaction must preserve the tension of a mine-clearing-style puzzle without presenting threats as bombs.
- Controls must be practical in a portrait mobile layout.

## Basic acceptance expectations

- The player can take all three stated actions on appropriate sectors.
- Actions visibly change the board and relevant status information.
- Marking helps identify suspicious sectors without being mistaken for clearing them.
