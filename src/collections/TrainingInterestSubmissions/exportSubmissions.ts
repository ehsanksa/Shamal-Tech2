export type ExportFormat = 'xlsx' | 'csv'

export async function downloadTrainingInterestSubmissions(format: ExportFormat): Promise<void> {
  const apiBase = typeof window !== 'undefined' ? window.location.origin : ''
  const response = await fetch(
    `${apiBase}/api/training-interest-submissions/export?format=${format}`,
    {
      method: 'GET',
      credentials: 'include',
    },
  )

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.message || data?.error || 'Failed to export form data')
  }

  const blob = await response.blob()
  const contentDisposition = response.headers.get('content-disposition')
  const date = new Date().toISOString().slice(0, 10)
  const fallbackName =
    format === 'csv'
      ? `training-interest-form-${date}.csv`
      : `training-interest-form-${date}.xlsx`
  const fileName = contentDisposition?.match(/filename="(.+)"/)?.[1] || fallbackName

  const downloadUrl = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = downloadUrl
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.URL.revokeObjectURL(downloadUrl)
}
