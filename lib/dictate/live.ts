// Loaded with import() after sign-in, so the Speech SDK stays out of the first-load
// bundle but is ready before Record is tapped.
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk"
import { EMS_PHRASES } from "./ems-phrases"
import { getSpeechToken } from "./api"

type SpeechToken = Awaited<ReturnType<typeof getSpeechToken>>
let warm: { token: Promise<SpeechToken | null>; at: number } | null = null

/** Fetches a speech token ahead of Record so the first words are not lost. */
export function warmUp() {
  warm = { token: getSpeechToken().catch(() => null), at: Date.now() }
}

async function takeToken(): Promise<SpeechToken> {
  const w = warm
  warm = null
  const t = w && (await w.token)
  return t && Date.now() - w.at < (t.expiresInSeconds - 60) * 1000 ? t : getSpeechToken()
}

/** Float32 mic samples at `rate` to 16 kHz 16-bit mono PCM, the push stream's default format. */
export function toPcm16k(input: Float32Array, rate: number): ArrayBuffer {
  const ratio = rate / 16000
  const out = new Int16Array(Math.floor(input.length / ratio))
  for (let i = 0; i < out.length; i++) {
    const start = Math.floor(i * ratio)
    const end = Math.min(input.length, Math.max(start + 1, Math.floor((i + 1) * ratio)))
    let sum = 0
    for (let j = start; j < end; j++) sum += input[j]
    const v = Math.max(-1, Math.min(1, sum / (end - start)))
    out[i] = v < 0 ? v * 0x8000 : v * 0x7fff
  }
  return out.buffer
}

// Buffers mic audio from the tap; Azure reads the backlog once connected, so opening words survive.
// shortcut: ScriptProcessorNode runs on the main thread, move to AudioWorklet if audio glitches show up.
function capture(stream: MediaStream) {
  const push = SpeechSDK.AudioInputStream.createPushStream()
  const ctx = new AudioContext()
  const node = ctx.createScriptProcessor(4096, 1, 1)
  node.onaudioprocess = (e) => push.write(toPcm16k(e.inputBuffer.getChannelData(0), ctx.sampleRate))
  ctx.createMediaStreamSource(stream).connect(node)
  node.connect(ctx.destination)
  ctx.resume().catch(() => undefined)
  let open = true
  const close = () => {
    if (!open) return
    open = false
    node.disconnect()
    ctx.close().catch(() => undefined)
    push.close()
  }
  return { push, close }
}

/** Streams the shared mic to Azure. Resolves to a stop() that returns the final text. */
export async function startLive(
  stream: MediaStream,
  onText: (text: string) => void,
  onDrop: () => void,
): Promise<() => Promise<string>> {
  const mic = capture(stream)
  try {
    return await connect(mic, onText, onDrop)
  } catch (e) {
    mic.close()
    throw e
  }
}

async function connect(
  mic: ReturnType<typeof capture>,
  onText: (text: string) => void,
  onDrop: () => void,
): Promise<() => Promise<string>> {
  const first = await takeToken()
  const config = SpeechSDK.SpeechConfig.fromAuthorizationToken(first.token, first.region)
  config.speechRecognitionLanguage = "en-US"
  config.setProfanity(SpeechSDK.ProfanityOption.Raw)
  config.setProperty(SpeechSDK.PropertyId.Speech_SegmentationSilenceTimeoutMs, "1200")

  const recognizer = new SpeechSDK.SpeechRecognizer(config, SpeechSDK.AudioConfig.fromStreamInput(mic.push))
  SpeechSDK.PhraseListGrammar.fromRecognizer(recognizer).addPhrases(EMS_PHRASES)

  let finalText = ""
  let stopped = false
  let ended = false
  let refreshTimer: number | undefined

  const scheduleRefresh = (ttl: number) => {
    refreshTimer = window.setTimeout(async () => {
      try {
        const next = await getSpeechToken()
        recognizer.authorizationToken = next.token
        scheduleRefresh(next.expiresInSeconds)
      } catch {
        // Token lapses; Azure cancels and onDrop sends the audio to /transcribe.
      }
    }, Math.max(60, ttl - 60) * 1000)
  }

  recognizer.recognizing = (_s, e) => onText(finalText + e.result.text)
  recognizer.recognized = (_s, e) => {
    if (e.result.reason !== SpeechSDK.ResultReason.RecognizedSpeech || !e.result.text) return
    finalText += e.result.text + " "
    onText(finalText)
  }
  recognizer.canceled = () => {
    ended = true
    mic.close()
    if (!stopped) onDrop()
  }

  await new Promise<void>((resolve, reject) =>
    recognizer.startContinuousRecognitionAsync(resolve, (err) => reject(new Error(err))),
  )
  scheduleRefresh(first.expiresInSeconds)

  return async () => {
    stopped = true
    window.clearTimeout(refreshTimer)
    // Ending the push stream lets Azure finish the buffered backlog before we stop.
    const drained = new Promise<void>((resolve) => {
      recognizer.sessionStopped = () => resolve()
      window.setTimeout(resolve, 5000)
    })
    mic.close()
    if (!ended) await drained
    await new Promise<void>((resolve) => recognizer.stopContinuousRecognitionAsync(resolve, () => resolve()))
    recognizer.close()
    return finalText.trim()
  }
}
