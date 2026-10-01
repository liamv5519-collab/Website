import { useEffect, useRef } from 'react'
import { assets } from '../assets'
import { manifesto } from '../content'
import { gsap } from '../lib/motion'
import SplitWords from './SplitWords'

// The spire, revealed from street level upward, beside the one line we work by.
export default function Manifesto() {
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'center center', scrub: 1.2 } })
        .fromTo('.mf-frame', { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 0 0)' }, { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0 0)', ease: 'none' })
        .fromTo('.mf-img', { scale: 1.35, yPercent: 12 }, { scale: 1.05, yPercent: 0, ease: 'none' }, 0)
      gsap.from('.mf-word', {
        yPercent: 110,
        duration: 1.5,
        stagger: 0.045,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.mf-quote', start: 'top 78%' },
      })
      gsap.from('.mf-by', { opacity: 0, y: 20, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.mf-quote', start: 'top 60%' } })
      gsap.fromTo(
        '.mf-frame',
        { y: 60 },
        { y: -60, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative overflow-hidden bg-ink py-32 md:py-44">
      <div className="mx-auto grid max-w-[1440px] items-center gap-16 px-6 md:grid-cols-12 md:px-12">
        <blockquote className="mf-quote md:col-span-7">
          <span aria-hidden className="display block text-[7rem] leading-none text-gold/60">“</span>
          <p className="display -mt-6 text-[clamp(2.4rem,4.6vw,5rem)] italic leading-[1.06] text-moon">
            <SplitWords text={manifesto.quote} wordClass="mf-word" />
          </p>
          <footer className="mf-by eyebrow mt-10 text-mist">— {manifesto.byline}</footer>
        </blockquote>
        <div className="md:col-span-4 md:col-start-9">
          <div className="mf-frame relative mx-auto aspect-[2/3] w-full max-w-[420px] overflow-hidden">
            <img src={assets.spire.src} alt="The spire under a full moon" loading="lazy" className="mf-img absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 ring-1 ring-inset ring-gold/30 [border-radius:999px_999px_0_0]" />
          </div>
          <p className="mt-5 text-center text-[0.7rem] tracking-[0.08em] text-mist">Fig. 02 — The spire, above the harbour</p>
        </div>
      </div>
    </section>
  )
}
