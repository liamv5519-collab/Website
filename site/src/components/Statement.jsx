import { useEffect, useRef } from 'react'
import { assets } from '../assets'
import { statement } from '../content'
import { gsap } from '../lib/motion'

// Pinned manifesto: each word brightens as you read down the page while the
// moon rises slowly behind the type.
export default function Statement() {
  const root = useRef(null)
  const words = statement.split(' ')

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px)', () => {
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: 'top top', end: '+=160%', scrub: 1, pin: true },
          })
          .fromTo('.st-word', { opacity: 0.12 }, { opacity: 1, stagger: 0.12, ease: 'none' }, 0)
          .fromTo('.st-moon', { yPercent: 60, scale: 0.86 }, { yPercent: -18, scale: 1, ease: 'none', duration: 3.2 }, 0)
          .fromTo('.st-rule', { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1.4 }, 0.6)
      })
      mm.add('(max-width: 767px)', () => {
        gsap.fromTo(
          '.st-word',
          { opacity: 0.15 },
          { opacity: 1, stagger: 0.05, scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom 60%', scrub: 1 } },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink py-32">
      <img
        src={assets.moon.src}
        alt=""
        aria-hidden
        loading="lazy"
        className="st-moon pointer-events-none absolute right-[-12vw] top-[10vh] w-[min(40vw,600px)] opacity-60 mix-blend-screen"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_30%,rgba(223,227,236,0.07),transparent_55%)]" />
      <div className="relative mx-auto w-full max-w-[1440px] px-6 md:px-12">
        <p className="eyebrow mb-10">Why towers</p>
        <p className="display relative max-w-[980px] text-[clamp(2.2rem,4.4vw,4.6rem)] leading-[1.08] text-moon">
          {words.map((w, i) => (
            <span key={i} className={`st-word ${/towers|light|floor\./.test(w) ? 'italic text-gold-soft' : ''}`}>
              {w}{' '}
            </span>
          ))}
        </p>
        <div className="st-rule mt-14 h-px w-full max-w-[1080px] origin-left bg-gradient-to-r from-gold/70 via-moon/15 to-transparent" />
      </div>
    </section>
  )
}
