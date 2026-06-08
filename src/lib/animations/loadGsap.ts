import type gsapCore from 'gsap'
import type { ScrollTrigger as ScrollTriggerPlugin } from 'gsap/ScrollTrigger'

export type GsapBundle = {
  gsap: typeof gsapCore
  ScrollTrigger: typeof ScrollTriggerPlugin
}

let loadPromise: Promise<GsapBundle> | null = null

/** Lazy-load GSAP + ScrollTrigger once per session (keeps them out of the initial JS bundle). */
export function loadGsap(): Promise<GsapBundle> {
  if (!loadPromise) {
    loadPromise = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([gsapMod, stMod]) => {
        const gsap = gsapMod.gsap
        const ScrollTrigger = stMod.ScrollTrigger
        gsap.registerPlugin(ScrollTrigger)
        return { gsap, ScrollTrigger }
      },
    )
  }
  return loadPromise
}
