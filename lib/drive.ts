// Server only. Uploads files to the NarrateEMS Google Drive folder (OAuth refresh token, drive.file scope).
import { randomUUID } from 'crypto'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink'

export async function uploadPdfsToDrive(files: { name: string; bytes: Uint8Array }[]) {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GOOGLE_DRIVE_FOLDER_ID } = process.env
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN || !GOOGLE_DRIVE_FOLDER_ID) {
    throw new Error('Google Drive is not configured')
  }
  const tokenRes = await fetch(TOKEN_URL, {
    method: 'POST',
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  })
  if (!tokenRes.ok) throw new Error(`drive_token_${tokenRes.status}`)
  const { access_token } = await tokenRes.json()

  return Promise.all(
    files.map(async ({ name, bytes }) => {
      const boundary = `narrateems-${randomUUID()}`
      const meta = JSON.stringify({ name, parents: [GOOGLE_DRIVE_FOLDER_ID], mimeType: 'application/pdf' })
      const body = Buffer.concat([
        Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n--${boundary}\r\nContent-Type: application/pdf\r\n\r\n`),
        Buffer.from(bytes),
        Buffer.from(`\r\n--${boundary}--`),
      ])
      const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': `multipart/related; boundary=${boundary}` },
        body,
      })
      if (!res.ok) throw new Error(`drive_upload_${res.status}`)
      return (await res.json()) as { id: string; webViewLink: string }
    })
  )
}
