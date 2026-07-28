import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'products',
    limit: 200,
    depth: 0,
    overrideAccess: true,
  })

  for (const doc of result.docs) {
    console.log(
      JSON.stringify({
        id: doc.id,
        name: doc.name,
        slug: doc.slug,
        price: doc.price ?? null,
        status: doc._status,
      }),
    )
  }

  console.log(`\nTOTAL: ${result.docs.length}`)
  await payload.db.connection?.close()
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
