'use client'

import { LazyBackgroundVideo } from './LazyBackgroundVideo.client'

const HERO_VIDEO_SRC = '/media/hero-banners/hero-video.mp4'
const HERO_POSTER = '/media/hero-banners/hero-video-poster.webp'

export function HomeHeroBackgroundVideo() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black" aria-hidden="true">
      <LazyBackgroundVideo
        src={HERO_VIDEO_SRC}
        poster={HERO_POSTER}
        className="h-full w-full object-cover"
      />
    </div>
  )
}
