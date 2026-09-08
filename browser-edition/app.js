import { GameClient } from "./game-client.js"
import { playEvents } from "./audio.js"

const app = document.querySelector("#app")
const client = new GameClient()
const state = { bootstrap: null, screen: "loading", attempt: null, mission: null, mode: "scan", effects: [], contamination: [], result: null, pending: false, error: "" }
const labels = { virus: "Virus", hacker: "Hacker", software_bug: "Software Bug", rogue_ai_bot: "Rogue AI Bot", malware: "Malware" }
const icons = {
  virus: "◉", hacker: "⌨", software_bug: "♧", rogue_ai_bot: "◉", malware: "◇",
}
const element = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node }
const button = (text, className, handler, disabled = false) => { const node = element("button", className, text); node.type = "button"; node.disabled = disabled; node.addEventListener("click", handler); return node }
const missionFor = (id) => state.bootstrap?.missions.find((mission) => mission.id === id) || state.mission

function threatIcon(category, size = "") {
  const node = element("span", `threat-icon ${category}`, icons[category] || "?")
  node.title = labels[category] || "Unknown threat"; node.setAttribute("role", "img"); node.setAttribute("aria-label", node.title)
  if (size) node.style.fontSize = size
  return node
}
function soundToggle(compact = false) {
  const enabled = state.bootstrap?.player.soundEnabled ?? true
  return button(compact ? (enabled ? "◖))" : "◖×") : (enabled ? "◖)) SOUND ON" : "◖× SOUND OFF"), `sound-toggle${compact ? " compact" : ""}`, async () => {
    if (state.pending) return
    try { state.bootstrap.player = await client.setSoundEnabled(!enabled); render() } catch (error) { showError(error) }
  })
}
function showError(error) { state.error = error?.message || "Local game authority failed."; render(); window.setTimeout(() => { state.error = ""; render() }, 3500) }
function renderHeader(title, subtitle, onBack) {
  const header = element("header", "mission-header")
  header.append(button("‹", "back-button", onBack)); const copy = element("div"); copy.append(element("p", "eyebrow", subtitle), element("h1", "", title)); header.append(copy, soundToggle(true)); return header
}
function renderHome() {
  const screen = element("main", "screen home-screen")
  const header = element("header", "app-header"), copy = element("div"); copy.append(element("p", "eyebrow", "SECURITY OPERATIONS // LOCAL NODE"), element("h1", "", "THREAT SWEEP")); header.append(copy, soundToggle()); screen.append(header)
  const hero = element("section", "hero-panel"), radar = element("div", "radar", "◉"), heroCopy = element("div"); heroCopy.append(element("p", "eyebrow accent", "SYSTEM STATUS"), element("h2", "", "Ready to sweep."), element("p", "", "Probe the grid. Isolate what is hiding in the signal.")); hero.append(radar, heroCopy); screen.append(hero)
  if (state.bootstrap.activeAttempt) { const resume = element("section", "resume-panel"); resume.append(element("span", "", "UNFINISHED OPERATION DETECTED"), button("RESUME SWEEP", "primary-action", resumeAttempt)); screen.append(resume) }
  const section = element("section", "mission-section"), heading = element("div", "section-label"); heading.append(element("span", "", "MISSION QUEUE"), element("small", "", `${state.bootstrap.missions.filter((m) => m.completed).length}/${state.bootstrap.missions.length} SECURED`)); section.append(heading)
  const list = element("div", "mission-list"); state.bootstrap.missions.forEach((mission) => list.append(missionCard(mission))); section.append(list); screen.append(section); return screen
}
function missionCard(mission) {
  const card = button("", `mission-card${mission.locked ? " locked" : ""}`, () => startMission(mission), mission.locked)
  const top = element("div", "mission-card-top"); top.append(element("span", "mission-number", String(mission.id).padStart(2, "0")), element("span", "mission-state", mission.locked ? "◈ LOCKED" : mission.completed ? "✓ SECURED" : "● READY")); card.append(top, element("h2", "", mission.title), element("p", "", mission.briefing))
  const meta = element("div", "mission-meta"); meta.append(element("span", "", `${mission.grid.rows}×${mission.grid.columns} GRID`), element("span", "", `◈ ${mission.targetScore} XP`)); card.append(meta)
  const threats = element("div", "threat-row"); mission.threatCategories.forEach((category) => threats.append(threatIcon(category, "1.25rem"))); if (mission.completed) threats.append(element("span", "rating", "★".repeat(mission.bestRating) + "☆".repeat(3 - mission.bestRating))); card.append(threats); if (mission.locked) card.append(element("div", "lock-copy", "Complete the previous operation to decrypt.")); return card
}
function renderMission() {
  const attempt = state.attempt, mission = state.mission, screen = element("main", "screen mission-screen"); screen.append(renderHeader(mission.title, "ACTIVE OPERATION", leaveMission))
  const total = attempt.board.rows * attempt.board.columns, hud = element("section", "hud"); [["SCORE", String(attempt.score).padStart(4, "0")], ["CLEARED", `${attempt.clearCount}/${total}`], ["SCANS", String(attempt.scanCount)]].forEach(([label, value]) => { const cell = element("div"); cell.append(element("small", "", label), element("strong", "", value)); hud.append(cell) }); screen.append(hud)
  const feedback = state.effects[0]?.message || "Select a tool, then target a sector."; screen.append(element("div", "mission-brief", `● ${feedback}`)); screen.append(tacticalGrid(attempt.board))
  const dock = element("nav", "action-dock"); dock.setAttribute("aria-label", "Sector action"); [["scan", "⌁", "SCAN"], ["clear", "＋", "CLEAR"], ["mark", "⚑", "MARK"]].forEach(([mode, icon, text]) => dock.append(button(`${icon}\n${text}`, state.mode === mode ? "selected" : "", () => { state.mode = mode; render() }, state.pending))); screen.append(dock); return screen
}
function tacticalGrid(board) {
  const wrap = element("div", "grid-wrap"), grid = element("div", "tactical-grid"); grid.style.gridTemplateColumns = `repeat(${board.columns}, minmax(0, 1fr))`; grid.setAttribute("aria-label", "Tactical threat grid")
  board.cells.forEach((line, row) => line.forEach((cell, column) => { const contaminated = state.contamination.some((target) => target.row === row && target.column === column); const label = `${cell.state} sector ${row + 1}, ${column + 1}${cell.revealedThreat ? `, ${labels[cell.revealedThreat]}` : ""}`; const sector = button("", `sector ${cell.state}${cell.revealedThreat ? " threat-revealed" : ""}${contaminated ? " contaminated" : ""}`, () => act(row, column), state.pending || cell.state === "cleared"); sector.setAttribute("aria-label", label)
    if (cell.state === "marked") sector.textContent = "⚑"; else if (cell.revealedThreat) sector.append(threatIcon(cell.revealedThreat, "1.35rem")); else if (cell.state === "scanned") sector.textContent = cell.signal ?? "?"; else if (cell.state === "cleared") sector.textContent = cell.signal || "·"; else sector.textContent = state.mode === "scan" ? "⌁" : state.mode === "clear" ? "＋" : "⚑"; grid.append(sector) })); wrap.append(grid); return wrap
}
function renderResults() {
  const success = state.result.outcome === "success", screen = element("main", `screen results-screen ${success ? "success" : "failure"}`); screen.append(element("div", "result-orb", success ? "✓" : "!"), element("p", "eyebrow", `MISSION ${success ? "COMPLETE" : "BREACHED"}`), element("h1", "", success ? "SYSTEM SECURED" : "THREAT ESCAPED"), element("p", "result-copy", success ? "Your sweep contained the incident." : "A hostile sector was cleared. Reassess the signal and try again."))
  const score = element("section", "result-score"); score.append(element("small", "", "OPERATION SCORE"), element("strong", "", String(state.result.score).padStart(4, "0")), element("div", "stars", "★".repeat(state.result.rating || 0) + "☆".repeat(3 - (state.result.rating || 0)))); screen.append(score)
  const stats = element("div", "result-stats"); stats.append(element("span", "", `${state.attempt.clearCount} sectors cleared`), element("span", "", `${state.attempt.scanCount} scans deployed`)); screen.append(stats)
  if (success && state.result.unlockedMissionId) { const unlock = element("div", "unlock-banner"); unlock.append(threatIcon("rogue_ai_bot", "1.4rem"), element("span", "", "NEW MISSION DECRYPTED")); screen.append(unlock) }
  const actions = element("div", "result-actions"); actions.append(button(success ? "MISSION QUEUE" : "BACK TO QUEUE", "primary-action", goHome)); if (!success) actions.append(button("RETRY SWEEP", "secondary-action", () => startMission(state.mission, true))); screen.append(actions); return screen
}
function render() { app.replaceChildren(); if (state.error) app.append(element("div", "error-toast", state.error)); if (state.screen === "loading") { const loading = element("main", "loading-screen"); loading.append(element("div", "loader"), element("p", "", state.error || "ESTABLISHING LOCAL SECURITY LINK...")); app.append(loading) } else if (state.screen === "home") app.append(renderHome()); else if (state.screen === "mission") app.append(renderMission()); else app.append(renderResults()) }
async function loadHome() { state.pending = true; render(); try { state.bootstrap = await client.bootstrap(); state.screen = "home" } catch (error) { showError(error) } finally { state.pending = false; render() } }
async function startMission(mission, restart = false) { if (state.pending) return; state.pending = true; render(); try { state.attempt = await client.startAttempt(mission.id, restart); state.mission = mission; state.effects = []; state.contamination = []; state.mode = "scan"; state.screen = "mission" } catch (error) { showError(error) } finally { state.pending = false; render() } }
async function resumeAttempt() { const active = state.bootstrap.activeAttempt; if (!active) return; state.pending = true; render(); try { state.attempt = await client.getAttempt(active.id); state.mission = missionFor(active.missionId); state.screen = "mission" } catch (error) { showError(error) } finally { state.pending = false; render() } }
async function act(row, column) { if (state.pending || !state.attempt) return; state.pending = true; render(); try { const update = await client.act(state.attempt.id, state.mode, row, column); state.attempt = update.attempt; state.effects = update.effects || []; state.contamination = state.effects.filter((effect) => effect.type === "virus_signature" && effect.applied).flatMap((effect) => effect.targets || []); playEvents(update.events, state.bootstrap.player.soundEnabled); if (state.contamination.length) window.setTimeout(() => { state.contamination = []; render() }, 1100); if (update.result) { state.result = update.result; window.setTimeout(() => { state.screen = "results"; render() }, 450) } } catch (error) { showError(error) } finally { state.pending = false; render() } }
async function leaveMission() { state.screen = "home"; state.attempt = null; state.effects = []; state.contamination = []; await loadHome() }
async function goHome() { state.attempt = null; state.result = null; state.effects = []; state.contamination = []; await loadHome() }
loadHome()
