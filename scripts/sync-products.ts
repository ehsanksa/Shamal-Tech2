import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import { seedProducts } from '../src/endpoints/seed/products.js'
import type { PayloadRequest } from 'payload'

async function syncProducts() {
  try {
    console.log('Connecting to database...')
    const payload = await getPayload({ config })

    const req = {
      payload,
      user: null,
      context: { disableRevalidate: true },
      headers: new Headers(),
    } as unknown as PayloadRequest

    console.log('Syncing products from catalog...')
    await seedProducts({ payload, req })

    console.log('✅ Products synced successfully!')
    await payload.db.connection?.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error syncing products:', error)
    process.exit(1)
  }
}

syncProducts()
