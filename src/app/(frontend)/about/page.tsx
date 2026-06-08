import type { Metadata } from 'next'

import configPromise from '../../../payload.config'
import { getPayload } from 'payload'
import { getCachedGlobal } from '../../../utilities/getGlobals'
import { getServerSideURL } from '../../../utilities/getURL'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Target, TrendingUp, Award, Users, Clock, Building2 } from 'lucide-react'
import { ScrollSection } from '../../../components/sections/ScrollSection'
import { ParallaxElement } from '../../../components/sections/ParallaxElement'
import { ScrollReveal, StaggerReveal, CinematicReveal } from '../../../utilities/animations'
import RichText from '../../../components/RichText'
import { LeadershipSection } from '../../../components/sections/LeadershipSection.client'
import { ClientsSection } from '../../../components/sections/ClientsSection.client'
import { WhyChooseShamalPinnedSection } from '../../../components/sections/WhyChooseShamalPinnedSection.client'
import { AboutHeroSection } from '../../../components/sections/AboutHeroSection.client'
import { VisionMissionCard } from '../../../components/sections/VisionMissionCard.client'
import { CertificationsSection } from '../../../components/sections/CertificationsSection.client'

export const metadata: Metadata = {
  title: 'About Us | Shamal Technologies',
  description:
    'Shamal Technologies is a pioneering provider of drone and geospatial solutions in Saudi Arabia. Learn about our vision, mission, team, and achievements.',
}

export const dynamic = 'force-static'
export const revalidate = 600

type CertItem = {
  id?: string
  name?: string
  nameAr?: string
  description?: string
  descriptionAr?: string
  image?: { id?: string; url?: string | null; filename?: string; alt?: string; width?: number; height?: number; updatedAt?: string } | string | null
}

/** Certification with resolved image URL for reliable display (serializable from server to client). */
export type CertificationWithImageUrl = Omit<CertItem, 'image'> & {
  imageUrl: string | null
  imageAlt: string
}

/** Build absolute image URL from media doc (works for S3 and local /media/). */
function toAbsoluteImageUrl(media: { url?: string | null; filename?: string } | null): string | null {
  if (!media) return null
  const url = media.url ?? (media.filename ? `/media/${media.filename}` : null)
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const base = getServerSideURL()
  return url.startsWith('/') ? `${base}${url}` : `${base}/${url}`
}

function withCacheBuster(
  url: string | null,
  updatedAt?: string | null,
): string | null {
  if (!url) return null
  if (!updatedAt) return url
  const version = new Date(updatedAt).getTime()
  if (!Number.isFinite(version)) return url
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}v=${version}`
}

function getMediaId(
  value:
    | { id?: string | number }
    | string
    | number
    | null
    | undefined,
): string | null {
  if (value == null) return null
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (typeof value === 'object' && value.id != null) return String(value.id)
  return null
}

type LeadershipMemberInput = {
  name?: string
  nameAr?: string
  position?: string
  positionAr?: string
  role?: string
  bio?: string
  bioAr?: string
  image?: {
    id?: string
    url?: string
    filename?: string
    alt?: string
    updatedAt?: string
  } | string | null
  imageWhiteBg?: {
    id?: string
    url?: string
    filename?: string
    alt?: string
    updatedAt?: string
  } | string | null
}

/** Leadership member with resolved processed image URL for reliable display. */
export type LeadershipMemberWithImageUrl = Omit<
  LeadershipMemberInput,
  'image' | 'imageWhiteBg'
> & {
  imageUrl: string | null
  imageAlt: string
}

/** Resolve leadership photos to processed white-background S3 URLs when available. */
async function resolveLeadershipImages(
  payload: Awaited<ReturnType<typeof getPayload>>,
  members: LeadershipMemberInput[] | undefined,
): Promise<LeadershipMemberWithImageUrl[]> {
  if (!members?.length) return []

  const resolved = await Promise.all(
    members.map(async (member): Promise<LeadershipMemberWithImageUrl> => {
      const { image, imageWhiteBg, ...rest } = member
      let imageUrl: string | null = null
      let imageAlt = member.name ?? 'Team member'

      const resolveMedia = async (
        mediaId: string,
      ): Promise<{ url: string | null; alt: string; updatedAt?: string | null }> => {
        try {
          const media = await payload.findByID({
            collection: 'media',
            id: mediaId,
            depth: 0,
          })
          if (media && typeof media === 'object') {
            return {
              url: toAbsoluteImageUrl(media as { url?: string | null; filename?: string }),
              alt: (media as { alt?: string }).alt ?? imageAlt,
              updatedAt: (media as { updatedAt?: string }).updatedAt,
            }
          }
        } catch {
          // leave unresolved
        }
        return { url: null, alt: imageAlt }
      }

      const whiteBgFromField = getMediaId(imageWhiteBg)
      if (whiteBgFromField) {
        const media = await resolveMedia(whiteBgFromField)
        imageUrl = withCacheBuster(media.url, media.updatedAt)
        imageAlt = media.alt
      }

      const originalId = getMediaId(image)
      if (!imageUrl && originalId) {
        try {
          const original = await payload.findByID({
            collection: 'media',
            id: originalId,
            depth: 0,
          })

          if (original && typeof original === 'object') {
            const filename = (original as { filename?: string }).filename ?? ''
            const baseName = filename.replace(/\.[^/.]+$/, '')

            if (baseName) {
              const whiteBgMatches = await payload.find({
                collection: 'media',
                where: {
                  filename: {
                    contains: `${baseName}-white-bg`,
                  },
                },
                sort: '-updatedAt',
                limit: 1,
                depth: 0,
              })

              const matchedWhiteBg = whiteBgMatches.docs[0]
              if (matchedWhiteBg && typeof matchedWhiteBg === 'object') {
                imageUrl = withCacheBuster(
                  toAbsoluteImageUrl(
                    matchedWhiteBg as { url?: string | null; filename?: string },
                  ),
                  (matchedWhiteBg as { updatedAt?: string }).updatedAt,
                )
                imageAlt =
                  (matchedWhiteBg as { alt?: string }).alt ??
                  (original as { alt?: string }).alt ??
                  imageAlt
              }
            }

            if (!imageUrl) {
              imageUrl = withCacheBuster(
                toAbsoluteImageUrl(original as { url?: string | null; filename?: string }),
                (original as { updatedAt?: string }).updatedAt,
              )
              imageAlt = (original as { alt?: string }).alt ?? imageAlt
            }
          }
        } catch {
          // leave imageUrl null
        }
      }

      if (!imageUrl && imageWhiteBg && typeof imageWhiteBg === 'object') {
        imageUrl = withCacheBuster(
          toAbsoluteImageUrl(imageWhiteBg),
          imageWhiteBg.updatedAt,
        )
        if (imageWhiteBg.alt) imageAlt = imageWhiteBg.alt
      }

      if (!imageUrl && image && typeof image === 'object') {
        imageUrl = withCacheBuster(toAbsoluteImageUrl(image), image.updatedAt)
        if (image.alt) imageAlt = image.alt
      }

      return { ...rest, imageUrl, imageAlt }
    }),
  )

  return resolved
}

/** Resolve certification images to guaranteed displayable URLs (fixes GACA/ISO logos not showing). */
async function resolveCertificationImages(
  payload: Awaited<ReturnType<typeof getPayload>>,
  certifications: CertItem[] | undefined,
): Promise<CertificationWithImageUrl[]> {
  if (!certifications?.length) return []
  const resolved = await Promise.all(
    certifications.map(async (cert): Promise<CertificationWithImageUrl> => {
      const { image, ...rest } = cert
      let imageUrl: string | null = null
      let imageAlt = cert.name ?? 'Certification'

      const getMediaId = (): string | null => {
        if (image == null) return null
        if (typeof image === 'string' || typeof image === 'number') return String(image)
        if (typeof image === 'object' && image) return (image as { id?: string }).id ?? null
        return null
      }

      const mediaId = getMediaId()
      if (mediaId) {
        try {
          const media = await payload.findByID({
            collection: 'media',
            id: mediaId,
            depth: 0,
          })
          if (media && typeof media === 'object') {
            imageUrl = toAbsoluteImageUrl(media as { url?: string | null; filename?: string })
            imageAlt = (media as { alt?: string }).alt ?? cert.name ?? 'Certification'
          }
        } catch {
          // leave imageUrl null
        }
      }

      // If we had an object with url/filename but didn't fetch (e.g. no id), build URL from it
      if (!imageUrl && image && typeof image === 'object') {
        const obj = image as { url?: string | null; filename?: string; alt?: string }
        imageUrl = toAbsoluteImageUrl(obj)
        if (obj.alt) imageAlt = obj.alt
      }

      return { ...rest, imageUrl, imageAlt }
    }),
  )
  return resolved
}

export default async function AboutPage() {
  const payload = await getPayload({ config: configPromise })
  
  const aboutContent = (await getCachedGlobal('about-page-content', 4)()) as {
    hero?: {
      badge?: string
      badgeAr?: string
      title?: string
      titleAr?: string
      description?: string
      descriptionAr?: string
      image?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
        mimeType?: string
      } | string | null
      video?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
        mimeType?: string
      } | string | null
    }
    vision?: {
      title?: string
      titleAr?: string
      description?: string
      descriptionAr?: string
      content?: string | any
      contentAr?: string | any
      image?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
        mimeType?: string
      } | string | null
    }
    mission?: {
      title?: string
      titleAr?: string
      description?: string
      descriptionAr?: string
      content?: string | any
      contentAr?: string | any
      image?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
        mimeType?: string
      } | string | null
    }
    certifications?: Array<{
      id?: string
      name?: string
      nameAr?: string
      description?: string
      descriptionAr?: string
      image?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
        width?: number
        height?: number
        updatedAt?: string
      } | null
    }>
    achievements?: Array<{
      title?: string
      description?: string
      value?: string
      icon?: string
    }>
    timeline?: Array<{
      year?: string
      title?: string
      description?: string
    }>
    leadershipSection?: {
      badge?: string
      badgeAr?: string
      title?: string
      titleAr?: string
      description?: string
      descriptionAr?: string
    }
    leadership?: Array<{
      name?: string
      nameAr?: string
      position?: string
      positionAr?: string
      role?: string
      bio?: string
      bioAr?: string
      image?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
      } | string | null
      imageWhiteBg?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
      } | string | null
    }>
    clientsSection?: {
      badge?: string
      badgeAr?: string
      title?: string
      titleAr?: string
      description?: string
      descriptionAr?: string
    }
    clients?: Array<{
      logo?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
      } | string | null
    }>
    testimonials?: Array<{
      name?: string
      image?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
      } | string | null
      review?: string
    }>
    strengths?: Array<{
      title?: string
      description?: string
      icon?: string
    }>
    whyChooseUs?: {
      title?: string
      titleAr?: string
      subtitle?: string
      subtitleAr?: string
      items?: Array<{
        title?: string
        titleAr?: string
        description?: string
        descriptionAr?: string
        content?: string
        contentAr?: string
        image?: {
          id?: string
          url?: string
          filename?: string
          alt?: string
          mimeType?: string
        } | string | null
      }>
    }
  } | null

  const siteSettings = (await getCachedGlobal('site-settings', 2)()) as {
    siteName?: string
    siteDescription?: string
    logo?: {
      url?: string
    }
    contactInfo?: {
      phone?: string
      email?: string
      address?: string
    }
  } | null

  const leadershipMembers = await resolveLeadershipImages(
    payload,
    aboutContent?.leadership ?? undefined,
  )

  // Define sections for scroll indicator
  const sections = [
    { id: 'hero', label: 'Hero' },
    ...(aboutContent?.whyChooseUs?.items && aboutContent.whyChooseUs.items.length > 0
      ? [{ id: 'why-choose-shamal', label: 'Why Choose Shamal' }]
      : [{ id: 'vision-mission', label: 'Vision & Mission' }]),
    ...(aboutContent?.certifications && aboutContent.certifications.length > 0
      ? [{ id: 'certifications', label: 'Certifications' }]
      : []),
    ...(aboutContent?.achievements && aboutContent.achievements.length > 0
      ? [{ id: 'achievements', label: 'Achievements' }]
      : []),
    ...(aboutContent?.timeline && aboutContent.timeline.length > 0
      ? [{ id: 'timeline', label: 'Timeline' }]
      : []),
    ...(aboutContent?.leadership && aboutContent.leadership.length > 0
      ? [{ id: 'leadership', label: 'Leadership' }]
      : []),
    ...(aboutContent?.clients && aboutContent.clients.length > 0
      ? [{ id: 'clients', label: 'Clients' }]
      : []),
    ...(aboutContent?.testimonials && aboutContent.testimonials.length > 0
      ? [{ id: 'testimonials', label: 'Testimonials' }]
      : []),
    ...(aboutContent?.strengths && aboutContent.strengths.length > 0
      ? [{ id: 'strengths', label: 'Strengths' }]
      : []),
  ]

  return (
    <main className="flex flex-col relative">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-logo-blue via-logo-navy to-logo-navy py-12 md:py-16">
        {/* Background Image or Video */}
        <div className="absolute inset-0 z-0">
          {/* Priority 1: Check if hero image exists from CMS */}
          {aboutContent?.hero?.image &&
          typeof aboutContent.hero.image === 'object' &&
          aboutContent.hero.image !== null &&
          (aboutContent.hero.image.url || aboutContent.hero.image.filename) ? (
            <>
              <Image
                src={
                  aboutContent.hero.image.url
                    ? aboutContent.hero.image.url.startsWith('http')
                      ? aboutContent.hero.image.url
                      : aboutContent.hero.image.url.startsWith('/')
                        ? aboutContent.hero.image.url
                        : `/${aboutContent.hero.image.url}`
                    : aboutContent.hero.image.filename
                      ? `/media/${aboutContent.hero.image.filename}`
                      : ''
                }
                alt={aboutContent.hero.image.alt || 'About page hero'}
                fill
                className="object-cover"
                priority
                quality={90}
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/50" />
            </>
          ) : /* Priority 2: Check if hero video exists from CMS */
          aboutContent?.hero?.video &&
            typeof aboutContent.hero.video === 'object' &&
            aboutContent.hero.video !== null &&
            (aboutContent.hero.video.url || aboutContent.hero.video.filename) ? (
            <>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{ minHeight: '100%', minWidth: '100%' }}
              >
                <source
                  src={
                    aboutContent.hero.video.url
                      ? aboutContent.hero.video.url.startsWith('http')
                        ? aboutContent.hero.video.url
                        : aboutContent.hero.video.url.startsWith('/')
                          ? aboutContent.hero.video.url
                          : `/${aboutContent.hero.video.url}`
                      : aboutContent.hero.video.filename
                        ? `/media/${aboutContent.hero.video.filename}`
                        : ''
                  }
                  type={aboutContent.hero.video.mimeType || 'video/mp4'}
                />
                Your browser does not support the video tag.
              </video>
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/50" />
            </>
          ) : (
            <>
              {/* Fallback: use static hero video from public media folder */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{ minHeight: '100%', minWidth: '100%' }}
              >
                <source src="/media/hero-banners/hero-about.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/50" />
            </>
          )}
        </div>
        
        {/* Hero Text */}
        <AboutHeroSection
          title={aboutContent?.hero?.title}
          titleAr={aboutContent?.hero?.titleAr}
          description={aboutContent?.hero?.description}
          descriptionAr={aboutContent?.hero?.descriptionAr}
          badge={aboutContent?.hero?.badge}
          badgeAr={aboutContent?.hero?.badgeAr}
        />
      </section>

      {/* Why Choose Shamal - Pinned Section */}
      {aboutContent?.whyChooseUs?.items && aboutContent.whyChooseUs.items.length > 0 && (
        <div id="why-choose-shamal">
          <WhyChooseShamalPinnedSection
            badge={aboutContent.whyChooseUs.badge}
            badgeAr={aboutContent.whyChooseUs.badgeAr}
            title={aboutContent.whyChooseUs.title || 'Why Choose Shamal'}
            titleAr={aboutContent.whyChooseUs.titleAr}
            subtitle={aboutContent.whyChooseUs.subtitle}
            subtitleAr={aboutContent.whyChooseUs.subtitleAr}
            items={aboutContent.whyChooseUs.items}
          />
        </div>
      )}

      {/* Vision & Mission Section - Fallback if Why Choose Us not available */}
      {(!aboutContent?.whyChooseUs?.items || aboutContent.whyChooseUs.items.length === 0) && (
      <section id="vision-mission" className="relative w-full">
        <ScrollSection id="vision-mission" fullViewport bgVariant="1" parallax>
            <div className="container mx-auto px-4 w-full">
              <ParallaxElement speed={0.3} direction="up">
                <CinematicReveal delay={0.2} duration={1.2}>
                  <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
                    {/* Vision */}
                    {aboutContent?.vision && (
                      <ScrollReveal direction="left" delay={0.3} duration={1}>
                        <VisionMissionCard
                          title={aboutContent.vision.title}
                          titleAr={aboutContent.vision.titleAr}
                          description={aboutContent.vision.description}
                          descriptionAr={aboutContent.vision.descriptionAr}
                          content={aboutContent.vision.content}
                          contentAr={aboutContent.vision.contentAr}
                          image={
                            aboutContent.vision.image &&
                            typeof aboutContent.vision.image === 'object'
                              ? aboutContent.vision.image
                              : null
                          }
                          defaultTitle="Our Vision"
                          icon={<Target className="h-8 w-8 text-logo-blue" />}
                          gradientClass="text-gradient"
                          borderClass="border-logo-blue/30"
                          iconBgClass="bg-logo-blue/10"
                        />
                      </ScrollReveal>
                    )}

                    {/* Mission */}
                    {aboutContent?.mission && (
                      <ScrollReveal direction="right" delay={0.4} duration={1}>
                        <VisionMissionCard
                          title={aboutContent.mission.title}
                          titleAr={aboutContent.mission.titleAr}
                          description={aboutContent.mission.description}
                          descriptionAr={aboutContent.mission.descriptionAr}
                          content={aboutContent.mission.content}
                          contentAr={aboutContent.mission.contentAr}
                          image={
                            aboutContent.mission.image &&
                            typeof aboutContent.mission.image === 'object'
                              ? aboutContent.mission.image
                              : null
                          }
                          defaultTitle="Our Mission"
                          icon={<TrendingUp className="h-8 w-8 text-logo-navy" />}
                          gradientClass="text-gradient"
                          borderClass="border-logo-navy/30"
                          iconBgClass="bg-logo-navy/10"
                        />
                      </ScrollReveal>
                    )}
                  </div>
                </CinematicReveal>
              </ParallaxElement>
            </div>
          </ScrollSection>
      </section>
      )}

      {/* Certifications - images resolved server-side so they always display */}
      {aboutContent?.certifications && aboutContent.certifications.length > 0 && (
        <ScrollSection id="certifications" flexible bgVariant="2" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <StaggerReveal direction="up" delay={0.3} stagger={0.15} duration={0.8}>
                  <CertificationsSection
                    certifications={await resolveCertificationImages(payload, aboutContent.certifications)}
                  />
                </StaggerReveal>
              </CinematicReveal>
            </ParallaxElement>
          </div>
        </ScrollSection>
      )}

      {/* Achievements */}
      {aboutContent?.achievements && aboutContent.achievements.length > 0 && (
        <ScrollSection id="achievements" fullViewport bgVariant="3" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    Milestones
                  </Badge>
                  <h2 className="text-display-large font-display font-bold tracking-tight">
                    <span className="text-gradient">Achievements</span>
                  </h2>
                  <p className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                    Key milestones in our journey
                  </p>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <StaggerReveal direction="up" delay={0.3} stagger={0.15} duration={0.8}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {aboutContent.achievements.map((achievement: any, index: number) => (
                  <Card
                    key={index}
                    className="hover:shadow-2xl transition-all duration-300 border-2 border-logo-blue/20 bg-background/95 backdrop-blur-sm group"
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        {achievement.icon &&
                          typeof achievement.icon === 'object' &&
                          achievement.icon !== null &&
                          (achievement.icon.url || achievement.icon.filename || achievement.icon.id) && (
                            <div className="relative h-20 w-20 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <Image
                                src={
                                  achievement.icon.url ||
                                  (achievement.icon.filename
                                    ? `/media/${achievement.icon.filename}`
                                    : '')
                                }
                                alt={achievement.icon.alt || achievement.title}
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-display font-bold text-logo-navy">
                            {achievement.title}
                          </CardTitle>
                          {achievement.value && (
                            <p className="text-3xl font-geometric font-bold text-logo-blue mt-2">
                              {achievement.value}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {achievement.description && (
                      <CardContent>
                        <CardDescription className="text-base text-logo-blue font-medium">
                          {achievement.description}
                        </CardDescription>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </StaggerReveal>
          </div>
        </ScrollSection>
      )}

      {/* Timeline */}
      {aboutContent?.timeline && aboutContent.timeline.length > 0 && (
        <ScrollSection id="timeline" flexible bgVariant="1" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    History
                  </Badge>
                  <h2 className="text-display-large font-display font-bold tracking-tight">
                    <span className="text-gradient">Company Timeline</span>
                  </h2>
                  <p className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                    Our journey through the years
                  </p>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <div className="max-w-5xl mx-auto">
              <StaggerReveal direction="up" delay={0.3} stagger={0.2} duration={0.8}>
                <div className="space-y-6">
                  {aboutContent.timeline
                    .sort((a: any, b: any) => (b.year || 0) - (a.year || 0))
                    .map((item: any, index: number) => (
                      <Card
                        key={index}
                        className="border-l-4 border-l-logo-blue shadow-xl bg-background/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
                      >
                        <CardHeader>
                          <div className="flex gap-6 md:gap-8 items-start">
                            <div className="flex-shrink-0">
                              <div className="w-24 h-24 bg-gradient-to-br from-logo-blue to-logo-navy text-white rounded-xl flex items-center justify-center font-geometric font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                {item.year}
                              </div>
                            </div>
                            <div className="flex-grow">
                              <CardTitle className="text-2xl md:text-3xl font-display font-bold text-logo-navy mb-3">
                                {item.title}
                              </CardTitle>
                              {item.description && (
                                <CardDescription className="text-base md:text-lg text-logo-blue font-medium leading-relaxed">
                                  {item.description}
                                </CardDescription>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                </div>
              </StaggerReveal>
            </div>
          </div>
        </ScrollSection>
      )}

      {/* Leadership Team */}
      {aboutContent?.leadership && aboutContent.leadership.length > 0 && (
        <ScrollSection id="leadership" fullViewport bgVariant="2" parallax>
          <div className="container mx-auto px-4 w-full">
            <LeadershipSection
              badge={aboutContent?.leadershipSection?.badge}
              badgeAr={aboutContent?.leadershipSection?.badgeAr}
              title={aboutContent?.leadershipSection?.title}
              titleAr={aboutContent?.leadershipSection?.titleAr}
              description={aboutContent?.leadershipSection?.description}
              descriptionAr={aboutContent?.leadershipSection?.descriptionAr}
              members={leadershipMembers}
            />
          </div>
        </ScrollSection>
      )}

      {/* Clients */}
      {aboutContent?.clients && aboutContent.clients.length > 0 && (
        <ScrollSection id="clients" flexible bgVariant="3" parallax>
          <div className="container mx-auto px-4 w-full">
            <ClientsSection
              badge={aboutContent?.clientsSection?.badge}
              badgeAr={aboutContent?.clientsSection?.badgeAr}
              title={aboutContent?.clientsSection?.title}
              titleAr={aboutContent?.clientsSection?.titleAr}
              description={aboutContent?.clientsSection?.description}
              descriptionAr={aboutContent?.clientsSection?.descriptionAr}
              clients={aboutContent.clients as { logo?: { url?: string; filename?: string; alt?: string } | string | null }[]}
            />
          </div>
        </ScrollSection>
      )}

      {/* Testimonials */}
      {aboutContent?.testimonials && aboutContent.testimonials.length > 0 && (
        <ScrollSection id="testimonials" flexible bgVariant="2" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    Testimonials
                  </Badge>
                  <h2 className="text-display-large font-display font-bold tracking-tight">
                    <span className="text-gradient">What Our Clients Say</span>
                  </h2>
                  <p className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                    Trusted feedback from our partners
                  </p>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <StaggerReveal direction="up" delay={0.3} stagger={0.15} duration={0.8}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {aboutContent.testimonials.map((testimonial: any, index: number) => (
                  <Card
                    key={index}
                    className="hover:shadow-2xl transition-all duration-300 border-2 border-logo-blue/20 bg-background/95 backdrop-blur-sm group"
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        {testimonial.image &&
                          typeof testimonial.image === 'object' &&
                          testimonial.image !== null &&
                          (testimonial.image.url || testimonial.image.filename || testimonial.image.id) && (
                            <div className="relative h-16 w-16 flex-shrink-0 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300 border-2 border-logo-blue/20">
                              <Image
                                src={
                                  testimonial.image.url ||
                                  (testimonial.image.filename ? `/media/${testimonial.image.filename}` : '')
                                }
                                alt={testimonial.image.alt || testimonial.name || 'Client'}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        <div className="flex-1">
                          <CardTitle className="text-xl font-display font-bold text-logo-navy">
                            {testimonial.name}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    {testimonial.review && (
                      <CardContent>
                        <CardDescription className="text-base text-logo-blue font-medium leading-relaxed">
                          {testimonial.review}
                        </CardDescription>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </StaggerReveal>
          </div>
        </ScrollSection>
      )}

      {/* Strengths */}
      {aboutContent?.strengths && aboutContent.strengths.length > 0 && (
        <ScrollSection id="strengths" fullViewport bgVariant="gradient" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    Advantages
                  </Badge>
                  <h2 className="text-display-large font-display font-bold tracking-tight">
                    <span className="text-gradient">Our Strengths</span>
                  </h2>
                  <p className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                    What sets us apart
                  </p>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <StaggerReveal direction="up" delay={0.3} stagger={0.15} duration={0.8}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {aboutContent.strengths.map((strength: any, index: number) => (
                  <Card
                    key={index}
                    className="hover:shadow-2xl transition-all duration-300 border-2 border-logo-blue/20 bg-background/95 backdrop-blur-sm group"
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        {strength.icon &&
                          typeof strength.icon === 'object' &&
                          strength.icon !== null &&
                          (strength.icon.url || strength.icon.filename || strength.icon.id) && (
                            <div className="relative h-20 w-20 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <Image
                                src={
                                  strength.icon.url ||
                                  (strength.icon.filename ? `/media/${strength.icon.filename}` : '')
                                }
                                alt={strength.icon.alt || strength.title}
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-display font-bold text-logo-navy">
                            {strength.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    {strength.description && (
                      <CardContent>
                        <CardDescription className="text-base text-logo-blue font-medium leading-relaxed">
                          {strength.description}
                        </CardDescription>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </StaggerReveal>
          </div>
        </ScrollSection>
      )}

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            mainEntity: {
              '@type': 'Organization',
              name: siteSettings?.siteName || 'Shamal Technologies',
              description: aboutContent?.hero?.description || siteSettings?.siteDescription,
            },
          }),
        }}
      />
    </main>
  )
}
