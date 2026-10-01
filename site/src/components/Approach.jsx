import { useEffect, useRef } from 'react'
import { assets } from '../assets'
import { approach } from '../content'
import { gsap, SCRUB } from '../lib/motion'

// Pinned horizontal walk through the building: lobby → boardroom → facade →
// penthouse. Each photograph drifts against the track for depth.
export default function Approach() {
  const root = useRef(null)
  const track = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px)', () => {
        const distance = () => track.current.scrollWidth - window.innerWidth
        const move = gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: SCRUB,
            invalidateOnRefresh: true,
          },
        })
        gsap.utils.toArray('.ap-img').forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -9 },
            {
              xPercent: 9,
              ease: 'none',
              scrollTrigger: { trigger: img.parentElement, containerAnimation: move, start: 'left right', end: 'right left', scrub: true },
            },
          )
        })
        gsap.utils.toArray('.ap-text').forEach((el) => {
          gsap.from(el.children, {
            opacity: 0,
            y: 36,
            stagger: 0.08,
            duration: 1.3,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, containerAnimation: move, start: 'left 75%' },
          })
        })
        gsap.fromTo('.ap-bar', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true } })
      })
      mm.add('(max-width: 899px)', () => {
        gsap.utils.toArray('.ap-card').forEach((el) =>
          gsap.from(el, { opacity: 0, y: 50, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } }),
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="approach" ref={root} className="relative overflow-hidden bg-night min-[900px]:h-[100svh]">
      <div ref={track} className="flex h-full flex-col gap-16 px-6 py-24 min-[900px]:w-max min-[900px]:flex-row min-[900px]:items-center min-[900px]:gap-[6vw] min-[900px]:px-[6vw] min-[900px]:py-0">
        <div className="shrink-0 min-[900px]:w-[34vw]">
          <p className="eyebrow mb-8">{approach.eyebrow}</p>
          <h2 className="display text-[clamp(2.6rem,4.8vw,5.4rem)] text-moon">
            How a tower <span className="accent">goes up.</span>
          </h2>
          <p className="mt-8 max-w-[380px] leading-relaxed text-mist">
            Four rooms, in order. Nothing gets built before the plan is signed, and nothing launches before it is tested.
          </p>
        </div>

        {approach.steps.map((s, i) => {
          const img = assets[s.image]
          const tall = img.h > img.w
          return (
            <article key={s.room} className="ap-card flex shrink-0 flex-col gap-8 min-[900px]:flex-row min-[900px]:items-end">
              <div
                className={`relative overflow-hidden rounded-[22px] ${
                  tall ? 'aspect-[4/5] min-[900px]:h-[70vh]' : 'aspect-[16/10] min-[900px]:h-[62vh]'
                }`}
              >
                <img src={img.src} alt={s.room} loading="lazy" decoding="async" className="ap-img absolute inset-0 h-full w-[118%] max-w-none -translate-x-[8%] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                <span className="absolute left-6 top-6 font-display text-2xl text-moon/90">0{i + 1}</span>
              </div>
              <div className="ap-text max-w-[340px] pb-4">
                <p className="eyebrow mb-4 text-mist">
                  {s.room} <span className="text-moon/30">·</span> {s.when}
                </p>
                <h3 className="display text-[2rem] text-moon">{s.title}</h3>
                <p className="mt-5 leading-relaxed text-moon/70">{s.body}</p>
              </div>
            </article>
          )
        })}
        <div className="hidden w-[4vw] shrink-0 min-[900px]:block" />
      </div>
      <div className="absolute inset-x-[6vw] bottom-10 hidden h-px bg-moon/10 min-[900px]:block">
        <div className="ap-bar h-full origin-left bg-gold" />
      </div>
    </section>
  )
}
