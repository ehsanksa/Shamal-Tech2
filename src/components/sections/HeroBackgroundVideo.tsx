type HeroBackgroundVideoProps = {
  src: string
  mimeType?: string
}

/**
 * Server-rendered hero background video. Not lazy-loaded — above-the-fold heroes
 * must paint video immediately (no poster/fallback image).
 */
export function HeroBackgroundVideo({
  src,
  mimeType = 'video/mp4',
}: HeroBackgroundVideoProps) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black" aria-hidden="true">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        className="h-full w-full object-cover"
        style={{ minHeight: '100%', minWidth: '100%' }}
      >
        <source src={src} type={mimeType} />
      </video>
    </div>
  )
}
