// Short synthesized UI clips keep the bundle lightweight while remaining original.
const tones = {
  scan: [610, 0.07, 'sine'], mark: [310, 0.08, 'triangle'], clear: [780, 0.09, 'sine'],
  warning: [170, 0.18, 'sawtooth'], success: [880, 0.16, 'sine'], failure: [120, 0.25, 'sawtooth'],
}

export function playTone(event) {
  const setting = tones[event]
  if (!setting) return
  try {
    const Context = window.AudioContext || window.webkitAudioContext
    const context = new Context()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = setting[2]
    oscillator.frequency.setValueAtTime(setting[0], context.currentTime)
    gain.gain.setValueAtTime(0.07, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + setting[1])
    oscillator.connect(gain).connect(context.destination)
    oscillator.start(); oscillator.stop(context.currentTime + setting[1])
    oscillator.addEventListener('ended', () => context.close())
  } catch { /* Browser audio can be unavailable; visual feedback remains complete. */ }
}
