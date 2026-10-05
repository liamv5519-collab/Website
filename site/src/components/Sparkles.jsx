import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

// Point-in-polygon test (ray casting) in normalised image space.
function inside([x, y], poly) {
  let hit = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit
  }
  return hit
}

// Left and right edge of the outline at height y (normalised image space).
function edgesAt(y, poly) {
  const hits = []
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > y !== yj > y) hits.push(xi + ((y - yi) * (xj - xi)) / (yj - yi))
  }
  return hits.length ? [Math.min(...hits), Math.max(...hits)] : null
}

// Searchlights mounted on the tower's edges and spire. Angles are radians from
// straight up (negative = left); each beam swings around its aim.
function makeBeams(shape, minY, maxY) {
  const h = maxY - minY
  const beams = []
  // Evenly spaced from just under the spire down to the base.
  for (const f of [0.08, 0.22, 0.36, 0.5, 0.64, 0.78, 0.92]) {
    const y = minY + f * h
    const e = edgesAt(y, shape)
    if (!e) continue
    for (const side of [-1, 1]) {
      beams.push({
        x: side < 0 ? e[0] : e[1],
        y,
        aim: side * (0.5 + Math.random() * 0.35),
        swing: 0.3 + Math.random() * 0.2,
        speed: 0.00035 + Math.random() * 0.0003,
        phase: Math.random() * Math.PI * 2,
        spread: 0.03 + Math.random() * 0.012,
      })
    }
  }
  // Two crossing beams from the spire.
  for (const side of [-1, 1]) {
    beams.push({ x: shape[0][0], y: minY + 0.01, aim: side * 0.12, swing: 0.45, speed: 0.0003, phase: side < 0 ? 0 : Math.PI, spread: 0.028 })
  }
  return beams
}

// How far below the waterline the reflections reach (normalised image height).
const REFLECT = 0.17

// A pre-rendered glint: hot white core, soft halo, faint four-point flare.
function makeSprite(size) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const r = size / 2
  const halo = g.createRadialGradient(r, r, 0, r, r, r)
  halo.addColorStop(0, 'rgba(255,255,255,1)')
  halo.addColorStop(0.08, 'rgba(255,255,255,0.95)')
  halo.addColorStop(0.22, 'rgba(225,235,255,0.35)')
  halo.addColorStop(1, 'rgba(200,215,255,0)')
  g.fillStyle = halo
  g.fillRect(0, 0, size, size)
  g.globalCompositeOperation = 'lighter'
  const flare = (w, h) => {
    const lg = g.createLinearGradient(r - w / 2, 0, r + w / 2, 0)
    lg.addColorStop(0, 'rgba(255,255,255,0)')
    lg.addColorStop(0.5, 'rgba(255,255,255,0.55)')
    lg.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = lg
    g.fillRect(r - w / 2, r - h / 2, w, h)
  }
  flare(size, size * 0.035)
  g.save()
  g.translate(r, r)
  g.rotate(Math.PI / 2)
  g.translate(-r, -r)
  flare(size * 0.7, size * 0.03)
  g.restore()
  return c
}

/**
 * Burj-style white strobe lights covering the tower outline: a field of
 * steady embers and hundreds of rapid flashes. With `beams`, moving
 * searchlights swing out from the tower's edges and spire. With `water` (the
 * waterline, normalised image y), the lights shimmer in the water below.
 * Sits over an <img>/<video> with object-fit: cover and reproduces its crop.
 */
const Sparkles = forwardRef(function Sparkles(
  { shape, aspect, count = 1400, intensity = 1, objectX = 0.5, beams = false, water = null, className = '' },
  ref,
) {
  const canvasRef = useRef(null)
  const state = useRef({ intensity, visible: true })

  useEffect(() => {
    state.current.intensity = intensity
  }, [intensity])

  useImperativeHandle(ref, () => ({
    setIntensity(v) {
      state.current.intensity = v
    },
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sprite = makeSprite(64)

    // Scatter lights inside the tower outline; denser toward the shaft centre.
    const xs = shape.map((p) => p[0])
    const ys = shape.map((p) => p[1])
    const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
    const pts = []
    let guard = 0
    while (pts.length < count && guard++ < count * 40) {
      const p = [minX + Math.random() * (maxX - minX), minY + Math.random() * (maxY - minY)]
      if (!inside(p, shape)) continue
      pts.push({
        x: p[0],
        y: p[1],
        next: performance.now() + Math.random() * 1800,
        flashAt: -1e9,
        dur: 70 + Math.random() * 160,
        size: 0.5 + Math.random() * 0.95,
        // every light glows faintly between flashes and shimmers on its own beat
        ember: 0.08 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        rate: 0.004 + Math.random() * 0.01,
      })
    }

    const lights = beams ? makeBeams(shape, minY, maxY) : []

    let W = 0
    let H = 0
    let dpr = 1
    let map = { s: 1, ox: 0, oy: 0 }
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = rect.width
      H = rect.height
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      // object-fit: cover, object-position: <objectX> 50%
      const iw = aspect
      const ih = 1
      const s = Math.max(W / iw, H / ih)
      map = { s, ox: (W - iw * s) * objectX, oy: (H - ih * s) / 2, iw }
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const io = new IntersectionObserver(([e]) => {
      state.current.visible = e.isIntersecting
    })
    io.observe(canvas)

    let raf = 0
    const draw = (now) => {
      raf = requestAnimationFrame(draw)
      if (!state.current.visible) return
      const k = state.current.intensity
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      if (k <= 0.001) return
      ctx.globalCompositeOperation = 'lighter'

      // Tower-relative scale: lights shrink as the viewport shrinks.
      const unit = Math.max(0.7, map.s / 900)

      // Searchlight beams first, so the strobes sit on top of them.
      const len = map.s * 1.3
      for (const b of lights) {
        const x = map.ox + b.x * map.iw * map.s
        const y = map.oy + b.y * map.s
        const ang = b.aim + (reduce ? 0 : Math.sin(now * b.speed + b.phase) * b.swing)
        const dx = Math.sin(ang)
        const dy = -Math.cos(ang)
        const px = -dy
        const py = dx
        // Soft haze around a brighter core reads as a real searchlight.
        const cone = (spread, a0, a1) => {
          const w = Math.tan(spread) * len
          const g = ctx.createLinearGradient(x, y, x + dx * len, y + dy * len)
          g.addColorStop(0, `rgba(255,244,228,${a0 * k})`)
          g.addColorStop(0.4, `rgba(255,236,214,${a1 * k})`)
          g.addColorStop(1, 'rgba(255,230,205,0)')
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.moveTo(x + px * 1.5 * unit, y + py * 1.5 * unit)
          ctx.lineTo(x + dx * len + px * w, y + dy * len + py * w)
          ctx.lineTo(x + dx * len - px * w, y + dy * len - py * w)
          ctx.lineTo(x - px * 1.5 * unit, y - py * 1.5 * unit)
          ctx.fill()
        }
        cone(b.spread * 2.4, 0.075, 0.026)
        cone(b.spread * 1.3, 0.09, 0.03)
        cone(b.spread * 0.55, 0.16, 0.05)
        // the lamp itself
        const sz = 22 * unit
        ctx.globalAlpha = Math.min(1, 0.9 * k)
        ctx.drawImage(sprite, x - sz / 2, y - sz / 2, sz, sz)
        ctx.globalAlpha = 1
      }

      for (const p of pts) {
        if (!reduce && now >= p.next) {
          p.flashAt = now
          p.next = now + 200 + Math.random() * 1100
        }
        const age = now - p.flashAt
        let a = p.ember * (0.55 + 0.45 * Math.sin(now * p.rate + p.phase))
        if (age >= 0 && age < p.dur * 3) {
          // sharp attack, exponential tail — reads as a strobe, not a fade
          a = Math.max(a, age < 30 ? age / 30 : Math.exp(-(age - 30) / p.dur))
        }
        if (reduce) a = p.ember + 0.12
        if (a < 0.02) continue
        const x = map.ox + p.x * map.iw * map.s
        const y = map.oy + p.y * map.s
        const sz = 10 * p.size * unit * (0.6 + a * 0.8)
        ctx.globalAlpha = Math.min(1, a * k)
        ctx.drawImage(sprite, x - sz / 2, y - sz / 2, sz, sz)
        // Mirror the lower lights in the water: dimmer, smeared sideways and
        // wobbling with the ripples, fading with depth.
        if (water !== null && p.y > water - REFLECT) {
          const ry = 2 * water - p.y
          const fall = 1 - (ry - water) / REFLECT
          const wob = reduce ? 0 : Math.sin(now * 0.0025 + p.y * 900) * 2.2 * unit
          ctx.globalAlpha = Math.min(1, a * k * 0.4 * fall)
          ctx.drawImage(sprite, x + wob - sz * 0.8, map.oy + ry * map.s - sz * 0.25, sz * 1.6, sz * 0.5)
        }
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [shape, aspect, count, objectX, beams, water])

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />
})

export default Sparkles
