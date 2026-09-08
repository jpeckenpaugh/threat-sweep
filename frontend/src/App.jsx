import { useEffect, useState } from 'react'
import { api } from './api/client'
import { useGameAudio } from './hooks/useGameAudio'
import HomeScreen from './components/HomeScreen'
import MissionScreen from './components/MissionScreen'
import ResultsScreen from './components/ResultsScreen'

export default function App() {
  const [bootstrap, setBootstrap] = useState(null), [screen, setScreen] = useState('home'), [attempt, setAttempt] = useState(null)
  const [mission, setMission] = useState(null), [mode, setMode] = useState('scan'), [effects, setEffects] = useState([]), [contaminationTargets, setContaminationTargets] = useState([]), [result, setResult] = useState(null)
  const [soundEnabled, setSoundEnabled] = useState(true), [pending, setPending] = useState(false), [error, setError] = useState('')
  const playEvents = useGameAudio(soundEnabled)
  const load = async () => { setError(''); try { const data = await api.bootstrap(); setBootstrap(data); setSoundEnabled(data.player.soundEnabled) } catch (err) { setError(err.message) } }
  useEffect(() => { load() }, [])
  useEffect(() => {
    const targets = effects.filter((effect) => effect.type === 'virus_signature' && effect.applied).flatMap((effect) => effect.targets || [])
    setContaminationTargets(targets)
    if (!targets.length) return undefined
    const timeout = window.setTimeout(() => setContaminationTargets([]), 1100)
    return () => window.clearTimeout(timeout)
  }, [effects])
  const updateSound = async (enabled) => { const previous = soundEnabled; setSoundEnabled(enabled); try { await api.saveSettings(enabled) } catch (err) { setSoundEnabled(previous); setError(err.message) } }
  const start = async (selected, restart = false) => { setPending(true); setError(''); try { const next = await api.startMission(selected.id, restart); setMission(selected); setAttempt(next); setEffects([]); setContaminationTargets([]); setMode('scan'); setScreen('mission') } catch (err) { setError(err.message) } finally { setPending(false) } }
  const action = async (row, column) => { if (!attempt || pending) return; setPending(true); setError(''); try { const update = await api.action(attempt.id, mode, row, column); setAttempt(update.attempt); setEffects(update.effects || []); playEvents(update.events); if (update.result) { setResult(update.result); window.setTimeout(() => setScreen('results'), 500) } } catch (err) { setError(err.message) } finally { setPending(false) } }
  const home = async () => { setScreen('home'); setAttempt(null); setResult(null); setEffects([]); setContaminationTargets([]); await load() }
  const exit = async () => { if (attempt?.status === 'active') await api.abandon(attempt.id).catch(() => {}); home() }
  if (!bootstrap) return <main className="loading-screen"><div className="loader"/><p>{error || 'ESTABLISHING SECURE LINK...'}</p>{error && <button onClick={load}>RETRY LINK</button>}</main>
  return <div className="app-shell">{error && <div className="error-toast" role="alert">{error}</div>}{screen === 'home' && <HomeScreen bootstrap={bootstrap} onStart={start} soundEnabled={soundEnabled} onSoundChange={updateSound}/>} {screen === 'mission' && <MissionScreen attempt={attempt} mission={mission} mode={mode} setMode={setMode} onAction={action} pending={pending} effects={effects} contaminationTargets={contaminationTargets} onExit={exit} soundEnabled={soundEnabled} onSoundChange={updateSound}/>} {screen === 'results' && <ResultsScreen result={result} attempt={attempt} mission={mission} onHome={home} onRetry={() => start(mission, true)}/>}</div>
}
