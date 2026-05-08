import { getPayload } from 'payload'
import configPromise from '../payload.config'
import type { Payload } from 'payload'
import { unstable_cache } from 'next/cache'

type SafeFindResult<T> = {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page?: number
  hasNextPage?: boolean
  hasPrevPage?: boolean
  nextPage?: number | null
  prevPage?: number | null
}

function emptyFindResult<T>(limit?: number): SafeFindResult<T> {
  return {
    docs: [],
    totalDocs: 0,
    limit: limit ?? 0,
    totalPages: 0,
    page: 1,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
  }
}

function isMongoConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const message = error.message || ''
  return (
    message.includes('cannot connect to MongoDB') ||
    message.includes('MongoNetworkError') ||
    message.includes('querySrv ETIMEOUT') ||
    message.includes('ETIMEOUT') ||
    message.includes('ENOTFOUND') ||
    message.includes('ECONNREFUSED')
  )
}

/**
 * Get a Payload instance with proper error handling for MongoDB session expiration
 * This ensures each server component gets a fresh Payload instance per request
 */
export async function getPayloadInstance(): Promise<Payload> {
  try {
    return await getPayload({ config: configPromise })
  } catch (error) {
    // If session expired, log and rethrow
    if (error instanceof Error && error.message?.includes('session')) {
      console.error('MongoDB session error:', error.message)
      // Retry once with a fresh instance
      return await getPayload({ config: configPromise })
    }
    throw error
  }
}

/**
 * Safe payload.find() wrapper that handles session expiration and ensures
 * proper access control for public pages
 */
export async function safePayloadFind<T = any>(options: {
  collection: string
  limit?: number
  where?: any
  sort?: string
  depth?: number
  draft?: boolean
  overrideAccess?: boolean
  select?: Record<string, boolean>
}): Promise<SafeFindResult<T>> {
  let payload: Payload
  try {
    payload = await getPayloadInstance()
  } catch (error) {
    if (isMongoConnectionError(error)) {
      console.warn('[safePayloadFind] MongoDB unavailable while creating Payload instance. Returning empty result.')
      return emptyFindResult<T>(options.limit)
    }
    throw error
  }
  
  // Ensure public queries always use these settings
  const safeOptions = {
    ...options,
    draft: options.draft ?? false, // Never fetch drafts on public pages
    overrideAccess: options.overrideAccess ?? false, // Respect access control
  }

  try {
    return await payload.find({
      collection: safeOptions.collection,
      limit: safeOptions.limit,
      where: safeOptions.where,
      sort: safeOptions.sort,
      depth: safeOptions.depth ?? 0,
      draft: safeOptions.draft,
      overrideAccess: safeOptions.overrideAccess,
      select: safeOptions.select,
    })
  } catch (error) {
    // Handle MongoDB session expiration
    if (error instanceof Error && (error.message?.includes('session') || error.message?.includes('MongoExpiredSession'))) {
      console.warn('MongoDB session expired, retrying query...')
      // Get a fresh payload instance and retry
      const freshPayload = await getPayloadInstance()
      return await freshPayload.find({
        collection: safeOptions.collection,
        limit: safeOptions.limit,
        where: safeOptions.where,
        sort: safeOptions.sort,
        depth: safeOptions.depth ?? 0,
        draft: safeOptions.draft,
        overrideAccess: safeOptions.overrideAccess,
        select: safeOptions.select,
      })
    }
    if (isMongoConnectionError(error)) {
      console.warn('[safePayloadFind] MongoDB unavailable during query. Returning empty result.')
      return emptyFindResult<T>(safeOptions.limit)
    }
    throw error
  }
}

/**
 * Cached wrapper around `safePayloadFind` for public pages.
 *
 * Notes:
 * - The caller must provide a stable `cacheKeyParts` array (no random/Date).
 * - Use `tags` to support on-demand revalidation when content updates.
 * - Use `revalidate` as a safety net for eventual consistency.
 */
export async function safePayloadFindCached<T = any>(args: {
  cacheKeyParts: string[]
  tags: string[]
  revalidate?: number
  options: Parameters<typeof safePayloadFind<T>>[0]
}): Promise<Awaited<ReturnType<typeof safePayloadFind<T>>>> {
  const { cacheKeyParts, tags, revalidate, options } = args
  try {
    return await unstable_cache(() => safePayloadFind<T>(options), cacheKeyParts, {
      tags,
      ...(typeof revalidate === 'number' ? { revalidate } : {}),
    })()
  } catch (error) {
    if (isMongoConnectionError(error)) {
      console.warn('[safePayloadFindCached] Cache read/revalidate failed due to MongoDB connectivity. Falling back to uncached query.')
      return safePayloadFind<T>(options)
    }
    throw error
  }
}
