import { useCallback } from 'react'
import { playTone } from '../assets/audio'

export function useGameAudio(soundEnabled) {
  return useCallback((events = []) => {
    if (!soundEnabled) return
    events.forEach((event, index) => window.setTimeout(() => playTone(event), index * 80))
  }, [soundEnabled])
}
