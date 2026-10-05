import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { assets, towerShape, towerX } from '../assets'
import { lightShow } from '../content'
import { gsap, SCRUB } from '../lib/motion'
import useMedia from '../hooks/useMedia'
import Button from './Button'
import Sparkles from './Sparkles'

const { services } = lightShow
const OPEN = 1 // timeline units spent opening the slit
const STEP = 1 // units per service
const FIRST = OPEN + 0.15
const OUTRO_AT = FIRST + services.length * STEP
const TOTAL = OUTRO_AT + 1.2

/**
 * THE LIGHT SHOW — pinned showpiece.
 *
 * A slit of light over the tower opens to the full sparkling footage, then the
 * five services sit as one list beside it: scrolling moves the highlight down
 * the list (or click a service to jump to it), and each change sends a sweep of
 * strobe light up the tower.
 *
 * Scroll drives the frame and the copy only. The footage is an independent
 * muted loop: never seeked, scrubbed or paused by scroll position.
 */
function Stage() {
  const root = useRef(null)
  const video = useRef(null)
  const sparkles = useRef(null)
  const trigger = useRef(null)
  const [current, setCurrent] = useState(0)
  const currentRef = useRef(0)

  // Play the loop only while the section is on screen (never seek it).
  useEffect(() => {
    const v = video.current
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), {
      threshold: 0.01,
    })
    io.observe(v)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const frame = root.current.querySelector('.ls-frame')
      const clip = { l: 0, r: 0, t: 0, b: 0, rad: 0 }
      const paint = () =>
        (frame.style.clipPath = `inset(${clip.t}px ${clip.r}px ${clip.b}px ${clip.l}px round ${clip.rad}px)`)

      // Narrow slit centred on the tower as it appears inside the scaled frame.
      const slit = () => {
        const W = window.innerWidth
        const H = window.innerHeight
        const s = Math.max(W / (16 / 9), H)
        const iw = (16 / 9) * s
        const x = (W - iw) / 2 + towerX * iw
        const xs = W / 2 + (x - W / 2) * 1.16
        const w = Math.max(110, W * 0.1)
        return { l: xs - w / 2, r: W - (xs + w / 2), t: H * 0.09, b: H * 0.09, rad: w / 2 }
      }
      const card = () => ({
        l: window.innerWidth * 0.1,
        r: window.innerWidth * 0.1,
        t: window.innerHeight * 0.12,
        b: window.innerHeight * 0.12,
        rad: 28,
      })
      // Function-based so the geometry is re-measured on every refresh/resize.
      const from = (fn) => ({
        l: () => fn().l,
        r: () => fn().r,
        t: () => fn().t,
        b: () => fn().b,
        rad: () => fn().rad,
      })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=420%',
          pin: true,
          scrub: SCRUB,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const t = self.progress * TOTAL
            const idx = Math.min(Math.max(Math.floor((t - FIRST) / STEP), 0), services.length - 1)
            if (idx !== currentRef.current) {
              currentRef.current = idx
              setCurrent(idx)
              sparkles.current?.burst(1000)
            }
          },
        },
      })
      trigger.current = tl.scrollTrigger

      // Open: slit → full bleed, the title steps back and the list arrives.
      tl.fromTo(clip, from(slit), { l: 0, r: 0, t: 0, b: 0, rad: 0, duration: OPEN, onUpdate: paint, immediateRender: true }, 0)
        .fromTo('.ls-scale', { scale: 1.16 }, { scale: 1.04, duration: TOTAL }, 0)
        .to('.ls-intro', { opacity: 0, y: -60, duration: OPEN * 0.6 }, OPEN * 0.3)
        .fromTo('.ls-shade', { opacity: 0 }, { opacity: 1, duration: OPEN * 0.8 }, OPEN * 0.3)
        .fromTo('.ls-index', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.4 }, OPEN * 0.75)
        .fromTo('.ls-bar', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, OPEN * 0.75)
        .fromTo('.ls-progress', { scaleX: 0 }, { scaleX: 1, duration: services.length * STEP }, FIRST)

      // Outro: the frame folds back into a card around the call to action.
      tl.to('.ls-index, .ls-bar', { autoAlpha: 0, y: -30, duration: 0.3 }, OUTRO_AT)
        .fromTo(clip, { l: 0, r: 0, t: 0, b: 0, rad: 0 }, { ...from(card), duration: 0.9, onUpdate: paint, immediateRender: false }, OUTRO_AT)
        .fromTo('.ls-outro', { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, OUTRO_AT + 0.45)
        .to('.ls-shade', { opacity: 0.55, duration: 0.6 }, OUTRO_AT + 0.2)

      paint()
    }, root)
    return () => ctx.revert()
  }, [])

  // Clicking a service scrolls to the middle of its stretch of the pin.
  const jumpTo = (i) => {
    const st = trigger.current
    if (!st) return
    const t = (FIRST + (i + 0.5) * STEP) / TOTAL
    window.scrollTo({ top: st.start + t * (st.end - st.start), behavior: 'smooth' })
  }

  const s = services[current]

  return (
    <section id="services" ref={root} className="relative h-[100svh] w-full overflow-hidden bg-ink">
      {/* Frame (clip-path driven by scroll) */}
      <div className="ls-frame absolute inset-0 will-change-[clip-path]" onPointerDown={() => sparkles.current?.burst(900)}>
        <div className="ls-scale absolute inset-0 will-change-transform">
          <video
            ref={video}
            className="absolute inset-0 h-full w-full object-cover"
            src={assets.lightShow.src}
            poster={assets.lightShow.poster}
            muted
            loop
            autoPlay
            playsInline
            preload="auto"
            aria-label="The tower's white lights flashing at sunset"
          />
          <Sparkles ref={sparkles} shape={towerShape} aspect={assets.lightShow.aspect} count={1150} beams />
        </div>
        <div className="ls-shade pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(15,11,16,0.94)_0%,rgba(15,11,16,0.7)_38%,rgba(15,11,16,0.05)_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(15,11,16,0.55))]" />
      </div>

      {/* Intro — beside the slit before the frame opens */}
      <div className="ls-intro pointer-events-none absolute inset-y-0 left-0 flex w-[54%] flex-col justify-center pl-[6vw]">
        <p className="eyebrow mb-8">{lightShow.eyebrow}</p>
        <h2 className="display text-[clamp(3rem,6vw,6.8rem)] text-moon">
          {lightShow.title[0]} <span className="accent">{lightShow.title[1]}</span>
        </h2>
        <p className="mt-8 max-w-[380px] text-[0.98rem] leading-relaxed text-mist">{lightShow.intro}</p>
      </div>

      {/* The services, one list; the current one is lit */}
      <div className="ls-index invisible absolute inset-y-0 left-[6vw] flex w-[min(46vw,640px)] flex-col justify-center">
        <p className="eyebrow mb-7">{lightShow.eyebrow}</p>
        <ul className="flex flex-col">
          {services.map((item, i) => (
            <li key={item.title}>
              <button
                type="button"
                onClick={() => jumpTo(i)}
                aria-current={i === current ? 'true' : undefined}
                className={`group flex w-full items-center gap-5 py-2 text-left transition-colors duration-500 ${
                  i === current ? 'text-moon' : 'text-moon/30 hover:text-moon/60'
                }`}
              >
                <span
                  aria-hidden
                  className={`h-px shrink-0 bg-gold transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    i === current ? 'w-10' : 'w-3 bg-moon/30 group-hover:w-6'
                  }`}
                />
                <span className="display text-[clamp(1.6rem,2.4vw,2.6rem)] leading-[1.15]">{item.title}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="relative mt-9 min-h-[11rem] max-w-[470px] pl-[3.75rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-[1.02rem] leading-relaxed text-moon/80">{s.body}</p>
              <p className="mt-5 flex items-start gap-3 text-[0.92rem] leading-relaxed text-gold-soft">
                <span aria-hidden className="mt-[0.55em] h-[6px] w-[6px] shrink-0 rotate-45 bg-gold" />
                {s.detail}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress through the five services */}
      <div className="ls-bar invisible absolute inset-x-[6vw] bottom-10 h-px bg-moon/10">
        <div className="ls-progress h-full origin-left bg-gold" />
      </div>

      {/* Outro */}
      <div className="ls-outro invisible absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="eyebrow mb-6">Strategy · Creative · Targeting · Funnels · Reporting</p>
        <h3 className="display text-[clamp(2.4rem,4.6vw,5.2rem)] text-moon">
          {lightShow.outro[0]} <span className="accent">{lightShow.outro[1]}</span>
        </h3>
        <div className="mt-12">
          <Button href="#contact">{lightShow.cta}</Button>
        </div>
      </div>
    </section>
  )
}

// Small screens: no pin. The loop sits in a card and the services stack.
function Stacked() {
  const root = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.lsm-item').forEach((el) =>
        gsap.from(el, { opacity: 0, y: 40, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } }),
      )
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section id="services" ref={root} className="bg-ink px-6 py-24">
      <p className="eyebrow mb-6">{lightShow.eyebrow}</p>
      <h2 className="display text-[2.8rem] text-moon">
        {lightShow.title[0]} <span className="accent">{lightShow.title[1]}</span>
      </h2>
      <div className="relative mt-10 aspect-[4/5] overflow-hidden rounded-3xl">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: `${towerX * 100}% 50%` }}
          src={assets.lightShow.src}
          poster={assets.lightShow.poster}
          muted
          loop
          autoPlay
          playsInline
        />
        <Sparkles shape={towerShape} aspect={assets.lightShow.aspect} count={850} objectX={towerX} beams />
      </div>
      <div className="mt-14 space-y-12">
        {services.map((item) => (
          <article key={item.title} className="lsm-item border-t border-moon/10 pt-8">
            <h3 className="display text-[1.9rem] text-moon">{item.title}</h3>
            <p className="mt-5 leading-relaxed text-moon/75">{item.body}</p>
            <p className="mt-5 text-[0.92rem] leading-relaxed text-gold-soft">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default function LightShow() {
  const desktop = useMedia('(min-width: 900px)')
  return desktop ? <Stage /> : <Stacked />
}
