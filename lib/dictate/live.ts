// Loaded with import() only when Record is tapped, so /dictate does not ship the
// Speech SDK up front.
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk"
import { EMS_PHRASES } from "./ems-phrases"
import { getSpeechToken } from "./api"

/** Streams the shared mic to Azure. Resolves to a stop() that returns the final text. */
export async function startLive(
  stream: MediaStream,
  onText: (text: string) => void,
  onDrop: () => void,
): Promise<() => Promise<string>> {
  const first = await getSpeechToken()
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
