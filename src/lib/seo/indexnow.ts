import { getServerSideURL } from '../../utilities/getURL'

/** Public IndexNow key (also served as /{key}.txt). Not a secret. */
export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY || 'e8f3c2a91b6d4f7e8a0c1d2b3e4f5a6c'

const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
] as const

export function getIndexNowKeyLocation(siteUrl = getServerSideURL()): string {
  return `${siteUrl.replace(/\/$/, '')}/${INDEXNOW_KEY}.txt`
}

export async function submitIndexNow(urls: string[]): Promise<{ submitted: number; errors: string[] }> {
  const unique = [...new Set(urls.filter((url) => url.startsWith('http')))]
  if (unique.length === 0) {
    return { submitted: 0, errors: [] }
  }

  const host = new URL(unique[0]).host
  const body = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: getIndexNowKeyLocation(`${new URL(unique[0]).origin}`),
    urlList: unique.slice(0, 10000),
  }

  const errors: string[] = []

  await Promise.all(
    INDEXNOW_ENDPOINTS.map(async (endpoint) => {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(body),
        })
        if (!response.ok && response.status !== 202) {
          errors.push(`${endpoint}: HTTP ${response.status}`)
        }
      } catch (error) {
        errors.push(`${endpoint}: ${error instanceof Error ? error.message : 'request failed'}`)
      }
    }),
  )

  return { submitted: unique.length, errors }
}
