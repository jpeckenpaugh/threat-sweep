# Cyber Threat Catalog

## Purpose

Make hidden hazards feel like a distinct cyber-security threat sweep rather than generic mines.

## Expected behavior

1. Missions use cyber-threat categories that include viruses, hackers, software bugs, rogue AI bots, and malware.
2. Each category has a recognizable visual identity.
3. When a threat becomes visible through gameplay feedback or a mission outcome, its category is communicated visually.
4. The visual treatment remains consistent wherever that category appears.

## Inputs / outputs

- **Inputs:** a mission's threat composition and game events that reveal or reference a threat.
- **Outputs:** category-specific threat imagery or icon-like visuals for the player to recognize.

## User-visible behavior

The player encounters lightweight, original, icon-like threat graphics instead of bomb imagery. The graphics are legible against the dark command-center presentation and differentiable at mobile scale.

## Constraints

- Include the five named categories: virus, hacker, software bug, rogue AI bot, and malware.
- Every category must have a distinct, recognizable identity.
- Graphics should be lightweight and original or icon-like; they must not rely on a one-for-one Mine Sweeper presentation.

## Basic acceptance expectations

- A player can visually distinguish each named threat category when shown.
- The same threat category is represented consistently across the game.
- No threat category is represented as a conventional bomb.
