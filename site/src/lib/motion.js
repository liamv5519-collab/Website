import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export const EASE = 'expo.out'
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// How far scroll-linked animations trail the scrollbar, in seconds. Kept short
// so the page always feels attached to the wheel; scrolling itself is native.
export const SCRUB = 0.25

export function scrollTo(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })
}

export const lockScroll = (on) => {
  document.documentElement.style.overflow = on ? 'hidden' : ''
}
