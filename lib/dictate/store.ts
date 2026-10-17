// On-device queue of unsaved recordings. Audio and draft text never leave the
// phone except in the /transcribe and /narrations calls.
const DB_NAME = "narrateems-dictate"
export const LOCAL_TTL_MS = 24 * 60 * 60 * 1000

export type LocalRecording = {
  clientId: string
  userId: string
  recordedAt: string
  mime: string
  durationMs: number | null
  status: "recording" | "waiting" | "review"
  source: "live" | "offline"
  text: string
  label: string
}

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      req.result.createObjectStore("recordings", { keyPath: "clientId" })
      req.result.createObjectStore("chunks", { autoIncrement: true }).createIndex("clientId", "clientId")
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function run<T>(stores: string[], mode: IDBTransactionMode, fn: (tx: IDBTransaction) => IDBRequest<T> | void): Promise<T> {
  const db = await open()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(stores, mode)
    const req = fn(tx)
    tx.oncomplete = () => {
      db.close()
      resolve(req ? req.result : (undefined as T))
    }
    tx.onerror = tx.onabort = () => {
      db.close()
      reject(tx.error)
    }
  })
}

export const putRecording = (r: LocalRecording) =>
  run<void>(["recordings"], "readwrite", (tx) => void tx.objectStore("recordings").put(r))

let chunkWrites = Promise.resolve()

// Stored as ArrayBuffer (Safari private tabs can't put Blobs in IndexedDB) and written in order.
export const addChunk = (clientId: string, blob: Blob) =>
  (chunkWrites = chunkWrites
    .catch(() => undefined)
    .then(async () => {
      const data = await blob.arrayBuffer()
      await run<void>(["chunks"], "readwrite", (tx) => void tx.objectStore("chunks").add({ clientId, data }))
    }))

export const listRecordings = () =>
  run<LocalRecording[]>(["recordings"], "readonly", (tx) => tx.objectStore("recordings").getAll())

export async function getAudio(r: LocalRecording): Promise<Blob> {
  const chunks = await run<{ data: ArrayBuffer }[]>(["chunks"], "readonly", (tx) =>
    tx.objectStore("chunks").index("clientId").getAll(r.clientId),
  )
  return new Blob(chunks.map((c) => c.data), { type: r.mime })
}

export const deleteRecording = (clientId: string) =>
  run<void>(["recordings", "chunks"], "readwrite", (tx) => {
    tx.objectStore("recordings").delete(clientId)
    const cursor = tx.objectStore("chunks").index("clientId").openKeyCursor(IDBKeyRange.only(clientId))
    cursor.onsuccess = () => {
      if (!cursor.result) return
      tx.objectStore("chunks").delete(cursor.result.primaryKey)
      cursor.result.continue()
    }
  })

/** Every sign-out path calls this so a shared phone keeps no narration data. */
export function clearDictateData(): Promise<void> {
  if (typeof indexedDB === "undefined") return Promise.resolve()
  return new Promise((resolve) => {
    const req = indexedDB.deleteDatabase(DB_NAME)
    req.onsuccess = req.onerror = req.onblocked = () => resolve()
  })
}
