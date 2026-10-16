// Server only. Writes the agency's typed values onto the blank lines of the agency PDFs.
import { readFile } from 'fs/promises'
import path from 'path'
import { PDFDocument, PDFFont, StandardFonts } from 'pdf-lib'
import { AGENCY_DOCUMENTS } from '@/lib/agreement'

export const NARRATEEMS_SIGNERS = 'Zareeb Chowdhury, Founder; Rehan Baig, Founder'
const NARRATEEMS_SIGNATURE = 'Zareeb Chowdhury / Rehan Baig'

export type SignedValues = {
  legalName: string
  address: string
  email: string
  signerName: string
  signerTitle: string
  date: string
}

// [page, x, line bottom from page top, right edge, text, signature font]
type Field = [number, number, number, number, string, boolean?]

// Coordinates measured from the October 2026 PDFs (US Letter); re-measure if the PDFs change.
function fields(file: string, v: SignedValues): Field[] {
  const printed = `${v.signerName}, ${v.signerTitle}`
  if (file === 'agency-baa.pdf') {
    return [
      [0, 189, 140, 370, v.legalName],
      [0, 175, 155, 374, v.address],
      [0, 190, 170, 375, v.email],
      [0, 132, 184, 361, v.date],
      [2, 114, 227, 234, v.signerName, true],
      [2, 153, 242, 238, printed],
      [2, 91, 256, 233, v.date],
      [2, 305, 227, 425, NARRATEEMS_SIGNATURE, true],
      [2, 347, 242, 432, NARRATEEMS_SIGNERS],
      [2, 281, 256, 423, v.date],
    ]
  }
  return [
    [0, 157, 140, 360, v.legalName],
    [0, 178, 155, 364, v.address],
    [0, 206, 170, 366, printed],
    [0, 229, 184, 371, v.email],
    [0, 132, 213, 348, v.date],
    [1, 114, 339, 313, v.signerName, true],
    [1, 153, 354, 316, printed],
    [1, 91, 368, 307, v.date],
    [1, 67.5, 397, 549, "X"], // "domain-based enrollment"
    [1, 143, 456, 324, NARRATEEMS_SIGNERS],
    [1, 91, 470, 307, v.date],
  ]
}

export class FieldTooLongError extends Error {}

// Shrinks to fit the printed line; below 7pt, text (not signatures) may wrap onto a second line above it.
export function layout(font: PDFFont, text: string, start: number, width: number, wrap: boolean) {
  const fits = (t: string, size: number) => font.widthOfTextAtSize(t, size) <= width
  for (let size = start; size >= 6; size -= 0.5) {
    if (fits(text, size)) return { size, lines: [text] }
    if (!wrap || size > 7) continue
    const words = text.split(' ')
    for (let i = words.length - 1; i > 0; i--) {
      const top = words.slice(0, i).join(' ')
      const rest = words.slice(i).join(' ')
      if (fits(top, size)) {
        if (fits(rest, size)) return { size, lines: [top, rest] }
        break
      }
    }
  }
  throw new FieldTooLongError(text)
}

export async function stampAgencyDocuments(v: SignedValues) {
  return Promise.all(
    AGENCY_DOCUMENTS.map(async ({ file, title }) => {
      const pdf = await PDFDocument.load(await readFile(path.join(process.cwd(), 'public', 'legal', file)))
      const text = await pdf.embedFont(StandardFonts.Helvetica)
      const signature = await pdf.embedFont(StandardFonts.TimesRomanItalic)
      for (const [page, x, bottom, right, value, isSignature] of fields(file, v)) {
        const font = isSignature ? signature : text
        const p = pdf.getPage(page)
        const { size, lines } = layout(font, value, isSignature ? 12 : 8.5, right - x, !isSignature)
        lines.forEach((line, i) => {
          p.drawText(line, { x, y: p.getHeight() - bottom + 2 + (lines.length - 1 - i) * (size + 1), font, size })
        })
      }
      return { file, title, bytes: await pdf.save() }
    })
  )
}
