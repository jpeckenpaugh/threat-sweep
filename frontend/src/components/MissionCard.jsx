import ThreatIcon from './ThreatIcon'

export default function MissionCard({ mission, onStart }) {
  return <button className={`mission-card ${mission.locked ? 'locked' : ''}`} disabled={mission.locked} onClick={() => onStart(mission)}>
    <div className="mission-card-top"><span className="mission-number">{String(mission.id).padStart(2, '0')}</span><span className="mission-state">{mission.locked ? '◈ LOCKED' : mission.completed ? '✓ SECURED' : '● READY'}</span></div>
    <h2>{mission.title}</h2><p>{mission.briefing}</p>
    <div className="mission-meta"><span>{mission.grid.rows}×{mission.grid.columns} GRID</span><span>◈ {mission.targetScore} XP</span></div>
    <div className="threat-row">{mission.threatCategories.map((category) => <ThreatIcon key={category} category={category} size={22} />)}{mission.completed && <span className="rating">{'★'.repeat(mission.bestRating)}{'☆'.repeat(3 - mission.bestRating)}</span>}</div>
    {mission.locked && <div className="lock-copy">Complete the previous operation to decrypt.</div>}
  </button>
}
