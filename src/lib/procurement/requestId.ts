import type { Payload } from 'payload'

/** Allocate next Request ID: PROC-2026-000145 */
export async function allocateProcurementRequestId(payload: Payload): Promise<string> {
  const connection = payload.db.connection
  const db = connection.db
  if (!db) {
    throw new Error('MongoDB connection unavailable for procurement request counter')
  }

  const year = new Date().getUTCFullYear()
  const counterId = `procurement-request-${year}`

  const collection = db.collection<{ _id: string; seq: number }>('form-reference-counters')
  const result = await collection.findOneAndUpdate(
    { _id: counterId },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' },
  )

  const seq = typeof result?.seq === 'number' ? result.seq : 1
  return `PROC-${year}-${String(seq).padStart(6, '0')}`
}
