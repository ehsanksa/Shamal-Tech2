import type { Payload } from 'payload'

export type FormReferencePrefix = 'STCF' | 'STQF' | 'STT'

const COUNTER_IDS: Record<FormReferencePrefix, string> = {
  STCF: 'contact-form',
  STQF: 'product-quote',
  STT: 'training-interest',
}

async function migrateLegacyQuoteCounter(
  db: { collection: (name: string) => { findOne: (query: object) => Promise<{ seq?: number } | null>; insertOne: (doc: object) => Promise<unknown> } },
): Promise<void> {
  const counterId = COUNTER_IDS.STQF
  const existing = await db.collection('form-reference-counters').findOne({ _id: counterId })
  if (existing) return

  const legacy = await db.collection('quotation-counters').findOne({ _id: counterId })
  if (legacy && typeof legacy.seq === 'number') {
    await db.collection('form-reference-counters').insertOne({ _id: counterId, seq: legacy.seq })
  }
}

/** Allocate the next sequential reference (e.g. STCF0001). Atomic via MongoDB $inc. */
export async function allocateFormReferenceNumber(
  payload: Payload,
  prefix: FormReferencePrefix,
): Promise<string> {
  const connection = payload.db.connection
  const db = connection.db
  if (!db) {
    throw new Error('MongoDB connection unavailable for form reference counter')
  }

  if (prefix === 'STQF') {
    await migrateLegacyQuoteCounter(db)
  }

  const counterId = COUNTER_IDS[prefix]
  const result = await db.collection('form-reference-counters').findOneAndUpdate(
    { _id: counterId },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' },
  )

  const seq = typeof result?.seq === 'number' ? result.seq : 1
  return `${prefix}${String(seq).padStart(4, '0')}`
}
