const DB_NAME = "threat-sweep-browser-edition";
const DB_VERSION = 1;
const stores = ["profile", "missionProgress", "attempts", "activeMission", "attemptEvents"];
const request = (value) => new Promise((resolve, reject) => { value.onsuccess = () => resolve(value.result); value.onerror = () => reject(value.error); });

export async function openStorage() {
  const open = indexedDB.open(DB_NAME, DB_VERSION);
  open.onupgradeneeded = () => {
    const db = open.result;
    if (!db.objectStoreNames.contains("profile")) db.createObjectStore("profile");
    if (!db.objectStoreNames.contains("missionProgress")) db.createObjectStore("missionProgress", { keyPath: "missionId" });
    if (!db.objectStoreNames.contains("attempts")) db.createObjectStore("attempts", { keyPath: "id" });
    if (!db.objectStoreNames.contains("activeMission")) db.createObjectStore("activeMission");
    if (!db.objectStoreNames.contains("attemptEvents")) db.createObjectStore("attemptEvents", { keyPath: ["attemptId", "sequence"] });
  };
  return request(open);
}
export const now = () => new Date().toISOString();
export async function transaction(db, mode, work) {
  const tx = db.transaction(stores, mode), api = {};
  for (const name of stores) api[name] = tx.objectStore(name);
  const complete = new Promise((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error || new Error("Storage transaction aborted.")); });
  const result = await work(api);
  await complete;
  return result;
}
export const read = (store, key) => request(store.get(key));
export const put = (store, value, key) => request(store.put(value, key));
export const remove = (store, key) => request(store.delete(key));
