const REMOVE_BG_ENDPOINT = 'https://api.remove.bg/v1.0/removebg'

function getApiKey(): string {
  const apiKey = process.env.REMOVE_BG_API_KEY?.trim()
  if (!apiKey) {
    throw new Error('REMOVE_BG_API_KEY is not configured')
  }
  return apiKey
}

async function callRemoveBg(formData: FormData): Promise<{ buffer: Buffer; mimeType: string }> {
  const response = await fetch(REMOVE_BG_ENDPOINT, {
    method: 'POST',
    headers: {
      'X-Api-Key': getApiKey(),
    },
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`remove.bg request failed (${response.status}): ${errorText}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const mimeType = response.headers.get('content-type') || 'image/png'

  return {
    buffer: Buffer.from(arrayBuffer),
    mimeType,
  }
}

export async function removeBackgroundToWhiteFromBuffer(
  inputBuffer: Buffer,
): Promise<{ buffer: Buffer; mimeType: string }> {
  const formData = new FormData()
  formData.append('image_file_b64', inputBuffer.toString('base64'))
  formData.append('bg_color', 'white')
  formData.append('format', 'png')
  formData.append('size', 'auto')
  return callRemoveBg(formData)
}

export async function removeBackgroundToWhiteFromUrl(
  imageUrl: string,
): Promise<{ buffer: Buffer; mimeType: string }> {
  const formData = new FormData()
  formData.append('image_url', imageUrl)
  formData.append('bg_color', 'white')
  formData.append('format', 'png')
  formData.append('size', 'auto')
  return callRemoveBg(formData)
}
