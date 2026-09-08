import assert from "node:assert/strict";
import test from "node:test";
import { makeBoard, publicBoard, resolve, safeComplete } from "../engine.js";
import { missionById } from "../missions.js";

const boardWith = (threat, row = 1, column = 1) => ({ version: 1, rows: 3, columns: 3, noisyNextScan: false, penalty: 0, cells: Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => ({ state: "hidden", threat: null, revealedThreat: null }))) });
const scanThreat = (threat) => { const board = boardWith(threat); board.cells[1][1].threat = threat; return [board, resolve(board, "scan", 1, 1, 42)]; };

test("seeded board retains a safe zero opening and redacts active threats", () => {
  const board = makeBoard(missionById(1), 42);
  assert.equal(board.cells[0][0].threat, null);
  assert.equal(publicBoard(board).cells.flat().some((cell) => "threat" in cell || cell.revealedThreat), false);
});
test("virus reports contamination feedback without changing neighbors", () => { const [board, output] = scanThreat("virus"); assert.equal(output.effects[0].type, "virus_signature"); assert.equal(output.effects[0].targets.length, 8); assert.equal(board.cells[0][0].state, "hidden"); });
test("hacker redacts a prior safe scan", () => { const board = boardWith("hacker"); board.cells[1][1].threat = "hacker"; board.cells[0][0] = { state: "scanned", threat: null, revealedThreat: null, signal: 0 }; resolve(board, "scan", 1, 1, 2); assert.equal(board.cells[0][0].state, "hidden"); });
test("software bug makes the next safe scan noisy", () => { const [board] = scanThreat("software_bug"); assert.equal(board.noisyNextScan, true); const output = resolve(board, "scan", 0, 0, 8); assert.equal(output.effects[0].type, "signal_noise"); assert.equal(board.noisyNextScan, false); });
test("rogue AI relocates and malware spreads", () => { const [aiBoard] = scanThreat("rogue_ai_bot"); assert.equal(aiBoard.cells[1][1].threat, null); assert.equal(aiBoard.cells.flat().filter((cell) => cell.threat === "rogue_ai_bot").length, 1); const [malwareBoard] = scanThreat("malware"); assert.equal(malwareBoard.cells.flat().filter((cell) => cell.threat === "malware").length, 2); });
test("marked or cleared sectors reject incompatible actions and clearing all safe sectors completes", () => { const board = boardWith(null); board.cells[0][0].state = "marked"; assert.throws(() => resolve(board, "clear", 0, 0, 1)); board.cells[0][0].state = "hidden"; resolve(board, "clear", 0, 0, 1); assert.equal(safeComplete(board), true); assert.throws(() => resolve(board, "scan", 0, 0, 1)); });
