export type PromoPopupSectionData = {
  id: 'academy' | 'products'
  badge: string
  title: string
  subtitle: string
  imageSrc: string
  imageAlt: string
  imageFit: 'cover' | 'contain'
  ctaLabel: string
  ctaHref: string
}

export type PromoPopupData = {
  enabled: boolean
  showIntervalDays: number
  openDelayMs: number
  sections: PromoPopupSectionData[]
}

export const DEFAULT_PROMO_POPUP: PromoPopupData = {
  enabled: true,
  showIntervalDays: 7,
  openDelayMs: 1200,
  sections: [
    {
      id: 'academy',
      badge: 'Training',
      title: 'SHAMAL ACADEMY',
      subtitle: 'Learn Drone Technology, GIS, LiDAR, Mapping & Surveying',
      imageSrc: '/media/promo/academy-laptop-drone.png',
      imageAlt: 'Laptop mockup showing Shamal Academy training with a drone',
      imageFit: 'cover',
      ctaLabel: 'Join Training Platform',
      ctaHref: '/training',
    },
    {
      id: 'products',
      badge: 'Products',
      title: 'DJI AUTHORIZED SELLER IN KSA',
      subtitle: 'Buy Enterprise Drones, DJI Dock, Payloads & Survey Solutions',
      imageSrc: '/media/promo/dji-enterprise-drone.png',
      imageAlt: 'DJI Enterprise drone available from Shamal Technologies',
      imageFit: 'contain',
      ctaLabel: 'Buy Products Now',
      ctaHref: '/products',
    },
  ],
}
