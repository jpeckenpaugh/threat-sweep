const shapes = {
  virus: <><circle cx="24" cy="24" r="9"/><path d="M24 3v8M24 37v8M3 24h8M37 24h8M9 9l6 6M33 33l6 6M39 9l-6 6M15 33l-6 6"/></>,
  hacker: <><path d="M9 39h30l-3-17a12 12 0 0 0-24 0Z"/><path d="M15 24h18v11H15zM19 29h10"/></>,
  software_bug: <><ellipse cx="24" cy="25" rx="8" ry="12"/><path d="M16 18 9 13M16 25H7M16 32 9 37M32 18l7-5M32 25h9M32 32l7 5M20 15l4-5 4 5"/></>,
  rogue_ai_bot: <><rect x="9" y="13" width="30" height="25" rx="6"/><circle cx="18" cy="25" r="3"/><circle cx="30" cy="25" r="3"/><path d="M20 33h8M24 13V7"/></>,
  malware: <><path d="M12 7h17l8 8v26H12Z"/><path d="M29 7v10h8M18 25l5 5 8-10M17 38l14-18"/></>,
}

const labels = { virus: 'Virus', hacker: 'Hacker', software_bug: 'Software Bug', rogue_ai_bot: 'Rogue AI Bot', malware: 'Malware' }

export default function ThreatIcon({ category, size = 32 }) {
  const shape = shapes[category]
  if (!shape) {
    console.error(`Unknown threat category received from API: ${category}`)
    return <span className="threat-icon unknown-threat" role="img" aria-label="Unknown threat category">?</span>
  }
  return <svg className={`threat-icon ${category}`} width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-label={labels[category]} role="img">{shape}</svg>
}
