import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const DEFAULT_OG_IMAGE = '/media/hero-banners/hero-products.webp'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Shamal Technologies is a drone company in Saudi Arabia and an authorized DJI products seller offering drone survey, geospatial solutions, AI applications, and security surveillance systems.',
  images: [
    {
      url: `${getServerSideURL()}${DEFAULT_OG_IMAGE}`,
    },
  ],
  siteName: 'Shamal Technologies',
  title: 'Shamal Technologies',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
