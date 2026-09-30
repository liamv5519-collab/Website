import { useEffect, useRef } from 'react'
import { assets, towerShape } from '../assets'
import { hero } from '../content'
import { gsap, reducedMotion } from '../lib/motion'
import useMedia from '../hooks/useMedia'
import Button from './Button'
import SplitWords from './SplitWords'
import Sparkles from './Sparkles'

export default function Hero({ ready }) {
  const root = useRef(null)
  const sparkles = useRef(null)
  // On narrow screens, crop toward the tower instead of the centre.
  const focusX = useMedia('(max-width: 767px)') ? 0.64 : 0.5

  // Scroll: the view pushes in toward the tower and the copy lifts away.
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.hero-word', { yPercent: 115 })
      gsap.set('.hero-fade', { opacity: 0, y: 24 })
      gsap.set('.hero-media', { scale: 1.22, filter: 'brightness(0.35)' })

      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1.2 } })
        .to('.hero-zoom', { scale: 1.14, yPercent: 7, ease: 'none' }, 0)
        .to('.hero-copy', { y: -140, opacity: 0, ease: 'none' }, 0)
        .to('.hero-shade', { opacity: 0.75, ease: 'none' }, 0)
    }, root)
    return () => ctx.revert()
  }, [])

  // Intro, once the preloader lifts.
  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .to('.hero-media', { scale: 1, filter: 'brightness(1)', duration: 2.6, ease: 'expo.out' })
        .add(() => sparkles.current?.burst(1400), 0.9)
        .to('.hero-word', { yPercent: 0, duration: 1.6, stagger: 0.07, ease: 'expo.out' }, 0.35)
        .to('.hero-fade', { opacity: 1, y: 0, duration: 1.4, stagger: 0.12, ease: 'expo.out' }, 1.0)
    }, root)
    return () => ctx.revert()
  }, [ready])

  // Pointer: the photograph drifts against the cursor, the copy with it.
  useEffect(() => {
    if (reducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    const mx = gsap.quickTo('.hero-drift', 'x', { duration: 1.6, ease: 'power3.out' })
    const my = gsap.quickTo('.hero-drift', 'y', { duration: 1.6, ease: 'power3.out' })
    const cx = gsap.quickTo('.hero-copy-drift', 'x', { duration: 1.8, ease: 'power3.out' })
    const move = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      mx(nx * -26)
      my(ny * -16)
      cx(nx * 10)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  // Burst of light up the tower whenever the pointer lands on it.
  const onTower = () => sparkles.current?.burst(1100)

  return (
    <section id="top" ref={root} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink">
      <div className="hero-zoom absolute inset-0 will-change-transform">
        <div className="hero-drift absolute -inset-8">
          <div className="hero-media absolute inset-0 will-change-transform">
            <img
              src={assets.hero.src}
              alt="A supertall tower glittering with white lights beside a moonlit harbour"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: `${focusX * 100}% 50%` }}
              fetchPriority="high"
              decoding="async"
            />
            <Sparkles ref={sparkles} shape={towerShape} aspect={assets.hero.w / assets.hero.h} count={460} objectX={focusX} />
            <div
              aria-hidden
              onPointerEnter={onTower}
              className="absolute"
              style={{ left: '56%', width: '12%', top: '6%', height: '66%' }}
            />
          </div>
        </div>
      </div>

      <div aria-hidden className="hero-shade pointer-events-none absolute inset-0 bg-ink opacity-0" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,13,0.78)_0%,rgba(5,7,13,0.35)_42%,rgba(5,7,13,0)_62%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />

      <div className="hero-copy absolute inset-x-0 bottom-[12vh] mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="hero-copy-drift max-w-[760px]">
          <p className="hero-fade eyebrow mb-8">{hero.eyebrow}</p>
          <h1 className="display text-[clamp(3.2rem,7.4vw,8.4rem)] text-moon">
            {hero.title.map((line, i) => (
              <span key={i} className="block">
                <SplitWords text={line} wordClass="hero-word" className={i === 1 ? 'italic text-gold-soft' : ''} />
              </span>
            ))}
          </h1>
          <p className="hero-fade mt-8 max-w-[520px] text-[1.02rem] leading-relaxed text-moon/75">{hero.body}</p>
          <div className="hero-fade mt-10 flex flex-wrap items-center gap-5">
            <Button href="#contact">{hero.primary}</Button>
            <Button href="#services" variant="ghost">
              {hero.secondary}
            </Button>
          </div>
        </div>
      </div>

      <div className="hero-fade absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
        <span className="eyebrow text-[0.6rem] text-mist">Scroll</span>
        <span className="relative block h-12 w-px overflow-hidden bg-moon/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.4s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-gold" />
        </span>
      </div>
      <p className="hero-fade absolute bottom-8 right-6 hidden text-right text-[0.7rem] leading-relaxed tracking-[0.08em] text-mist md:right-12 md:block">
        Fig. 01 — The tower, harbour side
        <br />
        01:40, full moon
      </p>
    </section>
  )
}
