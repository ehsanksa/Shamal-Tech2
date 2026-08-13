import ExcelJS from 'exceljs'

export type ExcelSheet = {
  name: string
  rows: ReadonlyArray<object>
}

function escapeCsvValue(value: unknown): string {
  const text = value == null ? '' : String(value)
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

export function jsonRowsToCsv(rows: ReadonlyArray<object>): string {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const lines = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map((row) => {
      const record = row as Record<string, unknown>
      return headers.map((header) => escapeCsvValue(record[header])).join(',')
    }),
  ]
  return lines.join('\n')
}

export async function jsonSheetsToXlsxBuffer(sheets: ExcelSheet[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook()

  for (const sheet of sheets) {
    const worksheet = workbook.addWorksheet(sheet.name.slice(0, 31))
    const headers = sheet.rows[0] ? Object.keys(sheet.rows[0]) : []
    if (headers.length === 0) continue

    worksheet.columns = headers.map((header) => ({ header, key: header }))
    for (const row of sheet.rows) {
      worksheet.addRow(row as Record<string, unknown>)
    }
  }

  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}
