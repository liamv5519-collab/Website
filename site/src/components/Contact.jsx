import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { assets } from '../assets'
import { brand, contact } from '../content'
import { gsap, SCRUB } from '../lib/motion'
import Button from './Button'
import SplitWords from './SplitWords'

const field =
  'w-full border-b border-moon/20 bg-transparent py-3 text-[1rem] text-moon placeholder:text-mist/60 outline-none transition-colors duration-500 focus:border-gold'

// Formspree endpoint: set VITE_FORM_ENDPOINT in the host's environment, or
// fill in contact.formEndpoint in content.js.
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || contact.formEndpoint

export default function Contact() {
  const root = useRef(null)
  const [budget, setBudget] = useState(contact.budgets[1])
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

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
        { xPercent: 260, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: SCRUB } },
      )
      gsap.from('.ct-word', { yPercent: 110, duration: 1.6, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 60%' } })
      gsap.from('.ct-fade', { opacity: 0, y: 40, duration: 1.4, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 55%' } })
    }, root)
    return () => ctx.revert()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    if (!ENDPOINT) {
      setError(contact.errors.notConnected)
      setStatus('error')
      return
    }
    const form = e.currentTarget
    const data = new FormData(form)
    data.set('budget', budget)
    data.set('_subject', `Strategy call — ${data.get('business')}`)
    setStatus('sending')
    setError('')
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      if (!res.ok) {
        const json = await res.json().catch(() => null)
        throw new Error(json?.errors?.map((x) => x.message).join(' ') || contact.errors.failed)
      }
      form.reset()
      setStatus('sent')
    } catch (err) {
      setError(err.message || contact.errors.failed)
      setStatus('error')
    }
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
          <h2 className="display text-[clamp(2.4rem,4.2vw,4.8rem)] text-moon">
            {contact.title.map((l, i) => (
              <span key={i} className="block">
                <SplitWords text={l} wordClass="ct-word" className={i === 1 ? 'accent' : ''} />
              </span>
            ))}
          </h2>
          <p className="ct-fade mt-8 max-w-[440px] leading-relaxed text-moon/75">{contact.body}</p>
          {brand.email && (
            <a href={`mailto:${brand.email}`} className="ct-fade link-draw mt-10 inline-block text-xl text-gold-soft">
              {brand.email}
            </a>
          )}
        </div>

        <div className="ct-fade md:col-span-5 md:col-start-8">
          <div className="relative rounded-[28px] border border-moon/10 bg-ink/80 p-8 md:p-10">
            <AnimatePresence mode="wait">
              {status === 'sent' ? (
                <motion.div
                  key="done"
                  role="status"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="py-16 text-center"
                >
                  <span aria-hidden className="mx-auto mb-8 block h-[9px] w-[9px] rotate-45 bg-gold shadow-[0_0_22px_rgba(201,164,92,0.9)]" />
                  <p className="eyebrow mb-6">{contact.sent.eyebrow}</p>
                  <p className="display text-3xl text-moon">{contact.sent.title}</p>
                  <p className="mx-auto mt-6 max-w-[360px] leading-relaxed text-mist">{contact.sent.body}</p>
                  <button type="button" onClick={() => setStatus('idle')} className="link-draw mt-10 text-[0.8rem] uppercase tracking-[0.2em] text-gold-soft">
                    Send another enquiry
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -20 }} className="space-y-7">
                  {/* Honeypot: hidden from people, filled in by spam bots. */}
                  <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
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
                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <Button type="submit" disabled={status === 'sending'}>
                      {status === 'sending' ? contact.sending : contact.submit}
                    </Button>
                    <AnimatePresence>
                      {status === 'error' && (
                        <motion.p
                          role="alert"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="max-w-[300px] text-[0.85rem] leading-relaxed text-gold-soft"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>
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
