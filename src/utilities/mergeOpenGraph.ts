import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const DEFAULT_OG_IMAGE = '/media/hero-banners/hero-products.webp'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'Shamal Technologies — leading drone company in Saudi Arabia. UAV services, drone aerial survey, LiDAR mapping, photogrammetry, and geospatial solutions across KSA.',
  images: [
    {
      url: `${getServerSideURL()}${DEFAULT_OG_IMAGE}`,
    },
  ],
  siteName: 'Shamal Technologies',
  title: 'Shamal Technologies | Drone & Aerial Survey Services in Saudi Arabia',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
