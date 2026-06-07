import type { Payload } from 'payload'

const COUNTER_ID = 'product-quote'

/** Allocate the next quotation ID (Q-0001, Q-0002, …). Atomic via MongoDB $inc. */
export async function allocateQuotationNumber(payload: Payload): Promise<string> {
  const connection = payload.db.connection
  const db = connection.db
  if (!db) {
    throw new Error('MongoDB connection unavailable for quotation counter')
  }

  const result = await db.collection('quotation-counters').findOneAndUpdate(
    { _id: COUNTER_ID },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' },
  )

  const seq = typeof result?.seq === 'number' ? result.seq : 1
  return `Q-${String(seq).padStart(4, '0')}`
}
