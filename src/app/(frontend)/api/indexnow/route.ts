import { NextResponse } from 'next/server'

import { bilingualPaths } from '../../../lib/seo/sitemapLocales'
import { submitIndexNow } from '../../../lib/seo/indexnow'
import { getServerSideURL } from '../../../utilities/getURL'

export const dynamic = 'force-dynamic'

const CORE_PATHS = [
  '/',
  '/about',
  '/services',
  '/products',
  '/contact',
  '/posts',
  '/careers',
  '/company-profile',
]

export async function GET() {
  const siteUrl = getServerSideURL()
  const urls = CORE_PATHS.flatMap((path) => bilingualPaths(path, siteUrl))
  const result = await submitIndexNow(urls)

  return NextResponse.json({
    ok: result.errors.length === 0,
    submitted: result.submitted,
    errors: result.errors,
    urls,
  })
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { urls?: string[] } | null
  const siteUrl = getServerSideURL()
  const urls =
    body?.urls?.filter((url) => typeof url === 'string' && url.startsWith(siteUrl)) ||
    CORE_PATHS.flatMap((path) => bilingualPaths(path, siteUrl))
  const result = await submitIndexNow(urls)

  return NextResponse.json({
    ok: result.errors.length === 0,
    submitted: result.submitted,
    errors: result.errors,
  })
}
