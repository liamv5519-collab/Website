import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export const EASE = 'expo.out'
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null

export function startSmoothScroll() {
  if (lenis || reducedMotion()) return lenis
  lenis = new Lenis({ duration: 1.35, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function scrollTo(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 2.2, offset: 0 })
  else el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })
}

export const lockScroll = (on) => {
  if (lenis && on) lenis.stop()
  if (lenis && !on) lenis.start()
  document.documentElement.style.overflow = on ? 'hidden' : ''
}
