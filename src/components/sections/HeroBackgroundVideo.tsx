import { LazyHeroBackgroundVideo } from './LazyHeroBackgroundVideo.client'

type HeroBackgroundVideoProps = {
  src: string
  mimeType?: string
  poster?: string
}

/**
 * Server wrapper — delegates to lazy client video for non-blocking hero backgrounds.
 */
export function HeroBackgroundVideo({
  src,
  mimeType = 'video/mp4',
  poster,
}: HeroBackgroundVideoProps) {
  return (
    <LazyHeroBackgroundVideo
      src={src}
      mimeType={mimeType}
      poster={poster ?? '/media/hero-banners/hero-video-poster.webp'}
    />
  )
}
