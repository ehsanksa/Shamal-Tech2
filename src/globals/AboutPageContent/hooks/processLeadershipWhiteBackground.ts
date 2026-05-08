import type { GlobalBeforeChangeHook } from 'payload'

import { removeBackgroundToWhiteFromBuffer } from '@/lib/removeBg'
import { getServerSideURL } from '@/utilities/getURL'

type LeadershipMemberData = {
  name?: string
  image?: { id?: string | number } | string | number | null
  imageWhiteBg?: { id?: string | number } | string | number | null
  imageWhiteBgSourceId?: string
}

type AboutPageData = {
  leadership?: LeadershipMemberData[]
}

function getId(value: LeadershipMemberData['image']): string | null {
  if (!value) return null
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (typeof value === 'object' && value.id != null) return String(value.id)
  return null
}

function getMediaUrl(media: { url?: string | null; filename?: string }): string | null {
  const url = media.url ?? (media.filename ? `/media/${media.filename}` : null)
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const base = getServerSideURL()
  return url.startsWith('/') ? `${base}${url}` : `${base}/${url}`
}

export const processLeadershipWhiteBackgroundBeforeChange: GlobalBeforeChangeHook = async ({
  data,
  req,
}) => {
  const aboutData = data as AboutPageData
  const members = aboutData?.leadership
  const removeBgConfigured = !!process.env.REMOVE_BG_API_KEY?.trim()

  if (!members?.length || !removeBgConfigured) {
    return data
  }

  for (const member of members) {
    const sourceImageId = getId(member.image)
    if (!sourceImageId) continue
    if (member.imageWhiteBgSourceId === sourceImageId && getId(member.imageWhiteBg)) continue

    try {
      const sourceMedia = await req.payload.findByID({
        collection: 'media',
        id: sourceImageId,
        depth: 0,
        overrideAccess: true,
      })

      const sourceUrl = getMediaUrl(sourceMedia as { url?: string | null; filename?: string })
      if (!sourceUrl) continue
      const sourceBuffer = await fetchSourceImageBuffer(sourceUrl)
      if (!sourceBuffer) continue

      const processed = await removeBackgroundToWhiteFromBuffer(sourceBuffer)
      const baseName = (sourceMedia as { filename?: string }).filename || 'leadership-photo'
      const nameWithoutExtension = baseName.replace(/\.[^/.]+$/, '')

      const uploaded = await req.payload.create({
        collection: 'media',
        data: {
          alt:
            (sourceMedia as { alt?: string }).alt ||
            (member.name ? `${member.name} (white background)` : 'Leadership photo (white background)'),
        },
        file: {
          data: processed.buffer,
          mimetype: processed.mimeType,
          name: `${nameWithoutExtension || 'leadership-photo'}-white-bg.png`,
          size: processed.buffer.byteLength,
        },
        overrideAccess: true,
      })

      member.imageWhiteBg = String(uploaded.id)
      member.imageWhiteBgSourceId = sourceImageId
    } catch (error) {
      console.error('Failed to process leadership white background image:', error)
    }
  }

  return data
}

async function fetchSourceImageBuffer(sourceUrl: string): Promise<Buffer | null> {
  const candidates = new Set<string>([sourceUrl])

  // In local dev with experimental https/self-signed cert, try plain http fallback.
  if (sourceUrl.startsWith('https://localhost:')) {
    candidates.add(sourceUrl.replace('https://localhost:', 'http://localhost:'))
  }
  if (sourceUrl.startsWith('https://127.0.0.1:')) {
    candidates.add(sourceUrl.replace('https://127.0.0.1:', 'http://127.0.0.1:'))
  }

  const base = getServerSideURL()
  if (base.startsWith('https://localhost:')) {
    const httpBase = base.replace('https://localhost:', 'http://localhost:')
    if (sourceUrl.startsWith(base)) {
      candidates.add(sourceUrl.replace(base, httpBase))
    }
  }

  for (const url of candidates) {
    try {
      const response = await fetch(url)
      if (!response.ok) continue
      const arrayBuffer = await response.arrayBuffer()
      return Buffer.from(arrayBuffer)
    } catch {
      // Try next URL variant.
    }
  }

  return null
}

