"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, Loader2, Mic, RefreshCw, Square, WifiOff } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { AppNav, btn, dangerBtn, field, navLink, outlineBtn } from "@/components/app-ui"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  ApiError,
  deleteNarration,
  listNarrations,
  saveNarration,
  transcribe,
  type NarrationMeta,
} from "@/lib/dictate/api"
import {
  LOCAL_TTL_MS,
  addChunk,
  clearDictateData,
  deleteRecording,
  getAudio,
  listRecordings,
  putRecording,
  type LocalRecording,
} from "@/lib/dictate/store"

const LOGIN_URL = "/login?next=/dictate"
const LAST_USER_KEY = "narrateems-dictate-user"
const MIME_TYPES = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus"]

const when = (iso: string) =>
  new Date(iso).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })

function Confirm({ label, title, onConfirm }: { label: string; title: string; onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className={dangerBtn}>
        {label}
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-ui border-rule bg-paper text-ink">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-[15px] text-ink-muted">This cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={outlineBtn}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="min-h-11 rounded-full bg-danger px-6 text-[17px] font-semibold text-paper hover:bg-danger/90 focus-hi-vis"
          >
            {label}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function DictatePage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [online, setOnline] = useState(true)
  const [noPlan, setNoPlan] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recording, setRecording] = useState<LocalRecording | null>(null)
  const [liveText, setLiveText] = useState("")
  const [liveReady, setLiveReady] = useState(false)
  const [dropped, setDropped] = useState(false)
  const [starting, setStarting] = useState(false)
  const [local, setLocal] = useState<LocalRecording[]>([])
  const [saved, setSaved] = useState<NarrationMeta[] | null>(null)
  const [busy, setBusy] = useState<Record<string, string>>({})

  const userIdRef = useRef<string | null>(null)
  const recordingRef = useRef<LocalRecording | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const stopLiveRef = useRef<(() => Promise<string | null>) | null>(null)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)
  const writesRef = useRef<Promise<void>[]>([])
  const startedAtRef = useRef(0)
  const droppedRef = useRef(false)
  const transcribingRef = useRef(new Set<string>())

  const setItemBusy = (id: string, state: string | null) =>
    setBusy((b) => {
      const next = { ...b }
      if (state) next[id] = state
      else delete next[id]
      return next
    })

  const handleError = useCallback(
    (e: unknown) => {
      if (e instanceof ApiError && e.status === 401 && navigator.onLine) router.replace(LOGIN_URL)
      else if (e instanceof ApiError && e.status === 403) setNoPlan(true)
      else if (e instanceof ApiError) setError(e.message)
      else setError("No signal. Your recording is safe on this phone. Try again when you're back online.")
    },
    [router],
  )

  const refreshLocal = useCallback(async () => {
    const keep: LocalRecording[] = []
    for (const r of await listRecordings()) {
      if (Date.now() - Date.parse(r.recordedAt) > LOCAL_TTL_MS) {
        await deleteRecording(r.clientId)
        continue
      }
      // Left over from a reload or crash mid-recording: the audio is all we can trust.
      if (r.status === "recording" && r.clientId !== recordingRef.current?.clientId) {
        Object.assign(r, { status: "waiting", source: "offline", text: "" })
        await putRecording(r)
      }
      if (r.userId === userIdRef.current && r.status !== "recording") keep.push(r)
    }
    setLocal(keep.sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)))
  }, [])

  const refreshSaved = useCallback(async () => {
    try {
      setSaved((await listNarrations()).narrations)
    } catch (e) {
      handleError(e)
    }
  }, [handleError])

  const processWaiting = useCallback(async () => {
    for (const r of await listRecordings()) {
      if (r.status !== "waiting" || r.userId !== userIdRef.current || transcribingRef.current.has(r.clientId)) continue
      transcribingRef.current.add(r.clientId)
      setItemBusy(r.clientId, "Transcribing…")
      try {
        const result = await transcribe(await getAudio(r))
        // Discarded or signed out while transcribing: don't bring the text back.
        if (!(await listRecordings()).some((x) => x.clientId === r.clientId)) continue
        await putRecording({ ...r, status: "review", text: result.text, durationMs: r.durationMs ?? result.durationMs })
      } catch (e) {
        handleError(e)
        break
      } finally {
        transcribingRef.current.delete(r.clientId)
        setItemBusy(r.clientId, null)
        await refreshLocal()
      }
    }
  }, [handleError, refreshLocal])

  useEffect(() => {
    navigator.serviceWorker?.register("/dictate-sw.js", { scope: "/dictate" }).catch(() => undefined)
    setOnline(navigator.onLine)

    supabase.auth.getSession().then(({ data }) => {
      // Offline, an expired token cannot refresh; keep working as the last signed-in user.
      const id = data.session?.user.id ?? (navigator.onLine ? null : localStorage.getItem(LAST_USER_KEY))
      if (!id) return router.replace(LOGIN_URL)
      localStorage.setItem(LAST_USER_KEY, id)
      userIdRef.current = id
      setUserId(id)
    })

    const { data: auth } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") clearDictateData().then(() => router.replace(LOGIN_URL))
    })
    const goOnline = () => setOnline(true)
    const goOffline = () => {
      setOnline(false)
      if (recordingRef.current) {
        droppedRef.current = true
        setDropped(true)
      }
    }
    window.addEventListener("online", goOnline)
    window.addEventListener("offline", goOffline)
    return () => {
      auth.subscription.unsubscribe()
      window.removeEventListener("online", goOnline)
      window.removeEventListener("offline", goOffline)
    }
  }, [router])

  useEffect(() => {
    if (!userId) return
    refreshLocal().then(() => {
      if (!navigator.onLine) return
      refreshSaved()
      processWaiting()
    })
    const expiry = window.setInterval(refreshLocal, 60_000)
    return () => window.clearInterval(expiry)
  }, [userId, refreshLocal, refreshSaved, processWaiting])

  useEffect(() => {
    if (!online || !userId) return
    refreshSaved()
    processWaiting()
    import("@/lib/dictate/live").then((m) => m.warmUp()).catch(() => undefined)
  }, [online, userId, refreshSaved, processWaiting])

  const stopRecording = async () => {
    const recorder = recorderRef.current
    const rec = recordingRef.current
    if (!recorder || !rec) return
    recorderRef.current = null
    if (recorder.state !== "inactive") {
      await new Promise((resolve) => {
        recorder.onstop = resolve
        recorder.stop()
      })
    }
    await Promise.all(writesRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    wakeLockRef.current?.release().catch(() => undefined)

    const stopLive = stopLiveRef.current
    stopLiveRef.current = null
    const text = stopLive ? await stopLive().catch(() => null) : null
    const live = !droppedRef.current && text !== null
    await putRecording({
      ...rec,
      durationMs: Date.now() - startedAtRef.current,
      status: live ? "review" : "waiting",
      source: live ? "live" : "offline",
      text: live ? text : "",
    })
    recordingRef.current = null
    setRecording(null)
    await refreshLocal()
    if (!live && navigator.onLine) processWaiting()
  }

  const startRecording = async () => {
    if (!userId) return
    setError(null)
    if (typeof MediaRecorder === "undefined") {
      setError("This browser can't record audio. Update iOS/Chrome or try another browser.")
      return
    }
    setStarting(true)
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (e) {
      setStarting(false)
      setError(
        e instanceof DOMException && e.name === "NotAllowedError"
          ? "Microphone access denied. Allow the microphone for this site in your browser settings."
          : "Could not start the microphone.",
      )
      return
    }

    const mime = MIME_TYPES.find((t) => MediaRecorder.isTypeSupported(t))
    const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined)
    const rec: LocalRecording = {
      clientId: crypto.randomUUID(),
      userId,
      recordedAt: new Date().toISOString(),
      mime: recorder.mimeType || mime || "audio/webm",
      durationMs: null,
      status: "recording",
      source: navigator.onLine ? "live" : "offline",
      text: "",
      label: "",
    }

    // Start capture before any other awaits so nothing said after the tap is lost.
    writesRef.current = []
    recorder.ondataavailable = (e) => {
      if (e.data.size) writesRef.current.push(addChunk(rec.clientId, e.data))
    }
    // iPhone ends the mic when the screen locks or the app is switched; keep what we have.
    stream.getAudioTracks()[0].onended = () => stopRecording()
    recorder.start(1000)
    droppedRef.current = rec.source === "offline"
    const markDropped = () => {
      droppedRef.current = true
      setDropped(true)
    }
    const live = droppedRef.current ? null : import("@/lib/dictate/live").then((m) => m.startLive(stream, setLiveText, markDropped))
    live?.catch(() => undefined)

    recorderRef.current = recorder
    streamRef.current = stream
    recordingRef.current = rec
    startedAtRef.current = Date.now()
    setDropped(droppedRef.current)
    setLiveText("")
    setLiveReady(false)
    setRecording(rec)
    setStarting(false)
    // Already recording; stopRecording writes the record again if this fails.
    await putRecording(rec).catch(() => undefined)
    wakeLockRef.current = (await navigator.wakeLock?.request("screen").catch(() => null)) ?? null

    if (!live) return
    try {
      const stopLive = await live
      if (recordingRef.current?.clientId === rec.clientId) {
        stopLiveRef.current = stopLive
        setLiveReady(true)
      } else stopLive().catch(() => undefined)
    } catch (e) {
      markDropped()
      if (e instanceof ApiError && e.status === 403) setNoPlan(true)
    }
  }

  const updateDraft = (r: LocalRecording, patch: Partial<LocalRecording>) => {
    const next = { ...r, ...patch }
    setLocal((items) => items.map((i) => (i.clientId === r.clientId ? next : i)))
    putRecording(next).catch(() => undefined)
  }

  const save = async (r: LocalRecording) => {
    setError(null)
    setItemBusy(r.clientId, "Saving…")
    try {
      await saveNarration({
        clientId: r.clientId,
        text: r.text.trim(),
        label: r.label.trim() || undefined,
        recordedAt: r.recordedAt,
        durationMs: r.durationMs ?? undefined,
        source: r.source,
      })
      await deleteRecording(r.clientId)
      await refreshLocal()
      await refreshSaved()
    } catch (e) {
      handleError(e)
    } finally {
      setItemBusy(r.clientId, null)
    }
  }

  const discard = async (r: LocalRecording) => {
    await deleteRecording(r.clientId)
    await refreshLocal()
  }

  const removeSaved = async (id: string) => {
    setError(null)
    try {
      await deleteNarration(id)
      await refreshSaved()
    } catch (e) {
      handleError(e)
    }
  }

  const signOut = async () => {
    await clearDictateData()
    await supabase.auth.signOut()
    router.replace(LOGIN_URL)
  }

  if (!userId) {
    return (
      <div className="min-h-dvh bg-paper flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <AppNav>
        <button onClick={signOut} disabled={!!recording} className={`${navLink} disabled:opacity-40`}>
          Sign out
        </button>
      </AppNav>
      {recording && (
        <div role="status" className="sticky top-16 z-30 bg-recording text-paper text-center py-2.5 text-[17px] font-semibold">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-paper mr-2 animate-pulse" />{/* taste-skill-ignore: live recording indicator */}
          Recording
        </div>
      )}

      <main className="mx-auto max-w-xl px-4 py-8 space-y-8">
        {noPlan ? (
          <div className="bg-surface rounded-card p-6">
            <h1 className="text-2xl font-semibold mb-2">No active plan</h1>
            <p className="text-[17px] text-ink-muted mb-5">This account doesn't have an active NarrateEMS plan.</p>
            <Link href="/account" className={btn}>
              Go to your account
            </Link>
          </div>
        ) : (
          <>
            {!online && (
              <div className="flex items-start gap-3 bg-paper-tint rounded-card p-4 text-[15px]">
                <WifiOff className="h-4 w-4 mt-0.5 shrink-0" />
                No signal. You can still record; it is kept on this phone and transcribed when you're back
                online.
              </div>
            )}
            {error && (
              <div role="alert" className="flex items-start gap-3 bg-danger/10 rounded-card p-4 text-[15px]">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-danger" />
                {error}
              </div>
            )}

            <section className="text-center space-y-4">
              <button
                onClick={recording ? stopRecording : startRecording}
                disabled={starting}
                className={`w-full inline-flex flex-col items-center justify-center min-h-20 py-5 text-xl font-semibold rounded-full transition-colors focus-hi-vis active:translate-y-px ${
                  recording
                    ? "bg-recording text-paper"
                    : starting
                      ? "bg-ink text-paper opacity-70"
                      : "bg-hi-vis text-hi-vis-ink hover:bg-hi-vis-deep"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  {recording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  {recording ? "Recording, speak now" : starting ? "Starting…" : "Record"}
                </span>
                {recording && <span className="text-[15px] font-normal opacity-90">Tap to stop</span>}
              </button>
              <p className="text-[15px] text-ink-muted">
                Keep this screen open. On iPhone, locking the phone or switching apps stops the recording.
              </p>
              {recording && (
                <div className="text-left text-[17px] bg-surface rounded-card p-5 min-h-24 whitespace-pre-wrap">
                  {dropped ? (
                    <span className="text-ink-muted">
                      Live words unavailable. Still recording; the audio will be transcribed when you stop.
                    </span>
                  ) : (
                    liveText || <span className="text-ink-soft">{liveReady ? "Listening…" : "Recording. Live words will catch up in a moment…"}</span>
                  )}
                </div>
              )}
            </section>

            {local.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-xl font-semibold">On this phone</h2>
                {local.map((r) => (
                  <div key={r.clientId} className="bg-surface rounded-card p-5 space-y-4">
                    <div className="flex items-center justify-between gap-3 text-[15px]">
                      <span className="font-semibold">
                        {busy[r.clientId] ??
                          (r.status === "review" ? "Ready to review" : online ? "Waiting to transcribe" : "Waiting for signal")}
                      </span>
                      <span className="text-ink-soft">{when(r.recordedAt)}</span>
                    </div>
                    {r.status === "review" && (
                      <>
                        <textarea
                          value={r.text}
                          onChange={(e) => updateDraft(r, { text: e.target.value })}
                          maxLength={50000}
                          rows={6}
                          aria-label="Narration"
                          placeholder="No speech was detected. Type the narration here."
                          className={field}
                        />
                        <input
                          value={r.label}
                          onChange={(e) => updateDraft(r, { label: e.target.value })}
                          maxLength={80}
                          aria-label="Label"
                          placeholder="Label (optional, no patient names)"
                          className={field}
                        />
                      </>
                    )}
                    <div className="flex items-center justify-between gap-3">
                      <Confirm label="Discard" title="Discard this recording?" onConfirm={() => discard(r)} />
                      {r.status === "review" && (
                        <button
                          onClick={() => save(r)}
                          disabled={!r.text.trim() || !!busy[r.clientId] || !online}
                          className={btn}
                        >
                          Save
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </section>
            )}

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Saved for 24 hours</h2>
                <button
                  onClick={refreshSaved}
                  aria-label="Refresh"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-muted hover:bg-paper-tint hover:text-ink focus-hi-vis"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
              {saved?.length === 0 && <p className="text-[15px] text-ink-muted">Nothing saved yet.</p>}
              {saved?.map((n) => (
                <div key={n.id} className="bg-surface rounded-card p-5 space-y-2">
                  <div className="flex items-center justify-between text-[15px]">
                    <span className="font-semibold truncate">{n.label || "Narration"}</span>
                    <span className="text-ink-soft shrink-0 ml-3">{when(n.recordedAt)}</span>
                  </div>
                  <p className="text-[15px] text-ink-muted line-clamp-2">{n.preview}</p>
                  <div className="flex items-center justify-between text-[13px] text-ink-soft">
                    <span>{n.chars} characters</span>
                    <Confirm label="Delete" title="Delete this narration?" onConfirm={() => removeSaved(n.id)} />
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
