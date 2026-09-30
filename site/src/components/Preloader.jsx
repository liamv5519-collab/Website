import { useEffect, useRef, useState } from 'react'
import { gsap, lockScroll } from '../lib/motion'
import { assets } from '../assets'

// A gold line rises like the tower going up, the count reaches 100 once the
// master image has decoded, then the curtain lifts.
export default function Preloader({ onDone }) {
  const root = useRef(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    lockScroll(true)
    const img = new Image()
    img.src = assets.hero.src
    const loaded = img.decode().catch(() => {})
    const minTime = new Promise((r) => setTimeout(r, 1900))
    const counter = { v: 0 }

    const ctx = gsap.context(() => {
      gsap.fromTo('.pl-line', { scaleY: 0 }, { scaleY: 1, duration: 1.9, ease: 'power3.inOut' })
      gsap.fromTo('.pl-word', { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: 'expo.out', delay: 0.35 })
      gsap.to(counter, { v: 86, duration: 1.8, ease: 'power2.out', onUpdate: () => setCount(Math.round(counter.v)) })
    }, root)

    let cancelled = false
    Promise.all([loaded, minTime]).then(() => {
      if (cancelled) return
      gsap.to(counter, { v: 100, duration: 0.35, onUpdate: () => setCount(Math.round(counter.v)) })
      gsap
        .timeline({ delay: 0.4 })
        .to(root.current.querySelectorAll('.pl-fade'), { opacity: 0, duration: 0.5 })
        .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 1.3, ease: 'expo.inOut' }, '-=0.1')
        .add(() => {
          lockScroll(false)
          onDone?.()
        }, '-=0.75')
    })
    return () => {
      cancelled = true
      ctx.revert()
    }
  }, [onDone])

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink"
      style={{ clipPath: 'inset(0 0 0% 0)' }}
    >
      <div className="pl-fade flex flex-col items-center">
        <div className="pl-line h-[26vh] w-px origin-bottom bg-gradient-to-t from-gold via-gold-soft to-transparent" />
        <div className="mt-8 overflow-hidden">
          <div className="pl-word display text-5xl text-moon md:text-6xl">Bridge</div>
        </div>
        <div className="eyebrow mt-4 opacity-70">Marketing</div>
      </div>
      <div className="pl-fade absolute bottom-10 right-10 font-display text-7xl font-light tabular-nums text-moon/80">
        {String(count).padStart(3, '0')}
      </div>
      <div className="pl-fade eyebrow absolute bottom-12 left-10 text-mist">Lighting the tower</div>
    </div>
  )
}
