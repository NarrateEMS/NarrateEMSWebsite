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
      [0, 189, 140, 549, v.legalName],
      [0, 175, 155, 549, v.address],
      [0, 190, 170, 549, v.email],
      [0, 132, 184, 549, v.date],
      [2, 114, 227, 255, v.signerName, true],
      [2, 153, 242, 255, printed],
      [2, 91, 256, 255, v.date],
      [2, 305, 227, 549, NARRATEEMS_SIGNATURE, true],
      [2, 347, 242, 549, NARRATEEMS_SIGNERS],
      [2, 281, 256, 549, v.date],
    ]
  }
  return [
    [0, 157, 140, 549, v.legalName],
    [0, 178, 155, 549, v.address],
    [0, 206, 170, 549, printed],
    [0, 229, 184, 549, v.email],
    [0, 132, 213, 549, v.date],
    [1, 114, 339, 549, v.signerName, true],
    [1, 153, 354, 549, printed],
    [1, 91, 368, 549, v.date],
    [1, 67.5, 397, 549, "X"], // "domain-based enrollment"
    [1, 143, 456, 549, NARRATEEMS_SIGNERS],
    [1, 91, 470, 549, v.date],
  ]
}

export class FieldTooLongError extends Error {}

function fit(font: PDFFont, text: string, start: number, width: number) {
  let size = start
  while (font.widthOfTextAtSize(text, size) > width) {
    size -= 0.5
    if (size < 6) throw new FieldTooLongError(text)
  }
  return size
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
        p.drawText(value, { x, y: p.getHeight() - bottom + 2, font, size: fit(font, value, isSignature ? 12 : 8.5, right - x) })
      }
      return { file, title, bytes: await pdf.save() }
    })
  )
}
