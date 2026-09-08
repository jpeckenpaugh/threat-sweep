export const THREATS = Object.freeze(["virus", "hacker", "software_bug", "rogue_ai_bot", "malware"]);

export const MISSIONS = Object.freeze([
  { id: 1, order: 1, slug: "signal-breach", title: "Signal Breach", briefing: "Trace viral activity in the exposed relay.", rows: 6, columns: 6, threats: { virus: 3, software_bug: 3 }, targetScore: 260 },
  { id: 2, order: 2, slug: "ghost-terminal", title: "Ghost Terminal", briefing: "A hostile terminal is probing the subnet.", rows: 7, columns: 7, threats: { virus: 3, hacker: 3, software_bug: 3 }, targetScore: 350 },
  { id: 3, order: 3, slug: "botnet-drift", title: "Botnet Drift", briefing: "Contain drifting autonomous nodes.", rows: 7, columns: 8, threats: { virus: 3, hacker: 3, rogue_ai_bot: 3 }, targetScore: 400 },
  { id: 4, order: 4, slug: "malware-cascade", title: "Malware Cascade", briefing: "Stop a cascading infection before it spreads.", rows: 8, columns: 8, threats: { virus: 3, rogue_ai_bot: 3, malware: 3 }, targetScore: 470 },
  { id: 5, order: 5, slug: "blackout-protocol", title: "Blackout Protocol", briefing: "Sweep the dark core against every known threat.", rows: 8, columns: 9, threats: { virus: 3, hacker: 3, software_bug: 3, rogue_ai_bot: 3, malware: 3 }, targetScore: 560 },
]);

export const missionById = (id) => MISSIONS.find((mission) => mission.id === Number(id));
