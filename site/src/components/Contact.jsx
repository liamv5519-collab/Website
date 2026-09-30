import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { assets } from '../assets'
import { brand, contact } from '../content'
import { gsap } from '../lib/motion'
import Button from './Button'
import SplitWords from './SplitWords'

const field =
  'w-full border-b border-moon/20 bg-transparent py-3 text-[1rem] text-moon placeholder:text-mist/60 outline-none transition-colors duration-500 focus:border-gold'

export default function Contact() {
  const root = useRef(null)
  const [budget, setBudget] = useState(contact.budgets[1])
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ct-bg',
        { scale: 1.2, yPercent: -6 },
        { scale: 1.02, yPercent: 6, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      // The yacht glides across the marina as you read down the section.
      gsap.fromTo(
        '.ct-yacht',
        { xPercent: -130 },
        { xPercent: 260, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 } },
      )
      gsap.from('.ct-word', { yPercent: 110, duration: 1.6, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 60%' } })
      gsap.from('.ct-fade', { opacity: 0, y: 40, duration: 1.4, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 55%' } })
    }, root)
    return () => ctx.revert()
  }, [])

  const submit = (e) => {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const body = [
      `Name: ${d.get('name')}`,
      `Email: ${d.get('email')}`,
      `Business: ${d.get('business')}`,
      `Website: ${d.get('site') || '—'}`,
      `Monthly ad budget: ${budget}`,
      '',
      d.get('message') || '',
    ].join('\n')
    window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(`Strategy call — ${d.get('business')}`)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <section id="contact" ref={root} className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <img src={assets.marina.src} alt="" aria-hidden loading="lazy" className="ct-bg absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#05070d_0%,rgba(5,7,13,0.35)_28%,rgba(5,7,13,0.55)_65%,#05070d_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,13,0.85)_0%,rgba(5,7,13,0.2)_60%)]" />
      </div>
      <img
        src={assets.yacht.src}
        alt=""
        aria-hidden
        loading="lazy"
        className="ct-yacht pointer-events-none absolute bottom-[9%] left-0 z-[1] w-[min(34vw,520px)] opacity-90 [filter:brightness(0.62)_saturate(0.85)_drop-shadow(0_18px_18px_rgba(0,0,0,0.6))]"
      />

      <div className="relative z-[2] mx-auto grid min-h-[100svh] max-w-[1440px] items-center gap-16 px-6 py-32 md:grid-cols-12 md:px-12">
        <div className="md:col-span-6">
          <p className="ct-fade eyebrow mb-8">{contact.eyebrow}</p>
          <h2 className="display text-[clamp(2.8rem,4.8vw,5.6rem)] text-moon">
            {contact.title.map((l, i) => (
              <span key={i} className="block">
                <SplitWords text={l} wordClass="ct-word" className={i === 1 ? 'italic text-gold-soft' : ''} />
              </span>
            ))}
          </h2>
          <p className="ct-fade mt-8 max-w-[440px] leading-relaxed text-moon/75">{contact.body}</p>
          <a href={`mailto:${brand.email}`} className="ct-fade link-draw mt-10 inline-block font-display text-2xl italic text-gold-soft">
            {brand.email}
          </a>
        </div>

        <div className="ct-fade md:col-span-5 md:col-start-8">
          <div className="relative rounded-[28px] border border-moon/10 bg-ink/45 p-8 backdrop-blur-xl md:p-10">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="py-16 text-center">
                  <p className="eyebrow mb-6">Received</p>
                  <p className="display text-4xl text-moon">Your email is ready to send.</p>
                  <p className="mt-6 text-mist">If your mail app didn’t open, write to us directly at {brand.email}.</p>
                  <button type="button" onClick={() => setSent(false)} className="link-draw mt-10 text-[0.8rem] uppercase tracking-[0.2em] text-gold-soft">
                    Back to the form
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -20 }} className="space-y-7">
                  <div className="grid gap-7 sm:grid-cols-2">
                    <label className="block">
                      <span className="eyebrow text-[0.6rem] text-mist">Your name</span>
                      <input required name="name" autoComplete="name" className={field} placeholder="Jordan Reyes" />
                    </label>
                    <label className="block">
                      <span className="eyebrow text-[0.6rem] text-mist">Email</span>
                      <input required type="email" name="email" autoComplete="email" className={field} placeholder="you@business.com" />
                    </label>
                  </div>
                  <div className="grid gap-7 sm:grid-cols-2">
                    <label className="block">
                      <span className="eyebrow text-[0.6rem] text-mist">Business</span>
                      <input required name="business" autoComplete="organization" className={field} placeholder="Harbour Dental" />
                    </label>
                    <label className="block">
                      <span className="eyebrow text-[0.6rem] text-mist">Website</span>
                      <input name="site" autoComplete="url" className={field} placeholder="harbourdental.com" />
                    </label>
                  </div>
                  <fieldset>
                    <legend className="eyebrow mb-4 text-[0.6rem] text-mist">Monthly ad budget</legend>
                    <div className="flex flex-wrap gap-2">
                      {contact.budgets.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBudget(b)}
                          aria-pressed={budget === b}
                          className={`rounded-full border px-4 py-2 text-[0.78rem] transition-colors duration-500 ${
                            budget === b ? 'border-gold bg-gold text-ink' : 'border-moon/20 text-moon/70 hover:border-gold/60 hover:text-moon'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <label className="block">
                    <span className="eyebrow text-[0.6rem] text-mist">What does a good month look like?</span>
                    <textarea name="message" rows={3} className={`${field} resize-none`} placeholder="Forty booked consultations at under $60 each." />
                  </label>
                  <div className="pt-2">
                    <Button type="submit">{contact.submit}</Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
