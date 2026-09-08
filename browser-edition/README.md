# Threat Sweep browser edition authority modules

These modules are the Worker-owned game and IndexedDB persistence layer for the
static browser edition. They are intentionally independent of `backend/` and
`frontend/`; Stage 07 supplies the static UI and RPC client.

Run the pure engine tests with a current Node runtime:

```sh
node --test browser-edition/tests/engine.test.mjs
```
