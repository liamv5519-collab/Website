import { useEffect, useRef } from 'react'
import { brand, footer, nav } from '../content'
import { gsap, scrollTo, SCRUB } from '../lib/motion'

const YEAR = new Date().getFullYear()

export default function Footer() {
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ft-mark',
        { yPercent: 40, opacity: 0.2 },
        { yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: SCRUB } },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  const go = (e, href) => {
    e.preventDefault()
    scrollTo(href)
  }

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-moon/10 bg-ink pt-24">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 md:grid-cols-12 md:px-12">
        <p className="display text-3xl leading-snug text-moon/85 md:col-span-5">{footer.line}</p>
        <nav className="flex flex-col gap-3 md:col-span-2 md:col-start-8">
          <span className="eyebrow mb-2 text-mist">Explore</span>
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)} className="link-draw w-fit text-moon/75 hover:text-moon">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-col gap-3 md:col-span-3">
          <span className="eyebrow mb-2 text-mist">Talk to us</span>
          {brand.email ? (
            <a href={`mailto:${brand.email}`} className="link-draw w-fit text-moon/75 hover:text-moon">
              {brand.email}
            </a>
          ) : (
            <a href="#contact" onClick={(e) => go(e, '#contact')} className="link-draw w-fit text-moon/75 hover:text-moon">
              Book a strategy call
            </a>
          )}
          <a href="#top" onClick={(e) => go(e, '#top')} className="link-draw mt-6 w-fit text-[0.75rem] uppercase tracking-[0.2em] text-gold-soft">
            Back to the top ↑
          </a>
        </div>
      </div>

      <div className="relative mt-20 overflow-hidden pb-[3vw]">
        <p
          aria-hidden
          className="ft-mark display select-none whitespace-nowrap text-center text-[25vw] leading-[0.9] tracking-[-0.03em]"
          style={{
            color: 'transparent',
            WebkitTextStroke: '1px rgba(201,164,92,0.5)',
            backgroundImage: 'linear-gradient(180deg, rgba(201,164,92,0.28), rgba(5,7,13,0) 80%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }}
        >
          Bridge
        </p>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 border-t border-moon/10 px-6 py-8 text-[0.72rem] leading-relaxed text-mist md:flex-row md:justify-between md:px-12">
        <span>© {YEAR} {brand.name}. All rights reserved.</span>
        <span className="max-w-[640px] md:text-right">{footer.legal}</span>
      </div>
    </footer>
  )
}
