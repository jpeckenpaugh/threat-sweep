// Small original synthesized cues; audio failure never changes gameplay feedback.
const tones = {
  scan: [610, 0.07, "sine"], mark: [310, 0.08, "triangle"], clear: [780, 0.09, "sine"],
  warning: [170, 0.18, "sawtooth"], success: [880, 0.16, "sine"], failure: [120, 0.25, "sawtooth"],
}

export function playEvents(events, enabled) {
  if (!enabled || !Array.isArray(events)) return
  for (const event of events) {
    const tone = tones[event]
    if (!tone) continue
    try {
      const Context = window.AudioContext || window.webkitAudioContext
      const context = new Context(), oscillator = context.createOscillator(), gain = context.createGain()
      oscillator.type = tone[2]; oscillator.frequency.setValueAtTime(tone[0], context.currentTime)
      gain.gain.setValueAtTime(0.07, context.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + tone[1])
      oscillator.connect(gain).connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + tone[1])
      oscillator.addEventListener("ended", () => context.close())
    } catch { /* visual feedback remains available when audio is unavailable */ }
  }
}
