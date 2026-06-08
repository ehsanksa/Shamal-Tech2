'use client'

import { LazyBackgroundVideo } from './LazyBackgroundVideo.client'

const HERO_VIDEO_SRC = '/media/hero-banners/hero-video.mp4'
const HERO_POSTER_SRC = '/media/hero-banners/hero-contact.jpg'

export function HomeHeroBackgroundVideo() {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <LazyBackgroundVideo src={HERO_VIDEO_SRC} poster={HERO_POSTER_SRC} />
    </div>
  )
}
