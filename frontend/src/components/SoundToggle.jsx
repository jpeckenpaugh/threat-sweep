export default function SoundToggle({ enabled, onChange, compact = false }) {
  return <button className={`sound-toggle ${compact ? 'compact' : ''}`} onClick={() => onChange(!enabled)} aria-pressed={enabled} aria-label={`Sound ${enabled ? 'on' : 'off'}`}>
    <span aria-hidden="true">{enabled ? '◖))' : '◖×'}</span><span>{enabled ? 'SOUND ON' : 'SOUND OFF'}</span>
  </button>
}
