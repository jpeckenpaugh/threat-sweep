# Browser Edition Access

## Purpose

Give a developer or local player one straightforward, documented way to serve
and open the browser edition for offline local play, without requiring the
FastAPI application.

## Expected behavior

1. The project provides a simple local static-serving path for the browser
   edition.
2. The documented instructions identify the browser-edition entry point and
   the command or process needed to serve it locally.
3. Following that path opens the standalone game in a browser and allows play
   without starting the FastAPI backend, creating a Python application
   environment, or configuring an API port.
4. The instructions distinguish the browser edition from the existing
   server-backed fallback runtime, so a player can choose the intended local
   play path.
5. The serving path supports the browser environment needed for the game's
   local gameplay boundary and retained local data; directly opening files is
   not presented as the supported route when it cannot provide that
   environment.

## Inputs / outputs

- **Inputs:** the checked-out project files and a locally available static
  serving process.
- **Outputs:** a local browser URL or equivalent served entry point from which
  the standalone Threat Sweep edition can be played.

## User-visible behavior

The local player can follow a short set of project instructions, open the
provided local address, and reach the Threat Sweep home screen. They do not
need to run a separate API service or encounter setup instructions intended
only for the fallback runtime.

## Constraints

- Keep access local and focused on offline play.
- Do not require FastAPI, its API port, an account, cloud setup, remote
  hosting, or deployment configuration for browser-edition play.
- Keep the existing server-backed run instructions available as a distinct
  fallback/reference path.
- Do not promise unsupported direct-file behavior, network features, or
  cross-browser persistence guarantees.

## Basic acceptance expectations

- Project documentation contains a clearly labeled browser-edition start path.
- A player can follow it to serve and open the standalone edition without
  starting FastAPI.
- The opened game can reach the home screen and start the initial mission.
- The fallback runtime's instructions remain present and are clearly separate.
