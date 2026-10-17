# 🛡️ Threat Sweep — Tactical Cyber-Security Grid Puzzle

> **Probe the Signal. Isolate the Threat.** — An offline-capable tactical security puzzle with Web Worker game authority, IndexedDB campaign progression, and 5 dynamic cyber threat behaviors.

[![Play Now on GitHub Pages](https://img.shields.io/badge/▶_PLAY_NOW-threat--sweep-38bdf8?style=for-the-badge)](https://jpeckenpaugh.github.io/threat-sweep/)

---

## 🎮 Play in Your Browser ([Live Demo](https://jpeckenpaugh.github.io/threat-sweep/))

- **3 Tactical Sector Tools:** Switch between `⌁ SCAN` (probe adjacent signal strength), `＋ CLEAR` (secure safe data nodes), and `⚑ MARK` (quarantine suspected threat sectors).
- **5 Dynamic Cyber Threats:** Outsmart **Virus** (contaminates neighboring signals), **Hacker** (redacts scan readouts), **Software Bug** (corrupts telemetry), **Rogue AI Bot** (relocates when cornered), and **Malware** (spreads if left unmarked).
- **Zero-Backend Browser Edition + Full-Stack Edition:** Runs 100% offline in the browser via a dedicated Web Worker authority and IndexedDB persistence (`browser-edition/`), alongside the Python FastAPI + React full-stack implementation (`backend/` & `frontend/`).

---

## 🛠️ For Developers (The Other 10%)

### Quickstart (Browser Edition)
```bash
python3 -m http.server --directory browser-edition 8080
```
Then open `http://localhost:8080` in your browser.

### Full-Stack Edition
```bash
./install.sh
./run.sh
```

### Automated Test Runner & Showcase
```bash
./test-runner/run.sh --showcase
```
