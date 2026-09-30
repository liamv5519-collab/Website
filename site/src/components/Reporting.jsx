import { useEffect, useRef } from 'react'
import { assets } from '../assets'
import { reporting } from '../content'
import { gsap } from '../lib/motion'

// The aerial view as a slow parallax backdrop; the five numbers that lead
// every report are set like a ledger.
export default function Reporting() {
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.rp-bg',
        { yPercent: -10, scale: 1.15 },
        { yPercent: 10, scale: 1.02, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      gsap.from('.rp-head > *', {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 1.5,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.rp-head', start: 'top 80%' },
      })
      gsap.utils.toArray('.rp-row').forEach((row, i) => {
        gsap.from(row, {
          opacity: 0,
          y: 30,
          duration: 1.3,
          delay: i * 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.rp-table', start: 'top 80%' },
        })
      })
      gsap.from('.rp-line', {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 1.8,
        stagger: 0.1,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: '.rp-table', start: 'top 80%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="reporting" ref={root} className="relative overflow-hidden bg-ink py-32 md:py-48">
      <div className="absolute inset-0">
        <img src={assets.aerial.src} alt="" aria-hidden loading="lazy" className="rp-bg absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#05070d_0%,rgba(5,7,13,0.55)_30%,rgba(5,7,13,0.7)_70%,#05070d_100%)]" />
      </div>

      <div className="relative mx-auto grid max-w-[1440px] gap-16 px-6 md:grid-cols-12 md:px-12">
        <div className="rp-head md:col-span-5">
          <p className="eyebrow mb-8">{reporting.eyebrow}</p>
          <h2 className="display text-[clamp(3rem,5.6vw,6rem)] text-moon">
            The view <span className="italic text-gold-soft">from the top.</span>
          </h2>
          <p className="mt-8 max-w-[420px] leading-relaxed text-moon/75">{reporting.body}</p>
        </div>

        <div className="rp-table md:col-span-7 md:pt-24">
          {reporting.metrics.map((m, i) => (
            <div key={m.key} className="rp-row group relative grid grid-cols-[80px_1fr] gap-6 py-7 md:grid-cols-[120px_220px_1fr] md:items-baseline">
              <span className="rp-line absolute inset-x-0 top-0 h-px bg-moon/15" />
              <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              <span className="font-display text-sm tracking-[0.2em] text-gold transition-[text-shadow] duration-700 group-hover:[text-shadow:0_0_18px_rgba(230,207,151,0.8)]">
                {String(i + 1).padStart(2, '0')} · {m.key}
              </span>
              <span className="display text-[1.9rem] text-moon transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">{m.name}</span>
              <span className="col-span-2 text-[0.95rem] leading-relaxed text-mist md:col-span-1">{m.note}</span>
            </div>
          ))}
          <div className="h-px bg-moon/15" />
        </div>
      </div>
    </section>
  )
}
