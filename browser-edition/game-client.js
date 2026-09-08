// Presentation-facing RPC client. The Worker, not this module, owns game rules.
export class GameClient {
  #worker
  #requests = new Map()
  #sequence = 0

  constructor() {
    this.#worker = new Worker("./game-worker.js", { type: "module" })
    this.#worker.addEventListener("message", ({ data }) => {
      const pending = this.#requests.get(data?.id)
      if (!pending) return
      this.#requests.delete(data.id)
      if (data.ok) pending.resolve(data.data)
      else pending.reject(Object.assign(new Error(data?.error?.message || "Local authority failed."), { code: data?.error?.code }))
    })
    this.#worker.addEventListener("error", (event) => {
      for (const pending of this.#requests.values()) pending.reject(new Error(event.message || "Game authority stopped."))
      this.#requests.clear()
    })
  }

  request(command, payload = {}) {
    const id = `ui-${Date.now()}-${++this.#sequence}`
    return new Promise((resolve, reject) => {
      this.#requests.set(id, { resolve, reject })
      this.#worker.postMessage({ id, command, payload })
    })
  }

  bootstrap() { return this.request("bootstrap") }
  setSoundEnabled(soundEnabled) { return this.request("setSoundEnabled", { soundEnabled }) }
  startAttempt(missionId, restart = false) { return this.request("startAttempt", { missionId, restart }) }
  getAttempt(attemptId) { return this.request("getAttempt", { attemptId }) }
  act(attemptId, type, row, column) { return this.request("act", { attemptId, type, row, column }) }
  abandonAttempt(attemptId) { return this.request("abandonAttempt", { attemptId }) }
}
