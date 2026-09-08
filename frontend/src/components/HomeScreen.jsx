import MissionCard from './MissionCard'
import SoundToggle from './SoundToggle'

export default function HomeScreen({ bootstrap, onStart, soundEnabled, onSoundChange }) {
  return <main className="screen home-screen"><header className="app-header"><div><p className="eyebrow">SECURITY OPERATIONS // LOCAL NODE</p><h1>THREAT <em>SWEEP</em></h1></div><SoundToggle enabled={soundEnabled} onChange={onSoundChange} /></header>
    <section className="hero-panel"><div className="radar"><span/><span/><i>◉</i></div><div><p className="eyebrow accent">SYSTEM STATUS</p><h2>Ready to sweep.</h2><p>Probe the grid. Isolate what is hiding in the signal.</p></div></section>
    <section className="mission-section"><div className="section-label"><span>MISSION QUEUE</span><small>{bootstrap.missions.filter((m) => m.completed).length}/{bootstrap.missions.length} SECURED</small></div><div className="mission-list">{bootstrap.missions.map((mission) => <MissionCard key={mission.id} mission={mission} onStart={onStart} />)}</div></section>
  </main>
}
