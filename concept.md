# Threat Sweep

A simple, polished mobile-first strategy puzzle game inspired by the tension of mine-clearing games, but centered on scanning a digital grid for hidden cyber threats rather than finding bombs.

The player is a Security Operator protecting a connected system from threats such as viruses, hackers, software bugs, rogue AI bots, and malware. Each threat has a recognizable visual identity and a slightly different behavior or effect, making every sweep feel like an active security operation rather than a standard Mine Sweeper board.

The core experience is a series of quick, satisfying "threat sweep" missions. The player scans sectors, interprets nearby threat signals, marks suspicious locations, and clears a board while avoiding dangerous mistakes. Missions become more interesting through varied threat mixes, escalating pressure, and a sense that the system is reacting to the player's decisions.

The interface should feel like a native mobile game or app: a portrait-oriented game screen, large tap-friendly controls, a compact status HUD, animated feedback, clear progress indicators, and a modern cyber-security visual style. It should not resemble a conventional website. The visual direction uses a dark command-center theme with bright scanner, alert, and threat colors.

Include lightweight original graphics or icon-like illustrations for every threat type, along with basic game sound effects for scanning, marking, clearing, warnings, mission success, and mission failure. Sound should support the game's tension and satisfaction without becoming distracting.

Use a mobile-first single-page application stack: React with Bootstrap for the frontend, and FastAPI with SQLite for persistence. Start with a small set of playable missions, a few threat types, and simple initial progression so a new player can immediately understand the game.

Major capabilities:

- Start and play short threat-sweep missions
- Scan and clear sectors on a tactical grid
- Identify, mark, and avoid multiple cyber-threat types
- Show distinct visual feedback and basic behaviors for each threat category
- Provide mission progress, score or performance feedback, and win/loss states
- Play sound effects and offer a simple sound setting
- Track basic player progress and unlocked missions
- Present a polished mobile-game-style home screen, mission screen, and results screen
