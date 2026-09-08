import ThreatIcon from './ThreatIcon'

export default function Sector({ cell, row, column, mode, onAction, pending }) {
  const state = cell.state
  const label = `${state} sector ${row + 1}, ${column + 1}${cell.revealedThreat ? `, ${cell.revealedThreat}` : ''}`
  return <button disabled={pending || state === 'cleared'} onClick={() => onAction(row, column)} className={`sector ${state} ${cell.revealedThreat ? 'threat-revealed' : ''}`} aria-label={label}>
    {state === 'marked' && <span className="sector-mark">⚑</span>}
    {state === 'scanned' && (cell.revealedThreat ? <ThreatIcon category={cell.revealedThreat} size={25} /> : <span className="signal">{cell.signal ?? '?'}</span>)}
    {state === 'cleared' && (cell.revealedThreat ? <ThreatIcon category={cell.revealedThreat} size={25} /> : <span className="cleared-dot">{cell.signal || '·'}</span>)}
    {state === 'hidden' && <span className="sector-mode">{mode === 'scan' ? '⌁' : mode === 'clear' ? '＋' : '⚑'}</span>}
  </button>
}
