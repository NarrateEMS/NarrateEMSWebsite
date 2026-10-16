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

/** Streams the shared mic to Azure. Resolves to a stop() that returns the final text. */
export async function startLive(
  stream: MediaStream,
  onText: (text: string) => void,
  onDrop: () => void,
): Promise<() => Promise<string>> {
  const first = await takeToken()
  const config = SpeechSDK.SpeechConfig.fromAuthorizationToken(first.token, first.region)
  config.speechRecognitionLanguage = "en-US"
  config.setProfanity(SpeechSDK.ProfanityOption.Raw)
  config.setProperty(SpeechSDK.PropertyId.Speech_SegmentationSilenceTimeoutMs, "1200")

  // A MediaStream input leaves the tracks running on close; MediaRecorder still needs them.
  const recognizer = new SpeechSDK.SpeechRecognizer(config, SpeechSDK.AudioConfig.fromStreamInput(stream))
  SpeechSDK.PhraseListGrammar.fromRecognizer(recognizer).addPhrases(EMS_PHRASES)

  let finalText = ""
  let stopped = false
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
    if (!stopped) onDrop()
  }

  await new Promise<void>((resolve, reject) =>
    recognizer.startContinuousRecognitionAsync(resolve, (err) => reject(new Error(err))),
  )
  scheduleRefresh(first.expiresInSeconds)

  return async () => {
    stopped = true
    window.clearTimeout(refreshTimer)
    await new Promise<void>((resolve) => recognizer.stopContinuousRecognitionAsync(resolve, () => resolve()))
    recognizer.close()
    return finalText.trim()
  }
}
