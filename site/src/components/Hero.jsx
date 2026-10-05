import { useEffect, useRef } from 'react'
import { assets, towerShape, towerX, waterLine } from '../assets'
import { hero } from '../content'
import { gsap, SCRUB } from '../lib/motion'
import useMedia from '../hooks/useMedia'
import Button from './Button'
import Gulls from './Gulls'
import LoopVideo from './LoopVideo'
import Sparkles from './Sparkles'

export default function Hero() {
  const root = useRef(null)
  // On narrow screens, crop toward the tower instead of the centre.
  const focusX = useMedia('(max-width: 767px)') ? towerX : 0.5

  // Scroll: the view pushes in toward the tower and the copy lifts away.
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: SCRUB } })
        .to('.hero-zoom', { scale: 1.12, yPercent: 6, ease: 'none' }, 0)
        .to('.hero-copy', { y: -120, opacity: 0, ease: 'none' }, 0)
        .to('.hero-shade', { opacity: 0.75, ease: 'none' }, 0)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="top" ref={root} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink">
      <div className="hero-zoom absolute inset-0 will-change-transform">
        <img
          src={assets.hero.src}
          alt="A twisting supertall tower covered in white lights on a beachfront skyline at sunset"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: `${focusX * 100}% 50%` }}
          fetchPriority="high"
          decoding="async"
        />
        {/* The same frame, alive: surf, palms, gulls. Fades in over the still. */}
        <LoopVideo src={assets.lightShow.src} position={`${focusX * 100}% 50%`} />
        <div aria-hidden className="fog pointer-events-none absolute inset-x-0 top-[40%] h-[20%]" />
        <Gulls aspect={assets.hero.w / assets.hero.h} objectX={focusX} />
      </div>

      <div aria-hidden className="hero-shade pointer-events-none absolute inset-0 bg-ink opacity-0" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(15,11,16,0.8)_0%,rgba(15,11,16,0.38)_42%,rgba(15,11,16,0)_62%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[16%] bg-gradient-to-t from-ink to-transparent" />

      {/* Lights sit above the shading so the whole tower, base included, burns bright. */}
      <div aria-hidden className="hero-zoom pointer-events-none absolute inset-0 will-change-transform">
        <Sparkles shape={towerShape} aspect={assets.hero.w / assets.hero.h} count={1300} objectX={focusX} beams water={waterLine} />
      </div>

      <div className="hero-copy absolute inset-x-0 bottom-[12vh] mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="max-w-[780px]">
          <p className="eyebrow mb-8">{hero.eyebrow}</p>
          <h1 className="display text-[clamp(2.7rem,5.8vw,6.6rem)] text-moon">
            <span className="block">{hero.title[0]}</span>
            <span className="accent block">{hero.title[1]}</span>
          </h1>
          <p className="mt-8 max-w-[520px] text-[1.02rem] leading-relaxed text-moon/75">{hero.body}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="#contact">{hero.primary}</Button>
            <Button href="#services" variant="ghost">
              {hero.secondary}
            </Button>
          </div>
        </div>
      </div>

      <p className="absolute bottom-8 right-6 hidden text-right text-[0.7rem] leading-relaxed tracking-[0.08em] text-mist md:right-12 md:block">
        Fig. 01 — The tower, beachfront
        <br />
        19:12, golden hour
      </p>
    </section>
  )
}
