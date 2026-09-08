import ThreatIcon from './ThreatIcon'

export default function ResultsScreen({ result, attempt, mission, onHome, onRetry }) {
  const success = result.outcome === 'success'
  return <main className={`screen results-screen ${success ? 'success' : 'failure'}`}><div className="result-orb">{success ? '✓' : '!'}</div><p className="eyebrow">MISSION {success ? 'COMPLETE' : 'BREACHED'}</p><h1>{success ? 'SYSTEM SECURED' : 'THREAT ESCAPED'}</h1><p className="result-copy">{success ? 'Your sweep contained the incident.' : 'A hostile sector was cleared. Reassess the signal and try again.'}</p>
    <section className="result-score"><small>OPERATION SCORE</small><strong>{String(result.score).padStart(4, '0')}</strong><div className="stars">{'★'.repeat(result.rating || 0)}{'☆'.repeat(3 - (result.rating || 0))}</div></section>
    <div className="result-stats"><span>{attempt.clearCount} sectors cleared</span><span>{attempt.scanCount} scans deployed</span></div>
    {success && result.unlockedMissionId && <div className="unlock-banner"><ThreatIcon category="rogue ai bot" size={28}/><span>NEW MISSION DECRYPTED</span></div>}
    <div className="result-actions"><button className="primary-action" onClick={onHome}>{success ? 'MISSION QUEUE' : 'BACK TO QUEUE'}</button>{!success && <button className="secondary-action" onClick={onRetry}>RETRY SWEEP</button>}</div>
  </main>
}
