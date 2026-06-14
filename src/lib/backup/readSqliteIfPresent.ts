import fs from 'fs/promises'
import path from 'path'

/**
 * If DATABASE_URL is a file: SQLite URL and the file exists, return its bytes.
 */
export async function readSqliteIfPresent(databaseUrl: string | undefined): Promise<Buffer | null> {
  if (!databaseUrl || !databaseUrl.startsWith('file:')) return null
  const raw = databaseUrl.replace(/^file:/, '').trim()
  const resolved = path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw)
  try {
    return await fs.readFile(resolved)
  } catch {
    return null
  }
}
