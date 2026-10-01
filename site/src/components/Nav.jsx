import { useEffect, useState } from 'react'
import { nav, hero } from '../content'
import { ScrollTrigger, scrollTo } from '../lib/motion'
import Button from './Button'

// Fixed bar that steps out of the way on the way down and returns on the way up.
export default function Nav() {
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        setSolid(self.scroll() > 80)
        setHidden(self.direction === 1 && self.scroll() > 400)
      },
    })
    return () => st.kill()
  }, [])

  const go = (e, href) => {
    e.preventDefault()
    scrollTo(href)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      } ${solid ? 'bg-ink/85' : 'bg-transparent'}`}
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 md:px-12">
        <a href="#top" onClick={(e) => go(e, '#top')} className="flex items-baseline gap-3">
          <svg width="14" height="26" viewBox="0 0 14 26" aria-hidden className="translate-y-[3px]">
            <path d="M7 0 L8.6 11 L10.4 19 L12 26 H2 L3.6 19 L5.4 11 Z" fill="none" stroke="#c9a45c" strokeWidth="1.1" />
          </svg>
          <span className="display text-[1.7rem] text-moon">Bridge</span>
          <span className="eyebrow hidden text-[0.6rem] text-mist sm:inline">Marketing</span>
        </a>
        <nav className="hidden items-center gap-10 md:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)} className="link-draw text-[0.8rem] tracking-[0.12em] text-moon/80 hover:text-moon">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
          <Button href="#contact" className="!h-11 !px-6 !text-[0.68rem]">
            {hero.primary}
          </Button>
        </div>
      </div>
    </header>
  )
}
