import Sector from './Sector'

export default function TacticalGrid({ board, mode, onAction, pending, contaminationTargets = [] }) {
  const contaminated = new Set(contaminationTargets.map(({ row, column }) => `${row}-${column}`))
  return <div className="grid-wrap" aria-label="Tactical threat grid"><div className="tactical-grid" style={{ gridTemplateColumns: `repeat(${board.columns}, minmax(0, 1fr))` }}>{board.cells.flatMap((line, row) => line.map((cell, column) => <Sector key={`${row}-${column}`} cell={cell} row={row} column={column} mode={mode} onAction={onAction} pending={pending} contaminated={contaminated.has(`${row}-${column}`)} />))}</div></div>
}
