import { useEffect, useRef } from 'react'

/**
 * A muted background clip that loops without a visible jump: shortly before
 * each pass ends, a second copy starts from the top and fades in over it.
 * Plays only while on screen. Reduced-motion users get the still `poster`.
 */
export default function LoopVideo({ src, poster, position = '50% 50%', fade = 1.2, label, className = '' }) {
  const root = useRef(null)
  const a = useRef(null)
  const b = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const v = [a.current, b.current]
    const show = (el, on, animate) => {
      el.style.transition = animate ? `opacity ${fade}s linear` : 'none'
      el.style.opacity = on ? '1' : '0'
    }
    let cur = 0
    let swapAt = 0
    let raf = 0

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const A = v[cur]
      const B = v[1 - cur]
      if (swapAt) {
        if (now < swapAt) return
        A.pause()
        show(A, false, false)
        cur = 1 - cur
        swapAt = 0
        return
      }
      if (A.duration && A.duration - A.currentTime < fade) {
        B.currentTime = 0
        B.play().catch(() => {})
        A.style.zIndex = '1'
        B.style.zIndex = '2'
        show(B, true, true)
        swapAt = now + fade * 1000
      }
    }

    // First pass fades in over the poster once it is actually playing.
    const first = () => {
      show(v[0], true, true)
      v[1].preload = 'auto' // warm the second copy (served from cache)
    }
    v[0].addEventListener('playing', first, { once: true })

    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf)
      if (e.isIntersecting) {
        v[cur].play().catch(() => {})
        if (swapAt) v[1 - cur].play().catch(() => {})
        raf = requestAnimationFrame(tick)
      } else {
        v.forEach((el) => el.pause())
      }
    })
    io.observe(root.current)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      v[0].removeEventListener('playing', first)
    }
  }, [src, fade])

  const media = 'absolute inset-0 h-full w-full object-cover'
  return (
    <div ref={root} className={`absolute inset-0 ${className}`}>
      {poster && <img src={poster} alt={label || ''} aria-hidden={!label} className={media} style={{ objectPosition: position }} />}
      <video ref={a} className={media} style={{ objectPosition: position, opacity: 0 }} src={src} muted playsInline preload="auto" aria-hidden />
      <video ref={b} className={media} style={{ objectPosition: position, opacity: 0 }} src={src} muted playsInline preload="metadata" aria-hidden />
    </div>
  )
}
