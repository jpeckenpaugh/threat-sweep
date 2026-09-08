/* Pure local authority. Private boards must never be handed to app.js. */
const at = (board, row, column) => board.cells[row][column];
export const neighbors = (board, row, column) => {
  const output = [];
  for (let r = Math.max(0, row - 1); r < Math.min(board.rows, row + 2); r += 1) for (let c = Math.max(0, column - 1); c < Math.min(board.columns, column + 2); c += 1) if (r !== row || c !== column) output.push([r, c]);
  return output;
};
const rngFor = (seed) => { let value = (seed >>> 0) || 1; return () => { value |= 0; value = (value + 0x6D2B79F5) | 0; let t = Math.imul(value ^ value >>> 15, 1 | value); t = (t + Math.imul(t ^ t >>> 7, 61 | t)) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
const shuffled = (items, random) => { const result = [...items]; for (let i = result.length - 1; i > 0; i -= 1) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; } return result; };
const choose = (items, random) => items[Math.floor(random() * items.length)];
export const signal = (board, row, column) => neighbors(board, row, column).filter(([r, c]) => at(board, r, c).threat).length;

export function makeBoard(mission, seed) {
  const random = rngFor(seed), cells = Array.from({ length: mission.rows }, () => Array.from({ length: mission.columns }, () => ({ state: "hidden", threat: null, revealedThreat: null })));
  const positions = shuffled(Array.from({ length: mission.rows * mission.columns }, (_, i) => [Math.floor(i / mission.columns), i % mission.columns]), random);
  let index = 0;
  for (const [threat, count] of Object.entries(mission.threats)) for (let n = 0; n < count; n += 1) { const [r, c] = positions[index++]; cells[r][c].threat = threat; }
  const board = { version: 1, rows: mission.rows, columns: mission.columns, cells, noisyNextScan: false, penalty: 0 };
  const forbidden = new Set([[0, 0], ...neighbors(board, 0, 0)].map(([r, c]) => `${r}:${c}`));
  for (const key of forbidden) { const [r, c] = key.split(":").map(Number); if (!at(board, r, c).threat) continue; const target = positions.find(([rr, cc]) => !forbidden.has(`${rr}:${cc}`) && !at(board, rr, cc).threat); if (target) { at(board, target[0], target[1]).threat = at(board, r, c).threat; at(board, r, c).threat = null; } }
  return board;
}

export function publicBoard(board, terminal = false) { return { rows: board.rows, columns: board.columns, cells: board.cells.map((row) => row.map((cell) => { const view = { state: cell.state }; if (cell.signal !== undefined) view.signal = cell.signal; if (terminal || cell.revealedThreat) view.revealedThreat = cell.revealedThreat || cell.threat; return view; })) }; }
const skipped = (type, message, extra = {}) => ({ type, applied: false, skipped: true, reason: "No legal target exists", message, ...extra });

function effect(board, threat, row, column, random) {
  if (threat === "virus") { const targets = neighbors(board, row, column).map(([r, c]) => ({ row: r, column: c, state: "contaminated" })); return targets.length ? { type: "virus_signature", applied: true, skipped: false, message: "Viral signature isolated.", targets } : skipped("virus_signature", "Viral signature has no neighboring sectors.", { targets }); }
  if (threat === "hacker") { const targets = []; board.cells.forEach((cells, r) => cells.forEach((cell, c) => { if (cell.state === "scanned" && !cell.threat) targets.push([r, c]); })); if (!targets.length) return skipped("hacker_probe", "Hacker probe found no scan to redact."); const [r, c] = choose(targets, random); at(board, r, c).state = "hidden"; delete at(board, r, c).signal; return { type: "hacker_probe", applied: true, skipped: false, message: "Hacker redacted a safe scan." }; }
  if (threat === "software_bug") { board.noisyNextScan = true; return { type: "signal_noise", applied: true, skipped: false, message: "Signal noise will affect the next safe scan." }; }
  if (threat === "rogue_ai_bot") { const targets = []; board.cells.forEach((cells, r) => cells.forEach((cell, c) => { if (cell.state === "hidden" && !cell.threat) targets.push([r, c]); })); if (!targets.length) return skipped("ai_relocation", "Rogue AI had no safe relocation path."); const [r, c] = choose(targets, random); at(board, r, c).threat = threat; const origin = at(board, row, column); origin.threat = null; origin.state = "scanned"; origin.signal = signal(board, row, column); return { type: "ai_relocation", applied: true, skipped: false, message: "Rogue AI relocated to an unknown sector." }; }
  const targets = neighbors(board, row, column).filter(([r, c]) => at(board, r, c).state === "hidden" && !at(board, r, c).threat); if (!targets.length) return skipped("malware_spread", "Malware found no sector to infect."); const [r, c] = choose(targets, random); at(board, r, c).threat = "malware"; return { type: "malware_spread", applied: true, skipped: false, message: "Malware spread into a neighboring sector." };
}
export const safeComplete = (board) => board.cells.every((row) => row.every((cell) => cell.threat || cell.state === "cleared"));
export function resolve(board, type, row, column, seed) {
  if (!Number.isInteger(row) || !Number.isInteger(column) || row < 0 || column < 0 || row >= board.rows || column >= board.columns) throw new Error("Coordinates are outside this mission grid.");
  if (!['scan', 'clear', 'mark'].includes(type)) throw new Error("Unknown tactical action.");
  const cell = at(board, row, column), events = [type], random = rngFor(seed + row * 101 + column * 17);
  if (type === "mark") { if (cell.state === "hidden") cell.state = "marked"; else if (cell.state === "marked") cell.state = "hidden"; else throw new Error("Only hidden sectors can be marked."); return { effects: [], events, failed: false, clears: 0, scans: 0 }; }
  if (cell.state === "marked") throw new Error("Marked sectors cannot be cleared or scanned."); if (cell.state === "cleared") throw new Error("Cleared sectors cannot be acted on.");
  if (type === "scan") { if (cell.threat) { cell.state = "scanned"; cell.revealedThreat = cell.threat; const item = effect(board, cell.threat, row, column, random); return { effects: [item], events: [...events, "warning"], failed: false, clears: 0, scans: 1 }; } let value = signal(board, row, column), effects = []; if (board.noisyNextScan) { board.noisyNextScan = false; value = Math.max(0, value + (random() < .5 ? -1 : 1)); effects = [{ type: "signal_noise", applied: true, skipped: false, message: "Noisy signal: reading may be off by one." }]; } cell.state = "scanned"; cell.signal = value; return { effects, events, failed: false, clears: 0, scans: 1 }; }
  if (cell.threat) { cell.state = "cleared"; cell.revealedThreat = cell.threat; return { effects: [], events, failed: true, clears: 0, scans: 0 }; }
  let clears = 0; const clear = (r, c) => { const sector = at(board, r, c); if (sector.state === "cleared" || sector.state === "marked" || sector.threat) return; sector.state = "cleared"; sector.signal = signal(board, r, c); clears += 1; if (sector.signal === 0) neighbors(board, r, c).forEach(([nr, nc]) => clear(nr, nc)); }; clear(row, column); return { effects: [], events, failed: false, clears, scans: 0 };
}
