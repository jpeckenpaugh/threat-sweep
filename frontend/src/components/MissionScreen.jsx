import TacticalGrid from './TacticalGrid'
import SoundToggle from './SoundToggle'

const modes = [['scan', '⌁', 'SCAN'], ['clear', '＋', 'CLEAR'], ['mark', '⚑', 'MARK']]
export default function MissionScreen({ attempt, mission, mode, setMode, onAction, pending, effects, onExit, soundEnabled, onSoundChange }) {
  const total = attempt.board.rows * attempt.board.columns
  return <main className="screen mission-screen"><header className="mission-header"><button className="back-button" onClick={onExit} aria-label="Return to mission queue">‹</button><div><p className="eyebrow">ACTIVE OPERATION</p><h1>{mission.title}</h1></div><SoundToggle compact enabled={soundEnabled} onChange={onSoundChange} /></header>
    <section className="hud"><div><small>SCORE</small><strong>{String(attempt.score).padStart(4, '0')}</strong></div><div><small>CLEARED</small><strong>{attempt.clearCount}<i>/{total}</i></strong></div><div><small>SCANS</small><strong>{attempt.scanCount}</strong></div></section>
    <div className="mission-brief"><span className="pulse"/> <span>{effects[0]?.message || 'Select a tool, then target a sector.'}</span></div>
    <TacticalGrid board={attempt.board} mode={mode} onAction={onAction} pending={pending} />
    <nav className="action-dock" aria-label="Sector action">{modes.map(([value, icon, label]) => <button key={value} className={mode === value ? 'selected' : ''} onClick={() => setMode(value)} disabled={pending}><b>{icon}</b><span>{label}</span></button>)}</nav>
  </main>
}
