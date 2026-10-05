import { useEffect, useRef } from 'react'

// Sky band the gulls fly in (normalised image y).
const SKY = [0.1, 0.42]

function spawn(gull, fromLeft, view, now) {
  gull.dir = fromLeft ? 1 : -1
  gull.x = fromLeft ? view[0] - 0.04 : view[1] + 0.04
  gull.y = SKY[0] + Math.random() * (SKY[1] - SKY[0])
  gull.speed = 0.012 + Math.random() * 0.016 // image widths per second
  gull.size = 0.008 + Math.random() * 0.009 // half-span, in image heights
  gull.rate = 0.009 + Math.random() * 0.004 // flap speed
  gull.phase = Math.random() * Math.PI * 2
  gull.bob = Math.random() * Math.PI * 2
  gull.glideUntil = now + Math.random() * 3000
  gull.flapUntil = 0
}

/**
 * Gulls drifting across the sunset — dark silhouettes that flap, glide and
 * bob. Sits over an object-fit: cover image and reproduces its crop.
 */
export default function Gulls({ aspect, objectX = 0.5, count = 7, className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = 0
    let H = 0
    let dpr = 1
    let map = { s: 1, ox: 0, oy: 0, iw: aspect }
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = rect.width
      H = rect.height
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      const s = Math.max(W / aspect, H)
      map = { s, ox: (W - aspect * s) * objectX, oy: (H - s) / 2, iw: aspect }
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Visible horizontal range, in normalised image x.
    const view = () => [-map.ox / (map.iw * map.s), (W - map.ox) / (map.iw * map.s)]

    const start = performance.now()
    const gulls = Array.from({ length: count }, (_, i) => {
      const g = {}
      spawn(g, i % 2 === 0, view(), start)
      const [l, r] = view()
      g.x = l + Math.random() * (r - l) // start already in the sky
      return g
    })

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)

    let raf = 0
    let last = start
    const draw = (now) => {
      raf = requestAnimationFrame(draw)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!visible) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      ctx.strokeStyle = 'rgba(38,24,30,0.82)'
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      const v = view()

      for (const g of gulls) {
        g.x += g.dir * g.speed * dt
        if ((g.dir > 0 && g.x > v[1] + 0.05) || (g.dir < 0 && g.x < v[0] - 0.05)) spawn(g, Math.random() < 0.5, v, now)

        // Alternate bursts of flapping with long glides.
        let flap
        if (now < g.flapUntil) flap = Math.sin(now * g.rate + g.phase)
        else if (now < g.glideUntil) flap = 0.25 + Math.sin(now * 0.0015 + g.bob) * 0.08
        else {
          g.flapUntil = now + 900 + Math.random() * 1400
          g.glideUntil = g.flapUntil + 1800 + Math.random() * 3200
          flap = 0.25
        }

        const x = map.ox + g.x * map.iw * map.s
        const y = map.oy + (g.y + Math.sin(now * 0.0009 + g.bob) * 0.004) * map.s
        const w = g.size * map.s
        const elbow = -w * (0.16 + 0.24 * flap)
        const tip = w * (0.08 - 0.38 * flap)
        ctx.lineWidth = Math.max(1, w * 0.16)
        ctx.beginPath()
        ctx.moveTo(x - w, y + tip)
        ctx.quadraticCurveTo(x - w * 0.45, y + elbow, x, y)
        ctx.quadraticCurveTo(x + w * 0.45, y + elbow, x + w, y + tip)
        ctx.stroke()
      }
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [aspect, objectX, count])

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />
}
