const request = async (path, options = {}) => {
  const response = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail?.message || 'Network link interrupted. Please try again.')
  }
  return response.json()
}

export const api = {
  bootstrap: () => request('/bootstrap'),
  saveSettings: (soundEnabled) => request('/player/settings', { method: 'PUT', body: JSON.stringify({ soundEnabled }) }),
  startMission: (missionId, restart = false) => request(`/missions/${missionId}/attempts`, { method: 'POST', body: JSON.stringify({ restart }) }),
  action: (attemptId, type, row, column) => request(`/attempts/${attemptId}/actions`, { method: 'POST', body: JSON.stringify({ type, row, column }) }),
  abandon: (attemptId) => request(`/attempts/${attemptId}/abandon`, { method: 'POST' }),
}
