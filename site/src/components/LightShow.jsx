import { useEffect, useRef, useState } from 'react'
import { assets, towerShape } from '../assets'
import { lightShow } from '../content'
import { gsap, SCRUB } from '../lib/motion'
import useMedia from '../hooks/useMedia'
import Button from './Button'
import Sparkles from './Sparkles'

const { services } = lightShow
const OPEN = 1 // timeline units spent opening the slit
const STEP = 1.5 // units per floor
const FIRST = OPEN + 0.2
const OUTRO_AT = FIRST + services.length * STEP
const TOTAL = OUTRO_AT + 1.3
const TOWER_X = 0.615 // spire position in the footage, normalised

/**
 * THE LIGHT SHOW — pinned showpiece.
 *
 * Scroll drives the frame, the floor rail and the copy. The footage inside the
 * frame is an independent muted loop: it is never seeked, scrubbed or paused
 * by scroll position. Service copy is keyed to scroll progress alone, never to
 * video time.
 */
function Stage() {
  const root = useRef(null)
  const video = useRef(null)
  const sparkles = useRef(null)
  const [active, setActive] = useState(-1)
  const activeRef = useRef(-1)

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
        const x = (W - iw) / 2 + TOWER_X * iw
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

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=480%',
          pin: true,
          scrub: SCRUB,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const t = self.progress * TOTAL
            const idx = t < FIRST ? -1 : t >= OUTRO_AT ? services.length : Math.floor((t - FIRST) / STEP)
            if (idx !== activeRef.current) {
              activeRef.current = idx
              setActive(idx)
              if (idx >= 0) {
                sparkles.current?.burst(idx === services.length ? 1600 : 1000)
                gsap.fromTo('.ls-flash', { opacity: 0.22 }, { opacity: 0, duration: 1.1, ease: 'power2.out', overwrite: true })
              }
            }
          },
        },
      })

      // Function-based so the geometry is re-measured on every refresh/resize.
      const from = (fn) => ({
        l: () => fn().l,
        r: () => fn().r,
        t: () => fn().t,
        b: () => fn().b,
        rad: () => fn().rad,
      })

      // Open: slit → full bleed, the intro steps back.
      tl.fromTo(clip, from(slit), { l: 0, r: 0, t: 0, b: 0, rad: 0, duration: OPEN, onUpdate: paint, immediateRender: true }, 0)
        .fromTo('.ls-scale', { scale: 1.16 }, { scale: 1.04, duration: TOTAL }, 0)
        .to('.ls-intro', { opacity: 0, y: -60, duration: OPEN * 0.6 }, OPEN * 0.35)
        .fromTo('.ls-shade', { opacity: 0 }, { opacity: 1, duration: OPEN * 0.8 }, OPEN * 0.3)
        .fromTo('.ls-rail', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4 }, OPEN)
        .fromTo('.ls-count', { opacity: 0 }, { opacity: 1, duration: 0.4 }, OPEN)
        .fromTo('.ls-marker', { y: 0 }, { y: -(services.length - 1) * 52, duration: (services.length - 1) * STEP, ease: 'power1.inOut' }, FIRST + STEP * 0.3)
        .fromTo('.ls-progress', { scaleY: 0 }, { scaleY: 1, duration: services.length * STEP }, FIRST)

      // Floors: each panel floats up out of blur, holds, and lifts away.
      services.forEach((_, i) => {
        const at = FIRST + i * STEP
        const p = `.ls-panel-${i}`
        tl.fromTo(p, { opacity: 0, y: 70, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, ease: 'power2.out' }, at)
        tl.fromTo(`${p} .ls-detail`, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.3 }, at + 0.3)
        tl.to(p, { opacity: 0, y: -70, filter: 'blur(14px)', duration: 0.42, ease: 'power2.in' }, at + STEP - 0.42)
      })

      // Outro: the frame folds back into a card; the whole tower, one team.
      tl.to('.ls-rail, .ls-count', { opacity: 0, duration: 0.3 }, OUTRO_AT)
        .fromTo(clip, { l: 0, r: 0, t: 0, b: 0, rad: 0 }, { ...from(card), duration: 0.9, onUpdate: paint, immediateRender: false }, OUTRO_AT)
        .fromTo('.ls-outro', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, OUTRO_AT + 0.45)
        .to('.ls-shade', { opacity: 0.55, duration: 0.6 }, OUTRO_AT + 0.2)

      paint()
    }, root)
    return () => ctx.revert()
  }, [])

  const floor = Math.min(Math.max(active, 0), services.length - 1)

  return (
    <section id="services" ref={root} className="relative h-[100svh] w-full overflow-hidden bg-ink">
      {/* Frame (clip-path driven by scroll) */}
      <div
        className="ls-frame absolute inset-0 will-change-[clip-path]"
        onPointerDown={() => sparkles.current?.burst(900)}
      >
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
            aria-label="The tower's white lights sparkling at night"
          />
          <Sparkles ref={sparkles} shape={towerShape} aspect={assets.lightShow.aspect} count={560} />
        </div>
        <div className="ls-shade pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,13,0.92)_0%,rgba(5,7,13,0.62)_36%,rgba(5,7,13,0.05)_58%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(5,7,13,0.55))]" />
        <div className="ls-flash pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_62%_40%,rgba(255,255,255,0.9),rgba(255,255,255,0)_55%)] opacity-0 mix-blend-screen" />
      </div>

      {/* Intro — visible beside the slit before the frame opens */}
      <div className="ls-intro pointer-events-none absolute inset-y-0 left-0 flex w-[54%] flex-col justify-center pl-[6vw]">
        <p className="eyebrow mb-8">{lightShow.eyebrow}</p>
        <h2 className="display text-[clamp(3.4rem,7vw,8rem)] text-moon">
          Every floor, <span className="italic text-gold-soft">lit.</span>
        </h2>
        <p className="mt-8 max-w-[380px] text-[0.98rem] leading-relaxed text-mist">{lightShow.intro}</p>
      </div>

      {/* Floor rail: climbs from 01 at street level to 05 at the top */}
      <div className="ls-rail absolute left-[3vw] top-1/2 flex -translate-y-1/2 items-stretch gap-5 opacity-0">
        <div className="relative w-px bg-moon/15">
          <div className="ls-progress absolute inset-x-0 bottom-0 h-full origin-bottom bg-gold" />
        </div>
        <ol className="relative flex flex-col-reverse">
          <li aria-hidden className="ls-marker absolute -left-[26px] bottom-[18px] h-[7px] w-[7px] rotate-45 bg-gold shadow-[0_0_18px_rgba(201,164,92,0.9)]" style={{ height: 7 }} />
          {services.map((s, i) => (
            <li key={s.floor} className="flex h-[52px] items-center gap-3">
              <span className={`font-display text-lg tabular-nums transition-colors duration-700 ${i === floor && active >= 0 ? 'text-gold-soft' : 'text-moon/30'}`}>
                {s.floor}
              </span>
              <span className={`text-[0.62rem] uppercase tracking-[0.24em] transition-colors duration-700 ${i === floor && active >= 0 ? 'text-moon/80' : 'text-moon/20'}`}>
                {s.level}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Service panels */}
      <div className="pointer-events-none absolute inset-y-0 left-[max(19vw,270px)] flex w-[36vw] items-center">
        {services.map((s, i) => (
          <article key={s.floor} className={`ls-panel-${i} absolute inset-x-0 opacity-0`}>
            <p className="eyebrow mb-6">
              Floor {s.floor} <span className="mx-2 text-moon/30">—</span> {s.level}
            </p>
            <h3 className="display text-[clamp(2.6rem,4.4vw,4.9rem)] text-moon">{s.title}</h3>
            <p className="mt-7 max-w-[470px] text-[1.02rem] leading-relaxed text-moon/75">{s.body}</p>
            <p className="ls-detail mt-8 flex max-w-[470px] items-start gap-4 border-t border-moon/10 pt-6 text-[0.92rem] leading-relaxed text-gold-soft/90">
              <span aria-hidden className="mt-[0.55em] h-[6px] w-[6px] shrink-0 rotate-45 bg-gold" />
              {s.detail}
            </p>
          </article>
        ))}
      </div>

      {/* Counter */}
      <div className="ls-count absolute right-[4vw] top-[14vh] text-right opacity-0">
        <p className="eyebrow text-mist">Floor</p>
        <p className="display mt-2 text-6xl tabular-nums text-moon">
          {services[floor].floor}
          <span className="text-2xl text-moon/30"> / 0{services.length}</span>
        </p>
      </div>

      {/* Outro */}
      <div className="ls-outro absolute inset-0 flex flex-col items-center justify-center text-center opacity-0">
        <p className="eyebrow mb-6">Strategy · Creative · Targeting · Funnels · Reporting</p>
        <h3 className="display text-[clamp(2.8rem,5.6vw,6.2rem)] text-moon">
          The whole tower. <span className="italic text-gold-soft">One team.</span>
        </h3>
        <div className="mt-12">
          <Button href="#contact">Start at the foundations</Button>
        </div>
      </div>
    </section>
  )
}

// Small screens: no pin. The loop sits in a card and the floors stack.
function Stacked() {
  const root = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.lsm-item').forEach((el) =>
        gsap.from(el, { opacity: 0, y: 40, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } }),
      )
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section id="services" ref={root} className="bg-ink px-6 py-24">
      <p className="eyebrow mb-6">{lightShow.eyebrow}</p>
      <h2 className="display text-[3.2rem] text-moon">
        Every floor, <span className="italic text-gold-soft">lit.</span>
      </h2>
      <div className="relative mt-10 aspect-[4/5] overflow-hidden rounded-3xl">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '62% 50%' }}
          src={assets.lightShow.src}
          poster={assets.lightShow.poster}
          muted
          loop
          autoPlay
          playsInline
        />
        <Sparkles shape={towerShape} aspect={assets.lightShow.aspect} count={300} objectX={0.62} />
      </div>
      <div className="mt-14 space-y-14">
        {services.map((s) => (
          <article key={s.floor} className="lsm-item border-t border-moon/10 pt-8">
            <p className="eyebrow mb-4">
              Floor {s.floor} — {s.level}
            </p>
            <h3 className="display text-4xl text-moon">{s.title}</h3>
            <p className="mt-5 leading-relaxed text-moon/75">{s.body}</p>
            <p className="mt-5 text-[0.92rem] leading-relaxed text-gold-soft/90">{s.detail}</p>
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
