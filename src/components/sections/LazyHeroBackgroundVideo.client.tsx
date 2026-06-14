'use client'

import { LazyBackgroundVideo } from './LazyBackgroundVideo.client'

type LazyHeroBackgroundVideoProps = {
  src: string
  mimeType?: string
  poster?: string
}

export function LazyHeroBackgroundVideo({
  src,
  mimeType = 'video/mp4',
  poster,
}: LazyHeroBackgroundVideoProps) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black" aria-hidden="true">
      <LazyBackgroundVideo
        src={src}
        mimeType={mimeType}
        poster={poster}
        className="h-full w-full object-cover"
      />
    </div>
  )
}
