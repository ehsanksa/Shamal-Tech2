/**
 * One-shot: apply SAR list prices + unpublish (draft) selected products.
 * Does NOT delete any products.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

/** Exact DB product name → SAR price from the pricing sheet. */
const PRICE_BY_NAME: Record<string, number> = {
  'D-RTK 3 Multifunctional Station': 8274.5,
  'D-RTK 3 Survey Pole & Tripod Kit': 2074.8,
  'DJI Zenmuse S1 Spotlight': 5876,
  'TB100 Tethered Battery': 8119.8,
  'BS100 Intelligent Battery Station': 6897.8,
  'DJI Matrice 4D Series Battery': 1592.5,
  'D-RTK 3 Relay Fixed Deployment Version': 12517.7,
  'DJI Zenmuse V1 Speaker': 4416.1,
  'DJI Zenmuse H30': 15971.8,
  'DJI Zenmuse L2': 65568.1,
  'DJI Zenmuse L3': 86660.6,
  'DJI Zenmuse P1': 31058.3,
  'DJI AS1 Speaker': 998.4,
  'DJI Mavic 3 Enterprise': 12489.1,
  'Zenmuse H30T Infrared Density Filter': 620.1,
  'DJI Matrice 4 Series Propellers': 114.4,
  'DJI Matrice 4D Series 240W Charging Hub': 366.6,
  'Matrice 400 Dual Gimbal Connector': 1047.8,
  'DJI AL1 Spotlight': 1378,
  'TB65 Intelligent Flight Battery': 5012.8,
  'BS65 Intelligent Battery Station': 5712.2,
  'WB37 Intelligent Battery': 469.3,
  'TB30 Intelligent Flight Battery': 1505.4,
  'M400 2510F Propeller': 171.6,
  'Matrice 400 Third Gimbal Connector': 586.3,
  'DJI Dock 3 Vehicle-Mounted Gimbal Mount': 1326,
  'DJI RC Plus 2 Strap & Stand Kit': 305.5,
  'DJI Mavic 3 Multispectral': 17678.7,
  'DJI Matrice 30T': 23226.33,
  'DJI Zenmuse H30T': 42357.9,
  'DJI Matrice 400 with extended warranty': 28241.28,
  'DJI Dock 3 (Overseas Edition)': 94330.6,
  'DJI Matrice 4D with extended warranty': 15917.94,
  'DJI Matrice 4TD with extended warranty': 22424.27,
}

/** Blue + red highlighted — unpublish only (keep documents). */
const UNPUBLISH_NAMES = [
  'DJI Terra',
  'DJI FlightHub 2',
  'DJI Mavic 3 Intelligent Flight Battery',
  'DJI Mavic 3 Battery Charging Hub',
] as const

async function main() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'products',
    limit: 200,
    depth: 0,
    overrideAccess: true,
  })

  const byName = new Map(result.docs.map((d) => [d.name, d]))

  const missingPrices = Object.keys(PRICE_BY_NAME).filter((n) => !byName.has(n))
  const missingUnpublish = UNPUBLISH_NAMES.filter((n) => !byName.has(n))
  if (missingPrices.length || missingUnpublish.length) {
    console.error('ABORT — names not found in DB:', { missingPrices, missingUnpublish })
    process.exit(1)
  }

  const leftover = result.docs.filter(
    (d) => !(d.name in PRICE_BY_NAME) && !UNPUBLISH_NAMES.includes(d.name as (typeof UNPUBLISH_NAMES)[number]),
  )
  if (leftover.length) {
    console.error(
      'ABORT — unexpected products not in price or unpublish lists:',
      leftover.map((d) => d.name),
    )
    process.exit(1)
  }

  let priced = 0
  let unpublished = 0

  for (const [name, price] of Object.entries(PRICE_BY_NAME)) {
    const doc = byName.get(name)!
    await payload.update({
      collection: 'products',
      id: doc.id,
      data: {
        price,
        _status: 'published',
      },
      draft: false,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    console.log(`PRICE  ${name} → ${price}`)
    priced += 1
  }

  for (const name of UNPUBLISH_NAMES) {
    const doc = byName.get(name)!
    await payload.update({
      collection: 'products',
      id: doc.id,
      data: {
        _status: 'draft',
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    console.log(`DRAFT  ${name} (unpublished, not deleted)`)
    unpublished += 1
  }

  // Verify
  const verify = await payload.find({
    collection: 'products',
    limit: 200,
    depth: 0,
    overrideAccess: true,
  })

  const published = verify.docs.filter((d) => d._status === 'published')
  const drafts = verify.docs.filter((d) => d._status === 'draft')
  const priceMismatches: string[] = []

  for (const doc of published) {
    const expected = PRICE_BY_NAME[doc.name]
    if (expected === undefined) {
      priceMismatches.push(`unexpected published: ${doc.name}`)
      continue
    }
    if (doc.price !== expected) {
      priceMismatches.push(`${doc.name}: got ${doc.price}, expected ${expected}`)
    }
  }

  for (const name of UNPUBLISH_NAMES) {
    const doc = verify.docs.find((d) => d.name === name)
    if (!doc) priceMismatches.push(`missing after update: ${name}`)
    else if (doc._status !== 'draft') priceMismatches.push(`still published: ${name}`)
  }

  console.log('\n--- SUMMARY ---')
  console.log(`Priced (published): ${priced}`)
  console.log(`Unpublished (draft): ${unpublished}`)
  console.log(`Published now: ${published.length}`)
  console.log(`Draft now: ${drafts.length}`)
  console.log(`Total docs (must stay 38): ${verify.docs.length}`)

  if (priceMismatches.length) {
    console.error('VERIFY FAILED:', priceMismatches)
    process.exit(1)
  }

  console.log('VERIFY OK')
  await payload.db.connection?.close()
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
